-- Additive schema-3 context and candidate layer.  The schema-2 fact tables
-- remain the canonical machine-fact foundation so a replay can be compared
-- directly before the new database is selected.
PRAGMA user_version = 3;

CREATE TABLE source_registry (
    source_id TEXT PRIMARY KEY,
    source_kind TEXT NOT NULL,
    identity_kind TEXT NOT NULL,
    identity_value TEXT NOT NULL,
    source_path TEXT NOT NULL,
    review_state TEXT NOT NULL,
    evidence_boundary TEXT NOT NULL,
    registered_utc TEXT NOT NULL
) STRICT;

CREATE TABLE selected_source (
    source_role TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES source_registry(source_id),
    selected_utc TEXT NOT NULL
) STRICT;

CREATE TABLE session_catalog (
    session_id TEXT PRIMARY KEY,
    capture_reference TEXT NOT NULL,
    protocol_version TEXT NOT NULL,
    bridge_epoch TEXT NOT NULL,
    bridge_sequence_start INTEGER NOT NULL,
    bridge_sequence_end INTEGER NOT NULL,
    first_frame INTEGER,
    last_frame INTEGER,
    emitted_instruction_witnesses INTEGER NOT NULL,
    emitted_edge_witnesses INTEGER NOT NULL,
    sampled_pc_count INTEGER NOT NULL,
    semantic_marker_count INTEGER NOT NULL,
    region_lifetime_count INTEGER NOT NULL,
    context_completeness TEXT NOT NULL,
    limitation_text TEXT NOT NULL,
    CHECK (bridge_sequence_start >= 1),
    CHECK (bridge_sequence_end >= bridge_sequence_start)
) STRICT;

CREATE TABLE instruction_context_witness (
    instruction_id INTEGER NOT NULL REFERENCES instruction_fact(instruction_id),
    session_id TEXT NOT NULL,
    bridge_sequence INTEGER NOT NULL,
    frame INTEGER,
    native_generation INTEGER,
    observation_kind TEXT NOT NULL,
    PRIMARY KEY (instruction_id, session_id, bridge_sequence),
    CHECK (bridge_sequence >= 1),
    CHECK (native_generation IS NULL OR native_generation >= 0)
) STRICT, WITHOUT ROWID;

CREATE TABLE edge_context_witness (
    edge_id INTEGER NOT NULL REFERENCES edge_fact(edge_id),
    session_id TEXT NOT NULL,
    bridge_sequence INTEGER NOT NULL,
    frame INTEGER,
    source_generation INTEGER,
    destination_generation INTEGER,
    observation_kind TEXT NOT NULL,
    PRIMARY KEY (edge_id, session_id, bridge_sequence),
    CHECK (bridge_sequence >= 1),
    CHECK (source_generation IS NULL OR source_generation >= 0),
    CHECK (destination_generation IS NULL OR destination_generation >= 0)
) STRICT, WITHOUT ROWID;

CREATE TABLE region_lifetime_context (
    session_id TEXT NOT NULL,
    region_instance_id TEXT NOT NULL,
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    source_kind TEXT NOT NULL,
    source_identity TEXT,
    source_z64_start INTEGER,
    source_z64_end_exclusive INTEGER,
    first_sequence INTEGER NOT NULL,
    end_sequence_exclusive INTEGER,
    first_frame INTEGER,
    last_observed_frame INTEGER,
    last_observed_sequence INTEGER,
    closure_reason TEXT,
    region_class TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    loader_event_id TEXT,
    parent_region_instance_id TEXT,
    PRIMARY KEY (session_id, region_instance_id),
    CHECK (destination_physical_start >= 0),
    CHECK (destination_physical_end_exclusive > destination_physical_start),
    CHECK (destination_physical_end_exclusive <= 4194304),
    CHECK (end_sequence_exclusive IS NULL OR end_sequence_exclusive > first_sequence)
) STRICT, WITHOUT ROWID;

CREATE TABLE sampled_pc_context (
    session_id TEXT NOT NULL,
    sample_id TEXT NOT NULL,
    sequence INTEGER NOT NULL,
    bridge_sequence INTEGER,
    frame INTEGER,
    live_pc INTEGER NOT NULL,
    physical_pc INTEGER,
    opcode_u32 INTEGER,
    region_instance_id TEXT,
    function_id INTEGER REFERENCES static_function(function_id),
    z64_offset INTEGER,
    mapping_status TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    PRIMARY KEY (session_id, sample_id),
    CHECK (sequence >= 1),
    CHECK (physical_pc IS NULL OR physical_pc BETWEEN 0 AND 4194300),
    CHECK (opcode_u32 IS NULL OR opcode_u32 BETWEEN 0 AND 4294967295)
) STRICT, WITHOUT ROWID;

CREATE TABLE semantic_marker_context (
    session_id TEXT NOT NULL,
    marker_id INTEGER NOT NULL,
    marker_type TEXT NOT NULL,
    marker_source TEXT NOT NULL,
    confidence TEXT NOT NULL,
    label TEXT NOT NULL,
    note TEXT,
    start_sequence INTEGER,
    end_sequence INTEGER,
    start_frame INTEGER,
    end_frame INTEGER,
    created_utc TEXT NOT NULL,
    PRIMARY KEY (session_id, marker_id)
) STRICT, WITHOUT ROWID;

CREATE TABLE unresolved_index (
    session_id TEXT NOT NULL,
    local_unresolved_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    sequence INTEGER,
    frame INTEGER,
    live_address INTEGER,
    physical_address INTEGER,
    opcode_u32 INTEGER,
    source_physical_address INTEGER,
    destination_physical_address INTEGER,
    native_generation INTEGER,
    function_id INTEGER,
    z64_offset INTEGER,
    region_instance_id TEXT,
    next_evidence TEXT,
    PRIMARY KEY (session_id, local_unresolved_id),
    FOREIGN KEY (session_id, local_unresolved_id)
        REFERENCES unresolved_observation(session_id, local_unresolved_id),
    CHECK (physical_address IS NULL OR physical_address BETWEEN 0 AND 4194300),
    CHECK (opcode_u32 IS NULL OR opcode_u32 BETWEEN 0 AND 4294967295)
) STRICT, WITHOUT ROWID;

CREATE TABLE instruction_mapping_candidate (
    candidate_id INTEGER PRIMARY KEY AUTOINCREMENT,
    instruction_id INTEGER NOT NULL REFERENCES instruction_fact(instruction_id),
    function_id INTEGER NOT NULL REFERENCES static_function(function_id),
    z64_offset INTEGER NOT NULL,
    function_placement_id INTEGER REFERENCES function_placement_fact(function_placement_id),
    evidence_session_id TEXT,
    region_instance_id TEXT,
    candidate_state TEXT NOT NULL CHECK (candidate_state IN (
        'byte-confirmed-global-candidate',
        'contemporaneous-placement-candidate',
        'uniquely-resolved-live-mapping',
        'ambiguous-conflicting-mapping'
    )),
    evidence_kind TEXT NOT NULL,
    exact_bytes_confirmed INTEGER NOT NULL CHECK (exact_bytes_confirmed = 1),
    first_sequence INTEGER,
    last_sequence_exclusive INTEGER,
    contradiction_text TEXT,
    missing_evidence TEXT NOT NULL,
    recalculated_ledger_ordinal INTEGER NOT NULL,
    UNIQUE (
        instruction_id, function_id, z64_offset, function_placement_id,
        evidence_session_id, region_instance_id, evidence_kind
    )
) STRICT;

CREATE TABLE candidate_recalculation_queue (
    queue_id INTEGER PRIMARY KEY AUTOINCREMENT,
    physical_start INTEGER NOT NULL,
    physical_end_exclusive INTEGER NOT NULL,
    reason TEXT NOT NULL,
    queued_ledger_ordinal INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('queued', 'processed')),
    processed_candidate_count INTEGER,
    UNIQUE (physical_start, physical_end_exclusive, reason, queued_ledger_ordinal),
    CHECK (physical_start >= 0),
    CHECK (physical_end_exclusive > physical_start),
    CHECK (physical_end_exclusive <= 4194304)
) STRICT;

CREATE INDEX session_catalog_protocol_idx
    ON session_catalog(protocol_version, session_id);
CREATE INDEX instruction_opcode_idx
    ON instruction_fact(opcode_u32, instruction_id);
CREATE INDEX instruction_session_sequence_idx
    ON instruction_context_witness(session_id, bridge_sequence, instruction_id);
CREATE INDEX instruction_session_frame_idx
    ON instruction_context_witness(session_id, frame, instruction_id);
CREATE INDEX edge_session_sequence_idx
    ON edge_context_witness(session_id, bridge_sequence, edge_id);
CREATE INDEX edge_session_frame_idx
    ON edge_context_witness(session_id, frame, edge_id);
CREATE INDEX region_physical_lifetime_idx
    ON region_lifetime_context(
        destination_physical_start, destination_physical_end_exclusive,
        session_id, first_sequence, end_sequence_exclusive
    );
CREATE INDEX sampled_pc_session_frame_idx
    ON sampled_pc_context(session_id, frame, sample_id);
CREATE INDEX sampled_pc_session_sequence_idx
    ON sampled_pc_context(session_id, sequence, sample_id);
CREATE INDEX sampled_pc_opcode_idx
    ON sampled_pc_context(opcode_u32, sample_id);
CREATE INDEX marker_text_idx
    ON semantic_marker_context(marker_type, label, session_id);
CREATE INDEX unresolved_kind_idx
    ON unresolved_index(kind, session_id, sequence);
CREATE INDEX unresolved_opcode_idx
    ON unresolved_index(opcode_u32, session_id, sequence);
CREATE INDEX unresolved_physical_idx
    ON unresolved_index(physical_address, session_id, sequence);
CREATE INDEX candidate_instruction_state_idx
    ON instruction_mapping_candidate(instruction_id, candidate_state, candidate_id);
CREATE INDEX candidate_function_idx
    ON instruction_mapping_candidate(function_id, z64_offset, candidate_id);
CREATE INDEX candidate_range_queue_idx
    ON candidate_recalculation_queue(status, physical_start, physical_end_exclusive);
