# OB64 Decomp — Canonical Workflow

## Goal

Produce a reproducible source tree for *Ogre Battle 64: Person of Lordly Caliber* US Rev 0.

For the matching baseline, source must rebuild the canonical normalized retail ROM byte-for-byte.

The workflow intentionally separates:

1. **matching evidence** — did the source produce the retail machine code?
2. **source evidence** — is the claimed C actually C rather than embedded assembly?
3. **structural evidence** — are boundaries, overlays, placement, and ownership correct?
4. **semantic evidence** — do we understand what the code means?

Do not make an ordinary matching-C contribution carry all four evidence burdens.

---

## Acceptance Principle

For an ordinary function to count as matching C:

```text
KNOWN REV 0 BASEROM
        +
PINNED MATCHING TOOLCHAIN
        +
PURE_C SOURCE
        +
ORIGINAL ASM TARGET EXCLUDED
        +
C OBJECT IS SOLE LINKED OWNER
        +
TARGET ADDRESS/SIZE CORRECT
        +
RELOCATION POLICY SATISFIED
        +
LINKED TARGET BYTES EXACT
        +
COMPLETE ROM EXACT
        =
MATCHING C ACCEPTED
```

This is machine-verifiable. A separate human or AI reviewer is not required to prove the
machine-code match.

A matching result does **not** prove a descriptive function name, field name, comment, or gameplay
explanation.

---

## Canonical Concepts

### Baseline

`BASELINE` means the accepted structural assembly/data build that reconstructs retail Rev 0.

It owns the accepted:

- ROM identity;
- section/segment model;
- overlay model;
- function/data owner model;
- linker layout; and
- toolchain contract.

Historical Phase 5A/5B/6/7 terminology remains in some retained implementation
internals and archives, but normal contributors do not need it.

### Current

`CURRENT` means `BASELINE` with zero or more accepted assembly owners replaced by C sources.

The complete `CURRENT` matching build must still equal the retail ROM exactly.

---

## Evidence Classes

### Matching evidence

A target is exact when:

- the original assembly implementation for that target is not linked;
- the replacement object is the sole linked owner;
- the linked bytes equal the baserom target bytes; and
- the complete ROM equals the baserom.

The verifier should also check accepted address/size and normalized relocations.

### Source evidence

Source classification is defined in `docs/SOURCE_POLICY.md`.

An exact `.c` file can be `HYBRID_C`. Exact output alone does not make it decompiled C.

Only exact `PURE_C` targets contribute to matching-C progress.

### Compiler assembly and source-to-object evidence

The build classifies every active target before compilation. `UNKNOWN` and `ASM` reject before the
matching compiler runs. The source class is unchanged by later toolchain stages.

The authenticated Windows KMC GCC 2.7.2 compiler emits `<symbol>.compiler.s`. The build preserves
that file untouched. Ordinarily it derives `<symbol>.s` only by replacing the sole `.text`
directive with the accepted target-section directive. A target-specific reviewed linkage contract
may instead assign the exact compiler-emitted `.text` regions and one read-only switch-table
`.rodata` region to accepted output sections. That contract fixes section type/flags, alignment,
size, object and linked hashes, normalized relocations, ROM/VMA placement, and ownership. The
assignment changes section directives only; instructions, labels, table entries, and relocations
remain untouched. If the table replaces only a prefix of an accepted assembly data row, the
contract preserves the remainder through a unique read-only `PROGBITS` input section with exact
bytes, ROM/VMA placement, and assembly ownership; conventional `.data` and `.bss` vessels reject.
The pinned GNU 2.6 assembler consumes the section-assigned file directly.

Each active target retains these reviewable artifacts:

1. untouched compiler assembly in `<symbol>.compiler.s`;
2. section-adjusted assembly in `<symbol>.s`;
3. a raw GNU 2.6 source object containing load-relevant relocation evidence;
4. a link input object with discarded ancillary sections removed; and
5. a deterministic `<symbol>.source-object-proof.json` record.

Strict verification independently recreates the contracted section assignment and proof. The proof records
the source-policy result, compiler and assembler identities/flags, artifact hashes, target-section
bytes, load-relevant relocations, visible ancillary differences, linked bytes, and final owner.
It explicitly records that compiler assembly was not rewritten.

GNU 2.6 omits the procedure-descriptor relocation emitted by the former production assembler.
Procedure metadata is discarded before the final link, so the historical records are retained as
retired ancillary evidence rather than silently compared as active relocations. Every relocation
against the accepted target section remains mandatory by offset, type, and normalized
symbol/value semantics.

### Structural evidence

Function boundaries, overlay descriptors, linker placement, executable/data classification, and
toolchain/layout changes are structural.

Structural changes use `docs/AUDIT.md`.

### Semantic evidence

Names and behavioral explanations need evidence appropriate to the claim.

Static evidence may justify a cautious supported alias. Runtime trace, controlled mutation, or
recognized SDK/library proof is required before replacing an address-based symbol with a canonical
semantic name.

Semantic work is not a prerequisite for exact C output.

### Symbol-naming sidecar

Naming accompanies normal matching work but does not gate it. Keep the accepted target symbol,
usually `func_XXXXXXXX`, unless a canonical semantic name has already been established. Matching
machine code does not by itself prove a name.

Use exactly three naming classes:

1. `CANDIDATE` — imported external lead; never used canonically.
2. `SUPPORTED_ALIAS` — independently supported by static evidence.
3. `CANONICAL` — established by runtime evidence, controlled mutation, or recognized SDK/library
   proof.

During matching, use existing `CANONICAL` names and preserve useful naming evidence. As a routine
sidecar, the decomp agent should attempt to promote the target to `SUPPORTED_ALIAS` by independently
checking its body, callers, callees, strings, and data accesses. External names begin as `CANDIDATE`;
local static confirmation may promote them to `SUPPORTED_ALIAS`, but only the `CANONICAL` class may
replace a build symbol. Insufficient naming evidence does not block Matching C; leave the function
address-named and continue. Perform canonical renames as scoped semantic changes and rerun the normal
target and complete-ROM verifiers.

---

## Normal Matching-C Loop

### 1. Select an accepted target

Choose an existing accepted owner.

Prefer targets that remove a LordlyCaliber hook/limitation or unlock a high-value call graph.
Do not optimize the queue primarily for count of easy matching functions.

If the accepted boundary looks wrong, stop and create a structural task rather than silently
changing it during matching.

### 2. Write the C reconstruction

Create or adjust the target under `src/`.

The original assembly remains the comparison/fallback owner.

Use disassembly, call graphs, known structs, constants, static data, and existing research as
inputs. Weird-but-valid C is allowed when needed to reproduce historical compiler output.

Do not paste assembly into C to obtain a match. See `docs/SOURCE_POLICY.md`.

### 3. Iterate with the diff tool

Canonical interface:

```text
node tools/diff.js <symbol>
```

The diff command is a development aid. It should:

- resolve the target from the accepted model;
- compile the current source with the pinned compiler;
- compare the final linked target bytes directly with the baserom;
- report the asm-differ score and raw-byte result separately; and
- provide actionable asm-differ output.

`EXACT` requires a nonempty pairwise decoded-instruction match and equal final linked bytes. Raw
linked-byte comparison is authoritative; decoded output is a development aid. Missing, duplicate,
malformed, or wrong-sized linked sections fail with `ERROR`.

Intermediate diff output is generated evidence and is not committed.

For a difficult candidate, an ignored scratch loop may compile with the same
authenticated compiler, exact production flags, sole accepted section-name
adjustment, and pinned assembler, then compare the resulting target-section
words with the baserom. This can make focused C experiments faster when the
canonical diff rejects an intermediate wrong-sized candidate. It is diagnostic
only: it does not prove linker ownership, linked addresses, relocation handling,
or complete-ROM equality and never replaces `diff.js` or `verify.js`.

In particular, raw-object `j` and `jal` words may differ before linking because
their final addresses are supplied through relocations. Treat an otherwise-close
raw object as a reason to run the canonical linked diff, not as a completed
match.

#### Matching workbench (optional research aid)

`tools/match.js` automates that ignored scratch work without changing the
canonical matching rules:

```text
node tools/match.js doctor
node tools/match.js inspect <symbol>
node tools/match.js history <symbol>
node tools/match.js best <symbol>
node tools/match.js watch <symbol> --source <candidate.c>
node tools/match.js classify <candidate-id>
node tools/match.js compare <candidate-id> <candidate-id>
node tools/match.js case-cfg <candidate-id> --case-map <map.json> --actual-dispatch <offset> --actual-body <offset> --actual-tail <name=offset>
node tools/match.js preserve <candidate-id> --note "reason"
```

`watch` compiles a hand-edited candidate. `classify` reopens one candidate and
its latest run, while `compare` compares two successfully compiled candidates
for the same exact target. For a large command dispatcher, `case-cfg` can use a
reviewed command map and explicit shared-tail offsets to compare bounded regions
by command entry. It normalizes registers and supported relocations, reports
block/call/successor/tail parity per command, and fails closed when dispatch
resolution is ambiguous. Its region totals may include shared interior blocks
once per command and are not whole-function metrics. `preserve` is the one command above that writes
tracked files: it copies a deliberately selected blocked candidate and a short
dossier into the archive. It does not activate or promote the target.

`prepare` exports the function from the current accepted model, invokes the
pinned m2c revision, compiles generated drafts with the authenticated KMC/GNU
toolchain, and classifies each scratch-object difference:

```text
# One ordinary structured draft
node tools/match.js prepare <symbol> --variant structured

# The complete configured ruleset ensemble (the default)
node tools/match.js prepare <symbol>

# A selected subset; --variant may be repeated
node tools/match.js prepare <symbol> --variant structured --variant gotos
```

Context is generated for inspection by default but is not passed to m2c unless
`--with-context` is explicit. `--no-context` skips its generation, and
`--no-compile` stops after generation. Generated C, objects, reports, and SQLite
experiment history remain under ignored `build/matching/`. A repeated successful
compile is reused exactly; a failed compile can be retried after its environment
is repaired.

Candidate identity is exact target plus exact source. Generation path, variant,
and tool arguments are separate observations, so the same C found in two ways
does not incur two compiles or lose its provenance.

The configured ensemble contains ordinary m2c modes plus narrow calibrated
post-generation hypotheses. Select one explicitly when testing a particular
idea:

```text
node tools/match.js prepare <symbol> --variant structured --no-context
node tools/match.js prepare <symbol> --variant structured-abi-gaps --no-context
node tools/match.js prepare <symbol> --variant structured-load-first --no-context
node tools/match.js prepare <symbol> --variant structured-return-flow --no-context
node tools/match.js prepare <symbol> --variant structured-cursor-steps --no-context
node tools/match.js prepare <symbol> --variant structured-masked-local --no-context
node tools/match.js prepare <symbol> --variant gotos --no-context
node tools/match.js prepare <symbol> --variant stack --no-context
```

`structured-abi-gaps` preserves a literal missing general-purpose argument slot
in m2c's `arg0` through `arg3` numbering. `structured-load-first` tests one
exact three-statement shape where the retail schedule requires a cursor byte to
be loaded before an independent zero store. The other calibrated passes test
direct returns instead of a narrow result temporary, explicit byte-cursor
advances, and a separately materialized masked comparison. Each refuses
unrecognized source shapes rather than guessing. `gotos` and `stack` are the
pinned m2c goto-only and stack-structure modes, not post-generation rewrites.

Treat these rulesets as an ensemble. A pass may be retained when it produces an
exact function no other pass finds even if it loses functions covered by
another pass. Do not replace the baseline with the apparent best single pass.
Sweep summaries record every exact function/ruleset/candidate-ID membership,
per-ruleset gains and losses against the first pass, ruleset-unique functions,
and the deduplicated ensemble total. The legacy `exactBytes` field counts exact
variant runs and may count one function more than once; use
`summary.ensemble.exactTargetCount` for the function total. Full membership is
available with `sweep-status --include-targets`; default output is bounded.

Rulesets with identical m2c arguments share one m2c invocation. Identical exact
source produced by several rulesets is compiled once within that preparation
while every generation observation remains recorded. These remain candidate
generators; exact output still enters the normal review, linked diff, and
verification path.

Batch sweeps are checkpointed after every function and resume an interrupted
run. Bare `sweep` selects every currently unsolved ordinary target and runs the
full configured ensemble, so use an explicit bound unless that is genuinely
intended:

```text
node tools/match.js sweep --max-size 64 --leaf-only --limit 200
node tools/match.js sweep --set smallest-leaves-200 --variant structured --no-context
node tools/match.js sweep-status
node tools/match.js sweep-status --include-targets
```

The fixed `smallest-leaves-200` set is a reproducible calibration corpus and
includes already solved members. General sweeps omit active matching targets
unless `--include-solved` is supplied. Use `summary.ensemble.exactTargetCount`,
not the legacy exact-variant-run counter, for the number of distinct exact
functions.

The workbench can also expose related code, bounded callsite/type clues, target
queues, and compiler dumps:

```text
node tools/match.js family build
node tools/match.js family <symbol>
node tools/match.js family list --tier exact --include-members
node tools/match.js context <symbol>
node tools/match.js rank --lane leverage
node tools/match.js rank --explain <symbol>
node tools/match.js probe <symbol> --source <candidate.c>
node tools/match.js probe <symbol> --candidate <candidate-id>
node tools/match.js probe compare <left-report.json> <right-report.json>
```

Callsite context is generated by default for inspection but is not passed to
m2c unless `--with-context` is explicit. The pilot found that inferred
prototypes can help some functions and hurt others. `context --runtime` is an
optional read-only Total Resolver lookup; normal workbench use needs neither
Total Resolver nor Project64.

`family` tiers are leads, not proof that two placements share source or
meaning. Its relocation-normalized tier only ignores external `J`/`JAL` target
fields; it does not infer raw `HI16`/`LO16` relocation intent. `probe` output is
never acceptance-eligible, including output from the
accepted compiler. A research compiler supplied to `probe` is labeled even
more strictly and cannot enter `diff` or `verify` through this interface.

Default results are bounded. Request complete detail deliberately with the
relevant `--include-details`, `--include-source`, `--include-members`,
`--include-context`, or `--include-targets` option; use `--json` for structured
output.

Adding source under `src/` and activating a target remain deliberate
human/agent actions followed by the canonical linked diff and both verification
gates below. Scratch `exact-bytes` is a strong lead, not a match.

### 4. Verify the target

Canonical interface:

```text
node tools/verify.js --target <symbol> --require-pure
```

For the requested symbol, the verifier must:

1. verify baserom identity;
2. verify matching compiler/toolchain identity;
3. resolve the accepted structural owner uniquely;
4. classify the translation unit using `docs/SOURCE_POLICY.md`;
5. compile the source;
6. remove/exclude the corresponding original assembly target from the linked build;
7. prove the C object is the sole linker-map owner of the target section;
8. verify accepted address and size;
9. derive and compare normalized relocation information according to policy;
10. compare final linked target bytes directly with the baserom;
11. build the complete current ROM; and
12. compare the complete current ROM byte-for-byte with the baserom.

`--require-pure` must fail if the source class is not `PURE_C`, even when output is exact.

Expected summary:

```text
OB64 Decomp Verification

Baserom identity ........ PASS
Toolchain ................ PASS
Structural owner ......... PASS
Source policy ............ PURE_C
C linker ownership ....... PASS
Target placement ......... PASS
Relocations .............. PASS
Target bytes ............. EXACT
Full ROM ................. EXACT

RESULT: MATCHING C
```

An exact hybrid should instead report:

```text
Source policy ............ HYBRID_C
Target bytes ............. EXACT
Full ROM ................. EXACT

RESULT: MATCHING HYBRID
```

and `--require-pure` must return failure.

A `HYBRID_C` allowance is permission to keep an intermediate or fallback, not automatic permission
to finish the target and move on. Treat an exact hybrid as final only when either:

- evidence indicates that the function most likely requires assembly inherently; or
- a documented pure-C attempt has reached a concrete blocker that cannot be solved with the
  current tools and information.

Large size, difficult register allocation or scheduling, and exact hybrid output are not sufficient
on their own. If neither condition applies, keep the target active and continue the pure-C work.
When an exception does apply, record the evidence or blocker and continue to label the result
`MATCHING HYBRID`, never matching C.

### 5. Verify integrated current state

Before merging/integrating a set of changes:

```text
node tools/verify.js
```

This verifies all active C/hybrid replacements and the complete ROM.

Legacy hybrid targets may allow the overall exact baseline to pass, but status must list them
separately from pure matching C.

### 6. Commit

Commit the source and the smallest configuration change necessary to activate it.

Git records source history. Do not create separate ordinary-function promotion manifests,
checkpoint receipts, worker lifecycle receipts, frozen accepted trees, or independent matching
review packages.

---

## Target Configuration

The long-term target configuration should contain only facts that cannot be derived safely from the
accepted structural model.

Preferred shape:

```json
{
  "symbol": "func_0000B33C",
  "source": "src/boot/boot_resource_pool_acquire_release.c"
}
```

Derive where possible:

- ROM start/end;
- VRAM;
- target size;
- section name;
- owner/chunk/row identity;
- overlay descriptor;
- original assembly path;
- expected retail bytes;
- source and original-assembly hashes;
- expected text hash; and
- normalized relocation records.

If a symbol address or link alias is genuinely needed, prefer a shared canonical symbol table over
duplicating it per target.

Historical ancillary metadata may remain recorded while the active contract derives load-relevant
facts from GNU 2.6 source objects. Do not delete trusted evidence before the derived replacement has
been proven equivalent.

---

## Relocation Policy

Relocation equality is retained because the decomp is intended for source-level modification, not
only historical byte reproduction.

The verifier derives normalized load-relevant relocations from the GNU 2.6 source object and
compares them with the reviewed accepted contract. Discarded ancillary metadata remains visible in
the source-to-object report but is not treated as a ROM or modification-relevant relocation.

`config/matching-c-linkage.json` is the active reviewed linkage contract. It contains one shared
absolute-symbol registry, per-target relocation lists, any explicit compiler text-function
partition, and any target-specific audited auxiliary switch-table section contract. Historical targets may still read
an equivalent contract from the frozen `config/phase8/matching-c.json` compatibility record while
that evidence is migrated. New targets must not be added to that legacy file.

An explicit `compilerTextFunctions` list is permitted only when untouched compiler output emits
multiple `STT_FUNC` symbols that exactly and gaplessly partition one accepted text owner. The first
record remains the accepted global owner symbol at offset zero. Every additional compiler symbol
must remain local and carry reviewed entry evidence; the list does not create another accepted
owner, boundary, or public alias. The verifier checks the exact symbol census, offsets, sizes,
bindings, visibility, section, linked addresses, and complete owner bytes.

Multiple active C targets may contribute ordered read-only switch-table fragments to the same
accepted auxiliary row only under a complete shared-row contract. The fragments must occur in
link order, cover the row from its accepted start without gaps or overlaps, use the same read-only
section shape, and leave at most one exact assembly tail after the final fragment. The original
assembly owner is removed once; final map and program-header checks still require one complete
read-only output row with exact retail bytes.

If a target produces exact final bytes but relocation structure differs, report it explicitly.
Do not silently count it as fully mod-ready pure C.

`tools/diff.js <symbol>` is allowed to compile the selected target before its contract exists. It
prints and records the exact candidate relocations, but labels them `MISSING` and does not accept
them. Review that candidate against the source and canonical linked result, then add an explicit
entry to `config/matching-c-linkage.json`; use an empty list when the reviewed object has no load-relevant
relocations. `tools/verify.js` fails closed if the entry is absent or if the object changes.

Internal absolute `j`/`jal` relocations are normalized to `.text`. External function or data names
must resolve through the shared registry or an actual linked definition. Never guess records from
instruction text or copy them from another target.

---

## Commands

The normal human/agent interface should converge on:

```text
node tools/build.js
node tools/diff.js <symbol>
node tools/verify.js [--target <symbol>] [--require-pure]
node tools/status.js
node tools/audit.js
```

The optional research interface is:

```text
node tools/match.js --help
```

### `build`

Build the current source tree.

It uses some Phase 7/8-named compatibility libraries internally. Those
historical implementation names are not user-facing workflow concepts.

### `diff`

Fast per-target matching loop.

### `verify`

Normal exactness/ownership/source-policy gate.

### `status`

Derive current progress from the accepted model and source classifier.

At minimum report:

- exact `PURE_C` functions and bytes;
- exact `HYBRID_C` functions and bytes;
- assembly/non-C owners;
- nonmatching/experimental C if tracked separately; and
- full-ROM exact status.

Do not source these counts from prose documentation.

### `audit`

Heavy structural verification. See `docs/AUDIT.md`.

### `match`

Optional generated research workbench. It may prepare candidates and write
ignored experiment state, but it is not part of canonical acceptance and is not
required by `build`, `diff`, `verify`, or `status`. Run
`node tools/match.js --help` for its current command and option surface.

---

## Local Tool Paths

Tracked configuration owns expected tool identities/versions/hashes, not Joe-specific absolute
paths.

Machine-local paths should come from one ignored local config or documented environment variables
resolved by a shared helper.

`config/local-tools.json` must set `powershellRuntimeRoot` to the root of the authenticated pinned
Windows PowerShell runtime. That root contains
`System32/WindowsPowerShell/v1.0/powershell.exe` and
`System.Management.Automation.dll`. `OB64_POWERSHELL_RUNTIME_ROOT` is the environment override.
Normal commands pass this path through every build and verification layer and isolate the child
PowerShell version check with the matching `WINDIR` and `DEVPATH`; they do not depend on the
machine's ambient, updateable PowerShell installation.

Normal commands should not require users or agents to paste a long set of compiler/Splat/asm-differ
paths on every invocation.

Do not weaken tool identity checks merely to simplify path handling.

---

## Parallel Agents

Work in the current checkout and branch unless Joe explicitly directs creation of
a branch or worktree.

Use `docs/templates/matching-c-agent-prompt-guide.md` when assigning an ordinary
one-function matching task, especially to a worker that benefits from a short,
explicit diff-and-verify loop.

A worker:

```text
select target
→ write C
→ diff
→ verify target
→ commit
```

Integration:

```text
rebase/merge onto latest canonical
→ node tools/verify.js
→ accept if exact
```

No additional Highway/Lane/Lease/Checkpoint orchestration is part of decomp evidence.

---

## Modified Builds

Retail matching and mod behavior are different acceptance problems.

For a modification:

```text
exact retail baseline
→ intentional source change
→ build modified ROM
→ changed-byte/layout validation
→ emulator/runtime proof
```

Do not require a modified ROM to equal retail.

Do not use the existence of a matching baseline as proof that a modification behaves correctly.

---

## Nonmatching C

Nonmatching pure C can be useful for understanding a subsystem or prototyping a future modification,
but it is not part of the retail exact baseline unless the build explicitly supports such a mode.

Label it honestly.

Do not lower exact matching requirements merely because a source reconstruction is semantically
good.

---

## Progress Priority

The project should prefer decompilation that reduces LordlyCaliber's dependence on runtime hooks
and hard-coded workarounds.

Priority order:

1. code directly intercepted/patched by LordlyCaliber;
2. dependencies needed to replace those hooks with source-level changes;
3. code behind current editor limits;
4. foundational subsystem code that unlocks several future targets;
5. opportunistic easy matches.

Matching-function count is a status metric, not the optimization target.
