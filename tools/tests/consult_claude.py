import copy,inspect,json,os,subprocess,sys,tempfile,time,unittest,uuid
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import consult_claude as c

ROOT=Path(tempfile.mkdtemp(prefix='consultation-offline-',dir=os.environ.get('OB64_CONSULT_TEST_ROOT',str(Path(__file__).resolve().parents[2]))))
class Fake:
    def __init__(self):self.calls=[];self.auth='claude.ai';self.effort='xhigh';self.fail=False;self.version='2.1.292'
    def __call__(self,argv,wire,env,cwd,root,job,timeout):
        self.calls.append((argv,wire,env))
        if '--version' in argv:
            c.atomic(root/'stdout.json',(self.version+' (Claude Code)\n').encode());return {'status':'eof','code':0,'tree_gone':True,'actual_eof':True}
        if 'auth' in argv:
            c.atomic(root/'stdout.json',c.encoded({'loggedIn':True,'authMethod':self.auth,'apiProvider':'firstParty','subscriptionType':'max'}));return {'status':'eof','code':0,'tree_gone':True,'actual_eof':True}
        sid=argv[-1];file=c.CONFIG/'projects/mock'/ (sid+'.jsonl');file.parent.mkdir(parents=True,exist_ok=True)
        old=file.read_bytes() if file.exists() else b'';previous=c.parse_history(old)[-1]['uuid'] if old else None
        user={'type':'user','version':self.version,'sessionId':sid,'uuid':str(uuid.uuid4()),'parentUuid':previous,'message':{'content':wire.decode()}}
        assistant={'type':'assistant','sessionId':sid,'uuid':str(uuid.uuid4()),'parentUuid':user['uuid'],'effort':self.effort,'perTurnEffort':self.effort,'version':self.version,'message':{'model':c.MODEL,'stop_reason':'end_turn','content':[{'type':'text','text':'tiny answer'}]}}
        result={'type':'result','subtype':'success','is_error':False,'session_id':sid,'result':'tiny answer','modelUsage':{c.MODEL:{'costBasis':'unproven'}}}
        file.write_bytes(old+b'\n'.join(json.dumps(r).encode() for r in (user,assistant))+b'\n');c.atomic(root/'stdout.json',c.encoded(result))
        return {'status':'eof','code':1 if self.fail else 0,'tree_gone':True,'actual_eof':True}

class NativeFake(Fake):
    """Fabricated complete native creation/resume format; contains no real history text."""
    def __call__(self,argv,wire,env,cwd,root,job,timeout):
        if 'auth' in argv or '--version' in argv:return super().__call__(argv,wire,env,cwd,root,job,timeout)
        self.calls.append((argv,wire,env));sid=argv[-1];file=c.CONFIG/'projects/mock'/(sid+'.jsonl');file.parent.mkdir(parents=True,exist_ok=True)
        old=file.read_bytes() if file.exists() else b'';oldrows=c.parse_history(old);previous=next((r['uuid'] for r in reversed(oldrows) if r.get('type')=='assistant'),None)
        rows=[]
        def meta(kind,**values):rows.append({'type':kind,'sessionId':sid,**values})
        if not old:
            meta('custom-title',customTitle='fabricated');meta('agent-name',agentName='fabricated')
        meta('queue-operation',operation='enqueue',timestamp='fabricated',content=wire.decode());meta('queue-operation',operation='dequeue',timestamp='fabricated')
        user={'type':'user','version':self.version,'sessionId':sid,'uuid':str(uuid.uuid4()),'parentUuid':previous,'message':{'role':'user','content':wire.decode()}}
        rows.append(user);parent=user['uuid']
        def attachment(kind,extra=()):
            nonlocal parent
            r={k:'fabricated' for k in c.NATIVE_COMMON};r.update(type='attachment',uuid=str(uuid.uuid4()),parentUuid=parent,sessionId=sid,version=self.version,isSidechain=False,attachment={'type':kind,**{k:'fabricated' for k in c.ATTACH_FIELDS[kind]|set(extra)}})
            if kind not in ('prompt_snapshot','credential_org'):r.update(rendered='fabricated',renderedRole='user')
            rows.append(r);parent=r['uuid']
        for kind in ('environment','model','total_tokens_reminder') if not old else ('environment','total_tokens_reminder'):attachment(kind)
        if not old:meta('atis-latch',atis='fabricated')
        attachment('session_context',('changed','reason') if old else ())
        if not old:attachment('date')
        attachment('credential_org');attachment('prompt_snapshot',('echoWireToolInputs','reminderFold'))
        mid='fabricated-message-'+str(uuid.uuid4());request='fabricated-request-'+str(uuid.uuid4())
        for index,content in enumerate(([{'type':'thinking','thinking':'fabricated reasoning'}],[{'type':'text','text':'tiny answer'}])):
            r={'type':'assistant','sessionId':sid,'uuid':str(uuid.uuid4()),'parentUuid':parent,'version':self.version,'effort':self.effort,'perTurnEffort':self.effort,'requestId':request,'apiBlockIndex':index,'isSidechain':False,'message':{'id':mid,'role':'assistant','model':c.MODEL,'stop_reason':'end_turn','content':content}}
            rows.append(r);parent=r['uuid']
        leaf=parent;attachment('prompt_snapshot',c.ATTACH_OPTIONAL['prompt_snapshot'])
        meta('last-prompt',lastPrompt='fabricated',leafUuid=leaf);meta('custom-title',customTitle='fabricated');meta('agent-name',agentName='fabricated')
        if old:meta('mode',mode='fabricated')
        meta('atis-latch',atis='fabricated');meta('cost-state',**{k:'fabricated' for k in c.META_FIELDS['cost-state']})
        file.write_bytes(old+b'\n'.join(json.dumps(x).encode() for x in rows)+b'\n')
        c.atomic(root/'stdout.json',c.encoded({'type':'result','subtype':'success','is_error':False,'session_id':sid,'result':'tiny answer'}))
        return {'status':'eof','code':0,'tree_gone':True,'actual_eof':True}

class ToolNative296(NativeFake):
    def __init__(self):super().__init__();self.version='2.1.296'
    def __call__(self,argv,wire,env,cwd,root,job,timeout):
        if '-p' not in argv:return super().__call__(argv,wire,env,cwd,root,job,timeout)
        file=c.CONFIG/'projects/mock'/(argv[-1]+'.jsonl');old=file.read_bytes() if file.exists() else b''
        outcome=super().__call__(argv,wire,env,cwd,root,job,timeout);rows=c.parse_history(file.read_bytes()[len(old):]);user=next(r for r in rows if r['type']=='user');reminder=next(r for r in rows if r.get('attachment',{}).get('type')=='total_tokens_reminder');a=[r for r in rows if r['type']=='assistant'];meta=[r for r in rows if r['type'] in ('last-prompt','custom-title','agent-name','mode','atis-latch','cost-state')]
        fresh=[r for r in rows if r['type']=='queue-operation']+[user,reminder];reminder['parentUuid']=user['uuid']
        first=copy.deepcopy(a[0]);first['parentUuid']=reminder['uuid'];first['message']['stop_reason']='tool_use'
        tid='fabricated-tool-'+str(uuid.uuid4())
        tool=copy.deepcopy(a[1]);tool['parentUuid']=first['uuid'];tool['message'].update(stop_reason='tool_use',content=[{'type':'tool_use','id':tid,'name':'Read','input':{'file_path':'fabricated'}}]);fresh.extend([first,tool])
        answer={'type':'user','version':self.version,'sessionId':argv[-1],'uuid':str(uuid.uuid4()),'parentUuid':tool['uuid'],'message':{'role':'user','content':[{'type':'tool_result','tool_use_id':tid,'content':'fabricated'}]}}
        secondreminder=copy.deepcopy(reminder);secondreminder.update(uuid=str(uuid.uuid4()),parentUuid=answer['uuid']);fresh.extend([answer,secondreminder])
        # Mid-tool display group mirrors the exact observed types, without any dialogue text.
        group=[{'type':'last-prompt','sessionId':argv[-1],'lastPrompt':'fabricated','leafUuid':secondreminder['uuid']},{'type':'custom-title','sessionId':argv[-1],'customTitle':'fabricated'},{'type':'agent-name','sessionId':argv[-1],'agentName':'fabricated'},{'type':'mode','sessionId':argv[-1],'mode':'fabricated'},{'type':'atis-latch','sessionId':argv[-1],'atis':'fabricated'}];fresh.extend(group)
        mid='fabricated-final-'+str(uuid.uuid4());request='fabricated-request-'+str(uuid.uuid4());parent=secondreminder['uuid']
        for original in a:
            final=copy.deepcopy(original);final.update(uuid=str(uuid.uuid4()),parentUuid=parent,requestId=request);final['message']['id']=mid;fresh.append(final);parent=final['uuid']
        ending=copy.deepcopy(group);ending[0]['leafUuid']=parent;fresh.extend(ending);fresh.append(next(r for r in reversed(meta) if r['type']=='cost-state'))
        file.write_bytes(old+b'\n'.join(json.dumps(x).encode() for x in fresh)+b'\n');return outcome

class LongNative296(NativeFake):
    """Fabricated 115-record layout; mirrors native shapes, never native dialogue."""
    def __init__(self):super().__init__();self.version='2.1.296'
    def __call__(self,argv,wire,env,cwd,root,job,timeout):
        if '-p' not in argv:return super().__call__(argv,wire,env,cwd,root,job,timeout)
        self.calls.append((argv,wire,env));sid=argv[-1];file=c.CONFIG/'projects/mock'/(sid+'.jsonl');file.parent.mkdir(parents=True,exist_ok=True);old=file.read_bytes() if file.exists() else b''
        parent=next((r['uuid'] for r in reversed(c.parse_history(old)) if r.get('type')=='assistant'),None);rows=[]
        def meta(kind,**values):rows.append({'type':kind,'sessionId':sid,**values})
        def event(kind,**values):
            nonlocal parent
            row={k:'fabricated' for k in c.NATIVE_COMMON};row.update(type=kind,uuid=str(uuid.uuid4()),parentUuid=parent,sessionId=sid,version=self.version,isSidechain=False,**values);rows.append(row);parent=row['uuid'];return row
        def reminder(kind):event('attachment',attachment={'type':kind,'text':'fabricated reminder'},rendered='fabricated',renderedRole='user')
        def display():
            meta('last-prompt',lastPrompt='fabricated',leafUuid=parent);meta('custom-title',customTitle='fabricated');meta('agent-name',agentName='fabricated');meta('mode',mode='fabricated');meta('atis-latch',atis='fabricated')
        meta('queue-operation',operation='enqueue',timestamp='fabricated',content=wire.decode());meta('queue-operation',operation='dequeue',timestamp='fabricated');event('user',message={'role':'user','content':wire.decode()});reminder('total_tokens_reminder')
        for group,count in enumerate((4,3,2,2,1,2,2,2,1,1,2,0)):
            mid='fabricated-message-'+str(uuid.uuid4());request='fabricated-request-'+str(uuid.uuid4());index=0;stop='tool_use' if count else 'end_turn'
            def block(content):
                nonlocal index
                row=event('assistant',effort=self.effort,perTurnEffort=self.effort,requestId=request,apiBlockIndex=index,message={'id':mid,'role':'assistant','model':c.MODEL,'stop_reason':stop,'content':[content]});index+=1;return row
            if group!=9:block({'type':'thinking','thinking':'fabricated thinking'})
            if group==5:block({'type':'text','text':'fabricated intermediate text'})
            for number in range(count):
                tid='fabricated-tool-'+str(uuid.uuid4());source=block({'type':'tool_use','id':tid,'name':'Read','input':{'file_path':'fabricated'}})
                event('user',sourceToolAssistantUUID=source['uuid'],message={'role':'user','content':[{'type':'tool_result','tool_use_id':tid,'content':'fabricated result'}]})
            if count:
                if group in (4,10):reminder('silent_turn_reminder')
                reminder('total_tokens_reminder')
                if group not in (3,6,8,10):display()
            else:block({'type':'text','text':'tiny answer'});display()
        meta('cost-state',**{k:'fabricated' for k in c.META_FIELDS['cost-state']})
        assert len(rows)==115
        file.write_bytes(old+b'\n'.join(json.dumps(x).encode() for x in rows)+b'\n');c.atomic(root/'stdout.json',c.encoded({'type':'result','subtype':'success','is_error':False,'session_id':sid,'result':'tiny answer','num_turns':23}))
        return {'status':'eof','code':0,'tree_gone':True,'actual_eof':True}

class TwoToolNative296(NativeFake):
    """Fabricated 112-record layout; mirrors native shapes, never native dialogue."""
    def __init__(self):super().__init__();self.version='2.1.296'
    def __call__(self,argv,wire,env,cwd,root,job,timeout):
        if '-p' not in argv:return super().__call__(argv,wire,env,cwd,root,job,timeout)
        self.calls.append((argv,wire,env));sid=argv[-1];file=c.CONFIG/'projects/mock'/(sid+'.jsonl');file.parent.mkdir(parents=True,exist_ok=True);old=file.read_bytes() if file.exists() else b''
        parent=next((r['uuid'] for r in reversed(c.parse_history(old)) if r.get('type')=='assistant'),None);rows=[]
        def meta(kind,**values):rows.append({'type':kind,'sessionId':sid,**values})
        def event(kind,**values):
            nonlocal parent
            row={k:'fabricated' for k in c.NATIVE_COMMON};row.update(type=kind,uuid=str(uuid.uuid4()),parentUuid=parent,sessionId=sid,version=self.version,isSidechain=False,**values);row['cwd']=str(c.CWD);rows.append(row);parent=row['uuid'];return row
        def reminder(kind):event('attachment',attachment={'type':kind,'text':'fabricated reminder'},rendered='fabricated',renderedRole='user')
        def display():
            meta('last-prompt',lastPrompt='fabricated',leafUuid=parent);meta('custom-title',customTitle='fabricated');meta('agent-name',agentName='fabricated');meta('mode',mode='fabricated');meta('atis-latch',atis='fabricated')
        meta('queue-operation',operation='enqueue',timestamp='fabricated',content=wire.decode());meta('queue-operation',operation='dequeue',timestamp='fabricated');event('user',message={'role':'user','content':wire.decode()});reminder('total_tokens_reminder')
        for group,count in enumerate((4,2,3,2,2,2,3,2,2,2,2,0)):
            mid='fabricated-message-'+str(uuid.uuid4());request='fabricated-request-'+str(uuid.uuid4());index=0;stop='tool_use' if count else 'end_turn'
            def block(content):
                nonlocal index
                row=event('assistant',effort=self.effort,perTurnEffort=self.effort,requestId=request,apiBlockIndex=index,message={'id':mid,'role':'assistant','model':c.MODEL,'stop_reason':stop,'content':[content]});index+=1;return row
            if group!=10:block({'type':'thinking','thinking':'fabricated thinking'})
            held=None
            for number in range(count):
                tid='fabricated-tool-'+str(uuid.uuid4());source=block({'type':'tool_use','id':tid,'name':'Read','input':{'file_path':'fabricated'}})
                if group==2 and number==1:held=(source,tid);continue
                if held:
                    previous=parent;prior,prior_tid=held
                    result=event('user',sourceToolAssistantUUID=prior['uuid'],message={'role':'user','content':[{'type':'tool_result','tool_use_id':prior_tid,'content':'fabricated result'}]})
                    result['parentUuid']=prior['uuid'];parent=previous;held=None
                event('user',sourceToolAssistantUUID=source['uuid'],message={'role':'user','content':[{'type':'tool_result','tool_use_id':tid,'content':'fabricated result'}]})
            if count:
                if group in (4,9):reminder('silent_turn_reminder')
                reminder('total_tokens_reminder')
                if group in (0,2,4,6,8):display()
            else:block({'type':'text','text':'tiny answer'});display()
        meta('cost-state',**{k:'fabricated' for k in c.META_FIELDS['cost-state']})
        assert len(rows)==112
        file.write_bytes(old+b'\n'.join(json.dumps(x).encode() for x in rows)+b'\n');c.atomic(root/'stdout.json',c.encoded({'type':'result','subtype':'success','is_error':False,'session_id':sid,'result':'tiny answer','num_turns':23}))
        return {'status':'eof','code':0,'tree_gone':True,'actual_eof':True}

class TerminalNative296(NativeFake):
    """Sanitized full A13 layout; all dialogue and identifiers are fabricated."""
    def __init__(self):super().__init__();self.version='2.1.296'
    def __call__(self,argv,wire,env,cwd,root,job,timeout):
        if '-p' not in argv:return super().__call__(argv,wire,env,cwd,root,job,timeout)
        file=c.CONFIG/'projects/mock'/(argv[-1]+'.jsonl');old=file.read_bytes() if file.exists() else b''
        outcome=super().__call__(argv,wire,env,cwd,root,job,timeout);records=c.parse_history(file.read_bytes()[len(old):]);sid=argv[-1]
        user=next(r for r in records if r['type']=='user');reminder=next(r for r in records if r.get('attachment',{}).get('type')=='total_tokens_reminder');a=[r for r in records if r['type']=='assistant']
        reminder['parentUuid']=user['uuid'];a[0]['parentUuid']=reminder['uuid']
        rows=[r for r in records if r['type']=='queue-operation']+[user,reminder]+a
        rows += [{'type':'last-prompt','sessionId':sid,'lastPrompt':'fabricated','leafUuid':a[-1]['uuid']},
          {'type':'custom-title','sessionId':sid,'customTitle':'fabricated'}, {'type':'agent-name','sessionId':sid,'agentName':'fabricated'},
          {'type':'mode','sessionId':sid,'mode':'fabricated'}, {'type':'permission-mode','sessionId':sid,'permissionMode':'dontAsk'},
          {'type':'atis-latch','sessionId':sid,'atis':'fabricated'}, next(r for r in records if r['type']=='cost-state')]
        assert len(rows)==13
        file.write_bytes(old+b'\n'.join(json.dumps(r).encode() for r in rows)+b'\n');return outcome

class Tests(unittest.TestCase):
    def setUp(self):
        self.root=Path(tempfile.mkdtemp(dir=ROOT));self.worker=str(uuid.uuid4());self.fake=Fake()
        self.exe=self.root/'fabricated-native.exe';self.exe.write_bytes(b'tiny executable identity fixture')
        self.guard=c.managed_policy_guard
        self.patches=[patch.object(c,'LIVE_ENABLED',False),patch.object(c,'EXE',str(self.exe)),patch.object(c,'managed_policy_guard',return_value=None),patch.object(c,'STORE',self.root/'store'),patch.object(c,'CWD',self.root),patch.object(c,'CONFIG',self.root/'config'),patch.object(c,'MEMORY',self.root/'memory'),patch.dict(os.environ,{'CODEX_THREAD_ID':self.worker})]
        for p in self.patches:p.start()
    def tearDown(self):
        for p in reversed(self.patches):p.stop()
    def state(self):return json.loads((c.STORE/self.worker/'session.json').read_text())
    def test_rejected_probe_explicit_disposition_same_uuid_xhigh(self):
        c._consult(self.worker,'accepted baseline',self.fake);old=self.state();backup=c.STORE/self.worker/'transcript.backup.jsonl';saved=backup.read_bytes()
        self.fake.effort='high'
        with self.assertRaises(c.Stop):c._consult(self.worker,'known clamp probe',self.fake)
        state=self.state();attempt=state['pending']['attempt_id'];history=c.digest(c.read(c.locate(state['session_uuid'])))
        with self.assertRaises(c.Stop):c._recover(self.worker,'dispose-completed-high-probe','wrong',history)
        with self.assertRaises(c.Stop):c._recover(self.worker,'dispose-completed-high-probe',attempt,'wrong')
        with patch.object(c,'tree_gone',return_value=False):
            with self.assertRaises(c.Stop):c._recover(self.worker,'dispose-completed-high-probe',attempt,history)
        processfile=c.STORE/self.worker/'last-process.json';process=processfile.read_bytes();bad=json.loads(process);bad['attempt_id']='old';processfile.write_bytes(c.encoded(bad))
        with self.assertRaises(c.Stop):c._recover(self.worker,'dispose-completed-high-probe',attempt,history)
        processfile.write_bytes(process)
        transcript=c.locate(state['session_uuid']);original=transcript.read_bytes()
        for defect in ('model','terminal','missing','low'):
            rows=c.parse_history(original)
            if defect=='model':rows[-1]['message']['model']='other'
            if defect=='terminal':rows[-1]['message']['stop_reason']='tool_use'
            if defect=='missing':rows.pop()
            if defect=='low':rows[-1]['effort']=rows[-1]['perTurnEffort']='low'
            changed=b'\n'.join(json.dumps(r).encode() for r in rows)+b'\n';transcript.write_bytes(changed)
            with self.assertRaises(c.Stop,msg=defect):c._recover(self.worker,'dispose-completed-high-probe',attempt,c.digest(changed))
        transcript.write_bytes(original)
        reply=c._recover(self.worker,'dispose-completed-high-probe',attempt,history)
        self.assertIn('no answer accepted',reply);self.assertEqual(backup.read_bytes(),saved)
        self.assertEqual(self.state()['last_ok_result'],old['last_ok_result']);self.assertFalse(self.state()['disposed_probe']['accepted_as_xhigh'])
        evidence=(c.STORE/self.worker/'rejected-probe.json').read_bytes()
        with self.assertRaises(c.Stop):c._consult(self.worker,'known clamp probe',self.fake)
        self.fake.effort='xhigh';c._consult(self.worker,'genuine xhigh new prompt',self.fake)
        self.assertEqual(self.state()['session_uuid'],old['session_uuid']);self.assertIn('--resume',self.fake.calls[-1][0]);self.assertEqual((c.STORE/self.worker/'rejected-probe.json').read_bytes(),evidence)

    def test_first_probe_and_uncertain_probe_disposition(self):
        self.fake.effort='high';self.fake.fail=True
        with self.assertRaises(c.Stop):c._consult(self.worker,'first high',self.fake)
        state=self.state();sid=state['session_uuid'];attempt=state['pending']['attempt_id'];history=c.digest(c.read(c.locate(sid)))
        with self.assertRaises(c.Stop):c._recover(self.worker,'dispose-completed-high-probe',attempt,history)
        self.assertIsNotNone(self.state()['pending']);self.assertFalse((c.STORE/self.worker/'rejected-probe.json').exists())
        # A separately simulated completed first probe, using another mock worker only.
        other=str(uuid.uuid4());fake=Fake();fake.effort='high'
        with self.assertRaises(c.Stop):c._consult(other,'completed first high',fake)
        with patch.dict(os.environ,{'CODEX_THREAD_ID':other}):
            state=json.loads((c.STORE/other/'session.json').read_text());attempt=state['pending']['attempt_id'];history=c.digest(c.read(c.locate(state['session_uuid'])))
            c._recover(other,'dispose-completed-high-probe',attempt,history)
            self.assertFalse((c.STORE/other/'transcript.backup.jsonl').exists())
            fake.effort='xhigh';c._consult(other,'first accepted turn',fake);self.assertIn('--resume',fake.calls[-1][0]);self.assertEqual(fake.calls[-1][0][-1],state['session_uuid'])

    def oauth_fixture(self):
        self.fake.fail=True
        with self.assertRaises(c.Stop):c._consult(self.worker,'fabricated OAuth prompt',self.fake)
        state=self.state();file=c.locate(state['session_uuid']);rows=c.parse_history(c.read(file));user=rows[-2];assistant=rows[-1];sid=state['session_uuid']
        prefix=[{'type':'custom-title','sessionId':sid,'customTitle':'fabricated'}, {'type':'agent-name','sessionId':sid,'agentName':'fabricated'}, {'type':'queue-operation','sessionId':sid,'operation':'enqueue','timestamp':'tiny','content':user['message']['content']},{'type':'queue-operation','sessionId':sid,'operation':'dequeue','timestamp':'tiny'}]
        events=[user]
        for kind,fields in c.ATTACH_FIELDS.items():
            if kind=='silent_turn_reminder':continue # This new type is post-tool only.
            r={k:'tiny' for k in c.NATIVE_COMMON};r.update(type='attachment',uuid=str(uuid.uuid4()),parentUuid=events[-1]['uuid'],sessionId=sid,version=c.VERSION,isSidechain=False,attachment={'type':kind,**{k:'fabricated' for k in fields}})
            if kind not in ('prompt_snapshot','credential_org'):r.update(rendered='fabricated',renderedRole='user')
            events.append(r)
        r={k:'tiny' for k in c.NATIVE_COMMON};r.update(type='system',uuid=str(uuid.uuid4()),parentUuid=events[-1]['uuid'],sessionId=sid,version=c.VERSION,isSidechain=False,subtype='api_error',error={'status':401,'formatted':'401 OAuth access token has expired. Re-authenticate to continue.'},level='error',maxRetries=1,retryAttempt=1,retryInMs=0,source='api');events.append(r)
        assistant.update(parentUuid=r['uuid'],isApiErrorMessage=True,error='authentication_failed',apiErrorStatus=401);assistant.pop('effort');assistant['message'].update(model='<synthetic>',stop_reason='stop_sequence',content=[{'type':'text','text':c.OAUTH_ERROR}]);events.append(assistant)
        rows=prefix+events+[{'type':'last-prompt','sessionId':sid,'lastPrompt':'fabricated','leafUuid':assistant['uuid']}]
        raw=b'\n'.join(json.dumps(x).encode() for x in rows)+b'\n';file.write_bytes(raw)
        out={'type':'result','subtype':'success','is_error':True,'session_id':sid,'result':c.OAUTH_ERROR,'num_turns':1};c.atomic(c.STORE/self.worker/'stdout.json',c.encoded(out))
        return state,file,rows,out

    def test_oauth_disposition_atomic_failure_and_same_uuid(self):
        state,file,rows,out=self.oauth_fixture();sid=state['session_uuid'];attempt=state['pending']['attempt_id'];history=c.digest(c.read(file));root=c.STORE/self.worker
        with self.assertRaises(c.Stop):c.validate(state,c.read(file),out)
        original=c.atomic
        def fail(path,data):
            if path.name=='session.json':raise OSError('atomic replace failure')
            return original(path,data)
        with patch.object(c,'atomic',side_effect=fail):
            with self.assertRaises(OSError):c._recover(self.worker,'dispose-terminal-oauth-failure',attempt,history)
        self.assertIsNotNone(self.state()['pending']);receipt=root/('oauth-failure-'+attempt+'.json');saved=receipt.read_bytes();self.assertNotIn(b'fabricated OAuth prompt',saved)
        c._recover(self.worker,'dispose-terminal-oauth-failure',attempt,history)
        self.assertEqual(receipt.read_bytes(),saved);self.assertFalse((root/'transcript.backup.jsonl').exists())
        with self.assertRaises(c.Stop):c._consult(self.worker,'fabricated OAuth prompt',self.fake)
        # Fake normally expects the last UUID: retain native history and emit a fresh exact resume.
        class Resume(Fake):
            def __call__(this,argv,wire,env,cwd,root,job,timeout):
                if 'auth' in argv or '--version' in argv:return super().__call__(argv,wire,env,cwd,root,job,timeout)
                this.calls.append((argv,wire,env));old=file.read_bytes();u={'type':'user','version':c.VERSION,'sessionId':sid,'uuid':str(uuid.uuid4()),'parentUuid':rows[-2]['uuid'],'message':{'content':wire.decode()}}
                a={'type':'assistant','sessionId':sid,'uuid':str(uuid.uuid4()),'parentUuid':u['uuid'],'effort':'xhigh','perTurnEffort':'xhigh','version':c.VERSION,'message':{'model':c.MODEL,'stop_reason':'end_turn','content':[{'type':'text','text':'tiny answer'}]}}
                file.write_bytes(old+b'\n'.join(json.dumps(x).encode() for x in [u,a])+b'\n');c.atomic(root/'stdout.json',c.encoded({'type':'result','subtype':'success','is_error':False,'session_id':sid,'result':'tiny answer'}));return {'status':'eof','code':0,'actual_eof':True,'tree_gone':True}
        fake=Resume();c._consult(self.worker,'new distinct prompt',fake);self.assertIn('--resume',fake.calls[-1][0]);self.assertEqual(self.state()['session_uuid'],sid)

    def test_native_success_still_exact_and_stale_history_rejected(self):
        state,file,rows,out=self.oauth_fixture();a=rows[-2];a['message'].update(model=c.MODEL,stop_reason='end_turn',content=[{'type':'text','text':'real fabricated answer'}]);a['effort']='xhigh';a.pop('isApiErrorMessage');a.pop('error');a.pop('apiErrorStatus')
        out.update(is_error=False,result='real fabricated answer')
        raw=b'\n'.join(json.dumps(x).encode() for x in rows)+b'\n';self.assertEqual(c.validate(state,raw,out),'real fabricated answer')
        for key in ('effort','perTurnEffort','version'):
            bad=copy.deepcopy(rows);bad[-2].pop(key)
            with self.assertRaises(c.Stop):c.validate(state,b'\n'.join(json.dumps(x).encode() for x in bad)+b'\n',out)
        file.write_bytes(raw);c.finish(c.STORE/self.worker,state,file,raw,out)
        file.write_bytes(raw+b'\n');calls=len(self.fake.calls)
        with self.assertRaises(c.Stop):c._consult(self.worker,'must not dispatch',self.fake)
        self.assertEqual(len(self.fake.calls),calls)

    def test_oauth_adverse_records_and_receipts(self):
        state,file,rows,out=self.oauth_fixture();root=c.STORE/self.worker;attempt=state['pending']['attempt_id'];original=file.read_bytes()
        for defect in ('unknown','interleaved','prior-assistant','parent','original','non-oauth','model-answer','missing','foreign-metadata'):
            changed=copy.deepcopy(rows)
            if defect=='unknown':changed.insert(0,{'type':'unknown','sessionId':state['session_uuid']})
            if defect=='interleaved':changed.insert(-2,copy.deepcopy(changed[4]))
            if defect=='prior-assistant':changed.insert(0,copy.deepcopy(changed[-2]))
            if defect=='parent':changed[-2]['parentUuid']='foreign'
            if defect=='original':changed[4]['message']['content']='wrong original'
            if defect=='non-oauth':changed[-3]['error']['status']=403
            if defect=='model-answer':changed[-2]['message']['model']=c.MODEL
            if defect=='missing':changed.pop(-2)
            if defect=='foreign-metadata':changed[0]['sessionId']='foreign'
            raw=b'\n'.join(json.dumps(x).encode() for x in changed)+b'\n';file.write_bytes(raw)
            with self.assertRaises(c.Stop,msg=defect):c._recover(self.worker,'dispose-terminal-oauth-failure',attempt,c.digest(raw))
        file.write_bytes(original)
        for key,value in [('code',0),('status','failed'),('actual_eof',False),('tree_gone',False),('attempt_id','wrong')]:
            p=root/'last-process.json';saved=p.read_bytes();d=json.loads(saved);d[key]=value;p.write_bytes(c.encoded(d))
            with self.assertRaises(c.Stop):c._recover(self.worker,'dispose-terminal-oauth-failure',attempt,c.digest(original))
            p.write_bytes(saved)
        with patch.object(c,'tree_gone',return_value=False):
            with self.assertRaises(c.Stop):c._recover(self.worker,'dispose-terminal-oauth-failure',attempt,c.digest(original))
        with patch.object(c.os,'fsync',side_effect=OSError('receipt fsync failure')):
            with self.assertRaises(OSError):c._recover(self.worker,'dispose-terminal-oauth-failure',attempt,c.digest(original))
        self.assertIsNotNone(self.state()['pending']);receipt=root/('oauth-failure-'+attempt+'.json');receipt.write_bytes(b'conflict')
        with self.assertRaises(c.Stop):c._recover(self.worker,'dispose-terminal-oauth-failure',attempt,c.digest(original))
        self.assertEqual(receipt.read_bytes(),b'conflict')

    def native_pending(self,resume=False):
        fake=NativeFake()
        if resume:c._consult(self.worker,'fabricated original',fake)
        with patch.object(c,'finish',side_effect=c.Stop('fabricated parser refusal after real-shaped success')):
            with self.assertRaises(c.Stop):c._consult(self.worker,'fabricated pending',fake)
        state=self.state();file=c.locate(state['session_uuid']);raw=file.read_bytes();result=json.loads((c.STORE/self.worker/'stdout.json').read_bytes())
        return state,file,raw,result,fake

    def test_complete_native_creation_resume_and_completed_recovery(self):
        state,file,raw,result,fake=self.native_pending()
        self.assertEqual(c.validate(state,raw,result),'tiny answer');sid=state['session_uuid'];calls=len(fake.calls)
        self.assertEqual(c._recover(self.worker,'recover-completed'),'tiny answer');self.assertEqual(len(fake.calls),calls)
        self.assertEqual(c._consult(self.worker,'fabricated resume',fake),'tiny answer');self.assertIn('--resume',fake.calls[-1][0]);self.assertEqual(self.state()['session_uuid'],sid)
        self.assertEqual(file.read_bytes()[:len(raw)],raw)

    def test_native_complete_resume_negatives(self):
        state,file,raw,result,fake=self.native_pending(resume=True);offset=state['pending']['offset'];rows=c.parse_history(raw[offset:]);a=[i for i,r in enumerate(rows) if r['type']=='assistant'];snapshot=a[-1]+1
        defects=('request','message','index','missing-index','first-block','role','stop','model','effort','per-turn','version','synthetic','foreign','parent','unknown','interleaved','prior-assistant','late-assistant','late-attachment','attachment-field','snapshot-field','metadata-field','wire','result')
        for defect in defects:
            changed=copy.deepcopy(rows);out=copy.deepcopy(result);last=changed[a[-1]]
            if defect=='request':last['requestId']='other'
            if defect=='message':last['message']['id']='other'
            if defect=='index':last['apiBlockIndex']=0
            if defect=='missing-index':last.pop('apiBlockIndex')
            if defect=='first-block':changed.pop(a[0])
            if defect=='role':last['message']['role']='user'
            if defect=='stop':last['message']['stop_reason']='tool_use'
            if defect=='model':last['message']['model']='other'
            if defect=='effort':changed[a[0]]['effort']='high'
            if defect=='per-turn':last.pop('perTurnEffort')
            if defect=='version':last['version']='other'
            if defect=='synthetic':last['isApiErrorMessage']=True
            if defect=='foreign':changed[snapshot]['sessionId']='foreign'
            if defect=='parent':last['parentUuid']='foreign'
            if defect=='unknown':changed.append({'type':'unknown','sessionId':state['session_uuid']})
            if defect=='interleaved':changed.insert(a[-1],copy.deepcopy(changed[2]))
            if defect=='prior-assistant':changed.insert(0,copy.deepcopy(last))
            if defect=='late-assistant':changed.append(copy.deepcopy(last))
            if defect=='late-attachment':changed[snapshot]['attachment']={'type':'credential_org','organizationUuid':'fabricated'}
            if defect=='attachment-field':changed[3]['attachment']['unexpected']='fabricated'
            if defect=='snapshot-field':changed[snapshot]['attachment']['unexpected']='fabricated'
            if defect=='metadata-field':changed[-1]['uuid']='not-metadata'
            if defect=='wire':changed[2]['message']['content']='changed fabricated prompt'
            if defect=='result':out['result']='unassociated'
            data=raw[:offset]+b'\n'.join(json.dumps(x).encode() for x in changed)+b'\n'
            with self.assertRaises(c.Stop,msg=defect):c.validate(state,data,out)
        with self.assertRaises(c.Stop):c.validate(state,b' '+raw,result)
        changed=copy.deepcopy(state);changed['original_wire_sha']='wrong'
        with self.assertRaises(c.Stop):c.validate(changed,raw,result)

    def test_nonterminal_native_association_reviewer_falsifiers_and_tool_turn(self):
        state,file,raw,result,fake=self.native_pending(resume=True);offset=state['pending']['offset'];rows=c.parse_history(raw[offset:]);indices=[i for i,r in enumerate(rows) if r['type']=='assistant']
        rows[indices[0]]['message']['stop_reason']=None
        def data(records):return raw[:offset]+b'\n'.join(json.dumps(x).encode() for x in records)+b'\n'
        self.assertEqual(c.validate(state,data(rows),result),'tiny answer')
        for defect in ('nonterminal_first_foreign_request','nonterminal_first_gap','nonterminal_first_duplicate_index'):
            changed=copy.deepcopy(rows)
            if defect.endswith('request'):changed[indices[1]]['requestId']='different-request'
            elif defect.endswith('gap'):changed[indices[1]]['apiBlockIndex']=50
            else:changed[indices[1]]['apiBlockIndex']=0
            with self.assertRaises(c.Stop,msg=defect):c.validate(state,data(changed),result)
        # A distinct API message after a tool-result user is still a legitimate turn.
        changed=copy.deepcopy(rows);tool=changed[indices[1]];tool['message'].update(stop_reason='tool_use',content=[{'type':'tool_use','id':'fabricated-tool','name':'Read','input':{'file_path':'fabricated'}}])
        user={'type':'user','version':c.VERSION,'sessionId':state['session_uuid'],'uuid':str(uuid.uuid4()),'parentUuid':tool['uuid'],'message':{'role':'user','content':[{'type':'tool_result','tool_use_id':'fabricated-tool','content':'fabricated'}]}}
        final=copy.deepcopy(rows[indices[1]]);final.update(uuid=str(uuid.uuid4()),parentUuid=user['uuid'],requestId='fabricated-next-request',apiBlockIndex=0);final['message']['id']='fabricated-next-message'
        changed[indices[1]+1]['parentUuid']=final['uuid']
        for r in changed:
            if r['type']=='last-prompt':r['leafUuid']=final['uuid']
        changed[indices[1]+1:indices[1]+1]=[user,final]
        self.assertEqual(c.validate(state,data(changed),result),'tiny answer')
        for field in ('requestId','message_id'):
            bad=copy.deepcopy(changed);last=bad[indices[1]+2]
            if field=='requestId':last['requestId']=tool['requestId']
            else:last['message']['id']=tool['message']['id']
            with self.assertRaises(c.Stop,msg=field):c.validate(state,data(bad),result)

    def test_completed_recovery_requires_current_owned_eof_and_stable_evidence(self):
        state,file,raw,result,fake=self.native_pending(resume=True);root=c.STORE/self.worker;backup=(root/'transcript.backup.jsonl').read_bytes();processfile=root/'last-process.json';saved=processfile.read_bytes()
        for key,value in [('code',1),('code',False),('status','failed'),('actual_eof',False),('actual_eof',1),('tree_gone',False),('attempt_id','other'),('job_name','other'),('termination_error','unconfirmed')]:
            process=json.loads(saved);process[key]=value;processfile.write_bytes(c.encoded(process))
            with self.assertRaises(c.Stop,msg=key):c._recover(self.worker,'recover-completed')
            self.assertIsNotNone(self.state()['pending']);self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),backup)
        processfile.write_bytes(saved)
        with patch.object(c,'tree_gone',side_effect=[True,False]):
            with self.assertRaises(c.Stop):c._recover(self.worker,'recover-completed')
        original=c.read;count=0
        def changed_read(path,*args):
            nonlocal count
            data=original(path,*args)
            if path==processfile:
                count+=1
                if count==2:return data+b' '
            return data
        with patch.object(c,'read',side_effect=changed_read):
            with self.assertRaises(c.Stop):c._recover(self.worker,'recover-completed')
        self.assertIsNotNone(self.state()['pending']);self.assertEqual(file.read_bytes(),raw);self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),backup)
        self.assertEqual(c._recover(self.worker,'recover-completed'),'tiny answer')

    def test_296_tool_boundary_versions_and_legacy_pending_recovery(self):
        fake=ToolNative296();c._consult(self.worker,'fabricated baseline296',fake)
        with patch.object(c,'finish',side_effect=c.Stop('retain completed fixture')):
            with self.assertRaises(c.Stop):c._consult(self.worker,'fabricated tool consultation',fake)
        state=self.state();file=c.locate(state['session_uuid']);raw=file.read_bytes();offset=state['pending']['offset'];rows=c.parse_history(raw[offset:]);result=json.loads((c.STORE/self.worker/'stdout.json').read_bytes())
        self.assertEqual(state['pending']['native_version'],'2.1.296');self.assertEqual(c.validate(state,raw,result),'tiny answer')
        def data(records):return raw[:offset]+b'\n'.join(json.dumps(x).encode() for x in records)+b'\n'
        for defect in ('unmatched-tool','duplicate-result','wrong-leaf','foreign-metadata','unknown-metadata','early-metadata','early-cost','wrong-attachment','mixed-version','missing-version','unknown-version'):
            bad=copy.deepcopy(rows)
            if defect=='unmatched-tool':bad[6]['message']['content'][0]['tool_use_id']='foreign'
            if defect=='duplicate-result':bad[6]['message']['content']*=2
            if defect=='wrong-leaf':bad[8]['leafUuid']=bad[6]['uuid']
            if defect=='foreign-metadata':bad[9]['sessionId']='foreign'
            if defect=='unknown-metadata':bad[9]['extra']='unknown'
            if defect=='early-metadata':bad.insert(4,bad.pop(8))
            if defect=='early-cost':bad.insert(9,bad.pop())
            if defect=='wrong-attachment':bad[7]['attachment']={'type':'environment','snapshot':'fabricated'}
            if defect=='mixed-version':bad[3]['version']='2.1.292'
            if defect=='missing-version':bad[6].pop('version')
            if defect=='unknown-version':
                for row in bad:
                    if 'version' in row:row['version']='2.1.999'
            with self.assertRaises(c.Stop,msg=defect):c.validate(state,data(bad),result)
        wrong=copy.deepcopy(state);wrong['pending']['native_version']='2.1.292'
        with self.assertRaises(c.Stop):c.validate(wrong,raw,result)
        wrong['pending']['native_version']=None
        with self.assertRaises(c.Stop):c.validate(wrong,raw,result)
        # Only existing completed pending compatibility: no new dispatch, same exact EOF receipt.
        state['pending'].pop('native_version');c.atomic(c.STORE/self.worker/'session.json',c.encoded(state));calls=len(fake.calls)
        self.assertEqual(c._recover(self.worker,'recover-completed'),'tiny answer');self.assertEqual(len(fake.calls),calls)

    def test_version_preflight_refuses_before_model_and_detects_replacement(self):
        modes=('unknown','malformed','oversize','timeout','nonzero','missing-eof','tree-live','error','boolean-code','replace-during-version','replace-during-auth')
        for mode in modes:
            worker=str(uuid.uuid4());fake=Fake()
            def runner(argv,wire,env,cwd,root,job,timeout):
                outcome=fake(argv,wire,env,cwd,root,job,timeout)
                if '--version' in argv:
                    self.assertEqual(argv,[c.EXE,'--restricted','--safe-mode','--version']);self.assertEqual(timeout,10)
                    if mode=='unknown':(root/'stdout.json').write_bytes(b'2.1.999 (Claude Code)\n')
                    if mode=='malformed':(root/'stdout.json').write_bytes(b'2.1.296 arbitrary text\n')
                    if mode=='oversize':(root/'stdout.json').write_bytes(b'x'*513)
                    if mode=='timeout':outcome['status']='failed'
                    if mode=='nonzero':outcome['code']=1
                    if mode=='missing-eof':outcome.pop('actual_eof')
                    if mode=='tree-live':outcome['tree_gone']=False
                    if mode=='error':outcome['termination_error']='unconfirmed'
                    if mode=='boolean-code':outcome['code']=False
                    if mode=='replace-during-version':self.exe.write_bytes(self.exe.read_bytes()+b'x')
                if 'auth' in argv and mode=='replace-during-auth':self.exe.write_bytes(self.exe.read_bytes()+b'x')
                return outcome
            with self.assertRaises(c.Stop,msg=mode):c._consult(worker,'no billing',runner)
            self.assertFalse(any('-p' in args for args,_,_ in fake.calls),mode)
            state=json.loads((c.STORE/worker/'session.json').read_bytes())
            self.assertEqual(state['pending'] is not None,mode=='replace-during-auth')

    def test_version_preflight_keeps_cap_runner_semantics(self):
        fake=NativeFake();model_calls=[]
        def capped(argv,wire,env,cwd,root,job,timeout):
            if '-p' in argv:
                self.assertEqual(argv[argv.index('--effort')+1],'xhigh');self.assertEqual(env['CLAUDE_CODE_EFFORT_LEVEL'],'xhigh');argv=argv+['--settings','{"maxEffortLevel":"high"}'];model_calls.append(argv)
                # Mock effective clamp; NativeFake expects session selector at the original argv tail.
                fake.effort='high';return fake(argv[:-2],wire,env,cwd,root,job,timeout)
            return fake(argv,wire,env,cwd,root,job,timeout)
        import functools
        original=c._consult
        with patch.object(c,'LIVE_ENABLED',True),patch.object(c,'_consult',functools.partial(original,run=capped)):
            with self.assertRaises(c.Stop):c.consult_claude(self.worker,'fabricated capped turn')
        self.assertFalse(c.LIVE_ENABLED)
        self.assertEqual(len(model_calls),1);self.assertEqual(sum('--version' in args for args,_,_ in fake.calls),1)
        state=self.state();c._recover(self.worker,'dispose-completed-high-probe',state['pending']['attempt_id'],c.digest(c.read(c.locate(state['session_uuid']))));fake.effort='xhigh';self.assertEqual(c._consult(self.worker,'uncapped distinct prompt',fake),'tiny answer')

    def idle_fixture(self):
        fake=NativeFake();c._consult(self.worker,'fabricated accepted baseline',fake);state=self.state();file=c.locate(state['session_uuid']);base=file.read_bytes()
        cost={k:0 for k in c.META_FIELDS['cost-state']};cost.update(type='cost-state',sessionId=state['session_uuid'],totalCostUSD=0.25,hasUnknownModelCost=False,modelUsage={'fabricated-model':{'inputTokens':1,'outputTokens':1,'thinkingTokens':1,'cacheReadInputTokens':0,'cacheCreationInputTokens':0,'webSearchRequests':0,'costUSD':0.25}})
        mode={'type':'permission-mode','sessionId':state['session_uuid'],'permissionMode':'dontAsk'};rows=[cost,mode,copy.deepcopy(cost)];suffix=b'\n'.join(json.dumps(x).encode() for x in rows)+b'\n';file.write_bytes(base+suffix)
        return state,file,base,rows,suffix,fake

    def test_idle_suffix_in_memory_admission_then_real_shaped_acceptance(self):
        state,file,base,rows,suffix,fake=self.idle_fixture();root=c.STORE/self.worker;mapping=(root/'session.json').read_bytes();backup=(root/'transcript.backup.jsonl').read_bytes();data=file.read_bytes()
        self.assertEqual(c.admit_idle_suffix(root,state,file,data),base);self.assertEqual((root/'session.json').read_bytes(),mapping);self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),backup)
        for count in (1,128):
            repeated=(json.dumps(rows[1]).encode()+b'\n')*count;self.assertEqual(c.admit_idle_suffix(root,state,file,base+repeated),base)
        one=json.dumps(rows[1]).encode();exact_bound=one+b' '*(65535-len(one))+b'\n';self.assertEqual(c.admit_idle_suffix(root,state,file,base+exact_bound),base)
        def runner(argv,wire,env,cwd,path,job,timeout):
            if '-p' in argv:
                pending=self.state()['pending'];self.assertEqual(pending['offset'],len(data));self.assertEqual(pending['prefix_sha'],c.digest(data));self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),backup);self.assertEqual(self.state()['last_ok_result'],state['last_ok_result']);self.assertEqual(self.state()['history_sha256'],state['history_sha256'])
            return fake(argv,wire,env,cwd,path,job,timeout)
        self.assertEqual(c._consult(self.worker,'fabricated after manual inspection',runner),'tiny answer');self.assertEqual(file.read_bytes()[:len(data)],data);self.assertEqual(self.state()['backup_sha256'],c.digest(file.read_bytes()));self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),file.read_bytes())
        self.assertEqual(self.state()['session_uuid'],state['session_uuid']);self.assertIn('--resume',fake.calls[-1][0])

    def test_idle_suffix_strict_grammar_and_baseline_rejections(self):
        state,file,base,rows,suffix,fake=self.idle_fixture();root=c.STORE/self.worker;backup=root/'transcript.backup.jsonl'
        def raw(rs):return b'\n'.join(json.dumps(x).encode() for x in rs)+b'\n'
        cases={'empty':b'','partial':suffix[:-1],'blank':b'\n','records129':raw([rows[1]]*129),'oversize':b' '*65537+b'\n','malformed':b'{broken}\n','non-object':b'[]\n','duplicate':raw([rows[1]]).replace(b'"type":',b'"type":"permission-mode","type":'),'nonfinite':raw([rows[0]]).replace(b'0.25',b'NaN'),'overflow':raw([rows[0]]).replace(b'0.25',b'1e999')}
        for kind in ('user','assistant','system','attachment','queue-operation','custom-title','mode','atis-latch','last-prompt','unknown'):
            cases[kind]=raw([{'type':kind,'sessionId':state['session_uuid']}])
        for value in ('default','bypassPermissions','acceptEdits','auto','plan','unknown',None,True,0):
            bad=copy.deepcopy(rows[1]);bad['permissionMode']=value;cases['permission-'+str(value)]=raw([bad])
        for defect in ('foreign','extra','cost-bool','cost-string','cost-numeric-bool','usage-extra','usage-type','usage-duplicate'):
            bad=copy.deepcopy(rows)
            if defect=='foreign':bad[0]['sessionId']='foreign'
            if defect=='extra':bad[1]['uuid']='metadata-must-not-have-uuid'
            if defect=='cost-bool':bad[0]['hasUnknownModelCost']=0
            if defect=='cost-string':bad[0]['totalDuration']='0'
            if defect=='cost-numeric-bool':bad[0]['totalCostUSD']=False
            if defect=='usage-extra':bad[0]['modelUsage']['fabricated-model']['extra']=0
            if defect=='usage-type':bad[0]['modelUsage']=[]
            encoded=raw(bad)
            if defect=='usage-duplicate':encoded=encoded.replace(b'"inputTokens":',b'"inputTokens":2,"inputTokens":')
            cases[defect]=encoded
        for label,value in cases.items():
            with self.assertRaises(c.Stop,msg=label):c.admit_idle_suffix(root,state,file,base+value)
        for defect in ('not-ready','pending','missing-pending','no-result','foreign-result','missing-original','path','history-hash','backup-hash'):
            bad=copy.deepcopy(state)
            if defect=='not-ready':bad['state']='creating'
            if defect=='pending':bad['pending']={'attempt_id':'pending'}
            if defect=='missing-pending':bad.pop('pending')
            if defect=='no-result':bad.pop('last_ok_result')
            if defect=='foreign-result':bad['last_ok_result']['session_id']='foreign'
            if defect=='missing-original':bad.pop('original_wire_sha')
            if defect=='path':bad['transcript']='different'
            if defect=='history-hash':bad['history_sha256']='bad'
            if defect=='backup-hash':bad['backup_sha256']='bad'
            with self.assertRaises(c.Stop,msg=defect):c.admit_idle_suffix(root,bad,file,base+suffix)
        for changed in (b'',base[:-1],base+b' ',b'x'+base[1:]):
            backup.write_bytes(changed)
            with self.assertRaises(c.Stop):c.admit_idle_suffix(root,state,file,base+suffix)
        backup.write_bytes(base)
        held=backup.with_suffix('.held');backup.rename(held)
        with self.assertRaises(OSError):c.admit_idle_suffix(root,state,file,base+suffix)
        held.rename(backup)
        with self.assertRaises(c.Stop):c.admit_idle_suffix(root,state,file,b'x'+base[1:]+suffix)
        other=c.CONFIG/'projects/duplicate';other.mkdir();(other/file.name).write_bytes(b'')
        with self.assertRaises(c.Stop):c.admit_idle_suffix(root,state,file,base+suffix)

    def test_idle_suffix_auth_and_published_pending_races_preserve_evidence(self):
        state,file,base,rows,suffix,fake=self.idle_fixture();root=c.STORE/self.worker;backup=root/'transcript.backup.jsonl';mapping=(root/'session.json').read_bytes();data=base+suffix
        for target in (file,backup):
            def runner(argv,*args):
                outcome=fake(argv,*args)
                if 'auth' in argv:target.write_bytes(target.read_bytes()+b' ')
                return outcome
            before=len(fake.calls)
            with self.assertRaises(c.Stop):c._consult(self.worker,'auth drift',runner)
            self.assertFalse(any('-p' in args for args,_,_ in fake.calls[before:]));self.assertEqual((root/'session.json').read_bytes(),mapping)
            file.write_bytes(data);backup.write_bytes(base)
        original=c.atomic
        for target in (file,backup):
            def write(path,value):
                result=original(path,value)
                if path==root/'session.json' and json.loads(value).get('pending'):target.write_bytes(target.read_bytes()+b' ')
                return result
            before=len(fake.calls)
            with patch.object(c,'atomic',side_effect=write):
                with self.assertRaises(c.Stop):c._consult(self.worker,'published drift',fake)
            self.assertFalse(any('-p' in args for args,_,_ in fake.calls[before:]));pending=self.state();self.assertIsNotNone(pending['pending']);self.assertEqual(pending['history_sha256'],state['history_sha256']);self.assertEqual(pending['last_ok_result'],state['last_ok_result'])
            # Reset only this fabricated test state between independent adversarial cases.
            (root/'session.json').write_bytes(mapping);file.write_bytes(data);backup.write_bytes(base)
        def crash(argv,*args):
            if '-p' in argv:raise OSError('fabricated launch interruption')
            return fake(argv,*args)
        with self.assertRaises(OSError):c._consult(self.worker,'crash after frozen prefix',crash)
        pending=self.state()['pending'];self.assertEqual(pending['offset'],len(data));self.assertEqual(pending['prefix_sha'],c.digest(data));self.assertEqual(backup.read_bytes(),base)
        with self.assertRaises(c.Stop):c._consult(self.worker,'no resend while pending',fake)

    def test_idle_suffix_does_not_widen_active_attempt_permission_mode(self):
        state,file,base,rows,suffix,fake=self.idle_fixture()
        def runner(argv,*args):
            outcome=fake(argv,*args)
            if '-p' in argv:file.write_bytes(file.read_bytes()+json.dumps(rows[1]).encode()+b'\n')
            return outcome
        with self.assertRaises(c.Stop):c._consult(self.worker,'fresh permission metadata is not approved',runner)
        self.assertIsNotNone(self.state()['pending']);self.assertEqual((c.STORE/self.worker/'transcript.backup.jsonl').read_bytes(),base)

    def long_pending(self):
        fake=LongNative296()
        with patch.object(c,'finish',side_effect=c.Stop('retained fabricated interval')):
            with self.assertRaises(c.Stop):c._consult(self.worker,'fabricated long problem',fake)
        state=self.state();file=c.locate(state['session_uuid']);raw=file.read_bytes();rows=c.parse_history(raw);result=json.loads((c.STORE/self.worker/'stdout.json').read_bytes())
        return state,rows,result

    def test_long_296_crossings_reminders_and_mixed_adjacent_positive(self):
        state,rows,result=self.long_pending();raw=lambda rs:b'\n'.join(json.dumps(x).encode() for x in rs)+b'\n'
        self.assertEqual(c.validate(state,raw(rows),result),'tiny answer')
        crossed=[i for i in (7,9,11,22,24,35,46,63,74,80,103) if rows[i-1]['type']=='user'];self.assertEqual(len(crossed),11)
        self.assertEqual([rows[i]['attachment']['type'] for i in (52,53,105,106)],['silent_turn_reminder','total_tokens_reminder']*2)
        # Existing adjacent tool blocks in one message + strict crossing in other messages.
        mixed=copy.deepcopy(rows);mixed[102],mixed[103]=mixed[103],mixed[102]
        previous=None
        for row in mixed:
            if row.get('uuid'):
                if previous is not None:row['parentUuid']=previous
                previous=row['uuid']
        self.assertEqual(c.validate(state,raw(mixed),result),'tiny answer')

    def test_long_crossing_adversaries_and_292_scope(self):
        state,rows,result=self.long_pending();raw=lambda rs:b'\n'.join(json.dumps(x).encode() for x in rs)+b'\n'
        for defect in ('source-link','missing-link','parent','other-tool','two-content','extra-text','thinking-continuation','text-continuation','null-stop','request','message','index-gap','index-duplicate','duplicate-tool','older-result','result2-before-result1','crossed-sidechain','unresolved','two-results','metadata-bridge','attachment-bridge','retired-message','retired-request','version292'):
            bad=copy.deepcopy(rows)
            if defect=='source-link':bad[6]['sourceToolAssistantUUID']='foreign'
            if defect=='missing-link':bad[6].pop('sourceToolAssistantUUID')
            if defect=='parent':bad[6]['parentUuid']=bad[4]['uuid']
            if defect=='other-tool':bad[6]['message']['content'][0]['tool_use_id']=bad[7]['message']['content'][0]['id']
            if defect=='two-content':bad[6]['message']['content']*=2
            if defect=='extra-text':bad[6]['message']['content'].append({'type':'text','text':'fabricated'})
            if defect=='thinking-continuation':bad[7]['message']['content']=[{'type':'thinking','thinking':'fabricated'}]
            if defect=='text-continuation':bad[7]['message']['content']=[{'type':'text','text':'fabricated'}]
            if defect=='null-stop':bad[7]['message']['stop_reason']=None
            if defect=='request':bad[7]['requestId']='foreign'
            if defect=='message':bad[7]['message']['id']='foreign'
            if defect=='index-gap':bad[7]['apiBlockIndex']=50
            if defect=='index-duplicate':bad[7]['apiBlockIndex']=1
            if defect=='duplicate-tool':bad[7]['message']['content'][0]['id']=bad[5]['message']['content'][0]['id']
            if defect=='older-result':bad[8]['message']['content'][0]['tool_use_id']=bad[5]['message']['content'][0]['id']
            if defect=='result2-before-result1':bad[6],bad[8]=bad[8],bad[6]
            if defect=='crossed-sidechain':bad[6]['isSidechain']=True
            if defect=='unresolved':bad[5]['message']['content'].append({'type':'tool_use','id':'still-open','name':'Read','input':{}})
            if defect=='two-results':
                copyresult=copy.deepcopy(bad[6]);copyresult['uuid']=str(uuid.uuid4());copyresult['parentUuid']=bad[6]['uuid'];bad[7]['parentUuid']=copyresult['uuid'];bad.insert(7,copyresult)
            if defect=='metadata-bridge':bad.insert(7,{'type':'atis-latch','sessionId':state['session_uuid'],'atis':'fabricated'})
            if defect=='attachment-bridge':
                extra=copy.deepcopy(bad[3]);extra.update(uuid=str(uuid.uuid4()),parentUuid=bad[6]['uuid']);bad[7]['parentUuid']=extra['uuid'];bad.insert(7,extra)
            if defect=='retired-message':bad[19]['message']['id']=bad[4]['message']['id']
            if defect=='retired-request':bad[19]['requestId']=bad[4]['requestId']
            altered=copy.deepcopy(state)
            if defect=='version292':
                altered['pending']['native_version']='2.1.292'
                for row in bad:
                    if 'version' in row:row['version']='2.1.292'
            with self.assertRaises(c.Stop,msg=defect):c.validate(altered,raw(bad),result)
        # Isolate C's version scope without either new reminder; R's scope rejects separately.
        v292=copy.deepcopy(rows);older=copy.deepcopy(state);older['pending']['native_version']='2.1.292'
        for row in v292:
            if 'version' in row:row['version']='2.1.292'
        with self.assertRaisesRegex(c.Stop,'invalid silent reminder boundary'):c.validate(older,raw(v292),result)
        for index in (105,52):
            removed=v292.pop(index);v292[index]['parentUuid']=removed['parentUuid']
        with self.assertRaisesRegex(c.Stop,'crossing is not one source-linked result'):c.validate(older,raw(v292),result)
        # Global tool identity cannot be reused from an immutable prior accepted prefix.
        prefix=[copy.deepcopy(rows[2]),copy.deepcopy(rows[5])];prefix[0]['uuid']=str(uuid.uuid4());prefix[1]['uuid']=str(uuid.uuid4());prefix[1]['parentUuid']=prefix[0]['uuid'];prior=raw(prefix);altered=copy.deepcopy(state);altered['pending'].update(offset=len(prior),prefix_sha=c.digest(prior))
        with self.assertRaisesRegex(c.Stop,'ambiguous tool-use identity'):c.validate(altered,prior+raw(rows),result)

    def test_long_reminder_adversaries_and_premature_permission_refused(self):
        state,rows,result=self.long_pending();raw=lambda rs:b'\n'.join(json.dumps(x).encode() for x in rs)+b'\n'
        for defect in ('schema-extra','text-type','sidechain','before-user','after-final','open-tool','same-message','same-request','same-message-continuation','duplicate-silent','duplicate-total','reverse-order','missing-total','wrong-parent','system-after-reminders'):
            bad=copy.deepcopy(rows)
            if defect=='schema-extra':bad[52]['attachment']['extra']='unknown'
            if defect=='text-type':bad[52]['attachment']['text']=1
            if defect=='sidechain':bad[52]['isSidechain']=True
            if defect=='before-user':bad.insert(2,bad.pop(52))
            if defect=='after-final':bad.insert(109,bad.pop(52))
            if defect=='open-tool':bad[50]['message']['content'].append({'type':'tool_use','id':'open','name':'Read','input':{}})
            if defect=='same-message':bad[59]['message']['id']=bad[50]['message']['id']
            if defect=='same-request':bad[59]['requestId']=bad[50]['requestId']
            if defect=='same-message-continuation':
                bad[59]['message']['id']=bad[50]['message']['id'];bad[59]['requestId']=bad[50]['requestId'];bad[59]['apiBlockIndex']=2
            if defect=='duplicate-silent':bad[53]['attachment']['type']='silent_turn_reminder'
            if defect=='duplicate-total':
                extra=copy.deepcopy(bad[53]);extra.update(uuid=str(uuid.uuid4()),parentUuid=bad[53]['uuid']);bad[59]['parentUuid']=extra['uuid'];bad.insert(54,extra)
            if defect=='reverse-order':bad[52]['attachment']['type'],bad[53]['attachment']['type']=bad[53]['attachment']['type'],bad[52]['attachment']['type']
            if defect=='missing-total':bad[59]['parentUuid']=bad[52]['uuid'];bad.pop(53)
            if defect=='wrong-parent':bad[52]['parentUuid']=bad[50]['uuid']
            if defect=='system-after-reminders':
                extra={k:'fabricated' for k in c.NATIVE_COMMON};extra.update(type='system',uuid=str(uuid.uuid4()),parentUuid=bad[53]['uuid'],sessionId=state['session_uuid'],version='2.1.296',isSidechain=False,subtype='api_error',error={'status':500,'formatted':'fabricated'},level='error',maxRetries=1,retryAttempt=1,retryInMs=0,source='api');bad[59]['parentUuid']=extra['uuid'];bad.insert(59,extra)
            with self.assertRaises(c.Stop,msg=defect):c.validate(state,raw(bad),result)
        bad=copy.deepcopy(rows);bad.insert(108,{'type':'permission-mode','sessionId':state['session_uuid'],'permissionMode':'dontAsk'})
        with self.assertRaises(c.Stop):c.validate(state,raw(bad),result)

    def terminal_pending(self,effort='xhigh'):
        fake=TerminalNative296();fake.effort=effort
        with patch.object(c,'finish',side_effect=c.Stop('fabricated pending after completed outcome')):
            with self.assertRaises(c.Stop):c._consult(self.worker,'fabricated terminal prompt',fake)
        state=self.state();file=c.locate(state['session_uuid']);rows=c.parse_history(file.read_bytes());result=json.loads((c.STORE/self.worker/'stdout.json').read_bytes())
        self.assertEqual(len(rows),13)
        return state,file,rows,result,fake

    def test_terminal_A13_positive_rule_removal_and_public_recovery(self):
        state,file,rows,result,fake=self.terminal_pending();data=file.read_bytes();calls=len(fake.calls)
        self.assertEqual(c.validate(state,data,result),'tiny answer')
        # Remove only the new terminal allowance in memory: the full A13 case refuses again.
        source=inspect.getsource(c.attempt_records);start=source.index("        if kind=='permission-mode':");end=source.index('        if kind in META_FIELDS:',start)
        namespace=dict(c.__dict__);exec(source[:start]+source[end:],namespace)
        with self.assertRaisesRegex(c.Stop,'record after terminal assistant'):namespace['attempt_records'](state,data)
        # Existing display metadata order is not pinned to this one observed layout.
        for tail in ([rows[10],*rows[6:10],rows[12],rows[11]], [rows[12],rows[7],rows[10],rows[8],rows[6],rows[11],rows[9]]):
            raw=b'\n'.join(json.dumps(r).encode() for r in rows[:6]+tail)+b'\n'
            self.assertEqual(c.validate(state,raw,result),'tiny answer')
        with patch.object(c,'LIVE_ENABLED',True):self.assertEqual(c.recover(self.worker,'recover-completed'),'tiny answer')
        self.assertEqual(len(fake.calls),calls);self.assertIsNone(self.state()['pending'])
        self.assertEqual((c.STORE/self.worker/'transcript.backup.jsonl').read_bytes(),data)
        self.assertEqual(c._consult(self.worker,'fabricated next terminal turn',fake),'tiny answer')
        self.assertIn('--resume',fake.calls[-1][0]);self.assertEqual(self.state()['session_uuid'],state['session_uuid'])
        self.assertEqual(file.read_bytes()[:len(data)],data) # Prior permission record is immutable prefix.

    def test_terminal_permission_exact_shape_and_raw_duplicates(self):
        state,file,rows,result,fake=self.terminal_pending()
        def raw(values):return b'\n'.join(json.dumps(r).encode() for r in values)+b'\n'
        variants=[]
        for value in ('default','bypassPermissions','acceptEdits','auto','plan','DontAsk','dontAsk ','',None,True,1,['dontAsk'],{}):
            variants.append({**rows[10],'permissionMode':value})
        for key in rows[10]:variants.append({k:v for k,v in rows[10].items() if k!=key})
        for key in ('uuid','timestamp'):variants.append({**rows[10],key:'fabricated'})
        for key in ('type','sessionId'):
            for value in (None,False,1,[],{}):variants.append({**rows[10],key:value})
        variants.append({**rows[10],'sessionId':str(uuid.uuid4())})
        for value in variants:
            changed=copy.deepcopy(rows);changed[10]=value
            with self.assertRaises((c.Stop,TypeError),msg=str(value)):c.attempt_records(state,raw(changed))
        for key in rows[10]:
            line=json.dumps(rows[10]);duplicate=(line[:-1]+','+json.dumps(key)+':'+json.dumps(rows[10][key])+'}').encode()
            data=b'\n'.join(duplicate if i==10 else json.dumps(r).encode() for i,r in enumerate(rows))+b'\n'
            with self.assertRaisesRegex(c.Stop,'duplicate terminal permission key'):c.attempt_records(state,data)
        duplicate=copy.deepcopy(rows);duplicate.insert(11,copy.deepcopy(rows[10]))
        with self.assertRaises(c.Stop):c.attempt_records(state,raw(duplicate))
        wrong=copy.deepcopy(rows);pinned=copy.deepcopy(state);pinned['pending']['native_version']='2.1.292'
        for record in wrong:
            if 'version' in record:record['version']='2.1.292'
        with self.assertRaises(c.Stop):c.attempt_records(pinned,raw(wrong))
        # Final answer matching and per-record model/effort remain independent requirements.
        with self.assertRaises(c.Stop):c.validate(state,file.read_bytes(),{**result,'result':'other answer'})
        for field in ('effort','perTurnEffort'):
            wrong=copy.deepcopy(rows);wrong[5][field]='high'
            with self.assertRaises(c.Stop):c.validate(state,raw(wrong),result)

    def test_terminal_permission_anchor_and_closed_tail(self):
        state,file,rows,result,fake=self.terminal_pending()
        def check(values):
            with self.assertRaises(c.Stop):c.attempt_records(state,b'\n'.join(json.dumps(r).encode() for r in values)+b'\n')
        for position in (0,2,4,5):
            wrong=copy.deepcopy(rows);permission=wrong.pop(10);wrong.insert(position,permission);check(wrong)
        for defect in ('thinking-only','empty','incomplete','tool-use','unresolved','synthetic','error','api-error','foreign-model'):
            wrong=copy.deepcopy(rows);last=wrong[5];message=last['message']
            if defect=='thinking-only':message['content']=[{'type':'thinking','thinking':'fabricated'}]
            if defect=='empty':message['content']=[{'type':'text','text':'   '}]
            if defect=='incomplete':message['stop_reason']=None
            if defect in ('tool-use','unresolved'):
                wrong[4]['message']['stop_reason']='tool_use';message['stop_reason']='tool_use';message['content']=[{'type':'tool_use','id':'fabricated-open','name':'Read','input':{}}]
                if defect=='unresolved':message['content'].append({'type':'text','text':'fabricated'})
            if defect=='synthetic':message['model']='<synthetic>';message['stop_reason']='stop_sequence'
            if defect=='error':last['error']='fabricated'
            if defect=='api-error':last['isApiErrorMessage']=True
            if defect=='foreign-model':message['model']='other'
            check(wrong)
        continuation=copy.deepcopy(rows[5]);continuation.update(uuid=str(uuid.uuid4()),parentUuid=rows[5]['uuid'],apiBlockIndex=2)
        attachment={k:'fabricated' for k in c.NATIVE_COMMON};attachment.update(type='attachment',sessionId=state['session_uuid'],version='2.1.296',uuid=str(uuid.uuid4()),parentUuid=rows[5]['uuid'],isSidechain=False,attachment={'type':'prompt_snapshot','contextRendering':'fabricated','systemPrompt':'fabricated'})
        for extra in (continuation,copy.deepcopy(rows[2]),attachment,copy.deepcopy(rows[0]),{'type':'system','sessionId':state['session_uuid']}):
            wrong=copy.deepcopy(rows);wrong.insert(11,extra);check(wrong)
        # A post-text native attachment is an event, not a display-only anchor bridge.
        wrong=copy.deepcopy(rows);wrong.insert(6,attachment);check(wrong)

    def test_terminal_permission_public_high_probe_and_oauth_routes(self):
        state,file,rows,result,fake=self.terminal_pending('high');calls=len(fake.calls);root=c.STORE/self.worker
        with patch.object(c,'LIVE_ENABLED',True):
            with self.assertRaises(c.Stop):c.recover(self.worker,'recover-completed')
            self.assertIn('no answer accepted',c.recover(self.worker,'dispose-completed-high-probe',state['pending']['attempt_id'],c.digest(file.read_bytes())))
        self.assertEqual(len(fake.calls),calls);self.assertFalse((root/'transcript.backup.jsonl').exists());self.assertFalse(self.state()['disposed_probe']['accepted_as_xhigh'])
        fake.effort='xhigh';c._consult(self.worker,'new xhigh terminal prompt',fake);self.assertEqual(self.state()['session_uuid'],state['session_uuid'])
        # A separate tiny mock worker exercises the shared parser through public OAuth disposition.
        other=str(uuid.uuid4())
        with patch.dict(os.environ,{'CODEX_THREAD_ID':other}):
            original=self.worker;self.worker=other
            try:
                state,file,rows,result=self.oauth_fixture();attempt=state['pending']['attempt_id'];root=c.STORE/other
                state['pending']['native_version']='2.1.296'
                for record in rows:
                    if 'version' in record:record['version']='2.1.296'
                c.atomic(root/'session.json',c.encoded(state));baseline=b'\n'.join(json.dumps(r).encode() for r in rows)+b'\n'
                bad=baseline+json.dumps({'type':'permission-mode','sessionId':state['session_uuid'],'permissionMode':'dontAsk'}).encode()+b'\n';file.write_bytes(bad)
                with patch.object(c,'LIVE_ENABLED',True):
                    with self.assertRaisesRegex(c.Stop,'terminal permission requires real completed text'):c.recover(other,'dispose-terminal-oauth-failure',attempt,c.digest(bad))
                    self.assertIsNotNone(self.state()['pending']);self.assertFalse((root/('oauth-failure-'+attempt+'.json')).exists())
                    file.write_bytes(baseline)
                    self.assertIn('no answer accepted',c.recover(other,'dispose-terminal-oauth-failure',attempt,c.digest(baseline)))
            finally:self.worker=original

    def test_managed_policy_presence_unknown_and_prelaunch_guard(self):
        absent=FileNotFoundError('absent')
        with patch.object(c,'plain',side_effect=lambda p:p),patch.object(c.os,'lstat',side_effect=absent) as stat,patch.object(c.winreg,'OpenKey',side_effect=absent) as key,patch.object(c.winreg,'QueryValueEx',side_effect=AssertionError('must not read policy values')):
            self.guard();self.assertEqual(stat.call_count,7);self.assertEqual(key.call_count,4)
        for kind in ('file','registry','unknown'):
            with patch.object(c,'plain',side_effect=lambda p:p),patch.object(c.os,'lstat',side_effect=None if kind=='file' else absent),patch.object(c.winreg,'OpenKey',side_effect=PermissionError('unknown') if kind=='unknown' else None):
                with self.assertRaises(c.Stop):self.guard()
        with patch.object(c,'managed_policy_guard',side_effect=[None,c.Stop('new managed policy')]):
            with self.assertRaises(c.Stop):c._consult(self.worker,'do not launch model',self.fake)
        self.assertEqual(len(self.fake.calls),2)

    def test_creation_resume_and_distinct_workers(self):
        self.assertEqual(c._consult(self.worker,'first',self.fake),'tiny answer');first=self.state()
        c._consult(self.worker,'second problem',self.fake);self.assertEqual(self.state()['session_uuid'],first['session_uuid']);self.assertIn('--resume',self.fake.calls[-1][0])
        other=str(uuid.uuid4());c._consult(other,'other',self.fake)
        other_state=json.loads((c.STORE/other/'session.json').read_text());self.assertNotEqual(other_state['session_uuid'],first['session_uuid'])
    def test_inherited_binding_and_live_disabled(self):
        with self.assertRaises(c.Stop):c.worker_id(str(uuid.uuid4()))
        with self.assertRaises(c.Stop):c.consult_claude(self.worker,'no live calls')
        c._consult(self.worker,'first',self.fake);state=self.state();state['worker_id']=str(uuid.uuid4());c.atomic(c.STORE/self.worker/'session.json',c.encoded(state))
        with self.assertRaises(c.Stop):c._consult(self.worker,'swapped',self.fake)
    def test_subscription_scrub_and_api_refusal(self):
        with patch.dict(os.environ,{'ANTHROPIC_API_KEY':'never-log','ANTHROPIC_AUTH_TOKEN':'never-log','ANTHROPIC_BASE_URL':'bad','CLAUDE_CODE_USE_VERTEX':'1','CLAUDE_CODE_OAUTH_TOKEN':'never-log'}):
            env=c.child_env();self.assertFalse(any(k.startswith('ANTHROPIC_') for k in env));self.assertNotIn('CLAUDE_CODE_OAUTH_TOKEN',env);self.assertEqual(env['CLAUDE_CODE_EFFORT_LEVEL'],'xhigh')
        self.fake.auth='api-key'
        with self.assertRaises(c.Stop):c._consult(self.worker,'blocked',self.fake)
        self.assertEqual(len(self.fake.calls),2)
    def test_pending_before_spawn_and_explicit_completed_recovery(self):
        self.fake.fail=True
        with self.assertRaises(c.Stop):c._consult(self.worker,'reply lost',self.fake)
        pending=self.state();self.assertIsNotNone(pending['pending']);calls=len(self.fake.calls)
        with self.assertRaises(c.Stop):c._consult(self.worker,'no resend',self.fake)
        self.assertEqual(len(self.fake.calls),calls)
        with self.assertRaises(c.Stop):c._recover(self.worker,'recover-completed')
        processfile=c.STORE/self.worker/'last-process.json';process=json.loads(processfile.read_bytes());process['code']=0;processfile.write_bytes(c.encoded(process)) # Separate fabricated confirmed EOF success.
        self.assertEqual(c._recover(self.worker,'recover-completed'),'tiny answer');self.assertEqual(self.state()['session_uuid'],pending['session_uuid'])
    def test_missing_history_preserves_uuid_and_explicit_backup_restore(self):
        c._consult(self.worker,'first',self.fake);state=self.state();file=Path(state['transcript']);file.rename(file.with_suffix('.held'))
        with self.assertRaises(c.Stop):c._consult(self.worker,'missing',self.fake)
        self.assertEqual(self.state()['session_uuid'],state['session_uuid']);self.assertIn('same UUID',c._recover(self.worker,'restore-backup'))
        with self.assertRaises(c.Stop):c._recover(self.worker,'restore-backup')
    def test_model_effort_freshness_original_marker_and_result(self):
        self.fake.effort='high'
        with self.assertRaises(c.Stop):c._consult(self.worker,'lower',self.fake)
        state=self.state();file=c.locate(state['session_uuid']);records=c.parse_history(c.read(file));result=json.loads(c.read(c.STORE/self.worker/'stdout.json'))
        records[-1]['effort']=records[-1]['perTurnEffort']='xhigh'
        raw=lambda rows:b'\n'.join(json.dumps(r).encode() for r in rows)+b'\n'
        c.validate(state,raw(records),result)
        for change in ('model','marker','attempt','ancestry','session','terminal','result'):
            rows=copy.deepcopy(records);out=copy.deepcopy(result)
            if change=='model':rows[-1]['message']['model']='other'
            if change=='marker':rows[0]['message']['content']='assistant quoted consult-worker:'+self.worker
            if change=='attempt':rows[0]['message']['content']+='different'
            if change=='ancestry':rows[-1]['parentUuid']='old-record'
            if change=='session':out['session_id']=str(uuid.uuid4())
            if change=='terminal':rows[-1]['message']['stop_reason']='tool_use'
            if change=='result':out['subtype']='error_max_turns'
            with self.assertRaises(c.Stop,msg=change):c.validate(state,raw(rows),out)
        with self.assertRaises(c.Stop):c.validate(state,b'',result)
    def test_pending_record_failure_never_spawns_consultation(self):
        original=c.atomic
        def write(file,data):
            if file.name=='session.json' and json.loads(data).get('pending'):raise OSError('fsync failure')
            return original(file,data)
        with patch.object(c,'atomic',side_effect=write):
            with self.assertRaises(OSError):c._consult(self.worker,'first',self.fake)
        self.assertEqual(len(self.fake.calls),2);sid=self.state()['session_uuid']
        self.assertTrue(sid);self.assertEqual(self.state()['state'],'creating')
    def test_missing_mapping_never_generates_replacement_uuid(self):
        c._consult(self.worker,'first',self.fake);state=self.state();file=c.STORE/self.worker/'session.json';file.rename(file.with_suffix('.held'))
        with self.assertRaises(c.Stop):c._consult(self.worker,'no replacement',self.fake)
        self.assertFalse(file.exists());self.assertTrue((c.STORE/'owners'/(state['session_uuid']+'.json')).exists())
    def test_duplicate_mapping_and_ambiguous_transcript(self):
        c._consult(self.worker,'first',self.fake);state=self.state();claim=c.STORE/'owners'/(state['session_uuid']+'.json');claim.write_text(json.dumps({'worker_id':'foreign'}))
        with self.assertRaises(c.Stop):c._consult(self.worker,'duplicate',self.fake)
        claim.write_text(json.dumps({'worker_id':self.worker}));changed=copy.deepcopy(state);changed['session_uuid']=str(uuid.uuid4());changed['state']='creating';c.atomic(c.STORE/self.worker/'session.json',c.encoded(changed))
        with self.assertRaises(c.Stop):c._consult(self.worker,'replacement forbidden',self.fake)
        self.assertFalse((c.STORE/'owners'/(changed['session_uuid']+'.json')).exists())
        second=c.CONFIG/'projects/other';second.mkdir();(second/(state['session_uuid']+'.jsonl')).write_bytes(b'')
        with self.assertRaises(c.Stop):c.locate(state['session_uuid'])
    def test_different_workers_overlap_and_failed_backup_preserved(self):
        import concurrent.futures,threading
        barrier=threading.Barrier(2)
        class ParallelFake(Fake):
            def __call__(self,*args):
                if '-p' in args[0]:barrier.wait(timeout=5)
                return super().__call__(*args)
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            work=[pool.submit(c._consult,w,'parallel',ParallelFake()) for w in (self.worker,str(uuid.uuid4()))]
            self.assertEqual([f.result() for f in work],['tiny answer','tiny answer'])
        backup=c.STORE/self.worker/'transcript.backup.jsonl';previous=backup.read_bytes();original=c.atomic
        def write(file,data):
            if file==backup:raise OSError('backup fsync failure')
            return original(file,data)
        with patch.object(c,'atomic',side_effect=write):
            with self.assertRaises(OSError):c._consult(self.worker,'backup failure',self.fake)
        self.assertEqual(backup.read_bytes(),previous);self.assertIsNotNone(self.state()['pending'])
        with patch.object(c,'tree_gone',return_value=False):
            with self.assertRaises(c.Stop):c._recover(self.worker,'recover-completed')

    def test_os_lock_same_worker_refused_other_allowed(self):
        a=self.root/'a.lock';b=self.root/'b.lock'
        with c.WorkerLock(a):
            with c.WorkerLock(b):pass
            code='import sys;sys.path.insert(0,sys.argv[1]);import consult_claude as c; c.WorkerLock(__import__("pathlib").Path(sys.argv[2])).__enter__()'
            child=subprocess.run([sys.executable,'-c',code,str(Path(c.__file__).parent),str(a)],capture_output=True,timeout=10)
            self.assertNotEqual(child.returncode,0);self.assertIn(b'worker already owned',child.stderr)
        with c.WorkerLock(a):pass
    def test_main_utf8_stdout_real_cp1252_subprocess_and_pinned_old_control(self):
        answer='arrow \u2192 em dash \u2014 CJK \u4e2d\u6587 Greek \u03b1\u03b2\nsecond\r\nthird'
        prompt='BOM prompt \u4e2d\u6587 \u03b1\u03b2\n'
        # Unicode arguments use the Windows wide-character argv API; stdin is explicitly UTF-8.
        harness=r"""
import hashlib,importlib.util,json,os,sys
from pathlib import Path
module_path,mode,record_path,answer,prompt=sys.argv[1:]
assert sys.stdout.encoding.lower()=='cp1252' and sys.flags.utf8_mode==0
before=sys.stdout.encoding
spec=importlib.util.spec_from_file_location('offline_cli',module_path);c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)
assert sys.stdout.encoding==before
if mode=='old':
    source=Path(module_path).read_bytes()
    new=b"def main():\n    import sys\n    sys.stdout.reconfigure(encoding='utf-8', newline='\\n')\n"
    assert source.count(new)==1
    source=source.replace(new,b'def main():\n',1)
    assert source.count(b'    raw=read(args.prompt_file')==1
    source=source.replace(b'    raw=read(args.prompt_file',b'    import sys\n    raw=read(args.prompt_file',1)
    old_main=source[source.index(b'def main():'):source.index(b"if __name__")]
    assert hashlib.sha256(old_main).hexdigest().upper()=='351EA85DB71A36203011045B22F53BC5B6B1F1E8EC6DAC70CE66103B4F9702E3'
    exec(compile(source,module_path,'exec'),c.__dict__)
calls=[]
def consult(worker,text):
    assert worker==os.environ['CODEX_THREAD_ID'] and text==prompt
    calls.append({'branch':'consult','prompt_sha256':hashlib.sha256(text.encode('utf-8')).hexdigest()})
    return answer
def recover(worker,action,attempt,history):
    assert worker==os.environ['CODEX_THREAD_ID'] and action=='recover-completed' and attempt is None and history is None
    calls.append({'branch':'recover'})
    return answer
c.consult_claude=consult;c.recover=recover
def forbidden(*args,**kwargs):raise AssertionError('real auth/model/process dispatch forbidden')
c.run_owned=forbidden
sys.argv=['consult_claude.py']+([] if mode=='consult' else ['--recover','recover-completed'])
if mode=='missing':sys.stdout=None
try:c.main()
finally:Path(record_path).write_text(json.dumps({'import_encoding':before,'calls':calls}),encoding='utf-8')
"""
        env=dict(os.environ,PYTHONIOENCODING='cp1252',PYTHONDONTWRITEBYTECODE='1');env.pop('PYTHONUTF8',None)
        for mode in ('recover','consult','old','missing'):
            record=self.root/('stdout-'+mode+'.json')
            child=subprocess.run([sys.executable,'-c',harness,str(Path(c.__file__).resolve()),mode,str(record),answer,prompt],
                input=b'\xef\xbb\xbf'+prompt.encode('utf-8'),stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env,timeout=10)
            observed=json.loads(record.read_text(encoding='utf-8'));self.assertEqual(observed['import_encoding'].lower(),'cp1252')
            expected=[] if mode=='missing' else [{'branch':'consult','prompt_sha256':c.digest(prompt.encode('utf-8'))}] if mode=='consult' else [{'branch':'recover'}]
            self.assertEqual(observed['calls'],expected,mode)
            if mode in ('recover','consult'):
                self.assertEqual(child.returncode,0,child.stderr);self.assertEqual(child.stderr,b'')
                self.assertEqual(child.stdout,answer.encode('utf-8')+b'\n')
            else:
                self.assertEqual(child.returncode,1);self.assertEqual(child.stdout,b'')
                self.assertIn(b'UnicodeEncodeError' if mode=='old' else b'AttributeError',child.stderr)

    def two_pending(self,effort='xhigh'):
        fake=TwoToolNative296();fake.effort=effort
        with patch.object(c,'finish',side_effect=c.Stop('retained two-tool fixture')):
            with self.assertRaises(c.Stop):c._consult(self.worker,'fabricated two-tool problem',fake)
        state=self.state();file=c.locate(state['session_uuid']);data=file.read_bytes()
        return state,file,c.parse_history(data[state['pending']['offset']:]),json.loads((c.STORE/self.worker/'stdout.json').read_bytes()),fake

    def two_raw(self,state,rows):
        return c.read(c.locate(state['session_uuid']))[:state['pending']['offset']]+b'\n'.join(json.dumps(r).encode() for r in rows)+b'\n'

    def test_two_tool_raw_duplicate_keys_all_four_objects(self):
        state,file,rows,result,fake=self.two_pending();original=file.read_bytes();mapping=(c.STORE/self.worker/'session.json').read_bytes();calls=len(fake.calls)
        for index,key in ((28,'requestId'),(29,'parentUuid'),(30,'parentUuid'),(31,'sourceToolAssistantUUID')):
            for escaped in (False,True):
                encoded_key=('\\u%04x'%ord(key[0])+key[1:]) if escaped else key
                for location in ('outer','message','content'):
                    lines=[json.dumps(r) for r in rows];line=lines[index]
                    if location=='outer':line=line.replace('{','{"'+encoded_key+'":"contradictory-foreign",',1)
                    elif location=='message':
                        nested='id' if index<30 else 'role';encoded_key=('\\u%04x'%ord(nested[0])+nested[1:]) if escaped else nested
                        line=line.replace('"message": {','"message": {"'+encoded_key+'":"contradictory-foreign",',1)
                    else:
                        nested='id' if index<30 else 'tool_use_id';encoded_key=('\\u%04x'%ord(nested[0])+nested[1:]) if escaped else nested
                        line=line.replace('"content": [{','"content": [{"'+encoded_key+'":"contradictory-foreign",',1)
                    lines[index]=line;raw=('\n'.join(lines)+'\n').encode()
                    with self.subTest(index=index,escaped=escaped,location=location):
                        with self.assertRaisesRegex(c.Stop,'^fresh attempt ancestry mismatch$'):c.validate(state,raw,result)
        self.assertEqual(file.read_bytes(),original);self.assertEqual((c.STORE/self.worker/'session.json').read_bytes(),mapping);self.assertEqual(len(fake.calls),calls)

    def test_two_tool_raw_nonblank_correspondence_and_local_policy(self):
        state,file,rows,result,fake=self.two_pending();original=file.read_bytes()
        lines=[json.dumps(r) for r in rows]
        raw=(' \t\r\n\n'+'\r\n \t\n\n'.join(lines)+'\r\n \t\n').encode()
        self.assertEqual(c.validate(state,raw,result),'tiny answer')
        for index in (28,29,30,31):
            changed=lines.copy();changed[index]=changed[index].replace('{','{"\\u0070arentUuid":"foreign",',1)
            ambiguous=('\n \t\n'.join(changed)+'\n').encode()
            with self.assertRaisesRegex(c.Stop,'^fresh attempt ancestry mismatch$'):c.validate(state,ambiguous,result)
        for gap in (29,30,31):
            interposed=lines.copy();interposed.insert(gap,json.dumps({'type':'custom-title','sessionId':state['session_uuid'],'customTitle':'fabricated'}))
            with self.assertRaises(c.Stop):c.validate(state,('\n \t\n'.join(interposed)+'\n').encode(),result)
        # Existing default linear parsing is intentionally unchanged by this local rule.
        linear=copy.deepcopy(rows);linear[30]['parentUuid']=linear[29]['uuid'];linear[31]['parentUuid']=linear[30]['uuid']
        lines=[json.dumps(r) for r in linear];lines[31]=lines[31].replace('{','{"sourceToolAssistantUUID":"foreign",',1)
        self.assertEqual(c.validate(state,('\n'.join(lines)+'\n').encode(),result),'tiny answer')
        self.assertEqual(file.read_bytes(),original)

    def test_two_tool_full112_and_exact_old_wrapper_control(self):
        state,file,rows,result,fake=self.two_pending();data=file.read_bytes();mapping=(c.STORE/self.worker/'session.json').read_bytes();calls=len(fake.calls)
        self.assertEqual(len(rows),112);self.assertEqual([r['type'] for r in rows[28:32]],['assistant','assistant','user','user'])
        self.assertEqual([r['apiBlockIndex'] for r in rows[28:30]],[2,3]);self.assertEqual(c.validate(state,data,result),'tiny answer')
        # Reconstruct and pin the entire exact installed predecessor, including stdout.
        source=Path(c.__file__).read_bytes();begin=source.index(b'def two_tool_window(');end=source.index(b'def attempt_records(')
        source=source[:begin]+source[end:];source=source.replace(b';permission_seen=False;second_result=None',b';permission_seen=False')
        begin=source.index(b"            if r.get('parentUuid')!=events[-1]['uuid']:")
        end=source.index(b"        if not r.get('uuid')",begin)
        source=source[:begin]+b"            if r.get('parentUuid')!=events[-1]['uuid']:raise Stop('fresh attempt ancestry mismatch')\n"+source[end:]
        self.assertEqual(c.digest(source),'06c82365704b59e2d4efd43dfbd990393687e105d6fec887fcaa818fa195bac8')
        namespace=dict(__name__='old_offline',__file__=c.__file__);exec(compile(source,c.__file__,'exec'),namespace)
        with self.assertRaisesRegex(namespace['Stop'],'fresh attempt ancestry mismatch'):namespace['validate'](state,data,result)
        self.assertEqual(file.read_bytes(),data);self.assertEqual((c.STORE/self.worker/'session.json').read_bytes(),mapping);self.assertEqual(len(fake.calls),calls)
        # Relocate raw positions and all identities (second generated mock), not an edge allowlist.
        moved=copy.deepcopy(rows);sid=state['session_uuid'];moved.insert(0,{'type':'custom-title','sessionId':sid,'customTitle':'fabricated'})
        self.assertEqual(c.validate(state,self.two_raw(state,moved),result),'tiny answer')
        # Synthetic, unobserved entries: after thinking at indices1/2, or a new message0/1.
        for remove in ((26,27),(25,26,27)):
            changed=copy.deepcopy(rows);a,b=changed[28:30];parent=changed[24 if 25 in remove else 25]['uuid']
            a['parentUuid']=parent;a['apiBlockIndex']=0 if 25 in remove else 1;b['apiBlockIndex']=a['apiBlockIndex']+1
            changed=[r for i,r in enumerate(changed) if i not in remove]
            self.assertEqual(c.validate(state,self.two_raw(state,changed),result),'tiny answer')
        # Default linear result behavior remains separate and unchanged.
        linear=copy.deepcopy(rows);linear[30]['parentUuid']=linear[29]['uuid'];linear[31]['parentUuid']=linear[30]['uuid']
        self.assertEqual(c.validate(state,self.two_raw(state,linear),result),'tiny answer')

    def test_two_tool_single_defect_matrix(self):
        state,file,rows,result,fake=self.two_pending();original=file.read_bytes();mapping=(c.STORE/self.worker/'session.json').read_bytes();calls=len(fake.calls)
        cases=[]
        def field(label,index,path,value,missing=False):
            bad=copy.deepcopy(rows);obj=bad[index]
            for key in path[:-1]:obj=obj[key]
            if missing:obj.pop(path[-1],None)
            else:obj[path[-1]]=value
            cases.append((label,bad,result))
        for index in (30,31):
            for key in ('parentUuid','sourceToolAssistantUUID'):
                for value in ('foreign',rows[5]['uuid'],rows[28 if index==31 else 29]['uuid'],None):field(f'{index}-{key}-{value}',index,[key],value)
                field(f'{index}-{key}-missing',index,[key],None,True)
            field(f'{index}-foreign-tool',index,['message','content',0,'tool_use_id'],'foreign')
            field(f'{index}-stale-tool',index,['message','content',0,'tool_use_id'],rows[5]['message']['content'][0]['id'])
            field(f'{index}-extra-block',index,['message','content'],rows[index]['message']['content']+[{'type':'text','text':'fabricated'}])
            field(f'{index}-meta',index,['isMeta'],False)
        field('mixed-parent',31,['parentUuid'],rows[30]['uuid'])
        field('duplicate-result',31,['message','content',0,'tool_use_id'],rows[28]['message']['content'][0]['id'])
        field('duplicate-tool',29,['message','content',0,'id'],rows[28]['message']['content'][0]['id'])
        field('stale-use',28,['message','content',0,'id'],rows[5]['message']['content'][0]['id'])
        for index in range(28,32):
            for key,value in (('cwd','foreign'),('sessionId','foreign'),('version','2.1.292'),('isSidechain',True),('uuid',rows[5]['uuid'])):field(f'{index}-{key}',index,[key],value)
        for key,value in (('requestId','foreign'),('apiBlockIndex',2),('apiBlockIndex',1),('apiBlockIndex',4),('effort','high'),('perTurnEffort','high'),('isApiErrorMessage',True)):
            field(f'a2-{key}-{value}',29,[key],value)
        for key,value in (('id','foreign'),('model','<synthetic>'),('stop_reason','end_turn'),('content',rows[29]['message']['content']+[{'type':'text','text':'fabricated'}])):field('a2-message-'+key,29,['message',key],value)
        for index in (28,29,30):field('wrong-next-anchor-'+str(index),32,['parentUuid'],rows[index]['uuid'])
        for version in ('2.1.295','2.1.297'):
            bad=copy.deepcopy(rows)
            for r in bad:
                if 'version' in r:r['version']=version
            cases.append((version,bad,result))
        for label,bad in [('missing-result',rows[:31]+rows[32:]),('missing-end',rows[:31]),('no-final',rows[:32]),('reversed',rows[:30]+[rows[31],rows[30]]+rows[32:]),('extra-result',rows[:32]+[copy.deepcopy(rows[31])]+rows[32:])]:cases.append((label,bad,result))
        cases.append(('final-mismatch',rows,{**result,'result':'wrong'}))
        for label,bad,out in cases:
            with self.subTest(defect=label):
                with self.assertRaises(c.Stop):c.validate(state,self.two_raw(state,bad),out)
        self.assertEqual(file.read_bytes(),original);self.assertEqual((c.STORE/self.worker/'session.json').read_bytes(),mapping);self.assertEqual(len(fake.calls),calls)

    def test_two_tool_raw_interposition_and_size(self):
        state,file,rows,result,fake=self.two_pending();sid=state['session_uuid']
        for gap in (29,30,31):
            for kind in ('custom-title','system','attachment','progress','user','reminder'):
                inserted={'type':kind,'sessionId':sid,'uuid':str(uuid.uuid4()),'parentUuid':rows[gap-1]['uuid'],'version':'2.1.296'}
                if kind=='custom-title':inserted={'type':kind,'sessionId':sid,'customTitle':'fabricated'}
                if kind in ('attachment','reminder'):
                    inserted=copy.deepcopy(rows[32]);inserted.update(uuid=str(uuid.uuid4()),parentUuid=rows[gap-1]['uuid'])
                if kind=='user':inserted['message']={'role':'user','content':'interleaved'}
                bad=copy.deepcopy(rows);bad.insert(gap,inserted)
                with self.subTest(gap=gap,kind=kind):
                    with self.assertRaises(c.Stop):c.validate(state,self.two_raw(state,bad),result)
        # Third outstanding use, nested/partial batch and previous outstanding obligation.
        for place in (28,30):
            bad=copy.deepcopy(rows);extra=copy.deepcopy(bad[28]);extra.update(uuid=str(uuid.uuid4()),parentUuid=bad[place-1]['uuid']);extra['message']['content'][0]['id']='extra-'+str(uuid.uuid4());extra['apiBlockIndex']=bad[29]['apiBlockIndex']+1
            bad.insert(place,extra)
            with self.assertRaises(c.Stop):c.validate(state,self.two_raw(state,bad),result)
        bad=copy.deepcopy(rows);bad[28]['parentUuid']=bad[26]['uuid'];del bad[27]
        with self.assertRaises(c.Stop):c.validate(state,self.two_raw(state,bad),result)
        # Otherwise coherent three-use source-parent batch is not a pair.
        bad=copy.deepcopy(rows);third=copy.deepcopy(bad[29]);third.update(uuid=str(uuid.uuid4()),parentUuid=bad[29]['uuid'],apiBlockIndex=4);third['message']['content'][0]['id']='third-'+str(uuid.uuid4())
        result3=copy.deepcopy(bad[31]);result3.update(uuid=str(uuid.uuid4()),parentUuid=third['uuid'],sourceToolAssistantUUID=third['uuid']);result3['message']['content'][0]['tool_use_id']=third['message']['content'][0]['id']
        bad[32]['parentUuid']=result3['uuid'];bad[28:32]=[bad[28],bad[29],third,bad[30],bad[31],result3]
        with self.assertRaisesRegex(c.Stop,'fresh attempt ancestry mismatch'):c.validate(state,self.two_raw(state,bad),result)
        # A second closed pair in the same message is structurally coherent but
        # rejected by the unchanged common native-message association validator.
        bad=copy.deepcopy(rows);pair=copy.deepcopy(rows[28:32]);pair[0].update(uuid=str(uuid.uuid4()),parentUuid=bad[31]['uuid'],apiBlockIndex=4);pair[1].update(uuid=str(uuid.uuid4()),parentUuid=pair[0]['uuid'],apiBlockIndex=5)
        for source,answer in zip(pair[:2],pair[2:]):
            tid='second-pair-'+str(uuid.uuid4());source['message']['content'][0]['id']=tid;answer.update(uuid=str(uuid.uuid4()),parentUuid=source['uuid'],sourceToolAssistantUUID=source['uuid']);answer['message']['content'][0]['tool_use_id']=tid
        bad[32]['parentUuid']=pair[-1]['uuid'];bad[32:32]=pair
        with self.assertRaisesRegex(c.Stop,'crossing is not one source-linked result'):c.validate(state,self.two_raw(state,bad),result)


    def two_reuse_cases(self,rows):
        cases=[]
        for location in (32,38,56):
            for reuse in ('both','message','request'):
                bad=copy.deepcopy(rows);r=copy.deepcopy(bad[29]);r.update(uuid=str(uuid.uuid4()),parentUuid=bad[31 if location==32 else (32 if location==38 else 50)]['uuid'],apiBlockIndex=4 if reuse=='both' else 0)
                r['message']['content'][0]['id']='fresh-'+str(uuid.uuid4())
                if reuse=='message':r['requestId']='new-'+str(uuid.uuid4())
                if reuse=='request':r['message']['id']='new-'+str(uuid.uuid4())
                answer=copy.deepcopy(bad[31]);answer.update(uuid=str(uuid.uuid4()),parentUuid=r['uuid'],sourceToolAssistantUUID=r['uuid']);answer['message']['content'][0]['tool_use_id']=r['message']['content'][0]['id']
                bad[location]['parentUuid']=answer['uuid'];bad[location:location]=[r,answer];cases.append((f'{location}-{reuse}',bad))
        return cases

    def test_two_tool_common_retirement_all_public_adoption_routes(self):
        # Accepted backup survives every refusal. Pending publication is expected.
        c._consult(self.worker,'prior accepted baseline',NativeFake());saved=(c.STORE/self.worker/'transcript.backup.jsonl').read_bytes();accepted=self.state()['last_ok_result']
        state,file,rows,result,fake=self.two_pending();original=file.read_bytes();root=c.STORE/self.worker;attempt=state['pending']['attempt_id'];receipt=(root/'last-process.json').read_bytes()
        for label,bad in self.two_reuse_cases(rows):
            raw=self.two_raw(state,bad)
            with self.subTest(case=label):
                with self.assertRaises(c.Stop):c.validate(state,raw,result)
                file.write_bytes(raw)
                with patch.object(c,'LIVE_ENABLED',True):
                    with self.assertRaises(c.Stop):c.recover(self.worker,'recover-completed')
                    high=copy.deepcopy(bad)
                    for r in high:
                        if r['type']=='assistant':r['effort']=r['perTurnEffort']='high'
                    highraw=self.two_raw(state,high);file.write_bytes(highraw)
                    with self.assertRaises(c.Stop):c.validate(state,highraw,result,expected_effort='high')
                    with self.assertRaises(c.Stop):c.recover(self.worker,'dispose-completed-high-probe',attempt,c.digest(highraw))
                    file.write_bytes(raw)
                    process=json.loads(receipt);process['code']=1;(root/'last-process.json').write_bytes(c.encoded(process))
                    with self.assertRaises(c.Stop):c.recover(self.worker,'dispose-terminal-oauth-failure',attempt,c.digest(raw))
                (root/'last-process.json').write_bytes(receipt)
                self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),saved);self.assertEqual(self.state()['last_ok_result'],accepted);self.assertIsNotNone(self.state()['pending'])
        file.write_bytes(original)
        # Genuine high probes still use caller-selected effort, never hardcoded xhigh.
        high=copy.deepcopy(rows)
        for r in high:
            if r['type']=='assistant':r['effort']=r['perTurnEffort']='high'
        self.assertEqual(c.validate(state,self.two_raw(state,high),result,expected_effort='high'),'tiny answer')
        with self.assertRaises(c.Stop):c.validate(state,self.two_raw(state,high),result)

    def test_two_tool_public_consult_reuse_and_batch_refusals(self):
        consult=c._consult
        for case in range(11):
            worker=str(uuid.uuid4())
            with patch.dict(os.environ,{'CODEX_THREAD_ID':worker}):
                c._consult(worker,'accepted mock baseline',NativeFake());root=c.STORE/worker
                prior=json.loads((root/'session.json').read_bytes());saved=(root/'transcript.backup.jsonl').read_bytes();sid=prior['session_uuid']
                fake=TwoToolNative296()
                def runner(argv,wire,env,cwd,path,job,timeout):
                    outcome=fake(argv,wire,env,cwd,path,job,timeout)
                    if '-p' in argv:
                        file=c.locate(sid);pending=json.loads((root/'session.json').read_bytes());offset=pending['pending']['offset'];raw=file.read_bytes();rows=c.parse_history(raw[offset:])
                        if case<9:rows=self.two_reuse_cases(rows)[case][1]
                        elif case==9:rows[31]['parentUuid']=rows[30]['uuid']
                        else:rows[30]['sourceToolAssistantUUID']='foreign'
                        file.write_bytes(raw[:offset]+b'\n'.join(json.dumps(r).encode() for r in rows)+b'\n')
                    return outcome
                with patch.object(c,'LIVE_ENABLED',True),patch.object(c,'_consult',side_effect=lambda w,p:consult(w,p,runner)):
                    with self.assertRaises(c.Stop):c.consult_claude(worker,'one rejected mock batch')
                after=json.loads((root/'session.json').read_bytes())
                self.assertIsNotNone(after['pending']);self.assertEqual(after['session_uuid'],sid);self.assertEqual(after['last_ok_result'],prior['last_ok_result']);self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),saved)
                self.assertEqual(sum('-p' in call[0] for call in fake.calls),1)

    def test_two_tool_public_success_recovery_high_and_failure_preservation(self):
        fake=TwoToolNative296()
        consult=c._consult
        with patch.object(c,'LIVE_ENABLED',True),patch.object(c,'_consult',side_effect=lambda worker,prompt:consult(worker,prompt,fake)):
            self.assertEqual(c.consult_claude(self.worker,'new complete batch'),'tiny answer')
        sid=self.state()['session_uuid'];root=c.STORE/self.worker;backup=(root/'transcript.backup.jsonl').read_bytes();last=self.state()['last_ok_result']
        fake.effort='high'
        with self.assertRaises(c.Stop):c._consult(self.worker,'explicit high probe batch',fake)
        state=self.state();data=c.read(c.locate(sid));attempt=state['pending']['attempt_id']
        rows=c.parse_history(data[state['pending']['offset']:]);prior_tool=next(x['id'] for r in c.parse_history(backup) if r['type']=='assistant' for x in r['message']['content'] if x['type']=='tool_use')
        rows[28]['message']['content'][0]['id']=prior_tool
        with self.assertRaisesRegex(c.Stop,'ambiguous tool-use identity'):c.validate(state,self.two_raw(state,rows),json.loads((root/'stdout.json').read_bytes()),expected_effort='high')

        with patch.object(c,'LIVE_ENABLED',True):self.assertIn('no answer accepted',c.recover(self.worker,'dispose-completed-high-probe',attempt,c.digest(data)))
        self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),backup);self.assertEqual(self.state()['last_ok_result'],last)
        fake.effort='xhigh'
        with patch.object(c,'finish',side_effect=c.Stop('retained completed batch')):
            with self.assertRaises(c.Stop):c._consult(self.worker,'next xhigh batch',fake)
        state=self.state();receipt=(root/'last-process.json').read_bytes()
        for key,value in (('code',1),('tree_gone',False),('actual_eof',False),('attempt_id','foreign')):
            process=json.loads(receipt);process[key]=value;(root/'last-process.json').write_bytes(c.encoded(process))
            with patch.object(c,'LIVE_ENABLED',True):
                with self.assertRaises(c.Stop):c.recover(self.worker,'recover-completed')
            self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),backup);self.assertIsNotNone(self.state()['pending'])
        (root/'last-process.json').write_bytes(receipt)
        with patch.object(c,'LIVE_ENABLED',True),patch.object(c,'tree_gone',return_value=False):
            with self.assertRaises(c.Stop):c.recover(self.worker,'recover-completed')
        with patch.object(c,'LIVE_ENABLED',True):self.assertEqual(c.recover(self.worker,'recover-completed'),'tiny answer')
        self.assertEqual(self.state()['session_uuid'],sid);self.assertIsNone(self.state()['pending'])

    def test_owned_job_normal_timeout_tree_and_wrapper_crash(self):
        root=self.root/'process';root.mkdir();name='Local\\OB64Consult-test-'+str(uuid.uuid4())
        result=c.run_owned([sys.executable,'-c','print("tiny")'],b'',dict(os.environ),self.root,root,name,5)
        self.assertTrue(result['tree_gone']);self.assertEqual(result.get('code'),0);self.assertEqual((root/'stdout.json').read_text().strip(),'tiny')
        code='import subprocess,sys,time; subprocess.Popen([sys.executable,"-c","import time;time.sleep(20)"]);print("started",flush=True);time.sleep(20)'
        result=c.run_owned([sys.executable,'-c',code],b'',dict(os.environ),self.root,root,name+'-timeout',.3)
        self.assertTrue(result['tree_gone']);self.assertTrue(result['actual_eof']);self.assertNotEqual(result['status'],'eof')
        crashroot=self.root/'crash';crashroot.mkdir();job=name+'-crash';marker=self.root/'child-started'
        child_code='from pathlib import Path;import time;Path('+repr(str(marker))+').write_text("started");time.sleep(20)'
        wrapper='import sys,os,threading;from pathlib import Path;sys.path.insert(0,sys.argv[1]);import consult_claude as c;threading.Timer(.6,lambda:os._exit(23)).start();c.run_owned([sys.executable,"-c",sys.argv[4]],b"",dict(os.environ),Path(sys.argv[2]),Path(sys.argv[2]),sys.argv[3],20)'
        child=subprocess.run([sys.executable,'-c',wrapper,str(Path(c.__file__).parent),str(crashroot),job,child_code],timeout=10)
        self.assertEqual(child.returncode,23);self.assertTrue(marker.exists())
        deadline=time.monotonic()+5
        while not c.tree_gone(job) and time.monotonic()<deadline:time.sleep(.05)
        self.assertTrue(c.tree_gone(job))

if __name__=='__main__':unittest.main(verbosity=2)
