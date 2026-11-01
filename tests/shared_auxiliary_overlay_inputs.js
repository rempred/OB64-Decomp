'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
module.exports=function(c){const {root,privateRoot,inputs,model,targets,active,hash}=c,inputSet=require(path.join(root,'tools/lib/matching/input_set'));
if(!inputs)return{skipped:'pass --inputs with an accepted selected set for selected-copy falsifiers'};
const original=inputs.manifest,names=['config/phase7/conventional-build.json','config/overlays/us_rev0.json','config/splat/us_rev0.overlay-linker-inputs.json','build/baserom.us_rev0.z64','tools/lib/overlay_config.js','tools/lib/rom.js'],checks=[];
const fixture=(name,mutate)=>{const dir=fs.mkdtempSync(path.join(privateRoot,'selected-'+name+'-')),manifest={...original,files:structuredClone(original.files.filter(r=>names.includes(r.logical))),directories:[]};for(const record of manifest.files.filter(r=>r.storage==='copy')){const file=path.join(dir,'data',record.logical);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,inputSet.read(inputs,path.join(root,record.logical)));}if(mutate)mutate(manifest,dir);const file=path.join(dir,'manifest.json');fs.writeFileSync(file,JSON.stringify(manifest));const selected=inputSet.openInputSet(file),f=structuredClone({targets,model});inputSet.bind(f.model,selected);for(const t of f.targets)t.model=f.model;return f;};
const good=fixture('authentic');active.validateAuxiliaryOwnerGroups(good.targets,good.model);
function reject(name,mutate){assert.throws(()=>{const f=fixture(name,mutate);active.validateAuxiliaryOwnerGroups(f.targets,f.model);},undefined,name);checks.push(name);}
reject('changed-selected-overlay',(m,d)=>{const r=m.files.find(r=>r.logical==='config/overlays/us_rev0.json'),file=path.join(d,'data',r.logical),value=JSON.parse(fs.readFileSync(file));value.descriptors[12].fields.textEnd='0x8021F460';const b=Buffer.from(JSON.stringify(value));fs.writeFileSync(file,b);r.bytes=b.length;r.sha256=hash(b);});
reject('missing-parser-enrollment',m=>{m.files=m.files.filter(r=>r.logical!=='tools/lib/overlay_config.js');});
reject('stale-parser-enrollment',m=>{m.files.find(r=>r.logical==='tools/lib/overlay_config.js').sha256='0'.repeat(64);});
reject('missing-descriptor-config',m=>{m.files=m.files.filter(r=>r.logical!=='config/overlays/us_rev0.json');});
return{authenticSelectedCopies:true,checks,scope:'bounded test manifests with actual copied accepted inputs, not capture or acceptance'};};
