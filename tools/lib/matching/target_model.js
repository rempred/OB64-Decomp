'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { loadActiveTargetModel } = require('../active_targets');
const logical = require('../logical_functions');
// Keep scratch admission in this sealed comparison-algorithm input.
const GROUP_REASON = 'group workbench requires a complete group candidate; use canonical diff with the group source';
const LIVE_TARGET_FIELDS = ['activeMatchingSource', 'activeMatchingProducer', 'scratchCompilation', 'requestedSymbol'];

function isActiveTarget(target) {
  return Boolean(target.activeMatchingProducer || target.activeMatchingSource);
}

function scratchCapability(workbench, target, sessionTargets = []) {
  // Stored target records deliberately omit live producer state.
  const key = String(target.symbol || '').toLowerCase();
  const active = workbench?.activeTargetsBySymbol?.get(key);
  const live = workbench?.bySymbol?.get(key);
  const sessionTarget = sessionTargets.find(value => value.symbol.toLowerCase() === key);
  const overlapping = target.selectionKind === 'logical-body'
    ? [...(workbench?.activeTargetsBySymbol?.values() || [])].filter(value => value.romStartNumber < target.romEndExclusive && value.romEndNumber > target.romStart) : [];
  if ([target, live, active, sessionTarget, ...overlapping].some(value => value?.compilationGroup
      || value?.activeMatchingProducer?.kind === 'compilation-group')) {
    return { supported: false, code: 'complete-group-candidate-required', reason: GROUP_REASON };
  }
  if (target.placementKind === 'rom-only') return {
    supported: false, code: 'unqualified-runtime-placement', reason: 'scratch generation requires qualified runtime placement',
  };
  let completeCoverage = true;
  if (target.logicalFunctions) {
    let cursor = target.romStart;
    const pieces = target.logicalCoverage || [];
    const functionPieces = pieces.filter(piece => piece.kind === 'function');
    completeCoverage = pieces.length > 0 && pieces.every(piece => {
      const valid = ['function','padding'].includes(piece.kind) && piece.romStart === cursor && piece.romEndExclusive > cursor;
      cursor = piece.romEndExclusive; return valid;
    }) && cursor === target.romEndExclusive && target.logicalFunctions.length === functionPieces.length
      && target.logicalFunctions.every((fn, index) => fn.romStart === functionPieces[index].romStart
        && fn.romEndExclusive === functionPieces[index].romEndExclusive && fn.offset === fn.romStart - target.romStart
        && fn.bytes === fn.romEndExclusive - fn.romStart);
  }
  if (target.logicalFunctions && (!target.logicalCoverageComplete || !completeCoverage)) return {
    supported: false, code: 'incomplete-logical-coverage', reason: 'complete candidate requires resolved logical coverage; inspect proven bodies individually',
  };
  if (target.selectionKind === 'logical-body' && active) return {
    supported: false, code: 'physical-producer-required', reason: 'active target requires its complete physical producer contract',
  };
  return { supported: true, code: null, reason: null };
}

function assertScratchCapability(workbench, target, sessionTargets) {
  const capability = scratchCapability(workbench, target, sessionTargets);
  if (!capability.supported) throw new Error(capability.reason);
  if (target.logicalFunctions && (!target.expectedBytes || sha256Buffer(target.expectedBytes) !== target.expectedBytesSha256)) throw new Error('logical target expected bytes drift');
}

function producerView(active) {
  if (!active) return null;
  if (!active.compilationGroup) return { kind: 'standalone', source: active.source };
  return {
    kind: 'compilation-group', id: active.compilationGroup.id, source: active.source,
    memberIndex: active.groupMemberIndex,
    members: active.compilationGroup.members.map(member => ({ ...member })),
  };
}
const {
  CONFIG_PATH: PHASE7_CONFIG_PATH,
  ROOT,
  sha256Buffer,
  sha256File,
} = require('../phase7_conventional');

const CONFIG_PATH = path.join(ROOT, 'config', 'matching-workbench.json');
const SEMANTIC_PATH = path.join(ROOT, 'config', 'splat', 'us_rev0.semantic.json');
const ACTIVE_PATH = path.join(ROOT, 'config', 'matching-c-targets.json');
const BASEROM_PATH = path.join(ROOT, 'build', 'baserom.us_rev0.z64');

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : canonicalJson(value)).digest('hex').toUpperCase();
}

function hex(value) {
  return `0x${(value >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadBaserom(model) {
  if (!fs.existsSync(BASEROM_PATH)) throw new Error('canonical normalized baserom is missing; run node tools/verify_baserom.js');
  const bytes = fs.readFileSync(BASEROM_PATH);
  if (bytes.length !== model.config.rom.bytes || sha256Buffer(bytes) !== model.config.rom.sha256) {
    throw new Error('canonical normalized baserom identity drift');
  }
  return bytes;
}

function functionPartStem(name) {
  const match = /^(func_[0-9a-f]{8})(?:_chunk[0-9]+head)?$/i.exec(String(name || ''));
  return match ? match[1].toLowerCase() : null;
}

function continuationPartStem(name) {
  const match = /^(func_[0-9a-f]{8})_chunk[0-9]+tail$/i.exec(String(name || ''));
  return match ? match[1].toLowerCase() : null;
}

function compositeFunctionRows(model) {
  const eligible = (row) => row.primaryClass === 'code'
    && row.part
    && row.slices.length === 1
    && row.slices[0].executable;
  const continuations = new Map();
  const consumedRows = new Set();
  for (let rowIndex = 0; rowIndex < model.rows.length; rowIndex += 1) {
    const tail = model.rows[rowIndex];
    const stem = continuationPartStem(tail.part?.name);
    if (!stem) continue;
    const head = model.rows[rowIndex - 1];
    if (!head || !eligible(head) || !eligible(tail)
        || functionPartStem(head.part.name) !== stem
        || head.romEndExclusive !== tail.romStart
        || head.slices[0].vramEndExclusive !== tail.slices[0].vramStart
        || head.slices[0].placementKind !== tail.slices[0].placementKind
        || head.slices[0].overlayDescriptorId !== tail.slices[0].overlayDescriptorId
        || head.slices[0].loadSlabId !== tail.slices[0].loadSlabId
        || tail.part.symbolByteOffset !== 0) {
      throw new Error(`accepted continuation part does not compose with its preceding function head: ${tail.part.name}`);
    }
    if (continuations.has(head.index) || consumedRows.has(head.index) || consumedRows.has(tail.index)) {
      throw new Error(`accepted continuation part is duplicated or overlaps: ${tail.part.name}`);
    }
    continuations.set(head.index, tail);
    consumedRows.add(tail.index);
  }
  return { continuations, consumedRows };
}

function loadWorkbenchModel(options = {}) {
  const config = readJson(CONFIG_PATH);
  if (config.schemaVersion !== 1 || config.databaseSchemaVersion !== 2) throw new Error('matching workbench configuration schema drift');
  const activeModel = loadActiveTargetModel();
  const model = activeModel.model;
  const baserom = options.requireBaserom === false ? null : loadBaserom(model);
  const logicalRegistry = logical.loadRegistry(model, baserom);
  const activeBySymbol = new Map(activeModel.targets.map(target => [target.symbol.toLowerCase(), target]));
  const modelManifest = {
    schemaVersion: 1,
    targetModelContract: 5,
    logicalFunctionRegistry: logicalRegistry.identity,
    logicalFunctionSemantics: [__filename, require.resolve('../logical_functions')].map(file => ({
      path: path.relative(ROOT, file).replace(/\\/g, '/'), sha256: sha256File(file),
    })),
    profile: config.profile,
    baserom: { bytes: model.config.rom.bytes, sha256: model.config.rom.sha256 },
    conventionalBuild: {
      path: 'config/phase7/conventional-build.json',
      sha256: sha256File(PHASE7_CONFIG_PATH),
    },
    semantic: { path: 'config/splat/us_rev0.semantic.json', sha256: sha256File(SEMANTIC_PATH) },
    acceptedInputs: model.inputFiles,
  };
  const modelId = digest(modelManifest);
  const compositeRows = compositeFunctionRows(model);
  let targets = model.rows
    .filter((row) => row.primaryClass === 'code' && row.part && row.slices.length === 1 && row.slices[0].executable)
    .filter((row) => !compositeRows.consumedRows.has(row.index))
    .map((row) => {
      const slice = row.slices[0];
      const continuation = compositeRows.continuations.get(row.index) || null;
      const continuationSlice = continuation ? continuation.slices[0] : null;
      const symbol = continuation
        ? `func_${continuationPartStem(continuation.part.name).slice(5).toUpperCase()}`
        : row.part.name;
      const romStart = continuation ? row.romStart + row.part.symbolByteOffset : row.romStart;
      const romEndExclusive = continuation ? continuation.romEndExclusive : row.romEndExclusive;
      const bytes = romEndExclusive - romStart;
      const expected = baserom ? Buffer.from(baserom.subarray(romStart, romEndExclusive)) : null;
      const metadata = {
        schemaVersion: 1,
        symbol,
        primaryId: row.primaryId,
        rowIndex: row.index,
        romStart,
        romEndExclusive,
        bytes,
        vramStart: continuation ? slice.vramStart + row.part.symbolByteOffset : slice.vramStart,
        vramEndExclusive: continuationSlice ? continuationSlice.vramEndExclusive : slice.vramEndExclusive,
        entryVram: slice.vramStart + row.part.symbolByteOffset,
        symbolByteOffset: continuation ? 0 : row.part.symbolByteOffset,
        sectionName: slice.sectionName,
        placementKind: slice.placementKind,
        overlayDescriptorId: slice.overlayDescriptorId,
        loadSlabId: slice.loadSlabId,
        originalAssembly: row.part.file,
        originalAssemblySha256: row.part.sha256,
        ...(continuation ? {
          continuationRows: [continuation.index],
          ownerSymbolByteOffset: row.part.symbolByteOffset,
          originalAssemblyParts: [row, continuation].map((partRow) => ({
            rowIndex: partRow.index,
            symbol: partRow.part.name,
            file: partRow.part.file,
            sha256: partRow.part.sha256,
            romStart: partRow.romStart,
            romEndExclusive: partRow.romEndExclusive,
          })),
          sectionNames: [slice.sectionName, continuationSlice.sectionName],
        } : {}),
      };
      const targetId = digest({ modelId, metadata, expectedBytesSha256: expected ? sha256Buffer(expected) : null });
      return {
        ...metadata,
        activeMatchingSource: activeBySymbol.get(symbol.toLowerCase())?.source || null,
        activeMatchingProducer: producerView(activeBySymbol.get(symbol.toLowerCase())),
        scratchCompilation: scratchCapability({ activeTargetsBySymbol: activeBySymbol }, { symbol }),
        targetId,
        modelId,
        expectedBytes: expected,
        expectedBytesSha256: expected ? sha256Buffer(expected) : null,
        row,
      };
    });
  // Preserve owner/history names. Complete logical bodies crossing physical
  // cuts are explicitly scratch selections, never new linker owners.
  const corrections = logicalRegistry.bodies.filter(body => body.aliases.length);
  const consumed = new Set();
  for (const body of corrections) {
    const selected = targets.find(target => target.romStart === body.romStart)
      || targets.find(target => body.aliases.some(alias => alias.toLowerCase() === target.symbol.toLowerCase()));
    if (!selected) throw new Error(`logical correction has no historical target: ${body.symbol}`);
    for (const other of targets) if (other !== selected && other.romStart >= body.romStart && other.romStart < body.romEndExclusive) consumed.add(other);
    const first = body.fragments[0], last = body.fragments[body.fragments.length - 1];
    Object.assign(selected, { selectionKind: 'logical-body', romStart: body.romStart,
      romEndExclusive: body.romEndExclusive, bytes: body.romEndExclusive - body.romStart,
      vramStart: first.vramStart, vramEndExclusive: last.vramStart + last.bytes,
      entryVram: first.vramStart, symbolByteOffset: 0, logicalAliases: [body.symbol, ...body.aliases],
      logicalFragments: body.fragments,
      expectedBytes: baserom ? Buffer.from(baserom.subarray(body.romStart, body.romEndExclusive)) : null,
      expectedBytesSha256: baserom ? body.expectedBytesSha256 : null });
  }
  targets = targets.filter(target => !consumed.has(target));
  for (const target of targets) {
    if (target.selectionKind || activeBySymbol.has(target.symbol.toLowerCase())) continue;
    const covered = logical.coverage(logicalRegistry, target.romStart, target.romEndExclusive, baserom);
    const full = logicalRegistry.bodies.filter(body => body.romStart >= target.romStart && body.romEndExclusive <= target.romEndExclusive);
    const entryBody = logicalRegistry.bodies.find(body => body.romStart <= target.entryVram - target.vramStart + target.romStart
      && body.romEndExclusive > target.entryVram - target.vramStart + target.romStart);
    const body = full.length === 1 && covered.every(piece => piece.kind !== 'unknown') ? full[0]
      : full.length === 0 && entryBody ? entryBody : null;
    if (!body || body.romStart === target.romStart && body.romEndExclusive === target.romEndExclusive) continue;
    const first = body.fragments[0], last = body.fragments[body.fragments.length - 1];
    Object.assign(target, { selectionKind: 'logical-body', physicalEnvelope: { romStart: target.romStart, romEndExclusive: target.romEndExclusive, coverage: covered },
      romStart: body.romStart, romEndExclusive: body.romEndExclusive, bytes: body.romEndExclusive - body.romStart,
      vramStart: first.vramStart, vramEndExclusive: last.vramStart + last.bytes, entryVram: first.vramStart,
      symbolByteOffset: 0, logicalFragments: body.fragments,
      expectedBytes: baserom ? Buffer.from(baserom.subarray(body.romStart, body.romEndExclusive)) : null,
      expectedBytesSha256: baserom ? body.expectedBytesSha256 : null });
  }
  for (const target of targets) {
    const relevant = logicalRegistry.bodies.filter(body => body.romStart < target.romEndExclusive && body.romEndExclusive > target.romStart);
    if (relevant.length) {
      target.logicalCoverage = logical.coverage(logicalRegistry, target.romStart, target.romEndExclusive, baserom);
      target.logicalFunctions = relevant.filter(body => body.romStart >= target.romStart && body.romEndExclusive <= target.romEndExclusive)
        .map((body, index) => ({ symbol: index === 0 ? target.symbol : body.symbol,
          romStart: body.romStart, romEndExclusive: body.romEndExclusive,
          offset: body.romStart - target.romStart, bytes: body.romEndExclusive - body.romStart,
          evidence: body.evidence, fragments: body.fragments }));
      target.logicalCoverageComplete = target.logicalCoverage.every(piece => ['function','padding'].includes(piece.kind));
      target.selectionKind ||= 'physical-owner-envelope';
    }
    const record = Object.fromEntries(Object.entries(target).filter(([key]) => ![
      ...LIVE_TARGET_FIELDS, 'expectedBytes', 'row', 'targetId', 'modelId', 'expectedBytesSha256',
    ].includes(key)));
    target.targetId = digest({ modelId, metadata: record, expectedBytesSha256: target.expectedBytesSha256 });
  }
  const bySymbol = new Map();
  for (const target of targets) {
    const key = target.symbol.toLowerCase();
    if (bySymbol.has(key)) throw new Error(`accepted function symbol is duplicated: ${target.symbol}`);
    bySymbol.set(key, target);
  }
  for (const target of targets) for (const alias of target.logicalAliases || []) {
    const key = alias.toLowerCase();
    if (bySymbol.has(key) && bySymbol.get(key) !== target) throw new Error(`logical alias collides: ${alias}`);
    bySymbol.set(key, target);
  }
  const logicalTargets = [];
  for (const body of logicalRegistry.bodies) {
    if (bySymbol.has(body.symbol.toLowerCase())) continue;
    const enclosing = targets.find(target => target.romStart === body.romStart);
    if (enclosing?.selectionKind === 'logical-body' && enclosing.romEndExclusive !== body.romEndExclusive) {
      throw new Error(`logical body alias extent differs: ${body.symbol}`);
    }
    if (enclosing) { bySymbol.set(body.symbol.toLowerCase(), enclosing); continue; }
    const first = body.fragments[0], last = body.fragments[body.fragments.length - 1];
    const row = model.rows.find(row => row.index === first.rowIndex);
    const metadata = { schemaVersion: 1, symbol: body.symbol, selectionKind: 'logical-body',
      primaryId: row.primaryId, rowIndex: row.index, romStart: body.romStart, romEndExclusive: body.romEndExclusive,
      bytes: body.romEndExclusive - body.romStart, vramStart: first.vramStart,
      vramEndExclusive: last.vramStart + last.bytes, entryVram: first.vramStart, symbolByteOffset: 0,
      sectionName: first.sectionName, placementKind: first.placementKind, overlayDescriptorId: first.overlayDescriptorId,
      loadSlabId: first.loadSlabId, originalAssembly: first.file, originalAssemblySha256: first.sha256,
      logicalFragments: body.fragments, logicalFunctions: [{ symbol: body.symbol, romStart: body.romStart,
        romEndExclusive: body.romEndExclusive, offset: 0, bytes: body.romEndExclusive - body.romStart, evidence: body.evidence, fragments: body.fragments }],
      logicalCoverage: logical.coverage(logicalRegistry, body.romStart, body.romEndExclusive, baserom), logicalCoverageComplete: true };
    const target = { ...metadata, modelId, row, expectedBytesSha256: baserom ? body.expectedBytesSha256 : null,
      expectedBytes: baserom ? Buffer.from(baserom.subarray(body.romStart, body.romEndExclusive)) : null,
      targetId: digest({ modelId, metadata, expectedBytesSha256: baserom ? body.expectedBytesSha256 : null }),
      activeMatchingSource: null, activeMatchingProducer: null };
    target.scratchCompilation = scratchCapability({ activeTargetsBySymbol: activeBySymbol }, target);
    logicalTargets.push(target); bySymbol.set(body.symbol.toLowerCase(), target);
  }
  for (const target of targets) target.scratchCompilation = scratchCapability({ activeTargetsBySymbol: activeBySymbol }, target);
  return { config, model, modelId, modelManifest, baserom, targets, logicalTargets, bySymbol, logicalRegistry, activeTargetsBySymbol: activeBySymbol };
}

function resolveTarget(workbench, symbol) {
  const target = workbench.bySymbol.get(String(symbol).toLowerCase());
  if (!target) throw new Error(`accepted function target does not resolve uniquely: ${symbol}`);
  return String(symbol) === target.symbol ? target : { ...target, requestedSymbol: String(symbol) };
}

function historicalSymbols(target) {
  return [...new Set([target.symbol, ...(target.logicalAliases || []), target.requestedSymbol].filter(Boolean).map(symbol => symbol.toLowerCase()))];
}

function targetRecord(target, observedAt = new Date().toISOString()) {
  if (!target.expectedBytes) throw new Error('target record requires canonical expected bytes');
  const metadata = Object.fromEntries(Object.entries(target).filter(([key]) => ![
    ...LIVE_TARGET_FIELDS, 'expectedBytes', 'row', 'targetId', 'modelId', 'expectedBytesSha256',
  ].includes(key)));
  return {
    targetId: target.targetId,
    modelId: target.modelId,
    symbol: target.symbol,
    metadata: { ...metadata, expectedBytesSha256: target.expectedBytesSha256 },
    expectedBytes: target.expectedBytes.toString('base64'),
    observedAt,
  };
}

function publicTarget(target) {
  return {
    symbol: target.symbol,
    targetId: target.targetId,
    modelId: target.modelId,
    primaryId: target.primaryId,
    rowIndex: target.rowIndex,
    rom: `${hex(target.romStart)}..${hex(target.romEndExclusive)}`,
    bytes: target.bytes,
    vram: `${hex(target.vramStart)}..${hex(target.vramEndExclusive)}`,
    entryVram: hex(target.entryVram),
    symbolByteOffset: target.symbolByteOffset,
    placementKind: target.placementKind,
    overlayDescriptorId: target.overlayDescriptorId,
    loadSlabId: target.loadSlabId,
    sectionName: target.sectionName,
    originalAssembly: target.originalAssembly,
    ...(target.originalAssemblyParts ? { originalAssemblyParts: target.originalAssemblyParts } : {}),
    expectedBytesSha256: target.expectedBytesSha256,
    activeMatchingSource: target.activeMatchingSource,
    activeMatchingProducer: target.activeMatchingProducer,
    scratchCompilation: target.scratchCompilation,
    selectionKind: target.selectionKind,
    logicalFunctions: target.logicalFunctions,
    logicalCoverage: target.logicalCoverage,
    logicalCoverageComplete: target.logicalCoverageComplete,
    logicalAliases: target.logicalAliases,
    requestedSymbol: target.requestedSymbol,
    ordinaryMatchingEligible: target.symbolByteOffset === 0 && target.selectionKind !== 'logical-body' && target.logicalCoverageComplete !== false,
  };
}

module.exports = {
  historicalSymbols,
  LIVE_TARGET_FIELDS, assertScratchCapability, isActiveTarget, producerView, scratchCapability,
  ACTIVE_PATH,
  BASEROM_PATH,
  CONFIG_PATH,
  SEMANTIC_PATH,
  canonicalJson,
  digest,
  hex,
  loadWorkbenchModel,
  publicTarget,
  resolveTarget,
  targetRecord,
};
