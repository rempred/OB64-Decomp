'use strict';

const ELF_HEADER_BYTES = 52;
const SECTION_HEADER_BYTES = 40;
const SYMBOL_BYTES = 16;
const REL_BYTES = 8;
const SHT_NULL = 0;
const SHT_PROGBITS = 1;
const SHT_SYMTAB = 2;
const SHT_STRTAB = 3;
const SHT_NOBITS = 8;
const SHT_REL = 9;
const STB_GLOBAL = 1;
const STT_FUNC = 2;
const STT_SECTION = 3;
const SHN_LORESERVE = 0xff00;
const R_MIPS_HI16 = 5;
const R_MIPS_LO16 = 6;
const OUTPUT_SECTION = /^\.ob64\.r[0-9]+(?:\.s[0-9]+)?$/;
const SAFE_SYMBOL = /^[A-Za-z_.$][A-Za-z0-9_.$]*$/;

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

// Complete compiler functions and physical owners are separate partitions.
// This opt-in contract never changes compiler bytes or function sizes.
function validateCompilerFunctionPartition(functions, bytes, primarySymbol) {
  if (!Array.isArray(functions) || functions.length === 0
      || !Number.isSafeInteger(bytes) || bytes <= 0 || bytes % 4) fail('compiler function partition is malformed');
  // Shared by native projection and cached-object reconstruction. Without a
  // registry-bound composed-owner contract, the neutral tag cannot enter here.
  if (functions.some(fn => fn?.entryEvidence === 'reviewed-local-body')) {
    fail('reviewed local body composition across physical owners is unsupported');
  }
  let cursor = 0;
  const names = new Set();
  for (const [index, fn] of functions.entries()) {
    if (!fn || typeof fn.symbol !== 'string' || !SAFE_SYMBOL.test(fn.symbol) || names.has(fn.symbol)
        || fn.offset !== `0x${cursor.toString(16).toUpperCase().padStart(8, '0')}`
        || fn.offsetNumber !== cursor || !Number.isSafeInteger(fn.bytes) || fn.bytes <= 0 || fn.bytes % 4
        || (index === 0 ? fn.symbol !== primarySymbol || fn.binding !== 'GLOBAL' || fn.entryEvidence !== 'owner'
          : fn.binding !== 'LOCAL' || !['internal-call-only', 'fixed-address-call'].includes(fn.entryEvidence))) {
      fail('compiler function partition drift');
    }
    names.add(fn.symbol);
    cursor += fn.bytes;
    if (!Number.isSafeInteger(cursor) || cursor > bytes) fail('compiler function partition exceeds owner span');
  }
  if (cursor !== bytes) fail('compiler function partition does not cover owner span');
  return functions;
}

function verifySplitCompilerFunctions(input, parsed, source, owners, functions, projected) {
  if (!functions) return;
  const tables = parsed.sections.filter(section => section.type === SHT_SYMTAB);
  if (tables.length !== 1) fail('compiler function symbol table census');
  const table = { ...tables[0], data: sectionBytes(input, tables[0]) };
  const strings = parsed.sections[table.link];
  if (!strings) fail('compiler function string table is missing');
  const symbols = symbolRecords(table, { ...strings, data: sectionBytes(input, strings) });
  const sections = projected ? owners.map(owner => {
    const matches = parsed.sections.filter(section => section.name === owner.sectionName);
    if (matches.length !== 1) fail('compiler function owner section census');
    return matches[0];
  }) : [source];
  const markers = new Set(owners.slice(1).map(owner => owner.symbol));
  if (functions.some(fn => markers.has(fn.symbol))) fail('compiler function collides with physical boundary symbol');
  if (!projected && symbols.some(symbol => markers.has(symbol.name))) fail('raw object already contains physical boundary symbol');
  if (projected) verifyOwnerBoundarySymbols(input, parsed, owners);
  const actual = symbols.filter(symbol => symbol.type === STT_FUNC
    && sections.some(section => section.index === symbol.sectionIndex)
    && !(projected && markers.has(symbol.name)));
  if (actual.length !== functions.length) fail('complete compiler function census drift');
  for (const fn of functions) {
    const owner = ownerForOffset(owners, fn.offsetNumber);
    const section = projected ? sections[owners.indexOf(owner)] : source;
    const matches = symbols.filter(symbol => symbol.name === fn.symbol);
    if (matches.length !== 1 || !actual.includes(matches[0])
        || matches[0].sectionIndex !== section.index
        || matches[0].value !== fn.offsetNumber - (projected ? owner.logicalOffset : 0)
        || matches[0].size !== fn.bytes || matches[0].binding !== (fn.binding === 'GLOBAL' ? 1 : 0)
        || matches[0].visibility !== 0) fail('compiler function projection drift');
  }
}

function normalizeOwners(owners, sourceSectionBytes, compilerFunctions = null, singleNativeOwner = false) {
  if (!Array.isArray(owners) || (singleNativeOwner ? owners.length !== 1 : owners.length < 2)) fail('owner list must contain at least two sections unless explicitly single-native');
  const names = new Set();
  const symbols = new Set();
  let logicalOffset = 0;
  const normalized = owners.map((owner, index) => {
    const hasSymbol = Object.prototype.hasOwnProperty.call(owner || {}, 'symbol');
    const hasSymbolSize = Object.prototype.hasOwnProperty.call(owner || {}, 'symbolSize');
    if (!owner || typeof owner !== 'object' || Array.isArray(owner)
        || Object.keys(owner).some((key) => !['sectionName', 'bytes', 'symbol', 'symbolSize'].includes(key))
        || typeof owner.sectionName !== 'string' || !OUTPUT_SECTION.test(owner.sectionName)
        || names.has(owner.sectionName)
        || !Number.isInteger(owner.bytes) || owner.bytes <= 0 || owner.bytes % 4 !== 0
        || hasSymbol !== hasSymbolSize
        || (hasSymbol && (typeof owner.symbol !== 'string' || !SAFE_SYMBOL.test(owner.symbol)
          || symbols.has(owner.symbol) || !Number.isInteger(owner.symbolSize) || owner.symbolSize < 0))) {
      fail(`owner record ${index} is malformed or duplicated`);
    }
    names.add(owner.sectionName);
    if (hasSymbol) symbols.add(owner.symbol);
    const record = {
      sectionName: owner.sectionName,
      bytes: owner.bytes,
      logicalOffset,
      logicalEnd: logicalOffset + owner.bytes,
      ...(hasSymbol ? { symbol: owner.symbol, symbolSize: owner.symbolSize } : {}),
    };
    logicalOffset += owner.bytes;
    return record;
  });
  if (logicalOffset !== sourceSectionBytes) fail('owner byte census does not equal the compiler text section');
  if (compilerFunctions) {
    if (compilerFunctions.length < 2 || !normalized.every(owner => owner.symbol)) fail('composed compiler census requires complete owner symbols');
    validateCompilerFunctionPartition(compilerFunctions, sourceSectionBytes, normalized[0].symbol);
    if (compilerFunctions.some(fn => normalized.slice(1).some(owner => owner.symbol === fn.symbol))) {
      fail('compiler function collides with physical boundary symbol');
    }
  }
  const symbolizedOwners = normalized.filter((owner) => owner.symbol);
  if (symbolizedOwners.length !== 0 && symbolizedOwners.length !== normalized.length) {
    fail('owner boundary symbols must be specified for the complete owner census');
  }
  if (symbolizedOwners.length > 0
      && (normalized[0].symbolSize !== (compilerFunctions ? compilerFunctions[0].bytes : sourceSectionBytes)
        || normalized.slice(1).some((owner) => owner.symbolSize !== 0))) {
    fail('owner boundary symbol sizes do not preserve the logical function and continuation contract');
  }
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
  // GNU 2.6 may emit HI16, its delay-slot LO16, then an earlier R_MIPS_26.
  // Relocation order is semantic: retain the native subsequence for each owner.
  const places = new Set();
  for (let offset = 0; offset < bytes.length; offset += REL_BYTES) {
    const relocationOffset = bytes.readUInt32BE(offset);
    const info = bytes.readUInt32BE(offset + 4);
    if (relocationOffset % 4 !== 0 || places.has(relocationOffset)) fail('text relocation place is unaligned or duplicated');
    places.add(relocationOffset);
    const owner = ownerForOffset(owners, relocationOffset);
    if (relocationOffset + 4 > owner.logicalEnd) fail('text relocation exceeds its accepted owner');
    const symbolIndex = info >>> 8;
    const type = info & 0xff;
    if (![2, 4, R_MIPS_HI16, R_MIPS_LO16].includes(type)) fail('unsupported text relocation type');
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
          alignment: owner.alignment || original.alignment,
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

function symbolRecords(symbolTable, stringTable) {
  if (symbolTable.entrySize !== SYMBOL_BYTES || symbolTable.data.length % SYMBOL_BYTES !== 0
      || stringTable.type !== SHT_STRTAB || stringTable.data.length === 0 || stringTable.data[0] !== 0) {
    fail('owner boundary symbol table is malformed');
  }
  const records = [];
  for (let offset = 0; offset < symbolTable.data.length; offset += SYMBOL_BYTES) {
    records.push({
      offset,
      name: readCString(stringTable.data, symbolTable.data.readUInt32BE(offset)),
      value: symbolTable.data.readUInt32BE(offset + 4),
      size: symbolTable.data.readUInt32BE(offset + 8),
      binding: symbolTable.data[offset + 12] >> 4,
      visibility: symbolTable.data[offset + 13],
      type: symbolTable.data[offset + 12] & 0xf,
      sectionIndex: symbolTable.data.readUInt16BE(offset + 14),
    });
  }
  return records;
}

function preserveOwnerBoundarySymbols(sectionList, owners) {
  if (!owners[0].symbol) return;
  const symbolTables = sectionList.sections.filter((section) => section.type === SHT_SYMTAB);
  if (symbolTables.length !== 1) fail('owner boundary symbol table does not resolve uniquely');
  const symbolTable = symbolTables[0];
  const stringTable = sectionList.sections[symbolTable.link];
  if (!stringTable) fail('owner boundary symbol string table is missing');
  const records = symbolRecords(symbolTable, stringTable);
  if (!Number.isInteger(symbolTable.info) || symbolTable.info <= 0 || symbolTable.info > records.length) {
    fail('owner boundary symbol table local/global census is malformed');
  }
  for (const [ownerIndex, owner] of owners.entries()) {
    const ownerSection = sectionList.ownerSections.get(owner.sectionName);
    const matches = records.filter((record) => record.name === owner.symbol);
    if (ownerIndex === 0) {
      if (matches.length !== 1 || matches[0].value !== 0 || matches[0].size !== owner.symbolSize
          || matches[0].binding !== STB_GLOBAL || matches[0].type !== STT_FUNC || matches[0].visibility !== 0
          || matches[0].sectionIndex !== ownerSection.index) {
        fail('logical function symbol does not match the first accepted owner');
      }
      continue;
    }
    if (matches.length !== 0) fail(`continuation owner symbol already exists: ${owner.symbol}`);
    const nameOffset = stringTable.data.length;
    stringTable.data = Buffer.concat([stringTable.data, Buffer.from(`${owner.symbol}\0`, 'utf8')]);
    const encoded = Buffer.alloc(SYMBOL_BYTES);
    encoded.writeUInt32BE(nameOffset, 0);
    encoded.writeUInt32BE(0, 4);
    encoded.writeUInt32BE(owner.symbolSize, 8);
    encoded[12] = (STB_GLOBAL << 4) | STT_FUNC;
    encoded[13] = 0;
    encoded.writeUInt16BE(ownerSection.index, 14);
    symbolTable.data = Buffer.concat([symbolTable.data, encoded]);
    records.push({
      offset: symbolTable.data.length - SYMBOL_BYTES,
      name: owner.symbol,
      value: 0,
      size: owner.symbolSize,
      binding: STB_GLOBAL,
      type: STT_FUNC,
      sectionIndex: ownerSection.index,
    });
  }
}

function verifyOwnerBoundarySymbols(input, parsed, owners) {
  if (!owners[0].symbol) return;
  const symbolTables = parsed.sections.filter((section) => section.type === SHT_SYMTAB);
  if (symbolTables.length !== 1) fail('serialized owner boundary symbol table does not resolve uniquely');
  const symbolTable = { ...symbolTables[0], data: sectionBytes(input, symbolTables[0]) };
  const linkedStringTable = parsed.sections[symbolTable.link];
  if (!linkedStringTable) fail('serialized owner boundary symbol string table is missing');
  const stringTable = { ...linkedStringTable, data: sectionBytes(input, linkedStringTable) };
  const records = symbolRecords(symbolTable, stringTable);
  for (const owner of owners) {
    const section = parsed.sections.find((candidate) => candidate.name === owner.sectionName);
    const matches = records.filter((record) => record.name === owner.symbol);
    if (!section || matches.length !== 1 || matches[0].value !== 0 || matches[0].size !== owner.symbolSize
        || matches[0].binding !== STB_GLOBAL || matches[0].type !== STT_FUNC || matches[0].visibility !== 0
        || matches[0].sectionIndex !== section.index) {
      fail(`serialized owner boundary symbol drift: ${owner.symbol}`);
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

function splitRelocatableTextSection(input, sourceSectionName, requestedOwners, compilerFunctions = null) {
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
  const owners = normalizeOwners(requestedOwners, source.size, compilerFunctions);
  verifySplitCompilerFunctions(input, parsed, source, owners, compilerFunctions, false);
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
  preserveOwnerBoundarySymbols(sectionList, owners);
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
  verifyOwnerBoundarySymbols(buffer, reparsed, owners);
  verifySplitCompilerFunctions(buffer, reparsed, source, owners, compilerFunctions, true);
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
  parseRelocatable, sectionBytes, buildSectionList, rewriteSymbolTables, rewriteSectionReferences, rebuildSectionNames, serialize,
  validateCompilerFunctionPartition,
  splitRelocatableTextSection,
  projectNativeTextOwners,
};

// Separate from the legacy continuation contract: compiler public symbols already
// exist and must retain their sizes. Only ELF placement metadata is projected.
function projectNativeTextOwners(input, requestedOwners, admission = null) {
  if (admission !== null && admission !== 'native-text-readonly-single-owner-projection') fail('native owner admission');
  const parsed = parseRelocatable(input);
  const matches = parsed.sections.filter(section => section.name === '.text');
  if (matches.length !== 1) fail('native text section census');
  const source = matches[0];
  if (source.type !== SHT_PROGBITS || source.flags !== 6 || source.address !== 0
      || source.size <= 0 || source.size % 4 || source.alignment < 4
      || (source.alignment & (source.alignment - 1))) fail('native text section shape');
  const owners = normalizeOwners(requestedOwners, source.size, null, admission !== null);
  if (owners.some(owner => owner.symbol || parsed.sections.some(section => section.name === owner.sectionName))) {
    fail('native projection cannot synthesize symbols or replace existing sections');
  }
  for (const owner of owners) {
    let alignment = source.alignment;
    while (owner.logicalOffset % alignment) alignment /= 2;
    owner.alignment = alignment;
  }
  const rels = parsed.sections.filter(section => section.info === source.index && [4, 9].includes(section.type));
  if (rels.length > 1 || (rels.length && (rels[0].name !== '.rel.text'
      || rels[0].type !== SHT_REL || rels[0].entrySize !== REL_BYTES))) fail('native relocation section shape');
  const relocation = rels[0] || null;
  if (relocation) {
    const bytes = sectionBytes(input, relocation);
    for (let index = 0; index < bytes.length; index += REL_BYTES) {
      const offset = bytes.readUInt32BE(index), type = bytes.readUInt32BE(index + 4) & 255;
      const owner = ownerForOffset(owners, offset);
      if (offset % 4 || offset + 4 > owner.logicalEnd || ![4, 5, 6].includes(type)) {
        fail('native relocation width, place or type');
      }
    }
  }
  const groups = relocation ? splitRelocations(sectionBytes(input, relocation), owners)
    : new Map(owners.map(owner => [owner.sectionName, Buffer.alloc(0)]));
  const list = buildSectionList(parsed, input, source, relocation, owners, groups);
  rewriteSymbolTables(list, source, owners);
  rewriteSectionReferences(list, relocation);
  const shstr = rebuildSectionNames(list, parsed.shstrIndex);
  const buffer = serialize(input, parsed, list, shstr);
  const result = parseRelocatable(buffer);
  const bytes = owners.map(owner => sectionBytes(buffer, result.sections.find(section => section.name === owner.sectionName)));
  if (!Buffer.concat(bytes).equals(sectionBytes(input, source))) fail('native projection changed text bytes');
  return { buffer, sourceSection: '.text', sourceBytes: source.size, owners,
    relocationSections: owners.map(owner => ({ sectionName: '.rel' + owner.sectionName,
      entries: groups.get(owner.sectionName).length / REL_BYTES })) };
}
// Append only: preserve existing file offsets and byte ranges, including opaque metadata.
function appendPhysicalInterface(input, descriptor) {
  const parsed=parseRelocatable(input);
  if(!descriptor || descriptor.schemaVersion!==1 || descriptor.kind!=='registered-primary-physical-interface'
      || !SAFE_SYMBOL.test(descriptor.symbol) || descriptor.symbol===descriptor.primary || descriptor.offset!==0 || descriptor.bytes!==0
      || descriptor.binding!==STB_GLOBAL || descriptor.symbolType!==STT_FUNC || descriptor.visibility!==0)fail('physical interface descriptor');
  const sections=parsed.sections;
  // Only pinned-native payload/ancillary tables whose symbol-index semantics are
  // handled here. REL is the only supported consumer of the appended SYMTAB.
  const supportedTypes=new Set([0,1,SHT_SYMTAB,3,7,SHT_NOBITS,SHT_REL,0x70000006]);
  for(const s of sections){
    if(!supportedTypes.has(s.type) || (s.type===0 && s.index!==0)
        || (![SHT_SYMTAB,SHT_REL].includes(s.type) && (s.link!==0 || s.info!==0))
        || (s.type===0x70000006 && (s.size!==24 || s.entrySize!==1 || s.flags!==2))
        || (s.type===7 && (s.flags!==0 || s.entrySize!==0)))fail('physical interface unsupported section shape');
  }
  const tabs=sections.filter(s=>s.type===SHT_SYMTAB);
  if(tabs.length!==1)fail('physical interface sole SYMTAB required');
  const tab=tabs[0],str=sections[tab.link];
  if(tab.entrySize!==SYMBOL_BYTES || tab.size%SYMBOL_BYTES || !str || str.type!==3 || str.index===parsed.shstrIndex
      || sections.some(s=>s.index!==tab.index&&s.link===str.index))fail('physical interface exclusive symbol STRtab required');
  const shnames=sectionBytes(input,sections[parsed.shstrIndex]);
  const bodies=sections.filter(s=>readCString(shnames,s.nameOffset)===descriptor.sectionName);
  if(bodies.length!==1 || bodies[0].type!==1 || bodies[0].flags!==6 || bodies[0].address!==0)fail('physical interface body section');
  const body=bodies[0],strings=sectionBytes(input,str),symbols=sectionBytes(input,tab),count=tab.size/SYMBOL_BYTES;
  if(tab.info<1||tab.info>count||strings[0]!==0)fail('physical interface symbol boundary');
  if(count<1 || symbols.subarray(0,SYMBOL_BYTES).some(b=>b!==0))fail('physical interface null symbol');
  const ranges=sections.filter(s=>s.index!==0&&s.type!==SHT_NOBITS&&s.size>0).map(s=>({start:s.offset,end:s.offset+s.size}));
  ranges.push({start:0,end:ELF_HEADER_BYTES},{start:parsed.sectionOffset,end:parsed.sectionOffset+parsed.sectionCount*SECTION_HEADER_BYTES});
  ranges.sort((a,b)=>a.start-b.start);for(let i=1;i<ranges.length;i++)if(ranges[i].start<ranges[i-1].end)fail('physical interface overlapping native ranges');
  let primary=0;
  for(let i=0;i<count;i++){
    const o=i*SYMBOL_BYTES,name=readCString(strings,symbols.readUInt32BE(o)),binding=symbols[o+12]>>>4;
    if((i<tab.info)!==(binding===0)||binding>2)fail('physical interface local/global boundary');
    if(name===descriptor.symbol)fail('physical interface native symbol collision');
    if(name===descriptor.primary){primary++;if(symbols.readUInt32BE(o+4)!==0||symbols.readUInt32BE(o+8)<=0||symbols[o+12]!==0x12||symbols[o+13]!==0||symbols.readUInt16BE(o+14)!==body.index)fail('physical interface native primary');}
  }
  if(primary!==1)fail('physical interface native primary census');
  for(const rel of sections.filter(s=>s.type===SHT_REL)){
    if(rel.link!==tab.index||rel.entrySize!==REL_BYTES||rel.size%REL_BYTES||sections[rel.info]?.type!==1)fail('physical interface REL contract');
    const data=sectionBytes(input,rel);for(let o=0;o<data.length;o+=REL_BYTES)if(data.readUInt32BE(o+4)>>>8>=count)fail('physical interface REL symbol index');
  }
  const record=Buffer.alloc(SYMBOL_BYTES);record.writeUInt32BE(strings.length,0);record[12]=0x12;record.writeUInt16BE(body.index,14);
  const symOffset=alignUp(input.length,Math.max(4,tab.alignment||1)),symBytes=Buffer.concat([symbols,record]);
  const strOffset=alignUp(symOffset+symBytes.length,str.alignment||1),strBytes=Buffer.concat([strings,Buffer.from(descriptor.symbol+'\0')]);
  const output=Buffer.alloc(strOffset+strBytes.length);input.copy(output);symBytes.copy(output,symOffset);strBytes.copy(output,strOffset);
  for(const [s,offset,size]of [[tab,symOffset,symBytes.length],[str,strOffset,strBytes.length]]){const h=parsed.sectionOffset+s.index*SECTION_HEADER_BYTES;output.writeUInt32BE(offset,h+16);output.writeUInt32BE(size,h+20);}
  const rebuilt=parseRelocatable(output);
  for(const s of sections){const got=rebuilt.sections[s.index];if(s.index!==tab.index&&s.index!==str.index&&!sectionBytes(output,got).equals(sectionBytes(input,s)))fail('physical interface payload conservation');}
  // All original bytes except the four required sh_offset/sh_size words survive.
  const restored=Buffer.from(output.subarray(0,input.length));for(const s of [tab,str]){const h=parsed.sectionOffset+s.index*SECTION_HEADER_BYTES;input.copy(restored,h+16,h+16,h+24);}
  if(!restored.equals(input))fail('physical interface original file conservation');
  return {buffer:output,nativeSymbolCount:count,interfaceSymbolIndex:count};
}
module.exports.appendPhysicalInterface=appendPhysicalInterface;
