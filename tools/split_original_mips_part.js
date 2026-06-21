#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  hashBuffer,
  hex,
  parseHexOrNumber,
  readJson,
  writeJson,
} = require('./lib/rom');

function usage() {
  console.log(`Usage: node tools/split_original_mips_part.js --part <asm-file> --split <name>:<start>:<end>:<out-file> [--split ...] --remainder <name>:<out-file> [--manifest <json>] [--remove-source]
       node tools/split_original_mips_part.js --part <asm-file> --splits-file <json> [--manifest <json>] [--remove-source]

Splits one tracked asm/original manifest part into smaller contiguous parts.
Ranges are z64 offsets; generated output preserves the original .word lines
and decode comments exactly for each selected ROM range.

--splits-file <json> avoids long command lines for large splits. The JSON is
either an array of {name,start,end,file,label?} entries, or an object
{splits:[...], remainder?:{name,file}}. start/end accept hex strings or numbers;
label (optional) emits a true-entry label for preamble-orphan splits.`);
}

function parseArgs(argv) {
  const args = {
    manifest: path.join(ROOT, 'asm', 'original', 'rev0', 'manifest.json'),
    partFile: null,
    splits: [],
    remainder: null,
    removeSource: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--manifest') {
      args.manifest = path.resolve(argv[++i]);
    } else if (arg === '--part') {
      args.partFile = argv[++i].replace(/\\/g, '/');
    } else if (arg === '--split') {
      args.splits.push(parseSplit(argv[++i]));
    } else if (arg === '--splits-file') {
      const sfPath = path.resolve(argv[++i]);
      const sf = JSON.parse(fs.readFileSync(sfPath, 'utf8'));
      const list = Array.isArray(sf) ? sf : sf.splits;
      if (!Array.isArray(list)) throw new Error(`--splits-file ${sfPath} must be an array or have a splits array`);
      for (const s of list) {
        if (s.name == null || s.start == null || s.end == null || s.file == null) {
          throw new Error(`--splits-file entry missing name/start/end/file: ${JSON.stringify(s)}`);
        }
        args.splits.push({
          name: s.name,
          start: parseHexOrNumber(s.start),
          end: parseHexOrNumber(s.end),
          file: String(s.file).replace(/\\/g, '/'),
          label: s.label || null,
        });
      }
      if (!Array.isArray(sf) && sf.remainder) {
        args.remainder = { name: sf.remainder.name, file: String(sf.remainder.file).replace(/\\/g, '/') };
      }
    } else if (arg === '--remainder') {
      args.remainder = parseRemainder(argv[++i]);
    } else if (arg === '--remove-source') {
      args.removeSource = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.partFile) throw new Error('--part is required');
  if (args.splits.length === 0) throw new Error('At least one --split is required');
  return args;
}

function parseSplit(value) {
  const pieces = value.split(':');
  if (pieces.length !== 4 && pieces.length !== 5) {
    throw new Error(`Invalid --split value "${value}"; expected name:start:end:out-file[:true-entry-label]`);
  }
  return {
    name: pieces[0],
    start: parseHexOrNumber(pieces[1]),
    end: parseHexOrNumber(pieces[2]),
    file: pieces[3].replace(/\\/g, '/'),
    // Optional 5th field: a label emitted at the file's true entry (split.start).
    // Use for preamble-orphan splits whose true entry precedes the parent-DB
    // boundary label that appears inside the body.
    label: pieces[4] || null,
  };
}

function parseRemainder(value) {
  const pieces = value.split(':');
  if (pieces.length !== 2) {
    throw new Error(`Invalid --remainder value "${value}"; expected name:out-file`);
  }
  return {
    name: pieces[0],
    file: pieces[1].replace(/\\/g, '/'),
  };
}

function repoPath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(ROOT, filePath);
}

function repoRel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function findPart(manifest, partFile) {
  for (const chunk of manifest.chunks || []) {
    const partIndex = (chunk.parts || []).findIndex((part) => part.file.replace(/\\/g, '/') === partFile);
    if (partIndex !== -1) return { chunk, partIndex, part: chunk.parts[partIndex] };
  }
  return null;
}

function wordLineRom(line) {
  const match = line.match(/\/\*\s+0x([0-9A-Fa-f]{8})\s+/);
  return match ? parseInt(match[1], 16) : null;
}

function extractRange(lines, start, end) {
  const out = [];
  let pending = [];
  let wordCount = 0;
  for (const line of lines) {
    const rom = wordLineRom(line);
    if (rom == null) {
      const trimmed = line.trim();
      if (
        trimmed === '' ||
        trimmed.startsWith('/* function boundary candidate:') ||
        /^[A-Za-z_.$][A-Za-z0-9_.$]*:$/.test(trimmed)
      ) {
        pending.push(line);
      } else if (trimmed.startsWith('.')) {
        pending = [];
      }
      continue;
    }
    if (rom >= start && rom < end) {
      out.push(...pending);
      pending = [];
      out.push(line);
      wordCount += 1;
    } else {
      pending = [];
    }
  }
  if (wordCount * 4 !== end - start) {
    throw new Error(`Range ${hex(start)}..${hex(end)} emitted ${wordCount * 4} byte(s), expected ${end - start}`);
  }
  while (out.length > 0 && out[0] === '') out.shift();
  while (out.length > 0 && out[out.length - 1] === '') out.pop();
  return out;
}

function writeSplitFile({ split, sourcePart, lines }) {
  const outPath = repoPath(split.file);
  ensureDir(path.dirname(outPath));
  const body = extractRange(lines, split.start, split.end);
  const headerLines = [
    '/*',
    ' * Original Rev 0 MIPS reference split.',
    ` * Parent source: ${sourcePart.file}`,
    ` * z64 range: ${hex(split.start)}..${hex(split.end)} exclusive`,
    ' * Decode comments are aids, not proof of semantic function boundaries.',
    ' */',
    '.set noat',
    '.set noreorder',
    '.text',
    '',
  ];
  if (split.label) {
    headerLines.push(`/* True entry ${hex(split.start)} (read-before-write preamble; the parent-DB boundary label appears below inside the body). */`);
    headerLines.push(`${split.label}:`);
  }
  const text = [...headerLines, ...body, ''].join('\n');
  fs.writeFileSync(outPath, text);
  return {
    name: split.name,
    file: repoRel(outPath),
    romStart: hex(split.start),
    romEndExclusive: hex(split.end),
    bytes: split.end - split.start,
    textBytes: Buffer.byteLength(text),
    sha256: hashBuffer(Buffer.from(text), 'sha256'),
  };
}

function assertContiguous(splits, partStart, partEnd) {
  let cursor = partStart;
  for (const split of splits) {
    if (split.start !== cursor) {
      throw new Error(`Split ${split.name} starts at ${hex(split.start)}, expected ${hex(cursor)}`);
    }
    if (split.end <= split.start) throw new Error(`Split ${split.name} has invalid range`);
    cursor = split.end;
  }
  if (cursor > partEnd) throw new Error(`Splits end at ${hex(cursor)}, past source part end ${hex(partEnd)}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.manifest)) throw new Error(`Manifest not found: ${args.manifest}`);
  const manifest = readJson(args.manifest);
  const found = findPart(manifest, args.partFile);
  if (!found) throw new Error(`Part not found in manifest: ${args.partFile}`);

  const partStart = parseHexOrNumber(found.part.romStart);
  const partEnd = parseHexOrNumber(found.part.romEndExclusive);
  const splits = args.splits.slice().sort((a, b) => a.start - b.start);
  assertContiguous(splits, partStart, partEnd);

  if (splits[splits.length - 1].end < partEnd) {
    if (!args.remainder) {
      throw new Error(`Splits stop before source part end ${hex(partEnd)}; pass --remainder`);
    }
    splits.push({
      name: args.remainder.name,
      start: splits[splits.length - 1].end,
      end: partEnd,
      file: args.remainder.file,
    });
  }
  assertContiguous(splits, partStart, partEnd);

  const sourcePath = repoPath(found.part.file);
  if (!fs.existsSync(sourcePath)) throw new Error(`Source part file missing: ${sourcePath}`);
  const lines = fs.readFileSync(sourcePath, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const newParts = splits.map((split) => writeSplitFile({ split, sourcePart: found.part, lines }));

  found.chunk.parts.splice(found.partIndex, 1, ...newParts);
  found.chunk.textBytes = found.chunk.parts.reduce((sum, part) => sum + (part.textBytes || 0), 0);
  found.chunk.sha256 = hashBuffer(Buffer.from(found.chunk.parts.map((part) => part.sha256).join('\n')), 'sha256');
  writeJson(args.manifest, manifest);

  if (args.removeSource) {
    const stillReferenced = (manifest.chunks || []).some((chunk) =>
      (chunk.parts || []).some((part) => repoPath(part.file) === sourcePath),
    );
    if (!stillReferenced) fs.unlinkSync(sourcePath);
  }

  console.log(`Split ${found.part.file} into ${newParts.length} part(s):`);
  for (const part of newParts) {
    console.log(`  ${part.file} ${part.romStart}..${part.romEndExclusive}`);
  }
}

main();
