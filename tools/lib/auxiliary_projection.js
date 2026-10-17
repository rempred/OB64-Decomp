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
  if (mixedMode(group)) return mixedContract(group);
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
  if ((composed(target.compilationGroup) || fragmentLike(target.compilationGroup) || mixedMode(target.compilationGroup)) && !same(target.auxiliarySections, memberSections(target.compilationGroup, target.symbol))) fail('group auxiliary attribution census');
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
  if (mixedMode(group)) { mixedContract(group); if(group.auxiliary.mixed.schemaVersion===2&&group.auxiliary.mixed.initializer)return mixedInitializerGrammar(compiler,group); return groupGrammar(compiler, {...group,mode:'native-text-owner-functions-readonly-fragment-projection',auxiliary:{sections:group.auxiliary.sections,compilerLabel:group.auxiliary.compilerLabel,alignmentDirectives:group.auxiliary.alignmentDirectives}},adjust); }
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
  if(mixedMode(group)){const s=mixedStage(elf,group,stage);return {schemaVersion:1,mixed:s.proof,stageCensus:completeObjectCensus(elf)};}
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
  if(mixedMode(group)){const a=group.auxiliary.sections[0],c=mixedContract(group);return [{...c.segments[0],offset:c.native.tableOffset,bytes:a.bytes,memberSymbol:a.memberSymbol,functionSymbol:a.functionSymbol}];}
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


// A separate, finite mixed native representation. Neither ordinary fragments nor
// retained-literal schemas acquire this flags/anchor permission.
const mixedMode = group => group?.mode === 'native-text-owner-functions-mixed-readonly-fragment-projection';
function mixedContract(group) {
  const a=group?.auxiliary,m=a?.mixed,v2=m?.schemaVersion===2;
  if(!mixedMode(group)||!keys(a,['sections','compilerLabel','alignmentDirectives','mixed'])
    ||!keys(m,['schemaVersion','bytes','alignment','flags','expectedNativeSha256','tableOffset','literals','zero',...(v2?['initializer']:[])])
    ||![1,2].includes(m.schemaVersion)||m.flags!==(v2?2:1)||m.alignment!==16||!integer(m.bytes,16)||m.bytes%16
    ||!SHA.test(m.expectedNativeSha256)||!integer(m.tableOffset,v2?0:8)||m.tableOffset%8||(v2&&m.tableOffset!==0)
    ||!Array.isArray(m.literals)||!m.literals.length)fail('mixed auxiliary envelope');
  const ordinary=fragmentContract({...group,mode:'native-text-owner-functions-readonly-fragment-projection',auxiliary:{sections:a.sections,compilerLabel:a.compilerLabel,alignmentDirectives:a.alignmentDirectives}}),table=a.sections[0];
  if(table.trailingPaddingBytes||table.sourceObjectPrefix||table.compilerOccurrences||table.alignment!==8||table.bytes!==table.entries*4)fail('mixed table extent/alignment');
  const segments=[{kind:'table',offset:m.tableOffset,bytes:table.bytes}];
  for(const slot of m.literals){if(!keys(slot,['offset','expectedSha256'])||!integer(slot.offset)||slot.offset%8||!SHA.test(slot.expectedSha256))fail('mixed literal schema');segments.push({...slot,kind:'literal',bytes:8});}
  if(m.zero!==null){if(!keys(m.zero,['offset','bytes','expectedSha256'])||!integer(m.zero.offset)||!integer(m.zero.bytes,4)||m.zero.bytes%4||m.zero.bytes>=16||m.zero.expectedSha256!==hash(Buffer.alloc(m.zero.bytes)))fail('mixed zero schema');segments.push({...m.zero,kind:'zero'});}
  if(v2&&m.initializer!==null){const i=m.initializer;if(!keys(i,['offset','bytes','expectedSha256'])||!integer(i.offset)||i.offset%8||i.bytes!==64||!SHA.test(i.expectedSha256))fail('mixed initializer schema');segments.push({...i,kind:'initializer'});}
  segments.sort((x,y)=>x.offset-y.offset);let end=0;for(const seg of segments){if(seg.offset!==end||seg.offset+seg.bytes>m.bytes)fail('mixed interval tiling');end+=seg.bytes;}
  if(end!==m.bytes)fail('mixed native extent');
  if(v2){if(segments[0].kind!=='table'||(table.bytes%8===4?(!m.zero||m.zero.offset!==table.bytes||m.zero.bytes!==4):m.zero!==null))fail('mixed allocated table gap');
    if(m.initializer){const i=segments.findIndex(s=>s.kind==='initializer');if(segments[i-1]?.kind!=='literal'||segments[i+1]?.kind!=='literal')fail('mixed initializer between scalars');}
  }else if(segments[0].kind!=='literal'||segments[0].offset!==0||(m.zero&&segments.at(-1).kind!=='zero')||m.bytes!==Math.ceil((m.zero?m.zero.offset:m.bytes)/16)*16)fail('mixed native layout');
  if(!same(m.literals.map(s=>s.offset),[...m.literals.map(s=>s.offset)].sort((x,y)=>x-y)))fail('mixed literal order');
  return{...ordinary,native:m,intervals:segments};
}
function normalizeMixed(group){mixedContract(group);return group.auxiliary.sections.map(({memberSymbol,functionSymbol,...s})=>({...require('./active_targets').normalizeAuxiliarySectionContracts([s],group.id,'mixed auxiliary')[0],memberSymbol,functionSymbol}));}
function mixedReferenceSets(group){
  const c=mixedContract(group),refs=group.relocations.map((r,i)=>({...r,index:i})).filter(r=>r.symbolSection==='.rodata'),sets=[],used=new Set();
  for(let i=0;i<refs.length;i+=2){const hi=refs[i],lo=refs[i+1];
    if(!lo||hi.type!==5||lo.type!==6||hi.symbol!=='.rodata'||lo.symbol!=='.rodata'||hi.symbolValue||lo.symbolValue||lo.index!==hi.index+1)fail('mixed reference pair grammar/order');
    const addend=(((hi.word&65535)<<16)+(lo.word<<16>>16))>>>0,slot=c.native.literals.find(s=>s.offset===addend),table=addend===c.native.tableOffset,initializer=c.native.schemaVersion===2&&c.native.initializer?.offset===addend;
    if(Number(Boolean(slot))+Number(table)+Number(Boolean(initializer))!==1||lo.offset!==hi.offset+(table?8:4))fail('mixed reference role');
    if(initializer){const reg=hi.word>>>16&31;if(hi.word>>>26!==15||(hi.word>>>21&31)!==0||lo.word>>>26!==9||(lo.word>>>21&31)!==reg||(lo.word>>>16&31)!==reg)fail('mixed initializer reference');}
    else if(hi.word>>>16!==0x3c01||((lo.word>>>21)&31)!==1||lo.word>>>26!==(table?35:53))fail('mixed reference role/grammar');
    const fn=group.functions.filter(f=>hi.offset>=f.offset&&lo.offset+4<=f.offset+f.bytes);
    if(fn.length!==1||(table&&fn[0].symbol!==group.auxiliary.sections[0].functionSymbol))fail('mixed reference function attribution');
    if(used.has(addend))fail('mixed duplicate reference set');used.add(addend);sets.push({hi:hi.offset,lo:lo.offset,kind:table?'table':initializer?'initializer':'literal',addend,functionSymbol:fn[0].symbol});
  }
  if(sets.length!==c.native.literals.length+1+(c.native.initializer?1:0)||!used.has(c.native.tableOffset)||c.native.literals.some(s=>!used.has(s.offset))||(c.native.initializer&&!used.has(c.native.initializer.offset)))fail('mixed full reference census');return sets;
}

const mixedRaw = new WeakMap();
function mixedRawEvidence(elf,group){
  const c=mixedContract(group),binding=require('./retained_literal_references').mixedBinding(group),ro=elf.sections.filter(s=>s.name==='.rodata'),text=elf.sections.filter(s=>s.name==='.text');
  if(ro.length!==1||text.length!==1)fail('mixed native section census');const r=ro[0];
  if(r.type!==1||r.flags!==c.native.flags||r.address||r.alignment!==16||r.size!==c.native.bytes)fail('mixed native readonly shape');
  const raw=Buffer.from(elfSectionBytes(elf,r));if(hash(raw)!==c.native.expectedNativeSha256)fail('mixed native payload hash');
  const anchors=elf.symbols.filter(s=>s.sectionIndex===r.index);if(anchors.length!==1)fail('mixed extra/named symbol');const anchor=anchors[0];
  if(anchor.name||anchor.symbolType!==3||anchor.binding||anchor.value||anchor.size||anchor.visibility)fail('mixed raw section anchor');
  for(const s of c.intervals.filter(s=>s.kind!=='table'))if(hash(raw.subarray(s.offset,s.offset+s.bytes))!==s.expectedSha256)fail('mixed literal/zero payload');
  const table=group.auxiliary.sections[0],payload=raw.subarray(c.native.tableOffset,c.native.tableOffset+table.bytes);if(hash(payload)!==table.expectedObjectSha256)fail('mixed table object bytes');
  const rels=require('./compilation_groups').relocations(elf),rr=rels.filter(q=>q.owner.index===r.index),textAnchor=elf.symbols.filter(s=>s.sectionIndex===text[0].index&&s.symbolType===3);
  if(textAnchor.length!==1||rr.length!==table.entries)fail('mixed table REL census');
  rr.forEach((q,i)=>{const expected=table.expectedRelocations[i],off=c.native.tableOffset+i*4;
    if(q.place!==off||q.type!==2||q.symbol!==textAnchor[0]||q.symbol.value||q.symbol.name||q.symbol.binding||q.symbol.size||q.symbol.visibility
      ||Number(expected.offset)!==i*4||expected.type!=='R_MIPS_32'||expected.symbol!=='.text'||expected.section!=='.rel.rodata'||Number(expected.addend)!==raw.readUInt32BE(off))fail('mixed serialized table REL');
    const fn=group.functions.find(f=>f.symbol===table.functionSymbol),addend=raw.readUInt32BE(off);if(addend%4||addend<fn.offset||addend+4>fn.offset+fn.bytes)fail('mixed table destination');
  });
  const sets=mixedReferenceSets(group),incoming=rels.filter(q=>q.symbol===anchor),expectedPlaces=sets.flatMap(s=>[s.hi,s.lo]);
  if(incoming.length!==expectedPlaces.length||incoming.some((q,i)=>q.owner.index!==text[0].index||q.place!==expectedPlaces[i]||q.type!==(i%2?6:5)))fail('mixed incoming REL census');
  const txt=Buffer.from(elfSectionBytes(elf,text[0]));for(const s of sets){
    if(s.kind==='table'&&txt.readUInt32BE(s.hi+4)!==0x00220821)fail('mixed dispatch ADDU grammar');
    const hi=txt.readUInt32BE(s.hi),lo=txt.readUInt32BE(s.lo),originalHi=binding.rom.readUInt32BE(group.romStart+s.hi),originalLo=binding.rom.readUInt32BE(group.romStart+s.lo);
    if((hi>>>16)!==(originalHi>>>16)||(lo>>>16)!==(originalLo>>>16)||((((originalHi&65535)<<16)+(originalLo<<16>>16))>>>0)!==binding.evidence.base+s.addend)fail('mixed original reference equation');
  }
  const initializers=sets.filter(s=>s.kind==='initializer').map(s=>initializerUseEvidence(elf,group,s));
  const evidence={binding:binding.evidence,sets,...(c.native.schemaVersion===2?{initializers}:{}),raw:completeObjectCensus(elf),anchor:{symbolIndex:anchor.symbolIndex,symbolTableIndex:anchor.symbolTableIndex},tableRelocations:rr.map(q=>({place:q.place,type:q.type,symbolIndex:q.symbol.symbolIndex,word:raw.readUInt32BE(q.place)}))};
  mixedRaw.set(group,{input:Buffer.from(elf.buffer),identity:hash(Buffer.from(JSON.stringify(group))),evidence});return evidence;
}
function mixedAuthority(group){const r=mixedRaw.get(group);require('./retained_literal_references').mixedBinding(group);if(!r||r.identity!==hash(Buffer.from(JSON.stringify(group))))fail('mixed native authority');return r;}
function mixedMetadata(input,group){
  const elf=parseElf32BigEndian(input),e=mixedRawEvidence(elf,group),c=mixedContract(group),ro=elf.sections.find(s=>s.name==='.rodata'),rel=elf.sections.filter(s=>[4,9].includes(s.type)&&s.info===ro.index);
  if(rel.length!==1||rel[0].name!=='.rel.rodata'||rel[0].type!==9||rel[0].entrySize!==8)fail('mixed REL section shape');
  const output=Buffer.from(input),at=elf.sections[e.anchor.symbolTableIndex].offset+e.anchor.symbolIndex*16;
  output.writeUInt32BE(e.binding.base,at+4);output[at+12]=0;output.writeUInt16BE(0xfff1,at+14);
  output.writeUInt32BE(2,ro.headerOffset+8);output.writeUInt32BE(ro.offset+c.native.tableOffset,ro.headerOffset+16);output.writeUInt32BE(group.auxiliary.sections[0].bytes,ro.headerOffset+20);output.writeUInt32BE(group.auxiliary.sections[0].alignment,ro.headerOffset+32);
  for(let i=0;i<rel[0].size;i+=8)output.writeUInt32BE(input.readUInt32BE(rel[0].offset+i)-c.native.tableOffset,rel[0].offset+i);
  return{buffer:output,evidence:e};
}
function mixedProject(input,group){
  const metadata=mixedMetadata(input,group),text=elfTools.projectNativeTextOwners(metadata.buffer,group.owners.map(o=>({sectionName:o.sectionName,bytes:o.bytes})));
  // Only section names change after the existing text projection. No symbol,
  // payload, relocation, or header value is recreated by a lossy external tool.
  const parsed=elfTools.parseRelocatable(text.buffer),list={sections:parsed.sections.map(s=>({...s,data:Buffer.from(elfTools.sectionBytes(text.buffer,s))})),oldToNew:new Map(parsed.sections.map(s=>[s.index,s.index]))};
  const name=group.auxiliary.sections[0].outputSection;list.sections.find(s=>s.name==='.rodata').name=name;list.sections.find(s=>s.name==='.rel.rodata').name='.rel'+name;
  const shstr=elfTools.rebuildSectionNames(list,parsed.shstrIndex),buffer=elfTools.serialize(text.buffer,parsed,list,shstr);
  return{buffer,intermediate:text.buffer,mixedIntermediate:metadata.buffer,evidence:metadata.evidence};
}
const mixedStageTokens=new WeakMap();
function mixedStageResult(elf,group,stage,result){mixedStageTokens.set(result,{elf,group,stage,hash:hash(elf.buffer)});return result;}
function assertMixedStage(elf,group,stage,result){const token=mixedStageTokens.get(result);if(!token||token.elf!==elf||token.group!==group||token.stage!==stage||token.hash!==hash(elf.buffer))fail('mixed allocation requires native proof token');}
function mixedStage(elf,group,stage){
  if(stage==='raw'){const evidence=mixedRawEvidence(elf,group);const a=elf.symbols.find(s=>s.symbolIndex===evidence.anchor.symbolIndex&&s.symbolTableIndex===evidence.anchor.symbolTableIndex);return mixedStageResult(elf,group,stage,{proof:evidence,anchor:a,places:new Set(evidence.sets.flatMap(s=>[s.hi,s.lo]))});}
  const authority=mixedAuthority(group),reproduced=mixedProject(authority.input,group),expected=stage==='text-projected'?reproduced.intermediate:reproduced.buffer;
  if(stage!=='stripped'&&!elf.buffer.equals(expected))fail('mixed derivative differs from replay');
  if(stage==='stripped')mixedStripCompare(parseElf32BigEndian(expected),elf,group,0);
  const anchors=elf.symbols.filter(s=>s.sectionIndex===0xfff1&&s.value===authority.evidence.binding.base);if(anchors.length!==1)fail('mixed stage anchor census');
  return mixedStageResult(elf,group,stage,{proof:authority.evidence,anchor:anchors[0],places:new Set(authority.evidence.sets.flatMap(s=>[s.hi,s.lo]))});
}
function mixedStripCompare(before,after,group,anchorType){
  const binding=require('./retained_literal_references').mixedBinding(group),sectionName=(e,s)=>s.sectionIndex===0?'UND':s.sectionIndex===0xfff1?'ABS':e.sections[s.sectionIndex]?.name;
  const key=(e,s)=>({name:s.name,value:s.value,size:s.size,binding:s.binding,type:(s.sectionIndex===0xfff1&&s.value===binding.evidence.base)?0:s.symbolType,visibility:s.visibility,section:sectionName(e,s)});
  const abs=after.symbols.filter(s=>s.sectionIndex===0xfff1&&s.value===binding.evidence.base);if(abs.length!==1||abs[0].symbolType!==anchorType||abs[0].name||abs[0].binding||abs[0].size||abs[0].visibility)fail('mixed strip anchor');
  const mapped=new Set(),mapping=[];for(const s of before.symbols){const n=sectionName(before,s);if(['.reginfo','.pdr','.note','.comment'].includes(n)){if(require('./compilation_groups').relocations(before).some(r=>r.symbol===s))fail('mixed stripped referenced metadata');mapping.push({oldIndex:s.symbolIndex,newIndex:null,removedSection:n});continue;}
    const matches=after.symbols.filter(t=>same(key(before,s),key(after,t)));if(matches.length!==1||mapped.has(matches[0].symbolIndex))fail('mixed strip symbol mapping');mapped.add(matches[0].symbolIndex);mapping.push({oldIndex:s.symbolIndex,newIndex:matches[0].symbolIndex});}
  const added=after.symbols.filter(s=>!mapped.has(s.symbolIndex)),expectedAdded=['.rel'+group.auxiliary.sections[0].outputSection,...group.owners.slice(1).map(o=>o.sectionName),group.auxiliary.sections[0].outputSection];
  if(!same(added.map(s=>sectionName(after,s)),expectedAdded))fail('mixed strip generated section census');
  const afterR=require('./compilation_groups').relocations(after);for(const s of added)if(s.name||s.binding||s.symbolType!==3||s.value||s.size||s.visibility||afterR.some(r=>r.symbol===s))fail('mixed strip generated section symbol');
  const rel=(e,r)=>({owner:r.owner.name,place:r.place,type:r.type,symbol:key(e,r.symbol),word:e.buffer.readUInt32BE(r.owner.offset+r.place)});
  if(!same(require('./compilation_groups').relocations(before).map(r=>rel(before,r)),afterR.map(r=>rel(after,r))))fail('mixed strip REL conservation');
  const removed=new Set(['.reginfo','.pdr','.note','.comment']);const retained=before.sections.filter(s=>s.index&&!removed.has(s.name)&&!['.symtab','.strtab','.shstrtab'].includes(s.name));
  if(!same(after.sections.filter(s=>s.index&&!['.symtab','.strtab','.shstrtab'].includes(s.name)).map(s=>s.name).sort(),retained.map(s=>s.name).sort()))fail('mixed strip section census');
  for(const s of retained){const t=after.sections.find(t=>t.name===s.name);for(const k of ['type','flags','address','size','alignment','entrySize'])if(t[k]!==s[k])fail('mixed strip section shape');if(s.type!==9&&!Buffer.from(elfSectionBytes(before,s)).equals(Buffer.from(elfSectionBytes(after,t))))fail('mixed strip payload');}
  return{mapping,added:added.map(s=>({...s,section:sectionName(after,s)})),anchor:abs[0]};
}
function correctMixedStrip(source,intermediate,group){const a=parseElf32BigEndian(source),b=parseElf32BigEndian(intermediate),detail=mixedStripCompare(a,b,group,1),out=Buffer.from(intermediate),at=b.sections[detail.anchor.symbolTableIndex].offset+detail.anchor.symbolIndex*16+12;if(out[at]!==1)fail('mixed correction byte');out[at]=0;mixedStripCompare(a,parseElf32BigEndian(out),group,0);return{buffer:out,evidence:{intermediateSha256:hash(intermediate),finalSha256:hash(out),mapping:detail.mapping,added:detail.added,correction:{fileOffset:at,old:1,new:0}}};}
Object.assign(module.exports,{mixedMode,mixedContract,normalizeMixed,mixedReferenceSets,mixedRawEvidence,mixedStage,mixedProject,correctMixedStrip,assertMixedStage});
function mixedDerive(target,root,files){
  const group=target.compilationGroup,cg=require('./compilation_groups'),p7=require('./phase7_conventional'),source=fs.readFileSync(files.rawObject),intermediate=fs.readFileSync(files.stripIntermediateObject),final=fs.readFileSync(files.strippedObject);
  const tc=JSON.parse(fs.readFileSync(path.join(ROOT,'config/toolchain.json'),'utf8')),exe=path.resolve(ROOT,tc.localRoot,'bin/mips-kmc-elf-objcopy.exe');
  if(p7.sha256File(exe)!==target.model.config.binutils.tools['mips-kmc-elf-objcopy.exe'])fail('mixed strip tool identity');
  const dir=fs.mkdtempSync(path.join(require('os').tmpdir(),'ob64-mix-'));let reproduced;
  try{const input=path.join(dir,'input.o'),output=path.join(dir,'output.o');fs.writeFileSync(input,source);p7.run(exe,['--remove-section=.reginfo','--remove-section=.pdr','--remove-section=.comment','--remove-section=.note',input,output]);reproduced=fs.readFileSync(output);if(!fs.readFileSync(input).equals(source))fail('mixed replay input changed');}finally{fs.rmSync(dir,{recursive:true,force:true});}
  if(!reproduced.equals(intermediate)||!fs.readFileSync(files.rawObject).equals(source)||!fs.readFileSync(files.stripIntermediateObject).equals(intermediate)||!fs.readFileSync(files.strippedObject).equals(final))fail('mixed strip intermediate not reproduced');
  const correction=correctMixedStrip(source,intermediate,group);if(!correction.buffer.equals(final))fail('mixed final strip not reproduced');
  return{schemaVersion:1,binding:require('./retained_literal_references').mixedBinding(group).evidence,native:mixedAuthority(group).evidence,strip:correction.evidence,implementationSha256:p7.sha256File(__filename)};
}
module.exports.mixedDerive=mixedDerive;

// Finite GPR/control census for the initializer-containing function only.
// This proves the supported pinned-ABI reference shape, not memory safety.
function initializerInstruction(word) {
  const op=word>>>26,rs=word>>>21&31,rt=word>>>16&31,rd=word>>>11&31,sa=word>>>6&31,fn=word&63;
  const requireEncoding=ok=>{if(!ok)fail('initializer reserved/unsupported encoding');};
  let registers=[],control=null;
  if(op===0){
    if([0,2,3].includes(fn)){requireEncoding(rs===0);registers=[rt,rd];}
    else if([4,6,7,32,33,34,35,36,37,38,39,42,43].includes(fn)){requireEncoding(sa===0);registers=[rs,rt,rd];}
    else if([16,18].includes(fn)){requireEncoding(rs===0&&rt===0&&sa===0);registers=[rd];}
    else if([17,19].includes(fn)){requireEncoding(rt===0&&rd===0&&sa===0);registers=[rs];}
    else if([24,25,26,27].includes(fn)){requireEncoding(rd===0&&sa===0);registers=[rs,rt];}
    else if(fn===8){requireEncoding(rs===31&&rt===0&&rd===0&&sa===0);registers=[rs];control='return';}
    else requireEncoding(false);
  }else if(op===2)control='jump';
  else if([4,5,20,21].includes(op)){registers=[rs,rt];control='branch';}
  else if([6,7,22,23].includes(op)){requireEncoding(rt===0);registers=[rs];control='branch';}
  else if(op===1){requireEncoding([0,1,2,3].includes(rt));registers=[rs];control='branch';}
  else if([8,9,10,11,12,13,14].includes(op))registers=[rs,rt];
  else if(op===15){requireEncoding(rs===0);registers=[rt];}
  else if([32,33,34,35,36,37,38,39,40,41,42,43,46].includes(op))registers=[rs,rt];
  else if([49,53,57,61].includes(op)){if(op===53||op===61)requireEncoding(rt%2===0);registers=[rs];}
  else if(op===17){
    if([0,4].includes(rs)){requireEncoding((word&2047)===0);registers=[rt];}
    else if(rs===8){requireEncoding(rt<=3);control='branch';}
    else {
      requireEncoding([16,17,20,21].includes(rs));
      if(fn<=3)requireEncoding([16,17].includes(rs));
      else if(fn>=4&&fn<=15)requireEncoding([16,17].includes(rs)&&rt===0);
      else if(fn===32)requireEncoding([17,20,21].includes(rs)&&rt===0);
      else if(fn===33)requireEncoding([16,20,21].includes(rs)&&rt===0);
      else if([36,37].includes(fn))requireEncoding([16,17].includes(rs)&&rt===0);
      else if(fn>=48)requireEncoding([16,17].includes(rs)&&sa===0);
      else requireEncoding(false);
      // The pinned -mfp32 ABI uses even FPR pairs for double/long operands.
      if(rs===17||rs===21)requireEncoding(rd%2===0);
      if(rs===17&&(fn<=3||fn>=48))requireEncoding(rt%2===0);
      if((rs===17&&fn<=7)||(fn>=8&&fn<=11)||fn===33||fn===37)requireEncoding(sa%2===0);
    }
  }else requireEncoding(false);
  const writesReturnAddress=(op===0&&[0,2,3,4,6,7,16,18,32,33,34,35,36,37,38,39,42,43].includes(fn)&&rd===31)||([8,9,10,11,12,13,14,15,32,33,34,35,36,37,38,39].includes(op)&&rt===31)||(op===17&&rs===0&&rt===31);
  return{registers,control,writesReturnAddress,unconditional:control==='return'||control==='jump'||op===4&&rs===rt};
}
// Incoming destinations are a producer-wide property. This scan deliberately
// does not apply the initializer leaf's operand/call rules to other functions.
function initializerIncomingControls(elf,group,text,rels){
  const bytes=Buffer.from(elfSectionBytes(elf,text)),entries=[];
  for(let pc=0;pc<text.size;pc+=4){
    const word=bytes.readUInt32BE(pc),op=word>>>26,rs=word>>>21&31,rt=word>>>16&31;
    const branch=[4,5,6,7,20,21,22,23].includes(op)
      ||op===1&&[0,1,2,3,16,17,18,19].includes(rt)
      ||[16,17,18,19].includes(op)&&rs===8&&rt<=3;
    const at=rels.filter(r=>r.place===pc);
    if(branch){
      // This contract admits no PC16 or other branch relocation semantics.
      if(at.length)fail('initializer incoming branch relocation');
      entries.push({from:pc,to:pc+4+(word<<16>>16)*4,kind:'branch'});
    }else if(op===2||op===3){
      const addend=(word&0x3ffffff)*4;let to=null;
      if(at.length){
        if(at.length!==1||at[0].type!==4)fail('initializer incoming jump relocation');
        const symbol=at[0].symbol;
        if(symbol.sectionIndex===text.index)to=symbol.value+addend;
        else if(symbol.sectionIndex===0xfff1){if(!Number.isInteger(group.vramStart))fail('initializer unbound absolute jump');to=symbol.value+addend-group.vramStart;}
        else if(symbol.sectionIndex===0){
          // Authenticated fixed bindings include every linker alias into this
          // producer; external bindings outside it have no protected offset.
          const fixed=(group.fixedBindings||[]).filter(r=>r.symbol===symbol.name);
          if(fixed.length>1)fail('initializer incoming fixed binding ambiguity');
          if(fixed.length){if(!Number.isInteger(group.vramStart))fail('initializer unbound fixed jump');to=fixed[0].address+addend-group.vramStart;}
          else if(addend||symbol.value)fail('initializer unresolved incoming jump addend');
        }else fail('initializer unsupported incoming jump section');
      }else{
        if(!Number.isInteger(group.vramStart))fail('initializer unbound direct jump');
        to=(((group.vramStart+pc+4)&0xf0000000)>>>0)+addend-group.vramStart;
      }
      entries.push({from:pc,to,kind:op===2?'jump':'call'});
    }
  }
  return entries;
}
function initializerUseEvidence(elf,group,set) {
  const f=group.functions.find(f=>f.symbol===set.functionSymbol),text=elf.sections.find(s=>s.name==='.text');
  if(!f||!text||f.bytes<8)fail('initializer complete function');
  const b=Buffer.from(elfSectionBytes(elf,text)),start=set.hi-4,end=set.hi+56;
  if(start<f.offset||end>f.offset+f.bytes)fail('initializer window extent');
  const w=Array.from({length:15},(_,i)=>b.readUInt32BE(start+i*4));
  const op=x=>x>>>26,rs=x=>x>>>21&31,rt=x=>x>>>16&31,rd=x=>x>>>11&31;
  const source=rt(w[1]),dest=rd(w[0]),limit=rt(w[3]),temps=w.slice(4,8).map(rt);
  if([source,limit].some(r=>[0,1,2,3,29,31].includes(r))||new Set([source,dest,limit]).size!==3
    ||dest===0||dest===29||dest===31||new Set(temps).size!==4||temps.some(r=>[0,29,31,source,dest,limit].includes(r))
    ||w[0]!==((29<<21)|(dest<<11)|33)||op(w[1])!==15||rs(w[1])!==0
    ||op(w[2])!==9||rs(w[2])!==source||rt(w[2])!==source||set.lo!==set.hi+4
    ||op(w[3])!==9||rs(w[3])!==source||(w[3]&65535)!==64
    ||w[12]!==((9<<26)|(source<<21)|(source<<16)|16)
    ||w[13]!==((5<<26)|(source<<21)|(limit<<16)|0xfff6)
    ||w[14]!==((9<<26)|(dest<<21)|(dest<<16)|16))fail('initializer copy roles/window');
  for(let i=0;i<4;i++)if(w[4+i]!==(((35<<26)>>>0)|(source<<21)|(temps[i]<<16)|i*4)>>>0
    ||w[8+i]!==(((43<<26)>>>0)|(dest<<21)|(temps[i]<<16)|i*4)>>>0)fail('initializer load/store sequence');
  const rels=require('./compilation_groups').relocations(elf).filter(r=>r.owner.index===text.index);
  const inside=rels.filter(r=>r.place>=start&&r.place<end);if(inside.length!==2||inside[0].place!==set.hi||inside[1].place!==set.lo)fail('initializer extra window relocation');
  const decoded=new Map(),entries=[],controls=[];
  for(let pc=f.offset;pc<f.offset+f.bytes;pc+=4){const word=b.readUInt32BE(pc),d=initializerInstruction(word);decoded.set(pc,d);if(d.writesReturnAddress)fail('initializer modified return address');
    if((pc<start||pc>=end)&&d.registers.some(r=>r===source||r===limit))fail('initializer pointer used outside window');
    if(d.control==='branch')entries.push({from:pc,to:pc+4+(word<<16>>16)*4});
    if(d.control==='jump'){
      const r=rels.filter(r=>r.place===pc&&r.type===4);if(r.length!==1||r[0].symbol.sectionIndex!==text.index)fail('initializer external direct transfer');
      entries.push({from:pc,to:r[0].symbol.value+(word&0x3ffffff)*4});
    }
    if(d.control)controls.push(pc);
  }
  const terminal=f.offset+f.bytes-8,delay=terminal+4;
  if(!decoded.get(terminal)?.unconditional||decoded.get(delay)?.control)fail('initializer terminal fallthrough/delay');
  for(const pc of controls)if(pc+4>=f.offset+f.bytes||decoded.get(pc+4)?.control)fail('initializer control delay');
  for(const e of entries)if(e.to%4||e.to<f.offset||e.to+4>f.offset+f.bytes||e.to===delay
    ||e.to>start&&e.to<end&&!(e.from===start+52&&e.to===start+16))fail('initializer alternate/external control entry');
  const incomingControls=initializerIncomingControls(elf,group,text,rels);
  for(const entry of incomingControls)if(entry.to===delay||entry.to>start&&entry.to<end
    &&!(entry.from===start+52&&entry.to===start+16&&entry.kind==='branch'))fail('initializer producer-wide alternate entry');
  const addressEntries=elf.symbols.filter(s=>s.sectionIndex===text.index&&s.symbolType!==3&&s.name!=='gcc2_compiled.').map(s=>s.value);
  for(const r of require('./compilation_groups').relocations(elf).filter(r=>r.type===2&&r.symbol.sectionIndex===text.index))addressEntries.push(r.symbol.value+elf.buffer.readUInt32BE(r.owner.offset+r.place));
  const pending=new Map();for(const r of rels){const key=r.symbol.symbolIndex;if(r.type===5){if(!pending.has(key))pending.set(key,[]);pending.get(key).push(r);}else if(r.type===6){for(const hi of pending.get(key)||[])if(r.symbol.sectionIndex===text.index)addressEntries.push(r.symbol.value+((((elf.buffer.readUInt32BE(hi.owner.offset+hi.place)&65535)<<16)+(elf.buffer.readUInt32BE(r.owner.offset+r.place)<<16>>16))>>>0));pending.delete(key);}}
  if(addressEntries.some(pc=>pc===delay||pc>start&&pc<end))fail('initializer symbol/address alternate entry');
  return{functionSymbol:f.symbol,start,end,sourceRegister:source,endRegister:limit,destinationRegister:dest,temporaryRegisters:temps,bytes:64,iterations:4,controls:entries,incomingControls,terminal,delay};
}
Object.assign(module.exports,{initializerInstruction,initializerUseEvidence});
function mixedInitializerGrammar(compiler,group){
  const c=mixedContract(group);if(c.native.schemaVersion!==2||!c.native.initializer)fail('initializer compiler grammar context');
  if(!Buffer.isBuffer(compiler))fail('initializer compiler bytes');const source=compiler.toString('utf8');if(!Buffer.from(source).equals(compiler))fail('initializer compiler UTF8');
  const explicit=[...source.matchAll(/^[ \t]*\.section\b([^\r\n]*)$/gm)],texts=[...source.matchAll(/^[ \t]*\.text[ \t]*\r?$/gm)],broad=source.match(/^[ \t]*\.text\b[^\r\n]*$/gm)||[];
  const blocks=[...source.matchAll(/^[ \t]*\.section[ \t]+\.rodata[ \t]*\r?\n([\s\S]*?)^[ \t]*\.text[ \t]*\r?$/gm)];
  if(explicit.length!==2||texts.length!==3||broad.length!==3||blocks.length!==2||/^[ \t]*\.(?:data|bss|rdata|sdata)\b/m.test(source)
    ||explicit.some((m,i)=>!/^\s+\.rodata\s*$/.test(m[1])||!(texts[i].index<m.index&&m.index<texts[i+1].index)))fail('initializer compiler section census');
  const lines=block=>block.split(/\r?\n/).map(l=>l.replace(/#.*$/,'').trim().replace(/\s+/g,' ')).filter(Boolean),table=lines(blocks[0][1]),a=group.auxiliary.sections[0];
  if(!same(table.slice(0,3),['.align 3','.align 2',group.auxiliary.compilerLabel+':'])||table.length!==3+a.entries||table.slice(3).some(l=>!/^\.word \.L[0-9]+$/.test(l)))fail('initializer compiler table grammar');
  const data=lines(blocks[1][1]);if(data.length!==18||data[0]!=='.align 3'||!/^\.LC[0-9]+:$/.test(data[1]))fail('initializer compiler constant grammar');
  const bytes=Buffer.alloc(64);data.slice(2).forEach((l,i)=>{const m=/^\.word (0x[0-9a-fA-F]{1,8})$/.exec(l);if(!m)fail('initializer compiler word');bytes.writeUInt32BE(Number(m[1]),i*4);});
  if(hash(bytes)!==c.native.initializer.expectedSha256)fail('initializer compiler payload identity');
}

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
