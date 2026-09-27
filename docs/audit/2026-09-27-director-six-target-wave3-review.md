# Independent review: Director six-target assignment, wave 3 (dispatcher) completion

Reviewer: YellowMarsh (Claude Fable), thread B1-001. Subject: SilentCrane's (Astra) wave-3 completion, message 247, worklog [silentcrane-six-target-assignment-20260927.md](../Plans/task-logs/silentcrane-six-target-assignment-20260927.md). Review performed read-only 2026-09-27 08:25–08:35 UTC against the preserved capture `build/silentcrane-dispatcher-wave3/verification-completion/`.

Verdict: **PASS.** All six assigned targets (`func_002ACF08`, `func_002ABB3C`, `func_002ACA3C`, `func_000E5968`, `func_000E6D90`, `func_00284288`) plus the three helpers touched by the program (`func_000ead04`, `func_0029DF04`, `func_002A053C`) are PURE_C, one owner each, byte-exact, with matched relocation contracts, in a full-ROM-exact build. Nothing is committed; Joe decides.

## Checks (independent tooling: my own hashing, my own cc1/as/objdump runs, git diffs)

- `verification.json` status pass; `state.json` fingerprint `40747B64…FD88`, verified 2026-09-27T08:24:10.726Z, rom sha `571E8339…CC67A`; `verification.log` ends `RESULT: EXACT BASELINE` with PURE_C exact 594 functions / 136556 bytes (wave 2: 593 / 128556; the delta is exactly the 8000-byte dispatcher, helpers were already PURE_C).
- The verifier's own output ROM `…/current/40747b64ad769f0eeb9868ef/build/phase8.us_rev0.z64` (41943040 B) hashes to `571E8339…CC67A` by my computation, equal to `build/baserom.us_rev0.z64`.
- `input-identities.json`: all 11 pinned hashes (linkage, targets, nine sources) equal the files on disk by my recomputation, including the dispatcher's `161574EF…8F7C1`.
- `all-assigned-and-helpers.json`: nine rows, each one owner, `rawBytesExact`, 0 differing bytes/words, linked = expected sha. Dispatcher owner `.ob64.r5115`, ROM 0x284288..0x2861C8, VRAM 0x802282B8.
- `relocation-contracts.json`: `matches: true` for all nine, accepted = verified = fresh counts (dispatcher 467). The earlier focused record `exact-canonical-diff.json` honestly keeps its pre-recording empty contract. My own object from the pinned cc1 and kmc as yields the same 467 (offset, type, symbol) triples.
- `fresh-compilation.json`, `build-report.json`, `source-policy.json` all status pass.
- Config scope vs HEAD: `config/matching-c-targets.json` +9/−1 (eight program entries, one trailing comma); `config/matching-c-linkage.json` +7648/−1 (the same eight entries plus address rows). No existing entry changed.
- Helpers: `func_0029DF04` (`u8` → `int` return, `(u8)` inside) and `func_002A053C` (`short` → `int` parameter, `(short)` store) are prototype-width changes with unchanged bytes (retail hashes recomputed from the baserom: `6A3DF740…`, `28C3CDDF…`); the only other declarations, in the dispatcher, agree.
- Production dispatcher source: compiled by me outside the workbench (comment strip, pinned flags, kmc as, ld with the scratch symbol script) to the retail 8000-byte sha `6C7AA473…4D88`. Style: no asm/attributes/pragmas/volatile, explicit-width externs, commented 0x95→0x8E fall-through, no m2c temp names; 25 shared labels and per-command locals are within SOURCE_POLICY.

## Notes

- Scratch-link evidence (`late-aa-b6-increments` and successors) was a native isolated link; acceptance rests on the canonical capture above, not on the scratch bytes.
- Mechanisms learned in this program are recorded in [director-helpers-fable-worklog-20260927.md](../Plans/task-logs/director-helpers-fable-worklog-20260927.md) (fold reassociation, parameter width, sched launch priority, global struct base, cse re-scan, delay-slot threading, alias heuristic, neighbour-tail cross-jumping).
