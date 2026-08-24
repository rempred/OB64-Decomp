# Loader DMA slab `0x00087200..0x000DDF60` structural correction

Date: 2026-08-24

## Structural claim

The accepted Rev 0 conventional-build model previously classified ROM
`0x00087200..0x000DDF60` as `rom-only`. Retail instead loads that half-open ROM interval at
runtime `0x8019A7A0..0x801F1500`. The ranges have the same `0x56D60` length and a constant
`+0x801135A0` ROM-to-live delta.

This correction adds one `nonDescriptorLoadSlabs` record. It does not change ROM offsets,
function or data boundaries, source ownership, segmentation, executable classification, or the
19 accepted fixed overlay descriptors.

```text
id:                 loader-dma-00087200
kind:               loader-dma
ROM:                0x00087200..0x000DDF60
runtime:            0x8019A7A0..0x801F1500
length:             0x00056D60
ROM-to-live delta:  +0x801135A0
accepted owners:    p1503..p1937 (435 unsplit owners)
```

## Total Resolver evidence

The selected schema-3 knowledge database was
`023E881A-314D-4398-9E22-1E05952A3537`. Bounded `explain` queries report the corrected
destination with mapping method `direct-contiguous-rom-dma-slab-equality` for each affected
function:

| Function | ROM start | Corrected live start | Direct observations | Sessions | Execution evidence |
|---|---:|---:|---:|---:|---|
| `func_000BBD50` | `0x000BBD50` | `0x801CF2F0` | 6 | 5 | exact instructions/edges at corrected destination |
| `func_000BBD80` | `0x000BBD80` | `0x801CF320` | 6 | 5 | exact instructions/edges at corrected destination |
| `func_000BC684` | `0x000BC684` | `0x801CFC24` | 6 | 5 | exact instructions/edges at corrected destination |
| `func_000BD26C` | `0x000BD26C` | `0x801D080C` | 6 | 5 | placed, not executed |

The explicitly selected historical generated Resolver
`build/total-resolver/products/resolver-r3/resolver-r3.sqlite` groups these placements under
parent slab ID
`placement:FB52330EB7E51A5328392916C52FB7609B9B77FE10E03AC83917BEFE519BF62C`.
Session `20260818T032141.053282Z-9dae1dea`, frame 7504, brackets the endpoints:

- `live:0x8019A7A0` resolves to the first owner, `func_00087200`, under the shared slab;
- the preceding address is not supported by that slab;
- the final active DMA region is `0x001F13A0..0x001F1500`, a `0x160`-byte tail corresponding to
  ROM `0x000DDE00..0x000DDF60`; and
- `live:0x801F14FC` remains resident while `live:0x801F1500` does not.

The historical Resolver is generated-unreviewed and the selected knowledge observations are
live-unreviewed. They are evidence for this proposed structural change, not self-promoting
authority.

## Alternate-residency limit

Total Resolver also has a single-session direct-placement observation of these bytes at delta
`+0x8006FC00`. That observation establishes residence only. It is not selected as the link VMA:

- `func_000BBD50`, `func_000BBD80`, and `func_000BC684` have exact runtime instruction/edge
  evidence at the `+0x801135A0` destination, not at the alternate copy; and
- retail word `0x0807421F` at ROM `0x000BD2D0` is the local jump in `func_000BD26C`. It decodes to
  `0x801D087C`, exactly the corrected runtime address of ROM `0x000BD2DC`. It does not decode to
  the alternate-residency copy.

The conventional linker VMA therefore follows the destination used by retail absolute code
addresses. Alternate residence remains separate runtime evidence and is not erased by this
structural record.

## Boundary and ownership checks

The interval begins and ends on existing accepted owner boundaries:

- p1502 ends at `0x00087200`; p1503 begins there;
- p1937 ends at `0x000DDF60`; p1938 begins there; and
- all p1503..p1937 owners currently have one slice, so this correction introduces no new split.

The focused `tests/load_slab_00087200.js` test asserts the slab record, equal lengths and deltas,
all 435 contained owners, both outside neighbors, the four initially blocked owners, and the
retail `func_000BD26C` local-jump falsifier. The comprehensive
`tests/phase7_conventional_build.js` test additionally locks the same structural result against a
fresh conventional ELF, map, and ROM; that check passed as part of the heavyweight structural
audit recorded below.

## Smallest useful falsifiers

Reject or revise this record if any of the following is demonstrated:

1. an authenticated loader/DMA trace gives a different source endpoint or destination endpoint
   for the parent slab;
2. retail execution of code in this interval occurs at an incompatible link VMA;
3. the `func_000BD26C` local jump is shown not to be an intra-function address at ROM
   `0x000BD2DC`; or
4. the structural audit finds a descriptor overlap, coverage gap, linker VMA/LMA mismatch, or ROM
   identity change.

## Acceptance status

The tracked correction passed the focused tests, `node tools/audit.js`, all three promoted-target
strict verifiers, and the final unscoped `node tools/verify.js` run on 2026-08-24. The heavyweight
audit reported `Structural protections PASS` and `CURRENT exact ROM PASS`; the final verifier
reported exact target ownership/placement/relocations and `Full ROM EXACT` with 361 exact
`PURE_C` functions / 12,840 bytes and 33 exact `HYBRID_C` functions / 8,136 bytes.

Per `docs/AUDIT.md`, independent review of the structural delta remains the procedural review gate
before upstream acceptance. The smallest useful review should confirm the two slab endpoints, the
selection of the `+0x801135A0` linked VMA over the alternate residence-only copy, and the p1502 /
p1938 outside-boundary falsifiers.

## Workbench target-model correction

The first post-change `node tools/match.js doctor --json` run failed on the persistent store's
`UNIQUE (model_id, symbol)` constraint. Diagnosis showed that workbench target-model contract 2
included the Phase 7 model's accepted input list but omitted
`config/phase7/conventional-build.json` itself. A placement-only structural edit could therefore
change hundreds of exact target records without changing `model_id`.

Target-model contract 3 now includes the exact conventional-build configuration path and SHA-256.
Consequently a placement change receives a new model ID, prior experiments remain available as
stale history, and current targets can be synchronized without colliding with snapshots from the
old placement model. `tests/matching_workbench.js` contains the focused identity regression.
