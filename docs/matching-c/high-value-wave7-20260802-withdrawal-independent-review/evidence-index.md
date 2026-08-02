# Wave 7 withdrawal independent-review evidence index

Status: completed. Verdict: Accepted.

| Claim | Evidence | Direct result | Review state |
|---|---|---|---|
| Frozen subject identity | Canonical decomp HEAD and commit metadata | HEAD is ef653540848407c24915bf51b1df497cae0acc43 on main; parent is 07bd06e9add63bacd45136b67e1684f004567d0a | Verified |
| Causal finding disposition | Earlier review AAR, blocked correction AAR, withdrawal AAR | W7-MC-01 is Replace; the candidate remains rejected and withdrawn | Verified |
| Active C owner count | config/phase8/matching-c.json | Schema version 2 contains seven target objects | Verified |
| Active owner identities | config/phase8/matching-c.json | Targets are func_000E5938, func_0000B33C, func_00007688, func_0000BC8C, func_00269470, func_0026B360, and func_0026B820 | Verified |
| Rejected source absence | Frozen commit path and active source search | src/boot/boot_state_dispatch_loop_init.c is absent; no active config or source match remains | Verified |
| Rejected configuration absence | Frozen config and active configuration search | No func_00005FC0 configuration entry remains | Verified |
| Assembly fallback identity | Frozen assembly blob comparison and fresh map | The fallback hash is 92D12F3BAC341DCC418030610B2BFA6A6A0BFA4170FA0E48EF01E47455DA1AC2 in commits 1872b098, 07bd06e, and ef653540 | Verified |
| Assembly fallback placement | Fresh phase8.map and layout.json | The boot state-dispatch owner uses tracked assembly input at z64 ROM 0x00005FC0, fixed boot RAM 0x80075BC0, and 1,508 bytes | Verified |
| Generated probe absence | Frozen commit path and evidence-tree file-type check | -.s is absent; the nine-file task evidence root contains Markdown only | Verified |
| Seven-owner build | Fresh run-a and run-b build reports | Both pass with matchingCOwners 7, originalAssemblyFallbacks 3, and the same full-ROM hash | Verified |
| Seven-owner verification | Fresh run-a and run-b verification reports | Both pass with seven exact target results, fullRomExact true, and originalAssemblyTargetsNotLinked true | Verified |
| Preservation | Fresh verification preservation objects | acceptedRowsPreserved is 7242, acceptedSlicesPreserved is 7251, and overlayDescriptorsPreserved is 19 | Verified |
| Reproducibility | Fresh reproducibility report | status pass and reportsIdentical true | Verified |
| Fresh build report identity | Reviewer-owned run-a and run-b build-report.json | Both SHA-256 values are A74706081DBF38D2024A7BF2C8BC4E9906A290C1470E6CE635904DBB2C124A1E | Verified |
| Fresh verification report identity | Reviewer-owned run-a and run-b verification.json | Both SHA-256 values are D265EAEE4A07FC30F204460D8D100C2F6290A785B1B1A7D5968F66F604FD9AED | Verified |
| Fresh reproducibility report identity | Reviewer-owned run-a reproducibility.json | SHA-256 is D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48 | Verified |
| Historical candidate provenance | Frozen commit 1872b09872b50202341c0e9c097ac24951dedea5 | Withdrawn source hash is BFEB371935DCA921472E44FA2AF6FF002459008DF47DA415B39CA2B1B785B999; pre-withdrawal config hash is 855E14C889788DBB708F0D02CEAEF225E3EE7642A2A77FF3819C886588ADA444 | Preserved |
| Blocked correction evidence | review-correction-20260802/aar/20260802-ob64-matching-c-high-value-wave7-maintainable-c-correction-aar.md | The accepted backend limitation remains recorded; no maintainable-C claim was reintroduced | Preserved |
| Parent baseline drift | Parent Git metadata | Current parent HEAD is 099523a1913db97a0178ad0e929a9f1f61919612 instead of prompt baseline 0884f427dcc8b8104531a93755cdfec626a8abad; parent inputs were not used | Nonsemantic |

Reviewer-owned generated outputs remain outside Git under:

    C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\

The full review narrative is in [the reviewer AAR](aar/20260802-ob64-matching-c-high-value-wave7-withdrawal-independent-review.md).
