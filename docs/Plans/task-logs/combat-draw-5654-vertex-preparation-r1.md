# 001F5654 vertex preparation r1

Completed: bottom-y reassociation is present in the initial RTL, narrowed-top reuse first appears in CSE, its hard-register allocation first appears in local allocation, full-y allocation follows in global allocation, and the longer third-call setup suffix first merges in jump2. These are distinct stages. Retail also shares the third/fourth vertex calls; its join begins later in argument setup than the candidate's.

## Identity and comparability

Launch COMBAT-DRAW-5654-VERTEX-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root (native 01a07262-aeca-7341-ad10-2dba705ff988), local. Ready 4f7f0bd06f5be0134bd71e2b91a0da7aec9e2c55; activation 2d0ad363827b4cb6fa4b0399966c54cb0ceabfb5; coordination baseline 7d18cf4054aac1d34c36340288ec7675dc8b7d19. Claim was created atomically with CreateNew and read back before other writes. Unchanged required guides were reused as authorized.

Both bound production hashes matched. All diagnostic source/assembly, command and thirteen pass files received exact hashes before analysis. The vertex block in diagnostic source equals the production block after replacing the VERTEX_CURSOR alias and removing whitespace. Full-file source differences preserve include/macro expansion, not a different vertex candidate. Production and diagnostic assembly differ only in .file/comment lines; all remaining text is identical. comparability.json records the exact normalized assembly hash and scoped source equality. The command records pinned cc1, O2, big-endian MIPS3, gp32/fp32, G0, no PIC/abicalls/builtin, unsigned char, -da and status0. No compiler was invoked.

Frozen owner-note SHA256 917E5C8FB8BA88AA21BCB11E82D6CDF5810DC148E3E34C7636EF116EEBE65C9D and evidence SHA256 72B8E618FEAB594AA673864C25EF7CAF3EDED75822F221543B071A7710940B76 matched. W7 original ASM at 469a1416918592749d61dc34e3e079796f7b673c matched SHA256 524E1CA0DCE51E802A8DD9FA36000A87B4BB3D7AE0FB6D09D7862052A672F7A9. All 657 words equal the actual normalized ROM. V64 SHA256 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 and in-memory z64 SHA256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A matched without rewriting ROM. Scoped derived instructions at ROM001F5C50..001F5D9C match original words and accepted descriptor-10 delta0x7FFBCB70. No new runtime placement claim is made.

## Bottom-y arithmetic: first retained origin

The authenticated source says y=(short)(y+1-strip) after each branch's first two vertex calls. It does not explicitly spell y-(strip-1). Initial RTL already does:

- Non-flip: UID884 takes strip93's HI subregister;886 adds -1;888 takes y97's HI part;890 takes the intermediate HI part;892 subtracts those parts;893/894 shift/sign-extend back into y97.
- Flip: parallel chain1001/1003/1005/1007/1009/1010/1011.

Thus the reassociation and narrowing-aware form exist at initial expansion, before the first retained jump/CSE/loop passes. These dumps do not distinguish front-end folding from RTL expression expansion inside that initial phase; no earlier tree or expansion trace was supplied. Assigning the initial cause to combine or sched would be false.

CSE simplifies the subregister/copy expressions, and later stages retain strip-1 then subtract from y. The final candidate emits addiu temp,strip,-1; subu temp,y,temp; shift/sign-extend. Retail instead emits addiu s1,s1,1; subu s1,s1,s4 at ROM001F5CB8/5CBC and001F5D48/5D4C, then narrows in s1. Both observed shapes keep bottom-y derivation after the top calls in this snapshot. The already-tested separated increment/subtract control's scheduling behavior is not re-tested or re-proposed here.

## Full y and narrowed top: distinct allocation stages

Authenticated initial definitions identify full mutable y as pseudo97: UID841 and949 compute top81-accumulated82 inside the two branches; UID894 and1011 redefine97 to the narrowed bottom value. This task does not re-investigate accumulated allocation.

Before CSE, each top call has its own narrowing result: first branch326/332, second branch359/363. In .rtl/.jump, second-call argument moves877/994 use332/363. In .cse they first use326/359 instead. CSE thereby retains one narrowed-top value across each first call and reuses it at the second call. Its allocation unit is distinct from full y97.

| Unit | First recorded lifetime/class | Local disposition | Global result |
|---|---|---|---|
| Full mutable y97 | flow36 references/82 insns/6 calls; lreg36/72/6, multi-block | not locally allocated | hard18 (s2) |
| Non-flip narrowed top326 | flow9/15/1 in block19; lreg9/12/1 | hard17 (s1), with shift temp327 | remains17 |
| Flip narrowed top359 | flow9/13/1 in block20; lreg9/9/1 | hard16 (s0), with shift temp360 | remains16 |

The first narrowed-top hard-register assignments are explicitly printed in .lreg, before global allocation. .greg places97 third in its printed global queue, yet97's hard-conflict list already includes16 and17. It receives18. This is not evidence that narrowed top outranked y within one global priority queue: the narrowed values were assigned locally and are not global candidates there. The dump supports allocation-stage ordering and conflicts, but not every local quantity priority/tie-break that selected17 versus16.

Retail computes full y in17 and its narrowed top in18 in both branches (ROM001F5C80..5C88 and001F5D10..5D18). The candidate full y is18 in both branches, narrowed top17 in the non-flip branch and16 in the flip branch. Therefore a simple global17/18 swap does not describe both branches. At bottom-y redefinition,97 still owns18; changing the source's named top variable alone has already been tested and is not a fresh discriminator.

## Third-call suffix: first sharing and exact retail distinction

Source and initial RTL contain four real vertex calls per branch. Static call UIDs are860/881/924/941 and979/998/1031/1048. All eight survive .jump, .cse, .loop, .cse2, .flow, .combine, .sched, .lreg, .greg and .sched2.

.jump2 first removes calls924/941 and redirects branch exit943 to new label1695 (.L32). The retained common calls are1031/1048. Label1695 begins before third-call argument setup: load left coordinate into a1 from sp+236, load global vertex cursor into a0, load leftU into a3 from sp+244, finish bottomV sign-extension, move bottom-y into a2, store fifth argument, advance a0 by32 and call. Both the third and fourth calls now share this longer suffix. .dbr fills delay slots; its call wrappers have new IDs and must not be mistaken for new/deleted semantic calls.

Retail also has six static vertex calls, with the third and fourth shared. Its common label is RAM801B28DC/ROM001F5D6C, at the final bottomV arithmetic-right-shift. The preceding left-coordinate, vertex-cursor, leftU and bottom-y argument preparations remain duplicated in retail's branches. Candidate joins before those preparations. The supported difference is therefore the length/start of shared argument setup, not retail retaining two separate third calls. This qualification matters when interpreting a remaining byte gap.

## Discriminator limit and newer progress

No new real-state discriminator is supported strongly enough by this single frozen snapshot to recommend over the already-tested controls. In particular, separate increment/subtract, short y, named int/short topY, direct corner expressions, scoped branch locals and either helper interface would repeat listed trials. A forced extra lifetime, dummy memory home, volatile/barrier or compiler exception would not be a valid substitute. The record identifies where a distinct authorized experiment would need to show a change: initial arithmetic expansion; CSE-created cross-call narrowed value; local allocation before global97; or jump2's sharing boundary. It does not promise that another declaration spelling changes those decisions.

The Director separately relayed that a newer named-row-successors snapshot has a 20-byte vertex gap and a matching following suffix apart from a length-dependent loop-back displacement. That is matcher-reported context only: no new package was read, no new match was verified and no strip-update/texture-tail analysis was performed. A later Director update reports direct per-corner texture-v expressions restore the retail third-call join, producing2628 bytes/frame296 with29 nonrelocation word differences limited to vertex loads/registers. That supersedes the reported20-byte gap but is likewise uninspected, nonacceptance context. No tail-sharing recipe is proposed or duplicated. The arithmetic and local/global allocation findings remain bound to the supplied branch-mutate-narrow snapshot.

## Evidence, limits and release

Ignored root build/combat-draw-5654-vertex-preparation-r1/ contains input-identities.json, comparability.json, full textual comparisons, vertex-pass-trace.json (selected arithmetic/argument/call/label evidence across all thirteen stages), allocation-summary.json (global queue/conflict/dispositions) and retail-vertices.json. Offline inspect.py, trace.py and refine.py perform only bounded parsing, authentication and comparisons. Top-level call counts in .dbr refer to sequence wrappers, not original call UIDs.

No authentication failed. Scoped source equality uses only the supplied vertex alias and whitespace; mutable headers were not read. Some full-file identity comparisons and owner-byte checks include bytes outside the vertex slice only to authenticate the package, not to analyze excluded work. No pinned compiler source was needed. Only this fresh claim/report/ignored root were written; every frozen record was preserved.

No C candidate/source edit, compiler/link/build/verifier/source-policy operation, shared-tool/structural change, agent, runtime/GUI/bridge/database/capture or Git mutation occurred. All fourteen W8 targets and the single final complete-wave verifier remain required. This is ordinary assistance, not independent review or reusable compiler/semantic/structural/matching acceptance. All commands have completed; direct collaboration handoff goes to /root and all assigned writes are released at terminal handoff.


## Evidence identities

| Evidence JSON | SHA256 |
|---|---|
| allocation-summary.json | 741AA9FC8721AE3BBF286F90BFA4EC5B94E7910B88444C7D3B3191446F307DC8 |
| comparability.json | 8A7697DBE8D9CC528283F91686F91771759FB034A525750DF0827CE1C68A0A56 |
| input-identities.json | 582178BC37AAD8DE957770F37354FA2266D0C9688361112EB5F4E7AF028AF8F6 |
| retail-vertices.json | D0B2739F07AC2DA67D1DC0C1D2D12EB18B87799464BBD37E699FE8F0D1172587 |
| vertex-pass-trace.json | D060F9400327054541B51BC3C6CF3DF439555BD1748FF2D3603ABD4C983C6EE6 |
