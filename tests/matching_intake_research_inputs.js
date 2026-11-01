'use strict';

const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const api=require('../tools/lib/matching/input_set');
const ROOT=path.resolve(__dirname,'..'); fs.mkdirSync(path.join(ROOT,'build/tests'),{recursive:true});
const base=fs.mkdtempSync(path.join(ROOT,'build/tests/intake-research-')),root=path.join(base,'repo'),set=path.join(base,'set');fs.mkdirSync(root);fs.mkdirSync(set);fs.mkdirSync(path.join(root,'include'));fs.writeFileSync(path.join(root,'include/a.h'),'#define A 1\n');fs.writeFileSync(path.join(root,'unused'),'unused');
const files=['include/a.h','unused'].map(logical=>({logical,storage:'reference',path:path.join(root,logical),...api.identity(path.join(root,logical))}));
const manifest={schemaVersion:1,kind:'ob64-private-inputs',repository:root,accepted:{fingerprint:'A'.repeat(64)},files,directories:[{logical:'include',storage:'reference',path:path.join(root,'include'),members:['a.h']}]};const file=path.join(set,'manifest.json');fs.writeFileSync(file,JSON.stringify(manifest));
const open=()=>api.openResearchInputSet(file,{root});let count=0;const pass=()=>count++;
(async()=>{
 let r=open();assert(api.isResearch(r));assert.throws(()=>api.assertProduction(r),/research-only/);assert.throws(()=>r.authenticate({}),/research-only/);pass();
 const value=api.bind({},r),copy={...value}; const strict=api.openInputSet(file,{root});assert.throws(()=>api.bind({...value},strict),/context replacement/);assert.throws(()=>api.bind({model:value},strict),/mixed model input context/);assert.equal(api.context(copy),r);assert.throws(()=>api.assertProduction(api.context(copy)),/research-only/);pass();
 const textContract=require('../tools/lib/text_contract');
 const model=api.bind({},r),target=api.bind({model,symbol:'fixture'},r);
 for(const candidate of [target,{...target},{model,symbol:'fixture'}])assert.throws(()=>textContract.resolveTextContract(candidate),/research-only/);pass();
 const bytes=r.read('include/a.h');bytes[0]=0;assert.equal(r.read('include/a.h').toString(),'#define A 1\n');await r.closeResearch();pass();
 fs.writeFileSync(path.join(root,'unused'),'CHANGED');await r.closeResearch();assert.throws(()=>api.openInputSet(file,{root}),/content drift/);fs.writeFileSync(path.join(root,'unused'),'unused');pass();
 fs.writeFileSync(path.join(root,'include/a.h'),'#define A 2\n');assert.equal(r.read('include/a.h').toString(),'#define A 1\n');await assert.rejects(()=>r.closeResearch(),/content drift/);fs.writeFileSync(path.join(root,'include/a.h'),'#define A 1\n');pass();
 r=open();r.directoryClosure('include');fs.writeFileSync(path.join(root,'include/new.h'),'new');await assert.rejects(()=>r.closeResearch(),/membership drift/);fs.unlinkSync(path.join(root,'include/new.h'));pass();
 r=open();await r.prefetch(['include/a.h']);const link=path.join(base,'hardlink');fs.linkSync(path.join(root,'include/a.h'),link);await assert.rejects(()=>r.closeResearch(),/multiply linked/);fs.unlinkSync(link);pass();
 r=open();await r.prefetch(['include/a.h']);const include=path.join(root,'include'),moved=path.join(root,'include-original');fs.renameSync(include,moved);fs.symlinkSync(moved,include,'junction');await assert.rejects(()=>r.closeResearch(),/redirected/);fs.unlinkSync(include);fs.renameSync(moved,include);pass();
 r=open();r.read('include/a.h');fs.writeFileSync(file,JSON.stringify({...manifest,kind:'tampered'}));await assert.rejects(()=>r.closeResearch(),/manifest changed/);fs.writeFileSync(file,JSON.stringify(manifest));pass();
 assert.throws(()=>r.read('missing'),/unenrolled/);assert.throws(()=>r.readResearch(path.join(root,'missing')),e=>e.code==='OB64_SELECTED_RESEARCH_UNAVAILABLE');pass();
 r=open();assert.throws(()=>r.sharedImplementation('missing'),/not enrolled/);pass();
 console.log(JSON.stringify({status:'pass',checks:count,fixture:base,scope:'research input reader controls'},null,2));
})().catch(error=>{console.error(error.stack);process.exitCode=1;});


