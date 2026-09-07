# Combat func_001F5654 preparation r1

Completed: all 2,628 bytes of the accepted owner match authenticated Rev 0 ROM. The note identifies its byte-narrowed factor, fixed texture setup and format3-only strip path. These distinctions prevent misleading reuse of the larger draw owners. The future W8 source worker must independently implement and establish all existing complete-wave gates.

## Identity and scope

Launch COMBAT-DRAW-001F5654-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root, native01a07262-aeca-7341-ad10-2dba705ff988; local. The fresh create-only claim records activation HEAD29dc15659cc5abac2784151ba6b1053e3738d022. Ready commit is7f8993bcec4cf87a032c2945ec98797864620b29.

Bound inputs are draw-inputs r1 at4cac111, correction r2 at341055c, and their unchanged w8-inputs.json. Its corrected extraction baseline is d70fd853fdffacf71290b24763e010a549276a55. Production source/types/configuration were read only from accepted W7 Git blobs at469a1416918592749d61dc34e3e079796f7b673c. The Resolver worker's disjoint changes were observed and preserved.

Reused the bounded func_001F6098 and func_001F3C00 notes at a3f4c5729b0c5a23a9e842a44aab2bd6a13de41a and a8c784cc45c2793c2f762e7c290d97a516a13118. Their guidance remains uncompiled. No previous owner was reanalyzed or modified. Unchanged required guides already read were reused.

| Neutral name | Supported meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| Assigned owner | Complete function | 001F5654..001F6098 | z64 ROM, exclusive end | 657 authenticated words |
| Placed owner | Descriptor10 placement | 801B21C4..801B2C08 | RAM, exclusive end | Delta7FFBCB70 |
| Command cursor | Next command storage | 800E9BA0 | RAM word | Store ordering |
| Matrix cursor | Next64-byte matrix | 801969B0 | RAM word | Two matrix levels |
| Vertex cursor | Next vertex storage | 80197178 | RAM word | Four vertices per strip |
| Resource-state pointer | Lookup state and counter base | 801CE8BC | RAM word | Resource lookup and offset6080 reads |
| Fixed resource key | Literal lookup argument | 00322172 | Integer key, meaning unestablished | Passed to func_001F0A9C |
| Scale constant | Double1.1 | 801CFE08 / 00213298 | RAM / z64 ROM | 3FF199999999999A |

The owner contains22 JAL sites,22 internal direct edges, no JALR and one JR RA. Frame size is0x128. Final return is ROM001F6090 with delay slot001F6094. The stale decode-address column is not accepted placement. evidence.json derives branches from immediates and translates absolute J destinations using the accepted delta.

## Entry state and byte narrowing

P is the only consumed incoming argument, a0. Q is the pointer read at P+0x40. Capture signed halfword P+0x4E, Q.word48/Q.word4C and low16 bits from func_0020C448(Q). P+0x44 is an interior address, not a loaded pointer. Later item bytes are P+0x56+index.

Initial factor computes unsigned Q.byteAB times signed P.half34 divided by signed255 with truncation toward zero. Unlike both larger notes, this owner stores the result as a BYTE at stackC7 and reloads it unsigned. The zero test uses this narrowed value. Preserve wrapping at this point; testing the full quotient would change behavior. Zero returns0 before setup or cleanup.

For nonzero factor, setup emits E700 twice, E3000A01/00100000, then E700. RAM80092A90 receives float-bit globals RAM801CE8EC/E8F0/E8F4 unconditionally. Signed-halfword translation sums are P+(1C,22,50), P+(1E,24,52), P+(20,26,54). Each sum converts to float in the local matrix at stack48. RAM800988A0 converts that matrix; DA380000 references the matrix cursor and advances it0x40. DE000000 references RAM801CE980. The item counter at stack8C starts0.

There is no color interpolation call at RAM8020B1E0, no optional image parameter, no mode-dependent command pair, and no persistent computed RGB components here. The earlier group2 interface qualification is therefore not a new callee identity for this owner.

## Fixed texture setup before traversal

ROM001F5880 calls func_001F0A9C at RAM801AD60C with key00322172. Its return plus8 becomes the pointer accompanying FD900000. The helper scans sixteen12-byte slots from the resource-state pointer. A matching key refreshes slot+4 to15 and returns slot+0. A free slot receives the key and result of RAM8009DD38. No free slot returns0. This caller does not test the result before adding8. No stronger resource identity or arbitrary-input safety is established.

The following command pairs are fixed:

| First word | Second word |
|---|---|
| F59001F0 | 07010040 |
| E6000000 | 00000000 |
| F3000000 | 0703F800 |
| E7000000 | 00000000 |
| F58003F0 | 01010040 |
| F2000000 | 0103C03C |

Another F200 pair uses two separate reads from resourceState+0x6080. Its first word is F2000000 OR (((-(counter1&15))<<2)&0xFFF). Its second word is01040000 OR (((-((counter2&15)+16))<<2)&0xFFF). Preserve both reads and the negative arithmetic before masking. These formulas describe machine arithmetic; future C must avoid unsupported signed-shift assumptions. The pointer is captured once for both reads. Do not replace these commands with the alternate owner's per-strip secondary-image coordinates.

## Decoder and image call sequence

The loop at ROM001F59A8 calls func_0020C034(Q), then func_0020BFF8(Q). func_00205484 receives Q.word48,Q.word4C,bit10,bit8,captured P.half4E,index,&decoded. The decoded record starts at stack20. Decoder failure exits through final command cleanup.

After successful decoding, read P.byte[56+index]. Zero skips to index increment without an image lookup or per-item cleanup. There is no field14 bit2 skip condition and no fixed item count in this owner.

For a nonzero item, call RAM801C22E8(2). Call the bit8 getter, then bit10 getter. Call accepted W7 func_00206BE0 at RAM801C3750 with Q.word48,Q.word4C,&decoded,bit8,bit10,retainedLow16,NULL. Its seventh argument is null, unlike the alternate owner's byte-output pointer. Save returned header H, then call RAM801C22D0(2). This is a constant2, not a captured previous mode.

The accepted W7 prototype takes CombatPoseIndexedRecord*. Use enough local storage for its index after the32-byte decoded prefix. The indexed header and neutral P/Q/image views must remain separate. Baseline include/game/combat_pose_record.h and combat_types.h supply existing types; do not redeclare incompatible shared structures.

H has unsigned format byte3 and unsigned halfword width4/height6. Call func_00201E38(format,width) for byte stride. Capacity is signed3840/stride (literal0xF00). The compiler's division checks are present. If format is not3, ROM001F5AB0 jumps to itself with a nop delay slot. It is not a generalized format branch or return. H has no explicit null guard before header loads.

Only after that gate, compute per-item factor from the NARROWED initial byte times itemByte divided by255. Emit FA000000 with second word80FFFF00 OR (result&255). The fixed RGB bytes are128,255,255. There is no component clamp or item-carried color calculation to import from the prior owners.

## Geometry and strip lifetimes

Decoded fields04/08/0C/14 are ints; fields18/1C are floats. Left x=field04, right x=field04+field0C, top y=-field08. Texture u endpoints are0 and field0C-1, selected by field14 bit0. The right geometry endpoint subtracts1. P.byte15 and extra incoming coordinate offsets do not modify this path.

RAM8016DE1C receives Q.bytes4B/4F. If its low byte is2, both float scales multiply by double1.1 and convert back. RAM80098AA0 receives the scales and1.0f. Another DA command consumes a matrix and advances the cursor0x40.

Let remaining=H.height, strip=min(remaining,capacity), accumulated=0. Source row starts0 normally or remaining-strip when decoded field14 bit1 is set. That vertical flag is captured once for the item's strip loop. Each strip creates four independent16-byte vertices through func_002103EC. Six static call sites cover the two orientation branches; four calls execute per strip.

Top y=-field08-accumulated; bottom y=top+1-strip. Texture v endpoints are row and row+strip-1, reversed for vertical flip. Vertex arguments narrow to signed halfwords. Command01004008 references the old vertex cursor, which advances0x40. This owner does not use the separate001F7ADC two-loop shared-vertex construction.

The strip emits FD180000 with alignedWidth(H)-1. Its payload pointer remains H+8. Subsequent line fields use RAW H.width: ((2*width+7)>>3)&0x1FF. Do not replace every width read with the aligned-width helper. func_00201E9C at RAM801BEA0C is called only once per strip; it differs from the byte-stride helper.

The primary sequence uses F5180000, E6000000, F4000000, E7000000, F5180000, F2000000 and triangle pair06000602/00000406. Load tile uses07000000; final tile second word is0. Quarter-coordinate fields use row, row+strip-1 and width-1, masked to0xFFF. Line fields mask to0x1FF. No per-strip secondary texture reload occurs.

After drawing, accumulated+=strip-1. Normal row+=strip-1; flipped row=max(0,row+1-strip). Remaining becomes remaining+1-strip. Exit when remaining<2; otherwise reduce strip to remaining if necessary and repeat. This one-row overlap must survive reconstruction. Initial zero-height and capacity<=1 inputs have no validating guard here.

Command-slot stores and global cursor updates interleave. Some earlier command slots are filled after helper calls. Preserve evaluation order and repeated header/global reads during initial reconstruction. The evidence retains exact words for later focused linked comparison.

## Exits and falsifiable distinctions

Rendered items emit D8380002/0x40 before index increment. Successfully decoded zero-byte items increment without that cleanup. Decoder failure emits D8380002/0x40, E700 twice, E3000A01/0, then E700 and returns0. Initial narrowed-zero factor bypasses all commands. Non3 format enters the self-loop.

A plausible reuse hypothesis was an integer factor retained like001F6098. The sb/lbu sequence at ROM001F56E8..001F56EC falsifies it. A generalized format fallback is falsified by the placed self-jump. A second per-strip texture load is falsified by this complete owner's fixed setup plus single-header strip sequence. These distinctions explain why a shorter copy of the larger owner is insufficient.

Actual bytes and local dataflow are Verified static observations. Suggested neutral views and loop organization are Supported uncompiled guidance. No compiler experiment, pure-C blocker, semantic acceptance or structural defect was established. Matching, relocation and full-ROM proof remain the future source worker's responsibility. This note adds no independent matching review or extra final-ROM gate.

## Evidence and release

Reproduce only offline analysis with python -B build/combat-draw-001f5654-preparation-r1/check.py. Nine bounded originals match accepted W7 blobs and ROM words. The artifact records657 target words,22 calls,22 corrected internal edges and the double constant. Source/types/configuration hashes bind accepted W7 references; mutable Resolver files and generated outputs were excluded.

| Artifact | SHA256 |
|---|---|
| w8-inputs.json | 4340C97DE145E1970D62F909B443894ACECFF3742F544D9BB41CCE0A9263025D |
| Complete original owner | 524E1CA0DCE51E802A8DD9FA36000A87B4BB3D7AE0FB6D09D7862052A672F7A9 |
| check.py | DD6D83CB49B9679C8337924B0D4425DEF0CEE9E62842F724A707BF9E1B5850D1 |
| evidence.json | 72B8E618FEAB594AA673864C25EF7CAF3EDED75822F221543B071A7710940B76 |
| Source V64 | 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 |
| In-memory normalized z64 | 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |

No failed compiler/runtime experiment occurred because neither was authorized or attempted. Only the fresh claim, this report and ignored checker/evidence were written. No candidate C, production edit, compiler, link/build/verifier/source-policy command, runtime, bridge/database access, agent or Git mutation occurred.

All fourteen W8 members, accepted prerequisites, shared obligations and the complete thirteen-member supplement remain intact. The Director receives this note and the later source worker owns implementation. All commands have finished. All assigned writes are released to /root at terminal handoff.
