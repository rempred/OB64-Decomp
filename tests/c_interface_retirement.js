'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const Module = require('module');
const checker = require('../tools/lib/c_interfaces');
const exceptions = require('../tools/lib/c_interface_exceptions');
const projector = require('../tools/project_c_interface_epoch');
const referencePolicy = require('../tools/lib/c_interface_prospective');
const zlib = require('zlib');
const root = process.env.OB64_INTERFACE_TEST_ROOT || path.resolve(__dirname, '..');
const scratch = path.join(process.env.OB64_INTERFACE_TEST_SCRATCH ||
  path.join(root, 'build/c-interface-tests'), 'retirement');
fs.mkdirSync(path.join(scratch, 'config'), {
  recursive: true
});
const frontend = JSON.parse(fs.readFileSync(path.join(root, 'config/c-interface-frontend.json')));
const executable = checker.authenticate(root, frontend);
let checks = 0;

function check(name, predicate) {
  assert(predicate, name);
  checks++;
}

function fixture(fixedF, fixedG, changedProviderBody = false) {
  const caller = `struct A { int x; };
    void f(${fixedF ? 'struct A *' : 'void *'});
    void g(${fixedG ? 'struct A *' : 'void *'});
    void caller(void *x) { f(x); g(x); }`;
  const provider = `struct A { int x; };
    void f(struct A *x) {}
    void g(struct A *x) { ${changedProviderBody ? 'int unused = 1;' : ''} }`;
  const sections = [{
    index: 0,
    name: '',
    flags: 0,
    size: 0
  }, {
    index: 1,
    name: '.caller',
    flags: 6,
    address: 0x100,
    size: 0x80
  }, {
    index: 2,
    name: '.provider',
    flags: 6,
    address: 0x200,
    size: 0x80
  }, ];
  const symbols = [];
  const units = [caller, provider].map((source, index) => {
    const file = path.join(scratch, `${index}.i`);
    fs.writeFileSync(file, source);
    const analysis = checker.parse(executable, file, source);
    const entries = analysis.functions.filter(fn => fn.definition).map((fn, ordinal) => {
      symbols.push({
        name: fn.name,
        binding: 1,
        symbolType: 2,
        size: 16,
        sectionIndex: index + 1,
        value: 0x100 + index * 0x100 + ordinal * 16
      });
      return {
        symbol: fn.name,
        binding: 'GLOBAL'
      };
    });
    return {
      identity: {
        source: `${index}.c`,
        sha256: checker.digest(source),
        authoredSha256: checker.digest(source)
      },
      analysis,
      entries,
      sections: [sections[index + 1].name],
      relocations: []
    };
  });
  const report = {
    producers: units.map(unit => unit.identity),
    ...checker.analyze(units, {
      sections,
      symbols
    })
  };
  return {
    report,
    units,
    linked: {
      sections,
      symbols,
      programHeaders: []
    },
    rich: exceptions.liveConflicts(report.comparisons, units)
  };
}

function permanentPolicy(permitted, projectedReference = null) {
  const file = path.join(scratch, 'config/fixture-exceptions.json');
  const bytes = Buffer.from(JSON.stringify({
    schemaVersion: 1,
    phase: 'permanent',
    exceptions: permitted
  }));
  fs.writeFileSync(file, bytes);
  const epoch = {
    phase: 'permanent',
    richPolicy: 'exact-legacy-exceptions',
    exceptions: {
      path: 'config/fixture-exceptions.json',
      sha256: exceptions.digest(bytes)
    }
  };
  const filename = require.resolve('../tools/lib/c_interface_prospective');
  let code = fs.readFileSync(filename, 'utf8').replace(
    /const ACCEPTANCE_EPOCH\s*=\s*\{[\s\S]*?\};/,
    `const ACCEPTANCE_EPOCH=${JSON.stringify(epoch)};`);
  if (projectedReference) {
    fs.writeFileSync(path.join(scratch, projectedReference.bootstrap.path), projectedReference.referenceBytes);
    code = code.replace(/const BOOTSTRAP\s*=\s*\{[\s\S]*?\};/,
      `const BOOTSTRAP=${JSON.stringify(projectedReference.bootstrap)};`);
  }
  // Only the independently ratified epoch constant is a fixture. The actual
  // enforcement module, comparator, baseline and source analyses execute here.
  const instance = new Module(filename, module);
  instance.filename = filename;
  instance.paths = module.paths;
  instance._compile(code, filename);
  return instance.exports;
}

function enforceWithReference(policy, input, predecessor, returnReport = false) {
  const report = {
    ...input.report,
    verdict: {
      pass: true
    }
  };
  policy.enforce(scratch, scratch, {
    outputs: {}
  }, report, input.units, input.linked, {
    reference: {
      identity: {
        fixture: 'trusted accepted source'
      },
      inventory: policy.inventory(predecessor.units),
      bindingFingerprint: policy.linkageFingerprint({
        outputs: {}
      }),
      relationships: []
    }
  });
  return returnReport ? report : report.verdict.pass;
}

const original = fixture(false, false);
check('original rich disagreements are separate from old definite findings',
  original.report.findings.length === 0 && original.rich.length === 2);

// First final cleanup fixes f but retains independently evidenced, unchanged g.
const first = fixture(true, false);
const firstPacket = exceptions.ratchet(first.rich, original.rich);
check('first cleanup retires only the corrected boundary',
  firstPacket.exceptions.length === 1 && firstPacket.retired.length === 1);
check('unchanged first accepted source passes cold and warm',
  exceptions.assess(first.rich, firstPacket.exceptions).pass);

// Ordinary baseline edits still accept this scanner's original unsupported rows.
const editedBaseline = {
  schemaVersion: 1,
  purpose: 'reviewed-existing-interface-debt',
  producers: original.report.producers,
  findings: original.report.findings,
  limitations: [...new Map(original.report.gaps.map(gap => {
    const row = checker.limitation(gap);
    return [row.id, row];
  })).values()]
};
check('ordinary baseline can contain restored original unsupported rows',
  checker.compareBaseline(original.report, editedBaseline).pass);
check('cold restore after first cleanup rejects independently of baseline',
  !exceptions.assess(original.rich, firstPacket.exceptions).pass);
check('warm restore after first cleanup has the same rejection',
  !exceptions.assess(original.rich, firstPacket.exceptions).pass);
const projectedInput = { ...first.report, schemaVersion: 2, frontend: checker.digest(frontend),
  verdict: { pass: true, unattributedChangedProducers: [] },
  compatibility: { inventory: referencePolicy.inventory(first.units), richConflicts: first.rich,
    siteConflicts: [], relationships: [], bindingFingerprint: referencePolicy.linkageFingerprint({}) } };
const projection = projector.project(projectedInput, original.rich, '1'.repeat(40));
check('pre-build projection selects only unchanged remaining exceptions',
  projection.epoch.richPolicy === 'exact-legacy-exceptions');
check('projected portable reference is explicitly permanent',
  JSON.parse(zlib.gunzipSync(projection.referenceBytes)).phase === 'permanent');
assert.throws(() => projector.project({ ...projectedInput, findings: [{}] }, original.rich, '1'.repeat(40)),
  /diagnostic census/);
checks++;
const firstPolicy = permanentPolicy(firstPacket.exceptions, projection);
check('cold loader accepts the ratified projected reference', !!firstPolicy.reference(scratch, null));
const referenceFile = path.join(scratch, projection.bootstrap.path);
fs.writeFileSync(referenceFile, fs.readFileSync(path.join(__dirname, '..', referencePolicy.BOOTSTRAP.path)));
assert.throws(() => firstPolicy.reference(scratch, null), /bootstrap identity changed/);
checks++;
fs.writeFileSync(referenceFile, projection.referenceBytes);
check('real enforce rejects restored original with cold R18 reference',
  !enforceWithReference(firstPolicy, original, original));
check('real enforce rejects restored original with warm cleaned reference',
  !enforceWithReference(firstPolicy, original, first));
check('real enforce permits legitimate first accepted tree cold',
  enforceWithReference(firstPolicy, first, original));

const later = fixture(true, true);
const retirementReport = enforceWithReference(firstPolicy, later, first, true);
check('actual permanent enforcement blocks a legitimate cleanup until retirement',
  retirementReport.verdict.pass === false && retirementReport.verdict.baselinePass === true &&
  retirementReport.compatibility.exceptions.stale.length === 1);
const retirementProjection = projector.project(retirementReport, firstPacket.exceptions, '2'.repeat(40));
check('actual rejected report projects only its demonstrated retirement',
  retirementProjection.retired.length === 1 &&
  JSON.parse(retirementProjection.exceptionBytes).exceptions.length === 0);
for (const bad of [
  { ...retirementReport, findings: [{}] },
  { ...retirementReport, verdict: { ...retirementReport.verdict, baselinePass: false } },
  { ...retirementReport, verdict: { ...retirementReport.verdict, unattributedChangedProducers: [{}] } },
  { ...retirementReport, compatibility: { ...retirementReport.compatibility, siteConflicts: [{}] } },
  { ...retirementReport, compatibility: { ...retirementReport.compatibility, richConflicts: original.rich } },
  { ...retirementReport, comparisons: retirementReport.comparisons.map(row => ({ ...row, result: 'unknown' })) },
  { ...retirementReport, comparisons: [] },
]) {
  assert.throws(() => projector.project(bad, firstPacket.exceptions, '2'.repeat(40)), /diagnostic census/);
  checks++;
}
const projectedLaterPolicy = permanentPolicy([], retirementProjection);
check('retirement proposal accepts actual cleaned source only after new fixture pin',
  enforceWithReference(projectedLaterPolicy, later, first));
check('retirement proposal rejects cold restoration',
  !enforceWithReference(projectedLaterPolicy, first, original));
check('retirement proposal rejects warm restoration',
  !enforceWithReference(projectedLaterPolicy, first, later));
check('clearing a grandfathered disagreement requires retirement',
  exceptions.assess(later.rich, firstPacket.exceptions).stale.length === 1);
const laterPacket = exceptions.ratchet(later.rich, firstPacket.exceptions);
check('later accepted cleanup has no remaining exception', laterPacket.exceptions.length === 0);
check('legitimate later source passes cold and warm',
  exceptions.assess(later.rich, laterPacket.exceptions).pass);
check('cold reintroduction after later cleanup rejects',
  !exceptions.assess(first.rich, laterPacket.exceptions).pass);
check('warm reintroduction after later cleanup rejects identically',
  !exceptions.assess(first.rich, laterPacket.exceptions).pass);
const laterPolicy = permanentPolicy(laterPacket.exceptions);
check('real enforce rejects later rollback with cold reference',
  !enforceWithReference(laterPolicy, first, original));
check('real enforce rejects later rollback with warm reference',
  !enforceWithReference(laterPolicy, first, later));
check('real enforce permits legitimate later accepted tree cold',
  enforceWithReference(laterPolicy, later, original));
assert.throws(() => exceptions.ratchet(original.rich, firstPacket.exceptions), /new or changed/);
checks++;
check('provider body change invalidates a surviving legacy exception',
  !exceptions.assess(fixture(true, false, true).rich, firstPacket.exceptions).pass);

const file = path.join(scratch, 'config/exceptions.json');
const acceptedBytes = Buffer.from(JSON.stringify(laterPacket));
fs.writeFileSync(file, acceptedBytes);
const trustedEpoch = {
  phase: 'permanent',
  richPolicy: 'exact-legacy-exceptions',
  exceptions: {
    path: 'config/exceptions.json',
    sha256: exceptions.digest(acceptedBytes)
  }
};
check('ratified code pin reads the legitimate empty successor',
  exceptions.read(scratch, trustedEpoch).length === 0);
fs.writeFileSync(file, JSON.stringify({
  ...firstPacket,
  candidateSuppliedAnchor: exceptions.digest(JSON.stringify(firstPacket))
}));
assert.throws(() => exceptions.read(scratch, trustedEpoch), /identity changed/);
checks++;
check('global zero also rejects the original rich disagreement',
  !exceptions.assess(original.rich, []).pass);

fs.writeFileSync(path.join(scratch, 'results.json'), JSON.stringify({
  status: 'pass',
  checks,
  scope: 'C90 Clang fixtures and fixed verifier-pin retirement; no ROM build',
  firstRetired: firstPacket.retired,
  laterRetired: laterPacket.retired
}, null, 2));
console.log(JSON.stringify({
  status: 'pass',
  checks
}));
