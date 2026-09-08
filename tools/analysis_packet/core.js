'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const assert = require('assert');
const { makeElf } = require('./elf');
const REPO = path.resolve(__dirname, '../..');
const SCHEMA = 1;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const jsonHash = x => sha(Buffer.from(JSON.stringify(x)));
function fileHash(file) { assert(fs.lstatSync(file).isFile(), `not a regular file: ${file}`); return sha(fs.readFileSync(file)); }
function tree(root) {
  const entries = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      if (['.git', '__pycache__', '.pytest_cache', '.mypy_cache'].includes(name)) continue;
      const p = path.join(dir, name), stat = fs.lstatSync(p);
      assert(!stat.isSymbolicLink(), `symlink not allowed in tool tree: ${p}`);
      if (stat.isDirectory()) walk(p);
      else { assert(stat.isFile(), `nonregular tool input: ${p}`); entries.push({ path: path.relative(root, p).replaceAll('\\', '/'), bytes: stat.size, sha256: fileHash(p) }); }
    }
  }
  const rootStat = fs.lstatSync(root);
  assert(rootStat.isDirectory() && !rootStat.isSymbolicLink(), `not a regular directory: ${root}`); walk(root);
  return { sha256: jsonHash(entries), files: entries };
}
function confinedBuild(p) {
  const abs = path.resolve(p), base = path.join(REPO, 'build');
  assert(abs.startsWith(base + path.sep), 'output must be below this repository build/');
  let cursor = abs;
  while (cursor !== REPO) {
    if (fs.existsSync(cursor)) assert(!fs.lstatSync(cursor).isSymbolicLink(), `symlink output path: ${cursor}`);
    cursor = path.dirname(cursor);
  }
  return abs;
}
function writeJson(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); }
function configure(options) {
  const output = confinedBuild(options.output);
  const config = { schema: SCHEMA, kuna: null, m2c: null };
  if (options.kuna || options.specs) {
    assert(options.kuna && options.specs, '--kuna and --specs must be supplied together');
    const executable = path.resolve(options.kuna), specs = path.resolve(options.specs);
    const version = cp.spawnSync(executable, ['--version'], { encoding: 'utf8', windowsHide: true, timeout: 10000 });
    config.kuna = { executable, sha256: fileHash(executable), version: { status: version.status, text: (version.stdout || version.stderr || version.error?.message || '').trim() }, specs, specsSha256: tree(specs).sha256 };
  }
  if (options.python || options.m2cRoot) {
    assert(options.python && options.m2cRoot, '--python and --m2c-root must be supplied together');
    const python = path.resolve(options.python), root = path.resolve(options.m2cRoot);
    fileHash(path.join(root, 'm2c.py'));
    const version = cp.spawnSync(python, ['-I', '--version'], { encoding: 'utf8', windowsHide: true, timeout: 10000 });
    const project = path.join(root, 'pyproject.toml');
    config.m2c = { python, pythonSha256: fileHash(python), pythonVersion: { status: version.status, text: (version.stdout || version.stderr || version.error?.message || '').trim() }, declaredProjectVersion: fs.existsSync(project) ? /\bversion\s*=\s*"([^"]+)"/.exec(fs.readFileSync(project, 'utf8'))?.[1] || null : null, root, treeSha256: tree(root).sha256 };
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(config, null, 2) + '\n', { flag: 'wx' });
  return config;
}
function authenticateTools(config) {
  assert.equal(config.schema, SCHEMA, 'unsupported tool configuration schema');
  const status = {};
  for (const name of ['kuna', 'm2c']) {
    try {
      const c = config[name]; assert(c, `${name} not configured`);
      for (const p of name === 'kuna' ? [c.executable, c.specs] : [c.python, c.root]) assert(path.isAbsolute(p), `${name} configuration paths must be absolute`);
      if (name === 'kuna') { assert.equal(fileHash(c.executable), c.sha256, 'Kuna executable drift'); assert.equal(tree(c.specs).sha256, c.specsSha256, 'Kuna specs drift'); }
      else { assert.equal(fileHash(c.python), c.pythonSha256, 'Python executable drift'); assert.equal(tree(c.root).sha256, c.treeSha256, 'm2c tree drift'); }
      status[name] = { status: 'authenticated', identity: c };
    } catch (error) { status[name] = { status: 'unavailable', error: error.message, configured: config[name] || null }; }
  }
  return status;
}

function selectInput(model, symbol, rom, tableRequest) {
  const { resolveAcceptedRow } = require('../lib/active_targets');
  const row = resolveAcceptedRow(model, symbol);
  assert(row.part && symbol.toLowerCase() === row.part.name.toLowerCase(), 'secondary/alias entry not supported; request the primary accepted owner');
  assert(!row.ambiguous && row.primaryClass === 'code' && row.slices.length === 1 && row.part?.symbolByteOffset === 0,
    'unsupported owner: require one unambiguous code row/slice with entry at byte zero');
  const slice = row.slices[0];
  assert(slice.executable && slice.vramStart % 4 === 0 && row.bytes % 4 === 0 && slice.bytes === row.bytes && slice.placementKind !== 'rom-only', 'unsupported executable mapping');
  assert.equal(rom.length, model.config.rom.bytes, 'ROM size mismatch'); assert.equal(sha(rom), model.config.rom.sha256, 'normalized retail ROM mismatch');
  const target = { symbol, expectedBytes: rom.subarray(row.romStart, row.romEndExclusive), symbolByteOffset: 0, vramStart: slice.vramStart, vramEndExclusive: slice.vramEndExclusive, romStart: row.romStart, entryVram: slice.vramStart, overlayDescriptorId: slice.overlayDescriptorId };
  const chunks = [{ address: slice.vramStart, bytes: target.expectedBytes, executable: true }];
  const multiFile = path.join(REPO, 'config/matching-c-multi-owner.json'), groupFile = path.join(REPO, 'config/matching-c-compilation-groups.json');
  const multi = JSON.parse(fs.readFileSync(multiFile)), groups = JSON.parse(fs.readFileSync(groupFile));
  assert(multi.schemaVersion === 1 && multi.profile === model.config.profile && Array.isArray(multi.targets), 'unsupported multi-owner registry');
  assert(groups.schemaVersion === 1 && groups.profile === model.config.profile && Array.isArray(groups.groups), 'unsupported compilation-group registry');
  for (const contract of multi.targets) { assert(Array.isArray(contract.ownerRows), 'malformed multi-owner record'); assert(!contract.ownerRows.includes(row.index), 'multi-owner logical function/member not supported by this single-owner packet'); }
  const groupMatches = groups.groups.filter(g => { assert(Array.isArray(g.members), 'malformed compilation-group record'); return g.members.some(m => m.ownerRowIndex === row.index); });
  assert(groupMatches.length <= 1, 'ambiguous compilation-group context');
  const group = groupMatches[0];
  const metadata = { row, romSha256: sha(rom), codeSha256: sha(target.expectedBytes), productionGrouping: group ? { id: group.id, source: group.source, member: group.members.find(m => m.ownerRowIndex === row.index), contractSha256: jsonHash(group), note: 'retail accepted member interval only; no compiler producer bytes supplied' } : null, registryIdentities: { multiOwner: fileHash(multiFile), compilationGroups: fileHash(groupFile) }, suppliedTables: [], suppliedTypes: [], suppliedLabels: 'neutral owner symbol and direct branch/call address labels only' };
  const workbench = { targets: [], model: { overlays: [] } };
  if (tableRequest) {
    const match = /^(0x[0-9a-f]+|[0-9]+):(0x[0-9a-f]+|[0-9]+)$/i.exec(tableRequest); assert(match, 'table must be ROM_START:BYTES');
    const start = Number(match[1]), bytes = Number(match[2]), end = start + bytes;
    assert(Number.isSafeInteger(end) && start % 4 === 0 && bytes >= 8 && bytes <= 4096 && bytes % 4 === 0, 'invalid table interval');
    const candidates = model.rows.flatMap(r => r.slices.map(s => ({ row: r, slice: s }))).filter(x => start >= x.slice.romStart && end <= x.slice.romEndExclusive);
    assert.equal(candidates.length, 1, 'table interval must have one accepted containing slice');
    const data = candidates[0]; assert(!data.row.ambiguous && !data.slice.executable && data.slice.overlaySection === 'data-rodata' && slice.overlayDescriptorId !== null && data.slice.overlayDescriptorId === slice.overlayDescriptorId, 'table must be accepted nonexecutable data in the same overlay');
    const overlay = model.overlays.find(o => o.descriptor_id === slice.overlayDescriptorId); assert(overlay, 'missing accepted overlay');
    const address = data.slice.vramStart + start - data.slice.romStart;
    const tableBytes = rom.subarray(start, end); assert.equal(tableBytes.length, bytes);
    const narrowed = { ...overlay, data_rodata_start: address, data_rodata_end_exclusive: address + bytes, data_rodata_rom_start: start, data_rodata_rom_end_exclusive: end };
    workbench.model.overlays = [narrowed]; workbench.baserom = rom;
    const { discoverOverlayJumpTables } = require('../lib/matching/assembly');
    const { instructionInfo, wordsFromBuffer } = require('../lib/matching/mips_analysis');
    const tables = discoverOverlayJumpTables(target, workbench, wordsFromBuffer(target.expectedBytes).map((w, i) => instructionInfo(w, slice.vramStart + i * 4)));
    assert(tables.length === 1 && tables[0].tableRom === start && tables[0].entryCount * 4 === bytes, 'supplied table not supported by bounded same-owner switch recognizer');
    chunks.push({ address, bytes: tableBytes, executable: false });
    metadata.suppliedTables.push({ romStart: start, vramStart: address, bytes, sha256: sha(tableBytes), ownerRow: data.row.index, overlayDescriptorId: slice.overlayDescriptorId, origin: 'explicit user interval; accepted mapping; literal retail bytes', recognizer: tables[0] });
  }
  const { emitM2cAssembly } = require('../lib/matching/assembly');
  const assembly = emitM2cAssembly(target, workbench);
  const omittedGuards = assembly.split('\n').filter(l => l.includes('nop # m2c analysis guard:'));
  return { metadata, chunks, target, assembly: assembly.split('\n').filter(l => !l.includes('nop # m2c analysis guard:')).join('\n'), omittedGuards };
}

function implementationIdentity() {
  // These generic readers have a small local require closure; bind that entire
  // existing library tree without changing any of its files or contracts.
  return { packet: tree(__dirname).sha256, projectReaders: tree(path.join(REPO, 'tools/lib')).sha256, node: fileHash(process.execPath), nodeVersion: process.version };
}
function verifyCache(dir, key) {
  assert(fs.lstatSync(dir).isDirectory(), 'cache path must be a regular directory');
  const manifestFile = path.join(dir, 'manifest.json');
  assert(fs.existsSync(manifestFile), 'incomplete packet cache; use --fresh to preserve it and regenerate');
  fileHash(manifestFile);
  const manifest = JSON.parse(fs.readFileSync(manifestFile)); assert.equal(manifest.schema, SCHEMA); assert.equal(manifest.key, key);
  assert.equal(jsonHash(JSON.parse(fs.readFileSync(path.join(dir, 'identity.json')))), key, 'cache input identity mismatch');
  const actualPaths = tree(dir).files.filter(x => x.path !== 'manifest.json' && !x.path.startsWith('temp/')).map(x => x.path).sort();
  assert.deepEqual(manifest.files.map(x => x.path).sort(), actualPaths, 'cache artifact census drift');
  for (const e of manifest.files) {
    assert(typeof e.path === 'string' && !path.isAbsolute(e.path) && !e.path.split(/[\\/]/).includes('..'), 'unsafe cached artifact path');
    assert.equal(fileHash(path.join(dir, e.path)), e.sha256, `cache artifact drift: ${e.path}`);
  }
  const deps = path.join(dir, 'm2c/dependencies.json');
  if (fs.existsSync(deps)) for (const [p, expected] of Object.entries(JSON.parse(fs.readFileSync(deps)).files)) assert.equal(fileHash(p), expected, `Python dependency drift: ${p}`);
  const packet = JSON.parse(fs.readFileSync(path.join(dir, 'packet.json')));
  assert.equal(packet.schema, SCHEMA); assert.equal(packet.key, key); assert.equal(packet.hypothesisOnly, true);
  assert(['partial', 'produced-hypotheses'].includes(packet.status), 'invalid cached packet status');
  if (packet.tools.m2c.status === 'produced') assert(fs.existsSync(deps), 'missing Python dependency evidence');
  return packet;
}
function run(dir, name, executable, args, cwd, timeoutMs) {
  const out = path.join(dir, name); fs.mkdirSync(out, { recursive: true });
  const start = Date.now();
  const result = cp.spawnSync(executable, args, { cwd, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024, windowsHide: true, env: { ...process.env, TEMP: path.join(dir, 'temp'), TMP: path.join(dir, 'temp'), PYTHONDONTWRITEBYTECODE: '1', PYTHONNOUSERSITE: '1' } });
  fs.writeFileSync(path.join(out, 'stdout.txt'), result.stdout || ''); fs.writeFileSync(path.join(out, 'stderr.txt'), result.stderr || '');
  const record = { command: [executable, ...args], cwd, seconds: (Date.now() - start) / 1000, exitCode: result.status, signal: result.signal, error: result.error?.message || null, status: result.status === 0 && !result.error ? 'produced' : 'failed' };
  writeJson(path.join(out, 'command.json'), record); return record;
}
function prepare(options) {
  assert(/^[A-Za-z_][A-Za-z0-9_]*$/.test(options.symbol), 'invalid symbol');
  assert(!options.kunaOption || (typeof options.reason === 'string' && options.reason.trim()), 'alternate Kuna option needs --reason');
  assert(!options.reason || options.kunaOption, '--reason requires --kuna-option');
  const timeoutMs = options.timeoutMs || 60000; assert(Number.isInteger(timeoutMs) && timeoutMs >= 1 && timeoutMs <= 60000, 'timeout must be1..60000ms');
  if (options.kunaOption) assert(/^[a-z][a-z0-9_]*=(on|off|[A-Za-z0-9_-]+)$/.test(options.kunaOption), 'Kuna option must be NAME=VALUE');
  const output = confinedBuild(options.out), config = JSON.parse(fs.readFileSync(options.config));
  const tools = authenticateTools(config), start = Date.now();
  const { loadAcceptedModel } = require('../lib/phase7_conventional');
  const model = loadAcceptedModel();
  const rom = fs.readFileSync(path.join(REPO, 'build/baserom.us_rev0.z64'));
  const input = selectInput(model, options.symbol, rom, options.table);
  const keyInputs = { schema: SCHEMA, metadata: input.metadata, assemblySha256: sha(Buffer.from(input.assembly)), tools, implementation: implementationIdentity(), environmentSha256: jsonHash(Object.entries(process.env).sort()), options: { kunaOption: options.kunaOption || null, reason: options.reason || null, timeoutMs, rawM2c: true } };
  const key = jsonHash(keyInputs), dir = path.join(output, options.symbol + '-' + key + (options.fresh ? '-' + crypto.randomUUID() : ''));
  fs.mkdirSync(output, { recursive: true });
  if (fs.existsSync(dir)) { const packet = verifyCache(dir, key); return { directory: dir, cache: 'hit', status: packet.status, preparationSeconds: (Date.now() - start) / 1000 }; }
  fs.mkdirSync(dir); // Exclusive creation prevents concurrent writers sharing a packet.
  fs.mkdirSync(path.join(dir, 'temp'));
  writeJson(path.join(dir, 'identity.json'), keyInputs); writeJson(path.join(dir, 'input.json'), { ...input.metadata, omittedAdapterGuards: input.omittedGuards });
  fs.writeFileSync(path.join(dir, 'input.elf'), makeElf(options.symbol, input.chunks));
  fs.writeFileSync(path.join(dir, 'input.s'), input.assembly);
  input.chunks.forEach((c, i) => fs.writeFileSync(path.join(dir, i ? `table${i}.bin` : 'retail.bin'), c.bytes));
  const packet = { schema: SCHEMA, key, symbol: options.symbol, status: 'partial', hypothesisOnly: true, primary: 'm2c', tools: {}, warnings: ['Neither output proves original types, variable identities, semantic equivalence or matching acceptance.', 'Only the declared code/table intervals were supplied. Other data, callees and runtime effects remain unknown.', 'Default MIPS32 static modeling is not complete VR4300/FCSR/hardware execution.'], preparationSeconds: (Date.now() - start) / 1000 };
  if (tools.kuna.status === 'authenticated') {
    const c = config.kuna, elf = path.join(dir, 'input.elf'), args = ['decompile', elf, options.symbol, '--json', '--sleighpath', c.specs];
    const decompile = (name, argv) => {
      const r = run(dir, name, c.executable, argv, dir, timeoutMs);
      if (r.status === 'produced') try {
        const j = JSON.parse(fs.readFileSync(path.join(dir, name, 'stdout.txt'))), f = j.functions?.find(f => f.address === input.target.entryVram);
        assert(!j.error && f && !f.error && typeof f.code === 'string' && f.code.trim(), 'missing or failed function output');
        fs.writeFileSync(path.join(dir, name, 'code.c'), f.code);
        r.output = name + '/code.c'; r.reportedSize = f.size;
        assert.equal(f.size, input.target.expectedBytes.length, 'Kuna reported a partial or different function extent');
        if (/jump-as-call|\btrap\(/.test(f.code)) packet.warnings.push(`${name} includes unresolved dispatch or trap expressions; inspect before use.`);
      } catch (error) { r.status = 'failed'; r.error = error.message; }
      return r;
    };
    packet.tools.kuna = decompile('kuna', args);
    const dis = run(dir, 'disassembly', c.executable, ['disassemble', elf, options.symbol, '--bytes', String(input.target.expectedBytes.length), '--count', String(input.target.expectedBytes.length / 4), '--json', '--sleighpath', c.specs], dir, timeoutMs);
    try {
      assert.equal(dis.status, 'produced'); const j = JSON.parse(fs.readFileSync(path.join(dir, 'disassembly/stdout.txt')));
      assert(!j.truncated && j.instructions?.length === input.target.expectedBytes.length / 4, 'partial disassembly');
      j.instructions.forEach((x, i) => { assert.equal(x.address, input.target.entryVram + i * 4); assert.equal(x.size, 4); assert.equal(x.bytes.toLowerCase(), input.target.expectedBytes.subarray(i * 4, i * 4 + 4).toString('hex')); assert(!/invalid|unknown|\.word/i.test(x.mnemonic), 'unsupported decoded word'); });
      dis.status = 'byte-verified';
    } catch (error) { dis.status = 'failed'; dis.error = error.message; packet.warnings.push('Complete Kuna byte/decode readback failed; decompilation is not fidelity-checked.'); }
    packet.tools.disassembly = dis;
    if (options.kunaOption) { const [name, value] = options.kunaOption.split('='); packet.tools.kunaAlternate = decompile('kuna-alternate', [...args, '--option', name, value]); packet.tools.kunaAlternate.reason = options.reason; }
  } else packet.tools.kuna = tools.kuna;
  if (tools.m2c.status === 'authenticated') {
    const c = config.m2c;
    const r = run(dir, 'm2c', c.python, ['-I', path.join(__dirname, 'python_runner.py'), c.root, path.join(dir, 'm2c/dependencies.json'), '--target', 'mips-gcc-c', '--function', options.symbol, '--globals', 'used', path.join(dir, 'input.s')], dir, timeoutMs);
    if (r.status === 'produced') {
      const text = fs.readFileSync(path.join(dir, 'm2c/stdout.txt'), 'utf8');
      if (!text.trim() || /Error occurred|Traceback \(most recent/.test(text)) { r.status = 'failed'; r.error = 'empty or failed m2c output'; }
      else { fs.writeFileSync(path.join(dir, 'm2c/code.c'), text); r.output = 'm2c/code.c'; }
    }
    packet.tools.m2c = r;
  } else packet.tools.m2c = tools.m2c;
  // Authenticate tools again after execution; never cache a run across tool drift.
  assert.deepEqual(authenticateTools(config), tools, 'analysis tools changed during run');
  assert.deepEqual(implementationIdentity(), keyInputs.implementation, 'packet implementation changed during run');
  packet.status = packet.tools.kuna.status === 'produced' && packet.tools.m2c.status === 'produced' && packet.tools.disassembly?.status === 'byte-verified' && (!packet.tools.kunaAlternate || packet.tools.kunaAlternate.status === 'produced') ? 'produced-hypotheses' : 'partial';
  packet.totalSeconds = (Date.now() - start) / 1000;
  writeJson(path.join(dir, 'packet.json'), packet);
  fs.writeFileSync(path.join(dir, 'README.md'), `# ${options.symbol} analysis packet\n\nStatus: ${packet.status}. Both outputs are hypotheses; m2c remains primary.\n\nSee packet.json for statuses/timings, identity.json for cache inputs, input.json for accepted mapping and supplied metadata.\n\n${Object.entries(packet.tools).map(([n, r]) => `- ${n}: ${r.status}; ${r.output || 'see its command/stdout/stderr files or unavailable reason in packet.json'}`).join('\n')}\n\n${packet.warnings.map(w => '- ' + w).join('\n')}\n`);
  const artifacts = tree(dir).files.filter(x => !x.path.startsWith('temp/'));
  writeJson(path.join(dir, 'manifest.json'), { schema: SCHEMA, key, files: artifacts });
  verifyCache(dir, key);
  return { directory: dir, cache: 'miss', status: packet.status, preparationSeconds: packet.preparationSeconds };
}
module.exports = { configure, prepare, selectInput, verifyCache, authenticateTools, confinedBuild, tree, fileHash, sha, jsonHash, SCHEMA };
