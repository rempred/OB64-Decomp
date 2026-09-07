# Verdict: Accepted

**Material result.** Completed. Frozen subject
`3d485f05be1a3831bf4b2328164fcb85cb180c6c` passes Material review. Under the accepted
descriptor-10 mapping, ordinary traversal of each shown unsigned guard, and unchanged initialized
table contents, the accepted census's 24 non-return JR sites select from 460 enumerated slots. All
460 initial pointers map to aligned instruction addresses inside the site's existing owner. None
equals any of the selector's eight words at ROM `00201778..00201798` or RAM
`801BE2E8..801BE308`, end exclusive.

**Consequence.** The Director may propagate this bounded static JR result. It narrows one possible
selector-transfer route without establishing execution of any site or slot, runtime table
immutability, entry only through the guard, contemporaneous placement, downstream non-reachability,
selector non-use, or family exclusion. Source and matching acceptance do not follow.

**Required Director action.** Mark this review accepted and propagate only the conditional
initial-table target sets and their stated limits. Do not route a worker correction or activate
source/runtime work from this verdict. Keep the positive selector-provenance gate open. Any later
runtime capture, alternate pointer-state research, or downstream call analysis needs separate
authority and its own evidence boundary.

## Frozen subject and eligibility

- Assignment: `combat-selector-indirect-jr-review`, revision 1.
- Launch: `COMBAT-SELECTOR-INDIRECT-JR-REVIEW-20260907-01`.
- Reviewer task: `/root/compilation_groups_implementation_review`.
- Director: `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, host `local`.
- Frozen worker subject: `3d485f05be1a3831bf4b2328164fcb85cb180c6c`.
- Frozen report: `docs/Plans/task-logs/combat-selector-indirect-jr-r1.md`, 11,882 bytes,
  SHA-256 `76C00D2C87C6F22C1F88A3E6257822467232F385331A75DD0D93AE606271E11F`.
- Frozen evidence: `build/combat-selector-indirect-jr-r1/evidence.json`, 165,346 bytes,
  SHA-256 `4C796091B9316139A4DF7615C94028D2C0705F05FA3FFD211606A4F372C34C04`.
- Frozen worker checker: `build/combat-selector-indirect-jr-r1/check.py`, 4,657 bytes,
  SHA-256 `C7681B668955805B7E8AD2CFD1831CAAC95F46E587DEDE082DB3844E3E14E9E7`.

The worker reported completion and released its writes. The frozen commit changes only its prompt,
claim, and report. The worktree report matches that commit. I did not produce the subject. The
fresh review claim was created atomically and read back before review evidence. The ignored review
root is protected by `build/*` in `.gitignore`.

W7's linkage and target configuration, Combat headers, and source candidates remain the sole
production writer's unrelated work. They neither overlap this review's claim/report/root nor enter
the evidence boundary. No unexplained writer touched an assigned review surface.

## Claims reviewed

1. The accepted indirect-transfer census contains exactly 24 JR sites whose source register is not
   `ra`, and every one encodes `jr v0`; 301 `jr ra` sites and 13 JALRs remain outside this result.
2. Each site has an unsigned bound, a guard that rejects an out-of-range index, a shift by two, a
   fixed table base, an indexed word load, `jr v0`, and a nop JR delay word.
3. The 24 tables contain 460 initial-ROM slots across 18 accepted existing owners. Ten accepted R1
   sites contribute 156 unchanged slots; 14 new sites contribute 304 slots.
4. Every initialized slot maps through descriptor 10 to an aligned address inside the containing
   owner and outside all eight selector words.
5. The 14 new index-origin statements accurately bound the computed indices without asserting that
   every slot executes.
6. Runtime mutation, alternate entry, placement, downstream reachability, other indirect origins,
   and selector non-use remain unresolved.
7. The accepted six-slot publication correction at `99a793b`, reviewed at `242af7f`, retains its
   conditional and non-use limits.

The strongest competing interpretation is that a table is later rewritten or a route enters after
the guard with a different register state. An owner-internal initial target may also call the
selector downstream. Those possibilities do not contradict the conditional static result and are
explicitly outside it.

## Independent method

I used the worker package as an index but did not execute the worker checker. The independent
checker normalized the authenticated 40 MiB V64 in memory, confirmed normalized SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`, and derived descriptor
10's `7FFBCB70` RAM-minus-ROM delta from the accepted overlay configuration.

The checker selected the 24 sites directly from the accepted R2 census, located their unique
semantic owner rows, and compared every word in all 18 original owner files with the normalized
ROM. That complete owner check covered 5,809 words. It then decoded each site's bound, intervening
register-preserving stores, `beq`/`beql` guard, address formation, table load, JR, and delay word.
It independently extracted all 460 table words, mapped every target, enforced end-exclusive owner
and selector intervals, recalculated each table hash and distinct-target set, and compared the
result with the frozen evidence.

For the reused subset, all 156 ordered slots were also compared with authenticated R1
`static-evidence.json`. For the new subset, the checker enumerated the producer domains and
verified the reported chains:

| New index family | Sites | Independent result |
|---|---:|---|
| Halfword at record `+0x48`, minus one and sign extension | 8 | Exactly original values 1..20 pass the unsigned `<20` guard |
| Byte at RAM `8018F481`, minus seven | 1 | Exactly original values 7..48 pass the unsigned `<42` guard |
| Word at RAM `801CEAB0`, minus `0x22` | 3 | The guard admits computed indices 0..23; upstream branches retain further restrictions |
| Masked `s7` from call result or constant eight | 1 | `001F2718` admits byte indices 0..14; no all-slot execution conclusion |
| Byte at `t5+s4+0x14`, minus one | 1 | `0020AA28` admits original values 1..15; the taken branch-likely delay leaves the dispatch path |

The actual initialized descriptor-10 image is the supported producer for the table-state checks.
The normal fall-through after a successful guard is the route under review. A wrong table address,
slot word, owner interval, or selector comparison would directly falsify the assigned result, so
full extraction of the 460-slot bounded set was the smallest decisive check. This stays within the
assigned static evidence grade and threat model.

End-exclusive predicate controls checked the selector start, last word, byte immediately before,
and end boundary, plus the equivalent owner boundaries. They are diagnostic checker self-controls;
they do not add a producer or affect the evidence grade.

## Tests and results

Fresh attempt 02 passed 31,509 assertions in 11 groups:

| Test group | Result | Material observation |
|---|---|---|
| Claim and frozen identities | PASS | Launch, receiver, Director, host, subject, report, evidence, and checker identities exact |
| Subject-recorded inputs | PASS | 32 records / 26 unique paths; no byte or hash mismatch |
| ROM and descriptor mapping | PASS | Raw V64 and normalized z64 exact; descriptor-10 mapping independently derived |
| Accepted census | PASS | 24 non-return JR sites, 301 returns excluded, 13 JALRs excluded |
| Existing owners | PASS | 18 unique unambiguous original-MIPS owners; 5,809 complete owner words equal ROM |
| Guards and tables | PASS | 24 guarded routes, 460 non-overlapping slots, 460 owner-internal targets, zero selector hits |
| Reused R1 records | PASS | 10 sites / 156 ordered entries exact against accepted R1 evidence |
| New index origins | PASS | All five reported origin families and their unsigned domains confirmed |
| Evidence limits | PASS | Runtime, mutation, alternate-entry, placement, downstream, and non-use qualifications present |
| Publication correction | PASS | `99a793b` / `242af7f` identity and conditional limits retained |
| Boundary controls | PASS | Selector and owner ranges treated as end exclusive |

The passing evidence is:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `build/combat-selector-indirect-jr-review-r1/attempt-02/static-review.js` | 33,550 | `3CDF445A3ED3F79129B85708F52E7680944B182626A72CB1638F409E8C796321` |
| `build/combat-selector-indirect-jr-review-r1/attempt-02/review-result.json` | 10,787 | `CAF259AC19B5A9073CBDF5CCA3D9A5B124A348AA609AC580E9E6AAB56A7FF507` |
| `build/combat-selector-indirect-jr-review-r1/attempt-04/provenance.json` | 1,711 | `94FD661904C56D9AE174A66645B419C7CC3A4FCC5E5368B409F91B4700725168` |

Attempt 00 preserves a harmless lookup failure for a guessed prior-evidence path. Attempt 01
preserves a reviewer-checker failure after 29,238 assertions: it assumed the bound and guard were
adjacent. Direct inspection showed that four reused owners save registers between them and leave
`v0`/`v1` unchanged. Attempt 02 changed only that causal assumption: it locates the single
`beq`/`beql v0,zero` guard and verifies every intervening instruction is a register-preserving
store before recomputing the complete result in a clean root. Attempt 03 preserves a PowerShell
parse error in the first provenance command. Attempt 04 collected the same checks correctly and
confirmed that the subject and all six reused report paths match their named commits. These were
review-tool failures, not subject findings.

No compiler, linker, build, verifier, source-policy generator, runtime, GUI, bridge, database,
capture, queue, recovery, ingestion, agent, or Git mutation was used.

## Admissible findings

None.

All tested assigned claims passed. No observation supports a worker correction, reopened research
foundation, or protocol failure.

## Reused frozen evidence

- Accepted discovery: `1f68aa001c612e2a7ce160e0cdf1d83a0c8b2048`, reviewed at
  `024a9710425d6652dfc91857666b532006d1c54e`.
- Earlier dispatch subset: `150c9fca5d371fc7ad9245fcf6f94268cdf25311`, reviewed at
  `a862298e1d261fc73a5d9fce390f6b6d53c5af05`.
- Publication correction: `99a793b7384de997fcaa6369d03c4fa8604da7f7`, reviewed at
  `242af7f367d002475a3ed95e8eed819565605a50`.
- Accepted selector census SHA-256:
  `E492150B62D1F2B1B97FAA2D75413D6D06A6433F4A3F95595182A611E63CB5AD`.
- Reused R1 static evidence SHA-256:
  `3AE2415E4C63E41A6FFC7AEF73222C38EA4A95F183B7BA402C1E480DD2E7A950`.
- Publication-correction review SHA-256:
  `B010D34F8AF58D0E61E4698611202494F219FE564B32C9CF44B75C0E6421F47F`.

All named commits resolve, and each current frozen report matches its named commit. The review did
not repeat unaffected direct-edge discovery or the separate JALR investigation.

## Evidence limits and documentation consequences

The proof concerns the table bytes in the normalized initial ROM and the shown guarded load route.
The table addresses are RAM addresses at execution. No writer census, mutation history, or current
runtime table read was performed. The accepted overlay record itself notes 27 later changed data
bytes somewhere in descriptor 10; it does not identify these tables, but it confirms that later
descriptor data must not be assumed immutable.

Alternate entry after a guard, corrupted or deliberately changed registers, overwritten table
slots, a different overlay state, and runtime-generated instructions remain outside this result.
The owner-internal targets may call other functions. Other JR origins, JALRs, returns, external
overlays, and synthesized pointers retain their prior limits. The absence of a selector address in
these 460 initial slots is not evidence that the selector is unused.

No canonical-document change is warranted. Matching counts, source class, ownership, placement,
target-byte, and complete-ROM obligations are unchanged. This review adds no source-review gate or
verifier repeat to ordinary matching work.

## Exact next route and release

The exact route is `Accepted -> Director /root may propagate the conditional 24-site / 460-slot
static result and preserve the positive selector-observation gate; no worker correction and no
source or runtime activation from this review`.

All commands have finished. The claim, report, and ignored review root are released to `/root` at
terminal handoff. W7 retains sole production/build ownership.
