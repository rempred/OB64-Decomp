#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  sha256Buffer,
} = require('../tools/lib/phase7_conventional');
const { completeCurrent, acceptedCompilationInputIdentity, verifyCompilationInputArtifact } = require('../tools/lib/current_workflow');
const {
  artifact: compatibilityArtifact,
  verifyTargetCompilationInput,
} = require('../tools/verify_shared_header_compatibility');
const {
  compareArtifact,
  compareTargetCompilationInput,
} = require('../tools/compare_phase8_reproducibility');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function expectRejection(label, pattern, callback) {
  try {
    callback();
  } catch (error) {
    if (pattern.test(error.message)) return { label, message: error.message };
    throw error;
  }
  throw new Error(`${label} was accepted`);
}

function writeArtifact(root, relative, bytes) {
  const file = path.join(root, ...relative.split('/'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes);
  return file;
}

function writeCurrentReport(root, record) {
  fs.writeFileSync(path.join(root, 'build-report.json'), `${JSON.stringify({
    schemaVersion: 5,
    status: 'pass',
    targetReplacements: [record],
  }, null, 2)}\n`);
}


// This component fixture uses actual pinned compiler/assembler/linker output.
// It exercises completeCurrent, not complete-ROM acceptance.
function nativeCurrentFixture(scratch) {
  const p8 = require('../tools/lib/phase8_matching_c');
  const p7 = require('../tools/lib/phase7_conventional');
  const text = require('../tools/lib/text_contract');
  const active = require('../tools/lib/active_targets').loadActiveTargetModel();
  const policy = require('../tools/lib/source_policy');
  const target = active.targets.find(t => t.bytes === 8 && !t.compilationGroup && !t.atomicText
    && !t.nativeTextTail && !t.auxiliaryProjection && !t.retainedLiteralReferences && !t.logicalFunction
    && t.textOwners.length === 1 && !t.auxiliarySections.length && !t.expectedRelocations.length);
  if (!target) throw Error('ordinary native confinement fixture target is missing');
  const sourcePolicy = policy.classifyTargetSources([target]);
  const classification = sourcePolicy.targets[0];
  const local = require('../tools/lib/local_tools').resolveLocalTools();
  const toolchain = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/toolchain.json'), 'utf8'));
  const tool = name => path.join(ROOT, toolchain.localRoot, toolchain.tools[name]);
  const pins = active.model.config.binutils.tools;
  for (const name of ['assembler', 'objcopy', 'linker']) {
    if (p7.sha256File(tool(name)) !== pins[path.basename(tool(name))]) throw Error('confinement native tool identity drift');
  }
  p8.verifyCompiler(active, local.compiler);
  const output = path.join(scratch, 'valid-native-current'); fs.mkdirSync(output);
  const compiled = p8.compileTarget(active, target, output, local.compiler, tool('assembler'), tool('objcopy'), { classification });
  fs.writeFileSync(path.join(output, 'fixture.ld'), `OUTPUT_ARCH(mips)\nSECTIONS { ${target.sectionName} 0x${target.vramStartNumber.toString(16)} : AT(0x${target.romStartNumber.toString(16)}) { ${compiled.objectRelative}(${target.sectionName}) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) *(.text) *(.data) *(.bss) } }\n`);
  p7.run(tool('linker'), ['-EB', '-m', 'elf32bmip', '-T', 'fixture.ld', '-Map', 'phase8.map', '-o', 'phase8.elf', compiled.objectRelative], { cwd: output });
  const baserom = p8.loadCanonicalBaserom(active), elf = p7.parseElfFile(path.join(output, 'phase8.elf'));
  const derived = p8.deriveSourceObjectProof(active, target, output, classification, elf, baserom);
  const relative = `generated/c/${target.symbol}.source-object-proof.json`;
  fs.writeFileSync(path.join(output, relative), derived.proofBytes);
  const proof = { path: relative, bytes: derived.proofBytes.length, sha256: p7.sha256Buffer(derived.proofBytes) };
  const representation = text.recordsForTarget(target, output, baserom);
  text.validateRecords(derived.proof, representation, 'confinement native representation');
  const record = { symbol: target.symbol, source: target.source, sourceSha256: target.sourceSha256, sectionName: target.sectionName,
    sourceClass: classification.class, sourcePolicyDigest: classification.digest, compilationInput: compiled.compilationInput,
    compilerAssembly: compiled.compilerAssemblyRelative, compilerAssemblySha256: compiled.compilerAssemblySha256,
    linkedAssembly: compiled.linkedAssemblyRelative, linkedAssemblySha256: compiled.linkedAssemblySha256,
    cObject: compiled.objectRelative, cObjectSha256: compiled.objectSha256, assemblerObject: compiled.assemblerObjectRelative,
    assemblerObjectSha256: compiled.assemblerObjectSha256, sourceObjectProof: proof };
  const evidence = { symbol: target.symbol, sourceClass: classification.class, sourcePolicyDigest: classification.digest, compilationInput: classification.compilationInput, proof };
  const report = { schemaVersion: 7, status: 'pass', acceptedInputs: { logicalFunctionConfig: active.logicalFunctionConfigIdentity }, targetReplacements: [record], sourceObjectEvidence: { targets: [evidence] },
    verification: { schemaVersion: 6, status: 'pass', sourceObjectEvidence: { targets: [evidence] }, targets: [{ symbol: target.symbol, source: target.source, sectionName: target.sectionName, sourceObjectEvidence: evidence, representationSha256: text.representationDigest(representation) }] } };
  const put = (relative, value) => fs.writeFileSync(path.join(output, relative), JSON.stringify(value));
  put('layout.json', { schemaVersion: 2, phase8MatchingCTargets: [{ symbol: target.symbol, ...representation }] });
  put('objects/manifest.json', { schemaVersion: 5, linkedObjects: [{ path: compiled.objectRelative, ownerKind: 'matching-c-target', targetSymbol: target.symbol, textContract: compiled.textContract, objectEvidence: compiled.objectEvidence }] });
  put('phase8.elf-report.json', { componentFixture: true });
  fs.writeFileSync(path.join(output, 'phase8.us_rev0.z64'), baserom.subarray(target.romStartNumber, target.romEndNumber));
  const phase8 = { ...active, targets: [target] };
  const save = value => text.publishCompactReport(path.join(output, 'build-report.json'), value);
  save(report);
  if (!completeCurrent(output, phase8, sourcePolicy)) throw Error('valid native CURRENT component rejected');
  const results = [];
  for (const [label, mutate, expected] of [
    ['native input byte count', r => r.targetReplacements[0].compilationInput.bytes++, /compact build target binding/],
    ['native alternate input path', r => r.targetReplacements[0].compilationInput.path = 'src/alternate.c', /compact build target binding/],
    ['native proof path traversal', r => { r.targetReplacements[0].sourceObjectProof.path = '../outside.json'; r.sourceObjectEvidence.targets[0].proof.path = '../outside.json'; r.verification.sourceObjectEvidence.targets[0].proof.path = '../outside.json'; r.verification.targets[0].sourceObjectEvidence.proof.path = '../outside.json'; }, /compact proof descriptor/],
    ['native self-consistent proof source forgery', r => {
      const altered = JSON.parse(derived.proofBytes); altered.target.source = 'src/forged.c';
      const bytes = Buffer.from(JSON.stringify(altered)); fs.writeFileSync(path.join(output, relative), bytes);
      const d = { path: relative, bytes: bytes.length, sha256: p7.sha256Buffer(bytes) };
      r.targetReplacements[0].sourceObjectProof = d; r.sourceObjectEvidence.targets[0].proof = d;
      r.verification.sourceObjectEvidence.targets[0].proof = d; r.verification.targets[0].sourceObjectEvidence.proof = d;
    }, /source-object proof model\/source binding/],
  ]) {
    let rejection = ''; const originals = {};
    for (const name of ['buildTargetRecords', 'withSourceObjectProof']) {
      originals[name] = text[name]; text[name] = (...args) => { try { return originals[name](...args); } catch (error) { rejection = error.message; throw error; } };
    }
    try {
      const changed = clone(report); mutate(changed); save(changed);
      if (completeCurrent(output, phase8, sourcePolicy) || !expected.test(rejection)) throw Error('native confinement intended branch not reached: ' + label + ': ' + rejection);
      results.push({ label, message: rejection });
    } finally {
      Object.assign(text, originals); fs.writeFileSync(path.join(output, relative), derived.proofBytes); save(report);
    }
    if (!completeCurrent(output, phase8, sourcePolicy)) throw Error('restored native CURRENT rejected');
  }
  return results;
}

function main() {
  const scratchBase = path.join(ROOT, 'build', 'tests');
  fs.mkdirSync(scratchBase, { recursive: true });
  const scratch = fs.mkdtempSync(path.join(scratchBase, 'compilation-input-confinement-'));
  const bytes = Buffer.from('authenticated compilation input\n');
  const sha256 = sha256Buffer(bytes);
  const sourceSha256 = 'A'.repeat(64);
  const source = 'src/fixture.c';
  const target = {
    symbol: 'fixture_target',
    source,
    sourceSha256,
    compilationInput: { path: source, bytes: bytes.length, sha256 },
  };
  const sourcePolicyTarget = {
    symbol: target.symbol,
    source,
    sourceSha256,
    compilationInput: { bytes: bytes.length, sha256 },
  };
  const rejections = [];
  try {
    rejections.push(...nativeCurrentFixture(scratch));
    const compatibilityRoot = path.join(scratch, 'compatibility');
    writeArtifact(compatibilityRoot, source, bytes);
    verifyTargetCompilationInput(compatibilityRoot, target, sourcePolicyTarget);
    const alternateTarget = clone(target);
    alternateTarget.compilationInput.path = 'src/alternate.c';
    writeArtifact(compatibilityRoot, alternateTarget.compilationInput.path, bytes);
    rejections.push(expectRejection(
      'compatibility alternate compilation-input path',
      /identity differs from the accepted target\/source-policy input/,
      () => verifyTargetCompilationInput(compatibilityRoot, alternateTarget, sourcePolicyTarget),
    ));

    const outsideFile = path.join(scratch, 'outside.bin');
    fs.writeFileSync(outsideFile, bytes);
    rejections.push(expectRejection(
      'compatibility embedded traversal',
      /path is malformed|escapes its root/,
      () => compatibilityArtifact(compatibilityRoot, 'sub/../../outside.bin', sha256, 'compatibility traversal fixture'),
    ));
    const outsideDirectory = path.join(scratch, 'outside-directory');
    fs.mkdirSync(outsideDirectory);
    fs.writeFileSync(path.join(outsideDirectory, 'artifact.bin'), bytes);
    const ancestorLink = path.join(compatibilityRoot, 'ancestor-link');
    fs.symlinkSync(outsideDirectory, ancestorLink, process.platform === 'win32' ? 'junction' : 'dir');
    rejections.push(expectRejection(
      'compatibility canonical realpath escape',
      /resolves outside its root/,
      () => compatibilityArtifact(compatibilityRoot, 'ancestor-link/artifact.bin', sha256, 'compatibility realpath fixture'),
    ));

    const leftRoot = path.join(scratch, 'left');
    const rightRoot = path.join(scratch, 'right');
    writeArtifact(leftRoot, source, bytes);
    writeArtifact(rightRoot, source, bytes);
    compareTargetCompilationInput(leftRoot, rightRoot, target, sourcePolicyTarget);
    writeArtifact(leftRoot, alternateTarget.compilationInput.path, bytes);
    writeArtifact(rightRoot, alternateTarget.compilationInput.path, bytes);
    rejections.push(expectRejection(
      'reproducibility alternate compilation-input path',
      /identity differs from the accepted target\/source-policy input/,
      () => compareTargetCompilationInput(leftRoot, rightRoot, alternateTarget, sourcePolicyTarget),
    ));
    rejections.push(expectRejection(
      'reproducibility embedded traversal',
      /path is malformed|escapes its root/,
      () => compareArtifact(leftRoot, rightRoot, 'sub/../../outside.bin', 'traversal fixture'),
    ));

    const currentRoot = path.join(scratch, 'current');
    const required = ['phase8.elf', 'phase8.map', 'phase8.us_rev0.z64', 'layout.json', 'phase8.elf-report.json', 'objects/manifest.json'];
    for (const relative of required) writeArtifact(currentRoot, relative, Buffer.from(`${relative}\n`));
    const genericRelative = 'objects/artifact.bin';
    const genericFile = writeArtifact(currentRoot, genericRelative, bytes);
    const genericSha256 = sha256Buffer(fs.readFileSync(genericFile));
    writeArtifact(currentRoot, source, bytes);
    const currentRecord = {
      ...clone(target),
      compilerAssembly: genericRelative,
      compilerAssemblySha256: genericSha256,
      linkedAssembly: genericRelative,
      linkedAssemblySha256: genericSha256,
      cObject: genericRelative,
      cObjectSha256: genericSha256,
      assemblerObject: null,
      sourceObjectProof: { path: genericRelative, bytes: bytes.length, sha256: genericSha256 },
    };
    const phase8 = { targets: [{ symbol: target.symbol, source, sourceSha256 }] };
    const sourcePolicy = { schemaVersion: 2, status: 'pass', targets: [sourcePolicyTarget] };
    writeCurrentReport(currentRoot, currentRecord);
    const acceptedInput = acceptedCompilationInputIdentity(currentRecord, sourcePolicyTarget, 'CURRENT fixture');
    const validateCurrentInput = record => verifyCompilationInputArtifact(currentRoot, record.compilationInput, acceptedInput, 'CURRENT fixture');
    validateCurrentInput(currentRecord);
    if (completeCurrent(currentRoot, phase8, sourcePolicy)) {
      throw new Error('synthetic CURRENT without ELF text evidence was reusable');
    }

    const byteCountDrift = clone(currentRecord);
    byteCountDrift.compilationInput.bytes += 1;
    writeCurrentReport(currentRoot, byteCountDrift);
    if (completeCurrent(currentRoot, phase8, sourcePolicy)) {
      throw new Error('CURRENT compilation-input byte-count drift was accepted');
    }
    rejections.push(expectRejection('CURRENT compilation-input byte-count drift', /identity differs/, () => validateCurrentInput(byteCountDrift)));

    const alternateCurrent = clone(currentRecord);
    alternateCurrent.compilationInput.path = alternateTarget.compilationInput.path;
    writeArtifact(currentRoot, alternateCurrent.compilationInput.path, bytes);
    writeCurrentReport(currentRoot, alternateCurrent);
    if (completeCurrent(currentRoot, phase8, sourcePolicy)) {
      throw new Error('CURRENT alternate compilation-input path was accepted');
    }
    rejections.push(expectRejection('CURRENT alternate compilation-input path', /identity differs/, () => validateCurrentInput(alternateCurrent)));

    const escapedCurrent = clone(currentRecord);
    escapedCurrent.cObject = 'sub/../../outside.bin';
    escapedCurrent.cObjectSha256 = sha256;
    writeCurrentReport(currentRoot, escapedCurrent);
    if (completeCurrent(currentRoot, phase8, sourcePolicy)) {
      throw new Error('CURRENT embedded artifact traversal was accepted');
    }
    rejections.push({ label: 'CURRENT embedded artifact traversal', message: 'rejected' });
  } finally {
    if (path.dirname(path.resolve(scratch)).toLowerCase() !== path.resolve(scratchBase).toLowerCase()) {
      throw new Error('compilation-input confinement scratch escaped its test root');
    }
    fs.rmSync(scratch, { recursive: true, force: true });
  }

  console.log(JSON.stringify({
    status: 'pass',
    validCompatibilityInputAccepted: true,
    validReproducibilityInputAccepted: true,
    validCurrentInputAccepted: true,
    validNativeCurrentComponentAccepted: true,
    nativeIntendedRejectionBranchesReached: true,
    incompleteCurrentRejected: true,
    rejections,
  }, null, 2));
}

main();
