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
const MULTI_OWNER_CONFIG_PATH = path.join(ROOT, 'config', 'matching-c-multi-owner.json');
const LEGACY_CONFIG_PATH = path.join(ROOT, 'config', 'phase8', 'matching-c.json');
const TOOLCHAIN_CONFIG_PATH = path.join(ROOT, 'config', 'toolchain.json');
const TOOLCHAIN_BUILD_PATH = path.join(ROOT, 'config', 'gnu-binutils-2.6-build.json');
const SAFE_LINK_SYMBOL = /^[A-Za-z_.$][A-Za-z0-9_.$]*$/;
const LOAD_RELOCATION_TYPES = new Set(['R_MIPS_26', 'R_MIPS_HI16', 'R_MIPS_LO16']);
const AUXILIARY_OUTPUT_SECTION = /^\.ob64\.r[0-9]+(?:\.s[0-9]+)?$/;
const AUXILIARY_TAIL_SECTION = /^\.ob64\.r[0-9]+(?:\.s[0-9]+)?\.tail$/;
const SHA256 = /^[0-9A-F]{64}$/;
const COMPILER_TEXT_ENTRY_EVIDENCE = new Set(['owner', 'internal-call-only', 'fixed-address-call']);
const COMPILER_TEXT_ENTRY_BINDINGS = new Set(['GLOBAL', 'LOCAL']);

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

function normalizeAuxiliaryRelocationRecords(records, label) {
  if (!Array.isArray(records)) fail(`${label} is not an array`);
  const offsets = new Set();
  let previousOffset = -1;
  return records.map((record, index) => {
    if (!exactKeys(record, ['offset', 'type', 'symbol', 'addend', 'section'])
        || typeof record.offset !== 'string' || !/^0x[0-9A-F]{8}$/.test(record.offset)
        || Number.parseInt(record.offset.slice(2), 16) % 4 !== 0
        || record.type !== 'R_MIPS_32'
        || record.symbol !== '.text'
        || typeof record.addend !== 'string' || !/^0x[0-9A-F]{8}$/.test(record.addend)
        || Number.parseInt(record.addend.slice(2), 16) % 4 !== 0
        || record.section !== '.rel.rodata') {
      fail(`${label} record ${index} is malformed`);
    }
    if (offsets.has(record.offset)) fail(`${label} contains duplicate relocation offset ${record.offset}`);
    const numericOffset = Number.parseInt(record.offset.slice(2), 16);
    if (numericOffset < previousOffset) fail(`${label} relocation offsets are not ordered`);
    offsets.add(record.offset);
    previousOffset = numericOffset;
    return { ...record };
  });
}

function normalizeCompilerTextFunctions(records, targetSymbol, label) {
  if (records === undefined) return [];
  if (!Array.isArray(records) || records.length < 2) fail(`${label} is not a multi-function array`);
  const symbols = new Set();
  let previousOffset = -1;
  return records.map((record, index) => {
    const recordLabel = `${label} record ${index}`;
    if (!exactKeys(record, ['symbol', 'offset', 'bytes', 'binding', 'entryEvidence'])
        || typeof record.symbol !== 'string' || !SAFE_LINK_SYMBOL.test(record.symbol)
        || typeof record.offset !== 'string' || !/^0x[0-9A-F]{8}$/.test(record.offset)
        || !Number.isInteger(record.bytes) || record.bytes <= 0 || record.bytes % 4 !== 0
        || !COMPILER_TEXT_ENTRY_BINDINGS.has(record.binding)
        || !COMPILER_TEXT_ENTRY_EVIDENCE.has(record.entryEvidence)) {
      fail(`${recordLabel} is malformed`);
    }
    const offsetNumber = Number.parseInt(record.offset.slice(2), 16);
    if (offsetNumber % 4 !== 0 || offsetNumber <= previousOffset || symbols.has(record.symbol)) {
      fail(`${label} is not uniquely ordered`);
    }
    if (index === 0) {
      if (record.symbol !== targetSymbol || offsetNumber !== 0
          || record.binding !== 'GLOBAL' || record.entryEvidence !== 'owner') {
        fail(`${label} primary owner entry is malformed`);
      }
    } else if (record.binding !== 'LOCAL' || record.entryEvidence === 'owner') {
      fail(`${recordLabel} invents an exported or duplicate owner entry`);
    }
    symbols.add(record.symbol);
    previousOffset = offsetNumber;
    return { ...record, offsetNumber };
  });
}

function normalizeAuxiliarySectionContracts(contracts, targetSymbol, label) {
  if (contracts === undefined) return [];
  if (!Array.isArray(contracts) || contracts.length === 0) fail(`${label} is not a nonempty array`);
  const compilerSections = new Set();
  const outputSections = new Set();
  return contracts.map((contract, index) => {
    const contractLabel = `${label} record ${index}`;
    const baseKeys = [
      'kind',
      'compilerSection',
      'outputSection',
      'sectionType',
      'sectionFlags',
      'alignment',
      'romStart',
      'romEndExclusive',
      'vramStart',
      'vramEndExclusive',
      'bytes',
      'entries',
      'expectedObjectSha256',
      'expectedLinkedSha256',
      'preservedTail',
      'expectedRelocations',
    ];
    const hasTrailingPaddingBytes = Object.prototype.hasOwnProperty.call(contract, 'trailingPaddingBytes');
    const hasTrailingPaddingHash = Object.prototype.hasOwnProperty.call(contract, 'expectedTrailingPaddingSha256');
    const contractKeys = hasTrailingPaddingBytes && hasTrailingPaddingHash
      ? [...baseKeys, 'trailingPaddingBytes', 'expectedTrailingPaddingSha256']
      : baseKeys;
    if (hasTrailingPaddingBytes !== hasTrailingPaddingHash
        || !exactKeys(contract, contractKeys)
        || contract.kind !== 'switch-table'
        || contract.compilerSection !== '.rodata'
        || typeof contract.outputSection !== 'string' || !AUXILIARY_OUTPUT_SECTION.test(contract.outputSection)
        || contract.sectionType !== 'SHT_PROGBITS'
        || !sameJson(contract.sectionFlags, ['SHF_ALLOC'])
        || !Number.isInteger(contract.alignment) || contract.alignment < 4
        || contract.alignment > 16 || (contract.alignment & (contract.alignment - 1)) !== 0
        || typeof contract.romStart !== 'string' || !/^0x[0-9A-F]{8}$/.test(contract.romStart)
        || typeof contract.romEndExclusive !== 'string' || !/^0x[0-9A-F]{8}$/.test(contract.romEndExclusive)
        || typeof contract.vramStart !== 'string' || !/^0x[0-9A-F]{8}$/.test(contract.vramStart)
        || typeof contract.vramEndExclusive !== 'string' || !/^0x[0-9A-F]{8}$/.test(contract.vramEndExclusive)
        || !Number.isInteger(contract.bytes) || contract.bytes <= 0 || contract.bytes % 4 !== 0
        || !Number.isInteger(contract.entries) || contract.entries <= 0
        || typeof contract.expectedObjectSha256 !== 'string' || !SHA256.test(contract.expectedObjectSha256)
        || typeof contract.expectedLinkedSha256 !== 'string' || !SHA256.test(contract.expectedLinkedSha256)) {
      fail(`${contractLabel} is malformed`);
    }
    const entryBytes = contract.entries * 4;
    const trailingPaddingBytes = hasTrailingPaddingBytes ? contract.trailingPaddingBytes : 0;
    const expectedTrailingPaddingSha256 = hasTrailingPaddingHash
      ? contract.expectedTrailingPaddingSha256
      : sha256Buffer(Buffer.alloc(0));
    const alignmentPaddingBytes = (contract.alignment - (entryBytes % contract.alignment)) % contract.alignment;
    if (!Number.isInteger(trailingPaddingBytes)
        || (hasTrailingPaddingBytes && trailingPaddingBytes <= 0)
        || trailingPaddingBytes % 4 !== 0
        || (hasTrailingPaddingBytes && trailingPaddingBytes !== alignmentPaddingBytes)
        || contract.bytes !== entryBytes + trailingPaddingBytes
        || typeof expectedTrailingPaddingSha256 !== 'string'
        || !SHA256.test(expectedTrailingPaddingSha256)) {
      fail(`${contractLabel} trailing alignment padding is malformed`);
    }
    if (sha256Buffer(Buffer.alloc(trailingPaddingBytes)) !== expectedTrailingPaddingSha256) {
      fail(`${contractLabel} trailing alignment padding is malformed`);
    }
    const tail = contract.preservedTail;
    if (tail !== null && (!exactKeys(tail, [
      'inputSection',
      'sectionType',
      'sectionFlags',
      'alignment',
      'romStart',
      'romEndExclusive',
      'vramStart',
      'vramEndExclusive',
      'bytes',
      'expectedSha256',
      'ownerOriginalAssembly',
      'ownerOriginalAssemblySha256',
    ])
        || tail.inputSection !== `${contract.outputSection}.tail`
        || !AUXILIARY_TAIL_SECTION.test(tail.inputSection)
        || ['.data', '.bss', '.text', '.rodata'].includes(tail.inputSection)
        || tail.sectionType !== 'SHT_PROGBITS'
        || !sameJson(tail.sectionFlags, ['SHF_ALLOC'])
        || !Number.isInteger(tail.alignment) || tail.alignment < 1
        || tail.alignment > 16 || (tail.alignment & (tail.alignment - 1)) !== 0
        || typeof tail.romStart !== 'string' || !/^0x[0-9A-F]{8}$/.test(tail.romStart)
        || typeof tail.romEndExclusive !== 'string' || !/^0x[0-9A-F]{8}$/.test(tail.romEndExclusive)
        || typeof tail.vramStart !== 'string' || !/^0x[0-9A-F]{8}$/.test(tail.vramStart)
        || typeof tail.vramEndExclusive !== 'string' || !/^0x[0-9A-F]{8}$/.test(tail.vramEndExclusive)
        || !Number.isInteger(tail.bytes) || tail.bytes <= 0
        || typeof tail.expectedSha256 !== 'string' || !SHA256.test(tail.expectedSha256)
        || typeof tail.ownerOriginalAssembly !== 'string' || path.isAbsolute(tail.ownerOriginalAssembly)
        || tail.ownerOriginalAssembly.split('/').includes('..')
        || typeof tail.ownerOriginalAssemblySha256 !== 'string'
        || !SHA256.test(tail.ownerOriginalAssemblySha256))) {
      fail(`${contractLabel} preserved tail is malformed`);
    }
    const romStart = parseNumber(contract.romStart, `${contractLabel} ROM start`);
    const romEndExclusive = parseNumber(contract.romEndExclusive, `${contractLabel} ROM end`);
    const vramStart = parseNumber(contract.vramStart, `${contractLabel} VMA start`);
    const vramEndExclusive = parseNumber(contract.vramEndExclusive, `${contractLabel} VMA end`);
    const tailRomStart = tail === null ? romEndExclusive : parseNumber(tail.romStart, `${contractLabel} tail ROM start`);
    const tailRomEndExclusive = tail === null ? romEndExclusive : parseNumber(tail.romEndExclusive, `${contractLabel} tail ROM end`);
    const tailVramStart = tail === null ? vramEndExclusive : parseNumber(tail.vramStart, `${contractLabel} tail VMA start`);
    const tailVramEndExclusive = tail === null ? vramEndExclusive : parseNumber(tail.vramEndExclusive, `${contractLabel} tail VMA end`);
    if (romEndExclusive - romStart !== contract.bytes
        || vramEndExclusive - vramStart !== contract.bytes
        || romStart % contract.alignment !== 0
        || vramStart % contract.alignment !== 0
        || (tail !== null && (
          tailRomEndExclusive - tailRomStart !== tail.bytes
          || tailVramEndExclusive - tailVramStart !== tail.bytes
          || tailRomStart % tail.alignment !== 0
          || tailVramStart % tail.alignment !== 0
          || romEndExclusive !== tailRomStart
          || vramEndExclusive !== tailVramStart
        ))) {
      fail(`${contractLabel} placement or alignment is malformed`);
    }
    const expectedRelocations = normalizeAuxiliaryRelocationRecords(
      contract.expectedRelocations,
      `${contractLabel} relocations`,
    );
    if (expectedRelocations.length !== contract.entries
        || expectedRelocations.some((record, relocationIndex) => (
          Number.parseInt(record.offset.slice(2), 16) !== relocationIndex * 4
        ))) {
      fail(`${contractLabel} switch-table entry census is malformed`);
    }
    if (compilerSections.has(contract.compilerSection)) {
      fail(`${label} repeats compiler section ${contract.compilerSection}`);
    }
    if (outputSections.has(contract.outputSection)) {
      fail(`${label} repeats output section ${contract.outputSection}`);
    }
    compilerSections.add(contract.compilerSection);
    outputSections.add(contract.outputSection);
    return {
      ...contract,
      entryBytes,
      trailingPaddingBytes,
      expectedTrailingPaddingSha256,
      romStartNumber: romStart,
      romEndNumber: romEndExclusive,
      vramStartNumber: vramStart,
      vramEndNumber: vramEndExclusive,
      preservedTail: tail === null ? null : {
        ...tail,
        romStartNumber: tailRomStart,
        romEndNumber: tailRomEndExclusive,
        vramStartNumber: tailVramStart,
        vramEndNumber: tailVramEndExclusive,
      },
      expectedRelocations,
    };
  });
}

function validateLinkageConfig(linkage, expectedProfile) {
  if (!exactKeys(linkage, ['schemaVersion', 'profile', 'symbols', 'targets'])
      || linkage.schemaVersion !== 3 || linkage.profile !== expectedProfile
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
    const expectedKeys = [
      'symbol',
      'expectedRelocations',
      ...(entry && Object.prototype.hasOwnProperty.call(entry, 'compilerTextFunctions') ? ['compilerTextFunctions'] : []),
      ...(entry && Object.prototype.hasOwnProperty.call(entry, 'auxiliarySections') ? ['auxiliarySections'] : []),
    ];
    if (!exactKeys(entry, expectedKeys)
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
      compilerTextFunctions: normalizeCompilerTextFunctions(
        entry.compilerTextFunctions,
        entry.symbol,
        `matching-C linkage target ${entry.symbol} compiler text functions`,
      ),
      auxiliarySections: normalizeAuxiliarySectionContracts(
        entry.auxiliarySections,
        entry.symbol,
        `matching-C linkage target ${entry.symbol} auxiliary sections`,
      ),
    });
  }
  return { config: linkage, linkSymbols, targets };
}

function validateNoActiveLinkSymbolShadows(targets, linkSymbols) {
  for (const target of targets) {
    if (Object.prototype.hasOwnProperty.call(linkSymbols, target.symbol)) {
      fail(`shared absolute link symbol shadows active target: ${target.symbol}`);
    }
  }
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
      compilerTextFunctions: canonicalTarget.compilerTextFunctions,
      auxiliarySections: canonicalTarget.auxiliarySections,
      source: 'canonical',
      canonicalLegacyEquivalent: legacyRelocations ? true : null,
    };
  }
  if (legacyRelocations) {
    return {
      expectedRelocations: legacyRelocations,
      compilerTextFunctions: [],
      auxiliarySections: [],
      source: 'legacy-compatibility',
      canonicalLegacyEquivalent: null,
    };
  }
  if (allowMissing) {
    return {
      expectedRelocations: [],
      compilerTextFunctions: [],
      auxiliarySections: [],
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

function resolveCompilerTextFunctions(target, records) {
  if (!Array.isArray(records)) fail(`compiler text-function contract is malformed: ${target.symbol}`);
  const resolved = records.length === 0 ? [{
    symbol: target.symbol,
    offset: '0x00000000',
    offsetNumber: 0,
    bytes: target.bytes,
    binding: 'GLOBAL',
    entryEvidence: 'owner',
  }] : records.map((record) => ({ ...record }));
  let cursor = 0;
  for (const [index, record] of resolved.entries()) {
    if (record.offsetNumber !== cursor || record.offsetNumber + record.bytes > target.bytes) {
      fail(`compiler text functions do not exactly partition accepted owner: ${target.symbol}`);
    }
    if (index === 0 && (record.symbol !== target.symbol || record.bytes >= target.bytes)) {
      if (records.length !== 0) fail(`compiler text-function owner entry drift: ${target.symbol}`);
    }
    cursor += record.bytes;
  }
  if (cursor !== target.bytes) fail(`compiler text functions do not cover accepted owner: ${target.symbol}`);
  return resolved;
}

function validateMultiOwnerConfig(config, expectedProfile, model, baserom) {
  if (!exactKeys(config, ['schemaVersion', 'profile', 'targets'])
      || config.schemaVersion !== 1 || config.profile !== expectedProfile
      || !Array.isArray(config.targets)) {
    fail('matching-C multi-owner configuration schema or profile drift');
  }
  const contracts = new Map();
  for (const [contractIndex, contract] of config.targets.entries()) {
    const label = `matching-C multi-owner contract ${contractIndex}`;
    if (!exactKeys(contract, [
      'symbol',
      'ownerRows',
      'romStart',
      'romEndExclusive',
      'vramStart',
      'vramEndExclusive',
      'expectedTextSha256',
    ])
        || typeof contract.symbol !== 'string' || !SAFE_LINK_SYMBOL.test(contract.symbol)
        || !Array.isArray(contract.ownerRows) || contract.ownerRows.length < 2
        || contract.ownerRows.some((rowIndex) => !Number.isInteger(rowIndex) || rowIndex < 0)
        || new Set(contract.ownerRows).size !== contract.ownerRows.length
        || typeof contract.romStart !== 'string' || !/^0x[0-9A-F]{8}$/.test(contract.romStart)
        || typeof contract.romEndExclusive !== 'string' || !/^0x[0-9A-F]{8}$/.test(contract.romEndExclusive)
        || typeof contract.vramStart !== 'string' || !/^0x[0-9A-F]{8}$/.test(contract.vramStart)
        || typeof contract.vramEndExclusive !== 'string' || !/^0x[0-9A-F]{8}$/.test(contract.vramEndExclusive)
        || typeof contract.expectedTextSha256 !== 'string' || !SHA256.test(contract.expectedTextSha256)) {
      fail(`${label} is malformed`);
    }
    const key = contract.symbol.toLowerCase();
    if (contracts.has(key)) fail(`matching-C multi-owner target is duplicated: ${contract.symbol}`);
    const rows = contract.ownerRows.map((rowIndex) => model.rows.find((row) => row.index === rowIndex));
    if (rows.some((row) => !row)) fail(`${label} references a missing accepted owner row`);
    const firstResolved = resolveAcceptedRow(model, contract.symbol);
    if (firstResolved.index !== rows[0].index) fail(`${label} does not begin with the symbol's accepted owner`);
    for (const [ownerIndex, row] of rows.entries()) {
      const slice = row.slices && row.slices[0];
      if (row.inputKind !== 'tracked-assembly' || row.ownerKind !== 'tracked-assembly-part'
          || row.primaryClass !== 'code' || row.ambiguous !== false || !row.part
          || row.slices.length !== 1 || !slice || !slice.executable
          || row.bytes <= 0 || row.bytes % 4 !== 0 || slice.bytes !== row.bytes
          || row.romStart !== slice.romStart || row.romEndExclusive !== slice.romEndExclusive
          || row.part.romStartNumber !== row.romStart || row.part.romEndNumber !== row.romEndExclusive
          || row.part.bytes !== row.bytes || row.part.symbolByteOffset !== 0) {
        fail(`${label} owner ${ownerIndex} is not one unambiguous accepted executable assembly row`);
      }
      if (ownerIndex > 0) {
        const previous = rows[ownerIndex - 1];
        const previousSlice = previous.slices[0];
        if (row.index !== previous.index + 1
            || row.romStart !== previous.romEndExclusive
            || slice.vramStart !== previousSlice.vramEndExclusive
            || slice.ordinal !== previousSlice.ordinal + 1
            || slice.placementKind !== previousSlice.placementKind
            || slice.overlayDescriptorId !== previousSlice.overlayDescriptorId
            || slice.loadSlabId !== previousSlice.loadSlabId
            || slice.overlaySection !== previousSlice.overlaySection) {
          fail(`${label} owners are missing, extra, reordered, overlapping, noncontiguous, or placement-incompatible`);
        }
      }
    }
    const first = rows[0];
    const last = rows[rows.length - 1];
    const firstSlice = first.slices[0];
    const lastSlice = last.slices[0];
    const romStart = parseNumber(contract.romStart, `${label} ROM start`);
    const romEndExclusive = parseNumber(contract.romEndExclusive, `${label} ROM end`);
    const vramStart = parseNumber(contract.vramStart, `${label} VMA start`);
    const vramEndExclusive = parseNumber(contract.vramEndExclusive, `${label} VMA end`);
    const bytes = rows.reduce((sum, row) => sum + row.bytes, 0);
    const expectedBytes = Buffer.from(baserom.subarray(romStart, romEndExclusive));
    if (romStart !== first.romStart || romEndExclusive !== last.romEndExclusive
        || vramStart !== firstSlice.vramStart || vramEndExclusive !== lastSlice.vramEndExclusive
        || romEndExclusive - romStart !== bytes || vramEndExclusive - vramStart !== bytes
        || expectedBytes.length !== bytes || sha256Buffer(expectedBytes) !== contract.expectedTextSha256) {
      fail(`${label} logical extent or accepted text identity drift`);
    }
    let logicalOffset = 0;
    const owners = rows.map((row) => {
      const slice = row.slices[0];
      const ownerFile = resolveRelative(ROOT, row.part.file, 'multi-owner original assembly');
      if (!fs.existsSync(ownerFile) || !fs.statSync(ownerFile).isFile()
          || sha256File(ownerFile) !== row.part.sha256) {
        fail(`${label} accepted original assembly identity drift`);
      }
      const owner = {
        logicalOffset,
        logicalEnd: logicalOffset + row.bytes,
        primaryId: row.primaryId,
        rowIndex: row.index,
        chunkIndex: row.part.chunkIndex,
        sectionName: slice.sectionName,
        symbol: row.part.name,
        originalAssembly: row.part.file,
        originalAssemblySha256: row.part.sha256,
        romStartNumber: row.romStart,
        romEndNumber: row.romEndExclusive,
        vramStartNumber: slice.vramStart,
        vramEndNumber: slice.vramEndExclusive,
        bytes: row.bytes,
        expectedTextSha256: sha256Buffer(baserom.subarray(row.romStart, row.romEndExclusive)),
        row,
      };
      logicalOffset += row.bytes;
      return owner;
    }).map((owner, ownerIndex) => ({ ...owner, ownerIndex }));
    contracts.set(key, {
      ...contract,
      romStartNumber: romStart,
      romEndNumber: romEndExclusive,
      vramStartNumber: vramStart,
      vramEndNumber: vramEndExclusive,
      bytes,
      rows,
      owners,
    });
  }
  return contracts;
}

function resolveAcceptedRows(model, symbol, multiOwnerContracts = new Map()) {
  const contract = multiOwnerContracts.get(symbol.toLowerCase()) || null;
  if (contract) return { rows: contract.rows, owners: contract.owners, contract };
  const row = resolveAcceptedRow(model, symbol);
  const containingContracts = [...multiOwnerContracts.values()].filter((candidate) => (
    candidate.rows.some((owner) => owner.index === row.index)
  ));
  if (containingContracts.length !== 0) {
    fail(`active target selects only part of accepted logical multi-owner target: ${symbol}`);
  }
  const slice = row.slices && row.slices[0];
  return {
    rows: [row],
    owners: slice ? [{
      ownerIndex: 0,
      logicalOffset: 0,
      logicalEnd: row.bytes,
      primaryId: row.primaryId,
      rowIndex: row.index,
      chunkIndex: row.part && row.part.chunkIndex,
      sectionName: slice.sectionName,
      symbol: row.part && row.part.name,
      originalAssembly: row.part && row.part.file,
      originalAssemblySha256: row.part && row.part.sha256,
      romStartNumber: row.romStart,
      romEndNumber: row.romEndExclusive,
      vramStartNumber: slice.vramStart,
      vramEndNumber: slice.vramEndExclusive,
      bytes: row.bytes,
      row,
    }] : [],
    contract: null,
  };
}

function resolveAuxiliarySectionContracts(model, baserom, target, contracts) {
  if (!Array.isArray(contracts)) fail(`auxiliary-section contract census is malformed: ${target.symbol}`);
  return contracts.map((contract) => {
    const rows = model.rows.filter((row) => (
      Array.isArray(row.slices)
      && row.slices.some((slice) => slice.sectionName === contract.outputSection)
    ));
    if (rows.length !== 1) {
      fail(`auxiliary output section does not resolve to one accepted owner: ${target.symbol} ${contract.outputSection}`);
    }
    const row = rows[0];
    const slices = row.slices.filter((slice) => slice.sectionName === contract.outputSection);
    if (row.inputKind !== 'tracked-assembly'
        || row.primaryClass !== 'data'
        || !row.part
        || slices.length !== 1
        || slices[0].executable
        || slices[0].overlaySection !== 'data-rodata'
        || slices[0].overlayDescriptorId !== target.overlayDescriptorId
        || row.part.chunkIndex !== target.chunkIndex) {
      fail(`auxiliary output section is not one accepted read-only data owner: ${target.symbol} ${contract.outputSection}`);
    }
    const slice = slices[0];
    if (contract.outputSection === target.sectionName
        || contract.romStartNumber < row.romStart
        || contract.vramStartNumber < slice.vramStart
        || contract.romEndNumber > row.romEndExclusive
        || contract.vramEndNumber > slice.vramEndExclusive
        || row.romEndExclusive - row.romStart !== slice.vramEndExclusive - slice.vramStart) {
      fail(`auxiliary output section placement drift: ${target.symbol} ${contract.outputSection}`);
    }
    const ownerFile = resolveRelative(ROOT, row.part.file, 'auxiliary original assembly');
    if (!fs.existsSync(ownerFile) || !fs.statSync(ownerFile).isFile() || sha256File(ownerFile) !== row.part.sha256) {
      fail(`accepted auxiliary original assembly identity drift: ${target.symbol} ${contract.outputSection}`);
    }
    const tail = contract.preservedTail;
    if (contract.romStartNumber < 0 || contract.romEndNumber > baserom.length
        || (tail !== null && (
          tail.romEndNumber > baserom.length
          || tail.romEndNumber !== row.romEndExclusive
          || tail.vramEndNumber !== slice.vramEndExclusive
          || tail.ownerOriginalAssembly !== row.part.file
          || tail.ownerOriginalAssemblySha256 !== row.part.sha256
        ))) {
      fail(`auxiliary baserom range is malformed: ${target.symbol} ${contract.outputSection}`);
    }
    const objectBytes = Buffer.alloc(contract.bytes);
    const relocatedBytes = Buffer.alloc(contract.bytes);
    for (const [index, relocation] of contract.expectedRelocations.entries()) {
      const offset = Number.parseInt(relocation.offset.slice(2), 16);
      const addend = Number.parseInt(relocation.addend.slice(2), 16);
      if (offset !== index * 4 || offset + 4 > contract.entryBytes || addend >= target.bytes) {
        fail(`auxiliary local-label relocation is outside its accepted text owner: ${target.symbol} ${contract.outputSection}`);
      }
      objectBytes.writeUInt32BE(addend >>> 0, offset);
      relocatedBytes.writeUInt32BE((target.vramStartNumber + addend) >>> 0, offset);
    }
    const retailBytes = Buffer.from(baserom.subarray(contract.romStartNumber, contract.romEndNumber));
    const retailTailBytes = tail === null
      ? Buffer.alloc(0)
      : Buffer.from(baserom.subarray(tail.romStartNumber, tail.romEndNumber));
    const expectedZeroPadding = Buffer.alloc(contract.trailingPaddingBytes);
    const objectPadding = Buffer.from(objectBytes.subarray(contract.entryBytes));
    const linkedPadding = Buffer.from(relocatedBytes.subarray(contract.entryBytes));
    const retailPadding = Buffer.from(retailBytes.subarray(contract.entryBytes));
    if (objectPadding.length !== contract.trailingPaddingBytes
        || linkedPadding.length !== contract.trailingPaddingBytes
        || retailPadding.length !== contract.trailingPaddingBytes
        || !objectPadding.equals(expectedZeroPadding)
        || !linkedPadding.equals(expectedZeroPadding)
        || !retailPadding.equals(expectedZeroPadding)
        || sha256Buffer(objectPadding) !== contract.expectedTrailingPaddingSha256
        || sha256Buffer(linkedPadding) !== contract.expectedTrailingPaddingSha256
        || sha256Buffer(retailPadding) !== contract.expectedTrailingPaddingSha256
        || sha256Buffer(objectBytes) !== contract.expectedObjectSha256
        || sha256Buffer(relocatedBytes) !== contract.expectedLinkedSha256
        || sha256Buffer(retailBytes) !== contract.expectedLinkedSha256
        || !relocatedBytes.equals(retailBytes)
        || (tail !== null && (
          retailTailBytes.length !== tail.bytes
          || sha256Buffer(retailTailBytes) !== tail.expectedSha256
        ))) {
      fail(`auxiliary switch-table bytes or relocation semantics drift: ${target.symbol} ${contract.outputSection}`);
    }
    return {
      ...contract,
      ownerRowIndex: row.index,
      ownerPrimaryId: row.primaryId,
      ownerChunkIndex: row.part.chunkIndex,
      ownerSectionBytes: row.bytes,
      ownerRomStartNumber: row.romStart,
      ownerRomEndNumber: row.romEndExclusive,
      ownerVramStartNumber: slice.vramStart,
      ownerVramEndNumber: slice.vramEndExclusive,
      ownerOriginalAssembly: row.part.file,
      ownerOriginalAssemblySha256: row.part.sha256,
      ownerSymbol: row.part.name,
      ownerSymbolVram: slice.vramStart + row.part.symbolByteOffset,
      ownerTailSection: tail === null ? null : tail.inputSection,
      ownerTailAlignment: tail === null ? 1 : tail.alignment,
      ownerTailBytes: tail === null ? 0 : tail.bytes,
      ownerTailSha256: tail === null ? sha256Buffer(Buffer.alloc(0)) : tail.expectedSha256,
      ownerTailRomStartNumber: tail === null ? contract.romEndNumber : tail.romStartNumber,
      ownerTailRomEndNumber: tail === null ? contract.romEndNumber : tail.romEndNumber,
      ownerTailVramStartNumber: tail === null ? contract.vramEndNumber : tail.vramStartNumber,
      ownerTailVramEndNumber: tail === null ? contract.vramEndNumber : tail.vramEndNumber,
    };
  });
}

function validateAuxiliaryOwnerGroups(targets) {
  const textSections = new Set(targets.map((target) => target.sectionName));
  const groups = new Map();
  for (const target of targets) {
    for (const auxiliary of target.auxiliarySections) {
      if (textSections.has(auxiliary.outputSection)) {
        fail(`active auxiliary-section ownership collision: ${target.symbol} ${auxiliary.outputSection}`);
      }
      if (!groups.has(auxiliary.ownerRowIndex)) groups.set(auxiliary.ownerRowIndex, []);
      groups.get(auxiliary.ownerRowIndex).push({ target, auxiliary });
    }
  }
  const outputOwners = new Map();
  for (const members of groups.values()) {
    const first = members[0].auxiliary;
    if (outputOwners.has(first.outputSection) && outputOwners.get(first.outputSection) !== first.ownerRowIndex) {
      fail(`active auxiliary output section resolves to multiple accepted owners: ${first.outputSection}`);
    }
    outputOwners.set(first.outputSection, first.ownerRowIndex);
    const firstChunkIndex = members[0].target.chunkIndex;
    if (members.some(({ target, auxiliary }) => (
      target.chunkIndex !== firstChunkIndex
      || auxiliary.outputSection !== first.outputSection
      || auxiliary.ownerRowIndex !== first.ownerRowIndex
      || auxiliary.ownerSectionBytes !== first.ownerSectionBytes
      || auxiliary.ownerRomStartNumber !== first.ownerRomStartNumber
      || auxiliary.ownerRomEndNumber !== first.ownerRomEndNumber
      || auxiliary.ownerVramStartNumber !== first.ownerVramStartNumber
      || auxiliary.ownerVramEndNumber !== first.ownerVramEndNumber
      || auxiliary.ownerOriginalAssembly !== first.ownerOriginalAssembly
      || auxiliary.ownerOriginalAssemblySha256 !== first.ownerOriginalAssemblySha256
      || auxiliary.alignment !== first.alignment
    ))) {
      fail(`shared auxiliary accepted-owner identity drift: ${first.outputSection}`);
    }
    const ordered = [...members].sort((left, right) => left.auxiliary.romStartNumber - right.auxiliary.romStartNumber);
    if (!sameJson(ordered.map(({ target }) => target.symbol), members.map(({ target }) => target.symbol))) {
      fail(`shared auxiliary fragments are not in linker order: ${first.outputSection}`);
    }
    let romCursor = first.ownerRomStartNumber;
    let vramCursor = first.ownerVramStartNumber;
    for (const [index, member] of members.entries()) {
      const { auxiliary } = member;
      if (auxiliary.romStartNumber !== romCursor || auxiliary.vramStartNumber !== vramCursor) {
        fail(`shared auxiliary fragments have a gap or overlap: ${first.outputSection}`);
      }
      if (index + 1 < members.length && auxiliary.ownerTailBytes !== 0) {
        fail(`nonfinal shared auxiliary fragment owns an assembly tail: ${first.outputSection}`);
      }
      auxiliary.ownerFragmentIndex = index;
      auxiliary.ownerFragmentCount = members.length;
      romCursor = auxiliary.romEndNumber;
      vramCursor = auxiliary.vramEndNumber;
    }
    const final = members[members.length - 1].auxiliary;
    if (final.ownerTailRomStartNumber !== romCursor
        || final.ownerTailVramStartNumber !== vramCursor
        || final.ownerTailRomEndNumber !== first.ownerRomEndNumber
        || final.ownerTailVramEndNumber !== first.ownerVramEndNumber
        || final.ownerTailBytes !== first.ownerRomEndNumber - romCursor) {
      fail(`shared auxiliary fragments and tail do not exactly cover accepted owner: ${first.outputSection}`);
    }
  }
  return groups;
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
  const multiOwnerConfig = readJson(MULTI_OWNER_CONFIG_PATH);
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
  const multiOwnerContracts = validateMultiOwnerConfig(
    multiOwnerConfig,
    minimal.profile,
    model,
    baserom,
  );
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
    const acceptedOwners = resolveAcceptedRows(model, entry.symbol, multiOwnerContracts);
    const rows = acceptedOwners.rows;
    const row = rows[0];
    if (rows.length === 0 || acceptedOwners.owners.length !== rows.length
        || rows.some((owner) => owner.inputKind !== 'tracked-assembly' || !owner.part
          || owner.slices.length !== 1 || !owner.slices[0].executable)) {
      fail(`active target is not an accepted executable assembly owner census: ${entry.symbol}`);
    }
    const slice = row.slices[0];
    const lastRow = rows[rows.length - 1];
    const lastSlice = lastRow.slices[0];
    const bytes = rows.reduce((sum, owner) => sum + owner.bytes, 0);
    for (const record of relocationContract.expectedRelocations) {
      if (Number.parseInt(record.offset.slice(2), 16) >= bytes) {
        fail(`relocation contract offset is outside target ${entry.symbol}: ${record.offset}`);
      }
    }
    const sourceFile = resolveRelative(ROOT, entry.source, 'target source');
    if (!fs.existsSync(sourceFile) || !fs.statSync(sourceFile).isFile()) fail(`active target source is missing: ${entry.symbol}`);
    for (const owner of acceptedOwners.owners) {
      const originalAssemblyFile = resolveRelative(ROOT, owner.originalAssembly, 'original assembly');
      if (!fs.existsSync(originalAssemblyFile)
          || sha256File(originalAssemblyFile) !== owner.originalAssemblySha256) {
        fail(`accepted original assembly identity drift: ${entry.symbol} ${owner.sectionName}`);
      }
    }
    let descriptor = null;
    if (slice.overlayDescriptorId !== null) {
      descriptor = overlayConfig.descriptors.find((item) => item.id === slice.overlayDescriptorId);
      if (!descriptor) fail(`accepted overlay descriptor is missing: ${entry.symbol}`);
    }
    const expectedTextSha256 = sha256Buffer(baserom.subarray(row.romStart, lastRow.romEndExclusive));
    const textOwners = acceptedOwners.owners.map((owner) => ({
      ...owner,
      expectedTextSha256: owner.expectedTextSha256
        || sha256Buffer(baserom.subarray(owner.romStartNumber, owner.romEndNumber)),
    }));
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
      romEndExclusive: `0x${lastRow.romEndExclusive.toString(16).toUpperCase().padStart(8, '0')}`,
      romStartNumber: row.romStart,
      romEndNumber: lastRow.romEndExclusive,
      vramStart: `0x${slice.vramStart.toString(16).toUpperCase().padStart(8, '0')}`,
      vramEndExclusive: `0x${lastSlice.vramEndExclusive.toString(16).toUpperCase().padStart(8, '0')}`,
      vramStartNumber: slice.vramStart,
      vramEndNumber: lastSlice.vramEndExclusive,
      bytes,
      sectionName: slice.sectionName,
      textOwners,
      multiOwner: textOwners.length > 1,
      multiOwnerContract: acceptedOwners.contract,
      overlayDescriptorId: slice.overlayDescriptorId,
      descriptorRawSha256: descriptor ? descriptor.rawSha256 : null,
      expectedTextSha256,
      expectedRelocations: relocationContract.expectedRelocations,
      compilerTextFunctionsExplicit: relocationContract.compilerTextFunctions.length > 0,
      compilerTextFunctions: [],
      auxiliarySections: [],
      relocationContractSource: relocationContract.source,
      legacyAncillaryRelocations: legacyTarget ? (legacyTarget.expectedRelocations || []).filter((record) => record.section === '.rel.pdr') : [],
      sourceSha256: sha256File(sourceFile),
      descriptor,
      model,
      row,
      rows,
    };
    target.compilerTextFunctions = resolveCompilerTextFunctions(
      target,
      relocationContract.compilerTextFunctions,
    );
    target.auxiliarySections = resolveAuxiliarySectionContracts(
      model,
      baserom,
      target,
      relocationContract.auxiliarySections,
    );
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

  validateNoActiveLinkSymbolShadows(targets, reviewedLinkage.linkSymbols);

  for (const key of reviewedLinkage.targets.keys()) {
    if (!usedCanonicalContracts.has(key)) fail(`matching-C linkage contract has no active target: ${reviewedLinkage.targets.get(key).symbol}`);
  }

  const rows = new Set();
  const symbols = new Set();
  const textSections = new Set();
  const auxiliarySections = new Set();
  const auxiliaryRows = new Set();
  for (const target of targets) {
    if (symbols.has(target.symbol.toLowerCase())) fail('active target list contains duplicate symbols');
    symbols.add(target.symbol.toLowerCase());
    for (const owner of target.textOwners) {
      if (rows.has(owner.rowIndex) || textSections.has(owner.sectionName)) {
        fail('active target list contains duplicate or ambiguous text owners');
      }
      rows.add(owner.rowIndex);
      textSections.add(owner.sectionName);
    }
    for (const auxiliary of target.auxiliarySections) {
      if (textSections.has(auxiliary.outputSection)
          || auxiliarySections.has(auxiliary.outputSection)
          || auxiliaryRows.has(auxiliary.ownerRowIndex)) {
        fail(`active auxiliary-section ownership collision: ${target.symbol} ${auxiliary.outputSection}`);
      }
      auxiliarySections.add(auxiliary.outputSection);
      auxiliaryRows.add(auxiliary.ownerRowIndex);
    }
  }
  validateAuxiliaryOwnerGroups(targets);
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
    multiOwnerConfig,
    multiOwnerConfigIdentity: {
      path: path.relative(ROOT, MULTI_OWNER_CONFIG_PATH).replace(/\\/g, '/'),
      bytes: fs.statSync(MULTI_OWNER_CONFIG_PATH).size,
      sha256: sha256File(MULTI_OWNER_CONFIG_PATH),
    },
    multiOwnerContracts,
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
  MULTI_OWNER_CONFIG_PATH,
  TOOLCHAIN_CONFIG_PATH,
  TOOLCHAIN_BUILD_PATH,
  loadActiveTargetModel,
  normalizeAuxiliaryRelocationRecords,
  normalizeAuxiliarySectionContracts,
  normalizeCompilerTextFunctions,
  normalizeRelocationRecords,
  parseNumber,
  resolveAcceptedRow,
  resolveAcceptedRows,
  resolveAuxiliarySectionContracts,
  resolveCompilerTextFunctions,
  safeRelative,
  selectRelocationContract,
  validateLinkageConfig,
  validateAuxiliaryOwnerGroups,
  validateMultiOwnerConfig,
  validateNoActiveLinkSymbolShadows,
  validateToolchainPin,
};
