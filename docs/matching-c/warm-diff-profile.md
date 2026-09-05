# Warm canonical diff profile

Status: initially measured on 2026-09-04 and remeasured on 2026-09-05 after the
authenticated shared-header/compilation-input contract was accepted. Both
measurements used the existing opt-in profiler and changed no matching source,
validation rule, linker rule, or verifier during their respective timing
windows.

## Post-header result

Three unchanged warm runs of `func_000E5938` at reviewed commit
`7967afd848a6b3861d3ca9d6e38a191d9018f4af` averaged **76.931 seconds**.
The range was 72.373–82.901 seconds and the sample standard deviation was 5.405
seconds. All three runs retained 525 sibling hits, zero misses, zero rebuilds,
one fresh requested-target compilation, an exact relocation contract, and exact
linked target bytes.

The earlier comparable mean was 49.020 seconds. The observed increase is
27.911 seconds (56.9%). This is a measured wall-time regression in these two
three-run samples; it is not by itself proof that any single new operation
caused the whole difference.

Source classification moved from the old `classify-target-sources` stage into
`prepare-context`. Comparing those stage labels separately would falsely show
that classification disappeared. The correct combined comparison is
`prepare-context + classify-target-sources`: it increased from 26.271 to 49.351
seconds. The 528 `mips64-elf-cpp.exe` children did **not** get slower on average;
their mean changed from 18.828 to 18.628 seconds. The combined in-process
remainder around context preparation and classification increased from 7.443
to 30.723 seconds, a 23.280-second change.

### Final identity and settlement

The final reviewed implementation had no compatible retained sibling-cache
entry: older schema-2 entries had current source records and target contracts,
but none contained the final `tools/lib/source_policy.js` implementation hash.
Old cache generations were retained. One untimed normal diff therefore settled
the final generation with 525 misses, zero rebuilt entries, 526 compiler
invocations, and exact target bytes. No compilation-affecting tracked input
changed before or between the three warm samples.

| Identity | Value in all post-header runs |
| --- | --- |
| Git commit at measurement start | `7967afd848a6b3861d3ca9d6e38a191d9018f4af` |
| Baseline fingerprint | `56E27189080D91C8379A230080DCDE902DCC66331EFD4C848530CF9EEAA1D316` |
| CURRENT fingerprint | `31FF15A006879795686EB01A23501BC856FE7C9BA47C127798BACE5937ABB99F` |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| 526-target source/compilation-input digest | `B54FC361D53305AE2BA570EDE7357523272EF0AE1C78E33B9AFD4669B1B7DD46` |
| Source-policy config SHA-256 | `DDE42407BF4DE59078977D1A81C9C72246DB0D5C082EE3829AD8778FB3ACB2C3` |
| `tools/lib/source_policy.js` SHA-256 | `2B35B133C3F4403C1026E3FC47FA17D43855C02E1BF3B68FAD3D26932EEA8DAB` |
| `tools/lib/phase8_matching_c.js` SHA-256 | `D2FE05DCE4AF72CE6535F19F37B52286903A6382DBB1F579E16390EAE55CE8E0` |
| Sibling-cache key digest | `F00D66CAE828AE869E3BA8A4B96E57FF5E1732FB17B6E8ADD01992AF00904A43` |
| Sibling-cache entry/census digest | `D02E2502B6189EC4DAE6BA364181F292643FE56761F9191C122296F4A93282F5` |

The selected target remained `PURE_C`. Its authored source SHA-256 was
`8663465B420CE2BCCE4085D552FD88DAD194041ECEEA7AA15EECA6BC7C698FB5`;
its authenticated compilation input was 345 bytes with SHA-256
`7B3A3CEEDE08AC4E532E1823050EB64C98C622CF7F6232C663B9CE016C35B9F6`.
It had no header dependency itself. The warm sibling set included the four
accepted `ClassEntry` pilot sources that authenticate
`include/game/class_entry.h`.

Generated post-header evidence is ignored under `build/warm-diff-profile/`:

- `func_000E5938-20260905022139755-21716.json`
- `func_000E5938-20260905022308311-27308.json`
- `func_000E5938-20260905022426326-29104.json`

### Exact outcomes and variability

| Check | Result in each post-header run |
| --- | --- |
| Sibling object cache | 525 hits, 0 misses, 0 rebuilt |
| Compiler invocations | 1; requested target freshly compiled |
| Source policy | 460 `PURE_C`, 66 `HYBRID_C`, 0 `ASM`, 0 `UNKNOWN` |
| Decoded instruction score | 0 / 900, pairwise exact |
| Raw linked bytes | exact, 0 differing bytes/words |
| Relocation contract | match |
| Linked and expected target SHA-256 | `26256054A9F77DAD786308548B96966D4E7A3385975A9E989CEE70DBF0268789` |

| Metric | Run 1 | Run 2 | Run 3 | Mean | Min–max | Sample SD |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Profiled total (s) | 82.901 | 72.373 | 75.519 | 76.931 | 72.373–82.901 | 5.405 |
| Child-process wall (s) | 35.439 | 31.164 | 30.384 | 32.329 | 30.384–35.439 | 2.721 |
| In-process remainder (s) | 47.463 | 41.208 | 45.135 | 44.602 | 41.208–47.463 | 3.161 |
| Combined prepare/classify (s) | 52.549 | 45.127 | 50.377 | 49.351 | 45.127–52.549 | 3.816 |
| Preprocessor child wall (s) | 20.345 | 17.639 | 17.899 | 18.628 | 17.639–20.345 | 1.493 |

The post-header total range was 10.529 seconds (13.7% of the mean), much larger
than the earlier 2.123-second range. Both child and in-process work varied. The
samples establish a slower and less stable observed baseline, but three runs do
not distinguish machine/filesystem variability from variability introduced by
a particular new host-side operation.

### Comparable before/after attribution

| Metric | Pre-header mean (s) | Post-header mean (s) | Change (s) |
| --- | ---: | ---: | ---: |
| Total wall | 49.020 | 76.931 | +27.911 |
| Child-process wall | 30.911 | 32.329 | +1.418 |
| In-process remainder | 18.109 | 44.602 | +26.493 |
| Combined prepare/classify | 26.271 | 49.351 | +23.080 |
| `cpp` child wall, 528 calls | 18.828 | 18.628 | -0.200 |
| Combined prepare/classify minus `cpp` | 7.443 | 30.723 | +23.280 |
| Warm sibling-cache stage | 9.125 | 11.845 | +2.720 |
| Fresh link stage | 9.381 | 11.040 | +1.658 |

The stage move is therefore not reported as a speedup. The directly observed
localization is host-side work inside the combined context/classification
boundary. The profiler does not subdivide that work into directory lifecycle,
path authentication, depfile parsing, dependency hashing, source scanning, or
CURRENT-fingerprint construction, so it does not prove which of those is
responsible for the 23.280-second increase.

The fresh link also averaged 1.658 seconds slower even though the comparison
target and accepted placement were unchanged. Its three-run range was 1.822
seconds. That increase cannot be causally assigned to the compilation-input
contract from these samples and is retained as observed interval variability.

### Post-header top-level and child attribution

| Top-level stage | Mean (s) | Min–max (s) | Mean share |
| --- | ---: | ---: | ---: |
| Prepare context + retrieve its classification result | 49.351 | 45.127–52.549 | 64.1% |
| Authenticate/materialize warm siblings and compile requested target | 11.845 | 10.743–13.157 | 15.4% |
| Link Phase 8 | 11.040 | 10.092–11.914 | 14.4% |
| Copy and prune Phase 7 objects | 1.997 | 1.691–2.526 | 2.6% |
| Verify Phase 7 input | 0.892 | 0.860–0.944 | 1.2% |
| Verify runtime tools | 0.764 | 0.708–0.874 | 1.0% |
| Compare target | 0.693 | 0.612–0.830 | 0.9% |
| Write object manifest | 0.269 | 0.230–0.328 | 0.4% |
| All remaining top-level stages | 0.080 | — | 0.1% |

| Owning stage and executable | Calls/run | Mean wall (s) | Share of child time |
| --- | ---: | ---: | ---: |
| Prepare/classify: `mips64-elf-cpp.exe` | 528 | 18.628 | 57.6% |
| Link: `mips-kmc-elf-ld.exe` | 1 | 10.400 | 32.2% |
| Phase 7 copy/prune: `mips-kmc-elf-objcopy.exe` | 43 | 1.667 | 5.2% |
| Runtime authentication: `powershell.exe` | 1 | 0.576 | 1.8% |
| Link ROM extraction: `mips-kmc-elf-objcopy.exe` | 1 | 0.460 | 1.4% |
| Target comparison: `python.exe` | 1 | 0.431 | 1.3% |
| All remaining child calls | 5 | 0.167 | 0.5% |

The requested-target compiler, assembler, and `objcopy` children averaged
0.091 seconds combined; the complete requested-compile substage averaged 0.110
seconds. Fresh requested-target compilation remains immaterial to the total.

### Schema-2 sibling-cache cost

The schema-2 cache now authenticates and materializes an exact
`compilation-input.c` artifact in addition to the earlier artifacts. The
profiler does not time that file separately, so the following categories are
inclusive rather than causal attribution to that file alone.

| Nested work | Pre-header mean (s) | Post-header mean (s) | Change (s) |
| --- | ---: | ---: | ---: |
| Validate 525 cached entries/artifacts | 3.892 | 4.623 | +0.731 |
| Copy authenticated artifacts to fresh output | 2.866 | 3.796 | +0.930 |
| Reinspect copied object evidence | 1.937 | 2.263 | +0.326 |
| Source/dependency key checks, postchecks, final sweep | 0.267 | 0.875 | +0.608 |
| Fresh requested-target compile | 0.095 | 0.110 | +0.016 |
| Seals and remaining parent work | 0.068 | 0.177 | +0.109 |
| Complete cache stage | 9.125 | 11.845 | +2.720 |

The first three artifact categories increased collectively from 8.696 to
10.682 seconds (+1.986 seconds). The additional compilation-input artifact is
present in those paths, but filesystem variability also changed across the
samples; the profile does not assign the complete difference to the new file.
No result justifies weakening dependency, artifact, copied-output, or seal
validation.

### Evidence boundary and recommendation

Measured facts:

- post-header total wall time is higher in every sample than the earlier
  maximum, and its variability is also higher;
- the same 528 preprocessor children averaged 0.200 seconds less, so the
  23.280-second combined context/classification host increase is not child wait;
- the schema-2 cache authentication/materialization stage took 2.720 seconds longer on average,
  including 1.986 seconds across the three broad artifact paths; and
- every input identity, cache census, relocation result, and exact target hash
  was stable across all three runs.

Code-path inference, not measured micro-attribution:

- the accepted classifier now performs per-target temporary-directory and
  depfile lifecycle work, repeated repository/include/source path checks,
  depfile parsing, and dependency authentication; and
- one or more of those host-side responsibilities is the likely source of most
  of the combined-stage increase, but the present profiler cannot rank them.

The next bounded optimization should be a **run-scoped preprocessing context**
for `classifyTargetSources`: authenticate invariant repository/include roots
once, allocate one safely bounded temporary workspace for the complete
sequential classification pass, and use a fresh uniquely named depfile for each
target within it. Keep every one of the 526 preprocessing invocations fresh;
keep exact stdout bytes, authored-source identities, complete dependency
identities, and fail-closed cleanup; and leave CURRENT, cache-key, compiler, and
verifier contracts unchanged. This is lifecycle reuse, not classification or
compilation-input caching.

Before accepting that change, add narrow substage timings for workspace setup,
path validation, depfile parsing/dependency hashing, and cleanup, then repeat
this same settlement-plus-three-run protocol. The measured upper opportunity is
the 23.280-second host-side increase, not a promised saving. If the run-scoped
context does not materially reduce that boundary, retain the contract and use
the narrower timings to select the next host-side operation. No optimization
was implemented by this measurement.

## Pre-header baseline

The remainder of this document preserves the initial three-run measurement and
its then-current recommendation as historical evidence. The post-header result
above supersedes that recommendation for the next optimization decision.

## Pre-header method and measurement boundary

The target and command were fixed:

```powershell
node tools/diff.js --profile func_000E5938
```

Because the profiling implementation participates in the sibling object's
authenticated implementation identity, one unprofiled settlement run populated
the new cache keys first. It completed with 525 misses, zero rebuilt entries,
526 compiler invocations, and exact target bytes. No source, tool, configuration,
or profiling code changed after that settlement run.

Three profiled runs then ran during a director-coordinated quiet interval. Each
used a monotonic `process.hrtime.bigint()` clock. Top-level stage times are
inclusive. Cache substages are nested within `compile-diff-targets` and must not
be added to the top-level total. Child-process time measures wall time spent in
every synchronous `spawnSync` call and is already included in its owning stage;
it is not a CPU-time measurement or an additional cost.

The profiled total begins after CLI argument parsing and ends after the ordinary
diff summary plus timing-metadata collection. It excludes serialization of the
timing report itself and the three timing-only console lines. Those excluded
operations occur after the ordinary diff has completed and do not affect the
stage conclusions.

Generated evidence is ignored under `build/warm-diff-profile/`:

- `func_000E5938-20260904223642890-33988.json`
- `func_000E5938-20260904223738273-34476.json`
- `func_000E5938-20260904223831295-33068.json`

## Pre-header reproducibility and unchanged identities

All three timing reports independently recorded the same identities and cache
census. The base Git commit was
`80c817ed0fe41048d6cf40911b44eb8a4d585206`; because the profiler was an
uncommitted measurement addition, its exact implementation hashes are recorded
separately rather than treating the commit alone as the tree identity.

| Identity | Value in all three runs |
| --- | --- |
| Baseline fingerprint | `56E27189080D91C8379A230080DCDE902DCC66331EFD4C848530CF9EEAA1D316` |
| Current-build fingerprint | `E11BD35A93A80756C22A7B60AAAB8F8815FCD5EF2EE68B59CBD522165F250C76` |
| Canonical baseline ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| 526-target source-policy identity digest | `6CFD49509503A4594B710700D45089D5122A3D88B5BC33F54E766FFF12758A64` |
| Preprocessor executable SHA-256 | `56D276AE66F2F499FAD2454663E8B5B82B20D5D7C44A4116349C096780FFF927` |
| KMC compiler SHA-256 | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Sibling-cache key digest | `59C085E14D24CB051F1DEF09AD5B6C51DAB9C3F5772AF8EF4DAE091CB5C60BC6` |
| Sibling-cache entry/census digest | `7DA52E3F5230C74F9C95C7300EF147E14C53456E8B6FBD202A2ACB463C260A92` |
| `tools/diff.js` SHA-256 | `1911D5579A725FBC788310BF1F23596422C665BDDB7A0B33AD70AEA4E1F08866` |
| `tools/lib/diff_object_cache.js` SHA-256 | `F4535D8538169283AA7184ED5AF35FB886193BAB991463C046DADC66073289C7` |
| `tools/lib/diff_profile.js` SHA-256 | `CA8F3A3708C1328F48A11A2FF38CD6F3929028EFC5B961E2C337EB9B8C3F09CB` |

These are the historical implementation identities embedded in the retained
measurement reports. A bounded post-measurement review correction subsequently
changed only profiler failure attribution so a signal-terminated child is
counted as failed. The retained runs precede that correction and were not
relabeled or regenerated. None of their child processes failed or terminated by
signal, so the correction does not alter their recorded durations, census, or
exact outcomes.

The timing reports also record the complete path-independent runtime, compiler,
GNU 2.6 toolchain, source-policy preprocessor closure, and eight-file diff/cache
implementation identities. Source-policy classification was 460 `PURE_C`, 66
`HYBRID_C`, zero `ASM`, and zero `UNKNOWN` in every run.

## Pre-header validity and exact outcome

Every warm run had the same acceptance-relevant outcome:

| Check | Result in each run |
| --- | --- |
| Requested target | `func_000E5938`, `PURE_C` |
| Sibling cache | 525 hits, 0 misses, 0 rebuilt |
| Compiler invocations | 1; requested target freshly compiled |
| Decoded instruction score | 0 / 900, pairwise exact |
| Raw linked bytes | exact, 0 differing bytes/words |
| Relocation contract | match |
| Linked and expected target SHA-256 | `26256054A9F77DAD786308548B96966D4E7A3385975A9E989CEE70DBF0268789` |

This is target-diff evidence, not a replacement for the complete-ROM verifier.
The normal verifier was not changed or bypassed.

## Pre-header wall-time variability

| Metric | Run 1 | Run 2 | Run 3 | Mean | Min–max | Sample SD |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Profiled total (s) | 49.819 | 47.696 | 49.546 | 49.020 | 47.696–49.819 | 1.155 |
| Child-process wall (s) | 31.347 | 29.725 | 31.661 | 30.911 | 29.725–31.661 | 1.039 |
| In-process remainder (s) | 18.472 | 17.971 | 17.885 | 18.109 | 17.885–18.472 | 0.317 |

The total range was 2.123 seconds (4.3% of the mean), while the sample standard
deviation was 2.4% of the mean. Most variability was in child processes. In
particular, `link-phase8` ranged from 8.231 to 10.395 seconds while the warm
cache stage ranged only from 9.031 to 9.240 seconds.

## Pre-header top-level stage attribution

| Stage | Mean (s) | Min–max (s) | Mean share |
| --- | ---: | ---: | ---: |
| Classify all target sources | 19.066 | 18.659–19.407 | 38.9% |
| Link Phase 8 | 9.381 | 8.231–10.395 | 19.1% |
| Compile requested target / authenticate and materialize sibling cache | 9.125 | 9.031–9.240 | 18.6% |
| Prepare context | 7.204 | 7.088–7.400 | 14.7% |
| Copy and prune Phase 7 objects | 1.964 | 1.845–2.112 | 4.0% |
| Verify runtime tools | 0.742 | 0.733–0.756 | 1.5% |
| Compare target | 0.626 | 0.608–0.643 | 1.3% |
| Verify Phase 7 input | 0.609 | 0.579–0.633 | 1.2% |
| Write object manifest | 0.243 | 0.242–0.245 | 0.5% |
| All remaining top-level stages | 0.059 | — | 0.1% |

The four largest stages account for 91.3% of mean wall time. No child process
was observed during `prepare-context`; this profile does not subdivide that
7.204-second in-process stage, so attributing it to any particular parser,
hash, or model check would require a separate measurement.

## Pre-header child-process attribution

| Owning stage and executable | Calls/run | Mean wall (s) | Share of all child time |
| --- | ---: | ---: | ---: |
| Source classification: `mips64-elf-cpp.exe` | 528 | 18.828 | 60.9% |
| Link: `mips-kmc-elf-ld.exe` | 1 | 8.804 | 28.5% |
| Phase 7 copy/prune: `mips-kmc-elf-objcopy.exe` | 43 | 1.659 | 5.4% |
| Runtime authentication: `powershell.exe` | 1 | 0.576 | 1.9% |
| Link ROM extraction: `mips-kmc-elf-objcopy.exe` | 1 | 0.465 | 1.5% |
| Target comparison: `python.exe` | 1 | 0.420 | 1.4% |
| All remaining child calls | 5 | 0.159 | 0.5% |

Code inspection explains the 528 source-policy calls as two authenticated
preprocessor/dependency probes followed by one preprocessing invocation for
each of 526 targets. That explanation is a code-path observation; the measured
facts are the call count and 18.828-second child total.

The freshly compiled requested target used one `cc1.exe`, one assembler, and
one `objcopy` child. Their combined mean was 0.088 seconds. Including in-process
work, the complete requested-target compile substage averaged 0.095 seconds.
Fresh requested-target compilation is therefore not a material cause of the
remaining warm latency.

## Pre-header warm sibling-cache attribution

The 9.125-second `compile-diff-targets` stage is mostly authenticated cache
handling rather than compilation:

| Nested work | Calls/run | Mean (s) | Share of cache stage |
| --- | ---: | ---: | ---: |
| Validate cached entries and artifacts | 525 | 3.892 | 42.7% |
| Copy authenticated artifacts to the fresh output | 525 | 2.866 | 31.4% |
| Reinspect copied ELF/section/symbol/relocation evidence | 525 | 1.937 | 21.2% |
| Verify source and construct cache keys | 525 | 0.119 | 1.3% |
| Fresh requested-target compilation | 1 | 0.095 | 1.0% |
| Source postchecks and final source sweep | 525 + 1 full sweep | 0.148 | 1.6% |
| Seal checks and remaining parent work | — | 0.067 | 0.7% |

This measurement does not justify weakening entry validation, copied-output
validation, source seals, or the fresh-link rule. Those checks are the evidence
that warm reuse did not silently change the accepted target.

## Pre-header measured facts versus inference

Measured facts:

- full source classification is the single largest stage and almost all of it
  is synchronous preprocessor child time;
- the fresh requested target costs about 0.095 seconds, not tens of seconds;
- the canonical linker and authenticated sibling-cache path each cost about
  nine seconds, but linker variability is substantially higher;
- three stable identity/census runs all produced the same exact linked target;
  and
- `prepare-context` is a significant in-process stage, but this profile does
  not resolve its internal cause.

Bounded inference:

- reusing authenticated unchanged sibling classifications has a measured
  upper-bound opportunity near the 18.8 seconds spent in 525 sibling
  preprocesses; cache lookup and dependency authentication would consume some
  of that upper bound;
- keeping the requested target fresh should preserve immediate feedback for
  the file being edited while still removing nearly all repeated sibling
  preprocess launches; and
- the resulting warm time must be measured after implementation. This profile
  does not claim a guaranteed 18.8-second improvement.

## Earlier recommendation (superseded)

The initial measurement recommended the following diff-only classification
cache. It is retained as historical context and is superseded by the
post-header run-scoped preprocessing-context recommendation above.

The proposed change was to add a diff-only classification cache beside, not
inside the acceptance
verifier. A safe entry should be keyed and sealed by at least:

- the exact raw source identity;
- every included header or other preprocessing dependency identity;
- the authenticated preprocessor executable closure, version, flags, and
  include search path;
- `config/source-policy.json` and matching-compiler manifest identities; and
- the source-policy/cache implementation identity.

On a hit, reconstruct the same classification record and aggregate census; on
any missing, extra, changed, or ambiguous dependency, run the existing
classifier and publish a new entry. Always classify the requested target
freshly. Keep normal `node tools/diff.js <symbol>` output unchanged, keep
`node tools/verify.js` independent and fresh, and prove source/header/tool/
config corruption invalidation before benchmarking.

This recommendation is smaller and better supported than changing linker
ownership or weakening the existing sibling-object validation. It directly
targets the largest measured stage while preserving the project's separation
between diagnostic speed and acceptance evidence.
