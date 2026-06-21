#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  firstDiff,
  hashBuffer,
  hex,
  loadAndVerifyRom,
  loadProfile,
  parseHexOrNumber,
  readJson,
  writeJson,
} = require('./lib/rom');

function usage() {
  console.log(`Usage: node tools/rebuild_from_source_manifest.js [--source-manifest <json>] [--owners <json>] [--assembled-code <bin>] [--reference <z64>] [--out <z64>] [--report <json>]\n\nRebuilds Rev 0 from the full source manifest: original MIPS/assembled code for code spans and source-owner files for non-code spans.`);
}

function parseArgs(argv) {
  const args = {
    sourceManifest: path.join(ROOT, 'build', 'source-manifest', 'rev0-full-source-manifest.json'),
    owners: path.join(ROOT, 'build', 'source-owners', 'rev0', 'manifest.json'),
    assembledCode: path.join(ROOT, 'build', 'assembled', 'rev0', 'code.bin'),
    reference: path.join(ROOT, 'build', 'baserom.us_rev0.z64'),
    out: path.join(ROOT, 'dist', 'rebuilt.us_rev0.source-manifest.z64'),
    report: path.join(ROOT, 'build', 'rebuild', 'rev0-source-manifest-rebuild-report.json'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--source-manifest') {
      args.sourceManifest = path.resolve(argv[++i]);
    } else if (arg === '--owners') {
      args.owners = path.resolve(argv[++i]);
    } else if (arg === '--assembled-code') {
      args.assembledCode = path.resolve(argv[++i]);
    } else if (arg === '--reference') {
      args.reference = path.resolve(argv[++i]);
    } else if (arg === '--out') {
      args.out = path.resolve(argv[++i]);
    } else if (arg === '--report') {
      args.report = path.resolve(argv[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function loadReference(referencePath) {
  if (fs.existsSync(referencePath)) {
    const z64 = fs.readFileSync(referencePath);
    return {
      path: referencePath,
      z64,
      sha256: hashBuffer(z64, 'sha256'),
    };
  }
  const result = loadAndVerifyRom();
  return {
    path: result.inputPath,
    z64: result.z64,
    sha256: result.hashes.z64Sha256,
  };
}

function requireJson(filePath, hint) {
  if (!fs.existsSync(filePath)) throw new Error(`${hint} not found: ${filePath}`);
  return readJson(filePath);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const profile = loadProfile();
  const sourceManifest = requireJson(args.sourceManifest, 'Full source manifest');
  const owners = requireJson(args.owners, 'Source-owner manifest');
  if (!sourceManifest.ok) throw new Error(`Full source manifest is not ok: ${args.sourceManifest}`);
  if (!owners.ok) throw new Error(`Source-owner manifest is not ok: ${args.owners}`);
  if (!fs.existsSync(args.assembledCode)) {
    throw new Error(`Assembled code blob not found: ${args.assembledCode}\nRun: node tools/assemble_original_mips.js`);
  }

  const codeStart = parseHexOrNumber(profile.codeRegion.start);
  const codeEnd = parseHexOrNumber(profile.codeRegion.endExclusive);
  const assembledCode = fs.readFileSync(args.assembledCode);
  if (assembledCode.length !== codeEnd - codeStart) {
    throw new Error(`Assembled code length ${assembledCode.length} != configured code length ${codeEnd - codeStart}`);
  }
  const assembledSha256 = hashBuffer(assembledCode, 'sha256');
  const expectedAssembledSha256 = sourceManifest.codeCoverage?.assembled?.sha256;
  if (expectedAssembledSha256 && expectedAssembledSha256 !== assembledSha256) {
    throw new Error(`Assembled code SHA256 mismatch: expected ${expectedAssembledSha256}, got ${assembledSha256}`);
  }

  const ownerByIndex = new Map(owners.entries.map((entry) => [entry.index, entry]));
  const buffers = [];
  const entryChecks = [];
  let cursor = 0;
  let codeBytes = 0;
  let ownerBytes = 0;

  for (const entry of sourceManifest.entries) {
    const start = parseHexOrNumber(entry.romStart);
    const end = parseHexOrNumber(entry.romEndExclusive);
    if (start !== cursor) throw new Error(`Source entry ${entry.index} starts at ${hex(start)}, expected ${hex(cursor)}`);
    let bytes;
    let source;
    if (entry.sourceForm === 'original_mips') {
      const sliceStart = start - codeStart;
      const sliceEnd = end - codeStart;
      if (sliceStart < 0 || sliceEnd > assembledCode.length) {
        throw new Error(`Original-MIPS entry ${entry.index} is outside assembled code blob`);
      }
      bytes = Buffer.from(assembledCode.subarray(sliceStart, sliceEnd));
      source = 'assembled-original-mips';
      codeBytes += bytes.length;
    } else {
      const owner = ownerByIndex.get(entry.index);
      if (!owner) throw new Error(`Missing source-owner entry for manifest entry ${entry.index}`);
      if (!owner.ownerFile) throw new Error(`Source-owner entry ${entry.index} has no ownerFile`);
      const ownerPath = path.resolve(ROOT, owner.ownerFile);
      if (!fs.existsSync(ownerPath)) throw new Error(`Source-owner file missing: ${ownerPath}`);
      bytes = fs.readFileSync(ownerPath);
      const sha256 = hashBuffer(bytes, 'sha256');
      if (bytes.length !== entry.bytes || bytes.length !== owner.bytes) {
        throw new Error(`Source-owner entry ${entry.index} length mismatch`);
      }
      if (sha256 !== owner.sha256) {
        throw new Error(`Source-owner entry ${entry.index} SHA256 mismatch`);
      }
      source = 'source-owner';
      ownerBytes += bytes.length;
    }
    if (bytes.length !== end - start) {
      throw new Error(`Output bytes for source entry ${entry.index} length ${bytes.length}, expected ${end - start}`);
    }
    entryChecks.push({
      index: entry.index,
      source,
      sourceForm: entry.sourceForm,
      bytes: bytes.length,
      sha256: hashBuffer(bytes, 'sha256'),
    });
    buffers.push(bytes);
    cursor = end;
  }
  const expectedSize = sourceManifest.summary?.romSize ?? profile.sizeBytes;
  if (cursor !== expectedSize) throw new Error(`Source entries end at ${hex(cursor)}, expected ${hex(expectedSize)}`);

  const rebuilt = Buffer.concat(buffers);
  const rebuiltSha256 = hashBuffer(rebuilt, 'sha256');
  ensureDir(path.dirname(args.out));
  fs.writeFileSync(args.out, rebuilt);

  const reference = loadReference(args.reference);
  const referenceSha256 = hashBuffer(reference.z64, 'sha256');
  const diff = firstDiff(reference.z64, rebuilt);
  const exact = !diff && referenceSha256 === rebuiltSha256;
  const report = {
    tool: 'rebuild_from_source_manifest',
    profile: sourceManifest.profile,
    sourceManifestPath: path.relative(ROOT, args.sourceManifest).replace(/\\/g, '/'),
    ownersManifestPath: path.relative(ROOT, args.owners).replace(/\\/g, '/'),
    outputPath: path.relative(ROOT, args.out).replace(/\\/g, '/'),
    referencePath: reference.path,
    assembledCode: {
      path: path.relative(ROOT, args.assembledCode).replace(/\\/g, '/'),
      bytes: assembledCode.length,
      sha256: assembledSha256,
    },
    rebuilt: {
      bytes: rebuilt.length,
      sha256: rebuiltSha256,
      codeBytes,
      sourceOwnerBytes: ownerBytes,
    },
    reference: {
      bytes: reference.z64.length,
      sha256: referenceSha256,
    },
    exact,
    firstDiff: diff
      ? {
          offset: hex(diff.offset),
          expected: diff.expected == null ? null : hex(diff.expected, 2),
          actual: diff.actual == null ? null : hex(diff.actual, 2),
        }
      : null,
    entryCount: entryChecks.length,
    entryChecks,
  };

  writeJson(args.report, report);
  console.log(`Source-manifest rebuilt ROM: ${args.out}`);
  console.log(`SHA256 rebuilt:  ${rebuiltSha256}`);
  console.log(`SHA256 reference: ${referenceSha256}`);
  console.log(`Exact byte match: ${exact ? 'PASS' : 'FAIL'}`);
  console.log(`Report: ${args.report}`);
  if (!exact) process.exitCode = 1;
}

main();
