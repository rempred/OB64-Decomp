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
const CONFIG_PATH = path.join(ROOT, 'config', 'matching-c-targets.json');
const LINKAGE_CONFIG_PATH = path.join(ROOT, 'config', 'matching-c-linkage.json');
const LEGACY_CONFIG_PATH = path.join(ROOT, 'config', 'phase8', 'matching-c.json');
const TOOLCHAIN_CONFIG_PATH = path.join(ROOT, 'config', 'toolchain.json');
const TOOLCHAIN_BUILD_PATH = path.join(ROOT, 'config', 'gnu-binutils-2.6-build.json');
const SAFE_LINK_SYMBOL = /^[A-Za-z_.$][A-Za-z0-9_.$]*$/;
const LOAD_RELOCATION_TYPES = new Set(['R_MIPS_26', 'R_MIPS_HI16', 'R_MIPS_LO16']);

function parseNumber(value, label) {
  if (Number.isInteger(value)) return value;
  if (typeof value === 'string' && /^0x[0-9a-f]+$/i.test(value)) return Number.parseInt(value.slice(2), 16);
  fail(`${label} is not an integer or hexadecimal string`);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function exactKeys(value, expected) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && sameJson(Object.keys(value).sort(), [...expected].sort());
}

function normalizeRelocationRecords(records, targetSymbol, label) {
  if (!Array.isArray(records)) fail(`${label} is not an array`);
  const offsets = new Set();
  let previousOffset = -1;
  return records.map((record, index) => {
    if (!exactKeys(record, ['offset', 'type', 'symbol', 'section'])
        || typeof record.offset !== 'string' || !/^0x[0-9A-F]{8}$/.test(record.offset)
        || Number.parseInt(record.offset.slice(2), 16) % 4 !== 0
        || !LOAD_RELOCATION_TYPES.has(record.type)
        || typeof record.symbol !== 'string' || !SAFE_LINK_SYMBOL.test(record.symbol)
        || record.section !== '.rel.text') {
      fail(`${label} record ${index} is malformed`);
    }
    if (offsets.has(record.offset)) fail(`${label} contains duplicate relocation offset ${record.offset}`);
    const numericOffset = Number.parseInt(record.offset.slice(2), 16);
    if (numericOffset < previousOffset) fail(`${label} relocation offsets are not ordered`);
    offsets.add(record.offset);
    previousOffset = numericOffset;
    return {
      offset: record.offset,
      type: record.type,
      symbol: record.symbol.toLowerCase() === targetSymbol.toLowerCase() ? '.text' : record.symbol,
      section: record.section,
    };
  });
}

function validateLinkageConfig(linkage, expectedProfile) {
  if (!exactKeys(linkage, ['schemaVersion', 'profile', 'symbols', 'targets'])
      || linkage.schemaVersion !== 1 || linkage.profile !== expectedProfile
      || !Array.isArray(linkage.symbols) || !Array.isArray(linkage.targets)) {
    fail('matching-C linkage configuration schema or profile drift');
  }
  const linkSymbols = {};
  for (const [index, entry] of linkage.symbols.entries()) {
    if (!exactKeys(entry, ['name', 'address'])
        || typeof entry.name !== 'string' || !SAFE_LINK_SYMBOL.test(entry.name)
        || typeof entry.address !== 'string' || !/^0x[0-9A-F]{8}$/.test(entry.address)) {
      fail(`matching-C linkage symbol ${index} is malformed`);
    }
    if (Object.prototype.hasOwnProperty.call(linkSymbols, entry.name)) {
      fail(`matching-C linkage symbol is duplicated: ${entry.name}`);
    }
    linkSymbols[entry.name] = entry.address;
  }
  const targets = new Map();
  for (const [index, entry] of linkage.targets.entries()) {
    if (!exactKeys(entry, ['symbol', 'expectedRelocations'])
        || typeof entry.symbol !== 'string' || !SAFE_LINK_SYMBOL.test(entry.symbol)) {
      fail(`matching-C linkage target ${index} is malformed`);
    }
    const key = entry.symbol.toLowerCase();
    if (targets.has(key)) fail(`matching-C linkage target is duplicated: ${entry.symbol}`);
    targets.set(key, {
      symbol: entry.symbol,
      expectedRelocations: normalizeRelocationRecords(
        entry.expectedRelocations,
        entry.symbol,
        `matching-C linkage target ${entry.symbol}`,
      ),
    });
  }
  return { config: linkage, linkSymbols, targets };
}

function selectRelocationContract(symbol, canonicalTarget, legacyTarget, allowMissing = false) {
  const legacyRelocations = legacyTarget ? normalizeRelocationRecords(
    (legacyTarget.expectedRelocations || []).filter((record) => record.section !== '.rel.pdr'),
    symbol,
    `legacy relocation contract ${symbol}`,
  ) : null;
  if (canonicalTarget) {
    if (legacyRelocations && !sameJson(canonicalTarget.expectedRelocations, legacyRelocations)) {
      fail(`canonical/legacy relocation contract mismatch: ${symbol}`);
    }
    return {
      expectedRelocations: canonicalTarget.expectedRelocations,
      source: 'canonical',
      canonicalLegacyEquivalent: legacyRelocations ? true : null,
    };
  }
  if (legacyRelocations) {
    return {
      expectedRelocations: legacyRelocations,
      source: 'legacy-compatibility',
      canonicalLegacyEquivalent: null,
    };
  }
  if (allowMissing) {
    return {
      expectedRelocations: [],
      source: 'missing-diff-only',
      canonicalLegacyEquivalent: null,
    };
  }
  fail(`reviewed relocation contract is missing: ${symbol}`);
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
  if (!equivalent) fail(`active-target legacy-contract mismatch for ${symbol} field ${field}`);
  return { field, derived, legacy, equivalent };
}

function validateToolchainPin(pin) {
  if (!pin || typeof pin !== 'object' || Array.isArray(pin)
      || !sameJson(Object.keys(pin).sort(), ['buildProvenance', 'buildProvenanceSha256', 'manifest', 'manifestSha256'])
      || pin.manifest !== 'config/toolchain.json'
      || pin.buildProvenance !== 'config/gnu-binutils-2.6-build.json'
      || !/^[0-9A-F]{64}$/.test(pin.manifestSha256)
      || !/^[0-9A-F]{64}$/.test(pin.buildProvenanceSha256)
      || pin.manifestSha256 !== sha256File(TOOLCHAIN_CONFIG_PATH)
      || pin.buildProvenanceSha256 !== sha256File(TOOLCHAIN_BUILD_PATH)) {
    fail('GNU Binutils 2.6 toolchain pin drift');
  }
  return pin;
}

function loadActiveTargetModel(options = {}) {
  const model = loadAcceptedModel();
  const minimal = readJson(CONFIG_PATH);
  const linkage = readJson(LINKAGE_CONFIG_PATH);
  const legacy = readJson(LEGACY_CONFIG_PATH);
  if (minimal.schemaVersion !== 3 || minimal.profile !== model.config.profile || !Array.isArray(minimal.targets) || minimal.targets.length === 0
      || !minimal.toolchain || typeof minimal.toolchain !== 'object') {
    fail('active target configuration schema or profile drift');
  }
  if (legacy.schemaVersion !== 2 || legacy.profile !== minimal.profile || !Array.isArray(legacy.targets)) {
    fail('legacy target compatibility configuration schema drift');
  }
  const reviewedLinkage = validateLinkageConfig(linkage, minimal.profile);
  const allowMissing = new Set((options.allowMissingRelocationContracts || []).map((symbol) => {
    if (typeof symbol !== 'string' || !SAFE_LINK_SYMBOL.test(symbol)) fail('invalid diff-only relocation-contract allowance');
    return symbol.toLowerCase();
  }));
  for (const legacyTarget of legacy.targets) {
    for (const [symbol, address] of Object.entries(legacyTarget.linkSymbols || {})) {
      if (!Object.prototype.hasOwnProperty.call(reviewedLinkage.linkSymbols, symbol)
          || parseNumber(reviewedLinkage.linkSymbols[symbol], `canonical link symbol ${symbol}`) !== parseNumber(address, `legacy link symbol ${symbol}`)) {
        fail(`canonical/legacy link symbol mismatch: ${symbol}`);
      }
    }
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

  const toolchainPin = validateToolchainPin(minimal.toolchain);
  const toolchainConfig = readJson(TOOLCHAIN_CONFIG_PATH);
  const toolchainBuild = readJson(TOOLCHAIN_BUILD_PATH);
  if (toolchainConfig.schemaVersion !== 2
      || toolchainConfig.sourceCommit !== '54514ded39ceb32165a125ddba04ca5b551773a2'
      || toolchainBuild.schemaVersion !== 1
      || toolchainBuild.source.commit !== toolchainConfig.sourceCommit
      || !sameJson(toolchainConfig.baselineAssemblerFlags, model.config.binutils.assemblerFlags)
      || !sameJson(toolchainConfig.compilerAssemblerFlags, model.config.binutils.compilerAssemblerFlags)
      || !sameJson(toolchainConfig.linkerFlags, model.config.binutils.linkerFlags)) {
    fail('GNU Binutils 2.6 production configuration drift');
  }
  const toolchain = {
    compilerManifestSha256: legacy.compiler.manifestSha256,
    compilerExecutableSha256: legacy.compiler.executableSha256,
    compileFlags: legacy.compiler.compileFlags,
    identity: {
      id: toolchainConfig.id,
      sourceCommit: toolchainConfig.sourceCommit,
      manifestPath: toolchainPin.manifest,
      manifestSha256: toolchainPin.manifestSha256,
      buildProvenancePath: toolchainPin.buildProvenance,
      buildProvenanceSha256: toolchainPin.buildProvenanceSha256,
      assemblerExecutableSha256: model.config.binutils.tools['mips-kmc-elf-as.exe'],
      assemblerFlags: model.config.binutils.compilerAssemblerFlags,
    },
  };

  const baseromFile = path.join(ROOT, 'build', 'baserom.us_rev0.z64');
  if (!fs.existsSync(baseromFile) || fs.statSync(baseromFile).size !== model.config.rom.bytes || sha256File(baseromFile) !== model.config.rom.sha256) {
    fail('canonical normalized baserom is missing or has drifted; run node tools/verify_baserom.js');
  }
  const baserom = fs.readFileSync(baseromFile);
  const overlayConfig = readJson(path.join(ROOT, 'config', 'overlays', 'us_rev0.json'));
  const compatibility = [];
  const usedCanonicalContracts = new Set();
  const targets = minimal.targets.map((entry, targetIndex) => {
    if (!entry || typeof entry.symbol !== 'string' || typeof entry.source !== 'string' || Object.keys(entry).some((key) => !['symbol', 'source'].includes(key))) {
      fail(`active target entry ${targetIndex} is not minimal symbol/source metadata`);
    }
    const legacyMatches = legacy.targets.filter((target) => target.symbol.toLowerCase() === entry.symbol.toLowerCase());
    if (legacyMatches.length > 1) fail(`legacy compatibility target is ambiguous: ${entry.symbol}`);
    const legacyTarget = legacyMatches[0] || null;
    const canonicalTarget = reviewedLinkage.targets.get(entry.symbol.toLowerCase()) || null;
    if (canonicalTarget) usedCanonicalContracts.add(entry.symbol.toLowerCase());
    const relocationContract = selectRelocationContract(
      entry.symbol,
      canonicalTarget,
      legacyTarget,
      allowMissing.has(entry.symbol.toLowerCase()),
    );
    const row = resolveAcceptedRow(model, entry.symbol);
    if (row.inputKind !== 'tracked-assembly' || !row.part || row.slices.length !== 1 || !row.slices[0].executable) {
      fail(`active target is not one accepted executable assembly owner: ${entry.symbol}`);
    }
    const slice = row.slices[0];
    for (const record of relocationContract.expectedRelocations) {
      if (Number.parseInt(record.offset.slice(2), 16) >= row.bytes) {
        fail(`relocation contract offset is outside target ${entry.symbol}: ${record.offset}`);
      }
    }
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
      expectedRelocations: relocationContract.expectedRelocations,
      relocationContractSource: relocationContract.source,
      legacyAncillaryRelocations: legacyTarget ? (legacyTarget.expectedRelocations || []).filter((record) => record.section === '.rel.pdr') : [],
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
      relocationContractSource: relocationContract.source,
      canonicalLegacyEquivalent: relocationContract.canonicalLegacyEquivalent,
      relocationComparison: relocationContract.source === 'canonical'
        ? 'canonical-reviewed-contract'
        : relocationContract.source === 'legacy-compatibility'
          ? 'legacy-load-relevant-contract-retained'
          : 'missing-contract-allowed-for-selected-diff-only',
      relocationDerivationLimit: legacyTarget ? 'accepted .word assembly owners emit no ELF relocation records' : null,
      retainedBridgeFields: legacyTarget
        ? ['compiler', ...(relocationContract.source === 'legacy-compatibility' ? ['expectedRelocations'] : []), 'ancillaryPdrRelocations']
        : ['compiler'],
      retiredPins: ['sourceSha256', 'expectedObjectTextSha256'],
    });
    return target;
  });

  for (const key of reviewedLinkage.targets.keys()) {
    if (!usedCanonicalContracts.has(key)) fail(`matching-C linkage contract has no active target: ${reviewedLinkage.targets.get(key).symbol}`);
  }

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
    toolchain,
    legacyConfig: legacy,
    linkageConfig: reviewedLinkage.config,
    linkageConfigIdentity: {
      path: path.relative(ROOT, LINKAGE_CONFIG_PATH).replace(/\\/g, '/'),
      bytes: fs.statSync(LINKAGE_CONFIG_PATH).size,
      sha256: sha256File(LINKAGE_CONFIG_PATH),
    },
    linkSymbols: reviewedLinkage.linkSymbols,
    minimalConfig: minimal,
    model,
    phase6Manifest,
    targets,
    target: targets[0],
  };
}

module.exports = {
  CONFIG_PATH,
  LINKAGE_CONFIG_PATH,
  LEGACY_CONFIG_PATH,
  TOOLCHAIN_CONFIG_PATH,
  TOOLCHAIN_BUILD_PATH,
  loadActiveTargetModel,
  normalizeRelocationRecords,
  parseNumber,
  resolveAcceptedRow,
  safeRelative,
  selectRelocationContract,
  validateLinkageConfig,
  validateToolchainPin,
};
