# Combat selector indirect JR research R1

Completed bounded research: all 24 assigned JR sites have guarded, fixed-address table-load routes. Their 460 initial-ROM slots target their respective existing owners. None targets the selector entry or interior. The Director must obtain Material review before propagating these new conclusions. Selector consumer provenance remains unresolved.

Task combat-selector-indirect-jr, revision 1; launch COMBAT-SELECTOR-INDIRECT-JR-20260907-01. Receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local. Ready commit d15a9aa; starting HEAD 670ec6404a0ae55bda842ffc2ffe885204137b0b. The complete fresh claim was created atomically and read back before other writes.

## Scope, identities and method

Both agent guides, Worker-workflow, SOURCE_POLICY and the research-aide index governed this work. Original assembly is the selected byte-level aide. No database was opened. Accepted discovery 1f68aa0 and review 024a971 supplied the fixed census. Earlier discovery 150c9fc and review a862298 supplied ten dispatch records. Correction 99a793b, reviewed at 242af7f, retains its separate conditional six-slot JALR result and all limits.

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| Selector owner | Table-byte accessor; arguments remain unnamed | 00201778..00201798 | z64 ROM, end exclusive | Complete comparison interval |
| Selector placement | Same accepted owner | 801BE2E8..801BE308 | RAM virtual, end exclusive | Entry and seven interior words |
| Combat descriptor | Accepted descriptor 10 | 001F0A30 / 801AD5A0 | z64 ROM / RAM virtual | Existing translation anchor |

The checker selects actual census records where kind is JR and register is not 31. All 24 encode jr v0. The thirteen JALRs and 301 ordinary returns are excluded. No direct-edge census, resource decoding or corpus-wide literal search was repeated.

The local instruction chain is an unsigned index guard, index shifted left two, constant high address, indexed addition, table-word load, and jr v0. Every JR delay word is nop. Signed low immediates are included in table-address reconstruction. Original words across the 18 containing owners match the normalized ROM. Owner rows and descriptor configuration match accepted R1 identities; a read-only comparison against 150c9fc showed no changes to those configurations or the R1 report.

For ten sites, the checker reuses R1's ordered entries and checks their table words against ROM. It extracts only the other fourteen tables anew. Every slot records index, slot ROM offset, RAM target and mapped ROM target. Each mapped target is aligned and inside its containing accepted owner. All eight selector instruction addresses are tested, not just the entry.

The leading interpretation is internal switch dispatch. Its decisive evidence is the guarded word-load chain plus owner-internal initial pointers. A competing interpretation is later replacement of table contents or entry below the guard. This work neither proves nor observes those alternatives. A valid transfer using an altered pointer would falsify an unconditional target-set claim, which is not made here.

## Exact site dispositions

Every row has the same disposition: conditional initial-table target set, no selector entry/interior slot, all initial targets inside the named owner. Bounds describe the computed unsigned index, not every caller's argument domain. Table lengths are slot counts; they are not execution counts.

All site values are z64 ROM offsets. Table values show z64 ROM followed by accepted RAM virtual address.

| JR site | Existing owner | Table ROM / RAM | Slots | Evidence |
|---|---|---|---|---|
| 001F134C | func_001F1218 | 00213180 / 801CFCF0 | 22 | R1 reused |
| 001F1A98 | func_001F197C | 002131D8 / 801CFD48 | 22 | R1 reused |
| 001F2718 | func_001F265C | 00213250 / 801CFDC0 | 15 | New |
| 001F71D0 | func_001F7148 | 002132A8 / 801CFE18 | 20 | New |
| 001F72D4 | func_001F7148 | 002132F8 / 801CFE68 | 20 | New |
| 001F73F8 | func_001F7370 | 00213348 / 801CFEB8 | 20 | New |
| 001F74E8 | func_001F7370 | 00213398 / 801CFF08 | 20 | New |
| 001F7614 | func_001F7584 | 002133E8 / 801CFF58 | 20 | New |
| 001F7788 | func_001F7584 | 00213438 / 801CFFA8 | 20 | New |
| 001F78B8 | func_001F7828 | 00213488 / 801CFFF8 | 20 | New |
| 001F7A3C | func_001F7828 | 002134D8 / 801D0048 | 20 | New |
| 001FAEB8 | func_001FADA4 | 00213560 / 801D00D0 | 42 | New |
| 001FFC5C | func_001FFBFC | 00213620 / 801D0190 | 24 | New |
| 001FFD38 | func_001FFCC8 | 00213680 / 801D01F0 | 24 | New |
| 001FFE14 | func_001FFDA4 | 002136E0 / 801D0250 | 24 | New |
| 00205CE4 | func_00205C88 | 00213840 / 801D03B0 | 14 | R1 reused |
| 002063A8 | func_00206340 | 00213878 / 801D03E8 | 14 | R1 reused |
| 00206C48 | func_00206BE0 | 002138B0 / 801D0420 | 14 | R1 reused |
| 002076CC | func_00207658 | 002138E8 / 801D0458 | 14 | R1 reused |
| 002077DC | func_00207658 | 00213920 / 801D0490 | 14 | R1 reused |
| 002078C0 | func_00207658 | 00213958 / 801D04C8 | 14 | R1 reused |
| 00207E88 | func_00207E30 | 00213990 / 801D0500 | 14 | R1 reused |
| 00208958 | func_00208900 | 002139C8 / 801D0538 | 14 | R1 reused |
| 0020AA28 | func_00209F74 | 00213A00 / 801D0570 | 15 | New |

The ten reused sites retain all 156 accepted entries. The fourteen new sites add 304 entries. The exact ordered 460-slot result is in evidence.json. Repeated target values remain separate slots there.

For the new sites, these are the complete distinct target sets in z64 ROM space. They are conditional sets under the guarded initial-table state, not proven reachable-case sets.

| JR site | Distinct initial destinations, z64 ROM |
|---|---|
| 001F2718 | 001F2720, 001F2728, 001F2730, 001F2738, 001F2740, 001F2744 |
| 001F71D0 | 001F71D8, 001F71E0, 001F71E8 |
| 001F72D4 | 001F72DC, 001F72E4, 001F72EC |
| 001F73F8 | 001F7400, 001F7408, 001F7410 |
| 001F74E8 | 001F74F0, 001F74F8, 001F7500 |
| 001F7614 | 001F761C, 001F7624, 001F762C |
| 001F7788 | 001F7790, 001F7798, 001F77A0 |
| 001F78B8 | 001F78C0, 001F78C8, 001F78D0 |
| 001F7A3C | 001F7A44, 001F7A4C, 001F7A54 |
| 001FAEB8 | 001FAEC0, 001FAEC8, 001FAED0, 001FAED8, 001FAEE0, 001FAEE8, 001FAEF0, 001FAEF8 |
| 001FFC5C | 001FFC64, 001FFC6C |
| 001FFD38 | 001FFD40, 001FFD48 |
| 001FFE14 | 001FFE1C, 001FFE24 |
| 0020AA28 | 0020AA30, 0020AA3C, 0020AA48, 0020AA54, 0020AA60, 0020AA6C, 0020AA78, 0020AA84, 0020AA94 |

## Index origins and conditional limits

The eight 20-slot sites read an unsigned halfword at record offset +0x48. They subtract one, sign-extend the low halfword, then require unsigned index below 20. Along that setup, original halfword values 1..20 select the slots. This does not identify the record field's gameplay meaning.

The 42-slot site reads a byte at RAM 8018F481 and subtracts seven. Its unsigned guard admits original values 7..48. The three 24-slot sites use the word at RAM 801CEAB0 minus 0x22. Their guard admits computed indices 0..23; earlier branches further restrict which indices reach dispatch. The slot census remains a safe superset under those branches.

The 15-slot site at ROM 0020AA28 uses a byte from address t5+s4+0x14, minus one. Its branch-likely rejects unsigned indices at least 15. Its taken delay increment does not alter the accepted dispatch index. The earlier 15-slot site masks s7 to a byte. One incoming route sets s7 to eight; another preserves a call result. No claim says all fifteen slots execute.

Under ordinary traversal of each shown guard/setup and unchanged initialized table contents, the target origins are fully resolved to those slots. There is no remaining unknown loaded-target origin within that conditional model. The index producers can remain semantically unnamed without weakening the slot result.

The table addresses refer to RAM when the function executes. ROM hashes prove initial contents, not runtime immutability. No writer census or mutation-history proof was performed. Entry after the guard, corrupted registers, overwritten tables, alternate overlay states, or runtime-written instructions are outside this conditional result. Internal targets can later call other functions; this result is not a downstream consumer exclusion.

## Tested limits and remaining dependency

Verified static observations: exact site identities, guard/load words, original-ROM agreement, table bytes, conditional target sets and owner containment. Supported interpretation: these are internal dispatch routes in the initial mapped image. New research review status remains pending. No observed invocation, new family exclusion, semantic rename, structural change or matching acceptance follows.

The 24 initial-table routes supply no positive selector transfer. They narrow one indirect-transfer question without proving selector non-use. The separately researched thirteen JALRs, ordinary returns, external overlays and synthesized or changed pointers retain their existing limits. The accepted six-slot publication correction remains intact; it does not establish downstream selector exclusion.

The smallest unresolved dependency is an actual selector transfer's target provenance, or static evidence of a different pointer state that selects it. For these JR routes, that means evidence connecting a changed table slot and valid index to the selector. No such evidence was established here. A qualified pre-existing invocation record could resolve the positive chain. Any later observation needs contemporaneous placement, actual transferring instruction/register value, pointer origin, selector entry state and arguments. Joe's deferred capture remains deferred; this report authorizes no runtime work.

## Reproduction and handoff

Run only the task-local offline checker: python -B build/combat-selector-indirect-jr-r1/check.py. It reads the verified V64, normalizes in memory and writes evidence.json under its assigned ignored root. It invokes no project checker, compiler or production build.

| Artifact | SHA-256 |
|---|---|
| Accepted discovery R2 report | 8D1D02505C724F486B99D5A73245344CDA75FEE1DE436AF2D3A2116D246A44D7 |
| Accepted selector-evidence.json | E492150B62D1F2B1B97FAA2D75413D6D06A6433F4A3F95595182A611E63CB5AD |
| Reused R1 static-evidence.json | 3AE2415E4C63E41A6FFC7AEF73222C38EA4A95F183B7BA402C1E480DD2E7A950 |
| R1 report, unchanged from 150c9fc | EA6A2F9DB52A559B1241DF239E7D92A51AA9A25718D996438E768EAD2F28F684 |
| New check.py | C7681B668955805B7E8AD2CFD1831CAAC95F46E587DEDE082DB3844E3E14E9E7 |
| New evidence.json | 4C796091B9316139A4DF7615C94028D2C0705F05FA3FFD211606A4F372C34C04 |

The evidence package records input paths, lengths and hashes, including every original owner and both accepted configurations. V64 hash is 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12. Normalized z64 hash is 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. No ROM was written.

An initial checker schema-key lookup failed before output generation. Inspecting the actual key corrected this task-local error. Final extraction passed: 24 sites, 460 slots, ten reused sites, zero selector-slot hits. Broad text output truncations were replaced with focused record reads. No failed game hypothesis or production-tool failure occurred.

W7's existing linkage/target configuration, pool headers, new shared header and five source candidates were preserved and excluded. Only this fresh claim/report and ignored check.py/evidence.json were written. No compiler, linked diff, build, verifier, source-policy generator, source/config edit, runtime, GUI, bridge, database, agent or Git mutation occurred. Proposed canonical-document changes: none before review. Matching obligations and all completion gates remain unchanged.

All commands have finished. Terminal handoff releases all assigned writes to /root.