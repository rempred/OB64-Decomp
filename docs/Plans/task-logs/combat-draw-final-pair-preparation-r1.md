# Combat draw final pair preparation r1

Completed: both complete owners match authenticated Rev 0 ROM. The notes identify exact argument positions, format branches, command fields and shared-tail distinctions. The future W8 writer can use this uncompiled guidance while independently implementing and proving both owners under existing complete-wave gates.

## Scope and identity

Launch COMBAT-DRAW-FINAL-PAIR-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local. The fresh atomic claim records activation HEAD e5c87a0a3bb9999cbb2260db0a3b590a25fc96b4. Ready commit is 08a635f74fcb10bed5826b33dfa1a629605312e9.

Used the unchanged W8 literal package with draw-inputs r1 at4cac111 and its r2 citation correction at341055c. Corrected extraction baseline: d70fd853fdffacf71290b24763e010a549276a55. Production references use accepted W7 Git blobs at469a1416918592749d61dc34e3e079796f7b673c. Mutable W8 and Resolver source and generated outputs were excluded.

Unchanged required guides were reused. Prior draw notes supply bounded caller context only; they remain uncompiled and do not establish identical owner behavior. The first owner was read, authenticated and summarized before analyzing the second. No prior report was changed.

| Neutral name | Meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| Basic emitter | func_001FCB28 complete owner | 001FCB28..001FD56C | z64 ROM, exclusive end | 2,628 bytes /657 words |
| Basic placed owner | Descriptor10 placement | 801B9698..801BA0DC | RAM, exclusive end | Accepted placement |
| Extended emitter | func_001FD56C complete owner | 001FD56C..001FDEC8 | z64 ROM, exclusive end | 2,396 bytes /599 words |
| Extended placed owner | Descriptor10 placement | 801BA0DC..801BAA38 | RAM, exclusive end | Accepted placement |
| Command cursor | Next command pair pointer | 800E9BA0 | RAM word | Sole global written |

Both use RAM-minus-ROM delta7FFBCB70. Decoded comments have stale address columns; the evidence derives branch destinations from words and translates J targets through accepted placement. The basic owner has24 internal direct edges; the extended owner has30. Neither has a JAL, JALR, loop or self-loop. Their sole indirect transfers are final JR RA returns at ROM001FD564 and001FDEC0. Each includes its final delay slot and has a16-byte stack frame.

## Basic emitter: arguments and supported paths

Number arguments from1. All scalar inputs are consumed as32-bit values before explicit masks or shifts. Their descriptive names reflect command fields, not new gameplay meanings. No image header is dereferenced; argument1 is stored directly as a command pointer.

| Argument | Neutral role | Machine source after frame allocation |
|---:|---|---|
| 1 | image pointer | incoming a0 |
| 2 | type selector | incoming a1 |
| 3 | format selector | incoming a2 |
| 4 | image width | incoming a3 |
| 5 | unused slot; callers supply height | stack20 is not read |
| 6,7 | inclusive x0,y0 | stack24,28 |
| 8,9 | inclusive x1,y1 | stack2C,30 |
| 10 | palette field | stack34 |
| 11,12 | cms,cmt two-bit fields | stack38,3C |
| 13,14 | masks,maskt four-bit fields | stack40,44 |
| 15,16 | shifts,shiftt four-bit fields | stack48,4C |

The accepted paths are exactly these seven pairs:

| Type / format | FD image prefix | F5 load prefix | F5 render prefix | Width/coordinate class |
|---|---|---|---|---|
| 0 / 2 | FD100000 | F5100000 | F5100000 | full / double-byte line |
| 0 / 3 | FD180000 | F5180000 | F5180000 | full / double-byte line |
| 3 / 0 | FD680000 | F5680000 | F5600000 | half-width load |
| 3 / 1 | FD680000 | F5680000 | F5680000 | full / single-byte line |
| 3 / 2 | FD700000 | F5700000 | F5700000 | full / double-byte line |
| 4 / 0 | FD880000 | F5880000 | F5800000 | half-width load |
| 4 / 1 | FD880000 | F5880000 | F5880000 | full / single-byte line |

Every other type/format combination returns without reading or changing the command cursor. It still loads its stack arguments and preserves saved registers. Do not import type2 paths from the extended emitter. Negative selectors also fall through without emission; signed dispatch comparisons must not broaden accepted cases.

Every supported path emits seven command pairs and advances the cursor by0x38. The sequence is image FD, load tile F5, E600/0, F400 load coordinates, E700/0, render tile F5, F200 tile coordinates. No extra return-status value is established. Register v0 is scratch at the return; do not invent a success boolean.

## Basic emitter: exact packing

Let d=x1-x0. Define line values with the observed arithmetic shifts:

- Format2/3: line=((2*d+9) arithmetic-right-shift3)&0x1FF.
- Format1: line=((d+8) arithmetic-right-shift3)&0x1FF.
- Format0: line=((((d+1) arithmetic-right-shift1)+7) arithmetic-right-shift3)&0x1FF.

The format3 path also uses the double-byte line formula. Do not substitute a presumed four-byte formula from an external graphics macro. Arithmetic right shifts are not signed division truncating toward zero for negative inputs. Preserve operation order and32-bit machine behavior; do not introduce signed-overflow or negative-left-shift assumptions in future C.

Define packedFlags=((cmt&3)<<18)|((maskt&15)<<14)|((shiftt&15)<<10)|((cms&3)<<8)|((masks&15)<<4)|(shifts&15). Both F5 first words include line<<9. Their low texture-memory address field is zero. The load F5 second word is07000000|packedFlags. The render F5 second word is((palette&15)<<20)|packedFlags. Render tile index is fixed0.

For full-width paths, the FD first word includes (width-1)&0xFFF. Load x coordinates are (x0<<2)&0xFFF and (x1<<2)&0xFFF. For format0, FD width is ((width arithmetic-right-shift1)-1)&0xFFF, and load x uses shift1. The two endpoints are already inclusive; do not subtract1 again.

All y coordinates use shift2 then mask0xFFF. X fields then shift12 for packing. F400 start contains its opcode and x0/y0. F400 end contains07000000 and x1/y1. Final F200 always uses full x shift2, including format0; its end uses tile0. There is no clamp, dimension validation or pointer-range check.

Shared tails are instruction-flow facts, not separate owners. Type3/format0 jumps to the format0 render tail at ROM001FD368, retaining F560 instead of F580. Type3/format1 jumps to the full-width tail at ROM001FD468, retaining F568 instead of F588. Several other paths join at ROM001FD554 to store the final word. Keep all accepted bytes and public extent unchanged.

## Extended emitter: argument changes

The extended emitter still performs no helper calls or payload dereferences. Its argument list adds explicit texture-memory and render-tile selectors before the type/format inputs.

| Argument | Neutral role | Machine source after frame allocation |
|---:|---|---|
| 1 | image pointer | incoming a0 |
| 2 | texture-memory field | incoming a1; masked0x1FF |
| 3 | render-tile selector | incoming a2; masked7 |
| 4 | type selector | incoming a3 |
| 5 | format selector | stack20 |
| 6 | image width | stack24 |
| 7 | unused slot; callers supply height | stack28 is not read |
| 8,9 | inclusive x0,y0 | stack2C,30 |
| 10,11 | inclusive x1,y1 | stack34,38 |
| 12 | palette field | stack3C |
| 13,14 | cms,cmt | stack40,44 |
| 15,16 | masks,maskt | stack48,4C |
| 17,18 | shifts,shiftt | stack50,54 |

It supports all seven pairs in the basic table with the same image/load/render prefixes. It additionally supports type2/format0 using FD480000/F5480000/F5400000, and type2/format1 using FD480000/F5480000/F5480000. Type1 and other formats emit nothing. There is no unconditional fallthrough that emits a generic format.

The line and coordinate formulas are identical at their defined classes. Both F5 first words additionally OR argument2&0x1FF into the low texture-memory field. The load tile remains fixed7. The render F5 second word additionally ORs (argument3&7)<<24. The final F200 end word carries the same render-tile bits. F200 start has no tile bits. Palette and flag packing otherwise match the basic emitter.

All nine supported paths emit exactly seven command pairs, advancing the cursor0x38. Unsupported paths leave it unchanged. Height's unused argument slot must remain in the ABI; removing it shifts every later argument. Do not interpret its absence as a smaller-arity interface.

The extended emitter factors more stores into shared tails. Nonzero formats converge at ROM001FDD94. Format0 paths converge at ROM001FDC90 with their different render prefix retained. In these tails, the image-pointer store can occur after most later command-word stores. A rewritten append routine that changes this order may change matching output even when the final display list is equivalent.

## Reconstruction guidance and competing hypotheses

Both functions can be understood as selector dispatch followed by command packing, with early no-op exits for unsupported pairs. This is Supported uncompiled organization, not a tested C spelling. Keep selector widths, masks, inclusive endpoints, signed shifts and parameter slots explicit. A local command-word pair view is more appropriate than an image-header or pose-record struct.

Do not merge these accepted owners or introduce a shared out-of-line helper merely because their formulas overlap. The originals are separate leaf owners with distinct save sets: basic saves s0..s2, extended saves s0..s3. They have no calls, no floating-point operations and no image-data loads. A future linked comparison must cover each complete accepted section.

An initial identical-helper hypothesis is falsified by explicit texture-memory/tile arguments and the extended type2 paths. A uniform-width hypothesis is falsified by format0 load shifts and full-width final F200 coordinates. A generic graphics-macro hypothesis can incorrectly replace the format3 line formula. The actual words, branch map and prefix tables discriminate these alternatives without compilation.

The prior caller notes use the basic emitter with payload,type,format,width and strip bounds. They use the extended emitter with additional texture-memory/tile parameters. Those bounded call shapes support argument interpretation. They do not establish resource residency, game semantics or valid ranges for every caller. No group2 renderer interface is called by either owner; earlier conditional placement evidence remains scoped to its original subjects.

Machine bytes and local dataflow are Verified static observations. There is no independent semantic or structural acceptance and no matching result. No particular compiler spelling, pure-C blocker or placement defect was established. Future W8 implementation still owns source class, sole ownership, relocations, placement, target bytes and complete-ROM proof.

## Reproduction and artifacts

Run the offline checker once per owner:

- python -B build/combat-draw-final-pair-preparation-r1/check.py func_001FCB28
- python -B build/combat-draw-final-pair-preparation-r1/check.py func_001FD56C

The checker authenticates the package, V64 and in-memory normalized z64. It checks each original against its package hash, accepted W7 blob and every ROM word. Separate evidence files retain complete target records, words, corrected edges and baseline configuration/type hashes. It performs no compiler, emulator or production operation.

| Artifact | SHA256 |
|---|---|
| W8 literal package | 4340C97DE145E1970D62F909B443894ACECFF3742F544D9BB41CCE0A9263025D |
| Basic original | DF406460F26C06817519F5C2EB572298C6D8BE1154DC3EDD45DC3FD1CEE6C7B7 |
| Extended original | B147A2F4D7252ADFD7E50AD6EE90421951D7DA2DF199FA1F2262E3C7DC410778 |
| check.py | A48988447496D55E61F7F08B964591CC232D2E3C137306A499F6B176C3243C1A |
| func_001FCB28.json | 6833EEBDC572CC4BF86F1D4FDAC0544B0BE12D3414B8B441BC76220AB0AB68BF |
| func_001FD56C.json | B1156EBC544F8E5AACE31368582DE8920D0D7B26D0C8FEBD7A232F144DEFEADE |
| Source V64 | 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 |
| In-memory normalized z64 | 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |

No method failed and no compiler/runtime experiment was attempted. Only the fresh claim, this report and ignored evidence root were written. All mutable production surfaces and frozen notes remain untouched. No candidate C, source-spelling experiment, compiler/link/build/verifier/source-policy command, runtime, GUI, bridge/database operation, agent or Git mutation occurred.

All fourteen W8 members, accepted prerequisites, retained shared obligations and the complete thirteen-member supplement remain intact. This assistance adds no independent matching review or final-ROM gate. The Director receives the note; the W8 source worker retains sole production source/build ownership. All commands have finished. All assigned writes are released to /root at terminal handoff.
