'use strict';
// Diagnostic frontend only. The KMC compilation path is deliberately untouched.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const digest = x => crypto.createHash('sha256').update(typeof x === 'string' || Buffer.isBuffer(x) ? x : JSON.stringify(x)).digest('hex').toUpperCase();
const fail = m => { throw new Error(`C interfaces: ${m}`); };
const FLAGS = ['-cc1', '-triple', 'mips-unknown-none', '-target-abi', 'o32', '-std=gnu89', '-fsyntax-only', '-ast-dump=json', '-ferror-limit', '0', '-Wno-everything', '-Wint-conversion', '-Wincompatible-pointer-types', '-Wno-error=int-conversion', '-Wno-error=incompatible-pointer-types', '-x', 'cpp-output'];
// Preprocessing-token spelling, used ONLY for call identity after Clang parsing.
// Maximal munch matters: ++ differs from + +, and 1e+2 is one pp-number.
// Unsupported spellings never borrow a partial token stream as an identity.
function callTokens(bytes) {
  let s=bytes.toString('utf8');
  if(!Buffer.from(s,'utf8').equals(bytes) || /\?\?/.test(s)) throw Error('non-UTF8/trigraph spelling');
  s=s.replace(/\\\r?\n/g,'');
  const tokens=[], punct=['%:%:','>>=','<<=','...','->','++','--','<<','>>','<=','>=','==','!=','&&','||','*=','/=','%=','+=','-=','&=','^=','|=','##','<:',':>','<%','%>','%:'];
  const ucn=i=>{const m=s.slice(i).match(/^\\(?:u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})/);return m?m[0].length:0;};
  let i=0;
  while(i<s.length) {
    if(/[\t\n\v\f\r ]/.test(s[i])){i++;continue;}
    if(s.startsWith('//',i)){const end=s.indexOf('\n',i+2);i=end<0?s.length:end;continue;}
    if(s.startsWith('/*',i)){const end=s.indexOf('*/',i+2);if(end<0)throw Error('unterminated comment');i=end+2;continue;}
    const start=i, literal=s.slice(i).match(/^(?:u8|u|U|L)?(["'])/);
    if(literal) {
      i+=literal[0].length;const quote=literal[1];let closed=false;
      while(i<s.length){if(s[i]==='\\'){if(i+1>=s.length)throw Error('unterminated escape');i+=2;continue;}if(s[i]===quote){i++;closed=true;break;}if(s[i]==='\n'||s[i]==='\r')throw Error('newline in literal');i++;}
      if(!closed)throw Error('unterminated literal');tokens.push(['literal',s.slice(start,i)]);continue;
    }
    if(/[A-Za-z_$]/.test(s[i]) || ucn(i)) {
      i+=ucn(i)||1;while(i<s.length){const n=ucn(i);if(n)i+=n;else if(/[A-Za-z_0-9$]/.test(s[i]))i++;else break;}
      tokens.push(['identifier',s.slice(start,i)]);continue;
    }
    if(/[0-9]/.test(s[i]) || s[i]==='.' && /[0-9]/.test(s[i+1]||'')) {
      i++;while(i<s.length){const n=ucn(i);if(n)i+=n;else if(/[A-Za-z_0-9.]/.test(s[i]))i++;else if(/[+-]/.test(s[i])&&/[eEpP]/.test(s[i-1]))i++;else break;}
      tokens.push(['pp-number',s.slice(start,i)]);continue;
    }
    const p=punct.find(p=>s.startsWith(p,i));
    if(p){tokens.push(['punctuator',p]);i+=p.length;continue;}
    if('[](){}.&*+-~!/%<>^|?:;=,#'.includes(s[i])){tokens.push(['punctuator',s[i++]]);continue;}
    throw Error('unsupported preprocessing character');
  }
  return tokens;
}
function callAnchor(sourceBytes,node) {
  const begin=node.range?.begin?.offset,end=node.range?.end?.offset,length=node.range?.end?.tokLen;
  if(!Number.isSafeInteger(begin)||!Number.isSafeInteger(end)||!Number.isSafeInteger(length)||begin<0||end<begin||length<1||end+length>sourceBytes.length)
    return {anchor:digest(sourceBytes),anchorKind:'exact-unresolved-range',anchorError:'invalid AST source range'};
  const bytes=sourceBytes.subarray(begin,end+length);
  try{return{anchor:digest(callTokens(bytes)),anchorKind:'preprocessing-tokens-v1'};}
  catch(error){return{anchor:digest(bytes),anchorKind:'exact-unsupported-spelling',anchorError:error.message};}
}
function checkedFile(root, relative, expected) {
  if (typeof relative !== 'string' || path.isAbsolute(relative)) fail('invalid relative input path');
  const file = path.resolve(root, relative), rel = path.relative(root, file);
  if (rel.startsWith('..') || path.isAbsolute(rel)) fail('escaping input path');
  let walk = root;
  for (const part of rel.split(path.sep)) {
    walk = path.join(walk, part);
    if (fs.lstatSync(walk).isSymbolicLink()) fail(`symlink input ${relative}`);
  }
  const bytes = fs.readFileSync(file);
  if (!expected || bytes.length !== expected.bytes || digest(bytes) !== expected.sha256) fail(`identity mismatch ${relative}`);
  return bytes;
}
function authenticate(root, config, inputs) {
  if (config.schemaVersion !== 1 || config.version !== '21.1.8' || JSON.stringify(config.flags) !== JSON.stringify(FLAGS)) fail('frontend configuration drift');
  const file=path.resolve(root,config.executable.path),relative=path.relative(root,file);
  if(path.isAbsolute(config.executable.path)||relative.startsWith('..')||path.isAbsolute(relative))fail('frontend path escapes repository');
  try {
    if(inputs){const bytes=inputs.readUnretained?inputs.readUnretained(file):inputs.read(file);if(bytes.length!==config.executable.bytes||digest(bytes)!==config.executable.sha256)fail('selected frontend identity');}
    else checkedFile(root, config.executable.path, config.executable);
  }
  catch (error) { fail(`pinned diagnostic Clang missing/changed; run node tools/setup_c_interfaces.js --archive <official LLVM archive> or --clang <exact clang.exe>. ${error.message}`); }
  return inputs?inputs.resolve(file):file;
}
function walk(n, fn) { fn(n); for (const c of n.inner || []) walk(c, fn); }
function extract(ast, source) {
  const aliases = new Map(), nodes = new Map(), functions = [], calls = [], unsupported = [];
  walk(ast, n => { if (n.id) nodes.set(n.id, n); if (n.kind === 'TypedefDecl') {
    const spelling = n.type.desugaredQualType || n.type.qualType;
    aliases.set(n.name, aliases.has(n.name) && aliases.get(n.name) !== spelling ? null : spelling);
  } });
  const sourceBytes = Buffer.from(source,'utf8');
  function type(t) {
    let s = t?.desugaredQualType || t?.qualType || '';
    for (let i = 0; i < 12; i++) { let changed = false; s = s.replace(/\b[A-Za-z_]\w*\b/g, (name,offset,whole) => {
      if (/\b(?:struct|union|enum)\s+$/.test(whole.slice(0,offset))) return name;
      const a = aliases.get(name); if (a && a !== name) { changed = true; return a; } return name;
    }); if (!changed) break; }
    // Top-level parameter qualifiers do not participate in function compatibility.
    s = s.trim().replace(/\s+/g, ' ').replace(/\s*\*\s*/g, ' * ').trim();
    if (!s.includes('*')) s = s.replace(/\b(const|volatile|restrict)\b/g, '').trim().replace(/\s+/g, ' ');
    else s = s.replace(/\*\s+(?:(?:const|volatile|restrict)\s*)+$/, '*').trim();
    const words = s.replace(/\b(const|volatile|restrict)\b/g, '').replace(/\*/g, '').trim().split(/\s+/);
    const known = words.length && words.every(w => ['void','char','signed','unsigned','short','int','long','float','double','_Bool'].includes(w));
    return { spelling: s, known: !!known };
  }
  walk(ast, n => {
    if (n.kind !== 'FunctionDecl' || n.isImplicit) return;
    const q = n.type?.qualType || '', open = q.indexOf('(');
    const body = (n.inner || []).find(c => c.kind === 'CompoundStmt');
    const params = (n.inner || []).filter(c => c.kind === 'ParmVarDecl');
    const f = { id: n.id, name: n.name, linkerName: n.mangledName || n.name, local: n.storageClass === 'static', definition: !!body,
      offset: n.loc?.offset, returnType: type({ qualType: open < 0 ? '' : q.slice(0, open).trim() }),
      params: params.map(p => type(p.type)), mode: n.variadic ? 'variadic' : /\(\)$/.test(q) ? (body ? 'definition-empty' : 'unspecified') : 'fixed' };
    if (q.slice(open + 1).trim().startsWith('*')) f.returnType = { spelling: q, known: false };
    if (open < 0) { f.mode = 'unsupported'; unsupported.push({reason:'function-typedef-signature',name:f.name,type:type(n.type)}); }
    if (body && sourceBytes.subarray(n.loc?.offset || 0,body.range.begin.offset).includes(59)) {
      f.mode = 'old-style'; unsupported.push({ reason: 'old-style-definition-promotions', name: f.name, offset: f.offset,params:f.params,returnType:f.returnType });
    }
    for(const attr of (n.inner || []).filter(c=>/Attr$/.test(c.kind))) unsupported.push({ reason:'function-attribute',name:f.name,attribute:attr.kind,
      attributeBytes:digest(sourceBytes.subarray(attr.range?.begin?.offset||0,(attr.range?.end?.offset||0)+(attr.range?.end?.tokLen||1))) });
    functions.push(f);
  });
  const byId = new Map(functions.map(f => [f.id, f]));
  function visit(n, owner) {
    if (n.kind === 'FunctionDecl' && (n.inner || []).some(c => c.kind === 'CompoundStmt')) owner = n.name;
    if (n.kind === 'CallExpr') {
      let callee = n.inner?.[0];
      while (callee && ['ImplicitCastExpr','ParenExpr'].includes(callee.kind) && callee.inner?.length === 1) callee = callee.inner[0];
      const referenced = callee?.kind === 'DeclRefExpr' && callee.referencedDecl?.kind === 'FunctionDecl' ? callee.referencedDecl : null;
      const decl = referenced && byId.get(referenced.id);
      calls.push({ owner, offset: n.range?.begin?.offset, end: n.range?.end?.offset, name: referenced?.name || null,
        declaration: decl || null, count: Math.max(0, (n.inner?.length || 1) - 1),
        ...callAnchor(sourceBytes,n),
        expressionSha256: digest(sourceBytes.subarray(n.range?.begin?.offset || 0, (n.range?.end?.offset || 0) + (n.range?.end?.tokLen || 1))) });
    }
    for (const c of n.inner || []) visit(c, owner);
  }
  visit(ast, null);
  const occurrences = new Map();
  for (const call of calls) { const key = `${call.owner}:${call.anchor}`; call.occurrence = (occurrences.get(key) || 0) + 1; occurrences.set(key,call.occurrence);
    if(call.anchorError)unsupported.push({reason:'call-anchor-incomplete',owner:call.owner,anchor:call.anchor,occurrence:call.occurrence,detail:call.anchorError}); }
  return { functions, calls, unsupported };
}
function parse(executable, file, source) {
  const result = cp.spawnSync(executable, [...FLAGS, file], { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024, windowsHide: true, env: { SystemRoot: process.env.SystemRoot, TEMP: process.env.TEMP, TMP: process.env.TMP } });
  if (result.error) fail(`frontend execution failed: ${result.error.message}`);
  // Error recovery ASTs are not a checked translation unit.
  if (result.status !== 0) return { status: 'unsupported', unparsedInputSha256:digest(source), diagnostics: result.stderr.trim(), functions: [], calls: [], unsupported: [{ reason: 'frontend-rejected-translation-unit' }] };
  try {
    const parsed = { status: 'parsed', ...extract(JSON.parse(result.stdout), source) };
    if (result.stderr.trim()) {
      const diagnostics=[];
      for(const line of result.stderr.split(/\r?\n/)) {
        const match=line.match(/:(\d+):(\d+): warning: (.+)$/); if(!match)continue;
        const offset=Buffer.byteLength(source.split('\n').slice(0,Number(match[1])-1).join('\n'))+(Number(match[1])>1?1:0)+Number(match[2])-1;
        const call=parsed.calls.find(c=>c.offset<=offset && offset<=c.end);
        diagnostics.push({message:match[3],owner:call?.owner,anchor:call?.anchor,occurrence:call?.occurrence});
      }
      parsed.unsupported.push({ reason: 'frontend-conversion-diagnostics', diagnosticShape:diagnostics, diagnostics: result.stderr.trim() });
    }
    return parsed;
  }
  catch (error) { fail(`invalid AST output: ${error.message}`); }
}
function cleanFunction(f) { return { name: f.name, local: f.local, offset: f.offset, mode: f.mode, returnType: f.returnType, params: f.params }; }
function analyze(units, linked, authority = { absoluteSymbols: [], overlayReservations: [] }) {
  const findings = [], gaps = [], edges = [];
  const symbolMap = new Map();
  for (const s of linked.symbols) if ([1,2].includes(s.binding) && s.sectionIndex > 0) {
    const list = symbolMap.get(s.name) || []; list.push(s); symbolMap.set(s.name, list);
  }
  const location = s => `${s.sectionIndex}:${s.value}`;
  const providers = new Map();
  for (const u of units) for (const f of u.analysis.functions.filter(f => f.definition && !f.local)) {
    const emitted = u.entries.filter(e => e.symbol === f.name && e.binding === 'GLOBAL');
    const matches = symbolMap.get(f.linkerName) || [];
    if (emitted.length !== 1 || matches.length !== 1 || !u.sections.includes(linked.sections[matches[0]?.sectionIndex]?.name)) {
      gaps.push({ producer: u.identity, reason: 'definition-linker-identity-unresolved', name: f.name }); continue;
    }
    const key = location(matches[0]), prior = providers.get(key) || [];
    prior.push({ unit: u, fn: f, symbol: matches[0] }); providers.set(key, prior);
  }
  function report(u, provider, evidence) {
    const finding = { caller: u.identity, callerEntries: u.entries.map(e=>({name:e.symbol,binding:e.binding})), callerSections: u.sections,
      provider: provider.unit.identity, linkedIdentity: { section: linked.sections[provider.symbol.sectionIndex]?.name, value: provider.symbol.value }, ...evidence };
    findings.push({ id: debtId(finding), ...finding });
  }
  function resolve(u, declaration, name) {
    if (declaration?.local) {
      const own = u.analysis.functions.filter(f => f.definition && f.name === name && f.local);
      return own.length === 1 ? { unit: u, fn: own[0], symbol: { sectionIndex: 0, value: 0 } } : null;
    }
    const symbols = symbolMap.get(declaration?.linkerName || name) || [];
    if (symbols.length !== 1) return null;
    let symbol = symbols[0];
    if (symbol.sectionIndex === 0xFFF1) {
      const admitted = authority.absoluteSymbols.filter(s=>s.name===symbol.name && Number(s.address)===symbol.value);
      if (admitted.length !== 1 || !(u.relocations || []).some(r=>r.symbol===symbol.name && r.type==='R_MIPS_26')) return null;
      const containing = linked.sections.filter(s=>(s.flags&2) && s.size>0 && symbol.value>=s.address && symbol.value<s.address+s.size);
      if (containing.length !== 1 || !(containing[0].flags&4)) return null;
      const section = containing[0];
      if (authority.overlayReservations.some(r=>section.address<r.vram_end_exclusive && r.vram_start<section.address+section.size)) return null;
      const entries=linked.symbols.filter(s=>s.binding===1 && s.symbolType===2 && s.sectionIndex===section.index && s.value===symbol.value && s.size>0);
      if (entries.length!==1 || entries[0].value!==section.address) return null;
      symbol=entries[0];
    }
    const resolved = providers.get(location(symbol)) || [];
    return resolved.length === 1 ? resolved[0] : null;
  }
  for (const u of units) {
    if (u.analysis.status !== 'parsed') { gaps.push({ producer: u.identity, reason: 'unparsed-producer', unparsedInputSha256:u.analysis.unparsedInputSha256, diagnostics: u.analysis.diagnostics }); continue; }
    for (const gap of u.analysis.unsupported) gaps.push({ producer: u.identity, ...gap });
    for (const d of u.analysis.functions.filter(f => !f.definition)) {
      const p = resolve(u, d, d.name);
      if (!p) continue;
      const left = cleanFunction(d), right = cleanFunction(p.fn);
      if (d.returnType.known && p.fn.returnType.known && d.returnType.spelling !== p.fn.returnType.spelling)
        report(u, p, { kind: 'return-type', declaration: left, definition: right });
      if (!d.returnType.known || !p.fn.returnType.known) gaps.push({ producer: u.identity, reason: 'unsupported-return-type', name: d.name, types:[d.returnType,p.fn.returnType],provider:p.unit.identity.source });
      if (['fixed','variadic','definition-empty'].includes(d.mode) && p.fn.mode !== 'old-style') {
        if (d.params.length !== p.fn.params.length || (d.mode === 'variadic') !== (p.fn.mode === 'variadic')) report(u, p, { kind: 'prototype-arity', declaration: left, definition: right });
        else d.params.forEach((t, i) => {
          if (t.known && p.fn.params[i].known && t.spelling !== p.fn.params[i].spelling) report(u, p, { kind: 'parameter-type', index: i, declaration: left, definition: right });
          else if (!t.known || !p.fn.params[i].known) gaps.push({ producer: u.identity, reason: 'unsupported-parameter-type', name: d.name, index: i, types:[t,p.fn.params[i]],provider:p.unit.identity.source });
        });
      } else gaps.push({ producer: u.identity, reason: 'unspecified-or-unsupported-prototype', name: d.name, definition:{params:p.fn.params,returnType:p.fn.returnType,mode:p.fn.mode},declaration:{params:d.params,returnType:d.returnType,mode:d.mode} });
    }
    for (const c of u.analysis.calls) {
      if (!c.name || !c.declaration) { gaps.push({ producer: u.identity, reason: c.name ? 'implicit-function-declaration' : 'indirect-call', offset: c.offset,owner:c.owner,anchor:c.anchor,occurrence:c.occurrence }); continue; }
      const p = resolve(u, c.declaration, c.name);
      if (!p) { gaps.push({ producer: u.identity, reason: 'callee-without-unique-analyzed-C-provider', name: c.name, offset: c.offset,owner:c.owner,anchor:c.anchor,occurrence:c.occurrence }); continue; }
      const edge = { caller: u.identity, provider: p.unit.identity, name: c.name, owner: c.owner, offset: c.offset, count: c.count, expressionSha256: c.expressionSha256, anchor: c.anchor, occurrence: c.occurrence };
      edges.push(edge);
      if (p.fn.mode === 'variadic' ? c.count < p.fn.params.length : c.count !== p.fn.params.length)
        report(u, p, { kind: 'call-arity', call: edge, definition: cleanFunction(p.fn) });
      const d=c.declaration, mismatches=[];
      let incomplete=!d.returnType.known || !p.fn.returnType.known;
      if(!incomplete && d.returnType.spelling!==p.fn.returnType.spelling)mismatches.push('return-type');
      if(['fixed','variadic','definition-empty'].includes(d.mode) && p.fn.mode!=='old-style') {
        if((d.mode==='variadic')!==(p.fn.mode==='variadic'))mismatches.push('variadic-mode');
        if(d.params.length===p.fn.params.length) d.params.forEach((t,i)=> {
          if(!t.known || !p.fn.params[i].known)incomplete=true;
          else if(t.spelling!==p.fn.params[i].spelling)mismatches.push(`parameter-${i}`);
        });
      } else incomplete=true;
      if(mismatches.length)report(u,p,{kind:'call-signature',mismatches,call:edge,declaration:cleanFunction(d),definition:cleanFunction(p.fn)});
      if(incomplete)gaps.push({producer:u.identity,reason:'call-type-analysis-incomplete',name:c.name,owner:c.owner,anchor:c.anchor,occurrence:c.occurrence,
        declaration:{params:d.params,returnType:d.returnType,mode:d.mode},definition:{params:p.fn.params,returnType:p.fn.returnType,mode:p.fn.mode}});
      // Arguments already undergo C conversions at the call's visible declaration.
      // Do not compare raw expression types (e.g. short supplied to int).
    }
  }
  const unique = [...new Map(findings.map(f => [f.id,f])).values()].sort((a,b) => a.id.localeCompare(b.id));
  return { findings: unique, gaps, edges, coverage: { producers: units.length, parsed: units.filter(u => u.analysis.status === 'parsed').length, unparsed: units.filter(u => u.analysis.status !== 'parsed').length, calls: units.reduce((n,u)=>n+u.analysis.calls.length,0), resolvedCalls: edges.length, limitations: gaps.length } };
}
function debtId(finding) {
  const signature = f => f && { name: f.name, local: f.local, mode: f.mode, returnType: f.returnType, params: f.params };
  return digest({ kind: finding.kind, caller: { source:finding.caller.source, sections:finding.callerSections, entry:finding.call && finding.callerEntries.find(e=>e.name===finding.call.owner) },
    provider: { source:finding.provider.source, linkedIdentity:finding.linkedIdentity }, index:finding.index,mismatches:finding.mismatches,
    declaration:signature(finding.declaration), definition:signature(finding.definition),
    call:finding.call && { name:finding.call.name,owner:finding.call.owner,count:finding.call.count,anchor:finding.call.anchor,occurrence:finding.call.occurrence } });
}
function compareBaseline(report, baseline) {
  if (!baseline || baseline.schemaVersion !== 1 || baseline.purpose !== 'reviewed-existing-interface-debt' || !Array.isArray(baseline.findings) || !Array.isArray(baseline.producers) || !Array.isArray(baseline.limitations)) fail('missing/malformed reviewed baseline');
  const prior = new Map();
  for (const p of baseline.producers) {
    if (!p.source || !/^[A-F0-9]{64}$/.test(p.sha256) || !/^[A-F0-9]{64}$/.test(p.authoredSha256) || prior.has(p.source)) fail('malformed/duplicate baseline producer');
    prior.set(p.source,p);
  }
  const validEvidence = p => p && JSON.stringify(prior.get(p.source))===JSON.stringify(p);
  const seen = new Set();
  for (const f of baseline.findings) {
    const { id, ...body } = f;
    if (id !== debtId(body) || seen.has(id) || !validEvidence(f.caller) || !validEvidence(f.provider)) fail('forged or duplicate baseline finding');
    seen.add(id);
  }
  const current = new Set(report.findings.map(f => f.id));
  const resolved = baseline.findings.filter(f => !current.has(f.id));
  const fresh = report.findings.filter(f => !seen.has(f.id));
  const gapIds = new Set();
  for (const g of baseline.limitations) {
    const { id, ...body } = g;
    if (id !== limitation(body).id || gapIds.has(id) || !validEvidence(g.producer)) fail('malformed/duplicate baseline limitation');
    gapIds.add(id);
  }
  const changedGaps = report.gaps.filter(g => !gapIds.has(limitation(g).id));
  return { pass: !fresh.length && !changedGaps.length, newConflicts: fresh, resolvedDebt: resolved, changedUnresolved: changedGaps, existingConflicts: report.findings.length - fresh.length };
}
function limitation(gap) {
  // Paths in frontend diagnostic text vary by checkout; the expanded bytes and
  // reason remain authenticated. Preserve diagnostic text in the generated report.
  const { diagnostics, id, ...body } = gap;
  // Stable scope; source hashes/locations remain evidence, not suppression keys.
  const { producer,offset,...shape }=body;
  return { id: digest({source:producer.source,...shape}), ...body };
}
function loadBuild(output, report, root) {
  const linked = JSON.parse(checkedFile(output,'phase8.elf-report.json',report.outputs.elfReport));
  const bySource = new Map();
  for (const r of report.targetReplacements) {
    const bytes = checkedFile(output, r.compilationInput.path, r.compilationInput);
    const key = r.compilationInput.path;
    let unit = bySource.get(key);
    if (unit && unit.identity.sha256 !== digest(bytes)) fail('producer input identity collision');
    if (!unit) { unit = { file: path.join(output,key), source: bytes.toString('utf8'), identity: { source: key, sha256: digest(bytes), authoredSha256: r.sourceSha256 }, entries: [], sections: [], relocations: [] }; bySource.set(key, unit); }
    unit.relocations.push(...(r.relocations || []));
    for (const e of r.compilerTextFunctions || []) if (!unit.entries.some(x => JSON.stringify(x) === JSON.stringify(e))) unit.entries.push(e);
    for (const o of r.owners || []) if (!unit.sections.includes(o.sectionName)) unit.sections.push(o.sectionName);
  }
  let authority={absoluteSymbols:[],overlayReservations:[]};
  if(root) {
    for (const identity of [...(report.acceptedInputs.cSources || []),...(report.acceptedInputs.cDependencies || [])]) checkedFile(root,identity.path,identity);
    const linkage=report.acceptedInputs.linkageConfig;
    const placement=report.acceptedInputs.phase7Model.find(r=>r.path==='config/splat/us_rev0.overlay-linker-inputs.json');
    if(!placement)fail('missing accepted overlay reservation identity');
    authority={absoluteSymbols:JSON.parse(checkedFile(root,linkage.path,linkage)).symbols,
      overlayReservations:JSON.parse(checkedFile(root,placement.path,placement)).overlayReservations};
  }
  return { units: [...bySource.values()], linked, authority };
}
function run(root, output, buildReport, config, baseline) {
  const start = performance.now(), executable = authenticate(root,config);
  let baselineBytes;
  if (baseline) {
    baselineBytes=fs.readFileSync(path.join(root,'config/c-interface-baseline.json'));
    if(digest(JSON.parse(baselineBytes))!==digest(baseline))fail('baseline differs from configured reviewed input');
  }
  const { units, linked, authority } = loadBuild(output,buildReport,root);
  for (const u of units) u.analysis = parse(executable,u.file,u.source);
  const report = { schemaVersion: 1, evidence: 'source-interface-consistency-not-ROM-equivalence', frontend: digest(config), producers: units.map(u=>u.identity), ...analyze(units,linked,authority) };
  report.verdict = baseline ? compareBaseline(report,baseline) : null;
  // Detect changed inputs/tool after the scan, including mutations during subprocesses.
  authenticate(root,config);
  if (baselineBytes && !fs.readFileSync(path.join(root,'config/c-interface-baseline.json')).equals(baselineBytes)) fail('baseline changed during scan');
  const closing = loadBuild(output,buildReport,root);
  if (JSON.stringify(closing.units.map(u=>u.identity)) !== JSON.stringify(report.producers)) fail('input drift during scan');
  report.elapsedMs = performance.now()-start;
  return report;
}
module.exports = { FLAGS, digest, callTokens, callAnchor, debtId, checkedFile, authenticate, extract, parse, analyze, compareBaseline, limitation, loadBuild, run };
