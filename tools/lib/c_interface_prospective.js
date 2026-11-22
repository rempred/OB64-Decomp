'use strict';
const fs = require('fs'),
  path = require('path'),
  cp = require('child_process'),
  crypto = require('crypto');
function digest(value) {
  const bytes = Buffer.isBuffer(value) || typeof value === 'string' ? value : JSON.stringify(value);
  return crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
}
const fail = m => {
  throw Error('C interface prospective contract: ' + m);
};
const POLICY = 'zero-definite-and-affected-interfaces-v2';
// Ratify this code pin and the projected reference before the final canonical run.
// Transition evidence is diagnostic and cannot publish verified CURRENT.
const ACCEPTANCE_EPOCH = {
  "phase": "permanent",
  "richPolicy": "global-zero",
  "exceptions": {
    "path": "config/c-interface-exceptions.json",
    "sha256": "F30F0632AC22E9F125E33E750763121BEE8C0408DA416CDDB5801775DA8CE752"
  }
};
// Transition pin only. Independent final-wave ratification replaces it before publication.
const BOOTSTRAP = {
  "path": "config/c-interface-reference.json.gz",
  "sha256": "37E98EC9420B9B3C8B2DD14B54AA93524623BD953F84C5F759E4752A86FB3815",
  "commit": "a959ee02349c2a59563d794994b393aef1597754"
};

function linkageFingerprint(build) {
  return digest({
    linkage: build.acceptedInputs?.linkageConfig,
    overlay: (build.acceptedInputs?.phase7Model || []).filter(x => x.path ===
      'config/splat/us_rev0.overlay-linker-inputs.json')
  });
}

function inventory(units) {
  return units.map(u => ({
    source: u.identity.source,
    sha256: u.identity.sha256,
    authoredSha256: u.identity.authoredSha256,
    status: u.analysis.status,
    calls: u.analysis.calls.map(c => ({
      owner: c.owner,
      name: c.name || c.addressedDeclaration?.name || null,
      anchor: c.anchor,
      occurrence: c.occurrence,
      invoked: c.invokedCanonical.fingerprint
    })),
    functions: u.analysis.functions.filter(f => f.definition).map(f => ({
      name: f.name,
      local: f.local,
      bodyFingerprint: f.bodyFingerprint
    })),
    declarations: u.analysis.functions.filter(f => !f.definition).map(f => ({
      name: f.name,
      local: f.local,
      signatureFingerprint: f.contractCanonical.fingerprint
    }))
  }));
}

function validateInventory(rows) {
  if (!Array.isArray(rows)) fail('missing reference inventory');
  const sources = new Set();
  for (const u of rows) {
    if (!u || typeof u.source !== 'string' || sources.has(u.source) || !Array.isArray(u.functions) || !Array
      .isArray(u.declarations) || (u.status !== 'parsed' && !/^[A-F0-9]{64}$/.test(u.sha256))) fail(
      'malformed reference producer');
    sources.add(u.source);
    for (const f of u.functions)
      if (typeof f.name !== 'string' || !/^[A-F0-9]{64}$/.test(f.bodyFingerprint)) fail(
        'unattributed reference function');
  }
}

function bootstrap(root) {
  const file = path.join(root, BOOTSTRAP.path);
  if (!fs.existsSync(file)) return null;
  const bytes = fs.readFileSync(file);
  if (digest(bytes) !== BOOTSTRAP.sha256) fail('bootstrap identity changed');
  const data = JSON.parse(require('zlib').gunzipSync(bytes, {
    maxOutputLength: 16 * 1024 * 1024
  }));
  if ((ACCEPTANCE_EPOCH.phase === 'permanent' && data.phase !== 'permanent') || data.schemaVersion !== 3 ||
    data.commit !== BOOTSTRAP.commit || data.policy !== POLICY || !Array.isArray(data.declarations) || !Array
    .isArray(data.units)) fail('wrong bootstrap contract');
  const declarations = data.declarations.map(d => ({
    name: d[0],
    local: !!d[1],
    signatureFingerprint: d[2]
  }));
  const inventory = data.units.map(u => ({
    source: u[0],
    status: u[1],
    sha256: u[2],
    functions: u[3].map(f => ({
      name: f[0],
      local: !!f[1],
      bodyFingerprint: f[2]
    })),
    declarations: u[4].map(i => {
      if (!Number.isSafeInteger(i) || i < 0 || i >= declarations.length) fail(
        'invalid bootstrap declaration index');
      return declarations[i];
    }),
    calls: u[5].map(c => ({
      owner: c[0],
      name: c[1],
      anchor: c[2],
      occurrence: c[3],
      invoked: c[4]
    }))
  }));
  validateInventory(inventory);
  return {
    kind: 'accepted-commit-bootstrap',
    identity: {
      commit: BOOTSTRAP.commit,
      sha256: digest(bytes)
    },
    inventory,
    bindingFingerprint: data.bindingFingerprint,
    relationships: data.relationships || []
  };
}

function reference(root, state) {
  if (state?.status === 'verified' && state.cInterfaceContract === 2) {
    const freshFile = state.freshCompilationReport;
    if (typeof freshFile !== 'string') fail('missing predecessor fresh companion');
    const freshBytes = fs.readFileSync(freshFile);
    if (digest(freshBytes) !== state.freshCompilationSha256) fail('predecessor fresh companion identity');
    const fresh = JSON.parse(freshBytes);
    const accepted = require('./c_interface_companion').validate({
      root,
      state,
      fresh
    });
    if (accepted.report.compatibility?.policy !== POLICY) fail('predecessor policy mismatch');
    validateInventory(accepted.report.compatibility.inventory);
    return {
      kind: 'verified-predecessor',
      identity: {
        fingerprint: state.fingerprint,
        report: state.cInterfaceReportRawSha256
      },
      inventory: accepted.report.compatibility.inventory,
      bindingFingerprint: accepted.report.compatibility.bindingFingerprint,
      relationships: accepted.report.compatibility.relationships || []
    };
  }
  return bootstrap(root);
}

function affected(now, prior) {
  if (!prior) return {
    mode: 'all-known-interfaces-no-trusted-reference',
    changedCalls: now.flatMap(u => (u.calls || []).map(c => u.source + '#' + c.owner + '#' + c.anchor +
      '#' + c.occurrence)),
    changedFunctions: now.flatMap(u => u.functions.map(f => u.source + '#' + f.name)),
    changedDeclarations: now.flatMap(u => u.declarations.map(d => u.source + '#' + d.name)),
    unparsed: now.filter(u => u.status !== 'parsed').map(u => u.source)
  };
  validateInventory(prior.inventory);
  const previous = new Map(prior.inventory.map(u => [u.source, u])),
    changedFunctions = [],
    changedDeclarations = [],
    changedCalls = [],
    unparsed = [];
  for (const u of now) {
    const old = previous.get(u.source);
    if (u.status !== 'parsed') {
      if (!old || old.sha256 !== u.sha256) unparsed.push(u.source);
      continue;
    }
    for (const c of u.calls || []) {
      const matches = (old?.calls || []).filter(x => x.owner === c.owner && x.anchor === c.anchor && x
        .occurrence === c.occurrence);
      if (matches.length !== 1 || matches[0].name !== c.name || matches[0].invoked !== c.invoked) changedCalls
        .push(u.source + '#' + c.owner + '#' + c.anchor + '#' + c.occurrence);
    }
    for (const f of u.functions) {
      const matches = old?.functions.filter(x => x.name === f.name && x.local === f.local) || [];
      if (matches.length !== 1 || matches[0].bodyFingerprint !== f.bodyFingerprint) changedFunctions.push(u
        .source + '#' + f.name);
    }
    const names = new Set([...u.declarations, ...(old?.declarations || [])].map(d => d.name));
    for (const name of names) {
      const shapes = list => list.filter(d => d.name === name).map(d => d.signatureFingerprint).sort();
      if (JSON.stringify(shapes(u.declarations)) !== JSON.stringify(shapes(old?.declarations || [])))
        changedDeclarations.push(u.source + '#' + name);
    }
  }
  return {
    mode: 'changed-functions-and-visible-declarations',
    reference: prior.identity,
    changedFunctions,
    changedDeclarations,
    changedCalls,
    unparsed
  };
}

function enforce(root, output, buildReport, report, units, linked, options = {}) {
  const rows = inventory(units),
    prior = options.reference === undefined ? bootstrap(root) : options.reference,
    bindingFingerprint = linkageFingerprint(buildReport),
    scope = affected(rows, prior?.bindingFingerprint === bindingFingerprint ? prior : null),
    functions = new Set(scope.changedFunctions),
    declarations = new Set(scope.changedDeclarations),
    calls = new Set(scope.changedCalls);
  if (prior && prior.bindingFingerprint !== bindingFingerprint) {
    scope.reason = 'accepted-linkage-identity-changed-or-unavailable';
    scope.reference = prior.identity;
  }
  const all = scope.mode.startsWith('all-');
  const touched = c => all || functions.has(c.provider + '#' + c.providerName) || declarations.has(c.caller +
    '#' + c.name) || c.owner && calls.has(c.caller + '#' + c.owner + '#' + c.anchor + '#' + c.occurrence);
  const compared = report.comparisons.filter(touched);
  const exceptionPolicy = require('./c_interface_exceptions');
  const actualRichConflicts = exceptionPolicy.liveConflicts(report.comparisons, units);
  const exceptionAssessment = ACCEPTANCE_EPOCH.phase === 'permanent' ? exceptionPolicy.assess(
    actualRichConflicts, exceptionPolicy.read(root, ACCEPTANCE_EPOCH)) : null;
  const conflicts = exceptionAssessment ? exceptionAssessment.newConflicts : compared.filter(c => c.result ===
    'incompatible');
  const limitations = compared.filter(c => c.result === 'unknown').map(c => ({
    reason: 'compatibility-type-unresolved',
    ...c
  }));
  const indirect = units.flatMap(u => u.analysis.calls.filter(c => !c.name && (all || functions.has(u.identity
    .source + '#' + c.owner))).map(c => ({
    producer: u.identity.source,
    owner: c.owner,
    anchor: c.anchor,
    occurrence: c.occurrence,
    invoked: c.invokedCanonical,
    status: 'unresolved-supplier'
  })));
  const sites = require('./c_interface_site_evidence');
  const evidence = sites.check(root, output, buildReport, units, linked, {
    prior,
    scope
  });
  const assembly = sites.assemblyEvidence(root, output, buildReport, units, linked, scope);
  const previousVerdict = report.verdict || {
    pass: true,
    newConflicts: [],
    changedUnresolved: []
  };
  report.schemaVersion = 2;
  report.compatibility = {
    version: 2,
    phase: ACCEPTANCE_EPOCH.phase,
    policy: POLICY,
    exceptions: exceptionAssessment,
    richConflicts: actualRichConflicts,
    bindingFingerprint,
    inventory: rows,
    scope,
    comparisons: compared,
    conflicts,
    limitations,
    indirect,
    relationships: evidence.relationships,
    siteInput: evidence.input,
    assembly,
    siteConflicts: evidence.conflicts,
    siteLimitations: [...evidence.limitations, ...assembly.filter(row => row.kind === 'unparsed-C-incoming-call').map(row => ({ reason: 'known-incoming-call-from-unparsed-C', ...row }))]
  };
  report.verdict = {
    ...previousVerdict,
    baselinePass: previousVerdict.pass === true,
    pass: previousVerdict.pass && report.findings.length === 0 && conflicts.length === 0 && scope.unparsed
      .length === 0 && evidence.conflicts.length === 0 && (!exceptionAssessment || exceptionAssessment
      .pass),
    readyForPublication: ACCEPTANCE_EPOCH.phase === 'permanent',
    definiteConflicts: report.findings.length,
    affectedInterfaceConflicts: conflicts,
    unattributedChangedProducers: scope.unparsed,
    siteConflicts: evidence.conflicts,
    policy: POLICY
  };
}
module.exports = {
  ACCEPTANCE_EPOCH,
  linkageFingerprint,
  POLICY,
  BOOTSTRAP,
  inventory,
  validateInventory,
  reference,
  affected,
  enforce,
  digest
};
