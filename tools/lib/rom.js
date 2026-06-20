const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function hex(value, width = 8) {
  return `0x${(Number(value) >>> 0).toString(16).toUpperCase().padStart(width, '0')}`;
}

function parseHexOrNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') throw new Error(`Expected number/string, got ${typeof value}`);
  return value.startsWith('0x') || value.startsWith('0X') ? parseInt(value, 16) : parseInt(value, 10);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function hashBuffer(buffer, algorithm) {
  return crypto.createHash(algorithm).update(buffer).digest('hex').toUpperCase();
}

function detectByteOrder(buffer) {
  if (buffer.length < 4) return 'unknown';
  const magic = buffer.subarray(0, 4).toString('hex').toUpperCase();
  if (magic === '80371240') return 'z64';
  if (magic === '37804012') return 'v64';
  if (magic === '40123780') return 'n64';
  return 'unknown';
}

function normalizeToZ64(buffer, byteOrder) {
  if (byteOrder === 'z64') return Buffer.from(buffer);
  if (byteOrder === 'v64') {
    if (buffer.length % 2 !== 0) throw new Error('v64 input length is not even');
    const out = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i += 2) {
      out[i] = buffer[i + 1];
      out[i + 1] = buffer[i];
    }
    return out;
  }
  if (byteOrder === 'n64') {
    if (buffer.length % 4 !== 0) throw new Error('n64 input length is not divisible by 4');
    const out = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i += 4) {
      out[i] = buffer[i + 3];
      out[i + 1] = buffer[i + 2];
      out[i + 2] = buffer[i + 1];
      out[i + 3] = buffer[i];
    }
    return out;
  }
  throw new Error(`Unknown ROM byte order: ${byteOrder}`);
}

function z64ToN64(buffer) {
  if (buffer.length % 4 !== 0) throw new Error('z64 length is not divisible by 4');
  const out = Buffer.alloc(buffer.length);
  for (let i = 0; i < buffer.length; i += 4) {
    out[i] = buffer[i + 3];
    out[i + 1] = buffer[i + 2];
    out[i + 2] = buffer[i + 1];
    out[i + 3] = buffer[i];
  }
  return out;
}

function headerInfo(z64) {
  return {
    magic: z64.subarray(0, 4).toString('hex').toUpperCase(),
    clockRate: hex(z64.readUInt32BE(0x04)),
    entryPoint: hex(z64.readUInt32BE(0x08)),
    release: hex(z64.readUInt32BE(0x0C)),
    crc1: z64.subarray(0x10, 0x14).toString('hex').toUpperCase(),
    crc2: z64.subarray(0x14, 0x18).toString('hex').toUpperCase(),
    internalName: z64.subarray(0x20, 0x34).toString('ascii').replace(/\0+$/g, '').trimEnd(),
    gameId: z64.subarray(0x3B, 0x3F).toString('ascii'),
    countryByte: z64[0x3E],
    version: z64[0x3F],
  };
}

function loadProfile(profilePath = path.join(ROOT, 'config', 'roms', 'us_rev0.json')) {
  return readJson(profilePath);
}

function defaultInputCandidates() {
  const baseromDir = path.join(ROOT, 'baserom');
  const baseromFiles = fs.existsSync(baseromDir)
    ? fs.readdirSync(baseromDir)
        .filter((name) => /\.(v64|z64|n64)$/i.test(name))
        .map((name) => path.join(baseromDir, name))
    : [];
  const parentMaster = path.resolve(ROOT, '..', 'Ogre Battle 64 - Person of Lordly Caliber (U) [!].v64');
  if (fs.existsSync(parentMaster)) baseromFiles.push(parentMaster);
  return baseromFiles;
}

function resolveInputPath(explicitInput) {
  if (explicitInput) return path.resolve(explicitInput);
  const candidates = defaultInputCandidates();
  if (candidates.length === 0) {
    throw new Error('No ROM input found. Place Rev 0 in baserom/ or pass --input <path>.');
  }
  const localBaseroms = candidates.filter((candidate) => path.dirname(candidate) === path.join(ROOT, 'baserom'));
  if (localBaseroms.length > 1) {
    throw new Error(`Multiple baserom inputs found; pass --input explicitly:\n${localBaseroms.join('\n')}`);
  }
  return localBaseroms[0] || candidates[0];
}

function verifyRev0(z64, profile) {
  const info = headerInfo(z64);
  const n64Md5 = hashBuffer(z64ToN64(z64), 'md5');
  const checks = [
    {
      name: 'byteOrderMagic',
      ok: info.magic === '80371240',
      expected: '80371240',
      actual: info.magic,
    },
    {
      name: 'sizeBytes',
      ok: z64.length === profile.sizeBytes,
      expected: profile.sizeBytes,
      actual: z64.length,
    },
    {
      name: 'crc1',
      ok: info.crc1 === profile.project64Crc1,
      expected: profile.project64Crc1,
      actual: info.crc1,
    },
    {
      name: 'crc2',
      ok: info.crc2 === profile.project64Crc2,
      expected: profile.project64Crc2,
      actual: info.crc2,
    },
    {
      name: 'gameId',
      ok: info.gameId === profile.gameId,
      expected: profile.gameId,
      actual: info.gameId,
    },
    {
      name: 'countryByte',
      ok: info.countryByte === 0x45,
      expected: '0x45',
      actual: hex(info.countryByte, 2),
    },
    {
      name: 'version',
      ok: info.version === profile.revision,
      expected: profile.revision,
      actual: info.version,
    },
    {
      name: 'project64StockN64Md5',
      ok: n64Md5 === profile.project64StockN64Md5,
      expected: profile.project64StockN64Md5,
      actual: n64Md5,
    },
  ];
  return { ok: checks.every((check) => check.ok), checks, header: info, n64Md5 };
}

function loadAndVerifyRom({ inputPath, profile = loadProfile() } = {}) {
  const resolvedInput = resolveInputPath(inputPath);
  const raw = fs.readFileSync(resolvedInput);
  const detectedByteOrder = detectByteOrder(raw);
  const z64 = normalizeToZ64(raw, detectedByteOrder);
  const verification = verifyRev0(z64, profile);
  return {
    inputPath: resolvedInput,
    raw,
    z64,
    detectedByteOrder,
    verification,
    hashes: {
      rawMd5: hashBuffer(raw, 'md5'),
      rawSha1: hashBuffer(raw, 'sha1'),
      rawSha256: hashBuffer(raw, 'sha256'),
      z64Md5: hashBuffer(z64, 'md5'),
      z64Sha1: hashBuffer(z64, 'sha1'),
      z64Sha256: hashBuffer(z64, 'sha256'),
      n64Md5: verification.n64Md5,
    },
  };
}

module.exports = {
  ROOT,
  defaultInputCandidates,
  detectByteOrder,
  ensureDir,
  hashBuffer,
  headerInfo,
  hex,
  loadAndVerifyRom,
  loadProfile,
  normalizeToZ64,
  parseHexOrNumber,
  readJson,
  resolveInputPath,
  verifyRev0,
  writeJson,
  z64ToN64,
};
