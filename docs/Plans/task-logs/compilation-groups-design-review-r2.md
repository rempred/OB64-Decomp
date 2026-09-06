# Compilation-group design correction review

**Verdict: Accepted.** Completed. `CGDR-001` is resolved. The corrected design admits the pinned producer's required raw `.reginfo` section through an exact, non-configurable contract, proves its identity before removal, and requires it to be absent before linking without changing projected owner bytes, functions, or load relocations. The combined r1 proposal and r2 addendum may now serve as the implementation dependency. The Director may route tooling implementation; the later changed-input result still requires its assigned structural audit and independent review.

## Frozen subject and eligibility

- Assignment: `/root/compilation_groups_review`, revision 2.
- Launch: `COMPILATION-GROUPS-DESIGN-REVIEW-20260906-02`.
- Director: `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, local.
- Corrected frozen result: `b87e90800b65cc9f2f999e4cbe22af417bd0ac1e`.
- Unchanged predecessor: `5dad70919ff43bc988cdbff9003be91347153a75`, `docs/Plans/compilation-groups-design.md`.
- Correction addendum: `docs/Plans/compilation-groups-design-r2.md`.
- Correction worker report: `docs/Plans/task-logs/compilation-groups-design-r2.md`.
- Earlier review: `docs/Plans/task-logs/compilation-groups-design-review-r1.md`.

The correction addendum's worktree SHA-256 is `BEEC1A063C84EFDFD593B01A04801CD0995F863FAE2396AC32986362ECEEA03A`, matching the activation. The predecessor proposal retains worktree SHA-256 `BE38B960535FA8EAA710358168F6281FDC2AB0263D0B6661368EE2B42A96B379`. Direct comparison with the corrected commit found no worktree drift in the proposal, addendum, worker report, or earlier review.

The correction commit adds the addendum, worker claim, and worker report and changes only its prompt state and sequential coordination document. It changes no production source, configuration, tool, test, or accepted evidence input. The worker reported completed and released its writes. I did not produce the corrected result. The r2 review claim and report were absent at activation, and concurrent tasks own disjoint documentation paths.

## Claims reviewed

This proportional review tested whether the addendum:

1. resolves the exact raw allocation conflict in `CGDR-001`;
2. bounds `.reginfo` by producer shape, uniqueness, symbol and relocation rules, evidence identity, and removal stage;
3. prevents ancillary removal from hiding load-bearing bytes or semantics;
4. carries the stage distinction through projection, cache, proof, recorded-build, diagnostic, and status consumers; and
5. leaves the accepted producer/member, projection, alignment, ownership, placement, compatibility, and acceptance design unchanged.

The addendum makes a design claim. It does not claim that group projection is implemented or that the pose source is accepted production `PURE_C`.

## Correction-scope mapping

The earlier blocking finding and every earlier accepted check received an explicit correction-review disposition.

| Earlier item | Disposition | Result |
|---|---|---|
| `CGDR-001`, raw allocated census | **Run again** | Resolved. The required raw `.reginfo` now has one exact producer-wide shape, complete evidence, and a fixed removal point. Every other uncontracted nonempty allocation still rejects. |
| Frozen identity | **Keep** | The r1 proposal is byte-identical; the new addendum identity was checked separately against the r2 activation. |
| Production preservation | **Run again** | The correction commit changes documentation and routing records only. |
| Isolated native shape | **Run again** | The preserved raw object was reparsed, including the newly material `.reginfo` shape and allocation census. |
| Function census | **Run again** | All five normalized function records are identical before and after ancillary stripping. |
| Tail derivation | **Keep** | The correction cannot affect the unchanged 832-byte text, 824-byte function extent, native alignment, or eight-byte terminal tail. |
| Placement context | **Keep** | No owner interval, ROM/RAM mapping, placement equation, or accepted model input changed. |
| Relocation boundary | **Run again** | All 17 normalized load relocations are identical before and after stripping; none targets or references `.reginfo`. |
| Projection semantics | **Keep** | Text slicing, first-owner section anchoring, relocation-place rebasing, and encoded-addend rules are unchanged. Metadata preservation and removal are added below as a separate check. |
| Alignment projection | **Keep** | The `gcd(A, o)` rule and exact link equations are unchanged and cannot depend on ancillary metadata. |
| Producer/member separation | **Keep** | The producer schema, indivisible membership, per-owner results, and one-object link ownership are unchanged. |
| Legacy compatibility | **Keep** | The correction explicitly leaves the art-native validator and all legacy representation guards unchanged. No implementation changed. |

The correction creates four causally related checks, classified **Add**: exact raw metadata shape and payload evidence; `.reginfo` symbol/reference closure; raw-to-projected-to-stripped stage preservation; and downstream rejection of missing, stale, substituted, or retained stage evidence. All four are adequately specified.

## Review method and direct results

I inspected the frozen diff, the complete addendum, the worker report, the preserved r1 proposal and review, and the unchanged current raw-allocation and compile/strip paths. I independently parsed the designated `group.native.o` and `group.native.input.o` with the project `parseElfFile`, `elfSectionBytes`, and `rawRelocationRecords` functions. Section and symbol indices were normalized by semantic section identity before comparison.

| Check | Direct result | Judgment |
|---|---|---|
| Raw artifact identity | Raw SHA-256 `2549C60B2B092D672FA5AEEA7CCD0C183F90567171538FE3AED0A7926452F09D`; stripped SHA-256 `0CA08E84D5D7FE6C6F2FC77BA793D7D5AB089576474296BB3774C6CE19389011`. | Matches the frozen evidence. |
| Exact raw `.reginfo` census | Exactly one section: type `0x70000006`, flags `2`, address `0`, size `24`, alignment `4`, entry size `1`, link `0`, info `0`. | Pass. The addendum pins every observed semantic shape field and forbids configuration overrides. |
| Raw metadata payload | Bytes `a01f01fe0000000000000000000000000000000000000000`; SHA-256 `60B9106DB2E0DF08285CB4551E6A8F7809CC6D9B33B921A384F40E271B07B2B2`. | Pass. The value is recorded as evidence for these inputs, while future inputs must reproduce their own bytes rather than use an allowlist. |
| Raw symbol/reference closure | One unnamed local section symbol with value and size zero, section type, and default visibility; no relocation section targets `.reginfo`, and no relocation references a symbol defined there. | Pass. The proposed restrictions exactly cover the observed shape and reject a load-relevant extension. |
| Allocated-section boundary | The only nonempty allocated raw sections are `.text` and `.reginfo`; the only nonempty allocated stripped section is `.text`. Empty `.data` and `.bss` retain their established shapes. | Pass. The corrected exception is narrow. |
| Removal result | The stripped object contains no `.reginfo`. | Pass. The addendum requires this before linking and rejects a retained section even at zero size. |
| Text preservation | Raw and stripped `.text` are both 832 bytes with SHA-256 `454A2936657A72F9F2E3D6A3DD1A23D049A18035F44429B96374BF689BD2A265`; all bytes are equal. | Pass. |
| Function preservation | The five entries retain names, offsets `0`, `68`, `76`, `84`, `460`, sizes `68`, `8`, `8`, `376`, `364`, global binding, function type, and default visibility. | Pass after section-reference normalization. |
| Load-relocation preservation | All 17 `.rel.text` records retain place, type, symbol, symbol value, and semantic section. The largest place is `0x2EC`, before the tail beginning at `0x338`. | Pass after section-reference normalization. |
| Stage and negative-control design | Raw validation precedes projection; projected metadata must equal raw; stripping follows owner/function/relocation checks; stripped and linked allocation gates require absence. Negative cases cover missing/duplicate sections, every shape field, other allocation, symbols, relocation targets/references, payload drift, strip drift, stage substitution, and stale schemas. | Pass as an implementation contract. |

The strongest plausible competing interpretation was that an allocated `.reginfo` could carry hidden link input and make removal unsafe. The preserved producer object has no definition or relocation path beyond its one section symbol. Its removal leaves all text bytes, function records, and load relocations unchanged. The design also requires future implementation to compare the projected and stripped forms independently and to prove that the linked map and `PT_LOAD` census contain no group `.reginfo` contribution. That closes the competing interpretation without treating a successful final byte comparison as sufficient producer evidence.

No admissible finding remains. No mutation of the frozen artifacts was needed or performed. The specified negative controls target the future validators directly because the corrected group validator does not yet exist.

## Reused frozen evidence

The r1 review remains authoritative for the unchanged projection, alignment, placement, producer/member, cache, status, legacy-mode, and acceptance analysis. Those checks are kept only where the correction cannot affect their input or meaning.

The pose research report and preserved object set retain the identities recorded in r1. I reused the earlier tail and placement evidence by identity and independently recomputed every raw allocation, symbol, relocation, function, and strip relationship that the correction can affect. Current production modules remain the same frozen implementation precedent; they were inspected without rerunning their tests because this correction changes no implementation input.

## Evidence limits

The inspected pose artifacts remain isolated feasibility evidence. They do not establish an original source file, production classification, linked ownership, or complete-ROM acceptance.

No projected public-function group exists yet. This review therefore accepts the corrected specification and its required falsifiers, not an implementation. The future implementation must create and independently verify raw, projected, stripped, linked-map, and `PT_LOAD` evidence at the stages named by the addendum.

No compiler, assembler, objcopy, linker, build, verifier, audit, emulator, branch, worktree, agent, commit, or push ran during this correction review. No reviewed file was modified.

## Documentation consequences and exact route

The combined dependency is the unchanged r1 proposal at `5dad70919ff43bc988cdbff9003be91347153a75` plus the r2 correction at `b87e90800b65cc9f2f999e4cbe22af417bd0ac1e`. The Director may route the bounded tooling implementation against that combined design.

Implementation acceptance still requires its completed changed-input structural audit and independent review. Canonical workflow, source-policy, audit, and status documentation should change only with that accepted implementation. This design review adds no per-function verifier run or ordinary matching-wave review gate.

Production group activation remains a separate later action. Any source wave using the accepted tooling must pass the normal complete-wave verifier for every assigned member.

All r2 reviewer writes are released with terminal handoff.
