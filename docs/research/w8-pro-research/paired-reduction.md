# W8 bounded paired reduction

Eight common surrounding deletions all retained the R7 integer endpoint allocation difference.
The shared-completion side still spills the endpoint; the localized-completion side retains real
consumers without assigning it a HOME. This is a modest bounded reduction: each source loses
3,201 bytes (64 newline-terminated lines), from 19,031/19,230 to 15,830/16,029 bytes.
It is neither a minimal reproducer nor a game-equivalent replacement.

| State | Shared endpoint / frame / HOME | Local endpoint / frame / HOME |
|---|---|---|
| Original before | 923 / 512 / 452 | 927 / 504 / none |
| Remove matrix setup | 871 / 512 / 452 | 875 / 504 / none |
| Remove leading packets | 854 / 512 / 452 | 858 / 504 / none |
| Remove optional preload | 772 / 496 / 444 | 776 / 488 / none |
| Remove color-mask adjustment | 729 / 496 / 444 | 733 / 488 / none |
| Remove per-item color adjustment | 677 / 488 / 436 | 681 / 480 / none |
| Remove scale adjustment | 658 / 488 / 428 | 662 / 480 / none |
| Remove scale command | 650 / 480 / 428 | 654 / 472 / none |
| Remove final packets | 650 / 480 / 428 | 654 / 472 / none |
| Original restored after | 923 / 512 / 452 | 927 / 504 / none |

Numbers are decimal and input-specific. The final shared HOME has two emitted `sw` and five
`lw` accesses at its dynamically recovered offset; the local endpoint has no HOME. Frame size
alone is not the predicate. Same-pair, reversed-pair and short-endpoint controls reject; the
short source has no unique SI endpoint matching the required structure. All eight deletions
were retained, so there are no predicate-failing deletion intermediates in this bounded run.

## Exact sources and meaning

- Reduced shared: [authored C](../../archive/matching-c-candidates/2026-09-08-func_001F3C00-fac5b37493.c),
  [observation](../../dossiers/func_001F3C00-fac5b37493.observation.json).
- Reduced local: [authored C](../../archive/matching-c-candidates/2026-09-08-func_001F3C00-a15ff37d65.c),
  [observation](../../dossiers/func_001F3C00-a15ff37d65.observation.json).
- The [five-state pilot](reuse-pilot.md) retains both original parents, the short counterexample
  and the distinct D037 transfer context. Import those parents first, then shared reduction,
  then local reduction using the pilot's `.authored` extraction recipe.

Each side preserves its exact LF source bytes from `strip = (short)capacity;` through
`rows_done: PAIR(0xD8380002, 0x40);`, including vertex construction, endpoint calculation,
packet stores and row-loop consumers. The core SHA-256 values are
`6161B60D5CA891F8313F8F4FF782F2642B5501DA64581A636D2F8B6AD7C999BC` (shared) and
`76BD2D2876AC1EBA0FFB12A9DF6E05E4E463A10D4743186E7F4F68C55CCCAE00` (local).
The pair retains its original outer-local/store-placement difference. The study removes whole
common statements outside this region; input/decode/header/stride/capacity/geometry and loop
initialization remain. It introduces no replacement values, dummy references or padding.
Omitted graphics/color/matrix effects mean these functions are research artifacts, not game replacements.

The endpoint is located anew in each initial RTL: the unique `reg/v:SI` assigned twice from
`AND 4095`, then directly copied into another `reg/v:SI`, with OR consumers of both values.
The lreg stage must retain actual OR source consumers; definitions of the pseudo as a set
destination do not count. Instrumented HOME events identify the
same pseudo; final pinned assembly must contain both load and store accesses to its unique
HOME offset on the shared side. No endpoint HOME is allowed on the local side. Numeric IDs
or frame thresholds do not select the endpoint.

Every one of the 21 compiled inputs has pinned/tracer emission agreement, allowing only the
known diagnostic `-da` compiler-option comment difference. All four header identities agree
with the preserved pilot. Original full-source pinned output before and after is byte-identical
both to itself and to the corresponding frozen R7 pinned output. This establishes return to
the original pair's compiler observation, not a semantic explanation or D037 improvement.

D037 is still the explicit transfer limit: locality did not remove a spill there and produced
6704 instead of 6740 bytes through late tail sharing. These eight removed units are unnecessary
for the R7 distinction in the retained context; this does not prove which remaining context
causes it. A future discriminator would compare the retained core's endpoint consumer/lifetime
structure with D037 while holding the row/packet core fixed. No such new source permutations
were run here, and no universal locality recipe follows from this result.

## Reproduce and evidence

```text
node tests/w8_paired_reduction.js
node tools/matching_studies/w8-paired-reduction.js build/w8-paired-reduction-r1/new-replay
```

The narrow study requires the authenticated local pinned/tracer binaries already used by R7/R8,
the tracked original pilot archives, configured source-policy preprocessor, and current protected
input inventory. It rejects an existing output directory. It executes exactly eight fixed
common-deletion choices plus baseline/negative controls; it is not a general reducer.

Authoritative ignored evidence: `build/w8-paired-reduction-r1/replay-r2/study.json`, per-input
`analysis.json`, authored/expanded sources, assembly and dumps. An earlier `run/` is preserved;
its top-level trial row accidentally nested each pair twice. The corrected fixed replay reproduced
all eight outcomes with flat left/right rows and shape assertions. No additional variant choices
were introduced. Review then tightened source-position consumer checks; `replay-r2` reproduced
the same matrix with that correction. `preserved.json` binds the selected results to the final
import/preserve exports; superseded export metadata remains under `previous-exports/`.

Corrected replay measured 0.014 s initial file/tool preparation, 4.104 s in 42 compiler subprocesses,
and 7.641 s overall. Classification, evidence I/O and other orchestration occupy the remaining
interval; interpretation/reporting were not timed separately. The earlier run measured 4.905 s
compiler and 9.279 s overall. No estimated percentages are asserted. All twenty protected
production inputs remain unchanged. No runtime or full-ROM verifier was run.
