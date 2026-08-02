#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  PARENT_ROOT,
  ROOT,
  firstDiff,
  hashBuffer,
  writeJson,
} = require('./lib/rom');
const {
  buildConfig,
  compareParentAcceptedRows,
  validateRuntimeObservations,
} = require('./lib/overlay_config');

function parseArgs(argv) {
  const defaultParentPackage = path.join(PARENT_ROOT, 'wiki', 'overlay-descriptor-groups-20260731');
  const args = {
    rom: path.join(ROOT, 'build', 'baserom.us_rev0.z64'),
    manifest: path.join(ROOT, 'asm', 'original', 'rev0', 'manifest.json'),
    config: path.join(ROOT, 'config', 'overlays', 'us_rev0.json'),
    parentPackage: fs.existsSync(defaultParentPackage) ? defaultParentPackage : null,
    report: path.join(ROOT, 'build', 'overlay-config', 'verification.json'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--rom') args.rom = path.resolve(argv[++i]);
    else if (arg === '--manifest') args.manifest = path.resolve(argv[++i]);
    else if (arg === '--config') args.config = path.resolve(argv[++i]);
    else if (arg === '--parent-package') args.parentPackage = path.resolve(argv[++i]);
    else if (arg === '--no-parent-comparison') args.parentPackage = null;
    else if (arg === '--report') args.report = path.resolve(argv[++i]);
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node tools/verify_overlay_config.js [--rom <canonical.z64>] [--manifest <manifest.json>] [--config <config.json>] [--parent-package <dir>] [--no-parent-comparison] [--report <json>]');
      process.exit(0);
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const deliveredBytes = fs.readFileSync(args.config);
  const delivered = JSON.parse(deliveredBytes.toString('utf8'));
  const expected = buildConfig({ romPath: args.rom, manifestPath: args.manifest });
  validateRuntimeObservations(delivered.runtimeObservations, delivered.descriptors, delivered.groups);
  const expectedBytes = Buffer.from(expected.text);
  const diff = firstDiff(expectedBytes, deliveredBytes);
  if (diff) {
    throw new Error(`Generated overlay config is stale or manually edited; first difference at byte ${diff.offset}`);
  }
  const parentComparison = args.parentPackage
    ? compareParentAcceptedRows(delivered, args.parentPackage)
    : { equal: null, skipped: true, reason: 'parent package unavailable or explicitly disabled' };
  const report = {
    tool: 'verify_overlay_config',
    version: delivered.generator.version,
    ok: true,
    nonmutatingTrackedInputs: true,
    config: path.relative(ROOT, args.config).replace(/\\/g, '/'),
    configSha256: hashBuffer(deliveredBytes, 'sha256'),
    romSha256: delivered.provenance.rom.sha256,
    descriptorCount: delivered.descriptors.length,
    groupCount: delivered.groups.length,
    pointerCount: delivered.pointers.length,
    nullWord: delivered.nullWord.value,
    sourceOwnerCount: delivered.conservation.sourceSplit.owners.length,
    sourceRomPositiveOverlapPairs: delivered.conservation.sourceRomPositiveOverlapPairs,
    parentAcceptedRows: parentComparison,
    firstDifference: null,
  };
  writeJson(args.report, report);
  console.log('Overlay config verification: PASS');
  console.log(`Descriptors: ${report.descriptorCount}; groups: ${report.groupCount}; pointers: ${report.pointerCount}; null: ${report.nullWord}`);
  console.log(`Source owners: ${report.sourceOwnerCount}; source ROM overlaps: ${report.sourceRomPositiveOverlapPairs}`);
  console.log(`Parent accepted-row equality: ${parentComparison.equal === true ? 'PASS' : 'SKIPPED'}`);
  console.log(`Config SHA256: ${report.configSha256}`);
  console.log(`Report: ${args.report}`);
}

try {
  main();
} catch (error) {
  console.error(`Overlay config verification: FAIL\n${error.stack || error.message}`);
  process.exitCode = 1;
}
