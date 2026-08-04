# Next Steps

This is the immediate work queue for the Rev 0 decomp repo. Keep it short and
update it when a task becomes durable, blocked, or complete. Per the AGENTS.md
Documentation Policy, this file holds the QUEUE only — current-state numbers
live in `docs/PLATFORM.md`, the loop summary in
`docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`, and run history in
`docs/DECOMP_LOG.md`. (The pre-dedupe narrative version of this file is
archived as `docs/archive/NEXT_STEPS-full-2026-07-08.md`.)

## Status

Setup, data ownership, and the external-intake program are complete.

The configured code region has 100 composites, 6,184 tracked assembly owners,
and zero generated fallback chunks.

```powershell
$phase5aRoot = '<accepted-phase5a-product-root>'
node tools/verify_setup.js --phase5a-root $phase5aRoot
```

The command currently passes all 21 checks.

Twenty-three independently reviewed matching-C owners are active. They cover
structural functions `func_000E5938`, `func_0000B33C`, `func_00007688`,
`func_0000BC8C`, `func_00269470`, `func_0026B360`, `func_0026B820`,
`func_00003798`, `func_0000A1F8`, `func_0002CBCC`, `func_0025C8A4`,
`func_00008564`, `func_00023970`, `func_0002CB80`, `func_0025CAF0`,
`func_00025000`, `func_0000D994`, `func_0002CD70`, `func_0025DAB0`,
`func_00269798`, `func_000241F8`, `func_0025CB60`, and `func_0025EFC8`.

## Active Goal

Run `OB64-MC-6LW01-20260803` from the accepted twenty-three-owner baseline.
Supply 84 candidates through two Highway queues and six isolated lanes.
Highway Directors lease a candidate only when a lane becomes free. No function
is assigned to a lane in advance.

## Ordered Work

1. **Continuous six-lane matching C.** Lease candidates just in time from each
   Highway's immutable queue. Keep at most one live lease per lane.

2. **Serial checkpoint promotion.** Promote each six-acceptance Highway
   checkpoint through separate Sol worker and independent-review tasks. Start
   every promotion from the newest accepted canonical baseline.

3. **Exact conventional builds.** Use fresh external outputs and authenticated
   Splat, asm-differ, GNU binutils, and KMC prerequisites.

4. **Evidence-based naming.** Keep structural `func_*` names until accepted
   runtime or causal evidence supports gameplay meaning.

5. **Non-code owner promotion.** The first tracked batch is complete
   (`raw_header`, `raw_structural_gap`, ambiguous `raw_tail_data` under
   `data/source-owners/rev0/`). Promote further batches deliberately; keep
   archive gaps raw and explicitly ambiguous unless repeatable scanner
   evidence improves the classification.

6. **Optional decode tracks.** Continue Section C directory work, Section B
   semantics, or Section A sample addressing when explicitly assigned.

7. **Parent-controlled work.** Keep editor, emulator, and research dependencies
   in the parent workspace under its current authority rules.

## Watch Items

- The parent archive catalog has missed whole sections in the past. Keep the
  independent LHA scan in the default coverage gate.
- The `archive/audio` overlap at `0x00925483..0x009254EF` is known and should
  remain visible until reconciled.
- Only the early boot region uses the simple `RAM = ROM + 0x8006FC00` mapping.
  Later code is overlay-loaded and needs overlay-aware address handling.
- Generated files under `build/` and `dist/` are local proof artifacts, not
  source files to commit.
- Patch-workbench candidates on file: chunk-33 `0x21CD48`/`0x21BF84` and
  chunk-31 `0x1F36F0` (`candidate`/`needs-runtime`, RSR-011/RSR-014;
  `docs/patch-workbench/rev0/`).
