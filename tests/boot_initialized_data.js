'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const boot = require('../tools/lib/boot_initialized_data');
const { assembleWordAsmText } = require('../tools/lib/word_asm');
const { ROOT, loadAcceptedModel, sha256Buffer } = require('../tools/lib/phase7_conventional');

function runTests(model = loadAcceptedModel()) {
  const proof = model.bootInitializedDataProof;
  assert.deepStrictEqual(proof, { romStart: 0x1000, romEndExclusive: 0x101000,
    vramStart: 0x80070C00, vramEndExclusive: 0x80170C00, delta: 0x8006FC00,
    clearStart: 0x800AEDB0, clearEndExclusive: 0x800E9C20, preservedRomEndExclusive: 0x3F1B0 });
  const headerPath = 'data/source-owners/rev0/raw_header/0000_raw_header_00000000_00001000.srcbin';
  const header = fs.readFileSync(path.join(ROOT, headerPath));
  const source = fs.readFileSync(path.join(ROOT, 'asm/original/rev0/boot/boot_entry_clear_bss.s'), 'utf8');
  const clear = assembleWordAsmText(source).bytes;
  assert.deepStrictEqual(boot.authenticateSources(model.config, model.assemblyManifest, header, Buffer.from(source)), proof);
  assert.deepStrictEqual(boot.recognizeOriginalBytes(header, clear), proof);
  // Disassembly comments are not the emitted-word authority.
  assert.deepStrictEqual(boot.recognizeOriginalBytes(header,
    assembleWordAsmText(source.replace(/#.*$/gm, '# deliberately unrelated')).bytes), proof);
  let rejected = 0;
  const rejects = action => { assert.throws(action); rejected++; };
  for (const offset of [8, 0x4F0, 0x508, 0x590, 0x76C]) {
    const changed = Buffer.from(header); changed[offset + 3] ^= 4;
    rejects(() => boot.authenticateSources(model.config, model.assemblyManifest, changed, Buffer.from(source)));
  }
  rejects(() => boot.authenticateSources(model.config, model.assemblyManifest, header,
    Buffer.from(source.replace('.word 0x2508EDB0', '.word 0x2508EDB4'))));
  for (const offset of [0x4C4, 0x4D8, 0x4E8, 0x4F0, 0x500, 0x504, 0x508, 0x510, 0x58C, 0x590, 0x76C]) {
    const changed = Buffer.from(header); changed[offset + 3] ^= 4;
    rejects(() => boot.recognizeOriginalBytes(changed, clear));
  }
  for (const offset of [0, 4, 8, 12, 16, 24, 28, 32, 36]) {
    const changed = Buffer.from(clear); changed[offset + 3] ^= 4;
    rejects(() => boot.recognizeOriginalBytes(header, changed));
  }
  const changedConfig = structuredClone(model.config);
  delete changedConfig.acceptedInputSha256[headerPath];
  rejects(() => boot.loadProof(ROOT, changedConfig, model.assemblyManifest));
  changedConfig.acceptedInputSha256[headerPath] = '0'.repeat(64);
  rejects(() => boot.loadProof(ROOT, changedConfig, model.assemblyManifest));
  const changedManifest = structuredClone(model.assemblyManifest);
  changedManifest.chunks.flatMap(c => c.parts).find(p => p.file.endsWith('/boot_entry_clear_bss.s')).sha256 = '0'.repeat(64);
  rejects(() => boot.loadProof(ROOT, model.config, changedManifest));
  const validate = () => boot.validateSlabs(model.config, model.nonDescriptorLoadSlabs,
    model.overlays, model.rows, proof);
  const slab = model.nonDescriptorLoadSlabs.find(s => s.kind === 'boot-initialized-data');
  const row = model.rows[789], slice = row.slices[0];
  validate();
  // The identical object passes, then rejects only the named invalid mutation,
  // then passes again after restoration. This prevents broken fixtures from
  // giving vacuous negative coverage.
  function mutation(object, key, value, action = validate) {
    action(); const previous = object[key]; object[key] = value;
    try { rejects(action); } finally { object[key] = previous; }
    action();
  }
  mutation(model.config.rom, 'earlyBootLinearBase', proof.delta + 4);
  mutation(model.config.rom, 'earlyBootLinearEndExclusive', 0x3F1B0);
  mutation(slab, 'vramStart', slab.vramStart + 4);
  mutation(slab, 'romStart', slab.romStart + 4);
  mutation(slab, 'romStart', Number.MAX_SAFE_INTEGER);
  mutation(slab, 'executableRanges', [{ id: 'bad', romStart: slab.romStart, romEndExclusive: slab.romEndExclusive }]);
  mutation(slab, 'nonExecutableRanges', [{ id: 'bad', romStart: slab.romStart, romEndExclusive: slab.romEndExclusive }]);
  mutation(row, 'primaryClass', 'code');
  mutation(row, 'inputKind', 'splat-data');
  mutation(slice, 'executable', true);
  mutation(row, 'romEndExclusive', row.romEndExclusive - 4);
  mutation(row, 'part', null);
  mutation(slab, 'kind', 'loader-dma');
  const oldBound = model.config.rom.bootInitializedDataRomEndExclusive;
  model.config.rom.bootInitializedDataRomEndExclusive += 4;
  slab.romEndExclusive += 4; slab.vramEndExclusive += 4;
  try { rejects(validate); } finally {
    model.config.rom.bootInitializedDataRomEndExclusive = oldBound;
    slab.romEndExclusive -= 4; slab.vramEndExclusive -= 4;
  }
  validate();
  for (const conflict of [
    { id: 'rom-conflict', romStart: slab.romStart, romEndExclusive: slab.romEndExclusive, vramStart: 0x81000000, vramEndExclusive: 0x81001000 },
    { id: 'ram-conflict', romStart: 0x400000, romEndExclusive: 0x401000, vramStart: slab.vramStart, vramEndExclusive: slab.vramEndExclusive },
  ]) {
    model.nonDescriptorLoadSlabs.push(conflict);
    try { rejects(validate); } finally { model.nonDescriptorLoadSlabs.pop(); }
    model.overlays.push({ rom_start: conflict.romStart, rom_end_exclusive: conflict.romEndExclusive,
      vram_start: conflict.vramStart, vram_end_exclusive: conflict.vramEndExclusive });
    try { rejects(validate); } finally { model.overlays.pop(); }
    validate();
  }
  rejects(() => boot.validateSlabs(model.config, model.nonDescriptorLoadSlabs, model.overlays, model.rows, { ...proof }));

  assert.strictEqual(row.part.hasOwnerLabel, false);
  assert.deepStrictEqual([slice.sectionName, slice.romStart, slice.romEndExclusive, slice.vramStart,
    slice.vramEndExclusive, slice.bytes, slice.executable, slice.placementKind, slice.loadSlabId],
  ['.ob64.r0789', 0x3DDC0, 0x3F1B0, 0x800AD9C0, 0x800AEDB0, 5104, false,
    'non-descriptor-load-slab', 'boot-initialized-data-0003ddc0']);
  assert.deepStrictEqual(model.counts, { assemblyOwners: 6184, dataOwners: 1058, splitOwners: 25,
    rspRows: 13, fixedOverlayNonExecutableRanges: 4, nonDescriptorLoadSlabs: 30 });
  // Eight registered ASM edge cuts add output slices, preserving all physical rows.
  assert.deepStrictEqual(model.rows.filter(row => row.retainedPadding).map(row => row.index), [58, 554, 555, 556, 581, 2287, 2327, 2351]);
  for (const index of [58, 554, 555, 556, 581, 2287, 2327, 2351]) {
    const owner = model.rows[index];
    assert.strictEqual(owner.slices.length, 2);
    assert.strictEqual(owner.slices.reduce((bytes, slice) => bytes + slice.bytes, 0), owner.bytes);
    assert.strictEqual(owner.slices.filter(slice => slice.retainedPaddingId).length, 1);
    assert(owner.slices.every(slice => slice.executable && slice.nonExecutableRangeId === null));
  }
  // L1 adds rows554/555/556 terminal12-byte cuts; row581 adds an eight-byte cut.
  // Physical owners are unchanged; each added cut contributes one slice and ordinal/phdr shifts.
  // Preserve every physical row, other slice (including743/790), reservation and29 slabs.
  const digest = value => sha256Buffer(Buffer.from(JSON.stringify(value)));
  // Exact reviewed profiles; no unknown-identity fallback.
  function checkProfile() {
    const identity = model.config.acceptedInputSha256['config/splat/us_rev0.semantic.json'];
    assert.ok([
      '6CBD65B27BD4B57E5C824D52D6F15FF98CF4616BC8BFB3F42E1BA87575A55FE1',
      'BF8C79BFDB2AB3DDBFA0B160AD14CCA9E17884813C1007D37E384DB40BBD8204',
      'B9850563A1974FF155A16F9DCBCFB4494B6572166F894A5B5057D204AF801F68',
    ].includes(identity), 'unknown boot-test semantic identity: ' + identity);
    const l4Successor = identity === 'B9850563A1974FF155A16F9DCBCFB4494B6572166F894A5B5057D204AF801F68';
    const row566Successor = model.config.acceptedInputSha256['config/splat/us_rev0.semantic.json']
      === 'BF8C79BFDB2AB3DDBFA0B160AD14CCA9E17884813C1007D37E384DB40BBD8204';
    assert.strictEqual(digest(model.slices.filter(s => s.rowIndex !== 789)), l4Successor
      ? 'C87A8AB0AEE83724B56E525178E0F5B27100F837877C7A9238E99BD8953816F9' : row566Successor
      ? 'F5E4B7AB19AA0FDB97C2E013DA8CE6E6E49C3132E9C625916EBCC61C47C68D37'
      : '37F0CD984BF9D797B3665C0598458212052CEE300B249EF4CBCA57EE0962D5E5');
    // Reverse only the eight reviewed derived cuts to compare every legacy slice.
    // This is a test projection, not a generated count or production-layout reset.
    const priorSlices = model.rows.flatMap(owner => owner.retainedPadding ? [{
      ...owner.slices[0], sliceIndex: 0, sliceCount: 1,
      sectionName: '.ob64.r' + String(owner.index).padStart(4, '0'),
      romEndExclusive: owner.romEndExclusive, bytes: owner.bytes,
      vramEndExclusive: owner.slices.at(-1).vramEndExclusive,
    }] : owner.slices).map(({ retainedPaddingId, ...slice }, ordinal) => ({
      ...slice, ordinal, phdrName: 'p' + String(ordinal).padStart(5, '0'),
    }));
    assert.strictEqual(digest(priorSlices.filter(slice => slice.rowIndex !== 789)),
      l4Successor ? '2EFCE6BCEC2234F5555C396AD6CE621A04659523E1B33F670BB3FB14A1D4DAA5' : row566Successor ? '6B459839D42684025BA9B9C919EFDD9480D56AD2DAAD2A49476E89E8023B9EFE'
        : '8897472E14020BB65D6CD7EBBD1716F503C2232D52F7E662D8E739605A4D873B');
    assert.strictEqual(digest(model.rows.map(({ slices, retainedPadding, ...metadata }) => metadata)), l4Successor
      ? '6915B2433009A1E6E0DDF57DB571BB9D37621A7A486985A7C9D5CC124076C385' : row566Successor
      ? 'A83A62A26E54CD29A50AAF0FE6286867CD34E5B62AE43D49CC0316C6499076C2'
      : '4F5EE5011B086824ED4256B53BCD214106AE1D38392A3029788C667383E2E315');
  }
  checkProfile();
  let profileNegativeControls = 0;
  function profileMutation(object, key, value) {
    checkProfile(); const previous = object[key]; object[key] = value;
    try { assert.throws(checkProfile); profileNegativeControls++; }
    finally { object[key] = previous; }
    checkProfile();
  }
  const identityKey = 'config/splat/us_rev0.semantic.json';
  for (const identity of ['0'.repeat(64),
    '6CBD65B27BD4B57E5C824D52D6F15FF98CF4616BC8BFB3F42E1BA87575A55FE1',
    'BF8C79BFDB2AB3DDBFA0B160AD14CCA9E17884813C1007D37E384DB40BBD8204',
    'B9850563A1974FF155A16F9DCBCFB4494B6572166F894A5B5057D204AF801F68']) {
    if (identity !== model.config.acceptedInputSha256[identityKey])
      profileMutation(model.config.acceptedInputSha256, identityKey, identity);
  }
  for (const index of [476, 496, 497]) {
    const owner = model.rows[index], part = owner.slices[0];
    const successor = owner.primaryClass === 'code';
    profileMutation(owner, 'primaryClass', successor ? 'data' : 'code');
    profileMutation(owner, 'name', owner.name.replace(successor ? '_code_' : '_data_', successor ? '_data_' : '_code_'));
    profileMutation(part, 'executable', !part.executable);
    profileMutation(part, 'ownerName', part.ownerName.replace(successor ? '_code_' : '_data_', successor ? '_data_' : '_code_'));
  }
  profileMutation(model.rows[476], 'processorClass', 'unexpected');
  profileMutation(model.rows[476].slices[0], 'vramStart', model.rows[476].slices[0].vramStart + 4);
  for (const index of [475, 477, 495, 498, 1000])
    profileMutation(model.rows[index], 'primaryClass', 'unexpected');
  assert.strictEqual(digest(model.overlays), 'C699993FF5DB3D8A075BC2EBC22DEBA4FDDD9B8E6F7E257960DFD37E92BAD016');
  assert.strictEqual(digest(model.nonDescriptorLoadSlabs.slice(0, 29)), 'DD0C8A896DCBB5DEFEBF6463700FB79715479E74F9F9A599F9FE82C2AAF52695');
  return { originalByteAndMappingNegativeControls: rejected, profileNegativeControls };
}

function runAuxiliaryTests(model = loadAcceptedModel()) {
  const { normalizeAuxiliarySectionContracts, resolveAuxiliarySectionContracts } = require('../tools/lib/active_targets');
  const row = model.rows[789], slice = row.slices[0];
  const textRow = model.rows.find(r => r.part && r.part.file.endsWith('/boot_resource_tag_record_decode.s'));
  assert.ok(textRow, 'original decoder owner is missing');
  const text = textRow.slices[0];
  const target = { symbol: textRow.part.name, bytes: text.bytes, sectionName: text.sectionName,
    vramStartNumber: text.vramStart, row: textRow };
  // No native compilation or target activation. Original emitted words provide
  // an authentic table and original fallback for the admission/relocation test.
  const rom = Buffer.alloc(row.romEndExclusive);
  const original = assembleWordAsmText(fs.readFileSync(path.join(ROOT, row.part.file), 'utf8')).bytes;
  assert.strictEqual(original.length, row.bytes);
  original.copy(rom, row.romStart);
  const hex = n => `0x${n.toString(16).toUpperCase().padStart(8, '0')}`;
  const retained = (kind, start, end) => ({ inputSection: `${slice.sectionName}.${kind}`,
    sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 1,
    romStart: hex(start), romEndExclusive: hex(end), vramStart: hex(start + 0x8006FC00),
    vramEndExclusive: hex(end + 0x8006FC00), bytes: end - start,
    expectedSha256: sha256Buffer(rom.subarray(start, end)), ownerOriginalAssembly: row.part.file,
    ownerOriginalAssemblySha256: row.part.sha256 });
  const start = 0x3E528, end = 0x3E67C, object = Buffer.alloc(end - start);
  const relocations = Array.from({ length: 85 }, (_, index) => {
    const addend = rom.readUInt32BE(start + index * 4) - text.vramStart;
    object.writeUInt32BE(addend, index * 4);
    return { offset: hex(index * 4), type: 'R_MIPS_32', symbol: '.text', addend: hex(addend), section: '.rel.rodata' };
  });
  const raw = { kind: 'switch-table', compilerSection: '.rodata', outputSection: slice.sectionName,
    sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 4,
    romStart: hex(start), romEndExclusive: hex(end), vramStart: hex(start + 0x8006FC00),
    vramEndExclusive: hex(end + 0x8006FC00), bytes: end - start, entries: 85,
    expectedObjectSha256: sha256Buffer(object), expectedLinkedSha256: sha256Buffer(rom.subarray(start, end)),
    preservedPrefix: retained('prefix', row.romStart, start), preservedTail: retained('tail', end, row.romEndExclusive),
    expectedRelocations: relocations };
  const contracts = normalizeAuxiliarySectionContracts([raw], target.symbol, 'boot table admission fixture');
  const resolve = () => resolveAuxiliarySectionContracts(model, rom, target, contracts);
  const result = resolve()[0];
  assert.strictEqual(result.ownerRowIndex, 789);
  assert.strictEqual(result.ownerPrefixBytes + result.bytes + result.ownerTailBytes, 5104);
  assert.notStrictEqual(result.ownerChunkIndex, textRow.part.chunkIndex);
  const opRow = model.rows.find(r => r.part && r.part.file.endsWith('/boot_resource_op_dispatch.s'));
  assert.ok(opRow, 'original nine-entry consumer is missing');
  const opText = opRow.slices[0], opStart = 0x3E6E8, opEnd = 0x3E70C;
  const opObject = Buffer.alloc(opEnd - opStart);
  const opRelocations = Array.from({ length: 9 }, (_, index) => {
    const addend = rom.readUInt32BE(opStart + index * 4) - opText.vramStart;
    opObject.writeUInt32BE(addend, index * 4);
    return { offset: hex(index * 4), type: 'R_MIPS_32', symbol: '.text', addend: hex(addend), section: '.rel.rodata' };
  });
  const opTarget = { symbol: opRow.part.name, bytes: opText.bytes, sectionName: opText.sectionName,
    vramStartNumber: opText.vramStart, row: opRow };
  const opContracts = normalizeAuxiliarySectionContracts([{ ...raw,
    romStart: hex(opStart), romEndExclusive: hex(opEnd), vramStart: hex(opStart + 0x8006FC00),
    vramEndExclusive: hex(opEnd + 0x8006FC00), bytes: 36, entries: 9,
    expectedObjectSha256: sha256Buffer(opObject), expectedLinkedSha256: sha256Buffer(rom.subarray(opStart, opEnd)),
    preservedPrefix: retained('prefix', row.romStart, opStart), preservedTail: retained('tail', opEnd, row.romEndExclusive),
    expectedRelocations: opRelocations,
  }], opTarget.symbol, 'nine-entry boot table fixture');
  const opResult = resolveAuxiliarySectionContracts(model, rom, opTarget, opContracts)[0];
  assert.strictEqual(opResult.ownerRowIndex, 789);
  assert.strictEqual(opResult.ownerTailBytes, 2724);
  assert.deepStrictEqual([start - row.romStart, end - start, opStart - end, opEnd - opStart,
    row.romEndExclusive - opEnd], [1896, 340, 108, 36, 2724]);
  let rejected = 0;
  function mutation(object, key, value) {
    resolve(); const previous = object[key]; object[key] = value;
    try { assert.throws(resolve); rejected++; } finally { object[key] = previous; }
    resolve();
  }
  const slab = model.nonDescriptorLoadSlabs.find(s => s.id === slice.loadSlabId);
  mutation(slab, 'kind', 'loader-dma');
  mutation(slice, 'placementKind', 'rom-only');
  mutation(text, 'placementKind', 'overlay');
  mutation(text, 'executable', false);
  mutation(text, 'vramStart', text.vramStart + 4);
  mutation(slice, 'loadSlabId', 'unresolved-slab');
  mutation(model, 'bootInitializedDataProof', { ...model.bootInitializedDataProof });
  mutation(contracts[0], 'expectedLinkedSha256', '0'.repeat(64));
  mutation(contracts[0].expectedRelocations[0], 'addend', '0xFFFFFFFF');
  mutation(row, 'primaryClass', 'code');
  mutation(slice, 'executable', true);
  const oldPlacement = text.placementKind, oldSlab = text.loadSlabId;
  text.placementKind = 'non-descriptor-load-slab'; text.loadSlabId = slice.loadSlabId;
  try { assert.throws(resolve); rejected++; } finally { text.placementKind = oldPlacement; text.loadSlabId = oldSlab; }
  resolve();
  assert.strictEqual(boot.isAuxiliaryPair(model, slice, text), false, 'reverse pairing admitted');
  const prior = model.nonDescriptorLoadSlabs.length;
  model.nonDescriptorLoadSlabs.push({ ...slab });
  try { assert.throws(resolve); rejected++; } finally { model.nonDescriptorLoadSlabs.length = prior; }
  resolve();
  return { auxiliaryNegativeControls: rejected };
}

function runSharedChunkTests() {
  const active = require('../tools/lib/active_targets');
  const context = active.loadActiveTargetModel(), model = context.model;
  const rom = fs.readFileSync(path.join(ROOT, 'build/baserom.us_rev0.z64'));
  const config = JSON.parse(fs.readFileSync(active.LINKAGE_CONFIG_PATH));
  const row = model.rows[789], slice = row.slices[0];
  const hex = n => '0x' + n.toString(16).toUpperCase().padStart(8, '0');
  const retained = (start, end, suffix) => ({ inputSection: '.ob64.r0789.' + suffix,
    sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 1,
    romStart: hex(start), romEndExclusive: hex(end), vramStart: hex(slice.vramStart + start - row.romStart),
    vramEndExclusive: hex(slice.vramStart + end - row.romStart), bytes: end - start,
    expectedSha256: sha256Buffer(rom.subarray(start, end)), ownerOriginalAssembly: row.part.file,
    ownerOriginalAssemblySha256: row.part.sha256 });
  const resolve = (target, contract) => active.resolveAuxiliarySectionContracts(model, rom, target,
    active.normalizeAuxiliarySectionContracts([contract], target.symbol, 'shared boot fixture'));
  // Recover the complete three-fragment baseline independently of scheduler activation.
  const decoders = ['boot_command_stream_dispatch', 'boot_resource_tag_record_decode', 'boot_resource_op_dispatch'].map(symbol => {
    const source = context.targets.find(t => t.symbol === symbol);
    const contract = structuredClone(config.targets.find(t => t.symbol === symbol).auxiliarySections[0]);
    if (symbol === 'boot_resource_op_dispatch') contract.preservedTail = retained(0x3E70C, row.romEndExclusive, 'tail');
    return { ...source, auxiliarySections: resolve(source, contract) };
  }).sort((a, b) => a.auxiliarySections[0].romStartNumber - b.auxiliarySections[0].romStartNumber);
  active.validateAuxiliaryOwnerGroups(decoders, model);
  const resolved = active.resolveAcceptedRows(model, 'func_000248ac'), owner = resolved.owners[0];
  const target = { ...owner, symbol: 'func_000248ac', row: resolved.rows[0], textOwners: resolved.owners };
  const raw = Buffer.alloc(32), rels = Array.from({ length: 7 }, (_, i) => {
    const addend = rom.readUInt32BE(0x3EDF0 + i * 4) - owner.vramStartNumber;
    raw.writeUInt32BE(addend, i * 4);
    return { offset: hex(i * 4), type: 'R_MIPS_32', symbol: '.text', addend: hex(addend), section: '.rel.rodata' };
  });
  const table = { kind: 'switch-table', compilerSection: '.rodata', outputSection: '.ob64.r0789',
    sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 8,
    romStart: hex(0x3EDF0), romEndExclusive: hex(0x3EE10), vramStart: hex(0x800AE9F0), vramEndExclusive: hex(0x800AEA10),
    bytes: 32, entries: 7, expectedObjectSha256: sha256Buffer(raw),
    expectedLinkedSha256: sha256Buffer(rom.subarray(0x3EDF0, 0x3EE10)), trailingPaddingBytes: 4,
    expectedTrailingPaddingSha256: sha256Buffer(Buffer.alloc(4)), expectedRelocations: rels,
    preservedInteriorBefore: { ...retained(0x3E70C, 0x3EDF0, 'interior_0003E70C'), expectedRelocations: [] },
    preservedTail: retained(0x3EE10, row.romEndExclusive, 'tail') };
  target.auxiliarySections = resolve(target, table);
  const previous = config.targets.find(t => t.symbol === 'boot_resource_op_dispatch').auxiliarySections[0];
  const contributors = decoders.map(t => ({ ...t, auxiliarySections: t.symbol === 'boot_resource_op_dispatch'
    ? resolve(t, { ...previous, preservedTail: null }) : structuredClone(t.auxiliarySections) })).concat(target);
  assert.deepStrictEqual(contributors.map(t => t.chunkIndex), [0, 0, 0, 2]);
  const check = () => active.validateAuxiliaryOwnerGroups(contributors, model);
  check(); let rejected = 0;
  function mutate(object, key, value) {
    check(); const before = object[key]; object[key] = value;
    try { assert.throws(check); rejected++; } finally { object[key] = before; }
    check();
  }
  mutate(model, 'bootInitializedDataProof', { ...model.bootInitializedDataProof });
  mutate(target.textOwners[0], 'chunkIndex', 0);
  mutate(target.auxiliarySections[0], 'ownerOriginalAssemblySha256', '0'.repeat(64));
  mutate(contributors[2].auxiliarySections[0], 'ownerTailBytes', 1);
  mutate(target.auxiliarySections[0].preservedInteriorBefore, 'romStartNumber', 0x3E708);
  const slab = model.nonDescriptorLoadSlabs.find(s => s.kind === 'boot-initialized-data');
  mutate(slab, 'kind', 'loader-dma');
  assert.throws(() => active.validateAuxiliaryOwnerGroups([...contributors].reverse(), model)); rejected++;
  check(); active.validateAuxiliaryOwnerGroups(decoders, model);
  return { sharedBootChunks: 'pass', sharedBootNegativeControls: rejected };
}

if (require.main === module) {
  const model = loadAcceptedModel();
  console.log(JSON.stringify({ ...runTests(model), ...runAuxiliaryTests(model), ...runSharedChunkTests() }));
}
module.exports = { runTests, runAuxiliaryTests, runSharedChunkTests };
