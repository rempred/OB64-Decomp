'use strict';
// Refreshable research presentation. Never participates in compilation/cache acceptance.
const fs=require('fs'),path=require('path');
const {ROOT,sha256File}=require('../phase7_conventional');
const {candidateRecord}=require('./compiler');
const {digest,loadWorkbenchModel,resolveTarget,scratchCapability}=require('./target_model');
const {DATABASE,requestStore}=require('./store');
const {validateObservation,authenticateEvidence,regular,canonicalPath}=require('./research');
const policy=require('../source_policy');
const hash=x=>typeof x==='string'&&/^[A-F0-9]{64}$/.test(x);
const relative=file=>path.relative(ROOT,file).replace(/\\/g,'/');
function assess(target,record){
 const result={origin:record.origin,metadata:record.metadataPath||null,validity:'malformed'};
 try {
  const e=record.envelope,a=validateObservation(e.authored);
  if(e.schemaVersion!==1||e.symbol!==target.symbol||!hash(e.candidateId)||!hash(e.observationId)||!canonicalPath(e.source))throw new Error('malformed research envelope identity');
  Object.assign(result,{candidateId:e.candidateId,observationId:e.observationId,source:e.source,
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
 try{
  regular(directory,true);
  for(const name of fs.readdirSync(directory).filter(n=>n.endsWith('.observation.json')).sort()){
   const file=path.join(directory,name);
   try{const envelope=JSON.parse(fs.readFileSync(regular(file),'utf8'));if(envelope.symbol===target.symbol)records.push({origin:'archive',metadataPath:relative(file),envelope});else {if(hash(envelope.candidateId))otherArchives.set(envelope.candidateId,{origin:'archive',metadataPath:relative(file),envelope});if(name.startsWith(target.symbol+'-'))discovery.push({path:relative(file),validity:'target-mismatch',reason:'filename and envelope symbol disagree'});}}
   catch(error){if(name.startsWith(target.symbol+'-'))discovery.push({path:relative(file),validity:'malformed',reason:error.message});}
  }
 }catch(error){discovery.push({path:relative(directory),validity:'unavailable',reason:error.message});}
 const database=path.resolve(options.database||DATABASE);let store={status:'missing'};
 if(fs.existsSync(database))try{
  regular(database);const rows=requestStore({action:'query',name:'research_intake',args:{symbol:target.symbol,limit:200}},{database,readOnly:true});store={status:'available',records:rows.length,truncated:rows.length===200};
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
 return {schemaVersion:1,symbol:target.symbol,targetId:target.expectedBytesSha256?target.targetId:null,targetBinding:target.expectedBytesSha256?'exact':'unavailable',status:observations.length?(issues?'partial':'found'):issues?'unavailable':'none',
  currentSource,currentProducer:target.activeMatchingProducer||null,historyApplicability:capability.supported?'Research history only; validate applicability to current source context.':'Current target is grouped; prior standalone history is reference only and does not enable single-member compilation/import/preservation.',
  boundary:'Authored research claims, not recommendations or matching acceptance. Archive observation IDs are opaque provenance. Per-record validity and targetBinding report whether candidate identity and current source/header/preprocessor/reference closure could be checked; relations have separate verification status.',
  store,discovery,counts,total:observations.length,truncated:observations.length>limit,observations:observations.slice(0,limit)};
}
function presentation(symbol,options={}){
 try{const workbench=options.workbench||loadIntakeModel();return intake(workbench,resolveTarget(workbench,symbol),options);}
 catch(error){return {symbol,status:'unavailable',reason:error.message,observations:[],boundary:'Optional research discovery failed; decompiler and matching status are unchanged.'};}
}
function loadIntakeModel(){return loadWorkbenchModel({requireBaserom:fs.existsSync(path.join(ROOT,'build/baserom.us_rev0.z64'))});}
module.exports={intake,presentation,assess,loadIntakeModel};
