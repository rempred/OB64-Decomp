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
const { classifyTargetSources } = require('./lib/source_policy');
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

function comparisonLabel(comparison) {
  if (!comparison
      || typeof comparison.exact !== 'boolean'
      || typeof comparison.asmDifferPairwiseExact !== 'boolean'
      || typeof comparison.rawBytesExact !== 'boolean') {
    throw new Error('target comparison result is malformed');
  }
  if (comparison.exact !== (comparison.asmDifferPairwiseExact && comparison.rawBytesExact)) {
    throw new Error('target comparison exactness is inconsistent');
  }
  if (comparison.exact) return 'EXACT';
  if (comparison.asmDifferPairwiseExact && !comparison.rawBytesExact) return 'RAW BYTES DIFFER';
  return 'DIFFERS';
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
  const sourcePolicy = classifyTargetSources(context.phase8.targets);
  const classificationBySymbol = new Map(sourcePolicy.targets.map((record) => [record.symbol, record]));
  const phase7 = verifyPhase7Input(context.phase8, baseline.phase7Output);
  const replacement = copyPhase7Objects(
    context.phase8,
    phase7,
    output,
    runtime.tools['mips-kmc-elf-objcopy.exe'].path,
  );
  const compiled = new Map();
  for (const candidate of context.phase8.targets) {
    compiled.set(candidate.symbol, compileTarget(
      context.phase8,
      candidate,
      output,
      context.localTools.compiler,
      runtime.tools['mips-kmc-elf-as.exe'].path,
      runtime.tools['mips-kmc-elf-objcopy.exe'].path,
      {
        enforceAcceptedContract: candidate.symbol !== target.symbol,
        classification: classificationBySymbol.get(candidate.symbol),
      },
    ));
  }
  const objectManifest = writeObjectManifest(output, replacement.linkedObjects, context.phase8, replacement.replacements, compiled);
  writeLayout(context.phase8, phase7, output, replacement.replacements);
  linkPhase8(context.phase8, output, objectManifest, runtime.tools);
  const comparison = runTargetAsmDiffer(context.phase8, target, {
    output,
    asmDifferRoot: context.localTools.asmDifferRoot,
    python: context.localTools.splatPython,
    objdump: runtime.tools['mips-kmc-elf-objdump.exe'].path,
    objcopy: runtime.tools['mips-kmc-elf-objcopy.exe'].path,
    relocations: compiled.get(target.symbol).relocations,
    requireExact: false,
  });
  const targetSourcePolicy = classificationBySymbol.get(target.symbol);
  const report = {
    schemaVersion: 3,
    symbol: target.symbol,
    source: target.source,
    sourceClass: targetSourcePolicy.class,
    sourcePolicyDigest: targetSourcePolicy.digest,
    toolchain: context.phase8.toolchain.identity,
    output,
    object: compiled.get(target.symbol),
    comparison,
  };
  const reportFile = path.join(ROOT, 'build', 'diff', `${target.symbol}.json`);
  writeJson(reportFile, report);

  console.log('');
  console.log(`${target.symbol} ........ ${comparisonLabel(comparison)}`);
  console.log(`Source class ............... ${targetSourcePolicy.class}`);
  console.log(`Score ...................... ${comparison.currentScore} / ${comparison.maxScore}`);
  console.log(`Decoded instruction rows ... ${comparison.asmDifferPairwiseExact ? 'EXACT' : 'DIFFER'}`);
  console.log(`Raw linked bytes ........... ${comparison.rawBytesExact ? 'EXACT' : 'DIFFER'}`);
  console.log(`Differing bytes ............ ${comparison.differingByteCount}`);
  console.log(`Differing instruction words  ${comparison.differingInstructionWordCount}`);
  console.log(`Linked target SHA-256 ...... ${comparison.linkedTargetSha256}`);
  console.log(`Expected target SHA-256 .... ${comparison.expectedTargetSha256}`);
  console.log(`Report ..................... ${reportFile}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('Diff status ................. ERROR');
    console.error(`Diff failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { comparisonLabel, main, selectTarget };
