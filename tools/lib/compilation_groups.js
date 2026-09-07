'use strict';

// Compilation producers own artifacts; members retain accepted function ownership.
const fs = require('fs');
const path = require('path');
const { ROOT, parseElfFile, elfSectionBytes, sha256Buffer } = require('./phase7_conventional');
const { projectNativeTextOwners } = require('./elf_text_split');
const { exactKeys, same, hash } = require('./text_contract');
const CONFIG_PATH = path.join(ROOT, 'config/matching-c-compilation-groups.json');
const SAFE_ID = /^[a-z][a-z0-9_-]{0,63}$/;
const SAFE_SYMBOL = /^[A-Za-z_.$][A-Za-z0-9_.$]*$/;
const SHA = /^[0-9A-F]{64}$/;
function fail(message) { throw new Error('compilation group: ' + message); }
function requireKeys(value, keys, label) { if (!exactKeys(value, keys)) fail(label + ' schema'); }
function integer(value, min = 0) { return Number.isSafeInteger(value) && value >= min; }
function power(value) { return integer(value, 4) && value <= 0x10000 && (value & (value - 1)) === 0; }
function alignment(group, offset) { let value = group.text.alignment; while (offset % value) value /= 2; return value; }
function stem(target) { return target.compilationGroup ? 'groups/' + target.compilationGroup.id : target.symbol; }
function objectPath(target, suffix = '.o') { return 'objects/c/' + stem(target) + suffix; }
function assemblyPath(target, suffix = '.compiler.s') { return 'generated/c/' + stem(target) + suffix; }
function members(phase8, target) { return target.compilationGroup
  ? target.compilationGroup.members.map(member => phase8.targets.find(candidate => candidate.symbol === member.symbol)) : [target]; }
function registry(config, profile) {
  requireKeys(config, ['schemaVersion', 'profile', 'groups'], 'registry');
  if (config.schemaVersion !== 1 || config.profile !== profile || !Array.isArray(config.groups)) fail('registry version/profile');
  const ids = new Set(), symbols = new Set(), sources = new Set();
  for (const group of config.groups) {
    requireKeys(group, ['id', 'source', 'mode', 'members', 'text', 'functions', 'tail', 'relocations'], 'producer');
    if (!SAFE_ID.test(group.id) || ids.has(group.id) || group.mode !== 'native-text-owner-projection'
        || typeof group.source !== 'string' || !group.source.endsWith('.c') || sources.has(group.source)
        || path.isAbsolute(group.source) || group.source.includes('\\') || group.source.split('/').some(part => !part || part === '.' || part === '..')) fail('producer identity');
    ids.add(group.id); sources.add(group.source);
    if (!Array.isArray(group.members) || group.members.length < 2 || !Array.isArray(group.functions)
        || group.functions.length !== group.members.length) fail('member/function census');
    requireKeys(group.text, ['section', 'bytes', 'alignment', 'type', 'flags', 'sha256'], 'native text');
    if (group.text.section !== '.text' || group.text.type !== 1 || group.text.flags !== 6
        || !integer(group.text.bytes, 4) || !power(group.text.alignment)
        || group.text.bytes % group.text.alignment || !SHA.test(group.text.sha256)) fail('native text shape');
    let end = 0;
    for (const [index, member] of group.members.entries()) {
      requireKeys(member, ['symbol', 'ownerRowIndex'], 'member');
      if (!SAFE_SYMBOL.test(member.symbol) || symbols.has(member.symbol.toLowerCase()) || !integer(member.ownerRowIndex)) fail('member identity');
      symbols.add(member.symbol.toLowerCase());
      const fun = group.functions[index];
      requireKeys(fun, ['symbol', 'offset', 'bytes', 'binding', 'symbolType', 'visibility'], 'function');
      if (fun.symbol !== member.symbol || fun.offset !== end || !integer(fun.bytes, 4) || fun.bytes % 4
          || fun.binding !== 1 || fun.symbolType !== 2 || fun.visibility !== 0) fail('function partition');
      end += fun.bytes;
    }
    requireKeys(group.tail, ['offset', 'bytes', 'sha256', 'origin'], 'tail');
    if (group.tail.offset !== end || !integer(group.tail.bytes) || group.tail.bytes !== Math.ceil(end / group.text.alignment) * group.text.alignment - end
        || end + group.tail.bytes !== group.text.bytes || group.tail.origin !== 'native-assembler-section-alignment'
        || group.tail.sha256 !== sha256Buffer(Buffer.alloc(group.tail.bytes))) fail('native tail contract');
    if (!Array.isArray(group.relocations)) fail('relocation census');
    let previous = -1;
    for (const relocation of group.relocations) {
      requireKeys(relocation, ['offset', 'type', 'symbol', 'symbolValue', 'symbolSection', 'word'], 'relocation');
      if (!integer(relocation.offset) || relocation.offset % 4 || relocation.offset <= previous || relocation.offset + 4 > end
          || ![4, 5, 6].includes(relocation.type) || typeof relocation.symbol !== 'string'
          || !integer(relocation.symbolValue) || !['.text', 'UND', 'ABS'].includes(relocation.symbolSection)
          || !integer(relocation.word) || relocation.word > 0xffffffff) fail('relocation contract');
      previous = relocation.offset;
    }
  }
  return config.groups;
}
function bind(groups, targets) {
  const assigned = new Set();
  for (const group of groups) {
    const selected = group.members.map(member => {
      const matches = targets.filter(target => target.symbol === member.symbol && target.compilationGroupId === group.id);
      if (matches.length !== 1) fail('indivisible member activation');
      const target = matches[0];
      if (target.source !== group.source || target.rowIndex !== member.ownerRowIndex || target.nativeTextTail || target.multiOwner
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
    if (first.vramStartNumber % group.text.alignment) fail('native group start alignment');
    const owners = selected.map((target, index) => {
      if (target.romStartNumber !== first.romStartNumber + offset || target.vramStartNumber !== first.vramStartNumber + offset
          || !same(placement(target), placement(first))
          || target.overlayDescriptorId !== first.overlayDescriptorId || target.descriptorRawSha256 !== first.descriptorRawSha256
          || group.functions[index].offset !== offset
          || target.bytes !== group.functions[index].bytes + (index === selected.length - 1 ? group.tail.bytes : 0)) fail('member placement/extent');
      assigned.add(target.symbol);
      const owner = { ...target.textOwners[0], groupOffset: offset, alignment: alignment(group, offset) };
      delete owner.row;
      offset += target.bytes;
      return owner;
    });
    if (offset !== group.text.bytes) fail('group extent');
    const normalized = { ...group, owners, romStart: first.romStartNumber, vramStart: first.vramStartNumber };
    for (const [index, target] of selected.entries()) {
      target.compilationGroup = normalized;
      target.groupMemberIndex = index;
      target.compilerTextFunctions = [{ symbol: target.symbol, offset: '0x00000000', offsetNumber: 0,
        bytes: group.functions[index].bytes, binding: 'GLOBAL', entryEvidence: 'owner' }];
      target.expectedRelocations = expectedMemberRelocations(target);
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
function allocation(elf, group, stage) {
  const names = new Set();
  for (const sec of elf.sections) { if (sec.name && names.has(sec.name)) fail('duplicate section'); names.add(sec.name); }
  const projected = stage !== 'raw', stripped = stage === 'stripped';
  const textNames = projected ? group.owners.map(owner => owner.sectionName) : ['.text'];
  for (const sec of elf.sections.filter(value => value.flags & 3)) {
    if (textNames.includes(sec.name)) continue;
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
function census(elf, group, stage) {
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
  if (sha256Buffer(bytes) !== group.text.sha256) fail('raw text hash');
  if (!bytes.subarray(group.tail.offset).equals(Buffer.alloc(group.tail.bytes))) fail('native tail bytes');
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
    const destination = elf.sections[rel.symbol.sectionIndex];
    const destOffset = destination && offsetOf(destination);
    let symbolSection = rel.symbol.sectionIndex === 0 ? 'UND' : rel.symbol.sectionIndex === 0xfff1 ? 'ABS' : destOffset !== undefined ? '.text' : null;
    if (!symbolSection) fail('load relocation references ancillary section');
    if (rel.symbol.symbolType === 3 && (!destination || destOffset !== 0 || rel.symbol.value !== 0)) fail('group section anchor drift');
    return { offset, type: rel.type, symbol: rel.symbol.symbolType === 3 ? '.text' : rel.symbol.name,
      symbolValue: rel.symbol.value + (destOffset || 0), symbolSection, word: bytes.readUInt32BE(offset) };
  });
  if (!same(records, group.relocations)) fail('complete load relocation census');
  return { bytes: bytes.length, sha256: sha256Buffer(bytes), functions, relocations: records };
}
function validateObject(elf, group, stage) {
  if (!['raw', 'projected', 'stripped'].includes(stage) || elf.header.type !== 1 || elf.header.machine !== 8
      || elf.header.entry !== 0 || elf.header.phoff !== 0 || elf.header.phnum !== 0) fail('relocatable object header/stage');
  return { schemaVersion: 1, stage, groupSha256: hash(group), objectFlags: elf.header.flags,
    metadata: allocation(elf, group, stage), ...census(elf, group, stage) };
}
function project(input, group) {
  const raw = parseBuffer(input), rawEvidence = validateObject(raw, group, 'raw');
  const result = projectNativeTextOwners(input, group.owners.map(owner => ({ sectionName: owner.sectionName, bytes: owner.bytes })));
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
  const tc = require('./text_contract'), group = target.compilationGroup, owner = group.owners[target.groupMemberIndex];
  const ordinary = tc.resolveTextContract({ ...target, compilationGroup: null });
  return { ...ordinary, schemaVersion: 2, mode: 'native-text-owner-projection', producer: group,
    memberIndex: target.groupMemberIndex,
    owners: ordinary.owners.map(value => ({ ...value,
      expectedInputShape: { ...value.expectedInputShape, alignment: owner.alignment },
      expectedOutputShape: { ...value.expectedOutputShape, alignment: owner.alignment } })) };
}
function evidence(target, root, files = null) {
  const tc = require('./text_contract'), group = target.compilationGroup;
  const artifact = (role, relative) => files ? { ...tc.artifact(path.dirname(files[role]), path.basename(files[role])), path: relative } : tc.artifact(root, relative);
  const artifacts = { compilationInput: artifact('compilationInput', target.source),
    compilerAssembly: artifact('compilerAssembly', assemblyPath(target)), assemblerInput: artifact('assemblerInput', assemblyPath(target, '.s')),
    rawObject: artifact('rawObject', objectPath(target, '.source-object.o')), strippedObject: artifact('strippedObject', objectPath(target)),
    unsplitAssemblerObject: artifact('unsplitAssemblerObject', objectPath(target, '.assembler-object.o')) };
  const read = role => fs.readFileSync(files ? files[role] : path.join(root, artifacts[role].path));
  const compiler = read('compilerAssembly');
  if (!compiler.equals(read('assemblerInput'))) fail('compiler assembly was rewritten');
  require('./phase8_matching_c').adjustSectionAssembly(compiler, target.sectionName, {});
  const native = parseBuffer(read('unsplitAssemblerObject')), projected = parseBuffer(read('rawObject')), stripped = parseBuffer(read('strippedObject'));
  const stages = { raw: validateObject(native, group, 'raw'), projected: validateObject(projected, group, 'projected'),
    stripped: validateObject(stripped, group, 'stripped') };
  if (stages.raw.objectFlags !== stages.projected.objectFlags) fail('projection changed object flags');
  // Pinned GNU 2.6 objcopy drops raw assembler flag bits during ancillary
  // removal. Record both headers; fresh production reproduction authenticates
  // that container change, while bytes, symbols and relocations stay exact.
  if (!same(stages.raw.metadata, stages.projected.metadata)) fail('projection metadata drift');
  // Independently inspect both objects in addition to deterministic writer replay.
  if (!project(native.buffer, group).buffer.equals(projected.buffer)) fail('projection is not reproducible');
  const memberContract = contract(target), rawOwners = tc.ownerEvidence(projected, memberContract), strippedOwners = tc.ownerEvidence(stripped, memberContract);
  if (!same(rawOwners.map(value => value.record), strippedOwners.map(value => value.record))) fail('strip changed owner');
  const normalizedRelocations = memberRelocations(target, projected);
  if (!same(normalizedRelocations, memberRelocations(target, stripped))) fail('strip changed load relocations');
  const rawFunctions = tc.functionCensus(projected, rawOwners.map(value => value.section));
  const strippedFunctions = tc.functionCensus(stripped, strippedOwners.map(value => value.section));
  if (!same(rawFunctions, strippedFunctions)) fail('strip changed member functions');
  const rawRelocations = require('./phase8_matching_c').rawRelocationRecords(projected);
  return { schemaVersion: 3, textContractSha256: hash(memberContract), artifacts, producerStages: stages,
    rawOwners: rawOwners.map(value => value.record), strippedOwners: strippedOwners.map(value => value.record),
    rawFunctions, strippedFunctions, normalizedRelocations,
    rawRelocations: rawRelocations.filter(value => value.section === '.rel' + target.sectionName),
    discardedAncillaryRelocations: rawRelocations.filter(value => !group.owners.some(owner => value.section === '.rel' + owner.sectionName)),
    tail: target.groupMemberIndex === group.members.length - 1 ? group.tail : null,
    assemblyMode: 'untouched-native-text-owner-projection', compilerAssemblyRewritten: false };
}
const compiledProducers = new Map();
function compile(phase8, target, output, compiler, assembler, objcopy, options) {
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
    p8.adjustSectionAssembly(bytes, target.sectionName, {});
    fs.writeFileSync(adjustedFile, bytes, { flag: 'wx' });
    p7.run(assembler, [...phase8.model.config.binutils.compilerAssemblerFlags, '-o', rawFile, adjustedFile], { cwd: output });
    fs.writeFileSync(projectedFile, project(fs.readFileSync(rawFile), target.compilationGroup).buffer, { flag: 'wx' });
    p7.run(objcopy, ['--remove-section=.reginfo', '--remove-section=.pdr', '--remove-section=.comment', '--remove-section=.note', projectedFile, finalFile], { cwd: output });
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
    relocations: memberRelocations(target, elf), auxiliarySections: [] };
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
