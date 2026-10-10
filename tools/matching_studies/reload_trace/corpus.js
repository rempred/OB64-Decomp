'use strict';
const c = require('./common'), { fs, path, ROOT, identity, hash, fresh, write } = c;
function inventory() {
  const dir = fresh('corpus'), byHash = new Map(), records = [], excluded = [];
  function walk(root) {
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const file = path.join(root, entry.name);
      if (path.resolve(file) === path.resolve(c.OUT)) continue;
      if (entry.isSymbolicLink()) { excluded.push({ path: file, reason: 'symlink-not-followed' }); continue; }
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith('.input.c')) {
        try {
          const b = fs.readFileSync(file), h = hash(b);
          const invalid = !b.length ? 'empty' : b.includes(0) ? 'binary-nul' : !Buffer.from(b.toString('utf8')).equals(b) ? 'invalid-utf8' : null;
          const record = { ...identity(file), state: invalid || 'snapshot-syntax-unvalidated' }; records.push(record);
          if (!invalid) {
            if (!byHash.has(h)) { const snapshot = path.join(dir, h + '.input.c'); write(snapshot, b); byHash.set(h, { sha256: h, bytes: b.length, snapshot, paths: [] }); }
            byHash.get(h).paths.push(file);
          }
        } catch (error) { records.push({ path: file, state: 'unavailable', error: error.message }); }
      }
    }
  }
  walk(path.join(ROOT, 'build'));
  const report = { schemaVersion: 1, created: new Date().toISOString(), root: dir, totalPaths: records.length, uniqueInputs: byHash.size,
    invalidOrUnavailable: records.filter(r => r.state !== 'snapshot-syntax-unvalidated'), excluded, records, inputs: [...byHash.values()],
    boundary: 'Explicit immutable content snapshots only; no compiler executed. Syntax and compiler success are not yet validated. Future broad parity is trace-off, named controls trace-on.' };
  write(path.join(dir, 'inventory.json'), report); return report;
}
if (require.main === module) { const r = inventory(); console.log(JSON.stringify({ root: r.root, paths: r.totalPaths, unique: r.uniqueInputs, invalid: r.invalidOrUnavailable.length, excluded: r.excluded.length })); }
module.exports = { inventory };
