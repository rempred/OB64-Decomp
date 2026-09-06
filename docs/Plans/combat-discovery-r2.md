# Combat discovery r2 — fixed image and selector disposition

Completed bounded research; all new semantic and membership conclusions are **review pending**. Proposed disposition: func_001F0C24 is a cached attack-name image producer for a shared screen drawing path, outside the selected body/pose family. Its former resource/final-draw discovery question has sufficient static evidence for review. func_00201778 remains a family-table accessor with unresolved consumer provenance. Neither the new table decode nor a stronger local control-flow check establishes its callers, reachable arguments, or dead-code status. Combat completion remains gated by that unresolved question and all retained matching obligations.

Assignment: combat-discovery r2, COMBAT-DISCOVERY-20260906-02. Activation baseline: canonical main 5bdac865c53718f7c5352e41619b0e00555f0333. Prior accepted r1 research at 150c9fc and Material review at a862298 remain unchanged. Frozen Sol High retrieval at 953928e2bf6978bb64484c0d7fcd29aa94689066 supplies bounded parsing facts, not these interpretations. No production edits, builds, compilation, live observations, staging, or commits were performed.

## Evidence identity and reproducibility

All instruction citations below are **normalized z64 ROM offsets**, not the misleading generic RAM comments in original split ASM. Descriptor 10 maps ROM 001F0A30 to RAM 801AD5A0, with text ending at ROM 00211D20. Each named original ASM file is under asm/original/rev0/lib/; the relevant words in thirteen files were compared with the normalized ROM. Source hashes are in the generated image-evidence.json. These stable addresses avoid the parent-document line drift noted by r1 CR-1.

| Input | SHA-256 / identity |
|---|---|
| Raw verified V64 | 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 |
| Normalized Rev 0 z64, 41,943,040 bytes | 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |
| Frozen retrieval.json | 2023DBAEEC012D857A27326BAB51380FC560B27D742AEB03B7C7CCC54A2C62BA |
| Existing project resource parser, ../tools/ob64_sprite_bundle_extract.py | 1AF68DCA8E5B347765F16BE6ADA1F27BDEC1E3669A3EBA6D74DD4808E89FDD20 |
| Decoded resource 00391270 | EFCE5F711D2B772C0B89E9501DE5EB0917FF36A5B09E48AC9425679283D3F870 |
| Raw resource 00315736 payload | 94248DB2C97D0B6E4169200ED13C7F19FAC0E35DD4D85189DD292736D612C7E6 |

Ignored output root: build/combat-discovery-r2/. Run python -B build/combat-discovery-r2/selector_check.py to run both bounded checkers. image_check.py authenticates ROM/parser/retrieval, decodes the exact fixed-image resource, verifies source words, models all strips, and makes the two inspection images. selector_check.py additionally checks the raw selector section, mapper bytes, and every encoded direct edge in descriptor-10 text. Output: image-evidence.json, selector-evidence.json, strips-index-grayscale.png, occurrence-hypothesis-rgba32.png. Artifact hashes are frozen in artifact-manifest.json. These are research checkers, not production verifier additions.

## Fixed-image resource and transformation

Resource key 00391270 identifies the size word at z64 009254F0, using the accepted resource base 00594280. The 15,951-byte stream begins at 009254F4. Strict project boot-LZ decoding consumes the complete stream and reproduces the frozen 36,376-byte output. Its first eight bytes are 36 34 02 04 00 5A 05 EB: magic 3634, type byte 2, format byte 4, width 90, height 1,515.

The meaning of format 4 here comes from the actual consumer, not a guessed generic image format. func_001F0C24 fetches the key at 001F0CB0..001F0CB8 and constructs a header with type 2, format 0, width 90, height 15 at 001F0CD0..001F0D08. func_00201E38 calculates format-4 row stride as ceil(width/32)*8 and format-0 row stride as ceil(width/16)*8: 24 and 48 bytes respectively. func_00201E08 multiplies stride by height. The destination allocation is therefore 728 bytes including its eight-byte header.

At 001F0D10..001F0DA8 the caller-supplied index selects fifteen consecutive source rows. Each iteration consumes one source byte and emits two bytes whose four nibbles are the source's four two-bit values, ordered most significant first. Explicitly, the output bytes are ((b >> 2) & 0x30) | ((b >> 4) & 3), then ((b << 2) & 0x30) | (b & 3). The x counter advances by four until it reaches/exceeds 90: 23 bytes read and 46 bytes written per row. Only the first 90 pixels belong to the visible width. The remaining two destination row bytes are not written by this loop; the checker keeps sentinels there rather than fabricating zeros. No allocator initialization guarantee is asserted.

The sheet contains 1,515/15 = **101 strips**. Source image storage consumes 36,360 bytes after the header. The decoded object also has eight trailing bytes, f95010008c62ef7a, whose role is unassigned. This arithmetic does not assert a caller domain or make the whole decoded object pixel data.

Independent direct extraction of source two-bit indices agrees with the modeled destination nibble indices for every visible pixel in all 101 strips. Visual inspection of the index-grayscale contact sheet shows readable attack names: index 0 Thrust, 3 Slash, 16 Sonic Boom, 28 Magic Missile, 49 Fireball, 61 Healing, 99 Fatal Dance, and 100 Supportive Attack, with the intervening labels likewise visible. The grayscale visualization maps indices 0..3 to levels 0,85,170,255; it does not claim the retail palette or a captured frame. This identifies the content as attack-name labels rather than character pose images.

## Input mapping, cache and final draw

func_00201B18 is the immediate mapper at both known direct callsites. At 00201B18..00201B34 it returns byte RAM[801CEE14+a0] for unsigned a0 < 160, and returns 100 otherwise. Descriptor-10 ROM bytes [002122A4,00212344) contain the complete 160-byte table; SHA-256 82573F8DCC2E4C48106A9678BF709B4F6089A7BB27BF9C7FC04CA596076A29E1. Every byte is in 0..100. Thus these two mapper-to-image paths select existing strips for any mapper input, conditional on the accepted initialized retail table placement. This does not establish every possible indirect caller's index or general helper bounds safety.

| Caller path | Exact dataflow and final consumer |
|---|---|
| func_001F265C | Supplies s8 to the mapper at 001F2B6C; 001F2B74 passes its result to func_001F0C24. At 001F2B88, returned image v0 becomes a0 for RAM 801B5CAC / func_001F913C, with the caller's screen coordinates. |
| func_00227E64 | s1 is incoming record+0x24 at 00227E90. 00227FBC loads that record word into a0; no intervening assignment changes it before mapper call 00228028. 00228030 passes the mapped result to func_001F0C24. 00228040 sends its result to func_001F913C with x = incoming a1-60 and y = incoming a2. The numeric action record field remains unnamed here. |

func_001F0C24 publishes returned image, requested index, and countdown 15 at cache-root RAM 801CE8BC plus per-slot offsets C0/C4/C8 (001F0DAC..001F0DCC). The 12-byte stride and C0 scan limit describe sixteen cache records, separate from the twenty-record body pools accepted in r1. Cache capacity is not evidence of runtime occupancy or proof that every caller handles allocation/slot exhaustion.

The final draw wrapper is now resolved: func_001F913C at 001F9144..001F9160 reads image width/height, sets source origin to zero, and forwards the caller's screen coordinates to func_001F8DDC (RAM 801B594C). The latter preserves the image pointer in s2 (001F8DEC), reads type/format, and passes image+8 plus dimensions/stride to RAM 801BA0DC at 001F8F38..001F8FA0. It then emits the E4 texture-rectangle command and E1/F1 continuation words, with screen coordinates and texture increments, through display-list root RAM 800E9BA0 at 001F8FA4..001F90E8. This is a complete static image-to-screen-rectangle path; it does not require identifying every screen or asserting that a particular battle was observed.

**Proposed scope disposition:** exclude func_001F0C24 from the selected body/pose family as a shared attack-label image/cache service, preserving its integration interface and eventual matching obligations wherever routed. Its cache and graphics use do not make it a body-program/pose-table owner. The combination of readable resource content, exact extraction, both mapper-to-image chains, and final rectangle consumer resolves the specific r1 image gate at static scope. An unexpected alternate consumer that uses the returned label buffer as family state would require reassessment; no such chain is established. Do not rename production functions or edit the accepted inventory before independent review.

## Retrieved numeric occurrence is not a resource-reference proof

Frozen retrieval found one unique decoded object containing bytes 00 39 12 70 at offset 05E8, duplicated between census scan-z64021EDA86 and ../ob64_7mb_blocks/block_2242_0x1c91c4_table.bin. The object is 4,096 bytes, SHA-256 E209E6F762BD942A0FA7B99339426055DB162F6130CDA453DAEAAF18D642E495. Its inventory category SPRITE_CI8 and filename suffix are retrieval labels, not a typed consumer contract.

The aligned neighborhood includes 004D25A9 00411D87 00391270 0038033D 13290008 0F170000. Interpreting the complete object, experimentally, as 32x32 RGBA32 yields a coherent soft green/cyan effect-like image. That supports incidental pixel/channel bytes as a competing interpretation, but **does not prove RGBA32** or override the inventory category. Alignment, smooth neighboring values, and a recognizable hypothetical rendering are not a loader reference chain.

Supported disposition: do not count this occurrence as another reference or consumer of resource 00391270. A typed claim would need an actual consumer selecting this offset as a key and forwarding the value to the resource loader, or a verified format schema identifying that field. Neither exists in the retrieved evidence. The fixed-image conclusion relies on the real immediate-key loader call and exact output, not this coincidence. The object's actual runtime format remains unassigned and is unnecessary to close the fixed-image role question.

## Selector: new table evidence and stronger bounded control-flow analysis

func_00201778, RAM 801BE2E8, returns unsigned byte root[3*a0+a1], where root is loaded from RAM 801D0688. Its eight original words occupy [00201778,00201798). The r1 publication join remains valid: func_00201BAC loads raw resource 00315736, copies its first 0x2630 bytes, adds header u16 at +8 to the copied base at 00201C34..00201C38, and publishes this pointer at 00201CAC. The raw payload is [008A99BA,008AC4BA), 0x2B00 bytes, with the authenticated hash above. This resource is raw; applying the fixed-image boot-LZ codec fails immediately and was rejected, not worked around.

Header entry +8 is 08A0; the nearest greater published section offset is 08AC. The intervening twelve bytes are:

| Conditional row under width-three indexing | Bytes as unsigned integers |
|---|---|
| 0 | 90, 80, 70 |
| 1 | 80, 90, 80 |
| 2 | 70, 80, 90 |
| 3 | 255, 255, 255 |

Interval SHA-256: 69B7F9252B66C1A5BE65A65FB3CCA4684EEE0244F5D944AAA3A333BDC2EADAE2. The twelve-byte gap and four width-three groups are data facts; a hard allocation boundary, valid four-row input domain, sentinel meaning, or absence of overlapping views is not established. The accessor bounds neither argument. If a0 were 0..2 and a1 were 0..2, the result would be the symmetric three-by-three grid; those are hypothetical inputs, not observed or statically proven reachability. Percentage, row-distance, compatibility and strength interpretations all fit the numbers without establishing semantics. The 255 row may be a sentinel but is not named as one.

The new edge analysis is deliberately stronger than r1's exact-entry literal/J/JAL scans: it decodes **all** aligned words in accepted descriptor-10 text [001F0A30,00211D20) and resolves J/JAL plus integer, likely, REGIMM and COP1 relative branches against every instruction address inside the selector owner. It finds zero encoded direct incoming edges to any of those eight words. Counts: 1,242 JAL, 674 J, 2,003 branch encodings. Treating every aligned word as a possible instruction is conservative for this negative local result; it is not a reachable CFG classification. The immediately preceding owner ends with jr ra at 00201770 and its delay instruction at 00201774, so ordinary sequential fallthrough does not enter the selector.

The same bounded enumeration preserves 301 jr-ra returns, 24 other JR and 13 JALR sites as unresolved indirect transfers; it does not solve their register values or reclassify them as selector edges. External-overlay branches, synthesized/relocated pointers, returning into an interior address, runtime-written code/data, and unexamined execution states are outside this result. It is not a whole-program absence proof. The frozen broad decoded scans are not repeated and retain their exact corpus limits: 24,588 strict custom-LZ streams, 3,656 saved 7MiB files, 825 LHA outputs, duplicates included; zero selector literal matches does not exclude synthesized references. Likewise, 244 saved direct-signature placements establish placement only, not execution.

**Supported selector disposition:** retain accepted family-table membership and the consumer-provenance gate. The table is now independently located and its bytes known, and local direct/interior/fallthrough alternatives have been narrowed. None of this identifies an actual caller, removes a matching obligation, proves the routine unused, or justifies a semantic rename. No current Total Resolver status/verify or new knowledge queries were performed in this r2 pass; the Director may obtain a separate bounded read-only retrieval. No negative conclusion here ranges over unqueried clean R3 knowledge.

## Smallest remaining observation and review decisions

A single qualified selector invocation can resolve a positive provenance chain. Required inputs: verified Rev 0 identity; contemporaneous placement/signature proving that RAM 801BE2E8 contains func_00201778; initialization/resource identity for pointer RAM[801D0688]; and execution provenance for that observation, distinct from placement. Capture the instruction that actually transfers control, its target register/value when indirect, caller PC, RA, a0/a1, root pointer, addressed byte, and returned v0. RA alone is insufficient for a tail jump. Retain a short predecessor trace through the last target-pointer definition or load so the origin is identified, plus the caller's first use of v0 if a behavioral name is proposed. An interior-entry invocation must identify the exact entry instruction and required register state. Do not impose the hypothetical 0..2 domain on capture filtering.

An existing qualified record with those fields could suffice; new runtime operation is not prescribed or authorized here. If none exists, a later authorized observation while descriptor 10 is active is required. Failure to hit the entry in one battle or menu window would remain window-bounded and would not close this gate as dead code. If only the data is observed without execution, the publication join improves but consumer provenance remains unresolved.

For independent review: check the proposed image exclusion, exact transform and mapper domain, final draw chain, rejection of the untyped occurrence as a reference, selector raw-section interpretation, and local negative-edge scope. After acceptance, the Director can route the image service and replace that one discovery gate. The selector gate, all r1 inclusions/shared interfaces, record-count versus pool-semantics distinctions, original completion requirements, PURE_C/ownership/placement/relocation/target-byte/full-ROM gates, and any applicable structural/tooling reviews remain intact. This research does not itself accept or complete the Combat family.
