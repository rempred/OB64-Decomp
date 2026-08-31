#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/phase7_conventional');

const SYMBOL = 'func_00284288';
const PREDECESSOR = path.join(ROOT, 'docs', 'archive', 'matching-c-candidates', '2026-08-31-func_00284288-e8eb93fecb.c');
const EVIDENCE = path.join(ROOT, 'build', 'matching', 'targets', SYMBOL, 'research', 'retail-command-evidence.json');
const OUTPUT = path.join(ROOT, 'build', 'matching', 'targets', SYMBOL, 'research', `${SYMBOL}.structured-skeleton.c`);
const COMPILE_OUTPUT = path.join(ROOT, 'build', 'matching', 'targets', SYMBOL, 'research', `${SYMBOL}.structured-skeleton.compile.c`);

function replaceRequired(source, pattern, replacement, label, expectedCount = 1) {
  const matches = source.match(pattern);
  const count = matches ? matches.length : 0;
  if (count !== expectedCount) throw new Error(`${label} replacement expected ${expectedCount} matches, found ${count}`);
  return source.replace(pattern, replacement);
}

function commandValue(text) {
  return Number.parseInt(text, 0) >>> 0;
}

function main() {
  if (!fs.existsSync(EVIDENCE)) {
    throw new Error(`missing generated command evidence; run node tools/${SYMBOL}_research.js first`);
  }
  const evidence = JSON.parse(fs.readFileSync(EVIDENCE, 'utf8'));
  if (evidence.schemaVersion !== 1 || evidence.summary?.symbol !== SYMBOL || evidence.commands?.length !== 153) {
    throw new Error('func_00284288 command evidence contract drift');
  }
  const byValue = new Map(evidence.commands.map((row) => [commandValue(row.command), row]));
  let source = fs.readFileSync(PREDECESSOR, 'utf8');
  const header = `/*
 * Structured research skeleton for ${SYMBOL}.
 *
 * Derived from the frozen E8EB93F predecessor, then constrained by the retail
 * 153-command map and prototype ledger. The original assembly remains active.
 * This is PURE_C research source, not an accepted Matching-C implementation.
 */
`;
  source = header + source;

  const declarationReplacements = new Map([
    ['void func_0001a050(s32);', 'void func_0001a050(void);'],
    ['void func_00283654(s32);', 'void func_00283654(void);'],
    ['s32 func_00283694(s32);', 's32 func_00283694(void);'],
    ['void func_002836A4(s32);', 'void func_002836A4(void);'],
    ['void func_00283740(s32);', 'void func_00283740(void);'],
    ['void func_00283B30(s32);', 'void func_00283B30(void);'],
    ['s8 func_00283E14(s16);', 's32 func_00283E14(s32);'],
    ['void func_00283FA8(s32, M2C_UNK);', 'void func_00283FA8(s32, s32);'],
    ['s32 func_002861C8(s32 *, s32, s32 *, s32, s32, s32);',
      's32 func_002861C8(s32 *nesting, s32 cursor, s32 *stream, s32 value, s32 skip, s32 scan_mode);'],
    ['s32 func_0029C19C(s32);', 's32 func_0029C19C(void);'],
    ['void func_0029D790(s32, s32, s32, s32, f32, f32, f32, s32, s32);',
      'void func_0029D790(s32, s32, s32, s32, f32, f32, f32, u8, u8);'],
    ['s32 func_0029DF04(s32);', 'u8 func_0029DF04(s32);'],
    ['void func_002A053C(s32);', 'void func_002A053C(s16);'],
    ['s32 func_002A05DC(s32);', 'u8 func_002A05DC(s32);'],
    ['void func_002A08C0(s32, s32, s32, s32, f32, f32, f32, s32, s32);',
      's32 func_002A08C0(s32, s32, s32, s32, f32, f32, f32, s32, s32);'],
  ]);
  for (const [before, after] of declarationReplacements) {
    source = replaceRequired(source, new RegExp(before.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), after, before);
  }

  for (const callee of [
    'func_0001a050', 'func_00283654', 'func_00283694', 'func_002836A4',
    'func_00283740', 'func_00283B30', 'func_0029C19C',
  ]) {
    source = replaceRequired(source, new RegExp(`${callee}\\(var_a0_36\\)`, 'g'), `${callee}()`, `${callee} call`);
  }

  source = replaceRequired(source, /    s32 state\[6\];/, `    struct {
        s32 nesting;
        s32 unknown_04;
        s32 unknown_08;
        s32 stop_requested;
        s32 unknown_10;
        s32 scan_mode;
    } parser_state;`, 'parser state declaration');
  const stateReplacements = new Map([
    ['state[0]', 'parser_state.nesting'],
    ['state[3]', 'parser_state.stop_requested'],
    ['state[5]', 'parser_state.scan_mode'],
  ]);
  for (const [before, after] of stateReplacements) source = source.replaceAll(before, after);
  source = replaceRequired(source,
    /func_002861C8\(state, var_s1_17, stream, var_s4_42, var_s5_14, parser_state\.scan_mode\)/,
    'func_002861C8(&parser_state.nesting, var_s1_17, stream, var_s4_42, var_s5_14, parser_state.scan_mode)',
    'parser call state pointer');

  const centralNames = new Map([
    ['var_s1_17', 'cursor'],
    ['var_s4_42', 'command_result'],
    ['var_s5_14', 'scan_mode'],
    ['temp_v1_39', 'command'],
    ['temp_t0_38', 'command_address'],
    ['var_a0_36', 'cursor_byte_offset'],
    ['var_s8_12', 'byte_mask_ff'],
  ]);
  for (const [before, after] of centralNames) source = source.replace(new RegExp(`\\b${before}\\b`, 'g'), after);

  let annotated = 0;
  source = source.replace(/^(\s*)case\s+(0x[0-9A-Fa-f]+)\s*:/gm, (match, indent, valueText) => {
    const row = byValue.get(commandValue(valueText));
    if (!row) throw new Error(`case ${valueText} is absent from the command map`);
    annotated += 1;
    const calls = row.calls.map((call) => call.symbol).join('|') || 'none';
    const args = row.streamArgumentCount === null ? 'unknown/variable' : row.streamArgumentCount;
    return `${indent}/* retail ${row.entryRom}/${row.entryVram}; ${row.cfgBlocks.length} blocks; args=${args}; calls=${calls}; tail=${row.sharedExitTail} */\n${indent}case ${valueText}:`;
  });
  if (annotated !== 153) throw new Error(`expected to annotate 153 cases, found ${annotated}`);

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, source);
  const compilerInput = source.replace(/\/\*[\s\S]*?\*\//g,
    (comment) => comment.replace(/[^\r\n]/g, ' '));
  fs.writeFileSync(COMPILE_OUTPUT, compilerInput);
  console.log(JSON.stringify({
    source: path.relative(ROOT, OUTPUT).replace(/\\/g, '/'),
    compilerInput: path.relative(ROOT, COMPILE_OUTPUT).replace(/\\/g, '/'),
    bytes: Buffer.byteLength(source),
    annotatedCommands: annotated,
    prototypeCorrections: declarationReplacements.size,
    centralNames: [...centralNames.values()],
    dataModel: 'six-word parser state with nesting/stop/scan fields named only where call/use evidence supports them',
  }, null, 2));
}

main();
