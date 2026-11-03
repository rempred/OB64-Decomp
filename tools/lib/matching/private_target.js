'use strict';
const diagnostic=require('./diagnostic_context'),model=require('./target_model'),compiler=require('./compiler');
function prepare(inputs,symbol,matchingRoot) {
  require('./scratch_assembly').assertScratchEnvironment();
  diagnostic.authenticateCode(inputs);
  let context;
  try {context=diagnostic.load({inputs,symbol});}
  catch(error) {
    // Only named selection/capability exclusions from diagnostic.load are local.
    // Byte, identity, proof, placement-contract and global metadata failures stay shared.
    const localExclusions = new Set([
      'target original owner missing/ambiguous', 'partial continuation selection',
      'incomplete continuation selection', 'exact continuation spelling required',
      'continuation symbol conflict', 'complete multi-owner producer required',
      'complete-group-candidate-required', 'unsupported diagnostic producer representation',
      'atomic-owner-candidate-required', 'unsupported complete physical producer',
      'unqualified runtime placement', 'unsupported logical coverage',
      'unsupported complete owner coverage', 'unsupported complete owner linkage representation',
      'unsupported complete owner producer membership', 'unsupported fixed entry caller',
    ]);
    if (typeof error.message === 'string' && error.message.startsWith('candidate diagnostic: ')
        && localExclusions.has(error.message.slice('candidate diagnostic: '.length))) error.preflightScope='target';
    throw error;
  }
  const workbench=context.workbench,target=model.resolveTarget(workbench,symbol);
  try{model.assertScratchCapability(workbench,target);}catch(error){error.preflightScope='target';throw error;}
  const session=compiler.prepareCompilerSession({context,inputs,matchingRoot,privateTarget:target});
  return {context,workbench,target,session};
}
module.exports={prepare};
