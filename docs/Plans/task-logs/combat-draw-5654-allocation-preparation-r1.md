# 001F5654 allocation preparation r1

Completed: accumulated changes from memory at sp+0xD4 in common-y to hard register 30 in branch-local-y. The earliest distinction is already in source expansion/initial RTL: the latter contains two branch-local top-minus-accumulated computations instead of one common computation. It increases accumulated's reported references and advances its printed global-allocation order, with unchanged selected conflict sets. This is not explained by a shorter accumulated lifetime.

## Identity and comparability

Launch COMBAT-DRAW-5654-ALLOCATION-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root (native 01a07262-aeca-7341-ad10-2dba705ff988), local. Ready 5f0ae5e6cf95ffeb541d642a867e62bc0d2065d9; activation 8d5903eda64ae5194d03ffdaae11aa49448e33d7; coordination baseline c80eaed3fa1ff5f2e95f77855fb760a49cbbb8da. Claim created with CreateNew and read back before any other write. Unchanged governing guides were reused as authorized.

The four bound production snapshot hashes matched; both diagnostic candidate.c/candidate.s files, command records and all 26 retained dumps received exact hashes before interpretation. Each command records the same pinned cc1 path, O2, meb/mips3/gp32/fp32, G0, no PIC/abicalls/builtin, unsigned char and -da, status0. No compiler was invoked.

Each diagnostic source is an include/macro-expanded form of its production snapshot. The saved production-to-diagnostic text diffs preserve the expansions; the scoped variables, types, assignments and explicit vertex calls are retained. The production-pair source diff changes only the placement of y=top-accumulated: one common statement becomes one statement inside each branch. Production and diagnostic assembly for each snapshot differ only in .file and comment text. Removing those lines yields identical remaining assembly, with hashes in comparability.json. Full-file text comparisons establish comparability only; excluded packet/color operations were not analyzed. Mutable headers were not read.

Bound complete-owner note SHA256 917E5C8FB8BA88AA21BCB11E82D6CDF5810DC148E3E34C7636EF116EEBE65C9D and evidence SHA256 72B8E618FEAB594AA673864C25EF7CAF3EDED75822F221543B071A7710940B76 matched. Accepted W7 original ASM at 469a1416918592749d61dc34e3e079796f7b673c matched SHA256 524E1CA0DCE51E802A8DD9FA36000A87B4BB3D7AE0FB6D09D7862052A672F7A9. All 657 words match the actual ROM. V64 SHA256 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 and in-memory normalized z64 SHA256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A matched; ROM was not rewritten. 156 selected derived geometry words match original instructions and accepted descriptor-10 delta0x7FFBCB70. Saved placement is not new execution evidence.

## Allocation units and observed result

Source names are authenticated by initial defining/using RTL, not inferred solely from register numbers. These pseudo numbers are shared by the two frozen snapshots:

| Source state | Pseudo | Defining/use evidence | Common-y global result | Branch-y global result |
|---|---:|---|---|---|
| top |81| UID653 negates decoded field08 |memory|memory|
| accumulated |82| UID738 zero; y subtraction; loop update |sp+212 (0xD4)|hard 30 ($fp/s8)|
| full right |100| UID658 decoded width+x0 |hard 30|memory, store at sp+252|
| narrowed rightVertex |88| UID817 sign-extends right-1 |memory|memory, store at sp+236|
| rightU |89| narrowed u1 |hard 30|memory|
| row |96| UID797 remaining-strip or805 zero; loop updates |hard 19 (s3)|hard 19 (s3)|
| mutable y |97| top-accumulated, then y+1-strip |hard 18 (s2)|hard 18 (s2)|

Right100, rightVertex88 and rightU89 are three distinct units; conflating them gives a false account of register 30. In common-y, full right100 and rightU89 can share30 over nonoverlapping lifetimes. In branch-y accumulated82 gets30 and both100/89 lose register dispositions. The memory results are confirmed by post-allocation RTL stores/loads, not merely absence from the disposition list. Original retail keeps raw right then its narrowed value in s8, row in s3, accumulated in stack memory and the full y value in s1 with a separate narrowed form in s2; source variables and retail hard-register roles are not automatically one-to-one.

The reported2584/frame296 versus2592/frame304 sizes are snapshot descriptions, not quality rankings or accepted matches. Later offsets and hard-register choices may change with any new source input.

## First differences through retained passes

Common initial RTL UID832 defines pseudo97=81-82 before the flip branch. Branch-local initial RTL has UID836 andUID904, each defining the same pseudo97 from81-82 inside its branch. This is source expansion, not duplication first introduced by scheduling, CSE or allocation. The same one-versus-two definitions survive jump, CSE, loop, CSE2, flow and combine. Both versions still use one mutable y pseudo across the branch-local lifetimes; the source did not create two independent y pseudos.

The first retained reference/lifetime summaries are in .flow:

| Unit | Common references / lifetime / calls | Branch references / lifetime / calls |
|---|---|---|
| top81 |5 /258 /9|8 /259 /9|
| accumulated82 |11 /226 /8|14 /227 /8|
| rightVertex88 |11 /197 /7|11 /198 /7|
| rightU89 |11 /195 /7|11 /196 /7|
| row96 |43 /206 /7|43 /207 /7|
| y97 |27 /50 /4|30 /50 /4|
| right100 |4 /58 /2|4 /58 /2|

These are compiler-reported counts, not dynamic execution counts; the three-reference increment must not be described as three extra executed subtractions. Only one branch executes dynamically. .lreg retains those reference/call counts, with accumulated lifetime 208 versus209, y 46 versus46, row 193 versus194, right100 51 versus51. Accumulated's lifetime therefore grows by one, its call crossings remain eight, and y's reported lifetime remains unchanged. There is no evidence that a shorter accumulated live range freed a register.

The .greg header first prints the changed allocation order. Relevant subsequences are:

- Common: ...103,87,89,88,86,82,100,74...
- Branch: ...103,82,87,89,88,86,100,74...

Thus82 advances before the right-side units. The complete conflict-list strings for82,88,89,96,97,100 are identical between the two snapshots. In particular82 conflicts with89 and100, while100 and89 do not conflict with one another. The recorded dispositions then give30 to89/100 in common-y and82 in branch-y. This is concrete competition/order evidence, not a newly discovered conflict edge. Row and y keep their dispositions.

The first retained memory-versus-register resolution is .greg: UID738 becomes a memory zero store at sp+212 in common-y and a hard 30 zero assignment in branch-y. Later scheduling/jump/delay-slot dumps and the authenticated final assembly carry those results; they are not the first allocation decision. The common local allocator does not assign82 before global allocation.

## Cause limits and current handoff

The bounded chain supported by these inputs is: one source-level y definition becomes two branch-local definitions; the first reported reference counts for top/accumulated/y rise; accumulated moves earlier in the printed global allocation order; the same selected conflict graph resolves register 30 differently. The observed lifetime change is an increase, not the explanatory improvement. This identifies the first retained origin and allocation-priority change, while separating them from an exact numeric priority formula.

The dumps do not print per-unit numeric priority scores or every attempted hard-register selection. No compiler source formula was used or independently accepted here. A pinned local global.c path was located but not read, rebuilt or instrumented. Accordingly the report does not claim that one isolated numeric term, a hidden tie-break or every spill choice has been proven from a controlled compiler experiment. The reference-count/rank connection is strongly supported by the isolated source diff and matching conflict records, but it is not a reusable compiler theorem.

During this comparison the Director reported a newer, distinct complete-per-branch four-corner-call expression that retains branch-local y and accumulated at sp+0xD4/frame296. That package was not requested or read, and the observation is attributed to the matcher, not verified by this task. It shows the frozen two snapshots are not an impossibility result. No extra old-pair recipe is proposed: duplicating the reported newer experiment would be redundant, and the frozen pair alone does not justify a guaranteed real-state discriminator. The useful handoff is the confirmed allocation chain and the distinction among right100/rightVertex88/rightU89, for interpreting the matcher's remaining branch-temporary/tail differences without artificial references or dummy homes.

## Scope and release

Only this fresh claim/report and build/combat-draw-5654-allocation-preparation-r1/ were written. input-identities.json records exact frozen inputs; comparability.json binds normalized assembly equality; source-difference.txt and two source/assembly comparison pairs preserve textual relationships. allocation-trace.json contains all thirteen stages' selected pseudo blocks, recorded statistics, rank, conflicts and dispositions. allocation-endpoints.json preserves relevant post-allocation instructions; retail-allocation.json preserves scoped authenticated retail words. Offline scripts inspect.py, trace.py and retail.py reproduce those records.

No authentication failed. Initial bounded search patterns found no allocation header because it is labeled 'regs to allocate'; a direct header read resolved that. The parser preserves selected units only and does not pretend omitted pseudos are absent. Some supporting declaration text and full-file comparisons were read solely for authentication, with no packet/color analysis. No mutable production/configuration or Resolver inputs were read. No candidate, source edit, compiler/link/build/verifier/source-policy command, shared-tool/structural edit, agent, runtime/GUI/bridge/database/capture or Git mutation occurred.

All fourteen W8 targets and its single final complete-wave verifier remain required. This is ordinary assistance, with no new review gate or reusable compiler, semantic, structural, ownership or matching acceptance. All commands are finished; direct collaboration handoff goes to /root and all assigned writes are released at terminal handoff.


## Evidence identities

| Evidence JSON | SHA256 |
|---|---|
| allocation-endpoints.json | 9158465B3E4FAF5BB5A1E0416E3B00F50C441593CC6029A3E2BDC6861DDEAC87 |
| allocation-trace.json | E4E2C91A43B1A2A0B9EFAB90043D2CB27F618DFC20A60598B077F2DE2AE55329 |
| comparability.json | 80A52F879AEF1DBB1ACFB1EA2257482881A14FCFDC0A4B247D3712398055143D |
| input-identities.json | 503CB6C95E6C42A9F4F926C8D90C901F4F225D1C6FFF950F95B5C3CE0A2DB2D3 |
| retail-allocation.json | EE8AEF8B8D941026D00F62CC796DF73076BAC11F0B9AD3B2AC5B81213B687F72 |
