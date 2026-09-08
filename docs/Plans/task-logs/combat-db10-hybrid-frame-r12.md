# DB10: hybrid frame control with a remaining preheader difference

This stable R12 record preserves a useful nonexact intermediate under Joe's 2026-09-08 allowance for minimal HYBRID_C completion of the three unresolved W8 targets. It changes neither production ownership nor completed-wave acceptance. Production remains the preserved 5BF6 pure-C reference while source experiments continue.

## Connected source pair

| Source | Authored SHA-256 | Result |
| --- | --- | --- |
| [Existing pure-C reference](../../dossiers/func_0020DB10-6d3b02845b.md) | `5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3` | 5548 bytes, frame 552, 41 differing bytes / 28 words |
| R12 two-reservations hybrid | `001325A764EEE6220538455E38F3485773981FBF867A5F310981C0BEC0AFE7FA` | 5548 bytes, frame 560, 19 differing bytes / six words |

The hybrid's compiler-input SHA-256 is `03378D9645DB0462B4DFC403ECE7F14D87987A7AD7D4AA72FB691C671FA3C674`. Its curated observation names the existing pure-C candidate as parent. Use `node tools/match.js intake func_0020DB10 --limit 50 --json` to retrieve the exact pair and distinguish valid archived records from any stale local-store observations.

## Source mechanism

Four added source lines declare two opaque assembly scratch scalars inside the existing count guard, define them through an empty general-output template, clobber saved registers after the actual update work, and consume the scalars through an empty general-input template. All three assembly templates are empty. No explicit instruction, data or padding is injected, and no compiler output is rewritten. These scalars are assembly frame controls, not identified original C locals or game fields.

The two simultaneous lifetimes leave one quantity in register 30 and give the other an unaccessed reload home. The corresponding one-scalar control stayed in register 30 and did not increase the frame. The successful exact-input diagnostic reproduces the pinned compiler's emission. It records accessed homes at 460, 468, 484 and 492 bytes from the stack pointer, and unaccessed homes at 476, 500, 508 and 516. The new home is at 500; the earlier accessed positions remain unchanged. This compiler rounds each scalar home to eight bytes, accounting for the frame increase from 552 to 560.

The canonical focused report verifies one 5548-byte C-object contribution, no fallback contribution or fill, the existing placement, all 209 relocation words and the unchanged relocation contract. It still reports nonexact target bytes. All six remaining differing words lie in the sort preheader: the current counter clear precedes five otherwise matching base-address operations, whereas retail places the clear after them. Fixing the frame does not fix that ordering.

## Reproduction evidence and limits

The immutable authored source, policy, private result and canonical focused report are under ignored `build/combat-draw-wave8-r12/db10/two-reservations/`; exact-input diagnostics are under `build/combat-draw-wave8-r12/db10-traces/two-reservations/`. The focused report SHA-256 is `7F27D8860B3FD5330C59D955A845D873D73E2E614EA32131C9A849445E26B446`; the trace analysis SHA-256 is `E5EDEBDC478BA904700B552D8A3F7DE5869A549EF79BB6E9C29327F0A01BC190`. The focused command took 183168 ms with 600 sibling cache hits, one sibling cache miss and two compiler invocations in total. It restored production 5BF6 afterward.

This observation establishes a candidate-specific hybrid frame mechanism and a smaller residual. It does not explain the original source of the unused home, prove a general compiler recipe, select the candidate as active source, or establish HYBRID_C exact. All fourteen W8 targets still require their assigned source classes and the one completed-wave full-ROM verifier.
