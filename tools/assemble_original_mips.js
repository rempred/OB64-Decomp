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

function usage() {
  console.log(`Usage: node tools/assemble_original_mips.js [--source-report <json>] [--out <bin>] [--report <json>] [--reference <z64>]\n\nAssembles the generated no-gap .word MIPS reference for the Rev 0 code region into a binary blob and verifies it against the normalized baserom code bytes.`);
}

function parseArgs(argv) {
  const args = {
    sourceReport: path.join(ROOT, 'build', 'original-mips', 'rev0-report.json'),
    out: path.join(ROOT, 'build', 'assembled', 'rev0', 'code.bin'),
    report: path.join(ROOT, 'build', 'assembled', 'rev0-report.json'),
    reference: path.join(ROOT, 'build', 'baserom.us_rev0.z64'),
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

  for (const chunk of chunks) {
    const start = parseHexOrNumber(chunk.romStart);
    const end = parseHexOrNumber(chunk.romEndExclusive);
    if (start !== cursor) throw new Error(`Chunk ${chunk.file} starts at ${hex(start)}, expected ${hex(cursor)}`);
    const filePath = path.resolve(ROOT, chunk.file);
    if (!fs.existsSync(filePath)) throw new Error(`Assembly chunk missing: ${filePath}`);
    const assembled = assembleWordAsmFile(filePath);
    if (assembled.bytes.length !== end - start || assembled.bytes.length !== chunk.bytes) {
      throw new Error(`Assembled chunk size mismatch for ${chunk.file}: got ${assembled.bytes.length}, expected ${chunk.bytes}`);
    }
    buffers.push(assembled.bytes);
    totalWords += assembled.words;
    chunkReports.push({
      file: chunk.file,
      romStart: hex(start),
      romEndExclusive: hex(end),
      bytes: assembled.bytes.length,
      words: assembled.words,
      sha256: hashBuffer(assembled.bytes, 'sha256'),
    });
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
    chunks: chunkReports.length,
    words: totalWords,
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
