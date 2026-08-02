'use strict';

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const CONFIG_PATH = path.join(ROOT, 'config', 'phase7', 'conventional-build.json');
const SHIM_TEXT = [
  '"""One-shot asm-differ compatibility shim.',
  '',
  'Phase 7 never enables watch mode. The pinned asm-differ imports watchdog',
  'unconditionally even though one-shot map and ELF comparisons do not use it.',
  '"""',
  '',
].join('\n');

function fail(message) {
  throw new Error(`Phase 7 conventional build failure: ${message}`);
}

function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

function sha256File(file) {
  return sha256Buffer(fs.readFileSync(file));
}

function hex(value, width = 8) {
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
}

function parseNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && /^0x/i.test(value)) return Number.parseInt(value, 16);
  return Number(value);
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function run(executable, args, options = {}) {
  const result = childProcess.spawnSync(executable, args, {
    cwd: options.cwd || ROOT,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: options.maxBuffer || 128 * 1024 * 1024,
    env: options.env || process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
    fail(`command exited ${result.status}: ${executable} ${args.join(' ')}\n${output}`);
  }
  return result;
}

function loadConfig() {
  const config = readJson(CONFIG_PATH);
  if (config.schemaVersion !== 1 || config.profile !== 'us-rev0') fail('Phase 7 configuration schema drift');
  return config;
}

function verifyAcceptedInputHashes(config) {
  const records = [];
  for (const [relative, expected] of Object.entries(config.acceptedInputSha256)) {
    const file = path.join(ROOT, relative.replace(/\//g, path.sep));
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail(`accepted input is missing: ${relative}`);
    const actual = sha256File(file);
    if (actual !== expected) fail(`accepted input SHA-256 drift: ${relative}`);
    records.push({ path: relative, bytes: fs.statSync(file).size, sha256: actual });
  }
  return records;
}

function sectionName(rowIndex, sliceIndex, sliceCount) {
  const base = `.ob64.r${String(rowIndex).padStart(4, '0')}`;
  return sliceCount === 1 ? base : `${base}.s${sliceIndex}`;
}

function symbolStem(section) {
  return section.replace(/^\./, '').replace(/[^A-Za-z0-9_]/g, '_');
}

function rangeKey(start, end) {
  return `${start}:${end}`;
}

function rangesIntersect(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function isTrackedWordDirective(line) {
  return /^\s*\/\*\s*0x[0-9A-Fa-f]{8}\s+0x[0-9A-Fa-f]{8}\s+0x[0-9A-Fa-f]{8}\s*\*\/\s*\.word\s+/.test(line);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function expectedAssemblySymbolAddress(row) {
  const romAddress = row.romStart + row.part.symbolByteOffset;
  const slice = row.slices.find((candidate) => romAddress >= candidate.romStart && romAddress < candidate.romEndExclusive);
  if (!slice) fail(`assembly-owner symbol falls outside its accepted slices: ${row.part.name}`);
  return slice.vramStart + (romAddress - slice.romStart);
}

function loadAcceptedModel() {
  const config = loadConfig();
  const inputFiles = verifyAcceptedInputHashes(config);
  const semantic = readJson(path.join(ROOT, 'config', 'splat', 'us_rev0.semantic.json'));
  const linkerInputs = readJson(path.join(ROOT, 'config', 'splat', 'us_rev0.overlay-linker-inputs.json'));
  const assemblyManifest = readJson(path.join(ROOT, 'asm', 'original', 'rev0', 'manifest.json'));
  const romProfile = readJson(path.join(ROOT, 'config', 'roms', 'us_rev0.json'));
  const overlays = linkerInputs.overlayReservations;

  if (semantic.schemaVersion !== 1 || semantic.rows.length !== config.expected.primaryRows) fail('accepted semantic row count drift');
  if (linkerInputs.schemaVersion !== 1 || linkerInputs.splatPrimaryRows.length !== semantic.rows.length) fail('accepted linker input schema drift');
  if (overlays.length !== config.expected.overlayReservations) fail('accepted overlay reservation count drift');
  if (!Array.isArray(assemblyManifest.chunks) || assemblyManifest.chunks.length !== 100) fail('tracked assembly manifest chunk drift');
  if (parseNumber(romProfile.sizeBytes) !== config.rom.bytes) fail('ROM profile size drift');

  const parts = [];
  for (const [chunkIndex, chunk] of assemblyManifest.chunks.entries()) {
    if (!Array.isArray(chunk.parts) || chunk.parts.length === 0) fail(`tracked assembly chunk has no parts: ${chunkIndex}`);
    for (const part of chunk.parts) {
      parts.push({
        ...part,
        chunkIndex,
        romStartNumber: parseNumber(part.romStart),
        romEndNumber: parseNumber(part.romEndExclusive),
      });
    }
  }
  if (parts.length !== config.expected.assemblyOwners) fail('tracked assembly owner count drift');
  const partByRange = new Map();
  for (const part of parts) {
    const key = rangeKey(part.romStartNumber, part.romEndNumber);
    if (partByRange.has(key)) fail(`duplicate tracked assembly range: ${key}`);
    if (!/^[A-Za-z_.$][A-Za-z0-9_.$]*$/.test(part.name)) fail(`unsafe tracked assembly symbol: ${part.name}`);
    const sourceFile = path.join(ROOT, part.file.replace(/\//g, path.sep));
    if (!fs.existsSync(sourceFile)) fail(`tracked assembly source is missing: ${part.file}`);
    const sourceBuffer = fs.readFileSync(sourceFile);
    if (sourceBuffer.length !== part.textBytes || sha256Buffer(sourceBuffer) !== part.sha256) fail(`tracked assembly source drift: ${part.file}`);
    const lines = sourceBuffer.toString('utf8').split(/\r?\n/);
    const labelPattern = new RegExp(`^\\s*${escapeRegex(part.name)}\\s*:`);
    const labelIndex = lines.findIndex((line) => labelPattern.test(line));
    const wordLines = lines.filter(isTrackedWordDirective);
    if (wordLines.length * 4 !== part.bytes) fail(`tracked assembly byte count drift: ${part.file}`);
    part.hasOwnerLabel = labelIndex >= 0;
    part.symbolByteOffset = labelIndex < 0 ? 0 : lines.slice(0, labelIndex).filter(isTrackedWordDirective).length * 4;
    if (part.symbolByteOffset < 0 || part.symbolByteOffset >= part.bytes) fail(`tracked assembly symbol offset drift: ${part.file}`);
    partByRange.set(key, part);
  }

  const rows = [];
  const slices = [];
  let cursor = 0;
  let assemblyOwners = 0;
  let dataOwners = 0;
  let splitOwners = 0;
  let rspRows = 0;
  const seenPartNames = new Set();

  for (const sourceRow of semantic.rows) {
    const row = { ...sourceRow };
    if (row.index !== rows.length || row.romStart !== cursor || row.romEndExclusive <= row.romStart || row.bytes !== row.romEndExclusive - row.romStart) {
      fail(`accepted owner conservation drift at row ${row.index}`);
    }
    cursor = row.romEndExclusive;
    if (row.processorClass === 'rsp') rspRows += 1;

    const insideAssembly = row.romStart >= config.rom.codeRegionStart && row.romEndExclusive <= config.rom.codeRegionEndExclusive;
    const intersectsAssembly = rangesIntersect(row.romStart, row.romEndExclusive, config.rom.codeRegionStart, config.rom.codeRegionEndExclusive);
    if (intersectsAssembly && !insideAssembly) fail(`accepted row crosses the assembly-region boundary: ${row.primaryId}`);
    let part = null;
    if (insideAssembly) {
      part = partByRange.get(rangeKey(row.romStart, row.romEndExclusive));
      if (!part) fail(`accepted assembly row has no exact tracked owner: ${row.primaryId}`);
      if (seenPartNames.has(part.name)) fail(`tracked assembly symbol repeats: ${part.name}`);
      seenPartNames.add(part.name);
      assemblyOwners += 1;
    } else {
      dataOwners += 1;
    }

    const cuts = new Set([row.romStart, row.romEndExclusive]);
    for (const overlay of overlays) {
      for (const boundary of [
        overlay.rom_start,
        overlay.text_rom_end_exclusive,
        overlay.data_rodata_rom_end_exclusive,
        overlay.rom_end_exclusive,
      ]) {
        if (boundary > row.romStart && boundary < row.romEndExclusive) cuts.add(boundary);
      }
    }
    const orderedCuts = [...cuts].sort((a, b) => a - b);
    if (orderedCuts.length > 2) splitOwners += 1;
    const rowSlices = [];
    for (let sliceIndex = 0; sliceIndex < orderedCuts.length - 1; sliceIndex += 1) {
      const romStart = orderedCuts[sliceIndex];
      const romEndExclusive = orderedCuts[sliceIndex + 1];
      const containing = overlays.filter((overlay) => romStart >= overlay.rom_start && romEndExclusive <= overlay.rom_end_exclusive);
      const partial = overlays.filter((overlay) => rangesIntersect(romStart, romEndExclusive, overlay.rom_start, overlay.rom_end_exclusive) && !containing.includes(overlay));
      if (partial.length || containing.length > 1) fail(`overlay placement is not unique for row ${row.index}, slice ${sliceIndex}`);

      let placementKind;
      let overlayDescriptorId = null;
      let vramStart;
      let overlaySection = null;
      if (containing.length === 1) {
        const overlay = containing[0];
        placementKind = 'overlay';
        overlayDescriptorId = overlay.descriptor_id;
        vramStart = overlay.vram_start + (romStart - overlay.rom_start);
        if (romEndExclusive <= overlay.text_rom_end_exclusive) overlaySection = 'text';
        else if (romStart >= overlay.data_rodata_rom_start && romEndExclusive <= overlay.data_rodata_rom_end_exclusive) overlaySection = 'data-rodata';
        else fail(`overlay text/data placement is incomplete for row ${row.index}, slice ${sliceIndex}`);
      } else if (romStart >= config.rom.codeRegionStart && romEndExclusive <= config.rom.earlyBootLinearEndExclusive) {
        placementKind = 'early-boot-linear';
        vramStart = config.rom.earlyBootLinearBase + romStart;
      } else {
        placementKind = 'rom-only';
        vramStart = romStart;
      }
      const executable = row.primaryClass === 'code' && row.processorClass !== 'rsp';
      const slice = {
        ordinal: slices.length,
        rowIndex: row.index,
        sliceIndex,
        sliceCount: orderedCuts.length - 1,
        sectionName: sectionName(row.index, sliceIndex, orderedCuts.length - 1),
        phdrName: `p${String(slices.length).padStart(5, '0')}`,
        romStart,
        romEndExclusive,
        bytes: romEndExclusive - romStart,
        vramStart,
        vramEndExclusive: vramStart + (romEndExclusive - romStart),
        placementKind,
        overlayDescriptorId,
        overlaySection,
        executable,
        inputKind: insideAssembly ? 'tracked-assembly' : 'splat-data',
        primaryId: row.primaryId,
        ownerName: row.name,
      };
      slices.push(slice);
      rowSlices.push(slice);
    }
    rows.push({ ...row, inputKind: insideAssembly ? 'tracked-assembly' : 'splat-data', part, slices: rowSlices });
  }

  if (cursor !== config.rom.bytes) fail('accepted owners do not cover the complete ROM');
  if (assemblyOwners !== config.expected.assemblyOwners || dataOwners !== config.expected.dataOwners) fail('accepted assembly/data owner census drift');
  if (slices.length !== config.expected.linkSlices || splitOwners !== config.expected.splitOwners) fail('accepted link-slice census drift');
  if (rspRows !== config.expected.rspRows) fail('accepted RSP row census drift');

  return {
    config,
    inputFiles,
    semantic,
    linkerInputs,
    assemblyManifest,
    romProfile,
    overlays,
    parts,
    rows,
    slices,
    counts: { assemblyOwners, dataOwners, splitOwners, rspRows },
  };
}

function parseElf32BigEndian(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 52 || buffer.subarray(0, 4).toString('hex') !== '7f454c46') fail('ELF magic is missing');
  if (buffer[4] !== 1 || buffer[5] !== 2) fail('ELF must be 32-bit big-endian');
  const u16 = (offset) => buffer.readUInt16BE(offset);
  const u32 = (offset) => buffer.readUInt32BE(offset);
  const header = {
    type: u16(16),
    machine: u16(18),
    entry: u32(24),
    phoff: u32(28),
    shoff: u32(32),
    flags: u32(36),
    ehsize: u16(40),
    phentsize: u16(42),
    phnum: u16(44),
    shentsize: u16(46),
    shnum: u16(48),
    shstrndx: u16(50),
  };
  const programTableShapeValid = (header.phnum === 0 && header.phentsize === 0) || header.phentsize === 32;
  if (header.machine !== 8 || header.shentsize !== 40 || !programTableShapeValid) fail('ELF machine or table shape drift');
  const rawSections = [];
  for (let index = 0; index < header.shnum; index += 1) {
    const offset = header.shoff + index * header.shentsize;
    if (offset + 40 > buffer.length) fail('ELF section table exceeds file');
    rawSections.push({
      index,
      nameOffset: u32(offset),
      type: u32(offset + 4),
      flags: u32(offset + 8),
      address: u32(offset + 12),
      offset: u32(offset + 16),
      size: u32(offset + 20),
      link: u32(offset + 24),
      info: u32(offset + 28),
      alignment: u32(offset + 32),
      entrySize: u32(offset + 36),
      headerOffset: offset,
    });
  }
  const stringSection = rawSections[header.shstrndx];
  if (!stringSection || stringSection.offset + stringSection.size > buffer.length) fail('ELF section-name table is invalid');
  const sectionNames = buffer.subarray(stringSection.offset, stringSection.offset + stringSection.size);
  function cString(table, offset) {
    if (offset < 0 || offset >= table.length) return '';
    const end = table.indexOf(0, offset);
    return table.subarray(offset, end < 0 ? table.length : end).toString('utf8');
  }
  const sections = rawSections.map((section) => ({ ...section, name: cString(sectionNames, section.nameOffset) }));
  const programHeaders = [];
  for (let index = 0; index < header.phnum; index += 1) {
    const offset = header.phoff + index * header.phentsize;
    if (offset + 32 > buffer.length) fail('ELF program-header table exceeds file');
    programHeaders.push({
      index,
      type: u32(offset),
      offset: u32(offset + 4),
      vaddr: u32(offset + 8),
      paddr: u32(offset + 12),
      fileSize: u32(offset + 16),
      memorySize: u32(offset + 20),
      flags: u32(offset + 24),
      alignment: u32(offset + 28),
    });
  }
  const symbols = [];
  for (const symbolSection of sections.filter((section) => section.type === 2)) {
    const strings = sections[symbolSection.link];
    if (!strings || strings.offset + strings.size > buffer.length || symbolSection.entrySize !== 16) fail('ELF symbol table is invalid');
    const stringBytes = buffer.subarray(strings.offset, strings.offset + strings.size);
    const count = symbolSection.size / symbolSection.entrySize;
    for (let index = 0; index < count; index += 1) {
      const offset = symbolSection.offset + index * 16;
      symbols.push({
        name: cString(stringBytes, u32(offset)),
        value: u32(offset + 4),
        size: u32(offset + 8),
        binding: buffer[offset + 12] >> 4,
        symbolType: buffer[offset + 12] & 0x0f,
        visibility: buffer[offset + 13],
        sectionIndex: u16(offset + 14),
      });
    }
  }
  return { buffer, header, sections, programHeaders, symbols };
}

function parseElfFile(file) {
  return parseElf32BigEndian(fs.readFileSync(file));
}

function elfSectionBytes(elf, section) {
  if (section.type === 8) return Buffer.alloc(section.size);
  if (section.offset + section.size > elf.buffer.length) fail(`ELF section bytes exceed file: ${section.name}`);
  return elf.buffer.subarray(section.offset, section.offset + section.size);
}

function renderLinkerScript(model) {
  const lines = [
    '/* GENERATED FILE. DO NOT EDIT. */',
    '/* Generated by tools/build_phase7_conventional.js from accepted Phase 5 inputs. */',
    'OUTPUT_FORMAT("elf32-bigmips")',
    'OUTPUT_ARCH(mips)',
    'ENTRY(boot_entry_clear_bss_and_jump)',
    '',
    'PHDRS',
    '{',
  ];
  for (const slice of model.slices) lines.push(`  ${slice.phdrName} PT_LOAD FLAGS(${slice.executable ? 5 : 4});`);
  for (const overlay of model.overlays.filter((row) => row.bss_end_exclusive > row.bss_start)) {
    lines.push(`  b${String(overlay.descriptor_id).padStart(2, '0')} PT_LOAD FLAGS(6);`);
  }
  lines.push('}', '', 'SECTIONS', '{');
  for (const overlay of model.overlays) {
    const stem = `__ob64_overlay_${String(overlay.descriptor_id).padStart(2, '0')}`;
    lines.push(
      `  ${stem}_rom_start = ${hex(overlay.rom_start)};`,
      `  ${stem}_rom_end = ${hex(overlay.rom_end_exclusive)};`,
      `  ${stem}_vram_start = ${hex(overlay.vram_start)};`,
      `  ${stem}_vram_end = ${hex(overlay.vram_end_exclusive)};`,
      `  ${stem}_text_start = ${hex(overlay.text_start)};`,
      `  ${stem}_text_end = ${hex(overlay.text_end_exclusive)};`,
      `  ${stem}_data_start = ${hex(overlay.data_rodata_start)};`,
      `  ${stem}_data_end = ${hex(overlay.data_rodata_end_exclusive)};`,
      `  ${stem}_bss_start = ${hex(overlay.bss_start)};`,
      `  ${stem}_bss_end = ${hex(overlay.bss_end_exclusive)};`,
    );
  }
  lines.push('');
  for (const slice of model.slices) {
    const stem = `__${symbolStem(slice.sectionName)}`;
    lines.push(
      `  ${slice.sectionName} ${hex(slice.vramStart)} : AT(${hex(slice.romStart)})`,
      '  {',
      `    ${stem}_vram_start = .;`,
      `    KEEP(*(${slice.sectionName}))`,
      `    ${stem}_vram_end = .;`,
      `  } :${slice.phdrName}`,
      `  ${stem}_rom_start = LOADADDR(${slice.sectionName});`,
      `  ${stem}_rom_end = LOADADDR(${slice.sectionName}) + SIZEOF(${slice.sectionName});`,
      `  ASSERT(ADDR(${slice.sectionName}) == ${hex(slice.vramStart)}, "${slice.sectionName} VRAM drift")`,
      `  ASSERT(LOADADDR(${slice.sectionName}) == ${hex(slice.romStart)}, "${slice.sectionName} ROM drift")`,
      `  ASSERT(SIZEOF(${slice.sectionName}) == ${hex(slice.bytes)}, "${slice.sectionName} size drift")`,
      '',
    );
  }
  for (const overlay of model.overlays.filter((row) => row.bss_end_exclusive > row.bss_start)) {
    const id = String(overlay.descriptor_id).padStart(2, '0');
    const name = `.ob64.overlay${id}.bss`;
    lines.push(
      `  ${name} ${hex(overlay.bss_start)} (NOLOAD) : AT(${hex(overlay.bss_start)})`,
      '  {',
      `    __ob64_overlay_${id}_bss_section_start = .;`,
      `    . += ${hex(overlay.bss_end_exclusive - overlay.bss_start)};`,
      `    __ob64_overlay_${id}_bss_section_end = .;`,
      `  } :b${id}`,
      `  ASSERT(SIZEOF(${name}) == ${hex(overlay.bss_end_exclusive - overlay.bss_start)}, "overlay ${id} BSS size drift")`,
      '',
    );
  }
  lines.push(
    `  __ob64_rom_end = ${hex(model.config.rom.bytes)};`,
    '  /DISCARD/ :',
    '  {',
    '    *(.MIPS.abiflags)',
    '    *(.reginfo)',
    '    *(.pdr)',
    '    *(.gnu.attributes)',
    '    *(.comment)',
    '    *(.note*)',
    '  }',
    '}',
    '',
  );
  return lines.join('\n');
}

function verifyElfAgainstModel(model, elf) {
  if (elf.header.type !== 2 || elf.header.entry !== model.config.representativeSymbols[0].vramStart) fail('ELF type or entry point drift');
  const bySection = new Map();
  for (const section of elf.sections) {
    if (!bySection.has(section.name)) bySection.set(section.name, []);
    bySection.get(section.name).push(section);
  }
  const loadHeaders = elf.programHeaders.filter((header) => header.type === 1);
  let representedBytes = 0;
  for (const slice of model.slices) {
    const candidates = bySection.get(slice.sectionName) || [];
    if (candidates.length !== 1) fail(`ELF section count drift: ${slice.sectionName}`);
    const section = candidates[0];
    if (section.type !== 1 || (section.flags & 2) === 0) fail(`ELF section type drift: ${slice.sectionName}`);
    if (section.address !== slice.vramStart) fail(`ELF section VRAM placement drift: ${slice.sectionName}`);
    if (section.size !== slice.bytes) fail(`ELF section size drift: ${slice.sectionName}`);
    if (Boolean(section.flags & 4) !== slice.executable) fail(`ELF section execution flag drift: ${slice.sectionName}`);
    const headers = loadHeaders.filter((header) => header.vaddr === slice.vramStart && header.paddr === slice.romStart && header.fileSize === slice.bytes && header.memorySize === slice.bytes);
    if (headers.length !== 1) fail(`ELF load address drift: ${slice.sectionName}`);
    representedBytes += slice.bytes;
  }
  if (representedBytes !== model.config.rom.bytes) fail('ELF represented-byte total drift');

  const symbolsByName = new Map();
  for (const symbol of elf.symbols) {
    if (!symbolsByName.has(symbol.name)) symbolsByName.set(symbol.name, []);
    symbolsByName.get(symbol.name).push(symbol);
  }
  for (const row of model.rows.filter((item) => item.inputKind === 'tracked-assembly')) {
    const candidates = (symbolsByName.get(row.part.name) || []).filter((symbol) => symbol.sectionIndex !== 0);
    if (candidates.length !== 1 || candidates[0].value !== expectedAssemblySymbolAddress(row) || candidates[0].binding !== 1) {
      fail(`ELF assembly-owner symbol drift: ${row.part.name}`);
    }
  }
  for (const representative of model.config.representativeSymbols) {
    const candidates = (symbolsByName.get(representative.name) || []).filter((symbol) => symbol.sectionIndex !== 0);
    if (candidates.length !== 1 || candidates[0].value !== representative.vramStart) fail(`representative ELF symbol drift: ${representative.name}`);
  }
  for (const overlay of model.overlays) {
    const id = String(overlay.descriptor_id).padStart(2, '0');
    const expected = {
      [`__ob64_overlay_${id}_rom_start`]: overlay.rom_start,
      [`__ob64_overlay_${id}_rom_end`]: overlay.rom_end_exclusive,
      [`__ob64_overlay_${id}_vram_start`]: overlay.vram_start,
      [`__ob64_overlay_${id}_vram_end`]: overlay.vram_end_exclusive,
      [`__ob64_overlay_${id}_text_start`]: overlay.text_start,
      [`__ob64_overlay_${id}_text_end`]: overlay.text_end_exclusive,
      [`__ob64_overlay_${id}_data_start`]: overlay.data_rodata_start,
      [`__ob64_overlay_${id}_data_end`]: overlay.data_rodata_end_exclusive,
      [`__ob64_overlay_${id}_bss_start`]: overlay.bss_start,
      [`__ob64_overlay_${id}_bss_end`]: overlay.bss_end_exclusive,
    };
    for (const [name, value] of Object.entries(expected)) {
      const candidates = symbolsByName.get(name) || [];
      if (candidates.length !== 1 || candidates[0].value !== value) fail(`overlay ELF symbol drift: ${name}`);
    }
    if (overlay.bss_end_exclusive > overlay.bss_start) {
      const sectionNameValue = `.ob64.overlay${id}.bss`;
      const candidates = bySection.get(sectionNameValue) || [];
      if (candidates.length !== 1 || candidates[0].type !== 8 || candidates[0].address !== overlay.bss_start || candidates[0].size !== overlay.bss_end_exclusive - overlay.bss_start) {
        fail(`overlay BSS section drift: ${id}`);
      }
      const bssBytes = overlay.bss_end_exclusive - overlay.bss_start;
      const bssHeaders = loadHeaders.filter((header) => (
        header.vaddr === overlay.bss_start
        && header.paddr === overlay.bss_start
        && header.fileSize === 0
        && header.memorySize === bssBytes
        && header.flags === 6
      ));
      if (bssHeaders.length !== 1) fail(`overlay BSS load-header drift: ${id}`);
    }
  }
  const expectedLoadHeaders = model.slices.length + model.overlays.filter((overlay) => overlay.bss_end_exclusive > overlay.bss_start).length;
  if (loadHeaders.length !== expectedLoadHeaders) fail(`ELF load-header count drift: ${loadHeaders.length}`);
  return { representedBytes, loadHeaderCount: loadHeaders.length, symbolCount: elf.symbols.length };
}

function verifyMap(model, mapText) {
  if (!mapText.includes('Linker script and memory map')) fail('GNU linker map header is missing');
  for (const representative of model.config.representativeSymbols) {
    if (!new RegExp(`(?:^|\\s)${representative.name}(?:\\s|$)`, 'm').test(mapText)) fail(`linker map symbol is missing: ${representative.name}`);
  }
  for (const overlay of model.overlays) {
    const id = String(overlay.descriptor_id).padStart(2, '0');
    if (!mapText.includes(`__ob64_overlay_${id}_vram_start`)) fail(`linker map overlay symbols are missing: ${id}`);
  }
  const sectionMentions = (mapText.match(/^\.ob64\.r\d{4}(?:\.s\d+)?/gm) || []).length;
  if (sectionMentions !== model.slices.length) fail(`linker map section count drift: ${sectionMentions}`);
  return { sectionMentions };
}

function verifyRom(model, rom) {
  if (rom.length !== model.config.rom.bytes) fail(`linked ROM size drift: ${rom.length}`);
  const romSha256 = sha256Buffer(rom);
  if (romSha256 !== model.config.rom.sha256) fail(`linked ROM SHA-256 drift: ${romSha256}`);
  const code = rom.subarray(model.config.rom.codeRegionStart, model.config.rom.codeRegionEndExclusive);
  const codeSha256 = sha256Buffer(code);
  if (codeSha256 !== model.config.rom.codeRegionSha256) fail(`linked code-region SHA-256 drift: ${codeSha256}`);
  return { romSha256, codeSha256, bytes: rom.length };
}

function verifyToolFile(file, expected, label) {
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) fail(`${label} is missing: ${file}`);
  const actual = sha256File(file);
  if (actual !== expected) fail(`${label} SHA-256 drift`);
  return { bytes: fs.statSync(file).size, sha256: actual };
}

function gitHead(repository) {
  return run('git', ['-C', repository, 'rev-parse', 'HEAD']).stdout.trim();
}

function verifyRuntimeTools(model, options) {
  const config = model.config;
  const toolchainConfig = readJson(path.join(ROOT, 'config', 'toolchain.json'));
  const binRoot = path.resolve(ROOT, toolchainConfig.localRoot, 'bin');
  const tools = {};
  for (const [name, expected] of Object.entries(config.binutils.tools)) {
    const file = path.join(binRoot, name);
    tools[name] = { path: file, ...verifyToolFile(file, expected, name) };
  }
  const nodeIdentity = verifyToolFile(process.execPath, config.host.nodeExeSha256, 'Node executable');
  if (process.version !== config.host.nodeVersion || os.platform() !== config.host.platform || os.release() !== config.host.release || os.arch() !== config.host.architecture) {
    fail('host runtime identity drift');
  }
  const pythonIdentity = verifyToolFile(options.splatPython, config.splat.pythonExeSha256, 'Splat Python executable');
  const splitIdentity = verifyToolFile(options.splatSplit, config.splat.splitPySha256, 'Splat split.py');
  const pythonVersion = run(options.splatPython, ['--version']).stdout.trim() || run(options.splatPython, ['--version']).stderr.trim();
  if (pythonVersion !== config.splat.pythonVersion) fail('Splat Python version drift');
  const asmDifferHead = gitHead(options.asmDifferRoot);
  if (asmDifferHead !== config.asmDiffer.commit) fail('asm-differ commit drift');
  const diffIdentity = verifyToolFile(path.join(options.asmDifferRoot, 'diff.py'), config.asmDiffer.diffPySha256, 'asm-differ diff.py');
  verifyToolFile(path.join(options.asmDifferRoot, 'pyproject.toml'), config.asmDiffer.pyprojectSha256, 'asm-differ pyproject');
  verifyToolFile(path.join(options.asmDifferRoot, 'LICENSE'), config.asmDiffer.licenseSha256, 'asm-differ license');
  const powerShell = path.join(process.env.WINDIR || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
  const powerShellIdentity = verifyToolFile(powerShell, config.host.powershellExeSha256, 'Windows PowerShell executable');
  const powerShellVersion = run(powerShell, ['-NoProfile', '-NonInteractive', '-Command', '$PSVersionTable.PSVersion.ToString()']).stdout.trim();
  if (powerShellVersion !== config.host.powershellVersion) fail('Windows PowerShell version drift');
  return {
    binRoot,
    tools,
    host: {
      platform: os.platform(),
      release: os.release(),
      version: os.version(),
      architecture: os.arch(),
      nodeVersion: process.version,
      nodeExeSha256: nodeIdentity.sha256,
      powershellVersion: powerShellVersion,
      powershellExeSha256: powerShellIdentity.sha256,
    },
    splat: { pythonVersion, pythonExeSha256: pythonIdentity.sha256, splitPySha256: splitIdentity.sha256 },
    asmDiffer: { commit: asmDifferHead, diffPySha256: diffIdentity.sha256 },
  };
}

function parseJsonOutput(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${label} did not emit JSON: ${error.message}`);
  }
}

function validateAsmDifferJson(value, label) {
  if (!value || !Array.isArray(value.rows) || value.rows.length === 0 || value.max_score <= 0 || value.current_score !== 0) {
    fail(`${label} did not produce a nonempty exact-match disassembly`);
  }
}

function runAsmDifferProof(model, options) {
  const output = path.resolve(options.output);
  const proofRoot = path.join(output, 'asm-differ-proof');
  ensureDir(proofRoot);
  const shim = path.join(proofRoot, 'watchdog.py');
  fs.writeFileSync(shim, SHIM_TEXT);
  const objdump = options.objdump;
  const diff = path.join(options.asmDifferRoot, 'diff.py');
  const results = [];
  for (const representative of model.config.representativeSymbols) {
    const row = model.rows[representative.rowIndex];
    if (!row || row.romStart !== representative.romStart || row.slices[0].vramStart !== representative.vramStart) fail(`asm-differ representative input drift: ${representative.name}`);
    const safeName = representative.name.replace(/[^A-Za-z0-9_]/g, '_');
    const mapRoot = path.join(proofRoot, `${safeName}-map`);
    const elfRoot = path.join(proofRoot, `${safeName}-elf`);
    ensureDir(mapRoot);
    ensureDir(elfRoot);
    fs.copyFileSync(shim, path.join(mapRoot, 'watchdog.py'));
    fs.copyFileSync(shim, path.join(elfRoot, 'watchdog.py'));
    const common = [
      'def apply(config, args):',
      `    config["objdump_executable"] = ${JSON.stringify(objdump)}`,
      '    config["arch"] = "mips"',
      '    config["map_format"] = "gnu"',
      '    config["show_line_numbers_default"] = False',
    ];
    fs.writeFileSync(path.join(mapRoot, 'diff_settings.py'), `${common.join('\n')}\n    config["baseimg"] = "../../phase7.us_rev0.z64"\n    config["myimg"] = "../../phase7.us_rev0.z64"\n    config["mapfile"] = "../../phase7.map"\n`);
    const assemblyObject = `../../objects/assembly/chunk_${String(row.part.chunkIndex).padStart(3, '0')}.o`;
    fs.writeFileSync(path.join(elfRoot, 'diff_settings.py'), `${common.join('\n')}\n    config["baseimg"] = ${JSON.stringify(assemblyObject)}\n    config["myimg"] = ${JSON.stringify(assemblyObject)}\n    config["mapfile"] = "../../phase7.map"\n`);
    const envFor = (cwd) => ({ ...process.env, PYTHONPATH: cwd, PYTHONDONTWRITEBYTECODE: '1' });
    const mapArgs = [diff, representative.name, '--format', 'json', '--algorithm', 'difflib', '--no-line-numbers'];
    const mapResult = run(options.python, mapArgs, { cwd: mapRoot, env: envFor(mapRoot) });
    const mapJson = parseJsonOutput(mapResult.stdout, `asm-differ map proof for ${representative.name}`);
    validateAsmDifferJson(mapJson, `asm-differ map proof for ${representative.name}`);
    const mapOut = path.join(proofRoot, `${safeName}-map.json`);
    writeJson(mapOut, mapJson);
    const elfArgs = [diff, hex(row.part.symbolByteOffset), '-e', representative.name, '-j', row.slices[0].sectionName, '--format', 'json', '--algorithm', 'difflib', '--no-line-numbers'];
    const elfResult = run(options.python, elfArgs, { cwd: elfRoot, env: envFor(elfRoot) });
    const elfJson = parseJsonOutput(elfResult.stdout, `asm-differ ELF proof for ${representative.name}`);
    validateAsmDifferJson(elfJson, `asm-differ ELF proof for ${representative.name}`);
    const elfOut = path.join(proofRoot, `${safeName}-elf.json`);
    writeJson(elfOut, elfJson);
    results.push({
      symbol: representative.name,
      rowIndex: representative.rowIndex,
      romStart: representative.romStart,
      vramStart: representative.vramStart,
      sectionName: row.slices[0].sectionName,
      elfObject: normalizePath(assemblyObject.replace(/^\.\.\/\.\.\//, '')),
      elfObjectSha256: sha256File(path.join(output, assemblyObject.replace(/^\.\.\/\.\.\//, ''))),
      mapRows: mapJson.rows.length,
      elfRows: elfJson.rows.length,
      mapOutputSha256: sha256File(mapOut),
      elfOutputSha256: sha256File(elfOut),
    });
  }
  return { shimSha256: sha256File(shim), results };
}

function verifyOutput(model, options) {
  const output = path.resolve(options.output);
  const elfFile = path.join(output, 'phase7.elf');
  const mapFile = path.join(output, 'phase7.map');
  const romFile = path.join(output, 'phase7.us_rev0.z64');
  const layoutFile = path.join(output, 'layout.json');
  for (const file of [elfFile, mapFile, romFile, layoutFile]) if (!fs.existsSync(file)) fail(`build output is missing: ${file}`);
  const layout = readJson(layoutFile);
  if (layout.schemaVersion !== 1 || layout.rows !== model.rows.length || layout.slices !== model.slices.length || layout.representedBytes !== model.config.rom.bytes) fail('external layout summary drift');
  const elf = parseElfFile(elfFile);
  const elfResult = verifyElfAgainstModel(model, elf);
  const mapResult = verifyMap(model, fs.readFileSync(mapFile, 'utf8'));
  const romResult = verifyRom(model, fs.readFileSync(romFile));
  const asmDiffer = runAsmDifferProof(model, {
    output,
    asmDifferRoot: options.asmDifferRoot,
    python: options.splatPython,
    objdump: options.objdump,
  });
  return {
    schemaVersion: 1,
    status: 'pass',
    counts: {
      primaryRows: model.rows.length,
      assemblyOwners: model.counts.assemblyOwners,
      dataOwners: model.counts.dataOwners,
      linkSlices: model.slices.length,
      splitOwners: model.counts.splitOwners,
      overlayReservations: model.overlays.length,
      representedBytes: elfResult.representedBytes,
      loadHeaders: elfResult.loadHeaderCount,
      symbols: elfResult.symbolCount,
      mapSections: mapResult.sectionMentions,
    },
    outputs: {
      elf: { bytes: fs.statSync(elfFile).size, sha256: sha256File(elfFile) },
      map: { bytes: fs.statSync(mapFile).size, sha256: sha256File(mapFile) },
      rom: { bytes: romResult.bytes, sha256: romResult.romSha256 },
      codeRegionSha256: romResult.codeSha256,
      layout: { bytes: fs.statSync(layoutFile).size, sha256: sha256File(layoutFile) },
    },
    asmDiffer,
  };
}

module.exports = {
  CONFIG_PATH,
  ROOT,
  SHIM_TEXT,
  elfSectionBytes,
  ensureDir,
  fail,
  hex,
  loadAcceptedModel,
  normalizePath,
  parseElf32BigEndian,
  parseElfFile,
  readJson,
  renderLinkerScript,
  run,
  runAsmDifferProof,
  sha256Buffer,
  sha256File,
  verifyElfAgainstModel,
  verifyMap,
  verifyOutput,
  verifyRom,
  verifyRuntimeTools,
  writeJson,
};
