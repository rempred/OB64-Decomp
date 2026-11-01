"use strict";
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),cp=require('child_process');
const ROOT=path.resolve(__dirname,'..'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const base=path.join(ROOT,'build/matching','ccd-'+crypto.randomBytes(4).toString('hex'));fs.mkdirSync(base,{recursive:true});
const source=path.join(base,'candidate.c');fs.writeFileSync(source,'int f(void){return 0;}');
let walks=0;const io={...fs,readdirSync(file,...args){if(path.resolve(file).startsWith(base))walks++;return fs.readdirSync(file,...args);}};
const processView={pid:41,ppid:42,platform:'win32',execPath:process.execPath,argv:[process.execPath,path.join(ROOT,'tools/match.js'),'watch','f','--source',source,'--scratch-root',base],env:{}};
const moduleView={exports:{}};vm.runInNewContext(fs.readFileSync(path.join(ROOT,'tools/lib/matching/private_workspace.js'),'utf8'),{module:moduleView,process:processView,require:name=>name==='fs'?io:name==='child_process'?{spawn(){throw Error('unexpected spawn');}}:require(name)});
const scope=moduleView.exports,workspace=scope.resolvePrivateWorkspace({root:ROOT,scratchRoot:base,command:'watch',diagnostic:true});
const rootKey=hash(base.toLowerCase());processView.env.OB64_PRIVATE_GUARD=rootKey;
const ticket={pid:41,supervisorPid:42,rootKey,native:false,admission:'candidate-diagnostic-v1',commandSha256:hash(JSON.stringify(processView.argv))};
const writeTicket=()=>fs.writeFileSync(path.join(base,'.private-guard.json'),JSON.stringify(ticket));writeTicket();
(async()=>{
 let checks=0,finished=0;const input={};
 await scope.withPrivateWorkspace(workspace,{native:true,inputs:input},()=>()=>finished++);assert.equal(finished,1);assert.equal(walks,0);checks++;
 const history=path.join(base,'history');fs.mkdirSync(history);for(let i=0;i<24;i++)fs.writeFileSync(path.join(history,String(i)),String(i));
 await scope.withPrivateWorkspace(workspace,{native:true,inputs:input},()=>()=>finished++);assert.equal(finished,2);assert.equal(walks,0);checks++;
 // Unrelated descendants, even hazardous ones, are outside this command's path scope.
 fs.symlinkSync(history,path.join(base,'unread-junction'),'junction');
 await scope.withPrivateWorkspace(workspace,{native:true,inputs:input},()=>()=>finished++);assert.equal(finished,3);assert.equal(walks,0);checks++;
 const db=workspace.storeOptions.database;fs.linkSync(source,db);
 try {await assert.rejects(scope.withPrivateWorkspace(workspace,{native:true,inputs:input},()=>()=>finished++),/hardlinks/);assert.equal(finished,3);}finally{fs.unlinkSync(db);}checks++;
 ticket.pid++;writeTicket();await assert.rejects(scope.withPrivateWorkspace(workspace,{native:true,inputs:input},()=>()=>finished++),/process identity/);ticket.pid--;writeTicket();checks++;
 await scope.withPrivateWorkspace(workspace,{native:true,inputs:input},()=>{assert.throws(()=>scope.requireActiveWatchWorkspace({...workspace},input,ROOT,base),/scope mismatch/);return()=>{};});checks++;
 const python=require('../tools/lib/local_tools').resolveLocalTools({readOnly:true}).splatPython;
 const script=String.raw`
import importlib.util,json,sqlite3,pathlib,sys,hashlib,os
root=pathlib.Path(sys.argv[1]);store_file=pathlib.Path(sys.argv[2]);schema=pathlib.Path(sys.argv[3])
spec=importlib.util.spec_from_file_location('candidate_store_test',store_file);store=importlib.util.module_from_spec(spec);spec.loader.exec_module(store)
root.mkdir();database=root/'workbench.sqlite';used=root/'input';used.write_text('used')
(root/'.private-guard.json').write_text(json.dumps({'admission':'candidate-diagnostic-v1','rootKey':hashlib.sha256(str(root).lower().encode()).hexdigest()}))
connection=sqlite3.connect(database);connection.row_factory=sqlite3.Row;connection.executescript(schema.read_text());connection.execute('PRAGMA foreign_keys=ON')
store.dispatch(connection,{'action':'upsert_targets','records':[{'targetId':'target','modelId':'model','symbol':'f','metadata':{},'expectedBytes':'AAAAAA==','observedAt':'now'}]})
store.dispatch(connection,{'action':'put_candidate','record':{'candidateId':'candidate','observationId':'observation','targetId':'target','sourceSha256':'A'*64,'sourceText':'int f(void){return 0;}','origin':'test','metadata':{},'createdAt':'now'}});connection.commit()
def compile(run):return {'runId':run,'candidateId':'candidate','cacheKey':run,'status':'compiled','sourceClass':'PURE_C','artifactDir':'private/'+run,'durationMs':1,'tool':{},'createdAt':'now'}
def comparison(run,id):return {'comparisonId':id,'runId':run,'primaryClass':'exact-bytes','exactBytes':True,'relocationMaskedExact':True,'score':100,'details':{},'createdAt':'now'}
store.dispatch(connection,{'action':'put_compile_result','compile':compile('existing'),'comparison':comparison('existing','old-comparison')});connection.commit()
original=store._completion_controls;checks=0
for action in ['put_compile_result','replace_comparison','complete_probe']:
 report=root/(action+'.json');request={'action':action,'completionInputs':[str(used)],'completionReports':[{'file':str(report),'value':{'status':'complete'}}]}
 if action=='put_compile_result':
  candidate={'candidateId':'rejected-candidate','observationId':'rejected-observation','targetId':'target','sourceSha256':'B'*64,'sourceText':'int f(void){return 1;}','origin':'test','metadata':{},'createdAt':'now'}
  request.update(completionCandidate=candidate,compile={**compile('rejected'),'candidateId':'rejected-candidate'},comparison=comparison('rejected','rejected-comparison'))
 elif action=='replace_comparison':request['record']=comparison('existing','rejected-replacement')
 else:request['report']={'status':'complete'}
 before=connection.execute('SELECT count(*) FROM compile_run').fetchone()[0];calls=[0]
 def closing(database):
  calls[0]+=1
  if calls[0]==2:os.link(used,pathlib.Path(str(database)+'-shm'))
  original(database)
 store._completion_controls=closing
 try:
  try:store._complete_transaction(connection,database,request);raise AssertionError('post-dispatch path failure accepted')
  except ValueError as error:assert 'hardlinked' in str(error),str(error)
  assert calls[0]==2 and not report.exists()
  assert connection.execute('SELECT count(*) FROM compile_run').fetchone()[0]==before
  assert connection.execute('SELECT comparison_id FROM comparison WHERE run_id="existing"').fetchone()[0]=='old-comparison'
  for query in ['history','best']:
   rows=store.dispatch(connection,{'action':'query','name':query,'args':{'modelId':'model','symbol':'f'}})
   assert all(row.get('run_id')!='rejected' and row.get('candidate_id')!='rejected-candidate' for row in rows)
  assert connection.execute('SELECT count(*) FROM candidate WHERE candidate_id="rejected-candidate"').fetchone()[0]==0
 finally:
  store._completion_controls=original;pathlib.Path(str(database)+'-shm').unlink(missing_ok=True)
 checks+=1
# Passed close can publish once; no pending/receipt state or caller validity bit.
report=root/'positive.json';request={'action':'put_compile_result','compile':compile('positive'),'comparison':comparison('positive','positive-comparison'),'completionInputs':[str(used)],'completionReports':[{'file':str(report),'value':{'status':'complete'}}]}
result=store._complete_transaction(connection,database,request);assert result['run']['run_id']=='positive' and report.exists();checks+=1
connection.close();print(json.dumps({'status':'pass','transactionChecks':checks}))
`;
 const result=cp.spawnSync(python,['-I','-S','-c',script,path.join(base,'store-rollback'),path.join(ROOT,'tools/matching_workbench/store.py'),path.join(ROOT,'tools/matching_workbench/schema.sql')],{encoding:'utf8',windowsHide:true});
 assert.equal(result.status,0,result.stdout+result.stderr);console.log(JSON.stringify({status:'pass',scopeChecks:checks,historyWalks:walks,store:JSON.parse(result.stdout),root:base}));
})().catch(error=>{console.error(error);process.exitCode=1;});
