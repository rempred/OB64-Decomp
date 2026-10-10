'use strict';
const c = require('./common'), { fs, path, ROOT, identity, hash, same, fresh, write, environment } = c;
const { authenticateManifest } = require('./run');
function sweep(manifestFile, inventoryFile) {
  const manifest = authenticateManifest(manifestFile), inventory = JSON.parse(fs.readFileSync(inventoryFile));
  if (inventory.schemaVersion !== 1 || inventory.uniqueInputs !== inventory.inputs.length || new Set(inventory.inputs.map(i => i.sha256)).size !== inventory.inputs.length) throw Error('deduplicated input inventory');
  const configFile = path.join(ROOT, 'config/phase8/matching-c.json'), config = JSON.parse(fs.readFileSync(configFile));
  const pinned = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/local-tools.json'))).compiler;
  same(identity(pinned).sha256, c.COMPILER, 'pinned compiler');
  const dir = fresh('broad-off'), started = Date.now(), budgetMs = 30 * 60 * 1000;
  const contract = { schemaVersion: 1, trace: false, acceptanceEligible: false, manifest: identity(manifestFile), inventory: identity(inventoryFile), config: identity(configFile),
    implementations: [__filename, require.resolve('./run'), require.resolve('./common')].map(identity), flags: config.compiler.compileFlags, pinned: identity(pinned), research: manifest.compiler,
    budgetMs, childTimeoutMs: 20000, invalidInputs: inventory.invalidOrUnavailable, unavailablePolicy: 'No silent omissions; identical failures are not parity passes.' };
  write(path.join(dir, 'contract.json'), contract);
  const results = [], incremental = path.join(dir, 'results.jsonl'); write(incremental, '');
  for (const [index, item] of inventory.inputs.entries()) {
    if (Date.now() - started >= budgetMs) break;
    const runDir = path.join(dir, String(index).padStart(5, '0')); fs.mkdirSync(runDir);
    const record = { index, inputSha256: item.sha256, bytes: item.bytes, started: new Date().toISOString(), executions: [] };
    try {
      same(identity(item.snapshot).sha256, item.sha256, 'immutable input snapshot');
      same(identity(pinned).sha256, contract.pinned.sha256, 'pinned compiler drift');
      same(identity(manifest.compiler.path).sha256, contract.research.sha256, 'research compiler drift');
      write(path.join(runDir, 'input.c'), fs.readFileSync(item.snapshot));
      for (const [name, compiler] of [['pinned', pinned], ['off', manifest.compiler.path]]) {
        const t = Date.now(), result = c.cp.spawnSync(compiler, [...contract.flags, '-o', name + '.s', 'input.c'], { cwd: runDir, env: environment(), encoding: 'utf8', windowsHide: true, timeout: contract.childTimeoutMs, maxBuffer: 16 * 1024 * 1024 });
        write(path.join(runDir, name + '.stdout'), result.stdout || ''); write(path.join(runDir, name + '.stderr'), result.stderr || '');
        record.executions.push({ name, exit: result.status, signal: result.signal, error: result.error?.message || null, elapsedMs: Date.now() - t,
          stderr: identity(path.join(runDir, name + '.stderr')), stdout: identity(path.join(runDir, name + '.stdout')),
          assembly: result.status === 0 && fs.existsSync(path.join(runDir, name + '.s')) ? identity(path.join(runDir, name + '.s')) : null });
      }
      const [a, b] = record.executions;
      record.status = a.error || b.error ? 'execution-error' : a.exit === 0 && b.exit === 0
        ? a.assembly && b.assembly && a.assembly.sha256 === b.assembly.sha256 ? 'parity-pass' : 'assembly-mismatch'
        : a.exit !== 0 && b.exit !== 0 && a.exit === b.exit && a.stderr.sha256 === b.stderr.sha256 ? 'identical-failure-not-pass' : 'failure-mismatch';
    } catch (error) { record.status = 'input-or-identity-invalid'; record.error = error.message; }
    record.finished = new Date().toISOString(); results.push(record); fs.appendFileSync(incremental, JSON.stringify(record) + '\n');
    if (index % 100 === 0 || record.status !== 'parity-pass') console.log(JSON.stringify({ completed: results.length, total: inventory.inputs.length, status: record.status, elapsedSeconds: Math.round((Date.now() - started) / 1000) }));
    if (record.status === 'input-or-identity-invalid') break;
  }
  authenticateManifest(manifestFile); same(identity(configFile).sha256, contract.config.sha256, 'flags drift'); same(identity(inventoryFile).sha256, contract.inventory.sha256, 'inventory drift');
  const counts = {}; for (const r of results) counts[r.status] = (counts[r.status] || 0) + 1;
  const summary = { schemaVersion: 1, root: dir, status: results.length === inventory.inputs.length && results.every(r => r.status === 'parity-pass') ? 'pass' : 'requires-review',
    complete: results.length === inventory.inputs.length, total: inventory.inputs.length, executed: results.length, counts, elapsedMs: Date.now() - started,
    contract: identity(path.join(dir, 'contract.json')), results: identity(incremental), firstNonpass: results.find(r => r.status !== 'parity-pass') || null };
  write(path.join(dir, 'summary.json'), summary); console.log(JSON.stringify(summary, null, 2)); return summary;
}
if (require.main === module) {
  if (process.argv.length !== 4) throw Error('explicit build manifest and immutable corpus inventory required');
  const r = sweep(path.resolve(process.argv[2]), path.resolve(process.argv[3])); process.exitCode = r.status === 'pass' ? 0 : 1;
}
module.exports = { sweep };
