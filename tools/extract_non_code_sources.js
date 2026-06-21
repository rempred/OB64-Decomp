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
  console.log(`Usage: node tools/extract_non_code_sources.js [--input <rom>] [--source-manifest <json>] [--tracked-manifest <json>] [--out <dir>] [--manifest <json>]\n\nGenerates byte-exact source-owner files for every non-code span in the Rev 0 full-ROM source manifest. Code spans remain owned by original MIPS/assembled-code outputs. If a tracked source-owner manifest exists, matching tracked files are verified and preferred over generated build/ owners.`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    sourceManifest: path.join(ROOT, 'build', 'source-manifest', 'rev0-full-source-manifest.json'),
    trackedManifest: path.join(ROOT, 'data', 'source-owners', 'rev0', 'manifest.json'),
    outDir: path.join(ROOT, 'build', 'source-owners', 'rev0'),
    manifest: path.join(ROOT, 'build', 'source-owners', 'rev0', 'manifest.json'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--input') {
      args.input = argv[++i];
    } else if (arg === '--source-manifest') {
      args.sourceManifest = path.resolve(argv[++i]);
    } else if (arg === '--tracked-manifest') {
      args.trackedManifest = path.resolve(argv[++i]);
    } else if (arg === '--out') {
      args.outDir = path.resolve(argv[++i]);
    } else if (arg === '--manifest') {
      args.manifest = path.resolve(argv[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function sanitize(value) {
  return String(value).replace(/[^A-Za-z0-9_.-]+/g, '_');
}

function fileNameForEntry(entry) {
  const start = parseHexOrNumber(entry.romStart).toString(16).toUpperCase().padStart(8, '0');
  const end = parseHexOrNumber(entry.romEndExclusive).toString(16).toUpperCase().padStart(8, '0');
  return `${String(entry.index).padStart(4, '0')}_${sanitize(entry.sourceForm)}_${start}_${end}.srcbin`;
}

function sameRange(a, b) {
  return parseHexOrNumber(a.romStart) === parseHexOrNumber(b.romStart)
    && parseHexOrNumber(a.romEndExclusive) === parseHexOrNumber(b.romEndExclusive);
}

function loadTrackedOwnerManifest(trackedManifestPath, sourceEntries) {
  const tracked = {
    path: trackedManifestPath,
    present: false,
    manifest: null,
    byIndex: new Map(),
    errors: [],
  };
  if (!trackedManifestPath || !fs.existsSync(trackedManifestPath)) return tracked;

  tracked.present = true;
  tracked.manifest = readJson(trackedManifestPath);
  if (!Array.isArray(tracked.manifest.entries)) {
    tracked.errors.push(`tracked manifest has no entries array: ${trackedManifestPath}`);
    return tracked;
  }

  const sourceByIndex = new Map(sourceEntries.map((entry) => [entry.index, entry]));
  for (const owner of tracked.manifest.entries) {
    if (owner.index == null) {
      tracked.errors.push('tracked owner entry is missing index');
      continue;
    }
    if (tracked.byIndex.has(owner.index)) {
      tracked.errors.push(`tracked owner entry ${owner.index} appears more than once`);
      continue;
    }

    const sourceEntry = sourceByIndex.get(owner.index);
    if (!sourceEntry) {
      tracked.errors.push(`tracked owner entry ${owner.index} is not in the source manifest`);
      continue;
    }
    if (sourceEntry.sourceForm === 'original_mips') {
      tracked.errors.push(`tracked owner entry ${owner.index} points at original MIPS code`);
      continue;
    }
    if (owner.sourceForm !== sourceEntry.sourceForm) {
      tracked.errors.push(`tracked owner entry ${owner.index} sourceForm ${owner.sourceForm} != ${sourceEntry.sourceForm}`);
    }
    if (!sameRange(owner, sourceEntry)) {
      tracked.errors.push(`tracked owner entry ${owner.index} range ${owner.romStart}..${owner.romEndExclusive} != ${sourceEntry.romStart}..${sourceEntry.romEndExclusive}`);
    }
    if (owner.bytes !== sourceEntry.bytes) {
      tracked.errors.push(`tracked owner entry ${owner.index} byte count ${owner.bytes} != ${sourceEntry.bytes}`);
    }
    if (!owner.ownerFile) {
      tracked.errors.push(`tracked owner entry ${owner.index} has no ownerFile`);
      continue;
    }
    const ownerPath = path.resolve(ROOT, owner.ownerFile);
    if (!fs.existsSync(ownerPath)) {
      tracked.errors.push(`tracked owner file missing for entry ${owner.index}: ${ownerPath}`);
      continue;
    }
    const bytes = fs.readFileSync(ownerPath);
    const sha256 = hashBuffer(bytes, 'sha256');
    if (bytes.length !== sourceEntry.bytes) {
      tracked.errors.push(`tracked owner file for entry ${owner.index} has ${bytes.length} byte(s), expected ${sourceEntry.bytes}`);
    }
    if (!owner.sha256) {
      tracked.errors.push(`tracked owner entry ${owner.index} has no sha256`);
    } else if (owner.sha256 !== sha256) {
      tracked.errors.push(`tracked owner entry ${owner.index} SHA256 mismatch: expected ${owner.sha256}, got ${sha256}`);
    }
    const rawSegmentShaMatches = !sourceEntry.rawSegment?.sha256 || sourceEntry.rawSegment.sha256 === sha256;
    tracked.byIndex.set(owner.index, {
      manifestEntry: owner,
      bytes,
      sha256,
      ownerFile: owner.ownerFile,
      rawSegmentShaMatches,
    });
  }
  return tracked;
}

function validateSourceManifest(sourceManifest) {
  const errors = [];
  if (!sourceManifest.ok) errors.push('source manifest is not ok');
  if (!Array.isArray(sourceManifest.entries) || sourceManifest.entries.length === 0) {
    errors.push('source manifest has no entries');
    return errors;
  }
  let cursor = 0;
  for (const entry of sourceManifest.entries) {
    const start = parseHexOrNumber(entry.romStart);
    const end = parseHexOrNumber(entry.romEndExclusive);
    if (start !== cursor) errors.push(`entry ${entry.index} starts at ${hex(start)}, expected ${hex(cursor)}`);
    if (end <= start) errors.push(`entry ${entry.index} has invalid range ${entry.romStart}..${entry.romEndExclusive}`);
    if (entry.bytes !== end - start) errors.push(`entry ${entry.index} byte count mismatch`);
    cursor = end;
  }
  if (sourceManifest.summary?.romSize != null && cursor !== sourceManifest.summary.romSize) {
    errors.push(`entries end at ${hex(cursor)}, expected ${hex(sourceManifest.summary.romSize)}`);
  }
  return errors;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.sourceManifest)) {
    throw new Error(`Full source manifest not found: ${args.sourceManifest}\nRun: node tools/build_full_source_manifest.js`);
  }
  const sourceManifest = readJson(args.sourceManifest);
  const sourceManifestErrors = validateSourceManifest(sourceManifest);
  if (sourceManifestErrors.length > 0) {
    throw new Error(`Invalid source manifest:\n${sourceManifestErrors.join('\n')}`);
  }
  const trackedOwners = loadTrackedOwnerManifest(args.trackedManifest, sourceManifest.entries);
  if (trackedOwners.errors.length > 0) {
    throw new Error(`Invalid tracked source-owner manifest:\n${trackedOwners.errors.join('\n')}`);
  }

  const result = loadAndVerifyRom({ inputPath: args.input });
  if (!result.verification.ok) {
    for (const check of result.verification.checks.filter((check) => !check.ok)) {
      console.error(`Rev 0 verification failed: ${check.name} expected ${check.expected}, got ${check.actual}`);
    }
    process.exit(1);
  }

  ensureDir(args.outDir);
  const entries = [];
  const bySourceForm = {};
  let nonCodeBytes = 0;
  let codeBytes = 0;
  let ambiguousBytes = 0;
  let rawSegmentShaMismatches = 0;
  let generatedOwnerEntries = 0;
  let generatedOwnerBytes = 0;
  let trackedOwnerEntries = 0;
  let trackedOwnerBytes = 0;

  for (const entry of sourceManifest.entries) {
    const start = parseHexOrNumber(entry.romStart);
    const end = parseHexOrNumber(entry.romEndExclusive);
    if (entry.sourceForm === 'original_mips') {
      codeBytes += entry.bytes;
      entries.push({
        index: entry.index,
        sourceForm: entry.sourceForm,
        romStart: entry.romStart,
        romEndExclusive: entry.romEndExclusive,
        bytes: entry.bytes,
        kind: 'original_mips',
        ownerFile: null,
        assembledCode: sourceManifest.codeCoverage?.assembled?.report || null,
        sha256: null,
      });
      continue;
    }

    const trackedOwner = trackedOwners.byIndex.get(entry.index);
    let bytes;
    let sha256;
    let relFile;
    let kind;
    if (trackedOwner) {
      bytes = trackedOwner.bytes;
      sha256 = trackedOwner.sha256;
      relFile = trackedOwner.ownerFile;
      kind = 'tracked_source_owner';
      trackedOwnerEntries += 1;
      trackedOwnerBytes += bytes.length;
    } else {
      const dir = path.join(args.outDir, sanitize(entry.sourceForm));
      ensureDir(dir);
      const fileName = fileNameForEntry(entry);
      const outPath = path.join(dir, fileName);
      bytes = Buffer.from(result.z64.subarray(start, end));
      sha256 = hashBuffer(bytes, 'sha256');
      fs.writeFileSync(outPath, bytes);
      relFile = path.relative(ROOT, outPath).replace(/\\/g, '/');
      kind = 'raw_source_owner';
      generatedOwnerEntries += 1;
      generatedOwnerBytes += bytes.length;
    }
    const rawSegmentShaMatches = !entry.rawSegment?.sha256 || entry.rawSegment.sha256 === sha256;
    if (!rawSegmentShaMatches) rawSegmentShaMismatches += 1;
    nonCodeBytes += bytes.length;
    if (entry.ambiguous) ambiguousBytes += bytes.length;
    bySourceForm[entry.sourceForm] = (bySourceForm[entry.sourceForm] || 0) + bytes.length;
    entries.push({
      index: entry.index,
      sourceForm: entry.sourceForm,
      ledgerCategory: entry.ledgerCategory,
      ambiguous: Boolean(entry.ambiguous),
      romStart: entry.romStart,
      romEndExclusive: entry.romEndExclusive,
      bytes: bytes.length,
      kind,
      ownerFile: relFile,
      sha256,
      rawSegmentShaMatches,
    });
  }

  const expectedNonCodeBytes = sourceManifest.summary?.nonCodeBytes ?? null;
  const expectedAmbiguousBytes = sourceManifest.summary?.ambiguousBytes ?? null;
  const checks = [
    {
      name: 'nonCodeBytesMatchSourceManifest',
      ok: expectedNonCodeBytes == null || nonCodeBytes === expectedNonCodeBytes,
      expected: expectedNonCodeBytes,
      actual: nonCodeBytes,
    },
    {
      name: 'ambiguousBytesMatchSourceManifest',
      ok: expectedAmbiguousBytes == null || ambiguousBytes === expectedAmbiguousBytes,
      expected: expectedAmbiguousBytes,
      actual: ambiguousBytes,
    },
    {
      name: 'rawSegmentHashesMatch',
      ok: rawSegmentShaMismatches === 0,
      mismatches: rawSegmentShaMismatches,
    },
    {
      name: 'trackedSourceOwnersVerified',
      ok: trackedOwners.errors.length === 0,
      trackedManifestPresent: trackedOwners.present,
      trackedOwnerEntries,
      trackedOwnerBytes,
    },
  ];
  const ok = checks.every((check) => check.ok);

  const manifest = {
    tool: 'extract_non_code_sources',
    profile: sourceManifest.profile,
    ok,
    inputPath: result.inputPath,
    source: {
      byteOrder: result.detectedByteOrder,
      z64Sha256: result.hashes.z64Sha256,
      crc1: result.verification.header.crc1,
      crc2: result.verification.header.crc2,
      sizeBytes: result.z64.length,
    },
    sourceManifest: {
      path: path.relative(ROOT, args.sourceManifest).replace(/\\/g, '/'),
      entries: sourceManifest.entries.length,
      sha256: hashBuffer(fs.readFileSync(args.sourceManifest), 'sha256'),
    },
    trackedManifest: trackedOwners.present
      ? {
          path: path.relative(ROOT, args.trackedManifest).replace(/\\/g, '/'),
          entries: trackedOwners.manifest.entries.length,
          sha256: hashBuffer(fs.readFileSync(args.trackedManifest), 'sha256'),
        }
      : null,
    outputDir: path.relative(ROOT, args.outDir).replace(/\\/g, '/'),
    summary: {
      entries: entries.length,
      codeEntries: entries.filter((entry) => entry.kind === 'original_mips').length,
      nonCodeEntries: entries.filter((entry) => entry.kind !== 'original_mips').length,
      generatedOwnerEntries,
      generatedOwnerBytes,
      trackedOwnerEntries,
      trackedOwnerBytes,
      codeBytes,
      nonCodeBytes,
      ambiguousBytes,
      bySourceForm,
    },
    checks,
    entries,
  };
  writeJson(args.manifest, manifest);
  console.log(`Non-code source owners: ${ok ? 'PASS' : 'FAIL'}`);
  console.log(`Tracked owner file(s): ${trackedOwnerEntries}; ${trackedOwnerBytes} byte(s)`);
  console.log(`Generated owner file(s): ${generatedOwnerEntries}; ${generatedOwnerBytes} byte(s)`);
  console.log(`Total non-code owner file(s): ${manifest.summary.nonCodeEntries}; ${nonCodeBytes} byte(s)`);
  console.log(`Ambiguous byte(s) preserved: ${ambiguousBytes}`);
  console.log(`Manifest: ${args.manifest}`);
  if (!ok) process.exitCode = 1;
}

main();
