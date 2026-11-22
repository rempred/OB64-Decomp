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

Trace the eight wrappers that feed `func_0021CBC4` before changing the dispatcher's definition. Its six calls through `func_001CA29C` reach the pointer-to-index lookup `func_0020D72C` on the identified descriptor-10 load path. The lookup compares its input with up to 20 record addresses. Its 27 named C calls span 13 files. Four absolute-address calls still need load-context evidence. Two table words at ROM `0xDC78C` and `0xDC790` have the address of the `func_0021D2F8` wrapper in a different loaded region. Establish what they select before attributing a dynamic caller. The Director owns scheduling this family against the remaining ranked work.

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
| Battle dispatcher wrappers | 91 | 21 | Trace all eight wrappers into `func_0021CBC4` and its record-index call. At the wrappers, distinguish record pointers, output pointers, full-width masks and zero-filled argument slots. Preserve overlay uncertainty for unproved absolute calls and table entries. |
| Battle coordinate result | 24 | 12 | The wrapper `func_001FF7EC` currently declares a void result. Battle callers convert a floating-point return to a coordinate word. Follow the result register from `func_001FF5EC` through the wrapper to those conversions, preserving its two coordinates and three forwarded globals. |

The five record accessors account for 85 findings. Ten belong to the battle lead because `func_0022BFF8.c` and `func_0022C78C.c` also call the dispatcher wrappers. The record lead supplies the two supported declarations, and the battle lead makes both sets of edits to those complete files. The four disputed wrappers account for the other 81 battle findings. Together the three assignments cover 190 distinct findings. The record lead also owns the four wrapper declarations and the record-index declaration in its existing `func_00230A9C.c`. Its callers pass object pointers or null.

The battle lead adds five complete callers. At its named wrapper calls, `func_0022D14C` passes record pointers and, for command `0x16`, addresses of three local arrays. `func_002317C8` passes an allocated object. The other three, `func_00223874`, `func_0022390C` and `func_0022472C`, call `D_801D9FBC` from the same loaded region as `func_0021D28C`. Preserve that spelling and the generic overlay limitation. Trace commands `0x16` and `0x17` separately because the dispatcher reads arrays on one path and uses scalar bytes on the other.

The coordinate wrapper forwards the floating-point result from the original assembly routine at ROM `0x1FF5EC`. Two further callers already declare the address alias `func_001BC35C` with a float return. `func_0020CBDC` converts the result to an integer, while `func_002A0B14` stores it as a float. Both are unchanged verification cases. Their different load contexts remain part of the overlay evidence.

## Matching and acceptance

1. The Director ranks the findings in the latest accepted report and selects the highest remaining dependency-ready providers. The integrator prepares verified inputs and guarded preflights for the complete memberships. The Director confirms each worker is running with its own private root and tested native message and stop routes. [Private candidate workflow](../WORKFLOW.md#private-candidate-workers)
2. Trace the arguments and return value through retail callers and the actual provider. Confirm aliases from the linked ELF and overlay context. Give extra attention to values forwarded in registers, signed or narrow arguments, aggregates and callbacks. The P02 attack-presentation example demonstrates why a narrow load in a provider alone cannot establish the return declaration in its callers. [Matching examples](../research/how-matching-works-20261117.md) Â· [Audio corrections](c-interface-verification.md#accepted-audio-corrections)
3. Compare focused objects, bytes, bindings and relocations on the pinned tools. Test meaningful register or behavior differences where byte equality cannot distinguish source contracts. Preserve each existing source class and contributor attribution. A cast, old-style declaration, lost analysis coverage or suppression does not demonstrate that caller and callee now agree.
4. The integrator checks the complete active corpus for new conflicts and coverage changes, reconciles removed debt with actual verified inputs and runs the normal complete-wave target and retail gates. Use the documented independent review and applicable audit for baseline maintenance. Keep candidate checks private and avoid full-ROM builds per function. [Interface verification](../WORKFLOW.md#c-interface-consistency-at-the-complete-wave-boundary) Â· [Structural audit](../AUDIT.md)
5. Re-rank after acceptance. The next assignments go to the highest remaining counts that can proceed without a conflicting source or shared-header edit. Close only on verified repairs and a full retail match. An unresolved definite finding stays open with the retail evidence, owner and next experiment.

The separate coverage inventory includes unparsed inputs, unknown callees and unsupported types. Keep those limitations explicit. For the three legacy channel-word calls from `func_00283564`, verify the runtime owner and actual argument type before changing either side. Investigate a demonstrated mismatch uncovered during a wave even if it falls outside the definite finding list.

## Local work records

The generated roster under `build/interface-cleanup-261121/accepted-roster.json` records the merged report hash, linked identities, complete finding IDs and opening caller ownership. `opening-free.json`, `opening-dc80.json` and `opening-alloc.json` in the same directory map those owned producers to their accepted target symbols. Later waves use the accepted report for their revision. The tracked baseline and ranking command above also work in a contributor checkout.
