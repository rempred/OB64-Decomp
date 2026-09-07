# Combat bridge provenance retrieval r1

## Outcome and scope

Status: complete. The named parent bridge working bytes are exactly identified and repeatedly cited, but the bounded records do not attribute the complete current uncommitted delta to an authoring task/worker/claim or an accepted bridge-implementation review. This is a provenance result only; it does not decide ownership, integration or correction design.

## Current parent path identity

Parent repository: `C:/Users/Joe/Projects/OgreBattlel64`, branch `main`, HEAD `f940a2825ac97453746d3e9cef9c5cabc60a8dd2`.

| Identity | Value |
|---|---|
| Path status | `M tools/project64/ob64_pj64_bridge.js` |
| Current working file | 112,356 bytes; 2,827 lines; SHA-256 `1133A66C5C5743B8B40F1CC410A6EB8A64639CAC2E750B74F6DFBC48186EBF1F` |
| Current would-be Git blob | `c44958933c124c16036a2646046a589885c9a00a` |
| Parent HEAD blob | `ef380014e96f829023d4e77c3d60ca07b42c35b7`; 62,942 bytes; 1,725 lines; SHA-256 `2271A074789995D73645B274D6EF7BE1B7824D0A9B9BB4ADFA97E0E965A01F08` |
| Working diff versus HEAD | 1,323 additions, 221 deletions |
| Last committed path change | `e8d275b87478fa9001e8b5e806b176ec32349e7b` |

The current would-be blob is not reachable from any ref returned by `git rev-list --objects --all` in the parent repository. This establishes that the current bytes are not the committed HEAD source. It does not prove that the blob never existed in an unavailable repository or discarded object.

## Explicit parent Git history

| Commit | Author/date | Blob and raw SHA-256 | Subject |
|---|---|---|---|
| `e8d275b87478fa9001e8b5e806b176ec32349e7b` | Codex `<codex@openai.com>`, 2026-08-18 | `ef380014e96f829023d4e77c3d60ca07b42c35b7`; `2271A074789995D73645B274D6EF7BE1B7824D0A9B9BB4ADFA97E0E965A01F08` | `feat(project64): add ordered trace and input capture` |
| `ed67c104097c8b14d3aac1fdc67bfc507796ff3c` | Codex `<codex@openai.com>`, 2026-07-28 | `e384ec251f23ab967b435d062a3ccb966be136cb`; `FBF04CD9FB1E5852004C857EEB06C6A9F77FDC6BC34554F67C2046A1892202F2` | `research: preserve combat and Project64 proof tooling` |
| `7f5c83ed5534a7458c73b8372b07bb422b088f71` | Codex `<codex@openai.com>`, 2026-06-28 | `afa922792e6a81bdcb4b36348e2cd43d47c0cf40`; `09441B996CD8F8AD52AD29E584526C314C043F28AB30732C6B4665FC314F08CB` | `Trace overlay DMA requesters and cache prep` |
| `184407d7ff43f00229d05ce69a5f01b90d7626d4` | Codex `<codex@openai.com>`, 2026-06-25 | `0f86332dcc592f049d9a07f1c3b5911ad22f8e0f`; `97AAF641C3AF798E53050F50EFA4A68111FBBF0F02EE257060B74156D739F406` | `Initialize parent research repo` |

Git therefore attributes the committed base and its earlier versions. It supplies no commit author for the current `+1323/-221` working delta.

## Exact recorded bindings

1. `config/total-resolver/sources.json` names the path as `active-runtime-dependency`, protocol `0.17.0`, SHA-256 `1133A66C...EBF1F`. Its current raw SHA-256 is `8956BC7A0945E4D46CC3F652DA98175E9D100DC044A7873095035AF7CCA43A76`. The exact config bytes and active-bridge hash were introduced in child commit `1f8660dd08d2ebbb1023894c5de2a41c55d4e849`, authored by Codex `<codex@local>` on 2026-08-28 with subject `Complete focused schema-5 Total Resolver workflow`. The config bytes remain unchanged at assignment commit `604f09e63db208e0b788fe289bb2a2efb0a8deda`.

2. `docs/total-resolver/implementation-status.md`, committed in `1f8660dd...e849`, records protocol 0.17 as implemented and locally verified, with production JavaScript replay, native build/tests and `doctor` passing. It also records that Project64 was not launched during the correction. This is a release/status record from the implementation commit, not a separate reviewer attribution for the parent working delta.

3. `docs/total-resolver/persistent-coverage-decision.md`, also committed in `1f8660dd...e849`, says schema 5/frontier 6/protocol 0.17 are “implemented and independently verified.” The document does not name a reviewer, review task/claim or separate accepted-review commit for the parent bridge delta.

4. The later Accepted selector-observer review at `19049cda3b18b1275182a97f5b3ff8d56300798f` hash-pins the exact parent bridge through API manifest SHA-256 `ED2C278C69A6D42291BF3A179BE9ACABBA4033A31B1FC39BF30FB8AD73C9A722`. The review records recomputing all API hashes plus bridge-harness and `doctor` passes. Its verdict explicitly accepts the frozen selector preparation/adapter for one later bounded run under prerequisites. It does not attribute or accept the complete prior parent-file delta.

5. Runtime setup release `e9f54c1cc61b4e3826e7ca6269102da8bf248a59` preserves a `doctor` artifact that reports PASS for this activeBridge identity and the configured runtime source set. The setup report is blocked/incomplete, says review pending, records no source change and releases ownership.

6. Startup diagnosis release `d9772385464cd076ad04860c91c63df77e293fdc` repeats the exact parent SHA-256, reproduces the parser behavior, records root-cause review pending, and says correction/deployment remain unperformed. It requires a fresh scoped correction and review.

7. The current correction draft at `2284c2ded2a770c424c583b04e2a9baf66920f36` explicitly says the pre-existing uncommitted delta must be attribution-reconciled and must not be staged or committed merely because it shares the path. Its status is draft/no execution authority.

## Literal gap

Within the exact named records, their directly cited Total Resolver records, bounded exact-hash searches, the ignored Total Resolver JSON/markdown/text records that contain this hash, and the parent path Git history/reachable objects, no record identifies:

- the authoring task, worker or claim for the complete current parent delta;
- a parent commit containing current blob `c44958933c124c16036a2646046a589885c9a00a`;
- a separately attributable accepted review authorizing integration of the entire prior delta;
- current live ownership, permission to stage/commit, or safe absorption of unrelated parent history.

The exact bytes remain identity-bound and historically exercised at narrower scopes. Those facts cannot be strengthened into authorship or integration authority.

## Claims and evidence grades

- **Verified literal identity:** current file/hash/size, HEAD blob/hash, diff counts and committed path history were read directly from the parent working tree and Git.
- **Verified recorded citation:** child config introduction, report commits, record hashes, statuses and line bindings were read directly from Git/current files.
- **Bounded negative result:** the missing attribution/acceptance result is limited to the searched records and reachable parent Git refs listed in the package.
- **No semantic or ownership conclusion:** current ownership and safety to integrate remain unestablished.

## Evidence index

- Package: `build/total-resolver/combat-bridge-provenance-retrieval-r1/provenance.json`.
- Parent source path: `C:/Users/Joe/Projects/OgreBattlel64/tools/project64/ob64_pj64_bridge.js` (read-only).
- Canonical binding: `config/total-resolver/sources.json`.
- Protocol records: `docs/total-resolver/implementation-status.md`, `docs/total-resolver/persistent-coverage-decision.md`.
- Narrow accepted review: `docs/Plans/task-logs/combat-selector-observer-review-r1.md` and ignored API manifest.
- Historical authentication: `docs/Plans/task-logs/combat-selector-runtime-setup-r1.md` and its ignored `doctor.txt`.
- Current diagnosis/boundary: `docs/Plans/task-logs/combat-capture-startup-r4.md`, `docs/Plans/prompts/combat-capture-startup-correction-r1.md`.

## Verification summary

- Parent branch/HEAD, status, raw hashes, Git blobs, file sizes/line counts and `+1323/-221` diff were re-read before package creation.
- All four parent history commit/file identities were derived from Git.
- Full identities for `1f8660dd`, `19049cda`, `8949896b`, `e9f54c1c`, `d9772385`, `2284c2de` and assignment `604f09e6` were verified from child Git.
- The exact config bytes at `1f8660dd` equal the current/assignment bytes.
- Both selector adapter/reviewer API manifests equal SHA-256 `ED2C278C69A6D42291BF3A179BE9ACABBA4033A31B1FC39BF30FB8AD73C9A722` and contain the exact parent bridge SHA-256.

## Changed surfaces

- `docs/Plans/task-logs/combat-bridge-provenance-retrieval-r1.claim.json`
- `docs/Plans/task-logs/combat-bridge-provenance-retrieval-r1.md`
- `build/total-resolver/combat-bridge-provenance-retrieval-r1/provenance.json`

## Failed paths and limits

No required read failed. No account/session database, live bridge, native callback, runtime, source copy, implementation, build, verifier or Git mutation was used. Exact-hash search excluded unrelated bulk corpus/generated records after bounded relevant matches were established.

## Protocol deviations

None.

## Proposed canonical-document changes

None.

## Next action

Director may use the exact byte/history bindings and bounded attribution gap to decide whether a separate provenance authority or a freshly bounded replacement delta is required. All retrieval writes are released at terminal handoff.
