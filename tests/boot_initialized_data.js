'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const boot = require('../tools/lib/boot_initialized_data');
const { assembleWordAsmText } = require('../tools/lib/word_asm');
const { ROOT, loadAcceptedModel, sha256Buffer } = require('../tools/lib/phase7_conventional');

function runTests(model = loadAcceptedModel()) {
  const proof = model.bootInitializedDataProof;
  assert.deepStrictEqual(proof, { romStart: 0x1000, romEndExclusive: 0x101000,
    vramStart: 0x80070C00, vramEndExclusive: 0x80170C00, delta: 0x8006FC00,
    clearStart: 0x800AEDB0, clearEndExclusive: 0x800E9C20, preservedRomEndExclusive: 0x3F1B0 });
  const headerPath = 'data/source-owners/rev0/raw_header/0000_raw_header_00000000_00001000.srcbin';
  const header = fs.readFileSync(path.join(ROOT, headerPath));
  const source = fs.readFileSync(path.join(ROOT, 'asm/original/rev0/boot/boot_entry_clear_bss.s'), 'utf8');
  const clear = assembleWordAsmText(source).bytes;
  assert.deepStrictEqual(boot.authenticateSources(model.config, model.assemblyManifest, header, Buffer.from(source)), proof);
  assert.deepStrictEqual(boot.recognizeOriginalBytes(header, clear), proof);
  // Disassembly comments are not the emitted-word authority.
  assert.deepStrictEqual(boot.recognizeOriginalBytes(header,
    assembleWordAsmText(source.replace(/#.*$/gm, '# deliberately unrelated')).bytes), proof);
  let rejected = 0;
  const rejects = action => { assert.throws(action); rejected++; };
  for (const offset of [8, 0x4F0, 0x508, 0x590, 0x76C]) {
    const changed = Buffer.from(header); changed[offset + 3] ^= 4;
    rejects(() => boot.authenticateSources(model.config, model.assemblyManifest, changed, Buffer.from(source)));
  }
  rejects(() => boot.authenticateSources(model.config, model.assemblyManifest, header,
    Buffer.from(source.replace('.word 0x2508EDB0', '.word 0x2508EDB4'))));
  for (const offset of [0x4C4, 0x4D8, 0x4E8, 0x4F0, 0x500, 0x504, 0x508, 0x510, 0x58C, 0x590, 0x76C]) {
    const changed = Buffer.from(header); changed[offset + 3] ^= 4;
    rejects(() => boot.recognizeOriginalBytes(changed, clear));
  }
  for (const offset of [0, 4, 8, 12, 16, 24, 28, 32, 36]) {
    const changed = Buffer.from(clear); changed[offset + 3] ^= 4;
    rejects(() => boot.recognizeOriginalBytes(header, changed));
  }
  const changedConfig = structuredClone(model.config);
  delete changedConfig.acceptedInputSha256[headerPath];
  rejects(() => boot.loadProof(ROOT, changedConfig, model.assemblyManifest));
  changedConfig.acceptedInputSha256[headerPath] = '0'.repeat(64);
  rejects(() => boot.loadProof(ROOT, changedConfig, model.assemblyManifest));
  const changedManifest = structuredClone(model.assemblyManifest);
  changedManifest.chunks.flatMap(c => c.parts).find(p => p.file.endsWith('/boot_entry_clear_bss.s')).sha256 = '0'.repeat(64);
  rejects(() => boot.loadProof(ROOT, model.config, changedManifest));
  const validate = () => boot.validateSlabs(model.config, model.nonDescriptorLoadSlabs,
    model.overlays, model.rows, proof);
  const slab = model.nonDescriptorLoadSlabs.find(s => s.kind === 'boot-initialized-data');
  const row = model.rows[789], slice = row.slices[0];
  validate();
  // The identical object passes, then rejects only the named invalid mutation,
  // then passes again after restoration. This prevents broken fixtures from
  // giving vacuous negative coverage.
  function mutation(object, key, value, action = validate) {
    action(); const previous = object[key]; object[key] = value;
    try { rejects(action); } finally { object[key] = previous; }
    action();
  }
  mutation(model.config.rom, 'earlyBootLinearBase', proof.delta + 4);
  mutation(model.config.rom, 'earlyBootLinearEndExclusive', 0x3F1B0);
  mutation(slab, 'vramStart', slab.vramStart + 4);
  mutation(slab, 'romStart', slab.romStart + 4);
  mutation(slab, 'romStart', Number.MAX_SAFE_INTEGER);
  mutation(slab, 'executableRanges', [{ id: 'bad', romStart: slab.romStart, romEndExclusive: slab.romEndExclusive }]);
  mutation(slab, 'nonExecutableRanges', [{ id: 'bad', romStart: slab.romStart, romEndExclusive: slab.romEndExclusive }]);
  mutation(row, 'primaryClass', 'code');
  mutation(row, 'inputKind', 'splat-data');
  mutation(slice, 'executable', true);
  mutation(row, 'romEndExclusive', row.romEndExclusive - 4);
  mutation(row, 'part', null);
  mutation(slab, 'kind', 'loader-dma');
  const oldBound = model.config.rom.bootInitializedDataRomEndExclusive;
  model.config.rom.bootInitializedDataRomEndExclusive += 4;
  slab.romEndExclusive += 4; slab.vramEndExclusive += 4;
  try { rejects(validate); } finally {
    model.config.rom.bootInitializedDataRomEndExclusive = oldBound;
    slab.romEndExclusive -= 4; slab.vramEndExclusive -= 4;
  }
  validate();
  for (const conflict of [
    { id: 'rom-conflict', romStart: slab.romStart, romEndExclusive: slab.romEndExclusive, vramStart: 0x81000000, vramEndExclusive: 0x81001000 },
    { id: 'ram-conflict', romStart: 0x400000, romEndExclusive: 0x401000, vramStart: slab.vramStart, vramEndExclusive: slab.vramEndExclusive },
  ]) {
    model.nonDescriptorLoadSlabs.push(conflict);
    try { rejects(validate); } finally { model.nonDescriptorLoadSlabs.pop(); }
    model.overlays.push({ rom_start: conflict.romStart, rom_end_exclusive: conflict.romEndExclusive,
      vram_start: conflict.vramStart, vram_end_exclusive: conflict.vramEndExclusive });
    try { rejects(validate); } finally { model.overlays.pop(); }
    validate();
  }
  rejects(() => boot.validateSlabs(model.config, model.nonDescriptorLoadSlabs, model.overlays, model.rows, { ...proof }));

  assert.strictEqual(row.part.hasOwnerLabel, false);
  assert.deepStrictEqual([slice.sectionName, slice.romStart, slice.romEndExclusive, slice.vramStart,
    slice.vramEndExclusive, slice.bytes, slice.executable, slice.placementKind, slice.loadSlabId],
  ['.ob64.r0789', 0x3DDC0, 0x3F1B0, 0x800AD9C0, 0x800AEDB0, 5104, false,
    'non-descriptor-load-slab', 'boot-initialized-data-0003ddc0']);
  // Frozen E02 authority: commit09bb1810 conventional-build.json SHA4484916D;
  // accepted layout SHA16A712E0 (full identities/derivation in isolation handoff).
  const e02Cuts = [
    {
      "id": "registered-row4522-terminal",
      "rowIndex": 4522,
      "romStart": 2450440,
      "romEndExclusive": 2450448,
      "edge": "terminal",
      "sourceSha256": "AB49E1A8AF39F6E1FD54D63E9B7182A1A2751CAD9F6B5536B39F610746B738CC",
      "expectedSha256": "AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC",
      "compilerFunctions": [
        {
          "symbol": "func_0025630C",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row4646-terminal",
      "rowIndex": 4646,
      "romStart": 2491420,
      "romEndExclusive": 2491424,
      "edge": "terminal",
      "sourceSha256": "408C79CD395E7366BE7482360D8E2AD5C4291C3BE909A4F166D036D412A637CB",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_002603EC",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row4656-terminal",
      "rowIndex": 4656,
      "romStart": 2493848,
      "romEndExclusive": 2493856,
      "edge": "terminal",
      "sourceSha256": "8DFEE405B38D4841DD345FB75016C4B9387A1ACD1DE012B7D503A7A7194BCB4C",
      "expectedSha256": "AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC",
      "compilerFunctions": [
        {
          "symbol": "func_00260CE0",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row4673-terminal",
      "rowIndex": 4673,
      "romStart": 2497668,
      "romEndExclusive": 2497680,
      "edge": "terminal",
      "sourceSha256": "FB60A503D6E24A28BAA2E61BDC1460BD7BE3A3FF7EEB58D741DE7866C5564FC4",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_00261BD4",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row4723-terminal",
      "rowIndex": 4723,
      "romStart": 2504332,
      "romEndExclusive": 2504336,
      "edge": "terminal",
      "sourceSha256": "04292A1F0D3F737139CC5EE7AD1399ED07129F17639E7773FDF0A3FC6B15B9AF",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_00263400",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row4727-terminal",
      "rowIndex": 4727,
      "romStart": 2504908,
      "romEndExclusive": 2504912,
      "edge": "terminal",
      "sourceSha256": "37762FB1B2D79675D37000B61973BF79CC1C9707408C07BCE75B5C757AF483FC",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_002637DC",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    }
  ];
  // Accepted after the frozen E02 fixture: P02 3b63bb3c (four cuts),
  // E04 e86969ed (two), P04 76b2ce11 (one). Exact source/ROM identities below
  // come from those commits; none of the frozen predecessor hashes is replaced.
  const successorCuts = [
    {
      "id": "registered-row4867-terminal",
      "rowIndex": 4867,
      "romStart": 2545516,
      "romEndExclusive": 2545520,
      "edge": "terminal",
      "sourceSha256": "B01B289F6A12D6346AE818DA428F40FF51E9A8EF30B8D324CDDB9E21D9E9684F",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_0026d714",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row4878-terminal",
      "rowIndex": 4878,
      "romStart": 2552276,
      "romEndExclusive": 2552288,
      "edge": "terminal",
      "sourceSha256": "53644A158567B59F6148E2936101750E4414028D6951463FDD4CBD813FABCC15",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_0026F12C",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row4899-terminal",
      "rowIndex": 4899,
      "romStart": 2563620,
      "romEndExclusive": 2563632,
      "edge": "terminal",
      "sourceSha256": "CAFBFA88F153010D104056271A39E5A78E57F4A8AD7A037B230589D488D4EA6D",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_00271DBC",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row4904-terminal",
      "rowIndex": 4904,
      "romStart": 2566020,
      "romEndExclusive": 2566032,
      "edge": "terminal",
      "sourceSha256": "2B61D69032136A8C1861BBB6AE81C5461F28DE9E42D143ACD243299A428CEB49",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_0027271C",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row4629-terminal",
      "rowIndex": 4629,
      "romStart": 2488296,
      "romEndExclusive": 2488304,
      "edge": "terminal",
      "sourceSha256": "C8435FDA518E9EDE98310FF2E214DF323DBACA276C1C3EDCBEE8988D9A37C615",
      "expectedSha256": "AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC",
      "compilerFunctions": [
        {
          "symbol": "func_0025F7C8",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row4861-terminal",
      "rowIndex": 4861,
      "romStart": 2542824,
      "romEndExclusive": 2542832,
      "edge": "terminal",
      "sourceSha256": "F07C2AFF69E8F1B4DF659BE1F80B01E11E2C5F645EDFB0424D562A348A726E35",
      "expectedSha256": "AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC",
      "compilerFunctions": [
        {
          "symbol": "func_0026CCB4",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4956-terminal",
      "rowIndex": 4956,
      "romStart": 2584536,
      "romEndExclusive": 2584544,
      "edge": "terminal",
      "sourceSha256": "E52D0EE3A9BDBC14540AC337E081BD9053ED0BB3F729DBAC1CF6BF8A38C7AE78",
      "expectedSha256": "AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC",
      "compilerFunctions": [
        {
          "symbol": "func_00276e48",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    }
  ];
  // The earlier eight cuts and the nine newer successors are explicit fixtures,
  // not a census copied from the current model. Their sources are authenticated
  // below against pinned input rows and the complete canonical ROM owners.
  const earlierCuts = [
    {
      "id": "registered-row58-terminal",
      "rowIndex": 58,
      "romStart": 26840,
      "romEndExclusive": 26848,
      "edge": "terminal",
      "sourceSha256": "59C9C72EF37287D5B2814AF55636FB803B1041342A2A006EBF8EA38F2E1FF33D",
      "expectedSha256": "AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC",
      "compilerFunctions": [
        {
          "symbol": "func_000065E4",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        },
        {
          "symbol": "func_00006724",
          "binding": "LOCAL",
          "entryEvidence": "fixed-address-call"
        },
        {
          "symbol": "func_00006830",
          "binding": "LOCAL",
          "entryEvidence": "internal-call-only"
        }
      ]
    },
    {
      "id": "registered-row2351-leading",
      "rowIndex": 2351,
      "romStart": 1182652,
      "romEndExclusive": 1182656,
      "edge": "leading",
      "sourceSha256": "ABB7CD02C14D08061E2CC6D3E9FFBF87B6BD328D2B569EDADCAB1C63F3210660",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_00120BC0",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row2327-terminal",
      "rowIndex": 2327,
      "romStart": 1160228,
      "romEndExclusive": 1160240,
      "edge": "terminal",
      "sourceSha256": "49D476B0505B845A4CD7535B0884AD3706C81C724BB73B8C69CE4FD1E658D49C",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_0011B344",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row2287-terminal",
      "rowIndex": 2287,
      "romStart": 1114460,
      "romEndExclusive": 1114464,
      "edge": "terminal",
      "sourceSha256": "0E9F377D78A56ED7844EE98998A5C17A1818A3F9EE0C74BA1998F1BF415F0E65",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_0010DDB4",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "library-l1-row554-terminal",
      "rowIndex": 554,
      "romStart": 145812,
      "romEndExclusive": 145824,
      "edge": "terminal",
      "sourceSha256": "B07EBA870ACDCD8C6EFC72CC07891650030E51635B8998A70A1BCE861237FC1E",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_00023970",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "library-l1-row555-terminal",
      "rowIndex": 555,
      "romStart": 146132,
      "romEndExclusive": 146144,
      "edge": "terminal",
      "sourceSha256": "BE597DCC88FB9B182EB597F83CB15317EF8E614AF9893AA9B9AF12E8EF9554CB",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "osJamMesg",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "library-l1-row556-terminal",
      "rowIndex": 556,
      "romStart": 146436,
      "romEndExclusive": 146448,
      "edge": "terminal",
      "sourceSha256": "7A0348D3C787FF3F5B8EF6772CC9143D54BBC0BECC44A4007716D877ACC7B029",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "osRecvMesg",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "registered-row581-terminal",
      "rowIndex": 581,
      "romStart": 150856,
      "romEndExclusive": 150864,
      "edge": "terminal",
      "sourceSha256": "55952F60D9717D30387C99850FFE5B29116E590C607EB1AC68AF0B1D80BC08DA",
      "expectedSha256": "AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC",
      "compilerFunctions": [
        {
          "symbol": "func_00024C60",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        },
        {
          "symbol": "func_00024D30",
          "binding": "LOCAL",
          "entryEvidence": "fixed-address-call"
        }
      ]
    }
  ];
  const newSuccessorCuts = [
    {
      "id": "routine-row4461-terminal",
      "rowIndex": 4461,
      "romStart": 2419308,
      "romEndExclusive": 2419312,
      "edge": "terminal",
      "sourceSha256": "FA3E27AEE0D00CD8808356B2AAF1E72F0DF4D6FF452E3398548B11856DA73566",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_0024E9BC",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4490-terminal",
      "rowIndex": 4490,
      "romStart": 2433756,
      "romEndExclusive": 2433760,
      "edge": "terminal",
      "sourceSha256": "0015705F948B906636A327E043717806933B9BCC57090DDFA78859AC34F900F2",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_00252198",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4547-terminal",
      "rowIndex": 4547,
      "romStart": 2465960,
      "romEndExclusive": 2465968,
      "edge": "terminal",
      "sourceSha256": "B7259769575F01AE2643364942F2099FD3502F73AA764657890AC072DF9ECE47",
      "expectedSha256": "AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC",
      "compilerFunctions": [
        {
          "symbol": "func_00259FD4",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4585-terminal",
      "rowIndex": 4585,
      "romStart": 2477488,
      "romEndExclusive": 2477492,
      "edge": "terminal",
      "sourceSha256": "C79D101FCCA039ACD55BBE8B4AFECEBBB7A5E3A0212E1F2D07983EBAB7FFAAD7",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_0025CD38",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4815-terminal",
      "rowIndex": 4815,
      "romStart": 2531060,
      "romEndExclusive": 2531072,
      "edge": "terminal",
      "sourceSha256": "AB08704EB9CEBED5F1026416FBECCFD0818B6656BACCEB973F51C553EA986F25",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_00269E38",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4833-terminal",
      "rowIndex": 4833,
      "romStart": 2536284,
      "romEndExclusive": 2536288,
      "edge": "terminal",
      "sourceSha256": "8C5C56C204A9DF8C2149E954AAAFA32C1A02D041F0201850D92904A6C741D6B9",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_0026B32C",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4835-terminal",
      "rowIndex": 4835,
      "romStart": 2537492,
      "romEndExclusive": 2537504,
      "edge": "terminal",
      "sourceSha256": "C8A4BD63107F978B7C3C96C7FC2EC1A8C04B4C22ADB608E13BF56CA5DF1BE039",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_0026B7E4",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4839-terminal",
      "rowIndex": 4839,
      "romStart": 2539052,
      "romEndExclusive": 2539056,
      "edge": "terminal",
      "sourceSha256": "93C1870D276ECC4258156CD657DDD646C5DE34A7AC1DF5A165D153C31AFF1BCE",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_0026BDFC",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "e07-c09c-terminal",
      "rowIndex": 4845,
      "romStart": 2540008,
      "romEndExclusive": 2540016,
      "edge": "terminal",
      "sourceSha256": "148BAEF0E0C4CB3C0B86E5229AF909394F3D3B52AAB83015549F1CF6C05EDFDA",
      "expectedSha256": "AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC",
      "compilerFunctions": [
        {
          "symbol": "func_0026C09C",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    }
  ];
  // E09 admitted these original four-byte terminal suffixes after the prior fixture set.
  const e09SuccessorCuts = [
    {
      "id": "routine-row4595-terminal",
      "rowIndex": 4595,
      "romStart": 2481224,
      "romEndExclusive": 2481228,
      "edge": "terminal",
      "sourceSha256": "52ECF3EBC4C19E0933174F1682A24B528F21C0D723E16757236B240CA42A9487",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_0025DB50",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4596-terminal",
      "rowIndex": 4596,
      "romStart": 2481548,
      "romEndExclusive": 2481552,
      "edge": "terminal",
      "sourceSha256": "601D4B78FC006F531C6B7D773622F743CF885C142E2E8FD17C24D10B175267C2",
      "expectedSha256": "DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119",
      "compilerFunctions": [
        {
          "symbol": "func_0025DC4C",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    }
  ];
  // Independently authenticated E03/E05/E06/P06 terminal owners; literal fixtures
  // retain the exact full-census and source/ROM checks below.
  const acceptedWaveCuts = [
    {
      "id": "routine-row4691-terminal",
      "rowIndex": 4691,
      "romStart": 2499652,
      "romEndExclusive": 2499664,
      "edge": "terminal",
      "sourceSha256": "60AC9BE558189B28F997E5F9FB6C7BB83AC14951BA1362EE6EADE9607D6B5EFA",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_00262434",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4712-terminal",
      "rowIndex": 4712,
      "romStart": 2501812,
      "romEndExclusive": 2501824,
      "edge": "terminal",
      "sourceSha256": "8A7A0B6C0EF1FB32C92313B45BD19EED723AE19F067A65B8ACCA1C75F07DE305",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_00262C94",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4741-terminal",
      "rowIndex": 4741,
      "romStart": 2510772,
      "romEndExclusive": 2510784,
      "edge": "terminal",
      "sourceSha256": "BB20124E907A9B55F400C4C236FD836CD670B30EBD9F9FED59B1A6E095E20078",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_00264f58",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4752-terminal",
      "rowIndex": 4752,
      "romStart": 2516132,
      "romEndExclusive": 2516144,
      "edge": "terminal",
      "sourceSha256": "12D785CBE10E653531EA553D53204AC98C8C5A45C8BD73A73A523FFCEB445CCD",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_00266484",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4764-terminal",
      "rowIndex": 4764,
      "romStart": 2520036,
      "romEndExclusive": 2520048,
      "edge": "terminal",
      "sourceSha256": "7947884C3502B0C0CE4508D56FE37B012FBDCB61546EB633752937E7E67AF1BD",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_002673C4",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4768-terminal",
      "rowIndex": 4768,
      "romStart": 2520900,
      "romEndExclusive": 2520912,
      "edge": "terminal",
      "sourceSha256": "A6B985419C2980F99DDA7D219F0D32B6A278507EB3BF0945F601D39DA882FEE4",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_00267668",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4800-terminal",
      "rowIndex": 4800,
      "romStart": 2528356,
      "romEndExclusive": 2528368,
      "edge": "terminal",
      "sourceSha256": "6CE4DFD46067285FD518A266655CB925CB7D76E8687D67C23F2B323280104974",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_002693C4",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4966-terminal",
      "rowIndex": 4966,
      "romStart": 2588548,
      "romEndExclusive": 2588560,
      "edge": "terminal",
      "sourceSha256": "E40494FB6A65A87EC51AE5E8DA9A07EB491B10E89C443B64DECF7E59969A87FF",
      "expectedSha256": "15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B",
      "compilerFunctions": [
        {
          "symbol": "func_00277EBC",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    },
    {
      "id": "routine-row4971-terminal",
      "rowIndex": 4971,
      "romStart": 2592696,
      "romEndExclusive": 2592704,
      "edge": "terminal",
      "sourceSha256": "4DC912800B9E4572CF30A1639B5EF3464888858D925FB8E2C4DE082737D98968",
      "expectedSha256": "AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC",
      "compilerFunctions": [
        {
          "symbol": "func_00278D5C",
          "binding": "GLOBAL",
          "entryEvidence": "owner"
        }
      ]
    }
  ];
  const testedCuts = [...e02Cuts, ...successorCuts, ...newSuccessorCuts, ...e09SuccessorCuts, ...acceptedWaveCuts];
  const allCutFixtures = [...earlierCuts, ...testedCuts];
  const independentConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/phase7/conventional-build.json')));
  const pinnedInput = relative => {
    const bytes = fs.readFileSync(path.join(ROOT, relative));
    assert.strictEqual(sha256Buffer(bytes), independentConfig.acceptedInputSha256[relative], relative);
    return JSON.parse(bytes);
  };
  const semantic = pinnedInput('config/splat/us_rev0.semantic.json');
  const linker = pinnedInput('config/splat/us_rev0.overlay-linker-inputs.json');
  const originalManifest = pinnedInput('asm/original/rev0/manifest.json');
  const canonicalRom = fs.readFileSync(path.join(ROOT, 'build/baserom.us_rev0.z64'));
  assert.strictEqual(canonicalRom.length, 41943040);
  assert.strictEqual(sha256Buffer(canonicalRom), '571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A');
  const boundaries = new Set();
  for (const overlay of linker.overlayReservations) {
    for (const field of ['rom_start', 'text_rom_end_exclusive', 'data_rodata_rom_end_exclusive', 'rom_end_exclusive']) {
      boundaries.add(overlay[field]);
    }
  }
  for (const slab of independentConfig.nonDescriptorLoadSlabs) {
    for (const range of [slab, ...(slab.executableRanges || []), ...(slab.nonExecutableRanges || [])]) {
      boundaries.add(range.romStart); boundaries.add(range.romEndExclusive);
    }
  }
  for (const range of independentConfig.fixedOverlayNonExecutableRanges) {
    boundaries.add(range.romStart); boundaries.add(range.romEndExclusive);
  }
  const interiorBoundaries = owner => [...boundaries].filter(value => value > owner.romStart && value < owner.romEndExclusive);
  const geometryRows = semantic.rows.filter(owner => interiorBoundaries(owner).length).map(owner => owner.index);
  const geometrySliceCount = semantic.rows.length + semantic.rows.reduce((count, owner) => count + interiorBoundaries(owner).length, 0);
  const originalParts = originalManifest.chunks.flatMap(chunk => chunk.parts);
  const fixtureSources = new Map();
  function authenticateFixtureSource(cut, original, owner) {
    assert.strictEqual(sha256Buffer(original), cut.sourceSha256);
    const words = assembleWordAsmText(original.toString('utf8')).bytes;
    assert.strictEqual(words.length, owner.bytes);
    assert(words.equals(canonicalRom.subarray(owner.romStart, owner.romEndExclusive)), 'whole original owner bytes');
    const kept = words.subarray(cut.romStart - owner.romStart, cut.romEndExclusive - owner.romStart);
    assert.strictEqual(kept.length, cut.romEndExclusive - cut.romStart);
    assert(kept.every(byte => byte === 0), 'retained edge is zero');
    assert.strictEqual(sha256Buffer(kept), cut.expectedSha256);
  }
  for (const cut of allCutFixtures) {
    const owner = semantic.rows[cut.rowIndex];
    const matches = originalParts.filter(part => Number(part.romStart) === owner.romStart
      && Number(part.romEndExclusive) === owner.romEndExclusive);
    assert.strictEqual(matches.length, 1, 'unique independently pinned original owner');
    const part = matches[0], original = fs.readFileSync(path.join(ROOT, part.file));
    assert.strictEqual(part.sha256, cut.sourceSha256);
    assert.strictEqual(part.textBytes, original.length);
    authenticateFixtureSource(cut, original, owner);
    fixtureSources.set(cut.rowIndex, { owner, part, original });
  }
  function checkCuts(fixtures = allCutFixtures) {
    const allCutRows = fixtures.map(cut => cut.rowIndex).sort((a, b) => a - b);
    assert.strictEqual(new Set(allCutRows).size, fixtures.length, 'unique fixture row');
    assert.strictEqual(new Set(fixtures.map(cut => cut.id)).size, fixtures.length, 'unique fixture ID');
    assert.deepStrictEqual(allCutRows.filter(index => geometryRows.includes(index)), [], 'geometry/cut sets disjoint');
    const splitRows = [...geometryRows, ...allCutRows].sort((a, b) => a - b);
    assert.deepStrictEqual(model.rows.filter(owner => owner.slices.length > 1).map(owner => owner.index), splitRows);
    assert.strictEqual(independentConfig.expected.splitOwners, splitRows.length);
    assert.strictEqual(model.config.expected.splitOwners, splitRows.length);
    assert.deepStrictEqual(model.counts, { assemblyOwners: 6184, dataOwners: 1058, splitOwners: splitRows.length,
      rspRows: 13, fixedOverlayNonExecutableRanges: 4, nonDescriptorLoadSlabs: 30 });
    const expectedSlices = geometrySliceCount + fixtures.length;
    assert.strictEqual(model.config.expected.linkSlices, expectedSlices);
    assert.strictEqual(independentConfig.expected.linkSlices, expectedSlices);
    assert.strictEqual(model.slices.length, expectedSlices);
    assert.deepStrictEqual(model.slices, model.rows.flatMap(owner => owner.slices));
    for (const [ordinal, part] of model.slices.entries()) {
      assert.strictEqual(part.ordinal, ordinal);
      assert.strictEqual(part.phdrName, 'p' + String(ordinal).padStart(5, '0'));
    }
    assert.deepStrictEqual(model.rows.filter(owner => owner.retainedPadding).map(owner => owner.index), allCutRows);
    assert.strictEqual(model.config.retainedPaddingCuts.length, fixtures.length);
    assert.strictEqual(model.config.expected.retainedPaddingCuts, fixtures.length);
    assert.strictEqual(independentConfig.expected.retainedPaddingCuts, fixtures.length);
    for (const cut of fixtures) {
      const owner = model.rows[cut.rowIndex], evidence = fixtureSources.get(cut.rowIndex);
      const configured = model.config.retainedPaddingCuts.filter(item => item.rowIndex === cut.rowIndex);
      assert.strictEqual(configured.length, 1, 'unique configured cut');
      assert.deepStrictEqual(configured[0], cut);
      assert.deepStrictEqual(owner.retainedPadding, cut);
      assert.strictEqual(owner.romStart, evidence.owner.romStart);
      assert.strictEqual(owner.romEndExclusive, evidence.owner.romEndExclusive);
      assert.strictEqual(owner.bytes, evidence.owner.bytes);
      assert.strictEqual(owner.part.file, evidence.part.file);
      assert.strictEqual(owner.part.sha256, cut.sourceSha256);
      const leading = cut.edge === 'leading';
      const body = owner.slices[leading ? 1 : 0], padding = owner.slices[leading ? 0 : 1];
      const bodyStart = leading ? cut.romEndExclusive : owner.romStart;
      const bodyEnd = leading ? owner.romEndExclusive : cut.romStart;
      assert.strictEqual(leading ? cut.romStart : cut.romEndExclusive, leading ? owner.romStart : owner.romEndExclusive);
      assert(bodyEnd > bodyStart);
      assert.strictEqual(body.romStart, bodyStart);
      assert.strictEqual(body.romEndExclusive, bodyEnd);
      assert.strictEqual(body.bytes, bodyEnd - bodyStart);
      assert.strictEqual(body.vramEndExclusive - body.vramStart, body.bytes);
      const delta = body.vramStart - body.romStart;
      assert.deepStrictEqual(padding, { ...body,
        ordinal: body.ordinal + (leading ? -1 : 1), sliceIndex: leading ? 0 : 1,
        sectionName: '.ob64.r' + String(owner.index).padStart(4, '0') + (leading ? '.s0' : '.s1'),
        phdrName: 'p' + String(body.ordinal + (leading ? -1 : 1)).padStart(5, '0'),
        romStart: cut.romStart, romEndExclusive: cut.romEndExclusive, bytes: cut.romEndExclusive - cut.romStart,
        vramStart: cut.romStart + delta, vramEndExclusive: cut.romEndExclusive + delta,
        retainedPaddingId: cut.id });
      assert.strictEqual(body.sectionName, '.ob64.r' + String(owner.index).padStart(4, '0') + (leading ? '.s1' : '.s0'));
      assert.strictEqual(body.sliceIndex, leading ? 1 : 0);
      assert.strictEqual(body.sliceCount, 2);
      assert.strictEqual(owner.slices.length, 2);
      assert.strictEqual(owner.slices.reduce((bytes, part) => bytes + part.bytes, 0), owner.bytes);
      assert.strictEqual(owner.slices.filter(part => part.retainedPaddingId).length, 1);
      assert(owner.slices.every(part => part.executable && part.nonExecutableRangeId === null));
    }
  }
  checkCuts();
  // L1 adds rows554/555/556 terminal12-byte cuts; row581 adds an eight-byte cut.
  // Physical owners are unchanged; each added cut contributes one slice and ordinal/phdr shifts.
  // Preserve every physical row, other slice (including743/790), reservation and29 slabs.
  const digest = value => sha256Buffer(Buffer.from(JSON.stringify(value)));
  // Exact reviewed profiles; no unknown-identity fallback.
  function checkProfile() {
    checkCuts();
    const identity = model.config.acceptedInputSha256['config/splat/us_rev0.semantic.json'];
    assert.ok([
      '6CBD65B27BD4B57E5C824D52D6F15FF98CF4616BC8BFB3F42E1BA87575A55FE1',
      'BF8C79BFDB2AB3DDBFA0B160AD14CCA9E17884813C1007D37E384DB40BBD8204',
      'B9850563A1974FF155A16F9DCBCFB4494B6572166F894A5B5057D204AF801F68',
    ].includes(identity), 'unknown boot-test semantic identity: ' + identity);
    const l4Successor = identity === 'B9850563A1974FF155A16F9DCBCFB4494B6572166F894A5B5057D204AF801F68';
    const row566Successor = model.config.acceptedInputSha256['config/splat/us_rev0.semantic.json']
      === 'BF8C79BFDB2AB3DDBFA0B160AD14CCA9E17884813C1007D37E384DB40BBD8204';
    assert.strictEqual(digest(model.rows.flatMap(owner => testedCuts.some(cut => cut.rowIndex === owner.index) ? [{
      ...owner.slices[0], sliceIndex: 0, sliceCount: 1,
      sectionName: '.ob64.r' + String(owner.index).padStart(4, '0'),
      romEndExclusive: owner.romEndExclusive, bytes: owner.bytes,
      vramEndExclusive: owner.slices.at(-1).vramEndExclusive,
    }] : owner.slices).map((part, ordinal) => ({ ...part, ordinal,
      phdrName: 'p' + String(ordinal).padStart(5, '0') })).filter(part => part.rowIndex !== 789)), l4Successor
      ? 'C87A8AB0AEE83724B56E525178E0F5B27100F837877C7A9238E99BD8953816F9' : row566Successor
      ? 'F5E4B7AB19AA0FDB97C2E013DA8CE6E6E49C3132E9C625916EBCC61C47C68D37'
      : '37F0CD984BF9D797B3665C0598458212052CEE300B249EF4CBCA57EE0962D5E5');
    // Reverse all explicitly checked reviewed derived cuts to compare every legacy slice.
    // This is a test projection, not a generated count or production-layout reset.
    const priorSlices = model.rows.flatMap(owner => owner.retainedPadding ? [{
      ...owner.slices[0], sliceIndex: 0, sliceCount: 1,
      sectionName: '.ob64.r' + String(owner.index).padStart(4, '0'),
      romEndExclusive: owner.romEndExclusive, bytes: owner.bytes,
      vramEndExclusive: owner.slices.at(-1).vramEndExclusive,
    }] : owner.slices).map(({ retainedPaddingId, ...slice }, ordinal) => ({
      ...slice, ordinal, phdrName: 'p' + String(ordinal).padStart(5, '0'),
    }));
    assert.strictEqual(digest(priorSlices.filter(slice => slice.rowIndex !== 789)),
      l4Successor ? '2EFCE6BCEC2234F5555C396AD6CE621A04659523E1B33F670BB3FB14A1D4DAA5' : row566Successor ? '6B459839D42684025BA9B9C919EFDD9480D56AD2DAAD2A49476E89E8023B9EFE'
        : '8897472E14020BB65D6CD7EBBD1716F503C2232D52F7E662D8E739605A4D873B');
    assert.strictEqual(digest(model.rows.map(({ slices, retainedPadding, ...metadata }) => metadata)), l4Successor
      ? '6915B2433009A1E6E0DDF57DB571BB9D37621A7A486985A7C9D5CC124076C385' : row566Successor
      ? 'A83A62A26E54CD29A50AAF0FE6286867CD34E5B62AE43D49CC0316C6499076C2'
      : '4F5EE5011B086824ED4256B53BCD214106AE1D38392A3029788C667383E2E315');
  }
  checkProfile();
  let profileNegativeControls = 0;
  function profileMutation(object, key, value) {
    checkProfile(); const previous = object[key]; object[key] = value;
    try { assert.throws(checkProfile); profileNegativeControls++; }
    finally { object[key] = previous; }
    checkProfile();
  }
  for (const cut of testedCuts) {
    profileMutation(model.rows[cut.rowIndex], 'retainedPadding', null);
    profileMutation(model.rows[cut.rowIndex].retainedPadding, 'romStart', cut.romStart + 4);
    profileMutation(model.rows[cut.rowIndex].slices[1], 'bytes', 0);
  }
  // Each newer successor is independently falsified; omitted fixtures cannot
  // silently lower the expected census, and source/tail hashes remain pinned.
  for (const cut of [...newSuccessorCuts, ...e09SuccessorCuts]) {
    const owner = model.rows[cut.rowIndex], evidence = fixtureSources.get(cut.rowIndex);
    profileMutation(model.config, 'retainedPaddingCuts', model.config.retainedPaddingCuts.filter(item => item.rowIndex !== cut.rowIndex));
    profileMutation(model.config, 'retainedPaddingCuts', [...model.config.retainedPaddingCuts, cut]);
    profileMutation(owner.part, 'sha256', '0'.repeat(64));
    profileMutation(owner.part, 'file', 'asm/original/rev0/lib/wrong.s');
    profileMutation(owner.retainedPadding, 'expectedSha256', '0'.repeat(64));
    profileMutation(owner.slices[0], 'romEndExclusive', cut.romStart + 4);
    profileMutation(owner.slices[1], 'vramEndExclusive', owner.slices[1].vramEndExclusive + 4);
    rejects(() => checkCuts(allCutFixtures.filter(item => item.rowIndex !== cut.rowIndex)));
    rejects(() => checkCuts([...allCutFixtures, cut]));
    const changedSource = Buffer.from(evidence.original); changedSource[0] ^= 1;
    rejects(() => authenticateFixtureSource(cut, changedSource, evidence.owner));
    rejects(() => authenticateFixtureSource({ ...cut, expectedSha256: '0'.repeat(64) }, evidence.original, evidence.owner));
  }
  profileMutation(model.config.expected, 'splitOwners', model.config.expected.splitOwners - 1);
  profileMutation(model.counts, 'splitOwners', model.counts.splitOwners - 1);
  profileMutation(model.config.expected, 'retainedPaddingCuts', model.config.expected.retainedPaddingCuts - 1);
  profileMutation(model.config, 'retainedPaddingCuts', model.config.retainedPaddingCuts.slice(1));
  profileMutation(model.config, 'retainedPaddingCuts', [...model.config.retainedPaddingCuts, e02Cuts[0]]);
  profileMutation(model.rows[1000], 'retainedPadding', e02Cuts[0]);
  profileMutation(model.rows[4522].slices[0], 'ordinal', 0);
  profileMutation(model.rows[1000].slices[0], 'phdrName', 'wrong');
  const identityKey = 'config/splat/us_rev0.semantic.json';
  for (const identity of ['0'.repeat(64),
    '6CBD65B27BD4B57E5C824D52D6F15FF98CF4616BC8BFB3F42E1BA87575A55FE1',
    'BF8C79BFDB2AB3DDBFA0B160AD14CCA9E17884813C1007D37E384DB40BBD8204',
    'B9850563A1974FF155A16F9DCBCFB4494B6572166F894A5B5057D204AF801F68']) {
    if (identity !== model.config.acceptedInputSha256[identityKey])
      profileMutation(model.config.acceptedInputSha256, identityKey, identity);
  }
  for (const index of [476, 496, 497]) {
    const owner = model.rows[index], part = owner.slices[0];
    const successor = owner.primaryClass === 'code';
    profileMutation(owner, 'primaryClass', successor ? 'data' : 'code');
    profileMutation(owner, 'name', owner.name.replace(successor ? '_code_' : '_data_', successor ? '_data_' : '_code_'));
    profileMutation(part, 'executable', !part.executable);
    profileMutation(part, 'ownerName', part.ownerName.replace(successor ? '_code_' : '_data_', successor ? '_data_' : '_code_'));
  }
  profileMutation(model.rows[476], 'processorClass', 'unexpected');
  profileMutation(model.rows[476].slices[0], 'vramStart', model.rows[476].slices[0].vramStart + 4);
  for (const index of [475, 477, 495, 498, 1000])
    profileMutation(model.rows[index], 'primaryClass', 'unexpected');
  assert.strictEqual(digest(model.overlays), 'C699993FF5DB3D8A075BC2EBC22DEBA4FDDD9B8E6F7E257960DFD37E92BAD016');
  assert.strictEqual(digest(model.nonDescriptorLoadSlabs.slice(0, 29)), 'DD0C8A896DCBB5DEFEBF6463700FB79715479E74F9F9A599F9FE82C2AAF52695');
  return { originalByteAndMappingNegativeControls: rejected, profileNegativeControls };
}

function runAuxiliaryTests(model = loadAcceptedModel()) {
  const { normalizeAuxiliarySectionContracts, resolveAuxiliarySectionContracts } = require('../tools/lib/active_targets');
  const row = model.rows[789], slice = row.slices[0];
  const textRow = model.rows.find(r => r.part && r.part.file.endsWith('/boot_resource_tag_record_decode.s'));
  assert.ok(textRow, 'original decoder owner is missing');
  const text = textRow.slices[0];
  const target = { symbol: textRow.part.name, bytes: text.bytes, sectionName: text.sectionName,
    vramStartNumber: text.vramStart, row: textRow };
  // No native compilation or target activation. Original emitted words provide
  // an authentic table and original fallback for the admission/relocation test.
  const rom = Buffer.alloc(row.romEndExclusive);
  const original = assembleWordAsmText(fs.readFileSync(path.join(ROOT, row.part.file), 'utf8')).bytes;
  assert.strictEqual(original.length, row.bytes);
  original.copy(rom, row.romStart);
  const hex = n => `0x${n.toString(16).toUpperCase().padStart(8, '0')}`;
  const retained = (kind, start, end) => ({ inputSection: `${slice.sectionName}.${kind}`,
    sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 1,
    romStart: hex(start), romEndExclusive: hex(end), vramStart: hex(start + 0x8006FC00),
    vramEndExclusive: hex(end + 0x8006FC00), bytes: end - start,
    expectedSha256: sha256Buffer(rom.subarray(start, end)), ownerOriginalAssembly: row.part.file,
    ownerOriginalAssemblySha256: row.part.sha256 });
  const start = 0x3E528, end = 0x3E67C, object = Buffer.alloc(end - start);
  const relocations = Array.from({ length: 85 }, (_, index) => {
    const addend = rom.readUInt32BE(start + index * 4) - text.vramStart;
    object.writeUInt32BE(addend, index * 4);
    return { offset: hex(index * 4), type: 'R_MIPS_32', symbol: '.text', addend: hex(addend), section: '.rel.rodata' };
  });
  const raw = { kind: 'switch-table', compilerSection: '.rodata', outputSection: slice.sectionName,
    sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 4,
    romStart: hex(start), romEndExclusive: hex(end), vramStart: hex(start + 0x8006FC00),
    vramEndExclusive: hex(end + 0x8006FC00), bytes: end - start, entries: 85,
    expectedObjectSha256: sha256Buffer(object), expectedLinkedSha256: sha256Buffer(rom.subarray(start, end)),
    preservedPrefix: retained('prefix', row.romStart, start), preservedTail: retained('tail', end, row.romEndExclusive),
    expectedRelocations: relocations };
  const contracts = normalizeAuxiliarySectionContracts([raw], target.symbol, 'boot table admission fixture');
  const resolve = () => resolveAuxiliarySectionContracts(model, rom, target, contracts);
  const result = resolve()[0];
  assert.strictEqual(result.ownerRowIndex, 789);
  assert.strictEqual(result.ownerPrefixBytes + result.bytes + result.ownerTailBytes, 5104);
  assert.notStrictEqual(result.ownerChunkIndex, textRow.part.chunkIndex);
  const opRow = model.rows.find(r => r.part && r.part.file.endsWith('/boot_resource_op_dispatch.s'));
  assert.ok(opRow, 'original nine-entry consumer is missing');
  const opText = opRow.slices[0], opStart = 0x3E6E8, opEnd = 0x3E70C;
  const opObject = Buffer.alloc(opEnd - opStart);
  const opRelocations = Array.from({ length: 9 }, (_, index) => {
    const addend = rom.readUInt32BE(opStart + index * 4) - opText.vramStart;
    opObject.writeUInt32BE(addend, index * 4);
    return { offset: hex(index * 4), type: 'R_MIPS_32', symbol: '.text', addend: hex(addend), section: '.rel.rodata' };
  });
  const opTarget = { symbol: opRow.part.name, bytes: opText.bytes, sectionName: opText.sectionName,
    vramStartNumber: opText.vramStart, row: opRow };
  const opContracts = normalizeAuxiliarySectionContracts([{ ...raw,
    romStart: hex(opStart), romEndExclusive: hex(opEnd), vramStart: hex(opStart + 0x8006FC00),
    vramEndExclusive: hex(opEnd + 0x8006FC00), bytes: 36, entries: 9,
    expectedObjectSha256: sha256Buffer(opObject), expectedLinkedSha256: sha256Buffer(rom.subarray(opStart, opEnd)),
    preservedPrefix: retained('prefix', row.romStart, opStart), preservedTail: retained('tail', opEnd, row.romEndExclusive),
    expectedRelocations: opRelocations,
  }], opTarget.symbol, 'nine-entry boot table fixture');
  const opResult = resolveAuxiliarySectionContracts(model, rom, opTarget, opContracts)[0];
  assert.strictEqual(opResult.ownerRowIndex, 789);
  assert.strictEqual(opResult.ownerTailBytes, 2724);
  assert.deepStrictEqual([start - row.romStart, end - start, opStart - end, opEnd - opStart,
    row.romEndExclusive - opEnd], [1896, 340, 108, 36, 2724]);
  let rejected = 0;
  function mutation(object, key, value) {
    resolve(); const previous = object[key]; object[key] = value;
    try { assert.throws(resolve); rejected++; } finally { object[key] = previous; }
    resolve();
  }
  const slab = model.nonDescriptorLoadSlabs.find(s => s.id === slice.loadSlabId);
  mutation(slab, 'kind', 'loader-dma');
  mutation(slice, 'placementKind', 'rom-only');
  mutation(text, 'placementKind', 'overlay');
  mutation(text, 'executable', false);
  mutation(text, 'vramStart', text.vramStart + 4);
  mutation(slice, 'loadSlabId', 'unresolved-slab');
  mutation(model, 'bootInitializedDataProof', { ...model.bootInitializedDataProof });
  mutation(contracts[0], 'expectedLinkedSha256', '0'.repeat(64));
  mutation(contracts[0].expectedRelocations[0], 'addend', '0xFFFFFFFF');
  mutation(row, 'primaryClass', 'code');
  mutation(slice, 'executable', true);
  const oldPlacement = text.placementKind, oldSlab = text.loadSlabId;
  text.placementKind = 'non-descriptor-load-slab'; text.loadSlabId = slice.loadSlabId;
  try { assert.throws(resolve); rejected++; } finally { text.placementKind = oldPlacement; text.loadSlabId = oldSlab; }
  resolve();
  assert.strictEqual(boot.isAuxiliaryPair(model, slice, text), false, 'reverse pairing admitted');
  const prior = model.nonDescriptorLoadSlabs.length;
  model.nonDescriptorLoadSlabs.push({ ...slab });
  try { assert.throws(resolve); rejected++; } finally { model.nonDescriptorLoadSlabs.length = prior; }
  resolve();
  return { auxiliaryNegativeControls: rejected };
}

function runSharedChunkTests() {
  const active = require('../tools/lib/active_targets');
  const context = active.loadActiveTargetModel(), model = context.model;
  const rom = fs.readFileSync(path.join(ROOT, 'build/baserom.us_rev0.z64'));
  const config = JSON.parse(fs.readFileSync(active.LINKAGE_CONFIG_PATH));
  const row = model.rows[789], slice = row.slices[0];
  const hex = n => '0x' + n.toString(16).toUpperCase().padStart(8, '0');
  const retained = (start, end, suffix) => ({ inputSection: '.ob64.r0789.' + suffix,
    sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 1,
    romStart: hex(start), romEndExclusive: hex(end), vramStart: hex(slice.vramStart + start - row.romStart),
    vramEndExclusive: hex(slice.vramStart + end - row.romStart), bytes: end - start,
    expectedSha256: sha256Buffer(rom.subarray(start, end)), ownerOriginalAssembly: row.part.file,
    ownerOriginalAssemblySha256: row.part.sha256 });
  const resolve = (target, contract) => active.resolveAuxiliarySectionContracts(model, rom, target,
    active.normalizeAuxiliarySectionContracts([contract], target.symbol, 'shared boot fixture'));
  // Recover the complete three-fragment baseline independently of scheduler activation.
  const decoders = ['boot_command_stream_dispatch', 'boot_resource_tag_record_decode', 'boot_resource_op_dispatch'].map(symbol => {
    const source = context.targets.find(t => t.symbol === symbol);
    const contract = structuredClone(config.targets.find(t => t.symbol === symbol).auxiliarySections[0]);
    if (symbol === 'boot_resource_op_dispatch') contract.preservedTail = retained(0x3E70C, row.romEndExclusive, 'tail');
    return { ...source, auxiliarySections: resolve(source, contract) };
  }).sort((a, b) => a.auxiliarySections[0].romStartNumber - b.auxiliarySections[0].romStartNumber);
  active.validateAuxiliaryOwnerGroups(decoders, model);
  const resolved = active.resolveAcceptedRows(model, 'func_000248ac'), owner = resolved.owners[0];
  const target = { ...owner, symbol: 'func_000248ac', row: resolved.rows[0], textOwners: resolved.owners };
  const raw = Buffer.alloc(32), rels = Array.from({ length: 7 }, (_, i) => {
    const addend = rom.readUInt32BE(0x3EDF0 + i * 4) - owner.vramStartNumber;
    raw.writeUInt32BE(addend, i * 4);
    return { offset: hex(i * 4), type: 'R_MIPS_32', symbol: '.text', addend: hex(addend), section: '.rel.rodata' };
  });
  const table = { kind: 'switch-table', compilerSection: '.rodata', outputSection: '.ob64.r0789',
    sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 8,
    romStart: hex(0x3EDF0), romEndExclusive: hex(0x3EE10), vramStart: hex(0x800AE9F0), vramEndExclusive: hex(0x800AEA10),
    bytes: 32, entries: 7, expectedObjectSha256: sha256Buffer(raw),
    expectedLinkedSha256: sha256Buffer(rom.subarray(0x3EDF0, 0x3EE10)), trailingPaddingBytes: 4,
    expectedTrailingPaddingSha256: sha256Buffer(Buffer.alloc(4)), expectedRelocations: rels,
    preservedInteriorBefore: { ...retained(0x3E70C, 0x3EDF0, 'interior_0003E70C'), expectedRelocations: [] },
    preservedTail: retained(0x3EE10, row.romEndExclusive, 'tail') };
  target.auxiliarySections = resolve(target, table);
  const previous = config.targets.find(t => t.symbol === 'boot_resource_op_dispatch').auxiliarySections[0];
  const contributors = decoders.map(t => ({ ...t, auxiliarySections: t.symbol === 'boot_resource_op_dispatch'
    ? resolve(t, { ...previous, preservedTail: null }) : structuredClone(t.auxiliarySections) })).concat(target);
  assert.deepStrictEqual(contributors.map(t => t.chunkIndex), [0, 0, 0, 2]);
  const check = () => active.validateAuxiliaryOwnerGroups(contributors, model);
  check(); let rejected = 0;
  function mutate(object, key, value) {
    check(); const before = object[key]; object[key] = value;
    try { assert.throws(check); rejected++; } finally { object[key] = before; }
    check();
  }
  mutate(model, 'bootInitializedDataProof', { ...model.bootInitializedDataProof });
  mutate(target.textOwners[0], 'chunkIndex', 0);
  mutate(target.auxiliarySections[0], 'ownerOriginalAssemblySha256', '0'.repeat(64));
  mutate(contributors[2].auxiliarySections[0], 'ownerTailBytes', 1);
  mutate(target.auxiliarySections[0].preservedInteriorBefore, 'romStartNumber', 0x3E708);
  const slab = model.nonDescriptorLoadSlabs.find(s => s.kind === 'boot-initialized-data');
  mutate(slab, 'kind', 'loader-dma');
  assert.throws(() => active.validateAuxiliaryOwnerGroups([...contributors].reverse(), model)); rejected++;
  check(); active.validateAuxiliaryOwnerGroups(decoders, model);
  return { sharedBootChunks: 'pass', sharedBootNegativeControls: rejected };
}

if (require.main === module) {
  const model = loadAcceptedModel();
  console.log(JSON.stringify({ ...runTests(model), ...runAuxiliaryTests(model), ...runSharedChunkTests() }));
}
module.exports = { runTests, runAuxiliaryTests, runSharedChunkTests };
