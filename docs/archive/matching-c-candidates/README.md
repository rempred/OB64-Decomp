# Nonmatching Matching-C Candidate Archive

These files preserve useful C reconstructions that did not pass the canonical
matching gates. They are research inputs, not active source replacements.

Do not add one to `config/matching-c-targets.json` or describe it as matching C
without resuming the normal linked diff and verification workflow. The original
assembly remains the accepted owner.

Candidate identity includes the exact archived source bytes. Do not trim,
reformat, or otherwise rewrite a preserved candidate while retaining its old
candidate ID or SHA-256. A source change must be preserved as a successor with a
new identity and newly generated comparisons/references. If an exact frozen
input contains blank-at-EOL whitespace, an exact-path
`whitespace=-blank-at-eol` entry in the repository `.gitattributes` may suppress
that diagnostic without changing the file. Such exceptions must remain
path-local; global whitespace checking is unchanged.

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

## `func_00284288` preparatory candidates

- Predecessor: `2026-08-31-func_00284288-e8eb93fecb.c`, SHA-256
  `CC7F0E0DBF8C69C61DDFEE85947B3F13FBB736AC738CBF26BF0C345B8F04F24C`
- Structured successor: `2026-08-31-func_00284288-9ed0fdee46.c`, candidate
  `9ED0FDEE460C920DC9A3906DE125591A33055CC4F0175249790959EFBB8FFD16`,
  SHA-256
  `958986E6E7A4E933D10B8A41B8F4020C798282DEFC3B3E8A1D38C322FA279062`
- Status: `PURE_C` research candidates, nonmatching, inactive; original assembly
  ownership is unchanged

Both exact files predate the whitespace correction and contain blank-at-EOL
bytes. Their byte identities were retained. `.gitattributes` suppresses only
that diagnostic for these two paths, so `git diff --check` can still enforce all
other paths and whitespace classes. The structured successor's candidate-bound
case-CFG contract and reproduction procedure are recorded in
`docs/audit/2026-08-31-func-00284288-preparatory-reconstruction.md` and
`docs/dossiers/func_00284288-9ed0fdee46.md`.
