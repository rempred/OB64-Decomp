# Combat draw alternate preparation r1

Completed: the complete 4,148-byte func_001F6098 owner is authenticated and reconstructed as bounded, uncompiled guidance. Its format gate, two-image coordinate arithmetic and persistent component updates differ from the earlier owners. The future W8 source worker must implement independently and establish the existing complete-wave gates.

## Scope and evidence identity

Launch COMBAT-DRAW-ALTERNATE-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; host local. The create-only claim records observed HEAD 6bf716ac849afd9dcc997f516867e6ffeec25c92 and ready commit b4646366b0607a2e7cfd26557c231caa7b929818. Disjoint W7 source/configuration changes were present and remain untouched.

Inputs are draw-inputs r1 at 4cac111, correction r2 at 341055c, and their unchanged package. Its corrected extraction baseline is d70fd853fdffacf71290b24763e010a549276a55. Production source, types and configuration identities use Git blobs at 0e1191013aeebed2929c9caff7c1f139169ad7f3. Mutable W7 source and compiler artifacts were excluded.

The prior entry note at a8c784cc45c2793c2f762e7c290d97a516a13118 supplies shared interpolation, vertex and command-cursor guidance. Its SHA256 is 9BD2C4A8D50934B4984D2F1EFDBD1EAB26CEA71FC089DE5E2EB3D3D832067BD5. The separate 001F7ADC note remains frozen uncompiled guidance. Neither prior owner was reanalyzed or changed.

| Neutral name | Supported meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| Alternate draw owner | Complete assigned function | 001F6098..001F70CC | z64 ROM, exclusive end | 1,037 authenticated words |
| Placed entry | Descriptor-10 entry | 801B2C08..801B3C3C | RAM, exclusive end | RAM minus ROM = 7FFBCB70 |
| Command cursor | Next command pair | 800E9BA0 | RAM word | Repeated loads/stores |
| Matrix cursor | Next 64-byte matrix | 801969B0 | RAM word | Two matrix levels |
| Vertex cursor | Next vertex storage | 80197178 | RAM word | Four vertices per strip |
| Color table root | Pointer to six-byte rows | 801D06F4 | RAM word | Indexed by word at RAM801CEAB0 |
| Scale constant | Double 1.1 | 801CFE10 / 002132A0 | RAM / z64 ROM | 3FF199999999999A |

The complete owner contains 25 JAL sites, 45 internal direct branches/jumps, no JALR, and one final JR RA. Its frame is 0x1C8. Return instruction ROM001F70C4 and delay slot001F70C8 are inside the accepted owner. The old decoded-address column and branch comments use another placement. evidence.json derives actual branch targets from words and translates absolute J targets through the accepted delta.

## Entry arguments and setup

Let P be a0 and Q be the pointer read from P+0x40. Let S be a1, the secondary image header. Let mode be a2 and amount be a3. This owner does not use incoming stack arguments. S is later dereferenced without a null check. Mode controls one command choice and is not the entry owner's optional image argument.

Captured state includes Q.word48/Q.word4C, signed halfword P+0x4E and the low16 bits of func_0020C448(Q). P+0x44 is an interior address, not a loaded pointer. Item bytes are P+0x56+index. Initial factor is unsigned Q.byteAB times signed P.half34 divided by signed255. The result remains an int. Zero returns zero before setup or cleanup.

The initial commands are E700 twice, E3000A01/00100000, then E700. RAM80092A90 always receives float-bit globals RAM801CE8EC/E8F0/E8F4. There is no setupFlag-controlled zero-angle alternative here. Translation sums signed halfwords P+(1C,22,50), P+(1E,24,52), P+(20,26,54), then converts to float. RAM800988A0 converts the local matrix. DA380000 references the matrix cursor; the cursor advances0x40. DE000000 references RAM801CE980.

Mode zero selects FC629403/1F0CFFFD. Mode nonzero selects FC62E203/1F0CAFFD. Do not replace these exact pairs with the entry owner's state-list selection tree.

If P.byte37 is nonzero, RAM8020B1E0 receives amount P.byte36 and signed-halfword input/output storage. Bytes37..3D populate halfwords at stack90/92/94/96/9A/9C/9E; stack98 is unwritten. Outputs stack88/8A/8C become persistent integer components. Otherwise components come from signed halfwords RAM80220E70/72/74.

The prior accepted group-2 evidence supports func_0025FD90 as the numeric interface at RAM8020B1E0 under that placement. Group2 contains descriptor12 and excludes descriptor9. Saved-placement counts for the earlier caller are not new execution evidence for this owner. Keep this interface conditional; do not infer universal residency or merge the alternate descriptor9 interior owner.

Next, func_00205230 at RAM801C1DA0 receives P.word18 and captured P.half4E. The helper's original code traverses decoded records and returns a nonnegative vertical extent. This owner multiplies its result by amount's LOW BYTE and divides by256 with signed truncation toward zero. Save this integer as secondaryYOffset. This division is /256, unlike the separate /255 component/factor calculations.

Signed halfwords P+2E/+30/+32 are added into persistent components. Float z is P.half1C+P.half20+190, clamped to0..380. Three table values use (380-z)*(row[3+i]-row[i])/380+row[i], all single precision. The row is word[RAM801D06F4]+word[RAM801CEAB0]*6. The FB000000 packed value uses float-to-unsigned conversion sequences with the2^31 split and low-byte masks; its low byte is1.

## Item selection and lifetime distinctions

The decoded record begins at stack20. Reuse the accepted CombatPoseRecord prefix, with separate indexed/scratch storage where required by the decoder. P, Q, S and image headers are not pose-record pointers.

The item loop starts at ROM001F6604 with index0. Call func_0020C034(Q), then func_0020BFF8(Q). Pass bit10 then bit8 to func_00205484(Q.word48,Q.word4C,bit10,bit8,captured,index,&record). Decoder failure exits through final cleanup. Only AFTER successful decoding does this owner read P.byte[56+index] and skip a zero item. The entry owner skipped before decoding. There is no decoded field14 bit2 skip test here.

For a nonzero item, call RAM801C22E8 with2. Call bit8 then bit10 helpers again. Call func_00206BE0 at RAM801C3750 with Q.word48,Q.word4C,&record,bit8,bit10,retainedLow16,&byteB4. Save its returned primary header H. Then call RAM801C22D0 with the constant2. Do not substitute a saved prior mode: this owner does not capture one.

Per-item factor is savedFactor*itemByte/255. Replace byteB4 zero by1. For each component, compute signed-truncated float(component*byteB4)/(blendFloat+byteB4). The multiplication occurs as integer arithmetic before conversion. ROM001F6790..001F67E8 updates the persistent component only for out-of-range results: below0 stores0; at least256 stores255. An in-range result leaves the PRIOR component unchanged. Components therefore carry state across items; this is not clamp(computedResult). FA000000 packs the resulting persistent components and per-item factor.

H is dereferenced without a null check. Call byte-stride helper func_00201E38(H.byte3,H.u16[4]); capacity=2048/stride with signed division. If H.byte3 is not3, ROM001F688C jumps to itself, with a nop delay slot. The accepted words and placement establish this self-loop. No generic format fallback, return or secondary-header selection is present. After the format3 gate, call byte-stride helper on S; that result is discarded. Preserve the call despite its unused result.

## Geometry and shared-row strips

Geometry uses record.field04 as left x, field04+field0C as right x and -field08 as top y. Texture u endpoints are 0 and field0C-1, selected by record.field14 bit0. They use decoded width, not H.width. The right geometry endpoint also subtracts1. P.byte15 does not alter these flags or geometry here.

RAM8016DE1C receives Q.bytes4B/4F. Low-byte result2 multiplies both decoded scales by double1.1 before float conversion. RAM80098AA0 receives those scales and1.0f. A DA command consumes another matrix and advances its cursor0x40.

Let remaining=H.height, strip=min(remaining,capacity), accumulated=0. Source row is0 normally or remaining-strip when record.field14 bit1 is set. Each strip creates four independent16-byte vertices through func_002103EC. Six static call sites cover alternative top-pair branches, but four calls occur on either path. Top y=-field08-accumulated; bottom y=top+1-strip. Texture v values are row and row+strip-1, reversed by bit1. Arguments narrow to signed halfwords. Vertex cursor advances0x40; command01004008 references the old cursor.

The shared triangle pair is06000602/00000406. After drawing, accumulated+=strip-1. Normal row+=strip-1; flipped row=max(0,row+1-strip). Remaining becomes remaining+1-strip. Exit when remaining<2; otherwise shrink strip to remaining when necessary and repeat. This retains a one-row overlap. No capacity<=1 or zero-dimension guard establishes arbitrary-input safety.

## Two-image command arithmetic

The strip body has one fixed primary path and one fixed secondary path. It does not select the entry owner's paired-header formats. Both payload pointers remain header+8; rows are encoded into commands.

Primary H commands begin with FD180000 using alignedWidth(H)-1. Subsequent primary line arithmetic uses RAW H.width: ((2*H.width+7)>>3)&0x1FF. F5180000 load and render tile words use that line field. Primary load/tile coordinates use row, row+strip-1 and H.width-1 with quarter-coordinate shifts and0xFFF masks. Do not replace every raw width with the aligned-width helper result.

Secondary S image command uses FD880000 with (alignedWidth(S)>>1)-1. Its F5880180 load line and F5800180 render line instead use RAW PRIMARY H.width: (((H.width>>1)+7)>>3)&0x1FF. This cross-header arithmetic is directly encoded. The fixed tile-memory offset is0x180, not a computed capacity*stride offset.

Define secondaryX=record.field04+(S.width>>1), and secondaryY=record.field08+(S.height>>1)+secondaryYOffset+row. These expressions retain full integer geometry values, not their vertex halfword truncations.

| Command part | Coordinate encoding before masks |
|---|---|
| Secondary F400 start | x=secondaryX<<1; y=secondaryY<<2 |
| Secondary F400 end | x=(secondaryX+H.width-1)<<1; y=(secondaryY+strip-1)<<2 |
| Secondary F200 start | x=secondaryX<<2; y=secondaryY<<2 |
| Secondary F200 end | x=(secondaryX+H.width-1)<<2; y=(secondaryY+strip-1)<<2 |

The difference between x shifts1 and2 is real. Preserve0xFFF masks, x packing at bit12, load tile07000000, render tile01000000 and the final primary F200 pair. The final primary pair reuses primary row/width coordinates but includes01000000 in its end word. Commands and global cursor stores are interleaved, including stores into earlier allocated slots. Convenient append helpers or cached global/header reads can change compiler output.

## Exits, hypotheses and limits

Rendered items emit D8380002/0x40 before index increment. A successfully decoded zero-byte item increments without per-item cleanup. Decoder failure emits D8380002/0x40, E700 twice, E3000A01/0, then E700 and returns0. Initial zero-factor exit bypasses command cleanup. Non3 primary format enters the self-loop; a null primary result has no explicit guard.

A plausible initial hypothesis was that this owner shared the entry owner's optional-image and generalized format paths. The actual fixed S accesses and format3 self-loop falsify that hypothesis. Another tempting reconstruction is ordinary component clamping. The missing in-range component stores falsify it. A third is uniform aligned-width arithmetic; direct raw-width loads in the secondary line path falsify that simplification.

These are Verified static byte/dataflow observations, with no independent semantic verdict. The proposed neutral views and loop organization are Supported uncompiled guidance. No compiler workaround, source spelling, pure-C blocker or structural defect was established. Future implementation must preserve the complete owner and prove actual relocations, placement, source class, target bytes and complete ROM.

## Reproduction and release

Run only the offline checker: python -B build/combat-draw-alternate-preparation-r1/check.py. It checks nine bounded original files against baseline blobs and ROM words. It records baseline source/type/configuration identities, all1037 target words,25 calls,45 corrected internal edges and the double constant. No previous owner is repeated by this checker.

| Artifact | SHA256 |
|---|---|
| w8-inputs.json | 4340C97DE145E1970D62F909B443894ACECFF3742F544D9BB41CCE0A9263025D |
| Complete original owner | 63304127A1DECEDF5AD1253390FEEB1A68D54A4B237EFFA71CDD006143722924 |
| check.py | A4F7F985E60F892C61FE884FA2C39672D555D806DFE84026835A8FCFBCDBEA11 |
| evidence.json | B153D84704ACAC5521DE875A30067B5D57DB0058761751F0ABFF05F272E6C46B |
| Source V64 | 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 |
| In-memory normalized z64 | 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |

Several broad reads truncated; focused reads replaced them. No compiler or runtime experiment was attempted. Only the fresh claim, this report and ignored checker/evidence were written. No candidate C, production source/configuration/tool edit, compiler, linking, build, verifier, source-policy generation, runtime, GUI, bridge, database, capture, agent or Git mutation occurred.

All fourteen W8 members, complete W7 prerequisites, shared obligations and later thirteen-target supplemental wave remain unchanged. This note adds no independent matching-review gate. The Director receives the note; the later source worker owns implementation and full-wave acceptance. All commands have finished. All assigned writes are released to /root at terminal handoff.
