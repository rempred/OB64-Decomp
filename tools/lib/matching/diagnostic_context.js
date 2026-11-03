"use strict";

// Historical evidence and a bounded producer view. This is never a CURRENT
// construction context: it deliberately has no phase8/currentFingerprint fields.
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual: same } = require('util');
const inputSet = require('./input_set');
const p7 = require('../phase7_conventional');
const text = require('../text_contract');
const active = require('../active_targets');
const composition = require('./target_model');
const wordAssembly = require('../word_asm');
const { ROOT } = p7;
const execution=require('../execution_paths');
const selection=require('./target_selection');
const contexts = new WeakSet();
const fail = message => { const error = new Error('candidate diagnostic: ' + message); error.code = 'OB64_SELECTED_INPUT'; throw error; };
const hash = inputSet.digest;
const hex = value => '0x' + value.toString(16).toUpperCase().padStart(8, '0');
const key = value => path.resolve(value).toLowerCase();
const inside = (base, file) => key(file).startsWith(key(base) + path.sep);
const identity = bytes => ({ bytes: bytes.length, sha256: hash(bytes) });
const unique = (records, symbol, label) => {
  const matches = records.filter(record => record.symbol?.toLowerCase() === symbol.toLowerCase());
  if (matches.length !== 1) fail(label + ' missing/ambiguous: ' + symbol);
  return matches[0];
};
function isDiagnosticContext(context) { return contexts.has(context); }
function producerModel(context) { return isDiagnosticContext(context) ? context.producerModel : context?.phase8; }
function baselineFingerprint(context) { return isDiagnosticContext(context) ? context.acceptedFingerprint : context?.currentFingerprint; }
function assertCanonicalContext(context) { if (isDiagnosticContext(context)) fail('diagnostic context cannot establish canonical acceptance'); }

function validateHistoricalReports({state,build,fresh,verified,minimal,config}) {
  const construction = build.schemaVersion === 8 && build.status === 'constructed';
  const schema = construction ? 7 : 6;
  if (!(construction || build.schemaVersion === 7 && build.status === 'pass') || state.schemaVersion !== schema
      || fresh.schemaVersion !== schema || fresh.status !== 'pass' || verified.schemaVersion !== schema || verified.status !== 'pass'
      || verified.output !== '.' || verified.verification?.schemaVersion !== schema || verified.verification.status !== 'pass'
      || !same(fresh.buildReport,state.buildReport) || !same(verified.buildReport,state.buildReport)
      || !construction && !same(build.verification,verified.verification)) fail('historical companion schema/status/binding');
  const verification = verified.verification;
  const canonicalRom = { bytes: config.rom.bytes, sha256: config.rom.sha256 };
  if (!same(verification.outputs?.rom, canonicalRom) || !same({bytes:state.rom?.bytes,sha256:state.rom?.sha256},canonicalRom)
      || construction && !same(build.outputs?.rom,canonicalRom)) fail('historical ROM pin');
  if (minimal.schemaVersion !== 3 || minimal.profile !== config.profile || !Array.isArray(minimal.targets)) fail('accepted active metadata');
  const count = minimal.targets.length;
  const acceptedSymbols = new Set(minimal.targets.map(target=>target.symbol));
  for (const [records,label] of [[minimal.targets,'active'],[build.targetReplacements,'build'],[fresh.targets,'fresh'],[verification.targets,'verified'],[verification.sourceObjectEvidence?.targets,'source-object evidence']]) {
    if (!Array.isArray(records) || records.length !== count || new Set(records.map(r=>r.symbol?.toLowerCase())).size !== count) fail(label + ' authentic target cardinality');
    if (records.some(r=>!acceptedSymbols.has(r.symbol))) fail(label + ' target membership');
  }
  const producerCount = new Set(minimal.targets.map(t=>t.compilationGroup || t.symbol)).size;
  if (construction && (build.verification !== undefined || fresh.mode !== 'single-isolated-build' || fresh.emptyOutputAtLaunch !== true
      || fresh.inputFingerprint !== state.fingerprint || fresh.baselineFingerprint !== state.baselineFingerprint
      || !/^[A-F0-9]{64}$/.test(fresh.outputSealSha256) || fresh.compilerSha256 !== build.compiler.sha256
      || !same(fresh.linkerInputs,build.objects.manifest) || fresh.producers !== producerCount
      || verification.elfRomBinding?.status !== 'pass' || verification.elfRomBinding.bytes !== config.rom.bytes
      || !same(verification.decodedDiagnostics,{status:'not-run',reason:'raw-exact-with-elf-rom-binding'}))) fail('fresh acceptance lineage');
  return {construction,count,producerCount};
}

// Authority stays in this module, never in serialized workbench metadata.
const completeOwnerContexts = new WeakMap();
function freezeRecord(value) {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) freezeRecord(child);
    Object.freeze(value);
  }
  return value;
}
function completeOwnerExpectation(context, target) {
  const record = completeOwnerContexts.get(context);
  if (!record) {
    if (target?.completeOwnerDiagnostic) fail('complete owner requires authenticated context');
    return null;
  }
  if (record.target !== target || record.snapshot !== JSON.stringify(target)
      || record.baseline !== context.acceptedFingerprint) fail('complete owner target/context drift');
  return record.expectation;
}

// Pure geometry only; this does not grant compiler eligibility.
function completeOwnerClosure(rows, bodies, firstRow, requestedSymbol) {
  if (requestedSymbol.toLowerCase() !== firstRow.part?.name.toLowerCase()) fail('complete primary selection required');
  const positiveBodies = bodies.filter(b => b.romEndExclusive > b.romStart);
  let start = firstRow.romStart, end = firstRow.romEndExclusive;
  let owners, required;
  for (;;) {
    required = positiveBodies.filter(b => b.romStart < end && b.romEndExclusive > start);
    const bodyStart = Math.min(start, ...required.map(b => b.romStart));
    const bodyEnd = Math.max(end, ...required.map(b => b.romEndExclusive));
    owners = rows.filter(r => r.romStart < bodyEnd && r.romEndExclusive > bodyStart);
    if (!owners.length) fail('complete owner closure is empty');
    const nextStart = owners[0].romStart, nextEnd = owners[owners.length - 1].romEndExclusive;
    if (nextStart === start && nextEnd === end) break;
    if (nextStart > start || nextEnd < end) fail('complete owner closure shrank');
    start = nextStart; end = nextEnd;
  }
  if (owners.length < 2 || owners[0] !== firstRow || start !== firstRow.romStart) fail('complete primary owner required');
  required.sort((a,b) => a.romStart - b.romStart);
  if (required.length !== 1 && required.length !== 2) fail('complete owner function cardinality');
  if (new Set(required.map(b=>b.symbol)).size !== required.length) fail('duplicate complete body symbol');
  let cursor = start;
  for (const body of required) {
    if (body.romStart !== cursor || body.romEndExclusive <= cursor || body.romEndExclusive > end || body.romStart % 4 || body.romEndExclusive % 4) fail('complete body tiling');
    cursor = body.romEndExclusive;
  }
  if (cursor !== end) fail('complete body suffix');
  cursor = start;
  // Accepted layout has no ordinal field: consecutive complete single-slice
  // rows plus contiguous ROM/VRAM establish adjacency. Reject conflicting
  // explicit ordinal metadata when supplied; never invent an accepted ordinal.
  for (const [index,row] of owners.entries()) {
    const slice = row.slices?.[0], previous = owners[index - 1], prev = previous?.slices[0];
    if (row.romStart !== cursor || row.bytes !== row.romEndExclusive - row.romStart
        || row.bytes <= 0 || row.bytes % 4 || row.inputKind !== 'tracked-assembly'
        || row.ownerKind !== 'tracked-assembly-part' || row.primaryClass !== 'code' || row.ambiguous !== false
        || !row.part || row.slices.length !== 1 || !slice.executable || slice.placementKind === 'rom-only'
        || slice.bytes !== row.bytes || slice.romStart !== row.romStart || slice.romEndExclusive !== row.romEndExclusive
        || row.part.romStartNumber !== row.romStart || row.part.romEndNumber !== row.romEndExclusive || row.part.bytes !== row.bytes
        || index && (row.index !== previous.index + 1 || slice.vramStart !== prev.vramEndExclusive
          || ((slice.ordinal !== undefined || prev.ordinal !== undefined) && slice.ordinal !== prev.ordinal + 1) || slice.placementKind !== prev.placementKind
          || slice.overlayDescriptorId !== prev.overlayDescriptorId || slice.loadSlabId !== prev.loadSlabId
          || slice.overlaySection !== prev.overlaySection)) fail('complete owner geometry/placement');
    cursor = row.romEndExclusive;
  }
  const markers = owners.slice(1).map(r => r.part.name);
  if (required.some(b => markers.includes(b.symbol))) fail('physical marker is not a compiler body');
  return { owners, bodies: required, romStart:start, romEndExclusive:end };
}

function fixedEntryCallerEvidence(body, env) {
  const { linkage, build, verified, fresh, output, expect, rows, rom, elf } = env;
  const entry = body.fragments[0].vramStart;
  const providers = linkage.symbols.filter(s => s.name === body.symbol);
  if (providers.length !== 1 || Number(providers[0].address) !== entry) fail('fixed entry provider missing/ambiguous');
  // Existing accepted metadata identifies the caller; only that caller is hydrated.
  const callers = build.targetReplacements.flatMap(r => (r.relocations || [])
    .filter(rel => rel.type === 'R_MIPS_26' && rel.symbol === body.symbol).map(rel => ({replacement:r,rel})));
  if (callers.length !== 1) fail('fixed entry caller missing/ambiguous');
  const { replacement, rel } = callers[0];
  if (replacement.owners.length !== 1 || replacement.splitContract || replacement.auxiliarySections?.length) fail('unsupported fixed entry caller');
  const vr = unique(verified.verification.targets,replacement.symbol,'caller verified');
  const fr = unique(fresh.targets,replacement.symbol,'caller fresh');
  if (!same(vr.sourceObjectEvidence?.proof,replacement.sourceObjectProof) || !same(fr.sourceObjectProof,replacement.sourceObjectProof)
      || fr.sourceSha256 !== replacement.sourceSha256 || fr.sourceClass !== replacement.sourceClass
      || fr.sourcePolicyDigest !== replacement.sourcePolicyDigest || !same(fr.compilationInput,replacement.compilationInput)) fail('caller companion contract');
  const artifact = record => {
    const file = path.resolve(output,record.path);
    if (!inside(output,file)) fail('caller artifact escapes output');
    return expect(file,record);
  };
  const proof = JSON.parse(artifact(replacement.sourceObjectProof));
  if (proof.target.symbol !== replacement.symbol || proof.target.sourceSha256 !== replacement.sourceSha256
      || proof.linkEvidence.fullOwnerExact !== true || text.representationDigest(proof) !== vr.representationSha256
      || text.representationDigest(proof,false) !== fr.freshRepresentationSha256) fail('caller representation lineage');
  const artifacts = proof.objectEvidence.artifacts;
  for (const record of Object.values(artifacts).filter(Boolean)) artifact(record);
  if (artifacts.rawObject.path !== replacement.sourceObject || artifacts.rawObject.sha256 !== replacement.sourceObjectSha256
      || artifacts.strippedObject.path !== replacement.cObject || artifacts.strippedObject.sha256 !== replacement.cObjectSha256) fail('caller object binding');
  const bytes = artifact(artifacts.rawObject), object = p7.parseElf32BigEndian(bytes);
  const sections = object.sections.filter(s => s.name === replacement.sectionName);
  if (sections.length !== 1) fail('caller text section census');
  const section = sections[0], offset = Number(rel.offset);
  const rels = object.sections.filter(s => s.type === 9 && s.info === section.index);
  const matches = [];
  for (const rs of rels) {
    if (rs.entrySize !== 8 || rs.size % 8) fail('caller REL encoding');
    for (let at = rs.offset; at < rs.offset + rs.size; at += 8) {
      if (bytes.readUInt32BE(at) === offset) matches.push({rs,info:bytes.readUInt32BE(at+4)});
    }
  }
  if (matches.length !== 1 || (matches[0].info & 255) !== 4 || !Number.isInteger(offset) || offset < 0 || offset % 4 || offset+4 > section.size) fail('caller actual R_MIPS_26');
  const symbols = object.symbols.filter(s => s.symbolTableIndex === matches[0].rs.link && s.symbolIndex === matches[0].info >>> 8);
  if (symbols.length !== 1 || symbols[0].name !== body.symbol || symbols[0].sectionIndex !== 0 || symbols[0].value !== 0) fail('caller relocation symbol');
  const rawWord = bytes.readUInt32BE(section.offset+offset), addend = (rawWord & 0x3ffffff)*4;
  if (rawWord >>> 26 !== 3) fail('caller relocation is not JAL');
  const row = rows[replacement.rowIndex];
  if (!row?.part || row.slices.length !== 1 || row.part.file !== replacement.originalAssemblyFallback
      || row.part.sha256 !== replacement.originalAssemblySha256 || row.bytes !== section.size) fail('caller original owner');
  const slice = row.slices[0];
  if (!slice.executable || slice.placementKind !== body.fragments[0].placementKind
      || slice.overlayDescriptorId !== body.fragments[0].overlayDescriptorId || slice.loadSlabId !== body.fragments[0].loadSlabId) fail('caller mapped placement');
  const original = expect(row.part.file,{bytes:row.part.textBytes,sha256:row.part.sha256});
  const words = require('../word_asm').assembleWordAsmText(original.toString('utf8')).bytes;
  if (words.length !== row.bytes || !words.equals(rom.subarray(row.romStart,row.romEndExclusive))
      || hash(words) !== vr.expectedTargetSha256 || vr.rawBytesExact !== true
      || vr.romStart !== row.romStart || vr.vramStart !== slice.vramStart) fail('caller complete original bytes');
  const pc = slice.vramStart+offset, originalWord = words.readUInt32BE(offset);
  const decoded = (((pc+4)&0xf0000000)|((originalWord&0x3ffffff)*4))>>>0;
  if (originalWord >>> 26 !== 3 || decoded !== entry || entry+addend !== decoded) fail('caller addend/original mapped JAL');
  const linked = elf.sections.filter(s => s.name === replacement.sectionName);
  if (linked.length !== 1 || linked[0].address !== slice.vramStart || linked[0].size !== row.bytes
      || !elf.buffer.subarray(linked[0].offset,linked[0].offset+row.bytes).equals(words)) fail('caller accepted linked bytes');
  const linkedProviders = elf.symbols.filter(s => s.name === body.symbol && s.sectionIndex !== 0);
  if (linkedProviders.length !== 1 || linkedProviders[0].value !== entry || linkedProviders[0].sectionIndex !== 0xFFF1) fail('caller accepted fixed provider');
  const proofRels = proof.linkEvidence.relocations.filter(r => Number(r.offset) === offset);
  if (proofRels.length !== 1 || proofRels[0].type !== 'R_MIPS_26' || proofRels[0].symbol !== body.symbol
      || proofRels[0].rawWord !== rawWord || proofRels[0].linkedWord !== originalWord || proofRels[0].linkedWordExact !== true) fail('caller proof relocation words');
  return {provider:providers[0],caller:replacement.symbol,proof:replacement.sourceObjectProof,
    sourceObject:artifacts.rawObject,original:{file:row.part.file,sha256:row.part.sha256},
    offset,rawWord,addend,romCall:row.romStart+offset,pc,originalWord,entry};
}

// Evidence-only inspection using the existing word-ASM reader, including its
// tracked comment-prefixed directives. Missing owner labels use the accepted
// physical metadata at offset zero, just as phase7's accepted model does.
function inspectCompleteOwnerSource(owner, source, expectedBytes) {
  const part=owner.part;
  if(!part || !/^[A-Za-z_.$][A-Za-z0-9_.$]*$/.test(part.name)
      || !same(identity(source),{bytes:part.textBytes,sha256:part.sha256})) fail('complete owner source identity');
  if(owner.bytes!==owner.romEndExclusive-owner.romStart || owner.bytes!==part.bytes
      || part.romStartNumber!==owner.romStart || part.romEndNumber!==owner.romEndExclusive
      || !Buffer.isBuffer(expectedBytes) || expectedBytes.length!==owner.bytes) fail('complete owner source metadata extent');
  const assemble=wordAssembly.assembleWordAsmText;
  const lines=source.toString('utf8').split(/\r?\n/);
  const escaped=part.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const pattern=new RegExp('^\\s*'+escaped+'\\s*:');
  const labels=lines.flatMap((line,index)=>pattern.test(line)?[index]:[]);
  if(labels.length>1 || labels.some(index=>/^\s*[A-Za-z_.$][A-Za-z0-9_.$]*\s*:/.test(lines[index].replace(pattern,''))))fail('ambiguous complete owner entry labels');
  const hasOwnerLabel=labels.length===1;
  const symbolByteOffset=hasOwnerLabel?assemble(lines.slice(0,labels[0]).join('\n')).bytes.length:0;
  if(symbolByteOffset!==0 || part.symbolByteOffset!==undefined && part.symbolByteOffset!==symbolByteOffset
      || part.hasOwnerLabel!==undefined && part.hasOwnerLabel!==hasOwnerLabel)fail('complete owner nonzero/conflicting entry metadata');
  const bytes=assemble(source.toString('utf8')).bytes;
  if(bytes.length!==owner.bytes || !bytes.equals(expectedBytes))fail('complete original owner bytes');
  return {bytes,hasOwnerLabel,symbolByteOffset,entryEvidence:hasOwnerLabel?'owner-label':'owner-metadata-offset-zero'};
}

function hydrateCompleteOwners(env) {
  const { rows, logicalConfig, row, symbol, model, expect, rom, config, multi, groupConfig, build } = env;
  const closure = completeOwnerClosure(rows,logicalConfig.bodies,row,symbol);
  const overlaps = p => p.romStart < closure.romEndExclusive && p.romEndExclusive > closure.romStart;
  if (logicalConfig.padding.some(overlaps) || logicalConfig.unavailableBodies.some(overlaps)
      || logicalConfig.preservedProductionEnvelopes.some(e => e.fragments.some(overlaps))) fail('unsupported complete owner coverage');
  const names=new Set([...closure.owners.map(r=>r.part.name.toLowerCase()),...closure.bodies.map(b=>b.symbol.toLowerCase())]);
  if(env.linkage.targets.some(t=>names.has(t.symbol.toLowerCase()) && (t.atomicText || t.auxiliaryProjection
      || t.auxiliarySections?.length || t.retainedLiteralReferences || t.nativeTextTail || t.compilerTextFunctions?.length))) fail('unsupported complete owner linkage representation');
  const owners = closure.owners.map(owner => {
    if (config.retainedPaddingCuts?.some(c => c.rowIndex === owner.index)
        || multi.targets.some(t => t.ownerRows.includes(owner.index))
        || groupConfig.groups.some(g => g.members.some(m => m.ownerRowIndex === owner.index))
        || build.targetReplacements.some(t => t.owners.some(o => o.rowIndex === owner.index))) fail('unsupported complete owner producer membership');
    const source = expect(owner.part.file,{bytes:owner.part.textBytes,sha256:owner.part.sha256});
    const entry=inspectCompleteOwnerSource(owner,source,rom.subarray(owner.romStart,owner.romEndExclusive));
    return {rowIndex:owner.index,symbol:owner.part.name,sectionName:owner.slices[0].sectionName,
      romStart:owner.romStart,romEndExclusive:owner.romEndExclusive,vramStart:owner.slices[0].vramStart,
      vramEndExclusive:owner.slices[0].vramEndExclusive,file:owner.part.file,sha256:owner.part.sha256,bytes:owner.bytes,
      entryEvidence:entry.entryEvidence,symbolByteOffset:entry.symbolByteOffset};
  });
  for (const body of closure.bodies) {
    if (hash(rom.subarray(body.romStart,body.romEndExclusive)) !== body.expectedBytesSha256
        || !same(require('../logical_functions').intersections(model,body.romStart,body.romEndExclusive),body.fragments)) fail('complete body fragment/hash contract');
  }
  const caller = closure.bodies.length === 2 ? fixedEntryCallerEvidence(closure.bodies[1],env) : null;
  const functions = closure.bodies.map((b,i) => ({symbol:i === 0 ? row.part.name : b.symbol,
    binding:i === 0 ? 'GLOBAL':'LOCAL',offset:b.romStart-closure.romStart,bytes:b.romEndExclusive-b.romStart}));
  return {...closure,owners,functions,caller};
}


// Resolve geometry only. No serialized or exported helper result grants authority.
function continuationSelection(rows,logicalConfig,symbol) {
  const description=selection.describe(rows,logicalConfig.bodies,symbol,{checkEntryOffset:false});
  if(['partial','alias','conflict'].includes(description.kind))fail(description.reason);
  if(description.kind!=='continuation')return null;
  return {symbol:description.canonicalSymbol,head:rows.find(r=>r.index===description.owners[0].rowIndex),tail:rows.find(r=>r.index===description.owners[1].rowIndex)};
}

function hydrateContinuation(pair, env) {
  const {logicalConfig,config,multi,groupConfig,minimal,build,linkage,expect,rom}=env;
  const rows=[pair.head,pair.tail], start=pair.head.romStart, end=pair.tail.romEndExclusive;
  const names=new Set([pair.symbol,...rows.map(r=>r.part.name)].map(n=>n.toLowerCase()));
  const named=r=>typeof r.symbol==='string' && names.has(r.symbol.toLowerCase());
  const overlaps=r=>r.romStart<end && r.romEndExclusive>start;
  if (logicalConfig.bodies.some(b=>overlaps(b)||[b.symbol,...b.aliases].some(n=>names.has(n.toLowerCase())))
      || logicalConfig.padding.some(overlaps) || logicalConfig.unavailableBodies.some(overlaps)
      || logicalConfig.preservedProductionEnvelopes.some(e=>e.fragments.some(overlaps))) fail('continuation logical coverage conflict');
  if (minimal.targets.some(named) || build.targetReplacements.some(named)
      || linkage.targets.some(t=>named(t) && (t.atomicText || t.auxiliaryProjection || t.auxiliarySections?.length
        || t.retainedLiteralReferences || t.nativeTextTail || t.compilerTextFunctions?.length))) fail('continuation named producer conflict');
  const owners=rows.map((row,index)=>{
    const part=row.part,slice=row.slices?.[0],prev=rows[index-1],prior=prev?.slices[0];
    if (!part || row.inputKind!=='tracked-assembly' || row.ownerKind!=='tracked-assembly-part'
        || row.primaryClass!=='code' || row.ambiguous!==false || row.slices.length!==1
        || !slice.executable || !['early-boot-linear','non-descriptor-load-slab','overlay'].includes(slice.placementKind)
        || typeof slice.sectionName!=='string' || !slice.sectionName || index && slice.sectionName===prior.sectionName
        || !Number.isSafeInteger(row.index) || !Number.isSafeInteger(row.romStart) || !Number.isSafeInteger(row.romEndExclusive)
        || row.bytes<=0 || row.bytes%4 || row.romStart%4 || row.romEndExclusive-row.romStart!==row.bytes
        || part.bytes!==row.bytes || part.romStartNumber!==row.romStart || part.romEndNumber!==row.romEndExclusive
        || slice.bytes!==row.bytes || slice.romStart!==row.romStart || slice.romEndExclusive!==row.romEndExclusive
        || !Number.isSafeInteger(slice.vramStart) || !Number.isSafeInteger(slice.vramEndExclusive)
        || slice.vramStart%4 || slice.vramEndExclusive-slice.vramStart!==row.bytes
        || index && (row.index!==prev.index+1 || row.romStart!==prev.romEndExclusive || slice.vramStart!==prior.vramEndExclusive
          || slice.placementKind!==prior.placementKind || slice.overlayDescriptorId!==prior.overlayDescriptorId
          || slice.loadSlabId!==prior.loadSlabId || slice.overlaySection!==prior.overlaySection)) fail('continuation owner geometry');
    if (config.retainedPaddingCuts?.some(c=>c.rowIndex===row.index)
        || multi.targets.some(t=>t.ownerRows.includes(row.index))
        || groupConfig.groups.some(g=>g.members.some(m=>m.ownerRowIndex===row.index))
        || build.targetReplacements.some(t=>t.owners.some(o=>o.rowIndex===row.index))) fail('continuation producer membership');
    const source=expect(part.file,{bytes:part.textBytes,sha256:part.sha256});
    const entry=inspectCompleteOwnerSource(row,source,rom.subarray(row.romStart,row.romEndExclusive));
    return {rowIndex:row.index,symbol:part.name,sectionName:slice.sectionName,romStart:row.romStart,romEndExclusive:row.romEndExclusive,
      vramStart:slice.vramStart,vramEndExclusive:slice.vramEndExclusive,file:part.file,sha256:part.sha256,bytes:row.bytes,
      entryEvidence:entry.entryEvidence,symbolByteOffset:entry.symbolByteOffset};
  });
  return {romStart:start,romEndExclusive:end,owners,functions:[{symbol:pair.symbol,binding:'GLOBAL',offset:0,bytes:end-start}],caller:null,
    markers:owners.map(o=>o.symbol),continuation:true,bodies:[]};
}

function load(options) {
  const { inputs, symbol } = options;
  if (!inputSet.isDiagnostic(inputs) || typeof symbol !== 'string') fail('diagnostic reader/target required');
  const read = file => inputs.read(path.resolve(ROOT, file));
  const json = file => JSON.parse(read(file));
  const expect = (file, expected) => {
    const bytes = read(file);
    if (!expected || !same(identity(bytes), { bytes: expected.bytes, sha256: expected.sha256 })) fail('artifact identity: ' + file);
    return bytes;
  };
  const config = json('config/phase7/conventional-build.json');
  const trustedConfig = JSON.parse(inputs.installedContract('config/phase7/conventional-build.json'));
  for (const field of ['rom', 'host', 'binutils', 'splat']) if (!same(config[field], trustedConfig[field])) fail('shared runtime/ROM pin differs: ' + field);
  const state = json('build/current/state.json');
  if (![6,7].includes(state.schemaVersion) || state.schemaVersion === 7 && state.status !== 'verified'
      || !state.verifiedAt || !/^[A-F0-9]{64}$/.test(state.fingerprint) || !/^[A-F0-9]{64}$/.test(state.baselineFingerprint)) fail('unverified historical state');
  const localTools = require('../local_tools').resolveLocalTools({ inputs, readOnly: true });
  const output = path.resolve(state.output);
  if (!inside(path.join(localTools.workRoot, 'current'), output)) fail('accepted output is outside configured current storage');
  for (const [field, name] of [['report','build-report.json'],['verificationReport','verification.json'],['freshCompilationReport','fresh-compilation.json']]) {
    if (key(state[field]) !== key(path.join(output, name))) fail('historical companion path: ' + field);
  }
  const selected = inputs.manifest.accepted;
  if (selected.fingerprint !== null && (selected.fingerprint !== state.fingerprint || selected.output !== state.output
      || selected.baselineFingerprint !== state.baselineFingerprint || !same(selected.buildReport,state.buildReport)
      || selected.verificationSha256 !== state.verificationSha256 || selected.freshCompilationSha256 !== state.freshCompilationSha256)) fail('selected historical state binding');
  const buildBytes = expect(state.report, state.buildReport), build = JSON.parse(buildBytes);
  const verifiedBytes = read(state.verificationReport), freshBytes = read(state.freshCompilationReport);
  if (hash(verifiedBytes) !== state.verificationSha256 || hash(freshBytes) !== state.freshCompilationSha256) fail('companion hash');
  const verified = JSON.parse(verifiedBytes), fresh = JSON.parse(freshBytes);
  const verification=verified.verification;
  const canonicalRom={bytes:config.rom.bytes,sha256:config.rom.sha256};
  const minimal = json('config/matching-c-targets.json');
  expect('config/matching-c-targets.json',build.acceptedInputs.phase8Config);
  const groupConfig = JSON.parse(expect('config/matching-c-compilation-groups.json',build.acceptedInputs.compilationGroupConfig));
  const logicalConfig = JSON.parse(expect('config/logical-functions.json',build.acceptedInputs.logicalFunctionConfig));
  const linkage = JSON.parse(expect('config/matching-c-linkage.json',build.acceptedInputs.linkageConfig));
  const multi = JSON.parse(expect('config/matching-c-multi-owner.json',build.acceptedInputs.multiOwnerConfig));
  const legacy = json('config/phase8/matching-c.json');
  const policy=JSON.parse(expect('config/source-policy.json',build.acceptedInputs.sourcePolicy));
  const trustedPolicy=JSON.parse(inputs.installedContract('config/source-policy.json'));
  if(!same(policy.preprocessor,trustedPolicy.preprocessor)||!same(policy.matchingCompiler,trustedPolicy.matchingCompiler))fail('shared preprocessor pin');
  if(legacy.compiler.executableSha256!==build.compiler.sha256 || !same(legacy.compiler.compileFlags,build.compiler.compileFlags))fail('accepted compiler flags/identity');
  for(const record of [{path:policy.preprocessor.path},...policy.preprocessor.requiredExecutables])inputs.resolve(path.resolve(ROOT,record.path));
  const {construction,count,producerCount}=validateHistoricalReports({state,build,fresh,verified,minimal,config});
  // Full metadata authentication is bounded: no source/object census follows.
  const modelInputs = build.acceptedInputs.phase7Model;
  const metadata = file => JSON.parse(expect(file,modelInputs.find(r=>r.path===file)));
  const semantic = metadata('config/splat/us_rev0.semantic.json');
  const manifest = metadata('asm/original/rev0/manifest.json');
  const layout = JSON.parse(expect(path.join(output,'layout.json'),verification.outputs.layout));
  const romPath = path.join(ROOT,'build/baserom.us_rev0.z64');
  const rom = expect(romPath,canonicalRom);
  const elfFile = path.join(output,'phase8.elf');
  const elfBytes = expect(elfFile,verification.outputs.elf);
  if (construction && !same(build.outputs.elf,verification.outputs.elf)) fail('construction/verified ELF mismatch');
  const elf = p7.parseElf32BigEndian(elfBytes);
  if (elf.header.type !== 2 || elf.header.machine !== 8) fail('accepted executable ELF');
  const parts = manifest.chunks.flatMap((chunk,chunkIndex)=>chunk.parts.map(part=>({...part,chunkIndex,romStartNumber:Number(part.romStart),romEndNumber:Number(part.romEndExclusive)})));
  const partByStart = new Map();
  for (const part of parts) { if(partByStart.has(part.romStartNumber))fail('duplicate original owner'); partByStart.set(part.romStartNumber,part); }
  if (semantic.rows.length!==config.expected.primaryRows || layout.owners.length!==semantic.rows.length) fail('accepted owner cardinality');
  const rows = semantic.rows.map((source,index)=>{
    const owner=layout.owners[index], part=partByStart.get(source.romStart);
    if(source.index!==index || owner.index!==index || owner.romStart!==source.romStart || owner.romEndExclusive!==source.romEndExclusive || owner.primaryId!==source.primaryId)fail('layout/semantic owner drift');
    return {...source,inputKind:part?'tracked-assembly':'splat-data',part:part||null,slices:owner.slices.map((slice,sliceIndex)=>({...slice,rowIndex:index,sliceIndex,sliceCount:owner.slices.length,bytes:slice.romEndExclusive-slice.romStart,primaryId:source.primaryId}))};
  });
  const continuation = continuationSelection(rows,logicalConfig,symbol);
  const continuationComplete = continuation ? hydrateContinuation(continuation,{logicalConfig,config,multi,groupConfig,minimal,build,linkage,expect,rom}) : null;
  const selectedDescription=selection.describe(rows,logicalConfig.bodies,symbol,{checkEntryOffset:false});
  const candidates=['owner','continuation'].includes(selectedDescription.kind)?rows.filter(r=>r.index===selectedDescription.primaryRowIndex):[];
  if(candidates.length!==1)fail('target original owner missing/ambiguous');
  const row=candidates[0], part=row.part;
  const sourceBytes=expect(part.file,{bytes:part.textBytes,sha256:part.sha256});
  const sourceText=sourceBytes.toString('utf8');
  const assembled=require('../word_asm').assembleWordAsmText(sourceText).bytes;
  if(assembled.length!==row.bytes || !assembled.equals(rom.subarray(row.romStart,row.romEndExclusive)))fail('complete original owner bytes');
  if (continuation) {
    const entry=inspectCompleteOwnerSource(row,sourceBytes,rom.subarray(row.romStart,row.romEndExclusive));
    part.symbolByteOffset=entry.symbolByteOffset;part.hasOwnerLabel=entry.hasOwnerLabel;
  } else {
    const lines=sourceText.split(/\r?\n/), label=lines.findIndex(line=>line.trim()===part.name+':');
    part.symbolByteOffset=label<0?0:lines.slice(0,label).filter(line=>/^\s*\.word\b/.test(line)).length*4;
    part.hasOwnerLabel=label>=0;
  }
  const overlaps=r=>r.romStart<row.romEndExclusive&&r.romEndExclusive>row.romStart;
  if(multi.targets.some(t=>t.ownerRows.includes(row.index)))fail('complete multi-owner producer required');
  if(groupConfig.groups.some(g=>g.members.some(m=>m.ownerRowIndex===row.index)))fail('complete-group-candidate-required');
  const activeEntries=minimal.targets.filter(t=>t.symbol.toLowerCase()===part.name.toLowerCase());
  if(activeEntries.length>1)fail('duplicate active target');
  const activeEntry=activeEntries[0];
  // Do not erase unsupported coupled membership by selecting one member.
  const replacements=build.targetReplacements.filter(r=>r.owners.some(o=>o.rowIndex===row.index));
  if(activeEntry?.compilationGroup || replacements.some(r=>minimal.targets.find(t=>t.symbol===r.symbol)?.compilationGroup))fail('complete-group-candidate-required');
  if(replacements.length>1 || replacements.some(r=>r.owners.length!==1) || row.slices.length!==1
      || part.symbolByteOffset!==0 || config.retainedPaddingCuts?.some(c=>c.rowIndex===row.index))fail('unsupported complete physical producer');
  const slice=row.slices[0];
  if(!slice.executable || slice.placementKind==='rom-only')fail('unqualified runtime placement');
  const reviewed=active.validateLinkageConfig(linkage,config.profile);
  const contract=activeEntry?active.selectRelocationContract(activeEntry.symbol,reviewed.targets.get(activeEntry.symbol.toLowerCase())||null,legacy.targets.find(t=>t.symbol.toLowerCase()===activeEntry.symbol.toLowerCase())||null):null;
  if(contract?.atomicText)fail('atomic-owner-candidate-required');
  if(contract?.auxiliaryProjection || contract?.auxiliarySections?.length || contract?.retainedLiteralReferences)fail('unsupported diagnostic producer representation');
  const model=inputSet.bind({config,rows,slices:rows.flatMap(r=>r.slices),inputFiles:modelInputs,assemblyManifest:manifest},inputs);
  let bodyRecords=logicalConfig.bodies.filter(overlaps), padding=logicalConfig.padding.filter(overlaps);
  // Existing complete single-owner path does no additional metadata scan or read.
  const complete = continuationComplete || (bodyRecords.some(b => b.romEndExclusive > b.romStart && (b.romStart < row.romStart || b.romEndExclusive > row.romEndExclusive))
    ? hydrateCompleteOwners({rows,logicalConfig,row,symbol,model,expect,rom,config,multi,groupConfig,build,linkage,verified,fresh,output,elf}) : null);
  if (complete) { bodyRecords=complete.bodies; padding=[]; }
  const spanStart=complete?.romStart ?? row.romStart, spanEnd=complete?.romEndExclusive ?? row.romEndExclusive;
  if(logicalConfig.unavailableBodies.some(overlaps) || logicalConfig.preservedProductionEnvelopes.some(e=>e.fragments.some(overlaps)))fail('unsupported logical coverage');
  const coverage=[...bodyRecords.map(b=>({...b,kind:'function'})),...padding.map(b=>({...b,kind:'padding'}))].sort((a,b)=>a.romStart-b.romStart);
  if(coverage.length){let cursor=spanStart;for(const piece of coverage){if(piece.romStart!==cursor||piece.romEndExclusive>spanEnd||hash(rom.subarray(piece.romStart,piece.romEndExclusive))!==piece.expectedBytesSha256)fail('incomplete body coverage');cursor=piece.romEndExclusive;}if(cursor!==spanEnd)fail('incomplete body suffix');}
  for(const body of bodyRecords){const fragments=require('../logical_functions').intersections(model,body.romStart,body.romEndExclusive);if(!same(fragments,body.fragments))fail('logical fragment contract');}
  const target={schemaVersion:1,symbol:part.name,primaryId:row.primaryId,rowIndex:row.index,romStart:row.romStart,romEndExclusive:row.romEndExclusive,bytes:row.bytes,
    vramStart:slice.vramStart,vramEndExclusive:slice.vramEndExclusive,entryVram:slice.vramStart,symbolByteOffset:0,sectionName:slice.sectionName,placementKind:slice.placementKind,
    overlayDescriptorId:slice.overlayDescriptorId,loadSlabId:slice.loadSlabId,originalAssembly:part.file,originalAssemblySha256:part.sha256,row,
    expectedBytes:Buffer.from(assembled),expectedBytesSha256:hash(assembled),activeMatchingSource:activeEntry?.source||null,activeMatchingProducer:activeEntry?{kind:'standalone',source:activeEntry.source}:null};
  if(coverage.length)Object.assign(target,{selectionKind:'physical-owner-envelope',logicalFunctions:bodyRecords.map((b,i)=>({...b,symbol:i===0?target.symbol:b.symbol,offset:b.romStart-row.romStart,bytes:b.romEndExclusive-b.romStart})),logicalCoverage:coverage,logicalCoverageComplete:true});
  if (complete) {
    Object.assign(target,{selectionKind:'complete-owner-diagnostic',romEndExclusive:spanEnd,bytes:spanEnd-spanStart,
      vramEndExclusive:complete.owners[complete.owners.length-1].vramEndExclusive,
      expectedBytes:Buffer.from(rom.subarray(spanStart,spanEnd)),expectedBytesSha256:hash(rom.subarray(spanStart,spanEnd)),
      completeOwnerDiagnostic:{owners:complete.owners,expectedFunctions:complete.functions,caller:complete.caller}});
  }
  if (continuation) {
    const fn={symbol:continuation.symbol,romStart:spanStart,romEndExclusive:spanEnd,offset:0,bytes:spanEnd-spanStart,binding:'GLOBAL'};
    Object.assign(target,{symbol:continuation.symbol,logicalFunctions:[fn],logicalCoverage:[{...fn,kind:'function'}],logicalCoverageComplete:true});
  }
  const producerTargets=[];
  if(activeEntry){
    const replacement=unique(build.targetReplacements,activeEntry.symbol,'replacement');
    const owner={symbol:target.symbol,row,rowIndex:row.index,primaryId:row.primaryId,chunkIndex:part.chunkIndex,sectionName:slice.sectionName,logicalOffset:0,bytes:row.bytes,originalAssembly:part.file,originalAssemblySha256:part.sha256,
      romStartNumber:row.romStart,romEndNumber:row.romEndExclusive,vramStartNumber:slice.vramStart,vramEndNumber:slice.vramEndExclusive,expectedTextSha256:hash(assembled)};
    const producer={...target,source:activeEntry.source,sourceSha256:replacement.sourceSha256,model,rows:[row],chunkIndex:part.chunkIndex,romStart:hex(row.romStart),romEndExclusive:hex(row.romEndExclusive),
      romStartNumber:row.romStart,romEndNumber:row.romEndExclusive,vramStart:hex(slice.vramStart),vramEndExclusive:hex(slice.vramEndExclusive),vramStartNumber:slice.vramStart,vramEndNumber:slice.vramEndExclusive,
      textOwners:[owner],multiOwner:false,multiOwnerContract:null,expectedTextSha256:hash(assembled),expectedRelocations:contract.expectedRelocations,relocationContractSource:contract.source,
      nativeTextTail:contract.nativeTextTail||null,compilerTextFunctionsExplicit:Boolean(contract.nativeTextTail)||contract.compilerTextFunctions.length>0,auxiliarySections:[]};
    producer.compilerTextFunctions=active.resolveCompilerTextFunctions(producer,contract.compilerTextFunctions);
    if(bodyRecords.length && producer.compilerTextFunctions.length!==bodyRecords.length)fail('complete producer function census');
    const companionRecords=text.buildTargetRecords(build,producer,count,verification);
    const freshRecord=unique(fresh.targets,target.symbol,'fresh'), verifiedRecord=companionRecords.verified;
    if(freshRecord.source!==producer.source || freshRecord.sourceSha256!==producer.sourceSha256 || freshRecord.sourceClass!==replacement.sourceClass || freshRecord.sourcePolicyDigest!==replacement.sourcePolicyDigest
        || !same(freshRecord.compilationInput,replacement.compilationInput) || !same(text.proofDescriptor(freshRecord),text.proofDescriptor(replacement))
        || verifiedRecord.rowIndex!==row.index || verifiedRecord.sectionName!==slice.sectionName || verifiedRecord.romStart!==row.romStart || verifiedRecord.bytes!==row.bytes || verifiedRecord.vramStart!==slice.vramStart
        || verifiedRecord.rawBytesExact!==true || verifiedRecord.expectedTargetSha256!==hash(assembled))fail('selected producer companion contract');
    const proof=JSON.parse(expect(path.join(output,replacement.sourceObjectProof.path),replacement.sourceObjectProof));
    for(const record of Object.values(proof.objectEvidence.artifacts).filter(Boolean)){if(!inside(output,path.join(output,record.path)))fail('proof artifact escapes output');expect(path.join(output,record.path),record);}
    expect(path.join(output,'phase8.map'),verification.outputs.map);
    if(proof.linkEvidence.fullOwnerExact!==true || text.representationDigest(proof)!==verifiedRecord.representationSha256 || text.representationDigest(proof,false)!==freshRecord.freshRepresentationSha256)fail('selected complete-producer proof');
    producerTargets.push(inputSet.bind(producer,inputs));
  }
  const modelManifest={schemaVersion:1,scope:'candidate-target-diagnostic',acceptedFingerprint:state.fingerprint,targetSymbol:target.symbol,originalOwnerSha256:part.sha256,structuralInputs:build.acceptedInputs.phase7Model,
    logicalConfig:build.acceptedInputs.logicalFunctionConfig,linkageConfig:build.acceptedInputs.linkageConfig,implementation:hash(fs.readFileSync(__filename))};
  modelManifest.selectionImplementation=hash(fs.readFileSync(require.resolve('./target_selection')));
  if (complete) modelManifest.completeOwnerDiagnostic=target.completeOwnerDiagnostic;
  if (continuation) modelManifest.continuationImplementation = ['tools/lib/matching/target_model.js','tools/lib/word_asm.js'].map(file=>({path:file,sha256:hash(fs.readFileSync(inputs.sharedImplementation(execution.codePath(file))))}));
  const modelId=hash(Buffer.from(JSON.stringify(modelManifest)));
  target.modelId=modelId;target.targetId=hash(Buffer.from(JSON.stringify({modelId,symbol:target.symbol,romStart:target.romStart,bytes:target.bytes,expectedBytesSha256:target.expectedBytesSha256})));
  const workbench=inputSet.bind({config:json('config/matching-workbench.json'),model,modelId,modelManifest,baserom:rom,targets:[inputSet.bind(target,inputs)],logicalTargets:[],bySymbol:new Map([[target.symbol.toLowerCase(),target]]),activeTargetsBySymbol:new Map(producerTargets.map(t=>[t.symbol.toLowerCase(),t])),diagnosticTargetScope:true},inputs);
  const phase6Manifest=JSON.parse(expect(legacy.compiler.manifest,{bytes:read(legacy.compiler.manifest).length,sha256:legacy.compiler.manifestSha256}));
  if(phase6Manifest.compiler.executableSha256!==legacy.compiler.executableSha256 || !same(phase6Manifest.compiler.compileFlags,legacy.compiler.compileFlags))fail("compiler manifest contract");
  const toolConfig=json('config/toolchain.json');
  const assemblerIdentity={id:toolConfig.id,sourceCommit:toolConfig.sourceCommit,...build.acceptedInputs.gnuBinutils26,assemblerExecutableSha256:config.binutils.tools['mips-kmc-elf-as.exe'],assemblerFlags:config.binutils.compilerAssemblerFlags};
  const diagnosticModel={phase6Manifest,config:{compiler:legacy.compiler},model,targets:producerTargets,linkSymbols:reviewed.linkSymbols,compilationGroups:[],diagnosticMetadata:{minimal,groupConfig,logicalConfig,multi},toolchain:{identity:assemblerIdentity}};
  const context=inputSet.bind({acceptedFingerprint:state.fingerprint,acceptedBaselineFingerprint:state.baselineFingerprint,acceptedTargetCount:count,acceptedProducerCount:producerCount,
    state,build,verified,fresh,producerModel:diagnosticModel,localTools,baserom:{path:romPath,bytes:rom.length,sha256:hash(rom)},rom,workbench,
    environment:{output,buildReport:build,buildReportFile:state.report,buildReportSha256:state.buildReport.sha256,verificationFile:state.verificationReport,verificationSha256:state.verificationSha256,
      acceptedElf:elf,acceptedElfFile:elfFile,acceptedElfSha256:verification.outputs.elf.sha256},read,expect},inputs);
  contexts.add(context);
  if (complete) {
    const expectation=freezeRecord(JSON.parse(JSON.stringify({functions:complete.functions,
      markers:complete.markers || complete.owners.slice(1).map(o=>o.symbol),owners:complete.owners,caller:complete.caller})));
    completeOwnerContexts.set(context,{target,snapshot:JSON.stringify(target),baseline:context.acceptedFingerprint,expectation});
  }
  return context;
}
function runtime(context, inputs) {
  if (!isDiagnosticContext(context)) fail('runtime requires diagnostic context');
  const config=context.producerModel.model.config;
  p7.verifyRuntimeExecutables(config,{splatPython:context.localTools.splatPython});
  for(const file of [process.execPath,context.localTools.splatPython,context.localTools.compiler]) inputs.resolve(file);
  require('../phase8_matching_c').verifyCompiler(context.producerModel,context.localTools.compiler);
  const toolchain=JSON.parse(inputs.read(path.join(ROOT,'config/toolchain.json')));
  active.validateToolchainPin(JSON.parse(inputs.read(path.join(ROOT,'config/matching-c-targets.json'))).toolchain,inputs);
  const binRoot=path.resolve(ROOT,toolchain.localRoot,'bin'), tools={};
  for(const name of ['mips-kmc-elf-as.exe','mips-kmc-elf-ld.exe','mips-kmc-elf-objcopy.exe','msys-2.0.dll']) {
    const file=path.join(binRoot,name); inputs.resolve(file);
    const bytes=fs.readFileSync(file), sha256=hash(bytes);
    if(sha256!==config.binutils.tools[name])fail('native tool pin: '+name);
    tools[name]={path:file,bytes:bytes.length,sha256};
  }
  return {binRoot,tools};
}
function authenticateCode(inputs) {
  const fixed=['tools/match.js','tools/matching_workbench/private_guard.py','tools/matching_workbench/store.py','tools/matching_workbench/schema.sql'];
  for(const file of fixed) inputs.sharedImplementation(execution.codePath(file));
  for(const file of Object.keys(require.cache)) if(inside(execution.codePath('tools'),file)) inputs.sharedImplementation(file);
}
// Evidence inspection is public for fixtures; only load() can bind private eligibility.
module.exports={continuationSelection,hydrateContinuation,inspectCompleteOwnerSource,fixedEntryCallerEvidence,completeOwnerClosure,completeOwnerExpectation,validateHistoricalReports,runtime,authenticateCode,load,isDiagnosticContext,producerModel,baselineFingerprint,assertCanonicalContext};
