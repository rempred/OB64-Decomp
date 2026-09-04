#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ROUTINE_TESTS = [
  ['source-policy', 'tests/source_policy.js'],
  ['local-tools', 'tests/local_tools.js'],
  ['active-targets', 'tests/active_targets.js'],
  ['matching-context', 'tests/matching_context.js'],
  ['status-accounting', 'tests/status.js'],
  ['diff-exactness', 'tests/diff_exactness.js'],
  ['matching-diagnostics', 'tests/matching_diagnostics.js'],
  ['diff-object-cache', 'tests/diff_object_cache.js'],
  ['matching-studies', 'tests/matching_studies.js'],
  ['matching-workbench', 'tests/matching_workbench.js'],
];

function usage() {
  console.log('Usage: node tools/test.js [--list]');
  console.log('Runs the required routine tooling regression suites (not the heavyweight audit).');
}

function main() {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && !['--help', '-h', '--list'].includes(args[0]))) {
    usage();
    process.exitCode = 2;
    return;
  }
  if (args[0] === '--help' || args[0] === '-h') {
    usage();
    return;
  }
  if (args[0] === '--list') {
    for (const [name, relative] of ROUTINE_TESTS) console.log(`${name}: ${relative}`);
    return;
  }

  const failures = [];
  const startedAt = Date.now();
  for (const [name, relative] of ROUTINE_TESTS) {
    console.log(`\n== ${name} (${relative}) ==`);
    const script = path.join(ROOT, ...relative.split('/'));
    if (!fs.existsSync(script) || !fs.statSync(script).isFile()) {
      const message = `required routine test is missing: ${relative}`;
      console.error(`FAIL: ${message}`);
      failures.push({ name, message });
      continue;
    }
    const result = childProcess.spawnSync(process.execPath, [script], {
      cwd: ROOT,
      stdio: 'inherit',
      windowsHide: true,
    });
    if (result.error) {
      const message = `could not start: ${result.error.message}`;
      console.error(`FAIL: ${name} ${message}`);
      failures.push({ name, message });
    } else if (result.status !== 0) {
      const message = result.signal
        ? `terminated by signal ${result.signal}`
        : `exited with status ${result.status}`;
      console.error(`FAIL: ${name} ${message}`);
      failures.push({ name, message });
    } else {
      console.log(`PASS: ${name}`);
    }
  }

  const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log('');
  if (failures.length === 0) {
    console.log(`Routine tooling tests passed: ${ROUTINE_TESTS.length}/${ROUTINE_TESTS.length} suites in ${elapsedSeconds}s`);
    return;
  }
  console.error(`Routine tooling tests failed: ${failures.length}/${ROUTINE_TESTS.length} suites in ${elapsedSeconds}s`);
  for (const failure of failures) console.error(`- ${failure.name}: ${failure.message}`);
  process.exitCode = 1;
}

if (require.main === module) main();

module.exports = { ROUTINE_TESTS };
