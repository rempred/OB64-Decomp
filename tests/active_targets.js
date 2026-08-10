#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  CONFIG_PATH,
  LEGACY_CONFIG_PATH,
  loadActiveTargetModel,
  validateDialectPin,
} = require('../tools/lib/active_targets');
const { validateDialectManifest } = require('../tools/lib/compiler_assembly_dialect');
const { ROOT, sha256File } = require('../tools/lib/phase7_conventional');
const { writeJson } = require('../tools/lib/current_workflow');

function main() {
  const active = loadActiveTargetModel();
  function expectRejection(name, callback) {
    try {
      callback();
    } catch (_) {
      return name;
    }
    throw new Error(`dialect mutation was accepted: ${name}`);
  }
  const pin = active.minimalConfig.compilerAssemblyDialect;
  validateDialectPin(pin, active.dialect.identity.manifestSha256);
  const pinMutations = [
    ['pin path', { ...pin, manifest: 'config/other.json' }],
    ['pin hash', { ...pin, manifestSha256: '0'.repeat(64) }],
    ['pin schema', { ...pin, selector: 'target-specific' }],
  ].map(([name, mutation]) => expectRejection(name, () => validateDialectPin(mutation, active.dialect.identity.manifestSha256)));
  const manifestMutations = [
    ['schema', { schemaVersion: 1 }],
    ['eligibility', { eligibilityClass: 'HYBRID_C' }],
    ['hybrid action', { hybridAction: 'parse' }],
    ['rules', { rules: [{ id: 'target-specific' }] }],
    ['compiler manifest', { compilerManifestSha256: '0'.repeat(64) }],
    ['compiler executable', { compilerExecutableSha256: '0'.repeat(64) }],
    ['compiler flags', { compileFlags: [...active.dialect.manifest.compileFlags, '-fPIC'] }],
    ['assembler config', { assemblerConfigSha256: '0'.repeat(64) }],
    ['assembler executable', { assemblerExecutableSha256: '0'.repeat(64) }],
    ['assembler version', { assemblerVersion: 'GNU assembler 0' }],
    ['assembler flags', { assemblerFlags: ['-EL'] }],
    ['module path', { implementationPath: 'tools/lib/other.js' }],
    ['module hash', { implementationSha256: '0'.repeat(64) }],
  ].map(([name, mutation]) => expectRejection(name, () => validateDialectManifest({
    ...active.dialect.manifest,
    ...mutation,
  }, active.dialect.contract)));
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
    dialect: active.dialect.identity,
    rejectedDialectMutations: [...pinMutations, ...manifestMutations],
    structuralFieldsEquivalent: true,
    compatibility: active.compatibility,
  };
  const reportFile = path.join(ROOT, 'build', 'workflow-migration', 'active-target-adapter.json');
  writeJson(reportFile, report);
  console.log(JSON.stringify({ status: 'pass', targets: active.targets.length, report: reportFile }, null, 2));
}

main();
