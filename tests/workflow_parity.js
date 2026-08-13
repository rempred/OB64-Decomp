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

const EXPECTED_RELOCATION_MIGRATIONS = new Map([
  ['func_00269798', [
    { offset: '0x0000002C', type: 'R_MIPS_26', symbol: 'func_0020D778', section: '.rel.text' },
  ]],
  ['func_0002DE10', [
    { offset: '0x0000000C', type: 'R_MIPS_26', symbol: 'func_0002DBB4', section: '.rel.text' },
    { offset: '0x00000028', type: 'R_MIPS_26', symbol: 'func_0002DAB8', section: '.rel.text' },
  ]],
]);

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
  assert(newReport.schemaVersion === 3 && newReport.verification.schemaVersion === 3, 'new source-to-object report schema drift');
  assert(newReport.sourceObjectEvidence.identity.sourceCommit === '54514ded39ceb32165a125ddba04ca5b551773a2', 'GNU 2.6 source identity drift');
  assert(newReport.sourceObjectEvidence.counts.proofTargets === phase8.targets.length, 'new source-to-object proof census drift');
  assert(newReport.sourceObjectEvidence.counts.compilerAssemblyRewrites === 0, 'compiler assembly was rewritten');

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
  const observedRelocationMigrations = [];
  for (const target of phase8.targets) {
    const newTargetReport = newReport.targetReplacements.find((record) => record.symbol === target.symbol);
    const newEvidence = newReport.verification.targets.find((record) => record.symbol === target.symbol).sourceObjectEvidence;
    assert(newTargetReport && newEvidence, `new target report is missing: ${target.symbol}`);
    assert(newTargetReport.compilerAssemblyRewritten === false && newEvidence.compilerAssemblyRewritten === false, `compiler assembly rewrite drift: ${target.symbol}`);
    const proofFile = path.join(newOutput, ...newTargetReport.sourceObjectProof.path.split('/'));
    assert(fs.existsSync(proofFile) && sha256File(proofFile) === newTargetReport.sourceObjectProof.sha256, `source-to-object proof identity differs: ${target.symbol}`);
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
    const expectedMigration = EXPECTED_RELOCATION_MIGRATIONS.get(target.symbol) || [];
    const oldKeys = new Set(oldRelocations.map((record) => JSON.stringify(record)));
    const retained = oldRelocations.filter((record) => newRelocations.some((candidate) => JSON.stringify(candidate) === JSON.stringify(record)));
    const additions = newRelocations.filter((record) => !oldKeys.has(JSON.stringify(record)));
    assert(JSON.stringify(retained) === JSON.stringify(oldRelocations), `GNU 2.6 removed a frozen load-relevant relocation: ${target.symbol}`);
    assert(JSON.stringify(additions) === JSON.stringify(expectedMigration), `unexpected GNU 2.6 load-relevant relocation migration: ${target.symbol}`);
    if (expectedMigration.length > 0) observedRelocationMigrations.push({ symbol: target.symbol, additions });
    assert(JSON.stringify(newRelocations) === JSON.stringify(target.expectedRelocations), `accepted load-relevant relocation contract differs: ${target.symbol}`);
    assert(!newC.sections.some((candidate) => candidate.name === '.pdr'), `retired .pdr section returned: ${target.symbol}`);
    targets.push({
      symbol: target.symbol,
      address: target.vramStart,
      bytes: target.bytes,
      linkedBytesEqual: true,
      originalAssemblyExcluded: true,
      soleCOwner: true,
      loadRelevantRelocationsEqual: true,
      frozenLoadRelevantRelocationsEqual: expectedMigration.length === 0,
      reviewedRelocationAdditions: expectedMigration,
      sourceClass: newTargetReport.sourceClass,
      compilerAssemblyRewritten: false,
      compilerAssemblySha256: newTargetReport.compilerAssemblySha256,
      sourceObjectProofSha256: newTargetReport.sourceObjectProof.sha256,
      retiredPdrRelocations: newEvidence.retiredPdrRelocations,
    });
  }
  assert(observedRelocationMigrations.length === EXPECTED_RELOCATION_MIGRATIONS.size, 'reviewed relocation migration census drift');

  const policyA = classifyActiveTargets(phase8);
  const policyB = classifyActiveTargets(phase8);
  assert(JSON.stringify(policyA.targets.map((target) => target.digest)) === JSON.stringify(policyB.targets.map((target) => target.digest)), 'source-policy results are not deterministic');
  const report = {
    schemaVersion: 3,
    status: 'pass',
    generatedAt: new Date().toISOString(),
    frozenReference: oldRoot,
    newOutput,
    oldPhase7Passed: true,
    oldPhase8Passed: true,
    newVerificationPassed: true,
    rom: { bytes: oldRom.length, sha256: phase8.model.config.rom.sha256, byteIdentical: true },
    compiler: { sha256: newReport.compiler.sha256, compileFlags: newReport.compiler.compileFlags, equivalent: true },
    gnuBinutils26: newReport.sourceObjectEvidence.identity,
    targets,
    sourcePolicy: { deterministic: true, counts: policyA.counts, bytes: policyA.bytes },
    relocationPolicy: {
      loadRelevantCompared: true,
      frozenRelocationsRetained: true,
      reviewedSymbolicCallAdditions: observedRelocationMigrations,
      discardedProcedureMetadataRetired: true,
      retiredPdrRelocations: newReport.sourceObjectEvidence.counts.retiredPdrRelocations,
    },
  };
  const jsonFile = path.join(ROOT, 'build', 'workflow-migration', 'parity.json');
  const markdownFile = path.join(ROOT, 'build', 'workflow-migration', 'parity.md');
  writeJson(jsonFile, report);
  fs.mkdirSync(path.dirname(markdownFile), { recursive: true });
  fs.writeFileSync(markdownFile, [
    '# Workflow migration parity', '',
    '- Frozen production Phase 7/8: PASS',
    '- GNU Binutils 2.6 verification: PASS',
    `- Complete ROM: EXACT (${report.rom.sha256})`,
    `- Targets: ${targets.length}; identical placement, bytes, exclusion, ownership, and accepted load-relevant relocation contracts`,
    `- Reviewed GNU 2.6 symbolic-call relocation additions: ${observedRelocationMigrations.reduce((sum, entry) => sum + entry.additions.length, 0)} across ${observedRelocationMigrations.length} hybrids`,
    `- PURE_C: ${policyA.counts.PURE_C} functions / ${policyA.bytes.PURE_C} bytes`,
    `- HYBRID_C: ${policyA.counts.HYBRID_C} functions / ${policyA.bytes.HYBRID_C} bytes`,
    `- Retired .pdr relocations recorded as ancillary: ${report.relocationPolicy.retiredPdrRelocations}`,
    '- Untouched KMC compiler output receives only the accepted target-section adjustment.', '',
  ].join('\n'));
  console.log(JSON.stringify({ status: 'pass', targets: targets.length, romSha256: report.rom.sha256, report: jsonFile }, null, 2));
}

main();
