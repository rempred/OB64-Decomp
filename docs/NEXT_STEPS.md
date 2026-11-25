# OB64 Decomp — Next Steps

## Current queue

Updated November 25, 2026.

- **Claimed by the OB64 Decomp team — army record ownership.** The formation and post-battle writeback wave joined the accepted helpers and recruitment functions. All three Formation functions have sole C ownership and exact linked bytes. The fresh build reproduced the complete US Rev 0 ROM and the interface scan found zero conflicts across 2,861 producers. The integrator is taking all eight privately matched Display functions through linked placement, interface checks and full-ROM verification, including the 64-byte switch table for `00083C5C`. Independent review reproduced all 26,172 Display text bytes and the complete switch table from the eight objects. The integrator is linking the staged ROM so the reviewer can check the final owners and placements. The Selection worker and Astra Medium advisor continue on `00136C38`. [Formation and writeback](https://github.com/rempred/OB64-Decomp/commit/9b2d76dd30f475a7393fc2960b4f319f9fbf2909) · [Helpers](https://github.com/rempred/OB64-Decomp/commit/68cd4a9859947dff56d05224ebde245cc7df54e5) · [Recruitment and transfers](https://github.com/rempred/OB64-Decomp/commit/b29d16e5925a5053d3d0b54674ad3325d3ad5198) · [All 33 claimed functions](Plans/army-record-ownership-program.md#wave-membership)
- **Boot display-list ownership.** The Decomp side owns a structural follow-up for `emit_rdp_setup_displaylist`. Confirm how to preserve the global and local labels at the same entry before activating its C source. The boot assembly remains the verified owner. [PR #3 closeout and evidence](https://github.com/rempred/OB64-Decomp/pull/3#issuecomment-7068054145)
- **Open Editor requests.** The [Editor family list](Plans/editor-function-families-20261120.md) and [workbench target list](../config/matching-priorities.json) include mission suspend/restore, story sound command `0x6E`, battle amounts, target selection and strike timing. Check the assigned army roster above and follow the [contributor guide](../CONTRIBUTING.md#find-or-request-a-target) to coordinate a claim.
- **Editor follow-up.** The Editor Director integrated Decomp `87530794` in local editor commit `5b46b47`, with an exact retail export and a corrected class-comparison declaration. The Editor Director previously received all 39 accepted PR #3 functions for integration and feature work and will flag issues with the accepted C. Existing work includes the two audio corrections in cutscene preview and ROM export, audible story playback with resident audio state, and the alternate directional-input mode for branch previews. [PR #3 merge](https://github.com/rempred/OB64-Decomp/commit/fa42b5e8465332ffd9731acbfd37c3fbdf3791cc) · [Audio corrections](Plans/c-interface-verification.md#accepted-audio-corrections) · [Prior Editor closeout](https://github.com/rempred/LordlyCaliber/pull/14#issuecomment-7031488087)

## Unresolved source and research scope

- The [descriptor serialization program](Plans/descriptor-serialization-program.md)
  accepted a revised D1 result with a HYBRID_C exact encoder. Its PURE_C objective
  and unknown sixteen-byte tail remain unresolved; future work needs a fresh
  assignment. The accepted hybrid contributes no matching-C credit.
- D450/D484 remain unconverted conditional DDB4 producer evidence. The
  [retained scope roster](Plans/remaining-program-scope-20261011.md) preserves
  their boundaries, explicit interface exclusions and separate semantic gates.
  Its historical worker states do not reopen the completed October program.
- The [boot decompression trial](audit/2026-09-23-boot-decompression-trial.md)
  preserves unfinished owners and source experiments outside its accepted wave.
  Licensed LHa reuse was authorized for that library; custom game routines remain
  independently ROM-derived. Unfinished code is not an accepted assembly exception.
- The [frozen-family restart index](RESUMING_FROZEN_FAMILIES.md) and
  [sequential program](Plans/sequential-main-program.md) retain donor provenance,
  source controls and earlier scope. Check later acceptance before selecting any
  historical remainder; their dated assignments and model instructions are superseded.
- Grouped research export remains an optional tooling limitation recorded by the
  [completed library program](Plans/standard-library-program-draft/PROGRAM.md).
  Preserve its source evidence; this limitation is not unfinished library matching.

## Tooling and research follow-ups

The Director owns reconciliation of the four names for the assembly copy routine at ROM `0x23460`, `func_00023460`, `func_80093060`, `bcopy` and `memcpy`. The Display caller at `0x1AF0A4` passes the source, destination and 52 bytes, then discards the result. Both assembly exits return the original destination. Nine earlier declarations under the same name and 47 under the aliases differ from the Display prototype. Trace uses of the result and reconcile argument order, qualifiers and length types before choosing a shared declaration. [Assembly entry](../asm/original/rev0/lib/memcpy.s) · [Display wave](Plans/army-record-ownership-program.md#wave-membership)

The Director owns a follow-up for four existing callers of the equipment selector table. `000BC684` and `000BEC90` use byte parameters, and `000BF458` and `000BF9C8` use word parameters. All four declare signed results. Reconcile their calls with the four `u32(s32, s32)` providers and verify the affected owners. [Selector declarations](../include/game/class_field_lookups.h)

Two routine test fixtures also fail on the November 24 baseline. The Director owns a test-only follow-up to align the [caller expectation](../tests/c_interface_prospective.js) with the permanent empty exception list and check the two accepted four-byte terminal cuts (rows 2786 and 4320) in the [padding census](../tests/boot_initialized_data.js). [Accepted cut definitions](../config/phase7/conventional-build.json)

The Director also owns two baseline fixture repairs. Reconcile the conflicting checksum declarations in the `owner-function-groups` fixture, and verify the historical source revision used by `late-jump-trace` before updating its expected hash.

The Director also owns restoring historical dependency resolution for the [E04 compiler lesson](dossiers/func_002728C0-5ba3c56c2f.md). Its archived candidate and the two recorded headers reproduce the 4,151-byte compiler input with the pinned preprocessor. The later roster rename changed three declarations, so the current header produces 4,205 bytes and the observation is stale against current inputs. Preserve both identities. [Historical header](https://github.com/rempred/OB64-Decomp/blob/e86969ed/include/game/effect_math_e04.h) · [Rename](https://github.com/rempred/OB64-Decomp/commit/ac88bc9b6ea86d39279eb869c86a65e52ce1cf51)

The [permanent caller check](Plans/c-interface-cleanup.md#four-remaining-compiler-inputs) parses every current compiler input and enforces an empty exception list. The [L4 DMA supplier](Plans/c-interface-cleanup.md#retail-l4-dma-capture) remains a research question pending natural execution of its factory call. Use the current
[private diagnostic workflow](WORKFLOW.md#private-candidate-workers) for candidate
iteration; it now limits work to the target and consumed inputs. The October 2
throughput reports describe an older execution path, not a current bottleneck list.
Later [October 29 acceptance](audit/2026-10-29-attack-p02-integration.md) completed
fresh normal verification in under fifteen minutes, so the old timing goals are
not carried forward as unfinished queue items. Any further performance proposal
needs measurements of the current relevant command, without weakening acceptance.

Retained future directions, subject to concrete scope and evidence:

- Evidence-backed shared-type/header consolidation and knowledge reuse. The
  [initial knowledge/declaration rollout](Plans/knowledge-reuse-workflow-20261002.md)
  is complete; cross-target lookup remains opt-in because usefulness thresholds
  were not met. Broader automatic retrieval remains follow-up work.
- Documentation/intake and archive curation preserving useful source pairs,
  counterexamples, complete producer context and resolvable references.
- A reviewed ready-batch acceptance proposal preserving coupled producers,
  structural dependencies and full-wave reporting; current wave rules still apply.
- Bounded permuter, duplicate-family and original-object-boundary experiments.
  The [matching-methods plan](Plans/matching-methods-improvement-20260904.md)
  retains completed studies and follow-ups; another allocator-family study needs
  a new causal or semantic lead.

Tooling changes retain Director approval, focused adversarial tests, independent
review and their applicable audit. Preserve content-based authentication and the
pinned production compiler. This queue authorizes neither cached acceptance
verdicts nor antivirus exclusions nor a new source-equivalence class.

## Matching priorities: LordlyCaliber leverage

Choose targets for the runtime-hook or workaround complexity they can remove, not
an easy-function percentage increase. `node tools/match.js rank --lane leverage`
is an inspectable starting point, not automatic source activation. Add priority
annotations only for supported subsystem relationships.

Each family plan must cover its complete supported related family, including
functions the Editor does not modify. A first wave limits execution order, not
completion scope. Preserve coupled producers and genuine discovery/structural gates.

| Priority | Scope |
| --- | --- |
| Runtime hooks and patches | Scenario deployment/enemy construction; mission resource loading/DMA and archive relocation; shop resource/inventory loading; High Attack battle-stream paths; Chaos Frame menu/render paths. |
| Current Editor limits | Multi-window mission archives; combat buffer capacity/ownership; deployment limits/group construction; stronghold/scincsv descriptors; map-sprite/class deployment and reserve/active character validation. |
| Broader subsystem leverage | Battle damage/actions, battle AI, event/script interpretation, world-map state, dialogue and audio/resource consumers. |

The [High Attack family plan](Plans/high-attack-battle-stream-families-director-20260902.md)
retains original scope; reconcile its historical queue with accepted work before
assigning more conversions. A useful nonmatching research reconstruction remains
separate from the exact retail baseline. Matching does not establish runtime meaning.

Convert legacy hybrids opportunistically on valuable call graphs or when they
obscure source modification. PURE_C classification, sole ownership, exact target
bytes and the complete-wave exact-ROM proof remain required.

## Explicitly deferred

- Linux toolchain host/CI until Joe decides.
- Another Splat upgrade or compiler/Binutils replacement.
- Rev 1 support or a native-PC/static-recomp project.
- New segmentation or broad boundary reclassification without a structural task.

Completed-program chronology and past worker schedules remain in Git and their
retained plans/audits. They do not enlarge the current assignment.
