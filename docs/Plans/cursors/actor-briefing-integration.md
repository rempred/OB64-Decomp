# Actor placement and mission-briefing integration

The integrator is the sole production writer on `main`. Director `01a1eb8b-d5e6-7083-bb49-8e6648ef3e0b` owns dispatch and the verified native stop route. [Program](../actor-placement-briefing-program.md) · [Director cursor](director.md)

## Selected inputs

The [v1 manifest](../../../build/actor-briefing-inputs-20261117/manifest.json) uses input set `4515AA07FA92D129114967900673D85D47FE8E3829B29F2DBF10F54BDE8C1F51` and SHA-256 `50DC92369FBE14EB7E9A3DFA69B6349065BBC50993FFF5C280755A6471D36EF4`. Use `OB64_WORK_ROOT=C:/Users/Joe/.codex/ob64-descriptor-20261026`. Prepend `.toolchains/node-v24.13.1-win-x64` to process-local PATH and invoke its pinned `node.exe`.

Complete guarded preparation passed for [A01](../../../build/actor-20261117-a01-preflight.json), [A02](../../../build/actor-20261117-a02-preflight.json), [M01](../../../build/actor-20261117-m01-preflight.json), [A03](../../../build/actor-20261117-a03-preflight.json), [A04](../../../build/actor-20261117-a04-preflight.json), and [A05](../../../build/actor-20261117-a05-preflight.json). A04 owns all 268 bytes at `2A98C4..2A99D0`, including its folded preamble.

## Production

- **A01** `4d85bc65`. `func_002A9364` passed one fresh verification. The sole C object covers all 1,272 bytes and 38 relocations. Its recursive `.text` addend at `0x4A0` is zero. Three existing callers remain exact after reconciling the slot return, six word parameters and two byte flags. [A01 proof](../../../build/integration/actor-briefing/a01-acceptance-evidence.json) · [Guard control](../../dossiers/func_002A9364-1af26ba700.md)
- **A02** `6328d1dc`. `2AB0F8`, `2ACFD8` and `2AD224` passed together as `PURE_C`, with exact owners and 8/17/18 relocations. Both preambles and the separate `2AD420` accessor pass. Verified CURRENT `07B56AC1C0132FC773C93DD4ED96D24F4062B36B26E4CE202DB416D445BCAC89`. [A02 proof](../../../build/integration/actor-briefing/a02-acceptance-evidence.json) · [Float temporary](../../dossiers/func_002AB0F8-0d5700e9ef.md) · [State cursor](../../dossiers/func_002ACFD8-ddc5648031.md) · [Refresh tails](../../dossiers/func_002AD224-57b9909561.md)
- **A03** `20D870` and `20C120` passed together as `PURE_C`. Sole complete owners cover 340 and 68 bytes with four and zero relocations. All eleven existing C consumers retain their linked bytes and relocation records. Verified CURRENT `C26D95B261BC95155F8BE4573775B0B122CA02FECCBA32C5DFDD0DC004F69A05`. [A03 proof](../../../build/integration/actor-briefing/a03-acceptance-evidence.json) · [Null-guard control](../../dossiers/func_0020C120-77f33b2174.md)

- **A05** `2AD574`, `2AB574` and `2AD434` passed together as `PURE_C`. All 996 bytes and 51 relocations matched, including the `2AD574` and `2AD434` folded entries. The filter retains its byte return and all three existing callers retain their linked code and relocations. Verified CURRENT `6E759DEE83C137245461588A7C0082C4A539E382423A424B0AE04134F034360F`. [Proof](../../../build/integration/actor-briefing/a05-acceptance-evidence.json)

- **M01** `2B88C8` and `2B867C` passed together as `PURE_C`. The 240-byte wrapper and 588-byte constructor retain their eight and thirteen relocations, including internal addends `0xCC` and `0x164`. The C2 dispatcher now declares the wrapper's `s32` return and retains its exact linked bytes. Verified CURRENT `639972C68E60A602C8243D36BFABF8CF58423A326C18CFBD7CCB44F3798ABD7B`. [Proof](../../../build/integration/actor-briefing/m01-acceptance-evidence.json)

A04 is next. [P01 preparation](../../../build/integration/actor-briefing/p01-producer-evidence.json) binds all 22 table entries and their separate read-only assembly owner for private dispatch.

The B02 reference repair in `bb1a4e6e` preserves the historical Direct27/Direct57 pair and authenticates a successor for the current caller declaration. [Live lesson dossier](../../dossiers/func_002AAC60-55b287797b.md)
