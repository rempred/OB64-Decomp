# Combat draw owner preparation R1

Completed bounded preparation for the complete func_001F7ADC owner. The note separates setup, decoded-item traversal, geometry strips and format-specific command emission. It identifies extent, ABI, narrowing and loop details that can produce an incorrect C reconstruction. The future W8 source worker must implement and verify the owner after W7's prerequisite gate.

Task combat-draw-owner-preparation, revision 1; launch COMBAT-DRAW-OWNER-PREPARATION-20260907-01. Receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local. Ready and starting commit: 3b91df3aaa387e6eeaf4931ec55e652f3aec316d. The fresh claim was created atomically and read back before evidence writes. Required guides were read in this continuing context.

## Complete owner and authority

| Semantic name | Meaning retained | Address | Address space | Evidence role |
|---|---|---|---|---|
| Draw owner | func_001F7ADC; no stronger renderer identity | 001F7ADC..001F89B4 | z64 ROM, end exclusive | Complete 3,800-byte comparison |
| Accepted placement | Same descriptor-10 owner | 801B464C..801B5524 | RAM virtual, end exclusive | Decode direct targets |
| Display-list cursor | Pointer advanced per emitted command | 800E9BA0 | RAM virtual | Repeated eight-byte records |
| Matrix cursor | Pointer advanced by 0x40 | 801969B0 | RAM virtual | Matrix storage |
| Vertex cursor | Pointer advanced by 0x10 per record | 80197178 | RAM virtual | Vertex storage |

The extraction package is unchanged by the R2 citation correction. Its baseline is d70fd853fdffacf71290b24763e010a549276a55, not R1's mistyped full ID. Production references use accepted 0e1191013aeebed2929c9caff7c1f139169ad7f3. Frozen input commits are 4cac111 and 341055c.

The assembly and package identify exactly 950 words. The original return is ROM 001F89AC, followed by its delay word at 001F89B0. The older size=3808 comment includes eight bytes belonging to the next function's preamble. Do not compare a 3,808-byte candidate, trim to an early internal branch, or use a historical partial body. The supplied package contains no archived candidate or matching note for this target; no broader historical search was made.

The checker authenticates the complete owner against baseline and normalized ROM. All 35 encoded JAL sites agree with the package count. All 38 decoded direct J/relative branch targets stay inside this owner. There is no indirect call or non-return JR in the package. Generic split-assembly RAM comments are not placement authority.

## ABI, input views and live storage

The working interface is a pointer followed by three floats and a fifth integer narrowed to signed 16 bits. The three floats arrive through a1/a2/a3 and move directly into f24/f26/f22. The fifth argument is loaded from incoming stack +0x10, then sign-extended from its low halfword. The function returns zero on its early and normal completion paths.

Call the initial pointer P and its word at +0x40 Q. These are neutral views, not a new actor structure declaration. P fields +0x1C/+0x1E/+0x20, +0x22/+0x24/+0x26, +0x34 and +0x4E are signed halfwords. P+0x40 is a pointer. P+0x50/+0x54 are signed halfwords used in position setup. Q+0x48/+0x4C are words; Q+0xAC, +0x4B and +0x4F are unsigned bytes. Q's flag word +0x40 is consumed through existing helpers.

P+0x44 is retained as a base. The item counter later advances by one byte, and the per-item read is base[counter+0x12]. This is not evidence of a 0x12-byte or 0x28-byte record stride. P+0x4E is captured before the loop; do not conflate it with the later byte lookup.

The local decoded record begins at stack +0x20. Existing CombatPoseRecord fields map directly: +0x24/+0x28 are field_04/field_08; +0x2C is field_0C; +0x34 is field_14; +0x38/+0x3C are float field_18/field_1C. Baseline func_00205484 also writes its index at record+0x20. Preserve sufficient storage through that byte and the observed 0x28-byte region before the matrix at stack +0x48. CombatPoseScratch alone exposes only the decoded prefix, so do not silently declare the producer's indexed output smaller than it writes.

Stack landmarks: Q +0x9C; P+0x44 +0xA4; captured signed P+0x4E +0xAC; Q+0x48/+0x4C +0xB4/+0xBC; helper low-halfword result +0xC4; orientation byte +0xCF; vertex count +0xD4; negative decoded y +0xDC; strip capacity +0xE4; accumulated geometry rows +0xEC. These are lifetime aids, not register-binding instructions. Retail frame is 0x170; f20 through f30 are saved in even-register pairs.

## Setup, arithmetic and call ordering

ROM 001F7B24..001F7BF0 captures Q and its two words, calls func_0020C448(Q), and retains the unsigned low halfword. That helper forwards four unsigned halfwords at Q+0x36..+0x3C to its own dependency. No stronger meaning is assigned.

An integer factor is formed in two stages. Multiply signed16(argument5) by signed16(P+0x34), divide signed by 255, narrow to signed16, multiply by unsigned byte Q+0xAC, and divide signed by 255 again. The result is stored as a halfword. A zero low halfword returns zero before command setup. The 0x80808081 multiply-high sequences are signed division lowering; replacing them with unsigned arithmetic changes negative inputs. Later, each selected item's byte multiplies this signed-halfword factor, divides by 255, then masks to eight bits for the FA000000 command's second word.

Let X = signed16(P+0x1C)+signed16(P+0x22), Z = signed16(P+0x20)+signed16(P+0x26), and F1/F2/F3 be incoming float arguments. The angle-like scalar has three routes:

- Test float(signed16(P+0x20)) < F3. If true, call RAM 8009CFB0 with (float(X)-F1)/(float(Z)-F3); multiply its float result by double 180 and divide by double pi.
- Otherwise test F3 < that same unadjusted field. If true, perform the same ratio/call/conversion, then add double 180.
- Otherwise choose +90 when float(X) < F1, and -90 otherwise.

The tests use the unadjusted P+0x20, but the ratio uses offset-adjusted Z. Preserve this asymmetry and the ordered floating comparisons. Do not substitute atan2 or assign the unknown helper a stronger name. Convert the double result back to float, then add float 360 when negative. The orientation byte is the conjunction angle >= 150 and angle < 330.

A single-precision distance computation follows: sqrt((float(X)-F1)^2+(float(Z)-F3)^2), including the emitted unordered-result fallback call to sqrtf. Its result is not subsequently used for the scale calculation. Do not delete the call sequence as useless arithmetic. Source spelling that produces it is untested here.

F2 controls a separate scale: below zero gives 1.0f; above 100 gives 0.5f; otherwise convert single-precision (100-F2) to double, multiply by 0.005, add 0.5, and convert back. Do not flatten mixed precision or change comparison order. Raw doubles are independently read from ROM 00213528..00213560: 180, pi, 180, pi, 0.005, 0.5 and 1.1.

Setup calls RAM 80092A90 with a local matrix and three zero float bit patterns. Three translation components include P's signed-halfword fields; the first and third also add P+0x50/+0x54. Calls RAM 800988A0 and RAM 80092C18 consume matrix storage, with the latter receiving -90, the angle scalar and zero. Keep unknown math-helper identifiers. DA380000, DA380001 and DE000000 commands and matrix-cursor increments remain observable stores.

## Decoded-item traversal

The item counter starts at zero. At each iteration, func_0020C034(Q) returns bit 10 of Q+0x40, then func_0020BFF8(Q) returns bit 8. Both helpers return zero for a null pointer, although this owner already dereferences Q earlier.

The call to func_00205484 at ROM 001F7FDC receives Q+0x48, Q+0x4C, bit10, bit8, captured P+0x4E, item counter and the decoded-output pointer. Its false result exits traversal through final command cleanup. No fixed item count is established.

A successful record is skipped if its per-item byte is zero or decoded field_14 has bit 2 set. Otherwise the helpers are called again, now bit8 before bit10. The func_00206340 call receives the two Q words, decoded record, bit8, bit10, the retained low-halfword helper result and zero. Do not reverse helper ordering or argument positions because the same helpers appear twice.

Its result is an image-header pointer. Read format byte +3, width halfword +4 and height halfword +6. Call func_00201E38 for byte stride. If the first format is 2, advance by 8+stride*height to the next header and calculate its stride instead. All later geometry and texture commands use this selected header. No allocation-failure or header-validation branch is present here.

Strip capacity is signed 4096/stride, with the compiler's division checks in the original instructions. Preserve it as arithmetic, not hand-authored break instructions. Another helper, RAM 8016DE1C, receives Q's bytes +0x4B/+0x4F. If its low byte equals 2, both decoded float scales multiply by double 1.1 before converting back. The orientation byte negates the x scale; y scale always multiplies the earlier F2-derived scale. RAM 80098AA0 consumes these values and 1.0f.

## Two strip loops

The first loop builds 16-byte vertex records through func_002103EC. It writes the top pair, then one bottom pair per strip. Horizontal positions are decoded field_04 and field_04+field_0C. Vertical positions start at -field_08 and decrease by accumulated strip heights. Explicit signed-halfword narrowing appears before calls. Texture coordinates include width-1 for the initial right vertex, but later right vertices use the low signed halfword of field_0C without that subtraction. Preserve this difference.

The vertex helper clears sixteen bytes, writes x/y as halfwords, stores texture coordinates shifted left six at +8/+0xA, and writes 255 at +0xF. It does not justify a broader renderer identity. Keep vertex storage and cursor arithmetic separate from decoded records.

Each strip height is min(remainingHeight,capacity). The first strip loop starts after the top pair without an initial remaining-height test. It records two plus twice the strip count as the vertex count. The second loop resets remaining height and cumulative row, then emits texture state and two-triangle command words for each strip. It uses vertex indices in steps of two. These loops share strip partitioning but different counters and termination order; merging them is not a supported source simplification.

There is no proven capacity clamp for the encoded vertex-count masks. Zero stride, zero capacity, malformed dimensions and resource exhaustion are not validated here. Do not claim arbitrary-input safety or invent checks to simplify matching.

## Format paths and shared command tail

func_00201E9C, called fourteen times, returns aligned width: multiples of 4 for formats 3/2, 8 for 1, 16 for 0, and 32 otherwise. It is distinct from the byte-stride helper. Repeated calls are part of the original call sequence; no purity annotation or caching equivalence is established.

| Selected format | Code path | Matching distinctions |
|---|---|---|
| 3 | ROM 001F83D0..001F852C, then shared tail | FD180000 and F5180000; helper width doubled for tile-line arithmetic; four helper calls |
| 1 | ROM 001F8538..001F86D0 | FD880000 and F5880000; undivided helper width; five helper calls |
| Other | ROM 001F86D4..001F8874 | FD880000; helper width halved for initial image/load-line fields; F5880000 load versus F5800000 final tile; five helper calls |

Every path uses payload pointer header+8. The pointer is not advanced for each strip; cumulative row is encoded in command coordinates. Preserve the 0xFFF coordinate masks, 0x1FF line mask, quarter-coordinate shifts, minus-one endpoints, and the default path's differing width shifts. The artifact retains every exact word and corrected internal branch target for shared-tail reconstruction.

E6000000, F4000000, E7000000 and F2000000 command families surround those format-specific words. The common 06000000 pair packs doubled vertex indices with explicit masks. Display-list pointer updates often precede helper calls or later stores into the earlier command slot. A convenience append helper that changes evaluation or call ordering can change emitted instructions.

A rendered item emits D8380002/0x40 cleanup. Skipped items advance the item counter without that per-item cleanup. Decoder failure emits a final D8380002/0x40 and returns zero. The initial zero-factor path bypasses both setup and cleanup. Preserve these distinct exits.

## Practical reconstruction limits and next action

Use existing decoded-pose types, an adequately sized indexed scratch view, neutral offset-backed P/Q views, and separate matrix/vertex/command buffers. Avoid declaring every pointer as the pool record. Keep signed halfwords, unsigned image dimensions, bit getters, integer narrowing and float/double transitions explicit.

Likely comparison traps are the wrong 3,808-byte extent, partial command tail, reordered helper calls, cached header/global loads, unsigned /255, flattened mixed precision, altered skipped-item cleanup, and merged strip loops. No particular C spelling or compiler workaround was tested. No pure-C blocker or structural defect was established.

The supplied package's accepted static/runtime reports retain their original scopes. This note does not identify the separate RAM 8020B1E0 renderer, merge battle/cutscene identities, assign a new gameplay field name, or claim observed drawing. No general historical search or external source was used.

The future worker owns independent C implementation and focused linked comparison. W8 remains fourteen original members behind W7, with retained shared obligations and the later thirteen-target supplemental wave unchanged. This note adds no independent matching-review gate or per-function full build.

## Evidence and release

Reproduce only the offline read-only analysis with python -B build/combat-draw-owner-preparation-r1/check.py. Result: 950 target words, 35 JAL sites, 38 owner-internal direct jumps/branches. Seven bounded original files matched baseline blobs and ROM. Baseline types/configuration/source identities are recorded without reading W7 mutations.

| Artifact | SHA-256 |
|---|---|
| w8-inputs.json | 4340C97DE145E1970D62F909B443894ACECFF3742F544D9BB41CCE0A9263025D |
| Original complete owner | 41EE2BEC138C2F40CF3678EB02961BECC800E2602AFC1E17FEDD14F07177FF29 |
| New evidence.json | D307D4C2EF8785AE6827D29AF14E4917AEF2B4A0E8AC278A505069605F56C677 |
| New check.py | EC6F470D7838354F011BD3010DFE3C25DD0FAE8E8290DADECD09D8BC98F7CB95 |

V64 SHA256 is 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12. Normalized z64 SHA256 is 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. Normalization remained in memory. No compiler or game experiment failed; a broad report serialization was replaced with focused fields after truncation.

Exact bytes/local dataflow are Verified static observations. Reconstruction guidance is Supported and uncompiled. No new semantic, structural, family or matching acceptance is claimed. Only the fresh claim, this report and ignored checker/evidence were written. W7 and all frozen records remain untouched. No C candidate, compiler, linking, build, verifier, generator, runtime, GUI, bridge, database, agent or Git mutation occurred.

All commands have finished. Terminal handoff releases all assigned writes to /root.