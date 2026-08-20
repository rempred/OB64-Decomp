# Total Resolver schemas

- `capture.sql` is the immutable raw-session database. Closed enums, monotonic event constraints,
  explicit continuity/loss state, and SQLite `STRICT` tables make malformed capture state visible.
  Schema 4 adds the required pre-execution native snapshot contract for vanilla OB64's lower
  4 MiB. Project64 may allocate 4 or 8 MiB; upper-memory events are outside the schema domain.
  Its legacy SHA-named columns are storage/diagnostic compatibility fields, not acceptance gates;
  referenced BLOB bytes and their exact metadata are authoritative.
- `knowledge.sql` is the schema-2 structural fact store, successful-ingestion ledger,
  checkpointed coverage frontier, contextual generation witnesses, and incremental
  atlas/runtime/resolver materializations. Executable facts use direct physical-address/opcode
  keys. DMA blobs use a non-unique CRC32 bucket followed by exact BLOB comparison. Frontier format
  3 exports these exact facts to native Project64 without querying SQLite on the emulator thread.
- `normalized.schema.json` defines the source-neutral dynamic record envelope used by derivation
  adapters.
- `overlay_atlas.sql` stores normalized placement and region-lifetime history.
- `runtime_provenance.sql` stores exact execution and memory evidence separately from residency and
  sampled-PC context.
- `resolver.sql` stores the compact multi-lane R3 index over static, placement, runtime, field, and
  resource sources.

Schema-version changes require a migration and verification fixtures. Never edit a closed raw
session, selected knowledge database, or accepted generated product in place; migrate/rebuild a
new database or product from its pinned sources and select it only after verification.
