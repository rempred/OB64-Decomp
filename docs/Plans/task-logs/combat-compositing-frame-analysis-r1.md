# W7 indexed-base frame account

Completed: the candidate's eight-byte frame deficit lies above its thirteen active scalar homes, before the packed-byte spill and saved registers. Two compiler-only homes explain otherwise invisible candidate storage. The retail allocation's remaining eight bytes have no uniquely identified owner. The Director can send this bounded account to the sole W7 source worker.

## Identity and scope

Task combat-compositing-frame-analysis r1; launch COMBAT-COMPOSITING-FRAME-ANALYSIS-20260907-01. Worker /root/compilation_groups_design, Astra Medium, local. Director /root, native task 01a07262-aeca-7341-ad10-2dba705ff988. Complete claim created atomically and read back at 2026-09-07T02:59:19.5110977-04:00. Starting HEAD: 96a07fc1bb6531ee6e74dcf8ceec8a10b6b9153e.

Only the frozen indexed-base directory, complete original owner and canonical ROM supply technical inputs. SourceRow/y and input/inner-alpha priority experiments remain with the source worker. Earlier terminal reports and snapshots were not changed or used for pseudo identity.

Input root: build/combat-compositing-wave7-r1/rtl-207E30-indexed-base/. Source SHA-256: 062762E67A14B2DF5367EFF67C53F00A678192AAC093297F92DC3D9B8BCFD5FE. Assembly SHA-256: 483A1C7B635BBBA12F8812159746E374F77870CB857F7E27F2FC623DC9293BA9. Both match the assignment. All thirteen co-located pass files and diagnostic-command.json are separately hashed. Their association is preserved diagnostic evidence, not a new compiler reproduction.

## Frame accounting

Candidate assembly declares vars=184, args=32 and ten saved integer registers. These sum to 256 bytes: 184+32+40. Retail subtracts 264 and saves the same ten registers. Its lowest saved register is at E0; the candidate's is at D8. All offsets below are hexadecimal, relative to the current function's stack pointer.

| Region or role | Candidate | Retail | Evidence and limit |
|---|---|---|---|
| Outgoing call area | 00..20 | Same addressed argument words at10/14/18 | Candidate frame declaration reserves32; retail call sequence corroborates its use |
| Scratch aggregate | Starts20; source size28 | Starts20 | Candidate union has40 bytes; both pass this address to record helpers |
| Returned bounds local | 48..58 | Same48/4C/50/54 accesses | Both pass48 to the bounds call, then copy four words |
| Thirteen active scalar homes | 5C..BC at eight-byte spacing | Same offsets and corresponding roles | Table below |
| First compiler-only comparison home | Word at C4 | Unknown | Explicit candidate USE memory operand |
| Second compiler-only comparison home | Word at CC | Unknown | Explicit candidate USE memory operand |
| Packed byte | D7 | DF | Actual byte store/reload in both |
| Ten saved registers | D8..100, end exclusive | E0..108, end exclusive | Save/restore instructions |
| Incoming fifth/seventh arguments | 110/118 | 118/120 | Caller-frame arguments move with frame size; these are not local allocation |

The candidate's fixed source objects account for 56 bytes from20 to58. Initial RTL places localBounds at virtual local base+40 decimal. CSE concretizes that address as fp+72 decimal. Scratch uses the virtual local base and becomes stack+32. Retail has the same two address anchors. This supports a common lower layout; it does not prove every retail source declaration or exclude an unobserved local elsewhere.

The candidate footprint can be accounted as: outgoing32 + fixed56 + thirteen eight-byte scalar allocation units104 + two comparison units16 + packed-byte unit8 + saves40 =256. Eight-byte units describe the observed allocation spacing and boundaries. Actual SI accesses are four bytes and QI accesses are one byte. Their surrounding bytes must not be called freely available storage.

The retail anchors leave eight more bytes before the packed-byte/save boundary. Its matching active homes do not identify a missing meaningful scalar. An additional compiler-only allocation is consistent with the evidence. Its exact identity, size history and source cause are unresolved without retail intermediates or a controlled matching variant.

## Active local and spill homes

The following candidate homes are established by original pseudo definitions and greg memory replacement, corroborated by final assembly. Retail instructions independently show the same role and offset. Names describe current source roles, not new game semantics.

| Stack home | Candidate pseudo | Role | Definition or evidence |
|---|---:|---|---|
| 5C |72| Argument a | RTL UID4; greg stores a0 |
| 64 |73| Argument b | UID6 |
| 6C |74| directoryIndex | UID8 |
| 74 |75| Argument d | UID10 |
| 7C |90| Output pixel stride | UID169, helper result |
| 84 |91| Output alpha stride | UID181, helper result |
| 8C |92| Outer record index | UID191 initializes zero |
| 94 |93| Output allocation pointer | UID198, allocation result |
| 9C |94| Output-mask pointer | Derived allocation+pixelBytes+8; inserted store UID1125 |
| A4 |95| Handle | UID129, helper result |
| AC |97| Input-mask header pointer | Derived maskBase+8; inserted store UID1155 |
| B4 |98| Row index | UID360 initializes zero; back edge loads/stores same home |
| BC |99| Source-row stride | UID342, helper result |

The source contains additional scalar declarations. A declaration alone does not establish a stack home. Likewise, a pseudo without a final hard register is not automatically a meaningful source spill. The comparison homes below demonstrate why pass evidence matters.

## Compiler-only comparison homes

The loop dump gives pseudo446 the result of the first inner loop's entry comparison at UID1036. Pseudo449 holds the second inner loop's entry comparison at UID1043. Both compare the inner index with loaded input width. These pseudo numbers are specific to indexed-base.

Combine retains USE records UID1114 and UID1115 for those comparison pseudos. Lreg lines1813 and1948 still contain USE(reg446) and USE(reg449). Its summaries classify each as six references across two instructions with ST_REGS preference. They do not represent two long-lived source pointers.

Greg replaces those operands with USE(mem:SI(sp+196)) and USE(mem:SI(sp+204)), respectively. The equivalent hexadecimal homes are C4 and CC. The memory USEs remain in sched2 and dbr. They generate no load/store instructions in final assembly. This is positive allocation evidence despite absent machine-code accesses.

These two homes are already present in the 256-byte candidate. They cannot themselves be described as the missing retail eight bytes. A third analogous comparison allocation could explain the difference, but no retail pass proves that. In particular, naming an outer-loop comparison as the missing owner would currently exceed the evidence.

## Packed-byte slot

Initial RTL UID528 assigns the volatile byte load to pseudo105 in QI mode. It has no fixed stack home there. Lreg retains the byte pseudo; greg reports `Register 105 now on stack` after spilling hard register24. Inserted UID1161 stores the byte at decimal215, hexadecimalD7. A later reload uses the same home.

Candidate assembly lines428 and534 show sb/lbu at D7. Retail's canonical word at ROM0x00208194 stores at DF. Its later packed-byte reload also uses DF. All listed ROM addresses are z64 offsets, not the historical decoded PC comments.

The candidate packed-byte home appears after the two comparison allocations. Its position is therefore allocation-stage evidence, not evidence for a differently sized fixed u8 declaration. The saved-register block follows one byte later at D8; retail follows DF at E0. No change to the byte-read/narrow/store sequence is proposed.

## What this establishes and what remains open

Verified: frame sizes, save blocks, actual stack instructions, fixed-local anchors, thirteen scalar roles, two compiler-only USE homes and the candidate packed-byte spill chain. Supported: the observed eight-byte difference belongs to the upper allocation footprint rather than a demonstrated missing active scalar home. Unresolved: the retail-only allocation's identity and its originating compiler stage.

Absent direct accesses do not prove unused space. The candidate C4/CC examples directly refute that inference. Equally, total frame size does not prove an extra gameplay local or justify adding dummy storage. This task offers no padding, volatile dummy, source recipe, allocator exception or structural reinterpretation.

The useful bounded result for the source worker is to track compiler-only homes alongside active spill homes in its own already authorized variants. Any later claim that a source change explains eight bytes must identify which allocation appears or disappears. Merely obtaining frame264 is not causal proof or matching acceptance. This report does not perform or prescribe the separately owned source-priority analysis.

## Evidence and verification

Task-local check: node build/combat-compositing-frame-analysis-r1/check.js. Result PASS. Eighteen input identities are recorded. The checker validates all438 original words against the authenticated canonical normalized ROM and checks the key pass-home transitions. It performs no compiler, build, verifier or source-policy operation.

| Input or artifact | SHA-256 |
|---|---|
| Initial RTL |5F1E3813C6A7BD32C3D7EADC4D889823BEDB69C87A67C276DD06190436BE79DE|
| Loop dump |5CFCFB46A93A03A5C543A95F9D2E6EFA12F7E9FEA527D1A29705EB04DF7B32EB|
| Combine dump |1E9F9254AB5D3C528055D9A5A94D083E9CA76D1A0985911275D0FFE6857358D8|
| Lreg dump |8DF29E4A09E391F9756A5CCE49E9A019A1F2B1525BDF85A247673E5CAF1420E0|
| Greg dump |DA6DB1DCC07003174F59F5014F47BF7F564CBF428D9DFD1E260F2E9EEB0C2F34|
| Dbr dump |B121FAA66FCF9C7256768E83F5DD4316FC326D22094BA2BA39D7D5420B2C6030|
| Original owner |9EC834B385C85F14D7454B801585285812D94500FD31A0EBE377B77DECD6F0A6|
| Normalized canonical ROM |571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A|
| New ignored evidence.json |215886BAD9EE3E92DB48D267509A3311A1A050F3112846C3AFAC4968BD82BCE9|

Evidence root: build/combat-compositing-frame-analysis-r1/. Its evidence.json includes exact input paths/hashes, selected UID records, scalar-home mappings and both stack-access inventories. Broad command output was narrowed after truncation. Read-only Git status reported inaccessible user-ignore/cache paths; no Git mutation occurred. No experiment or candidate failed in this task.

Only the fresh claim, this report and ignored check.js/evidence.json were written. All input files, production source/configuration/tools and other agents' writes remain unchanged. No runtime, GUI, bridge, database, agent, branch, worktree, stage, commit or push operation occurred. Previous terminal records remain frozen. The complete seven-member W7 keeps its original acceptance gates, with no added independent review. All assigned writes are released at terminal handoff.
