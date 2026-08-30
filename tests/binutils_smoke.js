#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  firstDiff,
  hashBuffer,
  hex,
  loadAndVerifyRom,
  parseHexOrNumber,
  readJson,
  writeJson,
} = require('../tools/lib/rom');
const {
  elfSectionBytes,
  parseElfFile,
} = require('../tools/lib/phase7_conventional');
const {
  loadPhase8Model,
  relocationRecords,
} = require('../tools/lib/phase8_matching_c');
const {
  assembleFileToBinary,
  assertToolchainAvailable,
  loadToolchainConfig,
  runTool,
  toolVersion,
} = require('../tools/lib/real_mips_toolchain');

const SMOKE_ROOT = path.join(ROOT, 'build', 'toolchain-smoke');

function sha256File(file) {
  return hashBuffer(fs.readFileSync(file), 'sha256');
}

function bytesToHex(bytes) {
  return Buffer.from(bytes).toString('hex').toUpperCase();
}

function requireValue(name, actual, expected) {
  if (actual !== expected) throw new Error(`${name} expected ${expected}, got ${actual}`);
}

function requirePrefix(name, bytes, expectedHex) {
  const actual = bytesToHex(bytes.subarray(0, expectedHex.length / 2));
  requireValue(name, actual, expectedHex);
}

function sectionBytes(elf, name) {
  const sections = elf.sections.filter((section) => section.name === name);
  if (sections.length !== 1) throw new Error(`section does not resolve uniquely: ${name}`);
  return Buffer.from(elfSectionBytes(elf, sections[0]));
}

function assembleText(config, { name, text, flags = config.compilerAssemblerFlags }) {
  const directory = path.join(SMOKE_ROOT, name);
  ensureDir(directory);
  const source = path.join(directory, `${name}.s`);
  const object = path.join(directory, `${name}.o`);
  const binary = path.join(directory, `${name}.bin`);
  fs.writeFileSync(source, text);
  const assembled = assembleFileToBinary({ source, outBin: binary, outObj: object, config, assemblerFlags: flags });
  return { source, object, extractionObject: assembled.extractionObject, binary, bytes: fs.readFileSync(binary), elf: parseElfFile(object) };
}

function loadReference() {
  const referencePath = path.join(ROOT, 'build', 'baserom.us_rev0.z64');
  return fs.existsSync(referencePath) ? fs.readFileSync(referencePath) : loadAndVerifyRom().z64;
}

function verifyToolIdentities(config) {
  const versions = {};
  const tools = {};
  for (const [name, executable] of Object.entries(config.toolsAbs)) {
    const relative = `bin/${path.basename(executable)}`;
    const expected = config.provenance.outputs[relative];
    tools[name] = { bytes: fs.statSync(executable).size, sha256: sha256File(executable) };
    if (!expected || tools[name].bytes !== expected.bytes || tools[name].sha256 !== expected.sha256) {
      throw new Error(`production tool identity drift: ${name}`);
    }
    if (Object.prototype.hasOwnProperty.call(config.versions, name)) {
      versions[name] = toolVersion(executable);
      requireValue(`${name} version`, versions[name], config.versions[name]);
    }
  }
  return { name: 'completePinnedToolBundle', ok: true, tools, versions };
}

function verifyPrimitiveAssembly(config) {
  const checks = [];
  const word = assembleText(config, {
    name: 'word_be',
    flags: config.baselineAssemblerFlags,
    text: '.set noat\n.set noreorder\n.text\n.word 0x3C08800B\n.word 0x2508EDB0\n',
  });
  requirePrefix('big-endian words', word.bytes, '3C08800B2508EDB0');
  requireValue('ELF class/data/machine flags', word.elf.header.flags, 0x10001001);
  const textSection = word.elf.sections.find((section) => section.name === '.text');
  if (!textSection || textSection.alignment !== 16 || textSection.size !== 16) {
    throw new Error('MIPS3/O32 text alignment drift');
  }
  checks.push({ name: 'bigEndianWordsAndMips3O32Flags', ok: true, bytesHex: bytesToHex(word.bytes), elfFlags: hex(word.elf.header.flags) });

  const instructions = assembleText(config, {
    name: 'instructions_be',
    text: '.set noat\n.set noreorder\n.text\nlui $t0,0x800b\naddiu $t0,$t0,-0x1250\njr $ra\nnop\n',
  });
  requireValue('real instruction bytes', bytesToHex(instructions.bytes), '3C08800B2508EDB003E0000800000000');
  checks.push({ name: 'realInstructionsBigEndian', ok: true, bytesHex: bytesToHex(instructions.bytes) });

  const branch = assembleText(config, {
    name: 'noreorder_branch',
    text: '.set noat\n.set noreorder\n.text\nbeq $zero,$zero,1f\naddiu $t0,$zero,1\n1:\nnop\n',
  });
  requirePrefix('noreorder delay slot', branch.bytes, '100000012408000100000000');
  checks.push({ name: 'noreorderDelaySlot', ok: true, bytesHex: bytesToHex(branch.bytes) });

  const moveSource = [
    '.set noat', '.set noreorder', '.text', '.globl move_alias_probe', 'move_alias_probe:',
    '    move $fp,$0', '    move $s8,$zero', '    move $30,$0', '    move $2,$3', '    jr $31', '    nop', '',
  ].join('\n');
  const move = assembleText(config, { name: 'move-alias-probe', text: moveSource });
  requireValue('KMC move aliases', bytesToHex(move.bytes), '0000F0210000F0210000F0210060102103E00008000000000000000000000000');
  requireValue('historical move probe object', sha256File(move.object), config.provenance.assemblerEquivalence.moveProbeObjectSha256);
  checks.push({
    name: 'kmcMoveAliasesUseAddu',
    ok: true,
    objectSha256: sha256File(move.object),
    textSha256: hashBuffer(sectionBytes(move.elf, '.text'), 'sha256'),
  });

  const explicitOr = assembleText(config, {
    name: 'explicit_retail_or',
    text: '.set noat\n.set noreorder\n.text\nor $2,$4,$zero\n',
  });
  requirePrefix('explicit retail OR', explicitOr.bytes, '00801025');
  checks.push({ name: 'explicitRetailOr', ok: true, instructionWord: '0x00801025' });

  const cop1 = assembleText(config, {
    name: 'cop1_transfer',
    text: '.set noat\n.set noreorder\n.text\nMFC1 $2,$f0\nMTC1 $4,$f1\n',
  });
  requirePrefix('ordinary-C COP1 transfers', cop1.bytes, '4402000044840800');
  let uppercasePrefixRejected = false;
  try {
    assembleText(config, {
      name: 'cop1_uppercase_prefix_falsifier',
      text: '.set noat\n.set noreorder\n.text\nmfc1 $2,$F0\n',
    });
  } catch (error) {
    uppercasePrefixRejected = /Illegal operands/.test(error.message);
    if (!uppercasePrefixRejected) throw error;
  }
  if (!uppercasePrefixRejected) throw new Error('noncanonical uppercase COP1 FPR prefix was accepted');
  checks.push({ name: 'cop1OrdinaryCFormsAndUppercasePrefixFalsifier', ok: true, bytesHex: bytesToHex(cop1.bytes), uppercasePrefixRejected });

  const laJal = assembleText(config, {
    name: 'la_jal',
    text: '.set noat\n.set noreorder\n.section .ob64.smoke_la,"ax",@progbits\n.globl smoke_la\nsmoke_la:\nla $4,external_address\njal external_call\n',
  });
  requireValue('adjacent la/jal bytes', bytesToHex(laJal.bytes), '3C040000248400000C000000');
  const relocations = relocationRecords(laJal.elf, { symbol: 'smoke_la', sectionName: '.ob64.smoke_la' });
  const expectedRelocations = [
    { offset: '0x00000000', type: 'R_MIPS_HI16', symbol: 'external_address', section: '.rel.text' },
    { offset: '0x00000004', type: 'R_MIPS_LO16', symbol: 'external_address', section: '.rel.text' },
    { offset: '0x00000008', type: 'R_MIPS_26', symbol: 'external_call', section: '.rel.text' },
  ];
  requireValue('adjacent la/jal relocations', JSON.stringify(relocations), JSON.stringify(expectedRelocations));
  checks.push({ name: 'adjacentLaDirectJal', ok: true, bytesHex: bytesToHex(laJal.bytes), relocations });

  const numericCall = assembleText(config, {
    name: 'numeric_absolute_call',
    text: '.set noat\n.set noreorder\n.text\njal 0x80012340\nnop\n',
  });
  requireValue('GNU 2.6 numeric absolute call bytes', bytesToHex(numericCall.bytes), '0C000000000000000000000000000000');
  const numericRelocations = relocationRecords(numericCall.elf, { symbol: 'numeric_absolute_call', sectionName: '.text' });
  requireValue('GNU 2.6 numeric absolute call relocations', JSON.stringify(numericRelocations), '[]');
  checks.push({ name: 'numericAbsoluteCallBehaviorPinned', ok: true, bytesHex: bytesToHex(numericCall.bytes), relocations: numericRelocations });

  const syntax = assembleText(config, {
    name: 'custom_syntax',
    text: [
      '.set noat', '.set noreorder', '.macro EMIT_IF value', '.if \\value', '.word 0x11223344', '.endif', '.endm',
      '.section .ob64.smoke_syntax,"ax",@progbits', '.globl smoke_syntax', '.ent smoke_syntax', 'smoke_syntax:',
      'EMIT_IF 1', 'jr $31', 'nop', '.end smoke_syntax', '',
    ].join('\n'),
  });
  requireValue('custom section/macro/conditional bytes', bytesToHex(syntax.bytes), '1122334403E0000800000000');
  if (!syntax.elf.sections.some((section) => section.name === '.ob64.smoke_syntax')) throw new Error('custom .ob64 section missing');
  checks.push({ name: 'customSectionEntEndMacroConditional', ok: true, bytesHex: bytesToHex(syntax.bytes) });
  return checks;
}

function verifyLinkerAndBinaryLma(config) {
  const directory = path.join(SMOKE_ROOT, 'linker_lma');
  ensureDir(directory);
  const left = assembleText(config, {
    name: 'linker_lma_left',
    text: '.section .ob64.smoke_a,"ax",@progbits\n.word 0x11223344\n',
    flags: config.baselineAssemblerFlags,
  });
  const right = assembleText(config, {
    name: 'linker_lma_right',
    text: '.section .ob64.smoke_b,"a",@progbits\n.word 0x55667788\n',
    flags: config.baselineAssemblerFlags,
  });
  const script = path.join(directory, 'linker.ld');
  const elfFile = path.join(directory, 'linker.elf');
  const mapFile = path.join(directory, 'linker.map');
  const binaryFile = path.join(directory, 'linker.bin');
  fs.writeFileSync(script, [
    'OUTPUT_FORMAT("elf32-bigmips")', 'OUTPUT_ARCH(mips)', 'SECTIONS', '{',
    '  .ob64.smoke_a 0x80100000 : AT(0x00000100) { *(.ob64.smoke_a) }',
    '  .ob64.smoke_b 0x80100000 : AT(0x00000200) { *(.ob64.smoke_b) }',
    '  /DISCARD/ : { *(.text) *(.data) *(.bss) *(.reginfo) *(.pdr) *(.comment) *(.note) }',
    '}', '',
  ].join('\n'));
  runTool(config.toolsAbs.linker, [...config.linkerFlags, '-T', script, '-Map', mapFile, '-o', elfFile, left.extractionObject, right.extractionObject], { cwd: directory });
  runTool(config.toolsAbs.objcopy, [...config.objcopyFlags, elfFile, binaryFile], { cwd: directory });
  const elf = parseElfFile(elfFile);
  const loads = elf.programHeaders.filter((header) => header.type === 1);
  if (loads.length !== 2
      || !loads.some((header) => header.vaddr === 0x80100000 && header.paddr === 0x100 && header.fileSize === 4 && header.flags === 5)
      || !loads.some((header) => header.vaddr === 0x80100000 && header.paddr === 0x200 && header.fileSize === 4 && header.flags === 4)) {
    throw new Error(`GNU 2.6 one-section PT_LOAD/LMA behavior drift: ${JSON.stringify(loads)}`);
  }
  const binary = fs.readFileSync(binaryFile);
  if (binary.length !== 0x104 || bytesToHex(binary.subarray(0, 4)) !== '11223344'
      || bytesToHex(binary.subarray(0x100, 0x104)) !== '55667788'
      || binary.subarray(4, 0x100).some((byte) => byte !== 0)) {
    throw new Error('GNU 2.6 binary LMA extraction drift');
  }
  return {
    name: 'linkerOneSectionLoadsAndBinaryLma',
    ok: true,
    loadHeaders: loads,
    elfSha256: sha256File(elfFile),
    binarySha256: sha256File(binaryFile),
  };
}

function verifyFirstTrackedChunk(config) {
  const manifest = readJson(path.join(ROOT, 'asm', 'original', 'rev0', 'manifest.json'));
  const first = manifest.chunks[0];
  const reference = loadReference();
  const start = parseHexOrNumber(first.romStart);
  const end = parseHexOrNumber(first.romEndExclusive);
  const parts = Array.isArray(first.parts) && first.parts.length ? first.parts : [first];
  const directory = path.join(SMOKE_ROOT, 'first_tracked_chunk');
  fs.mkdirSync(directory, { recursive: true });
  const buffers = [];
  let cursor = start;
  for (const [partIndex, part] of parts.entries()) {
    const partStart = parseHexOrNumber(part.romStart);
    const partEnd = parseHexOrNumber(part.romEndExclusive);
    if (partStart !== cursor) throw new Error('first tracked chunk part coverage drift');
    const stem = path.basename(part.file, '.s');
    const outBin = path.join(directory, `${stem}.bin`);
    const outObj = path.join(directory, `${stem}.o`);
    const adjustedSource = path.join(directory, `${stem}.s`);
    const sourceText = fs.readFileSync(path.join(ROOT, part.file), 'utf8');
    const textDirectives = sourceText.match(/^\s*\.text\s*$/gm) || [];
    if (textDirectives.length !== 1 || /^\s*\.section\b/m.test(sourceText)) throw new Error(`tracked source section grammar drift: ${part.file}`);
    fs.writeFileSync(adjustedSource, sourceText.replace(/^\s*\.text\s*$/m, `.section .ob64.smoke_part${partIndex},"ax",@progbits`));
    assembleFileToBinary({ source: adjustedSource, outBin, outObj, config, assemblerFlags: config.baselineAssemblerFlags });
    const bytes = fs.readFileSync(outBin);
    const difference = firstDiff(reference.subarray(partStart, partEnd), bytes);
    if (difference || bytes.length !== partEnd - partStart) throw new Error(`first tracked part mismatch at ${difference ? hex(partStart + difference.offset) : 'size'}`);
    buffers.push(bytes);
    cursor = partEnd;
  }
  const bytes = Buffer.concat(buffers);
  const difference = firstDiff(reference.subarray(start, end), bytes);
  if (cursor !== end || difference || bytes.length !== end - start) throw new Error('first tracked chunk GNU 2.6 mismatch');
  return { name: 'firstTrackedChunkExact', ok: true, bytes: bytes.length, sha256: hashBuffer(bytes, 'sha256') };
}

function verifyProductionCutover() {
  const deleted = [
    'config/compiler-assembly-dialect.json',
    'tools/lib/compiler_assembly_dialect.js',
    'tests/compiler_assembly_dialect.js',
    'tests/compiler_assembly_dialect_candidate.js',
  ];
  for (const relative of deleted) if (fs.existsSync(path.join(ROOT, relative))) throw new Error(`retired adapter path returned: ${relative}`);
  const activeFiles = [
    'config/toolchain.json', 'config/phase7/conventional-build.json', 'config/matching-c-targets.json',
    'config/matching-c-linkage.json', 'config/matching-c-multi-owner.json',
    'tools/build_phase7_conventional.js', 'tools/build_phase8_matching_c.js', 'tools/diff.js',
    'tools/verify_phase7_conventional.js', 'tools/verify_phase8_matching_c.js',
    'tools/lib/active_targets.js', 'tools/lib/current_workflow.js', 'tools/lib/phase7_conventional.js',
    'tools/lib/elf_text_split.js', 'tools/lib/phase8_matching_c.js', 'tools/lib/real_mips_toolchain.js',
  ];
  const forbidden = [/compiler-assembly-dialect/i, /compiler_assembly_dialect/i, /2\.39/, /readelf/i];
  for (const relative of activeFiles) {
    const text = fs.readFileSync(path.join(ROOT, relative), 'utf8');
    for (const pattern of forbidden) if (pattern.test(text)) throw new Error(`retired production dependency returned in ${relative}: ${pattern}`);
  }
  const phase8 = loadPhase8Model();
  if (phase8.targets.some((target) => target.rowIndex === 3066)) throw new Error('p3066 was activated by the toolchain migration');
  if (phase8.targets.some((target) => target.expectedRelocations.some((relocation) => relocation.section === '.rel.pdr'))) {
    throw new Error('discarded .pdr metadata remains in the active load-relevant relocation contract');
  }
  return { name: 'productionCutoverHasNoAdapterOrModernBinutils', ok: true, inspectedFiles: activeFiles.length, p3066Inactive: true };
}

function main() {
  const config = assertToolchainAvailable(loadToolchainConfig());
  if (config.sourceCommit !== '54514ded39ceb32165a125ddba04ca5b551773a2'
      || config.sourceCommit !== config.provenance.source.commit
      || config.releaseArchiveSha256 !== config.provenance.source.releaseArchiveSha256) {
    throw new Error('GNU Binutils 2.6 source/release identity drift');
  }
  const checks = [
    verifyToolIdentities(config),
    ...verifyPrimitiveAssembly(config),
    verifyLinkerAndBinaryLma(config),
    verifyFirstTrackedChunk(config),
    verifyProductionCutover(),
  ];
  const report = {
    schemaVersion: 2,
    tool: 'binutils_smoke',
    toolchain: {
      id: config.id,
      sourceProject: config.sourceProject,
      sourceCommit: config.sourceCommit,
      releaseArchiveSha256: config.releaseArchiveSha256,
      buildProvenance: config.buildProvenance,
      buildProvenanceSha256: sha256File(config.provenancePath),
      baselineAssemblerFlags: config.baselineAssemblerFlags,
      compilerAssemblerFlags: config.compilerAssemblerFlags,
      linkerFlags: config.linkerFlags,
      objcopyFlags: config.objcopyFlags,
    },
    ok: true,
    checks,
  };
  const reportPath = path.join(SMOKE_ROOT, 'binutils-smoke-report.json');
  writeJson(reportPath, report);
  for (const check of checks) console.log(`PASS ${check.name}`);
  console.log(`Report: ${reportPath}`);
}

main();
