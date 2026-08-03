#!/usr/bin/env node
'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { verifyPhase5aProduct } = require('../tools/lib/phase5b_phase5a');

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`Missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function optionalValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0) return null;
  if (!process.argv[index + 1]) throw new Error(`Missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function copyProduct(source, destination) {
  const manifestFile = path.join(source, 'verification', 'product-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  for (const row of manifest.files) {
    const target = path.join(destination, row.path);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(source, row.path), target);
  }
  fs.mkdirSync(path.join(destination, 'verification'), { recursive: true });
  fs.copyFileSync(manifestFile, path.join(destination, 'verification', 'product-manifest.json'));
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function refreshManifest(root) {
  const manifestFile = path.join(root, 'verification', 'product-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  for (const row of manifest.files) {
    const file = path.join(root, row.path);
    row.bytes = fs.statSync(file).size;
    row.sha256 = sha256(file);
  }
  manifest.file_count = manifest.files.length;
  const material = manifest.files.map((row) => `${row.path}|${row.bytes}|${row.sha256}`).join('\n');
  manifest.logical_sha256 = crypto.createHash('sha256').update(material).digest('hex').toUpperCase();
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
}

function rejects(source, mutate, label, options = {}) {
  const target = path.join(scratch, label);
  copyProduct(source, target);
  mutate(target);
  if (options.refreshManifest !== false) refreshManifest(target);
  assert.throws(() => verifyPhase5aProduct(target), /Phase 5A product identity failure/, `${label} unexpectedly passed`);
}

const accepted = value('--accepted-root');
const successor = value('--successor-root');
const reproduction = value('--reproduction-root');
const cumulative = optionalValue('--cumulative-root');
const cumulativeReproduction = optionalValue('--cumulative-reproduction-root');
if (Boolean(cumulative) !== Boolean(cumulativeReproduction)) {
  throw new Error('Cumulative profile requires both --cumulative-root and --cumulative-reproduction-root');
}
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-phase5b-successor-profile-'));
try {
  const acceptedResult = verifyPhase5aProduct(accepted);
  const successorResult = verifyPhase5aProduct(successor);
  const reproductionResult = verifyPhase5aProduct(reproduction);
  assert.strictEqual(acceptedResult.profile, 'accepted');
  assert.strictEqual(acceptedResult.row585.primary_class, 'data');
  assert.strictEqual(successorResult.profile, 'row585-code-successor');
  assert.strictEqual(successorResult.row585.primary_class, 'code');
  assert.deepStrictEqual(reproductionResult.files, successorResult.files);
  assert.strictEqual(reproductionResult.logicalSha256, successorResult.logicalSha256);
  assert.strictEqual(reproductionResult.productManifestSha256, successorResult.productManifestSha256);

  let cumulativeResult = null;
  if (cumulative) {
    cumulativeResult = verifyPhase5aProduct(cumulative);
    const cumulativeReproductionResult = verifyPhase5aProduct(cumulativeReproduction);
    assert.strictEqual(cumulativeResult.profile, 'row565-row585-code-cumulative-successor');
    assert.strictEqual(cumulativeResult.row565.primary_class, 'code');
    assert.strictEqual(cumulativeResult.row585.primary_class, 'code');
    assert.deepStrictEqual(cumulativeReproductionResult.files, cumulativeResult.files);
    assert.strictEqual(cumulativeReproductionResult.logicalSha256, cumulativeResult.logicalSha256);
    assert.strictEqual(cumulativeReproductionResult.productManifestSha256, cumulativeResult.productManifestSha256);
    assert.deepStrictEqual(
      cumulativeResult.files.filter((row, index) => JSON.stringify(row) !== JSON.stringify(successorResult.files[index])).map((row) => row.path),
      ['full-rom-primary-ledger.jsonl'],
    );
  }

  rejects(successor, (root) => {
    const manifestFile = path.join(root, 'verification', 'product-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    manifest.logical_sha256 = acceptedResult.logicalSha256;
    fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  }, 'altered-identity', { refreshManifest: false });

  rejects(successor, (root) => {
    const manifestFile = path.join(root, 'verification', 'product-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    manifest.files.push({ path: 'extra.json', bytes: 0, sha256: '0'.repeat(64) });
    fs.writeFileSync(path.join(root, 'extra.json'), '');
    fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  }, 'extra-declared-file');

  rejects(successor, (root) => {
    const ledgerFile = path.join(root, 'full-rom-primary-ledger.jsonl');
    const lines = fs.readFileSync(ledgerFile, 'utf8').trim().split(/\r?\n/);
    fs.writeFileSync(ledgerFile, `${lines.join('\n')}\n${lines[585]}\n`);
  }, 'extra-row');

  rejects(successor, (root) => {
    const ledgerFile = path.join(root, 'full-rom-primary-ledger.jsonl');
    const lines = fs.readFileSync(ledgerFile, 'utf8').trim().split(/\r?\n/);
    const row = JSON.parse(lines[584]);
    row.primary_class = row.primary_class === 'code' ? 'data' : 'code';
    lines[584] = JSON.stringify(row);
    fs.writeFileSync(ledgerFile, `${lines.join('\n')}\n`);
  }, 'changed-other-row');

  rejects(successor, (root) => {
    const ledgerFile = path.join(root, 'full-rom-primary-ledger.jsonl');
    const lines = fs.readFileSync(ledgerFile, 'utf8').trim().split(/\r?\n/);
    const row = JSON.parse(lines[585]);
    row.owner_path = 'asm/original/rev0/lib/func_00025000.s';
    lines[585] = JSON.stringify(row);
    fs.writeFileSync(ledgerFile, `${lines.join('\n')}\n`);
  }, 'changed-preserved-field');

  if (cumulative) {
    rejects(cumulative, (root) => {
      const manifestFile = path.join(root, 'verification', 'product-manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
      manifest.logical_sha256 = successorResult.logicalSha256;
      fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
    }, 'cumulative-altered-identity', { refreshManifest: false });

    rejects(cumulative, (root) => {
      const manifestFile = path.join(root, 'verification', 'product-manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
      manifest.files.push({ path: 'extra.json', bytes: 0, sha256: '0'.repeat(64) });
      fs.writeFileSync(path.join(root, 'extra.json'), '');
      fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
    }, 'cumulative-extra-declared-file');

    rejects(cumulative, (root) => {
      const ledgerFile = path.join(root, 'full-rom-primary-ledger.jsonl');
      const lines = fs.readFileSync(ledgerFile, 'utf8').trim().split(/\r?\n/);
      fs.writeFileSync(ledgerFile, `${lines.join('\n')}\n${lines[565]}\n`);
    }, 'cumulative-extra-row');

    rejects(cumulative, (root) => {
      const ledgerFile = path.join(root, 'full-rom-primary-ledger.jsonl');
      const lines = fs.readFileSync(ledgerFile, 'utf8').trim().split(/\r?\n/);
      const row = JSON.parse(lines[564]);
      row.primary_class = row.primary_class === 'code' ? 'data' : 'code';
      lines[564] = JSON.stringify(row);
      fs.writeFileSync(ledgerFile, `${lines.join('\n')}\n`);
    }, 'cumulative-changed-other-row');

    rejects(cumulative, (root) => {
      const ledgerFile = path.join(root, 'full-rom-primary-ledger.jsonl');
      const lines = fs.readFileSync(ledgerFile, 'utf8').trim().split(/\r?\n/);
      const row = JSON.parse(lines[565]);
      row.owner_path = 'asm/original/rev0/lib/func_000241f8.s';
      lines[565] = JSON.stringify(row);
      fs.writeFileSync(ledgerFile, `${lines.join('\n')}\n`);
    }, 'cumulative-changed-preserved-field');

    rejects(cumulative, (root) => {
      const ledgerFile = path.join(root, 'full-rom-primary-ledger.jsonl');
      const lines = fs.readFileSync(ledgerFile, 'utf8').trim().split(/\r?\n/);
      const row = JSON.parse(lines[585]);
      row.primary_class = 'data';
      lines[585] = JSON.stringify(row);
      fs.writeFileSync(ledgerFile, `${lines.join('\n')}\n`);
    }, 'cumulative-row585-regression');

    rejects(cumulative, (root) => {
      const ledgerFile = path.join(root, 'full-rom-primary-ledger.jsonl');
      const lines = fs.readFileSync(ledgerFile, 'utf8').trim().split(/\r?\n/);
      const row = JSON.parse(lines[565]);
      row.primary_class = 'data';
      lines[565] = JSON.stringify(row);
      fs.writeFileSync(ledgerFile, `${lines.join('\n')}\n`);
    }, 'cumulative-row565-regression');
  }

  console.log('phase5b_successor_profile: PASS');
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}
