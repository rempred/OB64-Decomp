#!/usr/bin/env node
'use strict';

const path = require('path');
const retention = require('./lib/scratch_retention');

function parseArguments(args) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) return { help: true };
  const options = { inputs: { docs: [], memory: [], mail: [] } };
  for (let index = 0; index < args.length; index++) {
    const flag = args[index];
    if (flag === '--dry-run') continue;
    if (!['--root', '--docs', '--memory', '--mail'].includes(flag)) throw new Error(`unsupported argument: ${flag}; no apply operation exists`);
    const value = args[++index];
    if (!value || value.startsWith('--') || !path.isAbsolute(value)) throw new Error(`${flag} requires an absolute path`);
    if (flag === '--root') {
      if (options.root) throw new Error('duplicate root');
      options.root = value;
    } else options.inputs[flag.slice(2)].push(value);
  }
  if (!options.root) throw new Error('--root must identify the exact diff directory');
  return options;
}

function main(args = process.argv.slice(2)) {
  const options = parseArguments(args);
  if (options.help) {
    console.log('Usage: node tools/scratch-retention.js --root <absolute-diff-root> [--dry-run] [--docs <absolute-path>] [--memory <absolute-path>] [--mail <absolute-project-archive>]');
    console.log('Read-only inventory; run/byte limits warn only. Repeat reference options for complete coverage. Missing inputs are reported fail-closed. No apply/delete operation.');
    return;
  }
  const report = retention.inventory(options.root, options.inputs);
  console.log(JSON.stringify(report, null, 2));
  if (!report.inventoryComplete) process.exitCode = 2;
  return report;
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { parseArguments, main };
