#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const tool = require('../tools/matching_studies/late_jump_trace');

function main() {
  const identity = { nonce: 'A'.repeat(32), inputSha256: 'B'.repeat(64) };
  const events = [
    [0, 0, 'begin', 0, 0, tool.MAX_EVENTS],
    [1, 0, 'invoke', 10, 0, 1],
    [1, 0, 'reload', 0, 0, 1],
    [1, 0, 'noop', 0, 0, 1],
    [1, 0, 'regscan', 0, 0, 0],
    [1, 0, 'death-inactive-stack-regs-absent', 0, 0, 0],
    [1, 1, 'iteration', 0, 0, 1],
    [1, 1, 'find-begin', 15, 30, 1],
    [1, 1, 'compare-pair', 14, 29, 1],
    [1, 1, 'pattern-equal', 14, 29, 1],
    [1, 1, 'credit-insn', 14, 29, 0],
    [1, 1, 'compare-pair', 13, 28, 0],
    [1, 1, 'stop-pattern-mismatch', 13, 28, 0],
    [1, 1, 'find-end', 14, 29, 0],
    [1, 1, 'rewrite-begin', 14, 29, 15],
    [1, 1, 'rewrite-label', 15, 31, 0],
    [1, 1, 'rewrite-redirect', 15, 31, 0],
    [1, 1, 'rewrite-delete', 14, 29, 0],
    [1, 1, 'rewrite-end', 15, 30, 0],
    [1, 1, 'invoke-end', 0, 0, 0],
    [1, 1, 'end', 0, 0, 0],
  ];
  const encode = rows => `LJM1|${identity.nonce}|${identity.inputSha256}\n` + rows.map((r, i) => `LJ1|${i}|${r.join('|')}`).join('\n') + '\n';
  const good = encode(events);
  assert.equal(tool.parseTrace(good, identity).length, events.length);
  const negatives = [];
  function reject(name, fn, pattern) {
    assert.throws(fn, pattern); negatives.push(name);
  }
  reject('missing identity', () => tool.parseTrace(good), /identity/);
  reject('replayed nonce', () => tool.parseTrace(good, { ...identity, nonce: 'C'.repeat(32) }), /identity/);
  reject('different source', () => tool.parseTrace(good, { ...identity, inputSha256: 'C'.repeat(64) }), /identity/);
  reject('truncated line', () => tool.parseTrace(good.slice(0, -1), identity), /truncated/);
  reject('missing end', () => tool.parseTrace(encode(events.slice(0, -1)), identity), /incomplete/);
  reject('stale schema', () => tool.parseTrace(good.replace('LJ1|0', 'LJ0|0'), identity), /schema/);
  reject('unknown event', () => tool.parseTrace(good.replace('pattern-equal', 'invented-predicate'), identity), /schema/);
  reject('duplicate sequence', () => tool.parseTrace(good.replace('LJ1|3|', 'LJ1|2|'), identity), /sequence/);
  reject('unknown integer', () => tool.parseTrace(good.replace('LJ1|3|1|0', 'LJ1|3|1|NaN'), identity), /integer/);
  reject('overflow marker', () => tool.parseTrace(good.replace('stop-pattern-mismatch|13|28|0', 'overflow|0|0|1'), identity), /overflow/);
  reject('nested invocation', () => tool.parseTrace(good.replace('iteration|0|0|1', 'invoke|0|0|1'), identity), /invocation/);
  reject('missing find-end', () => tool.parseTrace(encode(events.filter(r => r[2] !== 'find-end')), identity), /rewrite/);
  reject('incomplete rewrite', () => tool.parseTrace(encode(events.filter(r => r[2] !== 'rewrite-end')), identity), /incomplete/);
  reject('wrong death gate', () => tool.parseTrace(good.replace('death-inactive-stack-regs-absent|0|0|0', 'death-inactive-stack-regs-absent|0|0|1'), identity), /death/);
  reject('wrong accepted endpoint', () => tool.parseTrace(good.replace('rewrite-begin|14|29|15', 'rewrite-begin|14|28|15'), identity), /endpoint/);
  reject('impossible predicate result', () => tool.parseTrace(good.replace('pattern-equal|14|29|1', 'pattern-equal|14|29|7'), identity), /domain/);
  reject('impossible reload flag', () => tool.parseTrace(good.replace('reload|0|0|1', 'reload|0|0|2'), identity), /domain/);
  reject('impossible UID', () => tool.parseTrace(good.replace('compare-pair|14|29|1', 'compare-pair|2147483648|29|1'), identity), /domain/);
  reject('invalid RTX code', () => tool.parseTrace(good.replace('pattern-equal|14|29|1', 'pattern-one-code|14|29|116'), identity), /domain/);
  reject('invalid sentinel UIDs', () => tool.parseTrace(good.replace('reload|0|0|1', 'reload|3|0|1'), identity), /domain/);
  reject('credit without decrement', () => tool.parseTrace(good.replace('credit-insn|14|29|0', 'credit-insn|14|29|1'), identity), /credit/);
  reject('decision outside find', () => tool.parseTrace(good.replace('iteration|0|0|1', 'pattern-equal|0|0|1'), identity), /iteration|comparison/);
  reject('changed rewrite instruction', () => tool.parseTrace(good.replace('rewrite-end|15|30|0', 'rewrite-end|16|30|0'), identity), /rewrite insn/);
  reject('escaped output', () => tool.inside(path.resolve('build/late-jump-trace/../escape')), /escapes/);
  reject('batch expansion', () => tool.safePath('C:/%TEMP%/file'), /unsafe/);
  reject('batch quote', () => tool.safePath('C:/file"&echo bad'), /unsafe/);
  reject('missing source argument', () => tool.parseArguments(['run', '--target', 'fixture']), /requires/);
  reject('unknown option', () => tool.parseArguments(['run', '--bogus', 'value']), /unknown/);
  reject('untrusted original compiler source', () => tool.instrumentJump('arbitrary source'), /original/);
  const artifacts = {
    compilerAssembly: Buffer.from('assembly'), adjustedAssembly: Buffer.from('adjusted'), rawObject: Buffer.from('raw-object'), objectText: Buffer.from('text'),
    relocations: [{ offset: '0x00000004', type: 'R_MIPS_26', symbol: 'external', addend: 0 }],
    sectionEvidence: { fullOwner: { bytes: 4, tailBytes: 0, sha256: 'D'.repeat(64) } },
  };
  tool.assertParity(artifacts, { ...artifacts });
  for (const key of ['compilerAssembly', 'adjustedAssembly', 'rawObject', 'objectText']) reject(`changed ${key}`, () => tool.assertParity(artifacts, { ...artifacts, [key]: Buffer.from('changed') }), /parity/);
  reject('changed relocation', () => tool.assertParity(artifacts, { ...artifacts, relocations: [{ ...artifacts.relocations[0], symbol: 'other' }] }), /relocations/);
  reject('missing full section', () => tool.assertParity(artifacts, { ...artifacts, sectionEvidence: {} }), /sections/);
  const scratch = tool.inside(path.join(path.resolve('build/late-jump-trace'), `test-${crypto.randomBytes(5).toString('hex')}`));
  fs.mkdirSync(scratch, { recursive: true });
  try {
    fs.writeFileSync(path.join(scratch, 'object.obj'), 'sealed');
    const closure = tool.census(scratch); tool.verifyCensus(scratch, closure);
    fs.writeFileSync(path.join(scratch, 'object.obj'), 'tampered');
    reject('tampered reused object', () => tool.verifyCensus(scratch, closure), /closure/);
    fs.writeFileSync(path.join(scratch, 'object.obj'), 'sealed');
    fs.writeFileSync(path.join(scratch, 'unexpected.h'), 'header');
    reject('added closure input', () => tool.verifyCensus(scratch, closure), /closure/);
    const script = path.join(scratch, 'setup.cmd');
    fs.writeFileSync(script, 'sealed host script');
    const scriptRecord = { path: script, sha256: crypto.createHash('sha256').update(fs.readFileSync(script)).digest('hex').toUpperCase() };
    tool.assertHostScript(scriptRecord);
    fs.writeFileSync(script, 'changed host script');
    reject('host setup script drift', () => tool.assertHostScript(scriptRecord), /host setup script/);
    const selection = { cl: 'cl.exe', link: 'link.exe', directories: { include: 'include', lib: 'lib' } };
    tool.assertHostSelection(selection, selection);
    reject('host tool selection drift', () => tool.assertHostSelection(selection, { ...selection, cl: 'other.exe' }), /host selection/);
    reject('host include search drift', () => tool.assertHostSelection(selection, { ...selection, directories: { ...selection.directories, include: 'other-include' } }), /host selection/);
  } finally { fs.rmSync(tool.inside(scratch), { recursive: true }); }
  const corpus = tool.corpus();
  assert.equal(corpus.length, 5);
  const positive = corpus.find(c => c.id === 'accepted');
  tool.assertAcceptedCase(positive);
  tool.assertSourcePin({ sourceSha256: positive.sha256 }, positive);
  reject('source changed before classification', () => tool.assertSourcePin({ sourceSha256: 'A'.repeat(64) }, positive), /source pin/);
  reject('historical candidate mislabeled accepted', () => tool.assertAcceptedCase({ ...positive, source: corpus.find(c => c.id === 'resolver').source }), /active owner/);
  console.log(JSON.stringify({ status: 'pass', test: 'late-jump-trace', negativeControls: negatives.length, controls: negatives }, null, 2));
}
if (require.main === module) main();
module.exports = { main };
