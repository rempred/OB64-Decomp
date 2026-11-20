'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const {execFileSync}=require('node:child_process');
const m=require('../tools/lib/c_interfaces');
const root=process.env.OB64_INTERFACE_TEST_ROOT || path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(process.env.OB64_INTERFACE_TEST_CONFIG || path.join(root,'config/c-interface-frontend.json')));
const exe=m.authenticate(root,config);
const scratch=fs.mkdtempSync(path.join(process.env.OB64_INTERFACE_TEST_SCRATCH || path.join(root,'build'),'c-interface-tests-'));
let serial=0, assertions=0;
function check(value,message){assert(value,message);assertions++;}
function fixture(caller,provider,opts={}) {
  const sources=[caller,provider],sections=[{name:'',index:0,flags:0},{name:'.caller',index:1,flags:6,address:opts.sameVram?100:100,size:50},{name:'.provider',index:2,flags:opts.data?2:6,address:opts.sameVram?100:200,size:50}], symbols=[];
  const units=sources.map((source,i)=>{
    const file=path.join(scratch,`${++serial}.i`);fs.writeFileSync(file,source);
    const analysis=m.parse(exe,file,source), identity={source:`${i}.c`,sha256:m.digest(source),authoredSha256:m.digest(source)};
    const entries=analysis.functions.filter(f=>f.definition).map(f=>({symbol:f.name,binding:f.local?'LOCAL':'GLOBAL'}));
    for(const f of analysis.functions.filter(f=>f.definition&&!f.local)) symbols.push({name:f.name,binding:1,symbolType:2,size:20,sectionIndex:i+1,value:opts.sameVram?100:100+i*100});
    return {identity,analysis,entries,sections:[sections[i+1].name],relocations:opts.absoluteAlias?[{symbol:'alias',type:'R_MIPS_26'}]:[]};
  });
  if(opts.alias)symbols.push({...symbols.find(s=>s.name==='f'),name:'alias'});
  if(opts.duplicate)symbols.push({...symbols.find(s=>s.name==='f')});
  if(opts.absoluteAlias)symbols.push({name:'alias',binding:1,symbolType:1,size:0,sectionIndex:65521,value:opts.interior?204:opts.sameVram?100:200});
  const authority={absoluteSymbols:opts.absoluteAlias?[{name:'alias',address:opts.interior?204:opts.sameVram?100:200}]:[],overlayReservations:opts.overlay?[{vram_start:200,vram_end_exclusive:250}]:[]};
  const report={producers:units.map(u=>u.identity),...m.analyze(units,{symbols,sections},authority)};
  return report;
}
const kind=(r,k)=>r.findings.some(f=>f.kind===k);
for(const [a,b] of [['f(s.a)','f(s.b)'],['f(i++)','f(++i)'],['f(sizeof(i))','f(__alignof__(i))'],['f(sizeof(int))','f(sizeof(double))'],['f(__builtin_offsetof(S,a))','f(__builtin_offsetof(S,b))'],['f("left")','f("right")'],['f("a\\n")','f("a\\x0a")'],['f(i++)','f(i + + 1)'],['f(i>>1)','f(i > > 1)'],['f((int)i)','f((double)i)'],['f(1)','f(01)'],['f(({int a=1;a;}))','f(({int a=2;a;}))']])check(m.digest(m.callTokens(Buffer.from(a)))!==m.digest(m.callTokens(Buffer.from(b))),'distinct preprocessing tokens '+a+' / '+b);
for(const [a,b] of [['f(s.a)',' f ( s /* member */ . a ) '],['f(i++)','f ( i ++ )'],['f("a b")','f( /*x*/ "a b" )'],['f(1e+2)','f ( 1e+2 )'],['f(foo)','f(fo\\\no)']])check(m.digest(m.callTokens(Buffer.from(a)))===m.digest(m.callTokens(Buffer.from(b))),'stable ordinary token spelling '+a);
assert.throws(()=>m.callTokens(Buffer.from('f(π)')));assertions++;
const fallback=m.callAnchor(Buffer.from('f(π)'),{range:{begin:{offset:0},end:{offset:4,tokLen:1}}});check(fallback.anchorKind==='exact-unsupported-spelling','unknown spelling retains exact unsupported anchor');
const badRange=m.callAnchor(Buffer.from('f(1)'),{range:{begin:{offset:0},end:{offset:99,tokLen:1}}});check(badRange.anchorKind==='exact-unresolved-range','bad range never borrows partial tokens');
const conflict=fixture('void f(int,int); void caller(void){f(1,2);}','void f(int x){}');
for(const [a,b] of [['f(s.a)','f(s.b)'],['f(i++)','f(++i)'],['f(sizeof(i))','f(__alignof__(i))'],['f(sizeof(int))','f(sizeof(double))'],['f(__builtin_offsetof(S,a))','f(__builtin_offsetof(S,b))']]) {
  const caller=call=>`typedef struct {int a,b;} S; void f(int); void caller(void){S s;int i=1;${call};}`;
  const old=fixture(caller(a),'void f(float x){}');
  const debt={schemaVersion:1,purpose:'reviewed-existing-interface-debt',producers:old.producers,findings:old.findings,limitations:[...new Map(old.gaps.map(g=>{const l=m.limitation(g);return[l.id,l]})).values()]};
  check(!m.compareBaseline(fixture(caller(b),'void f(float x){}'),debt).pass,'actual changed incompatible expression '+a+' / '+b);
}
check(kind(conflict,'call-arity'),'two arguments to one argument definition');
check(kind(conflict,'prototype-arity'),'two argument prototype');
check(!fixture('void f(int); void caller(void){short x=1;f(x);}','void f(int x){}').findings.length,'normal promotions');
check(!fixture('typedef int I; void f(const I);void caller(void){f(2);}','void f(int x){}').findings.length,'typedef and top qualifier');
check(!fixture('void f(int*);void caller(void){int a[2];f(a);}','void f(int x[]){}').findings.length,'array adjustment');
check(!fixture('void f(void*);void caller(void){int a;f(&a);}','void f(void*x){}').findings.length,'object to void pointer conversion');
check(fixture('void f(int*);void caller(void){f(3);}','void f(int*x){}').gaps.some(g=>g.reason==='frontend-conversion-diagnostics'),'illegal integer pointer conversion not silently checked');
check(kind(fixture('int f(void);void caller(void){f();}','float f(void){return 0;}'),'return-type'),'return type');
check(kind(fixture('void f(int*);void caller(void){int a;f(&a);}','void f(const int*x){}'),'parameter-type'),'pointee qualifiers');
check(!fixture('void f(int,...);void caller(void){f(1,2,3);}','void f(int x,...){}').findings.length,'variadic valid');
check(kind(fixture('void f();void caller(void){f();}','void f(int x,...){}'),'call-arity'),'variadic missing fixed');
check(!kind(fixture('void f();void caller(void){f(1);}','void f(int x){}'),'prototype-arity'),'unspecified is not zero');
check(kind(fixture('void f();void caller(void){f(1);}','void f(void){}'),'call-arity'),'void definition zero');
check(!fixture('static void f(int x){}void caller(void){f(1);}','void f(int x,int y){}').findings.length,'TU static isolated');
check(!fixture('void caller(void){void(*f)(int)=0;f(1);}','void f(int x,int y){}').findings.length,'local function pointer not external');
check(fixture('void caller(void){void(*f)(int)=0;f(1);}','void f(int x){}').gaps.some(g=>g.reason==='indirect-call'),'indirect coverage');
check(kind(fixture('void alias(int,int);void caller(void){alias(1,2);}','void f(int x){}',{alias:true}),'call-arity'),'linker alias resolves');
check(kind(fixture('void alias(int,int);void caller(void){alias(1,2);}','void f(int x){}',{absoluteAlias:true}),'call-arity'),'admitted relocated absolute alias');
for(const options of [{sameVram:true},{interior:true},{data:true},{overlay:true}]) check(!kind(fixture('void alias(int,int);void caller(void){alias(1,2);}','void f(int x){}',{absoluteAlias:true,...options}),'call-arity'),'unsafe absolute alias rejected '+JSON.stringify(options));
check(kind(fixture('void f(int,int);void caller(void){f(1,2);}','void f(int x){}',{sameVram:true}),'call-arity'),'overlapping VRAM isolated by section');
check(!fixture('void f(int,int);void caller(void){f(1,2);}','void f(int x){}',{duplicate:true}).findings.length,'ambiguous symbol not guessed');
check(fixture('void f(int,int);void caller(void){f(1,2);}','void f(int x){}',{duplicate:true}).gaps.length>0,'ambiguity visible');
check(fixture('void caller(void){','void f(int x){}').coverage.unparsed===1,'malformed source unsupported');
check(fixture('void f(int (*p)(int));void caller(void){}','void f(int(*p)(int)){}').gaps.some(g=>g.reason==='unsupported-parameter-type'),'function pointer types conservative');
check(fixture('void caller(void){}','void f(x) float x; {}').gaps.some(g=>g.reason==='old-style-definition-promotions'),'K&R promotions explicit');
const tags=fixture('typedef struct Node Node; Node *f(void);void caller(void){}','struct Node *f(void){return 0;}');
check(tags.gaps.some(g=>g.reason==='unsupported-return-type')&&!tags.findings.length,'tag namespace remains conservative');
check(tags.gaps.find(g=>g.reason==='unsupported-return-type').types[0].spelling==='struct Node *','tag name does not recursively expand typedef');
check(!fixture('typedef int Function(int); Function f;void caller(void){f(1);}','int f(int x){return x;}').findings.length,'function typedef declaration not false arity');
const baseline={schemaVersion:1,purpose:'reviewed-existing-interface-debt',producers:conflict.producers,findings:conflict.findings,limitations:[...new Map(conflict.gaps.map(g=>{const l=m.limitation(g);return[l.id,l]})).values()]};
check(m.compareBaseline(conflict,baseline).pass,'exact baseline conflict tolerated separately');
const changed=fixture('void f(int,int); void caller(void){f(1,2);}','void f(int x,int y,int z){}');
check(!m.compareBaseline(changed,baseline).pass,'changed provider rechecks unchanged caller');
const extra=fixture('void f(int,int); void caller(void){f(1,2);f(3,4);}','void f(int x){}');
check(!m.compareBaseline(extra,baseline).pass,'additional call not hidden');
const unparsed=fixture('void f(int,int); void caller(void){f(1,2);}','void f(int x){');
check(!m.compareBaseline(unparsed,baseline).pass,'parse failure cannot erase conflict');
const renamed=JSON.parse(JSON.stringify(baseline));renamed.findings[0].kind='fake';assert.throws(()=>m.compareBaseline(conflict,renamed));assertions++;
const duplicate=JSON.parse(JSON.stringify(baseline));duplicate.findings.push(duplicate.findings[0]);assert.throws(()=>m.compareBaseline(conflict,duplicate));assertions++;
const duplicateProducer=JSON.parse(JSON.stringify(baseline));duplicateProducer.producers.push(duplicateProducer.producers[0]);assert.throws(()=>m.compareBaseline(conflict,duplicateProducer));assertions++;
const broken={...config,executable:{...config.executable,sha256:'0'.repeat(64)}};assert.throws(()=>m.authenticate(root,broken));assertions++;
check(m.compareBaseline(fixture('void caller(void){}','void f(int x){}'),baseline).pass,'resolved debt is progress');
check(m.compareBaseline(fixture('/* moved */\nvoid f(int,int); void caller(void){/* comment */ f (1, 2);}','void f(int x){int unrelated=9;}'),baseline).pass,'formatting and unrelated provider body do not alter debt');
check(!m.compareBaseline(fixture('void f(int,int); void caller(void){f(1,3);}','void f(int x){}'),baseline).pass,'replaced incompatible call rejected');
const failedParse=fixture('void caller(void){int x=0;x++; broken','void f(void){}');
const failedBaseline={schemaVersion:1,purpose:'reviewed-existing-interface-debt',producers:failedParse.producers,findings:failedParse.findings,limitations:[...new Map(failedParse.gaps.map(g=>{const l=m.limitation(g);return[l.id,l]})).values()]};
check(!m.compareBaseline(fixture('void caller(void){int x=0;x + +; broken','void f(void){}'),failedBaseline).pass,'unparsed punctuation changes cannot reuse debt');
for(const provider of ['void f(float x){}','int f(int x){return x;}']) {
  const old=fixture('void f(int);void caller(void){f(1);}',provider);
  const debt={schemaVersion:1,purpose:'reviewed-existing-interface-debt',producers:old.producers,findings:old.findings,limitations:[...new Map(old.gaps.map(g=>{const l=m.limitation(g);return[l.id,l]})).values()]};
  check(!m.compareBaseline(fixture('void f(int);void caller(void){f(1);f(2);}',provider),debt).pass,'additional signature-conflicting call rejected');
  check(!m.compareBaseline(fixture('void f(int);void caller(void){f(1);f(1);}',provider),debt).pass,'duplicate signature-conflicting use rejected');
  check(!m.compareBaseline(fixture('void f(int);void caller(void){f(2);}',provider),debt).pass,'replaced signature-conflicting use rejected');
  check(m.compareBaseline(fixture('void f(int);void caller(void){}',provider),debt).pass,'resolved incompatible use is progress');
  check(m.compareBaseline(fixture('/*note*/void f(int);void caller(void){ f ( 1 );}',provider+' /*body note*/'),debt).pass,'signature debt stable under formatting');
}
{
  const old=fixture('void f(int,...);void caller(void){f(1);}','void f(int x){}');
  const debt={schemaVersion:1,purpose:'reviewed-existing-interface-debt',producers:old.producers,findings:old.findings,limitations:[]};
  check(!m.compareBaseline(fixture('void f(int,...);void caller(void){f(1);f(2);}','void f(int x){}'),debt).pass,'added conflicting prototype-mode use rejected');
}
console.log(JSON.stringify({assertions,scratch,status:'pass'}));
function checkPreFixAudio(loaded) {
  const selected=loaded.units.filter(u=>['src/lib/func_00284288.c','src/overlays/descriptor_14/func_002831E0.c'].includes(u.identity.source));
  assert.strictEqual(selected.length,2);
  for(const u of selected)u.analysis=m.parse(exe,u.file,u.source);
  const real=m.analyze(selected,loaded.linked);
  assert(real.findings.some(f=>f.kind==='call-arity'&&f.call.name==='func_002831E0'&&f.call.count===2&&f.definition.params.length===1));
  assert(real.findings.some(f=>f.kind==='prototype-arity'&&f.declaration.name==='func_002831E0'));
  const provider=selected.find(u=>u.identity.source.includes('descriptor_14'));
  const original=provider.source;
  provider.source=original.replace('func_002831E0(s32 i)','func_002831E0(s32 i, s32 unused)');
  const file=path.join(scratch,'real-provider-variant.i');fs.writeFileSync(file,provider.source);
  provider.analysis=m.parse(exe,file,provider.source);
  provider.identity={...provider.identity,sha256:m.digest(provider.source)};
  const corrected=m.analyze(selected,loaded.linked);
  assert(!corrected.findings.some(f=>['call-arity','prototype-arity'].includes(f.kind)&&f.provider.source===provider.identity.source));
  provider.source=original.replace('func_002831E0(s32 i)','func_002831E0(s32 i, s32 unused, s32 third)');
  fs.writeFileSync(file,provider.source);provider.analysis=m.parse(exe,file,provider.source);provider.identity={...provider.identity,sha256:m.digest(provider.source)};
  assert(m.analyze(selected,loaded.linked).findings.some(f=>f.kind==='call-arity'&&f.call.name==='func_002831E0'&&f.definition.params.length===3));
  console.log('Real 0x6F caller/provider, two-argument correction, and unchanged-caller/three-argument-provider controls: PASS');
  const audio=loaded.units.filter(u=>['src/lib/func_00208DC8.c','src/lib/func_0003fb94.c'].includes(u.identity.source));
  assert.strictEqual(audio.length,2);for(const u of audio)u.analysis=m.parse(exe,u.file,u.source);
  assert(m.analyze(audio,loaded.linked,loaded.authority).findings.some(f=>f.kind==='call-arity'&&f.call.name==='func_800EA604'&&f.call.count===1&&f.definition.params.length===2));
  const caller=audio.find(u=>u.identity.source.includes('00208DC8'));
  caller.source=caller.source.replace('func_800EA604(void *arg0)','func_800EA604(void *arg0, int id)').replace('func_800EA604(0)','func_800EA604(0, arg1)');
  fs.writeFileSync(file,caller.source);caller.analysis=m.parse(exe,file,caller.source);
  assert(!m.analyze(audio,loaded.linked,loaded.authority).findings.some(f=>f.kind==='call-arity'&&f.call.name==='func_800EA604'));
  console.log('Real fixed-address audio alias and changed-call control: PASS');
}

function directArgument(node) {
  while (node?.kind === 'ParenExpr' || node?.kind === 'ImplicitCastExpr' && node.castKind === 'LValueToRValue') {
    node = node.inner[0];
  }
  return node?.kind === 'DeclRefExpr' ? node.referencedDecl : null;
}

function checkForwarding(unit, owner, aliases) {
  function checkSource(file) {
    const ast = JSON.parse(execFileSync(exe, [...m.FLAGS, file], { maxBuffer: 16 * 1024 * 1024, windowsHide: true }));
    const definition = ast.inner.find(node => node.kind === 'FunctionDecl' && node.name === owner);
    const parameters = definition.inner.filter(node => node.kind === 'ParmVarDecl');
    assert.strictEqual(parameters.length, 2);
    const calls = [];
    function visit(node) {
      if (node.kind === 'CallExpr') calls.push(node);
      for (const child of node.inner || []) visit(child);
    }
    visit(definition.inner.find(node => node.kind === 'CompoundStmt'));
    const sites = new Map();
    for (const alias of aliases) {
      const matching = calls.filter(call => call.inner[0].inner[0]?.referencedDecl?.name === alias);
      assert.strictEqual(matching.length, 1, alias);
      const call = matching[0];
      assert.strictEqual(call.inner.length, 3, `missing forwarded argument to ${alias}`);
      assert.strictEqual(directArgument(call.inner[2])?.id, parameters[1].id, `changed forwarded value to ${alias}`);
      const declaration = ast.inner.find(node => node.kind === 'FunctionDecl' && node.name === alias);
      sites.set(alias, { call, declaration });
    }
    return sites;
  }

  const sites = checkSource(unit.file);
  const bytes = Buffer.from(unit.source);
  for (const [alias, { call, declaration }] of sites) {
    const variant = path.join(scratch, `${alias}-missing-argument.i`);
    // Reproduce both halves of the old bug so the missing argument parses cleanly.
    const edits = [[call.inner[1].range.end, call.range.end.offset],
      [declaration.inner[0].range.end, declaration.range.end.offset]].sort((a, b) => b[1] - a[1]);
    let modified = bytes;
    for (const [from, to] of edits) {
      const start = from.offset + from.tokLen;
      assert.match(modified.subarray(start, to).toString('utf8'), /^\s*,/);
      modified = Buffer.concat([modified.subarray(0, start), modified.subarray(to)]);
    }
    fs.writeFileSync(variant, modified);
    assert.throws(() => checkSource(variant), new RegExp(`missing forwarded argument to ${alias}`));

    const value = call.inner[2].range;
    const wrongValue = path.join(scratch, `${alias}-constant-argument.i`);
    fs.writeFileSync(wrongValue, Buffer.concat([bytes.subarray(0, value.begin.offset), Buffer.from('0'),
      bytes.subarray(value.end.offset + value.end.tokLen)]));
    assert.throws(() => checkSource(wrongValue), new RegExp(`changed forwarded value to ${alias}`));
  }
}

function checkCurrentAudio(loaded) {
  const gain = 'src/overlays/descriptor_14/func_002831E0.c';
  const route = 'src/lib/func_00208DC8.c';
  const pairs = [['src/lib/func_00284288.c', gain, 'func_002831E0'],
    [route, 'src/lib/func_0003fb94.c', 'func_800EA604']];
  const selected = loaded.units.filter(unit => pairs.some(([caller, provider]) => [caller, provider].includes(unit.identity.source)));
  assert.strictEqual(selected.length, 4);
  for (const unit of selected) unit.analysis = m.parse(exe, unit.file, unit.source);
  const result = m.analyze(selected, loaded.linked, loaded.authority);
  for (const [caller, provider, name] of pairs) {
    const samePair = item => item.caller.source === caller && item.provider.source === provider;
    assert.strictEqual(result.edges.filter(edge => samePair(edge) && edge.name === name && edge.count === 2).length, 1, name);
    assert(!result.findings.some(finding => samePair(finding) && (finding.call?.name || finding.declaration?.name) === name), name);
  }
  checkForwarding(selected.find(unit => unit.identity.source === gain), 'func_002831E0', ['D_800EA838', 'D_800EA884']);
  checkForwarding(selected.find(unit => unit.identity.source === route), 'func_00208DC8', ['func_800EA604']);
  console.log('Current audio aliases forward the second argument. Missing and changed argument controls passed.');
}

if (process.env.OB64_INTERFACE_REAL_BUILD) {
  const output = process.env.OB64_INTERFACE_REAL_BUILD;
  const preFixRoot = process.env.OB64_INTERFACE_PRE_FIX_INPUT_ROOT;
  const build = JSON.parse(fs.readFileSync(path.join(output, 'build-report.json')));
  // The pre-fix root is the data directory of a retained pre-fix input capture.
  // Use the live input root for the current-build regression.
  const loaded = m.loadBuild(output, build, preFixRoot || root);
  if (preFixRoot) checkPreFixAudio(loaded);
  else checkCurrentAudio(loaded);
}
