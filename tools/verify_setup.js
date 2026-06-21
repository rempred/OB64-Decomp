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

function main() {
  const commands = [
    ['tools/verify_baserom.js'],
    ['tools/build_rom_coverage_ledger.js'],
    ['tools/extract_original_mips.js'],
    ['tests/word_asm_smoke.js'],
    ['tests/binutils_smoke.js'],
    ['tools/assemble_original_mips.js'],
    ['tools/extract_rom_segments.js'],
    ['tools/rebuild_rom.js'],
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

  const commandReports = [];
  for (const args of commands) {
    const output = runNode(args);
    commandReports.push({ command: `node ${args.join(' ')}`, output });
  }

  const baserom = readJson(path.join(ROOT, 'build', 'baserom.us_rev0.report.json'));
  const ledger = readJson(path.join(ROOT, 'build', 'coverage', 'rev0-rom-coverage-ledger.json'));
  const toolchain = readJson(path.join(ROOT, 'build', 'toolchain-smoke', 'binutils-smoke-report.json'));
  const assembled = readJson(path.join(ROOT, 'build', 'assembled', 'rev0-report.json'));
  const rawRebuild = readJson(path.join(ROOT, 'build', 'rebuild', 'rev0-rebuild-report.json'));
  const asmRebuild = readJson(path.join(ROOT, 'build', 'rebuild', 'rev0-assembled-code-rebuild-report.json'));

  const checks = [
    check('baseromRev0Verified', baserom.ok, { crc1: baserom.header.crc1, crc2: baserom.header.crc2 }),
    check('coverageArchiveCount825', ledger.archiveScan.count === 825, { actual: ledger.archiveScan.count }),
    check('coverageZeroUnknownBytes', ledger.summary.unknownBytes === 0, { actual: ledger.summary.unknownBytes }),
    check('coverageOverlapVisible', ledger.summary.overlapBytes > 0 && Array.isArray(ledger.overlapRanges) && ledger.overlapRanges.length > 0, {
      overlapBytes: ledger.summary.overlapBytes,
      overlapRanges: ledger.overlapRanges,
    }),
    check('toolchainAvailableAndSmokePassed', toolchain.ok, { toolchain: toolchain.toolchain }),
    check('binutilsWordSmoke', toolchain.checks.some((item) => item.name === 'wordBigEndian' && item.ok)),
    check('binutilsInstructionSmoke', toolchain.checks.some((item) => item.name === 'realInstructionsBigEndian' && item.ok)),
    check('binutilsNoreorderSmoke', toolchain.checks.some((item) => item.name === 'noreorderKeepsDelaySlot' && item.ok)),
    check('firstTrackedChunkRealAssembler', toolchain.checks.some((item) => item.name === 'firstTrackedChunkRealAssembler' && item.ok)),
    check('assembledCodeRegionExact', assembled.exactToReference, { sha256: assembled.assembled.sha256, sources: assembled.sources }),
    check('rawRebuildExact', rawRebuild.exact, { sha256: rawRebuild.rebuilt.sha256 }),
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
      codeSha256: assembled.assembled.sha256,
      romSha256: asmRebuild.rebuilt.sha256,
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
  console.log(`Code SHA256: ${report.summary.codeSha256}`);
  console.log(`ROM SHA256:  ${report.summary.romSha256}`);
  console.log(`Report: ${reportPath}`);
  if (!ok) process.exitCode = 1;
}

main();
