'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  SHIM_TEXT,
  OBJDUMP_SHIM_TEXT,
  elfSectionBytes,
  elfStructuralReport,
  ensureDir,
  fail,
  hex,
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
const {
  CONFIG_PATH,
  LINKAGE_CONFIG_PATH,
  loadActiveTargetModel,
} = require('./active_targets');
const {
  POLICY_CONFIG_PATH,
  SOURCE_CLASSES,
  classifyTargetSources,
} = require('./source_policy');

function parseNumber(value, label) {
  if (Number.isInteger(value)) return value;
  if (typeof value === 'string' && /^0x[0-9a-f]+$/i.test(value)) return Number.parseInt(value.slice(2), 16);
  fail(label + ' is not an integer or hexadecimal string');
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function safeRelative(relative, label) {
  const normalized = normalizePath(relative);
  if (!normalized || path.isAbsolute(relative) || normalized === '..' || normalized.startsWith('../') || normalized.includes('/../')) {
    fail(label + ' is not a safe relative path: ' + relative);
  }
  return normalized;
}

function resolveRelative(root, relative, label) {
  return path.join(root, ...safeRelative(relative, label).split('/'));
}

function legalizeCop1BinaryAssembly(text) {
  const functions = Object.freeze({
    'add.s': 0x00,
    'sub.s': 0x01,
    'mul.s': 0x02,
    'div.s': 0x03,
  });
  return text.replace(
    /^([ \t]*)(add\.s|sub\.s|mul\.s|div\.s)[ \t]+\$f(\d+)[ \t]*,[ \t]*\$f(\d+)[ \t]*,[ \t]*\$f(\d+)[ \t]*(\r?)$/gm,
    (line, indent, mnemonic, fdText, fsText, ftText, carriageReturn) => {
      const fd = Number(fdText);
      const fs = Number(fsText);
      const ft = Number(ftText);
      if (fd > 31 || fs > 31 || ft > 31) fail(`KMC compiler emitted a malformed ${mnemonic} register`);
      const word = (0x46000000 | (ft << 16) | (fs << 11) | (fd << 6) | functions[mnemonic]) >>> 0;
      return `${indent}.word\t0x${word.toString(16).toUpperCase().padStart(8, '0')}${carriageReturn}`;
    },
  );
}

function adjustSectionAssembly(compilerAssembly, sectionName, options = {}) {
  if (!Buffer.isBuffer(compilerAssembly)) fail('compiler assembly is not a byte buffer');
  if (typeof sectionName !== 'string' || !/^\.ob64\.r[0-9]+(?:\.s[0-9]+)?$/.test(sectionName)) {
    fail('target section name is malformed');
  }
  const text = compilerAssembly.toString('utf8');
  if (!Buffer.from(text, 'utf8').equals(compilerAssembly)) fail('compiler assembly is not exact UTF-8');
  const textMatches = [...text.matchAll(/^[ \t]*\.text[ \t]*(\r?)$/gm)];
  const broadTextMatches = text.match(/^[ \t]*\.text\b[^\r\n]*$/gm) || [];
  const explicitSectionLines = [...text.matchAll(/^[ \t]*\.section\b([^\r\n]*)(\r?)$/gm)];
  const shorthandDataSections = text.match(/^[ \t]*\.(?:data|bss|rdata|sdata)\b[^\r\n]*$/gm) || [];
  const allowAuxiliaryReadOnlySections = options.allowAuxiliaryReadOnlySections === true;
  const auxiliarySections = options.auxiliarySections === undefined ? [] : options.auxiliarySections;
  if (!Array.isArray(auxiliarySections)) fail('KMC auxiliary-section contract is malformed');
  if (allowAuxiliaryReadOnlySections && auxiliarySections.length > 0) {
    fail('KMC scratch and canonical auxiliary-section policies cannot be combined');
  }
  let adjusted = text;
  if (auxiliarySections.length > 0) {
    if (auxiliarySections.length !== 1
        || auxiliarySections[0].compilerSection !== '.rodata'
        || typeof auxiliarySections[0].outputSection !== 'string'
        || !/^\.ob64\.r[0-9]+(?:\.s[0-9]+)?$/.test(auxiliarySections[0].outputSection)
        || auxiliarySections[0].outputSection === sectionName
        || options.legalizeCop1BinaryInstructions === true
        || textMatches.length !== 2
        || broadTextMatches.length !== textMatches.length
        || explicitSectionLines.length !== 1
        || shorthandDataSections.length !== 0) {
      fail('KMC target auxiliary-section grammar drift: ' + sectionName);
    }
    const explicit = explicitSectionLines[0];
    const exactSection = /^[ \t]+(\.[A-Za-z0-9_.]+)[ \t]*$/.exec(explicit[1]);
    if (!exactSection
        || exactSection[1] !== auxiliarySections[0].compilerSection
        || !(textMatches[0].index < explicit.index && explicit.index < textMatches[1].index)) {
      fail('KMC target auxiliary-section grammar drift: ' + sectionName);
    }
    adjusted = adjusted.replace(
      /^[ \t]*\.section\b[^\r\n]*(\r?)$/m,
      (_, carriageReturn) => `.section ${auxiliarySections[0].outputSection},"a",@progbits${carriageReturn}`,
    );
    adjusted = adjusted.replace(
      /^[ \t]*\.text[ \t]*(\r?)$/gm,
      (_, carriageReturn) => `.section ${sectionName},"ax",@progbits${carriageReturn}`,
    );
  } else if (!allowAuxiliaryReadOnlySections) {
    if (textMatches.length !== 1
        || broadTextMatches.length !== textMatches.length
        || explicitSectionLines.length !== 0
        || shorthandDataSections.length !== 0) {
      fail('KMC target assembly section grammar drift: ' + sectionName);
    }
    adjusted = adjusted.replace(
      /^[ \t]*\.text[ \t]*(\r?)$/m,
      (_, carriageReturn) => `.section ${sectionName},"ax",@progbits${carriageReturn}`,
    );
  } else {
    if (textMatches.length === 0) fail('KMC scratch assembly section grammar drift: ' + sectionName);
    const explicitSections = explicitSectionLines.map((match) => {
      const exact = /^[ \t]+(\.[A-Za-z0-9_.]+)[ \t]*$/.exec(match[1]);
      return exact ? exact[1] : null;
    });
    if (broadTextMatches.length !== textMatches.length
        || shorthandDataSections.length !== 0
        || explicitSections.some((name) => name !== '.rodata')) {
      fail('KMC scratch assembly owns a non-read-only auxiliary section');
    }
    adjusted = adjusted.replace(
      /^[ \t]*\.text[ \t]*(\r?)$/gm,
      (_, carriageReturn) => `.section ${sectionName},"ax",@progbits${carriageReturn}`,
    );
  }
  return Buffer.from(options.legalizeCop1BinaryInstructions === true
    ? legalizeCop1BinaryAssembly(adjusted)
    : adjusted, 'utf8');
}

function loadPhase8Model() {
  return loadActiveTargetModel();
}

function loadCanonicalBaserom(phase8) {
  if (!phase8 || !phase8.model || !phase8.model.config || !phase8.model.config.rom) {
    fail('canonical baserom model is missing');
  }
  const expected = phase8.model.config.rom;
  if (!Number.isInteger(expected.bytes) || expected.bytes <= 0 || typeof expected.sha256 !== 'string') {
    fail('canonical baserom model is malformed');
  }
  const file = path.join(ROOT, 'build', 'baserom.us_rev0.z64');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail('canonical normalized baserom is missing: ' + file);
  const bytes = fs.readFileSync(file);
  if (bytes.length !== expected.bytes || sha256Buffer(bytes) !== expected.sha256) fail('canonical normalized baserom identity drift');
  return bytes;
}

function compareLinkedTargetBytes(target, linkedElf, canonicalBaserom) {
  if (!target || typeof target.symbol !== 'string' || typeof target.sectionName !== 'string') {
    fail('raw linked-target comparison metadata is malformed');
  }
  if (!Number.isInteger(target.bytes) || target.bytes <= 0 || target.bytes % 4 !== 0
      || !Number.isInteger(target.romStartNumber) || !Number.isInteger(target.romEndNumber)
      || target.romEndNumber - target.romStartNumber !== target.bytes
      || !Number.isInteger(target.vramStartNumber)
      || typeof target.expectedTextSha256 !== 'string' || !/^[0-9A-F]{64}$/.test(target.expectedTextSha256)) {
    fail('raw linked-target comparison contract is malformed: ' + target.symbol);
  }
  if (!linkedElf || !Buffer.isBuffer(linkedElf.buffer)
      || !Array.isArray(linkedElf.sections) || !Array.isArray(linkedElf.programHeaders)) {
    fail('raw linked-target ELF is malformed: ' + target.symbol);
  }
  if (!Buffer.isBuffer(canonicalBaserom)
      || target.romStartNumber < 0
      || target.romEndNumber > canonicalBaserom.length) {
    fail('raw linked-target baserom range is malformed: ' + target.symbol);
  }

  const sections = linkedElf.sections.filter((section) => section && section.name === target.sectionName);
  if (sections.length !== 1) fail('raw linked-target section count drift: ' + target.symbol);
  const section = sections[0];
  if (section.type !== 1
      || !Number.isInteger(section.flags) || (section.flags & 2) === 0 || (section.flags & 4) === 0
      || section.address !== target.vramStartNumber
      || section.size !== target.bytes
      || !Number.isInteger(section.offset) || section.offset < 0) {
    fail('raw linked-target section shape drift: ' + target.symbol);
  }
  const targetLoads = linkedElf.programHeaders.filter((header) => header && header.type === 1 && (
    header.vaddr === target.vramStartNumber
    || header.paddr === target.romStartNumber
    || header.offset === section.offset
  ));
  if (targetLoads.length !== 1) fail('raw linked-target load-header count drift: ' + target.symbol);
  const load = targetLoads[0];
  if (load.offset !== section.offset
      || load.vaddr !== target.vramStartNumber
      || load.paddr !== target.romStartNumber
      || load.fileSize !== target.bytes
      || load.memorySize !== target.bytes
      || !Number.isInteger(load.flags) || (load.flags & 1) === 0) {
    fail('raw linked-target load placement drift: ' + target.symbol);
  }

  const linkedBytes = Buffer.from(elfSectionBytes(linkedElf, section));
  if (linkedBytes.length !== target.bytes) fail('raw linked-target section size drift: ' + target.symbol);
  const expectedBytes = Buffer.from(canonicalBaserom.subarray(target.romStartNumber, target.romEndNumber));
  if (expectedBytes.length !== target.bytes) fail('raw linked-target expected size drift: ' + target.symbol);
  const expectedTargetSha256 = sha256Buffer(expectedBytes);
  if (expectedTargetSha256 !== target.expectedTextSha256) fail('raw linked-target expected identity drift: ' + target.symbol);

  let differingByteCount = 0;
  let firstDifferenceOffset = null;
  const differingWords = new Set();
  for (let offset = 0; offset < linkedBytes.length; offset += 1) {
    if (linkedBytes[offset] === expectedBytes[offset]) continue;
    differingByteCount += 1;
    differingWords.add(Math.floor(offset / 4));
    if (firstDifferenceOffset === null) firstDifferenceOffset = offset;
  }
  return {
    rawBytesExact: differingByteCount === 0,
    linkedTargetSha256: sha256Buffer(linkedBytes),
    expectedTargetSha256,
    differingByteCount,
    differingInstructionWordCount: differingWords.size,
    firstDifferenceOffset,
    linkedBytes,
    expectedBytes,
  };
}

function verifyAuxiliaryPaddingBytes(bytes, auxiliary, label) {
  if (!Buffer.isBuffer(bytes)
      || !auxiliary
      || !Number.isInteger(auxiliary.bytes)
      || !Number.isInteger(auxiliary.entryBytes)
      || !Number.isInteger(auxiliary.trailingPaddingBytes)
      || auxiliary.entryBytes < 0
      || auxiliary.trailingPaddingBytes < 0
      || auxiliary.entryBytes + auxiliary.trailingPaddingBytes !== auxiliary.bytes
      || bytes.length !== auxiliary.bytes
      || typeof auxiliary.expectedTrailingPaddingSha256 !== 'string') {
    fail('auxiliary trailing-padding metadata is malformed: ' + label);
  }
  const padding = Buffer.from(bytes.subarray(auxiliary.entryBytes));
  const expectedPadding = Buffer.alloc(auxiliary.trailingPaddingBytes);
  const paddingSha256 = sha256Buffer(padding);
  if (padding.length !== auxiliary.trailingPaddingBytes
      || !padding.equals(expectedPadding)
      || paddingSha256 !== auxiliary.expectedTrailingPaddingSha256) {
    fail('auxiliary trailing-padding bytes drift: ' + label);
  }
  return {
    entryBytes: auxiliary.entryBytes,
    trailingPaddingBytes: padding.length,
    trailingPaddingSha256: paddingSha256,
  };
}

function compareLinkedAuxiliaryBytes(target, auxiliary, linkedElf, canonicalBaserom) {
  if (!auxiliary || auxiliary.kind !== 'switch-table'
      || !Number.isInteger(auxiliary.ownerSectionBytes)
      || !Number.isInteger(auxiliary.ownerRomStartNumber)
      || !Number.isInteger(auxiliary.ownerVramStartNumber)
      || !Buffer.isBuffer(canonicalBaserom)) {
    fail('raw linked-auxiliary comparison metadata is malformed: ' + target.symbol);
  }
  const sections = linkedElf.sections.filter((section) => section && section.name === auxiliary.outputSection);
  if (sections.length !== 1) fail('raw linked-auxiliary section count drift: ' + target.symbol);
  const section = sections[0];
  if (section.type !== 1
      || section.flags !== 2
      || section.address !== auxiliary.ownerVramStartNumber
      || section.size !== auxiliary.ownerSectionBytes
      || section.alignment !== auxiliary.alignment
      || !Number.isInteger(section.offset) || section.offset < 0) {
    fail('raw linked-auxiliary section shape drift: ' + target.symbol);
  }
  const loads = linkedElf.programHeaders.filter((header) => header && header.type === 1 && (
    header.vaddr === auxiliary.ownerVramStartNumber
    || header.paddr === auxiliary.ownerRomStartNumber
    || header.offset === section.offset
  ));
  if (loads.length !== 1) fail('raw linked-auxiliary load-header count drift: ' + target.symbol);
  const load = loads[0];
  if (load.offset !== section.offset
      || load.vaddr !== auxiliary.ownerVramStartNumber
      || load.paddr !== auxiliary.ownerRomStartNumber
      || load.fileSize !== auxiliary.ownerSectionBytes
      || load.memorySize !== auxiliary.ownerSectionBytes
      || load.flags !== 4) {
    fail('raw linked-auxiliary load placement drift: ' + target.symbol);
  }
  const ownerSymbols = linkedElf.symbols.filter((symbol) => (
    symbol.name === auxiliary.ownerSymbol && symbol.sectionIndex !== 0
  ));
  if (ownerSymbols.length !== 1
      || ownerSymbols[0].value !== auxiliary.ownerSymbolVram
      || ownerSymbols[0].binding !== 1) {
    fail('raw linked-auxiliary owner symbol drift: ' + target.symbol);
  }
  const ownerBytes = Buffer.from(elfSectionBytes(linkedElf, section));
  const offsetInOwner = auxiliary.vramStartNumber - auxiliary.ownerVramStartNumber;
  if (offsetInOwner < 0 || offsetInOwner + auxiliary.bytes > ownerBytes.length) {
    fail('raw linked-auxiliary owner range drift: ' + target.symbol);
  }
  const linkedBytes = Buffer.from(ownerBytes.subarray(offsetInOwner, offsetInOwner + auxiliary.bytes));
  const expectedBytes = Buffer.from(canonicalBaserom.subarray(auxiliary.romStartNumber, auxiliary.romEndNumber));
  const linkedPadding = verifyAuxiliaryPaddingBytes(
    linkedBytes,
    auxiliary,
    target.symbol + ' ' + auxiliary.outputSection + ' linked bytes',
  );
  verifyAuxiliaryPaddingBytes(
    expectedBytes,
    auxiliary,
    target.symbol + ' ' + auxiliary.outputSection + ' retail bytes',
  );
  const linkedSha256 = sha256Buffer(linkedBytes);
  const expectedSha256 = sha256Buffer(expectedBytes);
  return {
    rawBytesExact: linkedBytes.equals(expectedBytes),
    linkedSha256,
    expectedSha256,
    linkedBytes,
    expectedBytes,
    ownerSectionBytes: ownerBytes.length,
    ownerSectionSha256: sha256Buffer(ownerBytes),
    ownerSymbol: auxiliary.ownerSymbol,
    ownerSymbolValue: ownerSymbols[0].value,
    ...linkedPadding,
  };
}

function isInside(candidate, root) {
  const resolvedCandidate = path.resolve(candidate).toLowerCase();
  const resolvedRoot = path.resolve(root).toLowerCase();
  return resolvedCandidate === resolvedRoot || resolvedCandidate.startsWith(resolvedRoot + path.sep);
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
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) fail('KMC compiler is missing: ' + resolved);
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
  for (const file of Object.values(files)) if (!fs.existsSync(file)) fail('Phase 7 input is incomplete: ' + file);

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
    if (report.verification.outputs[name].sha256 !== hash) fail('Phase 7 recorded ' + name + ' identity drift');
  }
  const renderedLinker = Buffer.from(renderLinkerScript(phase8.model), 'utf8');
  if (!fs.readFileSync(files.linkerScript).equals(renderedLinker)) fail('Phase 7 linker script differs from the accepted model');

  const objectManifest = readJson(files.objectManifest);
  if (objectManifest.schemaVersion !== 1 || !Array.isArray(objectManifest.objects) || objectManifest.objects.length === 0) {
    fail('Phase 7 object manifest schema drift');
  }
  for (const record of objectManifest.objects) {
    const objectFile = resolveRelative(phase7Output, record.path, 'Phase 7 object path');
    if (!fs.existsSync(objectFile) || fs.statSync(objectFile).size !== record.bytes || sha256File(objectFile) !== record.sha256) {
      fail('Phase 7 object identity drift: ' + record.path);
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

function targetsByChunk(phase8) {
  const result = new Map();
  for (const target of phase8.targets) {
    if (!result.has(target.chunkIndex)) result.set(target.chunkIndex, []);
    result.get(target.chunkIndex).push(target);
  }
  return result;
}

function auxiliaryTailRelative(chunkIndex, outputSection, extension) {
  const chunkName = String(chunkIndex).padStart(3, '0');
  const suffix = outputSection.replace(/^\.ob64\./, '').replace(/\./g, '_');
  return 'objects/assembly/auxiliary/chunk_' + chunkName + '_' + suffix + '_tail.' + extension;
}

function validateAuxiliaryTailObject(elf, auxiliary, expectedBytes) {
  if (!Buffer.isBuffer(expectedBytes)
      || expectedBytes.length !== auxiliary.ownerTailBytes
      || sha256Buffer(expectedBytes) !== auxiliary.ownerTailSha256
      || auxiliary.ownerTailSection !== auxiliary.outputSection + '.tail'
      || ['.data', '.bss', '.text', '.rodata'].includes(auxiliary.ownerTailSection)) {
    fail('auxiliary preserved-tail contract drift: ' + auxiliary.outputSection);
  }
  if (elf.sections.some((section) => ['.data', '.bss'].includes(section.name))) {
    fail('auxiliary preserved-tail object contains a forbidden conventional data section: ' + auxiliary.outputSection);
  }
  const sections = elf.sections.filter((section) => section.name === auxiliary.ownerTailSection);
  const unexpectedAllocated = elf.sections.filter((section) => (
    section.size > 0 && (section.flags & 2) !== 0 && section.name !== auxiliary.ownerTailSection
  ));
  if (sections.length !== 1
      || sections[0].type !== 1
      || sections[0].flags !== 2
      || sections[0].alignment !== auxiliary.ownerTailAlignment
      || sections[0].size !== auxiliary.ownerTailBytes
      || unexpectedAllocated.length !== 0) {
    fail('auxiliary preserved-tail object shape drift: ' + auxiliary.outputSection);
  }
  const bytes = Buffer.from(elfSectionBytes(elf, sections[0]));
  if (!bytes.equals(expectedBytes) || sha256Buffer(bytes) !== auxiliary.ownerTailSha256) {
    fail('auxiliary preserved-tail object bytes drift: ' + auxiliary.outputSection);
  }
  return {
    inputSection: auxiliary.ownerTailSection,
    sectionType: 'SHT_PROGBITS',
    sectionFlags: ['SHF_ALLOC'],
    alignment: sections[0].alignment,
    bytes: bytes.length,
    sha256: sha256Buffer(bytes),
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
    if (fs.statSync(destination).size !== record.bytes || sha256File(destination) !== record.sha256) {
      fail('copied Phase 7 object drift: ' + relative);
    }
    linkedObjects.push(relative);
  }

  const replacements = new Map();
  for (const [chunkIndex, chunkTargets] of targetsByChunk(phase8)) {
    const chunkName = String(chunkIndex).padStart(3, '0');
    const chunkRelative = 'objects/assembly/chunk_' + chunkName + '.o';
    if (!linkedObjects.includes(chunkRelative)) fail('target Phase 7 chunk is absent: ' + chunkRelative);
    const linkedChunk = resolveRelative(output, chunkRelative, 'linked target chunk');
    const fallbackRelative = 'comparison/original/chunk_' + chunkName + '.o';
    const fallbackObject = resolveRelative(output, fallbackRelative, 'fallback object');
    ensureDir(path.dirname(fallbackObject));
    fs.copyFileSync(linkedChunk, fallbackObject);

    const originalElf = parseElfFile(fallbackObject);
    const originalTargets = [];
    const auxiliaryGroups = new Map();
    for (const target of chunkTargets) {
      const matches = originalElf.sections.filter((section) => section.name === target.sectionName);
      if (matches.length !== 1 || matches[0].size !== target.bytes) fail('original fallback target section drift: ' + target.symbol);
      const originalBytes = Buffer.from(elfSectionBytes(originalElf, matches[0]));
      if (sha256Buffer(originalBytes) !== target.expectedTextSha256) fail('original fallback target bytes drift: ' + target.symbol);
      originalTargets.push({ target, section: matches[0], bytes: originalBytes });
      for (const auxiliary of target.auxiliarySections || []) {
        if (!auxiliaryGroups.has(auxiliary.ownerRowIndex)) auxiliaryGroups.set(auxiliary.ownerRowIndex, []);
        auxiliaryGroups.get(auxiliary.ownerRowIndex).push({ target, auxiliary });
      }
    }
    const originalAuxiliaryOwners = [];
    for (const members of auxiliaryGroups.values()) {
      const first = members[0];
      const auxiliaryMatches = originalElf.sections.filter((section) => section.name === first.auxiliary.outputSection);
      if (auxiliaryMatches.length !== 1
          || auxiliaryMatches[0].type !== 1
          || auxiliaryMatches[0].flags !== 2
          || auxiliaryMatches[0].size !== first.auxiliary.ownerSectionBytes) {
        fail('original fallback auxiliary section drift: ' + first.target.symbol + ' ' + first.auxiliary.outputSection);
      }
      const ownerBytes = Buffer.from(elfSectionBytes(originalElf, auxiliaryMatches[0]));
      for (const member of members) {
        const offset = member.auxiliary.romStartNumber - member.auxiliary.ownerRomStartNumber;
        const tableBytes = Buffer.from(ownerBytes.subarray(offset, offset + member.auxiliary.bytes));
        verifyAuxiliaryPaddingBytes(
          tableBytes,
          member.auxiliary,
          member.target.symbol + ' ' + member.auxiliary.outputSection + ' original fallback bytes',
        );
        if (tableBytes.length !== member.auxiliary.bytes
            || sha256Buffer(tableBytes) !== member.auxiliary.expectedLinkedSha256) {
          fail('original fallback auxiliary bytes drift: ' + member.target.symbol + ' ' + member.auxiliary.outputSection);
        }
      }
      const final = members[members.length - 1];
      const tailOffset = final.auxiliary.ownerTailRomStartNumber - final.auxiliary.ownerRomStartNumber;
      const tailBytes = Buffer.from(ownerBytes.subarray(tailOffset));
      if (tailBytes.length !== final.auxiliary.ownerTailBytes
          || sha256Buffer(tailBytes) !== final.auxiliary.ownerTailSha256) {
        fail('original fallback shared auxiliary tail drift: ' + final.target.symbol + ' ' + final.auxiliary.outputSection);
      }
      originalAuxiliaryOwners.push({
        members,
        target: final.target,
        auxiliary: final.auxiliary,
        section: auxiliaryMatches[0],
        ownerBytes,
        tailBytes,
      });
    }

    const objcopyArgs = [];
    for (const target of chunkTargets) {
      objcopyArgs.push('--remove-section=' + target.sectionName, '--strip-symbol=' + target.symbol);
    }
    for (const owner of originalAuxiliaryOwners) {
      objcopyArgs.push('--remove-section=' + owner.auxiliary.outputSection);
    }
    run(objcopy, [...objcopyArgs, linkedChunk]);
    const prunedElf = parseElfFile(linkedChunk);
    for (const target of chunkTargets) {
      if (prunedElf.sections.some((section) => section.name === target.sectionName)) fail('target section survived fallback pruning: ' + target.symbol);
      if (prunedElf.symbols.some((symbol) => symbol.name === target.symbol)) fail('target symbol survived fallback pruning: ' + target.symbol);
    }
    for (const owner of originalAuxiliaryOwners) {
      if (prunedElf.sections.some((section) => section.name === owner.auxiliary.outputSection)) {
        fail('auxiliary original owner survived fallback pruning: ' + owner.target.symbol + ' ' + owner.auxiliary.outputSection);
      }
    }

    const excludedSections = new Set([
      ...chunkTargets.map((target) => target.sectionName),
      ...originalAuxiliaryOwners.map((owner) => owner.auxiliary.outputSection),
    ]);
    const originalSections = originalElf.sections.filter((section) => (
      /^\.ob64\.r\d{4}(?:\.s\d+)?$/.test(section.name) && !excludedSections.has(section.name)
    ));
    const prunedSections = prunedElf.sections.filter((section) => /^\.ob64\.r\d{4}(?:\.s\d+)?$/.test(section.name));
    if (originalSections.length !== prunedSections.length) fail('fallback pruning changed another accepted owner section');
    const prunedByName = new Map(prunedSections.map((section) => [section.name, section]));
    for (const section of originalSections) {
      const candidate = prunedByName.get(section.name);
      if (!candidate || candidate.size !== section.size || !Buffer.from(elfSectionBytes(prunedElf, candidate)).equals(elfSectionBytes(originalElf, section))) {
        fail('fallback pruning changed accepted owner bytes: ' + section.name);
      }
    }

    const auxiliaryTails = [];
    for (const owner of originalAuxiliaryOwners) {
      for (const member of owner.members.slice(0, -1)) {
        auxiliaryTails.push({
          symbol: member.target.symbol,
          outputSection: member.auxiliary.outputSection,
          inputSection: null,
          sectionType: 'SHT_PROGBITS',
          sectionFlags: ['SHF_ALLOC'],
          alignment: member.auxiliary.ownerTailAlignment,
          tableBytes: member.auxiliary.bytes,
          entryBytes: member.auxiliary.entryBytes,
          trailingPaddingBytes: member.auxiliary.trailingPaddingBytes,
          trailingPaddingSha256: member.auxiliary.expectedTrailingPaddingSha256,
          tailBytes: 0,
          tailSha256: member.auxiliary.ownerTailSha256,
          romStart: member.auxiliary.ownerTailRomStartNumber,
          romEndExclusive: member.auxiliary.ownerTailRomEndNumber,
          vramStart: member.auxiliary.ownerTailVramStartNumber,
          vramEndExclusive: member.auxiliary.ownerTailVramEndNumber,
          ownerOriginalAssembly: member.auxiliary.ownerOriginalAssembly,
          ownerOriginalAssemblySha256: member.auxiliary.ownerOriginalAssemblySha256,
          binaryRelative: null,
          binarySha256: null,
          objectRelative: null,
          objectSha256: null,
        });
      }
      if (owner.tailBytes.length === 0) {
        auxiliaryTails.push({
          symbol: owner.target.symbol,
          outputSection: owner.auxiliary.outputSection,
          inputSection: null,
          sectionType: 'SHT_PROGBITS',
          sectionFlags: ['SHF_ALLOC'],
          alignment: owner.auxiliary.ownerTailAlignment,
          tableBytes: owner.auxiliary.bytes,
          entryBytes: owner.auxiliary.entryBytes,
          trailingPaddingBytes: owner.auxiliary.trailingPaddingBytes,
          trailingPaddingSha256: owner.auxiliary.expectedTrailingPaddingSha256,
          tailBytes: 0,
          tailSha256: owner.auxiliary.ownerTailSha256,
          romStart: owner.auxiliary.ownerTailRomStartNumber,
          romEndExclusive: owner.auxiliary.ownerTailRomEndNumber,
          vramStart: owner.auxiliary.ownerTailVramStartNumber,
          vramEndExclusive: owner.auxiliary.ownerTailVramEndNumber,
          ownerOriginalAssembly: owner.auxiliary.ownerOriginalAssembly,
          ownerOriginalAssemblySha256: owner.auxiliary.ownerOriginalAssemblySha256,
          binaryRelative: null,
          binarySha256: null,
          objectRelative: null,
          objectSha256: null,
        });
        continue;
      }
      const tailRoot = path.join(output, 'objects', 'assembly', 'auxiliary');
      ensureDir(tailRoot);
      const binaryRelative = auxiliaryTailRelative(chunkIndex, owner.auxiliary.outputSection, 'bin');
      const objectRelative = auxiliaryTailRelative(chunkIndex, owner.auxiliary.outputSection, 'o');
      const binaryFile = resolveRelative(output, binaryRelative, 'auxiliary preserved-tail binary');
      const objectFile = resolveRelative(output, objectRelative, 'auxiliary preserved-tail object');
      fs.writeFileSync(binaryFile, owner.tailBytes);
      fs.copyFileSync(fallbackObject, objectFile);
      const retainedElfMetadata = new Set(['.symtab', '.strtab', '.shstrtab']);
      const seedRemovals = originalElf.sections
        .filter((section) => section.name && !retainedElfMetadata.has(section.name))
        .map((section) => '--remove-section=' + section.name);
      run(objcopy, [
        '--strip-all',
        ...seedRemovals,
        objectRelative,
      ], { cwd: output });
      run(objcopy, [
        '--add-section=' + owner.auxiliary.ownerTailSection + '=' + binaryRelative,
        '--set-section-flags=' + owner.auxiliary.ownerTailSection + '=alloc,load,readonly,data,contents',
        objectRelative,
      ], { cwd: output });
      const tailElf = parseElfFile(objectFile);
      const tailEvidence = validateAuxiliaryTailObject(tailElf, owner.auxiliary, owner.tailBytes);
      auxiliaryTails.push({
        symbol: owner.target.symbol,
        outputSection: owner.auxiliary.outputSection,
        inputSection: tailEvidence.inputSection,
        sectionType: tailEvidence.sectionType,
        sectionFlags: tailEvidence.sectionFlags,
        alignment: tailEvidence.alignment,
        tableBytes: owner.auxiliary.bytes,
        entryBytes: owner.auxiliary.entryBytes,
        trailingPaddingBytes: owner.auxiliary.trailingPaddingBytes,
        trailingPaddingSha256: owner.auxiliary.expectedTrailingPaddingSha256,
        tailBytes: owner.tailBytes.length,
        tailSha256: sha256Buffer(owner.tailBytes),
        romStart: owner.auxiliary.ownerTailRomStartNumber,
        romEndExclusive: owner.auxiliary.ownerTailRomEndNumber,
        vramStart: owner.auxiliary.ownerTailVramStartNumber,
        vramEndExclusive: owner.auxiliary.ownerTailVramEndNumber,
        ownerOriginalAssembly: owner.auxiliary.ownerOriginalAssembly,
        ownerOriginalAssemblySha256: owner.auxiliary.ownerOriginalAssemblySha256,
        binaryRelative,
        binarySha256: sha256File(binaryFile),
        objectRelative,
        objectSha256: sha256File(objectFile),
      });
    }

    const replacement = {
      chunkIndex,
      linkedChunkRelative: chunkRelative,
      fallbackRelative,
      fallbackSha256: sha256File(fallbackObject),
      prunedSha256: sha256File(linkedChunk),
      preservedTargetChunkSections: originalSections.length,
      targets: chunkTargets,
      auxiliaryTails,
    };
    replacements.set(chunkIndex, replacement);
  }
  return { linkedObjects, replacements };
}

function rawRelocationRecords(elf) {
  const typeNames = {
    2: 'R_MIPS_32',
    4: 'R_MIPS_26',
    5: 'R_MIPS_HI16',
    6: 'R_MIPS_LO16',
  };
  const symbolTables = new Map();
  for (const symbol of elf.symbols) {
    if (!Number.isInteger(symbol.symbolTableIndex) || !Number.isInteger(symbol.symbolIndex)) continue;
    if (!symbolTables.has(symbol.symbolTableIndex)) symbolTables.set(symbol.symbolTableIndex, new Map());
    symbolTables.get(symbol.symbolTableIndex).set(symbol.symbolIndex, symbol);
  }
  const records = [];
  for (const section of elf.sections.filter((candidate) => candidate.type === 9)) {
    if (section.entrySize !== 8 || section.offset + section.size > elf.buffer.length) fail('ELF relocation section is invalid: ' + section.name);
    const symbols = symbolTables.get(section.link);
    if (!symbols) fail('ELF relocation symbol table is missing: ' + section.name);
    const count = section.size / section.entrySize;
    for (let index = 0; index < count; index += 1) {
      const offset = section.offset + index * section.entrySize;
      const relocationOffset = elf.buffer.readUInt32BE(offset);
      const info = elf.buffer.readUInt32BE(offset + 4);
      const symbol = symbols.get(info >>> 8);
      const type = typeNames[info & 0xff];
      if (!symbol || type === undefined) fail('unsupported ELF relocation entry: ' + section.name);
      records.push({
        offset: hex(relocationOffset),
        type,
        symbol: symbol.name,
        symbolSectionIndex: symbol.sectionIndex,
        symbolType: symbol.symbolType,
        symbolValue: symbol.value,
        section: section.name,
      });
    }
  }
  return records;
}

function sortRelocationRecords(records) {
  return records.sort((left, right) => {
    const leftRank = left.section === '.rel.text' ? 0 : 1;
    const rightRank = right.section === '.rel.text' ? 0 : 1;
    if (leftRank !== rightRank) return leftRank - rightRank;
    return Number.parseInt(left.offset.slice(2), 16) - Number.parseInt(right.offset.slice(2), 16);
  });
}

function expectedCompilerTextFunctionEvidence(target, linked = false) {
  const base = linked ? target.vramStartNumber : 0;
  return target.compilerTextFunctions.map((expected) => ({
    symbol: expected.symbol,
    offset: expected.offset,
    bytes: expected.bytes,
    binding: expected.binding,
    entryEvidence: expected.entryEvidence,
    value: hex(base + expected.offsetNumber),
  }));
}

function verifyCompilerTextFunctions(elf, target, section, linked = false) {
  if (!section || !Array.isArray(target.compilerTextFunctions) || target.compilerTextFunctions.length === 0) {
    fail('compiler text-function verification metadata is malformed: ' + target.symbol);
  }
  const base = linked ? target.vramStartNumber : 0;
  const allFunctions = elf.symbols.filter((symbol) => (
    symbol.sectionIndex === section.index && symbol.symbolType === 2
  ));
  const actual = target.compilerTextFunctionsExplicit
    ? allFunctions
    : allFunctions.filter((symbol) => symbol.name === target.symbol);
  if (actual.length !== target.compilerTextFunctions.length) {
    fail('compiler text-function symbol census drift: ' + target.symbol);
  }
  const evidence = expectedCompilerTextFunctionEvidence(target, linked);
  for (const expected of target.compilerTextFunctions) {
    const matches = actual.filter((symbol) => symbol.name === expected.symbol);
    const expectedBinding = expected.binding === 'GLOBAL' ? 1 : 0;
    if (matches.length !== 1
        || matches[0].value !== base + expected.offsetNumber
        || matches[0].size !== expected.bytes
        || matches[0].binding !== expectedBinding
        || matches[0].visibility !== 0) {
      fail('compiler text-function symbol placement drift: ' + target.symbol + ' ' + expected.symbol);
    }
  }
  return evidence;
}

function relocationRecords(elf, target) {
  const targetSections = elf.sections.filter((section) => section.name === target.sectionName);
  if (targetSections.length !== 1) fail('target relocation section owner drift: ' + target.symbol);
  const targetSection = targetSections[0];
  const compilerTextFunctions = Array.isArray(target.compilerTextFunctions)
    ? target.compilerTextFunctions
    : [{ symbol: target.symbol, offsetNumber: 0 }];
  const auxiliaryBySectionIndex = new Map();
  for (const auxiliary of target.auxiliarySections || []) {
    const sections = elf.sections.filter((section) => section.name === auxiliary.outputSection);
    if (sections.length !== 1) fail('auxiliary relocation section owner drift: ' + target.symbol);
    auxiliaryBySectionIndex.set(sections[0].index, auxiliary);
  }
  const records = rawRelocationRecords(elf)
    .filter((record) => record.section === '.rel' + target.sectionName)
    .map((record) => {
      let symbol = record.symbol;
      const contractedFunction = compilerTextFunctions.find((entry) => entry.symbol === record.symbol);
      if ((contractedFunction
            && record.symbolType === 2
            && record.symbolSectionIndex === targetSection.index
            && record.symbolValue === contractedFunction.offsetNumber)
          || (record.symbolType === 3 && record.symbolSectionIndex === targetSection.index && record.symbolValue === 0)) {
        symbol = '.text';
      } else if (record.symbolType === 3
          && record.symbolValue === 0
          && auxiliaryBySectionIndex.has(record.symbolSectionIndex)) {
        symbol = auxiliaryBySectionIndex.get(record.symbolSectionIndex).compilerSection;
      }
      return {
        offset: record.offset,
        type: record.type,
        symbol,
        section: '.rel.text',
      };
    });
  return sortRelocationRecords(records);
}

function auxiliaryRelocationRecords(elf, target, auxiliary) {
  const targetSections = elf.sections.filter((section) => section.name === target.sectionName);
  const auxiliarySections = elf.sections.filter((section) => section.name === auxiliary.outputSection);
  if (targetSections.length !== 1 || auxiliarySections.length !== 1) {
    fail('auxiliary relocation owner drift: ' + target.symbol + ' ' + auxiliary.outputSection);
  }
  const targetSection = targetSections[0];
  const auxiliarySection = auxiliarySections[0];
  const auxiliaryBytes = Buffer.from(elfSectionBytes(elf, auxiliarySection));
  const records = rawRelocationRecords(elf)
    .filter((record) => record.section === '.rel' + auxiliary.outputSection)
    .map((record) => {
      const offset = Number.parseInt(record.offset.slice(2), 16);
      if (offset < 0 || offset + 4 > auxiliary.entryBytes || offset % 4 !== 0
          || record.type !== 'R_MIPS_32'
          || record.symbolType !== 3
          || record.symbolSectionIndex !== targetSection.index
          || record.symbolValue !== 0) {
        fail('auxiliary local-label relocation drift: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
      return {
        offset: record.offset,
        type: record.type,
        symbol: '.text',
        addend: hex(auxiliaryBytes.readUInt32BE(offset)),
        section: '.rel.rodata',
      };
    });
  return records.sort((left, right) => (
    Number.parseInt(left.offset.slice(2), 16) - Number.parseInt(right.offset.slice(2), 16)
  ));
}

function validateTargetClassification(target, classification) {
  if (!classification || typeof classification !== 'object'
      || classification.symbol !== target.symbol
      || classification.source !== target.source
      || classification.bytes !== target.bytes
      || classification.sourceSha256 !== target.sourceSha256
      || typeof classification.digest !== 'string'
      || !/^[0-9A-F]{64}$/.test(classification.digest)
      || ![SOURCE_CLASSES.PURE_C, SOURCE_CLASSES.HYBRID_C].includes(classification.class)) {
    fail('active target source classification drift: ' + target.symbol);
  }
  return classification;
}

function validateTargetClassifications(phase8, sourcePolicy) {
  if (!sourcePolicy || sourcePolicy.schemaVersion !== 1 || sourcePolicy.status !== 'pass'
      || !Array.isArray(sourcePolicy.targets) || sourcePolicy.targets.length !== phase8.targets.length) {
    fail('active target source-classification census drift');
  }
  const bySymbol = new Map();
  for (const classification of sourcePolicy.targets) {
    if (!classification || typeof classification.symbol !== 'string' || bySymbol.has(classification.symbol)) {
      fail('active target source-classification symbol drift');
    }
    bySymbol.set(classification.symbol, classification);
  }
  for (const target of phase8.targets) validateTargetClassification(target, bySymbol.get(target.symbol));
  const expectedCounts = Object.fromEntries(Object.values(SOURCE_CLASSES).map((name) => [
    name,
    sourcePolicy.targets.filter((classification) => classification.class === name).length,
  ]));
  const expectedBytes = Object.fromEntries(Object.values(SOURCE_CLASSES).map((name) => [
    name,
    sourcePolicy.targets.filter((classification) => classification.class === name).reduce((sum, classification) => sum + classification.bytes, 0),
  ]));
  if (!sameJson(sourcePolicy.counts, expectedCounts) || !sameJson(sourcePolicy.bytes, expectedBytes)) {
    fail('active target source-classification aggregate drift');
  }
  return bySymbol;
}

function compileTarget(phase8, target, output, compiler, assembler, objcopy, options = {}) {
  const enforceAcceptedContract = options.enforceAcceptedContract !== false;
  const acceptedAuxiliarySections = target.auxiliarySections || [];
  const classification = validateTargetClassification(target, options.classification);
  const generatedRoot = path.join(output, 'generated', 'c');
  const objectRoot = path.join(output, 'objects', 'c');
  ensureDir(generatedRoot);
  ensureDir(objectRoot);
  const compilerAssembly = path.join(generatedRoot, target.symbol + '.compiler.s');
  const linkedAssembly = path.join(generatedRoot, target.symbol + '.s');
  const objectFile = path.join(objectRoot, target.symbol + '.o');
  const proofObjectFile = path.join(objectRoot, target.symbol + '.source-object.o');
  const sourceRelative = safeRelative(target.source, 'target source');
  run(compiler, [...phase8.config.compiler.compileFlags, '-o', compilerAssembly, sourceRelative], { cwd: ROOT });

  const compilerBytes = fs.readFileSync(compilerAssembly);
  const linkedBytes = adjustSectionAssembly(compilerBytes, target.sectionName, {
    allowAuxiliaryReadOnlySections: options.allowAuxiliaryReadOnlySections === true,
    auxiliarySections: acceptedAuxiliarySections,
    legalizeCop1BinaryInstructions: options.legalizeCop1BinaryInstructions === true,
  });
  fs.writeFileSync(linkedAssembly, linkedBytes);
  run(assembler, [
    ...phase8.model.config.binutils.compilerAssemblerFlags,
    '-o',
    normalizePath(path.relative(output, proofObjectFile)),
    normalizePath(path.relative(output, linkedAssembly)),
  ], { cwd: output });

  const elf = parseElfFile(proofObjectFile);
  const sections = elf.sections.filter((section) => section.name === target.sectionName);
  if (sections.length !== 1 || sections[0].type !== 1 || (sections[0].flags & 6) !== 6
      || (enforceAcceptedContract && sections[0].size !== target.bytes)) {
    fail('KMC target object section shape drift: ' + target.symbol);
  }
  const textBytes = Buffer.from(elfSectionBytes(elf, sections[0]));
  const compilerTextFunctions = verifyCompilerTextFunctions(elf, target, sections[0]);
  for (const name of ['.data', '.bss']) {
    const section = elf.sections.find((candidate) => candidate.name === name);
    if (section && section.size !== 0) fail('KMC target unexpectedly owns ' + name + ' bytes: ' + target.symbol);
  }
  const auxiliaryRecords = [];
  for (const auxiliary of acceptedAuxiliarySections) {
    const matches = elf.sections.filter((section) => section.name === auxiliary.outputSection);
    if (matches.length !== 1
        || matches[0].type !== 1
        || matches[0].flags !== 2
        || matches[0].alignment !== auxiliary.alignment
        || matches[0].size !== auxiliary.bytes) {
      fail('KMC auxiliary object section shape drift: ' + target.symbol + ' ' + auxiliary.outputSection);
    }
    const bytes = Buffer.from(elfSectionBytes(elf, matches[0]));
    const paddingEvidence = verifyAuxiliaryPaddingBytes(
      bytes,
      auxiliary,
      target.symbol + ' ' + auxiliary.outputSection + ' source object',
    );
    if (sha256Buffer(bytes) !== auxiliary.expectedObjectSha256) {
      fail('KMC auxiliary object bytes drift: ' + target.symbol + ' ' + auxiliary.outputSection);
    }
    const auxiliaryRelocations = auxiliaryRelocationRecords(elf, target, auxiliary);
    if (!sameJson(auxiliaryRelocations, auxiliary.expectedRelocations)) {
      fail('KMC auxiliary relocation contract drift: ' + target.symbol + ' ' + auxiliary.outputSection);
    }
    auxiliaryRecords.push({
      compilerSection: auxiliary.compilerSection,
      outputSection: auxiliary.outputSection,
      bytes: bytes.length,
      sha256: sha256Buffer(bytes),
      alignment: matches[0].alignment,
      flags: matches[0].flags,
      relocations: auxiliaryRelocations,
      ...paddingEvidence,
    });
  }
  const acceptedAllocSections = new Set([
    target.sectionName,
    ...acceptedAuxiliarySections.map((auxiliary) => auxiliary.outputSection),
    '.reginfo',
  ]);
  const unexpectedAllocSections = elf.sections.filter((section) => (
    section.size > 0 && (section.flags & 2) !== 0 && !acceptedAllocSections.has(section.name)
  ));
  if (enforceAcceptedContract && unexpectedAllocSections.length > 0) {
    fail('KMC target owns an uncontracted allocated section: ' + target.symbol + ' ' + unexpectedAllocSections[0].name);
  }
  const relocations = relocationRecords(elf, target);
  if (enforceAcceptedContract && !sameJson(relocations, target.expectedRelocations)) {
    fail('KMC target relocation contract drift: ' + target.symbol);
  }
  run(objcopy, [
    '--remove-section=.reginfo',
    '--remove-section=.pdr',
    '--remove-section=.comment',
    '--remove-section=.note',
    normalizePath(path.relative(output, proofObjectFile)),
    normalizePath(path.relative(output, objectFile)),
  ], { cwd: output });
  const linkedObjectElf = parseElfFile(objectFile);
  const linkedSections = linkedObjectElf.sections.filter((section) => section.name === target.sectionName);
  if (linkedSections.length !== 1 || !Buffer.from(elfSectionBytes(linkedObjectElf, linkedSections[0])).equals(textBytes)) {
    fail('ancillary-section removal changed target bytes: ' + target.symbol);
  }
  if (!sameJson(
    verifyCompilerTextFunctions(linkedObjectElf, target, linkedSections[0]),
    compilerTextFunctions,
  )) {
    fail('ancillary-section removal changed compiler text-function evidence: ' + target.symbol);
  }
  for (const auxiliary of acceptedAuxiliarySections) {
    const sourceSection = elf.sections.find((section) => section.name === auxiliary.outputSection);
    const linkedMatches = linkedObjectElf.sections.filter((section) => section.name === auxiliary.outputSection);
    if (linkedMatches.length !== 1
        || linkedMatches[0].type !== sourceSection.type
        || linkedMatches[0].flags !== sourceSection.flags
        || linkedMatches[0].alignment !== sourceSection.alignment
        || !Buffer.from(elfSectionBytes(linkedObjectElf, linkedMatches[0])).equals(elfSectionBytes(elf, sourceSection))
        || !sameJson(auxiliaryRelocationRecords(linkedObjectElf, target, auxiliary), auxiliary.expectedRelocations)) {
      fail('ancillary-section removal changed auxiliary evidence: ' + target.symbol + ' ' + auxiliary.outputSection);
    }
  }
  return {
    symbol: target.symbol,
    objectRelative: 'objects/c/' + target.symbol + '.o',
    objectSha256: sha256File(objectFile),
    proofObjectRelative: 'objects/c/' + target.symbol + '.source-object.o',
    proofObjectSha256: sha256File(proofObjectFile),
    compilerAssemblyRelative: 'generated/c/' + target.symbol + '.compiler.s',
    compilerAssemblySha256: sha256File(compilerAssembly),
    linkedAssemblyRelative: 'generated/c/' + target.symbol + '.s',
    linkedAssemblySha256: sha256File(linkedAssembly),
    sourceClass: classification.class,
    sourcePolicyDigest: classification.digest,
    compilerAssemblyRewritten: false,
    textBytes: textBytes.length,
    textSha256: sha256Buffer(textBytes),
    compilerTextFunctions,
    relocations,
    auxiliarySections: auxiliaryRecords,
  };
}

function fileIdentity(output, relative, label) {
  const file = resolveRelative(output, relative, label);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail(label + ' is missing: ' + file);
  return {
    path: safeRelative(relative, label),
    bytes: fs.statSync(file).size,
    sha256: sha256File(file),
  };
}

function deriveSourceObjectProof(phase8, target, output, classification, linkedElf, canonicalBaserom) {
  validateTargetClassification(target, classification);
  const compilerRelative = 'generated/c/' + target.symbol + '.compiler.s';
  const sectionRelative = 'generated/c/' + target.symbol + '.s';
  const objectRelative = 'objects/c/' + target.symbol + '.source-object.o';
  const linkedObjectRelative = 'objects/c/' + target.symbol + '.o';
  const compilerArtifact = fileIdentity(output, compilerRelative, 'compiler assembly');
  const sectionArtifact = fileIdentity(output, sectionRelative, 'section-adjusted assembly');
  const objectArtifact = fileIdentity(output, objectRelative, 'matching C object');
  const linkedObjectArtifact = fileIdentity(output, linkedObjectRelative, 'linked matching C object');
  const compilerBytes = fs.readFileSync(resolveRelative(output, compilerRelative, 'compiler assembly'));
  const expectedSectionBytes = adjustSectionAssembly(compilerBytes, target.sectionName, {
    auxiliarySections: target.auxiliarySections || [],
  });
  const actualSectionBytes = fs.readFileSync(resolveRelative(output, sectionRelative, 'section-adjusted assembly'));
  if (!expectedSectionBytes.equals(actualSectionBytes)) {
    fail('section-adjusted assembly differs from untouched compiler output plus the accepted section change: ' + target.symbol);
  }

  const objectElf = parseElfFile(resolveRelative(output, objectRelative, 'matching C object'));
  const objectSections = objectElf.sections.filter((section) => section.name === target.sectionName);
  if (objectSections.length !== 1 || objectSections[0].type !== 1 || (objectSections[0].flags & 6) !== 6) {
    fail('source-to-object proof section shape drift: ' + target.symbol);
  }
  const objectText = Buffer.from(elfSectionBytes(objectElf, objectSections[0]));
  const objectTextFunctions = verifyCompilerTextFunctions(objectElf, target, objectSections[0]);
  const allRelocations = rawRelocationRecords(objectElf);
  const loadRelocationSections = new Set(['.rel' + target.sectionName]);
  const rawLoadRelevant = allRelocations.filter((record) => record.section === '.rel' + target.sectionName);
  const normalizedLoadRelevant = relocationRecords(objectElf, target);
  if (!sameJson(normalizedLoadRelevant, target.expectedRelocations)) {
    fail('source-to-object load-relevant relocation drift: ' + target.symbol);
  }
  const rawComparison = compareLinkedTargetBytes(target, linkedElf, canonicalBaserom);
  const linkedTextSections = linkedElf.sections.filter((section) => section.name === target.sectionName);
  if (linkedTextSections.length !== 1) fail('source-to-object linked text owner drift: ' + target.symbol);
  const linkedTextFunctions = verifyCompilerTextFunctions(linkedElf, target, linkedTextSections[0], true);
  const auxiliaryProofs = (target.auxiliarySections || []).map((auxiliary) => {
    const sections = objectElf.sections.filter((section) => section.name === auxiliary.outputSection);
    if (sections.length !== 1
        || sections[0].type !== 1
        || sections[0].flags !== 2
        || sections[0].alignment !== auxiliary.alignment
        || sections[0].size !== auxiliary.bytes) {
      fail('source-to-object auxiliary section shape drift: ' + target.symbol + ' ' + auxiliary.outputSection);
    }
    const bytes = Buffer.from(elfSectionBytes(objectElf, sections[0]));
    const paddingEvidence = verifyAuxiliaryPaddingBytes(
      bytes,
      auxiliary,
      target.symbol + ' ' + auxiliary.outputSection + ' proof object',
    );
    const relocationSection = '.rel' + auxiliary.outputSection;
    loadRelocationSections.add(relocationSection);
    const rawRelocations = allRelocations.filter((record) => record.section === relocationSection);
    const normalizedRelocations = auxiliaryRelocationRecords(objectElf, target, auxiliary);
    const linkedComparison = compareLinkedAuxiliaryBytes(target, auxiliary, linkedElf, canonicalBaserom);
    if (sha256Buffer(bytes) !== auxiliary.expectedObjectSha256
        || !sameJson(normalizedRelocations, auxiliary.expectedRelocations)
        || linkedComparison.linkedSha256 !== auxiliary.expectedLinkedSha256
        || linkedComparison.expectedSha256 !== auxiliary.expectedLinkedSha256
        || linkedComparison.rawBytesExact !== true) {
      fail('source-to-object auxiliary evidence drift: ' + target.symbol + ' ' + auxiliary.outputSection);
    }
    return {
      kind: auxiliary.kind,
      compilerSection: auxiliary.compilerSection,
      outputSection: auxiliary.outputSection,
      sectionType: auxiliary.sectionType,
      sectionFlags: auxiliary.sectionFlags,
      alignment: auxiliary.alignment,
      objectBytes: bytes.length,
      objectSha256: sha256Buffer(bytes),
      acceptedObjectSha256: auxiliary.expectedObjectSha256,
      entryBytes: paddingEvidence.entryBytes,
      trailingPaddingBytes: paddingEvidence.trailingPaddingBytes,
      trailingPaddingSha256: paddingEvidence.trailingPaddingSha256,
      acceptedTrailingPaddingSha256: auxiliary.expectedTrailingPaddingSha256,
      loadRelevantRelocationsRaw: rawRelocations,
      loadRelevantRelocationsNormalized: normalizedRelocations,
      acceptedLoadRelevantRelocations: auxiliary.expectedRelocations,
      finalPlacement: {
        romStart: auxiliary.romStart,
        romEndExclusive: auxiliary.romEndExclusive,
        vramStart: auxiliary.vramStart,
        vramEndExclusive: auxiliary.vramEndExclusive,
        bytes: auxiliary.bytes,
        entryBytes: auxiliary.entryBytes,
        trailingPaddingBytes: auxiliary.trailingPaddingBytes,
        ownerRowIndex: auxiliary.ownerRowIndex,
        ownerSection: auxiliary.outputSection,
        ownerSectionBytes: auxiliary.ownerSectionBytes,
        ownerSymbol: auxiliary.ownerSymbol,
        ownerSymbolVram: hex(auxiliary.ownerSymbolVram),
      },
      linkedSha256: linkedComparison.linkedSha256,
      expectedLinkedSha256: auxiliary.expectedLinkedSha256,
      rawBytesExact: linkedComparison.rawBytesExact,
    };
  });
  const ancillary = allRelocations.filter((record) => !loadRelocationSections.has(record.section));
  const proof = {
    schemaVersion: 2,
    kind: 'ob64-source-to-object-load-evidence',
    target: {
      symbol: target.symbol,
      sectionName: target.sectionName,
      source: target.source,
      sourceSha256: target.sourceSha256,
      sourceClass: classification.class,
      sourcePolicyDigest: classification.digest,
      relocationContractSource: target.relocationContractSource,
    },
    toolchain: {
      compiler: {
        manifestPath: phase8.config.compiler.manifest,
        manifestSha256: phase8.config.compiler.manifestSha256,
        executableSha256: phase8.config.compiler.executableSha256,
        flags: phase8.config.compiler.compileFlags,
      },
      assembler: phase8.toolchain.identity,
    },
    assemblyContract: {
      compilerAssemblyRewritten: false,
      permittedAdjustment: auxiliaryProofs.length === 0
        ? 'replace the sole .text directive with the accepted target section directive'
        : 'assign the two .text regions and sole contracted .rodata region to their accepted output sections',
      auxiliarySectionCount: auxiliaryProofs.length,
    },
    artifacts: {
      compilerAssembly: compilerArtifact,
      sectionAdjustedAssembly: sectionArtifact,
      object: objectArtifact,
      linkedObjectAfterAncillaryRemoval: linkedObjectArtifact,
    },
    finalObject: {
      sectionName: target.sectionName,
      textBytes: objectText.length,
      textSha256: sha256Buffer(objectText),
      compilerTextFunctions: objectTextFunctions,
      loadRelevantRelocationsRaw: rawLoadRelevant,
      loadRelevantRelocationsNormalized: normalizedLoadRelevant,
      acceptedLoadRelevantRelocations: target.expectedRelocations,
      auxiliarySections: auxiliaryProofs,
      ancillaryDiscardedRelocations: ancillary,
      legacyPdrRelocationsRetired: target.legacyAncillaryRelocations,
      linkedAncillarySectionsRemoved: ['.reginfo', '.pdr', '.comment', '.note'],
    },
    finalTarget: {
      path: 'phase8.elf',
      sectionName: target.sectionName,
      romStart: target.romStart,
      romEndExclusive: target.romEndExclusive,
      vramStart: target.vramStart,
      bytes: target.bytes,
      linkedSha256: rawComparison.linkedTargetSha256,
      expectedSha256: rawComparison.expectedTargetSha256,
      rawBytesExact: rawComparison.rawBytesExact,
      compilerTextFunctions: linkedTextFunctions,
      auxiliarySections: auxiliaryProofs.map((auxiliary) => ({
        compilerSection: auxiliary.compilerSection,
        outputSection: auxiliary.outputSection,
        ...auxiliary.finalPlacement,
        linkedSha256: auxiliary.linkedSha256,
        expectedLinkedSha256: auxiliary.expectedLinkedSha256,
        rawBytesExact: auxiliary.rawBytesExact,
      })),
    },
  };
  const proofBytes = Buffer.from(`${JSON.stringify(proof, null, 2)}\n`, 'utf8');
  return { proof, proofBytes, rawComparison };
}

function writeSourceObjectProofs(phase8, options) {
  const output = path.resolve(options.output);
  const classificationBySymbol = validateTargetClassifications(phase8, options.sourcePolicy);
  if (!(options.compiled instanceof Map) || options.compiled.size !== phase8.targets.length) {
    fail('compiled target census is missing before source-to-object proof generation');
  }
  const linkedElf = parseElfFile(path.join(output, 'phase8.elf'));
  const canonicalBaserom = loadCanonicalBaserom(phase8);
  const proofs = new Map();
  for (const target of phase8.targets) {
    const compiled = options.compiled.get(target.symbol);
    const classification = classificationBySymbol.get(target.symbol);
    if (!compiled || compiled.sourceClass !== classification.class || compiled.sourcePolicyDigest !== classification.digest) {
      fail('compiled target classification provenance drift: ' + target.symbol);
    }
    const derived = deriveSourceObjectProof(phase8, target, output, classification, linkedElf, canonicalBaserom);
    const proofRelative = 'generated/c/' + target.symbol + '.source-object-proof.json';
    const proofFile = resolveRelative(output, proofRelative, 'source-to-object proof');
    fs.writeFileSync(proofFile, derived.proofBytes);
    const record = { path: proofRelative, bytes: derived.proofBytes.length, sha256: sha256Buffer(derived.proofBytes), proof: derived.proof };
    proofs.set(target.symbol, record);
    compiled.sourceObjectProofRelative = record.path;
    compiled.sourceObjectProofBytes = record.bytes;
    compiled.sourceObjectProofSha256 = record.sha256;
  }
  return proofs;
}

function validateSourceObjectProofBytes(actualBytes, expectedBytes) {
  if (!Buffer.isBuffer(actualBytes) || !Buffer.isBuffer(expectedBytes)) fail('source-to-object proof validation requires byte buffers');
  let actual;
  try {
    actual = JSON.parse(actualBytes.toString('utf8'));
  } catch (_) {
    fail('source-to-object proof is not valid JSON');
  }
  if (!actual || actual.schemaVersion !== 2 || actual.kind !== 'ob64-source-to-object-load-evidence'
      || !actual.target || !actual.toolchain || !actual.assemblyContract || !actual.artifacts
      || !actual.finalObject || !actual.finalTarget || actual.assemblyContract.compilerAssemblyRewritten !== false
      || !Number.isInteger(actual.assemblyContract.auxiliarySectionCount)
      || !Array.isArray(actual.finalObject.auxiliarySections)
      || !Array.isArray(actual.finalTarget.auxiliarySections)
      || Object.prototype.hasOwnProperty.call(actual.assemblyContract, 'adapterApplied')) {
    fail('source-to-object proof schema drift');
  }
  if (!actualBytes.equals(expectedBytes)) fail('source-to-object proof differs from independent reconstruction');
  return actual;
}

function verifySourceObjectProofs(phase8, options) {
  const output = path.resolve(options.output);
  const sourcePolicy = classifyTargetSources(phase8.targets);
  const classificationBySymbol = validateTargetClassifications(phase8, sourcePolicy);
  const linkedElf = options.linkedElf || parseElfFile(path.join(output, 'phase8.elf'));
  const canonicalBaserom = options.canonicalBaserom || loadCanonicalBaserom(phase8);
  const records = [];
  for (const target of phase8.targets) {
    const classification = classificationBySymbol.get(target.symbol);
    const derived = deriveSourceObjectProof(phase8, target, output, classification, linkedElf, canonicalBaserom);
    const proofRelative = 'generated/c/' + target.symbol + '.source-object-proof.json';
    const proofFile = resolveRelative(output, proofRelative, 'source-to-object proof');
    if (!fs.existsSync(proofFile)) fail('source-to-object proof is missing: ' + target.symbol);
    try {
      validateSourceObjectProofBytes(fs.readFileSync(proofFile), derived.proofBytes);
    } catch (error) {
      fail(error.message + ': ' + target.symbol);
    }
    records.push({
      symbol: target.symbol,
      sourceClass: classification.class,
      sourcePolicyDigest: classification.digest,
      compilerAssemblyRewritten: false,
      auxiliarySections: derived.proof.finalObject.auxiliarySections.length,
      loadRelevantRelocations: derived.proof.finalObject.loadRelevantRelocationsNormalized.length
        + derived.proof.finalObject.auxiliarySections.reduce((sum, auxiliary) => (
          sum + auxiliary.loadRelevantRelocationsNormalized.length
        ), 0),
      relocationContractSource: target.relocationContractSource,
      ancillaryRelocations: derived.proof.finalObject.ancillaryDiscardedRelocations.length,
      retiredPdrRelocations: target.legacyAncillaryRelocations.length,
      proof: { path: proofRelative, bytes: derived.proofBytes.length, sha256: sha256Buffer(derived.proofBytes) },
    });
  }
  return {
    identity: phase8.toolchain.identity,
    sourcePolicy: {
      config: { path: normalizePath(path.relative(ROOT, POLICY_CONFIG_PATH)), sha256: sha256File(POLICY_CONFIG_PATH) },
      counts: sourcePolicy.counts,
      bytes: sourcePolicy.bytes,
    },
    counts: {
      proofTargets: records.length,
      pureTargets: records.filter((record) => record.sourceClass === SOURCE_CLASSES.PURE_C).length,
      hybridTargets: records.filter((record) => record.sourceClass === SOURCE_CLASSES.HYBRID_C).length,
      compilerAssemblyRewrites: 0,
      auxiliarySections: records.reduce((sum, record) => sum + record.auxiliarySections, 0),
      loadRelevantRelocations: records.reduce((sum, record) => sum + record.loadRelevantRelocations, 0),
      ancillaryRelocations: records.reduce((sum, record) => sum + record.ancillaryRelocations, 0),
      retiredPdrRelocations: records.reduce((sum, record) => sum + record.retiredPdrRelocations, 0),
    },
    targets: records,
  };
}

function writeObjectManifest(output, linkedObjects, phase8, replacements, compiledBySymbol) {
  const objects = [];
  const chunkTargets = targetsByChunk(phase8);
  for (const relative of linkedObjects) {
    const file = resolveRelative(output, relative, 'linked object');
    const replacement = [...replacements.values()].find((candidate) => candidate.linkedChunkRelative === relative);
    objects.push({
      path: relative,
      bytes: fs.statSync(file).size,
      sha256: sha256File(file),
      ownerKind: replacement ? 'accepted-assembly-chunk-with-targets-removed' : 'accepted-phase7-object',
    });
    if (replacement) {
      for (const target of chunkTargets.get(replacement.chunkIndex)) {
        const compiled = compiledBySymbol.get(target.symbol);
        const cFile = resolveRelative(output, compiled.objectRelative, 'matching C object');
        objects.push({
          path: compiled.objectRelative,
          bytes: fs.statSync(cFile).size,
          sha256: sha256File(cFile),
          ownerKind: 'matching-c-target',
          targetSection: target.sectionName,
          targetSymbol: target.symbol,
          auxiliarySections: target.auxiliarySections.map((auxiliary) => auxiliary.outputSection),
        });
      }
      for (const tail of replacement.auxiliaryTails) {
        if (!tail.objectRelative) continue;
        const tailFile = resolveRelative(output, tail.objectRelative, 'auxiliary preserved-tail object');
        objects.push({
          path: tail.objectRelative,
          bytes: fs.statSync(tailFile).size,
          sha256: sha256File(tailFile),
          ownerKind: 'accepted-assembly-auxiliary-tail',
          targetSymbol: tail.symbol,
          outputSection: tail.outputSection,
          inputSection: tail.inputSection,
          sectionType: tail.sectionType,
          sectionFlags: tail.sectionFlags,
          alignment: tail.alignment,
          tailBytes: tail.tailBytes,
          tailSha256: tail.tailSha256,
          romStart: tail.romStart,
          romEndExclusive: tail.romEndExclusive,
          vramStart: tail.vramStart,
          vramEndExclusive: tail.vramEndExclusive,
          ownerOriginalAssembly: tail.ownerOriginalAssembly,
          ownerOriginalAssemblySha256: tail.ownerOriginalAssemblySha256,
        });
      }
    }
  }
  const comparisonObjects = [...replacements.values()].map((replacement) => {
    const file = resolveRelative(output, replacement.fallbackRelative, 'fallback object');
    return {
      path: replacement.fallbackRelative,
      bytes: fs.statSync(file).size,
      sha256: replacement.fallbackSha256,
      ownerKind: 'original-assembly-fallback-and-comparison',
    };
  });
  const manifestFile = path.join(output, 'objects', 'manifest.json');
  writeJson(manifestFile, {
    schemaVersion: 4,
    generator: 'tools/build_phase8_matching_c.js',
    targets: phase8.targets.map((target) => target.symbol),
    linkedObjects: objects,
    comparisonObjects,
  });
  return {
    file: manifestFile,
    linkedObjects: objects,
    comparisonObjects,
    sha256: sha256File(manifestFile),
    bytes: fs.statSync(manifestFile).size,
  };
}

function writeLayout(phase8, phase7, output, replacements) {
  const layout = readJson(phase7.files.layout);
  for (const target of phase8.targets) {
    const owner = layout.owners.find((item) => item.index === target.rowIndex);
    if (!owner || owner.primaryId !== target.primaryId || owner.slices.length !== 1 || owner.slices[0].sectionName !== target.sectionName) {
      fail('Phase 7 target layout row drift: ' + target.symbol);
    }
    owner.baseInputKind = owner.inputKind;
    owner.inputKind = 'matching-c';
    owner.source = target.source;
    owner.originalAssemblyFallback = target.originalAssembly;
    owner.matchingCSymbol = target.symbol;
  }
  layout.generator = 'tools/build_phase8_matching_c.js';
  layout.phase8MatchingCTargets = phase8.targets.map((target) => {
    const replacement = replacements.get(target.chunkIndex);
    return {
      symbol: target.symbol,
      rowIndex: target.rowIndex,
      sectionName: target.sectionName,
      romStart: target.romStartNumber,
      romEndExclusive: target.romEndNumber,
      vramStart: target.vramStartNumber,
      bytes: target.bytes,
      fallbackObject: replacement.fallbackRelative,
      auxiliarySections: target.auxiliarySections.map((auxiliary) => auxiliary.outputSection),
    };
  });
  layout.phase8AuxiliarySections = phase8.targets.flatMap((target) => target.auxiliarySections.map((auxiliary) => {
    const replacement = replacements.get(target.chunkIndex);
    const tail = replacement.auxiliaryTails.find((record) => (
      record.symbol === target.symbol && record.outputSection === auxiliary.outputSection
    ));
    if (!tail) fail('Phase 8 auxiliary preserved-tail record is missing: ' + target.symbol);
    return {
      symbol: target.symbol,
      compilerSection: auxiliary.compilerSection,
      outputSection: auxiliary.outputSection,
      ownerRowIndex: auxiliary.ownerRowIndex,
      romStart: auxiliary.romStartNumber,
      romEndExclusive: auxiliary.romEndNumber,
      vramStart: auxiliary.vramStartNumber,
      vramEndExclusive: auxiliary.vramEndNumber,
      bytes: auxiliary.bytes,
      entryBytes: auxiliary.entryBytes,
      trailingPaddingBytes: auxiliary.trailingPaddingBytes,
      trailingPaddingSha256: auxiliary.expectedTrailingPaddingSha256,
      acceptedAssemblyTailBytes: tail.tailBytes,
      acceptedAssemblyTailObject: tail.objectRelative,
      acceptedAssemblyTailInputSection: tail.inputSection,
      acceptedAssemblyTailSha256: tail.tailSha256,
      acceptedAssemblyTailRomStart: tail.romStart,
      acceptedAssemblyTailRomEndExclusive: tail.romEndExclusive,
      acceptedAssemblyTailVramStart: tail.vramStart,
      acceptedAssemblyTailVramEndExclusive: tail.vramEndExclusive,
    };
  }));
  writeJson(path.join(output, 'layout.json'), layout);
}

function linkPhase8(phase8, output, objectManifest, tools) {
  const linkerRoot = path.join(output, 'linker');
  ensureDir(linkerRoot);
  const linkerScript = path.join(linkerRoot, 'phase8.ld');
  const responseFile = path.join(linkerRoot, 'objects.rsp');
  const aliases = new Map();
  for (const [symbol, value] of Object.entries(phase8.linkSymbols || {})) {
    if (!/^[A-Za-z_.$][A-Za-z0-9_.$]*$/.test(symbol)) fail('unsafe Phase 8 link alias: ' + symbol);
    const numericValue = parseNumber(value, 'link alias ' + symbol);
    if (aliases.has(symbol) && aliases.get(symbol) !== numericValue) fail('Phase 8 link alias value drift: ' + symbol);
    aliases.set(symbol, numericValue);
  }
  const aliasText = [...aliases.entries()].sort((left, right) => left[0].localeCompare(right[0])).map(([symbol, value]) => symbol + ' = ' + hex(value) + ';');
  let linkerText = renderLinkerScript(phase8.model);
  const assignedAuxiliaryOwners = new Set();
  for (const target of phase8.targets) {
    for (const auxiliary of target.auxiliarySections) {
      if (assignedAuxiliaryOwners.has(auxiliary.ownerRowIndex)) continue;
      assignedAuxiliaryOwners.add(auxiliary.ownerRowIndex);
      const selector = `    *(${auxiliary.outputSection})`;
      const occurrences = linkerText.split(selector).length - 1;
      const symbolOffset = auxiliary.ownerSymbolVram - auxiliary.ownerVramStartNumber;
      if (occurrences !== 1
          || !/^[A-Za-z_.$][A-Za-z0-9_.$]*$/.test(auxiliary.ownerSymbol)
          || !Number.isInteger(symbolOffset) || symbolOffset < 0 || symbolOffset >= auxiliary.ownerSectionBytes) {
        fail('auxiliary accepted owner-symbol linker assignment drift: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
      linkerText = linkerText.replace(
        selector,
        `    ${auxiliary.ownerSymbol} = . + ${hex(symbolOffset)};\n${selector}`,
      );
    }
  }
  for (const tail of objectManifest.linkedObjects.filter((record) => record.ownerKind === 'accepted-assembly-auxiliary-tail')) {
    const selector = `    *(${tail.outputSection})`;
    const occurrences = linkerText.split(selector).length - 1;
    if (occurrences !== 1
        || tail.inputSection !== tail.outputSection + '.tail'
        || ['.data', '.bss'].includes(tail.inputSection)
        || tail.sectionType !== 'SHT_PROGBITS'
        || !sameJson(tail.sectionFlags, ['SHF_ALLOC'])) {
      fail('auxiliary preserved-tail linker selector drift: ' + tail.targetSymbol + ' ' + tail.outputSection);
    }
    linkerText = linkerText.replace(selector, `${selector}\n    ${tail.path}(${tail.inputSection})`);
  }
  fs.writeFileSync(linkerScript, linkerText + (aliasText.length ? '\n' + aliasText.join('\n') + '\n' : ''));
  fs.writeFileSync(responseFile, objectManifest.linkedObjects.map((record) => record.path).join('\n') + '\n');
  const elfFile = path.join(output, 'phase8.elf');
  const mapFile = path.join(output, 'phase8.map');
  const romFile = path.join(output, 'phase8.us_rev0.z64');
  run(tools['mips-kmc-elf-ld.exe'].path, [
    ...phase8.model.config.binutils.linkerFlags,
    '-Map=' + normalizePath(path.relative(output, mapFile)),
    '-T',
    normalizePath(path.relative(output, linkerScript)),
    '-o',
    normalizePath(path.relative(output, elfFile)),
    '@' + normalizePath(path.relative(output, responseFile)),
  ], { cwd: output, maxBuffer: 256 * 1024 * 1024 });
  run(tools['mips-kmc-elf-objcopy.exe'].path, [
    '-O',
    'binary',
    ...phase8.model.overlays
      .filter((overlay) => overlay.bss_end_exclusive > overlay.bss_start)
      .map((overlay) => '--remove-section=.ob64.overlay' + String(overlay.descriptor_id).padStart(2, '0') + '.bss'),
    '--remove-section=.text',
    '--remove-section=.data',
    '--remove-section=.bss',
    normalizePath(path.relative(output, elfFile)),
    normalizePath(path.relative(output, romFile)),
  ], { cwd: output });
  const elfReportFile = path.join(output, 'phase8.elf-report.json');
  writeJson(elfReportFile, elfStructuralReport(parseElfFile(elfFile)));
  return { elfFile, elfReportFile, linkerScript, mapFile, responseFile, romFile };
}

function parseJsonOutput(value, label) {
  try {
    return JSON.parse(value);
  } catch (error) {
    fail(label + ' did not emit JSON: ' + error.message);
  }
}

function summarizeTargetComparison(json, rawComparison, label) {
  if (!json || !Array.isArray(json.rows) || json.rows.length === 0
      || json.rows.some((row) => !row || typeof row !== 'object' || Array.isArray(row))
      || !Number.isInteger(json.max_score) || json.max_score <= 0
      || !Number.isInteger(json.current_score) || json.current_score < 0
      || json.current_score > json.max_score) {
    fail(label + ' is missing a valid nonempty asm-differ score');
  }
  if (!rawComparison
      || typeof rawComparison.rawBytesExact !== 'boolean'
      || typeof rawComparison.linkedTargetSha256 !== 'string' || !/^[0-9A-F]{64}$/.test(rawComparison.linkedTargetSha256)
      || typeof rawComparison.expectedTargetSha256 !== 'string' || !/^[0-9A-F]{64}$/.test(rawComparison.expectedTargetSha256)
      || !Number.isInteger(rawComparison.differingByteCount) || rawComparison.differingByteCount < 0
      || !Number.isInteger(rawComparison.differingInstructionWordCount) || rawComparison.differingInstructionWordCount < 0
      || !(rawComparison.firstDifferenceOffset === null || (Number.isInteger(rawComparison.firstDifferenceOffset) && rawComparison.firstDifferenceOffset >= 0))
      || (rawComparison.rawBytesExact && (rawComparison.differingByteCount !== 0
        || rawComparison.differingInstructionWordCount !== 0
        || rawComparison.firstDifferenceOffset !== null
        || rawComparison.linkedTargetSha256 !== rawComparison.expectedTargetSha256))
      || (!rawComparison.rawBytesExact && (rawComparison.differingByteCount === 0
        || rawComparison.differingInstructionWordCount === 0
        || rawComparison.firstDifferenceOffset === null
        || rawComparison.linkedTargetSha256 === rawComparison.expectedTargetSha256))) {
    fail(label + ' is missing a valid raw linked-target comparison');
  }
  const asmDifferScoreZero = json.current_score === 0;
  const firstBaseLine = json.rows[0] && json.rows[0].base && json.rows[0].base.line;
  const firstCurrentLine = json.rows[0] && json.rows[0].current && json.rows[0].current.line;
  const asmDifferPairwiseExact = Number.isInteger(firstBaseLine) && Number.isInteger(firstCurrentLine)
    && json.rows.every((row) => row.base && row.current
      && typeof row.base.mnemonic === 'string' && row.base.mnemonic.length > 0
      && row.base.mnemonic === row.current.mnemonic
      && Number.isInteger(row.base.line) && Number.isInteger(row.current.line)
      && row.base.line - firstBaseLine === row.current.line - firstCurrentLine);
  return {
    rows: json.rows.length,
    maxScore: json.max_score,
    currentScore: json.current_score,
    asmDifferScoreZero,
    asmDifferPairwiseExact,
    rawBytesExact: rawComparison.rawBytesExact,
    linkedTargetSha256: rawComparison.linkedTargetSha256,
    expectedTargetSha256: rawComparison.expectedTargetSha256,
    differingByteCount: rawComparison.differingByteCount,
    differingInstructionWordCount: rawComparison.differingInstructionWordCount,
    firstDifferenceOffset: rawComparison.firstDifferenceOffset,
    exact: asmDifferPairwiseExact && rawComparison.rawBytesExact,
  };
}

function targetAsmDifferMaxLines(target) {
  if (!target || !Number.isInteger(target.bytes) || target.bytes <= 0 || target.bytes % 4 !== 0) {
    fail('asm-differ target byte extent is malformed');
  }
  return target.bytes / 4;
}

function runTargetAsmDiffer(phase8, target, options) {
  const output = path.resolve(options.output);
  const proofRoot = path.join(output, 'asm-differ-proof');
  const runRoot = path.join(proofRoot, 'target-elf-' + target.symbol);
  ensureDir(runRoot);
  const shim = path.join(proofRoot, 'watchdog.py');
  fs.writeFileSync(shim, SHIM_TEXT);
  fs.copyFileSync(shim, path.join(runRoot, 'watchdog.py'));
  fs.writeFileSync(path.join(runRoot, 'sitecustomize.py'), OBJDUMP_SHIM_TEXT);
  const chunkName = String(target.chunkIndex).padStart(3, '0');
  const myimg = '../../phase8.elf';
  const settings = [
    'def apply(config, args):',
    '    config["objdump_executable"] = ' + JSON.stringify(options.objdump),
    '    config["arch"] = "mips"',
    '    config["map_format"] = "gnu"',
    '    config["show_line_numbers_default"] = False',
    '    config["baseimg"] = ' + JSON.stringify('../../comparison/original/chunk_' + chunkName + '.o'),
    '    config["myimg"] = ' + JSON.stringify(myimg),
    '    config["mapfile"] = "../../phase8.map"',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(runRoot, 'diff_settings.py'), settings);
  const env = { ...process.env, PYTHONPATH: runRoot, PYTHONDONTWRITEBYTECODE: '1' };
  const result = run(options.python, [
    path.join(options.asmDifferRoot, 'diff.py'),
    hex(target.row.part.symbolByteOffset),
    '-e',
    target.symbol,
    '-j',
    target.sectionName,
    '--format',
    'json',
    '--algorithm',
    'difflib',
    '--no-line-numbers',
    '--max-lines',
    String(targetAsmDifferMaxLines(target)),
  ], { cwd: runRoot, env });
  const json = parseJsonOutput(result.stdout, 'asm-differ target proof for ' + target.symbol);
  const canonicalBaserom = options.canonicalBaserom || loadCanonicalBaserom(phase8);
  const linkedElf = parseElfFile(path.join(output, 'phase8.elf'));
  const rawComparison = compareLinkedTargetBytes(target, linkedElf, canonicalBaserom);
  const comparison = summarizeTargetComparison(json, rawComparison, 'target comparison for ' + target.symbol);
  if (options.requireExact !== false && !comparison.exact) {
    if (!comparison.asmDifferPairwiseExact) fail('asm-differ did not prove an exact decoded target match: ' + target.symbol);
    fail('asm-differ decoded rows match but raw linked-target bytes differ: ' + target.symbol);
  }
  const jsonFile = path.join(proofRoot, target.symbol + '.json');
  writeJson(jsonFile, json);
  return {
    symbol: target.symbol,
    sectionName: target.sectionName,
    ...comparison,
    outputSha256: sha256File(jsonFile),
    shimSha256: sha256File(shim),
    objdumpCompatibilityShimSha256: sha256Buffer(Buffer.from(OBJDUMP_SHIM_TEXT)),
    linkedElfSha256: sha256File(path.join(output, 'phase8.elf')),
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^$\\{}()|[\]\\]/g, '\\$&');
}

function verifyTargetMapOwner(target, mapText) {
  const escaped = escapeRegex(target.sectionName);
  const lines = mapText.split(/\r?\n/);
  const heading = lines.findIndex((line) => new RegExp('^' + escaped + '\\s').test(line));
  if (heading < 0) fail('target linker-map section is missing: ' + target.sectionName);
  let end = lines.length;
  for (let index = heading + 1; index < lines.length; index += 1) {
    if (/^\.ob64\.r\d{4}(?:\.s\d+)?\s/.test(lines[index])) {
      end = index;
      break;
    }
  }
  const block = lines.slice(heading, end);
  const contributions = block.filter((line) => new RegExp('^\\s+' + escaped + '\\s+.*\\sobjects/').test(line));
  const expectedOwner = 'objects/c/' + target.symbol + '.o';
  const forbiddenOwner = 'objects/assembly/chunk_' + String(target.chunkIndex).padStart(3, '0') + '.o';
  if (contributions.length !== 1 || !contributions[0].includes(expectedOwner) || block.some((line) => line.includes(forbiddenOwner))) {
    fail('target linker-map owner is not the sole matching C object: ' + target.symbol);
  }
  if (!block.some((line) => new RegExp('\\s' + escapeRegex(target.symbol) + '$').test(line))) fail('target linker-map symbol is missing: ' + target.symbol);
  return { contribution: contributions[0].trim(), linkedOwner: expectedOwner };
}

function verifyAuxiliaryMapOwner(target, auxiliary, tail, mapText) {
  const escaped = escapeRegex(auxiliary.outputSection);
  const lines = mapText.split(/\r?\n/);
  const heading = lines.findIndex((line) => new RegExp('^' + escaped + '\\s').test(line));
  if (heading < 0) fail('auxiliary linker-map section is missing: ' + auxiliary.outputSection);
  let end = lines.length;
  for (let index = heading + 1; index < lines.length; index += 1) {
    if (/^\.ob64\.r\d{4}(?:\.s\d+)?\s/.test(lines[index])) {
      end = index;
      break;
    }
  }
  const block = lines.slice(heading, end);
  const expectedOwner = 'objects/c/' + target.symbol + '.o';
  const contributionPattern = /^\s+(\.[A-Za-z0-9_.]+)\s+(?:0x)?([0-9A-Fa-f]+)\s+(?:0x)?([0-9A-Fa-f]+)\s+(.+)$/;
  const contributions = block.map((line) => {
    const match = contributionPattern.exec(line);
    return match ? {
      line: line.trim(),
      inputSection: match[1],
      address: Number.parseInt(match[2], 16),
      bytes: Number.parseInt(match[3], 16),
      owner: match[4],
    } : null;
  }).filter(Boolean).filter((record) => /objects[\\/]/.test(record.owner));
  const cContributions = contributions.filter((record) => (
    record.inputSection === auxiliary.outputSection && record.owner.includes(expectedOwner)
  ));
  if (cContributions.length !== 1
      || cContributions[0].address !== auxiliary.vramStartNumber
      || cContributions[0].bytes !== auxiliary.bytes) {
    fail('auxiliary linker-map owner is not the accepted matching C object: ' + target.symbol + ' ' + auxiliary.outputSection);
  }
  const tableStart = auxiliary.vramStartNumber;
  const tableEnd = auxiliary.vramEndNumber;
  const collisions = contributions.filter((record) => (
    record !== cContributions[0]
    && record.bytes > 0
    && record.address < tableEnd
    && record.address + record.bytes > tableStart
  ));
  if (collisions.length > 0) {
    fail('auxiliary linker-map ownership collision: ' + target.symbol + ' ' + auxiliary.outputSection);
  }
  if (tail.tailBytes > 0) {
    if (tail.inputSection !== auxiliary.ownerTailSection
        || tail.sectionType !== 'SHT_PROGBITS'
        || !sameJson(tail.sectionFlags, ['SHF_ALLOC'])
        || tail.alignment !== auxiliary.ownerTailAlignment
        || tail.tailSha256 !== auxiliary.ownerTailSha256
        || tail.romStart !== auxiliary.ownerTailRomStartNumber
        || tail.romEndExclusive !== auxiliary.ownerTailRomEndNumber
        || tail.vramStart !== auxiliary.ownerTailVramStartNumber
        || tail.vramEndExclusive !== auxiliary.ownerTailVramEndNumber
        || tail.ownerOriginalAssembly !== auxiliary.ownerOriginalAssembly
        || tail.ownerOriginalAssemblySha256 !== auxiliary.ownerOriginalAssemblySha256) {
      fail('auxiliary accepted assembly tail contract drift: ' + target.symbol + ' ' + auxiliary.outputSection);
    }
    const tailContributions = contributions.filter((record) => (
      record.inputSection === tail.inputSection
      && record.owner.includes(tail.objectRelative)
    ));
    if (tailContributions.length !== 1
        || tailContributions[0].address !== auxiliary.ownerTailVramStartNumber
        || tailContributions[0].bytes !== tail.tailBytes) {
      fail('auxiliary accepted assembly tail placement drift: ' + target.symbol + ' ' + auxiliary.outputSection);
    }
    const tailCollisions = contributions.filter((record) => (
      record !== tailContributions[0]
      && record.bytes > 0
      && record.address < auxiliary.ownerTailVramEndNumber
      && record.address + record.bytes > auxiliary.ownerTailVramStartNumber
    ));
    if (tailCollisions.length > 0) {
      fail('auxiliary preserved-tail ownership collision: ' + target.symbol + ' ' + auxiliary.outputSection);
    }
  } else if (contributions.some((record) => record.inputSection === auxiliary.ownerTailSection)) {
    fail('unexpected auxiliary tail contribution: ' + target.symbol + ' ' + auxiliary.outputSection);
  }
  if (contributions.some((record) => ['.data', '.bss'].includes(record.inputSection))) {
    fail('forbidden conventional data section contributed to auxiliary output: ' + target.symbol + ' ' + auxiliary.outputSection);
  }
  return {
    linkedOwner: expectedOwner,
    contribution: cContributions[0].line,
    tailOwner: tail.objectRelative,
    tailContribution: tail.tailBytes > 0
      ? contributions.find((record) => record.inputSection === tail.inputSection && record.owner.includes(tail.objectRelative)).line
      : null,
  };
}

function verifyObjectManifest(output, phase8) {
  const manifestFile = path.join(output, 'objects', 'manifest.json');
  if (!fs.existsSync(manifestFile)) fail('Phase 8 object manifest is missing');
  const manifest = readJson(manifestFile);
  const expectedPruned = new Set([...targetsByChunk(phase8).keys()]);
  if (manifest.schemaVersion !== 4
      || !Array.isArray(manifest.linkedObjects)
      || !Array.isArray(manifest.comparisonObjects)
      || !Array.isArray(manifest.targets)
      || !sameJson(manifest.targets, phase8.targets.map((target) => target.symbol))) {
    fail('Phase 8 object manifest schema drift');
  }
  for (const record of [...manifest.linkedObjects, ...manifest.comparisonObjects]) {
    const file = resolveRelative(output, record.path, 'Phase 8 manifest object');
    if (!fs.existsSync(file) || fs.statSync(file).size !== record.bytes || sha256File(file) !== record.sha256) {
      fail('Phase 8 object identity drift: ' + record.path);
    }
  }
  const cOwners = manifest.linkedObjects.filter((record) => record.ownerKind === 'matching-c-target');
  const prunedOwners = manifest.linkedObjects.filter((record) => record.ownerKind === 'accepted-assembly-chunk-with-targets-removed');
  const auxiliaryTailOwners = manifest.linkedObjects.filter((record) => record.ownerKind === 'accepted-assembly-auxiliary-tail');
  const expectedAuxiliaryTails = phase8.targets.flatMap((target) => (
    target.auxiliarySections.filter((auxiliary) => auxiliary.ownerTailBytes > 0)
  ));
  if (cOwners.length !== phase8.targets.length
      || prunedOwners.length !== expectedPruned.size
      || auxiliaryTailOwners.length !== expectedAuxiliaryTails.length
      || manifest.comparisonObjects.length !== expectedPruned.size) {
    fail('Phase 8 target ownership census drift');
  }
  for (const target of phase8.targets) {
    const cOwner = cOwners.find((record) => record.targetSymbol === target.symbol);
    if (!cOwner || cOwner.targetSection !== target.sectionName
        || !sameJson(cOwner.auxiliarySections, target.auxiliarySections.map((auxiliary) => auxiliary.outputSection))) {
      fail('Phase 8 matching C object ownership manifest drift: ' + target.symbol);
    }
    for (const auxiliary of target.auxiliarySections.filter((record) => record.ownerTailBytes > 0)) {
      const tailOwner = auxiliaryTailOwners.find((record) => (
        record.targetSymbol === target.symbol && record.outputSection === auxiliary.outputSection
      ));
      if (!tailOwner
          || tailOwner.inputSection !== auxiliary.ownerTailSection
          || tailOwner.sectionType !== 'SHT_PROGBITS'
          || !sameJson(tailOwner.sectionFlags, ['SHF_ALLOC'])
          || tailOwner.alignment !== auxiliary.ownerTailAlignment
          || tailOwner.tailBytes !== auxiliary.ownerTailBytes
          || tailOwner.tailSha256 !== auxiliary.ownerTailSha256
          || tailOwner.romStart !== auxiliary.ownerTailRomStartNumber
          || tailOwner.romEndExclusive !== auxiliary.ownerTailRomEndNumber
          || tailOwner.vramStart !== auxiliary.ownerTailVramStartNumber
          || tailOwner.vramEndExclusive !== auxiliary.ownerTailVramEndNumber
          || tailOwner.ownerOriginalAssembly !== auxiliary.ownerOriginalAssembly
          || tailOwner.ownerOriginalAssemblySha256 !== auxiliary.ownerOriginalAssemblySha256) {
        fail('Phase 8 auxiliary tail ownership manifest drift: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
    }
  }
  return { manifest, bytes: fs.statSync(manifestFile).size, sha256: sha256File(manifestFile) };
}

function verifyPhase8Output(phase8, options) {
  const output = path.resolve(options.output);
  const files = {
    elf: path.join(output, 'phase8.elf'),
    map: path.join(output, 'phase8.map'),
    rom: path.join(output, 'phase8.us_rev0.z64'),
    layout: path.join(output, 'layout.json'),
    elfReport: path.join(output, 'phase8.elf-report.json'),
  };
  for (const file of Object.values(files)) if (!fs.existsSync(file)) fail('Phase 8 output is missing: ' + file);

  const elf = parseElfFile(files.elf);
  const replacedRows = new Set(phase8.targets.map((target) => target.rowIndex));
  const verificationModel = {
    ...phase8.model,
    rows: phase8.model.rows.map((row) => replacedRows.has(row.index) ? { ...row, inputKind: 'matching-c' } : row),
  };
  const elfResult = verifyElfAgainstModel(verificationModel, elf);
  const mapText = fs.readFileSync(files.map, 'utf8');
  const mapResult = verifyMap(phase8.model, mapText);
  const romResult = verifyRom(phase8.model, fs.readFileSync(files.rom));
  const canonicalBaserom = loadCanonicalBaserom(phase8);
  const sourceObjectEvidence = verifySourceObjectProofs(phase8, { output, linkedElf: elf, canonicalBaserom });
  const replacements = options.replacements || new Map([...targetsByChunk(phase8).entries()].map(([chunkIndex, chunkTargets]) => [chunkIndex, {
    fallbackRelative: 'comparison/original/chunk_' + String(chunkIndex).padStart(3, '0') + '.o',
    auxiliaryTails: chunkTargets.flatMap((target) => target.auxiliarySections.map((auxiliary) => ({
      symbol: target.symbol,
      outputSection: auxiliary.outputSection,
      inputSection: auxiliary.ownerTailSection,
      sectionType: 'SHT_PROGBITS',
      sectionFlags: ['SHF_ALLOC'],
      alignment: auxiliary.ownerTailAlignment,
      tableBytes: auxiliary.bytes,
      entryBytes: auxiliary.entryBytes,
      trailingPaddingBytes: auxiliary.trailingPaddingBytes,
      trailingPaddingSha256: auxiliary.expectedTrailingPaddingSha256,
      tailBytes: auxiliary.ownerTailBytes,
      tailSha256: auxiliary.ownerTailSha256,
      romStart: auxiliary.ownerTailRomStartNumber,
      romEndExclusive: auxiliary.ownerTailRomEndNumber,
      vramStart: auxiliary.ownerTailVramStartNumber,
      vramEndExclusive: auxiliary.ownerTailVramEndNumber,
      ownerOriginalAssembly: auxiliary.ownerOriginalAssembly,
      ownerOriginalAssemblySha256: auxiliary.ownerOriginalAssemblySha256,
      binaryRelative: auxiliary.ownerTailBytes > 0
        ? auxiliaryTailRelative(chunkIndex, auxiliary.outputSection, 'bin')
        : null,
      objectRelative: auxiliary.ownerTailBytes > 0
        ? auxiliaryTailRelative(chunkIndex, auxiliary.outputSection, 'o')
        : null,
    }))),
  }]));
  const targetResults = [];
  for (const target of phase8.targets) {
    const cObject = path.join(output, 'objects', 'c', target.symbol + '.o');
    const replacement = replacements.get(target.chunkIndex);
    const prunedObject = path.join(output, 'objects', 'assembly', 'chunk_' + String(target.chunkIndex).padStart(3, '0') + '.o');
    const fallbackObject = path.join(output, replacement.fallbackRelative);
    for (const file of [cObject, prunedObject, fallbackObject]) if (!fs.existsSync(file)) fail('Phase 8 target output is missing: ' + file);

    const mapOwner = verifyTargetMapOwner(target, mapText);
    const rawComparison = compareLinkedTargetBytes(target, elf, canonicalBaserom);
    if (!rawComparison.rawBytesExact) fail('linked target bytes differ from the accepted ROM reference: ' + target.symbol);
    const linkedText = rawComparison.linkedBytes;
    const linkedTextFunctions = verifyCompilerTextFunctions(
      elf,
      target,
      elf.sections.find((section) => section.name === target.sectionName),
      true,
    );

    const cElf = parseElfFile(cObject);
    const cSection = cElf.sections.find((section) => section.name === target.sectionName);
    if (!cSection || cSection.size !== target.bytes) fail('recorded C object target section shape drift: ' + target.symbol);
    verifyCompilerTextFunctions(cElf, target, cSection);
    const relocations = relocationRecords(cElf, target);
    if (!sameJson(relocations, target.expectedRelocations)) fail('recorded C object relocation drift: ' + target.symbol);

    const fallbackElf = parseElfFile(fallbackObject);
    const fallbackSection = fallbackElf.sections.find((section) => section.name === target.sectionName);
    if (!fallbackSection || fallbackSection.size !== target.bytes || !Buffer.from(elfSectionBytes(fallbackElf, fallbackSection)).equals(linkedText)) {
      fail('original assembly comparison bytes drift: ' + target.symbol);
    }
    const prunedElf = parseElfFile(prunedObject);
    if (prunedElf.sections.some((section) => section.name === target.sectionName) || prunedElf.symbols.some((symbol) => symbol.name === target.symbol)) {
      fail('original assembly fallback remains a linked target owner: ' + target.symbol);
    }
    const auxiliaryResults = [];
    for (const auxiliary of target.auxiliarySections) {
      const tail = replacement.auxiliaryTails.find((record) => (
        record.symbol === target.symbol && record.outputSection === auxiliary.outputSection
      ));
      if (!tail) fail('auxiliary preserved-tail record is missing: ' + target.symbol + ' ' + auxiliary.outputSection);
      const linkedComparison = compareLinkedAuxiliaryBytes(target, auxiliary, elf, canonicalBaserom);
      if (!linkedComparison.rawBytesExact
          || linkedComparison.linkedSha256 !== auxiliary.expectedLinkedSha256
          || linkedComparison.expectedSha256 !== auxiliary.expectedLinkedSha256) {
        fail('linked auxiliary bytes differ from the accepted ROM reference: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
      const auxiliaryMapOwner = verifyAuxiliaryMapOwner(target, auxiliary, tail, mapText);
      const cAuxiliarySections = cElf.sections.filter((section) => section.name === auxiliary.outputSection);
      if (cAuxiliarySections.length !== 1
          || cAuxiliarySections[0].type !== 1
          || cAuxiliarySections[0].flags !== 2
          || cAuxiliarySections[0].alignment !== auxiliary.alignment
          || cAuxiliarySections[0].size !== auxiliary.bytes) {
        fail('recorded C object auxiliary evidence drift: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
      const cAuxiliaryBytes = Buffer.from(elfSectionBytes(cElf, cAuxiliarySections[0]));
      verifyAuxiliaryPaddingBytes(
        cAuxiliaryBytes,
        auxiliary,
        target.symbol + ' ' + auxiliary.outputSection + ' verified C object',
      );
      if (sha256Buffer(cAuxiliaryBytes) !== auxiliary.expectedObjectSha256
          || !sameJson(auxiliaryRelocationRecords(cElf, target, auxiliary), auxiliary.expectedRelocations)) {
        fail('recorded C object auxiliary evidence drift: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
      const fallbackAuxiliarySections = fallbackElf.sections.filter((section) => section.name === auxiliary.outputSection);
      const fallbackOffset = auxiliary.romStartNumber - auxiliary.ownerRomStartNumber;
      if (fallbackAuxiliarySections.length !== 1
          || fallbackAuxiliarySections[0].size !== auxiliary.ownerSectionBytes
          || sha256Buffer(Buffer.from(elfSectionBytes(fallbackElf, fallbackAuxiliarySections[0])).subarray(
            fallbackOffset,
            fallbackOffset + auxiliary.bytes,
          )) !== auxiliary.expectedLinkedSha256) {
        fail('original assembly auxiliary comparison bytes drift: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
      verifyAuxiliaryPaddingBytes(
        Buffer.from(elfSectionBytes(fallbackElf, fallbackAuxiliarySections[0])).subarray(
          fallbackOffset,
          fallbackOffset + auxiliary.bytes,
        ),
        auxiliary,
        target.symbol + ' ' + auxiliary.outputSection + ' verified fallback bytes',
      );
      if (prunedElf.sections.some((section) => section.name === auxiliary.outputSection)) {
        fail('original assembly auxiliary table remains a linked owner: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
      const fallbackOwnerBytes = Buffer.from(elfSectionBytes(fallbackElf, fallbackAuxiliarySections[0]));
      const tailOffset = auxiliary.ownerTailRomStartNumber - auxiliary.ownerRomStartNumber;
      const expectedTailBytes = Buffer.from(fallbackOwnerBytes.subarray(
        tailOffset,
        tailOffset + auxiliary.ownerTailBytes,
      ));
      if (tail.tailBytes !== expectedTailBytes.length) {
        fail('accepted assembly auxiliary tail size drift: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
      if (tail.tailBytes > 0) {
        const tailObject = resolveRelative(output, tail.objectRelative, 'auxiliary preserved-tail object');
        if (!fs.existsSync(tailObject)) fail('auxiliary preserved-tail object is missing: ' + target.symbol);
        const tailElf = parseElfFile(tailObject);
        validateAuxiliaryTailObject(tailElf, auxiliary, expectedTailBytes);
      }
      auxiliaryResults.push({
        kind: auxiliary.kind,
        compilerSection: auxiliary.compilerSection,
        outputSection: auxiliary.outputSection,
        romStart: auxiliary.romStartNumber,
        romEndExclusive: auxiliary.romEndNumber,
        vramStart: auxiliary.vramStartNumber,
        vramEndExclusive: auxiliary.vramEndNumber,
        bytes: auxiliary.bytes,
        entryBytes: auxiliary.entryBytes,
        trailingPaddingBytes: auxiliary.trailingPaddingBytes,
        trailingPaddingSha256: auxiliary.expectedTrailingPaddingSha256,
        alignment: auxiliary.alignment,
        objectSha256: auxiliary.expectedObjectSha256,
        linkedSha256: linkedComparison.linkedSha256,
        expectedLinkedSha256: auxiliary.expectedLinkedSha256,
        rawBytesExact: linkedComparison.rawBytesExact,
        ownerRowIndex: auxiliary.ownerRowIndex,
        linkedOwner: auxiliaryMapOwner.linkedOwner,
        mapContribution: auxiliaryMapOwner.contribution,
        acceptedAssemblyTailBytes: tail.tailBytes,
        acceptedAssemblyTailInputSection: tail.inputSection,
        acceptedAssemblyTailSha256: tail.tailSha256,
        acceptedAssemblyTailRomStart: tail.romStart,
        acceptedAssemblyTailRomEndExclusive: tail.romEndExclusive,
        acceptedAssemblyTailVramStart: tail.vramStart,
        acceptedAssemblyTailVramEndExclusive: tail.vramEndExclusive,
        acceptedAssemblyTailOwner: auxiliaryMapOwner.tailOwner,
        acceptedAssemblyTailMapContribution: auxiliaryMapOwner.tailContribution,
        relocations: auxiliary.expectedRelocations,
      });
    }
    const sourceObjectTarget = sourceObjectEvidence.targets.find((record) => record.symbol === target.symbol);
    if (!sourceObjectTarget) fail('verified source-to-object target record is missing: ' + target.symbol);

    targetResults.push({
      symbol: target.symbol,
      source: target.source,
      originalAssemblyFallback: target.originalAssembly,
      rowIndex: target.rowIndex,
      primaryId: target.primaryId,
      sectionName: target.sectionName,
      romStart: target.romStartNumber,
      romEndExclusive: target.romEndNumber,
      vramStart: target.vramStartNumber,
      bytes: target.bytes,
      textSha256: sha256Buffer(linkedText),
      rawBytesExact: rawComparison.rawBytesExact,
      linkedTargetSha256: rawComparison.linkedTargetSha256,
      expectedTargetSha256: rawComparison.expectedTargetSha256,
      differingByteCount: rawComparison.differingByteCount,
      differingInstructionWordCount: rawComparison.differingInstructionWordCount,
      firstDifferenceOffset: rawComparison.firstDifferenceOffset,
      linkedSymbolValue: linkedTextFunctions[0].value,
      compilerTextFunctions: linkedTextFunctions,
      linkedOwner: mapOwner.linkedOwner,
      mapContribution: mapOwner.contribution,
      relocations,
      auxiliarySections: auxiliaryResults,
      sourceObjectEvidence: sourceObjectTarget,
    });
  }

  const layout = readJson(files.layout);
  if (layout.schemaVersion !== 1
      || layout.rows !== phase8.model.rows.length
      || layout.slices !== phase8.model.slices.length
      || layout.representedBytes !== phase8.model.config.rom.bytes
      || !Array.isArray(layout.phase8MatchingCTargets)
      || !Array.isArray(layout.phase8AuxiliarySections)
      || layout.phase8AuxiliarySections.length !== phase8.targets.reduce((sum, target) => sum + target.auxiliarySections.length, 0)
      || !sameJson(layout.phase8MatchingCTargets.map((target) => target.symbol), phase8.targets.map((target) => target.symbol))) {
    fail('Phase 8 external layout summary drift');
  }
  for (const target of phase8.targets) {
    const layoutOwner = layout.owners && layout.owners.find((owner) => owner.index === target.rowIndex);
    if (!layoutOwner
        || layoutOwner.inputKind !== 'matching-c'
        || layoutOwner.source !== target.source
        || layoutOwner.matchingCSymbol !== target.symbol
        || layoutOwner.originalAssemblyFallback !== target.originalAssembly) {
      fail('Phase 8 external layout target drift: ' + target.symbol);
    }
    for (const auxiliary of target.auxiliarySections) {
      const layoutAuxiliary = layout.phase8AuxiliarySections.find((record) => (
        record.symbol === target.symbol && record.outputSection === auxiliary.outputSection
      ));
      if (!layoutAuxiliary
          || layoutAuxiliary.compilerSection !== auxiliary.compilerSection
          || layoutAuxiliary.ownerRowIndex !== auxiliary.ownerRowIndex
          || layoutAuxiliary.romStart !== auxiliary.romStartNumber
          || layoutAuxiliary.romEndExclusive !== auxiliary.romEndNumber
          || layoutAuxiliary.vramStart !== auxiliary.vramStartNumber
          || layoutAuxiliary.vramEndExclusive !== auxiliary.vramEndNumber
          || layoutAuxiliary.bytes !== auxiliary.bytes
          || layoutAuxiliary.entryBytes !== auxiliary.entryBytes
          || layoutAuxiliary.trailingPaddingBytes !== auxiliary.trailingPaddingBytes
          || layoutAuxiliary.trailingPaddingSha256 !== auxiliary.expectedTrailingPaddingSha256
          || layoutAuxiliary.acceptedAssemblyTailBytes !== auxiliary.ownerTailBytes
          || layoutAuxiliary.acceptedAssemblyTailInputSection !== auxiliary.ownerTailSection
          || layoutAuxiliary.acceptedAssemblyTailSha256 !== auxiliary.ownerTailSha256
          || layoutAuxiliary.acceptedAssemblyTailRomStart !== auxiliary.ownerTailRomStartNumber
          || layoutAuxiliary.acceptedAssemblyTailRomEndExclusive !== auxiliary.ownerTailRomEndNumber
          || layoutAuxiliary.acceptedAssemblyTailVramStart !== auxiliary.ownerTailVramStartNumber
          || layoutAuxiliary.acceptedAssemblyTailVramEndExclusive !== auxiliary.ownerTailVramEndNumber) {
        fail('Phase 8 external layout auxiliary drift: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
    }
  }
  const objectManifest = verifyObjectManifest(output, phase8);
  const asmDiffer = phase8.targets.map((target) => runTargetAsmDiffer(phase8, target, {
    output,
    asmDifferRoot: options.asmDifferRoot,
    python: options.splatPython,
    objdump: options.objdump,
    objcopy: options.objcopy,
    canonicalBaserom,
  }));
  return {
    schemaVersion: 3,
    status: 'pass',
    counts: {
      primaryRows: phase8.model.rows.length,
      linkSlices: phase8.model.slices.length,
      overlayReservations: phase8.model.overlays.length,
      representedBytes: elfResult.representedBytes,
      loadHeaders: elfResult.loadHeaderCount,
      symbols: elfResult.symbolCount,
      mapSections: mapResult.sectionMentions,
      matchingCOwners: phase8.targets.length,
      auxiliarySectionOwners: sourceObjectEvidence.counts.auxiliarySections,
      originalAssemblyFallbacks: replacements.size,
      sourceObjectProofs: sourceObjectEvidence.counts.proofTargets,
      pureCTargets: sourceObjectEvidence.counts.pureTargets,
      hybridCTargets: sourceObjectEvidence.counts.hybridTargets,
      compilerAssemblyRewrites: sourceObjectEvidence.counts.compilerAssemblyRewrites,
      loadRelevantRelocations: sourceObjectEvidence.counts.loadRelevantRelocations,
      ancillaryRelocations: sourceObjectEvidence.counts.ancillaryRelocations,
      retiredPdrRelocations: sourceObjectEvidence.counts.retiredPdrRelocations,
    },
    outputs: {
      elf: { bytes: fs.statSync(files.elf).size, sha256: sha256File(files.elf) },
      map: { bytes: fs.statSync(files.map).size, sha256: sha256File(files.map) },
      rom: { bytes: romResult.bytes, sha256: romResult.romSha256 },
      codeRegionSha256: romResult.codeSha256,
      layout: { bytes: fs.statSync(files.layout).size, sha256: sha256File(files.layout) },
      elfReport: { bytes: fs.statSync(files.elfReport).size, sha256: sha256File(files.elfReport) },
      objectManifest: { bytes: objectManifest.bytes, sha256: objectManifest.sha256 },
    },
    sourceObjectEvidence,
    targets: targetResults,
    preservation: {
      fullRomExact: true,
      acceptedRowsPreserved: phase8.model.rows.length,
      acceptedSlicesPreserved: phase8.model.slices.length,
      overlayDescriptorsPreserved: phase8.model.overlays.length,
      originalAssemblyTargetsNotLinked: true,
      originalAssemblyAuxiliaryTablesNotLinked: true,
    },
    asmDiffer,
  };
}

function validateRecordedPhase8Build(phase8, options) {
  const output = path.resolve(options.output);
  const buildReport = options.buildReport;
  const verification = options.verification;
  if (!buildReport || buildReport.schemaVersion !== 3 || buildReport.status !== 'pass') {
    fail('recorded Phase 8 build report did not pass');
  }
  if (!verification || verification.schemaVersion !== 3 || verification.status !== 'pass') {
    fail('current Phase 8 verification result did not pass');
  }
  if (typeof options.compilerSha256 !== 'string' || buildReport.compiler.sha256 !== options.compilerSha256) {
    fail('recorded KMC compiler identity drift');
  }
  const recordedToolchain = buildReport.acceptedInputs && buildReport.acceptedInputs.gnuBinutils26;
  const recordedLinkage = buildReport.acceptedInputs && buildReport.acceptedInputs.linkageConfig;
  if (!recordedToolchain
      || recordedToolchain.manifestPath !== phase8.toolchain.identity.manifestPath
      || recordedToolchain.manifestSha256 !== phase8.toolchain.identity.manifestSha256
      || recordedToolchain.buildProvenancePath !== phase8.toolchain.identity.buildProvenancePath
      || recordedToolchain.buildProvenanceSha256 !== phase8.toolchain.identity.buildProvenanceSha256
      || !recordedLinkage
      || recordedLinkage.path !== phase8.linkageConfigIdentity.path
      || recordedLinkage.bytes !== phase8.linkageConfigIdentity.bytes
      || recordedLinkage.sha256 !== phase8.linkageConfigIdentity.sha256
      || JSON.stringify(buildReport.sourceObjectEvidence) !== JSON.stringify(verification.sourceObjectEvidence)) {
    fail('recorded toolchain, linkage contract, or source-to-object evidence drift');
  }
  const recordedSources = buildReport.acceptedInputs && buildReport.acceptedInputs.cSources;
  const recordedTargets = buildReport.targetReplacements;
  if (!Array.isArray(recordedSources) || recordedSources.length !== phase8.targets.length
      || !Array.isArray(recordedTargets) || recordedTargets.length !== phase8.targets.length) {
    fail('recorded Phase 8 source/object census drift');
  }
  for (const target of phase8.targets) {
    const source = recordedSources.find((record) => record.path === target.source);
    const replacement = recordedTargets.find((record) => record.symbol === target.symbol);
    const verifiedTarget = verification.targets.find((record) => record.symbol === target.symbol);
    if (!source || source.sha256 !== target.sourceSha256 || !replacement || !verifiedTarget
        || replacement.source !== target.source || replacement.sourceSha256 !== target.sourceSha256
        || replacement.sourceClass !== verifiedTarget.sourceObjectEvidence.sourceClass
        || replacement.sourcePolicyDigest !== verifiedTarget.sourceObjectEvidence.sourcePolicyDigest
        || replacement.compilerAssemblyRewritten !== false
        || !sameJson(replacement.compilerTextFunctions, expectedCompilerTextFunctionEvidence(target))
        || !sameJson(verifiedTarget.compilerTextFunctions, expectedCompilerTextFunctionEvidence(target, true))
        || !Array.isArray(replacement.auxiliarySections)
        || !Array.isArray(replacement.auxiliaryTails)
        || !Array.isArray(verifiedTarget.auxiliarySections)
        || replacement.auxiliarySections.length !== target.auxiliarySections.length
        || replacement.auxiliaryTails.length !== target.auxiliarySections.length
        || verifiedTarget.auxiliarySections.length !== target.auxiliarySections.length
        || !replacement.sourceObjectProof
        || replacement.sourceObjectProof.path !== verifiedTarget.sourceObjectEvidence.proof.path
        || replacement.sourceObjectProof.bytes !== verifiedTarget.sourceObjectEvidence.proof.bytes
        || replacement.sourceObjectProof.sha256 !== verifiedTarget.sourceObjectEvidence.proof.sha256) {
      fail('recorded Phase 8 source-to-object provenance drift: ' + target.symbol);
    }
    for (const auxiliary of target.auxiliarySections) {
      const compiledAuxiliary = replacement.auxiliarySections.find((record) => record.outputSection === auxiliary.outputSection);
      const recordedTail = replacement.auxiliaryTails.find((record) => record.outputSection === auxiliary.outputSection);
      const verifiedAuxiliary = verifiedTarget.auxiliarySections.find((record) => record.outputSection === auxiliary.outputSection);
      if (!compiledAuxiliary
          || compiledAuxiliary.compilerSection !== auxiliary.compilerSection
          || compiledAuxiliary.bytes !== auxiliary.bytes
          || compiledAuxiliary.sha256 !== auxiliary.expectedObjectSha256
          || compiledAuxiliary.entryBytes !== auxiliary.entryBytes
          || compiledAuxiliary.trailingPaddingBytes !== auxiliary.trailingPaddingBytes
          || compiledAuxiliary.trailingPaddingSha256 !== auxiliary.expectedTrailingPaddingSha256
          || compiledAuxiliary.alignment !== auxiliary.alignment
          || compiledAuxiliary.flags !== 2
          || !sameJson(compiledAuxiliary.relocations, auxiliary.expectedRelocations)
          || !recordedTail
          || recordedTail.symbol !== target.symbol
          || recordedTail.inputSection !== auxiliary.ownerTailSection
          || recordedTail.sectionType !== 'SHT_PROGBITS'
          || !sameJson(recordedTail.sectionFlags, ['SHF_ALLOC'])
          || recordedTail.alignment !== auxiliary.ownerTailAlignment
          || recordedTail.tableBytes !== auxiliary.bytes
          || recordedTail.entryBytes !== auxiliary.entryBytes
          || recordedTail.trailingPaddingBytes !== auxiliary.trailingPaddingBytes
          || recordedTail.trailingPaddingSha256 !== auxiliary.expectedTrailingPaddingSha256
          || recordedTail.tailBytes !== auxiliary.ownerTailBytes
          || recordedTail.tailSha256 !== auxiliary.ownerTailSha256
          || recordedTail.romStart !== auxiliary.ownerTailRomStartNumber
          || recordedTail.romEndExclusive !== auxiliary.ownerTailRomEndNumber
          || recordedTail.vramStart !== auxiliary.ownerTailVramStartNumber
          || recordedTail.vramEndExclusive !== auxiliary.ownerTailVramEndNumber
          || recordedTail.ownerOriginalAssembly !== auxiliary.ownerOriginalAssembly
          || recordedTail.ownerOriginalAssemblySha256 !== auxiliary.ownerOriginalAssemblySha256
          || !verifiedAuxiliary
          || verifiedAuxiliary.entryBytes !== auxiliary.entryBytes
          || verifiedAuxiliary.trailingPaddingBytes !== auxiliary.trailingPaddingBytes
          || verifiedAuxiliary.trailingPaddingSha256 !== auxiliary.expectedTrailingPaddingSha256
          || verifiedAuxiliary.objectSha256 !== auxiliary.expectedObjectSha256
          || verifiedAuxiliary.linkedSha256 !== auxiliary.expectedLinkedSha256
          || verifiedAuxiliary.rawBytesExact !== true
          || verifiedAuxiliary.linkedOwner !== replacement.cObject) {
        fail('recorded Phase 8 auxiliary provenance drift: ' + target.symbol + ' ' + auxiliary.outputSection);
      }
      for (const [relative, expectedSha256, label] of [
        [recordedTail.binaryRelative, recordedTail.binarySha256, 'auxiliary tail binary'],
        [recordedTail.objectRelative, recordedTail.objectSha256, 'auxiliary tail object'],
      ]) {
        if (!relative && auxiliary.ownerTailBytes === 0) continue;
        const file = resolveRelative(output, relative, `recorded ${label}`);
        if (!fs.existsSync(file) || sha256File(file) !== expectedSha256) {
          fail(`recorded Phase 8 ${label} identity drift: ${target.symbol}`);
        }
      }
    }
    for (const [relative, expectedSha256, label] of [
      [replacement.cObject, replacement.cObjectSha256, 'object'],
      [replacement.compilerAssembly, replacement.compilerAssemblySha256, 'compiler assembly'],
      [replacement.linkedAssembly, replacement.linkedAssemblySha256, 'section-adjusted assembly'],
      [replacement.sourceObjectProof.path, replacement.sourceObjectProof.sha256, 'source-to-object proof'],
    ]) {
      const file = resolveRelative(output, relative, `recorded ${label}`);
      if (!fs.existsSync(file) || sha256File(file) !== expectedSha256) {
        fail(`recorded Phase 8 ${label} identity drift: ${target.symbol}`);
      }
    }
  }
  for (const name of ['elf', 'map', 'rom', 'layout', 'elfReport', 'objectManifest']) {
    if (!buildReport.verification.outputs[name]
        || buildReport.verification.outputs[name].sha256 !== verification.outputs[name].sha256) {
      fail(`recorded Phase 8 ${name} identity drift`);
    }
  }
  if (buildReport.verification.outputs.codeRegionSha256 !== verification.outputs.codeRegionSha256) {
    fail('recorded Phase 8 code-region identity drift');
  }
  if (JSON.stringify(buildReport.verification.targets) !== JSON.stringify(verification.targets)) {
    fail('recorded Phase 8 target proof drift');
  }
  if (JSON.stringify(buildReport.verification.asmDiffer) !== JSON.stringify(verification.asmDiffer)) {
    fail('recorded Phase 8 asm-differ proof drift');
  }
  return { schemaVersion: 3, status: 'pass' };
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
  LINKAGE_CONFIG_PATH,
  ROOT,
  adjustSectionAssembly,
  assertBuildLocations,
  auxiliaryRelocationRecords,
  compareLinkedTargetBytes,
  compareLinkedAuxiliaryBytes,
  compileTarget,
  copyPhase7Objects,
  fail,
  linkPhase8,
  legalizeCop1BinaryAssembly,
  loadCanonicalBaserom,
  loadPhase8Model,
  pathIndependentRuntime,
  readJson,
  relocationRecords,
  runTargetAsmDiffer,
  sha256File,
  summarizeTargetComparison,
  targetAsmDifferMaxLines,
  validateRecordedPhase8Build,
  validateAuxiliaryTailObject,
  verifyAuxiliaryPaddingBytes,
  validateSourceObjectProofBytes,
  validateTargetClassifications,
  verifyCompilerTextFunctions,
  verifyCompiler,
  verifySourceObjectProofs,
  verifyObjectManifest,
  verifyPhase7Input,
  verifyPhase8Output,
  verifyRuntimeTools,
  verifyTargetMapOwner,
  verifyAuxiliaryMapOwner,
  writeJson,
  writeSourceObjectProofs,
  writeLayout,
  writeObjectManifest,
};
