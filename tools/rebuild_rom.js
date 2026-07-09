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
  console.log(`Usage: node tools/rebuild_rom.js [--manifest <json>] [--reference <z64>] [--out <z64>] [--report <json>] [--assembled-code <bin>]\n\nRebuilds Rev 0 from extracted span segments and byte-compares it against the normalized baserom. If --assembled-code is provided, that blob replaces the configured code-region span during rebuild.`);
}

function parseArgs(argv) {
  const args = {
    manifest: path.join(ROOT, 'build', 'segments', 'rev0', 'manifest.json'),
    reference: path.join(ROOT, 'build', 'baserom.us_rev0.z64'),
    out: path.join(ROOT, 'dist', 'rebuilt.us_rev0.z64'),
    report: path.join(ROOT, 'build', 'rebuild', 'rev0-rebuild-report.json'),
    assembledCode: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--manifest') {
      args.manifest = path.resolve(argv[++i]);
    } else if (arg === '--reference') {
      args.reference = path.resolve(argv[++i]);
    } else if (arg === '--out') {
      args.out = path.resolve(argv[++i]);
    } else if (arg === '--report') {
      args.report = path.resolve(argv[++i]);
    } else if (arg === '--assembled-code') {
      args.assembledCode = path.resolve(argv[++i]);
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

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.manifest)) {
    throw new Error(`Segment manifest not found: ${args.manifest}\nRun: node tools/extract_rom_segments.js`);
  }
  const manifest = readJson(args.manifest);
  if (!Array.isArray(manifest.segments) || manifest.segments.length === 0) {
    throw new Error(`Manifest has no segments: ${args.manifest}`);
  }

  const manifestDir = path.dirname(args.manifest);
  const profile = loadProfile();
  const codeRegion = {
    start: parseHexOrNumber(profile.codeRegion.start),
    end: parseHexOrNumber(profile.codeRegion.endExclusive),
  };
  let assembledCode = null;
  if (args.assembledCode) {
    if (!fs.existsSync(args.assembledCode)) {
      throw new Error(`Assembled code blob not found: ${args.assembledCode}\nRun: node tools/assemble_original_mips.js`);
    }
    const bytes = fs.readFileSync(args.assembledCode);
    const expectedBytes = codeRegion.end - codeRegion.start;
    if (bytes.length !== expectedBytes) {
      throw new Error(`Assembled code length ${bytes.length} != configured code region length ${expectedBytes}`);
    }
    assembledCode = {
      path: args.assembledCode,
      bytes,
      sha256: hashBuffer(bytes, 'sha256'),
      used: false,
    };
  }

  const buffers = [];
  let cursor = 0;
  const segmentChecks = [];

  for (const segment of manifest.segments) {
    const start = parseHexOrNumber(segment.start);
    const end = parseHexOrNumber(segment.endExclusive);
    if (start !== cursor) throw new Error(`Segment ${segment.index} starts at ${hex(start)}, expected ${hex(cursor)}`);
    const filePath = path.join(manifestDir, segment.file.replace(/\//g, path.sep));
    if (!fs.existsSync(filePath)) throw new Error(`Segment file missing: ${filePath}`);
    const bytes = fs.readFileSync(filePath);
    const sha256 = hashBuffer(bytes, 'sha256');
    const rawOk = bytes.length === segment.bytes && bytes.length === end - start && sha256 === segment.sha256;
    let outputBytes = bytes;
    let source = 'raw-segment';
    // The assembled blob covers the whole codeRegion; since the 2026-07-09
    // executable-extent reclassification the segment manifest splits that
    // span (code + code_region_data_tail), so substitute the matching SLICE
    // for every segment fully inside the code region.
    if (assembledCode && start >= codeRegion.start && end <= codeRegion.end) {
      outputBytes = assembledCode.bytes.subarray(start - codeRegion.start, end - codeRegion.start);
      assembledCode.used = true;
      assembledCode.coveredBytes = (assembledCode.coveredBytes || 0) + (end - start);
      source = 'assembled-code';
    }
    if (outputBytes.length !== end - start) {
      throw new Error(`Output source for segment ${segment.index} has ${outputBytes.length} bytes, expected ${end - start}`);
    }
    const outputSha256 = hashBuffer(outputBytes, 'sha256');
    segmentChecks.push({
      index: segment.index,
      file: segment.file,
      source,
      ok: rawOk,
      expectedBytes: segment.bytes,
      actualBytes: bytes.length,
      expectedSha256: segment.sha256,
      actualSha256: sha256,
      outputBytes: outputBytes.length,
      outputSha256,
    });
    if (!rawOk) throw new Error(`Segment ${segment.index} failed manifest verification: ${segment.file}`);
    buffers.push(outputBytes);
    cursor = end;
  }
  if (assembledCode && !assembledCode.used) {
    throw new Error(`Assembled code was not used; no manifest segment fell inside ${hex(codeRegion.start)}..${hex(codeRegion.end)}`);
  }
  if (assembledCode && assembledCode.coveredBytes !== codeRegion.end - codeRegion.start) {
    throw new Error(`Assembled code only covered ${assembledCode.coveredBytes} of ${codeRegion.end - codeRegion.start} code-region bytes; segment manifest does not tile the code region`);
  }

  const rebuilt = Buffer.concat(buffers);
  const rebuiltSha256 = hashBuffer(rebuilt, 'sha256');
  if (manifest.source?.sizeBytes != null && rebuilt.length !== manifest.source.sizeBytes) {
    throw new Error(`Rebuilt size ${rebuilt.length} != manifest source size ${manifest.source.sizeBytes}`);
  }

  ensureDir(path.dirname(args.out));
  fs.writeFileSync(args.out, rebuilt);

  const reference = loadReference(args.reference);
  const referenceSha256 = hashBuffer(reference.z64, 'sha256');
  const diff = firstDiff(reference.z64, rebuilt);
  const exact = !diff && referenceSha256 === rebuiltSha256;

  const report = {
    tool: 'rebuild_rom',
    profile: manifest.profile,
    manifestPath: path.relative(ROOT, args.manifest).replace(/\\/g, '/'),
    outputPath: path.relative(ROOT, args.out).replace(/\\/g, '/'),
    referencePath: reference.path,
    segmentCount: manifest.segments.length,
    replacements: assembledCode
      ? [
          {
            type: 'assembled-code',
            path: args.assembledCode,
            start: hex(codeRegion.start),
            endExclusive: hex(codeRegion.end),
            bytes: assembledCode.bytes.length,
            sha256: assembledCode.sha256,
            used: assembledCode.used,
          },
        ]
      : [],
    rebuilt: {
      bytes: rebuilt.length,
      sha256: rebuiltSha256,
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
    segmentChecks,
  };

  writeJson(args.report, report);
  console.log(`Rebuilt ROM: ${args.out}`);
  console.log(`Reference: ${reference.path}`);
  console.log(`SHA256 rebuilt:  ${rebuiltSha256}`);
  console.log(`SHA256 reference: ${referenceSha256}`);
  console.log(`Exact byte match: ${exact ? 'PASS' : 'FAIL'}`);
  console.log(`Report: ${args.report}`);
  if (!exact) process.exitCode = 1;
}

main();
