'use strict';
// Refreshable research presentation. Never participates in compilation/cache acceptance.
const fs=require('fs'),path=require('path');
const {ROOT,sha256File}=require('../phase7_conventional');
const {candidateRecord}=require('./compiler');
const {digest,loadWorkbenchModel,resolveTarget,scratchCapability,historicalSymbols,publicTarget}=require('./target_model');
const {DATABASE,requestStore}=require('./store');
const {validateObservation,authenticateEvidence,regular,canonicalPath}=require('./research');
const policy=require('../source_policy');
const {selectKnowledge}=require('./knowledge');
const hash=x=>typeof x==='string'&&/^[A-F0-9]{64}$/.test(x);
const relative=file=>path.relative(ROOT,file).replace(/\\/g,'/');
function assess(target,record){
 const result={origin:record.origin,metadata:record.metadataPath||null,validity:'malformed'};
 try {
  const e=record.envelope,a=validateObservation(e.authored);
  if(e.schemaVersion!==1||!historicalSymbols(target).includes(String(e.symbol).toLowerCase())||!hash(e.candidateId)||!hash(e.observationId)||!canonicalPath(e.source))throw new Error('malformed research envelope identity');
  Object.assign(result,{recordedSymbol:e.symbol,candidateId:e.candidateId,observationId:e.observationId,source:e.source,
   dossier:record.metadataPath&&fs.existsSync(path.join(ROOT,record.metadataPath.replace(/\.observation\.json$/,'.md')))?record.metadataPath.replace(/\.observation\.json$/,'.md'):null,
   label:a.label,role:a.role,selectedBest:a.selectedBest,context:a.context,sourceChange:a.sourceChange,effects:a.effects,
   observedEffect:a.observedEffect,remainingFailure:a.remainingFailure,parentCandidateId:a.parentCandidateId,relatedCandidateIds:a.relatedCandidateIds});
  if(a.parentCandidateId===e.candidateId||a.relatedCandidateIds.includes(e.candidateId))throw new Error('malformed self relation');
  result.validity='stale';
  const bytes=fs.readFileSync(regular(path.join(ROOT,e.source))),source=bytes.toString('utf8');
  if(!Buffer.from(source,'utf8').equals(bytes)||sha256File(path.join(ROOT,e.source))!==a.expected.sourceSha256)throw new Error('source identity drift');
  result.sourceSha256=a.expected.sourceSha256;
  const exactTarget=!!target.expectedBytesSha256;
  result.targetBinding=exactTarget?'exact':'unavailable';
  if(exactTarget&&(candidateRecord(target,source).candidateId!==e.candidateId||record.targetId&&record.targetId!==target.targetId)){result.validity='target-mismatch';result.reason='candidate identity does not bind to current accepted target and exact source';return result;}
  if(record.stored&&exactTarget){
   const row=record.stored;
   if(row.source_text!==source||row.source_sha256!==a.expected.sourceSha256||row.variant!==a.label||row.parent_candidate_id!==a.parentCandidateId
     ||candidateRecord(target,source,{origin:row.origin,variant:row.variant,parentCandidateId:row.parent_candidate_id,metadata:row.metadata}).observationId!==e.observationId){result.validity='malformed';throw new Error('stored observation provenance mismatch');}
  }
  if(!e.authenticated?.preprocessor){result.validity='malformed';throw new Error('missing authenticated preprocessor');}
  const classification=policy.classifySource(path.join(ROOT,e.source));
  if(classification.class==='UNKNOWN'){result.validity='unavailable';throw new Error(classification.error||'source policy unavailable');}
  authenticateEvidence(classification,a,e.authenticated);
  result.validity=exactTarget?'valid':'reference-only';result.sourceClass=classification.class;
  if(!exactTarget)result.reason='Source/header/preprocessor/reference closure agrees; canonical target-byte and candidate identity cannot be verified without the baserom. Symbol discovery alone is not historical structural identity proof.';
 }catch(error){result.reason=error.message;}
 return result;
}
function intake(workbench,target,options={}){
 const limit=options.limit??20;if(!Number.isSafeInteger(limit)||limit<1||limit>200)throw new Error('intake limit must be 1..200');
 const directory=options.archiveDirectory||path.join(ROOT,'docs/dossiers'),records=[],discovery=[],otherArchives=new Map();
 const symbols=historicalSymbols(target);
 try{
  regular(directory,true);
  for(const name of fs.readdirSync(directory).filter(n=>n.endsWith('.observation.json')).sort()){
   const file=path.join(directory,name);
   try{const envelope=JSON.parse(fs.readFileSync(regular(file),'utf8'));if(symbols.includes(String(envelope.symbol).toLowerCase()))records.push({origin:'archive',metadataPath:relative(file),envelope});else {if(hash(envelope.candidateId))otherArchives.set(envelope.candidateId,{origin:'archive',metadataPath:relative(file),envelope});if(symbols.some(symbol=>name.toLowerCase().startsWith(symbol+'-')))discovery.push({path:relative(file),validity:'target-mismatch',reason:'filename and envelope symbol disagree'});}}
   catch(error){if(symbols.some(symbol=>name.toLowerCase().startsWith(symbol+'-')))discovery.push({path:relative(file),validity:'malformed',reason:error.message});}
  }
 }catch(error){discovery.push({path:relative(directory),validity:'unavailable',reason:error.message});}
 const database=path.resolve(options.database||DATABASE);let store={status:'missing'};
 if(fs.existsSync(database))try{
  regular(database);const rows=symbols.flatMap(symbol=>requestStore({action:'query',name:'research_intake',args:{symbol,limit:200}},{database,readOnly:true}));store={status:'available',records:rows.length,truncated:rows.length>=200};
  for(const row of rows)records.push({origin:'store',targetId:row.target_id,stored:row,envelope:{schemaVersion:row.metadata?.research?.schemaVersion,symbol:row.symbol,candidateId:row.candidate_id,observationId:row.observation_id,source:row.metadata?.sourcePath,authored:row.metadata?.research?.authored,authenticated:row.metadata?.research?.authenticated}});
 }catch(error){store={status:'error',reason:error.message};}
 const assessed=records.map(r=>assess(target,r)),seen=new Set(),observations=[];
 for(let i=0;i<assessed.length;i++){const row=assessed[i],key=row.validity==='valid'?row.candidateId+digest(records[i].envelope.authored):null;if(key&&seen.has(key))continue;if(key)seen.add(key);observations.push(row);}
 const counts=observations.reduce((acc,row)=>(acc[row.validity]=(acc[row.validity]||0)+1,acc),{});
 const relationCache=new Map();
 function relation(id){
  if(relationCache.has(id))return relationCache.get(id);
  let value={candidateId:id,status:'unverified',reason:'No authenticated same-target candidate was found.'};
  if(observations.some(r=>r.candidateId===id&&r.validity==='valid'))value={candidateId:id,status:'verified'};
  else if(otherArchives.has(id))try{const r=otherArchives.get(id),foreign=resolveTarget(workbench,r.envelope.symbol);if(assess(foreign,r).validity==='valid')value={candidateId:id,status:'invalid',reason:'Candidate belongs to a different accepted target.'};}catch(_){}
  if(value.status==='unverified'&&store.status==='available'&&target.expectedBytesSha256)try{
   const row=requestStore({action:'query',name:'candidate',args:{candidateId:id}},{database,readOnly:true});
   if(row&&row.target_id===target.targetId&&candidateRecord(target,row.source_text).candidateId===id)value={candidateId:id,status:'verified'};
   else if(row&&row.target_id!==target.targetId)value={candidateId:id,status:'invalid',reason:'Stored candidate belongs to a different accepted target.'};
  }catch(error){value.reason=error.message;}
  relationCache.set(id,value);return value;
 }
 for(const row of observations){const items=[...new Set([row.parentCandidateId,...(row.relatedCandidateIds||[])].filter(Boolean))].map(relation);row.relations={status:items.some(x=>x.status==='invalid')?'invalid':items.some(x=>x.status==='unverified')?'unverified':items.length?'verified':'none',items};}
 const capability=scratchCapability(workbench,target);
 let currentSource={path:target.activeMatchingSource||target.activeMatchingProducer?.source||null,sha256:null,status:'absent'};
 if(currentSource.path)try{currentSource.sha256=sha256File(regular(path.join(ROOT,currentSource.path)));currentSource.status='available';}catch(error){currentSource.status='unavailable';currentSource.reason=error.message;}
 for(const row of observations)row.matchesCurrentSource=currentSource.sha256&&row.sourceSha256?row.sourceSha256===currentSource.sha256:null;
 const issues=discovery.length||store.status==='error';
 const report={schemaVersion:1,symbol:target.symbol,targetId:target.expectedBytesSha256?target.targetId:null,targetBinding:target.expectedBytesSha256?'exact':'unavailable',status:observations.length?(issues?'partial':'found'):issues?'unavailable':'none',
  currentSource,currentProducer:target.activeMatchingProducer||null,historyApplicability:capability.supported?'Research history only; validate applicability to current source context.':capability.code==='complete-group-candidate-required'?'Current target is grouped; prior standalone history is reference only and does not enable single-member compilation/import/preservation.':capability.reason,
  boundary:'Authored research claims, not recommendations or matching acceptance. Archive observation IDs are opaque provenance. Per-record validity and targetBinding report whether candidate identity and current source/header/preprocessor/reference closure could be checked; relations have separate verification status.',
  store,discovery,counts,total:observations.length,truncated:observations.length>limit,observations:observations.slice(0,limit)};
 report.target=publicTarget(target);
 // Assess every same-target row and relation before choosing human display rows.
 report.presentation=compactSummary(report,observations);
 try{report.knowledge=selectKnowledge(workbench,target,options,assess);}
 catch(error){report.knowledge={schemaVersion:1,status:'unavailable',reason:error.message,siblings:[],lessons:[]};}
 return report;
}
const short=(value,words=28)=>{const parts=String(value??'').trim().split(/\s+/);return parts.length>words?parts.slice(0,words).join(' ')+' … [full record]':String(value??'');};
function compactSummary(report,all=report.observations||[]){
 const ordered=[...all].sort((a,b)=>Number(b.matchesCurrentSource===true)-Number(a.matchesCurrentSource===true)
   ||Number(b.selectedBest===true)-Number(a.selectedBest===true));
 const selected=[];
 function add(row){if(row&&!selected.includes(row)&&selected.length<5)selected.push(row);}
 for(const row of ordered){add(row);for(const id of [row.parentCandidateId,...(row.relatedCandidateIds||[])])add(all.find(r=>r.candidateId===id));if(selected.length===5)break;}
 return {schemaVersion:1,displayed:selected.length,omitted:Math.max(0,(report.total??all.length)-selected.length),
   observations:selected.map(row=>({source:row.source||row.metadata,label:row.label,validity:row.validity,sourceClass:row.sourceClass,
    metadata:row.metadata,dossier:row.dossier,currentSource:row.matchesCurrentSource===true,
    selectedBest:row.selectedBest?'historical annotation; not an active-best claim':null,
    context:short(row.context),sourceChange:short(row.sourceChange),observedEffect:short(row.observedEffect),remainingFailure:short(row.remainingFailure),
    reason:short(row.reason),relations:row.relations?.status})),
   detailCommand:`node tools/match.js intake ${report.symbol} --include-details --limit 200 --json`};
}
function formatHuman(report,{includeDetails=false}={}){
 if(includeDetails)return JSON.stringify(report,null,2);
 const s=report.presentation||compactSummary(report),t=report.target||{},lines=[`Research intake ${report.symbol||''}: ${report.status}`];
 if(report.reason)lines.push(short(report.reason));
 lines.push(`Target binding: ${report.targetBinding||'unavailable'}; owner: ${t.primaryId||t.sectionName||'unavailable'}; selection: ${t.selectionKind||'physical-owner'}.`);
 if(t.logicalFunctions)lines.push(`Required bodies: ${t.logicalFunctions.map(x=>x.symbol||x.name||`${x.romStart}:${x.bytes}`).join(', ')}; coverage complete: ${t.logicalCoverageComplete}.`);
 if(t.originalAssemblyParts)lines.push(`Physical owner references: ${t.originalAssemblyParts.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(', ')}`);
 lines.push(`Current source: ${report.currentSource?.path||'none'} (${report.currentSource?.status||'unavailable'}${report.currentSource?.sha256?'; '+report.currentSource.sha256.slice(0,12):''}).`);
 if(report.currentSource?.reason)lines.push(`Current-source issue: ${short(report.currentSource.reason)}`);
 if(report.currentProducer)lines.push(`Producer: ${report.currentProducer.kind}; ${report.currentProducer.source||''}${report.currentProducer.members?'; all members: '+report.currentProducer.members.map(x=>x.symbol||x).join(', '):''}.`);
 if(report.historyApplicability)lines.push(report.historyApplicability);
 lines.push(`Own history: ${report.total??0}; ${Object.entries(report.counts||{}).map(([k,v])=>`${k}=${v}`).join(', ')||'no assessed records'}. Store: ${report.store?.status||'unavailable'}${report.store?.truncated?' (query truncated)':''}.`);
 if(report.store?.reason)lines.push(`Store issue: ${short(report.store.reason)}`);
 for(const d of (report.discovery||[]).slice(0,3))lines.push(`Discovery ${d.validity}: ${d.path}; ${short(d.reason)}`);
 if((report.discovery||[]).length>3)lines.push(`${report.discovery.length-3} further discovery issues in full detail.`);
 for(const row of s.observations){
  lines.push(`- ${row.label||'unlabeled'}: ${row.validity}${row.sourceClass?' / '+row.sourceClass:''}${row.currentSource?' / current source':''}${row.selectedBest?' / historical selected-best':''}; relations: ${row.relations||'none'}.`,
   `  Source: ${row.source||'unavailable'}${row.dossier?'; dossier: '+row.dossier:''}`);
  for(const [label,key] of [['Context','context'],['Change','sourceChange'],['Effect (authored)','observedEffect'],['Remaining / next question','remainingFailure'],['Issue','reason']])if(row[key])lines.push(`  ${label}: ${row[key]}`);
 }
 lines.push(`${s.omitted} own records omitted from compact display; JSON census limit truncated: ${Boolean(report.truncated)}.`);
 const k=report.knowledge;
 if(k){lines.push(`Cross-target discovery: ${k.status}${k.reason?'; '+short(k.reason):''}.`);
  for(const row of k.siblings||[]){const o=row.observation;lines.push(`- Sibling ${row.symbol} (${row.tier}): ${row.validity}${row.sourceClass?' / '+row.sourceClass:''}; ${row.source||o?.source||o?.metadata||'unavailable'}.`,
    `  ${row.normalizationLimit} ${row.applicability.reason}`);if(o)lines.push(`  Change: ${short(o.sourceChange)} Effect (authored): ${short(o.observedEffect)} Remaining: ${short(o.remainingFailure)}${o.reason?' Issue: '+short(o.reason):''}`);}
  for(const row of k.lessons||[]){lines.push(`- Lesson ${row.id}: ${row.note}`,`  ${short(row.applicability,45)}`);for(const ref of row.references||[])lines.push(`  Reference (not authenticated observation): ${ref}`);for(const o of row.observations)lines.push(`  ${o.validity}: ${o.metadata}; ${short(o.reason||o.remainingFailure,20)}`);}
  for(const d of (k.diagnostics||[]).slice(0,3))lines.push(`Cross discovery ${d.validity}: ${d.path||''}; ${short(d.reason)}`);
  if((k.diagnostics||[]).length>3)lines.push(`${k.diagnostics.length-3} further cross discovery issues in full detail.`);
  if(k.siblingsOmitted||k.lessonsOmitted)lines.push(`Further results: siblings=${k.siblingsOmitted}, lessons=${k.lessonsOmitted}.`);
 }
 lines.push('Research and source examples do not establish matching acceptance. Historical selected-best annotations do not identify the active best.',`Full detail: ${s.detailCommand}`);
 return lines.join('\n');
}
function presentation(symbol,options={}){
 try{const workbench=options.workbench||loadIntakeModel();return intake(workbench,resolveTarget(workbench,symbol),options);}
 catch(error){return {symbol,status:'unavailable',reason:error.message,observations:[],boundary:'Optional research discovery failed; decompiler and matching status are unchanged.'};}
}
function loadIntakeModel(){return loadWorkbenchModel({requireBaserom:fs.existsSync(path.join(ROOT,'build/baserom.us_rev0.z64'))});}
module.exports={intake,presentation,assess,loadIntakeModel,compactSummary,formatHuman};
