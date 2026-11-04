'use strict';
// Fixture-only loader. It never changes filesystem reads or selected authentication.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),Module=require('module');
const ALLOWED=Object.freeze([
  'tools/lib/matching/diagnostic_context.js',
  'tools/lib/matching/compiler.js',
  'tools/lib/matching/diagnostic_link.js',
  'tests/matching_multi_owner_diagnostic.js',
  'tests/helpers/staged_matching_modules.js',
]);
// Preserve the original exact package shape for existing registered-owner fixtures.
const CONTINUATION_ALLOWED=Object.freeze([ALLOWED[0], 'tools/lib/matching/target_model.js', ...ALLOWED.slice(1,-1),
  'tests/matching_continuation_diagnostic.js', ALLOWED[ALLOWED.length-1]]);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex').toUpperCase();
const key=p=>path.resolve(p).toLowerCase();
function plain(file) {
  const absolute=path.resolve(file);
  for(let current=absolute;;current=path.dirname(current)) {
    const stat=fs.lstatSync(current);
    if(stat.isSymbolicLink() || (current===absolute ? !stat.isFile()||stat.nlink!==1 : !stat.isDirectory()))throw Error('staged fixture redirected/multiply linked/nonregular path');
    if(path.dirname(current)===current)break;
  }
  if(key(fs.realpathSync.native(file))!==key(file))throw Error('staged fixture aliased path');
}
function absent(file) {
  try {fs.lstatSync(file);throw Error('staged new module path exists');}catch(error){if(error.code!=='ENOENT')throw error;}
  // Missing NEW paths may have missing parents, but existing ancestors must
  // remain plain directories; dangling links count as existing, not absent.
  for(let current=path.dirname(path.resolve(file));;current=path.dirname(current)) {
    try {const stat=fs.lstatSync(current);if(!stat.isDirectory()||stat.isSymbolicLink())throw Error('staged new path redirected ancestor');}
    catch(error){if(error.code!=='ENOENT')throw error;}
    if(path.dirname(current)===current)break;
  }
}
function sealedFile(file,sha,label) {
  plain(file);const bytes=fs.readFileSync(file);
  if(hash(bytes)!==sha)throw Error(label+' identity drift');
  return bytes;
}
async function run(packageFile,packageSha,argv,bootstrapFile) {
  plain(packageFile);const packageBytes=fs.readFileSync(packageFile);
  if(hash(packageBytes)!==packageSha)throw Error('staged package identity');
  const pkg=JSON.parse(packageBytes),root=path.resolve(__dirname,'../..'),base=path.dirname(path.resolve(packageFile));
  const continuation=JSON.stringify(pkg.modules.map(r=>r.id))===JSON.stringify(CONTINUATION_ALLOWED);
  if(pkg.schemaVersion!==1||pkg.repository!==root||!continuation && JSON.stringify(pkg.modules.map(r=>r.id))!==JSON.stringify(ALLOWED))throw Error('staged exact module allowlist');
  if(path.resolve(bootstrapFile)!==path.join(base,'bootstrap.js'))throw Error('staged bootstrap path binding');
  sealedFile(bootstrapFile,pkg.bootstrapSha256,'staged bootstrap opening');
  const records=new Map(),identity=[];
  for(const record of pkg.modules) {
    const id=path.join(root,record.id),replacement=path.resolve(base,record.replacement);
    if(!replacement.startsWith(base+path.sep))throw Error('staged replacement escapes package');
    plain(replacement);const bytes=fs.readFileSync(replacement);
    if(hash(bytes)!==record.replacementSha256)throw Error('staged replacement identity');
    if(record.preimageSha256===null) {
      absent(id);
    } else {
      plain(id);if(hash(fs.readFileSync(id))!==record.preimageSha256)throw Error('staged installed preimage identity');
    }
    if(require.cache[id] && id!==__filename)throw Error('staged module loaded before bootstrap');
    if(id===__filename && require.cache[id]!==module)throw Error('staged helper cache identity');
    records.set(key(id),{...record,id,bytes,state:id===__filename?'loaded':'new'});
    identity.push({id:record.id,preimageSha256:record.preimageSha256,replacementSha256:record.replacementSha256});
  }
  const originalLoad=Module._load;
  function stagedId(request,parent) {
    if(typeof request!=='string'||(!path.isAbsolute(request)&&!request.startsWith('.')))return null;
    const candidate=path.resolve(parent?path.dirname(parent.filename):root,request);
    return records.get(key(candidate))||records.get(key(candidate+'.js'))||null;
  }
  Module._load=function(request,parent,isMain) {
    const record=stagedId(request,parent);
    if(!record)return originalLoad.call(this,request,parent,isMain);
    if(record.state==='loading'||record.state==='loaded') {
      if(!require.cache[record.id]||require.cache[record.id]!==record.module && record.id!==__filename)throw Error('staged module cache collision');
      return require.cache[record.id].exports;
    }
    if(require.cache[record.id])throw Error('staged module cache collision');
    const child=new Module(record.id,parent);child.filename=record.id;child.paths=Module._nodeModulePaths(path.dirname(record.id));
    record.module=child;record.state='loading';require.cache[record.id]=child;
    try {child._compile(record.bytes.toString('utf8'),record.id);child.loaded=true;record.state='loaded';return child.exports;}
    catch(error){record.state='failed';throw error;}
  };
  try {
    const entry=Module._load(path.join(root,continuation?'tests/matching_continuation_diagnostic.js':'tests/matching_multi_owner_diagnostic.js'),module,false);
    const beforePublish=async()=>{
      for(const record of records.values()) {
        if(record.state!=='loaded')throw Error('staged module was not exercised: '+record.id);
        sealedFile(path.resolve(base,record.replacement),record.replacementSha256,'staged replacement closing');
        if(record.preimageSha256!==null)sealedFile(record.id,record.preimageSha256,'staged installed preimage closing');
        else absent(record.id);
      }
      sealedFile(bootstrapFile,pkg.bootstrapSha256,'staged bootstrap closing');
      if(!sealedFile(packageFile,packageSha,'staged package closing').equals(packageBytes))throw Error('staged package closing bytes');
    };
    // The entrypoint's common publisher runs only after this staged close.
    return await entry.main(argv,{scope:'exact-module-fixture-only',packageSha256:packageSha,bootstrapSha256:pkg.bootstrapSha256,modules:identity},{beforePublish});
  } finally {Module._load=originalLoad;}
}
module.exports={run};
