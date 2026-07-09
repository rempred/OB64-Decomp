#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  hashBuffer,
  loadAndVerifyRom,
  parseHexOrNumber,
  readJson,
  writeJson,
} = require('./lib/rom');

const DEFAULT_SOURCE_FORMS = ['raw_header', 'raw_structural_gap', 'raw_tail_data'];

function usage() {
  console.log(`Usage: node tools/promote_non_code_sources.js [--source-manifest <json>] [--out <dir>] [--manifest <json>] [--source-form <form>] [--index <n>]

Promotes selected non-code source-owner spans into tracked data/source-owners/rev0/.
When no --source-form or --index is supplied, promotes a small safe default batch:
${DEFAULT_SOURCE_FORMS.join(', ')}.`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    sourceManifest: path.join(ROOT, 'build', 'source-manifest', 'rev0-full-source-manifest.json'),
    outDir: path.join(ROOT, 'data', 'source-owners', 'rev0'),
    manifest: path.join(ROOT, 'data', 'source-owners', 'rev0', 'manifest.json'),
    sourceForms: [],
    indexes: [],
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
    } else if (arg === '--out') {
      args.outDir = path.resolve(argv[++i]);
    } else if (arg === '--manifest') {
      args.manifest = path.resolve(argv[++i]);
    } else if (arg === '--source-form') {
      args.sourceForms.push(argv[++i]);
    } else if (arg === '--index') {
      args.indexes.push(parseInt(argv[++i], 10));
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (args.sourceForms.length === 0 && args.indexes.length === 0) {
    args.sourceForms = DEFAULT_SOURCE_FORMS.slice();
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

function loadExistingManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = readJson(manifestPath);
  if (!Array.isArray(manifest.entries)) {
    throw new Error(`Existing tracked manifest has no entries array: ${manifestPath}`);
  }
  return manifest.entries;
}

function entryMatchesSelection(entry, args) {
  // Assembled-backed forms need no owner files: original MIPS code and the
  // reclassified owned_data_parts tail are both byte-owned by the tracked
  // asm/original parts via the assembled blob (2026-07-09).
  if (entry.sourceForm === 'original_mips' || entry.sourceForm === 'owned_data_parts') return false;
  if (args.indexes.includes(entry.index)) return true;
  return args.sourceForms.includes(entry.sourceForm);
}

function summarize(entries) {
  const bySourceForm = {};
  let trackedOwnerBytes = 0;
  let ambiguousBytes = 0;
  for (const entry of entries) {
    trackedOwnerBytes += entry.bytes;
    if (entry.ambiguous) ambiguousBytes += entry.bytes;
    bySourceForm[entry.sourceForm] = (bySourceForm[entry.sourceForm] || 0) + entry.bytes;
  }
  return {
    trackedOwnerEntries: entries.length,
    trackedOwnerBytes,
    ambiguousBytes,
    bySourceForm,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.sourceManifest)) {
    throw new Error(`Full source manifest not found: ${args.sourceManifest}\nRun: node tools/build_full_source_manifest.js`);
  }
  const sourceManifest = readJson(args.sourceManifest);
  if (!sourceManifest.ok) throw new Error(`Source manifest is not ok: ${args.sourceManifest}`);

  const selected = sourceManifest.entries.filter((entry) => entryMatchesSelection(entry, args));
  if (selected.length === 0) {
    throw new Error('No non-code source manifest entries matched the selection');
  }

  const result = loadAndVerifyRom({ inputPath: args.input });
  if (!result.verification.ok) {
    for (const check of result.verification.checks.filter((check) => !check.ok)) {
      console.error(`Rev 0 verification failed: ${check.name} expected ${check.expected}, got ${check.actual}`);
    }
    process.exit(1);
  }

  const existingByIndex = new Map(loadExistingManifest(args.manifest).map((entry) => [entry.index, entry]));
  for (const entry of selected) {
    const start = parseHexOrNumber(entry.romStart);
    const end = parseHexOrNumber(entry.romEndExclusive);
    const dir = path.join(args.outDir, sanitize(entry.sourceForm));
    ensureDir(dir);

    const outPath = path.join(dir, fileNameForEntry(entry));
    const bytes = Buffer.from(result.z64.subarray(start, end));
    const sha256 = hashBuffer(bytes, 'sha256');
    fs.writeFileSync(outPath, bytes);

    existingByIndex.set(entry.index, {
      index: entry.index,
      sourceForm: entry.sourceForm,
      ledgerCategory: entry.ledgerCategory,
      ambiguous: Boolean(entry.ambiguous),
      romStart: entry.romStart,
      romEndExclusive: entry.romEndExclusive,
      bytes: bytes.length,
      kind: 'tracked_source_owner',
      ownerFile: path.relative(ROOT, outPath).replace(/\\/g, '/'),
      sha256,
      note: 'Curated tracked source owner; still byte-exact source until decoded further.',
    });
  }

  const entries = [...existingByIndex.values()].sort((a, b) => a.index - b.index);
  const sourceManifestBytes = fs.readFileSync(args.sourceManifest);
  const manifest = {
    tool: 'promote_non_code_sources',
    profile: sourceManifest.profile,
    policy: 'Tracked source owners are curated replacements for generated build/source-owners entries. Unpromoted non-code spans remain generated proof owners. Entry indexes are informational; matching is range-based (romStart..romEndExclusive) as of 2026-07-09 because ledger-span splits shift indexes. Assembled-backed forms (original_mips, owned_data_parts) are never promotable.',
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
      sha256: hashBuffer(sourceManifestBytes, 'sha256'),
    },
    outputDir: path.relative(ROOT, args.outDir).replace(/\\/g, '/'),
    selection: {
      sourceForms: args.sourceForms,
      indexes: args.indexes,
    },
    summary: summarize(entries),
    entries,
  };

  writeJson(args.manifest, manifest);
  console.log(`Promoted tracked source owners: ${selected.length} selected span(s)`);
  console.log(`Tracked manifest entries: ${manifest.summary.trackedOwnerEntries}; ${manifest.summary.trackedOwnerBytes} byte(s)`);
  console.log(`Manifest: ${args.manifest}`);
}

main();
