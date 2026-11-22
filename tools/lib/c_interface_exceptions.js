'use strict';

// These are exact, independently ratified legacy disagreements, not editable
// census-gap waivers. A retired or materially changed disagreement cannot use one.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function digest(value) {
  const bytes = Buffer.isBuffer(value) || typeof value === 'string' ?
    value : JSON.stringify(value);
  return crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
}

function evidence(comparison, units) {
  const sourceOf = unit => unit.identity?.source || unit.source;
  const provider = units.find(unit => sourceOf(unit) === comparison.provider);
  const caller = units.find(unit => sourceOf(unit) === comparison.caller);
  const functions = provider?.analysis?.functions || provider?.functions || [];
  const definitions = functions.filter(fn =>
    (provider.functions || fn.definition) && fn.name === comparison.providerName);
  if (definitions.length !== 1 || !definitions[0].bodyFingerprint) {
    throw Error('Cannot attribute a legacy interface exception to one provider body');
  }
  const uses = (caller?.analysis?.calls || caller?.calls || [])
    .filter(call => (call.name || call.addressedDeclaration?.name) === comparison.name)
    .map(call => ({
      owner: call.owner,
      anchor: call.anchor,
      occurrence: call.occurrence,
      invoked: call.invokedCanonical?.fingerprint || call.invoked
    }))
    .sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
  const boundary = {
    provider: comparison.provider,
    providerName: comparison.providerName,
    providerBody: definitions[0].bodyFingerprint,
    definition: comparison.definition.fingerprint,
    linkedIdentity: comparison.linkedIdentity,
    caller: comparison.caller,
    name: comparison.name,
    declaration: comparison.declaration.fingerprint,
    uses,
  };
  return {
    id: digest(boundary),
    ...boundary,
    display: {
      declaration: comparison.declaration.spelling,
      definition: comparison.definition.spelling
    }
  };
}

function liveConflicts(comparisons, units) {
  const unique = new Map();
  for (const comparison of comparisons) {
    if (comparison.result !== 'incompatible') continue;
    const row = evidence(comparison, units);
    unique.set(row.id, row);
  }
  return [...unique.values()].sort((left, right) => left.id.localeCompare(right.id));
}

function validate(rows) {
  if (!Array.isArray(rows)) throw Error('Missing ratified interface exceptions');
  const seen = new Set();
  for (const row of rows) {
    const {
      id,
      display,
      ...boundary
    } = row;
    if (id !== digest(boundary) || seen.has(id)) {
      throw Error('Malformed or duplicate ratified interface exception');
    }
    seen.add(id);
  }
}

function read(root, epoch) {
  if (epoch.phase !== 'permanent') return null;
  if (epoch.richPolicy === 'global-zero') return [];
  if (epoch.richPolicy !== 'exact-legacy-exceptions' || !epoch.exceptions) {
    throw Error('Permanent caller compatibility has not been ratified');
  }
  const bytes = fs.readFileSync(path.join(root, epoch.exceptions.path));
  if (digest(bytes) !== epoch.exceptions.sha256) {
    throw Error('Ratified interface exception identity changed');
  }
  const packet = JSON.parse(bytes);
  if (packet.schemaVersion !== 1 || packet.phase !== 'permanent') {
    throw Error('Wrong ratified interface exception contract');
  }
  validate(packet.exceptions);
  return packet.exceptions;
}

function assess(actual, permitted) {
  validate(actual);
  validate(permitted);
  const expected = new Set(permitted.map(row => row.id));
  const observed = new Set(actual.map(row => row.id));
  const newConflicts = actual.filter(row => !expected.has(row.id));
  const stale = permitted.filter(row => !observed.has(row.id));
  return {
    pass: newConflicts.length === 0 && stale.length === 0,
    live: actual,
    newConflicts,
    stale,
  };
}

function ratchet(actual, trustedPrevious) {
  // This pure projection is emitted before the canonical run. Installation of
  // its new verifier pin remains an independently reviewed tooling change.
  const result = assess(actual, trustedPrevious);
  if (result.newConflicts.length) {
    throw Error('Cannot grandfather a new or changed interface disagreement');
  }
  return {
    schemaVersion: 1,
    phase: 'permanent',
    exceptions: actual,
    retired: result.stale.map(row => row.id),
  };
}

module.exports = {
  digest,
  evidence,
  liveConflicts,
  validate,
  read,
  assess,
  ratchet
};
