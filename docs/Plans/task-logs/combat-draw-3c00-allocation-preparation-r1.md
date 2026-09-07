# 3C00 companion/u1 allocation preparation r1

Complete bounded matching assistance; evidence limit returned, no source discriminator proposed. The frozen diagnostic assembly is executable-text-identical to the frozen production assembly. Its allocation observations apply to that candidate, but retained dumps do not establish why the allocator selected s7 for companion and s6 for u1, or a distinct real-state source change predicted to reverse them.

Task combat-draw-3c00-allocation-preparation, revision 1; launch COMBAT-DRAW-3C00-ALLOCATION-PREPARATION-20260907-01. Receiver /root/sequential_scope; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local; gpt-6-astra Medium. Ready fc1c9217dee795fbd32f69ba9434d1f9bede302c; activation 407e0c7c25a94e5fe538075a9997751e1ba7e302; coordination 7a5e1b65b40e2a16e29ad79ec8f0e7d03bf781af; accepted source W7 469a1416918592749d61dc34e3e079796f7b673c. Fresh complete claim created atomically and read back before evidence writes; report/root absent at launch. Reused unchanged required guides and sequential program; read active W8 and this assignment. W8 remains sole production writer.

## Authentication and comparability first

`build/combat-draw-3c00-allocation-preparation-r1/evidence.json` binds all 19 retained inputs: supplied C/assembly pair, diagnostic self-contained candidate.c/candidate.s, all 13 retained compiler passes (rtl, jump, cse, loop, cse2, flow, combine, sched, lreg, greg, sched2, jump2, dbr), diagnostic-command.json, and draft original.s. All four prescribed file hashes pass. Frozen entry-preparation report/evidence hashes pass; report LF content equals its a8c784cc45c2793c2f762e7c290d97a516a13118 Git object.

Complete draft original instruction stream equals accepted W7 asm/original/rev0/lib/func_001F3C00.s and actual canonical ROM at every word: ROM 001F3C00..001F5654, 6,740 bytes / 1,685 instructions, SHA256 458A6CB397B154CCC0CBE12CAEF4456A711C676E6B269F32A8DEE2490522925A. Canonical ROM SHA256 is 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. Original fallback, final return and complete owner remain intact.

The two emitted assembly files each have 2,039 lines. Exactly two lines differ: line 1 .file uses production func_001F3C00.input.c path versus candidate.c; line 10's compiler-option comment adds -da for diagnostics. All remaining lines, including executable instructions, frame directive, labels and data, are identical. No production/diagnostic code discrepancy explains this register swap.

The diagnostic command records the KMC GCC 2.7.2 cc1 path and -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char -da, candidate.c input/candidate.s output, status 0, empty stdout/stderr. This authenticates the retained command record, not a new compiler execution or independent executable identity check. The complete supplied expansion is hashed and self-contained, with no includes. Its original preprocessing command and frozen header snapshots are not present in this bounded package; independent replay of include/macro provenance remains unestablished. No mutable header/config/source was consulted to fill that gap. Exact emitted comparability supports the narrow allocation observation despite this provenance limit.

Reported 6,752 bytes, frame 504 and 334 native word differences remain provisional writer measurements. The retained .frame agrees with 504; no assembler, linked diff or acceptance run was performed here.

## Two real states and selected stages

Source references below are line numbers in the frozen expanded candidate.c. `selected-stages.json` preserves exact selected blocks from every retained pass, including assignment UIDs, death notes, counters, conflict rows and final mappings.

| State | Source/initial RTL | Retained lifetime | Assignment evidence |
|---|---|---|---|
| companion | declaration line 120; line 225 sets null, UID 1097 sets pseudo 100 SI to 0; line 268 sets paired image address, UID 1580 | Used for companion format/width and paired-image commands through the strip path; loop persists beyond u1 conversion | greg lists 100 in 23 and UID 1097/1580 destinations are s7 |
| u1 | short declaration line 123; line 297 zero in flags-bit-1 arm, UID 1789; line 298 decoded width-minus-one in other arm, UID 1804; pseudo 114 HI | Converted at line 313 into rightU; UID 1927 shifts its low halfword, carries REG_DEAD 114; UID 1928 arithmetic-shifts into pseudo 104 SI | greg lists 114 in 22 and UID 1789/1804 destinations are s6 |

These initial assignments already exist in the first retained RTL, before cse/scheduling/allocation. At sched, UID 1804 is represented as a subreg-SI set of HI pseudo 114 from width-minus-one. Both selected pseudos survive local allocation as pseudos; their hard assignments are explicit in greg. There is no earlier retained dump of front-end variable creation or allocator choice instrumentation.

Flow counters: companion 74 uses across 943 insns, zero death places, 50 crossed calls, pointer; u1 6 uses across 57 insns, 2 crossed calls, 2 bytes. At lreg these are respectively 74/786/50 and 6/51/2, both GR_REGS or none. These are compiler-reported counters, not independently measured dynamic executions, exact numeric scores, or proof that lifetime length alone controls priority.

The greg printed 98-register allocation list contains pseudo 100 at position 34 and pseudo 114 at position 46. Their conflict rows explicitly include one another; they overlap before the u1 sign-extension death. Companion's row includes fixed hard registers 16..19, while neither row by itself lists 22/23 as fixed conflicts. Other allocated pseudos also conflict, so a row and the final mapping do not identify which choice excluded an otherwise plausible register at the actual allocation step. The printed ordering does not expose score calculations, tie handling, preference updates or retry decisions. No such motive is inferred.

Retail independently uses s6 for the same null companion at ROM 001F459C and paired-image address at 001F4958, then format/width accesses at 001F495C/001F4964. Retail u1 is s7 at 001F4B10/001F4B18 and is consumed by the sign extension at 001F4C20. Later s7 reuse is a different dying-state lifetime; it is not evidence that companion and u1 can share one register while overlapping. No packet/cursor or flag-return redesign was studied.

## Bounded result and release

Evidence limit: this package establishes the two state identities, their overlap, short-lived u1 death and exact diagnostic/production allocation correspondence. It does not support a unique real-state discriminator expected to reverse allocation. No additional experiment is proposed. In particular, declaration int-versus-short already gave identical output per the assignment; this control was not repeated. No artificial references, dummy homes, padding, barriers, assembly or compiler exception is suggested. No original source spelling or universal allocator rule is inferred.

All fourteen W8 targets and one final complete-wave verifier remain required. This report supplies ordinary matching assistance only, with no new matching, semantic, structural or reusable compiler acceptance. No production/config/tool edits, compiler/diff/verifier/source-policy commands, runtime/bridge/database operations, Git mutations or agents were used. Frozen terminal and held Resolver records were preserved. All assigned writes released at terminal handoff; fresh assignment required before further writes.

## Output SHA256

Ignored evidence root: build/combat-draw-3c00-allocation-preparation-r1/. Report/claim hashes are returned separately to Director.

| Artifact | SHA256 |
|---|---|
| evidence.json | 7D76724ECE9790E427E4255C3AB25677346B8AC060513D35DE4E543A4F4D2766 |
| extract.py | B0E4EE3B1E100DF755B0CC7BD587FE88F8AAC0FBE5EDAE6BDD069E6EB6BB7EA1 |
| selected-stages.json | 888E5DBBC8B69B29F94502FC28602F24377D6519C13B5FE0F822756852E8A8E6 |
