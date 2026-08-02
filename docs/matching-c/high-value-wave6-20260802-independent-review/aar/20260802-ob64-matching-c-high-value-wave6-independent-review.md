# Critical independent review: Wave 6 matching C

Verdict: `Accepted with corrections`.

The frozen commit `7d527a7ff8c3ad01ba00d586aee6ef7dba567d39` passes the Critical review. The technical result is byte-exact, reproducible, and within the declared clean-room scope. The Director must correct seven relocation-count statements in five review records before propagation. No action is required from Joe.

The reviewed owner is `func_0026B820`. Its linked target contains 1,196 bytes. Its linked text SHA-256 is `A88503EABEC9D4127CFBD75972F3F0465DC1A58B904DBDDE3B54BCFBA16B4E1A`.

The only remaining issue is documentation-only. The object has 28 text relocations and one `.rel.pdr` relocation. Several frozen records say 29 text relocations and one `.rel.pdr` relocation.

## Frozen subject

The review covered canonical decomp commit `7d527a7ff8c3ad01ba00d586aee6ef7dba567d39` on `main`.

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `func_0026B820` | Structural selector and state dispatcher | `0x0026B820..0x0026BCCC` | z64 ROM range, end exclusive | Reviewed owner, 1,196 bytes |
| `.ob64.r4836` | Linked target section for `func_0026B820` | `0x80216C70..0x8021711C` | overlay link virtual range, end exclusive | Placement and linked-byte check |
| `func_0026B820_return` | Owner return boundary | `0x0026BCC4` and `0x0026BCC8` | z64 instruction and delay-slot addresses | Final return and stack restore |
| `func_0026BCCC` | Immediate successor owner | `0x0026BCCC` | z64 ROM start address | Negative boundary control |

The worker AAR, evidence-path correction AAR, and evidence index resolve. The worker result is marked completed. The correction changes evidence paths only. No worker blocker remains.

## Claims reviewed

The review covered these material claims:

- The frozen commit contains the declared source, configuration, and evidence files.
- The selected owner meets the Wave 6 size and control-path requirements.
- The owner boundary and descriptor-12 placement are exact.
- The C source reproduces the linked target bytes.
- The recorded relocation offsets and symbols are exact.
- All six earlier C owners remain exact.
- The complete ROM and configured code region remain exact.
- Two fresh output roots preserve path-independent identities.
- Tool, compiler, source, and input identities remain authenticated.
- The source derivation respects the clean-room boundary.
- The corrected evidence package has no prohibited tracked artifacts.
- The claims remain static and structural, without gameplay semantics.

## Review method

The review used direct commit inspection, independent recomputation, fresh builds, and negative boundary checks.

The frozen commit contains nine changed files. It contains one C source, one matching-C configuration, and seven curated Markdown records. It contains no tracked ROM, object, executable, map, or bulk generated artifact.

The original assembly contains 299 contiguous words. The words cover 1,196 bytes. The final instruction is `jr $ra` at z64 address `0x0026BCC4`. The delay slot restores the stack at `0x0026BCC8`. The successor source begins at `0x0026BCCC`. The target assembly contains one function label.

Descriptor 12 places the owner inside text range `0x8020A2E0..0x8021F450`. Semantic row `4836` records the exact z64 range and 1,196-byte size. This confirms the overlay link model. The alternate execution annotation `0x802DB420` is not used as a ROM-to-RAM subtraction.

The fresh reviewer build used the accepted Phase 7 output, KMC compiler, Splat runtime, split script, and asm-differ checkout. Build A and build B both passed. Standalone verification passed for both roots. The path-independent comparison also passed.

The reviewer directly extracted `.ob64.r4836` from the fresh ELF. The section size is `0x4AC`, its VMA is `0x80216C70`, and its LMA is `0x0026B820`. The extracted 1,196-byte section has the expected linked text hash.

The reviewer independently parsed the original word stream. The resulting z64 bytes match the fresh ROM slice. The reviewer also recomputed the full-ROM and code-region hashes.

## Tests and results

| Check | Result | Direct evidence |
|---|---|---|
| Frozen file set | PASS | `git diff-tree` lists nine allowed files and no generated binary |
| Target boundary | PASS | 299 contiguous words, return delay slot, and successor control |
| Wave 6 size gate | PASS | 1,196 z64 ROM bytes, within 1,156 to 1,600 bytes |
| Descriptor placement | PASS | Descriptor 12 and semantic row 4836 agree |
| Fresh build A | PASS | Full ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Fresh build B | PASS | Same full-ROM SHA-256 as build A |
| Standalone verification | PASS | Seven matching-C owners and seven exact asm-differ results |
| Linked target section | PASS | `.ob64.r4836` size 1,196 and linked hash `A88503EABEC9D4127CFBD75972F3F0465DC1A58B904DBDDE3B54BCFBA16B4E1A` |
| Relocation list | PASS | 28 text relocations plus one `.rel.pdr`; offsets and symbols match |
| Earlier owners | PASS | Six earlier C owners remain exact |
| Full ROM preservation | PASS | Verification reports 7,242 primary rows and 7,251 link slices |
| Code-region preservation | PASS | SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Path independence | PASS | Reproducibility report SHA-256 `D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48` |
| Input provenance | PASS | Compiler, manifest, config, setup, and source hashes match |
| Evidence path correction | PASS | Required worker AAR path resolves and obsolete basename count is zero |
| Tracked artifact policy | PASS | No prohibited generated artifacts appear in the frozen commit |

The reviewer reused the frozen setup report. The assignment forbids traversal of the protected Phase 5A `_work` root. The fresh Phase 8 build still verified the accepted Phase 7 input and authenticated compiler and runtime identities.

## Admissible correction

### Correction C1: relocation-count statements

Classification: non-semantic coordination correction.

Assigned claim: The evidence package accurately reports the target relocation contract.

Supported producer: The accepted KMC compile of the frozen C source produces the target object.

Ordinary sequence: The Phase 8 build compiles the source, records relocations, and links the target section.

Direct observation: `mips64-elf-readelf.exe -r` reports 28 entries in the target text relocation section and one entry in `.rel.pdr`. The frozen configuration contains 29 expected entries total, including the one `.rel.pdr` entry. It also lists six same-owner `.text` relocations.

Material consequence: The stale counts can mislead provenance review. They do not change source bytes, linked bytes, relocation offsets, or the evidence boundary.

Smallest correction boundary: Update five Markdown records. Replace 29 text plus one `.rel.pdr` with 28 text plus one `.rel.pdr`. Replace four same-owner relocations with six. Replace `30 total` with `29 total`.

No source, configuration, verifier, schema, compiler, or generated artifact requires correction.

## Reused frozen evidence

The reviewed package is under `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave6-20260802`.

The worker records are:

- `target-selection.md`
- `independent-derivation.md`
- `reproduction-procedure.md`
- `task-log.md`
- `evidence-index.md`
- `aar\20260802-ob64-matching-c-high-value-wave6-aar.md`
- `aar\20260802-ob64-matching-c-high-value-wave6-evidence-path-correction-aar.md`

The reviewer records are:

- `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave6-20260802-independent-review\task-log.md`
- `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave6-20260802-independent-review\evidence-index.md`

Fresh generated evidence remains outside Git under `C:\Users\Joe\.codex\ob64-matching-c-wave6-review-20260802`.

## Evidence limits

The worker claimed static structural correspondence only. The review accepts that evidence grade. It does not prove gameplay semantics, runtime safety, editor round trips, or cold-boot behavior.

The parent repository was read-only. Its review-time HEAD was `6d5a31a122513dbf2b7e24f249cb5827f7e2c4aa`. The worker and prompt record different historical parent baselines. The fresh Phase 8 build did not consume parent files directly. This drift does not affect the reviewed canonical result.

The review did not inspect external-derived implementations. It used only the declared accepted tools and input products. The changed C source contains no external-source include or provenance marker.

## Documentation consequences

The Director must apply Correction C1 before propagating the owner. The Director must search the five named records for the stale count text. The Director must preserve the exact relocation offsets and symbols.

No canonical semantic document change is proposed. No worker source correction is required. No proportional technical re-review is required after the documentation-only cleanup.

## Exact next route

The permitted verdict is `Accepted with corrections`.

The Director must route a bounded documentation correction. The Director can propagate Wave 6 after verifying the corrected counts and marker searches. Wave 7 remains gated until that cleanup is complete.

