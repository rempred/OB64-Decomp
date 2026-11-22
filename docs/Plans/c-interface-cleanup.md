# C interface cleanup

## Scope

Resolve the definite disagreements in the accepted C interface report, starting with the functions responsible for the most findings. PR #3 merged at `fa42b5e8` with 3,370 findings across 313 linked function entries. The opening roster uses that accepted revision. Regenerate the order after each accepted batch from the current report. [Merged baseline](https://github.com/rempred/OB64-Decomp/blob/fa42b5e8465332ffd9731acbfd37c3fbdf3791cc/config/c-interface-baseline.json) Â· [Verification workflow](../WORKFLOW.md#c-interface-consistency-at-the-complete-wave-boundary)

Group findings by linked section and entry address. This distinguishes overlays that use the same RAM address and joins aliases for the same actual entry. Count every distinct finding ID once. Inspect declarations and callback uses as well as direct calls. A caller-file count is a measure of the edit surface. One file can contain multiple calls or accepted targets. From the repository root, PowerShell can reproduce the current ranking.

```powershell
$baseline = Get-Content -Raw config/c-interface-baseline.json | ConvertFrom-Json
$baseline.findings |
    Group-Object { '{0}/{1}' -f $_.linkedIdentity.section, $_.linkedIdentity.value } |
    Sort-Object @{ Expression = 'Count'; Descending = $true }, Name |
    Select-Object Count, @{ Name = 'Function'; Expression = { $_.Group[0].definition.name } }, Name
```

## Opening work

Three Sol 6.2 Extra High workers own private candidates. The dedicated integrator owns production sources, shared headers, configuration and canonical verification. The Director owns dispatch and acceptance. The first three providers account for 1,073 findings in the merged report.

| Lead | Function | Findings | Calling files with findings | First experiment |
| --- | --- | ---: | ---: | --- |
| Sol 1 | `resource_free` | 716 | 169 | Compare a consumer of the return value with a caller that discards it. Trace the null path and pointer representation through the real provider and its aliases before choosing a common declaration. |
| Sol 2 | `func_00262830` | 199 | 54 | The provider stores a halfword. Compare word-sized and narrow parameters at real callers with high bits set, looking for extension instructions and any observable change in the value consumed. |
| Sol 3 | `resource_alloc` | 158 | 68 | Trace the size word and returned pointer. Examine the argument-count disagreement first, then check alignment, zero-size behavior and use of the result before correcting the repeated declarations. |

Thirty calling files have findings in two of these groups. For the opening assignments, reserve each provider for its lead, assign single-interface calling files to that lead, and assign shared files once across eligible workers. The merged opening roster assigns 140 producer files to Sol 1, 55 to Sol 2 and 69 to Sol 3. Together they contain 290 accepted target symbols. Each shared-file owner applies the evidence-backed declarations for all opening interfaces in its file. Check any additional caller, callback or header impact before changing a provider. When that reveals a shared dependency, agree its scope and give it one owner. Integrate coupled changes together before marking an interface complete.

Opening preparation is tracked per physical source file on the verified main checkout. If the private workbench rejects a representation, retain every entry in that file together and record it in its original worker's membership. Continue preparation for unrelated files. The integrator can check an accepted compilation group through the documented whole-group linked diff. A missing or ambiguous original owner needs a cross-check against the accepted ELF and owner rows before a source edit. A stopped batch does not classify the files it never reached. The source leads can investigate argument and return behavior while preparation runs. [Workbench group support](../MATCHING_WORKBENCH.md#setup)

## Round 2

The [accepted opening commit](https://github.com/rempred/OB64-Decomp/commit/0193ad299e565e9828920e5c70828ce707e40b08) cleared all 1,073 assigned findings and reproduced the retail ROM. The canonical report at that commit has 2,297 remaining findings across 310 linked function entries. The three highest-ranked providers have disjoint source assignments.

| Source lead | Provider | Findings at the opening commit | Initially assigned files | First comparison |
| --- | --- | ---: | ---: | --- |
| ROM transfer | `func_0002de50` | 103 | 19 | Trace the ROM address, destination and byte count through a small transfer and a direct transfer. Check how callers use the return register. |
| Resource loading | `func_0002dfb8` | 77 | 27 | Trace a boot materializer through the cached and uncached paths. Check the input buffer, resource key and returned pointer. |
| Node construction | `func_00051eb0` | 77 | 7 | Follow the callback and stack arguments through the constructor and `func_00051f74`. Check where coordinates are widened or narrowed. |

The ROM-transfer source also declares the lower-level DMA routine with a different destination type. Correcting that declaration covers three additional findings in the same file. The node lead owns two further constructor callers and seven callback implementations. The dispatcher passes the panel pointer and zero to the callback at offset +8. It passes one to a separate callback at +0x10 when that slot is populated. The existing cutscene-panel declaration is a comparison for the proposed shared type. These additions bring the round to 62 distinct source files and 260 known findings. The broader callback checks also cover interfaces that the scanner could not classify.

The integrator checks other callers of the same physical functions, including aliases, for any additional source or shared-header impact. Refresh priorities from the accepted report after each completed group.

## Round 3

[Round 2 acceptance](https://github.com/rempred/OB64-Decomp/commit/4b403910b76f1297113d65fee01f28199f7a03ff) cleared all 260 assigned findings with an exact retail ROM. The accepted report has 2,037 remaining findings across 307 linked entries. The first three providers own 40 distinct source files. The integrator also checks callers without findings for changes needed by the chosen declarations.

| Source lead | Provider | Findings at Round 2 acceptance | Initially assigned files | First comparison |
| --- | --- | ---: | ---: | --- |
| Boot decompression | `boot_lzss_decompress` | 63 | 17 | Trace the compressed input and writable output separately. Compare a caller that uses the decoded length with one that discards it. Preserve the local helpers in the same compiled section. |
| Encoded item updates | `func_00130E60` | 56 | 6 | Trace both inputs from real callers and compare the two paths selected by bit 15 of the item code. |
| Battle record lookup | `func_0020C478` | 53 | 17 | Follow an out-of-range index, an empty slot and a populated slot from the lookup into its callers. Check how they use the returned pointer. |

The boot decompression lead also owns 15 callers of the helper that reads the decompressed size. Both `func_0000ABE0` and `func_8007A7E0` reach the same 44-byte resident routine. All 15 callers are already in the 17-file assignment. Compare each caller's use of the unsigned size, including signed tests of its high bit.

The lookup lead also owns `func_00231CC0`, `func_00232280`, `func_00232D7C`, `func_002ACA3C` and `func_0020C050`. Their eight named calls reach `func_0020C478`. The five callers declare a specific structure pointer as the return type where the provider declares `void *`. Preserve how each caller uses the returned record. These eight calls and the 15 size-reader calls fall outside the original definite findings.

Three further callers use the address `D_801C8FE8`, shared by three executable overlays or loaded regions. Two enter the lookup assignment on the strength of specific retail paths. `func_002340EC` calls the lookup in its battle-record loop. The descriptor-10 dispatcher calls `func_0023B24C` through callback slot `+0x0C` in the table installed by the loader. Preserve both calls' symbol spelling and the generic overlay coverage limitation. These two contextual callers bring the initial lookup submission to 24 files. In the third caller, `func_00237D5C`, the lookup requires an index below 20. All four identified direct incoming calls pass an index of at least 20. A path reaching the low-index branch in the relevant overlay would establish the missing evidence.

In `func_0021824C`, the lookup result goes to two more functions. The call to `func_0020BFF8` accounts for two existing definite findings beyond the initial 172. The next call to `func_0020C24C` passes the same record. Its caller declares an integer argument, while its provider reads a field through a pointer. The revised caller passes the record pointer directly to both functions. The revised `func_0020C24C` accepts the pointer, checks for null and reads the same field through its local battle-record type. This provider is the 25th lookup source file. Focused checks reproduced all 396 caller bytes and 56 provider bytes. All five calls remained visible and nine prior coverage gaps cleared in the focused analysis. The integrator verifies those results against the complete corpus.

In `func_002A2718`, the two calls at ROM `0x2A27A4` and `0x2A27CC` reach the same resident allocator, `resource_alloc_tree_scan(u32 requested)`. The caller declares a signed size. One declaration finding and two call findings trace to that mismatch. The decompression lead owns the unsigned prototype and direct passage of the size-reader result to the second allocation. The integrator verifies both calls and the complete 588-byte caller.

## Round 4

[Round 3 acceptance](https://github.com/rempred/OB64-Decomp/commit/e537aae38cb3f8b56f50705ec87553008e50ec17) cleared all 177 assigned conflicts with an exact US Rev 0 ROM. The accepted report contains 1,860 remaining conflicts across 304 linked entries. The next three providers account for 138 conflicts. The initial assignments covered 31 complete source files.

| Source lead | Provider | Findings against provider | Owned files | First comparison |
| --- | --- | ---: | ---: | --- |
| Resource header word | `func_0002def4` | 51 | 16 | Trace a cache hit and a miss. Check how callers pass the archive key and use the 32-bit header value, including the allocation in `func_002A2718`. |
| Random number return | `func_0002CBCC` | 49 | 6 | Compare signed and unsigned uses of the random result. Preserve the existing hybrid provider and its volatile stores. |
| Battle call arguments | `func_0021D230` | 38 | 9 | Follow all four incoming values into the nine-argument call. Check the zero stack arguments and whether callers consume a return value. |

Two providers tied at 38 findings. The battle wrapper shares one source file with the first two families. The resource loader `func_0002e138` shares two. The battle lead owns the complete shared `func_0022B1F4.c`, including four random-number findings and seven battle-wrapper findings. This assigns 51, 45 and 42 finding records to the three leads respectively. The integrator checks the two interfaces together in that file.

The battle wrapper also receives a record pointer in callers outside its definite findings. The RNG lead owns the wrapper updates in the already assigned `func_0022F580`, `func_00230A9C`, `func_00232458` and `func_0022D14C`. The battle lead adds `func_002317C8` along with `func_00223874`, `func_00223978` and `func_002239D8`, which use the absolute symbol `D_801D9F60`. All three load with the wrapper in the same ROM region and pass an object pointer as the third argument. Preserve the symbol in those callers. This brings the assigned source count to 35. At its call to `func_0021CBC4`, the wrapper accepts a record pointer and converts it to the 32-bit word declared by the current dispatcher. Its local declaration preserves the `func_801D98F4` name and the three pointer parameters in positions 5 through 7. The wrapper passes null for each of those parameters.

The header reader also calls the resident DMA routine `func_0001A380` at ROM `0x2DF60`. Its destination is already a byte pointer. Aligning the local declaration with the provider fixes two more recorded conflicts in the same file, bringing Round 4 to 140.

### Battle dispatcher follow-up

Trace the eight wrappers that feed `func_0021CBC4` before changing the dispatcher's definition. Its six calls through `func_001CA29C` reach the pointer-to-index lookup `func_0020D72C` on the identified descriptor-10 load path. The lookup compares its input with up to 20 record addresses. Its 27 named C calls span 13 files. Round 7 traced four calls through `D_801CA29C` to descriptor 10 on specific battle paths. Other overlay contexts retain their coverage limits. Round 7 resolved the two table words at ROM `0xDC78C` and `0xDC790`. The six-way switch in `func_000c6678` reads both entries from its own loaded region. Cases 1 and 2 branch to ROM `0xC6A88` inside the switch reader. The dispatcher wrapper `func_0021D2F8` occupies that address when a different region is loaded. [Round 7 assignment](#round-7)

## Round 5

[Round 4 acceptance](https://github.com/rempred/OB64-Decomp/commit/a54ea775b1750683034b30372ef7472f29fea83c) cleared 140 findings with an exact retail ROM. The accepted scan has 1,720 remaining across 301 linked entries. The three highest-ranked functions have disjoint assignments spanning 35 complete source files.

| Source lead | Provider | Findings against provider | Assigned files | First comparison |
| --- | --- | ---: | ---: | --- |
| Resource decoding | `func_0002e138` | 38 | 11 | Follow the archive key and returned decoded pointer through a caller. Check how the caller uses that pointer after the temporary buffer is freed. |
| Audio heap allocation | `bump_alloc` | 35 | 7 | Trace the heap, allocation count and element size through an exact fit and a failed allocation. Check declarations at the expanded audio library call sites. |
| Battle callback arguments | `func_0020BDCC` | 32 | 17 | Trace the argument from a retail caller into the optional callback at offset +0x10. Identify the installed callback and compare what happens when the slot is empty. |

The resource decoder contains an inline header reader with two further findings about the destination argument of `func_0001A380`. Its worker owns both, bringing the round to 107 distinct findings. The original seven heap files produce 15 accepted targets. The heap lead also owns the complete audio driver in `src/lib/audio_driver_0001c9f0.c`. Ten calls in that file reach the resident allocator, and its declaration uses an opaque pointer where the provider declares a heap pointer. Verify all eight driver entries together and preserve their own incoming interfaces. These ten calls were outside the definite findings.

Seven further files share the battle callback table. Four descriptor-10 routines repeat its declaration. One of them, `func_0020BCE0`, sets the root to `&D_801CFC74`. Two other routines publish different tables, and `func_0020BD8C` reads the slot at +0x0C through the literal root address. The callback lead owns these complete sources and proposes the common declaration. The integrator checks both the original symbol bindings and the literal address. On two identified load paths, the callback at +0x10 consumes a second argument. Check those paths individually and preserve the other four slots. The heap initializer, getter and their two callers add four more files. The initializer and allocator access the fields of the same heap object that the getter returns. Use one compatible layout for these accesses and check the getter's declaration in its caller. Preserve how the audio configuration passes the object on. Round 5 now covers 47 distinct source files and 107 recorded findings.

## Round 6

[Round 5 acceptance](https://github.com/rempred/OB64-Decomp/commit/39f09624b0410b6e548607d6c58da94f8306b52f) cleared 107 findings with an exact retail ROM. The accepted scan has 1,613 findings across 298 linked function entries. The five largest counts are 31, 30, 28, 27 and 27. Three leads cover all five with disjoint ownership of 33 complete source files.

| Source lead | Functions and findings against each | Owned findings | Assigned files | First comparison |
| --- | --- | ---: | ---: | --- |
| Equipment lookup | `func_00041638` (31), `func_000415fc` (28) | 59 | 16 | Trace the key into both equipment tables. Compare a caller that uses the returned index with one that checks the `0x1FF` miss value. Three shop files call both functions. |
| Sound request dispatch | `func_00208DC8` (30), `func_0015DF10` (27) | 37 | 9 | Follow the match and default paths, check the argument that reaches each service and preserve the hybrid selector's jumps and delay slots. |
| Battle callback at +0x08 | `func_0020BD5C` (27), plus sound calls in two shared files | 47 | 8 | Trace the function installed in the third callback slot in each supported load context. Compare callers with different argument and return declarations and preserve the verified +0x10 slot. |

The battle lead owns the complete `func_00215CF0.c` and `func_0021B894.c`, including 20 findings against the sound services. The sound lead supplies the verified declaration through the Director so both interfaces can be corrected together. This assigns the initial 143 findings exactly once.

Two additional findings are in the sound selector itself. Both its match and default paths reach the same resident sound call with a channel address and the saved selector word. The sound worker checks the declaration and explicit forwarding in that file. Its existing hybrid assembly and both symbol spellings supply the comparison.

The battle callback at +0x08 receives a full-word selector on the loaded battle path. One installed routine uses it to select among 13 cases; the cold-boot implementation returns immediately. The callback worker owns the cold stub in `func_0023B244.c` and proposes the common slot declaration. The integrator verifies all eight consumers of `battle_callbacks.h`, including the seven outside the original source assignments. Both startup capsule masks (`0x38C` and `0x4038C`) load descriptors 3, 7 and 9. Descriptor 7 installs the upper shop code and selects mode `0x24`. With those overlays resident, the handler `func_0019B710` calls the descriptor-9 sound selector with request 2. Its corrected declaration preserves the absolute symbol `func_8020CDA0` and the existing overlay coverage limit. The 14 absolute calls in `func_001A9290` need separate evidence for mode 0x16. The round covers 145 definite findings and 42 files including the supplemental shop caller and seven header consumers.

The [accepted Round 6 commit](https://github.com/rempred/OB64-Decomp/commit/be135a0ec17a5a4e7796fd651622014753ee5400) cleared all 145 assigned findings. The canonical verifier reproduced the retail ROM, linked ELF, all 2,650 existing target contracts and the reviewed census. The shop diagnostic matched all 240 bytes and seven relocations before its scratch retention step failed. Independent review verified the saved inputs, objects and linked images directly. The canonical build then checked that caller with the complete set. The 14 absolute sound calls in mode 0x16 retain their overlay coverage limitation.

## Round 7

The accepted Round 6 scan has 1,468 definite findings across 293 linked entries. The three highest counts are 26 for `func_000454c8`, 25 for `func_0021D200` and 24 for `func_001FF7EC`. The complete assignments include the related record accessors and the [battle dispatcher follow-up](#battle-dispatcher-follow-up).

| Source lead | Owned findings | Complete files | First comparison |
| --- | ---: | ---: | --- |
| Record table lookups | 75 | 21 | Compare calls to `func_000454c8` and `func_000454e0` in the shop. The five accessors share a 16-bit index and a 32-byte stride. Check the consumers of each return, including the word read in `func_000454b0` and the alternate byte used by `func_000454e0`. |
| Battle dispatcher wrappers | 91 | 21 | Trace all eight wrappers into `func_0021CBC4` and its record-index call. At the wrappers, distinguish record pointers, output pointers, full-width masks and zero-filled argument slots. Preserve overlay uncertainty for unproved absolute calls. |
| Battle coordinate result | 24 | 12 | The wrapper `func_001FF7EC` currently declares a void result. Battle callers convert a floating-point return to a coordinate word. Follow the result register from `func_001FF5EC` through the wrapper to those conversions, preserving its two coordinates and three forwarded globals. |

The five record accessors account for 85 findings. Ten belong to the battle lead because `func_0022BFF8.c` and `func_0022C78C.c` also call the dispatcher wrappers. The record lead supplies the two supported declarations, and the battle lead makes both sets of edits to those complete files. The four disputed wrappers account for the other 81 battle findings. Together the three assignments cover 190 distinct findings. The record lead also owns the four wrapper declarations and the record-index declaration in its existing `func_00230A9C.c`. Its callers pass object pointers or null.

The battle lead adds five complete callers. At its named wrapper calls, `func_0022D14C` passes record pointers and, for command `0x16`, addresses of three local arrays. `func_002317C8` passes an allocated object. The other three, `func_00223874`, `func_0022390C` and `func_0022472C`, call `D_801D9FBC` from the same loaded region as `func_0021D28C`. Preserve that spelling and the generic overlay limitation. Trace commands `0x16` and `0x17` separately because the dispatcher reads arrays on one path and uses scalar bytes on the other.

The first full `func_0022BFF8` comparison put a byte mask at ROM `0x22C18C` when both accessors declared byte returns. Retail copies the full result there and applies a byte mask at `0x22C250`. Both providers and the two complete battle callers matched with signed word returns. In `func_000454e0` the original byte local preserves the comparison mask and the alternate load. The accessor returns the selected byte in a full word. Two additional record-owned controls, `func_00044370` and `func_0004440c`, use an explicit mask and a byte local respectively. The byte local in `func_0022B1F4` also preserves the original mask with the word return.

Four additional battle files call the record-index lookup through `D_801CA29C`. The descriptor-10 guard reaches `func_002340EC`, and the alternate arms of the same guard reach `func_00233F94`. On the traced paths through `func_00233ED4` and `func_00233F38`, the caller tests the returned index and immediately passes a nonnegative index to the named descriptor-10 lookup. These four complete files retain the absolute spelling and unresolved coverage for other load contexts.

The coordinate wrapper forwards the floating-point result from the original assembly routine at ROM `0x1FF5EC`. Two further callers already declare the address alias `func_001BC35C` with a float return. `func_0020CBDC` converts the result to an integer, while `func_002A0B14` stores it as a float. Both are unchanged verification cases. Their different load contexts remain part of the overlay evidence.

### Resident string append follow-up

The changed array index in `func_001994B4` sits inside an existing call to `func_8009C620`. That outer call still reaches the original assembly owner `strcat_0002ca20`. Its 80-byte section begins at ROM `0x2CA20`, VRAM `0x8009C620`, and its return delay slot copies the destination pointer into `v0`. The shop declares the parameters as two `void *` values. `func_00296754` declares a byte pointer and a pointer to const bytes. Both ignore the return value. The Round 8 random-result lead owns both callers. The integrator checks other spellings and return uses. The boot C implementation of `strcat` has its own entry at ROM `0xF808`. Round 7 retains the outer call and its existing assembly-provider coverage limit.

### Resident string copy follow-up

Six C files declare the resident copy routine through `func_0002C950` or `func_8009C550`. Their declarations disagree on the pointer types and return value. Nine named linked transfers reach the same 64-byte assembly owner at ROM `0x2C950`, VRAM `0x8009C550`. It reads and writes bytes, writes a terminating zero, and returns the original destination in `v0`. A sweep of the accepted executable sections found 53 direct transfers in total. The Round 9 dispatch lead owns the six callers for review, including the shop and panel callers that also use string append. Check how the remaining direct callers consume the result before choosing a common declaration. [Original assembly](../../asm/original/rev0/lib/strcpy_0002c950.s)

## Round 8

[Round 7 acceptance](https://github.com/rempred/OB64-Decomp/commit/56f081e010a58e71300845b78c01f2b3fafb2a30) removed exactly 190 findings and left 1,278 across 283 linked entries. The full US Rev 0 ROM and linked ELF matched their accepted hashes. The three highest remaining entries account for 66 findings.

| Source lead | Provider | Findings against provider | Complete files | First comparison |
| --- | --- | ---: | ---: | --- |
| Combat record selector | `func_001F0E64` | 23 | 6 | Follow the incoming selector through the low-byte sentinel test and the full-word zero test. Compare inputs 0 and 0x100 with the random-selection flag set. |
| Five-value priority lookup | `func_00040f88` | 22 | 6 | Trace the fifth argument through its stack slot at the named caller and the `func_0016B088` alias. Check where a byte conversion affects the instructions. |
| Random word result | `func_00022e60` | 21 | 6 | Trace the logical right shift into the returned word. Compare the signed remainder instructions used by actual callers under alternate declarations. |

The selector lead owns the complete `func_0022B1F4`, `func_0022F580` and `func_00230A9C` sources, which also contain six of the random-result findings. This gives the three leads 29, 22 and 15 assigned finding IDs respectively. The random-result lead supplies the grounded declaration and any caller conversions needed in those three files. The existing `rand()` called by the combat selector is a separate provider.

The random-result lead also checks both callers of the [resident string append routine](#resident-string-append-follow-up) in a separate packet. Their declaration difference first appeared in coverage review and adds no definite findings to the opening count.

The selector lead also owns three complete callers found by the linked scan. Six named calls in `func_0022257C`, `func_0022C78C` and `func_001FFE80` reach the same selector. The first two pass local copies of 0x50 bytes. The third passes the record region starting at +0x44 within an enclosing object. The selector lead will use the provider's tagged 0x4C-byte record and full unsigned selector in one shared declaration. The accepted layout in `func_002215D0` puts that record at +0x44 with four bytes remaining before +0x94. In `func_001FFE80`, the code also reads the frame and offset as signed halfwords and restores fields at +0x50, +0x52 and +0x54. Check these uses and the entire 0x50-byte copies with the proposed header installed. The seven callers that already declare the compatible tag serve as controls. These callers under repair and the two string append callers bring the round to 23 complete files.

### Paired battle evaluator

The same copied bytes subsequently reach `func_001F197C`, which uses a distinct 0x48-byte state view. The accepted Round 7 census has 16 named calls across six files, including six definite findings in `func_0022B1F4`. Other callers have unsupported aggregate declarations. The first selector draft changed how five evaluator calls identified the same existing conflict. All five affected caller files already belong to the selector lead, and `func_0021EBBC` supplies the sixth, compatible caller. The selector lead now owns the complete evaluator provider and its callers' declarations in this round. The combined assignment covers 72 definite findings and 24 complete sources. `func_0021EBBC` remains a verification control and shows how both typed views fit in the 0x50-byte copy. Compare the evaluator's 0x48-byte state, its signed field accesses, its output array and sentinel, and its scalar return. The accepted objects contain 16 named transfers. The same address appears in other executable regions, so additional assembly calls require load-context evidence.

The pinned compiler distinguishes two source forms of the final copy loop in `func_00230A9C`. With the cursor reset after the copy, the state-address load occupies the branch delay slot at ROM `0x2315F0`. Removing the reset moves that instruction past the branch even though all 87 relocations still match. The integrator compares the retained reset against the complete 3,372-byte producer.

### Related 0x50-byte state

`func_001F1218` uses a third state view. A word load at ROM `0x1F12AC` reads the pointer at state offset +0x4C, just beyond the embedded selector. The second call from `func_001FFE80` is at ROM `0x1FFFF8`. Its delay slot adds +0x44 to the enclosing record address, so the callee's pointer field is at +0x90. The independent flags word follows at +0x94. Round 8 keeps the wider routine's boundary explicit at this call. The Round 9 lookup lead owns its declaration and storage repair, including the +0x14 call in the same file and three further calls in `func_001F114C`. The current analysis retains five incomplete calls and two unsupported declarations for that interface.

## Round 9

[Round 8](https://github.com/rempred/OB64-Decomp/commit/9746f2637fd6cb00e74bfddeefb3798ae4e5c580) cleared exactly 72 assigned findings and left 1,206 across 279 linked entries. All 2,650 targets and the complete US Rev 0 ROM matched. The three highest remaining entries account for 55 findings in 16 disjoint source files.

| Source lead | Provider | Findings | Complete files | First comparison |
| --- | --- | ---: | ---: | --- |
| Battle position lookup | `func_0020D770` | 20 | 4 | Trace the unsigned lane, signed row and nullable record pointer in the three battle callers. Compare a negative row, an out-of-range lane and a successful lookup. |
| Framebuffer list setup | `func_00019eb0` | 18 | 7 | Trace the pointer array and full count into the loop, then the byte conversion at the setter. Compare callers supplying equal and distinct adjacent buffers. |
| Fifty-entry dispatch | `func_00131050` | 17 | 5 | Check each caller for incoming arguments and use of the return register. Follow the final call to D_801B2B78 through loop exit to distinguish a declared result from a value left in the register. |

The battle lead also owns `func_00238798`. In the loaded battle region, `func_0022D14C` calls `func_00238D94`, which reaches this caller. Its six source calls to `D_801CA2E0` compile into three jumps, each followed by a call to the same predicate used by `func_0022A4E0`. On the path from `func_0022F2BC`, the game calls the named descriptor-10 predicate before dispatching to `func_0022D14C`. The team and lane checks then lead to `func_00238798`, which passes each lookup result to that same predicate. This supports the descriptor-10 declaration for this caller. Other overlays share the numeric address, so the source keeps its alias and the scanner retains the unresolved records.

The framebuffer lead also owns `set_byte_800f918d`. Two calls and one declaration in the setup routine disagree with the setter on the signedness of its byte parameter. Retail masks the dynamic count to eight bits at ROM `0x19EF4` and passes the literal one at `0x19F44`. Compare the two declarations in the full caller and verify the 12-byte setter. These three findings bring the round to 58. The integrator checks the complete 264-byte setup routine, its eight alignment bytes and 22 relocations.

Three consumers compare the current framebuffer pointer, `D_800C4BB8`, against entries in the three-pointer array `D_800A8204`. The framebuffer lead also owns `func_00049918`, which loads that same pointer at ROM `0x49960` as the source for `bcopy`. Its local eight-byte function stays in the 180-byte owner. In descriptor 15, verify the two aligned framebuffer slots and the two raw allocation slots as separate arrays. Preserve the explicit names for the second slots used by the other setup and release routines. This storage repair adds one source file and no definite findings.

The lookup lead also owns the complete `func_001F1218`, `func_001F114C` and `func_001FFE80` sources. The two callers supply the wider state in five places. Check the pointer field at state +0x4C at each enclosing-object offset, preserving the smaller views used by the selector and evaluator. The dispatch lead owns all six C files making the nine named calls to the resident string copy routine. Preserve its original assembly owner and both call spellings, and check which callers use the returned destination. These nine related files add no definite IDs to the opening count. [Battle state evidence](#related-0x50-byte-state) · [Resident string copy evidence](#resident-string-copy-follow-up)

## Round 10

[Round 9](https://github.com/rempred/OB64-Decomp/commit/982b976d951d41404d9e24bd59f4d022fc8dc460) removed exactly its 58 assigned findings. The canonical scan has 1,148 remaining across 275 linked entries. All 2,650 targets and the complete retail ROM matched. The opening Round 10 assignments cover 47 distinct findings in 14 source files. Five entries tied at 15. The boot archive stream comes first in linked-section order.

| Source lead | Provider | Findings | Complete files | First comparison |
| --- | --- | ---: | ---: | --- |
| Resource arena allocation | `resource_alloc_tree_scan` | 16 | 6 | Follow the unsigned request through 16-byte alignment, the zero-size exit and the returned payload address. Check size arithmetic and pointer use in a caller of the resident address alias. |
| Battle record flag | `func_0020BFF8` | 16 | 4 | Follow the supplied record pointer through the null check and the bit test on the word at +0x40. Compare how the actual callers pass the pointer and consume the zero-or-one result. |
| Boot archive stream | `boot_io_open_stream` | 15 | 4 | Trace the four arguments and the returned slot through the three archive callers. Compare read mode with the other mode path and check the result when each slot is occupied. |

The allocator has 23 named transfers across 13 caller files. The file-level analysis also counts a call inside the allocator to its local tree-search helper. For the battle flag, 48 transfers use the provider name and three use the address alias. Check compatible declarations, address aliases and aggregate types in the remaining callers before changing a provider. The three archive callers share four named transfers to `func_0000F4E4`. Trace its two stream objects into the code that consumes the returned handles before selecting a shared declaration.

The battle lead also owns nine complete source files that declare the flag query with a pointer to a local record type. Together they emit ten calls to the named entry. Three descriptor-10 files reproduce the bit test inline and declare that definition with external linkage. Check the external parameter type and local record access in each producer, then confirm the compiler still emits the test inline.

The battle lead also owns `func_002248B0`, `func_0023422C` and `func_00239AA4`. In the battle loader, the call at ROM `0x4E5F8` enters descriptor 10. Both subsequent DMA transfers load above the flag query. On one record path, `func_0022D14C` calls `func_0023422C`, which queries the flag and forwards the same record to `func_002248B0`. On another, the record scans in `func_0022A280` and `func_0022A964` lead to `func_00239AA4`, which branches on the flag result. Each caller keeps the `D_801C8B68` spelling and its generic overlay limitation. Two other regions have interior code at the same address.

The archive decoder and the adapted LHa copy routine share four calls to `boot_io_fread`. The copy and CRC routines each call `boot_io_fwrite`. Those six calls account for 12 read and 10 write findings. The stream lead owns these five additional producers and the associated declarations in the two LHa adaptation headers. The integrator checks every compiled header consumer. The round now covers 69 definite findings across 34 assigned source files.

The stream fields observed in both slots end with the signed position at offset `0x10`. The next word in the write slot, at `0x800AF36C`, holds the separate `infile` pointer. Preserve that boundary and the result alias at `0x800AF360`, which reads the buffer pointer and size. The decoder clears a `0x12C`-byte record in each caller's aligned `0x130`-byte storage. Check both extents and the original comparisons of read and write results.

Round 10 cleared 69 conflicts and retained the existing boot string comparison mismatch. One canonical build verified the complete ROM and all 2,650 target contracts. The archive writer had initially grown from 104 to 108 bytes and shifted its 8-byte local function. Testing both stream layouts with each source-pointer type isolated the difference to the pointer qualifier. The accepted writer keeps a const input parameter and reads through a local cursor. Its object reproduces both original functions. [Accepted archive writer](https://github.com/rempred/OB64-Decomp/blob/373d60c8130bf232bab24b0b7668bc5281b2edbf/src/boot/boot_io_fwrite.c)

## Round 11

The accepted Round 10 census has 1,079 definite findings across 270 linked entries. Four entries tied at 15. Linked-section order selects the three below, whose opening rosters cover 45 distinct findings in 14 disjoint source files. [Accepted Round 10 fixes](https://github.com/rempred/OB64-Decomp/commit/373d60c8130bf232bab24b0b7668bc5281b2edbf)

| Lead | Linked entry | Findings | Source files | First comparison |
| --- | --- | ---: | ---: | --- |
| Event message registration | `func_00023d40` | 15 | 6 | Follow the queue and message from `osSetEventMesg` callers into the event table and the conditional pre-NMI send. Check actual queue storage and the full event index across the 19 entries compiled from these files. |
| Class sprite resource lookup | `func_00045ae0` | 15 | 5 | Trace the returned allocation to its consumer and the separate pixel address through the output slot. Compare a real class and variant lookup with the missing-resource path, including the address aliases. |
| Menu cursor state stack | `func_000ae30c` | 15 | 3 | Trace the saved and incoming triples through a menu transition and the restoring consumer. Compare argument widths at the caller and the three halfword stores at the provider. |

The sprite lead also owns the complete panel initializer `func_0028ad2c`, shop display routine `func_0019AB44` and adjacent byte-buffer lookup `func_00291130`. The shop passes the address of `D_8021A134` to the sprite lookup and later loads its contents for display. It separately keeps and frees the returned allocation at `D_8021A130`. Both panel initializers likewise store the pixel pointer at offset zero and the returned allocation at `+0x10`. Check those as distinct objects. The adjacent lookup writes a byte pointer at `+4` and returns a buffer stored at `+8`. Its declaration in `func_0028adf4` accounts for two additional findings. The revised scope is 47 findings in 17 source files.

The pre-NMI path in the event provider passes the registered queue to `osSendMesg`. Check its declaration against the provider's `struct MessageQueue *` parameter. The separate VI setting at ROM `0x241A0` still has two scheduler findings for the ranked backlog.

[Round 11 passed canonical verification](https://github.com/rempred/OB64-Decomp/commit/811c283da57b89c682fa63cfdaed6d9f29f4f968). Its 47 assigned findings cleared, all 2,650 target contracts passed and the rebuilt ROM matched retail byte-for-byte. The menu cursor's existing halfword interface and an alternative with explicit narrowing both reproduced the two tested owners. The accepted change keeps the existing provider interface. The two VI scheduler findings remain in the census.

## Round 12

The accepted Round 11 census has 1,032 definite findings across 266 linked entries. The three assignments below cover 42 distinct findings in 20 complete source files. Two entries tied at 13. The class comparison comes first by linked section order.

| Source lead | Provider | Findings | Complete files | First comparison |
| --- | --- | ---: | ---: | --- |
| Battle record bit test | `func_0020C014` | 15 | 5 | Trace a null record and both states of bit 8 in the word at offset `0x40`. Compare the result tested in `0021840C` with the result forwarded by `001F2F9C`. |
| Script record lookup | `func_001BBFFC` | 14 | 8 | Trace the script operand in descriptor 18 through the full-word index calculation, the `0x76`-byte record stride and the first access through the returned pointer. |
| Class comparison | `func_00045e5c` | 13 | 7 | Compare the return consumed by the equality check in `00048928` with the two branches in `002ABB3C`. Check byte normalization at the input and result independently. |

The battle lead also inspects 33 additional caller files for compatible declarations, inline definitions and address aliases. Establish the active overlay before attributing a raw address to the provider. The script-record lead checks the table symbol against storage used by the script consumers. The class lead checks the `D_8016FF5C` call in `00239AA4` and the code that consumes its return.

The battle lead also owns four callers with eight named transfers and five descriptor-10 sources that define the bit test inline. One of those five, `0020BFA4`, calls the external function at ROM `0x20BFB8` before its inline definition. Preserve that transfer and compare all five emitted objects. Add the declaration beside the positive-bit accessor in `battle_record_flag.h` and check its 13 existing consumers. The `0022B1F4`, `0022BFF8` and `00232458` paths reach three callers of `D_801C8B84`. The fourth, `00238798`, is reached through `0022D14C` and `00238D94`. The fifth, `00239AA4`, stays with the class lead. Two record scans pass it the record at ROM `0x22A318` and `0x22ABD8`, and it branches on the full query result. These paths establish the battle placement. All five address aliases retain their general overlay limitation. The store in `00270BF4` and comparison in `0026F1E0` provide a separate use of the full result word.

The script lead also owns the sibling lookup `001BBFB0`, its three callers and the record update `001BD378`. The sibling clears and returns one record from the same table. All three callers of the update use the lookup result and supply a literal zero or one for the byte written at offset `0x16` within the selected slot. Together these two interfaces contribute 12 more findings. Compare the record layout with the four existing direct table users. The render dispatcher `001BDBBC` passes the record through a callback. Its table at ROM `0x1C30B4` has two null slots, an assembly handler and the C handler `001BD6FC`, which takes a byte pointer. Compare the dispatcher declaration with that C handler and preserve the indirect-call limitation. Round 12 now covers 54 definite findings in 39 complete files.

The class comparison uses the roster byte at `0x80193BC0 + 0x11 + 0x38*i`. The write in `001960A8` and the reads in `00048928` and `00290820` identify a separate storage-typing follow-up. The selector `0020BF98` has two open findings in `00222604`, where its full result is compared with `0xFF` before the class comparison.

[Round 12 passed canonical verification](https://github.com/rempred/OB64-Decomp/commit/9809ee7dc0a3da51f67192de40983fe2997c4440). It cleared all 54 assigned conflicts. The full retail ROM, all 2,650 targets and both battle switch tables matched. The script callback still carries its indirect-call limitation. The class predicate produces zero or one. Its seven compiled caller sites mask the result before use; both a byte return and a word return with explicit caller narrowing reproduced that behavior. The accepted shared declaration uses a byte return.

## Round 13

The accepted Round 12 census has 978 definite findings across 261 linked entries. The next three assignments cover 36 findings in 13 complete source files. Three providers tied at 11 findings. The boot transfer comes first in linked-section order.

| Source lead | Provider | Findings | Complete files | First comparison |
| --- | --- | ---: | ---: | --- |
| Battle art lookup | `func_00201584` | 13 | 4 | Follow the two words at battle-record offsets `0x48` and `0x4C` through the provider's index selection, then check the result consumed by `0022BFF8`. Compare both arms and the caller's byte mask. |
| Item pose lookup | `func_0020156C` | 12 | 5 | Trace the low 16 bits of the item selector and the byte returned from the table through a pose update. Test parameter width and return width separately in the four pose producers. |
| Boot DMA transfer | `func_0001a4f0` | 11 | 4 | Follow the ROM address and destination pointer from the checksum and probe loops into the I/O message. Check how the direction chooses cache handling before submission and completion. |

The neighboring battle and pose lookup functions read separate table pointers at `0x801D0684` and `0x801D0680`. Check the table declarations and their actual read/write paths before sharing a type. The four original files in the boot assignment own 11 compiled target entries. The checksum-chain producer includes eight source fragments. The boot lead also owns `boot_resource_probe_chunk_callback_walk`, which stores the DMA function in a volatile callback field. Its two address relocations at offsets `0x28` and `0x2C` bind the existing alias. Check the indirect call in its mode-one loop and retain the generic indirect-call limitation. This adds one complete source file without adding a counted finding, bringing the round to 14 files.

Both DMA producers pass a 24-byte I/O message to the same EPI entry. The named call at ROM `0x1A404` and the address-alias call at `0x1A574` reach `func_0001c040`. The boot lead also owns the complete `func_0001a380` caller and its two queue-creation findings. Check the signed queue capacity and the actual queue and message member types in both producers. Keep the compatible EPI and queue providers as controls. The boot lead owns changes to the actual included checksum declarations. The four item-pose callers keep their complete `.ob64.r3985` switch contributions in the integrator's linked comparison. The expanded round covers 38 findings in 15 complete source files.

The item-pose lead kept the provider's unsigned-byte result and unsigned-halfword argument. All four width combinations reproduced each of the four complete caller objects, including 336 switch-table bytes. Removing the low-16-bit truncation from the provider eliminated its recorded mask and shortened the function by one instruction. The mask establishes how the provider uses the selector. The exact caller objects allow more than one source declaration.

## Round 14

[Round 13 acceptance](https://github.com/rempred/OB64-Decomp/commit/c9010a6a1df800d253546c8f6945c035ee18690a) removed its 38 assigned findings and reproduced the full retail ROM. The accepted report has 940 remaining findings across 258 linked entries. The three highest-ranked providers account for 32 findings in 14 disjoint translation units.

| Source lead | Provider | Findings | Assigned files | First comparison |
| --- | --- | ---: | ---: | --- |
| Resident memory fill | `func_0002CD70` | 11 | 5 | Follow the descriptor-10 mark reset through the byte stores. Compare the full count, the stored low byte and the original destination returned by the existing hybrid provider. |
| Indexed record lookup | `func_000453e0` | 11 | 4 | Follow a shop selection through the low 16-bit index and 12-byte record stride. Trace the loaded word into its consumer to establish whether the field holds a pointer. |
| Resource arena initialization | `resource_arena_init` | 10 | 5 | Follow the descriptor-15 arena base and size to the aligned endpoints. Compare unaligned inputs and the first node's next pointer and available-byte count. |

## Matching and acceptance

1. The Director ranks the findings in the latest accepted report and selects the highest remaining dependency-ready providers. The integrator prepares verified inputs and guarded preflights for the complete memberships. The Director confirms each worker is running with its own private root and tested native message and stop routes. [Private candidate workflow](../WORKFLOW.md#private-candidate-workers)
2. Trace the arguments and return value through retail callers and the actual provider. Confirm aliases from the linked ELF and overlay context. Give extra attention to values forwarded in registers, signed or narrow arguments, aggregates and callbacks. The P02 attack-presentation example demonstrates why a narrow load in a provider alone cannot establish the return declaration in its callers. [Matching examples](../research/how-matching-works-20261117.md) Â· [Audio corrections](c-interface-verification.md#accepted-audio-corrections)
3. Compare focused objects, bytes, bindings and relocations on the pinned tools. Test meaningful register or behavior differences where byte equality cannot distinguish source contracts. Preserve each existing source class and contributor attribution. A cast, old-style declaration, lost analysis coverage or suppression does not demonstrate that caller and callee now agree.
4. The integrator checks the complete active corpus for new conflicts and coverage changes, reconciles removed debt with actual verified inputs and runs the normal complete-wave target and retail gates. Use the documented independent review and applicable audit for baseline maintenance. Keep candidate checks private and avoid full-ROM builds per function. [Interface verification](../WORKFLOW.md#c-interface-consistency-at-the-complete-wave-boundary) Â· [Structural audit](../AUDIT.md)
5. Re-rank after acceptance. The next assignments go to the highest remaining counts that can proceed without a conflicting source or shared-header edit. Close only on verified repairs and a full retail match. An unresolved definite finding stays open with the retail evidence, owner and next experiment.

The separate coverage inventory includes unparsed inputs, unknown callees and unsupported types. Keep those limitations explicit. For the three legacy channel-word calls from `func_00283564`, verify the runtime owner and actual argument type before changing either side. Investigate a demonstrated mismatch uncovered during a wave even if it falls outside the definite finding list.

## Local work records

The generated roster under `build/interface-cleanup-261121/accepted-roster.json` records the merged report hash, linked identities, complete finding IDs and opening caller ownership. `opening-free.json`, `opening-dc80.json` and `opening-alloc.json` in the same directory map those owned producers to their accepted target symbols. Later waves use the accepted report for their revision. The tracked baseline and ranking command above also work in a contributor checkout.
