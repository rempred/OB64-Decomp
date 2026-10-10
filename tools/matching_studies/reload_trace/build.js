'use strict';
const c = require('./common'), { instrument } = require('./instrument');
const { fs, path, SOURCE, COMPILER, identity, same, fresh, write, run } = c;
const OBJECTS = ('c-parse c-lang c-lex c-pragma c-decl c-typeck c-convert c-aux-info c-common c-iterate toplev version tree print-tree stor-layout fold-const function stmt expr calls expmed explow optabs varasm rtl print-rtl rtlanal emit-rtl real dbxout sdbout dwarfout xcoffout integrate jump cse loop unroll flow stupid combine regclass local-alloc global reload reload1 caller-save insn-peep reorg sched final recog reg-stack insn-opinit insn-recog insn-extract insn-output insn-emit insn-attrtab mips getpwd convert bc-emit bc-optab obstack alloca').split(' ').map(n => n + '.obj');
const ENV_GUARDS = ['CL', '_CL_', 'LINK', '_LINK_'].map(name => 'if defined ' + name + ' exit /b 91');
function quote(value) { if (/["\r\n%]/.test(value)) throw Error('unsafe batch path'); return '"' + value + '"'; }
function captured(script, cwd, log) {
  const r = c.cp.spawnSync('cmd.exe', ['/d', '/c', script], { cwd, encoding: 'utf8', windowsHide: true, env: c.environment(), maxBuffer: 128 * 1024 * 1024 });
  write(log, (r.stdout || '') + (r.stderr || ''));
  if (r.error || r.status !== 0) throw Error('research build command failed; see ' + log + ': ' + (r.error?.message || r.status));
  return r;
}
function build() {
  const origin = c.authenticateSource(), dir = fresh('compiler'), copy = path.join(dir, 'source');
  const snapshots = path.join(dir, 'implementation-snapshot'); fs.mkdirSync(snapshots);
  for (const file of [__filename, require.resolve('./common'), require.resolve('./instrument'), require.resolve('./pe_metadata')]) fs.copyFileSync(file, path.join(snapshots, path.basename(file)), fs.constants.COPYFILE_EXCL);
  // A fresh, confined copy; old source and prior experiments are never deleted.
  fs.cpSync(SOURCE, copy, { recursive: true, filter: p => path.basename(p) !== '.git' });
  const sourceFiles = [];
  function inventory(root) { for (const item of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, item.name); if (item.isSymbolicLink()) throw Error('compiler source symlink');
    if (item.isDirectory()) inventory(file); else if (/\.(c|h|md|obj)$/i.test(item.name)) sourceFiles.push(identity(file));
  } }
  inventory(copy);
  for (const object of OBJECTS) same(identity(path.join(copy, object)).sha256, identity(path.join(SOURCE, object)).sha256, 'copied object');
  const envScript = path.join(dir, 'host.cmd');
  write(envScript, ['@echo off', 'call ' + quote(origin.vcvars.path) + ' x86', 'if errorlevel 1 exit /b %errorlevel%',
    ...ENV_GUARDS,
    'where cl', 'where link', 'echo LIB=%LIB%', 'echo INCLUDE=%INCLUDE%', 'echo VCToolsInstallDir=%VCToolsInstallDir%', 'echo WindowsSdkDir=%WindowsSdkDir%', 'echo WindowsSDKVersion=%WindowsSDKVersion%', ''].join('\r\n'));
  const hostOutput = run('cmd.exe', ['/d', '/c', envScript], { cwd: dir }).stdout; write(path.join(dir, 'host.txt'), hostOutput);
  const lines = hostOutput.split(/\r?\n/), cl = lines.find(l => /\\cl\.exe$/i.test(l)), linker = lines.find(l => /\\link\.exe$/i.test(l));
  if (!cl || !linker) throw Error('host executable capture');
  const libraries = lines.find(l => l.startsWith('LIB='))?.slice(4).split(';').filter(Boolean);
  const includes = lines.find(l => l.startsWith('INCLUDE='))?.slice(8).split(';').filter(Boolean);
  if (!libraries?.length || !includes?.length) throw Error('host build environment');
  const libs = ['libcmt.lib', 'kernel32.lib'].map(name => { const dir = libraries.find(p => fs.existsSync(path.join(p, name))); if (!dir) throw Error('missing host library ' + name); return identity(path.join(dir, name)); });
  const host = { executables: [cl, linker].map(identity), compilerDlls: fs.readdirSync(path.dirname(cl)).filter(n => /^(c1|mspdb|msobj|mspft|vcruntime).*\.dll$/i.test(n)).map(n => identity(path.join(path.dirname(cl), n))), libraries: libs, includeDirectories: includes, libraryDirectories: libraries };
  const linkArgs = ['/nologo', '/SUBSYSTEM:CONSOLE', '/Brepro', '/verbose:lib', '-out:cc1.exe', ...OBJECTS, ...libs.map(l => quote(l.path))];
  const baselineScript = path.join(dir, 'baseline.cmd');
  write(baselineScript, ['@echo off', 'call ' + quote(origin.vcvars.path) + ' x86', 'if errorlevel 1 exit /b %errorlevel%', ...ENV_GUARDS, quote(linker) + ' ' + linkArgs.join(' '), 'exit /b %errorlevel%', ''].join('\r\n'));
  const baseline = captured(baselineScript, copy, path.join(dir, 'baseline.log'));
  // Approved research-only equivalence, not reproduction of the original host.
  // The trusted left is still the EXACT pinned compiler. Every byte outside
  // independently parsed Rich/timestamp/REPRO metadata must match.
  same(identity(origin.compiler.path).sha256, COMPILER, 'trusted left compiler');
  const equivalence = require('./pe_metadata').compare(fs.readFileSync(origin.compiler.path), fs.readFileSync(path.join(copy, 'cc1.exe')));
  write(path.join(dir, 'pe-differences.json'), { trusted: origin.compiler, relinked: identity(path.join(copy, 'cc1.exe')), equivalence });
  const actualLibraries = text => [...new Set([...text.matchAll(/^\s*Searching (.+\.lib):\s*$/gmi)].map(m => m[1]))].map(identity);
  host.libraries = actualLibraries(baseline.stdout);
  if (!host.libraries.length) throw Error('missing actual link-library closure');
  const pristine = fs.readFileSync(path.join(copy, 'reload1.c'), 'utf8'), patched = instrument(pristine);
  fs.writeFileSync(path.join(copy, 'reload1.c'), patched);
  const buildScript = path.join(dir, 'trace.cmd');
  write(buildScript, ['@echo off', 'call ' + quote(origin.vcvars.path) + ' x86', 'if errorlevel 1 exit /b %errorlevel%',
    ...ENV_GUARDS,
    quote(cl) + ' -c -DCROSS_COMPILE -DIN_GCC ' + origin.buildFlags.buildCflags + ' -I. -I. -I./config /showIncludes reload1.c', 'if errorlevel 1 exit /b %errorlevel%',
    quote(linker) + ' ' + linkArgs.map(a => a === '-out:cc1.exe' ? '-out:cc1-reload-trace.exe' : a).join(' '), 'exit /b %errorlevel%', ''].join('\r\n'));
  const built = captured(buildScript, copy, path.join(dir, 'build.log'));
  same(JSON.stringify(actualLibraries(built.stdout)), JSON.stringify(host.libraries), 'trace link library closure');
  const headers = [...new Set(built.stdout.split(/\r?\n/).filter(l => /including file:/i.test(l)).map(l => path.resolve(copy, l.replace(/^.*including file:\s*/i, '').trim())))].map(identity);
  if (!headers.length) throw Error('missing actual host include closure');
  const manifest = { schemaVersion: 1, researchOnly: true, origin, host, headers, sourceFiles,
    pristineReload: { sha256: c.hash(Buffer.from(pristine)), bytes: Buffer.byteLength(pristine) },
    patchedReload: identity(path.join(copy, 'reload1.c')), implementation: [__filename, require.resolve('./common'), require.resolve('./instrument'), require.resolve('./pe_metadata')].map(identity),
    objects: OBJECTS.map(o => identity(path.join(copy, o))), baselineCompiler: identity(path.join(copy, 'cc1.exe')),
    compiler: identity(path.join(copy, 'cc1-reload-trace.exe')), scripts: [envScript, baselineScript, buildScript].map(identity),
    equivalenceReport: identity(path.join(dir, 'pe-differences.json')), provenanceBoundary: 'Copied-object executable equivalence under disclosed current host; not original host reproducibility.', untouchedSource: c.authenticateSource(), complete: true };
  write(path.join(dir, 'manifest.json'), manifest); return { dir, manifest };
}
if (require.main === module) console.log(JSON.stringify(build(), null, 2));
module.exports = { build, OBJECTS, ENV_GUARDS, quote };
