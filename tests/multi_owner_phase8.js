#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  elfSectionBytes,
  parseElfFile,
  sha256Buffer,
  sha256File,
} = require('../tools/lib/phase7_conventional');
const {
  assertBuildLocations,
  compileTarget,
  copyPhase7Objects,
  linkPhase8,
  targetTextOwners,
  verifyCompiler,
  verifyPhase7Input,
  verifyPhase8Output,
  verifyRuntimeTools,
  verifyTargetMapOwner,
  writeLayout,
  writeObjectManifest,
  writeSourceObjectProofs,
} = require('../tools/lib/phase8_matching_c');
const {
  ensureBaseline,
  prepareContext,
} = require('../tools/lib/current_workflow');
const {
  SOURCE_CLASSES,
  classifyTargetSources,
} = require('../tools/lib/source_policy');

const SYMBOL = 'func_002A0EF0';
const GENERATED_SOURCE = 'build/multi-owner-phase8-test/func_002A0EF0_exact_fixture.c';

function hex(value) {
  return `0x${value.toString(16).toUpperCase().padStart(8, '0')}`;
}

function writeExactFixtureSource(canonicalBaserom, contract) {
  const bytes = canonicalBaserom.subarray(contract.romStartNumber, contract.romEndNumber);
  if (bytes.length !== contract.bytes || sha256Buffer(bytes) !== contract.expectedTextSha256) {
    throw new Error('canonical multi-owner fixture byte identity drift');
  }
  const assembly = [
    '.text',
    '.set noat',
    '.set noreorder',
    `.globl ${SYMBOL}`,
    `.type ${SYMBOL},@function`,
    `.ent ${SYMBOL}`,
    `${SYMBOL}:`,
  ];
  for (let offset = 0; offset < bytes.length; offset += 4) {
    assembly.push(`.word ${hex(bytes.readUInt32BE(offset))}`);
  }
  assembly.push(`.size ${SYMBOL},.-${SYMBOL}`, `.end ${SYMBOL}`, '');
  const source = `asm(${JSON.stringify(assembly.join('\n'))});\n`;
  const file = path.join(ROOT, ...GENERATED_SOURCE.split('/'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, source);
  return file;
}

function buildFixtureTarget(basePhase8, canonicalBaserom, sourceFile) {
  const contract = basePhase8.multiOwnerContracts.get(SYMBOL.toLowerCase());
  if (!contract || contract.rows.length !== 2 || contract.owners.length !== 2) {
    throw new Error('accepted multi-owner fixture contract is unavailable');
  }
  const rows = contract.rows;
  const owners = contract.owners;
  const first = rows[0];
  const last = rows[rows.length - 1];
  const firstSlice = first.slices[0];
  const lastSlice = last.slices[0];
  const source = path.relative(ROOT, sourceFile).replace(/\\/g, '/');
  return {
    symbol: SYMBOL,
    source,
    targetIndex: 0,
    primaryId: first.primaryId,
    rowIndex: first.index,
    chunkIndex: first.part.chunkIndex,
    originalAssembly: first.part.file,
    originalAssemblySha256: first.part.sha256,
    romStart: hex(first.romStart),
    romEndExclusive: hex(last.romEndExclusive),
    romStartNumber: first.romStart,
    romEndNumber: last.romEndExclusive,
    vramStart: hex(firstSlice.vramStart),
    vramEndExclusive: hex(lastSlice.vramEndExclusive),
    vramStartNumber: firstSlice.vramStart,
    vramEndNumber: lastSlice.vramEndExclusive,
    bytes: contract.bytes,
    sectionName: firstSlice.sectionName,
    textOwners: owners,
    multiOwner: true,
    multiOwnerContract: contract,
    overlayDescriptorId: null,
    descriptorRawSha256: null,
    expectedTextSha256: contract.expectedTextSha256,
    expectedRelocations: [],
    compilerTextFunctionsExplicit: false,
    compilerTextFunctions: [{
      symbol: SYMBOL,
      offset: '0x00000000',
      offsetNumber: 0,
      bytes: contract.bytes,
      binding: 'GLOBAL',
      entryEvidence: 'owner',
    }],
    auxiliarySections: [],
    relocationContractSource: 'generated-exact-structural-test-fixture',
    legacyAncillaryRelocations: [],
    sourceSha256: sha256File(sourceFile),
    descriptor: null,
    model: basePhase8.model,
    row: first,
    rows,
  };
}

function ownerSymbolEvidence(elf, target) {
  return targetTextOwners(target).map((owner, ownerIndex) => {
    const sections = elf.sections.filter((section) => section.name === owner.sectionName);
    const symbols = elf.symbols.filter((symbol) => symbol.name === owner.symbol);
    const expectedValue = owner.vramStartNumber;
    const expectedSize = ownerIndex === 0 ? target.bytes : 0;
    if (sections.length !== 1 || symbols.length !== 1
        || symbols[0].value !== expectedValue || symbols[0].size !== expectedSize
        || symbols[0].binding !== 1 || symbols[0].symbolType !== 2
        || symbols[0].sectionIndex !== sections[0].index) {
      throw new Error(`linked owner symbol semantics drift: ${owner.symbol}`);
    }
    return {
      name: owner.symbol,
      value: hex(symbols[0].value),
      size: symbols[0].size,
      binding: symbols[0].binding,
      type: symbols[0].symbolType,
      section: sections[0].name,
    };
  });
}

function main() {
  const context = prepareContext();
  const baseline = ensureBaseline(context);
  const contract = context.phase8.multiOwnerContracts.get(SYMBOL.toLowerCase());
  const sourceFile = writeExactFixtureSource(fs.readFileSync(context.baserom.path), contract);
  const target = buildFixtureTarget(context.phase8, fs.readFileSync(context.baserom.path), sourceFile);
  const phase8 = {
    ...context.phase8,
    compatibility: [],
    descriptors: [],
    targets: [target],
    target,
  };
  const sourcePolicy = classifyTargetSources(phase8.targets);
  if (sourcePolicy.targets.length !== 1 || sourcePolicy.targets[0].class !== SOURCE_CLASSES.HYBRID_C) {
    throw new Error('generated exact structural fixture must remain HYBRID_C and test-only');
  }

  const testRoot = path.join(context.localTools.workRoot, 'tests');
  fs.mkdirSync(testRoot, { recursive: true });
  const output = fs.mkdtempSync(path.join(testRoot, 'multi-owner-phase8-'));
  assertBuildLocations(output, baseline.phase7Output);
  const runtime = verifyRuntimeTools(phase8.model, {
    powershellRuntimeRoot: context.localTools.powershellRuntimeRoot,
    splatPython: context.localTools.splatPython,
    splatSplit: context.localTools.splatSplit,
    asmDifferRoot: context.localTools.asmDifferRoot,
  });
  verifyCompiler(phase8, context.localTools.compiler);
  const phase7 = verifyPhase7Input(phase8, baseline.phase7Output);
  const replacement = copyPhase7Objects(
    phase8,
    phase7,
    output,
    runtime.tools['mips-kmc-elf-objcopy.exe'].path,
  );
  const compiled = new Map([[
    SYMBOL,
    compileTarget(
      phase8,
      target,
      output,
      context.localTools.compiler,
      runtime.tools['mips-kmc-elf-as.exe'].path,
      runtime.tools['mips-kmc-elf-objcopy.exe'].path,
      { classification: sourcePolicy.targets[0] },
    ),
  ]]);
  const manifest = writeObjectManifest(
    output,
    replacement.linkedObjects,
    phase8,
    replacement.replacements,
    compiled,
  );
  writeLayout(phase8, phase7, output, replacement.replacements);
  linkPhase8(phase8, output, manifest, runtime.tools);
  const sourceObjectProofs = writeSourceObjectProofs(phase8, { output, compiled, sourcePolicy });
  const verification = verifyPhase8Output(phase8, {
    output,
    asmDifferRoot: context.localTools.asmDifferRoot,
    splatPython: context.localTools.splatPython,
    objdump: runtime.tools['mips-kmc-elf-objdump.exe'].path,
    objcopy: runtime.tools['mips-kmc-elf-objcopy.exe'].path,
    replacements: replacement.replacements,
  });

  const linkedElf = parseElfFile(path.join(output, 'phase8.elf'));
  const canonicalBaserom = fs.readFileSync(context.baserom.path);
  const linkedRom = fs.readFileSync(path.join(output, 'phase8.us_rev0.z64'));
  const mapText = fs.readFileSync(path.join(output, 'phase8.map'), 'utf8');
  const mapOwner = verifyTargetMapOwner(target, mapText);
  const sourceObjectProof = sourceObjectProofs.get(SYMBOL);
  const cObject = parseElfFile(path.join(output, 'objects', 'c', `${SYMBOL}.o`));
  const objectOwners = targetTextOwners(target).map((owner) => {
    const sections = cObject.sections.filter((section) => section.name === owner.sectionName);
    if (sections.length !== 1 || sections[0].size !== owner.bytes) {
      throw new Error(`C object owner section drift: ${owner.sectionName}`);
    }
    return Buffer.from(elfSectionBytes(cObject, sections[0]));
  });
  const fallbackChecks = targetTextOwners(target).map((owner) => {
    const record = replacement.replacements.get(owner.chunkIndex);
    const fallback = parseElfFile(path.join(output, record.fallbackRelative));
    const pruned = parseElfFile(path.join(output, record.linkedChunkRelative));
    const fallbackSections = fallback.sections.filter((section) => section.name === owner.sectionName);
    if (fallbackSections.length !== 1 || fallbackSections[0].size !== owner.bytes
        || pruned.sections.some((section) => section.name === owner.sectionName)
        || pruned.symbols.some((symbol) => symbol.name === owner.symbol)) {
      throw new Error(`two-chunk fallback/pruning drift: ${owner.sectionName}`);
    }
    return {
      chunkIndex: owner.chunkIndex,
      ownerSection: owner.sectionName,
      fallbackSha256: sha256Buffer(Buffer.from(elfSectionBytes(fallback, fallbackSections[0]))),
      pruned: true,
    };
  });
  if (!Buffer.concat(objectOwners).equals(canonicalBaserom.subarray(target.romStartNumber, target.romEndNumber))
      || !linkedRom.equals(canonicalBaserom)
      || manifest.linkedObjects.filter((record) => record.path === `objects/c/${SYMBOL}.o`).length !== 1
      || mapOwner.owners.length !== 2
      || mapOwner.owners.some((owner) => owner.linkedOwner !== `objects/c/${SYMBOL}.o`)
      || sourceObjectProofs.size !== 1 || !sourceObjectProof
      || verification.targets.length !== 1
      || verification.targets[0].owners.length !== 2
      || verification.targets[0].rawBytesExact !== true) {
    throw new Error('active multi-owner Phase 8 integration invariant failed');
  }

  const report = {
    schemaVersion: 1,
    status: 'pass',
    fixtureClass: sourcePolicy.targets[0].class,
    fixturePurpose: 'structural pipeline only; not a canonical source or matching-C claim',
    target: SYMBOL,
    output,
    owners: targetTextOwners(target).map((owner) => ({
      rowIndex: owner.rowIndex,
      chunkIndex: owner.chunkIndex,
      sectionName: owner.sectionName,
      logicalOffset: owner.logicalOffset,
      bytes: owner.bytes,
    })),
    fallbackChecks,
    mapOwners: mapOwner.owners,
    linkedSymbols: ownerSymbolEvidence(linkedElf, target),
    cObjectSha256: sha256File(path.join(output, 'objects', 'c', `${SYMBOL}.o`)),
    proofSha256: sourceObjectProof.sha256,
    romSha256: sha256Buffer(linkedRom),
    exactRom: true,
  };
  fs.writeFileSync(path.join(output, 'multi-owner-phase8-test-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}

main();
