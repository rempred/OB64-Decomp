# angr analysis trial independent review R1

**Review verdict: Accepted. Recommendation: Reject adoption as a shared optional analysis or escalation tool for the current matching workflow.**

The evaluation is completed. The evidence answers Joe's complementary-analysis question beside m2c.

angr reproduced several known facts, but it supplied no verified new project fact or faster matching step. Its hard-case execution also stops at unsupported FCSR handling.

The Director may report this recommendation. The Director must not integrate angr or add a matching gate from this review.

## Frozen subject

The review activation is `6e6396cd`. The completed trial is frozen at `1564f62e`.

The reviewed trial report SHA-256 is `47DA21E1C454006D77360AF0839A96A1C0C89657AD4D99A3C74AA4E1BE856CED`.

The 178-file trial manifest SHA-256 is `6CB25A345BCD37BF6D0B8D908C4D8159C3E3CB05FAC0DB3DF065289F63C0C17F`.

The independent references are frozen at `d5e70e12`. Their report SHA-256 is `E5FF81CB0543A9B7D6621E8C197962C61772BE415CBFD298EB9C24107F3627D0`.

The 14-file reference manifest SHA-256 is `6353D4C171CEFFCEA4779FA5DD37C0B77B595928FD3C445D857F5871B7804BF4`.

Every listed trial and reference file passed independent size and SHA-256 checks. All four trial blobs equal their authenticated retail ROM slices.

The reviewer created and read the fresh claim before review writes. All worker evidence remained read-only.

## Claims reviewed

The review tested these material claims:

- raw control-flow graph recovery works for direct branches and simple loops;
- switch recovery needs the missing table and succeeds when given that table;
- bounded symbolic execution correctly validates two selected actual-code behaviors;
- dataflow exposes local hard-case register provenance without solving the compiler blocker;
- default call, prototype, and higher-level structure recovery is incomplete or wrong where reported;
- actual hard-case floating-point execution stops at an unsupported FCSR helper;
- demonstrated benefit does not justify a supported optional role beside m2c.

The review kept three failure classes separate. Missing switch bytes are an input limit.

Incorrect AIL structure is a result defect. FCSR handling is an unsupported execution feature.

## Independent method

The reviewer used the frozen virtual environment without changing it. It contains Python `3.11.15` and angr `9.2.213`.

The reviewer wrote all replay output under `build/angr-analysis-trial-review-r1/`. No worker output was overwritten.

The replay authenticated the ROM, case extents, case bytes, table bytes, reports, and manifests. It then rebuilt focused analyses from the raw blobs.

The replay script is `build/angr-analysis-trial-review-r1/review.py`. Its SHA-256 is `FBBD3029866953663E706DE246E8C60AF69E13F3635720DCD9719044854A683B`.

The result is `build/angr-analysis-trial-review-r1/review-results.json`. Its SHA-256 is `802825AA371A8F3B3FE6B2461005369E47A57F59509F578EC5F5EFEFFC66EA63`.

The first replay failed because the reference manifest uses a top-level array. The corrected reviewer parser supports both observed manifest shapes.

The failed log remains preserved as `review.log`. The successful final replay is `review-r3.log`.

## Results beside m2c

| Capability | Independent result | Complementary value beside m2c |
|---|---|---|
| Small CFG and delay behavior | BFF8 recovered three blocks and both branch edges. | Correct validation, but the accepted C and fresh m2c already contain the result. |
| Simple loops | 34B0 recovered two loops and the expected graph. | Correct structure, but AIL removed loaded call arguments which fresh m2c preserved. |
| Indirect switch | Code-only 197C kept the switch unresolved. Supplied table bytes resolved exactly ten distinct destinations. | Useful assisted CFG, but m2c shows the same code-only failure and table-assisted success. |
| Bounded symbolic execution | BFF8 returned zero on null and the expected symbolic bit on non-null. Six 197C samples returned the expected output. | Reproducible checking works, but every checked behavior was frozen in the independent oracle. |
| Hard-case dataflow | Raw CF0 bytes confirm both allocator, owner-load, return-save sequences. | The project and fresh m2c already expose those sequences. No new dependency or source remedy appeared. |
| Calls and prototypes | Function call-site queries returned zero sites despite `3`, `5`, and `57` raw JAL words. Default prototypes were incomplete or wrong. | Significant adapter work is required before these results can guide matching safely. |
| Higher-level structure | BFF8 AIL can return an uninitialized value. 34B0 calls lose arguments. Assisted 197C duplicates its selector call. | Current AIL output is less reliable than fresh m2c for tested source reconstruction. |
| Floating-point execution | Actual CF0 execution stops at `mips_dirtyhelper_calculate_FCSR_fp32`. | The selected hard-case path cannot be evaluated without a new semantic adapter or fail-closed boundary. |

The independent lift check covered all `1,141` selected MIPS32 words with two-word lookahead. MIPS64 also lifted all `850` CF0 words.

Lift coverage does not prove execution fidelity. The tested MIPS64 calling convention also does not match the observed o32-like game convention.

## Reliability and new evidence

angr was reliable for the tested direct CFG, simple loops, supplied-table targets, and bounded integer paths. These results used actual retail bytes.

The higher-level outputs were not reliable enough for source reconstruction. Default call and prototype inference also omitted known machine facts.

The review found no verified new project fact. The switch targets were supplied assistance, and the bounded symbolic answers already existed in the frozen oracle.

The CF0 local provenance was correct but already present in project evidence and fresh m2c output. It did not resolve the scheduler-ordering blocker.

The supplemental input-retrieval report found historical drafts for three cases. That provenance does not change the trial's fresh, context-free m2c comparison.

## Adaptation and integration assessment

A dependable shared interface would need accepted segment and table mappings. It would also need explicit prototypes, call effects, result checks, and FCSR handling.

The blob CFG currently treats external calls as fake returns. Its function call-site inventory therefore cannot serve as a complete call graph.

The selected MIPS32 model fits the tested 32-bit code. The trial did not validate wide-register operations, CP0, DMA, mutable overlays, or general hardware state.

The isolated installation took about two minutes. Individual successful analyses took seconds, while fresh m2c runs took less than one second.

Setup time alone does not decide adoption. The decisive issue is the absence of demonstrated marginal value after the required adaptation and review work.

## Recommendation and route

Reject adoption for the current optional analysis or escalation role. This recommendation covers a maintained shared workflow capability, not every future isolated experiment.

A larger general trial is not warranted by this sample. It would repeat capabilities already covered by project evidence and m2c without addressing the hard-case limitation.

A future focused task may still use an isolated angr environment for a specific bounded question. That task must identify a supported capability and a missing existing answer.

## Findings, limits, and documentation consequence

No admissible finding was identified. The frozen report states its results and limits accurately.

The symbolic checks use synthetic bounded states. They are not game runtime observations or proofs over unrestricted state.

The supplied function extents, runtime bases, table mapping, and reference answers are assistance. Their recovery does not count as discovery.

This review does not accept C, structure, ownership, compiler behavior, or a matching result. It creates no ordinary matching review gate.

No canonical documentation or shared tooling change follows. The review claim, report, and ignored evidence root are released at terminal handoff.
