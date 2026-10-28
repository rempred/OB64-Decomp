# func_0024CBC8: curve-count-width-and-saved-register-allocation

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `DAD988C7FE5FE93F96841015F3964B545E0EC2A750E40F6E9DF2C2AB6C6C9CA3`
- Observation: `A9ABC173C14726EBE184DDA4F57A4C105AA070AF78F141BDBEB7E60D490EC86D`
- Source: [exact C](../archive/matching-c-candidates/2026-10-28-func_0024CBC8-dad988c7fe.c)
- Metadata: [curated observation](func_0024CBC8-dad988c7fe.observation.json)

P01 source-bound observation for curve-count-width-and-saved-register-allocation. Preserve the exact source pair and context; private diagnostics do not establish canonical acceptance.

## Source context

CBC8's first PURE_C source4AE96260 covers all376 bytes/frame48 but exchanges state/count saved registers S2/S3, leaving37 nonrelocation word differences. Making the state a typed formal instead of a void-pointer local produces51653D66 with the same exchange and no other improvement. Preservation context: the three source-width comparison reports retain their imported hashes. The shared whole-wave call-binding audit was later finalized at65E85D97B503910833D50777C5E8080EA2528C1507BB3AE6C5D2806D97D9B13F; the earlier audit reference in observationAB213B0C44E1953933063AFA3A6ED2086E6CA3CCAF4E7157C8AD23349B2B89C6 is stale. This successor binds the final audit and makes no additional compiler-effect claim.

Change the count formal from s32 to s16, retaining the explicit signed count uses. Declare the final helper's consumed full-register count as s32; the caller supplies its signed16 value.

## Recorded observation

DAD988C7 is PURE_C376/frame48 with rawRelocationMaskedExact=true. Saved count/state registers now agree with the full retail body. The count-width hypothesis is grounded in the original SLL16/SRA14 allocation-size expression and SLL16/SRA16 final argument; this observation does not establish original C or a general register-allocation rule. Callee names are resolved against accepted placement metadata, whose ROM-to-RAM offset changes at descriptor boundaries.

## Remaining failure

Private diagnostics are symbolic-object only. Production writer must reconcile CBC8 declarations in522E0,52A9C,532A8 and its definition, then check actual linked ownership/placement/relocations/bytes and the complete P01 ROM once.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe func_0024CBC8 --source docs/archive/matching-c-candidates/2026-10-28-func_0024CBC8-dad988c7fe.c`. Check the metadata's expanded/header identities before interpreting its dumps.
