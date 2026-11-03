'use strict';
const fs=require('fs'),path=require('path'),paths=require('../execution_paths');
const runtime=require('./tool_bundle_runtime');
const launcher=String.raw`$ErrorActionPreference='Stop'
if ($env:NODE_OPTIONS -or $env:NODE_PATH) { throw 'Node preload environment is not allowed' }
$bundle=Get-Content -LiteralPath (Join-Path $PSScriptRoot 'bundle.json') -Raw | ConvertFrom-Json
$id=(Get-FileHash -LiteralPath (Join-Path $PSScriptRoot 'bundle.json')).Hash
if (-not $id.ToLower().StartsWith((Split-Path -Leaf $PSScriptRoot))) { throw 'Bundle descriptor identity' }
$self=$bundle.members | Where-Object path -eq 'run.ps1'
if ($null -eq $self -or (Get-FileHash -LiteralPath $PSCommandPath).Hash -ne $self.sha256) { throw 'Bundle launcher identity' }
if ((Get-FileHash -LiteralPath $bundle.node.path).Hash -ne $bundle.node.sha256) { throw 'Pinned Node identity' }
& $bundle.node.path (Join-Path $PSScriptRoot 'tools/match.js') @args
exit $LASTEXITCODE
`;
function name(value) {if(!/^[a-f0-9]{16,64}$/.test(value||''))throw Error('tool-bundle requires a version name');return value;}
function inspect(version) {return runtime.inspect(path.join(paths.ROOT,'build/matching-tools',name(version)));}
function publish(reviewedPatchSha256,sourceRoot=paths.CODE_ROOT) {
  paths.assertCanonical();
  if(!/^[A-F0-9]{64}$/.test(reviewedPatchSha256||''))throw Error('reviewed source patch hash required');
  const files=[];
  function add(relative,kind){const file=path.join(sourceRoot,relative);runtime.plain(file);files.push({path:relative,kind,data:fs.readFileSync(file)});}
  function walk(relative){const dir=path.join(sourceRoot,relative);runtime.plain(dir,true);for(const n of fs.readdirSync(dir).sort()){const r=relative+'/'+n,s=fs.lstatSync(path.join(sourceRoot,r));if(s.isDirectory())walk(r);else {if(!n.endsWith('.js'))throw Error('unknown executable dependency: '+r);add(r,'javascript');}}}
  add('tools/match.js','javascript');walk('tools/lib');
  add('tools/matching_workbench/private_guard.py','python');add('tools/matching_workbench/store.py','python');add('tools/matching_workbench/schema.sql','sql');
  files.push({path:'run.ps1',kind:'launcher',data:Buffer.from(launcher)});
  files.sort((a,b)=>a.path.localeCompare(b.path));
  const descriptor={schemaVersion:1,source:{reviewedPatchSha256},node:{path:process.execPath,sha256:runtime.hash(fs.readFileSync(process.execPath))},members:files.map(({path,kind,data})=>({path,kind,bytes:data.length,sha256:runtime.hash(data)}))};
  const bytes=Buffer.from(JSON.stringify(descriptor,null,2)+'\n'),id=runtime.hash(bytes),version=id.toLowerCase().slice(0,24),directory=path.join(paths.ROOT,'build/matching-tools',version);
  fs.mkdirSync(path.dirname(directory),{recursive:true});runtime.plain(path.dirname(directory),true);
  if(fs.existsSync(directory)){const old=runtime.inspect(directory);if(old.id!==id)throw Error('bundle version collision');return {version,bundleId:id,directory,reused:true};}
  fs.mkdirSync(directory);
  for(const f of files){const out=path.join(directory,f.path);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,f.data,{flag:'wx'});}
  fs.writeFileSync(path.join(directory,'bundle.json'),bytes,{flag:'wx'});
  const view=runtime.inspect(directory);
  return {version,bundleId:view.id,directory,files:files.length,bytes:files.reduce((sum,f)=>sum+f.data.length,bytes.length),reused:false};
}
// Synthesized reader entries are in-memory only. V2 stores one descriptor binding.
function entries(view) {
  const files=[],directories=new Map();
  for(const r of view.members.values()) {
    if(!r.path.startsWith('tools/'))continue;
    files.push({logical:r.path,storage:'reference',path:r.file,bytes:r.bytes,sha256:r.sha256});
    let child=r.path;
    while(child.includes('/')) {const parent=path.posix.dirname(child);if(!directories.has(parent))directories.set(parent,new Set());directories.get(parent).add(path.posix.basename(child));child=parent;}
  }
  return {files,directories:[...directories].map(([logical,names])=>({logical,storage:'reference',path:path.join(view.directory,logical),members:[...names].sort()}))};
}
function bindManifest(manifest,version,directory) {
  const view=inspect(version);
  const files=manifest.files.filter(r=>!view.members.has(r.logical?.toLowerCase())).map(r=>{
    if(!r.logical?.startsWith('tools/'))return r;
    if(!directory)throw Error('hash-only capture destination required');
    const source=r.storage==='copy'?path.join(directory,'data',r.logical):r.path;
    runtime.plain(source);const data=fs.readFileSync(source);
    if(data.length!==r.bytes||runtime.hash(data)!==r.sha256)throw Error('hash-only input drift');
    const target=path.join(directory,'data',r.logical);
    if(r.storage!=='copy'){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,data,{flag:'wx'});}
    return {logical:r.logical,storage:'copy',bytes:r.bytes,sha256:r.sha256};
  });
  return {...manifest,schemaVersion:2,bundle:{version,descriptorSha256:view.id},files,
    directories:manifest.directories.filter(r=>r.logical!=='tools'&&!r.logical?.startsWith('tools/'))};
}
function validateDataOnly(manifest,version) {
  const view=inspect(version);if(manifest.schemaVersion!==2||manifest.bundle?.version!==version||manifest.bundle.descriptorSha256!==view.id)throw Error('selected bundle binding');
  if(manifest.files.some(r=>view.members.has(r.logical?.toLowerCase())||r.logical?.startsWith('tools/')&&r.storage!=='copy')||manifest.directories.some(r=>r.logical==='tools'||r.logical?.startsWith('tools/')))throw Error('v2 duplicates tool member records');
  return view;
}
module.exports={publish,inspect,entries,bindManifest,validateDataOnly};
