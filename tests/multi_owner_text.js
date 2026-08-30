#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  elfSectionBytes,
  parseElfFile,
  sha256Buffer,
} = require('../tools/lib/phase7_conventional');
const { splitRelocatableTextSection } = require('../tools/lib/elf_text_split');
const {
  assertToolchainAvailable,
  loadToolchainConfig,
  runTool,
} = require('../tools/lib/real_mips_toolchain');

function expectRejection(name, callback, pattern = /relocatable text split failure/) {
  try {
    callback();
  } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return { name, status: 'rejected', message: error.message };
  }
  throw new Error(`mutation was accepted: ${name}`);
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function sectionBytes(elf, name) {
  const sections = elf.sections.filter((section) => section.name === name);
  if (sections.length !== 1) throw new Error(`section does not resolve uniquely: ${name}`);
  return Buffer.from(elfSectionBytes(elf, sections[0]));
}

function main() {
  const toolchain = assertToolchainAvailable(loadToolchainConfig());
  const root = path.join(ROOT, 'build', 'multi-owner-text-test');
  fs.mkdirSync(root, { recursive: true });
  const source = path.join(root, 'fixture.s');
  const unsplitObject = path.join(root, 'fixture-unsplit.o');
  const splitObject = path.join(root, 'fixture-split.o');
  const unsplitLinker = path.join(root, 'fixture-unsplit.ld');
  const splitLinker = path.join(root, 'fixture-split.ld');
  const unsplitElf = path.join(root, 'fixture-unsplit.elf');
  const splitElf = path.join(root, 'fixture-split.elf');
  write(source, [
    '.set noat',
    '.set noreorder',
    '.section .ob64.r0001,"ax",@progbits',
    '.globl fixture',
    '.type fixture,@function',
    '.ent fixture',
    'fixture:',
    '  lui $8,%hi(external_data)',
    '  addiu $8,$8,%lo(external_data)',
    '  beq $0,$0,after_seam',
    '  nop',
    'after_seam:',
    '  jal external_function',
    '  nop',
    '  b fixture',
    '  nop',
    '.size fixture,.-fixture',
    '.end fixture',
    '',
  ].join('\n'));
  runTool(toolchain.assemblerAbs, [
    ...toolchain.compilerAssemblerFlags,
    '-o',
    unsplitObject,
    source,
  ]);
  const unsplitBytes = fs.readFileSync(unsplitObject);
  const split = splitRelocatableTextSection(unsplitBytes, '.ob64.r0001', [
    { sectionName: '.ob64.r0001', bytes: 12, symbol: 'fixture', symbolSize: 32 },
    { sectionName: '.ob64.r0002', bytes: 20, symbol: 'fixture_tail', symbolSize: 0 },
  ]);
  fs.writeFileSync(splitObject, split.buffer);
  const unsplit = parseElfFile(unsplitObject);
  const splitElfObject = parseElfFile(splitObject);
  const fullText = sectionBytes(unsplit, '.ob64.r0001');
  const firstOwner = sectionBytes(splitElfObject, '.ob64.r0001');
  const secondOwner = sectionBytes(splitElfObject, '.ob64.r0002');
  if (fullText.length !== 32 || firstOwner.length !== 12 || secondOwner.length !== 20
      || !Buffer.concat([firstOwner, secondOwner]).equals(fullText)
      || firstOwner.readUInt32BE(8) !== fullText.readUInt32BE(8)
      || secondOwner.readUInt32BE(0) !== fullText.readUInt32BE(12)) {
    throw new Error('split owner bytes or branch/delay-slot seam drift');
  }
  const functionSymbols = splitElfObject.symbols.filter((symbol) => symbol.name === 'fixture');
  if (functionSymbols.length !== 1 || functionSymbols[0].value !== 0
      || functionSymbols[0].size !== 32 || functionSymbols[0].binding !== 1 || functionSymbols[0].symbolType !== 2
      || functionSymbols[0].sectionIndex !== splitElfObject.sections.find((section) => section.name === '.ob64.r0001').index) {
    throw new Error('logical function symbol extent drift after owner split');
  }
  const boundarySymbols = splitElfObject.symbols.filter((symbol) => symbol.name === 'fixture_tail');
  if (boundarySymbols.length !== 1 || boundarySymbols[0].value !== 0 || boundarySymbols[0].size !== 0
      || boundarySymbols[0].binding !== 1 || boundarySymbols[0].symbolType !== 2
      || boundarySymbols[0].sectionIndex !== splitElfObject.sections.find((section) => section.name === '.ob64.r0002').index) {
    throw new Error('continuation owner symbol semantics drift after owner split');
  }
  const relocationSections = splitElfObject.sections.filter((section) => section.type === 9);
  const firstRelocations = relocationSections.find((section) => section.name === '.rel.ob64.r0001');
  const secondRelocations = relocationSections.find((section) => section.name === '.rel.ob64.r0002');
  if (!firstRelocations || firstRelocations.size !== 16
      || !secondRelocations || secondRelocations.size !== 8
      || split.relocationSections[0].entries !== 2
      || split.relocationSections[1].entries !== 1) {
    throw new Error('split relocation census drift');
  }
  write(unsplitLinker, [
    'SECTIONS { .ob64.r0001 0x80230000 : AT(0x00001000) { *(.ob64.r0001) } }',
    'external_data = 0x80123456;',
    'external_function = 0x80001234;',
    '',
  ].join('\n'));
  write(splitLinker, [
    'SECTIONS {',
    '  .ob64.r0001 0x80230000 : AT(0x00001000) { *(.ob64.r0001) }',
    '  .ob64.r0002 0x8023000C : AT(0x0000100C) { *(.ob64.r0002) }',
    '}',
    'external_data = 0x80123456;',
    'external_function = 0x80001234;',
    '',
  ].join('\n'));
  runTool(toolchain.toolsAbs.linker, ['-T', unsplitLinker, '-o', unsplitElf, unsplitObject]);
  runTool(toolchain.toolsAbs.linker, ['-T', splitLinker, '-o', splitElf, splitObject]);
  const unsplitLinked = sectionBytes(parseElfFile(unsplitElf), '.ob64.r0001');
  const linkedSplitElf = parseElfFile(splitElf);
  const splitLinked = Buffer.concat([
    sectionBytes(linkedSplitElf, '.ob64.r0001'),
    sectionBytes(linkedSplitElf, '.ob64.r0002'),
  ]);
  if (unsplitLinked.length !== 32 || !splitLinked.equals(unsplitLinked)) {
    throw new Error('split and unsplit linked instruction bytes differ');
  }
  const linkedBoundarySymbols = linkedSplitElf.symbols.filter((symbol) => symbol.name === 'fixture_tail');
  if (linkedBoundarySymbols.length !== 1 || linkedBoundarySymbols[0].value !== 0x8023000C
      || linkedBoundarySymbols[0].size !== 0 || linkedBoundarySymbols[0].binding !== 1
      || linkedBoundarySymbols[0].symbolType !== 2
      || linkedSplitElf.sections[linkedBoundarySymbols[0].sectionIndex].name !== '.ob64.r0002') {
    throw new Error('linked continuation owner symbol semantics drift');
  }

  const rejectedMutations = [
    expectRejection('missing owner bytes', () => splitRelocatableTextSection(unsplitBytes, '.ob64.r0001', [
      { sectionName: '.ob64.r0001', bytes: 12 },
      { sectionName: '.ob64.r0002', bytes: 16 },
    ])),
    expectRejection('extra owner bytes', () => splitRelocatableTextSection(unsplitBytes, '.ob64.r0001', [
      { sectionName: '.ob64.r0001', bytes: 12 },
      { sectionName: '.ob64.r0002', bytes: 20 },
      { sectionName: '.ob64.r0003', bytes: 4 },
    ])),
    expectRejection('duplicate owner section', () => splitRelocatableTextSection(unsplitBytes, '.ob64.r0001', [
      { sectionName: '.ob64.r0001', bytes: 12 },
      { sectionName: '.ob64.r0001', bytes: 20 },
    ])),
    expectRejection('reordered first owner', () => splitRelocatableTextSection(unsplitBytes, '.ob64.r0001', [
      { sectionName: '.ob64.r0002', bytes: 12 },
      { sectionName: '.ob64.r0001', bytes: 20 },
    ])),
    expectRejection('unaligned owner bytes', () => splitRelocatableTextSection(unsplitBytes, '.ob64.r0001', [
      { sectionName: '.ob64.r0001', bytes: 10 },
      { sectionName: '.ob64.r0002', bytes: 22 },
    ])),
    expectRejection('HI16 LO16 pair crossing owner boundary', () => splitRelocatableTextSection(unsplitBytes, '.ob64.r0001', [
      { sectionName: '.ob64.r0001', bytes: 4 },
      { sectionName: '.ob64.r0002', bytes: 28 },
    ])),
    expectRejection('partial boundary-symbol census', () => splitRelocatableTextSection(unsplitBytes, '.ob64.r0001', [
      { sectionName: '.ob64.r0001', bytes: 12, symbol: 'fixture', symbolSize: 32 },
      { sectionName: '.ob64.r0002', bytes: 20 },
    ])),
    expectRejection('incorrect continuation symbol size', () => splitRelocatableTextSection(unsplitBytes, '.ob64.r0001', [
      { sectionName: '.ob64.r0001', bytes: 12, symbol: 'fixture', symbolSize: 32 },
      { sectionName: '.ob64.r0002', bytes: 20, symbol: 'fixture_tail', symbolSize: 20 },
    ])),
  ];

  const directSource = path.join(root, 'direct-cross-section.s');
  write(directSource, [
    '.set noreorder',
    '.section .ob64.r0001,"ax",@progbits',
    '  beq $0,$0,cross_owner',
    '  nop',
    '.section .ob64.r0002,"ax",@progbits',
    'cross_owner:',
    '  jr $31',
    '  nop',
    '',
  ].join('\n'));
  const directAssemblyRejection = expectRejection(
    'GNU 2.6 cross-section branch relocation',
    () => runTool(toolchain.assemblerAbs, [
      ...toolchain.compilerAssemblerFlags,
      '-o',
      path.join(root, 'direct-cross-section.o'),
      directSource,
    ]),
    /Can not represent relocation in this object file format/,
  );

  const report = {
    schemaVersion: 1,
    status: 'pass',
    sourceBytes: fullText.length,
    ownerBytes: [firstOwner.length, secondOwner.length],
    boundary: { logicalOffset: 12, precedingBranchWord: firstOwner.readUInt32BE(8), delaySlotWord: secondOwner.readUInt32BE(0) },
    relocations: split.relocationSections,
    linkedSha256: sha256Buffer(splitLinked),
    splitEqualsUnsplit: true,
    logicalFunctionSymbolBytes: functionSymbols[0].size,
    continuationSymbol: {
      name: linkedBoundarySymbols[0].name,
      value: `0x${linkedBoundarySymbols[0].value.toString(16).toUpperCase()}`,
      size: linkedBoundarySymbols[0].size,
      binding: linkedBoundarySymbols[0].binding,
      type: linkedBoundarySymbols[0].symbolType,
      section: linkedSplitElf.sections[linkedBoundarySymbols[0].sectionIndex].name,
    },
    rejectedMutations,
    directAssemblyRejection,
  };
  fs.writeFileSync(path.join(root, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}

main();
