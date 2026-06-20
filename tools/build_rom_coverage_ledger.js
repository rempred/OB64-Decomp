#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  hex,
  loadAndVerifyRom,
  loadProfile,
  parseHexOrNumber,
  readJson,
  writeJson,
} = require('./lib/rom');
const { classifyInstruction, disasmWord } = require('./lib/mips');

const CATEGORY_BITS = {
  header: 1 << 0,
  code: 1 << 1,
  archive: 1 << 2,
  audio: 1 << 3,
  lzss: 1 << 4,
  tail_data: 1 << 5,
  structural_gap: 1 << 6,
};

const CATEGORY_PRIORITY = ['header', 'code', 'archive', 'lzss', 'audio', 'tail_data', 'structural_gap'];

function usage() {
  console.log(`Usage: node tools/build_rom_coverage_ledger.js [--input <rom>] [--json <path>] [--md <path>]\n\nBuilds a whole-ROM byte coverage ledger for OB64 US Rev 0. Known regions and LHA archives are tagged first; remaining spans are classified as padding or unknown.`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    json: path.join(ROOT, 'build', 'coverage', 'rev0-rom-coverage-ledger.json'),
    md: path.join(ROOT, 'build', 'coverage', 'rev0-rom-coverage-ledger.md'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--input') {
      args.input = argv[++i];
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

function parseLhaArchives(z64) {
  const archives = [];
  for (let i = 2; i < z64.length - 20; i += 1) {
    if (z64[i] !== 0x2D || z64[i + 1] !== 0x6C || z64[i + 2] !== 0x68) continue;
    const method = z64.subarray(i, i + 5).toString('ascii');
    if (!/^-lh[0-9s]-$/.test(method)) continue;
    const headerStart = i - 2;
    const compSize = z64.readUInt32LE(i + 5);
    const uncompSize = z64.readUInt32LE(i + 9);
    if (compSize <= 0 || compSize >= 0x1000000 || uncompSize <= 0 || uncompSize >= 0x1000000) continue;
    const level = z64[i + 18];
    const totalHeaderSize = level === 2 ? z64.readUInt16LE(headerStart) : 2 + z64[headerStart];
    if (totalHeaderSize <= 0 || totalHeaderSize > 0x1000) continue;
    const end = headerStart + totalHeaderSize + compSize;
    if (end > z64.length) continue;
    archives.push({
      index: archives.length,
      start: headerStart,
      end,
      compSize,
      uncompSize,
      method,
      level,
      totalHeaderSize,
    });
  }
  return archives;
}

function methodLikeHits(z64) {
  const hits = [];
  for (let i = 0; i < z64.length - 4; i += 1) {
    if (z64[i] !== 0x2D || z64[i + 1] !== 0x6C) continue;
    const method = z64.subarray(i, i + 5).toString('ascii');
    if (/^-lh[0-9sS]-$/.test(method) || /^-lz[0-9sS]-$/.test(method)) {
      hits.push({ methodOffset: i, method, headerStart: i - 2 });
    }
  }
  return hits;
}

function rejectionReasonForMethodHit(z64, hit) {
  const i = hit.methodOffset;
  const headerStart = hit.headerStart;
  if (headerStart < 0) return 'header-start-before-rom';
  if (!/^-lh[0-9sS]-$/.test(hit.method)) return 'not-lh-method';
  if (i + 20 >= z64.length) return 'candidate-too-close-to-rom-end';
  const compSize = z64.readUInt32LE(i + 5);
  const uncompSize = z64.readUInt32LE(i + 9);
  if (compSize <= 0 || compSize >= 0x1000000) return `invalid-comp-size-${compSize}`;
  if (uncompSize <= 0 || uncompSize >= 0x1000000) return `invalid-uncomp-size-${uncompSize}`;
  const level = z64[i + 18];
  const totalHeaderSize = level === 2 ? z64.readUInt16LE(headerStart) : 2 + z64[headerStart];
  if (totalHeaderSize <= 0 || totalHeaderSize > 0x1000) return `invalid-header-size-${totalHeaderSize}`;
  const end = headerStart + totalHeaderSize + compSize;
  if (end > z64.length) return 'candidate-extends-past-rom-end';
  return 'valid-looking-but-not-in-archive-scan';
}

function loadParentCatalog() {
  const catalogPath = path.resolve(ROOT, '..', 'scripts', 'ob64_archive_catalog.json');
  if (!fs.existsSync(catalogPath)) return null;
  return { path: catalogPath, entries: readJson(catalogPath) };
}

function archiveCluster(index) {
  if (index <= 93) return 'archive_cluster_1';
  if (index <= 506) return 'archive_cluster_2';
  return 'archive_cluster_3';
}

function archiveClusterEnvelopes(archives) {
  const specs = [
    { name: 'archive_cluster_1_gap', first: 0, last: 93 },
    { name: 'archive_cluster_2_gap', first: 94, last: 506 },
    { name: 'archive_cluster_3_gap', first: 507, last: 824 },
  ];
  return specs.map((spec) => {
    const selected = archives.filter((archive) => archive.index >= spec.first && archive.index <= spec.last);
    return {
      name: spec.name,
      firstArchive: spec.first,
      lastArchive: spec.last,
      start: Math.min(...selected.map((archive) => archive.start)),
      end: Math.max(...selected.map((archive) => archive.end)),
    };
  });
}

function buildRanges(profile, archives, parentCatalog) {
  const codeStart = parseHexOrNumber(profile.codeRegion.start);
  const codeEnd = parseHexOrNumber(profile.codeRegion.endExclusive);
  const ranges = [
    {
      name: 'n64_header',
      category: 'header',
      start: 0,
      end: 0x1000,
      source: 'config/roms/us_rev0.json',
    },
    {
      name: 'boot_and_code',
      category: 'code',
      start: codeStart,
      end: codeEnd,
      source: 'config/roms/us_rev0.json codeRegion',
      note: 'Raw ROM code region. Only early boot code is linearly mapped; later code is overlay-loaded.',
    },
    {
      name: 'code_to_first_archive_gap',
      category: 'structural_gap',
      start: codeEnd,
      end: 0x00636784,
      source: 'Rev 0 coverage ledger boundary check',
      note: '24-byte non-code gap between configured code-region end and first LHA archive header.',
    },
    {
      name: 'audio_data',
      category: 'audio',
      start: 0x00925483,
      end: 0x01C4801C,
      source: 'parent docs/OgreBattle-Platform.md',
    },
    {
      name: 'lzss_region',
      category: 'lzss',
      start: 0x020248C2,
      end: 0x026FF9F0,
      source: 'parent docs/OgreBattle-Platform.md',
    },
    {
      name: 'cluster_3_tail_data',
      category: 'tail_data',
      start: 0x0275415B,
      end: 0x0275DD40,
      source: 'Rev 0 coverage ledger tail scan',
      note: 'Structured non-FF tail bytes after the last LHA archive and before trailing padding.',
    },
  ];

  for (const archive of archives) {
    const catalog = parentCatalog?.entries?.[archive.index] || {};
    ranges.push({
      name: `${archiveCluster(archive.index)}_${String(archive.index).padStart(3, '0')}`,
      category: 'archive',
      start: archive.start,
      end: archive.end,
      source: 'LHA header scan',
      archive: {
        index: archive.index,
        filename: catalog.filename || null,
        contentType: catalog.contentType || null,
        parsed: catalog.parsed || null,
        method: archive.method,
        level: archive.level,
        compSize: archive.compSize,
        uncompSize: archive.uncompSize,
        totalHeaderSize: archive.totalHeaderSize,
      },
    });
  }
  return ranges.sort((a, b) => a.start - b.start || a.end - b.end || a.name.localeCompare(b.name));
}

function bitForCategory(category) {
  const bit = CATEGORY_BITS[category];
  if (!bit) throw new Error(`Unknown category: ${category}`);
  return bit;
}

function tagCoverage(size, ranges) {
  const tags = new Uint16Array(size);
  const categoryBytes = Object.fromEntries(Object.keys(CATEGORY_BITS).map((key) => [key, 0]));
  const overlaps = [];

  for (const range of ranges) {
    const start = Math.max(0, range.start);
    const end = Math.min(size, range.end);
    if (start >= end) continue;
    const bit = bitForCategory(range.category);
    let overlappedBytes = 0;
    for (let i = start; i < end; i += 1) {
      if (tags[i] !== 0 && (tags[i] & bit) === 0) overlappedBytes += 1;
      tags[i] |= bit;
    }
    categoryBytes[range.category] += end - start;
    if (overlappedBytes > 0) {
      overlaps.push({
        name: range.name,
        category: range.category,
        start: hex(start),
        endExclusive: hex(end),
        overlappedBytes,
      });
    }
  }
  return { tags, categoryBytes, overlaps };
}

function tagArchiveEnvelopes(size, envelopes) {
  const tags = new Uint8Array(size);
  for (let i = 0; i < envelopes.length; i += 1) {
    const envelope = envelopes[i];
    for (let off = envelope.start; off < envelope.end && off < size; off += 1) tags[off] = i + 1;
  }
  return tags;
}

function categoryList(mask) {
  return Object.entries(CATEGORY_BITS)
    .filter(([, bit]) => (mask & bit) !== 0)
    .map(([name]) => name);
}

function dominantCategory(mask) {
  for (const category of CATEGORY_PRIORITY) {
    if ((mask & CATEGORY_BITS[category]) !== 0) return category;
  }
  return null;
}

function analyzeMipsRisk(z64, start, end) {
  const alignedStart = start + ((4 - (start % 4)) % 4);
  const alignedEnd = end - (end % 4);
  const words = Math.max(0, (alignedEnd - alignedStart) / 4);
  if (words <= 0) {
    return {
      alignedWords: 0,
      nonZeroWords: 0,
      branchOrJumpWords: 0,
      memoryWords: 0,
      prologueLikeWords: 0,
      risk: 'none',
    };
  }

  let nonZeroWords = 0;
  let branchOrJumpWords = 0;
  let memoryWords = 0;
  let prologueLikeWords = 0;
  const samples = [];

  for (let off = alignedStart; off < alignedEnd; off += 4) {
    const word = z64.readUInt32BE(off);
    if (word !== 0 && word !== 0xFFFFFFFF) nonZeroWords += 1;
    const kind = classifyInstruction(word);
    if (kind === 'branch' || kind === 'jump' || kind === 'jump-register') branchOrJumpWords += 1;
    if (kind === 'memory') memoryWords += 1;
    if ((word & 0xFFFF0000) === 0x27BD0000 || (word & 0xFFFF0000) === 0xAFBF0000) prologueLikeWords += 1;
    if (samples.length < 6 && word !== 0 && word !== 0xFFFFFFFF) {
      samples.push({
        offset: hex(off),
        word: hex(word),
        disasm: disasmWord(word, 0x80000000 + off),
      });
    }
  }

  const nonZeroRatio = nonZeroWords / words;
  const controlRatio = branchOrJumpWords / words;
  const memoryRatio = memoryWords / words;
  let risk = 'low';
  if (words >= 8 && prologueLikeWords > 0 && nonZeroRatio > 0.2) risk = 'medium';
  if (words >= 16 && prologueLikeWords >= 2 && controlRatio > 0.02 && memoryRatio > 0.1) risk = 'high';

  return {
    alignedWords: words,
    nonZeroWords,
    branchOrJumpWords,
    memoryWords,
    prologueLikeWords,
    nonZeroRatio: Number(nonZeroRatio.toFixed(4)),
    controlRatio: Number(controlRatio.toFixed(4)),
    memoryRatio: Number(memoryRatio.toFixed(4)),
    risk,
    samples,
  };
}

function classifyUntypedSpan(z64, start, end, archiveEnvelopeName = null) {
  let zero = 0;
  let ff = 0;
  let other = 0;
  for (let i = start; i < end; i += 1) {
    if (z64[i] === 0x00) zero += 1;
    else if (z64[i] === 0xFF) ff += 1;
    else other += 1;
  }
  const bytes = end - start;
  if (archiveEnvelopeName) {
    return {
      category: 'archive_gap',
      archiveEnvelope: archiveEnvelopeName,
      zero,
      ff,
      other,
      note: 'Untagged bytes inside an archive cluster envelope. Kept separate from parsed LHA archive bytes so missed archive candidates remain auditable.',
    };
  }
  if (other === 0 && zero === bytes) return { category: 'padding_zero', zero, ff, other };
  if (other === 0 && ff === bytes) return { category: 'padding_ff', zero, ff, other };
  if (other === 0) return { category: 'padding_zero_ff', zero, ff, other };
  const risk = analyzeMipsRisk(z64, start, end);
  return { category: 'unknown', zero, ff, other, mipsRisk: risk };
}

function summarizeSpans(z64, tags, archiveEnvelopeTags, archiveEnvelopes) {
  const spans = [];
  let start = 0;
  let mask = tags[0];
  let archiveEnvelope = archiveEnvelopeTags[0];
  for (let i = 1; i <= tags.length; i += 1) {
    const current = i < tags.length ? tags[i] : -1;
    const currentArchiveEnvelope = i < archiveEnvelopeTags.length ? archiveEnvelopeTags[i] : -1;
    if (current === mask && currentArchiveEnvelope === archiveEnvelope) continue;
    const end = i;
    if (mask === 0) {
      const envelopeName = archiveEnvelope > 0 ? archiveEnvelopes[archiveEnvelope - 1].name : null;
      const classification = classifyUntypedSpan(z64, start, end, envelopeName);
      spans.push({
        start,
        end,
        bytes: end - start,
        tagged: false,
        category: classification.category,
        classification,
      });
    } else {
      spans.push({
        start,
        end,
        bytes: end - start,
        tagged: true,
        category: dominantCategory(mask),
        categories: categoryList(mask),
        overlap: (mask & (mask - 1)) !== 0,
      });
    }
    start = i;
    mask = current;
    archiveEnvelope = currentArchiveEnvelope;
  }
  return spans;
}

function aggregate(spans, romSize) {
  const summary = {
    romSize,
    taggedBytes: 0,
    untaggedBytes: 0,
    overlapBytes: 0,
    byCategory: {},
    unknownSpans: 0,
    unknownBytes: 0,
    archiveGapSpans: 0,
    archiveGapBytes: 0,
    highRiskUnknownSpans: 0,
    mediumRiskUnknownSpans: 0,
  };
  for (const span of spans) {
    if (span.tagged) {
      summary.taggedBytes += span.bytes;
      if (span.overlap) summary.overlapBytes += span.bytes;
      summary.byCategory[span.category] = (summary.byCategory[span.category] || 0) + span.bytes;
    } else {
      summary.untaggedBytes += span.bytes;
      summary.byCategory[span.category] = (summary.byCategory[span.category] || 0) + span.bytes;
      if (span.category === 'unknown') {
        summary.unknownSpans += 1;
        summary.unknownBytes += span.bytes;
        if (span.classification.mipsRisk?.risk === 'high') summary.highRiskUnknownSpans += 1;
        if (span.classification.mipsRisk?.risk === 'medium') summary.mediumRiskUnknownSpans += 1;
      } else if (span.category === 'archive_gap') {
        summary.archiveGapSpans += 1;
        summary.archiveGapBytes += span.bytes;
      }
    }
  }
  summary.coveredOrClassifiedBytes = summary.taggedBytes + summary.untaggedBytes;
  summary.coveragePercent = Number(((summary.coveredOrClassifiedBytes / romSize) * 100).toFixed(4));
  return summary;
}

function formatSpan(span) {
  return {
    start: hex(span.start),
    endExclusive: hex(span.end),
    bytes: span.bytes,
    tagged: span.tagged,
    category: span.category,
    categories: span.categories,
    overlap: span.overlap,
    classification: span.classification,
  };
}

function writeMarkdown(filePath, report) {
  const lines = [];
  lines.push('# Rev 0 ROM Coverage Ledger');
  lines.push('');
  lines.push(`Input: \`${report.inputPath}\``);
  lines.push(`ROM size: ${report.summary.romSize} bytes`);
  lines.push(`Coverage policy: ${report.policy}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|---|---:|');
  lines.push(`| Tagged bytes | ${report.summary.taggedBytes} |`);
  lines.push(`| Untagged classified bytes | ${report.summary.untaggedBytes} |`);
  lines.push(`| Overlap bytes | ${report.summary.overlapBytes} |`);
  lines.push(`| Unknown bytes | ${report.summary.unknownBytes} |`);
  lines.push(`| Unknown spans | ${report.summary.unknownSpans} |`);
  lines.push(`| Archive-gap bytes | ${report.summary.archiveGapBytes} |`);
  lines.push(`| Archive-gap spans | ${report.summary.archiveGapSpans} |`);
  lines.push(`| High-risk unknown spans | ${report.summary.highRiskUnknownSpans} |`);
  lines.push(`| Medium-risk unknown spans | ${report.summary.mediumRiskUnknownSpans} |`);
  lines.push('');
  lines.push('## Category Bytes');
  lines.push('');
  lines.push('| Category | Bytes |');
  lines.push('|---|---:|');
  for (const [category, bytes] of Object.entries(report.summary.byCategory)) {
    lines.push(`| ${category} | ${bytes} |`);
  }
  lines.push('');
  lines.push('## Unknown Spans');
  lines.push('');
  const unknowns = report.spans.filter((span) => span.category === 'unknown');
  if (unknowns.length === 0) {
    lines.push('No unknown spans remain after known tags and padding classification.');
  } else {
    lines.push('| Range | Bytes | Risk | Other Bytes | Sample |');
    lines.push('|---|---:|---|---:|---|');
    for (const span of unknowns.slice(0, 50)) {
      const sample = span.classification.mipsRisk?.samples?.[0];
      lines.push(`| ${span.start}..${span.endExclusive} | ${span.bytes} | ${span.classification.mipsRisk?.risk || 'n/a'} | ${span.classification.other} | ${sample ? `${sample.word} ${sample.disasm}` : ''} |`);
    }
    if (unknowns.length > 50) lines.push(`| ... | ${unknowns.length - 50} more | | | |`);
  }
  lines.push('');
  lines.push('## Archive Signature Audit');
  lines.push('');
  lines.push(`Parsed LHA archives: ${report.archiveScan.count}`);
  lines.push(`Parent catalog count: ${report.archiveScan.parentCatalogCount ?? 'n/a'}`);
  lines.push(`Method-like signatures: ${report.archiveScan.methodLikeHits}`);
  lines.push(`Unparsed method-like signatures: ${report.archiveScan.unparsedMethodLikeHits.length}`);
  if (report.archiveScan.unparsedMethodLikeHits.length > 0) {
    lines.push('');
    lines.push('| Offset | Method | Span Category | Reason |');
    lines.push('|---|---|---|---|');
    for (const hit of report.archiveScan.unparsedMethodLikeHits.slice(0, 50)) {
      lines.push(`| ${hit.methodOffset} | ${hit.method} | ${hit.spanCategory || ''} | ${hit.rejectionReason} |`);
    }
    if (report.archiveScan.unparsedMethodLikeHits.length > 50) {
      lines.push(`| ... | | | ${report.archiveScan.unparsedMethodLikeHits.length - 50} more |`);
    }
  }
  lines.push('');
  lines.push('## Overlap Notes');
  lines.push('');
  if (report.overlapRanges.length === 0) {
    lines.push('No range overlaps were detected.');
  } else {
    lines.push('| Range | Categories | Bytes |');
    lines.push('|---|---|---:|');
    for (const span of report.spans.filter((span) => span.overlap)) {
      lines.push(`| ${span.start}..${span.endExclusive} | ${span.categories.join(', ')} | ${span.bytes} |`);
    }
  }
  lines.push('');
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const profile = loadProfile();
  const result = loadAndVerifyRom({ inputPath: args.input, profile });
  if (!result.verification.ok) {
    for (const check of result.verification.checks.filter((check) => !check.ok)) {
      console.error(`Rev 0 verification failed: ${check.name} expected ${check.expected}, got ${check.actual}`);
    }
    process.exit(1);
  }

  const parentCatalog = loadParentCatalog();
  const archives = parseLhaArchives(result.z64);
  const archiveEnvelopes = archiveClusterEnvelopes(archives);
  const ranges = buildRanges(profile, archives, parentCatalog);
  const { tags, categoryBytes, overlaps } = tagCoverage(result.z64.length, ranges);
  const archiveEnvelopeTags = tagArchiveEnvelopes(result.z64.length, archiveEnvelopes);
  const spans = summarizeSpans(result.z64, tags, archiveEnvelopeTags, archiveEnvelopes).map(formatSpan);
  const summary = aggregate(spans.map((span) => ({
    ...span,
    start: parseHexOrNumber(span.start),
    end: parseHexOrNumber(span.endExclusive),
  })), result.z64.length);
  const spanForOffset = (offset) => spans.find((span) => parseHexOrNumber(span.start) <= offset && offset < parseHexOrNumber(span.endExclusive));
  const parsedMethodOffsets = new Set(archives.map((archive) => archive.start + 2));
  const methodHits = methodLikeHits(result.z64);
  const unparsedMethodLikeHits = methodHits
    .filter((hit) => !parsedMethodOffsets.has(hit.methodOffset))
    .map((hit) => {
      const span = spanForOffset(hit.methodOffset);
      return {
        methodOffset: hex(hit.methodOffset),
        headerStart: hex(hit.headerStart),
        method: hit.method,
        rejectionReason: rejectionReasonForMethodHit(result.z64, hit),
        spanCategory: span?.category || null,
        spanCategories: span?.categories || null,
      };
    });

  const report = {
    tool: 'build_rom_coverage_ledger',
    profile: profile.id,
    inputPath: result.inputPath,
    detectedByteOrder: result.detectedByteOrder,
    policy: 'Known structural ranges are tagged; all remaining spans are classified as padding or unknown with MIPS-risk hints. Overlaps are reported, not hidden.',
    archiveScan: {
      count: archives.length,
      parentCatalogPath: parentCatalog?.path || null,
      parentCatalogCount: parentCatalog?.entries?.length || null,
      countMatchesParentCatalog: parentCatalog ? parentCatalog.entries.length === archives.length : null,
      offsetsMatchParentCatalog: parentCatalog
        ? archives.every((archive, index) => parseHexOrNumber(parentCatalog.entries[index].romOffset) === archive.start)
        : null,
      methodLikeHits: methodHits.length,
      parsedMethodLikeHits: archives.length,
      unparsedMethodLikeHits,
      archiveEnvelopes: archiveEnvelopes.map((envelope) => ({
        ...envelope,
        start: hex(envelope.start),
        endExclusive: hex(envelope.end),
        bytes: envelope.end - envelope.start,
      })),
    },
    categoryBytesRawTagged: categoryBytes,
    summary,
    overlapRanges: overlaps,
    ranges: ranges.map((range) => ({
      ...range,
      start: hex(range.start),
      endExclusive: hex(range.end),
      bytes: range.end - range.start,
    })),
    spans,
  };

  writeJson(args.json, report);
  writeMarkdown(args.md, report);
  console.log(`Rev 0 ROM verified: ${result.verification.header.crc1}/${result.verification.header.crc2}`);
  console.log(`Archives scanned: ${archives.length}${report.archiveScan.countMatchesParentCatalog ? ' (matches parent catalog)' : ''}`);
  console.log(`Method-like signatures: ${methodHits.length}; unparsed: ${unparsedMethodLikeHits.length}`);
  console.log(`Unknown bytes: ${summary.unknownBytes} across ${summary.unknownSpans} span(s)`);
  console.log(`Archive-gap bytes: ${summary.archiveGapBytes} across ${summary.archiveGapSpans} span(s)`);
  console.log(`Overlap bytes: ${summary.overlapBytes}`);
  console.log(`Wrote JSON: ${args.json}`);
  console.log(`Wrote Markdown: ${args.md}`);
  const suspiciousUnparsed = unparsedMethodLikeHits.filter((hit) => hit.spanCategory === 'unknown');
  if (summary.highRiskUnknownSpans > 0 || suspiciousUnparsed.length > 0) process.exitCode = 2;
}

main();
