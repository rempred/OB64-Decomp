# Combat supplement integration preparation r1

Status: complete. Eight complete accepted owners authenticated against W7 Git and the normalized ROM. Uncompiled reconstruction notes only; no matching or semantic acceptance.


## Authority and proof scope

Launch COMBAT-SUPPLEMENT-INTEGRATION-PREPARATION-20260907-01, receiver /root/boot_conversion_preparation, Director /root (native 01a07262-aeca-7341-ad10-2dba705ff988), local. Ready 4e33e528e92bcd5b3f5d7153c5759303b3b2c3a1; activation 48a09761f7cb796d5b603a07de4d82b167f7af84; coordination baseline 12378487240f25b17325ca2897976b9bf58bf43e. The complete claim was created atomically using CreateNew and read back before any other write. Unchanged governing instructions were reused as the prompt allows.

All production reads used accepted W7 Git 469a1416918592749d61dc34e3e079796f7b673c. Supplement extraction baseline d70fd853fdffacf71290b24763e010a549276a55 and service package frozen ea3148eda4799ee4761b937f8922f22ad6409db0 supply literal inputs, not current source-wave routing. All four bound report/package hashes matched:

| Input | SHA256 |
|---|---|
| supplement-inputs-r1 report | 6299B3986E7D9804BAE7751EEC1313093B63E4F7C39DD0F5F3FC1762A54F827C |
| supplement-inputs.json | A6E2622E7C61F375417823A50FAB88050E8E09C4619CDBE2861B9E90CF48E167 |
| attack-label-inputs-r1 report | 40D6733A8F276A29D01C9FA93DD51B0627BE1C6F4FFAE685D56C7687E3E1D402 |
| attack-label inputs.json | CD691D017AE127FFEFCC319E4E063E712E43D62A3260A28A309D4F2CA88B1364 |

Source v64 SHA256 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 and in-memory normalized z64 SHA256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A matched. No ROM was rewritten. Each complete contiguous ASM word equals its actual ROM word; source hash/extent matches the W7 manifest and bound package. Unique W7 semantic rows and descriptor-10 saved placement agree. Stale decoded PC comments are only aids: branch edges and absolute jump/call targets were computed from words and accepted VMA. The stored placement, including physical groups 2,6,7, is not new runtime execution evidence.

| Owner | ROM extent (exclusive end) | Saved VMA start | Words / static calls |
|---|---|---|---|
| func_001F0E64 | 0x001F0E64..0x001F0F5C | 0x801ad9d4 | 62 / 5 |
| func_0020D590 | 0x0020D590..0x0020D654 | 0x801ca100 | 49 / 2 |
| func_0020C908 | 0x0020C908..0x0020CA68 | 0x801c9478 | 88 / 1 |
| func_0020FC7C | 0x0020FC7C..0x0020FDC0 | 0x801cc7ec | 81 / 2 |
| func_0021088C | 0x0021088C..0x00210930 | 0x801cd3fc | 41 / 6 |
| func_0021062C | 0x0021062C..0x00210730 | 0x801cd19c | 65 / 0 |
| func_00210930 | 0x00210930..0x00210970 | 0x801cd4a0 | 16 / 2 |
| func_001F0C24 | 0x001F0C24..0x001F0E04 | 0x801ad794 | 120 / 5 |

## func_001F0E64 â€” 248 bytes

Consumes a record pointer and a full 32-bit selector. If selector low byte is 0xFF, return without writes. Otherwise only a full-word zero selector, together with byte[record+0x48] bit 1 set, calls 0x8009C7CC three times. Combine returns R0,R1,R2 as ((R0<<18)&0x0C000000)|(R1<<15)|R2 using 32-bit operations, then take unsigned remainder modulo 5 (retail multu by 0xCCCCCCCD, high word >>2, subtract five times quotient). Do not narrow helper returns or replace the three calls by one. Regardless of random path, byte+0x48 bit 0 adds 50 to the chosen selector; branch-likely delay means addition occurs only when that bit is set.

Store the selector's low halfword at+4, 0xFFFF at+6, then zero halfwords in order+8,+0x10,+0x0E,+0x0C. Clear bytes+0x46,+0x47; call 0x8009C970(record+0x12,0xFF,0x10), then 0x80093380(record+0x22,0x10). Byte+0x48 itself is unchanged. No stable return value is established. Preserve the low-byte sentinel versus full-word zero distinction and the logical unsigned remainder. All 62 words, five calls and branch edges are authenticated in the owner JSON.

## func_0020D590 â€” 196 bytes

Consumes one record pointer; reads word+0x48 before any null branch, so later null-conditional flag extraction does not make this a null-safe interface. If word+0x48 is 0x101, return 0x26. Otherwise start a 32-bit index at zero and repeatedly call VMA0x801C1AA4 (descriptor-10 projection func_00204F34) with nine arguments: word+0x48, word+0x4C, (word+0x40>>10)&1, (word+0x40>>8)&1, zero, index, address of a local output byte, zero, zero. Flag loads are independently conditional on non-null pointer. The backedge increments the index after every call and retries until the low return byte equals 1. No maximum index or failure exit is present.

Then call VMA0x801C1EE8 (func_00205378 under the same placement) with a local output buffer, word+0x50, and the zero-extended helper output byte. Return the 32-bit negation of the second output word (stack+0x2C, buffer+4); do not mistake this for helper return negation. Accepted W7 source func_00205378 returns CombatPoseBounds, four int fields low04, low08, high04, high08. The apparent first buffer argument is the hidden structure-return pointer, and the C-level arguments are handle=word+0x50 and directoryIndex=the output byte. The returned second word is bounds.low08. Reuse this ABI-compatible return shape instead of inventing a three-explicit-argument public prototype. The two helpers' output contracts must be retained; success implies the first output byte is used, but no initialization before success exists here. Complete 49-word evidence preserves the unconditional special-case jump target and two calls; the no-bound retry is not an invitation to add a guard.

## func_0020C908 â€” 352 bytes

Consumes destination pointer and full 32-bit index. Compute table pointer0x80195560+52*index with 32-bit shifts/adds before calling0x80093380(destination,0xF8). Only the later destination+0xF6 store narrows index to a byte; do not narrow table indexing. The table stride is 0x34; no index bounds are checked.

Copy source-to-destination offsets in instruction order: byte11->word48; byte12->word4C (with index->byteF6 between them); byte13->byte31; byte1A->byte33; unsigned half16->half22; half18->half20; half1C/1E/20/22/24/26->half24/26/28/2A/2C/2E; byte28->byte30; byte1B->byte3F then byte34; half2A/2C/2E/30->half36/38/3A/3C; byte32->byte3E. Offsets in this paragraph are hexadecimal. All source byte and halfword loads zero-extend.

If destination word+0x4C equals 1, clear byte+0x3E. A late null-conditional equality helper shape exists, but earlier destination stores and the delay-slot byte store already dereference it; this is not a safe null-input branch. Source byte+0x33 bit 1 adds destination word+0x40 bit 0x200; source bit 2 adds destination bit 1 (numeric mask0x2); finally always OR destination word+0x40 with0x500. Keep the two conditional ORs followed by the unconditional one, and reload the source byte for each test as retail does. The final v0 contains the final flags word, but a public return contract is not established by this alone. No direct display-command writes. Complete 88 words and one helper call authenticated.

## func_0020FC7C â€” 324 bytes

Consumes one record pointer. Null checks protect every flag read and result in no action for null. For non-null word+0x40 flags, bit 3 selects helper code 9 and selector 0x20; otherwise bit 2 selects code 5 and selector 0x22; otherwise bit 4 selects code 1 and selector 0. No selected code returns directly. Retail repeats null/flag queries in the lower-priority paths; preserve helper-style predicate/lifetime shape if a future linked diff requires it, without inventing side effects between pure loads.

When selected, call VMA0x801CC574 (descriptor-10 func_0020FA04) with record and code. Only afterward walk three word pointers at record+0,+4,+8, loading each after the preceding helper. For each non-null entry call func_001F0E64(entry+0x44,selector). The record cursor advances four bytes and unsigned loop count reaches3; null entries still count. The first helper's result is ignored. No writes directly occur in this owner; called helpers act on state. Keep the first helper before any child load/call, and keep all three child calls conditionally ordered. Stable public return contract is not established. The complete owner includes a final nop after the return delay slot; do not shrink the accepted extent. 81 words/two static calls authenticated.

## func_0021088C â€” 164 bytes

No incoming argument consumed. Call 0x8009DAF4(0x0031823A), then 0x80070F30(result); publish the returned pointer at global 0x801CFCC0 before calling0x8009DBB8(pointer,0x0031823A). Reload that global, read unsigned halfword offsets at0,2,4, add each to the same block base and publish pointers at globals 0x801D06D4,0x801D06D8,0x801D06DC in that order. These are three 16-bit byte offsets, not 32-bit pointers or scaled indices. Then perform the same query/allocation/load sequence for constant0x003188AE, publishing its pointer at0x801D06D0 before the load call. No null/failure checks, prior allocation release, or offset validation is present. No public return value is established. All 41 words and six calls are exact; global publication before loading and first-block derived-pointer setup before the second sequence are matching-sensitive ordering.

## func_0021062C â€” 260 bytes

Consumes two full 32-bit table indices and a full 32-bit selector. Only selectors 2,8,4,16 are supported, mapping respectively to byte masks 8,4,2,1. Other selectors return 0 without reading the global table. The unsigned comparison against 5 in dispatch and exact selector equalities must not be replaced by a generic arbitrary bit-mask test.

For a supported selector, load base global 0x801D06D0 and unsigned byte at base+arg0-1. If that byte has the mapped mask, return 1 immediately without reading the second entry. Otherwise test unsigned byte at base+arg1-1 and return canonical 0 or1. No input narrowing, zero-index guard, bounds check or null guard exists. This is a short-circuit either-entry predicate, not an AND and not the masked bit value as a return. The four copies share the final return sequence; retain independent switch cases as an initial readable reconstruction option, with no guarantee a merged mask form matches. No calls or stores; complete 65 words authenticated.

## func_00210930 â€” 64 bytes

No incoming arguments consumed. Load global 0x801CFCC0 before stack setup, call 0x800712C4(pointer), then load global 0x801D06D0. Clear0x801CFCC0 in the second call's delay slot (therefore before the second helper executes), call 0x800712C4(second pointer), then clear0x801D06D0. Neither pointer is null-checked. The derived pointers0x801D06D4/6D8/6DC are not cleared by this owner. Do not clear the second global before its call or group both clears after both calls. Complete 16 words include the preamble and final epilogue; no public return contract is established.

## func_001F0C24 â€” complete retained 480-byte service

Consumes a full 32-bit key and returns a pointer or zero. Load global 0x801CE8BC and scan sixteen records at base+0xC0, stride 12: word0 pointer, word4 key, word8 retention value. A non-null pointer with matching key refreshes word8 to 15 and returns the pointer. If no match, independently scan for a null pointer, reloading the global for each slot. If all sixteen are occupied return 0; do not infer an eviction policy. This differs from073CC's full-table fallthrough. Global/null validity is assumed by these loads.

On the first empty slot, compute key*15 with 32-bit shift/subtract. Call VMA0x801AD60C (func_001F0A9C under descriptor 10) with0x00391270 and retain its returned source pointer. Call VMA0x801BE978 (func_00201E08) with0,90,15, then allocate returned size+8 using0x80070F30. Initialize eight-byte header in instruction order: bytes0,1,2 =0x36,0x34,2; halfword4=90; byte3=0; halfword6=15. No allocation or resource failure check occurs here.

For each row 0..14, call VMA0x801BE9A8 (func_00201E38) twice: first(4,90), then(0,90). Source row pointer is source+8+firstStride*(row+15*key); destination is allocated+8+secondStride*row. Retail uses low32-bit signed mult results; do not replace these with overflow-prone signed C arithmetic without respecting the actual range/bit contract. No input-key bound is established.

Inner loop starts logical position0 and adds4 per iteration while updated position<90. It therefore performs 23 iterations, reads 23 source bytes and writes 46 destination bytes per row, including the final logical group starting 88. For source byte b, first output is ((b>>2)&0x30)|((b>>4)&3); second is ((b<<2)&0x30)|(b&3). The source byte is loaded twice, with the first output store between loads; keep this alias-sensitive ordering rather than unconditionally caching b. Source advances one byte and destination two per iteration. No image-format interpretation or resource decode acceptance is asserted from this packing alone.

After all rows, reload global, publish output pointer at selected slot+0xC0, reload it as return value, store key at+0xC4 and15 at+0xC8. No slot reservation is written before helper calls and no source release is present. Retain helper calls inside the row loop even though their arguments repeat. Complete 120 words and five static call sites authenticated. Accepted body/pose exclusion and separate retained service disposition remain unchanged; only subsequent routing places its match within the same full supplement.


## Accepted dependency refinements

W7 func_00205378 establishes the four-int CombatPoseBounds structure-return ABI used by0020D590; its local declaration is in that source, not a shared header. Future narrow declarations must remain compatible and preserve existing sources, without structural/tooling changes. The earlier local stack output is the distinct byte written through the first helper's seventh ABI argument, not the bounds record.

W7 func_00201E38 gives source stride 24 for(4,90) and destination stride 48 for(0,90). Its default format branch computes ((width+31)>>5)<<3; format0 computes ((width+15)>>4)<<3. W7 func_00201E08 multiplies the resulting stride by height, so001F0C24 requests 720+8=728 bytes. Its 23 source bytes and 46 destination bytes per row leave one source byte unused and two allocated destination bytes unwritten per row; do not silently expand the loop to fill padding or copy 24 bytes. The repeated row helper calls remain required by the observed source contract. Header constants and byte packing are preparation facts, not new semantic image-format acceptance.

The accepted shared combat_pose_pool.h declarations support func_00001330(u32 bytes), func_000016C4(void pointer), and func_00023780(void pointer,u32 bytes). Calls to 0x8009DAF4 and0x8009DBB8 retain the existing size/load-style interface from accepted package/dependency context; no resource decompression or runtime behavior was tested here. Helper addresses projected from descriptor 10 remain conditional on that accepted placement. Unknown helper meanings and caller validity remain explicit rather than being filled by external names.


## Evidence and release

Ignored root build/combat-supplement-integration-preparation-r1/ contains each complete original ASM as .asm.txt and a per-owner JSON with input identities, package row, manifest row, unique semantic row, placement, all words, computed branch edges and absolute jumps/calls. dependencies.json binds the six accepted helper/type source blobs; helper-owners.json confirms the six projected same-overlay helper entries against unique accepted owners. auth.py performs offline authentication/extraction for one target; dependencies.py records narrow dependencies and adds jump evidence; finalize.py formats this report. No script invokes a compiler or build.

| Evidence | SHA256 |
|---|---|
| dependencies.json | F5CA12B5C3B7FFBEE6F1501411F41983351942E09A47A6FA996F07FFB6CCBA17 |
| func_001F0C24.json | E541619406C8663FC9AE7F16075D4A686AFB73CC8CFDB0216810F6691FD3FC08 |
| func_001F0E64.json | 892574376E78CE13D048140CBCCEA8C57C9B891A056AC5E4CB0567E62B8FB514 |
| func_0020C908.json | B4C4B9A5EFA9516DB0F3D21CB81AA68F0721156EB1585928D9FDB8A8A5D96A43 |
| func_0020D590.json | 21F59AF9A77BCAE5F38C618120E1B50653A40FEBEA7DF53D49F949F27A4B0F9E |
| func_0020FC7C.json | 1D86D26F52DA8109DD5F1CB1C1E934CD8B7E71C8B73D757B0CB741727D5D0DD4 |
| func_0021062C.json | B48674275D2689FC61031FCE089F952F43CF37B0D62B17261D87ADBF2111178C |
| func_0021088C.json | 16563C8C90B5F30CE0B925D36B081F94973484547F57654EB931F0960395437F |
| func_00210930.json | 7E15A8245051CFC9995BA04627D52969A435136459FE3881473B41648E0A9A1D |
| helper-owners.json | A50C55A01DFFC925C55AF101886795FF2BDBCD0C1434555540594E4EE15224EA |


The full thirteen-target future supplement and all fourteen W8 targets remain unchanged. The prior five supplement owners were not reworked. Accepted service/body-pose exclusion, original Combat/shared obligations, conditional placement/interface qualifications and unresolved selector observation gate remain intact. These notes require reauthentication against the accepted preceding wave before implementation. They activate no source wave, add no independent review or final-ROM gate, and establish no new semantics, structural classification, family disposition, source class or matching result.

No source experiment was performed, so no compiler/matching blocker or guaranteed source spelling is claimed. No authentication failed. A targeted Git search found no C files for several helpers; their addresses were retained and unique accepted original owners confirmed instead of inventing implementations. Only this fresh claim/report and ignored root were written. No candidate C, production/config/tool/source changes, compiler/link/build/verifier/source-policy command, runtime/GUI/bridge/database/capture, agents, external-source access or Git mutation occurred. Mutable W8 and Resolver inputs were excluded and all frozen outputs preserved.

All commands have completed. Direct collaboration handoff goes to /root and all assigned writes are released at terminal handoff.
