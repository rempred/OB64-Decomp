'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const test = require('node:test');
const ROOT = process.cwd();
const FIXTURES = path.join(ROOT, 'build/private-preparation-tests');
fs.mkdirSync(FIXTURES, { recursive: true });

test('real compileCandidate publication boundary rejects shared drift on fresh and refreshed comparisons', () => {
  // Execute the actual function body with native/artifact boundaries replaced by
  // inert fixtures. The authentication and publication ordering are unchanged.
  const source = fs.readFileSync(path.join(ROOT, 'tools/lib/matching/compiler.js'), 'utf8');
  const body = source.slice(source.indexOf('function compileCandidate('), source.indexOf('\nmodule.exports ='));
  for (const cachedMode of [false, true]) {
    let drift = false, published = 0;
    const text = 'int f(void) { return 1; }', candidate = { candidateId: 'candidate', sourceSha256: 'hash' };
    const target = { symbol: 'f', bytes: 4, targetId: 'target' };
    const classification = { class: 'PURE_C', source: 'source.c', sourceSha256: 'hash', symbol: 'f', bytes: 4 };
    const session = { preprocessor: {}, tool: {}, context: { phase8: { targets: [] } } };
    const sandbox = {
      Buffer, path, Date, JSON, MATCHING_ROOT: 'private',
      fs: { readFileSync: () => Buffer.from(text) },
      require: () => ({ regular: x => x, assertPrivateClassification() {}, equalExpandedInputs() {} }),
      assertScratchEnvironment() {}, assertScratchCapability() {}, recordCandidate: () => ({ candidate, sourceFile: 'source.c' }),
      textContract: { bindWorkbenchTarget: (_session, value) => value },
      relative: x => x, classifySource: () => ({ ...classification }), verifyClassificationInputs() {}, compilationInputBytes: () => Buffer.from(text),
      acceptedExpectedRelocationEvidence: () => ({}), prepareTargetDiagnostic: () => ({}), candidateCompileCacheKey: () => 'key', canonicalJson: JSON.stringify,
      resolveRunArtifactDirectory: () => 'artifacts', cachedCandidateArtifact: () => ({}), diagnosticPreparedForCandidate: () => ({}), comparisonIsCurrent: () => false,
      compareCandidateDiagnostic: () => { drift = true; return {}; }, makeComparisonRecord: () => ({}), ensurePlainChildDirectory: () => 'reports', writeUniqueRunJson() {},
      compileAttemptIdentity: () => 'run', authenticateFreshRunArtifactDirectory: () => 'artifacts',
      compileScratchCandidate: () => ({ objectText: Buffer.alloc(4), relocations: [] }), candidateArtifactFromScratch: () => ({}), writeJson() {},
      compilePublicationRequiresReauthentication: () => false,
    };
    vm.createContext(sandbox); vm.runInContext(body + '\nthis.execute = compileCandidate;', sandbox);
    const options = { privateWorkspace: true, sourcePath: 'source.c', matchingRoot: 'private', session,
      assertPrivateInputs() { if (drift) throw Error('shared input drift'); },
      storeRequest(request) {
        if (request.action === 'replace_comparison' || request.action === 'put_compile_result') { published++; return {}; }
        if (request.name === 'compile_by_cache') return cachedMode ? { candidate_id: 'candidate', status: 'compiled', object_text: '', relocations: [], tool: { candidateSourcePolicy: classification } } : null;
        if (request.name === 'comparison_for_run') return {};
        return null;
      },
    };
    assert.throws(() => sandbox.execute({}, target, text, options), /shared input drift/);
    assert.equal(published, 0, cachedMode ? 'stale comparison was replaced' : 'invalid compile was published');
  }
});

test('root-only marker permits native mode changes only with the exact supervised ticket', async () => {
  const root = fs.mkdtempSync(path.join(FIXTURES, 'guard-fixture-'));
  const workspace = { matchingRoot: root, storeOptions: { database: path.join(root, 'workbench.sqlite') }, nativeConcurrency: 'serial' };
  const key = crypto.createHash('sha256').update(root.toLowerCase()).digest('hex');
  const processStub = { pid: 1234, ppid: 5678, env: { OB64_PRIVATE_GUARD: key } };
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'tools/lib/matching/private_workspace.js'), 'utf8'), { module, process: processStub,
    require: name => name === 'child_process' ? { spawn() { throw Error('test must not launch a process'); } } : require(name) });
  const guard = module.exports;
  const ticket = native => fs.writeFileSync(path.join(root, '.private-guard.json'), JSON.stringify({ pid: 1234, supervisorPid: 5678, rootKey: key, native }));
  let callbacks = 0;
  ticket(false); await guard.withPrivateWorkspace(workspace, { native: false }, () => callbacks++);
  await assert.rejects(guard.withPrivateWorkspace(workspace, { native: true }, () => callbacks++), /identity mismatch/);
  ticket(true); await guard.withPrivateWorkspace(workspace, { native: true }, () => callbacks++);
  processStub.pid++; await assert.rejects(guard.withPrivateWorkspace(workspace, { native: true }, () => callbacks++), /identity mismatch/);
  assert.equal(callbacks, 2);
  assert.equal(processStub.env.OB64_PRIVATE_GUARD, key);
});
