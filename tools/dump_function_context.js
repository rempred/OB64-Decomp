#!/usr/bin/env node
// Rev 0 function-context dump.
//
// Joins parent function boundaries (scripts/ob64_functions.json), the
// overlay-aware symbol/callgraph DB (scripts/ob64_symbols_v2.json), and the
// global xref map (scripts/ob64_xrefs.json) into one per-function context report
// for a ROM range, so a reviewer can validate boundaries and propose conservative
// names without re-deriving caller/callee/global context by hand.
//
// Read-only: writes only gitignored reports under build/context. Parent JSON is
// evidence, not truth; treat names/edges as leads to confirm against the
// disassembly in asm/original/rev0/.
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  hex,
  parseHexOrNumber,
  readJson,
} = require('./lib/rom');

function usage() {
  console.log(`Usage: node tools/dump_function_context.js --start <hex> --end <hex> [--functions <json>] [--symbols <json>] [--xrefs <json>] [--json <path>] [--md <path>] [--allow-missing-parent-db]

Emits a per-function context report (boundaries + callgraph + accessed globals +
constants + active states + hazards) for the ROM range [start,end). Read-only.`);
}

function parseArgs(argv) {
  const args = {
    start: null,
    end: null,
    functions: path.resolve(ROOT, '..', 'scripts', 'ob64_functions.json'),
    symbols: path.resolve(ROOT, '..', 'scripts', 'ob64_symbols_v2.json'),
    xrefs: path.resolve(ROOT, '..', 'scripts', 'ob64_xrefs.json'),
    json: null,
    md: null,
    allowMissingParentDb: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') { usage(); process.exit(0); }
    else if (arg === '--start') args.start = parseHexOrNumber(argv[++i]);
    else if (arg === '--end') args.end = parseHexOrNumber(argv[++i]);
    else if (arg === '--functions') args.functions = path.resolve(argv[++i]);
    else if (arg === '--symbols') args.symbols = path.resolve(argv[++i]);
    else if (arg === '--xrefs') args.xrefs = path.resolve(argv[++i]);
    else if (arg === '--json') args.json = path.resolve(argv[++i]);
    else if (arg === '--md') args.md = path.resolve(argv[++i]);
    else if (arg === '--allow-missing-parent-db') args.allowMissingParentDb = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (args.start == null || args.end == null) throw new Error('--start and --end are required');
  if (args.end <= args.start) throw new Error('--end must be greater than --start');
  const tag = `${hex(args.start).slice(2)}-${hex(args.end).slice(2)}`;
  if (!args.json) args.json = path.join(ROOT, 'build', 'context', `rev0-function-context-${tag}.json`);
  if (!args.md) args.md = path.join(ROOT, 'build', 'context', `rev0-function-context-${tag}.md`);
  return args;
}

function rel(p) { return path.relative(ROOT, p).replace(/\\/g, '/'); }

function loadParentJson(filePath, { allowMissing }) {
  if (!fs.existsSync(filePath)) {
    if (allowMissing) return null;
    throw new Error(`Required parent JSON not found: ${filePath}\nRe-run with --allow-missing-parent-db to proceed without it.`);
  }
  try { return readJson(filePath); } catch (err) {
    throw new Error(`Parent JSON is corrupt (not valid JSON): ${filePath}: ${err.message}`);
  }
}

function romKey(n) { return `0x${(n >>> 0).toString(16).padStart(8, '0')}`; }

// Normalize an accessed-global entry to a readable RAM hex string.
function ramHex(x) {
  if (typeof x === 'number') return hex(x);
  if (typeof x === 'string') {
    const n = parseHexOrNumber(x);
    return Number.isFinite(n) ? hex(n) : x;
  }
  if (x && typeof x === 'object') {
    const v = x.addr ?? x.ram ?? x.target;
    if (v != null) return ramHex(v);
  }
  return JSON.stringify(x);
}

// Resolve a rom-hex string to a short label: parent name if known, else func_<addr>.
function labelFor(romHexStr, symFns) {
  const n = parseHexOrNumber(romHexStr);
  const s = symFns ? symFns[romKey(n)] : null;
  const name = s && s.name ? s.name : null;
  return name ? `${hex(n)} ${name}` : hex(n);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const functionsDb = loadParentJson(args.functions, { allowMissing: args.allowMissingParentDb });
  const symbolsDb = loadParentJson(args.symbols, { allowMissing: args.allowMissingParentDb });
  const xrefsDb = loadParentJson(args.xrefs, { allowMissing: args.allowMissingParentDb });

  const fnArr = (functionsDb && functionsDb.functions) || [];
  const symFns = (symbolsDb && symbolsDb.functions) || null;

  // Parent `end_rom` is the address of the LAST instruction word (INCLUSIVE), so
  // the exclusive end is end_rom + 4 (size == end_rom + 4 - start_rom). Using
  // end_rom directly produced phantom 4-byte "gaps" (the return delay slot).
  const endExclusive = (f) => f.end_rom + 4;
  // Regression guard: fail loudly if this semantics assumption ever breaks, so
  // the off-by-4 cannot silently return.
  for (const f of fnArr) {
    if (f.valid === false) continue;
    if (typeof f.size === 'number' && typeof f.start_rom === 'number' && typeof f.end_rom === 'number') {
      if (endExclusive(f) - f.start_rom !== f.size) {
        throw new Error(
          `Parent end_rom semantics check failed at ${hex(f.start_rom)}: end_rom+4-start_rom=${endExclusive(f) - f.start_rom} != size ${f.size}. ` +
          'The function DB may have changed end_rom semantics; review dump_function_context.js.',
        );
      }
    }
  }

  const inRange = fnArr
    .filter((f) => f.valid !== false && typeof f.start_rom === 'number' && f.start_rom >= args.start && f.start_rom < args.end)
    .sort((a, b) => a.start_rom - b.start_rom);

  const startSet = new Set(inRange.map((f) => f.start_rom));

  // Boundary anomalies between consecutive functions, using the EXCLUSIVE end.
  // A real gap (gap bytes > 0) is usually a preamble-orphan (read-before-write
  // load words that belong to the next function) or alignment padding, not a
  // delay-slot artifact.
  const boundaryNotes = [];
  for (let i = 0; i < inRange.length - 1; i += 1) {
    const cur = inRange[i];
    const next = inRange[i + 1];
    const curEnd = endExclusive(cur);
    if (curEnd < next.start_rom) {
      boundaryNotes.push({ kind: 'gap', after: hex(cur.start_rom), from: hex(curEnd), to: hex(next.start_rom), bytes: next.start_rom - curEnd, note: 'likely preamble-orphan or alignment; check whether the gap words load globals consumed read-before-write by the next function' });
    } else if (curEnd > next.start_rom) {
      boundaryNotes.push({ kind: 'overlap', a: hex(cur.start_rom), b: hex(next.start_rom), aEnd: hex(curEnd), note: 'dual/secondary entry' });
    }
  }

  const records = inRange.map((f) => {
    const sym = symFns ? symFns[romKey(f.start_rom)] : null;
    const callees = (sym && (sym.callees_v2 || sym.callees)) || [];
    const callers = (sym && (sym.callers_v2 || sym.callers)) || [];
    const calleeList = callees.map((c) => {
      const t = c.target_rom || c.target;
      const tn = t != null ? parseHexOrNumber(t) : null;
      return {
        target: tn != null ? hex(tn) : String(t),
        label: tn != null ? labelFor(t, symFns) : String(t),
        count: c.count ?? null,
        confidence: c.confidence ?? null,
        kind: c.kind ?? null,
        overlayCandidates: c.overlay_candidates ?? null,
        inRange: tn != null && tn >= args.start && tn < args.end,
      };
    });
    const callerList = callers.map((c) => {
      const t = c.caller || c.caller_rom || c.source;
      const tn = t != null ? parseHexOrNumber(t) : null;
      return {
        caller: tn != null ? hex(tn) : String(t),
        count: c.count ?? null,
        inRange: tn != null && tn >= args.start && tn < args.end,
      };
    });
    return {
      rom: hex(f.start_rom),
      romEndExclusive: hex(endExclusive(f)),
      ram: sym && sym.ram ? sym.ram : hex(f.start_ram),
      bytes: endExclusive(f) - f.start_rom,
      kind: f.kind,
      frameSize: f.frame_size,
      name: (sym && sym.name) || null,
      nameConfidence: (sym && sym.confidence) || null,
      flags: {
        hasJrRa: Boolean(f.has_jr_ra),
        isJalTarget: Boolean(f.is_jal_target),
        hasJalr: Boolean(f.has_jalr),
        hasIndirectJump: Boolean(f.has_indirect_j),
      },
      secondaryEntries: (sym && sym.secondary_entries ? sym.secondary_entries : (f.secondary_entries || []))
        .map((e) => ({ rom: hex(typeof e === 'number' ? e : e.rom), offsetFromStart: e.offset_from_start ?? null })),
      calleeCount: calleeList.length,
      callerCount: callerList.length,
      calleesInRange: calleeList.filter((c) => c.inRange).map((c) => c.target),
      callees: calleeList,
      callers: callerList,
      indirectCalls: (sym && sym.indirect_calls) || [],
      jumps: (sym && sym.jumps) || [],
      topConstants: (sym && sym.top_constants) || [],
      accessed: ((sym && sym.accessed) || []).map(ramHex),
      activeStates: (sym && sym.active_states) || null,
      runtimeRamPrimary: (sym && sym.runtime_ram_primary) || null,
    };
  });

  // In-range mini-callgraph degrees.
  const outDeg = new Map();
  const inDeg = new Map();
  for (const r of records) {
    outDeg.set(r.rom, r.calleesInRange.length);
    for (const c of r.calleesInRange) inDeg.set(c, (inDeg.get(c) || 0) + 1);
  }
  for (const r of records) {
    r.inRangeOutDegree = outDeg.get(r.rom) || 0;
    r.inRangeInDegree = inDeg.get(r.rom) || 0;
    r.roleHints = [];
    if (r.flags.hasIndirectJump) r.roleHints.push('indirect-jump (jump-table hazard)');
    if (r.flags.hasJalr) r.roleHints.push('indirect-call (callback/dispatch)');
    if (r.secondaryEntries.length) r.roleHints.push(`dual-entry (${r.secondaryEntries.length} secondary)`);
    if (r.calleeCount === 0) r.roleHints.push('leaf (no callees)');
    if (r.inRangeInDegree >= 3) r.roleHints.push(`high-fanin (${r.inRangeInDegree} in-range callers)`);
  }

  const hazards = records
    .filter((r) => r.flags.hasIndirectJump || r.flags.hasJalr || r.secondaryEntries.length)
    .map((r) => ({ rom: r.rom, hazards: r.roleHints.filter((h) => /hazard|indirect|dual/.test(h)) }));

  const report = {
    tool: 'dump_function_context',
    range: { start: hex(args.start), endExclusive: hex(args.end), bytes: args.end - args.start },
    inputs: {
      functions: functionsDb ? rel(args.functions) : null,
      symbols: symbolsDb ? rel(args.symbols) : null,
      xrefs: xrefsDb ? rel(args.xrefs) : null,
    },
    functionCount: records.length,
    namedCount: records.filter((r) => r.name).length,
    boundaryNotes,
    hazards,
    functions: records,
  };

  ensureDir(path.dirname(args.json));
  fs.writeFileSync(args.json, `${JSON.stringify(report, null, 2)}\n`);

  // Compact markdown.
  const L = [];
  L.push(`# Rev 0 Function Context: ${report.range.start}..${report.range.endExclusive}`);
  L.push('');
  L.push(`Functions: ${report.functionCount} (named in parent DB: ${report.namedCount}). Read-only join of parent boundaries + symbols_v2 + xrefs.`);
  L.push('');
  if (boundaryNotes.length) {
    L.push('## Boundary notes');
    L.push('');
    for (const b of boundaryNotes) {
      if (b.kind === 'gap') L.push(`- gap ${b.from}..${b.to} (${b.bytes} B) after function ${b.after}`);
      else L.push(`- overlap: ${b.a} and ${b.b} (first ends ${b.aEnd}) — dual entry / secondary`);
    }
    L.push('');
  }
  L.push('## Functions');
  L.push('');
  for (const r of records) {
    L.push(`### ${r.rom}..${r.romEndExclusive}  (${r.bytes} B, ${r.kind}, frame ${r.frameSize})`);
    L.push(`- name: ${r.name ? `\`${r.name}\`` : '(none — propose func_' + r.rom.slice(2).toLowerCase() + ' + role note)'}`);
    L.push(`- flags: jr_ra=${r.flags.hasJrRa ? 1 : 0} jal_target=${r.flags.isJalTarget ? 1 : 0} jalr=${r.flags.hasJalr ? 1 : 0} indirect_j=${r.flags.hasIndirectJump ? 1 : 0}; in-range out/in degree ${r.inRangeOutDegree}/${r.inRangeInDegree}`);
    if (r.roleHints.length) L.push(`- role hints: ${r.roleHints.join('; ')}`);
    if (r.secondaryEntries.length) L.push(`- secondary entries: ${r.secondaryEntries.map((e) => e.rom).join(', ')}`);
    if (r.callees.length) L.push(`- callees (${r.calleeCount}): ${r.callees.slice(0, 14).map((c) => c.label + (c.confidence ? `[${c.confidence}]` : '')).join(', ')}`);
    if (r.callers.length) L.push(`- callers (${r.callerCount}): ${r.callers.slice(0, 14).map((c) => c.caller).join(', ')}`);
    if (r.accessed && r.accessed.length) L.push(`- accessed globals: ${(Array.isArray(r.accessed) ? r.accessed.slice(0, 16).map((a) => (typeof a === 'string' ? a : (a.addr || a.ram || JSON.stringify(a)))) : []).join(', ')}`);
    if (r.topConstants && r.topConstants.length) L.push(`- top constants: ${(Array.isArray(r.topConstants) ? r.topConstants.slice(0, 10).map((c) => (typeof c === 'object' ? (c.value ?? JSON.stringify(c)) : c)) : []).join(', ')}`);
    if (r.activeStates) L.push(`- active states: ${Array.isArray(r.activeStates) ? r.activeStates.join(', ') : r.activeStates}`);
    L.push('');
  }
  ensureDir(path.dirname(args.md));
  fs.writeFileSync(args.md, `${L.join('\n')}\n`);

  console.log(`Function context: ${records.length} function(s) in ${report.range.start}..${report.range.endExclusive}`);
  console.log(`Named in parent DB: ${report.namedCount}; hazards: ${hazards.length}; boundary notes: ${boundaryNotes.length}`);
  console.log(`Wrote JSON: ${args.json}`);
  console.log(`Wrote Markdown: ${args.md}`);
}

main();
