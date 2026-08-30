# `func_002A0EF0`: Multi-Owner PURE_C Retry

## Status

This is a blocked `PURE_C` research candidate. The accepted target remains the two original
assembly owners `p5366` and `p5367`.

- Candidate ID: `1BDCE1A7D7A89052910BAE751D68084456C5C0FAC6D4280D4303ADE34A4F3916`
- Source: `docs/archive/matching-c-candidates/2026-08-30-func_002A0EF0-1bdce1a7d7.c`
- Source SHA-256: `D242158C1822796AF4D3D1313A4556B5D6DE0CB4C34D263ED984DF2EF4F19949`
- Source class: `PURE_C`
- Logical target: ROM `0x002A0EF0..0x002A135C`, runtime
  `0x802316C0..0x80231B2C`
- Preserved owners: `p5366` (`272` bytes) and `p5367` (`860` bytes)
- Canonical linked candidate SHA-256:
  `F98E639EA68DDB58CC12F0693628A6B1CB5CD921C4C47948D7C8020E07F462E0`
- Retail target SHA-256:
  `2204F4F99EB1C954D82732B70FDF9B25C86765080659261FA66E21BBDBF6BBE6`

The canonical linked diff reproduced an exact 1,132-byte/283-instruction extent but reported
`351` differing bytes across `141` instruction words. This improves the earlier archived
candidate's `618` bytes / `208` words by `267` bytes and `67` words, but it is not Matching C.

Per accepted owner, the head differs by `133` bytes / `52` words and the continuation differs by
`218` bytes / `89` words. The first differing byte is target offset `0x5`; the first instruction
divergence is the prologue save at offset `0x4` (`sw $s3, 0x1C($sp)` instead of
`sw $s4, 0x20($sp)`).

## Reconstructed source change

The archived lead produced 1,136 bytes through the canonical untouched assembler even though the
matching workbench's COP1 legalization path compared 1,132 bytes. The retry independently isolated
the extra canonical hazard instruction, then rewrote the 28-entry proximity search as a structured
loop and materialized both floating-point deltas before their integer absolute-value tests. The
canonical compiler/assembler result then fit the accepted 1,132-byte range without inline assembly
or generated-assembly rewriting.

Static width corrections also changed the mode check at `0x8018FC19` to `u8`, the motion countdown
read at `+0x0C` to signed `s16`, and used the established runtime-address linkage spelling for the
free helper. These changes were independently checked against the retail instructions rather than
accepted from the archived source.

## Candidate relocation evidence

The exact-size compiler object has 22 relocations. The multi-owner splitter kept each relocation in
its owning section; no HI16/LO16 pair crosses the `0x110` logical seam.

| logical offsets | relocation | symbol |
|---|---|---|
| `0x028`, `0x02C` | `HI16`, `LO16` | `D_8022A974` |
| `0x090` | `R_MIPS_26` | local `.text` jump |
| `0x128`, `0x12C` | `HI16`, `LO16` | `D_8022A974` |
| `0x140` | `R_MIPS_26` | `func_00070F30` |
| `0x148`, `0x14C` | `HI16`, `LO16` | `D_8022A974` |
| `0x1D0` | `R_MIPS_26` | `func_001BC35C` |
| `0x1D8` | `R_MIPS_26` | local `.text` jump |
| `0x204` | `R_MIPS_26` | runtime `0x8023D178` |
| `0x228` | `R_MIPS_26` | `func_800712C4` |
| `0x230`, `0x234` | `HI16`, `LO16` | `D_8022A974` |
| `0x290` | `R_MIPS_26` | `func_001BC35C` |
| `0x2BC`, `0x2C0` | `HI16`, `LO16` | `D_8022A974` |
| `0x3B4` | `R_MIPS_26` | `sqrtf` |
| `0x414` | `R_MIPS_26` | local `.text` jump |
| `0x41C` | `R_MIPS_26` | `func_800712C4` |
| `0x424`, `0x428` | `HI16`, `LO16` | `D_8022A974` |

This table is research evidence only. Because target bytes differ, no relocation contract is active
in `config/matching-c-linkage.json`.

## Concrete PURE_C blocker

The remaining gap is distributed across meaningful control flow and register allocation:

- KMC assigns the outer index/constant pair to `$s3/$s4`; retail uses `$s4/$s3`.
- KMC assigns the motion/current-record and proximity-record families to `$s1/$s2`; retail uses
  `$s2/$s1`.
- The equal-record inner-loop case emits `bne + nop + j`; retail uses one `beql` with the increment
  in its delay slot.
- Both delta/absolute-value regions retain different floating-point scheduling and integer result
  registers.

Narrow signedness, declaration-order, literal-constant, combined-condition, explicit lifetime
reuse, and alternate delta-materialization probes were attempted. Variants that changed these
regions either made the accepted extent wrong or worsened the CFG. This is not a single
assembler-output defect suitable for a tiny logic-free hybrid shim. No `HYBRID_C` fallback was
retained.

## Naming sidecar

`cutscene_motion_integrator` is promoted as a `SUPPORTED_ALIAS`; the build symbol remains
`func_002A0EF0`.

Independent static evidence is sufficient for that cautious alias: the first pass walks 28 motion
slots, adds record `+0x00/+0x08` deltas to selected-object `+0x11C/+0x124`, refreshes `+0x120`,
decrements the signed countdown at `+0x0C`, and frees expired records. The second pass resolves the
paired slot stored at record byte `+0x03`, measures two-axis separation, and updates or frees its
proximity record. Existing live traces independently observe the coordinate writes, but the alias
promotion does not depend on a behavioral rename and does not establish stronger field semantics.

## Acceptance boundary

The canonical diff command was:

```text
node tools/diff.js func_002A0EF0
```

It proved the exact logical extent, two-owner C placement, and candidate relocations while the
target was temporarily active. It did not prove target bytes or a complete exact ROM. Activation
was withdrawn after the failed byte comparison, so both original assembly sources remain linked.
With the 22-relocation contract temporarily installed,
`node tools/verify.js --target func_002A0EF0 --require-pure` reached the complete-ROM gate and
failed closed on candidate ROM SHA-256
`BEAF2C3913A7C517E0362A071E6FC754F86613510E1F39693F7616DD9651112C`.
