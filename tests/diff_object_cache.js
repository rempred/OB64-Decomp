#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  sha256Buffer,
  sha256File,
} = require('../tools/lib/phase7_conventional');
const {
  artifactSpecifications,
  cacheEntryPath,
  canonicalJson,
  compileDiffTargets,
  createCacheKeyMaterial,
  outputArtifactFiles,
  projectTargetContract,
  publishCacheEntry,
  renameCacheDirectory,
  sha256Value,
  verifyCacheSeal,
  verifyTargetSourceIdentity,
} = require('../tools/lib/diff_object_cache');
const { loadActiveTargetModel } = require('../tools/lib/active_targets');
const { selectTarget } = require('../tools/diff');

const HASH = Object.freeze({
  a: 'A'.repeat(64),
  b: 'B'.repeat(64),
  c: 'C'.repeat(64),
  d: 'D'.repeat(64),
  e: 'E'.repeat(64),
  f: 'F'.repeat(64),
  zero: '0'.repeat(64),
  one: '1'.repeat(64),
  two: '2'.repeat(64),
  three: '3'.repeat(64),
});

function fail(message) {
  throw new Error(`diff object cache test failure: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeOwner(symbol, index, logicalOffset, bytes) {
  return {
    ownerIndex: index,
    logicalOffset,
    logicalEnd: logicalOffset + bytes,
    primaryId: `owner-${symbol}-${index}`,
    rowIndex: 100 + index,
    chunkIndex: 7 + index,
    sectionName: index === 0 ? `.ob64.r${100 + index}` : `.ob64.r${100 + index}.s1`,
    symbol: index === 0 ? symbol : `${symbol}_continuation_${index}`,
    originalAssembly: `asm/original/${symbol}-${index}.s`,
    originalAssemblySha256: index === 0 ? HASH.a : HASH.b,
    romStartNumber: 0x1000 + logicalOffset,
    romEndNumber: 0x1000 + logicalOffset + bytes,
    vramStartNumber: 0x80001000 + logicalOffset,
    vramEndNumber: 0x80001000 + logicalOffset + bytes,
    bytes,
    expectedTextSha256: index === 0 ? HASH.c : HASH.d,
  };
}

function makeTarget(symbol, sourceHash, options = {}) {
  const firstBytes = options.multiOwner ? 8 : 16;
  const owners = [makeOwner(symbol, 0, 0, firstBytes)];
  if (options.multiOwner) owners.push(makeOwner(symbol, 1, firstBytes, 8));
  const bytes = owners.reduce((sum, owner) => sum + owner.bytes, 0);
  const target = {
    symbol,
    source: `src/fixture/${symbol}.c`,
    sourceSha256: sourceHash,
    primaryId: owners[0].primaryId,
    rowIndex: owners[0].rowIndex,
    chunkIndex: owners[0].chunkIndex,
    originalAssembly: owners[0].originalAssembly,
    originalAssemblySha256: owners[0].originalAssemblySha256,
    romStart: '0x00001000',
    romEndExclusive: `0x${(0x1000 + bytes).toString(16).toUpperCase().padStart(8, '0')}`,
    romStartNumber: 0x1000,
    romEndNumber: 0x1000 + bytes,
    vramStart: '0x80001000',
    vramEndExclusive: `0x${(0x80001000 + bytes).toString(16).toUpperCase().padStart(8, '0')}`,
    vramStartNumber: 0x80001000,
    vramEndNumber: 0x80001000 + bytes,
    bytes,
    sectionName: owners[0].sectionName,
    textOwners: owners,
    multiOwner: Boolean(options.multiOwner),
    overlayDescriptorId: null,
    descriptorRawSha256: null,
    expectedTextSha256: HASH.e,
    expectedRelocations: options.relocations || [],
    compilerTextFunctionsExplicit: false,
    compilerTextFunctions: [{
      symbol,
      offset: '0x00000000',
      offsetNumber: 0,
      bytes,
      binding: 'GLOBAL',
      entryEvidence: 'owner',
    }],
    auxiliarySections: options.auxiliarySections || [],
    relocationContractSource: options.contractSource || 'canonical',
    legacyAncillaryRelocations: [],
  };
  return target;
}

function makeClassification(target, preprocessed = HASH.f, sourceClass = 'PURE_C') {
  return {
    symbol: target.symbol,
    bytes: target.bytes,
    class: sourceClass,
    source: target.source,
    sourceSha256: target.sourceSha256,
    preprocessedSha256: preprocessed,
    reasons: sourceClass === 'HYBRID_C'
      ? [{ stage: 'raw', code: 'assembler-keyword', token: 'asm', line: 1, column: 1 }]
      : [],
    preprocessor: {
      sha256: HASH.zero,
      version: 'fixture-cpp 1',
      executables: [{ role: 'driver', path: 'fixture/cpp.exe', bytes: 10, sha256: HASH.zero }],
      matchingCompiler: {
        executableSha256: HASH.one,
        manifestSha256: HASH.two,
        preprocessingMode: 'authenticated-external-companion',
      },
    },
    digest: sourceClass === 'HYBRID_C' ? HASH.three : HASH.two,
  };
}

function makePhase8(targets) {
  return {
    config: {
      compiler: {
        manifest: 'fixture/compiler.json',
        manifestSha256: HASH.two,
        executableSha256: HASH.one,
        compileFlags: ['-quiet', '-O2', '-meb'],
      },
    },
    model: {
      config: {
        binutils: {
          compilerAssemblerFlags: ['-G', '0', '-mips3', '-EB'],
        },
      },
    },
    targets,
  };
}

function commonKeyInputs(phase8, target, classification) {
  return {
    phase8,
    target,
    classification,
    verifiedCompiler: {
      bytes: 1234,
      sha256: HASH.one,
      sourceCommit: 'compiler-commit',
      sourceTree: 'compiler-tree',
      target: 'mips-kmc-elf',
      abi: 'o32',
      endianness: 'big',
      isa: 'mips3',
      compileFlags: [...phase8.config.compiler.compileFlags],
    },
    assembler: { bytes: 2345, sha256: HASH.two },
    objcopy: { bytes: 3456, sha256: HASH.three },
    sourcePolicyConfigIdentity: {
      path: 'config/source-policy.json', bytes: 100, sha256: HASH.a,
    },
    implementationIdentities: [
      { path: 'tools/lib/phase8_matching_c.js', bytes: 200, sha256: HASH.b },
      { path: 'tools/lib/diff_object_cache.js', bytes: 300, sha256: HASH.c },
    ],
  };
}

function keyFor(inputs) {
  return sha256Value(createCacheKeyMaterial(inputs));
}

function fixtureSeal(inputs) {
  return {
    schemaVersion: 1,
    implementationIdentities: clone(inputs.implementationIdentities),
    sourcePolicyConfigIdentity: clone(inputs.sourcePolicyConfigIdentity),
    configurationIdentities: [],
    executableFiles: [],
  };
}

function expectError(pattern, callback, label) {
  try {
    callback();
  } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return error.message;
  }
  fail(`${label} was accepted`);
}

function fakeObject(target, final = false) {
  return {
    schemaVersion: 1,
    symbol: target.symbol,
    sourceSha256: target.sourceSha256,
    sections: [
      ...target.textOwners.map((owner) => ({
        name: owner.sectionName,
        type: 'SHT_PROGBITS',
        flags: ['SHF_ALLOC', 'SHF_EXECINSTR'],
        bytes: owner.bytes,
      })),
      ...target.auxiliarySections.map((auxiliary) => ({
        name: auxiliary.outputSection,
        type: auxiliary.sectionType,
        flags: auxiliary.sectionFlags,
        bytes: auxiliary.bytes,
        relocations: auxiliary.expectedRelocations,
        tail: auxiliary.preservedTail,
      })),
    ],
    relocations: target.expectedRelocations,
    ancillaryRemoved: final,
  };
}

function expectedCompilerText(target) {
  return `compiler:${target.symbol}:${target.sourceSha256}\n`;
}

function expectedAdjustedText(target) {
  return `adjusted:${target.symbol}:${canonicalJson(target.auxiliarySections)}\n`;
}

function fakeInspect({ target, classification, files }) {
  const required = artifactSpecifications(target).map((spec) => spec.name).sort();
  if (canonicalJson(Object.keys(files).sort()) !== canonicalJson(required)) fail(`fake file census drift for ${target.symbol}`);
  if (fs.readFileSync(files['compiler.s'], 'utf8') !== expectedCompilerText(target)) {
    fail(`fake compiler assembly drift for ${target.symbol}`);
  }
  if (fs.readFileSync(files['adjusted.s'], 'utf8') !== expectedAdjustedText(target)) {
    fail(`fake adjusted assembly drift for ${target.symbol}`);
  }
  const sourceObject = JSON.parse(fs.readFileSync(files['source-object.o'], 'utf8'));
  const finalObject = JSON.parse(fs.readFileSync(files['final.o'], 'utf8'));
  const expectedSource = fakeObject(target, false);
  const expectedFinal = fakeObject(target, true);
  if (canonicalJson(sourceObject.sections) !== canonicalJson(expectedSource.sections)) {
    fail(`fake source section metadata drift for ${target.symbol}`);
  }
  if (canonicalJson(sourceObject.relocations) !== canonicalJson(expectedSource.relocations)) {
    fail(`fake source relocation metadata drift for ${target.symbol}`);
  }
  if (canonicalJson(sourceObject) !== canonicalJson(expectedSource)
      || canonicalJson(finalObject) !== canonicalJson(expectedFinal)) {
    fail(`fake object evidence drift for ${target.symbol}`);
  }
  if (target.textOwners.length > 1) {
    const assembler = JSON.parse(fs.readFileSync(files['assembler-object.o'], 'utf8'));
    if (canonicalJson(assembler) !== canonicalJson({
      schemaVersion: 1,
      symbol: target.symbol,
      unsplitBytes: target.bytes,
    })) fail(`fake assembler object drift for ${target.symbol}`);
  }
  return {
    symbol: target.symbol,
    objectRelative: `objects/c/${target.symbol}.o`,
    objectSha256: sha256File(files['final.o']),
    proofObjectRelative: `objects/c/${target.symbol}.source-object.o`,
    proofObjectSha256: sha256File(files['source-object.o']),
    assemblerObjectRelative: target.textOwners.length > 1
      ? `objects/c/${target.symbol}.assembler-object.o`
      : null,
    assemblerObjectSha256: target.textOwners.length > 1 ? sha256File(files['assembler-object.o']) : null,
    compilerAssemblyRelative: `generated/c/${target.symbol}.compiler.s`,
    compilerAssemblySha256: sha256File(files['compiler.s']),
    linkedAssemblyRelative: `generated/c/${target.symbol}.s`,
    linkedAssemblySha256: sha256File(files['adjusted.s']),
    sourceClass: classification.class,
    sourcePolicyDigest: classification.digest,
    compilerAssemblyRewritten: false,
    sections: sourceObject.sections,
    relocations: sourceObject.relocations,
  };
}

function makeFakeCompiler(invocations) {
  return function fakeCompile(phase8, target, output, compiler, assembler, objcopy, options) {
    invocations.push({ symbol: target.symbol, enforceAcceptedContract: options.enforceAcceptedContract });
    const files = outputArtifactFiles(output, target);
    for (const file of Object.values(files)) fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(files['compiler.s'], expectedCompilerText(target));
    fs.writeFileSync(files['adjusted.s'], expectedAdjustedText(target));
    fs.writeFileSync(files['source-object.o'], `${JSON.stringify(fakeObject(target, false))}\n`);
    if (target.textOwners.length > 1) {
      fs.writeFileSync(files['assembler-object.o'], `${JSON.stringify({
        schemaVersion: 1,
        symbol: target.symbol,
        unsplitBytes: target.bytes,
      })}\n`);
    }
    fs.writeFileSync(files['final.o'], `${JSON.stringify(fakeObject(target, true))}\n`);
    return fakeInspect({ target, classification: options.classification, files });
  };
}

function mutateKey(baseInputs, mutate, label) {
  const changed = clone(baseInputs);
  mutate(changed);
  assert(keyFor(changed) !== keyFor(baseInputs), `${label} did not invalidate the cache key`);
}

function updateArtifactIdentity(entry, name) {
  const metadataFile = path.join(entry, 'metadata.json');
  const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  const artifact = metadata.artifacts.find((record) => record.name === name);
  const file = path.join(entry, 'artifacts', name);
  artifact.bytes = fs.statSync(file).size;
  artifact.sha256 = sha256File(file);
  fs.writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
}

function cacheEntryFor(cacheRoot, inputs) {
  const material = createCacheKeyMaterial(inputs);
  return cacheEntryPath(cacheRoot, inputs.target, sha256Value(material));
}

function main() {
  const scratchBase = path.join(ROOT, 'build', 'tests');
  fs.mkdirSync(scratchBase, { recursive: true });
  const scratch = fs.mkdtempSync(path.join(scratchBase, 'diff-object-cache-'));
  try {
    const requested = makeTarget('fixture_requested', HASH.a);
    const sibling = makeTarget('fixture_sibling', HASH.b, {
      relocations: [{ offset: '0x00000004', type: 'R_MIPS_26', symbol: 'callee', section: '.rel.text' }],
    });
    const multi = makeTarget('fixture_multi', HASH.c, { multiOwner: true });
    const auxiliary = makeTarget('fixture_auxiliary_cache', HASH.d, {
      auxiliarySections: withAuxiliaryFixture(),
    });
    const phase8 = makePhase8([requested, sibling, multi, auxiliary]);
    const classifications = new Map(phase8.targets.map((target) => [target.symbol, makeClassification(target)]));
    const baseInputs = commonKeyInputs(phase8, sibling, classifications.get(sibling.symbol));
    const firstKey = keyFor(baseInputs);
    assert(firstKey === keyFor(clone(baseInputs)), 'equal inputs did not produce a deterministic key');

    mutateKey(baseInputs, (value) => {
      value.target.sourceSha256 = HASH.d;
      value.classification.sourceSha256 = HASH.d;
    }, 'own source drift');
    mutateKey(baseInputs, (value) => { value.classification.preprocessedSha256 = HASH.d; }, 'preprocessing drift');
    mutateKey(baseInputs, (value) => {
      value.classification.class = 'HYBRID_C';
      value.classification.digest = HASH.three;
      value.classification.reasons = [{ stage: 'raw', code: 'assembler-keyword', token: 'asm', line: 1, column: 1 }];
    }, 'source class drift');
    mutateKey(baseInputs, (value) => {
      value.verifiedCompiler.sha256 = HASH.d;
    }, 'compiler tool drift');
    mutateKey(baseInputs, (value) => {
      value.phase8.config.compiler.compileFlags.push('-fno-schedule-insns');
      value.verifiedCompiler.compileFlags.push('-fno-schedule-insns');
    }, 'compiler flag drift');
    mutateKey(baseInputs, (value) => { value.assembler.sha256 = HASH.d; }, 'assembler drift');
    mutateKey(baseInputs, (value) => { value.objcopy.sha256 = HASH.d; }, 'objcopy drift');
    mutateKey(baseInputs, (value) => { value.target.sectionName = '.ob64.r9999'; }, 'target contract drift');
    mutateKey(baseInputs, (value) => { value.target.relocationContractSource = 'legacy-compatibility'; }, 'contract source drift');
    mutateKey(baseInputs, (value) => { value.implementationIdentities[0].sha256 = HASH.d; }, 'implementation drift');

    const withAuxiliary = makeTarget('fixture_auxiliary', HASH.d, {
      auxiliarySections: withAuxiliaryFixture(),
    });
    function withAuxiliaryFixture() {
      return [{
        kind: 'switch-table',
        compilerSection: '.rodata',
        outputSection: '.ob64.r0500',
        sectionType: 'SHT_PROGBITS',
        sectionFlags: ['SHF_ALLOC'],
        alignment: 4,
        bytes: 4,
        entries: 1,
        expectedObjectSha256: HASH.a,
        expectedLinkedSha256: HASH.b,
        preservedTail: {
          inputSection: '.ob64.r0500.tail',
          bytes: 4,
          expectedSha256: HASH.c,
        },
        expectedRelocations: [{ offset: '0x00000000', type: 'R_MIPS_32', symbol: '.text', addend: '0x00000000', section: '.rel.rodata' }],
        entryBytes: 4,
        trailingPaddingBytes: 0,
        expectedTrailingPaddingSha256: HASH.d,
        ownerTailSection: '.ob64.r0500.tail',
        ownerTailBytes: 4,
        ownerTailSha256: HASH.c,
      }];
    }
    const auxiliaryPhase8 = makePhase8([withAuxiliary]);
    const auxiliaryClassification = makeClassification(withAuxiliary);
    const auxiliaryInputs = commonKeyInputs(auxiliaryPhase8, withAuxiliary, auxiliaryClassification);
    mutateKey(auxiliaryInputs, (value) => {
      value.target.auxiliarySections[0].ownerTailSha256 = HASH.e;
    }, 'auxiliary remainder drift');

    const siblingBefore = keyFor(commonKeyInputs(phase8, sibling, classifications.get(sibling.symbol)));
    const requestedBefore = keyFor(commonKeyInputs(phase8, requested, classifications.get(requested.symbol)));
    const changedPhase8 = clone(phase8);
    const changedRequested = changedPhase8.targets.find((target) => target.symbol === requested.symbol);
    changedRequested.sourceSha256 = HASH.e;
    const changedRequestedClass = makeClassification(changedRequested, HASH.d);
    const unchangedSibling = changedPhase8.targets.find((target) => target.symbol === sibling.symbol);
    const siblingAfter = keyFor(commonKeyInputs(changedPhase8, unchangedSibling, classifications.get(sibling.symbol)));
    const requestedAfter = keyFor(commonKeyInputs(changedPhase8, changedRequested, changedRequestedClass));
    assert(siblingBefore === siblingAfter, 'sibling source/config update invalidated an unrelated target');
    assert(requestedBefore !== requestedAfter, 'updated target source/config retained its old key');
    const reorderedPhase8 = { ...phase8, targets: [auxiliary, multi, sibling, requested] };
    assert(keyFor(commonKeyInputs(reorderedPhase8, sibling, classifications.get(sibling.symbol))) === siblingBefore,
      'unrelated active-target ordering invalidated a target key');
    assert(selectTarget({ targets: phase8.targets }, requested.symbol.toUpperCase()) === requested,
      'case-varied requested symbol did not resolve to the canonical target');

    const cacheRoot = path.join(scratch, 'cache');
    let runIndex = 0;
    function runDiff() {
      const output = path.join(scratch, `output-${runIndex++}`);
      fs.mkdirSync(output, { recursive: true });
      const invocations = [];
      const keyInputs = commonKeyInputs(phase8, sibling, classifications.get(sibling.symbol));
      const result = compileDiffTargets({
        ...keyInputs,
        phase8,
        requestedTarget: requested,
        output,
        compiler: 'fixture-compiler',
        assemblerPath: 'fixture-assembler',
        objcopyPath: 'fixture-objcopy',
        classificationBySymbol: classifications,
        cacheRoot,
        compile: makeFakeCompiler(invocations),
        inspectArtifacts: fakeInspect,
        cacheSeal: fixtureSeal(keyInputs),
        verifyCacheSeal: () => {},
        verifyTargetSource: () => {},
      });
      return { result, invocations, output };
    }

    const cold = runDiff();
    assert(cold.result.cache.requestedFresh === 1 && cold.result.cache.hits === 0
      && cold.result.cache.misses === 3 && cold.result.cache.rebuilt === 0
      && cold.result.cache.compilerInvocations === 4, 'cold compile/cache counts drift');
    assert(cold.invocations.length === 4
      && cold.invocations.find((record) => record.symbol === requested.symbol).enforceAcceptedContract === false
      && cold.invocations.filter((record) => record.symbol !== requested.symbol)
        .every((record) => record.enforceAcceptedContract === true), 'requested-target bypass contract drift');
    const requestedEntry = cacheEntryFor(cacheRoot, commonKeyInputs(phase8, requested, classifications.get(requested.symbol)));
    assert(!fs.existsSync(requestedEntry), 'requested target was published to the sibling cache');

    const warm = runDiff();
    assert(warm.result.cache.hits === 3 && warm.result.cache.misses === 0
      && warm.result.cache.rebuilt === 0 && warm.result.cache.compilerInvocations === 1
      && warm.invocations.length === 1 && warm.invocations[0].symbol === requested.symbol,
    'warm run did not compile only the requested target');

    const siblingInputs = commonKeyInputs(phase8, sibling, classifications.get(sibling.symbol));
    const siblingEntry = cacheEntryFor(cacheRoot, siblingInputs);
    const multiInputs = commonKeyInputs(phase8, multi, classifications.get(multi.symbol));
    const multiEntry = cacheEntryFor(cacheRoot, multiInputs);
    const auxiliaryInputsForCache = commonKeyInputs(phase8, auxiliary, classifications.get(auxiliary.symbol));
    const auxiliaryEntry = cacheEntryFor(cacheRoot, auxiliaryInputsForCache);
    assert(artifactSpecifications(multi).some((spec) => spec.name === 'assembler-object.o'),
      'multi-owner target did not require its assembler object');

    for (const collisionCode of ['EEXIST', 'EACCES']) {
      const collisionRoot = path.join(scratch, `collision-cache-${collisionCode.toLowerCase()}`);
      const collisionEntry = cacheEntryFor(collisionRoot, siblingInputs);
      publishCacheEntry({
        cacheRoot: collisionRoot,
        keyMaterial: createCacheKeyMaterial(siblingInputs),
        target: sibling,
        classification: classifications.get(sibling.symbol),
        phase8,
        sourceFiles: outputArtifactFiles(cold.output, sibling),
        compiled: cold.result.compiled.get(sibling.symbol),
        inspectArtifacts: fakeInspect,
        renameEntry: (source, destination) => {
          fs.cpSync(source, destination, { recursive: true, errorOnExist: true });
          const error = new Error('simulated first-publisher collision');
          error.code = collisionCode;
          throw error;
        },
      });
      assert(fs.existsSync(path.join(collisionEntry, 'metadata.json'))
        && !fs.readdirSync(path.dirname(collisionEntry)).some((name) => name.includes('.tmp-')),
      `a concurrent ${collisionCode} first-publication winner was not adopted cleanly`);
    }
    const transientSource = path.join(scratch, 'transient-source');
    const transientDestination = path.join(scratch, 'transient-destination');
    fs.mkdirSync(transientSource);
    fs.writeFileSync(path.join(transientSource, 'artifact'), 'artifact');
    let transientAttempts = 0;
    renameCacheDirectory(transientSource, transientDestination, (source, destination) => {
      transientAttempts += 1;
      if (transientAttempts < 3) {
        const error = new Error('simulated transient Windows rename denial');
        error.code = 'EPERM';
        throw error;
      }
      fs.renameSync(source, destination);
    }, () => {});
    assert(transientAttempts === 3 && fs.existsSync(path.join(transientDestination, 'artifact')),
      'bounded transient rename retry did not publish the directory');

    const changedSiblingPhase8 = clone(phase8);
    const changedSibling = changedSiblingPhase8.targets.find((target) => target.symbol === sibling.symbol);
    changedSibling.sourceSha256 = HASH.e;
    changedSibling.expectedRelocations.push({
      offset: '0x00000008', type: 'R_MIPS_HI16', symbol: 'data_symbol', section: '.rel.text',
    });
    const changedClassifications = new Map(changedSiblingPhase8.targets.map((target) => [
      target.symbol,
      target.symbol === sibling.symbol ? makeClassification(target, HASH.e) : classifications.get(target.symbol),
    ]));
    const changedOutput = path.join(scratch, `output-${runIndex++}`);
    fs.mkdirSync(changedOutput, { recursive: true });
    const changedInvocations = [];
    const changedInputs = commonKeyInputs(changedSiblingPhase8, changedSibling, changedClassifications.get(sibling.symbol));
    const changedRun = compileDiffTargets({
      ...changedInputs,
      phase8: changedSiblingPhase8,
      requestedTarget: changedSiblingPhase8.targets.find((target) => target.symbol === requested.symbol),
      output: changedOutput,
      compiler: 'fixture-compiler',
      assemblerPath: 'fixture-assembler',
      objcopyPath: 'fixture-objcopy',
      classificationBySymbol: changedClassifications,
      cacheRoot,
      compile: makeFakeCompiler(changedInvocations),
      inspectArtifacts: fakeInspect,
      cacheSeal: fixtureSeal(changedInputs),
      verifyCacheSeal: () => {},
      verifyTargetSource: () => {},
    });
    assert(changedRun.cache.compilerInvocations === 2 && changedRun.cache.hits === 2
      && changedRun.cache.misses === 1
      && changedInvocations.some((record) => record.symbol === sibling.symbol)
      && !changedInvocations.some((record) => record.symbol === multi.symbol || record.symbol === auxiliary.symbol),
    'source plus accepted-contract drift did not recompile only the changed sibling');

    function expectRebuild(label, mutate, expectedReason) {
      mutate();
      const run = runDiff();
      const record = run.result.cache.entries.find((entry) => entry.symbol === sibling.symbol);
      assert(record.status === 'rebuilt', `${label} did not rebuild the invalid entry`);
      assert(expectedReason.test(record.reason), `${label} produced an unexpected rejection: ${record.reason}`);
      assert(run.invocations.some((entry) => entry.symbol === sibling.symbol), `${label} did not invoke the compiler`);
    }

    expectRebuild('corrupt artifact', () => {
      fs.appendFileSync(path.join(siblingEntry, 'artifacts', 'final.o'), 'corrupt');
    }, /identity drift/);
    expectRebuild('missing artifact', () => {
      fs.unlinkSync(path.join(siblingEntry, 'artifacts', 'source-object.o'));
    }, /file census drift/);
    expectRebuild('partial publication', () => {
      fs.unlinkSync(path.join(siblingEntry, 'metadata.json'));
    }, /file census drift/);
    expectRebuild('extra artifact', () => {
      fs.writeFileSync(path.join(siblingEntry, 'artifacts', 'unexpected.o'), 'unexpected');
    }, /file census drift/);
    expectRebuild('metadata traversal', () => {
      const metadataFile = path.join(siblingEntry, 'metadata.json');
      const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
      metadata.artifacts[0].destination = '../escape.s';
      fs.writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
    }, /metadata path drift/);
    expectRebuild('compiled metadata tampering', () => {
      const metadataFile = path.join(siblingEntry, 'metadata.json');
      const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
      metadata.compiled.relocations = [];
      fs.writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
    }, /compiled metadata drift/);
    expectRebuild('relocation artifact tampering', () => {
      const file = path.join(siblingEntry, 'artifacts', 'source-object.o');
      const object = JSON.parse(fs.readFileSync(file, 'utf8'));
      object.relocations = [];
      fs.writeFileSync(file, `${JSON.stringify(object)}\n`);
      updateArtifactIdentity(siblingEntry, 'source-object.o');
    }, /relocation metadata drift/);
    expectRebuild('section artifact tampering', () => {
      const file = path.join(siblingEntry, 'artifacts', 'source-object.o');
      const object = JSON.parse(fs.readFileSync(file, 'utf8'));
      object.sections[0].flags = ['SHF_ALLOC'];
      fs.writeFileSync(file, `${JSON.stringify(object)}\n`);
      updateArtifactIdentity(siblingEntry, 'source-object.o');
    }, /section metadata drift/);

    const auxiliaryFile = path.join(auxiliaryEntry, 'artifacts', 'source-object.o');
    const auxiliaryObject = JSON.parse(fs.readFileSync(auxiliaryFile, 'utf8'));
    auxiliaryObject.sections.find((section) => section.name === '.ob64.r0500').tail.bytes = 8;
    fs.writeFileSync(auxiliaryFile, `${JSON.stringify(auxiliaryObject)}\n`);
    updateArtifactIdentity(auxiliaryEntry, 'source-object.o');
    const auxiliaryRebuild = runDiff();
    const auxiliaryRecord = auxiliaryRebuild.result.cache.entries.find((entry) => entry.symbol === auxiliary.symbol);
    assert(auxiliaryRecord.status === 'rebuilt' && /section metadata drift|object evidence drift/.test(auxiliaryRecord.reason)
      && auxiliaryRebuild.invocations.some((entry) => entry.symbol === auxiliary.symbol),
    'auxiliary-section artifact tampering did not rebuild');

    fs.unlinkSync(path.join(multiEntry, 'artifacts', 'assembler-object.o'));
    const multiRebuild = runDiff();
    const multiRecord = multiRebuild.result.cache.entries.find((entry) => entry.symbol === multi.symbol);
    assert(multiRecord.status === 'rebuilt' && /file census drift/.test(multiRecord.reason)
      && multiRebuild.invocations.some((entry) => entry.symbol === multi.symbol),
    'missing multi-owner assembler object did not rebuild');

    const poisonSourceRoot = path.join(scratch, 'poison-sources');
    fs.mkdirSync(poisonSourceRoot, { recursive: true });
    function sourceBackedTarget(symbol, contents) {
      const file = path.join(poisonSourceRoot, `${symbol}.c`);
      fs.writeFileSync(file, contents);
      const target = makeTarget(symbol, sha256File(file));
      target.source = path.relative(ROOT, file).replace(/\\/g, '/');
      return { target, file, contents };
    }
    const poisonRequested = sourceBackedTarget('fixture_poison_requested', 'int fixture_poison_requested(void) { return 1; }\n');
    const poisonSibling = sourceBackedTarget('fixture_poison_sibling', 'int fixture_poison_sibling(void) { return 2; }\n');
    const poisonPhase8 = makePhase8([poisonRequested.target, poisonSibling.target]);
    const poisonClassifications = new Map(poisonPhase8.targets.map((target) => [target.symbol, makeClassification(target)]));
    const poisonInputs = commonKeyInputs(poisonPhase8, poisonSibling.target, poisonClassifications.get(poisonSibling.target.symbol));
    const poisonCacheRoot = path.join(scratch, 'poison-cache');
    const poisonInvocations = [];
    const basePoisonCompiler = makeFakeCompiler(poisonInvocations);
    expectError(/target source fixture_poison_sibling identity drift/, () => compileDiffTargets({
      ...poisonInputs,
      phase8: poisonPhase8,
      requestedTarget: poisonRequested.target,
      output: path.join(scratch, 'poison-output'),
      compiler: 'fixture-compiler',
      assemblerPath: 'fixture-assembler',
      objcopyPath: 'fixture-objcopy',
      classificationBySymbol: poisonClassifications,
      cacheRoot: poisonCacheRoot,
      compile: (...args) => {
        const result = basePoisonCompiler(...args);
        if (args[1].symbol === poisonSibling.target.symbol) fs.appendFileSync(poisonSibling.file, '/* concurrent edit */\n');
        return result;
      },
      inspectArtifacts: fakeInspect,
      cacheSeal: fixtureSeal(poisonInputs),
      verifyCacheSeal: () => {},
      verifyTargetSource: verifyTargetSourceIdentity,
    }), 'compile-time source mutation');
    fs.writeFileSync(poisonSibling.file, poisonSibling.contents);
    assert(!fs.existsSync(cacheEntryFor(poisonCacheRoot, poisonInputs)),
      'compile-time source mutation published a poisoned entry');

    const sealDirectory = path.join(scratch, 'seal');
    fs.mkdirSync(sealDirectory, { recursive: true });
    const implementationFile = path.join(sealDirectory, 'implementation.js');
    const configurationFile = path.join(sealDirectory, 'configuration.json');
    const executableFiles = ['compiler.exe', 'assembler.exe', 'objcopy.exe'].map((name) => path.join(sealDirectory, name));
    fs.writeFileSync(implementationFile, 'implementation\n');
    fs.writeFileSync(configurationFile, '{}\n');
    for (const file of executableFiles) fs.writeFileSync(file, path.basename(file));
    const shownImplementation = path.relative(ROOT, implementationFile).replace(/\\/g, '/');
    const shownConfiguration = path.relative(ROOT, configurationFile).replace(/\\/g, '/');
    const seal = {
      schemaVersion: 1,
      implementationIdentities: [{ path: shownImplementation, bytes: fs.statSync(implementationFile).size, sha256: sha256File(implementationFile) }],
      sourcePolicyConfigIdentity: { path: shownConfiguration, bytes: fs.statSync(configurationFile).size, sha256: sha256File(configurationFile) },
      configurationIdentities: [{ path: shownConfiguration, bytes: fs.statSync(configurationFile).size, sha256: sha256File(configurationFile) }],
      executableFiles: ['compiler', 'assembler', 'objcopy'].map((role, index) => ({
        role,
        path: path.resolve(executableFiles[index]),
        bytes: fs.statSync(executableFiles[index]).size,
        sha256: sha256File(executableFiles[index]),
      })),
    };
    verifyCacheSeal(seal);
    fs.appendFileSync(configurationFile, 'drift\n');
    expectError(/sealed configuration .* identity drift/, () => verifyCacheSeal(seal), 'mid-run configuration drift');

    const active = loadActiveTargetModel();
    const realMulti = active.targets.find((target) => target.symbol === 'func_0021D374');
    const realAuxiliary = active.targets.find((target) => target.auxiliarySections.length > 0);
    assert(realMulti && artifactSpecifications(realMulti).some((spec) => spec.name === 'assembler-object.o'),
      'real multi-owner target cache artifact contract drift');
    const projectedAuxiliary = realAuxiliary && projectTargetContract(realAuxiliary).auxiliarySections[0];
    assert(projectedAuxiliary && projectedAuxiliary.expectedRelocations.length > 0
      && Object.prototype.hasOwnProperty.call(projectedAuxiliary, 'ownerTailBytes'),
    'real auxiliary target cache contract omitted relocations or remainder ownership');
    for (const acceptanceFile of ['tools/verify.js', 'tools/lib/current_workflow.js']) {
      assert(!fs.readFileSync(path.join(ROOT, ...acceptanceFile.split('/')), 'utf8').includes('diff_object_cache'),
        `${acceptanceFile} imported the diagnostic cache`);
    }

    console.log(JSON.stringify({
      status: 'pass',
      deterministicKey: firstKey,
      cold: {
        compilerInvocations: cold.result.cache.compilerInvocations,
        misses: cold.result.cache.misses,
      },
      warm: {
        compilerInvocations: warm.result.cache.compilerInvocations,
        hits: warm.result.cache.hits,
      },
      invalidEntriesRebuilt: 10,
      siblingIsolation: true,
      requestedTargetAlwaysFresh: true,
      multiOwnerAssemblerRequired: true,
      sourceMutationRejectedBeforePublish: true,
      firstPublisherCollisionAdopted: true,
      transientWindowsRenameRetried: true,
      sealedConfigurationDriftRejected: true,
      realContractsChecked: [realMulti.symbol, realAuxiliary.symbol],
    }, null, 2));
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

main();
