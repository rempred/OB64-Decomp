'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ACCEPTED_FILES = [
  { path: 'candidate-source-occurrences.jsonl', bytes: 33156693, sha256: 'F018DC2ABEC3FF552B786657DF98928687E3A051ACB317C025C4EBFB36453FFE' },
  { path: 'function-dispositions.jsonl', bytes: 28799446, sha256: '7812CA48DA2ABD17E569C15C5CD47D3DE235D94A01FC35E26FAA41A8869F3A9E' },
  { path: 'segment-dispositions.jsonl', bytes: 3204818, sha256: 'E154A4B95CA8ADE1991069F1A812A2C730DCA09F2B9F59DE1B6C996BCC74CEC8' },
  { path: 'full-rom-primary-ledger.jsonl', bytes: 2783718, sha256: '8A5473D596DBD961426A853440C798F9585F38C46A96E4ABA9DD073C52A2FABB' },
  { path: 'structural-overlaps.jsonl', bytes: 25798, sha256: 'F9E3C2D02F305B0EC9AA910A3AF13ECD9EC77202895987DF4B18EE7DA032D64E' },
  { path: 'control-flow-edges.jsonl', bytes: 24299697, sha256: 'C94748D69E7C2E3E2326DD56DF2EFBD8CF320BBBEAE00647E2BB08453C9722E4' },
  { path: 'return-delay-slots.jsonl', bytes: 746236, sha256: '75C739AA2D19205970822AF6CE14ECA58C2140E7712B3B30CDBD606FE347E9F0' },
  { path: 'overlay-containment.jsonl', bytes: 12644, sha256: 'E2AC95E51BA268EB60071FA2117E510C4558CF39EE1E6C6B3B77E3D3478AAF78' },
  { path: 'contribution-view.jsonl', bytes: 1704, sha256: '2D083D0CB31FF875F7D7365268D85582C5DE23582CB00F1DC5C110D3FAA65240' },
  { path: 'candidate-universe-summary.json', bytes: 2309, sha256: '4AC3843156C76A3A5A5EB9BEB1E68B144BBB388B6CA39EADA230D5A37A5F6F76' },
  { path: 'full-rom-conservation.json', bytes: 446, sha256: 'AD06779B0A03A089572DC4A0082B2CDF23078179811B494773BB31A615C8D502' },
  { path: 'splat-input-candidate.yaml', bytes: 1151369, sha256: 'ED30879EE72830474DAA814D4F12659B12B59FCE4A368A4586AFD51E092A7DA1' },
  { path: 'input-provenance-manifest.json', bytes: 7629, sha256: 'EDE5DF7BB7310D8BF3F589DDD7B0EEB964A8D9E75D5482FC1BCE0179D200060A' },
];

const SUCCESSOR_FILES = ACCEPTED_FILES.map((row) => row.path === 'full-rom-primary-ledger.jsonl'
  ? { ...row, sha256: '85970FCDDE6448B9D4335BF767651A824E83C06F7482C23FFCD3E9B20F4488EF' }
  : row);

const ACCEPTED_PROFILE = {
  name: 'accepted',
  logicalSha256: '13BB110109C6DAE45157572DB5AC95DD233AB41C8639901302ED593AAB862EF2',
  productManifestSha256: '5C3128F206FFB019E0F43948C5334039C62DA439B73C85BC0AEEBFD2312E3393',
  primaryLedgerSha256: '8A5473D596DBD961426A853440C798F9585F38C46A96E4ABA9DD073C52A2FABB',
  files: ACCEPTED_FILES,
};

const SUCCESSOR_PROFILE = {
  name: 'row585-code-successor',
  logicalSha256: '7CDACEAC4C84D508FB03C252212C376A084153677233F2756A777DA527E1D42E',
  productManifestSha256: '64762581B888A8F6F14548F0E59DFE3358FCD2DB90FE6B3D1B902E577AFEBE68',
  primaryLedgerSha256: '85970FCDDE6448B9D4335BF767651A824E83C06F7482C23FFCD3E9B20F4488EF',
  files: SUCCESSOR_FILES,
};

const EXPECTED_PROFILES = Object.freeze({ accepted: ACCEPTED_PROFILE, successor: SUCCESSOR_PROFILE });
const EXPECTED_FILES = ACCEPTED_FILES.map((row) => row.path);
const SUCCESSOR_ROW = Object.freeze({
  index: 585,
  id: 'primary:eee9f5b0244d77b808d4',
  rom_start: 151552,
  rom_end_exclusive: 151616,
  bytes: 64,
  primary_class: 'code',
  owner_path: 'asm/original/rev0/lib/list_remove_node.s',
  owner_sha256: 'F53C50B7F051E63A47E69AED53933AE069A3DE1E32C0A3FD14DA2BCA67A1BC79',
  source_form: 'original_mips',
  owner_kind: 'tracked-assembly-part',
  ambiguous: false,
  source_manifest_index: 1,
});
const ACCEPTED_ROW_CLASS = 'data';

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function fail(message) {
  throw new Error(`Phase 5A product identity failure: ${message}`);
}

function jsonl(file) {
  return fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function equalJson(left, right) {
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return left === right;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return JSON.stringify(leftKeys) === JSON.stringify(rightKeys)
    && leftKeys.every((key) => left[key] === right[key]);
}

function profileFor(manifest, manifestSha256) {
  return [ACCEPTED_PROFILE, SUCCESSOR_PROFILE].find((profile) => (
    manifestSha256 === profile.productManifestSha256
    && manifest.logical_sha256 === profile.logicalSha256
  )) || null;
}

function verifyPrimaryRow(product, profile) {
  const ledgerFile = path.join(product, 'full-rom-primary-ledger.jsonl');
  const row = jsonl(ledgerFile).find((candidate) => candidate.index === 585);
  if (!row || row.index !== 585 || row.id !== SUCCESSOR_ROW.id) fail('row 585 identity drift');
  const expectedClass = profile === SUCCESSOR_PROFILE ? SUCCESSOR_ROW.primary_class : ACCEPTED_ROW_CLASS;
  if (row.primary_class !== expectedClass) fail(`row 585 primary_class drift for ${profile.name}`);
  if (profile === SUCCESSOR_PROFILE) {
    for (const field of ['rom_start', 'rom_end_exclusive', 'bytes', 'owner_path', 'owner_sha256', 'source_form', 'owner_kind', 'ambiguous', 'source_manifest_index']) {
      if (row[field] !== SUCCESSOR_ROW[field]) fail(`successor row 585 preserved field drift: ${field}`);
    }
  }
  return row;
}

function verifyPhase5aProduct(product) {
  const manifestFile = path.join(product, 'verification', 'product-manifest.json');
  if (!fs.existsSync(manifestFile)) fail(`missing manifest: ${manifestFile}`);
  const manifestSha256 = sha256(manifestFile);
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  if (manifest.schema_version !== 1 || manifest.self_excluding !== true || manifest.file_count !== EXPECTED_FILES.length || !Array.isArray(manifest.files) || manifest.files.length !== EXPECTED_FILES.length) {
    fail('manifest schema or file count drift');
  }
  const paths = manifest.files.map((row) => row && row.path);
  if (new Set(paths).size !== paths.length) fail('duplicate manifest path');
  if (JSON.stringify(paths) !== JSON.stringify(EXPECTED_FILES)) fail('manifest path set or order drift');
  const material = manifest.files.map((row) => `${row.path}|${row.bytes}|${row.sha256}`).join('\n');
  const logical = crypto.createHash('sha256').update(material).digest('hex').toUpperCase();
  const profile = profileFor(manifest, manifestSha256);
  if (!profile || logical !== profile.logicalSha256) fail(`unrecognized product identity: ${logical}`);
  if (manifest.logical_sha256 !== logical) fail(`manifest logical SHA-256 drift: ${logical}`);

  for (const [index, row] of manifest.files.entries()) {
    const expected = profile.files[index];
    if (!row || !Number.isInteger(row.bytes) || row.bytes < 0 || !/^[0-9A-F]{64}$/.test(row.sha256)) fail(`invalid manifest row: ${row && row.path}`);
    if (!equalJson(row, expected)) fail(`manifest declared row differs from ${profile.name}: ${row.path}`);
    if (path.isAbsolute(row.path) || row.path.includes('..') || row.path.includes('\\')) fail(`unsafe manifest path: ${row.path}`);
    const file = path.join(product, row.path);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail(`missing declared file: ${row.path}`);
    if (fs.statSync(file).size !== row.bytes) fail(`byte count drift: ${row.path}`);
    if (sha256(file) !== row.sha256) fail(`SHA-256 drift: ${row.path}`);
  }
  if (sha256(path.join(product, 'full-rom-primary-ledger.jsonl')) !== profile.primaryLedgerSha256) fail(`primary ledger identity drift for ${profile.name}`);
  const row585 = verifyPrimaryRow(product, profile);
  return {
    profile: profile.name,
    logicalSha256: logical,
    productManifestSha256: manifestSha256,
    primaryLedgerSha256: profile.primaryLedgerSha256,
    fileCount: manifest.files.length,
    files: manifest.files,
    row585,
  };
}

module.exports = {
  EXPECTED_FILES,
  EXPECTED_PROFILES,
  SUCCESSOR_ROW,
  verifyPhase5aProduct,
  sha256,
};
