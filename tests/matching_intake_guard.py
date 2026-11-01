"""Intake admission falsifiers over owned scratch postimages; no native compiler."""
import ctypes
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import tempfile

ROOT = Path.cwd()
(ROOT / 'build/tests').mkdir(parents=True, exist_ok=True)
if os.environ.get('OB64_TEST_GUARD_ROOT'):
    REPO = Path(os.environ['OB64_TEST_GUARD_ROOT'])
    REPO.mkdir()
else:
    REPO = Path(tempfile.mkdtemp(prefix='ig-', dir=ROOT / 'build/tests'))
OUT = REPO
(REPO / 'tools').mkdir()
NODE = ROOT / '.toolchains/node-v24.13.1-win-x64/node.exe'
GUARD = Path(os.environ.get('OB64_TEST_GUARD', str(ROOT / 'tools/matching_workbench/private_guard.py')))
API = ROOT / 'tools/lib/matching/private_workspace.js'
ENTRY = REPO / 'tools/match.js'
WORK = REPO / 'build/matching/w1'
ENTRY.write_text('''const fs=require('fs'),path=require('path'),cp=require('child_process');
const api=require(%s),root=path.resolve(__dirname,'..');
const w=api.resolvePrivateWorkspace({root,scratchRoot:process.argv[4],command:'intake'});
if(process.env.OB64_PRIVATE_GUARD&&process.env.BAD_TICKET){
 const file=path.join(w.matchingRoot,'.private-guard.json'),ticket=JSON.parse(fs.readFileSync(file));
 ticket[process.env.BAD_TICKET]='wrong';fs.writeFileSync(file,JSON.stringify(ticket));
}
api.withPrivateWorkspace(w,{python:%s,guardPath:%s,isolatedPython:true,native:process.env.BAD_NATIVE==='1'},async()=>{
 if(process.env.NESTED==='1'){
  const nested=cp.spawnSync(process.execPath,process.argv.slice(1),{encoding:'utf8',env:{...process.env,NESTED:'2'}});
  if(nested.status===0||!nested.stderr.includes('identity mismatch'))throw Error('nested admission succeeded');
 }
 let grandchild;
 if(process.env.TREE||process.env.ORPHAN){const child=cp.spawn(process.execPath,['-e','setTimeout(()=>{},30000)'],{stdio:'ignore',windowsHide:true});grandchild=child.pid;if(process.env.ORPHAN)child.unref();}
 console.log(JSON.stringify({pid:process.pid,grandchild,ok:true}));
 if(process.env.TREE)await new Promise(()=>{});
 if(process.env.HOLD)await new Promise(resolve=>{const timer=setInterval(()=>{if(fs.existsSync(path.join(root,'release'))){clearInterval(timer);resolve();}},10);});
}).catch(error=>{console.error(error.message);process.exitCode=1;});
''' % (json.dumps(str(API)), json.dumps(sys.executable), json.dumps(str(GUARD))))

results = []
children = []
def start(extra=None, scratch='build/matching/w1'):
    env = {**os.environ, **(extra or {})}
    child = subprocess.Popen([str(NODE), str(ENTRY), 'intake', '--scratch-root', scratch], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env)
    children.append(child)
    return child

def run(name, extra=None, reject=False, scratch='build/matching/w1'):
    child = start(extra, scratch)
    stdout, stderr = child.communicate(timeout=15)
    assert (child.returncode != 0) == reject, (name, child.returncode, stdout, stderr)
    if reject: assert not stdout, (name, stdout)
    results.append({'name': name, 'result': 'rejected' if reject else 'passed'})
    return stdout, stderr

def dead(pid):
    k = ctypes.WinDLL('kernel32', use_last_error=True)
    k.OpenProcess.restype = ctypes.c_void_p
    k.OpenProcess.argtypes = [ctypes.c_ulong, ctypes.c_int, ctypes.c_ulong]
    k.WaitForSingleObject.argtypes = [ctypes.c_void_p, ctypes.c_ulong]
    k.CloseHandle.argtypes = [ctypes.c_void_p]
    handle = k.OpenProcess(0x100000, False, pid)
    if handle:
        assert k.WaitForSingleObject(handle, 5000) == 0, pid
        k.CloseHandle(handle)

try:
    run('normal research callback')
    assert not (WORK / '.private-guard.json').exists()
    for field in ('pid', 'supervisorPid', 'rootKey', 'native', 'admission', 'commandSha256'):
        run('wrong ticket ' + field, {'BAD_TICKET': field}, True)
        assert not (WORK / '.private-guard.json').exists()
    run('inherited nested marker', {'NESTED': '1'})
    run('forged marker', {'OB64_PRIVATE_GUARD': 'forged'}, True)
    run('research native request', {'BAD_NATIVE': '1'}, True)
    payload = REPO / 'payload'; payload.write_text('owned data')
    for name in ('workbench.sqlite', 'workbench.sqlite-wal', 'workbench.sqlite-shm', 'workbench.sqlite-journal', '.private-guard.json'):
        destination = WORK / name
        os.link(payload, destination)
        run('control hardlink ' + name, reject=True)
        destination.unlink()  # Explicit single link, no recursive remover.
    for target, name in ((REPO / 'tools', 'existing'), (REPO / 'missing', 'dangling')):
        link = WORK.parent / 'w2'
        subprocess.run(['cmd', '/c', 'mklink', '/J', str(link), str(target)], check=True, capture_output=True)
        run(name + ' root junction', reject=True, scratch='build/matching/w2')
        assert getattr(link.lstat(), 'st_file_attributes', 0) & 0x400
        assert os.path.normcase(os.path.realpath(link)) == os.path.normcase(str(target))
        os.rmdir(link)  # Detach the verified junction itself; never visit target.
    os.link(payload, WORK / 'unrelated-hardlink')
    run('unconsumed hardlink is outside research admission')
    strict = subprocess.run([str(NODE), '-e', 'require('+json.dumps(str(API))+').resolvePrivateWorkspace({root:'+json.dumps(str(REPO))+',scratchRoot:"build/matching/w1"})'], capture_output=True, text=True)
    assert strict.returncode != 0 and 'hardlink' in strict.stderr
    results.append({'name': 'strict mode still rejects unconsumed hardlink', 'result': 'rejected'})
    (WORK / 'unrelated-hardlink').unlink()
    held = start({'HOLD': '1'}); json.loads(held.stdout.readline())
    run('same research root contention', reject=True)
    (REPO / 'release').write_text('release')
    assert held.communicate(timeout=10)[1] == '' and held.returncode == 0
    orphan = start({'ORPHAN': '1'}); ids = json.loads(orphan.stdout.readline())
    assert orphan.communicate(timeout=10)[1] == '' and orphan.returncode == 0
    dead(ids['grandchild']); results.append({'name': 'research orphan descendants killed', 'result': 'passed'})
    tree = start({'TREE': '1'}); ids = json.loads(tree.stdout.readline()); tree.kill(); tree.communicate(timeout=10)
    dead(ids['pid']); dead(ids['grandchild'])
    # Host termination may leave the regular ticket in both installed and new
    # paths (cancel-diagnostic.json). Job drain, never a ticket/PID guess, grants
    # the successor authority; successful recovery must remove its own ticket.
    results.append({'name': 'research cancelled process tree terminated', 'result': 'passed', 'staleTicketAfterHostTermination': (WORK / '.private-guard.json').exists()})
    run('research successor after cancellation')
    assert not (WORK / '.private-guard.json').exists()
    base = [sys.executable, '-I', '-S', str(GUARD), '--parent', str(os.getpid()), '--root-key', 'invalid-research-command', '--root', str(WORK), '--research-intake']
    for name, command in [('wrong command', [str(NODE), str(ENTRY), 'watch', '--scratch-root', 'build/matching/w1']), ('wrong root', [str(NODE), str(ENTRY), 'intake', '--scratch-root', 'build/matching/w2'])]:
        invalid = subprocess.run(base + ['--'] + command, capture_output=True, text=True)
        assert invalid.returncode != 0 and not invalid.stdout
        results.append({'name': name, 'result': 'rejected'})
    report = {'status': 'pass', 'checks': len(results), 'scope': 'Owned fake entrypoint exercises exact guard admission/lifecycle; actual guarded intake separately benchmarked; no native compiler', 'results': results}
    (OUT / 'guard-intake.json').write_text(json.dumps(report, indent=2))
    print(json.dumps(report))
finally:
    for child in children:
        if child.poll() is None: child.kill()
        child.communicate(timeout=10)
