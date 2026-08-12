#!/usr/bin/env node
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
const { relocationRecords } = require('../tools/lib/phase8_matching_c');
const {
  assembleFileToBinary,
  assertToolchainAvailable,
  loadToolchainConfig,
  toolVersion,
} = require('../tools/lib/real_mips_toolchain');
const {
  DIALECT_RULE_IDS,
  LA_JAL_RULE_ID,
  applyCompilerAssemblyDialect,
} = require('../tools/lib/compiler_assembly_dialect');

function bytesToHex(bytes) {
  return Buffer.from(bytes).toString('hex').toUpperCase();
}

function loadReference() {
  const referencePath = path.join(ROOT, 'build', 'baserom.us_rev0.z64');
  if (fs.existsSync(referencePath)) return fs.readFileSync(referencePath);
  return loadAndVerifyRom().z64;
}

function assembleText({ name, text }) {
  const dir = path.join(ROOT, 'build', 'toolchain-smoke', name);
  ensureDir(dir);
  const asmPath = path.join(dir, `${name}.s`);
  const objPath = path.join(dir, `${name}.o`);
  const binPath = path.join(dir, `${name}.bin`);
  fs.writeFileSync(asmPath, text);
  assembleFileToBinary({ source: asmPath, outBin: binPath, outObj: objPath });
  return {
    asmPath,
    objPath,
    binPath,
    bytes: fs.readFileSync(binPath),
  };
}

function requireHex(name, actual, expected) {
  if (actual !== expected) throw new Error(`${name} expected ${expected}, got ${actual}`);
}

function instructionWords(bytes) {
  if (bytes.length % 4 !== 0) throw new Error(`Instruction byte count is not word-aligned: ${bytes.length}`);
  const words = [];
  for (let offset = 0; offset < bytes.length; offset += 4) {
    words.push(`0x${bytes.readUInt32BE(offset).toString(16).toUpperCase().padStart(8, '0')}`);
  }
  return words;
}

function verifyDialectExclusion({ name, text, expectedWords = null }) {
  const input = Buffer.from(text, 'utf8');
  const decision = applyCompilerAssemblyDialect(input, 'PURE_C');
  if (!decision.output.equals(input)) throw new Error(`${name} adapter output changed valid excluded input`);
  if (decision.transformationCount !== 0
      || !DIALECT_RULE_IDS.every((ruleId) => decision.ruleTransformations[ruleId] === 0)) {
    throw new Error(`${name} adapter recorded a transformation for valid excluded input`);
  }
  const raw = assembleText({ name: `${name}_raw`, text });
  const adapted = assembleText({ name: `${name}_adapted`, text: decision.output.toString('utf8') });
  const rawWords = instructionWords(raw.bytes);
  const adaptedWords = instructionWords(adapted.bytes);
  if (!raw.bytes.equals(adapted.bytes) || JSON.stringify(rawWords) !== JSON.stringify(adaptedWords)) {
    throw new Error(`${name} raw and adapted instruction words differ`);
  }
  if (expectedWords && JSON.stringify(rawWords) !== JSON.stringify(expectedWords)) {
    throw new Error(`${name} instruction words expected ${JSON.stringify(expectedWords)}, got ${JSON.stringify(rawWords)}`);
  }
  return {
    name,
    inputSha256: hashBuffer(input, 'sha256'),
    adaptedSha256: hashBuffer(decision.output, 'sha256'),
    transformationCount: decision.transformationCount,
    newRuleTransformations: decision.ruleTransformations[LA_JAL_RULE_ID],
    rawTextSha256: hashBuffer(raw.bytes, 'sha256'),
    adaptedTextSha256: hashBuffer(adapted.bytes, 'sha256'),
    instructionWords: rawWords,
  };
}

function main() {
  const config = assertToolchainAvailable(loadToolchainConfig());
  const asVersion = toolVersion(config.assemblerAbs);
  const objcopyVersion = toolVersion(config.objcopyAbs);
  const checks = [];

  const word = assembleText({
    name: 'word_be',
    text: `.set noat
.set noreorder
.text
.globl word_be
word_be:
.word 0x3C08800B
.word 0x2508EDB0
`,
  });
  const wordHex = bytesToHex(word.bytes);
  requireHex('word_be', wordHex, '3C08800B2508EDB0');
  checks.push({ name: 'wordBigEndian', ok: true, bytesHex: wordHex });

  const instructions = assembleText({
    name: 'instructions_be',
    text: `.set noat
.set noreorder
.set nomacro
.text
.globl instructions_be
instructions_be:
lui $t0, 0x800b
addiu $t0, $t0, -0x1250
jr $ra
nop
`,
  });
  const instructionHex = bytesToHex(instructions.bytes);
  requireHex('instructions_be', instructionHex, '3C08800B2508EDB003E0000800000000');
  checks.push({ name: 'realInstructionsBigEndian', ok: true, bytesHex: instructionHex });

  const noreorder = assembleText({
    name: 'noreorder_branch',
    text: `.set noat
.set noreorder
.set nomacro
.text
.globl noreorder_branch
noreorder_branch:
beq $zero, $zero, target
addiu $t0, $zero, 1
target:
nop
`,
  });
  const noreorderHex = bytesToHex(noreorder.bytes);
  requireHex('noreorder_branch', noreorderHex, '100000012408000100000000');
  checks.push({ name: 'noreorderKeepsDelaySlot', ok: true, bytesHex: noreorderHex });

  const rawMove = assembleText({
    name: 'raw_gnu_move',
    text: `.set noreorder
.text
raw_gnu_move:
move $2,$4
`,
  });
  const rawMoveHex = bytesToHex(rawMove.bytes);
  requireHex('raw_gnu_move', rawMoveHex, '00801025');
  const adaptedSource = applyCompilerAssemblyDialect(Buffer.from(`.set noreorder
.text
adapted_gnu_move:
move $2,$4
`), 'PURE_C').output;
  const adaptedMove = assembleText({
    name: 'adapted_gnu_move',
    text: adaptedSource.toString('utf8'),
  });
  const adaptedMoveHex = bytesToHex(adaptedMove.bytes);
  requireHex('adapted_gnu_move', adaptedMoveHex, '00801021');
  checks.push({
    name: 'dialectMoveEncoding',
    ok: true,
    rawGnuMoveHex: rawMoveHex,
    adaptedAdduHex: adaptedMoveHex,
  });

  const adjacentDecision = applyCompilerAssemblyDialect(Buffer.from(`.text
dialect_la_jal:
la $4,external_address
jal external_call
`), 'PURE_C');
  const adjacent = assembleText({
    name: 'dialect_la_jal',
    text: adjacentDecision.output.toString('utf8'),
  });
  const adjacentHex = bytesToHex(adjacent.bytes);
  requireHex('dialect_la_jal', adjacentHex, '3C0400000C00000024840000');
  const adjacentElf = parseElfFile(adjacent.objPath);
  const adjacentTextSection = adjacentElf.sections.find((section) => section.name === '.text');
  if (!adjacentTextSection || !Buffer.from(elfSectionBytes(adjacentElf, adjacentTextSection)).equals(adjacent.bytes)) {
    throw new Error('dialect la/jal object text section drift');
  }
  const adjacentRelocations = relocationRecords(adjacentElf, { sectionName: '.text' })
    .filter((record) => record.section === '.rel.text');
  const expectedAdjacentRelocations = [
    { offset: '0x00000000', type: 'R_MIPS_HI16', symbol: 'external_address', section: '.rel.text' },
    { offset: '0x00000004', type: 'R_MIPS_26', symbol: 'external_call', section: '.rel.text' },
    { offset: '0x00000008', type: 'R_MIPS_LO16', symbol: 'external_address', section: '.rel.text' },
  ];
  if (JSON.stringify(adjacentRelocations) !== JSON.stringify(expectedAdjacentRelocations)) {
    throw new Error(`dialect la/jal relocation drift: ${JSON.stringify(adjacentRelocations)}`);
  }
  checks.push({
    name: 'dialectLaJalDelaySlotAndRelocations',
    ok: true,
    bytesHex: adjacentHex,
    relocations: adjacentRelocations,
  });

  const strictIdentifierExclusions = [
    verifyDialectExclusion({
      name: 'dialect_excluded_current_location_address',
      text: '.text\nla $4,.\njal ext_call\n',
      expectedWords: ['0x3C040000', '0x0C000000', '0x24840000'],
    }),
    verifyDialectExclusion({
      name: 'dialect_excluded_section_address',
      text: '.data\n.word 0\n.text\nla $4,.data\njal ext_call\n',
      expectedWords: ['0x3C040000', '0x0C000000', '0x24840000'],
    }),
    verifyDialectExclusion({
      name: 'dialect_excluded_current_location_call',
      text: '.text\nla $4,ext_address\njal .\n',
      expectedWords: ['0x3C040000', '0x24840000', '0x0C000002', '0x00000000'],
    }),
  ];
  const registerCallCases = [
    ['$zero', 'zero'],
    ['$at', 'at'],
    ['$v0', 'value'],
    ['$a0', 'argument'],
    ['$t0', 'temporary'],
    ['$t9', 'temporary_t9'],
    ['$s0', 'saved'],
    ['$s8', 'saved_s8'],
    ['$k0', 'kernel'],
    ['$gp', 'global_pointer'],
    ['$sp', 'stack_pointer'],
    ['$fp', 'frame_pointer'],
    ['$ra', 'return_address'],
    ['$31', 'numeric_31'],
  ];
  for (const [register, suffix] of registerCallCases) {
    let expectedWords = null;
    if (register === '$ra' || register === '$31') {
      expectedWords = ['0x3C040000', '0x24840000', '0x03E0F809', '0x00000000'];
    } else if (register === '$t9') {
      expectedWords = ['0x3C040000', '0x24840000', '0x0320F809', '0x00000000'];
    }
    strictIdentifierExclusions.push(verifyDialectExclusion({
      name: `dialect_excluded_jal_register_${suffix}`,
      text: `.text\nla $4,ext_address\njal ${register}\n`,
      expectedWords,
    }));
  }
  checks.push({
    name: 'dialectStrictCLinkageIdentifierExclusions',
    ok: true,
    cases: strictIdentifierExclusions,
  });

  const cop1Transfers = verifyDialectExclusion({
    name: 'dialect_cop1_numeric_transfer_passthrough',
    text: '.text\nmtc1 $4,$f12\nmfc1 $5,$f6\n',
    expectedWords: ['0x44846000', '0x44053000', '0x00000000'],
  });
  checks.push({
    name: 'dialectCop1NumericTransfersByteIdenticalPassthrough',
    ok: true,
    ...cop1Transfers,
  });

  const manifest = readJson(path.join(ROOT, 'asm', 'original', 'rev0', 'manifest.json'));
  const first = manifest.chunks[0];
  const firstDir = path.join(ROOT, 'build', 'toolchain-smoke', 'first_tracked_chunk');
  const reference = loadReference();
  const start = parseHexOrNumber(first.romStart);
  const end = parseHexOrNumber(first.romEndExclusive);
  const firstParts = Array.isArray(first.parts) && first.parts.length > 0 ? first.parts : [first];
  let partCursor = start;
  const partReports = [];
  const partBuffers = [];
  for (const part of firstParts) {
    const partStart = parseHexOrNumber(part.romStart);
    const partEnd = parseHexOrNumber(part.romEndExclusive);
    if (partStart !== partCursor) throw new Error(`First tracked part starts at ${hex(partStart)}, expected ${hex(partCursor)}`);
    const partSource = path.join(ROOT, part.file);
    const stem = path.basename(part.file, '.s');
    const partBin = path.join(firstDir, `${stem}.bin`);
    const partObj = path.join(firstDir, `${stem}.o`);
    assembleFileToBinary({ source: partSource, outBin: partBin, outObj: partObj, config });
    const partBytes = fs.readFileSync(partBin);
    const partReferenceSlice = reference.subarray(partStart, partEnd);
    const partDiff = firstDiff(partReferenceSlice, partBytes);
    if (partDiff || partBytes.length !== partEnd - partStart) {
      throw new Error(`First tracked part real-assembler mismatch at ${partDiff ? hex(partStart + partDiff.offset) : 'size'}`);
    }
    partReports.push({
      name: part.name || null,
      file: part.file,
      romStart: part.romStart,
      romEndExclusive: part.romEndExclusive,
      bytes: partBytes.length,
      sha256: hashBuffer(partBytes, 'sha256'),
    });
    partBuffers.push(partBytes);
    partCursor = partEnd;
  }
  if (partCursor !== end) throw new Error(`First tracked parts end at ${hex(partCursor)}, expected ${hex(end)}`);
  const firstBytes = Buffer.concat(partBuffers);
  const referenceSlice = reference.subarray(start, end);
  const diff = firstDiff(referenceSlice, firstBytes);
  if (diff || firstBytes.length !== end - start) {
    throw new Error(`First tracked chunk real-assembler mismatch at ${diff ? hex(start + diff.offset) : 'size'}`);
  }
  checks.push({
    name: 'firstTrackedChunkRealAssembler',
    ok: true,
    file: first.file,
    romStart: first.romStart,
    romEndExclusive: first.romEndExclusive,
    bytes: firstBytes.length,
    sha256: hashBuffer(firstBytes, 'sha256'),
    parts: partReports,
  });

  const report = {
    tool: 'binutils_smoke',
    toolchain: {
      id: config.id,
      kind: config.kind,
      sourceUrl: config.sourceUrl,
      sourceProject: config.sourceProject,
      localRoot: config.localRoot,
      archiveSha256: config.archiveSha256,
      assembler: config.assembler,
      objcopy: config.objcopy,
      assemblerVersion: asVersion,
      objcopyVersion,
      assemblerFlags: config.assemblerFlags,
      objcopyFlags: config.objcopyFlags,
    },
    ok: true,
    checks,
  };
  const reportPath = path.join(ROOT, 'build', 'toolchain-smoke', 'binutils-smoke-report.json');
  writeJson(reportPath, report);
  console.log(`Toolchain: ${config.id}`);
  console.log(`Assembler: ${asVersion}`);
  console.log(`Objcopy: ${objcopyVersion}`);
  for (const check of checks) console.log(`PASS ${check.name}`);
  console.log(`Report: ${reportPath}`);
}

main();
