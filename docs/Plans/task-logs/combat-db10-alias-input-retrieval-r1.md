# DB10 alias-input retrieval

## Outcome and scope

Status: completed.

The refreshed search found two authored local array-pointer alias declarations.
It also found one expanded compiler input containing the newer alias form.
It also found two pointer-parameter forms whose inclusion under “local alias” is lexically ambiguous.
The exact excerpts let the production owner avoid repeating these saved forms.
The production owner `/root/combat_draw_continuation` is the next actor after handoff.

## Baseline identities

- Assignment revision: `1`
- Launch: `COMBAT-DB10-ALIAS-INPUT-RETRIEVAL-20260907-01`
- Repository branch: `main`
- Repository HEAD: `f0977e40c0aeb40bc92f6564d01181d65f3afbf8`
- Frozen control report SHA256: `C2270251CE66E64FA8C485ED2BF0D2EFF7B64C923EF3D3531CA4DC741D1CDC22`
- Current authored source expected SHA256: `5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3`

Baseline unrelated changes were present in `docs/Plans/task-logs/combat-draw-wave8-r2.md`,
`tools/total_resolver/tests/bridge_110_harness.js`, and
`tools/total_resolver/tests/test_startup_wire.py`. This task does not touch them.

## Method

The inventory used `rg --files` first and then read direct files only.
The initial snapshot searched 96 R1 files and 27 R2 files named `func_0020DB10.*.c`.
The Director then ran and preserved one authorized DB10 alias trial.
The refreshed snapshot searched 96 R1 files and 29 R2 files.
It did not recurse into compiler, pass, or capture trees.

The search checked pointer declarations and assignments against `sources`, `contexts`,
`resources`, `variants`, and `flag10s`. It also checked helper pointer parameters because
that lexical form could be read as a local alias.

The refreshed sorted path/hash inventory digest is
`0A73402881BA927582AA07D2E50A1B2C6E6E15224F5BC16B7D5DF1FB489CE56B`.
The initial 123-file digest is retained in the evidence artifact.
The artifact defines both snapshots and the exact UTF-8 serialization.

## Retrieved forms

### Definite in-function alias declaration

`build/combat-draw-wave8-r1/func_0020DB10.named-sort-bases.c` has SHA256
`0D30080F69E50ED4D9DFA54C03661BB21BBC12AEB0E4426EC0C223A2D4D47FCC`.
Its macros remain defined and invoked, so the file directly presents as authored saved source.
Its frozen copy under the assigned evidence root has the same SHA256.

Line 327 is the only definite local array-pointer alias declaration:

```c
int *sourceList = sources, *contextList = contexts, *variantList = variants;
```

Its dedup-loop entry has no separate current-style entry guard:

```c
337: variant = func_00045934(HALF(actor,0x36), HALF(actor,0x38), HALF(actor,0x3A), HALF(actor,0x3C)) & 0xFFFF;
338: flag8 = (FLAGS(actor) >> 8) & 1;
339: flag10 = (FLAGS(actor) >> 10) & 1;
340: for (index = 0; index < count; index++) {
341:     if (WORD(actor,0x48) == sourceList[index] && variant == variantList[index] &&
342:         flag10 == flag10s[index] && flag8 == flag8s[index]) break;
343: }
344: if (index < count) goto next_actor;
```

No local aliases for `resources` or `flag10s` occur in this source.

### Current authored comparison

`src/lib/func_0020DB10.c` has SHA256
`5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3`.
It contains no local array-pointer alias declaration or assignment for the named arrays.

Its dedup entry spells the additional guard literally:

```c
339: index = 0;
340: if (index < count) {
341: for (; index < count; index++) {
342:     if (WORD(actor,0x48) == sources[index] && variant == variants[index] &&
343:         flag10 == flag10s[index] && flag8 == flag8s[index]) break;
344: }
345: }
346: if (index < count) goto next_actor;
```

### Later guarded source/context/resource alias trial

The files in this section appeared after the initial 123-file retrieval.
The Director identified them as one authorized trial that failed and was preserved.
The production source was then restored to SHA256
`5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3`.

The authored saved source is
`build/combat-draw-wave8-r2/func_0020DB10.guarded-source-context-resource-aliases.c`.
Its SHA256 is `4EEBE52C7969122FA46B32A543DDCEE7BA0835DDEA2928AFB0213E03D2063738`.

Lines 327–328 declare these aliases:

```c
int *sourceList = sources, *contextList = contexts;
u32 *resourceList = resources;
```

Its dedup entry retains the current guard:

```c
341: index = 0;
342: if (index < count) {
343: for (; index < count; index++) {
344:     if (WORD(actor,0x48) == sourceList[index] && variant == variants[index] &&
345:         flag10 == flag10s[index] && flag8 == flag8s[index]) break;
346: }
347: }
348: if (index < count) goto next_actor;
```

The mutable expanded input was observed at
`build/combat-draw-wave8-r2/func_0020DB10.input.c`.
Its observed SHA256 is `CD523367BF51982A8472F3187A9D261106487B03369F162AEC4F9E06E31FBC47`.
Lines 249–250 contain the same literal alias declarations.
Lines 263–270 contain the same guard shape with expanded access expressions.

Exact copies bind both observed inputs after their scratch paths change:

- `build/combat-db10-alias-input-retrieval-r1/copies/func_0020DB10.guarded-source-context-resource-aliases.c`
  has SHA256 `4EEBE52C7969122FA46B32A543DDCEE7BA0835DDEA2928AFB0213E03D2063738`.
- `build/combat-db10-alias-input-retrieval-r1/copies/func_0020DB10.guarded-source-context-resource-aliases.input.c`
  has SHA256 `CD523367BF51982A8472F3187A9D261106487B03369F162AEC4F9E06E31FBC47`.

### Lexically adjacent pointer-parameter forms

`build/combat-draw-wave8-r1/func_0020DB10.inline-duplicate-search.c` has SHA256
`EC835078E8D45E6E6845C7C5E74B17B03555D2B14099F1957F4A5C8378F7A64D`.
Its helper declares pointer parameters at lines 148–149:

```c
static __inline__ int find_existing(void *actor, int variant, int flag10, int flag8,
                                    int *sources, int *variants, int *flag10s, int *flag8s, u32 count)
```

The helper owns the unguarded `for (index = 0; index < count; index++)` at line 152.
Line 350 passes `sources`, `variants`, and `flag10s` from `func_0020DB10`.
These are helper parameters, not alias initializers inside `func_0020DB10`.

`build/combat-draw-wave8-r2/func_0020DB10.submission-run-helper.c` has SHA256
`3734D8669829F19CF09B772DF22193FCD9338D61D8DC54D3D74053670F61A2FB`.
Line 148 declares `same_run(u32 *resources, ...)`.
Line 382 passes `resources` during the later submission run.
Its dedup entry retains the current guard spelling at lines 341–348.

Both files retain macro definitions and unexpanded invocations.
The evidence artifact keeps their literal declarations, calls, and bounded guard excerpts.
Their frozen copies under the assigned evidence root have the same respective SHA256 values.

### Expanded input and exact duplicates

`build/combat-draw-wave8-r1/func_0020DB10.best-linked.input.c` has SHA256
`E9280D970F8CFFE1CAB7AD40438903C8F7297FFEFDD53CA25E4112C597879268`.
Expanded expressions are present while macro definitions and invocations are absent.
No named alias declaration or assignment occurs in that expanded compiler input.

The refreshed 125-file inventory has one exact-byte duplicate group:

- SHA256 `632AFD6E59B04F304B06D5BAA5725F7A44BA77F4C01D5D194D5DAB20ED09E7AC`
- `build/combat-draw-wave8-r1/func_0020DB10.pre-count-induction.c`
- `build/combat-draw-wave8-r1/func_0020DB10.shared-final-counter.c`

Neither duplicate contains a literal local array-pointer alias declaration or assignment.
The authored alias sources, expanded alias input, and pointer-parameter sources have unique hashes.

## Evidence index

- Claim: `docs/Plans/task-logs/combat-db10-alias-input-retrieval-r1.claim.json`
  SHA256 `6667E6DCF5386F2C086C44FC6DAA561DD5AF6D540A196EE69CC71FC60D138CE3`.
- Inventory: `build/combat-db10-alias-input-retrieval-r1/inventory.json`
  SHA256 `80E5C82223C2F91547BAD2096C471704F6442605CA9E66E0DF24D7D718F5D7DB`.
- Frozen control report: `docs/Plans/task-logs/combat-db10-retained-base-control-r1.md`
  SHA256 `C2270251CE66E64FA8C485ED2BF0D2EFF7B64C923EF3D3531CA4DC741D1CDC22`.

Observation claim: the recorded declarations, guards, paths, hashes, counts, and duplicate group
are direct source-text and file-identity observations. Evidence grade is `Verified`.
Review status is `pending`.

## Limits and next action

The initial result is limited to 123 direct saved sources in the two named roots.
The refreshed result is limited to 125 direct saved sources after the authorized trial.
It makes no semantic, compiler-output, frame, matching, or trial-success claim.
It does not state whether any unsearched source form exists elsewhere.

This retrieval performed no compilation, source trial, canonical build, diff, verifier,
runtime, GUI, Git mutation, or subagent creation. No protocol deviation occurred.

Changed surfaces are the assigned permanent claim, this report, and the assigned ignored evidence root.
No canonical document change is proposed. All task writes are released for Director intake.
