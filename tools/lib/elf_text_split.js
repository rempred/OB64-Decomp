'use strict';

const ELF_HEADER_BYTES = 52;
const SECTION_HEADER_BYTES = 40;
const SYMBOL_BYTES = 16;
const REL_BYTES = 8;
const SHT_NULL = 0;
const SHT_PROGBITS = 1;
const SHT_SYMTAB = 2;
const SHT_NOBITS = 8;
const SHT_REL = 9;
const STT_SECTION = 3;
const SHN_LORESERVE = 0xff00;
const R_MIPS_HI16 = 5;
const R_MIPS_LO16 = 6;
const OUTPUT_SECTION = /^\.ob64\.r[0-9]+(?:\.s[0-9]+)?$/;

function fail(message) {
  throw new Error(`relocatable text split failure: ${message}`);
}

function alignUp(value, alignment) {
  const effective = alignment || 1;
  if (!Number.isInteger(effective) || effective <= 0) fail('section alignment is malformed');
  return Math.ceil(value / effective) * effective;
}

function readCString(buffer, offset) {
  if (!Number.isInteger(offset) || offset < 0 || offset >= buffer.length) fail('section-name offset is malformed');
  const end = buffer.indexOf(0, offset);
  if (end < 0) fail('section-name string is unterminated');
  return buffer.subarray(offset, end).toString('utf8');
}

function parseRelocatable(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < ELF_HEADER_BYTES
      || buffer[0] !== 0x7f || buffer.subarray(1, 4).toString('ascii') !== 'ELF'
      || buffer[4] !== 1 || buffer[5] !== 2 || buffer[6] !== 1
      || buffer.readUInt16BE(16) !== 1 || buffer.readUInt16BE(18) !== 8
      || buffer.readUInt32BE(28) !== 0 || buffer.readUInt16BE(44) !== 0
      || buffer.readUInt16BE(40) !== ELF_HEADER_BYTES
      || buffer.readUInt16BE(46) !== SECTION_HEADER_BYTES) {
    fail('input is not an ELF32 big-endian MIPS relocatable object without program headers');
  }
  const sectionOffset = buffer.readUInt32BE(32);
  const sectionCount = buffer.readUInt16BE(48);
  const shstrIndex = buffer.readUInt16BE(50);
  if (sectionCount < 2 || shstrIndex <= 0 || shstrIndex >= sectionCount
      || sectionOffset < ELF_HEADER_BYTES
      || sectionOffset + sectionCount * SECTION_HEADER_BYTES > buffer.length) {
    fail('section-header table is malformed');
  }
  const sections = [];
  for (let index = 0; index < sectionCount; index += 1) {
    const offset = sectionOffset + index * SECTION_HEADER_BYTES;
    sections.push({
      index,
      nameOffset: buffer.readUInt32BE(offset),
      type: buffer.readUInt32BE(offset + 4),
      flags: buffer.readUInt32BE(offset + 8),
      address: buffer.readUInt32BE(offset + 12),
      offset: buffer.readUInt32BE(offset + 16),
      size: buffer.readUInt32BE(offset + 20),
      link: buffer.readUInt32BE(offset + 24),
      info: buffer.readUInt32BE(offset + 28),
      alignment: buffer.readUInt32BE(offset + 32),
      entrySize: buffer.readUInt32BE(offset + 36),
    });
  }
  const shstr = sections[shstrIndex];
  if (shstr.type !== 3 || shstr.offset + shstr.size > buffer.length) fail('section-name string table is malformed');
  const names = buffer.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) {
    section.name = readCString(names, section.nameOffset);
    if (section.type !== SHT_NOBITS && section.offset + section.size > buffer.length) {
      fail(`section bytes are out of bounds: ${section.name}`);
    }
  }
  return { sectionOffset, sectionCount, shstrIndex, sections };
}

function sectionBytes(buffer, section) {
  return section.type === SHT_NOBITS
    ? Buffer.alloc(0)
    : Buffer.from(buffer.subarray(section.offset, section.offset + section.size));
}

function normalizeOwners(owners, sourceSectionBytes) {
  if (!Array.isArray(owners) || owners.length < 2) fail('owner list must contain at least two sections');
  const names = new Set();
  let logicalOffset = 0;
  const normalized = owners.map((owner, index) => {
    if (!owner || typeof owner !== 'object' || Array.isArray(owner)
        || Object.keys(owner).some((key) => !['sectionName', 'bytes'].includes(key))
        || typeof owner.sectionName !== 'string' || !OUTPUT_SECTION.test(owner.sectionName)
        || names.has(owner.sectionName)
        || !Number.isInteger(owner.bytes) || owner.bytes <= 0 || owner.bytes % 4 !== 0) {
      fail(`owner record ${index} is malformed or duplicated`);
    }
    names.add(owner.sectionName);
    const record = {
      sectionName: owner.sectionName,
      bytes: owner.bytes,
      logicalOffset,
      logicalEnd: logicalOffset + owner.bytes,
    };
    logicalOffset += owner.bytes;
    return record;
  });
  if (logicalOffset !== sourceSectionBytes) fail('owner byte census does not equal the compiler text section');
  return normalized;
}

function ownerForOffset(owners, offset, allowEnd = false) {
  if (!Number.isInteger(offset) || offset < 0) fail('text-relative offset is malformed');
  const owner = owners.find((record) => offset >= record.logicalOffset && offset < record.logicalEnd);
  if (owner) return owner;
  if (allowEnd && offset === owners[owners.length - 1].logicalEnd) return owners[owners.length - 1];
  fail(`text-relative offset is outside the owner census: 0x${offset.toString(16)}`);
}

function splitRelocations(bytes, owners) {
  if (bytes.length % REL_BYTES !== 0) fail('text relocation section size is malformed');
  const grouped = new Map(owners.map((owner) => [owner.sectionName, []]));
  const pendingHi16 = new Map();
  let previousOffset = -1;
  for (let offset = 0; offset < bytes.length; offset += REL_BYTES) {
    const relocationOffset = bytes.readUInt32BE(offset);
    const info = bytes.readUInt32BE(offset + 4);
    if (relocationOffset < previousOffset) fail('text relocations are not ordered');
    previousOffset = relocationOffset;
    const owner = ownerForOffset(owners, relocationOffset);
    const symbolIndex = info >>> 8;
    const type = info & 0xff;
    if (type === R_MIPS_HI16) {
      if (!pendingHi16.has(symbolIndex)) pendingHi16.set(symbolIndex, []);
      pendingHi16.get(symbolIndex).push(owner.sectionName);
    } else if (type === R_MIPS_LO16) {
      const pending = pendingHi16.get(symbolIndex) || [];
      if (pending.length === 0 || pending.some((sectionName) => sectionName !== owner.sectionName)) {
        fail('R_MIPS_HI16/R_MIPS_LO16 pairing crosses an accepted owner boundary');
      }
      pendingHi16.delete(symbolIndex);
    }
    const record = Buffer.alloc(REL_BYTES);
    record.writeUInt32BE(relocationOffset - owner.logicalOffset, 0);
    record.writeUInt32BE(info, 4);
    grouped.get(owner.sectionName).push(record);
  }
  if ([...pendingHi16.values()].some((pending) => pending.length > 0)) {
    fail('unpaired R_MIPS_HI16 remains after owner splitting');
  }
  return new Map([...grouped.entries()].map(([name, records]) => [name, Buffer.concat(records)]));
}

function buildSectionList(parsed, input, source, relocation, owners, relocationGroups) {
  const sections = [];
  const oldToNew = new Map();
  const ownerSections = new Map();
  const ownerRelocations = new Map();
  for (const original of parsed.sections) {
    if (original.index === source.index) {
      for (const owner of owners) {
        const descriptor = {
          ...original,
          oldIndex: original.index,
          name: owner.sectionName,
          size: owner.bytes,
          data: Buffer.from(input.subarray(
            source.offset + owner.logicalOffset,
            source.offset + owner.logicalEnd,
          )),
          splitKind: 'text-owner',
          owner,
        };
        descriptor.index = sections.length;
        sections.push(descriptor);
        ownerSections.set(owner.sectionName, descriptor);
      }
      oldToNew.set(original.index, ownerSections.get(owners[0].sectionName).index);
      continue;
    }
    if (relocation && original.index === relocation.index) {
      for (const owner of owners) {
        const data = relocationGroups.get(owner.sectionName);
        const descriptor = {
          ...original,
          oldIndex: original.index,
          name: `.rel${owner.sectionName}`,
          size: data.length,
          data,
          splitKind: 'text-relocation-owner',
          owner,
        };
        descriptor.index = sections.length;
        sections.push(descriptor);
        ownerRelocations.set(owner.sectionName, descriptor);
      }
      oldToNew.set(original.index, ownerRelocations.get(owners[0].sectionName).index);
      continue;
    }
    const descriptor = {
      ...original,
      oldIndex: original.index,
      data: sectionBytes(input, original),
      splitKind: null,
    };
    descriptor.index = sections.length;
    sections.push(descriptor);
    oldToNew.set(original.index, descriptor.index);
  }
  return { sections, oldToNew, ownerSections, ownerRelocations };
}

function rewriteSymbolTables(sectionList, source, owners) {
  for (const section of sectionList.sections.filter((candidate) => candidate.type === SHT_SYMTAB)) {
    if (section.entrySize !== SYMBOL_BYTES || section.data.length % SYMBOL_BYTES !== 0) {
      fail(`symbol table is malformed: ${section.name}`);
    }
    for (let offset = 0; offset < section.data.length; offset += SYMBOL_BYTES) {
      const value = section.data.readUInt32BE(offset + 4);
      const info = section.data[offset + 12];
      const symbolType = info & 0xf;
      const oldSectionIndex = section.data.readUInt16BE(offset + 14);
      if (oldSectionIndex === source.index) {
        if (symbolType === STT_SECTION) {
          section.data.writeUInt16BE(sectionList.ownerSections.get(owners[0].sectionName).index, offset + 14);
        } else {
          const owner = ownerForOffset(owners, value, true);
          section.data.writeUInt32BE(value - owner.logicalOffset, offset + 4);
          section.data.writeUInt16BE(sectionList.ownerSections.get(owner.sectionName).index, offset + 14);
        }
      } else if (oldSectionIndex > 0 && oldSectionIndex < SHN_LORESERVE) {
        const remapped = sectionList.oldToNew.get(oldSectionIndex);
        if (!Number.isInteger(remapped)) fail('symbol references an unknown section index');
        section.data.writeUInt16BE(remapped, offset + 14);
      }
    }
  }
}

function rewriteSectionReferences(sectionList, relocation) {
  for (const section of sectionList.sections) {
    if (section.index === 0) continue;
    if (section.link > 0 && section.link < SHN_LORESERVE) {
      const remapped = sectionList.oldToNew.get(section.link);
      if (!Number.isInteger(remapped)) fail(`section link references an unknown index: ${section.name}`);
      section.link = remapped;
    }
    if (section.splitKind === 'text-relocation-owner') {
      section.info = sectionList.ownerSections.get(section.owner.sectionName).index;
    } else if (section.type === SHT_REL && section.info > 0 && section.info < SHN_LORESERVE) {
      const remapped = sectionList.oldToNew.get(section.info);
      if (!Number.isInteger(remapped)) fail(`relocation section references an unknown target: ${section.name}`);
      section.info = remapped;
    }
  }
  if (relocation) {
    for (const owner of sectionList.ownerRelocations.keys()) {
      if (!sectionList.ownerSections.has(owner)) fail('split relocation owner has no text owner');
    }
  }
}

function rebuildSectionNames(sectionList, oldShstrIndex) {
  const shstrIndex = sectionList.oldToNew.get(oldShstrIndex);
  if (!Number.isInteger(shstrIndex)) fail('section-name table index was not preserved');
  const chunks = [Buffer.from([0])];
  let offset = 1;
  for (const section of sectionList.sections) {
    if (section.index === 0) {
      section.nameOffset = 0;
      continue;
    }
    const encoded = Buffer.from(`${section.name}\0`, 'utf8');
    section.nameOffset = offset;
    chunks.push(encoded);
    offset += encoded.length;
  }
  const shstr = sectionList.sections[shstrIndex];
  if (!shstr || shstr.type !== 3) fail('section-name table was not preserved');
  shstr.data = Buffer.concat(chunks);
  shstr.size = shstr.data.length;
  return shstrIndex;
}

function serialize(input, parsed, sectionList, shstrIndex) {
  let cursor = ELF_HEADER_BYTES;
  for (const section of sectionList.sections) {
    if (section.index === 0) {
      section.offset = 0;
      section.size = 0;
      continue;
    }
    cursor = alignUp(cursor, section.alignment || 1);
    section.offset = cursor;
    if (section.type !== SHT_NOBITS) {
      section.size = section.data.length;
      cursor += section.data.length;
    }
  }
  const sectionOffset = alignUp(cursor, 4);
  const output = Buffer.alloc(sectionOffset + sectionList.sections.length * SECTION_HEADER_BYTES);
  input.copy(output, 0, 0, ELF_HEADER_BYTES);
  output.writeUInt32BE(sectionOffset, 32);
  output.writeUInt16BE(sectionList.sections.length, 48);
  output.writeUInt16BE(shstrIndex, 50);
  for (const section of sectionList.sections) {
    if (section.index > 0 && section.type !== SHT_NOBITS && section.data.length > 0) {
      section.data.copy(output, section.offset);
    }
    const offset = sectionOffset + section.index * SECTION_HEADER_BYTES;
    if (section.index === 0) continue;
    output.writeUInt32BE(section.nameOffset, offset);
    output.writeUInt32BE(section.type, offset + 4);
    output.writeUInt32BE(section.flags, offset + 8);
    output.writeUInt32BE(section.address, offset + 12);
    output.writeUInt32BE(section.offset, offset + 16);
    output.writeUInt32BE(section.size, offset + 20);
    output.writeUInt32BE(section.link, offset + 24);
    output.writeUInt32BE(section.info, offset + 28);
    output.writeUInt32BE(section.alignment, offset + 32);
    output.writeUInt32BE(section.entrySize, offset + 36);
  }
  return output;
}

function splitRelocatableTextSection(input, sourceSectionName, requestedOwners) {
  if (typeof sourceSectionName !== 'string' || !OUTPUT_SECTION.test(sourceSectionName)) {
    fail('source section name is malformed');
  }
  const parsed = parseRelocatable(input);
  const sourceMatches = parsed.sections.filter((section) => section.name === sourceSectionName);
  if (sourceMatches.length !== 1) fail('source text section does not resolve uniquely');
  const source = sourceMatches[0];
  if (source.type !== SHT_PROGBITS || (source.flags & 6) !== 6 || source.address !== 0
      || source.size <= 0 || source.size % 4 !== 0) {
    fail('source text section shape is malformed');
  }
  const owners = normalizeOwners(requestedOwners, source.size);
  if (owners[0].sectionName !== sourceSectionName) fail('first owner must retain the assembler source section name');
  if (owners.slice(1).some((owner) => parsed.sections.some((section) => section.name === owner.sectionName))) {
    fail('a continuation output section already exists in the assembler object');
  }
  if (owners.some((owner) => owner.logicalOffset % (source.alignment || 1) !== 0)) {
    fail('an accepted owner boundary violates the compiler text alignment');
  }
  const relocationName = `.rel${sourceSectionName}`;
  const relocationMatches = parsed.sections.filter((section) => section.name === relocationName);
  if (relocationMatches.length > 1) fail('source text relocation section is ambiguous');
  const relocation = relocationMatches[0] || null;
  if (relocation && (relocation.type !== SHT_REL || relocation.entrySize !== REL_BYTES
      || relocation.info !== source.index || relocation.link <= 0)) {
    fail('source text relocation section shape is malformed');
  }
  const relocationGroups = relocation
    ? splitRelocations(sectionBytes(input, relocation), owners)
    : new Map(owners.map((owner) => [owner.sectionName, Buffer.alloc(0)]));
  const sectionList = buildSectionList(parsed, input, source, relocation, owners, relocationGroups);
  rewriteSymbolTables(sectionList, source, owners);
  rewriteSectionReferences(sectionList, relocation);
  const shstrIndex = rebuildSectionNames(sectionList, parsed.shstrIndex);
  const buffer = serialize(input, parsed, sectionList, shstrIndex);
  const reparsed = parseRelocatable(buffer);
  const ownerBytes = owners.map((owner) => {
    const matches = reparsed.sections.filter((section) => section.name === owner.sectionName);
    if (matches.length !== 1 || matches[0].type !== SHT_PROGBITS || (matches[0].flags & 6) !== 6
        || matches[0].size !== owner.bytes) {
      fail(`serialized owner section shape drift: ${owner.sectionName}`);
    }
    return sectionBytes(buffer, matches[0]);
  });
  if (!Buffer.concat(ownerBytes).equals(sectionBytes(input, source))) {
    fail('serialized owner sections do not reproduce the compiler text bytes');
  }
  return {
    buffer,
    sourceSection: sourceSectionName,
    sourceBytes: source.size,
    owners: owners.map((owner) => ({ ...owner })),
    relocationSections: relocation
      ? owners.map((owner) => ({
        sectionName: `.rel${owner.sectionName}`,
        entries: relocationGroups.get(owner.sectionName).length / REL_BYTES,
      }))
      : [],
  };
}

module.exports = {
  splitRelocatableTextSection,
};
