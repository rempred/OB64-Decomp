#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  assertBuildLocations,
  copyPhase7Objects,
  linkPhase8,
  pathIndependentRuntime,
  runTargetAsmDiffer,
  sha256File,
  verifyCompiler,
  verifyPhase7Input,
  verifyRuntimeTools,
  writeLayout,
  writeObjectManifest,
} = require('./lib/phase8_matching_c');
const {
  IMPLEMENTATION_FILES,
  compileDiffTargets,
  sha256Value,
} = require('./lib/diff_object_cache');
const {
  createDiffProfiler,
  profileOutputPath,
  writeProfileReport,
} = require('./lib/diff_profile');
const {
  ensureBaseline,
  prepareContext,
  writeJson,
} = require('./lib/current_workflow');

function usage() {
  console.log('Usage: node tools/diff.js [--profile] <symbol>');
}

function parseArguments(argv) {
  if (!Array.isArray(argv)) throw new Error('diff arguments are malformed');
  if (argv.length === 1 && (argv[0] === '--help' || argv[0] === '-h')) return { command: 'help' };
  let profile = false;
  let symbol = null;
  for (const argument of argv) {
    if (argument === '--profile') {
      if (profile) throw new Error('--profile may be specified only once');
      profile = true;
    } else if (typeof argument === 'string' && argument.startsWith('--')) {
      throw new Error(`unknown option: ${argument}`);
    } else if (symbol !== null) {
      throw new Error('one target symbol is required');
    } else {
      symbol = argument;
    }
  }
  if (typeof symbol !== 'string' || symbol.length === 0) throw new Error('one target symbol is required');
  return { command: 'diff', profile, symbol };
}

function selectTarget(phase8, symbol) {
  const matches = phase8.targets.filter((target) => target.symbol.toLowerCase() === symbol.toLowerCase());
  if (matches.length !== 1) throw new Error(`target does not resolve uniquely: ${symbol}`);
  return matches[0];
}

function prepareContextOptions(symbol, profiler = null) {
  const options = { allowMissingRelocationContracts: [symbol] };
  if (profiler) options.profile = profiler;
  return options;
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

function fileIdentity(relative) {
  const file = path.join(ROOT, ...relative.split('/'));
  const status = fs.lstatSync(file);
  if (!status.isFile() || status.isSymbolicLink()) {
    throw new Error(`profile implementation identity is not a regular file: ${relative}`);
  }
  return { path: relative, bytes: status.size, sha256: sha256File(file) };
}

function profileMetadata(options) {
  const {
    baseline,
    compilerIdentity,
    comparison,
    context,
    output,
    profileFile,
    relocationContractMatches,
    reportFile,
    runtime,
    sourcePolicy,
    target,
    targetCompilation,
    targetSourcePolicy,
  } = options;
  const sourceRecords = sourcePolicy.targets.map((record) => ({
    symbol: record.symbol,
    source: record.source,
    sourceBytes: record.sourceBytes,
    sourceSha256: record.sourceSha256,
    preprocessedSha256: record.preprocessedSha256,
    compilationInput: record.compilationInput,
    dependencies: record.dependencies,
    class: record.class,
    digest: record.digest,
  })).sort((left, right) => left.symbol.localeCompare(right.symbol));
  const cacheEntries = targetCompilation.cache.entries.map((entry) => ({
    symbol: entry.symbol,
    status: entry.status,
    key: entry.key,
    reason: entry.reason,
  })).sort((left, right) => left.symbol.localeCompare(right.symbol));
  const cacheKeys = cacheEntries.filter((entry) => entry.key !== null)
    .map((entry) => ({ symbol: entry.symbol, key: entry.key }));
  return {
    target: {
      symbol: target.symbol,
      source: target.source,
      sourceClass: targetSourcePolicy.class,
      sourcePolicyDigest: targetSourcePolicy.digest,
    },
    fingerprints: {
      baseline: context.baselineFingerprint,
      current: context.currentFingerprint,
    },
    baseline: {
      reused: baseline.reused,
      phase7Output: baseline.phase7Output,
      rom: baseline.rom,
    },
    tools: {
      compiler: compilerIdentity,
      runtime: pathIndependentRuntime(runtime),
      toolchain: context.phase8.toolchain.identity,
    },
    sourcePolicy: {
      schemaVersion: sourcePolicy.schemaVersion,
      status: sourcePolicy.status,
      targetCount: sourceRecords.length,
      counts: sourcePolicy.counts,
      bytes: sourcePolicy.bytes,
      preprocessor: sourcePolicy.preprocessor,
      targetIdentityDigest: sha256Value(sourceRecords),
    },
    objectCache: {
      schemaVersion: targetCompilation.cache.schemaVersion,
      root: targetCompilation.cache.root,
      requestedFresh: targetCompilation.cache.requestedFresh,
      hits: targetCompilation.cache.hits,
      misses: targetCompilation.cache.misses,
      rebuilt: targetCompilation.cache.rebuilt,
      compilerInvocations: targetCompilation.cache.compilerInvocations,
      keyCount: cacheKeys.length,
      keyDigest: sha256Value(cacheKeys),
      entryDigest: sha256Value(cacheEntries),
    },
    implementation: IMPLEMENTATION_FILES.map(fileIdentity),
    outcome: {
      exact: comparison.exact,
      asmDifferPairwiseExact: comparison.asmDifferPairwiseExact,
      rawBytesExact: comparison.rawBytesExact,
      currentScore: comparison.currentScore,
      maxScore: comparison.maxScore,
      differingByteCount: comparison.differingByteCount,
      differingInstructionWordCount: comparison.differingInstructionWordCount,
      linkedTargetSha256: comparison.linkedTargetSha256,
      expectedTargetSha256: comparison.expectedTargetSha256,
      relocationContractMatches,
    },
    artifacts: {
      output,
      diffReport: { path: reportFile, sha256: sha256File(reportFile) },
      timingReport: profileFile,
    },
  };
}

function seconds(milliseconds) {
  return (milliseconds / 1000).toFixed(3);
}

function printSummary(options) {
  const {
    candidateRelocations,
    comparison,
    relocationContractMatches,
    reportFile,
    target,
    targetCompilation,
    targetSourcePolicy,
  } = options;
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
  console.log(`Relocation contract ........ ${target.relocationContractSource === 'missing-diff-only' ? 'MISSING' : relocationContractMatches ? 'MATCH' : 'DIFFERS'}`);
  console.log(`Sibling object cache ....... ${targetCompilation.cache.hits} hit / ${targetCompilation.cache.misses} miss / ${targetCompilation.cache.rebuilt} rebuilt`);
  console.log(`Compiler invocations ....... ${targetCompilation.cache.compilerInvocations} (requested target always fresh)`);
  if (!relocationContractMatches) {
    console.log('Candidate relocations .......');
    console.log(JSON.stringify(candidateRelocations, null, 2));
  }
  console.log(`Report ..................... ${reportFile}`);
}

function main(argv = process.argv.slice(2)) {
  const parsed = parseArguments(argv);
  if (parsed.command === 'help') {
    usage();
    return;
  }

  const profiler = parsed.profile ? createDiffProfiler() : null;
  const measure = profiler ? profiler.measure : (_name, callback) => callback();
  let profileFile = null;
  let profileFinished = false;
  let target = null;
  let output = null;
  if (profiler) profiler.installChildProcessObserver();

  try {
    const context = measure('prepare-context', () => prepareContext(
      prepareContextOptions(parsed.symbol, profiler),
    ));
    target = measure('select-target', () => selectTarget(context.phase8, parsed.symbol));
    if (profiler) profileFile = profileOutputPath(ROOT, target.symbol, profiler.startedAt);
    const baseline = measure('ensure-baseline', () => ensureBaseline(context, {
      onStep: (message) => console.log(`${message}...`),
    }));
    measure('initialize-output', () => {
      const suffix = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
      output = path.join(context.localTools.workRoot, 'diff', `${target.symbol}-${suffix}`);
      assertBuildLocations(output, baseline.phase7Output);
    });

    measure('print-start', () => console.log(`Compiling ${target.symbol}...`));
    const runtimeOptions = {
      powershellRuntimeRoot: context.localTools.powershellRuntimeRoot,
      splatPython: context.localTools.splatPython,
      splatSplit: context.localTools.splatSplit,
      asmDifferRoot: context.localTools.asmDifferRoot,
    };
    const runtime = measure('verify-runtime-tools', () => verifyRuntimeTools(context.phase8.model, runtimeOptions));
    const compilerIdentity = measure('verify-compiler', () => verifyCompiler(
      context.phase8,
      context.localTools.compiler,
    ));
    const sourcePolicy = measure('classify-target-sources', () => context.sourcePolicy);
    const classificationBySymbol = new Map(sourcePolicy.targets.map((record) => [record.symbol, record]));
    const phase7 = measure('verify-phase7-input', () => verifyPhase7Input(
      context.phase8,
      baseline.phase7Output,
    ));
    const replacement = measure('copy-phase7-objects', () => copyPhase7Objects(
      context.phase8,
      phase7,
      output,
      runtime.tools['mips-kmc-elf-objcopy.exe'].path,
    ));
    const targetCompilation = measure('compile-diff-targets', () => compileDiffTargets({
      phase8: context.phase8,
      requestedTarget: target,
      output,
      compiler: context.localTools.compiler,
      assemblerPath: runtime.tools['mips-kmc-elf-as.exe'].path,
      objcopyPath: runtime.tools['mips-kmc-elf-objcopy.exe'].path,
      verifiedCompiler: compilerIdentity,
      assembler: runtime.tools['mips-kmc-elf-as.exe'],
      objcopy: runtime.tools['mips-kmc-elf-objcopy.exe'],
      preprocessor: sourcePolicy.preprocessor,
      classificationBySymbol,
      profile: profiler,
    }));
    const { compiled } = targetCompilation;
    const objectManifest = measure('write-object-manifest', () => writeObjectManifest(
      output,
      replacement.linkedObjects,
      context.phase8,
      replacement.replacements,
      compiled,
    ));
    measure('link-phase8', () => linkPhase8(context.phase8, output, objectManifest, runtime.tools));
    measure('write-layout', () => writeLayout(
      context.phase8,
      phase7,
      output,
      replacement.replacements,
    ));
    const comparison = measure('compare-target', () => runTargetAsmDiffer(context.phase8, target, {
      output,
      asmDifferRoot: context.localTools.asmDifferRoot,
      python: context.localTools.splatPython,
      objdump: runtime.tools['mips-kmc-elf-objdump.exe'].path,
      objcopy: runtime.tools['mips-kmc-elf-objcopy.exe'].path,
      relocations: compiled.get(target.symbol).relocations,
      requireExact: false,
    }));
    const targetSourcePolicy = classificationBySymbol.get(target.symbol);
    const candidateRelocations = compiled.get(target.symbol).relocations;
    const relocationContractMatches = target.relocationContractSource !== 'missing-diff-only'
      && JSON.stringify(candidateRelocations) === JSON.stringify(target.expectedRelocations);
    const report = measure('build-diff-report', () => ({
      schemaVersion: 5,
      symbol: target.symbol,
      source: target.source,
      sourceClass: targetSourcePolicy.class,
      sourcePolicyDigest: targetSourcePolicy.digest,
      compilationInput: targetSourcePolicy.compilationInput,
      dependencies: targetSourcePolicy.dependencies,
      toolchain: context.phase8.toolchain.identity,
      objectCache: targetCompilation.cache,
      output,
      object: compiled.get(target.symbol),
      ...require('./lib/text_contract').recordsForTarget(target, output, require('./lib/phase8_matching_c').loadCanonicalBaserom(context.phase8)),
      relocationContract: {
        source: target.relocationContractSource,
        matches: relocationContractMatches,
        accepted: target.relocationContractSource === 'missing-diff-only' ? null : target.expectedRelocations,
        candidate: candidateRelocations,
      },
      comparison,
    }));
    const reportFile = path.join(ROOT, 'build', 'diff', `${target.symbol}.json`);
    measure('write-diff-report', () => writeJson(reportFile, report));
    measure('print-summary', () => printSummary({
      candidateRelocations,
      comparison,
      relocationContractMatches,
      reportFile,
      target,
      targetCompilation,
      targetSourcePolicy,
    }));

    if (profiler) {
      const metadata = measure('profile-metadata', () => profileMetadata({
        baseline,
        compilerIdentity,
        comparison,
        context,
        output,
        profileFile,
        relocationContractMatches,
        reportFile,
        runtime,
        sourcePolicy,
        target,
        targetCompilation,
        targetSourcePolicy,
      }));
      const timingReport = profiler.finish({ status: 'pass', ...metadata });
      profileFinished = true;
      writeProfileReport(profileFile, timingReport);
      console.log(`Timing profile .............. ${profileFile}`);
      console.log(`Profiled wall time .......... ${seconds(timingReport.totalMs)} s`);
      console.log(`Child-process wall time ..... ${seconds(timingReport.childProcessMs)} s`);
    }
    return report;
  } catch (error) {
    if (profiler && !profileFinished) {
      try {
        const timingReport = profiler.finish({
          status: 'error',
          target: target ? { symbol: target.symbol, source: target.source } : { requestedSymbol: parsed.symbol },
          output,
          error: { name: error.name, message: error.message },
        });
        profileFinished = true;
        if (profileFile) {
          writeProfileReport(profileFile, timingReport);
          error.diffProfileFile = profileFile;
        }
      } catch (profileError) {
        profiler.restoreChildProcessObserver();
        error.diffProfileError = profileError.message;
      }
    }
    throw error;
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('Diff status ................. ERROR');
    console.error(`Diff failed: ${error.message}`);
    if (error.diffProfileFile) console.error(`Timing profile: ${error.diffProfileFile}`);
    if (error.diffProfileError) console.error(`Timing profile failed: ${error.diffProfileError}`);
    process.exitCode = 1;
  }
}

module.exports = { comparisonLabel, main, parseArguments, prepareContextOptions, selectTarget };
