'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),cp=require('child_process');
const m=require('../tools/lib/c_interfaces');
const root=process.env.OB64_INTERFACE_TEST_ROOT||path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(process.env.OB64_INTERFACE_TEST_CONFIG||path.join(root,'config/c-interface-frontend.json')));
const original=m.authenticate(root,config);
const scratch=fs.mkdtempSync(path.join(process.env.OB64_INTERFACE_TEST_SCRATCH||path.join(root,'build'),'interface-seals-'));
const output=path.join(scratch,'build');fs.mkdirSync(path.join(output,'src'),{recursive:true});fs.mkdirSync(path.join(scratch,'config/splat'),{recursive:true});
const tool=path.join(scratch,'clang.exe');fs.copyFileSync(original,tool);
const local={...config,executable:{...config.executable,path:'clang.exe'}};
function write(base,file,value){const bytes=Buffer.from(typeof value==='string'?value:JSON.stringify(value));const absolute=path.join(base,file);fs.writeFileSync(absolute,bytes);return{path:file,bytes:bytes.length,sha256:m.digest(bytes)};}
const input=write(output,'src/f.c','void f(void){}');
const elf=write(output,'phase8.elf-report.json',{sections:[{index:0,name:'',flags:0},{index:1,name:'.f',flags:6,address:100,size:4}],symbols:[{name:'f',binding:1,symbolType:2,size:4,value:100,sectionIndex:1}]});
const link=write(scratch,'config/link.json',{symbols:[]}),placement=write(scratch,'config/splat/us_rev0.overlay-linker-inputs.json',{overlayReservations:[]});
const authored=write(scratch,'authored.c','void f(void){}'),header=write(scratch,'header.h','typedef int I;');
const build={outputs:{elfReport:elf},acceptedInputs:{linkageConfig:link,phase7Model:[placement],cSources:[authored],cDependencies:[header]},targetReplacements:[{sourceSha256:input.sha256,compilationInput:input,compilerTextFunctions:[{symbol:'f',binding:'GLOBAL'}],owners:[{sectionName:'.f'}],relocations:[]}]};
const baseline={schemaVersion:1,purpose:'reviewed-existing-interface-debt',findings:[],producers:[],limitations:[]};
write(scratch,'config/c-interface-baseline.json',baseline);
assert(m.run(scratch,output,build,local,baseline).verdict.pass);
const actualSpawn=cp.spawnSync;
for(const kind of ['expanded-source','frontend','linkage-config','reservation-config','authored-source','header','baseline']) {
  let changed=false;
  cp.spawnSync=(...args)=>{const result=actualSpawn(...args);if(!changed){changed=true;const file=kind==='expanded-source'?path.join(output,input.path):kind==='frontend'?tool:kind==='linkage-config'?path.join(scratch,link.path):kind==='authored-source'?path.join(scratch,authored.path):kind==='header'?path.join(scratch,header.path):kind==='baseline'?path.join(scratch,'config/c-interface-baseline.json'):path.join(scratch,placement.path);fs.appendFileSync(file,' ');}return result;};
  try{assert.throws(()=>m.run(scratch,output,build,local,baseline),/identity mismatch|missing\/changed|baseline changed/);}finally{cp.spawnSync=actualSpawn;}
  fs.writeFileSync(path.join(output,input.path),'void f(void){}');fs.copyFileSync(original,tool);
  write(scratch,link.path,{symbols:[]});write(scratch,placement.path,{overlayReservations:[]});
  write(scratch,authored.path,'void f(void){}');write(scratch,header.path,'typedef int I;');write(scratch,'config/c-interface-baseline.json',baseline);
}
assert.throws(()=>m.checkedFile(output,'../escape',{bytes:1,sha256:'0'.repeat(64)}),/escaping/);
console.log(JSON.stringify({status:'pass',assertions:9,scratch,scope:'real frontend; post-scan authored/expanded source, header, tool, baseline, linkage, reservation drift'}));
