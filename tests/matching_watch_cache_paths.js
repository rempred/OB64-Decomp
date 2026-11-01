'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),test=require('node:test');
const policy=require('../tools/lib/source_policy');
const {createDiffPreprocessCache}=require('../tools/lib/diff_preprocess_cache');
const ROOT=process.cwd(),BASE=path.join(ROOT,'build/tests/watch-cache');
fs.mkdirSync(BASE,{recursive:true});
const relative=file=>path.relative(ROOT,file).replace(/\\/g,'/');
const identity=file=>({path:relative(file),bytes:fs.statSync(file).size,sha256:policy.sha256File(file)});
function fixture(){
  const root=fs.mkdtempSync(path.join(BASE,'cache-')),source=path.join(root,'unit.c'),tool=path.join(root,'cpp'),config=path.join(root,'config.json'),manifest=path.join(root,'manifest.json'),impl=path.join(root,'impl.js'),cacheRoot=path.join(root,'cache');
  fs.writeFileSync(source,'int unit(void){return 1;}');fs.writeFileSync(tool,'fixture');fs.writeFileSync(manifest,'{}');fs.writeFileSync(impl,'fixture');fs.writeFileSync(config,JSON.stringify({matchingCompiler:{manifest:relative(manifest)}}));
  const pp=()=>({path:tool,sha256:policy.sha256File(tool),version:'fixture',executables:[{...identity(tool),role:'driver',version:'fixture'}],flags:['-P','-undef','-nostdinc'],includeDirectories:[],dependencyMode:'authenticated-depfile',dependencyRoot:ROOT,dependencyTarget:'ob64-compilation-input',configIdentity:identity(config),matchingCompiler:{manifestSha256:policy.sha256File(manifest),executableSha256:'A'.repeat(64),preprocessingMode:'authenticated-external-companion'}});
  let onFresh=null;
  const fresh=(file,preprocessor)=>{if(onFresh)onFresh();const bytes=Buffer.from('int unit(void){return 1;}');return{ok:true,bytes,text:bytes.toString(),stderr:'',args:[...preprocessor.flags,'-MD','-MF',path.join(root,'unused.d'),'-MT',preprocessor.dependencyTarget,'-I',relative(path.dirname(file)),relative(file)],source:identity(file),dependencies:[identity(file)]};};
  const factory=()=>createDiffPreprocessCache({cacheRoot,requestedSources:[],preprocessSource:fresh,resolvePreprocessor:pp,getEnvironment:()=>({TEST:'fixed'}),implementationFiles:[impl]});
  const start=()=>{const c=factory();const result=c.preprocess(source,pp());return{c,result};};
  const first=start();first.c.finish();const entry=path.join(cacheRoot,fs.readdirSync(cacheRoot).find(n=>/^[A-F0-9]{64}$/.test(n)));
  return{root,entry,cacheRoot,source,impl,start,factory,pp,setFresh:fn=>{onFresh=fn;}};
}
function hardlink(file,root){const sentinel=path.join(root,'sentinel-'+path.basename(file));fs.copyFileSync(file,sentinel);const bytes=fs.readFileSync(sentinel);fs.unlinkSync(file);fs.linkSync(sentinel,file);return()=>assert.deepEqual(fs.readFileSync(sentinel),bytes);}
function withoutFile(file,callback){const original=fs.readFileSync(file);fs.unlinkSync(file);try{return callback(original);}finally{/* fixtures and unsafe references are retained */}}
for(const name of ['metadata.json','bytes.bin'])test('failed '+name+' read, fresh and skipped publish cannot swallow safety failure',()=>{
  const f=fixture(),unchanged=hardlink(path.join(f.entry,name),f.root),{c}=f.start();
  assert.equal(c.stats.invalid,1);assert.equal(c.stats.publishSkipped,1);assert.throws(()=>c.finish(),/unsafe entry.*hardlink/);unchanged();
});
test('post-hit hardlink rejects before prepared context escapes',()=>{
  const f=fixture(),{c}=f.start();assert.equal(c.stats.hits,1);const unchanged=hardlink(path.join(f.entry,'bytes.bin'),f.root);let escaped=false;
  assert.throws(()=>{c.finish();escaped=true;},/hardlink/);assert.equal(escaped,false);unchanged();
});
test('safe corrupt metadata, extra regular member and regular-file entry retain fresh fallback',()=>{
  for(const kind of ['metadata','extra','file']){const f=fixture();if(kind==='metadata')fs.writeFileSync(path.join(f.entry,'metadata.json'),'invalid');
    if(kind==='extra')fs.writeFileSync(path.join(f.entry,'extra'),'safe');
    if(kind==='file'){fs.unlinkSync(path.join(f.entry,'metadata.json'));fs.unlinkSync(path.join(f.entry,'bytes.bin'));fs.rmdirSync(f.entry);fs.writeFileSync(f.entry,'safe');}
    const{c}=f.start();assert.equal(c.stats.misses,1);assert.equal(c.stats.publishSkipped,1);assert.doesNotThrow(()=>c.finish());}
});
test('retained unsafe corrupt subtree rejects after benign shape fallback',()=>{
  const f=fixture();fs.mkdirSync(path.join(f.entry,'nested'));const outside=path.join(f.root,'outside');fs.writeFileSync(outside,'sentinel');fs.linkSync(outside,path.join(f.entry,'nested','link'));
  const{c}=f.start();assert.equal(c.stats.invalid,1);assert.throws(()=>c.finish(),/hardlink/);assert.equal(fs.readFileSync(outside,'utf8'),'sentinel');
});
test('entry appearing only during fresh CPP is checked despite publishSkipped',()=>{
  const f=fixture(),held=f.entry+'-held';fs.renameSync(f.entry,held);let unchanged;
  f.setFresh(()=>{fs.renameSync(held,f.entry);unchanged=hardlink(path.join(f.entry,'metadata.json'),f.root);});
  const{c}=f.start();assert.equal(c.stats.publishSkipped,1);assert.throws(()=>c.finish(),/hardlink/);unchanged();
});
test('failed rename winner cannot disappear into writeFailures',()=>{
  const f=fixture(),held=f.entry+'-held';fs.renameSync(f.entry,held);const rename=fs.renameSync;let unchanged;
  fs.renameSync=function(from,to){if(to===f.entry){rename(held,f.entry);unchanged=hardlink(path.join(f.entry,'bytes.bin'),f.root);throw Error('simulated rename collision');}return rename.apply(this,arguments);};
  let c;try{({c}=f.start());}finally{fs.renameSync=rename;}
  assert.equal(c.stats.writeFailures,1);assert.throws(()=>c.finish(),/hardlink/);unchanged();
});
test('safe malformed rename winner keeps fresh fallback',()=>{
  const f=fixture(),held=f.entry+'-held';fs.renameSync(f.entry,held);const rename=fs.renameSync;
  fs.renameSync=function(from,to){if(to===f.entry){rename(held,f.entry);fs.writeFileSync(path.join(f.entry,'metadata.json'),'safe corruption');throw Error('simulated collision');}return rename.apply(this,arguments);};
  let c;try{({c}=f.start());}finally{fs.renameSync=rename;}assert.equal(c.stats.writeFailures,1);assert.doesNotThrow(()=>c.finish());
});
test('stage hardlink remains fatal even after owned cleanup removes the stage',()=>{
  const f=fixture();fs.renameSync(f.entry,f.entry+'-held');const write=fs.writeFileSync;let unchanged;
  fs.writeFileSync=function(file,...args){const result=write.call(this,file,...args);if(String(file).includes('.stage-')&&path.basename(file)==='metadata.json')unchanged=hardlink(file,f.root);return result;};
  let c;try{({c}=f.start());}finally{fs.writeFileSync=write;}
  assert.equal(c.stats.writeFailures,1);assert.equal(fs.readdirSync(f.cacheRoot).some(n=>n.startsWith('.stage-')),false);assert.throws(()=>c.finish(),/hardlink/);unchanged();
});
test('unsafe cleanup survivor is covered and safe stage remnant preserves fallback',()=>{
  for(const unsafe of [false,true]){const f=fixture();fs.renameSync(f.entry,f.entry+'-held');const rename=fs.renameSync,unlink=fs.unlinkSync;let stage,unchanged;
    fs.renameSync=function(from,to){if(to===f.entry){stage=from;throw Error('simulated publish failure');}return rename.apply(this,arguments);};
    fs.unlinkSync=function(file){if(String(file).includes('.stage-'))throw Error('simulated cleanup failure');return unlink.apply(this,arguments);};
    let c;try{({c}=f.start());}finally{fs.renameSync=rename;fs.unlinkSync=unlink;}
    assert(stage&&fs.existsSync(stage));if(unsafe)unchanged=hardlink(path.join(stage,'bytes.bin'),f.root);
    if(unsafe){assert.throws(()=>c.finish(),/hardlink/);unchanged();}else assert.doesNotThrow(()=>c.finish());
  }
});
test('successful exact membership, alias and existing seal precedence remain enforced',()=>{
  const f=fixture(),{c}=f.start();fs.writeFileSync(path.join(f.entry,'extra'),'safe');assert.throws(()=>c.finish(),/successful entry shape/);
  const g=fixture(),second=g.start().c,outside=g.entry+'-outside';fs.renameSync(g.entry,outside);fs.symlinkSync(outside,g.entry,'junction');assert.throws(()=>second.finish(),/unsafe entry.*(link|alias)/);
  const h=fixture(),third=h.start().c;hardlink(path.join(h.entry,'bytes.bin'),h.root);fs.appendFileSync(h.impl,' drift');assert.throws(()=>third.finish(),/implementation drift/);
});
test('missing consumed entry and removed stages are not required to persist',()=>{
  const f=fixture(),{c}=f.start();fs.renameSync(f.entry,f.entry+'-retained');assert.doesNotThrow(()=>c.finish());
});

test('root or retained stage replacement cannot reuse saved absolute-path authority',()=>{
 const f=fixture(),{c}=f.start(),held=f.cacheRoot+'-held';fs.renameSync(f.cacheRoot,held);fs.symlinkSync(held,f.cacheRoot,'junction');
 assert.throws(()=>c.finish(),/unsafe entry.*(link|alias)/);
 const g=fixture();fs.renameSync(g.entry,g.entry+'-held');const rename=fs.renameSync,unlink=fs.unlinkSync;let stage;
 fs.renameSync=function(from,to){if(to===g.entry){stage=from;throw Error('publication failure');}return rename.apply(this,arguments);};
 fs.unlinkSync=function(file){if(String(file).includes('.stage-'))throw Error('cleanup failure');return unlink.apply(this,arguments);};
 let second;try{second=g.start().c;}finally{fs.renameSync=rename;fs.unlinkSync=unlink;}
 const outside=stage+'-retained';fs.renameSync(stage,outside);fs.symlinkSync(outside,stage,'junction');
 const before=fs.readFileSync(path.join(outside,'bytes.bin'));assert.throws(()=>second.finish(),/unsafe entry.*(link|alias)/);assert.deepEqual(fs.readFileSync(path.join(outside,'bytes.bin')),before);
});

test('unsafe entry-file predicate precedes content reads through either hardlink',()=>{
 for(const name of ['bytes.bin','metadata.json']){
  const f=fixture(),file=path.join(f.entry,name),unchanged=hardlink(file,f.root),read=fs.readFileSync;let unsafeReads=0;
  fs.readFileSync=function(target,...args){if(path.resolve(String(target))===file)unsafeReads++;return read.call(this,target,...args);};
  let c;try{c=f.start().c;assert.throws(()=>c.finish(),/hardlink/);}finally{fs.readFileSync=read;}
  assert.equal(unsafeReads,0);unchanged();
 }
});
