'use strict';
// Read-only actual retained selected-input corpus. No fixture acceptance oracle.
const path=require('path'),assert=require('assert');
const root=process.env.OB64_INTERFACE_TEST_ROOT||path.resolve(__dirname,'..');
const manifest=process.env.OB64_INTERFACE_HISTORICAL_INPUTS;
if(!manifest)throw Error('Set OB64_INTERFACE_HISTORICAL_INPUTS to a real retained manifest.json');
const loader=require('./c_interface_test_loader')(root,path.resolve(__dirname,'..'));
const inputSet=loader.load('tools/lib/matching/input_set.js'),diagnostic=loader.load('tools/lib/matching/diagnostic_context.js');
(async()=>{
  const start=performance.now(),inputs=inputSet.openDiagnosticInputs(manifest),symbol='func_000E5938';
  const context=diagnostic.load({inputs,symbol});assert(diagnostic.isDiagnosticContext(context));
  const state=JSON.parse(inputs.read(path.join(root,'build/current/state.json'))),fresh=JSON.parse(inputs.read(state.freshCompilationReport));
  assert.strictEqual(diagnostic.validateInterfaceEvidence(inputs,state,fresh,inputs.manifest.accepted).version,0);
  await inputs.closeResearch();
  console.log(JSON.stringify({status:'pass',manifest,symbol,elapsedMs:performance.now()-start,scope:'actual retained historical proof/producer load, no synthetic acceptance oracle',provenance:inputs.provenance()}));
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
