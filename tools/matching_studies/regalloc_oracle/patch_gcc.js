#!/usr/bin/env node
'use strict';

// Research-only register-allocation oracle for KMC GCC 2.7.2.
//
// Copies the pristine compiler source (with its prebuilt host objects) into
// ignored build/regalloc-oracle/gcc, instruments global.c and local-alloc.c,
// and relinks cc1-oracle.exe.  Every hook is inert unless its environment
// variable is set:
//
//   OB64_RA_TRACE=<file>  append allocation/insn records for each function
//   OB64_RA_FORCE=<file>  "FUNC REGNO HARDREG" lines override reg_renumber
//                         immediately before reload (HARDREG -1 = memory)
//   OB64_RA_DP=1          annotate assembly with insn UIDs (same as -dp)
//
// With no variable set, output must be byte-identical to the pinned cc1;
// parity.js checks that.  Nothing produced here is a matching candidate:
// final candidates are always compiled by the unmodified pinned compiler.

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const SOURCE = process.env.OB64_KMC_GCC_SOURCE
  || 'C:\\Users\\Joe\\.codex\\ob64-phase6-kmc-20260801\\clean-d\\source\\mips-gcc-2.7.2';
const OUT = process.env.OB64_RA_OUT || path.join(ROOT, 'build', 'regalloc-oracle', 'gcc');
const VCVARS = process.env.OB64_VCVARS
  || 'C:\\Program Files\\Microsoft Visual Studio\\18\\Community\\VC\\Auxiliary\\Build\\vcvarsall.bat';
const HOST_CFLAGS = '/nologo /Od /Brepro /D_CRT_SECURE_NO_WARNINGS /D_CRT_NONSTDC_NO_WARNINGS /Di386 /DWIN32 /D_WIN32 /D_X86_=1 /DALMOST_STDC';
const LINK_OBJECTS = [
  'c-parse', 'c-lang', 'c-lex', 'c-pragma', 'c-decl', 'c-typeck', 'c-convert', 'c-aux-info',
  'c-common', 'c-iterate', 'toplev', 'version', 'tree', 'print-tree', 'stor-layout', 'fold-const',
  'function', 'stmt', 'expr', 'calls', 'expmed', 'explow', 'optabs', 'varasm', 'rtl', 'print-rtl',
  'rtlanal', 'emit-rtl', 'real', 'dbxout', 'sdbout', 'dwarfout', 'xcoffout', 'integrate', 'jump',
  'cse', 'loop', 'unroll', 'flow', 'stupid', 'combine', 'regclass', 'local-alloc', 'global',
  'reload', 'reload1', 'caller-save', 'insn-peep', 'reorg', 'sched', 'final', 'recog', 'reg-stack',
  'insn-opinit', 'insn-recog', 'insn-extract', 'insn-output', 'insn-emit', 'insn-attrtab', 'mips',
  'getpwd', 'convert', 'bc-emit', 'bc-optab', 'obstack', 'alloca',
].map((name) => `${name}.obj`).concat(['libcmt.lib', 'kernel32.lib']);

const GLOBAL_SUPPORT = String.raw`

/* ---- OB64 register-allocation oracle (research only) ---- */

extern int flag_print_asm_name;
static char ob64_ra_base_live[FIRST_PSEUDO_REGISTER];

/* Called at the start of local_alloc: regs_ever_live before any pseudo
   receives a hard register.  */
void
ob64_ra_snapshot_live ()
{
  register int i;
  for (i = 0; i < FIRST_PSEUDO_REGISTER; i++)
    ob64_ra_base_live[i] = regs_ever_live[i];
}

static int
ob64_ra_env_on (var)
     char *var;
{
  char *value = getenv (var);
  return value != 0 && value[0] != 0 && value[0] != '0';
}

static void
ob64_ra_collect (x, out, n, max)
     rtx x;
     int *out;
     int *n;
     int max;
{
  register char *fmt;
  register int i, j;

  if (x == 0)
    return;
  if (GET_CODE (x) == REG)
    {
      if (REGNO (x) >= FIRST_PSEUDO_REGISTER)
	{
	  for (i = 0; i < *n; i++)
	    if (out[i] == REGNO (x))
	      return;
	  if (*n < max)
	    out[(*n)++] = REGNO (x);
	}
      return;
    }
  fmt = GET_RTX_FORMAT (GET_CODE (x));
  for (i = 0; i < GET_RTX_LENGTH (GET_CODE (x)); i++)
    {
      if (fmt[i] == 'e')
	ob64_ra_collect (XEXP (x, i), out, n, max);
      else if (fmt[i] == 'E')
	for (j = 0; j < XVECLEN (x, i); j++)
	  ob64_ra_collect (XVECEXP (x, i, j), out, n, max);
    }
}

/* Called in global_alloc immediately before reload.  */
static void
ob64_ra_before_reload ()
{
  char *trace_path = getenv ("OB64_RA_TRACE");
  char *force_path = getenv ("OB64_RA_FORCE");
  FILE *trace = 0;
  register int i;
  int mismatch = 0, forced = 0;
  char *name = current_function_name ? current_function_name : "?";

  if (ob64_ra_env_on ("OB64_RA_DP"))
    flag_print_asm_name = 1;
  if (trace_path != 0 && trace_path[0] != 0)
    {
      trace = fopen (trace_path, "a");
      if (trace == 0)
	{
	  fprintf (stderr, "OB64RA: cannot open trace file\n");
	  exit (33);
	}
    }

  /* The allocators never write regs_ever_live; reload's mark_home_live
     derives it from reg_renumber.  Forcing therefore needs no live-set
     repair, provided the set is still the local_alloc entry snapshot.  */
  for (i = 0; i < FIRST_PSEUDO_REGISTER; i++)
    if ((ob64_ra_base_live[i] != 0) != (regs_ever_live[i] != 0))
      mismatch++;

  if (force_path != 0 && force_path[0] != 0)
    {
      FILE *f = fopen (force_path, "r");
      char fname[256];
      int regno, hard;
      if (f == 0)
	{
	  fprintf (stderr, "OB64RA: cannot open force file\n");
	  exit (33);
	}
      while (fscanf (f, "%255s %d %d", fname, &regno, &hard) == 3)
	if (strcmp (fname, name) == 0)
	  {
	    if (regno < FIRST_PSEUDO_REGISTER || regno >= max_regno
		|| hard < -1 || hard >= FIRST_PSEUDO_REGISTER)
	      {
		fprintf (stderr, "OB64RA: invalid force %s %d %d\n", fname, regno, hard);
		exit (33);
	      }
	    reg_renumber[regno] = hard;
	    forced++;
	  }
      fclose (f);
    }

  if (trace == 0)
    return;

  fprintf (trace, "F|%s|max_regno=%d|max_allocno=%d|live_mismatch=%d|forced=%d\n",
	   name, max_regno, max_allocno, mismatch, forced);
  {
    int *pos = (int *) alloca ((max_allocno + 1) * sizeof (int));
    for (i = 0; i < max_allocno; i++)
      pos[allocno_order[i]] = i;
    for (i = FIRST_PSEUDO_REGISTER; i < max_regno; i++)
      {
	int a = reg_allocno[i];
	if (reg_n_refs[i] == 0 && reg_renumber[i] < 0)
	  continue;
	if (a >= 0)
	  {
	    int pri = (((double) (floor_log2 (allocno_n_refs[a]) * allocno_n_refs[a])
			/ allocno_live_length[a])
		       * 10000 * allocno_size[a]);
	    fprintf (trace, "P|%s|%d|hard=%d|refs=%d|live=%d|calls=%d|mode=%s|allocno=%d|pos=%d|pri=%d|arefs=%d|alive=%d|asize=%d\n",
		     name, i, reg_renumber[i], reg_n_refs[i], reg_live_length[i],
		     reg_n_calls_crossed[i], GET_MODE_NAME (PSEUDO_REGNO_MODE (i)),
		     a, pos[a], pri, allocno_n_refs[a], allocno_live_length[a], allocno_size[a]);
	  }
	else
	  fprintf (trace, "P|%s|%d|hard=%d|refs=%d|live=%d|calls=%d|mode=%s|allocno=-1\n",
		   name, i, reg_renumber[i], reg_n_refs[i], reg_live_length[i],
		   reg_n_calls_crossed[i], GET_MODE_NAME (PSEUDO_REGNO_MODE (i)));
      }
  }
  {
    rtx insn;
    int regs[64], n, k;
    for (insn = get_insns (); insn; insn = NEXT_INSN (insn))
      if (GET_RTX_CLASS (GET_CODE (insn)) == 'i')
	{
	  n = 0;
	  ob64_ra_collect (PATTERN (insn), regs, &n, 64);
	  fprintf (trace, "I|%s|%d|", name, INSN_UID (insn));
	  for (k = 0; k < n; k++)
	    fprintf (trace, k ? ",%d" : "%d", regs[k]);
	  fprintf (trace, "\n");
	}
  }
  fclose (trace);
}
`;

const LOCAL_DECL = `\nextern void ob64_ra_snapshot_live ();\nstatic void ob64_ra_local_sugg ();\nstatic void ob64_ra_local_final ();\n`;

// Per-block local-alloc trace.  block_alloc sorts its quantities twice: once
// for the "suggested register" pass and once by qty_compare priority for the
// main first-fit pass.  Record both orders and results so a retail
// assignment can be explained as ordering constraints.
const LOCAL_SUPPORT = String.raw`

/* ---- OB64 register-allocation oracle: local-alloc trace (research only) ---- */

static int *ob64_ra_sugg_pos;
static short *ob64_ra_sugg_phys;
static int ob64_ra_sugg_n;

static void
ob64_ra_local_sugg (qty_order, n)
     int *qty_order;
     int n;
{
  register int i;
  char *path = getenv ("OB64_RA_TRACE");
  if (path == 0 || path[0] == 0)
    return;
  if (ob64_ra_sugg_pos)
    free (ob64_ra_sugg_pos), free (ob64_ra_sugg_phys);
  ob64_ra_sugg_pos = (int *) xmalloc ((n + 1) * sizeof (int));
  ob64_ra_sugg_phys = (short *) xmalloc ((n + 1) * sizeof (short));
  ob64_ra_sugg_n = n;
  for (i = 0; i < n; i++)
    {
      ob64_ra_sugg_pos[qty_order[i]] = i;
      ob64_ra_sugg_phys[qty_order[i]] = qty_phys_reg[qty_order[i]];
    }
}

static void
ob64_ra_local_final (b, qty_order, n)
     int b;
     int *qty_order;
     int n;
{
  register int i, r;
  FILE *trace;
  char *path = getenv ("OB64_RA_TRACE");
  char *name = current_function_name ? current_function_name : "?";
  if (path == 0 || path[0] == 0)
    return;
  trace = fopen (path, "a");
  if (trace == 0)
    return;
  for (i = 0; i < n; i++)
    {
      int q = qty_order[i];
      int len = qty_death[q] - qty_birth[q];
      int pri = len > 0
	? (((double) (floor_log2 (qty_n_refs[q]) * qty_n_refs[q] * qty_size[q]) / len) * 10000)
	: 0;
      fprintf (trace, "Q|%s|block=%d|qty=%d|pos=%d|phys=%d|spos=%d|sphys=%d|pri=%d|refs=%d|birth=%d|death=%d|size=%d|calls=%d|nsugg=%d|ncopy=%d|regs=",
	       name, b, q, i, qty_phys_reg[q],
	       n == ob64_ra_sugg_n ? ob64_ra_sugg_pos[q] : -1,
	       n == ob64_ra_sugg_n ? ob64_ra_sugg_phys[q] : -2,
	       pri, qty_n_refs[q], qty_birth[q], qty_death[q], qty_size[q],
	       qty_n_calls_crossed[q], qty_phys_num_sugg[q], qty_phys_num_copy_sugg[q]);
      for (r = qty_first_reg[q]; r >= 0; r = reg_next_in_qty[r])
	fprintf (trace, r == qty_first_reg[q] ? "%d" : ",%d", r);
      fprintf (trace, "\n");
    }
  fclose (trace);
}
`;

function replaceOnce(text, needle, replacement, label) {
  const at = text.indexOf(needle);
  if (at < 0 || text.indexOf(needle, at + needle.length) >= 0) throw new Error(`patch anchor not unique: ${label}`);
  return text.slice(0, at) + replacement + text.slice(at + needle.length);
}

function patchGlobal(text) {
  // Forward declaration after the includes so global_alloc can call the hook.
  text = replaceOnce(text, '#include "output.h"\n', '#include "output.h"\n\nstatic void ob64_ra_before_reload ();\n', 'global includes');
  text = replaceOnce(text, '    return reload (get_insns (), 1, file);\n}',
    '    {\n      ob64_ra_before_reload ();\n      return reload (get_insns (), 1, file);\n    }\n}', 'global reload call');
  return text + GLOBAL_SUPPORT;
}

function patchLocal(text) {
  text = replaceOnce(text, '#include "output.h"\n', `#include "output.h"\n${LOCAL_DECL}`, 'local includes');
  text = replaceOnce(text, 'local_alloc ()\n{\n  register int b, i;\n  int max_qty;\n',
    'local_alloc ()\n{\n  register int b, i;\n  int max_qty;\n\n  ob64_ra_snapshot_live ();\n', 'local_alloc entry');
  text = replaceOnce(text, '\tqty_phys_reg[q] = -1;\n    }\n\n  /* Order the qtys so we assign them registers in order of ',
    '\tqty_phys_reg[q] = -1;\n    }\n\n  ob64_ra_local_sugg (qty_order, next_qty);\n\n  /* Order the qtys so we assign them registers in order of ', 'block_alloc sugg pass');
  text = replaceOnce(text, '  /* Now propagate the register assignments\n',
    '  ob64_ra_local_final (b, qty_order, next_qty);\n\n  /* Now propagate the register assignments\n', 'block_alloc final pass');
  return text + LOCAL_SUPPORT;
}

function copyTree(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true, filter: (item) => path.basename(item) !== '.git' });
}

function main() {
  const head = childProcess.execFileSync('git', ['-C', SOURCE, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (head !== '43d1cdb67ed135879869b5266f01efaaada5e35a') throw new Error(`unexpected compiler source commit ${head}`);
  copyTree(SOURCE, OUT);
  for (const [file, patch] of [['global.c', patchGlobal], ['local-alloc.c', patchLocal]]) {
    const full = path.join(OUT, file);
    const text = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n');
    fs.writeFileSync(full, patch(text), 'utf8');
  }
  const script = [
    '@echo off',
    `call "${VCVARS}" x86 >nul`,
    'if errorlevel 1 exit /b %errorlevel%',
    `cl -c -DCROSS_COMPILE -DIN_GCC ${HOST_CFLAGS} -I. -I. -I./config global.c local-alloc.c`,
    'if errorlevel 1 exit /b %errorlevel%',
    `link /nologo /SUBSYSTEM:CONSOLE /Brepro -out:cc1-oracle.exe ${LINK_OBJECTS.join(' ')}`,
    'if errorlevel 1 exit /b %errorlevel%',
    '',
  ].join('\r\n');
  const scriptFile = path.join(OUT, 'ob64-ra-build.cmd');
  fs.writeFileSync(scriptFile, script, 'ascii');
  const result = childProcess.spawnSync('cmd.exe', ['/d', '/c', `"${scriptFile}"`], {
    cwd: OUT, encoding: 'utf8', windowsHide: true, windowsVerbatimArguments: true, maxBuffer: 64 * 1024 * 1024,
  });
  fs.writeFileSync(path.join(OUT, 'ob64-ra-build.log'), `${result.stdout}\n${result.stderr}`, 'utf8');
  const exe = path.join(OUT, 'cc1-oracle.exe');
  if (result.status !== 0 || !fs.existsSync(exe)) {
    process.stderr.write(result.stdout.split(/\r?\n/).filter((line) => /error/i.test(line)).join('\n'));
    throw new Error(`oracle build failed (${result.status}); see ob64-ra-build.log`);
  }
  console.log(exe);
}

main();
