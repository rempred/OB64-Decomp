'use strict';
const fs=require('fs'),path=require('path');
const api=require('./input_set'),paths=require('../execution_paths'),scope=require('./private_workspace');
const diagnostic=require('./diagnostic_context'),privateTarget=require('./private_target');
function reportPath(file,manifest,workspace) {
  const absolute=path.resolve(file),ignored=path.join(paths.ROOT,'build')+path.sep;
  if(!absolute.startsWith(ignored)||fs.existsSync(absolute))throw Error('preflight report must be new under build');
  for(const directory of [path.join(paths.ROOT,'build/matching'),path.join(paths.ROOT,'build/matching-tools'),path.dirname(path.resolve(manifest))]) {
    if(absolute===directory||absolute.startsWith(directory+path.sep))throw Error('preflight report overlaps protected input/private root');
  }
  api.regular(path.dirname(absolute),true);return absolute;
}
async function run(symbols,options,workspace) {
  if(!symbols.length||symbols.some(s=>typeof s!=='string'||!s))throw Error('preflight requires the complete assigned symbol list');
  const outputFile=reportPath(options.output,options.inputs,workspace),rows=[];
  const opening=api.openDiagnosticInputs(options.inputs,{privateRoot:workspace.matchingRoot});
  const python=api.authenticateRuntime(opening);diagnostic.authenticateCode(opening);await opening.closeResearch();
  let report;
  await scope.withPrivateWorkspace(workspace,{python,isolatedPython:true,native:false},async()=>{
    const seen=new Set();let fatal=null;
    for(const requested of symbols) {
      if(fatal){rows.push({requested,status:'not-attempted',reason:'shared prerequisite failed: '+fatal});continue;}
      if(seen.has(requested.toLowerCase())){rows.push({requested,status:'duplicate'});continue;}
      let inputs,prepared,error;
      try {
        inputs=api.openDiagnosticInputs(options.inputs,{privateRoot:workspace.matchingRoot});
        api.authenticateRuntime(inputs);
        prepared=privateTarget.prepare(inputs,requested,workspace.matchingRoot);
      } catch(e) {error=e;}
      if(inputs)try{diagnostic.authenticateCode(inputs);await inputs.closeResearch();}catch(e){error=e;error.preflightScope='shared';}
      if(error){rows.push({requested,status:'rejected',reason:error.message});if(error.preflightScope!=='target')fatal=error.message;continue;}
      const {context,target}=prepared,expectation=diagnostic.completeOwnerExpectation(context,target);
      if(seen.has(target.symbol.toLowerCase())){rows.push({requested,canonicalSymbol:target.symbol,status:'duplicate-alias'});continue;}
      seen.add(target.symbol.toLowerCase());
      rows.push({requested,canonicalSymbol:target.symbol,status:requested===target.symbol?'prepared':'alias',
        bytes:target.bytes,romStart:target.romStart,romEndExclusive:target.romEndExclusive,vramStart:target.vramStart,
        expectedBytesSha256:target.expectedBytesSha256,inputSetId:inputs.id,bundleId:paths.bundle()?.id||null,
        owners:expectation?.owners.map(o=>({rowIndex:o.rowIndex,symbol:o.symbol,bytes:o.bytes,romStart:o.romStart,romEndExclusive:o.romEndExclusive,sha256:o.sha256}))||[{rowIndex:target.rowIndex,symbol:target.symbol,bytes:target.bytes}],
        functions:expectation?.functions||target.logicalFunctions?.map(f=>({symbol:f.symbol,offset:f.offset,bytes:f.bytes}))||[{symbol:target.symbol,offset:0,bytes:target.bytes}]});
    }
    report={schemaVersion:1,status:rows.every(r=>r.status==='prepared')?'prepared':'blocked',sourceIndependentOnly:true,
      limitations:'No source classification, emitted function/table/relocation shape, matching bytes or canonical acceptance is established.',targets:rows};
  });
  // Only the guarded child has a report; all wrapper postchecks have returned.
  if(report) {
    paths.bundle()?.close();scope.assertPrivateWorkspace(workspace);
    reportPath(outputFile,options.inputs,workspace);
    fs.writeFileSync(outputFile,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
    if(report.status!=='prepared')process.exitCode=2;
  }
  return report;
}
module.exports={run,reportPath};
