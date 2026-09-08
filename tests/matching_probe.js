'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const cp = require('child_process');
const { ROOT, sha256File } = require('../tools/lib/phase7_conventional');
const { digest } = require('../tools/lib/matching/target_model');

function runUnitTests() {
  const evidence = path.join(ROOT, 'build/probe-repair-r1');
  fs.mkdirSync(evidence, { recursive: true });
  const root = fs.mkdtempSync(path.join(evidence, 'unit-'));
  const sourceFile = path.join(root, 'fixture.c'), header = path.join(root, 'fixture.h');
  const source = '#include "fixture.h"\nint fixture(void) { return VALUE; }\n';
  fs.writeFileSync(sourceFile, source); fs.writeFileSync(header, '#define VALUE 7\n');
  const compiler = path.join(root, 'compiler.exe'); fs.writeFileSync(compiler, 'mock compiler');
  let executions = 0, omit = null, empty = null, fail = false, duringCompile = null, dumpText = '(reg:SI 91)\n', preprocessing = 0;
  let ppRevision = 1;
  const expanded = new WeakMap();
  const record = file => ({ path: path.relative(ROOT, file).replace(/\\/g, '/'), bytes: fs.statSync(file).size, sha256: sha256File(file) });
  const policyDigest = p => digest(JSON.stringify({ class:p.class,source:p.source,sourceBytes:p.sourceBytes,
    sourceSha256:p.sourceSha256,preprocessedSha256:p.preprocessedSha256,compilationInput:p.compilationInput,
    dependencies:p.dependencies,reasons:p.reasons,error:null,preprocessorIdentity:p.preprocessor }));
  const mockedPolicy = {
    resolvePreprocessor: () => ({ config:{path:'config/source-policy.json',bytes:1,sha256:digest('config'+ppRevision)},
      sha256:digest('preprocessor'),version:'mock'+ppRevision,
      executables:[{role:'driver',path:'build/mock-preprocessor.exe',bytes:1,sha256:digest('preprocessor'),version:'mock'+ppRevision}],
      flags:['-P'],includeDirectories:[],dependencyMode:'authenticated-depfile',dependencyRoot:'.',dependencyTarget:'fixture-input',
      matchingCompiler:{executableSha256:sha256File(compiler),manifestSha256:digest('manifest'),preprocessingMode:'authenticated-external-companion'} }),
    preprocessorIdentity: p => ({...p,includeDirectories:p.includeDirectories.map(directory=>path.isAbsolute(directory)?path.relative(ROOT,directory).replace(/\\/g,'/'):directory)}),
    classifySource(file, options) {
      preprocessing++;
      const text = fs.readFileSync(file, 'utf8');
      const include = path.join(options.preprocessor.includeDirectories[0] || path.dirname(file), 'fixture.h');
      const value = fs.readFileSync(include, 'utf8').match(/VALUE (\d+)/)[1];
      const input = Buffer.from(text.replace('#include "fixture.h"\n', '').replace('VALUE', value));
      const authored = record(file);
      const result = { class: 'PURE_C', source: authored.path, sourceSha256: authored.sha256, sourceBytes: authored.bytes,
        preprocessedSha256:digest(input),reasons:[], dependencies: [record(include)], compilationInput: { bytes: input.length, sha256: digest(input) }, preprocessor: mockedPolicy.preprocessorIdentity(options.preprocessor) };
      result.digest=policyDigest(result);
      expanded.set(result, input); return result;
    },
    compilationInputBytes: result => Buffer.from(expanded.get(result)),
    verifyClassificationInputs(result) {
      for (const r of [{ path: result.source, bytes: result.sourceBytes, sha256: result.sourceSha256 }, ...result.dependencies]) assert.deepEqual(record(path.join(ROOT, r.path)), r);
    },
  };
  const realModel = require('../tools/lib/matching/target_model');
  const substitutions = {
    '../phase7_conventional': { ROOT, sha256File },
    '../phase8_matching_c': { verifyCompiler() {} },
    '../current_workflow': { writeJson: (file, value) => fs.writeFileSync(file, JSON.stringify(value)), prepareContext() { throw new Error('context was not supplied'); } },
    './target_model': { ...realModel, assertScratchCapability(_w, target) { if (target.group) throw new Error('complete group candidate'); } },
    './compiler': { MATCHING_ROOT: path.join(root, 'cache') },
    '../source_policy': mockedPolicy,
    child_process: { spawnSync(_exe, args, options) {
      executions++;
      const text = fs.readFileSync(path.join(options.cwd, args.at(-1)), 'utf8');
      assert(!text.includes('#include') && !text.includes('VALUE'), 'compiler received authored rather than expanded source');
      if (fail) return { status: 1, stdout: '', stderr: 'controlled failure' };
      fs.writeFileSync(path.join(options.cwd, 'output.s'), 'assembly\n');
      for (const [, flag, suffix] of api.PASSES) if (args.includes(flag) && suffix !== omit) fs.writeFileSync(path.join(options.cwd, 'input.c' + suffix), suffix === empty ? '' : dumpText);
      if (duringCompile) duringCompile();
      return { status: 0, stdout: '', stderr: '' };
    } },
  };
  const file = path.join(ROOT, 'tools/lib/matching/probe.js'), module = { exports: {} };
  const wrapper = vm.runInThisContext(`(function(require,module,exports,__filename,__dirname){${fs.readFileSync(file, 'utf8')}\n})`, { filename: file });
  wrapper(name => substitutions[name] || require(name), module, module.exports, file, path.dirname(file));
  const api = module.exports;
  const context = { localTools: { compiler }, phase8: { targets: [], config: { compiler: { compileFlags: ['-O2'] } } } };
  const target = { symbol: 'fixture', targetId: digest('fixture-target') };
  const run = (extra = {}) => api.runProbe({}, target, source, { context, sourcePath: sourceFile, passes: ['rtl'], ...extra });
  const reportPath = report => path.join(ROOT, path.dirname(report.assembly), 'probe-report.json');
  let checks = 0;
  function test(name, fn) { fn(); checks++; }
  test('expanded bytes and unchanged hit', () => {
    const a = run(), before = executions, b = run(); assert.equal(a.status, 'complete'); assert.equal(b.cached, true); assert.equal(executions, before); assert.equal(preprocessing, 2);
    assert.equal(fs.readFileSync(path.join(ROOT, a.expandedSource), 'utf8'), 'int fixture(void) { return 7; }\n');
  });
  const first = run();
  test('header changes invalidate identity', () => { fs.writeFileSync(header, '#define VALUE 8\n'); assert.notEqual(run().probeId, first.probeId); });
  test('effective flags invalidate identity', () => { const before = run(); context.phase8.config.compiler.compileFlags = ['-O1']; assert.notEqual(run().probeId, before.probeId); });
  test('preprocessor identity changes invalidate', () => { const before = run(); ppRevision++; assert.notEqual(run().probeId, before.probeId); });
  test('compiler changes invalidate', () => { const before = run(); fs.writeFileSync(compiler, 'changed mock compiler'); assert.notEqual(run().probeId, before.probeId); });
  test('snapshot candidate uses origin without replacing text', () => { const r = run({ sourcePath: undefined, sourceOrigin: sourceFile }); assert(r.identity.sourceOrigin.endsWith(path.basename(root))); });
  test('mismatched source bytes reject', () => { assert.throws(() => api.runProbe({}, target, source+' ', { context, sourcePath: sourceFile }), /changed before/); });
  test('unknown/duplicate passes reject', () => { assert.throws(() => run({ passes: ['bogus'] }), /unknown/); assert.throws(() => run({ passes: ['rtl','rtl'] }), /unique/); });
  test('group exclusion precedes preprocessing/compiler', () => { const n = executions; assert.throws(() => api.runProbe({}, { ...target, group: true }, source, { context }), /complete group/); assert.equal(executions, n); });
  test('malformed target identity and flags reject before preprocessing/compiler', () => {
    const before=preprocessing,calls=executions,flags=context.phase8.config.compiler.compileFlags;
    assert.throws(()=>api.runProbe({}, {...target,targetId:'not-a-digest'},source,{context,sourcePath:sourceFile}),/malformed/);
    context.phase8.config.compiler.compileFlags=[];assert.throws(()=>run(),/flags are malformed/);
    context.phase8.config.compiler.compileFlags='-O2';assert.throws(()=>run(),/flags are malformed/);
    context.phase8.config.compiler.compileFlags=flags;assert.equal(preprocessing,before);assert.equal(executions,calls);
  });
  test('source-policy uppercase C extension remains supported',()=>{const file=path.join(root,'upper.C');fs.writeFileSync(file,source);assert.equal(run({sourcePath:file}).status,'complete');});
  for (const name of ['authored.c','input.c','output.s','input.c.rtl']) test('tampered '+name, () => {
    context.phase8.config.compiler.compileFlags = ['-O2', '-fixture-'+checks]; const r = run(), file = path.join(path.dirname(reportPath(r)), name), bytes = fs.readFileSync(file);
    fs.writeFileSync(file, 'corrupt'); assert.throws(() => run(), /identity drift/); assert.throws(() => api.compareProbes(reportPath(first), reportPath(r)), /identity drift/); fs.writeFileSync(file, bytes);
  });
  test('missing dump rejects cache', () => { context.phase8.config.compiler.compileFlags = ['-missing']; const r = run(); fs.unlinkSync(path.join(path.dirname(reportPath(r)), 'input.c.rtl')); assert.throws(() => run(), /missing/); });
  test('empty requested dump is failed', () => { context.phase8.config.compiler.compileFlags = ['-empty']; empty='.rtl'; const r=run(); empty=null; assert.equal(r.status,'failed'); assert.throws(()=>run(),/incomplete or failed/); });
  test('missing requested dump is failed', () => { context.phase8.config.compiler.compileFlags = ['-omit']; omit='.rtl'; const r=run(); omit=null; assert.equal(r.status,'failed'); });
  test('compiler failure never complete', () => { context.phase8.config.compiler.compileFlags = ['-fail']; fail=true; const r=run(); fail=false; assert.equal(r.status,'failed'); assert.throws(()=>api.compareProbes(reportPath(r),reportPath(first)),/incomplete or failed/); });
  test('report modification rejects', () => { context.phase8.config.compiler.compileFlags=['-report']; const r=run(), f=reportPath(r); const changed={...r,target:{symbol:'different'}}; fs.writeFileSync(f,JSON.stringify(changed)); assert.throws(()=>run(),/identity drift/); });
  test('explicit cross compiler/target/pass provenance', () => {
    context.phase8.config.compiler.compileFlags=['-cross']; const a=run(); const other={...target,targetId:digest('other-target')};
    const b=api.runProbe({},other,source,{context,sourcePath:sourceFile,researchCompiler:compiler,passes:['rtl','flow']});
    const result=api.compareProbes(reportPath(a),reportPath(b)); assert(result.provenanceDifferences.some(d=>d.field==='compiler')); assert(result.provenanceDifferences.some(d=>d.field==='targetId')); assert(result.provenanceDifferences.some(d=>d.field==='passes')); assert.equal(result.firstTextualDivergence,null); assert(result.comparisons.some(c=>c.reason));
  });
  test('pseudo-only changes remain textual differences', () => { context.phase8.config.compiler.compileFlags=['-pseudo1']; const a=run(); dumpText='(reg:SI 92)\n'; context.phase8.config.compiler.compileFlags=['-pseudo2']; const b=run(); assert.equal(api.compareProbes(reportPath(a),reportPath(b)).firstTextualDivergence,'rtl'); });
  test('legacy comparison fails closed', () => { const f=path.join(root,'legacy.json'); fs.writeFileSync(f,'{"schemaVersion":1}'); assert.throws(()=>api.compareProbes(f,f),/legacy/); });
  test('extra cache artifact rejects', () => { context.phase8.config.compiler.compileFlags=['-extra']; const r=run(); fs.writeFileSync(path.join(path.dirname(reportPath(r)),'unexpected.txt'),'extra'); assert.throws(()=>run(),/census/); });
  test('malformed artifact census rejects even with recomputed report digest', () => {
    context.phase8.config.compiler.compileFlags=['-census']; const r=run(), f=reportPath(r); r.artifacts[0].name='../authored.c'; delete r.reportSha256; r.reportSha256=digest(r); fs.writeFileSync(f,JSON.stringify(r)); assert.throws(()=>run(),/census/);
  });
  test('tool changes during compile produce failure', () => { context.phase8.config.compiler.compileFlags=['-tool-drift']; duringCompile=()=>fs.appendFileSync(compiler,'drift'); const r=run(); duringCompile=null; assert.equal(r.status,'failed'); assert.match(r.error,/closure changed/); });
  test('source changes during compile produce failure', () => { context.phase8.config.compiler.compileFlags=['-source-drift']; duringCompile=()=>fs.appendFileSync(sourceFile,' '); const r=run(); duringCompile=null; fs.writeFileSync(sourceFile,source); assert.equal(r.status,'failed'); });
  test('outside provenance and unsafe target reject', () => { assert.throws(()=>run({sourcePath:undefined,sourceOrigin:path.join(path.dirname(ROOT),'outside.c')}),/inside the repository/); assert.throws(()=>api.runProbe({}, {...target,symbol:'../escape'},source,{context}),/malformed/); });
  test('directory symlink cannot disguise cached artifacts', () => {
    context.phase8.config.compiler.compileFlags=['-symlink']; const r=run(), link=path.join(root,'linked-cache'); fs.symlinkSync(path.dirname(reportPath(r)),link,'junction'); assert.throws(()=>api.readProbe(path.join(link,'probe-report.json')),/symlink/);
  });
  test('snapshot sibling header rejects before preprocessing, including cache requests', () => {
    context.phase8.config.compiler.compileFlags=['-shadow'];
    const options={sourcePath:undefined,sourceOrigin:sourceFile}, r=run(options);
    const sibling=path.join(ROOT,path.dirname(r.identity.sourcePolicy.source),'fixture.h');
    fs.writeFileSync(sibling,'#define VALUE 999\n'); const before=preprocessing, calls=executions;
    assert.throws(()=>run(options),/snapshot census/);assert.equal(preprocessing,before);assert.equal(executions,calls);
    fs.unlinkSync(sibling);
  });
  test('snapshot sibling introduced during compiler execution cannot complete', () => {
    context.phase8.config.compiler.compileFlags=['-shadow-control'];
    const options={sourcePath:undefined,sourceOrigin:sourceFile}, r=run(options);
    const sibling=path.join(ROOT,path.dirname(r.identity.sourcePolicy.source),'fixture.h');
    context.phase8.config.compiler.compileFlags=['-shadow-during'];duringCompile=()=>fs.writeFileSync(sibling,'#define VALUE 999\n');
    const failed=run(options);duringCompile=null;fs.unlinkSync(sibling);assert.equal(failed.status,'failed');assert.match(failed.error,/snapshot census/);
  });
  // Recompute both digests and retain the new keyed layout, so each malformed
  // identity test reaches schema validation rather than merely a checksum guard.
  function copiedReport(label, mutate, options = {}) {
    const report=JSON.parse(fs.readFileSync(reportPath(first),'utf8'));
    mutate(report);
    report.probeId=digest(report.identity);
    const directory=path.join(root,'copies',label,options.wrongKey?'wrong-key':report.probeId);
    fs.mkdirSync(directory,{recursive:true});
    for(const item of first.artifacts) fs.copyFileSync(path.join(path.dirname(reportPath(first)),item.name),path.join(directory,item.name));
    if(!options.keepPaths) {
      report.source=path.relative(ROOT,path.join(directory,'authored.c')).replace(/\\/g,'/');
      report.expandedSource=path.relative(ROOT,path.join(directory,'input.c')).replace(/\\/g,'/');
      report.assembly=path.relative(ROOT,path.join(directory,'output.s')).replace(/\\/g,'/');
    }
    if(options.publicField) report[options.publicField]='../../outside.c';
    delete report.reportSha256;report.reportSha256=digest(report);
    const file=path.join(directory,options.wrongName?'renamed.json':'probe-report.json');fs.writeFileSync(file,JSON.stringify(report));return file;
  }
  const malformed = [
    ['missing-runtime',r=>{delete r.identity.runtimePreprocessor;}],
    ['empty-implementation',r=>{r.identity.implementation=[{}];}],
    ['implementation-hash',r=>{r.identity.implementation[0].sha256='bad';}],
    ['implementation-path',r=>{r.identity.implementation[0].path='../probe.js';}],
    ['compiler-path',r=>{r.identity.compiler.path='relative.exe';r.compiler=r.identity.compiler;}],
    ['compiler-hash',r=>{r.identity.compiler.sha256='bad';r.compiler=r.identity.compiler;}],
    ['compiler-designation',r=>{r.identity.compiler.acceptanceCompiler='true';r.compiler=r.identity.compiler;}],
    ['origin-type',r=>{r.identity.sourceOrigin={};}],
    ['origin-path',r=>{r.identity.sourceOrigin='../source';}],
    ['policy-source',r=>{r.identity.sourcePolicy.source='../source.c';}],
    ['policy-size',r=>{r.identity.sourcePolicy.sourceBytes=-1;}],
    ['policy-digest',r=>{delete r.identity.sourcePolicy.digest;}],
    ['expanded-binding',r=>{r.identity.sourcePolicy.preprocessedSha256=digest('other');}],
    ['dependency-path',r=>{r.identity.sourcePolicy.dependencies[0].path='a/../header.h';}],
    ['dependency-hash',r=>{r.identity.sourcePolicy.dependencies[0].sha256='bad';}],
    ['duplicate-dependency',r=>{r.identity.sourcePolicy.dependencies.push(r.identity.sourcePolicy.dependencies[0]);}],
    ['runtime-shape',r=>{delete r.identity.runtimePreprocessor.executables;}],
    ['runtime-hash',r=>{r.identity.runtimePreprocessor.executables[0].sha256='bad';}],
    ['policy-preprocessor',r=>{r.identity.sourcePolicy.preprocessor={};}],
    ['pure-reasons',r=>{r.identity.sourcePolicy.reasons=[{stage:'raw',code:'assembler-keyword',token:'asm',line:1,column:1}];}],
    ['hybrid-reasons',r=>{r.identity.sourcePolicy.class='HYBRID_C';}],
  ];
  for(const [label,mutate] of malformed) test('rehashed malformed '+label,()=>assert.throws(()=>api.readProbe(copiedReport(label,mutate)),/provenance/));
  for(const field of ['source','expandedSource','assembly']) test('public artifact path '+field,()=>assert.throws(()=>api.readProbe(copiedReport(field,()=>{},{publicField:field})),/location\/key/));
  test('keyed directory binding',()=>assert.throws(()=>api.readProbe(copiedReport('wrong-key',()=>{},{wrongKey:true})),/location\/key/));
  test('report filename binding',()=>assert.throws(()=>api.readProbe(copiedReport('wrong-name',()=>{},{wrongName:true})),/location\/key/));
  test('copied paths must be rebased',()=>assert.throws(()=>api.readProbe(copiedReport('old-paths',()=>{},{keepPaths:true})),/location\/key/));
  test('properly rebased historical copy remains comparable',()=>{const file=copiedReport('valid',()=>{});assert.equal(api.compareProbes(reportPath(first),file).firstTextualDivergence,null);});
  const result={checks,executions,preprocessing,root}; fs.writeFileSync(path.join(root,'test-results.json'),JSON.stringify(result,null,2)); return result;
}

function runIntegrationTests() {
  const started = Date.now();
  const { loadWorkbenchModel, resolveTarget } = require('../tools/lib/matching/target_model');
  const { loadActiveTargetModel } = require('../tools/lib/active_targets');
  const { resolveLocalTools } = require('../tools/lib/local_tools');
  const policy = require('../tools/lib/source_policy');
  const api = require('../tools/lib/matching/probe');
  const workbench = loadWorkbenchModel(), target = resolveTarget(workbench, 'func_001F3C00');
  const context = { localTools: resolveLocalTools(), phase8: loadActiveTargetModel() };
  const evidence = path.join(ROOT, 'build/probe-repair-r1'); fs.mkdirSync(evidence, { recursive: true });
  const root = fs.mkdtempSync(path.join(evidence, 'integration-'));
  const sourceFile = path.join(root, 'fixture.c'), header = path.join(root, 'local.h');
  fs.mkdirSync(path.join(root, 'nested')); fs.writeFileSync(path.join(root, 'nested/value.h'), '#define OFFSET 11\n');
  fs.writeFileSync(header, '#include "nested/value.h"\n#define ADJUST(x) ((x) + OFFSET)\n');
  const source = '#include "local.h"\n#include "game/combat_types.h"\nu32 func_001F3C00(u32 value) { return ADJUST(value); }\n';
  fs.writeFileSync(sourceFile, source);
  const control = api.runProbe(workbench, target, source, { context, sourcePath: sourceFile });
  assert.equal(control.status, 'complete', control.error);
  assert.equal(control.dumps.length, api.PASSES.length);
  const cached = api.runProbe(workbench, target, source, { context, sourcePath: sourceFile }); assert.equal(cached.cached, true);
  const cls = policy.classifySource(sourceFile); assert.equal(cls.class, 'PURE_C');
  const input = policy.compilationInputBytes(cls); assert(input.equals(fs.readFileSync(path.join(ROOT, control.expandedSource))));
  assert.deepEqual(cls.dependencies, control.identity.sourcePolicy.dependencies);
  fs.writeFileSync(path.join(root, 'input.c'), input);
  const args = [...context.phase8.config.compiler.compileFlags, '-o', 'production.s', 'input.c'];
  const compiled = cp.spawnSync(context.localTools.compiler, args, { cwd: root, encoding: 'utf8', windowsHide: true });
  assert.equal(compiled.status, 0, compiled.stderr); policy.verifyClassificationInputs(cls);
  // Only diagnostic option comments differ; both invocations use the same input basename.
  const executableAssembly = text => text.split(/\r?\n/).filter(line => !/^\s*# -/.test(line)).join('\n');
  assert.equal(executableAssembly(fs.readFileSync(path.join(root,'production.s'),'utf8')), executableAssembly(fs.readFileSync(path.join(ROOT,control.assembly),'utf8')));
  const snapshot = api.runProbe(workbench, target, source, { context, sourceOrigin: sourceFile, passes:['rtl'] });
  assert.equal(snapshot.status, 'complete', snapshot.error);
  assert(input.equals(fs.readFileSync(path.join(ROOT,snapshot.expandedSource))), 'stored candidate lost origin include semantics');
  fs.writeFileSync(path.join(root, 'nested/value.h'), '#define OFFSET 12\n');
  const changed = api.runProbe(workbench,target,source,{context,sourcePath:sourceFile,passes:['rtl']});
  assert.equal(changed.status,'complete'); assert.notEqual(changed.identity.sourcePolicy.compilationInput.sha256,control.identity.sourcePolicy.compilationInput.sha256);
  const reportPath = r => path.join(ROOT,path.dirname(r.assembly),'probe-report.json');
  const comparison = api.compareProbes(reportPath(control),reportPath(changed)); assert(comparison.provenanceDifferences.some(d=>d.field==='sourcePolicy'));
  const result = { status:'pass', allRequestedDumps:control.dumps.length, cached:true, expandedBytesExact:true, productionAssemblyAgreesExcludingOptionComments:true,
    candidateOriginExpansionExact:true, changedHeaderInvalidated:true, compiler:control.compiler, control:reportPath(control), snapshot:reportPath(snapshot), changed:reportPath(changed), seconds:(Date.now()-started)/1000 };
  fs.writeFileSync(path.join(root,'integration-results.json'),JSON.stringify(result,null,2)); return result;
}

if (require.main === module) console.log(JSON.stringify(process.argv.includes('--integration') ? runIntegrationTests() : runUnitTests(), null, 2));
module.exports = { runUnitTests, runIntegrationTests };
