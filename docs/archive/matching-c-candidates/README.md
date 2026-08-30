# Nonmatching Matching-C Candidate Archive

These files preserve useful C reconstructions that did not pass the canonical
matching gates. They are research inputs, not active source replacements.

Do not add one to `config/matching-c-targets.json` or describe it as matching C
without resuming the normal linked diff and verification workflow. The original
assembly remains the accepted owner.

## `func_0006d7d8` vT

- File: `2026-08-22-func-0006d7d8-vT.c`
- Source worktree: `codex/legion-func-0006d7d8` at `ec40ac2`
- Size: 2,650 bytes
- SHA-256:
  `2E4B765996C7F45049D05504DB798B76C6F3C566192AFE69E50F97EDD8D73E23`
- Status: nonmatching and inactive; this final source was never run through
  the canonical linked diff

The file is a byte-for-byte copy of the worker's final `vT` source. Its ignored
scratch build had the retail 101-instruction control-flow shape and 31 raw
object-word differences. Ten of those words looked like unresolved data
relocations and three were jump/call relocation words, but a canonical linked
diff was not run. Even if all thirteen resolve as expected, eighteen word
positions remain different.

The reviewed experiment record and limits are in
`docs/dossiers/func-0006d7d8.md`. The complete raw session is in
`docs/archive/matching-c-agent-sessions/2026-08-22-func-0006d7d8-opencode-session.json`.

## `func_00048510` best candidate

- File: `2026-08-22-func-00048510-best.c`
- Source worktree: `codex/legion-func-00048510` at `4526154`
- Size: 2,798 bytes
- SHA-256:
  `FD33BD2F443AFC5D915C6370EC4150C82F9A35B2BCB8AD58B0A39EE7BBC6525A`
- Status: `PURE_C`, nonmatching, and inactive

This is a byte-for-byte copy of the worker's final source. The latest canonical
linked diff established the accepted 496-byte placement and reported 60
differing instruction words and 186 differing bytes. Its linked target SHA-256
was `D1AE912690CD51C1050E0B71F16911F95ED921B6A5C5468DDD32F5DBA6D1711F`;
the retail target SHA-256 was
`9C49FD54E3C2E0CBFDFD65DC820D1D999229DE5C86439328832B2505C07639E4`.

No session export, temporary active-target configuration, or legacy Phase 8
record is preserved with this candidate. Resume it through the current target
and linkage workflow, and do not promote it unless the canonical target and
full-ROM verifiers pass.

## `func_002A0EF0` multi-owner retry

- File: `2026-08-30-func_002A0EF0-1bdce1a7d7.c`
- Source worktree: `codex/cutscene-func-002a0ef0`
- Size: 6,493 bytes
- SHA-256:
  `D242158C1822796AF4D3D1313A4556B5D6DE0CB4C34D263ED984DF2EF4F19949`
- Status: `PURE_C`, nonmatching, and inactive

The canonical two-owner diff established the accepted 1,132-byte placement and 22 candidate
relocations, then reported 351 differing bytes across 141 instruction words. Both original assembly
owners remain active. The complete experiment record is in
`docs/dossiers/func_002A0EF0-1bdce1a7d7.md`.
