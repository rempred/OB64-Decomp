# Guided endpoint search

Completed bounded research; independent research review pending. Worker `/root/db10_allocation_trace`, Astra Medium; Director `/root`; activation `7a156ee1`, launch `COMBAT-7ADC-GUIDED-ENDPOINT-SEARCH-20260907-01`. The fresh permanent claim was atomically created and read back before other writes. Prior evidence remains frozen. All paths below are relative to ignored `build/combat-7adc-guided-endpoint-search-r1/` (R).

Two of four meaningful probe alternatives produce a same-register endpoint decrement after the immediate WIDTH call, followed by shift/mask in that same register and two real packed stores. The result transfers only partially to the complete function: format 1 gains the desired endpoint sequence in `s1`, but row and command-pointer allocation changes too. Common branches still subtract in `v1` before shifting into live `s2`. A format-1-only copy preserves the other branches, remains 3800 bytes with a 368-byte frame, and has 17 native same-offset instruction differences versus the unchanged best's 15. This is a specific research lead with residuals, not a better matching candidate or a complete discriminator success.

## Scope and staged alternatives

The source owner confirmed this class had not been tried and reserved its disjoint production experiments for format-1 scaled-row/masked-row separation. This worker tested only endpoint sum/packed-state separation and placement. SIZE_ROW and all packet effects remained fixed. No existing helper, cast, macro or general-scope failed class was repeated.

The starting probe is the accepted 46-line temporary form, input `F46C6464C62154235BF4926A74B7DA36D0672F420FCA57B777FFC890B0D2DCB0`. Before compilation, the prior 500-file manifest and every listed hash were authenticated against `C9963854662FE0AEFFDA1DEC9B56BB1674678DCC6E1C17A08E454D40BE12615F`. Final checks also authenticate the prior worker report `CA73AFBB9EEC6B0F360365BBE93B23FA66914EFB17B3C6356D46AD2D44E8DD34` and Accepted review `2647D558F61AA60BEEA7D8B3B972DAF15512177FC277C64DB6F79E5CF9E37337`.

`plan.json` and `search.js` preserve the bounded four-form plan and exact transformations. The rationale was to distinguish a call-crossing sum from a shorter-lived packing state, or move the sum's definition after WIDTH while its operands remain local. Stop condition: four probes, then complete controlled-copy retests of promising output only, with a format-1-only retest if a branch-specific lead appears. That bound was reached; no score-driven expansion followed.

| Probe suffix | Meaningful source change around immediate WIDTH | Observed emitted decrement | Desired order |
| --- | --- | --- | --- |
| pre-sum-copy | pre-call `endpointSum = row + strip`; post-call assign live `endField`, then `-= 1; *= 4` | `s2 -= 1` before earlier line WIDTH | fails |
| post-sum-self | move `endField = row + strip` after WIDTH; then `-= 1; *= 4` | `s2 -= 1` before earlier line WIDTH | fails |
| pre-sum-packed | pre-call sum; post-call copy into distinct `packedEndpoint`, compound decrement/multiply, copy to live `endField` | `s3 -= 1` after immediate WIDTH, same-register shift/mask | passes on probe |
| post-sum-expression | remove pre-call sum; post-call `endField = (row + strip - 1) * 4` | same output as preceding form | passes on probe |

The packed temporary performs the real endpoint calculation; it is not an artificial reference or extra runtime computation. Both packed consumers continue to use the live `endField` through the existing stores. All arithmetic is defined on the accepted probe domain, for example row/strip between 0 and 65535, with valid aligned header and command storage throughout opaque WIDTH calls. Unsigned WIDTH arithmetic and fixed row-store operations are retained. No volatile, asm, barriers, padding, uninitialized data, or introduced undefined behavior were used.

## Desired discriminator versus accepted early-order property

The new desired discriminator requires the subtract source and destination to be the live endpoint register used by the following shift-by-two and mask-4095, with subtract execution after the immediate endpoint WIDTH. It also requires four actual WIDTH calls and two stores combining the live packed endpoint with WIDTH returns 2 and 4. This differs deliberately from the previously accepted strong property, which records a self-decrement before the earlier line WIDTH. That frozen property was not changed.

`property.js` checks the new straight-line probe predicate with register provenance, actual emitted ordering, retained shift/mask and store dependencies. Explicit `.set noreorder` call delay instructions execute before the call; under reorder, the next assembly-source instruction is processed after the call. This checker is task-local and bounded to these emitted probes, not a general MIPS emulator or a proof of numeric semantics. `property-original-copy.js` is an unchanged reference copy; `adapt-checker.js` records the initial adaptation, and `property.js` additionally checks same-register shift/mask. Final `property.json` records in all four probe directories are authoritative for this task. Their helper result names describe observed early or desired ordering, not reacceptance of the prior entire research claim.

All four probes retain four WIDTH calls and both packed stores. The first two have early self-decrement and fail desired order. The last two execute `addu $19,$19,-1` after WIDTH 2, then `sll $19,$19,2` and `andi $19,$19,0x0fff`; stores retain WIDTH 2 and WIDTH 4 provenance. Their assembly is byte-identical (`47B8B15C44639C994BEDE208C062F8F8A00B80C61FC362AA7C9D6BB62895ECF8`). Their input hashes are:

- pre-sum-packed: `BFD9AF45FD4C2A0D7446F1189F92309432872A22C2E61873FEBB16E274B98E6E`
- post-sum-expression: `CA6BA16E15AB2B66040DAA9D96DA7593412B6549611BFA91319C3C4873CBCA92`

The old `inspect.js` recognizer only selects initial RTL decrements whose source has `/v`. Therefore its empty list for post-sum-expression is a recognizer limitation, not absence of subtraction; emitted assembly and the new provenance checker establish that operation. For pre-sum-packed it records a distinct pseudo destination at scheduling, with a call anti-dependence; after allocation the two values share one hard register. This is an observed pass/register contrast, not a new instrumented compiler-cause claim.

## Complete controlled-copy results

Both promising source shapes were applied at all three endpoint sites in fresh complete copies of fixed-SIZE_ROW best input `444077E9FADE629401A939C6C32B35E0873CB9E3F1DA0EA428944492438003C8`. Their resulting assemblies are identical. A separate `full-format1-only` copy applies only the post-call sum expression in format 1; `final-checks.json` reconstructs and verifies that exact scoped transformation.

The format-1-only complete input is `6F74A28FCA94388C537398E8801FF49DBD71D11C9024D99015F1F23A2CA21525`; pinned assembly is `4CD2B466996F5F4D7564A0F01E9F6A84774A3F5B5ABF7CCA4398E73DBAB20F57`.

| Full copy | Common branches | Format-1 endpoint / row / command pointer | Native differing words |
| --- | --- | --- | --- |
| unchanged best | temporary subtract from live `s2` into `v1`, shift back into `s2` | `s3` / `s1` / `s2` | 15 |
| either all-site alternative | sum and subtract in `v1`, shift into `s2`; live-register discriminator fails | `s1` / `s2` / `s3` | 29 |
| format-1-only alternative | unchanged best output outside format 1 | `s1` / `s2` / `s3` | 17 |
| preserved retail region | same-register `s2` subtract/shift/mask after WIDTH | `s1` / `s3` / `s2` | reference |

Format 1 in the alternatives computes its sum in the endpoint WIDTH delay slot, then decrements/shifts/masks in `s1` after the call. Its load and final size stores consume that live `s1` value. Thus a real part of the retail endpoint sequence is obtained, while row/pointer registers still disagree. Applying the shape only to format 1 does not repair the two preexisting common-branch temporary residuals, and the all-site form adds scheduling changes there. These facts are kept separate from the small mismatch metric.

The format-1-only raw nonrelocated changes from best are 19 words, all within owner offsets `0xA7C`–`0xBF4`; exact offsets are in `comparison.json`. Its relocation signature (actual offset/type/symbol/section rows) equals best. The all-site forms have changed relocation signatures; their relocation-bearing words are explicitly excluded from native same-offset comparison. `object-evidence.json` records every actual text relocation and preserves both retail and candidate endpoint windows with relocation annotations. Unresolved raw jump/HI16/LO16 words are not asserted to be final linked addresses, and same-offset windows are not claimed to establish alignment.

All three new full copies and the unchanged best have ELF function-symbol extent 3800 bytes and frame 368 bytes. Native `.text` is 3808 bytes due to assembler section alignment; the eight-byte section tail is not counted as function growth or accepted owner data. No structural contract was changed. The baseline's assembly was copied read-only from accepted evidence and assembled in the new root for like-for-like raw comparison; no canonical build was invoked.

`compare.js` authenticates the full normalized ROM hash `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` and compares accepted 3800-byte function extent at ROM `0x1F7ADC`, excluding each object's actual relocation positions. These are development native-word observations only, not a linked diff, target acceptance, relocation-contract acceptance, or full-ROM verification.

## Interpretation and remaining observation

Separating the live endpoint from a short-lived packing state can retain the call constraint while obtaining a same-hard-register subtract in the probe. The concise post-call expression produces the same output, so a named temporary is not required for that observed result. This does not mean every same-register source update will behave that way: assigning directly into the live endpoint, even with the sum definition moved after WIDTH, still moves early in the tested probe.

The complete-function format-1 result is useful branch-specific evidence, but no tested form produces the desired common-branch endpoint operation or complete retail register arrangement. The next missing observation is a source-level lifetime arrangement that preserves format-1 endpoint `s1` while retaining row `s3` and command pointer `s2`, without extra runtime work, and an independently successful common-branch arrangement. The source owner's disjoint local-allocation investigation may inform that step; its separate findings are not newly certified here. This bounded class does not establish impossibility or retail compiler history.

## Authentication and release

Seven new complete compiler inputs were retained: four probes and three full copies. Each ran pinned cc1 once plainly, then once with ordinary `-da` (14 successful invocations). Every dump assembly equals the corresponding plain assembly after removing only `-da` from the compiler options comment. Executable SHA256 is `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`, with unchanged `-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char`. Commands, stderr/status and per-input/output hashes remain in each directory. Four task-local assembler invocations use the authenticated configured assembler and unchanged compiler-assembler flags; each command records executable identity. All seven inputs classify mechanically `PURE_C`, which alone proves no matching acceptance.

Generation scripts deliberately create new output directories. Do not rerun them against this frozen root; independent reproduction should copy inputs to a fresh authorized root and replay recorded commands. `final-checks.json` records input checks and identity comparisons; `manifest.json` binds all task evidence apart from itself.

Writes are released at completion. Only this fresh claim/report and ignored root were written. Production ownership, other workers' changes, prior evidence, compiler/tool contracts, owners/linkage, runtime, Resolver, Git and shared tooling were untouched. No canonical diff/full build/verifier ran. Independent research review is required before propagating this new discriminator/lead; ordinary source integration still uses its normal matching gates. All fourteen W8 targets, one final complete-wave verifier, later families and no-push direction remain unchanged.
