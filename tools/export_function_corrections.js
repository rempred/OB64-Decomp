#!/usr/bin/env node
// Read-only export of the function-boundary corrections accumulated by the
// source-ownership loop, as a machine-readable diff against the parent
// function DB (parent scripts/ob64_functions.json).
//
// The decomp manifest's named parts are the validated partition of the
// executable extent (every boundary disasm-validated + gate-checked during
// the chunk-split loop; see docs/dossiers/ and docs/REVIEW_*.md). The parent
// DB is the heuristic scan the loop repeatedly corrected (over-merges, missed
// frameless leaves, orphaned load preambles, data mislabeled as functions —
// see AGENTS.md "Parent Function DB Hazards").
//
// Output (ignored proof artifacts):
//   build/corrections/rev0-function-corrections.json
//   build/corrections/rev0-function-corrections.md
//
// Categories:
//   refutedAsData        parent valid function whose START lies inside a
//                        byte-validated decomp data part (not a function)
//   endOverExtensions    parent function that IS real (starts in a code part)
//                        but whose interval runs >=50% into decomp data parts
//                        (end boundary over-extended into a data island)
//   startCorrections     parent start sits inside a decomp code part that
//                        starts earlier (read-before-write preamble orphans)
//   recoveredFunctions   decomp code part containing NO parent valid start
//                        (frameless leaves + parent-undetected regions)
//   parentOverMerges     one parent function spanning >=2 decomp code parts
//   decompClusters       one decomp code part containing >=2 parent starts
//                        (deliberate cluster files / folded orphans — NOT
//                        necessarily parent errors; listed for completeness)
//   invalidInExtent      parent valid:false entries inside the extent
//   beyondExtent         parent entries past the executable extent (data tail)
//
// Usage: node tools/export_function_corrections.js [--parent-db <json>]
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const A = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i += 2) A[av[i].replace(/^--/, '')] = av[i + 1];

const PARENT_DB = A['parent-db']
  ? path.resolve(A['parent-db'])
  : path.resolve(ROOT, '..', 'scripts', 'ob64_functions.json');
const MANIFEST = path.join(ROOT, 'asm', 'original', 'rev0', 'manifest.json');
const OUT_DIR = path.join(ROOT, 'build', 'corrections');

const EXT_START = 0x1000;
const EXT_END = 0x2B89B4; // evidenced executable extent (docs/CODE_REGION_AUDIT.md)

const DATA_PREFIXES = ['data_', 'zero_fill_', 'rodata_', 'table_', 'jumptable_',
  'rsp_ucode_', 'float_', 'str_', 'string_'];
const TAIL_RE = /_chunk\d+tail$/;

const hex = (v) => `0x${v.toString(16).toUpperCase().padStart(8, '0')}`;
const parseHex = (v) => (typeof v === 'number' ? v : parseInt(v, 16));

function loadParts() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const raw = [];
  for (const chunk of manifest.chunks) {
    for (const part of chunk.parts || []) {
      raw.push({
        name: part.name,
        start: parseHex(part.romStart),
        end: parseHex(part.romEndExclusive),
      });
    }
  }
  raw.sort((a, b) => a.start - b.start);
  // Merge straddler tails into their head part (same logical function).
  const merged = [];
  for (const p of raw) {
    const prev = merged[merged.length - 1];
    if (TAIL_RE.test(p.name) && prev && prev.end === p.start
        && p.name.startsWith(prev.name.replace(TAIL_RE, ''))) {
      prev.end = p.end;
      prev.straddler = true;
      continue;
    }
    merged.push({ ...p });
  }
  return merged.filter((p) => p.start < EXT_END && p.end > EXT_START);
}

function main() {
  const db = JSON.parse(fs.readFileSync(PARENT_DB, 'utf8'));
  const fns = db.functions || db;
  const parts = loadParts();
  const codeParts = parts.filter((p) => !DATA_PREFIXES.some((d) => p.name.startsWith(d)));
  const dataParts = parts.filter((p) => DATA_PREFIXES.some((d) => p.name.startsWith(d)));

  const inExtent = fns.filter((f) => f.start_rom >= EXT_START && f.start_rom < EXT_END);
  const validFns = inExtent.filter((f) => f.valid);
  const invalidInExtent = inExtent.filter((f) => !f.valid);
  const beyondExtent = fns.filter((f) => f.start_rom >= EXT_END);

  // index decomp code parts for point/interval queries
  const codeStarts = new Map(codeParts.map((p) => [p.start, p]));
  const findPartContaining = (addr) => {
    // binary search over sorted parts
    let lo = 0; let hi = codeParts.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const p = codeParts[mid];
      if (addr < p.start) hi = mid - 1;
      else if (addr >= p.end) lo = mid + 1;
      else return p;
    }
    return null;
  };
  const findDataOverlap = (start, endEx) => dataParts.filter((p) => p.start < endEx && p.end > start);

  const refutedAsData = [];
  const endOverExtensions = [];
  const startCorrections = [];
  const parentOverMerges = [];
  const parentStartsByPart = new Map();

  for (const f of validFns) {
    const fEndEx = f.end_rom + 4;
    const dataHits = findDataOverlap(f.start_rom, fEndEx);
    const dataBytes = dataHits.reduce(
      (acc, p) => acc + (Math.min(p.end, fEndEx) - Math.max(p.start, f.start_rom)), 0);
    const startPart = findPartContaining(f.start_rom);
    if (dataBytes > 0 && dataBytes >= (fEndEx - f.start_rom) / 2) {
      const entry = {
        parentStart: hex(f.start_rom), parentEndExclusive: hex(fEndEx),
        parentSize: fEndEx - f.start_rom, dataBytesOverlapped: dataBytes,
        decompDataParts: dataHits.map((p) => p.name),
      };
      if (startPart) {
        // real function, end boundary over-extended into data island(s)
        endOverExtensions.push({ ...entry, decompCodePart: startPart.name,
          decompEndExclusive: hex(startPart.end) });
      } else {
        refutedAsData.push(entry);
      }
      continue;
    }
    const part = startPart;
    if (!part) continue; // start inside a data part but <50% overlap; rare, counted above or ignored
    if (!parentStartsByPart.has(part.name)) parentStartsByPart.set(part.name, []);
    parentStartsByPart.get(part.name).push(f.start_rom);
    if (f.start_rom !== part.start && parentStartsByPart.get(part.name).length === 1) {
      // first parent start inside the part but not at the part boundary:
      // classic read-before-write preamble orphan when the delta is small
      startCorrections.push({
        parentStart: hex(f.start_rom), decompStart: hex(part.start),
        deltaBytes: f.start_rom - part.start, decompPart: part.name,
        kind: f.start_rom - part.start > 0 && f.start_rom - part.start <= 16
          ? 'preamble-orphan-fold' : 'boundary-move',
      });
    }
    // over-merge: parent interval spans additional decomp part starts
    const spanned = [];
    for (let cursor = part.end; cursor < fEndEx;) {
      const nxt = codeStarts.get(cursor) || findPartContaining(cursor);
      if (!nxt) break;
      spanned.push(nxt.name);
      cursor = nxt.end;
    }
    if (spanned.length > 0) {
      parentOverMerges.push({
        parentStart: hex(f.start_rom), parentEndExclusive: hex(fEndEx),
        firstDecompPart: part.name, additionalDecompParts: spanned,
      });
    }
  }

  const parentValidStartSet = new Set(validFns.map((f) => f.start_rom));
  const recoveredFunctions = [];
  const decompClusters = [];
  for (const p of codeParts) {
    const inside = validFns.filter((f) => f.start_rom >= p.start && f.start_rom < p.end);
    if (inside.length === 0) {
      recoveredFunctions.push({
        decompStart: hex(p.start), decompEndExclusive: hex(p.end),
        bytes: p.end - p.start, name: p.name,
      });
    } else if (inside.length >= 2) {
      decompClusters.push({
        decompPart: p.name, decompStart: hex(p.start), decompEndExclusive: hex(p.end),
        parentStarts: inside.map((f) => hex(f.start_rom)),
      });
    }
  }

  const report = {
    tool: 'export_function_corrections',
    generated: 'see git history of this artifact\'s consumers; tool is deterministic',
    executableExtent: { start: hex(EXT_START), endExclusive: hex(EXT_END) },
    inputs: {
      parentDb: path.relative(ROOT, PARENT_DB),
      parentFunctionCount: fns.length,
      parentValidInExtent: validFns.length,
      manifest: path.relative(ROOT, MANIFEST),
      decompCodeParts: codeParts.length,
      decompDataParts: dataParts.length,
    },
    summary: {
      refutedAsData: refutedAsData.length,
      endOverExtensions: endOverExtensions.length,
      startCorrections: startCorrections.length,
      recoveredFunctions: recoveredFunctions.length,
      parentOverMerges: parentOverMerges.length,
      decompClusters: decompClusters.length,
      invalidInExtent: invalidInExtent.length,
      beyondExtent: beyondExtent.length,
    },
    refutedAsData,
    endOverExtensions,
    startCorrections,
    recoveredFunctions,
    parentOverMerges,
    decompClusters,
    invalidInExtent: invalidInExtent.map((f) => ({ start: hex(f.start_rom), endExclusive: hex(f.end_rom + 4) })),
    beyondExtent: beyondExtent.map((f) => ({ start: hex(f.start_rom), valid: f.valid })),
    caveats: [
      'Decomp parts are the unit of source layout, not always exactly one function: boot cluster files and folded preamble orphans legitimately contain multiple parent functions (decompClusters is informational, not a parent error list).',
      'recoveredFunctions includes frameless leaves and parent-undetected regions; names are conservative func_* unless evidence-named.',
      'refutedAsData uses a >=50% data-overlap threshold on byte-validated data parts (0 prologues / 0 jr $ra scans recorded in the chunk dossiers).',
      'Everything derives from the tracked manifest whose byte-exactness is enforced by verify_setup (manifestIntegrityAudit + assembled-code SHA).',
    ],
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const jsonPath = path.join(OUT_DIR, 'rev0-function-corrections.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 1));

  const md = [
    '# Rev 0 Function-DB Corrections (decomp -> parent)', '',
    `Executable extent ${hex(EXT_START)}..${hex(EXT_END)}; parent DB ${report.inputs.parentDb}`,
    `(${report.inputs.parentFunctionCount} functions, ${report.inputs.parentValidInExtent} valid in extent)`,
    `vs ${report.inputs.decompCodeParts} decomp code parts + ${report.inputs.decompDataParts} data parts.`, '',
    '| Category | Count |', '| --- | --- |',
    ...Object.entries(report.summary).map(([k, v]) => `| ${k} | ${v} |`), '',
    'See rev0-function-corrections.json for full detail; caveats inside.', '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'rev0-function-corrections.md'), md);

  console.log('Function-DB corrections export');
  for (const [k, v] of Object.entries(report.summary)) console.log(`  ${k}: ${v}`);
  console.log(`Report: ${jsonPath}`);
}

main();
