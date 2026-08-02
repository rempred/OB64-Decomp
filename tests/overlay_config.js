#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { ROOT } = require('../tools/lib/rom');
const {
  LAYOUT,
  buildConfig,
  compareParentAcceptedRows,
  parseDescriptors,
  parseGroupRecord,
  parseGroupsAndPointers,
  validateRuntimeObservations,
  verifySourceSplit,
} = require('../tools/lib/overlay_config');

const romPath = path.join(ROOT, 'build', 'baserom.us_rev0.z64');
const manifestPath = path.join(ROOT, 'asm', 'original', 'rev0', 'manifest.json');
const configPath = path.join(ROOT, 'config', 'overlays', 'us_rev0.json');
const parentRoot = process.env.OB64_PARENT_ROOT ? path.resolve(process.env.OB64_PARENT_ROOT) : null;
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'overlay_config_hostile_cases.json'), 'utf8'));
const rom = fs.readFileSync(romPath);

function expectFailure(fn, pattern, label) {
  let caught = null;
  try {
    fn();
  } catch (error) {
    caught = error;
  }
  assert(caught, `${label}: expected failure`);
  assert.match(caught.message, pattern, `${label}: wrong diagnostic`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const canonicalDescriptors = parseDescriptors(rom);
assert.strictEqual(canonicalDescriptors.length, 19);
const canonicalGroupData = parseGroupsAndPointers(rom);
assert.strictEqual(canonicalGroupData.groups.length, 11);
assert.strictEqual(canonicalGroupData.pointers.length, 11);
assert.strictEqual(canonicalGroupData.nullWord.value, '0x00000000');
assert(canonicalGroupData.groups.every((group) => group.memberIds.length > 0));

expectFailure(
  () => parseDescriptors(rom.subarray(0, LAYOUT.descriptorEnd - 1)),
  /truncated/,
  'descriptor truncation',
);
{
  const mutated = Buffer.from(rom);
  mutated.writeUInt32BE(0x80197B60, LAYOUT.descriptorStart + 4);
  expectFailure(() => parseDescriptors(mutated), /VRAM endpoint order/, 'descriptor endpoint order');
}
{
  const mutated = Buffer.from(rom);
  mutated.writeUInt32BE(0x8019A211, LAYOUT.descriptorStart + 7 * 4);
  mutated.writeUInt32BE(0x8019A211, LAYOUT.descriptorStart + 8 * 4);
  expectFailure(() => parseDescriptors(mutated), /16-byte aligned/, 'descriptor alignment');
}
{
  const empty = Buffer.from([0xFF, 0, 0, 0]);
  assert.deepStrictEqual(parseGroupRecord(empty, 0, 4, 19).memberIds, []);
  expectFailure(() => parseGroupRecord(Buffer.from([1, 2, 0, 0]), 0, 4, 19), /missing terminator/, 'group terminator');
  expectFailure(() => parseGroupRecord(Buffer.from([1, 0xFF, 1, 0]), 0, 4, 19), /nonzero alignment padding/, 'group padding');
  expectFailure(() => parseGroupRecord(Buffer.from([19, 0xFF, 0, 0]), 0, 4, 19), /out of range/, 'group ID range');
  expectFailure(() => parseGroupRecord(Buffer.from([0xFF, 0, 0, 0, 0, 0, 0, 0]), 0, 8, 19), /excess alignment padding/, 'group padding length');
}
{
  const mutated = Buffer.from(rom);
  mutated.writeUInt32BE(mutated.readUInt32BE(LAYOUT.pointerStart), LAYOUT.pointerStart + 4);
  expectFailure(() => parseGroupsAndPointers(mutated), /aliases/, 'pointer distinctness');
}
{
  const mutated = Buffer.from(rom);
  mutated.writeUInt32BE(0x80000000, LAYOUT.pointerStart);
  expectFailure(() => parseGroupsAndPointers(mutated), /outside group region/, 'pointer target ownership');
}
{
  const mutated = Buffer.from(rom);
  mutated.writeUInt32BE(1, LAYOUT.nullStart);
  expectFailure(() => parseGroupsAndPointers(mutated), /null word is not zero/, 'pointer null boundary');
}

const first = buildConfig({ romPath, manifestPath });
const second = buildConfig({ romPath, manifestPath });
assert.strictEqual(first.text, second.text, 'two generated config outputs must be byte-identical');
assert.strictEqual(first.text, fs.readFileSync(configPath, 'utf8'), 'tracked config must equal generated output');
assert.strictEqual(first.config.conservation.sourceSplit.owners.length, 4);
assert.strictEqual(first.config.conservation.sourceRomPositiveOverlapPairs, 0);
verifySourceSplit(rom, manifestPath);

{
  const mutated = Buffer.from(rom);
  mutated[LAYOUT.descriptorStart] ^= 0x01;
  expectFailure(() => verifySourceSplit(mutated, manifestPath), /ROM byte mismatch/, 'source-owner byte conservation');
}
{
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const part = manifest.chunks.flatMap((chunk) => chunk.parts).find((row) => row.name === 'overlay_groups_00038ab8');
  part.romStart = '0x00038ABC';
  const testRoot = path.join(ROOT, 'build', 'tests', 'overlay-config');
  fs.mkdirSync(testRoot, { recursive: true });
  const badManifest = path.join(testRoot, 'manifest-gap.json');
  fs.writeFileSync(badManifest, `${JSON.stringify(manifest, null, 2)}\n`);
  expectFailure(() => verifySourceSplit(rom, badManifest), /range mismatch/, 'source-owner gap/overlap');
}

if (parentRoot) {
  const parentPackage = path.join(parentRoot, 'wiki', 'overlay-descriptor-groups-20260731');
  const comparison = compareParentAcceptedRows(first.config, parentPackage);
  assert.deepStrictEqual(comparison, { descriptorRows: 19, groupRows: 11, pointerRows: 11, equal: true });
}

const mutations = {
  'runtime-helper-store-conflation': (config) => config.runtimeObservations.bss.observedStorePcUnion.push('0x80093380'),
  'runtime-wrong-descriptor-0-store-pc': (config) => { config.runtimeObservations.bss.rows[0].storePcs = ['0x800933B8']; },
  'runtime-missing-store-union-pc': (config) => config.runtimeObservations.bss.observedStorePcUnion.pop(),
  'runtime-extra-store-union-pc': (config) => config.runtimeObservations.bss.observedStorePcUnion.push('0x80093400'),
  'runtime-unsupported-other-group': (config) => { config.runtimeObservations.selections[0].logicalGroupId = 4; },
  'runtime-malformed-evidence-grade': (config) => { config.runtimeObservations.evidenceGrade = 'verified-everywhere'; },
};

for (const testCase of fixture.cases.filter((row) => row.id.startsWith('runtime-'))) {
  const config = clone(first.config);
  mutations[testCase.id](config);
  expectFailure(
    () => validateRuntimeObservations(config.runtimeObservations, config.descriptors, config.groups),
    new RegExp(testCase.expectedDiagnostic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    testCase.id,
  );
}

for (const testCase of fixture.cases.filter((row) => row.id.startsWith('config-'))) {
  const testRoot = path.join(ROOT, 'build', 'tests', 'overlay-config');
  fs.mkdirSync(testRoot, { recursive: true });
  const changed = clone(first.config);
  if (testCase.id === 'config-manual-edit') changed.generator.version = 'manual-edit';
  else if (testCase.id === 'config-descriptor-count-drift') changed.descriptors.pop();
  else if (testCase.id === 'config-descriptor-stride-drift') changed.layout.descriptorTable.stride = 0x24;
  const badConfig = path.join(testRoot, `${testCase.id}.json`);
  fs.writeFileSync(badConfig, `${JSON.stringify(changed, null, 2)}\n`);
  const result = spawnSync(process.execPath, [
    path.join(ROOT, 'tools', 'verify_overlay_config.js'),
    '--config', badConfig,
    '--rom', romPath,
    '--manifest', manifestPath,
    '--no-parent-comparison',
    '--report', path.join(testRoot, `${testCase.id}-report.json`),
  ], { cwd: ROOT, encoding: 'utf8' });
  assert.notStrictEqual(result.status, 0, `production verifier must reject ${testCase.id}`);
  assert.match(`${result.stdout}\n${result.stderr}`, new RegExp(testCase.expectedDiagnostic));
}

console.log(`overlay_config: PASS canonical=19/11/11 hostile=${fixture.cases.length}`);
