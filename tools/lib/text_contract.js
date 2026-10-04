'use strict';
const auxiliaryProjection = require('./auxiliary_projection');
const preparedLink = require('./prepared_link_view');

const fs = require('fs');
const path = require('path');
const { parseElfFile, parseElf32BigEndian, elfSectionBytes, sha256Buffer } = require('./phase7_conventional');

const NATIVE_SYMBOL = 'func_00204A70';
const TAIL_SHA256 = 'DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119';
const NATIVE_SHAPE = Object.freeze({ type: 1, flags: 6, alignment: 16, bytes: 1136 });
let objectMemo = null;
const derivedInputs = new WeakMap();
const artifactSnapshots = new WeakMap();
function freezeEvidence(value) {
  if (!value || typeof value !== 'object' || Buffer.isBuffer(value)) return value;
  for (const child of Object.values(value)) freezeEvidence(child);
  return Object.freeze(value);
}
// Enabled only around one synchronous focused diff. Every lookup still reads
// and authenticates the actual artifacts; no report or disk cache can seed it.
function withObjectEvidenceMemo(callback) {
  const previous = objectMemo;
  objectMemo = new Map();
  try { return callback(); } finally { objectMemo = previous; }
}
function objectInputs(evidence) {
  const inputs = derivedInputs.get(evidence);
  if (!inputs) fail('object input provenance is unavailable');
  // Keep parsed metadata immutable and backing buffers private. Consumers get
  // their own buffers, so mutation cannot poison a later memo lookup.
  return Object.fromEntries(['raw', 'stripped'].map(role => [role,
    Object.freeze({ ...inputs[role], buffer: Buffer.from(inputs[role].buffer) })]));
}
function snapshotBinding(target) {
  const excluded = new Set(['model', 'row', 'rows', 'descriptor', 'multiOwnerContract']);
  const value = Object.fromEntries(Object.entries(target).filter(([key]) => !excluded.has(key)));
  if (value.textOwners) value.textOwners = value.textOwners.map(({ row, ...owner }) => owner);
  return hash(value);
}
function withObjectArtifactSnapshot(target, root, artifactFiles, callback) {
  if (target.compilationGroup) fail('group artifact snapshot is unsupported');
  const symbol = target.symbol;
  const paths = {
    compilationInput: target.source,
    compilerAssembly: 'generated/c/' + symbol + '.compiler.s',
    assemblerInput: 'generated/c/' + symbol + '.s',
    rawObject: 'objects/c/' + symbol + '.source-object.o',
    strippedObject: 'objects/c/' + symbol + '.o',
    unsplitAssemblerObject: target.auxiliaryProjection || textOwners(target).length > 1
      ? 'objects/c/' + symbol + '.assembler-object.o' : null,
  };
  const artifacts = {}, buffers = {};
  const { confinedArtifactContents } = require('./current_workflow');
  for (const [role, relative] of Object.entries(paths)) {
    if (relative === null) { artifacts[role] = null; continue; }
    const value = artifactFiles
      ? confinedArtifactContents(path.dirname(artifactFiles[role]), path.basename(artifactFiles[role]), 'text evidence artifact')
      : confinedArtifactContents(root, relative, 'text evidence artifact');
    artifacts[role] = { path: relative, bytes: value.bytes, sha256: value.sha256 };
    buffers[role] = value.contents;
  }
  const snapshot = Object.freeze({});
  artifactSnapshots.set(snapshot, { target, binding: snapshotBinding(target), artifacts, buffers });
  try { return callback(snapshot); } finally { artifactSnapshots.delete(snapshot); }
}
function capturedArtifacts(snapshot, target = null) {
  const state = artifactSnapshots.get(snapshot);
  if (!state || (target && (state.target !== target || state.binding !== snapshotBinding(target)))) fail('inactive or foreign artifact snapshot');
  return state;
}
function objectArtifactBytes(snapshot) {
  return Object.fromEntries(Object.entries(capturedArtifacts(snapshot).buffers).map(([role, bytes]) => [role, Buffer.from(bytes)]));
}
function fail(message) { throw new Error('text contract: ' + message); }
function exactKeys(value, keys) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).sort().join('\0') === [...keys].sort().join('\0');
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}
function same(left, right) { return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right)); }
function hash(value) { return sha256Buffer(Buffer.from(JSON.stringify(canonical(value)))); }
function nativeDescriptor() {
  return {
    schemaVersion: 1, ownerRowIndex: 3806, inputSection: '.text', outputSection: '.ob64.r3806',
    inputShape: { ...NATIVE_SHAPE }, outputShape: { ...NATIVE_SHAPE }, functionBytes: 1132,
    tail: { ownerRowIndex: 3806, offset: 1132, bytes: 4, fillByte: 0, sha256: TAIL_SHA256, origin: 'native-assembler-section-alignment' },
  };
}
function normalizeNativeTextTail(value, symbol) {
  if (value === undefined) return null;
  const expected = nativeDescriptor();
  if (symbol !== NATIVE_SYMBOL || !exactKeys(value, Object.keys(expected))
      || !exactKeys(value.inputShape, Object.keys(NATIVE_SHAPE))
      || !exactKeys(value.outputShape, Object.keys(NATIVE_SHAPE))
      || !exactKeys(value.tail, Object.keys(expected.tail)) || !same(value, expected)) {
    fail('malformed or unapproved native descriptor: ' + symbol);
  }
  return expected;
}
function textOwners(target) {
  return target.textOwners && target.textOwners.length ? target.textOwners : [{
    rowIndex: target.rowIndex, primaryId: target.primaryId, logicalOffset: 0, sectionName: target.sectionName,
    bytes: target.bytes, romStartNumber: target.romStartNumber, romEndNumber: target.romEndNumber,
    vramStartNumber: target.vramStartNumber, vramEndNumber: target.vramStartNumber + target.bytes,
    expectedTextSha256: target.expectedTextSha256, originalAssemblySha256: target.originalAssemblySha256,
  }];
}
function resolveTextContract(target) {
  if (target.compilationGroup) return require('./compilation_groups').contract(target);
  const native = target.nativeTextTail ? normalizeNativeTextTail(target.nativeTextTail, target.symbol) : null;
  const owners = textOwners(target);
  if (native && (owners.length !== 1 || target.rowIndex !== 3806 || target.sectionName !== native.outputSection
      || target.bytes !== 1136 || target.romStartNumber !== 0x204A70 || target.romEndNumber !== 0x204EE0
      || target.vramStartNumber !== 0x801C15E0 || (target.auxiliarySections || []).length !== 0
      || owners[0].rowIndex !== 3806 || owners[0].bytes !== 1136 || owners[0].logicalOffset !== 0
      || owners[0].sectionName !== native.outputSection || owners[0].romStartNumber !== target.romStartNumber
      || owners[0].romEndNumber !== target.romEndNumber || owners[0].vramStartNumber !== target.vramStartNumber
      || owners[0].vramEndNumber !== 0x801C1A50 || target.primaryId !== 'primary:da514fae97a92a6fa267'
      || target.expectedTextSha256 !== '0720D5C20E46D217D6F4E8003699170F64C505364375AF6FC6B6E9F05C77D4F4')) {
    fail('native descriptor does not bind the accepted owner');
  }
  return {
    schemaVersion: 1, mode: native ? 'native-text-tail' : 'section-assigned',
    owners: owners.map((owner) => ({
      rowIndex: owner.rowIndex, primaryId: owner.primaryId, logicalOffset: owner.logicalOffset,
      inputSection: native ? native.inputSection : owner.sectionName, outputSection: owner.sectionName,
      bytes: owner.bytes, romStart: owner.romStartNumber, romEndExclusive: owner.romEndNumber,
      vramStart: owner.vramStartNumber, vramEndExclusive: owner.vramEndNumber,
      expectedLinkedSha256: owner.expectedTextSha256 || target.expectedTextSha256,
      originalAssemblySha256: owner.originalAssemblySha256 || target.originalAssemblySha256,
      expectedInputShape: { type: 1, flags: 6, alignment: native ? 16 : null, bytes: owner.bytes },
      expectedOutputShape: { type: 1, flags: 6, alignment: native ? 16 : null, bytes: owner.bytes },
    })),
    compilerTextFunctions: native ? [{ symbol: target.symbol, offset: 0, bytes: 1132, binding: 1, symbolType: 2, visibility: 0 }]
      : (target.compilerTextFunctions || []).map((record) => ({
        symbol: record.symbol, offset: record.offsetNumber, bytes: record.bytes,
        binding: record.binding === 'LOCAL' ? 0 : 1, symbolType: 2, visibility: 0,
      })),
    tail: native ? native.tail : null,
  };
}
function bindWorkbenchTarget(session, target) {
  if (target.compilationGroup || (session?.context?.phase8?.targets || []).some(entry => entry.symbol === target.symbol && entry.compilationGroup)) {
    fail('group workbench requires a complete group candidate; use canonical diff with the group source');
  }
  const matches = (session?.context?.phase8?.targets || []).filter((entry) => entry.symbol === target.symbol && entry.nativeTextTail);
  if (matches.length === 0) {
    if (target.nativeTextTail) fail('workbench native descriptor is not active');
    return target;
  }
  if (matches.length !== 1) fail('workbench native owner is ambiguous');
  const accepted = matches[0];
  if (accepted.sectionName !== target.sectionName || accepted.bytes !== target.bytes
      || accepted.romStartNumber !== target.romStart || accepted.vramStartNumber !== target.vramStart) fail('workbench native placement drift');
  resolveTextContract(accepted);
  return { ...accepted, ...target, nativeTextTail: accepted.nativeTextTail, textOwners: accepted.textOwners,
    compilerTextFunctions: accepted.compilerTextFunctions, auxiliarySections: accepted.auxiliarySections };
}
function inputTarget(target) {
  if (!target.nativeTextTail) return target;
  resolveTextContract(target);
  return { ...target, sectionName: '.text', textOwners: textOwners(target).map((owner) => ({ ...owner, sectionName: '.text' })) };
}
function inputSection(target, outputSection) { return target.nativeTextTail ? '.text' : outputSection; }
function assemblerInput(compilerBytes, target, adjust, options = {}) {
  if (target.auxiliaryProjection) {
    if (options.allowAuxiliaryReadOnlySections || options.legalizeCop1BinaryInstructions) fail("projection cannot use scratch allowances");
    return auxiliaryProjection.assembly(compilerBytes, target, adjust);
  }
  if (target.compilationGroup) {
    if (auxiliaryProjection.composed(target.compilationGroup)) {
      if (options.allowAuxiliaryReadOnlySections || options.legalizeCop1BinaryInstructions) fail('composed group scratch allowance');
      auxiliaryProjection.groupGrammar(compilerBytes, target.compilationGroup, adjust);
      return Buffer.from(compilerBytes);
    }
    if (options.allowAuxiliaryReadOnlySections || options.legalizeCop1BinaryInstructions || options.auxiliarySections?.length) fail('group assembly allowances');
    adjust(compilerBytes, target.sectionName, {});
    return Buffer.from(compilerBytes);
  }
  if (!target.nativeTextTail) return adjust(compilerBytes, target.sectionName, options);
  resolveTextContract(target);
  if (options.allowAuxiliaryReadOnlySections || options.legalizeCop1BinaryInstructions || (options.auxiliarySections || []).length) {
    fail('native mode cannot use scratch or auxiliary assembly allowances');
  }
  // The ordinary grammar check rejects extra sections and malformed directives.
  adjust(compilerBytes, target.sectionName, {});
  return Buffer.from(compilerBytes);
}
function artifact(root, relative) {
  const { confinedArtifactIdentity } = require('./current_workflow');
  const value = confinedArtifactIdentity(root, relative, 'text evidence artifact');
  return { path: relative, bytes: value.bytes, sha256: value.sha256 };
}
function shape(section) { return { type: section.type, flags: section.flags, alignment: section.alignment, bytes: section.size }; }
function functionCensus(elf, sections, linked = false) {
  return elf.symbols.filter((symbol) => symbol.symbolType === 2 && sections.some((section) => section.index === symbol.sectionIndex))
    .map((symbol) => {
      const section = sections.find((candidate) => candidate.index === symbol.sectionIndex);
      return { symbol: symbol.name, offset: symbol.value - (linked ? section.address : 0), bytes: symbol.size,
        binding: symbol.binding, symbolType: symbol.symbolType, visibility: symbol.visibility };
    }).sort((a, b) => a.offset - b.offset || a.symbol.localeCompare(b.symbol));
}
function ownerEvidence(elf, contract, linked = false) {
  return contract.owners.map((owner) => {
    const name = linked ? owner.outputSection : owner.inputSection;
    const matches = elf.sections.filter((section) => section.name === name);
    const expected = linked ? owner.expectedOutputShape : owner.expectedInputShape;
    if (matches.length !== 1) fail('section census: ' + name);
    const section = matches[0];
    if (section.type !== expected.type || section.flags !== expected.flags || section.size !== expected.bytes
        || section.alignment < 4 || (expected.alignment !== null && section.alignment !== expected.alignment)
        || (!linked && section.address !== 0) || (linked && section.address !== owner.vramStart)) fail('section shape: ' + name);
    const bytes = Buffer.from(elfSectionBytes(elf, section));
    return { section, bytes, record: { sectionName: name, ...shape(section), sha256: sha256Buffer(bytes) } };
  });
}
function tailEvidence(contract, records, relocations) {
  if (!contract.tail) return null;
  const tail = contract.tail, bytes = records[0].bytes.subarray(tail.offset, tail.offset + tail.bytes);
  if (bytes.length !== tail.bytes || !bytes.equals(Buffer.alloc(tail.bytes)) || sha256Buffer(bytes) !== tail.sha256
      || relocations.some((r) => { const off = typeof r.offset === 'string' ? Number(r.offset) : r.offset; return off < tail.offset + tail.bytes && off + 4 > tail.offset; })) {
    fail('tail bytes or relocation drift');
  }
  return { ...tail };
}
function nativeObjectAllocationEvidence(elf, allowReginfo = true) {
  // COMMON has no allocated section until ld assigns storage. Include the MIPS variants.
  const commonSymbols = elf.symbols.filter(symbol => [0xFFF2, 0xFF00, 0xFF03].includes(symbol.sectionIndex))
    .map(symbol => ({ symbol: symbol.name, bytes: symbol.size, alignment: symbol.value, sectionIndex: symbol.sectionIndex }));
  if (commonSymbols.some(symbol => symbol.bytes !== 0)) fail('native nonzero COMMON storage');
  const extras = elf.sections.filter(section => section.size > 0 && (section.flags & 2) !== 0
    && section.name !== '.text' && !(allowReginfo && section.name === '.reginfo'
      && section.type === 0x70000006 && section.flags === 2));
  if (extras.length) fail('native uncontracted allocated section');
  const writableSections = elf.sections.filter(section => (section.flags & 1) !== 0);
  if (writableSections.some(section => section.size !== 0)) fail('native nonempty writable section');
  return { commonSymbols, writableSections: writableSections.map(section => ({ sectionName: section.name, ...shape(section) })) };
}

function nativeLinkedAllocationEvidence(target, elf, mapText) {
  const model = target.model;
  if (!model || !Array.isArray(model.slices) || !Array.isArray(model.overlays)) fail('native linked allocation model missing');
  const expected = new Map(model.slices.map(slice => [slice.sectionName, {
    type: 1, flags: slice.executable ? 6 : 2, address: slice.vramStart, bytes: slice.bytes,
    load: { vaddr: slice.vramStart, paddr: slice.romStart, fileSize: slice.bytes, memorySize: slice.bytes, flags: slice.executable ? 5 : 4 },
  }]));
  for (const overlay of model.overlays.filter(value => value.bss_end_exclusive > value.bss_start)) {
    const bytes = overlay.bss_end_exclusive - overlay.bss_start;
    expected.set(`.ob64.overlay${String(overlay.descriptor_id).padStart(2, '0')}.bss`, {
      type: 8, flags: 3, address: overlay.bss_start, bytes,
      load: { vaddr: overlay.bss_start, paddr: overlay.bss_start, fileSize: 0, memorySize: bytes, flags: 6 },
    });
  }
  const empty = new Map([['.bss', { type: 8, flags: 3 }], ['.data', { type: 1, flags: 3 }], ['.text', { type: 1, flags: 6 }]]);
  const seen = new Set(), emptySections = [];
  for (const section of elf.sections.filter(value => (value.flags & 2) !== 0 || (value.flags & 1) !== 0)) {
    if (seen.has(section.name)) fail('native linked allocation duplicate section');
    seen.add(section.name);
    const accepted = expected.get(section.name);
    if (accepted) {
      if (section.type !== accepted.type || section.flags !== accepted.flags
          || section.address !== accepted.address || section.size !== accepted.bytes) fail('native linked allocation shape: ' + section.name);
    } else {
      const allowed = empty.get(section.name);
      if (!allowed || section.type !== allowed.type || section.flags !== allowed.flags || section.address !== 0
          || section.size !== 0 || section.alignment !== 16) fail('native unexpected writable or allocated output: ' + section.name);
      emptySections.push({ sectionName: section.name, address: section.address, ...shape(section) });
    }
  }
  for (const name of expected.keys()) if (!seen.has(name)) fail('native linked allocation missing section: ' + name);
  if (!seen.has('.bss')) fail('native empty BSS placement missing');
  if (elf.symbols.some(symbol => [0xFFF2, 0xFF00, 0xFF03].includes(symbol.sectionIndex) && symbol.size !== 0)) fail('native linked COMMON storage');
  const loadRecord = load => ({ vaddr: load.vaddr, paddr: load.paddr, fileSize: load.fileSize, memorySize: load.memorySize, flags: load.flags });
  const sortLoads = loads => loads.map(load => JSON.stringify(loadRecord(load))).sort();
  const loads = elf.programHeaders.filter(load => load.type === 1);
  if (!same(sortLoads(loads), sortLoads([...expected.values()].map(value => value.load)))) fail('native linked load census drift');
  const objectPath = require('./compilation_groups').objectPath(target);
  const mapBlock = preparedLink.mapBlock(mapText, '.bss', 'any', false, true);
  if (!mapBlock || !/^\.bss\s+0+\s+0+\s+0+\s+2\*\*4\s+alloc\s*$/.test(mapBlock[0])) fail('native empty BSS map shape');
  const block = mapBlock.slice(1).filter(line => line.trim());
  const emptySelectors = (target.nativeEmptyBssObjects || [objectPath]).map(value => 'from ' + value + '(.bss)');
  if (!same(block.map(line => line.trim().replace(/\\/g, '/')), emptySelectors)) fail('native empty BSS object selector');
  return { schemaVersion: 1, emptyWritablePlacement: { objectPath, inputSection: '.bss', outputSection: '.bss', address: 0, bytes: 0 },
    emptySections, allocatedSectionCount: seen.size, loadCount: loads.length, loadCensusSha256: hash(sortLoads(loads)),
    unexpectedAllocationCount: 0, unexpectedLoadCount: 0 };
}
function deriveObjectEvidence(target, root, artifactFiles = null) {
  if (target.compilationGroup) return require('./compilation_groups').evidence(target, root, artifactFiles);
  return withObjectArtifactSnapshot(target, root, artifactFiles, snapshot => deriveObjectEvidenceFromSnapshot(target, snapshot));
}
function deriveObjectEvidenceFromSnapshot(target, snapshot) {
  const { artifacts, buffers } = capturedArtifacts(snapshot, target);
  const contract = resolveTextContract(target), native = Boolean(target.nativeTextTail);
  // Projection also authenticates retained model bindings; leave that uncommon
  // path fresh rather than memoizing a partial projection/model contract.
  const memoKey = objectMemo && !target.auxiliaryProjection
    ? hash({ target: require('./diff_object_cache').projectTargetContract(target), contract, artifacts }) : null;
  if (memoKey && objectMemo.has(memoKey)) return objectMemo.get(memoKey);
  const { adjustSectionAssembly, relocationRecords, rawRelocationRecords } = require('./phase8_matching_c');
  const compiler = buffers.compilerAssembly;
  const input = buffers.assemblerInput;
  if (!assemblerInput(compiler, target, adjustSectionAssembly, { auxiliarySections: target.auxiliarySections || [] }).equals(input)) fail('assembler input provenance');
  const raw = parseElf32BigEndian(buffers.rawObject), stripped = parseElf32BigEndian(buffers.strippedObject);
  if (sha256Buffer(compiler) !== artifacts.compilerAssembly.sha256
      || sha256Buffer(input) !== artifacts.assemblerInput.sha256
      || sha256Buffer(raw.buffer) !== artifacts.rawObject.sha256
      || sha256Buffer(stripped.buffer) !== artifacts.strippedObject.sha256) fail('object inputs changed during derivation');
  let projectionEvidence = null;
  if (target.auxiliaryProjection) {
    const result = auxiliaryProjection.project(buffers.unsplitAssemblerObject, target);
    if (!result.buffer.equals(buffers.rawObject)) fail("auxiliary raw-to-projected reconstruction");
    projectionEvidence = result.evidence;
  }
  const allocation = native ? { raw: nativeObjectAllocationEvidence(raw), stripped: nativeObjectAllocationEvidence(stripped, false) } : null;
  const rawOwners = ownerEvidence(raw, contract), strippedOwners = ownerEvidence(stripped, contract);
  if (!same(rawOwners.map((r) => r.record), strippedOwners.map((r) => r.record))) fail('ancillary removal changed owners');
  const rawFunctions = functionCensus(raw, rawOwners.map((r) => r.section)), strippedFunctions = functionCensus(stripped, strippedOwners.map((r) => r.section));
  if (!same(rawFunctions, strippedFunctions)) fail('ancillary removal changed functions');
  if (native && (!same(rawFunctions, contract.compilerTextFunctions) || raw.symbols.filter((s) => s.symbolType === 2).length !== 1
      || stripped.symbols.filter((s) => s.symbolType === 2).length !== 1)) fail('native complete function census');
  const normalizedRelocations = relocationRecords(raw, inputTarget(target));
  if (!same(normalizedRelocations, relocationRecords(stripped, inputTarget(target)))) fail('ancillary removal changed relocations');
  const rawRelocations = rawRelocationRecords(raw);
  const loadSections = new Set([...contract.owners.map((owner) => '.rel' + owner.inputSection), ...(target.auxiliarySections || []).map((section) => '.rel' + section.outputSection)]);
  const tail = tailEvidence(contract, rawOwners, normalizedRelocations);
  tailEvidence(contract, strippedOwners, normalizedRelocations);
  const evidence = { schemaVersion: projectionEvidence ? (projectionEvidence.schemaVersion === 2 ? 6 : 4) : native ? 2 : 1, ...(native ? { allocation } : {}),
    ...(projectionEvidence ? { auxiliaryProjection: projectionEvidence } : {}), textContractSha256: hash(contract), artifacts,
    rawOwners: rawOwners.map((r) => r.record), strippedOwners: strippedOwners.map((r) => r.record), rawFunctions, strippedFunctions,
    rawRelocations: rawRelocations.filter((r) => loadSections.has(r.section)), normalizedRelocations,
    discardedAncillaryRelocations: rawRelocations.filter((r) => !loadSections.has(r.section)), tail,
    assemblyMode: native ? 'untouched-native-text' : 'section-assigned', compilerAssemblyRewritten: false };
  freezeEvidence(evidence);
  derivedInputs.set(evidence, { raw: freezeEvidence(raw), stripped: freezeEvidence(stripped) });
  if (memoKey) objectMemo.set(memoKey, evidence);
  return evidence;
}

function linkContext(root, canonicalBaserom, elf = null) {
  return preparedLink.linkContext(root, canonicalBaserom, elf);
}
function deriveLinkEvidence(target, root, canonicalBaserom) {
  return deriveLinkEvidenceFromObject(target, root, canonicalBaserom, deriveObjectEvidence(target, root));
}
// Private: evidence always comes from a fresh derivation in this invocation,
// never a report or a caller-supplied cached verdict.
function deriveLinkEvidenceFromObject(target, root, canonicalBaserom, objectEvidence) {
  const owned = Buffer.isBuffer(canonicalBaserom);
  const context = owned ? linkContext(root, canonicalBaserom) : canonicalBaserom;
  if (context.mapView) preparedLink.assertContext(context, root);
  canonicalBaserom = context.canonicalBaserom;
  const contract = resolveTextContract(target), elf = context.elf;
  const records = ownerEvidence(elf, contract, true);
  const mapText = context.mapView || context.mapText;
  const allocation = target.nativeTextTail || target.compilationGroup ? nativeLinkedAllocationEvidence(target, elf, mapText) : null;
  require('./phase8_matching_c').verifyTargetMapOwner(target, mapText);
  const objectPath = require('./compilation_groups').objectPath(target);
  const mapContributions = contract.owners.map((owner) => {
    const block = preparedLink.mapBlock(mapText, owner.outputSection, 'loose', true);
    if (!block) fail('map owner missing');
    const contributions = block.map((line) => {
      const match = /^\s+(\.[\w.]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+2\*\*(\d+)\s+(.+)$/i.exec(line);
      return match ? { inputSection: match[1], vramStart: parseInt(match[2], 16), bytes: parseInt(match[3], 16),
        alignment: 2 ** Number(match[5]), objectPath: match[6].trim().replace(/^elf32-bigmips\s+/, '').replace(/\(overhead \d+ bytes\)$/, '').replace(/\\/g, '/') } : null;
    }).filter(Boolean).filter((record) => record.bytes > 0);
    // Existing ordinary map checks remain authoritative for its established format.
    if ((contributions.length !== 1 || contributions[0].objectPath !== objectPath
        || contributions[0].inputSection !== owner.inputSection || contributions[0].bytes !== owner.bytes
        || contributions[0].vramStart !== owner.vramStart || contributions[0].alignment !== records.find((r) => r.section.name === owner.outputSection).section.alignment
        || block.some((line) => /\*fill\*|objects\/assembly\//.test(line)))) fail('map contribution drift');
    return { objectPath, inputSection: owner.inputSection, outputSection: owner.outputSection,
      vramStart: owner.vramStart, bytes: owner.bytes, alignment: records.find((r) => r.section.name === owner.outputSection).section.alignment,
      contributionCount: contributions.length, fillBytes: 0, fallbackContributionCount: 0 };
  });
  const owners = records.map((record, index) => {
    const owner = contract.owners[index];
    const loads = elf.programHeaders.filter((load) => load.type === 1 && load.vaddr === owner.vramStart
      && load.paddr === owner.romStart && load.fileSize === owner.bytes && load.memorySize === owner.bytes && load.flags === 5);
    if (loads.length !== 1) fail('owner load mapping');
    const retail = canonicalBaserom.subarray(owner.romStart, owner.romEndExclusive);
    return { ...record.record, vramStart: owner.vramStart, romStart: owner.romStart, bytes: owner.bytes,
      loadIndex: loads[0].index, expectedSha256: sha256Buffer(retail), rawBytesExact: record.bytes.equals(retail) };
  });
  const functions = functionCensus(elf, records.map((record) => record.section), true);
  if ((target.nativeTextTail || target.compilationGroup) && !same(functions, contract.compilerTextFunctions)) fail('linked native function census');
  const tail = tailEvidence(contract, records, objectEvidence.normalizedRelocations);
  if (tail && !records[0].bytes.subarray(tail.offset).equals(canonicalBaserom.subarray(target.romStartNumber + tail.offset, target.romEndNumber))) fail('linked retail tail mismatch');
  const rawElf = target.compilationGroup
    ? parseElfFile(path.join(root, objectEvidence.artifacts.rawObject.path))
    : objectInputs(objectEvidence).raw;
  const rawBytes = Buffer.concat(ownerEvidence(rawElf, contract).map(record => record.bytes));
  const linkedBytes = Buffer.concat(records.map(record => record.bytes));
  const retailBytes = Buffer.concat(contract.owners.map(owner => canonicalBaserom.subarray(owner.romStart, owner.romEndExclusive)));
  const offsets = new Set(objectEvidence.normalizedRelocations.map(record => Number(record.offset)));
  let unchangedWords = 0;
  for (let offset = 0; offset < rawBytes.length; offset += 4) {
    if (!offsets.has(offset)) {
      if (rawBytes.readUInt32BE(offset) !== linkedBytes.readUInt32BE(offset)) fail('nonrelocation instruction changed during link');
      unchangedWords++;
    }
  }
  const relocations = objectEvidence.normalizedRelocations.map(record => {
    const offset = Number(record.offset);
    if (!Number.isInteger(offset) || offset % 4 || offset < 0 || offset + 4 > linkedBytes.length) fail('linked relocation offset drift');
    return { ...record, rawWord: rawBytes.readUInt32BE(offset), linkedWord: linkedBytes.readUInt32BE(offset),
      expectedWord: retailBytes.readUInt32BE(offset), linkedWordExact: linkedBytes.readUInt32BE(offset) === retailBytes.readUInt32BE(offset) };
  });
  const result = { schemaVersion: target.nativeTextTail ? 2 : 1, ...(allocation ? { allocation } : {}),
    ...(target.auxiliaryProjection || auxiliaryProjection.composed(target.compilationGroup) ? { auxiliaryProjectionRetained: auxiliaryProjection.linkedEvidence(target, root, context) } : {}), textContractSha256: hash(contract), owners, mapContributions, functions,
    relocations, nonRelocationWordsUnchanged: unchangedWords, tail, fullOwnerExact: owners.every((owner) => owner.rawBytesExact) };
  for (const record of Object.values(objectEvidence.artifacts).filter(Boolean)) {
    if (!same(artifact(root, record.path), record)) fail('object artifact changed during linked evidence');
  }
  if (owned) preparedLink.finishLinkContext(context);
  return result;
}

function recordsForTarget(target, root, baserom) {
  const objectEvidence = deriveObjectEvidence(target, root);
  return { textContract: resolveTextContract(target), objectEvidence,
    ...(baserom ? { linkEvidence: deriveLinkEvidenceFromObject(target, root, baserom, objectEvidence) } : {}) };
}
function validateRecords(record, expected, label) {
  for (const key of Object.keys(expected)) {
    if (!record || !same(record[key], expected[key])) fail(label + ' ' + key + ' drift');
  }
}

module.exports = { NATIVE_SYMBOL, NATIVE_SHAPE, TAIL_SHA256, exactKeys, same, hash, nativeDescriptor,
  withObjectEvidenceMemo, objectInputs,
  withObjectArtifactSnapshot, objectArtifactBytes, deriveObjectEvidenceFromSnapshot,
  normalizeNativeTextTail, resolveTextContract, bindWorkbenchTarget, inputTarget, inputSection, assemblerInput, artifact, shape,
  linkContext, finishLinkContext: preparedLink.finishLinkContext, ownerEvidence, functionCensus, tailEvidence, nativeObjectAllocationEvidence, nativeLinkedAllocationEvidence,
  deriveObjectEvidence, deriveLinkEvidence, recordsForTarget, validateRecords };
