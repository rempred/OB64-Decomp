#!/usr/bin/env node
'use strict';
const fs=require('fs'), path=require('path');
const root=path.resolve(__dirname,'..');
const checker=require('./lib/c_interfaces');
function main(args) {
  if(args.length!==4 || args[0]!=='--build' || args[2]!=='--report') throw new Error('Usage: node tools/check_c_interfaces.js --build <retained build> --report <output.json>');
  const output=path.resolve(args[1]), report=JSON.parse(fs.readFileSync(path.join(output,'build-report.json')));
  const config=JSON.parse(fs.readFileSync(path.join(root,'config/c-interface-frontend.json')));
  const baseline=JSON.parse(fs.readFileSync(path.join(root,'config/c-interface-baseline.json')));
  const result=checker.run(root,output,report,config,baseline);
  fs.writeFileSync(path.resolve(args[3]),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({coverage:result.coverage,conflicts:result.findings.length,pass:result.verdict.pass,elapsedMs:result.elapsedMs}));
  console.log('Retained-input source diagnostic only; this command does not establish fresh ROM acceptance.');
  if(!result.verdict.pass)process.exitCode=1;
}
if(require.main===module)try{main(process.argv.slice(2));}catch(e){console.error(e.message);process.exitCode=1;}
module.exports={main};
