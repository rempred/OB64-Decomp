#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const path = require('path');
const {
  ROOT,
  assertBuildLocations,
  compileTarget,
  copyPhase7Objects,
  linkPhase8,
  runTargetAsmDiffer,
  verifyCompiler,
  verifyPhase7Input,
  verifyRuntimeTools,
  writeLayout,
  writeObjectManifest,
} = require('./lib/phase8_matching_c');
const { classifySource, resolvePreprocessor } = require('./lib/source_policy');
const {
  ensureBaseline,
  prepareContext,
  writeJson,
} = require('./lib/current_workflow');

function usage() {
  console.log('Usage: node tools/diff.js <symbol>');
}

function selectTarget(phase8, symbol) {
  const matches = phase8.targets.filter((target) => target.symbol.toLowerCase() === symbol.toLowerCase());
  if (matches.length !== 1) throw new Error(`target does not resolve uniquely: ${symbol}`);
  return matches[0];
}

function main(argv = process.argv.slice(2)) {
  if (argv.length === 1 && (argv[0] === '--help' || argv[0] === '-h')) {
    usage();
    return;
  }
  if (argv.length !== 1 || argv[0].startsWith('--')) throw new Error('one target symbol is required');
  const context = prepareContext();
  const target = selectTarget(context.phase8, argv[0]);
  const baseline = ensureBaseline(context, { onStep: (message) => console.log(`${message}...`) });
  const suffix = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
  const output = path.join(context.localTools.workRoot, 'diff', `${target.symbol}-${suffix}`);
  assertBuildLocations(output, baseline.phase7Output);

  console.log(`Compiling ${target.symbol}...`);
  const runtimeOptions = {
    splatPython: context.localTools.splatPython,
    splatSplit: context.localTools.splatSplit,
    asmDifferRoot: context.localTools.asmDifferRoot,
  };
  const runtime = verifyRuntimeTools(context.phase8.model, runtimeOptions);
  verifyCompiler(context.phase8, context.localTools.compiler);
  const phase7 = verifyPhase7Input(context.phase8, baseline.phase7Output);
  const replacement = copyPhase7Objects(
    context.phase8,
    phase7,
    output,
    runtime.tools['mips64-elf-objcopy.exe'].path,
  );
  const compiled = new Map();
  for (const candidate of context.phase8.targets) {
    compiled.set(candidate.symbol, compileTarget(
      context.phase8,
      candidate,
      output,
      context.localTools.compiler,
      runtime.tools['mips64-elf-as.exe'].path,
      { enforceAcceptedContract: candidate.symbol !== target.symbol },
    ));
  }
  const objectManifest = writeObjectManifest(output, replacement.linkedObjects, context.phase8, replacement.replacements, compiled);
  writeLayout(context.phase8, phase7, output, replacement.replacements);
  linkPhase8(context.phase8, output, objectManifest, runtime.tools);
  const comparison = runTargetAsmDiffer(context.phase8, target, {
    output,
    asmDifferRoot: context.localTools.asmDifferRoot,
    python: context.localTools.splatPython,
    objdump: runtime.tools['mips64-elf-objdump.exe'].path,
    objcopy: runtime.tools['mips64-elf-objcopy.exe'].path,
    relocations: compiled.get(target.symbol).relocations,
    requireExact: false,
  });
  const sourcePolicy = classifySource(target.source, { preprocessor: resolvePreprocessor() });
  const report = {
    schemaVersion: 1,
    symbol: target.symbol,
    source: target.source,
    sourceClass: sourcePolicy.class,
    output,
    object: compiled.get(target.symbol),
    comparison,
  };
  const reportFile = path.join(ROOT, 'build', 'diff', `${target.symbol}.json`);
  writeJson(reportFile, report);

  console.log('');
  console.log(`${target.symbol} ........ ${comparison.exact ? 'EXACT' : 'DIFFERS'}`);
  console.log(`Source class ............... ${sourcePolicy.class}`);
  console.log(`Score ...................... ${comparison.currentScore} / ${comparison.maxScore}`);
  console.log(`Report ..................... ${reportFile}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Diff failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { main, selectTarget };
