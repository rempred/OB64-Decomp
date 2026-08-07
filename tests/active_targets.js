#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  CONFIG_PATH,
  LEGACY_CONFIG_PATH,
  loadActiveTargetModel,
} = require('../tools/lib/active_targets');
const { ROOT, sha256File } = require('../tools/lib/phase7_conventional');
const { writeJson } = require('../tools/lib/current_workflow');

function main() {
  const active = loadActiveTargetModel();
  for (const record of active.compatibility) {
    if (!record.comparisons.every((comparison) => comparison.equivalent)) throw new Error(`structural adapter mismatch: ${record.symbol}`);
    if (record.legacyRecord && record.relocationComparison !== 'trusted-legacy-contract-retained') throw new Error(`relocation bridge status drift: ${record.symbol}`);
  }
  const report = {
    schemaVersion: 1,
    status: 'pass',
    generatedAt: new Date().toISOString(),
    activeConfig: { path: path.relative(ROOT, CONFIG_PATH).replace(/\\/g, '/'), sha256: sha256File(CONFIG_PATH) },
    compatibilityConfig: { path: path.relative(ROOT, LEGACY_CONFIG_PATH).replace(/\\/g, '/'), sha256: sha256File(LEGACY_CONFIG_PATH) },
    targetCount: active.targets.length,
    structuralFieldsEquivalent: true,
    compatibility: active.compatibility,
  };
  const reportFile = path.join(ROOT, 'build', 'workflow-migration', 'active-target-adapter.json');
  writeJson(reportFile, report);
  console.log(JSON.stringify({ status: 'pass', targets: active.targets.length, report: reportFile }, null, 2));
}

main();
