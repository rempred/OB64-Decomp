# Combat supplement compositing preparation r1

Status: complete. All four accepted owners authenticated against the complete normalized ROM ranges; uncompiled reconstruction guidance only. No implementation blocker was established because no source experiment was performed.


## Authority and authentication

Launch COMBAT-SUPPLEMENT-COMPOSITING-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root (native 01a07262-aeca-7341-ad10-2dba705ff988), local. Ready a5c170beb8fe6f106ec33e781451ff7ca3d91cd5, activation 8525f7912ffb823047c6d4300da8600422d54fbf, coordination baseline a6b99b573060e242c5780ebe4b898950f92e98cc. Claim was created with CreateNew and read back before any other write. Unchanged governing guides were reused as authorized.

Bound retrieval report SHA256 6299B3986E7D9804BAE7751EEC1313093B63E4F7C39DD0F5F3FC1762A54F827C and package SHA256 A6E2622E7C61F375417823A50FAB88050E8E09C4619CDBE2861B9E90CF48E167 matched. The package extraction baseline d70fd853fdffacf71290b24763e010a549276a55 is historical; all additional owner, manifest, placement, type and source reads came through Git at accepted W7 469a1416918592749d61dc34e3e079796f7b673c.

Source v64 SHA256 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 and in-memory normalized z64 SHA256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A matched. No ROM was rewritten. Each contiguous original word equals the actual ROM word, and each original ASM hash/extent equals both the package and W7 manifest. Unique semantic rows and descriptor-10 placement agree. Saved VMA placement is not runtime execution evidence; physical groups 2, 6 and 7 and existing conditional renderer qualifications remain unchanged. Stale 0x8027xxxx comment PCs were not used to compute branches or calls.

| Owner | ROM extent, exclusive end | Saved VMA extent | Words / calls |
|---|---|---|---|
| 002071F4 | 002071F4..002073CC | 801C3D64..801C3F3C | 118 / 4 |
| 002073CC | 002073CC..00207658 | 801C3F3C..801C41C8 | 163 / 22 |
| 00207A70 | 00207A70..00207C08 | 801C45E0..801C4778 | 102 / 4 |
| 00207C08 | 00207C08..00207E30 | 801C4778..801C49A0 | 138 / 10 |

All four complete owners include their accepted preambles and return delay slots. The actual target instruction words control the notes; internal historical labels confer no new public entry or boundary.

## func_002071F4 — complete 472-byte owner

No incoming argument is consumed. The preamble loads the 32-bit global at 0x801D0728 and a null value skips the whole operation. Retain the accepted preamble entry, not the internal historical func_002071FC label. For each of twenty records (stride 0xB0), reload the global base and skip records whose word+0 is zero. This is a persistent shared record table; no runtime role beyond the observed operations is asserted.

For an occupied record, word+0x18 is an unsigned loop bound reloaded after calls. For each index, process three pointer arrays in order: fields+0x38,+0x3C,+0x40, with associated byte-counter arrays+0x60,+0x64,+0x68. A non-null pointer triggers an unsigned-byte decrement/store; test the truncated byte, and only on zero call 0x800712C4(pointer), reload the array base and clear its word entry. Zero decrements to 255 rather than saturating. Index is a byte offset for counters and four-times index for pointers. The three paths are sequential and separately reload fields; hoisting bases or count across calls changes the observed alias/lifetime contract.

Then process ten inline pointer words at+0x70 through+0x94 and byte counters at+0x98 through+0xA1 using the same decrement-to-zero/call/clear pattern. These run even when count+0x18 is zero. Branch-likely increments and delay-slot increments implement one increment per iteration, not skipped/doubled entries. All four call sites consume one pointer argument and ignore the result. No stable return value is established. No command-stream writes occur in this owner. Complete 118-word ROM equality and actual branch targets are in its evidence JSON.

## func_002073CC — complete 652-byte owner

Two full 32-bit arguments are retained as comparison/storage values; neither is narrowed here. Global 0x801D0728 is assumed usable (unlike071F4 there is no null check). Search twenty 0xB0 records for word+0 equal arg0 and word+0x0C equal arg1; a match returns without changes. Otherwise scan for first zero word+0. If all twenty are occupied, the literal loop advances to the one-past slot and continues initialization there; do not invent an eviction choice, wrap or failure return. Valid caller/table invariants remain unproven.

Initialization ordering: store arg0 at+0 before the first helper; obtain temporary table via 0x8009DAF4(0x003B6CD0), then 0x80071C04(result), then 0x8009DBB8(temp,0x003B6CD0). Load temp+4*arg0-4 into record+4. Call 0x8009DAF4(that word),0x80070F30(result), and0x8009DBB8(new pointer,record+4), storing the pointer at+8 before the latter call. Release the temporary with0x800712C4. Arg0 zero would index before the table; no new bounds semantics are assumed.

From words 0,4,8,12 of the block at record+8, call 0x8009DD38,0x8009DD38,0x8009DF48,0x8009DD38 respectively. Store their results at record+0x48,+0x44,a retained temporary T,+0x6C. Set+0x50 to word [record+0x48] logically shifted right2, and+0x4C analogously from+0x44. Set+0x0C,+0x10,+0x14 to arg1. Copy T words 0,4,8,12 into record+0x18,+0x20,+0x24,+0x28. All these accesses/stores are words.

Let N=word+0x18, B=(N+7)&~7 and P=((N<<2)+7)&~7, preserving 32-bit arithmetic. Allocate 3P+6B through0x80070F30. Starting at returned A, publish fields in this exact sequence: +0x38=A, +0x2C=A, +0x54=A+P, +0x58=A+P+B, +0x5C=A+P+2B, +0x60=A+P+3B, +0x3C=A+P+4B, +0x64=A+2P+4B, +0x40=A+2P+5B, +0x68=A+3P+5B. This partitions three word arrays and six byte regions; it is not an allocation for nine equal elements.

Call 0x80093380 in order on fields +0x38,+0x3C,+0x40 with length P, then +0x58,+0x60,+0x64,+0x68 with length B. Call 0x80093060(T+0x20,field+0x54,N), then 0x80093060(T+word [T+0x1C],field+0x5C,N), then 0x800712C4(T). The owner does not initialize every other record field, and no implicit whole-record clearing should be inserted. Helper names/precise semantics and allocation-failure behavior are not inferred from this call sequence. Return value is not established. All 22 call sites and the complete 163 words are preserved in the evidence.

## func_00207A70 — complete 408-byte owner

No incoming argument is consumed; the complete entry includes the two-instruction global load before internal label00207A78. If global 0x801D0728 is null, return. Otherwise traverse record byte offsets 0,0xB0,...,0xD10 (signed comparison against 0xDC0), all twenty records regardless of word+0. This is deliberately different from071F4's occupied-record gate.

For each record, iterate unsigned index below word+0x18, reloading both global and count at the backedge. In order examine pointer arrays+0x38,+0x3C,+0x40. Each non-null word is passed to0x800712C4, then global and relevant array base are reloaded before clearing the entry. No counter is decremented or reset. Then independently process ten inline pointer words+0x70..+0x94 with the same call/reload/clear; signed comparison against 10 controls this fixed loop. The record offset survives calls, but the global base does not remain cached across them. Do not merge this with071F4's retained record pointer implementation or add the occupied gate. These are alias-sensitive differences, not evidence that the helper actually changes the global. No table header, container allocation or resource pointer is cleared/released here. Four static calls consume one pointer and ignore the result; return value is not established. Complete 102-word evidence is retained.

## func_00207C08 — complete 552-byte owner

One full 32-bit comparison argument is retained across calls. Null global 0x801D0728 skips the operation. Traverse all twenty records at 0xB0 stride; only records whose word+0 equals the argument enter cleanup. There is no additional nonzero test, and there is no early return after a match. Passing zero therefore selects zero-key records as the literal code stands; caller validity and null-release tolerance are not established here.

First perform the same three-array and ten-inline-pointer call/reload/clear loops as07A70, including unsigned count+0x18, signed fixed ten-loop comparison and reloaded global bases. Then unconditionally call 0x800712C4 on record fields in order +8,+0x48,+0x44,+0x6C,+0x2C, reloading global before every load. These five pointers are not individually null-checked or cleared before the next call. Finally call 0x80093380(record,0xB0). The accepted helper declaration and existing uses identify the destination/length interface; do not replace this with reordered per-field stores. Continue to subsequent records. Ten static call sites include the four loop calls, five resource/container calls and one record operation. No byte-counter writes appear directly in this owner. No stable return value is established. Complete 138-word ROM equality and corrected branch targets are retained.

## Shared representation and interface guidance

Accepted W7 include/game/combat_pose_pool.h already supplies CombatPosePoolRecord (0xB0 stride), D_801D0728, unsigned field_18, pointer arrays field_38/3C/40, byte-array pointers field_54..68, and field_70[10]. Reuse those offset names without strengthening semantics. Its+0x98..A1 region is represented as two u32 fields and a u16 field, whereas071F4 accesses it as ten consecutive unsigned bytes. A bounded unsigned-character view of the complete record representation preserves these byte accesses without changing the shared type or indexing a nominal smaller member array beyond its extent. Do not reinterpret these as word decrements or presume host byte order.

The accepted sibling00205C88 provides declarations for the same helper interfaces: func_8009DAF4(u32) -> u32; func_80071C04(u32) -> void pointer; func_8009DBB8(void pointer,u32) -> void; func_0002E138(u32) and func_0002E348(u32) -> u32 pointer; func_00023460(const void pointer,void pointer,u32) -> void. Its argument order is source then destination for00023460, despite contrary names in some unrelated legacy declarations. The shared header supplies func_00001330(u32) -> void pointer, func_000016C4(void pointer) -> void and func_00023780(void pointer,u32) -> void. Literal targets and accepted aliases remain in the authenticated package; resolve actual target relocations under the existing linker contract in the future wave.

Use00205C88 only as an accepted interface/field reference. Its source has extra allocation failure checks, count+10, field_1C/30/A2 initialization, variant mapping and directory parsing that073CC does not perform. None belongs in this reconstruction merely because the allocation layout is similar. These four owners perform data/pointer operations and helper calls, not direct display-command writes. Their renderer/family roles remain conditional on the existing accepted placement and membership evidence.


## Evidence, limits and release

The ignored root is build/combat-supplement-compositing-preparation-r1/. Each owner JSON preserves the exact package row, unique W7 semantic row, placement record, input identities, complete instruction words, actual-PC branch edges and literal JAL targets. Separate .asm.txt files preserve the authenticated original references. dependencies.json binds the shared header and accepted sibling source; manifest-check.json records W7 manifest equality. auth.py takes one assigned symbol and parses offline; dependencies.py authenticates the bounded reference inputs. finalize.py formats this report and produces its evidence table. No script compiles or builds.

| Evidence file | SHA256 |
|---|---|
| dependencies.json | 00274F059E9AC813F53037196D2A3C6A4254F98BA4A0C07CA98FBE36BCEE3D15 |
| func_002071F4.json | 9343CF3A3E447CD9E7DCC90F6630C86D6DC78CCFBA4CDF8F627056A205B440AD |
| func_002073CC.json | 1B0C1BD655BD04071574DDA08AC8EE3ABA77DF018CE074B9675D7B176C4B3D54 |
| func_00207A70.json | E5AB6556072971EA143E2B10FF41DBD3CA673EEBBC0D545E17BC4C788FE3DF86 |
| func_00207C08.json | 6DCCC861D323D5F650FA7485FD829BC4EAAB9BFE8118E563D31458582C508941 |
| manifest-check.json | AFDEABAD398AD1FAA9A1F3F1CEEFE89B1CB23DD79C909A0AF625AB273DD01DBB |


These are uncompiled complete-owner notes, not a new semantic acceptance, matching result, ownership classification, family disposition, independent review or source activation. The existing full thirteen-target supplement remains intact, including func_001F0C24; the historical twelve-row package does not reduce scope. CBDC was not repeated. Existing Combat/shared obligations and the unresolved selector consumer-provenance gate remain. Reauthenticate notes against the accepted preceding wave before implementation; the future full wave retains its normal final verifier.

A broad Git declaration search produced truncated output and was narrowed to the relevant shared header and sibling file. One initial package print was truncated; exact selected rows were subsequently parsed into evidence. No authentication failed. No candidate, source spelling, compiler/link/build/verifier/source-policy, production/tool/config edit, runtime/GUI/bridge/database/capture, external-source access, agent or Git mutation occurred. Only the fresh claim, report and ignored root were written. W8 production ownership and held Resolver/frozen records were preserved.

All commands have completed. Direct collaboration handoff goes to /root; all assigned writes are released at terminal handoff.
