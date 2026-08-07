#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { loadPhase8Model } = require('../tools/lib/phase8_matching_c');
const { SOURCE_CLASSES } = require('../tools/lib/source_policy');
const { classifyActiveTargets } = require('../tools/lib/current_workflow');
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

  console.log(JSON.stringify({
    status: 'pass',
    fullRomExact: true,
    deterministicClassification: true,
    pureExactAccepted: { symbol: pure.symbol, class: pure.class, bytes: pure.bytes },
    hybridExactRejectedByRequirePure: { symbol: hybrid.symbol, class: hybrid.class, bytes: hybrid.bytes },
    counts: first.counts,
    bytes: first.bytes,
  }, null, 2));
}

main();
