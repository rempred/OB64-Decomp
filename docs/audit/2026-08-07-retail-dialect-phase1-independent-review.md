# Retail dialect Phase 1 independent review

Accepted-with-notes. Phase 1 makes raw final linked-byte equality mandatory for `EXACT`. This blocks alias-equivalent false matches. The Director must freeze and accept this review before Phase 2 starts.

No worker correction is required. The notes concern generated-report compatibility and the limits of reused build artifacts.

## Frozen subject

- Commit: `eace7a5b63febfff0f3a53934e730cdedc4f33b6`.
- Parent commit: `042c7c02e0f86da664c8d34d01597a4e61c4eef3`.
- Worker AAR: `docs/audit/2026-08-07-retail-dialect-phase1-raw-exactness-aar.md`.
- Reviewer claim: `docs/Plans/task-logs/ob64-retail-dialect-phase1-review-r1-f17e033365004c818b1c94eeb5df4220.claim.json`.
- Inventory profile: `NORMAL`.

The technical files matched the frozen commit. Pre-existing dirty configuration and source work remained outside the reviewed diff.

## Verdict by required question

| Required question | Independent result |
|---|---|
| Does `EXACT` require both conditions? | Yes. A valid zero asm-differ score and raw equality are both mandatory. |
| Does comparison use accepted linked placement and retail identity? | Yes. It checks the final ELF section, virtual address, ROM load address, size, and canonical ROM identity. |
| Do invalid inputs fail closed? | Yes. Missing, duplicate, malformed, displaced, wrong-sized, and reference-drifted inputs raised errors. |
| Can preserved pure p3063 be mislabeled exact? | No. Its score stayed zero, but 14 raw bytes differed and `exact` was false. |
| Does `func_0002CD70` remain exact? | Yes. Its 48 linked bytes matched retail, including both required `0x00801025` words. |
| Did target state drift? | No. Target source, bytes, class, ownership, placement, relocations, tool pins, metadata, and queue files were unchanged. |
| Are tests independent enough? | Yes. Synthetic alias and relocation controls were supplemented by two real linked-ELF recomputations. |

## Direct code observations

`loadCanonicalBaserom()` checks the complete normalized ROM length and SHA-256 at `tools/lib/phase8_matching_c.js:56`.

`compareLinkedTargetBytes()` checks accepted target metadata at `tools/lib/phase8_matching_c.js:71`. It then requires exactly one target section and one matching load header.

The comparator checks executable section flags, accepted virtual address, ROM load address, file size, memory size, and raw bytes.

`summarizeTargetComparison()` validates a nonempty integer score at `tools/lib/phase8_matching_c.js:568`. It sets `exact` only from both conditions at line 605.

`runTargetAsmDiffer()` parses `phase8.elf` at `tools/lib/phase8_matching_c.js:662`. This prevents unresolved relocatable-object bytes from becoming the acceptance input.

The strict verifier reuses the same raw comparator at `tools/lib/phase8_matching_c.js:768`. The development command uses the combined result at `tools/diff.js:93`.

The display guard rejects inconsistent result objects at `tools/diff.js:36`. It reports a zero-score raw mismatch as `RAW BYTES DIFFER`.

## Real-artifact recomputation

The reviewer loaded each identified ELF and proof JSON directly. The worker summary was not used as the result source.

| Artifact | SHA-256 | Independent result |
|---|---|---|
| Preserved p3063 `phase8.elf` | `06468B39DE827B7CB570727596CA24280B056569200CB9AF626F0D67A70EAE0D` | Score `0 / 16100`; 14 differing bytes; `exact: false` |
| Preserved p3063 asm-differ JSON | `A59947E02BC309BCB91B0981E9B2DD2117E05A0D940F51AE067DEB2EFF18D2B7` | 161 nonempty rows |
| Accepted current `phase8.elf` | `D7D27A84287557F020B264D9F10D03CDE83CEFE0D9F930D6060EDFEC3F16F03B` | Final linked input for 36 accepted targets |
| Accepted `func_0002CD70` asm-differ JSON | `31330ECB9DF2D282C6D7CC6FAFE9D846AA4FA1323E9208A608251F1BAD4B6977` | Score `0 / 1100` |
| Canonical normalized ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | Accepted retail identity |
| Rebuilt normalized ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | Complete ROM equality |

The p3063 first differing byte was function-relative offset `+0x00B`. Fourteen instruction words contained differences.

The accepted `func_0002CD70` result used section `.ob64.r0714`. Its linked and expected target hashes both equal `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `func_0002CD70` linked entry | Accepted memory-fill routine entry | `0x8009C970` | RAM virtual address | Confirms accepted final section placement |
| `func_0002CD70` retail load | Canonical routine bytes | `0x0002CD70` | z64 ROM offset | Confirms accepted load placement |
| First retained retail OR | Copies the destination pointer | `+0x004` | Function-relative instruction offset | Contains raw word `0x00801025` |
| Second retained retail OR | Returns the destination pointer | `+0x028` | Function-relative instruction offset | Contains raw word `0x00801025` |

## Adversarial acceptance tests

These tests used in-memory copies of parsed, accepted artifacts. They did not alter the frozen result.

| Admissibility item | Record |
|---|---|
| Assigned claim | Invalid final linked inputs must not certify `EXACT`. |
| Supported producer | Accepted build and diff paths produce the linked ELF, load headers, model, and proof JSON. |
| Ordinary sequence | The diff or verifier reads those outputs after compilation and linking. |
| Material consequence | Acceptance of a displaced or wrong reference could certify nonretail bytes. |
| Smallest falsifier | Change one section, load, reference, or proof field in memory. |
| Evidence grade boundary | The test checks deterministic static verification only. |
| Threat model boundary | Each mutation represents a build, parser, metadata, or artifact defect. |

The following acceptance mutations all raised the intended error:

- missing target section;
- duplicate target section;
- displaced target virtual address;
- displaced ROM load address;
- wrong accepted target hash;
- wrong canonical ROM hash;
- malformed and out-of-range asm-differ scores; and
- malformed ELF section ranges.

The relocation control gave the comparator exact final linked bytes and nonexact unresolved object bytes. Only the final linked form passed.

## Commands and results

`node tests/diff_exactness.js`

Result: passed the alias mismatch, exact control, relocation control, and fifteen fail-closed mutations.

`node -` with a read-only PowerShell here-string importing `phase8_matching_c.js`, `phase7_conventional.js`, and `source_policy.js`

Result: recomputed p3063 and `func_0002CD70`. Six real-artifact negative controls rejected their single-field mutations.

`node tests/phase8_matching_c.js --output C:\Users\Joe\.codex\ob64-decomp-current\current\efd02ae928d6adc25cc20ac2\build`

Result: passed 36 targets. All 36 were raw exact, and zero target hashes differed.

`git diff --quiet 042c7c02e0f86da664c8d34d01597a4e61c4eef3 eace7a5b63febfff0f3a53934e730cdedc4f33b6 -- src asm/original config docs/NEXT_STEPS.md`

Result: exit code 0. Target source, assembly, configuration, accepted metadata, tool pins, and queue state did not change.

`node --check tools/lib/phase8_matching_c.js`

`node --check tools/diff.js`

`node --check tests/diff_exactness.js`

`node --check tests/phase8_matching_c.js`

Result: all four syntax checks passed.

`Get-FileHash build/baserom.us_rev0.z64 -Algorithm SHA256`

`Get-FileHash C:\Users\Joe\.codex\ob64-decomp-current\current\efd02ae928d6adc25cc20ac2\build\phase8.us_rev0.z64 -Algorithm SHA256`

Result: both hashes were `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Admissible findings

None.

## Notes and residual risk

`tools/diff.js` intentionally changes its generated JSON report from schema 1 to schema 2. No repository consumer of that report was found.

An external consumer that ignores `schemaVersion` could require migration. This compatibility risk does not weaken exactness.

The reviewer did not perform a fresh toolchain rebuild. The review reused identified external artifacts, then independently hashed and recomputed their material claims.

The focused tests and real-artifact controls cover the changed acceptance boundary. Full compiler reproducibility remains supported by the frozen worker verification.

## Documentation consequences

The new `docs/WORKFLOW.md` text matches observed behavior. No further canonical-document change is required for Phase 1.

The phase changed generated diff-report metadata by design. It did not change accepted target metadata or the queue.

## Exact next route

The Director may freeze this review and accept Phase 1. Phase 2 may start only after that Director action.

No correction or reopened research assignment is required. The function queue remains paused until the Director completes intake.
