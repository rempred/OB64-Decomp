'use strict';

// Exercise the actual Node/Python wire boundary independently of compiler output.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { ROOT, sha256File } = require('../tools/lib/phase7_conventional');
const { resolveLocalTools } = require('../tools/lib/local_tools');
const { BRIDGE, SCHEMA, requestStore } = require('../tools/lib/matching/store');
const { candidateRecord } = require('../tools/lib/matching/compiler');

function run() {
  const base = path.join(ROOT, 'build', 'matching-store-transport-tests');
  fs.mkdirSync(base, { recursive: true });
  const root = fs.mkdtempSync(path.join(base, 'run-'));
  const python = resolveLocalTools().splatPython;
  const envNames = ['PYTHONIOENCODING', 'PYTHONUTF8'];
  const previous = envNames.map(name => process.env[name]);
  const spawn = cp.spawnSync;
  cp.spawnSync = function(executable, args, options) {
    const result = spawn.call(this, executable, args, options);
    if (args[0] === BRIDGE && result.stdout) assert.match(result.stdout, /^[\x00-\x7f]*$/);
    return result;
  };
  let checks = 0;
  const check = (name, fn) => { fn(); checks++; };
  try {
    // Python's text wrapper deliberately disagrees with Node's UTF-8 input.
    process.env.PYTHONIOENCODING = 'cp1252';
    process.env.PYTHONUTF8 = '0';
    const probe = cp.spawnSync(python, ['-c', 'import sys; print(sys.stdin.encoding)'], {
      encoding: 'utf8', input: '', windowsHide: true,
    });
    assert.equal(probe.status, 0);
    assert.equal(probe.stdout.trim(), 'cp1252');
    for (const utf8Mode of ['0', '1']) for (const encoding of ['cp1252', 'ascii', 'utf-8']) {
      process.env.PYTHONUTF8 = utf8Mode;
      process.env.PYTHONIOENCODING = encoding;
      const stem = encoding + '-' + utf8Mode;
      const options = { python, database: path.join(root, stem + '.sqlite') };
      const query = (request, readOnly = false) => requestStore(request, { ...options, readOnly });
      query({ action: 'init' });
      const target = { targetId: 'transport-target' };
      query({ action: 'upsert_targets', records: [{ ...target, modelId: 'transport-model',
        symbol: 'transport_fixture', metadata: {}, expectedBytes: '', observedAt: 'fixture' }] });
      const source = '/* caf\u00e9 \u2192 \ud83d\udc26 */\nint fixture(void) { return 7; }\n';
      const record = candidateRecord(target, source, {
        origin: 'research-import', variant: 'unicode-fixture',
        metadata: { research: { authored: { context: 'caf\u00e9 \u2192 \ud83d\udc26',
          sourceChange: 'real value \u2260 previous value', observedEffect: '\u6f22\u5b57',
          remainingFailure: 'diagnostic only' } } },
      });
      const put = query({ action: 'put_candidate', record });
      check(encoding + ': exact source and metadata', () => {
        assert.equal(put.candidate.source_text, source);
        assert.deepEqual(put.observation.metadata, record.metadata);
        const rebuilt = candidateRecord(target, put.candidate.source_text, {
          origin: put.observation.origin, variant: put.observation.variant,
          parentCandidateId: put.observation.parent_candidate_id, metadata: put.observation.metadata,
        });
        assert.equal(rebuilt.sourceSha256, record.sourceSha256);
        assert.equal(rebuilt.candidateId, record.candidateId);
        assert.equal(rebuilt.observationId, record.observationId);
      });
      check(encoding + ': idempotent repeat', () => {
        assert.deepEqual(query({ action: 'put_candidate', record }), put);
      });
      const before = sha256File(options.database);
      check(encoding + ': read-only roundtrip', () => {
        const read = query({ action: 'query', name: 'candidate', args: { candidateId: record.candidateId } }, true);
        assert.equal(read.source_text, source);
        assert.deepEqual(read.metadata, record.metadata);
        assert.equal(sha256File(options.database), before);
      });
      check(encoding + ': conflicting identities still reject', () => {
        assert.throws(() => query({ action: 'put_candidate', record: { ...record, sourceText: source + ' ' } }), /conflicting candidate identity/);
        assert.throws(() => query({ action: 'put_candidate', record: { ...record, metadata: { changed: true } } }), /conflicting candidate observation identity/);
        assert.deepEqual(query({ action: 'put_candidate', record }), put);
      });
      const malformed = Buffer.concat([Buffer.from('{"action":"init","note":"'), Buffer.from([0xc3, 0x28]), Buffer.from('"}')]);
      for (const database of [options.database, path.join(root, stem + '-absent.sqlite')]) {
        const existed = fs.existsSync(database);
        const hash = existed ? sha256File(database) : null;
        const result = cp.spawnSync(python, [BRIDGE, '--database', database, '--schema', SCHEMA], {
          input: malformed, encoding: 'utf8', windowsHide: true,
        });
        check(encoding + ': invalid UTF-8 fails before database writes', () => {
          assert.notEqual(result.status, 0);
          const payload = JSON.parse(result.stdout);
          assert.equal(payload.ok, false);
          assert.match(payload.error, /utf-8.*decode/i);
          assert.equal(fs.existsSync(database), existed);
          if (existed) assert.equal(sha256File(database), hash);
        });
        check(encoding + ': lone surrogate values and keys reject before writes', () => {
          for (const extra of [{ nested: ['\ud800'] }, { '\udfff': 'key' }, { sourceText: '\ud800' }]) {
            assert.throws(() => requestStore({ action: 'init', ...extra }, { ...options, database }), /surrogates not allowed/);
            assert.equal(fs.existsSync(database), existed);
            if (existed) assert.equal(sha256File(database), hash);
          }
        });
      }
    }
  } finally {
    cp.spawnSync = spawn;
    envNames.forEach((name, i) => {
      if (previous[i] === undefined) delete process.env[name];
      else process.env[name] = previous[i];
    });
  }
  return { checks, root, codegen: 0 };
}

if (require.main === module) console.log(JSON.stringify(run(), null, 2));
module.exports = { run };
