# W7 global allocation comparison

Completed: the two packages place input on opposite sides of both indexed pixel pointers. Neither reproduces retail's middle position. The comparison exposes an additional input use, but cannot isolate a row-guard cause because several source expressions change together. The Director can route these bounded findings to the sole W7 writer.

## Identity and evidence boundary

Task combat-compositing-global-allocation r1; launch COMBAT-COMPOSITING-GLOBAL-ALLOCATION-20260907-01. Worker /root/compilation_groups_design, Astra Medium, local. Director /root, native task 01a07262-aeca-7341-ad10-2dba705ff988. Complete claim created atomically and read back at 2026-09-07T03:48:04.8329179-04:00. Starting HEAD was f2832613f08e425e8e92322a31309e1655be125a.

Package A is build/combat-compositing-wave7-r1/rtl-207E30-both-expansions/. Package B is build/combat-compositing-wave7-r1/rtl-207E30-row-guard/. Only their exact compiler inputs bind pseudo identities. All thirteen passes, assembly and command records are authenticated separately for each package.

| Input | SHA-256 |
|---|---|
| A candidate.c |2E92D4672DBAFCE7D436E302F8DCAF75473301BDCC3F72EC6CC3B40E3EC6AC1C|
| A candidate.s |93F236654CCBB1222E8BDA4F7E4723B29BB7B995EFB10E16E7FB71CA795B409E|
| B candidate.c |75B5F285E4C1FFA3553FE4B742A52480D5938ECAB468FD5C579A70BADA260634|
| B candidate.s |EEB29134D61660584DF63FFE1A419C4E92505C89612332395737616246114D95|
| A authored snapshot, func_00207E30.both-expansions-fixed.c |EF5B31071E9258E774FD6A2EA0A24BD2A1C99BADF2A8429D29D61B2280EC8AA8|
| B authored snapshot, func_00207E30.branch-next-while.c |06F59F05218D8204CFF686C15EF7F5794F855D78B543C12BF46B45583E23D64B|

The authored snapshots contain includes and BLEND_PIXEL macros. The co-located candidate.c files contain expanded types and pixel expressions. These are different artifacts with different hashes. The recorded dump-rtl scripts copy func_00207E30.input.c into each diagnostic directory before invoking cc1 with -da. I read those scripts as provenance and did not execute them or read the current mutable shared input.

The authored snapshots' visible forms correspond to the named packages. The scripts and status-zero command records support their recorded association. They do not provide a complete immutable preprocessing receipt linking every authored dependency. Stage claims therefore bind directly to the pinned co-located candidate.c identities, not a reconstructed preprocessing run.

Assembly confirms A frame256 and B frame264. It confirms sourceRow in fp in both, input in19 for A and17 for B. A initializes inner-alpha in18 and destination in17; B uses inner-alpha19 and destination18. Neither directory includes an object. Candidate text sizes of1,752 bytes remain worker-reported, not independently remeasured here. The complete retail owner's1,752 bytes and438 words were independently checked against canonical ROM.

## Corresponding variables and allocation order

The loop pass derives three indexed pointers from the two-pixel body. Their bases and strides establish correspondence without transferring pseudo IDs between packages. Inner-alpha advances from alphaRow by one byte per pixel. Inner-destination and inner-source advance from their row bases by two bytes per pixel.

| Role | A pseudo / lreg statistics / final register | B pseudo / lreg statistics / final register |
|---|---|---|
| input |84 /31 references,215 instructions,3 calls /19|84 /33 references,216 instructions,3 calls /17|
| Inner-alpha pointer |459 /27 references,144 instructions /18|460 /27 references,144 instructions /19|
| Inner-source pointer |460 /19 references,143 instructions /25|461 /19 references,143 instructions /25|
| Inner-destination pointer |461 /27 references,142 instructions /17|462 /27 references,142 instructions /18|

The pointer statistics are identical at lreg despite different pseudo numbers. They are compiler reference/span statistics, not runtime frequencies. Input's flow statistics also differ: A31/255/3 versus B33/256/3. No claim about a universal compiler priority formula follows.

A greg line4 orders destination461 before inner-alpha459 before input84. Dispositions give17,18,19 respectively. B greg line4 orders input84 before destination462 before inner-alpha460. Dispositions again give17,18,19 in that order. The source pointer receives25 in both and does not explain the permutation.

Retail instead uses input18, inner-alpha19 and inner-destination17. Original ROM instructions initialize the inner pointers at0x00208168 and0x00208170. The corresponding candidate initialization appears at A assembly lines411–413 and B lines410–412. Addresses in this report are z64 ROM instruction offsets unless explicitly described otherwise.

Thus retail lies between the observed orderings: destination, input, inner-alpha. Raising input above both pointers or leaving it below both does not establish a solution. Exact register outcomes depend on conflicts and allocation state, not merely three reference counts.

## Smallest evidenced input-use difference

A computes the mask base from sourceRow-8 plus the helper result. B computes it directly from input plus that result. In B lreg UID325, pseudo84 explicitly participates in this addition. A has no corresponding pseudo84 use in that operation. Both still have the input+8 initialization and the same input-header loads elsewhere.

There are twelve executable lreg blocks mentioning input84 in A and thirteen in B. The extra block is the direct mask-base addition. The two-reference increase in compiler statistics accompanies that additional use; it must not be interpreted as two new memory reads. This is the smallest concrete row-setup use difference established by these packages.

The source row-state guard also changes. A assigns rows=input->height, tests rows>0, then uses a do-loop with a fresh input->height back-edge condition. B uses while(y<input->height). Its earlier rows assignment has no live source use. The retained lreg forms still have two input-height reads: one before first entry and one at the back edge. There is no demonstrated additional height dereference in B that independently explains the input-reference increase.

A's entry read defines named rows pseudo101 at UID412; its back edge uses a separate temporary at UID1009. B's entry read uses temporary445 at UID1038, with the back-edge read at UID416. This is a concrete row-state representation change. It accompanies a one-instruction input-span difference, but the pair cannot attribute that span change to the guard alone.

The packages also differ in high/low mask expansion and accumulation-variable reuse. Package B retains the earlier mask expressions. Its nextSource assignment is another source difference, owned by the production worker. I did not analyze that variable's branch-end copy/coalescing. These simultaneous changes make A versus B a comparison, not a controlled causal intervention.

## No new source form justified by this pair

No source recipe is proposed. A direct-input mask-base change is an obvious isolated control, but B's final order overshoots retail. Calling it a demonstrated repair would exceed the evidence. A guard-only change is also untested in the supplied pair because B changes other expressions. Suggesting a spelling sweep would not resolve this causal ambiguity.

The precise missing evidence is a single-factor, variant-bound comparison holding A's completed mask expansion, mask-base expression and separately owned copy behavior fixed while changing the row-guard form. Such evidence could distinguish a guard-induced lifetime shift from the extra direct input use. It does not need a new general compiler rule or any tool modification. This task authorizes no compiler run to produce it.

A falsifiable guard explanation predicts an input lifetime/order change even with the direct-use count held fixed. If that controlled graph retains A's ordering, the guard-alone explanation fails. If input moves above both indexed pointers, it still does not provide retail's middle position. These are diagnostic criteria for the source worker's already authorized work, not an added acceptance test or a proposed candidate.

Do not import B's full source to borrow its guard or frame. That would discard A's completed mask expansion. No dummy references, artificial storage, pointer escape, undefined behavior or register binding is justified by the counts. All seven W7 members retain their original complete-wave gates.

## Verification and release

Task-local command: node build/combat-compositing-global-allocation-r1/check.js. Result PASS. It authenticates38 input records, both declared frame sizes, input statistics and all438 original ROM words. It records per-package input-use blocks, allocation summaries, loop derivations and selected source-operation UIDs. No compiler, linker or generator was invoked.

Evidence: build/combat-compositing-global-allocation-r1/evidence.json. SHA-256:15F98ADC28AAF30015952096BE2560AA2B6C23C89C899766EAB20627A0EF5865. Normalized canonical ROM SHA-256:571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. Normalization occurred in memory. Both packages remain unchanged.

Read-only diff returned1 because the files differ; that was expected. Broad output was narrowed after truncation. A bounded live worker-log lookup located the named authored snapshot association; mutable raw/compiler inputs were excluded. No game hypothesis was executed or failed in this task.

Only the fresh claim, this report and ignored check.js/evidence.json were written. Prior terminal reports and every production/disjoint write were preserved. No runtime, GUI, bridge, database, agent, branch, worktree, staging, commit or push occurred. This is assistance, not independent review or acceptance. No canonical-document change is proposed. All assigned writes are released at terminal handoff.
