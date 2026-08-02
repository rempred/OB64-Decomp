'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  SHIM_TEXT,
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
  verifyElfAgainstModel,
  verifyMap,
  verifyRom,
  verifyRuntimeTools,
  writeJson,
} = require('./phase7_conventional');

const CONFIG_PATH = path.join(ROOT, 'config', 'phase8', 'matching-c.json');

function parseNumber(value, label) {
  if (Number.isInteger(value)) return value;
  if (typeof value === 'string' && /^0x[0-9a-f]+$/i.test(value)) return Number.parseInt(value.slice(2), 16);
  fail(`${label} is not an integer or hexadecimal string`);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function safeRelative(relative, label) {
  const normalized = normalizePath(relative);
  if (!normalized || path.isAbsolute(relative) || normalized === '..' || normalized.startsWith('../') || normalized.includes('/../')) {
    fail(`${label} is not a safe relative path: ${relative}`);
  }
  return normalized;
}

function resolveRelative(root, relative, label) {
  return path.join(root, ...safeRelative(relative, label).split('/'));
}

function loadPhase8Model() {
  const model = loadAcceptedModel();
  const config = readJson(CONFIG_PATH);
  if (config.schemaVersion !== 1 || config.profile !== model.config.profile) fail('Phase 8 configuration schema or profile drift');

  const target = {
    ...config.target,
    romStartNumber: parseNumber(config.target.romStart, 'target ROM start'),
    romEndNumber: parseNumber(config.target.romEndExclusive, 'target ROM end'),
    vramStartNumber: parseNumber(config.target.vramStart, 'target VRAM start'),
  };
  if (target.romEndNumber - target.romStartNumber !== target.bytes) fail('Phase 8 target range size drift');
  const row = model.rows[target.rowIndex];
  if (!row
      || row.primaryId !== target.primaryId
      || row.romStart !== target.romStartNumber
      || row.romEndExclusive !== target.romEndNumber
      || row.bytes !== target.bytes
      || row.inputKind !== 'tracked-assembly'
      || row.part.name !== target.symbol
      || row.part.chunkIndex !== target.chunkIndex
      || row.part.file !== target.originalAssembly
      || row.part.sha256 !== target.originalAssemblySha256
      || row.slices.length !== 1
      || row.slices[0].sectionName !== target.sectionName
      || row.slices[0].vramStart !== target.vramStartNumber
      || row.slices[0].overlayDescriptorId !== target.overlayDescriptorId
      || !row.slices[0].executable) {
    fail('Phase 8 target no longer matches the accepted Phase 5/7 owner model');
  }

  const sourceFile = resolveRelative(ROOT, target.source, 'target source');
  const originalAssembly = resolveRelative(ROOT, target.originalAssembly, 'original assembly');
  if (!fs.existsSync(sourceFile) || sha256File(sourceFile) !== target.sourceSha256) fail('Phase 8 C source identity drift');
  if (!fs.existsSync(originalAssembly) || sha256File(originalAssembly) !== target.originalAssemblySha256) fail('Phase 8 original assembly identity drift');

  const phase6ManifestFile = resolveRelative(ROOT, config.compiler.manifest, 'compiler manifest');
  if (!fs.existsSync(phase6ManifestFile) || sha256File(phase6ManifestFile) !== config.compiler.manifestSha256) fail('accepted Phase 6 compiler manifest drift');
  const phase6Manifest = readJson(phase6ManifestFile);
  if (phase6Manifest.schemaVersion !== 1
      || phase6Manifest.compiler.executableSha256 !== config.compiler.executableSha256
      || !sameJson(phase6Manifest.compiler.compileFlags, config.compiler.compileFlags)) {
    fail('Phase 8 compiler contract differs from the accepted Phase 6 contract');
  }

  const overlayConfig = readJson(path.join(ROOT, 'config', 'overlays', 'us_rev0.json'));
  const descriptor = overlayConfig.descriptors.find((item) => item.id === target.overlayDescriptorId);
  if (!descriptor || descriptor.rawSha256 !== target.descriptorRawSha256) fail('Phase 8 target overlay descriptor identity drift');

  return { config, descriptor, model, phase6Manifest, row, target };
}

function isInside(candidate, root) {
  const resolvedCandidate = path.resolve(candidate).toLowerCase();
  const resolvedRoot = path.resolve(root).toLowerCase();
  return resolvedCandidate === resolvedRoot || resolvedCandidate.startsWith(`${resolvedRoot}${path.sep}`);
}

function assertBuildLocations(output, phase7Output) {
  if (isInside(output, ROOT)) fail('Phase 8 build output must remain outside the integration repository');
  if (isInside(phase7Output, ROOT)) fail('Phase 7 input must remain outside the integration repository');
  if (path.resolve(output).toLowerCase() === path.resolve(phase7Output).toLowerCase()) fail('Phase 7 and Phase 8 outputs must differ');
  if (fs.existsSync(output) && fs.readdirSync(output).length !== 0) fail('Phase 8 build output must be absent or empty');
  ensureDir(output);
}

function verifyCompiler(phase8, compiler) {
  const resolved = path.resolve(compiler);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) fail(`KMC compiler is missing: ${resolved}`);
  const hash = sha256File(resolved);
  if (hash !== phase8.config.compiler.executableSha256) fail('KMC compiler executable SHA-256 drift');
  return {
    bytes: fs.statSync(resolved).size,
    sha256: hash,
    sourceCommit: phase8.phase6Manifest.compiler.commit,
    sourceTree: phase8.phase6Manifest.compiler.tree,
    target: phase8.phase6Manifest.compiler.target,
    abi: phase8.phase6Manifest.compiler.abi,
    endianness: phase8.phase6Manifest.compiler.endianness,
    isa: phase8.phase6Manifest.compiler.isa,
    compileFlags: phase8.config.compiler.compileFlags,
  };
}

function verifyPhase7Input(phase8, phase7Output) {
  const files = {
    elf: path.join(phase7Output, 'phase7.elf'),
    map: path.join(phase7Output, 'phase7.map'),
    rom: path.join(phase7Output, 'phase7.us_rev0.z64'),
    layout: path.join(phase7Output, 'layout.json'),
    report: path.join(phase7Output, 'build-report.json'),
    objectManifest: path.join(phase7Output, 'objects', 'manifest.json'),
    linkerScript: path.join(phase7Output, 'linker', 'phase7.ld'),
  };
  for (const file of Object.values(files)) if (!fs.existsSync(file)) fail(`Phase 7 input is incomplete: ${file}`);

  verifyElfAgainstModel(phase8.model, parseElfFile(files.elf));
  verifyMap(phase8.model, fs.readFileSync(files.map, 'utf8'));
  const romResult = verifyRom(phase8.model, fs.readFileSync(files.rom));
  const report = readJson(files.report);
  if (report.schemaVersion !== 1 || report.status !== 'pass') fail('Phase 7 input build report did not pass');
  const expectedOutputs = {
    elf: sha256File(files.elf),
    map: sha256File(files.map),
    rom: sha256File(files.rom),
    layout: sha256File(files.layout),
  };
  for (const [name, hash] of Object.entries(expectedOutputs)) {
    if (report.verification.outputs[name].sha256 !== hash) fail(`Phase 7 recorded ${name} identity drift`);
  }
  const renderedLinker = Buffer.from(renderLinkerScript(phase8.model), 'utf8');
  if (!fs.readFileSync(files.linkerScript).equals(renderedLinker)) fail('Phase 7 linker script differs from the accepted model');

  const objectManifest = readJson(files.objectManifest);
  if (objectManifest.schemaVersion !== 1 || !Array.isArray(objectManifest.objects) || objectManifest.objects.length === 0) fail('Phase 7 object manifest schema drift');
  for (const record of objectManifest.objects) {
    const objectFile = resolveRelative(phase7Output, record.path, 'Phase 7 object path');
    if (!fs.existsSync(objectFile) || fs.statSync(objectFile).size !== record.bytes || sha256File(objectFile) !== record.sha256) {
      fail(`Phase 7 object identity drift: ${record.path}`);
    }
  }
  return {
    files,
    objectManifest,
    identity: {
      buildReportSha256: sha256File(files.report),
      objectManifestSha256: sha256File(files.objectManifest),
      linkerScriptSha256: sha256File(files.linkerScript),
      outputs: {
        elf: { bytes: fs.statSync(files.elf).size, sha256: expectedOutputs.elf },
        map: { bytes: fs.statSync(files.map).size, sha256: expectedOutputs.map },
        rom: { bytes: romResult.bytes, sha256: romResult.romSha256 },
        layout: { bytes: fs.statSync(files.layout).size, sha256: expectedOutputs.layout },
      },
    },
  };
}

function copyPhase7Objects(phase8, phase7, output, objcopy) {
  const linkedObjects = [];
  for (const record of phase7.objectManifest.objects) {
    const relative = safeRelative(record.path, 'Phase 7 object path');
    const source = resolveRelative(path.dirname(phase7.files.objectManifest), relative.replace(/^objects\//, ''), 'Phase 7 object source');
    const destination = resolveRelative(output, relative, 'Phase 8 object destination');
    ensureDir(path.dirname(destination));
    fs.copyFileSync(source, destination);
    if (fs.statSync(destination).size !== record.bytes || sha256File(destination) !== record.sha256) fail(`copied Phase 7 object drift: ${relative}`);
    linkedObjects.push(relative);
  }

  const chunkRelative = `objects/assembly/chunk_${String(phase8.target.chunkIndex).padStart(3, '0')}.o`;
  if (!linkedObjects.includes(chunkRelative)) fail(`target Phase 7 chunk is absent: ${chunkRelative}`);
  const linkedChunk = resolveRelative(output, chunkRelative, 'linked target chunk');
  const fallbackRelative = `comparison/original/chunk_${String(phase8.target.chunkIndex).padStart(3, '0')}.o`;
  const fallbackObject = resolveRelative(output, fallbackRelative, 'fallback object');
  ensureDir(path.dirname(fallbackObject));
  fs.copyFileSync(linkedChunk, fallbackObject);

  run(objcopy, [`--remove-section=${phase8.target.sectionName}`, `--strip-symbol=${phase8.target.symbol}`, linkedChunk]);
  const originalElf = parseElfFile(fallbackObject);
  const prunedElf = parseElfFile(linkedChunk);
  const originalTarget = originalElf.sections.filter((section) => section.name === phase8.target.sectionName);
  if (originalTarget.length !== 1 || originalTarget[0].size !== phase8.target.bytes) fail('original fallback target section drift');
  const originalBytes = Buffer.from(elfSectionBytes(originalElf, originalTarget[0]));
  if (sha256Buffer(originalBytes) !== phase8.target.expectedTextSha256) fail('original fallback target bytes drift');
  if (prunedElf.sections.some((section) => section.name === phase8.target.sectionName)) fail('target section survived fallback pruning');
  if (prunedElf.symbols.some((symbol) => symbol.name === phase8.target.symbol)) fail('target symbol survived fallback pruning');

  const originalSections = originalElf.sections.filter((section) => /^\.ob64\.r\d{4}(?:\.s\d+)?$/.test(section.name) && section.name !== phase8.target.sectionName);
  const prunedSections = prunedElf.sections.filter((section) => /^\.ob64\.r\d{4}(?:\.s\d+)?$/.test(section.name));
  if (originalSections.length !== prunedSections.length) fail('fallback pruning changed another accepted owner section');
  const prunedByName = new Map(prunedSections.map((section) => [section.name, section]));
  for (const section of originalSections) {
    const candidate = prunedByName.get(section.name);
    if (!candidate || candidate.size !== section.size || !Buffer.from(elfSectionBytes(prunedElf, candidate)).equals(elfSectionBytes(originalElf, section))) {
      fail(`fallback pruning changed accepted owner bytes: ${section.name}`);
    }
  }
  return {
    linkedObjects,
    linkedChunkRelative: chunkRelative,
    fallbackRelative,
    fallbackSha256: sha256File(fallbackObject),
    prunedSha256: sha256File(linkedChunk),
    preservedTargetChunkSections: originalSections.length,
    originalTargetSha256: sha256Buffer(originalBytes),
  };
}

function compileTarget(phase8, output, compiler, assembler) {
  const generatedRoot = path.join(output, 'generated', 'c');
  const objectRoot = path.join(output, 'objects', 'c');
  ensureDir(generatedRoot);
  ensureDir(objectRoot);
  const compilerAssembly = path.join(generatedRoot, `${phase8.target.symbol}.compiler.s`);
  const linkedAssembly = path.join(generatedRoot, `${phase8.target.symbol}.s`);
  const objectFile = path.join(objectRoot, `${phase8.target.symbol}.o`);
  const sourceRelative = safeRelative(phase8.target.source, 'target source');
  run(compiler, [...phase8.config.compiler.compileFlags, '-o', compilerAssembly, sourceRelative], { cwd: ROOT });

  const compilerText = fs.readFileSync(compilerAssembly, 'utf8');
  const textMatches = compilerText.match(/^\s*\.text\s*$/gm) || [];
  if (textMatches.length !== 1 || /^\s*\.section\b/m.test(compilerText)) fail('KMC target assembly section grammar drift');
  const linkedText = compilerText.replace(/^\s*\.text\s*$/m, `.section ${phase8.target.sectionName},"ax",@progbits`);
  fs.writeFileSync(linkedAssembly, linkedText);
  run(assembler, [
    ...phase8.model.config.binutils.assemblerFlags,
    '-o',
    normalizePath(path.relative(output, objectFile)),
    normalizePath(path.relative(output, linkedAssembly)),
  ], { cwd: output });

  const elf = parseElfFile(objectFile);
  const sections = elf.sections.filter((section) => section.name === phase8.target.sectionName);
  if (sections.length !== 1 || sections[0].type !== 1 || (sections[0].flags & 6) !== 6 || sections[0].size !== phase8.target.bytes) {
    fail('KMC target object section shape drift');
  }
  const textBytes = Buffer.from(elfSectionBytes(elf, sections[0]));
  if (sha256Buffer(textBytes) !== phase8.target.expectedTextSha256) fail('KMC target object bytes differ from the accepted ROM reference');
  const symbols = elf.symbols.filter((symbol) => symbol.name === phase8.target.symbol && symbol.sectionIndex !== 0);
  if (symbols.length !== 1 || symbols[0].value !== 0 || symbols[0].size !== phase8.target.bytes || symbols[0].binding !== 1) fail('KMC target object symbol drift');
  if (elf.sections.some((section) => section.name === `.rel${phase8.target.sectionName}` || section.name === `.rela${phase8.target.sectionName}`)) {
    fail('KMC target unexpectedly contains code relocations');
  }
  for (const name of ['.data', '.bss']) {
    const section = elf.sections.find((candidate) => candidate.name === name);
    if (section && section.size !== 0) fail(`KMC target unexpectedly owns ${name} bytes`);
  }
  return {
    objectRelative: `objects/c/${phase8.target.symbol}.o`,
    objectSha256: sha256File(objectFile),
    compilerAssemblyRelative: `generated/c/${phase8.target.symbol}.compiler.s`,
    compilerAssemblySha256: sha256File(compilerAssembly),
    linkedAssemblyRelative: `generated/c/${phase8.target.symbol}.s`,
    linkedAssemblySha256: sha256File(linkedAssembly),
    textSha256: sha256Buffer(textBytes),
    relocations: [],
  };
}

function writeObjectManifest(output, linkedObjects, phase8, replacement, compiled) {
  const objects = [];
  for (const relative of linkedObjects) {
    const file = resolveRelative(output, relative, 'linked object');
    objects.push({
      path: relative,
      bytes: fs.statSync(file).size,
      sha256: sha256File(file),
      ownerKind: relative === replacement.linkedChunkRelative ? 'accepted-assembly-chunk-with-target-removed' : 'accepted-phase7-object',
    });
    if (relative === replacement.linkedChunkRelative) {
      const cFile = resolveRelative(output, compiled.objectRelative, 'matching C object');
      objects.push({
        path: compiled.objectRelative,
        bytes: fs.statSync(cFile).size,
        sha256: sha256File(cFile),
        ownerKind: 'matching-c-target',
        targetSection: phase8.target.sectionName,
      });
    }
  }
  const manifestFile = path.join(output, 'objects', 'manifest.json');
  writeJson(manifestFile, {
    schemaVersion: 1,
    generator: 'tools/build_phase8_matching_c.js',
    target: phase8.target.symbol,
    linkedObjects: objects,
    comparisonObject: {
      path: replacement.fallbackRelative,
      bytes: fs.statSync(resolveRelative(output, replacement.fallbackRelative, 'fallback object')).size,
      sha256: replacement.fallbackSha256,
      ownerKind: 'original-assembly-fallback-and-comparison',
    },
  });
  return {
    file: manifestFile,
    linkedObjects: objects,
    sha256: sha256File(manifestFile),
    bytes: fs.statSync(manifestFile).size,
  };
}

function writeLayout(phase8, phase7, output) {
  const layout = readJson(phase7.files.layout);
  const owner = layout.owners.find((item) => item.index === phase8.target.rowIndex);
  if (!owner || owner.primaryId !== phase8.target.primaryId || owner.slices.length !== 1 || owner.slices[0].sectionName !== phase8.target.sectionName) {
    fail('Phase 7 target layout row drift');
  }
  owner.baseInputKind = owner.inputKind;
  owner.inputKind = 'matching-c';
  owner.source = phase8.target.source;
  owner.originalAssemblyFallback = phase8.target.originalAssembly;
  layout.generator = 'tools/build_phase8_matching_c.js';
  layout.phase8MatchingCTarget = {
    symbol: phase8.target.symbol,
    rowIndex: phase8.target.rowIndex,
    sectionName: phase8.target.sectionName,
    romStart: phase8.target.romStartNumber,
    romEndExclusive: phase8.target.romEndNumber,
    vramStart: phase8.target.vramStartNumber,
    bytes: phase8.target.bytes,
  };
  writeJson(path.join(output, 'layout.json'), layout);
}

function linkPhase8(phase8, output, objectManifest, tools) {
  const linkerRoot = path.join(output, 'linker');
  ensureDir(linkerRoot);
  const linkerScript = path.join(linkerRoot, 'phase8.ld');
  const responseFile = path.join(linkerRoot, 'objects.rsp');
  fs.writeFileSync(linkerScript, renderLinkerScript(phase8.model));
  fs.writeFileSync(responseFile, `${objectManifest.linkedObjects.map((record) => record.path).join('\n')}\n`);
  const elfFile = path.join(output, 'phase8.elf');
  const mapFile = path.join(output, 'phase8.map');
  const romFile = path.join(output, 'phase8.us_rev0.z64');
  run(tools['mips64-elf-ld.exe'].path, [
    ...phase8.model.config.binutils.linkerFlags,
    `-Map=${normalizePath(path.relative(output, mapFile))}`,
    '-T',
    normalizePath(path.relative(output, linkerScript)),
    '-o',
    normalizePath(path.relative(output, elfFile)),
    `@${normalizePath(path.relative(output, responseFile))}`,
  ], { cwd: output, maxBuffer: 256 * 1024 * 1024 });
  run(tools['mips64-elf-objcopy.exe'].path, [
    '-O',
    'binary',
    normalizePath(path.relative(output, elfFile)),
    normalizePath(path.relative(output, romFile)),
  ], { cwd: output });
  const readelf = run(tools['mips64-elf-readelf.exe'].path, [
    '-W', '-h', '-S', '-l', '-s', normalizePath(path.relative(output, elfFile)),
  ], { cwd: output, maxBuffer: 256 * 1024 * 1024 });
  const readelfFile = path.join(output, 'phase8.readelf.txt');
  fs.writeFileSync(readelfFile, readelf.stdout);
  return { elfFile, linkerScript, mapFile, readelfFile, responseFile, romFile };
}

function parseJsonOutput(value, label) {
  try {
    return JSON.parse(value);
  } catch (error) {
    fail(`${label} did not emit JSON: ${error.message}`);
  }
}

function runTargetAsmDiffer(phase8, options) {
  const output = path.resolve(options.output);
  const proofRoot = path.join(output, 'asm-differ-proof');
  const runRoot = path.join(proofRoot, 'target-elf');
  ensureDir(runRoot);
  const shim = path.join(proofRoot, 'watchdog.py');
  fs.writeFileSync(shim, SHIM_TEXT);
  fs.copyFileSync(shim, path.join(runRoot, 'watchdog.py'));
  const settings = [
    'def apply(config, args):',
    `    config["objdump_executable"] = ${JSON.stringify(options.objdump)}`,
    '    config["arch"] = "mips"',
    '    config["map_format"] = "gnu"',
    '    config["show_line_numbers_default"] = False',
    `    config["baseimg"] = ${JSON.stringify(`../../comparison/original/chunk_${String(phase8.target.chunkIndex).padStart(3, '0')}.o`)}`,
    `    config["myimg"] = ${JSON.stringify(`../../objects/c/${phase8.target.symbol}.o`)}`,
    '    config["mapfile"] = "../../phase8.map"',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(runRoot, 'diff_settings.py'), settings);
  const env = { ...process.env, PYTHONPATH: runRoot, PYTHONDONTWRITEBYTECODE: '1' };
  const result = run(options.python, [
    path.join(options.asmDifferRoot, 'diff.py'),
    hex(phase8.row.part.symbolByteOffset),
    '-e',
    phase8.target.symbol,
    '-j',
    phase8.target.sectionName,
    '--format',
    'json',
    '--algorithm',
    'difflib',
    '--no-line-numbers',
  ], { cwd: runRoot, env });
  const json = parseJsonOutput(result.stdout, `asm-differ target proof for ${phase8.target.symbol}`);
  if (!Array.isArray(json.rows) || json.rows.length === 0 || json.max_score <= 0 || json.current_score !== 0) {
    fail(`asm-differ did not prove an exact nonempty target match: ${phase8.target.symbol}`);
  }
  const jsonFile = path.join(proofRoot, `${phase8.target.symbol}.json`);
  writeJson(jsonFile, json);
  return {
    symbol: phase8.target.symbol,
    sectionName: phase8.target.sectionName,
    rows: json.rows.length,
    maxScore: json.max_score,
    currentScore: json.current_score,
    exact: true,
    outputSha256: sha256File(jsonFile),
    shimSha256: sha256File(shim),
  };
}

function verifyTargetMapOwner(phase8, mapText) {
  const escaped = phase8.target.sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lines = mapText.split(/\r?\n/);
  const heading = lines.findIndex((line) => new RegExp(`^${escaped}\\s`).test(line));
  if (heading < 0) fail(`target linker-map section is missing: ${phase8.target.sectionName}`);
  let end = lines.length;
  for (let index = heading + 1; index < lines.length; index += 1) {
    if (/^\.ob64\.r\d{4}(?:\.s\d+)?\s/.test(lines[index])) {
      end = index;
      break;
    }
  }
  const block = lines.slice(heading, end);
  const contributions = block.filter((line) => new RegExp(`^\\s+${escaped}\\s+.*\\sobjects/`).test(line));
  const expectedOwner = `objects/c/${phase8.target.symbol}.o`;
  const forbiddenOwner = `objects/assembly/chunk_${String(phase8.target.chunkIndex).padStart(3, '0')}.o`;
  if (contributions.length !== 1 || !contributions[0].includes(expectedOwner) || block.some((line) => line.includes(forbiddenOwner))) {
    fail('target linker-map owner is not the sole matching C object');
  }
  if (!block.some((line) => new RegExp(`\\s${phase8.target.symbol}$`).test(line))) fail('target linker-map symbol is missing');
  return { contribution: contributions[0].trim(), linkedOwner: expectedOwner };
}

function verifyObjectManifest(output) {
  const manifestFile = path.join(output, 'objects', 'manifest.json');
  if (!fs.existsSync(manifestFile)) fail('Phase 8 object manifest is missing');
  const manifest = readJson(manifestFile);
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.linkedObjects) || manifest.linkedObjects.length === 0) fail('Phase 8 object manifest schema drift');
  for (const record of [...manifest.linkedObjects, manifest.comparisonObject]) {
    const file = resolveRelative(output, record.path, 'Phase 8 manifest object');
    if (!fs.existsSync(file) || fs.statSync(file).size !== record.bytes || sha256File(file) !== record.sha256) fail(`Phase 8 object identity drift: ${record.path}`);
  }
  const cOwners = manifest.linkedObjects.filter((record) => record.ownerKind === 'matching-c-target');
  const prunedOwners = manifest.linkedObjects.filter((record) => record.ownerKind === 'accepted-assembly-chunk-with-target-removed');
  if (cOwners.length !== 1 || prunedOwners.length !== 1) fail('Phase 8 target ownership census drift');
  return { manifest, bytes: fs.statSync(manifestFile).size, sha256: sha256File(manifestFile) };
}

function verifyPhase8Output(phase8, options) {
  const output = path.resolve(options.output);
  const files = {
    elf: path.join(output, 'phase8.elf'),
    map: path.join(output, 'phase8.map'),
    rom: path.join(output, 'phase8.us_rev0.z64'),
    layout: path.join(output, 'layout.json'),
    readelf: path.join(output, 'phase8.readelf.txt'),
    cObject: path.join(output, 'objects', 'c', `${phase8.target.symbol}.o`),
    prunedObject: path.join(output, 'objects', 'assembly', `chunk_${String(phase8.target.chunkIndex).padStart(3, '0')}.o`),
    fallbackObject: path.join(output, 'comparison', 'original', `chunk_${String(phase8.target.chunkIndex).padStart(3, '0')}.o`),
  };
  for (const file of Object.values(files)) if (!fs.existsSync(file)) fail(`Phase 8 output is missing: ${file}`);

  const elf = parseElfFile(files.elf);
  const elfResult = verifyElfAgainstModel(phase8.model, elf);
  const mapText = fs.readFileSync(files.map, 'utf8');
  const mapResult = verifyMap(phase8.model, mapText);
  const romResult = verifyRom(phase8.model, fs.readFileSync(files.rom));
  const mapOwner = verifyTargetMapOwner(phase8, mapText);

  const linkedSections = elf.sections.filter((section) => section.name === phase8.target.sectionName);
  if (linkedSections.length !== 1 || linkedSections[0].address !== phase8.target.vramStartNumber || linkedSections[0].size !== phase8.target.bytes) {
    fail('linked target section placement drift');
  }
  const linkedText = Buffer.from(elfSectionBytes(elf, linkedSections[0]));
  if (sha256Buffer(linkedText) !== phase8.target.expectedTextSha256) fail('linked target bytes differ from the accepted ROM reference');
  const linkedSymbols = elf.symbols.filter((symbol) => symbol.name === phase8.target.symbol && symbol.sectionIndex !== 0);
  if (linkedSymbols.length !== 1
      || linkedSymbols[0].value !== phase8.target.vramStartNumber
      || linkedSymbols[0].size !== phase8.target.bytes
      || linkedSymbols[0].binding !== 1) {
    fail('linked target symbol placement drift');
  }

  const cElf = parseElfFile(files.cObject);
  const cSection = cElf.sections.find((section) => section.name === phase8.target.sectionName);
  if (!cSection || cSection.size !== phase8.target.bytes || sha256Buffer(elfSectionBytes(cElf, cSection)) !== phase8.target.expectedTextSha256) fail('recorded C object target bytes drift');
  const fallbackElf = parseElfFile(files.fallbackObject);
  const fallbackSection = fallbackElf.sections.find((section) => section.name === phase8.target.sectionName);
  if (!fallbackSection || fallbackSection.size !== phase8.target.bytes || !Buffer.from(elfSectionBytes(fallbackElf, fallbackSection)).equals(linkedText)) fail('original assembly comparison bytes drift');
  const prunedElf = parseElfFile(files.prunedObject);
  if (prunedElf.sections.some((section) => section.name === phase8.target.sectionName) || prunedElf.symbols.some((symbol) => symbol.name === phase8.target.symbol)) {
    fail('original assembly fallback remains a linked target owner');
  }

  const layout = readJson(files.layout);
  const layoutOwner = layout.owners && layout.owners.find((owner) => owner.index === phase8.target.rowIndex);
  if (layout.schemaVersion !== 1
      || layout.rows !== phase8.model.rows.length
      || layout.slices !== phase8.model.slices.length
      || layout.representedBytes !== phase8.model.config.rom.bytes
      || !layoutOwner
      || layoutOwner.inputKind !== 'matching-c'
      || layoutOwner.source !== phase8.target.source
      || layoutOwner.originalAssemblyFallback !== phase8.target.originalAssembly) {
    fail('Phase 8 external layout summary drift');
  }
  const objectManifest = verifyObjectManifest(output);
  const asmDiffer = runTargetAsmDiffer(phase8, {
    output,
    asmDifferRoot: options.asmDifferRoot,
    python: options.splatPython,
    objdump: options.objdump,
  });
  return {
    schemaVersion: 1,
    status: 'pass',
    counts: {
      primaryRows: phase8.model.rows.length,
      linkSlices: phase8.model.slices.length,
      overlayReservations: phase8.model.overlays.length,
      representedBytes: elfResult.representedBytes,
      loadHeaders: elfResult.loadHeaderCount,
      symbols: elfResult.symbolCount,
      mapSections: mapResult.sectionMentions,
      matchingCOwners: 1,
      originalAssemblyFallbacks: 1,
    },
    outputs: {
      elf: { bytes: fs.statSync(files.elf).size, sha256: sha256File(files.elf) },
      map: { bytes: fs.statSync(files.map).size, sha256: sha256File(files.map) },
      rom: { bytes: romResult.bytes, sha256: romResult.romSha256 },
      codeRegionSha256: romResult.codeSha256,
      layout: { bytes: fs.statSync(files.layout).size, sha256: sha256File(files.layout) },
      readelf: { bytes: fs.statSync(files.readelf).size, sha256: sha256File(files.readelf) },
      objectManifest: { bytes: objectManifest.bytes, sha256: objectManifest.sha256 },
    },
    target: {
      symbol: phase8.target.symbol,
      source: phase8.target.source,
      originalAssemblyFallback: phase8.target.originalAssembly,
      rowIndex: phase8.target.rowIndex,
      primaryId: phase8.target.primaryId,
      sectionName: phase8.target.sectionName,
      romStart: phase8.target.romStart,
      romEndExclusive: phase8.target.romEndExclusive,
      vramStart: phase8.target.vramStart,
      bytes: phase8.target.bytes,
      textSha256: sha256Buffer(linkedText),
      linkedSymbolValue: hex(linkedSymbols[0].value),
      linkedOwner: mapOwner.linkedOwner,
      mapContribution: mapOwner.contribution,
      relocations: [],
    },
    preservation: {
      fullRomExact: true,
      acceptedRowsPreserved: phase8.model.rows.length,
      acceptedSlicesPreserved: phase8.model.slices.length,
      overlayDescriptorsPreserved: phase8.model.overlays.length,
      originalAssemblyTargetNotLinked: true,
    },
    asmDiffer,
  };
}

function pathIndependentRuntime(runtime) {
  return {
    tools: Object.fromEntries(Object.entries(runtime.tools).map(([name, record]) => [name, { bytes: record.bytes, sha256: record.sha256 }])),
    host: runtime.host,
    splat: runtime.splat,
    asmDiffer: runtime.asmDiffer,
  };
}

module.exports = {
  CONFIG_PATH,
  ROOT,
  assertBuildLocations,
  compileTarget,
  copyPhase7Objects,
  fail,
  linkPhase8,
  loadPhase8Model,
  pathIndependentRuntime,
  readJson,
  runTargetAsmDiffer,
  sha256File,
  verifyCompiler,
  verifyObjectManifest,
  verifyPhase7Input,
  verifyPhase8Output,
  verifyRuntimeTools,
  verifyTargetMapOwner,
  writeJson,
  writeLayout,
  writeObjectManifest,
};
