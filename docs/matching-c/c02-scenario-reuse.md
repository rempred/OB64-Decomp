# C02 scenario dispatcher source lessons

These are source-bound KMC compiler observations from the completed consumable scenario wave. They describe particular complete producers and their historical diagnostic reports; they do not prove the original source or a universal scheduling rule. Canonical `func_001AD8CC`, `func_001AD0E4` and whole `func_001A9290` passed the combined exact-ROM audit on November 3, 2026. Historical controls retain their original intermediate status.

Accepted examples: [eligibility](../../src/lib/func_001AD8CC.c), [item feedback](../../src/lib/func_001AD0E4.c), [whole scenario dispatcher](../../src/lib/func_001A9290.c), and [shared neutral views](../../include/game/scenario_item_views.h). No duplicate final source was exported merely because it matched.

## rectangle-field-mask

Keep command/lower-coordinate bits under FF000FFF before combining the upper coordinate. The worker recorded three nonrelocation rectangle-word differences before the field mask and none after; the final report is raw-relocation-mask exact. The pair also removes unused locals/macros and makes shifts explicitly unsigned, so it is not a single-text-edit experiment. Canonical func_001AD0E4.c is the final example.

- Before: [complete source](../../docs/archive/matching-c-candidates/2026-11-03-func_001AD0E4-21893f9315.c), [dossier](../../docs/dossiers/func_001AD0E4-21893f9315.md), [authenticated observation](../../docs/dossiers/func_001AD0E4-21893f9315.observation.json).

## branch-local-window-store

Move the window-link mutation into each branch after reading the comparison inputs. The complete source pair isolates branch-local mutation, apart from trailing whitespace. The worker observed restored cursor reloads and splice scheduling. This is an intermediate; other dispatcher differences remained.

- Before: [complete source](../../docs/archive/matching-c-candidates/2026-11-03-func_001A9290-d415ab4b5e.c), [dossier](../../docs/dossiers/func_001A9290-d415ab4b5e.md), [authenticated observation](../../docs/dossiers/func_001A9290-d415ab4b5e.observation.json).
- After: [complete source](../../docs/archive/matching-c-candidates/2026-11-03-func_001A9290-2f83c96715.c), [dossier](../../docs/dossiers/func_001A9290-2f83c96715.md), [authenticated observation](../../docs/dossiers/func_001A9290-2f83c96715.observation.json).

## conditional-clamp

Replace assignment inside the if-condition with a conditional expression selecting capped difference or gain. Two clamp expressions change together. The worker observed both gain copies and the 9372-byte extent return; later scheduling/allocation work remained.

- Before: [complete source](../../docs/archive/matching-c-candidates/2026-11-03-func_001A9290-7601f6b75a.c), [dossier](../../docs/dossiers/func_001A9290-7601f6b75a.md), [authenticated observation](../../docs/dossiers/func_001A9290-7601f6b75a.observation.json).
- After: [complete source](../../docs/archive/matching-c-candidates/2026-11-03-func_001A9290-57e02a5589.c), [dossier](../../docs/dossiers/func_001A9290-57e02a5589.md), [authenticated observation](../../docs/dossiers/func_001A9290-57e02a5589.observation.json).

## array-alias-view

Replace separate window globals with a six-slot pointer-array view. The pair changes declarations and accesses across the complete dispatcher, so observed reload changes are context dependent. Separate global and volatile alternatives are counterexamples, not a universal compiler rule.

- Before: [complete source](../../docs/archive/matching-c-candidates/2026-11-03-func_001A9290-77828fd097.c), [dossier](../../docs/dossiers/func_001A9290-77828fd097.md), [authenticated observation](../../docs/dossiers/func_001A9290-77828fd097.observation.json).
- After: [complete source](../../docs/archive/matching-c-candidates/2026-11-03-func_001A9290-d73671b576.c), [dossier](../../docs/dossiers/func_001A9290-d73671b576.md), [authenticated observation](../../docs/dossiers/func_001A9290-d73671b576.observation.json).

## wide-value-mask

Retain a wide value for the range check and a separate masked local for equality comparisons. The worker observed the expected ANDI while the unmasked value still feeds the range expression. The dispatcher remained an intermediate and did not yet match.

- Before: [complete source](../../docs/archive/matching-c-candidates/2026-11-03-func_001A9290-9fec9ced8b.c), [dossier](../../docs/dossiers/func_001A9290-9fec9ced8b.md), [authenticated observation](../../docs/dossiers/func_001A9290-9fec9ced8b.observation.json).
- After: [complete source](../../docs/archive/matching-c-candidates/2026-11-03-func_001A9290-6153564bb8.c), [dossier](../../docs/dossiers/func_001A9290-6153564bb8.md), [authenticated observation](../../docs/dossiers/func_001A9290-6153564bb8.observation.json).

## Evidence and reuse boundaries

The four dispatcher pairs retain both complete intermediate producers because later accepted C contains additional changes and cannot isolate each earlier effect. The rectangle comparison keeps its pre-mask control and uses canonical item feedback as the final example; its original post-mask source remains in ignored retained research for exact historical comparison. Unsigned-shift and declaration cleanup in that pair must not be attributed solely to the mask.

Original native reports and source context are preserved under `build/integration/consumables/c02-closeout/retained-research/`; authenticated observation references bind those exact reports. Their embedded original artifact paths remain historical and corresponding needed private evidence is retained. Published source files were imported and preserved through the existing research API, with source-policy/dependency/reference authentication. Candidate IDs for these imports belong to the current target model; original report candidate IDs remain unchanged.

Do not generalize that volatile accesses, duplicate branches, or conditional expressions always improve a match. Compare complete control flow, alias exposure, expression widths and emitted instructions for the receiving producer. The accepted canonical header reconciles shared interfaces; historical candidate declarations are comparison evidence, not headers to copy into another subsystem.
