# Critical independent review: Wave 7 rejected-candidate withdrawal

Verdict: Accepted.

The frozen withdrawal restores exactly seven active matching-C owners and routes func_00005FC0 through unchanged assembly. This closes the rejected candidate safely. The Director may propagate the withdrawal and select a replacement target; no correction is required.

## Frozen subject

The review covers canonical decomp commit ef653540848407c24915bf51b1df497cae0acc43. Its parent is 07bd06e9add63bacd45136b67e1684f004567d0a.

The accepted seven-owner predecessor is e153585d7d1cb860d82ea8a905e4831a7b197a7c. The earlier independent review issued Revision required for W7-MC-01.

The blocked correction AAR records the accepted-backend limitation. The withdrawal AAR records candidate removal, fallback restoration, and fresh fallback-build evidence.

Canonical decomp HEAD matched the frozen subject on main. Integration evidence HEAD matched b22815518f060425519c08df19b617af8b5099a7. The parent workspace HEAD was 099523a1913db97a0178ad0e929a9f1f61919612, while the prompt records 0884f427dcc8b8104531a93755cdfec626a8abad. This parent drift did not affect review because no parent research input was used.

The review did not enter the protected integration work root. It did not inspect external-derived implementations. The frozen result stayed read-only.

## Claims reviewed

The review judged these withdrawal claims:

- The active build has exactly seven accepted C owners.
- func_00005FC0 uses the unchanged original assembly fallback.
- The rejected C source is absent.
- The rejected configuration entry is absent.
- The attributable generated -.s file is absent.
- Rejection and blocked-correction evidence remain complete and consistent.
- Fresh build, verification, and reproducibility claims hold.
- The frozen result contains no prohibited generated artifacts.

The review treated the result as static structural and build evidence. It did not require runtime proof because the withdrawal makes no gameplay claim.

## Causal correction scope

W7-MC-01 is Replace under the correction-review rules. The withdrawal did not technically correct maintainable C. It removed the candidate from the active acceptance target. The backend research question remains unresolved.

The earlier accepted checks were handled as follows:

| Earlier check | Status | Reason |
|---|---|---|
| Candidate boundary, target bytes, placement, and relocation evidence | Keep | The original assembly fallback remained unchanged and preserves historical target evidence. |
| Seven earlier C owners and preservation | Run again | The active configuration changed and required fresh build evidence. |
| Full-ROM identity and verification | Run again | The withdrawal changed the active build surface. |
| Reproducibility | Run again | The withdrawal changed the active build surface. |
| Evidence consistency and provenance | Run again | The worker package changed and required direct inspection. |
| Frozen file set and generated-artifact absence | Run again | The frozen withdrawal commit required a new file-set check. |
| W7-MC-01 maintainable-C finding | Replace | The active candidate was withdrawn rather than technically corrected. |

No additional material finding was added.

## Review method and admissibility

The reviewer directly inspected the frozen commit, configuration, worker records, earlier review, blocked correction, and withdrawal AAR. The reviewer then ran two fresh authenticated builds, two fresh verifications, and one reproducibility comparison.

The build sequence is an admissible acceptance test. The producer is the ordinary Phase 8 build using the frozen configuration and accepted local tools. The input sequence is build, verify, and compare from two fresh output roots. Failure would show an incorrect owner count, fallback, preservation result, or ROM identity. This is the smallest useful falsifier for the withdrawal claim. The test stays within the claimed static and build evidence grade and the assigned threat model.

Generated outputs used this reviewer-owned root:

    C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\

## Tests and results

| Check | Direct observation | Result |
|---|---|---|
| Frozen subject | Canonical HEAD is ef653540848407c24915bf51b1df497cae0acc43 | PASS |
| Active configuration | schemaVersion is 2 and target count is 7 | PASS |
| Active C sources | All seven configured source hashes match their current files | PASS |
| Rejected source | src/boot/boot_state_dispatch_loop_init.c is absent | PASS |
| Rejected configuration entry | No func_00005FC0 entry exists in config/phase8/matching-c.json | PASS |
| Assembly fallback identity | The fallback is unchanged across candidate, review, and withdrawal commits; SHA-256 is 92D12F3BAC341DCC418030610B2BFA6A6A0BFA4170FA0E48EF01E47455DA1AC2 | PASS |
| Assembly fallback use | Fresh map names objects/assembly/chunk_000.o and boot_state_dispatch_loop_init for section .ob64.r0056 | PASS |
| Assembly fallback placement | The section loads at z64 ROM 0x00005FC0 and fixed boot RAM 0x80075BC0 with size 0x5E4 | PASS |
| Generated probe absence | -.s is absent; the frozen task evidence root contains nine Markdown files and no generated binary | PASS |
| Fresh build A | Phase 8 matching C build passed with seven targets | PASS |
| Fresh build B | Phase 8 matching C build passed with seven targets | PASS |
| Fresh verification A | Phase 8 verification passed with seven exact asm-differ targets | PASS |
| Fresh verification B | Phase 8 verification passed with seven exact asm-differ targets | PASS |
| Preservation | Full ROM exact; 7,242 primary rows, 7,251 link slices, and 19 overlay reservations preserved | PASS |
| Reproducibility | The comparison passed with reportsIdentical true | PASS |
| Whitespace and file set | Frozen diff check passed; the commit changes no ROM, object, ELF, map, report, or bulk artifact | PASS |

The fresh builds produced full-ROM SHA-256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. They produced code-region SHA-256 40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409.

The fresh build reports have SHA-256 A74706081DBF38D2024A7BF2C8BC4E9906A290C1470E6CE635904DBB2C124A1E. The fresh verification reports have SHA-256 D265EAEE4A07FC30F204460D8D100C2F6290A785B1B1A7D5968F66F604FD9AED. The fresh reproducibility report has SHA-256 D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48.

The fresh map identifies the restored owner as tracked assembly. It does not identify the withdrawn C source or a C object for this owner.

## Admissible findings

No admissible blocking finding remains. The withdrawal satisfies its assigned claims.

The historical maintainable-C defect remains recorded as W7-MC-01. It is not silently accepted, technically corrected, or reintroduced.

## Reused frozen evidence

The review reused these records as evidence indexes:

- docs/matching-c/high-value-wave7-20260802-independent-review/aar/20260802-ob64-matching-c-high-value-wave7-independent-review.md
- docs/matching-c/high-value-wave7-20260802/review-correction-20260802/aar/20260802-ob64-matching-c-high-value-wave7-maintainable-c-correction-aar.md
- docs/matching-c/high-value-wave7-20260802/withdrawal-20260802/aar/20260802-ob64-matching-c-high-value-wave7-rejected-candidate-withdrawal-aar.md
- docs/matching-c/high-value-wave7-20260802/evidence-index.md
- docs/matching-c/high-value-wave7-20260802/task-log.md

The reviewer-owned task log and evidence index are linked from this report.

## Evidence limits

The review proves active source/configuration state, assembly fallback identity, placement, build preservation, and reproducibility. It does not prove gameplay behavior.

The parent baseline drift is a coordination fact. It is not a finding because the review used the canonical decomp repository and accepted external build inputs.

The historical candidate and blocked correction remain evidence for future backend research. They do not establish an active maintainable-C owner.

## Documentation consequences

The Director may propagate the withdrawal as an accepted correction outcome. The Director must preserve W7-MC-01 as a replaced historical finding and retain the unresolved backend research question separately.

No canonical domain-document edit is proposed. The active seven-owner surface can proceed to replacement target selection.

## Exact next route

The permitted verdict is Accepted. The Director may close this rejected candidate and select a replacement target. No worker correction or proportional re-review is required for this withdrawal.

Supporting records:

- [Review task log](../task-log.md)
- [Review evidence index](../evidence-index.md)
