-- Schema-4 focused capture context.  These rows are observational context;
-- canonical instruction/edge/DMA identities remain in the schema-2/3 tables.
PRAGMA user_version = 4;

CREATE TABLE focused_capture_session (
    session_id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL,
    profile_version INTEGER NOT NULL,
    configured_watch_count INTEGER NOT NULL,
    entry_witness_count INTEGER NOT NULL,
    return_witness_count INTEGER NOT NULL,
    configuration_json TEXT NOT NULL,
    limitation_text TEXT NOT NULL,
    CHECK (profile_version >= 1),
    CHECK (configured_watch_count >= 1),
    CHECK (entry_witness_count >= 0),
    CHECK (return_witness_count >= 0)
) STRICT;

CREATE TABLE focused_execution_witness (
    session_id TEXT NOT NULL,
    bridge_sequence INTEGER NOT NULL,
    frame INTEGER,
    profile_id TEXT NOT NULL,
    profile_version INTEGER NOT NULL,
    target_id TEXT NOT NULL,
    trigger_role TEXT NOT NULL CHECK (trigger_role IN ('entry', 'return')),
    invocation_id TEXT NOT NULL,
    function_id INTEGER NOT NULL REFERENCES static_function(function_id),
    z64_start INTEGER NOT NULL,
    live_pc INTEGER NOT NULL,
    physical_pc INTEGER NOT NULL,
    opcode_u32 INTEGER NOT NULL,
    target_live_start INTEGER NOT NULL,
    target_live_end_exclusive INTEGER NOT NULL,
    sample_mode TEXT NOT NULL CHECK (sample_mode IN ('all', 'first-per-frame')),
    entry_return_address INTEGER NOT NULL,
    target_signature_bytes BLOB NOT NULL,
    register_json TEXT NOT NULL,
    stack_json TEXT NOT NULL,
    pointer_issue_json TEXT NOT NULL,
    capture_phase TEXT NOT NULL,
    review_state TEXT NOT NULL CHECK (review_state = 'live-unreviewed'),
    PRIMARY KEY (session_id, bridge_sequence),
    CHECK (bridge_sequence >= 1),
    CHECK (frame IS NULL OR frame >= 0),
    CHECK (physical_pc BETWEEN 0 AND 4194300),
    CHECK ((physical_pc & 3) = 0),
    CHECK (opcode_u32 BETWEEN 0 AND 4294967295),
    CHECK (target_live_end_exclusive > target_live_start),
    CHECK (length(target_signature_bytes) BETWEEN 4 AND 64),
    CHECK ((length(target_signature_bytes) & 3) = 0)
) STRICT, WITHOUT ROWID;

CREATE TABLE focused_pointer_snapshot (
    session_id TEXT NOT NULL,
    bridge_sequence INTEGER NOT NULL,
    register_name TEXT NOT NULL CHECK (register_name IN ('a0', 'a1', 'a2', 'a3')),
    snapshot_phase TEXT NOT NULL CHECK (
        snapshot_phase IN ('entry', 'pre-return-delay-slot')
    ),
    label TEXT NOT NULL,
    pointer_address INTEGER NOT NULL,
    physical_start INTEGER NOT NULL,
    byte_size INTEGER NOT NULL,
    content_id INTEGER NOT NULL REFERENCES exact_content(content_id),
    capture_phase TEXT NOT NULL CHECK (capture_phase = 'synchronous-focused-callback'),
    PRIMARY KEY (session_id, bridge_sequence, register_name),
    FOREIGN KEY (session_id, bridge_sequence)
        REFERENCES focused_execution_witness(session_id, bridge_sequence),
    CHECK (physical_start >= 0),
    CHECK (byte_size BETWEEN 1 AND 4096),
    CHECK (physical_start + byte_size <= 4194304)
) STRICT, WITHOUT ROWID;

CREATE INDEX focused_execution_function_frame_idx
    ON focused_execution_witness(function_id, frame, bridge_sequence);
CREATE INDEX focused_execution_target_idx
    ON focused_execution_witness(profile_id, target_id, session_id, bridge_sequence);
CREATE INDEX focused_execution_invocation_idx
    ON focused_execution_witness(session_id, invocation_id, trigger_role);
CREATE INDEX focused_execution_session_frame_idx
    ON focused_execution_witness(session_id, frame, bridge_sequence);
CREATE INDEX focused_execution_opcode_idx
    ON focused_execution_witness(opcode_u32, bridge_sequence);
CREATE INDEX focused_pointer_content_idx
    ON focused_pointer_snapshot(content_id, session_id, bridge_sequence);
