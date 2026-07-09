#!/usr/bin/env node
// Render stage for the Section C NJPG "HUFF" pool: takes the zigzag-order
// s16BE coefficient buffers produced by tools/analyze_section_c_huff.js
// (build/huff-section-c/njpg/block_*_huffdecode_coeffs_be.bin) through
// de-zigzag -> dequantize -> 8x8 IDCT -> +128 level shift -> 4:2:0 plane
// assembly -> BT.601 YCbCr->RGB, and writes PNGs.
//
// The inner HUFF stream carries no quantization table (just "HUFF" + u16
// macroblock count + bitstream), so the quantizer is a hypothesis selected
// with --quant:
//   flat<N>   every divisor = N (flat1 = coefficients are already dequantized)
//   q<Q>      IJG quality-scaled JPEG Annex K tables (q50 = Annex K as-is)
// Default renders the standard candidate set for scoring. Per-variant metrics
// (clip fraction, block-boundary discontinuity vs interior gradient) go to
// build/njpg/render-report.json; low clip + boundary/interior ratio near 1.0
// indicate the correct quantizer.
//
// Usage:
//   node tools/render_section_c_njpg.js [--block <n>|all] [--quant <spec>[,<spec>...]]
//                                       [--out-dir <dir>]
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const IN_DIR = path.join(ROOT, 'build', 'huff-section-c', 'njpg');
const WIDTH = 320;
const HEIGHT = 240;
const MB_W = WIDTH / 16;
const MB_H = HEIGHT / 16;

// JPEG Annex K base tables (quality 50), natural (row-major) order.
const K1_LUMA = [
  16, 11, 10, 16, 24, 40, 51, 61,
  12, 12, 14, 19, 26, 58, 60, 55,
  14, 13, 16, 24, 40, 57, 69, 56,
  14, 17, 22, 29, 51, 87, 80, 62,
  18, 22, 37, 56, 68, 109, 103, 77,
  24, 35, 55, 64, 81, 104, 113, 92,
  49, 64, 78, 87, 103, 121, 120, 101,
  72, 92, 95, 98, 112, 100, 103, 99,
];
const K2_CHROMA = [
  17, 18, 24, 47, 99, 99, 99, 99,
  18, 21, 26, 66, 99, 99, 99, 99,
  24, 26, 56, 99, 99, 99, 99, 99,
  47, 66, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
];

const ZIGZAG = [
  0, 1, 8, 16, 9, 2, 3, 10,
  17, 24, 32, 25, 18, 11, 4, 5,
  12, 19, 26, 33, 40, 48, 41, 34,
  27, 20, 13, 6, 7, 14, 21, 28,
  35, 42, 49, 56, 57, 50, 43, 36,
  29, 22, 15, 23, 30, 37, 44, 51,
  58, 59, 52, 45, 38, 31, 39, 46,
  53, 60, 61, 54, 47, 55, 62, 63,
];

function ijgScale(base, quality) {
  const q = Math.max(1, Math.min(100, quality));
  const scale = q < 50 ? Math.floor(5000 / q) : 200 - q * 2;
  return base.map((v) => Math.max(1, Math.min(255, Math.floor((v * scale + 50) / 100))));
}

function quantTables(spec) {
  const flat = spec.match(/^flat(\d+)$/);
  if (flat) {
    const n = Number(flat[1]);
    return { luma: new Array(64).fill(n), chroma: new Array(64).fill(n) };
  }
  const q = spec.match(/^q(\d+)$/);
  if (q) {
    return { luma: ijgScale(K1_LUMA, Number(q[1])), chroma: ijgScale(K2_CHROMA, Number(q[1])) };
  }
  throw new Error(`Unknown quant spec: ${spec}`);
}

// Naive separable 2D IDCT (float; fine for offline rendering).
const COS = [];
for (let u = 0; u < 8; u += 1) {
  COS[u] = [];
  for (let x = 0; x < 8; x += 1) {
    COS[u][x] = Math.cos(((2 * x + 1) * u * Math.PI) / 16);
  }
}
const C = (u) => (u === 0 ? Math.SQRT1_2 : 1);

function idct8x8(block) {
  const out = new Array(64);
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      let sum = 0;
      for (let v = 0; v < 8; v += 1) {
        for (let u = 0; u < 8; u += 1) {
          sum += C(u) * C(v) * block[v * 8 + u] * COS[u][x] * COS[v][y];
        }
      }
      out[y * 8 + x] = sum / 4;
    }
  }
  return out;
}

const clamp8 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v | 0);

function renderBlock(coeffBuf, tables) {
  const yPlane = new Float64Array(WIDTH * HEIGHT);
  const cbPlane = new Float64Array((WIDTH / 2) * (HEIGHT / 2));
  const crPlane = new Float64Array((WIDTH / 2) * (HEIGHT / 2));
  let off = 0;
  let clipped = 0;
  let samples = 0;
  for (let mb = 0; mb < MB_W * MB_H; mb += 1) {
    const mbx = mb % MB_W;
    const mby = (mb / MB_W) | 0;
    for (let bi = 0; bi < 6; bi += 1) {
      const isLuma = bi < 4;
      const qt = isLuma ? tables.luma : tables.chroma;
      const natural = new Array(64).fill(0);
      for (let k = 0; k < 64; k += 1) {
        const coeff = coeffBuf.readInt16BE(off);
        off += 2;
        natural[ZIGZAG[k]] = coeff * qt[ZIGZAG[k]];
      }
      const px = idct8x8(natural);
      if (isLuma) {
        const bx = mbx * 16 + (bi & 1) * 8;
        const by = mby * 16 + (bi >> 1) * 8;
        for (let y = 0; y < 8; y += 1) {
          for (let x = 0; x < 8; x += 1) {
            const v = px[y * 8 + x] + 128;
            if (v < -0.5 || v > 255.5) clipped += 1;
            samples += 1;
            yPlane[(by + y) * WIDTH + (bx + x)] = v;
          }
        }
      } else {
        const plane = bi === 4 ? cbPlane : crPlane;
        const bx = mbx * 8;
        const by = mby * 8;
        for (let y = 0; y < 8; y += 1) {
          for (let x = 0; x < 8; x += 1) {
            plane[(by + y) * (WIDTH / 2) + (bx + x)] = px[y * 8 + x] + 128;
          }
        }
      }
    }
  }
  // BT.601 with nearest-neighbor chroma upsample.
  // chromaMode tests the unproven chroma convention: 'std' = blocks 4/5 are
  // Cb/Cr centered at 128; 'neg' = chroma stored negated (flip around 128);
  // 'swap' = block 4 is Cr, block 5 is Cb; 'negswap' = both.
  const mode = tables.chromaMode || 'std';
  const rgb = Buffer.alloc(WIDTH * HEIGHT * 3);
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const Y = yPlane[y * WIDTH + x];
      let c4 = cbPlane[(y >> 1) * (WIDTH / 2) + (x >> 1)] - 128;
      let c5 = crPlane[(y >> 1) * (WIDTH / 2) + (x >> 1)] - 128;
      if (mode === 'neg' || mode === 'negswap') { c4 = -c4; c5 = -c5; }
      const cb = (mode === 'swap' || mode === 'negswap') ? c5 : c4;
      const cr = (mode === 'swap' || mode === 'negswap') ? c4 : c5;
      const i = (y * WIDTH + x) * 3;
      rgb[i] = clamp8(Y + 1.402 * cr);
      rgb[i + 1] = clamp8(Y - 0.344136 * cb - 0.714136 * cr);
      rgb[i + 2] = clamp8(Y + 1.772 * cb);
    }
  }
  // Blockiness score: mean |gradient| across 8px block boundaries vs interior
  let edgeSum = 0; let edgeN = 0; let intSum = 0; let intN = 0;
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 1; x < WIDTH; x += 1) {
      const d = Math.abs(yPlane[y * WIDTH + x] - yPlane[y * WIDTH + x - 1]);
      if (x % 8 === 0) { edgeSum += d; edgeN += 1; } else { intSum += d; intN += 1; }
    }
  }
  return {
    rgb,
    metrics: {
      clipFraction: clipped / samples,
      boundaryGrad: edgeSum / edgeN,
      interiorGrad: intSum / intN,
      blockinessRatio: (edgeSum / edgeN) / Math.max(1e-9, intSum / intN),
    },
  };
}

// Minimal PNG writer (RGB8, filter 0)
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = -1;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}
function writePng(filePath, rgb, width, height) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y += 1) {
    raw[y * (1 + width * 3)] = 0;
    rgb.copy(raw, y * (1 + width * 3) + 1, y * width * 3, (y + 1) * width * 3);
  }
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
  fs.writeFileSync(filePath, png);
}

function main() {
  const av = process.argv.slice(2);
  const A = { block: '0', quant: 'flat1,flat2,flat4,flat8,q50,q75,q90,q95', chroma: 'std', scale: '1', outDir: path.join(ROOT, 'build', 'njpg') };
  for (let i = 0; i < av.length; i += 2) A[av[i].replace(/^--/, '')] = av[i + 1];
  const scale = Math.max(1, Number(A.scale) | 0);
  fs.mkdirSync(A.outDir, { recursive: true });

  const files = fs.readdirSync(IN_DIR).filter((f) => f.endsWith('_huffdecode_coeffs_be.bin')).sort();
  if (files.length === 0) {
    throw new Error(`No coefficient buffers under ${IN_DIR}; run tools/analyze_section_c_huff.js first`);
  }
  const wanted = A.block === 'all' ? files.map((_, i) => i) : A.block.split(',').map(Number);
  const specs = A.quant.split(',');
  const chromaModes = A.chroma.split(',');
  const report = [];
  for (const bi of wanted) {
    const file = files[bi];
    const coeffs = fs.readFileSync(path.join(IN_DIR, file));
    for (const spec of specs) for (const cm of chromaModes) {
      const { rgb, metrics } = renderBlock(coeffs, { ...quantTables(spec), chromaMode: cm });
      const outName = `block${String(bi).padStart(2, '0')}_${spec}${cm === 'std' ? '' : '_' + cm}${scale > 1 ? `_${scale}x` : ''}.png`;
      let out = rgb; let w = WIDTH; let h = HEIGHT;
      if (scale > 1) {
        w = WIDTH * scale; h = HEIGHT * scale;
        out = Buffer.alloc(w * h * 3);
        for (let y = 0; y < h; y += 1) {
          for (let x = 0; x < w; x += 1) {
            const s = (((y / scale) | 0) * WIDTH + ((x / scale) | 0)) * 3;
            rgb.copy(out, (y * w + x) * 3, s, s + 3);
          }
        }
      }
      writePng(path.join(A.outDir, outName), out, w, h);
      report.push({ block: bi, quant: spec, out: outName, ...metrics });
      console.log(
        `block ${bi} ${spec}: clip=${(metrics.clipFraction * 100).toFixed(2)}% ` +
        `blockiness=${metrics.blockinessRatio.toFixed(3)} ` +
        `(edge ${metrics.boundaryGrad.toFixed(2)} / interior ${metrics.interiorGrad.toFixed(2)})`);
    }
  }
  fs.writeFileSync(path.join(A.outDir, 'render-report.json'), JSON.stringify(report, null, 1));
  console.log(`PNGs + render-report.json under ${A.outDir}`);
}

main();
