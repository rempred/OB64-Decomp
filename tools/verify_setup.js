#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');
const {
  ROOT,
  ensureDir,
  readJson,
  writeJson,
} = require('./lib/rom');

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024,
  });
  const output = [result.stdout, result.stderr].filter(Boolean).join('');
  if (result.status !== 0) {
    throw new Error(`Command failed: node ${args.join(' ')}\n${output}`);
  }
  return output;
}

function check(name, ok, details = {}) {
  return { name, ok: Boolean(ok), ...details };
}

function parseArgs(argv) {
  let phase5aRoot = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg !== '--phase5a-root') throw new Error(`Unknown argument: ${arg}`);
    if (phase5aRoot !== null) throw new Error('Duplicate --phase5a-root argument');
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error('Missing --phase5a-root value');
    phase5aRoot = path.resolve(value);
    index += 1;
  }
  return { phase5aRoot };
}

function setupCommands(options = {}) {
  const phase5bArgs = ['tools/verify_phase5b_production_config.js'];
  if (options.phase5aRoot) phase5bArgs.push('--phase5a-root', options.phase5aRoot);
  return [
    ['tools/verify_baserom.js'],
    ['tools/verify_overlay_config.js'],
    phase5bArgs,
    ['tools/build_rom_coverage_ledger.js'],
    ['tools/audit_code_region.js'],
    ['tools/extract_original_mips.js'],
    ['tests/word_asm_smoke.js'],
    ['tests/binutils_smoke.js'],
    ['tools/check_manifest.js'],
    ['tools/assemble_original_mips.js'],
    ['tools/extract_rom_segments.js'],
    ['tools/rebuild_rom.js'],
    ['tools/build_full_source_manifest.js'],
    ['tools/extract_non_code_sources.js'],
    ['tools/rebuild_from_source_manifest.js'],
    [
      'tools/rebuild_rom.js',
      '--assembled-code',
      'build/assembled/rev0/code.bin',
      '--out',
      'dist/rebuilt.us_rev0.assembled-code.z64',
      '--report',
      'build/rebuild/rev0-assembled-code-rebuild-report.json',
    ],
  ];
}

function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  const commands = setupCommands(options);

  const commandReports = [];
  for (const args of commands) {
    const output = runNode(args);
    commandReports.push({ command: `node ${args.join(' ')}`, output });
  }

  const baserom = readJson(path.join(ROOT, 'build', 'baserom.us_rev0.report.json'));
  const overlayConfig = readJson(path.join(ROOT, 'build', 'overlay-config', 'verification.json'));
  const ledger = readJson(path.join(ROOT, 'build', 'coverage', 'rev0-rom-coverage-ledger.json'));
  const profile = readJson(path.join(ROOT, 'config', 'roms', 'us_rev0.json'));
  const codeAudit = readJson(path.join(ROOT, 'build', 'coverage', 'rev0-code-region-audit.json'));
  const toolchain = readJson(path.join(ROOT, 'build', 'toolchain-smoke', 'binutils-smoke-report.json'));
  const assembled = readJson(path.join(ROOT, 'build', 'assembled', 'rev0-report.json'));
  const rawRebuild = readJson(path.join(ROOT, 'build', 'rebuild', 'rev0-rebuild-report.json'));
  const sourceManifest = readJson(path.join(ROOT, 'build', 'source-manifest', 'rev0-full-source-manifest.json'));
  const sourceOwners = readJson(path.join(ROOT, 'build', 'source-owners', 'rev0', 'manifest.json'));
  const sourceManifestRebuild = readJson(path.join(ROOT, 'build', 'rebuild', 'rev0-source-manifest-rebuild-report.json'));
  const asmRebuild = readJson(path.join(ROOT, 'build', 'rebuild', 'rev0-assembled-code-rebuild-report.json'));

  const checks = [
    check('baseromRev0Verified', baserom.ok, { crc1: baserom.header.crc1, crc2: baserom.header.crc2 }),
    check('overlayConfigurationVerified', overlayConfig.ok, {
      descriptors: overlayConfig.descriptorCount,
      groups: overlayConfig.groupCount,
      pointers: overlayConfig.pointerCount,
      configSha256: overlayConfig.configSha256,
      parentAcceptedRows: overlayConfig.parentAcceptedRows,
    }),
    check('phase5bProductionConfigurationVerified', /Phase 5B production configuration: PASS/.test((commandReports.find((item) => item.command.startsWith('node tools/verify_phase5b_production_config.js')) || {}).output || '')),
    check('coverageArchiveCount825', ledger.archiveScan.count === 825, { actual: ledger.archiveScan.count }),
    check('coverageZeroUnknownBytes', ledger.summary.unknownBytes === 0, { actual: ledger.summary.unknownBytes }),
    check('coverageOverlapVisible', ledger.summary.overlapBytes > 0 && Array.isArray(ledger.overlapRanges) && ledger.overlapRanges.length > 0, {
      overlapBytes: ledger.summary.overlapBytes,
      overlapRanges: ledger.overlapRanges,
    }),
    check('toolchainAvailableAndSmokePassed', toolchain.ok, { toolchain: toolchain.toolchain }),
    check('binutilsWordSmoke', toolchain.checks.some((item) => item.name === 'bigEndianWordsAndMips3O32Flags' && item.ok)),
    check('binutilsInstructionSmoke', toolchain.checks.some((item) => item.name === 'realInstructionsBigEndian' && item.ok)),
    check('binutilsNoreorderSmoke', toolchain.checks.some((item) => item.name === 'noreorderDelaySlot' && item.ok)),
    check('binutilsCompleteBundle', toolchain.checks.some((item) => item.name === 'completePinnedToolBundle' && item.ok)),
    check('binutilsHistoricalMove', toolchain.checks.some((item) => item.name === 'kmcMoveAliasesUseAddu' && item.ok)),
    check('binutilsLinkerLma', toolchain.checks.some((item) => item.name === 'linkerOneSectionLoadsAndBinaryLma' && item.ok)),
    check('firstTrackedChunkRealAssembler', toolchain.checks.some((item) => item.name === 'firstTrackedChunkExact' && item.ok)),
    check('retiredProductionDependenciesAbsent', toolchain.checks.some((item) => item.name === 'productionCutoverHasNoAdapterOrModernBinutils' && item.ok)),
    check('manifestIntegrityAudit', /ALL CHECKS PASS/.test((commandReports.find((item) => item.command === 'node tools/check_manifest.js') || {}).output || '')),
    // Executable-extent gate (P7, 2026-07-09): the pinned boundary in config
    // must match the audit's jr-ra extent (+4 = the final return's delay
    // slot), and the tail must stay data-evidenced with no code edge into it.
    check('executableExtentPinned', (() => {
      if (!profile.executableExtent || !codeAudit.executableExtent?.endExclusive) return false;
      const pinned = parseInt(profile.executableExtent.endExclusive, 16);
      const audited = parseInt(codeAudit.executableExtent.endExclusive, 16);
      const delta = pinned - audited;
      // +4 is ONLY the final return's delay slot — require the audit to attest
      // that its extent actually ends on a jr $ra word.
      const deltaOk = delta === 0 || (delta === 4 && codeAudit.executableExtent.endsOnJrRa === true);
      return deltaOk
        && codeAudit.suspectedNonCodeTail?.verdict === 'data-evidenced'
        && String(codeAudit.controlFlowAudit?.verdict || '').startsWith('no-credible-code-edge-into-tail');
    })(), {
      pinned: profile.executableExtent?.endExclusive || null,
      audited: codeAudit.executableExtent?.endExclusive || null,
      tailVerdict: codeAudit.suspectedNonCodeTail?.verdict || null,
      controlFlowVerdict: codeAudit.controlFlowAudit?.verdict || null,
    }),
    check('codeDataSplitHonest', (() => {
      if (!profile.executableExtent) return false;
      const extentBytes = parseInt(profile.executableExtent.endExclusive, 16) - parseInt(profile.executableExtent.start, 16);
      const tailBytes = parseInt(profile.codeRegion.endExclusive, 16) - parseInt(profile.executableExtent.endExclusive, 16);
      return sourceManifest.summary.bySourceForm?.original_mips === extentBytes
        && sourceManifest.summary.bySourceForm?.owned_data_parts === tailBytes;
    })(), {
      originalMipsBytes: sourceManifest.summary.bySourceForm?.original_mips ?? null,
      ownedDataPartsBytes: sourceManifest.summary.bySourceForm?.owned_data_parts ?? null,
    }),
    check('assembledCodeRegionExact', assembled.exactToReference, { sha256: assembled.assembled.sha256, sources: assembled.sources }),
    check('rawRebuildExact', rawRebuild.exact, { sha256: rawRebuild.rebuilt.sha256 }),
    check('fullSourceManifestNoGap', sourceManifest.ok, { summary: sourceManifest.summary }),
    check('fullSourceManifestNoUnknownBytes', sourceManifest.summary.unknownBytes === 0, { unknownBytes: sourceManifest.summary.unknownBytes }),
    check('nonCodeSourceOwnersExact', sourceOwners.ok, { summary: sourceOwners.summary }),
    check('sourceManifestRebuildExact', sourceManifestRebuild.exact, { sha256: sourceManifestRebuild.rebuilt.sha256 }),
    check('assembledCodeRebuildExact', asmRebuild.exact, { sha256: asmRebuild.rebuilt.sha256 }),
  ];
  const ok = checks.every((item) => item.ok);

  const report = {
    tool: 'verify_setup',
    ok,
    commands: commandReports.map((item) => item.command),
    checks,
    summary: {
      baseromCrc: `${baserom.header.crc1}/${baserom.header.crc2}`,
      archiveCount: ledger.archiveScan.count,
      unknownBytes: ledger.summary.unknownBytes,
      overlapBytes: ledger.summary.overlapBytes,
      toolchain: toolchain.toolchain.id,
      trackedRealAsmChunks: assembled.sources.trackedRealAsmChunks,
      trackedCompositeChunks: assembled.sources.trackedCompositeChunks || 0,
      trackedRealAsmFiles: assembled.sources.trackedRealAsmFiles || assembled.sources.trackedRealAsmChunks,
      generatedChunks: assembled.sources.generatedChunks,
      sourceManifestEntries: sourceManifest.summary.entries,
      sourceManifestAmbiguousBytes: sourceManifest.summary.ambiguousBytes,
      sourceOwnerFiles: sourceOwners.summary.nonCodeEntries,
      sourceOwnerBytes: sourceOwners.summary.nonCodeBytes,
      trackedSourceOwnerFiles: sourceOwners.summary.trackedOwnerEntries || 0,
      trackedSourceOwnerBytes: sourceOwners.summary.trackedOwnerBytes || 0,
      generatedSourceOwnerFiles: sourceOwners.summary.generatedOwnerEntries ?? sourceOwners.summary.nonCodeEntries,
      generatedSourceOwnerBytes: sourceOwners.summary.generatedOwnerBytes ?? sourceOwners.summary.nonCodeBytes,
      codeSha256: assembled.assembled.sha256,
      romSha256: asmRebuild.rebuilt.sha256,
      overlayConfigSha256: overlayConfig.configSha256,
    },
  };
  const reportPath = path.join(ROOT, 'build', 'setup', 'verify-setup-report.json');
  writeJson(reportPath, report);

  console.log(`OB64 Decomp setup verification: ${ok ? 'PASS' : 'FAIL'}`);
  for (const item of checks) console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}`);
  console.log(`Toolchain: ${report.summary.toolchain}`);
  console.log(`Archives: ${report.summary.archiveCount}; unknown bytes: ${report.summary.unknownBytes}; overlap bytes: ${report.summary.overlapBytes}`);
  console.log(
    `Source mix: ${report.summary.trackedRealAsmChunks} tracked real-asm chunk(s)` +
      ` (${report.summary.trackedCompositeChunks} composite, ${report.summary.trackedRealAsmFiles} tracked file(s)),` +
      ` ${report.summary.generatedChunks} generated fallback chunk(s)`,
  );
  console.log(
    `Source manifest: ${report.summary.sourceManifestEntries} entries; ` +
      `${report.summary.sourceManifestAmbiguousBytes} ambiguous byte(s) preserved explicitly`,
  );
  console.log(
    `Source owners: ${report.summary.sourceOwnerFiles} non-code file(s); ` +
      `${report.summary.sourceOwnerBytes} byte(s)`,
  );
  console.log(
    `Tracked source owners: ${report.summary.trackedSourceOwnerFiles} file(s); ` +
      `${report.summary.trackedSourceOwnerBytes} byte(s); generated fallback: ` +
      `${report.summary.generatedSourceOwnerFiles} file(s); ${report.summary.generatedSourceOwnerBytes} byte(s)`,
  );
  console.log(`Code SHA256: ${report.summary.codeSha256}`);
  console.log(`ROM SHA256:  ${report.summary.romSha256}`);
  console.log(`Overlay config SHA256: ${report.summary.overlayConfigSha256}`);
  console.log(`Report: ${reportPath}`);
  if (!ok) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = { parseArgs, setupCommands };
