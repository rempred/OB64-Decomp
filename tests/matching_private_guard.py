"""Pure process-containment tests; never invoke the production compiler/build."""
import ctypes
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
GUARD = ROOT / 'tools' / 'matching_workbench' / 'private_guard.py'
GUARD_JS = ROOT / 'tools' / 'lib' / 'matching' / 'private_workspace.js'

@unittest.skipUnless(os.name == 'nt', 'Windows guard contract')
class GuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='ob64-guard-')
        self.root = Path(self.tmp.name)
        self.children = []
        self.script = self.root / 'child.py'
        self.script.write_text('''import json, os, subprocess, sys, time
if len(sys.argv) > 1 and sys.argv[1] in ('tree', 'orphan'):
    child = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])
    print(json.dumps({'pid': os.getpid(), 'grandchild': child.pid}), flush=True)
    if sys.argv[1] == 'tree': time.sleep(30)
else:
    print('ready', flush=True)
    time.sleep(float(sys.argv[1]) if len(sys.argv) > 1 else .1)
''')
    def tearDown(self):
        for p in self.children:
            if p.poll() is None: p.kill()
            p.communicate(timeout=10)
        self.assertEqual(self.root.resolve().parent, Path(tempfile.gettempdir()).resolve())
        self.assertTrue(self.root.name.startswith('ob64-guard-'))
        self.assertFalse(self.root.is_symlink() or (getattr(self.root.lstat(), 'st_file_attributes', 0) & 0x400))
        self.tmp.cleanup()
    def start(self, name='w1', arg='.1', native=False, parent=None):
        args = [sys.executable, str(GUARD), '--parent', str(parent or os.getpid()), '--root-key', self.root.name + name, '--root', str(self.root / name), '--wait-ms', '1500']
        if native: args.append('--native')
        p = subprocess.Popen(args + ['--', sys.executable, str(self.script), arg], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        self.children.append(p)
        return p
    def assert_dead(self, pid):
        k = ctypes.WinDLL('kernel32', use_last_error=True)
        k.OpenProcess.restype = ctypes.c_void_p
        k.OpenProcess.argtypes = [ctypes.c_ulong, ctypes.c_int, ctypes.c_ulong]
        k.WaitForSingleObject.argtypes = [ctypes.c_void_p, ctypes.c_ulong]
        k.CloseHandle.argtypes = [ctypes.c_void_p]
        h = k.OpenProcess(0x100000, False, pid)
        if h:
            self.assertEqual(k.WaitForSingleObject(h, 3000), 0)
            k.CloseHandle(h)
    def test_duplicate_and_other_root(self):
        a = self.start(arg='tree')
        ids = json.loads(a.stdout.readline())
        duplicate = self.start()
        _, err = duplicate.communicate(timeout=5)
        self.assertNotEqual(duplicate.returncode, 0)
        self.assertIn('busy', err)
        b = self.start('w2')
        self.assertEqual(b.stdout.readline().strip(), 'ready')
        self.assertIsNone(a.poll())
        self.assertEqual(b.wait(timeout=5), 0)
        a.kill(); a.wait(timeout=5)
        self.assert_dead(ids['pid']); self.assert_dead(ids['grandchild'])
    def test_serial_native(self):
        a = self.start(arg='.4', native=True)
        self.assertEqual(a.stdout.readline().strip(), 'ready')
        started = time.monotonic()
        b = self.start('w2', native=True)
        self.assertEqual(b.stdout.readline().strip(), 'ready')
        self.assertGreater(time.monotonic() - started, .3)
        self.assertEqual(a.wait(timeout=5), 0)
        self.assertEqual(b.wait(timeout=5), 0)
    def test_cli_default_parallel_keeps_root_exclusion(self):
        driver = self.root / 'parallel.js'
        driver.write_text('''const fs=require('fs'),path=require('path');
const api=require(%s);
const name=process.argv[2];
const w=api.resolvePrivateWorkspace({root:__dirname,scratchRoot:'build/matching/'+name});
api.withPrivateWorkspace(w,{native:true,python:%s,guardPath:%s,waitMs:500},async()=>{
  console.log(JSON.stringify({root:name,nativeConcurrency:w.nativeConcurrency}));
  await new Promise(resolve=>{const timer=setInterval(()=>{
    if(fs.existsSync(path.join(__dirname,'release-'+name))){clearInterval(timer);resolve();}
  },20);});
}).catch(e=>{console.error(e.message);process.exitCode=1;});
''' % (json.dumps(str(GUARD_JS)), json.dumps(sys.executable), json.dumps(str(GUARD))))
        def launch(name):
            child = subprocess.Popen(['node', str(driver), name], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            self.children.append(child)
            return child
        a = launch('w1')
        self.assertEqual(json.loads(a.stdout.readline())['nativeConcurrency'], 'parallel')
        b = launch('w2')
        self.assertEqual(json.loads(b.stdout.readline())['nativeConcurrency'], 'parallel')
        self.assertIsNone(a.poll())
        self.assertIsNone(b.poll())
        duplicate = launch('w1')
        _, err = duplicate.communicate(timeout=5)
        self.assertNotEqual(duplicate.returncode, 0)
        self.assertIn('busy', err)
        for name in ('w1', 'w2'): (self.root / ('release-' + name)).write_text('release')
        self.assertEqual(a.wait(timeout=5), 0)
        self.assertEqual(b.wait(timeout=5), 0)
    def test_native_wait_is_bounded(self):
        a = self.start(arg='tree', native=True)
        json.loads(a.stdout.readline())
        started = time.monotonic()
        b = self.start('w2', native=True)
        _, err = b.communicate(timeout=5)
        self.assertNotEqual(b.returncode, 0)
        self.assertIn('timed out', err)
        self.assertLess(time.monotonic() - started, 4)
    def test_parent_death_while_waiting_native(self):
        a = self.start(arg='tree', native=True)
        json.loads(a.stdout.readline())
        parent = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])
        self.children.append(parent)
        b = self.start('w2', native=True, parent=parent.pid)
        time.sleep(.4)
        parent.kill(); parent.wait(timeout=5)
        _, err = b.communicate(timeout=3)
        self.assertNotEqual(b.returncode, 0)
        self.assertIn('invoking process exited while waiting', err)
        self.assertIsNone(a.poll())
    def test_successful_parent_cannot_leave_orphan_writers(self):
        a = self.start(arg='orphan')
        ids = json.loads(a.stdout.readline())
        self.assertEqual(a.wait(timeout=5), 0)
        self.assert_dead(ids['grandchild'])
        b = self.start(); self.assertEqual(b.wait(timeout=5), 0)
    def test_supervisor_crash_kills_descendants_before_recovery(self):
        a = self.start(arg='tree', native=True)
        ids = json.loads(a.stdout.readline())
        a.kill(); a.wait(timeout=5)
        b = self.start(native=True)
        self.assertEqual(b.stdout.readline().strip(), 'ready')
        self.assert_dead(ids['pid']); self.assert_dead(ids['grandchild'])
        self.assertEqual(b.wait(timeout=5), 0)
    def test_parent_cancellation_kills_only_owned_tree(self):
        parent = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])
        unrelated = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])
        self.children += [parent, unrelated]
        a = self.start(arg='tree', parent=parent.pid)
        ids = json.loads(a.stdout.readline())
        parent.kill(); parent.wait(timeout=5)
        a.communicate(timeout=5)
        self.assertNotEqual(a.returncode, 0)
        self.assert_dead(ids['pid']); self.assert_dead(ids['grandchild'])
        self.assertIsNone(unrelated.poll())
        b = self.start(); self.assertEqual(b.wait(timeout=5), 0)
    def test_cli_reentry_and_nested_marker_rejected(self):
        driver = self.root / 'driver.js'
        driver.write_text('''const {spawnSync}=require('child_process');
const api=require(%s);
const w=api.resolvePrivateWorkspace({root:__dirname,scratchRoot:'build/matching/w1'});
api.withPrivateWorkspace(w,{python:%s,guardPath:%s,waitMs:1500},()=>{
  if(process.env.TEST_NESTED) throw Error('nested incorrectly acquired');
  const nested=spawnSync(process.execPath,[__filename],{encoding:'utf8',env:{...process.env,TEST_NESTED:'1'}});
  if(nested.status===0 || !nested.stderr.includes('identity mismatch')) throw Error('nested guard was not rejected: '+nested.stderr);
  console.log('guarded callback');
}).catch(e=>{console.error(e.message);process.exitCode=1;});
''' % (json.dumps(str(GUARD_JS)), json.dumps(sys.executable), json.dumps(str(GUARD))))
        result = subprocess.run(['node', str(driver)], capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.strip(), 'guarded callback')
        forged = subprocess.run(['node', str(driver)], capture_output=True, text=True, timeout=10, env={**os.environ, 'OB64_PRIVATE_GUARD': 'forged'})
        self.assertNotEqual(forged.returncode, 0)
        self.assertIn('context differs', forged.stderr)

if __name__ == '__main__': unittest.main()
