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
} = require('./lib/rom');
const { assembleWordAsmFile } = require('./lib/word_asm');
const { assembleFileToBinary, loadToolchainConfig } = require('./lib/real_mips_toolchain');

function usage() {
  console.log(`Usage: node tools/assemble_original_mips.js [--source-report <json>] [--tracked-dir <dir>] [--real-asm-out <dir>] [--strict-tracked] [--no-tracked] [--no-real-asm] [--out <bin>] [--report <json>] [--reference <z64>]\n\nAssembles the no-gap MIPS reference for the Rev 0 code region into a binary blob and verifies it against the normalized baserom code bytes. Tracked source chunks under asm/original/rev0 are preferred when present and normally use the real GNU MIPS assembler; generated build chunks remain the .word fallback unless --strict-tracked is used.`);
}

function parseArgs(argv) {
  const args = {
    sourceReport: path.join(ROOT, 'build', 'original-mips', 'rev0-report.json'),
    out: path.join(ROOT, 'build', 'assembled', 'rev0', 'code.bin'),
    report: path.join(ROOT, 'build', 'assembled', 'rev0-report.json'),
    reference: path.join(ROOT, 'build', 'baserom.us_rev0.z64'),
    trackedDir: path.join(ROOT, 'asm', 'original', 'rev0'),
    realAsmOutDir: path.join(ROOT, 'build', 'real-asm', 'rev0', 'chunks'),
    useTracked: true,
    useRealAsmForTracked: true,
    strictTracked: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--source-report') {
      args.sourceReport = path.resolve(argv[++i]);
    } else if (arg === '--out') {
      args.out = path.resolve(argv[++i]);
    } else if (arg === '--report') {
      args.report = path.resolve(argv[++i]);
    } else if (arg === '--reference') {
      args.reference = path.resolve(argv[++i]);
    } else if (arg === '--tracked-dir') {
      args.trackedDir = path.resolve(argv[++i]);
    } else if (arg === '--real-asm-out') {
      args.realAsmOutDir = path.resolve(argv[++i]);
    } else if (arg === '--no-real-asm') {
      args.useRealAsmForTracked = false;
    } else if (arg === '--strict-tracked') {
      args.strictTracked = true;
    } else if (arg === '--no-tracked') {
      args.useTracked = false;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function loadReference(referencePath) {
  if (fs.existsSync(referencePath)) return fs.readFileSync(referencePath);
  return loadAndVerifyRom().z64;
}

function selectChunkSource(chunk, args) {
  const generatedPath = path.resolve(ROOT, chunk.file);
  const trackedPath = path.join(args.trackedDir, path.basename(chunk.file));
  if (args.useTracked && fs.existsSync(trackedPath)) {
    return { path: trackedPath, kind: 'tracked' };
  }
  if (args.strictTracked) {
    throw new Error(`Tracked assembly chunk missing: ${trackedPath}`);
  }
  return { path: generatedPath, kind: 'generated' };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.sourceReport)) {
    throw new Error(`Original MIPS source report not found: ${args.sourceReport}\nRun: node tools/extract_original_mips.js`);
  }
  const sourceReport = readJson(args.sourceReport);
  const chunks = sourceReport.chunks || [];
  if (!chunks.length) throw new Error(`Source report has no chunks: ${args.sourceReport}`);

  const codeStart = parseHexOrNumber(sourceReport.codeRegion.start);
  const codeEnd = parseHexOrNumber(sourceReport.codeRegion.endExclusive);
  let cursor = codeStart;
  const buffers = [];
  const chunkReports = [];
  let totalWords = 0;
  const sourceCounts = {
    trackedRealAsm: 0,
    trackedWordAsm: 0,
    generated: 0,
  };
  const toolchainConfig = args.useRealAsmForTracked ? loadToolchainConfig() : null;

  for (const chunk of chunks) {
    const start = parseHexOrNumber(chunk.romStart);
    const end = parseHexOrNumber(chunk.romEndExclusive);
    if (start !== cursor) throw new Error(`Chunk ${chunk.file} starts at ${hex(start)}, expected ${hex(cursor)}`);
    const selected = selectChunkSource(chunk, args);
    const filePath = selected.path;
    if (!fs.existsSync(filePath)) throw new Error(`Assembly chunk missing: ${filePath}`);
    let assembled;
    let sourceKind = selected.kind;
    let tool = 'word-asm';
    if (selected.kind === 'tracked' && args.useRealAsmForTracked) {
      const outBin = path.join(args.realAsmOutDir, `${path.basename(filePath, '.s')}.bin`);
      const outObj = path.join(args.realAsmOutDir, `${path.basename(filePath, '.s')}.o`);
      assembleFileToBinary({ source: filePath, outBin, outObj, config: toolchainConfig });
      const bytes = fs.readFileSync(outBin);
      assembled = { bytes, words: bytes.length / 4, outBin, outObj };
      sourceKind = 'tracked-real-asm';
      tool = toolchainConfig.id;
    } else {
      assembled = assembleWordAsmFile(filePath);
      if (selected.kind === 'tracked') sourceKind = 'tracked-word-asm';
    }
    if (assembled.bytes.length !== end - start || assembled.bytes.length !== chunk.bytes) {
      throw new Error(`Assembled chunk size mismatch for ${chunk.file}: got ${assembled.bytes.length}, expected ${chunk.bytes}`);
    }
    buffers.push(assembled.bytes);
    totalWords += assembled.words;
    chunkReports.push({
      file: path.relative(ROOT, filePath).replace(/\\/g, '/'),
      source: sourceKind,
      tool,
      toolOutput: assembled.outBin ? path.relative(ROOT, assembled.outBin).replace(/\\/g, '/') : null,
      romStart: hex(start),
      romEndExclusive: hex(end),
      bytes: assembled.bytes.length,
      words: assembled.words,
      sha256: hashBuffer(assembled.bytes, 'sha256'),
    });
    if (sourceKind === 'tracked-real-asm') sourceCounts.trackedRealAsm += 1;
    else if (sourceKind === 'tracked-word-asm') sourceCounts.trackedWordAsm += 1;
    else sourceCounts.generated += 1;
    cursor = end;
  }
  if (cursor !== codeEnd) throw new Error(`Chunks end at ${hex(cursor)}, expected ${hex(codeEnd)}`);

  const assembledCode = Buffer.concat(buffers);
  if (assembledCode.length !== codeEnd - codeStart) {
    throw new Error(`Assembled code length ${assembledCode.length} != code region length ${codeEnd - codeStart}`);
  }

  const reference = loadReference(args.reference);
  const referenceSlice = reference.subarray(codeStart, codeEnd);
  const diff = firstDiff(referenceSlice, assembledCode);
  const exactToReference = !diff && hashBuffer(referenceSlice, 'sha256') === hashBuffer(assembledCode, 'sha256');

  ensureDir(path.dirname(args.out));
  fs.writeFileSync(args.out, assembledCode);

  const report = {
    tool: 'assemble_original_mips',
    profile: sourceReport.profile,
    sourceReportPath: path.relative(ROOT, args.sourceReport).replace(/\\/g, '/'),
    outputPath: path.relative(ROOT, args.out).replace(/\\/g, '/'),
    codeRegion: {
      start: hex(codeStart),
      endExclusive: hex(codeEnd),
      bytes: assembledCode.length,
    },
    chunkCount: chunkReports.length,
    sources: {
      trackedDir: path.relative(ROOT, args.trackedDir).replace(/\\/g, '/'),
      trackedRealAsmChunks: sourceCounts.trackedRealAsm,
      trackedWordAsmChunks: sourceCounts.trackedWordAsm,
      generatedChunks: sourceCounts.generated,
      realAsmForTracked: args.useRealAsmForTracked,
      strictTracked: args.strictTracked,
    },
    words: totalWords,
    chunks: chunkReports,
    assembled: {
      sha256: hashBuffer(assembledCode, 'sha256'),
    },
    reference: {
      path: args.reference,
      sliceSha256: hashBuffer(referenceSlice, 'sha256'),
    },
    exactToReference,
    firstDiff: diff
      ? {
          offset: hex(codeStart + diff.offset),
          expected: diff.expected == null ? null : hex(diff.expected, 2),
          actual: diff.actual == null ? null : hex(diff.actual, 2),
        }
      : null,
  };
  writeJson(args.report, report);
  console.log(`Assembled code: ${args.out}`);
  console.log(`Bytes: ${assembledCode.length}`);
  console.log(`SHA256 assembled: ${report.assembled.sha256}`);
  console.log(`SHA256 reference: ${report.reference.sliceSha256}`);
  console.log(`Exact code-region match: ${exactToReference ? 'PASS' : 'FAIL'}`);
  console.log(`Report: ${args.report}`);
  if (!exactToReference) process.exitCode = 1;
}

main();
