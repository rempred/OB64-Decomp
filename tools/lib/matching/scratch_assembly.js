'use strict';

// Scratch diagnostics use the same native instruction spelling and enabled
// VR4300 multiply workaround as the pinned production assembler. Section
// assignment remains the only scratch assembly transformation.
const SCRATCH_ASSEMBLY_POLICY = Object.freeze({
  schemaVersion: 1,
  instructions: 'native-mnemonics',
  vr4300MultiplyWorkaround: 'enabled',
});

function assertScratchEnvironment(environment = process.env) {
  for (const [name, value] of Object.entries(environment)) {
    // Windows environment names are case-insensitive. Match the assembler's
    // leading C isspace characters and three-character OFF prefix exactly.
    if (name.toUpperCase() === 'VR4300MUL' && /^[\t\n\v\f\r ]*OFF/i.test(String(value))) {
      throw new Error('scratch diagnostics require the pinned assembler VR4300 multiply workaround; VR4300MUL disables it');
    }
  }
}

function scratchAssemblerInput(compilerBytes, target) {
  const textContract = require('../text_contract');
  const { adjustSectionAssembly } = require('../phase8_matching_c');
  return textContract.assemblerInput(compilerBytes, target, adjustSectionAssembly,
    target.nativeTextTail ? {} : { allowAuxiliaryReadOnlySections: true });
}

module.exports = { SCRATCH_ASSEMBLY_POLICY, assertScratchEnvironment, scratchAssemblerInput };
