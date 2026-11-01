'use strict';
// Exercise the actual match.js main/parser with the unchanged selected-input
// reader on small synthetic repositories. No acceptance or native tool runs.
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), vm = require('vm');
const api = require('../tools/lib/matching/input_set');
const { ROOT } = require('../tools/lib/phase7_conventional');
const output = fs.mkdtempSync(path.join(ROOT, 'build/tests/input-refresh-'));
const cliSource = fs.readFileSync(path.join(ROOT, 'tools/match.js'), 'utf8');
const eligible = ['tools/lib/diff_preprocess_cache.js', 'tools/match.js'];
const anchors = ['tools/lib/matching/input_set.js', 'tools/lib/current_workflow.js', 'tools/lib/source_policy.js'];
const stateLogical = 'build/current/state.json';
const write = (file, value) => { fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, value); };
let checks = 0;
function fixture(name) {
  const root = path.join(output, name), directory = path.join(root, 'build/selected');
  const file = path.join(directory, 'manifest.json'), successor = path.join(directory, 'successor.json');
  const state = {schemaVersion:7, status:'verified', verifiedAt:'fixture-time', fingerprint:'A'.repeat(64),
    baselineFingerprint:'B'.repeat(64), output:path.join(root,'build/accepted'),
    buildReport:{bytes:4,sha256:'C'.repeat(64)}, verificationSha256:'D'.repeat(64), freshCompilationSha256:'E'.repeat(64)};
  const accepted = Object.fromEntries(['fingerprint','baselineFingerprint','output','buildReport','verificationSha256','freshCompilationSha256'].map(key=>[key,state[key]]));
  const files = [];
  for (const logical of [...anchors,...eligible,'tools/unread.js']) {
    const original=path.join(root,logical); write(original,'original '+logical);
    files.push({logical,storage:'reference',path:original,...api.identity(original)});
  }
  for (const [logical,text] of [[stateLogical,JSON.stringify(state)],['src/unread.c','unchanged source']]) {
    write(path.join(root,logical),text);const copy=path.join(directory,'data',logical);write(copy,text);
    files.push({logical,storage:'copy',...api.identity(copy)});
  }
  const manifest={schemaVersion:1,kind:'ob64-private-inputs',repository:root,accepted,runtime:{fixture:true},files,
    directories:[{logical:'src',storage:'copy',members:['unread.c']}],unavailableResearchReferences:[{fixture:'retained'}]};
  write(file,JSON.stringify(manifest,null,2)+'\n');
  for (const logical of eligible) write(path.join(root,logical),'reviewed postimage '+logical);
  const args=['refresh-inputs','--from',file,'--from-sha256',api.identity(file).sha256,
    ...eligible.flatMap(logical=>['--replace',logical+'='+api.identity(path.join(root,logical)).sha256]),'--output',successor,'--json'];
  return {root,directory,file,successor,manifest,state,args,
    rewrite(){write(file,JSON.stringify(manifest));args[4]=api.identity(file).sha256;}};
}
function cli(f, hooks={}) {
  const mod={exports:{}}, logs=[], events=[], errors=[];
  let signal;const finished=new Promise(resolve=>{signal=resolve;});
  const forbidden=name=>(..._args)=>{events.push('FORBIDDEN '+name);throw Error('forbidden API '+name);};
  const wrappedApi={...api, openInputSet:forbidden('full opening'),captureInputSet:forbidden('capture'),
    authenticateRuntime:forbidden('runtime'),authenticateResearchRuntime:forbidden('research runtime'),
    openLiveResearchInputs:forbidden('live inputs'),
    identity(file){events.push('identity '+path.relative(f.root,file));return api.identity(file);},
    openResearchInputSet(file){
      events.push('metadata '+path.basename(file));
      if(file===f.successor&&hooks.beforeReadback)hooks.beforeReadback(f);
      const inputs=api.openResearchInputSet(file,{root:f.root});
      if(file===f.successor&&hooks.afterReadback)hooks.afterReadback(f);
      return new Proxy({...inputs},{get(target,key){
        if(key==='authenticate'||key==='assertUnchanged')return forbidden(String(key));
        if(key==='closeResearch')return async()=>{
          const parent=file===f.file;events.push(parent?'close':'readback-close');
          if(parent&&hooks.beforeClose)hooks.beforeClose(f);
          await target.closeResearch();assert.equal(target.provenance().consumedFiles,parent?4:0);
          if(parent&&hooks.afterClose)hooks.afterClose(f);
        };
        return target[key];
      }});
    }};
  const fsFacade={...fs,writeFileSync(file,bytes,options){
    assert.equal(file,f.successor);assert.equal(options.flag,'wx');
    if(hooks.write)return hooks.write(file,bytes,options);
    fs.writeFileSync(file,bytes,options);
    if(hooks.afterWrite)hooks.afterWrite(f);
  }};
  const req=name=>name==='fs'?fsFacade:name==='path'?path:name==='./lib/phase7_conventional'?{ROOT:f.root}:
    name==='./lib/matching/input_set'?wrappedApi:new Proxy({},{get(_target,key){return forbidden(name+'.'+String(key));}});
  const processMock={...process,env:{},argv:['node','tools/match.js',...f.args],exitCode:0};
  if(hooks.entry)req.main=mod;
  vm.runInNewContext(cliSource,{module:mod,require:req,Buffer,process:processMock,console:{log:value=>{logs.push(value);signal();},error:value=>{errors.push(value);signal();}}}, {filename:'tools/match.js'});
  return {main:mod.exports.main,parse:mod.exports.parseArgs,logs,events,errors,processMock,finished};
}
async function reject(name, mutate, pattern, hooks) {
  const f=fixture(name);if(mutate)mutate(f);
  const c=cli(f,hooks);await assert.rejects(c.main(f.args),pattern);
  assert.equal(c.logs.length,0,'failed invocation published output');
  assert(!c.events.some(event=>event.startsWith('FORBIDDEN')));checks++;
  return f;
}
async function construct(name, mutate) {
  const f=fixture(name);if(mutate)mutate(f);
  const c=cli(f);await c.main(f.args);assert.equal(c.logs.length,1);
  const report=JSON.parse(c.logs[0]);assert.equal(report.scope,'successor-manifest-only');
  assert.equal(report.fullSelectedClosureCertified,false);assert.equal(report.currentAcceptanceCertified,false);
  assert(!c.events.some(event=>event.startsWith('FORBIDDEN')));checks++;
  return {f,c,report};
}
(async()=>{
  const positive=await construct('positive'), {f,c,report}=positive;
  const next=JSON.parse(fs.readFileSync(f.successor));
  assert.deepEqual(JSON.parse(fs.readFileSync(f.file)),f.manifest);
  const expected=JSON.parse(JSON.stringify(f.manifest));
  for(const logical of eligible)Object.assign(expected.files.find(item=>item.logical===logical),api.identity(path.join(f.root,logical)));
  assert.deepEqual(next,expected,'only named bytes/hash deltas');
  assert.deepEqual(report.delta,eligible.map(logical=>{
    const old=f.manifest.files.find(item=>item.logical===logical);
    return {logical,before:{bytes:old.bytes,sha256:old.sha256},after:api.identity(path.join(f.root,logical))};
  }));
  const strict=api.openInputSet(f.successor,{root:f.root});
  assert.equal(strict.id,report.id);assert.notEqual(strict.id,api.openResearchInputSet(f.file,{root:f.root}).id);
  assert.equal(strict.resolve(path.join(f.root,'src/unread.c')),path.join(f.directory,'data/src/unread.c'));
  assert.deepEqual(c.events.filter(event=>event.startsWith('metadata')),['metadata manifest.json','metadata successor.json']);
  assert.equal(c.events.filter(event=>event==='close').length,1);
  assert.equal(c.events.filter(event=>event==='readback-close').length,1);
  strict.assertUnchanged();checks++;
  // Single replacement is valid; restore the other fixture reference first.
  const one=await construct('single',f=>{write(path.join(f.root,eligible[1]),'original '+eligible[1]);f.args.splice(7,2);});
  assert.equal(one.report.delta.length,1);api.openInputSet(one.f.successor,{root:one.f.root});
  for(const flag of ['--from','--from-sha256','--replace'])for(const command of ['watch','capture-inputs','intake','probe','--help']){
    const f=fixture('isolation-'+checks),c=cli(f);await assert.rejects(c.main([command,flag,'value']),/unknown option/);assert.equal(c.logs.length,0);checks++;
  }
  const parsed=c.parse(['--variant','a','--variant','b','--actual-tail','x=0','--actual-tail','y=4']);
  assert.deepEqual(JSON.parse(JSON.stringify(parsed.options)),{variant:['a','b'],'actual-tail':['x=0','y=4']});checks++;
  for(const value of ['extra','--inputs','--scratch-root','--native-concurrency','--source','--variant','--apply','--unknown'])
    await reject('unrelated-'+checks,f=>f.args.push(value),/accepts only/);
  for(const flag of ['--from','--from-sha256','--output','--json'])await reject('repeat-'+checks,f=>f.args.push(flag,'unused'),/may not be repeated/);
  for(const flag of ['--from','--from-sha256','--replace','--output'])await reject('missing-value-'+checks,f=>f.args=[...f.args,flag],/requires a value|may not be repeated/);
  await reject('missing-replacement',f=>f.args.splice(5,4),/requires .*--replace/);
  await reject('wrong-parent',f=>f.args[4]='0'.repeat(64),/parent SHA-256 differs/);
  await reject('bad-hash',f=>f.args[4]='bad',/expected SHA-256/);
  await reject('malformed-parent',f=>{write(f.file,'{');f.args[4]=api.identity(f.file).sha256;},/malformed manifest/);
  for(const operation of ['add','remove'])await reject('membership-'+operation,f=>{
    if(operation==='add')f.manifest.files.push({logical:'new.c',storage:'copy',bytes:0,sha256:'0'.repeat(64)});
    else f.manifest.files.pop();write(f.file,JSON.stringify(f.manifest));
  },/parent SHA-256 differs/);
  await reject('duplicate-record',f=>{f.manifest.files.push(f.manifest.files[0]);f.rewrite();},/duplicate file/);
  await reject('bad-record',f=>{f.manifest.files[0].extra=true;f.rewrite();},/malformed file/);
  await reject('wrong-repository',f=>{f.manifest.repository='elsewhere';f.rewrite();},/repository identity/);
  for(const logical of [...anchors,stateLogical,...eligible])await reject('missing-record-'+checks,f=>{
    f.manifest.files=f.manifest.files.filter(item=>item.logical!==logical);f.rewrite();
  },/required .* record/);
  for(const logical of [...anchors,...eligible])await reject('copied-reference-'+checks,f=>{
    const record=f.manifest.files.find(item=>item.logical===logical);record.storage='copy';delete record.path;f.rewrite();
  },/required reference record/);
  await reject('reference-state',f=>{const r=f.manifest.files.find(item=>item.logical===stateLogical);r.storage='reference';r.path=path.join(f.root,stateLogical);f.rewrite();},/required copy record/);
  for(const logical of anchors)await reject('anchor-drift-'+checks,f=>write(path.join(f.root,logical),'drift'),/content drift/);
  await reject('copied-state-drift',f=>write(path.join(f.directory,'data',stateLogical),'{}'),/content drift/);
  await reject('live-state-drift',f=>write(path.join(f.root,stateLogical),'{}'),/live CURRENT state identity differs/);
  for(const field of ['schemaVersion','status','verifiedAt','fingerprint','baselineFingerprint','output','buildReport','verificationSha256','freshCompilationSha256'])await reject('state-binding-'+field,f=>{
    f.state[field]=field==='verifiedAt'?'':field==='schemaVersion'?6:'wrong';
    const text=JSON.stringify(f.state),copy=path.join(f.directory,'data',stateLogical);
    write(copy,text);write(path.join(f.root,stateLogical),text);
    Object.assign(f.manifest.files.find(item=>item.logical===stateLogical),api.identity(copy));f.rewrite();
  },/accepted state binding differs/);
  await reject('wrong-postimage',f=>f.args[6]=eligible[0]+'='+'0'.repeat(64),/reviewed postimage differs/);
  await reject('duplicate-replacement',f=>f.args.push('--replace',f.args[6]),/duplicate replacement/);
  await reject('no-op',f=>{write(path.join(f.root,eligible[0]),'original '+eligible[0]);f.args[6]=eligible[0]+'='+api.identity(path.join(f.root,eligible[0])).sha256;},/unchanged/);
  for(const logical of ['tools/lib/source_policy.js','tools/new.js','tools/../tools/match.js','TOOLS/match.js'])await reject('ineligible-'+checks,f=>f.args[6]=logical+'='+'A'.repeat(64),/ineligible/);
  await reject('reference-alias',f=>{f.manifest.files.find(item=>item.logical===eligible[0]).path=path.join(f.root,'different.js');f.rewrite();},/logical\/physical mismatch/);
  for(const type of ['file','directory','hardlink','junction'])await reject('existing-'+type,f=>{
    if(type==='file')write(f.successor,'retain me');
    if(type==='directory')fs.mkdirSync(f.successor);
    if(type==='hardlink')fs.linkSync(path.join(f.root,'tools/unread.js'),f.successor);
    if(type==='junction')fs.symlinkSync(path.join(f.directory,'data'),f.successor,'junction');
  },/EEXIST|EISDIR|EPERM/);
  await reject('same-output',f=>f.args[10]=f.file,/new sibling/);
  await reject('nonsibling',f=>f.args[10]=path.join(f.directory,'data/new.json'),/new sibling/);
  await reject('outside-build',f=>{f.args[2]=path.join(f.root,'parent.json');write(f.args[2],fs.readFileSync(f.file));},/ignored build/);
  await reject('traversal',f=>f.args[2]=path.dirname(f.file)+path.sep+'..'+path.sep+'selected'+path.sep+'manifest.json',/invalid manifest path/);
  for(const type of ['parent','anchor','replacement','state'])await reject('hardlink-'+type,f=>{
    const file=type==='parent'?f.file:path.join(f.root,type==='anchor'?anchors[0]:type==='replacement'?eligible[0]:stateLogical);
    fs.linkSync(file,path.join(f.root,'link-copy'));
  },/multiply linked/);
  await reject('ancestor-junction',f=>{
    const alias=path.join(f.root,'build/alias');fs.symlinkSync(f.directory,alias,'junction');f.args[2]=path.join(alias,'manifest.json');f.args[10]=path.join(alias,'successor.json');
  },/redirected path/);
  for(const subject of ['parent','anchor','copied-state'])await reject('close-'+subject,null,/manifest changed|content drift/,{beforeClose(f){
    const file=subject==='parent'?f.file:subject==='anchor'?path.join(f.root,anchors[0]):path.join(f.directory,'data',stateLogical);fs.appendFileSync(file,'drift');
  }});
  for(const subject of ['live-state','replacement'])await reject('late-'+subject,null,/identity differs/,{afterClose(f){fs.appendFileSync(path.join(f.root,subject==='live-state'?stateLogical:eligible[0]),'drift');}});
  const partial=await reject('partial-write',null,/interrupted/,{write(file,bytes,options){fs.writeFileSync(file,bytes.subarray(0,32),options);throw Error('interrupted');}});
  assert.throws(()=>api.openInputSet(partial.successor,{root:partial.root}),/malformed manifest/);
  const complete=await reject('complete-unreported',null,/interrupted/,{write(file,bytes,options){fs.writeFileSync(file,bytes,options);throw Error('interrupted');}});
  api.openInputSet(complete.successor,{root:complete.root});checks++;
  await reject('readback-change',null,/readback differs/,{afterWrite(f){const value=JSON.parse(fs.readFileSync(f.successor));value.files.push({logical:'extra.c',storage:'copy',bytes:0,sha256:'0'.repeat(64)});write(f.successor,JSON.stringify(value));}});
  await reject('readback-hardlink',null,/multiply linked/,{afterWrite(f){fs.linkSync(f.successor,path.join(f.root,'output-link'));}});
  let published;
  await reject('readback-byte-id-binding',null,/manifest changed/,{beforeReadback(f){published=fs.readFileSync(f.successor);fs.appendFileSync(f.successor,' ');},afterReadback(f){write(f.successor,published);}});
  for(const type of ['reference','copy','directory']){
    const {f}=await construct('unread-'+type,f=>{
      if(type==='reference')write(path.join(f.root,'tools/unread.js'),'drift');
      if(type==='copy')write(path.join(f.directory,'data/src/unread.c'),'drift');
      if(type==='directory')write(path.join(f.directory,'data/src/new.c'),'drift');
    });
    assert.throws(()=>api.openInputSet(f.successor,{root:f.root}),/content drift|membership drift/);checks++;
  }
  for(const type of ['reference','copy','directory']){
    const {f}=await construct('later-'+type),inputs=api.openInputSet(f.successor,{root:f.root});
    if(type==='reference')write(path.join(f.root,'tools/unread.js'),'drift');
    if(type==='copy')write(path.join(f.directory,'data/src/unread.c'),'drift');
    if(type==='directory')write(path.join(f.directory,'data/src/new.c'),'drift');
    assert.throws(()=>inputs.assertUnchanged(),/content drift|membership drift/);checks++;
  }
  for(const bad of [false,true]){
    const f=fixture('process-entry-'+bad);if(bad)f.args[4]='0'.repeat(64);
    const c=cli(f,{entry:true});
    await c.finished;
    assert.equal(c.logs.length,bad?0:1);assert.equal(c.errors.length,bad?1:0);
    assert.equal(c.processMock.exitCode,bad?1:0);checks++;
  }
  console.log(JSON.stringify({status:'pass',checks,output,scope:'actual CLI main/parser and unchanged reader on bounded fixtures',
    nativeCalls:0,currentAcceptanceCertified:false,fullSelectedClosureCertified:false}));
})().catch(error=>{console.error(error);process.exitCode=1;});
