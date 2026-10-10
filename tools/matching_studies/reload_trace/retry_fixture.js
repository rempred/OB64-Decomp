'use strict';
// Bounded generic pressure probes. No forced registers or target-specific rules.
const c = require('./common'), { fs, path, identity, write, same } = c;
const { authenticateManifest, compileOne, parity } = require('./run');
const { assertToolchainAvailable, loadToolchainConfig } = require('../../lib/real_mips_toolchain');
function source(count, kind) {
  const type = kind === 'double' ? 'double' : 'unsigned long long';
  return `extern ${type} opaque(${type});\n${type} pressure(${type} *p, int n) {\n` +
    Array.from({ length: count }, (_, i) => `${type} v${i}=p[${i}];`).join('\n') +
    '\nwhile(n--) {\n' + Array.from({ length: count }, (_, i) => `v${i}=opaque(v${i}+v${(i + 1) % count});`).join('\n') +
    '\n}\nreturn ' + Array.from({ length: count }, (_, i) => `v${i}`).join('+') + ';\n}\n';
}
function run(file) {
  const m = authenticateManifest(file), root = c.fresh('retry-fixtures'), tools = assertToolchainAvailable(loadToolchainConfig());
  const configFile = path.join(c.ROOT, 'config/phase8/matching-c.json'), config = JSON.parse(fs.readFileSync(configFile));
  const report = { schemaVersion: 1, researchOnly: true, acceptanceEligible: false, manifest: identity(file), config: identity(configFile), implementation: [__filename, require.resolve('./run'), require.resolve('./parse'), require.resolve('./provenance'), require.resolve('./common')].map(identity), cases: [] };
  for (const kind of ['wide-integer', 'double']) for (const count of [8, 16, 24, 32]) {
    const dir = path.join(root, `${kind}-${count}`); c.contained(dir); fs.mkdirSync(dir);
    const input = Buffer.from(source(count, kind)), args = { input, flags: config.compiler.compileFlags, tools };
    const pinned = compileOne({ ...args, directory: path.join(dir, 'pinned'), compiler: m.origin.compiler.path, settings: {} });
    const off = compileOne({ ...args, directory: path.join(dir, 'off'), compiler: m.compiler.path, settings: {} });
    const on = compileOne({ ...args, directory: path.join(dir, 'on'), compiler: m.compiler.path, settings: { OB64_RELOAD_TRACE: '1', OB64_RELOAD_FUNCTION: 'pressure' } });
    report.cases.push({ kind, count, source: identity(path.join(dir, 'on/input.c')), offParity: parity(pinned, off), onParity: parity(pinned, on), events: identity(path.join(dir, 'on/events.json')), coverage: on.trace.coverage });
  }
  authenticateManifest(file); same(identity(configFile).sha256, report.config.sha256, 'fixture config drift');
  report.observedRetries = report.cases.reduce((n, r) => n + r.coverage['retry-before-restore'], 0);
  report.status = 'parity-pass'; report.retryCoverage = report.observedRetries ? 'observed' : 'not-observed-in-bounded-corpus';
  write(path.join(root, 'report.json'), report); console.log(JSON.stringify({ root, cases: report.cases.length, observedRetries: report.observedRetries }));
}
if (require.main === module) run(path.resolve(process.argv[2]));
module.exports = { source, run };
