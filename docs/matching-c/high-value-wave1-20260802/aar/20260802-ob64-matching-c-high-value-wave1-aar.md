# After-action report: matching C high-value wave 1

## Outcome

The worker is blocked after selecting `boot_resource_pool_acquire_release` and proving its independently derived C text exact locally. The accepted Phase 8 build cannot load its pinned Phase 6 compiler manifest, so no canonical integration or acceptance claim is made. The Director must restore that authenticated input before continuing.

## Scope

The worker inspected the canonical decomp repository, its governing records, and the declared Phase 5A product root. The worker did not inspect protected `_work`, editor files, emulator state, master ROM contents, or external-derived implementations. The parent repository remained read-only.

## Claims and evidence grades

### Claim 1: target selection

Claim: `boot_resource_pool_acquire_release` is an eligible high-value resource-loader target.

Evidence grade: `Supported`.

Review status: `pending`.

Scope and context: The accepted owner is 168 bytes at z64 ROM `0x0000B33C..0x0000B3E4`, with a 32-byte frame, two calls, two loops, and acquire/release decisions.

Supporting artifacts: `target-selection.md`, the original assembly source, the accepted semantic row `105`, the assembly manifest, and the parent symbol record.

Independent corroboration: Two archive-load callers each call the function twice. The two direct callees are the accepted resource allocator and free routine.

Competing interpretation: The routine could be described only as a low-level pool helper, but that still places it inside the resource-loader path.

Falsifier: A boundary or caller census mismatch in a fresh accepted model would invalidate this selection.

Known limits: No new runtime trace was required or attempted.

Product consequence: The function is a suitable future matching-C slice after the pinned build input is restored.

### Claim 2: independent C derivation

Claim: The candidate C body maps the target branches, pool fields, eight-byte stride, allocator call, free call, and null sentinel.

Evidence grade: `Supported`.

Review status: `pending`.

Scope and context: The derivation uses only the canonical target assembly, accepted semantic data, and accepted symbol evidence.

Supporting artifacts: `candidate/boot_resource_pool_acquire_release.c` and `independent-derivation.md`.

Independent corroboration: The local linked output reproduces every target word, including resolved global and call addresses.

Competing interpretation: The exact instruction encoding requires a compiler extension because the target uses an `addu` alias variant.

Falsifier: A compiler run under the pinned flags that changes the object section or linked relocation result would require revision.

Known limits: The source was not accepted through the canonical Phase 8 verifier.

Product consequence: The candidate remains review-pending and must not be promoted to a canonical source owner without full build proof.

### Claim 3: blocker

Claim: The accepted Phase 8 build is blocked by a missing authenticated Phase 6 manifest.

Evidence grade: `Verified`.

Review status: `pending`.

Scope and context: The exact standard build command fails during `loadAcceptedModel()` before compiler invocation.

Supporting artifacts: `task-log.md`, `evidence-index.md`, and `blocked-standard-build.log`.

Independent corroboration: Both `config/phase7/conventional-build.json` and `config/phase8/matching-c.json` pin the same absent path and SHA-256.

Competing interpretation: The manifest might exist in an undeclared external intake snapshot, but using it would violate this assignment's input boundary.

Falsifier: An authorized copy with SHA-256 `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` would remove this blocker.

Known limits: The worker did not reconstruct or copy the manifest.

Product consequence: Full integration, ROM identity, two fresh builds, and independent review remain pending.

## Changed surfaces

The worker added only task evidence under `docs/matching-c/high-value-wave1-20260802/`. No canonical source owner, matching-C configuration, build helper, editor file, or external repository was changed.

## Failed paths and limits

- The first setup verification attempt exceeded the 120-second shell timeout. The child verifier later completed successfully, and a second exact setup run captured the PASS evidence.
- The focused candidate initially used a plain C zero initialization. It produced an alias-equivalent `or` word instead of the target `addu` word.
- A visible compiler-extension repair then produced an exact 168-byte linked text. The repair is recorded and remains review-pending.
- The standard accepted build failed before target compilation because the pinned Phase 6 manifest is absent.
- The worker did not modify an acceptance-defining verifier to bypass the missing input.

## Verification summary

The required setup baseline passed before source edits. The focused candidate object and linked text are each 168 bytes and hash to `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9`. The candidate object records 13 `.rel.text` entries and one `.rel.pdr` entry. Full canonical verification remains blocked.

## Protocol deviations

The parent HEAD differs from the assignment baseline, so the parent was treated as read-only context. The first setup command timed out at the shell boundary, but the verifier completed in a later captured run. The candidate uses one inline assembler instruction and one scheduling directive to preserve an alias encoding; this is disclosed, not hidden.

## Proposed canonical-document changes

No canonical domain-document edit is proposed before review. After the blocker is cleared and the result is independently reviewed, the Director can add the accepted target to the matching-C configuration and update the matching-C workflow record.

## Next action and terminal status

Terminal status: `blocked`.

Blocker: Restore the authenticated Phase 6 compiler manifest at the pinned canonical path and SHA-256, then rerun the accepted build before integrating this candidate.

The worker must not issue an acceptance verdict.
