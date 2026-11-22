'use strict';
const fs = require('fs'),
  path = require('path'),
  assert = require('assert'),
  m = require('../tools/lib/c_interfaces'),
  sites = require('../tools/lib/c_interface_site_evidence');
const root = path.join(process.env.OB64_INTERFACE_TEST_SCRATCH || path.join(__dirname,
  '../build/c-interface-tests'), 'assembly');
fs.mkdirSync(path.join(root, 'asm/original/rev0'), {
  recursive: true
});
const source = 'asm/original/rev0/caller.s',
  text = 'bounded original assembly fixture\n';
fs.writeFileSync(path.join(root, source), text);
const manifest = {
    chunks: [{
      parts: [{
        file: source,
        romStart: '0x1000',
        romEndExclusive: '0x1020',
        sha256: m.digest(text)
      }]
    }]
  },
  mf = 'asm/original/rev0/manifest.json';
fs.writeFileSync(path.join(root, mf), JSON.stringify(manifest));
const image = Buffer.alloc(64);
[0x24040007, 0x0C000400, 0, 0x00408021].forEach((w, i) => image.writeUInt32BE(w, i * 4));
fs.writeFileSync(path.join(root, 'phase8.elf'), image);
const report = {
    outputs: {
      elf: {
        bytes: image.length,
        sha256: m.digest(image)
      }
    },
    acceptedInputs: {
      phase7Model: [{
        path: mf,
        sha256: m.digest(fs.readFileSync(path.join(root, mf)))
      }]
    }
  },
  sections = [{
    index: 0,
    name: '',
    flags: 0,
    size: 0
  }, {
    index: 1,
    name: '.asm',
    flags: 6,
    address: 0x80000000,
    offset: 0,
    size: 32
  }, {
    index: 2,
    name: '.c',
    flags: 6,
    address: 0x80001000,
    offset: 32,
    size: 16
  }],
  linked = {
    sections,
    symbols: [{
      name: 'f',
      binding: 1,
      symbolType: 2,
      sectionIndex: 2,
      value: 0x80001000
    }],
    programHeaders: [{
      type: 1,
      offset: 0,
      fileSize: 32,
      paddr: 0x1000
    }, {
      type: 1,
      offset: 32,
      fileSize: 16,
      paddr: 0x2000
    }]
  },
  units = [{
    identity: {
      source: 'f.c'
    },
    sections: ['.c'],
    analysis: {
      functions: [{
        name: 'f',
        definition: true,
        local: false,
        contractCanonical: {
          fingerprint: 'test'
        }
      }]
    }
  }],
  scope = {
    mode: 'all-known-interfaces-no-trusted-reference',
    changedFunctions: []
  };
let checks = 0;
const rows = sites.assemblyEvidence(root, root, report, units, linked, scope);
assert.equal(rows.length, 1);
assert.equal(rows[0].attribution, 'unique-executable-owner');
assert(rows[0].argumentSetup.find(x => x.register === 4).writes.length);
assert(rows[0].resultUses.some(x => x.reads.includes(2)));
checks += 4;
const ambiguous = JSON.parse(JSON.stringify(linked));
ambiguous.sections.push({
  index: 3,
  name: '.other-overlay',
  flags: 6,
  address: 0x80001000,
  offset: 48,
  size: 16
});
ambiguous.programHeaders.push({
  type: 1,
  offset: 48,
  fileSize: 16,
  paddr: 0x3000
});
const limited = sites.assemblyEvidence(root, root, report, units, ambiguous, scope);
assert.equal(limited[0].attribution, 'unresolved-overlay-or-owner');
assert.equal(limited[0].target, null);
checks += 2;
fs.appendFileSync(path.join(root, source), 'changed');
assert.throws(() => sites.assemblyEvidence(root, root, report, units, linked, scope), /source input changed/);
checks++;
fs.writeFileSync(path.join(root, source), text);
assert.throws(() => sites.assemblyEvidence(root, root, {
  ...report,
  acceptedInputs: {
    phase7Model: []
  }
}, units, linked, scope), /manifest identity missing/);
checks++;
const unparsedCaller = { identity: { source: 'caller.c' }, sections: ['.asm'],
  analysis: { status: 'unsupported', functions: [], calls: [] } };
const incomingReport = { ...report, targetReplacements: [{ source: 'caller.c', sourceClass: 'PURE_C',
  owners: [{ sectionName: '.asm', logicalOffset: 0 }],
  relocations: [{ type: 'R_MIPS_26', symbol: 'f', offset: '0x00000004' }] }] };
const incoming = sites.assemblyEvidence(root, root, incomingReport, [...units, unparsedCaller], linked, scope);
assert.equal(incoming.length, 1);assert.equal(incoming[0].kind, 'unparsed-C-incoming-call');checks += 2;
const ordinaryCaller = { ...unparsedCaller, analysis: { status: 'parsed', functions: [], calls: [] } };
assert.equal(sites.assemblyEvidence(root, root, incomingReport, [...units, ordinaryCaller], linked, scope).length, 0);checks++;
fs.writeFileSync(path.join(root, 'results.json'), JSON.stringify({
  status: 'pass',
  checks,
  scope: 'bounded register-fact and ownership fixtures; not a full-ROM validation',
  observations: rows,
  ambiguous: limited
}, null, 2));
console.log(JSON.stringify({
  status: 'pass',
  checks
}));
