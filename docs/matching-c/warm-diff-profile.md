# Warm canonical diff profile

Status: completed on 2026-09-04. This study measured the existing authenticated
warm-diff path. It added opt-in timing diagnostics, but it did not change a
matching source, source-policy decision, validation rule, linker rule, or verifier.

## Result

Three unchanged warm runs of `func_000E5938` averaged **49.020 seconds**. The
range was 47.696–49.819 seconds, with a sample standard deviation of 1.155
seconds. Synchronous child processes accounted for 30.911 seconds on average
(63.1%); in-process work accounted for the remaining 18.109 seconds.

The largest measured stage was full active-target source classification:
19.066 seconds (38.9%). Its 528 authenticated preprocessor child invocations
accounted for 18.828 seconds. The other large stages were the fresh canonical
link at 9.381 seconds, authenticated sibling-cache handling at 9.125 seconds,
and context preparation at 7.204 seconds.

The smallest justified next performance change is therefore an authenticated,
diff-only per-target source-classification cache. It should keep the requested
target freshly classified, preserve the existing source-policy implementation
as the cache-miss oracle, authenticate every source/header dependency and tool
input, and leave `verify.js` unchanged. This is a recommendation, not an
implemented optimization.

## Method and measurement boundary

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

## Reproducibility and unchanged identities

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

## Validity and exact outcome

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

## Wall-time variability

| Metric | Run 1 | Run 2 | Run 3 | Mean | Min–max | Sample SD |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Profiled total (s) | 49.819 | 47.696 | 49.546 | 49.020 | 47.696–49.819 | 1.155 |
| Child-process wall (s) | 31.347 | 29.725 | 31.661 | 30.911 | 29.725–31.661 | 1.039 |
| In-process remainder (s) | 18.472 | 17.971 | 17.885 | 18.109 | 17.885–18.472 | 0.317 |

The total range was 2.123 seconds (4.3% of the mean), while the sample standard
deviation was 2.4% of the mean. Most variability was in child processes. In
particular, `link-phase8` ranged from 8.231 to 10.395 seconds while the warm
cache stage ranged only from 9.031 to 9.240 seconds.

## Top-level stage attribution

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

## Child-process attribution

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

## Warm sibling-cache attribution

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

## Measured facts versus inference

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

## One recommended next change

Add a diff-only classification cache beside, not inside the acceptance
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
