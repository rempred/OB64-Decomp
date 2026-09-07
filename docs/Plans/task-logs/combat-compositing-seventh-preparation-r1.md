# Combat compositing seventh-owner preparation R1

Completed read-only preparation. The seventh owner finds a pool entry, reuses or builds a paired image, then composites decoded records. Two unusual original operations require special attention: a failure self-loop and a destination halfword self-copy. The sole W7 writer can use this note after the sixth owner. No source spelling or matching result was tested.

Task combat-compositing-seventh-preparation, revision 1; launch COMBAT-COMPOSITING-SEVENTH-PREPARATION-20260907-01. Receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local. Ready commit de276139b60f86c56076a7601403ca89b5887efa; starting HEAD f527c7588d2e5fde29c7fdd9c8a5265684d42c09. The fresh claim was created atomically and read back before other writes. Required guides were read in this continuing context.

## Identity and complete owner

| Semantic name | Meaning retained | Address | Address space | Evidence role |
|---|---|---|---|---|
| Seventh owner | func_00208900 | 00208900..00208D80 | z64 ROM, end exclusive | Complete 1,152-byte comparison |
| Seventh placement | Accepted descriptor 10 | 801C5470..801C58F0 | RAM virtual, end exclusive | Calls and internal branches |
| Switch table | Fourteen initial pointers | 002139C8 / 801D0538 | z64 ROM / RAM virtual | Existing auxiliary contract |
| Pool root | Existing CombatPosePoolRecord array | 801D0728 | RAM virtual | 0xB0-byte scan |

Accepted production references use 0e1191013aeebed2929c9caff7c1f139169ad7f3. Frozen retrieval at 68f66c9 supplies package SHA256 F376C9304E9CB3AAC2B76886EBE0CACCF271D700D31191F6E8D05A56E7720E2B. Original assembly SHA256 is E970E66CA97FBC4590E946400B297CFF981FB2898BB9EBE70939655C98AE880C.

All 288 owner words match baseline and normalized ROM. The older size=1224 assembly comment is not the accepted extent. The owner ends with jr ra at ROM 00208D78 and its delay word at 00208D7C. All decoded direct branches/jumps remain inside the complete owner. Thirteen JAL sites and fourteen switch slots are recorded. The supplied package contains no archived candidate or earlier matching note for this target. No general historical search occurred.

## Arguments, selector normalization and pool lookup

There are seven word-sized incoming arguments. Use neutral labels: slot, key, variant, directoryIndex, arg5, arg6, selected. Stack +0xE0/+0xE4/+0xE8 hold incoming arguments five through seven after the 0xD0 frame allocation. Do not infer their types from mutable W7 declarations.

The switch index is unsigned(key-0x39), bounded below 14. Its exact selected-argument replacements are:

| key | 39 | 3A | 3B | 3C | 3D | 3E | 3F | 40 | 41 | 42 | 43 | 44 | 45 | 46 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| replacement, hex | 2 | 8 | B | D | F | 12 | 2 | 2 | 3 | 4 | 5 | 6 | unchanged | 8 |

Out-of-range keys also preserve selected. These are original table contents, not a runtime immutability proof. The common join stores the replacement back into the incoming selected slot. Keep the original table/auxiliary ownership contracts; no new boundary follows.

Call func_002015C8(key,variant,arg6,arg5) at ROM 002089C4 and retain its result as the lookup handle. Scan twenty records at byte stride 0xB0. Compare record field_00 to the handle. Only a matching key calls func_0020161C(key,variant,arg6,arg5), then compares its result to record field_0C. The pool root is loaded each scan iteration. No concurrent-mutation guarantee permits moving that load automatically.

ROM 00208A34 contains word 1460FFFF: bne v1,zero to itself, with nop delay. The preceding computation combines record==0 with index>=20. Thus failure is a fixed-condition self-loop, not return-null, restart-search, or polling updated state. Preserve it in the first reconstruction; do not correct behavior based on presumed intent.

For a found record, the pointer slot is field_70[slot], using four-byte indexing. A separate byte is at record+0x98+slot. The accepted pool view names field_98 as a word; this owner establishes a byte access here, not a new replacement layout. Slot bounds are not checked by this owner.

If the pointer slot is nonzero, call func_00208508(pointer,15-byteAt98PlusSlot), then return the pointer reread from the pool. This path neither allocates nor decrements that byte here. Sixth-owner implementation remains separate and was not re-examined.

## First allocation and publication

On an empty pointer slot, call RAM 801C1EE8 / func_00205378 with local output at stack +0x48, handle and directoryIndex. Treat its four output words neutrally as left, top, right, bottom for arithmetic. Width = right-left and height = bottom-top are signed integer differences; do not narrow before allocation arithmetic.

Compute destination stride A using func_00201E38(2,width), and destination stride B using func_00201E38(1,width). Allocate A*height+B*height+16, then clear the whole allocation with the existing two-argument zero-fill helper. First header T is the allocation. Second header U = T+A*height+8.

Both headers receive bytes 0x36,0x34. T receives type/format 0/2; U receives 4/1. Width and height are stored as halfwords only at publication. The larger integer dimensions remain relevant to allocation and stride calculations. Do not replace these stores with guessed packed constants before a diff justifies the expression.

Publish T into the pool pointer slot before compositing. Store byte 15 at record+0x98+slot. The routine retains the allocation and does not free it on completion. There is no null-allocation branch or validated arbitrary dimension/slot domain.

## Decoded-record loop and source headers

The record index starts at zero. func_00205608(handle,directoryIndex,index,out) writes the stack +0x20 decoded record. Its false result exits and returns the cached pool pointer. Accepted CombatPoseRecord matches this output: field_04 at stack +0x24 and field_08 at +0x28 supply placement offsets. This decoder does not use the indexed-output type from func_00205484.

For each successful record, call func_00206340(key,variant,&decoded,arg5,arg6,selected,0). Preserve the arg5/arg6 order here; it differs from the lookup helpers. The returned pointer S is the first source header.

Call func_00201E08(S.format,S.width,S.height) to find the first payload size L. The temporary s0 initially holds S+L, not the second header. Call func_00201E38(2,S.width) for source halfword-row stride C. Then read the second format and width at (S+L)+0xB/+0xC and calculate byte stride D. Only afterward does s0 advance eight bytes to the actual second header V=S+L+8.

Initial source cursors are S+8 for halfword data and S+L+16 for second payload data. Destination offsets are:

- yOffset = decoded.field_08-top;
- xOffset = decoded.field_04-left;
- first destination = T+8+A*yOffset+2*xOffset;
- second destination = U+8+B*yOffset+xOffset.

No clipping occurs before these pointer offsets or the row copy. Preserve signed offset arithmetic and distinguish source/destination strides. The source first stride explicitly requests format 2 even though the earlier payload-size call uses S.format.

## Pixel branches and loop-carried state

The outer copy loop uses S.height, reloaded as an unsigned halfword. Each row reads V.format anew. The inner width tests reload unsigned S.width. Counters are signed integers with signed comparisons against those promoted halfwords.

When V.format is 1, each source second-payload byte controls one destination pixel. Zero skips all stores. Nonzero writes that byte to the second destination. It then performs lhu v0,0(v1) followed by sh v0,0(v1), where v1 is the first destination cursor. This is a destination self-copy, not a load from the first source payload. Exact words are 94620000 and A4620000 at ROM 00208C68/00208C6C.

The first source-row cursor is still advanced each row but is unused in this format-1 inner loop. Replacing the self-copy with source-to-destination copying changes retail behavior. A normal redundant C assignment may be eliminated; the future worker must measure that concrete issue. This note supplies no volatile prescription, compiler workaround, inline assembler or acceptance exception.

For every other V.format value, a packed byte supplies two nibbles. The upper nibble, when nonzero, expands to nibble*17 and writes the first destination byte; its matching source halfword is copied. The lower nibble independently controls the next destination byte and next source halfword. Zero nibbles leave existing destination values unchanged, preserving earlier decoded-record contributions.

The packed-byte index uses signed column/2 with sign adjustment. The column advances by two and tests column<S.width only after both nibble paths. Thus odd width does not suppress the second pixel in the final pair. Do not add an odd-width guard or infer an even-width caller domain. Header padding and real caller validity remain separate evidence questions.

| State | Retail role | Per-row change |
|---|---|---|
| First source payload row | t4 | +C |
| Second source payload row | t3 | +D |
| First destination row | a1 | +A |
| Second destination row | a0 | +B |
| Row counter | t5 | +1 |
| First source stride | s2 | Retained across rows |
| Second source stride | t6 | Retained across rows |
| First/second destination strides | s7/s6 | Retained across all decoded records |
| Decoded-record index | s4 | +1 after row loop, including zero height |

In format 1, t4 advances in the jump delay at ROM 00208C90 and jumps to ROM 00208D1C, bypassing the generic increment at 00208D18. It advances exactly once. The other branch uses 00208D18. Preserve likely-branch delay increments so transparent pixels also advance destination cursors exactly once.

After each source record, increment the decoded index and return to the decoder. Destination rows are recalculated from that next record's offsets. Source C/D are recalculated each record. Destination A/B and the published allocation persist. There is no per-record free or clear.

## Matching priorities and limits

Begin with existing pool/decoded types, neutral eight-byte image headers, four explicit row cursors and separate source/destination strides. Retain the failure spin, cached fast path, early publication, transparent-pixel preservation, destination self-copy and odd-width pair behavior. Do not borrow the fifth owner's allocation/copy interpretation or sixth owner's transform expressions.

Concrete diff landmarks are frame 0xD0, thirteen JAL sites, one fourteen-slot indirect dispatch, the self-branch, two pixel-loop forms and shared row-increment tail. The self-copy is an untested source-expression challenge, not an established inherent-assembly requirement. No structural defect or pure-C blocker was proven.

The writer's current order remains sixth owner, seventh owner, then the preserved nonexact fifth candidate. All seven original W7 members require the one final complete-wave verifier. The thirteen-target supplemental draft and future memberships remain unchanged. No independent matching-review gate is added.

## Evidence and release

Command: python -B build/combat-compositing-seventh-preparation-r1/check.py. It authenticates the package, baseline owner, all 288 ROM words, thirteen calls, and fourteen original table slots. It independently decodes the failure self-branch. Evidence includes full owner words, call sites, branch targets, table slots and baseline type identities.

Ignored evidence.json SHA256: 2FAFA70324A815B62CEB1A91C59C7C4ABB15A3696DE2B69CAC8CB9728D455843. Raw V64 SHA256: 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12. Normalized z64 SHA256: 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. ROM normalization stayed in memory.

Exact word/local dataflow observations are Verified static. Reconstruction guidance is Supported and uncompiled. No new semantics, structural acceptance or matching result is claimed. An initially guessed helper C path was absent; the recorded RAM target maps to func_00205378, retained without further semantic research.

Only the fresh claim, this report and ignored checker/evidence were written. W7's mutable sources/configuration and all frozen reports were preserved. No C candidate, compiler, linking, build, verifier, source-policy generator, production edit, external source, runtime, GUI, bridge, database, agent or Git mutation occurred. All commands finished. Terminal handoff releases all assigned writes to /root.