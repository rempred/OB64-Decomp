#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  elfStructuralReport,
  elfSectionBytes,
  ensureDir,
  fail,
  hex,
  loadAcceptedModel,
  normalizePath,
  parseElfFile,
  readJson,
  renderLinkerScript,
  run,
  sha256Buffer,
  sha256File,
  verifyOutput,
  verifyRuntimeTools,
  writeJson,
} = require('./lib/phase7_conventional');

function usage() {
  console.log('Usage: node tools/build_phase7_conventional.js --output <empty-external-dir> --splat-output <verified-splat-dir> --splat-python <python.exe> --splat-split <split.py> --asm-differ <checkout> [--powershell-runtime-root <pinned-windows-runtime>]');
}

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) fail(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function parseArgs() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    process.exit(0);
  }
  return {
    output: value('--output'),
    splatOutput: value('--splat-output'),
    powershellRuntimeRoot: process.argv.includes('--powershell-runtime-root') ? value('--powershell-runtime-root') : null,
    splatPython: value('--splat-python'),
    splatSplit: value('--splat-split'),
    asmDifferRoot: value('--asm-differ'),
  };
}

function assertExternalEmptyOutput(args) {
  const rootLower = ROOT.toLowerCase();
  if (args.output.toLowerCase().startsWith(`${rootLower}${path.sep}`) || args.output.toLowerCase() === rootLower) fail('build output must remain outside the integration repository');
  if (args.splatOutput.toLowerCase().startsWith(`${rootLower}${path.sep}`) || args.splatOutput.toLowerCase() === rootLower) fail('Splat output must remain outside the integration repository');
  if (path.dirname(args.output).toLowerCase() !== path.dirname(args.splatOutput).toLowerCase()) fail('build and Splat outputs must be sibling directories for path-independent inputs');
  if (fs.existsSync(args.output) && fs.readdirSync(args.output).length !== 0) fail('build output directory must be absent or empty');
  ensureDir(args.output);
}

function verifySplatOutput(model, splatOutput) {
  const commandFile = path.join(splatOutput, 'splat-command.json');
  const romFile = path.join(splatOutput, 'baserom.us_rev0.z64');
  const linkerFile = path.join(splatOutput, 'build', 'ob64_us_rev0_phase5b.ld');
  for (const file of [commandFile, romFile, linkerFile]) if (!fs.existsSync(file)) fail(`Splat output is incomplete: ${file}`);
  const command = readJson(commandFile);
  if (command.exitCode !== 0) fail('recorded Splat command did not succeed');
  const rom = fs.readFileSync(romFile);
  if (rom.length !== model.config.rom.bytes || sha256Buffer(rom) !== model.config.rom.sha256) fail('Splat ROM identity drift');
  let representedBytes = 0;
  for (const row of model.rows) {
    const asset = path.join(splatOutput, 'assets', `${row.name}.bin`);
    if (!fs.existsSync(asset) || fs.statSync(asset).size !== row.bytes) fail(`Splat asset is missing or sized incorrectly: ${row.name}`);
    representedBytes += row.bytes;
  }
  if (representedBytes !== model.config.rom.bytes) fail('Splat asset conservation drift');
  return {
    rows: model.rows.length,
    representedBytes,
    romSha256: sha256Buffer(rom),
    linkerInputSha256: sha256File(linkerFile),
  };
}

function escapeRegex(valueToEscape) {
  return valueToEscape.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderSectionDirective(slice) {
  return [
    `.section ${slice.sectionName},"a",@progbits`,
    '.balign 1',
  ];
}

const ANCILLARY_REMOVAL_FLAGS = ['--remove-section=.reginfo', '--remove-section=.pdr', '--remove-section=.comment', '--remove-section=.note'];

function transformTrackedPart(row) {
  const part = row.part;
  const sourceFile = path.join(ROOT, part.file.replace(/\//g, path.sep));
  const sourceBuffer = fs.readFileSync(sourceFile);
  if (sourceBuffer.length !== part.textBytes || sha256Buffer(sourceBuffer) !== part.sha256) fail(`tracked assembly source drift: ${part.file}`);
  const source = sourceBuffer.toString('utf8');
  const lines = source.split(/\r?\n/);
  const textLines = lines.map((line, index) => ({ line, index })).filter(({ line }) => /^\s*\.text\s*(?:#.*)?$/.test(line));
  if (textLines.length !== 1 || lines.some((line) => /^\s*\.section\b/.test(line))) fail(`tracked assembly section grammar drift: ${part.file}`);
  const wordDirective = /^\s*\/\*\s*0x[0-9A-Fa-f]{8}\s+0x[0-9A-Fa-f]{8}\s+0x[0-9A-Fa-f]{8}\s*\*\/\s*\.word\s+/;
  const wordLines = lines.map((line, index) => ({ line, index })).filter(({ line }) => wordDirective.test(line));
  if (wordLines.length * 4 !== row.bytes) fail(`tracked assembly word count drift: ${part.file}`);
  const cutOffsets = new Map(row.slices.slice(1).map((slice) => [slice.romStart - row.romStart, slice]));
  for (const [offset] of cutOffsets) {
    if (offset % 4 !== 0 || offset <= 0 || offset >= row.bytes) fail(`unaligned tracked assembly link cut: ${part.file}`);
    const currentWord = wordLines[offset / 4];
    const priorWord = wordLines[offset / 4 - 1];
    const between = lines.slice(priorWord.index + 1, currentWord.index);
    if (between.some((line) => /^\s*[A-Za-z_.$][A-Za-z0-9_.$]*\s*:/.test(line))) fail(`tracked label crosses a link-only slice: ${part.file}`);
  }

  const hasOwnerLabel = new RegExp(`^\\s*${escapeRegex(part.name)}\\s*:`, 'm').test(source);
  const output = [];
  let wordIndex = 0;
  let activeSlice = row.slices[0];
  for (const line of lines) {
    if (/^\s*\.text\s*(?:#.*)?$/.test(line)) {
      output.push(
        ...renderSectionDirective(activeSlice),
        `.globl ${part.name}`,
        `.type ${part.name}, @${row.slices[0].executable ? 'function' : 'object'}`,
      );
      if (!hasOwnerLabel) output.push(`${part.name}:`);
      continue;
    }
    if (wordDirective.test(line)) {
      const byteOffset = wordIndex * 4;
      const nextSlice = cutOffsets.get(byteOffset);
      if (nextSlice) {
        activeSlice = nextSlice;
        output.push('', ...renderSectionDirective(activeSlice), `.globl __ob64_row_${String(row.index).padStart(4, '0')}_slice_${activeSlice.sliceIndex}`, `__ob64_row_${String(row.index).padStart(4, '0')}_slice_${activeSlice.sliceIndex}:`);
      }
      wordIndex += 1;
    }
    output.push(line);
  }
  if (wordIndex * 4 !== row.bytes) fail(`tracked assembly transform lost bytes: ${part.file}`);
  return `${output.join('\n')}\n`;
}

function createAssemblyObjects(model, output, assembler, objcopy, assemblerFlags) {
  const generatedRoot = path.join(output, 'generated', 'assembly');
  const objectRoot = path.join(output, 'objects', 'assembly');
  ensureDir(generatedRoot);
  ensureDir(objectRoot);
  const rowsByChunk = new Map();
  for (const row of model.rows.filter((item) => item.inputKind === 'tracked-assembly')) {
    if (!rowsByChunk.has(row.part.chunkIndex)) rowsByChunk.set(row.part.chunkIndex, []);
    rowsByChunk.get(row.part.chunkIndex).push(row);
  }
  const objects = [];
  for (const [chunkIndex, chunk] of model.assemblyManifest.chunks.entries()) {
    const rows = rowsByChunk.get(chunkIndex) || [];
    if (rows.length !== chunk.parts.length) fail(`assembly chunk owner count drift: ${chunkIndex}`);
    const generatedFile = path.join(generatedRoot, `chunk_${String(chunkIndex).padStart(3, '0')}.s`);
    const objectFile = path.join(objectRoot, `chunk_${String(chunkIndex).padStart(3, '0')}.o`);
    const rawObjectFile = path.join(objectRoot, `chunk_${String(chunkIndex).padStart(3, '0')}.raw.o`);
    const source = [
      '/* GENERATED FILE. DO NOT EDIT. */',
      `/* Accepted tracked assembly chunk ${chunkIndex}. */`,
      '',
      ...rows.map(transformTrackedPart),
    ].join('\n');
    fs.writeFileSync(generatedFile, source);
    run(assembler, [...assemblerFlags, '-o', normalizePath(path.relative(output, rawObjectFile)), normalizePath(path.relative(output, generatedFile))], { cwd: output });
    const executableFlags = rows.flatMap((row) => row.slices.filter((slice) => slice.executable).flatMap((slice) => [
      '--set-section-flags',
      `${slice.sectionName}=alloc,load,code,readonly,data,contents`,
    ]));
    run(objcopy, [...ANCILLARY_REMOVAL_FLAGS, ...executableFlags, normalizePath(path.relative(output, rawObjectFile)), normalizePath(path.relative(output, objectFile))], { cwd: output });
    fs.unlinkSync(rawObjectFile);
    objects.push(objectFile);
  }
  return objects;
}

function createDataObjects(model, output, splatOutput, assembler, objcopy, assemblerFlags) {
  const generatedRoot = path.join(output, 'generated', 'data');
  const objectRoot = path.join(output, 'objects', 'data');
  ensureDir(generatedRoot);
  ensureDir(objectRoot);
  const rows = model.rows.filter((item) => item.inputKind === 'splat-data');
  const shardSize = 128;
  const objects = [];
  for (let offset = 0, shardIndex = 0; offset < rows.length; offset += shardSize, shardIndex += 1) {
    const shardRows = rows.slice(offset, offset + shardSize);
    const generatedFile = path.join(generatedRoot, `data_${String(shardIndex).padStart(3, '0')}.s`);
    const objectFile = path.join(objectRoot, `data_${String(shardIndex).padStart(3, '0')}.o`);
    const rawObjectFile = path.join(objectRoot, `data_${String(shardIndex).padStart(3, '0')}.raw.o`);
    const lines = ['/* GENERATED FILE. DO NOT EDIT. */', '.set noat', '.set noreorder', ''];
    for (const row of shardRows) {
      const asset = path.join(splatOutput, 'assets', `${row.name}.bin`);
      const assetBytes = fs.readFileSync(asset);
      for (const slice of row.slices) {
        const symbol = slice.sliceIndex === 0
          ? `__ob64_data_owner_r${String(row.index).padStart(4, '0')}`
          : `__ob64_data_owner_r${String(row.index).padStart(4, '0')}_slice_${slice.sliceIndex}`;
        const assetOffset = slice.romStart - row.romStart;
        const sliceBytes = assetBytes.subarray(assetOffset, assetOffset + slice.bytes);
        if (sliceBytes.length !== slice.bytes) fail(`Splat asset slice exceeds its owner: ${row.name}`);
        lines.push(
          ...renderSectionDirective(slice),
          `.globl ${symbol}`,
          `${symbol}:`,
        );
        for (let byteOffset = 0; byteOffset < sliceBytes.length; byteOffset += 32) {
          lines.push(`.byte ${[...sliceBytes.subarray(byteOffset, byteOffset + 32)]
            .map((value) => `0x${value.toString(16).toUpperCase().padStart(2, '0')}`).join(', ')}`);
        }
        lines.push('');
      }
    }
    fs.writeFileSync(generatedFile, `${lines.join('\n')}\n`);
    run(assembler, [...assemblerFlags, '-o', normalizePath(path.relative(output, rawObjectFile)), normalizePath(path.relative(output, generatedFile))], { cwd: output });
    run(objcopy, [...ANCILLARY_REMOVAL_FLAGS, normalizePath(path.relative(output, rawObjectFile)), normalizePath(path.relative(output, objectFile))], { cwd: output });
    fs.unlinkSync(rawObjectFile);
    objects.push(objectFile);
  }
  return objects;
}

function createOverlayBssObjects(model, output, assembler, objcopy, assemblerFlags) {
  const generatedRoot = path.join(output, 'generated', 'bss');
  const objectRoot = path.join(output, 'objects', 'bss');
  ensureDir(generatedRoot);
  ensureDir(objectRoot);
  const generatedFile = path.join(generatedRoot, 'overlay_bss.s');
  const objectFile = path.join(objectRoot, 'overlay_bss.o');
  const rawObjectFile = path.join(objectRoot, 'overlay_bss.raw.o');
  const lines = ['/* GENERATED FILE. DO NOT EDIT. */', '.set noat', '.set noreorder', ''];
  for (const overlay of model.overlays.filter((row) => row.bss_end_exclusive > row.bss_start)) {
    const id = String(overlay.descriptor_id).padStart(2, '0');
    const name = `.ob64.overlay${id}.bss`;
    lines.push(
      `.section ${name},"aw",@nobits`,
      '.balign 1',
      `.space ${overlay.bss_end_exclusive - overlay.bss_start}`,
      '',
    );
  }
  fs.writeFileSync(generatedFile, `${lines.join('\n')}\n`);
  run(assembler, [...assemblerFlags, '-o', normalizePath(path.relative(output, rawObjectFile)), normalizePath(path.relative(output, generatedFile))], { cwd: output });
  run(objcopy, [...ANCILLARY_REMOVAL_FLAGS, normalizePath(path.relative(output, rawObjectFile)), normalizePath(path.relative(output, objectFile))], { cwd: output });
  fs.unlinkSync(rawObjectFile);
  return [objectFile];
}

function verifyObjectSections(model, objects, splatOutput) {
  const sections = new Map();
  for (const object of objects) {
    const elf = parseElfFile(object);
    for (const section of elf.sections.filter((item) => /^\.ob64\.r\d{4}(?:\.s\d+)?$/.test(item.name))) {
      if (sections.has(section.name)) fail(`object section repeats: ${section.name}`);
      sections.set(section.name, { elf, section, object: normalizePath(path.basename(object)) });
    }
  }
  if (sections.size !== model.slices.length) fail(`object section census drift: ${sections.size}`);
  let verifiedBytes = 0;
  for (const row of model.rows) {
    const buffers = row.slices.map((slice) => {
      const record = sections.get(slice.sectionName);
      if (!record || record.section.size !== slice.bytes) fail(`object section size drift: ${slice.sectionName}`);
      return Buffer.from(elfSectionBytes(record.elf, record.section));
    });
    const actual = Buffer.concat(buffers);
    const asset = fs.readFileSync(path.join(splatOutput, 'assets', `${row.name}.bin`));
    if (actual.length !== row.bytes || !actual.equals(asset)) fail(`object bytes differ from accepted Splat asset: ${row.name}`);
    verifiedBytes += actual.length;
  }
  if (verifiedBytes !== model.config.rom.bytes) fail('object-byte conservation drift');
  return { objectCount: objects.length, sectionCount: sections.size, verifiedOwners: model.rows.length, verifiedBytes };
}

function writeObjectManifest(output, objects) {
  const manifestFile = path.join(output, 'objects', 'manifest.json');
  const manifest = {
    schemaVersion: 1,
    generator: 'tools/build_phase7_conventional.js',
    objects: objects.map((object) => ({
      path: normalizePath(path.relative(output, object)),
      bytes: fs.statSync(object).size,
      sha256: sha256File(object),
    })),
  };
  writeJson(manifestFile, manifest);
  return { path: normalizePath(path.relative(output, manifestFile)), bytes: fs.statSync(manifestFile).size, sha256: sha256File(manifestFile) };
}

function writeLayout(model, output) {
  const layout = {
    schemaVersion: 1,
    generator: 'tools/build_phase7_conventional.js',
    rows: model.rows.length,
    slices: model.slices.length,
    representedBytes: model.config.rom.bytes,
    nonDescriptorLoadSlabs: model.nonDescriptorLoadSlabs.map((slab) => ({
      id: slab.id,
      kind: slab.kind,
      romStart: slab.romStart,
      romEndExclusive: slab.romEndExclusive,
      vramStart: slab.vramStart,
      vramEndExclusive: slab.vramEndExclusive,
      executableRanges: slab.executableRanges.map((range) => ({
        id: range.id,
        romStart: range.romStart,
        romEndExclusive: range.romEndExclusive,
      })),
    })),
    owners: model.rows.map((row) => ({
      index: row.index,
      primaryId: row.primaryId,
      name: row.name,
      inputKind: row.inputKind,
      assemblySymbol: row.part ? row.part.name : null,
      romStart: row.romStart,
      romEndExclusive: row.romEndExclusive,
      bytes: row.bytes,
      slices: row.slices.map((slice) => ({
        sectionName: slice.sectionName,
        romStart: slice.romStart,
        romEndExclusive: slice.romEndExclusive,
        vramStart: slice.vramStart,
        vramEndExclusive: slice.vramEndExclusive,
        placementKind: slice.placementKind,
        overlayDescriptorId: slice.overlayDescriptorId,
        loadSlabId: slice.loadSlabId,
        overlaySection: slice.overlaySection,
        executable: slice.executable,
        executableRangeId: slice.executableRangeId,
      })),
    })),
    overlays: model.overlays.map((overlay) => ({
      descriptorId: overlay.descriptor_id,
      romStart: overlay.rom_start,
      romEndExclusive: overlay.rom_end_exclusive,
      vramStart: overlay.vram_start,
      vramEndExclusive: overlay.vram_end_exclusive,
      textStart: overlay.text_start,
      textEndExclusive: overlay.text_end_exclusive,
      dataStart: overlay.data_rodata_start,
      dataEndExclusive: overlay.data_rodata_end_exclusive,
      bssStart: overlay.bss_start,
      bssEndExclusive: overlay.bss_end_exclusive,
    })),
  };
  writeJson(path.join(output, 'layout.json'), layout);
}

function link(model, output, objects, tools) {
  const linkerRoot = path.join(output, 'linker');
  ensureDir(linkerRoot);
  const linkerScript = path.join(linkerRoot, 'phase7.ld');
  const responseFile = path.join(linkerRoot, 'objects.rsp');
  fs.writeFileSync(linkerScript, renderLinkerScript(model));
  fs.writeFileSync(responseFile, `${objects.map((object) => normalizePath(path.relative(output, object))).join('\n')}\n`);
  const elfFile = path.join(output, 'phase7.elf');
  const mapFile = path.join(output, 'phase7.map');
  const flags = model.config.binutils.linkerFlags;
  run(tools['mips-kmc-elf-ld.exe'].path, [...flags, `-Map=${normalizePath(path.relative(output, mapFile))}`, '-T', normalizePath(path.relative(output, linkerScript)), '-o', normalizePath(path.relative(output, elfFile)), `@${normalizePath(path.relative(output, responseFile))}`], { cwd: output, maxBuffer: 256 * 1024 * 1024 });
  const romFile = path.join(output, 'phase7.us_rev0.z64');
  const overlayBssRemovalFlags = model.overlays
    .filter((overlay) => overlay.bss_end_exclusive > overlay.bss_start)
    .map((overlay) => `--remove-section=.ob64.overlay${String(overlay.descriptor_id).padStart(2, '0')}.bss`);
  const emptyDefaultRemovalFlags = ['--remove-section=.text', '--remove-section=.data', '--remove-section=.bss'];
  run(tools['mips-kmc-elf-objcopy.exe'].path, ['-O', 'binary', ...overlayBssRemovalFlags, ...emptyDefaultRemovalFlags, normalizePath(path.relative(output, elfFile)), normalizePath(path.relative(output, romFile))], { cwd: output });
  const elfReportFile = path.join(output, 'phase7.elf-report.json');
  writeJson(elfReportFile, elfStructuralReport(parseElfFile(elfFile)));
  return { linkerScript, responseFile, elfFile, elfReportFile, mapFile, romFile };
}

function pathIndependentRuntime(runtime) {
  return {
    tools: Object.fromEntries(Object.entries(runtime.tools).map(([name, record]) => [name, { bytes: record.bytes, sha256: record.sha256 }])),
    host: runtime.host,
    splat: runtime.splat,
    asmDiffer: runtime.asmDiffer,
  };
}

function main() {
  const args = parseArgs();
  assertExternalEmptyOutput(args);
  const model = loadAcceptedModel();
  const runtime = verifyRuntimeTools(model, args);
  const splat = verifySplatOutput(model, args.splatOutput);
  const assembler = runtime.tools['mips-kmc-elf-as.exe'].path;
  const objcopy = runtime.tools['mips-kmc-elf-objcopy.exe'].path;
  const assemblyObjects = createAssemblyObjects(model, args.output, assembler, objcopy, model.config.binutils.assemblerFlags);
  const dataObjects = createDataObjects(model, args.output, args.splatOutput, assembler, objcopy, model.config.binutils.assemblerFlags);
  const bssObjects = createOverlayBssObjects(model, args.output, assembler, objcopy, model.config.binutils.assemblerFlags);
  const objects = [...assemblyObjects, ...dataObjects, ...bssObjects];
  const objectVerification = verifyObjectSections(model, objects, args.splatOutput);
  const objectManifest = writeObjectManifest(args.output, objects);
  writeLayout(model, args.output);
  const linked = link(model, args.output, objects, runtime.tools);
  const verification = verifyOutput(model, {
    output: args.output,
    asmDifferRoot: args.asmDifferRoot,
    splatPython: args.splatPython,
    objdump: runtime.tools['mips-kmc-elf-objdump.exe'].path,
  });
  const phase6 = readJson(path.join(ROOT, 'docs', 'external-intake', 'phase6-kmc-reproduction-20260801', 'reproduction-manifest.json'));
  const report = {
    schemaVersion: 1,
    status: 'pass',
    generator: 'tools/build_phase7_conventional.js',
    acceptedInputs: model.inputFiles,
    runtime: pathIndependentRuntime(runtime),
    compilerPin: {
      sourceCommit: phase6.compiler.commit,
      executableSha256: phase6.compiler.executableSha256,
      compileFlags: phase6.compiler.compileFlags,
      usedInAssemblyOnlyBuild: false,
    },
    splat,
    objects: {
      assemblyObjects: assemblyObjects.length,
      dataObjects: dataObjects.length,
      bssObjects: bssObjects.length,
      ...objectVerification,
      manifest: objectManifest,
    },
    linker: {
      flags: model.config.binutils.linkerFlags,
      scriptSha256: sha256File(linked.linkerScript),
      responseSha256: sha256File(linked.responseFile),
      elfReportSha256: sha256File(linked.elfReportFile),
    },
    verification,
  };
  writeJson(path.join(args.output, 'build-report.json'), report);
  console.log(`Phase 7 conventional build: PASS (${verification.outputs.rom.sha256})`);
  console.log(`ELF: ${linked.elfFile}`);
  console.log(`Map: ${linked.mapFile}`);
  console.log(`ROM: ${linked.romFile}`);
}

main();
