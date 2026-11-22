'use strict';

// Project reviewed reference metadata BEFORE the wave's one canonical build.
// This writes ignored proposals only; it never installs pins or publishes CURRENT.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const policy = require('./lib/c_interface_prospective');
const exceptions = require('./lib/c_interface_exceptions');

function project(candidate, permitted, reviewedTree) {
  if (!/^[a-f0-9]{40}$/i.test(reviewedTree)) throw Error('Expected exact reviewed source tree');
  const assessment = exceptions.assess(candidate.compatibility?.richConflicts, permitted);
  // A fixed boundary is deliberately still rejected by canonical enforcement
  // until its old allowance is retired. Only this negative may be projected.
  const retirementOnly = candidate.compatibility?.phase === 'permanent' &&
    candidate.verdict?.pass === false && candidate.verdict.baselinePass === true &&
    assessment.stale.length > 0 && assessment.newConflicts.length === 0 &&
    candidate.compatibility.conflicts?.length === 0 &&
    assessment.stale.every(retired => {
      const current = (candidate.comparisons || []).filter(comparison =>
        comparison.caller === retired.caller && comparison.provider === retired.provider &&
        comparison.providerName === retired.providerName && comparison.name === retired.name &&
        JSON.stringify(comparison.linkedIdentity) === JSON.stringify(retired.linkedIdentity));
      // Disappearance, failed parsing or an unknown type is not a demonstrated
      // resolution. Keep the allowance and request evidence instead.
      return current.length > 0 && current.every(comparison => comparison.result === 'compatible');
    });
  if (candidate.schemaVersion !== 2 || (candidate.verdict?.pass !== true && !retirementOnly) ||
    candidate.findings?.length !== 0 || candidate.compatibility?.siteConflicts?.length !== 0 ||
    candidate.verdict?.unattributedChangedProducers?.length !== 0) {
    throw Error('Projection requires the passing exact-source diagnostic census');
  }
  const inventory = candidate.compatibility.inventory;
  policy.validateInventory(inventory);
  const expectedSources = new Map(candidate.producers.map(producer => [producer.source, producer]));
  if (expectedSources.size !== inventory.length || inventory.some(unit => {
      const producer = expectedSources.get(unit.source);
      return !producer || producer.sha256 !== unit.sha256 ||
        producer.authoredSha256 !== unit.authoredSha256;
    })) throw Error('Reference inventory does not cover the authenticated producers');

  const packet = exceptions.ratchet(candidate.compatibility.richConflicts, permitted);
  const dictionary = [];
  const declarationIds = new Map();
  const units = inventory.map(unit => {
    const declarations = unit.declarations.map(declaration => {
      const tuple = [declaration.name, declaration.local ? 1 : 0, declaration.signatureFingerprint];
      const key = JSON.stringify(tuple);
      if (!declarationIds.has(key)) {
        declarationIds.set(key, dictionary.length);
        dictionary.push(tuple);
      }
      return declarationIds.get(key);
    });
    return [unit.source, unit.status, unit.status === 'parsed' ? null : unit.sha256,
      unit.functions.map(fn => [fn.name, fn.local ? 1 : 0, fn.bodyFingerprint]), declarations,
      unit.calls.map(call => [call.owner, call.name, call.anchor, call.occurrence, call.invoked])
    ];
  });
  const reference = {
    bindingFingerprint: candidate.compatibility.bindingFingerprint,
    schemaVersion: 3,
    phase: 'permanent',
    policy: policy.POLICY,
    commit: reviewedTree,
    acceptedReport: {
      kind: 'reviewed-projection-not-yet-canonical',
      sha256: exceptions.digest(candidate),
      frontend: candidate.frontend
    },
    declarations: dictionary,
    units,
    relationships: candidate.compatibility.relationships.filter(row => row.kind.startsWith('known-'))
      .map(row => ({
        id: row.id,
        kind: row.kind,
        caller: row.caller,
        target: row.target,
        source: row.source,
        invocation: row.invocation
      })),
  };
  const referenceBytes = zlib.gzipSync(Buffer.from(JSON.stringify(reference) + '\n'), {
    level: 9
  });
  const exceptionBytes = Buffer.from(JSON.stringify(packet, null, 2) + '\n');
  return {
    referenceBytes,
    exceptionBytes,
    bootstrap: {
      path: 'config/c-interface-reference.json.gz',
      sha256: exceptions.digest(referenceBytes),
      commit: reviewedTree
    },
    epoch: {
      phase: 'permanent',
      richPolicy: packet.exceptions.length ? 'exact-legacy-exceptions' : 'global-zero',
      exceptions: {
        path: 'config/c-interface-exceptions.json',
        sha256: exceptions.digest(exceptionBytes)
      }
    },
    retired: packet.retired,
  };
}

function main() {
  const [trustedTransitionFile, candidateFile, reviewedTree, outputArgument] = process.argv.slice(2);
  if (!outputArgument) {
    throw Error(
      'Usage: node tools/project_c_interface_epoch.js trusted-transition.json candidate-report.json reviewed-tree ignored-output'
      );
  }
  const root = process.cwd();
  const output = path.resolve(outputArgument);
  const relative = path.relative(path.join(root, 'build'), output);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw Error('Epoch proposals must stay in an ignored build subdirectory');
  }
  let permitted;
  if (policy.ACCEPTANCE_EPOCH.phase === 'permanent') {
    // A later cleanup can only retire an existing, code-pinned exception.
    permitted = exceptions.read(root, policy.ACCEPTANCE_EPOCH);
  } else {
    const bytes = fs.readFileSync(trustedTransitionFile);
    if (exceptions.digest(bytes) !== policy.ACCEPTANCE_EPOCH.richEvidenceSha256) {
      throw Error('Transition rich evidence differs from the independently reviewed R18 evidence');
    }
    permitted = JSON.parse(bytes).exceptions;
  }
  const candidateBytes = fs.readFileSync(candidateFile);
  const result = project(JSON.parse(candidateBytes), permitted, reviewedTree);
  fs.mkdirSync(output, {
    recursive: true
  });
  fs.writeFileSync(path.join(output, 'c-interface-reference.json.gz'), result.referenceBytes);
  fs.writeFileSync(path.join(output, 'c-interface-exceptions.json'), result.exceptionBytes);
  const proposal = {
    status: 'requires-independent-ratification-before-canonical-run',
    candidateReportSha256: exceptions.digest(candidateBytes),
    reviewedTree,
    bootstrap: result.bootstrap,
    epoch: result.epoch,
    retired: result.retired
  };
  fs.writeFileSync(path.join(output, 'proposal.json'), JSON.stringify(proposal, null, 2) + '\n');
  console.log(JSON.stringify(proposal));
}

if (require.main === module) main();
module.exports = {
  project
};
