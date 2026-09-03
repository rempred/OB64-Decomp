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
  verifyElfAgainstModel,
  verifyRom,
} = require('../tools/lib/phase7_conventional');
const { resolveAcceptedRows } = require('../tools/lib/active_targets');
const {
  assertBuildLocations,
  compareLinkedTargetBytes,
  compileTarget,
  copyPhase7Objects,
  linkPhase8,
  phase8VerificationModel,
  targetRetainedAssemblySlices,
  verifyCompiler,
  verifyPhase7Input,
  verifyPhase8Layout,
  verifyPhase8Output,
  verifyRuntimeTools,
  verifyTargetMapOwner,
  writeLayout,
  writeObjectManifest,
  writeSourceObjectProofs,
} = require('../tools/lib/phase8_matching_c');
const { ensureBaseline, prepareContext } = require('../tools/lib/current_workflow');
const { SOURCE_CLASSES, classifyTargetSources } = require('../tools/lib/source_policy');

const SYMBOL = 'func_0021C8DC';
const GENERATED_SOURCE = 'build/split-row-phase8-test/func_0021C8DC_exact_fixture.c';
const TEXT_SECTION = '.ob64.r4033.s0';
const PADDING_SECTION = '.ob64.r4033.s1';
const ACCEPTED_SLICE_STRUCTURAL_FIELDS = [
  'executable',
  'executableRangeId',
  'loadSlabId',
  'nonExecutableRangeId',
  'overlayDescriptorId',
  'overlaySection',
  'placementKind',
  'romEndExclusive',
  'romStart',
  'sectionName',
  'vramEndExclusive',
  'vramStart',
];

function hex(value) {
  return `0x${value.toString(16).toUpperCase().padStart(8, '0')}`;
}

function expectRejection(label, pattern, callback) {
  try {
    callback();
  } catch (error) {
    if (!pattern.test(error.message)) {
      throw new Error(`${label} rejected for the wrong reason: ${error.message}`);
    }
    return label;
  }
  throw new Error(`${label} was accepted`);
}

function writeExactFixtureSource() {
  const source = [
    'typedef signed int s32;',
    'typedef unsigned char u8;',
    'typedef float f32;',
    '',
    'struct BattleQueueEntry {',
    '    u8 pad_00[8];',
    '    s32 field_08;',
    '    u8 pad_0C[4];',
    '    f32 field_10;',
    '    u8 pad_14[0xAC];',
    '};',
    '',
    's32 func_0021C8DC(struct BattleQueueEntry **left_ptr, struct BattleQueueEntry **right_ptr)',
    '{',
    '    struct BattleQueueEntry *left;',
    '    struct BattleQueueEntry *right;',
    '',
    '    left = *left_ptr;',
    '    right = *right_ptr;',
    '    if (left->field_10 < right->field_10) {',
    '        return -1;',
    '    }',
    '    if (right->field_10 < left->field_10) {',
    '        return 1;',
    '    }',
    '    if (left->field_08 < right->field_08) {',
    '        return 1;',
    '    }',
    '    if (right->field_08 < left->field_08) {',
    '        return -1;',
    '    }',
    '    return left - right;',
    '}',
    '',
  ].join('\n');
  const file = path.join(ROOT, ...GENERATED_SOURCE.split('/'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, source);
  return file;
}

function buildFixtureTarget(basePhase8, baserom, sourceFile) {
  const resolved = resolveAcceptedRows(basePhase8.model, SYMBOL, basePhase8.multiOwnerContracts);
  if (resolved.contract !== null || resolved.rows.length !== 1 || resolved.owners.length !== 1) {
    throw new Error('accepted split-row fixture owner is unavailable');
  }
  const owner = resolved.owners[0];
  const row = resolved.rows[0];
  const expectedText = Buffer.from(baserom.subarray(owner.romStartNumber, owner.romEndNumber));
  const source = path.relative(ROOT, sourceFile).replace(/\\/g, '/');
  if (row.bytes !== 148 || row.slices.length !== 2
      || owner.sectionName !== TEXT_SECTION || owner.bytes !== 140
      || owner.logicalOffset !== 0 || owner.logicalEnd !== 140
      || expectedText.length !== 140) {
    throw new Error('accepted split-row fixture extent drift');
  }
  return {
    symbol: SYMBOL,
    source,
    targetIndex: 0,
    primaryId: owner.primaryId,
    rowIndex: owner.rowIndex,
    chunkIndex: owner.chunkIndex,
    originalAssembly: owner.originalAssembly,
    originalAssemblySha256: owner.originalAssemblySha256,
    romStart: hex(owner.romStartNumber),
    romEndExclusive: hex(owner.romEndNumber),
    romStartNumber: owner.romStartNumber,
    romEndNumber: owner.romEndNumber,
    vramStart: hex(owner.vramStartNumber),
    vramEndExclusive: hex(owner.vramEndNumber),
    vramStartNumber: owner.vramStartNumber,
    vramEndNumber: owner.vramEndNumber,
    bytes: owner.bytes,
    sectionName: owner.sectionName,
    textOwners: [{ ...owner, expectedTextSha256: sha256Buffer(expectedText) }],
    multiOwner: false,
    multiOwnerContract: null,
    overlayDescriptorId: null,
    descriptorRawSha256: null,
    expectedTextSha256: sha256Buffer(expectedText),
    expectedRelocations: [],
    compilerTextFunctionsExplicit: false,
    compilerTextFunctions: [{
      symbol: SYMBOL,
      offset: '0x00000000',
      offsetNumber: 0,
      bytes: owner.bytes,
      binding: 'GLOBAL',
      entryEvidence: 'owner',
    }],
    auxiliarySections: [],
    relocationContractSource: 'generated-exact-split-row-structural-test-fixture',
    legacyAncillaryRelocations: [],
    sourceSha256: sha256File(sourceFile),
    descriptor: null,
    model: basePhase8.model,
    row,
    rows: [row],
  };
}

function replaceSectionMapOwner(mapText, sectionName, fromOwner, toOwner) {
  const lines = mapText.split(/\r?\n/);
  const heading = lines.findIndex((line) => line.startsWith(sectionName + ' '));
  if (heading < 0) throw new Error(`map mutation section is missing: ${sectionName}`);
  let end = lines.length;
  for (let index = heading + 1; index < lines.length; index += 1) {
    if (/^\.ob64\.r\d{4}(?:\.s\d+)?\s/.test(lines[index])) {
      end = index;
      break;
    }
  }
  const matches = [];
  for (let index = heading + 1; index < end; index += 1) {
    if (lines[index].includes(fromOwner)) matches.push(index);
  }
  if (matches.length !== 1) throw new Error(`map mutation owner census drift: ${sectionName}`);
  lines[matches[0]] = lines[matches[0]].replace(fromOwner, toOwner);
  return lines.join('\n');
}

function cloneElfWithSection(elf, sectionName, mutate) {
  return {
    ...elf,
    sections: elf.sections.map((section) => section.name === sectionName
      ? mutate({ ...section })
      : section),
  };
}

function contradictoryScalar(value) {
  if (value === null) return 'contradictory-null-replacement';
  if (typeof value === 'boolean') return !value;
  if (typeof value === 'number') return value + 1;
  if (typeof value === 'string') return `${value}-contradiction`;
  throw new Error(`accepted split-row structural field is not scalar: ${typeof value}`);
}

function main() {
  const context = prepareContext();
  const baseline = ensureBaseline(context);
  const acceptedLayout = JSON.parse(fs.readFileSync(path.join(baseline.phase7Output, 'layout.json'), 'utf8'));
  const baserom = fs.readFileSync(context.baserom.path);
  const sourceFile = writeExactFixtureSource();
  const target = buildFixtureTarget(context.phase8, baserom, sourceFile);
  const phase8 = {
    ...context.phase8,
    compatibility: [],
    descriptors: [],
    targets: [target],
    target,
  };
  const sourcePolicy = classifyTargetSources(phase8.targets);
  if (sourcePolicy.targets.length !== 1 || sourcePolicy.targets[0].class !== SOURCE_CLASSES.PURE_C) {
    throw new Error('generated exact split-row fixture must remain PURE_C and test-only');
  }

  const retained = targetRetainedAssemblySlices(target);
  if (retained.length !== 1 || retained[0].sectionName !== PADDING_SECTION
      || retained[0].bytes !== 8 || retained[0].executable !== false
      || retained[0].romStartNumber !== 0x0021C968
      || retained[0].romEndNumber !== 0x0021C970) {
    throw new Error('accepted retained padding slice contract drift');
  }

  const testRoot = path.join(context.localTools.workRoot, 'tests');
  fs.mkdirSync(testRoot, { recursive: true });
  const output = fs.mkdtempSync(path.join(testRoot, 'split-row-phase8-'));
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
  const compiledTarget = compileTarget(
    phase8,
    target,
    output,
    context.localTools.compiler,
    runtime.tools['mips-kmc-elf-as.exe'].path,
    runtime.tools['mips-kmc-elf-objcopy.exe'].path,
    { classification: sourcePolicy.targets[0] },
  );
  const compiled = new Map([[SYMBOL, compiledTarget]]);
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
  const linkedRom = fs.readFileSync(path.join(output, 'phase8.us_rev0.z64'));
  const mapText = fs.readFileSync(path.join(output, 'phase8.map'), 'utf8');
  const layout = JSON.parse(fs.readFileSync(path.join(output, 'layout.json'), 'utf8'));
  const cObject = parseElfFile(path.join(output, compiledTarget.objectRelative));
  const chunkReplacement = replacement.replacements.get(target.chunkIndex);
  const fallback = parseElfFile(path.join(output, chunkReplacement.fallbackRelative));
  const pruned = parseElfFile(path.join(output, chunkReplacement.linkedChunkRelative));
  const mapOwner = verifyTargetMapOwner(target, mapText);
  const targetComparison = compareLinkedTargetBytes(target, linkedElf, baserom);
  const verificationModel = phase8VerificationModel(phase8);
  verifyElfAgainstModel(verificationModel, linkedElf);
  verifyRom(phase8.model, linkedRom);
  verifyPhase8Layout(phase8, layout, replacement.replacements);

  const fallbackText = fallback.sections.filter((section) => section.name === TEXT_SECTION);
  const fallbackPadding = fallback.sections.filter((section) => section.name === PADDING_SECTION);
  const prunedText = pruned.sections.filter((section) => section.name === TEXT_SECTION);
  const prunedPadding = pruned.sections.filter((section) => section.name === PADDING_SECTION);
  const cText = cObject.sections.filter((section) => section.name === TEXT_SECTION);
  const cPadding = cObject.sections.filter((section) => section.name === PADDING_SECTION);
  const linkedPadding = linkedElf.sections.find((section) => section.name === PADDING_SECTION);
  if (!linkedRom.equals(baserom)
      || !targetComparison.rawBytesExact || !linkedPadding
      || !Buffer.from(elfSectionBytes(linkedElf, linkedPadding)).equals(Buffer.alloc(8))
      || fallbackText.length !== 1 || fallbackText[0].size !== 140
      || fallbackPadding.length !== 1 || fallbackPadding[0].size !== 8
      || prunedText.length !== 0 || prunedPadding.length !== 1 || prunedPadding[0].size !== 8
      || cText.length !== 1 || cText[0].size !== 140 || cPadding.length !== 0
      || !Buffer.from(elfSectionBytes(pruned, prunedPadding[0])).equals(Buffer.alloc(8))
      || mapOwner.owners.length !== 1
      || mapOwner.owners[0].linkedOwner !== `objects/c/${SYMBOL}.o`
      || mapOwner.retainedAssemblySlices.length !== 1
      || mapOwner.retainedAssemblySlices[0].linkedOwner !== chunkReplacement.linkedChunkRelative
      || sourceObjectProofs.size !== 1
      || verification.targets.length !== 1
      || verification.targets[0].retainedAssemblySlices.length !== 1
      || verification.targets[0].retainedAssemblySlices[0].rawBytesExact !== true) {
    throw new Error('active split-row Phase 8 integration invariant failed');
  }

  const cOwner = `objects/c/${SYMBOL}.o`;
  const assemblyOwner = chunkReplacement.linkedChunkRelative;
  const rejectedMutations = [
    expectRejection('whole-row logical end', /owner census drift/, () => compareLinkedTargetBytes({
      ...target,
      textOwners: target.textOwners.map((owner) => ({ ...owner, logicalEnd: 148 })),
    }, linkedElf, baserom)),
    expectRejection('matching C map owner', /sole matching C object/, () => verifyTargetMapOwner(
      target,
      replaceSectionMapOwner(mapText, TEXT_SECTION, cOwner, assemblyOwner),
    )),
    expectRejection('retained assembly map owner', /retained assembly slice linker-map owner drift/, () => verifyTargetMapOwner(
      target,
      replaceSectionMapOwner(mapText, PADDING_SECTION, assemblyOwner, cOwner),
    )),
    expectRejection('retained assembly execution flag', /ELF section execution flag drift/, () => verifyElfAgainstModel(
      verificationModel,
      cloneElfWithSection(linkedElf, PADDING_SECTION, (section) => ({ ...section, flags: section.flags | 4 })),
    )),
    expectRejection('retained assembly placement', /ELF section VRAM placement drift/, () => verifyElfAgainstModel(
      verificationModel,
      cloneElfWithSection(linkedElf, PADDING_SECTION, (section) => ({ ...section, address: section.address + 4 })),
    )),
  ];

  const byteMutation = Buffer.from(linkedRom);
  byteMutation[retained[0].romStartNumber] ^= 0x01;
  rejectedMutations.push(expectRejection('retained assembly byte', /linked ROM SHA-256 drift/, () => {
    verifyRom(phase8.model, byteMutation);
  }));

  const retainedLayoutMutation = JSON.parse(JSON.stringify(layout));
  retainedLayoutMutation.owners[target.rowIndex].slices
    .find((slice) => slice.sectionName === PADDING_SECTION).linkedOwner = cOwner;
  rejectedMutations.push(expectRejection('retained assembly layout provenance', /retained-slice drift/, () => {
    verifyPhase8Layout(phase8, retainedLayoutMutation, replacement.replacements);
  }));
  const cLayoutMutation = JSON.parse(JSON.stringify(layout));
  cLayoutMutation.owners[target.rowIndex].slices
    .find((slice) => slice.sectionName === TEXT_SECTION).matchingCLogicalOffset = 4;
  rejectedMutations.push(expectRejection('matching C layout provenance', /C-slice drift/, () => {
    verifyPhase8Layout(phase8, cLayoutMutation, replacement.replacements);
  }));

  const acceptedLayoutOwner = acceptedLayout.owners[target.rowIndex];
  if (!acceptedLayoutOwner || acceptedLayoutOwner.slices.length !== target.row.slices.length) {
    throw new Error('accepted split-row external layout census drift');
  }
  for (const acceptedSlice of acceptedLayoutOwner.slices) {
    const actualFields = Object.keys(acceptedSlice).sort();
    if (JSON.stringify(actualFields) !== JSON.stringify(ACCEPTED_SLICE_STRUCTURAL_FIELDS)) {
      throw new Error(`accepted split-row structural field census drift: ${acceptedSlice.sectionName}`);
    }
    const role = acceptedSlice.sectionName === TEXT_SECTION ? 'matching C' : 'retained assembly';
    const rejectionPattern = acceptedSlice.sectionName === TEXT_SECTION ? /C-slice drift/ : /retained-slice drift/;
    for (const acceptedField of ACCEPTED_SLICE_STRUCTURAL_FIELDS) {
      const structuralMutation = JSON.parse(JSON.stringify(layout));
      const structuralSlice = structuralMutation.owners[target.rowIndex].slices
        .find((slice) => slice.sectionName === acceptedSlice.sectionName);
      structuralSlice[acceptedField] = contradictoryScalar(structuralSlice[acceptedField]);
      rejectedMutations.push(expectRejection(
        `${role} accepted ${acceptedField}`,
        rejectionPattern,
        () => verifyPhase8Layout(phase8, structuralMutation, replacement.replacements),
      ));
    }

    const acceptedInputMutation = JSON.parse(JSON.stringify(layout));
    const acceptedInputSlice = acceptedInputMutation.owners[target.rowIndex].slices
      .find((slice) => slice.sectionName === acceptedSlice.sectionName);
    acceptedInputSlice.baseInputKind = contradictoryScalar(acceptedInputSlice.baseInputKind);
    rejectedMutations.push(expectRejection(
      `${role} accepted inputKind`,
      rejectionPattern,
      () => verifyPhase8Layout(phase8, acceptedInputMutation, replacement.replacements),
    ));

    const ownershipMutation = JSON.parse(JSON.stringify(layout));
    const ownershipSlice = ownershipMutation.owners[target.rowIndex].slices
      .find((slice) => slice.sectionName === acceptedSlice.sectionName);
    ownershipSlice.inputKind = role === 'matching C' ? 'tracked-assembly' : 'matching-c';
    rejectedMutations.push(expectRejection(
      `${role} effective inputKind`,
      rejectionPattern,
      () => verifyPhase8Layout(phase8, ownershipMutation, replacement.replacements),
    ));
  }

  const report = {
    schemaVersion: 1,
    status: 'pass',
    fixtureClass: sourcePolicy.targets[0].class,
    fixturePurpose: 'structural pipeline only; active configuration and archived candidate remain untouched',
    target: SYMBOL,
    output,
    cOwnerSection: TEXT_SECTION,
    retainedAssemblySection: PADDING_SECTION,
    retainedAssemblyOwner: assemblyOwner,
    sourceSha256: sha256File(sourceFile),
    cObjectSha256: sha256File(path.join(output, compiledTarget.objectRelative)),
    proofSha256: sourceObjectProofs.get(SYMBOL).sha256,
    romSha256: sha256Buffer(linkedRom),
    exactRom: true,
    rejectedMutations,
  };
  fs.writeFileSync(path.join(output, 'split-row-phase8-test-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}

main();
