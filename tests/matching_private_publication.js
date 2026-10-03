'use strict';
// Exercise the real compileCandidate failure/publication boundary without native tools.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const {createRequire} = require('module');
const ROOT = process.cwd();
const staged = process.argv.includes('--staged');
const compilerFile = path.join(ROOT, staged ? 'build/parallel-implementation/core/compiler.js' : 'tools/lib/matching/compiler.js');
const actualRequire = createRequire(path.join(ROOT, 'tools/lib/matching/compiler.js'));
const hash = value => crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
const digest = value => hash(Buffer.isBuffer(value) || typeof value === 'string' ? value : JSON.stringify(value));
const directory = path.join(ROOT, 'build/private-publication-tests');
fs.mkdirSync(directory, {recursive:true});
const fixture = fs.mkdtempSync(path.join(directory, 'run-'));
const sourceFile = path.join(fixture, 'authored.c');
const source = 'int fixture(void) { return 1; }\n';
let changeAfterFailure = false, publications = 0;
const inputs = new WeakMap();
const policy = {
  classifySource(file) {
    file = path.resolve(ROOT, file);
    const bytes = fs.readFileSync(file), sourceSha256 = hash(bytes);
    const record = {class:'PURE_C',source:path.relative(ROOT,file).replace(/\\/g,'/'),sourceSha256,
      dependencies:[],preprocessor:{},compilationInput:{bytes:bytes.length,sha256:sourceSha256},digest:hash(file+sourceSha256)};
    inputs.set(record, bytes); return record;
  },
  compilationInputBytes: record => Buffer.from(inputs.get(record)),
  verifyClassificationInputs(record) {assert.equal(hash(fs.readFileSync(path.join(ROOT,record.source))),record.sourceSha256,'source identity drift');},
};
function load(file, substitutions) {
  const m = {exports:{}};
  new vm.Script('(function(require,module,exports,__filename,__dirname){'+fs.readFileSync(file,'utf8')+'\n})',{filename:file})
    .runInThisContext()(name=>Object.hasOwn(substitutions,name)?substitutions[name]:actualRequire(name),m,m.exports,file,path.dirname(file));
  return m.exports;
}
const privateInputs = load(path.join(ROOT,staged?'build/parallel-implementation/core/private_inputs.js':'tools/lib/matching/private_inputs.js'),{
  '../phase7_conventional':{ROOT},
});
const api = load(compilerFile, {
  '../phase7_conventional':{ROOT,sha256File:file=>hash(fs.readFileSync(file)),sha256Buffer:hash,run(){throw Error('unit test attempted a native command');}},
  '../phase8_matching_c':{},
  '../text_contract':{bindWorkbenchTarget:(_session,target)=>target},
  '../source_policy':policy,
  '../current_workflow':{writeJson(file,body){fs.writeFileSync(file,JSON.stringify(body));if(changeAfterFailure)fs.writeFileSync(sourceFile,source.replace('1','2'));}},
  './target_model':{canonicalJson:JSON.stringify,digest,assertScratchCapability(){}},
  './diagnostic_link':{prepareTargetDiagnostic:()=>({available:false})},
  './store':{},
  './private_inputs':privateInputs,
});
function attempt() {
  const matchingRoot=fs.mkdtempSync(path.join(fixture,'matching-'));
  return api.compileCandidate({}, {symbol:'fixture',targetId:'target',bytes:4,sectionName:'.fixture',placementKind:'rom-only'},source, {
    sourcePath:sourceFile,privateWorkspace:true,matchingRoot,syncTargets:false,
    session:{context:{phase8:{targets:[]}},preprocessor:{},tool:{},toolId:'unit'},
    storeRequest(request) {if(request.action==='put_compile_result'){publications++;return{run:request.compile,comparison:request.comparison,cached:false};} return null;},
  });
}
fs.writeFileSync(sourceFile,source);
assert.equal(attempt().compile.status,'failed'); assert.equal(publications,1);
changeAfterFailure=true;
assert.throws(attempt,/source identity drift/);
assert.equal(publications,1,'drift was published as a failed candidate');
console.log('Private publication: ordinary failure recorded; same-size source drift rejects before store publication');
