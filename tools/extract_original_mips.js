#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  hex,
  loadAndVerifyRom,
  loadProfile,
  parseHexOrNumber,
  readJson,
  writeJson,
} = require('./lib/rom');
const { classifyInstruction, disasmWord } = require('./lib/mips');

function usage() {
  console.log(`Usage: node tools/extract_original_mips.js [--input <rom>] [--out <dir>] [--chunk-size <hex>] [--report <json>]\n\nEmits a no-gap original MIPS reference for the configured Rev 0 code region. Every 4-byte word is emitted as .word plus a decode comment, so incomplete function discovery cannot drop bytes.`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    outDir: path.join(ROOT, 'build', 'original-mips', 'rev0'),
    report: path.join(ROOT, 'build', 'original-mips', 'rev0-report.json'),
    chunkSize: 0x10000,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--input') {
      args.input = argv[++i];
    } else if (arg === '--out') {
      args.outDir = path.resolve(argv[++i]);
    } else if (arg === '--report') {
      args.report = path.resolve(argv[++i]);
    } else if (arg === '--chunk-size') {
      args.chunkSize = parseHexOrNumber(argv[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (args.chunkSize <= 0 || args.chunkSize % 4 !== 0) {
    throw new Error('--chunk-size must be a positive multiple of 4');
  }
  return args;
}

function loadOptionalJson(relativePath) {
  const fullPath = path.resolve(ROOT, '..', relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return { path: fullPath, data: readJson(fullPath) };
}

function indexFunctionsByStart(functionDb) {
  const starts = new Map();
  const functions = Array.isArray(functionDb?.data)
    ? functionDb.data
    : Array.isArray(functionDb?.data?.functions)
      ? functionDb.data.functions
      : Array.isArray(functionDb?.functions)
        ? functionDb.functions
        : [];
  for (const fn of functions) {
    const start = typeof fn.start === 'number' ? fn.start : fn.start_rom;
    if (typeof start !== 'number') continue;
    if (!starts.has(start)) starts.set(start, []);
    starts.get(start).push(fn);
  }
  return starts;
}

function sanitizeLabel(value) {
  return String(value).replace(/[^A-Za-z0-9_]/g, '_');
}

function writeChunk({ z64, outFile, romStart, romEnd, ramBase, functionStarts }) {
  const lines = [];
  lines.push('/*');
  lines.push(' * Generated original MIPS reference for OB64 US Rev 0.');
  lines.push(' * Every word is emitted as .word to preserve bytes exactly.');
  lines.push(' * Decode comments are aids, not proof of semantic function boundaries.');
  lines.push(` * z64 range: ${hex(romStart)}..${hex(romEnd)} exclusive`);
  lines.push(' */');
  lines.push('.set noat');
  lines.push('.set noreorder');
  lines.push('');
  lines.push(`rev0_code_${romStart.toString(16).toUpperCase().padStart(8, '0')}:`);

  const stats = {
    words: 0,
    nops: 0,
    jumps: 0,
    branches: 0,
    memory: 0,
    functionLabels: 0,
  };

  for (let off = romStart; off < romEnd; off += 4) {
    const funcs = functionStarts.get(off);
    if (funcs) {
      for (const fn of funcs) {
        const suffix = fn.name ? sanitizeLabel(fn.name) : `func_${off.toString(16).toUpperCase().padStart(8, '0')}`;
        lines.push('');
        lines.push(`/* function boundary candidate: ${suffix}, size=${fn.size ?? 'unknown'}, kind=${fn.kind ?? 'unknown'} */`);
        lines.push(`${suffix}:`);
        stats.functionLabels += 1;
      }
    }
    const word = z64.readUInt32BE(off);
    const pc = (ramBase + off) >>> 0;
    const text = disasmWord(word, pc);
    const kind = classifyInstruction(word);
    stats.words += 1;
    if (kind === 'nop') stats.nops += 1;
    if (kind === 'jump' || kind === 'jump-register') stats.jumps += 1;
    if (kind === 'branch') stats.branches += 1;
    if (kind === 'memory') stats.memory += 1;
    lines.push(`/* ${hex(off)} ${hex(pc)} ${hex(word)} */ .word ${hex(word)} # ${text}`);
  }
  lines.push('');
  fs.writeFileSync(outFile, `${lines.join('\n')}\n`);
  return stats;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const profile = loadProfile();
  const result = loadAndVerifyRom({ inputPath: args.input, profile });
  if (!result.verification.ok) {
    for (const check of result.verification.checks.filter((check) => !check.ok)) {
      console.error(`Rev 0 verification failed: ${check.name} expected ${check.expected}, got ${check.actual}`);
    }
    process.exit(1);
  }

  const codeStart = parseHexOrNumber(profile.codeRegion.start);
  const codeEnd = parseHexOrNumber(profile.codeRegion.endExclusive);
  const ramBase = parseHexOrNumber(profile.bootLinearMapping.ramBase);
  if (codeStart % 4 !== 0 || codeEnd % 4 !== 0) throw new Error('Code region must be word-aligned for this extractor');
  if (codeEnd > result.z64.length) throw new Error('Code region extends past ROM end');

  const functionDb = loadOptionalJson('scripts/ob64_functions.json');
  const functionStarts = indexFunctionsByStart(functionDb);

  ensureDir(args.outDir);
  const chunks = [];
  const totals = {
    bytes: 0,
    words: 0,
    nops: 0,
    jumps: 0,
    branches: 0,
    memory: 0,
    functionLabels: 0,
  };

  for (let start = codeStart; start < codeEnd; start += args.chunkSize) {
    const end = Math.min(start + args.chunkSize, codeEnd);
    const name = `code_${start.toString(16).toUpperCase().padStart(8, '0')}_${end.toString(16).toUpperCase().padStart(8, '0')}.s`;
    const outFile = path.join(args.outDir, name);
    const stats = writeChunk({
      z64: result.z64,
      outFile,
      romStart: start,
      romEnd: end,
      ramBase,
      functionStarts,
    });
    const chunk = {
      file: path.relative(ROOT, outFile).replace(/\\/g, '/'),
      romStart: hex(start),
      romEndExclusive: hex(end),
      bytes: end - start,
      ...stats,
    };
    chunks.push(chunk);
    totals.bytes += end - start;
    for (const key of ['words', 'nops', 'jumps', 'branches', 'memory', 'functionLabels']) totals[key] += stats[key];
  }

  const report = {
    tool: 'extract_original_mips',
    profile: profile.id,
    inputPath: result.inputPath,
    detectedByteOrder: result.detectedByteOrder,
    outputDir: path.relative(ROOT, args.outDir).replace(/\\/g, '/'),
    codeRegion: {
      start: hex(codeStart),
      endExclusive: hex(codeEnd),
      bytes: codeEnd - codeStart,
      wordAligned: true,
    },
    coverage: {
      policy: 'no-gap word emission',
      emittedBytes: totals.bytes,
      emittedWords: totals.words,
      byteCoveragePercent: totals.bytes === codeEnd - codeStart ? 100 : (totals.bytes / (codeEnd - codeStart)) * 100,
      caveat: 'This preserves every word in the configured code region. It does not prove every word is executable code.',
    },
    functionDb: functionDb
      ? { path: functionDb.path, startsIndexed: functionStarts.size }
      : { path: null, startsIndexed: 0, warning: 'parent scripts/ob64_functions.json not found' },
    totals,
    chunks,
  };
  writeJson(args.report, report);
  console.log(`Rev 0 ROM verified: ${result.verification.header.crc1}/${result.verification.header.crc2}`);
  console.log(`Emitted ${chunks.length} chunks to ${args.outDir}`);
  console.log(`Code-region coverage: ${report.coverage.byteCoveragePercent.toFixed(2)}% (${totals.bytes} bytes)`);
  console.log(`Report: ${args.report}`);
}

main();
