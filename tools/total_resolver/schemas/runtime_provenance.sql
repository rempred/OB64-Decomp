PRAGMA foreign_keys = ON;
PRAGMA user_version = 1;

CREATE TABLE meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
) STRICT;

CREATE TABLE source_session (
    session_id TEXT PRIMARY KEY,
    session_product_summary_sha256 TEXT NOT NULL,
    overlay_source_present INTEGER NOT NULL CHECK (overlay_source_present IN (0, 1)),
    continuity_status TEXT NOT NULL,
    working_evidence_quality TEXT NOT NULL
) STRICT;

CREATE TABLE execution_observation (
    runtime_execution_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES source_session(session_id),
    local_execution_id TEXT NOT NULL,
    sequence INTEGER NOT NULL,
    bridge_sequence INTEGER,
    frame INTEGER,
    live_pc INTEGER NOT NULL,
    physical_pc INTEGER NOT NULL,
    observation_kind TEXT NOT NULL,
    execution_claim TEXT NOT NULL CHECK (execution_claim IN ('observed', 'sampled-only')),
    atlas_region_instance_id TEXT,
    z64_offset INTEGER,
    function_id INTEGER,
    structural_name TEXT,
    mapping_method TEXT,
    mapping_status TEXT NOT NULL,
    evidence_grade TEXT NOT NULL CHECK (evidence_grade IN ('verified', 'supported', 'candidate', 'unresolved')),
    register_snapshot_json TEXT,
    return_address INTEGER,
    review_state TEXT NOT NULL,
    UNIQUE (session_id, local_execution_id)
) STRICT;

CREATE TABLE memory_access (
    runtime_memory_access_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES source_session(session_id),
    local_memory_access_id TEXT NOT NULL,
    sequence INTEGER NOT NULL,
    bridge_sequence INTEGER NOT NULL,
    frame INTEGER,
    access_kind TEXT NOT NULL CHECK (access_kind IN ('read', 'write')),
    width_bits INTEGER,
    effective_address INTEGER NOT NULL,
    value_text TEXT,
    value_high_text TEXT,
    accessor_live_pc INTEGER NOT NULL,
    accessor_physical_pc INTEGER NOT NULL,
    atlas_region_instance_id TEXT,
    z64_instruction INTEGER,
    function_id INTEGER,
    structural_name TEXT,
    mapping_method TEXT,
    review_state TEXT NOT NULL,
    UNIQUE (session_id, local_memory_access_id)
) STRICT;

CREATE TABLE observed_edge (
    observed_edge_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES source_session(session_id),
    execution_sequence INTEGER NOT NULL,
    caller_live_pc INTEGER NOT NULL,
    callee_live_pc INTEGER NOT NULL,
    caller_function_id INTEGER,
    caller_structural_name TEXT,
    callee_function_id INTEGER,
    callee_structural_name TEXT,
    edge_kind TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    review_state TEXT NOT NULL
) STRICT;

CREATE TABLE runtime_unresolved (
    runtime_unresolved_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES source_session(session_id),
    local_unresolved_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    sequence INTEGER,
    frame INTEGER,
    payload_json TEXT NOT NULL,
    UNIQUE (session_id, local_unresolved_id)
) STRICT;

CREATE TABLE runtime_conflict (
    conflict_id TEXT PRIMARY KEY,
    conflict_kind TEXT NOT NULL,
    live_pc INTEGER,
    session_id TEXT,
    detail_json TEXT NOT NULL
) STRICT;

CREATE TABLE static_function_runtime_coverage (
    function_id INTEGER PRIMARY KEY,
    structural_name TEXT NOT NULL,
    exact_execution_observation_count INTEGER NOT NULL,
    sampled_pc_count INTEGER NOT NULL,
    memory_access_count INTEGER NOT NULL,
    observed_executed INTEGER NOT NULL CHECK (observed_executed IN (0, 1))
) STRICT;

CREATE INDEX execution_pc_idx ON execution_observation(live_pc, session_id, sequence);
CREATE INDEX execution_function_idx ON execution_observation(structural_name);
CREATE INDEX memory_address_idx ON memory_access(effective_address, access_kind);
CREATE INDEX memory_accessor_idx ON memory_access(structural_name);
