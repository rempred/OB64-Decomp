'use strict';
const literals = require('./retained_literal_references');

// Compilation producers own artifacts; members retain accepted function ownership.
const fs = require('fs');
const auxiliary = require('./auxiliary_projection');
const path = require('path');
const { ROOT, parseElfFile, elfSectionBytes, sha256Buffer } = require('./phase7_conventional');
const { projectNativeTextOwners } = require('./elf_text_split');
const { exactKeys, same, hash } = require('./text_contract');
const CONFIG_PATH = path.join(ROOT, 'config/matching-c-compilation-groups.json');
const SAFE_ID = /^[a-z][a-z0-9_-]{0,63}$/;
const SAFE_SYMBOL = /^[A-Za-z_.$][A-Za-z0-9_.$]*$/;
const SHA = /^[0-9A-F]{64}$/;
const FUNCTIONS_MODE = 'native-text-owner-functions-projection';
const functionMode = group => group?.mode === FUNCTIONS_MODE;
const fragmentMode = group => group?.mode === 'native-text-owner-functions-readonly-fragment-projection';
const functionOwners = group => functionMode(group) || fragmentMode(group);
const readonlyProducer = group => auxiliary.composed(group) || fragmentMode(group);
const functionContexts = new Map();
const interiorContexts = new Map();
const interior = group => group?.mode === 'native-text-readonly-interior-run-projection';
function memberFunctions(group, index) { return functionOwners(group)
  ? group.members[index].functionSymbols.map(name => group.functions.find(fn => fn.symbol === name)) : [group.functions[index]]; }
function memberIndexAt(group, offset) {
  return group.members.findIndex((member, index) => { const fns = memberFunctions(group, index);
    return offset >= fns[0].offset && offset < fns.at(-1).offset + fns.at(-1).bytes; });
}
function authenticateFunctions(group, assemblySource = null) {
  if (!functionOwners(group)) return;
  const key = hash(group);
  let context = functionContexts.get(key);
  if (!context) {
    // Fresh proof/cache readers recover canonical authenticated context. They do
    // not trust a preserved envelope, report-supplied registry, or arbitrary IDs.
    const active = require('./active_targets').loadActiveTargetModel();
    const match = active.targets.find(t => t.compilationGroup && hash(t.compilationGroup) === key);
    if (!match) fail('unbound native function group');
    context = functionContexts.get(key);
  }
  if (!context || context.groupIdentity !== key) fail('native function group context');
  const logical = require('./logical_functions'), p7 = require('./phase7_conventional');
  if (p7.sha256File(logical.CONFIG_PATH) !== group.logicalBinding.registryIdentity.sha256
      || p7.sha256File(require('./active_targets').LINKAGE_CONFIG_PATH) !== group.fixedBindingIdentity.sha256) fail('native group registry/linkage inputs changed');
  const actual = logical.assertNativeGroupBodies(context.registry, context.rows, group);
  if (!same(actual, group.logicalBinding)) fail('native group logical binding drift');
  for (const row of context.rows) {
    if (assemblySource) assemblySource(row.part.file, row.part.sha256);
    else if (p7.sha256File(path.join(ROOT, row.part.file)) !== row.part.sha256) fail('native group original source drift');
  }
}
function fixedBindingRecords(group, symbols) {
  const result = [];
  for (const [symbol, addressText] of Object.entries(symbols)) {
    const address = Number(addressText), defined = group.functions.find(fn => fn.symbol === symbol);
    const owner = group.owners.find(o => address >= o.vramStartNumber && address < o.vramEndNumber);
    if (defined && address !== group.vramStart + defined.offset) fail('fixed/native definition address collision');
    if (!owner && !defined) continue;
    if (!owner || defined && (defined.binding !== 1 || defined.offset < owner.groupOffset
        || defined.offset + defined.bytes > owner.groupOffset + owner.bytes)) fail('fixed/native definition owner collision');
    result.push({ symbol, address, kind: defined ? 'native-global' : 'fixed-address',
      ownerRowIndex: owner.rowIndex, sectionName: owner.sectionName, ownerOffset: address - owner.vramStartNumber });
  }
  return result.sort((a,b) => a.symbol.localeCompare(b.symbol));
}
function verifyFixedBindings(target, elf) {
  const group = target.compilationGroup;
  if (!functionOwners(group)) return null;
  authenticateFunctions(group);
  const evidence = [];
  for (const record of group.fixedBindings) {
    const matches = elf.symbols.filter(s => s.name === record.symbol);
    if (matches.length !== 1 || matches[0].value !== record.address) fail('linked fixed binding identity');
    const symbol = matches[0], section = elf.sections[symbol.sectionIndex];
    if (record.kind === 'native-global' && (symbol.binding !== 1 || symbol.symbolType !== 2
        || symbol.visibility || section?.name !== record.sectionName
        || symbol.size !== group.functions.find(f => f.symbol === record.symbol).bytes)) fail('linked native fixed binding must be section-defined GLOBAL');
    if (record.kind === 'fixed-address' && symbol.sectionIndex !== 0xfff1) fail('fixed address unexpectedly redefined');
    evidence.push({ ...record, binding: symbol.binding, symbolType: symbol.symbolType, size: symbol.size, visibility: symbol.visibility, definedSection: section?.name || 'ABS' });
  }
  return evidence;
}
function fail(message) { throw new Error('compilation group: ' + message); }
function requireKeys(value, keys, label) { if (!exactKeys(value, keys)) fail(label + ' schema'); }
function integer(value, min = 0) { return Number.isSafeInteger(value) && value >= min; }
function power(value) { return integer(value, 4) && value <= 0x10000 && (value & (value - 1)) === 0; }
// Validate the new admission independently of registry loading: object, proof
// and cache entry points may receive serialized, already-bound contracts.
function singleOwnerContract(group) {
  if (!auxiliary.singleOwner(group) || !Array.isArray(group.members) || group.members.length !== 1
      || !Array.isArray(group.functions) || group.functions.length !== 1) fail('single-owner member/function census');
  const member = group.members[0], fn = group.functions[0], text = group.text, tail = group.tail;
  requireKeys(member, ['symbol', 'ownerRowIndex'], 'single-owner member');
  requireKeys(fn, ['symbol', 'offset', 'bytes', 'binding', 'symbolType', 'visibility'], 'single-owner function');
  requireKeys(text, ['section', 'bytes', 'alignment', 'type', 'flags', 'sha256'], 'single-owner text');
  requireKeys(tail, ['offset', 'bytes', 'sha256', 'origin'], 'single-owner tail');
  if (!SAFE_SYMBOL.test(member.symbol) || !integer(member.ownerRowIndex) || fn.symbol !== member.symbol
      || fn.offset !== 0 || !integer(fn.bytes, 4) || fn.bytes % 4 || fn.binding !== 1 || fn.symbolType !== 2 || fn.visibility
      || text.section !== '.text' || text.type !== 1 || text.flags !== 6 || !power(text.alignment)
      || !integer(text.bytes, 4) || !SHA.test(text.sha256)
      || tail.offset !== fn.bytes || tail.bytes !== Math.ceil(fn.bytes / text.alignment) * text.alignment - fn.bytes
      || tail.offset + tail.bytes !== text.bytes || tail.origin !== 'native-assembler-section-alignment'
      || tail.sha256 !== sha256Buffer(Buffer.alloc(tail.bytes))) fail('single-owner native partition');
  if (Object.hasOwn(group, 'owners')) {
    const owner = group.owners?.[0];
    if (!Array.isArray(group.owners) || group.owners.length !== 1 || owner.rowIndex !== member.ownerRowIndex
        || owner.symbol !== member.symbol || owner.groupOffset !== 0 || owner.bytes !== text.bytes
        || owner.alignment !== text.alignment || owner.romStartNumber !== group.romStart
        || owner.vramStartNumber !== group.vramStart || owner.romEndNumber !== group.romStart + text.bytes
        || owner.vramEndNumber !== group.vramStart + text.bytes) fail('single-owner physical coverage');
  }
}
function auxiliaryMode(group) {
  if (readonlyProducer(group) || Object.prototype.hasOwnProperty.call(group, 'auxiliary')) auxiliary.groupContract(group);
}
function alignment(group, offset) { let value = interior(group) ? 4 : group.text.alignment; while (offset % value) value /= 2; return value; }
function stem(target) { return target.compilationGroup ? 'groups/' + target.compilationGroup.id : target.symbol; }
function objectPath(target, suffix = '.o') { return 'objects/c/' + stem(target) + suffix; }
function assemblyPath(target, suffix = '.compiler.s') { return 'generated/c/' + stem(target) + suffix; }
function members(phase8, target) { return target.compilationGroup
  ? target.compilationGroup.members.map(member => phase8.targets.find(candidate => candidate.symbol === member.symbol)) : [target]; }
function normalizeAuxiliary(group) {
  if (fragmentMode(group)) return auxiliary.normalizeFragment(group);
  auxiliary.groupContract(group);
  const contracts = group.auxiliary.sections.map(({ memberSymbol, ...section }) => section);
  return require('./active_targets').normalizeAuxiliarySectionContracts(contracts, group.id, 'group auxiliary', group.auxiliary.projection, group)
    .map((section, index) => auxiliary.bundle(group) ? section : ({ ...section, memberSymbol: group.auxiliary.sections[index].memberSymbol }));
}
// Preserve the native REL record sequence. Descending addresses within one
// member are valid; regrouping interleaved member records is not byte-preserving.
function validateNativeRelocationOrder(group) {
  if (!Array.isArray(group.relocations) || !Array.isArray(group.functions) || !group.functions.length) fail('relocation census');
  const end = group.functions.at(-1).offset + group.functions.at(-1).bytes;
  const literalSets=literals.registryGroups(group),literalFirstLos=new Set(literalSets.filter(s=>s.los.length===2).map(s=>s.los[0]));
  const places = new Set(), pending = new Map();
  let previousOwner = -1, previousFunction = -1;
  for (const relocation of group.relocations) {
    requireKeys(relocation, ['offset', 'type', 'symbol', 'symbolValue', 'symbolSection', 'word'], 'relocation');
    if (!integer(relocation.offset) || relocation.offset % 4 || places.has(relocation.offset) || relocation.offset + 4 > end
        || ![4, 5, 6].includes(relocation.type) || typeof relocation.symbol !== 'string' || !SAFE_SYMBOL.test(relocation.symbol)
        || !integer(relocation.symbolValue) || !['.text', 'UND', 'ABS', ...(readonlyProducer(group)||group.retainedLiteralReferences ? ['.rodata'] : [])].includes(relocation.symbolSection)
        || !integer(relocation.word) || relocation.word > 0xffffffff) fail('relocation contract or duplicate place');
    places.add(relocation.offset);
    const fnIndex = group.functions.findIndex(fn => relocation.offset >= fn.offset && relocation.offset + 4 <= fn.offset + fn.bytes);
    const owner = functionOwners(group) ? memberIndexAt(group, relocation.offset) : fnIndex;
    if (functionOwners(group) && (fnIndex < 0 || fnIndex < previousFunction)) fail('native relocation function interleaving');
    previousFunction = fnIndex;
    if (functionOwners(group) && relocation.symbolSection === '.text' && relocation.type === 4) {
      const destination = relocation.symbolValue + (relocation.word & 0x03ffffff) * 4;
      if (destination % 4 || !group.functions.some(fn => destination >= fn.offset && destination + 4 <= fn.offset + fn.bytes)) fail('native function reference into tail/outside body');
    }
    if (owner < 0 || owner < previousOwner) fail('relocation member interleaving changes serialized order');
    previousOwner = owner;
    const key = JSON.stringify([relocation.symbolSection, relocation.symbol, relocation.symbolValue]);
    if (relocation.type === 5) {
      if (!pending.has(key)) pending.set(key, []);
      pending.get(key).push({ owner, fnIndex, word: relocation.word });
    } else if (relocation.type === 6) {
      const high = pending.get(key);
      if (!high?.length) fail('native LO16 without pending HI16');
      if (high.some(value => value.owner !== owner)) fail('native cross-owner HI16/LO16 pair');
      if (functionOwners(group) && high.some(value => value.fnIndex !== fnIndex)) fail('native cross-function HI16/LO16 pair');
      if (functionOwners(group) && relocation.symbolSection === '.text') for (const entry of high) {
        const low = relocation.word & 65535, addend = (((entry.word & 65535) << 16) + (low & 32768 ? low - 65536 : low)) >>> 0;
        const destination = relocation.symbolValue + addend;
        if (destination % 4 || !group.functions.some(fn => destination >= fn.offset && destination + 4 <= fn.offset + fn.bytes)) fail('native function HI/LO reference into tail/outside body');
      }
      if(!literalFirstLos.has(relocation.offset))pending.delete(key);
    }
  }
  if (pending.size) fail('native relocation has unmatched HI16');
}
function registry(config, profile) {
  requireKeys(config, ['schemaVersion', 'profile', 'groups'], 'registry');
  if (config.schemaVersion !== 1 || config.profile !== profile || !Array.isArray(config.groups)) fail('registry version/profile');
  const ids = new Set(), symbols = new Set(), sources = new Set();
  for (const group of config.groups) {
    requireKeys(group, ['id', 'source', 'mode', 'members', 'text', 'functions', 'tail', 'relocations',
      ...(group.retainedLiteralReferences ? ['retainedLiteralReferences'] : []), ...(readonlyProducer(group) ? ['auxiliary'] : []), ...(interior(group) ? ['interiorRun'] : [])], 'producer');
    if (fragmentMode(group) && group.retainedLiteralReferences) fail('fragment cannot combine retained literal mode');
    if(interior(group)) interiorContract(group);
    if (readonlyProducer(group)) {
      requireKeys(group.auxiliary, fragmentMode(group) ? ['sections', 'compilerLabel', 'alignmentDirectives'] : ['sections', 'projection'], 'auxiliary producer');
      const sections = normalizeAuxiliary(group);
      auxiliary.groupContract({ ...group, auxiliary: { ...group.auxiliary, sections } });
    }
    if (!SAFE_ID.test(group.id) || ids.has(group.id) || (!readonlyProducer(group) && !functionOwners(group) && group.mode !== 'native-text-owner-projection')
        || typeof group.source !== 'string' || !group.source.endsWith('.c') || sources.has(group.source)
        || path.isAbsolute(group.source) || group.source.includes('\\') || group.source.split('/').some(part => !part || part === '.' || part === '..')) fail('producer identity');
    ids.add(group.id); sources.add(group.source);
    if (!Array.isArray(group.members) || (auxiliary.singleOwner(group) ? group.members.length !== 1 : group.members.length < 2) || !Array.isArray(group.functions)
        || (functionOwners(group) ? group.functions.length < group.members.length : group.functions.length !== group.members.length)) fail('member/function census');
    requireKeys(group.text, ['section', 'bytes', 'alignment', 'type', 'flags', 'sha256'], 'native text');
    if (group.text.section !== '.text' || group.text.type !== 1 || group.text.flags !== 6
        || !integer(group.text.bytes, 4) || !power(group.text.alignment)
        || group.text.bytes % group.text.alignment || !SHA.test(group.text.sha256)) fail('native text shape');
    let end = 0, functionIndex = 0;
    for (const [index, member] of group.members.entries()) {
      requireKeys(member, ['symbol', 'ownerRowIndex', ...(functionOwners(group) ? ['functionSymbols'] : [])], 'member');
      if (!SAFE_SYMBOL.test(member.symbol) || symbols.has(member.symbol.toLowerCase()) || !integer(member.ownerRowIndex)) fail('member identity');
      symbols.add(member.symbol.toLowerCase());
      const names = functionOwners(group) ? member.functionSymbols : [member.symbol];
      if (!Array.isArray(names) || !names.length || names[0] !== member.symbol) fail('member function names');
      for (const name of names) {
        const fun = group.functions[functionIndex++];
        requireKeys(fun, ['symbol', 'offset', 'bytes', 'binding', 'symbolType', 'visibility'], 'function');
        if (fun.symbol !== name || !SAFE_SYMBOL.test(name) || group.functions.filter(f => f.symbol === name).length !== 1
            || fun.offset !== end || !integer(fun.bytes, 4) || fun.bytes % 4 || fun.binding !== 1 || fun.symbolType !== 2 || fun.visibility !== 0) fail('function partition');
        end += fun.bytes;
      }
    }
    if (functionIndex !== group.functions.length || new Set(group.members.map(m => m.ownerRowIndex)).size !== group.members.length) fail('member/function coverage');
    requireKeys(group.tail, ['offset', 'bytes', 'sha256', 'origin'], 'tail');
    if (group.tail.offset !== end || !integer(group.tail.bytes) || group.tail.bytes !== Math.ceil(end / group.text.alignment) * group.text.alignment - end
        || end + group.tail.bytes !== group.text.bytes || group.tail.origin !== (interior(group) ? 'native-subset-artifact' : 'native-assembler-section-alignment')
        || group.tail.sha256 !== sha256Buffer(Buffer.alloc(group.tail.bytes))) fail('native tail contract');
    if(group.retainedLiteralReferences)literals.registryGroups(group);
    validateNativeRelocationOrder(group);
  }
  return config.groups;
}
function bind(groups, targets, context = {}) {
  const assigned = new Set();
  for (const group of groups) {
    auxiliaryMode(group);
    const selected = group.members.map(member => {
      const matches = targets.filter(target => target.symbol === member.symbol && target.compilationGroupId === group.id);
      if (matches.length !== 1) fail('indivisible member activation');
      const target = matches[0];
      if (target.source !== group.source || target.rowIndex !== member.ownerRowIndex || target.nativeTextTail || target.multiOwner || target.auxiliaryProjection
          || target.compilerTextFunctionsExplicit || target.auxiliarySections.length || target.textOwners.length !== 1
          || target.row.slices.length !== 1 || target.row.ambiguous !== false || target.row.primaryClass !== 'code') fail('member owner/mode conflict');
      return target;
    });
    let offset = 0;
    const first = selected[0];
    const placement = target => {
      const slice = target.row.slices[0];
      return [slice.placementKind, slice.overlayDescriptorId, slice.loadSlabId, slice.overlaySection];
    };
    if (first.vramStartNumber % (interior(group) ? 4 : group.text.alignment)) fail('native group start alignment');
    const owners = selected.map((target, index) => {
      if (target.romStartNumber !== first.romStartNumber + offset || target.vramStartNumber !== first.vramStartNumber + offset
          || !same(placement(target), placement(first))
          || target.overlayDescriptorId !== first.overlayDescriptorId || target.descriptorRawSha256 !== first.descriptorRawSha256
          || memberFunctions(group, index)[0].offset !== offset
          || target.bytes !== memberFunctions(group, index).reduce((n, f) => n + f.bytes, 0) + (index === selected.length - 1 && !interior(group) ? group.tail.bytes : 0)) fail('member placement/extent');
      assigned.add(target.symbol);
      const owner = { ...target.textOwners[0], groupOffset: offset, alignment: alignment(group, offset) };
      delete owner.row;
      offset += target.bytes;
      return owner;
    });
    if (offset !== (interior(group) ? group.tail.offset : group.text.bytes)) fail('group extent');
    const normalized = { ...group, owners, romStart: first.romStartNumber, vramStart: first.vramStartNumber };
    for (const [index, target] of selected.entries()) {
      target.compilationGroup = normalized;
      target.groupMemberIndex = index;
      target.compilerTextFunctions = memberFunctions(group, index).map((fn, n) => ({ symbol: fn.symbol,
        offset: '0x' + (fn.offset - owners[index].groupOffset).toString(16).toUpperCase().padStart(8, '0'),
        offsetNumber: fn.offset - owners[index].groupOffset, bytes: fn.bytes, binding: 'GLOBAL', entryEvidence: n ? 'independent-entry-supported' : 'owner' }));
      if (functionOwners(group)) target.compilerTextFunctionsExplicit = true;
      target.expectedRelocations = expectedMemberRelocations(target);
    }
    if (functionOwners(group)) {
      const p7 = require('./phase7_conventional'), logical = require('./logical_functions'), active = require('./active_targets');
      const logicalRegistry = context.logicalRegistry || logical.loadRegistry(context.model, context.baserom);
      normalized.logicalBinding = logical.assertNativeGroupBodies(logicalRegistry, selected.map(t => t.row), normalized);
      normalized.fixedBindingIdentity = { path: 'config/matching-c-linkage.json', sha256: p7.sha256File(active.LINKAGE_CONFIG_PATH) };
      normalized.fixedBindings = fixedBindingRecords(normalized, context.linkSymbols || {});
      functionContexts.set(hash(normalized), { groupIdentity: hash(normalized), registry: logicalRegistry, rows: selected.map(t => t.row) });
    }
    if (readonlyProducer(group)) {
      const active = require('./active_targets');
      normalized.auxiliary = { ...group.auxiliary, sections: normalizeAuxiliary(normalized) };
      normalized.auxiliary.sections = normalized.auxiliary.sections.flatMap(section => active.resolveAuxiliarySectionContracts(
        context.model, context.baserom, selected.find(target => auxiliary.bundle(normalized) ? auxiliary.memberSections(normalized,target.symbol).some(s=>s.outputSection===section.outputSection) : target.symbol === section.memberSymbol), [section]));
      for (const member of selected) member.auxiliarySections = auxiliary.memberSections(normalized, member.symbol);
      if (!fragmentMode(group)) {
        auxiliary.assertCompleteGroupRows(normalized);
        normalized.auxiliary.retained = auxiliary.retainedBindings(first, context.model, context.baserom);
      }
      if(interior(group)) bindInterior(normalized, context.model, context.baserom);
    }
    if (fragmentMode(group)) {
      const logical = require('./logical_functions');
      const registry = context.logicalRegistry || logical.loadRegistry(context.model, context.baserom);
      const binding = { groupIdentity: hash(normalized), registry, rows: selected.map(t => t.row) };
      functionContexts.set(hash(normalized), binding);
      fragmentBindingContexts.set(normalized, { identity: fragmentUnorderedIdentity(normalized), context: binding });
    }

  }
  for (const target of targets) if (target.compilationGroupId && !assigned.has(target.symbol)) fail('unknown group reference');
}
function shape(section) { return { type: section.type, flags: section.flags, address: section.address,
  size: section.size, alignment: section.alignment, entrySize: section.entrySize, link: section.link, info: section.info }; }
const REGINFO = { type: 0x70000006, flags: 2, address: 0, size: 24, alignment: 4, entrySize: 1, link: 0, info: 0 };
function section(elf, name) { const values = elf.sections.filter(value => value.name === name); if (values.length !== 1) fail('section census: ' + name); return values[0]; }
function relocations(elf) {
  const result = [];
  for (const rel of elf.sections.filter(value => [4, 9].includes(value.type))) {
    if (rel.type !== 9 || rel.entrySize !== 8 || rel.size % 8) fail('unsupported relocation section');
    const owner = elf.sections[rel.info];
    if (!owner) fail('relocation owner missing');
    for (let offset = rel.offset; offset < rel.offset + rel.size; offset += 8) {
      const place = elf.buffer.readUInt32BE(offset), info = elf.buffer.readUInt32BE(offset + 4);
      const matches = elf.symbols.filter(symbol => symbol.symbolTableIndex === rel.link && symbol.symbolIndex === info >>> 8);
      if (matches.length !== 1) fail('relocation symbol census');
      result.push({ owner, place, type: info & 255, symbol: matches[0] });
    }
  }
  return result;
}
function allocation(elf, group, stage, literalStage = null) {
  const names = new Set();
  for (const sec of elf.sections) { if (sec.name && names.has(sec.name)) fail('duplicate section'); names.add(sec.name); }
  const projected = stage !== 'raw', stripped = stage === 'stripped';
  const textNames = projected ? group.owners.map(owner => owner.sectionName) : ['.text'];
  const roNames = readonlyProducer(group) ? auxiliary.groupReadonlyNames(group, stage) : [];
  if (fragmentMode(group)) {
    const nullSections = elf.sections.filter(sec => sec.name === '' || sec.type === 0);
    if (nullSections.length !== 1 || nullSections[0].index !== 0 || nullSections[0].name !== ''
        || ['nameOffset', 'type', 'flags', 'address', 'offset', 'size', 'link', 'info', 'alignment', 'entrySize']
          .some(key => nullSections[0][key] !== 0)) fail('fragment null section header shape');
    const payloads = new Set([...textNames, ...roNames, '.text', '.data', '.bss', '.reginfo']);
    const metadataTypes = { '': 0, '.note': 7, '.comment': 1, '.shstrtab': 3, '.strtab': 3, '.symtab': 2 };
    for (const sec of elf.sections) {
      if (['.data', '.bss'].includes(sec.name) && (sec.size !== 0 || sec.flags !== 3
          || sec.address !== 0 || sec.alignment !== 16 || sec.type !== (sec.name === '.data' ? 1 : 8))) fail('fragment writable storage shape');
      if (projected && sec.name === '.text' && (sec.size !== 0 || sec.type !== 1 || sec.flags !== 6)) fail('fragment residual text shape');
      if (payloads.has(sec.name)) continue;
      if (sec.type === 9 && sec.name === '.rel' + elf.sections[sec.info]?.name
          && [...textNames, ...roNames].includes(elf.sections[sec.info]?.name)
          && sec.flags === 0 && elf.sections[sec.link]?.name === '.symtab') continue;
      if (!Object.hasOwn(metadataTypes, sec.name) || sec.type !== metadataTypes[sec.name]
          || sec.flags !== 0 || sec.address !== 0) fail('fragment uncontracted object section: ' + sec.name);
    }
  }
  for (const sec of elf.sections.filter(value => value.flags & (auxiliary.singleOwner(group) ? 7 : 3))) {
    if(literalStage&&stage==='raw'&&sec.name==='.rodata'&&sec.index===literalStage.proof.raw.sections.find(s=>s.name==='.rodata').index)continue;
    if (textNames.includes(sec.name) || roNames.includes(sec.name)) continue;
    if (sec.name === '.reginfo' && !stripped) continue;
    if (['.data', '.bss'].includes(sec.name) && sec.size === 0 && sec.flags === 3 && sec.address === 0
        && sec.alignment === 16 && sec.type === (sec.name === '.data' ? 1 : 8)) continue;
    if (projected && sec.name === '.text' && sec.size === 0 && sec.type === 1 && sec.flags === 6) continue;
    fail('uncontracted allocated or writable section: ' + sec.name);
  }
  if (elf.symbols.some(symbol => [0xfff2, 0xff00, 0xff03].includes(symbol.sectionIndex) && symbol.size)) fail('nonzero COMMON');
  const metadata = elf.sections.filter(sec => sec.name === '.reginfo');
  if (stripped) { if (metadata.length) fail('stripped reginfo remains'); return null; }
  if (metadata.length !== 1 || !same(shape(metadata[0]), REGINFO)) fail('raw reginfo shape');
  const reg = metadata[0], definitions = elf.symbols.filter(symbol => symbol.sectionIndex === reg.index);
  if (definitions.length > 1 || definitions.some(symbol => symbol.name !== '' || symbol.value || symbol.size
      || symbol.binding !== 0 || symbol.symbolType !== 3 || symbol.visibility !== 0)) fail('reginfo symbols');
  if (elf.sections.some(sec => [4, 9].includes(sec.type) && sec.info === reg.index)
      || relocations(elf).some(rel => rel.symbol.sectionIndex === reg.index)) fail('reginfo relocation reference');
  return { ...REGINFO, sha256: sha256Buffer(elfSectionBytes(elf, reg)) };
}
function census(elf, group, stage, literalStage = null) {
  const raw = stage === 'raw';
  const sections = raw ? [section(elf, '.text')] : group.owners.map(owner => section(elf, owner.sectionName));
  const all = [];
  for (const [index, sec] of sections.entries()) {
    const bytes = raw ? group.text.bytes : group.owners[index].bytes;
    const align = raw ? group.text.alignment : group.owners[index].alignment;
    if (sec.type !== 1 || sec.flags !== 6 || sec.address !== 0 || sec.size !== bytes || sec.alignment !== align) fail('text shape');
    all.push(elfSectionBytes(elf, sec));
  }
  const bytes = Buffer.concat(all);
  if (sha256Buffer(bytes) !== (interior(group) && !raw ? group.interiorRun.expectedProjectedTextSha256 : group.text.sha256)) fail('raw text hash');
  if ((!interior(group) || raw) && !bytes.subarray(group.tail.offset).equals(Buffer.alloc(group.tail.bytes))) fail('native tail bytes');
  const offsetOf = sec => raw ? (sec.name === '.text' ? 0 : undefined)
    : group.owners.find(owner => owner.sectionName === sec.name)?.groupOffset;
  const functions = elf.symbols.filter(symbol => symbol.symbolType === 2).map(symbol => {
    const sec = elf.sections[symbol.sectionIndex], offset = sec && offsetOf(sec);
    if (offset === undefined) fail('uncontracted function');
    return { symbol: symbol.name, offset: offset + symbol.value, bytes: symbol.size,
      binding: symbol.binding, symbolType: symbol.symbolType, visibility: symbol.visibility };
  }).sort((a, b) => a.offset - b.offset || a.symbol.localeCompare(b.symbol));
  if (!same(functions, group.functions)) fail('complete function census');
  for (const symbol of elf.symbols) {
    const sec = elf.sections[symbol.sectionIndex];
    const compilerMarker = symbol.name === 'gcc2_compiled.' && symbol.symbolType === 1 && symbol.binding === 0
      && symbol.visibility === 0 && symbol.size === 0 && symbol.value === 0 && sec?.index === sections[0].index;
    if (sec && sections.some(value => value.index === sec.index) && symbol.symbolType !== 2 && symbol.symbolType !== 3
        && !compilerMarker) fail('uncontracted text symbol');
    if (sec && sections.some(value => value.index === sec.index) && symbol.symbolType === 3
        && (symbol.name !== '' || symbol.binding !== 0 || symbol.visibility !== 0 || symbol.value !== 0 || symbol.size !== 0)) fail('text section symbol shape');
  }
  if (elf.symbols.filter(symbol => symbol.name === 'gcc2_compiled.').length !== 1) fail('compiler marker census');
  for (const sec of sections) if (elf.symbols.filter(symbol => symbol.sectionIndex === sec.index && symbol.symbolType === 3).length > 1) fail('duplicate text section symbol');
  const records = relocations(elf).filter(rel => sections.some(sec => sec.index === rel.owner.index)).map(rel => {
    const ownerOffset = offsetOf(rel.owner), offset = ownerOffset + rel.place;
    if (![4, 5, 6].includes(rel.type) || rel.place % 4 || rel.place + 4 > rel.owner.size || offset + 4 > group.tail.offset) fail('load relocation place/type');
    if(literalStage&&literalStage.places.has(offset)){
      if(rel.symbol.symbolIndex!==literalStage.anchor.symbolIndex||rel.symbol.symbolTableIndex!==literalStage.anchor.symbolTableIndex)fail('group literal reference anchor drift');
      return {offset,type:rel.type,symbol:'.rodata',symbolValue:0,symbolSection:'.rodata',word:bytes.readUInt32BE(offset)};
    }
    const destination = elf.sections[rel.symbol.sectionIndex];
    const destOffset = destination && offsetOf(destination);
    const roAnchor = readonlyProducer(group) && destination?.name === auxiliary.groupReadonlyNames(group, stage)[0];
    let symbolSection = roAnchor ? '.rodata' : rel.symbol.sectionIndex === 0 ? 'UND' : rel.symbol.sectionIndex === 0xfff1 ? 'ABS' : destOffset !== undefined ? '.text' : null;
    if (!symbolSection) fail('load relocation references ancillary section');
    if (rel.symbol.symbolType === 3 && (!destination || (!roAnchor && destOffset !== 0) || rel.symbol.value !== 0)) fail('group section anchor drift');
    return { offset, type: rel.type, symbol: rel.symbol.symbolType === 3 ? (roAnchor ? '.rodata' : '.text') : rel.symbol.name,
      symbolValue: rel.symbol.value + (destOffset || 0), symbolSection, word: bytes.readUInt32BE(offset) };
  });
  if (!same(records, group.relocations)) fail('complete load relocation census');
  return { bytes: bytes.length, sha256: sha256Buffer(bytes), functions, relocations: records };
}
function validateObject(elf, group, stage) {
  auxiliaryMode(group);
  authenticateFunctions(group);
  if(interior(group)) authenticateInterior(group);
  validateNativeRelocationOrder(group);
  if (![...['raw', 'projected', 'stripped'], ...(readonlyProducer(group) ? ['text-projected'] : [])].includes(stage) || elf.header.type !== 1 || elf.header.machine !== 8
      || elf.header.entry !== 0 || elf.header.phoff !== 0 || elf.header.phnum !== 0) fail('relocatable object header/stage');
  const literalStage=group.retainedLiteralReferences?literals.groupStage(elf.buffer,group,stage):null;
  return { schemaVersion: 1, stage, groupSha256: hash(group), objectFlags: elf.header.flags,
    metadata: allocation(elf, group, stage, literalStage), ...census(elf, group, stage, literalStage),
    ...(literalStage?{retainedLiteralCensus:literals.census(elf.buffer)}:{}),
    ...(interior(group) ? { interiorText: interiorObject(elf,group,stage) } : {}),
    ...(readonlyProducer(group) ? { auxiliary: auxiliary.groupCensus(elf, group, stage), completeCensus: auxiliary.completeObjectCensus(elf) } : functionOwners(group) ? { completeCensus: auxiliary.completeObjectCensus(elf) } : {}) };
}
function project(input, group) {
  const raw = parseBuffer(input), rawEvidence = validateObject(raw, group, 'raw');
  const literalProjection=group.retainedLiteralReferences?literals.groupProject(input,group):null;
  const result = literalProjection || projectNativeTextOwners(interior(group) ? trimInterior(input,group) : input, group.owners.map(owner => ({ sectionName: owner.sectionName, bytes: owner.bytes })),
    auxiliary.singleOwner(group) ? group.mode : null);
  if (readonlyProducer(group)) {
    const intermediate = validateObject(parseBuffer(result.buffer), group, 'text-projected');
    if (!same(rawEvidence.metadata, intermediate.metadata)) fail('text projection changed reginfo');
    const final = auxiliary.projectGroupReadonly(result.buffer, group);
    const projected = validateObject(parseBuffer(final.buffer), group, 'projected');
    if (!same(rawEvidence.metadata, projected.metadata)) fail('read-only projection changed reginfo');
    return { ...result, buffer: final.buffer, intermediate: result.buffer };
  }
  const projected = validateObject(parseBuffer(result.buffer), group, 'projected');
  if (!same(rawEvidence.metadata, projected.metadata)) fail('projection changed reginfo');
  return result;
}
function parseBuffer(buffer) {
  // The project parser accepts an in-memory buffer through parseElf32BigEndian.
  return require('./phase7_conventional').parseElf32BigEndian(buffer);
}
module.exports = { CONFIG_PATH, registry, bind, alignment, stem, objectPath, assemblyPath, members,
  allocation, census, validateObject, project, relocations, parseBuffer, fail, REGINFO };

function memberRelocations(target, elf) {
  const group = target.compilationGroup, owner = group.owners[target.groupMemberIndex];
  validateObject(elf, group, elf.sections.some(sec => sec.name === '.reginfo') ? 'projected' : 'stripped');
  return expectedMemberRelocations(target);
}
function expectedMemberRelocations(target) {
  const group = target.compilationGroup, owner = group.owners[target.groupMemberIndex];
  const types = { 4: 'R_MIPS_26', 5: 'R_MIPS_HI16', 6: 'R_MIPS_LO16' };
  return group.relocations.filter(rel => rel.offset >= owner.groupOffset && rel.offset < owner.groupOffset + owner.bytes)
    .map(rel => ({ offset: '0x' + (rel.offset - owner.groupOffset).toString(16).toUpperCase().padStart(8, '0'),
      type: types[rel.type], symbol: rel.symbol, section: '.rel.text', groupOffset: rel.offset,
      symbolValue: rel.symbolValue, symbolSection: rel.symbolSection, word: rel.word }));
}
function contract(target) {
  auxiliaryMode(target.compilationGroup);
  auxiliary.assertMemberSections(target);
  const tc = require('./text_contract'), group = target.compilationGroup, owner = group.owners[target.groupMemberIndex];
  const ordinary = tc.resolveTextContract({ ...target, compilationGroup: null });
  return { ...ordinary, ...(group.retainedLiteralReferences?{retainedLiteralReferences:group.retainedLiteralReferences,retainedLiteralBinding:group.retainedLiteralBinding,literalImplementationSha256:require('./phase7_conventional').sha256File(require.resolve('./retained_literal_references'))}:{}), schemaVersion: fragmentMode(group) ? 12 : interior(group) ? 9 : auxiliary.bundle(group) ? 8 : auxiliary.singleOwner(group) ? 6 : functionOwners(group) ? 5 : readonlyProducer(group) ? 4 : 2,
    ...(functionOwners(group) || auxiliary.singleOwner(group) ? { tail: target.groupMemberIndex === group.members.length - 1 ? { ...group.tail, offset: group.tail.offset - owner.groupOffset } : null } : {}), mode: group.mode, producer: group,
    memberIndex: target.groupMemberIndex,
    ...(auxiliary.bundle(group) ? { memberOccurrences: auxiliary.groupOccurrences(group).filter(o=>o.memberSymbol===target.symbol) } : {}),
    owners: ordinary.owners.map(value => ({ ...value,
      expectedInputShape: { ...value.expectedInputShape, alignment: owner.alignment },
      expectedOutputShape: { ...value.expectedOutputShape, alignment: owner.alignment } })) };
}
function evidence(target, root, files = null) {
  const tc = require('./text_contract'), group = target.compilationGroup;
  auxiliaryMode(group);
  const artifact = (role, relative) => files ? { ...tc.artifact(path.dirname(files[role]), path.basename(files[role])), path: relative } : tc.artifact(root, relative);
  const artifacts = { compilationInput: artifact('compilationInput', target.source),
    compilerAssembly: artifact('compilerAssembly', assemblyPath(target)), assemblerInput: artifact('assemblerInput', assemblyPath(target, '.s')),
    rawObject: artifact('rawObject', objectPath(target, '.source-object.o')), strippedObject: artifact('strippedObject', objectPath(target)),
    unsplitAssemblerObject: artifact('unsplitAssemblerObject', objectPath(target, '.assembler-object.o')),
    ...(group.retainedLiteralReferences ? {literalProjectedObject:artifact('literalProjectedObject',objectPath(target,'.literal-projected.o')),stripIntermediateObject:artifact('stripIntermediateObject',objectPath(target,'.strip-intermediate.o'))}:{}),
    ...(readonlyProducer(group) ? { textProjectedObject: artifact('textProjectedObject', objectPath(target, '.text-projected.o')) } : {}) };
  const read = role => fs.readFileSync(files ? files[role] : path.join(root, artifacts[role].path));
  const compiler = read('compilerAssembly');
  if (!compiler.equals(read('assemblerInput'))) fail('compiler assembly was rewritten');
  if (readonlyProducer(group)) auxiliary.groupGrammar(compiler, group, require('./phase8_matching_c').adjustSectionAssembly);
  else require('./phase8_matching_c').adjustSectionAssembly(compiler, target.sectionName, {});
  const native = parseBuffer(read('unsplitAssemblerObject')), projected = parseBuffer(read('rawObject')), stripped = parseBuffer(read('strippedObject'));
  const reproduction = project(native.buffer, group);
  if (readonlyProducer(group) && !reproduction.intermediate.equals(read('textProjectedObject'))) fail('intermediate text projection is not reproducible');
  const stages = { raw: validateObject(native, group, 'raw'),
    ...(readonlyProducer(group) ? { textProjected: validateObject(parseBuffer(reproduction.intermediate), group, 'text-projected') } : {}), projected: validateObject(projected, group, 'projected'),
    stripped: validateObject(stripped, group, 'stripped') };
  if (stages.raw.objectFlags !== stages.projected.objectFlags) fail('projection changed object flags');
  // Pinned GNU 2.6 objcopy drops raw assembler flag bits during ancillary
  // removal. Record both headers; fresh production reproduction authenticates
  // that container change, while bytes, symbols and relocations stay exact.
  if (!same(stages.raw.metadata, stages.projected.metadata)) fail('projection metadata drift');
  // Independently inspect both objects in addition to deterministic writer replay.
  if (!reproduction.buffer.equals(projected.buffer)) fail('projection is not reproducible');
  const literalEvidence=group.retainedLiteralReferences?literals.derive(literals.groupTarget(group),root,{native:files?files.unsplitAssemblerObject:path.join(root,artifacts.unsplitAssemblerObject.path),reference:files?files.literalProjectedObject:path.join(root,artifacts.literalProjectedObject.path),source:files?files.rawObject:path.join(root,artifacts.rawObject.path),intermediate:files?files.stripIntermediateObject:path.join(root,artifacts.stripIntermediateObject.path),final:files?files.strippedObject:path.join(root,artifacts.strippedObject.path)}):null;
  const memberContract = contract(target), rawOwners = tc.ownerEvidence(projected, memberContract), strippedOwners = tc.ownerEvidence(stripped, memberContract);
  if (!same(rawOwners.map(value => value.record), strippedOwners.map(value => value.record))) fail('strip changed owner');
  const normalizedRelocations = memberRelocations(target, projected);
  if (!same(normalizedRelocations, memberRelocations(target, stripped))) fail('strip changed load relocations');
  const rawFunctions = tc.functionCensus(projected, rawOwners.map(value => value.section));
  const strippedFunctions = tc.functionCensus(stripped, strippedOwners.map(value => value.section));
  if (!same(rawFunctions, strippedFunctions)) fail('strip changed member functions');
  const rawRelocations = require('./phase8_matching_c').rawRelocationRecords(projected);
  return { ...(literalEvidence?{retainedLiteralReferences:literalEvidence}:{}), schemaVersion: fragmentMode(group)?20:literalEvidence?19:interior(group) ? 13 : auxiliary.bundle(group) ? 12 : auxiliary.singleOwner(group) ? 10 : functionOwners(group) ? 9 : readonlyProducer(group) ? 7 : 3,
    ...(readonlyProducer(group) ? { composition: { schemaVersion: fragmentMode(group) ? 7 : interior(group) ? 6 : auxiliary.bundle(group) ? 5 : auxiliary.singleOwner(group) ? 3 : 2, groupSha256: hash(group),
      nativeObjectSha256: sha256Buffer(native.buffer), textProjectedObjectSha256: sha256Buffer(reproduction.intermediate),
      projectedObjectSha256: sha256Buffer(projected.buffer), strippedObjectSha256: sha256Buffer(stripped.buffer),
      implementationSha256: require('./phase7_conventional').sha256File(require.resolve('./auxiliary_projection')),
      ...(fragmentMode(group) ? { fragmentImplementationSha256: fragmentImplementationIdentity() } : {}),
      auxiliaryContract: group.auxiliary,
      conservedTextProjection: auxiliary.conservedOutsideReadonly(parseBuffer(reproduction.intermediate), group),
      conservedFinalProjection: auxiliary.conservedOutsideReadonly(projected, group) } } : {}), textContractSha256: hash(memberContract), artifacts, producerStages: stages,
    rawOwners: rawOwners.map(value => value.record), strippedOwners: strippedOwners.map(value => value.record),
    rawFunctions, strippedFunctions, normalizedRelocations,
    rawRelocations: rawRelocations.filter(value => value.section === '.rel' + target.sectionName),
    discardedAncillaryRelocations: rawRelocations.filter(value => !group.owners.some(owner => value.section === '.rel' + owner.sectionName)
      && !(readonlyProducer(group) && group.auxiliary.sections.some(section => value.section === '.rel' + section.outputSection))),
    tail: target.groupMemberIndex === group.members.length - 1 && !interior(group) ? group.tail : null,
    assemblyMode: fragmentMode(group) ? 'untouched-native-text-owner-functions-readonly-fragment-projection' : interior(group) ? 'untouched-native-text-readonly-interior-run-projection' : auxiliary.singleOwner(group) ? 'untouched-native-text-readonly-single-owner-projection' : functionOwners(group) ? 'untouched-native-text-owner-functions-projection' : readonlyProducer(group) ? 'untouched-native-text-readonly-owner-projection' : 'untouched-native-text-owner-projection', compilerAssemblyRewritten: false };
}
const compiledProducers = new Map();
function compile(phase8, target, output, compiler, assembler, objcopy, options) {
  auxiliaryMode(target.compilationGroup);
  const p7 = require('./phase7_conventional'), policy = require('./source_policy'), p8 = require('./phase8_matching_c');
  const classification = p8.validateTargetClassification(target, options.classification);
  const key = path.resolve(output) + '\0' + target.compilationGroup.id;
  const identity = hash({ group: target.compilationGroup, classification: classification.digest,
    input: classification.compilationInput, compiler, assembler, objcopy });
  if (compiledProducers.has(key)) {
    if (compiledProducers.get(key) !== identity) fail('producer reused with changed inputs');
  } else {
    const sourceFile = path.join(output, target.source), compilerFile = path.join(output, assemblyPath(target));
    const adjustedFile = path.join(output, assemblyPath(target, '.s'));
    const rawFile = path.join(output, objectPath(target, '.assembler-object.o'));
    const projectedFile = path.join(output, objectPath(target, '.source-object.o')), finalFile = path.join(output, objectPath(target));
    for (const file of [sourceFile, compilerFile, adjustedFile, rawFile, projectedFile, finalFile]) {
      if (fs.existsSync(file)) fail('producer output already exists');
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    fs.writeFileSync(sourceFile, policy.compilationInputBytes(classification), { flag: 'wx' });
    p7.run(compiler, [...phase8.config.compiler.compileFlags, '-o', compilerFile, target.source], { cwd: output });
    policy.verifyClassificationInputs(classification);
    const bytes = fs.readFileSync(compilerFile);
    if (readonlyProducer(target.compilationGroup)) auxiliary.groupGrammar(bytes, target.compilationGroup, p8.adjustSectionAssembly);
    else p8.adjustSectionAssembly(bytes, target.sectionName, {});
    fs.writeFileSync(adjustedFile, bytes, { flag: 'wx' });
    p7.run(assembler, [...phase8.model.config.binutils.compilerAssemblerFlags, '-o', rawFile, adjustedFile], { cwd: output });
    const projection = project(fs.readFileSync(rawFile), target.compilationGroup);
    fs.writeFileSync(projectedFile, projection.buffer, { flag: 'wx' });
    if (readonlyProducer(target.compilationGroup)) fs.writeFileSync(path.join(output, objectPath(target, '.text-projected.o')), projection.intermediate, { flag: 'wx' });
    const stripFile=target.compilationGroup.retainedLiteralReferences?path.join(output,objectPath(target,'.strip-intermediate.o')):finalFile;
    p7.run(objcopy, ['--remove-section=.reginfo', '--remove-section=.pdr', '--remove-section=.comment', '--remove-section=.note', projectedFile, stripFile], { cwd: output });
    if(target.compilationGroup.retainedLiteralReferences){fs.writeFileSync(path.join(output,objectPath(target,'.literal-projected.o')),projection.referenceProjected,{flag:'wx'});fs.writeFileSync(finalFile,literals.correctStrip(projection.buffer,fs.readFileSync(stripFile),literals.groupTarget(target.compilationGroup),projection.evidence).buffer,{flag:'wx'});}
    evidence(target, output);
    compiledProducers.set(key, identity);
  }
  return compiledMember(target, output, classification);
}
function compiledMember(target, output, classification, files = null) {
  const p7 = require('./phase7_conventional'), p8 = require('./phase8_matching_c');
  const objectEvidence = evidence(target, output, files), elf = parseElfFile(files ? files.strippedObject : path.join(output, objectPath(target)));
  const artifactHash = role => objectEvidence.artifacts[role].sha256;
  const bytes = elfSectionBytes(elf, section(elf, target.sectionName));
  const functions = p8.verifyCompilerTextFunctions(elf, target, section(elf, target.sectionName));
  return { textContract: contract(target), objectEvidence, symbol: target.symbol,
    objectRelative: objectPath(target), objectSha256: artifactHash('strippedObject'),
    proofObjectRelative: objectPath(target, '.source-object.o'), proofObjectSha256: artifactHash('rawObject'),
    assemblerObjectRelative: objectPath(target, '.assembler-object.o'), assemblerObjectSha256: artifactHash('unsplitAssemblerObject'),
    compilerAssemblyRelative: assemblyPath(target), compilerAssemblySha256: artifactHash('compilerAssembly'),
    linkedAssemblyRelative: assemblyPath(target, '.s'), linkedAssemblySha256: artifactHash('assemblerInput'),
    compilationInput: { path: target.source, ...classification.compilationInput }, sourceClass: classification.class,
    sourcePolicyDigest: classification.digest, compilerAssemblyRewritten: false, textBytes: bytes.length, textSha256: sha256Buffer(bytes),
    compilerTextFunctions: functions, textOwners: [{ sectionName: target.sectionName, logicalOffset: 0, bytes: bytes.length, sha256: sha256Buffer(bytes) }],
    splitContract: { sourceSection: '.text', sourceBytes: target.compilationGroup.text.bytes, owners: target.compilationGroup.owners },
    relocations: memberRelocations(target, elf), auxiliarySections: target.auxiliarySections.map(section => {
      const value = p8.verifyAuxiliarySourceObjectSection(elf, target, section, 'group member auxiliary');
      const compilerOccurrences = p8.verifyAuxiliaryCompilerOccurrences(value.selectedBytes, value.relocations, section,
        target.symbol + ' ' + section.outputSection + ' group member auxiliary');
      return { compilerSection: section.compilerSection, outputSection: section.outputSection, bytes: value.selectedBytes.length,
        sha256: sha256Buffer(value.selectedBytes), alignment: value.section.alignment, flags: value.section.flags,
        relocations: value.relocations, ...value.padding, retainedInteriorBefore: fragmentMode(target.compilationGroup) ? require("./auxiliary_interior").projectInterior(section) : null,
        ...(compilerOccurrences === null ? {} : { compilerOccurrences }) };
    }) };
}
Object.assign(module.exports, { memberRelocations, contract, evidence, compile, compiledMember });

function collapseManifest(records, phase8) {
  const result = [], seen = new Set();
  for (const record of records) {
    const target = phase8.targets.find(value => value.symbol === record.targetSymbol);
    if (record.ownerKind !== 'matching-c-target' || !target?.compilationGroup) { result.push(record); continue; }
    if (seen.has(target.compilationGroup.id)) continue;
    seen.add(target.compilationGroup.id);
    const selected = members(phase8, target).map(member => {
      const matches = records.filter(value => value.ownerKind === 'matching-c-target' && value.targetSymbol === member.symbol);
      if (matches.length !== 1 || matches[0].path !== objectPath(member)) fail('manifest member census');
      return matches[0];
    });
    result.push({ path: record.path, bytes: record.bytes, sha256: record.sha256,
      ownerKind: 'matching-c-group', groupSha256: hash(target.compilationGroup), members: selected });
  }
  if (new Set(result.map(record => record.path)).size !== result.length) fail('duplicate linked producer path');
  return result;
}
function manifestMembers(records, phase8) {
  if (!Array.isArray(records)) fail('missing manifest');
  const result = [], paths = new Set();
  for (const record of records) {
    if (paths.has(record.path)) fail('duplicate linked object path'); paths.add(record.path);
    if (record.ownerKind !== 'matching-c-group') { result.push(record); continue; }
    requireKeys(record, ['path', 'bytes', 'sha256', 'ownerKind', 'groupSha256', 'members'], 'manifest producer');
    const selected = phase8.targets.filter(target => target.compilationGroup && objectPath(target) === record.path);
    if (!selected.length || !Array.isArray(record.members) || selected.length !== record.members.length
        || record.groupSha256 !== hash(selected[0].compilationGroup)) fail('manifest group identity');
    for (const [index, target] of members(phase8, selected[0]).entries()) {
      const member = record.members[index];
      if (member.targetSymbol !== target.symbol || member.ownerKind !== 'matching-c-target' || member.path !== record.path
          || member.bytes !== record.bytes || member.sha256 !== record.sha256) fail('manifest member identity');
      result.push(member);
    }
  }
  return result;
}
Object.assign(module.exports, { collapseManifest, manifestMembers });

const bundleProofContexts = new Map();
const bundleArtifactIdentities = new Set();
function registerBundleProofContext(phase8, target, output, classification, rom, proof) {
  if (fragmentMode(target.compilationGroup)) {
    fragmentProofContexts.set(hash(proof.objectEvidence.artifacts) + ":" + target.symbol, { phase8, target, output: path.resolve(output), classification, rom: Buffer.from(rom) });
    return;
  }
  if (!auxiliary.bundle(target.compilationGroup)) return;
  const artifacts = hash(proof.objectEvidence.artifacts);
  bundleArtifactIdentities.add(artifacts);
  bundleProofContexts.set(artifacts + ':' + target.symbol, {
    phase8, target, output: path.resolve(output), classification, rom: Buffer.from(rom),
    textContract: hash(contract(target)), artifacts: structuredClone(proof.objectEvidence.artifacts)
  });
}
function validateBundleProofArtifacts(proof) {
  const id = proof.objectEvidence?.artifacts === undefined ? null : hash(proof.objectEvidence.artifacts);
  if (!bundleArtifactIdentities.has(id) && ![8,9].includes(proof.textContract?.schemaVersion)
      && ![12,13].includes(proof.objectEvidence?.schemaVersion) && !auxiliary.bundle(proof.textContract?.producer)) return;
  const context = bundleProofContexts.get(id + ':' + proof.target?.symbol);
  if (!context || !auxiliary.bundle(context.target.compilationGroup)
      || hash(contract(context.target)) !== context.textContract) fail('bundle proof lacks fresh authenticated context');
  require('./source_policy').verifyClassificationInputs(context.classification);
  if (!same(proof.objectEvidence.artifacts, context.artifacts)) fail('bundle proof artifact identity drift');
  // The report supplies no filesystem authority. Re-read the registered native,
  // intermediate, projected, stripped and linked files, and reproduce every
  // source-policy, occurrence, relocation, ownership and map field independently.
  const fresh = require('./phase8_matching_c').deriveSourceObjectProof(context.phase8, context.target,
    context.output, context.classification, parseElfFile(path.join(context.output, 'phase8.elf')), context.rom).proof;
  if (!same(fresh, proof)) fail('bundle proof differs from independent artifact/link reconstruction');
}
Object.assign(module.exports, { registerBundleProofContext, validateBundleProofArtifacts });

function validateComposedProof(proof) {
  if (fragmentMode(proof.textContract?.producer)) return validateFragmentProof(proof);
  validateBundleProofArtifacts(proof);
  const object = proof.objectEvidence, text = proof.textContract;
  if (text?.producer) auxiliaryMode(text.producer);
  if (!auxiliary.composed(text?.producer) && ![5, 7, 10].includes(object?.schemaVersion) && text?.schemaVersion !== 6 && !object?.composition) return;
  const group = text?.producer, value = object?.composition, artifacts = object?.artifacts;
  if (group) validateNativeRelocationOrder(group);
  if (readonlyProducer(group)) auxiliary.groupContract(group);
  const compositionKeys = ['schemaVersion', 'groupSha256', 'nativeObjectSha256', 'textProjectedObjectSha256',
    'projectedObjectSha256', 'strippedObjectSha256', 'implementationSha256', 'auxiliaryContract',
    'conservedTextProjection', 'conservedFinalProjection'];
  const single = auxiliary.singleOwner(group);
  if(interior(group)) authenticateInterior(group);
  if (!readonlyProducer(group) || text.schemaVersion !== (interior(group) ? 9 : auxiliary.bundle(group) ? 8 : single ? 6 : 4) || text.mode !== group.mode || object.schemaVersion !== (interior(group) ? 13 : auxiliary.bundle(group) ? 12 : single ? 10 : 7)
      || !exactKeys(value, compositionKeys) || value.schemaVersion !== (interior(group) ? 6 : auxiliary.bundle(group) ? 5 : single ? 3 : 2) || !artifacts
      || !exactKeys(object.producerStages, ['raw', 'textProjected', 'projected', 'stripped'])
      || !same(value.auxiliaryContract, group.auxiliary) || value.groupSha256 !== hash(group)
      || !exactKeys(value.conservedTextProjection, ['flags', 'sections', 'symbols'])
      || !Array.isArray(value.conservedTextProjection.sections) || !Array.isArray(value.conservedTextProjection.symbols)
      || !same(value.conservedTextProjection, value.conservedFinalProjection)
      || !Number.isInteger(text.memberIndex) || group.members[text.memberIndex]?.symbol !== proof.target.symbol
      || !Array.isArray(proof.linkEvidence.auxiliaryProjectionRetained)
      || !same(proof.artifacts.assemblerObject, artifacts.unsplitAssemblerObject)
      || !same(proof.artifacts.object, artifacts.rawObject)
      || !same(proof.artifacts.linkedObjectAfterAncillaryRemoval, artifacts.strippedObject)) fail('composed proof schema/artifact binding');
  for (const [key, role] of [['nativeObjectSha256', 'unsplitAssemblerObject'], ['textProjectedObjectSha256', 'textProjectedObject'],
    ['projectedObjectSha256', 'rawObject'], ['strippedObjectSha256', 'strippedObject']]) {
    if (typeof value[key] !== 'string' || !SHA.test(value[key]) || value[key] !== artifacts[role]?.sha256) fail('composed proof object hash binding');
  }
  if (typeof value.implementationSha256 !== 'string' || !SHA.test(value.implementationSha256)) fail('composed proof implementation identity');
  if (single) {
    if (text.memberIndex !== 0 || object.textContractSha256 !== hash(text) || proof.linkEvidence.textContractSha256 !== hash(text)
        || !same(text.compilerTextFunctions, group.functions) || !same(object.rawFunctions, group.functions)
        || !same(object.strippedFunctions, group.functions) || !same(proof.linkEvidence.functions, group.functions)
        || !same(text.tail, group.tail) || !same(object.tail, group.tail) || !same(proof.linkEvidence.tail, group.tail)
        || object.assemblyMode !== 'untouched-native-text-readonly-single-owner-projection' || object.compilerAssemblyRewritten !== false
        || object.discardedAncillaryRelocations.length || artifacts.compilerAssembly.sha256 !== artifacts.assemblerInput.sha256
        || artifacts.compilerAssembly.bytes !== artifacts.assemblerInput.bytes
        || value.implementationSha256 !== require('./phase7_conventional').sha256File(require.resolve('./auxiliary_projection')))
      fail('single-owner proof function/tail/provenance binding');
  }
  if(auxiliary.bundle(group) && !same(text.memberOccurrences,auxiliary.groupOccurrences(group).filter(o=>o.memberSymbol===proof.target.symbol))) fail('bundle member occurrence evidence');
  const expectedAux = auxiliary.memberSections(group, proof.target.symbol);
  if (proof.assemblyContract.auxiliarySectionCount !== expectedAux.length
      || !same(proof.finalObject.auxiliarySections.map(section => section.outputSection), expectedAux.map(section => section.outputSection))
      || !same(proof.finalTarget.auxiliarySections.map(section => section.outputSection), expectedAux.map(section => section.outputSection))) fail('composed proof auxiliary attribution');
  for (const [index, section] of expectedAux.entries()) {
    const record = proof.finalObject.auxiliarySections[index], linked = proof.finalTarget.auxiliarySections[index];
    if (record.objectBytes !== section.bytes || record.objectSha256 !== section.expectedObjectSha256
        || record.acceptedObjectSha256 !== section.expectedObjectSha256
        || !same(record.loadRelevantRelocationsNormalized, section.expectedRelocations)
        || !same(record.acceptedLoadRelevantRelocations, section.expectedRelocations)
        || linked.bytes !== section.bytes || linked.linkedSha256 !== section.expectedLinkedSha256
        || linked.expectedLinkedSha256 !== section.expectedLinkedSha256 || linked.rawBytesExact !== true) fail('composed member payload conservation');
  }
  for (const [key, stage] of Object.entries(object.producerStages)) {
    const stageName = key === 'textProjected' ? 'text-projected' : key;
    if (stage.stage !== stageName || stage.groupSha256 !== hash(group) || stage.sha256 !== (interior(group) && stage.stage !== 'raw' ? group.interiorRun.expectedProjectedTextSha256 : group.text.sha256)
        || !same(stage.functions, group.functions) || !stage.auxiliary
        || stage.auxiliary.nativeSha256 !== group.auxiliary.projection.expectedObjectSha256
        || !same(stage.auxiliary.tableRelocations, object.producerStages.raw.auxiliary?.tableRelocations)
        || !exactKeys(stage.completeCensus, ['header', 'sections', 'symbols', 'relocations'])
        || !Array.isArray(stage.completeCensus.sections) || !Array.isArray(stage.completeCensus.symbols)
        || !Array.isArray(stage.completeCensus.relocations)) fail('composed proof complete stage census');
    validateComposedStage(stage, group, artifacts[{ raw: 'unsplitAssemblerObject', textProjected: 'textProjectedObject', projected: 'rawObject', stripped: 'strippedObject' }[key]]);
  }
  const retained = proof.linkEvidence.auxiliaryProjectionRetained;
  if (retained.length !== group.auxiliary.retained.length) fail('composed retained link census');
  for (const [index, binding] of group.auxiliary.retained.entries()) {
    const record = retained[index], extra = ['objectPath', 'objectSha256', 'loadIndex', 'contributionCount', 'fullRowExact'];
    if (!exactKeys(record, [...Object.keys(binding), ...extra])
        || Object.keys(binding).some(key => !same(record[key], binding[key]))
        || record.objectPath !== 'objects/assembly/chunk_' + String(binding.chunkIndex).padStart(3, '0') + '.o'
        || typeof record.objectSha256 !== 'string' || !SHA.test(record.objectSha256)
        || !integer(record.loadIndex) || record.contributionCount !== 1 || record.fullRowExact !== true) fail('composed retained link binding');
  }
  // Hash-only section evidence cannot replace independent object reproduction.
  // Here it must still agree with the exact conservation census and every stage.
  for (const key of ['textProjected', 'projected']) {
    const stage = object.producerStages[key], census = stage.completeCensus;
    const names = index => index > 0 && index < 0xff00 ? census.sections[index]?.name : index;
    const omitted = new Set(['.rodata', '.rel.rodata', '.shstrtab', ...group.auxiliary.sections.flatMap(s => [s.outputSection, '.rel' + s.outputSection])]);
    const conservation = { flags: stage.objectFlags, sections: census.sections.filter(s => !omitted.has(s.name)).map(s => ({
      name: s.name, type: s.type, flags: s.flags, address: s.address, bytes: s.size, alignment: s.alignment,
      entrySize: s.entrySize, link: names(s.link), info: s.type === 9 ? names(s.info) : s.info, sha256: s.type === 2 ? null : s.sha256 })),
    symbols: census.symbols.map(s => ({ ...s, symbolTableIndex: names(s.symbolTableIndex),
      sectionIndex: names(s.sectionIndex) === group.auxiliary.sections[0].outputSection ? '.rodata' : names(s.sectionIndex) })) };
    if (!same(conservation, value[key === 'textProjected' ? 'conservedTextProjection' : 'conservedFinalProjection'])) fail('composed census conservation binding');
  }
  for (const owner of group.owners) {
    const records = ['textProjected', 'projected', 'stripped'].map(key => object.producerStages[key].completeCensus.sections.find(s => s.name === owner.sectionName));
    if (!records.every(record => same(record, records[0]))) fail('composed cross-stage text census');
  }
  if (!same(object.producerStages.raw.metadata, object.producerStages.textProjected.metadata)
      || !same(object.producerStages.raw.metadata, object.producerStages.projected.metadata)) fail('composed cross-stage metadata');
}

function validateComposedStage(stage, group, artifact) {
  const keys = ['schemaVersion', 'stage', 'groupSha256', 'objectFlags', 'metadata', 'bytes', 'sha256', 'functions', 'relocations', 'auxiliary', 'completeCensus', ...(interior(group) ? ['interiorText'] : [])];
  const uint = value => integer(value) && value <= 0xffffffff;
  if (!exactKeys(stage, keys) || stage.schemaVersion !== 1 || !uint(stage.objectFlags)
      || stage.bytes !== (interior(group) && stage.stage !== 'raw' ? group.tail.offset : group.text.bytes) || !same(stage.relocations, group.relocations)
      || !exactKeys(stage.auxiliary, ['nativeSha256', 'payloadBytes', 'tableRelocations', 'references', 'marker', ...(auxiliary.bundle(group) ? ['occurrenceEvidence','paddingEvidence'] : [])])) fail('composed stage schema/contract');
  const c = stage.completeCensus, h = c.header;
  if (!exactKeys(h, ['type', 'machine', 'entry', 'phoff', 'shoff', 'flags', 'ehsize', 'phentsize', 'phnum', 'shentsize', 'shnum', 'shstrndx'])
      || Object.values(h).some(v => !uint(v)) || h.type !== 1 || h.machine !== 8 || h.entry || h.phoff || h.phnum
      || h.flags !== stage.objectFlags || h.ehsize !== 52 || h.shentsize !== 40 || h.shnum !== c.sections.length
      || !artifact || !exactKeys(artifact, ['path', 'bytes', 'sha256']) || typeof artifact.path !== 'string'
      || !integer(artifact.bytes, 52) || !SHA.test(artifact.sha256) || h.shoff + h.shnum * 40 > artifact.bytes
      || c.sections.length < 4 || c.sections[h.shstrndx]?.name !== '.shstrtab') fail('composed census header/artifact');
  const names = new Set();
  for (const s of c.sections) {
    if (!exactKeys(s, ['name', 'type', 'flags', 'address', 'size', 'alignment', 'entrySize', 'link', 'info', 'sha256'])
        || typeof s.name !== 'string' || names.has(s.name) || !SHA.test(s.sha256)
        || ['type', 'flags', 'address', 'size', 'alignment', 'entrySize', 'link', 'info'].some(k => !uint(s[k]))
        || s.size > artifact.bytes || s.link >= c.sections.length) fail('composed section census schema');
    names.add(s.name);
  }
  const section = name => c.sections.find(s => s.name === name);
  const raw = stage.stage === 'raw', nativeRO = raw || stage.stage === 'text-projected';
  const textOffset = name => raw ? (name === '.text' ? 0 : undefined) : group.owners.find(o => o.sectionName === name)?.groupOffset;
  const tables = group.auxiliary.projection.segments.filter(s => s.kind === 'payload');
  const roOffset = name => nativeRO ? (name === '.rodata' ? 0 : undefined) : tables.find(t => t.outputSection === name)?.offset;
  const textNames = raw ? ['.text'] : group.owners.map(o => o.sectionName);
  const roNames = nativeRO ? ['.rodata'] : tables.map(t => t.outputSection);
  for (const s of c.sections.filter(s => s.flags & (auxiliary.singleOwner(group) ? 7 : 3))) {
    if (textNames.includes(s.name) || roNames.includes(s.name) || (s.name === '.reginfo' && stage.stage !== 'stripped')) continue;
    if (['.data', '.bss'].includes(s.name) && !s.size && s.flags === 3 && !s.address && s.alignment === 16
        && s.type === (s.name === '.data' ? 1 : 8)) continue;
    if (!raw && s.name === '.text' && !s.size && s.type === 1 && s.flags === 6) continue;
    fail('composed allocated census');
  }
  for (const [index, name] of textNames.entries()) {
    const s = section(name), owner = group.owners[index];
    if (!s || s.type !== 1 || s.flags !== 6 || s.address || s.size !== (raw ? group.text.bytes : owner.bytes)
        || s.alignment !== (raw ? group.text.alignment : owner.alignment) || (raw && s.sha256 !== group.text.sha256)) fail('composed text section binding');
  }
  for (const [index, name] of roNames.entries()) {
    const s = section(name), contract = group.auxiliary.sections[index];
    if (!s || s.type !== 1 || s.flags !== 2 || s.address || s.size !== (nativeRO ? group.auxiliary.projection.bytes : contract.bytes)
        || s.alignment !== group.auxiliary.projection.alignment
        || s.sha256 !== (nativeRO ? group.auxiliary.projection.expectedObjectSha256 : contract.expectedObjectSha256)) fail('composed read-only section binding');
  }
  const metadata = section('.reginfo');
  if (stage.stage === 'stripped' ? metadata || stage.metadata !== null
      : !metadata || !same(stage.metadata, Object.fromEntries(Object.entries(metadata).filter(([k]) => k !== 'name')))
        || !same(Object.fromEntries(Object.entries(stage.metadata).filter(([k]) => k !== 'sha256')), REGINFO)) fail('composed metadata census binding');
  const symbolKeys = ['symbolTableIndex', 'symbolIndex', 'name', 'value', 'size', 'binding', 'symbolType', 'visibility', 'sectionIndex'];
  for (const [index, s] of c.sections.entries()) if (s.type === 2) {
    const symbols = c.symbols.filter(v => v.symbolTableIndex === index);
    if (s.entrySize !== 16 || symbols.length * 16 !== s.size || !symbols.length
        || symbols.some((v, i) => v.symbolIndex !== i)) fail('composed symbol census extent');
  }
  for (const s of c.symbols) if (!exactKeys(s, symbolKeys) || typeof s.name !== 'string'
      || symbolKeys.filter(k => k !== 'name').some(k => !uint(s[k])) || c.sections[s.symbolTableIndex]?.type !== 2
      || (s.sectionIndex < 0xff00 && !c.sections[s.sectionIndex])) fail('composed symbol census schema');
  if (auxiliary.singleOwner(group)) {
    for (const s of c.symbols) {
      if ([0xfff2, 0xff00, 0xff03].includes(s.sectionIndex) && s.size) fail('single-owner COMMON census');
      if (!textNames.includes(c.sections[s.sectionIndex]?.name) || s.symbolType === 2) continue;
      if (s.symbolType === 3 ? s.name || s.value || s.size || s.binding || s.visibility
          : s.name !== 'gcc2_compiled.' || s.value || s.size || s.binding || s.symbolType !== 1 || s.visibility)
        fail('single-owner text symbol census');
    }
    if (c.symbols.filter(s => textNames.includes(c.sections[s.sectionIndex]?.name) && s.symbolType === 3).length !== 1)
      fail('single-owner text anchor census');
  }
  for (const name of roNames) {
    const symbols = c.symbols.filter(s => c.sections[s.sectionIndex]?.name === name);
    if (symbols.length !== (name === roNames[0] || stage.stage === 'stripped' ? 1 : 0)
        || symbols.some(s => s.name || s.value || s.size || s.binding || s.symbolType !== 3 || s.visibility)) fail('composed read-only symbol census');
  }
  const functions = c.symbols.filter(s => s.symbolType === 2).map(s => ({ symbol: s.name,
    offset: textOffset(c.sections[s.sectionIndex]?.name) + s.value, bytes: s.size, binding: s.binding,
    symbolType: s.symbolType, visibility: s.visibility })).sort((a, b) => a.offset - b.offset);
  if (!same(functions, group.functions)) fail('composed function symbol binding');
  const marker = c.symbols.filter(s => s.name === 'gcc2_compiled.');
  if (marker.length !== 1 || marker[0].value || marker[0].size || marker[0].binding || marker[0].symbolType !== 1 || marker[0].visibility
      || c.sections[marker[0].sectionIndex]?.name !== textNames[0]
      || !same(stage.auxiliary.marker, { name: marker[0].name, value: 0, size: 0, binding: 0, symbolType: 1, visibility: 0, section: textNames[0] })) fail('composed marker binding');
  for (const r of c.relocations) if (!exactKeys(r, ['owner', 'place', 'type', 'symbol', 'word']) || !section(r.owner)
      || !uint(r.place) || r.place % 4 || r.place + 4 > section(r.owner).size || !uint(r.word) || ![2, 4, 5, 6].includes(r.type)
      || !c.symbols.some(s => same(s, r.symbol)) || r.symbol.name === 'gcc2_compiled.') fail('composed relocation census schema');
  for (const s of c.sections.filter(s => s.type === 9)) {
    const records = c.relocations.filter(r => r.owner === c.sections[s.info]?.name);
    if (s.entrySize !== 8 || records.length * 8 !== s.size || c.sections[s.link]?.type !== 2) fail('composed relocation section census');
    const bytes = Buffer.alloc(records.length * 8);
    records.forEach((r, i) => { bytes.writeUInt32BE(r.place, i * 8); bytes.writeUInt32BE((r.symbol.symbolIndex * 256 + r.type) >>> 0, i * 8 + 4); });
    if (sha256Buffer(bytes) !== s.sha256) fail('composed relocation section identity');
  }
  if (c.relocations.some(r => c.sections.filter(s => s.type === 9 && c.sections[s.info]?.name === r.owner).length !== 1)) fail('composed relocation owner census');
  const textRels = c.relocations.filter(r => textOffset(r.owner) !== undefined).map(r => {
    const destination = c.sections[r.symbol.sectionIndex]?.name;
    const base = textOffset(destination), isRO = destination === roNames[0];
    const symbolSection = isRO ? '.rodata' : base !== undefined ? '.text' : r.symbol.sectionIndex === 0 ? 'UND' : r.symbol.sectionIndex === 0xfff1 ? 'ABS' : null;
    return { offset: textOffset(r.owner) + r.place, type: r.type, symbol: r.symbol.symbolType === 3 ? symbolSection : r.symbol.name,
      symbolValue: r.symbol.value + (base || 0), symbolSection, word: r.word };
  });
  if (!same(textRels, group.relocations)) fail('composed relocation group binding');
  const tableRels = c.relocations.filter(r => roOffset(r.owner) !== undefined).map(r => ({ offset: roOffset(r.owner) + r.place,
    type: r.type, symbol: c.sections[r.symbol.sectionIndex]?.name === textNames[0] && r.symbol.symbolType === 3 ? '.text' : null,
    symbolValue: r.symbol.value, word: r.word }));
  const expectedTables = tables.flatMap((t, i) => group.auxiliary.sections[i].expectedRelocations.map(r => ({ offset: t.offset + Number(r.offset), type: 2, symbol: '.text', symbolValue: 0, word: Number(r.addend) })));
  for (const record of tableRels) {
    const index = tables.findIndex(table => record.offset >= table.offset && record.offset + 4 <= table.offset + table.bytes);
    const occurrence=auxiliary.bundle(group) && auxiliary.groupOccurrences(group).find(o=>record.offset>=o.offset&&record.offset+4<=o.offset+o.bytes);
    const member = index < 0 ? null : group.functions.find(member => member.symbol === (auxiliary.bundle(group) ? occurrence?.memberSymbol : group.auxiliary.sections[index].memberSymbol));
    if (record.word % 4) fail('composed table instruction destination alignment');
    if (!member || record.word < member.offset || record.word + 4 > member.offset + member.bytes) fail('composed table target attribution');
  }
  if (!same(tableRels, expectedTables) || !same(stage.auxiliary.tableRelocations, expectedTables)
      || stage.auxiliary.payloadBytes !== tables.reduce((sum, t) => sum + t.bytes, 0)
      || c.relocations.length !== textRels.length + tableRels.length) fail('composed table census binding');
  if(auxiliary.bundle(group)) {
    const bytes=Buffer.alloc(group.auxiliary.projection.bytes);
    for(const r of tableRels) bytes.writeUInt32BE(r.word,r.offset);
    if(sha256Buffer(bytes)!==group.auxiliary.projection.expectedObjectSha256
      || !same(stage.auxiliary.occurrenceEvidence,auxiliary.bundleEvidence(group,bytes,tableRels))
      || !same(stage.auxiliary.paddingEvidence,auxiliary.bundlePadding(group))) fail('bundle stage occurrence/padding evidence');
  }
  const references = [], pending = new Map();
  const memberAt = offset => group.functions.find(member => offset >= member.offset && offset + 4 <= member.offset + member.bytes);
  const inspectReference = (r, addend) => {
    if (r.symbolSection === '.rodata') {
      const index = tables.findIndex(table => addend >= table.offset && addend + 4 <= table.offset + table.bytes);
      if (r.symbol !== '.rodata' || r.symbolValue !== 0 || index < 0
          || memberAt(r.offset)?.symbol !== (auxiliary.bundle(group) ? auxiliary.groupOccurrences(group).find(o=>addend>=o.offset&&addend+4<=o.offset+o.bytes)?.memberSymbol : group.auxiliary.sections[index].memberSymbol)) fail('composed reference attribution/padding');
      const owner = raw ? 0 : group.owners.find(o => r.offset >= o.groupOffset && r.offset < o.groupOffset + o.bytes)?.groupOffset;
      references.push({ ownerOffset: owner, place: r.offset - owner, type: r.type, addend });
    } else if (r.symbolSection === '.text') {
      const offset = r.symbolValue + addend;
      if (!group.functions.some(member => offset >= member.offset && offset < member.offset + member.bytes)) fail('composed reference into text tail/outside functions');
    }
  };
  for (const r of group.relocations) {
    const key = r.symbolSection + ':' + r.symbol + ':' + r.symbolValue;
    if (r.type === 5) { if (!pending.has(key)) pending.set(key, []); pending.get(key).push(r); }
    else if (r.type === 6) {
      if (!pending.get(key)?.length) fail('composed reference pair');
      for (const high of pending.get(key)) {
        if (!memberAt(high.offset) || memberAt(high.offset) !== memberAt(r.offset)) fail('composed cross-owner HI16/LO16');
        inspectReference(r, (((high.word & 0xffff) << 16) + ((r.word << 16) >> 16)) >>> 0);
      }
      pending.delete(key);
    } else inspectReference(r, r.type === 2 ? r.word : (r.word & 0x03ffffff) * 4);
  }
  if (pending.size || !same(stage.auxiliary.references, references)) fail('composed reference census binding');
}
Object.assign(module.exports, { validateComposedProof, singleOwnerContract });

Object.assign(module.exports, { functionMode, fragmentMode, functionOwners, readonlyProducer, memberFunctions, authenticateFunctions, fixedBindingRecords, verifyFixedBindings });

// Distinct v5/v9 evidence for the owner/function mode. A self-compared report
// still needs current authenticated group context and complete stage censuses.
function validateFunctionGroupProof(proof) {
  if (fragmentMode(proof.textContract?.producer) || proof.textContract?.schemaVersion === 12 || proof.objectEvidence?.schemaVersion === 20) return validateFragmentProof(proof);
  const group = proof.textContract?.producer, object = proof.objectEvidence;
  if (!functionMode(group) && object?.schemaVersion !== 9 && proof.textContract?.schemaVersion !== 5) return;
  if (!functionMode(group) || proof.textContract.schemaVersion !== 5 || object?.schemaVersion !== 9
      || object.composition || proof.textContract.mode !== FUNCTIONS_MODE) fail('native functions proof schema');
  authenticateFunctions(group); validateNativeRelocationOrder(group);
  const member = proof.textContract.memberIndex, owner = group.owners[member];
  if (!owner || group.members[member].symbol !== proof.target.symbol
      || object.textContractSha256 !== hash(proof.textContract)
      || proof.linkEvidence.textContractSha256 !== hash(proof.textContract)
      || !exactKeys(object.producerStages, ['raw', 'projected', 'stripped'])) fail('native functions proof member binding');
  const expectedFunctions = memberFunctions(group, member).map(f => ({ ...f, offset: f.offset - owner.groupOffset }));
  if (!same(proof.textContract.compilerTextFunctions, expectedFunctions)
      || !same(object.rawFunctions, expectedFunctions) || !same(object.strippedFunctions, expectedFunctions)
      || !same(proof.linkEvidence.functions, expectedFunctions)) fail('native functions member proof census');
  const localTail = member === group.members.length - 1 ? { ...group.tail, offset: group.tail.offset - owner.groupOffset } : null;
  if (!same(proof.textContract.tail, localTail) || !same(proof.linkEvidence.tail, localTail)) fail('native functions member tail proof');
  if (!same(proof.artifacts.assemblerObject, object.artifacts?.unsplitAssemblerObject)
      || !same(proof.artifacts.object, object.artifacts?.rawObject)
      || !same(proof.artifacts.linkedObjectAfterAncillaryRemoval, object.artifacts?.strippedObject)
      || !same(object.tail, member === group.members.length - 1 ? group.tail : null)
      || object.assemblyMode !== 'untouched-native-text-owner-functions-projection'
      || object.compilerAssemblyRewritten !== false || object.discardedAncillaryRelocations.length) fail('native functions artifact/tail binding');
  const artifactRoles = { raw: 'unsplitAssemblerObject', projected: 'rawObject', stripped: 'strippedObject' };
  for (const [name, stage] of Object.entries(object.producerStages)) {
    if (!exactKeys(stage, ['schemaVersion','stage','groupSha256','objectFlags','metadata','bytes','sha256','functions','relocations','completeCensus'])
        || stage.schemaVersion !== 1 || stage.stage !== name || stage.groupSha256 !== hash(group)
        || stage.bytes !== group.text.bytes || stage.sha256 !== group.text.sha256
        || !same(stage.functions, group.functions) || !same(stage.relocations, group.relocations)) fail('native functions stage binding');
    const c = stage.completeCensus, artifact = object.artifacts?.[artifactRoles[name]];
    if (!c || !exactKeys(c, ['header','sections','symbols','relocations']) || !Array.isArray(c.sections)
        || !Array.isArray(c.symbols) || !Array.isArray(c.relocations) || !artifact || !SHA.test(artifact.sha256)
        || !integer(artifact.bytes,52) || c.header.type !== 1 || c.header.machine !== 8 || c.header.phnum
        || c.header.shnum !== c.sections.length || c.header.shoff + c.header.shnum*40 > artifact.bytes) fail('native functions complete census');
    const h=c.header, uint=value=>integer(value)&&value<=0xffffffff;
    if(!exactKeys(h,['type','machine','entry','phoff','shoff','flags','ehsize','phentsize','phnum','shentsize','shnum','shstrndx'])
        ||Object.values(h).some(v=>!uint(v))||h.entry||h.phoff||h.flags!==stage.objectFlags||h.ehsize!==52||h.shentsize!==40
        ||c.sections[h.shstrndx]?.name!=='.shstrtab'||!exactKeys(artifact,['path','bytes','sha256']))fail('native functions header binding');
    const raw = name === 'raw', names = raw ? ['.text'] : group.owners.map(o => o.sectionName);
    const offset = section => raw ? (section === '.text' ? 0 : undefined) : group.owners.find(o => o.sectionName === section)?.groupOffset;
    const sections = new Map();
    for (const sec of c.sections) {
      if (!exactKeys(sec,['name','type','flags','address','size','alignment','entrySize','link','info','sha256'])
          ||typeof sec.name!=='string'||['type','flags','address','size','alignment','entrySize','link','info'].some(k=>!uint(sec[k]))
          ||sec.link>=c.sections.length||sections.has(sec.name) || !SHA.test(sec.sha256) || !integer(sec.size) || sec.size > artifact.bytes) fail('native functions section census');
      sections.set(sec.name, sec);
      if (sec.flags & 3 && !names.includes(sec.name)) {
        if (sec.name === '.reginfo' && name !== 'stripped') continue;
        if (['.data','.bss'].includes(sec.name) && sec.size === 0 && sec.address === 0 && sec.flags === 3 && sec.alignment === 16
            && sec.type === (sec.name === '.bss' ? 8 : 1)) continue;
        if (!raw && sec.name === '.text' && !sec.size && sec.type === 1 && sec.flags === 6) continue;
        fail('native functions uncontracted allocated section');
      }
    }
    names.forEach((sectionName,i) => {
      const sec=sections.get(sectionName), expected=raw?group.text:{bytes:group.owners[i].bytes,alignment:group.owners[i].alignment};
      if (!sec || sec.type!==1 || sec.flags!==6 || sec.address || sec.size!==expected.bytes || sec.alignment!==expected.alignment
          || raw && sec.sha256!==group.text.sha256) fail('native functions text ownership census');
    });
    const metadata = sections.get('.reginfo');
    if (name==='stripped' ? metadata || stage.metadata!==null : !metadata
        || !same(stage.metadata,Object.fromEntries(Object.entries(metadata).filter(([k])=>k!=='name')))
        || !same(Object.fromEntries(Object.entries(stage.metadata).filter(([k])=>k!=='sha256')),REGINFO)) fail('native functions metadata census');
    const symbolKeys=['symbolTableIndex','symbolIndex','name','value','size','binding','symbolType','visibility','sectionIndex'];
    for(const [index,sec] of c.sections.entries())if(sec.type===2){const symbols=c.symbols.filter(s=>s.symbolTableIndex===index);
      if(sec.entrySize!==16||symbols.length*16!==sec.size||!symbols.length||symbols.some((s,i)=>s.symbolIndex!==i))fail('native functions symbol extent');}
    for(const sym of c.symbols) if(!exactKeys(sym,symbolKeys)||typeof sym.name!=='string'
        || symbolKeys.filter(k=>k!=='name').some(k=>!uint(sym[k]))||c.sections[sym.symbolTableIndex]?.type!==2
        || sym.sectionIndex<0xff00&&!c.sections[sym.sectionIndex]) fail('native functions symbol schema');
    const funcs=c.symbols.filter(sym=>sym.symbolType===2).map(sym=>({symbol:sym.name,offset:offset(c.sections[sym.sectionIndex]?.name)+sym.value,bytes:sym.size,binding:sym.binding,symbolType:2,visibility:sym.visibility})).sort((a,b)=>a.offset-b.offset);
    if(!same(funcs,group.functions))fail('native functions complete symbol binding');
    const marker=c.symbols.filter(sym=>sym.name==='gcc2_compiled.');
    if(marker.length!==1||marker[0].value||marker[0].size||marker[0].binding||marker[0].symbolType!==1||marker[0].visibility||c.sections[marker[0].sectionIndex]?.name!==names[0])fail('native functions marker');
    for(const sym of c.symbols)if(names.includes(c.sections[sym.sectionIndex]?.name)&&sym.symbolType!==2&&sym!==marker[0]
        &&(sym.symbolType!==3||sym.name||sym.value||sym.size||sym.binding||sym.visibility))fail('native functions uncontracted text symbol');
    for(const rel of c.relocations)if(!exactKeys(rel,['owner','place','type','symbol','word'])||!sections.has(rel.owner)
        ||!integer(rel.place)||rel.place%4||rel.place+4>sections.get(rel.owner).size||!integer(rel.word)||rel.word>0xffffffff
        ||![4,5,6].includes(rel.type)||!c.symbols.some(sym=>same(sym,rel.symbol)))fail('native functions relocation schema');
    const textRels=c.relocations.filter(r=>offset(r.owner)!==undefined).map(r=>{
      const destination=c.sections[r.symbol.sectionIndex]?.name,base=offset(destination);
      const symbolSection=base!==undefined?'.text':r.symbol.sectionIndex===0?'UND':r.symbol.sectionIndex===0xfff1?'ABS':null;
      if(r.symbol.symbolType===3&&(base!==0||r.symbol.value!==0))fail('native functions section anchor');
      return {offset:offset(r.owner)+r.place,type:r.type,symbol:r.symbol.symbolType===3?symbolSection:r.symbol.name,symbolValue:r.symbol.value+(base||0),symbolSection,word:r.word};
    });
    if(c.relocations.some(r=>c.sections.filter(s=>s.type===9&&c.sections[s.info]?.name===r.owner).length!==1))fail('native functions REL ownership');
    if(!same(textRels,group.relocations)||c.relocations.length!==textRels.length)fail('native functions ordered relocation census');
    for(const sec of c.sections.filter(sec=>sec.type===9)){
      const records=c.relocations.filter(r=>r.owner===c.sections[sec.info]?.name),bytes=Buffer.alloc(records.length*8);
      if(sec.entrySize!==8||sec.size!==bytes.length||c.sections[sec.link]?.type!==2)fail('native functions REL section');
      records.forEach((r,i)=>{bytes.writeUInt32BE(r.place,i*8);bytes.writeUInt32BE((r.symbol.symbolIndex*256+r.type)>>>0,i*8+4);});
      if(sha256Buffer(bytes)!==sec.sha256)fail('native functions serialized REL identity');
    }
  }
  const linked=proof.linkEvidence.fixedBindings;
  if(!Array.isArray(linked)||linked.length!==group.fixedBindings.length)fail('native functions fixed binding census');
  for(const [i,record]of group.fixedBindings.entries()){
    const actual=linked[i],fn=group.functions.find(f=>f.symbol===record.symbol);
    if(!exactKeys(actual,[...Object.keys(record),'binding','symbolType','size','visibility','definedSection'])
        ||Object.entries(record).some(([key,value])=>!same(actual[key],value))
        ||record.kind==='native-global'&&(actual.binding!==1||actual.symbolType!==2||actual.size!==fn.bytes||actual.visibility||actual.definedSection!==record.sectionName)
        ||record.kind==='fixed-address'&&actual.definedSection!=='ABS')fail('native functions linked fixed binding proof');
  }
  if(!same(object.producerStages.raw.metadata,object.producerStages.projected.metadata))fail('native functions projected metadata drift');
  for(const o of group.owners){const a=object.producerStages.projected.completeCensus.sections.find(s=>s.name===o.sectionName),b=object.producerStages.stripped.completeCensus.sections.find(s=>s.name===o.sectionName);if(!same(a,b))fail('native functions stripped text drift');}
}
Object.assign(module.exports, { validateFunctionGroupProof });


// An interior run is a bounded representation of complete accepted functions.
// It makes no historical compilation-unit start/end claim.
function interiorContract(group) {
  if(!interior(group) || !auxiliary.bundle(group)) fail('interior readonly bundle mode');
  const r=group.interiorRun;
  requireKeys(r,['schemaVersion','mode','outputAlignment','precedingOwnerRowIndex','followingOwnerRowIndex','expectedProjectedTextSha256',...(Object.hasOwn(r||{},'binding')?['binding']:[])],'interior run');
  if(r.schemaVersion!==1||r.mode!=='accepted-interior-member-run'||r.outputAlignment!==4
    ||!integer(r.precedingOwnerRowIndex)||!integer(r.followingOwnerRowIndex)||!SHA.test(r.expectedProjectedTextSha256)
    ||group.text.alignment!==16||group.tail.bytes<0||group.tail.bytes>12||group.tail.bytes%4
    ||group.tail.origin!=='native-subset-artifact') fail('interior run native shape');
  if(!Array.isArray(group.members)||group.members.length<2||!Array.isArray(group.functions)||group.functions.length!==group.members.length)fail('interior function/member census');
  let end=0;const names=new Set();
  for(const [i,f] of group.functions.entries()){
    requireKeys(f,['symbol','offset','bytes','binding','symbolType','visibility'],'interior native function');
    if(f.symbol!==group.members[i].symbol||names.has(f.symbol)||f.offset!==end||!integer(f.bytes,4)||f.bytes%4||f.binding!==1||f.symbolType!==2||f.visibility)fail('interior complete function partition');
    end+=f.bytes;names.add(f.symbol);
  }
  if(group.tail.offset!==end||group.text.bytes!==Math.ceil(end/16)*16||group.tail.bytes!==group.text.bytes-end
    ||group.tail.sha256!==sha256Buffer(Buffer.alloc(group.tail.bytes)))fail('interior minimal subset tail');
}
function interiorOriginal(row,model,rom) {
  if(!row||row.inputKind!=='tracked-assembly'||row.primaryClass!=='code'||row.ambiguous!==false||!row.part||row.slices?.length!==1) fail('interior accepted original row');
  const slice=row.slices[0];
  if(!slice.executable||slice.placementKind!=='overlay'||slice.overlaySection!=='text'||slice.overlayDescriptorId===null
    ||slice.bytes!==row.bytes||slice.romStart!==row.romStart||slice.romEndExclusive!==row.romEndExclusive
    ||slice.vramEndExclusive-slice.vramStart!==row.bytes) fail('interior original placement');
  const file=path.resolve(ROOT,row.part.file);
  if(!file.startsWith(ROOT+path.sep)||require('./phase7_conventional').sha256File(file)!==row.part.sha256) fail('interior original source identity');
  const source=fs.readFileSync(file,'utf8');
  const words=[...source.matchAll(/\/\* 0x([0-9A-Fa-f]{8})[^\n]*?\*\/ \.word 0x([0-9A-Fa-f]{8})/g)]
    .filter(m=>parseInt(m[1],16)>=row.romStart&&parseInt(m[1],16)<row.romEndExclusive);
  const bytes=Buffer.alloc(row.bytes);
  if(words.length*4!==row.bytes||row.romStart<0||row.romEndExclusive>rom.length) fail('interior original word coverage');
  words.forEach((m,i)=>{if(parseInt(m[1],16)!==row.romStart+i*4)fail('interior original word order');bytes.writeUInt32BE(parseInt(m[2],16)>>>0,i*4);});
  if(!bytes.equals(rom.subarray(row.romStart,row.romEndExclusive))) fail('interior original ROM mismatch');
  // A padding boundary following the final return+delay instruction is not an
  // interior cut. Zero-free boundary words are required conservatively here;
  // ambiguous original padding needs separate evidence, not an override flag.
  if(!bytes.readUInt32BE(0)||!bytes.readUInt32BE(bytes.length-4)) fail('interior original boundary has zero padding or is ambiguous');
  return {rowIndex:row.index,sectionName:slice.sectionName,romStart:row.romStart,romEndExclusive:row.romEndExclusive,
    vramStart:slice.vramStart,vramEndExclusive:slice.vramEndExclusive,bytes:row.bytes,overlayDescriptorId:slice.overlayDescriptorId,
    originalAssembly:row.part.file,originalAssemblySha256:row.part.sha256,originalBytesSha256:sha256Buffer(bytes),firstWord:bytes.readUInt32BE(0),lastWord:bytes.readUInt32BE(bytes.length-4)};
}
function interiorBinding(group,model,rom) {
  interiorContract(group);
  const ids=[group.interiorRun.precedingOwnerRowIndex,...group.members.map(m=>m.ownerRowIndex),group.interiorRun.followingOwnerRowIndex];
  if(new Set(ids).size!==ids.length) fail('interior neighbour/member collision');
  const records=ids.map(id=>{const rows=model.rows.filter(r=>r.index===id);if(rows.length!==1)fail('interior neighbour row census');return interiorOriginal(rows[0],model,rom);});
  for(let i=1;i<records.length;i++){
    const p=records[i-1],r=records[i];
    if(p.romEndExclusive!==r.romStart||p.vramEndExclusive!==r.vramStart||p.overlayDescriptorId!==r.overlayDescriptorId
      ||model.rows.filter(row=>row.slices?.some(s=>s.executable&&s.overlayDescriptorId===r.overlayDescriptorId&&s.vramStart>=p.vramStart&&s.vramStart<r.vramStart)).length!==1) fail('interior adjacency gap/overlap');
  }
  for(const [i,o] of group.owners.entries()) {const r=records[i+1];if(o.rowIndex!==r.rowIndex||o.bytes!==r.bytes||o.romStartNumber!==r.romStart||o.vramStartNumber!==r.vramStart||o.romEndNumber!==r.romEndExclusive||o.vramEndNumber!==r.vramEndExclusive||o.originalAssembly!==r.originalAssembly||o.originalAssemblySha256!==r.originalAssemblySha256||o.expectedTextSha256!==r.originalBytesSha256||o.alignment!==4)fail('interior member placement');}
  return {schemaVersion:1,preceding:records[0],members:records.slice(1,-1),following:records.at(-1),historicalUnitBoundaries:'unresolved'};
}
function bindInterior(group,model,rom) {
  group.interiorRun={...group.interiorRun,binding:interiorBinding(group,model,rom)};
  interiorContexts.set(hash({ ...group, auxiliary: undefined }),{model,rom:Buffer.from(rom)});
}
function authenticateInterior(group) {
  interiorContract(group);
  let c=interiorContexts.get(hash({ ...group, auxiliary: undefined }));
  if(!c) {require('./active_targets').loadActiveTargetModel();c=interiorContexts.get(hash({ ...group, auxiliary: undefined }));}
  if(!c||!same(interiorBinding(group,c.model,c.rom),group.interiorRun.binding)) fail('interior accepted context/binding drift');
}
function interiorGrammar(compiler,group) {
  if(!interior(group))return;
  interiorContract(group);
  const entries=[...compiler.toString('utf8').matchAll(/\.align\s+(\d+)\s+\.globl\s+([A-Za-z_.$][A-Za-z0-9_.$]*)\s+\.type[^\n]+\n\s*\.ent\s+([A-Za-z_.$][A-Za-z0-9_.$]*)/g)];
  if(entries.length!==group.functions.length||entries.some((m,i)=>Number(m[1])!==2||m[2]!==group.functions[i].symbol||m[3]!==m[2]))fail('interior emitted instruction alignment census');
}
function interiorObject(elf,group,stage) {
  const raw=stage==='raw', sections=raw?[section(elf,'.text')]:group.owners.map(o=>section(elf,o.sectionName));
  const bytes=Buffer.concat(sections.map(s=>Buffer.from(elfSectionBytes(elf,s))));
  if(raw&&(!bytes.subarray(group.tail.offset).equals(Buffer.alloc(group.tail.bytes))||sha256Buffer(bytes.subarray(0,group.tail.offset))!==group.interiorRun.expectedProjectedTextSha256)) fail('interior native omitted bytes');
  const control=[],dispatch=[];
  for(const f of group.functions){
    if(f.bytes<8)fail('interior function cannot prove terminal transfer');
    const terminal=bytes.readUInt32BE(f.offset+f.bytes-8),opcode=terminal>>>26;
    const returns=opcode===0&&(terminal&63)===8&&((terminal>>>21)&31)===31;
    const unconditional=opcode===2 || (opcode===4&&((terminal>>>21)&31)===((terminal>>>16)&31));
    if(!returns&&!unconditional)fail('interior executable fallthrough at function boundary');
  }
  const contains=n=>n%4===0&&group.functions.some(f=>n>=f.offset&&n+4<=f.offset+f.bytes);
  const rs=w=>w>>>21&31,rt=w=>w>>>16&31,rd=w=>w>>>11&31,op=w=>w>>>26;
  for(let pc=0;pc<group.tail.offset;pc+=4){const w=bytes.readUInt32BE(pc),code=op(w),low=(w<<16)>>16;
    if([16,18,19].includes(code)||(code===17&&rs(w)===8&&rt(w)>3))fail('interior unsupported coprocessor control');
    if([1,4,5,6,7,20,21,22,23].includes(code)||(code===17&&rs(w)===8)){
      if(code===1&&![0,1,2,3,16,17,18,19].includes(rt(w)))fail('interior unsupported REGIMM control');
      const destination=pc+4+low*4;if(!contains(destination))fail('interior branch targets omitted/outside text');control.push({place:pc,kind:'branch',destination});
    } else if(code===2||code===3){const r=group.relocations.find(r=>r.offset===pc&&r.type===4);if(!r)fail('interior direct jump missing relocation');
      if(r.symbolSection==='.text'&&!contains(r.symbolValue+(w&0x3ffffff)*4))fail('interior jump targets omitted/outside text');
      if(!['.text','UND'].includes(r.symbolSection))fail('interior unsupported direct control target');
      control.push({place:pc,kind:'relocated-jump',symbol:r.symbol,symbolSection:r.symbolSection,symbolValue:r.symbolValue,addend:(w&0x3ffffff)*4});
    } else if(code===0&&(w&63)===9)fail('interior unsupported indirect call');
    else if(code===0&&(w&63)===8&&rs(w)!==31){
      if(pc<24)fail('interior unsupported indirect control');
      const q=Array.from({length:6},(_,i)=>bytes.readUInt32BE(pc-24+i*4));
      let [bound,branch,shift,high,add,load]=q; const jump=rs(w),base=rt(high);
      let branchPc=pc-20;
      if(op(branch)!==4&&pc>=28){const delay=branch;branchPc=pc-24;branch=bound;if(delay!==0 && !(op(delay)===43&&rs(delay)===29))fail('interior unsupported dispatch delay');}
      let boundPc=branchPc-4; bound=bytes.readUInt32BE(boundPc);
      while(boundPc>=pc-48&&boundPc>=4&&(bound===0||(op(bound)===43&&rs(bound)===29))){boundPc-=4;bound=bytes.readUInt32BE(boundPc);}
      const hi=group.relocations.find(r=>r.offset===pc-12&&r.type===5),lo=group.relocations.find(r=>r.offset===pc-4&&r.type===6);
      if(op(bound)!==11||rt(bound)!==jump||op(branch)!==4||rs(branch)!==jump||rt(branch)!==0
        ||op(shift)!==0||rs(shift)!==0||(shift&63)!==0||rd(shift)!==jump||rt(shift)!==rs(bound)||(shift>>>6&31)!==2
        ||op(high)!==15||rs(high)!==0||op(add)!==0||(add&63)!==33||rd(add)!==base||!([rs(add),rt(add)].includes(base)&&[rs(add),rt(add)].includes(jump))
        ||op(load)!==35||rs(load)!==base||rt(load)!==jump||!hi||!lo||hi.symbolSection!=='.rodata'||lo.symbolSection!=='.rodata'
        ||hi.symbol!=='.rodata'||lo.symbol!=='.rodata'||hi.symbolValue||lo.symbolValue)fail('interior unproven indirect dispatch at '+pc);
      const offset=(((high&65535)<<16)+((load<<16)>>16))>>>0,occurrence=auxiliary.groupOccurrences(group).find(o=>o.offset===offset);
      const f=group.functions.find(f=>pc>=f.offset&&pc<f.offset+f.bytes);
      if(!occurrence||(bound&65535)>32767||occurrence.bytes/4!==(bound&65535)||occurrence.memberSymbol!==f?.symbol||boundPc<f.offset)fail('interior dispatch bound/attribution');
      dispatch.push({place:pc,boundPlace:boundPc,occurrence:occurrence.label,offset,entries:bound&65535,memberSymbol:occurrence.memberSymbol});
    }
  }
  // Reachability includes entry points into delay instructions. Merely checking
  // the last return pair would miss an incoming edge to its delay instruction.
  const seeds=group.functions.map(f=>f.offset);
  for(const row of group.auxiliary.sections)for(const r of row.expectedRelocations)seeds.push(Number(r.addend));
  const pending=new Map();
  for(const r of group.relocations){
    const key=r.symbolSection+':'+r.symbol+':'+r.symbolValue;
    if(r.type===5){if(!pending.has(key))pending.set(key,[]);pending.get(key).push(r);}
    else if(r.type===6){for(const h of pending.get(key)||[]){if(r.symbolSection==='.text')seeds.push(r.symbolValue+((((h.word&65535)<<16)+((r.word<<16)>>16))>>>0));}pending.delete(key);}
  }
  // No alternate entry may bypass a switch bounds check, including its own
  // default branch entering the unchecked load/jump sequence.
  const entries=[...seeds,...control.flatMap(c=>c.kind==='branch'?[c.destination]:c.symbolSection==='.text'?[c.symbolValue+c.addend]:[])];
  for(const d of dispatch)if(entries.some(pc=>pc>d.boundPlace&&pc<=d.place))fail('interior alternate entry bypasses dispatch bound');
  const visited=new Set(), queue=[...seeds];
  const isControl=w=>[1,2,3,4,5,6,7,20,21,22,23].includes(op(w))||(op(w)===17&&rs(w)===8)||(op(w)===0&&[8,9].includes(w&63));
  while(queue.length){const pc=queue.pop();if(!contains(pc))fail('interior executable fallthrough or control reaches omitted/outside text');if(visited.has(pc))continue;visited.add(pc);
    const w=bytes.readUInt32BE(pc),code=op(w),f=group.functions.find(f=>pc>=f.offset&&pc<f.offset+f.bytes);
    if(isControl(w)){
      if(pc+8>f.offset+f.bytes||isControl(bytes.readUInt32BE(pc+4)))fail('interior invalid or missing control delay');
      const branch=control.find(r=>r.place===pc&&r.kind==='branch');
      if(branch){queue.push(branch.destination);if(!(code===4&&rs(w)===rt(w)))queue.push(pc+8);continue;}
      const jump=control.find(r=>r.place===pc&&r.kind==='relocated-jump');
      if(jump){if(jump.symbolSection==='.text')queue.push(jump.symbolValue+jump.addend);if(code===3)queue.push(pc+8);continue;}
      if(code===0&&(w&63)===8){if(rs(w)!==31){const d=dispatch.find(d=>d.place===pc);if(!d)fail('interior dispatch proof missing');
        const o=auxiliary.groupOccurrences(group).find(o=>o.label===d.occurrence),row=group.auxiliary.sections.find(row=>row.outputSection===o.outputSection);
        for(const r of row.expectedRelocations)if(Number(r.offset)>=o.rowOffset&&Number(r.offset)<o.rowOffset+o.bytes)queue.push(Number(r.addend));}continue;}
      fail('interior unsupported executable control');
    }
    if(pc+4>=f.offset+f.bytes)fail('interior executable fallthrough crosses a member boundary');
    queue.push(pc+4);
  }
  return {schemaVersion:1,reachableInstructions:visited.size,nativeBytes:group.text.bytes,nativeAlignment:group.text.alignment,projectedBytes:group.tail.offset,
    projectedAlignment:4,omittedTail:group.tail,controlDestinations:control,dispatches:dispatch,originalBinding:group.interiorRun.binding};
}
function trimInterior(input,group) {
  const elf=parseBuffer(input),text=section(elf,'.text'),result=Buffer.from(input);
  // Change section metadata only; the original unsplit artifact is preserved.
  // The ordinary splitter receives only the authenticated instruction envelope.
  result.writeUInt32BE(group.tail.offset,elf.header.shoff+text.index*40+20);
  result.writeUInt32BE(4,elf.header.shoff+text.index*40+32);
  return result;
}
Object.assign(module.exports,{interior,interiorGrammar,interiorObject});






// Distinct proof discriminator plus independent artifact reconstruction. A report
// cannot choose its filesystem authority or authenticate its own cached census.
const fragmentProofContexts = new Map();
function fragmentImplementationIdentity() {
  const p7 = require('./phase7_conventional');
  return hash(['compilation_groups','auxiliary_projection','active_targets','phase8_matching_c','text_contract','elf_text_split','boot_initialized_data','auxiliary_interior','retained_literal_references']
    .map(name=>({name,sha256:p7.sha256File(require.resolve('./'+name))})));
}
const fragmentBindingContexts = new WeakMap();
function fragmentUnorderedIdentity(group) {
  return hash({ ...group, auxiliary: { ...group.auxiliary, sections: group.auxiliary.sections.map(({ownerFragmentIndex,ownerFragmentCount,...a})=>a) } });
}
function finishFragmentBindings(targets) {
  for (const group of new Set(targets.map(t=>t.compilationGroup).filter(fragmentMode))) {
    const bound = fragmentBindingContexts.get(group);
    if (!bound || fragmentUnorderedIdentity(group) !== bound.identity) fail('fragment shared-row binding changed');
    functionContexts.set(hash(group), { ...bound.context, groupIdentity: hash(group) });
  }
}
function validateFragmentProof(proof) {
  const group = proof.textContract?.producer, object = proof.objectEvidence;
  if (!fragmentMode(group) || proof.textContract.schemaVersion !== 12 || object?.schemaVersion !== 20
      || object.composition?.schemaVersion !== 7 || proof.textContract.mode !== group.mode
      || object.assemblyMode !== 'untouched-native-text-owner-functions-readonly-fragment-projection'
      || object.compilerAssemblyRewritten !== false) fail('fragment proof schema');
  authenticateFunctions(group); auxiliary.fragmentContract(group); validateNativeRelocationOrder(group);
  const key = hash(object.artifacts) + ':' + proof.target?.symbol, context = fragmentProofContexts.get(key);
  if (!context || !fragmentMode(context.target.compilationGroup)
      || !same(contract(context.target), proof.textContract)) fail('fragment proof lacks fresh authenticated context');
  require('./source_policy').verifyClassificationInputs(context.classification);
  const fresh = require('./phase8_matching_c').deriveSourceObjectProof(context.phase8, context.target,
    context.output, context.classification, parseElfFile(path.join(context.output, 'phase8.elf')), context.rom).proof;
  if (!same(fresh, proof)) fail('fragment proof differs from independent artifact/link reconstruction');
}
Object.assign(module.exports, { validateFragmentProof, finishFragmentBindings });
