# Wave 4 matching-C evidence index

Status: completed and review-pending. `func_00269470` now builds as matching C
with exact linked bytes in two fresh external roots. The result matters because
it replaces one high-value overlay owner while preserving the full ROM. No
action is required from Joe; the Director must route the required Critical
review.

## Mission identity

| Item | Result |
|---|---|
| Assignment | `ob64-decomp-matching-c-high-value-function-wave4-20260802` revision 1 |
| Worker role | Research and implementation worker |
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and starting HEAD | `main`, `d398c23f4163e807039c45956a4ed25c4698b641` |
| Parent starting HEAD | `main`, `355236254220eb8ab6f0146868c643ad409287b7`; read-only |
| Integration starting HEAD | `main`, `b22815518f060425519c08df19b617af8b5099a7`; read-only |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Setup report | `build/setup/verify-setup-report.json`; `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |

The parent HEAD differs from the prompt snapshot. The parent remained
read-only, so the mismatch did not affect this result.

The evidence-completion correction adds three required standalone records:
[independent-derivation.md](independent-derivation.md),
[reproduction-procedure.md](reproduction-procedure.md), and
[task-log.md](task-log.md).
The correction report is
[20260802-ob64-matching-c-high-value-wave4-evidence-completion-aar.md](aar/20260802-ob64-matching-c-high-value-wave4-evidence-completion-aar.md).

## Selected owner

The selection record is [target-selection.md](target-selection.md).

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `func_00269470` | Seven-way state handler | `0x00269470..0x00269798` | z64 ROM range, end exclusive | Selected owner |
| `func_00269470` | Same handler placement | `0x802148C0..0x80214BE8` | overlay descriptor 12 runtime range | Linked section |
| `g_func_00269470_dispatch_table` | Seven-entry dispatch table | `0x80220BA0` | overlay runtime virtual address | Indirect dispatch source |
| `func_00269470_callback` | Callback field | `s0+0x70` | state-subobject field | Two indirect calls |
| `func_00269798` | Boundary successor | `0x00269798` | z64 ROM function start | End proof |

The owner is 808 z64 ROM bytes. Its accepted slice is `.ob64.r4801`, row
`4801`, chunk `38`, and overlay descriptor `12`.

## Independent C derivation

The source is `src/overlays/descriptor_12/func_00269470.c`. Its SHA-256 is
`366C3F0D312711E71DB34900B7DBB2D75B59D4DCF36745EF2C80B397C60F40F2`.

The complete material behavior and constant mapping is in
[independent-derivation.md](independent-derivation.md).

| Assembly evidence | C behavior or constant | Source result |
|---|---|---|
| Owner offsets `0x001C..0x0024` | Mask selector to 16 bits and accept seven entries | `selector_arg & 0xFFFF`, then `selector < 7` |
| Owner offsets `0x002C..0x003C` | Load the seven-entry dispatch table | `g_func_00269470_dispatch_table[selector]` |
| Owner offsets `0x0044..0x0078` | Selector 1 callback and state transition | Callback reason `1`, then `func_00268798` |
| Owner offsets `0x007C..0x00BC` | Selector 2 flag-dependent transition | `0x4` selects `func_00268AD8`; otherwise `func_00268800` |
| Owner offsets `0x00C0..0x00CC` | Selector 6 result propagation | Return `record_50[0]` |
| Owner offsets `0x00D0..0x01E8` | Selector 0 global initialization and callbacks | Copy flags, callback, values, then reason `0` callback |
| Owner offsets `0x0118..0x0160` | Selector 0 branch and call order | `0x4` skips `func_00268678`; otherwise it runs after `func_00268890` |
| Owner offsets `0x0164..0x01B0` | Bounded pointer-array state update | Flags `0x10` and `0x20` produce halfword values `0` or `1`, plus `0x2` |
| Owner offsets `0x01EC..0x0208` | Selector 5 cleanup | Call `func_00268358`, then clear state flag `0x4` |
| Owner offsets `0x020C..0x0268` | Selector 3 state propagation | Calls three helpers and conditionally uses state bit `0x1000` |
| Owner offsets `0x026C..0x030C` | Selector 4 transition and callback | Flags `0x2`, `0x4`, callback reason `2` |
| Owner offsets `0x01BC..0x01D0` | Initialization value | Store IEEE-754 `1.0f` at field `0x40` |

The compiler-local branch label preserves the original selector-0 branch
encoding. A local assembler label places the skip jump after
`func_00268678`. This preserves both runtime paths and the accepted relocation.

## Compiler and target contract

The accepted compiler is `kmc-gcc-2.7.2` `cc1.exe` with SHA-256
`F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.

The matching-C configuration SHA-256 is
`E7EC41010E82EE542A9109C9FEC62555FF5FB3323D9158AA18AA7A994975F547`.
The matching-C build library SHA-256 is
`7BA0183B35473C4E779E5D4D3056EAAF7EDC8A35A3835CD796A8225EACAECA3F`.

Compile flags are:

```text
-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char
```

The target contract records these exact identities:

| Artifact | Result |
|---|---|
| Original assembly SHA-256 | `8A11B4BE872A6ABABA1F9EE8FF5C3108CBD81B18C45A21653D3FBE49BAA2B7EB` |
| C object section | `.ob64.r4801`, 808 bytes |
| C object text SHA-256 | `481296CB178391FFE31D7270EA993FED1AC5B7BE17F43AAFF5B97830E68C9BDC` |
| Linked target text SHA-256 | `C4F2DD8D5281054D1F0266ECDEDC6832CF669DA331AC4C4F0A92B6A7D134EF02` |
| Linked target owner | `objects/c/func_00269470.o` |
| Relocation contract | 42 recorded relocations in `config/phase8/matching-c.json` |

The linked target is byte-identical to the original assembly fallback. The
original fallback remains available in the comparison object and is not linked.

## Required commands and results

The complete reproduction procedure is in
[reproduction-procedure.md](reproduction-procedure.md).

### Setup gate

Command:

```text
node tools/verify_setup.js --phase5a-root "C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731"
```

Result: PASS. The setup report records 21 passing checks, zero unknown bytes,
exact code-region rebuilding, exact source-manifest rebuilding, and the
canonical ROM SHA-256.

### Fresh external root A

Command:

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Result: PASS. The build report records full ROM SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Explicit verifier command:

```text
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a\verification.json"
```

Result: PASS with the same full ROM SHA-256.

### Fresh external root B

The build and verifier used the same commands with these path substitutions:

```text
C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a
C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-b\phase8-final-b
```

Result: build PASS and explicit verification PASS. Root B produced the same
full ROM SHA-256, target hashes, map identity, layout identity, and reports.

### Path-independent comparison

```text
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a" --right "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-b\phase8-final-b" --report "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a\reproducibility.json"
```

Result: PASS. The comparison report SHA-256 is
`E16576C27FCF4226F47871C8DB5E54D04C437612136140BBFD86E658001EB81B`.

## Preservation results

| Check | Result |
|---|---|
| Selected target linked from C | PASS |
| Selected target linked bytes | Exact, `C4F2DD8D...` |
| Four earlier accepted targets | Exact through asm-differ: `func_000E5938`, `func_0000B33C`, `func_00007688`, `func_0000BC8C` |
| Accepted rows preserved | 7,242 |
| Accepted executable slices preserved | 7,251 |
| Overlay descriptors preserved | 19 |
| Original assembly target owners linked | None |
| Full ROM identity | Exact, `571E8339...` |

## Causal repair record

The build tool originally matched only LF-only `.text` directives. KMC emits
CRLF assembly on this host. The matcher now accepts an optional carriage return
while still requiring exactly one text directive. This repair stays in
`tools/lib/phase8_matching_c.js` and is covered by both fresh builds.

An earlier diagnostic link also exposed a selector-0 skip-target mismatch. The
source now binds the branch to the compiler-local pre-call label and the jump to
the post-call assembler label. The final linked bytes match the fallback.

## Tracked evidence and generated outputs

Tracked evidence comprises this index, [target-selection.md](target-selection.md),
[independent-derivation.md](independent-derivation.md),
[reproduction-procedure.md](reproduction-procedure.md),
[task-log.md](task-log.md), the [predecessor after-action report](aar/20260802-ob64-matching-c-high-value-wave4-aar.md),
and the [evidence-completion correction report](aar/20260802-ob64-matching-c-high-value-wave4-evidence-completion-aar.md).
These seven files are curated Markdown records. Build outputs remain in the two
external roots. No generated artifact is stored under the tracked evidence root.

The [task log](task-log.md) records the correction baseline, chronology,
read-only technical surfaces, parent-HEAD deviation, final inventory, and
terminal state.

## Review state

Worker result: completed. Evidence grade: supported before independent review.
Review status: pending. A fresh Critical independent review is required.
