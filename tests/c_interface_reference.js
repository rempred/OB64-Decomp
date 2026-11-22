'use strict';
const fs = require('fs'),
  path = require('path'),
  assert = require('assert'),
  crypto = require('crypto'),
  policy = require('../tools/lib/c_interface_prospective'),
  companion = require('../tools/lib/c_interface_companion');
const stage = path.resolve(__dirname, '..'),
  root = process.env.OB64_INTERFACE_TEST_ROOT || stage,
  scratch = process.env.OB64_INTERFACE_TEST_SCRATCH || path.join(stage, 'build/c-interface-tests'),
  dir = path.join(scratch, 'reference');
fs.mkdirSync(path.join(dir, 'config'), {
  recursive: true
});
let checks = 0;
const start = performance.now(),
  bytes = fs.readFileSync(path.join(stage, policy.BOOTSTRAP.path));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase(), policy.BOOTSTRAP.sha256);
checks++;
fs.writeFileSync(path.join(dir, policy.BOOTSTRAP.path), bytes);
const prior = policy.reference(dir, null);
assert.equal(prior.kind, 'accepted-commit-bootstrap');
checks++;
const unchanged = policy.affected(prior.inventory, prior);
assert.equal(unchanged.changedFunctions.length, 0);
assert.equal(unchanged.changedDeclarations.length, 0);
assert.equal(unchanged.changedCalls.length, 0);
checks += 3;
const changed = JSON.parse(JSON.stringify(prior.inventory)),
  u = changed.find(u => u.functions.length);
u.functions[0].bodyFingerprint = 'A'.repeat(64);
assert.equal(policy.affected(changed, prior).changedFunctions.length, 1);
checks++;
const changedCalls = JSON.parse(JSON.stringify(prior.inventory)),
  cu = changedCalls.find(u => u.calls?.length);
cu.calls[0].invoked = 'B'.repeat(64);
assert.equal(policy.affected(changedCalls, prior).changedCalls.length, 1);
checks++;
fs.writeFileSync(path.join(dir, policy.BOOTSTRAP.path), Buffer.concat([bytes, Buffer.from('x')]));
assert.throws(() => policy.reference(dir, null), /bootstrap identity changed/);
checks++;
fs.writeFileSync(path.join(dir, policy.BOOTSTRAP.path), bytes);
const absent = path.join(dir, 'missing');
fs.mkdirSync(absent, {
  recursive: true
});
assert.equal(policy.reference(absent, null), null);
assert.equal(policy.affected(prior.inventory, null).mode, 'all-known-interfaces-no-trusted-reference');
checks += 2;
if (process.env.OB64_INTERFACE_REAL_REFERENCE === '1') {
  const state = JSON.parse(fs.readFileSync(process.env.OB64_INTERFACE_REFERENCE_STATE || path.join(root,
      'build/current/state.json'))),
    fresh = JSON.parse(fs.readFileSync(state.freshCompilationReport));
  assert.equal(companion.validate({
    root,
    state,
    fresh
  }).version, 1);
  checks++;
}
fs.writeFileSync(path.join(scratch, 'reference-results.json'), JSON.stringify({
  status: 'pass',
  checks,
  bytes: bytes.length,
  elapsedMs: performance.now() - start,
  bootstrap: policy.BOOTSTRAP,
  changedFunctions: unchanged.changedFunctions.length,
  changedCalls: unchanged.changedCalls.length,
  note: 'Portable root has no .git, accepted outputs or warm cache; legacy actual R18 companion remains version1.'
}, null, 2));
console.log(JSON.stringify({
  status: 'pass',
  checks,
  bytes: bytes.length,
  elapsedMs: performance.now() - start
}));
