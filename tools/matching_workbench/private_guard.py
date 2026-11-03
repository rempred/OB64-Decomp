"""Windows-only scratch command supervisor. No PID-based lock reclamation.

Mutex abandonment is insufficient proof that descendants stopped writing. Named
Job Objects survive while a member lives; successors wait for their active count
to reach zero before launching a new command. Kill-on-close only targets this
supervisor's own command tree. All launches are suspended until containment works.
"""
import argparse
import ctypes as C
from ctypes import wintypes as W
import json
import hashlib
import os
from pathlib import Path
import stat
import subprocess
import sys
import time

if os.name != 'nt':
    raise SystemExit('private guard requires Windows Job Objects')
k = C.WinDLL('kernel32', use_last_error=True)

class STARTUPINFO(C.Structure):
    _fields_ = [('cb', W.DWORD), ('lpReserved', W.LPWSTR), ('lpDesktop', W.LPWSTR), ('lpTitle', W.LPWSTR), ('dwX', W.DWORD), ('dwY', W.DWORD), ('dwXSize', W.DWORD), ('dwYSize', W.DWORD), ('dwXCountChars', W.DWORD), ('dwYCountChars', W.DWORD), ('dwFillAttribute', W.DWORD), ('dwFlags', W.DWORD), ('wShowWindow', W.WORD), ('cbReserved2', W.WORD), ('lpReserved2', C.POINTER(W.BYTE)), ('hStdInput', W.HANDLE), ('hStdOutput', W.HANDLE), ('hStdError', W.HANDLE)]
class PROCESS_INFORMATION(C.Structure):
    _fields_ = [('hProcess', W.HANDLE), ('hThread', W.HANDLE), ('dwProcessId', W.DWORD), ('dwThreadId', W.DWORD)]
class BASIC_LIMIT(C.Structure):
    _fields_ = [('PerProcessUserTimeLimit', C.c_longlong), ('PerJobUserTimeLimit', C.c_longlong), ('LimitFlags', W.DWORD), ('MinimumWorkingSetSize', C.c_size_t), ('MaximumWorkingSetSize', C.c_size_t), ('ActiveProcessLimit', W.DWORD), ('Affinity', C.c_size_t), ('PriorityClass', W.DWORD), ('SchedulingClass', W.DWORD)]
class IO_COUNTERS(C.Structure):
    _fields_ = [(name, C.c_ulonglong) for name in ['ReadOperationCount', 'WriteOperationCount', 'OtherOperationCount', 'ReadTransferCount', 'WriteTransferCount', 'OtherTransferCount']]
class EXTENDED_LIMIT(C.Structure):
    _fields_ = [('BasicLimitInformation', BASIC_LIMIT), ('IoInfo', IO_COUNTERS), ('ProcessMemoryLimit', C.c_size_t), ('JobMemoryLimit', C.c_size_t), ('PeakProcessMemoryUsed', C.c_size_t), ('PeakJobMemoryUsed', C.c_size_t)]
class ACCOUNTING(C.Structure):
    _fields_ = [('TotalUserTime', C.c_longlong), ('TotalKernelTime', C.c_longlong), ('ThisPeriodTotalUserTime', C.c_longlong), ('ThisPeriodTotalKernelTime', C.c_longlong), ('TotalPageFaultCount', W.DWORD), ('TotalProcesses', W.DWORD), ('ActiveProcesses', W.DWORD), ('TotalTerminatedProcesses', W.DWORD)]

def api(name, result, args):
    fn = getattr(k, name); fn.restype = result; fn.argtypes = args
    return fn
create_mutex = api('CreateMutexW', W.HANDLE, [C.c_void_p, W.BOOL, W.LPCWSTR])
release_mutex = api('ReleaseMutex', W.BOOL, [W.HANDLE])
create_job = api('CreateJobObjectW', W.HANDLE, [C.c_void_p, W.LPCWSTR])
query_job = api('QueryInformationJobObject', W.BOOL, [W.HANDLE, C.c_int, C.c_void_p, W.DWORD, C.c_void_p])
set_job = api('SetInformationJobObject', W.BOOL, [W.HANDLE, C.c_int, C.c_void_p, W.DWORD])
assign_job = api('AssignProcessToJobObject', W.BOOL, [W.HANDLE, W.HANDLE])
terminate_job = api('TerminateJobObject', W.BOOL, [W.HANDLE, W.UINT])
wait = api('WaitForSingleObject', W.DWORD, [W.HANDLE, W.DWORD])
close = api('CloseHandle', W.BOOL, [W.HANDLE])
open_process = api('OpenProcess', W.HANDLE, [W.DWORD, W.BOOL, W.DWORD])
create_process = api('CreateProcessW', W.BOOL, [W.LPCWSTR, W.LPWSTR, C.c_void_p, C.c_void_p, W.BOOL, W.DWORD, C.c_void_p, W.LPCWSTR, C.POINTER(STARTUPINFO), C.POINTER(PROCESS_INFORMATION)])
resume = api('ResumeThread', W.DWORD, [W.HANDLE])
terminate_process = api('TerminateProcess', W.BOOL, [W.HANDLE, W.UINT])
get_exit = api('GetExitCodeProcess', W.BOOL, [W.HANDLE, C.POINTER(W.DWORD)])
get_std = api('GetStdHandle', W.HANDLE, [W.DWORD])

def checked(value, what):
    if not value: raise OSError(C.get_last_error(), what)
    return value
def active(job):
    info = ACCOUNTING()
    checked(query_job(job, 1, C.byref(info), C.sizeof(info), None), 'query owned job')
    return info.ActiveProcesses
def check_paths(root):
    # Includes non-symlink Windows reparse points; hardlinks cannot redirect writes.
    # Check a directory before enumerating it, never after expanding an rglob.
    def inspect(item):
        if not item.exists() and not item.is_symlink(): return False
        st = item.lstat()
        if getattr(st, 'st_file_attributes', 0) & 0x400 or (item.is_file() and st.st_nlink != 1):
            raise RuntimeError('scratch path contains a reparse point or hardlink: ' + str(item))
        return item.is_dir()
    for item in reversed(root.parents): inspect(item)
    def visit(item):
        if inspect(item):
            for child in item.iterdir(): visit(child)
    visit(root)

def check_research_paths(root):
    # Research reads only these control files; actual inputs are authenticated by
    # the research reader and fresh CPP/replay bracket in the supervised child.
    def inspect(item, directory=False):
        try: st = item.lstat()
        except FileNotFoundError: return
        if getattr(st, 'st_file_attributes', 0) & 0x400:
            raise RuntimeError('research control path contains a reparse point: ' + str(item))
        if directory:
            if not item.is_dir(): raise RuntimeError('research ancestor is not a directory: ' + str(item))
        elif not item.is_file() or st.st_nlink != 1:
            raise RuntimeError('research control path is nonregular or hardlinked: ' + str(item))
        if os.path.normcase(os.path.realpath(item)) != os.path.normcase(os.path.abspath(item)):
            raise RuntimeError('research control path alias: ' + str(item))
    for item in reversed(root.parents): inspect(item, True)
    inspect(root, True)
    for name in ('workbench.sqlite', 'workbench.sqlite-wal', 'workbench.sqlite-shm', 'workbench.sqlite-journal', '.private-guard.json'):
        inspect(root / name)

def validate_entry(repository, command):
    # Pre-child drift check; this already-interpreted guard is trusted. Node's
    # sealed-byte reader and closing checks provide the remaining code checks.
    def same(a, b):
        return os.path.normcase(os.path.abspath(a)) == os.path.normcase(os.path.abspath(b))
    def plain(file):
        for parent in reversed(file.parents): inspect_watch_path(parent, True)
        inspect_watch_path(file, False)
    guard = Path(os.path.abspath(__file__))
    plain(guard)
    live = repository / 'tools' / 'matching_workbench' / 'private_guard.py'
    if same(guard, live):
        return same(command[1], repository / 'tools' / 'match.js')
    bundle = guard.parent.parent.parent
    version = bundle.name
    expected = repository / 'build' / 'matching-tools' / version
    if not same(bundle, expected) or not same(guard, expected / 'tools' / 'matching_workbench' / 'private_guard.py'):
        raise RuntimeError('guard placement/repository differs')
    if not 16 <= len(version) <= 64 or any(c not in '0123456789abcdef' for c in version):
        raise RuntimeError('guard bundle version differs')
    descriptor_file = bundle / 'bundle.json'
    plain(descriptor_file)
    raw = descriptor_file.read_bytes()
    identity = hashlib.sha256(raw).hexdigest().upper()
    descriptor = json.loads(raw)
    if descriptor.get('schemaVersion') != 1 or not identity.lower().startswith(version):
        raise RuntimeError('guard bundle descriptor differs')
    positions = [i for i, token in enumerate(command) if token == '--inputs']
    if len(positions) != 1 or positions[0] + 1 >= len(command) or command[positions[0] + 1].startswith('--'):
        raise RuntimeError('guard bundle requires one inputs')
    manifest_file = Path(os.path.abspath(repository / command[positions[0] + 1]))
    plain(manifest_file)
    manifest = json.loads(manifest_file.read_bytes())
    if manifest.get('schemaVersion') != 2 or manifest.get('bundle') != {'version': version, 'descriptorSha256': identity}:
        raise RuntimeError('guard selected bundle differs')
    members = descriptor.get('members')
    if not isinstance(members, list): raise RuntimeError('guard member census')
    seen = set()
    for record in members:
        name = record.get('path')
        if not isinstance(name, str) or not name or '\\' in name or ':' in name or name.startswith('/') or any(p in ('', '.', '..') or p.endswith(('.', ' ')) for p in name.split('/')):
            raise RuntimeError('guard invalid member path')
        physical = os.path.normcase(os.path.abspath(bundle / name))
        if physical in seen: raise RuntimeError('guard duplicate member alias')
        seen.add(physical)
    for name, kind in [('tools/matching_workbench/private_guard.py', 'python'), ('tools/match.js', 'javascript')]:
        records = [r for r in members if same(bundle / r['path'], bundle / name)]
        if len(records) != 1 or records[0]['path'] != name or records[0].get('kind') != kind:
            raise RuntimeError('guard executable member identity')
        file = bundle / name
        plain(file)
        data = file.read_bytes()
        if records[0].get('bytes') != len(data) or records[0].get('sha256') != hashlib.sha256(data).hexdigest().upper():
            raise RuntimeError('guard executable member drift')
    node_record = descriptor.get('node', {})
    node = Path(command[0])
    if not node.is_absolute() or not isinstance(node_record.get('path'), str) or not Path(node_record['path']).is_absolute() or not same(node, node_record['path']):
        raise RuntimeError('guard Node path differs')
    plain(node)
    config_file = repository / 'config' / 'phase7' / 'conventional-build.json'
    plain(config_file)
    config = json.loads(config_file.read_bytes())
    node_hash = hashlib.sha256(node.read_bytes()).hexdigest().upper()
    if node_hash != node_record.get('sha256') or node_hash != config.get('host', {}).get('nodeExeSha256'):
        raise RuntimeError('guard Node pin differs')
    return same(command[1], bundle / 'tools' / 'match.js')

def validate_research_command(args):
    root = Path(os.path.abspath(args.root))
    repository = root.parent.parent.parent
    command = args.command
    if args.native or len(command) < 3 or command[2] != 'intake' or not validate_entry(repository, command):
        raise RuntimeError('research admission requires the intake CLI')
    positions = [i for i, token in enumerate(command) if token == '--scratch-root']
    if len(positions) != 1 or positions[0] + 1 >= len(command):
        raise RuntimeError('research admission requires one scratch-root')
    requested = os.path.abspath(repository / command[positions[0] + 1])
    if os.path.normcase(requested) != os.path.normcase(str(root)):
        raise RuntimeError('research admission command/root mismatch')
    return hashlib.sha256(json.dumps(command, ensure_ascii=False, separators=(',', ':')).encode('utf-8')).hexdigest()

def inspect_watch_path(item, directory=None, missing=False):
    try: value = item.lstat()
    except FileNotFoundError:
        if missing: return None
        raise
    is_directory = stat.S_ISDIR(value.st_mode)
    is_file = stat.S_ISREG(value.st_mode)
    if getattr(value, 'st_file_attributes', 0) & 0x400 or stat.S_ISLNK(value.st_mode):
        raise RuntimeError('strict watch path is a reparse point or link: ' + str(item))
    if not (is_directory or is_file) or is_file and value.st_nlink != 1:
        raise RuntimeError('strict watch path is nonregular or hardlinked: ' + str(item))
    if directory is True and not is_directory or directory is False and not is_file:
        raise RuntimeError('strict watch path type differs: ' + str(item))
    if os.path.normcase(os.path.realpath(item)) != os.path.normcase(os.path.abspath(item)):
        raise RuntimeError('strict watch path alias: ' + str(item))
    return is_directory

def check_watch_controls(root):
    for item in reversed(root.parents): inspect_watch_path(item, True, True)
    inspect_watch_path(root, True, True)
    for name in ('workbench.sqlite', 'workbench.sqlite-wal', 'workbench.sqlite-shm', 'workbench.sqlite-journal', '.private-guard.json'):
        inspect_watch_path(root / name, False, True)

def check_watch_paths(root):
    # Union of the original JS regular/alias and Python Windows-reparse checks.
    for item in reversed(root.parents): inspect_watch_path(item, True)
    def visit(item):
        if inspect_watch_path(item):
            for child in item.iterdir(): visit(child)
    visit(root)

def validate_watch_command(args):
    root = Path(os.path.abspath(args.root))
    repository = root.parent.parent.parent
    command = args.command
    if len(command) < 4 or command[2] not in ('watch', 'probe') or not validate_entry(repository, command):
        raise RuntimeError('strict watch admission requires the watch CLI')
    def argument(name, optional=False):
        positions = [i for i, token in enumerate(command) if token == name]
        if optional and not positions: return None
        if len(positions) != 1 or positions[0] + 1 >= len(command) or command[positions[0] + 1].startswith('--'):
            raise RuntimeError('strict watch requires one ' + name)
        return command[positions[0] + 1]
    requested = os.path.abspath(repository / argument('--scratch-root'))
    if os.path.normcase(requested) != os.path.normcase(str(root)):
        raise RuntimeError('strict watch command/root mismatch')
    source = os.path.abspath(repository / argument('--source'))
    relative = os.path.relpath(source, root)
    if relative == '.' or relative == '..' or relative.startswith('..' + os.sep) or os.path.isabs(relative):
        raise RuntimeError('strict watch source escapes root')
    mode = argument('--native-concurrency', True) or 'parallel'
    if mode not in ('parallel', 'serial') or bool(args.native) != (mode == 'serial'):
        raise RuntimeError('strict watch scheduling mismatch')
    expected_key = hashlib.sha256(str(root).lower().encode('utf-8')).hexdigest()
    if args.root_key != expected_key: raise RuntimeError('strict watch root key differs')
    return hashlib.sha256(json.dumps(command, ensure_ascii=False, separators=(',', ':')).encode('utf-8')).hexdigest()

def run(args):
    opening_started = time.monotonic()
    command_sha256 = validate_research_command(args) if args.research_intake else validate_watch_command(args) if args.strict_watch or args.candidate_diagnostic else None
    deadline = time.monotonic() + args.wait_ms / 1000
    parent = checked(open_process(0x100000, False, args.parent), 'open invoking process')
    held, jobs = [], []
    pi = PROCESS_INFORMATION()
    marker = Path(args.root) / '.private-guard.json'
    marker_written = False
    try:
        names = [('root-' + args.root_key, 0)]
        native_key = hashlib.sha256(str(Path(args.root).parent.resolve()).lower().encode()).hexdigest()
        if args.native: names.append(('native-' + native_key, args.wait_ms))
        for name, timeout in names:
            mutex = checked(create_mutex(None, False, 'Global\\OB64-private-' + name), 'create private mutex')
            mutex_deadline = time.monotonic() + timeout / 1000
            while True:
                result = wait(mutex, min(50, max(0, int((mutex_deadline - time.monotonic()) * 1000))))
                if result != 0x102 or time.monotonic() >= mutex_deadline: break
                if wait(parent, 0) == 0:
                    close(mutex)
                    raise RuntimeError('invoking process exited while waiting for native serialization')
            if result not in (0, 0x80):
                close(mutex)
                raise RuntimeError('private workspace busy' if timeout == 0 else 'native serialization wait timed out')
            held.append(mutex)
            # Even normal mutex acquisition can follow a vanished last mutex handle.
            # Always inspect the existing job before a successor gains write access.
            while True:
                job = checked(create_job(None, 'Global\\OB64-private-job-' + name), 'create private job')
                try:
                    if not active(job): break
                except BaseException:
                    close(job)
                    raise
                # Do not keep the abandoned job alive: closing our inspection
                # handle permits kill-on-last-handle-close after a guard crash.
                close(job)
                if time.monotonic() >= deadline: raise RuntimeError('previous private job has not drained')
                if wait(parent, 0) == 0: raise RuntimeError('invoking process exited while waiting')
                time.sleep(.01)
            jobs.append(job)
        limits = EXTENDED_LIMIT()
        limits.BasicLimitInformation.LimitFlags = 0x2000  # KILL_ON_JOB_CLOSE; no breakaway allowed.
        checked(set_job(jobs[0], 9, C.byref(limits), C.sizeof(limits)), 'enable kill-on-close')
        root = Path(args.root)
        if args.strict_watch or args.candidate_diagnostic:
            check_watch_controls(root)
            root.mkdir(parents=True, exist_ok=True)
            if not args.candidate_diagnostic:
                check_watch_paths(root)
        else:
            inspect_paths = check_research_paths if args.research_intake else check_paths
            inspect_paths(root)
            root.mkdir(parents=True, exist_ok=True)
            inspect_paths(root)
        si = STARTUPINFO(); si.cb = C.sizeof(si)
        si.dwFlags = 0x100
        si.hStdInput, si.hStdOutput, si.hStdError = [get_std(n & 0xffffffff) for n in (-10, -11, -12)]
        command = C.create_unicode_buffer(subprocess.list2cmdline(args.command))
        checked(create_process(None, command, None, None, True, 0x4 | 0x08000000, None, None, C.byref(si), C.byref(pi)), 'create suspended private command')
        for job in jobs: checked(assign_job(job, pi.hProcess), 'assign private job (nested Job Objects required)')
        ticket = {'pid': pi.dwProcessId, 'supervisorPid': os.getpid(), 'rootKey': args.root_key, 'native': bool(args.native)}
        if args.research_intake:
            check_research_paths(root)
            ticket.update({'admission': 'research-intake', 'commandSha256': command_sha256})
        elif args.strict_watch or args.candidate_diagnostic:
            check_watch_controls(root)
            ticket.update({'admission': 'candidate-diagnostic-v1' if args.candidate_diagnostic else 'strict-watch-v1', 'commandSha256': command_sha256})
        if args.candidate_diagnostic:
            ticket['timings'] = {'parentProcessBeforeSupervisorMs': args.parent_elapsed_ms, 'supervisorOpeningMs': (time.monotonic() - opening_started) * 1000}
        marker.write_text(json.dumps(ticket), encoding='utf-8')
        marker_written = True
        if resume(pi.hThread) == 0xffffffff: raise OSError(C.get_last_error(), 'resume private command')
        while wait(pi.hProcess, 20) != 0:
            if wait(parent, 0) == 0: raise RuntimeError('invoking process exited; cancelled owned private command')
        code = W.DWORD()
        checked(get_exit(pi.hProcess, C.byref(code)), 'read private command exit')
        return code.value
    finally:
        cleanup_failed = False
        if pi.hProcess:
            # A containment failure leaves a suspended process outside our job.
            terminate_process(pi.hProcess, 1)
            if jobs: terminate_job(jobs[0], 1)
            if wait(pi.hProcess, 5000) != 0: cleanup_failed = True
            if jobs:
                cleanup_deadline = time.monotonic() + 5
                while active(jobs[0]) and time.monotonic() < cleanup_deadline: time.sleep(.01)
                if active(jobs[0]):
                    # Closing our handle requests termination again. Successors
                    # still cannot start until the named job reports no members.
                    print('private guard: owned job cleanup exceeded five seconds; successors remain blocked until it drains', file=sys.stderr)
                    cleanup_failed = True
            close(pi.hThread); close(pi.hProcess)
        if marker_written:
            if not args.research_intake: marker.unlink(missing_ok=True)
            else:
                try:
                    check_research_paths(Path(args.root))
                    marker.unlink(missing_ok=True)
                except Exception as error:
                    cleanup_failed = True
                    print('private guard: ticket cleanup rejected: ' + str(error), file=sys.stderr)
        for job in reversed(jobs): close(job)
        for mutex in reversed(held): release_mutex(mutex); close(mutex)
        close(parent)
        if cleanup_failed: raise RuntimeError('owned command termination did not finish within bounded cleanup')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--parent', type=int, required=True)
    parser.add_argument('--root-key', required=True)
    parser.add_argument('--root', required=True)
    parser.add_argument('--wait-ms', type=int, default=120000)
    parser.add_argument('--native', action='store_true')
    parser.add_argument('--parent-elapsed-ms', type=float, default=0)
    admission = parser.add_mutually_exclusive_group()
    admission.add_argument('--research-intake', action='store_true')
    admission.add_argument('--strict-watch', action='store_true')
    admission.add_argument('--candidate-diagnostic', action='store_true')
    parser.add_argument('command', nargs=argparse.REMAINDER)
    args = parser.parse_args()
    if args.command and args.command[0] == '--': args.command.pop(0)
    if not args.command or not 0 <= args.wait_ms <= 300000: parser.error('invalid command or bounded wait')
    try: return run(args)
    except Exception as error:
        print('private guard: ' + str(error), file=sys.stderr)
        return 1
if __name__ == '__main__': sys.exit(main())
