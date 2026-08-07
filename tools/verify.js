#!/usr/bin/env node
'use strict';

const { SOURCE_CLASSES } = require('./lib/source_policy');
const {
  prepareContext,
  verifyCurrent,
} = require('./lib/current_workflow');

function usage() {
  console.log('Usage: node tools/verify.js [--target <symbol>] [--require-pure]');
}

function parseArgs(argv) {
  const result = { help: false, requirePure: false, target: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') result.help = true;
    else if (arg === '--require-pure') result.requirePure = true;
    else if (arg === '--target') {
      if (result.target || !argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error('invalid --target argument');
      result.target = argv[++index];
    } else throw new Error(`unknown argument: ${arg}`);
  }
  return result;
}

function selectPolicyTargets(report, requested) {
  if (!requested) return report.targets;
  const matches = report.targets.filter((target) => target.symbol.toLowerCase() === requested.toLowerCase());
  if (matches.length !== 1) throw new Error(`target does not resolve uniquely: ${requested}`);
  return matches;
}

function pureRequirementVerdict(selected, requirePure) {
  if (!requirePure) return { pass: true, classes: [...new Set(selected.map((target) => target.class))] };
  const rejected = selected.filter((target) => target.class !== SOURCE_CLASSES.PURE_C);
  return { pass: rejected.length === 0, rejected, classes: [...new Set(selected.map((target) => target.class))] };
}

function printLine(label, value) {
  console.log(`${label.padEnd(28, '.')} ${value}`);
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    usage();
    return;
  }
  console.log('OB64 Decomp Verification');
  console.log('');
  const context = prepareContext();
  if (args.target && !context.phase8.targets.some((target) => target.symbol.toLowerCase() === args.target.toLowerCase())) {
    throw new Error(`target does not resolve uniquely: ${args.target}`);
  }
  const result = verifyCurrent(context, { onStep: (message) => console.log(`${message}...`) });
  const policyInvalid = result.sourcePolicy.counts.UNKNOWN > 0 || result.sourcePolicy.counts.ASM > 0;
  const selected = selectPolicyTargets(result.sourcePolicy, args.target);
  const pureVerdict = pureRequirementVerdict(selected, args.requirePure);
  console.log('');
  printLine('Baserom identity ', 'PASS');
  printLine('Toolchain ', 'PASS');
  printLine('Source policy ', policyInvalid ? 'FAIL' : 'PASS');
  printLine('C linker ownership ', 'PASS');
  printLine('Target placement ', 'PASS');
  printLine('Relocations ', 'PASS');
  printLine('Target bytes ', 'EXACT');
  printLine('Full ROM ', 'EXACT');
  console.log('');
  printLine('PURE_C exact ', `${result.sourcePolicy.counts.PURE_C} functions / ${result.sourcePolicy.bytes.PURE_C} bytes`);
  printLine('HYBRID_C exact ', `${result.sourcePolicy.counts.HYBRID_C} functions / ${result.sourcePolicy.bytes.HYBRID_C} bytes`);
  if (result.sourcePolicy.counts.UNKNOWN > 0) printLine('UNKNOWN ', `${result.sourcePolicy.counts.UNKNOWN} functions`);
  if (args.target) printLine('Requested target ', `${selected[0].symbol} / ${selected[0].class}`);
  console.log('');
  if (policyInvalid) {
    console.log('RESULT: SOURCE POLICY FAILED');
    process.exitCode = 1;
  } else if (!pureVerdict.pass) {
    console.log(`RESULT: NOT MATCHING C (${pureVerdict.classes.join(', ')})`);
    process.exitCode = 1;
  } else if (args.requirePure) {
    console.log('RESULT: MATCHING C');
  } else {
    console.log('RESULT: EXACT BASELINE');
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Verification failed: ${error.message}`);
    console.error('RESULT: FAIL');
    process.exitCode = 1;
  }
}

module.exports = { main, parseArgs, pureRequirementVerdict, selectPolicyTargets };
