'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  elfSectionBytes,
  parseElfFile,
  sha256Buffer,
  sha256File,
} = require('./phase7_conventional');
const {
  adjustSectionAssembly,
  auxiliaryRelocationRecords,
  compileTarget,
  relocationRecords,
  targetTextOwners,
  verifyAuxiliaryPaddingBytes,
  verifyCompilerTextFunctions,
} = require('./phase8_matching_c');
const { splitRelocatableTextSection } = require('./elf_text_split');

const CACHE_SCHEMA_VERSION = 1;
const DEFAULT_CACHE_ROOT = path.join(ROOT, 'build', 'diff-object-cache');
const SAFE_SYMBOL = /^[A-Za-z_.$][A-Za-z0-9_.$]*$/;
const SHA256 = /^[0-9A-F]{64}$/;
const OBJCOPY_FLAGS = Object.freeze([
  '--remove-section=.reginfo',
  '--remove-section=.pdr',
  '--remove-section=.comment',
  '--remove-section=.note',
]);
const IMPLEMENTATION_FILES = Object.freeze([
  'tools/diff.js',
  'tools/lib/active_targets.js',
  'tools/lib/diff_object_cache.js',
  'tools/lib/elf_text_split.js',
  'tools/lib/phase7_conventional.js',
  'tools/lib/phase8_matching_c.js',
  'tools/lib/source_policy.js',
]);
const ACTIVE_CONFIGURATION_FILES = Object.freeze([
  'config/matching-c-targets.json',
  'config/matching-c-linkage.json',
  'config/matching-c-multi-owner.json',
  'config/phase8/matching-c.json',
  'config/source-policy.json',
]);

function fail(message) {
  throw new Error(`diff object cache: ${message}`);
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function safeRelative(value, label) {
  if (typeof value !== 'string') fail(`${label} is not a path`);
  const normalized = normalizePath(value);
  if (!normalized || path.isAbsolute(value) || normalized === '..'
      || normalized.startsWith('../') || normalized.includes('/../')) {
    fail(`${label} is not a safe relative path: ${value}`);
  }
  return normalized;
}

function exactKeys(value, expected) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());
}

function canonicalValue(value, label = 'value') {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) fail(`${label} contains a non-finite number`);
    return value;
  }
  if (Array.isArray(value)) return value.map((item, index) => canonicalValue(item, `${label}[${index}]`));
  if (!value || typeof value !== 'object' || Object.getPrototypeOf(value) !== Object.prototype) {
    fail(`${label} is not canonical JSON data`);
  }
  const result = {};
  for (const key of Object.keys(value).sort()) {
    if (value[key] === undefined) fail(`${label}.${key} is undefined`);
    result[key] = canonicalValue(value[key], `${label}.${key}`);
  }
  return result;
}

function canonicalJson(value) {
  return JSON.stringify(canonicalValue(value));
}

function sha256Value(value) {
  return crypto.createHash('sha256').update(canonicalJson(value)).digest('hex').toUpperCase();
}

function sameValue(left, right) {
  return canonicalJson(left) === canonicalJson(right);
}

function fileIdentity(file, shownPath) {
  if (!fs.existsSync(file)) fail(`identity input is missing: ${shownPath}`);
  const status = fs.lstatSync(file);
  if (!status.isFile() || status.isSymbolicLink()) fail(`identity input is not a regular file: ${shownPath}`);
  return { path: shownPath, bytes: status.size, sha256: sha256File(file) };
}

function defaultImplementationIdentities() {
  return IMPLEMENTATION_FILES.map((relative) => fileIdentity(
    path.join(ROOT, ...relative.split('/')),
    relative,
  ));
}

function defaultSourcePolicyConfigIdentity() {
  const relative = 'config/source-policy.json';
  return fileIdentity(path.join(ROOT, ...relative.split('/')), relative);
}

function defaultConfigurationIdentities(phase8) {
  const records = [
    ...((phase8 && phase8.model && phase8.model.inputFiles) || []),
    ...ACTIVE_CONFIGURATION_FILES.map((relative) => fileIdentity(
      path.join(ROOT, ...relative.split('/')),
      relative,
    )),
  ];
  if (phase8 && phase8.config && phase8.config.compiler
      && typeof phase8.config.compiler.manifest === 'string') {
    const relative = safeRelative(phase8.config.compiler.manifest, 'compiler manifest');
    records.push(fileIdentity(path.join(ROOT, ...relative.split('/')), relative));
  }
  const byPath = new Map();
  for (const record of records) {
    if (!record || typeof record.path !== 'string' || !Number.isInteger(record.bytes)
        || typeof record.sha256 !== 'string' || !SHA256.test(record.sha256)) {
      fail('sealed configuration identity is malformed');
    }
    const previous = byPath.get(record.path);
    if (previous && !sameValue(previous, record)) fail(`sealed configuration identity conflicts: ${record.path}`);
    byPath.set(record.path, { path: record.path, bytes: record.bytes, sha256: record.sha256 });
  }
  return [...byPath.values()].sort((left, right) => left.path.localeCompare(right.path));
}

function executableIdentity(record, label) {
  if (!record || !Number.isInteger(record.bytes) || record.bytes <= 0
      || typeof record.sha256 !== 'string' || !SHA256.test(record.sha256)) {
    fail(`${label} executable identity is malformed`);
  }
  return { bytes: record.bytes, sha256: record.sha256 };
}

function compilerIdentity(record) {
  const executable = executableIdentity(record, 'compiler');
  const fields = ['sourceCommit', 'sourceTree', 'target', 'abi', 'endianness', 'isa'];
  const result = { ...executable };
  for (const field of fields) {
    if (typeof record[field] !== 'string' || record[field].length === 0) {
      fail(`compiler identity ${field} is malformed`);
    }
    result[field] = record[field];
  }
  if (!Array.isArray(record.compileFlags) || record.compileFlags.some((flag) => typeof flag !== 'string')) {
    fail('compiler identity flags are malformed');
  }
  result.compileFlags = [...record.compileFlags];
  return result;
}

function createCacheSeal(options) {
  const implementationIdentities = options.implementationIdentities || defaultImplementationIdentities();
  const sourcePolicyConfigIdentity = options.sourcePolicyConfigIdentity || defaultSourcePolicyConfigIdentity();
  const configurationIdentities = options.configurationIdentities || defaultConfigurationIdentities(options.phase8);
  const executableFiles = [
    { role: 'compiler', path: path.resolve(options.compiler), ...executableIdentity(options.verifiedCompiler, 'compiler') },
    { role: 'assembler', path: path.resolve(options.assemblerPath), ...executableIdentity(options.assembler, 'assembler') },
    { role: 'objcopy', path: path.resolve(options.objcopyPath), ...executableIdentity(options.objcopy, 'objcopy') },
  ];
  return {
    schemaVersion: 1,
    implementationIdentities: canonicalValue(implementationIdentities, 'sealed implementation identities'),
    sourcePolicyConfigIdentity: canonicalValue(sourcePolicyConfigIdentity, 'sealed source-policy config identity'),
    configurationIdentities: canonicalValue(configurationIdentities, 'sealed configuration identities'),
    executableFiles,
  };
}

function verifyFileIdentity(file, expected, label) {
  if (!fs.existsSync(file)) fail(`${label} is missing`);
  const status = fs.lstatSync(file);
  if (!status.isFile() || status.isSymbolicLink()) fail(`${label} is not a regular file`);
  if (status.size !== expected.bytes || sha256File(file) !== expected.sha256) {
    fail(`${label} identity drift`);
  }
}

function verifyCacheSeal(seal) {
  if (!seal || seal.schemaVersion !== 1
      || !Array.isArray(seal.implementationIdentities)
      || !Array.isArray(seal.configurationIdentities)
      || !Array.isArray(seal.executableFiles)) {
    fail('cache seal is malformed');
  }
  for (const record of seal.implementationIdentities) {
    const relative = safeRelative(record.path, 'sealed implementation path');
    verifyFileIdentity(path.join(ROOT, ...relative.split('/')), record, `sealed implementation ${relative}`);
  }
  for (const record of seal.configurationIdentities) {
    const relative = safeRelative(record.path, 'sealed configuration path');
    verifyFileIdentity(path.join(ROOT, ...relative.split('/')), record, `sealed configuration ${relative}`);
  }
  const sourcePolicyRelative = safeRelative(seal.sourcePolicyConfigIdentity.path, 'sealed source-policy path');
  verifyFileIdentity(
    path.join(ROOT, ...sourcePolicyRelative.split('/')),
    seal.sourcePolicyConfigIdentity,
    `sealed source-policy config ${sourcePolicyRelative}`,
  );
  const roles = new Set();
  for (const record of seal.executableFiles) {
    if (!record || typeof record.role !== 'string' || roles.has(record.role)
        || typeof record.path !== 'string' || !path.isAbsolute(record.path)) {
      fail('sealed executable identity is malformed');
    }
    roles.add(record.role);
    verifyFileIdentity(record.path, record, `sealed ${record.role}`);
  }
  if (!sameStringSet(roles, ['compiler', 'assembler', 'objcopy'])) fail('sealed executable role census drift');
  return seal;
}

function verifyTargetSourceIdentity(target) {
  if (!target || typeof target.source !== 'string' || typeof target.sourceSha256 !== 'string'
      || !SHA256.test(target.sourceSha256)) {
    fail('target source identity is malformed');
  }
  const relative = safeRelative(target.source, 'target source');
  const file = assertStrictDescendant(ROOT, path.join(ROOT, ...relative.split('/')), `target source ${target.symbol}`);
  verifyFileIdentity(file, { bytes: fs.existsSync(file) ? fs.statSync(file).size : -1, sha256: target.sourceSha256 }, `target source ${target.symbol}`);
  return { path: relative, bytes: fs.statSync(file).size, sha256: target.sourceSha256 };
}

function projectTargetContract(target) {
  if (!target || typeof target.symbol !== 'string' || !SAFE_SYMBOL.test(target.symbol)
      || typeof target.source !== 'string' || !target.source
      || typeof target.sourceSha256 !== 'string' || !SHA256.test(target.sourceSha256)) {
    fail('target contract is malformed');
  }
  const excluded = new Set(['targetIndex', 'model', 'row', 'rows', 'descriptor', 'multiOwnerContract']);
  const projected = {};
  for (const [key, value] of Object.entries(target)) {
    if (excluded.has(key)) continue;
    if (key === 'textOwners') {
      projected.textOwners = targetTextOwners(target).map((owner) => {
        const result = {};
        for (const [ownerKey, ownerValue] of Object.entries(owner)) {
          if (ownerKey !== 'row') result[ownerKey] = ownerValue;
        }
        return result;
      });
      continue;
    }
    projected[key] = value;
  }
  return canonicalValue(projected, `target contract ${target.symbol}`);
}

function validateClassification(target, classification) {
  if (!classification || typeof classification !== 'object'
      || classification.symbol !== target.symbol
      || classification.source !== target.source
      || classification.bytes !== target.bytes
      || classification.sourceSha256 !== target.sourceSha256
      || typeof classification.preprocessedSha256 !== 'string'
      || !SHA256.test(classification.preprocessedSha256)
      || typeof classification.digest !== 'string' || !SHA256.test(classification.digest)
      || !['PURE_C', 'HYBRID_C'].includes(classification.class)) {
    fail(`fresh source-policy classification drift: ${target.symbol}`);
  }
  return canonicalValue(classification, `source-policy record ${target.symbol}`);
}

function createCacheKeyMaterial(options) {
  const {
    phase8,
    target,
    classification,
    verifiedCompiler,
    assembler,
    objcopy,
  } = options;
  if (!phase8 || !phase8.config || !phase8.config.compiler || !phase8.model
      || !phase8.model.config || !phase8.model.config.binutils) {
    fail('compile configuration is malformed');
  }
  const compileFlags = phase8.config.compiler.compileFlags;
  const assemblerFlags = phase8.model.config.binutils.compilerAssemblerFlags;
  if (!Array.isArray(compileFlags) || compileFlags.some((flag) => typeof flag !== 'string')
      || !Array.isArray(assemblerFlags) || assemblerFlags.some((flag) => typeof flag !== 'string')) {
    fail('compile or assembler flags are malformed');
  }
  const implementation = options.implementationIdentities || defaultImplementationIdentities();
  const sourcePolicyConfig = options.sourcePolicyConfigIdentity || defaultSourcePolicyConfigIdentity();
  return canonicalValue({
    schemaVersion: CACHE_SCHEMA_VERSION,
    mode: 'accepted-diff-sibling-object',
    target: projectTargetContract(target),
    sourcePolicy: {
      record: validateClassification(target, classification),
      config: sourcePolicyConfig,
    },
    commands: {
      compiler: {
        executable: compilerIdentity(verifiedCompiler),
        acceptedConfig: phase8.config.compiler,
        flags: [...compileFlags],
        source: target.source,
        output: 'compiler-assembly',
      },
      sectionAdjustment: {
        allowAuxiliaryReadOnlySections: false,
        auxiliarySections: target.auxiliarySections || [],
        legalizeCop1BinaryInstructions: false,
      },
      assembler: {
        executable: executableIdentity(assembler, 'assembler'),
        flags: [...assemblerFlags],
        input: 'adjusted-assembly',
        output: targetTextOwners(target).length > 1 ? 'assembler-object' : 'source-object',
      },
      textSplit: targetTextOwners(target).length > 1,
      objcopy: {
        executable: executableIdentity(objcopy, 'objcopy'),
        flags: [...OBJCOPY_FLAGS],
        input: 'source-object',
        output: 'final-object',
      },
    },
    implementation,
  }, `cache key material ${target.symbol}`);
}

function artifactSpecifications(target) {
  if (!target || typeof target.symbol !== 'string' || !SAFE_SYMBOL.test(target.symbol)) {
    fail('artifact target symbol is malformed');
  }
  const symbol = target.symbol;
  const specs = [
    { name: 'compiler.s', destination: `generated/c/${symbol}.compiler.s` },
    { name: 'adjusted.s', destination: `generated/c/${symbol}.s` },
    { name: 'source-object.o', destination: `objects/c/${symbol}.source-object.o` },
  ];
  if (targetTextOwners(target).length > 1) {
    specs.push({ name: 'assembler-object.o', destination: `objects/c/${symbol}.assembler-object.o` });
  }
  specs.push({ name: 'final.o', destination: `objects/c/${symbol}.o` });
  return specs;
}

function outputArtifactFiles(output, target) {
  const files = {};
  for (const spec of artifactSpecifications(target)) {
    const relative = safeRelative(spec.destination, 'output artifact destination');
    files[spec.name] = path.join(output, ...relative.split('/'));
  }
  return files;
}

function cacheEntryPath(cacheRoot, target, key) {
  if (!target || typeof target.symbol !== 'string' || !SAFE_SYMBOL.test(target.symbol)) {
    fail('cache target symbol is malformed');
  }
  if (typeof key !== 'string' || !SHA256.test(key)) fail('cache key is malformed');
  return path.join(path.resolve(cacheRoot), target.symbol, key);
}

function assertStrictDescendant(root, candidate, label) {
  const resolvedRoot = path.resolve(root);
  const resolvedCandidate = path.resolve(candidate);
  const relative = path.relative(resolvedRoot, resolvedCandidate);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    fail(`${label} escapes its root`);
  }
  return resolvedCandidate;
}

function assertExistingConfinement(root, candidate, label) {
  const resolved = assertStrictDescendant(root, candidate, label);
  const realRoot = fs.realpathSync.native(path.resolve(root));
  const realCandidate = fs.realpathSync.native(resolved);
  const relative = path.relative(realRoot, realCandidate);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    fail(`${label} resolves outside its root`);
  }
  return resolved;
}

function readRegularFile(file, label) {
  if (!fs.existsSync(file)) fail(`${label} is missing`);
  const status = fs.lstatSync(file);
  if (!status.isFile() || status.isSymbolicLink()) fail(`${label} is not a regular file`);
  return fs.readFileSync(file);
}

function assertDirectory(directory, label) {
  if (!fs.existsSync(directory)) fail(`${label} is missing`);
  const status = fs.lstatSync(directory);
  if (!status.isDirectory() || status.isSymbolicLink()) fail(`${label} is not a regular directory`);
}

function sameStringSet(actual, expected) {
  return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

function primaryCompilerFunctionBytes(target) {
  const functions = target.compilerTextFunctions;
  if (!Array.isArray(functions) || functions.length === 0
      || functions[0].symbol !== target.symbol
      || !Number.isInteger(functions[0].bytes) || functions[0].bytes <= 0) {
    fail(`primary compiler text-function contract is malformed: ${target.symbol}`);
  }
  if (targetTextOwners(target).length > 1
      && (functions.length !== 1 || functions[0].bytes !== target.bytes)) {
    fail(`multi-owner compiler text-function contract is malformed: ${target.symbol}`);
  }
  return functions[0].bytes;
}

function validateOwnerSymbols(elf, target, ownerSections, linked = false) {
  const base = linked ? target.vramStartNumber : 0;
  const primaryBytes = primaryCompilerFunctionBytes(target);
  for (const [ownerIndex, record] of ownerSections.entries()) {
    const expectedName = ownerIndex === 0 ? target.symbol : record.owner.symbol;
    const expectedSize = ownerIndex === 0 ? primaryBytes : 0;
    const matches = elf.symbols.filter((symbol) => symbol.name === expectedName);
    if (matches.length !== 1 || matches[0].value !== base
        || matches[0].size !== expectedSize || matches[0].binding !== 1
        || matches[0].symbolType !== 2 || matches[0].sectionIndex !== record.section.index) {
      fail(`target owner symbol drift: ${target.symbol} ${expectedName}`);
    }
  }
}

function inspectOwnerSections(elf, target, label) {
  return targetTextOwners(target).map((owner) => {
    const sections = elf.sections.filter((section) => section.name === owner.sectionName);
    if (sections.length !== 1 || sections[0].type !== 1 || (sections[0].flags & 6) !== 6
        || sections[0].size !== owner.bytes) {
      fail(`${label} target section shape drift: ${target.symbol} ${owner.sectionName}`);
    }
    return { owner, section: sections[0], bytes: Buffer.from(elfSectionBytes(elf, sections[0])) };
  });
}

function inspectAuxiliarySections(elf, target, label) {
  return (target.auxiliarySections || []).map((auxiliary) => {
    const sections = elf.sections.filter((section) => section.name === auxiliary.outputSection);
    if (sections.length !== 1 || sections[0].type !== 1 || sections[0].flags !== 2
        || sections[0].alignment !== auxiliary.alignment || sections[0].size !== auxiliary.bytes) {
      fail(`${label} auxiliary section shape drift: ${target.symbol} ${auxiliary.outputSection}`);
    }
    const bytes = Buffer.from(elfSectionBytes(elf, sections[0]));
    const padding = verifyAuxiliaryPaddingBytes(
      bytes,
      auxiliary,
      `${target.symbol} ${auxiliary.outputSection} cached ${label}`,
    );
    if (sha256Buffer(bytes) !== auxiliary.expectedObjectSha256) {
      fail(`${label} auxiliary bytes drift: ${target.symbol} ${auxiliary.outputSection}`);
    }
    const relocations = auxiliaryRelocationRecords(elf, target, auxiliary);
    if (!sameValue(relocations, auxiliary.expectedRelocations)) {
      fail(`${label} auxiliary relocations drift: ${target.symbol} ${auxiliary.outputSection}`);
    }
    return {
      compilerSection: auxiliary.compilerSection,
      outputSection: auxiliary.outputSection,
      bytes: bytes.length,
      sha256: sha256Buffer(bytes),
      alignment: sections[0].alignment,
      flags: sections[0].flags,
      relocations,
      ...padding,
      section: sections[0],
      rawBytes: bytes,
    };
  });
}

function validateAllocatedSections(elf, target, allowReginfo, label) {
  const accepted = new Set([
    ...targetTextOwners(target).map((owner) => owner.sectionName),
    ...(target.auxiliarySections || []).map((auxiliary) => auxiliary.outputSection),
    ...(allowReginfo ? ['.reginfo'] : []),
  ]);
  const unexpected = elf.sections.filter((section) => (
    section.size > 0 && (section.flags & 2) !== 0 && !accepted.has(section.name)
  ));
  if (unexpected.length > 0) {
    fail(`${label} contains an uncontracted allocated section: ${target.symbol} ${unexpected[0].name}`);
  }
  for (const name of ['.data', '.bss']) {
    const section = elf.sections.find((candidate) => candidate.name === name);
    if (section && section.size !== 0) fail(`${label} unexpectedly owns ${name} bytes: ${target.symbol}`);
  }
}

function inspectCompiledTargetArtifacts(options) {
  const { phase8, target, classification, files } = options;
  validateClassification(target, classification);
  const specs = artifactSpecifications(target);
  if (!files || !sameStringSet(Object.keys(files), specs.map((spec) => spec.name))) {
    fail(`compiled artifact file census drift: ${target.symbol}`);
  }
  const bytesByName = {};
  for (const spec of specs) bytesByName[spec.name] = readRegularFile(files[spec.name], `${target.symbol} ${spec.name}`);

  const expectedAdjusted = adjustSectionAssembly(bytesByName['compiler.s'], target.sectionName, {
    auxiliarySections: target.auxiliarySections || [],
  });
  if (!bytesByName['adjusted.s'].equals(expectedAdjusted)) {
    fail(`section-adjusted compiler assembly drift: ${target.symbol}`);
  }

  let splitResult = null;
  if (targetTextOwners(target).length > 1) {
    splitResult = splitRelocatableTextSection(
      bytesByName['assembler-object.o'],
      target.sectionName,
      targetTextOwners(target).map((owner) => ({
        sectionName: owner.sectionName,
        bytes: owner.bytes,
        symbol: owner.symbol,
        symbolSize: owner.ownerIndex === 0 ? target.bytes : 0,
      })),
    );
    if (!bytesByName['source-object.o'].equals(splitResult.buffer)) {
      fail(`split source-object bytes drift: ${target.symbol}`);
    }
  }

  const sourceElf = parseElfFile(files['source-object.o']);
  const sourceOwners = inspectOwnerSections(sourceElf, target, 'source object');
  const textBytes = Buffer.concat(sourceOwners.map((record) => record.bytes));
  if (textBytes.length !== target.bytes) fail(`source object text extent drift: ${target.symbol}`);
  const compilerTextFunctions = verifyCompilerTextFunctions(sourceElf, target, sourceOwners[0].section);
  validateOwnerSymbols(sourceElf, target, sourceOwners);
  validateAllocatedSections(sourceElf, target, true, 'source object');
  const relocations = relocationRecords(sourceElf, target);
  if (!sameValue(relocations, target.expectedRelocations)) {
    fail(`source object relocation contract drift: ${target.symbol}`);
  }
  const sourceAuxiliary = inspectAuxiliarySections(sourceElf, target, 'source object');

  const finalElf = parseElfFile(files['final.o']);
  const forbiddenFinalSections = ['.reginfo', '.pdr', '.comment', '.note']
    .filter((name) => finalElf.sections.some((section) => section.name === name));
  if (forbiddenFinalSections.length > 0) {
    fail(`final object retained removed ancillary section: ${target.symbol} ${forbiddenFinalSections[0]}`);
  }
  const finalOwners = inspectOwnerSections(finalElf, target, 'final object');
  for (const [index, record] of finalOwners.entries()) {
    const source = sourceOwners[index];
    if (record.section.type !== source.section.type || record.section.flags !== source.section.flags
        || record.section.alignment !== source.section.alignment || !record.bytes.equals(source.bytes)) {
      fail(`final object changed target owner evidence: ${target.symbol} ${record.owner.sectionName}`);
    }
  }
  const finalCompilerFunctions = verifyCompilerTextFunctions(finalElf, target, finalOwners[0].section);
  if (!sameValue(finalCompilerFunctions, compilerTextFunctions)) {
    fail(`final object changed compiler text-function evidence: ${target.symbol}`);
  }
  validateOwnerSymbols(finalElf, target, finalOwners);
  validateAllocatedSections(finalElf, target, false, 'final object');
  const finalRelocations = relocationRecords(finalElf, target);
  if (!sameValue(finalRelocations, relocations)) {
    fail(`final object changed target relocations: ${target.symbol}`);
  }
  const finalAuxiliary = inspectAuxiliarySections(finalElf, target, 'final object');
  for (const [index, record] of finalAuxiliary.entries()) {
    const source = sourceAuxiliary[index];
    if (record.section.type !== source.section.type || record.section.flags !== source.section.flags
        || record.section.alignment !== source.section.alignment
        || !record.rawBytes.equals(source.rawBytes)
        || !sameValue(record.relocations, source.relocations)) {
      fail(`final object changed auxiliary evidence: ${target.symbol} ${record.outputSection}`);
    }
  }

  return {
    symbol: target.symbol,
    objectRelative: `objects/c/${target.symbol}.o`,
    objectSha256: sha256File(files['final.o']),
    proofObjectRelative: `objects/c/${target.symbol}.source-object.o`,
    proofObjectSha256: sha256File(files['source-object.o']),
    assemblerObjectRelative: splitResult ? `objects/c/${target.symbol}.assembler-object.o` : null,
    assemblerObjectSha256: splitResult ? sha256File(files['assembler-object.o']) : null,
    compilerAssemblyRelative: `generated/c/${target.symbol}.compiler.s`,
    compilerAssemblySha256: sha256File(files['compiler.s']),
    linkedAssemblyRelative: `generated/c/${target.symbol}.s`,
    linkedAssemblySha256: sha256File(files['adjusted.s']),
    sourceClass: classification.class,
    sourcePolicyDigest: classification.digest,
    compilerAssemblyRewritten: false,
    textBytes: textBytes.length,
    textSha256: sha256Buffer(textBytes),
    compilerTextFunctions,
    textOwners: sourceOwners.map((record) => ({
      sectionName: record.owner.sectionName,
      logicalOffset: record.owner.logicalOffset,
      bytes: record.bytes.length,
      sha256: sha256Buffer(record.bytes),
    })),
    splitContract: splitResult ? {
      sourceSection: splitResult.sourceSection,
      sourceBytes: splitResult.sourceBytes,
      owners: splitResult.owners,
      relocationSections: splitResult.relocationSections,
    } : null,
    relocations,
    auxiliarySections: sourceAuxiliary.map(({ section, rawBytes, ...record }) => record),
  };
}

function artifactIdentity(file, spec) {
  const bytes = readRegularFile(file, `cache artifact ${spec.name}`);
  return {
    name: spec.name,
    destination: spec.destination,
    bytes: bytes.length,
    sha256: sha256Buffer(bytes),
  };
}

function validateEntryDirectory(options) {
  const {
    cacheRoot,
    entry,
    keyMaterial,
    target,
    classification,
    inspectArtifacts = inspectCompiledTargetArtifacts,
    phase8,
  } = options;
  assertDirectory(cacheRoot, 'cache root');
  assertDirectory(entry, 'cache entry');
  assertExistingConfinement(cacheRoot, entry, 'cache entry');
  const names = fs.readdirSync(entry);
  if (!sameStringSet(names, ['artifacts', 'metadata.json'])) fail(`cache entry file census drift: ${target.symbol}`);
  const artifactsDirectory = path.join(entry, 'artifacts');
  assertDirectory(artifactsDirectory, 'cache artifact directory');
  assertExistingConfinement(cacheRoot, artifactsDirectory, 'cache artifact directory');
  const metadataFile = path.join(entry, 'metadata.json');
  const metadataBytes = readRegularFile(metadataFile, 'cache metadata');
  let metadata;
  try {
    metadata = JSON.parse(metadataBytes.toString('utf8'));
  } catch (error) {
    fail(`cache metadata is not JSON: ${error.message}`);
  }
  if (!exactKeys(metadata, ['schemaVersion', 'cacheKey', 'keyMaterial', 'artifacts', 'compiled'])
      || metadata.schemaVersion !== CACHE_SCHEMA_VERSION) {
    fail(`cache metadata schema drift: ${target.symbol}`);
  }
  const key = sha256Value(keyMaterial);
  if (metadata.cacheKey !== key || !sameValue(metadata.keyMaterial, keyMaterial)) {
    fail(`cache metadata key drift: ${target.symbol}`);
  }
  const specs = artifactSpecifications(target);
  const artifactNames = fs.readdirSync(artifactsDirectory);
  if (!sameStringSet(artifactNames, specs.map((spec) => spec.name))) {
    fail(`cache artifact file census drift: ${target.symbol}`);
  }
  if (!Array.isArray(metadata.artifacts) || metadata.artifacts.length !== specs.length) {
    fail(`cache artifact metadata census drift: ${target.symbol}`);
  }
  const files = {};
  const identities = [];
  for (const [index, spec] of specs.entries()) {
    const record = metadata.artifacts[index];
    if (!exactKeys(record, ['name', 'destination', 'bytes', 'sha256'])
        || record.name !== spec.name || record.destination !== spec.destination
        || safeRelative(record.destination, 'cache artifact destination') !== spec.destination) {
      fail(`cache artifact metadata path drift: ${target.symbol} ${spec.name}`);
    }
    const file = path.join(artifactsDirectory, spec.name);
    assertExistingConfinement(cacheRoot, file, `cache artifact ${spec.name}`);
    const identity = artifactIdentity(file, spec);
    if (!sameValue(identity, record)) fail(`cache artifact identity drift: ${target.symbol} ${spec.name}`);
    files[spec.name] = file;
    identities.push(identity);
  }
  const compiled = inspectArtifacts({ phase8, target, classification, files });
  if (!sameValue(compiled, metadata.compiled)) fail(`cache compiled metadata drift: ${target.symbol}`);
  const canonicalMetadata = Buffer.from(`${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
  if (!metadataBytes.equals(canonicalMetadata)) fail(`cache metadata encoding drift: ${target.symbol}`);
  return { entry, key, metadata, compiled, identities };
}

function validateCacheEntry(options) {
  const key = sha256Value(options.keyMaterial);
  const entry = cacheEntryPath(options.cacheRoot, options.target, key);
  return validateEntryDirectory({ ...options, key, entry });
}

function tryCacheEntry(options) {
  const key = sha256Value(options.keyMaterial);
  const entry = cacheEntryPath(options.cacheRoot, options.target, key);
  if (!fs.existsSync(entry)) return { hit: false, key, entry, reason: 'absent' };
  try {
    return { hit: true, ...validateEntryDirectory({ ...options, key, entry }) };
  } catch (error) {
    return { hit: false, key, entry, reason: error.message };
  }
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function copyArtifactsToOutput(options) {
  const { cacheRoot, entry, target, output, identities } = options;
  const artifactsDirectory = path.join(entry, 'artifacts');
  const files = {};
  for (const [index, spec] of artifactSpecifications(target).entries()) {
    const source = path.join(artifactsDirectory, spec.name);
    assertExistingConfinement(cacheRoot, source, `cached ${spec.name}`);
    const relative = safeRelative(spec.destination, 'diff artifact destination');
    const destination = assertStrictDescendant(output, path.join(output, ...relative.split('/')), `diff artifact ${spec.name}`);
    ensureDirectory(path.dirname(destination));
    if (fs.existsSync(destination)) fail(`diff artifact destination already exists: ${relative}`);
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    if (!sameValue(artifactIdentity(destination, spec), identities[index])) {
      fail(`copied diff artifact identity drift: ${target.symbol} ${spec.name}`);
    }
    files[spec.name] = destination;
  }
  return files;
}

function removeCacheDirectory(cacheRoot, directory) {
  assertStrictDescendant(cacheRoot, directory, 'cache removal target');
  if (!fs.existsSync(directory)) return;
  const status = fs.lstatSync(directory);
  if (status.isSymbolicLink()) {
    fs.unlinkSync(directory);
    return;
  }
  if (status.isFile()) {
    fs.unlinkSync(directory);
    return;
  }
  assertExistingConfinement(cacheRoot, directory, 'cache removal target');
  if (!status.isDirectory()) fail('cache removal target is not a directory');
  fs.rmSync(directory, { recursive: true, force: true });
}

function renameCacheDirectory(source, destination, renameEntry = fs.renameSync, wait = null) {
  const pause = wait || ((milliseconds) => {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
  });
  const retryDelays = [10, 20, 40, 80, 160];
  for (let attempt = 0; ; attempt += 1) {
    try {
      renameEntry(source, destination);
      return;
    } catch (error) {
      const transient = error && ['EPERM', 'EACCES'].includes(error.code)
        && !fs.existsSync(destination) && attempt < retryDelays.length;
      if (!transient) throw error;
      pause(retryDelays[attempt]);
    }
  }
}

function publishCacheEntry(options) {
  const {
    cacheRoot,
    keyMaterial,
    target,
    classification,
    phase8,
    sourceFiles,
    compiled,
    inspectArtifacts = inspectCompiledTargetArtifacts,
    renameEntry = fs.renameSync,
  } = options;
  const key = sha256Value(keyMaterial);
  const entry = cacheEntryPath(cacheRoot, target, key);
  ensureDirectory(cacheRoot);
  assertDirectory(cacheRoot, 'cache root');
  const targetRoot = path.dirname(entry);
  ensureDirectory(targetRoot);
  assertDirectory(targetRoot, 'cache target directory');
  assertExistingConfinement(cacheRoot, targetRoot, 'cache target directory');
  const staging = path.join(targetRoot, `.${key}.tmp-${process.pid}-${crypto.randomBytes(6).toString('hex')}`);
  assertStrictDescendant(cacheRoot, staging, 'cache staging directory');
  try {
    ensureDirectory(path.join(staging, 'artifacts'));
    const identities = [];
    for (const spec of artifactSpecifications(target)) {
      const source = sourceFiles[spec.name];
      readRegularFile(source, `publish source ${spec.name}`);
      const destination = path.join(staging, 'artifacts', spec.name);
      fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
      identities.push(artifactIdentity(destination, spec));
    }
    const metadata = {
      schemaVersion: CACHE_SCHEMA_VERSION,
      cacheKey: key,
      keyMaterial,
      artifacts: identities,
      compiled,
    };
    fs.writeFileSync(path.join(staging, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`, { flag: 'wx' });
    validateEntryDirectory({
      cacheRoot,
      entry: staging,
      keyMaterial,
      target,
      classification,
      phase8,
      inspectArtifacts,
    });

    if (fs.existsSync(entry)) {
      let existing = null;
      try {
        existing = validateEntryDirectory({
          cacheRoot,
          entry,
          keyMaterial,
          target,
          classification,
          phase8,
          inspectArtifacts,
        });
      } catch (_) {
        removeCacheDirectory(cacheRoot, entry);
      }
      if (existing) {
        if (!sameValue(existing.compiled, compiled)) fail(`concurrent cache entry differs: ${target.symbol}`);
        removeCacheDirectory(cacheRoot, staging);
        return existing;
      }
    }
    try {
      renameCacheDirectory(staging, entry, renameEntry);
    } catch (error) {
      const collision = error && ['EEXIST', 'ENOTEMPTY', 'EPERM', 'EACCES'].includes(error.code) && fs.existsSync(entry);
      if (!collision) throw error;
      const winner = validateEntryDirectory({
        cacheRoot,
        entry,
        keyMaterial,
        target,
        classification,
        phase8,
        inspectArtifacts,
      });
      if (!sameValue(winner.compiled, compiled)) fail(`concurrent cache winner differs: ${target.symbol}`);
      removeCacheDirectory(cacheRoot, staging);
      return winner;
    }
    return validateEntryDirectory({
      cacheRoot,
      entry,
      keyMaterial,
      target,
      classification,
      phase8,
      inspectArtifacts,
    });
  } finally {
    if (fs.existsSync(staging)) removeCacheDirectory(cacheRoot, staging);
  }
}

function compileOrReuseTarget(options) {
  const {
    phase8,
    target,
    classification,
    output,
    compiler,
    assemblerPath,
    objcopyPath,
    cacheRoot = DEFAULT_CACHE_ROOT,
    compile = compileTarget,
    inspectArtifacts = inspectCompiledTargetArtifacts,
  } = options;
  const seal = options.cacheSeal || createCacheSeal(options);
  const verifySeal = options.verifyCacheSeal || verifyCacheSeal;
  const verifySource = options.verifyTargetSource || verifyTargetSourceIdentity;
  const sealManagedByCaller = options.sealManagedByCaller === true;
  const sealedOptions = {
    ...options,
    implementationIdentities: seal.implementationIdentities,
    sourcePolicyConfigIdentity: seal.sourcePolicyConfigIdentity,
  };
  if (!sealManagedByCaller) verifySeal(seal);
  verifySource(target);
  const keyMaterial = createCacheKeyMaterial(sealedOptions);
  const cached = tryCacheEntry({
    cacheRoot,
    keyMaterial,
    target,
    classification,
    phase8,
    inspectArtifacts,
  });
  if (cached.hit) {
    const files = copyArtifactsToOutput({
      cacheRoot,
      entry: cached.entry,
      target,
      output,
      identities: cached.identities,
    });
    const copied = inspectArtifacts({ phase8, target, classification, files });
    if (!sameValue(copied, cached.compiled)) fail(`copied cache evidence drift: ${target.symbol}`);
    verifySource(target);
    if (!sealManagedByCaller) verifySeal(seal);
    return { compiled: copied, cache: { status: 'hit', key: cached.key, reason: null } };
  }

  const freshlyCompiled = compile(
    phase8,
    target,
    output,
    compiler,
    assemblerPath,
    objcopyPath,
    { enforceAcceptedContract: true, classification },
  );
  verifySource(target);
  verifySeal(seal);
  const sourceFiles = outputArtifactFiles(output, target);
  const inspected = inspectArtifacts({ phase8, target, classification, files: sourceFiles });
  if (!sameValue(freshlyCompiled, inspected)) fail(`fresh compiler artifact metadata drift: ${target.symbol}`);
  publishCacheEntry({
    cacheRoot,
    keyMaterial,
    target,
    classification,
    phase8,
    sourceFiles,
    compiled: inspected,
    inspectArtifacts,
    renameEntry: options.renameEntry,
  });
  verifySource(target);
  if (!sealManagedByCaller) verifySeal(seal);
  return {
    compiled: inspected,
    cache: {
      status: cached.reason === 'absent' ? 'miss' : 'rebuilt',
      key: cached.key,
      reason: cached.reason,
    },
  };
}

function compileDiffTargets(options) {
  const {
    phase8,
    requestedTarget,
    output,
    compiler,
    assemblerPath,
    objcopyPath,
    classificationBySymbol,
    compile = compileTarget,
  } = options;
  if (!phase8 || !Array.isArray(phase8.targets) || phase8.targets.length === 0
      || !requestedTarget || !classificationBySymbol || typeof classificationBySymbol.get !== 'function') {
    fail('diff target compilation inputs are malformed');
  }
  const compiled = new Map();
  const entries = [];
  let requestedCount = 0;
  let compilerInvocations = 0;
  const seal = options.cacheSeal || createCacheSeal(options);
  const verifySeal = options.verifyCacheSeal || verifyCacheSeal;
  const verifySource = options.verifyTargetSource || verifyTargetSourceIdentity;
  verifySeal(seal);
  const sealedOptions = {
    ...options,
    cacheSeal: seal,
    sealManagedByCaller: true,
    implementationIdentities: seal.implementationIdentities,
    sourcePolicyConfigIdentity: seal.sourcePolicyConfigIdentity,
  };
  for (const target of phase8.targets) {
    const classification = classificationBySymbol.get(target.symbol);
    if (target.symbol === requestedTarget.symbol) {
      requestedCount += 1;
      verifySource(target);
      const result = compile(
        phase8,
        target,
        output,
        compiler,
        assemblerPath,
        objcopyPath,
        { enforceAcceptedContract: false, classification },
      );
      verifySource(target);
      verifySeal(seal);
      compiled.set(target.symbol, result);
      compilerInvocations += 1;
      entries.push({ symbol: target.symbol, status: 'requested-fresh', key: null, reason: null });
      continue;
    }
    const result = compileOrReuseTarget({
      ...sealedOptions,
      target,
      classification,
      compile,
    });
    compiled.set(target.symbol, result.compiled);
    if (result.cache.status !== 'hit') compilerInvocations += 1;
    entries.push({ symbol: target.symbol, ...result.cache });
  }
  if (requestedCount !== 1 || compiled.size !== phase8.targets.length) {
    fail(`requested target compilation census drift: ${requestedTarget.symbol}`);
  }
  for (const target of phase8.targets) verifySource(target);
  verifySeal(seal);
  const count = (status) => entries.filter((entry) => entry.status === status).length;
  return {
    compiled,
    cache: {
      schemaVersion: CACHE_SCHEMA_VERSION,
      root: path.resolve(options.cacheRoot || DEFAULT_CACHE_ROOT),
      requestedFresh: count('requested-fresh'),
      hits: count('hit'),
      misses: count('miss'),
      rebuilt: count('rebuilt'),
      compilerInvocations,
      entries,
    },
  };
}

module.exports = {
  ACTIVE_CONFIGURATION_FILES,
  CACHE_SCHEMA_VERSION,
  DEFAULT_CACHE_ROOT,
  IMPLEMENTATION_FILES,
  OBJCOPY_FLAGS,
  artifactSpecifications,
  cacheEntryPath,
  canonicalJson,
  compileDiffTargets,
  compileOrReuseTarget,
  createCacheSeal,
  createCacheKeyMaterial,
  defaultImplementationIdentities,
  defaultConfigurationIdentities,
  defaultSourcePolicyConfigIdentity,
  inspectCompiledTargetArtifacts,
  outputArtifactFiles,
  projectTargetContract,
  publishCacheEntry,
  renameCacheDirectory,
  sha256Value,
  tryCacheEntry,
  validateCacheEntry,
  verifyCacheSeal,
  verifyTargetSourceIdentity,
};
