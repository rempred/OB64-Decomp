#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  hashBuffer,
  hex,
  parseHexOrNumber,
  readJson,
  writeJson,
} = require('./lib/rom');

function usage() {
  console.log(`Usage: node tools/promote_original_mips.js [--source-report <json>] [--out <dir>] [--count <n> | --all | --chunk <file> ...] [--force]\n\nCopies generated no-gap original MIPS chunks into tracked asm/original/rev0 source\nand MERGES them into the existing asm/original/rev0/manifest.json (it never\nreplaces the manifest, so already-promoted/split chunks such as the chunk 0\ncomposite are preserved). Each newly promoted chunk is seeded with a single\nwhole-chunk part so it can be split immediately with split_original_mips_part.js.\nUse small batches so generated proof artifacts become curated source\ndeliberately. A chunk whose ROM range already exists in the manifest is refused\nunless --force is supplied; a partial range overlap is always refused.`);
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

function loadOrInitManifest(manifestPath, report, args) {
  if (fs.existsSync(manifestPath)) {
    const existing = readJson(manifestPath);
    if (!Array.isArray(existing.chunks)) existing.chunks = [];
    return { manifest: existing, fresh: false };
  }
  return {
    manifest: {
      tool: 'promote_original_mips',
      profile: report.profile,
      sourceReportPath: path.relative(ROOT, args.sourceReport).replace(/\\/g, '/'),
      outputDir: path.relative(ROOT, args.outDir).replace(/\\/g, '/'),
      promotedChunks: 0,
      codeRegion: report.codeRegion,
      chunks: [],
    },
    fresh: true,
  };
}

function rangesExactlyEqual(a, b) {
  return (
    parseHexOrNumber(a.romStart) === parseHexOrNumber(b.romStart) &&
    parseHexOrNumber(a.romEndExclusive) === parseHexOrNumber(b.romEndExclusive)
  );
}

function rangesOverlap(a, b) {
  const aStart = parseHexOrNumber(a.romStart);
  const aEnd = parseHexOrNumber(a.romEndExclusive);
  const bStart = parseHexOrNumber(b.romStart);
  const bEnd = parseHexOrNumber(b.romEndExclusive);
  return aStart < bEnd && bStart < aEnd;
}

// A freshly promoted chunk has no named parts yet. Seed it with a single
// whole-chunk part so split_original_mips_part.js (which only searches
// chunk.parts) can immediately split it. textBytes/sha256 follow the same
// convention the splitter maintains (chunk.sha256 = hash of part shas joined
// by '\n'), so re-splitting stays consistent.
function buildSeededChunk(chunk, dest) {
  const fileRel = path.relative(ROOT, dest).replace(/\\/g, '/');
  const text = fs.readFileSync(dest);
  const stem = path.basename(dest, '.s');
  const part = {
    name: stem,
    file: fileRel,
    romStart: chunk.romStart,
    romEndExclusive: chunk.romEndExclusive,
    bytes: chunk.bytes,
    textBytes: text.length,
    sha256: hashBuffer(text, 'sha256'),
  };
  return {
    file: fileRel,
    romStart: chunk.romStart,
    romEndExclusive: chunk.romEndExclusive,
    bytes: chunk.bytes,
    sourceReportFile: chunk.file,
    parts: [part],
    textBytes: part.textBytes,
    sha256: hashBuffer(Buffer.from([part.sha256].join('\n')), 'sha256'),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.sourceReport)) {
    throw new Error(`Original MIPS source report not found: ${args.sourceReport}\nRun: node tools/extract_original_mips.js`);
  }
  const report = readJson(args.sourceReport);
  const selected = selectChunks(report, args);
  ensureDir(args.outDir);

  const manifestPath = path.join(args.outDir, 'manifest.json');
  const { manifest } = loadOrInitManifest(manifestPath, report, args);

  const promoted = [];
  for (const chunk of selected) {
    const source = path.resolve(ROOT, chunk.file);
    if (!fs.existsSync(source)) throw new Error(`Generated source chunk missing: ${source}`);

    // Range-overwrite guards: a partial overlap is never safe; an exact-range
    // re-promote requires --force (it would discard any existing splits).
    const existingIndex = manifest.chunks.findIndex((tracked) => rangesExactlyEqual(tracked, chunk));
    for (const tracked of manifest.chunks) {
      if (rangesExactlyEqual(tracked, chunk)) continue;
      if (rangesOverlap(tracked, chunk)) {
        throw new Error(
          `Refusing to promote ${path.basename(chunk.file)} (${chunk.romStart}..${chunk.romEndExclusive}): ` +
            `it partially overlaps tracked chunk ${tracked.file} (${tracked.romStart}..${tracked.romEndExclusive}). ` +
            `Partial range overlaps are never auto-resolved.`,
        );
      }
    }
    if (existingIndex !== -1 && !args.force) {
      throw new Error(
        `Tracked chunk for range ${chunk.romStart}..${chunk.romEndExclusive} already exists ` +
          `(${manifest.chunks[existingIndex].file}). Use --force only when intentionally replacing it ` +
          `(this discards any splits already made on that chunk).`,
      );
    }

    const dest = path.join(args.outDir, path.basename(chunk.file));
    if (fs.existsSync(dest) && existingIndex === -1 && !args.force) {
      throw new Error(`Tracked chunk file already exists but is not in the manifest: ${dest}\nResolve manually or use --force.`);
    }
    if (existingIndex !== -1 && args.force) {
      console.warn(`--force: replacing tracked chunk ${manifest.chunks[existingIndex].file} (range ${chunk.romStart}..${chunk.romEndExclusive}); any existing splits for it are discarded.`);
    }
    fs.copyFileSync(source, dest);

    const seeded = buildSeededChunk(chunk, dest);
    if (existingIndex !== -1) manifest.chunks.splice(existingIndex, 1, seeded);
    else manifest.chunks.push(seeded);
    promoted.push(seeded);
  }

  // Keep tracked chunks ordered by ROM start so the manifest reads contiguously.
  manifest.chunks.sort((a, b) => parseHexOrNumber(a.romStart) - parseHexOrNumber(b.romStart));
  manifest.promotedChunks = manifest.chunks.length;

  writeJson(manifestPath, manifest);
  console.log(`Promoted ${promoted.length} original MIPS chunk(s) to ${args.outDir}; manifest now tracks ${manifest.chunks.length} chunk(s).`);
  for (const chunk of promoted) console.log(`  ${chunk.file} ${chunk.romStart}..${chunk.romEndExclusive} (seeded single part ${hex(parseHexOrNumber(chunk.romStart))}..${hex(parseHexOrNumber(chunk.romEndExclusive))})`);
  console.log(`Manifest: ${manifestPath}`);
}

main();
