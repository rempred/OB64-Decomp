#!/usr/bin/env node
'use strict';

// Refresh dependent identities only. The reviewed primary manifests remain authority.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { isDeepStrictEqual } = require('util');

const TOOLCHAIN = 'config/toolchain.json';
const BUILD = 'config/gnu-binutils-2.6-build.json';
const PHASE7 = 'config/phase7/conventional-build.json';
const TARGETS = 'config/matching-c-targets.json';
const PATCH_KEYS = ['buildPatch', 'structuralLinkerPatch', 'binaryLmaPatch', 'hi16PairingPatch'];
const TOOLS = {
  assembler: 'bin/mips-kmc-elf-as.exe', linker: 'bin/mips-kmc-elf-ld.exe',
  nm: 'bin/mips-kmc-elf-nm.exe', objcopy: 'bin/mips-kmc-elf-objcopy.exe',
  objdump: 'bin/mips-kmc-elf-objdump.exe', size: 'bin/mips-kmc-elf-size.exe',
  strings: 'bin/mips-kmc-elf-strings.exe', strip: 'bin/mips-kmc-elf-strip.exe',
  runner: 'bin/msys-2.0.dll',
};
function demand(ok, message) { if (!ok) throw new Error(`Pin refresh: ${message}`); }
function equal(a, b, label) { demand(isDeepStrictEqual(a, b), `${label} mismatch`); }
function hash(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase(); }
function identity(bytes) { return { bytes: bytes.length, sha256: hash(bytes) }; }
function relative(name) {
  demand(typeof name === 'string' && /^[A-Za-z0-9_./-]+$/.test(name)
    && !path.isAbsolute(name) && !name.split('/').some(x => x === '..' || x === '.' || !x), 'unsafe relative path');
  return name;
}
function realRegular(file, directory = false) {
  const absolute = path.resolve(file);
  let cursor = absolute;
  while (true) {
    demand(!fs.lstatSync(cursor).isSymbolicLink(), `symlink/reparse path: ${cursor}`);
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  const stat = fs.statSync(absolute);
  demand(directory ? stat.isDirectory() : stat.isFile(), `not a regular ${directory ? 'directory' : 'file'}: ${absolute}`);
  return fs.realpathSync(absolute);
}
function absolute(value, label) {
  demand(typeof value === 'string' && path.isAbsolute(value), `${label} must be absolute`);
  return path.resolve(value);
}
function normalized(value) { return value.replace(/\\/g, '/'); }
function quote(value) { return `'${String(value).replace(/'/g, `'"'"'`)}'`; }
function buildCommands(c) {
  const f = c.configure;
  return [
    `CFLAGS=${quote(f.cflags)} ./configure ${[`--target=${f.target}`, `--host=${f.host}`, `--build=${f.build}`, ...f.flags].map(quote).join(' ')}`,
    'make -C ld -W ldgram.y ldgram.c',
    `make -j1 CFLAGS=${quote(f.cflags)} all-binutils all-gas all-ld`,
    `make -C bfd -W elf.c CFLAGS=${quote(f.elfBfdCflags)} elf.o`,
    `make -C bfd -W binary.c CFLAGS=${quote(f.binaryBfdCflags)} binary.o`,
    `make -C bfd -W elf32-mips.c CFLAGS=${quote(f.mipsElfBfdCflags)} elf32-mips.o`,
    `make -C bfd CFLAGS=${quote(f.cflags)} libbfd.a`,
    `make -C ld CFLAGS=${quote(f.cflags)} ld.new`,
    `make -C binutils CFLAGS=${quote(f.cflags)} objcopy objdump nm.new size strings strip.new`,
  ];
}

function refresh({ root = path.resolve(__dirname, '..'), bundle, secondBundle, write = false }) {
  root = realRegular(root, true);
  const snapshots = new Map();
  function read(file) {
    const real = realRegular(file);
    const bytes = fs.readFileSync(real);
    if (snapshots.has(real)) equal(bytes, snapshots.get(real), `concurrent input change ${file}`);
    snapshots.set(real, bytes);
    return bytes;
  }
  const readLocal = name => read(path.join(root, relative(name)));
  const tc = JSON.parse(readLocal(TOOLCHAIN));
  const c = JSON.parse(readLocal(BUILD));
  demand(tc.schemaVersion === 2 && c.schemaVersion === 1, 'primary manifest schema');
  equal(tc.tools, TOOLS, 'tool mapping');
  equal(tc.sourceCommit, c.source.commit, 'source commit');
  equal(tc.buildProvenance, BUILD, 'build provenance path');
  equal(tc.versions, c.versions, 'versions');
  equal(Object.keys(c.outputs).sort(), Object.values(TOOLS).sort(), 'complete primary output set');
  demand(c.buildScript.path === 'tools/build_gnu_binutils_2_6.js', 'build recipe path');
  equal(hash(readLocal(c.buildScript.path)), c.buildScript.sha256, 'recipe bytes');
  const patches = PATCH_KEYS.map(key => c[key]);
  equal(patches.map(p => p.path), [
    'tools/toolchain/gnu-binutils-2.6-msys2-host.patch',
    'tools/toolchain/gnu-binutils-2.6-ob64-load-segments.patch',
    'tools/toolchain/gnu-binutils-2.6-ob64-binary-lma.patch',
    'tools/toolchain/gnu-binutils-2.6-ob64-hi16-pairing.patch',
  ], 'patch paths');
  for (const p of patches) equal(hash(readLocal(p.path)), p.sha256, `patch ${p.path}`);
  const roots = [bundle, secondBundle].map(p => {
    demand(typeof p === 'string' && p.length > 0, 'two bundles required');
    return realRegular(p, true);
  });
  demand(roots[0] !== roots[1] && !roots.some((p, i) => roots[1 - i].startsWith(p + path.sep)), 'distinct independent bundle roots required');
  const installed = path.resolve(root, relative(tc.localRoot));
  demand(!roots.includes(installed), 'installed bundle is not a fresh build');
  const reports = roots.map(bundleRoot => {
    const report = JSON.parse(read(path.join(bundleRoot, 'build-report.json')));
    demand(report.schemaVersion === 1 && report.status === 'pass', 'build report schema/status');
    equal(absolute(report.output, 'report output'), bundleRoot, 'report output binding');
    equal(report.source.commit, c.source.commit, 'report source');
    const source = absolute(report.source.path, 'source path');
    const work = realRegular(absolute(report.work, 'work path'), true);
    demand(work !== bundleRoot && work !== installed, 'unsafe work root');
    equal(report.versions, c.versions, 'report versions');
    equal(report.patches, patches, 'report patches');
    equal(report.outputs, c.outputs, 'complete report outputs');
    equal(report.buildHost.runner, c.outputs[TOOLS.runner], 'report runner');
    equal(report.buildHost.packages.map(p => ({ name: p.name, version: p.version, archiveSha256: p.sha256 })), c.buildHost.packages, 'host package inventory');
    for (const p of report.buildHost.packages) {
      demand(Number.isSafeInteger(p.bytes) && p.bytes > 0 && typeof p.archive === 'string'
        && p.archive.startsWith(`${p.name}-${p.version}-`) && !/[\\/]/.test(p.archive), 'package archive metadata');
    }
    const version = name => c.buildHost.packages.find(p => p.name === name).version.replace(/-[^-]+$/, '');
    equal(report.buildHost.gcc, `gcc (GCC) ${version('gcc')}`, 'host gcc');
    equal(report.buildHost.make, `GNU Make ${version('make')}`, 'host make');
    const bash = normalized(absolute(report.buildHost.bash, 'bash path'));
    const commands = report.commands;
    demand(Array.isArray(commands) && commands.length === 6 + buildCommands(c).length, 'complete command record');
    equal(commands[0], ['git', 'clone', '--no-hardlinks', '--no-checkout', normalized(source), normalized(path.join(work, 'source'))], 'clone command');
    equal(commands[1], ['git', 'checkout', '--detach', c.source.commit], 'checkout command');
    patches.forEach((p, i) => {
      const command = commands[2 + i];
      demand(Array.isArray(command) && command.length === 3 && command[0] === 'git' && command[1] === 'apply', 'patch command');
      equal(hash(read(absolute(command[2], 'applied patch'))), p.sha256, 'applied patch bytes');
    });
    equal(commands.slice(6), buildCommands(c).map(command => [bash, '-lc', command]), 'build commands');
    equal(fs.readdirSync(path.join(bundleRoot, 'bin')).sort(), Object.values(TOOLS).map(p => path.basename(p)).sort(), 'actual complete binary set');
    for (const [name, expected] of Object.entries(c.outputs)) equal(identity(read(path.join(bundleRoot, relative(name)))), expected, `binary ${name}`);
    return { report, work, root: bundleRoot };
  });
  demand(reports[0].work !== reports[1].work && !reports.some((r, i) => reports[1 - i].work.startsWith(r.work + path.sep)), 'distinct build work roots required');
  const independentRoots = [...roots, ...reports.map(r => r.work)];
  demand(independentRoots.every((p, i) => independentRoots.every((q, j) => i === j
    || (p !== q && !p.startsWith(q + path.sep)))), 'overlapping build/bundle roots');
  // Reports are unsigned records, not proof of execution. Bind both records to
  // distinct builds and independently require every actual byte to match authority.
  const changes = [];
  const edits = [];
  function edit(name, updates) {
    const original = readLocal(name).toString('utf8');
    const parsed = JSON.parse(original);
    const expected = JSON.parse(original);
    let output = original;
    for (const [keys, value] of updates) {
      let owner = expected;
      for (const key of keys.slice(0, -1)) { demand(owner && Object.hasOwn(owner, key), `missing ${name}:${keys.join('.')}`); owner = owner[key]; }
      const key = keys[keys.length - 1];
      demand(owner && Object.hasOwn(owner, key) && /^[0-9A-F]{64}$/.test(owner[key]), `missing/malformed pin ${name}:${keys.join('.')}`);
      const before = owner[key];
      const escaped = JSON.stringify(key).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(${escaped}\\s*:\\s*)"[0-9A-F]{64}"`, 'g');
      demand([...output.matchAll(re)].length === 1, `ambiguous pin ${key}`);
      output = output.replace(re, (_, prefix) => `${prefix}"${value}"`);
      owner[key] = value;
      if (before !== value) changes.push({ file: name, path: keys, before, after: value });
    }
    equal(JSON.parse(output), expected, 'allowed JSON delta');
    if (!isDeepStrictEqual(parsed, expected)) edits.push({ name, original, output });
  }
  const pins = [TOOLCHAIN, BUILD, ...patches.map(p => p.path)].map(name => [name, hash(readLocal(name))]);
  edit(PHASE7, [...pins.map(([name, value]) => [['acceptedInputSha256', name], value]),
    ...Object.entries(c.outputs).map(([name, record]) => [['binutils', 'tools', path.basename(name)], record.sha256])]);
  const targets = JSON.parse(readLocal(TARGETS));
  equal(targets.toolchain.manifest, TOOLCHAIN, 'targets manifest path');
  equal(targets.toolchain.buildProvenance, BUILD, 'targets provenance path');
  edit(TARGETS, [[['toolchain', 'manifestSha256'], pins[0][1]], [['toolchain', 'buildProvenanceSha256'], pins[1][1]]]);
  if (write) {
    // Recheck the complete read set, including both destinations, before writing.
    for (const [file, bytes] of snapshots) equal(fs.readFileSync(realRegular(file)), bytes, `concurrent input change ${file}`);
    for (const e of edits) fs.writeFileSync(path.join(root, e.name), e.output);
  }
  return { mode: write ? 'write' : 'check', bundles: roots, changes, updatedFiles: write ? edits.map(e => e.name) : [] };
}

if (require.main === module) {
  try {
    const options = {};
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === '--write') { demand(!options.write, 'duplicate --write'); options.write = true; }
      else if (arg === '--bundle' || arg === '--second-bundle') {
        const key = arg === '--bundle' ? 'bundle' : 'secondBundle';
        demand(!options[key] && args[i + 1] && !args[i + 1].startsWith('--'), `missing/duplicate ${arg}`);
        options[key] = args[++i];
      } else throw new Error('Usage: node tools/refresh_gnu_binutils_pins.js --bundle <fresh> --second-bundle <fresh> [--write]');
    }
    console.log(JSON.stringify(refresh(options), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { refresh, buildCommands };
