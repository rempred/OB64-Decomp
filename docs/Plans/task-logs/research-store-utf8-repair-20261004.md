# Research store UTF-8 repair — October 4, 2026

The Node research-store bridge sent UTF-8 JSON while Python decoded redirected
stdin as cp1252 on this Windows host. This corrupted Unicode note strings and
made existing observation provenance checks reject them. Other characters could
cause decoding to fail entirely. Candidate matching and canonical acceptance
were unaffected by the reported Shop metadata corruption.

The bridge now sends an explicit UTF-8 buffer and decodes strict UTF-8 bytes.
Escaped lone surrogates in keys or values reject before creating/opening a
database. Responses remain ASCII-escaped JSON. Source/candidate/observation
identity checks, immutable inserts and research authentication remain unchanged.

Validation:

- The new regression failed against the previous implementation.
- `tests/matching_store_transport.js`: 48 checks; cp1252, ASCII and UTF-8 text
  wrappers with Python UTF-8 mode both off and on; exact Unicode source/prose and
  identity round trips, idempotency, read-only queries, identity conflicts,
  malformed UTF-8 and lone-surrogate rejection on existing/absent databases.
- `tests/matching_research.js`: 22 checks, no code generation.
- `node tools/test.js`: all 30 routine suites passed in 158.7 seconds.
- GoldOx independently reviewed the plan and implementation through Agent Mail
  `ASTRA-RESEARCH-UTF8-20261004`, messages 974 and 977. The three recovery-script
  corrections in 977 were applied before live recovery.

With worker commands drained, SQLite backups and unchanged source-file/sidecar
censuses were saved under ignored `build/matching/director-utf8/`. Exactly 18
Shop observation metadata cells were recovered from original authored files.
Both implementations required the exact UTF-8-to-cp1252 corruption transform and
the original candidate/observation identities. Recovery used one transaction,
exact old-value guards, current evidence hashes, integrity/foreign-key checks,
and comparison of every logical table against the backup. All other data stayed
identical. Final reports check that no nonempty WAL/journal remains.

Normal intake on the repaired rehearsal copy authenticates all 58 current Shop
research observations, including all 18 repaired records. Its 27 historical
target-mismatch records remain distinct. This is research usability, not matching
acceptance. Backup, scripts, inventory, tests and per-row before/after hashes are
in the ignored recovery directory; they are not a new workflow protocol.

The broader inventory found four older malformed observations (one in solmode,
three in the shared store), each with a valid same-candidate/same-label replacement
observation already present. Those stores were not changed. Three associated
shared candidate metadata records also carry the encoding signature; sources and
current candidate identities agree. The 425 legacy-schema records are separately
identified and are not classified as encoding corruption by this inventory.

No structural audit/full-ROM run was required: source policy, verification,
compiler flags/identity, structural ownership and build logic were unchanged.
Combat and Shop retain their complete-wave acceptance requirements.
