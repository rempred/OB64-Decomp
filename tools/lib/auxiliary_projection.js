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
function occurrenceMode(contract) { return contract?.schemaVersion === 6 && contract.mode === 'native-occurrence-readonly-projection'; }
function retainedSegments(contract) {
  return occurrenceMode(contract) ? contract.retainedRows.map(row => ({...row, kind:'retained', bytes:row.ownerBytes, ownerOffset:0}))
    : contract.segments.filter(segment => segment.kind === 'zero');
}
function payloads(contract) { return contract.segments.filter(segment => segment.kind === 'payload'); }
function entryBytes(segment, auxiliaries) {
  return auxiliaries.find(value => value.outputSection === segment.outputSection).entries * 4;
}
function rowBundle(group) { return ['native-text-readonly-owner-projection','native-text-readonly-interior-run-projection'].includes(group?.mode) && group.auxiliary?.projection?.schemaVersion === 5; }
function groupContract(group) {
  if (singleFragment(group)) return singleFragmentContract(group);
  if (fragmentMode(group)) return fragmentContract(group);
  if (rowBundle(group)) return bundleContract(group);
  if (!composed(group) || group.auxiliary?.projection?.schemaVersion !== 1) fail('group projection requires version 1');
  if (singleOwner(group)) require('./compilation_groups').singleOwnerContract(group);
  const bundle = group.auxiliary;
  if (!keys(bundle, ['sections', 'projection', ...(Object.hasOwn(bundle, 'retained') ? ['retained'] : [])])
      || !Array.isArray(bundle.sections) || !Array.isArray(group.members) || (singleOwner(group) ? group.members.length !== 1 : group.members.length < 2)
      || !Array.isArray(group.functions) || group.functions.length !== group.members.length) fail('group auxiliary attribution schema');
  for (const section of bundle.sections) {
    if (!section || typeof section.memberSymbol !== 'string'
        || group.members.filter(member => member.symbol === section.memberSymbol).length !== 1
        || group.functions.filter(member => member.symbol === section.memberSymbol).length !== 1) fail('group auxiliary attribution');
  }
  return normalizeContract(group.auxiliary.projection, group.auxiliary.sections, 1);
}
function memberSections(group, symbol) {
  groupContract(group);
  if (!group.members.some(member => member.symbol === symbol)) fail('unknown auxiliary member');
  return group.auxiliary.sections.filter(section => (rowBundle(group) ? payloads(group.auxiliary.projection).find(row => row.outputSection === section.outputSection).occurrences[0].memberSymbol : section.memberSymbol) === symbol);
}
function assertMemberSections(target) {
  if ((composed(target.compilationGroup) || fragmentLike(target.compilationGroup)) && !same(target.auxiliarySections, memberSections(target.compilationGroup, target.symbol))) fail('group auxiliary attribution census');
}
function normalize(contract, auxiliaries) {
  return normalizeContract(contract, auxiliaries, 2);
}
// Only groupContract can select the one-payload minimum, after composed context
// and member attribution checks. Standalone schemas retain their old minimum.
function normalizeContract(contract, auxiliaries, minimumPayloads) {
  if (contract === undefined) return null;
  if (!keys(contract, ['schemaVersion', 'mode', 'compilerSection', 'bytes', 'alignment', 'expectedObjectSha256', 'segments', ...(contract?.schemaVersion === 3 ? ['nativeText'] : []), ...(occurrenceMode(contract) ? ['retainedRows'] : [])])
      || ![1, 2, 3, 4, 6].includes(contract.schemaVersion) || (contract.schemaVersion === 6 ? !occurrenceMode(contract) : contract.mode !== 'fixed-row-readonly-projection')
      || contract.compilerSection !== '.rodata' || !integer(contract.bytes, 4)
      || !alignment(contract.alignment) || contract.bytes % contract.alignment
      || !SHA.test(contract.expectedObjectSha256) || !Array.isArray(contract.segments)
      || !Array.isArray(auxiliaries)) fail('contract schema');
  if (contract.schemaVersion === 3) {
    const text = contract.nativeText, tail = text?.terminal;
    if (!keys(text, ['bytes', 'alignment', 'outputAlignment', 'terminal'])
        || !integer(text.bytes, 4) || !alignment(text.alignment) || !alignment(text.outputAlignment)
        || text.outputAlignment > text.alignment || text.bytes % text.alignment
        || !keys(tail, ['offset', 'bytes', 'sha256', 'origin']) || !integer(tail.offset, 4) || tail.offset % 4
        || !integer(tail.bytes) || tail.bytes % 4 || tail.bytes >= text.alignment
        || text.bytes !== tail.offset + tail.bytes || text.bytes !== Math.ceil(tail.offset / text.alignment) * text.alignment
        || tail.sha256 !== hash(Buffer.alloc(tail.bytes)) || tail.origin !== 'native-assembler-section-alignment') fail('native text terminal contract');
  }
  if (occurrenceMode(contract)) {
    if (!Array.isArray(contract.retainedRows)) fail('occurrence retained row census');
    let previousEnd=0; const names=new Set();
    for(const row of contract.retainedRows) {
      if(!keys(row,['offset','ownerSection','ownerBytes','expectedOwnerSha256']) || !integer(row.offset,4) || row.offset%4
        || !integer(row.ownerBytes,4) || row.ownerBytes%4 || !SECTION.test(row.ownerSection) || names.has(row.ownerSection)
        || !SHA.test(row.expectedOwnerSha256) || row.offset<previousEnd) fail('occurrence retained row schema/order');
      names.add(row.ownerSection); previousEnd=row.offset+row.ownerBytes;
    }
  }
  let cursor = 0, count = 0;
  const sections = new Set(), labels = new Set();
  for (const segment of contract.segments) {
    if (occurrenceMode(contract) && segment?.kind !== 'payload') fail('occurrence native padding unsupported');
    const payload = segment && segment.kind === 'payload';
    const fields = payload ? ['kind', 'offset', 'bytes', 'outputSection', ...(contract.schemaVersion === 4 ? ['occurrences'] : ['label', 'alignmentDirectives']), ...(contract.schemaVersion === 3 ? ['dispatchSymbol'] : [])]
      : ['kind', 'offset', 'bytes', 'ownerSection', 'ownerOffset', 'ownerBytes', 'expectedOwnerSha256'];
    if (!keys(segment, fields) || !integer(segment.offset) || segment.offset !== cursor
        || !integer(segment.bytes, 4) || segment.bytes % 4 || cursor + segment.bytes > contract.bytes) fail('segment tiling');
    if (payload) {
      const auxiliary = auxiliaries[count++];
      if (contract.schemaVersion === 4) {
        if (!Array.isArray(segment.occurrences) || !segment.occurrences.length) fail('row bundle occurrence census');
        let end = segment.offset;
        for (const occurrence of segment.occurrences) {
          if (!keys(occurrence, ['label', 'offset', 'bytes', 'alignmentDirectives']) || !/^\.L[0-9]+$/.test(occurrence.label)
              || labels.has(occurrence.label) || occurrence.offset !== end || !integer(occurrence.bytes, 4) || occurrence.bytes % 4
              || !Array.isArray(occurrence.alignmentDirectives) || !occurrence.alignmentDirectives.length
              || occurrence.alignmentDirectives.some(value => !integer(value) || value > 4)
              || Math.max(...occurrence.alignmentDirectives.map(value => 2 ** value)) !== contract.alignment
              || occurrence.offset % contract.alignment) fail('row bundle occurrence partition/directives');
          labels.add(occurrence.label); end += occurrence.bytes;
        }
        if (!auxiliary || end !== segment.offset + auxiliary.entries * 4) fail('row bundle entry coverage');
      }
      if (contract.schemaVersion === 3 && (typeof segment.dispatchSymbol !== 'string'
          || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(segment.dispatchSymbol))) fail('payload dispatch symbol');
      if (!SECTION.test(segment.outputSection) || sections.has(segment.outputSection)
          || (contract.schemaVersion !== 4 && (!/^\.L[0-9]+$/.test(segment.label) || labels.has(segment.label)
          || !Array.isArray(segment.alignmentDirectives) || !segment.alignmentDirectives.length
          || segment.alignmentDirectives.some(value => !integer(value) || value > 4)))
          || !auxiliary || auxiliary.outputSection !== segment.outputSection || auxiliary.bytes !== segment.bytes
          || auxiliary.compilerSection !== contract.compilerSection || !integer(auxiliary.entries, 1)
          || auxiliary.entries * 4 + ([2, 4].includes(contract.schemaVersion) ? (auxiliary.trailingPaddingBytes || 0) : 0) !== segment.bytes
          || (!occurrenceMode(contract) && auxiliary.preservedTail !== null) || auxiliary.preservedPrefix || auxiliary.preservedInteriorBefore
          || auxiliary.compilerOccurrences || auxiliary.sourceObjectPrefix || (![2, 4].includes(contract.schemaVersion) && auxiliary.trailingPaddingBytes)
          || (count === 1 && segment.offset !== 0)) fail('payload occurrence or complete-row contract');
      const occurrenceAlignment = contract.schemaVersion === 4 ? contract.alignment : Math.max(...segment.alignmentDirectives.map(value => 2 ** value));
      if (occurrenceAlignment !== contract.alignment || segment.offset % occurrenceAlignment
          || auxiliary.alignment !== occurrenceAlignment) fail('payload alignment');
      if ([2, 4].includes(contract.schemaVersion)) {
        const padding = auxiliary.trailingPaddingBytes || 0;
        if (!integer(padding) || padding % 4 || (padding && padding !== (occurrenceAlignment - auxiliary.entries * 4 % occurrenceAlignment) % occurrenceAlignment)
            || auxiliary.expectedTrailingPaddingSha256 !== hash(Buffer.alloc(padding))) fail('payload native padding contract');
      }
      sections.add(segment.outputSection); if (contract.schemaVersion !== 4) labels.add(segment.label);
    } else if (segment.kind !== 'zero' || !SECTION.test(segment.ownerSection)
        || !integer(segment.ownerOffset) || segment.ownerOffset % 4 || !integer(segment.ownerBytes, 4)
        || segment.ownerOffset + segment.bytes > segment.ownerBytes
        || !SHA.test(segment.expectedOwnerSha256)) fail('check-only zero binding');
    cursor += segment.bytes;
  }
  if (cursor !== contract.bytes || count < minimumPayloads || count !== auxiliaries.length
      || contract.segments.some(segment => segment.kind === 'zero' && sections.has(segment.ownerSection))) fail('payload/zero census');
  const tables = payloads(contract);
  if(occurrenceMode(contract) && contract.retainedRows.some(row=>sections.has(row.ownerSection))) fail('retained row also payload');
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
function checkTarget(target, assemblySource = null) {
  const contract = normalize(target.auxiliaryProjection, target.auxiliarySections);
  if (!contract) return null;
  if (contract.schemaVersion === 4) require('./atomic_owner_union').authenticate(target);
  if (target.compilationGroup || target.compilationGroupId || target.nativeTextTail
      || (contract.schemaVersion === 4 ? !target.atomicText : (target.textOwners || []).length !== 1)
      || (contract.schemaVersion === 3 ? (target.compilerTextFunctions || []).length < 2 : (target.compilerTextFunctions || []).length !== 1)) fail('incompatible text producer');
  if (contract.schemaVersion === 3) {
    if (!target.model || !target.rows || target.rows.length !== 1
        || contract.nativeText.terminal.offset !== target.bytes || target.bytes % contract.nativeText.outputAlignment
        || target.vramStartNumber % contract.nativeText.outputAlignment
        || !target.compilerTextFunctions.slice(1).some(fn => fn.entryEvidence === 'reviewed-local-body')) fail('native multi-function owner contract');
    const row = target.rows[0], slice = row.slices?.[0], owner = target.textOwners[0];
    if (!slice || row.slices.length !== 1 || !slice.executable || target.bytes !== row.bytes
        || target.rowIndex !== row.index || target.sectionName !== slice.sectionName
        || target.romStartNumber !== row.romStart || target.romEndNumber !== row.romEndExclusive
        || target.vramStartNumber !== slice.vramStart || owner.rowIndex !== row.index
        || owner.sectionName !== slice.sectionName || owner.bytes !== row.bytes || owner.logicalOffset !== 0
        || owner.romStartNumber !== row.romStart || owner.romEndNumber !== row.romEndExclusive
        || owner.vramStartNumber !== slice.vramStart || owner.vramEndNumber !== slice.vramEndExclusive) fail('native text selected-owner placement');
    const logical = require('./logical_functions');
    const rom = fs.readFileSync(path.join(ROOT, 'build/baserom.us_rev0.z64'));
    const registry = logical.loadRegistry(target.model, rom, undefined, assemblySource);
    logical.assertActivationCompatible(registry, target.symbol, target.rows, target.compilerTextFunctions, assemblySource);
    if (!same(target.reviewedLocalBodyRegistryIdentity, registry.identity)) fail('native multi-function registry identity drift');
    for (const table of payloads(contract)) {
      const matches = target.compilerTextFunctions.filter(fn => fn.symbol === table.dispatchSymbol);
      if (matches.length !== 1) fail('payload dispatch function census');
    }
  }
  if(occurrenceMode(contract)) {
    const row=target.rows?.[0],owner=target.textOwners[0],slice=row?.slices?.[0];
    if(target.atomicText || target.rows?.length!==1 || row?.retainedPadding || row?.slices?.length!==1 || !slice?.executable
      || row.bytes!==target.bytes || owner.logicalOffset!==0 || owner.bytes!==row.bytes || owner.rowIndex!==row.index
      || target.sectionName!==slice.sectionName || target.romStartNumber!==row.romStart || target.romEndNumber!==row.romEndExclusive
      || target.vramStartNumber!==slice.vramStart || target.vramEndNumber!==slice.vramEndExclusive) fail('occurrence complete ordinary text owner');
  }
  const first = target.auxiliarySections[0];
  for (const [index, segment] of payloads(contract).entries()) {
    const auxiliary = target.auxiliarySections[index];
    if (occurrenceMode(contract)) {
      if(auxiliary.ownerPrefixBytes || auxiliary.ownerRomStartNumber!==auxiliary.romStartNumber
        || auxiliary.ownerVramStartNumber!==auxiliary.vramStartNumber || auxiliary.ownerSectionBytes!==auxiliary.bytes+auxiliary.ownerTailBytes
        || auxiliary.ownerRomEndNumber!==auxiliary.romEndNumber+auxiliary.ownerTailBytes
        || auxiliary.ownerVramEndNumber!==auxiliary.vramEndNumber+auxiliary.ownerTailBytes
        || Boolean(auxiliary.ownerTailBytes)!==Boolean(auxiliary.preservedTail)
        || index===0 && auxiliary.ownerTailBytes) fail('occurrence owner prefix/tail');
      const delta=auxiliary.romStartNumber-first.romStartNumber-segment.offset;
      if(delta!==auxiliary.vramStartNumber-first.vramStartNumber-segment.offset || !integer(delta) || delta%4
        || delta>=first.bytes || index===0 && delta!==0) fail('occurrence bounded anchor placement');
      if(index) {
        const previous=target.auxiliarySections[index-1];
        let cursor=previous.ownerRomEndNumber-first.romStartNumber;
        const end=auxiliary.romStartNumber-first.romStartNumber;
        for(const row of contract.retainedRows.filter(row=>row.offset>=cursor && row.offset<end)) {
          if(row.offset!==cursor) fail('occurrence retained row gap'); cursor+=row.ownerBytes;
        }
        if(cursor!==end) fail('occurrence retail partition');
      }
      continue;
    }
    if (auxiliary.romStartNumber - first.romStartNumber !== segment.offset
        || auxiliary.vramStartNumber - first.vramStartNumber !== segment.offset
        || auxiliary.ownerSectionBytes !== segment.bytes || auxiliary.ownerPrefixBytes
        || auxiliary.ownerTailBytes || auxiliary.ownerRomStartNumber !== auxiliary.romStartNumber
        || (contract.schemaVersion === 2 && auxiliary.ownerTailBytes !== 0)
        || auxiliary.ownerRomEndNumber !== auxiliary.romEndNumber
        || auxiliary.ownerVramStartNumber !== auxiliary.vramStartNumber
        || auxiliary.ownerVramEndNumber !== auxiliary.vramEndNumber) fail('fixed payload row or ROM/RAM spacing');
  }
  if(occurrenceMode(contract)) for(const row of contract.retainedRows) {
    if(!target.auxiliarySections.slice(1).some((aux,index)=>row.offset>=target.auxiliarySections[index].ownerRomEndNumber-first.romStartNumber
      && row.offset+row.ownerBytes<=aux.romStartNumber-first.romStartNumber)) fail('extraneous retained row');
  }
  return contract;
}
function retainedBindings(target, model, baserom, assemblySource = null) {
  if (target.compilationGroup?.auxiliary) groupContract(target.compilationGroup);
  const contract = composed(target.compilationGroup) ? groupContract(target.compilationGroup) : checkTarget(target, assemblySource);
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
  return retainedSegments(contract).map(segment => {
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
        || (!occurrenceMode(contract) && !baserom.subarray(row.romStart, row.romEndExclusive).every(byte => byte === 0))
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
function validateCensus(targets, assemblySource = null) {
  for (const target of targets) if (target.compilationGroup?.auxiliary) groupContract(target.compilationGroup);
  for (const target of targets.filter(value => value.auxiliaryProjection || composed(value.compilationGroup))) {
    const contract = composed(target.compilationGroup) ? groupContract(target.compilationGroup) : checkTarget(target, assemblySource);
    if (composed(target.compilationGroup)) {
      assertMemberSections(target);
      for (const member of target.compilationGroup.members) {
        const matches = targets.filter(value => value.symbol === member.symbol);
        if (matches.length !== 1 || !same(matches[0].compilationGroup, target.compilationGroup)) fail('incomplete auxiliary member bundle');
      }
    }
    for (const zero of retainedSegments(contract)) {
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
  const occurrenceSegments = contract.schemaVersion === 4 ? tables.flatMap(segment => segment.occurrences) : tables;
  const occurrences = occurrenceSegments.map((segment, index) => {
    const bytes = contract.schemaVersion === 4 ? segment.bytes : entryBytes(segment, target.auxiliarySections);
    const record = { label: segment.label, offset: hex(segment.offset), bytes, entries: bytes / 4,
      alignment: contract.alignment, alignmentDirectives: segment.alignmentDirectives,
      ...(segment.offset > end ? { paddingBefore: { offset: hex(end), bytes: segment.offset - end,
        expectedSha256: hash(Buffer.alloc(segment.offset - end)) } } : {}) };
    end = segment.offset + bytes;
    return record;
  });
  const adjusted = adjust(compiler, target.sectionName, { auxiliarySections: [{ compilerSection: contract.compilerSection,
    outputSection: tables[0].outputSection, bytes: end, compilerOccurrences: occurrences }] });
  // Validate the same strict grammar, but assemble the unmodified native source.
  return contract.schemaVersion === 3 ? Buffer.from(compiler) : adjusted;
}
function hex(value) { return '0x' + value.toString(16).toUpperCase().padStart(8, '0'); }
function project(input, target) {
  const contract = checkTarget(target), tables = payloads(contract);
  if (!Array.isArray(target.auxiliaryProjectionRetained)
      || target.auxiliaryProjectionRetained.length !== retainedSegments(contract).length) fail('missing retained bindings');
  for (const [index, segment] of retainedSegments(contract).entries()) {
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
  const sourceMatches = parsed.sections.filter(section => section.name === (contract.schemaVersion === 3 ? '.rodata' : tables[0].outputSection));
  if (sourceMatches.length !== 1) fail('raw read-only section census');
  const source = sourceMatches[0], raw = elfTools.sectionBytes(input, source);
  if (source.type !== 1 || source.flags !== 2 || source.address !== 0 || source.size !== contract.bytes
      || source.alignment !== contract.alignment || hash(raw) !== contract.expectedObjectSha256) fail('raw read-only section identity');
  const native = contract.schemaVersion === 3;
  const text = parsed.sections.filter(section => section.name === (native ? '.text' : target.sectionName));
  if (text.length !== 1 || text[0].type !== 1 || text[0].flags !== 6 || text[0].address !== 0
      || text[0].size !== (native ? contract.nativeText.bytes : target.bytes)) fail('raw text owner');
  const nativeTextBytes = elfTools.sectionBytes(input, text[0]);
  if (native && (text[0].alignment !== contract.nativeText.alignment
      || hash(nativeTextBytes.subarray(target.bytes)) !== contract.nativeText.terminal.sha256)) fail('native text terminal bytes');
  const allowed = new Set([text[0].name, source.name, '.reginfo']);
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
      || parsed.sections[marker.sectionIndex].size !== (native ? contract.nativeText.bytes : 0)) fail('compiler marker metadata');
  if (native) {
    const actual = symbols.filter(symbol => symbol.symbolType === 2);
    if (actual.length !== target.compilerTextFunctions.length) fail('native compiler function census');
    for (const fn of target.compilerTextFunctions) {
      const matches = actual.filter(symbol => symbol.name === fn.symbol);
      if (matches.length !== 1 || matches[0].sectionIndex !== text[0].index || matches[0].value !== fn.offsetNumber
          || matches[0].size !== fn.bytes || matches[0].binding !== (fn.binding === 'GLOBAL' ? 1 : 0)
          || matches[0].visibility !== 0) fail('native compiler function binding or placement');
    }
  }
  for (const symbol of symbols) {
    if (native && symbol.symbolType === 3 && (symbol.binding !== 0 || symbol.value !== 0 || symbol.size !== 0
        || symbol.visibility !== 0 || !parsed.sections[symbol.sectionIndex])) fail('native section symbol shape');
    if (symbol.sectionIndex > 0 && symbol.sectionIndex < 0xff00 && symbol.symbolType !== 3
        && !(native ? target.compilerTextFunctions.some(fn => symbol.name === fn.symbol && symbol.sectionIndex === text[0].index
          && symbol.symbolType === 2 && symbol.binding === (fn.binding === 'GLOBAL' ? 1 : 0) && symbol.value === fn.offsetNumber
          && symbol.size === fn.bytes && symbol.visibility === 0)
          : symbol.name === target.symbol && symbol.sectionIndex === text[0].index
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
    if (!expected || parseInt(expected.addend, 16) !== raw.readUInt32BE(place) || raw.readUInt32BE(place) >= target.bytes
        || contract.schemaVersion === 4 && raw.readUInt32BE(place) % 4) fail('native table addend');
    if (native) {
      const fn = target.compilerTextFunctions.find(fn => fn.symbol === segment.dispatchSymbol);
      if (raw.readUInt32BE(place) % 4 || raw.readUInt32BE(place) < fn.offsetNumber
          || raw.readUInt32BE(place) + 4 > fn.offsetNumber + fn.bytes) fail('table target outside attributed body');
    }
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
    let pending = []; const referencePlaces=new Set();
    for (let cursor = 0; cursor < rel.size; cursor += 8) {
      const place = input.readUInt32BE(rel.offset + cursor), info = input.readUInt32BE(rel.offset + cursor + 4);
      const symbol = symbols[info >>> 8], type = info & 255;
      if (!symbol || place % 4 || place + 4 > owner.size) fail('relocation place or symbol');
      if(occurrenceMode(contract) && referencePlaces.has(place)) fail('duplicate occurrence relocation place');
      referencePlaces.add(place);
      if (symbol === marker) fail('reference to compiler marker');
      if (native && owner.index === text[0].index && place + 4 > target.bytes) fail('relocation in native terminal text');
      if (native && symbol.sectionIndex === text[0].index) {
        const word = input.readUInt32BE(owner.offset + place);
        if (![2, 3].includes(symbol.symbolType) || ![2, 4].includes(type)) fail('unsupported native text reference');
        const addend = type === 2 ? word : (word & 0x03ffffff) * 4;
        const destination = symbol.value + addend;
        if (!Number.isSafeInteger(destination) || destination % 4 || destination + 4 > target.bytes) fail('reference into native terminal text');
      }
      if (parsed.sections[symbol.sectionIndex]?.name === '.reginfo') fail('reference to discarded reginfo');
      if (symbol.sectionIndex !== source.index) continue;
      if (owner.index !== text[0].index || symbol !== anchors[0] || ![5, 6].includes(type)) fail('unsupported reference to auxiliary anchor');
      const word = input.readUInt32BE(owner.offset + place);
      if (type === 5) { pending.push({ place, info, immediate: word & 0xffff }); continue; }
      if (!pending.length) fail('unpaired auxiliary LO16');
      const low = (word << 16) >> 16; let pairedTable=null;
      for (const high of pending) {
        const addend = ((high.immediate << 16) + low) >>> 0;
        if (!tables.some(segment => addend >= segment.offset && addend + 4 <= segment.offset + entryBytes(segment, target.auxiliarySections))) fail('reference into padding or outside native payloads');
        if(occurrenceMode(contract)) {
          const table=tables.find(segment=>addend>=segment.offset && addend+4<=segment.offset+entryBytes(segment,target.auxiliarySections));
          if(addend%4 || pairedTable && pairedTable!==table) fail('ambiguous occurrence pair set');
          pairedTable=table;
        }
        if (native) {
          const table = tables.find(segment => addend >= segment.offset && addend + 4 <= segment.offset + entryBytes(segment, target.auxiliarySections));
          const fn = target.compilerTextFunctions.find(fn => fn.symbol === table.dispatchSymbol);
          if (high.place < fn.offsetNumber || high.place + 4 > fn.offsetNumber + fn.bytes
              || place < fn.offsetNumber || place + 4 > fn.offsetNumber + fn.bytes) fail('table anchor reference outside dispatch body');
        }
        references.push({ highPlace: high.place, highInfo: high.info, lowPlace: place, lowInfo: info, addend });
      }
      pending = [];
    }
    if (pending.length) fail('unpaired auxiliary HI16');
  }
  if(occurrenceMode(contract) && tables.some(t=>!references.some(r=>r.addend>=t.offset&&r.addend+4<=t.offset+t.bytes))) fail('unreferenced native occurrence');
  const owners = tables.map(segment => ({ sectionName: segment.outputSection, bytes: segment.bytes,
    logicalOffset: segment.offset, logicalEnd: segment.offset + segment.bytes, alignment: contract.alignment }));
  for (const owner of owners.slice(1)) if (parsed.sections.some(section => section.name === owner.sectionName)) fail('projected destination already exists');
  const grouped = new Map([...groups].map(([name, entries]) => [name, Buffer.concat(entries)]));
  const list = elfTools.buildSectionList(parsed, input, source, relocation, owners, grouped);
  elfTools.rewriteSymbolTables(list, source, owners);
  elfTools.rewriteSectionReferences(list, relocation);
  if (native) {
    const projectedText = list.sections.find(section => section.oldIndex === text[0].index);
    projectedText.name = target.sectionName;
    projectedText.data = projectedText.data.subarray(0, target.bytes);
    projectedText.size = target.bytes;
    projectedText.alignment = contract.nativeText.outputAlignment;
    const textRel = list.sections.find(section => section.name === '.rel.text');
    if (textRel) textRel.name = '.rel' + target.sectionName;
  }
  const occurrenceEvidence = occurrenceMode(contract) ? deriveOccurrenceSymbols(list, target, references, source, text[0], symbols) : null;
  const shstr = elfTools.rebuildSectionNames(list, parsed.shstrIndex);
  const buffer = elfTools.serialize(input, parsed, list, shstr);
  const projected = parseElf32BigEndian(buffer);
  for (const segment of tables) {
    const section = projected.sections.find(value => value.name === segment.outputSection);
    if (!section || !Buffer.from(elfSectionBytes(projected, section)).equals(raw.subarray(segment.offset, segment.offset + segment.bytes))) fail('projection changed payload');
  }
  if(occurrenceMode(contract)) {
    validateOccurrenceObject(projected,target);
    const after=projected.sections.find(s=>s.name===target.sectionName);
    if(!after||!Buffer.from(elfSectionBytes(projected,after)).equals(nativeTextBytes))fail('occurrence projection changed text bytes');
  }
  if (native) {
    const after = projected.sections.find(section => section.name === target.sectionName);
    if (!after || !Buffer.from(elfSectionBytes(projected, after)).equals(nativeTextBytes.subarray(0, target.bytes))) fail('projection changed native function bytes');
    require('./phase8_matching_c').verifyCompilerTextFunctions(projected, target, after);
  }
  return { buffer, evidence: { schemaVersion: contract.schemaVersion, contract, retained: target.auxiliaryProjectionRetained,
    ...(native ? { nativeText: { ...contract.nativeText, nativeSha256: hash(nativeTextBytes),
      projectedSha256: hash(nativeTextBytes.subarray(0, target.bytes)), functions: target.compilerTextFunctions,
      tableAttribution: tables.map(table => ({ outputSection: table.outputSection, dispatchSymbol: table.dispatchSymbol })) } } : {}),
    ...([2, 4].includes(contract.schemaVersion) ? { payloadSlices: tables.map(segment => ({ outputSection: segment.outputSection,
      offset: segment.offset, bytes: segment.bytes, entryBytes: entryBytes(segment, target.auxiliarySections),
      paddingBytes: segment.bytes - entryBytes(segment, target.auxiliarySections),
      nativeSha256: hash(raw.subarray(segment.offset, segment.offset + segment.bytes)),
      paddingSha256: hash(raw.subarray(segment.offset + entryBytes(segment, target.auxiliarySections), segment.offset + segment.bytes)) })) } : {}),
    ...(occurrenceEvidence ? {occurrence:occurrenceEvidence} : {}),
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
module.exports = { occurrenceMode, normalize, checkTarget, retainedBindings, validateBindings, validateCensus, assembly, project, linkedEvidence };

function singleOwner(group) { return group?.mode === 'native-text-readonly-single-owner-projection'; }
function composed(group) { return singleOwner(group) || ['native-text-readonly-owner-projection','native-text-readonly-interior-run-projection'].includes(group?.mode); }
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
  if (fragmentLike(group)) {
    const c = groupContract(group), a = group.auxiliary.sections[0];
    adjust(compiler, group.owners[0].sectionName, { auxiliarySections: [{ compilerSection: '.rodata', outputSection: c.segments[0].outputSection, bytes: c.bytes, entries: a.entries }] });
    const blocks = [...compiler.toString('utf8').matchAll(/^[ \t]*\.section[ \t]+\.rodata[^\r\n]*\r?\n([\s\S]*?)^[ \t]*\.text[ \t]*$/gm)];
    if (blocks.length !== 1) fail('fragment compiler section census');
    const lines = blocks[0][1].split(/\r?\n/).map(s=>s.trim()).filter(s=>s && !s.startsWith('#'));
    const expected = [...group.auxiliary.alignmentDirectives.map(n=>'.align '+n), group.auxiliary.compilerLabel+':'];
    if (!same(lines.slice(0,expected.length).map(s=>s.replace(/\s+/g,' ')),expected)
        || lines.length !== expected.length+a.entries || lines.slice(expected.length).some(s=>!/^\.word[ \t]+\.L[0-9]+$/.test(s))) fail('fragment compiler table grammar');
    return;
  }
  if (!composed(group)) fail('missing composed producer mode');
  const contract = groupContract(group);
  require('./compilation_groups').interiorGrammar(compiler, group);
  let end = 0;
  const occurrences = groupOccurrences(group).map(segment => {
    const occurrence = { label: segment.label, offset: hex(segment.offset), bytes: segment.bytes, entries: segment.bytes / 4,
      alignment: contract.alignment, alignmentDirectives: segment.alignmentDirectives,
      ...(segment.offset > end ? { paddingBefore: { offset: hex(end), bytes: segment.offset - end,
        expectedSha256: hash(Buffer.alloc(segment.offset - end)) } } : {}) };
    end = segment.offset + segment.bytes;
    return occurrence;
  });
  // Grammar validation only: the returned section-assigned bytes are discarded.
  // The producer's actual assembler input is the untouched compiler buffer.
  adjust(compiler, group.owners[0].sectionName, { composedGroup: group, auxiliarySections: [{ compilerSection: '.rodata',
    outputSection: payloads(contract)[0].outputSection, bytes: end, compilerOccurrences: occurrences }] });
}
function groupReadonlyNames(group, stage) {
  groupContract(group);
  return ['raw', 'text-projected'].includes(stage) ? ['.rodata'] : group.auxiliary.sections.map(value => value.outputSection);
}
function groupCensus(elf, group, stage) {
  if (!composed(group) && !fragmentLike(group)) fail('missing composed producer');
  const contract = groupContract(group);
  if (!fragmentLike(group)) assertCompleteGroupRows(group);
  if (contract.bytes > elf.buffer.length) fail('group read-only footprint exceeds object');
  const zeroSegments = contract.segments.filter(value => value.kind === 'zero');
  if (!fragmentLike(group) && (!Array.isArray(group.auxiliary.retained) || group.auxiliary.retained.length !== zeroSegments.length)) fail('group retained binding census');
  for (const [index, zero] of zeroSegments.entries()) {
    const record = group.auxiliary.retained[index];
    if (!record || Object.entries(zero).some(([key, value]) => !same(record[key], value))
        || typeof record.originalAssembly !== 'string' || path.isAbsolute(record.originalAssembly)
        || record.originalAssembly.split(/[\\/]/).includes('..')
        || sha256File(path.join(ROOT, record.originalAssembly)) !== record.originalAssemblySha256) fail('group retained source binding');
  }
  const tables = payloads(contract), occurrences = groupOccurrences(group), native = ['raw', 'text-projected'].includes(stage);
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
    if (singleFragment(group) && (section.link || section.info || section.entrySize)) fail("single fragment readonly header");
    if (section.type !== 1 || section.flags !== 2 || section.address !== 0 || section.size !== bytes
        || section.alignment !== contract.alignment) fail('group read-only shape');
    Buffer.from(elfSectionBytes(elf, section)).copy(rawBytes, native ? 0 : tables[index].offset);
  }
  if (hash(rawBytes) !== contract.expectedObjectSha256) fail('group native read-only identity');
  for (const segment of fragmentLike(group) ? [{ offset: group.auxiliary.sections[0].entries * 4, bytes: singleFragment(group) ? group.auxiliary.nativeSection.terminalAlignment.bytes : group.auxiliary.sections[0].trailingPaddingBytes || 0 }] : rowBundle(group) ? bundlePadding(group) : contract.segments.filter(value => value.kind === 'zero')) {
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
    const table = occurrences.find(value => offset >= value.offset && offset + 4 <= value.offset + value.bytes);
    const symbol = relocation.symbol;
    if (!table || offset % 4 || places.has(offset) || relocation.type !== 2 || symbol.sectionIndex !== textAnchor?.index
        || symbol.symbolType !== 3 || symbol.name !== '' || symbol.value || symbol.size || symbol.binding || symbol.visibility) fail('group table relocation place/anchor');
    places.add(offset);
    const word = rawBytes.readUInt32BE(offset);
    const auxiliary = group.auxiliary.sections.find(value => value.outputSection === table.outputSection);
    const attributed = group.functions.find(value => value.symbol === (fragmentLike(group) ? auxiliary.functionSymbol : rowBundle(group) ? table.memberSymbol : auxiliary.memberSymbol));
    if (word % 4) fail('group table instruction destination alignment');
    if (word < attributed.offset || word + 4 > attributed.offset + attributed.bytes) fail('group table target outside attributed function');
    const expected = auxiliary.expectedRelocations.find(value => Number(value.offset) === offset - tables.find(row => row.outputSection === table.outputSection).offset);
    if (!expected || Number(expected.addend) !== word) fail('group table relocation addend');
    tableRelocations.push({ offset, type: 2, symbol: '.text', symbolValue: 0, word });
  }
  if (places.size !== occurrences.reduce((sum, table) => sum + table.bytes / 4, 0)) fail('group table relocation census');
  if(rowBundle(group)) {
    const expected = tables.flatMap(row=>group.auxiliary.sections.find(a=>a.outputSection===row.outputSection).expectedRelocations
      .map(r=>({offset:row.offset+Number(r.offset),type:2,symbol:'.text',symbolValue:0,word:Number(r.addend)})));
    if(!same(tableRelocations,expected)) fail('bundle native serialized table relocation sequence');
  }
  const marker = elf.symbols.filter(symbol => symbol.name === 'gcc2_compiled.');
  if (marker.length !== 1 || marker[0].symbolType !== 1 || marker[0].binding || marker[0].value || marker[0].size
      || marker[0].visibility || marker[0].sectionIndex !== textAnchor?.index) fail('group compiler marker');
  if (singleFragment(group) && !same(tableRelocations.map(r=>r.offset), Array.from({length:group.auxiliary.sections[0].entries},(_,i)=>i*4))) fail("single fragment serialized table REL order");
  const pending = new Map();
  const sourceMember = relocation => {
    const start = textOffset(relocation.owner);
    const position = start === null ? null : start + relocation.place;
    return position === null ? null : group.functions.findIndex(value => position >= value.offset && position + 4 <= value.offset + value.bytes);
  };
  const inspectReference = (relocation, addend) => {
    const destination = elf.sections[relocation.symbol.sectionIndex], destinationOffset = textOffset(destination);
    if (destination?.index === roAnchor.index) {
      const table = occurrences.find(table => addend >= table.offset && addend + 4 <= table.offset + table.bytes);
      const attributed = table && (fragmentLike(group) ? group.auxiliary.sections[0].functionSymbol : rowBundle(group) ? table.memberSymbol : group.auxiliary.sections.find(section => section.outputSection === table.outputSection).memberSymbol);
      if (relocation.symbol !== anchorSymbol || !table || singleFragment(group) && addend % 4 || group.functions[sourceMember(relocation)]?.symbol !== attributed) fail('group auxiliary reference attribution/padding');
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
    ...(rowBundle(group) ? { occurrenceEvidence: bundleEvidence(group, rawBytes, tableRelocations), paddingEvidence: bundlePadding(group) } : {}),
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
  const projection = groupContract(group);
  const relocation = rels[0], tables = payloads(projection);
  const owners = tables.map(table => ({ sectionName: table.outputSection, bytes: table.bytes,
    logicalOffset: table.offset, logicalEnd: table.offset + table.bytes, alignment: projection.alignment }));
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
Object.assign(module.exports, { singleOwner, composed, groupContract, memberSections, assertMemberSections, assertCompleteGroupRows, groupGrammar, groupReadonlyNames, groupCensus, projectGroupReadonly, conservedOutsideReadonly, completeObjectCensus });

// Version 5 is group-only. Physical rows and callable occurrence attribution
// are independent partitions. Older standalone and composed schemas are unchanged.
function groupOccurrences(group) {
  if (fragmentLike(group)) { const c = groupContract(group), a = group.auxiliary.sections[0]; return [{ ...c.segments[0], bytes: a.entries * 4, memberSymbol: a.memberSymbol, functionSymbol: a.functionSymbol }]; }
  return payloads(group.auxiliary.projection).flatMap(row => rowBundle(group)
    ? row.occurrences.map(o => ({ ...o, outputSection: row.outputSection, rowOffset: o.offset - row.offset })) : [row]);
}
function bundleContract(group) {
  const p = group.auxiliary.projection, sections = group.auxiliary.sections;
  if (!keys(group.auxiliary, ['sections','projection', ...(Object.hasOwn(group.auxiliary,'retained') ? ['retained'] : [])])
      || !Array.isArray(group.members) || group.members.length < 2 || !Array.isArray(group.functions)
      || group.functions.length !== group.members.length || !Array.isArray(sections) || !sections.length
      || !keys(p,['schemaVersion','mode','compilerSection','bytes','alignment','expectedObjectSha256','segments'])
      || p.schemaVersion !== 5 || p.mode !== 'fixed-row-readonly-projection' || p.compilerSection !== '.rodata'
      || !integer(p.bytes,4) || !alignment(p.alignment) || p.bytes % p.alignment || !SHA.test(p.expectedObjectSha256)
      || !Array.isArray(p.segments)) fail('bundle group schema');
  let cursor=0, count=0, previousEnd=0;
  const names=new Set(), labels=new Set(), zeros=new Set();
  for (const row of p.segments) {
    if (!integer(row?.offset) || row.offset !== cursor || !integer(row.bytes,4) || row.bytes%4 || row.offset+row.bytes>p.bytes) fail('bundle row tiling');
    if (row.kind==='payload') {
      const a=sections[count++];
      if (!keys(row,['kind','offset','bytes','outputSection','occurrences']) || !SECTION.test(row.outputSection)
          || names.has(row.outputSection) || !Array.isArray(row.occurrences) || !row.occurrences.length
          || !a || a.outputSection!==row.outputSection || a.bytes!==row.bytes || a.alignment!==p.alignment
          || a.compilerSection!==p.compilerSection || a.preservedTail!==null || a.preservedPrefix || a.preservedInteriorBefore
          || a.sourceObjectPrefix || a.trailingPaddingBytes || Object.hasOwn(a,'memberSymbol')
          || row.offset%p.alignment || (count===1 && row.offset!==0)) fail('bundle whole row schema');
      let entries=0;
      for (const o of row.occurrences) {
        if (!keys(o,['label','memberSymbol','offset','bytes','alignmentDirectives']) || !/^\.L[0-9]+$/.test(o.label) || labels.has(o.label)
            || group.members.filter(m=>m.symbol===o.memberSymbol).length!==1 || group.functions.filter(m=>m.symbol===o.memberSymbol).length!==1
            || !integer(o.bytes,4) || o.bytes%4 || !integer(o.offset) || o.offset<row.offset || o.offset+o.bytes>row.offset+row.bytes
            || !Array.isArray(o.alignmentDirectives) || !o.alignmentDirectives.length || o.alignmentDirectives.some(v=>!integer(v)||v>4)
            || Math.max(...o.alignmentDirectives.map(v=>2**v))!==p.alignment) fail('bundle occurrence schema/attribution');
        let aligned=previousEnd; for(const v of o.alignmentDirectives) aligned=Math.ceil(aligned/2**v)*2**v;
        if(o.offset!==aligned) fail('bundle native occurrence alignment');
        previousEnd=o.offset+o.bytes; entries+=o.bytes/4; labels.add(o.label);
      }
      // This bounded representation retains exterior padding as whole ASM rows.
      if(row.occurrences[0].offset!==row.offset || previousEnd!==row.offset+row.bytes || entries!==a.entries) fail('bundle row payload coverage');
      const expectedPlaces = row.occurrences.flatMap(o=>Array.from({length:o.bytes/4},(_,i)=>o.offset-row.offset+i*4));
      if(!Array.isArray(a.expectedRelocations) || a.expectedRelocations.length!==expectedPlaces.length
        || a.expectedRelocations.some((r,i)=>!keys(r,['offset','type','symbol','addend','section'])
          || !/^0x[0-9A-F]{8}$/.test(r.offset) || Number(r.offset)!==expectedPlaces[i]
          || r.type!=='R_MIPS_32' || r.symbol!=='.text' || r.section!=='.rel.rodata'
          || !/^0x[0-9A-F]{8}$/.test(r.addend) || Number(r.addend)%4)) fail('bundle occurrence relocation sequence');
      names.add(row.outputSection);
    } else {
      if(row.kind!=='zero' || !keys(row,['kind','offset','bytes','ownerSection','ownerOffset','ownerBytes','expectedOwnerSha256'])
          || !SECTION.test(row.ownerSection) || zeros.has(row.ownerSection) || row.ownerOffset!==0
          || !integer(row.ownerBytes,4) || row.ownerBytes%4 || row.bytes>row.ownerBytes || !SHA.test(row.expectedOwnerSha256)) fail('bundle retained zero schema');
      zeros.add(row.ownerSection);
    }
    cursor+=row.bytes;
  }
  if(cursor!==p.bytes || count!==sections.length || !count || [...zeros].some(n=>names.has(n))
      || p.bytes!==Math.ceil(previousEnd/p.alignment)*p.alignment) fail('bundle native terminal/row census');
  return structuredClone(p);
}
function bundlePadding(group) {
  const p=group.auxiliary.projection, result=[]; let end=0;
  for(const o of groupOccurrences(group)) { if(o.offset>end) result.push({offset:end,bytes:o.offset-end,origin:'native-occurrence-alignment'}); end=o.offset+o.bytes; }
  if(p.bytes>end) result.push({offset:end,bytes:p.bytes-end,origin:'native-assembler-section-alignment'});
  return result;
}
function bundleEvidence(group, bytes, relocations) {
  return groupOccurrences(group).map(o=>({ ...o, entries:o.bytes/4,
    nativeSha256:hash(bytes.subarray(o.offset,o.offset+o.bytes)),
    relocations:relocations.filter(r=>r.offset>=o.offset&&r.offset<o.offset+o.bytes) }));
}
Object.assign(module.exports,{bundle:rowBundle,groupOccurrences,bundlePadding,bundleEvidence});


// New locals are inserted before globals; every original symbol retains its
// identity through the explicit bijection, including ancillary relocations.
function deriveOccurrenceSymbols(list,target,references,source,text,symbols) {
  const contract=target.auxiliaryProjection,tables=payloads(contract),first=target.auxiliarySections[0];
  const deltas=tables.map((table,i)=>target.auxiliarySections[i].vramStartNumber-first.vramStartNumber-table.offset);
  const unique=[...new Set(deltas.filter(d=>d!==0))].sort((a,b)=>a-b);
  const symtabs=list.sections.filter(s=>s.type===2); if(symtabs.length!==1) fail('occurrence symbol table census');
  const symtab=symtabs[0],strtab=list.sections[symtab.link],cut=symtab.info,count=symbols.length;
  if(symtab.entrySize!==16 || symtab.data.length!==count*16 || !integer(cut,1) || cut>count || !strtab || strtab.type!==3
    || symbols.some((s,i)=>(i<cut)!==(s.binding===0))) fail('occurrence local/global partition');
  const symbolMap=symbols.map((_,i)=>({oldIndex:i,newIndex:i<cut?i:i+unique.length}));
  const anchors=unique.map((delta,i)=>({name:'__ob64_readonly_anchor_'+delta.toString(16),value:delta,index:cut+i,
    section:tables[0].outputSection,binding:0,symbolType:1,size:0,visibility:0}));
  if(anchors.some(a=>symbols.some(s=>s.name===a.name))) fail('occurrence derived symbol collision');
  const added=[];
  for(const anchor of anchors) {
    const record=Buffer.alloc(16);record.writeUInt32BE(strtab.data.length,0); record.writeUInt32BE(anchor.value,4);
    record[12]=1; record.writeUInt16BE(list.ownerSections.get(anchor.section).index,14);added.push(record);
    strtab.data=Buffer.concat([strtab.data,Buffer.from(anchor.name+'\0')]);
  }
  strtab.size=strtab.data.length;
  symtab.data=Buffer.concat([symtab.data.subarray(0,cut*16),...added,symtab.data.subarray(cut*16)]);
  symtab.size=symtab.data.length;symtab.info=cut+anchors.length;
  const changes=new Map(),pairs=[];
  for(const ref of references) {
    const i=tables.findIndex(t=>ref.addend>=t.offset && ref.addend+4<=t.offset+t.bytes),table=tables[i];
    if(i<0) fail('occurrence reference coverage');
    const delta=deltas[i],newIndex=delta?anchors.find(a=>a.value===delta).index:symbolMap[ref.highInfo>>>8].newIndex;
    for(const [place,info] of [[ref.highPlace,ref.highInfo],[ref.lowPlace,ref.lowInfo]]) {
      if(changes.has(place) && changes.get(place).newIndex!==newIndex) fail('occurrence low retarget ambiguity');
      changes.set(place,{info,newIndex});
    }
    const effective=first.vramStartNumber+delta+ref.addend;
    if(effective!==target.auxiliarySections[i].vramStartNumber+ref.addend-table.offset || effective>0xffffffff) fail('occurrence reference equation');
    pairs.push({...ref,outputSection:table.outputSection,newSymbolIndex:newIndex,anchorDelta:delta,effectiveAddress:effective});
  }
  for(const rel of list.sections.filter(s=>s.type===9)) {
    if(rel.link!==symtab.index || rel.entrySize!==8 || rel.data.length%8) fail('occurrence relocation symbol table');
    for(let offset=0;offset<rel.data.length;offset+=8) {
      const place=rel.data.readUInt32BE(offset),info=rel.data.readUInt32BE(offset+4),oldIndex=info>>>8;
      if(!symbolMap[oldIndex]) fail('occurrence relocation symbol index');
      const change=rel.info===list.oldToNew.get(text.index)?changes.get(place):null;
      if(change && change.info!==info) fail('occurrence relocation reference identity');
      rel.data.writeUInt32BE(((change?change.newIndex:symbolMap[oldIndex].newIndex)*256+(info&255))>>>0,offset+4);
    }
  }
  return {symbolMap,anchors,pairs};
}

function validateOccurrenceObject(elf,target,linked=false) {
  if(!occurrenceMode(target.auxiliaryProjection)) return;
  checkTarget(target);
  const first=target.auxiliarySections[0],tables=payloads(target.auxiliaryProjection);
  const deltas=[...new Set(tables.map((t,i)=>target.auxiliarySections[i].vramStartNumber-first.vramStartNumber-t.offset).filter(d=>d!==0))].sort((a,b)=>a-b);
  const section=elf.sections.filter(s=>s.name===first.outputSection);
  if(section.length!==1) fail('occurrence anchor section');
  const anchors=elf.symbols.filter(s=>s.name.startsWith('__ob64_readonly_anchor_') && (!linked || s.sectionIndex===section[0].index));
  if(anchors.length!==deltas.length) fail('occurrence derived anchor census');
  for(const delta of deltas) {
    const found=anchors.filter(s=>s.name==='__ob64_readonly_anchor_'+delta.toString(16));
    if(found.length!==1 || found[0].value!==delta+(linked?first.vramStartNumber:0) || found[0].size!==0
      || found[0].binding!==0 || found[0].symbolType!==1 || found[0].visibility!==0 || found[0].sectionIndex!==section[0].index)
      fail('occurrence derived anchor identity');
  }
}
function validateOccurrenceProof(proof) {
  const contract=proof.target.auxiliaryProjection;
  if(!occurrenceMode(contract)) {if(contract?.schemaVersion===6)fail('occurrence proof mode');return;}
  const e=proof.objectEvidence.auxiliaryProjection,detail=e.occurrence,rows=proof.finalObject.auxiliarySections,tables=payloads(contract);
  if(!keys(detail,['symbolMap','anchors','pairs']) || rows.length!==tables.length || !e.nativeSymbols.length) fail('occurrence proof schema');
  const first=Number.parseInt(rows[0].finalPlacement.vramStart,16),symbols=e.nativeSymbols;
  const cut=symbols.findIndex(s=>s.binding!==0);if(cut<1)fail('occurrence proof native local/global census');
  const deltas=tables.map((t,i)=>Number.parseInt(rows[i].finalPlacement.vramStart,16)-first-t.offset);
  if(deltas.some(d=>!integer(d)||d%4||d>=tables[0].bytes)||deltas[0]!==0)fail('occurrence proof anchor bounds');
  const unique=[...new Set(deltas.filter(d=>d!==0))].sort((a,b)=>a-b);
  const expectedMap=symbols.map((_,i)=>({oldIndex:i,newIndex:i<cut?i:i+unique.length}));
  const anchors=unique.map((delta,i)=>({name:'__ob64_readonly_anchor_'+delta.toString(16),value:delta,index:cut+i,
    section:tables[0].outputSection,binding:0,symbolType:1,size:0,visibility:0}));
  if(!same(detail.symbolMap,expectedMap)||!same(detail.anchors,anchors))fail('occurrence proof symbol mapping');
  const pairs=e.references.map(ref=>{
    const i=tables.findIndex(t=>ref.addend>=t.offset && ref.addend+4<=t.offset+t.bytes);
    if(i<0||ref.addend%4||!expectedMap[ref.highInfo>>>8]||(ref.highInfo>>>8)!==(ref.lowInfo>>>8))fail('occurrence proof reference');
    const delta=deltas[i],newSymbolIndex=delta?anchors.find(a=>a.value===delta).index:expectedMap[ref.highInfo>>>8].newIndex;
    return {...ref,outputSection:tables[i].outputSection,newSymbolIndex,anchorDelta:delta,effectiveAddress:first+delta+ref.addend};
  });
  if(!same(detail.pairs,pairs)||tables.some(t=>!pairs.some(p=>p.outputSection===t.outputSection)))fail('occurrence proof pairs');
  for(const pair of pairs) for(const [place,info] of [[pair.highPlace,pair.highInfo],[pair.lowPlace,pair.lowInfo]]) {
    const native=e.nativeRelocationSections.filter(r=>r.owner===proof.target.sectionName).flatMap(r=>r.entries);
    if(native.filter(r=>r.place===place&&r.info===info).length!==1)fail('occurrence proof native reference census');
  }
}
module.exports.validateOccurrenceObject=validateOccurrenceObject;
module.exports.validateOccurrenceProof=validateOccurrenceProof;



const fragmentMode = group => group?.mode === 'native-text-owner-functions-readonly-fragment-projection';
function fragmentContract(group) {
  if (!fragmentMode(group) || !keys(group.auxiliary, ['sections','compilerLabel','alignmentDirectives'])
      || !Array.isArray(group.auxiliary.sections) || group.auxiliary.sections.length !== 1
      || !/^\.L[0-9]+$/.test(group.auxiliary.compilerLabel)
      || !Array.isArray(group.auxiliary.alignmentDirectives)
      || !same(group.auxiliary.alignmentDirectives, [Math.log2(group.auxiliary.sections[0]?.alignment),2])) fail('fragment auxiliary envelope');
  const a = group.auxiliary.sections[0], members = group.members.filter(m => m.symbol === a.memberSymbol), functions = group.functions.filter(f => f.symbol === a.functionSymbol);
  if (members.length !== 1 || functions.length !== 1 || !members[0].functionSymbols?.includes(a.functionSymbol)
      || functions[0].binding !== 1 || a.kind !== 'switch-table' || a.compilerSection !== '.rodata'
      || a.sectionType !== 'SHT_PROGBITS' || !same(a.sectionFlags,['SHF_ALLOC']) || !alignment(a.alignment)
      || !integer(a.entries,1) || a.bytes !== a.entries*4+(a.trailingPaddingBytes||0)) fail('fragment function/member attribution');
  return { bytes:a.bytes, alignment:a.alignment, expectedObjectSha256:a.expectedObjectSha256,
    segments:[{kind:'payload',offset:0,bytes:a.bytes,outputSection:a.outputSection,label:group.auxiliary.compilerLabel,alignmentDirectives:group.auxiliary.alignmentDirectives}] };
}
function normalizeFragment(group) {
  fragmentContract(group);
  return group.auxiliary.sections.map(({memberSymbol,functionSymbol,...section}) => {
    if (Object.hasOwn(section,'compilerOccurrences') || Object.hasOwn(section,'sourceObjectPrefix')) fail('fragment requires one ordinary complete compiler table');
    return {...require('./active_targets').normalizeAuxiliarySectionContracts([section],group.id,'fragment auxiliary')[0],memberSymbol,functionSymbol };
  });
}
Object.assign(module.exports,{fragmentMode,fragmentContract,normalizeFragment});

// Complete single native owner with a projected table prefix. This is neither
// the multi-owner fragment contract nor a complete-data-row composition.
const singleFragment = group => group?.mode === 'native-text-single-owner-readonly-fragment-projection';
const fragmentLike = group => fragmentMode(group) || singleFragment(group);
function singleFragmentContract(group) {
  if (!singleFragment(group)) fail('single fragment mode');
  require('./compilation_groups').singleOwnerContract(group);
  const a=group.auxiliary;
  if(!keys(a,['sections','compilerLabel','alignmentDirectives','nativeSection']) || !Array.isArray(a.sections) || a.sections.length!==1
      || !/^\.L[0-9]+$/.test(a.compilerLabel)) fail('single fragment auxiliary envelope');
  const s=a.sections[0],n=a.nativeSection,t=n?.terminalAlignment;
  if(s.memberSymbol!==group.members[0].symbol || s.functionSymbol!==group.functions[0].symbol
      ||s.kind!=='switch-table'||s.compilerSection!=='.rodata'||s.sectionType!=='SHT_PROGBITS'||!same(s.sectionFlags,['SHF_ALLOC'])
      ||!alignment(s.alignment)||!integer(s.entries,1)||s.bytes!==s.entries*4||s.trailingPaddingBytes
      ||Object.hasOwn(s,'sourceObjectPrefix')||Object.hasOwn(s,'compilerOccurrences')
      ||!same(a.alignmentDirectives,[Math.log2(s.alignment),2])) fail('single fragment attribution/table');
  if(!keys(n,['section','type','flags','alignment','bytes','sha256','link','info','entrySize','terminalAlignment'])
      ||n.section!=='.rodata'||n.type!==1||n.flags!==2||n.alignment!==s.alignment||n.link!==0||n.info!==0||n.entrySize!==0
      ||!SHA.test(n.sha256)||!integer(n.bytes,4)
      ||!keys(t,['offset','bytes','sha256','origin'])||t.origin!=='native-assembler-section-alignment'
      ||t.offset!==s.bytes||!integer(t.bytes,1)||t.bytes!==Math.ceil(s.bytes/s.alignment)*s.alignment-s.bytes
      ||n.bytes!==s.bytes+t.bytes||t.sha256!==hash(Buffer.alloc(t.bytes))) fail('single fragment native padding/header');
  return {bytes:n.bytes,alignment:n.alignment,expectedObjectSha256:n.sha256,
    segments:[{kind:'payload',offset:0,bytes:s.bytes,outputSection:s.outputSection,label:a.compilerLabel,alignmentDirectives:a.alignmentDirectives}]};
}
function normalizeSingleFragment(group) {
  singleFragmentContract(group);
  return group.auxiliary.sections.map(({memberSymbol,functionSymbol,...s})=>({
    ...require('./active_targets').normalizeAuxiliarySectionContracts([s],group.id,'single fragment auxiliary')[0],memberSymbol,functionSymbol}));
}
Object.assign(module.exports,{singleFragment,singleFragmentContract,normalizeSingleFragment});
