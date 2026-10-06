# Current relocation contracts and historical hybrid evidence

Status: bounded implementation approved by Astra after explicit Sol/HazyForest
agreement (mail1405) and Claude/GoldOx agreement (1406). Focused selection and
actual-object tests pass; independent review finds no blocking issue. Complete changed-input
audit and final six-target acceptance remain pending; this note does not accept them.

The exact PURE_C replacement for `func_0000B29C` emits nine load-relevant relocations.
Its frozen hybrid predecessor emitted seven because inline assembly encoded the
archive-table address directly. The additional HI16 at `+0x30` and LO16 at `+0x38`
refer to the existing `g_boot_resource_lzss_error_anchor` binding. The discovery link
matches all 160 original bytes and all nine relocated words, but correctly reports
the old seven-record contract as a mismatch. The complete archive SIX also contains
the analogous `func_0000BC8C` conversion; it still needs canonical confirmation.

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

HazyForest retains production source/config ownership; Astra owns this tooling delta.
Both source workers confirmed their native/store commands had exited before the edit.
After tooling tests and review, the complete SIX will be integrated and checked through
one structural audit containing normal CURRENT verification, without a redundant separate
full-ROM verifier. Shop resumes when required native/verifier/publication work actually
finishes. No boundary, compiler flag, frozen compatibility record or source-policy change
is authorized by this repair.

Evidence: `build/matching/sol-archive-20261005/canonical-B29C-discovery.json`,
`build/canonical-relocation-precedence-20261006/`, and the final audit/verification
reports when completed. Generated evidence remains untracked.
