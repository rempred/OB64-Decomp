# OB64 Decomp — Canonical Matching Workflow

This document defines the ordinary function-matching loop for *Ogre Battle 64:
Person of Lordly Caliber*, US Rev 0. It assumes the accepted structural model and
toolchain are correct and keeps them unchanged.

Read [the agent guide](../AGENTS.md) first. Source classification is defined by
[the source policy](SOURCE_POLICY.md). If the work changes a boundary, segment,
overlay, placement, executable extent, linker ownership rule, or toolchain
contract, stop using this ordinary workflow and follow
[the structural audit](AUDIT.md).

## The short path

Use internal Astra Medium workers for matching implementation on `main`, with one active matching family and one production source/build writer.
Route retrieval/data-seeking or parsing-only assignments to Sol High under the agent guide's worker-model rule.
Use [the sequential program](Plans/sequential-main-program.md) for current assignments and family order.
Do not create or use concurrent development branches/worktrees. Preserve historical worktrees as read-only evidence.
Independent read-only research/review and explicitly disjoint documentation work may proceed alongside the current family.
Parent top-level task transport procedures do not apply to this decomp program.

After the one-time local setup in [the repository README](../README.md):

```text
node tools/match.js doctor
→ establish a missing setup baseline once
→ choose one accepted target
→ write or adjust its C source
→ node tools/diff.js <symbol>
→ iterate from the linked diff
→ confirm PURE_C and exact relocation contract; record a provisional candidate
→ repeat for the remaining assigned wave targets
→ after the complete wave, node tools/verify.js once
→ confirm every wave target is PURE_C in the final report
→ completed-wave integration; verify changed integration inputs
```

`match.js doctor` is a setup check for the optional research workbench. It needs
the normalized baserom, the configured production compiler/assembler chain, and
the pinned m2c checkout. It does not install any dependency and it does not
verify a source match.

Final full-ROM builds and strict verification occur at the end of a complete
assigned wave, not after each function. `verify.js` builds CURRENT when needed;
do not run a redundant final `build.js` first. The `--target` option still runs
the complete verifier, so it is not a focused per-function alternative.

Provisional function commits can preserve small source history without a final
ROM build. They remain unaccepted until the combined wave passes its final gates.
Do not redefine a multi-function wave as single-function waves to retain the old cadence.
A genuinely standalone function assignment has one wave containing that function.

Ordinary matching-wave completion does not require independent review. Passing
the complete canonical verifier and confirming every assigned target is `PURE_C`
establishes matching acceptance for those exact inputs. A ROM build alone is
insufficient. Director intake confirms scope and the reported proof; it does
not repeat the matching work or require another verifier for independent review.

Structural changes, tooling or verification changes, and new semantic claims
retain their applicable review requirements. Recording actual relocations under
existing linker rules remains ordinary matching work. Reviewing that evidence
does not require a separate reviewer. Route any change to the linker rules or
accepted structural model through the structural workflow.

## Acceptance boundary

The project keeps four kinds of evidence separate:

1. **Matching evidence:** did the linked replacement and complete ROM reproduce
   retail bytes?
2. **Source evidence:** is the source `PURE_C`, `HYBRID_C`, `ASM`, or `UNKNOWN`?
3. **Structural evidence:** are the accepted owner, boundary, placement, and
   linker model correct?
4. **Semantic evidence:** what does the code mean?

An ordinary function counts as matching C only when all of these are true:

```text
verified Rev 0 baserom
+ authenticated pinned toolchain
+ PURE_C source
+ original assembly target excluded from the current link
+ C object is the sole linked owner
+ accepted address and size
+ reviewed load-relevant relocations
+ exact linked target bytes
+ exact complete ROM
= accepted matching C
```

An exact match does not prove a descriptive name, comment, field meaning, or
gameplay explanation. An exact `HYBRID_C` replacement remains matching hybrid;
it is not matching C and does not contribute to the matching-C count.

`BASELINE` is the accepted assembly/data build and structural model that
reconstructs retail Rev 0. `CURRENT` is that baseline with zero or more accepted
assembly owners replaced by C objects. An accepted `CURRENT` must remain byte-exact
with the canonical ROM. Intermediate wave candidates do not establish a new accepted baseline.

## One-time setup

The README lists every local prerequisite. In summary, provide the supported
ROM and authenticated host, compiler, PowerShell, Splat, asm-differ, GNU
Binutils, preprocessing, and m2c dependencies. Then create the ignored local
configuration and normalize the ROM:

```powershell
if (-not (Test-Path config/local-tools.json)) {
  Copy-Item config/local-tools.example.json config/local-tools.json
}
# If copied above, replace its normal-work placeholders.
node tools/verify_baserom.js
node tools/match.js doctor
node tools/build.js
```

The normalization command auto-selects a sole ROM under `baserom/`. If the ROM
exists only at the external path recorded as `romInput`, pass that path directly
with `node tools/verify_baserom.js --input <rom>`; the standalone normalizer does
not load `config/local-tools.json`.

`workRoot` must be outside the repository. `phase5aRoot` is audit-only. The
repository authenticates supplied tools against tracked contracts; it does not
download or install them.

`tools/build.js` creates or reuses a valid accepted structural baseline, builds
all active C replacements, and requires the complete current ROM to equal the
canonical normalized baserom. A build failure caused by tool or ROM identity is
a setup failure to fix, not a verification rule to bypass.

This setup baseline is a one-time prerequisite when missing. Do not repeat it
for each target or when an authenticated existing baseline can be reused.

## Normal matching loop

### 1. Select an accepted target

Work on one assigned target at a time. Use the priorities in
[NEXT_STEPS.md](NEXT_STEPS.md); prefer work that removes a LordlyCaliber hook or
limitation or unlocks a high-value call graph. Function count is a status metric,
not the optimization target.

Confirm that the symbol resolves to one unambiguous accepted logical target with
its complete text-owner mapping, ROM placement, runtime placement, size, and
original assembly. A legitimate logical target can span multiple preserved
owner rows; use its reviewed mapping as-is. Do not reject that mapping or infer
a new boundary from a plausible disassembly during an ordinary match. If the
accepted target or placement appears wrong or ambiguous, stop and open a
structural task.

The optional workbench can inspect or rank accepted targets:

```powershell
node tools/match.js inspect <symbol>
node tools/match.js rank --lane leverage
node tools/match.js rank --explain <symbol>
```

Rankings and family relationships are leads, not structural or semantic proof.

### 2. Reconstruct and activate the source

Create or adjust the target under `src/`. Use the accepted disassembly, callers,
callees, constants, static data, existing types, and relevant repository
research. Independently derive readable, structured C first, then run an early linked diff.
Reuse evidence-backed shared types, fields, and constants where their layouts and meanings are supported.
Keep uncertain meanings explicit; a byte match alone cannot establish them.
Awkward but valid C is allowed when the historical compiler requires it.
Explain necessary compiler workarounds near the affected source, with the observed reason.
Ordinary readability cleanup under existing contracts uses the same wave gates without additional independent review.

At analysis intake for a large or difficult function, prepare or reuse the default Kuna and m2c
outputs with the accepted [standalone analysis-packet command](ANALYSIS_PACKETS.md).
It generates both interpretations from authenticated retail inputs and caches them by input,
tool and option identities. Keep m2c primary and treat both outputs as hypotheses. Request an
alternate Kuna transformation only for a specific ambiguity. Unsupported inputs and missing or
failed tools remain explicit; packet generation is outside compilation and acceptance checks
and does not become a prerequisite for the normal build.

Keep the accepted target symbol unless a `CANONICAL` semantic name is already
established. The original assembly file remains tracked as reference and
fallback, but an active current build must exclude its target and link only the
C replacement.

For a new active target, add the smallest record to
`config/matching-c-targets.json`:

```json
{ "symbol": "func_XXXXXXXX", "source": "src/path/func_XXXXXXXX.c" }
```

Do not duplicate derivable placement, byte, boundary, or owner facts in that
record. Never add a new target to the frozen compatibility file
`config/phase8/matching-c.json`.

Do not paste instructions into C or use register-asm bindings, raw-code
injection, naked-function mechanisms, or section tricks to force a match. The
source-policy tool classifies assembler escape hatches mechanically. If the
assignment requires matching C, the final source must be `PURE_C`.

### 3. Iterate with the canonical linked diff

Run:

```powershell
node tools/diff.js <symbol>
```

`diff.js` prepares the active replacement objects, freshly compiles the
requested target with the authenticated compiler, and links a fresh current
layout at the accepted placements. It reports instruction diagnostics
separately from the raw linked-byte result. The linked-byte result is
authoritative. `EXACT` requires a nonempty pairwise decoded-instruction match and
equal final linked bytes. Missing, duplicate, malformed, or wrong-sized linked
sections fail.

Do not require every experiment to improve the score immediately. Keep the best known candidate
separate from exploratory source snapshots, and allow a supported hypothesis to be tested through
several related changes even when an intermediate result regresses. Record what the experiment
tests and what its result establishes. Prefer "not selected as the current best" for a worse
candidate. A worse score or nonmatching extent rules out that exact candidate for acceptance;
it does not by itself rule out the underlying control-flow or lifetime hypothesis. Closing that
hypothesis requires stronger, stated evidence. Preserve useful intermediate forms and follow-up
questions without weakening final byte, ownership, source-class or full-ROM requirements.

For responsiveness, the diff path may reuse authenticated cached objects from
ignored `build/diff-object-cache/` for unchanged sibling targets. Its cache key
and restored artifact set cover the sibling's authored source, exact
preprocessed compiler input, complete repository-local dependency identities,
source-policy result, accepted
target/linkage contract, compiler and assembler identities and flags,
object-processing implementation, and every restored artifact. A missing,
stale, malformed, or tampered entry is rejected and rebuilt. The requested
target is always compiled fresh, and every diff still freshly constructs and
links the current layout before comparing it. The summary reports sibling
cache hits, misses, rebuilds, and compiler invocations.

Cache reuse is a development optimization only. `verify.js` and CURRENT
verification do not import that cache; they independently perform the fresh
final recompilation and complete-ROM check at wave completion and remain mandatory.
The diff's internal development link remains necessary for relocated target-byte
comparison. It does not authorize a separate final ROM build or full verifier per function.

Use the instruction diff to make one evidence-driven source change at a time.
Source order, control-flow shape, integer widths, expression grouping,
temporaries, and live ranges can change the old compiler's output. Do not force
register allocation with assembly.

Generated diff reports and compiler outputs are ignored evidence. Do not commit
them.

Use evidence from the current invocation. A failed diff can leave an older
`build/diff/<symbol>.json` unchanged. Preserve the failing command's output and
available `--profile` report; do not attribute the older JSON to that attempt.
Before recording a candidate, confirm the report identifies the current source
and compiled artifacts. Process exit and scalar diagnostic scores do not prove
linked-byte equality or a matching relocation contract.

#### Diagnostic boundary

Raw scratch-object words can differ even when the linked instructions do not.
In particular, `j` and `jal` addresses are supplied through relocations. A
scratch score, CFG class, manual word comparison, isolated diagnostic link, or
workbench result labeled exact is useful only for choosing the next experiment.
None proves sole linker ownership, accepted relocation handling, final target
placement, or complete-ROM equality.

Use [the optional workbench reference](MATCHING_WORKBENCH.md) for candidate
generation, experiment history, bounded comparisons, and its diagnostic limits.
The canonical `diff.js` check remains required per target. The `verify.js` gate
remains required for the completed wave.

### 4. Review relocation evidence

Load-relevant relocation equality is part of acceptance because the repository
must support later source modifications, not only reproduce one historical byte
sequence.

For a newly activated target, `diff.js` may show
`Relocation contract ........ MISSING` and print the candidate relocations. This
is expected discovery output, not acceptance. Review the object and linked
result, then add the smallest exact per-target entry to
`config/matching-c-linkage.json`. Use an explicit empty relocation list when the
reviewed object has none.

Do not guess a relocation from disassembled instruction text or copy another
target's record. Internal absolute `j`/`jal` relocations normalize to `.text`.
External function and data symbols must resolve through the shared registry or
an actual linked definition. Exact final bytes with a different or missing
relocation contract are not an accepted mod-ready pure-C replacement.

Rerun `diff.js` after adding the reviewed contract. Strict verification fails if
the entry is absent or if the compiled object later changes.

### 5. Record a provisional target and continue the wave

When the linked diff is exact, run:

```powershell
node tools/source_policy.js --target <symbol>
```

Use the canonical diff report from the current source to confirm linked-byte
`EXACT`, mechanical `PURE_C`, and a matching reviewed relocation contract.
`diff.js` can complete while reporting differences or a missing contract;
successful process exit alone does not establish these conditions.
The diff already records mechanical source classification; a separate policy
command is useful when that evidence needs a focused refresh.

Record the source and evidence under the assigned commit policy, then continue
with the next wave target. Describe this result as a provisional candidate with
an exact linked diff. Do not report accepted matching C or advance accepted counts.
Recheck affected candidates when later source or dependency changes invalidate their evidence.

Do not run `build.js`, `verify.js`, `verify.js --target`, or equivalent full-ROM
acceptance commands after each function. A difficult or blocked member remains
unfinished; it does not silently reduce the wave's completion scope.

### 6. Verify the complete wave

After every assigned wave target is ready, run the complete verifier once:

```powershell
node tools/verify.js
```

The verifier builds CURRENT when needed, independently classifies sources, and then:

1. authenticates the baserom and pinned toolchain;
2. resolves the accepted structural owner uniquely;
3. compiles the source and recreates its source-to-object proof;
4. excludes the original assembly target;
5. proves sole C-object ownership in the linker map;
6. checks address, size, and reviewed load-relevant relocations;
7. compares the final linked target bytes with the baserom; and
8. compares the complete rebuilt ROM byte-for-byte with the baserom.

Confirm every assigned wave target is present and `PURE_C` in this run's
authoritative source-policy report. Use that same report and final ownership,
placement, relocation, target-byte, and complete-ROM evidence for all wave members.
The normal complete command reports `RESULT: EXACT BASELINE`; that result alone
does not establish the requested source class of every wave member.

Do not loop `verify.js --target` over wave members. Each call repeats full-ROM
verification and fresh compilation of all active C replacements.
Do not use global `--require-pure` when the accepted baseline contains legitimate hybrids.
For a standalone one-function wave, `verify.js --target <symbol> --require-pure`
can replace the one final command; it must not be followed by a duplicate full verifier.

### 7. Integrate the completed wave

Preserve unrelated work in a shared checkout. Record the verified wave without
an independent source-review gate. Before recording any scoped commit, inspect:

```powershell
git diff --check
git status --short --branch
```

The final report must identify the exact verified source, tool, and link inputs.
A commit or unchanged handoff alone does not require another build or verifier.
Integrate the completed wave onto the newest accepted canonical base.
If integration changes the verified inputs, run one complete verifier on that
combined final state before acceptance or publication. Do not integrate unfinished
individual candidates as accepted results.
Do not repeat unchanged completed-wave verification solely for independent review.
Separate structural, tooling, or semantic assignments retain their required review.

Commit only the source and smallest necessary configuration or evidence change. Git is
the integration record; ordinary matches do not need promotion manifests,
checkpoint receipts, frozen accepted trees, or separate review packages.

Ordinary matchers must not edit shared tooling. Route independently justified representation defects
to a separate structural/tooling assignment with its applicable audit and independent review.
The remedy must preserve generic invariants and adversarial rejection. A single target's success
does not justify symbol-specific bypasses, fabricated bytes, or source-policy/compiler exceptions.

For that separately assigned tooling work, also run the required routine tooling manifest:

```powershell
node tools/test.js
```

Use `node tools/test.js --list` to inspect its explicit suite list. The routine
runner is not a canonical build, complete-ROM verifier, or structural audit, so
it supplements rather than replaces `verify.js`.

Run `node tools/status.js` after a valid verification state to derive current
`PURE_C`, `HYBRID_C`, and remaining-owner counts. Do not copy changing counts
into prose documents.

## Advanced linkage contracts

Most targets need only one compiler-emitted text function. A reviewed linkage
contract may additionally handle any of these established cases without
rewriting compiler instructions or data:

- one logical C target gaplessly replacing multiple contiguous preserved text
  owners under `config/matching-c-multi-owner.json`;
- multiple compiler-emitted local functions that gaplessly partition one
  accepted text owner; or
- read-only compiler-emitted switch-table fragments assigned to one accepted
  auxiliary row, interleaved with explicitly contracted retained original assembly.

Such a contract must pin the complete symbol or fragment census, section shape,
alignment, bytes, hashes, load-relevant relocations, placement, and ownership.
Local functions do not become new accepted owners or exported aliases.
C fragments and explicit retained ASM intervals must cover the complete auxiliary row in order without gaps or overlaps.
Only the first fragment may retain an exterior prefix; only the final fragment may retain the single exterior tail.
Noninitial fragments may contract an immediately preceding interval through `preservedInteriorBefore`.
Retained interiors support literal data only: the whole original row must have no nonempty REL/RELA sections targeting it.
This restriction includes relocations outside the retained interval; generated retained objects must also have no actual relocations.
Retained bytes remain ASM, not compiler padding or matching-C progress.
See [the accepted retained-interior contract](AUXILIARY_INTERIOR_ASSEMBLY.md) for its full restrictions and review evidence.
Tooling acceptance neither activates a production owner nor accepts an unfinished matching wave.
Writable, executable, conventional `.data`/`.bss`, uncontracted
tails, and rewritten compiler output reject.

The production path retains the exact authenticated KMC input at the target's
source-relative path, the untouched `<symbol>.compiler.s`, the section-assigned
`<symbol>.s`, the raw GNU 2.6 object, the stripped link input, and a
deterministic source-object proof. Strict verification independently
re-preprocesses the authored source, reauthenticates every dependency, and
recreates that proof. See [the source policy](SOURCE_POLICY.md) and
[the toolchain reference](TOOLCHAIN.md) for the detailed compiler-assembly
contract.

## Naming sidecar

Naming does not gate a machine-code match. Use exactly these evidence classes:

1. `CANDIDATE` — an external lead; never a canonical build name.
2. `SUPPORTED_ALIAS` — independently supported by static evidence.
3. `CANONICAL` — established by runtime evidence, controlled mutation, or
   recognized SDK/library proof.

During matching, inspect the body, callers, callees, strings, and data accesses
for a possible `SUPPORTED_ALIAS`, but leave the build symbol address-named when
evidence is insufficient. Only a `CANONICAL` name may replace it. Perform a
canonical rename as a scoped semantic change and rerun the linked diff and
source-policy checks. Include its complete-ROM proof in the final wave verification.

## Stop or change workflows

Stop the ordinary loop and report the concrete evidence when:

- the baserom or pinned toolchain cannot be authenticated;
- the accepted owner cannot be resolved uniquely;
- the boundary, overlay, placement, executable classification, or linker model
  appears wrong;
- original assembly may still be linked or C ownership is ambiguous;
- target placement, relocation structure, target bytes, or full-ROM bytes
  differ at a claimed completion point;
- source classification is `UNKNOWN`; or
- a semantic claim exceeds the available evidence.

Open a structural task for structural changes. Keep a nonmatching pure-C
reconstruction clearly labeled outside the exact baseline. An exact
`HYBRID_C` fallback is final for a pure-C assignment only when the function most
likely requires assembly inherently or a genuine pure-C attempt has a concrete,
documented blocker. Size, scheduling difficulty, or exact hybrid bytes alone are
not sufficient.

For a modified game, begin from a known-exact retail baseline, make the
intentional change, and use changed-byte, layout, and emulator/runtime tests.
Modified-ROM acceptance must not require retail equality, and retail equality
does not prove modified behavior.

## Optional references

- [MATCHING_WORKBENCH.md](MATCHING_WORKBENCH.md) — generated candidate research,
  history, diagnostics, sweeps, and limits.
- [KMC_GCC_MATCHING_NOTES.md](KMC_GCC_MATCHING_NOTES.md) — reproduced,
  target-scoped compiler matching observations.
- [templates/matching-c-agent-prompt-guide.md](templates/matching-c-agent-prompt-guide.md)
  — a concise prompt for an assigned one-function task.
- [tools/README.md](../tools/README.md) — repository tool index.

## Text representation evidence

Strict outputs use linkage schema 4, source-object proof 4, layout 2, and build/verification/manifest 5. Each target carries independently derived textContract, objectEvidence, and linkEvidence. Stale outputs must be rebuilt. CURRENT fingerprints use version 7; verified state and fresh compilation use version 5.

Ordinary section assignment and existing auxiliary contracts retain their behavior. The bounded nativeTextTail descriptor permits untouched compiler assembly with a 1132-byte function inside its 1136-byte, 16-aligned native text owner. The four zero bytes must come from assembler alignment. Full-owner bytes, sole ownership, relocations, and the entire ROM must still match. The art routine `func_00204A70` is active in the canonical target registry.

Shared-header compatibility defaults to current version-5 evidence on both sides. Use `--historical-v3-v4` only for the retained historical migration; it cannot bridge older evidence into version 5.

## Compilation-group workflow

General compilation-group tooling does not activate a source wave. A separately assigned source wave must activate every group member together and retain all existing owner boundaries and public entries. Activation is provisional until the complete wave passes the canonical verifier; ordinary activation under accepted contracts requires no additional independent source review.

Edit the group's one authored translation unit, then run `node tools/diff.js <member>`. The diff compiles the requested member's whole group once. Unchanged sibling groups use one authenticated producer cache bundle, with member views validated against that bundle. Cache schema 4 includes group contracts, all authenticated source dependencies and producer implementations. CURRENT fingerprint version 7 includes the group registry.

The canonical diff compares the selected complete owner and freshly links all active members. Group admission requires its reviewed raw text and relocation contract. Changing that contract is explicit provisional source-wave work; failed producer checks must not be described as an exact diff. The optional standalone workbench rejects grouped members until it supports complete group candidates.

Strict verification recreates group artifacts and retains separate member proofs. One group object contributes each accepted owner section exactly once. A complete wave receives one final verifier; neither tooling acceptance nor a successful isolated group fixture accepts production members.
