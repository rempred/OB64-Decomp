# Matching Workbench Pilot — 2026-08-22

## Outcome

The workbench produced 142 exact `PURE_C` scratch-object candidates from the
fixed 200-smallest-leaf corpus. None of those targets was already active, and
all 142 exact objects had zero relocations. They cover 1,708 retail bytes.

At pilot generation time these were strong promotion leads, not 142 accepted
matches. The workbench does not establish sole linker ownership, final linked
placement, reviewed relocation contracts, or full-ROM identity. Each selected
source still had to pass the normal canonical integration and verification
workflow.

## Promotion follow-through — 2026-08-23

All 142 candidates were reviewed, stripped of generated m2c scaffolding,
rewritten as concise ordinary C where useful, and promoted in six independently
verified batches:

- `612aa86` — first 24 exact leaves;
- `c7e66d5` — next 24 exact leaves;
- `a5070e6` — 24 exact accessors;
- `b5d264f` — fourth 24-function batch;
- `d82436a` — fifth 23-function batch; and
- `821312b` — final 23-function batch.

Every batch passed source policy, sole C linker ownership, accepted placement,
its explicit empty-relocation contracts, exact linked target bytes, and a
byte-exact complete ROM. The final combined verification reported 151
`PURE_C` exact functions covering 4,240 bytes. Subtracting the pre-pilot nine
functions and 2,532 bytes confirms that the promoted corpus accounts for all
142 candidates and the expected 1,708 bytes.

No candidate required assembly or was deferred. Unknown fields and numeric RAM
addresses remain deliberately neutral rather than receiving unsupported
semantic names. The original assembly files remain available as reference and
fallback source history.

## Fixed identities

- Baseline commit: `3aa9865` (`docs: preserve blocked matching research`)
- Accepted target-model ID:
  `1375FE7CF75BB845E8ED87460CC0FEA0AC9A34B762FE3AF207FB8B050092009D`
- Pilot sweep ID:
  `F30C2419C89C656F4AA76C80CC5E40FEFEAB6DE7691D948854CD970C41142F32`
- Workbench database schema: 2
- m2c adapter: 5
- m2c commit: `3478473441a1e6da75d6bf07629452f410390ef4`
- m2c tree: `3943f2fb966096365ca19d888a85f7a0386aac17`
- KMC compiler SHA-256:
  `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`
- GNU 2.6 assembler SHA-256:
  `0831D410AD140F2D2225382273219ACB418EF6EC1E986A3309F034D2A8350A5C`

The corpus was selected deterministically from accepted ordinary function
owners by leaf status, byte size, then ROM address:

```text
node tools/match.js sweep --set smallest-leaves-200 --variant structured --no-context
```

## Yield

| Result | Count | Share of selected targets |
|---|---:|---:|
| Selected and processed | 200 | 100% |
| m2c generated | 198 | 99% |
| Scratch compiled | 198 | 99% |
| Exact scratch bytes | 142 | 71% |
| Generation failures | 2 | 1% |

The 198 compiled candidates classified as:

| Class | Count |
|---|---:|
| Exact bytes | 142 |
| Register allocation only | 4 |
| Opcode or expression | 22 |
| Length mismatch | 27 |
| Immediate or signedness | 1 |
| Scheduling or block order | 2 |

The two generation failures were bounded and explicit:

- `func_00040ff4_chunk3head`: m2c could not find branch target
  `func_8016B12C` in the exported function input.
- `osException_vector`: m2c could not infer the indirect jump table without a
  recognized jump-table symbol/input.

Those failures are input/structural research cases; they are not evidence that
the accepted boundaries should be changed during an ordinary match.

## Time and output volume

The cold pilot took 319,398 ms (5 minutes 19.4 seconds), or about 1.60 seconds
per selected target. Files written or updated during its time window, excluding
the SQLite database, totaled 1,588 files and 1.627 MiB:

| Extension | Files | Bytes |
|---|---:|---:|
| `.s` | 596 | 363,116 |
| `.c` | 398 | 173,265 |
| `.o` | 396 | 341,688 |
| `.json` | 198 | 827,454 |

This filesystem count is a timestamp-window measurement of ignored artifacts;
it is not a canonical evidence manifest. It includes m2c input/output,
compiler/assembler intermediates, objects, and per-target reports.

Repeating the identical completed sweep returned the stored result in 3,115 ms
and performed no target generation or compilation: about a 99.0% wall-time
reduction. Interrupted sweeps checkpoint after each target and resume from the
remaining target list.

For a separate single-function comparison on `memcpy_bytewise`:

- canonical linked `diff.js`: 65,510 ms;
- cold scratch `match.js watch`: 11,705 ms;
- cached scratch `watch`: 7,659–15,752 ms across four samples, with the final
  two samples at 7,659 and 7,664 ms.

These commands prove different things. The scratch loop is useful because it is
faster, but only the 65-second canonical path checked linked output and the
normal acceptance contract.

## Context A/B test

The first ten pilot targets were generated once without inferred context and
once with the workbench prototype passed to m2c:

| Mode | Exact | Other result | Time |
|---|---:|---|---:|
| Context generated but not passed | 8/10 | 2 register-only | 16,607 ms |
| `--with-context` | 5/10 | 5 opcode/expression | 20,416 ms |

Static context remains available for human/agent inspection, but passing its
inferred prototype is therefore opt-in. The bounded callsite windows are not
path-sensitive type proof.

## Family and probe checks

Two consecutive family-atlas builds produced identical ordered group IDs. They
took 1,415 ms and 1,296 ms within one loaded process and recovered the known
exact `func_000E5938`/`func_0013466C` clone.

| Family tier | Groups | Members | Additional members |
|---|---:|---:|---:|
| Exact bytes | 26 | 81 | 55 |
| External-jump normalized | 57 | 183 | 126 |
| Register normalized | 78 | 228 | 150 |
| Structural CFG/opcode | 297 | 896 | 599 |

The compiler probe produced the requested RTL, flow, global-allocation, and
delay-slot dumps for `memcpy_bytewise`; an identical probe was cached, and
self-comparison reported no divergent pass. Probe reports are always marked
acceptance-ineligible.

## Practical use

- Use `rank --lane leverage` for LordlyCaliber-facing work and reviewed callgraph
  leverage.
- Use `rank --lane batch` to review high-confidence small exact candidates
  without pretending they outrank subsystem work.
- Use `best`, `history`, and `watch` for the normal iteration loop.
- Use `context`, `family`, and `probe` only to answer a concrete uncertainty.
- Deliberately copy a reviewed candidate into `src/`, add the smallest active
  target/linkage entry, then run canonical diff, target verification, and full
  verification.

No Project64 process, capture session, Total Resolver database, or revision
comparison was required for this pilot.
