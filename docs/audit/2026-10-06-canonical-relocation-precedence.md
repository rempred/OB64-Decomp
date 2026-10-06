# Current relocation contracts and historical hybrid evidence

Status: accepted. Astra approved the bounded implementation after explicit
Sol/HazyForest agreement (mail1405) and Claude/GoldOx agreement (1406).
Focused selection and actual-object rejection tests passed. The complete changed-input
audit and six-target acceptance passed on October 6; independent review of both the
implementation and final evidence found no blocking issue.

The exact PURE_C replacement for `func_0000B29C` emits nine load-relevant relocations.
Its frozen hybrid predecessor emitted seven because inline assembly encoded the
archive-table address directly. The additional HI16 at `+0x30` and LO16 at `+0x38`
refer to the existing `g_boot_resource_lzss_error_anchor` binding. The discovery link
matches all 160 original bytes and all nine relocated words, but correctly reports
the old seven-record contract as a mismatch. The complete archive SIX also contains
the analogous `func_0000BC8C` conversion, now canonically confirmed with 31 actual
relocations versus its historical hybrid contract's 21.

The model previously rejected an explicit canonical contract whenever it differed
from the frozen legacy list, before comparing it with the new object. No supported
standalone configuration could represent that source change without altering frozen
history. Source shaping solely to avoid genuine relocations would retain a constraint
of the old hybrid encoding rather than an original-byte or compiler requirement.

`selectRelocationContract` now selects the validated explicit current contract when
present and retains the validated legacy list as fallback when absent. Its compatibility
record reports actual equality as true, false, or null. The frozen configuration remains
unchanged. Legacy absolute-symbol compatibility, compiler identity, structural owner and
placement checks remain unchanged. Fresh compilation, source-object reproduction,
recorded-object verification and cache inspection still require exact current-contract
versus actual relocation equality. Linkage and implementation identities still invalidate
stale CURRENT/cache inputs. No contract is inferred or approved automatically from bytes.

The focused selection tests cover different/equal/no-legacy/empty canonical contracts,
legacy fallback, strict missing contracts and malformed legacy/canonical records.
The unchanged artifact inspector accepts B29C's actual nine-record object with the
selected canonical contract, and its existing linked ELF still matches all 160 retail
bytes. The same object rejects the historical seven-record contract, missing HI16,
extra relocation, and wrong offset/type/symbol through the relocation-mismatch gate.
The test authenticates saved artifacts and freshly classifies the prepared source;
its exact preprocessed input agrees with the saved compiler input.

The required routine run passed 32 of 33 suites. The sole failure was an older knowledge
test assuming the stack-layout symptom had exactly one curated lesson. The catalog now
legitimately contains the accepted union example as well. Only the test changed: a fixed
fixture checks filtering, stable order, the three-lesson limit and omitted count; live
curated-reference authentication stays intact. The failed suite then passed all 24 checks
with zero code generation. The other 32 passing suites were not needlessly repeated.
The independent reviewer also confirmed that compilation-group placeholder lists are
subsequently bound to actual member relocation contracts; group checking is not bypassed.

HazyForest performed production integration; Astra owns this tooling delta.
Both source workers confirmed their native/store commands had exited before the edit.
After tooling tests and review, ONE `node tools/audit.js --profile` passed with normal
CURRENT verification and independent fresh compilation embedded, without a redundant
separate full-ROM verifier. Verification completed `2026-10-06T05:10:48.601Z`;
audit completed `2026-10-06T05:10:48.697Z`. CURRENT is
`FB99681EF5D625931E6CBACA92D0D56A7386595930C94224136889D17AD54A7A`.
All six targets are PURE_C, sole owners, exact in placement, full extent, actual
relocations and fresh-source proof. The 41,943,040-byte ROM exactly matches retail
SHA256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
Final independent review authenticated report/state identities and the six source proofs;
it did not repeat native compilation or add a routine function-review gate.

Mail1409 confirmed actual native/store completion and stable inputs; Astra1410
released Shop. Source commit `71b12b97` and final ownership release1411 changed no
accepted source/config bytes after verification. No unchanged rerun is required.
No boundary, compiler flag, frozen compatibility record or source-policy change was made.

Evidence: `build/matching/sol-archive-20261005/canonical-B29C-discovery.json`,
`build/canonical-relocation-precedence-20261006/`, and the final audit/verification
reports retained as `build/matching/sol-archive-20261005/accepted-*.json` and
`accepted-six-summary.json`. The verification report SHA256 is
`3606DB89D7CA9D8C4BBD066943B9CC9FA86697D824134BF5475C4497EC88E56B`;
fresh-compilation report SHA256 is
`B14587839842D017A8782A75FC3E79BDDFB9730E3DF9D0B8B4BF7D30D30C4CE0`.
Generated evidence remains untracked. The [source-wave record](../Plans/task-logs/sol-resource-archive-wave-20261005.md)
preserves complete membership and reusable observations; matching does not establish
stronger semantic claims.
