#!/usr/bin/env node
'use strict';

// Schema/admission controls have no native or ignored-artifact prerequisite.
// Real producer, relocation, link, cache and replay controls accompany the
// independently reviewed tooling package and run against preserved native objects.
const assert = require('assert/strict');
const { sha256Buffer: hash } = require('../tools/lib/phase7_conventional');
const groups = require('../tools/lib/compilation_groups');
const auxiliary = require('../tools/lib/auxiliary_projection');
const cache = require('../tools/lib/diff_object_cache');

function fixture() {
  const table = Buffer.alloc(8); table.writeUInt32BE(32);
  return {
    id: 'function_fragment_fixture', source: 'src/fixture.c',
    mode: 'native-text-owner-functions-readonly-fragment-projection',
    members: [{ symbol: 'first', ownerRowIndex: 0, functionSymbols: ['first'] },
      { symbol: 'second', ownerRowIndex: 1, functionSymbols: ['second', 'third'] }],
    functions: ['first', 'second', 'third'].map((symbol, i) => ({ symbol,
      offset: i * 16, bytes: 16, binding: 1, symbolType: 2, visibility: 0 })),
    text: { section: '.text', bytes: 48, alignment: 16, type: 1, flags: 6, sha256: hash(Buffer.alloc(48)) },
    tail: { offset: 48, bytes: 0, sha256: hash(Buffer.alloc(0)), origin: 'native-assembler-section-alignment' },
    relocations: [],
    auxiliary: { compilerLabel: '.L3', alignmentDirectives: [3, 2], sections: [{
      memberSymbol: 'second', functionSymbol: 'third', kind: 'switch-table',
      compilerSection: '.rodata', outputSection: '.ob64.r0002', sectionType: 'SHT_PROGBITS',
      sectionFlags: ['SHF_ALLOC'], alignment: 8, romStart: '0x00000100', romEndExclusive: '0x00000108',
      vramStart: '0x80000100', vramEndExclusive: '0x80000108', bytes: 8, entries: 1,
      expectedObjectSha256: hash(table), expectedLinkedSha256: hash(table), preservedTail: null,
      trailingPaddingBytes: 4, expectedTrailingPaddingSha256: hash(Buffer.alloc(4)),
      expectedRelocations: [{ offset: '0x00000000', type: 'R_MIPS_32', symbol: '.text',
        addend: '0x00000020', section: '.rel.rodata' }],
    }] },
  };
}

function runTests() {
  const check = group => groups.registry({ schemaVersion: 1, profile: 'fixture', groups: [group] }, 'fixture');
  const good = fixture(); check(good);
  assert.equal(groups.fragmentMode(good), true);
  assert.equal(groups.functionMode(good), false);
  assert.equal(auxiliary.composed(good), false);
  assert.equal(groups.functionOwners(good), true);
  assert.deepEqual(groups.memberFunctions(good, 1).map(f => f.symbol), ['second', 'third']);
  let rejected = 0;
  function mutation(change, expected) {
    check(good);
    const bad = structuredClone(good); change(bad);
    assert.notDeepEqual(bad, good);
    assert.throws(() => check(bad), expected); rejected++;
    check(good);
  }
  for (const change of [
    g => g.functions[2].binding = 0,
    g => g.members[1].functionSymbols.pop(),
    g => g.members[1].functionSymbols.reverse(),
    g => g.members.pop(),
    g => g.functions[0].bytes += 4,
    g => g.members[1].ownerRowIndex = 0,
    g => g.auxiliary.sections[0].memberSymbol = 'first',
    g => g.auxiliary.sections[0].functionSymbol = 'missing',
    g => g.auxiliary.sections[0].trailingPaddingBytes = 8,
    g => g.auxiliary.sections[0].expectedTrailingPaddingSha256 = '0'.repeat(64),
    g => g.auxiliary.sections[0].compilerOccurrences = [],
    g => g.auxiliary.sections[0].sourceObjectPrefix = {},
    g => g.auxiliary.extra = true,
    g => g.retainedLiteralReferences = {},
    g => g.mode = 'native-text-owner-functions-projection',
    g => g.mode = 'native-text-readonly-owner-projection',
  ]) mutation(change);
  mutation(g => { g.relocations = [
    { offset: 16, type: 5, symbol: 'external', symbolValue: 0, symbolSection: 'UND', word: 0x3c020000 },
    { offset: 32, type: 6, symbol: 'external', symbolValue: 0, symbolSection: 'UND', word: 0x24420000 },
  ]; }, /cross-function/);
  assert.throws(() => auxiliary.assertCompleteGroupRows(good), /group mode/);
  const target = { symbol: 'first', source: good.source, compilationGroup: good };
  const names = t => cache.artifactSpecifications(t).map(a => a.name);
  assert(names(target).includes('text-projected.o'));
  for (const mode of ['native-text-owner-projection', 'native-text-owner-functions-projection']) {
    assert.equal(names({ ...target, compilationGroup: { ...good, mode } }).includes('text-projected.o'), false);
  }
  for (const mode of ['native-text-readonly-owner-projection', 'native-text-readonly-single-owner-projection',
    'native-text-readonly-interior-run-projection']) {
    assert.equal(names({ ...target, compilationGroup: { ...good, mode } }).includes('text-projected.o'), true);
  }
  assert.throws(() => groups.validateFunctionGroupProof({ textContract: { schemaVersion: 12,
    producer: { mode: 'native-text-owner-functions-projection' } }, objectEvidence: { schemaVersion: 20 } }), /fragment proof schema/);
  for (const section of [
    { name: '.evil', type: 1, flags: 0, address: 0 },
    { name: '.note', type: 7, flags: 4, address: 0 },
    { name: '.data', type: 1, flags: 0, address: 0, size: 4, alignment: 16 },
  ]) {
    const empty = { index: 0, name: '', nameOffset: 0, type: 0, flags: 0, address: 0,
      offset: 0, size: 0, link: 0, info: 0, alignment: 0, entrySize: 0 };
    assert.throws(() => groups.allocation({ sections: [empty, { ...section, index: 1 }], symbols: [] }, good, 'raw'),
      /fragment (uncontracted object section|writable storage shape)/); rejected++;
  }
  return { status: 'pass', rejected, distinctMode: true, legacyArtifactSetsUnchanged: true, singleFragment:runSingleFragmentSchemaTests() };
}

// Supplied by the confined real-object fixture: mutate serialized section headers,
// not a parsed report, at each artifact stage. Legacy modes are not modified.
function runObjectGrammarTests(artifacts, group) {
  const results = [];
  assert.deepEqual(Object.keys(artifacts).sort(), ['projected', 'raw', 'stripped', 'text-projected']);
  for (const [stage, good] of Object.entries(artifacts)) {
    const validate = bytes => groups.validateObject(groups.parseBuffer(bytes), group, stage);
    validate(good);
    const at = good.readUInt32BE(32), count = good.readUInt16BE(48);
    assert.equal(good.readUInt16BE(46), 40);
    assert(good.subarray(at, at + 40).equals(Buffer.alloc(40)));
    const mutations = [];
    const duplicate = Buffer.concat([good, good.subarray(at, at + count * 40), Buffer.alloc(40)]);
    duplicate.writeUInt32BE(good.length, 32); duplicate.writeUInt16BE(count + 1, 48);
    mutations.push(['duplicate empty SHT_NULL', duplicate]);
    const payload = Buffer.from(good); payload.writeUInt32BE(52, at + 16); payload.writeUInt32BE(4, at + 20);
    mutations.push(['nonempty section zero', payload]);
    for (const [i, name] of ['name', 'type', 'flags', 'address', 'offset', 'size', 'link', 'info', 'alignment', 'entrySize'].entries()) {
      const bad = Buffer.from(good);
      // Use a real empty string at a nonzero offset to isolate null-header
      // shape from the preexisting duplicate named-section rejection.
      const value = i === 0 ? groups.parseBuffer(good).sections[good.readUInt16BE(50)].size - 1 : 1;
      bad.writeUInt32BE(value, at + i * 4);
      mutations.push(['section zero ' + name, bad]);
    }
    const section = groups.parseBuffer(good).sections.find(sec => sec.name === '.strtab');
    assert(section && section.index > 0);
    const extraEmpty = Buffer.from(good); extraEmpty.writeUInt32BE(0, at + section.index * 40);
    mutations.push(['nonzero-index empty name', extraEmpty]);
    const extraNull = Buffer.from(good); extraNull.writeUInt32BE(0, at + section.index * 40 + 4);
    mutations.push(['nonzero-index named SHT_NULL', extraNull]);
    for (const [name, bad] of mutations) {
      assert(!bad.equals(good));
      assert.throws(() => validate(bad), /fragment null section header shape/, stage + ': ' + name);
      if (stage === 'raw') assert.throws(() => groups.project(bad, group), /fragment null section header shape/);
      validate(good);
      results.push({ stage, name, sha256: hash(bad), rejected: true, rawProjectionRejected: stage === 'raw' });
    }
  }
  return { status: 'pass', negativeControls: results.length, positiveStages: Object.keys(artifacts), results };
}

if (require.main === module) console.log(JSON.stringify(runTests()));
module.exports = { runTests, runObjectGrammarTests };

function singleFragmentFixture(){
  const old=fixture(),s={...old.auxiliary.sections[0],memberSymbol:'first',functionSymbol:'first',bytes:4,entries:1,
    romEndExclusive:'0x00000104',vramEndExclusive:'0x80000104',expectedObjectSha256:hash(Buffer.alloc(4)),
    expectedLinkedSha256:hash(Buffer.alloc(4)),expectedRelocations:[{offset:'0x00000000',type:'R_MIPS_32',symbol:'.text',addend:'0x00000000',section:'.rel.rodata'}]};
  delete s.trailingPaddingBytes;delete s.expectedTrailingPaddingSha256;
  return {...old,id:'single_fragment_fixture',mode:'native-text-single-owner-readonly-fragment-projection',
    members:[{symbol:'first',ownerRowIndex:0}],functions:[{symbol:'first',offset:0,bytes:12,binding:1,symbolType:2,visibility:0}],
    text:{section:'.text',bytes:16,alignment:16,type:1,flags:6,sha256:hash(Buffer.alloc(16))},
    tail:{offset:12,bytes:4,sha256:hash(Buffer.alloc(4)),origin:'native-assembler-section-alignment'},
    auxiliary:{compilerLabel:'.L3',alignmentDirectives:[3,2],sections:[s],nativeSection:{section:'.rodata',type:1,flags:2,alignment:8,bytes:8,
      sha256:hash(Buffer.alloc(8)),link:0,info:0,entrySize:0,terminalAlignment:{offset:4,bytes:4,sha256:hash(Buffer.alloc(4)),origin:'native-assembler-section-alignment'}}}};
}
function runSingleFragmentSchemaTests(){
  const good=singleFragmentFixture(),check=g=>groups.registry({schemaVersion:1,profile:'fixture',groups:[g]},'fixture');check(good);
  assert(groups.singleFragment(good));assert(!groups.functionOwners(good));assert(!auxiliary.composed(good));assert(groups.readonlyProducer(good));
  assert(groups.hasFixedBindingEvidence(good));assert(cache.artifactSpecifications({symbol:'first',source:good.source,compilationGroup:good}).some(s=>s.name==='text-projected.o'));
  const changes=[g=>g.members.push({...g.members[0]}),g=>g.functions.push({...g.functions[0]}),g=>g.functions[0].binding=0,
    g=>g.functions[0].offset=4,g=>g.functions[0].bytes=8,g=>g.tail.bytes=8,g=>g.tail.sha256='0'.repeat(64),
    g=>g.auxiliary.sections.push(g.auxiliary.sections[0]),g=>g.auxiliary.sections[0].memberSymbol='other',g=>g.auxiliary.sections[0].functionSymbol='other',
    g=>g.auxiliary.sections[0].sourceObjectPrefix={},g=>g.auxiliary.sections[0].compilerOccurrences=[],g=>g.auxiliary.sections[0].trailingPaddingBytes=4,
    g=>g.auxiliary.nativeSection.link=1,g=>g.auxiliary.nativeSection.info=1,g=>g.auxiliary.nativeSection.entrySize=4,
    g=>g.auxiliary.nativeSection.flags=3,g=>g.auxiliary.nativeSection.alignment=16,g=>g.auxiliary.nativeSection.bytes=12,
    g=>g.auxiliary.nativeSection.terminalAlignment.bytes=0,g=>g.auxiliary.nativeSection.terminalAlignment.offset=0,
    g=>g.auxiliary.nativeSection.terminalAlignment.sha256='0'.repeat(64),g=>g.auxiliary.extra=true,g=>g.auxiliary.nativeSection.extra=true,
    g=>g.auxiliary.alignmentDirectives=[4,2],g=>g.retainedLiteralReferences={},g=>g.mode='native-text-owner-functions-readonly-fragment-projection'];
  for(const change of changes){const bad=structuredClone(good);change(bad);assert.throws(()=>check(bad));check(good);}
  let cross=0;for(const field of ['mode','text','object','composition'])for(const entry of ['validateFunctionGroupProof','validateComposedProof']){
    const p={textContract:{schemaVersion:12,producer:{mode:'native-text-owner-functions-readonly-fragment-projection'}},objectEvidence:{schemaVersion:20,composition:{schemaVersion:7}}};
    if(field==='mode')p.textContract.producer.mode=good.mode;else if(field==='text')p.textContract.schemaVersion=15;else if(field==='object')p.objectEvidence.schemaVersion=23;else p.objectEvidence.composition.schemaVersion=9;
    assert.throws(()=>groups[entry](p),/single fragment proof schema/);cross++;
  }
  return {status:'pass',schemaNegatives:changes.length,crossSchemaNegatives:cross,oldPredicatesUnchanged:true};
}
module.exports.singleFragmentFixture=singleFragmentFixture;
module.exports.runSingleFragmentSchemaTests=runSingleFragmentSchemaTests;

// Tests actual serialized ELF bytes supplied by the canonical-loader fixture.
function runSingleFragmentObjectTests(artifacts,group){
  assert(groups.singleFragment(group));let rejected=0;
  for(const [stage,good]of Object.entries(artifacts)){
    const validate=b=>groups.validateObject(groups.parseBuffer(b),group,stage),e=groups.parseBuffer(good);
    validate(good);const raw=['raw','text-projected'].includes(stage),ro=e.sections.find(s=>s.name===(raw?'.rodata':group.auxiliary.sections[0].outputSection)),text=e.sections.find(s=>s.name===(stage==='raw'?'.text':group.owners[0].sectionName));
    const mutate=fn=>{const b=Buffer.from(good);fn(b);assert.throws(()=>validate(b));validate(good);rejected++;};
    for(const field of [24,28,36])mutate(b=>b.writeUInt32BE(1,e.header.shoff+ro.index*40+field));
    mutate(b=>b.writeUInt32BE(3,e.header.shoff+ro.index*40+8));
    mutate(b=>b.writeUInt32BE(16,e.header.shoff+ro.index*40+32));
    mutate(b=>b.writeUInt32BE(ro.size+4,e.header.shoff+ro.index*40+20));
    if(raw)mutate(b=>b[ro.offset+ro.size-1]=1);
    mutate(b=>b[text.offset+group.tail.offset]=1);
    const rr=e.sections.find(s=>s.type===9&&s.info===ro.index);assert(rr&&rr.size>=16);
    mutate(b=>{const first=Buffer.from(b.subarray(rr.offset,rr.offset+8));b.copy(b,rr.offset,rr.offset+8,rr.offset+16);first.copy(b,rr.offset+8);});
    mutate(b=>b.writeUInt32BE(ro.size-4,rr.offset));
    mutate(b=>b.writeUInt32BE((b.readUInt32BE(rr.offset+4)&0xffffff00)|4,rr.offset+4));
    const anchor=e.symbols.find(s=>s.sectionIndex===ro.index&&s.symbolType===3),symtab=e.sections[anchor.symbolTableIndex];
    mutate(b=>b.writeUInt32BE(group.auxiliary.sections[0].bytes,symtab.offset+anchor.symbolIndex*16+4));
    const fn=e.symbols.find(s=>s.symbolType===2),ft=e.sections[fn.symbolTableIndex];
    mutate(b=>b.writeUInt32BE(fn.size+4,ft.offset+fn.symbolIndex*16+8));
    const meta=e.sections.find(s=>s.name==='.strtab');mutate(b=>b.writeUInt32BE(4,e.header.shoff+meta.index*40+8));
  }
  return {status:'pass',rejected,stages:Object.keys(artifacts)};
}
module.exports.runSingleFragmentObjectTests=runSingleFragmentObjectTests;
