-- Additive call-aware frontier and human session-context layer for schema 3.
-- Exact calls are observed triples: callsite, architectural delay slot, target.
-- Function ownership remains a materialized interpretation of those instructions.
CREATE TABLE IF NOT EXISTS call_relationship_fact (
    call_relationship_id INTEGER PRIMARY KEY AUTOINCREMENT,
    callsite_instruction_id INTEGER NOT NULL REFERENCES instruction_fact(instruction_id),
    delay_instruction_id INTEGER NOT NULL REFERENCES instruction_fact(instruction_id),
    target_instruction_id INTEGER NOT NULL REFERENCES instruction_fact(instruction_id),
    call_kind TEXT NOT NULL CHECK (call_kind IN (
        'jal-direct', 'jalr-register', 'branch-and-link'
    )),
    first_session_id TEXT NOT NULL,
    observation_count INTEGER NOT NULL CHECK (observation_count >= 1),
    discovery_session_count INTEGER NOT NULL CHECK (discovery_session_count >= 1),
    UNIQUE (
        callsite_instruction_id, delay_instruction_id,
        target_instruction_id, call_kind
    )
) STRICT;

CREATE TABLE IF NOT EXISTS call_relationship_session (
    call_relationship_id INTEGER NOT NULL
        REFERENCES call_relationship_fact(call_relationship_id),
    session_id TEXT NOT NULL,
    first_bridge_sequence INTEGER NOT NULL CHECK (first_bridge_sequence >= 1),
    last_bridge_sequence INTEGER NOT NULL CHECK (
        last_bridge_sequence >= first_bridge_sequence
    ),
    observation_count INTEGER NOT NULL CHECK (observation_count >= 1),
    PRIMARY KEY (call_relationship_id, session_id)
) STRICT, WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS call_relationship_context_witness (
    call_relationship_id INTEGER NOT NULL
        REFERENCES call_relationship_fact(call_relationship_id),
    session_id TEXT NOT NULL,
    bridge_sequence INTEGER NOT NULL CHECK (bridge_sequence >= 1),
    frame INTEGER,
    callsite_generation INTEGER,
    delay_generation INTEGER,
    target_generation INTEGER,
    observation_kind TEXT NOT NULL,
    PRIMARY KEY (call_relationship_id, session_id, bridge_sequence),
    CHECK (frame IS NULL OR frame >= 0),
    CHECK (callsite_generation IS NULL OR callsite_generation >= 0),
    CHECK (delay_generation IS NULL OR delay_generation >= 0),
    CHECK (target_generation IS NULL OR target_generation >= 0)
) STRICT, WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS call_relationship_callsite_idx
    ON call_relationship_fact(callsite_instruction_id, call_relationship_id);
CREATE INDEX IF NOT EXISTS call_relationship_target_idx
    ON call_relationship_fact(target_instruction_id, call_relationship_id);
CREATE INDEX IF NOT EXISTS call_relationship_session_idx
    ON call_relationship_session(session_id, call_relationship_id);
CREATE INDEX IF NOT EXISTS call_relationship_context_sequence_idx
    ON call_relationship_context_witness(session_id, bridge_sequence, call_relationship_id);

-- Human names are contextual navigation aids. They are deliberately excluded
-- from the capture identity and every machine-fact uniqueness decision.
CREATE TABLE IF NOT EXISTS session_semantic_context (
    session_id TEXT PRIMARY KEY,
    semantic_name TEXT NOT NULL CHECK (
        length(trim(semantic_name)) BETWEEN 1 AND 160
    ),
    notes TEXT,
    created_utc TEXT NOT NULL,
    context_source TEXT NOT NULL CHECK (context_source = 'human-post-capture')
) STRICT;

CREATE INDEX IF NOT EXISTS session_semantic_name_idx
    ON session_semantic_context(semantic_name, session_id);
