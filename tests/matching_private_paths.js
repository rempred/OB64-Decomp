'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { resolvePrivateWorkspace, assertPrivatePath, assertPrivateWorkspace } = require('../tools/lib/matching/private_workspace');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-path-'));
try {
  const resolve = scratchRoot => resolvePrivateWorkspace({root, scratchRoot});
  const w = resolve('build/matching/w1');
  assert.strictEqual(w.nativeConcurrency, 'parallel');
  assert.strictEqual(resolvePrivateWorkspace({root, scratchRoot:'build/matching/w1', nativeConcurrency:'serial'}).nativeConcurrency, 'serial');
  assert.strictEqual(w.storeOptions.database, path.join(root, 'build', 'matching', 'w1', 'workbench.sqlite'));
  for (const value of ['build/matching/runs', 'build/matching/manual', 'build/matching/targets', 'build/matching/research-preserve', 'build/matching/workbench.sqlite', 'build/matching/W1', 'build/matching/con', 'build/matching/com1', 'build/matching/w1/nested', 'build/matching/w1/../w2', 'build/matching/w1.', 'build/matching/w1 ', '../escape', 'build/matching/w1:alias', 'build/matching/' + 'x'.repeat(25)]) assert.throws(() => resolve(value), undefined, value);
  assert.throws(() => resolvePrivateWorkspace({root: path.join(root, 'x'.repeat(130)), scratchRoot:'build/matching/w1'}), /exceeds/);
  fs.mkdirSync(w.matchingRoot, {recursive:true});
  const other = path.join(root, 'outside'); fs.mkdirSync(other);
  fs.symlinkSync(other, path.join(w.matchingRoot, 'alias'), 'junction');
  assert.throws(() => assertPrivateWorkspace(w), /links/);
  fs.unlinkSync(path.join(w.matchingRoot, 'alias'));
  fs.writeFileSync(path.join(other, 'file'), 'safe');
  fs.linkSync(path.join(other, 'file'), path.join(w.matchingRoot, 'hardlink'));
  assert.throws(() => assertPrivateWorkspace(w), /hardlinks/);
  fs.unlinkSync(path.join(w.matchingRoot, 'hardlink'));
  assert.throws(() => assertPrivatePath(w, path.join(other, 'file')), /below/);
  assert.throws(() => assertPrivatePath(w, path.join(root, 'build/matching/w2/file')), /below/);
  fs.symlinkSync(other, path.join(root, 'build/matching/w2'), 'junction');
  assert.throws(() => resolve('build/matching/w2'), /links/);
  fs.unlinkSync(path.join(root, 'build/matching/w2'));
  fs.writeFileSync(path.join(root, 'build/matching/w2'), 'occupied');
  assert.throws(() => resolve('build/matching/w2'), /occupied/);
  console.log('private root confinement tests passed');
} finally {
  // Verify this exact temporary root before recursive removal. Never follow a replacement.
  assert.strictEqual(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
  assert(path.basename(root).startsWith('ob64-path-'));
  assert(!fs.lstatSync(root).isSymbolicLink());
  assert.strictEqual(fs.realpathSync(root).toLowerCase(), path.resolve(root).toLowerCase());
  fs.rmSync(root, {recursive:true, force:true});
}
