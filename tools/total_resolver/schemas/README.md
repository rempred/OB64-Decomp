# Total Resolver schemas

- `capture.sql` is the immutable raw-session database. Closed enums, monotonic event constraints,
  explicit continuity/loss state, and SQLite `STRICT` tables make malformed capture state visible.
  Schema 4 adds the required pre-execution native snapshot contract for vanilla OB64's lower
  4 MiB. Project64 may allocate 4 or 8 MiB; upper-memory events are outside the schema domain.
  Its legacy SHA-named columns are storage/diagnostic compatibility fields, not acceptance gates;
  referenced BLOB bytes and their exact metadata are authoritative.
- `knowledge.sql` is the canonical structural fact foundation, successful-ingestion ledger,
  checkpointed coverage frontier, contextual generation witnesses, and incremental
  atlas/runtime/resolver materializations. Executable facts use direct physical-address/opcode
  keys. DMA blobs use a non-unique CRC32 bucket followed by exact BLOB comparison.
- `knowledge_v3.sql` adds the source/session catalog, instruction and edge witnesses, region
  lifetimes, sampled PCs, semantic markers, typed unresolved indexes, candidate evidence, and
  affected-range reconciliation queue. It retains the schema-2 foundation for exact migration
  comparison.
- `knowledge_activity_v3.sql` adds protocol-0.13 stop-time known-fact activity bitmaps and bounded
  marker execution-context windows. Frontier format 4 exports stable ordinals with the exact facts
  to native Project64 without querying SQLite on the emulator thread.
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
