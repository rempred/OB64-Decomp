# Combat draw 7ADC FPU preparation r1

Completed bounded assistance. A shared zero value receives f20 during local allocation before the three requested values receive global assignments. This constrains angle and verticalScale. The Director should route this finding to the matcher; no supported new source discriminator is proposed.

Launch COMBAT-DRAW-7ADC-FPU-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local; Astra Medium. Ready 28a102486b3694be4e1de68c205f45c98e8763a1; activation 82e594935a0a42b44b61d2dfabb422a5bbec0b0f. Coordination baseline is 1e60fb938d5ab12acdc9e762acc966d45bf843e5; accepted source is W7 469a1416918592749d61dc34e3e079796f7b673c. The complete claim was created atomically and read back before other writes. Existing governing guides and current program/W8 ownership requirements were read or reused as directed.

## Authentication

All 21 supplied files are bound in inputs.json, including diagnostic-command.json and all thirteen passes. The four pinned candidate source/assembly hashes match the prompt. Offline macro expansion finds identical complete function bodies after excluding comments and whitespace. Emitted assembly is identical after excluding comments and .file directives. No excluded operation was interpreted during full-file comparison. The diagnostic therefore applies to this production snapshot, unlike a mere equal-size or equal-difference-count comparison.

All 950 original words match the accepted W7 Git blob, the derived original.s aid, and the actual normalized ROM. The accepted extent is exactly 3,800 bytes. No word from the following eight-byte owner was included. inputs.json records the original blob and both ROM hashes. Raw ROM SHA256 is 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12. In-memory normalized SHA256 is 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. The prior full-owner note/evidence hashes match the assignment.

## Values and first allocations

A pseudo is a compiler value identifier before assignment to a hardware register. Hardware identifiers 52,54,56 correspond to f20,f22,f24. They are not stack offsets.

| Value | Retained origin and lifetime | First allocation / emitted result |
|---|---|---|
| referenceZ, pseudo75 | Initial RTL UID10 copies incoming a3 bits. Comparisons106/162 and subtractions133/189 use it. Its last use308 forms dz and carries REG_DEAD by .lreg. | No local assignment. Global order position33; .greg assigns75 to52/f20. Emitted entry mtc1 a3,f20. |
| angle, pseudo94 | Definitions152/213 convert the two double branch results.221 copies negativeQuarterTurn98;239 defines positive90.254 adjusts negative angle.493 passes angle to the later matrix call and marks its death. | No local assignment. Global position22; .greg assigns94 to54/f22. |
| verticalScale, pseudo95 | Branch definitions331/343 are1.0/0.5;364 converts the computed double scale. It survives into the item loop. Its uses feed later scale arguments; no geometry interpretation was performed. | No local assignment. Global position46; .greg assigns95 to56/f24. |
| shared zero, pseudo252 | Initial375 defines zero. First CSE extends its uses through495, beyond the first matrix call and matrix conversion. | .lreg explicitly records Register252 in52. .greg substitutes f20 at375,386/388/390 and495. |

The local metadata records referenceZ as 6 references/110 instructions/3 crossed calls. Angle has 10/96/3. VerticalScale has 7/578/33 and dies in 0 places. Zero has 5/72/2 in block21. These are compiler counters, not dynamic instruction counts or numeric allocation priorities.

referenceZ dies before the later zero definition and verticalScale branches. Therefore reusing its hardware register for zero is consistent with the recorded lifetime. referenceX73 similarly receives f24, which verticalScale later reuses. The candidate does not contain a surviving full referenceZ-to-verticalScale copy. Reusing a register is not evidence of a shared source variable.

## Where zero becomes long-lived

| Stage | Exact retained evidence |
|---|---|
| Initial RTL and .jump |375/377/379 define separate zero pseudos252/251/250.386/388/390 copy250/251/252 to a1/a2/a3 for the first matrix call.487 defines a separate zero295;495 copies295 to a3 for the later matrix call. |
| First .cse |377/379 disappear.386/388/390 all use252.495 now also uses252. This is the first retained cross-call sharing, before register allocation. |
| .lreg |252 spans 72 instructions and two calls. It receives hard register52/f20. Its REG_DEAD is at495. |
| .greg |Angle94 and verticalScale95 each explicitly conflict with hard52. referenceZ75 does not. Both angle and scale also conflict with each other. |
| Later scheduling and emission |The shared zero remains f20. The candidate emits mtc1 zero,f20, copies from f20 for first-call arguments, then copies f20 into a3 for the later call. |

The two crossed calls are func_00022e90 and guMtxF2L. The final zero argument is prepared for func_00023018. The shared zero is already a local-allocation decision when global allocation considers angle and verticalScale. Thus hard f20 is unavailable to both values during their overlapping lifetimes. Global allocation then assigns angle f22 and scale f24. The lists establish this concrete constraint; they do not establish why a numeric priority selected those exact remaining registers.

The input copies become mtc1 operations, not memory reloads. The angle and scale definitions remain computed register values. Register substitutions occur in .greg; later scheduling does not originate these allocations. Callee-save prologue loads/stores preserve hardware state and do not constitute source-value spills.

## Retail comparison

All addresses below are z64 ROM instruction offsets within the authenticated owner.

| Role | ROM offset | Observed retail evidence |
|---|---|---|
| Incoming referenceZ |001F7B50 |mtc1 a3,f22 |
| Angle branch results |001F7C70,001F7CE4 |cvt.s.d f20,f0 |
| Last referenceZ subtraction |001F7DC4 |sub.s f0,f0,f22 |
| Later verticalScale |001F7E08,001F7E38,001F7E64 |Definitions write f22 after referenceZ's last use. |
| First matrix zero |001F7E6C..001F7E8C |mtc1 zero,f0; mfc1 a1,f0; a2/a3 copy a1. |
| Later matrix zero/angle |001F7F18..001F7F20 |a3 comes directly from integer zero; a2 comes from f20. |

Retail therefore has no emitted saved-FPU zero spanning these calls. Its first-call zero uses f0 briefly; its later zero uses an integer-register move. Retail angle occupies f20, while referenceZ and later verticalScale reuse f22. Candidate first-call and later zero share f20 instead. This is an observed source of register pressure, not proof of original compiler history or original source spelling.

The supplied snapshot already contains negativeQuarterTurn98. Its .greg disposition is 62/f30, and its assembly declares a 368-byte frame. This confirms the supplied snapshot's current state. The matcher's account that this local restored that state remains attributed implementation history; no earlier control was opened.

## Limit and release

No additional source discriminator is justified. The assignment already excludes parameter reassignment, a separate depth copy, entry angle=-90 and chained scoped zero floats. The frozen candidate itself contains chained scoped zeros, which first CSE merges across their source scope. Recommending that spelling again would repeat a failed control.

A useful diagnostic condition is now precise: zero252 must stop occupying f20 across the matrix calls before global allocation for that specific hard conflict to disappear. This is an observed constraint, not a proposed source edit or a prediction of an exact match. The supplied evidence identifies no untested real-state copy boundary that produces it while preserving the actual zero arguments. No padding, artificial reference, volatile barrier, assembly escape, or compiler exception is proposed. Numeric priority and counterfactual allocation remain unproved without applicable additional evidence.

Only the fresh claim, this report and its ignored evidence root were written. No candidates, source/configuration/tooling edits, compiler/link/build/verifier/source-policy operations, runtime/bridge/DB actions, Git mutations or agents occurred. Packet, vertex and geometry questions were excluded. All fourteen W8 targets and the existing single final complete-wave verifier remain required. This is ordinary assistance, not independent review or reusable compiler/semantic acceptance. All assigned writes are released at direct collaboration handoff; these records then remain frozen.

All 21 input files rehashed unchanged before release. Output identities (SHA256); exact sizes are in outputs.json.

| Artifact | SHA256 |
|---|---|
| allocation.json | 0C3A3818C5B44C736AF0CECF4692E57423F9A3EB25A5B1E31F4967C9FB9685BA |
| allocation.py | A67E68E7869C29DA15C3F8532AD2A4A85BDE0FF354CCDD5C1AB4DF858C08CCA4 |
| auth.py | 9A390273D322F38D21789B998F64F6647ECB9EB9DEC17BAC6DDA7928ED4398AD |
| comparability.json | DA7ADC1360BDE319F954BA501F831BB3669859F836A4CE6C0C1E9F0F8B006604 |
| finalize.py | E0E3F14F819DA9EBC9381D01EDF520353D80177ADDFFB24ADD2DED30B2A594F1 |
| inputs.json | A2D570035B7DA553DF476A51622E8B7C78D7A6DACA3D969AAE552EEF16EF5160 |
| trace.py | C773589D9DC87D27BA7F7F14F247DCEE39B80A6643E4160331ACBB8BBEEC7122 |
| units.json | 5CF9A9BC556680C210BB1CF0A933C3D5061EF2649F5B524C07589BB55C2AB489 |
| outputs.json | 556F0D954F5FEF3D63D82B16852B93626DDE4CF4BAA878C44801B8A0C159125E |
