# Combat draw entry preparation r1

Complete bounded preparation for the entire 6,740-byte func_001F3C00 owner. All 1,685 original words equal authenticated normalized Rev 0 ROM. This is uncompiled reconstruction guidance, not matching, structural or semantic acceptance. W8 remains queued behind the complete W7 prerequisite gate.

## Identity and method

Launch COMBAT-DRAW-ENTRY-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988, local. Fresh atomic claim records starting HEAD 98426451efab645aef238712cc9a3719573607e6. Only this report, that claim and ignored build/combat-draw-entry-preparation-r1/ are owned.

Used draw-inputs r1 (4cac111), its r2 citation correction (341055c), unchanged package SHA256 4340C97DE145E1970D62F909B443894ACECFF3742F544D9BB41CCE0A9263025D, and accepted production baseline 0e1191013aeebed2929c9caff7c1f139169ad7f3. The corrected extraction baseline is d70fd853fdffacf71290b24763e010a549276a55. Source/types/configuration came from baseline Git blobs. Reused the frozen func_001F7ADC note at 4c2040179f6107da52bffa5f26a66a82ef9b5bc2 only for shared helper guidance and the offline authentication method; its outputs remain unchanged.

| Identity | Exact scope |
|---|---|
| Original | asm/original/rev0/lib/func_001F3C00.s; SHA256 C31BB4824DF0178D65383897F956F802C0C7CAD14245FD0A74BAB99F5C42C85B |
| Accepted owner row | 3698; ROM 001F3C00..001F5654 exclusive |
| Descriptor-10 placement | RAM 801B0770..801B21C4 exclusive; RAM minus ROM = 7FFBCB70 |
| Machine observations | 57 direct JAL sites; 101 internal direct jumps/branches; frame 0x1F8; slice-final return at 001F564C plus delay slot |

The old second-address decode column uses 80263800 at entry. Branch comments consequently name a different address space; decode branch immediates relative to the actual instruction and translate J targets using accepted placement. The generated evidence records corrected ROM destinations. The header's mention of JALR is not an instruction census: actual target words contain no JALR and only the final JR RA. Do not split this owner at an internal J or treat GBI constants as code addresses.

## Inputs and setup, ROM 001F3C00..001F4584

Use neutral names P for a0, Q for the word at P+0x40, setupFlag for a1, modeArg for a2, optionalImage for a3. Incoming stack arguments 5 and 6 are integer x/y offsets, loaded at new-frame +0x208/+0x20C. Captured state includes signed halfword P+0x4E, Q words +0x48/+0x4C and the low 16 bits returned by func_0020C448(Q). P+0x44 is an address within P, not a loaded pointer. Item bytes are P+0x56+index.

Initial factor is unsigned byte Q+0xAB times signed halfword P+0x34, divided by signed 255 with truncation toward zero. The saved result remains an int. Zero returns zero before any setup or cleanup commands. Do not copy the extra halfword narrowing from the separate 001F7ADC owner.

Display-list cursor is RAM 800E9BA0; matrix cursor 801969B0; vertex cursor 80197178. Setup emits E700 twice, E3000A01/00100000, then E700. RAM 80092A90 builds the local matrix: setupFlag selects float values from 801CE8EC/E8F0/E8F4 or zeros. Translation uses signed-halfword sums P+(1C,22,50), P+(1E,24,52), P+(20,26,54). RAM 800988A0 converts the matrix; DA380000 references the matrix cursor, which advances by 0x40. DE000000 references 801CE930.

If P.byte37 is nonzero, the RAM 8020B1E0 call receives amount P.byte36, a halfword input array populated from bytes37..3D, and output at stack B0. The input array has an unwritten halfword at stack C0; do not invent initialization or collapse its layout. Three signed-halfword outputs B0/B2/B4 become persistent integer components. Otherwise use signed halfwords RAM 80220E70/72/74.

The accepted discovery/review bounds RAM 8020B1E0 to func_0025FD90 under logical Combat group 2: descriptor 12 is present, descriptor 9 is excluded. The accepted atlas has 226 shared saved-input IDs with this caller; saved placement is not execution. Descriptor 9 would map the address into func_00159FD4, not its entry. Preserve this alternate placement and keep the group-2 numeric interface conditional; no universal runtime identity is inferred.

Q.word48 == 0x100 selects bit 0x40 of RAM byte801D082C; otherwise bit0x20. When enabled, persistent components and factor multiply by bytes801D0828..82B and divide by255. E200001C/0C184240 follows. Three float locals D0/D4/D8 start at zero.

An optional image supplies byte2 type, byte3 format, unsigned halfword width4/height6 and payload+8. Setup calls aligned-width helper 801BEA0C twice, numeric helper801BE8FC twice, then func_001FD56C (801BA0DC), retaining its large argument layout. A counter from [801CE8BC]+0x6080 supplies four signed remainders: -counter modulo four times width/height, and counter modulo those values. F200 coordinates retain 0xFFF masks and denominator-minus-positive-remainder endpoints. This is signed remainder, not an unsigned wrapping rewrite.

Persistent state-list pairs (A,B) depend on Q.wordA0 and arguments:

| Condition | A / B RAM |
|---|---|
| Q.wordA0 nonzero | 801CEA38 / 801CEA48; FB packs low bytes from P+2F/+31/+33/+35 |
| Q.wordA0 zero, modeArg zero, optionalImage null | 801CEA58 / 801CEA68 |
| Q.wordA0 zero, modeArg zero, optionalImage present | 801CEA78 / 801CEA78 |
| Q.wordA0 zero, modeArg nonzero | 801CEA88 / 801CEA98 |

The last case adds signed halfwords P+2E/+30/+32 into persistent components. Its float z is P.s16[1C]+P.s16[20]+190, clamped to 0..380. Table bytes at word[801D06F4] + word[801CEAB0]*6 interpolate each pair of bytes with (380-z)*(second-first)/380+first. Preserve single precision and the float-to-unsigned conversion sequences used for the FB packed value, including the 2^31 split. These numeric observations do not establish gameplay names.

## Item selection and component lifetimes, ROM 001F4588..001F4920

The item counter starts zero. A zero P.byte[56+index] skips directly to increment; it does not terminate traversal and does not call a decoder. There is no fixed count proved by this owner. Decoder failure terminates via final command cleanup.

Three decoder paths must remain distinct:

- Q.word48 == 0x100: save result of 801C2304; func_00205608(Q.word50,captured P+4E,index,&record). On success, func_00206888(Q.word50,&record,Q.word4C,&byteDC). If optionalImage is present, bracket the latter with 801C22E8(2) and 801C22D0(saved low byte).
- Otherwise, Q.word18 == P or Q.word1C == P: func_00205608(P.word18,captured,index,&record), then func_00206888(P.word18,&record,0,&byteDC).
- Otherwise: call func_0020C034(Q) then func_0020BFF8(Q), pass bit10 then bit8 to func_00205484(Q.word48,Q.word4C,bit10,bit8,captured,index,&record). On success call bit8 then bit10 again, then func_00206340(Q.word48,Q.word4C,&record,bit8,bit10,retainedLow16,&byteDC).

Image result zero enters the unconditional self-loop at ROM 001F4730 (RAM 801B12A0). It does not return or retry the lookup. This exact control-flow fact must not become a convenient null-check exit.

Per-item factor is saved factor times the item byte divided by255. When Q.wordA0 is zero, replace byteDC zero by1 and compute each signed-truncated float result from integer component*byteDC divided by floatLocal+byteDC. Crucially, ROM 001F4828..001F4884 stores component=0 only if result<0 and component=255 only if result>=256; an in-range result leaves the PREVIOUS component untouched. This is not clamp(result). Components persist across items. When Q.wordA0 is nonzero, image.byte2==4, modeArg==0 and 801C2304() bit0 is set, overwrite them with 255/200/130. FA000000 packs these components and per-item factor.

Use the accepted CombatPoseRecord prefix for the decoded record at stack48: int fields04/08/0C/14 and float18/1C are consumed. Do not cast P/Q or image headers to that record. Refer to the baseline header and decoder prototypes; the scratch byteDC and numeric interpolation arrays are separate storage.

## Image and geometry setup, ROM 001F4924..001F4C30

Byte-stride helper func_00201E38 (801BE9A8) differs from aligned-width func_00201E9C (801BEA0C). The paired-header test is lhu(image+2)==2, i.e. the combined type/format pair 0x0002, not merely image.byte3==2. Paired header S=image+8+stride*height; capacity=4096/(primaryStride+secondaryStride), selecting state B. Otherwise optionalImage gives capacity=2048/primaryStride and B; the call to payload-size helper801BE978 remains even though its result is discarded. Without either, capacity=4096/primaryStride and A. Selected state pointer persists at stack164, avoiding repeated DE commands only when unchanged.

xLeft=record.field04+arg5; xRight=record.field04+field0C+arg5; yTop=arg6-field08. P.byte15 bit0 geometrically swaps/negates x endpoints. Effective flags are P.byte15 XOR (record.field14 &3); bit0 selects texture u orientation, bit1 selects vertical traversal. Keep these two uses separate.

RAM 8016DE1C receives Q.bytes4B/4F. Low-byte result2 multiplies both scales by double 1.1, then converts back to float. ROM00213290 is 3FF199999999999A at accepted RAM801CFE00. RAM80098AA0 receives the scales and1.0f; another DA command advances matrix cursor0x40. Initial strip height=min(image height,capacity), source row zero or height-stripHeight depending on vertical flip. Geometry accumulation starts zero. Endpoint arguments narrow to signed halfwords; the right geometry endpoint subtracts one.

## Strip commands and termination, ROM 001F4C30..001F5650

Each strip creates four independent 16-byte vertices (six static func_002103EC call sites because two top-vertex paths branch). Top y=yTop-accumulated; bottom y=top+1-stripHeight. Texture v endpoints are sourceRow and sourceRow+stripHeight-1, swapped for vertical flip. Vertex cursor advances0x40 and 01004008 references the old cursor. This is not the two-loop shared-vertex construction from 001F7ADC.

| Texture path | Exact distinguishing shape |
|---|---|
| No paired header and no optionalImage | Two aligned-width calls, then func_001FCB28 (801B9698) with payload+8, type, format, aligned width, strip height, source-row bounds and zero trailing parameters |
| optionalImage present | Primary payload+8, FD180000/F5180000; doubled aligned width in line arithmetic; tile1 words include01000000; joins triangle tail directly |
| Paired header without optionalImage, companion format0 | Companion payload+8, FD880000, halved aligned width for image/line fields; F5880000 load versus F5800000 final tile |
| Paired header without optionalImage, companion format nonzero | Companion payload+8, FD880000/F5880000 with unhalved aligned width |

Both companion branches join the tail at001F52D8, finish companion F200, then emit the primary FD100000/F5100000 path at001F5320..001F54C8. Companion tile-memory offset is signed truncation of (capacity*primaryStride)/8, masked to0x1FF; this is precomputed full capacity, not final short-strip height. All paths retain 0xFFF coordinate masks, 0x1FF line masks, quarter-coordinate shifts and minus-one endpoints. Exact per-site words and helper ordering are in evidence.json; repeated helper calls and command cursor stores must not be silently cached or reordered.

Shared triangle pair is 06000602/00000406. Then accumulated geometry rows += stripHeight-1; sourceRow += stripHeight-1 normally, or sourceRow=max(0,sourceRow+1-stripHeight) flipped. Remaining height becomes remaining+1-stripHeight. Exit if remaining<2; otherwise reduce stripHeight to remaining if needed and repeat. The one-row overlap is deliberate machine behavior. No new validation for zero stride, capacity <=1, malformed dimensions or exhausted cursors is justified here; do not assert arbitrary-input safety.

Rendered items emit D8380002/0x40 before index increment. Zero-byte skipped items omit this per-item cleanup. Decoder failure emits final D8380002/0x40, E700 twice, E3000A01/0, E700 and returns zero. Initial zero-factor exit bypasses this cleanup. The null-image self-loop is a third distinct outcome.

## Evidence limits and release

Offline checker: python -B build/combat-draw-entry-preparation-r1/check.py. Seven bounded original files match baseline blobs and their ROM words; baseline source/type/config identities are recorded. Complete owner bytes, all calls, corrected direct edges and the double constant are in evidence.json. No compiler spelling or pure-C obstacle was tested. No placement/boundary defect was established.

| Artifact | SHA256 |
|---|---|
| check.py | B3C4B0AA9651B939688DE2A9FAC90CB34DEE0DCDE6C695BEBD58119E49F51EE6 |
| evidence.json | D8DB135176CDA6F917ABBBF7E3185DAD8D66A18F65B5DCD9DBE6829507E96041 |
| Source V64 | 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 |
| In-memory normalized z64 | 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |

Machine bytes/local dataflow are static observations; proposed reconstruction organization is supported uncompiled guidance. The future source worker independently implements and establishes all existing complete-wave gates. All fourteen original W8 members, retained shared obligations, W7 prerequisites and later thirteen-target supplemental wave remain intact. No independent review gate is added.

No candidate C, production source/configuration/tool change, compiler, linking, build, verifier, source-policy generator, runtime, GUI, bridge, database, capture, agent or Git mutation occurred. One broad read was truncated and one wildcard rg path was rejected; focused reads replaced them. All commands have finished. Only the assigned claim/report/ignored output were written; frozen records and disjoint work were preserved. All assigned writes are released to /root at terminal handoff.
