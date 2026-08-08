'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  fail,
  loadAcceptedModel,
  readJson,
  sha256Buffer,
  sha256File,
} = require('./phase7_conventional');
const {
  validateDialectManifest,
} = require('./compiler_assembly_dialect');

const CONFIG_PATH = path.join(ROOT, 'config', 'matching-c-targets.json');
const LEGACY_CONFIG_PATH = path.join(ROOT, 'config', 'phase8', 'matching-c.json');
const DIALECT_MANIFEST_PATH = path.join(ROOT, 'config', 'compiler-assembly-dialect.json');
const DIALECT_IMPLEMENTATION_PATH = path.join(ROOT, 'tools', 'lib', 'compiler_assembly_dialect.js');
const TOOLCHAIN_CONFIG_PATH = path.join(ROOT, 'config', 'toolchain.json');

function parseNumber(value, label) {
  if (Number.isInteger(value)) return value;
  if (typeof value === 'string' && /^0x[0-9a-f]+$/i.test(value)) return Number.parseInt(value.slice(2), 16);
  fail(`${label} is not an integer or hexadecimal string`);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function safeRelative(relative, label) {
  const normalized = relative.replace(/\\/g, '/');
  if (!normalized || path.isAbsolute(relative) || normalized === '..' || normalized.startsWith('../') || normalized.includes('/../')) {
    fail(`${label} is not a safe relative path: ${relative}`);
  }
  return normalized;
}

function resolveRelative(root, relative, label) {
  return path.join(root, ...safeRelative(relative, label).split('/'));
}

function rowContainsSymbol(row, symbol) {
  if (!row.part || !row.part.file) return false;
  if (String(row.part.name || '').toLowerCase() === symbol.toLowerCase()) return true;
  const file = path.join(ROOT, ...row.part.file.split('/'));
  if (!fs.existsSync(file)) return false;
  const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|\\n)\\s*(?:\\.globl\\s+${escaped}\\s*(?:\\r?\\n)|${escaped}:)`, 'm').test(fs.readFileSync(file, 'utf8'));
}

function resolveAcceptedRow(model, symbol) {
  let candidates = [];
  const addressMatch = /^func_([0-9a-f]{8})$/i.exec(symbol);
  if (addressMatch) {
    const romStart = Number.parseInt(addressMatch[1], 16);
    candidates = model.rows.filter((row) => row.romStart === romStart);
  }
  if (candidates.length !== 1) candidates = model.rows.filter((row) => rowContainsSymbol(row, symbol));
  if (candidates.length !== 1) fail(`active target does not resolve to one accepted structural owner: ${symbol}`);
  return candidates[0];
}

function assertEquivalent(symbol, field, derived, legacy) {
  const equivalent = sameJson(derived, legacy);
  if (!equivalent) fail(`active-target adapter mismatch for ${symbol} field ${field}`);
  return { field, derived, legacy, equivalent };
}

function validateDialectPin(pin, actualManifestSha256) {
  if (!pin || typeof pin !== 'object' || Array.isArray(pin)
      || !sameJson(Object.keys(pin).sort(), ['manifest', 'manifestSha256'])
      || pin.manifest !== 'config/compiler-assembly-dialect.json'
      || !/^[0-9A-F]{64}$/.test(pin.manifestSha256)
      || !/^[0-9A-F]{64}$/.test(actualManifestSha256)
      || pin.manifestSha256 !== actualManifestSha256) {
    fail('compiler-assembly dialect manifest pin drift');
  }
  return pin;
}

function loadActiveTargetModel() {
  const model = loadAcceptedModel();
  const minimal = readJson(CONFIG_PATH);
  const legacy = readJson(LEGACY_CONFIG_PATH);
  if (minimal.schemaVersion !== 2 || minimal.profile !== model.config.profile || !Array.isArray(minimal.targets) || minimal.targets.length === 0
      || !minimal.compilerAssemblyDialect || typeof minimal.compilerAssemblyDialect !== 'object'
      || !sameJson(Object.keys(minimal.compilerAssemblyDialect).sort(), ['manifest', 'manifestSha256'])) {
    fail('active target configuration schema or profile drift');
  }
  if (legacy.schemaVersion !== 2 || legacy.profile !== minimal.profile || !Array.isArray(legacy.targets)) {
    fail('legacy target compatibility configuration schema drift');
  }

  const phase6ManifestFile = resolveRelative(ROOT, legacy.compiler.manifest, 'compiler manifest');
  if (!fs.existsSync(phase6ManifestFile) || sha256File(phase6ManifestFile) !== legacy.compiler.manifestSha256) {
    fail('accepted compiler manifest drift');
  }
  const phase6Manifest = readJson(phase6ManifestFile);
  if (phase6Manifest.schemaVersion !== 1
      || phase6Manifest.compiler.executableSha256 !== legacy.compiler.executableSha256
      || !sameJson(phase6Manifest.compiler.compileFlags, legacy.compiler.compileFlags)) {
    fail('matching compiler contract differs from the accepted reproduction contract');
  }

  const dialectPin = minimal.compilerAssemblyDialect;
  if (!fs.existsSync(DIALECT_MANIFEST_PATH)) fail('compiler-assembly dialect manifest pin drift');
  validateDialectPin(dialectPin, sha256File(DIALECT_MANIFEST_PATH));
  if (path.resolve(resolveRelative(ROOT, dialectPin.manifest, 'dialect manifest')).toLowerCase() !== path.resolve(DIALECT_MANIFEST_PATH).toLowerCase()) {
    fail('compiler-assembly dialect manifest pin drift');
  }
  const dialectManifest = readJson(DIALECT_MANIFEST_PATH);
  const toolchainConfig = readJson(TOOLCHAIN_CONFIG_PATH);
  if (toolchainConfig.assemblerVersion !== model.config.binutils.version.replace(/^GNU Binutils /, 'GNU assembler (GNU Binutils) ')
      || !sameJson(toolchainConfig.assemblerFlags, model.config.binutils.assemblerFlags)) {
    fail('compiler-assembly dialect assembler configuration drift');
  }
  const dialectContract = {
    compilerManifestSha256: legacy.compiler.manifestSha256,
    compilerExecutableSha256: legacy.compiler.executableSha256,
    compileFlags: legacy.compiler.compileFlags,
    assemblerConfigSha256: sha256File(TOOLCHAIN_CONFIG_PATH),
    assemblerExecutableSha256: model.config.binutils.tools['mips64-elf-as.exe'],
    assemblerVersion: toolchainConfig.assemblerVersion,
    assemblerFlags: model.config.binutils.assemblerFlags,
    implementationPath: 'tools/lib/compiler_assembly_dialect.js',
    implementationSha256: sha256File(DIALECT_IMPLEMENTATION_PATH),
  };
  validateDialectManifest(dialectManifest, dialectContract);
  const dialect = {
    manifest: dialectManifest,
    contract: dialectContract,
    identity: {
      id: dialectManifest.id,
      rule: dialectManifest.rule,
      manifestPath: dialectPin.manifest,
      manifestSha256: dialectPin.manifestSha256,
      implementationPath: dialectManifest.implementationPath,
      implementationSha256: dialectManifest.implementationSha256,
    },
  };

  const baseromFile = path.join(ROOT, 'build', 'baserom.us_rev0.z64');
  if (!fs.existsSync(baseromFile) || fs.statSync(baseromFile).size !== model.config.rom.bytes || sha256File(baseromFile) !== model.config.rom.sha256) {
    fail('canonical normalized baserom is missing or has drifted; run node tools/verify_baserom.js');
  }
  const baserom = fs.readFileSync(baseromFile);
  const overlayConfig = readJson(path.join(ROOT, 'config', 'overlays', 'us_rev0.json'));
  const compatibility = [];
  const targets = minimal.targets.map((entry, targetIndex) => {
    if (!entry || typeof entry.symbol !== 'string' || typeof entry.source !== 'string' || Object.keys(entry).some((key) => !['symbol', 'source'].includes(key))) {
      fail(`active target entry ${targetIndex} is not minimal symbol/source metadata`);
    }
    const legacyMatches = legacy.targets.filter((target) => target.symbol.toLowerCase() === entry.symbol.toLowerCase());
    if (legacyMatches.length > 1) fail(`legacy compatibility target is ambiguous: ${entry.symbol}`);
    const legacyTarget = legacyMatches[0] || null;
    const row = resolveAcceptedRow(model, entry.symbol);
    if (row.inputKind !== 'tracked-assembly' || !row.part || row.slices.length !== 1 || !row.slices[0].executable) {
      fail(`active target is not one accepted executable assembly owner: ${entry.symbol}`);
    }
    const slice = row.slices[0];
    const sourceFile = resolveRelative(ROOT, entry.source, 'target source');
    const originalAssemblyFile = resolveRelative(ROOT, row.part.file, 'original assembly');
    if (!fs.existsSync(sourceFile) || !fs.statSync(sourceFile).isFile()) fail(`active target source is missing: ${entry.symbol}`);
    if (!fs.existsSync(originalAssemblyFile) || sha256File(originalAssemblyFile) !== row.part.sha256) {
      fail(`accepted original assembly identity drift: ${entry.symbol}`);
    }
    let descriptor = null;
    if (slice.overlayDescriptorId !== null) {
      descriptor = overlayConfig.descriptors.find((item) => item.id === slice.overlayDescriptorId);
      if (!descriptor) fail(`accepted overlay descriptor is missing: ${entry.symbol}`);
    }
    const expectedTextSha256 = sha256Buffer(baserom.subarray(row.romStart, row.romEndExclusive));
    const target = {
      symbol: entry.symbol,
      source: entry.source,
      targetIndex,
      primaryId: row.primaryId,
      rowIndex: row.index,
      chunkIndex: row.part.chunkIndex,
      originalAssembly: row.part.file,
      originalAssemblySha256: row.part.sha256,
      romStart: `0x${row.romStart.toString(16).toUpperCase().padStart(8, '0')}`,
      romEndExclusive: `0x${row.romEndExclusive.toString(16).toUpperCase().padStart(8, '0')}`,
      romStartNumber: row.romStart,
      romEndNumber: row.romEndExclusive,
      vramStart: `0x${slice.vramStart.toString(16).toUpperCase().padStart(8, '0')}`,
      vramStartNumber: slice.vramStart,
      bytes: row.bytes,
      sectionName: slice.sectionName,
      overlayDescriptorId: slice.overlayDescriptorId,
      descriptorRawSha256: descriptor ? descriptor.rawSha256 : null,
      expectedTextSha256,
      expectedRelocations: legacyTarget ? (legacyTarget.expectedRelocations || []) : [],
      linkSymbols: legacyTarget ? (legacyTarget.linkSymbols || {}) : {},
      sourceSha256: sha256File(sourceFile),
      descriptor,
      model,
      row,
    };
    const comparisons = legacyTarget ? [
      assertEquivalent(entry.symbol, 'primaryId', target.primaryId, legacyTarget.primaryId),
      assertEquivalent(entry.symbol, 'rowIndex', target.rowIndex, legacyTarget.rowIndex),
      assertEquivalent(entry.symbol, 'chunkIndex', target.chunkIndex, legacyTarget.chunkIndex),
      assertEquivalent(entry.symbol, 'originalAssembly', target.originalAssembly, legacyTarget.originalAssembly),
      assertEquivalent(entry.symbol, 'originalAssemblySha256', target.originalAssemblySha256, legacyTarget.originalAssemblySha256),
      assertEquivalent(entry.symbol, 'romStart', target.romStartNumber, parseNumber(legacyTarget.romStart, 'legacy ROM start')),
      assertEquivalent(entry.symbol, 'romEndExclusive', target.romEndNumber, parseNumber(legacyTarget.romEndExclusive, 'legacy ROM end')),
      assertEquivalent(entry.symbol, 'vramStart', target.vramStartNumber, parseNumber(legacyTarget.vramStart, 'legacy VRAM start')),
      assertEquivalent(entry.symbol, 'bytes', target.bytes, legacyTarget.bytes),
      assertEquivalent(entry.symbol, 'sectionName', target.sectionName, legacyTarget.sectionName),
      assertEquivalent(entry.symbol, 'overlayDescriptorId', target.overlayDescriptorId, legacyTarget.overlayDescriptorId),
      assertEquivalent(entry.symbol, 'descriptorRawSha256', target.descriptorRawSha256, legacyTarget.descriptorRawSha256),
      assertEquivalent(entry.symbol, 'expectedTextSha256', target.expectedTextSha256, legacyTarget.expectedTextSha256),
    ] : [];
    compatibility.push({
      symbol: entry.symbol,
      legacyRecord: Boolean(legacyTarget),
      comparisons,
      sourceHashAtMigrationEquivalent: legacyTarget ? target.sourceSha256 === legacyTarget.sourceSha256 : null,
      relocationComparison: legacyTarget ? 'trusted-legacy-contract-retained' : 'no-legacy-relocation-contract',
      relocationDerivationLimit: legacyTarget ? 'accepted .word assembly owners emit no ELF relocation records' : null,
      retainedBridgeFields: legacyTarget ? ['compiler', 'linkSymbols', 'expectedRelocations'] : ['compiler'],
      retiredPins: ['sourceSha256', 'expectedObjectTextSha256'],
    });
    return target;
  });

  const rows = new Set();
  const symbols = new Set();
  for (const target of targets) {
    if (rows.has(target.rowIndex) || symbols.has(target.symbol.toLowerCase())) fail('active target list contains duplicate owners');
    rows.add(target.rowIndex);
    symbols.add(target.symbol.toLowerCase());
  }
  return {
    config: { ...minimal, compiler: legacy.compiler },
    compatibility,
    descriptors: targets.map((target) => target.descriptor).filter(Boolean),
    dialect,
    legacyConfig: legacy,
    minimalConfig: minimal,
    model,
    phase6Manifest,
    targets,
    target: targets[0],
  };
}

module.exports = {
  CONFIG_PATH,
  DIALECT_IMPLEMENTATION_PATH,
  DIALECT_MANIFEST_PATH,
  LEGACY_CONFIG_PATH,
  TOOLCHAIN_CONFIG_PATH,
  loadActiveTargetModel,
  parseNumber,
  resolveAcceptedRow,
  safeRelative,
  validateDialectPin,
};
