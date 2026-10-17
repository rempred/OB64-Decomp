#!/usr/bin/env node
'use strict';

const fs = require('fs');
const assert = require('assert');
const { loadActiveTargetModel } = require('../tools/lib/active_targets');
const phase8 = loadActiveTargetModel();
const { validateVerifiedCompanions } = require('../tools/lib/current_workflow');
const stateIndex = process.argv.indexOf('--state');
if (stateIndex < 0 || !process.argv[stateIndex + 1]) throw new Error('Usage: node tests/current_verified_companions.js --state <state.json>');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const state = read(process.argv[stateIndex + 1]);
const build = read(state.report), fresh = read(state.freshCompilationReport), verified = read(state.verificationReport);
validateVerifiedCompanions(build, fresh, verified, state.output, phase8);
const rejections = [];
for (const [name, change, expectedError] of [
  ['fresh representation digest drift', value => { value.fresh.targets[0].freshRepresentationSha256 = '0'.repeat(64); }, /^text contract: source-object proof validation failed: /],
  ['verification copy identity drift', value => { value.verified.verification.targets[0].representationSha256 = '0'.repeat(64); }, /^verified companion schema or build identity drift$/],
  ['build copy identity drift', value => { value.build.targetReplacements[0].linkEvidence = { fullOwnerExact: false }; }, /^verified companion schema or build identity drift$/],
  ['fresh source class', value => { value.fresh.targets[0].sourceClass = 'UNKNOWN'; }, /^verified companion target identity drift$/],
  ['missing fresh target', value => { value.fresh.targets.pop(); }, /^text contract: compact target census drift$/],
  ['wrong output role', value => { value.verified.output = 'other'; }, /^verified companion schema or build identity drift$/],
  ['stale fresh schema', value => { value.fresh.schemaVersion = 4; }, /^verified companion schema or build identity drift$/],
]) {
  const value = structuredClone({ build, fresh, verified });
  change(value);
  assert.throws(() => validateVerifiedCompanions(value.build, value.fresh, value.verified, state.output, phase8), { message: expectedError });
  validateVerifiedCompanions(build, fresh, verified, state.output, phase8);
  rejections.push(name);
}
console.log(JSON.stringify({ status: 'pass', validAccepted: true, rejections }, null, 2));
