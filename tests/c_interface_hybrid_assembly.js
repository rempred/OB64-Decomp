'use strict';
const fs = require('fs'),
  path = require('path'),
  assert = require('assert'),
  staged = path.resolve(__dirname, '..'),
  root = process.env.OB64_INTERFACE_TEST_ROOT || staged,
  m = require('../tools/lib/c_interfaces'),
  sites = require('../tools/lib/c_interface_site_evidence');
const state = JSON.parse(fs.readFileSync(process.env.OB64_INTERFACE_REFERENCE_STATE || path.join(root,
    'build/current/state.json'))),
  build = JSON.parse(fs.readFileSync(state.report)),
  loaded = m.loadBuild(state.output, build, null),
  config = JSON.parse(fs.readFileSync(path.join(root, 'config/c-interface-frontend.json'))),
  exe = m.authenticate(root, config);
const names = ['func_0004ef34'],
  sources = new Set(build.targetReplacements.filter(r => names.includes(r.symbol)).map(r => r.source));
sources.add('src/lib/func_0009ed1c.c');
sources.add('src/boot/boot_state_slot_payload_copy_free.c');
for (const u of loaded.units) u.analysis = sources.has(u.identity.source) ? m.parse(exe, u.file, u.source) : {
  functions: [],
  calls: [],
  assemblyTransfers: []
};
const scope = {
  mode: 'changed-functions-and-visible-declarations',
  changedFunctions: loaded.units.flatMap(u => u.analysis.functions.filter(f => f.definition && names
    .includes(f.name)).map(f => u.identity.source + '#' + f.name))
};
const rows = sites.assemblyEvidence(root, state.output, build, loaded.units, loaded.linked, scope),
  inline = rows.filter(r => r.inlineAssemblyProducer?.source === 'src/lib/func_0009ed1c.c');
assert.equal(inline.length, 1);
assert(!rows.some(r => r.inlineAssemblyProducer?.source === 'src/boot/boot_state_slot_payload_copy_free.c'));
fs.writeFileSync(path.join(process.env.OB64_INTERFACE_TEST_SCRATCH || path.join(staged,
  'build/c-interface-tests'), 'hybrid-assembly.json'), JSON.stringify({
  status: 'pass',
  checks: 2,
  inline
}, null, 2));
console.log(JSON.stringify({
  status: 'pass',
  checks: 2
}));
