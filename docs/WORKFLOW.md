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

After the one-time local setup in [the repository README](../README.md):

```text
node tools/match.js doctor
→ node tools/build.js
→ choose one accepted target
→ write or adjust its C source
→ node tools/diff.js <symbol>
→ iterate from the linked diff
→ node tools/verify.js --target <symbol> --require-pure
→ after integration, node tools/verify.js
→ commit
```

`match.js doctor` is a setup check for the optional research workbench. It needs
the normalized baserom, the configured production compiler/assembler chain, and
the pinned m2c checkout. It does not install any dependency and it does not
verify a source match.

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
assembly owners replaced by C objects. `CURRENT` must always remain byte-exact
with the canonical ROM.

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
research. Prefer the simplest plausible C, then run an early diff. Awkward but
valid C is allowed when it is needed to reproduce the historical compiler's
output.

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

For responsiveness, the diff path may reuse authenticated cached objects from
ignored `build/diff-object-cache/` for unchanged sibling targets. Its cache key
covers the sibling's exact source and source-policy result, accepted
target/linkage contract, compiler and assembler identities and flags,
object-processing implementation, and every restored artifact. A missing,
stale, malformed, or tampered entry is rejected and rebuilt. The requested
target is always compiled fresh, and every diff still freshly constructs and
links the current layout before comparing it. The summary reports sibling
cache hits, misses, rebuilds, and compiler invocations.

Cache reuse is a development optimization only. `verify.js` and CURRENT
verification do not import that cache; they independently perform the fresh
final recompilation and complete-ROM check and remain mandatory.

Use the instruction diff to make one evidence-driven source change at a time.
Source order, control-flow shape, integer widths, expression grouping,
temporaries, and live ranges can change the old compiler's output. Do not force
register allocation with assembly.

Generated diff reports and compiler outputs are ignored evidence. Do not commit
them.

#### Diagnostic boundary

Raw scratch-object words can differ even when the linked instructions do not.
In particular, `j` and `jal` addresses are supplied through relocations. A
scratch score, CFG class, manual word comparison, isolated diagnostic link, or
workbench result labeled exact is useful only for choosing the next experiment.
None proves sole linker ownership, accepted relocation handling, final target
placement, or complete-ROM equality.

Use [the optional workbench reference](MATCHING_WORKBENCH.md) for candidate
generation, experiment history, bounded comparisons, and its diagnostic limits.
The canonical `diff.js` and `verify.js` gates remain required.

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

### 5. Run the target gate

When the linked diff is exact, run:

```powershell
node tools/source_policy.js --target <symbol>
node tools/verify.js --target <symbol> --require-pure
```

The standalone source-policy command is a useful focused check. The verifier
independently performs the authoritative classification and then:

1. authenticates the baserom and pinned toolchain;
2. resolves the accepted structural owner uniquely;
3. compiles the source and recreates its source-to-object proof;
4. excludes the original assembly target;
5. proves sole C-object ownership in the linker map;
6. checks address, size, and reviewed load-relevant relocations;
7. compares the final linked target bytes with the baserom; and
8. compares the complete rebuilt ROM byte-for-byte with the baserom.

The target option is not a partial-ROM check. The requested pure-C result is
accepted only when the command ends with `RESULT: MATCHING C`. `--require-pure`
must fail for `HYBRID_C`, even when the target and full ROM are exact.

### 6. Integrate and commit

Preserve unrelated work in a shared checkout. Before committing or accepting an
integrated change, run:

```powershell
node tools/verify.js
git diff --check
git status --short --branch
```

The complete verifier checks all active replacements and the full ROM. Commit
only the source and smallest necessary configuration or evidence change. Git is
the integration record; ordinary matches do not need promotion manifests,
checkpoint receipts, frozen accepted trees, or separate review packages.

When the contribution changes matching tools or their contracts, also run the
required routine tooling manifest:

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
- one read-only compiler-emitted switch-table fragment assigned to an accepted
  auxiliary row, with at most one exact preserved assembly tail.

Such a contract must pin the complete symbol or fragment census, section shape,
alignment, bytes, hashes, load-relevant relocations, placement, and ownership.
Local functions do not become new accepted owners or exported aliases. Adjacent
fragments sharing one auxiliary row must cover it in linker order without gaps
or overlaps. Writable, executable, conventional `.data`/`.bss`, uncontracted
tails, and rewritten compiler output reject.

The production path retains the untouched `<symbol>.compiler.s`, the
section-assigned `<symbol>.s`, the raw GNU 2.6 object, the stripped link input,
and a deterministic source-object proof. Strict verification recreates that
proof. See [the source policy](SOURCE_POLICY.md) and
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
canonical rename as a scoped semantic change and rerun the normal target and
complete-ROM verifiers.

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
