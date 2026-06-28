#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const {
  ROOT,
  ensureDir,
  hashBuffer,
  hex,
  loadAndVerifyRom,
  writeJson,
} = require('./lib/rom');

const DIRECTORY_START = 0x00594280;
const DIRECTORY_ENTRIES = 65;
const HUFF_POOL_START = 0x005943C8;
const CODE_REGION_STOP = 0x0063676C;
const FIRST_LHA_ARCHIVE = 0x00636784;
const EXPECTED_HEADER_WORD = 0x4855FE00;
const EXPECTED_SIZE_WORD = 0x014000F0;
const EXPECTED_MACROBLOCKS = 300;
const EXPECTED_WIDTH = 320;
const EXPECTED_HEIGHT = 240;
const COEFF_BYTES_PER_BLOCK = EXPECTED_MACROBLOCKS * 6 * 64 * 2;
const N64_JPEG_MANUAL_URL = 'https://ultra64.ca/files/documentation/online-manuals/man/pro-man/pro25/25-07.html';

const STD_HUFF = {
  dcLuma: {
    bits: [0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    vals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  dcChroma: {
    bits: [0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    vals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  acLuma: {
    bits: [0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d],
    vals: [
      0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
      0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08,
      0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72,
      0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
      0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45,
      0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
      0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75,
      0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
      0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3,
      0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
      0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9,
      0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
      0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4,
      0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa,
    ],
  },
  acChroma: {
    bits: [0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77],
    vals: [
      0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31, 0x06, 0x12, 0x41,
      0x51, 0x07, 0x61, 0x71, 0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91,
      0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0, 0x15, 0x62, 0x72, 0xd1,
      0x0a, 0x16, 0x24, 0x34, 0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26,
      0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44,
      0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,
      0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74,
      0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
      0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a,
      0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4,
      0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7,
      0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda,
      0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf2, 0xf3, 0xf4,
      0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa,
    ],
  },
};

function usage() {
  console.log(`Usage: node tools/analyze_section_c_huff.js [--input <rom>] [--out-dir <dir>]\n\nDumps and classifies the Rev 0 Section C HUFF/NJPG pool. Outputs JSON/Markdown reports, per-block container/payload binaries, and standard-JPEG-Huffman coefficient buffers under build/huff-section-c by default.`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    outDir: path.join(ROOT, 'build', 'huff-section-c'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--input') {
      args.input = argv[++i];
    } else if (arg === '--out-dir') {
      args.outDir = path.resolve(argv[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function bytesToHex(buffer) {
  return buffer.toString('hex').toUpperCase().replace(/(..)/g, '$1 ').trim();
}

function entropy(buffer) {
  if (buffer.length === 0) return 0;
  const counts = new Array(256).fill(0);
  for (const byte of buffer) counts[byte] += 1;
  let value = 0;
  for (const count of counts) {
    if (count === 0) continue;
    const p = count / buffer.length;
    value -= p * Math.log2(p);
  }
  return value;
}

function printableRatio(buffer) {
  if (buffer.length === 0) return 0;
  let printable = 0;
  for (const byte of buffer) {
    if ((byte >= 0x20 && byte <= 0x7e) || byte === 0x09 || byte === 0x0a || byte === 0x0d) {
      printable += 1;
    }
  }
  return printable / buffer.length;
}

function tryInflate(kind, fn, buffer) {
  try {
    const out = fn(buffer);
    return {
      kind,
      ok: true,
      size: out.length,
      sha256: hashBuffer(out, 'sha256'),
    };
  } catch (error) {
    return {
      kind,
      ok: false,
      error: error.message.split('\n')[0],
    };
  }
}

function buildHuffmanTable(spec) {
  const table = new Map();
  let code = 0;
  let valIndex = 0;
  for (let length = 1; length <= 16; length += 1) {
    const count = spec.bits[length - 1];
    for (let i = 0; i < count; i += 1) {
      table.set(`${length}:${code}`, spec.vals[valIndex]);
      code += 1;
      valIndex += 1;
    }
    code <<= 1;
  }
  if (valIndex !== spec.vals.length) {
    throw new Error(`Bad JPEG Huffman table: used ${valIndex} values, expected ${spec.vals.length}`);
  }
  return table;
}

class BitReader {
  constructor(buffer, startOffset, direction) {
    this.buffer = buffer;
    this.startOffset = startOffset;
    this.direction = direction;
    this.bitPos = startOffset * 8;
  }

  readBit() {
    if (this.bitPos >= this.buffer.length * 8) {
      throw new Error(`read past end at bit ${this.bitPos}`);
    }
    const byte = this.buffer[this.bitPos >> 3];
    const bitInByte = this.bitPos & 7;
    this.bitPos += 1;
    if (this.direction === 'lsb') return (byte >> bitInByte) & 1;
    return (byte >> (7 - bitInByte)) & 1;
  }

  readBits(count) {
    let value = 0;
    for (let i = 0; i < count; i += 1) {
      value = (value << 1) | this.readBit();
    }
    return value;
  }

  consumedBytes() {
    return Math.ceil(this.bitPos / 8);
  }
}

function huffDecodeSymbol(reader, table) {
  let code = 0;
  for (let length = 1; length <= 16; length += 1) {
    code = (code << 1) | reader.readBit();
    const symbol = table.get(`${length}:${code}`);
    if (symbol !== undefined) return symbol;
  }
  throw new Error(`bad huff code at bit ${reader.bitPos}`);
}

function receiveExtend(reader, size) {
  if (size === 0) return 0;
  const value = reader.readBits(size);
  const threshold = 1 << (size - 1);
  if (value >= threshold) return value;
  return value - ((1 << size) - 1);
}

function decodeNjpgHuff(huffBuffer, direction) {
  if (huffBuffer.subarray(0, 4).toString('ascii') !== 'HUFF') {
    throw new Error('inner HUFF magic missing');
  }
  const macroblocks = huffBuffer.readUInt16BE(4);
  const tables = {
    dcLuma: buildHuffmanTable(STD_HUFF.dcLuma),
    dcChroma: buildHuffmanTable(STD_HUFF.dcChroma),
    acLuma: buildHuffmanTable(STD_HUFF.acLuma),
    acChroma: buildHuffmanTable(STD_HUFF.acChroma),
  };
  const reader = new BitReader(huffBuffer, 6, direction);
  const out = Buffer.alloc(macroblocks * 6 * 64 * 2);
  const dc = [0, 0, 0];
  let outOffset = 0;
  let nonZeroCoefficients = 0;
  let maxAbsCoefficient = 0;

  for (let mb = 0; mb < macroblocks; mb += 1) {
    for (let blockIndex = 0; blockIndex < 6; blockIndex += 1) {
      const isLuma = blockIndex < 4;
      const component = isLuma ? 0 : blockIndex === 4 ? 1 : 2;
      const dcTable = isLuma ? tables.dcLuma : tables.dcChroma;
      const acTable = isLuma ? tables.acLuma : tables.acChroma;
      const coeffs = new Array(64).fill(0);
      const dcSize = huffDecodeSymbol(reader, dcTable);
      dc[component] += receiveExtend(reader, dcSize);
      coeffs[0] = dc[component];

      let k = 1;
      while (k < 64) {
        const rs = huffDecodeSymbol(reader, acTable);
        if (rs === 0x00) break;
        if (rs === 0xf0) {
          k += 16;
          if (k > 64) {
            throw new Error(`ac ZRL beyond block mb=${mb} bi=${blockIndex} k=${k} bit=${reader.bitPos}`);
          }
          continue;
        }
        const run = rs >> 4;
        const size = rs & 0x0f;
        k += run;
        if (k >= 64) {
          throw new Error(`ac run beyond block mb=${mb} bi=${blockIndex} k=${k} bit=${reader.bitPos}`);
        }
        coeffs[k] = receiveExtend(reader, size);
        k += 1;
      }

      for (const coeff of coeffs) {
        if (coeff !== 0) {
          nonZeroCoefficients += 1;
          maxAbsCoefficient = Math.max(maxAbsCoefficient, Math.abs(coeff));
        }
        out.writeInt16BE(coeff, outOffset);
        outOffset += 2;
      }
    }
  }

  return {
    ok: true,
    direction,
    macroblocks,
    outputBytes: out.length,
    consumedBytes: reader.consumedBytes(),
    slackBytes: huffBuffer.length - reader.consumedBytes(),
    finalBitPosition: reader.bitPos,
    nonZeroCoefficients,
    maxAbsCoefficient,
    coeffs: out,
  };
}

function decodeNjpgHuffAttempt(huffBuffer, direction) {
  try {
    return decodeNjpgHuff(huffBuffer, direction);
  } catch (error) {
    return {
      ok: false,
      direction,
      error: error.message,
    };
  }
}

function parseDirectory(z64, blocks) {
  const blockStartToIndex = new Map(blocks.map((block) => [block.start, block.index]));
  const naturalEnd = blocks.length > 0 ? blocks[blocks.length - 1].end : null;
  const entries = [];
  for (let index = 0; index < DIRECTORY_ENTRIES; index += 1) {
    const value = z64.readUInt32BE(DIRECTORY_START + index * 4);
    const absolute = DIRECTORY_START + value;
    let kind = 'unresolved';
    let blockIndex = null;
    if (blockStartToIndex.has(absolute)) {
      kind = 'huff_block_start';
      blockIndex = blockStartToIndex.get(absolute);
    } else if (absolute === naturalEnd) {
      kind = 'huff_pool_end';
    } else if (absolute >= HUFF_POOL_START && absolute < naturalEnd) {
      kind = 'inside_huff_pool';
    } else if (absolute < HUFF_POOL_START) {
      kind = 'pre_huff_pool_or_prelude';
    } else if (absolute >= naturalEnd && absolute < FIRST_LHA_ARCHIVE) {
      kind = 'between_huff_end_and_lha';
    } else {
      kind = 'outside_raw_section_c_when_directory_relative';
    }
    entries.push({
      index,
      value,
      valueHex: hex(value),
      absolute,
      absoluteHex: hex(absolute),
      kind,
      blockIndex,
    });
  }
  return entries;
}

function parseBlocks(z64) {
  const blocks = [];
  for (let offset = HUFF_POOL_START; offset < FIRST_LHA_ARCHIVE - 4; offset += 1) {
    if (z64.subarray(offset, offset + 4).toString('ascii') !== 'HUFF') continue;
    const start = offset - 0x0c;
    if (start < HUFF_POOL_START) continue;
    const headerWord = z64.readUInt32BE(start + 0x04);
    const sizeWord = z64.readUInt32BE(start + 0x08);
    const macroblocks = z64.readUInt16BE(start + 0x10);
    if (headerWord !== EXPECTED_HEADER_WORD || sizeWord !== EXPECTED_SIZE_WORD || macroblocks !== EXPECTED_MACROBLOCKS) {
      continue;
    }
    const leadU32 = z64.readUInt32BE(start);
    const end = start + leadU32 + 4;
    const container = z64.subarray(start, end);
    const huffBuffer = z64.subarray(start + 0x0c, end);
    const payload = z64.subarray(start + 0x12, end);
    blocks.push({
      index: blocks.length,
      start,
      startHex: hex(start),
      magicOffset: offset,
      magicOffsetHex: hex(offset),
      end,
      endHex: hex(end),
      ownedEnd: Math.min(end, CODE_REGION_STOP),
      ownedEndHex: hex(Math.min(end, CODE_REGION_STOP)),
      blockSize: end - start,
      leadU32,
      leadU32Hex: hex(leadU32),
      headerWordHex: hex(headerWord),
      sizeWordHex: hex(sizeWord),
      width: sizeWord >>> 16,
      height: sizeWord & 0xffff,
      macroblocks,
      containerHeaderHex: bytesToHex(z64.subarray(start, start + 0x12)),
      huffBufferSize: huffBuffer.length,
      payloadSize: payload.length,
      payloadEntropy: entropy(payload),
      payloadPrintableRatio: printableRatio(payload),
      containerSha256: hashBuffer(container, 'sha256'),
      payloadSha256: hashBuffer(payload, 'sha256'),
      zlibProbes: [
        tryInflate('zlib_payload', zlib.inflateSync, payload),
        tryInflate('raw_deflate_payload', zlib.inflateRawSync, payload),
        tryInflate('gzip_payload', zlib.gunzipSync, payload),
        tryInflate('zlib_inner_huff_buffer', zlib.inflateSync, huffBuffer),
      ],
      _container: container,
      _payload: payload,
      _huffBuffer: huffBuffer,
    });
  }
  return blocks;
}

function writeDumps(outDir, blocks) {
  const blockDir = path.join(outDir, 'blocks');
  const njpgDir = path.join(outDir, 'njpg');
  ensureDir(blockDir);
  ensureDir(njpgDir);

  for (const block of blocks) {
    const prefix = `block_${String(block.index).padStart(2, '0')}_${block.startHex}`;
    fs.writeFileSync(path.join(blockDir, `${prefix}_container.bin`), block._container);
    fs.writeFileSync(path.join(blockDir, `${prefix}_payload.bin`), block._payload);
    if (block.njpgHuffDecode.msb.ok) {
      fs.writeFileSync(path.join(njpgDir, `${prefix}_huffdecode_coeffs_be.bin`), block.njpgHuffDecode.msb.coeffs);
    }
  }
}

function publicBlock(block) {
  const copy = { ...block };
  delete copy._container;
  delete copy._payload;
  delete copy._huffBuffer;
  if (copy.njpgHuffDecode) {
    copy.njpgHuffDecode = {
      msb: { ...copy.njpgHuffDecode.msb },
      lsb: { ...copy.njpgHuffDecode.lsb },
    };
    delete copy.njpgHuffDecode.msb.coeffs;
    delete copy.njpgHuffDecode.lsb.coeffs;
  }
  return copy;
}

function renderMarkdown(report) {
  const lines = [];
  lines.push('# Section C HUFF/NJPG Analysis');
  lines.push('');
  lines.push(`Input: \`${report.input.path}\``);
  lines.push(`Z64 SHA256: \`${report.input.z64Sha256}\``);
  lines.push(`Generated: \`${report.generatedAt}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Blocks parsed: ${report.summary.blockCount}.`);
  lines.push(`- Geometry word: ${report.summary.width}x${report.summary.height}.`);
  lines.push(`- Macroblocks per block: ${report.summary.macroblocks} (${report.summary.width / 16} x ${report.summary.height / 16}).`);
  lines.push(`- Payload bytes: ${report.summary.totalPayloadBytes}.`);
  lines.push(`- Aggregate payload entropy: ${report.summary.aggregatePayloadEntropy.toFixed(4)} bits/byte.`);
  lines.push(`- Standard JPEG Huffman, MSB-first: ${report.summary.njpgMsbSuccesses}/${report.summary.blockCount} blocks decoded.`);
  lines.push(`- Standard JPEG Huffman, LSB-first: ${report.summary.njpgLsbSuccesses}/${report.summary.blockCount} blocks decoded.`);
  lines.push(`- Coefficient dump size per decoded block: ${report.summary.coefficientBytesPerBlock} bytes.`);
  lines.push('');
  lines.push('Classification: N64 JPEG/NJPG-style HUFF entropy streams inside an OB64-specific wrapper. The CPU Huffman stage is decoded to macroblock coefficient buffers; final pixels still require the NJPG/RSP JPEG stage or an equivalent IDCT, quantization, and YUV conversion path.');
  lines.push('');
  lines.push(`Reference: [N64 Online Manual - 25.7 JPEG](${N64_JPEG_MANUAL_URL}).`);
  lines.push('');
  lines.push('## Directory Mapping');
  lines.push('');
  lines.push(`- Directory start: \`${report.directory.startHex}\`.`);
  lines.push(`- Entries: ${report.directory.entryCount}.`);
  lines.push(`- Entries mapping exactly to HUFF block starts: ${report.directory.huffBlockStartMatches} (${report.directory.uniqueHuffBlockStartMatches} unique blocks).`);
  lines.push(`- Entry mapping to natural HUFF pool end: ${report.directory.huffPoolEndMatches}.`);
  lines.push(`- Unresolved entries when treated as raw Section C relative offsets: ${report.directory.unresolvedCount}.`);
  lines.push('');
  lines.push('## Blocks');
  lines.push('');
  lines.push('| # | start | end | size | payload | consumed | slack | nonzero | max abs |');
  lines.push('| - | - | - | -: | -: | -: | -: | -: | -: |');
  for (const block of report.blocks) {
    const msb = block.njpgHuffDecode.msb;
    lines.push(`| ${block.index} | \`${block.startHex}\` | \`${block.endHex}\` | ${block.blockSize} | ${block.payloadSize} | ${msb.ok ? msb.consumedBytes : 'FAIL'} | ${msb.ok ? msb.slackBytes : 'FAIL'} | ${msb.ok ? msb.nonZeroCoefficients : 'FAIL'} | ${msb.ok ? msb.maxAbsCoefficient : 'FAIL'} |`);
  }
  lines.push('');
  lines.push('## Caveats');
  lines.push('');
  lines.push('- This proves the entropy/Huffman stage, not final renderable imagery.');
  lines.push('- The outer `48 55 FE 00` word is still an OB64-specific wrapper field.');
  lines.push('- Directory entries 32-64 are not simple raw Section C block starts under the directory base.');
  lines.push('- Block 28 naturally ends at `0x00636780`, past the configured code-region stop and inside the structural gap before the first LHA archive.');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rom = loadAndVerifyRom({ inputPath: args.input });
  if (!rom.verification.ok) {
    throw new Error(`ROM verification failed for ${rom.inputPath}`);
  }

  const blocks = parseBlocks(rom.z64);
  for (const block of blocks) {
    const msb = decodeNjpgHuffAttempt(block._huffBuffer, 'msb');
    const lsb = decodeNjpgHuffAttempt(block._huffBuffer, 'lsb');
    block.njpgHuffDecode = { msb, lsb };
  }

  const directoryEntries = parseDirectory(rom.z64, blocks);
  const allPayloads = Buffer.concat(blocks.map((block) => block._payload));
  const report = {
    generatedAt: new Date().toISOString(),
    input: {
      path: rom.inputPath,
      detectedByteOrder: rom.detectedByteOrder,
      z64Sha256: rom.hashes.z64Sha256,
    },
    section: {
      directoryStart: DIRECTORY_START,
      directoryStartHex: hex(DIRECTORY_START),
      huffPoolStart: HUFF_POOL_START,
      huffPoolStartHex: hex(HUFF_POOL_START),
      codeRegionStop: CODE_REGION_STOP,
      codeRegionStopHex: hex(CODE_REGION_STOP),
      firstLhaArchive: FIRST_LHA_ARCHIVE,
      firstLhaArchiveHex: hex(FIRST_LHA_ARCHIVE),
    },
    reference: {
      n64JpegManualUrl: N64_JPEG_MANUAL_URL,
    },
    summary: {
      blockCount: blocks.length,
      width: EXPECTED_WIDTH,
      height: EXPECTED_HEIGHT,
      macroblocks: EXPECTED_MACROBLOCKS,
      totalPayloadBytes: allPayloads.length,
      aggregatePayloadEntropy: entropy(allPayloads),
      aggregatePayloadPrintableRatio: printableRatio(allPayloads),
      njpgMsbSuccesses: blocks.filter((block) => block.njpgHuffDecode.msb.ok).length,
      njpgLsbSuccesses: blocks.filter((block) => block.njpgHuffDecode.lsb.ok).length,
      coefficientBytesPerBlock: COEFF_BYTES_PER_BLOCK,
      genericInflateSuccesses: blocks.reduce((sum, block) => sum + block.zlibProbes.filter((probe) => probe.ok).length, 0),
    },
    directory: {
      start: DIRECTORY_START,
      startHex: hex(DIRECTORY_START),
      entryCount: DIRECTORY_ENTRIES,
      huffBlockStartMatches: directoryEntries.filter((entry) => entry.kind === 'huff_block_start').length,
      uniqueHuffBlockStartMatches: new Set(directoryEntries.filter((entry) => entry.kind === 'huff_block_start').map((entry) => entry.blockIndex)).size,
      huffPoolEndMatches: directoryEntries.filter((entry) => entry.kind === 'huff_pool_end').length,
      unresolvedCount: directoryEntries.filter((entry) => entry.kind === 'outside_raw_section_c_when_directory_relative').length,
      entries: directoryEntries,
    },
    blocks: blocks.map(publicBlock),
  };

  ensureDir(args.outDir);
  writeDumps(args.outDir, blocks);
  writeJson(path.join(args.outDir, 'section-c-huff-analysis.json'), report);
  fs.writeFileSync(path.join(args.outDir, 'section-c-huff-analysis.md'), renderMarkdown(report));

  const njpgReport = {
    generatedAt: report.generatedAt,
    summary: report.summary,
    blocks: report.blocks.map((block) => ({
      index: block.index,
      startHex: block.startHex,
      endHex: block.endHex,
      huffBufferSize: block.huffBufferSize,
      msb: block.njpgHuffDecode.msb,
      lsb: block.njpgHuffDecode.lsb,
    })),
  };
  writeJson(path.join(args.outDir, 'njpg', 'njpg_huffdecode_attempt.json'), njpgReport);

  console.log(`Section C HUFF blocks: ${report.summary.blockCount}`);
  console.log(`MSB-first NJPG Huffman decode: ${report.summary.njpgMsbSuccesses}/${report.summary.blockCount}`);
  console.log(`LSB-first NJPG Huffman decode: ${report.summary.njpgLsbSuccesses}/${report.summary.blockCount}`);
  console.log(`Wrote ${path.relative(ROOT, path.join(args.outDir, 'section-c-huff-analysis.md'))}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(1);
  }
}
