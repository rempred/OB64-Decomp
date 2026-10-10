'use strict';

// One original logical body may have several physical archival owners. This
// representation retains one executable ELF contribution and relocation stream;
// physical owners remain independently authenticated intervals, never functions.
const fs = require('fs'), path = require('path');
const p7 = require('./phase7_conventional'), logical = require('./logical_functions');
const { exactKeys, same, hash } = require('./text_contract');
const elfTools = require('./elf_text_split');
const MODE = 'atomic-contiguous-owner-union';
const contexts = new Map();
const proofInputs = new Map();
const modelTargets = new WeakMap();
const linkedInputs = new Map();
const classifications = new Map();
const proofContexts = new Map();
function fail(message) { throw new Error('atomic owner union: ' + message); }
function normalize(value) {
  if (value === undefined) return null;
  if (!exactKeys(value, ['schemaVersion', 'mode', 'alignment']) || value.schemaVersion !== 1
      || value.mode !== MODE || value.alignment !== 4) fail('admission schema/alignment');
  return { ...value };
}
function bind(target, registry) {
  if (!target.atomicText) return;
  normalize(target.atomicText);
  if (target.compilationGroup || target.nativeTextTail || target.auxiliaryProjection?.schemaVersion !== 4
      || !target.multiOwner || target.textOwners?.length < 2 || target.compilerTextFunctions?.length !== 1
      || target.compilerTextFunctions[0].symbol !== target.symbol || target.compilerTextFunctions[0].binding !== 'GLOBAL'
      || target.compilerTextFunctions[0].offsetNumber !== 0 || target.compilerTextFunctions[0].bytes !== target.bytes
      || target.vramStartNumber % 4 || target.bytes % 4) fail('complete single-function admission');
  const binding = logical.assertAtomicOwnerBody(registry, target.symbol, target.rows);
  const first = target.textOwners[0];
  if (target.rows.length !== target.textOwners.length
      || target.romStartNumber !== binding.body.romStart || target.romEndNumber !== binding.body.romEndExclusive
      || target.vramStartNumber !== first.vramStartNumber || target.vramEndNumber !== first.vramStartNumber + target.bytes
      || target.sectionName !== first.sectionName) fail('original body placement binding');
  let offset = 0;
  for (const [index, owner] of target.textOwners.entries()) {
    const row = target.rows[index], fragment = binding.body.fragments[index];
    if (!row || row.slices.length !== 1 || owner.rowIndex !== row.index || owner.bytes !== row.bytes
        || owner.logicalOffset !== offset || owner.logicalEnd !== offset + owner.bytes || owner.ownerIndex !== index
        || owner.romStartNumber !== fragment.romStart || owner.romEndNumber !== fragment.romEndExclusive
        || owner.vramStartNumber !== fragment.vramStart || owner.vramEndNumber !== fragment.vramStart + fragment.bytes
        || owner.sectionName !== fragment.sectionName || owner.originalAssembly !== fragment.file
        || owner.originalAssemblySha256 !== fragment.sha256) fail('whole physical owner census');
    offset += owner.bytes;
  }
  if (offset !== target.bytes || binding.body.expectedBytesSha256 !== target.expectedTextSha256) fail('original body extent/hash');
  target.atomicBinding = binding;
  const key = identity(target);
  contexts.set(key, { registry, rows: target.rows, binding, symbol: target.symbol, target });
}
function identity(target) {
  return hash({ symbol: target.symbol, atomicText: target.atomicText, binding: target.atomicBinding,
    owners: target.textOwners?.map(({ row, ...owner }) => owner), bytes: target.bytes,
    start: target.romStartNumber, end: target.romEndNumber, vram: target.vramStartNumber,
    vramEnd: target.vramEndNumber, sectionName: target.sectionName,
    compilerTextFunctions: target.compilerTextFunctions, nativeTextTail: target.nativeTextTail,
    compilationGroup: target.compilationGroup, multiOwner: target.multiOwner });
}
function authenticate(target) {
  normalize(target.atomicText);
  let context = contexts.get(identity(target));
  if (!context) {
    const active = require('./active_targets').loadActiveTargetModel();
    const accepted = active.targets.find(t => t.atomicText && identity(t) === identity(target));
    if (!accepted) fail('unbound atomic contract');
    context = contexts.get(identity(target));
  }
  if (!context || p7.sha256File(logical.CONFIG_PATH) !== context.binding.registryIdentity.sha256
      || !same(logical.assertAtomicOwnerBody(context.registry, context.symbol, context.rows), target.atomicBinding)) fail('logical binding drift');
  for (const fragment of target.atomicBinding.body.fragments)
    if (p7.sha256File(path.join(p7.ROOT, fragment.file)) !== fragment.sha256) fail('original source drift');
}
function assertCensus(targets) {
  for (const target of targets.filter(t => t.atomicText)) {
    authenticate(target);
    const start = target.romStartNumber, end = target.romEndNumber;
    if (targets.some(t => t !== target && t.romStartNumber < end && t.romEndNumber > start)) fail('overlapping or subset atomic activation');
  }
}
function storageOwner(target) {
  authenticate(target);
  return { ...target.textOwners[0], logicalEnd: target.bytes, bytes: target.bytes,
    romEndNumber: target.romEndNumber, vramEndNumber: target.vramStartNumber + target.bytes,
    expectedTextSha256: target.expectedTextSha256 };
}
function objectOwners(target) { return target.atomicText ? [storageOwner(target)] : require('./phase8_matching_c').targetTextOwners(target); }
function markers(target) {
  return target.textOwners.slice(1).map(owner => ({ name: owner.symbol, offset: owner.logicalOffset,
    binding: 1, symbolType: 1, size: 0, visibility: 0, rowIndex: owner.rowIndex }));
}
function section(elf, target, linked = false) {
  authenticate(target);
  const matches = elf.sections.filter(s => s.name === target.sectionName);
  const value = matches[0];
  if (matches.length !== 1 || value.type !== 1 || value.flags !== 6 || value.size !== target.bytes
      || value.alignment !== 4 || value.address !== (linked ? target.vramStartNumber : 0)
      || target.textOwners.slice(1).some(o => elf.sections.some(s => s.name === o.sectionName))) fail('atomic section shape/prepadding');
  return value;
}
function ownerBytes(elf, target, owner, linked = false) {
  return Buffer.from(p7.elfSectionBytes(elf, section(elf, target, linked)).subarray(owner.logicalOffset, owner.logicalEnd));
}
function checkFunctions(elf, target, linked = false, projected = true) {
  const sec = section(elf, target, linked), base = linked ? target.vramStartNumber : 0;
  const functions = elf.symbols.filter(s => s.symbolType === 2 && (!linked || s.sectionIndex === sec.index));
  if (functions.length !== 1 || functions[0].name !== target.symbol || functions[0].sectionIndex !== sec.index
      || functions[0].value !== base || functions[0].size !== target.bytes || functions[0].binding !== 1 || functions[0].visibility)
    fail('complete compiler function census');
  for (const marker of markers(target)) {
    const found = elf.symbols.filter(s => s.name === marker.name);
    if (!projected ? found.length : found.length !== 1 || found[0].sectionIndex !== sec.index
        || found[0].value !== base + marker.offset || found[0].size || found[0].binding !== 1 || found[0].symbolType !== 1 || found[0].visibility)
      fail('physical boundary marker census');
  }
  return functions;
}
function addMarkers(input, target) {
  const elf = p7.parseElf32BigEndian(input), parsed = elfTools.parseRelocatable(input);
  const sec = section(elf, target); checkFunctions(elf, target, false, false);
  const list = { sections: parsed.sections.map(s => ({ ...s, oldIndex: s.index, data: Buffer.from(elfTools.sectionBytes(input, s)) })),
    oldToNew: new Map(parsed.sections.map(s=>[s.index,s.index])) };
  const sym = list.sections.find(s => s.type === 2), strings = list.sections[sym.link];
  for (const marker of markers(target)) {
    const entry = Buffer.alloc(16), name = Buffer.from(marker.name + '\0');
    entry.writeUInt32BE(strings.data.length, 0); entry.writeUInt32BE(marker.offset, 4);
    entry[12] = 0x11; entry.writeUInt16BE(sec.index, 14);
    strings.data = Buffer.concat([strings.data, name]); strings.size = strings.data.length;
    sym.data = Buffer.concat([sym.data, entry]); sym.size = sym.data.length;
  }
  const shstr = elfTools.rebuildSectionNames(list, parsed.shstrIndex);
  const result = elfTools.serialize(input, parsed, list, shstr);
  checkFunctions(p7.parseElf32BigEndian(result), target);
  return result;
}
function project(input, target) {
  authenticate(target);
  const auxiliary = require('./auxiliary_projection').project(input, target);
  const buffer = addMarkers(auxiliary.buffer, target);
  return { ...auxiliary, buffer, evidence: { ...auxiliary.evidence, projectedObjectSha256: p7.sha256Buffer(buffer) } };
}
function contract(target) {
  const ordinary = require('./text_contract').resolveTextContract({ ...target, atomicText: null });
  const owner = storageOwner(target), first = ordinary.owners[0];
  return { ...ordinary, schemaVersion: 7, mode: MODE, atomicText: target.atomicText, logicalBinding: target.atomicBinding,
    physicalOwners: ordinary.owners, boundaryMarkers: markers(target), tail: null,
    owners: [{ ...first, bytes: target.bytes, romEndExclusive: target.romEndNumber,
      vramEndExclusive: target.vramStartNumber + target.bytes, expectedLinkedSha256: target.expectedTextSha256,
      expectedInputShape: { type: 1, flags: 6, alignment: 4, bytes: owner.bytes },
      expectedOutputShape: { type: 1, flags: 6, alignment: 4, bytes: owner.bytes } }] };
}
function outputModel(model, targets) {
  if (targets === undefined) targets = modelTargets.get(model) || [];
  else modelTargets.set(model, targets);
  assertCensus(targets);
  const replacements = new Map(), omitted = new Set();
  for (const target of targets.filter(t => t.atomicText)) {
    const first = model.slices.find(s => s.sectionName === target.sectionName);
    if (!first) fail('missing first output owner');
    for (const owner of target.textOwners) {
      const matches = model.slices.filter(s => s.sectionName === owner.sectionName);
      if (matches.length !== 1 || matches[0].romStart !== owner.romStartNumber || matches[0].bytes !== owner.bytes
          || matches[0].vramStart !== owner.vramStartNumber || !matches[0].executable) fail('output owner subset/drift');
      omitted.add(owner.sectionName);
    }
    replacements.set(target.sectionName, { ...first, bytes: target.bytes, romEndExclusive: target.romEndNumber,
      vramEndExclusive: target.vramStartNumber + target.bytes });
  }
  return { ...model, slices: model.slices.flatMap(s => replacements.has(s.sectionName) ? [replacements.get(s.sectionName)] : omitted.has(s.sectionName) ? [] : [s]) };
}
function mapEvidence(target, mapText) {
  authenticate(target);
  const prepared = require('./prepared_link_view'), objectPath = require('./compilation_groups').objectPath(target);
  const block = prepared.mapBlock(mapText, target.sectionName, 'loose', false, true);
  if (!block || block.some(line => /\*fill\*|objects[\\/]assembly[\\/]/.test(line))) fail('atomic fallback/prepadding contribution');
  const contributions = block.slice(1).filter(line => /^\s+\.\S+\s+[0-9a-f]+\s+[0-9a-f]+\s+[0-9a-f]+\s+2\*\*/i.test(line));
  if (contributions.length !== 1) fail('atomic contribution census');
  const match = /^\s+(\S+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+2\*\*(\d+)\s+(.+)$/i.exec(contributions[0]);
  if (!match || match[1] !== target.sectionName || parseInt(match[2],16) !== target.vramStartNumber
      || parseInt(match[4],16) !== target.bytes || Number(match[5]) !== 2 || match[6].trim().replace(/^elf32-bigmips\s+/, '').replace(/\(overhead \d+ bytes\)$/, '').replace(/\\/g,'/') !== objectPath)
    fail('atomic exact contribution placement');
  for (const owner of target.textOwners.slice(1)) if (prepared.mapBlock(mapText, owner.sectionName, 'loose', false, true)) fail('atomic subset output remains');
  return { contribution: contributions[0].trim(), linkedOwner: objectPath, retainedAssemblySlices: [],
    owners: target.textOwners.map((owner,index) => ({ ownerIndex:index,rowIndex:owner.rowIndex,sectionName:owner.sectionName,
      contribution:contributions[0].trim(),linkedOwner:objectPath,atomicOutputSection:target.sectionName,offset:owner.logicalOffset,bytes:owner.bytes })) };
}
function physicalEvidence(target, elf, linked = false) {
  return target.textOwners.map(owner => ({ rowIndex:owner.rowIndex,sectionName:owner.sectionName,
    atomicOutputSection:target.sectionName,offset:owner.logicalOffset,bytes:owner.bytes,
    sha256:p7.sha256Buffer(ownerBytes(elf,target,owner,linked)),originalAssemblySha256:owner.originalAssemblySha256 }));
}
function validateObject(elf, target, stage) {
  const raw = stage === 'assembler', stripped = stage === 'stripped';
  if (!['assembler','projected','stripped'].includes(stage) || elf.header.type !== 1 || elf.header.machine !== 8
      || elf.header.entry || elf.header.phoff || elf.header.phnum) fail('object header/stage');
  checkFunctions(elf, target, false, !raw);
  const sec = section(elf,target), aux = target.auxiliarySections;
  const roNames = raw ? [aux[0].outputSection] : aux.map(s=>s.outputSection);
  const names = new Set();
  for (const s of elf.sections) {
    if (names.has(s.name)) fail('duplicate object section'); names.add(s.name);
    if (!(s.flags & 7)) continue;
    if (s.name === sec.name || roNames.includes(s.name)) continue;
    if (s.name === '.reginfo' && !stripped) {
      if (s.type !== 0x70000006 || s.flags !== 2 || s.size !== 24 || s.alignment !== 4 || s.address) fail('reginfo shape');
      continue;
    }
    if (['.text','.data','.bss'].includes(s.name) && s.size === 0 && s.address === 0
        && s.alignment === 16 && s.flags === (s.name === '.text' ? 6 : 3) && s.type === (s.name === '.bss' ? 8 : 1)) continue;
    fail('uncontracted allocated/writable/executable section');
  }
  if ((elf.sections.filter(s=>s.name === '.reginfo').length !== (stripped ? 0 : 1))
      || elf.symbols.some(s=>[0xfff2,0xff00,0xff03].includes(s.sectionIndex) && s.size)) fail('metadata/COMMON census');
  const compilerMarkers=elf.symbols.filter(s=>s.name==='gcc2_compiled.');
  if(compilerMarkers.length!==1||compilerMarkers[0].value||compilerMarkers[0].size||compilerMarkers[0].binding
      ||compilerMarkers[0].symbolType!==1||compilerMarkers[0].visibility||elf.sections[compilerMarkers[0].sectionIndex]?.name!=='.text')fail('compiler marker census');
  for(const s of elf.symbols){
    if(s.sectionIndex===0)continue;
    if(s.sectionIndex===0xfff1&&s.symbolType===4)continue;
    if(s.symbolType===3){if(s.name||s.value||s.size||s.binding||s.visibility||!elf.sections[s.sectionIndex])fail('section anchor metadata');continue;}
    if(s===compilerMarkers[0]||s.name===target.symbol||!raw&&markers(target).some(m=>m.name===s.name))continue;
    fail('uncontracted defined symbol');
  }
  for (const s of elf.symbols.filter(s=>s.sectionIndex===sec.index)) {
    if (s.symbolType===2 && s.name===target.symbol) continue;
    if (!raw && markers(target).some(m=>m.name===s.name)) continue;
    if (s.symbolType!==3 || s.name || s.value || s.size || s.binding || s.visibility) fail('unknown text symbol');
  }
  const rels = require('./compilation_groups').relocations(elf), pending = new Map(), places = new Set();
  for (const r of rels) {
    if(r.symbol===compilerMarkers[0]||elf.sections[r.symbol.sectionIndex]?.name==='.reginfo')fail('discarded metadata reference');
    if(r.owner.index!==sec.index&&!roNames.includes(r.owner.name))fail('uncontracted relocation owner');
    if (markers(target).some(m=>m.name===r.symbol.name)) fail('boundary marker must be reference-closed in producer');
    if (r.owner.index !== sec.index) continue;
    if (places.has(r.place) || r.place%4 || r.place+4>target.bytes || ![4,5,6].includes(r.type)) fail('text relocation census');
    places.add(r.place);
    const key=r.symbol.symbolTableIndex+':'+r.symbol.symbolIndex;
    if(r.type===5){if(!pending.has(key))pending.set(key,[]);pending.get(key).push(r);}
    if(r.type===6){if(!pending.get(key)?.length)fail('unpaired text LO16');pending.delete(key);}
    if(r.type===4&&r.symbol.sectionIndex===sec.index){const value=r.symbol.value+(elf.buffer.readUInt32BE(sec.offset+r.place)&0x3ffffff)*4;
      if(value%4||value+4>target.bytes||markers(target).some(m=>m.offset===value))fail('unproved callable boundary/outside body');}
  }
  if(pending.size)fail('unpaired text HI16');
  return { stage, sha256:p7.sha256Buffer(elf.buffer), census:require('./auxiliary_projection').completeObjectCensus(elf),
    physicalOwners:physicalEvidence(target,elf), functions:checkFunctions(elf,target,false,!raw).map(s=>({...s})) };
}
function evidence(target, buffers, artifacts, files) {
  authenticate(target);
  const projected=project(buffers.unsplitAssemblerObject,target);
  if(!projected.buffer.equals(buffers.rawObject))fail('independent atomic projection');
  const stages={assembler:validateObject(p7.parseElf32BigEndian(buffers.unsplitAssemblerObject),target,'assembler'),
    projected:validateObject(p7.parseElf32BigEndian(buffers.rawObject),target,'projected'),
    stripped:validateObject(p7.parseElf32BigEndian(buffers.strippedObject),target,'stripped')};
  for(const name of [target.sectionName,...target.auxiliarySections.map(s=>s.outputSection)]){
    const a=stages.projected.census.sections.find(s=>s.name===name),b=stages.stripped.census.sections.find(s=>s.name===name);
    if(!same(a,b))fail('strip changed allocated payload');
  }
  const value={schemaVersion:1,binding:identity(target),implementationSha256:p7.sha256File(__filename),stages};
  const key=hash(artifacts);
  proofInputs.set(key,{target,artifacts:structuredClone(artifacts),files:{...files}});
  return value;
}
function validateProof(proof) {
  const knownAtomicArtifacts=proof.objectEvidence?.artifacts && proofInputs.has(hash(proof.objectEvidence.artifacts));
  if(proof.textContract?.schemaVersion!==7 && proof.objectEvidence?.schemaVersion!==11 && !proof.objectEvidence?.atomicUnion
      && proof.target?.auxiliaryProjection?.schemaVersion!==4 && !knownAtomicArtifacts)return;
  const object=proof.objectEvidence, input=proofInputs.get(hash(object?.artifacts));
  if(!input)fail('atomic proof has no freshly authenticated artifact context');
  const target=input.target; authenticate(target);
  const classification=classifications.get(identity(target));
  if(!classification)fail('atomic source policy context missing');
  require('./source_policy').verifyClassificationInputs(classification);
  if(proof.target.source!==classification.source || proof.target.sourceBytes!==classification.sourceBytes
      ||proof.target.sourceSha256!==classification.sourceSha256||proof.target.sourceClass!==classification.class
      ||proof.target.sourcePolicyDigest!==classification.digest||!same(proof.target.dependencies,classification.dependencies)
      ||!same(proof.target.compilationInput,classification.compilationInput)||!same(proof.toolchain.preprocessor,classification.preprocessor))fail('atomic source policy binding');
  if(object.schemaVersion!==11 || !same(proof.textContract,contract(target)) || proof.target.symbol!==target.symbol
      || !same(proof.target.auxiliaryProjection,target.auxiliaryProjection) || proof.textContract.tail!==null
      || object.textContractSha256!==hash(proof.textContract) || proof.linkEvidence.textContractSha256!==hash(proof.textContract))fail('atomic proof contract binding');
  const buffers={};
  for(const [role,file] of Object.entries(input.files)){
    if(!file)continue;const b=fs.readFileSync(file),a=input.artifacts[role];
    if(!a||b.length!==a.bytes||p7.sha256Buffer(b)!==a.sha256)fail('stale atomic proof artifact');buffers[role]=b;
  }
  const linked=linkedInputs.get(hash(object.artifacts));
  if(!linked)fail('atomic linked proof context missing');
  const context=proofContexts.get(hash(object.artifacts));
  if(!context||context.output!==linked.root)fail('atomic independent proof context missing');
  // A serialized report cannot authorize itself. Reparse the registered on-disk
  // artifacts and ELF/map, replay projection and derive all proof fields again.
  // This is read-only reconstruction, not another compiler or linker invocation.
  const fresh=require('./phase8_matching_c').deriveSourceObjectProof(context.phase8,target,linked.root,
    classification,p7.parseElfFile(path.join(linked.root,'phase8.elf')),linked.rom).proof;
  if(!same(fresh,proof))fail('atomic proof differs from independent artifact/link reconstruction');
}
function registerLinked(target,root,rom,artifacts){authenticate(target);linkedInputs.set(hash(artifacts),{root,rom:Buffer.from(rom)});}
function registerClassification(target,classification){authenticate(target);require('./source_policy').verifyClassificationInputs(classification);classifications.set(identity(target),classification);}
function registerProofContext(phase8,target,output,proof){authenticate(target);proofContexts.set(hash(proof.objectEvidence.artifacts),{phase8,output});}
function verifyInputReferences(target, objects, producerFile) {
  authenticate(target);
  const boundaryNames=new Set(markers(target).map(m=>m.name));
  for(const file of objects){
    const elf=p7.parseElfFile(file),isProducer=path.resolve(file)===path.resolve(producerFile);
    if(!isProducer && elf.sections.some(s=>target.textOwners.some(o=>o.sectionName===s.name)))fail('original/subset fallback contribution remains');
    for(const s of elf.symbols.filter(s=>boundaryNames.has(s.name)))if(!isProducer&&s.sectionIndex!==0)fail('duplicate boundary provider');
    const pending=new Map();
    for(const r of require('./compilation_groups').relocations(elf).filter(r=>boundaryNames.has(r.symbol.name))){
      if(isProducer||r.symbol.sectionIndex!==0||r.symbol.value||![2,5,6].includes(r.type))fail('unsupported callable/boundary reference');
      const word=elf.buffer.readUInt32BE(r.owner.offset+r.place),key=r.symbol.name;
      if(r.type===2){if(word)fail('unsupported boundary pointer addend');}
      else if(r.type===5){if(!pending.has(key))pending.set(key,[]);pending.get(key).push(word&65535);}
      else{if(!pending.get(key)?.length||pending.get(key).some(hi=>(((hi<<16)+((word<<16)>>16))>>>0)!==0))fail('unsupported boundary address pair');pending.delete(key);}
    }
    if(pending.size)fail('unclosed external boundary reference');
  }
}
module.exports = { MODE, normalize, bind, authenticate, assertCensus, identity, storageOwner, objectOwners,
  markers, section, ownerBytes, checkFunctions, addMarkers, project, contract, outputModel, mapEvidence, physicalEvidence,
  validateObject, evidence, validateProof, registerLinked, registerClassification, registerProofContext, verifyInputReferences };
