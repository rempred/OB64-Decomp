# 001F5654 packet preparation r1

Complete: the cursor-before-counter ordering is already present in source expansion and the initial RTL. No retained optimizer pass first introduces it. The first retained pass moving later cursor publications ahead of earlier packet words is .sched2. These are different findings; the supplied diagnostic assembly is comparable to the frozen production assembly.

## Identity and comparability

Launch COMBAT-DRAW-5654-PACKET-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root (native 01a07262-aeca-7341-ad10-2dba705ff988), local. Ready fdff746c1af12146a94814915d770381bbf82028; activation a49ff6b4e56f4b89a3df4afcbae3372e3017112d; coordination baseline 46ef8266efb41961b88a6603efb3a8566e37f9c4. Fresh claim was atomically created with CreateNew and read back before other writes. Unchanged required guides were reused as authorized.

All four supplied source/assembly hashes matched the active prompt. Every retained dump and diagnostic-command.json received an exact hash before interpretation, recorded in input-identities.json. The command records KMC cc1, O2, big-endian MIPS3, gp32/fp32, G0, no PIC/abicalls/builtin, unsigned char, -da, status0. No compiler was invoked.

The source text diff shows production includes/macros replaced by explicit declarations and expressions in the diagnostic source. In particular, each scoped PAIR expands to a local command pointer initialized by D_800E9BA0++, followed by first-word and second-word assignments. The diagnostic FIELD/WORD expressions show the two counter reads explicitly. Mutable header definitions were not read to reconstruct a preprocessor environment. Comparability rests on the supplied assembly: the entire textual assembly differs only in .file and the comment listing -da; after removing those filename/comment lines, all remaining text is identical. Full comparison-c.txt and comparison-s.txt are retained as identity/comparability evidence; no geometry or vertex expression analysis was performed. This is a property of these two frozen outputs, not a general -da guarantee.

Frozen complete-owner report SHA256 917E5C8FB8BA88AA21BCB11E82D6CDF5810DC148E3E34C7636EF116EEBE65C9D and evidence SHA256 72B8E618FEAB594AA673864C25EF7CAF3EDED75822F221543B071A7710940B76 matched. W7 original ASM at469a1416918592749d61dc34e3e079796f7b673c matched SHA256 524E1CA0DCE51E802A8DD9FA36000A87B4BB3D7AE0FB6D09D7862052A672F7A9; all657 original words matched the authenticated normalized ROM. Source v64 SHA256 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 and normalized z64 SHA256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A matched without writing the ROM. The derived original.s aid's74 words from ROM001F5880 through001F59A4 also match those words and accepted delta0x7FFBCB70. These are retained in retail-packets.json.

## Retail packet boundary

Let P be the cursor reloaded after the resource helper. The preceding FD900000 command receives helper result+8 at its second word, outside these seven packets. The six fixed pairs at P are F59001F0/07010040, E6000000/0, F3000000/0703F800, E7000000/0, F58003F0/01010040, F2000000/0103C03C. Their twelve stores complete by ROM001F5908, with some constant-word reordering: the first E600 word at P+8 precedes the first pair's two words.

At ROM001F590C, retail first loads word[scene+0x6080], then stores the computed seventh first word at P+0x30 (001F592C). It loads the counter again at001F5930. Only then does it publish seven global cursor values P+8,16,24,32,40,48,56, at ROM001F593C/5948/5954/5960/596C/5978/5984. Finally it computes and stores the seventh second word at P+0x34 (001F59A4). Thus retail does not put every packet word before every cursor store: the final second word is after all seven publications, while both counter loads are before them.

The seventh first expression is F2000000 OR (((0u-(counter1&15))<<2)&0xFFF); second is01040000 OR (((0u-((counter2&15)+16))<<2)&0xFFF). Keep two loads separated by the first-word store. Unsigned arithmetic expresses the observed wrap/shift/mask without undefined negative signed shifts. No new counter semantics is inferred.

## Retained pass evidence

| Role | Diagnostic instruction UIDs |
|---|---|
| Resource call / its trailing FD second-word store | 293 /299 |
| Scene pointer capture / command pointer load | 305 /309 |
| Seven global publications | 313,332,349,368,385,404,423 |
| First six packet word pairs | 319/323,338/340,355/359,374/376,391/395,410/414 |
| Counter loads | 427,438 |
| Seventh first/second stores | 436,449 |

In .rtl the selected order is publication313, words319/323, publication332, words338/340, and so forth through publication423, then read427, store436, read438, store449. This is exactly the publication-before-assignment structure in the diagnostic source. All seven publications already precede both scene-counter reads; each publication already precedes its own packet words. Neither relationship first arises in an optimizer pass.

.jump, .cse, .loop, .cse2, .flow and .combine preserve that selected memory-operation order. CSE folds cursor reloads/arithmetic toward the captured base and changes expressions, but does not create the queried crossing. In .sched, scene pointer capture305 and cursor load309 move before the FD trailing store299. The seven publications and packet words retain the interleaved order. .lreg and .greg preserve it too. Distinguish the scene-pointer capture from reads427/438 of the scene counter itself.

.sched2 first produces this selected sequence after299:

313,332,338,349,355,368,385,323,404,319,340,359,374,376,391,395,410,414,423,427,436,438,449.

For a concrete discriminator of this transition, publication332 moves ahead of first-packet word319 (and323); publication404 also moves ahead of319. In .greg those publications followed the earlier packet's words. This is the first retained crossing of later packet publications ahead of earlier packet words. .jump2 and .dbr retain this selected order; .dbr wraps the earlier call in a delay-slot sequence, so absence of top-level call293 in the selected trace is not deletion of the call.

The .sched dependency lists already put publications313..423 before counter read427, and counter read438 additionally follows store436. Packet writes appear as mem/s:SI while the global cursor and scene reads appear as mem:SI. Those are concrete retained representations, not proof of a complete alias-analysis or scheduling-priority explanation. The dumps supply no intervening pass that changes the counter ordering to retail's.

## One bounded representation discriminator

For this seven-packet region only, separate local packet addressing from global cursor publication. Retain P, write the six fixed pairs, obtain counter1 and store the seventh first word, obtain counter2, then publish the seven observed cursor values before the seventh second-word store. Keep both counter loads, all fourteen words and all seven cursor stores. This proposes a source-level publication boundary matching retail, rather than relying on a later optimizer to move the current macro's already-early publications across the counter reads. No candidate was written.

Prediction: the initial RTL will show both counter loads before the seven publications, and the scheduled dependency/order evidence can then determine whether that boundary survives. A useful linked result would preserve seven cursor writes and the two counter reads with retail's relative ordering. Falsifier: the revised expansion still places publications before either read, or later passes restore the current early order/collapse the seven writes or the two reads. In those cases, merely repeating equivalent macro spellings is unsupported by this note. No exact-byte result or successful scheduling outcome is promised.

This is not asserted equivalent to the current macro for arbitrary aliasing between scene, command storage and cursor global. It is an independent retail-order reconstruction hypothesis. It introduces no volatile, barriers, compiler flags, assembly escape or new alias/ownership rule; a future authorized matcher must test it under the normal contracts. No second discriminator or geometry change is proposed.

## Limits and release

Only the supplied snapshot/pass package and necessary accepted owner evidence were used. Full-file text comparisons were for comparability, not analysis of excluded geometry/accumulated-row work, vertex refinement or other candidates. No mutable production/header/config, Resolver or generated current state was inspected. The supplied2592-byte/frame296 characterization remains a diagnostic snapshot; this work does not establish a strongest result or matching acceptance.

Only the fresh claim, report and ignored build/combat-draw-5654-packet-preparation-r1/ root were written. Offline scripts inspect.py and trace.py authenticate inputs and preserve selected evidence. No authentication failed. The trace parser was refined to recognize mode-suffixed insn records and the correct final store UID449; no production experiment resulted. All thirteen dumps remain identified individually, and the original complete owner remains2628 bytes. All fourteen W8 targets, the full supplement and the single final complete-wave verifier remain required. This adds no independent review or reusable compiler/semantic/structural acceptance.

No candidate/source-spelling experiment, compiler/link/build/verifier/source-policy operation, production/shared-tool/structural edit, agents, runtime/GUI/bridge/database/capture or Git mutation occurred. All commands have finished; direct handoff goes to /root, and all assigned writes are released at terminal handoff.

## Evidence identities

| Ignored evidence | SHA256 |
|---|---|
| input-identities.json | 6B4E7CEE81DB4BEA6E384DF34530C3B9AECCFC0B1E68D7EC8A564145D9A77C6A |
| pass-trace.json | D1C0C6A394952C8C413A399F1B133411A7DCDEF28E666F360A84544F3D0999DA |
| retail-packets.json | A67324B36D79F3031A7024D4EC4EC691F007C11C3EC80A5323A52B3AEADD9C2F |
