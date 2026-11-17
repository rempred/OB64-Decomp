'use strict';

const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { checkSourceCheckout, readRetainedClaims } = require('../tools/check_source_checkout');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-source-checkout-test-'));
const repo = path.join(root, 'repository');
fs.mkdirSync(repo);
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
function git(args, input) {
  const result = spawnSync('git', ['-C', repo, ...args], { input, encoding: null, windowsHide: true });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr.toString('utf8'));
  return result.stdout;
}
function write(relative, contents) {
  const destination = path.join(repo, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, contents);
}
const reports = path.join(root, 'reports');
fs.mkdirSync(reports);
const source = Buffer.from('int first;\r\nint second;\n');
const header = Buffer.from('#define EXAMPLE 1\r\n');
const stateFile = path.join(reports, 'state.json');
function claims(options = {}) {
  const sourceIdentity = { path: 'src/game.c', bytes: source.length, sha256: sha256(source) };
  const dependency = { path: 'include/game.h', bytes: header.length, sha256: sha256(header) };
  const policy = {
    symbol: 'game', class: 'PURE_C', source: sourceIdentity.path,
    sourceBytes: sourceIdentity.bytes, sourceSha256: sourceIdentity.sha256,
    digest: sha256(Buffer.from('source-policy')), dependencies: [dependency],
  };
  if (options.mutatePolicy) options.mutatePolicy(policy);
  const produced = { symbol: policy.symbol, source: policy.source, sourceSha256: policy.sourceSha256, sourceClass: policy.class, sourcePolicyDigest: policy.digest };
  const build = { schemaVersion: 8, status: 'constructed', sourcePolicy: { schemaVersion: 2, status: 'pass', targets: [policy] }, targetReplacements: [produced] };
  const save = (file, value) => {
    const bytes = Buffer.from(JSON.stringify(value));
    const destination = path.join(reports, file);
    fs.writeFileSync(destination, bytes);
    return { path: destination, bytes: bytes.length, sha256: sha256(bytes) };
  };
  const buildFile = save('build.json', build), buildIdentity = { bytes: buildFile.bytes, sha256: buildFile.sha256 };
  const fresh = save('fresh.json', { schemaVersion: 7, status: 'pass', inputFingerprint: 'A'.repeat(64), baselineFingerprint: 'B'.repeat(64), buildReport: buildIdentity, targets: [produced] });
  const verified = save('verification.json', { schemaVersion: 7, status: 'pass', buildReport: buildIdentity, verification: { schemaVersion: 7, status: 'pass' } });
  save('state.json', {
    schemaVersion: 7, status: 'verified', verifiedAt: '2026-11-10T21:32:53.139Z',
    fingerprint: 'A'.repeat(64), baselineFingerprint: 'B'.repeat(64), report: buildFile.path, buildReport: buildIdentity,
    freshCompilationReport: fresh.path, freshCompilationSha256: fresh.sha256,
    verificationReport: verified.path, verificationSha256: verified.sha256,
  });
}

try {
  git(['init', '--quiet', '--template=']);
  git(['config', 'core.autocrlf', 'false']);
  write('.gitattributes', '*.c text eol=lf\n*.h text eol=crlf\n');
  write('src/game.c', source);
  write('include/game.h', header);
  git(['add', '.gitattributes', 'src/game.c', 'include/game.h']);
  claims();
  const indexBefore = fs.readFileSync(path.join(repo, '.git/index'));
  const worktreeBefore = fs.readFileSync(path.join(repo, 'src/game.c'));
  const mismatched = checkSourceCheckout(repo, stateFile);
  assert.equal(mismatched.status, 'fail');
  assert.equal(mismatched.mismatches.length, 1);
  assert.equal(mismatched.mismatches[0].path, 'src/game.c');
  assert.deepEqual(mismatched.mismatches[0].checkoutNewlines, { crlf: 0, bareLf: 2, bareCr: 0 });
  assert(fs.readFileSync(path.join(repo, '.git/index')).equals(indexBefore));
  assert(fs.readFileSync(path.join(repo, 'src/game.c')).equals(worktreeBefore));

  // Unstaged attribute changes cannot alter the interpretation of the staged index.
  write('.gitattributes', '*.c -text\n*.h text eol=crlf\n');
  assert.equal(checkSourceCheckout(repo, stateFile).status, 'fail');
  git(['add', '.gitattributes']);
  // Correcting attributes alone leaves the previously normalized blob incomplete.
  assert.equal(checkSourceCheckout(repo, stateFile).status, 'fail');
  git(['add', 'src/game.c']);
  const passing = checkSourceCheckout(repo, stateFile);
  assert.equal(passing.status, 'pass');
  assert.equal(passing.files, 2);
  // The header intentionally checks out CRLF although its staged blob is LF.
  assert(git(['show', ':include/game.h']).equals(Buffer.from('#define EXAMPLE 1\n')));
  assert.equal(readRetainedClaims(stateFile).files.length, 2);

  write('.gitattributes', '*.c text eol=lf\n*.h text eol=crlf\n');
  write('src/.gitattributes', 'game.c -text\n');
  git(['add', '.gitattributes', 'src/.gitattributes']);
  assert.equal(checkSourceCheckout(repo, stateFile).status, 'pass');
  git(['update-index', '--force-remove', 'include/game.h']);
  assert.throws(() => checkSourceCheckout(repo, stateFile), /absent from the staged index include\/game.h/);
  git(['add', 'include/game.h']);

  // An external filter must be rejected before Git could run its smudge command.
  const marker = path.join(root, 'filter-executed');
  const filterProgram = path.join(root, 'fixture-filter.cjs');
  fs.writeFileSync(filterProgram, "require('fs').writeFileSync(process.argv[2], 'executed'); process.stdin.pipe(process.stdout);\n");
  git(['config', 'filter.fixture.smudge', `node "${filterProgram.replace(/\\/g, '/')}" "${marker.replace(/\\/g, '/')}"`]);
  write('src/.gitattributes', 'game.c -text filter=fixture\n');
  git(['add', 'src/.gitattributes']);
  git(['cat-file', '--filters', ':src/game.c']);
  assert(fs.existsSync(marker), 'fixture filter must be executable in the source repository');
  fs.unlinkSync(marker);
  assert.throws(() => checkSourceCheckout(repo, stateFile), /External filter attribute is unsupported/);
  assert(!fs.existsSync(marker));
  write('src/.gitattributes', 'game.c -text\n');
  git(['add', 'src/.gitattributes']);

  const sourceOid = git(['rev-parse', ':src/game.c']).toString('utf8').trim();
  git(['update-index', '--cacheinfo', `120000,${sourceOid},src/game.c`]);
  assert.throws(() => checkSourceCheckout(repo, stateFile), /not a regular blob src\/game.c/);
  git(['update-index', '--cacheinfo', `100644,${sourceOid},src/game.c`]);
  const objectPath = path.join(repo, '.git/objects', sourceOid.slice(0, 2), sourceOid.slice(2));
  const objectBytes = fs.readFileSync(objectPath);
  fs.unlinkSync(objectPath);
  assert.throws(() => checkSourceCheckout(repo, stateFile), /staged-index blob is missing/);
  fs.writeFileSync(objectPath, objectBytes);

  fs.appendFileSync(path.join(reports, 'build.json'), ' ');
  assert.throws(() => readRetainedClaims(stateFile), /Retained report identity mismatch/);
  claims({ mutatePolicy: policy => { policy.dependencies[0].path = '../escape.h'; } });
  assert.throws(() => readRetainedClaims(stateFile), /Invalid repository path/);
  claims({ mutatePolicy: policy => { policy.dependencies.push({ ...policy.dependencies[0], sha256: 'C'.repeat(64) }); } });
  assert.throws(() => readRetainedClaims(stateFile), /Conflicting source identities/);
  claims({ mutatePolicy: policy => { policy.sourceBytes = -1; } });
  assert.throws(() => readRetainedClaims(stateFile), /Malformed source identity/);
  claims();
  assert.equal(checkSourceCheckout(repo, stateFile).status, 'pass');
  console.log('Source checkout checks passed with real Git normalization, staged/nested attributes, intentional CRLF, mixed-byte recovery, missing blobs, filter rejection and retained-proof identity controls.');
} finally {
  assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
  fs.rmSync(root, { recursive: true });
}
