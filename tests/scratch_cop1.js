#!/usr/bin/env node
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const p7 = require('../tools/lib/phase7_conventional');
const p8 = require('../tools/lib/phase8_matching_c');
const policy = require('../tools/lib/source_policy');
const compiler = require('../tools/lib/matching/compiler');
const probe = require('../tools/lib/matching/probe');
const { main: matchMain } = require('../tools/match');
const { loadWorkbenchModel, resolveTarget, digest } = require('../tools/lib/matching/target_model');
const { loadActiveTargetModel } = require('../tools/lib/active_targets');
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require('../tools/lib/real_mips_toolchain');
const { compareCandidateDiagnostic } = require('../tools/lib/matching/diagnostic_link');
const { SCRATCH_ASSEMBLY_POLICY, assertScratchEnvironment, scratchAssemblerInput } = require('../tools/lib/matching/scratch_assembly');

const relative = file => path.relative(p7.ROOT, file).replace(/\\/g, '/');
const words = bytes => Array.from({ length: bytes.length / 4 }, (_, i) => bytes.readUInt32BE(i * 4));
const cop1 = (op, fd, fsReg, ft, format = 16) => ((0x11 << 26) | (format << 21) | (ft << 16) | (fsReg << 11) | (fd << 6) | op) >>> 0;

async function environmentTests(root) {
  const original = process.env.VR4300MUL;
  const disabled = ['OFF', 'off', 'oFf', ' OFFsuffix', '\tOFF', '\n\v\f\r off-anything'];
  const absentRoot = path.join(root, 'must-not-exist');
  try {
    for (const value of disabled) {
      assert.throws(() => assertScratchEnvironment({ vr4300mul: value }), /VR4300MUL disables/);
      process.env.VR4300MUL = value;
      assert.throws(() => compiler.prepareCompilerSession({ get context() { throw Error('metadata session allowed'); } }), /metadata session allowed/);
      assert.throws(() => compiler.compileScratchCandidate({}), /VR4300MUL disables/);
      assert.throws(() => compiler.compileCandidate(null, null, '', {
        matchingRoot: absentRoot, storeRequest() { throw Error('store was touched'); },
      }), /VR4300MUL disables/);
      assert.throws(() => compiler.cachedCandidateArtifact(null, null, null, absentRoot), /VR4300MUL disables/);
      assert.throws(() => probe.runProbe(null, null, '', { matchingRoot: absentRoot }), /VR4300MUL disables/);
      for (const command of ['watch', 'probe']) {
        for (const privateMode of [false, true]) {
          await assert.rejects(matchMain([command, 'func_00128050', '--source', 'missing.c',
            ...(privateMode ? ['--scratch-root', relative(absentRoot)] : [])]), /VR4300MUL disables/);
        }
      }
      assert.equal(process.env.VR4300MUL, value, 'guard changed the caller environment');
      assert.equal(fs.existsSync(absentRoot), false, 'rejection created scratch output');
    }
    const help = childProcess.spawnSync(process.execPath, ['tools/match.js', '--help'], {
      cwd: p7.ROOT, encoding: 'utf8', windowsHide: true,
    });
    assert.equal(help.status, 0, help.stderr);
    for (const value of ['', 'ON', 'OFFICE'.slice(1), '0', ' of']) assertScratchEnvironment({ VR4300MUL: value });
  } finally {
    if (original === undefined) delete process.env.VR4300MUL;
    else process.env.VR4300MUL = original;
  }
}

function nativeAssemblyTests(root, tools) {
  const sectionTarget = { sectionName: '.ob64.r1' };
  const cases = [];
  for (const [mnemonic, op] of [['add.s', 0], ['sub.s', 1], ['mul.s', 2], ['div.s', 3]]) {
    for (const [fd, fsReg, ft] of [[0, 2, 4], [30, 28, 26], [2, 2, 4], [4, 2, 4], [2, 2, 2]]) {
      cases.push({ name: `${mnemonic}-${fd}-${fsReg}-${ft}`, body: `\t${mnemonic}\t$f${fd},$f${fsReg},$f${ft}\n`, expected: [cop1(op, fd, fsReg, ft)] });
    }
  }
  for (const [first, fFormat] of [['mul.s', 16], ['mul.d', 17]]) {
    for (const [second, sFormat] of [['mul.s', 16], ['mul.d', 17]]) {
      for (const gap of ['', '\n\n', '\n\t.set noreorder\n\t.set nomacro\n']) {
        cases.push({ name: `${first}-${second}-${cases.length}`, body: `\t${first} $f0,$f2,$f4\n${gap}\t${second} $f6,$f8,$f10\n`,
          expected: [cop1(2, 0, 2, 4, fFormat), 0, cop1(2, 6, 8, 10, sFormat)] });
      }
    }
  }
  cases.push({ name: 'no-false-stall', body: '\tmul.s $f0,$f2,$f4\n\tadd.s $f6,$f8,$f10\n\tmul.s $f12,$f14,$f16\n',
    expected: [cop1(2, 0, 2, 4), cop1(0, 6, 8, 10), cop1(2, 12, 14, 16)] });
  for (const [i, fixture] of cases.entries()) {
    const native = Buffer.from('.text\n.set noreorder\n.globl fixture\n.ent fixture\nfixture:\n' + fixture.body + '.end fixture\n.size fixture,.-fixture\n');
    const adjusted = scratchAssemblerInput(native, sectionTarget);
    assert.equal(adjusted.toString(), native.toString().replace('.text', '.section .ob64.r1,"ax",@progbits'));
    for (const [kind, bytes, section] of [['native', native, '.text'], ['scratch', adjusted, sectionTarget.sectionName]]) {
      const source = path.join(root, `${i}-${kind}.s`), object = path.join(root, `${i}-${kind}.o`);
      fs.writeFileSync(source, bytes);
      runTool(tools.assemblerAbs, [...tools.compilerAssemblerFlags, '-o', object, source]);
      const elf = p7.parseElfFile(object), fn = elf.symbols.find(s => s.name === 'fixture');
      assert.equal(elf.sections[fn.sectionIndex].name, section);
      assert.deepEqual(words(p7.elfSectionBytes(elf, elf.sections[fn.sectionIndex]).subarray(0, fn.size)), fixture.expected, `${fixture.name}/${kind}`);
    }
  }
  assert.throws(() => scratchAssemblerInput(Buffer.from('.text\n.section .data\n'), sectionTarget), /non-read-only/);
  assert.throws(() => scratchAssemblerInput(Buffer.from('.text\n.data\n'), sectionTarget), /non-read-only/);
  const rodata = Buffer.from('.text\nadd.s $f0,$f2,$f4\n.section .rodata\n.word 1\n.text\n');
  assert.equal(scratchAssemblerInput(rodata, sectionTarget).toString(), rodata.toString().replace(/^\.text$/gm, '.section .ob64.r1,"ax",@progbits'));
  return cases.length;
}

function cacheTests(root, session, target, sourceFile, result, classification, artifactDir, runId) {
  const candidate = compiler.candidateRecord(target, fs.readFileSync(sourceFile, 'utf8'));
  const cacheKey = compiler.candidateCompileCacheKey(session, target, candidate, classification, { available: false });
  const oldTool = { ...session.tool, workbenchCompilerContract: 10 }; delete oldTool.scratchAssembly;
  assert.notEqual(cacheKey, compiler.candidateCompileCacheKey({ ...session, tool: oldTool, toolId: digest(oldTool) }, target, candidate, classification, { available: false }));
  const tool = { ...session.tool, candidateSourcePolicy: classification };
  const run = { run_id: runId, cache_key: cacheKey, artifact_dir: relative(artifactDir), object_text: result.objectText.toString('base64'), relocations: result.relocations, tool };
  const report = { schemaVersion: 3, target: { targetId: target.targetId }, candidate,
    sourcePolicy: classification, compile: { runId, cacheKey, candidateId: candidate.candidateId, status: 'compiled', objectText: run.object_text, relocations: run.relocations, tool }, scratchContract: result.scratchContract };
  const reportFile = path.join(artifactDir, 'workbench-report.json');
  const write = () => fs.writeFileSync(reportFile, JSON.stringify(report));
  write();
  compiler.cachedCandidateArtifact(run, candidate, target, root);
  delete report.scratchContract.assemblyProvenance.instructionPolicy;
  write();
  assert.throws(() => compiler.cachedCandidateArtifact(run, candidate, target, root), /assembly policy is stale/);
  report.scratchContract.assemblyProvenance.instructionPolicy = SCRATCH_ASSEMBLY_POLICY;
  const inputFile = path.join(artifactDir, 'candidate.s'), original = fs.readFileSync(inputFile);
  const transformed = Buffer.from(p8.legalizeCop1BinaryAssembly(original.toString()));
  assert(!transformed.equals(original), 'negative candidate must exercise historical COP1 rewriting');
  fs.writeFileSync(inputFile, transformed);
  // Even self-consistent rehashed artifacts cannot relabel rewritten input as native.
  report.scratchContract.assemblyProvenance.assemblerInput = { path: relative(inputFile), bytes: transformed.length, sha256: p7.sha256Buffer(transformed) };
  write();
  assert.throws(() => compiler.cachedCandidateArtifact(run, candidate, target, root), /instructions were rewritten/);
  fs.writeFileSync(inputFile, original);
  report.scratchContract.assemblyProvenance.assemblerInput = { path: relative(inputFile), bytes: original.length, sha256: p7.sha256Buffer(original) };
  write();
  compiler.cachedCandidateArtifact(run, candidate, target, root);
}

function probeHistoryTests(root, context, workbench, target) {
  const sourceFile = path.join(root, 'probe.c');
  const source = `float ${target.symbol}(float a, float b) { return a*b; }\n`;
  fs.writeFileSync(sourceFile, source);
  const options = { context, matchingRoot: root, sourcePath: sourceFile, passes: ['rtl'] };
  const current = probe.runProbe(workbench, target, source, options);
  assert.equal(current.status, 'complete', current.error);
  assert.equal(current.identity.implementation.length, 5);
  const historical = JSON.parse(JSON.stringify(current));
  historical.identity.implementation.pop();
  historical.probeId = digest(historical.identity);
  assert.notEqual(historical.probeId, current.probeId);
  const oldDir = path.join(root, 'historical', historical.probeId);
  fs.mkdirSync(oldDir, { recursive: true });
  for (const entry of historical.artifacts) fs.copyFileSync(path.join(p7.ROOT, path.dirname(current.source), entry.name), path.join(oldDir, entry.name));
  historical.source = relative(path.join(oldDir, 'authored.c'));
  historical.expandedSource = relative(path.join(oldDir, 'input.c'));
  historical.assembly = relative(path.join(oldDir, 'output.s'));
  delete historical.reportSha256; historical.reportSha256 = digest(historical);
  const reportFile = path.join(oldDir, 'probe-report.json'); fs.writeFileSync(reportFile, JSON.stringify(historical));
  assert.equal(probe.readProbe(reportFile).probeId, historical.probeId);
  const environmentBefore = process.env.VR4300MUL;
  try {
    process.env.VR4300MUL = 'OFF';
    assert.equal(probe.readProbe(reportFile).probeId, historical.probeId, 'historical read was blocked');
    assert.throws(() => probe.runProbe(workbench, target, source, options), /VR4300MUL disables/);
  } finally {
    if (environmentBefore === undefined) delete process.env.VR4300MUL;
    else process.env.VR4300MUL = environmentBefore;
  }
  const reused = probe.runProbe(workbench, target, source, options);
  assert.equal(reused.cached, true); assert.equal(reused.probeId, current.probeId);
  assert.notEqual(reused.probeId, historical.probeId, 'historical report was reused as current');
}

async function main() {
  assertScratchEnvironment();
  const parent = path.join(p7.ROOT, 'build/tests'); fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'cop1-'));
  await environmentTests(root);
  const tools = assertToolchainAvailable(loadToolchainConfig());
  const cases = nativeAssemblyTests(root, tools);
  const phase8 = loadActiveTargetModel();
  const localTools = JSON.parse(fs.readFileSync(path.join(p7.ROOT, 'config/local-tools.json')));
  const context = { phase8, localTools };
  const session = compiler.prepareCompilerSession({ context });
  assert.equal(session.tool.workbenchCompilerContract, 11);
  assert.deepEqual(session.tool.scratchAssembly, SCRATCH_ASSEMBLY_POLICY);
  const workbench = loadWorkbenchModel(), target = resolveTarget(workbench, 'func_00128050');
  const sourceFile = path.join(p7.ROOT, 'docs/archive/matching-c-candidates/2026-09-30-func_00128050-d0d3bc890f.c');
  const classification = policy.classifySource(relative(sourceFile), { preprocessor: session.preprocessor });
  assert.equal(classification.class, 'PURE_C');
  const runId = digest({ fixture: 'scratch-cop1', root });
  const artifactDir = compiler.authenticateFreshRunArtifactDirectory(runId, root);
  const result = compiler.compileScratchCandidate({ session, target, sourceFile, artifactDir, classification });
  assert.equal(result.objectText.length, 1144, 'retained negative native extent changed');
  assert.equal(target.bytes, 1140);
  const comparison = compareCandidateDiagnostic({ session, target, objectText: result.objectText,
    actualRelocations: result.relocations, expectedRelocationEvidence: { available: false, reason: 'bounded raw negative control' },
    prepared: { available: false, reason: 'bounded raw negative control' } });
  assert.equal(comparison.exactBytes, false);
  assert.equal(comparison.primaryClass, 'length-mismatch');
  cacheTests(root, session, target, sourceFile, result, classification, artifactDir, runId);
  probeHistoryTests(root, context, workbench, target);
  fs.writeFileSync(path.join(root, 'result.json'), JSON.stringify({ status: 'pass', assemblyCases: cases,
    assembler: session.tool.assembler, nativeNegativeBytes: result.objectText.length, targetBytes: target.bytes,
    scratchAssembly: SCRATCH_ASSEMBLY_POLICY, acceptanceEligible: false }, null, 2) + '\n');
  console.log(`scratch COP1: ${cases} native/section-assigned assembler pairs, negative candidate, cache and environment controls passed (${relative(root)})`);
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
