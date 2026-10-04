#!/usr/bin/env node
'use strict';
// Isolated diagnostic only: never imported by candidate scoring or acceptance.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const { prepareCompilerSession, compileScratchCandidate } = require('../lib/matching/compiler');
const { loadWorkbenchModel, resolveTarget, canonicalJson } = require('../lib/matching/target_model');
const { classifySource } = require('../lib/source_policy');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'build/late-jump-trace');
const SOURCE_COMMIT = '43d1cdb67ed135879869b5266f01efaaada5e35a';
const SOURCE_TREE = 'bbed133c38a1feffafe941c36b20d3b38ba47a33';
const PRODUCTION_SHA = 'F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6';
const JUMP_SHA = '45860E25B20891170703EB33848B01A6B03AC5D9A6629995E40C3748B1B9E6D8';
const BOOTSTRAP_SHA = '67F92A13C607836C90DF877E93A8D1096F44DC9D4193986C12783D7D3B57E904';
const HOST_CL_SHA = 'FD29EB2CCE4DBB94AB4E238B7F64CF88929ED47097940CC2F87995313F4F0215';
const HOST_LINK_SHA = '818AE071E8E52D9CD7872BF03ADECB794BA5219FD0A4E4553FB7FA9375075B0F';
const DEFAULT_SOURCE = 'C:/Users/Joe/.codex/ob64-phase6-kmc-20260801/clean-d/source/mips-gcc-2.7.2';
const MAX_EVENTS = 200000;
const HOST_CFLAGS = Object.freeze([
  '/nologo',
  '/Od',
  '/Brepro',
  '/D_CRT_SECURE_NO_WARNINGS',
  '/D_CRT_NONSTDC_NO_WARNINGS',
  '/Di386',
  '/DWIN32',
  '/D_WIN32',
  '/D_X86_=1',
  '/DALMOST_STDC',
]);
const HOST_LDFLAGS = Object.freeze(['/nologo', '/SUBSYSTEM:CONSOLE', '/Brepro']);
const LINK_OBJECTS = Object.freeze([
  'c-parse.obj', 'c-lang.obj', 'c-lex.obj', 'c-pragma.obj', 'c-decl.obj',
  'c-typeck.obj', 'c-convert.obj', 'c-aux-info.obj', 'c-common.obj',
  'c-iterate.obj', 'toplev.obj', 'version.obj', 'tree.obj', 'print-tree.obj',
  'stor-layout.obj', 'fold-const.obj', 'function.obj', 'stmt.obj', 'expr.obj',
  'calls.obj', 'expmed.obj', 'explow.obj', 'optabs.obj', 'varasm.obj', 'rtl.obj',
  'print-rtl.obj', 'rtlanal.obj', 'emit-rtl.obj', 'real.obj', 'dbxout.obj',
  'sdbout.obj', 'dwarfout.obj', 'xcoffout.obj', 'integrate.obj', 'jump.obj',
  'cse.obj', 'loop.obj', 'unroll.obj', 'flow.obj', 'stupid.obj', 'combine.obj',
  'regclass.obj', 'local-alloc.obj', 'global.obj', 'reload.obj', 'reload1.obj',
  'caller-save.obj', 'insn-peep.obj', 'reorg.obj', 'sched.obj', 'final.obj',
  'recog.obj', 'reg-stack.obj', 'insn-opinit.obj', 'insn-recog.obj',
  'insn-extract.obj', 'insn-output.obj', 'insn-emit.obj', 'insn-attrtab.obj',
  'mips.obj', 'getpwd.obj', 'convert.obj', 'bc-emit.obj', 'bc-optab.obj',
  'obstack.obj', 'alloca.obj', 'libcmt.lib', 'kernel32.lib',
]);

function sha(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase(); }
function hash(file) { regular(file); return sha(fs.readFileSync(file)); }
function equal(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label} mismatch: ${actual} != ${expected}`);
  return actual;
}
function regular(file) {
  const s = fs.lstatSync(file);
  if (!s.isFile() || s.isSymbolicLink()) throw new Error(`not a regular file: ${file}`);
}
function safePath(file) {
  if (typeof file !== 'string' || !file || /[\x00-\x1f"%!?&|<>^]/.test(file)) throw new Error('unsafe path');
  return path.resolve(file);
}
function inside(file, root = OUT) {
  const absolute = safePath(file);
  const rel = path.relative(path.resolve(root), absolute);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('output path escapes diagnostic root');
  let cursor = absolute;
  while (cursor !== path.dirname(cursor)) {
    if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) throw new Error('symlink/reparse path rejected');
    cursor = path.dirname(cursor);
  }
  return absolute;
}
function write(file, value) {
  inside(file); fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value, null, 2) + '\n');
}
function run(exe, args, cwd) {
  const r = cp.spawnSync(exe, args, { cwd, encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`${exe} exited ${r.status}: ${r.stderr || r.stdout}`);
  return r;
}
function census(root, filter = () => true) {
  const records = {};
  function visit(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      if (name === '.git') continue;
      const file = path.join(dir, name), rel = path.relative(root, file).replace(/\\/g, '/');
      const stat = fs.lstatSync(file);
      if (stat.isSymbolicLink()) throw new Error(`symlink in closure: ${file}`);
      if (stat.isDirectory()) visit(file);
      else if (filter(rel)) records[rel] = hash(file);
    }
  }
  visit(root); return records;
}
function verifyCensus(root, expected, filter = () => true) {
  equal(canonicalJson(census(root, filter)), canonicalJson(expected), 'closure');
}
function origin(source, production) {
  source = fs.realpathSync(safePath(source));
  equal(run('git', ['rev-parse', 'HEAD'], source).stdout.trim(), SOURCE_COMMIT, 'source commit');
  equal(run('git', ['rev-parse', 'HEAD^{tree}'], source).stdout.trim(), SOURCE_TREE, 'source tree');
  equal(run('git', ['status', '--short', '--untracked-files=no'], source).stdout.trim(), '', 'tracked source status');
  equal(hash(path.join(source, 'jump.c')), JUMP_SHA, 'jump.c');
  equal(hash(path.join(source, 'cc1.exe')), PRODUCTION_SHA, 'source cc1');
  equal(hash(production), PRODUCTION_SHA, 'production cc1');
  const bootstrapFile = path.resolve(source, '../../bootstrap-result.json');
  equal(hash(bootstrapFile), BOOTSTRAP_SHA, 'bootstrap');
  const bootstrap = JSON.parse(fs.readFileSync(bootstrapFile));
  equal(bootstrap.status, 'pass', 'bootstrap status');
  equal(bootstrap.compiler.buildCflags, HOST_CFLAGS.join(' '), 'host compile flags');
  equal(bootstrap.compiler.buildLdflags, HOST_LDFLAGS.join(' '), 'host link flags');
  const vcvars = bootstrap.host.tools.find(t => /vcvarsall\.bat$/i.test(t.path));
  equal(hash(vcvars.path), vcvars.sha256, 'vcvarsall');
  return { source, production, bootstrapFile, bootstrapSha256: BOOTSTRAP_SHA, vcvars,
    commit: SOURCE_COMMIT, tree: SOURCE_TREE, files: census(source) };
}

// All actions use fixed arguments. Reject batch metacharacters even within quotes.
function assertHostScript(record) {
  equal(hash(record.path), record.sha256, 'host setup script');
}
function assertHostSelection(expected, actual) {
  equal(canonicalJson(actual), canonicalJson(expected), 'effective host selection');
}
function hostBuild(copy, evidence, commands, name, expectedHost = null) {
  assertHostScript(evidence.vcvars);
  if (expectedHost) checkHost(expectedHost);
  const script = path.join(copy, `trace-${name}.cmd`);
  write(script, ['@echo off', `call "${safePath(evidence.vcvars.path)}" x86`,
    'if errorlevel 1 exit /b %errorlevel%',
    `where cl > trace-cl.txt`, `where link > trace-link.txt`,
    'set INCLUDE > trace-include.txt', 'set LIB > trace-lib.txt',
    ...commands.flatMap(c => [c.join(' '), 'if errorlevel 1 exit /b %errorlevel%']), ''].join('\r\n'));
  const result = cp.spawnSync('cmd.exe', ['/d', '/c', script], { cwd: copy, encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
  write(path.join(copy, `trace-${name}.log`), `${result.stdout || ''}\n${result.stderr || ''}`);
  assertHostScript(evidence.vcvars);
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`host build ${name} exited ${result.status}; see ${copy}/trace-${name}.log`);
  if (expectedHost) {
    assertHostSelection(expectedHost.selection, hostSelection(copy));
    checkHost(expectedHost);
  }
}
const compileJump = ['cl', '-c', '-DCROSS_COMPILE', '-DIN_GCC', ...HOST_CFLAGS, '-I.', '-I.', '-I./config', 'jump.c'];
const linkCompiler = ['link', ...HOST_LDFLAGS, '-out:cc1.exe', ...LINK_OBJECTS];

function hostSelection(copy) {
  const first = f => fs.readFileSync(path.join(copy, f), 'utf8').split(/\r?\n/).find(Boolean).trim();
  const cl = first('trace-cl.txt'), link = first('trace-link.txt');
  const environment = ['include', 'lib'].map(name => {
    const line = fs.readFileSync(path.join(copy, `trace-${name}.txt`), 'utf8').split(/\r?\n/).find(l => l.toLowerCase().startsWith(`${name}=`));
    if (!line) throw new Error(`host ${name} unavailable`);
    return [name, line.slice(line.indexOf('=') + 1)];
  });
  const directories = Object.fromEntries(environment);
  return { cl, link, directories };
}
function hostClosure(copy, vcvars) {
  const selection = hostSelection(copy);
  const { cl, link, directories } = selection;
  // Hash the full include and library search closure, not only a guessed subset.
  const roots = [...new Set([...directories.include.split(';'), ...directories.lib.split(';'), path.dirname(cl), path.dirname(link)].filter(Boolean))];
  const closure = Object.fromEntries(roots.map(root => [root, census(root)]));
  return { cl: { path: cl, sha256: hash(cl) }, link: { path: link, sha256: hash(link) }, environment: directories, selection, vcvars, closure };
}
function checkHost(host) {
  assertHostScript(host.vcvars);
  for (const [root, files] of Object.entries(host.closure)) verifyCensus(root, files);
}
function compareControlProvenance(input) {
  const { comparePeControls, compareCoffControls } = require('./late_jump_provenance');
  equal(sha(input.originalCompiler), PRODUCTION_SHA, 'provenance production compiler');
  equal(input.host.cl.sha256, HOST_CL_SHA, 'serviced diagnostic host cl');
  equal(input.host.link.sha256, HOST_LINK_SHA, 'serviced diagnostic host link');
  return { schemaVersion: 1, scope: 'diagnostic-only-serviced-host-metadata',
    fullExecutableIdentity: { relink: sha(input.relinkCompiler) === PRODUCTION_SHA, rebuilt: sha(input.rebuiltCompiler) === PRODUCTION_SHA },
    relink: comparePeControls(input.originalCompiler, input.relinkCompiler),
    rebuilt: comparePeControls(input.originalCompiler, input.rebuiltCompiler),
    jumpObject: compareCoffControls(input.originalObject, input.rebuiltObject) };
}

const TRACE_SUPPORT = String.raw`
/* Diagnostic-only side stream. Never print RTL or re-evaluate a predicate. */
#include <stdio.h>
#include <stdlib.h>
#ifdef STACK_REGS
#error OB64 late-jump trace is authenticated for the MIPS non-STACK_REGS build
#endif
#ifdef HAVE_cc0
#error OB64 late-jump trace is authenticated for the MIPS non-cc0 build
#endif
static FILE *ob64_lj_file;
static int ob64_lj_initialized, ob64_lj_seq, ob64_lj_call, ob64_lj_iter;
static int ob64_lj_overflow;
static void
ob64_lj_close (void)
{
  if (ob64_lj_file)
    {
      fprintf (ob64_lj_file, "LJ1|%d|%d|%d|end|0|0|%d\n",
               ++ob64_lj_seq, ob64_lj_call, ob64_lj_iter, ob64_lj_overflow);
      if (fclose (ob64_lj_file)) abort ();
      ob64_lj_file = 0;
    }
}
static int
ob64_lj (kind, a, b, value)
     const char *kind;
     rtx a, b;
     int value;
{
  if (!ob64_lj_initialized)
    {
      char *name = getenv ("OB64_LATE_JUMP_TRACE_FILE");
      ob64_lj_initialized = 1;
      if (name && *name)
        {
          ob64_lj_file = fopen (name, "wb");
          if (!ob64_lj_file) abort ();
          if (atexit (ob64_lj_close)) abort ();
          if (!getenv ("OB64_LATE_JUMP_TRACE_NONCE") || !getenv ("OB64_LATE_JUMP_TRACE_INPUT")) abort ();
          fprintf (ob64_lj_file, "LJM1|%s|%s\n", getenv ("OB64_LATE_JUMP_TRACE_NONCE"), getenv ("OB64_LATE_JUMP_TRACE_INPUT"));
          fprintf (ob64_lj_file, "LJ1|0|0|0|begin|0|0|200000\n");
        }
    }
  if (ob64_lj_file && !ob64_lj_overflow)
    {
      if (ob64_lj_seq >= 200000)
        {
          ob64_lj_overflow = 1;
          fprintf (ob64_lj_file, "LJ1|%d|%d|%d|overflow|0|0|1\n",
                   ++ob64_lj_seq, ob64_lj_call, ob64_lj_iter);
        }
      else if (fprintf (ob64_lj_file, "LJ1|%d|%d|%d|%s|%d|%d|%d\n",
                        ++ob64_lj_seq, ob64_lj_call, ob64_lj_iter, kind,
                        a ? INSN_UID (a) : 0, b ? INSN_UID (b) : 0, value) < 0)
        abort ();
    }
  return value;
}
`;

function replaceOne(s, before, after) {
  if (s.split(before).length !== 2) throw new Error(`patch anchor census: ${before.slice(0, 100)}`);
  return s.replace(before, after);
}
function instrumentJump(original) {
  equal(sha(Buffer.from(original)), JUMP_SHA, 'instrumentation original');
  let s = original.replace(/\r\n/g, '\n');
  s = replaceOne(s, '#include "real.h"', '#include "real.h"\n' + TRACE_SUPPORT);
  s = replaceOne(s, '  cross_jump_death_matters = (cross_jump == 2);',
    '  ++ob64_lj_call; ob64_lj_iter = 0;\n'
    + '  ob64_lj ("invoke", f, 0, cross_jump);\n'
    + '  ob64_lj ("reload", 0, 0, reload_completed);\n'
    + '  ob64_lj ("noop", 0, 0, noop_moves);\n'
    + '  ob64_lj ("regscan", 0, 0, after_regscan);\n'
    + '  ob64_lj ("death-inactive-stack-regs-absent", 0, 0, cross_jump == 2);\n'
    + '  cross_jump_death_matters = (cross_jump == 2);');
  const end = s.indexOf('\n/* LOOP_START is a NOTE_INSN_LOOP_BEG');
  let main = s.slice(0, end), rest = s.slice(end);
  main = replaceOne(main, '      return;', '      ob64_lj ("invoke-end", 0, 0, 1);\n      return;');
  main = replaceOne(main, '      changed = 0;', '      ++ob64_lj_iter;\n      ob64_lj ("iteration", 0, 0, first);\n      changed = 0;');
  main = replaceOne(main, '  jump_chain = 0;\n}', '  jump_chain = 0;\n  ob64_lj ("invoke-end", 0, 0, 0);\n}');
  // Wrap existing boolean operands individually. Argument logging only reads UIDs;
  // predicate calls, &&/|| nesting and their short-circuit order are unchanged.
  main = replaceOne(main, 'if (cross_jump && condjump_p (insn))',
    'if (ob64_lj ("conditional-enabled", insn, 0, cross_jump)\n'
    + '                  && ob64_lj ("conditional-predicate", insn, 0, condjump_p (insn)))');
  main = replaceOne(main, 'if (cross_jump && simplejump_p (insn))',
    'if (ob64_lj ("unconditional-enabled", insn, 0, cross_jump)\n'
    + '                  && ob64_lj ("unconditional-predicate", insn, 0, simplejump_p (insn)))');
  main = replaceOne(main, 'if (cross_jump && GET_CODE (PATTERN (insn)) == RETURN)',
    'if (ob64_lj ("return-enabled", insn, 0, cross_jump)\n'
    + '                  && ob64_lj ("return-predicate", insn, 0, GET_CODE (PATTERN (insn)) == RETURN))');
  main = replaceOne(main, 'if (x != 0 && ! jump_back_p (x, insn))',
    'if (ob64_lj ("conditional-opponent-present", insn, x, x != 0)\n'
    + '                      && ! ob64_lj ("conditional-jump-back", insn, x, jump_back_p (x, insn)))');
  main = replaceOne(main, 'if (x != 0)\n\t\t    find_cross_jump',
    'if (ob64_lj ("conditional-pair", insn, x, x != 0))\n\t\t    find_cross_jump');
  main = replaceOne(main, 'if (INSN_UID (JUMP_LABEL (insn)) < max_uid)',
    'if (ob64_lj ("chain-label-range", insn, JUMP_LABEL (insn), INSN_UID (JUMP_LABEL (insn)) < max_uid))');
  main = replaceOne(main, 'if (target != insn\n\t\t\t  && JUMP_LABEL (target) == JUMP_LABEL (insn)\n\t\t\t  /* Ignore TARGET if it\'s deleted.  */\n\t\t\t  && ! INSN_DELETED_P (target))',
    'if (ob64_lj ("chain-distinct", insn, target, target != insn)\n'
    + '                          && ob64_lj ("chain-label-equal", insn, target, JUMP_LABEL (target) == JUMP_LABEL (insn))\n'
    + '                          && ob64_lj ("chain-live", insn, target, ! INSN_DELETED_P (target)))');
  main = replaceOne(main, 'if (target != insn\n\t\t\t&& ! INSN_DELETED_P (target)\n\t\t\t&& GET_CODE (PATTERN (target)) == RETURN)',
    'if (ob64_lj ("return-distinct", insn, target, target != insn)\n'
    + '                        && ob64_lj ("return-live", insn, target, ! INSN_DELETED_P (target))\n'
    + '                        && ob64_lj ("return-kind", insn, target, GET_CODE (PATTERN (target)) == RETURN))');
  // Loop conditions are themselves observations, including skipped later pairs
  // after the first accepted endpoint. Their existing evaluation order remains.
  main = main.replace(/target != 0 && newjpos == 0;/g,
    'ob64_lj ("chain-next-present", insn, target, target != 0) && ob64_lj ("chain-no-winner", insn, target, newjpos == 0);');
  s = main + rest;
  const beginFind = s.indexOf('static void\nfind_cross_jump (e1, e2, minimum, f1, f2)');
  const beginDo = s.indexOf('static void\ndo_cross_jump (insn, newjpos, newlpos)', beginFind);
  if (beginFind < 0 || beginDo < 0) throw new Error('function anchors missing');
  let find = s.slice(beginFind, beginDo);
  find = replaceOne(find, '  *f1 = 0;', '  ob64_lj ("find-begin", e1, e2, minimum);\n  *f1 = 0;');
  find = replaceOne(find, '      if (i1 == 0)\n\tbreak;',
    '      ob64_lj ("compare-pair", i1, i2, minimum);\n'
    + '      if (i1 == 0)\n        { ob64_lj ("stop-stream-one-end", i1, i2, minimum); break; }');
  find = replaceOne(find, 'if (i2 == e1 || i1 == e2)\n\tbreak;',
    'if (i2 == e1 || i1 == e2)\n        { ob64_lj ("stop-overlap", i1, i2, minimum); break; }');
  find = replaceOne(find, '\t  --minimum;\n\t  break;',
    '\t  --minimum;\n          ob64_lj ("credit-label-stop", i1, i2, minimum);\n\t  break;');
  find = replaceOne(find, 'if (i2 == 0 || GET_CODE (i1) != GET_CODE (i2))\n\tbreak;',
    'if (ob64_lj ("stream-two-end", i1, i2, i2 == 0)\n'
    + '          || ob64_lj ("insn-code-different", i1, i2, GET_CODE (i1) != GET_CODE (i2)))\n'
    + '        { ob64_lj ("stop-insn-kind", i1, i2, minimum); break; }');
  find = replaceOne(find, '      p2 = PATTERN (i2);',
    '      p2 = PATTERN (i2);\n      ob64_lj ("pattern-one-code", i1, i2, GET_CODE (p1));\n      ob64_lj ("pattern-two-code", i1, i2, GET_CODE (p2));');
  find = replaceOne(find, '! rtx_equal_p (CALL_INSN_FUNCTION_USAGE (i1),\n\t\t\t    CALL_INSN_FUNCTION_USAGE (i2))',
    '! ob64_lj ("call-usage-equal", i1, i2, rtx_equal_p (CALL_INSN_FUNCTION_USAGE (i1),\n\t\t\t    CALL_INSN_FUNCTION_USAGE (i2)))');
  find = replaceOne(find, 'if (lose  || GET_CODE (p1) != GET_CODE (p2)\n\t  || ! rtx_renumbered_equal_p (p1, p2))',
    'if (ob64_lj ("usage-lose", i1, i2, lose)\n'
    + '          || ob64_lj ("pattern-code-different", i1, i2, GET_CODE (p1) != GET_CODE (p2))\n'
    + '          || ! ob64_lj ("pattern-equal", i1, i2, rtx_renumbered_equal_p (p1, p2)))');
  // Preserve the REG_EQUAL -> REG_EQUIV fallback and constant-only retry exactly.
  const eqs = [
    ['!lose && GET_CODE (p1) == GET_CODE (p2)', '!lose && ob64_lj ("equiv-pattern-code-equal", i1, i2, GET_CODE (p1) == GET_CODE (p2))'],
    ['(equiv1 = find_reg_note (i1, REG_EQUAL, NULL_RTX)) != 0', 'ob64_lj ("equiv-one-equal-note", i1, i2, (equiv1 = find_reg_note (i1, REG_EQUAL, NULL_RTX)) != 0)'],
    ['(equiv1 = find_reg_note (i1, REG_EQUIV, NULL_RTX)) != 0', 'ob64_lj ("equiv-one-equiv-note", i1, i2, (equiv1 = find_reg_note (i1, REG_EQUIV, NULL_RTX)) != 0)'],
    ['(equiv2 = find_reg_note (i2, REG_EQUAL, NULL_RTX)) != 0', 'ob64_lj ("equiv-two-equal-note", i1, i2, (equiv2 = find_reg_note (i2, REG_EQUAL, NULL_RTX)) != 0)'],
    ['(equiv2 = find_reg_note (i2, REG_EQUIV, NULL_RTX)) != 0', 'ob64_lj ("equiv-two-equiv-note", i1, i2, (equiv2 = find_reg_note (i2, REG_EQUIV, NULL_RTX)) != 0)'],
    ['CONSTANT_P (XEXP (equiv1, 0))', 'ob64_lj ("equiv-constant", i1, i2, CONSTANT_P (XEXP (equiv1, 0)))'],
    ['rtx_equal_p (XEXP (equiv1, 0), XEXP (equiv2, 0))', 'ob64_lj ("equiv-values-equal", i1, i2, rtx_equal_p (XEXP (equiv1, 0), XEXP (equiv2, 0)))'],
    ['s1 != 0 && s2 != 0', 'ob64_lj ("equiv-one-set", i1, i2, s1 != 0) && ob64_lj ("equiv-two-set", i1, i2, s2 != 0)'],
    ['rtx_renumbered_equal_p (SET_DEST (s1), SET_DEST (s2))', 'ob64_lj ("equiv-dest-equal", i1, i2, rtx_renumbered_equal_p (SET_DEST (s1), SET_DEST (s2)))'],
    ['if (! rtx_renumbered_equal_p (p1, p2))', 'if (! ob64_lj ("equiv-retry-equal", i1, i2, rtx_renumbered_equal_p (p1, p2)))'],
    ['else if (apply_change_group ())', 'else if (ob64_lj ("equiv-apply", i1, i2, apply_change_group ()))'],
  ];
  for (const [a, b] of eqs) find = replaceOne(find, a, b);
  find = replaceOne(find, 'validate_change (i1, &SET_SRC (s1), XEXP (equiv1, 0), 1);',
    'ob64_lj ("equiv-validate-one", i1, i2, validate_change (i1, &SET_SRC (s1), XEXP (equiv1, 0), 1));');
  find = replaceOne(find, 'validate_change (i2, &SET_SRC (s2), XEXP (equiv2, 0), 1);',
    'ob64_lj ("equiv-validate-two", i1, i2, validate_change (i2, &SET_SRC (s2), XEXP (equiv2, 0), 1));');
  find = replaceOne(find, 'cancel_changes (0);',
    '{ ob64_lj ("equiv-cancel", i1, i2, 0); cancel_changes (0); }');
  find = replaceOne(find, '\t    --minimum;\n\t  break;',
    '\t    { --minimum; ob64_lj ("credit-jump-around", i1, i2, minimum); }\n'
    + '          ob64_lj ("stop-pattern-mismatch", i1, i2, minimum);\n\t  break;');
  find = replaceOne(find, '      if (GET_CODE (p1) != USE && GET_CODE (p1) != CLOBBER)',
    '      ob64_lj ("pattern-win", i1, i2, minimum);\n'
    + '      if (ob64_lj ("not-use", i1, i2, GET_CODE (p1) != USE) && ob64_lj ("not-clobber", i1, i2, GET_CODE (p1) != CLOBBER))');
  find = replaceOne(find, 'last1 = i1, last2 = i2, --minimum;',
    'last1 = i1, last2 = i2, --minimum;\n          ob64_lj ("credit-insn", i1, i2, minimum);');
  find = replaceOne(find, '    *f1 = last1, *f2 = last2;\n}',
    '    *f1 = last1, *f2 = last2;\n  ob64_lj ("find-end", *f1, *f2, minimum);\n}');
  s = s.slice(0, beginFind) + find + s.slice(beginDo);
  const doStart = s.indexOf('static void\ndo_cross_jump (insn, newjpos, newlpos)');
  const doEnd = s.indexOf('\n/* Return the label before INSN', doStart);
  let body = s.slice(doStart, doEnd);
  body = replaceOne(body, 'register rtx label = get_label_before (newlpos);',
    'register rtx label;\n  ob64_lj ("rewrite-begin", newjpos, newlpos, INSN_UID (insn));\n  label = get_label_before (newlpos);');
  body = replaceOne(body, '  /* Make the same jump insn jump to the new point.  */',
    '  ob64_lj ("rewrite-label", insn, label, 0);\n  /* Make the same jump insn jump to the new point.  */');
  body = replaceOne(body, '    redirect_jump (insn, label);',
    '    { ob64_lj ("rewrite-redirect", insn, label, 0); redirect_jump (insn, label); }');
  body = replaceOne(body, '      delete_from_jump_chain (insn);',
    '      ob64_lj ("rewrite-return", insn, label, 0);\n      delete_from_jump_chain (insn);');
  body = replaceOne(body, '\t  remove_note (newlpos, lnote);',
    '\t  { ob64_lj ("rewrite-remove-note", newjpos, newlpos, REG_NOTE_KIND (lnote)); remove_note (newlpos, lnote); }');
  body = replaceOne(body, '      delete_insn (newjpos);',
    '      ob64_lj ("rewrite-delete", newjpos, newlpos, 0);\n      delete_insn (newjpos);');
  body = replaceOne(body, '    }\n}\n', '    }\n  ob64_lj ("rewrite-end", insn, newlpos, 0);\n}\n');
  return s.slice(0, doStart) + body + s.slice(doEnd);
}

const INSTRUMENTATION_ID = sha(Buffer.from(TRACE_SUPPORT + instrumentJump.toString()));

function buildCompiler(evidence) {
  fs.mkdirSync(OUT, { recursive: true });
  const copy = inside(fs.mkdtempSync(path.join(OUT, 'compiler-')));
  const manifestFile = inside(copy + '.json');
  write(manifestFile, { schemaVersion: 1, status: 'incomplete', researchOnly: true, acceptanceEligible: false, copy });
  fs.cpSync(evidence.source, copy, { recursive: true, filter: file => path.basename(file) !== '.git' });
  verifyCensus(copy, evidence.files);
  hostBuild(copy, evidence, [], 'host');
  const host = hostClosure(copy, evidence.vcvars);
  equal(host.cl.sha256, HOST_CL_SHA, 'host compiler before build');
  equal(host.link.sha256, HOST_LINK_SHA, 'host linker before build');
  const originalObject = fs.readFileSync(path.join(copy, 'jump.obj'));
  const originalCompiler = fs.readFileSync(evidence.production);
  hostBuild(copy, evidence, [linkCompiler], 'control-relink', host);
  const relinkCompiler = fs.readFileSync(path.join(copy, 'cc1.exe'));
  const control = inside(path.join(OUT, `control-${path.basename(copy)}/cc1.exe`));
  fs.mkdirSync(path.dirname(control), { recursive: true }); fs.copyFileSync(path.join(copy, 'cc1.exe'), control);
  fs.copyFileSync(path.join(copy, 'jump.obj'), inside(path.join(path.dirname(control), 'original-jump.obj')));
  checkHost(host);
  hostBuild(copy, evidence, [compileJump, linkCompiler], 'control-rebuild', host);
  const rebuiltCompiler = fs.readFileSync(path.join(copy, 'cc1.exe'));
  const rebuiltObject = fs.readFileSync(path.join(copy, 'jump.obj'));
  fs.copyFileSync(path.join(copy, 'cc1.exe'), inside(path.join(path.dirname(control), 'rebuilt-cc1.exe')));
  fs.copyFileSync(path.join(copy, 'jump.obj'), inside(path.join(path.dirname(control), 'rebuilt-jump.obj')));
  // The dedicated comparator must account for every byte of the serviced-host
  // metadata delta. Until it succeeds, no diagnostic compiler is constructed.
  const provenance = compareControlProvenance({ originalCompiler, relinkCompiler, rebuiltCompiler,
    originalObject, rebuiltObject, originalObjectPath: path.join(evidence.source, 'jump.obj'),
    rebuiltObjectPath: path.join(copy, 'jump.obj'), host });
  checkHost(host);
  const patched = instrumentJump(fs.readFileSync(path.join(copy, 'jump.c'), 'utf8'));
  write(path.join(copy, 'jump.c'), patched);
  const patchedSha256 = hash(path.join(copy, 'jump.c'));
  hostBuild(copy, evidence, [compileJump, linkCompiler], 'instrumented', host);
  checkHost(host); verifyCensus(evidence.source, evidence.files);
  equal(hash(evidence.production), PRODUCTION_SHA, 'production after build');
  equal(hash(path.join(copy, 'jump.c')), patchedSha256, 'patch after build');
  const m = { schemaVersion: 1, status: 'built', researchOnly: true, acceptanceEligible: false,
    instrumentationId: INSTRUMENTATION_ID, toolSha256: hash(__filename), origin: evidence,
    flags: { compile: HOST_CFLAGS, link: HOST_LDFLAGS }, commands: { compileJump, linkCompiler },
    host, copy, copyFiles: census(copy), control, controlSha256: hash(control),
    rebuiltControl: path.join(path.dirname(control), 'rebuilt-cc1.exe'),
    controlRelinkSha256: sha(relinkCompiler), controlRebuildSha256: sha(rebuiltCompiler), provenance, patchedSha256,
    manifestFile, executable: path.join(copy, 'cc1.exe'), compilerSha256: hash(path.join(copy, 'cc1.exe')) };
  write(manifestFile, m); return m;
}

const EVENT_KINDS = new Set([...instrumentJump.toString().matchAll(/\\"([a-z][a-z-]+)\\"/g)].map(m => m[1]));
// The transform source has literal strings in single-quoted JavaScript expressions.
for (const m of instrumentJump.toString().matchAll(/"([a-z][a-z-]+)"/g)) EVENT_KINDS.add(m[1]);
for (const kind of ['begin', 'end', 'overflow']) EVENT_KINDS.add(kind);
function eventDomain(r) {
  if (r.a > 2147483647 || r.b > 2147483647 || r.invocation > MAX_EVENTS || r.iteration > MAX_EVENTS) throw new Error('event UID/counter domain');
  const minimum = /^(find-end|compare-pair|pattern-win|credit-|stop-)/.test(r.kind);
  if (minimum) {
    if (r.value < -MAX_EVENTS || r.value > 2) throw new Error('minimum value domain');
  } else if (r.kind === 'begin') {
    if (r.value !== MAX_EVENTS) throw new Error('begin value domain');
  } else if (r.kind === 'find-begin') {
    if (![1, 2].includes(r.value)) throw new Error('find minimum domain');
  } else if (['invoke', 'conditional-enabled', 'unconditional-enabled', 'return-enabled'].includes(r.kind)) {
    if (![0, 1, 2].includes(r.value)) throw new Error('cross-jump value domain');
  } else if (['pattern-one-code', 'pattern-two-code'].includes(r.kind)) {
    // The authenticated rtl.def has exactly 116 DEF_RTL_EXPR entries.
    if (r.value < 0 || r.value >= 116) throw new Error('RTX code domain');
  } else if (r.kind === 'rewrite-begin') {
    if (r.value <= 0 || r.value > 2147483647) throw new Error('rewrite UID domain');
  } else if (r.kind === 'rewrite-remove-note') {
    if (![3, 5].includes(r.value)) throw new Error('REG_EQUIV/REG_EQUAL note domain');
  } else if (r.kind === 'end' || ['rewrite-label', 'rewrite-return', 'rewrite-redirect', 'rewrite-delete', 'rewrite-end', 'equiv-cancel'].includes(r.kind)) {
    if (r.value !== 0) throw new Error('zero sentinel domain');
  } else if (![0, 1].includes(r.value)) throw new Error(`boolean predicate domain: ${r.kind}`);
  if (['begin', 'end', 'overflow', 'reload', 'noop', 'regscan', 'death-inactive-stack-regs-absent', 'iteration', 'invoke-end'].includes(r.kind)
      && (r.a !== 0 || r.b !== 0)) throw new Error('event UID sentinel domain');
}
function parseTrace(text, expected) {
  if (!expected || !/^[A-F0-9]{32}$/.test(expected.nonce) || !/^[A-F0-9]{64}$/.test(expected.inputSha256)) throw new Error('trace identity required');
  if (typeof text !== 'string' || text.length > 24 * 1024 * 1024 || !text.endsWith('\n')) throw new Error('trace truncated or oversized');
  const lines = text.trimEnd().split(/\r?\n/);
  equal(lines.shift(), `LJM1|${expected.nonce}|${expected.inputSha256}`, 'trace nonce/input identity');
  const records = lines.map((line, index) => {
    const parts = line.split('|');
    if (parts.length !== 8 || parts[0] !== 'LJ1' || !EVENT_KINDS.has(parts[4])) throw new Error('malformed trace schema/kind');
    for (const i of [1, 2, 3, 5, 6, 7]) if (!/^(0|-?[1-9][0-9]*)$/.test(parts[i]) || !Number.isSafeInteger(Number(parts[i]))) throw new Error('malformed trace integer');
    const [seq, invocation, iteration, a, b, value] = [1, 2, 3, 5, 6, 7].map(i => Number(parts[i]));
    if (seq !== index || invocation < 0 || iteration < 0 || a < 0 || b < 0 || seq > MAX_EVENTS + 1) throw new Error('trace sequence/bounds');
    const record = { seq, invocation, iteration, kind: parts[4], a, b, value };
    eventDomain(record); return record;
  });
  if (records.length < 9 || records[0].kind !== 'begin' || records[0].value !== MAX_EVENTS
      || records[0].invocation || records[0].iteration || records.at(-1).kind !== 'end' || records.at(-1).value !== 0
      || records.some(r => r.kind === 'overflow')) throw new Error('incomplete/overflow trace');
  let invocation = 0, iteration = 0, open = false, find = false, rewrite = false, lastAccepted = null;
  let minimum = null, lastCredit = null, stopped = false, rewriteInsn = null;
  const findKinds = /^(compare-pair|stream-two-end|insn-code-different|call-usage-equal|usage-lose|pattern-|equiv-|credit-|stop-|not-use|not-clobber)/;
  for (const r of records.slice(1, -1)) {
    if (r.kind === 'begin' || r.kind === 'end') throw new Error('unexpected trace sentinel');
    if (r.kind === 'invoke') {
      if (open || r.invocation !== invocation + 1 || r.iteration !== 0 || ![0, 1, 2].includes(r.value)) throw new Error('invocation order');
      open = true; invocation++; iteration = 0;
    } else if (!open || r.invocation !== invocation) throw new Error('event outside invocation');
    if (r.kind === 'iteration') {
      if (r.iteration !== iteration + 1 || find || rewrite) throw new Error('iteration order');
      iteration++;
    }
    if (r.iteration !== iteration) throw new Error('iteration identity');
    if (r.kind === 'find-begin') {
      if (find || rewrite || ![1, 2].includes(r.value) || !r.a || !r.b) throw new Error('nested/invalid find');
      find = true; lastAccepted = null; minimum = r.value; lastCredit = null; stopped = false;
    }
    if (findKinds.test(r.kind)) {
      if (!find || stopped) throw new Error('find decision outside active comparison');
      if (r.kind.startsWith('credit-')) {
        if (r.value !== minimum - 1) throw new Error('minimum credit order');
        minimum = r.value;
        if (r.kind === 'credit-insn') lastCredit = r;
      }
      if (r.kind === 'compare-pair' || r.kind === 'pattern-win' || r.kind.startsWith('stop-')) equal(r.value, minimum, 'minimum observation');
      if (r.kind.startsWith('stop-') || r.kind === 'credit-label-stop') stopped = true;
    }
    if (r.kind === 'find-end') {
      if (!find || !stopped || (!!r.a !== !!r.b) || r.value !== minimum
          || (r.a && (r.value > 0 || !lastCredit || r.a !== lastCredit.a || r.b !== lastCredit.b))) throw new Error('invalid find endpoint');
      find = false; lastAccepted = r.a ? r : null;
    }
    if (r.kind === 'rewrite-begin') {
      if (find || rewrite || !lastAccepted || r.a !== lastAccepted.a || r.b !== lastAccepted.b) throw new Error('rewrite lacks accepted endpoint');
      rewrite = true; lastAccepted = null;
      rewriteInsn = r.value;
    }
    if (r.kind.startsWith('rewrite-') && !rewrite) throw new Error('rewrite event outside rewrite');
    if (r.kind === 'rewrite-end') {
      equal(r.a, rewriteInsn, 'rewrite insn'); rewrite = false;
    }
    if (r.kind === 'invoke-end') {
      if (find || rewrite) throw new Error('incomplete invocation'); open = false;
    }
  }
  if (open || find || rewrite || records.at(-1).invocation !== invocation || records.at(-1).iteration !== iteration) throw new Error('incomplete trace boundary');
  for (let i = 0; i < records.length; i++) if (records[i].kind === 'invoke') {
    equal(records[i + 1]?.kind, 'reload', 'invocation reload');
    equal(records[i + 2]?.kind, 'noop', 'invocation noop');
    equal(records[i + 3]?.kind, 'regscan', 'invocation regscan');
    equal(records[i + 4]?.kind, 'death-inactive-stack-regs-absent', 'death gate');
    equal(records[i + 4].value, Number(records[i].value === 2), 'death-only cross-jump argument');
  }
  return records;
}

function assertParity(expected, actual) {
  for (const key of ['compilerAssembly', 'adjustedAssembly', 'rawObject', 'objectText']) {
    if (!Buffer.isBuffer(expected[key]) || !Buffer.isBuffer(actual[key]) || !expected[key].equals(actual[key])) throw new Error(`parity ${key} mismatch`);
  }
  equal(canonicalJson(actual.relocations), canonicalJson(expected.relocations), 'parity actual relocations');
  equal(canonicalJson(actual.sectionEvidence), canonicalJson(expected.sectionEvidence), 'parity full sections');
  return Object.fromEntries(['compilerAssembly', 'adjustedAssembly', 'rawObject', 'objectText'].map(k => [k, sha(expected[k])]));
}
function snapshot(result, scratch, destination) {
  fs.mkdirSync(inside(destination), { recursive: true });
  const buffers = {};
  for (const [key, filename] of Object.entries({ compilerAssembly: 'candidate.compiler.s', adjustedAssembly: 'candidate.s', rawObject: 'candidate.o' })) {
    const file = inside(path.join(destination, filename)); fs.copyFileSync(path.join(scratch, filename), file); buffers[key] = fs.readFileSync(file);
  }
  for (const name of ['candidate.input.c']) fs.copyFileSync(path.join(scratch, name), inside(path.join(destination, name)));
  write(path.join(destination, 'scratch-contract.json'), result.scratchContract);
  const { parseElf32BigEndian } = require('../lib/phase7_conventional');
  const elf = parseElf32BigEndian(buffers.rawObject);
  const fullSections = elf.sections.map(s => ({ ...s,
    sha256: s.type === 8 ? null : sha(buffers.rawObject.subarray(s.offset, s.offset + s.size)) }));
  const allRelocations = [];
  for (const s of elf.sections.filter(s => s.type === 9)) {
    if (s.entrySize !== 8 || s.size % 8 || s.offset + s.size > buffers.rawObject.length) throw new Error('malformed full relocation census');
    for (let offset = s.offset; offset < s.offset + s.size; offset += 8) {
      const where = buffers.rawObject.readUInt32BE(offset), info = buffers.rawObject.readUInt32BE(offset + 4);
      const symbol = elf.symbols.find(t => t.symbolTableIndex === s.link && t.symbolIndex === (info >>> 8));
      if (!symbol) throw new Error('unresolved actual relocation symbol');
      allRelocations.push({ relocationSection: s.name, targetSection: elf.sections[s.info]?.name, offset: where,
        type: info & 255, symbol, info });
    }
  }
  const fullObjectEvidence = { sections: fullSections, symbols: elf.symbols, relocations: allRelocations };
  write(path.join(destination, 'full-object.json'), fullObjectEvidence);
  return { ...buffers, objectText: result.objectText, relocations: result.relocations,
    sectionEvidence: { fullOwner: result.scratchContract.fullOwner, allocatedSections: result.scratchContract.allocatedSections,
      fullObjectEvidence } };
}
function traceEnvironment(values, fn) {
  const names = ['OB64_LATE_JUMP_TRACE_FILE', 'OB64_LATE_JUMP_TRACE_NONCE', 'OB64_LATE_JUMP_TRACE_INPUT'];
  const saved = Object.fromEntries(names.map(n => [n, process.env[n]]));
  for (const n of names) { if (values[n] === undefined) delete process.env[n]; else process.env[n] = values[n]; }
  try { return fn(); } finally { for (const n of names) { if (saved[n] === undefined) delete process.env[n]; else process.env[n] = saved[n]; } }
}
function summarize(records) {
  const invocations = records.filter(r => r.kind === 'invoke').map(r => {
    const events = records.filter(e => e.invocation === r.invocation);
    return { invocation: r.invocation, crossJump: r.value, reload: events.find(e => e.kind === 'reload').value,
      noopMoves: events.find(e => e.kind === 'noop').value, afterRegscan: events.find(e => e.kind === 'regscan').value,
      iterations: events.filter(e => e.kind === 'iteration').length,
      typeCounts: Object.fromEntries([...new Set(events.map(e => e.kind))].map(k => [k, events.filter(e => e.kind === k).length])),
      finds: events.filter(e => e.kind === 'find-begin').map(begin => {
        const end = events.find(e => e.seq > begin.seq && e.kind === 'find-end');
        const path = events.filter(e => e.seq < begin.seq && ['conditional-pair', 'unconditional-predicate', 'return-predicate'].includes(e.kind)).at(-1)?.kind;
        return { path, begin, end, decisions: events.filter(e => e.seq > begin.seq && e.seq < end.seq) };
      }), rewrites: events.filter(e => e.kind.startsWith('rewrite-')) };
  });
  return { recordCount: records.length, invocations };
}

function compileCase(session, model, build, definition, runRoot) {
  const target = resolveTarget(model, definition.symbol);
  const dir = inside(path.join(runRoot, definition.id));
  const scratch = inside(path.join(dir, 'compile'));
  fs.mkdirSync(scratch, { recursive: true });
  const sourceFile = safePath(definition.source);
  const sourceText = fs.readFileSync(definition.source);
  equal(sha(sourceText), definition.sha256, `${definition.id} pinned source`);
  write(path.join(dir, 'source.c'), sourceText);
  const classification = classifySource(sourceFile, { preprocessor: session.preprocessor });
  assertSourcePin(classification, definition);
  equal(classification.class, 'PURE_C', 'diagnostic source policy');
  const inputSha256 = classification.compilationInput.sha256;
  const nonce = crypto.randomBytes(16).toString('hex').toUpperCase();
  const traceFile = inside(path.join(dir, 'trace.log'));
  if (fs.existsSync(traceFile)) throw new Error('trace output must be fresh');
  const flavors = [['production', session.context.localTools.compiler], ['control-relink', build.control],
    ['control-rebuilt', build.rebuiltControl], ['disabled', build.executable], ['enabled', build.executable]];
  let oracle;
  const outputs = {};
  for (const [flavor, executable] of flavors) {
    const expectedCompiler = flavor === 'production' ? PRODUCTION_SHA
      : flavor === 'control-relink' ? build.controlSha256 : flavor === 'control-rebuilt' ? build.controlRebuildSha256 : build.compilerSha256;
    equal(hash(executable), expectedCompiler, 'compiler before invocation');
    const substituted = { ...session, context: { ...session.context, localTools: { ...session.context.localTools, compiler: executable } } };
    const result = traceEnvironment(flavor === 'enabled' ? {
      OB64_LATE_JUMP_TRACE_FILE: traceFile, OB64_LATE_JUMP_TRACE_NONCE: nonce, OB64_LATE_JUMP_TRACE_INPUT: inputSha256,
    } : {}, () => compileScratchCandidate({ session: substituted, target, sourceFile, artifactDir: scratch, classification }));
    equal(hash(executable), expectedCompiler, 'compiler after invocation');
    if (flavor !== 'enabled' && fs.existsSync(traceFile)) throw new Error('disabled tracing wrote side file');
    const captured = snapshot(result, scratch, path.join(dir, flavor));
    if (!oracle) oracle = captured;
    outputs[flavor] = assertParity(oracle, captured);
  }
  // Interpretation happens only after all four exact artifact/relocation gates.
  const records = parseTrace(fs.readFileSync(traceFile, 'utf8'), { nonce, inputSha256 });
  const result = { id: definition.id, symbol: target.symbol, role: definition.role, source: definition,
    sourcePolicy: classification, nonce, inputSha256, parity: outputs,
    actualObjectEvidence: oracle.sectionEvidence.fullObjectEvidence,
    traceFile, traceSha256: hash(traceFile), trace: summarize(records), acceptanceEligible: false };
  write(path.join(dir, 'report.json'), result);
  return result;
}
function assertSourcePin(classification, definition) {
  equal(classification.sourceSha256, definition.sha256, 'classified authored source pin');
}
function assertAcceptedCase(definition, activeTargets = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/matching-c-targets.json'))).targets) {
  const rows = activeTargets.filter(t => t.symbol === definition.symbol);
  if (rows.length !== 1 || path.resolve(ROOT, rows[0].source) !== path.resolve(definition.source)) throw new Error('accepted corpus source is not the active owner');
  equal(hash(definition.source), definition.sha256, 'active accepted source pin');
}

function readOnlySession() {
  // Do not call prepareContext: that may normalize ROMs and prepare CURRENT.
  // These loaders authenticate existing tool/model inputs without building.
  const { loadLocalConfig, SETTINGS } = require('../lib/local_tools');
  const { loadActiveTargetModel } = require('../lib/active_targets');
  const { config, path: configPath } = loadLocalConfig();
  const localTools = { configPath };
  for (const [name, rule] of Object.entries(SETTINGS)) {
    if (rule.auditOnly) continue;
    const value = process.env[rule.environment] || config[name];
    if (!value && rule.optional) { localTools[name] = null; continue; }
    if (!value) throw new Error(`missing local tool ${name}`);
    localTools[name] = safePath(path.isAbsolute(value) ? value : path.join(ROOT, value));
    if (!fs.existsSync(localTools[name])) throw new Error(`missing existing local tool ${name}`);
  }
  const phase8 = loadActiveTargetModel();
  return prepareCompilerSession({ context: { localTools, phase8, model: phase8.model } });
}
function corpus() {
  const records = [
    { id: 'accepted', symbol: 'func_002158E4', role: 'active-accepted-pure-c', source: path.join(ROOT, 'src/battle/func_002158E4.c'), sha256: '592355ABC3E5B20DDF8C532EE2EB95D78645C1D2DDC7B48C3E7AEED8E97923D0' },
    { id: 'resolver', symbol: 'func_001237F0', role: 'genuine-nonmatching-resolver', source: path.join(ROOT, 'docs/archive/matching-c-candidates/2026-10-04-func_001237F0-69a987da95.c'), sha256: 'C9F77E427F3ACD7C06AF2A00AF82AA8898DE6C03BAB10F8634CF2F1E74DAC013' },
    { id: 'uniform', symbol: 'func_001237F0', role: 'genuine-nonmatching-uniform-terminal-arms', source: path.join(ROOT, 'docs/archive/matching-c-candidates/2026-10-04-func_001237F0-457bf323de.c'), sha256: 'F86BCA751AE5E5E85312E049EF410BFA9A542797788A380E3CE29AE0F19C7A2C' },
    { id: 'merge', symbol: 'func_002158E4', role: 'independently-authored-merge', source: path.join(ROOT, 'tests/fixtures/late_jump_trace/merge.c'), sha256: '7099436F6D493500625A7DF45486E9145BFFF140000E1701B51D752DBBD58C47' },
    { id: 'no-merge', symbol: 'func_002158E4', role: 'independently-authored-no-merge', source: path.join(ROOT, 'tests/fixtures/late_jump_trace/no-merge.c'), sha256: '1283CADEE87D8CA841B510A427BC5286DCBA40A4A1B76F9F6CF70B2CA457C47D' },
  ];
  assertAcceptedCase(records[0]);
  for (const record of records) equal(hash(record.source), record.sha256, 'fixed corpus source');
  return records;
}
function parseArguments(args) {
  const result = { command: args[0] || 'help', compilerSource: process.env.OB64_KMC_GCC_SOURCE || DEFAULT_SOURCE };
  const values = args.slice(1);
  while (values.length) {
    const option = values.shift(), value = values.shift();
    if (!value) throw new Error(`missing option value ${option}`);
    if (option === '--compiler-source') result.compilerSource = safePath(value);
    else if (option === '--target' && /^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) result.target = value;
    else if (option === '--source') result.source = safePath(value);
    else throw new Error(`unknown/unsafe option ${option}`);
  }
  if (!['help', 'build', 'run', 'corpus'].includes(result.command)) throw new Error('unknown command');
  if (result.command === 'run' && (!result.target || !result.source)) throw new Error('run requires --target and --source');
  return result;
}
function main(args = process.argv.slice(2)) {
  const options = parseArguments(args);
  if (options.command === 'help') {
    console.log('Diagnostic only. Commands: build | corpus | run --target SYMBOL --source FILE; optional --compiler-source DIR. All outputs: build/late-jump-trace/.');
    return;
  }
  const temp = inside(path.join(OUT, 'temp')); fs.mkdirSync(temp, { recursive: true });
  const previous = { TMP: process.env.TMP, TEMP: process.env.TEMP };
  process.env.TMP = temp; process.env.TEMP = temp;
  try {
    const implementation = { tool: hash(__filename), provenance: hash(path.join(__dirname, 'late_jump_provenance.js')) };
    const session = readOnlySession();
    const evidence = origin(options.compilerSource, session.context.localTools.compiler);
    const build = buildCompiler(evidence);
    if (options.command === 'build') { console.log(JSON.stringify({ compiler: build.executable, sha256: build.compilerSha256 })); return; }
    const model = loadWorkbenchModel();
    const definitions = options.command === 'corpus' ? corpus() : [{ id: 'input', symbol: options.target,
      role: 'arbitrary-diagnostic-source', source: options.source, sha256: hash(options.source) }];
    const runRoot = inside(path.join(OUT, `run-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`));
    fs.mkdirSync(runRoot, { recursive: true });
    verifyCensus(build.copy, build.copyFiles); checkHost(build.host);
    const cases = definitions.map(d => compileCase(session, model, build, d, runRoot));
    verifyCensus(build.copy, build.copyFiles); checkHost(build.host); verifyCensus(evidence.source, evidence.files);
    equal(hash(evidence.production), PRODUCTION_SHA, 'production final');
    equal(hash(__filename), implementation.tool, 'tool changed during diagnostic');
    equal(hash(path.join(__dirname, 'late_jump_provenance.js')), implementation.provenance, 'provenance comparator changed during diagnostic');
    const { verifyRuntimeTools } = require('../lib/phase8_matching_c');
    verifyRuntimeTools(session.context.phase8.model, {
      powershellRuntimeRoot: session.context.localTools.powershellRuntimeRoot,
      splatPython: session.context.localTools.splatPython, splatSplit: session.context.localTools.splatSplit,
      asmDifferRoot: session.context.localTools.asmDifferRoot,
    });
    if (options.command === 'corpus') {
      const lateRewrites = c => c.trace.invocations.filter(i => i.reload === 1 && i.crossJump === 1).flatMap(i => i.rewrites).filter(e => e.kind === 'rewrite-begin').length;
      if (!lateRewrites(cases.find(c => c.id === 'merge'))) throw new Error('merge control did not observe a late rewrite');
      if (lateRewrites(cases.find(c => c.id === 'no-merge'))) throw new Error('no-merge control unexpectedly rewrote');
    }
    const report = { schemaVersion: 1, study: 'late-jump-trace', researchOnly: true, acceptanceEligible: false,
      status: 'parity-pass', toolSha256: hash(__filename), instrumentationId: INSTRUMENTATION_ID,
      implementation,
      compilerManifest: build.manifestFile,
      compilerManifestSha256: hash(build.manifestFile),
      tool: session.tool, model: model.modelManifest, cases };
    const file = path.join(runRoot, 'report.json'); write(file, report);
    console.log(JSON.stringify({ status: report.status, report: file, cases: cases.map(c => ({ id: c.id, records: c.trace.recordCount })) }, null, 2));
    return report;
  } finally {
    for (const [name, value] of Object.entries(previous)) { if (value === undefined) delete process.env[name]; else process.env[name] = value; }
  }
}
module.exports = { MAX_EVENTS, INSTRUMENTATION_ID, PRODUCTION_SHA, JUMP_SHA, EVENT_KINDS,
  instrumentJump, parseTrace, assertParity, safePath, inside, census, verifyCensus, parseArguments, corpus, main,
  assertSourcePin, assertAcceptedCase, assertHostScript, assertHostSelection };
if (require.main === module) {
  try { main(); } catch (error) { console.error(error.stack); process.exitCode = 1; }
}
