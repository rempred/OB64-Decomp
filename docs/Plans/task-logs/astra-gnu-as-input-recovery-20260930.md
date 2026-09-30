# GNU AS input-buffer recovery

## Current state

Director: Astra/SilentCrane. Sol/MagentaTiger remains sole production source/build
writer in chat `01a0efa7-9455-7af0-a8e8-28175aa5eb31`. Joe's standing authority
assigns tooling/infrastructure blockers to Astra. Agent Mail 482 and 483 record
explicit independent Claude/Sol agreement on this defect; 495 confirms Astra's
separate investigation. Sol committed his provisional inputs at `13d35642` and
confirmed the stable source/config window in mail 501. The reviewed toolchain
bundle and dependent pins are installed. Sol's single structural audit passed
at 2026-09-30 11:45 EDT; both baseline and CURRENT ROMs are exact. Sol retains
sole production build ownership. Flags,
source classes, structural owners and target membership have not changed.

The recovery notification 494 confirms Sol resumed after the power flicker. Mail
and Astra's inbox/stop watchers were recovered, with their saved state preserved.

## Supported defect and remedy

The pinned GNU 2.6 source at commit
`54514ded39ceb32165a125ddba04ca5b551773a2` defines `bcopy` as `memcpy` in
`gas/as.h`. KMC `read_asm` in `gas/input-file.c` calls it to shift overlapping
instruction text forward five bytes while inserting an existing hazard NOP.
The overlap is undefined behavior. Instrumented scratch builds demonstrate
operand corruption at different byte positions, including loss of the `$` in
`$f22`. This is independent of C-source register/frame mismatches.

The minimal remedy is one correctly ordered `memmove` at that shift. Hazard
recognition, NOP insertion, input assembly, instruction selection and flags stay
unchanged. No filename padding, instruction rewriting, source-policy exception,
or symbol-specific workaround is proposed. ADB8's whole-producer/table ownership
gate remains separate and unapproved (mail 489/492). Mail 499, corrected by 500,
adds an AD0 fixture differing in filename and a diagnostic-flags comment only.

Astra accepts this generic fix after the clean reproductions, structural audit
and independent read-only review by `gnu_as_fix_review`. Final review independently
hashed both ROMs, reconciled every recorded input identity with the live files,
and confirmed the source/object/link evidence and retained regression gates.
No blocking finding remains in the fix, generic regressions or bounded
pin-refresh helper. This does not accept an unfinished function wave.

## Validation evidence

Ignored evidence root: `build/astra-gnu-as-recovery-20260930/`.

- `root-cause/gnu-as-mulmul-overlap.patch`, processed-buffer fixtures and
  `regression-results.json`: isolated source-level fix; 130 positional variants
  pass, where the old tool fails 72. Invalid `$f32`/uppercase `$F4` still reject.
  The two-operand form is accepted syntax and is not rejection evidence.
- `matrix/old-valid` and `matrix/fixed-valid`: independent 256 filename/comment
  variants; old tool passes 64, fixed tool passes all 256 with equal allocated
  bytes, normalized relocations and symbols.
- `matrix/fixed-corpus`: 669 direct original assembler objects match. The other
  two owners use subsequent physical-owner projection; comparison against their
  correct original `*.assembler-object.o` passes in `matrix/fixed-corpus-raw`.
  Together these cover all 671 adjusted assembler inputs in the last verified
  CURRENT snapshot `448e986c035e86024d0c76ce`.
- The first `matrix/old`/`fixed` comment-stripping fixtures were invalid due to a
  test-generator CRLF bug; use only the corrected `*-valid` reports.

The incremental scratch executable is diagnostic, not the final identity. A
fresh full build discovered an assembler of 559236 bytes with SHA-256
`0589F2ADEC34E8BD99F550AF91B1D8868B71904D0D0F8117CA247DF899B8C938`.
The unchanged recipe was reproduced using the staged contract under
`staged-contract/`. Fresh external roots are under
`C:/Users/Joe/.codex/ob64-gnu-as-overlap-20260930/`.
`clean-a-work` stopped before compiling because the initial combined patch was
malformed; `clean-a2-work` completed compilation and rejected the old provisional
assembler pin as designed. Its discovered identity is now the staged expected
value for `clean-b-work` and `clean-c-work`. Both complete builds passed, and
independent review confirmed all nine executable/runtime byte identities match.

Fresh-binary equivalence runs are `matrix/clean-a2-runtime-repro` and
`matrix/clean-a2-runtime-corpus`. Earlier `clean-a2-repro`/`clean-a2-corpus` attempts
could not load the missing runtime DLL after the fail-closed builder stopped;
they do not assess assembler behavior. The exact pinned DLL was then supplied.
The fresh binary passes 256/256 positional variants and 671/671 saved raw-object
comparisons. `supplied/report.json` separately confirms the unchanged failing
94BC, AD0 and 28050 inputs now assemble; their passing controls preserve bytes
and relocations. The AD0 pair differs in filename and a diagnostic-flags comment.

The tracked smoke regression checks 256 valid single/double multiply variants,
the existing NOP and relocation, plus 32 malformed-register rejections. It fails
on the old pinned assembler and passes on the fresh and installed replacement.
The full installed binutils smoke and word-assembler smoke pass. Pin-refresh
positive/adversarial fixtures pass; all 18 routine suites in `node tools/test.js`
pass (`routine-tests.log`). A refresh check after activation reports no changes.

`tools/refresh_gnu_binutils_pins.js` derives dependent hashes from two complete
authenticated bundles and the reviewed primary contract. Activation changed
only the primary host-patch hash/scope and AS hash, then four dependent hash
slots in Phase 7 and matching targets. `config/toolchain.json` is unchanged.
Backups are in `pre-activation-backup/`; `activation-report.json` records the
installed identity and exact dependent-field delta.

## Final structural audit

Sol ran the single `node tools/audit.js` assigned in mail 503; it completed
exit 0/PASS and was reported in mail 506. There was no preceding full build or
redundant verifier. Log:
`build/sol-five-family/astra-as-fix-structural-audit-20260930.log`.

- `build/audit/report.json`: PASS, SHA-256
  `9EEFB8FE55901E98D85EB2344FFCF195FEF8BEB913F44323E2C779FD93303880`.
- `build/setup/verify-setup-report.json`: all structural checks pass.
- `build/current/verification.json`: PASS, SHA-256
  `61A7BC36137F3938D8E09B9C2A94C9512FC0C8EC8A0B909475C1A633A328644D`.
- Baseline fingerprint `969D6E8F25466022CFB28482253B549BB64184086F2C02296EC0869D139031C4`;
  CURRENT fingerprint `BCA47256A587674C9C97A3A9B89E46A8C1C019A9F6EA33950707F6A5DBF7683E`.
- Both 41,943,040-byte ROMs match canonical SHA-256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Source-to-object proof uses the repaired AS identity; compiler-assembly
  rewrites and `UNKNOWN` source classifications are zero. Ownership, placement,
  relocation and retained structural regression gates pass.

Sol preserved the reports under ignored `build/sol-five-family/as-fix-audit-*.json`.
This establishes the toolchain change on its exact combined inputs, without
closing unfinished matching waves or resolving their semantic uncertainties.

`tools/matching_studies/allocator_source_probe.js` remains a frozen historical
diagnostic bound to its old AS and closed retained evidence set. No production,
audit or routine test calls it. Its manual replay now correctly rejects identity
drift; changing only its AS pin would misrepresent old evidence. A successor
experiment would need fresh complete control/probe evidence. That rerun is not
needed for this generic fix, and the original study/contract is preserved.
