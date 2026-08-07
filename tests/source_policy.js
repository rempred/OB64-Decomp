#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  SOURCE_CLASSES,
  classifySource,
  resolvePreprocessor,
} = require('../tools/lib/source_policy');

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
  console.log(JSON.stringify({
    status: 'pass',
    preprocessor: { sha256: preprocessor.sha256, version: preprocessor.version, matchingCompiler: preprocessor.matchingCompiler },
    cases: results.map((item) => ({ file: item.file, expected: item.expected, actual: item.result.class, digest: item.result.digest })),
    deterministicMacroHiddenClassification: true,
  }, null, 2));
}

main();
