# P06 presentation compiler observations

These records preserve the worker’s authored source/control evidence and the
75EE0 workaround assessment. Historical selected-mi14/15/16 diagnostics keep
their original identities. Current-model research imports are uncompiled; matching
acceptance belongs separately to [the complete reconciled P06 wave](../../build/integration/attack-effects/p06/wave-acceptance.json).
No observation proves original source spelling or a universal compiler mechanism.

## func_00256410

Keep the real coordinate update in both arms of the existing x<0 sign condition, retaining the negated signed-word step only in the negative arm. All paths still execute one coordinate update and the unchanged following call. Add nearby comments explaining the word conversion and source-level scheduling workaround.

Source25 and the commented final source compile PURE_C1328/frame40 with rawRelocationMaskedExact=true over the complete body. The exact source06 control places the argument-address addiu at4E0 and float store in call delay4F0; final output reverses them to retail. There is no added operation or invented condition. RTL/scheduling dumps for source06 are retained, but the complete optimizer mechanism and original source spelling are not established.

See [the source and controls](../dossiers/func_00256410-99e5643fba.md) and
[the authenticated observation](../dossiers/func_00256410-99e5643fba.observation.json).

## func_00256940

Use the actual first pointer field through the scalar u8** address view for its existing store and reads. Retain all shared-context byte/halfword operations, calls, callback addresses, source order and complete cases.

Source02 and commented final source are mechanically PURE_C392 with rawRelocationMaskedExact=true on selected mi14/ED24A479. Both reordered clusters return to retail register and instruction order. This observation establishes neither original spelling nor a universal alias-analysis rule.

See [the source and controls](../dossiers/func_00256940-12ba556124.md) and
[the authenticated observation](../dossiers/func_00256940-12ba556124.observation.json).

## func_00256F58

Change only the existing context-copy RHS from the named state value_0E field to the scalar u16 view at the same observed state+E address. Preserve the signed field declaration, increment, branch, table read, handoff, and all calls.

Source02 and commented final source compile mechanical PURE_C460/rawRelocationMaskedExact=true using selected mi14/ED24A479. The byte store stays before the halfword read, with the retail V0 reuse and callback setup. No extra access was introduced, and this is not evidence of semantic volatility or a universal scalar-view rule.

See [the source and controls](../dossiers/func_00256F58-055b1b6ed1.md) and
[the authenticated observation](../dossiers/func_00256F58-055b1b6ed1.observation.json).

## func_00259480

Express each real factory result's successive payload and physical-header views in one local union. Keep the observed byte subtraction0x1C, both state stores and registrations, actual record addresses, source order, full switch and workspaces. Source07 changes only the first pointer's phase representation;08 applies the corresponding second phase representation.

Source07 restores first-payload S0 but retains a separate S1 for the second return. Source08 and commented final source are mechanical PURE_C1156/frame112/rawRelocationMaskedExact=true on selected mi14/ED24A479. Both unions describe real nonoverlapping pointer views and add no storage reader, fabricated bytes or padding. Complete optimizer causality and original source are not established.

See [the source and controls](../dossiers/func_00259480-a021ee4260.md) and
[the authenticated observation](../dossiers/func_00259480-a021ee4260.observation.json).

## func_00275850

Preserve real current/previous index and coordinate-view phases plus XYZ-before-cursor-commit ordering.67 removes do/while(0) wrappers from endpoint vertex writes;68 removes remaining wrappers, retaining all real field writes in plain scoped blocks.

62 local dump assigns encoded-a register9 and full index register10 (9 references over72 versus98 instructions).67 changes preferences to index9/a10 but swaps b/c and one scheduled pair; its dump confirms new preferences.68/plain-block final is PURE_C680/frame0/rawRelocationMaskedExact=true on selected mi15. No artificial reads, calls, padding or pressure. Original source and complete optimizer causality are not established. Contrast52/65: in-place/union encoding restores index9 but swaps a/constant255;66 inline shift unchanged.

See [the source and controls](../dossiers/func_00275850-67d9803a26.md) and
[the authenticated observation](../dossiers/func_00275850-67d9803a26.observation.json).

## func_00275E68

Use explicit u16 self-XOR reset instead of plain zero or a full constant-mask clear. Preserve all other real field stores and allocation. Existing canonical func_0027F75C.c and its original assembly independently show the same halfword read/self-XOR/store reset idiom at another state offset1E.

08 and commented final are mechanicalPURE_C72/frame24/rawRelocationMaskedExact=true selectedmi15. Constant mask04 and whole bitfields01/05 fold to64/directzero store. Split bitfields02/03 touch different widths/containers.07 volatile mask retains an unused load but emits68/directzero; rejected.09 self-complement mask folds to64/frame32. Read and XOR are actual original operations, not fabricated pressure; original source spelling and flag meanings remain unproven.

See [the source and controls](../dossiers/func_00275E68-90714067f6.md) and
[the authenticated observation](../dossiers/func_00275E68-90714067f6.observation.json).

## func_00276fe0

02 uses case-local angle-to-radian in-place phase and captures actual matrix destination before movement clamp.03 supplies the real zero float argument via raw-zero/float union at the two transform calls while retaining the exact float prototype.06 changes only float-to-stored-halfword conversion from an intermediate s32 cast to direct s16 cast.

02 restores case1001 FP registers but remains1432/frame208 due preserved FPzero andF30.03 removes that unnecessary lifetime, reaching1420/frame200 with every opcode/order/register agreeing except early normalization A0 move and extra NOP after conversion.04 explicit integer local and05 scalar half-store are unchanged.06 and commented final are mechanicalPURE_C1416/frame200/rawRelocationMaskedExact=true. Probe03 shows argument move before fix-trunc as early as schedule1; complete pass causality/original source are not established. These are actual numeric/pointer producers, no dummy readers or padding.

See [the source and controls](../dossiers/func_00276fe0-23e1bd2e4b.md) and
[the authenticated observation](../dossiers/func_00276fe0-23e1bd2e4b.observation.json).

## func_00278560

04 real pair[2] stores matrix arguments.06 signedshort flags restores materialization.07 nested real flag updates merges FP condition tails.15 tests constructed bits0xC before full short equality promotion.

04 restores frame88/stack30,34.07 full1440 has18 word differences confined to dispatch;15/final full1440/frame88 mechanicalPURE_C rawRelocationMaskedExact=true. Probe07 shows promotion before first branch; mask test avoids that while preserving exactly values0/4/8/12. Unsigned widths introduce masks; fullword and combined OR lose setup phase; switch adds dispatch. Original spelling and complete compiler causality unproven.

See [the source and controls](../dossiers/func_00278560-649fb1bd40.md) and
[the authenticated observation](../dossiers/func_00278560-649fb1bd40.observation.json).

## func_00279460

07 assigns all three actual offset components within both selection arms;09 separates update-case object lifetime from earlier factory case and captures matrix/context before transition.

07 restores initialization exactly,08 cached object keepsS0 and adds reload.09/final full944/frame128 mechanicalPURE_C/rawRelocationMaskedExact=true. Earlier localheight/conditional forms eliminated original jump; floatarray added load. Case-local current usesV1 until derived matrix entersS0. Exact original source and complete pass causality remain unproven.

See [the source and controls](../dossiers/func_00279460-858b5b4511.md) and
[the authenticated observation](../dossiers/func_00279460-858b5b4511.observation.json).

## func_00279920

05 keeps cases1 and2 as separate actual call statements instead of grouped labels.06 moves FF return into explicit preceding guard and retains default return.

Grouped callcases and identicalFF/default switch returns collapse dispatch to108bytes. Separate callcases alone132; guard with grouped cases128. Combined06 full152/frame24 mechanicalPURE_C/rawRelocationMaskedExact=true. Distinct equivalent source paths preserve observed dispatch, not proof of original spelling or FF semantics.

See [the source and controls](../dossiers/func_00279920-031b867af4.md) and
[the authenticated observation](../dossiers/func_00279920-031b867af4.observation.json).

## func_00279A90

03 expresses actual address as integer byte displacement plus32-bit base before converting back to point pointer; final documents it and uses observed12-slot prefix. Random result retains existing unsigned prototype with explicit signed cast for observed signed remainder.

01 full712/frame80 differs in just ADDU base/index operand order.02 i+points canonicalizes to same pointer addition.03 and final full712/frame80 mechanicalPURE_C/rawRelocationMaskedExact=true. Signed counter guard and negative/zero paths preserved without added validation. No source-original claim or fabricated pool data.

See [the source and controls](../dossiers/func_00279A90-c2fb03fe92.md) and
[the authenticated observation](../dossiers/func_00279A90-c2fb03fe92.observation.json).

## func_00275EE0

Use the actual inactive exit label address while retaining the active draw body and both literal-zero returns. Keep the real raw-zero/float union arguments and the accepted float prototypes. The source comment documents this compiler workaround.

The source worker’s preserved03 common-return control is256 bytes;06 shared-result control is268 bytes with a different result carrier.13 retains the full264-byte body and the original branch/return ordering; final reported mechanical PURE_C and zero differences outside actual relocation fields. Structured09/14/15 alternatives still invert the initial condition. This does not establish the original source spelling or a general compiler mechanism.

See [the source and controls](../dossiers/func_00275EE0-a53e564e26.md) and
[the authenticated observation](../dossiers/func_00275EE0-a53e564e26.observation.json).

