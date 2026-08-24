'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  CONFIG_PATH: PHASE7_CONFIG_PATH,
  ROOT,
  loadAcceptedModel,
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

function loadWorkbenchModel(options = {}) {
  const config = readJson(CONFIG_PATH);
  if (config.schemaVersion !== 1 || config.databaseSchemaVersion !== 2) throw new Error('matching workbench configuration schema drift');
  const model = loadAcceptedModel();
  const baserom = options.requireBaserom === false ? null : loadBaserom(model);
  const active = readJson(ACTIVE_PATH);
  if (active.schemaVersion !== 3 || !Array.isArray(active.targets)) throw new Error('active matching target configuration schema drift');
  const activeSymbols = new Set();
  for (const target of active.targets) {
    const symbol = String(target?.symbol || '').toLowerCase();
    if (!symbol || activeSymbols.has(symbol) || typeof target.source !== 'string' || !target.source) {
      throw new Error('active matching target record is malformed or duplicated');
    }
    activeSymbols.add(symbol);
  }
  const activeBySymbol = new Map((active.targets || []).map((target) => [target.symbol.toLowerCase(), target]));
  const modelManifest = {
    schemaVersion: 1,
    targetModelContract: 3,
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
  const targets = model.rows
    .filter((row) => row.primaryClass === 'code' && row.part && row.slices.length === 1 && row.slices[0].executable)
    .map((row) => {
      const slice = row.slices[0];
      const expected = baserom ? Buffer.from(baserom.subarray(row.romStart, row.romEndExclusive)) : null;
      const metadata = {
        schemaVersion: 1,
        symbol: row.part.name,
        primaryId: row.primaryId,
        rowIndex: row.index,
        romStart: row.romStart,
        romEndExclusive: row.romEndExclusive,
        bytes: row.bytes,
        vramStart: slice.vramStart,
        vramEndExclusive: slice.vramEndExclusive,
        entryVram: slice.vramStart + row.part.symbolByteOffset,
        symbolByteOffset: row.part.symbolByteOffset,
        sectionName: slice.sectionName,
        placementKind: slice.placementKind,
        overlayDescriptorId: slice.overlayDescriptorId,
        loadSlabId: slice.loadSlabId,
        originalAssembly: row.part.file,
        originalAssemblySha256: row.part.sha256,
      };
      const targetId = digest({ modelId, metadata, expectedBytesSha256: expected ? sha256Buffer(expected) : null });
      return {
        ...metadata,
        activeMatchingSource: activeBySymbol.get(row.part.name.toLowerCase())?.source || null,
        targetId,
        modelId,
        expectedBytes: expected,
        expectedBytesSha256: expected ? sha256Buffer(expected) : null,
        row,
      };
    });
  const bySymbol = new Map();
  for (const target of targets) {
    const key = target.symbol.toLowerCase();
    if (bySymbol.has(key)) throw new Error(`accepted function symbol is duplicated: ${target.symbol}`);
    bySymbol.set(key, target);
  }
  return { config, model, modelId, modelManifest, baserom, targets, bySymbol };
}

function resolveTarget(workbench, symbol) {
  const target = workbench.bySymbol.get(String(symbol).toLowerCase());
  if (!target) throw new Error(`accepted function target does not resolve uniquely: ${symbol}`);
  return target;
}

function targetRecord(target, observedAt = new Date().toISOString()) {
  if (!target.expectedBytes) throw new Error('target record requires canonical expected bytes');
  const metadata = Object.fromEntries(Object.entries(target).filter(([key]) => ![
    'activeMatchingSource', 'expectedBytes', 'row', 'targetId', 'modelId', 'expectedBytesSha256',
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
    expectedBytesSha256: target.expectedBytesSha256,
    activeMatchingSource: target.activeMatchingSource,
    ordinaryMatchingEligible: target.symbolByteOffset === 0,
  };
}

module.exports = {
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
