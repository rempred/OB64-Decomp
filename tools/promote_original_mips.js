#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  hashBuffer,
  readJson,
  writeJson,
} = require('./lib/rom');

function usage() {
  console.log(`Usage: node tools/promote_original_mips.js [--source-report <json>] [--out <dir>] [--count <n> | --all | --chunk <file> ...] [--force]\n\nCopies generated no-gap original MIPS chunks into tracked asm/original/rev0 source. Use small batches so generated proof artifacts become curated source deliberately. Existing tracked chunks are not overwritten unless --force is supplied.`);
}

function parseArgs(argv) {
  const args = {
    sourceReport: path.join(ROOT, 'build', 'original-mips', 'rev0-report.json'),
    outDir: path.join(ROOT, 'asm', 'original', 'rev0'),
    count: 1,
    all: false,
    chunks: [],
    force: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--source-report') {
      args.sourceReport = path.resolve(argv[++i]);
    } else if (arg === '--out') {
      args.outDir = path.resolve(argv[++i]);
    } else if (arg === '--count') {
      args.count = Number.parseInt(argv[++i], 10);
    } else if (arg === '--all') {
      args.all = true;
    } else if (arg === '--chunk') {
      args.chunks.push(argv[++i]);
    } else if (arg === '--force') {
      args.force = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!Number.isInteger(args.count) || args.count < 0) throw new Error('--count must be a non-negative integer');
  return args;
}

function selectChunks(report, args) {
  const chunks = report.chunks || [];
  if (!chunks.length) throw new Error(`Source report has no chunks: ${args.sourceReport}`);
  if (args.all) return chunks;
  if (args.chunks.length) {
    const wanted = new Set(args.chunks.map((name) => path.basename(name)));
    const selected = chunks.filter((chunk) => wanted.has(path.basename(chunk.file)));
    if (selected.length !== wanted.size) {
      const found = new Set(selected.map((chunk) => path.basename(chunk.file)));
      const missing = [...wanted].filter((name) => !found.has(name));
      throw new Error(`Requested chunk(s) not found in source report: ${missing.join(', ')}`);
    }
    return selected;
  }
  return chunks.slice(0, args.count);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.sourceReport)) {
    throw new Error(`Original MIPS source report not found: ${args.sourceReport}\nRun: node tools/extract_original_mips.js`);
  }
  const report = readJson(args.sourceReport);
  const selected = selectChunks(report, args);
  ensureDir(args.outDir);

  const promoted = [];
  for (const chunk of selected) {
    const source = path.resolve(ROOT, chunk.file);
    if (!fs.existsSync(source)) throw new Error(`Generated source chunk missing: ${source}`);
    const dest = path.join(args.outDir, path.basename(chunk.file));
    if (fs.existsSync(dest) && !args.force) {
      throw new Error(`Tracked chunk already exists: ${dest}\nUse --force only when intentionally replacing tracked source from generated output.`);
    }
    fs.copyFileSync(source, dest);
    const bytes = fs.readFileSync(dest);
    promoted.push({
      file: path.relative(ROOT, dest).replace(/\\/g, '/'),
      romStart: chunk.romStart,
      romEndExclusive: chunk.romEndExclusive,
      bytes: chunk.bytes,
      sourceReportFile: chunk.file,
      textBytes: bytes.length,
      sha256: hashBuffer(bytes, 'sha256'),
    });
  }

  const manifest = {
    tool: 'promote_original_mips',
    profile: report.profile,
    sourceReportPath: path.relative(ROOT, args.sourceReport).replace(/\\/g, '/'),
    outputDir: path.relative(ROOT, args.outDir).replace(/\\/g, '/'),
    promotedChunks: promoted.length,
    codeRegion: report.codeRegion,
    chunks: promoted,
  };
  const manifestPath = path.join(args.outDir, 'manifest.json');
  writeJson(manifestPath, manifest);
  console.log(`Promoted ${promoted.length} original MIPS chunk(s) to ${args.outDir}`);
  for (const chunk of promoted) console.log(`  ${chunk.file} ${chunk.romStart}..${chunk.romEndExclusive}`);
  console.log(`Manifest: ${manifestPath}`);
}

main();
