#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  loadPhase8Model,
  validateRecordedPhase8Build,
  validateSourceObjectProofBytes,
} = require('../tools/lib/phase8_matching_c');
const { SOURCE_CLASSES } = require('../tools/lib/source_policy');
const {
  classifyActiveTargets,
  prepareContext,
  reusableCurrentState,
} = require('../tools/lib/current_workflow');
const { pureRequirementVerdict } = require('../tools/verify');

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function main() {
  const output = value('--output');
  const phase8 = loadPhase8Model();
  const report = JSON.parse(fs.readFileSync(path.join(output, 'build-report.json'), 'utf8'));
  if (report.status !== 'pass' || !report.verification.preservation.fullRomExact) throw new Error('test input is not an accepted exact build');

  const first = classifyActiveTargets(phase8);
  const second = classifyActiveTargets(phase8);
  const firstDigests = first.targets.map((target) => [target.symbol, target.digest]);
  const secondDigests = second.targets.map((target) => [target.symbol, target.digest]);
  if (JSON.stringify(firstDigests) !== JSON.stringify(secondDigests)) throw new Error('retrospective source classification is not deterministic');
  if (first.counts.UNKNOWN !== 0 || first.counts.ASM !== 0) throw new Error('active target classifications contain UNKNOWN or ASM');

  const pure = first.targets.find((target) => target.symbol === 'func_000E5938');
  const hybrid = first.targets.find((target) => target.symbol === 'func_0000B33C');
  if (!pure || pure.class !== SOURCE_CLASSES.PURE_C) throw new Error('known pure-C exact target was not classified PURE_C');
  if (!hybrid || hybrid.class !== SOURCE_CLASSES.HYBRID_C) throw new Error('known inline-assembly exact target was not classified HYBRID_C');
  if (!pureRequirementVerdict([pure], true).pass) throw new Error('PURE_C exact target failed --require-pure policy');
  if (pureRequirementVerdict([hybrid], true).pass) throw new Error('HYBRID_C exact target passed --require-pure policy');

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function expectRejection(name, callback) {
    try {
      callback();
    } catch (_) {
      return name;
    }
    throw new Error(`workflow mutation was accepted: ${name}`);
  }
  validateRecordedPhase8Build(phase8, {
    output,
    buildReport: report,
    verification: report.verification,
    compilerSha256: report.compiler.sha256,
  });
  const mutations = [];
  const staleBuild = clone(report);
  staleBuild.schemaVersion = 1;
  mutations.push(expectRejection('stale build schema', () => validateRecordedPhase8Build(phase8, {
    output, buildReport: staleBuild, verification: report.verification, compilerSha256: report.compiler.sha256,
  })));
  const staleVerification = clone(report.verification);
  staleVerification.schemaVersion = 1;
  mutations.push(expectRejection('stale verification schema', () => validateRecordedPhase8Build(phase8, {
    output, buildReport: report, verification: staleVerification, compilerSha256: report.compiler.sha256,
  })));
  const missingProof = clone(report);
  missingProof.targetReplacements[0].sourceObjectProof = null;
  mutations.push(expectRejection('missing proof', () => validateRecordedPhase8Build(phase8, {
    output, buildReport: missingProof, verification: report.verification, compilerSha256: report.compiler.sha256,
  })));
  const hybridHashDrift = clone(report);
  const hybridReplacement = hybridHashDrift.targetReplacements.find((target) => target.symbol === hybrid.symbol);
  hybridReplacement.linkedAssemblySha256 = '0'.repeat(64);
  mutations.push(expectRejection('hybrid section-adjusted assembly hash drift', () => validateRecordedPhase8Build(phase8, {
    output, buildReport: hybridHashDrift, verification: report.verification, compilerSha256: report.compiler.sha256,
  })));
  const unknownClass = clone(report);
  unknownClass.targetReplacements.find((target) => target.symbol === hybrid.symbol).sourceClass = SOURCE_CLASSES.UNKNOWN;
  mutations.push(expectRejection('unknown recorded class', () => validateRecordedPhase8Build(phase8, {
    output, buildReport: unknownClass, verification: report.verification, compilerSha256: report.compiler.sha256,
  })));
  const proofFile = path.join(output, ...report.targetReplacements[0].sourceObjectProof.path.split('/'));
  const proofBytes = fs.readFileSync(proofFile);
  const staleProof = JSON.parse(proofBytes.toString('utf8'));
  staleProof.schemaVersion = 0;
  const staleProofBytes = Buffer.from(`${JSON.stringify(staleProof, null, 2)}\n`);
  mutations.push(expectRejection('stale proof schema', () => validateSourceObjectProofBytes(staleProofBytes, proofBytes)));

  const context = prepareContext();
  const reusable = {
    schemaVersion: 3,
    fingerprint: context.currentFingerprint,
    baselineFingerprint: context.baselineFingerprint,
    output,
  };
  if (!reusableCurrentState(context, reusable)) throw new Error('valid current state was not reusable');
  if (reusableCurrentState(context, { ...reusable, fingerprint: '0'.repeat(64) })) throw new Error('stale current fingerprint was reusable');

  console.log(JSON.stringify({
    status: 'pass',
    fullRomExact: true,
    deterministicClassification: true,
    pureExactAccepted: { symbol: pure.symbol, class: pure.class, bytes: pure.bytes },
    hybridExactRejectedByRequirePure: { symbol: hybrid.symbol, class: hybrid.class, bytes: hybrid.bytes },
    counts: first.counts,
    bytes: first.bytes,
    rejectedWorkflowMutations: mutations,
    staleCurrentFingerprintRejected: true,
  }, null, 2));
}

main();
