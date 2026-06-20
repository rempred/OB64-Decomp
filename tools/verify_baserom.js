#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  loadAndVerifyRom,
  loadProfile,
  writeJson,
} = require('./lib/rom');

function usage() {
  console.log(`Usage: node tools/verify_baserom.js [--input <rom>] [--out <z64>] [--report <json>] [--no-write]\n\nVerifies the US Rev 0 ROM and normalizes local input to canonical z64 bytes.`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    out: path.join(ROOT, 'build', 'baserom.us_rev0.z64'),
    report: path.join(ROOT, 'build', 'baserom.us_rev0.report.json'),
    write: true,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--input') {
      args.input = argv[++i];
    } else if (arg === '--out') {
      args.out = path.resolve(argv[++i]);
    } else if (arg === '--report') {
      args.report = path.resolve(argv[++i]);
    } else if (arg === '--no-write') {
      args.write = false;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const profile = loadProfile();
  const result = loadAndVerifyRom({ inputPath: args.input, profile });

  const report = {
    tool: 'verify_baserom',
    profile: profile.id,
    inputPath: result.inputPath,
    detectedByteOrder: result.detectedByteOrder,
    outputPath: args.write ? args.out : null,
    header: result.verification.header,
    hashes: result.hashes,
    checks: result.verification.checks,
    ok: result.verification.ok,
  };

  if (args.write) {
    ensureDir(path.dirname(args.out));
    fs.writeFileSync(args.out, result.z64);
    writeJson(args.report, report);
  }

  console.log(`Input: ${result.inputPath}`);
  console.log(`Detected byte order: ${result.detectedByteOrder}`);
  console.log(`Rev 0 verification: ${result.verification.ok ? 'PASS' : 'FAIL'}`);
  for (const check of result.verification.checks) {
    console.log(`  ${check.ok ? 'PASS' : 'FAIL'} ${check.name}: ${check.actual}`);
  }
  if (args.write) {
    console.log(`Wrote normalized z64: ${args.out}`);
    console.log(`Wrote report: ${args.report}`);
  }
  if (!result.verification.ok) process.exitCode = 1;
}

main();
