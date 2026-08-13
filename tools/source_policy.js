#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  SOURCE_CLASSES,
  classifySource,
  preprocessorIdentity,
  resolvePreprocessor,
} = require('./lib/source_policy');

function usage() {
  console.log('Usage: node tools/source_policy.js [--target <symbol>]');
}

function parseArgs(argv) {
  let target = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') return { help: true, target: null };
    if (arg !== '--target') throw new Error(`unknown argument: ${arg}`);
    if (target !== null || !argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error('invalid --target argument');
    target = argv[++index];
  }
  return { help: false, target };
}

function loadTargetEntries() {
  const minimal = path.join(ROOT, 'config', 'matching-c-targets.json');
  const legacy = path.join(ROOT, 'config', 'phase8', 'matching-c.json');
  const config = JSON.parse(fs.readFileSync(fs.existsSync(minimal) ? minimal : legacy, 'utf8'));
  if (!Array.isArray(config.targets) || config.targets.length === 0) throw new Error('active target configuration is empty');
  return config.targets.map((target) => ({ symbol: target.symbol, source: target.source }));
}

function selectTargets(targets, requested) {
  if (!requested) return targets;
  const matches = targets.filter((target) => target.symbol.toLowerCase() === requested.toLowerCase());
  if (matches.length !== 1) throw new Error(`target does not resolve uniquely: ${requested}`);
  return matches;
}

function writeReport(results, preprocessor) {
  const outputRoot = path.join(ROOT, 'build', 'source-policy');
  fs.mkdirSync(outputRoot, { recursive: true });
  const counts = Object.fromEntries(Object.values(SOURCE_CLASSES).map((name) => [name, results.filter((item) => item.class === name).length]));
  const report = {
    schemaVersion: 2,
    status: counts.UNKNOWN === 0 ? 'pass' : 'unknown',
    preprocessor: preprocessorIdentity(preprocessor),
    counts,
    targets: results,
  };
  const output = path.join(outputRoot, 'report.json');
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  return { output, report };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    usage();
    return;
  }
  const preprocessor = resolvePreprocessor();
  const targets = selectTargets(loadTargetEntries(), args.target);
  const results = targets.map((target) => ({ symbol: target.symbol, ...classifySource(target.source, { preprocessor }) }));
  const { output, report } = writeReport(results, preprocessor);
  console.log('OB64 Source Policy');
  console.log('');
  for (const result of results) console.log(`${result.symbol.padEnd(24)} ${result.class}`);
  console.log('');
  for (const name of Object.values(SOURCE_CLASSES)) console.log(`${name.padEnd(10)} ${report.counts[name]}`);
  console.log(`Report: ${output}`);
  if (report.counts.UNKNOWN > 0) process.exitCode = 1;
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Source policy failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { loadTargetEntries, main, parseArgs, selectTargets, writeReport };
