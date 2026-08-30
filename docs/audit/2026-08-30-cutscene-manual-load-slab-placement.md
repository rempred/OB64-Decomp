# Cutscene manual-load slab placement audit

Date: 2026-08-30

## Scope and baseline

This audit covers the runtime placement needed by `func_002A05EC`, `func_002A13EC`,
`func_002a3198`, `func_002A0B14`, and `func_002A0EF0`. It does not infer placement from ROM
proximity. The accepted loader operands, the transfer length, the linked control-flow words, and
two bounded RAM snapshots were checked independently.

Before the placement edit, `node tools/verify.js` passed from clean commit
`f8f8081671a44e1eb47cbe17b383b53b340c6c3e` with a byte-identical Rev 0 ROM. The verifier
reported 386 exact `PURE_C` functions / 18,844 bytes and 60 exact `HYBRID_C` functions / 33,272
bytes. This is the pre-change comparison baseline.

The implemented structural change is one `nonDescriptorLoadSlabs` record. It changes only the
linked VMA of the existing accepted owners in the mapped interval. It does not change their ROM
LMAs, boundaries, source ownership, segmentation, executable classification, or the 19 fixed
overlay descriptors.

## Accepted mapping

```text
id:                 loader-dma-0029a4c0
kind:               loader-dma
ROM:                0x0029A4C0..0x002A8D20
runtime:            0x8022AC90..0x802394F0
ROM length:         0x0000E860
runtime length:     0x0000E860
ROM-to-live delta:  +0x7FF907D0
accepted owners:    p5293..p5455 (163 unsplit owners)
```

All five requested targets are contained by this one transfer. No second mapping is needed for
them. The adjacent ROM interval beginning at `0x002A8D20` is loaded by a separate call to a
different runtime destination and is not included in this record.

## Direct loader and DMA evidence

The accepted resource dispatcher `func_002827EC` contains the relevant load sequence. The
canonical reference bytes remain available in
`asm/original/rev0/lib/func_002827EC.s`; the current exact `PURE_C` owner and its reviewed
relocation contract reproduce the same instructions and operands.

The first applicable dispatcher arm performs these operations:

| Retail ROM PC | Operation | Accepted operand |
|---:|---|---:|
| `0x00282868..0x0028287C` | instruction-cache invalidation | `0x8022AC90..0x80238A90` |
| `0x00282880..0x00282894` | data-cache invalidation | `0x80238A90..0x802394F0` |
| `0x00282898..0x002828B4` | call `0x8009DA50` (`func_0002de50`) | ROM `0x0029A4C0`, RAM `0x8022AC90`, length `0x002A8D20 - 0x0029A4C0` |
| `0x002828B8..0x002828D4` | conditional BSS clear | `0x802394F0..0x802395C0` |

The same ROM start, destination, and ROM end are also emitted by the dispatcher arms beginning at
ROM `0x00282A7C`, `0x00282B9C`, `0x00282CC8`, and `0x00282DE8`. The accepted linkage symbols are
`overlay_29a4c0_dma_rom_start`, `overlay_29a4c0_dma_text_start`, and
`overlay_29a4c0_dma_rom_end`. Their values are part of the exact source-to-object and relocation
proof for `func_002827EC`; they are not inferred from the new slab record.

The source and destination intervals both have length `0xE860`. The BSS begins exactly at the
runtime transfer end and is cleared rather than sourced from ROM. The scenario-loader
`+0x8007FB70` delta is unrelated and was not reused.

## RAM-image corroboration and endpoint falsifier

Two read-only 8 MiB parent-research snapshots independently contain the transfer bytes at the
loader destination:

| Snapshot | SHA-256 |
|---|---|
| `08_mission_briefing_transition_to_scenario_overview.bin` | `20F3A8FD45A988430F88D6E3BDC0851607CACB711D3BDED2D0A8BEFC6C74F41C` |
| `09_mission_briefing_scenario_overview.bin` | `DC535D10E982A8E77386CF6B9DBCB42A6FBFCA49436E698736E8CD3C603166D2` |

In each snapshot, loader ROM `0x0029A4C0..0x002A8D20` equals physical RAM
`0x0022AC90..0x002394F0` byte-for-byte. A maximal byte-equality scan extends 12 bytes earlier to
ROM `0x0029A4B4` / physical RAM `0x0022AC84`, but those 12 bytes are zeros in both sources. They
are rejected as an accidental equality because the direct loader source and destination begin 12
bytes later. The byte immediately after the transfer is `0x27` in ROM and `0x00` in both RAM
snapshots, so the maximal run ends exactly at the direct loader end.

The snapshots corroborate residence. The direct loader operands establish the accepted mapping
endpoints.

## Requested target placement

| Target | Accepted ROM range | Accepted runtime range | Owner(s) |
|---|---:|---:|---:|
| `func_002A05EC` | `0x002A05EC..0x002A0680` | `0x80230DBC..0x80230E50` | p5359 |
| `func_002A13EC` | `0x002A13EC..0x002A1484` | `0x80231BBC..0x80231C54` | p5371 |
| `func_002a3198` | `0x002A3198..0x002A3310` | `0x80233968..0x80233AE0` | p5397 |
| `func_002A0B14` | `0x002A0B14..0x002A0E2C` | `0x802312E4..0x802315FC` | p5364 |
| `func_002A0EF0` | `0x002A0EF0..0x002A135C` | `0x802316C0..0x80231B2C` | p5366 + p5367 |

`func_002A0EF0` crosses the existing chunk boundary at ROM `0x002A1000`. Both accepted owners
remain intact and receive contiguous VMAs under the same slab.

## Local-jump resolution

Retail placement-sensitive local jumps were decoded from their stored words using the accepted
runtime PC. The regression test locks the following resolutions:

| Function | Retail jump PC(s) | Runtime target |
|---|---:|---:|
| `func_002A05EC` | `0x002A060C` | `0x80230DE8` |
| `func_002A13EC` | `0x002A1458` | `0x80231C4C` |
| `func_002a3198` | `0x002A31E4` | `0x802339C0` |
| `func_002a3198` | `0x002A323C`, `0x002A324C`, `0x002A3260`, `0x002A3284` | `0x80233A8C` |
| `func_002a3198` | `0x002A32BC` | `0x80233AB8` |

These words are incompatible with ROM-linear placement and agree with the one accepted loader
mapping. External calls remain separate relocation evidence.

## `func_002a3198` final eight bytes

The accepted source owner remains p5397, ROM `0x002A3198..0x002A3310`, 376 bytes, for this first
structural change. No boundary or padding contract is introduced here.

The final control-flow evidence is:

- ROM `0x002A3300` is `jr $ra` (`0x03E00008`);
- ROM `0x002A3304` is its stack-restoring delay slot (`0x27BD0030`);
- ROM `0x002A3308..0x002A3310` is eight zero bytes with SHA-256
  `AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC`;
- no direct branch or jump in the 368-byte body targets either zero word; and
- the accepted successor begins at `0x002A3310` with the first instruction of a frameless
  matrix-transform routine.

The parent static function record independently ends `func_002a3198` on the return delay slot and
reports a 368-byte function. More importantly, the authenticated acceptance compiler and
assembler reproduced the candidate as a 368-byte `PURE_C` object:

```text
source SHA-256:              A5DE536B78D74A35EEA9D0749F88C1A837F09E1AEC582F5C6CA283D114B39073
unlinked .text SHA-256:      C5F2CB0C61FEF7CA415B2EEAAC99F851D967C308FB1527349334EE0EBBE4D2CE
load-relevant relocations:   7 R_MIPS_26 (one external call, six local jumps)
linked 368-byte SHA-256:     0FF565A9DDDB20B89B4CB55D8270F8784EB005DA97E1DFC7828C02EA1EAFE04F
retail 368-byte SHA-256:     0FF565A9DDDB20B89B4CB55D8270F8784EB005DA97E1DFC7828C02EA1EAFE04F
remaining owner bytes:       8 zero bytes
```

Thus the direct evidence supports classifying the final eight bytes as structural trailing
alignment padding, not function-owned executable instructions. Changing the accepted target
extent or introducing a primary-text padding contract remains gated on independent structural
review. Until that review is accepted, p5397 remains the complete 376-byte assembly owner.

## Validation and non-regression

`tests/phase7_conventional_build.js` now fails closed on:

- the exact fourth slab record and count;
- equal ROM/runtime lengths and equal endpoint deltas;
- all 163 contained owners and both outside neighbors;
- exact VMA/LMA placement for all requested target owners;
- the direct loader operand words;
- the placement-sensitive local-jump words and decoded runtime targets;
- the retained 376-byte p5397 owner, return/delay-slot words, trailing zeros, successor boundary,
  and absence of direct control flow into the final eight bytes;
- unique slab containment, fixed-descriptor non-overlap, and 19 fixed descriptors; and
- generic rejection of malformed endpoints, unequal lengths, duplicate IDs, slab overlap,
  descriptor overlap, and count drift.

After the edit, the focused Phase 7 conventional-build test passed against the rebuilt ELF, map,
and ROM. A complete `node tools/verify.js` run again reported exact target ownership, placement,
relocations, target bytes, and a byte-identical complete ROM with the unchanged 386 `PURE_C` / 60
`HYBRID_C` exact counts.

## Smallest useful falsifiers

Reject or revise the slab if an authenticated loader trace gives different transfer endpoints, if
retail executes these local jumps at an incompatible VMA, or if an accepted fixed descriptor is
shown to own any source byte in this ROM interval.

Reject or revise the padding conclusion if a direct control-flow target enters either final word,
if authenticated compiler/source evidence emits them as part of the function body, or if
independent review finds the 368-byte compiler comparison or successor boundary unsound.

## Review status

The structural implementation and worker verification are complete. Independent read-only
structural review is still required before Step 2 begins.
