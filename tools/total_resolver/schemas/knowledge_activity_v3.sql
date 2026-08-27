-- Compact per-session evidence that facts already present in the native
-- frontier occurred again.  Fact ordinals are the stable primary keys of the
-- canonical schema-2 fact tables.  A bit at ordinal N therefore names exactly
-- instruction_fact.instruction_id=N, edge_fact.edge_id=N, or the canonical
-- DMA representative whose dma_placement_id=N.
CREATE TABLE IF NOT EXISTS known_activity_summary (
    session_id TEXT PRIMARY KEY,
    frontier_identity TEXT NOT NULL,
    frontier_format_version INTEGER NOT NULL CHECK (frontier_format_version IN (4, 5)),
    instruction_max_ordinal INTEGER NOT NULL CHECK (instruction_max_ordinal >= 0),
    instruction_hit_count INTEGER NOT NULL CHECK (instruction_hit_count >= 0),
    instruction_hit_bitmap BLOB NOT NULL,
    edge_max_ordinal INTEGER NOT NULL CHECK (edge_max_ordinal >= 0),
    edge_hit_count INTEGER NOT NULL CHECK (edge_hit_count >= 0),
    edge_hit_bitmap BLOB NOT NULL,
    call_max_ordinal INTEGER NOT NULL CHECK (call_max_ordinal >= 0),
    call_hit_count INTEGER NOT NULL CHECK (call_hit_count >= 0),
    call_hit_bitmap BLOB NOT NULL,
    dma_max_ordinal INTEGER NOT NULL CHECK (dma_max_ordinal >= 0),
    dma_hit_count INTEGER NOT NULL CHECK (dma_hit_count >= 0),
    dma_hit_bitmap BLOB NOT NULL,
    bridge_sequence INTEGER NOT NULL CHECK (bridge_sequence >= 1),
    capture_phase TEXT NOT NULL CHECK (
        capture_phase = 'session-stop-native-hit-bitmap'
    ),
    CHECK (length(instruction_hit_bitmap) = (instruction_max_ordinal + 7) / 8),
    CHECK (length(edge_hit_bitmap) = (edge_max_ordinal + 7) / 8),
    CHECK (length(call_hit_bitmap) = (call_max_ordinal + 7) / 8),
    CHECK (length(dma_hit_bitmap) = (dma_max_ordinal + 7) / 8)
) STRICT;

CREATE INDEX IF NOT EXISTS known_activity_sequence_idx
    ON known_activity_summary(bridge_sequence, session_id);

CREATE TABLE IF NOT EXISTS marker_context_window (
    session_id TEXT NOT NULL,
    marker_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('complete', 'incomplete')),
    completion_bridge_sequence INTEGER NOT NULL CHECK (completion_bridge_sequence >= 1),
    requested_before_count INTEGER NOT NULL CHECK (requested_before_count >= 0),
    requested_after_count INTEGER NOT NULL CHECK (requested_after_count >= 1),
    retained_before_count INTEGER NOT NULL CHECK (retained_before_count >= 0),
    retained_after_count INTEGER NOT NULL CHECK (retained_after_count >= 0),
    limitation_text TEXT NOT NULL,
    PRIMARY KEY (session_id, marker_id)
) STRICT, WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS marker_execution_context_record (
    session_id TEXT NOT NULL,
    marker_id INTEGER NOT NULL,
    local_order INTEGER NOT NULL CHECK (local_order >= 1),
    side TEXT NOT NULL CHECK (side IN ('before', 'after')),
    frame INTEGER,
    live_pc INTEGER NOT NULL CHECK (live_pc BETWEEN 0 AND 4294967295),
    physical_address INTEGER,
    opcode_u32 INTEGER NOT NULL CHECK (opcode_u32 BETWEEN 0 AND 4294967295),
    previous_valid INTEGER NOT NULL CHECK (previous_valid IN (0, 1)),
    previous_live_pc INTEGER NOT NULL CHECK (
        previous_live_pc BETWEEN 0 AND 4294967295
    ),
    previous_physical_address INTEGER,
    previous_opcode_u32 INTEGER NOT NULL CHECK (
        previous_opcode_u32 BETWEEN 0 AND 4294967295
    ),
    PRIMARY KEY (session_id, marker_id, local_order),
    FOREIGN KEY (session_id, marker_id)
        REFERENCES marker_context_window(session_id, marker_id),
    CHECK (frame IS NULL OR frame >= 0),
    CHECK (physical_address IS NULL OR physical_address BETWEEN 0 AND 4194300),
    CHECK (
        previous_physical_address IS NULL OR
        previous_physical_address BETWEEN 0 AND 4194300
    )
) STRICT, WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS marker_context_frame_idx
    ON marker_execution_context_record(session_id, frame, marker_id, local_order);
CREATE INDEX IF NOT EXISTS marker_context_opcode_idx
    ON marker_execution_context_record(opcode_u32, session_id, marker_id, local_order);
