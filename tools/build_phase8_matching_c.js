#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  CONFIG_PATH,
  LINKAGE_CONFIG_PATH,
  ROOT,
  assertBuildLocations,
  compileTarget,
  copyPhase7Objects,
  fail,
  linkPhase8,
  loadPhase8Model,
  pathIndependentRuntime,
  sha256File,
  verifyCompiler,
  verifyPhase7Input,
  verifyPhase8Output,
  verifyRuntimeTools,
  writeSourceObjectProofs,
  writeJson,
  writeLayout,
  writeObjectManifest,
} = require('./lib/phase8_matching_c');
const {
  POLICY_CONFIG_PATH,
  classifyTargetSources,
} = require('./lib/source_policy');

function usage() {
  console.log('Usage: node tools/build_phase8_matching_c.js --output <empty-external-dir> --phase7-output <verified-phase7-dir> --compiler <accepted-cc1.exe> --splat-python <python.exe> --splat-split <split.py> --asm-differ <checkout> [--powershell-runtime-root <pinned-windows-runtime>]');
}

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) fail(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function parseArgs() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    process.exit(0);
  }
  return {
    output: value('--output'),
    phase7Output: value('--phase7-output'),
    compiler: value('--compiler'),
    powershellRuntimeRoot: process.argv.includes('--powershell-runtime-root') ? value('--powershell-runtime-root') : null,
    splatPython: value('--splat-python'),
    splatSplit: value('--splat-split'),
    asmDifferRoot: value('--asm-differ'),
  };
}

function main() {
  const args = parseArgs();
  assertBuildLocations(args.output, args.phase7Output);
  const phase8 = loadPhase8Model();
  const runtime = verifyRuntimeTools(phase8.model, args);
  const compiler = verifyCompiler(phase8, args.compiler);
  const phase7 = verifyPhase7Input(phase8, args.phase7Output);
  const sourcePolicy = classifyTargetSources(phase8.targets);
  const classificationBySymbol = new Map(sourcePolicy.targets.map((record) => [record.symbol, record]));
  const replacement = copyPhase7Objects(
    phase8,
    phase7,
    args.output,
    runtime.tools['mips-kmc-elf-objcopy.exe'].path,
  );
  const compiled = new Map();
  for (const target of phase8.targets) {
    compiled.set(target.symbol, compileTarget(
      phase8,
      target,
      args.output,
      args.compiler,
      runtime.tools['mips-kmc-elf-as.exe'].path,
      runtime.tools['mips-kmc-elf-objcopy.exe'].path,
      { classification: classificationBySymbol.get(target.symbol) },
    ));
  }
  const objectManifest = writeObjectManifest(
    args.output,
    replacement.linkedObjects,
    phase8,
    replacement.replacements,
    compiled,
  );
  writeLayout(phase8, phase7, args.output, replacement.replacements);
  const linked = linkPhase8(phase8, args.output, objectManifest, runtime.tools);
  const sourceObjectProofs = writeSourceObjectProofs(phase8, {
    output: args.output,
    compiled,
    sourcePolicy,
  });
  const verification = verifyPhase8Output(phase8, {
    output: args.output,
    asmDifferRoot: args.asmDifferRoot,
    splatPython: args.splatPython,
    objdump: runtime.tools['mips-kmc-elf-objdump.exe'].path,
    objcopy: runtime.tools['mips-kmc-elf-objcopy.exe'].path,
    replacements: replacement.replacements,
  });

  const targetReplacements = phase8.targets.map((target) => {
    const compiledTarget = compiled.get(target.symbol);
    const chunkReplacement = replacement.replacements.get(target.chunkIndex);
    const verifiedTarget = verification.targets.find((item) => item.symbol === target.symbol);
    return {
      symbol: target.symbol,
      rowIndex: target.rowIndex,
      primaryId: target.primaryId,
      sectionName: target.sectionName,
      source: target.source,
      sourceSha256: target.sourceSha256,
      originalAssemblyFallback: target.originalAssembly,
      originalAssemblySha256: target.originalAssemblySha256,
      fallbackObject: chunkReplacement.fallbackRelative,
      fallbackObjectSha256: chunkReplacement.fallbackSha256,
      prunedAssemblyObject: chunkReplacement.linkedChunkRelative,
      prunedAssemblyObjectSha256: chunkReplacement.prunedSha256,
      preservedTargetChunkSections: chunkReplacement.preservedTargetChunkSections,
      cObject: compiledTarget.objectRelative,
      cObjectSha256: compiledTarget.objectSha256,
      sourceObject: compiledTarget.proofObjectRelative,
      sourceObjectSha256: compiledTarget.proofObjectSha256,
      compilerAssembly: compiledTarget.compilerAssemblyRelative,
      compilerAssemblySha256: compiledTarget.compilerAssemblySha256,
      linkedAssembly: compiledTarget.linkedAssemblyRelative,
      linkedAssemblySha256: compiledTarget.linkedAssemblySha256,
      sourceClass: compiledTarget.sourceClass,
      sourcePolicyDigest: compiledTarget.sourcePolicyDigest,
      compilerAssemblyRewritten: compiledTarget.compilerAssemblyRewritten,
      sourceObjectProof: {
        path: sourceObjectProofs.get(target.symbol).path,
        bytes: sourceObjectProofs.get(target.symbol).bytes,
        sha256: sourceObjectProofs.get(target.symbol).sha256,
      },
      objectTextSha256: compiledTarget.textSha256,
      linkedTextSha256: verifiedTarget.textSha256,
      compilerTextFunctions: compiledTarget.compilerTextFunctions,
      relocations: compiledTarget.relocations,
      auxiliarySections: compiledTarget.auxiliarySections,
      auxiliaryTails: chunkReplacement.auxiliaryTails.filter((tail) => tail.symbol === target.symbol),
    };
  });

  const report = {
    schemaVersion: 3,
    status: 'pass',
    generator: 'tools/build_phase8_matching_c.js',
    acceptedInputs: {
      phase7Model: phase8.model.inputFiles,
      phase8Config: { bytes: fs.statSync(CONFIG_PATH).size, sha256: sha256File(CONFIG_PATH) },
      linkageConfig: {
        path: path.relative(ROOT, LINKAGE_CONFIG_PATH).replace(/\\/g, '/'),
        bytes: fs.statSync(LINKAGE_CONFIG_PATH).size,
        sha256: sha256File(LINKAGE_CONFIG_PATH),
      },
      gnuBinutils26: {
        manifestPath: phase8.toolchain.identity.manifestPath,
        manifestSha256: phase8.toolchain.identity.manifestSha256,
        buildProvenancePath: phase8.toolchain.identity.buildProvenancePath,
        buildProvenanceSha256: phase8.toolchain.identity.buildProvenanceSha256,
      },
      sourcePolicy: {
        path: path.relative(ROOT, POLICY_CONFIG_PATH).replace(/\\/g, '/'),
        bytes: fs.statSync(POLICY_CONFIG_PATH).size,
        sha256: sha256File(POLICY_CONFIG_PATH),
      },
      cSources: phase8.targets.map((target) => ({ path: target.source, bytes: fs.statSync(path.join(ROOT, target.source)).size, sha256: target.sourceSha256 })),
      originalAssemblies: phase8.targets.map((target) => ({ path: target.originalAssembly, sha256: target.originalAssemblySha256 })),
      phase6CompilerManifest: { path: phase8.config.compiler.manifest, sha256: phase8.config.compiler.manifestSha256 },
    },
    runtime: pathIndependentRuntime(runtime),
    compiler: { ...compiler, usedToBuildTarget: true },
    sourcePolicy: {
      schemaVersion: sourcePolicy.schemaVersion,
      status: sourcePolicy.status,
      preprocessor: sourcePolicy.preprocessor,
      counts: sourcePolicy.counts,
      bytes: sourcePolicy.bytes,
      targets: sourcePolicy.targets,
    },
    sourceObjectEvidence: verification.sourceObjectEvidence,
    basePhase7: phase7.identity,
    targetReplacements,
    objects: {
      linkedObjects: objectManifest.linkedObjects.length,
      manifest: { path: 'objects/manifest.json', bytes: objectManifest.bytes, sha256: objectManifest.sha256 },
    },
    linker: {
      flags: phase8.model.config.binutils.linkerFlags,
      scriptSha256: sha256File(linked.linkerScript),
      responseSha256: sha256File(linked.responseFile),
      elfReportSha256: sha256File(linked.elfReportFile),
    },
    verification,
  };
  writeJson(path.join(args.output, 'build-report.json'), report);
  console.log(`Phase 8 matching C build: PASS (${verification.outputs.rom.sha256})`);
  console.log(`Targets: ${phase8.targets.map((target) => target.symbol).join(', ')}`);
  console.log(`ELF: ${linked.elfFile}`);
  console.log(`Map: ${linked.mapFile}`);
  console.log(`ROM: ${linked.romFile}`);
}

main();
