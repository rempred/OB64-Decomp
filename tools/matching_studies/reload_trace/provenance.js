'use strict';
const c = require('./common'), { fs, path, identity, same } = c;
function authenticateManifest(file) {
  c.environment(); c.contained(file);
  const m = JSON.parse(fs.readFileSync(file)), root = path.dirname(path.resolve(file)), copy = path.join(root, 'source');
  if (m.schemaVersion !== 1 || m.researchOnly !== true || m.complete !== true) throw Error('research build manifest');
  const origin = c.authenticateSource();
  same(JSON.stringify(m.origin), JSON.stringify(origin), 'authenticated source origin');
  same(JSON.stringify(m.untouchedSource), JSON.stringify(origin), 'unchanged source origin');
  const verify = item => same(identity(item.path).sha256, item.sha256, 'build closure changed: ' + item.path);
  const at = (item, expected) => { same(path.resolve(item.path), expected, 'build path'); c.contained(item.path, root); verify(item); };
  at(m.compiler, path.join(copy, 'cc1-reload-trace.exe'));
  at(m.baselineCompiler, path.join(copy, 'cc1.exe'));
  at(m.patchedReload, path.join(copy, 'reload1.c'));
  const pristine = fs.readFileSync(path.join(c.SOURCE, 'reload1.c'));
  same(m.pristineReload.sha256, c.hash(pristine), 'pristine reload hash'); same(m.pristineReload.bytes, pristine.length, 'pristine reload size');
  same(fs.readFileSync(m.patchedReload.path, 'utf8'), require('./instrument').instrument(pristine.toString()), 'rederived instrumentation');
  const expectedFiles = [];
  function inventory(dir) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git') continue;
    if (e.isSymbolicLink()) throw Error('source symlink');
    const p = path.join(dir, e.name); if (e.isDirectory()) inventory(p); else if (/\.(c|h|md|obj)$/i.test(e.name)) expectedFiles.push(p);
  } }
  inventory(c.SOURCE);
  same(m.sourceFiles.length, expectedFiles.length, 'source inventory completeness');
  for (let i = 0; i < expectedFiles.length; i++) {
    const relative = path.relative(c.SOURCE, expectedFiles[i]), item = m.sourceFiles[i];
    same(path.resolve(item.path), path.join(copy, relative), 'source inventory path');
    same(item.sha256, identity(expectedFiles[i]).sha256, 'original source/object inventory');
    if (!['reload1.c', 'reload1.obj'].includes(relative)) { c.contained(item.path, root); verify(item); }
  }
  const { OBJECTS, ENV_GUARDS, quote } = require('./build');
  same(m.objects.length, OBJECTS.length, 'ordered object count');
  m.objects.forEach((item, i) => { at(item, path.join(copy, OBJECTS[i])); if (OBJECTS[i] !== 'reload1.obj') same(item.sha256, identity(path.join(c.SOURCE, OBJECTS[i])).sha256, 'unchanged copied object'); });
  for (const item of [...m.headers, ...m.host.executables, ...m.host.compilerDlls, ...m.host.libraries]) verify(item);
  same(m.implementation.length, 4, 'build implementation count');
  for (const [i, name] of ['build.js', 'common.js', 'instrument.js', 'pe_metadata.js'].entries()) {
    same(path.resolve(m.implementation[i].path), path.join(__dirname, name), 'implementation path');
    const snapshot = path.join(root, 'implementation-snapshot', name); c.contained(snapshot, root);
    same(identity(snapshot).sha256, m.implementation[i].sha256, 'recorded build implementation snapshot');
    if (['instrument.js', 'pe_metadata.js'].includes(name)) same(identity(path.join(__dirname, name)).sha256, m.implementation[i].sha256, 'observer/equivalence implementation changed');
  }
  const hostText = fs.readFileSync(path.join(root, 'host.txt'), 'utf8'), lines = hostText.split(/\r?\n/);
  const cl = lines.find(l => /\\cl\.exe$/i.test(l)), linker = lines.find(l => /\\link\.exe$/i.test(l));
  same(JSON.stringify(m.host.executables), JSON.stringify([cl, linker].map(identity)), 'captured host executables');
  for (const [key, field] of [['LIB', 'libraryDirectories'], ['INCLUDE', 'includeDirectories']]) same(JSON.stringify(m.host[field]), JSON.stringify(lines.find(l => l.startsWith(key + '='))?.slice(key.length + 1).split(';').filter(Boolean)), 'host search directories');
  const dlls = fs.readdirSync(path.dirname(cl)).filter(n => /^(c1|mspdb|msobj|mspft|vcruntime).*\.dll$/i.test(n)).map(n => identity(path.join(path.dirname(cl), n)));
  same(JSON.stringify(m.host.compilerDlls), JSON.stringify(dlls), 'host DLL closure');
  const libs = ['libcmt.lib', 'kernel32.lib'].map(name => { const dir = m.host.libraryDirectories.find(p => fs.existsSync(path.join(p, name))); if (!dir) throw Error('missing host library'); return path.join(dir, name); });
  const preamble = ['@echo off', 'call ' + quote(origin.vcvars.path) + ' x86', 'if errorlevel 1 exit /b %errorlevel%', ...ENV_GUARDS];
  const args = ['/nologo', '/SUBSYSTEM:CONSOLE', '/Brepro', '/verbose:lib', '-out:cc1.exe', ...OBJECTS, ...libs.map(quote)];
  const expectedScripts = [
    [...preamble, 'where cl', 'where link', 'echo LIB=%LIB%', 'echo INCLUDE=%INCLUDE%', 'echo VCToolsInstallDir=%VCToolsInstallDir%', 'echo WindowsSdkDir=%WindowsSdkDir%', 'echo WindowsSDKVersion=%WindowsSDKVersion%', ''],
    [...preamble, quote(linker) + ' ' + args.join(' '), 'exit /b %errorlevel%', ''],
    [...preamble, quote(cl) + ' -c -DCROSS_COMPILE -DIN_GCC ' + origin.buildFlags.buildCflags + ' -I. -I. -I./config /showIncludes reload1.c', 'if errorlevel 1 exit /b %errorlevel%', quote(linker) + ' ' + args.map(a => a === '-out:cc1.exe' ? '-out:cc1-reload-trace.exe' : a).join(' '), 'exit /b %errorlevel%', ''],
  ];
  same(m.scripts.length, 3, 'script count');
  for (const [i, name] of ['host.cmd', 'baseline.cmd', 'trace.cmd'].entries()) { at(m.scripts[i], path.join(root, name)); same(fs.readFileSync(m.scripts[i].path, 'utf8'), expectedScripts[i].join('\r\n'), 'rederived build script'); }
  const baselineLog = fs.readFileSync(path.join(root, 'baseline.log'), 'utf8'), buildLog = fs.readFileSync(path.join(root, 'build.log'), 'utf8');
  const libraries = text => [...new Set([...text.matchAll(/^\s*Searching (.+\.lib):\s*$/gmi)].map(v => v[1]))].map(identity);
  for (const log of [baselineLog, buildLog]) same(JSON.stringify(libraries(log)), JSON.stringify(m.host.libraries), 'actual library closure');
  const headers = [...new Set(buildLog.split(/\r?\n/).filter(l => /including file:/i.test(l)).map(l => path.resolve(copy, l.replace(/^.*including file:\s*/i, '').trim())))].map(identity);
  same(JSON.stringify(headers), JSON.stringify(m.headers), 'actual include closure');
  at(m.equivalenceReport, path.join(root, 'pe-differences.json'));
  const equivalence = require('./pe_metadata').compare(fs.readFileSync(origin.compiler.path), fs.readFileSync(m.baselineCompiler.path));
  same(JSON.stringify(JSON.parse(fs.readFileSync(m.equivalenceReport.path))), JSON.stringify({ trusted: origin.compiler, relinked: m.baselineCompiler, equivalence }), 'replayed pinned-left equivalence');
  // This replays the recorded build closure. It is not a cryptographic signature
  // of compiler origin or a claim of original-host reproducibility.
  return m;
}
module.exports = { authenticateManifest };
