'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const EXPECTED_LOGICAL_SHA256 = '13BB110109C6DAE45157572DB5AC95DD233AB41C8639901302ED593AAB862EF2';
const EXPECTED_FILES = [
  'candidate-source-occurrences.jsonl', 'function-dispositions.jsonl', 'segment-dispositions.jsonl',
  'full-rom-primary-ledger.jsonl', 'structural-overlaps.jsonl', 'control-flow-edges.jsonl',
  'return-delay-slots.jsonl', 'overlay-containment.jsonl', 'contribution-view.jsonl',
  'candidate-universe-summary.json', 'full-rom-conservation.json', 'splat-input-candidate.yaml', 'input-provenance-manifest.json',
];
function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase(); }
function fail(message) { throw new Error(`Accepted Phase 5A identity failure: ${message}`); }
function verifyPhase5aProduct(product) {
  const manifestFile = path.join(product, 'verification', 'product-manifest.json');
  if (!fs.existsSync(manifestFile)) fail(`missing manifest: ${manifestFile}`);
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  if (manifest.schema_version !== 1 || manifest.self_excluding !== true || manifest.file_count !== EXPECTED_FILES.length || !Array.isArray(manifest.files) || manifest.files.length !== EXPECTED_FILES.length) fail('manifest schema or file count drift');
  const paths = manifest.files.map((row) => row.path);
  if (new Set(paths).size !== paths.length) fail('duplicate manifest path');
  if (JSON.stringify(paths) !== JSON.stringify(EXPECTED_FILES)) fail('manifest path set or order drift');
  for (const row of manifest.files) {
    if (!row || typeof row.path !== 'string' || !Number.isInteger(row.bytes) || row.bytes < 0 || !/^[0-9A-F]{64}$/.test(row.sha256)) fail(`invalid manifest row: ${row && row.path}`);
    if (path.isAbsolute(row.path) || row.path.includes('..') || row.path.includes('\\')) fail(`unsafe manifest path: ${row.path}`);
    const file = path.join(product, row.path);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail(`missing declared file: ${row.path}`);
    if (fs.statSync(file).size !== row.bytes) fail(`byte count drift: ${row.path}`);
    if (sha256(file) !== row.sha256) fail(`SHA-256 drift: ${row.path}`);
  }
  const material = manifest.files.map((row) => `${row.path}|${row.bytes}|${row.sha256}`).join('\n');
  const logical = crypto.createHash('sha256').update(material).digest('hex').toUpperCase();
  if (logical !== EXPECTED_LOGICAL_SHA256 || manifest.logical_sha256 !== EXPECTED_LOGICAL_SHA256) fail(`logical SHA-256 drift: ${logical}`);
  return { logicalSha256: logical, fileCount: manifest.files.length, files: manifest.files };
}
module.exports = { EXPECTED_LOGICAL_SHA256, verifyPhase5aProduct, sha256 };
