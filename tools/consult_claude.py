"""One read-only Claude session per inherited worker. Standard library, Windows only.
LIVE_ENABLED remains false until independent review and explicitly approved live probes.
"""
import argparse,ctypes,hashlib,json,math,msvcrt,os,subprocess,time,uuid,winreg
from ctypes import wintypes as W
from pathlib import Path

LIVE_ENABLED=True
MODEL='claude-opus-5-5';EFFORT='xhigh';VERSION='2.1.292'
SUPPORTED_VERSIONS=frozenset(('2.1.292','2.1.296'))
CWD=Path(r'C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp')
CONFIG=Path(r'C:\Users\Joe\.claude')
EXE=r'C:\Users\Joe\.local\bin\claude.exe'
STORE=Path(r'C:\Users\Joe\.local\share\ob64-claude-consult')
MEMORY=CONFIG/'projects/C--Users-Joe-Projects-OgreBattlel64-OB64-Decomp/memory'
MAX_PROMPT=1024**2;MAX_OUTPUT=4*1024**2;MAX_HISTORY=64*1024**2
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

def read(path,limit=MAX_HISTORY):
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

def locate(session):
    matches=list((CONFIG/'projects').glob('*/'+session+'.jsonl'))
    if len(matches)!=1:raise Stop('missing or ambiguous exact session transcript; preserve UUID')
    return plain(matches[0])

def parse_history(data):
    try:return [json.loads(line) for line in data.decode('utf-8').splitlines() if line.strip()]
    except (ValueError,UnicodeError):raise Stop('malformed transcript')
def user_text(record):
    value=record.get('message',{}).get('content')
    if isinstance(value,str):return value
    if isinstance(value,list) and all(x.get('type')=='text' for x in value):return ''.join(x['text'] for x in value)
    return None

def binding(records,state):
    users=[r for r in records if r.get('type')=='user' and user_text(r) is not None]
    if not users or not user_text(users[0]).startswith('consult-worker:'+state['worker_id']+'\n'):raise Stop('original user binding absent/mismatched')
    if state.get('original_wire_sha') and digest(user_text(users[0]).encode())!=state['original_wire_sha']:raise Stop('original exact user changed')
    if any(r.get('sessionId')!=state['session_uuid'] for r in records if r.get('type') in ('user','assistant')):raise Stop('foreign transcript session')

OAUTH_ERROR='Failed to authenticate. API Error: 401 OAuth access token has expired. Re-authenticate to continue.'
META_FIELDS={
 'custom-title':{'customTitle'},'agent-name':{'agentName'},
 'mode':{'mode'},'atis-latch':{'atis'},'last-prompt':{'lastPrompt','leafUuid'},
 'cost-state':{'hasUnknownModelCost','modelUsage','startTime','totalAPIDuration','totalAPIDurationWithoutRetries','totalCostUSD','totalDuration','totalLinesAdded','totalLinesRemoved','totalToolDuration'}}
ATTACH_FIELDS={'environment':{'snapshot'},'model':{'identity','text'},'total_tokens_reminder':{'text'},'session_context':{'context'},'date':{'date'},'prompt_snapshot':{'contextRendering','systemPrompt'},'credential_org':{'organizationUuid'},'silent_turn_reminder':{'text'}}
ATTACH_OPTIONAL={'session_context':{'changed','reason'},'prompt_snapshot':{'echoWireToolInputs','reminderFold','cliPrefix','inlineTools','keptReminders','systemTurns','toolChangeHeader','tools'}}
NATIVE_COMMON={'cwd','entrypoint','gitBranch','isSidechain','parentUuid','sessionId','timestamp','type','userType','uuid','version'}

def attempt_version(state,records):
    versions={r.get('version') for r in records if r.get('type') in ('user','assistant','attachment','system')}
    if len(versions)!=1 or not versions<=SUPPORTED_VERSIONS:raise Stop('unknown/missing/mixed fresh native version')
    version=next(iter(versions));pinned=state['pending'].get('native_version')
    if 'native_version' in state['pending'] and version!=pinned:raise Stop('fresh native version differs from preflight')
    return version # CLI/schema provenance only; never model/auth/effort proof.

def two_tool_window(state,window,raw_window,open_ids,seen,oldids):
    # Closed raw 296 window only; ordinary linear ancestry is unchanged.
    if len(window)!=4:return False
    # Only this exception requires unambiguous raw objects, at every depth.
    def unique(pairs):
        value={}
        for key,item in pairs:
            if key in value:raise Stop('fresh attempt ancestry mismatch')
            value[key]=item
        return value
    for line in raw_window:json.loads(line,object_pairs_hook=unique)
    a,b,x,y=window
    if [r.get('type') for r in window]!=['assistant','assistant','user','user']:return False
    ids=[r.get('uuid') for r in window]
    if any(type(v) is not str or not v for v in ids) or len(set(ids))!=4 or any(v in seen or v in oldids for v in ids[2:]):return False
    if any(r.get('sessionId')!=state['session_uuid'] or r.get('version')!='2.1.296' or r.get('cwd')!=state['cwd'] or r.get('isSidechain') is not False for r in window):return False
    if b.get('parentUuid')!=a['uuid']:return False
    for r in (a,b):
        m=r.get('message',{})
        if 'isApiErrorMessage' in r or 'error' in r or m.get('model')!=MODEL or m.get('role')!='assistant' or m.get('stop_reason')!='tool_use':return False
        if type(r.get('requestId')) is not str or not r['requestId'] or type(m.get('id')) is not str or not m['id'] or type(r.get('apiBlockIndex')) is not int or r['apiBlockIndex']<0:return False
        if type(r.get('effort')) is not str or not r['effort'] or r.get('perTurnEffort')!=r['effort']:return False
    if a['requestId']!=b['requestId'] or a['message']['id']!=b['message']['id'] or b['apiBlockIndex']!=a['apiBlockIndex']+1 or a['effort']!=b['effort']:return False
    uses=[]
    for r in (a,b):
        content=r['message'].get('content')
        if not isinstance(content,list) or len(content)!=1 or not isinstance(content[0],dict) or content[0].get('type')!='tool_use':return False
        tid=content[0].get('id')
        if type(tid) is not str or not tid:return False
        uses.append(tid)
    # Both uses were already admitted and globally fresh. With no intervening
    # result, this equality also proves zero obligations before the pair.
    if uses[0]==uses[1] or open_ids!=set(uses):return False
    for source,r,tid in zip((a,b),(x,y),uses):
        if r.get('parentUuid')!=source['uuid'] or r.get('sourceToolAssistantUUID')!=source['uuid'] or set(r)-NATIVE_COMMON-{'message','sourceToolAssistantUUID','permissionDecision','promptId','toolUseResult'}:return False
        content=r.get('message',{}).get('content')
        if r.get('message',{}).get('role')!='user' or not isinstance(content,list) or len(content)!=1 or not isinstance(content[0],dict) or content[0].get('type')!='tool_result' or content[0].get('tool_use_id')!=tid:return False
    return True

def attempt_records(state,data):
    pending=state['pending'];offset=pending['offset']
    if len(data)<offset or digest(data[:offset])!=pending['prefix_sha']:raise Stop('old history changed')
    records=parse_history(data);binding(records,state);fresh=parse_history(data[offset:]);events=[];seen=set();terminal=False;trailing=False;tool_ids=set();used_tool_ids=set();tool_boundary=False
    native_version=attempt_version(state,fresh)
    old_records=parse_history(data[:offset]);oldids={r.get('uuid') for r in old_records if r.get('uuid')}
    prior_tool_ids=[x.get('id') for r in old_records if r.get('type')=='assistant' for x in r.get('message',{}).get('content',[]) if x.get('type')=='tool_use']
    if any(not isinstance(tid,str) or not tid for tid in prior_tool_ids) or len(set(prior_tool_ids))!=len(prior_tool_ids):raise Stop('ambiguous prior tool identity')
    used_tool_ids.update(prior_tool_ids);silent_boundary=None;permission_seen=False;second_result=None
    raw_fresh=[line for line in data[offset:].decode("utf-8").splitlines() if line.strip()]
    for index,r in enumerate(fresh):
        kind=r.get('type')
        if r.get('sessionId')!=state['session_uuid']:raise Stop('foreign fresh record')
        if kind=='permission-mode':
            # Only this exact 296 terminal record gets strict local raw-key checking.
            def unique(pairs):
                value={}
                for key,item in pairs:
                    if key in value:raise Stop('duplicate terminal permission key')
                    value[key]=item
                return value
            json.loads(raw_fresh[index],object_pairs_hook=unique)
            last=events[-1] if events else {};message=last.get('message',{})
            if permission_seen or native_version!='2.1.296' or set(r)!={'type','sessionId','permissionMode'} or any(type(r[k]) is not str for k in r) or r['permissionMode']!='dontAsk':raise Stop('unknown terminal permission metadata')
            if last.get('type')!='assistant' or 'isApiErrorMessage' in last or 'error' in last or last.get('isSidechain') is True or message.get('model')!=MODEL or message.get('stop_reason')!='end_turn' or tool_ids or silent_boundary is not None or not any(x.get('type')=='text' and type(x.get('text')) is str and x['text'].strip() for x in message.get('content',[])):raise Stop('terminal permission requires real completed text')
            permission_seen=True;trailing=True
            continue
        if permission_seen and kind not in META_FIELDS:raise Stop('record after terminal permission metadata')
        if kind in META_FIELDS:
            if set(r)!=META_FIELDS[kind]|{'type','sessionId'}:raise Stop('unknown metadata shape')
            if kind in ('custom-title','agent-name','mode') and events and not terminal and not tool_boundary:raise Stop('mid-turn display metadata')
            if kind=='atis-latch' and not events:raise Stop('misplaced latch')
            if kind in ('last-prompt','cost-state'):
                if not terminal and not (kind=='last-prompt' and tool_boundary):raise Stop('premature trailing metadata')
                if kind=='last-prompt' and (not events or r['leafUuid']!=events[-1]['uuid'] and not (terminal and r['leafUuid'] in {e['uuid'] for e in events if e['type']=='assistant'})):raise Stop('foreign metadata leaf')
            if terminal:trailing=True
            continue
        if kind=='queue-operation':
            fields={'type','sessionId','operation','timestamp'}|({'content'} if r.get('operation')=='enqueue' else set())
            if events or r.get('operation') not in ('enqueue','dequeue') or set(r)!=fields:raise Stop('unknown queue metadata')
            if r['operation']=='enqueue' and (not isinstance(r['content'],str) or digest(r['content'].encode())!=pending['wire_sha']):raise Stop('foreign queued prompt')
            continue
        if terminal:
            if kind=='attachment' and r.get('attachment',{}).get('type')=='prompt_snapshot' and not trailing:trailing=True
            elif kind=='assistant' and not trailing:
                # Native JSONL splits one completed API message into separate content blocks.
                previous=events[-1];message=r.get('message',{});prior=previous.get('message',{})
                if previous['type']!='assistant' or not isinstance(r.get('requestId'),str) or not r['requestId'] or r['requestId']!=previous.get('requestId') or not isinstance(message.get('id'),str) or not message['id'] or message['id']!=prior.get('id') or type(r.get('apiBlockIndex')) is not int or type(previous.get('apiBlockIndex')) is not int or r['apiBlockIndex']!=previous['apiBlockIndex']+1 or message.get('role')!='assistant' or message.get('stop_reason')!='end_turn' or prior.get('stop_reason')!='end_turn':raise Stop('ambiguous completed message blocks')
            else:raise Stop('record after terminal assistant')
        if not events:
            if kind!='user' or user_text(r) is None or digest(user_text(r).encode())!=pending['wire_sha']:raise Stop('fresh exact attempt user absent')
            if not user_text(r).startswith('consult-worker:'+state['worker_id']+'\nconsult-attempt:'+pending['attempt_id']+'\n'):raise Stop('attempt marker mismatch')
            if r.get('parentUuid') is not None and r.get('parentUuid') not in oldids:raise Stop('foreign first parent')
        else:
            if kind=='user' and user_text(r) is not None:raise Stop('interleaved user turn')
            if kind not in ('user','assistant','attachment','system'):raise Stop('unknown transcript record')
            if r.get('parentUuid')!=events[-1]['uuid']:
                if second_result is r:second_result=None
                elif native_version=='2.1.296' and index>=2 and len(events)>=2 and fresh[index-2] is events[-2] and fresh[index-1] is events[-1] and two_tool_window(state,fresh[index-2:index+2],raw_fresh[index-2:index+2],tool_ids,seen,oldids):second_result=fresh[index+1]
                else:raise Stop('fresh attempt ancestry mismatch')
        if not r.get('uuid') or r['uuid'] in seen or r['uuid'] in oldids:raise Stop('duplicate/missing record UUID')
        if kind in ('attachment','system'):
            if r.get('version')!=native_version or r.get('isSidechain') is not False:raise Stop('foreign native ancestry')
            if kind=='attachment':
                attachment=r.get('attachment',{});at=attachment.get('type');extra={'rendered','renderedRole'} if at not in ('prompt_snapshot','credential_org') else set()
                if at not in ATTACH_FIELDS or not ATTACH_FIELDS[at]|{'type'}<=set(attachment) or set(attachment)-ATTACH_FIELDS[at]-{'type'}-ATTACH_OPTIONAL.get(at,set()) or set(r)!=NATIVE_COMMON|{'attachment'}|extra:raise Stop('unknown attachment shape')
            elif set(r.get('error',{}))-{'message','status','requestId','formatted','connection','isNetworkDown','rateLimits','noResponse'} or r.get('subtype')!='api_error' or set(r)!=NATIVE_COMMON|{'error','level','maxRetries','retryAttempt','retryInMs','source','subtype'} or not isinstance(r['error'],dict):raise Stop('unknown system shape')
        if kind=='assistant':
            if silent_boundary is not None:
                prior_message,prior_request,stage=silent_boundary
                if stage!='total' or not events or events[-1].get('attachment',{}).get('type')!='total_tokens_reminder' or r.get('message',{}).get('id')==prior_message or r.get('requestId')==prior_request:raise Stop('reminder must precede a new message/request')
                silent_boundary=None
            if tool_ids and (not events or events[-1]['type']!='assistant' or events[-1].get('message',{}).get('id')!=r.get('message',{}).get('id')):raise Stop('assistant before all tool results')
            tool_boundary=False
            calls=[x for x in r.get('message',{}).get('content',[]) if x.get('type')=='tool_use']
            if calls and r.get('message',{}).get('stop_reason')!='tool_use':raise Stop('tool call without tool-use stop')
            for call in calls:
                tid=call.get('id')
                if not isinstance(tid,str) or not tid or tid in used_tool_ids:raise Stop('ambiguous tool-use identity')
                tool_ids.add(tid);used_tool_ids.add(tid)
        elif kind=='user' and events:
            content=r.get('message',{}).get('content')
            if not isinstance(content,list) or not content or any(x.get('type')!='tool_result' for x in content):raise Stop('unsupported interleaved user')
            for value in content:
                tid=value.get('tool_use_id')
                if tid not in tool_ids:raise Stop('unmatched/duplicate tool result')
                tool_ids.remove(tid)
            tool_boundary=not tool_ids
        elif kind=='attachment':
            at=r.get('attachment',{}).get('type')
            if at=='silent_turn_reminder':
                if native_version!='2.1.296' or not tool_boundary or tool_ids or silent_boundary is not None or not events or events[-1]['type']!='user' or events[-1].get('isSidechain') is not False or type(r['attachment'].get('text')) is not str:raise Stop('invalid silent reminder boundary')
                prior=next((e for e in reversed(events) if e['type']=='assistant'),None)
                if prior is None or prior.get('message',{}).get('stop_reason')!='tool_use':raise Stop('silent reminder without completed tool use')
                silent_boundary=(prior['message'].get('id'),prior.get('requestId'),'silent')
            elif silent_boundary is not None:
                if at!='total_tokens_reminder' or silent_boundary[2]!='silent' or events[-1].get('attachment',{}).get('type')!='silent_turn_reminder':raise Stop('invalid reminder order/count')
                silent_boundary=(*silent_boundary[:2],'total')
            elif tool_boundary and at!='total_tokens_reminder':raise Stop('unknown post-tool attachment')
        seen.add(r['uuid']);events.append(r)
        terminal=terminal or kind=='assistant' and r.get('message',{}).get('stop_reason') in ('end_turn','stop_sequence')
    if not events or tool_ids or silent_boundary is not None:raise Stop('missing attempt or unresolved tool/reminder boundary')
    return events

def validate(state,data,result,*,expected_effort=EFFORT):
    fresh=attempt_records(state,data);native_version=attempt_version(state,fresh)
    assistants=[r for r in fresh[1:] if r.get('type')=='assistant']
    if not assistants:raise Stop('no fresh assistant evidence')
    native_messages=set();native_requests=set();last_assistant=None
    raw_positions={r['uuid']:i for i,r in enumerate(parse_history(data[state['pending']['offset']:])) if r.get('uuid')}
    for record in assistants:
        if record.get('isApiErrorMessage') or record.get('error') or record.get('isSidechain') is True:raise Stop('synthetic/sidechain assistant cannot certify success')
        if any(k in record for k in ('requestId','apiBlockIndex')) or 'id' in record.get('message',{}):
            if not isinstance(record.get('requestId'),str) or not record['requestId'] or not isinstance(record.get('message',{}).get('id'),str) or not record['message']['id'] or type(record.get('apiBlockIndex')) is not int or record['apiBlockIndex']<0 or record['message'].get('role')!='assistant':raise Stop('incomplete native message association')
            previous=fresh[fresh.index(record)-1]
            message_id=record['message']['id'];request_id=record['requestId']
            if previous.get('type')=='assistant' and previous.get('message',{}).get('id')==message_id:
                if previous.get('requestId')!=request_id or type(previous.get('apiBlockIndex')) is not int or record['apiBlockIndex']!=previous['apiBlockIndex']+1:raise Stop('native continuation request/index mismatch')
            elif last_assistant is not None and last_assistant['message'].get('id')==message_id:
                # 2.1.296 streams one matching tool result between consecutive API blocks.
                prior=last_assistant;prior_content=prior['message'].get('content',[]);content=record['message'].get('content',[]);result_content=previous.get('message',{}).get('content',[])
                if native_version!='2.1.296' or previous.get('type')!='user' or previous.get('isSidechain') is not False or raw_positions[record['uuid']]!=raw_positions[prior['uuid']]+2 or raw_positions[previous['uuid']]!=raw_positions[prior['uuid']]+1 or previous.get('parentUuid')!=prior['uuid'] or previous.get('sourceToolAssistantUUID')!=prior['uuid']:raise Stop('crossing is not one source-linked result')
                if len(prior_content)!=1 or prior_content[0].get('type')!='tool_use' or len(result_content)!=1 or result_content[0].get('type')!='tool_result' or result_content[0].get('tool_use_id')!=prior_content[0].get('id') or len(content)!=1 or content[0].get('type')!='tool_use':raise Stop('crossing tool/result shape mismatch')
                if prior['message'].get('stop_reason')!='tool_use' or record['message'].get('stop_reason')!='tool_use' or prior.get('requestId')!=request_id or type(prior.get('apiBlockIndex')) is not int or record['apiBlockIndex']!=prior['apiBlockIndex']+1 or any(record.get(k)!=prior.get(k) for k in ('effort','perTurnEffort')) or record['message'].get('model')!=prior['message'].get('model'):raise Stop('crossing message association mismatch')
            else:
                if record['apiBlockIndex']!=0 or message_id in native_messages or request_id in native_requests:raise Stop('missing or reused native message start')
            native_messages.add(message_id);native_requests.add(request_id)
        if record.get('message',{}).get('model')!=MODEL or record.get('effort')!=expected_effort or record.get('perTurnEffort')!=expected_effort or record.get('version')!=native_version:raise Stop('model/effort/version mismatch or missing evidence')
        last_assistant=record
    if not isinstance(result,dict) or result.get('type')!='result' or result.get('subtype')!='success' or result.get('is_error') is not False or result.get('session_id')!=state['session_uuid'] or not isinstance(result.get('result'),str) or not result['result'].strip():raise Stop('unsuccessful/malformed/wrong-session result')
    last=assistants[-1]['message'];group=[r for r in assistants if r['message'].get('id')==last.get('id')] if last.get('id') else [assistants[-1]];content=[x for r in group for x in r['message'].get('content',[])]
    if last.get('stop_reason')!='end_turn' or ''.join(x.get('text','') for x in content if x.get('type')=='text').strip()!=result['result'].strip():raise Stop('fresh completed assistant/result association unproven')
    return result['result']

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
        state=dict(worker_id=worker,session_uuid=str(uuid.uuid4()),cwd=str(CWD),config=str(CONFIG),model=MODEL,effort=EFFORT,state='creating',created_ts=time.time(),transcript=None,pending=None)
        atomic(file,encoded(state)) # UUID durable before any creation or ownership claim.
    owners=plain(STORE/'owners');owners.mkdir(exist_ok=True)
    for previous in owners.glob('*.json'):
        if json.loads(read(previous,1024)).get('worker_id')==worker and previous.name!=state['session_uuid']+'.json':raise Stop('worker already owns another lifetime UUID')
    claim=owners/(state['session_uuid']+'.json')
    try:
        with claim.open('xb') as f:f.write(encoded({'worker_id':worker}));f.flush();os.fsync(f.fileno())
    except FileExistsError:
        if json.loads(read(claim,1024))!={'worker_id':worker}:raise Stop('duplicate session ownership')
    return state

def finish(root,state,transcript,data,result):
    answer=validate(state,data,result)
    atomic(root/'transcript.backup.jsonl',data)
    prompt_sha=state['pending']['prompt_sha']
    state.update(state='ready',pending=None,transcript=str(transcript),backup_sha256=digest(data),history_sha256=digest(data),last_prompt_sha=prompt_sha,last_ok_result={'sha256':digest(answer.encode()),'session_id':state['session_uuid']},last_ok_ts=time.time())
    state['usage_evidence']={k:result.get(k) for k in ('num_turns','duration_ms','stop_reason','terminal_reason')}
    state['usage_evidence']['modelUsage']={str(k):{'costBasis':v.get('costBasis')} for k,v in result.get('modelUsage',{}).items() if isinstance(v,dict)}
    state['usage_evidence']['permission_denials']=result.get('permission_denials',[])
    atomic(root/'session.json',encoded(state));return answer

def admit_idle_suffix(root,state,transcript,data):
    """Read-only admission; never adopt metadata as accepted history or authority."""
    accepted=state.get('last_ok_result')
    if state.get('state')!='ready' or state.get('pending','missing') is not None or not isinstance(accepted,dict) or accepted.get('session_id')!=state['session_uuid'] or not isinstance(accepted.get('sha256'),str) or len(accepted['sha256'])!=64 or any(ch not in '0123456789abcdefABCDEF' for ch in accepted['sha256']):raise Stop('idle suffix needs a validated ready baseline')
    if str(transcript)!=state.get('transcript') or locate(state['session_uuid'])!=transcript:raise Stop('idle suffix transcript binding changed')
    if not state.get('original_wire_sha'):raise Stop('idle suffix original exact binding missing')
    backup=read(root/'transcript.backup.jsonl')
    if not backup or not backup.endswith(b'\n') or digest(backup)!=state.get('backup_sha256') or digest(backup)!=state.get('history_sha256') or not data.startswith(backup):raise Stop('idle suffix accepted prefix mismatch')
    binding(parse_history(backup),state)
    suffix=data[len(backup):]
    if not suffix or len(suffix)>65536 or not suffix.endswith(b'\n'):raise Stop('idle suffix byte/line bound')
    lines=suffix[:-1].split(b'\n')
    if not 1<=len(lines)<=128:raise Stop('idle suffix record bound')
    def unique(pairs):
        result={}
        for key,value in pairs:
            if key in result:raise Stop('duplicate idle JSON key')
            result[key]=value
        return result
    def nonfinite(value):raise Stop('nonfinite idle JSON constant')
    def number(value):return type(value) is int or type(value) is float and math.isfinite(value)
    usage_fields={'inputTokens','outputTokens','thinkingTokens','cacheReadInputTokens','cacheCreationInputTokens','webSearchRequests','costUSD'}
    for line in lines:
        try:record=json.loads(line.decode('utf-8'),object_pairs_hook=unique,parse_constant=nonfinite)
        except (ValueError,UnicodeError):raise Stop('malformed idle JSON line')
        if not isinstance(record,dict) or record.get('sessionId')!=state['session_uuid']:raise Stop('foreign idle metadata')
        kind=record.get('type')
        if kind=='permission-mode':
            if set(record)!={'type','sessionId','permissionMode'} or type(record['permissionMode']) is not str or record['permissionMode']!='dontAsk':raise Stop('unknown idle permission metadata')
        elif kind=='cost-state':
            if set(record)!=META_FIELDS['cost-state']|{'type','sessionId'} or type(record['hasUnknownModelCost']) is not bool or not number(record['totalCostUSD']) or type(record['modelUsage']) is not dict:raise Stop('unknown idle cost schema')
            if any(type(record[k]) is not int for k in META_FIELDS['cost-state']-{'hasUnknownModelCost','modelUsage','totalCostUSD'}):raise Stop('invalid idle cost field type')
            for model,usage in record['modelUsage'].items():
                if type(model) is not str or type(usage) is not dict or set(usage)!=usage_fields or not number(usage['costUSD']) or any(type(usage[k]) is not int for k in usage_fields-{'costUSD'}):raise Stop('invalid idle model usage schema')
        else:raise Stop('unsupported idle metadata record')
    return backup

def recheck_idle_snapshot(root,state,transcript,data,backup):
    if locate(state['session_uuid'])!=transcript or read(transcript)!=data or read(root/'transcript.backup.jsonl')!=backup:raise Stop('idle metadata snapshot changed before dispatch')

def executable_identity():
    path=plain(EXE);stat=path.stat()
    if not path.is_file():raise Stop('native executable missing')
    return (stat.st_dev,stat.st_ino,stat.st_size,stat.st_mtime_ns)

def version_preflight(worker,root,run,env):
    identity=executable_identity();directory=root/'version';directory.mkdir(exist_ok=True)
    outcome=run([EXE,'--restricted','--safe-mode','--version'],b'',env,CWD,directory,'Local\\OB64Consult-version-'+worker+'-'+str(uuid.uuid4()),10)
    if outcome.get('status')!='eof' or type(outcome.get('code')) is not int or outcome['code']!=0 or outcome.get('actual_eof') is not True or outcome.get('tree_gone') is not True or any(k.endswith('error') for k in outcome):raise Stop('native version preflight EOF unproven')
    raw=read(directory/'stdout.json',512)
    versions={((v+' (Claude Code)'+ending).encode()):v for v in SUPPORTED_VERSIONS for ending in ('\n','\r\n')}
    if raw not in versions:raise Stop('unknown or malformed native CLI version')
    if executable_identity()!=identity:raise Stop('native executable changed during version preflight')
    return versions[raw],identity

def _consult(worker,prompt,run=run_owned):
    if not isinstance(prompt,str) or not prompt.strip() or len(prompt.encode())>MAX_PROMPT:raise Stop('empty/oversize prompt')
    plain(STORE);STORE.mkdir(parents=True,exist_ok=True);root=plain(STORE/worker);root.mkdir(exist_ok=True)
    with WorkerLock(root/'owner.lock'):
        state=load_state(root,worker)
        if state['pending']:raise Stop('pending attempt requires explicit recovery; no resend')
        if any(x.get('prompt_sha')==digest(prompt.encode()) for x in [state.get('disposed_probe',{}),*state.get('disposed_oauth',[])]):raise Stop('disposed prompt cannot be resent')
        managed_policy_guard()
        data=b'';idle_backup=None
        if state['state']!='creating':
            transcript=locate(state['session_uuid'])
            if str(transcript)!=state['transcript']:raise Stop('transcript path changed')
            data=read(transcript);binding(parse_history(data),state)
            if digest(data)!=state.get('history_sha256',state.get('backup_sha256')):idle_backup=admit_idle_suffix(root,state,transcript,data)
        env=child_env();native_version,native_identity=version_preflight(worker,root,run,env)
        authroot=root/'auth';authroot.mkdir(exist_ok=True)
        auth=run([EXE,'--restricted','--safe-mode','auth','status','--json'],b'',env,CWD,authroot,'Local\\OB64Consult-auth-'+worker+'-'+str(uuid.uuid4()),60)
        if auth.get('status')!='eof' or auth.get('code')!=0 or not auth.get('tree_gone') or not auth.get('actual_eof'):raise Stop('auth preflight failed')
        evidence=json.loads(read(authroot/'stdout.json',MAX_OUTPUT))
        if any(evidence.get(k)!=v for k,v in {'loggedIn':True,'authMethod':'claude.ai','apiProvider':'firstParty','subscriptionType':'max'}.items()):raise Stop('subscription-only auth not established')
        if idle_backup is not None:recheck_idle_snapshot(root,state,transcript,data,idle_backup)
        attempt=str(uuid.uuid4());wire='consult-worker:'+worker+'\nconsult-attempt:'+attempt+'\nprompt-sha256:'+digest(prompt.encode())+'\n\n'+prompt
        state['pending']=dict(native_version=native_version,attempt_id=attempt,wire_sha=digest(wire.encode()),prompt_sha=digest(prompt.encode()),offset=len(data),prefix_sha=digest(data),job_name='Local\\OB64Consult-'+worker+'-'+attempt,was_creating=state['state']=='creating')
        if state['pending']['was_creating']:state['original_wire_sha']=state['pending']['wire_sha']
        state['state']='pending';atomic(root/'session.json',encoded(state))
        role=root/'role.txt';atomic(role,(ROLE+'\nconsult-worker:'+worker+'\n').encode())
        argv=[EXE,'-p','--model',MODEL,'--effort',EFFORT,'--output-format','json','--restricted','--safe-mode','--tools','Read,Grep,Glob','--permission-mode','dontAsk','--permission-prompts','none','--strict-mcp-config','--disallowedTools','mcp__*','--max-turns','48','-n','consult-'+worker,'--append-system-prompt-file',str(role),'--add-dir',str(MEMORY)]
        argv+=['--session-id' if state['pending']['was_creating'] else '--resume',state['session_uuid']]
        managed_policy_guard() # Same guard immediately before model dispatch, after auth.
        if executable_identity()!=native_identity:raise Stop('native executable changed before model launch')
        if idle_backup is not None:recheck_idle_snapshot(root,state,transcript,data,idle_backup)
        outcome=run(argv,wire.encode('utf-8'),env,CWD,root,state['pending']['job_name'],900)
        outcome.update(attempt_id=attempt,job_name=state['pending']['job_name'])
        atomic(root/'last-process.json',encoded(outcome))
        if outcome.get('status')!='eof' or outcome.get('code')!=0 or not outcome.get('tree_gone') or not outcome.get('actual_eof'):raise Stop('consultation failed/unknown; explicit recovery, no resend')
        result=json.loads(read(root/'stdout.json',MAX_OUTPUT))
        state['last_result_status']={k:result.get(k) for k in ('type','subtype','is_error','session_id','num_turns','duration_ms')}
        atomic(root/'session.json',encoded(state))
        if result.get('subtype')=='error_max_turns':raise Stop('error_max_turns: partial transcript retained; no automatic resend')
        transcript=locate(state['session_uuid']);data=read(transcript)
        if state['transcript'] and str(transcript)!=state['transcript']:raise Stop('transcript path changed')
        return finish(root,state,transcript,data,result)

def consult_claude(worker,prompt):
    worker=worker_id(worker)
    if not LIVE_ENABLED:raise Stop('live calls disabled pending review, Joe extra-usage confirmation and approved probes')
    return _consult(worker,prompt)

def _recover(worker,action,attempt_id=None,history_sha256=None):
    worker=worker_id(worker);root=plain(STORE/worker)
    with WorkerLock(root/'owner.lock'):
        state=load_state(root,worker);pending=state.get('pending')
        if pending and not tree_gone(pending['job_name']):raise Stop('owned tree still active; stop unconfirmed')
        if action=='restore-backup':
            if pending:raise Stop('pending turn cannot be rolled back to backup')
            if not state['transcript']:raise Stop('no previously validated transcript path')
            destination=plain(state['transcript'])
            if destination.exists():raise Stop('refuse overwrite of live history')
            backup=read(root/'transcript.backup.jsonl')
            if digest(backup)!=state.get('backup_sha256'):raise Stop('backup identity mismatch')
            binding(parse_history(backup),state)
            atomic(destination,backup);return 'same UUID backup restored explicitly'
        if not pending:raise Stop('no pending attempt')
        # Missing transcript is unresolved, including unknown first creation. Never reissue --session-id.
        transcript=locate(state['session_uuid']);data=read(transcript)
        if state['transcript'] and str(transcript)!=state['transcript']:raise Stop('transcript path changed')
        if action=='dispose-terminal-oauth-failure':
            if attempt_id!=pending['attempt_id'] or history_sha256!=digest(data):raise Stop('explicit OAuth attempt/history identity mismatch')
            paths={'process':root/'last-process.json','result':root/'stdout.json','history':transcript,'state':root/'session.json'}
            sources={k:read(v) for k,v in paths.items()}
            if sources['history']!=data:raise Stop('history changed during disposition')
            process=json.loads(sources['process']);result=json.loads(sources['result'])
            expected={'status':'eof','actual_eof':True,'tree_gone':True,'code':1,'attempt_id':attempt_id,'job_name':pending['job_name']}
            if any(process.get(k)!=v for k,v in expected.items()) or any(k.endswith('error') for k in process):raise Stop('terminal OAuth owned EOF unproven')
            fresh=attempt_records(state,data);assistants=[r for r in fresh if r['type']=='assistant'];errors=[r for r in fresh if r['type']=='system']
            if len(assistants)!=1 or not errors or fresh[-1] is not assistants[0]:raise Stop('terminal OAuth record set unproven')
            assistant=assistants[0];message=assistant.get('message',{})
            if any(assistant.get(k)!=v for k,v in {'isApiErrorMessage':True,'error':'authentication_failed','apiErrorStatus':401,'version':attempt_version(state,fresh),'perTurnEffort':EFFORT}.items()) or message.get('model')!='<synthetic>' or message.get('stop_reason')!='stop_sequence' or message.get('content')!=[{'type':'text','text':OAUTH_ERROR}]:raise Stop('not exact synthetic OAuth failure')
            for error in errors:
                e=error['error']
                if e.get('status')!=401 or e.get('formatted')!='401 OAuth access token has expired. Re-authenticate to continue.':raise Stop('non-OAuth system error')
            if any(result.get(k)!=v for k,v in {'type':'result','subtype':'success','is_error':True,'session_id':state['session_uuid'],'result':OAUTH_ERROR,'num_turns':1}.items()):raise Stop('not exact OAuth result')
            receipt={'kind':'explicit-terminal-oauth-disposition','accepted_as_xhigh':False,'worker_id':worker,'session_uuid':state['session_uuid'],'attempt_id':attempt_id,'prompt_sha':pending['prompt_sha'],'sources':{k:{'path':str(paths[k]),'sha256':digest(v)} for k,v in sources.items()},'error':'expired-subscription-oauth','code':1,'retained_result_utf8':sources['result'].decode('utf-8'),'retained_process_utf8':sources['process'].decode('utf-8')}
            raw=encoded(receipt);file=root/('oauth-failure-'+attempt_id+'.json')
            if file.exists():
                if read(file)!=raw:raise Stop('immutable OAuth receipt conflict')
                with file.open('r+b') as f:f.flush();os.fsync(f.fileno())
            else:
                with plain(file).open('xb') as f:f.write(raw);f.flush();os.fsync(f.fileno())
            if any(read(paths[k])!=v for k,v in sources.items()) or not tree_gone(pending['job_name']):raise Stop('OAuth evidence changed before disposition')
            state.setdefault('disposed_oauth',[]).append({'attempt_id':attempt_id,'prompt_sha':pending['prompt_sha'],'receipt_sha256':digest(raw)})
            state.update(state='ready',pending=None,transcript=str(transcript),history_sha256=digest(data))
            if pending['was_creating']:state['original_wire_sha']=pending['wire_sha']
            atomic(root/'session.json',encoded(state))
            return 'terminal OAuth failure explicitly disposed; no answer accepted; same UUID requires a new prompt'
        if action=='dispose-completed-high-probe':
            if attempt_id!=pending['attempt_id'] or history_sha256!=digest(data):raise Stop('explicit probe attempt/history identity mismatch')
            process=json.loads(read(root/'last-process.json',MAX_OUTPUT))
            expected={'status':'eof','actual_eof':True,'tree_gone':True,'code':0,'attempt_id':attempt_id,'job_name':pending['job_name']}
            if any(process.get(k)!=v for k,v in expected.items()):raise Stop('completed owned probe EOF unproven')
            result=json.loads(read(root/'stdout.json',MAX_OUTPUT))
            # This is a rejected high probe, never a generic force-clear or xhigh acceptance.
            validate(state,data,result,expected_effort='high')
            receipt={'kind':'explicitly-disposed-completed-high-probe','accepted_as_xhigh':False,
                'worker_id':worker,'session_uuid':state['session_uuid'],'attempt_id':attempt_id,
                'history_sha256':history_sha256,'pending':pending,'process':process,'result':result,
                'fresh_records':parse_history(data[pending['offset']:])}
            file=root/'rejected-probe.json';raw=encoded(receipt)
            if file.exists():
                if read(file)!=raw:raise Stop('previous probe evidence must not be replaced')
            else:atomic(file,raw)
            state.update(state='ready',pending=None,transcript=str(transcript),history_sha256=digest(data),disposed_probe={
                'attempt_id':attempt_id,'history_sha256':history_sha256,'prompt_sha':pending['prompt_sha'],
                'evidence_sha256':digest(raw),'accepted_as_xhigh':False})
            atomic(root/'session.json',encoded(state)) # Backup and last_ok_result deliberately untouched.
            return 'completed high probe explicitly disposed; no answer accepted; same UUID may receive a new prompt'
        if action=='recover-completed':
            paths=[root/'last-process.json',root/'stdout.json',transcript,root/'session.json'];snapshots=[read(p) for p in paths]
            process=json.loads(snapshots[0]);expected={'status':'eof','actual_eof':True,'tree_gone':True,'code':0,'attempt_id':pending['attempt_id'],'job_name':pending['job_name']}
            if any(process.get(k)!=v for k,v in expected.items()) or type(process.get('code')) is not int or process.get('actual_eof') is not True or process.get('tree_gone') is not True or any(k.endswith('error') for k in process):raise Stop('completed owned attempt EOF unproven')
            result=json.loads(snapshots[1])
            if snapshots[2]!=data:raise Stop('history changed during completed recovery')
            validate(state,data,result)
            if any(read(p)!=raw for p,raw in zip(paths,snapshots)) or not tree_gone(pending['job_name']):raise Stop('completed evidence changed before acceptance')
            return finish(root,state,transcript,data,result)
        raise Stop('only validated completed-attempt recovery is supported; undelivered/partial needs Director decision')

def recover(worker,action,attempt_id=None,history_sha256=None):
    if not LIVE_ENABLED:raise Stop('live recovery disabled pending review and approved dispatch')
    return _recover(worker,action,attempt_id,history_sha256)

def main():
    import sys
    sys.stdout.reconfigure(encoding='utf-8', newline='\n')
    parser=argparse.ArgumentParser();parser.add_argument('--worker-id');parser.add_argument('--prompt-file');parser.add_argument('--recover',choices=['recover-completed','restore-backup','dispose-completed-high-probe','dispose-terminal-oauth-failure']);parser.add_argument('--attempt-id');parser.add_argument('--history-sha256');args=parser.parse_args()
    worker=worker_id(args.worker_id)
    if args.recover:print(recover(worker,args.recover,args.attempt_id,args.history_sha256));return
    raw=read(args.prompt_file,MAX_PROMPT) if args.prompt_file else sys.stdin.buffer.read(MAX_PROMPT+1)
    if len(raw)>MAX_PROMPT:raise Stop('oversize stdin')
    print(consult_claude(worker,raw.decode('utf-8-sig')))
if __name__=='__main__':main()
