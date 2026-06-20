#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  hashBuffer,
  hex,
  loadAndVerifyRom,
  parseHexOrNumber,
  readJson,
  writeJson,
} = require('./lib/rom');

function usage() {
  console.log(`Usage: node tools/extract_rom_segments.js [--input <rom>] [--ledger <json>] [--out <dir>]\n\nExtracts raw Rev 0 ROM segment spans from the coverage ledger into build/segments/rev0/ and writes a manifest for exact rebuilds.`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    ledger: path.join(ROOT, 'build', 'coverage', 'rev0-rom-coverage-ledger.json'),
    outDir: path.join(ROOT, 'build', 'segments', 'rev0'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--input') {
      args.input = argv[++i];
    } else if (arg === '--ledger') {
      args.ledger = path.resolve(argv[++i]);
    } else if (arg === '--out') {
      args.outDir = path.resolve(argv[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function sanitize(value) {
  return String(value).replace(/[^A-Za-z0-9_.-]+/g, '_');
}

function loadLedger(ledgerPath) {
  if (!fs.existsSync(ledgerPath)) {
    throw new Error(`Coverage ledger not found: ${ledgerPath}\nRun: node tools/build_rom_coverage_ledger.js`);
  }
  const ledger = readJson(ledgerPath);
  if (!Array.isArray(ledger.spans) || ledger.spans.length === 0) {
    throw new Error(`Coverage ledger has no spans: ${ledgerPath}`);
  }
  return ledger;
}

function validateSpans(spans, expectedSize) {
  let cursor = 0;
  for (let i = 0; i < spans.length; i += 1) {
    const span = spans[i];
    const start = parseHexOrNumber(span.start);
    const end = parseHexOrNumber(span.endExclusive);
    if (start !== cursor) {
      throw new Error(`Ledger span ${i} is not contiguous: expected ${hex(cursor)}, got ${hex(start)}`);
    }
    if (end <= start) throw new Error(`Ledger span ${i} has invalid range ${span.start}..${span.endExclusive}`);
    if (span.bytes !== end - start) throw new Error(`Ledger span ${i} byte count mismatch`);
    cursor = end;
  }
  if (cursor !== expectedSize) {
    throw new Error(`Ledger spans end at ${hex(cursor)}, expected ROM size ${hex(expectedSize)}`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = loadAndVerifyRom({ inputPath: args.input });
  if (!result.verification.ok) {
    for (const check of result.verification.checks.filter((check) => !check.ok)) {
      console.error(`Rev 0 verification failed: ${check.name} expected ${check.expected}, got ${check.actual}`);
    }
    process.exit(1);
  }

  const ledger = loadLedger(args.ledger);
  validateSpans(ledger.spans, result.z64.length);
  ensureDir(args.outDir);

  const segmentDir = path.join(args.outDir, 'raw');
  ensureDir(segmentDir);
  const segments = [];

  for (let i = 0; i < ledger.spans.length; i += 1) {
    const span = ledger.spans[i];
    const start = parseHexOrNumber(span.start);
    const end = parseHexOrNumber(span.endExclusive);
    const category = sanitize(span.category || 'unknown');
    const fileName = `${String(i).padStart(4, '0')}_${category}_${start.toString(16).toUpperCase().padStart(8, '0')}_${end.toString(16).toUpperCase().padStart(8, '0')}.bin`;
    const relPath = path.posix.join('raw', fileName);
    const outPath = path.join(segmentDir, fileName);
    const bytes = Buffer.from(result.z64.subarray(start, end));
    fs.writeFileSync(outPath, bytes);
    segments.push({
      index: i,
      file: relPath,
      start: hex(start),
      endExclusive: hex(end),
      bytes: bytes.length,
      category: span.category,
      categories: span.categories || null,
      overlap: Boolean(span.overlap),
      sha256: hashBuffer(bytes, 'sha256'),
    });
  }

  const manifest = {
    tool: 'extract_rom_segments',
    profile: ledger.profile || 'us-rev0',
    inputPath: result.inputPath,
    source: {
      byteOrder: result.detectedByteOrder,
      z64Sha256: result.hashes.z64Sha256,
      z64Md5: result.hashes.z64Md5,
      n64Md5: result.hashes.n64Md5,
      crc1: result.verification.header.crc1,
      crc2: result.verification.header.crc2,
      sizeBytes: result.z64.length,
    },
    ledger: {
      path: path.relative(ROOT, args.ledger).replace(/\\/g, '/'),
      sha256: hashBuffer(fs.readFileSync(args.ledger), 'sha256'),
      spans: ledger.spans.length,
      unknownBytes: ledger.summary?.unknownBytes ?? null,
      archiveCount: ledger.archiveScan?.count ?? null,
    },
    outputDir: path.relative(ROOT, args.outDir).replace(/\\/g, '/'),
    segmentCount: segments.length,
    totalBytes: segments.reduce((sum, segment) => sum + segment.bytes, 0),
    segments,
  };

  const manifestPath = path.join(args.outDir, 'manifest.json');
  writeJson(manifestPath, manifest);
  console.log(`Rev 0 ROM verified: ${manifest.source.crc1}/${manifest.source.crc2}`);
  console.log(`Extracted ${segments.length} span segment(s), ${manifest.totalBytes} bytes`);
  console.log(`Manifest: ${manifestPath}`);
}

main();
