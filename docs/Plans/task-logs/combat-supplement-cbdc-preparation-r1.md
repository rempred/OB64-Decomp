# Combat supplement CBDC preparation r1

Completed: all 2,136 bytes of func_0020CBDC match authenticated Rev 0 ROM. The note identifies branch-specific child construction, argument widths and actor-state updates. The future source worker must independently implement this owner and establish the existing complete-wave gates. This uncompiled preparation neither activates nor accepts the supplement.

## Inputs and scope

Launch COMBAT-SUPPLEMENT-CBDC-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local. Fresh atomic claim records activation HEAD2264258bd9b418ea974c236b6655cdd61e939e97. Ready commit is8c45483f9b2a60f8ea286129b40c43bc9c691cd2.

Used supplement-inputs r1 at a2aa730 and its bound package. Extraction baseline is d70fd853fdffacf71290b24763e010a549276a55. Production references use accepted W7 Git blobs at469a1416918592749d61dc34e3e079796f7b673c. Unchanged required guides were reused. The W8 integration note at e8505fb1eeb14633aef168f86b7896cf6069721d supplied caller context only. Its caller uses actor and mode; other live argument registers do not imply additional arguments.

The literal package describes its historical twelve-member extraction. This assignment preserves the current complete thirteen-member supplement, including its later obligation. No inventory change is inferred from the older package count. Current fourteen-member W8, shared obligations and unresolved selector evidence gate remain intact.

| Neutral name | Supported meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| Constructor owner | Complete func_0020CBDC | 0020CBDC..0020D434 | z64 ROM, exclusive end | 534 authenticated words |
| Placed owner | Descriptor10 placement | 801C974C..801C9FA4 | RAM, exclusive end | Delta7FFBCB70 |
| Child allocator | func_0020F2A8 | 801CBE18 | RAM entry | Repeated four-argument calls |
| Pair offset table | Three x/z offset pairs | 801CEDFC | RAM data | ROM0021228C; (-9,-9),(-9,9),(9,0) |
| Secondary factor | Global word narrowed into child halfword | 801CE8FC | RAM word | Repeated reads per pair |
| Primary callback | func_001F7148 under this placement | 801B3CB8 | RAM pointer | Stored, not called here |
| Secondary callback | func_001F89B4 under this placement | 801B5524 | RAM pointer | Stored, not called here |

All29 direct JAL sites and31 internal direct edges are preserved in evidence.json (named func_0020CBDC.json). No JALR or non-return JR occurs. Frame size is0x58; final JR RA at ROM0020D42C includes delay slot0020D430. Stale decoded address comments do not govern branch placement. The checker derives branch targets from words.

## Entry and common state

Let A denote actor a0 and mode denote a1. Mode is saved as a full word. Let X=A.word5C, Y=A.word60 and Z=A.word64 after initialization. Actor fields and child fields are separate views. This owner does not establish a shared pose-pool type for either.

Capture A.word58, A.word48, A.word4C and A.word54. First call func_0020D434 at RAM801C9FA4 with word58. Next call RAM8016E338 with low bytes of word48, word4C and that result. Save its low-byte result in A.word70.

Set X=38*(captured word58-4), Z=38*(captured word54-1). The helper at RAM801BC35C receives SIGNED LOW HALFWORDS of X and Z. X is obtained by loading A.half5E after storing word5C in big-endian memory. Z uses explicit shift/sign extension. The helper returns float in f0. trunc.w.s converts it to an integer word stored at A+60. This field is not a float merely because swc1 performs the store. Bytes A+AB and A+AC become255 before that helper call.

Call RAM801BE138 with full captured word48/word4C and two independently loaded copies of actor flag bit8. Both third and fourth arguments use bit8; do not substitute bit10 based on neighboring helpers. Save its result at A.word50. Although some inlined getter shapes check A for null, earlier mandatory dereferences make this function no general null-safe API.

For each zero unsigned halfword at A+36/+38/+3A/+3C, call respectively RAM8016DF88/8016DFDC/8016E030/8016E084. Each receives low-byte captured IDs. Store the low halfword of each result. Nonzero fields remain unchanged; call order is36,38,3A,3C.

Call W8 func_0020C4B8 at RAM801C9028 with X,Y,Z,&stack18,&stack1C. Store its two output words at A+98/+9C. Do not infer extra geometry semantics beyond these arguments and writes.

## Common child-pair construction

A pair consists of primary child P and secondary child S, allocated by two ordered func_0020F2A8 calls. Each call receives A.word50 and three integer coordinates. Allocation calls remain separate even when arguments are identical. Each result has byte14 cleared immediately. The actor receives P at slot A+4*i and S at A+0xC+4*i.

Both children receive A at child.word40 and A.word50 at child.word44. P.word0 receives the primary callback; S.word0 receives the secondary callback. P.half34 becomes255. S.half34 receives the low halfword of global word RAM801CE8FC. Both child.word90 values point to P, including P's self-reference. Retain store/call ordering and global reloads between pairs.

The allocator's authenticated original shows80 slots of0xC0 bytes, clears a selected slot and returns it. Exhaustion enters its own wait loop; this owner adds no failure branch. The allocator also initializes child fields. Do not invent null cleanup or duplicate all initialization inside this owner.

## Ordered branch tree

The following branches occur in priority order after common initialization. Numeric IDs remain neutral; no stronger game identities were established.

| Condition | Construction and additional changes |
|---|---|
| A.word4C ==1 | Counted table-offset pairs; mode influences child.byte8C |
| Else word4C in {0xA,0x19,0x7B} | Two offset pairs; second pair gets byte8C=3 |
| Else word48 ==0x87 | Mode zero gives one pair; nonzero gives two elevated pairs and changes actor Z |
| Else word48 in {0x88,0xA1} | Two pairs, second shifted in X |
| Else | One base pair, both byte8C=2 |

For word4C==1, call func_0020D444(A.u16[20],A.u16[22]) at RAM801C9FB4. The helper counts positive iterations subtracting signed(second/3), then caps the returned count at3. A zero result creates no children. Its bounded positive-divisor behavior explains at most three table pairs; no termination guarantee is inferred for a zero divisor with positive first input.

For each returned index, allocate a pair at (X+offsetX,Y,Z+offsetZ) from the three authenticated table pairs. If mode==0, set byte8C=2 in both children. Nonzero mode omits these stores. The loop advances the actor slot pointer4 bytes and table pointer8 bytes. It does not clear unfilled actor slots.

For word4C in {0xA,0x19,0x7B}, allocate the first pair at (X,Y,Z). If actor flag bit8 is clear, the second offset is(-8,+8) in X/Z; otherwise it is(+8,-8). Allocate the second pair at those offsets. Both SECOND pair children receive byte8C=3 through the shared tail. Mode has no effect on this branch.

For word48==0x87 and mode==0, allocate one base pair. Then OR actor flags with0x800. There is no explicit byte8C assignment in this path.

For word48==0x87 and mode!=0, the first primary allocation receives (X+1,Y+57,oldZ+48). In that call's delay slot, A.word64 changes to oldZ+10. The first secondary allocation reloads this changed Z and uses Z+38, giving oldZ+48 if helpers do not modify it. Preserve the two expressions and store timing rather than hoisting a shared coordinate. The second pair uses (X+1,Y+57,currentZ-38). Set byte8C=1 in both primary children only. OR actor flags with0x1000, then pass through the shared0x800 flag tail. The resulting flags retain both bits.

For word48 in {0x88,0xA1}, allocate one base pair and another at (X-38,Y,Z). Set only the second primary's byte8C=1. OR actor flags with0x800. Mode does not alter this branch.

The default branch allocates one base pair and sets byte8C=2 in both. No actor0x800/0x1000 flag update is present there. Avoid a common post-construction flag assignment that broadens its scope.

## Final pass and retained state

All paths converge on a three-slot scan of actor offsets0,4,8, including slots not written by the chosen branch. Existing nonzero pointers therefore matter. Do not clear unused slots or restrict this scan to the newly allocated count.

For each nonzero primary pointer P, call func_001F0E64 at RAM801AD9D4 with P+0x44 and either0 or38. The second argument is38 when actor flag bit1 is set, otherwise0. Flag bit1 is reloaded for each nonzero slot. This is a helper call on an interior child field, not a submission or deallocation inferred from the pointer alone. Secondary slots are not scanned here.

The final return preserves no deliberately established success value. Do not infer a pointer or boolean contract from whichever scratch value remains in v0. The integration note's actor/mode call shape is consistent with this body.

## Matching-sensitive hypotheses and limits

The initial hypothesis that mode governs every pair is falsified by branch-specific tests: only word4C==1 and word48==0x87 consume it. A proposed float type for A.word60 is falsified by trunc.w.s before the store. A shared coordinate temporary in the0x87/nonzero branch would hide the actor Z update between allocation calls. An allocation-count-only final loop would omit preserved actor slots.

Use neutral offset-backed actor and child views until accepted field evidence justifies stronger shared names. Respect unsigned halfword tests, low-byte helper arguments, signed halfword coordinate narrowing and integer storage of the converted float result. Do not introduce undefined signed overflow/shift behavior merely to mirror instruction spelling. No C candidate or compiler spelling was tested.

Machine bytes and local dataflow are Verified static observations. Reconstruction guidance is Supported and uncompiled. No semantic acceptance, structural change, source class, family disposition or matching result was established. The later complete thirteen-member supplement remains required; W8 integration is not proof of supplemental acceptance.

## Reproduction and evidence

Offline command: python -B build/combat-supplement-cbdc-preparation-r1/check.py. The checker authenticates the bound package, original owner, accepted W7 blob and every ROM word. It also authenticates the bounded allocator/count helper originals and records configuration/type identities. The table bytes are read under accepted descriptor10 placement. No emulator, database or generated production evidence is used.

| Artifact | SHA256 |
|---|---|
| supplement-inputs.json | A6E2622E7C61F375417823A50FAB88050E8E09C4619CDBE2861B9E90CF48E167 |
| Complete original owner | 34155D4EBE5CD0945BFBDE27C09A278116B0EF094102145A578EFC5EDEFD1652 |
| check.py | BA9F910959518A815F2543A60C0BDDDA8C604ACD823F8CD03AF051D6764A5CC6 |
| func_0020CBDC.json | DB5F5559ACB66319BE9EBFBAA3CF2F32F38EB7E7F023A0F59B1F26381E2CE7DE |
| Source V64 | 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 |
| In-memory normalized z64 | 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |

One dependency print truncated; the checker authenticated its complete words. No compiler/runtime experiment failed because none was attempted. Only the fresh claim, this report and ignored checker/evidence were written. No candidate C, production change, compiler/link/build/verifier/source-policy command, runtime, GUI, bridge/database access, agent or Git mutation occurred.

The Director receives this note; the source worker retains sole W8 production ownership. All existing wave obligations and selector evidence limits remain unchanged. This note adds no independent matching review or full-ROM gate. All commands have finished. All assigned writes are released to /root at terminal handoff.
