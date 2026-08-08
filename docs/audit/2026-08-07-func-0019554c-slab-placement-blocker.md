# `func_0019554C` non-descriptor slab placement blocker

Date: 2026-08-07
Scope: structural investigation and accepted-model correction; no source-owner or C translation change
Status: implemented; worker audit PASS; independent structural review PASS

## Finding

The accepted build model is missing a placement class for code/data slabs loaded manually by
retail game code. It currently models:

1. the early-boot linear region;
2. the 19 fixed overlay descriptors; and
3. every other range as `rom-only`, with VMA equal to its ROM offset.

`func_0019554C` is in a manually loaded slab, not in the fixed descriptor table. The model therefore
assigns owner `p3063` VMA `0x0019554C`, while retail loads and executes it at `0x802150BC`.

The root cause is **missing non-descriptor load-slab metadata**. The wrong VMA is the consequence of
the current `rom-only` fallback. The linker already supports separate runtime and ROM addresses via
`section VMA : AT(ROM LMA)`, so the core linker mechanism does not need replacement.

## Direct observations

### Accepted-model behavior

- `config/splat/us_rev0.overlay-linker-inputs.json` contains the primary ROM rows and the 19 fixed
  descriptor reservations, but no record for loader-managed slabs.
- `tools/lib/phase7_conventional.js::loadAcceptedModel()` checks fixed descriptor containment,
  then the early-boot range, and otherwise assigns `placementKind = "rom-only"` and
  `vramStart = romStart`.
- `tools/lib/phase7_conventional.js::renderLinkerScript()` already emits each slice at
  `slice.vramStart` with `AT(slice.romStart)` and asserts both addresses.
- `tools/lib/phase7_conventional.js::verifyElfAgainstModel()` already requires a PT_LOAD whose
  virtual address is the modeled VMA and whose physical/load address is the ROM offset.

### Retail loader behavior

Two accepted-assembly paths contain the same cache/DMA sequence:

- `asm/original/rev0/lib/func_00102FA0.s`, around z64 `0x00103688..0x00103704`;
- `asm/original/rev0/lib/func_00105CC0.s`, around z64 `0x001069C0..0x00106A28`.

For the affected selection, retail performs:

```text
I-cache range: 0x80214F80..0x802172B0
D-cache range: 0x802172B0..0x80217350
DMA source:    0x00195410..0x001977E0
DMA target:    0x80214F80..0x80217350
bytes:         0x23D0 (9,168)
delta:         +0x8007FB70
```

The parent report `docs/squad-override-retail-callpath-report-20260807.md` independently records
this load and the live call path. The accepted overlay-atlas product contains two independent
post-load snapshots with a validated continuous code slab from ROM
`0x00195410..0x00197738` at RAM offset `0x00214F80..0x002172A8`, with five direct function
anchors and no conflicts. Adding the cached KSEG0 prefix gives the same live addresses above.

### Fixed-descriptor relationship

Fixed descriptor 9 reserves VMA `0x801FDA70..0x80220F40`; its initialized data ends at
`0x80214E50` and its BSS ends at `0x80214F80`. The manual slab begins exactly at that BSS end and
fits inside the remaining reservation. Its ROM source and delta are unrelated to descriptor 9's
initialized image.

The loader functions happen to execute from fixed descriptor 7. That does not make the loaded
payload part of descriptor 7. Do not add a fake descriptor, change the 19-entry descriptor count,
or extend descriptor 9's ROM mapping.

## Complete affected range

| Owner | Accepted ROM range | Correct runtime VMA | Bytes | Accepted class |
|---|---:|---:|---:|---|
| `p3062` | `0x00195410..0x0019554C` | `0x80214F80..0x802150BC` | 316 | code |
| `p3063` | `0x0019554C..0x001957D0` | `0x802150BC..0x80215340` | 644 | code |
| `p3064` | `0x001957D0..0x00195D9C` | `0x80215340..0x8021590C` | 1,484 | code |
| `p3065` | `0x00195D9C..0x001960A8` | `0x8021590C..0x80215C18` | 780 | code |
| `p3066` | `0x001960A8..0x00197738` | `0x80215C18..0x802172A8` | 5,776 | code |
| `p3067` | `0x00197738..0x001977E0` | `0x802172A8..0x80217350` | 168 | data |

Important boundary distinctions:

- accepted executable owners occupy `0x00195410..0x00197738` (9,000 bytes);
- the retail I-cache range extends to `0x00197740` (9,008 bytes);
- the extra eight I-cache bytes are the two leading zero words of data owner `p3067`;
- data-cache coverage is `0x00197740..0x001977E0` (160 bytes);
- `p3061` ends exactly at the slab start and is outside this mapping;
- `p3068` begins exactly at the slab end and is outside this mapping.

Do not move a function/data boundary merely to make the cache split coincide with an owner edge.

## Concrete failure mechanism

At runtime, `func_0019554C + 0x80` is `0x8021513C`. Retail therefore contains:

```text
j 0x8021513C -> 0x0808544F
```

Linking the section at its ROM offset instead treats the target as `0x001955CC` and produces:

```text
j 0x001955CC -> 0x08065573
```

External `R_MIPS_26` relocations also appear cross-region when the caller is modeled in the
`0x00xxxxxx` region and its runtime callees are in `0x80xxxxxx`. Correcting the caller slab VMA puts
the link-time caller and callees in the proper MIPS J-type region and removes the truncation
condition.

## Recommended smallest implementation

The implementation should be generic, while the accepted data should initially contain only this
proven slab. Do not add a target-local address override.

Recommended accepted configuration in `config/phase7/conventional-build.json`:

```json
"nonDescriptorLoadSlabs": [
  {
    "id": "scenario-loader-00195410",
    "kind": "loader-dma",
    "romStart": 1659920,
    "romEndExclusive": 1669088,
    "vramStart": 2149666688,
    "vramEndExclusive": 2149675856
  }
]
```

Also add `expected.nonDescriptorLoadSlabs = 1`. If the configuration schema is bumped, update all
consumers consistently; do not silently weaken the schema gate.

In `tools/lib/phase7_conventional.js`:

1. Load and validate `nonDescriptorLoadSlabs`.
2. Require safe integer/aligned endpoints, positive equal ROM/VMA lengths, unique IDs, and unique
   ROM containment.
3. Fail if a source slice is covered by both a fixed descriptor and a non-descriptor slab, or by
   multiple slabs.
4. Include slab ROM endpoints among slice cuts. For this record the endpoints already match owner
   boundaries, so accepted slice and split-owner counts should not change.
5. Before the early-boot/`rom-only` fallback, assign a contained slice:

   ```text
   placementKind = "non-descriptor-load-slab"
   loadSlabId = slab.id
   overlayDescriptorId = null
   vramStart = slab.vramStart + (romStart - slab.romStart)
   ```

6. Return the slab records in the accepted model and expose the count in build/verification reports.

In `tools/build_phase7_conventional.js`, include `loadSlabId` and a top-level slab summary in the
generated layout so the placement is inspectable. Update `tests/phase7_conventional_build.js` to
assert the complete owner table above and to retain the existing VMA/LMA mutation rejection.

No change should be required in `renderLinkerScript()`: the expected `p3063` form is

```ld
.ob64.r3063 0x802150BC : AT(0x0019554C)
```

The Splat primary rows may remain `bin`; `config/segments/rev0.yaml`,
`config/splat/us_rev0.yaml`, and the fixed overlay descriptor artifact should retain their current
boundaries and semantics.

## Required structural verification

Run the heavyweight structural workflow after implementation:

1. Authenticate the normalized US Rev 0 baserom and pinned compiler/binutils.
2. Verify the 19 fixed descriptors, groups, pointers, and raw descriptor bytes remain unchanged.
3. Verify the slab record against both retail loader sites and the full owner table.
4. Verify `p3062..p3066` remain executable, `p3067` remains data, and `p3061`/`p3068` are not
   assigned this slab.
5. Inspect the generated linker script, map, ELF sections, and PT_LOAD headers. Every affected
   section must use its runtime VMA and original ROM LMA.
6. Build an original-assembly baseline under the corrected model and require exact code-region and
   complete-ROM identity.
7. Build the current source tree and require exact complete-ROM identity and unambiguous ownership.
8. When `func_0019554C` is later activated as a C target, require `PURE_C`, sole C ownership,
   accepted 644-byte size, exact target bytes, exact full ROM, normalized relocations, no truncated
   `R_MIPS_26`, and runtime-PC decoding of all linked `j`/`jal` instructions.
9. Run `node tools/audit.js` and preserve its ignored generated report.

The pre-change audit completed successfully with current ROM SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` and code-region SHA-256
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`. That exact result does not
validate the old VMA: tracked `.word` assembly can reproduce retail instruction words even when the
ELF section address is structurally wrong.

## Independent review

An independent reviewer should, from a fresh build/output root:

- decode the two loader sequences and recompute the range, length, cache split, and delta;
- verify the accepted owner boundaries and the two runtime-atlas observations;
- try to falsify slab start/end containment using `p3061`, `p3067`, and `p3068`;
- verify that no fixed descriptor was added or changed;
- inspect each affected section's VMA and LMA in the linker script, map, ELF section table, and
  program headers;
- confirm relocation diagnostics are clean; and
- reproduce exact baseline and current full-ROM hashes.

## Implementation and acceptance result

The correction was implemented as recommended:

- `config/phase7/conventional-build.json` now has
  `expected.nonDescriptorLoadSlabs = 1` and the single proven
  `scenario-loader-00195410` record.
- `loadAcceptedModel()` validates the slab records, includes their ROM endpoints in owner cuts,
  rejects non-unique or fixed-descriptor-ambiguous ROM coverage, and assigns contained slices
  `placementKind = "non-descriptor-load-slab"`, the slab ID, a null fixed-descriptor ID, and the
  slab-derived VMA.
- Every slice now carries `loadSlabId`, including null for unaffected slices. The accepted model
  returns the slab records and count. Generated Phase 7/8 layouts retain a top-level slab summary
  and per-slice slab identity, and conventional verification reports the slab count.
- The Phase 7 configuration was added to the current-workflow baseline fingerprint so a later
  metadata-only slab change cannot reuse a stale structural baseline.
- The schema remains version 1. This is an additive field in the single centralized Phase 7
  configuration reader; the existing version gate remains strict, and every consumer was updated.
- `renderLinkerScript()` was not changed. Its existing VMA plus `AT(ROM LMA)` form produced the
  required placement for all six owners.

The focused Phase 7 test asserts the complete `p3062..p3067` ROM/VMA/class/executable table,
excludes `p3061` and `p3068`, checks the generated layout and linker form, and rejects VMA drift,
ROM-LMA drift, malformed or unaligned records, duplicate IDs, overlapping slab ROM coverage,
fixed-descriptor ambiguity, unequal lengths, and count drift. Accepted counts remain 7,242 owner
rows, 7,251 link slices, 9 split owners, and 19 fixed overlay reservations, with one separate
non-descriptor load slab.

Worker verification produced:

```text
Original-assembly baseline ROM SHA-256:
571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A

Current accepted-source ROM SHA-256:
571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A

Baseline and current code-region SHA-256:
40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409
```

`node tools/audit.js` generated a passing ignored `build/audit/report.json`. The normal current
verifier also passed baserom identity, toolchain, source policy, linker ownership, placement,
relocations, exact target bytes, and exact full ROM. Regenerating the fixed overlay configuration
from the authenticated ROM preserved all 19 descriptors, 11 groups, and 11 pointers exactly;
`config/overlays/us_rev0.json` remains SHA-256
`D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6`.

The generated linker script, map, ELF section table, and PT_LOAD headers all agree on the complete
placement table above. `p3062..p3066` are executable PT_LOAD segments, `p3067` is non-executable,
and every segment retains its original ROM LMA. The current map continues to link p3063 solely
from `objects/assembly/chunk_025.o`; the experimental C file was not activated.

An isolated, non-acceptance diagnostic compiled the pre-existing C file without modifying it. Its
text is 640 bytes versus the accepted 644-byte owner. Linking that same object at VMA `0x802150BC`
with LMA `0x0019554C` produced zero truncated `R_MIPS_26` relocations and encoded the internal jump
at owner offset `0x64` as `0x0808544F`, targeting `func_0019554C + 0x80 = 0x8021513C`. The old
ROM-based VMA control was rejected with nine truncated `R_MIPS_26` relocations; forced output
encoded the internal jump as `0x08065573`. This proves the structural blocker is removed but is
not a matching-C claim.

The independent reviewer used fresh external Phase 7 and Phase 8 output roots, independently
recomputed the loader range/delta and boundaries, reproduced both exact hashes, checked raw fixed
descriptor bytes, inspected every affected VMA/LMA and PT_LOAD, reran the mutation tests, and
repeated the isolated relocation diagnostic. Technical verdict: PASS with no correctness,
ownership, relocation, or descriptor-regression finding. The external review report SHA-256 is
`39F53BE615ECC8B5D247094E6CA3F1DF2535A949E7DD9821D010446E6C8D56B4`.

The reviewer disclosed one protocol-only deviation: a `--help` probe regenerated the ignored
`build/toolchain-smoke/binutils-smoke-report.json`. No tracked source or configuration file changed,
and the technical review result was unaffected.

There was no structural deviation from this report's recommendation. The only additional defensive
change was including the Phase 7 configuration in the cached-baseline fingerprint, required so the
generic metadata mechanism cannot silently reuse an output generated from older slab records.

## Scope and remaining uncertainty

This one record fixes the proven scenario-loader slab. It does not establish that every current
`rom-only` code owner is truly ROM-only. Accepted assembly already shows other ROM ranges being
loaded manually into reusable runtime slots; those require separate structural evidence and should
later use the same generic placement mechanism.

Do not apply `+0x8007FB70` outside `0x00195410..0x001977E0` without direct evidence.

The pre-existing untracked `src/lib/func_0019554C.c` and its experimental build artifacts are not
part of this structural finding. The observed experimental C output is still shorter than the
accepted 644-byte owner, so correcting placement is necessary but does not by itself complete the
C match.
