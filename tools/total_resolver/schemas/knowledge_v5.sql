-- Schema-5 factors stable static-data DMA knowledge so a rotating buffer does
-- not turn every resource/destination pairing into a permanent machine fact.
-- Executable, mixed, partial, and unresolved transfers remain exact placement
-- facts in the schema-2 tables.
PRAGMA user_version = 5;

CREATE TABLE dma_resource_fact (
    dma_resource_id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_domain TEXT NOT NULL CHECK (source_domain = 'cartridge-rom'),
    source_start INTEGER NOT NULL,
    source_end_exclusive INTEGER NOT NULL,
    matched_length INTEGER NOT NULL,
    content_id INTEGER NOT NULL REFERENCES exact_content(content_id),
    region_class TEXT NOT NULL CHECK (region_class = 'data'),
    mapping_method TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    classification_reason TEXT NOT NULL CHECK (
        classification_reason = 'static-data-full-rom-match'
    ),
    first_session_id TEXT NOT NULL,
    first_destination_physical_start INTEGER NOT NULL,
    first_destination_physical_end_exclusive INTEGER NOT NULL,
    observation_count INTEGER NOT NULL,
    session_count INTEGER NOT NULL,
    UNIQUE (
        source_domain, source_start, source_end_exclusive,
        matched_length, content_id, region_class, mapping_method
    ),
    CHECK (source_end_exclusive > source_start),
    CHECK (matched_length = source_end_exclusive - source_start),
    CHECK (first_destination_physical_start >= 0),
    CHECK (
        first_destination_physical_end_exclusive >
        first_destination_physical_start
    ),
    CHECK (first_destination_physical_end_exclusive <= 4194304),
    CHECK (
        first_destination_physical_end_exclusive -
        first_destination_physical_start = matched_length
    ),
    CHECK (observation_count >= 1),
    CHECK (session_count >= 1)
) STRICT;

CREATE TABLE dma_resource_session (
    dma_resource_id INTEGER NOT NULL REFERENCES dma_resource_fact(dma_resource_id),
    session_id TEXT NOT NULL,
    bridge_epoch TEXT NOT NULL,
    first_bridge_sequence INTEGER NOT NULL,
    last_bridge_sequence INTEGER NOT NULL,
    first_frame INTEGER,
    last_frame INTEGER,
    occurrence_count INTEGER NOT NULL,
    lifetime_context_count INTEGER NOT NULL,
    PRIMARY KEY (dma_resource_id, session_id),
    CHECK (first_bridge_sequence >= 1),
    CHECK (last_bridge_sequence >= first_bridge_sequence),
    CHECK (occurrence_count >= 1),
    CHECK (lifetime_context_count >= 1)
) STRICT, WITHOUT ROWID;

-- A static-data destination is a buffer slot, not a resource/slot pairing.
-- The bitmaps compactly retain every pairing that was actually emitted before
-- native factorized suppression; they are contextual and can be incomplete.
CREATE TABLE dma_data_destination_fact (
    dma_destination_id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    matched_length INTEGER NOT NULL,
    region_class TEXT NOT NULL CHECK (region_class = 'data'),
    mapping_method TEXT NOT NULL,
    first_session_id TEXT NOT NULL,
    observation_count INTEGER NOT NULL,
    session_count INTEGER NOT NULL,
    resource_max_ordinal INTEGER NOT NULL,
    distinct_resource_count INTEGER NOT NULL,
    resource_hit_bitmap BLOB NOT NULL,
    content_max_ordinal INTEGER NOT NULL,
    distinct_content_count INTEGER NOT NULL,
    content_hit_bitmap BLOB NOT NULL,
    UNIQUE (
        destination_physical_start, destination_physical_end_exclusive,
        matched_length, region_class, mapping_method
    ),
    CHECK (destination_physical_start >= 0),
    CHECK (destination_physical_end_exclusive > destination_physical_start),
    CHECK (destination_physical_end_exclusive <= 4194304),
    CHECK (
        destination_physical_end_exclusive - destination_physical_start =
        matched_length
    ),
    CHECK (observation_count >= 1),
    CHECK (session_count >= 1),
    CHECK (resource_max_ordinal >= 1),
    CHECK (distinct_resource_count >= 1),
    CHECK (length(resource_hit_bitmap) = (resource_max_ordinal + 7) / 8),
    CHECK (content_max_ordinal >= 1),
    CHECK (distinct_content_count >= 1),
    CHECK (length(content_hit_bitmap) = (content_max_ordinal + 7) / 8)
) STRICT;

CREATE TABLE dma_data_destination_session (
    dma_destination_id INTEGER NOT NULL REFERENCES dma_data_destination_fact(dma_destination_id),
    session_id TEXT NOT NULL,
    first_bridge_sequence INTEGER NOT NULL,
    last_bridge_sequence INTEGER NOT NULL,
    first_frame INTEGER,
    last_frame INTEGER,
    occurrence_count INTEGER NOT NULL,
    resource_max_ordinal INTEGER NOT NULL,
    distinct_resource_count INTEGER NOT NULL,
    resource_hit_bitmap BLOB NOT NULL,
    content_max_ordinal INTEGER NOT NULL,
    distinct_content_count INTEGER NOT NULL,
    content_hit_bitmap BLOB NOT NULL,
    PRIMARY KEY (dma_destination_id, session_id),
    CHECK (first_bridge_sequence >= 1),
    CHECK (last_bridge_sequence >= first_bridge_sequence),
    CHECK (occurrence_count >= 1),
    CHECK (resource_max_ordinal >= 1),
    CHECK (distinct_resource_count >= 1),
    CHECK (length(resource_hit_bitmap) = (resource_max_ordinal + 7) / 8),
    CHECK (content_max_ordinal >= 1),
    CHECK (distinct_content_count >= 1),
    CHECK (length(content_hit_bitmap) = (content_max_ordinal + 7) / 8)
) STRICT, WITHOUT ROWID;

-- One dense activity-ordinal namespace covers destination-exact placements,
-- static-data resources, and static-data destination slots.
CREATE TABLE dma_frontier_fact (
    dma_fact_ordinal INTEGER PRIMARY KEY AUTOINCREMENT,
    fact_kind TEXT NOT NULL CHECK (
        fact_kind IN ('exact-placement', 'data-resource', 'data-destination')
    ),
    dma_placement_id INTEGER REFERENCES dma_placement(dma_placement_id),
    dma_resource_id INTEGER REFERENCES dma_resource_fact(dma_resource_id),
    dma_destination_id INTEGER REFERENCES dma_data_destination_fact(dma_destination_id),
    CHECK (
        (fact_kind = 'exact-placement' AND dma_placement_id IS NOT NULL AND
         dma_resource_id IS NULL AND dma_destination_id IS NULL) OR
        (fact_kind = 'data-resource' AND dma_placement_id IS NULL AND
         dma_resource_id IS NOT NULL AND dma_destination_id IS NULL) OR
        (fact_kind = 'data-destination' AND dma_placement_id IS NULL AND
         dma_resource_id IS NULL AND dma_destination_id IS NOT NULL)
    )
) STRICT;

CREATE UNIQUE INDEX dma_frontier_exact_idx
    ON dma_frontier_fact(dma_placement_id)
    WHERE dma_placement_id IS NOT NULL;
CREATE UNIQUE INDEX dma_frontier_resource_idx
    ON dma_frontier_fact(dma_resource_id)
    WHERE dma_resource_id IS NOT NULL;
CREATE UNIQUE INDEX dma_frontier_destination_idx
    ON dma_frontier_fact(dma_destination_id)
    WHERE dma_destination_id IS NOT NULL;

CREATE INDEX dma_resource_source_idx
    ON dma_resource_fact(source_start, source_end_exclusive, dma_resource_id);
CREATE INDEX dma_resource_content_idx
    ON dma_resource_fact(content_id, dma_resource_id);
CREATE INDEX dma_resource_session_idx
    ON dma_resource_session(session_id, dma_resource_id);
CREATE INDEX dma_data_destination_physical_idx
    ON dma_data_destination_fact(
        destination_physical_start, destination_physical_end_exclusive,
        dma_destination_id
    );
CREATE INDEX dma_data_destination_session_idx
    ON dma_data_destination_session(session_id, dma_destination_id);
