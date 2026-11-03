'use strict';
// Trusted-local-operator dependency integrity, not an operator sandbox.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),Module=require('module');
const paths=require('../execution_paths');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex').toUpperCase();
const key=p=>path.resolve(p).toLowerCase();
let active=null;
function plain(file,directory=false) {
  for(let p=path.resolve(file);;p=path.dirname(p)) {
    const s=fs.lstatSync(p);
    if(s.isSymbolicLink() || (p===path.resolve(file)?directory?!s.isDirectory():!s.isFile()||s.nlink!==1:!s.isDirectory()))throw Error('bundle nonregular/redirected path');
    if(path.dirname(p)===p)break;
  }
  if(key(fs.realpathSync.native(file))!==key(file))throw Error('bundle aliased path');
}
function logical(name) {
  if(typeof name!=='string'||!name||name.includes('\\')||name.includes(':')||path.isAbsolute(name)
      ||name.split('/').some(p=>!p||p==='.'||p==='..'||/[. ]$/.test(p)||/^(con|prn|aux|nul|com\d|lpt\d)(\.|$)/i.test(p)))throw Error('bundle invalid member');
  return name;
}
function inspect(directory) {
  plain(directory,true);
  const manifestFile=path.join(directory,'bundle.json');plain(manifestFile);
  const bytes=fs.readFileSync(manifestFile),descriptor=JSON.parse(bytes),id=hash(bytes);
  if(descriptor.schemaVersion!==1 || !/^[a-f0-9]{16,64}$/.test(path.basename(directory)) || !id.toLowerCase().startsWith(path.basename(directory))
      || !Array.isArray(descriptor.members) || !descriptor.source || !/^[A-F0-9]{64}$/.test(descriptor.source.reviewedPatchSha256)
      || typeof descriptor.node?.path!=='string' || !/^[A-F0-9]{64}$/.test(descriptor.node.sha256))throw Error('bundle descriptor identity');
  const members=new Map(),loaded=new Set();
  for(const r of descriptor.members) {
    logical(r.path);
    if(members.has(r.path.toLowerCase())||!['javascript','json','python','sql','launcher','data'].includes(r.kind)
        ||!Number.isSafeInteger(r.bytes)||r.bytes<0||!/^[A-F0-9]{64}$/.test(r.sha256))throw Error('bundle member census');
    if(r.kind==='javascript' && !(r.path==='tools/match.js'||r.path.startsWith('tools/lib/')) || r.kind==='data'&&r.path.startsWith('tools/'))throw Error('bundle executable/data partition');
    const file=path.join(directory,r.path);plain(file);const data=fs.readFileSync(file);
    if(data.length!==r.bytes||hash(data)!==r.sha256)throw Error('bundle member bytes: '+r.path);
    members.set(r.path.toLowerCase(),{...r,file,bytesAtOpen:data});
  }
  const found=[];
  function walk(dir) {for(const name of fs.readdirSync(dir)){const f=path.join(dir,name),s=fs.lstatSync(f);plain(f,s.isDirectory());if(s.isDirectory())walk(f);else found.push(path.relative(directory,f).replace(/\\/g,'/'));}}
  walk(directory);
  if(JSON.stringify(found.sort())!==JSON.stringify(['bundle.json',...descriptor.members.map(r=>r.path)].sort()))throw Error('bundle extra/missing member');
  function member(file) {
    const rel=path.relative(directory,path.resolve(file)).replace(/\\/g,'/');
    const r=members.get(rel.toLowerCase());if(!r||key(r.file)!==key(file))throw Error('unenrolled bundle implementation: '+file);return r;
  }
  function verify(file) {const r=member(file);plain(r.file);if(!fs.readFileSync(r.file).equals(r.bytesAtOpen))throw Error('bundle implementation drift: '+r.path);return r.file;}
  function close() {
    if(!fs.readFileSync(manifestFile).equals(bytes))throw Error('bundle descriptor drift');
    const closing=[];
    function census(dir){for(const name of fs.readdirSync(dir)){const file=path.join(dir,name),s=fs.lstatSync(file);plain(file,s.isDirectory());if(s.isDirectory())census(file);else closing.push(path.relative(directory,file).replace(/\\/g,'/'));}}
    census(directory);
    if(JSON.stringify(closing.sort())!==JSON.stringify(found))throw Error('bundle closing member census drift');
    for(const r of members.values())verify(r.file);
    for(const file of Object.keys(require.cache)) {if(!key(file).startsWith(key(directory)+path.sep))throw Error('bundle loaded outside code root');member(file);}
    return {bundleId:id,loadedModules:[...loaded].sort()};
  }
  return {id,descriptor,directory,members,member,verify,close,loaded};
}
function checkCommand(argv) {
  const [command,...args]=argv;
  if(!['preflight','intake','history','best','watch','probe'].includes(command)||!args.includes('--inputs')
      ||!args.includes('--scratch-root')||args.includes('--research-compiler')||args.includes('--apply')
      ||['watch','probe'].includes(command)&&!args.includes('--source')||command==='probe'&&args[0]==='compare')throw Error('bundle command is not a selected private operation');
}
function initialize(entry,argv) {
  if(!paths.bundled)return null;
  if(active) {checkCommand(argv);return active;}
  if(key(entry)!==key(paths.codePath('tools/match.js'))||process.execArgv.length
      ||Object.entries(process.env).some(([k,v])=>['NODE_OPTIONS','NODE_PATH'].includes(k.toUpperCase())&&v))throw Error('bundle entry/preload environment');
  checkCommand(argv);
  const view=inspect(paths.CODE_ROOT);
  if(key(process.execPath)!==key(view.descriptor.node.path)||hash(fs.readFileSync(process.execPath))!==view.descriptor.node.sha256)throw Error('bundle Node pin');
  for(const file of Object.keys(require.cache))view.member(file);
  const load=Module._load,resolve=Module._resolveFilename;
  const builtins=new Set(Module.builtinModules.flatMap(n=>[n,n.startsWith('node:')?n:'node:'+n]));
  Module._load=function(request,parent,isMain) {
    if(builtins.has(request))return load.call(this,request,parent,isMain);
    const file=resolve.call(Module,request,parent,isMain),r=view.member(file);
    if(!['javascript','json'].includes(r.kind))throw Error('bundle data/helper cannot load as Node code');
    view.verify(file);view.loaded.add(r.path);return load.call(this,request,parent,isMain);
  };
  Module._extensions['.js']=function(mod,file){const r=view.member(file);if(r.kind!=='javascript')throw Error('bundle JS role');view.verify(file);mod._compile(r.bytesAtOpen.toString('utf8'),file);};
  Module._extensions['.json']=function(mod,file){const r=view.member(file);if(r.kind!=='json')throw Error('bundle JSON role');view.verify(file);mod.exports=JSON.parse(r.bytesAtOpen.toString('utf8'));};
  active=view;return active;
}
function current(){if(!active)throw Error('bundle execution requires its authenticated private CLI');return active;}
module.exports={initialize,current,inspect,plain,hash};
