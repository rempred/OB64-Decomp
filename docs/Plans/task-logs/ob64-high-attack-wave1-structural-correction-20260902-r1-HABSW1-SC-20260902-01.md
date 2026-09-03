# Task Log — High Attack Wave 1 Structural Correction

- Assignment: `ob64-high-attack-wave1-structural-correction-20260902`
- Revision: 1
- Role: correction-worker
- Review level: Critical
- Launch: `HABSW1-SC-20260902-01`
- Accepted base: `bbec5a2b426330b094c07d18ab5b35446564e712`
- Worktree: `C:\Users\Joe\Projects\OgreBattlel64\high-attack-wave-1-structural-audit`

## Protocol

At activation, the worktree was clean, on `codex/high-attack-wave-1-structural-audit`, and exactly
at the accepted base. The assigned claim, task log, and correction report did not exist. The prior
audit and independent-review records were present only as frozen historical records, consistent
with the assignment. No competing workspace change appeared before claim acquisition.

The assigned claim was created with create-only semantics at
`2026-09-02T17:02:04.9160031-04:00`, read back with the complete assigned identity, and has SHA-256
`6277609EAAA1A5A1C51A70A48585AA3E1869345D928672006A8FFE6F3849CCC1`.

No branch, worktree, commit, remote state, Matching-C candidate, assembly bytes, compiler identity,
inactive CBC4 linkage, original audit report, independent-review report, prior task log, or prior
claim will be changed by this correction.

## Correction plan

1. Reproduce `HABSW1-SR-F01` through the real resolver, owner census, fallback-pruning,
   layout/provenance, map/ELF ownership, and exact-ROM consumers.
2. Correct the logical extent and mixed C/assembly split-row representation at their narrowest
   shared boundary.
3. Add an end-to-end regression for exact 140-byte ownership of `.ob64.r4033.s0` with retained
   assembly ownership of `.ob64.r4033.s1`, plus causal negative mutations.
4. Run affected structural tests, the heavyweight audit, and one complete verifier after the final
   delta.

The strongest failure risk is accidentally pruning or reassigning `.ob64.r4033.s1`, or weakening
the ordinary owner census/layout proof to accept ambiguous slices. Acceptance therefore requires
the real linked owner, fallback, layout/provenance, map/ELF, and exact-ROM evidence, not only a
resolver unit assertion.

## Work record

- Baseline resolver reproduction: row 4033 has 148 bytes split into a 140-byte executable
  `.ob64.r4033.s0` and eight-byte non-executable `.ob64.r4033.s1`, while the resolved C owner
  incorrectly reports `logicalOffset = 0`, `logicalEnd = 148`, and `bytes = 140`.
- Consumer inspection confirmed the real linked-byte census requires `logicalEnd = target.bytes`,
  and the real Phase 8 layout writer rejects every target row with more than one slice.
- The retained-slice path already preserves non-target section bytes during fallback pruning, but
  Phase 8 does not yet record and verify that retained slice's layout/map ownership as explicit
  mixed C/assembly provenance.

Next method: correct the slice logical extent, add explicit retained-assembly-slice evidence to
the ordinary Phase 8 layout/map/provenance consumers, and exercise it through a test-only exact
PURE_C build.

### Implemented correction and first integration result

- The single-slice resolver now reports `logicalEnd = slice.bytes`, so the C owner has the exact
  logical extent `0..140`.
- Phase 8 derives retained accepted slices from the same resolved owner row and records the mixed
  row as `mixed-matching-c-and-assembly` rather than claiming the whole 148-byte row is C-owned.
- Existing fallback pruning continues to byte-check every non-target accepted section. Mixed-row
  layout, linked-ELF, linker-map, and verification evidence now identify `.ob64.r4033.s1` as
  retained assembly while `.ob64.r4033.s0` remains the sole C target section.
- `node tests/active_targets.js` passed with 500 active targets.
- `node tests/split_row_phase8.js` passed using a generated, test-only exact `PURE_C` source. It
  produced the canonical ROM SHA-256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` and rejected mutations of
  the logical end, both map owners, retained-slice execution, placement, bytes, and both C/assembly
  layout provenance records.
- The split-row test report is
  `C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\tests\split-row-phase8-nrKQUv\split-row-phase8-test-report.json`,
  SHA-256 `0BC9F0F990D986814C5FDD2173D41BA73EC52DB7EED9D4ECBBC6DFD3CF368E1F`.
- A broader first implementation draft duplicated retained-slice evidence in the object manifest
  and top-level build replacement record. Diff review showed those additions were redundant with
  the existing fallback-pruning byte census and the verifier evidence already embedded in the
  build report, so they were removed before the final delta.
- The narrowed split-row regression passed again at
  `C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\tests\split-row-phase8-VVEHNx\split-row-phase8-test-report.json`,
  SHA-256 `538656548BC030F4D94E6C0C65025C14D696E476F9D782931E17573936C1B5A2`.

Next method: run the pre-existing Phase 7, active-target, Phase 8, and multi-owner suites to verify
that execution, placement, source-policy, auxiliary, and unrelated-owner protections remain
unchanged before freezing the final delta.

### Final verification

- `node tests/active_targets.js` passed with 500 active targets.
- `node tests/load_slab_00087200.js` passed with 435 slab owners and all four affected owners.
- `node tests/phase7_conventional_build.js --output <accepted phase7>` passed, including the
  existing `func_0021C8DC` section and PT_LOAD execution mutations and all placement/slab
  mutations.
- `node tests/split_row_phase8.js` passed from the final implementation. It produced exact ROM
  SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` and rejected all eight
  split-row mutations. Final report:
  `C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\tests\split-row-phase8-p5VDyu\split-row-phase8-test-report.json`,
  SHA-256 `1B9CF5D858BAF5313C1EEFD7C566A9340B532508CB04431BC4267B73A27A05AA`.
- `node tests/multi_owner_phase8.js` passed; the unrelated two-row owner remained exact.
- `node tools/build.js` produced a fresh ordinary exact-ROM CURRENT build at fingerprint
  `5F88B366F2C4E722A3B44A170601B5FBF94C3F32D9E52C2BB219A015DD8D7576`.
- `node tests/phase8_matching_c.js --output <final current phase8>` passed: 500 targets, 439
  `PURE_C`, 61 `HYBRID_C`, zero `UNKNOWN`, three auxiliary sections, exact ROM, and all existing
  negative mutations rejected.
- `node tools/audit.js` passed both Structural protections and CURRENT exact ROM. Audit report
  SHA-256: `9A528ADC98A11718D6AFD3BF852CC8B172D154D82A20A774202AA3C8515E135F`.
- The single final `node tools/verify.js` passed baserom identity, toolchain, source policy, C
  linker ownership, target placement, relocations, exact target bytes, and Full ROM EXACT. Counts
  remained 439 `PURE_C` / 27,024 bytes and 61 `HYBRID_C` / 32,928 bytes. Verification report
  SHA-256: `C4B3D503A7D1A1FB9ECC6CCC8725763D58B67F080FF923633074C8D905252D30`.

`HABSW1-SR-F01` is resolved by the proposed uncommitted correction. Independent re-review remains
the Director's next gate.
