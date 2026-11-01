'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
// Bounded fixture links omit external producers deliberately. Their addresses
// come from an explicitly selected exact accepted ELF, never mutable CURRENT.
function acceptedFixtureReference(c) {
  const { p7, hash, rom } = c;
  assert(c.acceptedState && /^[A-F0-9]{64}$/.test(c.acceptedStateSha256 || ''),
    'native fixture requires --accepted-state and --accepted-state-sha256');
  const consumed = [];
  const read = (file, expected) => {
    const bytes = fs.readFileSync(file);
    assert.strictEqual(hash(bytes), expected.sha256, 'accepted reference identity: ' + file);
    if (expected.bytes !== undefined) assert.strictEqual(bytes.length, expected.bytes);
    consumed.push({ path: path.resolve(file), bytes: bytes.length, sha256: hash(bytes) });
    return bytes;
  };
  const stateBytes = read(c.acceptedState, { sha256: c.acceptedStateSha256 });
  const state = JSON.parse(stateBytes);
  assert.strictEqual(state.schemaVersion, 7);
  assert.strictEqual(state.status, 'verified');
  assert(state.verifiedAt && state.output);
  for (const [key, name] of [['report', 'build-report.json'], ['verificationReport', 'verification.json'], ['freshCompilationReport', 'fresh-compilation.json']]) {
    assert.strictEqual(path.resolve(state[key]), path.resolve(state.output, name));
  }
  const build = JSON.parse(read(state.report, state.buildReport));
  const verified = JSON.parse(read(state.verificationReport, { sha256: state.verificationSha256 }));
  const fresh = JSON.parse(read(state.freshCompilationReport, { sha256: state.freshCompilationSha256 }));
  assert.strictEqual(build.schemaVersion, 8); assert.strictEqual(build.status, 'constructed');
  assert.strictEqual(verified.schemaVersion, 7); assert.strictEqual(verified.status, 'pass');
  assert.strictEqual(fresh.schemaVersion, 7); assert.strictEqual(fresh.status, 'pass');
  assert.deepStrictEqual(verified.buildReport, state.buildReport);
  assert.deepStrictEqual(fresh.buildReport, state.buildReport);
  assert.strictEqual(verified.verification.status, 'pass');
  assert.strictEqual(hash(rom), '571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A');
  assert.deepStrictEqual(verified.verification.outputs.rom, { bytes: rom.length, sha256: hash(rom) });
  assert.deepStrictEqual(build.outputs.rom, verified.verification.outputs.rom);
  assert.strictEqual(state.rom.bytes, rom.length); assert.strictEqual(state.rom.sha256, hash(rom));
  const elfBytes = read(path.join(state.output, 'phase8.elf'), verified.verification.outputs.elf);
  assert.deepStrictEqual(build.outputs.elf, verified.verification.outputs.elf);
  const elf = p7.parseElf32BigEndian(elfBytes);
  assert.strictEqual(elf.header.type, 2);
  return { elf, consumed, read, fingerprint: state.fingerprint,
    assertUnchanged() { for (const record of consumed) {
      const bytes = fs.readFileSync(record.path);
      assert.strictEqual(bytes.length, record.bytes);
      assert.strictEqual(hash(bytes), record.sha256, 'accepted reference closing identity');
    } } };
}

function resolveFixtureDependencies(c, objectFiles, reference) {
  const { p7, root, model, targets, phase8, rom, hash, inputs } = c;
  const inputSet = require(path.join(root, 'tools/lib/matching/input_set'));
  const p8 = require(path.join(root, 'tools/lib/phase8_matching_c'));
  const objects = objectFiles.map(file => ({ file, elf: p7.parseElfFile(file) }));
  const selectedRows = new Set(targets.flatMap(t => [...t.textOwners.map(o => o.rowIndex),
    ...t.auxiliarySections.map(a => a.ownerRowIndex)]));
  // Also protect physical/retained owners linked by the bounded original objects.
  for (const { elf } of objects) for (const section of elf.sections.filter(s => s.size && (s.flags & 2))) {
    for (const row of model.rows.filter(r => r.slices.some(s => s.sectionName === section.name))) selectedRows.add(row.index);
  }
  const protectedNames = new Set(targets.flatMap(t => [t.symbol, ...(t.compilerTextFunctions || []).map(f => f.symbol)]));
  for (const row of model.rows.filter(r => selectedRows.has(r.index))) if (row.part) protectedNames.add(row.part.name);
  const definedNames = new Set();
  for (const { elf } of objects) for (const symbol of elf.symbols) {
    if (symbol.name && symbol.sectionIndex !== 0 && symbol.symbolType !== 3) {
      protectedNames.add(symbol.name);
      if (symbol.binding === 1) definedNames.add(symbol.name);
    }
  }
  const links = { ...phase8.linkSymbols }, required = new Set();
  for (const name of Object.keys(links)) assert(!protectedNames.has(name), 'fixture alias shadows linked producer/owner: ' + name);
  for (const { elf } of objects) for (const relocation of p8.rawRelocationRecords(elf)) {
    // Defined local and section symbols retain their original object binding.
    if (relocation.symbolSectionIndex !== 0) continue;
    const symbols = elf.symbols.filter(s => s.name === relocation.symbol && s.sectionIndex === 0);
    assert(relocation.symbol && symbols.length === 1 && symbols[0].binding === 1,
      'fixture external relocation symbol is missing/ambiguous/non-global');
    if (!definedNames.has(relocation.symbol)) required.add(relocation.symbol);
  }
  const owners = new Map(), added = [];
  const candidates = name => reference.elf.symbols.filter(s => s.name === name && s.binding === 1 && s.sectionIndex !== 0);
  function provider(name) {
    const symbols = candidates(name);
    assert.strictEqual(symbols.length, 1, 'fixture provider missing/ambiguous: ' + name);
    const symbol = symbols[0], section = reference.elf.sections[symbol.sectionIndex];
    assert(section && section.type === 1 && (section.flags & 2) && [0, 1, 2].includes(symbol.symbolType)
      && symbol.visibility === 0, 'fixture provider requires an initialized accepted owner: ' + name);
    const matches = model.rows.flatMap(row => row.slices.filter(s => s.sectionName === section.name).map(slice => ({ row, slice })));
    assert.strictEqual(matches.length, 1, 'fixture provider owner missing/ambiguous: ' + name);
    const { row, slice } = matches[0];
    assert(!selectedRows.has(row.index) && !protectedNames.has(name), 'fixture provider shadows a linked physical owner: ' + name);
    assert(symbol.value >= slice.vramStart && symbol.value + Math.max(1, symbol.size) <= slice.vramEndExclusive,
      'fixture provider symbol escaped accepted owner: ' + name);
    assert.strictEqual(section.address, slice.vramStart); assert.strictEqual(section.size, slice.bytes);
    const loads = reference.elf.programHeaders.filter(h => h.type === 1 && (h.offset === section.offset || h.paddr === slice.romStart));
    assert.strictEqual(loads.length, 1, 'fixture provider load ambiguity');
    const load = loads[0];
    assert.strictEqual(load.offset, section.offset); assert.strictEqual(load.paddr, slice.romStart);
    assert.strictEqual(load.vaddr, slice.vramStart); assert.strictEqual(load.fileSize, slice.bytes);
    assert.strictEqual(load.memorySize, slice.bytes);
    assert(p7.elfSectionBytes(reference.elf, section).equals(rom.subarray(slice.romStart, slice.romEndExclusive)),
      'fixture provider ELF/ROM bytes differ');
    if (!owners.has(row.index)) {
      assert(row.inputKind === 'tracked-assembly' && row.part, 'fixture provider original owner missing');
      const source = inputSet.read(inputs, path.join(root, row.part.file));
      assert.strictEqual(hash(source), row.part.sha256, 'fixture provider original source identity');
      const bytes = require(path.join(root, 'tools/lib/word_asm')).assembleWordAsmText(source.toString('utf8')).bytes;
      assert.strictEqual(bytes.length, row.bytes);
      assert(bytes.equals(rom.subarray(row.romStart, row.romEndExclusive)), 'fixture provider whole original ROM bytes');
      owners.set(row.index, { rowIndex: row.index, source: row.part.file, sourceSha256: hash(source),
        romStart: row.romStart, romEndExclusive: row.romEndExclusive, bytes: row.bytes });
    }
    return { symbol: name, address: symbol.value, rowIndex: row.index, section: slice.sectionName,
      originalOwner: owners.get(row.index), acceptedSymbol: { value: symbol.value, size: symbol.size, type: symbol.symbolType } };
  }
  for (const name of [...required].sort()) {
    if (Object.hasOwn(links, name)) {
      // Existing reviewed aliases remain unchanged. When the reference defines
      // the same name, it must not conflict with that independently fixed value.
      const known = candidates(name);
      assert(known.length <= 1, 'fixture existing alias provider ambiguity: ' + name);
      if (known.length) assert.strictEqual(Number(links[name]), known[0].value, 'fixture conflicting provider: ' + name);
      continue;
    }
    const evidence = provider(name);
    links[name] = p7.hex(evidence.address); added.push(evidence);
  }
  return { links, added, required: [...required].sort(), protectedNames: [...protectedNames],
    assertUnchanged() { reference.assertUnchanged(); for (const owner of owners.values()) {
      assert.strictEqual(hash(inputSet.read(inputs, path.join(root, owner.source))), owner.sourceSha256,
        'fixture provider source closing identity');
    } } };
}

module.exports=function(c){
const {root,privateRoot,inputs,phase8,model,rom,targets,active,p7,intake,hash}=c;
const inputSet=require(path.join(root,'tools/lib/matching/input_set')),p8=require(path.join(root,'tools/lib/phase8_matching_c')),policy=require(path.join(root,'tools/lib/source_policy')),n=require(path.join(root,'tools/lib/real_mips_toolchain')),build=require(path.join(root,'tools/build_phase7_conventional'));
const tc=n.assertToolchainAvailable(n.loadToolchainConfig()),local=JSON.parse(fs.readFileSync(path.join(root,'config/local-tools.json')));p8.verifyCompiler(phase8,local.compiler);
const out=fs.mkdtempSync(path.join(privateRoot,'native-')),dest=path.join(out,'p8');fs.mkdirSync(dest);
const write=(f,b)=>{fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,b);},run=(e,args,cwd=out)=>n.runTool(e,args,{cwd});
const selected=new Set(targets.flatMap(t=>[...t.textOwners.map(o=>o.rowIndex),...t.auxiliarySections.map(a=>a.ownerRowIndex)]));selected.add(4934);
const rows=model.rows.filter(r=>selected.has(r.index)),bounded={...model,rows,slices:rows.flatMap(r=>r.slices)};inputSet.bind(bounded,inputs);for(const t of targets)t.model=bounded;
const reference=acceptedFixtureReference(c),links={...phase8.linkSymbols};
const w={...phase8,targets,model:bounded,linkSymbols:links};inputSet.bind(w,inputs);active.validateAuxiliaryOwnerGroups(targets,bounded);
const objects=[];for(const chunk of new Set(rows.map(r=>r.part.chunkIndex))){const owned=rows.filter(r=>r.part.chunkIndex===chunk),name='chunk_'+String(chunk).padStart(3,'0');write(path.join(out,name+'.s'),Buffer.concat(owned.map(r=>Buffer.from(build.transformTrackedPartSource(r,inputSet.read(inputs,path.join(root,r.part.file)))))));run(tc.assemblerAbs,[...tc.assemblerFlags,'-o',name+'.raw.o',name+'.s']);const rel='objects/assembly/'+name+'.o',file=path.join(out,'p7',rel);fs.mkdirSync(path.dirname(file),{recursive:true});run(tc.objcopyAbs,[...['--remove-section=.reginfo','--remove-section=.pdr','--remove-section=.comment','--remove-section=.note'],...owned.flatMap(r=>r.slices.filter(s=>s.executable)).flatMap(s=>['--set-section-flags',s.sectionName+'=alloc,load,code,readonly,data,contents']),name+'.raw.o',file]);objects.push({path:rel,bytes:fs.statSync(file).size,sha256:hash(fs.readFileSync(file))});}
const copied=p8.copyPhase7Objects(w,{files:{objectManifest:path.join(out,'p7/objects/manifest.json')},objectManifest:{objects}},dest,tc.objcopyAbs);
const sourcePolicy=policy.classifyTargetSources(targets),compiled=new Map();for(const t of targets){const classification=sourcePolicy.targets.find(x=>x.symbol===t.symbol);assert.equal(classification.class,'PURE_C');for(const d of classification.dependencies||[]){const actual=inputSet.read(inputs,path.join(root,d.path));assert.equal(hash(actual),d.sha256,'selected dependency '+d.path);}console.log('native compile '+t.symbol);compiled.set(t.symbol,p8.compileTarget(w,t,dest,local.compiler,tc.assemblerAbs,tc.objcopyAbs,{classification}));}
let manifest={linkedObjects:targets.map(t=>({path:'objects/c/'+t.symbol+'.o',ownerKind:'matching-c-target',targetSymbol:t.symbol}))};for(const replacement of copied.replacements.values()){for(const prefix of replacement.auxiliaryPrefixes||[])if(prefix.objectRelative)manifest.linkedObjects.push({path:prefix.objectRelative,ownerKind:'accepted-assembly-auxiliary-prefix',targetSymbol:prefix.symbol,...prefix});}
const dependencyObjects=[...copied.linkedObjects,...manifest.linkedObjects.map(r=>r.path)].map(p=>path.join(dest,p));
const dependencies=resolveFixtureDependencies(c,dependencyObjects,reference);w.linkSymbols=dependencies.links;
write(path.join(out,'fixture-dependencies.json'),JSON.stringify({reference:reference.consumed,acceptedFingerprint:reference.fingerprint,added:dependencies.added,required:dependencies.required},null,2)+'\n');
const script=p8.renderPhase8LinkerScript(w,manifest);write(path.join(dest,'linker/phase8.ld'),script);const linkObjects=[...copied.linkedObjects,...manifest.linkedObjects.map(r=>r.path)];run(tc.toolsAbs.linker,[...tc.linkerFlags,'-T','linker/phase8.ld','-Map=phase8.map','-o','phase8.elf',...linkObjects.reverse()],dest);
const linked=p7.parseElfFile(path.join(dest,'phase8.elf')),map=fs.readFileSync(path.join(dest,'phase8.map'),'utf8');
for(const row of rows)for(const slice of row.slices){const section=linked.sections.find(s=>s.name===slice.sectionName);assert(section,slice.sectionName);assert(p7.elfSectionBytes(linked,section).equals(rom.subarray(slice.romStart,slice.romEndExclusive)),slice.sectionName+' exact');}
p8.verifyRecordedSharedAuxiliaryScript(w,dest);p8.verifyInteriorGroupMapOwners(w,map);for(const t of targets)p8.verifyTargetMapOwner(t,map);
const proofs=[];for(const t of targets){const cl=sourcePolicy.targets.find(x=>x.symbol===t.symbol);const derived=p8.deriveSourceObjectProof(w,t,dest,cl,linked,rom);write(path.join(dest,'generated/c/'+t.symbol+'.source-object-proof.json'),derived.proofBytes);proofs.push({symbol:t.symbol,sha256:hash(derived.proofBytes)});}
const edge=targets[5],fallback=p7.parseElfFile(path.join(dest,'comparison/original/chunk_038.o')),pruned=p7.parseElfFile(path.join(dest,'objects/assembly/chunk_038.o')),cObj=p7.parseElfFile(path.join(dest,'objects/c/'+edge.symbol+'.o'));const physical=p8.verifyEdgePhysicalOwner(edge,fallback,pruned,cObj,linked,rom);p8.verifyEdgeMap(edge,map);p8.verifyRecordedEdgePadding(w,dest,{targets:[{symbol:edge.symbol,physicalOwnerEvidence:physical}]},{baserom:rom});
dependencies.assertUnchanged();
const report={diagnostic:true,out,externalDependencies:dependencies.added,acceptedReference:reference.consumed,producers:targets.map(t=>({symbol:t.symbol,bytes:t.bytes,chunk:t.chunkIndex,auxiliaryBytes:t.auxiliarySections[0].bytes})),rowBytes:244,zeroAsm:12,retainedPhysical:physical,proofs,limitations:['External aliases serve this bounded fixture only; canonical providers remain normal linked owners. No CURRENT lineage or whole-ROM acceptance is claimed.']};write(path.join(privateRoot,'native-report.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS native seven source/object/link/proof/retained replay');return{report,w,targets,sourcePolicy,out,dest,tc,local,linked,map,copied,manifest,script,proofs,dependencies,dependencyObjects,reference};
};
Object.assign(module.exports,{acceptedFixtureReference,resolveFixtureDependencies});
if(require.main===module){try{const value=flag=>{const i=process.argv.indexOf(flag);return i<0?undefined:process.argv[i+1];};const c=require('./shared_auxiliary_overlay').context({inputs:value('--inputs'),output:value('--output')});c.acceptedState=value('--accepted-state');c.acceptedStateSha256=value('--accepted-state-sha256');const native=module.exports(c);require('./shared_auxiliary_overlay_replay')(c,native);native.dependencies.assertUnchanged();}catch(e){console.error(e);process.exitCode=1;}}
