#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  CONFIG_PATH,
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
  writeJson,
  writeLayout,
  writeObjectManifest,
} = require('./lib/phase8_matching_c');

function usage() {
  console.log('Usage: node tools/build_phase8_matching_c.js --output <empty-external-dir> --phase7-output <verified-phase7-dir> --compiler <accepted-cc1.exe> --splat-python <python.exe> --splat-split <split.py> --asm-differ <checkout>');
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
  const replacement = copyPhase7Objects(
    phase8,
    phase7,
    args.output,
    runtime.tools['mips64-elf-objcopy.exe'].path,
  );
  const compiled = compileTarget(
    phase8,
    args.output,
    args.compiler,
    runtime.tools['mips64-elf-as.exe'].path,
  );
  const objectManifest = writeObjectManifest(
    args.output,
    replacement.linkedObjects,
    phase8,
    replacement,
    compiled,
  );
  writeLayout(phase8, phase7, args.output);
  const linked = linkPhase8(phase8, args.output, objectManifest, runtime.tools);
  const verification = verifyPhase8Output(phase8, {
    output: args.output,
    asmDifferRoot: args.asmDifferRoot,
    splatPython: args.splatPython,
    objdump: runtime.tools['mips64-elf-objdump.exe'].path,
  });

  const report = {
    schemaVersion: 1,
    status: 'pass',
    generator: 'tools/build_phase8_matching_c.js',
    acceptedInputs: {
      phase7Model: phase8.model.inputFiles,
      phase8Config: { bytes: fs.statSync(CONFIG_PATH).size, sha256: sha256File(CONFIG_PATH) },
      cSource: { path: phase8.target.source, bytes: fs.statSync(path.join(ROOT, phase8.target.source)).size, sha256: phase8.target.sourceSha256 },
      originalAssembly: { path: phase8.target.originalAssembly, sha256: phase8.target.originalAssemblySha256 },
      phase6CompilerManifest: { path: phase8.config.compiler.manifest, sha256: phase8.config.compiler.manifestSha256 },
    },
    runtime: pathIndependentRuntime(runtime),
    compiler: { ...compiler, usedToBuildTarget: true },
    basePhase7: phase7.identity,
    targetReplacement: {
      symbol: phase8.target.symbol,
      rowIndex: phase8.target.rowIndex,
      primaryId: phase8.target.primaryId,
      sectionName: phase8.target.sectionName,
      source: phase8.target.source,
      sourceSha256: phase8.target.sourceSha256,
      originalAssemblyFallback: phase8.target.originalAssembly,
      originalAssemblySha256: phase8.target.originalAssemblySha256,
      fallbackObject: replacement.fallbackRelative,
      fallbackObjectSha256: replacement.fallbackSha256,
      prunedAssemblyObject: replacement.linkedChunkRelative,
      prunedAssemblyObjectSha256: replacement.prunedSha256,
      preservedTargetChunkSections: replacement.preservedTargetChunkSections,
      cObject: compiled.objectRelative,
      cObjectSha256: compiled.objectSha256,
      compilerAssembly: compiled.compilerAssemblyRelative,
      compilerAssemblySha256: compiled.compilerAssemblySha256,
      linkedAssembly: compiled.linkedAssemblyRelative,
      linkedAssemblySha256: compiled.linkedAssemblySha256,
      objectTextSha256: compiled.textSha256,
      linkedTextSha256: verification.target.textSha256,
      relocations: compiled.relocations,
    },
    objects: {
      linkedObjects: objectManifest.linkedObjects.length,
      manifest: { path: 'objects/manifest.json', bytes: objectManifest.bytes, sha256: objectManifest.sha256 },
    },
    linker: {
      flags: phase8.model.config.binutils.linkerFlags,
      scriptSha256: sha256File(linked.linkerScript),
      responseSha256: sha256File(linked.responseFile),
      readelfSha256: sha256File(linked.readelfFile),
    },
    verification,
  };
  writeJson(path.join(args.output, 'build-report.json'), report);
  console.log(`Phase 8 matching C build: PASS (${verification.outputs.rom.sha256})`);
  console.log(`Target: ${phase8.target.symbol} ${phase8.target.romStart}-${phase8.target.romEndExclusive}`);
  console.log(`ELF: ${linked.elfFile}`);
  console.log(`Map: ${linked.mapFile}`);
  console.log(`ROM: ${linked.romFile}`);
}

main();
