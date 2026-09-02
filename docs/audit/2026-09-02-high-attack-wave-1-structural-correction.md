# High Attack Battle Stream Wave 1 Structural Correction

Status: **implemented; independent re-review pending**

Finding addressed: `HABSW1-SR-F01`

Accepted base: `bbec5a2b426330b094c07d18ab5b35446564e712`

## Outcome and scope

The correction preserves the accepted 140-byte executable boundary for `func_0021C8DC` and the
eight-byte non-executable padding classification. An ordinary exact C target can now own only
`.ob64.r4033.s0`; the retained Phase 7 assembly object remains the sole owner of
`.ob64.r4033.s1`.

The correction is limited to the split-row active-owner path and its focused regression. It does
not activate or modify the archived Matching-C candidate, change the accepted assembly, add hybrid
code, alter compiler identity, add the inactive `func_0021CBC4` linkage contract, or revise the
other supported Wave 1 audit conclusions.

## Corrected behavior

1. `resolveAcceptedRows` now gives a selected executable slice its own logical extent. For row
   4033, the sole C owner is `logicalOffset = 0`, `logicalEnd = 140`, and `bytes = 140`.
2. Phase 8 derives non-target slices from the same accepted row. A partially replaced row is
   represented as `mixed-matching-c-and-assembly`, with ownership recorded on each slice.
3. The existing fallback-pruning census removes only `.ob64.r4033.s0` and proves every other
   accepted section is byte-identical before and after pruning.
4. The real Phase 8 verifier requires the C object to contain `.s0` and not `.s1`, requires the
   pruned assembly object to retain `.s1` with the accepted bytes, and requires the linked ELF and
   canonical ROM bytes to remain exact.
5. The linker-map owner check requires `.s0` to have exactly one C-object contribution and `.s1`
   to have exactly one `objects/assembly/chunk_033.o` contribution with no C collision.
6. The external layout verifier requires the matching-C and retained-assembly slice provenance,
   execution classification, placement, source/fallback identity, and linked-owner paths to agree
   with the accepted row.

## Claims and evidence grades

| Claim | Grade | Review status | Evidence |
| --- | --- | --- | --- |
| The active owner logical extent is exactly 140 bytes | Verified | Pending | Real resolver output and downstream linked-target census |
| `.ob64.r4033.s0` can be solely C-owned while `.ob64.r4033.s1` remains assembly-owned | Verified | Pending | Test-only exact PURE_C compile, fallback pruning, linked map/ELF inspection, and exact ROM |
| Split-row execution, placement, bytes, and provenance remain fail-closed | Verified | Pending | Eight targeted mutation rejections in the end-to-end regression |
| Existing source-policy, auxiliary, multi-owner, and unrelated-owner protections remain unchanged | Supported | Pending | Existing affected structural suites and 500-target Phase 8 mutation suite |

The claims are structural and build-contract claims only. They do not activate the candidate or
strengthen any semantic name.

## Focused end-to-end regression

`tests/split_row_phase8.js` generates the exact known C expression only under ignored build output
and classifies it through the ordinary source-policy implementation. The source class is
`PURE_C`; active configuration and the archived candidate remain untouched.

The regression reaches the real Phase 8 compiler, source-to-object proof, fallback pruning, object
manifest, linker, raw target comparison, layout writer/verifier, map and ELF ownership checks, and
complete-ROM comparison. It verifies:

- `.ob64.r4033.s0`: 140 bytes, sole owner `objects/c/func_0021C8DC.o`;
- `.ob64.r4033.s1`: eight zero bytes, non-executable, sole owner
  `objects/assembly/chunk_033.o`;
- canonical ROM SHA-256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`; and
- rejection of whole-row logical extent, either map owner, retained-slice execution, placement,
  bytes, and both C/assembly layout-provenance mutations.

Final focused report:

`C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\tests\split-row-phase8-p5VDyu\split-row-phase8-test-report.json`

SHA-256: `1B9CF5D858BAF5313C1EEFD7C566A9340B532508CB04431BC4267B73A27A05AA`

## Changed surfaces

- `tools/lib/active_targets.js` — slice-local logical end.
- `tools/lib/phase8_matching_c.js` — retained-slice derivation, mixed layout/provenance, map/ELF
  ownership verification, and verification-model support.
- `tests/active_targets.js` — exact logical-offset/end assertion.
- `tests/split_row_phase8.js` — test-only exact PURE_C end-to-end regression and falsifiers.
- Assigned claim, task log, and this correction report.

No configuration, active target, linkage contract, candidate source, assembly source, compiler
contract, or prior audit/review artifact changed.

## Final verification

| Check | Result |
| --- | --- |
| `node tests/active_targets.js` | Pass; 500 active targets |
| `node tests/load_slab_00087200.js` | Pass; 435 owners and four affected owners |
| `node tests/split_row_phase8.js` | Pass; exact PURE_C split-row ROM and eight rejected mutations |
| `node tests/phase7_conventional_build.js --output <accepted phase7>` | Pass; execution, placement, and slab mutations rejected |
| `node tests/multi_owner_phase8.js` | Pass; unrelated two-row owner remains exact |
| `node tools/build.js` | Pass; fresh ordinary CURRENT build, fingerprint `5F88B366F2C4E722A3B44A170601B5FBF94C3F32D9E52C2BB219A015DD8D7576`, exact ROM |
| `node tests/phase8_matching_c.js --output <final current phase8>` | Pass; 500 targets, 439 PURE_C, 61 HYBRID_C, zero UNKNOWN, three auxiliary sections, exact ROM, and existing mutations rejected |
| `node tools/audit.js` | Pass; Structural protections and CURRENT exact ROM |
| `node tools/verify.js` | Pass; baserom identity, toolchain, source policy, C linker ownership, placement, relocations, exact target bytes, and Full ROM EXACT |

The complete verifier retained the generated counts: 439 `PURE_C` functions / 27,024 bytes and 61
`HYBRID_C` functions / 32,928 bytes. The final CURRENT ROM SHA-256 is
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Failed paths and limits

- The frozen reviewed implementation reproduced the reported failure: a 140-byte owner carried
  `logicalEnd = 148`, and the layout writer rejected its two-slice row.
- A broader correction draft duplicated retained-slice evidence in additional manifest and build
  replacement fields. It was removed because existing fallback-pruning evidence plus the external
  layout and verifier records already provide the required proof.
- The test-only source proves build-path support; it is not an activation or a new Matching-C
  acceptance claim. Independent structural re-review remains required.

## Evidence index

- Assigned claim:
  `docs/Plans/task-logs/ob64-high-attack-wave1-structural-correction-20260902-r1-HABSW1-SC-20260902-01.claim.json`,
  SHA-256 `6277609EAAA1A5A1C51A70A48585AA3E1869345D928672006A8FFE6F3849CCC1`.
- Task log:
  `docs/Plans/task-logs/ob64-high-attack-wave1-structural-correction-20260902-r1-HABSW1-SC-20260902-01.md`.
- Independent finding:
  `docs/audit/2026-09-02-high-attack-wave-1-structural-independent-review.md`,
  finding `HABSW1-SR-F01`.
- Accepted Phase 7 baseline:
  `C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\baseline\d2702dd336536d344b5b3d94\phase7`.
- Focused split-row report and hash: listed above.
- Final CURRENT Phase 8 build:
  `C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\current\5f88b366f2c4e722a3b44a17\build`;
  build-report SHA-256 `71FB0211D988FD19BAA5C7B63F146A9E08D92B1F1972B61A9FA06770D3E7B262`.
- Heavyweight audit report: `build/audit/report.json`, SHA-256
  `9A528ADC98A11718D6AFD3BF852CC8B172D154D82A20A774202AA3C8515E135F`.
- Complete-verifier report: `build/current/verification.json`, SHA-256
  `C4B3D503A7D1A1FB9ECC6CCC8725763D58B67F080FF923633074C8D905252D30`.

## Protocol deviations and canonical-document impact

No protocol deviation occurred. No canonical workflow, source-policy, active-queue, original audit,
or independent-review document is proposed for modification. The correction report and task log
are the only new durable explanatory records.

## Next action

Route this uncommitted correction through proportional independent re-review of
`HABSW1-SR-F01`, including the split-row positive path and its owner, execution, placement, byte,
and provenance falsifiers.
