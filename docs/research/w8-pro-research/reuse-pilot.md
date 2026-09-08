# W8 reusable source-context pilot

Five exact authored C states can now be retrieved, preserved and replayed without regenerating
the R7 search. These are research candidates, not accepted replacements. D037 alone is labelled
the current emitted-best control; the other four remain unselected.

| Import order / state | Exact authored source | Curated observation | Context and frozen observation |
|---|---|---|---|
| 1. R7 integer/shared | [7e434ec440.c](../../archive/matching-c-candidates/2026-09-08-func_001F3C00-7e434ec440.c) | [Metadata](../../dossiers/func_001F3C00-7e434ec440.observation.json) | E1/P1/T0, integer endpoint: frame 512, 30 accessed homes, extent 6736 |
| 2. R7 short/shared | [7fa66212d4.c](../../archive/matching-c-candidates/2026-09-08-func_001F3C00-7fa66212d4.c) | [Metadata](../../dossiers/func_001F3C00-7fa66212d4.observation.json) | Nearest counterexample: short endpoint, shared completion, frame 504, 29 homes, extent 6720 |
| 3. R7 integer/local | [cd8cffb3cd.c](../../archive/matching-c-candidates/2026-09-08-func_001F3C00-cd8cffb3cd.c) | [Metadata](../../dossiers/func_001F3C00-cd8cffb3cd.observation.json) | Integer endpoint without its spill: frame 504, 29 homes, extent 6716 |
| 4. D037 control | [519474319f.c](../../archive/matching-c-candidates/2026-09-08-func_001F3C00-519474319f.c) | [Metadata](../../dossiers/func_001F3C00-519474319f.observation.json) | Different preserved context; frame 504, 29 homes, extent 6740 |
| 5. D037 local | [5d96002940.c](../../archive/matching-c-candidates/2026-09-08-func_001F3C00-5d96002940.c) | [Metadata](../../dossiers/func_001F3C00-5d96002940.observation.json) | Transfer: frame/homes unchanged, extent 6704; late WIDTH tail sharing |

Each metadata file has a same-stem Markdown dossier. The integer R7 pair differs only in the
three outer completion locals and final store placement. The short/shared counterexample
shows why frame reduction alone cannot identify that relation. D037 retains its distinct
`primaryEnd` and other context: transferring locality changes late sharing without removing
an endpoint spill. None of the nonexact extents is selected as an improvement.

The allocation and linked-diff claims above are retained evidence from the
[R7 report](../../Plans/task-logs/combat-draw-wave8-r7.md) and
[R8 report](../../Plans/task-logs/combat-draw-wave8-r8.md), authenticated by reference hashes
in each observation. Input-specific endpoint pseudos 923/927 are meaningful only for their
respective exact source/expanded hashes. They are not stable identities across source states.

## Fresh-store reuse

Run from the repository root with normal configured tools. This recipe consumes only tracked
archives and metadata, writes temporary authored JSON under ignored build, and imports in
dependency order. It does not require the original R7/R8 build directories.

```javascript
// Run with Node (save this recipe under build, or pass it to node).
const fs = require('fs'), cp = require('child_process');
const ids = ['7e434ec440','7fa66212d4','cd8cffb3cd','519474319f','5d96002940'];
fs.mkdirSync('build/w8-reimport', { recursive: true });
for (const id of ids) {
  const metadata = JSON.parse(fs.readFileSync(`docs/dossiers/func_001F3C00-${id}.observation.json`));
  const authored = `build/w8-reimport/${id}.json`;
  fs.writeFileSync(authored, JSON.stringify(metadata.authored, null, 2));
  const result = cp.spawnSync(process.execPath, ['tools/match.js', 'import', 'func_001F3C00',
    '--source', metadata.source, '--observation', authored, '--json'], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  console.log(result.stdout);
}
```

An empty isolated store was exercised with exactly these tracked `.authored` records and
archive paths. All five candidate IDs remained identical; observation IDs legitimately changed
with archive provenance. Fresh preprocessing reproduced all expected source/expanded/header
identities. All four dependency identities are recorded in every envelope. References and
headers must still match; drift rejects instead of silently rewriting historical expectations.

```text
node tools/match.js observations func_001F3C00 --effect endpoint-spill --limit 20 --json
node tools/match.js observations func_001F3C00 --effect d037-transfer --limit 20 --json
node tools/match.js observations func_001F3C00 --effect integer-endpoint-no-spill --limit 20 --json
node tools/match.js probe func_001F3C00 --source docs/archive/matching-c-candidates/2026-09-08-func_001F3C00-cd8cffb3cd.c --json
```

## Replay result and limits

All five archived sources passed the accepted probe's 13 requested dumps and exact expanded
hash checks. Their complete pinned assembly agreed with each corresponding frozen pinned
control after removing only `.file` and known compiler-option comment lines and normalizing
CRLF. No registers, pseudo numbers, instructions or labels were normalized. This reproduces
the compiler result, not semantic or matching acceptance. HOME observations remain explicitly
attributed to the frozen instrumented traces; generic probe does not emit those instrumentation events.

Ignored evidence is under `build/w8-reuse-pilot-r1/`: `pilot-imports.json`, bounded `query-*.json`,
`replay-results.json`, `roundtrip.sqlite` and the independently authored pilot scripts.
Probe artifacts remain under `build/matching/targets/func_001F3C00/probes/<probeId>/`.
The first replay compiled successfully before a private script field-name assertion failed;
its corrected replay was an authenticated cache hit. The other four were fresh compiles.

Measured initial preparation/authentication was 10.007 s and import/export was 5.506 s.
Probe-reported compiler invocation/authentication durations totalled 1.423 s for the five
inputs, including the initial cached input's originating invocation. No percentages or
reasoning-time estimates are inferred. Import/export produced no compile rows; independent
tests also intercepted KMC invocation and observed zero codegen calls. Preprocessing and
SQLite subprocesses are expected. Full-ROM verification was not run for this diagnostic task.
