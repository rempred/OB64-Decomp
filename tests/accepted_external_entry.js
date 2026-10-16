'use strict';
const assert = require('assert/strict');
const active = require('../tools/lib/active_targets');
// Fixture externs use the same authenticated complete-entry resolver as targets.
// Do not infer a runtime address from a row's first slice or from a linear delta.
function resolveExternalEntry(context, registry, symbol) {
  const resolved = active.resolveAcceptedRows(context.model, symbol, context.multiOwnerContracts, null, registry);
  assert.equal(resolved.rows.length, 1, 'fixture extern must have one authenticated physical owner');
  assert.equal(resolved.owners.length, 1, 'fixture extern must resolve one complete executable entry');
  const owner = resolved.owners[0];
  assert.strictEqual(owner.row, resolved.rows[0]);
  assert.equal(owner.logicalOffset, 0);
  assert(owner.bytes > 0 && Number.isInteger(owner.vramStartNumber));
  const slices = owner.row.slices.filter(s => s.sectionName === owner.sectionName && s.executable
    && s.romStart === owner.romStartNumber && s.romEndExclusive === owner.romEndNumber
    && s.vramStart === owner.vramStartNumber && s.vramEndExclusive === owner.vramEndNumber);
  assert.equal(slices.length, 1, 'fixture extern placement must be unique');
  return owner.vramStartNumber;
}
module.exports = {resolveExternalEntry};
