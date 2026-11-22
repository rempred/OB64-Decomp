'use strict';
// Actual accepted R18 source/relocation/ELF fixture. Variants affect private in-memory analysis/config only.
const fs = require('fs'),
  path = require('path'),
  assert = require('assert');
const staged = path.resolve(__dirname, '..'),
  root = process.env.OB64_INTERFACE_TEST_ROOT || staged,
  m = require('../tools/lib/c_interfaces'),
  sites = require('../tools/lib/c_interface_site_evidence');
const state = JSON.parse(fs.readFileSync(process.env.OB64_INTERFACE_REFERENCE_STATE || path.join(root,
  'build/current/state.json')));
assert.equal(state.fingerprint, '54C0617BD0A9E241DF5736F72FD8B79728E90F8B1D43220D91E3F6FBDCFEC344');
const buildBytes = fs.readFileSync(state.report);
assert.equal(m.digest(buildBytes), state.buildReport.sha256);
const build = JSON.parse(buildBytes),
  cfg = JSON.parse(fs.readFileSync(path.join(root, 'config/c-interface-frontend.json'))),
  exe = m.authenticate(root, cfg),
  loaded = m.loadBuild(state.output, build, null);
const sources = ['src/lib/audio_driver_0001c9f0.c', 'src/lib/func_0001eaf0.c',
  'src/lib/audio_synthesizer_0001fd20.c', 'src/lib/audio_save_0001fad0.c', 'src/lib/func_00011dd4.c'
];
const units = loaded.units.filter(u => sources.includes(u.identity.source));
for (const u of units) u.analysis = m.parse(exe, u.file, u.source);
const config = JSON.parse(fs.readFileSync(path.join(staged, 'config/c-interface-sites.json'))),
  caseRoot = path.join(process.env.OB64_INTERFACE_TEST_SCRATCH || path.join(staged,
    'build/c-interface-tests'), 'real-sites');
fs.mkdirSync(path.join(caseRoot, 'config'), {
  recursive: true
});
const configFile = path.join(caseRoot, 'config/c-interface-sites.json');
for (const relative of ['asm/original/rev0/manifest.json', ...config.relationships.filter(r => r.source).map(
    r => r.source.path)]) {
  const destination = path.join(caseRoot, relative);
  fs.mkdirSync(path.dirname(destination), {
    recursive: true
  });
  fs.copyFileSync(path.join(root, relative), destination);
}
const elfFile = path.join(state.output, 'phase8.elf'),
  image = fs.readFileSync(elfFile),
  read = fs.readFileSync;
assert.equal(m.digest(image), build.outputs.elf.sha256);
fs.readFileSync = function(file, ...rest) {
  return path.resolve(file) === path.resolve(elfFile) ? image : read.call(fs, file, ...rest);
};
let checks = 0;
const results = [];

function run(c = config, us = units, prior = null) {
  fs.writeFileSync(configFile, JSON.stringify(c));
  return sites.check(caseRoot, state.output, build, us, loaded.linked, {
    prior,
    scope: {
      mode: 'all-known-interfaces-no-trusted-reference',
      changedFunctions: []
    }
  });
}

function check(name, value) {
  assert(value, name);
  checks++;
  results.push({
    name,
    pass: true
  });
}

function rejects(name, mutate) {
  const copy = JSON.parse(JSON.stringify(config));
  mutate(copy);
  assert.throws(() => run(copy));
  checks++;
  results.push({
    name,
    pass: true
  });
}
try {
  const valid = run();
  check('real setter/store/pull chain compatible', valid.relationships.find(x => x.kind === 'known-callback')
    .result === 'compatible');
  check('actual L4 factory supplier stays unknown', valid.relationships.find(x => x.kind ===
    'unresolved-supplier').result === 'unknown');
  check('real assembly branch consumes accepted nonvoid result', valid.relationships.find(x => x.kind ===
    'known-assembly-return-use').result === 'compatible');
  const voidUnits = units.map(u => ({
    ...u,
    analysis: {
      ...u.analysis,
      functions: u.analysis.functions.map(f => ({
        ...f,
        contract: f.contract && JSON.parse(JSON.stringify(f.contract))
      }))
    }
  }));
  voidUnits.find(u => u.identity.source === 'src/lib/func_00011dd4.c').analysis.functions.find(f => f
    .definition && f.name === 'func_00011dd4').contract.result = {
    kind: 'void',
    name: 'void',
    qual: []
  };
  check('real assembly consumption rejects void-return negative', run(config, voidUnits).conflicts.some(c => c
    .kind === 'assembly-consumes-void-result'));
  check('second field target checked after address-storage cast', valid.relationships.find(x => x.id ===
    'l4-save-parameter-synth').result === 'compatible');
  const rekeyed = JSON.parse(JSON.stringify(config));
  rekeyed.relationships[0] = {
    ...JSON.parse(JSON.stringify(config.relationships.find(r => r.id === 'l4-save-parameter-synth'))),
    id: config.relationships[0].id
  };
  assert.throws(() => run(rekeyed, units, {
    relationships: valid.relationships
  }), /replaced known callback/);
  checks++;
  results.push({
    name: 'same-ID replacement cannot erase retained target',
    pass: true
  });
  // Reproduce the real anchor-change bypass: setter/store/JALR are unchanged.
  const synth = units.find(u => u.identity.source === 'src/lib/audio_synthesizer_0001fd20.c'),
    originalCall = synth.analysis.calls.find(c => c.anchor === config.relationships[0].caller.anchor);
  const changedText =
    '((L4Command *(*)(void *, int *, int, int, L4Command *))save->filter.pull)(save, (int *)&dmemOutput, count, s->currentSample, commands + 1)';
  const changedSource = synth.source.slice(0, originalCall.offset) + changedText + synth.source.slice(
      originalCall.end + 1),
    changedFile = path.join(caseRoot, 'changed-synth.i');
  fs.writeFileSync(changedFile, changedSource);
  const changedAnalysis = m.parse(exe, changedFile, changedSource);
  assert.equal(changedAnalysis.status, 'parsed');
  const changedCall = changedAnalysis.calls.find(c => c.owner === 'func_0001ffec' && c.member?.name ===
      'pull'),
    changedFunction = changedAnalysis.functions.find(f => f.definition && f.name === 'func_0001ffec');
  assert.notEqual(changedCall.anchor, originalCall.anchor);
  const changedUnits = units.map(u => u === synth ? {
      ...u,
      source: changedSource,
      analysis: changedAnalysis
    } : u),
    reanchored = JSON.parse(JSON.stringify(config));
  for (const relationship of reanchored.relationships) {
    for (const pin of [...(relationship.support || []), relationship.caller].filter(Boolean)) {
      if (pin.source === synth.identity.source && pin.owner === 'func_0001ffec') pin.functionFingerprint =
        changedFunction.bodyFingerprint;
    }
    if (relationship.id === config.relationships[0].id) {
      relationship.caller.anchor = changedCall.anchor;
      relationship.caller.occurrence = changedCall.occurrence;
    }
  }
  check('changed real pull cast remains a known incompatible target', run(reanchored, changedUnits, {
    relationships: valid.relationships
  }).conflicts.some(c => c.kind === 'known-callback-signature'));
  const erased = {
    ...reanchored,
    relationships: reanchored.relationships.filter(r => r.id !== config.relationships[0].id)
  };
  assert.throws(() => run(erased, changedUnits, {
    relationships: valid.relationships
  }), /retained linked invocation/);
  checks++;
  results.push({
    name: 'changed source anchor cannot erase retained linked callback',
    pass: true
  });
  const cloned = units.map(u => ({
      ...u,
      analysis: {
        ...u.analysis,
        functions: u.analysis.functions.map(f => ({
          ...f,
          contract: f.contract && JSON.parse(JSON.stringify(f.contract))
        }))
      }
    })),
    save = cloned.find(u => u.identity.source.endsWith('audio_save_0001fad0.c')),
    fn = save.analysis.functions.find(f => f.name === 'func_0001fad0' && f.definition);
  fn.contract.params[1] = {
    kind: 'pointer',
    qual: [],
    to: {
      kind: 'primitive',
      name: 'int',
      qual: []
    }
  };
  check('known target short-pointer/int-pointer conflict blocks', run(config, cloned).conflicts.length === 1);
  rejects('wrong callback overlay rejects', c => {
    c.relationships[0].target.section = '.ob64.r0502';
  });
  rejects('changed linked word rejects', c => {
    c.relationships[0].windows[0].words[0] ^= 1;
  });
  rejects('stale support function rejects', c => {
    c.relationships[0].support[0].functionFingerprint = '0'.repeat(64);
  });
  rejects('missing named target relocation rejects', c => {
    c.relationships[0].relocations = [];
  });
  rejects('unknown supplier cannot acquire unproved target', c => {
    c.relationships[1].target = c.relationships[0].target;
  });
  rejects('setter argument must feed the actual stored slot', c => {
    c.relationships[0].setter.argumentIndex = 2;
  });
  const downgraded = JSON.parse(JSON.stringify(config));
  downgraded.relationships[0].kind = 'unresolved-supplier';
  delete downgraded.relationships[0].target;
  assert.throws(() => run(downgraded, units, {
    relationships: valid.relationships
  }));
  checks++;
  results.push({
    name: 'known relationship cannot be renamed unknown',
    pass: true
  });
  const removed = {
    schemaVersion: 1,
    relationships: config.relationships.filter(x => x.kind !== 'known-callback')
  };
  assert.throws(() => run(removed, units, {
    relationships: valid.relationships
  }));
  checks++;
  results.push({
    name: 'removing known relationship at unchanged invocation rejects',
    pass: true
  });
  fs.writeFileSync(path.join(process.env.OB64_INTERFACE_TEST_SCRATCH || path.join(staged,
    'build/c-interface-tests'), 'real-site-results.json'), JSON.stringify({
    status: 'pass',
    checks,
    accepted: state.fingerprint,
    elf: build.outputs.elf.sha256,
    results
  }, null, 2));
  console.log(JSON.stringify({
    status: 'pass',
    checks
  }));
} finally {
  fs.readFileSync = read;
}
