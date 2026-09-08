# Matching research rollout R1 independent review

## Verdict

**Accepted** for implementation commit `8191ed573e325853a9416d582ac566ba9105e7d3`
plus read-only correction `1eb6d68e0a32b32b9fcfba1321977e5335e60efd`.

The rollout makes authenticated prior research visible during normal target intake, prepare/watch
presentation, and standalone analysis-packet presentation. Tracked observations remain usable
without a local database, computed identities stay separate from authored claims, and research
content remains outside compiler/decompiler inputs, packet cache identity, and matching acceptance.
No required fix remains.

## Review findings and corrections

Design review identified that `loadWorkbenchModel({requireBaserom:false})` has a deliberately
different null-byte target identity and therefore cannot authenticate candidate IDs created under
the canonical ROM target. The final intake does not substitute that null identity: it authenticates
the source/header/preprocessor/reference closure as `reference-only`, reports target binding
unavailable, and states that candidate identity cannot be verified. With the authenticated ROM,
candidate IDs bind the exact source to the current accepted target.

Early presentation review also found three ambiguity edges. Current-source comparison initially
searched another record with the same candidate ID instead of comparing the assessed row's actual
source hash; corrupt-store-only results could report empty history; and parent/related IDs had no
separate resolution status. The final implementation uses the row-specific hash, distinguishes
unavailable/partial discovery from no history, and reports relations as verified, unverified, or
invalid against authenticated same-target evidence without creating a graph protocol.

Post-commit review found that SQLite `mode=ro` created `-shm` and `-wal` files beside an otherwise
clean isolated database. Correction `1eb6d68e` uses guarded immutable reads on Windows, authenticates
the full main/sidecar state before and after, permits an unchanged SHM with an empty WAL, and rejects
a nonempty WAL/journal or concurrent writable handle. Other platforms explicitly leave optional
store supplementation unavailable. Archive discovery continues independently.

## Independent checks

- `node build/matching-research-rollout-review-r1/check.cjs` passed at `1eb6d68e`. It independently
  reclassified all seven tracked `func_001F3C00` archives and reproduced every source, expanded
  input, four-header dependency set, preprocessor identity, reference hash, candidate-to-target ID,
  and relation status. Exactly one record matches the current D037 source bytes.
- The same check loaded the accepted model without the ROM. All seven rows remained discoverable as
  `reference-only`, with null target ID, unavailable target binding, no false target mismatch, and
  unresolved relations kept explicit. A missing database did not create its parent directory.
- A separately authored cross-family fixture confirmed that identity capture leaves claims
  unchanged, computes source/expanded/dependency/reference identities through source policy, and
  rejects supplied `expected` fields or reference hashes. A grouped accepted target could read
  history while retaining the explicit single-member compile/import/preserve exclusion.
- An isolated SQLite store retained its exact main-file hash and file census after intake. A second
  copy with a preexisting 32 KiB SHM and empty WAL remained byte-identical; a nonempty-WAL copy
  returned store error without changing the WAL. Mutation requests through the read-only bridge
  reject. Corrupt-store-only intake reports unavailable rather than no history.
- The retained real packet at key
  `CCBD8372A28764B7E44D1A02EA075D1156EC3EB7784B16529974FB11C3208CA4`
  reauthenticated with all 19 manifest files. Its identity and manifest contain no research intake
  or observation data. The writer's real refresh added an observation after packet generation,
  returned it on the same cache key/directory, kept the manifest unchanged, and made zero second
  decompiler calls.
- `node tests/matching_intake.js` independently passed 24 focused controls plus the prepare/watch
  CLI wiring check, with zero KMC calls. Syntax checks for the changed JavaScript and Python entry
  points and `git diff --check` passed. The writer's released full matching-workbench suite passed;
  I did not repeat that broader suite after the narrow correction.
- The combined commits do not change the target model, source policy, database schema, production
  source, compiler identity/flags, ownership/linker rules, or verifier. The implementation contains
  no W8, 3C00, or candidate-ID exception. All twenty protected W8 source/shared inputs retain the
  R8 terminal hashes.

## Final identities

| Input | SHA-256 |
|---|---|
| `tools/lib/matching/intake.js` | `D552FADE2D6151E0B45AB55C0E1AE8D7AFB999C44BD3DAAA4A3A7F61BAB84A49` |
| `tools/lib/matching/research.js` | `8CFAF7C482BE3A209EF5B1102F2A5AB4C76602A9F0C2DB6818A50EEED269931B` |
| `tools/lib/matching/store.js` | `2C52B6B9A25CD405B00A43F776CDF56C1C3878ACB828753CE9A770D106CD36DC` |
| `tools/matching_workbench/store.py` | `EBCFC067AA99155E330989DD464E4390DCE6C79CF65551C93CC53E3BED20895C` |
| `tools/match.js` | `29EDC86BF3B05E17A6590998054BCAC67D0FAE2A6C1FF25B2B80522BA8182D35` |
| `tools/analysis_packet/core.js` | `07942201B831FB8149B8CD395FEC8834911B823F2C65CD3663C750A4477ED12C` |
| `tests/matching_intake.js` | `665D1CF536C4FCED7D0F15C26466E422AD39BE369EF3C20D1CC058874120E73D` |
| `tests/matching_workbench.js` | `C0B65D369C8F8E65D4B34ED1267A787521F5E04D6EDD871E12B032BAD6E28A68` |
| `tools/analysis_packet/test.js` | `3D5A87C0B2FB0E5FD4EDE3A3DADA3FE070FC92A4C275CC574E19DF9209AED15F` |
| `docs/MATCHING_WORKBENCH.md` | `B62783BDF0B275202D89D5E5A6DD75DA95DF0BC3B02E77A953F0AD008C34EFAE` |
| `docs/ANALYSIS_PACKETS.md` | `E659BFD64E074137992C93CE5389D0BA7B5B637B187188678919E6C605B8CF85` |
| `docs/Plans/task-logs/research-intake-rollout-r1.md` | `5E5BE3CF051040A0C6DDF7043D62CA3D75EE73082BCF31734DD123A76238201E` |

The implementation commit also binds the concise durable rules in `AGENTS.md` and
`docs/WORKFLOW.md`, the packet README, and the remaining reference changes. Independent generated
evidence remains ignored under `build/matching-research-rollout-review-r1/`.

## Acceptance limits

`valid` authenticates candidate/target, source, expansion, dependencies, preprocessing, and cited
references. It does not authenticate the prose claim, role, effect tag, `selectedBest`, semantic
meaning, or transfer to the current source. `matchesCurrentSource` compares source bytes and must be
read alongside record validity. Observation IDs remain opaque when their original import-path
provenance is unavailable.

The optional database is supplemental. Nonempty transaction sidecars, concurrent writers,
unsupported platforms, schema drift, corruption, or other store failures leave it unavailable;
tracked archive results remain separately visible. Archived parent/comparison IDs absent from the
store may require the specifically needed reimports before a new related record can be imported.

Research intake is presentation only. It does not select or activate source, modify the raw
decompiler context, authorize grouped single-member work, or change linked-diff and complete-wave
verification. This acceptance does not establish original-source identity, semantics, matching C,
ownership, relocation correctness, target-byte equality, complete-ROM equality, or completion of
any matching wave. No runtime, full-ROM verifier, or heavyweight structural audit was required
because no enumerated structural foundation changed.
