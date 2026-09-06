#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  normalizeAuxiliarySectionContracts,
  resolveAuxiliarySectionContracts,
  validateAuxiliaryOwnerGroups,
} = require('../tools/lib/active_targets');
const {
  ROOT,
  elfSectionBytes,
  loadAcceptedModel,
  parseElf32BigEndian,
  parseElfFile,
  sha256Buffer,
  sha256File,
} = require('../tools/lib/phase7_conventional');
const {
  adjustSectionAssembly,
  selectAuxiliarySourceObjectPrefixes,
  verifyAuxiliaryCompilerOccurrences,
  verifyAuxiliaryLinkedObjectSection,
  verifyAuxiliarySourceObjectSection,
} = require('../tools/lib/phase8_matching_c');
const {
  assertToolchainAvailable,
  loadToolchainConfig,
  runTool,
} = require('../tools/lib/real_mips_toolchain');

const AUXILIARY_OWNER = Object.freeze({
  rowIndex: 4156,
  primaryId: 'primary:28888adf81bdae1b9d68',
  romStart: 0x00229AB0,
  romEndExclusive: 0x00229DB0,
  vramStart: 0x801E67E0,
  vramEndExclusive: 0x801E6AE0,
  bytes: 0x300,
  sectionName: '.ob64.r4156',
  loadSlabId: 'resource-loader-00213b10',
  originalAssembly: 'asm/original/rev0/lib/table_00229ab0.s',
  originalAssemblySha256: '98B488929FB83B3D2E3791FEA9A08AD871FB14E5E94A84CA7F337D0BC3A49516',
});

const LOAD_SLAB = Object.freeze({
  id: 'resource-loader-00213b10',
  romStart: 0x00213B10,
  romEndExclusive: 0x0022A280,
  vramStart: 0x801D0840,
  vramEndExclusive: 0x801E6FB0,
});

const TEXT_OWNERS = Object.freeze({
  func_0021B438: Object.freeze({
    symbol: 'func_0021B438',
    rowIndex: 4026,
    romStart: 0x0021B438,
    romEndExclusive: 0x0021B770,
    vramStart: 0x801D8168,
    vramEndExclusive: 0x801D84A0,
    bytes: 0x338,
    sectionName: '.ob64.r4026',
    originalAssembly: 'asm/original/rev0/lib/func_0021B438.s',
    originalAssemblySha256: 'BAEA834349FFC67063547DAFE4677A65D716BF0DD9A6A856AD4B598855D41CC5',
  }),
  func_0021B894: Object.freeze({
    symbol: 'func_0021B894',
    rowIndex: 4028,
    romStart: 0x0021B894,
    romEndExclusive: 0x0021C074,
    vramStart: 0x801D85C4,
    vramEndExclusive: 0x801D8DA4,
    bytes: 0x7E0,
    sectionName: '.ob64.r4028',
    originalAssembly: 'asm/original/rev0/lib/func_0021B894.s',
    originalAssemblySha256: '6A2B7FD3358254EB5F8DF02906654E0162BF4ADBE3937B7DE18AF904E9211CA6',
  }),
});

const EXPECTED_REGIONS = Object.freeze([
  Object.freeze({
    name: 'retained-prefix',
    kind: 'retained-assembly',
    romStart: 0x00229AB0,
    romEndExclusive: 0x00229BA0,
    vramStart: 0x801E67E0,
    vramEndExclusive: 0x801E68D0,
    bytes: 0x0F0,
    sha256: '65382B342C3F4FBA838EF314B100863D5322680FE15C1D49A37834B5BA33B7B8',
  }),
  Object.freeze({
    name: 'func_0021B438-table-1',
    kind: 'switch-table',
    targetSymbol: 'func_0021B438',
    romStart: 0x00229BA0,
    romEndExclusive: 0x00229C90,
    vramStart: 0x801E68D0,
    vramEndExclusive: 0x801E69C0,
    bytes: 0x0F0,
    entries: 60,
    linkedSha256: 'F1F4C38B5A619498A3531C4C11739AC3ECB75547FBEC6F3249328AF4E21E8298',
    objectSha256: 'F1EB183C7F7F922A69E8DD30DA74B20ED2846BD0E678A95FA8CA27412DA5573F',
    uniqueTargets: [0x801D8200, 0x801D81F0, 0x801D8210, 0x801D8208, 0x801D81F8],
  }),
  Object.freeze({
    name: 'func_0021B438-table-2',
    kind: 'switch-table',
    targetSymbol: 'func_0021B438',
    romStart: 0x00229C90,
    romEndExclusive: 0x00229D80,
    vramStart: 0x801E69C0,
    vramEndExclusive: 0x801E6AB0,
    bytes: 0x0F0,
    entries: 60,
    linkedSha256: 'D29F9E09B12CBBF26B8A6361FCD1A4D5B79E2E21AD3FCC8A45146069FCEA49AB',
    objectSha256: 'AA42396A00FB19BA87DD6F2BC14D528B638AA0A9E64486FFFC1514B54F36CE82',
    uniqueTargets: [0x801D82A0, 0x801D8290, 0x801D82B0, 0x801D82A8, 0x801D8298],
  }),
  Object.freeze({
    name: 'func_0021B894-table',
    kind: 'switch-table',
    targetSymbol: 'func_0021B894',
    romStart: 0x00229D80,
    romEndExclusive: 0x00229DAC,
    vramStart: 0x801E6AB0,
    vramEndExclusive: 0x801E6ADC,
    bytes: 0x02C,
    entries: 11,
    linkedSha256: '42757E1FE9D22CBDEB1E110F3F89C7D0CD64BC060D568AF4435E8B976D580AC8',
    objectSha256: 'CDCCFAB2A276DADE9D5E3C9F9632B2678B96507014C84CF6050EA362339B2CFB',
    uniqueTargets: [
      0x801D87F0,
      0x801D8800,
      0x801D8810,
      0x801D8820,
      0x801D8830,
      0x801D8840,
      0x801D8850,
      0x801D8878,
      0x801D8860,
      0x801D8870,
    ],
  }),
  Object.freeze({
    name: 'retained-tail',
    kind: 'retained-assembly',
    romStart: 0x00229DAC,
    romEndExclusive: 0x00229DB0,
    vramStart: 0x801E6ADC,
    vramEndExclusive: 0x801E6AE0,
    bytes: 4,
    sha256: 'DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119',
  }),
]);

const COMBINED_B438_TABLES = Object.freeze({
  bytes: 0x1E0,
  entries: 120,
  linkedSha256: '228585EC309ED8B68010BAE3FED22AFF3C484BF9A57F5F6FA5019A24D4AA0D8D',
  objectSha256: 'FA3509166739A476B9FE7D429B60665FC8BC54AA81746DC954A28314727A97DA',
});

const B894_SOURCE_OBJECT_PREFIX = Object.freeze({
  sectionType: 'SHT_PROGBITS',
  sectionFlags: ['SHF_ALLOC'],
  alignment: 8,
  bytes: 48,
  expectedSha256: 'D39249F134005B2551738163AE0A2509071828218752808E52951F99D5809506',
  prefixOffset: '0x00000000',
  prefixBytes: 44,
  expectedPrefixSha256: EXPECTED_REGIONS[3].objectSha256,
  trailingPaddingOffset: '0x0000002C',
  trailingPaddingBytes: 4,
  expectedTrailingPaddingSha256: EXPECTED_REGIONS[4].sha256,
});

const TABLE_LOADS = Object.freeze([
  Object.freeze({
    name: 'func_0021B438-table-1',
    romStart: 0x0021B4AC,
    words: [0x3C01801E, 0x00220821, 0x8C2268D0],
    tableVramStart: 0x801E68D0,
  }),
  Object.freeze({
    name: 'func_0021B438-table-2',
    romStart: 0x0021B54C,
    words: [0x3C01801E, 0x00220821, 0x8C2269C0],
    tableVramStart: 0x801E69C0,
  }),
  Object.freeze({
    name: 'func_0021B894-table',
    romStart: 0x0021BAAC,
    words: [0x3C01801E, 0x00220821, 0x8C226AB0],
    tableVramStart: 0x801E6AB0,
  }),
]);

function fail(message) {
  throw new Error(`Wave 5 switch-table structural failure: ${message}`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function hex32(value) {
  return `0x${(value >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

function rowByIndex(model, index) {
  const matches = model.rows.filter((row) => row.index === index);
  if (matches.length !== 1) fail(`accepted row ${index} is not unique`);
  return matches[0];
}

function assertFields(actual, expected, fields, label) {
  for (const field of fields) {
    if (actual[field] !== expected[field]) fail(`${label} ${field} drift`);
  }
}

function verifyLoadSlab(model) {
  const slabs = model.nonDescriptorLoadSlabs.filter((slab) => slab.id === LOAD_SLAB.id);
  if (slabs.length !== 1) fail('resource load slab is not unique');
  assertFields(slabs[0], LOAD_SLAB, [
    'id',
    'romStart',
    'romEndExclusive',
    'vramStart',
    'vramEndExclusive',
  ], 'resource load slab');
  return slabs[0];
}

function mappedVram(slab, romAddress) {
  return slab.vramStart + (romAddress - slab.romStart);
}

function verifyAcceptedOwner(model) {
  const row = rowByIndex(model, AUXILIARY_OWNER.rowIndex);
  assertFields(row, AUXILIARY_OWNER, [
    'primaryId',
    'romStart',
    'romEndExclusive',
    'bytes',
  ], 'accepted auxiliary owner');
  if (row.inputKind !== 'tracked-assembly' || row.primaryClass !== 'data'
      || !row.part || row.part.file !== AUXILIARY_OWNER.originalAssembly
      || row.part.sha256 !== AUXILIARY_OWNER.originalAssemblySha256
      || row.part.romStartNumber !== AUXILIARY_OWNER.romStart
      || row.part.romEndNumber !== AUXILIARY_OWNER.romEndExclusive
      || row.slices.length !== 1) {
    fail('accepted auxiliary owner provenance drift');
  }
  const source = path.join(ROOT, ...AUXILIARY_OWNER.originalAssembly.split('/'));
  if (sha256File(source) !== AUXILIARY_OWNER.originalAssemblySha256) {
    fail('accepted auxiliary original assembly identity drift');
  }
  const slice = row.slices[0];
  assertFields(slice, AUXILIARY_OWNER, [
    'sectionName',
    'romStart',
    'romEndExclusive',
    'vramStart',
    'vramEndExclusive',
    'bytes',
    'loadSlabId',
  ], 'accepted auxiliary slice');
  if (slice.placementKind !== 'non-descriptor-load-slab' || slice.executable !== false
      || slice.overlayDescriptorId !== null || slice.overlaySection !== null) {
    fail('accepted auxiliary placement or executable classification drift');
  }
  return { row, slice };
}

function verifyTextOwner(model, expected) {
  const row = rowByIndex(model, expected.rowIndex);
  assertFields(row, expected, ['romStart', 'romEndExclusive', 'bytes'], `${expected.symbol} owner`);
  if (row.inputKind !== 'tracked-assembly' || row.primaryClass !== 'code'
      || !row.part || row.part.name !== expected.symbol
      || row.part.file !== expected.originalAssembly
      || row.part.sha256 !== expected.originalAssemblySha256
      || row.part.chunkIndex !== 33 || row.slices.length !== 1) {
    fail(`${expected.symbol} accepted text provenance drift`);
  }
  const slice = row.slices[0];
  assertFields(slice, expected, [
    'sectionName',
    'romStart',
    'romEndExclusive',
    'vramStart',
    'vramEndExclusive',
    'bytes',
  ], `${expected.symbol} text slice`);
  if (slice.placementKind !== 'non-descriptor-load-slab'
      || slice.loadSlabId !== LOAD_SLAB.id || slice.executable !== true) {
    fail(`${expected.symbol} accepted text placement drift`);
  }
  return { row, slice };
}

function verifyRegionLayout(layout, slab) {
  if (!Array.isArray(layout) || layout.length !== EXPECTED_REGIONS.length) {
    fail('prefix/table/tail region census drift');
  }
  let romCursor = AUXILIARY_OWNER.romStart;
  let vramCursor = AUXILIARY_OWNER.vramStart;
  for (const [index, region] of layout.entries()) {
    const expected = EXPECTED_REGIONS[index];
    assertFields(region, expected, [
      'name',
      'kind',
      'romStart',
      'romEndExclusive',
      'vramStart',
      'vramEndExclusive',
      'bytes',
    ], `region ${index}`);
    if (region.romStart !== romCursor || region.vramStart !== vramCursor
        || region.romEndExclusive - region.romStart !== region.bytes
        || region.vramEndExclusive - region.vramStart !== region.bytes
        || mappedVram(slab, region.romStart) !== region.vramStart
        || mappedVram(slab, region.romEndExclusive) !== region.vramEndExclusive) {
      fail(`region ${region.name} has a gap, overlap, or mapping drift`);
    }
    romCursor = region.romEndExclusive;
    vramCursor = region.vramEndExclusive;
  }
  if (romCursor !== AUXILIARY_OWNER.romEndExclusive
      || vramCursor !== AUXILIARY_OWNER.vramEndExclusive) {
    fail('prefix/table/tail regions do not exactly cover the accepted owner');
  }
  const earlyBootLinearTableAddress = 0x8006FC00 + EXPECTED_REGIONS[1].romStart;
  if (earlyBootLinearTableAddress === EXPECTED_REGIONS[1].vramStart) {
    fail('table placement accidentally uses the early-boot linear mapping');
  }
}

function verifyTableBytes(baserom, region, textOwner, relocationBase) {
  const bytes = Buffer.from(baserom.subarray(region.romStart, region.romEndExclusive));
  if (bytes.length !== region.bytes || bytes.length !== region.entries * 4
      || sha256Buffer(bytes) !== region.linkedSha256) {
    fail(`${region.name} linked byte identity drift`);
  }
  const objectBytes = Buffer.alloc(bytes.length);
  const targets = [];
  const addends = [];
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const target = bytes.readUInt32BE(offset);
    if (target < textOwner.vramStart || target >= textOwner.vramEndExclusive
        || (target - textOwner.vramStart) % 4 !== 0) {
      fail(`${region.name} relocation target escapes its accepted text owner`);
    }
    const addend = (target - relocationBase) >>> 0;
    objectBytes.writeUInt32BE(addend, offset);
    targets.push(target);
    addends.push(addend);
  }
  if (!sameJson([...new Set(targets)], region.uniqueTargets)
      || sha256Buffer(objectBytes) !== region.objectSha256) {
    fail(`${region.name} relocation target or addend drift`);
  }
  return {
    name: region.name,
    entries: region.entries,
    linkedSha256: sha256Buffer(bytes),
    objectSha256: sha256Buffer(objectBytes),
    uniqueTargets: [...new Set(targets)].map(hex32),
    uniqueAddends: [...new Set(addends)].map(hex32),
    linkedBytes: bytes,
    objectBytes,
  };
}

function verifyTableLoads(baserom) {
  for (const load of TABLE_LOADS) {
    const actual = load.words.map((_, index) => baserom.readUInt32BE(load.romStart + index * 4));
    if (!sameJson(actual, load.words)) fail(`${load.name} load instruction drift`);
    const high = (actual[0] & 0xFFFF) << 16;
    const lowUnsigned = actual[2] & 0xFFFF;
    const low = (lowUnsigned & 0x8000) === 0 ? lowUnsigned : lowUnsigned - 0x10000;
    if (((high + low) >>> 0) !== load.tableVramStart) {
      fail(`${load.name} runtime table address drift`);
    }
  }
}

function targetForContract(textOwner) {
  return {
    symbol: textOwner.row.part.name,
    targetIndex: -1,
    chunkIndex: textOwner.row.part.chunkIndex,
    overlayDescriptorId: textOwner.slice.overlayDescriptorId,
    bytes: textOwner.row.bytes,
    vramStartNumber: textOwner.slice.vramStart,
    sectionName: textOwner.slice.sectionName,
    row: textOwner.row,
    textOwners: [{
      ownerIndex: 0,
      logicalOffset: 0,
      logicalEnd: textOwner.slice.bytes,
      primaryId: textOwner.row.primaryId,
      rowIndex: textOwner.row.index,
      chunkIndex: textOwner.row.part.chunkIndex,
      row: textOwner.row,
      sectionName: textOwner.slice.sectionName,
      symbol: textOwner.row.part.name,
      originalAssembly: textOwner.row.part.file,
      originalAssemblySha256: textOwner.row.part.sha256,
      romStartNumber: textOwner.slice.romStart,
      romEndNumber: textOwner.slice.romEndExclusive,
      vramStartNumber: textOwner.slice.vramStart,
      vramEndNumber: textOwner.slice.vramEndExclusive,
      bytes: textOwner.slice.bytes,
    }],
    auxiliarySections: [],
  };
}

function relocationRecords(baserom, romStart, bytes, textVramStart) {
  return Array.from({ length: bytes / 4 }, (_, index) => ({
    offset: hex32(index * 4),
    type: 'R_MIPS_32',
    symbol: '.text',
    addend: hex32(baserom.readUInt32BE(romStart + index * 4) - textVramStart),
    section: '.rel.rodata',
  }));
}

function rawAuxiliaryContract(options) {
  return {
    kind: 'switch-table',
    compilerSection: '.rodata',
    outputSection: AUXILIARY_OWNER.sectionName,
    sectionType: 'SHT_PROGBITS',
    sectionFlags: ['SHF_ALLOC'],
    alignment: 8,
    romStart: hex32(options.romStart),
    romEndExclusive: hex32(options.romEndExclusive),
    vramStart: hex32(options.vramStart),
    vramEndExclusive: hex32(options.vramEndExclusive),
    bytes: options.bytes,
    entries: options.entries,
    expectedObjectSha256: options.objectSha256,
    expectedLinkedSha256: options.linkedSha256,
    ...(options.sourceObjectPrefix ? { sourceObjectPrefix: options.sourceObjectPrefix } : {}),
    ...(options.preservedPrefix ? { preservedPrefix: options.preservedPrefix } : {}),
    ...(options.compilerOccurrences ? { compilerOccurrences: options.compilerOccurrences } : {}),
    preservedTail: options.preservedTail || null,
    expectedRelocations: relocationRecords(
      options.baserom,
      options.romStart,
      options.bytes,
      options.textVramStart,
    ),
  };
}

function retainedContract(region, kind) {
  return {
    inputSection: `${AUXILIARY_OWNER.sectionName}.${kind}`,
    sectionType: 'SHT_PROGBITS',
    sectionFlags: ['SHF_ALLOC'],
    alignment: 1,
    romStart: hex32(region.romStart),
    romEndExclusive: hex32(region.romEndExclusive),
    vramStart: hex32(region.vramStart),
    vramEndExclusive: hex32(region.vramEndExclusive),
    bytes: region.bytes,
    expectedSha256: region.sha256,
    ownerOriginalAssembly: AUXILIARY_OWNER.originalAssembly,
    ownerOriginalAssemblySha256: AUXILIARY_OWNER.originalAssemblySha256,
  };
}

function b438CompilerOccurrences() {
  return EXPECTED_REGIONS.slice(1, 3).map((region, index) => ({
    label: index === 0 ? '.L23' : '.L50',
    offset: hex32(index * 0xF0),
    bytes: region.bytes,
    entries: region.entries,
    alignment: 8,
    alignmentDirectives: [3, 2],
    expectedObjectSha256: region.objectSha256,
    expectedLinkedSha256: region.linkedSha256,
  }));
}

function b894CompilerOccurrences() {
  const region = EXPECTED_REGIONS[3];
  return [{
    label: '.L42',
    offset: '0x00000000',
    bytes: region.bytes,
    entries: region.entries,
    alignment: 8,
    alignmentDirectives: [3, 2],
    expectedObjectSha256: region.objectSha256,
    expectedLinkedSha256: region.linkedSha256,
  }];
}

function syntheticRepeatedRodataAssembly() {
  const occurrence = (label, wordLabel) => [
    '.section\t.rodata',
    '\t.align\t3',
    '\t.align\t2',
    `${label}:`,
    ...Array.from({ length: 60 }, () => `\t.word\t${wordLabel}`),
  ];
  return Buffer.from([
    '\t.text',
    'fixture_start:',
    ...occurrence('.L23', '.L12'),
    '\t.text',
    '.L12:',
    ...occurrence('.L50', '.L39'),
    '\t.text',
    '.L39:',
    '',
  ].join('\n'), 'utf8');
}

function verifyB894AlignedSourceObjectPrefix(target, auxiliary, baserom) {
  const toolchain = assertToolchainAvailable(loadToolchainConfig());
  const scratch = path.join(ROOT, 'build', 'tests', 'wave5-b894-aligned-object-prefix');
  fs.mkdirSync(scratch, { recursive: true });
  const sourceFile = path.join(scratch, 'fixture.s');
  const sourceObjectFile = path.join(scratch, 'fixture-source-object.o');
  const selectedObjectFile = path.join(scratch, 'fixture-selected.o');
  const tailSourceFile = path.join(scratch, 'fixture-tail.s');
  const tailObjectFile = path.join(scratch, 'fixture-tail.o');
  const linkerFile = path.join(scratch, 'fixture.ld');
  const linkedFile = path.join(scratch, 'fixture.elf');
  const mapFile = path.join(scratch, 'fixture.map');
  const addends = auxiliary.expectedRelocations.map((relocation) => (
    Number.parseInt(relocation.addend.slice(2), 16)
  ));
  const uniqueAddends = [...new Set(addends)].sort((left, right) => left - right);
  const labelByAddend = new Map(uniqueAddends.map((addend, index) => [addend, `.L${100 + index}`]));
  const textLines = [];
  let cursor = 0;
  for (const addend of uniqueAddends) {
    if (addend < cursor || addend >= target.bytes || addend % 4 !== 0) {
      fail('B894 synthetic text-label placement drift');
    }
    if (addend > cursor) textLines.push(`\t.space\t${addend - cursor}`);
    textLines.push(`${labelByAddend.get(addend)}:`);
    cursor = addend;
  }
  if (cursor < target.bytes) textLines.push(`\t.space\t${target.bytes - cursor}`);
  const compilerAssembly = Buffer.from([
    '\t.set\tnoreorder',
    '\t.text',
    `\t.globl\t${target.symbol}`,
    `\t.type\t${target.symbol},@function`,
    `${target.symbol}:`,
    ...textLines,
    `\t.size\t${target.symbol},.-${target.symbol}`,
    '\t.section\t.rodata',
    '\t.align\t3',
    '\t.align\t2',
    '.L42:',
    ...addends.map((addend) => `\t.word\t${labelByAddend.get(addend)}`),
    '\t.text',
    '',
  ].join('\n'), 'utf8');
  const rejectedProducerGrammar = [];
  const rejectProducerGrammar = (name, mutate) => {
    const original = compilerAssembly.toString('utf8');
    const changed = mutate(original);
    if (changed === original) fail(`B894 ${name} producer mutation was a no-op`);
    rejectedProducerGrammar.push({
      name,
      rejection: expectError(name, /auxiliary occurrence grammar/, () => adjustSectionAssembly(
        Buffer.from(changed, 'utf8'),
        target.sectionName,
        { auxiliarySections: [auxiliary] },
      )),
    });
  };
  const firstWord = `\t.word\t${labelByAddend.get(addends[0])}`;
  const lastWord = `\t.word\t${labelByAddend.get(addends[addends.length - 1])}`;
  rejectProducerGrammar('explicit zero word after contracted table', (text) => text.replace(
    `${lastWord}\n\t.text`,
    `${lastWord}\n\t.word\t0\n\t.text`,
  ));
  rejectProducerGrammar('missing contracted table word', (text) => text.replace(`${firstWord}\n`, ''));
  rejectProducerGrammar('duplicate contracted table label', (text) => text.replace('.L42:', '.L42:\n.L42:'));
  rejectProducerGrammar('reordered table alignment directives', (text) => text.replace(
    '\t.align\t3\n\t.align\t2\n.L42:',
    '\t.align\t2\n\t.align\t3\n.L42:',
  ));
  rejectProducerGrammar('unexpected meaningful table directive', (text) => text.replace(
    '.L42:',
    '\t.space\t4\n.L42:',
  ));
  const adjustedAssembly = adjustSectionAssembly(compilerAssembly, target.sectionName, {
    auxiliarySections: [auxiliary],
  });
  fs.writeFileSync(sourceFile, adjustedAssembly);
  runTool(toolchain.assemblerAbs, [
    ...toolchain.compilerAssemblerFlags,
    '-o',
    sourceObjectFile,
    sourceFile,
  ], { cwd: scratch });

  const sourceObjectBytes = fs.readFileSync(sourceObjectFile);
  const sourceElf = parseElf32BigEndian(sourceObjectBytes);
  const sourceEvidence = verifyAuxiliarySourceObjectSection(
    sourceElf,
    target,
    auxiliary,
    'Wave 5 concrete B894 44-of-48 source object',
  );
  const selected = selectAuxiliarySourceObjectPrefixes(sourceObjectBytes, target);
  if (selected.selections.length !== 1
      || selected.selections[0].outputSection !== auxiliary.outputSection
      || selected.selections[0].linkedBytes !== auxiliary.bytes
      || selected.selections[0].linkedSha256 !== auxiliary.expectedObjectSha256) {
    fail('B894 selected source-object prefix evidence drift');
  }
  fs.writeFileSync(selectedObjectFile, selected.buffer);
  const selectedElf = parseElf32BigEndian(selected.buffer);
  const linkedObjectEvidence = verifyAuxiliaryLinkedObjectSection(
    selectedElf,
    target,
    auxiliary,
    'Wave 5 concrete B894 selected link object',
  );
  if (!linkedObjectEvidence.bytes.equals(sourceEvidence.selectedBytes)
      || !sameJson(linkedObjectEvidence.relocations, sourceEvidence.relocations)) {
    fail('B894 source and selected object evidence diverged');
  }
  const compilerOccurrences = verifyAuxiliaryCompilerOccurrences(
    sourceEvidence.selectedBytes,
    sourceEvidence.relocations,
    auxiliary,
    'Wave 5 concrete B894 compiler occurrence',
    Buffer.from(baserom.subarray(auxiliary.romStartNumber, auxiliary.romEndNumber)),
  );
  if (!compilerOccurrences || compilerOccurrences.length !== 1
      || compilerOccurrences[0].label !== '.L42'
      || compilerOccurrences[0].bytes !== 44
      || compilerOccurrences[0].loadRelevantRelocationsNormalized.length !== 11
      || compilerOccurrences[0].rawLinkedBytesExact !== true) {
    fail('B894 single compiler occurrence evidence drift');
  }

  fs.writeFileSync(tailSourceFile, [
    `.section ${auxiliary.ownerTailSection},"a",@progbits`,
    '\t.byte\t0,0,0,0',
    '',
  ].join('\n'));
  runTool(toolchain.assemblerAbs, [
    ...toolchain.compilerAssemblerFlags,
    '-o',
    tailObjectFile,
    tailSourceFile,
  ], { cwd: scratch });
  fs.writeFileSync(linkerFile, [
    'OUTPUT_FORMAT("elf32-bigmips")',
    'OUTPUT_ARCH(mips)',
    'SECTIONS',
    '{',
    `  ${target.sectionName} ${hex32(target.vramStartNumber)} : AT(${hex32(target.row.romStart)})`,
    '  {',
    `    ${path.basename(selectedObjectFile)}(${target.sectionName})`,
    '  }',
    `  ${auxiliary.outputSection} ${hex32(auxiliary.vramStartNumber)} : AT(${hex32(auxiliary.romStartNumber)})`,
    '  {',
    `    ${path.basename(selectedObjectFile)}(${auxiliary.outputSection})`,
    `    ${path.basename(tailObjectFile)}(${auxiliary.ownerTailSection})`,
    '  }',
    '}',
    '',
  ].join('\n'));
  runTool(toolchain.toolsAbs.linker, [
    '-T',
    path.basename(linkerFile),
    '-Map',
    path.basename(mapFile),
    '-o',
    path.basename(linkedFile),
    path.basename(selectedObjectFile),
    path.basename(tailObjectFile),
  ], { cwd: scratch });
  const linkedElf = parseElfFile(linkedFile);
  const linkedSections = linkedElf.sections.filter((section) => section.name === auxiliary.outputSection);
  const expectedLinkedBytes = Buffer.from(baserom.subarray(
    auxiliary.romStartNumber,
    auxiliary.ownerTailRomEndNumber,
  ));
  if (linkedSections.length !== 1 || linkedSections[0].size !== 48
      || !Buffer.from(elfSectionBytes(linkedElf, linkedSections[0])).equals(expectedLinkedBytes)) {
    fail('B894 linked compiler-prefix plus retained-tail bytes drift');
  }
  const mapText = fs.readFileSync(mapFile, 'utf8');
  const selectedMapLines = mapText.split(/\r?\n/).filter((line) => (
    line.includes(path.basename(selectedObjectFile))
      && line.includes(auxiliary.outputSection)
      && !line.trimStart().startsWith('from ')
  ));
  const tailMapLines = mapText.split(/\r?\n/).filter((line) => (
    line.includes(path.basename(tailObjectFile))
      && line.includes(auxiliary.ownerTailSection)
      && !line.trimStart().startsWith('from ')
  ));
  if (selectedMapLines.length !== 1 || tailMapLines.length !== 1
      || !/\s2c\s+2c\s/i.test(selectedMapLines[0])
      || !/\s4\s+4\s/i.test(tailMapLines[0])) {
    fail('B894 linked prefix/tail map ownership drift');
  }

  const objectMutations = [];
  const nonzeroTrailing = Buffer.from(sourceObjectBytes);
  nonzeroTrailing[sourceEvidence.section.offset
    + Number.parseInt(B894_SOURCE_OBJECT_PREFIX.trailingPaddingOffset.slice(2), 16)] ^= 1;
  objectMutations.push(expectError(
    'nonzero source-object trailing byte',
    /source-object prefix bytes drift/,
    () => verifyAuxiliarySourceObjectSection(
      parseElf32BigEndian(nonzeroTrailing),
      target,
      auxiliary,
      'mutated B894 nonzero trailing byte',
    ),
  ));
  const nonexactPrefix = Buffer.from(sourceObjectBytes);
  nonexactPrefix[sourceEvidence.section.offset] ^= 1;
  objectMutations.push(expectError(
    'nonexact selected source-object prefix',
    /source-object relocation contract drift|source-object prefix bytes drift/,
    () => verifyAuxiliarySourceObjectSection(
      parseElf32BigEndian(nonexactPrefix),
      target,
      auxiliary,
      'mutated B894 nonexact prefix',
    ),
  ));
  const relocatedTrailing = Buffer.from(sourceObjectBytes);
  const relocationOffset = sourceEvidence.relocationSection.offset
    + (auxiliary.expectedRelocations.length - 1) * sourceEvidence.relocationSection.entrySize;
  relocatedTrailing.writeUInt32BE(auxiliary.bytes, relocationOffset);
  objectMutations.push(expectError(
    'relocation outside selected source-object prefix',
    /relocation-section order drift|local-label relocation drift/,
    () => verifyAuxiliarySourceObjectSection(
      parseElf32BigEndian(relocatedTrailing),
      target,
      auxiliary,
      'mutated B894 relocated trailing byte',
    ),
  ));
  const reorderedRelocations = Buffer.from(sourceObjectBytes);
  const firstRelocation = Buffer.from(reorderedRelocations.subarray(
    sourceEvidence.relocationSection.offset,
    sourceEvidence.relocationSection.offset + sourceEvidence.relocationSection.entrySize,
  ));
  const secondRelocation = Buffer.from(reorderedRelocations.subarray(
    sourceEvidence.relocationSection.offset + sourceEvidence.relocationSection.entrySize,
    sourceEvidence.relocationSection.offset + 2 * sourceEvidence.relocationSection.entrySize,
  ));
  secondRelocation.copy(reorderedRelocations, sourceEvidence.relocationSection.offset);
  firstRelocation.copy(
    reorderedRelocations,
    sourceEvidence.relocationSection.offset + sourceEvidence.relocationSection.entrySize,
  );
  objectMutations.push(expectError(
    'reordered source-object relocations',
    /relocation-section order drift/,
    () => verifyAuxiliarySourceObjectSection(
      parseElf32BigEndian(reorderedRelocations),
      target,
      auxiliary,
      'mutated B894 reordered relocations',
    ),
  ));
  const missingRelocation = Buffer.from(sourceObjectBytes);
  missingRelocation.writeUInt32BE(
    sourceEvidence.relocationSection.size - sourceEvidence.relocationSection.entrySize,
    sourceEvidence.relocationSection.headerOffset + 20,
  );
  objectMutations.push(expectError(
    'missing source-object relocation',
    /relocation-section placement drift/,
    () => verifyAuxiliarySourceObjectSection(
      parseElf32BigEndian(missingRelocation),
      target,
      auxiliary,
      'mutated B894 missing relocation',
    ),
  ));
  objectMutations.push(expectError(
    'duplicate source-object section',
    /section shape drift/,
    () => verifyAuxiliarySourceObjectSection(
      { ...sourceElf, sections: [...sourceElf.sections, { ...sourceEvidence.section }] },
      target,
      auxiliary,
      'mutated B894 duplicate section',
    ),
  ));
  objectMutations.push(expectError(
    'duplicate source-object relocation section',
    /relocation-section placement drift/,
    () => verifyAuxiliarySourceObjectSection(
      {
        ...sourceElf,
        sections: [...sourceElf.sections, { ...sourceEvidence.relocationSection }],
      },
      target,
      auxiliary,
      'mutated B894 duplicate relocation section',
    ),
  ));
  objectMutations.push(expectError(
    'unclaimed source-object relocation section',
    /relocation-section placement drift/,
    () => verifyAuxiliarySourceObjectSection(
      {
        ...sourceElf,
        sections: sourceElf.sections.map((section) => (
          section.index === sourceEvidence.relocationSection.index
            ? { ...section, name: '.rel.ob64.unclaimed' }
            : section
        )),
      },
      target,
      auxiliary,
      'mutated B894 unclaimed relocation section',
    ),
  ));
  const overlapCandidate = sourceElf.sections.find((section) => (
    section.index !== sourceEvidence.section.index
      && section.type !== 8
      && section.size > 0
      && section.name === '.reginfo'
  ));
  if (!overlapCandidate) fail('B894 source-object overlap mutation canary is missing');
  const overlappingSection = Buffer.from(sourceObjectBytes);
  overlappingSection.writeUInt32BE(sourceEvidence.section.offset, overlapCandidate.headerOffset + 16);
  objectMutations.push(expectError(
    'overlapping source-object section data',
    /overlaps another section/,
    () => selectAuxiliarySourceObjectPrefixes(overlappingSection, target),
  ));
  objectMutations.push(expectError(
    'unsliced link object',
    /linked auxiliary object section shape drift/,
    () => verifyAuxiliaryLinkedObjectSection(
      sourceElf,
      target,
      auxiliary,
      'mutated B894 unsliced link object',
    ),
  ));

  return {
    sourceObject: {
      bytes: fs.statSync(sourceObjectFile).size,
      sha256: sha256File(sourceObjectFile),
      sectionBytes: sourceEvidence.sourceBytes.length,
      sectionSha256: sha256Buffer(sourceEvidence.sourceBytes),
      relocations: sourceEvidence.relocations.length,
    },
    selectedObject: {
      bytes: fs.statSync(selectedObjectFile).size,
      sha256: sha256File(selectedObjectFile),
      sectionBytes: linkedObjectEvidence.bytes.length,
      sectionSha256: sha256Buffer(linkedObjectEvidence.bytes),
      relocations: linkedObjectEvidence.relocations.length,
    },
    retainedTail: {
      bytes: auxiliary.ownerTailBytes,
      sha256: auxiliary.ownerTailSha256,
      linkedOwner: path.basename(tailObjectFile),
    },
    linked: {
      bytes: expectedLinkedBytes.length,
      sha256: sha256Buffer(expectedLinkedBytes),
    },
    compilerOccurrence: {
      label: compilerOccurrences[0].label,
      bytes: compilerOccurrences[0].bytes,
      relocations: compilerOccurrences[0].loadRelevantRelocationsNormalized.length,
      rawLinkedBytesExact: compilerOccurrences[0].rawLinkedBytesExact,
    },
    rejectedProducerGrammar,
    objectMutations,
  };
}

function expectError(label, pattern, callback) {
  try {
    callback();
  } catch (error) {
    if (!pattern.test(error.message)) {
      fail(`${label} rejected for the wrong reason: ${error.message}`);
    }
    return error.message;
  }
  fail(`${label} unexpectedly passed`);
}

function verifyImplementedSchemaCapability(model, baserom, textOwners) {
  const table1 = EXPECTED_REGIONS[1];
  const table2 = EXPECTED_REGIONS[2];
  const b894Table = EXPECTED_REGIONS[3];
  const prefix = EXPECTED_REGIONS[0];
  const tail = EXPECTED_REGIONS[4];
  const combinedB438Raw = rawAuxiliaryContract({
    baserom,
    romStart: table1.romStart,
    romEndExclusive: table2.romEndExclusive,
    vramStart: table1.vramStart,
    vramEndExclusive: table2.vramEndExclusive,
    bytes: COMBINED_B438_TABLES.bytes,
    entries: COMBINED_B438_TABLES.entries,
    objectSha256: COMBINED_B438_TABLES.objectSha256,
    linkedSha256: COMBINED_B438_TABLES.linkedSha256,
    textVramStart: TEXT_OWNERS.func_0021B438.vramStart,
    preservedPrefix: retainedContract(prefix, 'prefix'),
    compilerOccurrences: b438CompilerOccurrences(),
  });
  const b894Raw = rawAuxiliaryContract({
    ...b894Table,
    baserom,
    textVramStart: TEXT_OWNERS.func_0021B894.vramStart,
    sourceObjectPrefix: B894_SOURCE_OBJECT_PREFIX,
    compilerOccurrences: b894CompilerOccurrences(),
    preservedTail: retainedContract(tail, 'tail'),
  });
  const b438Target = targetForContract(textOwners.func_0021B438);
  const b894Target = targetForContract(textOwners.func_0021B894);
  b438Target.auxiliarySections = resolveAuxiliarySectionContracts(
    model,
    baserom,
    b438Target,
    normalizeAuxiliarySectionContracts(
      [combinedB438Raw],
      b438Target.symbol,
      'Wave 5 combined-table schema probe',
    ),
  );
  b894Target.auxiliarySections = resolveAuxiliarySectionContracts(
    model,
    baserom,
    b894Target,
    normalizeAuxiliarySectionContracts(
      [b894Raw],
      b894Target.symbol,
      'Wave 5 final-table schema probe',
    ),
  );
  validateAuxiliaryOwnerGroups([b438Target, b894Target]);
  const b438 = b438Target.auxiliarySections[0];
  const b894 = b894Target.auxiliarySections[0];
  if (b438.ownerFragmentIndex !== 0 || b438.ownerFragmentCount !== 2
      || b438.ownerPrefixSection !== `${AUXILIARY_OWNER.sectionName}.prefix`
      || b438.ownerPrefixBytes !== prefix.bytes || b438.ownerPrefixSha256 !== prefix.sha256
      || b438.ownerPrefixRomStartNumber !== prefix.romStart
      || b438.ownerPrefixRomEndNumber !== prefix.romEndExclusive
      || b438.compilerOccurrences.length !== 2
      || b894.ownerFragmentIndex !== 1 || b894.ownerFragmentCount !== 2
      || b894.ownerTailBytes !== tail.bytes || b894.ownerTailSha256 !== tail.sha256
      || b894.compilerOccurrences.length !== 1
      || b894.compilerOccurrences[0].label !== '.L42'
      || b894.compilerOccurrences[0].entries !== 11
      || !b894.sourceObjectPrefix
      || b894.sourceObjectPrefix.bytes !== 48
      || b894.sourceObjectPrefix.prefixOffsetNumber !== 0
      || b894.sourceObjectPrefix.prefixBytes !== 44
      || b894.sourceObjectPrefix.trailingPaddingOffsetNumber !== 44
      || b894.sourceObjectPrefix.trailingPaddingBytes !== 4) {
    fail('retained-prefix/repeated-rodata resolved contract drift');
  }

  const sourceAssembly = syntheticRepeatedRodataAssembly();
  const adjustedAssembly = adjustSectionAssembly(sourceAssembly, TEXT_OWNERS.func_0021B438.sectionName, {
    auxiliarySections: [b438],
  });
  const adjustedText = adjustedAssembly.toString('utf8');
  const outputDirectives = adjustedText.match(/^\.section \.ob64\.r4156,"a",@progbits$/gm) || [];
  const textDirectives = adjustedText.match(/^\.section \.ob64\.r4026,"ax",@progbits$/gm) || [];
  if (outputDirectives.length !== 2 || textDirectives.length !== 3
      || adjustedText.includes('.section\t.rodata')) {
    fail('repeated compiler .rodata rewrite drift');
  }
  const normalizedObjectBytes = Buffer.alloc(b438.bytes);
  for (const relocation of b438.expectedRelocations) {
    normalizedObjectBytes.writeUInt32BE(
      Number.parseInt(relocation.addend.slice(2), 16),
      Number.parseInt(relocation.offset.slice(2), 16),
    );
  }
  const occurrenceEvidence = verifyAuxiliaryCompilerOccurrences(
    normalizedObjectBytes,
    b438.expectedRelocations,
    b438,
    'Wave 5 focused combined B438 object',
    Buffer.from(baserom.subarray(b438.romStartNumber, b438.romEndNumber)),
  );
  if (!occurrenceEvidence || occurrenceEvidence.length !== 2
      || occurrenceEvidence[0].label !== '.L23' || occurrenceEvidence[1].label !== '.L50'
      || occurrenceEvidence.some((occurrence) => occurrence.rawLinkedBytesExact !== true)
      || occurrenceEvidence.reduce((sum, occurrence) => sum + occurrence.bytes, 0) !== b438.bytes
      || occurrenceEvidence.reduce((sum, occurrence) => (
        sum + occurrence.loadRelevantRelocationsNormalized.length
      ), 0) !== b438.entries) {
    fail('repeated compiler occurrence object evidence drift');
  }

  const rejectedContracts = [];
  const rejectContract = (name, mutate, pattern = /compiler occurrence|preserved prefix|retained prefix/) => {
    const raw = clone(combinedB438Raw);
    mutate(raw);
    rejectedContracts.push({
      name,
      rejection: expectError(name, pattern, () => {
        const normalized = normalizeAuxiliarySectionContracts(
          [raw],
          b438Target.symbol,
          `Wave 5 ${name}`,
        );
        const resolved = resolveAuxiliarySectionContracts(model, baserom, b438Target, normalized);
        validateAuxiliaryOwnerGroups([{ ...b438Target, auxiliarySections: resolved }, b894Target]);
      }),
    });
  };
  rejectContract('missing occurrence', (raw) => raw.compilerOccurrences.pop());
  rejectContract('duplicated occurrence label', (raw) => {
    raw.compilerOccurrences[1].label = raw.compilerOccurrences[0].label;
  });
  rejectContract('reordered occurrences', (raw) => raw.compilerOccurrences.reverse());
  rejectContract('occurrence gap', (raw) => { raw.compilerOccurrences[1].offset = '0x000000F4'; });
  rejectContract('occurrence overlap', (raw) => { raw.compilerOccurrences[1].offset = '0x000000EC'; });
  rejectContract('occurrence alignment', (raw) => { raw.compilerOccurrences[1].alignmentDirectives = [2]; });
  rejectContract('occurrence object identity', (raw) => {
    raw.compilerOccurrences[0].expectedObjectSha256 = '0'.repeat(64);
  }, /compiler occurrence bytes drift/);
  rejectContract('missing retained prefix', (raw) => { delete raw.preservedPrefix; });
  rejectContract('gapped retained prefix', (raw) => {
    raw.preservedPrefix.romEndExclusive = hex32(prefix.romEndExclusive - 4);
    raw.preservedPrefix.vramEndExclusive = hex32(prefix.vramEndExclusive - 4);
    raw.preservedPrefix.bytes -= 4;
  }, /placement or alignment|retained prefix/);

  const rejectedSourceObjectPrefixes = [];
  const rejectSourceObjectPrefix = (name, mutate, pattern = /source-object prefix/) => {
    const raw = clone(b894Raw);
    mutate(raw);
    rejectedSourceObjectPrefixes.push({
      name,
      rejection: expectError(name, pattern, () => {
        const normalized = normalizeAuxiliarySectionContracts(
          [raw],
          b894Target.symbol,
          `Wave 5 ${name}`,
        );
        resolveAuxiliarySectionContracts(model, baserom, b894Target, normalized);
      }),
    });
  };
  rejectSourceObjectPrefix('missing source-object compiler grammar', (raw) => {
    delete raw.compilerOccurrences;
  }, /source-object prefix compiler grammar/);
  rejectSourceObjectPrefix('missing source-object prefix field', (raw) => {
    delete raw.sourceObjectPrefix.expectedSha256;
  });
  rejectSourceObjectPrefix('nonzero source-object prefix offset', (raw) => {
    raw.sourceObjectPrefix.prefixOffset = '0x00000004';
  });
  rejectSourceObjectPrefix('short source-object prefix', (raw) => {
    raw.sourceObjectPrefix.prefixBytes = 40;
  });
  rejectSourceObjectPrefix('overlapping source-object trailing padding', (raw) => {
    raw.sourceObjectPrefix.trailingPaddingOffset = '0x00000028';
  });
  rejectSourceObjectPrefix('out-of-bounds source-object trailing padding', (raw) => {
    raw.sourceObjectPrefix.trailingPaddingBytes = 8;
    raw.sourceObjectPrefix.bytes = 52;
  });
  rejectSourceObjectPrefix('source-object prefix identity', (raw) => {
    raw.sourceObjectPrefix.expectedPrefixSha256 = '0'.repeat(64);
  });
  rejectSourceObjectPrefix('source-object trailing nonpadding identity', (raw) => {
    raw.sourceObjectPrefix.expectedTrailingPaddingSha256 = '0'.repeat(64);
  });
  rejectSourceObjectPrefix('source-object complete identity', (raw) => {
    raw.sourceObjectPrefix.expectedSha256 = '0'.repeat(64);
  }, /switch-table bytes or relocation semantics drift/);
  rejectSourceObjectPrefix('source-object tail ownership identity', (raw) => {
    raw.preservedTail.expectedSha256 = '0'.repeat(64);
  });

  const assemblyMutations = [];
  const rejectAssembly = (name, mutate) => {
    const changed = mutate(sourceAssembly.toString('utf8'));
    assemblyMutations.push({
      name,
      rejection: expectError(name, /auxiliary occurrence grammar|auxiliary-section grammar/, () => (
        adjustSectionAssembly(Buffer.from(changed, 'utf8'), TEXT_OWNERS.func_0021B438.sectionName, {
          auxiliarySections: [b438],
        })
      )),
    });
  };
  rejectAssembly('missing compiler section directive', (text) => text.replace('.section\t.rodata', ''));
  rejectAssembly('duplicated compiler section directive', (text) => text.replace(
    '.section\t.rodata',
    '.section\t.rodata\n.section\t.rodata',
  ));
  rejectAssembly('reordered compiler labels', (text) => text.replace('.L23:', '.LTEMP:')
    .replace('.L50:', '.L23:').replace('.LTEMP:', '.L50:'));
  rejectAssembly('wrong occurrence word count', (text) => text.replace('\t.word\t.L12\n', ''));
  rejectAssembly('unclaimed occurrence padding', (text) => text.replace('.L50:', '.space 4\n.L50:'));

  const driftedObject = Buffer.from(normalizedObjectBytes);
  driftedObject[0] ^= 1;
  const objectMutation = expectError(
    'occurrence object byte mutation',
    /compiler occurrence .* bytes or relocations drift/,
    () => verifyAuxiliaryCompilerOccurrences(
      driftedObject,
      b438.expectedRelocations,
      b438,
      'Wave 5 focused mutated object',
    ),
  );
  const alignedB894ObjectPrefix = verifyB894AlignedSourceObjectPrefix(
    b894Target,
    b894,
    baserom,
  );
  return {
    twoCompilerOccurrences: {
      status: 'supported-within-one-logical-output-section',
      labels: occurrenceEvidence.map((occurrence) => occurrence.label),
      bytes: occurrenceEvidence.map((occurrence) => occurrence.bytes),
      relocations: occurrenceEvidence.map((occurrence) => occurrence.loadRelevantRelocationsNormalized.length),
    },
    adjacentTargetFragments: { status: 'supported-gaplessly' },
    retainedPrefixAndTail: {
      status: 'supported-gaplessly',
      prefixBytes: b438.ownerPrefixBytes,
      tailBytes: b894.ownerTailBytes,
    },
    combinedB438Contract: {
      status: 'resolver-and-compiler-shape-authenticated',
      bytes: COMBINED_B438_TABLES.bytes,
      entries: COMBINED_B438_TABLES.entries,
      linkedSha256: COMBINED_B438_TABLES.linkedSha256,
      objectSha256: COMBINED_B438_TABLES.objectSha256,
    },
    failClosedContracts: rejectedContracts,
    failClosedSourceObjectPrefixes: rejectedSourceObjectPrefixes,
    failClosedAssembly: assemblyMutations,
    failClosedObject: objectMutation,
    alignedB894ObjectPrefix,
  };
}

const verifyCurrentSchemaGaps = verifyImplementedSchemaCapability;

function verifyWave5SwitchTableStructure(options = {}) {
  const model = options.model || loadAcceptedModel();
  const baserom = options.baserom || fs.readFileSync(path.join(ROOT, 'build', 'baserom.us_rev0.z64'));
  const layout = options.layout || clone(EXPECTED_REGIONS);
  const relocationBases = options.relocationBases || {};
  const slab = verifyLoadSlab(model);
  const acceptedOwner = verifyAcceptedOwner(model);
  const textOwners = {
    func_0021B438: verifyTextOwner(model, TEXT_OWNERS.func_0021B438),
    func_0021B894: verifyTextOwner(model, TEXT_OWNERS.func_0021B894),
  };
  if (mappedVram(slab, acceptedOwner.row.romStart) !== acceptedOwner.slice.vramStart) {
    fail('accepted auxiliary owner does not use the resource load-slab mapping');
  }
  verifyRegionLayout(layout, slab);
  verifyTableLoads(baserom);

  const prefix = Buffer.from(baserom.subarray(layout[0].romStart, layout[0].romEndExclusive));
  const tail = Buffer.from(baserom.subarray(layout[4].romStart, layout[4].romEndExclusive));
  if (prefix.length !== layout[0].bytes || sha256Buffer(prefix) !== layout[0].sha256) {
    fail('retained assembly prefix byte identity drift');
  }
  if (tail.length !== layout[4].bytes || sha256Buffer(tail) !== layout[4].sha256
      || tail.some((byte) => byte !== 0)) {
    fail('retained assembly tail byte identity drift');
  }

  const tables = layout.filter((region) => region.kind === 'switch-table').map((region) => {
    const text = TEXT_OWNERS[region.targetSymbol];
    const base = Object.prototype.hasOwnProperty.call(relocationBases, region.targetSymbol)
      ? relocationBases[region.targetSymbol]
      : text.vramStart;
    return verifyTableBytes(baserom, region, text, base);
  });
  const combinedLinked = Buffer.concat(tables.slice(0, 2).map((table) => table.linkedBytes));
  const combinedObject = Buffer.concat(tables.slice(0, 2).map((table) => table.objectBytes));
  if (combinedLinked.length !== COMBINED_B438_TABLES.bytes
      || sha256Buffer(combinedLinked) !== COMBINED_B438_TABLES.linkedSha256
      || sha256Buffer(combinedObject) !== COMBINED_B438_TABLES.objectSha256) {
    fail('combined func_0021B438 compiler-table identity drift');
  }

  return {
    status: 'pass',
    acceptedOwner: {
      rowIndex: acceptedOwner.row.index,
      romStart: hex32(acceptedOwner.row.romStart),
      romEndExclusive: hex32(acceptedOwner.row.romEndExclusive),
      vramStart: hex32(acceptedOwner.slice.vramStart),
      vramEndExclusive: hex32(acceptedOwner.slice.vramEndExclusive),
      originalAssembly: acceptedOwner.row.part.file,
      originalAssemblySha256: acceptedOwner.row.part.sha256,
      executable: acceptedOwner.slice.executable,
    },
    retainedPrefix: {
      bytes: prefix.length,
      sha256: sha256Buffer(prefix),
    },
    tables: tables.map(({ linkedBytes, objectBytes, ...table }) => table),
    retainedTail: {
      bytes: tail.length,
      sha256: sha256Buffer(tail),
    },
    combinedB438Tables: COMBINED_B438_TABLES,
    textOwners,
  };
}

function mutationRejection(name, callback) {
  try {
    callback();
  } catch (error) {
    return { name, status: 'rejected', message: error.message };
  }
  fail(`${name} mutation was accepted`);
}

function runFocusedMutations(model, baserom) {
  const results = [];
  const mutateModel = (name, mutate) => results.push(mutationRejection(name, () => {
    const changed = clone(model);
    mutate(changed);
    verifyWave5SwitchTableStructure({ model: changed, baserom });
  }));
  const mutateLayout = (name, mutate) => results.push(mutationRejection(name, () => {
    const changed = clone(EXPECTED_REGIONS);
    mutate(changed);
    verifyWave5SwitchTableStructure({ model, baserom, layout: changed });
  }));
  const mutateRom = (name, mutate) => results.push(mutationRejection(name, () => {
    const changed = Buffer.from(baserom);
    mutate(changed);
    verifyWave5SwitchTableStructure({ model, baserom: changed });
  }));

  mutateModel('wrong accepted-owner ROM extent', (changed) => {
    rowByIndex(changed, AUXILIARY_OWNER.rowIndex).romEndExclusive += 4;
  });
  mutateModel('wrong accepted-owner VMA extent', (changed) => {
    rowByIndex(changed, AUXILIARY_OWNER.rowIndex).slices[0].vramEndExclusive += 4;
  });
  mutateModel('wrong original assembly provenance', (changed) => {
    rowByIndex(changed, AUXILIARY_OWNER.rowIndex).part.file = 'asm/original/rev0/lib/other.s';
  });
  mutateModel('wrong original assembly identity', (changed) => {
    rowByIndex(changed, AUXILIARY_OWNER.rowIndex).part.sha256 = '0'.repeat(64);
  });
  mutateModel('accidental executable classification', (changed) => {
    rowByIndex(changed, AUXILIARY_OWNER.rowIndex).slices[0].executable = true;
  });
  mutateLayout('wrong table order', (changed) => {
    [changed[1], changed[2]] = [changed[2], changed[1]];
  });
  mutateLayout('table ROM gap', (changed) => {
    changed[2].romStart += 4;
    changed[2].bytes -= 4;
  });
  mutateLayout('table VMA overlap', (changed) => {
    changed[2].vramStart -= 4;
    changed[2].bytes += 4;
  });
  mutateLayout('duplicate retained prefix byte', (changed) => {
    changed[0].romEndExclusive += 4;
    changed[0].vramEndExclusive += 4;
    changed[0].bytes += 4;
  });
  mutateLayout('duplicate retained tail byte', (changed) => {
    changed[4].romStart -= 4;
    changed[4].vramStart -= 4;
    changed[4].bytes += 4;
  });
  mutateLayout('lost retained prefix', (changed) => changed.shift());
  mutateLayout('lost retained tail', (changed) => changed.pop());
  mutateRom('wrong relocation target', (changed) => {
    changed.writeUInt32BE(0x801D8204, EXPECTED_REGIONS[1].romStart);
  });
  results.push(mutationRejection('wrong relocation addend base', () => {
    verifyWave5SwitchTableStructure({
      model,
      baserom,
      relocationBases: { func_0021B438: TEXT_OWNERS.func_0021B438.vramStart + 4 },
    });
  }));
  mutateRom('lost retained tail byte', (changed) => {
    changed[EXPECTED_REGIONS[4].romStart] = 1;
  });
  mutateRom('wrong runtime table reference', (changed) => {
    changed.writeUInt32BE(0x8C2268D4, TABLE_LOADS[0].romStart + 8);
  });
  return results;
}

if (require.main === module) {
  const model = loadAcceptedModel();
  const baserom = fs.readFileSync(path.join(ROOT, 'build', 'baserom.us_rev0.z64'));
  const result = verifyWave5SwitchTableStructure({ model, baserom });
  result.schema = verifyCurrentSchemaGaps(model, baserom, result.textOwners);
  delete result.textOwners;
  result.mutations = runFocusedMutations(model, baserom);
  console.log(JSON.stringify(result, null, 2));
}

module.exports = {
  verifyCurrentSchemaGaps,
  verifyWave5SwitchTableStructure,
};
