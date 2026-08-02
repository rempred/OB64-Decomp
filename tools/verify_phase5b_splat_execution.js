#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXPECTED = { rows: 7242, bytes: 41943040 };
function value(flag) { const index = process.argv.indexOf(flag); if (index < 0 || !process.argv[index + 1]) throw new Error(`Missing ${flag}`); return path.resolve(process.argv[index + 1]); }
function sha256Buffer(buffer) { return crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase(); }
function main() {
  const output = value('--output');
  const report = process.argv.includes('--report') ? value('--report') : path.join(output, 'phase5b-splat-verification.json');
  if (output.toLowerCase().startsWith(ROOT.toLowerCase())) throw new Error('Phase 5B Splat execution output must remain outside the integration repository');
  const semantic = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'splat', 'us_rev0.semantic.json'), 'utf8'));
  const overlayInputs = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'splat', 'us_rev0.overlay-linker-inputs.json'), 'utf8'));
  const command = JSON.parse(fs.readFileSync(path.join(output, 'splat-command.json'), 'utf8'));
  const linker = fs.readFileSync(path.join(output, 'build', 'ob64_us_rev0_phase5b.ld'), 'utf8');
  const rom = fs.readFileSync(path.join(output, 'baserom.us_rev0.z64'));
  if (command.exitCode !== 0) throw new Error('Recorded Splat command did not succeed');
  if (semantic.rows.length !== EXPECTED.rows || rom.length !== EXPECTED.bytes) throw new Error('Splat input size or row count drift');
  let verifiedBytes = 0;
  for (const row of semantic.rows) {
    const asset = path.join(output, 'assets', `${row.name}.bin`);
    if (!fs.existsSync(asset)) throw new Error(`Missing Splat asset: ${row.name}`);
    const actual = fs.readFileSync(asset);
    const expected = rom.subarray(row.romStart, row.romEndExclusive);
    if (actual.length !== row.bytes || !actual.equals(expected)) throw new Error(`Splat asset bytes differ: ${row.name}`);
    if (!linker.includes(`${row.name}_ROM_START`) || !linker.includes(`${row.name}_ROM_END`)) throw new Error(`Linker ROM symbols missing: ${row.name}`);
    verifiedBytes += actual.length;
  }
  if (verifiedBytes !== EXPECTED.bytes) throw new Error('Splat asset conservation drift');
  if (overlayInputs.splatPrimaryRows.length !== EXPECTED.rows || overlayInputs.overlayReservations.length === 0) throw new Error('Overlay linker inputs are incomplete');
  const result = { ok: true, rows: EXPECTED.rows, verifiedBytes, romSha256: sha256Buffer(rom), assetsVerified: EXPECTED.rows, overlayReservationCount: overlayInputs.overlayReservations.length, linkerMode: overlayInputs.mode, commandExitCode: command.exitCode };
  fs.mkdirSync(path.dirname(report), { recursive: true });
  fs.writeFileSync(report, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Phase 5B Splat execution verification: PASS (${EXPECTED.rows} assets, ${verifiedBytes} bytes)`);
}
main();
