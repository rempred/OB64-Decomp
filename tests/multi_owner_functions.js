#!/usr/bin/env node
'use strict';
// Synthetic metadata fixture only; this test cannot activate a matching owner.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { ROOT, parseElfFile, elfSectionBytes } = require('../tools/lib/phase7_conventional');
const { splitRelocatableTextSection, validateCompilerFunctionPartition } = require('../tools/lib/elf_text_split');
const { verifyCompilerTextFunctions, primaryCompilerFunctionBytes } = require('../tools/lib/phase8_matching_c');
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require('../tools/lib/real_mips_toolchain');
const hex = value => '0x' + value.toString(16).toUpperCase().padStart(8, '0');
const clone = value => JSON.parse(JSON.stringify(value));
function rejects(label, fn) { assert.throws(fn, undefined, label); }
function contract(count = 3) {
  return Array.from({ length: count }, (_, index) => ({ symbol: 'fixture_' + index,
    offset: hex(index * 16), offsetNumber: index * 16, bytes: index === 1 && count === 2 ? 32 : 16,
    binding: index === 0 ? 'GLOBAL' : 'LOCAL', entryEvidence: index === 0 ? 'owner' : 'fixed-address-call' }));
}
function targetFor(functions) {
  const vma = 0x80100000;
  return { symbol: 'fixture_0', sectionName: '.ob64.r0001', bytes: 48, vramStartNumber: vma,
    compilerTextFunctionsExplicit: true, compilerTextFunctions: functions,
    textOwners: [0, 1].map(index => ({ ownerIndex: index, logicalOffset: index * 24,
      logicalEnd: (index + 1) * 24, bytes: 24, sectionName: '.ob64.r000' + (index + 1),
      symbol: index ? 'physical_continuation' : 'fixture_0', vramStartNumber: vma + index * 24 })) };
}
function symbolView(target, linked = false) {
  const sections = target.textOwners.map((owner, index) => ({ index: index + 1, name: owner.sectionName,
    size: owner.bytes, address: linked ? owner.vramStartNumber : 0 }));
  const symbols = target.compilerTextFunctions.map(fn => {
    const ownerIndex = fn.offsetNumber < 24 ? 0 : 1;
    return { name: fn.symbol, value: linked ? target.vramStartNumber + fn.offsetNumber : fn.offsetNumber - ownerIndex * 24,
      size: fn.bytes, binding: fn.binding === 'GLOBAL' ? 1 : 0, symbolType: 2, visibility: 0, sectionIndex: ownerIndex + 1 };
  });
  symbols.push({ name: 'physical_continuation', value: linked ? target.vramStartNumber + 24 : 0,
    size: 0, binding: 1, symbolType: 2, visibility: 0, sectionIndex: 2 });
  return { sections, symbols };
}
function checkUnit() {
  for (const count of [2, 3]) {
    const target = targetFor(contract(count));
    assert.strictEqual(primaryCompilerFunctionBytes(target), 16);
    for (const linked of [false, true]) {
      const elf = symbolView(target, linked);
      assert.strictEqual(verifyCompilerTextFunctions(elf, target, elf.sections[0], linked).length, count);
      const cases = [
        ['missing local', symbols => symbols.splice(1, 1)],
        ['extra function after seam', symbols => symbols.push({ ...symbols[1], name: 'extra', sectionIndex: 2 })],
        ['extra zero-size function', symbols => symbols.push({ ...symbols.at(-1), name: 'unreviewed_zero' })],
        ['missing marker', symbols => symbols.pop()],
        ['duplicate marker', symbols => symbols.push({ ...symbols.at(-1) })],
        ['renamed marker', symbols => { symbols.at(-1).name = 'wrong'; }],
        ['nonzero marker', symbols => { symbols.at(-1).size = 4; }],
        ['local marker', symbols => { symbols.at(-1).binding = 0; }],
        ['hidden marker', symbols => { symbols.at(-1).visibility = 2; }],
        ['nonfunction marker', symbols => { symbols.at(-1).symbolType = 0; }],
        ['wrong marker section', symbols => { symbols.at(-1).sectionIndex = 1; }],
        ['wrong marker address', symbols => { symbols.at(-1).value += 4; }],
        ['global secondary', symbols => { symbols[1].binding = 1; }],
        ['wrong first size', symbols => { symbols[0].size = 48; }],
        ['wrong local section', symbols => { symbols[1].sectionIndex = 2; }],
        ['wrong local offset', symbols => { symbols[1].value += 4; }],
      ];
      for (const [label, mutate] of cases) {
        const bad = clone(elf); mutate(bad.symbols);
        rejects(label, () => verifyCompilerTextFunctions(bad, target, bad.sections[0], linked));
      }
    }
  }
  for (const mutate of [f => f.pop(), f => { f[1].offsetNumber += 4; }, f => { f[1].bytes += 4; },
    f => { f[1].binding = 'GLOBAL'; }, f => { f[1].symbol = f[0].symbol; }]) {
    const functions = contract(); mutate(functions);
    rejects('partition drift', () => validateCompilerFunctionPartition(functions, 48, 'fixture_0'));
  }
}
function checkProjection() {
  const toolchain = assertToolchainAvailable(loadToolchainConfig());
  const dir = path.join(ROOT, 'build/multi-owner-functions-test'); fs.mkdirSync(dir, { recursive: true });
  for (const count of [2, 3]) {
    const functions = contract(count), target = targetFor(functions);
    const source = ['.set noat', '.set noreorder', '.section .ob64.r0001,"ax",@progbits'];
    for (const [index, fn] of functions.entries()) {
      if (index === 0) source.push('.globl ' + fn.symbol);
      source.push('.type ' + fn.symbol + ',@function', '.ent ' + fn.symbol, fn.symbol + ':');
      // Actual instruction sequence; .size derives from emitted instructions.
      // No production bytes, compiler output, or metadata are fabricated.
      source.push('  lui $2,%hi(external_data)', '  addiu $2,$2,%lo(external_data)');
      for (let i = 0; i < fn.bytes / 4 - 4; i++) source.push('  addiu $2,$2,1');
      source.push('  jr $31', '  nop', '.size ' + fn.symbol + ',.-' + fn.symbol, '.end ' + fn.symbol);
    }
    const src = path.join(dir, 'fixture' + count + '.s'), obj = path.join(dir, 'fixture' + count + '.o');
    fs.writeFileSync(src, source.join('\n') + '\n');
    runTool(toolchain.assemblerAbs, [...toolchain.compilerAssemblerFlags, '-o', obj, src]);
    const input = fs.readFileSync(obj);
    const owners = target.textOwners.map((owner, index) => ({ sectionName: owner.sectionName, bytes: owner.bytes,
      symbol: owner.symbol, symbolSize: index ? 0 : 16 }));
    rejects('legacy first-size guard', () => splitRelocatableTextSection(input, target.sectionName, owners));
    const result = splitRelocatableTextSection(input, target.sectionName, owners, functions);
    const output = path.join(dir, 'fixture' + count + '.split.o'); fs.writeFileSync(output, result.buffer);
    const raw = parseElfFile(obj), projected = parseElfFile(output);
    const joined = Buffer.concat(owners.map(owner => elfSectionBytes(projected, projected.sections.find(s => s.name === owner.sectionName))));
    assert.deepStrictEqual(joined, elfSectionBytes(raw, raw.sections.find(s => s.name === target.sectionName)));
    verifyCompilerTextFunctions(projected, target, projected.sections.find(s => s.name === target.sectionName));
    for (const vma of [0x80100000, 0x80200000]) {
      const rawScript = path.join(dir, 'raw.ld'), splitScript = path.join(dir, 'split.ld');
      const rawLinked = path.join(dir, 'raw.elf'), splitLinked = path.join(dir, 'split.elf');
      const prefix = 'OUTPUT_ARCH(mips)\nexternal_data = 0x80301234;\nSECTIONS {\n';
      fs.writeFileSync(rawScript, prefix + ' .ob64.r0001 ' + hex(vma) + ' : { *(.ob64.r0001) }\n}\n');
      fs.writeFileSync(splitScript, prefix + owners.map((owner, index) => ' ' + owner.sectionName + ' '
        + hex(vma + index * 24) + ' : { *(' + owner.sectionName + ') }').join('\n') + '\n}\n');
      runTool(toolchain.toolsAbs.linker, ['-EB', '-m', 'elf32bmip', '-T', rawScript, '-o', rawLinked, obj]);
      runTool(toolchain.toolsAbs.linker, ['-EB', '-m', 'elf32bmip', '-T', splitScript, '-o', splitLinked, output]);
      const rawElf = parseElfFile(rawLinked), splitElf = parseElfFile(splitLinked);
      assert.deepStrictEqual(Buffer.concat(owners.map(owner => elfSectionBytes(splitElf,
        splitElf.sections.find(section => section.name === owner.sectionName)))),
        elfSectionBytes(rawElf, rawElf.sections.find(section => section.name === target.sectionName)));
      const placed = clone(target); placed.vramStartNumber = vma;
      placed.textOwners.forEach((owner, index) => { owner.vramStartNumber = vma + index * 24; });
      verifyCompilerTextFunctions(splitElf, placed, splitElf.sections.find(section => section.name === target.sectionName), true);
    }
    for (const change of [f => f.pop(), f => { f[1].bytes -= 4; }, f => { f[1].binding = 'GLOBAL'; },
      f => { f[1].symbol = 'physical_continuation'; }]) {
      const bad = clone(functions); change(bad);
      rejects('raw census/partition drift', () => splitRelocatableTextSection(input, target.sectionName, owners, bad));
    }
    // A complete but false partition must fail the raw object's authentic st_size.
    const wrong = clone(functions); wrong[0].bytes += 4; wrong[1].bytes -= 4;
    wrong[1].offsetNumber += 4; wrong[1].offset = hex(wrong[1].offsetNumber);
    const wrongOwners = clone(owners); wrongOwners[0].symbolSize += 4;
    rejects('false raw function size', () => splitRelocatableTextSection(input, target.sectionName, wrongOwners, wrong));
  }
}
checkUnit();
checkProjection();
process.stdout.write('multi-owner compiler-function composition checks passed\n');
