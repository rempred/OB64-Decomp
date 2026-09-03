# High Attack Battle Stream Wave 1 Structural Layout Verifier Correction

Status: **implemented; proportional independent re-review pending**

Finding addressed: `HABSW1-SR-F01`, narrowed residual from the correction independent re-review

Accepted HEAD: `2e77c5ea702498857a6a10dcc5dbd3609bf32cb5`

## Outcome

The ordinary Phase 8 external layout verifier now compares every existing accepted-row structural
field for both slices of the `func_0021C8DC` mixed row. A one-field contradiction in either the
matching-C slice or retained-assembly slice fails closed.

The positive build behavior was already correct and remains unchanged: an exact 140-byte C object
owns only `.ob64.r4033.s0`, retained assembly owns the eight-byte non-executable
`.ob64.r4033.s1`, map and ELF ownership are unambiguous, and the complete ROM is canonical. This
correction changes only the external layout verifier and focused regression coverage.

## Direct evidence

The accepted Phase 7 external layout projects these 12 structural fields for each slice:

1. `sectionName`
2. `romStart`
3. `romEndExclusive`
4. `vramStart`
5. `vramEndExclusive`
6. `placementKind`
7. `overlayDescriptorId`
8. `loadSlabId`
9. `overlaySection`
10. `executable`
11. `executableRangeId`
12. `nonExecutableRangeId`

Before this correction, the real reviewer harness rejected three existing controls but accepted
nine contradictory execution, ROM/VRAM, placement, slab, or range records. This reproduced the
re-review finding without changing source candidates or build inputs.

After this correction, the same harness rejects all 12 records. The end-to-end split-row test also
enumerates the accepted external-field keys and mutates each of the 12 fields independently on
both slices. It separately mutates accepted `inputKind` provenance through `baseInputKind` and the
effective Phase 8 `inputKind`. All 28 new one-field mutations and all eight existing
owner/extent/byte/provenance mutations are rejected.

The final test-only `PURE_C` fixture retains:

- matching-C section `.ob64.r4033.s0`;
- retained assembly section `.ob64.r4033.s1` owned by `objects/assembly/chunk_033.o`;
- exact source-to-object proof;
- exact canonical ROM SHA-256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`; and
- no active configuration or archived-candidate change.

Final focused report:

`C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\tests\split-row-phase8-X8lEE5\split-row-phase8-test-report.json`

SHA-256: `3925A3B21EE7FCCF65975196E072BB14CAEF973C06DDE4BDABF5244471649429`

## Evidence-backed correction

`verifyPhase8Layout` now resolves each emitted mixed-row slice back to exactly one accepted row
slice and compares the complete 12-field external structural projection. It also verifies that:

- the accepted source slice is still `tracked-assembly`;
- `baseInputKind` preserves that accepted provenance;
- the matching slice's effective `inputKind` is `matching-c`; and
- the retained slice's effective `inputKind` is `tracked-assembly`.

Existing ownership-decoration checks remain separate and intact: source and fallback identity,
matching symbol and logical offset, retained assembly identity and hash, and linked owner path.
The layout writer, accepted row model, resolver, pruning, linker, map, ELF, target-byte, and exact-
ROM paths were not changed.

The focused test has a field-census assertion against the actual Phase 7 external layout. If that
projection gains or loses a field, the test fails until verifier coverage is reviewed explicitly.

## Inference and limits

The passing one-field mutation census supports the bounded claim that contradictory existing
external structural fields cannot pass this verifier path. It does not create a new linkage
contract, alter ownership, activate `func_0021C8DC`, or establish new semantic evidence.

The four accepted Wave 1 ROM/owner conclusions remain inherited unchanged from their frozen audit
and reviews. This correction neither reopens nor strengthens them.

## Rejected alternatives

- Comparing only the nine fields named by the reviewer would leave other existing accepted fields
  without an explicit fail-closed proof. The final implementation covers the complete emitted
  projection instead.
- A first local draft compared all 21 internal slice-model fields. That exceeded the external
  contract because Phase 7 intentionally emits only the 12 structural fields above. It was
  discarded before final verification.
- Changing the writer, model, resolver, ownership, assembly, candidate, or linkage contract was
  unnecessary because the valid generated layout and positive build were already correct.

## Changed surfaces

- `tools/lib/phase8_matching_c.js` — complete accepted-slice structural comparison in the
  ordinary external layout verifier.
- `tests/split_row_phase8.js` — external field census and one-field mutation proof for both slices.
- Assigned immutable claim, task log, and this correction report.

No frozen prior report, task log, or claim changed.

## Verification

| Check | Result |
| --- | --- |
| `node build/reviewer/HABSW1-SRR-20260902-01/layout_mutations.js` | Pass after correction; all nine formerly accepted contradictions and all three controls rejected |
| `node tests/split_row_phase8.js` | Pass; exact `PURE_C` split-row fixture, exact ROM, and 36 mutations rejected |
| `node tests/multi_owner_phase8.js` | Pass; unrelated two-owner exact-ROM and structural fixtures preserved |
| `node tools/build.js` | Pass; fresh ordinary CURRENT exact-ROM build |
| `node tests/phase8_matching_c.js --output <final current build>` | Pass; 500 targets, existing generic negatives rejected, exact ROM |
| `node tools/audit.js` | Pass; Structural protections and CURRENT exact ROM |
| `node tools/verify.js` | Pass; baserom identity, toolchain, source policy, C linker ownership, placement, relocations, exact target bytes, and Full ROM EXACT |

Generated counts remain 439 `PURE_C` functions / 27,024 bytes and 61 `HYBRID_C` functions /
32,928 bytes. The final ROM SHA-256 remains
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Evidence hashes:

- split-row report:
  `3925A3B21EE7FCCF65975196E072BB14CAEF973C06DDE4BDABF5244471649429`;
- final build report:
  `71FB0211D988FD19BAA5C7B63F146A9E08D92B1F1972B61A9FA06770D3E7B262`;
- heavyweight audit report:
  `1D29324D34DF3D6E43A311A1F8E51399BB4AC1F7A88830BB9FD877537DAEF348`; and
- complete-verifier report:
  `C4B3D503A7D1A1FB9ECC6CCC8725763D58B67F080FF923633074C8D905252D30`.

## Remaining gate

The proposed uncommitted correction resolves the narrowed layout-verifier defect in
`HABSW1-SR-F01`. A proportional independent re-review of this five-file result remains required
before Director integration or downstream Matching-C routing.
