#!/usr/bin/env node
'use strict';

const path = require('path');
const accounting = require('./lib/wave_accounting');

function main(args = process.argv.slice(2)) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log('Usage: node tools/wave-accounting.js --manifest <absolute-json-file>');
    console.log('Read-only wave storage and time accounting. Manifest schemaVersion 1, wave, window {startedAt, finishedAt}, optional workers, profiles [{path, worker}], diagnostics [{path, worker}], activities [{worker, kind, startedAt, finishedAt, evidence}], diffRoots [absolute path], references {docs: [], memory: [], mail: []}. Timestamps require timezones.');
    console.log(`Activity kinds: ${[...accounting.ACTIVITY_KINDS].join(', ')}. Missing timing stays unobserved. Storage classes never authorize deletion.`);
    console.log('Omitted reference categories remain explicitly incomplete. Unreadable supplied inputs or incomplete byte census exit 2. All runs remain protected.');
    return;
  }
  if (args.length !== 2 || args[0] !== '--manifest' || !path.isAbsolute(args[1])) throw new Error('--manifest requires one absolute JSON file');
  const input = accounting.readJson(args[1]);
  const result = accounting.report(input.value);
  result.manifest = { path: input.path, sha256: input.sha256 };
  console.log(JSON.stringify(result, null, 2));
  if (!result.inputsComplete || !result.storage.byteCensusComplete) process.exitCode = 2;
  return result;
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { main };
