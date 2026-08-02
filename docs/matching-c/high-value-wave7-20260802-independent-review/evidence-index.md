# Wave 7 independent review evidence index

Status: review complete. Verdict: `Revision required`.

The review confirms the frozen byte, placement, preservation, provenance, and
evidence-consistency claims. It rejects the maintainable-C claim because the
target bytes come entirely from an inline layout anchor.

| Review claim or check | Evidence | Result |
|---|---|---|
| Frozen subject identity | Canonical commit `1872b09872b50202341c0e9c097ac24951dedea5`; `git diff-tree --name-status` | PASS; nine allowed files, no generated binary artifact |
| Target boundary | `asm/original/rev0/boot/boot_state_dispatch_loop_init.s`; `target-selection.md` | PASS; `func_00005FC0` covers z64 `0x00005FC0..0x000065A4`, end exclusive |
| Target byte identity | Independent `.word` parse; normalized master ROM; reviewer ROM | PASS; 377 words, 1,508 bytes, hash `08B5A10F4A00B892D8CBE99A62BC7F823FBB7A6B4EB9FB488D1BC2EFC341B50B` |
| Fixed boot placement | Reviewer `verification.json`; reviewer `phase8.map` | PASS; `.ob64.r0056` at `0x80075BC0`, size `0x5E4`, ROM load `0x00005FC0` |
| Relocation contract | Reviewer `verification.json`; reviewer `build-report.json` | PASS; target relocation list is empty |
| Earlier-owner preservation | Reviewer `verification.json` | PASS; 7,242 rows, 7,251 slices, 19 overlay reservations, no linked fallback targets |
| Independent build | Reviewer `build-report.json` and `phase8.us_rev0.z64` | PASS; build report `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2`; ROM hash `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Independent verifier | Reviewer `verification.json` | PASS; verification hash `334399C94C61A50EBB0BF6AF2E19C958E866B4E9BC36ECD9F8614E791751782B` |
| Path independence | Reviewer `reproducibility-vs-worker.json` | PASS; `reportsIdentical: true`; report hash `B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26` |
| Clean-room provenance | Frozen source, canonical config, worker evidence package, authenticated local tools | PASS; no external-derived implementation was inspected |
| Corrected evidence package | Worker AAR, correction AAR, evidence index, task log | PASS; corrected reproducibility identity and six-record count are consistent |
| Maintainable-C requirement | Frozen C source lines 77-251 and 253-645; reviewer compiler output | FAIL; the source contains 377 inline `.word` directives, and the compiler emits no C-model symbol |

## Reviewer-owned generated evidence

Generated outputs remain outside Git under:

`C:\Users\Joe\.codex\ob64-matching-c-wave7-review-20260802`

The reviewer compiler output has SHA-256
`9AC9D34E7C7A281F82A85E7C3FAC98C84B1F5174DA6F1BD9C9E91838EE076964`.

The reviewer linked target output has SHA-256
`EB6A0750BCE1226D67481397E37BB42A2E88976221133128FFE669847EC403C0`.

The reviewer target object has SHA-256
`8F1DB21470C86481A7EECCF053463A51F97D86E5C0D2E6A17082DAD42E891D01`.

## Material finding

`W7-MC-01` is recorded in the reviewer AAR. The finding affects the
maintainable-C gate, not the exact-byte or preservation claims.
