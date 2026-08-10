#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  DIALECT_ID,
  DIALECT_PROOF_SCHEMA_VERSION,
  DIALECT_RULE_IDS,
  LA_JAL_RULE_ID,
  MOVE_RULE_ID,
  adjustSectionAssembly,
  applyCompilerAssemblyDialect,
  buildDialectProof,
  markerDiagnostics,
  serializeDialectProof,
  sha256Buffer,
} = require('../tools/lib/compiler_assembly_dialect');

const FIXTURES = path.join(__dirname, 'fixtures', 'compiler-assembly-dialect');

function fixture(name) {
  return fs.readFileSync(path.join(FIXTURES, name));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function expectRejection(name, pattern, callback) {
  try {
    callback();
  } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return { name, message: error.message };
  }
  throw new Error(`${name} was accepted`);
}

function expectPureUnchanged(name, text) {
  const input = Buffer.from(text, 'utf8');
  const result = applyCompilerAssemblyDialect(input, 'PURE_C');
  assert(result.output.equals(input), `${name} exclusion changed bytes`);
  assert(result.transformationCount === 0, `${name} exclusion recorded a transformation`);
  assert(DIALECT_RULE_IDS.every((ruleId) => result.ruleTransformations[ruleId] === 0), `${name} per-rule count drift`);
  return name;
}

function main() {
  const numeric = fixture('pure-numeric.s');
  const numericResult = applyCompilerAssemblyDialect(numeric, 'PURE_C');
  const numericText = numericResult.output.toString('utf8');
  assert(numericResult.transformationCount === 2, 'numeric fixture transformation count drift');
  assert(numericResult.ruleTransformations[MOVE_RULE_ID] === 2
    && numericResult.ruleTransformations[LA_JAL_RULE_ID] === 0, 'numeric fixture per-rule count drift');
  assert(numericText.includes('\taddu\t$0,$31,$0'), 'numeric register $0/$31 move was not adapted');
  assert(numericText.includes('  addu  $31, $0,$0  # retained comment'), 'numeric move spacing or comment drift');
  assert(numericText.includes('\tor\t$2,$4,$0'), 'explicit or statement changed');
  assert(numericText.includes('\taddu\t$3,$5,$0'), 'explicit addu statement changed');

  for (const ending of ['\n', '\r\n']) {
    const lines = ['\t.text', ...Array.from({ length: 32 }, (_, register) => `\tmove\t$${register}, $${31 - register} # ${register}`), ''];
    const input = Buffer.from(lines.join(ending), 'utf8');
    const first = applyCompilerAssemblyDialect(input, 'PURE_C');
    const second = applyCompilerAssemblyDialect(input, 'PURE_C');
    assert(first.output.equals(second.output), `numeric parser is not deterministic for ${JSON.stringify(ending)}`);
    assert(first.transformationCount === 32, `numeric register coverage drift for ${JSON.stringify(ending)}`);
    assert(first.ruleTransformations[MOVE_RULE_ID] === 32
      && first.ruleTransformations[LA_JAL_RULE_ID] === 0, `numeric per-rule coverage drift for ${JSON.stringify(ending)}`);
    assert(first.output.toString('utf8').split(ending).length === lines.length, `line-ending count drift for ${JSON.stringify(ending)}`);
  }

  const zero = fixture('pure-zero.s');
  const zeroResult = applyCompilerAssemblyDialect(zero, 'PURE_C');
  assert(zeroResult.transformationCount === 0 && zeroResult.output.equals(zero), 'zero-transform pure fixture changed');
  assert(zeroResult.explicitOrStatementCount === 1, 'explicit or diagnostic count drift');

  const adjacentInput = Buffer.from([
    '\t.text',
    '\tla\t$4,external_message',
    '\tjal\texternal_call',
    '\tor\t$2,$4,$0',
    '',
  ].join('\n'), 'utf8');
  const adjacentResult = applyCompilerAssemblyDialect(adjacentInput, 'PURE_C');
  const adjacentExpected = Buffer.from([
    '\t.text',
    '\t.set\tnoreorder',
    '\tlui\t$4,%hi(external_message)',
    '\tjal\texternal_call',
    '\taddiu\t$4,$4,%lo(external_message)',
    '\t.set\treorder',
    '\tor\t$2,$4,$0',
    '',
  ].join('\n'), 'utf8');
  assert(adjacentResult.output.equals(adjacentExpected), 'adjacent external-symbol la/jal rewrite drift');
  assert(adjacentResult.transformationCount === 1
    && adjacentResult.ruleTransformations[MOVE_RULE_ID] === 0
    && adjacentResult.ruleTransformations[LA_JAL_RULE_ID] === 1, 'adjacent external-symbol per-rule count drift');
  assert(adjacentResult.explicitOrStatementCount === 1, 'adjacent fixture explicit or diagnostic drift');

  const exclusions = [
    ['intervening instruction', '\t.text\n\tla $4,external_address\n\tsw $5,0($sp)\n\tjal external_call\n'],
    ['noreorder mode', '\t.text\n\t.set noreorder\n\tla $4,external_address\n\tjal external_call\n'],
    ['nomacro mode', '\t.text\n\t.set noreorder\n\t.set nomacro\n\t.set reorder\n\tla $4,external_address\n\tjal external_call\n'],
    ['volatile mode', '\t.text\n\t.set volatile\n\tla $4,external_address\n\tjal external_call\n'],
    ['label on jal', '\t.text\n\tla $4,external_address\ncall_site: jal external_call\n'],
    ['label on la', '\t.text\naddress_site: la $4,external_address\n\tjal external_call\n'],
    ['non-$4 register', '\t.text\n\tla $5,external_address\n\tjal external_call\n'],
    ['$31 dependency', '\t.text\n\tla $31,external_address\n\tjal external_call\n'],
    ['register-token address operand', '\t.text\n\tla $4,$31\n\tjal external_call\n'],
    ['register-token call operand', '\t.text\n\tla $4,external_address\n\tjal $31\n'],
    ['locally defined address symbol', '\t.text\n\tla $4,.Laddress\n\tjal external_call\n\t.section .rodata\n.Laddress:\n\t.word 0\n'],
    ['assigned local address symbol', '\t.text\n\tla $4,local_address\n\tjal external_call\nlocal_address = .\n'],
    ['jalr call', '\t.text\n\tla $4,external_address\n\tjalr $25\n'],
    ['address addend', '\t.text\n\tla $4,external_address+4\n\tjal external_call\n'],
    ['call-target addend', '\t.text\n\tla $4,external_address\n\tjal external_call+4\n'],
    ['unsupported relocation expression', '\t.text\n\tla $4,%got(external_address)\n\tjal external_call\n'],
    ['intervening directive', '\t.text\n\tla $4,external_address\n\t.align 2\n\tjal external_call\n'],
  ].map(([name, text]) => expectPureUnchanged(name, text));

  const hybridLaJal = Buffer.from('\t.text\n\tla $4,external_address\n\tjal external_call\n', 'utf8');
  const hybridLaJalResult = applyCompilerAssemblyDialect(hybridLaJal, 'HYBRID_C');
  assert(hybridLaJalResult.output.equals(hybridLaJal) && hybridLaJalResult.transformationCount === 0
    && DIALECT_RULE_IDS.every((ruleId) => hybridLaJalResult.ruleTransformations[ruleId] === 0),
  'HYBRID_C la/jal sequence was not opaque passthrough');

  const authentic = [
    ['func_0002CD70.compiler.s', '040B9057A3F11214D78D719ACD75E96621056A172A862C24120A9DC84DB66969', 5, 4],
    ['func_0025C8A4.compiler.s', '2F5732577B0A3F9D4B4BA470F90D6D8D6A1E5BBABF94AB50002B7F5CA2E4D095', 1, 0],
  ];
  for (const [name, expectedSha256, appMarkerCount, noAppMarkerCount] of authentic) {
    const input = fixture(name);
    assert(sha256Buffer(input) === expectedSha256, `authentic fixture identity drift: ${name}`);
    const result = applyCompilerAssemblyDialect(input, 'HYBRID_C');
    assert(result.output.equals(input), `authentic hybrid passthrough changed bytes: ${name}`);
    assert(result.transformationCount === 0, `authentic hybrid transformed: ${name}`);
    assert(DIALECT_RULE_IDS.every((ruleId) => result.ruleTransformations[ruleId] === 0), `authentic hybrid per-rule count drift: ${name}`);
    assert(result.appMarkerCount === appMarkerCount && result.noAppMarkerCount === noAppMarkerCount, `authentic marker diagnostics drift: ${name}`);
  }

  const balanced = fixture('hybrid-balanced.s');
  const balancedResult = applyCompilerAssemblyDialect(balanced, 'HYBRID_C');
  assert(balancedResult.output.equals(balanced) && balancedResult.appMarkerCount === 1 && balancedResult.noAppMarkerCount === 1, 'balanced hybrid passthrough drift');

  const pureMarkers = [
    '#APP\n',
    '#NO_APP\n',
    '#APP\n#NO_APP\n',
    '#APP\n\tmove $2,$4\n',
    '#APP # trailing text\n',
    '\t.word 1 #NO_APP\n',
  ];
  for (const text of pureMarkers) {
    expectRejection('PURE_C APP marker', /#APP or #NO_APP/, () => applyCompilerAssemblyDialect(Buffer.from(text), 'PURE_C'));
  }
  expectRejection('UNKNOWN source class', /UNKNOWN source class/, () => applyCompilerAssemblyDialect(Buffer.from('\t.text\n'), 'UNKNOWN'));
  expectRejection('ASM source class', /unsupported source class/, () => applyCompilerAssemblyDialect(Buffer.from('\t.text\n'), 'ASM'));
  expectRejection('forbidden transformer metadata', /accepts only compiler assembly bytes and source class/, () => {
    applyCompilerAssemblyDialect(Buffer.from('\t.text\n'), 'PURE_C', { symbol: 'func_00000000', expectedWord: 0x21 });
  });

  const hostile = [
    ['hostile-macro.s', /macro or conditional directive/],
    ['hostile-conditional.s', /macro or conditional directive/],
    ['hostile-semicolon.s', /semicolon statement/],
    ['hostile-named-register.s', /canonical numeric GPR operands/],
    ['hostile-floating-move.s', /unsupported move syntax/],
    ['hostile-coprocessor-move.s', /unsupported move syntax/],
  ];
  for (const [name, pattern] of hostile) {
    expectRejection(name, pattern, () => applyCompilerAssemblyDialect(fixture(name), 'PURE_C'));
  }
  for (const text of ['move $32,$0\n', 'move $-1,$0\n', 'move $2\n', 'move $2,$4,$0\n', 'label: move $2,$4\n']) {
    expectRejection('malformed numeric move', /canonical numeric GPR operands|complete unlabeled statement/, () => {
      applyCompilerAssemblyDialect(Buffer.from(text), 'PURE_C');
    });
  }
  for (const text of [
    'la $4\n',
    'la $4,\n',
    'la $32,external_address\n',
    'la $4,external_address,extra\n',
    'jal\n',
    'jal external_call,extra\n',
  ]) {
    expectRejection('malformed la/jal operands', /PURE_C (?:la|jal) must use/, () => {
      applyCompilerAssemblyDialect(Buffer.from(text), 'PURE_C');
    });
  }
  expectRejection('unsupported mode transition', /unsupported \.set mode transition/, () => {
    applyCompilerAssemblyDialect(Buffer.from('.set mips16\n.text\n'), 'PURE_C');
  });
  expectRejection('unsupported configuration directive', /unsupported configuration directive/, () => {
    applyCompilerAssemblyDialect(Buffer.from('.abicalls\n.text\n'), 'PURE_C');
  });

  const sectionInput = Buffer.from('\t.text\r\n\taddu $2,$4,$0\r\n', 'utf8');
  const sectionOutput = adjustSectionAssembly(sectionInput, '.ob64.r1.s0');
  assert(sectionOutput.toString('utf8') === '.section .ob64.r1.s0,"ax",@progbits\r\n\taddu $2,$4,$0\r\n', 'section adjustment drift');
  expectRejection('duplicate text section', /section grammar drift/, () => adjustSectionAssembly(Buffer.from('.text\n.text\n'), '.ob64.r1.s0'));

  const decision = { ...numericResult };
  delete decision.output;
  const proofInput = {
    targetSymbol: 'fixture',
    dialect: {
      id: DIALECT_ID,
      rules: DIALECT_RULE_IDS,
      manifestPath: 'config/compiler-assembly-dialect.json',
      manifestSha256: 'A'.repeat(64),
      implementationPath: 'tools/lib/compiler_assembly_dialect.js',
      implementationSha256: 'B'.repeat(64),
    },
    classification: { class: 'PURE_C', digest: 'C'.repeat(64) },
    sourcePolicyConfigSha256: 'D'.repeat(64),
    decision,
    artifacts: { compilerAssembly: {}, dialectAssembly: {}, sectionAdjustedAssembly: {} },
    compiler: { executableSha256: 'E'.repeat(64) },
    assembler: { executableSha256: 'F'.repeat(64) },
    finalObject: { sha256: '1'.repeat(64) },
    finalTarget: { linkedSha256: '2'.repeat(64) },
  };
  const proofA = serializeDialectProof(buildDialectProof(proofInput));
  const proofB = serializeDialectProof(buildDialectProof(proofInput));
  assert(proofA.equals(proofB), 'dialect proof serialization is not deterministic');
  assert(sha256Buffer(proofA) === sha256Buffer(proofB), 'dialect proof hash is not deterministic');
  const parsedProof = JSON.parse(proofA.toString('utf8'));
  assert(parsedProof.schemaVersion === DIALECT_PROOF_SCHEMA_VERSION
    && JSON.stringify(parsedProof.dialect.rules) === JSON.stringify(DIALECT_RULE_IDS)
    && JSON.stringify(parsedProof.counts.ruleTransformations) === JSON.stringify(numericResult.ruleTransformations),
  'dialect proof versioned rule identities or counts drift');
  assert(markerDiagnostics(fixture('func_0002CD70.compiler.s')).inlineRegionCount === 5, 'hybrid inline diagnostic count drift');

  console.log(JSON.stringify({
    status: 'pass',
    rules: DIALECT_RULE_IDS,
    numericTransformations: numericResult.transformationCount,
    adjacentLaJalTransformations: adjacentResult.transformationCount,
    allNumericRegistersCovered: true,
    authenticHybridFixtures: authentic.length,
    exclusions,
    hostileRejections: hostile.length + 13,
    deterministicProofSha256: sha256Buffer(proofA),
  }, null, 2));
}

main();
