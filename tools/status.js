#!/usr/bin/env node
'use strict';

const {
  classifyActiveTargets,
  currentVerificationState,
  prepareContext,
} = require('./lib/current_workflow');
const { summarizeAcceptedOwnership } = require('./lib/status_accounting');

function printLine(label, value) {
  console.log(`${label.padEnd(30, '.')} ${value}`);
}

function main() {
  const context = prepareContext();
  const policy = classifyActiveTargets(context.phase8);
  const verification = currentVerificationState(context);
  const ownership = summarizeAcceptedOwnership(context.model, context.phase8.targets);

  console.log('OB64 Decomp Status');
  console.log('');
  printLine('Retail ROM ', verification.exact ? 'EXACT' : 'NOT VERIFIED FOR CURRENT SOURCES');
  printLine('Exact PURE_C ', verification.exact ? `${policy.counts.PURE_C} functions / ${policy.bytes.PURE_C} bytes` : '0 functions / 0 bytes');
  printLine('Exact HYBRID_C ', verification.exact ? `${policy.counts.HYBRID_C} functions / ${policy.bytes.HYBRID_C} bytes` : '0 functions / 0 bytes');
  printLine('Assembly owners remaining ', `${ownership.assembly.owners} / ${ownership.assembly.bytes} bytes`);
  printLine('Other/data owners ', `${ownership.otherData.owners} / ${ownership.otherData.bytes} bytes`);
  printLine('UNKNOWN classifications ', policy.counts.UNKNOWN);
  if (!verification.exact) printLine('Classified active targets ', `${context.phase8.targets.length} (run node tools/verify.js)`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Status failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { main };
