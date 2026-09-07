# Terminal helper preparation r1

Complete read-only preparation. This preparation preserves six complete helpers and the original fifteen-member terminal wave.
Director /root must bind the preceding complete resolution/action-mode results before future source activation.

Task combat-terminal-helper-preparation, revision 1; launch COMBAT-TERMINAL-HELPER-PREPARATION-20260907-01.
Receiver /root/sequential_scope; Director native 01a07262-aeca-7341-ad10-2dba705ff988; local; Astra Medium.
Ready 2f76aceb8a129209b9c07283bc084991ee0d9aa1; activation e5401be79ffeabb94752620d29e5a51bd5e20ca7.
Coordination a8db883e982a32a752b56daf3f297402a6f0d88c; accepted source W7 469a1416918592749d61dc34e3e079796f7b673c.
Fresh complete claim created atomically and read back before other writes; report and ignored root were absent.
Unchanged required guides and accepted original-assembly research-aide routing are reused from preceding preparations.
Current assignment, terminal draft and sequential dependencies control this work. W8 remains the sole production writer.
Authenticated corrected inputs and compared every owner word; bounded maps cover complete ABI/storage/control/helper/data obligations.
Main hypothesis: direct helper contracts and complete state transitions support reconstruction without changing owner boundaries.
Alternative: guessed types, partial state paths or omitted delay effects would change the accepted instructions.
Any byte or controlling owner mismatch stops preparation. Behavioral uncertainty creates no universal matching gate.


## Evidence and complete coverage

The corrected package and correction report match their required hashes and Git objects. `build/combat-terminal-helper-preparation-r1/evidence.json` records exact Git input identities, original parts, canonical ROM identity, working registry snapshots (not accepted state), directly relevant helper inputs, and 18 consumed literal ranges with exact words, float interpretations and existing semantic rows. Per-owner JSON includes every literal call with corrected aliases, delay slots, all integer/COP1 transfers, memory references, escaped stack address contexts and final returns; TXT supplies every instruction at accepted ROM/VMA; helpers.md maps conditional placements without treating aliases as new callees.

All 4,784 bytes / 1,196 instructions equal canonical normalized Rev 0 ROM (41,943,040 bytes, SHA256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A). There are 70 literal calls, 143 direct transfers including 25 COP1 branches, 358 memory references and six indirect transfers, all final returns. Every non-call direct destination remains inside its complete owner. No dispatcher or hidden continuation was omitted. Comment branch VMAs are legacy decoding aids; map destinations are decoded under accepted resource-loader-00213b10 placement, delta +0x7FFBCD30.

| Owner | Bytes / instructions | Frame | Final return ROM | Calls |
|---|---:|---:|---|---:|
| 21D7F0 | 1204 / 301 | 0x68 | 21DC9C | 19 |
| 21DCA4 | 972 / 243 | 0x78 | 21E068 | 15 |
| 21E070 | 596 / 149 | 0x50 | 21E2BC | 8 |
| 21E2C4 | 584 / 146 | 0x50 | 21E504 | 7 |
| 21E50C | 1168 / 292 | 0x68 | 21E994 | 19 |
| 21E99C | 260 / 65 | 0x18 | 21EA98 | 2 |

Each return restores its frame in the delay slot; the complete extent ends eight bytes after the listed return. No function supplies an explicit normalized status result; retain effect-oriented interfaces without inventing return meaning.

## ABI and complete state paths

Use neutral `state` and `actor` terminology: state+0x40 holds the related pointer. First five helpers use signed current halfwords +0x1C/+0x20, write starting floats +0xA0/+0xA4, clear +0xA8/+0xAC, and write float increments +0xB0/+0xB4. Preserve individual load/store and narrowing order.

- **21D7F0:** a0 state, a1/a2 signed destination words. Writes float destinations +0x98/+0x9C; subtracts current signed halfwords as integers before conversion. 21D7F0..21D9C4 calculates increments; ..21DA14 initializes state and gates profile creation on low byte of helper 00043AD8 result equaling 1; ..21DAD0 handles duration/ring allocation; ..21DC04 selects profiles; ..21DC70 scales and initializes them; remainder restores registers. Five-argument 222190 receives actor, current X/Z, destination X/Z, fifth at outgoing sp+0x10; duration is result+1. No escaped local array.
- **21DCA4:** a0 state, a1 target. Target words +0x5C/+0x64 are integer values even though loaded through COP1; conversion follows. Subtracts current coordinates before conversion. Speed result is doubled in single precision. Math ends 21DE74; state and two literal local-array initializers end 21DF00; duration/ring/copies end 21DFCC; scale/header ends 21E038; epilogue ends 21E070. Four-argument 22222C receives actor,target,current X/Z. Duration is signed truncation-toward-zero half of returned word, then +1 (retain shift/add sequence). Real escaped arrays are exactly 12 bytes at sp+0x10 and sp+0x20, each copied to the heap; frame gaps are not extra elements. Fixed count 3.
- **21E070:** a0 state, a1 target. Destination is float(target word - (actor word - signed current halfword)), for +0x5C/+0x64; write +0x98/+0x9C, then subtract separately converted current coordinates in single precision. Do not algebraically collapse this rounding sequence. Coordinates/speed through 21E134, math through 21E268, state reset through 21E298, epilogue to 21E2C4. No allocation or escaped local buffer.
- **21E2C4:** a0 state, a1/a2 carry **single-float bit patterns**, a3 low byte is speed. `mtc1` on a1/a2 has no integer conversion. Destinations are float arguments minus separately converted actor-minus-current values; deltas then subtract float current values. Coordinates through 21E380, math through 21E4B0, state reset through 21E4E0, epilogue to 21E50C. No escaped local buffer; preserve four word-register slots and float representations in the eventual ABI.
- **21E50C:** only a0 state is consumed publicly. Destinations are signed halfwords +0x28/+0x2C; this helper does **not** write +0x98/+0x9C. Uses 2016F4 rather than 201670. Math through 21E6BC, state/gate through 21E70C, duration/allocation through 21E7CC, profiles through 21E8FC, scale/header through 21E968, epilogue to 21E99C. Five-argument 222344 receives actor,current X/Z,destination halfwords X/Z; fifth outgoing sp+0x10. Duration=result+1. No escaped local array.
- **21E99C:** a0 state, a1 second state. Sequentially copies unsigned halfwords state+0x28/+0x2A/+0x2C into both states' +0x1C/+0x1E/+0x20. Preserve load/store order for potentially overlapping objects. Calls 20C104(actor), then 20C120(actor) only if first result is zero. If either is nonzero, writes state+4/+8/+0xC from 30*actor words +0x5C/+0x60/+0x64 minus (actor word - signed destination halfword); otherwise writes 30*signed destination halfword. Retain actual 32-bit shifts/subtractions, subsequent halfword rereads and final stores. No FP operations or escaped locals.

## Shared floating-point and allocation interfaces

The first five owners preserve paired callee-saved FP registers f20..f30. Vertical-zero-horizontal branch bypasses trigonometry: horizontal increment is zero and vertical magnitude is speed. Otherwise 0002D3E0 receives single f12=vertical delta, f14=horizontal delta and returns single f0, then angle is promoted to double. `cos` at 8009CAF0 and `sin` at 8009C9A0 take/return doubles. Each component calls its function for a comparison and calls it again in the selected arm before multiplying again. There are three static call sites per trig function, two executed per component. Preserve the positive-product comparison, nonpositive negation, double-to-single narrowing and final negative-delta sign adjustment; do not replace with fabs or common-subexpression elimination. NaN/signed-zero cases are not established runtime observations. 201670 and 2016F4 return a single float (selected unsigned table byte divided by 16); caller arguments are actor words +0x48/+0x4C. No direct random calls occur here.

D7F0/DCA4/E50C share the observed 0x84-byte allocation. Pointer at 801CE8BC selects context; unsigned counter byte +0x1A8 modulo 10 selects pointer slot +0x180+4*index. Free old nonzero pointer, allocate 0x84, publish ring pointer, zero 0x84 bytes, increment byte counter with narrowing, and publish state+0xBC. Original callers do not guard allocation failure. Preserve this order and absence of guards. The +0x10 outgoing argument is not a local object.

Heap header words +0/+4/+8 are index zero/count/duration. Arrays start +0x0C/+0x34/+0x5C. Observed counts are at most 7; spacing alone is not a declaration-capacity proof. Source-first `memcpy` at 80093060 receives source,destination,length (not the usual libc argument order). Scale the first count floats at +0x0C by float duration, then call 26C9CC at 80217E1C with count and those three pointers. Direct callee evidence: signed count<3 returns without dereferencing arrays; for counts 3..7 it reads the first two count-float inputs and writes only count output floats, including endpoint zeroes, using allocated 8*count temporary bytes and freeing them. Temporary allocation failure returns without further array work. Thus consumed output ends at +0x78 for count7, within the actual 0x84 allocation. This does not establish arbitrary external capacities or remove original missing guards.

## Literal profiles and existing data ownership

All addresses below are accepted VMAs; evidence.json supplies ROM translations, words, hashes and every overlapping existing data row. Do not emit a new partition or treat an interior literal as a new owner.

| Selector actor word +0x4C | D7F0 count / source pair | E50C count / source pair |
|---|---|---|
| 0x4A | 5 / 801E5CC0,801E5CD4 | 5 / 801E5D70,801E5D84 |
| 0x49 | 7 / 801E5CE8,801E5D04 | 4 / 801E5D98,801E5DA8 |
| 0x24,25,27,28,29,45,46,79 | 7 / 801E5D20,801E5D3C | 7 / 801E5DB8,801E5DD4 |
| 0x47,48 | 3 / 801E5D58,801E5D64; duration -=15 | 4 / 801E5DF0,801E5E00 |
| default | 0 / no copies | 0 / no copies |

Each copied range is count*4 bytes. DCA4's two three-word local initializers are 801E6C30 and 801E6C3C; their raw words are authoritative. The D7F0 first initializer begins at ROM 00228F90, the last word of data_00228d90, and continues into float_00228f94; later profile literals share that float owner. DCA4 literals lie inside float_00229ef8. All three complete data-owner word streams also equal the canonical ROM. Existing rows can cut across consumed ranges, so production must retain current combined owner handling instead of inventing independent per-array definitions. The global pointer/ring accesses describe observed storage offsets, not a new accepted type or lifetime contract.

## Reconstruction order and limits

After a fresh production activation, bind preceding accepted 17-member mode and 7-member resolution interfaces, current target/linkage/data ownership contracts, and the full 15-member terminal wave. Suggested order within the future writer's schedule: E99C; E070 and E2C4; D7F0; DCA4; E50C, reusing established interfaces but matching each complete owner independently. This is preparation order only, not six new waves. EBBC's frozen report is reused solely as caller/interface context; its outstanding table/storage obligations remain unchanged.

Retain original retries and missing guards. Unknown termination, exhaustion, runtime values and field meanings create no universal ordinary-matching gate. Resolve storage bounds/actual aliasing when a proposed C declaration relies on them; avoid imposing guessed object layouts. Existing registry snapshots are not source activation or ownership acceptance. No new structural partition, semantics, compiler conclusion or matching result is accepted here. No compiler/build/diff/verifier, production/tool/config edit, runtime/database operation, Git mutation or agent launch was performed.

All assigned writes released at handoff. Resume only under a fresh assignment; authenticate these outputs and controlling inputs before reuse.

## Output hashes

Ignored output root: build/combat-terminal-helper-preparation-r1/. SHA256 values below identify the final bounded artifacts; report and claim hashes are returned separately to Director.

| File | SHA256 |
|---|---|
| evidence.json | 3ABF668DE48322A42D7C7D9AD5DE7281768E36770B2A4839212D7946ED741424 |
| func_0021D7F0-helpers.md | 5F2EC4BDD85B97143AF8D169170E05F1731132AC8ADF0140A72F7544698FB917 |
| func_0021D7F0.json | 2F0DB1E5AE559922E4D0210546F25C16263F55985CA9B98CED7BEC9D114306BD |
| func_0021D7F0.txt | 95E0FAC09A289382910174E226B7074E6681DA26C69BA8DC99A857A31490D9A5 |
| func_0021DCA4-helpers.md | BCED2AEEF1E97E88A214047C4728F0C78A344D2D4EB617E343DA994533748331 |
| func_0021DCA4.json | 1FEE93D03C5445379B97FE50C3861BDE1010F96D57898F0FF6460FB842365EB4 |
| func_0021DCA4.txt | B04621BDB3C88C78C5F78AAB59F612F6ECAB223D0C028DB0850674CDB49456BB |
| func_0021E070-helpers.md | 8BB40EAAE53129ABF0ED2D6878219AB5EB16948C6BA753F3427DDC0346F126C8 |
| func_0021E070.json | AAFDF4CA082BF0BFF93855FD39627E9A19009652D62CBA34D49F2D69C5F2CE7E |
| func_0021E070.txt | 5766A86B6B25FCA342BF2D51AEB1908CD9BC0893F9CAB24E9E01FA021B20671D |
| func_0021E2C4-helpers.md | 4B6B36A8EDCFEB025D17973CBBD180FFF013ED8F9BE87D6FFAF8674B179B2402 |
| func_0021E2C4.json | BA993BD1AADDF39B1F00EDA6F3517877C697F02A7400DCFFC2B923092D14CDF9 |
| func_0021E2C4.txt | 0CE07FD383FD2D3DFD4B084C4BF67563C13608D8F740C2DBBE9C67D89DD631D7 |
| func_0021E50C-helpers.md | E047C63F437128E573A252E58504FD7B08DEEE8EFCEF0FACBC51B24A332395CD |
| func_0021E50C.json | 5243BD040832FC0AB77D7A8BF4C7CB34771DC7AABA65E7921097B6B1298105AA |
| func_0021E50C.txt | 1C7C0A31C7983EF56C2BBFAABB67271710D107F046CB0DBC86E062DA8614277C |
| func_0021E99C-helpers.md | D4646B3FE01741AF5C4E5BA2F70819F5D4A9C69911FF6F43AC379A42922A992F |
| func_0021E99C.json | 8F93F3CF987C28EF141F5E2ADBDE05D1BB196A37FF1748796BD12EC7A5085A94 |
| func_0021E99C.txt | BA6E928651122F2CE6E73D948E27BB4842141DA06573CD1E03FEE10A875BBD3D |
| prepare.py | A73AD8AFFD1577118190388AB0A6D191239E7782938A57AC07E27CDE1E9C42EE |
