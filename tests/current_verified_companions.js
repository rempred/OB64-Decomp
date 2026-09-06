#!/usr/bin/env node
'use strict';

const fs = require('fs');
const assert = require('assert');
const { validateVerifiedCompanions } = require('../tools/lib/current_workflow');
const stateIndex = process.argv.indexOf('--state');
if (stateIndex < 0 || !process.argv[stateIndex + 1]) throw new Error('Usage: node tests/current_verified_companions.js --state <state.json>');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const state = read(process.argv[stateIndex + 1]);
const build = read(state.report), fresh = read(state.freshCompilationReport), verified = read(state.verificationReport);
validateVerifiedCompanions(build, fresh, verified, state.output);
const rejections = [];
for (const [name, change] of [
  ['fresh object drift', value => { value.fresh.targets[0].objectEvidence.rawOwners[0].sha256 = '0'.repeat(64); }],
  ['verification owner drift', value => { value.verified.verification.targets[0].linkEvidence.fullOwnerExact = false; }],
  ['nonexact build', value => { value.build.targetReplacements[0].linkEvidence.fullOwnerExact = false; }],
  ['fresh source class', value => { value.fresh.targets[0].sourceClass = 'UNKNOWN'; }],
  ['missing fresh target', value => { value.fresh.targets.pop(); }],
  ['wrong output role', value => { value.verified.output = 'other'; }],
  ['stale fresh schema', value => { value.fresh.schemaVersion = 4; }],
]) {
  const value = structuredClone({ build, fresh, verified });
  change(value);
  assert.throws(() => validateVerifiedCompanions(value.build, value.fresh, value.verified, state.output));
  rejections.push(name);
}
console.log(JSON.stringify({ status: 'pass', validAccepted: true, rejections }, null, 2));
