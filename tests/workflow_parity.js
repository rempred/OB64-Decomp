#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  elfSectionBytes,
  parseElfFile,
  sha256File,
} = require('../tools/lib/phase7_conventional');
const {
  loadPhase8Model,
  relocationRecords,
  verifyTargetMapOwner,
} = require('../tools/lib/phase8_matching_c');
const {
  classifyActiveTargets,
  writeJson,
} = require('../tools/lib/current_workflow');

const ROOT = path.resolve(__dirname, '..');

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function section(elf, name) {
  const matches = elf.sections.filter((candidate) => candidate.name === name);
  if (matches.length !== 1) throw new Error(`section does not resolve uniquely: ${name}`);
  return matches[0];
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function main() {
  const oldRoot = value('--old-root');
  const newOutput = value('--new-output');
  const oldPhase7 = path.join(oldRoot, 'phase7');
  const oldOutput = path.join(oldRoot, 'phase8');
  const phase8 = loadPhase8Model();
  const oldPhase7Report = readJson(path.join(oldPhase7, 'build-report.json'));
  const oldReport = readJson(path.join(oldOutput, 'build-report.json'));
  const newReport = readJson(path.join(newOutput, 'build-report.json'));
  assert(oldPhase7Report.status === 'pass', 'frozen Phase 7 report did not pass');
  assert(oldReport.status === 'pass' && newReport.status === 'pass', 'old/new build report did not pass');
  assert(newReport.schemaVersion === 2 && newReport.verification.schemaVersion === 2, 'new dialect report schema drift');
  assert(newReport.dialect.identity.manifestSha256 === phase8.dialect.identity.manifestSha256, 'new dialect identity drift');
  assert(newReport.dialect.counts.proofTargets === phase8.targets.length, 'new dialect proof census drift');

  const oldRom = fs.readFileSync(path.join(oldOutput, 'phase8.us_rev0.z64'));
  const newRom = fs.readFileSync(path.join(newOutput, 'phase8.us_rev0.z64'));
  assert(oldRom.equals(newRom), 'old/new complete ROM bytes differ');
  assert(sha256File(path.join(oldOutput, 'phase8.us_rev0.z64')) === phase8.model.config.rom.sha256, 'frozen ROM identity drift');
  assert(sha256File(path.join(newOutput, 'phase8.us_rev0.z64')) === phase8.model.config.rom.sha256, 'new ROM identity drift');
  assert(JSON.stringify(oldReport.compiler.compileFlags) === JSON.stringify(newReport.compiler.compileFlags), 'old/new compiler flags differ');
  assert(oldReport.compiler.sha256 === newReport.compiler.sha256, 'old/new compiler executable identity differs');

  const oldElf = parseElfFile(path.join(oldOutput, 'phase8.elf'));
  const newElf = parseElfFile(path.join(newOutput, 'phase8.elf'));
  const oldMap = fs.readFileSync(path.join(oldOutput, 'phase8.map'), 'utf8');
  const newMap = fs.readFileSync(path.join(newOutput, 'phase8.map'), 'utf8');
  const targets = [];
  for (const target of phase8.targets) {
    const oldTargetReport = oldReport.targetReplacements.find((record) => record.symbol === target.symbol);
    const newTargetReport = newReport.targetReplacements.find((record) => record.symbol === target.symbol);
    assert(oldTargetReport && newTargetReport, `old/new target report is missing: ${target.symbol}`);
    assert(oldTargetReport.compilerAssemblySha256 === newTargetReport.compilerAssemblySha256, `old/new compiler assembly differs: ${target.symbol}`);
    assert(newTargetReport.sourceClass === newReport.verification.targets.find((record) => record.symbol === target.symbol).dialect.sourceClass, `dialect source class differs: ${target.symbol}`);
    assert(newTargetReport.compilerAssemblySha256 === newTargetReport.dialectAssemblySha256, `inert raw/dialect assembly differs: ${target.symbol}`);
    assert(newTargetReport.dialectDecision.transformationCount === 0, `inert target transformed: ${target.symbol}`);
    const proofFile = path.join(newOutput, ...newTargetReport.dialectProof.path.split('/'));
    assert(fs.existsSync(proofFile) && sha256File(proofFile) === newTargetReport.dialectProof.sha256, `dialect proof identity differs: ${target.symbol}`);
    const oldSection = section(oldElf, target.sectionName);
    const newSection = section(newElf, target.sectionName);
    assert(oldSection.address === newSection.address && oldSection.address === target.vramStartNumber, `linked address differs: ${target.symbol}`);
    assert(oldSection.size === newSection.size && oldSection.size === target.bytes, `linked size differs: ${target.symbol}`);
    const oldBytes = Buffer.from(elfSectionBytes(oldElf, oldSection));
    const newBytes = Buffer.from(elfSectionBytes(newElf, newSection));
    assert(oldBytes.equals(newBytes), `linked target bytes differ: ${target.symbol}`);
    const oldOwner = verifyTargetMapOwner(target, oldMap);
    const newOwner = verifyTargetMapOwner(target, newMap);
    assert(oldOwner.linkedOwner === newOwner.linkedOwner, `linker owner differs: ${target.symbol}`);

    const oldPruned = parseElfFile(path.join(oldOutput, 'objects', 'assembly', `chunk_${String(target.chunkIndex).padStart(3, '0')}.o`));
    const newPruned = parseElfFile(path.join(newOutput, 'objects', 'assembly', `chunk_${String(target.chunkIndex).padStart(3, '0')}.o`));
    for (const [label, object] of [['old', oldPruned], ['new', newPruned]]) {
      assert(!object.sections.some((candidate) => candidate.name === target.sectionName), `${label} original target section remains linked: ${target.symbol}`);
      assert(!object.symbols.some((candidate) => candidate.name === target.symbol), `${label} original target symbol remains linked: ${target.symbol}`);
    }

    const oldC = parseElfFile(path.join(oldOutput, 'objects', 'c', `${target.symbol}.o`));
    const newC = parseElfFile(path.join(newOutput, 'objects', 'c', `${target.symbol}.o`));
    const oldRelocations = relocationRecords(oldC, target);
    const newRelocations = relocationRecords(newC, target);
    assert(JSON.stringify(oldRelocations) === JSON.stringify(newRelocations), `old/new relocation verdict differs: ${target.symbol}`);
    assert(JSON.stringify(newRelocations) === JSON.stringify(target.expectedRelocations), `accepted relocation contract differs: ${target.symbol}`);
    targets.push({
      symbol: target.symbol,
      address: target.vramStart,
      bytes: target.bytes,
      linkedBytesEqual: true,
      originalAssemblyExcluded: true,
      soleCOwner: true,
      relocationsEqual: true,
      sourceClass: newTargetReport.sourceClass,
      compilerAssemblySha256: newTargetReport.compilerAssemblySha256,
      dialectAssemblySha256: newTargetReport.dialectAssemblySha256,
      dialectProofSha256: newTargetReport.dialectProof.sha256,
      transformationCount: newTargetReport.dialectDecision.transformationCount,
    });
  }

  const policyA = classifyActiveTargets(phase8);
  const policyB = classifyActiveTargets(phase8);
  assert(JSON.stringify(policyA.targets.map((target) => target.digest)) === JSON.stringify(policyB.targets.map((target) => target.digest)), 'source-policy results are not deterministic');
  const report = {
    schemaVersion: 2,
    status: 'pass',
    generatedAt: new Date().toISOString(),
    frozenReference: oldRoot,
    newOutput,
    oldPhase7Passed: true,
    oldPhase8Passed: true,
    newVerificationPassed: true,
    rom: { bytes: oldRom.length, sha256: phase8.model.config.rom.sha256, byteIdentical: true },
    compiler: { sha256: newReport.compiler.sha256, compileFlags: newReport.compiler.compileFlags, equivalent: true },
    targets,
    sourcePolicy: { deterministic: true, counts: policyA.counts, bytes: policyA.bytes },
    compilerAssemblyDialect: newReport.dialect,
    compatibilityBridge: {
      retained: ['compiler contract', 'linkSymbols', 'expectedRelocations'],
      reason: 'The accepted original .word assembly objects emit no ELF relocations; the previously reviewed relocation arrays remain the non-derivable contract.',
    },
  };
  const jsonFile = path.join(ROOT, 'build', 'workflow-migration', 'parity.json');
  const markdownFile = path.join(ROOT, 'build', 'workflow-migration', 'parity.md');
  writeJson(jsonFile, report);
  fs.mkdirSync(path.dirname(markdownFile), { recursive: true });
  fs.writeFileSync(markdownFile, [
    '# Workflow migration parity',
    '',
    '- Frozen Phase 7/8: PASS',
    '- New verification: PASS',
    `- Complete ROM: EXACT (${report.rom.sha256})`,
    `- Targets: ${targets.length}; identical placement, bytes, exclusion, ownership, and relocations`,
    `- PURE_C: ${policyA.counts.PURE_C} functions / ${policyA.bytes.PURE_C} bytes`,
    `- HYBRID_C: ${policyA.counts.HYBRID_C} functions / ${policyA.bytes.HYBRID_C} bytes`,
    `- UNKNOWN: ${policyA.counts.UNKNOWN}`,
    `- Dialect proofs: ${newReport.dialect.counts.proofTargets}; transformed targets: ${newReport.dialect.counts.transformedTargets}; transformations: ${newReport.dialect.counts.transformations}`,
    '- Compatibility bridge: compiler contract, link aliases, and trusted relocation arrays retained internally because `.word` originals contain no ELF relocation metadata.',
    '',
  ].join('\n'));
  console.log(JSON.stringify({ status: 'pass', targets: targets.length, romSha256: report.rom.sha256, report: jsonFile }, null, 2));
}

main();
