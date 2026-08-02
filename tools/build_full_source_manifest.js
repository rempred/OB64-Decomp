#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  PARENT_ROOT,
  ROOT,
  ensureDir,
  hex,
  loadProfile,
  parseHexOrNumber,
  readJson,
  writeJson,
} = require('./lib/rom');

function usage() {
  console.log(`Usage: node tools/build_full_source_manifest.js [--ledger <json>] [--segments <json>] [--mips-report <json>] [--assembled-report <json>] [--json <path>] [--md <path>]\n\nBuilds a Rev 0 full-ROM source ownership manifest. The manifest does not decompile non-code bytes; it assigns each byte to an explicit source strategy and audits the current original-MIPS code coverage against the whole-ROM coverage ledger.`);
}

function parseArgs(argv) {
  const args = {
    ledger: path.join(ROOT, 'build', 'coverage', 'rev0-rom-coverage-ledger.json'),
    segments: path.join(ROOT, 'build', 'segments', 'rev0', 'manifest.json'),
    mipsReport: path.join(ROOT, 'build', 'original-mips', 'rev0-report.json'),
    assembledReport: path.join(ROOT, 'build', 'assembled', 'rev0-report.json'),
    json: path.join(ROOT, 'build', 'source-manifest', 'rev0-full-source-manifest.json'),
    md: path.join(ROOT, 'build', 'source-manifest', 'rev0-full-source-manifest.md'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--ledger') {
      args.ledger = path.resolve(argv[++i]);
    } else if (arg === '--segments') {
      args.segments = path.resolve(argv[++i]);
    } else if (arg === '--mips-report') {
      args.mipsReport = path.resolve(argv[++i]);
    } else if (arg === '--assembled-report') {
      args.assembledReport = path.resolve(argv[++i]);
    } else if (arg === '--json') {
      args.json = path.resolve(argv[++i]);
    } else if (arg === '--md') {
      args.md = path.resolve(argv[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function mustReadJson(filePath, hint) {
  if (!fs.existsSync(filePath)) throw new Error(`${hint} not found: ${filePath}`);
  return readJson(filePath);
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function validateContiguousRanges(entries, expectedSize, label) {
  let cursor = 0;
  const errors = [];
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const start = parseHexOrNumber(entry.start);
    const end = parseHexOrNumber(entry.endExclusive);
    if (start !== cursor) errors.push(`${label} ${i} starts at ${hex(start)}, expected ${hex(cursor)}`);
    if (end <= start) errors.push(`${label} ${i} has invalid range ${entry.start}..${entry.endExclusive}`);
    if (entry.bytes !== end - start) errors.push(`${label} ${i} byte count mismatch`);
    cursor = end;
  }
  if (cursor !== expectedSize) errors.push(`${label} ranges end at ${hex(cursor)}, expected ${hex(expectedSize)}`);
  return errors;
}

function compareLedgerAndSegments(ledger, segments) {
  const errors = [];
  if (ledger.spans.length !== segments.segments.length) {
    errors.push(`ledger has ${ledger.spans.length} spans, segment manifest has ${segments.segments.length}`);
    return errors;
  }
  for (let i = 0; i < ledger.spans.length; i += 1) {
    const span = ledger.spans[i];
    const segment = segments.segments[i];
    for (const key of ['start', 'endExclusive', 'bytes', 'category']) {
      if (span[key] !== segment[key]) {
        errors.push(`span/segment ${i} ${key} mismatch: ledger=${span[key]} segment=${segment[key]}`);
      }
    }
  }
  return errors;
}

function sourceFormForSpan(span) {
  const category = span.category;
  const categories = span.categories || [];
  if (category === 'code') {
    return {
      kind: 'original_mips',
      label: 'Original MIPS source',
      ambiguous: false,
      note: 'Executable-extent bytes emitted as original MIPS .word source (boundary pinned 0x2B89B8, 2026-07-09; audit-gated).',
    };
  }
  if (category === 'code_region_data_tail') {
    return {
      kind: 'owned_data_parts',
      label: 'Data territory owned as tracked .word parts (assembled-blob-backed)',
      ambiguous: false,
      note: 'Non-code bytes inside the assembly/tiling region, past the pinned executable extent (0x2B89B8). Byte-owned by the tracked asm/original/rev0 data parts and rebuilt from the assembled blob; classified as DATA, not MIPS. See docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md.',
    };
  }
  if (category === 'header') return { kind: 'raw_header', label: 'Raw N64 header/source bytes', ambiguous: false };
  if (category === 'structural_gap') return { kind: 'raw_structural_gap', label: 'Raw structural gap bytes', ambiguous: false };
  if (category === 'archive') {
    return {
      kind: 'lha_archive',
      label: categories.includes('audio') ? 'LHA archive bytes overlapping audio envelope' : 'LHA archive bytes',
      ambiguous: categories.includes('audio'),
      note: categories.includes('audio') ? 'Known 108-byte archive/audio overlap is kept visible.' : null,
    };
  }
  if (category === 'archive_gap') {
    return {
      kind: 'raw_archive_gap',
      label: 'Raw archive-envelope gap bytes',
      ambiguous: true,
      note: 'Inside an archive cluster envelope but not parsed as an LHA archive. Preserve byte-exactly and keep scanner evidence visible.',
    };
  }
  if (category === 'audio') return { kind: 'raw_audio_data', label: 'Raw audio/custom data region', ambiguous: false };
  if (category === 'lzss') return { kind: 'raw_lzss_region', label: 'Raw LZSS-compressed region', ambiguous: false };
  if (category === 'tail_data') {
    return {
      kind: 'raw_tail_data',
      label: 'Raw structured tail data',
      ambiguous: true,
      note: 'Structured non-FF tail bytes after the last LHA archive; exact format is still pending.',
    };
  }
  if (category === 'padding_ff') return { kind: 'padding_ff', label: '0xFF padding source', ambiguous: false };
  return {
    kind: 'raw_unknown',
    label: 'Raw unknown bytes',
    ambiguous: true,
    note: 'Unknown bytes are not acceptable for the current no-gap source target; investigate before promotion.',
  };
}

function loadOptionalParentJson(relativePath) {
  const fullPath = path.resolve(PARENT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return { path: fullPath, data: readJson(fullPath) };
}

function countParentFunctions(functionDb) {
  const data = functionDb?.data;
  if (Array.isArray(data?.functions)) return data.functions.length;
  if (Array.isArray(data)) return data.length;
  if (Array.isArray(functionDb?.functions)) return functionDb.functions.length;
  return null;
}

function overlayRegionSummary(overlaySources) {
  const regions = overlaySources?.data?.regions;
  if (!Array.isArray(regions)) return [];
  return regions.map((region) => {
    const start = parseHexOrNumber(region.rom);
    const size = typeof region.size === 'number' ? region.size : parseHexOrNumber(region.size);
    return {
      romStart: hex(start),
      romEndExclusive: hex(start + size),
      ram: typeof region.ram === 'number' ? hex(region.ram) : region.ram,
      bytes: size,
      note: region.note || null,
      evidence: rel(overlaySources.path),
    };
  });
}

function buildEntries({ ledger, segments, mipsReport, assembledReport }) {
  return ledger.spans.map((span, index) => {
    const segment = segments.segments[index];
    const start = parseHexOrNumber(span.start);
    const end = parseHexOrNumber(span.endExclusive);
    const sourceForm = sourceFormForSpan(span);
    const entry = {
      index,
      romStart: span.start,
      romEndExclusive: span.endExclusive,
      bytes: span.bytes,
      ledgerCategory: span.category,
      ledgerCategories: span.categories || [span.category],
      overlap: Boolean(span.overlap),
      sourceForm: sourceForm.kind,
      sourceLabel: sourceForm.label,
      ambiguous: sourceForm.ambiguous,
      note: sourceForm.note || null,
      rawSegment: {
        file: path.posix.join('build/segments/rev0', segment.file),
        sha256: segment.sha256,
      },
    };
    if (span.category === 'code') {
      entry.originalMips = {
        report: rel(path.join(ROOT, 'build', 'original-mips', 'rev0-report.json')),
        generatedOutputDir: mipsReport.outputDir,
        chunks: mipsReport.chunks.length,
        emittedBytes: mipsReport.coverage.emittedBytes,
        trackedManifest: 'asm/original/rev0/manifest.json',
        assembledReport: rel(path.join(ROOT, 'build', 'assembled', 'rev0-report.json')),
        assembledCode: assembledReport.outputPath,
        exactToReference: Boolean(assembledReport.exactToReference),
        assembledSha256: assembledReport.assembled.sha256,
        sourceMix: assembledReport.sources,
      };
    }
    if (span.classification) entry.ledgerClassification = span.classification;
    if (start >= end) entry.error = 'invalid-range';
    return entry;
  });
}

function aggregateEntries(entries) {
  const bySourceForm = {};
  const byCategory = {};
  let ambiguousBytes = 0;
  let codeBytes = 0;
  let ownedDataTailBytes = 0;
  let nonCodeBytes = 0;
  for (const entry of entries) {
    bySourceForm[entry.sourceForm] = (bySourceForm[entry.sourceForm] || 0) + entry.bytes;
    byCategory[entry.ledgerCategory] = (byCategory[entry.ledgerCategory] || 0) + entry.bytes;
    if (entry.ambiguous) ambiguousBytes += entry.bytes;
    if (entry.sourceForm === 'original_mips') codeBytes += entry.bytes;
    else if (entry.sourceForm === 'owned_data_parts') ownedDataTailBytes += entry.bytes;
    // nonCodeBytes = owner-file-backed forms only; the owned_data_parts tail
    // is data but assembled-blob-backed, so it is counted separately.
    else nonCodeBytes += entry.bytes;
  }
  return { bySourceForm, byCategory, ambiguousBytes, codeBytes, ownedDataTailBytes, nonCodeBytes };
}

function requirement(name, ok, details = {}) {
  return { name, ok: Boolean(ok), ...details };
}

function writeMarkdown(filePath, report) {
  const lines = [];
  lines.push('# Rev 0 Full-ROM Source Manifest');
  lines.push('');
  lines.push(`Profile: \`${report.profile}\``);
  lines.push(`ROM size: ${report.summary.romSize} bytes`);
  lines.push(`Entries: ${report.summary.entries}`);
  lines.push('');
  lines.push('## Requirements');
  lines.push('');
  lines.push('| Check | Result | Detail |');
  lines.push('|---|---|---|');
  for (const check of report.requirements) {
    const detail = Object.entries(check)
      .filter(([key]) => !['name', 'ok'].includes(key))
      .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
      .join('; ');
    lines.push(`| ${check.name} | ${check.ok ? 'PASS' : 'FAIL'} | ${detail} |`);
  }
  lines.push('');
  lines.push('## Source Forms');
  lines.push('');
  lines.push('| Source form | Bytes |');
  lines.push('|---|---:|');
  for (const [kind, bytes] of Object.entries(report.summary.bySourceForm)) {
    lines.push(`| ${kind} | ${bytes} |`);
  }
  lines.push('');
  lines.push('## Code-Bearing Evidence');
  lines.push('');
  lines.push(`Configured code region: \`${report.codeCoverage.configuredCodeRegion.start}..${report.codeCoverage.configuredCodeRegion.endExclusive}\``);
  lines.push(`Original-MIPS emitted bytes: ${report.codeCoverage.originalMips.emittedBytes}`);
  lines.push(`Assembled exact to reference: ${report.codeCoverage.assembled.exactToReference ? 'yes' : 'no'}`);
  lines.push(`Tracked source files: ${report.codeCoverage.assembled.sourceMix.trackedRealAsmFiles ?? 0}`);
  lines.push(`Generated fallback chunks: ${report.codeCoverage.assembled.sourceMix.generatedChunks}`);
  lines.push(`Parent function DB count: ${report.codeCoverage.parentFunctionCount ?? 'unavailable'}`);
  lines.push('');
  if (report.codeCoverage.overlaySourceRegions.length > 0) {
    lines.push('Known overlay source regions from parent RAM snapshot evidence:');
    lines.push('');
    lines.push('| ROM range | RAM | Bytes | Note |');
    lines.push('|---|---|---:|---|');
    for (const region of report.codeCoverage.overlaySourceRegions) {
      lines.push(`| ${region.romStart}..${region.romEndExclusive} | ${region.ram} | ${region.bytes} | ${region.note || ''} |`);
    }
    lines.push('');
  }
  lines.push('## Ambiguities Kept Explicit');
  lines.push('');
  lines.push(`Ambiguous bytes: ${report.summary.ambiguousBytes}`);
  lines.push('');
  lines.push('| Category/source form | Spans | Bytes | Reason |');
  lines.push('|---|---:|---:|---|');
  for (const item of report.ambiguities.byKind) {
    lines.push(`| ${item.sourceForm} | ${item.spans} | ${item.bytes} | ${item.note || ''} |`);
  }
  lines.push('');
  lines.push('## Next Recommended Target');
  lines.push('');
  lines.push(report.nextRecommendedTarget);
  lines.push('');
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const profile = loadProfile();
  const ledger = mustReadJson(args.ledger, 'Coverage ledger');
  const segments = mustReadJson(args.segments, 'Segment manifest');
  const mipsReport = mustReadJson(args.mipsReport, 'Original-MIPS report');
  const assembledReport = mustReadJson(args.assembledReport, 'Assembled-code report');
  const parentFunctions = loadOptionalParentJson('scripts/ob64_functions.json');
  const overlaySources = loadOptionalParentJson('ram_snapshots/overlay_sources.json');

  const romSize = profile.sizeBytes;
  const ledgerRangeErrors = validateContiguousRanges(ledger.spans, romSize, 'ledger span');
  const segmentRangeErrors = validateContiguousRanges(segments.segments, romSize, 'segment');
  const ledgerSegmentErrors = compareLedgerAndSegments(ledger, segments);
  const codeStart = parseHexOrNumber(profile.codeRegion.start);
  const codeEnd = parseHexOrNumber(profile.codeRegion.endExclusive);
  const mipsStart = parseHexOrNumber(mipsReport.codeRegion.start);
  const mipsEnd = parseHexOrNumber(mipsReport.codeRegion.endExclusive);
  const originalMipsMatchesCodeRegion =
    mipsStart === codeStart &&
    mipsEnd === codeEnd &&
    mipsReport.coverage?.emittedBytes === codeEnd - codeStart &&
    mipsReport.coverage?.byteCoveragePercent === 100;
  const assembledExact = Boolean(assembledReport.exactToReference);

  const entries = buildEntries({ ledger, segments, mipsReport, assembledReport });
  const aggregate = aggregateEntries(entries);
  const unknownBytes = ledger.summary?.unknownBytes ?? null;
  const nonCodeEntries = entries.filter((entry) => entry.sourceForm !== 'original_mips');
  const nonCodeRepresented = nonCodeEntries.every((entry) => entry.rawSegment?.file || entry.sourceForm === 'padding_ff');
  const archiveCount = ledger.archiveScan?.count ?? null;
  const archiveOffsetsOk = ledger.archiveScan?.offsetsMatchParentCatalog === true;
  const requirements = [
    requirement('ledgerSpansCoverRom', ledgerRangeErrors.length === 0, { errors: ledgerRangeErrors }),
    requirement('segmentManifestCoversRom', segmentRangeErrors.length === 0, { errors: segmentRangeErrors }),
    requirement('ledgerAndSegmentMapMatch', ledgerSegmentErrors.length === 0, { errors: ledgerSegmentErrors.slice(0, 5) }),
    requirement('ledgerHasNoUnknownBytes', unknownBytes === 0, { unknownBytes }),
    requirement('originalMipsCoversConfiguredCodeRegion', originalMipsMatchesCodeRegion, {
      configured: `${profile.codeRegion.start}..${profile.codeRegion.endExclusive}`,
      originalMips: `${mipsReport.codeRegion.start}..${mipsReport.codeRegion.endExclusive}`,
    }),
    requirement('assembledCodeMatchesReference', assembledExact, { sha256: assembledReport.assembled?.sha256 || null }),
    requirement('nonCodeBytesRepresentedAsRawOrStructuredSource', nonCodeRepresented, { nonCodeBytes: aggregate.nonCodeBytes }),
    requirement('independentArchiveScanMatchesParentCatalog', archiveCount === 825 && archiveOffsetsOk, {
      archiveCount,
      offsetsMatchParentCatalog: archiveOffsetsOk,
    }),
  ];
  const ok = requirements.every((item) => item.ok);
  const ambiguityMap = new Map();
  for (const entry of entries.filter((item) => item.ambiguous)) {
    if (!ambiguityMap.has(entry.sourceForm)) {
      ambiguityMap.set(entry.sourceForm, { sourceForm: entry.sourceForm, spans: 0, bytes: 0, note: entry.note });
    }
    const item = ambiguityMap.get(entry.sourceForm);
    item.spans += 1;
    item.bytes += entry.bytes;
  }

  const report = {
    tool: 'build_full_source_manifest',
    profile: profile.id,
    inputs: {
      ledger: rel(args.ledger),
      segments: rel(args.segments),
      mipsReport: rel(args.mipsReport),
      assembledReport: rel(args.assembledReport),
      parentFunctions: parentFunctions ? rel(parentFunctions.path) : null,
      overlaySources: overlaySources ? rel(overlaySources.path) : null,
    },
    policy:
      'Every Rev 0 ROM byte must have an explicit source owner. Confirmed code uses original MIPS source; non-code bytes remain raw/archive/compressed/audio/padding source until decoded. Ambiguous spans are preserved byte-exactly and named as ambiguous.',
    ok,
    requirements,
    summary: {
      romSize,
      entries: entries.length,
      codeBytes: aggregate.codeBytes,
      ownedDataTailBytes: aggregate.ownedDataTailBytes,
      nonCodeBytes: aggregate.nonCodeBytes,
      ambiguousBytes: aggregate.ambiguousBytes,
      unknownBytes,
      bySourceForm: aggregate.bySourceForm,
      byCategory: aggregate.byCategory,
    },
    codeCoverage: {
      configuredCodeRegion: {
        start: profile.codeRegion.start,
        endExclusive: profile.codeRegion.endExclusive,
        bytes: codeEnd - codeStart,
      },
      bootLinearMapping: profile.bootLinearMapping,
      originalMips: {
        report: rel(args.mipsReport),
        emittedBytes: mipsReport.coverage?.emittedBytes,
        chunks: mipsReport.chunks?.length ?? null,
        functionStartsIndexed: mipsReport.functionDb?.startsIndexed ?? null,
      },
      assembled: {
        report: rel(args.assembledReport),
        exactToReference: assembledExact,
        sha256: assembledReport.assembled?.sha256 || null,
        sourceMix: assembledReport.sources,
      },
      parentFunctionCount: parentFunctions ? countParentFunctions(parentFunctions.data) : null,
      overlaySourceRegions: overlayRegionSummary(overlaySources),
    },
    ambiguityPolicy: {
      archiveGap:
        'Preserve as raw archive-gap source. It is inside archive cluster envelopes but outside parsed LHA headers; the independent LHA scanner keeps missed archives visible.',
      tailData: 'Preserve as raw tail-data source until structure is decoded.',
      overlap: 'Preserve overlap categories in the ledger; do not collapse the archive/audio overlap.',
    },
    ambiguities: {
      byKind: Array.from(ambiguityMap.values()),
      unparsedMethodLikeHits: ledger.archiveScan?.unparsedMethodLikeHits || [],
      overlapRanges: ledger.overlapRanges || [],
    },
    entries,
    nextRecommendedTarget:
      'Add a source-generation step for non-code raw owners under data/bin or data/archives, then teach the rebuild path to consume the full source manifest instead of only build/segments raw spans. Keep archive_gap spans raw/ambiguous until a repeatable scanner proves their internal format.',
  };

  writeJson(args.json, report);
  writeMarkdown(args.md, report);
  console.log(`Full-ROM source manifest: ${ok ? 'PASS' : 'FAIL'}`);
  console.log(`Entries: ${entries.length}; code bytes: ${aggregate.codeBytes}; owned-data-tail bytes: ${aggregate.ownedDataTailBytes}; non-code bytes: ${aggregate.nonCodeBytes}`);
  console.log(`Ambiguous bytes preserved explicitly: ${aggregate.ambiguousBytes}`);
  console.log(`Unknown bytes: ${unknownBytes}`);
  console.log(`Wrote JSON: ${args.json}`);
  console.log(`Wrote Markdown: ${args.md}`);
  if (!ok) process.exitCode = 1;
}

main();
