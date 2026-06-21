#!/usr/bin/env node
// Rev 0 code-region audit.
//
// The configured code region (config/roms/us_rev0.json codeRegion) is currently
// emitted in full as `.word` original_mips source. That preserves bytes but does
// NOT prove every word is executable. This tool produces repeatable evidence for
// where executable MIPS actually lives versus where the configured code region
// holds non-code data that is currently mislabeled as code.
//
// It is read-only: it writes only gitignored reports under build/coverage and
// never changes the rebuild path. Promotion/reclassification is a separate,
// later step that must keep the byte-exact rebuild gate green.
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

// MIPS opcodes (top 6 bits) that appear in normal compiled MIPS3 code. Used only
// as a coarse density signal, never as proof on its own.
const CODE_OPS = new Set([
  0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
  0x0d, 0x0e, 0x0f, 0x11, 0x14, 0x15, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x28,
  0x29, 0x2a, 0x2b, 0x2e, 0x31, 0x35, 0x39, 0x3d,
]);
const JR_RA = 0x03e00008;
const RAM_LO = 0x80000000;
const RAM_HI = 0x80800000;
const WINDOW = 0x40000; // 256 KiB report granularity.

// Verdict thresholds. Conservative on purpose: a window is only called "data"
// when it has zero function returns, no detected-function coverage, and is not
// opcode-dense. Anything in between stays "unproven".
const CODE_JR_RA_PER_KB = 0.25;
const DATA_CODE_OP_PCT = 75;

function usage() {
  console.log(`Usage: node tools/audit_code_region.js [--input <rom>] [--functions <json>] [--overlays <json>] [--json <path>] [--md <path>]\n\nAudits the configured Rev 0 code region for its executable extent and surfaces non-code data currently emitted as original MIPS. Read-only; writes gitignored reports only.`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    functions: path.resolve(ROOT, '..', 'scripts', 'ob64_functions.json'),
    overlays: path.resolve(ROOT, '..', 'ram_snapshots', 'overlay_sources.json'),
    json: path.join(ROOT, 'build', 'coverage', 'rev0-code-region-audit.json'),
    md: path.join(ROOT, 'build', 'coverage', 'rev0-code-region-audit.md'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--input') {
      args.input = argv[++i];
    } else if (arg === '--functions') {
      args.functions = path.resolve(argv[++i]);
    } else if (arg === '--overlays') {
      args.overlays = path.resolve(argv[++i]);
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

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function mergeIntervals(intervals) {
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [s, e] of sorted) {
    if (merged.length && s <= merged[merged.length - 1][1]) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
    } else {
      merged.push([s, e]);
    }
  }
  return merged;
}

// Bytes of [s,e) covered by the merged (sorted, non-overlapping) intervals.
function coveredBytes(merged, s, e) {
  let covered = 0;
  for (const [is, ie] of merged) {
    const lo = Math.max(is, s);
    const hi = Math.min(ie, e);
    if (hi > lo) covered += hi - lo;
    if (is >= e) break;
  }
  return covered;
}

function scanEvidence(z, s, e) {
  const n = e - s;
  let zero = 0;
  let ptr = 0;
  let jrRa = 0;
  let codeOp = 0;
  let words = 0;
  let ascii = 0;
  for (let i = s; i + 4 <= e; i += 4) {
    const w = z.readUInt32BE(i);
    words += 1;
    if (w === 0) zero += 1;
    if (w === JR_RA) jrRa += 1;
    if (w >= RAM_LO && w < RAM_HI) ptr += 1;
    if (CODE_OPS.has((w >>> 26) & 0x3f)) codeOp += 1;
  }
  for (let i = s; i < e; i += 1) {
    const x = z[i];
    if (x >= 0x20 && x < 0x7f) ascii += 1;
  }
  const kb = n / 1024;
  return {
    bytes: n,
    words,
    zeroPct: words ? +(100 * zero / words).toFixed(2) : 0,
    ptrPct: words ? +(100 * ptr / words).toFixed(2) : 0,
    codeOpPct: words ? +(100 * codeOp / words).toFixed(2) : 0,
    asciiPct: n ? +(100 * ascii / n).toFixed(2) : 0,
    jrRa,
    jrRaPerKb: kb ? +(jrRa / kb).toFixed(3) : 0,
  };
}

function verdictFor(ev, detectedCoveragePct) {
  if (detectedCoveragePct > 0 || ev.jrRaPerKb >= CODE_JR_RA_PER_KB) return 'code-evidenced';
  if (ev.jrRa === 0 && detectedCoveragePct === 0 && ev.codeOpPct < DATA_CODE_OP_PCT) return 'data-evidenced';
  return 'unproven';
}

function buildWindows(z, merged, start, end) {
  const windows = [];
  for (let ws = start; ws < end; ws += WINDOW) {
    const we = Math.min(ws + WINDOW, end);
    const ev = scanEvidence(z, ws, we);
    const covered = coveredBytes(merged, ws, we);
    const detectedCoveragePct = +(100 * covered / (we - ws)).toFixed(2);
    windows.push({
      romStart: hex(ws),
      romEndExclusive: hex(we),
      bytes: we - ws,
      detectedFnCoveragePct: detectedCoveragePct,
      ...ev,
      verdict: verdictFor(ev, detectedCoveragePct),
    });
  }
  return windows;
}

function loadOptionalJson(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  try {
    return readJson(filePath);
  } catch (err) {
    return null;
  }
}

function overlayContainment(overlays, lo, hi) {
  const out = { checked: 0, inside: 0, outsideExecutableExtent: [], items: [] };
  if (!overlays) return out;
  const regions = Array.isArray(overlays.regions) ? overlays.regions : [];
  for (const r of regions) {
    const start = parseHexOrNumber(r.rom);
    const size = typeof r.size === 'number' ? r.size : parseHexOrNumber(r.size);
    const endEx = start + size;
    const inside = start >= lo && endEx <= hi;
    out.checked += 1;
    if (inside) out.inside += 1; else out.outsideExecutableExtent.push({ rom: hex(start), endExclusive: hex(endEx), note: r.note || null });
    out.items.push({ rom: hex(start), endExclusive: hex(endEx), bytes: size, inside, note: r.note || null });
  }
  const known = Array.isArray(overlays.known_function_overlays) ? overlays.known_function_overlays : [];
  for (const k of known) {
    if (k.rom_hint == null) continue;
    const start = k.rom_hint;
    const inside = start >= lo && start < hi;
    out.checked += 1;
    if (inside) out.inside += 1; else out.outsideExecutableExtent.push({ rom: hex(start), name: k.name || null });
  }
  return out;
}

function writeMarkdown(filePath, report) {
  const L = [];
  L.push('# Rev 0 Code-Region Audit');
  L.push('');
  L.push(`Profile: \`${report.profile}\``);
  L.push(`Configured code region: \`${report.configuredCodeRegion.start}..${report.configuredCodeRegion.endExclusive}\` (${report.configuredCodeRegion.bytes} bytes)`);
  L.push('');
  L.push('This is read-only evidence. The configured code region is still emitted as');
  L.push('byte-exact `original_mips` and the rebuild path is unchanged. Reclassifying');
  L.push('the suspected non-code tail is a separate, gated step.');
  L.push('');
  L.push('## Headline');
  L.push('');
  if (report.executableExtent) {
    L.push(`- Executable code extent (evidence): \`${report.executableExtent.start}..${report.executableExtent.endExclusive}\` = ${report.executableExtent.bytes} bytes.`);
    L.push(`- Detected functions: ${report.detection.functionCount} (valid ${report.detection.validCount}); last detected end \`${report.detection.lastDetectedEnd}\`.`);
  } else {
    L.push('- Parent function DB unavailable; detection-boundary evidence skipped (intrinsic scan only).');
  }
  if (report.suspectedNonCodeTail) {
    const t = report.suspectedNonCodeTail;
    L.push(`- Suspected non-code tail: \`${t.start}..${t.endExclusive}\` = ${t.bytes} bytes (${t.pctOfCodeRegion}% of the configured code region), verdict **${t.verdict}** (jr_ra=${t.evidence.jrRa}, codeOp%=${t.evidence.codeOpPct}, ascii%=${t.evidence.asciiPct}).`);
  }
  L.push('');
  L.push('## Findings');
  L.push('');
  for (const f of report.findings) L.push(`- ${f}`);
  L.push('');
  L.push('## Method');
  L.push('');
  L.push('- Detected-function coverage: union of valid parent function `[start_rom,end_rom)` intervals inside the configured code region.');
  L.push('- Intrinsic evidence per 256 KiB window: `jr $ra` (0x03E00008) density, common-opcode density, RAM-pointer-word density, zero-word density, ASCII byte density.');
  L.push(`- Verdict: \`code-evidenced\` if a window has any detected coverage or >= ${CODE_JR_RA_PER_KB} jr_ra/KB; \`data-evidenced\` if it has zero jr_ra, zero detected coverage, and < ${DATA_CODE_OP_PCT}% opcode words; otherwise \`unproven\`.`);
  L.push('');
  L.push('## Windows');
  L.push('');
  L.push('| ROM range | det.fn% | jr_ra/KB | codeOp% | ptr% | zero% | ascii% | verdict |');
  L.push('|---|---:|---:|---:|---:|---:|---:|---|');
  for (const w of report.windows) {
    L.push(`| ${w.romStart}..${w.romEndExclusive} | ${w.detectedFnCoveragePct} | ${w.jrRaPerKb} | ${w.codeOpPct} | ${w.ptrPct} | ${w.zeroPct} | ${w.asciiPct} | ${w.verdict} |`);
  }
  L.push('');
  if (report.overlayContainment) {
    L.push('## Overlay Containment');
    L.push('');
    L.push(`Checked ${report.overlayContainment.checked} parent overlay source/known-overlay anchors; ${report.overlayContainment.inside} inside the executable extent.`);
    if (report.overlayContainment.outsideExecutableExtent.length) {
      L.push('');
      L.push('Outside the executable extent:');
      for (const o of report.overlayContainment.outsideExecutableExtent) {
        L.push(`- ${o.rom}${o.endExclusive ? `..${o.endExclusive}` : ''} ${o.name || o.note || ''}`);
      }
    }
    L.push('');
  }
  L.push('## Recommendation');
  L.push('');
  L.push(report.recommendation);
  L.push('');
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${L.join('\n')}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const profile = loadProfile();
  const codeStart = parseHexOrNumber(profile.codeRegion.start);
  const codeEnd = parseHexOrNumber(profile.codeRegion.endExclusive);

  const result = loadAndVerifyRom({ inputPath: args.input });
  if (!result.verification.ok) {
    for (const check of result.verification.checks.filter((c) => !c.ok)) {
      console.error(`Rev 0 verification failed: ${check.name} expected ${check.expected}, got ${check.actual}`);
    }
    process.exit(1);
  }
  const z = result.z64;

  const functionDb = loadOptionalJson(args.functions);
  const overlays = loadOptionalJson(args.overlays);

  let detection = null;
  let merged = [];
  let lastDetectedEnd = null;
  let firstDetectedStart = null;
  let detectedBytes = 0;
  if (functionDb && Array.isArray(functionDb.functions)) {
    const intervals = functionDb.functions
      .filter((f) => f.valid !== false && typeof f.start_rom === 'number' && typeof f.end_rom === 'number')
      .map((f) => [f.start_rom, f.end_rom])
      .filter(([s, e]) => e > s && s >= codeStart && e <= codeEnd);
    merged = mergeIntervals(intervals);
    if (merged.length) {
      firstDetectedStart = merged[0][0];
      lastDetectedEnd = merged[merged.length - 1][1];
      detectedBytes = merged.reduce((a, [s, e]) => a + (e - s), 0);
    }
    // Invalid (valid:false) entries are scanner false positives. Surface any that
    // land past the valid boundary so the conservative valid-only boundary is not
    // confused with the raw max end_rom of the whole DB.
    const invalidInRegion = functionDb.functions.filter(
      (f) => f.valid === false && typeof f.start_rom === 'number' && f.start_rom >= codeStart && f.start_rom < codeEnd,
    );
    const invalidMaxEnd = invalidInRegion.reduce((m, f) => Math.max(m, f.end_rom || 0), 0);
    detection = {
      source: rel(args.functions),
      functionCount: functionDb.meta?.function_count ?? functionDb.functions.length,
      validCount: functionDb.meta?.valid_count ?? intervals.length,
      dataRangesMasked: functionDb.meta?.data_ranges_masked ?? null,
      mergedIntervals: merged.length,
      firstDetectedStart: firstDetectedStart != null ? hex(firstDetectedStart) : null,
      lastDetectedEnd: lastDetectedEnd != null ? hex(lastDetectedEnd) : null,
      detectedBytes,
      invalidFalsePositives: invalidInRegion.length,
      invalidFalsePositiveMaxEnd: invalidInRegion.length ? hex(invalidMaxEnd) : null,
    };
  }

  const boundary = lastDetectedEnd != null ? lastDetectedEnd : codeEnd;

  // Build windows split at the detection boundary so no window straddles it.
  const windows = [];
  if (boundary > codeStart) windows.push(...buildWindows(z, merged, codeStart, boundary));
  if (boundary < codeEnd) windows.push(...buildWindows(z, merged, boundary, codeEnd));

  let executableExtent = null;
  let suspectedNonCodeTail = null;
  if (lastDetectedEnd != null) {
    const extEv = scanEvidence(z, codeStart, lastDetectedEnd);
    const extGapBytes = (lastDetectedEnd - codeStart) - detectedBytes;
    executableExtent = {
      start: hex(codeStart),
      endExclusive: hex(lastDetectedEnd),
      bytes: lastDetectedEnd - codeStart,
      detectedFunctionBytes: detectedBytes,
      interleavedGapBytes: extGapBytes,
      interleavedGapPct: +(100 * extGapBytes / (lastDetectedEnd - codeStart)).toFixed(2),
      evidence: extEv,
    };
    if (lastDetectedEnd < codeEnd) {
      const tailEv = scanEvidence(z, lastDetectedEnd, codeEnd);
      const covered = coveredBytes(merged, lastDetectedEnd, codeEnd);
      suspectedNonCodeTail = {
        start: hex(lastDetectedEnd),
        endExclusive: hex(codeEnd),
        bytes: codeEnd - lastDetectedEnd,
        pctOfCodeRegion: +(100 * (codeEnd - lastDetectedEnd) / (codeEnd - codeStart)).toFixed(2),
        detectedFunctionBytes: covered,
        evidence: tailEv,
        verdict: verdictFor(tailEv, +(100 * covered / (codeEnd - lastDetectedEnd)).toFixed(2)),
      };
    }
  }

  const containment = overlays
    ? overlayContainment(overlays, codeStart, lastDetectedEnd != null ? lastDetectedEnd : codeEnd)
    : null;

  const findings = [];
  if (suspectedNonCodeTail && suspectedNonCodeTail.verdict === 'data-evidenced') {
    findings.push(
      `The configured code region is conservative: executable code ends near ${executableExtent.endExclusive}. The trailing ${suspectedNonCodeTail.bytes} bytes (${suspectedNonCodeTail.pctOfCodeRegion}% of the code region) contain ZERO \`jr $ra\` returns across ${suspectedNonCodeTail.evidence.words} words and ${suspectedNonCodeTail.evidence.asciiPct}% ASCII density, so they are non-code data currently emitted as \`.word\` original_mips.`,
    );
  }
  if (executableExtent) {
    findings.push(
      `Executable extent ${executableExtent.start}..${executableExtent.endExclusive} is opcode-dense (codeOp%=${executableExtent.evidence.codeOpPct}, ${executableExtent.evidence.jrRa} jr_ra, ${executableExtent.evidence.jrRaPerKb}/KB) but still contains ${executableExtent.interleavedGapBytes} bytes (${executableExtent.interleavedGapPct}%) of interleaved gap/rodata between detected functions.`,
    );
  }
  if (detection?.dataRangesMasked != null) {
    findings.push(`Parent function scan masked ${detection.dataRangesMasked} data ranges inside the code region (locations not enumerated in the DB).`);
  }
  if (detection?.invalidFalsePositives) {
    findings.push(`Parent DB has ${detection.invalidFalsePositives} invalid (valid:false) false-positive function(s) inside the code region, reaching ${detection.invalidFalsePositiveMaxEnd}; these are excluded from the executable extent and explain why the raw max end_rom of the DB exceeds the valid boundary.`);
  }
  if (containment) {
    findings.push(`All ${containment.checked} parent overlay anchors checked; ${containment.inside} fall inside the executable extent (${containment.outsideExecutableExtent.length} outside).`);
  }
  if (!detection) {
    findings.push('Parent function DB unavailable; only intrinsic per-window code/data evidence was computed.');
  }

  const recommendation = suspectedNonCodeTail && suspectedNonCodeTail.verdict === 'data-evidenced'
    ? `Next step: refine the exact code/data boundary near ${executableExtent.endExclusive} with a finer scan, then reclassify ${suspectedNonCodeTail.start}..${suspectedNonCodeTail.endExclusive} from code/original_mips to a data source form in config/segments + the coverage ledger + the full-ROM source manifest, keeping the byte-exact rebuild and verify_setup gate green. Until then, the region stays byte-exact original_mips and is flagged here as unproven-as-code.`
    : 'Next step: extend window evidence and cross-check against parent xrefs before changing any classification.';

  const report = {
    tool: 'audit_code_region',
    profile: profile.id,
    inputPath: result.inputPath,
    byteOrder: result.detectedByteOrder,
    z64Sha256: result.hashes.z64Sha256,
    configuredCodeRegion: {
      start: profile.codeRegion.start,
      endExclusive: profile.codeRegion.endExclusive,
      bytes: codeEnd - codeStart,
    },
    policy:
      'Read-only evidence. Identifies the executable code extent vs non-code data inside the configured code region. Does not change classification or the rebuild path.',
    detection,
    executableExtent,
    suspectedNonCodeTail,
    overlayContainment: containment,
    windowBytes: WINDOW,
    windows,
    findings,
    recommendation,
  };

  writeJson(args.json, report);
  writeMarkdown(args.md, report);
  console.log('Code-region audit: OK');
  if (executableExtent) {
    console.log(`Executable extent: ${executableExtent.start}..${executableExtent.endExclusive} (${executableExtent.bytes} bytes)`);
  }
  if (suspectedNonCodeTail) {
    console.log(`Suspected non-code tail: ${suspectedNonCodeTail.start}..${suspectedNonCodeTail.endExclusive} (${suspectedNonCodeTail.bytes} bytes; ${suspectedNonCodeTail.pctOfCodeRegion}% of code region); verdict=${suspectedNonCodeTail.verdict}`);
  }
  console.log(`Wrote JSON: ${args.json}`);
  console.log(`Wrote Markdown: ${args.md}`);
}

main();
