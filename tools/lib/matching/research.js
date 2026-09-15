'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, sha256File } = require('../phase7_conventional');
const { digest, canonicalJson, assertScratchCapability } = require('./target_model');
const { recordCandidate, candidateRecord, MATCHING_ROOT } = require('./compiler');
const { requestStore } = require('./store');
const policy = require('../source_policy');

const same = (a, b) => canonicalJson(a) === canonicalJson(b);
const hash = value => typeof value === 'string' && /^[A-F0-9]{64}$/.test(value);
const text = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 8000 && !value.includes('\0');
const relative = file => path.relative(ROOT, file).replace(/\\/g, '/');
function canonicalPath(value) {
  return text(value) && !value.includes('\\') && !value.includes(':') && !value.includes('\0')
    && !path.posix.isAbsolute(value) && value !== '.' && value !== '..' && !value.startsWith('../') && path.posix.normalize(value) === value;
}
function regular(file, directory = false) {
  const resolved = path.resolve(file), rel = relative(resolved);
  if (!canonicalPath(rel) && !(directory && rel === '')) throw new Error('research path must stay inside the repository');
  for (let current = resolved; ; current = path.dirname(current)) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error('research path is a symlink');
    if (current.toLowerCase() === ROOT.toLowerCase() || path.dirname(current) === current) break;
  }
  if (!fs.existsSync(resolved) || !(directory ? fs.statSync(resolved).isDirectory() : fs.statSync(resolved).isFile())) throw new Error('research path is missing or not regular');
  return resolved;
}
function ensure(directory) {
  let ancestor = path.resolve(directory);
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  regular(ancestor, true); fs.mkdirSync(directory, { recursive: true }); regular(directory, true);
}
function validateObservation(value) {
  const required = ['schemaVersion','label','role','context','sourceChange','effects','observedEffect','remainingFailure','selectedBest','parentCandidateId','relatedCandidateIds','references','expected'];
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(k => !required.includes(k))
      || required.some(k => !Object.hasOwn(value,k)) || value.schemaVersion !== 1
      || !['emitted-best','pair-baseline','effect-example','counterexample','transfer-result'].includes(value.role)
      || !['label','context','sourceChange','observedEffect','remainingFailure'].every(k => text(value[k]))
      || typeof value.selectedBest !== 'boolean' || (value.selectedBest && value.role !== 'emitted-best')
      || (value.parentCandidateId !== null && !hash(value.parentCandidateId))
      || !Array.isArray(value.relatedCandidateIds) || value.relatedCandidateIds.some(x=>!hash(x))
      || new Set(value.relatedCandidateIds).size !== value.relatedCandidateIds.length
      || !Array.isArray(value.effects) || !value.effects.length || value.effects.length>16
      || value.effects.some(x=>typeof x!=='string'||! /^[a-z][a-z0-9-]{0,63}$/.test(x)) || new Set(value.effects).size!==value.effects.length
      || !Array.isArray(value.references) || !value.references.length || value.references.some(r=>!r||!canonicalPath(r.path)||!hash(r.sha256)||Object.keys(r).sort().join(',')!=='path,sha256')
      || !value.expected || Object.keys(value.expected).sort().join(',')!=='dependencies,expandedSha256,sourceSha256'
      || !hash(value.expected.sourceSha256)||!hash(value.expected.expandedSha256)||!Array.isArray(value.expected.dependencies)) throw new Error('research observation is malformed');
  const paths = new Set();
  for(const dep of value.expected.dependencies) {
    if(!dep||!canonicalPath(dep.path)||!Number.isSafeInteger(dep.bytes)||dep.bytes<0||!hash(dep.sha256)
      ||Object.keys(dep).sort().join(',')!=='bytes,path,sha256'||paths.has(dep.path.toLowerCase())) throw new Error('research dependency identity is malformed');
    paths.add(dep.path.toLowerCase());
  }
  return value;
}
function store(options, request) { return (options.storeRequest || requestStore)(request, options.storeOptions || {}); }
function authenticateReferences(observation) {
  for(const reference of observation.references) if(sha256File(regular(path.join(ROOT,reference.path)))!==reference.sha256) throw new Error('research report reference identity drift');
}
function authenticateClassification(classification, observation, expectedPreprocessor) {
  if(!['PURE_C','HYBRID_C'].includes(classification.class)) throw new Error(`research source classification is ${classification.class}`);
  policy.verifyClassificationInputs(classification);
  if(classification.sourceSha256!==observation.expected.sourceSha256 || classification.compilationInput.sha256!==observation.expected.expandedSha256
    ||!same(classification.dependencies,observation.expected.dependencies)) throw new Error('research source/expanded/dependency identity drift');
  if(expectedPreprocessor&&!same(classification.preprocessor,expectedPreprocessor))throw new Error('research preprocessor identity drift');
  authenticateReferences(observation);
}
function validateRelations(target, observation, options, candidateId) {
  for(const id of new Set([observation.parentCandidateId,...observation.relatedCandidateIds].filter(Boolean))) {
    if(id===candidateId)throw new Error('research candidate cannot reference itself as parent or related candidate');
    const candidate=store(options,{action:'query',name:'candidate',args:{candidateId:id}});
    if(!candidate||candidate.target_id!==target.targetId) throw new Error('research relation must reference an existing candidate of the same target');
  }
}
function importResearch(workbench, target, sourceFile, observation, options = {}) {
  assertScratchCapability(workbench,target);
  validateObservation(observation);
  const file=regular(sourceFile), bytes=fs.readFileSync(file), sourceText=bytes.toString('utf8');
  if(!Buffer.from(sourceText,'utf8').equals(bytes)) throw new Error('research source is not exact UTF-8');
  validateRelations(target,observation,options,candidateRecord(target,sourceText).candidateId);
  const classification=policy.classifySource(file);
  authenticateClassification(classification,observation);
  const metadata={sourcePath:relative(file),research:{schemaVersion:1,authored:observation,
    authenticated:{sourceSha256:classification.sourceSha256,expanded:classification.compilationInput,
      dependencies:classification.dependencies,sourceClass:classification.class,preprocessor:classification.preprocessor}}};
  const result=recordCandidate(workbench,target,sourceText,{...options,origin:'research-import',variant:observation.label,
    parentCandidateId:observation.parentCandidateId,metadata});
  return {candidateId:result.candidate.candidateId,observationId:result.candidate.observationId,
    sourceSha256:classification.sourceSha256,expandedSha256:classification.compilationInput.sha256,
    sourceClass:classification.class,compiled:false,acceptanceEligible:false};
}
function observations(target,effect,limit=20,options={}) {
  if(effect!==undefined&&(typeof effect!=='string'||! /^[a-z][a-z0-9-]{0,63}$/.test(effect))) throw new Error('research effect tag is malformed');
  if(!Number.isSafeInteger(limit)||limit<1||limit>200) throw new Error('research observation limit must be 1..200');
  return store(options,{action:'query',name:'research_observations',args:{targetId:target.targetId,effect,limit}});
}

function preserveResearch(workbench,candidateId,observationId,note,options={}) {
  if(!hash(candidateId)||!hash(observationId)||!text(note)) throw new Error('research preservation needs candidate, observation and note');
  const candidate=store(options,{action:'query',name:'candidate',args:{candidateId}});
  const target=[...workbench.targets,...(workbench.logicalTargets||[])].find(t=>t.targetId===candidate?.target_id);
  if(!target||candidateRecord(target,candidate.source_text).candidateId!==candidateId
    ||digest(Buffer.from(candidate.source_text,'utf8'))!==candidate.source_sha256) throw new Error('research candidate identity is stale or malformed');
  assertScratchCapability(workbench,target);
  const records=store(options,{action:'query',name:'research_observations',args:{targetId:target.targetId,observationId,limit:1}});
  const selected=records[0];
  if(!selected||selected.candidate_id!==candidateId) throw new Error('selected research observation does not belong to this candidate');
  const research=selected.metadata?.research, authored=validateObservation(research?.authored);
  validateRelations(target,authored,options,candidateId);
  if(selected.variant!==authored.label||selected.parent_candidate_id!==authored.parentCandidateId||!canonicalPath(selected.metadata.sourcePath)) throw new Error('research observation provenance mismatch');
  const sourceBytes=Buffer.from(candidate.source_text,'utf8');
  const expectedRecord=candidateRecord(target,candidate.source_text,{origin:selected.origin,variant:selected.variant,parentCandidateId:selected.parent_candidate_id,metadata:selected.metadata});
  if(expectedRecord.observationId!==observationId||candidate.source_sha256!==authored.expected.sourceSha256) throw new Error('research observation identity drift');
  // Isolated authored-only directory prevents an unrelated header beside a store
  // snapshot from taking precedence over the authenticated original include context.
  const scratch=path.join(options.matchingRoot||MATCHING_ROOT,'research-preserve',observationId);
  ensure(scratch); const snapshot=path.join(scratch,'authored.c');
  if(fs.existsSync(snapshot)) {regular(snapshot);if(!fs.readFileSync(snapshot).equals(sourceBytes))throw new Error('research snapshot drift');}
  else fs.writeFileSync(snapshot,sourceBytes,{flag:'wx'});
  const checkSnapshot=()=>{if(!same(fs.readdirSync(scratch),['authored.c']))throw new Error('research snapshot census mismatch');};
  checkSnapshot();
  const origin=regular(path.dirname(path.join(ROOT,selected.metadata.sourcePath)),true), preprocessor=policy.resolvePreprocessor();
  if(!research.authenticated?.preprocessor||!same(research.authenticated.preprocessor,policy.preprocessorIdentity(preprocessor)))throw new Error('research preprocessor identity drift');
  const classification=policy.classifySource(snapshot,{preprocessor:{...preprocessor,includeDirectories:[origin,...preprocessor.includeDirectories]}});
  authenticateClassification(classification,authored,{...research.authenticated.preprocessor,includeDirectories:[relative(origin),...research.authenticated.preprocessor.includeDirectories]}); checkSnapshot();
  if(!research.authenticated||research.authenticated.sourceSha256!==classification.sourceSha256
    ||!same(research.authenticated.expanded,classification.compilationInput)||!same(research.authenticated.dependencies,classification.dependencies)
    ||research.authenticated.sourceClass!==classification.class
    ||!same(research.authenticated.preprocessor,policy.preprocessorIdentity(preprocessor)))throw new Error('research authenticated identity mismatch');
  const date=new Date().toISOString().slice(0,10),short=candidateId.slice(0,10).toLowerCase();
  const paths={source:`docs/archive/matching-c-candidates/${date}-${target.symbol}-${short}.c`,dossier:`docs/dossiers/${target.symbol}-${short}.md`,observation:`docs/dossiers/${target.symbol}-${short}.observation.json`};
  for(const file of Object.values(paths)) {ensure(path.dirname(path.join(ROOT,file)));if(fs.existsSync(path.join(ROOT,file)))throw new Error('preserved research output already exists');}
  // Preprocess at the final path before publishing metadata: location-sensitive
  // includes/macros must reproduce the imported expanded identity too.
  fs.writeFileSync(path.join(ROOT,paths.source),sourceBytes,{flag:'wx'});
  const created=[paths.source];
  let published=false;
  try {
    const archived=policy.classifySource(path.join(ROOT,paths.source)); authenticateClassification(archived,authored,research.authenticated.preprocessor);
    const exported={schemaVersion:1,candidateId,observationId,symbol:target.symbol,authored,
      authenticated:research.authenticated,source:paths.source,
      boundary:'Curated research observations; hashes authenticate inputs, not the authored effect claims or matching acceptance.'};
    fs.writeFileSync(path.join(ROOT,paths.observation),JSON.stringify(exported,null,2)+'\n',{flag:'wx'});
    created.push(paths.observation);
    const lines=[`# ${target.symbol}: ${authored.label}`,'','Preservation does not change current source ownership or establish matching acceptance.','',
      `- Candidate: \`${candidateId}\``,`- Observation: \`${observationId}\``,`- Source: [exact C](../archive/matching-c-candidates/${path.basename(paths.source)})`,
      `- Metadata: [curated observation](${path.basename(paths.observation)})`,'',note,'','## Source context', '',authored.context,'',authored.sourceChange,'','## Recorded observation','',authored.observedEffect,'','## Remaining failure','',authored.remainingFailure,'',
      `Research role: ${authored.role}; selected emitted best: ${authored.selectedBest}.`,'',
      `Replay: \`node tools/match.js probe ${target.symbol} --source ${paths.source}\`. Check the metadata's expanded/header identities before interpreting its dumps.`,''];
    fs.writeFileSync(path.join(ROOT,paths.dossier),lines.join('\n'),{flag:'wx'});created.push(paths.dossier);published=true;
  } finally {
    if(!published)for(const file of created)if(fs.existsSync(path.join(ROOT,file)))fs.unlinkSync(regular(path.join(ROOT,file)));
  }
  return {...paths,candidateId,observationId,compiled:false,acceptanceEligible:false};
}
function authenticateEvidence(classification,authored,authenticated) {
  if(!authenticated?.preprocessor)throw new Error('research authenticated metadata is malformed');
  authenticateClassification(classification,authored,authenticated.preprocessor);
  const actual={sourceSha256:classification.sourceSha256,expanded:classification.compilationInput,
    dependencies:classification.dependencies,sourceClass:classification.class,preprocessor:classification.preprocessor};
  if(!same(authenticated,actual))throw new Error('research authenticated identity drift');
}
function captureIdentities(sourceFile,claims) {
  if(!claims||typeof claims!=='object'||Object.hasOwn(claims,'expected'))throw new Error('capture-identities requires authored claims without computed expected fields');
  if(!Array.isArray(claims.references)||claims.references.some(r=>!r||Object.keys(r).join(',')!=='path'||!canonicalPath(r.path)))throw new Error('capture-identities requires path-only references; supplied hashes cannot be replaced');
  const classification=policy.classifySource(regular(sourceFile));
  const authored={...claims,references:claims.references.map(r=>({path:r.path,sha256:sha256File(regular(path.join(ROOT,r.path)))})),
    expected:{sourceSha256:classification.sourceSha256,expandedSha256:classification.compilationInput?.sha256,dependencies:classification.dependencies}};
  validateObservation(authored);authenticateClassification(classification,authored);return authored;
}
module.exports={importResearch,observations,preserveResearch,validateObservation,authenticateEvidence,captureIdentities,regular,canonicalPath};
