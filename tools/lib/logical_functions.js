'use strict';

// Research bodies are distinct from physical linker owners. This registry never
// grants an export or permission to prune a partial assembly owner.
const fs = require('fs');
const path = require('path');
const { ROOT, sha256Buffer, sha256File } = require('./phase7_conventional');
const CONFIG_PATH = path.join(ROOT, 'config', 'logical-functions.json');
const fail = message => { throw new Error(`logical function registry: ${message}`); };
// Only a ROM-authenticated registry may bind newly reviewed compiler entries.
const authenticatedRegistries = new WeakMap();
const EVIDENCE_STATUSES = new Set(['known-entry-or-ownership', 'independent-entry-supported',
  'supported-logical-continuation', 'accepted-primary-before-reviewed-secondary', 'supplemental-reviewed-body']);

function intersections(model, start, end) {
  let cursor = start;
  const result = [];
  for (const row of model.rows.filter(row => row.romStart < end && row.romEndExclusive > start)) {
    const a = Math.max(start, row.romStart), b = Math.min(end, row.romEndExclusive);
    const slice = row.slices.find(slice => slice.romStart <= a && slice.romEndExclusive >= b);
    if (a !== cursor || !row.part || !slice?.executable || slice.placementKind === 'rom-only') fail('unqualified or noncontiguous body placement');
    const fragment = { rowIndex: row.index, romStart: a, romEndExclusive: b,
      ownerOffset: a - row.romStart, bytes: b - a, vramStart: slice.vramStart + a - slice.romStart,
      sectionName: slice.sectionName, placementKind: slice.placementKind,
      overlayDescriptorId: slice.overlayDescriptorId, loadSlabId: slice.loadSlabId,
      file: row.part.file, sha256: row.part.sha256 };
    const previous = result[result.length - 1];
    if (previous && (previous.vramStart + previous.bytes !== fragment.vramStart
      || previous.placementKind !== fragment.placementKind
      || previous.overlayDescriptorId !== fragment.overlayDescriptorId
      || previous.loadSlabId !== fragment.loadSlabId)) fail('body crosses placement contexts');
    result.push(fragment); cursor = b;
  }
  if (cursor !== end || !result.length) fail('body coverage is incomplete');
  return result;
}

function loadRegistry(model, baserom, config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')), assemblySource = null) {
  if (config.schemaVersion !== 1 || config.profile !== model.config.profile || !Array.isArray(config.bodies)
    || !Array.isArray(config.padding) || !Array.isArray(config.preservedProductionEnvelopes)
    || !Array.isArray(config.unavailableBodies)) fail('schema or profile drift');
  const aliases = new Map();
  let previousEnd = 0;
  const bodies = config.bodies.map(body => {
    if (!Number.isInteger(body.romStart) || !Number.isInteger(body.romEndExclusive)
      || body.romStart < 0 || body.romEndExclusive > model.config.rom.bytes
      || body.romStart % 4 || body.romEndExclusive % 4 || body.romEndExclusive <= body.romStart
      || body.romStart < previousEnd || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(body.symbol)
      || !Array.isArray(body.aliases) || !EVIDENCE_STATUSES.has(body.evidence?.status)
      || !body.evidence.rationale || !/^[A-F0-9]{64}$/.test(body.expectedBytesSha256)) fail('malformed, reordered, or overlapping body');
    previousEnd = body.romEndExclusive;
    const fragments = intersections(model, body.romStart, body.romEndExclusive);
    if (JSON.stringify(fragments) !== JSON.stringify(body.fragments)) fail(`fragment or fallback drift: ${body.symbol}`);
    for (const fragment of fragments) {
      if (assemblySource) assemblySource(fragment.file, fragment.sha256);
      else if (sha256File(path.join(ROOT, fragment.file)) !== fragment.sha256) fail('fallback source drift');
    }
    if (baserom && sha256Buffer(baserom.subarray(body.romStart, body.romEndExclusive)) !== body.expectedBytesSha256) fail('canonical body hash drift');
    if (baserom && !baserom.subarray(body.romStart, body.romEndExclusive).some(byte => byte !== 0)) fail('padding cannot be a function');
    if (baserom && body.evidence.status === 'accepted-primary-before-reviewed-secondary'
      && baserom.readUInt32BE(body.romEndExclusive - 8) !== 0x03E00008) fail('primary body lacks its return and delay slot');
    const resolved = { ...body, fragments };
    for (const alias of [body.symbol, ...body.aliases]) {
      const key = String(alias).toLowerCase();
      if (!/^[a-z_][a-z0-9_]*$/.test(key) || aliases.has(key)) fail(`alias collision: ${alias}`);
      aliases.set(key, resolved);
    }
    return resolved;
  });
  const padding = config.padding;
  let paddingEnd = 0;
  for (const piece of padding) {
    if (!Number.isInteger(piece.romStart) || !Number.isInteger(piece.romEndExclusive) || piece.romStart < paddingEnd
      || piece.romStart < 0 || piece.romEndExclusive > model.config.rom.bytes
      || piece.romStart % 4 || piece.romEndExclusive % 4 || piece.romStart >= piece.romEndExclusive
      || bodies.some(body => body.romStart < piece.romEndExclusive && body.romEndExclusive > piece.romStart)
      || !piece.evidence || !/^[A-F0-9]{64}$/.test(piece.expectedBytesSha256)) fail('invalid padding coverage');
    if (baserom && (baserom.subarray(piece.romStart, piece.romEndExclusive).some(byte => byte !== 0)
      || sha256Buffer(baserom.subarray(piece.romStart, piece.romEndExclusive)) !== piece.expectedBytesSha256)) fail('padding hash drift');
    paddingEnd = piece.romEndExclusive;
    intersections(model, piece.romStart, piece.romEndExclusive);
  }
  const preservedSymbols = new Set();
  for (const entry of config.preservedProductionEnvelopes) {
    if (!entry || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(entry.symbol) || preservedSymbols.has(entry.symbol.toLowerCase())
      || !entry.evidence || !Array.isArray(entry.fragments) || !entry.fragments.length
      || !Array.isArray(entry.compilerTextFunctions) || !entry.compilerTextFunctions.length) fail('malformed preserved producer');
    preservedSymbols.add(entry.symbol.toLowerCase());
    let start = null, end = null, bytes = 0;
    for (const fragment of entry.fragments) {
      const row = model.rows.find(row => row.index === fragment.rowIndex);
      const expected = row?.part && { rowIndex: row.index, romStart: row.romStart,
        romEndExclusive: row.romEndExclusive, file: row.part.file, sha256: row.part.sha256 };
      if (!expected || JSON.stringify(fragment) !== JSON.stringify(expected)
        || end !== null && fragment.romStart !== end) fail('preserved producer fragment drift');
      start ??= fragment.romStart; end = fragment.romEndExclusive; bytes += row.bytes;
    }
    intersections(model, start, end);
    let cursor = 0;
    const names = new Set();
    for (const [index, fn] of entry.compilerTextFunctions.entries()) {
      if (!fn || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(fn.symbol) || names.has(fn.symbol.toLowerCase())
        || fn.offsetNumber !== cursor || Number(fn.offset) !== cursor || !Number.isInteger(fn.bytes)
        || fn.bytes <= 0 || fn.bytes % 4 || fn.binding !== (index === 0 ? 'GLOBAL' : 'LOCAL')
        || index === 0 && fn.symbol !== entry.symbol || !fn.entryEvidence) fail('preserved compiler census drift');
      names.add(fn.symbol.toLowerCase()); cursor += fn.bytes;
    }
    if (cursor !== bytes || !bodies.some(body => body.romStart < end && body.romEndExclusive > end)
      || bodies.some(body => body.romStart < start && body.romEndExclusive > start)) fail('preserved producer coverage drift');
  }
  let unavailableEnd = 0;
  for (const entry of config.unavailableBodies) {
    if (!Number.isInteger(entry.romStart) || !Number.isInteger(entry.romEndExclusive)
      || entry.romStart < unavailableEnd || entry.romEndExclusive > model.config.rom.bytes
      || entry.romStart % 4 || entry.romEndExclusive % 4 || entry.romEndExclusive <= entry.romStart
      || entry.reason !== 'runtime-placement-unqualified' || !EVIDENCE_STATUSES.has(entry.evidence?.status)
      || bodies.some(body => body.romStart < entry.romEndExclusive && body.romEndExclusive > entry.romStart)) fail('invalid unavailable body');
    let unqualified = false;
    try { intersections(model, entry.romStart, entry.romEndExclusive); } catch (_) { unqualified = true; }
    if (!unqualified) fail('unavailable body has qualified placement');
    unavailableEnd = entry.romEndExclusive;
  }
  const registry = { bodies, aliases, padding, unavailableBodies: config.unavailableBodies, preservedProductionEnvelopes: config.preservedProductionEnvelopes, identity: { path: 'config/logical-functions.json',
    bytes: fs.statSync(CONFIG_PATH).size, sha256: sha256File(CONFIG_PATH) } };
  if (Buffer.isBuffer(baserom) && baserom.length === model.config.rom.bytes
      && sha256Buffer(baserom) === model.config.rom.sha256) {
    authenticatedRegistries.set(registry, { bodies: JSON.stringify(bodies), padding: JSON.stringify(padding), unavailableBodies: JSON.stringify(registry.unavailableBodies),
      rows: new Map(model.rows.map(row => [row.index, JSON.stringify(row)])) });
  }
  return registry;
}

function coverage(registry, start, end, baserom) {
  const pieces = [];
  let cursor = start;
  for (const body of [...registry.bodies, ...registry.padding.map(piece => ({ ...piece, padding: true }))]
    .filter(body => body.romStart < end && body.romEndExclusive > start).sort((a, b) => a.romStart - b.romStart)) {
    if (body.romStart > cursor) pieces.push({ kind: 'unknown', romStart: cursor, romEndExclusive: body.romStart });
    pieces.push({ kind: body.padding ? 'padding' : body.romStart >= start && body.romEndExclusive <= end ? 'function' : 'continuation',
      symbol: body.symbol, romStart: Math.max(start, body.romStart), romEndExclusive: Math.min(end, body.romEndExclusive) });
    cursor = Math.min(end, body.romEndExclusive);
  }
  if (cursor < end) pieces.push({ kind: 'unknown', romStart: cursor, romEndExclusive: end });
  return pieces.map(piece => ({ ...piece, bytes: piece.romEndExclusive - piece.romStart,
    expectedBytesSha256: baserom ? sha256Buffer(baserom.subarray(piece.romStart, piece.romEndExclusive)) : null }));
}

// This evidence describes reviewed code, not proven callers or original linkage.
// Composed physical owners remain unsupported for this new category until their
// full function/zero-size continuation-symbol path has independent coverage.
function assertReviewedLocalBodies(registry, symbol, rows, functions) {
  if (!Array.isArray(functions) || !functions.some(fn => fn?.entryEvidence === 'reviewed-local-body')) return;
  const authenticated = authenticatedRegistries.get(registry);
  if (!authenticated || authenticated.bodies !== JSON.stringify(registry.bodies)) fail('reviewed local body requires unchanged ROM-authenticated registry');
  if (!Array.isArray(rows) || rows.length !== 1) fail('reviewed local body composition across physical owners is unsupported');
  const row = rows[0];
  if (authenticated.rows.get(row.index) !== JSON.stringify(row)) fail('reviewed local body selected owner drift');
  const bodies = registry.bodies.filter(body => body.romStart < row.romEndExclusive && body.romEndExclusive > row.romStart);
  if (functions.length !== bodies.length || functions.length < 2) fail('reviewed local body census differs from registry');
  let cursor = row.romStart;
  for (const [index, fn] of functions.entries()) {
    const body = bodies[index];
    if (!fn || !Number.isInteger(fn.bytes) || fn.bytes <= 0 || fn.bytes % 4
        || fn.offsetNumber !== cursor - row.romStart
        || fn.offset !== '0x' + fn.offsetNumber.toString(16).toUpperCase().padStart(8, '0')
        || body.romStart !== cursor || body.romEndExclusive !== cursor + fn.bytes
        || (index === 0 ? fn.symbol !== symbol || fn.binding !== 'GLOBAL' || fn.entryEvidence !== 'owner'
          : fn.symbol !== body.symbol || fn.binding !== 'LOCAL'
            || !['reviewed-local-body', 'internal-call-only', 'fixed-address-call'].includes(fn.entryEvidence))
        || fn.entryEvidence === 'reviewed-local-body' && !['supplemental-reviewed-body', 'independent-entry-supported'].includes(body.evidence.status)) {
      fail('reviewed local body entry does not exactly match registry');
    }
    const fragments = intersections({ rows }, body.romStart, body.romEndExclusive);
    if (JSON.stringify(fragments) !== JSON.stringify(body.fragments)
        || fragments.some(fragment => fragment.vramStart !== row.slices[0].vramStart + fragment.romStart - row.romStart)) {
      fail('reviewed local body fragment or runtime placement drift');
    }
    cursor = body.romEndExclusive;
  }
  if (cursor !== row.romEndExclusive) fail('reviewed local body census omits owner coverage');
}

function assertActivationCompatible(registry, symbol, rows, compilerTextFunctions = null, assemblySource = null) {
  assertReviewedLocalBodies(registry, symbol, rows, compilerTextFunctions);
  const start = rows[0].romStart, end = rows[rows.length - 1].romEndExclusive;
  if (registry.bodies.some(body => body.romStart < start && body.romEndExclusive > start)) fail(`producer starts inside a logical body: ${symbol}`);
  if (registry.bodies.some(body => body.romStart < end && body.romEndExclusive > end)) {
    const preserved = registry.preservedProductionEnvelopes.find(entry => entry.symbol === symbol);
    const fragments = rows.map(row => ({ rowIndex: row.index, romStart: row.romStart,
      romEndExclusive: row.romEndExclusive, file: row.part.file, sha256: row.part.sha256 }));
    if (!preserved || JSON.stringify(preserved.fragments) !== JSON.stringify(fragments)
      || JSON.stringify(preserved.compilerTextFunctions) !== JSON.stringify(compilerTextFunctions)) fail(`producer ends inside a logical body without a preserved contract: ${symbol}`);
  }
  const body = registry.aliases.get(symbol.toLowerCase());
  // An interior/continuation alias cannot silently become its enclosing owner.
  // Existing whole-owner names continue to denote their complete producers.
  if (body && (body.romStart !== start || body.romEndExclusive > end)) fail(`partial logical-body activation: ${symbol}`);
  // The old fallback accepts arbitrary assembly labels. If a label actually
  // occurs after emitted bytes it is an interior selection, not an owner alias.
  const source = assemblySource ? assemblySource(rows[0].part.file, rows[0].part.sha256)
    : fs.readFileSync(path.join(ROOT, rows[0].part.file), 'utf8');
  let emitted = 0;
  let entryDefinition = false;
  for (const line of source.split(/\r?\n/)) {
    const definition = /^\s*([A-Za-z_.$][A-Za-z0-9_.$]*):/.exec(line);
    if (definition && definition[1].toLowerCase() === symbol.toLowerCase()) {
      if (emitted !== 0) fail(`interior assembly-label activation: ${symbol}`);
      entryDefinition = true;
    }
    const words = /\.word\s+([^#\n]+)/.exec(line);
    if (words) emitted += words[1].split(',').length * 4;
  }
  const structuralNames = [rows[0].part.name.toLowerCase(), `func_${start.toString(16).padStart(8,'0')}`];
  if (!entryDefinition && !structuralNames.includes(symbol.toLowerCase())) fail(`assembly alias has no owner-entry definition: ${symbol}`);
}


// New group mode only: GLOBAL compiler entries are independent reviewed bodies,
// not the LOCAL-only reconstructed-body contract. No caller/visibility inference.
function assertNativeGroupBodies(registry, rows, group) {
  const accepted = authenticatedRegistries.get(registry);
  if (!accepted || accepted.bodies !== JSON.stringify(registry.bodies)
      || accepted.padding !== JSON.stringify(registry.padding)
      || accepted.unavailableBodies !== JSON.stringify(registry.unavailableBodies)) fail('native group needs unchanged authenticated logical registry');
  const result = [];
  for (const [index, row] of rows.entries()) {
    if (accepted.rows.get(row.index) !== JSON.stringify(row)) fail('native group owner identity drift');
    const member = group.members[index], functions = member.functionSymbols.map(name => group.functions.find(fn => fn.symbol === name));
    const start = row.romStart, ownerOffset = start - rows[0].romStart;
    const tailBytes = index === rows.length - 1 ? group.tail.bytes : 0;
    let cursor = start;
    const bodies = registry.bodies.filter(body => body.romStart < row.romEndExclusive && body.romEndExclusive > start);
    // Any registered cut takes precedence over the physical-owner fallback, even
    // when a candidate claims only one function for that owner.
    const reviewed = bodies.length > 0 || functions.length > 1;
    if (reviewed && bodies.length !== functions.length) fail('native group complete logical body census');
    for (const [i, fn] of functions.entries()) {
      if (!fn || fn.offset !== cursor - rows[0].romStart || fn.binding !== 1 || fn.symbolType !== 2 || fn.visibility
          || fn.bytes <= 0 || cursor + fn.bytes > row.romEndExclusive - tailBytes) fail('native group function placement');
      if (reviewed) {
        const body = bodies[i];
        if (!body || body.romStart !== cursor || body.romEndExclusive !== cursor + fn.bytes
            || fn.symbol !== body.symbol || i > 0 && body.evidence.status !== 'independent-entry-supported'
            || JSON.stringify(intersections({ rows: [row] }, cursor, cursor + fn.bytes)) !== JSON.stringify(body.fragments)) fail('native GLOBAL body differs from reviewed registry');
      } else if (fn.symbol !== member.symbol || fn.offset !== ownerOffset
          || fn.bytes + tailBytes !== row.bytes) fail('native group ordinary owner body drift');
      cursor += fn.bytes;
    }
    if (cursor !== row.romEndExclusive - tailBytes) fail('native group unclassified function gap');
    const padding = registry.padding.filter(p => p.romStart < row.romEndExclusive && p.romEndExclusive > start);
    if (padding.length !== (tailBytes ? 1 : 0) || tailBytes && (padding[0].romStart !== cursor
        || padding[0].romEndExclusive !== row.romEndExclusive || padding[0].expectedBytesSha256 !== group.tail.sha256)) fail('native group logical terminal padding coverage');
    if (registry.unavailableBodies.some(body => body.romStart < row.romEndExclusive && body.romEndExclusive > start)) fail('native group unresolved body');
    result.push({ rowIndex: row.index, romStart: start, romEndExclusive: row.romEndExclusive,
      source: row.part.file, sourceSha256: row.part.sha256, functions: functions.map(fn => ({ ...fn })),
      bodies, padding });
  }
  return { registryIdentity: { ...registry.identity }, members: result };
}

// Atomic storage is permitted only for one independently registered original
// body. Compiler output and preserved physical-envelope records cannot grant it.
function assertAtomicOwnerBody(registry, symbol, rows) {
  const accepted = authenticatedRegistries.get(registry);
  if (!accepted || accepted.bodies !== JSON.stringify(registry.bodies)
      || accepted.padding !== JSON.stringify(registry.padding)
      || accepted.unavailableBodies !== JSON.stringify(registry.unavailableBodies)
      || !Array.isArray(rows) || rows.length < 2) fail('atomic owner needs unchanged ROM-authenticated registry');
  for (const row of rows) if (accepted.rows.get(row.index) !== JSON.stringify(row)) fail('atomic original owner identity drift');
  const start = rows[0].romStart, end = rows.at(-1).romEndExclusive;
  const bodies = registry.bodies.filter(body => body.romStart < end && body.romEndExclusive > start);
  const body = bodies[0];
  if (bodies.length !== 1 || body.symbol !== symbol || body.romStart !== start || body.romEndExclusive !== end
      || !['known-entry-or-ownership', 'independent-entry-supported', 'supported-logical-continuation'].includes(body.evidence.status)
      || registry.padding.some(piece => piece.romStart < end && piece.romEndExclusive > start)
      || registry.unavailableBodies.some(piece => piece.romStart < end && piece.romEndExclusive > start)
      || JSON.stringify(body.fragments) !== JSON.stringify(intersections({ rows }, start, end))
      || body.fragments.length !== rows.length || body.fragments.some((fragment, index) => fragment.ownerOffset !== 0 || fragment.bytes !== rows[index].bytes))
    fail('atomic union is not one complete accepted original body');
  return { registryIdentity: { ...registry.identity }, body: JSON.parse(JSON.stringify(body)) };
}

module.exports = { assertAtomicOwnerBody, assertNativeGroupBodies, CONFIG_PATH, intersections, loadRegistry, coverage, assertReviewedLocalBodies, assertActivationCompatible };
