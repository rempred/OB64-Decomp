"""One read-only Claude session per inherited worker. Standard library, Windows only.
Native history is opaque Claude-owned persistence.
"""
import argparse,ctypes,hashlib,json,math,msvcrt,os,subprocess,time,uuid,winreg
from ctypes import wintypes as W
from pathlib import Path

LIVE_ENABLED=True
MODEL='claude-opus-5-5';EFFORT='xhigh'
CWD=Path(r'C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp')
CONFIG=Path(r'C:\Users\Joe\.claude')
EXE=r'C:\Users\Joe\.local\bin\claude.exe'
STORE=Path(r'C:\Users\Joe\.local\share\ob64-claude-consult')
MEMORY=CONFIG/'projects/C--Users-Joe-Projects-OgreBattlel64-OB64-Decomp/memory'
MAX_PROMPT=1024**2;MAX_OUTPUT=4*1024**2;MAX_FILE=4*1024**2
ROLE='Read-only OB64 consultant. Sol owns edits and experiments. Do not write, execute shell, delegate, access credentials or contact others. Give source-bound advice and state uncertainty.'
class Stop(RuntimeError):pass

def digest(data):return hashlib.sha256(data).hexdigest()
def encoded(value):return json.dumps(value,sort_keys=True,indent=2).encode('utf-8')+b'\n'
def worker_id(explicit=None):
    value=os.environ.get('CODEX_THREAD_ID','')
    try:
        if str(uuid.UUID(value))!=value:raise ValueError()
    except ValueError:raise Stop('missing/noncanonical inherited CODEX_THREAD_ID')
    if explicit is not None and explicit!=value:raise Stop('worker ID must match inherited identity')
    return value

def plain(path):
    path=Path(path).absolute()
    for q in reversed((path,*path.parents)):
        if not os.path.lexists(q):continue
        s=q.lstat()
        if s.st_file_attributes&0x400:raise Stop('reparse path refused')
    if path.exists() and path.is_file() and path.stat().st_nlink!=1:raise Stop('hardlinked file refused')
    return path

def read(path,limit=MAX_FILE):
    path=plain(path)
    if path.stat().st_size>limit:raise Stop('bounded file size exceeded')
    with path.open('rb') as f:
        data=f.read(limit+1)
    if len(data)>limit:raise Stop('bounded read exceeded')
    return data

def atomic(path,data):
    path=plain(path);temporary=path.with_name(path.name+'.pending-'+str(uuid.uuid4()))
    with temporary.open('xb') as f:f.write(data);f.flush();os.fsync(f.fileno())
    os.replace(temporary,path) # Any failed temp stays recoverable; never overwrite backup on invalid answer.

class WorkerLock:
    def __init__(self,path):self.path=plain(path)
    def __enter__(self):
        self.file=self.path.open('a+b');self.file.seek(0)
        if self.path.stat().st_size==0:self.file.write(b'0');self.file.flush()
        self.file.seek(0)
        try:msvcrt.locking(self.file.fileno(),msvcrt.LK_NBLCK,1)
        except OSError:self.file.close();raise Stop('worker already owned')
        return self
    def __exit__(self,*_):
        self.file.seek(0);msvcrt.locking(self.file.fileno(),msvcrt.LK_UNLCK,1);self.file.close()

# An atomic CreateProcess JOB_LIST attribute prevents spawn-before-assignment escape.
# Job handle is noninheritable. Last wrapper handle closure kills the whole owned tree.
K=ctypes.WinDLL('kernel32',use_last_error=True)
class BasicLimits(ctypes.Structure):
    _fields_=[('processTime',ctypes.c_longlong),('jobTime',ctypes.c_longlong),('flags',W.DWORD),('minWS',ctypes.c_size_t),('maxWS',ctypes.c_size_t),('activeLimit',W.DWORD),('affinity',ctypes.c_size_t),('priority',W.DWORD),('scheduling',W.DWORD)]
class IO(ctypes.Structure):_fields_=[(n,ctypes.c_ulonglong) for n in ('readOps','writeOps','otherOps','readBytes','writeBytes','otherBytes')]
class Limits(ctypes.Structure):_fields_=[('basic',BasicLimits),('io',IO),('processMem',ctypes.c_size_t),('jobMem',ctypes.c_size_t),('peakProcess',ctypes.c_size_t),('peakJob',ctypes.c_size_t)]
class Accounting(ctypes.Structure):_fields_=[('user',ctypes.c_longlong),('kernel',ctypes.c_longlong),('periodUser',ctypes.c_longlong),('periodKernel',ctypes.c_longlong),('faults',W.DWORD),('total',W.DWORD),('active',W.DWORD),('terminated',W.DWORD)]
class Startup(ctypes.Structure):
    _fields_=[('cb',W.DWORD),('reserved',W.LPWSTR),('desktop',W.LPWSTR),('title',W.LPWSTR),('x',W.DWORD),('y',W.DWORD),('xs',W.DWORD),('ys',W.DWORD),('xc',W.DWORD),('yc',W.DWORD),('fill',W.DWORD),('flags',W.DWORD),('show',W.WORD),('reservedSize',W.WORD),('reservedPtr',ctypes.c_void_p),('stdin',W.HANDLE),('stdout',W.HANDLE),('stderr',W.HANDLE)]
class StartupEx(ctypes.Structure):_fields_=[('startup',Startup),('attributes',ctypes.c_void_p)]
class ProcessInfo(ctypes.Structure):_fields_=[('process',W.HANDLE),('thread',W.HANDLE),('pid',W.DWORD),('tid',W.DWORD)]
for name,args,result in [
 ('CreateJobObjectW',[ctypes.c_void_p,W.LPCWSTR],W.HANDLE),('OpenJobObjectW',[W.DWORD,W.BOOL,W.LPCWSTR],W.HANDLE),
 ('CloseHandle',[W.HANDLE],W.BOOL),('SetInformationJobObject',[W.HANDLE,ctypes.c_int,ctypes.c_void_p,W.DWORD],W.BOOL),
 ('QueryInformationJobObject',[W.HANDLE,ctypes.c_int,ctypes.c_void_p,W.DWORD,ctypes.c_void_p],W.BOOL),('TerminateJobObject',[W.HANDLE,W.UINT],W.BOOL),
 ('InitializeProcThreadAttributeList',[ctypes.c_void_p,W.DWORD,W.DWORD,ctypes.POINTER(ctypes.c_size_t)],W.BOOL),
 ('UpdateProcThreadAttribute',[ctypes.c_void_p,W.DWORD,ctypes.c_size_t,ctypes.c_void_p,ctypes.c_size_t,ctypes.c_void_p,ctypes.c_void_p],W.BOOL),
 ('DeleteProcThreadAttributeList',[ctypes.c_void_p],None),
 ('CreateProcessW',[W.LPCWSTR,W.LPWSTR,ctypes.c_void_p,ctypes.c_void_p,W.BOOL,W.DWORD,ctypes.c_void_p,W.LPCWSTR,ctypes.c_void_p,ctypes.c_void_p],W.BOOL),
 ('WaitForSingleObject',[W.HANDLE,W.DWORD],W.DWORD),('GetExitCodeProcess',[W.HANDLE,ctypes.POINTER(W.DWORD)],W.BOOL)]:
    getattr(K,name).argtypes=args;getattr(K,name).restype=result

def check(ok):
    if not ok:raise ctypes.WinError(ctypes.get_last_error())
def active(job):
    a=Accounting();check(K.QueryInformationJobObject(job,1,ctypes.byref(a),ctypes.sizeof(a),None));return a.active

def tree_gone(name):
    h=K.OpenJobObjectW(4,False,name)
    if not h:
        if ctypes.get_last_error()==2:return True
        raise ctypes.WinError(ctypes.get_last_error())
    try:return active(h)==0
    finally:K.CloseHandle(h)

def run_owned(argv,input_bytes,env,cwd,root,job_name,timeout=900):
    """No PID-based termination; output kept separately, one current attempt only."""
    job=K.CreateJobObjectW(None,job_name)
    if not job:raise ctypes.WinError(ctypes.get_last_error())
    if ctypes.get_last_error()==183:K.CloseHandle(job);raise Stop('owned job name collision')
    handles=[];files=[];attributes=None;pi=ProcessInfo();answer={'actual_eof':False,'tree_gone':False,'status':'failed'}
    try:
        limits=Limits();limits.basic.flags=0x2000;check(K.SetInformationJobObject(job,9,ctypes.byref(limits),ctypes.sizeof(limits)))
        atomic(root/'stdin.txt',input_bytes)
        for name,mode in [('stdin.txt','rb'),('stdout.json','wb'),('stderr.txt','wb')]:
            f=plain(root/name).open(mode);files.append(f);h=msvcrt.get_osfhandle(f.fileno());os.set_handle_inheritable(h,True);handles.append(h)
        size=ctypes.c_size_t();K.InitializeProcThreadAttributeList(None,2,0,ctypes.byref(size));attributes=ctypes.create_string_buffer(size.value)
        check(K.InitializeProcThreadAttributeList(attributes,2,0,ctypes.byref(size)))
        jobs=(W.HANDLE*1)(job);inherited=(W.HANDLE*3)(*handles)
        check(K.UpdateProcThreadAttribute(attributes,0,0x2000D,jobs,ctypes.sizeof(jobs),None,None))
        check(K.UpdateProcThreadAttribute(attributes,0,0x20002,inherited,ctypes.sizeof(inherited),None,None))
        si=StartupEx();si.startup.cb=ctypes.sizeof(si);si.startup.flags=0x100;si.startup.stdin,si.startup.stdout,si.startup.stderr=handles;si.attributes=ctypes.addressof(attributes)
        command=ctypes.create_unicode_buffer(subprocess.list2cmdline(argv));environment=ctypes.create_unicode_buffer('\0'.join(k+'='+v for k,v in sorted(env.items()))+'\0\0')
        check(K.CreateProcessW(argv[0],command,None,None,True,0x80000|0x8000000|0x400,environment,str(cwd),ctypes.byref(si),ctypes.byref(pi)))
        K.CloseHandle(pi.thread);pi.thread=None;deadline=time.monotonic()+timeout
        while K.WaitForSingleObject(pi.process,100)==258:
            if time.monotonic()>=deadline:raise Stop('timeout')
            if any((root/n).stat().st_size>MAX_OUTPUT for n in ('stdout.json','stderr.txt')):raise Stop('output limit')
        if any((root/n).stat().st_size>MAX_OUTPUT for n in ('stdout.json','stderr.txt')):raise Stop('output limit')
        code=W.DWORD();check(K.GetExitCodeProcess(pi.process,ctypes.byref(code)));answer.update(actual_eof=True,code=code.value,status='eof')
    except BaseException as error:answer['error']=type(error).__name__+': '+str(error)
    finally:
        try:
            if active(job):check(K.TerminateJobObject(job,99))
            deadline=time.monotonic()+5
            while active(job) and time.monotonic()<deadline:time.sleep(.05)
            answer['tree_gone']=active(job)==0
            if not answer['tree_gone']:answer['status']='stop-unconfirmed'
            if pi.process:answer['actual_eof']=K.WaitForSingleObject(pi.process,5000)==0
            if not answer['actual_eof'] and pi.process:answer['status']='stop-unconfirmed'
        except BaseException as error:answer.update(status='stop-unconfirmed',termination_error=type(error).__name__)
        for h in handles:
            try:os.set_handle_inheritable(h,False)
            except OSError:answer.update(status='failed',cleanup_error='handle inheritance reset failed')
        for f in files:
            try:f.close()
            except OSError:answer.update(status='failed',cleanup_error='stdio close failed')
        try:
            if attributes:K.DeleteProcThreadAttributeList(attributes)
            if pi.process:K.CloseHandle(pi.process)
        finally:
            if not K.CloseHandle(job):answer.update(status='stop-unconfirmed',cleanup_error='job close unconfirmed')
    return answer

def managed_policy_guard():
    # Presence only: never read a policy value, file contents or credential store.
    # Reject all managed policy, including benign/unknown policy, rather than interpreting it.
    for directory in (Path(r'C:\Program Files\ClaudeCode'),Path(r'C:\ProgramData\ClaudeCode')):
        plain(directory)
        for name in ('managed-settings.json','managed-settings.d','managed-mcp.json'):
            try:os.lstat(directory/name)
            except FileNotFoundError:continue
            except OSError:raise Stop('managed policy presence unknown')
            raise Stop('managed policy source present; reviewed absence required')
    plain(CONFIG)
    try:os.lstat(CONFIG/'remote-settings.json')
    except FileNotFoundError:pass
    except OSError:raise Stop('remote policy presence unknown')
    else:raise Stop('remote policy cache present; no model launch')
    for hive in (winreg.HKEY_LOCAL_MACHINE,winreg.HKEY_CURRENT_USER):
        for view in (winreg.KEY_WOW64_64KEY,winreg.KEY_WOW64_32KEY):
            try:key=winreg.OpenKey(hive,r'SOFTWARE\Policies\ClaudeCode',0,winreg.KEY_READ|view)
            except FileNotFoundError:continue
            except OSError:raise Stop('managed registry presence unknown')
            else:key.Close();raise Stop('managed registry policy present; no values read')

def child_env():
    allowed=('SystemRoot','WINDIR','TEMP','TMP','PATH','PATHEXT','USERPROFILE','LOCALAPPDATA','APPDATA','HOMEDRIVE','HOMEPATH')
    env={k:os.environ[k] for k in allowed if k in os.environ}
    env['CLAUDE_CODE_EFFORT_LEVEL']=EFFORT;env['CLAUDE_CONFIG_DIR']=str(CONFIG)
    return env

def load_state(root,worker):
    file=root/'session.json'
    if file.exists():
        try:state=json.loads(read(file,1024**2))
        except (ValueError,OSError):raise Stop('corrupt mapping; explicit recovery required')
        if any(state.get(k)!=v for k,v in {'worker_id':worker,'cwd':str(CWD),'config':str(CONFIG),'model':MODEL,'effort':EFFORT}.items()):raise Stop('foreign mapping')
        try:uuid.UUID(state['session_uuid'])
        except (ValueError,KeyError):raise Stop('malformed session UUID')
    else:
        if any(q.name!='owner.lock' for q in root.iterdir()):raise Stop('mapping missing with retained artifacts; explicit recovery required')
        owners=plain(STORE/'owners')
        if owners.exists():
            for claim in owners.glob('*.json'):
                if json.loads(read(claim,1024)).get('worker_id')==worker:raise Stop('mapping missing for existing worker UUID')
        state=dict(worker_id=worker,session_uuid=str(uuid.uuid4()),cwd=str(CWD),config=str(CONFIG),model=MODEL,effort=EFFORT,state='creating',possible_launch=False,created_ts=time.time(),transcript=None,pending=None)
        atomic(file,encoded(state)) # UUID durable before any creation or ownership claim.
    owners=plain(STORE/'owners');owners.mkdir(exist_ok=True)
    for previous in owners.glob('*.json'):
        if json.loads(read(previous,1024)).get('worker_id')==worker and previous.name!=state['session_uuid']+'.json':raise Stop('worker already owns another lifetime UUID')
    claim=owners/(state['session_uuid']+'.json')
    try:
        with claim.open('xb') as f:f.write(encoded({'worker_id':worker}));f.flush();os.fsync(f.fileno())
    except FileExistsError:
        if json.loads(read(claim,1024))!={'worker_id':worker}:raise Stop('duplicate session ownership')
    state.setdefault('possible_launch',bool(state.get('pending')) or state.get('state')!='creating')
    return state

def attempt_root(root,pending):
    attempt=pending['attempt_id']
    if str(uuid.UUID(attempt))!=attempt:raise Stop('invalid pending attempt')
    expected='attempts/'+attempt
    if 'artifacts' not in pending:return root # Retained pre-simplification receipt.
    if pending['artifacts']!=expected:raise Stop('foreign attempt files')
    return plain(root/expected)


def result_answer(state,result):
    if not isinstance(result,dict) or result.get('type')!='result' or result.get('subtype')!='success' or result.get('is_error') is not False or result.get('session_id')!=state['session_uuid'] or not isinstance(result.get('result'),str) or not result['result'].strip():raise Stop('unsuccessful/malformed/wrong-session result; pending retained')
    if 'modelUsage' in result:
        usage=result['modelUsage'];opus=usage.get(MODEL) if isinstance(usage,dict) else None
        if not isinstance(opus,dict) or type(opus.get('outputTokens')) not in (int,float) or opus['outputTokens']<=0 or not math.isfinite(opus['outputTokens']):raise Stop('requested Opus output absent from modelUsage')
        if opus.get('canonicalModel',MODEL)!=MODEL:raise Stop('result model differs from request')
    return result['result']


def completed(root,state):
    pending=state['pending'];folder=attempt_root(root,pending)
    try:process=json.loads(read(folder/'last-process.json'));result=json.loads(read(folder/'stdout.json'))
    except (OSError,ValueError):raise Stop('missing/malformed pending result or receipt')
    expected={'status':'eof','actual_eof':True,'tree_gone':True,'code':0,'attempt_id':pending['attempt_id'],'job_name':pending['job_name']}
    if any(process.get(k)!=v for k,v in expected.items()) or type(process.get('code')) is not int or process.get('actual_eof') is not True or process.get('tree_gone') is not True or any(k.endswith('error') for k in process):raise Stop('completed owned attempt EOF unproven')
    if pending.get('requested_effort',EFFORT)!=EFFORT or process.get('requested_effort',EFFORT)!=EFFORT:raise Stop('pending request was not xhigh')
    if not tree_gone(pending['job_name']):raise Stop('pending process tree remains live')
    answer=result_answer(state,result)
    state.update(state='ready',possible_launch=True,pending=None,last_ok_result={'sha256':digest(answer.encode('utf-8')),'session_id':state['session_uuid'],'path':str(folder/'stdout.json')},last_ok_ts=time.time())
    atomic(root/'session.json',encoded(state));return answer


def _consult(worker,prompt,run=run_owned):
    worker=worker_id(worker)
    if not isinstance(prompt,str) or not prompt.strip() or len(prompt.encode('utf-8'))>MAX_PROMPT:raise Stop('empty/oversize prompt')
    plain(STORE);STORE.mkdir(parents=True,exist_ok=True);root=plain(STORE/worker);root.mkdir(exist_ok=True)
    with WorkerLock(root/'owner.lock'):
        state=load_state(root,worker)
        if state['pending']:raise Stop('pending attempt: recover-completed or explicitly abandon-pending; no resend')
        if digest(prompt.encode('utf-8'))==state.get('abandoned_prompt_sha'):raise Stop('supply a distinct new prompt after abandonment')
        managed_policy_guard();env=child_env();authroot=root/'auth';authroot.mkdir(exist_ok=True)
        auth=run([EXE,'--restricted','--safe-mode','auth','status','--json'],b'',env,CWD,authroot,'Local\\OB64Consult-auth-'+worker+'-'+str(uuid.uuid4()),60)
        if auth.get('status')!='eof' or type(auth.get('code')) is not int or auth['code']!=0 or auth.get('tree_gone') is not True or auth.get('actual_eof') is not True or any(k.endswith('error') for k in auth):raise Stop('auth preflight failed')
        try:evidence=json.loads(read(authroot/'stdout.json'))
        except (OSError,ValueError):raise Stop('malformed subscription preflight')
        if not isinstance(evidence,dict) or any(evidence.get(k)!=v for k,v in {'loggedIn':True,'authMethod':'claude.ai','apiProvider':'firstParty','subscriptionType':'max'}.items()):raise Stop('subscription-only auth not established')
        managed_policy_guard()
        attempt=str(uuid.uuid4());folder=plain(root/'attempts'/attempt);folder.mkdir(parents=True)
        creating=not state['possible_launch']
        pending={'attempt_id':attempt,'job_name':'Local\\OB64Consult-'+worker+'-'+attempt,'prompt_sha':digest(prompt.encode('utf-8')),'requested_effort':EFFORT,'artifacts':'attempts/'+attempt}
        role=root/'role.txt';atomic(role,(ROLE+'\nconsult-worker:'+worker+'\n').encode('utf-8'))
        argv=[EXE,'-p','--model',MODEL,'--effort',EFFORT,'--output-format','json','--restricted','--safe-mode','--tools','Read,Grep,Glob','--permission-mode','dontAsk','--permission-prompts','none','--strict-mcp-config','--disallowedTools','mcp__*','-n','consult-'+worker,'--append-system-prompt-file',str(role),'--add-dir',str(MEMORY),'--session-id' if creating else '--resume',state['session_uuid']]
        # Durable before any possible model launch. Never fall back to creation.
        atomic(folder/'stdin.txt',prompt.encode('utf-8'))
        state.update(state='pending',pending=pending,possible_launch=True);atomic(root/'session.json',encoded(state))
        outcome=run(argv,prompt.encode('utf-8'),env,CWD,folder,pending['job_name'],900)
        outcome.update(attempt_id=attempt,job_name=pending['job_name'],requested_effort=EFFORT,argv=argv)
        atomic(folder/'last-process.json',encoded(outcome))
        return completed(root,state)


def consult_claude(worker,prompt):
    if not LIVE_ENABLED:raise Stop('live calls disabled')
    return _consult(worker,prompt)


def _recover(worker,action):
    worker=worker_id(worker);root=plain(STORE/worker)
    with WorkerLock(root/'owner.lock'):
        state=load_state(root,worker);pending=state['pending']
        if not pending:raise Stop('no pending attempt')
        expected_job='Local\\OB64Consult-'+worker+'-'+pending['attempt_id']
        if pending.get('job_name')!=expected_job:raise Stop('foreign pending job')
        if not tree_gone(pending['job_name']):raise Stop('pending process tree remains live; do not dispatch')
        if action=='recover-completed':return completed(root,state)
        if action!='abandon-pending':raise Stop('unknown recovery action')
        source=attempt_root(root,pending);archive=plain(root/'attempts'/pending['attempt_id']);archive.mkdir(parents=True,exist_ok=True)
        # New attempts already own immutable output directories. Legacy root-level
        # evidence is retained here before pending can clear; partial copies stay.
        for name in ('stdin.txt','stdout.json','stderr.txt','last-process.json'):
            src=source/name;dest=archive/name
            if src==dest or not src.exists():continue
            data=read(src)
            if dest.exists():
                if read(dest)!=data:raise Stop('retained attempt evidence differs')
            else:atomic(dest,data)
        saved=archive/'pending.json';data=encoded(pending)
        if saved.exists():
            if read(saved)!=data:raise Stop('retained pending identity differs')
        else:atomic(saved,data)
        state.update(state='ready',pending=None,possible_launch=True,abandoned_prompt_sha=pending['prompt_sha'])
        atomic(root/'session.json',encoded(state))
        return 'pending attempt abandoned without accepting its answer; use a distinct new prompt on the same UUID'


def recover(worker,action):
    if not LIVE_ENABLED:raise Stop('live recovery disabled')
    return _recover(worker,action)


def main():
    import sys
    sys.stdout.reconfigure(encoding='utf-8',newline='\n')
    parser=argparse.ArgumentParser();parser.add_argument('--worker-id');parser.add_argument('--prompt-file');parser.add_argument('--recover',choices=['recover-completed','abandon-pending']);args=parser.parse_args()
    worker=worker_id(args.worker_id)
    if args.recover:print(recover(worker,args.recover));return
    raw=read(args.prompt_file,MAX_PROMPT) if args.prompt_file else sys.stdin.buffer.read(MAX_PROMPT+1)
    if len(raw)>MAX_PROMPT:raise Stop('oversize stdin')
    print(consult_claude(worker,raw.decode('utf-8-sig')))
if __name__=='__main__':main()
