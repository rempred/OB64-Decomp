#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  SOURCE_CLASSES,
  classifySource,
  classifyTargetSources,
  loadPolicyConfig,
  resolvePreprocessor,
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
  for (const escaped of ['../outside.c', path.resolve(FIXTURES, 'ordinary.c')]) {
    try {
      classifyTargetSources([{ symbol: 'escaped_fixture', source: escaped, bytes: 4 }], { preprocessor });
    } catch (error) {
      if (/escapes the repository/.test(error.message)) continue;
      throw error;
    }
    throw new Error(`escaped source path was accepted: ${escaped}`);
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
    escapedPathsRejected: true,
    executableIdentityFailuresRejectedBeforePreprocessing: identityFailures,
  }, null, 2));
}

main();
