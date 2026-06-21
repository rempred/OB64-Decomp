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
  readJson,
  writeJson,
} = require('../tools/lib/rom');
const {
  assembleFileToBinary,
  assertToolchainAvailable,
  loadToolchainConfig,
  toolVersion,
} = require('../tools/lib/real_mips_toolchain');

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

  const manifest = readJson(path.join(ROOT, 'asm', 'original', 'rev0', 'manifest.json'));
  const first = manifest.chunks[0];
  const firstSource = path.join(ROOT, first.file);
  const firstDir = path.join(ROOT, 'build', 'toolchain-smoke', 'first_tracked_chunk');
  const firstBin = path.join(firstDir, 'code_00001000_00011000.bin');
  const firstObj = path.join(firstDir, 'code_00001000_00011000.o');
  assembleFileToBinary({ source: firstSource, outBin: firstBin, outObj: firstObj, config });
  const firstBytes = fs.readFileSync(firstBin);
  const reference = loadReference();
  const start = Number.parseInt(first.romStart, 16);
  const end = Number.parseInt(first.romEndExclusive, 16);
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
