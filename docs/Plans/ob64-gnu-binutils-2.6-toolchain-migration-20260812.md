# OB64 GNU Binutils 2.6 Toolchain Migration Plan

Status: approved direction; implementation and independent review are pending.

This is a structural toolchain task. It is separate from ordinary function matching.

## Decision

Replace GNU Binutils 2.39 in the production OB64 build with the historical GNU Binutils 2.6
family used by the HJIS/KMC tool path. Retain the authenticated Windows KMC GCC 2.7.2 compiler.
After the new path is accepted, remove the compiler-assembly dialect adapter instead of extending
it further.

The intended production path is:

```text
accepted preprocessing and source-policy classification
-> authenticated Windows KMC GCC 2.7.2 cc1.exe
-> untouched KMC compiler assembly
-> target-section adjustment only
-> pinned mips-kmc-elf GNU assembler 2.6
-> pinned mips-kmc-elf GNU linker 2.6
-> pinned GNU 2.6 objcopy
-> canonical ownership, relocation, byte, and full-ROM verification
```

GNU 2.39 may be used as a comparison control while the shadow migration is being developed. It is
not part of the accepted replacement and must not remain as a production fallback after cutover.

## Evidence behind the decision

- The authenticated Windows KMC compiler remains accepted at SHA-256
  `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.
- The HJIS-referenced GNU 2.6 release archive tested locally has SHA-256
  `5A612CD28344E5B410C3344EC5DCFB92D9D03947756F190CD12404055B4A624D`.
- Its unmodified `mips-kmc-elf-as` has SHA-256
  `AE891FB014E2F959E278BC51AE2FD47256B36955F752BBE4A38790EA4381139D`.
- GNU 2.6 naturally emits the retail `addu` encoding for KMC `move` pseudo-instructions, including
  `move $fp,$0`.
- GNU 2.6 naturally reproduces the historically validated adjacent `la $4,symbol` plus direct
  `jal` expansion and delay-slot relocation behavior.
- All five current `PURE_C` targets produced exact target bytes and exact target-section
  relocations when their untouched KMC output was assembled with GNU 2.6.
- Twenty-six of 32 current `HYBRID_C` targets were already exact without source changes. The other
  six expose GNU-2.39-specific source workarounds that must be rebuilt for GNU 2.6.
- The published v0.3 release does not include `ld`. The exact v0.3 source commit is
  `54514ded39ceb32165a125ddba04ca5b551773a2`; its source tree contains `ld`, so the migration must
  build, pin, and validate the linker rather than silently using a host linker.

Primary upstream references:

- [Decompals GNU Binutils 2.6 source](https://github.com/decompals/mips-binutils-2.6)
- [v0.3 release](https://github.com/decompals/mips-binutils-2.6/releases/tag/v0.3)
- [v0.3 source commit](https://github.com/decompals/mips-binutils-2.6/commit/54514ded39ceb32165a125ddba04ca5b551773a2)

Local evidence:

- `C:\Users\Joe\.codex\ob64-p3066-hjis-move-test-20260812\REPORT.md`
- `docs/audit/2026-08-08-retail-dialect-phase3-p3063-pure-c-evidence.md`
- `docs/audit/2026-08-09-kmc-la-direct-jal-dialect-structural-evidence.md`
- `docs/audit/2026-08-12-kmc-cop1-uppercase-fpr-prefix-independent-review.md`

## Invariants that do not change

- Canonical target: normalized US Rev 0 ROM, SHA-256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Accepted function/data boundaries, ROM LMAs, runtime VMAs, slab mappings, overlays, segmentation,
  executable extent, and linker ownership rules remain unchanged.
- Source classification remains mechanical. `PURE_C`, `HYBRID_C`, `ASM`, and `UNKNOWN` keep their
  existing meanings.
- The accepted source expression remains independently derived under the clean-room policy.
- Target bytes, sole linked ownership, relocation evidence, and the complete ROM remain mandatory.
- The original assembly owners remain available as migration fallback and comparison evidence.
- The original KMC tools in the offline XP VM remain an oracle for focused historical questions;
  they are not required for normal production builds.

This migration must not also activate p3066, change modified-game behavior, or revise structural
placement. Resume p3066 matching only after the toolchain cutover is accepted.

## Migration-state rule for legacy hybrids

A legacy `HYBRID_C` mismatch or assembly error under GNU 2.6 is expected migration work, not a
reason to reject or abandon the implementation.

During development, the shadow build must:

1. compile and test every active C target independently;
2. record exact, nonexact, and assembly-error results without stopping at the first hybrid;
3. use the accepted original assembly owner for any target still pending, so a complete exact
   shadow ROM can continue to be built; and
4. report that fallback honestly as assembly-owned for that shadow build.

The fallback is development-only. Final cutover still requires every active replacement to be
exact and solely C-owned. In this migration, the intended resolution is to rebuild incompatible
hybrid sources for GNU 2.6, not to treat their initial mismatch as a failed toolchain trial.

This creates two distinct gates:

- **Progress gate:** tool execution and structural reporting work; pending hybrids are allowed.
- **Cutover gate:** no pending target remains; all accepted owners and the full ROM are exact.

## Phase 0 - Freeze and isolate

1. Start from a clean migration branch/worktree at the accepted canonical HEAD.
2. Record the accepted ROM, tool, source-policy, active-target, baseline, and current-build
   identities.
3. Run the existing normal verifier before changing the toolchain.
4. Keep the GNU 2.39 result available only as a read-only comparison control.
5. Store generated objects, ROMs, tool binaries, VM images, and detailed reports outside Git.

## Phase 1 - Produce an authenticated GNU 2.6 tool bundle

1. Pin the Decompals source at commit `54514ded39ceb32165a125ddba04ca5b551773a2` and the v0.3
   release archive by hash. Do not use a `latest` URL as identity.
2. Retain the already authenticated release `as` unless a separately reproduced binary is proven
   equivalent and intentionally accepted.
3. Build `mips-kmc-elf-ld` from the same source commit and target configuration. Also produce and
   pin the GNU 2.6 utilities actually used by the build, including `objcopy` and `objdump`.
4. Do not assume GNU 2.6 provides modern `readelf`. Replace the current readelf-text dependency
   with deterministic parsing from the repository's raw ELF parser, supplemented by GNU 2.6
   `objdump` where useful.
5. Record source identity, build recipe, build-host identity, flags, executable hashes, and version
   output in a tracked manifest. Keep binaries outside Git.
6. Run the tools through a pinned offline production environment. Qiling remains research-only
   unless its runner and syscall behavior receive their own structural authentication.

The production runner may be a pinned Linux VM/container or a proven native Windows build. It must
support deterministic noninteractive invocation from the normal Node workflow and must fail closed
on tool, runner, or environment identity drift.

## Phase 2 - Establish primitive behavior

Before a full build, add small deterministic tests for:

- big-endian `.word` output;
- MIPS3/O32 object flags and section alignment;
- reorder/noreorder and delay slots;
- KMC numeric and named-register `move` expansion;
- explicit retail OR instructions, especially `func_0002CD70`;
- adjacent `la` plus direct `jal` relocations and scheduling;
- COP1 `mfc1`/`mtc1` forms emitted by ordinary C;
- numeric absolute calls and supported symbol calls;
- custom `.ob64.*` sections, `.ent`/`.end`, macros, and conditionals;
- `objcopy --remove-section` and `--strip-symbol` behavior;
- linker script parsing, ROM LMA versus runtime VMA, overlays/slabs, and PT_LOAD flags; and
- exact binary extraction.

Pin assembler flags by input class. Start from HJIS's proven C-output flags
`-G 0 -mips3 -mabi=32 -force-n64align -EB`; test whether original assembly/data inputs require the
alignment flag rather than applying it by assumption. Derive the GNU 2.6 linker flags by direct
testing; do not copy unsupported modern flags such as `--build-id=none` merely to preserve text.

## Phase 3 - Rebuild the accepted assembly/data baseline

1. Assemble all 6,184 accepted assembly owners and all generated data objects with GNU 2.6.
2. Link them with the pinned GNU 2.6 linker and extract the ROM with GNU 2.6 objcopy.
3. Preserve every accepted address, size, overlay/slab mapping, section owner, and program-header
   execution flag.
4. Compare every link slice and the complete ROM directly with Rev 0.
5. Update map parsing only for format differences; ownership assertions must remain equally strong
   or become ELF-derived.

Assembler syntax differences in tracked fallback sources may be corrected without changing their
instruction words or owner boundaries. A genuine linker-layout or PT_LOAD contradiction is a
structural blocker and must not be hidden by changing placement metadata.

## Phase 4 - Replace the adapter with direct historical assembly

1. Preserve untouched KMC compiler output as a generated artifact.
2. Remove compiler-assembly rewriting from the shadow C path.
3. Apply only the existing target-section adjustment, then invoke GNU 2.6 directly.
4. Replace dialect proofs with a source-to-object provenance record containing source-policy
   result, compiler identity/flags, raw compiler-assembly hash, section-adjusted hash, assembler
   identity/flags, object hash, target-section hash, and normalized target relocations.
5. Verify the five current `PURE_C` targets first. All must retain exact bytes, sole ownership, and
   `PURE_C` classification.

No transformation count is needed after the adapter is gone. The proof should explicitly state
that compiler assembly was not rewritten.

## Phase 5 - Rebuild incompatible hybrid sources

Continue target by target until every active hybrid is exact. Known initial migration cases are:

| Target | Required direction |
| --- | --- |
| `func_0002CD70` | Express the two retail OR words explicitly; preserve `0x00801025` at `+0x004` and `+0x028`. |
| `func_0000BC8C` | Remove the GNU-2.39-conditioned scheduling/source workaround and regain its 524-byte retail target. |
| `func_0015DF10` | Reconstruct the retail `la`/call delay-slot shape for GNU 2.6 and regain its 88-byte target. |
| `func_0002DE10` | Replace the GNU-2.39-specific numeric absolute-call spelling with a GNU-2.6-correct exact form. |
| `func_00269798` | Replace the GNU-2.39-specific numeric absolute-call spelling with a GNU-2.6-correct exact form. |
| `func_0000B29C` | Rewrite the incompatible inline macro conditional without changing emitted retail words. |

Also resolve any newly discovered incompatibility. Keep each target's source class honest; this
migration does not convert a hybrid to pure C merely because its source was rewritten.

## Phase 6 - Rebase relocation and ownership proof on GNU 2.6 semantics

GNU 2.6 omits the current `.pdr` relocation in tested C objects. `.pdr` is not a ROM byte, but its
absence must be handled as a reviewed structural contract change, not silently ignored.

The replacement proof must:

- compare every relocation that targets an accepted executable/data section by offset, type,
  addend when applicable, and resolved symbol/value;
- distinguish load-relevant relocations from discarded ancillary debug/procedure metadata;
- keep ancillary differences visible in reports;
- prove that any section-symbol versus function-symbol normalization remains equivalent under the
  accepted one-section/one-owner layout; and
- preserve modification-relevant relocation semantics.

`func_0000A1F8` is the known self-relocation identity case. Fix its source/object shape or document
and test a precise semantic normalization; do not add a broad symbol-name exception.

## Phase 7 - Canonical cutover

Only after the shadow baseline and current build are exact:

1. Replace the active toolchain manifest and all authenticated hashes with the GNU 2.6 contract.
2. Update the Phase 7/Phase 8 build libraries, normal build/diff/verify commands, smoke tests, and
   audit checks to use the new tool resolver/runner.
3. Remove `config/compiler-assembly-dialect.json`, the adapter implementation, adapter fixtures,
   transformation-count gates, and stale adapter-proof consumers.
4. Remove active GNU 2.39 assembler, linker, objcopy, objdump, and readelf dependencies.
5. Update `docs/TOOLCHAIN.md`, `docs/WORKFLOW.md`, `docs/SOURCE_POLICY.md`, `docs/AUDIT.md`,
   `docs/NEXT_STEPS.md`, `config/README.md`, and relevant tool documentation to describe the
   accepted chain accurately.
6. Keep historical audit reports unchanged. Historical statements that GNU 2.39 was once
   production remain valid history.
7. Add a regression that rejects any reintroduction of the adapter or GNU 2.39 into active
   configuration/build code.

## Acceptance gates

The migration is ready for independent review only when all of the following pass:

- every required tool and runner identity is pinned and authenticated;
- every assembly/data owner rebuilds exactly through GNU 2.6;
- all five active `PURE_C` targets remain exact and solely C-owned;
- all 32 active `HYBRID_C` targets are rebuilt as needed and remain exact and solely C-owned;
- all target-section relocation comparisons pass under the reviewed GNU 2.6 policy;
- p3063 retains target SHA-256
  `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`;
- p3064 remains exact `HYBRID_C` unless a separate pure-C task changes it;
- both protected `func_0002CD70` words remain `0x00801025`;
- all accepted PT_LOAD flags, VMAs, LMAs, file sizes, and memory sizes remain exact;
- two clean builds are mutually reproducible and each complete ROM equals
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`;
- normal build, diff, source-policy, target verification, full verification, and regression suites
  pass through the new production chain;
- `node tools/audit.js` passes with the updated structural checks; and
- an independent structural reviewer passes the change using adversarial tool, relocation,
  ownership, PT_LOAD, hybrid, and no-GNU-2.39 probes.

Do not declare the migration accepted merely because the ROM is exact. Tool authentication,
ownership, relocation semantics, reproducibility, the heavyweight audit, and independent review
remain required.

## Implementation and commit shape

Use a dedicated migration branch/worktree. Keep generated evidence outside Git and make the
smallest reviewable commits practical:

1. authenticated GNU 2.6 bundle/runner and inert smoke tests;
2. shadow Phase 7 baseline and GNU 2.6 linker/ELF proof;
3. direct KMC-to-GNU-2.6 C path plus hybrid rebuilds;
4. canonical cutover, adapter removal, and documentation; and
5. a durable structural evidence report.

Do not push. The final implementation handoff must list every changed file, tool/source/runner
hash, known hybrid rewrite, relocation-policy decision, exact command, output root, verifier/audit
result, full-ROM hash, commit hash, and remaining limitation. Independent review follows the
implementation commit.
