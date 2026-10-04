# Shop whole-row native padding projection

Status: accepted. The generic implementation and complete four-member Shop wave passed
the combined changed-input audit and final independent structural review on October 4, 2026.
Tooling is committed at `6dbff8ba`; source integration and useful research at `90de9e9e`.

## Structural decision

The complete Shop classification, ordering and resource-lifecycle wave contains
`func_0019B1B0` (108 bytes), `func_0019B800` (692), `func_0019BB34` (364) and
`func_0019BCA0` (116). Their independent native evidence covers each complete original
body, 83 actual text relocations and 75 switch-table destinations. Sol and the independent
reviewer reconstructed the original binding bases and table targets without discrepancies.

B800 emits one 208-byte, alignment-eight native section: 100 pointer bytes, four
alignment bytes, 100 pointer bytes, then four alignment bytes. Existing whole r3098
owns 104 bytes, r3099 owns 100, and r3100 owns twelve literal zero bytes. Projection
version 1 cannot describe native padding inside a whole payload row. Changing a
boundary, inventing a table entry or injecting padding would not resolve that contract.

Version 2 allows a complete nonfinal payload to own its authenticated native trailing
padding. Pointer-entry intervals remain separate from whole ownership/copy intervals.
The compiler grammar, actual alignment gap, zero bytes and complete native census must
agree. Padding rejects symbols, relocation places and referenced addresses. Native
slices, original section anchors, encoded addends and relocation identities are conserved.
Owned terminal padding and version-2 compilation-group composition explicitly reject.

B1B0 uses the existing single-table auxiliary contract for whole r3097: 100 pointer
bytes plus four native alignment bytes. B800 uses version 2 for whole r3098/r3099.
All twelve r3100 bytes remain original ASM; only its first four correspond to check-only
terminal native alignment. No owner boundaries, load contexts, compiler flags or
source-class rules change.

## Proof and tests

Version 1 retains object evidence schema 4 and nested projection schema 1. Version 2
uses schemas 6 and 2, including an exact payload-slice census. Fresh source proof and
cache inspection independently recreate the projection from the unsplit native object.
Hashes authenticate bytes; they alone do not prove historical copy provenance.
The [contract documentation](../AUXILIARY_PROJECTION.md) describes the additional checks.

The unrelated native fixture passed legacy and version-2 linking, source proof, cache
reconstruction and accounting checks, plus 79 legacy and 141 version-2 rejection controls.
A genuinely changed PURE_C source remains a rejected nonmatch. Direct unsupported group
paths, malformed padding/grammar, stale schemas and tampered proof slices are covered.
Focused results are in `build/tests/padded-projection-focused.log`.

The routine run passed 29 of 30 suites in 186 seconds. Its sole failure correctly rejected
a newly indexed Squad observation that pinned a mutable resumption cursor. Sol retained
the original observation and published a corrected record through normal research commands,
using unchanged source/probe evidence and stable references. The affected knowledge suite
then passed all 24 checks with no code-generation calls. The final index, including the
published B800 source-pair lesson, also passed those 24 checks. Other passing suites were
not repeated. Logs: `build/tests/padded-projection-routine.log` and
`build/knowledge-intake-tests/run-QXOldX/results.json`.

Independent review found no remaining generic implementation, test or production ownership
defect. It authenticated the final source/configuration/tool/evidence identities and actual
native, projected and linked objects, maps and fresh verifier proofs.

## Accepted integration

Sol integrated the four canonical sources and derived contracts. Seven named bindings use
their independently reconstructed original bases; existing allocator/free bindings are unchanged.
The sole change to accepted `func_001977E0` is its B1B0 parameter declaration, widened to the
selected word-width definition. Its fresh u16 read and `& 0x7FFF` remain unchanged, as do
its linked bytes and all 534 relocations. All four wave targets and the caller are PURE_C.

Every final production focused check passed. One `node tools/audit.js` then completed with
structural protections and exact CURRENT ROM passing at 14:56:34 EDT (18:56:34 UTC).
No redundant full build, per-function ROM acceptance or unchanged verifier repeat was run.
The first cold focused check rebuilt 735 compiler objects after the tooling identity changed;
subsequent focused checks reused sibling objects. This audit is not a warm-diff timing result.

- CURRENT: `44C2FEA1FA4861B69FF10526AEB5213A8134BA955D9BA64BEF9549F9E23CBC35`.
- Complete 41,943,040-byte ROM: `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Final evidence: `build/sol-five-family/shop-four-final-evidence-20261004.json`,
  SHA-256 `A97B4FA3F48EE791D9AEED8006FBAF0A900B400A1998EA73C5880F509D4B2568`.
- Audit log: `build/sol-five-family/shop-four-audit-20261004.log`.

The final map gives r3097's 104 bytes solely to B1B0's C object, and r3098's 104 plus
r3099's 100 bytes solely to B800's C object. All twelve r3100 bytes remain one exact
contribution from `objects/assembly/chunk_025.o`. Every code owner is sole C with its
original fallback excluded from linking but retained as reference. Original boundaries,
load mappings and protected sources remain intact. B800's actual object/projection evidence
uses schemas 6/2 and independently reproduces the exact native slices and anchors.

The independent reviewer accepted this exact final state with no actionable findings.
Acceptance establishes static structural and machine-code agreement; it adds no runtime,
menu-capacity or later fourteen-member wave claim. Both workers resumed their separate Squad
and fourteen-member Shop assignments after scoped local commits, refreshing affected private
context without repeating the unchanged audit. Nothing was pushed.
