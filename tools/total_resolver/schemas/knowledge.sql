PRAGMA foreign_keys = ON;
PRAGMA user_version = 2;

CREATE TABLE knowledge_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
) STRICT;

CREATE TABLE static_function (
    function_id INTEGER PRIMARY KEY,
    structural_name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    z64_start INTEGER NOT NULL,
    z64_end_exclusive INTEGER NOT NULL,
    confidence TEXT NOT NULL,
    CHECK (z64_end_exclusive > z64_start)
) STRICT;

-- A session ID is the idempotence key. The remaining identity fields are
-- exact metadata used to reject a conflicting reuse of that ID; none is a
-- content hash used as proof of a machine fact.
CREATE TABLE ingestion_ledger (
    ledger_ordinal INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL UNIQUE,
    capture_reference TEXT NOT NULL,
    raw_manifest_reference TEXT,
    capture_schema_version INTEGER NOT NULL,
    protocol_version TEXT NOT NULL,
    frontier_format_version INTEGER NOT NULL,
    frontier_identity_at_start TEXT NOT NULL,
    rom_normalized_sha256 TEXT NOT NULL,
    bridge_epoch TEXT NOT NULL,
    bridge_sequence_start INTEGER NOT NULL,
    bridge_sequence_end INTEGER NOT NULL,
    source_capture_path TEXT NOT NULL,
    source_product_path TEXT NOT NULL,
    source_product_reference TEXT,
    status TEXT NOT NULL CHECK (status = 'ingested'),
    ingested_utc TEXT NOT NULL,
    delta_summary_json TEXT NOT NULL,
    CHECK (bridge_sequence_start >= 1),
    CHECK (bridge_sequence_end >= bridge_sequence_start)
) STRICT;

-- Large variable blobs (currently event-time DMA destination bytes) use a
-- cheap non-cryptographic bucket. The bucket is deliberately non-unique;
-- exact BLOB equality is the only reuse decision.
CREATE TABLE exact_content (
    content_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fast_fingerprint INTEGER NOT NULL,
    byte_size INTEGER NOT NULL,
    content_bytes BLOB NOT NULL,
    first_session_id TEXT NOT NULL,
    CHECK (fast_fingerprint BETWEEN 0 AND 4294967295),
    CHECK (byte_size >= 0),
    CHECK (length(content_bytes) = byte_size)
) STRICT;

-- Page generations are contextual witnesses. They never own instructions
-- and cannot multiply structural facts when unrelated bytes churn.
CREATE TABLE page_generation_witness (
    session_id TEXT NOT NULL,
    bridge_epoch TEXT NOT NULL,
    physical_page_start INTEGER NOT NULL,
    native_generation INTEGER NOT NULL,
    first_bridge_sequence INTEGER NOT NULL,
    last_bridge_sequence INTEGER NOT NULL,
    observation_count INTEGER NOT NULL,
    PRIMARY KEY (session_id, bridge_epoch, physical_page_start, native_generation),
    CHECK (physical_page_start BETWEEN 0 AND 4190208),
    CHECK ((physical_page_start & 4095) = 0),
    CHECK (native_generation >= 0),
    CHECK (first_bridge_sequence >= 1),
    CHECK (last_bridge_sequence >= first_bridge_sequence),
    CHECK (observation_count >= 1)
) STRICT, WITHOUT ROWID;

-- Canonical executable identity: physical instruction address plus all four
-- opcode bytes. Same bytes at another placement and changed bytes at a reused
-- placement remain distinct without depending on mutable page contents.
CREATE TABLE instruction_fact (
    instruction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    physical_address INTEGER NOT NULL,
    opcode_u32 INTEGER NOT NULL,
    opcode_bytes BLOB NOT NULL,
    function_id INTEGER REFERENCES static_function(function_id),
    z64_offset INTEGER,
    mapping_status TEXT NOT NULL,
    first_session_id TEXT NOT NULL,
    observation_count INTEGER NOT NULL,
    discovery_session_count INTEGER NOT NULL,
    UNIQUE (physical_address, opcode_bytes),
    CHECK (physical_address BETWEEN 0 AND 8388604),
    CHECK ((physical_address & 3) = 0),
    CHECK (opcode_u32 BETWEEN 0 AND 4294967295),
    CHECK (length(opcode_bytes) = 4),
    CHECK (observation_count >= 1),
    CHECK (discovery_session_count >= 1)
) STRICT;

CREATE TABLE instruction_session (
    instruction_id INTEGER NOT NULL REFERENCES instruction_fact(instruction_id),
    session_id TEXT NOT NULL,
    first_bridge_sequence INTEGER NOT NULL,
    last_bridge_sequence INTEGER NOT NULL,
    observation_count INTEGER NOT NULL,
    PRIMARY KEY (instruction_id, session_id),
    CHECK (first_bridge_sequence >= 1),
    CHECK (last_bridge_sequence >= first_bridge_sequence),
    CHECK (observation_count >= 1)
) STRICT, WITHOUT ROWID;

CREATE TABLE instruction_generation_witness (
    instruction_id INTEGER NOT NULL REFERENCES instruction_fact(instruction_id),
    session_id TEXT NOT NULL,
    bridge_epoch TEXT NOT NULL,
    native_generation INTEGER NOT NULL,
    first_bridge_sequence INTEGER NOT NULL,
    last_bridge_sequence INTEGER NOT NULL,
    observation_count INTEGER NOT NULL,
    PRIMARY KEY (instruction_id, session_id, bridge_epoch, native_generation),
    CHECK (native_generation >= 0),
    CHECK (first_bridge_sequence >= 1),
    CHECK (last_bridge_sequence >= first_bridge_sequence),
    CHECK (observation_count >= 1)
) STRICT, WITHOUT ROWID;

-- One bit per aligned instruction address on a physical page. Exact opcode
-- alternatives are held in instruction_fact and exported with this summary.
CREATE TABLE frontier_page_bitmap (
    physical_page_start INTEGER PRIMARY KEY,
    instruction_bitmap BLOB NOT NULL,
    CHECK (physical_page_start BETWEEN 0 AND 4190208),
    CHECK ((physical_page_start & 4095) = 0),
    CHECK (length(instruction_bitmap) = 128)
) STRICT;

CREATE TABLE edge_fact (
    edge_id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_instruction_id INTEGER NOT NULL REFERENCES instruction_fact(instruction_id),
    destination_instruction_id INTEGER NOT NULL REFERENCES instruction_fact(instruction_id),
    edge_kind TEXT NOT NULL,
    first_session_id TEXT NOT NULL,
    observation_count INTEGER NOT NULL,
    discovery_session_count INTEGER NOT NULL,
    UNIQUE (source_instruction_id, destination_instruction_id, edge_kind),
    CHECK (observation_count >= 1),
    CHECK (discovery_session_count >= 1)
) STRICT;

CREATE TABLE edge_session (
    edge_id INTEGER NOT NULL REFERENCES edge_fact(edge_id),
    session_id TEXT NOT NULL,
    first_bridge_sequence INTEGER NOT NULL,
    last_bridge_sequence INTEGER NOT NULL,
    observation_count INTEGER NOT NULL,
    PRIMARY KEY (edge_id, session_id),
    CHECK (first_bridge_sequence >= 1),
    CHECK (last_bridge_sequence >= first_bridge_sequence),
    CHECK (observation_count >= 1)
) STRICT, WITHOUT ROWID;

CREATE TABLE edge_generation_witness (
    edge_id INTEGER NOT NULL REFERENCES edge_fact(edge_id),
    session_id TEXT NOT NULL,
    bridge_epoch TEXT NOT NULL,
    source_generation INTEGER NOT NULL,
    destination_generation INTEGER NOT NULL,
    first_bridge_sequence INTEGER NOT NULL,
    last_bridge_sequence INTEGER NOT NULL,
    observation_count INTEGER NOT NULL,
    PRIMARY KEY (
        edge_id, session_id, bridge_epoch, source_generation, destination_generation
    ),
    CHECK (source_generation >= 0),
    CHECK (destination_generation >= 0),
    CHECK (first_bridge_sequence >= 1),
    CHECK (last_bridge_sequence >= first_bridge_sequence),
    CHECK (observation_count >= 1)
) STRICT, WITHOUT ROWID;

CREATE TABLE call_fact (
    edge_id INTEGER PRIMARY KEY REFERENCES edge_fact(edge_id),
    caller_function_id INTEGER NOT NULL REFERENCES static_function(function_id),
    callee_function_id INTEGER NOT NULL REFERENCES static_function(function_id),
    call_kind TEXT NOT NULL,
    first_session_id TEXT NOT NULL
) STRICT;

CREATE TABLE dma_placement (
    dma_placement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_domain TEXT NOT NULL,
    source_start INTEGER NOT NULL,
    source_end_exclusive INTEGER NOT NULL,
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    matched_length INTEGER NOT NULL,
    content_id INTEGER NOT NULL REFERENCES exact_content(content_id),
    region_class TEXT NOT NULL,
    mapping_method TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    first_session_id TEXT NOT NULL,
    observation_count INTEGER NOT NULL,
    session_count INTEGER NOT NULL,
    UNIQUE (
        source_domain, source_start, source_end_exclusive,
        destination_physical_start, destination_physical_end_exclusive,
        matched_length, content_id, region_class, mapping_method
    ),
    CHECK (source_end_exclusive > source_start),
    CHECK (destination_physical_start >= 0),
    CHECK (destination_physical_end_exclusive > destination_physical_start),
    CHECK (destination_physical_end_exclusive <= 4194304),
    CHECK (matched_length >= 0),
    CHECK (observation_count >= 1),
    CHECK (session_count >= 1)
) STRICT;

CREATE TABLE dma_session_witness (
    dma_placement_id INTEGER NOT NULL REFERENCES dma_placement(dma_placement_id),
    session_id TEXT NOT NULL,
    bridge_epoch TEXT NOT NULL,
    first_bridge_sequence INTEGER NOT NULL,
    last_bridge_sequence INTEGER NOT NULL,
    first_frame INTEGER,
    last_frame INTEGER,
    occurrence_count INTEGER NOT NULL,
    lifetime_context_count INTEGER NOT NULL,
    PRIMARY KEY (dma_placement_id, session_id),
    CHECK (first_bridge_sequence >= 1),
    CHECK (last_bridge_sequence >= first_bridge_sequence),
    CHECK (occurrence_count >= 1),
    CHECK (lifetime_context_count >= 1)
) STRICT, WITHOUT ROWID;

CREATE TABLE function_placement_fact (
    function_placement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    function_id INTEGER NOT NULL REFERENCES static_function(function_id),
    source_z64_start INTEGER NOT NULL,
    source_z64_end_exclusive INTEGER NOT NULL,
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    mapping_method TEXT NOT NULL,
    first_session_id TEXT NOT NULL,
    observation_count INTEGER NOT NULL,
    session_count INTEGER NOT NULL,
    UNIQUE (
        function_id, source_z64_start, source_z64_end_exclusive,
        destination_physical_start, destination_physical_end_exclusive,
        mapping_method
    ),
    CHECK (source_z64_end_exclusive > source_z64_start),
    CHECK (destination_physical_end_exclusive > destination_physical_start),
    CHECK (observation_count >= 1),
    CHECK (session_count >= 1)
) STRICT;

CREATE TABLE function_placement_session (
    function_placement_id INTEGER NOT NULL REFERENCES function_placement_fact(function_placement_id),
    session_id TEXT NOT NULL,
    first_sequence INTEGER NOT NULL,
    last_sequence INTEGER NOT NULL,
    occurrence_count INTEGER NOT NULL,
    PRIMARY KEY (function_placement_id, session_id),
    CHECK (last_sequence >= first_sequence),
    CHECK (occurrence_count >= 1)
) STRICT, WITHOUT ROWID;

CREATE TABLE controller_transition (
    session_id TEXT NOT NULL,
    bridge_sequence INTEGER NOT NULL,
    frame INTEGER,
    end_bridge_sequence_exclusive INTEGER,
    end_frame_exclusive INTEGER,
    controller INTEGER NOT NULL,
    state_u32 INTEGER NOT NULL,
    buttons_u32 INTEGER NOT NULL,
    stick_x INTEGER NOT NULL,
    stick_y INTEGER NOT NULL,
    injected_by_bridge INTEGER NOT NULL CHECK (injected_by_bridge IN (0, 1)),
    capture_phase TEXT NOT NULL,
    PRIMARY KEY (session_id, bridge_sequence),
    CHECK (bridge_sequence >= 1),
    CHECK (controller = 0),
    CHECK (state_u32 BETWEEN 0 AND 4294967295),
    CHECK (buttons_u32 BETWEEN 0 AND 4294967295),
    CHECK (stick_x BETWEEN -128 AND 127),
    CHECK (stick_y BETWEEN -128 AND 127)
) STRICT, WITHOUT ROWID;

CREATE TABLE unresolved_observation (
    session_id TEXT NOT NULL,
    local_unresolved_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    sequence INTEGER,
    frame INTEGER,
    payload_json TEXT NOT NULL,
    PRIMARY KEY (session_id, local_unresolved_id)
) STRICT, WITHOUT ROWID;

CREATE TABLE atlas_destination_materialized (
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    placement_count INTEGER NOT NULL,
    distinct_content_count INTEGER NOT NULL,
    occurrence_count INTEGER NOT NULL,
    session_count INTEGER NOT NULL,
    PRIMARY KEY (destination_physical_start, destination_physical_end_exclusive)
) STRICT, WITHOUT ROWID;

CREATE TABLE runtime_function_materialized (
    function_id INTEGER PRIMARY KEY REFERENCES static_function(function_id),
    instruction_count INTEGER NOT NULL,
    incoming_edge_count INTEGER NOT NULL,
    outgoing_edge_count INTEGER NOT NULL,
    incoming_call_count INTEGER NOT NULL,
    outgoing_call_count INTEGER NOT NULL,
    execution_session_count INTEGER NOT NULL
) STRICT;

CREATE TABLE resolver_function_materialized (
    function_id INTEGER PRIMARY KEY REFERENCES static_function(function_id),
    placement_count INTEGER NOT NULL,
    instruction_count INTEGER NOT NULL,
    exact_edge_count INTEGER NOT NULL,
    call_relationship_count INTEGER NOT NULL,
    coverage_class TEXT NOT NULL CHECK (coverage_class IN (
        'placed-and-executed', 'placed-not-executed', 'executed-unplaced', 'never-observed'
    ))
) STRICT;

CREATE TABLE materialization_state (
    materialization TEXT PRIMARY KEY CHECK (materialization IN (
        'overlay-atlas', 'runtime-provenance', 'total-resolver'
    )),
    last_ledger_ordinal INTEGER NOT NULL,
    row_count INTEGER NOT NULL,
    updated_utc TEXT NOT NULL
) STRICT;

CREATE TABLE frontier_state (
    singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
    format_version INTEGER NOT NULL,
    frontier_identity TEXT NOT NULL,
    database_revision INTEGER NOT NULL,
    ledger_ordinal INTEGER NOT NULL,
    physical_page_count INTEGER NOT NULL,
    instruction_count INTEGER NOT NULL,
    edge_count INTEGER NOT NULL,
    generated_utc TEXT NOT NULL
) STRICT;

CREATE INDEX exact_content_bucket_idx ON exact_content(fast_fingerprint, byte_size);
CREATE INDEX page_generation_physical_idx ON page_generation_witness(physical_page_start);
CREATE INDEX instruction_physical_idx ON instruction_fact(physical_address, instruction_id);
CREATE INDEX instruction_function_idx ON instruction_fact(function_id, instruction_id);
CREATE INDEX edge_source_idx ON edge_fact(source_instruction_id, edge_id);
CREATE INDEX edge_destination_idx ON edge_fact(destination_instruction_id, edge_id);
CREATE INDEX dma_destination_idx ON dma_placement(
    destination_physical_start, destination_physical_end_exclusive
);
CREATE INDEX dma_source_idx ON dma_placement(source_start, source_end_exclusive);
CREATE INDEX function_placement_function_idx ON function_placement_fact(function_id);
