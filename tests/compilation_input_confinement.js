#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  sha256Buffer,
} = require('../tools/lib/phase7_conventional');
const { completeCurrent } = require('../tools/lib/current_workflow');
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
    schemaVersion: 4,
    status: 'pass',
    targetReplacements: [record],
  }, null, 2)}\n`);
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
    if (!completeCurrent(currentRoot, phase8, sourcePolicy)) {
      throw new Error('valid confined synthetic CURRENT was not reusable');
    }

    const byteCountDrift = clone(currentRecord);
    byteCountDrift.compilationInput.bytes += 1;
    writeCurrentReport(currentRoot, byteCountDrift);
    if (completeCurrent(currentRoot, phase8, sourcePolicy)) {
      throw new Error('CURRENT compilation-input byte-count drift was accepted');
    }
    rejections.push({ label: 'CURRENT compilation-input byte-count drift', message: 'rejected' });

    const alternateCurrent = clone(currentRecord);
    alternateCurrent.compilationInput.path = alternateTarget.compilationInput.path;
    writeArtifact(currentRoot, alternateCurrent.compilationInput.path, bytes);
    writeCurrentReport(currentRoot, alternateCurrent);
    if (completeCurrent(currentRoot, phase8, sourcePolicy)) {
      throw new Error('CURRENT alternate compilation-input path was accepted');
    }
    rejections.push({ label: 'CURRENT alternate compilation-input path', message: 'rejected' });

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
    validCurrentAccepted: true,
    rejections,
  }, null, 2));
}

main();
