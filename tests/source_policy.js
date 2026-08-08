#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  SOURCE_CLASSES,
  classifySource,
  classifyTargetSources,
  resolvePreprocessor,
} = require('../tools/lib/source_policy');
const { applyCompilerAssemblyDialect } = require('../tools/lib/compiler_assembly_dialect');

const FIXTURES = path.join(__dirname, 'fixtures', 'source-policy');

function expectClass(preprocessor, file, expected) {
  const result = classifySource(path.join(FIXTURES, file), { preprocessor });
  if (result.class !== expected) {
    throw new Error(`${file}: expected ${expected}, received ${result.class} (${result.error || JSON.stringify(result.reasons)})`);
  }
  return result;
}

function main() {
  const preprocessor = resolvePreprocessor();
  if (!preprocessor.matchingCompiler || !/^[0-9A-F]{64}$/.test(preprocessor.matchingCompiler.executableSha256)) {
    throw new Error('source-policy matching compiler contract is not authenticated');
  }
  const cases = [
    ['ordinary.c', SOURCE_CLASSES.PURE_C],
    ['inline_asm.c', SOURCE_CLASSES.HYBRID_C],
    ['asm_volatile.c', SOURCE_CLASSES.HYBRID_C],
    ['register_asm.c', SOURCE_CLASSES.HYBRID_C],
    ['hidden_macro.c', SOURCE_CLASSES.HYBRID_C],
    ['comment.c', SOURCE_CLASSES.PURE_C],
    ['string.c', SOURCE_CLASSES.PURE_C],
    ['section_injection.c', SOURCE_CLASSES.HYBRID_C],
    ['include_assembly.c', SOURCE_CLASSES.HYBRID_C],
    ['preprocess_failure.c', SOURCE_CLASSES.UNKNOWN],
    ['assembly.s', SOURCE_CLASSES.ASM],
  ];
  const results = cases.map(([file, expected]) => ({ file, expected, result: expectClass(preprocessor, file, expected) }));
  const hiddenAgain = expectClass(preprocessor, 'hidden_macro.c', SOURCE_CLASSES.HYBRID_C);
  const hidden = results.find((item) => item.file === 'hidden_macro.c').result;
  if (hidden.digest !== hiddenAgain.digest) throw new Error('source-policy classification is not deterministic');
  if (!hidden.reasons.some((reason) => reason.stage === 'preprocessed' && reason.code === 'assembler-keyword')) {
    throw new Error('macro-hidden assembler was not detected in preprocessed source');
  }
  const sharedTargets = classifyTargetSources([
    { symbol: 'ordinary_fixture', source: 'tests/fixtures/source-policy/ordinary.c', bytes: 4 },
    { symbol: 'inline_fixture', source: 'tests/fixtures/source-policy/inline_asm.c', bytes: 4 },
  ], { preprocessor });
  if (sharedTargets.counts.PURE_C !== 1 || sharedTargets.counts.HYBRID_C !== 1
      || sharedTargets.counts.UNKNOWN !== 0 || sharedTargets.counts.ASM !== 0) {
    throw new Error('shared target source classification census drift');
  }
  const firstSharedDigests = sharedTargets.targets.map((target) => target.digest);
  applyCompilerAssemblyDialect(Buffer.from('\t.text\n\taddiu $2,$4,1\n'), SOURCE_CLASSES.PURE_C);
  applyCompilerAssemblyDialect(Buffer.from(' #APP\n\tmove $2,$4\n'), SOURCE_CLASSES.HYBRID_C);
  const afterAdapter = classifyTargetSources([
    { symbol: 'ordinary_fixture', source: 'tests/fixtures/source-policy/ordinary.c', bytes: 4 },
    { symbol: 'inline_fixture', source: 'tests/fixtures/source-policy/inline_asm.c', bytes: 4 },
  ], { preprocessor });
  if (JSON.stringify(firstSharedDigests) !== JSON.stringify(afterAdapter.targets.map((target) => target.digest))) {
    throw new Error('adapter use changed source classification');
  }
  for (const escaped of ['../outside.c', path.resolve(FIXTURES, 'ordinary.c')]) {
    try {
      classifyTargetSources([{ symbol: 'escaped_fixture', source: escaped, bytes: 4 }], { preprocessor });
    } catch (error) {
      if (/escapes the repository/.test(error.message)) continue;
      throw error;
    }
    throw new Error(`escaped source path was accepted: ${escaped}`);
  }
  console.log(JSON.stringify({
    status: 'pass',
    preprocessor: { sha256: preprocessor.sha256, version: preprocessor.version, matchingCompiler: preprocessor.matchingCompiler },
    cases: results.map((item) => ({ file: item.file, expected: item.expected, actual: item.result.class, digest: item.result.digest })),
    deterministicMacroHiddenClassification: true,
    sharedClassification: sharedTargets.counts,
    adapterClassificationInvariant: true,
    escapedPathsRejected: true,
  }, null, 2));
}

main();
