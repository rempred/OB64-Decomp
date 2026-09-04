'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  elfSectionBytes,
  parseElfFile,
  run,
  sha256Buffer,
  sha256File,
} = require('../phase7_conventional');
const { relocationRecords } = require('../phase8_matching_c');
const { currentVerificationState } = require('../current_workflow');
const { compareMips } = require('./mips_analysis');
const { canonicalJson, digest } = require('./target_model');

const WORKBENCH_COMPARISON_CONTRACT = 1;
const DIAGNOSTIC_LINK_CONTRACT = 1;
const SUPPORTED_TEXT_RELOCATIONS = new Set(['R_MIPS_26', 'R_MIPS_HI16', 'R_MIPS_LO16']);
const LINKABLE_PLACEMENTS = new Set(['early-boot-linear', 'non-descriptor-load-slab', 'overlay']);
const MAX_ALIGNMENT_TAIL = 12;
const MAX_DIAGNOSTIC_TOOL_PATH = 240;
const ENVIRONMENT_CACHE = Symbol('matching-diagnostic-environment');
// Seal every implementation file that can change comparison inputs,
// admissibility, ELF/relocation resolution, or score selection. Changing this
// set invalidates stored comparisons without changing the compile cache key.
const COMPARISON_ALGORITHM_FILES = Object.freeze([
  path.join(__dirname, 'diagnostic_link.js'),
  path.join(__dirname, 'mips_analysis.js'),
  path.join(__dirname, 'compiler.js'),
  path.join(__dirname, 'target_model.js'),
  path.join(__dirname, '..', 'current_workflow.js'),
  path.join(__dirname, '..', 'phase7_conventional.js'),
  path.join(__dirname, '..', 'phase8_matching_c.js'),
  path.join(ROOT, 'tools', 'matching_workbench', 'store.py'),
]);
let algorithmIdentity = null;

function unavailable(code, reason, details = {}) {
  return { available: false, code, reason, details };
}

function comparisonAlgorithmManifest() {
  return {
    schemaVersion: 1,
    comparisonContract: WORKBENCH_COMPARISON_CONTRACT,
    files: COMPARISON_ALGORITHM_FILES.map((file) => ({
      path: path.relative(ROOT, file).replace(/\\/g, '/'),
      sha256: sha256File(file),
    })),
  };
}

function comparisonAlgorithmIdentity() {
  if (algorithmIdentity) return algorithmIdentity;
  algorithmIdentity = digest(comparisonAlgorithmManifest());
  return algorithmIdentity;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function resolveContained(base, relative, label) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) {
    throw new Error(`${label} path is not a nonempty relative path`);
  }
  const root = path.resolve(base);
  const resolved = path.resolve(root, ...relative.replace(/\\/g, '/').split('/'));
  const relation = path.relative(root, resolved);
  if (!relation || relation === '..' || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
    throw new Error(`${label} path escapes its authenticated output root`);
  }
  return resolved;
}

function acceptedControlArtifacts(output, buildReport) {
  const replacements = buildReport?.targetReplacements;
  if (!Array.isArray(replacements)) {
    return { available: false, identity: digest({ schemaVersion: 1, malformed: true }), invalid: ['targetReplacements'] };
  }
  const realOutput = fs.realpathSync(output);
  const records = replacements.map((replacement) => {
    const base = {
      symbol: replacement?.symbol || null,
      sourceObject: replacement?.sourceObject || null,
      expectedSha256: replacement?.sourceObjectSha256 || null,
    };
    try {
      if (typeof base.expectedSha256 !== 'string' || !/^[A-F0-9]{64}$/i.test(base.expectedSha256)) {
        throw new Error('missing expected SHA-256');
      }
      const file = resolveContained(output, base.sourceObject, 'accepted source object');
      if (!fs.existsSync(file)) throw new Error('file is missing');
      const stat = fs.lstatSync(file);
      const realFile = fs.realpathSync(file);
      const relation = path.relative(realOutput, realFile);
      if (!stat.isFile() || stat.isSymbolicLink() || !relation
          || relation === '..' || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error('file escapes the real accepted output');
      }
      const actualSha256 = sha256File(file);
      if (actualSha256 !== base.expectedSha256) throw new Error('SHA-256 differs from build report');
      return { ...base, actualSha256, bytes: stat.size, error: null };
    } catch (error) {
      return { ...base, actualSha256: null, bytes: null, error: error.message };
    }
  }).sort((left, right) => canonicalJson(left).localeCompare(canonicalJson(right)));
  const invalid = records.filter((record) => record.error !== null);
  return {
    available: invalid.length === 0,
    identity: digest({ schemaVersion: 1, records }),
    count: records.length,
    invalid: invalid.slice(0, 8),
    invalidOmitted: Math.max(0, invalid.length - 8),
  };
}

function acceptedSymbolIndex(elf) {
  const index = new Map();
  for (const symbol of elf.symbols) {
    const definedSection = symbol.sectionIndex === 0xFFF1
      || (symbol.sectionIndex > 0 && symbol.sectionIndex < elf.sections.length);
    if (!symbol.name || !definedSection || (symbol.binding !== 1 && symbol.binding !== 2)) continue;
    if (!index.has(symbol.name)) index.set(symbol.name, []);
    index.get(symbol.name).push({
      name: symbol.name,
      value: symbol.value >>> 0,
      bytes: symbol.size,
      binding: symbol.binding,
      visibility: symbol.visibility,
      symbolType: symbol.symbolType,
      sectionIndex: symbol.sectionIndex,
      section: elf.sections[symbol.sectionIndex]?.name || (symbol.sectionIndex === 0xFFF1 ? 'SHN_ABS' : '<special>'),
    });
  }
  return index;
}

function environmentIdentity(status) {
  return digest({
    schemaVersion: 1,
    currentFingerprint: status.currentFingerprint,
    available: status.available,
    code: status.code || null,
    acceptedElfSha256: status.acceptedElfSha256 || null,
    acceptedControlsId: status.acceptedControlsId || null,
    buildReportSha256: status.buildReportSha256 || null,
    verificationSha256: status.verificationSha256 || null,
  });
}

function loadDiagnosticEnvironment(session, options = {}) {
  if (options.environment) return options.environment;
  if (session?.[ENVIRONMENT_CACHE]) return session[ENVIRONMENT_CACHE];
  const base = { currentFingerprint: session?.context?.currentFingerprint || null };
  let result;
  try {
    if (!session?.context || !base.currentFingerprint) {
      result = unavailable('missing-session-provenance', 'compiler session lacks a current-build fingerprint', base);
    } else {
      const current = (options.currentVerificationState || currentVerificationState)(session.context);
      if (!current.exact || !current.state) {
        result = unavailable(
          'stale-current-build',
          'CURRENT is missing, stale, incomplete, or lacks exact verified ROM provenance',
          { ...base, stateFingerprint: current.state?.fingerprint || null },
        );
      } else {
        const output = path.resolve(current.state.output);
        const buildReportFile = path.join(output, 'build-report.json');
        const verificationFile = path.resolve(current.state.verificationReport || '');
        const elfFile = path.join(output, 'phase8.elf');
        const provenanceFiles = [buildReportFile, verificationFile, elfFile];
        if (provenanceFiles.some((file) => !fs.existsSync(file) || !fs.statSync(file).isFile())) {
          result = unavailable('stale-current-build', 'CURRENT diagnostic provenance files are missing', base);
        } else {
          const acceptedElfSha256 = sha256File(elfFile);
          const buildReportSha256 = sha256File(buildReportFile);
          const verificationSha256 = sha256File(verificationFile);
          const buildReport = readJson(buildReportFile);
          const verification = readJson(verificationFile);
          const expectedElf = buildReport?.verification?.outputs?.elf;
          const verifiedElf = verification?.verification?.outputs?.elf;
          const acceptedControls = acceptedControlArtifacts(output, buildReport);
          if (buildReport.schemaVersion !== 3 || buildReport.status !== 'pass'
              || verification.schemaVersion !== 3 || verification.status !== 'pass'
              || verification.verification?.status !== 'pass'
              || !expectedElf || !verifiedElf
              || expectedElf.sha256 !== acceptedElfSha256
              || verifiedElf.sha256 !== acceptedElfSha256
              || expectedElf.bytes !== fs.statSync(elfFile).size
              || verifiedElf.bytes !== fs.statSync(elfFile).size) {
            result = unavailable('stale-current-build', 'CURRENT ELF does not match its build and verification reports', {
              ...base,
              acceptedElfSha256,
              buildReportElfSha256: expectedElf?.sha256 || null,
              verificationElfSha256: verifiedElf?.sha256 || null,
            });
            Object.assign(result, { acceptedElfSha256, buildReportSha256, verificationSha256 });
          } else if (!acceptedControls.available) {
            result = unavailable(
              'accepted-control-artifact-drift',
              'CURRENT accepted control objects are missing, changed, or outside the authenticated output',
              {
                ...base,
                acceptedControlsId: acceptedControls.identity,
                invalid: acceptedControls.invalid,
                invalidOmitted: acceptedControls.invalidOmitted,
              },
            );
            Object.assign(result, {
              acceptedElfSha256,
              acceptedControlsId: acceptedControls.identity,
              buildReportSha256,
              verificationSha256,
            });
          } else {
            const acceptedElf = parseElfFile(elfFile);
            if (acceptedElf.header.type !== 2 || acceptedElf.header.machine !== 8) {
              result = unavailable('malformed-current-elf', 'CURRENT diagnostic ELF is not an executable MIPS ELF', base);
            } else {
              result = {
                available: true,
                currentFingerprint: base.currentFingerprint,
                output,
                buildReportFile,
                buildReport,
                buildReportSha256,
                verificationFile,
                verificationSha256,
                acceptedElfFile: elfFile,
                acceptedElfSha256,
                acceptedElf,
                acceptedControls,
                acceptedControlsId: acceptedControls.identity,
                symbols: acceptedSymbolIndex(acceptedElf),
              };
            }
          }
        }
      }
    }
  } catch (error) {
    result = unavailable('diagnostic-environment-error', error.message, base);
  }
  result.identity = environmentIdentity({ ...base, ...result });
  if (session) session[ENVIRONMENT_CACHE] = result;
  return result;
}

function normalizedRelocationNumber(value, allowNegative = false) {
  let number;
  if (Number.isSafeInteger(value)) number = value;
  else if (typeof value === 'string' && /^-?0x[0-9a-f]+$/i.test(value.trim())) {
    const text = value.trim();
    const negative = text.startsWith('-');
    number = Number.parseInt(negative ? text.slice(3) : text.slice(2), 16) * (negative ? -1 : 1);
  } else if (typeof value === 'string' && /^-?[0-9]+$/.test(value.trim())) {
    number = Number.parseInt(value.trim(), 10);
  }
  if (!Number.isSafeInteger(number) || (!allowNegative && number < 0)) {
    throw new Error('relocation offset or addend is not an integer');
  }
  return `${number < 0 ? '-' : ''}0x${Math.abs(number).toString(16).toUpperCase().padStart(8, '0')}`;
}

function normalizeRelocationList(records) {
  if (!Array.isArray(records)) throw new Error('text relocation records are not an array');
  return records.map((record) => ({
    offset: normalizedRelocationNumber(record.offset),
    type: record.type,
    symbol: record.symbol,
    section: record.section,
    ...(Object.prototype.hasOwnProperty.call(record, 'addend')
      ? { addend: normalizedRelocationNumber(record.addend, true) } : {}),
  }));
}

function validateDiagnosticObjectStructure(elf, target) {
  if (elf.header.type !== 1 || elf.header.machine !== 8) throw new Error('diagnostic input is not a relocatable MIPS ELF');
  const sections = elf.sections.filter((section) => section.name === target.sectionName);
  if (sections.length !== 1) throw new Error('diagnostic object target section count is not one');
  const section = sections[0];
  if (section.type !== 1 || section.flags !== 6 || section.alignment < 4) {
    throw new Error('diagnostic object target section shape is not executable read-only PROGBITS');
  }
  const allocated = elf.sections.filter((candidate) => candidate.size > 0 && (candidate.flags & 2) !== 0);
  const unsupportedAllocated = allocated.filter((candidate) => (
    candidate.index !== section.index && candidate.name !== '.reginfo'
  ));
  if (unsupportedAllocated.length) {
    throw new Error(`diagnostic object has auxiliary allocated ownership: ${unsupportedAllocated[0].name}`);
  }
  const reginfo = allocated.filter((candidate) => candidate.name === '.reginfo');
  if (reginfo.length > 1 || reginfo.some((candidate) => candidate.type !== 0x70000006 || candidate.flags !== 2)) {
    throw new Error('diagnostic object .reginfo shape is malformed');
  }
  const functions = elf.symbols.filter((symbol) => symbol.sectionIndex === section.index && symbol.symbolType === 2);
  if (functions.length !== 1) throw new Error(`diagnostic object is multi-owner; found ${functions.length} function symbols`);
  const owner = functions[0];
  if (owner.name !== target.symbol || owner.value !== 0 || owner.binding !== 1 || owner.visibility !== 0
      || !Number.isInteger(owner.size) || owner.size <= 0 || owner.size % 4 !== 0 || owner.size > section.size) {
    throw new Error('diagnostic object primary function ownership is malformed');
  }
  return { section, owner };
}

function assertSupportedRelocations(relocations) {
  const unsupported = relocations.filter((record) => !SUPPORTED_TEXT_RELOCATIONS.has(record.type));
  if (unsupported.length) throw new Error(`diagnostic object has unsupported text relocation ${unsupported[0].type}`);
}

function objectEvidence(objectFile, target, expectations = {}) {
  if (!fs.existsSync(objectFile) || !fs.statSync(objectFile).isFile()) {
    throw new Error('diagnostic object artifact is missing');
  }
  const objectSha256 = sha256File(objectFile);
  if (expectations.objectSha256 && objectSha256 !== expectations.objectSha256) {
    throw new Error('diagnostic object artifact identity drift');
  }
  const elf = parseElfFile(objectFile);
  const { section, owner } = validateDiagnosticObjectStructure(elf, target);
  const sectionBytes = Buffer.from(elfSectionBytes(elf, section));
  const text = Buffer.from(sectionBytes.subarray(0, owner.size));
  const tail = Buffer.from(sectionBytes.subarray(owner.size));
  if (tail.length > MAX_ALIGNMENT_TAIL || tail.length % 4 !== 0 || tail.some((byte) => byte !== 0)) {
    throw new Error('diagnostic object owns executable bytes outside the primary function');
  }
  if (expectations.objectText && !text.equals(expectations.objectText)) {
    throw new Error('diagnostic object text differs from the recorded compilation artifact');
  }
  const relocations = relocationRecords(elf, {
    symbol: target.symbol,
    bytes: owner.size,
    sectionName: target.sectionName,
    compilerTextFunctions: [{ symbol: target.symbol, offsetNumber: 0 }],
    auxiliarySections: [],
  });
  if (expectations.relocations
      && canonicalJson(normalizeRelocationList(relocations)) !== canonicalJson(normalizeRelocationList(expectations.relocations))) {
    throw new Error('diagnostic object relocations differ from recorded compilation evidence');
  }
  assertSupportedRelocations(relocations);
  return { objectFile, objectSha256, elf, section, owner, text, tail, relocations };
}

function exactAcceptedTargetBytes(environment, target) {
  const sections = environment.acceptedElf.sections.filter((section) => section.name === target.sectionName);
  if (sections.length !== 1) throw new Error('accepted target output section is missing or duplicated');
  const section = sections[0];
  const owners = environment.acceptedElf.symbols.filter((symbol) => (
    symbol.name === target.symbol && symbol.sectionIndex === section.index && symbol.symbolType === 2
  ));
  if (owners.length !== 1) throw new Error('accepted linked target symbol is missing or ambiguous');
  const owner = owners[0];
  if (owner.value !== target.vramStart || owner.size !== target.bytes || owner.binding !== 1
      || owner.visibility !== 0 || target.vramStart < section.address
      || target.vramStart + target.bytes > section.address + section.size) {
    throw new Error('accepted linked target placement or ownership differs from the target model');
  }
  const offset = target.vramStart - section.address;
  const bytes = Buffer.from(elfSectionBytes(environment.acceptedElf, section)).subarray(offset, offset + target.bytes);
  if (!bytes.equals(target.expectedBytes)) throw new Error('accepted linked target bytes differ from the baserom target');
  return { section, owner, sha256: sha256Buffer(bytes) };
}

function prepareTargetDiagnostic(session, target, expectedRelocationEvidence, options = {}) {
  const baseIdentity = {
    schemaVersion: 1,
    comparisonContract: WORKBENCH_COMPARISON_CONTRACT,
    diagnosticLinkContract: DIAGNOSTIC_LINK_CONTRACT,
    comparisonAlgorithmId: comparisonAlgorithmIdentity(),
    toolId: session?.toolId || null,
    currentFingerprint: session?.context?.currentFingerprint || null,
    targetId: target?.targetId || null,
    expectedRelocationEvidence,
  };
  function reject(code, reason, details = {}) {
    const result = unavailable(code, reason, details);
    result.comparisonAlgorithmId = baseIdentity.comparisonAlgorithmId;
    result.currentFingerprint = baseIdentity.currentFingerprint;
    result.inputId = digest({ ...baseIdentity, unavailable: { code, reason, details } });
    return result;
  }
  if (!target || !target.expectedBytes || target.symbolByteOffset !== 0) {
    return reject('unsupported-target-owner', 'isolated diagnostics require one ordinary accepted function owner');
  }
  if (!LINKABLE_PLACEMENTS.has(target.placementKind)) {
    return reject(
      target.placementKind === 'rom-only' ? 'rom-only-placement' : 'unknown-placement',
      'accepted runtime placement is unavailable for isolated linking',
      { placementKind: target.placementKind },
    );
  }
  const activeMatches = (session?.context?.phase8?.targets || []).filter((candidate) => (
    candidate.symbol === target.symbol && candidate.bytes === target.bytes
      && candidate.romStartNumber === target.romStart && candidate.vramStartNumber === target.vramStart
  ));
  if (activeMatches.length !== 1) {
    return reject(
      activeMatches.length === 0 ? 'nonactive-asm-owner' : 'ambiguous-active-owner',
      'target is not represented by one exact active C-source owner',
      { activeMatches: activeMatches.length },
    );
  }
  if (!expectedRelocationEvidence?.available) {
    return reject(
      'missing-accepted-relocation-contract',
      expectedRelocationEvidence?.reason || 'accepted relocation provenance is unavailable',
    );
  }
  const environment = loadDiagnosticEnvironment(session, options);
  if (!environment.available) {
    const result = reject(environment.code, environment.reason, {
      ...environment.details,
      environmentIdentity: environment.identity,
    });
    result.environment = { identity: environment.identity };
    return result;
  }
  try {
    const linkedTarget = exactAcceptedTargetBytes(environment, target);
    const replacements = environment.buildReport.targetReplacements.filter((record) => record.symbol === target.symbol);
    if (replacements.length !== 1) throw new Error('accepted build target replacement is missing or ambiguous');
    const replacement = replacements[0];
    if (!Array.isArray(replacement.owners) || replacement.owners.length !== 1
        || !Array.isArray(replacement.compilerTextFunctions) || replacement.compilerTextFunctions.length !== 1
        || replacement.compilerTextFunctions[0].symbol !== target.symbol
        || replacement.compilerTextFunctions[0].offset !== '0x00000000'
        || !Array.isArray(replacement.auxiliarySections) || replacement.auxiliarySections.length !== 0
        || !Array.isArray(replacement.auxiliaryTails) || replacement.auxiliaryTails.length !== 0) {
      throw new Error('accepted control has multi-owner or auxiliary ownership');
    }
    if (typeof replacement.sourceObjectSha256 !== 'string'
        || !/^[A-F0-9]{64}$/i.test(replacement.sourceObjectSha256)) {
      throw new Error('accepted control object lacks authenticated SHA-256 provenance');
    }
    const sourceObjectFile = resolveContained(environment.output, replacement.sourceObject, 'accepted source object');
    const control = objectEvidence(sourceObjectFile, target, {
      objectSha256: replacement.sourceObjectSha256,
      relocations: expectedRelocationEvidence.records,
    });
    if (control.owner.size !== target.bytes) {
      throw new Error('accepted control object extent is incompatible with the target');
    }
    if (canonicalJson(normalizeRelocationList(replacement.relocations))
        !== canonicalJson(normalizeRelocationList(expectedRelocationEvidence.records))) {
      throw new Error('accepted build relocation record differs from the reviewed contract');
    }
    const inputId = digest({
      ...baseIdentity,
      environmentIdentity: environment.identity,
      acceptedElfSha256: environment.acceptedElfSha256,
      linkedTargetSha256: linkedTarget.sha256,
      controlObjectSha256: control.objectSha256,
      controlRelocations: control.relocations,
    });
    return {
      available: true,
      inputId,
      comparisonAlgorithmId: baseIdentity.comparisonAlgorithmId,
      currentFingerprint: baseIdentity.currentFingerprint,
      environment,
      linkedTarget,
      replacement,
      control,
    };
  } catch (error) {
    return reject('accepted-control-unavailable', error.message, {
      environmentIdentity: environment.identity,
    });
  }
}

function linkerDefinitions(object, environment) {
  const names = [...new Set(object.elf.symbols
    .filter((symbol) => symbol.sectionIndex === 0 && symbol.name)
    .map((symbol) => symbol.name))].sort();
  const definitions = [];
  for (const name of names) {
    if (name === '.' || !/^[A-Za-z_.$][A-Za-z0-9_.$]*$/.test(name)) {
      throw new Error(`undefined diagnostic symbol has unsafe spelling: ${name}`);
    }
    const matches = environment.symbols.get(name) || [];
    if (matches.length === 0) throw new Error(`unresolved accepted symbol: ${name}`);
    if (matches.length !== 1) throw new Error(`ambiguous accepted symbol: ${name}`);
    definitions.push(`${name} = 0x${matches[0].value.toString(16).toUpperCase()};`);
  }
  return { names, definitions };
}

function ensurePlainDiagnosticDirectory(directory) {
  const parent = path.dirname(directory);
  const parentStat = fs.lstatSync(parent);
  if (!parentStat.isDirectory() || parentStat.isSymbolicLink()) {
    throw new Error('diagnostic link parent is not a plain run directory');
  }
  if (!fs.existsSync(directory)) {
    try {
      fs.mkdirSync(directory);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
  const stat = fs.lstatSync(directory);
  if (!stat.isDirectory() || stat.isSymbolicLink()
      || path.dirname(fs.realpathSync(directory)) !== fs.realpathSync(parent)) {
    throw new Error('diagnostic link directory escapes its real run directory');
  }
}

function diagnosticAttemptIdentity(inputId, nonce) {
  return digest({ schemaVersion: 1, diagnosticInputId: inputId, nonce });
}

function createDiagnosticAttemptDirectory(runDirectory, inputId, options = {}) {
  if (typeof inputId !== 'string' || !/^[A-F0-9]{64}$/i.test(inputId)) {
    throw new Error('diagnostic input identity is malformed');
  }
  const runStat = fs.lstatSync(runDirectory);
  if (!runStat.isDirectory() || runStat.isSymbolicLink()) {
    throw new Error('diagnostic attempt parent is not a plain run directory');
  }
  const explicitNonce = options.nonce;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const nonce = explicitNonce || crypto.randomBytes(32).toString('hex');
    const attemptId = diagnosticAttemptIdentity(inputId, nonce);
    const directory = path.join(runDirectory, `d-${attemptId.slice(0, 20)}`);
    try {
      fs.mkdirSync(directory);
    } catch (error) {
      if (error.code === 'EEXIST' && !explicitNonce) continue;
      if (error.code === 'EEXIST') throw new Error(`diagnostic attempt directory already exists: ${attemptId}`);
      throw error;
    }
    ensurePlainDiagnosticDirectory(directory);
    const manifest = {
      schemaVersion: 1,
      diagnosticInputId: inputId,
      attemptId,
    };
    const manifestFile = path.join(directory, 'input.json');
    fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx',
    });
    assertPlainDiagnosticOutput(manifestFile, directory);
    return {
      attemptId,
      directory,
      manifestFile,
      manifestSha256: sha256File(manifestFile),
    };
  }
  throw new Error('could not allocate a unique diagnostic attempt directory');
}

function assertPlainDiagnosticOutput(file, directory) {
  if (!fs.existsSync(file)) return;
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1
      || path.dirname(fs.realpathSync(file)) !== fs.realpathSync(directory)) {
    throw new Error('diagnostic link output is not a plain run artifact');
  }
}

function linkOne(session, target, object, environment, artifactDir, label) {
  if (!/^[A-Za-z0-9_.]+$/.test(target.sectionName)) throw new Error('target section name is unsafe for a diagnostic linker script');
  ensurePlainDiagnosticDirectory(artifactDir);
  const resolution = linkerDefinitions(object, environment);
  const script = path.join(artifactDir, `${label}.ld`);
  const output = path.join(artifactDir, `${label}.elf`);
  const linkInput = path.join(artifactDir, `${label}.input.o`);
  if (Math.max(script.length, output.length, linkInput.length) >= MAX_DIAGNOSTIC_TOOL_PATH) {
    throw new Error(`diagnostic tool path exceeds ${MAX_DIAGNOSTIC_TOOL_PATH - 1} characters`);
  }
  for (const file of [script, output, linkInput]) assertPlainDiagnosticOutput(file, artifactDir);
  const source = [
    'OUTPUT_FORMAT("elf32-bigmips")',
    'OUTPUT_ARCH(mips)',
    'SECTIONS',
    '{',
    `  ${target.sectionName} 0x${target.vramStart.toString(16).toUpperCase()} : AT(0x1000)`,
    `  { *(${target.sectionName}) }`,
    '}',
    ...resolution.definitions,
    '',
  ].join('\n');
  fs.writeFileSync(script, source);
  const linkerScriptSha256 = sha256File(script);
  const objcopy = session.runtime.tools['mips-kmc-elf-objcopy.exe'].path;
  run(objcopy, [
    '--remove-section=.reginfo',
    '--remove-section=.pdr',
    '--remove-section=.comment',
    '--remove-section=.note',
    object.objectFile,
    linkInput,
  ], { cwd: ROOT });
  const stripped = objectEvidence(linkInput, target, {
    objectText: object.text,
    relocations: object.relocations,
  });
  const linker = session.runtime.tools['mips-kmc-elf-ld.exe'].path;
  const args = [
    ...session.context.phase8.model.config.binutils.linkerFlags,
    '-T', script,
    '-o', output,
    stripped.objectFile,
  ];
  const started = Date.now();
  run(linker, args, { cwd: ROOT });
  for (const file of [script, output, linkInput]) assertPlainDiagnosticOutput(file, artifactDir);
  if (sha256File(script) !== linkerScriptSha256
      || sha256File(linkInput) !== stripped.objectSha256) {
    throw new Error('diagnostic link inputs changed during linker execution');
  }
  const linked = parseElfFile(output);
  const sections = linked.sections.filter((section) => section.name === target.sectionName);
  if (sections.length !== 1) throw new Error('diagnostic linked target section is missing or duplicated');
  const section = sections[0];
  const owners = linked.symbols.filter((symbol) => (
    symbol.name === target.symbol && symbol.sectionIndex === section.index && symbol.symbolType === 2
  ));
  if (owners.length !== 1) throw new Error('diagnostic linked target owner is missing or ambiguous');
  const owner = owners[0];
  if (owner.value !== target.vramStart || owner.size !== object.owner.size || owner.binding !== 1 || owner.visibility !== 0) {
    throw new Error('diagnostic linked target placement or owner extent is wrong');
  }
  const allocated = linked.sections.filter((candidate) => candidate.size > 0 && (candidate.flags & 2) !== 0);
  if (allocated.length !== 1 || allocated[0].index !== section.index) {
    throw new Error('diagnostic link retained auxiliary allocated ownership');
  }
  const sectionBytes = Buffer.from(elfSectionBytes(linked, section));
  const bytes = Buffer.from(sectionBytes.subarray(0, owner.size));
  const tail = Buffer.from(sectionBytes.subarray(owner.size));
  if (tail.length > MAX_ALIGNMENT_TAIL || tail.length % 4 !== 0 || tail.some((byte) => byte !== 0)) {
    throw new Error('diagnostic link emitted nontrivial bytes outside the target owner');
  }
  const undefinedSymbols = linked.symbols.filter((symbol) => symbol.sectionIndex === 0 && symbol.name);
  if (undefinedSymbols.length) throw new Error(`diagnostic link retained unresolved symbol: ${undefinedSymbols[0].name}`);
  return {
    bytes,
    evidence: {
      kind: 'authenticated-isolated-link',
      acceptanceEligible: false,
      linkerSha256: sha256File(linker),
      objcopySha256: sha256File(objcopy),
      linkerScriptSha256,
      objectSha256: object.objectSha256,
      linkInputSha256: stripped.objectSha256,
      linkedElfSha256: sha256File(output),
      linkedBytesSha256: sha256Buffer(bytes),
      linkedBytes: bytes.length,
      resolvedSymbols: resolution.names.length,
      acceptedElfSha256: environment.acceptedElfSha256,
      vramStart: `0x${target.vramStart.toString(16).toUpperCase().padStart(8, '0')}`,
      durationMs: Date.now() - started,
      artifacts: {
        linkerScript: path.relative(ROOT, script).replace(/\\/g, '/'),
        linkInput: path.relative(ROOT, linkInput).replace(/\\/g, '/'),
        linkedElf: path.relative(ROOT, output).replace(/\\/g, '/'),
      },
    },
  };
}

function symbolicFallback(target, objectText, comparisonOptions, rawComparison, prepared, failure) {
  const selected = compareMips(target.expectedBytes, objectText, {
    ...comparisonOptions,
    start: target.vramStart,
    symbolicControlFlow: true,
  });
  const actualRelocations = selected.relocationEvidence.actual;
  const expectedRelocations = selected.relocationEvidence.expected;
  const relocationAddressUnresolved = actualRelocations.available !== true
    || actualRelocations.complete !== true
    || Number(actualRelocations.count || 0) > 0
    || expectedRelocations.available !== true
    || expectedRelocations.complete !== true
    || Number(expectedRelocations.count || 0) > 0;
  const diagnosticAddressIdentityResolved = selected.cfgExact !== null && !relocationAddressUnresolved;
  const exactAddressUnresolved = selected.exactBytes && !diagnosticAddressIdentityResolved;
  const primaryClass = exactAddressUnresolved
    ? selected.cfgExact === null ? 'control-flow-address-unresolved' : 'relocation-address-unresolved'
    : selected.primaryClass;
  const recommendation = exactAddressUnresolved
    ? 'resolve or link the recorded address-bearing relocations before treating identical raw object bytes as an exact diagnostic lead'
    : selected.recommendation;
  const relocationAddressLabel = exactAddressUnresolved && selected.cfgExact !== null ? {
    category: 'relocation-address-unresolved',
    likelihood: 'high',
    interpretation: 'The raw buffers are identical, but an address-bearing relocation remains unresolved in symbolic fallback evidence.',
    evidence: selected.relocationEvidence,
    searchFamilies: ['authenticated isolated link', 'accepted relocation and symbol provenance'],
    avoidUntilResolved: ['exact diagnostic ranking', 'acceptance claims'],
  } : null;
  const diagnosticEnvironmentId = prepared.environment?.identity
    || prepared.details?.environmentIdentity || null;
  return {
    ...selected,
    schemaVersion: 3,
    comparisonContract: WORKBENCH_COMPARISON_CONTRACT,
    comparisonAlgorithmId: prepared.comparisonAlgorithmId,
    diagnosticCurrentFingerprint: prepared.currentFingerprint,
    diagnosticEnvironmentConsulted: diagnosticEnvironmentId !== null,
    diagnosticEnvironmentId,
    evidenceMode: 'symbolic-object',
    acceptanceEligible: false,
    primaryClass,
    recommendation,
    labels: relocationAddressLabel ? [relocationAddressLabel, ...selected.labels] : selected.labels,
    exactBytes: rawComparison.exactBytes,
    relocationMaskedExact: rawComparison.relocationMaskedExact,
    rawExactBytes: rawComparison.exactBytes,
    rawRelocationMaskedExact: rawComparison.relocationMaskedExact,
    diagnosticExactBytes: exactAddressUnresolved ? null : selected.exactBytes,
    diagnosticRelocationMaskedExact: exactAddressUnresolved ? null : selected.relocationMaskedExact,
    diagnosticAddressIdentityResolved,
    diagnosticInputId: prepared.inputId,
    diagnostic: {
      status: 'unavailable',
      mode: 'symbolic-object',
      code: failure.code,
      reason: failure.reason,
      details: failure.details || {},
    },
    rawObjectComparison: rawComparison,
  };
}

function relocationOperandIdentity(records) {
  if (!Array.isArray(records)) return null;
  return normalizeRelocationList(records).map((record) => ({
    type: record.type,
    symbol: record.symbol,
    section: record.section,
    ...(Object.prototype.hasOwnProperty.call(record, 'addend') ? { addend: record.addend } : {}),
  })).sort((left, right) => canonicalJson(left).localeCompare(canonicalJson(right)));
}

function relocationPlacementIdentity(records) {
  if (!Array.isArray(records)) return null;
  return normalizeRelocationList(records)
    .sort((left, right) => canonicalJson(left).localeCompare(canonicalJson(right)));
}

function relocationOperandIdentityMismatch(expectedRelocationEvidence, actualRelocations) {
  if (!expectedRelocationEvidence?.available || !Array.isArray(expectedRelocationEvidence.records)
      || !Array.isArray(actualRelocations)) return false;
  return canonicalJson(relocationOperandIdentity(expectedRelocationEvidence.records))
    !== canonicalJson(relocationOperandIdentity(actualRelocations));
}

function relocationPlacementIdentityMismatch(expectedRelocationEvidence, actualRelocations) {
  if (!expectedRelocationEvidence?.available || !Array.isArray(expectedRelocationEvidence.records)
      || !Array.isArray(actualRelocations)) return false;
  return canonicalJson(relocationPlacementIdentity(expectedRelocationEvidence.records))
    !== canonicalJson(relocationPlacementIdentity(actualRelocations));
}

function resolvedDiagnosticComparison({
  target,
  linkedBytes,
  rawComparison,
  prepared,
  controlEvidence,
  candidateEvidence,
  attempt,
  expectedRelocationEvidence,
  actualRelocations,
}) {
  const selected = compareMips(target.expectedBytes, linkedBytes, {
    start: target.vramStart,
  });
  const operandIdentityMismatch = relocationOperandIdentityMismatch(
    expectedRelocationEvidence,
    actualRelocations,
  );
  const placementIdentityMismatch = relocationPlacementIdentityMismatch(
    expectedRelocationEvidence,
    actualRelocations,
  );
  const exactPlacementMismatch = selected.exactBytes
    && placementIdentityMismatch && !operandIdentityMismatch;
  const identityLabel = operandIdentityMismatch ? {
    category: 'relocation-operand-identity',
    likelihood: 'high',
    interpretation: 'The isolated bytes were resolved, but normalized relocation symbol/type/section/addend identity differs from the accepted contract.',
    evidence: rawComparison.relocationEvidence.mismatch,
    searchFamilies: ['wrong symbol or alias', 'compensating relocation addend', 'relocation-bearing expression'],
    avoidUntilResolved: ['treating linked byte equality as relocation equality', 'acceptance claims'],
  } : null;
  const placementLabel = exactPlacementMismatch ? {
    category: 'relocation-placement-identity',
    likelihood: 'high',
    interpretation: 'The isolated bytes match, but full relocation identity differs at one or more instruction offsets.',
    evidence: rawComparison.relocationEvidence.mismatch,
    searchFamilies: ['relocation-bearing instruction placement', 'compensating raw operand', 'statement or scheduler order'],
    avoidUntilResolved: ['treating linked byte equality as full relocation equality', 'exact diagnostic ranking', 'acceptance claims'],
  } : null;
  const identityMismatchClass = operandIdentityMismatch
    ? 'relocation-operand-identity-mismatch'
    : exactPlacementMismatch ? 'relocation-placement-identity-mismatch' : null;
  const diagnosticEnvironmentId = prepared.environment?.identity
    || prepared.details?.environmentIdentity || null;
  return {
    ...selected,
    schemaVersion: 3,
    comparisonContract: WORKBENCH_COMPARISON_CONTRACT,
    comparisonAlgorithmId: prepared.comparisonAlgorithmId,
    diagnosticCurrentFingerprint: prepared.currentFingerprint,
    diagnosticEnvironmentConsulted: diagnosticEnvironmentId !== null,
    diagnosticEnvironmentId,
    evidenceMode: 'authenticated-isolated-link',
    acceptanceEligible: false,
    primaryClass: identityMismatchClass || selected.primaryClass,
    recommendation: identityMismatchClass
      ? `restore the accepted relocation ${operandIdentityMismatch ? 'symbol/type/section/addend' : 'instruction-offset'} identity before treating the resolved bytes as an exact lead`
      : selected.recommendation,
    labels: identityLabel
      ? [identityLabel, ...selected.labels]
      : placementLabel ? [placementLabel, ...selected.labels] : selected.labels,
    exactBytes: rawComparison.exactBytes,
    relocationMaskedExact: rawComparison.relocationMaskedExact,
    rawExactBytes: rawComparison.exactBytes,
    rawRelocationMaskedExact: rawComparison.relocationMaskedExact,
    diagnosticExactBytes: selected.exactBytes,
    diagnosticRelocationMaskedExact: selected.relocationMaskedExact,
    relocationOperandIdentityExact: !placementIdentityMismatch,
    relocationOperandMultisetExact: !operandIdentityMismatch,
    relocationPlacementIdentityExact: !placementIdentityMismatch,
    diagnosticInputId: prepared.inputId,
    diagnostic: {
      status: 'available',
      mode: 'authenticated-isolated-link',
      attemptId: attempt?.attemptId || null,
      attemptManifestSha256: attempt?.manifestSha256 || null,
      attemptManifest: attempt?.manifestFile
        ? path.relative(ROOT, attempt.manifestFile).replace(/\\/g, '/') : null,
      control: controlEvidence,
      candidate: candidateEvidence,
      caveat: 'This isolated link is diagnostic only and does not prove canonical ownership, target acceptance, or full-ROM equality.',
    },
    rawObjectComparison: rawComparison,
  };
}

function compareCandidateDiagnostic({
  session,
  target,
  objectText,
  actualRelocations,
  expectedRelocationEvidence,
  candidateArtifact,
  artifactDir,
  prepared,
  options = {},
}) {
  const comparisonOptions = {
    actualRelocations,
    actualRelocationsAvailable: true,
    ...(expectedRelocationEvidence.available ? {
      expectedRelocations: expectedRelocationEvidence.records,
      expectedRelocationsAvailable: true,
    } : {
      expectedRelocationsAvailable: false,
      expectedRelocationsUnavailableReason: expectedRelocationEvidence.reason,
    }),
  };
  const rawComparison = compareMips(target.expectedBytes, objectText, {
    ...comparisonOptions,
    start: target.vramStart,
  });
  const targetDiagnostic = prepared || prepareTargetDiagnostic(session, target, expectedRelocationEvidence, options);
  if (!targetDiagnostic.available) {
    return symbolicFallback(target, objectText, comparisonOptions, rawComparison, targetDiagnostic, targetDiagnostic);
  }
  let candidate;
  try {
    if (!candidateArtifact?.objectFile || !candidateArtifact?.objectSha256) {
      throw new Error('candidate object artifact provenance is unavailable');
    }
    candidate = objectEvidence(candidateArtifact.objectFile, target, {
      objectSha256: candidateArtifact.objectSha256,
      objectText,
      relocations: actualRelocations,
    });
  } catch (error) {
    const code = /unsupported text relocation/.test(error.message)
      ? 'unsupported-relocation'
      : /auxiliary allocated ownership|multi-owner|primary function ownership/.test(error.message)
        ? 'candidate-ownership-ineligible'
        : 'candidate-object-unavailable';
    return symbolicFallback(target, objectText, comparisonOptions, rawComparison, targetDiagnostic,
      unavailable(code, error.message));
  }
  try {
    const attempt = createDiagnosticAttemptDirectory(artifactDir, targetDiagnostic.inputId);
    const control = linkOne(session, target, targetDiagnostic.control, targetDiagnostic.environment, attempt.directory, 'accepted-control');
    if (!control.bytes.equals(target.expectedBytes)) {
      return symbolicFallback(target, objectText, comparisonOptions, rawComparison, targetDiagnostic,
        unavailable('accepted-control-reproduction-failed', 'isolated accepted control did not reproduce canonical target bytes', {
          expectedSha256: target.expectedBytesSha256,
          actualSha256: control.evidence.linkedBytesSha256,
        }));
    }
    const linked = linkOne(session, target, candidate, targetDiagnostic.environment, attempt.directory, 'candidate');
    return resolvedDiagnosticComparison({
      target,
      linkedBytes: linked.bytes,
      rawComparison,
      prepared: targetDiagnostic,
      controlEvidence: control.evidence,
      candidateEvidence: linked.evidence,
      attempt,
      expectedRelocationEvidence,
      actualRelocations,
    });
  } catch (error) {
    const code = /ambiguous accepted symbol/.test(error.message)
      ? 'ambiguous-symbol'
      : /unresolved accepted symbol/.test(error.message)
        ? 'unresolved-symbol'
        : 'isolated-link-failed';
    return symbolicFallback(target, objectText, comparisonOptions, rawComparison, targetDiagnostic,
      unavailable(code, error.message));
  }
}

function comparisonIsCurrent(record, prepared) {
  const details = record?.details || record;
  return Boolean(details
    && details.schemaVersion === 3
    && details.comparisonContract === WORKBENCH_COMPARISON_CONTRACT
    && details.comparisonAlgorithmId === prepared.comparisonAlgorithmId
    && details.diagnosticCurrentFingerprint === prepared.currentFingerprint
    && details.acceptanceEligible === false
    && details.diagnosticInputId === prepared.inputId
    && details.rawObjectComparison);
}

module.exports = {
  DIAGNOSTIC_LINK_CONTRACT,
  LINKABLE_PLACEMENTS,
  MAX_DIAGNOSTIC_TOOL_PATH,
  SUPPORTED_TEXT_RELOCATIONS,
  WORKBENCH_COMPARISON_CONTRACT,
  acceptedControlArtifacts,
  acceptedSymbolIndex,
  comparisonAlgorithmIdentity,
  comparisonAlgorithmManifest,
  compareCandidateDiagnostic,
  comparisonIsCurrent,
  createDiagnosticAttemptDirectory,
  diagnosticAttemptIdentity,
  ensurePlainDiagnosticDirectory,
  environmentIdentity,
  linkerDefinitions,
  linkOne,
  loadDiagnosticEnvironment,
  normalizeRelocationList,
  objectEvidence,
  prepareTargetDiagnostic,
  relocationOperandIdentityMismatch,
  relocationPlacementIdentityMismatch,
  resolvedDiagnosticComparison,
  resolveContained,
  assertSupportedRelocations,
  validateDiagnosticObjectStructure,
};
