'use strict';

// This mode conserves one native read-only section. It does not repartition
// accepted owners: complete payload rows replace ASM; v2 can include native padding.
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual: same } = require('util');
const { ROOT, sha256Buffer: hash, sha256File, parseElf32BigEndian, parseElfFile, elfSectionBytes } = require('./phase7_conventional');
const elfTools = require('./elf_text_split');
const SHA = /^[0-9A-F]{64}$/;
const SECTION = /^\.ob64\.r[0-9]+(?:\.s[0-9]+)?$/;
function fail(message) { throw new Error('auxiliary projection: ' + message); }
function keys(value, expected) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && same(Object.keys(value).sort(), [...expected].sort());
}
function integer(value, min = 0) { return Number.isSafeInteger(value) && value >= min && value <= 0xffffffff; }
function alignment(value) { return integer(value, 4) && value <= 16 && (value & (value - 1)) === 0; }
function payloads(contract) { return contract.segments.filter(segment => segment.kind === 'payload'); }
function entryBytes(segment, auxiliaries) {
  return auxiliaries.find(value => value.outputSection === segment.outputSection).entries * 4;
}
function groupContract(group) {
  if (!composed(group) || group.auxiliary?.projection?.schemaVersion !== 1) fail('group projection requires version 1');
  return normalize(group.auxiliary.projection, group.auxiliary.sections);
}
function normalize(contract, auxiliaries) {
  if (contract === undefined) return null;
  if (!keys(contract, ['schemaVersion', 'mode', 'compilerSection', 'bytes', 'alignment', 'expectedObjectSha256', 'segments'])
      || ![1, 2].includes(contract.schemaVersion) || contract.mode !== 'fixed-row-readonly-projection'
      || contract.compilerSection !== '.rodata' || !integer(contract.bytes, 4)
      || !alignment(contract.alignment) || contract.bytes % contract.alignment
      || !SHA.test(contract.expectedObjectSha256) || !Array.isArray(contract.segments)
      || !Array.isArray(auxiliaries)) fail('contract schema');
  let cursor = 0, count = 0;
  const sections = new Set(), labels = new Set();
  for (const segment of contract.segments) {
    const payload = segment && segment.kind === 'payload';
    const fields = payload ? ['kind', 'offset', 'bytes', 'outputSection', 'label', 'alignmentDirectives']
      : ['kind', 'offset', 'bytes', 'ownerSection', 'ownerOffset', 'ownerBytes', 'expectedOwnerSha256'];
    if (!keys(segment, fields) || !integer(segment.offset) || segment.offset !== cursor
        || !integer(segment.bytes, 4) || segment.bytes % 4 || cursor + segment.bytes > contract.bytes) fail('segment tiling');
    if (payload) {
      const auxiliary = auxiliaries[count++];
      if (!SECTION.test(segment.outputSection) || sections.has(segment.outputSection)
          || !/^\.L[0-9]+$/.test(segment.label) || labels.has(segment.label)
          || !Array.isArray(segment.alignmentDirectives) || !segment.alignmentDirectives.length
          || segment.alignmentDirectives.some(value => !integer(value) || value > 4)
          || !auxiliary || auxiliary.outputSection !== segment.outputSection || auxiliary.bytes !== segment.bytes
          || auxiliary.compilerSection !== contract.compilerSection || !integer(auxiliary.entries, 1)
          || auxiliary.entries * 4 + (contract.schemaVersion === 2 ? (auxiliary.trailingPaddingBytes || 0) : 0) !== segment.bytes
          || auxiliary.preservedTail !== null || auxiliary.preservedPrefix || auxiliary.preservedInteriorBefore
          || auxiliary.compilerOccurrences || auxiliary.sourceObjectPrefix || (contract.schemaVersion === 1 && auxiliary.trailingPaddingBytes)
          || (count === 1 && segment.offset !== 0)) fail('payload occurrence or complete-row contract');
      const occurrenceAlignment = Math.max(...segment.alignmentDirectives.map(value => 2 ** value));
      if (occurrenceAlignment !== contract.alignment || segment.offset % occurrenceAlignment
          || auxiliary.alignment !== occurrenceAlignment) fail('payload alignment');
      if (contract.schemaVersion === 2) {
        const padding = auxiliary.trailingPaddingBytes || 0;
        if (!integer(padding) || padding % 4 || (padding && padding !== (occurrenceAlignment - auxiliary.entries * 4 % occurrenceAlignment) % occurrenceAlignment)
            || auxiliary.expectedTrailingPaddingSha256 !== hash(Buffer.alloc(padding))) fail('payload native padding contract');
      }
      sections.add(segment.outputSection); labels.add(segment.label);
    } else if (segment.kind !== 'zero' || !SECTION.test(segment.ownerSection)
        || !integer(segment.ownerOffset) || segment.ownerOffset % 4 || !integer(segment.ownerBytes, 4)
        || segment.ownerOffset + segment.bytes > segment.ownerBytes
        || !SHA.test(segment.expectedOwnerSha256)) fail('check-only zero binding');
    cursor += segment.bytes;
  }
  if (cursor !== contract.bytes || count < 2 || count !== auxiliaries.length
      || contract.segments.some(segment => segment.kind === 'zero' && sections.has(segment.ownerSection))) fail('payload/zero census');
  const tables = payloads(contract);
  for (let i = 0; i < tables.length; i++) {
    const previousEnd = i ? tables[i - 1].offset + entryBytes(tables[i - 1], auxiliaries) : 0;
    if (tables[i].offset !== Math.ceil(previousEnd / contract.alignment) * contract.alignment) fail('non-native inter-occurrence padding');
  }
  const last = tables[tables.length - 1];
  // Terminal padding stays check-only in v2. Supporting an owned terminal pad
  // requires a separate reviewed extension, never dual C/ASM ownership.
  if (contract.schemaVersion === 2 && last.bytes !== entryBytes(last, auxiliaries)) fail('owned terminal padding unsupported');
  if (contract.bytes !== Math.ceil((last.offset + last.bytes) / contract.alignment) * contract.alignment) fail('non-native terminal padding');
  return structuredClone(contract);
}
function checkTarget(target) {
  const contract = normalize(target.auxiliaryProjection, target.auxiliarySections);
  if (!contract) return null;
  if (target.compilationGroup || target.compilationGroupId || target.nativeTextTail
      || (target.textOwners || []).length !== 1 || (target.compilerTextFunctions || []).length !== 1) fail('incompatible text producer');
  const first = target.auxiliarySections[0];
  for (const [index, segment] of payloads(contract).entries()) {
    const auxiliary = target.auxiliarySections[index];
    if (auxiliary.romStartNumber - first.romStartNumber !== segment.offset
        || auxiliary.vramStartNumber - first.vramStartNumber !== segment.offset
        || auxiliary.ownerSectionBytes !== segment.bytes || auxiliary.ownerPrefixBytes
        || auxiliary.ownerTailBytes || auxiliary.ownerRomStartNumber !== auxiliary.romStartNumber
        || (contract.schemaVersion === 2 && auxiliary.ownerTailBytes !== 0)
        || auxiliary.ownerRomEndNumber !== auxiliary.romEndNumber
        || auxiliary.ownerVramStartNumber !== auxiliary.vramStartNumber
        || auxiliary.ownerVramEndNumber !== auxiliary.vramEndNumber) fail('fixed payload row or ROM/RAM spacing');
  }
  return contract;
}
function retainedBindings(target, model, baserom) {
  if (target.compilationGroup?.auxiliary) groupContract(target.compilationGroup);
  const contract = composed(target.compilationGroup) ? groupContract(target.compilationGroup) : checkTarget(target);
  if (!contract) return [];
  const sections = composed(target.compilationGroup) ? target.compilationGroup.auxiliary.sections : target.auxiliarySections;
  const first = sections[0];
  const anchor = model.rows.flatMap(row => row.slices || []).find(slice => slice.sectionName === first.outputSection);
  if (!anchor) fail('missing anchor placement');
  for (const auxiliary of sections) {
    const rows = model.rows.filter(row => (row.slices || []).some(slice => slice.sectionName === auxiliary.outputSection));
    const slice = rows.length === 1 && rows[0].slices.length === 1 ? rows[0].slices[0] : null;
    if (!slice || slice.placementKind !== anchor.placementKind || slice.overlayDescriptorId !== anchor.overlayDescriptorId
        || slice.loadSlabId !== anchor.loadSlabId || slice.overlaySection !== anchor.overlaySection) fail('payload placement context');
  }
  return contract.segments.filter(segment => segment.kind === 'zero').map(segment => {
    const rows = model.rows.filter(row => (row.slices || []).some(slice => slice.sectionName === segment.ownerSection));
    if (rows.length !== 1) fail('retained original row census');
    const row = rows[0], slice = row.slices[0];
    if (row.inputKind !== 'tracked-assembly' || row.primaryClass !== 'data' || !row.part
        || row.slices.length !== 1 || slice.executable || slice.bytes !== row.bytes || row.bytes !== segment.ownerBytes
        || slice.sectionName !== segment.ownerSection || slice.romStart !== row.romStart
        || slice.romEndExclusive !== row.romEndExclusive || slice.vramEndExclusive - slice.vramStart !== row.bytes
        || slice.placementKind !== anchor.placementKind || slice.overlayDescriptorId !== anchor.overlayDescriptorId
        || slice.loadSlabId !== anchor.loadSlabId || slice.overlaySection !== anchor.overlaySection
        || row.romStart + segment.ownerOffset !== first.romStartNumber + segment.offset
        || slice.vramStart + segment.ownerOffset !== first.vramStartNumber + segment.offset) fail('retained original row or spacing');
    const original = path.resolve(ROOT, row.part.file);
    if (!original.startsWith(ROOT + path.sep) || !fs.existsSync(original) || sha256File(original) !== row.part.sha256) fail('retained original source identity');
    if (!Buffer.isBuffer(baserom) || row.romStart < 0 || row.romEndExclusive > baserom.length
        || !baserom.subarray(row.romStart, row.romEndExclusive).every(byte => byte === 0)
        || hash(baserom.subarray(row.romStart, row.romEndExclusive)) !== segment.expectedOwnerSha256) fail('complete retained original row bytes');
    return { ...segment, rowIndex: row.index, primaryId: row.primaryId, chunkIndex: row.part.chunkIndex,
      originalAssembly: row.part.file, originalAssemblySha256: row.part.sha256,
      romStart: row.romStart, romEndExclusive: row.romEndExclusive, vramStart: slice.vramStart,
      vramEndExclusive: slice.vramEndExclusive };
  });
}
function validateBindings(target, model, baserom) {
  const derived = retainedBindings(target, model, baserom);
  const recorded = composed(target.compilationGroup) ? target.compilationGroup.auxiliary.retained : target.auxiliaryProjectionRetained;
  if (!same(derived, recorded)) fail('retained binding evidence drift');
  return derived;
}
function validateCensus(targets) {
  for (const target of targets) if (target.compilationGroup?.auxiliary) groupContract(target.compilationGroup);
  for (const target of targets.filter(value => value.auxiliaryProjection || composed(value.compilationGroup))) {
    const contract = composed(target.compilationGroup) ? groupContract(target.compilationGroup) : checkTarget(target);
    if (composed(target.compilationGroup) && !same(target.auxiliarySections,
      target.symbol === target.compilationGroup.auxiliary.memberSymbol ? target.compilationGroup.auxiliary.sections : [])) fail('group auxiliary attribution census');
    for (const zero of contract.segments.filter(segment => segment.kind === 'zero')) {
      if (targets.some(value => (value.auxiliarySections || []).some(auxiliary => auxiliary.outputSection === zero.ownerSection)
          || (value.textOwners || []).some(owner => owner.sectionName === zero.ownerSection))) fail('check-only row also has a C owner');
    }
  }
}
function assembly(compiler, target, adjust) {
  const contract = checkTarget(target);
  const tables = payloads(contract);
  // Reuse the existing strict compiler grammar, with the native occurrence census.
  // No payload is emitted here and no instruction or operand is rewritten.
  let end = 0;
  const occurrences = tables.map((segment, index) => {
    const bytes = entryBytes(segment, target.auxiliarySections);
    const record = { label: segment.label, offset: hex(segment.offset), bytes, entries: bytes / 4,
      alignment: contract.alignment, alignmentDirectives: segment.alignmentDirectives,
      ...(segment.offset > end ? { paddingBefore: { offset: hex(end), bytes: segment.offset - end,
        expectedSha256: hash(Buffer.alloc(segment.offset - end)) } } : {}) };
    end = segment.offset + bytes;
    return record;
  });
  return adjust(compiler, target.sectionName, { auxiliarySections: [{ compilerSection: contract.compilerSection,
    outputSection: tables[0].outputSection, bytes: end, compilerOccurrences: occurrences }] });
}
function hex(value) { return '0x' + value.toString(16).toUpperCase().padStart(8, '0'); }
function project(input, target) {
  const contract = checkTarget(target), tables = payloads(contract);
  if (!Array.isArray(target.auxiliaryProjectionRetained)
      || target.auxiliaryProjectionRetained.length !== contract.segments.filter(segment => segment.kind === 'zero').length) fail('missing retained bindings');
  for (const [index, segment] of contract.segments.filter(value => value.kind === 'zero').entries()) {
    const record = target.auxiliaryProjectionRetained[index];
    const row = target.model?.rows.find(value => value.index === record?.rowIndex);
    if (!record || !row || Object.entries(segment).some(([key, value]) => !same(record[key], value))
        || record.primaryId !== row.primaryId || record.chunkIndex !== row.part?.chunkIndex
        || record.originalAssembly !== row.part?.file || record.originalAssemblySha256 !== row.part?.sha256
        || record.ownerBytes !== row.bytes || record.romStart !== row.romStart || record.romEndExclusive !== row.romEndExclusive
        || row.slices.length !== 1 || row.slices[0].sectionName !== record.ownerSection
        || record.vramStart !== row.slices[0].vramStart || record.vramEndExclusive !== row.slices[0].vramEndExclusive
        || sha256File(path.join(ROOT, record.originalAssembly)) !== record.originalAssemblySha256) fail('retained source/model authentication');
  }
  const parsed = elfTools.parseRelocatable(input), elf = parseElf32BigEndian(input);
  const sourceMatches = parsed.sections.filter(section => section.name === tables[0].outputSection);
  if (sourceMatches.length !== 1) fail('raw read-only section census');
  const source = sourceMatches[0], raw = elfTools.sectionBytes(input, source);
  if (source.type !== 1 || source.flags !== 2 || source.address !== 0 || source.size !== contract.bytes
      || source.alignment !== contract.alignment || hash(raw) !== contract.expectedObjectSha256) fail('raw read-only section identity');
  const text = parsed.sections.filter(section => section.name === target.sectionName);
  if (text.length !== 1 || text[0].type !== 1 || text[0].flags !== 6 || text[0].size !== target.bytes) fail('raw text owner');
  const allowed = new Set([target.sectionName, source.name, '.reginfo']);
  for (const section of parsed.sections) {
    if (section.size && ((section.flags & 1) || ((section.flags & 2) && !allowed.has(section.name)))) fail('unexpected raw allocation');
    if (section.name === '.reginfo' && (section.type !== 0x70000006 || section.flags !== 2 || section.size !== 24)) fail('reginfo shape');
    if (section.type === 4) fail('RELA is unsupported');
  }
  const symbols = elf.symbols;
  if (parsed.sections.filter(section => section.type === 2).length !== 1) fail('symbol table census');
  const names = new Set();
  for (const section of parsed.sections) {
    if (names.has(section.name)) fail('duplicate section');
    names.add(section.name);
  }
  const markers = symbols.filter(symbol => symbol.name === 'gcc2_compiled.');
  const marker = markers[0];
  // The parser exposes the complete st_other byte as visibility, including
  // reserved bits. This compiler marker is metadata, never a relocation target.
  if (markers.length !== 1 || marker.symbolType !== 1 || marker.binding !== 0
      || marker.value !== 0 || marker.size !== 0 || marker.visibility !== 0
      || parsed.sections[marker.sectionIndex]?.name !== '.text'
      || parsed.sections[marker.sectionIndex].size !== 0) fail('compiler marker metadata');
  for (const symbol of symbols) {
    if (symbol.sectionIndex > 0 && symbol.sectionIndex < 0xff00 && symbol.symbolType !== 3
        && !(symbol.name === target.symbol && symbol.sectionIndex === text[0].index
          && symbol.symbolType === 2 && symbol.binding === 1 && symbol.value === 0 && symbol.size === target.bytes)
        && symbol !== marker) fail('unexpected allocated symbol');
    if (symbol.sectionIndex === 0xfff1 && symbol.symbolType !== 4) fail('unexpected absolute symbol');
  }
  const anchors = symbols.filter(symbol => symbol.sectionIndex === source.index);
  if (anchors.length !== 1 || anchors[0].symbolType !== 3 || anchors[0].binding !== 0
      || anchors[0].value !== 0 || anchors[0].size !== 0 || anchors[0].visibility !== 0) fail('raw section-symbol anchor or unexpected auxiliary symbol');
  if (symbols.some(symbol => symbol.sectionIndex === 0xfff2)) fail('COMMON symbols are unsupported');
  for (const segment of contract.segments) {
    if (segment.kind === 'zero' && !raw.subarray(segment.offset, segment.offset + segment.bytes).equals(Buffer.alloc(segment.bytes))) fail('nonzero native padding');
    if (segment.kind === 'payload' && !raw.subarray(segment.offset + entryBytes(segment, target.auxiliarySections), segment.offset + segment.bytes).every(byte => byte === 0)) fail('nonzero owned native padding');
  }
  const relocationSections = parsed.sections.filter(section => section.info === source.index && section.type === 9);
  if (relocationSections.length !== 1) fail('raw relocation census');
  const relocation = relocationSections[0];
  if (relocation.name !== '.rel' + source.name || relocation.entrySize !== 8 || relocation.size % 8) fail('raw relocation shape');
  const groups = new Map(tables.map(segment => [segment.outputSection, []]));
  const nativeRelocations = [];
  const seen = new Set();
  for (let cursor = 0; cursor < relocation.size; cursor += 8) {
    const entry = Buffer.from(input.subarray(relocation.offset + cursor, relocation.offset + cursor + 8));
    const place = entry.readUInt32BE(0), info = entry.readUInt32BE(4), symbol = symbols[info >>> 8];
    const segment = tables.find(value => place >= value.offset && place + 4 <= value.offset + entryBytes(value, target.auxiliarySections));
    if (!segment || place % 4 || seen.has(place) || (info & 255) !== 2 || !symbol
        || symbol.symbolType !== 3 || symbol.sectionIndex !== text[0].index || symbol.value !== 0
        || symbol.binding !== 0 || symbol.size !== 0 || symbol.visibility !== 0) fail('unmapped, crossing, duplicate or unsupported raw relocation');
    seen.add(place);
    const auxiliary = target.auxiliarySections.find(value => value.outputSection === segment.outputSection);
    const expected = auxiliary.expectedRelocations.find(value => parseInt(value.offset, 16) === place - segment.offset);
    if (!expected || parseInt(expected.addend, 16) !== raw.readUInt32BE(place) || raw.readUInt32BE(place) >= target.bytes) fail('native table addend');
    nativeRelocations.push({ place, info, addend: raw.readUInt32BE(place) });
    entry.writeUInt32BE(place - segment.offset, 0);
    groups.get(segment.outputSection).push(entry);
  }
  if (seen.size !== tables.reduce((sum, segment) => sum + entryBytes(segment, target.auxiliarySections) / 4, 0)) fail('missing payload relocation');
  // Inspect every relocation section, including discarded metadata. References to
  // the raw anchor must resolve into payloads using the unchanged encoded addend.
  const references = [];
  for (const rel of parsed.sections.filter(section => section.type === 9)) {
    if (rel.entrySize !== 8 || rel.size % 8 || rel.link !== relocation.link) fail('relocation table census');
    const owner = parsed.sections[rel.info];
    if (!owner) fail('relocation owner');
    let pending = [];
    for (let cursor = 0; cursor < rel.size; cursor += 8) {
      const place = input.readUInt32BE(rel.offset + cursor), info = input.readUInt32BE(rel.offset + cursor + 4);
      const symbol = symbols[info >>> 8], type = info & 255;
      if (!symbol || place % 4 || place + 4 > owner.size) fail('relocation place or symbol');
      if (symbol === marker) fail('reference to compiler marker');
      if (parsed.sections[symbol.sectionIndex]?.name === '.reginfo') fail('reference to discarded reginfo');
      if (symbol.sectionIndex !== source.index) continue;
      if (owner.index !== text[0].index || symbol !== anchors[0] || ![5, 6].includes(type)) fail('unsupported reference to auxiliary anchor');
      const word = input.readUInt32BE(owner.offset + place);
      if (type === 5) { pending.push({ place, info, immediate: word & 0xffff }); continue; }
      if (!pending.length) fail('unpaired auxiliary LO16');
      const low = (word << 16) >> 16;
      for (const high of pending) {
        const addend = ((high.immediate << 16) + low) >>> 0;
        if (!tables.some(segment => addend >= segment.offset && addend + 4 <= segment.offset + entryBytes(segment, target.auxiliarySections))) fail('reference into padding or outside native payloads');
        references.push({ highPlace: high.place, highInfo: high.info, lowPlace: place, lowInfo: info, addend });
      }
      pending = [];
    }
    if (pending.length) fail('unpaired auxiliary HI16');
  }
  const owners = tables.map(segment => ({ sectionName: segment.outputSection, bytes: segment.bytes,
    logicalOffset: segment.offset, logicalEnd: segment.offset + segment.bytes, alignment: contract.alignment }));
  for (const owner of owners.slice(1)) if (parsed.sections.some(section => section.name === owner.sectionName)) fail('projected destination already exists');
  const grouped = new Map([...groups].map(([name, entries]) => [name, Buffer.concat(entries)]));
  const list = elfTools.buildSectionList(parsed, input, source, relocation, owners, grouped);
  elfTools.rewriteSymbolTables(list, source, owners);
  elfTools.rewriteSectionReferences(list, relocation);
  const shstr = elfTools.rebuildSectionNames(list, parsed.shstrIndex);
  const buffer = elfTools.serialize(input, parsed, list, shstr);
  const projected = parseElf32BigEndian(buffer);
  for (const segment of tables) {
    const section = projected.sections.find(value => value.name === segment.outputSection);
    if (!section || !Buffer.from(elfSectionBytes(projected, section)).equals(raw.subarray(segment.offset, segment.offset + segment.bytes))) fail('projection changed payload');
  }
  return { buffer, evidence: { schemaVersion: contract.schemaVersion, contract, retained: target.auxiliaryProjectionRetained,
    ...(contract.schemaVersion === 2 ? { payloadSlices: tables.map(segment => ({ outputSection: segment.outputSection,
      offset: segment.offset, bytes: segment.bytes, entryBytes: entryBytes(segment, target.auxiliarySections),
      paddingBytes: segment.bytes - entryBytes(segment, target.auxiliarySections),
      nativeSha256: hash(raw.subarray(segment.offset, segment.offset + segment.bytes)),
      paddingSha256: hash(raw.subarray(segment.offset + entryBytes(segment, target.auxiliarySections), segment.offset + segment.bytes)) })) } : {}),
    implementationSha256: sha256File(__filename),
    nativeSections: parsed.sections.map(section => ({ name: section.name, type: section.type, flags: section.flags,
      bytes: section.size, alignment: section.alignment, entrySize: section.entrySize, link: section.link, info: section.info,
      sha256: hash(elfTools.sectionBytes(input, section)) })),
    nativeSymbols: symbols,
    nativeRelocationSections: parsed.sections.filter(section => section.type === 9).map(section => ({
      name: section.name, owner: parsed.sections[section.info].name, symbolTable: section.link,
      entries: Array.from({ length: section.size / 8 }, (_, index) => ({
        place: input.readUInt32BE(section.offset + index * 8), info: input.readUInt32BE(section.offset + index * 8 + 4) })) })),
    nativeObjectSha256: hash(input), projectedObjectSha256: hash(buffer),
    nativeSectionSha256: hash(raw), nativeRelocations, references,
    payloadBytes: tables.reduce((sum, segment) => sum + segment.bytes, 0),
    checkOnlyBytes: contract.bytes - tables.reduce((sum, segment) => sum + segment.bytes, 0) } };
}
function linkedEvidence(target, root, context) {
  const bindings = validateBindings(target, target.model, context.canonicalBaserom);
  const lines = context.mapText.split(/\r?\n/);
  return bindings.map(binding => {
    const sections = context.elf.sections.filter(section => section.name === binding.ownerSection);
    const objectPath = 'objects/assembly/chunk_' + String(binding.chunkIndex).padStart(3, '0') + '.o';
    const object = parseElfFile(path.join(root, objectPath));
    const originals = object.sections.filter(section => section.name === binding.ownerSection);
    if (sections.length !== 1 || originals.length !== 1) fail('retained section census');
    const section = sections[0], original = originals[0];
    if (section.type !== 1 || section.flags !== 2 || section.address !== binding.vramStart || section.size !== binding.ownerBytes
        || original.type !== 1 || original.flags !== 2 || original.size !== binding.ownerBytes || original.address !== 0
        || hash(Buffer.from(elfSectionBytes(object, original))) !== binding.expectedOwnerSha256
        || hash(Buffer.from(elfSectionBytes(context.elf, section))) !== binding.expectedOwnerSha256
        || object.sections.some(rel => [4, 9].includes(rel.type) && rel.info === original.index && rel.size)) fail('retained full ASM object or linked bytes');
    const start = lines.findIndex(line => line.startsWith(binding.ownerSection + ' '));
    if (start < 0) fail('retained map section missing');
    let end = start + 1;
    while (end < lines.length && !/^[.\/][^\s]*\s/.test(lines[end])) end++;
    const block = lines.slice(start, end);
    const contributions = block.map(line => {
      const match = /^\s+(\.[\w.]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+2\*\*(\d+)\s+(.+)$/i.exec(line);
      return match ? { section: match[1], address: parseInt(match[2], 16), bytes: parseInt(match[3], 16),
        object: match[6].trim().replace(/^elf32-bigmips\s+/, '').replace(/\(overhead \d+ bytes\)$/, '').replace(/\\/g, '/') } : null;
    }).filter(value => value && value.bytes);
    if (contributions.length !== 1 || contributions[0].section !== binding.ownerSection
        || contributions[0].address !== binding.vramStart || contributions[0].bytes !== binding.ownerBytes
        || contributions[0].object !== objectPath || block.some(line => /\*fill\*/.test(line))) fail('retained sole ASM contribution');
    const loads = context.elf.programHeaders.filter(load => load.type === 1 && load.vaddr === binding.vramStart
      && load.paddr === binding.romStart && load.fileSize === binding.ownerBytes && load.memorySize === binding.ownerBytes && load.flags === 4);
    if (loads.length !== 1) fail('retained load mapping');
    return { ...binding, objectPath, objectSha256: sha256File(path.join(root, objectPath)), loadIndex: loads[0].index,
      contributionCount: 1, fullRowExact: true };
  });
}
module.exports = { normalize, checkTarget, retainedBindings, validateBindings, validateCensus, assembly, project, linkedEvidence };

function composed(group) { return group?.mode === 'native-text-readonly-owner-projection'; }
function assertCompleteGroupRows(group) {
  if (!composed(group)) fail('group mode');
  const contract = groupContract(group);
  const first = group.auxiliary.sections[0];
  for (const [index, table] of payloads(contract).entries()) {
    const section = group.auxiliary.sections[index];
    if (section.ownerSectionBytes !== section.bytes || section.ownerPrefixBytes || section.ownerTailBytes
        || section.romStartNumber !== section.ownerRomStartNumber || section.romEndNumber !== section.ownerRomEndNumber
        || section.vramStartNumber !== section.ownerVramStartNumber || section.vramEndNumber !== section.ownerVramEndNumber
        || section.romStartNumber - first.romStartNumber !== table.offset
        || section.vramStartNumber - first.vramStartNumber !== table.offset) fail('group complete payload rows/spacing');
  }
}
function groupGrammar(compiler, group, adjust) {
  if (!composed(group)) fail('missing composed producer mode');
  const contract = groupContract(group);
  let end = 0;
  const occurrences = payloads(contract).map(segment => {
    const occurrence = { label: segment.label, offset: hex(segment.offset), bytes: segment.bytes, entries: segment.bytes / 4,
      alignment: contract.alignment, alignmentDirectives: segment.alignmentDirectives,
      ...(segment.offset > end ? { paddingBefore: { offset: hex(end), bytes: segment.offset - end,
        expectedSha256: hash(Buffer.alloc(segment.offset - end)) } } : {}) };
    end = segment.offset + segment.bytes;
    return occurrence;
  });
  // Grammar validation only: the returned section-assigned bytes are discarded.
  // The producer's actual assembler input is the untouched compiler buffer.
  adjust(compiler, group.owners[0].sectionName, { auxiliarySections: [{ compilerSection: '.rodata',
    outputSection: payloads(contract)[0].outputSection, bytes: end, compilerOccurrences: occurrences }] });
}
function groupReadonlyNames(group, stage) {
  groupContract(group);
  return ['raw', 'text-projected'].includes(stage) ? ['.rodata'] : group.auxiliary.sections.map(value => value.outputSection);
}
function groupCensus(elf, group, stage) {
  if (!composed(group)) fail('missing composed producer');
  const contract = groupContract(group);
  assertCompleteGroupRows(group);
  if (contract.bytes > elf.buffer.length) fail('group read-only footprint exceeds object');
  const zeroSegments = contract.segments.filter(value => value.kind === 'zero');
  if (!Array.isArray(group.auxiliary.retained) || group.auxiliary.retained.length !== zeroSegments.length) fail('group retained binding census');
  for (const [index, zero] of zeroSegments.entries()) {
    const record = group.auxiliary.retained[index];
    if (!record || Object.entries(zero).some(([key, value]) => !same(record[key], value))
        || typeof record.originalAssembly !== 'string' || path.isAbsolute(record.originalAssembly)
        || record.originalAssembly.split(/[\\/]/).includes('..')
        || sha256File(path.join(ROOT, record.originalAssembly)) !== record.originalAssemblySha256) fail('group retained source binding');
  }
  const tables = payloads(contract), native = ['raw', 'text-projected'].includes(stage);
  const attributed = group.functions.find(value => value.symbol === group.auxiliary.memberSymbol);
  if (!attributed) fail('group auxiliary attribution');
  const textNames = stage === 'raw' ? ['.text'] : group.owners.map(owner => owner.sectionName);
  const textOffset = section => stage === 'raw' ? (section?.name === '.text' ? 0 : null)
    : (group.owners.find(owner => owner.sectionName === section?.name)?.groupOffset ?? null);
  const textAnchor = elf.sections.find(section => section.name === textNames[0]);
  const roNames = groupReadonlyNames(group, stage);
  const roSections = roNames.map(name => {
    const matches = elf.sections.filter(section => section.name === name);
    if (matches.length !== 1) fail('group read-only section census');
    return matches[0];
  });
  const rawBytes = Buffer.alloc(contract.bytes);
  for (const [index, section] of roSections.entries()) {
    const bytes = native ? contract.bytes : tables[index].bytes;
    if (section.type !== 1 || section.flags !== 2 || section.address !== 0 || section.size !== bytes
        || section.alignment !== contract.alignment) fail('group read-only shape');
    Buffer.from(elfSectionBytes(elf, section)).copy(rawBytes, native ? 0 : tables[index].offset);
  }
  if (hash(rawBytes) !== contract.expectedObjectSha256) fail('group native read-only identity');
  for (const segment of contract.segments.filter(value => value.kind === 'zero')) {
    if (!rawBytes.subarray(segment.offset, segment.offset + segment.bytes).every(byte => byte === 0)) fail('group native padding');
  }
  const roAnchor = roSections[0];
  const symbols = elf.symbols.filter(symbol => roSections.some(section => section.index === symbol.sectionIndex));
  const anchorSymbol = symbols.find(symbol => symbol.sectionIndex === roAnchor.index);
  // Pinned objcopy materializes one ordinary section symbol for each output
  // section. Only the preserved first symbol is allowed to anchor references.
  if (!anchorSymbol || symbols.length !== (stage === 'stripped' ? roSections.length : 1)
      || symbols.some(symbol => symbol.symbolType !== 3 || symbol.name !== '' || symbol.value || symbol.size || symbol.binding || symbol.visibility)
      || roSections.some(section => symbols.filter(symbol => symbol.sectionIndex === section.index).length !==
        (stage === 'stripped' || section.index === roAnchor.index ? 1 : 0))) fail('group read-only anchor/symbol census');
  const relocations = require('./compilation_groups').relocations(elf);
  const tableRelocations = [], references = [], places = new Set();
  for (const relocation of relocations.filter(value => roSections.some(section => section.index === value.owner.index))) {
    const ownerIndex = roSections.findIndex(section => section.index === relocation.owner.index);
    const offset = relocation.place + (native ? 0 : tables[ownerIndex].offset);
    const table = tables.find(value => offset >= value.offset && offset + 4 <= value.offset + value.bytes);
    const symbol = relocation.symbol;
    if (!table || offset % 4 || places.has(offset) || relocation.type !== 2 || symbol.sectionIndex !== textAnchor?.index
        || symbol.symbolType !== 3 || symbol.name !== '' || symbol.value || symbol.size || symbol.binding || symbol.visibility) fail('group table relocation place/anchor');
    places.add(offset);
    const word = rawBytes.readUInt32BE(offset);
    if (word < attributed.offset || word + 4 > attributed.offset + attributed.bytes) fail('group table target outside attributed function');
    const auxiliary = group.auxiliary.sections.find(value => value.outputSection === table.outputSection);
    const expected = auxiliary.expectedRelocations.find(value => Number(value.offset) === offset - table.offset);
    if (!expected || Number(expected.addend) !== word) fail('group table relocation addend');
    tableRelocations.push({ offset, type: 2, symbol: '.text', symbolValue: 0, word });
  }
  if (places.size !== tables.reduce((sum, table) => sum + table.bytes / 4, 0)) fail('group table relocation census');
  const marker = elf.symbols.filter(symbol => symbol.name === 'gcc2_compiled.');
  if (marker.length !== 1 || marker[0].symbolType !== 1 || marker[0].binding || marker[0].value || marker[0].size
      || marker[0].visibility || marker[0].sectionIndex !== textAnchor?.index) fail('group compiler marker');
  const pending = new Map();
  const sourceMember = relocation => {
    const start = textOffset(relocation.owner);
    const position = start === null ? null : start + relocation.place;
    return position === null ? null : group.functions.findIndex(value => position >= value.offset && position + 4 <= value.offset + value.bytes);
  };
  const inspectReference = (relocation, addend) => {
    const destination = elf.sections[relocation.symbol.sectionIndex], destinationOffset = textOffset(destination);
    if (destination?.index === roAnchor.index) {
      if (relocation.symbol !== anchorSymbol || sourceMember(relocation) !== group.functions.indexOf(attributed)
          || !tables.some(table => addend >= table.offset && addend + 4 <= table.offset + table.bytes)) fail('group auxiliary reference attribution/padding');
      references.push({ ownerOffset: textOffset(relocation.owner), place: relocation.place, type: relocation.type, addend });
    } else if (destinationOffset !== null) {
      const targetOffset = destinationOffset + relocation.symbol.value + addend;
      if (!group.functions.some(value => targetOffset >= value.offset && targetOffset < value.offset + value.bytes)) fail('group reference into text tail/outside functions');
    } else if (roSections.some(section => section.index === destination?.index)) fail('group non-first read-only anchor');
  };
  for (const relocation of relocations) {
    if (relocation.symbol === marker[0]) fail('group incoming compiler-marker reference');
    if (roSections.some(section => section.index === relocation.owner.index)) continue;
    if (relocation.place % 4 || relocation.place + 4 > relocation.owner.size) fail('group relocation place');
    const word = elf.buffer.readUInt32BE(relocation.owner.offset + relocation.place);
    const key = relocation.symbol.symbolTableIndex + ':' + relocation.symbol.symbolIndex;
    if (relocation.type === 5) {
      if (!pending.has(key)) pending.set(key, []);
      pending.get(key).push({ relocation, high: word & 0xffff });
    } else if (relocation.type === 6) {
      const highs = pending.get(key);
      if (!highs?.length) fail('group unmatched LO16');
      for (const high of highs) {
        if (high.relocation.owner.index !== relocation.owner.index || sourceMember(high.relocation) !== sourceMember(relocation)) fail('group cross-owner HI16/LO16');
        inspectReference(relocation, ((high.high << 16) + ((word << 16) >> 16)) >>> 0);
      }
      pending.delete(key);
    } else if ([2, 4].includes(relocation.type)) {
      inspectReference(relocation, relocation.type === 2 ? word : (word & 0x03ffffff) * 4);
    } else fail('group unsupported relocation type');
  }
  if (pending.size) fail('group unmatched HI16');
  return { nativeSha256: hash(rawBytes), payloadBytes: tables.reduce((sum, table) => sum + table.bytes, 0),
    tableRelocations, references, marker: { name: marker[0].name, value: marker[0].value, size: marker[0].size,
      binding: marker[0].binding, symbolType: marker[0].symbolType, visibility: marker[0].visibility,
      section: textAnchor.name } };
}
// Compare every section outside the RO transform by semantic section references.
// Relocation r_info values, symbols and encoded words are conserved; only section
// indices and file offsets may change as the section table grows.
function conservedOutsideReadonly(elf, group) {
  groupContract(group);
  const omitted = new Set(['.rodata', '.rel.rodata', '.shstrtab', ...group.auxiliary.sections.flatMap(value => [value.outputSection, '.rel' + value.outputSection])]);
  const sectionName = index => index > 0 && index < 0xff00 ? elf.sections[index]?.name : index;
  const symbols = elf.symbols.map(symbol => ({ ...symbol, symbolTableIndex: sectionName(symbol.symbolTableIndex),
    sectionIndex: sectionName(symbol.sectionIndex) === group.auxiliary.sections[0].outputSection ? '.rodata' : sectionName(symbol.sectionIndex) }));
  const sections = elf.sections.filter(section => !omitted.has(section.name)).map(section => ({ name: section.name,
    type: section.type, flags: section.flags, address: section.address, bytes: section.size, alignment: section.alignment,
    entrySize: section.entrySize, link: sectionName(section.link), info: section.type === 9 ? sectionName(section.info) : section.info,
    sha256: section.type === 2 ? null : hash(Buffer.from(elfSectionBytes(elf, section))) }));
  return { flags: elf.header.flags, sections, symbols };
}
function projectGroupReadonly(input, group) {
  groupContract(group);
  const before = parseElf32BigEndian(input);
  require('./compilation_groups').validateObject(before, group, 'text-projected');
  const parsed = elfTools.parseRelocatable(input), source = parsed.sections.find(section => section.name === '.rodata');
  const rels = parsed.sections.filter(section => section.type === 9 && section.info === source.index);
  if (rels.length !== 1 || rels[0].name !== '.rel.rodata') fail('group read-only relocation section');
  const relocation = rels[0], tables = payloads(group.auxiliary.projection);
  const owners = tables.map(table => ({ sectionName: table.outputSection, bytes: table.bytes,
    logicalOffset: table.offset, logicalEnd: table.offset + table.bytes, alignment: group.auxiliary.projection.alignment }));
  if (owners.some(owner => parsed.sections.some(section => section.name === owner.sectionName))) fail('group duplicate projected destination');
  const grouped = new Map(owners.map(owner => [owner.sectionName, []]));
  for (let offset = 0; offset < relocation.size; offset += 8) {
    const record = Buffer.from(input.subarray(relocation.offset + offset, relocation.offset + offset + 8));
    const place = record.readUInt32BE(0), owner = owners.find(value => place >= value.logicalOffset && place + 4 <= value.logicalEnd);
    if (!owner) fail('group unmapped read-only relocation');
    record.writeUInt32BE(place - owner.logicalOffset, 0); grouped.get(owner.sectionName).push(record);
  }
  const list = elfTools.buildSectionList(parsed, input, source, relocation, owners,
    new Map([...grouped].map(([name, entries]) => [name, Buffer.concat(entries)])));
  elfTools.rewriteSymbolTables(list, source, owners); elfTools.rewriteSectionReferences(list, relocation);
  const shstr = elfTools.rebuildSectionNames(list, parsed.shstrIndex);
  const buffer = elfTools.serialize(input, parsed, list, shstr), after = parseElf32BigEndian(buffer);
  require('./compilation_groups').validateObject(after, group, 'projected');
  if (!same(conservedOutsideReadonly(before, group), conservedOutsideReadonly(after, group))) fail('read-only projection changed prior text/metadata/symbol/relocation evidence');
  return { buffer };
}
function completeObjectCensus(elf) {
  return { header: elf.header, sections: elf.sections.map(section => ({ name: section.name, type: section.type,
    flags: section.flags, address: section.address, size: section.size, alignment: section.alignment,
    entrySize: section.entrySize, link: section.link, info: section.info,
    sha256: hash(Buffer.from(elfSectionBytes(elf, section))) })), symbols: elf.symbols,
    relocations: require('./compilation_groups').relocations(elf).map(relocation => ({ owner: relocation.owner.name,
      place: relocation.place, type: relocation.type, symbol: relocation.symbol,
      word: elf.buffer.readUInt32BE(relocation.owner.offset + relocation.place) })) };
}
Object.assign(module.exports, { composed, groupContract, assertCompleteGroupRows, groupGrammar, groupReadonlyNames, groupCensus, projectGroupReadonly, conservedOutsideReadonly, completeObjectCensus });
