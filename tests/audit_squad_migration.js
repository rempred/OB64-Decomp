#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { validateSquadMigration, validateSquadMigrationModel } = require('../tools/audit');

const pins = [
  ['func_0019554C', 3063, '5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B'],
  ['func_001957D0', 3064, 'E05EF7BF474667F4586C0674C4F55DCEF161A2D0E0070BA2D46A870EB79D146B'],
  ['func_001960A8', 3066, '9C56D2EDC784BCE4B789A3A5FE3A0226C10F9EC60CDD90DD27A2A41C834F46F6'],
];
function fixture() {
  return {
    targets: pins.map(([symbol, rowIndex, hash]) => ({ symbol, rowIndex,
      source: `src/lib/${symbol}.c`, expectedTextSha256: hash })),
    records: pins.map(([symbol, rowIndex, hash]) => ({
      symbol, rowIndex, sectionName: `.ob64.r${rowIndex}`,
      sourceObjectEvidence: { sourceClass: 'PURE_C' },
      linkedTargetSha256: hash, expectedTargetSha256: hash, rawBytesExact: true,
      linkedOwner: `objects/c/${symbol}.o`, retainedAssemblySlices: [],
      owners: [{ rowIndex, sectionName: `.ob64.r${rowIndex}`, rawBytesExact: true,
        linkedSha256: hash, expectedSha256: hash }],
    })),
  };
}
const positive = fixture();
assert.deepStrictEqual(validateSquadMigrationModel(positive.targets), { p3066Active: true });
const report = validateSquadMigration(positive.targets, positive.records);
assert.strictEqual(report.p3066Active, true);
for (const key of ['p3063', 'p3064', 'p3066']) assert.strictEqual(report[key].sourceClass, 'PURE_C');
let rejected = 0;
for (let index = 0; index < pins.length; index += 1) {
  const mutations = [
    (f) => f.targets.splice(index, 1),
    (f) => f.targets.push({ ...f.targets[index] }),
    (f) => { f.targets[index].rowIndex += 1; },
    (f) => { f.targets[index].symbol = 'wrong_owner'; },
    (f) => { f.targets[index].source = 'src/wrong.c'; },
    (f) => { f.targets[index].expectedTextSha256 = '0'.repeat(64); },
    (f) => f.records.splice(index, 1),
    (f) => f.records.push({ ...f.records[index] }),
    (f) => { f.records[index].rowIndex += 1; },
    (f) => { f.records[index].symbol = 'wrong_owner'; },
    ...['HYBRID_C', 'ASM', 'UNKNOWN'].map((value) => (f) => { f.records[index].sourceObjectEvidence.sourceClass = value; }),
    (f) => { delete f.records[index].sourceObjectEvidence; },
    (f) => { f.records[index].linkedTargetSha256 = '0'.repeat(64); },
    (f) => { f.records[index].expectedTargetSha256 = '0'.repeat(64); },
    (f) => { f.records[index].rawBytesExact = false; },
    (f) => { f.records[index].sectionName = '.ob64.wrong'; },
    (f) => { f.records[index].linkedOwner = 'objects/asm/fallback.o'; },
    (f) => { f.records[index].owners = []; },
    (f) => f.records[index].owners.push({ ...f.records[index].owners[0] }),
    (f) => { f.records[index].owners[0].rowIndex += 1; },
    (f) => { f.records[index].owners[0].sectionName = '.ob64.wrong'; },
    (f) => { f.records[index].owners[0].rawBytesExact = false; },
    (f) => { f.records[index].owners[0].linkedSha256 = '0'.repeat(64); },
    (f) => { f.records[index].owners[0].expectedSha256 = '0'.repeat(64); },
    (f) => { delete f.records[index].retainedAssemblySlices; },
    (f) => f.records[index].retainedAssemblySlices.push({ bytes: 4 }),
  ];
  for (const mutate of mutations) {
    const f = fixture();
    mutate(f);
    assert.throws(() => validateSquadMigration(f.targets, f.records), /migration gate failed/);
    rejected += 1;
  }
}
console.log(`Squad migrated audit state: PASS; ${rejected} invalid states rejected`);
