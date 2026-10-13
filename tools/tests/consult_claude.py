import copy,inspect,json,os,subprocess,sys,tempfile,time,unittest,uuid
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import consult_claude as c
ROOT=Path(tempfile.mkdtemp(prefix='consultation-offline-',dir=os.environ.get('OB64_CONSULT_TEST_ROOT',str(Path(__file__).resolve().parents[2]))))

class Fake:
    def __init__(self):self.calls=[];self.sessions={};self.auth='claude.ai';self.mode='success';self.extra={};self.code=0
    def __call__(self,argv,wire,env,cwd,root,job,timeout):
        self.calls.append((argv,wire,env,cwd,root,job))
        if 'auth' in argv:
            c.atomic(root/'stdout.json',c.encoded({'loggedIn':True,'authMethod':self.auth,'apiProvider':'firstParty','subscriptionType':'max'}))
            return {'status':'eof','code':0,'tree_gone':True,'actual_eof':True}
        sid=argv[-1]
        state=json.loads((c.STORE/os.environ['CODEX_THREAD_ID']/'session.json').read_bytes())
        assert state['possible_launch'] and state['pending']['job_name']==job and state['session_uuid']==sid
        if '--session-id' in argv:assert sid not in self.sessions;self.sessions[sid]=[]
        self.sessions.setdefault(sid,[]).append(wire.decode('utf-8'))
        c.atomic(root/'stdin.txt',wire);c.atomic(root/'stderr.txt',b'')
        result={'type':'result','subtype':'success','is_error':False,'session_id':sid,'result':'tiny answer','modelUsage':{c.MODEL:{'outputTokens':12,'canonicalModel':c.MODEL},'auxiliary-small-model':{'outputTokens':3}},'futureMetadata':{'unknown':'tolerated'}}
        if self.mode=='wrong-session':result['session_id']=str(uuid.uuid4())
        if self.mode=='empty':result['result']=' '
        if self.mode=='error':result.update(subtype='error_max_turns',is_error=True)
        if self.mode=='wrong-model':result['modelUsage']={'other':{'outputTokens':12}}
        if self.mode=='absent-model':result.pop('modelUsage')
        result.update(self.extra);c.atomic(root/'stdout.json',b'not json' if self.mode=='malformed' else c.encoded(result))
        if self.mode=='raise':raise OSError('fabricated pre-spawn failure')
        if self.mode=='timeout':return {'status':'failed','code':99,'tree_gone':True,'actual_eof':True,'error':'timeout'}
        return {'status':'eof','code':self.code,'tree_gone':True,'actual_eof':True}

class Tests(unittest.TestCase):
    def setUp(self):
        self.root=Path(tempfile.mkdtemp(dir=ROOT));self.worker=str(uuid.uuid4());self.fake=Fake();self.exe=self.root/'fake.exe';self.exe.write_bytes(b'not executable')
        self.patches=[patch.object(c,'LIVE_ENABLED',False),patch.object(c,'EXE',str(self.exe)),patch.object(c,'STORE',self.root/'store'),patch.object(c,'CWD',self.root),patch.object(c,'CONFIG',self.root/'config'),patch.object(c,'MEMORY',self.root/'memory'),patch.object(c,'managed_policy_guard'),patch.dict(os.environ,{'CODEX_THREAD_ID':self.worker})]
        for p in self.patches:p.start()
    def tearDown(self):
        for p in reversed(self.patches):p.stop()
    def state(self):return json.loads((c.STORE/self.worker/'session.json').read_bytes())
    def call(self,prompt='a new question'):return c._consult(self.worker,prompt,self.fake)
    def pending(self):
        with patch.object(c,'completed',side_effect=c.Stop('retain completed mock')):
            with self.assertRaises(c.Stop):self.call()
        return self.state()
    def test_create_resume_context_and_distinct_workers(self):
        self.assertEqual(self.call('first context'),'tiny answer');sid=self.state()['session_uuid'];self.call('recall context')
        self.assertEqual(self.state()['session_uuid'],sid);calls=[a for a,*_ in self.fake.calls if '-p' in a];self.assertIn('--session-id',calls[0]);self.assertIn('--resume',calls[1]);self.assertEqual(self.fake.sessions[sid],['first context','recall context'])
        other=str(uuid.uuid4())
        with patch.dict(os.environ,{'CODEX_THREAD_ID':other}):c._consult(other,'other context',self.fake)
        self.assertEqual(len(self.fake.sessions),2)
    def test_identity_claims_locks_and_missing_mapping(self):
        with self.assertRaises(c.Stop):c._consult(str(uuid.uuid4()),'wrong',self.fake)
        self.call();root=c.STORE/self.worker;old=self.state()
        with c.WorkerLock(root/'owner.lock'):
            with self.assertRaises(c.Stop):self.call('locked')
            other=str(uuid.uuid4())
            with patch.dict(os.environ,{'CODEX_THREAD_ID':other}):c._consult(other,'independent',self.fake)
        (root/'session.json').unlink()
        with self.assertRaises(c.Stop):self.call('do not re-pair')
        self.assertEqual(json.loads((c.STORE/'owners'/(old['session_uuid']+'.json')).read_bytes())['worker_id'],self.worker)
    def test_cross_worker_claim_refused(self):
        self.call();state=self.state();other=str(uuid.uuid4());root=c.STORE/other;root.mkdir();state['worker_id']=other;c.atomic(root/'session.json',c.encoded(state))
        with patch.dict(os.environ,{'CODEX_THREAD_ID':other}):
            with self.assertRaises(c.Stop):c._consult(other,'stolen session',self.fake)
    def test_subscription_environment_and_explicit_flags(self):
        with patch.dict(os.environ,{'ANTHROPIC_API_KEY':'fake-secret','CLAUDE_CODE_USE_VERTEX':'1','CLAUDE_CODE_EFFORT_LEVEL':'low'}):self.call()
        auth,model=self.fake.calls
        self.assertEqual(auth[2],model[2]);self.assertEqual(auth[3],model[3]);env=model[2];argv=model[0]
        self.assertNotIn('ANTHROPIC_API_KEY',env);self.assertNotIn('CLAUDE_CODE_USE_VERTEX',env);self.assertEqual(env['CLAUDE_CODE_EFFORT_LEVEL'],'xhigh');self.assertEqual(env['CLAUDE_CONFIG_DIR'],str(c.CONFIG))
        for flag,value in [('--model',c.MODEL),('--effort','xhigh'),('--tools','Read,Grep,Glob'),('--permission-mode','dontAsk')]:self.assertEqual(argv[argv.index(flag)+1],value)
        for flag in ('--restricted','--safe-mode','--strict-mcp-config'):self.assertIn(flag,argv);self.assertIn(flag,auth[0]) if flag!='--strict-mcp-config' else None
        for flag in ('--max-turns','--version','--fallback-model','--continue','--fork-session'):self.assertNotIn(flag,argv)
        self.fake.auth='api_key'
        with self.assertRaises(c.Stop):self.call('rejected auth')
        self.assertEqual(sum('-p' in x[0] for x in self.fake.calls),1)
    def test_preflight_failure_same_unlaunched_uuid(self):
        self.fake.auth='api_key'
        with self.assertRaises(c.Stop):self.call()
        old=self.state();self.assertFalse(old['possible_launch']);self.assertIsNone(old['pending'])
        self.fake.auth='claude.ai';self.call();self.assertEqual(self.state()['session_uuid'],old['session_uuid']);self.assertIn('--session-id',self.fake.calls[-1][0])
    def test_possible_launch_failure_abandon_new_prompt_resume_only(self):
        self.fake.mode='raise'
        with self.assertRaises(OSError):self.call('uncertain original')
        state=self.state();sid=state['session_uuid'];self.assertTrue(state['possible_launch']);count=len(self.fake.calls)
        with self.assertRaises(c.Stop):self.call('blocked pending')
        self.assertEqual(len(self.fake.calls),count)
        with patch.object(c,'tree_gone',return_value=False):
            with self.assertRaises(c.Stop):c._recover(self.worker,'abandon-pending')
        c._recover(self.worker,'abandon-pending')
        with self.assertRaises(c.Stop):self.call('uncertain original')
        self.fake.mode='success';self.call('distinct new question');self.assertEqual(self.state()['session_uuid'],sid);self.assertIn('--resume',self.fake.calls[-1][0]);self.assertNotIn('--session-id',self.fake.calls[-1][0])
    def test_completed_recovery_zero_calls_and_once(self):
        state=self.pending();count=len(self.fake.calls)
        with patch.object(c,'LIVE_ENABLED',True):self.assertEqual(c.recover(self.worker,'recover-completed'),'tiny answer')
        self.assertEqual(len(self.fake.calls),count);self.assertIsNone(self.state()['pending'])
        with self.assertRaises(c.Stop):c._recover(self.worker,'recover-completed')
        self.assertEqual(self.state()['session_uuid'],state['session_uuid'])
    def test_errors_do_not_accept_or_resend(self):
        for mode in ('wrong-session','empty','error','wrong-model','malformed','timeout'):
            with self.subTest(mode=mode):
                self.fake.mode=mode
                with self.assertRaises(c.Stop):self.call('question '+mode)
                state=self.state();self.assertIsNotNone(state['pending']);self.assertNotIn('last_ok_result',state)
                with self.assertRaises(c.Stop):c._recover(self.worker,'recover-completed')
                c._recover(self.worker,'abandon-pending')
        self.fake.mode='success';self.fake.code=1
        with self.assertRaises(c.Stop):self.call('nonzero success-looking result')
    def test_result_optional_usage_and_auxiliary_keys(self):
        self.call('auxiliary keys allowed');self.fake.mode='absent-model';self.call('no usage allowed')
        for usage in ({},[],{c.MODEL:{'outputTokens':0}},{c.MODEL:{'outputTokens':True}},{c.MODEL:{'outputTokens':12,'canonicalModel':'other'}}):
            state={'session_uuid':'bound'};out={'type':'result','subtype':'success','is_error':False,'session_id':'bound','result':'answer','modelUsage':usage}
            with self.assertRaises(c.Stop):c.result_answer(state,out)
    def test_wrong_stale_live_receipt_and_known_high_request(self):
        state=self.pending();folder=c.attempt_root(c.STORE/self.worker,state['pending']);original=(folder/'last-process.json').read_bytes()
        for key,value in [('attempt_id','old'),('job_name','other'),('code',True),('code',1),('actual_eof',False),('tree_gone',False),('requested_effort','high')]:
            receipt=json.loads(original);receipt[key]=value;c.atomic(folder/'last-process.json',c.encoded(receipt))
            with self.assertRaises(c.Stop):c._recover(self.worker,'recover-completed')
            self.assertIsNotNone(self.state()['pending'])
        c.atomic(folder/'last-process.json',original)
        with patch.object(c,'tree_gone',return_value=False):
            with self.assertRaises(c.Stop):c._recover(self.worker,'recover-completed')
        state['pending']['requested_effort']='high';c.atomic(c.STORE/self.worker/'session.json',c.encoded(state))
        with self.assertRaises(c.Stop):c._recover(self.worker,'recover-completed')
    def legacy_pending(self):
        state=self.pending();root=c.STORE/self.worker;folder=c.attempt_root(root,state['pending'])
        for name in ('stdin.txt','stdout.json','stderr.txt','last-process.json'):c.atomic(root/name,(folder/name).read_bytes())
        state['pending'].pop('artifacts');state['pending'].pop('requested_effort');state.pop('possible_launch');state.update(history_sha256='old-historical-value',backup_sha256='old-historical-value',transcript='opaque-native-location')
        c.atomic(root/'session.json',c.encoded(state));c.atomic(root/'transcript.backup.jsonl',b'opaque historical bytes')
        return state,root
    def test_legacy_pending_recovery_and_ready_opaque_migration(self):
        state,root=self.legacy_pending();backup=(root/'transcript.backup.jsonl').read_bytes();count=len(self.fake.calls)
        self.assertEqual(c._recover(self.worker,'recover-completed'),'tiny answer');self.assertEqual(len(self.fake.calls),count);self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),backup)
        migrated=self.state();migrated.pop('possible_launch');c.atomic(root/'session.json',c.encoded(migrated));self.call('after opaque manual history changed')
        self.assertIn('--resume',self.fake.calls[-1][0]);self.assertEqual(self.state()['session_uuid'],state['session_uuid']);self.assertEqual((root/'transcript.backup.jsonl').read_bytes(),backup)
    def test_legacy_abandon_retains_files_and_last_answer(self):
        state,root=self.legacy_pending();original={n:(root/n).read_bytes() for n in ('stdin.txt','stdout.json','stderr.txt','last-process.json','transcript.backup.jsonl')};state['last_ok_result']={'retained':'old'};c.atomic(root/'session.json',c.encoded(state))
        c._recover(self.worker,'abandon-pending');self.assertEqual(self.state()['last_ok_result'],{'retained':'old'})
        archive=root/'attempts'/state['pending']['attempt_id']
        for n in ('stdin.txt','stdout.json','stderr.txt','last-process.json'):self.assertEqual((archive/n).read_bytes(),original[n])
        self.call('distinct after legacy abandonment')
        for n,data in original.items():self.assertEqual((root/n).read_bytes(),data)
    def test_atomic_failures_preserve_pending_and_never_dispatch(self):
        original=c.atomic
        def fail_pending(path,data):
            if path.name=='session.json' and json.loads(data).get('pending'):raise OSError('pending commit failed')
            return original(path,data)
        with patch.object(c,'atomic',side_effect=fail_pending):
            with self.assertRaises(OSError):self.call()
        self.assertFalse(any('-p' in call[0] for call in self.fake.calls))
        state=self.pending();root=c.STORE/self.worker
        def fail_ready(path,data):
            if path.name=='session.json' and json.loads(data).get('state')=='ready':raise OSError('ready commit failed')
            return original(path,data)
        with patch.object(c,'atomic',side_effect=fail_ready):
            with self.assertRaises(OSError):c._recover(self.worker,'recover-completed')
            with self.assertRaises(OSError):c._recover(self.worker,'abandon-pending')
        self.assertIsNotNone(self.state()['pending']);c._recover(self.worker,'abandon-pending');self.assertIsNone(self.state()['pending'])
    def test_manual_unknown_history_is_not_read(self):
        self.call();state=self.state();root=c.STORE/self.worker;state['transcript']='nonexistent opaque file';state['backup_sha256']='wrong historical hash';c.atomic(root/'session.json',c.encoded(state));self.call('manual inspection is opaque')
        self.assertIn('--resume',self.fake.calls[-1][0])
        for removed in ('parse_history','attempt_records','two_tool_window','admit_idle_suffix','version_preflight'):self.assertFalse(hasattr(c,removed))
    def test_main_utf8_and_bom_offline_subprocess(self):
        code=r'''
import importlib.util,sys,os
spec=importlib.util.spec_from_file_location('adapter',sys.argv[1]);c=importlib.util.module_from_spec(spec);before=sys.stdout.encoding;spec.loader.exec_module(c);assert sys.stdout.encoding==before
calls=[]
def consult(w,p):assert p=='question ä¸­æ–‡';calls.append(p);return 'answer â†’ â€” ä¸­æ–‡ Î±\nline'
c.consult_claude=consult;c.run_owned=lambda *a:(_ for _ in ()).throw(AssertionError('no real launch'))
sys.argv=['adapter'];c.main();assert len(calls)==1
'''
        env=os.environ.copy();env['PYTHONIOENCODING']='cp1252';env['PYTHONUTF8']='0'
        result=subprocess.run([sys.executable,'-c',code,c.__file__],input=b'\xef\xbb\xbf'+ 'question ä¸­æ–‡'.encode(),stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env,timeout=10)
        self.assertEqual(result.returncode,0,result.stderr);self.assertEqual(result.stdout,'answer â†’ â€” ä¸­æ–‡ Î±\nline\n'.encode('utf-8'))

    def test_public_entry_and_guard_refusal(self):
        with self.assertRaises(c.Stop):c.consult_claude(self.worker,'disabled')
        original=c._consult
        with patch.object(c,'LIVE_ENABLED',True),patch.object(c,'_consult',side_effect=lambda w,p:original(w,p,self.fake)):
            self.assertEqual(c.consult_claude(self.worker,'public mocked entry'),'tiny answer')
        before=len(self.fake.calls)
        with patch.object(c,'managed_policy_guard',side_effect=c.Stop('managed provider unknown')):
            with self.assertRaises(c.Stop):self.call('blocked configuration')
        self.assertEqual(len(self.fake.calls),before)

    def test_abandon_copy_failure_and_conflict_preserve_pending(self):
        state,root=self.legacy_pending();archive=root/'attempts'/state['pending']['attempt_id'];saved=(root/'stdout.json').read_bytes();(archive/'stdout.json').unlink();original=c.atomic
        def fail_copy(path,data):
            if path==archive/'stdout.json':raise OSError('archive write failed')
            return original(path,data)
        with patch.object(c,'atomic',side_effect=fail_copy):
            with self.assertRaises(OSError):c._recover(self.worker,'abandon-pending')
        self.assertIsNotNone(self.state()['pending']);self.assertEqual((root/'stdout.json').read_bytes(),saved)
        c.atomic(archive/'stdout.json',b'conflicting retained bytes')
        with self.assertRaises(c.Stop):c._recover(self.worker,'abandon-pending')
        self.assertIsNotNone(self.state()['pending']);self.assertEqual((root/'stdout.json').read_bytes(),saved)

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
