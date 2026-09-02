# High Attack Battle Stream Wave 1 structural audit

Date: 2026-09-02
Scope: Wave 1 load placement, executable/padding ownership, multi-entry text ownership, and
switch-table placement
Starting commit: `f47f757ef6492753aa61d889a6c4d334d7b1af96`
Starting branch: `codex/high-attack-wave-1-structural-audit`
Status: worker implementation complete; independent structural review pending

This is structural work. No Matching-C candidate was activated or edited, no compiler or source
class changed, and no hybrid or raw-word C mechanism was added.

## Conclusions

| Question | Conclusion | Accepted structural result |
|---|---|---|
| Wave 1 load slab | One loader call and one gap-free accepted DMA capture establish the complete ROM range `0x00213B10..0x0022A280` at RAM `0x801D0840..0x801E6FB0`, length `0x16770`, delta `+0x7FFBCD30`. | Added non-descriptor slab `resource-loader-00213b10`; no fixed descriptor and no extrapolation outside the proved endpoints. |
| `func_0021C8DC` tail | The function ends after the `jr $ra` delay slot at ROM `0x0021C968`. ROM `0x0021C968..0x0021C970` is eight bytes of zero alignment padding, not function instructions and not a separate data object. | Kept the 148-byte tracked assembly fallback but split row 4033 into a 140-byte executable section and an 8-byte non-executable padding section. |
| `func_0021D374` / `func_0021D3BC` | They are one logical multi-entry text owner. `func_0021D374` defines `$t0`; its three tails enter ROM `0x0021D3BC` or internal ROM `0x0021D3D8`; the continuation consumes `$t0` and has no independent static caller. | Added a reviewed two-row multi-owner contract for ROM `0x0021D374..0x0021D450`, RAM `0x801DA0A4..0x801DA180`. Partial `func_0021D3BC` activation fails closed. |
| `func_0021CBC4` / `table_00229df0` | The table is the complete 65-entry switch table for the accepted `func_0021CBC4` text owner, followed by four compiler alignment bytes. It occupies one accepted read-only data row in the same proved load slab, at RAM `0x801E6B20`. | Extended auxiliary-owner placement validation to accept one read-only data owner in the same non-descriptor slab, including a different assembly chunk. No inactive linkage contract was added. |

## Direct evidence

### 1. Exact loader-managed slab

The accepted assembly owner `asm/original/rev0/lib/func_0004e448.s` constructs all four endpoints
directly:

```text
I-cache:      0x801D0840..0x801E5AA0
D-cache:      0x801E5AA0..0x801E6FB0
DMA source:   0x00213B10..0x0022A280
DMA target:   0x801D0840..0x801E6FB0
DMA length:   0x16770
```

ROM `0x0004E65C..0x0004E678` materializes source `0x00213B10`, target `0x801D0840`,
exclusive source end `0x0022A280`, and calls `0x8009DA50` with the subtracted length. The next
resource load at ROM `0x0004E6CC..0x0004E6E8` begins at source `0x0022A280` and target
`0x801E6FB0`. That independent successor establishes the first transfer's exclusive endpoint.

The accepted parent capture is:

```text
C:\Users\Joe\Projects\OgreBattlel64\wiki\overlay-dma-source-map\
20260628-223030-requester-cache\overlay-dma-source-map.json
SHA-256 EA81A4B80ADCC3BB550C8141B29B419B5D24EE1A4DCF4DB1D1EB9B708A450B25
```

For transition `scenario-card-to-combat`, filter `low-non-audio`, its
`resource-read-small-safe` record reports the same source, target, endpoints, and `0x16770`
length at frame 279, PC `0x8009DA50`, return address `0x8017877C`. The direct requester key is
`dma/resource::resource loader@0x0004E458`.

The capture divides the transfer into 180 observed chunks:

```text
first: index 758, ROM 0x00213B10, RAM 0x801D0840, length 0x200
last:  index 937, ROM 0x0022A110, RAM 0x801E6E40, length 0x170
ROM gaps: 0
RAM gaps: 0
summed length: 0x16770
```

The cache records independently cover `0x801D0840..0x801E5AA0` in I-cache and
`0x801E5AA0..0x801E6FB0` in D-cache. The cache split is not an ownership boundary: accepted
source class continues to determine executable treatment, except for the separately proved C8DC
padding below.

The capture directly covers each audited address:

| ROM | RAM | DMA event |
|---:|---:|---:|
| `0x0021C8DC` | `0x801D960C` | 828 |
| `0x0021C970` | `0x801D96A0` | 829 |
| `0x0021CA88` | `0x801D97B8` | 829 |
| `0x0021CBC4` | `0x801D98F4` | 830 |
| `0x0021D374` | `0x801DA0A4` | 834 |
| `0x0021D3BC` | `0x801DA0EC` | 834 |
| `0x00229DF0` | `0x801E6B20` | 935 |

The accepted model contains 178 complete rows from p3988 through p4165 inside these endpoints.
p3987 ends exactly at the slab start and p4166 begins exactly at its end. The endpoints do not
split an existing row.

### 2. `func_0021C8DC` executable extent and padding

The only supported function entry is ROM `0x0021C8DC`, runtime `0x801D960C`. Accepted owner
`func_0021B2E0` materializes that runtime address into `$a3` before calling the comparator consumer
at runtime `0x801CCD4C`. No static pointer to either trailing word was found, and no J, JAL, or
branch from another executable slice in this resource slab enters either word. One unrelated
overlay reuses a numerically equal runtime address; it is not an entry into this ROM owner.

The final accepted words are:

```text
0x0021C960  0x03E00008  jr $ra
0x0021C964  0x00000000  delay slot
0x0021C968  0x00000000  padding
0x0021C96C  0x00000000  padding
0x0021C970              next accepted function
```

The 140 function bytes have SHA-256
`58A0D8F0D763A659AC0E489FC9F6F117B2C628496F07F7E42F37304B59EAB19C`. The final eight
zero bytes have SHA-256
`AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC`. The successor is
16-byte aligned at runtime `0x801D96A0`.

Row p4033 remains the complete, byte-conserving tracked assembly fallback. Its link ownership is
now explicit:

```text
.ob64.r4033.s0  ROM 0x0021C8DC..0x0021C968  RAM 0x801D960C..0x801D9698  executable
.ob64.r4033.s1  ROM 0x0021C968..0x0021C970  RAM 0x801D9698..0x801D96A0  non-executable padding
```

The active-target resolver selects only `.ob64.r4033.s0` as the complete function owner and rejects
the model if the padding becomes executable. This permits a future exact Pure-C replacement to own
the function section alone while the accepted assembly fallback continues to own the separate
padding section. The archived candidate was not activated during this audit.

### 3. `func_0021D374` and `func_0021D3BC`

The predecessor p4046 returns at ROM `0x0021D36C` with its delay slot at `0x0021D370`; there is no
fallthrough into `0x0021D374`.

At ROM `0x0021D384`, the primary entry loads `$t0` from byte `+0x11`. Its control flow is:

```text
0x0021D39C  j 0x801DA0EC  (ROM 0x0021D3BC)
0x0021D3A8  j 0x801DA108  (ROM 0x0021D3D8)
0x0021D3B4  j 0x801DA108  (ROM 0x0021D3D8)
```

The continuation never defines `$t0` and consumes it at ROM `0x0021D444`. A complete scan of
accepted executable bytes found:

| Runtime entry | Direct J/JAL source ROMs |
|---:|---|
| `0x801DA0A4` (`0x0021D374`) | none |
| `0x801DA0EC` (`0x0021D3BC`) | `0x0021D39C` only |
| `0x801DA108` (`0x0021D3D8`) | `0x0021D3A8`, `0x0021D3B4` only |

No exact pointer word or HI/LO address construction for these three entries was found in accepted
assembly. Thus `0x0021D3BC` is not an independently callable ABI owner. It and `0x0021D3D8` are
internal entries of the logical owner beginning at `0x0021D374`.

The accepted physical rows remain p4047 and p4048. The new multi-owner contract covers all 220
bytes, has SHA-256
`AB19D70EA422D4FE47620330C5F4EDCA53EEB9863FCB104206582C4D2CB3A956`, and preserves both
assembly fallbacks. The active-target resolver rejects activation of `func_0021D3BC` by itself.

### 4. `func_0021CBC4` and `table_00229df0`

The accepted dispatcher forms the table address in its bounded switch sequence:

```text
0x0021CE00  0x3C01801E  lui $at, 0x801E
0x0021CE04  0x00220821  addu $at, $at, $v0
0x0021CE08  0x8C226B20  lw $v0, 0x6B20($at)
```

The only accepted `0x8C226B20` consumer is inside `func_0021CBC4`. The accepted parent cross-reference
record in `C:\Users\Joe\Projects\OgreBattlel64\scripts\ob64_xrefs.json` for runtime
`0x801E6B20` likewise has one reader in this owner and no writer.

Accepted row p4158 is exactly ROM `0x00229DF0..0x00229EF8`, 264 bytes. The same directly captured
load maps it to RAM `0x801E6B20..0x801E6C28`. Its bytes consist of 65 aligned runtime pointers,
each within the accepted CBC4 runtime text range `0x801D98F4..0x801D9EFC`, followed by one zero
word. The linked bytes have SHA-256
`D88942BC72126CDB2EAC36D63BCF8B262C671FFFA53ADD17DEBAC7BB6A02D112`; the four-byte zero
padding has SHA-256
`DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119`.

Expressed as compiler-local `.text` addends, the 65 entries plus four padding bytes have object
SHA-256 `B8C244F0C4F26E1576796A6E5309C3E951E433CAFDDE9FA15AC524B480599536`. The existing
auxiliary-section verifier reproduces those object and linked bytes exactly when given a synthetic,
inactive contract.

The text owner is in assembly chunk 33 and the table owner is in chunk 34. Phase 8 already groups
replacement work by both text-owner and auxiliary-owner chunks. The previous same-chunk restriction
in active-target resolution was therefore stronger than the linker ownership mechanism and rejected
this proved layout. Resolution now requires either:

- one fixed overlay with an accepted `data-rodata` auxiliary slice; or
- one non-descriptor slab shared by the text and non-executable data slices.

Cross-chunk placement remains permitted only after the complete accepted data owner, source hash,
ROM/VMA range, table relocations, object bytes, linked bytes, and any preserved tail all validate.

No `matching-c-linkage.json` entry was added for `func_0021CBC4`. Its archived C candidate is still
nonexact, so attaching a final active auxiliary contract now would be unused and premature.

## Inferences kept separate from direct evidence

- The classification of `0x0021C968..0x0021C970` as alignment padding is an inference from the
completed return, absence of any same-resource direct entry, two exact zero words, and the next function's
  16-byte alignment. It is not a claim about the original translation-unit boundary.
- The `func_0021D374` contract is a logical machine-code owner conclusion. It does not assign a
  semantic function name or claim how the original source expressed the internal entries.
- The 65-pointer region is structurally a compiler-compatible switch table. This audit does not
  strengthen the meanings of individual cases.
- The load-slab delta is valid only over the directly proved transfer. Nearby addresses with a
  coincident delta were not used to extend either endpoint.

## Rejected alternatives

### Delta-only slab

Rejected. A few address pairs prove a delta, not endpoints. The configured slab uses the loader's
four literal endpoints, the successor load, and all 180 continuous DMA chunks.

### Fixed overlay descriptor

Rejected. This resource load is not one of the 19 fixed descriptor images. The loader's execution
location does not confer descriptor ownership on its payload.

### C8DC padding as instructions

Rejected. Execution returns before the two zero words, the unique callback entry is at the owner
start, no direct control-flow edge from the same loaded resource enters either word, and the next
function begins immediately after them.

### C8DC padding as a new data row

Rejected as unnecessary and disruptive. The evidence proves non-executable padding, not a separate
data object. A link-only slice preserves the accepted row, manifest, part count, and assembly
fallback while making function ownership exact.

### Independent `func_0021D3BC`

Rejected. It has an undefined `$t0` live-in, no independent static caller or address materialization,
and all observed entries come from the preceding primary body.

### Two callable owners with a shared tail

Rejected. No second caller enters the alleged tail. The supported model is one primary entry with
internal entries across two accepted physical rows, represented by the existing multi-owner
mechanism.

### CBC4 table as unrelated data or an overlay-local row

Rejected. The code materializes its exact runtime address, all 65 values target the bounded text
owner, the same loader maps both ranges, and no fixed descriptor covers either source range.

### Immediate active auxiliary linkage

Rejected for this audit. Placement and ownership are supported independently, but the C text is
still nonexact and inactive. An unused active linkage entry would violate the fail-closed contract
census.

## Implemented changes

- Added the exact fifth non-descriptor load slab and updated the Phase 7 count.
- Added validated slab-local `nonExecutableRanges`, including layout/report propagation and
  section/PT_LOAD execution checks.
- Split p4033 only at link time; accepted source rows, assembly files, and global row indices remain
  unchanged. Link slices increase from 7,252 to 7,253 and split owners from 10 to 11.
- Made single-executable-slice accepted rows selectable as function owners while rejecting ambiguous
  or partially executable rows.
- Added the `func_0021D374` two-row multi-owner contract.
- Allowed auxiliary read-only data in the same non-descriptor load slab and removed the unsupported
  same-assembly-chunk restriction.
- Added focused model, byte, placement, control-flow, auxiliary-resolution, and negative mutation
  tests.

## Verification

Before tracked edits, `node tools/verify.js` passed at the starting commit with:

```text
Baserom identity PASS
Toolchain PASS
Source policy PASS
C linker ownership PASS
Target placement PASS
Relocations PASS
Target bytes EXACT
Full ROM EXACT
PURE_C exact 439 / 27024
HYBRID_C exact 61 / 32928
RESULT: EXACT BASELINE
```

Focused tests completed against a fresh post-delta Phase 7 structural baseline:

```text
node tests/phase7_conventional_build.js --output <fresh-phase7-output>
status: pass; baseline verified; positive model and all negative mutations passed

node tests/active_targets.js
status: pass; active targets: 500

node tests/load_slab_00087200.js
status: pass

git diff --check
status: pass
```

After the final tracked structural delta, `node tools/audit.js` passed with:

```text
Structural protections PASS
CURRENT exact ROM PASS
RESULT: AUDIT PASS
```

The final `node tools/verify.js` also passed with unchanged source-class counts:

```text
Baserom identity PASS
Toolchain PASS
Source policy PASS
C linker ownership PASS
Target placement PASS
Relocations PASS
Target bytes EXACT
Full ROM EXACT
PURE_C exact 439 / 27024
HYBRID_C exact 61 / 32928
RESULT: EXACT BASELINE
```

## Remaining blockers and review boundary

All four assigned structural questions are resolved in the proposed model. Remaining work is
outside this audit's authorization:

- independent structural review of the proposed tracked delta;
- later activation and normal exact-ROM verification of the untouched C8DC candidate;
- a combined Pure-C reconstruction for the D374/D3BC logical owner; and
- completion of the nonexact CBC4 C text before adding its reviewed active auxiliary linkage
  contract.

Total Resolver was not used. The accepted loader assembly, accepted parent runtime capture, byte
continuity, and static ownership evidence were sufficient; no new live observation was needed.
