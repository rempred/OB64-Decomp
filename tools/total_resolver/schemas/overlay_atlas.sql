PRAGMA foreign_keys = ON;
PRAGMA user_version = 1;

CREATE TABLE meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
) STRICT;

CREATE TABLE source_session (
    session_id TEXT PRIMARY KEY,
    raw_manifest_sha256 TEXT,
    session_product_summary_sha256 TEXT NOT NULL,
    bridge_version TEXT NOT NULL,
    closure_status TEXT NOT NULL,
    continuity_status TEXT NOT NULL,
    working_evidence_quality TEXT NOT NULL
) STRICT;

CREATE TABLE placement (
    placement_id TEXT PRIMARY KEY,
    placement_kind TEXT NOT NULL CHECK (placement_kind IN ('rom-dma', 'code-slab')),
    source_z64_start INTEGER NOT NULL,
    source_z64_end_exclusive INTEGER NOT NULL,
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    content_sha256 TEXT NOT NULL,
    byte_size INTEGER NOT NULL,
    mapping_delta INTEGER,
    region_class TEXT NOT NULL CHECK (region_class IN ('executable', 'data', 'mixed', 'unknown')),
    evidence_grade TEXT NOT NULL CHECK (evidence_grade IN ('verified', 'supported', 'candidate', 'unresolved')),
    mapping_method TEXT NOT NULL,
    transient_only INTEGER CHECK (transient_only IN (0, 1)),
    witness_count INTEGER NOT NULL CHECK (witness_count > 0)
) STRICT;

CREATE TABLE placement_witness (
    placement_id TEXT NOT NULL REFERENCES placement(placement_id),
    session_id TEXT NOT NULL REFERENCES source_session(session_id),
    local_witness_id TEXT NOT NULL,
    first_sequence INTEGER NOT NULL,
    last_sequence INTEGER NOT NULL,
    first_frame INTEGER,
    last_frame INTEGER,
    PRIMARY KEY (placement_id, session_id, local_witness_id)
) STRICT;

CREATE TABLE slab_member (
    slab_placement_id TEXT NOT NULL REFERENCES placement(placement_id),
    member_placement_id TEXT NOT NULL REFERENCES placement(placement_id),
    ordinal INTEGER NOT NULL,
    PRIMARY KEY (slab_placement_id, member_placement_id),
    UNIQUE (slab_placement_id, ordinal)
) STRICT;

CREATE TABLE function_placement (
    function_placement_id TEXT PRIMARY KEY,
    slab_placement_id TEXT NOT NULL REFERENCES placement(placement_id),
    function_id INTEGER NOT NULL,
    structural_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    source_z64_start INTEGER NOT NULL,
    source_z64_end_exclusive INTEGER NOT NULL,
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    confidence TEXT NOT NULL,
    mapping_method TEXT NOT NULL,
    witness_count INTEGER NOT NULL CHECK (witness_count > 0)
) STRICT;

CREATE TABLE function_placement_witness (
    function_placement_id TEXT NOT NULL REFERENCES function_placement(function_placement_id),
    session_id TEXT NOT NULL REFERENCES source_session(session_id),
    local_placement_id TEXT NOT NULL,
    first_sequence INTEGER NOT NULL,
    last_sequence INTEGER NOT NULL,
    first_frame INTEGER,
    last_frame INTEGER,
    PRIMARY KEY (function_placement_id, session_id, local_placement_id)
) STRICT;

CREATE TABLE region_instance (
    atlas_region_instance_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES source_session(session_id),
    local_region_instance_id TEXT NOT NULL,
    placement_id TEXT REFERENCES placement(placement_id),
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    content_sha256 TEXT NOT NULL,
    first_sequence INTEGER NOT NULL,
    end_sequence_exclusive INTEGER,
    first_frame INTEGER,
    last_observed_frame INTEGER,
    closure_reason TEXT,
    region_class TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    source_kind TEXT NOT NULL,
    source_identity TEXT,
    transient_at_most_two_frames INTEGER NOT NULL CHECK (transient_at_most_two_frames IN (0, 1)),
    UNIQUE (session_id, local_region_instance_id)
) STRICT;

CREATE TABLE destination_reuse (
    reuse_id TEXT PRIMARY KEY,
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    placement_count INTEGER NOT NULL CHECK (placement_count > 1),
    distinct_content_count INTEGER NOT NULL,
    ambiguity_kind TEXT NOT NULL
) STRICT;

CREATE TABLE destination_reuse_member (
    reuse_id TEXT NOT NULL REFERENCES destination_reuse(reuse_id),
    placement_id TEXT NOT NULL REFERENCES placement(placement_id),
    PRIMARY KEY (reuse_id, placement_id)
) STRICT;

CREATE TABLE unresolved_observation (
    atlas_unresolved_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES source_session(session_id),
    local_unresolved_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    sequence INTEGER,
    frame INTEGER,
    payload_json TEXT NOT NULL,
    UNIQUE (session_id, local_unresolved_id)
) STRICT;

CREATE TABLE static_function_coverage (
    function_id INTEGER PRIMARY KEY,
    structural_name TEXT NOT NULL,
    source_z64_start INTEGER NOT NULL,
    source_z64_end_exclusive INTEGER NOT NULL,
    placement_count INTEGER NOT NULL,
    witness_count INTEGER NOT NULL,
    observed INTEGER NOT NULL CHECK (observed IN (0, 1))
) STRICT;

CREATE INDEX placement_destination_idx
    ON placement(destination_physical_start, destination_physical_end_exclusive);
CREATE INDEX placement_source_idx
    ON placement(source_z64_start, source_z64_end_exclusive);
CREATE INDEX function_placement_name_idx ON function_placement(structural_name);
CREATE INDEX region_lifetime_idx ON region_instance(session_id, first_sequence, end_sequence_exclusive);
