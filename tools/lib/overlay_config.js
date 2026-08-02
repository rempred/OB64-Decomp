const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  firstDiff,
  hashBuffer,
  parseHexOrNumber,
  readJson,
} = require('./rom');

const TOOL_VERSION = '1.0.0';
const CANONICAL_ROM_SHA256 = '571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A';
const STATIC_LOGICAL_SHA256 = 'F950150E647D5D8CA3E2DD4A849357D9B8CFA3378BD12772101467C0DDB9C205';
const RUNTIME_PRODUCT_MANIFEST_SHA256 = 'CD622760A083AAC4F2576B98ADEA19F3BCAA90B5DD746D85C4BF9CDF7AF40348';
const BOOT_LINEAR_BASE = 0x8006FC00;
const LAYOUT = Object.freeze({
  descriptorStart: 0x000387C0,
  descriptorEnd: 0x00038AB8,
  descriptorStride: 0x28,
  descriptorCount: 19,
  groupStart: 0x00038AB8,
  groupEnd: 0x00038AFC,
  pointerStart: 0x00038AFC,
  pointerEnd: 0x00038B28,
  pointerCount: 11,
  nullStart: 0x00038B28,
  nullEnd: 0x00038B2C,
  ownerEnd: 0x0003C100,
});

const FIELD_NAMES = Object.freeze([
  'vramStart',
  'vramEnd',
  'romStart',
  'romEnd',
  'bssStart',
  'bssEnd',
  'textStart',
  'textEnd',
  'dataRodataStart',
  'dataRodataEnd',
]);

const SOURCE_OWNERS = Object.freeze([
  ['overlay_descriptors_000387c0', 'asm/original/rev0/lib/overlay_descriptors_000387c0.s', 0x000387C0, 0x00038AB8],
  ['overlay_groups_00038ab8', 'asm/original/rev0/lib/overlay_groups_00038ab8.s', 0x00038AB8, 0x00038AFC],
  ['overlay_group_pointers_00038afc', 'asm/original/rev0/lib/overlay_group_pointers_00038afc.s', 0x00038AFC, 0x00038B2C],
  ['data_00038b2c', 'asm/original/rev0/lib/data_00038b2c.s', 0x00038B2C, 0x0003C100],
]);

const BSS_STORE_PC_UNION = Object.freeze([
  '0x800933B8',
  '0x800933BC',
  '0x800933C0',
  '0x800933C4',
  '0x800933CC',
  '0x800933D0',
  '0x800933D4',
  '0x800933DC',
  '0x800933FC',
]);
const LOOP_STORE_PCS = Object.freeze(BSS_STORE_PC_UNION.slice(0, 8));

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function hex(value, width = 8) {
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
}

function canonicalJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function fileSha256(filePath) {
  return hashBuffer(fs.readFileSync(filePath), 'sha256');
}

function readCanonicalRom(romPath) {
  const resolved = path.resolve(romPath);
  const bytes = fs.readFileSync(resolved);
  invariant(bytes.length === 41943040, `Canonical ROM size mismatch: ${bytes.length}`);
  invariant(bytes.readUInt32BE(0) === 0x80371240, 'Overlay generator requires canonical z64 byte order');
  const sha256 = hashBuffer(bytes, 'sha256');
  invariant(sha256 === CANONICAL_ROM_SHA256, `Canonical ROM SHA-256 mismatch: ${sha256}`);
  return { bytes, path: resolved, sha256 };
}

function range(start, endExclusive) {
  return {
    start: hex(start),
    endExclusive: hex(endExclusive),
    bytes: endExclusive - start,
  };
}

function validateDescriptor(descriptor, romBytes) {
  const f = descriptor.fields;
  invariant(descriptor.rawWords.length === 10, `Descriptor ${descriptor.id}: expected ten words`);
  invariant(f.vramStart < f.vramEnd, `Descriptor ${descriptor.id}: VRAM endpoint order`);
  invariant(f.romStart < f.romEnd, `Descriptor ${descriptor.id}: ROM endpoint order`);
  invariant(f.bssStart <= f.bssEnd, `Descriptor ${descriptor.id}: BSS endpoint order`);
  invariant(f.textStart <= f.textEnd, `Descriptor ${descriptor.id}: text endpoint order`);
  invariant(f.dataRodataStart <= f.dataRodataEnd, `Descriptor ${descriptor.id}: data endpoint order`);
  invariant(f.textStart === f.vramStart, `Descriptor ${descriptor.id}: text must start at VRAM start`);
  invariant(f.textEnd === f.dataRodataStart, `Descriptor ${descriptor.id}: text/data boundary mismatch`);
  invariant(f.dataRodataEnd === f.bssStart, `Descriptor ${descriptor.id}: data/BSS boundary mismatch`);
  invariant(f.bssEnd <= f.vramEnd, `Descriptor ${descriptor.id}: BSS exceeds VRAM reservation`);
  invariant(f.romEnd <= romBytes.length, `Descriptor ${descriptor.id}: ROM range exceeds image`);
  invariant(f.romEnd - f.romStart === f.bssStart - f.vramStart, `Descriptor ${descriptor.id}: initialized image length mismatch`);
  for (const [name, value] of Object.entries(f)) {
    invariant(value % 0x10 === 0, `Descriptor ${descriptor.id}: ${name} is not 16-byte aligned`);
  }
}

function parseDescriptors(romBytes) {
  invariant(romBytes.length >= LAYOUT.descriptorEnd, 'Descriptor table truncated');
  invariant(LAYOUT.descriptorEnd - LAYOUT.descriptorStart === LAYOUT.descriptorCount * LAYOUT.descriptorStride, 'Descriptor layout constant mismatch');
  const descriptors = [];
  for (let id = 0; id < LAYOUT.descriptorCount; id += 1) {
    const offset = LAYOUT.descriptorStart + id * LAYOUT.descriptorStride;
    const raw = romBytes.subarray(offset, offset + LAYOUT.descriptorStride);
    invariant(raw.length === LAYOUT.descriptorStride, `Descriptor ${id}: truncated`);
    const rawWords = FIELD_NAMES.map((_, word) => raw.readUInt32BE(word * 4));
    const fields = Object.fromEntries(FIELD_NAMES.map((name, index) => [name, rawWords[index]]));
    const descriptor = {
      id,
      source: range(offset, offset + LAYOUT.descriptorStride),
      rawSha256: hashBuffer(raw, 'sha256'),
      rawWords: rawWords.map((word) => hex(word)),
      fields,
      sizes: {
        vramReservationBytes: fields.vramEnd - fields.vramStart,
        initializedImageBytes: fields.romEnd - fields.romStart,
        textBytes: fields.textEnd - fields.textStart,
        dataRodataBytes: fields.dataRodataEnd - fields.dataRodataStart,
        bssBytes: fields.bssEnd - fields.bssStart,
      },
    };
    validateDescriptor(descriptor, romBytes);
    descriptors.push(descriptor);
  }
  for (let left = 0; left < descriptors.length; left += 1) {
    for (let right = left + 1; right < descriptors.length; right += 1) {
      const a = descriptors[left].fields;
      const b = descriptors[right].fields;
      invariant(Math.max(a.romStart, b.romStart) >= Math.min(a.romEnd, b.romEnd), `Descriptors ${left}/${right}: source ROM overlap`);
    }
  }
  return descriptors.map((descriptor) => ({
    ...descriptor,
    fields: Object.fromEntries(Object.entries(descriptor.fields).map(([name, value]) => [name, hex(value)])),
  }));
}

function parseGroupRecord(bytes, start, endExclusive, descriptorCount = LAYOUT.descriptorCount) {
  invariant(start >= 0 && endExclusive <= bytes.length && start < endExclusive, 'Group record range invalid');
  invariant(start % 4 === 0 && endExclusive % 4 === 0, 'Group record is not word-aligned');
  const record = bytes.subarray(start, endExclusive);
  const terminatorIndex = record.indexOf(0xFF);
  invariant(terminatorIndex !== -1, `Group record ${hex(start)}: missing terminator`);
  const memberIds = Array.from(record.subarray(0, terminatorIndex));
  for (const id of memberIds) invariant(id < descriptorCount, `Group record ${hex(start)}: descriptor ID ${id} out of range`);
  const padding = record.subarray(terminatorIndex + 1);
  invariant(padding.length <= 3, `Group record ${hex(start)}: excess alignment padding`);
  invariant(Array.from(padding).every((value) => value === 0), `Group record ${hex(start)}: nonzero alignment padding`);
  return {
    memberIds,
    terminatorOffset: start + terminatorIndex,
    paddingRange: range(start + terminatorIndex + 1, endExclusive),
    rawSha256: hashBuffer(record, 'sha256'),
  };
}

function parseGroupsAndPointers(romBytes, requireCanonicalNonempty = true) {
  invariant(romBytes.length >= LAYOUT.nullEnd, 'Group/pointer region truncated');
  const pointers = [];
  for (let logicalGroupId = 0; logicalGroupId < LAYOUT.pointerCount; logicalGroupId += 1) {
    const slotOffset = LAYOUT.pointerStart + logicalGroupId * 4;
    const rawPointer = romBytes.readUInt32BE(slotOffset);
    const targetOffset = rawPointer - BOOT_LINEAR_BASE;
    invariant(targetOffset >= LAYOUT.groupStart && targetOffset < LAYOUT.groupEnd, `Pointer ${logicalGroupId}: target outside group region`);
    invariant(targetOffset % 4 === 0, `Pointer ${logicalGroupId}: target is not word-aligned`);
    pointers.push({ logicalGroupId, slotOffset, rawPointer, targetOffset });
  }
  invariant(new Set(pointers.map((item) => item.rawPointer)).size === LAYOUT.pointerCount, 'Pointer table contains aliases; canonical pointers must be distinct');
  const starts = [...new Set(pointers.map((item) => item.targetOffset))].sort((a, b) => a - b);
  invariant(starts.length === LAYOUT.pointerCount, 'Physical group count mismatch');
  invariant(starts[0] === LAYOUT.groupStart, 'Physical group ownership does not start at group region start');
  const groups = starts.map((start, physicalGroupId) => {
    const endExclusive = physicalGroupId + 1 < starts.length ? starts[physicalGroupId + 1] : LAYOUT.groupEnd;
    const parsed = parseGroupRecord(romBytes, start, endExclusive);
    if (requireCanonicalNonempty) invariant(parsed.memberIds.length > 0, `Canonical group ${physicalGroupId}: unexpectedly empty`);
    return {
      physicalGroupId,
      source: range(start, endExclusive),
      ...parsed,
      logicalGroupIds: pointers.filter((item) => item.targetOffset === start).map((item) => item.logicalGroupId),
    };
  });
  const byStart = new Map(groups.map((group) => [parseHexOrNumber(group.source.start), group.physicalGroupId]));
  const pointerRows = pointers.map((item) => ({
    logicalGroupId: item.logicalGroupId,
    slotOffset: hex(item.slotOffset),
    rawPointer: hex(item.rawPointer),
    targetOffset: hex(item.targetOffset),
    physicalGroupId: byStart.get(item.targetOffset),
  }));
  const nullWord = romBytes.readUInt32BE(LAYOUT.nullStart);
  invariant(nullWord === 0, `Pointer null word is not zero: ${hex(nullWord)}`);
  return { groups, pointers: pointerRows, nullWord: { source: range(LAYOUT.nullStart, LAYOUT.nullEnd), value: hex(nullWord) } };
}

function positiveOverlapCount(rows, startName, endName) {
  let count = 0;
  for (let left = 0; left < rows.length; left += 1) {
    for (let right = left + 1; right < rows.length; right += 1) {
      const a = rows[left].fields;
      const b = rows[right].fields;
      const start = Math.max(parseHexOrNumber(a[startName]), parseHexOrNumber(b[startName]));
      const end = Math.min(parseHexOrNumber(a[endName]), parseHexOrNumber(b[endName]));
      if (end > start) count += 1;
    }
  }
  return count;
}

function allManifestParts(manifest) {
  return (manifest.chunks || []).flatMap((chunk) => chunk.parts || []);
}

function parseAsmWords(text, expectedStart, expectedEnd) {
  const rows = [];
  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    const match = line.match(/\/\*\s+0x([0-9A-Fa-f]{8})\s+[^*]*\*\/\s+\.word\s+0x([0-9A-Fa-f]{8})/);
    if (match) rows.push({ offset: parseInt(match[1], 16), word: parseInt(match[2], 16) });
  }
  invariant(rows.length * 4 === expectedEnd - expectedStart, `Source owner ${hex(expectedStart)}: byte count mismatch`);
  const bytes = Buffer.alloc(rows.length * 4);
  rows.forEach((row, index) => {
    invariant(row.offset === expectedStart + index * 4, `Source owner ${hex(expectedStart)}: offset discontinuity at word ${index}`);
    bytes.writeUInt32BE(row.word >>> 0, index * 4);
  });
  return bytes;
}

function verifySourceSplit(romBytes, manifestPath) {
  const resolvedManifest = path.resolve(manifestPath);
  const manifest = readJson(resolvedManifest);
  const parts = allManifestParts(manifest);
  invariant(!parts.some((part) => part.name === 'table_text_vm_jump_table' || /table_text_vm_jump_table\.s$/.test(part.file)), 'Broad source owner still present');
  const overlapping = parts.filter((part) => {
    const start = parseHexOrNumber(part.romStart);
    const end = parseHexOrNumber(part.romEndExclusive);
    return end > LAYOUT.descriptorStart && start < LAYOUT.ownerEnd;
  });
  invariant(overlapping.length === SOURCE_OWNERS.length, `Source split owner count mismatch: ${overlapping.length}`);
  const owners = [];
  for (let index = 0; index < SOURCE_OWNERS.length; index += 1) {
    const [name, file, start, endExclusive] = SOURCE_OWNERS[index];
    const part = overlapping[index];
    invariant(part.name === name, `Source owner ${index}: name mismatch`);
    invariant(part.file.replace(/\\/g, '/') === file, `Source owner ${name}: file mismatch`);
    invariant(parseHexOrNumber(part.romStart) === start && parseHexOrNumber(part.romEndExclusive) === endExclusive, `Source owner ${name}: range mismatch`);
    invariant(part.bytes === endExclusive - start, `Source owner ${name}: manifest byte count mismatch`);
    const filePath = path.resolve(ROOT, file);
    const text = fs.readFileSync(filePath, 'utf8');
    const sha256 = hashBuffer(Buffer.from(text), 'sha256');
    invariant(sha256 === part.sha256, `Source owner ${name}: manifest SHA-256 mismatch`);
    invariant(Buffer.byteLength(text) === part.textBytes, `Source owner ${name}: manifest text byte count mismatch`);
    const assembled = parseAsmWords(text, start, endExclusive);
    const diff = firstDiff(romBytes.subarray(start, endExclusive), assembled);
    if (diff) throw new Error(`Source owner ${name}: ROM byte mismatch at ${hex(start + diff.offset)}`);
    owners.push({ name, file, ...range(start, endExclusive), sha256, textBytes: Buffer.byteLength(text) });
  }
  invariant(owners[0].start === hex(LAYOUT.descriptorStart) && owners.at(-1).endExclusive === hex(LAYOUT.ownerEnd), 'Source owner envelope mismatch');
  return { manifestPath: path.relative(ROOT, resolvedManifest).replace(/\\/g, '/'), manifestSha256: fileSha256(resolvedManifest), owners };
}

function bssRow(descriptorsById, invocation, frame, descriptorId, storePcs) {
  const descriptor = descriptorsById.get(descriptorId);
  const start = descriptor.fields.bssStart;
  const endExclusive = descriptor.fields.bssEnd;
  const bytes = parseHexOrNumber(endExclusive) - parseHexOrNumber(start);
  return {
    invocation,
    frame,
    descriptorId,
    range: { start, endExclusive, bytes },
    helperEntryPc: '0x80093380',
    storePcs,
    observedStoreCount: bytes / 4,
    wordCoverage: 'exactly-once-aligned-zero',
  };
}

function buildRuntimeObservations(descriptors, groups) {
  const descriptorsById = new Map(descriptors.map((descriptor) => [descriptor.id, descriptor]));
  const groupByLogical = new Map(groups.flatMap((group) => group.logicalGroupIds.map((logicalId) => [logicalId, group])));
  const selections = [
    { invocation: 0, frame: 242, logicalGroupId: 3, descriptorIds: [0, 14] },
    { invocation: 1, frame: 276, logicalGroupId: 2, descriptorIds: [2, 4, 10, 11, 12, 13, 14] },
  ];
  const bss = [
    bssRow(descriptorsById, 0, 242, 0, ['0x800933FC']),
    bssRow(descriptorsById, 0, 242, 14, [...BSS_STORE_PC_UNION]),
    bssRow(descriptorsById, 1, 276, 2, [...LOOP_STORE_PCS]),
    bssRow(descriptorsById, 1, 276, 4, []),
    bssRow(descriptorsById, 1, 277, 10, [...LOOP_STORE_PCS]),
    bssRow(descriptorsById, 1, 278, 11, ['0x800933FC']),
    bssRow(descriptorsById, 1, 279, 12, [...LOOP_STORE_PCS]),
    bssRow(descriptorsById, 1, 279, 13, []),
    bssRow(descriptorsById, 1, 279, 14, [...BSS_STORE_PC_UNION]),
  ];
  const selectedDescriptors = selections.flatMap((selection) => selection.descriptorIds.map((descriptorId) => {
    const descriptor = descriptorsById.get(descriptorId);
    return {
      invocation: selection.invocation,
      descriptorId,
      dma: {
        sourceStart: descriptor.fields.romStart,
        destinationStart: descriptor.fields.vramStart,
        bytes: descriptor.sizes.initializedImageBytes,
        invocationBoundedGapFreeExact: true,
      },
      cacheCalls: {
        instructionRange: { start: descriptor.fields.textStart, endExclusive: descriptor.fields.textEnd },
        dataRodataRange: { start: descriptor.fields.dataRodataStart, endExclusive: descriptor.fields.dataRodataEnd },
        declaredEndpointCallsitesAndHelperEntriesObserved: true,
        limit: 'execution observed; microarchitectural cache state not established',
      },
    };
  }));
  const runtime = {
    evidenceGrade: 'independently-reviewed-bounded-runtime-observation',
    provenance: {
      parentSemanticProductCommit: 'a8284de9e9e428a83e0e99d6704e00cbe889d4fc',
      parentRecordBoundaryCommit: '72ffd71b9d0db9db3ec6be99a7f412dab11b5891',
      productManifestSha256: RUNTIME_PRODUCT_MANIFEST_SHA256,
      capture: 'one immutable zero-controller 1200-frame scenario-card-to-combat natural load',
    },
    selections,
    selectedDescriptors,
    bss: {
      helperEntryPc: '0x80093380',
      observedStorePcUnion: [...BSS_STORE_PC_UNION],
      rows: bss,
    },
    controller: {
      completeVectors: 3252,
      allButtonsMasksAndAxesZero: true,
    },
    finalResidency: {
      finalLogicalGroupId: 2,
      group2TextRomIdentical: true,
      group2WholeImageRomIdenticalDescriptorIds: [2, 4, 11, 12, 13],
      laterDataByteChanges: [{ descriptorId: 10, count: 27 }, { descriptorId: 14, count: 1 }],
      overwritten: [{ descriptorId: 0, byDescriptorId: 2, sharedVramStart: descriptorsById.get(0).fields.vramStart }],
      limit: 'initialized DMA identity is distinct from final residency after ordinary game writes',
    },
    limits: [
      'Only logical groups 3 then 2 were observed.',
      'No claim is made for the other nine groups or their natural-load behavior.',
      'Cold boot, hardware cache contents, editor behavior, matching C, canonical promotion, and whole-program coverage remain unresolved.',
    ],
  };
  for (const selection of selections) {
    invariant(JSON.stringify(groupByLogical.get(selection.logicalGroupId).memberIds) === JSON.stringify(selection.descriptorIds), `Runtime selection group ${selection.logicalGroupId} conflicts with ROM group members`);
  }
  return runtime;
}

function validateRuntimeObservations(runtime, descriptors, groups) {
  invariant(runtime && runtime.evidenceGrade === 'independently-reviewed-bounded-runtime-observation', 'Runtime annotation evidence grade malformed');
  invariant(runtime.provenance.productManifestSha256 === RUNTIME_PRODUCT_MANIFEST_SHA256, 'Runtime annotation provenance mismatch');
  invariant(Array.isArray(runtime.selections) && runtime.selections.length === 2, 'Runtime annotation must contain exactly two selections');
  invariant(JSON.stringify(runtime.selections.map((row) => row.logicalGroupId)) === JSON.stringify([3, 2]), 'Unsupported other-group runtime promotion');
  const groupByLogical = new Map(groups.flatMap((group) => group.logicalGroupIds.map((logicalId) => [logicalId, group])));
  for (const selection of runtime.selections) {
    const group = groupByLogical.get(selection.logicalGroupId);
    invariant(group && JSON.stringify(selection.descriptorIds) === JSON.stringify(group.memberIds), `Runtime selection ${selection.logicalGroupId}: member mismatch`);
  }
  invariant(runtime.bss.helperEntryPc === '0x80093380', 'Runtime BSS helper entry mismatch');
  invariant(!runtime.bss.observedStorePcUnion.includes(runtime.bss.helperEntryPc), 'Runtime helper/store conflation');
  invariant(JSON.stringify(runtime.bss.observedStorePcUnion) === JSON.stringify(BSS_STORE_PC_UNION), 'Runtime BSS store-PC union mismatch');
  invariant(runtime.bss.rows.length === 9, 'Runtime BSS row count mismatch');
  const descriptor0 = runtime.bss.rows.find((row) => row.invocation === 0 && row.descriptorId === 0);
  invariant(descriptor0 && JSON.stringify(descriptor0.storePcs) === JSON.stringify(['0x800933FC']), 'Descriptor 0 BSS store PC mismatch');
  const emptyIds = runtime.bss.rows.filter((row) => row.range.bytes === 0).map((row) => row.descriptorId);
  invariant(JSON.stringify(emptyIds) === JSON.stringify([4, 13]), 'Runtime empty-BSS attribution mismatch');
  for (const row of runtime.bss.rows) {
    const descriptor = descriptors.find((item) => item.id === row.descriptorId);
    invariant(descriptor, `Runtime BSS row descriptor ${row.descriptorId} missing`);
    invariant(row.range.start === descriptor.fields.bssStart && row.range.endExclusive === descriptor.fields.bssEnd, `Runtime BSS row ${row.descriptorId}: range mismatch`);
    invariant(row.helperEntryPc === '0x80093380', `Runtime BSS row ${row.descriptorId}: helper mismatch`);
    invariant(row.wordCoverage === 'exactly-once-aligned-zero', `Runtime BSS row ${row.descriptorId}: coverage grade malformed`);
  }
  invariant(runtime.controller.completeVectors === 3252 && runtime.controller.allButtonsMasksAndAxesZero === true, 'Runtime controller annotation mismatch');
  invariant(runtime.finalResidency.finalLogicalGroupId === 2 && runtime.finalResidency.group2TextRomIdentical === true, 'Runtime final-residency annotation mismatch');
  invariant(JSON.stringify(runtime.finalResidency.group2WholeImageRomIdenticalDescriptorIds) === JSON.stringify([2, 4, 11, 12, 13]), 'Runtime whole-image residency set mismatch');
  invariant(JSON.stringify(runtime.finalResidency.laterDataByteChanges) === JSON.stringify([{ descriptorId: 10, count: 27 }, { descriptorId: 14, count: 1 }]), 'Runtime mutation-limit annotation mismatch');
  invariant(runtime.limits.some((item) => item.includes('Only logical groups 3 then 2')), 'Runtime other-group limit missing');
}

function toolHash(relativePath) {
  const resolved = path.resolve(ROOT, relativePath);
  return fs.existsSync(resolved) ? fileSha256(resolved) : null;
}

function buildConfig({ romPath, manifestPath = path.join(ROOT, 'asm', 'original', 'rev0', 'manifest.json') }) {
  const rom = readCanonicalRom(romPath);
  const descriptors = parseDescriptors(rom.bytes);
  const { groups, pointers, nullWord } = parseGroupsAndPointers(rom.bytes);
  const sourceSplit = verifySourceSplit(rom.bytes, manifestPath);
  const runtimeObservations = buildRuntimeObservations(descriptors, groups);
  validateRuntimeObservations(runtimeObservations, descriptors, groups);
  const config = {
    schemaVersion: 1,
    configId: 'ob64-us-rev0-overlay-layout',
    generator: {
      tool: 'tools/generate_overlay_config.js',
      version: TOOL_VERSION,
      deterministicJson: true,
    },
    provenance: {
      ordinarySource: 'canonical normalized US Rev 0 z64 bytes',
      rom: { byteOrder: 'z64', bytes: rom.bytes.length, sha256: rom.sha256 },
      acceptedComparisonInputs: {
        staticPackage: { role: 'comparison expectation only', logicalSha256: STATIC_LOGICAL_SHA256 },
        boundedRuntimePackage: { role: 'annotation provenance only', productManifestSha256: RUNTIME_PRODUCT_MANIFEST_SHA256 },
      },
      tooling: [
        'tools/lib/overlay_config.js',
        'tools/generate_overlay_config.js',
        'tools/verify_overlay_config.js',
      ].map((file) => ({ file, sha256: toolHash(file) })),
    },
    layout: {
      descriptorTable: { ...range(LAYOUT.descriptorStart, LAYOUT.descriptorEnd), count: LAYOUT.descriptorCount, stride: LAYOUT.descriptorStride },
      groupRecords: {
        ...range(LAYOUT.groupStart, LAYOUT.groupEnd),
        count: groups.length,
        grammar: 'zero-or-more unsigned descriptor IDs, 0xFF terminator, then zero padding to 4-byte alignment',
        canonicalRecordsNonempty: groups.every((group) => group.memberIds.length > 0),
      },
      pointerTable: { ...range(LAYOUT.pointerStart, LAYOUT.pointerEnd), count: LAYOUT.pointerCount, canonicalPointersDistinct: true },
      nullWord: nullWord.source,
    },
    descriptors,
    groups,
    pointers,
    nullWord,
    conservation: {
      sourceRomPositiveOverlapPairs: positiveOverlapCount(descriptors, 'romStart', 'romEnd'),
      vramReservationPositiveOverlapPairs: positiveOverlapCount(descriptors, 'vramStart', 'vramEnd'),
      initializedImagePositiveOverlapPairs: positiveOverlapCount(descriptors, 'vramStart', 'bssStart'),
      allDescriptorFields16ByteAligned: true,
      sourceSplit,
    },
    runtimeObservations,
  };
  return { config, text: canonicalJson(config), rom };
}

function readJsonLines(filePath) {
  return fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function compareParentAcceptedRows(config, packagePath) {
  const root = path.resolve(packagePath);
  const descriptors = readJsonLines(path.join(root, 'overlay-descriptors.jsonl'));
  const groups = readJsonLines(path.join(root, 'physical-groups.jsonl'));
  const pointers = readJsonLines(path.join(root, 'group-pointers.jsonl'));
  invariant(descriptors.length === config.descriptors.length, 'Parent descriptor comparison count mismatch');
  invariant(groups.length === config.groups.length, 'Parent group comparison count mismatch');
  invariant(pointers.length === config.pointers.length, 'Parent pointer comparison count mismatch');
  descriptors.forEach((row, id) => {
    const local = config.descriptors[id];
    invariant(row.descriptorId === id, `Parent descriptor ${id}: ID mismatch`);
    invariant(JSON.stringify(row.rawWords) === JSON.stringify(local.rawWords), `Parent descriptor ${id}: raw-word mismatch`);
  });
  groups.forEach((row, id) => {
    const local = config.groups[id];
    invariant(row.physicalGroupId === id && JSON.stringify(row.memberIds) === JSON.stringify(local.memberIds), `Parent group ${id}: member mismatch`);
  });
  pointers.forEach((row, id) => {
    const local = config.pointers[id];
    invariant(row.logicalGroupId === id, `Parent pointer ${id}: ID mismatch`);
    invariant(row.rawPointer === parseHexOrNumber(local.rawPointer), `Parent pointer ${id}: raw pointer mismatch`);
    invariant(row.mappedZ64Offset === parseHexOrNumber(local.targetOffset), `Parent pointer ${id}: target mismatch`);
  });
  return { descriptorRows: descriptors.length, groupRows: groups.length, pointerRows: pointers.length, equal: true };
}

function sha256Text(text) {
  return crypto.createHash('sha256').update(text).digest('hex').toUpperCase();
}

module.exports = {
  BSS_STORE_PC_UNION,
  CANONICAL_ROM_SHA256,
  LAYOUT,
  RUNTIME_PRODUCT_MANIFEST_SHA256,
  SOURCE_OWNERS,
  STATIC_LOGICAL_SHA256,
  TOOL_VERSION,
  buildConfig,
  canonicalJson,
  compareParentAcceptedRows,
  parseDescriptors,
  parseGroupRecord,
  parseGroupsAndPointers,
  readCanonicalRom,
  sha256Text,
  validateRuntimeObservations,
  verifySourceSplit,
};
