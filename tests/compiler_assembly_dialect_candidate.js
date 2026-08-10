#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  LA_JAL_RULE_ID,
  MOVE_RULE_ID,
  applyCompilerAssemblyDialect,
} = require('../tools/lib/compiler_assembly_dialect');
const { loadActiveTargetModel } = require('../tools/lib/active_targets');
const {
  elfSectionBytes,
  parseElfFile,
  sha256Buffer,
  sha256File,
} = require('../tools/lib/phase7_conventional');
const {
  assertToolchainAvailable,
  loadToolchainConfig,
  runTool,
  toolVersion,
} = require('../tools/lib/real_mips_toolchain');

function usage() {
  console.log('Usage: node tests/compiler_assembly_dialect_candidate.js --compiler-assembly <generated.s> --historical-object <oracle.o> --output <generated-dir> --expected-compiler-assembly-sha256 <SHA256> --expected-text-sha256 <SHA256> --expected-move-transformations <N> --expected-la-jal-transformations <N> --expected-intervening-controls <N> --expected-instructions <N> --expected-rel-text <N>');
}

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1] || process.argv[index + 1].startsWith('--')) {
    throw new Error(`missing ${flag}`);
  }
  return process.argv[index + 1];
}

function expectedInteger(flag) {
  const parsed = Number(value(flag));
  if (!Number.isSafeInteger(parsed) || parsed < 0) throw new Error(`${flag} must be a nonnegative integer`);
  return parsed;
}

function expectedSha256(flag) {
  const digest = value(flag).toUpperCase();
  if (!/^[0-9A-F]{64}$/.test(digest)) throw new Error(`${flag} must be an uppercase SHA-256`);
  return digest;
}

function textBytes(elf, label) {
  const sections = elf.sections.filter((section) => section.name === '.text');
  if (sections.length !== 1 || sections[0].type !== 1 || sections[0].size % 4 !== 0) {
    throw new Error(`${label} .text section shape drift`);
  }
  return Buffer.from(elfSectionBytes(elf, sections[0]));
}

function logicalTextRelocations(elf, label) {
  const relocationSections = elf.sections.filter((section) => section.name === '.rel.text');
  if (relocationSections.length !== 1 || relocationSections[0].type !== 9 || relocationSections[0].entrySize !== 8) {
    throw new Error(`${label} .rel.text section shape drift`);
  }
  const relocationSection = relocationSections[0];
  const symbols = new Map();
  for (const symbol of elf.symbols) {
    if (symbol.symbolTableIndex !== relocationSection.link || !Number.isInteger(symbol.symbolIndex)) continue;
    const resolvedName = symbol.name || (elf.sections[symbol.sectionIndex] && elf.sections[symbol.sectionIndex].name);
    if (typeof resolvedName === 'string' && resolvedName.length > 0) symbols.set(symbol.symbolIndex, resolvedName);
  }
  const typeNames = { 4: 'R_MIPS_26', 5: 'R_MIPS_HI16', 6: 'R_MIPS_LO16' };
  const records = [];
  for (let index = 0; index < relocationSection.size / relocationSection.entrySize; index += 1) {
    const entry = relocationSection.offset + index * relocationSection.entrySize;
    const offset = elf.buffer.readUInt32BE(entry);
    const info = elf.buffer.readUInt32BE(entry + 4);
    const type = typeNames[info & 0xff];
    const symbol = symbols.get(info >>> 8);
    if (!type || !symbol) throw new Error(`${label} unsupported .rel.text record`);
    records.push({
      offset: `0x${offset.toString(16).toUpperCase().padStart(8, '0')}`,
      type,
      symbol,
    });
  }
  return records.sort((left, right) => (
    left.offset.localeCompare(right.offset)
    || left.type.localeCompare(right.type)
    || left.symbol.localeCompare(right.symbol)
  ));
}

function nextStatement(lines, start) {
  for (let index = start; index < lines.length; index += 1) {
    const statement = lines[index].replace(/#.*$/, '').trim();
    if (statement) return { index, statement };
  }
  return null;
}

function interveningLaSwJalControls(text) {
  const lines = text.split(/\r\n|\n|\r/);
  const bareSymbol = '[A-Za-z_.$][A-Za-z0-9_.$]*';
  const laPattern = new RegExp(`^la[ \\t]+\\$4[ \\t]*,[ \\t]*(${bareSymbol})[ \\t]*$`, 'i');
  const jalPattern = new RegExp(`^jal[ \\t]+(${bareSymbol})[ \\t]*$`, 'i');
  const controls = [];
  for (let index = 0; index < lines.length; index += 1) {
    const la = laPattern.exec(lines[index].replace(/#.*$/, '').trim());
    if (!la) continue;
    const intervening = nextStatement(lines, index + 1);
    if (!intervening || !/^sw\b/i.test(intervening.statement)) continue;
    const jal = nextStatement(lines, intervening.index + 1);
    const call = jal && jalPattern.exec(jal.statement);
    if (call) {
      controls.push({
        addressSymbol: la[1],
        interveningStatement: intervening.statement,
        callTarget: call[1],
      });
    }
  }
  return controls;
}

function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    return;
  }
  const compilerAssembly = path.resolve(value('--compiler-assembly'));
  const historicalObject = path.resolve(value('--historical-object'));
  const output = path.resolve(value('--output'));
  const expected = {
    compilerAssemblySha256: expectedSha256('--expected-compiler-assembly-sha256'),
    textSha256: expectedSha256('--expected-text-sha256'),
    moveTransformations: expectedInteger('--expected-move-transformations'),
    laJalTransformations: expectedInteger('--expected-la-jal-transformations'),
    interveningControls: expectedInteger('--expected-intervening-controls'),
    instructions: expectedInteger('--expected-instructions'),
    relText: expectedInteger('--expected-rel-text'),
  };
  for (const file of [compilerAssembly, historicalObject]) {
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`evidence input is missing: ${file}`);
  }
  if (sha256File(compilerAssembly) !== expected.compilerAssemblySha256) {
    throw new Error('compiler-assembly evidence identity drift');
  }

  fs.mkdirSync(output, { recursive: true });
  const adaptedFile = path.join(output, 'candidate.dialect.s');
  const gnuObjectFile = path.join(output, 'candidate.gnu239.o');
  const reportFile = path.join(output, 'verification.json');
  const compilerBytes = fs.readFileSync(compilerAssembly);
  const decision = applyCompilerAssemblyDialect(compilerBytes, 'PURE_C');
  if (decision.ruleTransformations[MOVE_RULE_ID] !== expected.moveTransformations
      || decision.ruleTransformations[LA_JAL_RULE_ID] !== expected.laJalTransformations
      || decision.transformationCount !== expected.moveTransformations + expected.laJalTransformations) {
    throw new Error('candidate per-rule transformation count drift');
  }
  const inputControls = interveningLaSwJalControls(compilerBytes.toString('utf8'));
  const outputControls = interveningLaSwJalControls(decision.output.toString('utf8'));
  if (inputControls.length !== expected.interveningControls
      || JSON.stringify(outputControls) !== JSON.stringify(inputControls)) {
    throw new Error('candidate intervening la/sw/jal control was not preserved');
  }
  fs.writeFileSync(adaptedFile, decision.output);

  const active = loadActiveTargetModel();
  const toolchain = assertToolchainAvailable(loadToolchainConfig());
  const assemblerSha256 = sha256File(toolchain.assemblerAbs);
  const assemblerVersion = toolVersion(toolchain.assemblerAbs);
  if (assemblerSha256 !== active.dialect.contract.assemblerExecutableSha256
      || assemblerVersion !== active.dialect.contract.assemblerVersion
      || JSON.stringify(toolchain.assemblerFlags) !== JSON.stringify(active.dialect.contract.assemblerFlags)) {
    throw new Error('production GNU assembler identity or flags drift');
  }
  runTool(toolchain.assemblerAbs, [...toolchain.assemblerFlags, '-o', gnuObjectFile, adaptedFile]);
  const historicalElf = parseElfFile(historicalObject);
  const gnuElf = parseElfFile(gnuObjectFile);
  const historicalText = textBytes(historicalElf, 'historical object');
  const gnuText = textBytes(gnuElf, 'GNU 2.39 object');
  const historicalRelocations = logicalTextRelocations(historicalElf, 'historical object');
  const gnuRelocations = logicalTextRelocations(gnuElf, 'GNU 2.39 object');
  const instructionWordDifferences = [];
  for (let offset = 0; offset < Math.max(historicalText.length, gnuText.length); offset += 4) {
    if (!historicalText.subarray(offset, offset + 4).equals(gnuText.subarray(offset, offset + 4))) {
      instructionWordDifferences.push(`0x${offset.toString(16).toUpperCase().padStart(8, '0')}`);
    }
  }
  if (historicalText.length / 4 !== expected.instructions || gnuText.length / 4 !== expected.instructions
      || sha256Buffer(historicalText) !== expected.textSha256 || sha256Buffer(gnuText) !== expected.textSha256
      || instructionWordDifferences.length !== 0
      || historicalRelocations.length !== expected.relText || gnuRelocations.length !== expected.relText
      || JSON.stringify(historicalRelocations) !== JSON.stringify(gnuRelocations)) {
    throw new Error('candidate GNU 2.39 text or logical relocation comparison drift');
  }

  const report = {
    schemaVersion: 1,
    status: 'pass',
    inputs: {
      compilerAssembly: { path: compilerAssembly, bytes: compilerBytes.length, sha256: sha256File(compilerAssembly) },
      historicalObject: { path: historicalObject, bytes: fs.statSync(historicalObject).size, sha256: sha256File(historicalObject) },
    },
    adapter: {
      dialect: active.dialect.identity,
      sourceClassForGeneratedEvidence: 'PURE_C',
      transformationCount: decision.transformationCount,
      ruleTransformations: decision.ruleTransformations,
      preservedInterveningLaSwJalControls: outputControls,
      adaptedAssembly: { path: adaptedFile, bytes: fs.statSync(adaptedFile).size, sha256: sha256File(adaptedFile) },
    },
    productionAssembler: {
      path: toolchain.assemblerAbs,
      version: assemblerVersion,
      sha256: assemblerSha256,
      flags: toolchain.assemblerFlags,
      object: { path: gnuObjectFile, bytes: fs.statSync(gnuObjectFile).size, sha256: sha256File(gnuObjectFile) },
    },
    comparison: {
      instructions: expected.instructions,
      textBytes: gnuText.length,
      textSha256: sha256Buffer(gnuText),
      instructionWordDifferenceCount: instructionWordDifferences.length,
      logicalRelTextEntries: gnuRelocations.length,
      logicalRelTextIdentical: true,
      rawObjectsByteIdentical: fs.readFileSync(historicalObject).equals(fs.readFileSync(gnuObjectFile)),
    },
  };
  fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: 'pass', report: reportFile, adapter: report.adapter, comparison: report.comparison }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`Compiler-assembly candidate verification failed: ${error.message}`);
  process.exitCode = 1;
}
