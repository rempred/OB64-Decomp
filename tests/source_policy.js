#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { currentFingerprint } = require('../tools/lib/current_workflow');
const { resolveLocalTools } = require('../tools/lib/local_tools');
const {
  ROOT,
  SOURCE_CLASSES,
  classifySource,
  classifyTargetSources,
  compilationInputBytes,
  dependencyIdentities,
  loadPolicyConfig,
  resolvePreprocessor,
  sha256Buffer,
  verifyClassificationInputs,
} = require('../tools/lib/source_policy');

const FIXTURES = path.join(__dirname, 'fixtures', 'source-policy');

function expectClass(preprocessor, file, expected) {
  const result = classifySource(path.join(FIXTURES, file), { preprocessor });
  if (result.class !== expected) {
    throw new Error(`${file}: expected ${expected}, received ${result.class} (${result.error || JSON.stringify(result.reasons)})`);
  }
  return result;
}

function cloneConfig() {
  return JSON.parse(JSON.stringify(loadPolicyConfig()));
}

function writeDriftedCopy(source, destination) {
  const bytes = fs.readFileSync(source);
  bytes[bytes.length - 1] ^= 0x01;
  fs.writeFileSync(destination, bytes);
}

function writeSizeDriftedCopy(source, destination) {
  const bytes = fs.readFileSync(source);
  fs.writeFileSync(destination, bytes.subarray(0, bytes.length - 1));
}

function expectIdentityFailure(label, config, pattern) {
  const source = path.join(FIXTURES, 'ordinary.c');
  const result = classifySource(source, { config });
  if (result.class !== SOURCE_CLASSES.UNKNOWN || !pattern.test(result.error || '') || result.preprocessor) {
    throw new Error(`${label}: source classification did not fail closed before preprocessing (${result.error || result.class})`);
  }
  try {
    classifyTargetSources([{ symbol: 'ordinary_fixture', source: 'tests/fixtures/source-policy/ordinary.c', bytes: 4 }], { config });
  } catch (error) {
    if (pattern.test(error.message)) return { label, individualClass: result.class, error: error.message };
    throw error;
  }
  throw new Error(`${label}: active target classification accepted invalid executable identity`);
}

function main() {
  const preprocessor = resolvePreprocessor();
  if (!preprocessor.matchingCompiler || !/^[0-9A-F]{64}$/.test(preprocessor.matchingCompiler.executableSha256)) {
    throw new Error('source-policy matching compiler contract is not authenticated');
  }
  if (!Array.isArray(preprocessor.executables) || preprocessor.executables.length !== 2
      || preprocessor.executables.map((record) => record.role).join(',') !== 'driver,preprocessing-engine'
      || preprocessor.executables.some((record) => !Number.isInteger(record.bytes) || record.bytes <= 0
        || !/^[0-9A-F]{64}$/.test(record.sha256))) {
    throw new Error('source-policy preprocessor executable closure is not authenticated');
  }
  if (preprocessor.dependencyMode !== 'authenticated-depfile'
      || preprocessor.dependencyRoot !== ROOT
      || preprocessor.dependencyTarget !== 'ob64-compilation-input'
      || JSON.stringify(preprocessor.flags) !== JSON.stringify(['-P', '-undef', '-nostdinc'])
      || !preprocessor.configIdentity || preprocessor.configIdentity.path !== 'config/source-policy.json') {
    throw new Error('source-policy compilation-input/dependency contract is not authenticated');
  }
  const cases = [
    ['ordinary.c', SOURCE_CLASSES.PURE_C],
    ['inline_asm.c', SOURCE_CLASSES.HYBRID_C],
    ['asm_volatile.c', SOURCE_CLASSES.HYBRID_C],
    ['register_asm.c', SOURCE_CLASSES.HYBRID_C],
    ['hidden_macro.c', SOURCE_CLASSES.HYBRID_C],
    ['comment.c', SOURCE_CLASSES.PURE_C],
    ['string.c', SOURCE_CLASSES.PURE_C],
    ['section_injection.c', SOURCE_CLASSES.HYBRID_C],
    ['include_assembly.c', SOURCE_CLASSES.HYBRID_C],
    ['preprocess_failure.c', SOURCE_CLASSES.UNKNOWN],
    ['assembly.s', SOURCE_CLASSES.ASM],
  ];
  const results = cases.map(([file, expected]) => ({ file, expected, result: expectClass(preprocessor, file, expected) }));
  const hiddenAgain = expectClass(preprocessor, 'hidden_macro.c', SOURCE_CLASSES.HYBRID_C);
  const hidden = results.find((item) => item.file === 'hidden_macro.c').result;
  if (hidden.digest !== hiddenAgain.digest) throw new Error('source-policy classification is not deterministic');
  if (!hidden.reasons.some((reason) => reason.stage === 'preprocessed' && reason.code === 'assembler-keyword')) {
    throw new Error('macro-hidden assembler was not detected in preprocessed source');
  }
  const sharedTargets = classifyTargetSources([
    { symbol: 'ordinary_fixture', source: 'tests/fixtures/source-policy/ordinary.c', bytes: 4 },
    { symbol: 'inline_fixture', source: 'tests/fixtures/source-policy/inline_asm.c', bytes: 4 },
  ], { preprocessor });
  if (sharedTargets.counts.PURE_C !== 1 || sharedTargets.counts.HYBRID_C !== 1
      || sharedTargets.counts.UNKNOWN !== 0 || sharedTargets.counts.ASM !== 0) {
    throw new Error('shared target source classification census drift');
  }
  const firstSharedDigests = sharedTargets.targets.map((target) => target.digest);
  const repeatedTargets = classifyTargetSources([
    { symbol: 'ordinary_fixture', source: 'tests/fixtures/source-policy/ordinary.c', bytes: 4 },
    { symbol: 'inline_fixture', source: 'tests/fixtures/source-policy/inline_asm.c', bytes: 4 },
  ], { preprocessor });
  if (JSON.stringify(firstSharedDigests) !== JSON.stringify(repeatedTargets.targets.map((target) => target.digest))) {
    throw new Error('repeated source classification changed target digests');
  }
  const repositoryScratchBase = path.join(ROOT, 'build', 'tests');
  fs.mkdirSync(repositoryScratchBase, { recursive: true });
  const dependencyScratch = fs.mkdtempSync(path.join(repositoryScratchBase, 'source-policy-dependency-'));
  let dependencyInvalidation;
  try {
    const header = path.join(dependencyScratch, 'shared_value.h');
    const source = path.join(dependencyScratch, 'candidate.c');
    fs.writeFileSync(header, '#define SHARED_VALUE 1\n');
    fs.writeFileSync(source, '#include "shared_value.h"\nint candidate(void) { return SHARED_VALUE; }\n');
    const first = classifySource(source, { preprocessor });
    if (first.class !== SOURCE_CLASSES.PURE_C || first.dependencies.length !== 1
        || first.dependencies[0].path !== path.relative(ROOT, header).replace(/\\/g, '/')) {
      throw new Error('repository-local header dependency was not authenticated');
    }
    const firstInput = compilationInputBytes(first);
    if (firstInput.length !== first.compilationInput.bytes
        || sha256Buffer(firstInput) !== first.compilationInput.sha256
        || first.preprocessedSha256 !== first.compilationInput.sha256) {
      throw new Error('classified bytes are not the authenticated compilation input');
    }
    verifyClassificationInputs(first);
    const authoredSourceSha256 = first.sourceSha256;
    fs.writeFileSync(header, '#define SHARED_VALUE 2\n');
    const changed = classifySource(source, { preprocessor });
    if (changed.class !== SOURCE_CLASSES.PURE_C || changed.sourceSha256 !== authoredSourceSha256
        || changed.dependencies[0].sha256 === first.dependencies[0].sha256
        || changed.compilationInput.sha256 === first.compilationInput.sha256
        || changed.digest === first.digest) {
      throw new Error('header edit did not invalidate dependency and compilation-input identities');
    }
    let staleRejected = false;
    try {
      verifyClassificationInputs(first);
    } catch (error) {
      staleRejected = /source dependency identity drift/.test(error.message);
    }
    if (!staleRejected) throw new Error('stale header-backed classification was accepted');
    const fingerprintTarget = {
      symbol: 'candidate',
      source: first.source,
      sourceSha256: first.sourceSha256,
      relocationContractSource: 'test-fixture',
      expectedRelocations: [],
      textOwners: [],
    };
    const fingerprintPhase8 = {
      config: { compiler: {} },
      linkageConfigIdentity: {},
      multiOwnerConfigIdentity: {},
      toolchain: { identity: {} },
      targets: [fingerprintTarget],
    };
    const policyFor = (classification) => ({
      schemaVersion: 2,
      status: 'pass',
      preprocessor: classification.preprocessor,
      targets: [{ symbol: fingerprintTarget.symbol, bytes: 4, ...classification }],
    });
    const localTools = resolveLocalTools();
    const firstFingerprint = currentFingerprint(fingerprintPhase8, 'TEST-BASELINE', localTools, policyFor(first));
    const changedFingerprint = currentFingerprint(fingerprintPhase8, 'TEST-BASELINE', localTools, policyFor(changed));
    if (firstFingerprint === changedFingerprint) {
      throw new Error('CURRENT fingerprint ignored a header dependency edit');
    }

    const externalScratch = fs.mkdtempSync(path.join(path.resolve(os.tmpdir()), 'ob64-source-policy-external-'));
    try {
      const externalHeader = path.join(externalScratch, 'external.h');
      fs.writeFileSync(externalHeader, '#define EXTERNAL_VALUE 3\n');
      const includePath = externalHeader.replace(/\\/g, '/');
      const externalSource = path.join(dependencyScratch, 'external_candidate.c');
      fs.writeFileSync(externalSource, `#include "${includePath}"\nint external_candidate(void) { return EXTERNAL_VALUE; }\n`);
      const external = classifySource(externalSource, { preprocessor });
      if (external.class !== SOURCE_CLASSES.UNKNOWN || !/escapes the repository/.test(external.error || '')) {
        throw new Error('external preprocessing dependency did not fail closed');
      }
    } finally {
      if (path.dirname(path.resolve(externalScratch)) !== path.resolve(os.tmpdir())) {
        throw new Error('external dependency scratch escaped the system temporary directory');
      }
      fs.rmSync(externalScratch, { recursive: true, force: true });
    }
    dependencyInvalidation = {
      authoredSourceSha256,
      originalDependencySha256: first.dependencies[0].sha256,
      changedDependencySha256: changed.dependencies[0].sha256,
      originalCompilationInputSha256: first.compilationInput.sha256,
      changedCompilationInputSha256: changed.compilationInput.sha256,
      currentFingerprintChanged: true,
    };
  } finally {
    if (path.dirname(path.resolve(dependencyScratch)) !== path.resolve(repositoryScratchBase)) {
      throw new Error('dependency scratch escaped the repository test directory');
    }
    fs.rmSync(dependencyScratch, { recursive: true, force: true });
  }
  for (const escaped of ['../outside.c', path.resolve(FIXTURES, 'ordinary.c')]) {
    try {
      classifyTargetSources([{ symbol: 'escaped_fixture', source: escaped, bytes: 4 }], { preprocessor });
    } catch (error) {
      if (/escapes the repository/.test(error.message)) continue;
      throw error;
    }
    throw new Error(`escaped source path was accepted: ${escaped}`);
  }
  const dependencySource = path.join(FIXTURES, 'ordinary.c');
  const dependencyRelative = path.relative(ROOT, dependencySource).replace(/\\/g, '/');
  const caseEquivalentDependency = dependencyRelative.replace(/^tests\//, 'TESTS/');
  const duplicateDependencyRejections = [];
  for (const [label, dependencyPaths] of [
    ['exact duplicate', [dependencyRelative, dependencyRelative]],
    ['case-equivalent duplicate', [dependencyRelative, caseEquivalentDependency]],
  ]) {
    try {
      dependencyIdentities(dependencyPaths, dependencySource);
    } catch (error) {
      if (/dependency identity is duplicated/.test(error.message)) {
        duplicateDependencyRejections.push(label);
        continue;
      }
      throw error;
    }
    throw new Error(`${label} depfile identity was accepted`);
  }
  const scratchBase = path.resolve(os.tmpdir());
  const scratch = fs.mkdtempSync(path.join(scratchBase, 'ob64-source-policy-identity-'));
  const driver = preprocessor.executables.find((record) => record.role === 'driver');
  const engine = preprocessor.executables.find((record) => record.role === 'preprocessing-engine');
  const identityFailures = [];
  try {
    const missingDriver = cloneConfig();
    missingDriver.preprocessor.path = path.join(scratch, 'missing-driver.exe');
    identityFailures.push(expectIdentityFailure('missing driver', missingDriver, /source-policy driver is missing/));

    const sizeDriftedDriverFile = path.join(scratch, 'size-drifted-driver.exe');
    writeSizeDriftedCopy(path.resolve(__dirname, '..', driver.path), sizeDriftedDriverFile);
    const sizeDriftedDriver = cloneConfig();
    sizeDriftedDriver.preprocessor.path = sizeDriftedDriverFile;
    identityFailures.push(expectIdentityFailure('size-drifted driver', sizeDriftedDriver, /source-policy driver byte-size drift/));

    const driftedDriverFile = path.join(scratch, 'drifted-driver.exe');
    writeDriftedCopy(path.resolve(__dirname, '..', driver.path), driftedDriverFile);
    const driftedDriver = cloneConfig();
    driftedDriver.preprocessor.path = driftedDriverFile;
    identityFailures.push(expectIdentityFailure('drifted driver', driftedDriver, /source-policy driver SHA-256 drift/));

    const missingEngine = cloneConfig();
    missingEngine.preprocessor.requiredExecutables[0].path = path.join(scratch, 'missing-cc1.exe');
    identityFailures.push(expectIdentityFailure('missing preprocessing engine', missingEngine, /source-policy preprocessing-engine is missing/));

    const sizeDriftedEngineFile = path.join(scratch, 'size-drifted-cc1.exe');
    writeSizeDriftedCopy(path.resolve(__dirname, '..', engine.path), sizeDriftedEngineFile);
    const sizeDriftedEngine = cloneConfig();
    sizeDriftedEngine.preprocessor.requiredExecutables[0].path = sizeDriftedEngineFile;
    identityFailures.push(expectIdentityFailure('size-drifted preprocessing engine', sizeDriftedEngine, /source-policy preprocessing-engine byte-size drift/));

    const driftedEngineFile = path.join(scratch, 'drifted-cc1.exe');
    writeDriftedCopy(path.resolve(__dirname, '..', engine.path), driftedEngineFile);
    const driftedEngine = cloneConfig();
    driftedEngine.preprocessor.requiredExecutables[0].path = driftedEngineFile;
    identityFailures.push(expectIdentityFailure('drifted preprocessing engine', driftedEngine, /source-policy preprocessing-engine SHA-256 drift/));

    const unboundEngineFile = path.join(scratch, 'unbound-cc1.exe');
    fs.copyFileSync(path.resolve(__dirname, '..', engine.path), unboundEngineFile);
    const unboundEngine = cloneConfig();
    unboundEngine.preprocessor.requiredExecutables[0].path = unboundEngineFile;
    identityFailures.push(expectIdentityFailure('unbound preprocessing engine', unboundEngine, /source-policy preprocessing-engine dependency closure drift/));
  } finally {
    if (path.dirname(path.resolve(scratch)) !== scratchBase) throw new Error('source-policy identity scratch directory escaped the system temporary directory');
    fs.rmSync(scratch, { recursive: true, force: true });
  }
  console.log(JSON.stringify({
    status: 'pass',
    preprocessor: {
      sha256: preprocessor.sha256,
      version: preprocessor.version,
      executables: preprocessor.executables,
      matchingCompiler: preprocessor.matchingCompiler,
    },
    cases: results.map((item) => ({ file: item.file, expected: item.expected, actual: item.result.class, digest: item.result.digest })),
    deterministicMacroHiddenClassification: true,
    sharedClassification: sharedTargets.counts,
    repeatedClassificationInvariant: true,
    authenticatedCompilationInput: true,
    dependencyInvalidation,
    externalDependenciesRejected: true,
    escapedPathsRejected: true,
    duplicateDependencyRejections,
    executableIdentityFailuresRejectedBeforePreprocessing: identityFailures,
  }, null, 2));
}

main();
