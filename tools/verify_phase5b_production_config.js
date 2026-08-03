#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { verifyPhase5aProduct } = require('./lib/phase5b_phase5a');

const ROOT = path.resolve(__dirname, '..');
const EXPECTED = { rows: 7242, bytes: 41943040, unresolvedSegments: 5, unresolvedFunctions: 6154, overlayHash: 'D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6' };
const absolutePath = /(?:^[A-Za-z]:[\\/]|^\\\\|^\/|C:\\Users\\)/m;

function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase(); }
function jsonl(file) { return fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)); }
function fail(message) { throw new Error(message); }

function main() {
  const configRootIndex = process.argv.indexOf('--config-root');
  const configRoot = configRootIndex >= 0 ? path.resolve(process.argv[configRootIndex + 1]) : ROOT;
  const phase5aRootIndex = process.argv.indexOf('--phase5a-root');
  const phase5aRoot = phase5aRootIndex >= 0 ? path.resolve(process.argv[phase5aRootIndex + 1]) : path.join(ROOT, 'docs', 'external-intake', 'phase5-boundary-segment-reconciliation-static-20260731');
  if (phase5aRootIndex >= 0 && !process.argv[phase5aRootIndex + 1]) fail('Missing --phase5a-root value');
  const semanticFile = path.join(configRoot, 'config', 'splat', 'us_rev0.semantic.json');
  const overlayLinkerFile = path.join(configRoot, 'config', 'splat', 'us_rev0.overlay-linker-inputs.json');
  const splatFile = path.join(configRoot, 'config', 'splat', 'us_rev0.yaml');
  const segmentFile = path.join(configRoot, 'config', 'segments', 'rev0.yaml');
  const lockFile = path.join(configRoot, 'config', 'splat', 'splat64-0.34.0.lock.json');
  for (const file of [semanticFile, overlayLinkerFile, splatFile, segmentFile, lockFile]) if (!fs.existsSync(file)) fail(`Missing production artifact: ${file}`);
  const semantic = JSON.parse(fs.readFileSync(semanticFile, 'utf8'));
  const overlayLinkerInputs = JSON.parse(fs.readFileSync(overlayLinkerFile, 'utf8'));
  const acceptedPhase5a = verifyPhase5aProduct(phase5aRoot);
  if (semantic.acceptedPhase5a.profile !== acceptedPhase5a.profile
      || semantic.acceptedPhase5a.productSha256 !== acceptedPhase5a.logicalSha256
      || semantic.acceptedPhase5a.productManifestSha256 !== acceptedPhase5a.productManifestSha256
      || semantic.acceptedPhase5a.primaryLedgerSha256 !== acceptedPhase5a.primaryLedgerSha256) {
    fail('Verified Phase 5A identity is not propagated into semantic configuration');
  }
  if (semantic.inputHashes.primaryLedger !== acceptedPhase5a.primaryLedgerSha256) fail('Verified primary-ledger identity drift in semantic configuration');
  if (semantic.acceptedPhase5a.primaryRows !== EXPECTED.rows || semantic.rows.length !== EXPECTED.rows) fail('Production primary row count drift');
  if (semantic.acceptedPhase5a.representedBytes !== EXPECTED.bytes) fail('Production byte count drift');
  if (semantic.unresolvedSegmentCandidates.length !== EXPECTED.unresolvedSegments) fail('Unresolved segment disposition drift');
  if (semantic.acceptedPhase5a.unresolvedFunctionCandidates !== EXPECTED.unresolvedFunctions) fail('Unresolved function disposition drift');
  if (semantic.acceptedPhase4.overlayConfigSha256 !== EXPECTED.overlayHash) fail('Phase 4 overlay hash drift in semantic source');
  if (sha256(path.join(ROOT, 'config', 'overlays', 'us_rev0.json')) !== EXPECTED.overlayHash) fail('Phase 4 overlay configuration drift');
  let cursor = 0;
  let rspRows = 0;
  for (const row of semantic.rows) {
    if (row.romStart !== cursor || row.romEndExclusive <= row.romStart || row.bytes !== row.romEndExclusive - row.romStart) fail(`No-gap conservation fails at ${row.primaryId}`);
    if (row.segmentType !== 'bin') fail(`Primary row would require an unaccepted Splat VRAM mapping: ${row.primaryId}`);
    if (row.processorClass === 'rsp') { rspRows += 1; if (row.segmentType !== 'bin') fail(`RSP row promoted to CPU source: ${row.primaryId}`); }
    cursor = row.romEndExclusive;
  }
  if (cursor !== EXPECTED.bytes) fail('Production sequence does not cover the full ROM');
  if (rspRows !== 13) fail(`Expected 13 RSP rows, found ${rspRows}`);
  const acceptedOverlays = jsonl(path.join(phase5aRoot, 'overlay-containment.jsonl'));
  if (overlayLinkerInputs.mode !== 'primary-rom-only-with-explicit-phase4-overlay-reservations') fail('Overlay linker mode drift');
  if (overlayLinkerInputs.phase4OverlayConfigSha256 !== EXPECTED.overlayHash) fail('Overlay linker Phase 4 hash drift');
  if (overlayLinkerInputs.phase5aProfile !== acceptedPhase5a.profile
      || overlayLinkerInputs.phase5aProductSha256 !== acceptedPhase5a.logicalSha256
      || overlayLinkerInputs.phase5aProductManifestSha256 !== acceptedPhase5a.productManifestSha256
      || overlayLinkerInputs.phase5aPrimaryLedgerSha256 !== acceptedPhase5a.primaryLedgerSha256) {
    fail('Verified Phase 5A identity is not propagated into overlay-linker inputs');
  }
  if (!Array.isArray(overlayLinkerInputs.splatPrimaryRows) || overlayLinkerInputs.splatPrimaryRows.length !== EXPECTED.rows) fail('Overlay linker primary-row count drift');
  if (!Array.isArray(overlayLinkerInputs.overlayReservations) || overlayLinkerInputs.overlayReservations.length !== acceptedOverlays.length) fail('Overlay linker reservation count drift');
  if (JSON.stringify(overlayLinkerInputs.overlayReservations) !== JSON.stringify(acceptedOverlays)) fail('Overlay linker reservations differ from accepted Phase 5A containment');
  const structural = semantic.rows.find((row) => row.primaryId === 'primary:31dfe7ef1edfcfdad1a3');
  if (!structural || structural.bytes !== 24 || structural.segmentType !== 'bin') fail('24-byte structural owner drift');
  const configText = `${fs.readFileSync(splatFile, 'utf8')}\n${fs.readFileSync(segmentFile, 'utf8')}\n${fs.readFileSync(semanticFile, 'utf8')}\n${fs.readFileSync(overlayLinkerFile, 'utf8')}`;
  if (absolutePath.test(configText)) fail('Absolute checkout path appears in production semantics');
  if (/external_only|rejected-external-lead/i.test(configText)) fail('External disposition leaked into production semantics');
  const splatRows = (fs.readFileSync(splatFile, 'utf8').match(/^  - name: /gm) || []).length;
  if (splatRows !== EXPECTED.rows) fail('Splat configuration row count drift');
  if (!/^sha1: 9CD0CFB50B883EDB068E0C30D213193B9CF89895$/m.test(fs.readFileSync(splatFile, 'utf8'))) fail('Splat ROM identity drift');
  const regen = childProcess.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'generate_phase5b_production_config.js'), '--check', '--phase5a-root', phase5aRoot], { cwd: ROOT, encoding: 'utf8' });
  if (regen.status !== 0) fail(`Generator drift gate failed: ${regen.stderr || regen.stdout}`);
  const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  if (lock.splat.version !== '0.34.0' || lock.splat.commit !== '999c792fdda1002f29926717d2b7197bb90480a9') fail('Splat lock identity drift');
  if (!Array.isArray(lock.packages) || lock.packages.length < 20) fail('Splat dependency lock is incomplete');
  if (lock.schemaVersion !== 3 || !lock.artifactRoot || !lock.isolatedEnvironment?.interpreter || !Array.isArray(lock.declaredDependencyInventory?.entries) || lock.declaredDependencyInventory.entries.length !== 16) fail('Splat dependency provenance lock is incomplete');
  const provenanceFile = path.join(configRoot, 'config', 'splat', 'splat64-0.34.0.provenance.json');
  const lockGate = childProcess.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'verify_phase5b_splat_lock.js'), '--lock', lockFile, '--provenance', provenanceFile, '--artifact-root', lock.artifactRoot], { cwd: ROOT, encoding: 'utf8' });
  if (lockGate.status !== 0) fail(`Splat dependency lock gate failed: ${lockGate.stderr || lockGate.stdout}`);
  const report = { ok: true, primaryRows: EXPECTED.rows, bytes: EXPECTED.bytes, unresolvedSegments: EXPECTED.unresolvedSegments, unresolvedFunctions: EXPECTED.unresolvedFunctions, rspRows, overlayReservations: acceptedOverlays.length, acceptedPhase5aLogicalSha256: acceptedPhase5a.logicalSha256, overlayConfigSha256: EXPECTED.overlayHash, configRoot: configRoot === ROOT ? 'integration-root' : 'external-control-root' };
  const reportFile = path.join(ROOT, 'build', 'phase5b', 'verify-production-config.json');
  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Phase 5B production configuration: PASS (${EXPECTED.rows} rows, ${EXPECTED.bytes} bytes)`);
}

main();
