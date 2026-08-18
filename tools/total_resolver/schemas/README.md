# Total Resolver schemas

- `capture.sql` is the immutable raw-session database. Closed enums, monotonic event constraints,
  explicit continuity/loss state, and SQLite `STRICT` tables make malformed capture state visible.
- `normalized.schema.json` defines the source-neutral dynamic record envelope used by derivation
  adapters.
- `overlay_atlas.sql` stores normalized placement and region-lifetime history.
- `runtime_provenance.sql` stores exact execution and memory evidence separately from residency and
  sampled-PC context.
- `resolver.sql` stores the compact multi-lane R3 index over static, placement, runtime, field, and
  resource sources.

Schema-version changes require a migration and verification fixtures. Never edit a closed raw
session or an accepted generated product in place; rebuild a new product from its pinned sources.
