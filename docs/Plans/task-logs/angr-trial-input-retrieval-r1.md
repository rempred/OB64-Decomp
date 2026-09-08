# angr trial input retrieval

## Outcome and scope

Status: completed.

The package supplies three completed-wave `PURE_C` controls and the requested `func_00215CF0` blocker.
It also supplies exact owner placement, original assembly, accepted proof, m2c inputs, and existing draft identities.
This lets the isolated trial compare its output against frozen inputs without treating source names as behavior claims.
The trial worker `/root/db10_allocation_trace` is the next actor.

## Baseline

- Assignment revision: `1`
- Launch: `ANGR-TRIAL-INPUT-RETRIEVAL-20260907-01`
- Repository branch: `main`
- Starting HEAD: `e2349536f2a1c4696d617a3ab0712b248739d6fc`

Unrelated baseline changes remain outside this task's write surfaces.

## Target inventory

| Symbol | Role in trial | Accepted class | ROM extent | Runtime extent | Bytes |
|---|---|---|---|---|---:|
| `func_0020BFF8` | small control and pointer-load baseline | completed-wave `PURE_C` | `[0x0020BFF8,0x0020C014)` | `[0x801C8B68,0x801C8B84)` | 28 |
| `func_001F34B0` | two loops with pointer loads and calls | completed-wave `PURE_C` | `[0x001F34B0,0x001F3540)` | `[0x801B0020,0x801B00B0)` | 144 |
| `func_001F197C` | switch and indirect transfer | completed-wave `PURE_C` | `[0x001F197C,0x001F1D5C)` | `[0x801AE4EC,0x801AE8CC)` | 992 |
| `func_00215CF0` | retained pure-C scheduling blocker | exact `HYBRID_C`; pure control nonexact | `[0x00215CF0,0x00216A38)` | `[0x801D2A20,0x801D3768)` | 3400 |

The shared accepted proof is
`C:/Users/Joe/.codex/ob64-consolidated-intake-20260906/work/final-snapshots-02/3-verification.json`.
Its SHA256 is `2A837B56D02452A333704C31DBB70334831F7F7C6BD181A0F58FF1F4F64A6FAF`.
The proof reports `pass` and rebuilt-ROM SHA256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
An exact copy is retained under the assigned ignored root.

### Requested hard case

The accepted owner is row `4004`, primary ID `primary:91bc0ef2581c91130ac0`.
Its linked owner is `objects/c/func_00215CF0.o` with 295 load-relevant relocations.
Its exact text SHA256 is `8E0531C287F3635893AAEB1282F89ADFC257682F8ED69D1311B0C23B21B21C9E`.

The original assembly is `asm/original/rev0/lib/func_00215CF0.s`.
Its SHA256 is `92072A039BCC5DB58214CCE013FD63DDBCE749EC6FFFAF069E6CA09AF66A3514`.
The active exact hybrid source is `src/battle/func_00215CF0.c`.
Its SHA256 is `69C4F92273BC8469F007EE75A4F9239F6AF1D537E7951E66CF0A13E7A207EF30`.

The strongest retained pure control is
`docs/archive/matching-c-candidates/2026-09-04-func_00215CF0-20b217bd52.c`.
Its actual SHA256 is `D1E9A5915BD38286869DC4FF67DF0EFD25932B3276B4E2CBF49828967A0A58B0`.
This actual hash supersedes the older source hash in its dossier.

The remaining owner-relative regions are `[0x4AC,0x4B8)` and `[0xC4C,0xC58)`.
The following records document the retained source and instruction-order blocker:

- `docs/Plans/task-logs/combat-actor-retry-preparation-r1.md`, SHA256 `39D46ADD050168C55072925DAF03E4384FFC725A2975106F7BCF8A43137EA7B7`.
- `docs/matching-c/allocator-owner-order-study.md`, SHA256 `4B318233814FB4DCE87E84362D6ECD5CC01F6B3AAD5D7B22C9069ADC8DC86B78`.
- `docs/matching-c/allocator-scheduler-trace.md`, SHA256 `E389C2FF6D24DE5BD4A6E3855AC9F2E1B3EF6DFDB32FF4A4FCF27470C2FDC202`.
- `docs/dossiers/func_00215CF0-20b217bd52.md`, SHA256 `41E06AF316B49EB1F5B20311631EC41FDC30E0ED3E9F5DA13E7D30969F6DD862`.

## Solved-case menu

`func_0020BFF8` supplies the smallest control.
Its source contains a null test followed by one pointer load, shift, and mask.
The source SHA256 is `A121834C101C03CF128EB19987556A1D4B74349186E0BBB605731DFB127C7D3D`.
The original assembly SHA256 is `9888047448AD576BA7B6C39A4A42D1AF303BD09F5F430DC288E41E1006B85AAF`.
Its accepted target SHA256 is `42B8E56A4C3097C5F8332B852371C4CFFE0BC702D3F142F3FD99CB958A616B02`.

`func_001F34B0` supplies the loop, pointer, and call control.
Its source contains two `do` loops, pointer-table loads, and three calls.
The source SHA256 is `4135CE1988721A0763BC593B927C362C9B24C708F457367D1E81FE91BD6A1863`.
The original assembly SHA256 is `AA282DF0E2549D21AD4A40AAB6389A8B7442F47F30184D4369F58188E704776B`.
Its accepted target SHA256 is `03465AF5B6C8D119B387C06F7AB4657EE4DB95BB70D2C966177198B59B340768`.

`func_001F197C` supplies the switch and indirect-transfer control.
Its source SHA256 is `40370E8D97445A3CEE6641A31E494527CBE69DE39E7EA9B98B2D1EC81B727B39`.
The original assembly SHA256 is `6ECD941B871B7B056184DEF22CDFCC20006DBDAA458BDCF2B2B0861D437C579D`.
Its accepted target SHA256 is `A5B6DEEC1D1271E86B105AD344D31763C89F9798D8129C1AB58207645B38886A`.

The indirect `jr $v0` is at function ROM offset `0x001F1A98` and runtime address `0x801AE608`.
Its accepted table occupies ROM `[0x002131D8,0x00213230)` and runtime `[0x801CFD48,0x801CFDA0)`.
The table has 22 entries, 88 bytes, and alignment 8.
Its linked SHA256 is `3A1CC13ADB14677E5DBEC143E8A4EA5EA0AC6D58D2743A1394E02B357CF5F95A`.
The full table relocation metadata is in the inventory and accepted proof.

`func_001F7ADC` is excluded from this solved menu.
Its focused exact `PURE_C` result remains provisional because W8 has no completed-wave verifier.
The boundary record is `docs/Plans/task-logs/combat-draw-wave8-r2.md`,
SHA256 `CFDA9D46E92168C1D984A9AC3DBA3F03F075AFE37EB5C46B738A090EEF6172E5`.

## Tool configuration

The configured m2c checkout is `C:/Users/Joe/Projects/OgreBattlel64/tools/m2c`.
Its script is `m2c.py`, SHA256
`B99BC4CBAD2AA8C89CCDF67B874256E0A36CE7B31B7AC26E488BB27EE446AB63`.
The observed commit and tree match the tracked contract:

- commit `3478473441a1e6da75d6bf07629452f410390ef4`;
- tree `3943f2fb966096365ca19d888a85f7a0386aac17`.

The checkout had one untracked non-Python file, `_levelUp_test.s`.
No `OB64_M2C_ROOT` or `OB64_MATCH_PYTHON` environment override was set.

`config/matching-workbench.json` has SHA256
`EBB344E06E906352CF8C6DEC8E20316A9427F3F499BDFA763265720A9C59B32D`.
It selects target `mips-gcc-c` and eight named variants.
The current wrapper is `tools/lib/matching/m2c.js`, adapter version 11.
Its SHA256 is `70930229286EEC7B6AECC8818492AA30CBB8FB05BAC4A23E3554B06BA36C5143`.

The configured Python runtime is
`C:/Users/Joe/.codex/phase5b-splat-20260801-r4/venv/Scripts/python.exe`.
Its file and product version are `3.11.15`.
Its SHA256 is `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F`.

The wrapper constructs this command shape:

```text
python m2c.py --target mips-gcc-c --function SYMBOL --globals used
  VARIANT_ARGUMENTS [--context ABSOLUTE_CONTEXT] PREPARED_ASSEMBLY
```

Historical candidate metadata records no `--context` argument for the three candidate-bearing targets.
Their corresponding target/model snapshots have no stored context row.

The read-only workbench database had SHA256
`D638A5C1B7843997D33D15988944BBFEC796F8F4A44BDDA125AA975CF8AE6E4F`.
It retained structured, goto, and stack drafts for `func_0020BFF8`, `func_001F34B0`, and `func_00215CF0`.
The task copied all nine source rows into its ignored evidence root.

No database candidate row exists for `func_001F197C`.
Its eight mutable prepared outputs were identical 638-byte type preludes with blank generated bodies.
Their shared SHA256 is `A8CEF58F4B08CFE1909D86B61079A77D84CDDAE8D63E316DB6BAAEA7AB7B2FCD`.
The task preserved one representative and the exact prepared assembly.

## Evidence index and limits

- Claim: `docs/Plans/task-logs/angr-trial-input-retrieval-r1.claim.json`,
  SHA256 `B5F97299760DBF2CAAE4D591BBDB2F092E73923A5AD81247E5B270852FD8982B`.
- Inventory: `build/angr-trial-input-retrieval-r1/inventory.json`,
  SHA256 `1A4C7FC475C389AA8729953636341CEC0E90802DF49E9425FD9C17E3295114D7`.
- m2c draft manifest: `build/angr-trial-input-retrieval-r1/m2c-drafts/manifest.json`,
  SHA256 `77E42D0C85D74FED88E553C77B3ADF652908EE20B8A1DEB58043E889C061E844`.

All selected production sources, original assembly files, prepared m2c inputs,
local configuration, and accepted proof have exact copies under the assigned ignored root.

The target identities and acceptance fields are direct observations from the accepted proof.
Evidence grade is `Verified`; review status is `pending`.
The source-construct roles are literal selection labels, not semantic claims.

This task did not run angr, m2c, a compiler, a source trial, a canonical diff,
a build, a verifier, game runtime, Resolver, GUI, or dependency installation.
The read-only SQLite query used URI `mode=ro` and copied only existing draft source text.

Changed surfaces are the assigned claim, this report, and the assigned ignored root.
No canonical documentation change is proposed. No protocol deviation occurred.
All task writes are released for Director intake.
