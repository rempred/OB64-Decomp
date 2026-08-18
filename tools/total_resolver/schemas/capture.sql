PRAGMA foreign_keys = ON;
PRAGMA user_version = 2;

CREATE TABLE schema_info (
    schema_name TEXT PRIMARY KEY CHECK (schema_name = 'ob64-total-resolver-capture'),
    schema_version INTEGER NOT NULL CHECK (schema_version = 2),
    created_utc TEXT NOT NULL
) STRICT;

CREATE TABLE session (
    session_id TEXT PRIMARY KEY,
    started_utc TEXT NOT NULL,
    ended_utc TEXT,
    tool_version TEXT NOT NULL,
    tool_git_commit TEXT,
    decomp_git_commit TEXT NOT NULL,
    decomp_dirty INTEGER NOT NULL CHECK (decomp_dirty IN (0, 1)),
    project64_branch TEXT,
    project64_git_commit TEXT,
    bridge_version TEXT NOT NULL,
    bridge_port INTEGER NOT NULL CHECK (bridge_port BETWEEN 1 AND 65535),
    bridge_epoch TEXT NOT NULL,
    bridge_next_sequence_start INTEGER NOT NULL CHECK (bridge_next_sequence_start >= 1),
    bridge_next_sequence_end INTEGER CHECK (
        bridge_next_sequence_end IS NULL OR
        bridge_next_sequence_end >= bridge_next_sequence_start
    ),
    cpu_core TEXT NOT NULL,
    rom_crc1 TEXT,
    rom_crc2 TEXT,
    rom_country TEXT,
    rom_version INTEGER,
    rom_normalized_sha256 TEXT,
    static_sources_json TEXT NOT NULL,
    accepted_resolver_identity TEXT,
    capture_mode TEXT NOT NULL CHECK (capture_mode IN (
        'manual-play',
        'focused-research',
        'retrospective-audit',
        'automated-exploration'
    )),
    intervention_policy TEXT NOT NULL CHECK (intervention_policy IN (
        'observation-only',
        'explicit-control'
    )),
    closure_status TEXT NOT NULL CHECK (closure_status IN (
        'open',
        'closed',
        'aborted',
        'interrupted'
    )),
    continuity_status TEXT NOT NULL CHECK (continuity_status IN (
        'continuous',
        'broken',
        'unknown'
    )),
    manifest_sha256 TEXT,
    notes TEXT
) STRICT;

CREATE TABLE event_sequence (
    sequence_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    frame_number INTEGER,
    host_monotonic_ns INTEGER NOT NULL CHECK (host_monotonic_ns >= 0),
    observed_utc TEXT NOT NULL,
    bridge_stream TEXT NOT NULL CHECK (bridge_stream IN ('watch', 'dma', 'recorder')),
    bridge_epoch TEXT NOT NULL,
    bridge_event_sequence INTEGER CHECK (bridge_event_sequence >= 1),
    recorder_batch_id INTEGER NOT NULL CHECK (recorder_batch_id >= 1),
    recorder_batch_index INTEGER NOT NULL CHECK (recorder_batch_index >= 0),
    bridge_event_type TEXT NOT NULL,
    raw_payload_sha256 TEXT NOT NULL,
    raw_payload_json TEXT NOT NULL,
    ingestion_status TEXT NOT NULL CHECK (ingestion_status IN (
        'accepted',
        'duplicate',
        'malformed',
        'unresolved',
        'loss-marker'
    )),
    bridge_queue_remaining INTEGER CHECK (bridge_queue_remaining >= 0),
    bridge_dropped_total INTEGER CHECK (bridge_dropped_total >= 0),
    event_time_content_sha256 TEXT,
    event_time_content_size INTEGER CHECK (
        event_time_content_size IS NULL OR event_time_content_size >= 0
    ),
    event_time_content_encoding TEXT CHECK (
        event_time_content_encoding IS NULL OR
        event_time_content_encoding = 'hex-uppercase'
    ),
    event_time_content_phase TEXT CHECK (
        event_time_content_phase IS NULL OR
        event_time_content_phase = 'post-transfer-callback'
    ),
    CHECK (
        (bridge_stream = 'recorder' AND bridge_event_sequence IS NULL) OR
        (bridge_stream IN ('watch', 'dma') AND bridge_event_sequence IS NOT NULL)
    )
) STRICT;

CREATE TABLE bridge_loss_range (
    bridge_loss_range_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    bridge_epoch TEXT NOT NULL,
    first_bridge_sequence INTEGER NOT NULL CHECK (first_bridge_sequence >= 1),
    last_bridge_sequence INTEGER NOT NULL CHECK (
        last_bridge_sequence >= first_bridge_sequence
    ),
    dropped_count INTEGER NOT NULL CHECK (
        dropped_count = last_bridge_sequence - first_bridge_sequence + 1
    ),
    first_observed_after_sequence INTEGER REFERENCES event_sequence(sequence_id),
    reported_utc TEXT NOT NULL,
    source TEXT NOT NULL CHECK (source IN (
        'unified-drain-envelope',
        'recorder-recovery-gap'
    )),
    UNIQUE(session_id, bridge_epoch, first_bridge_sequence, last_bridge_sequence)
) STRICT;

CREATE TABLE frame_sample (
    frame_sample_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    observed_after_sequence INTEGER REFERENCES event_sequence(sequence_id),
    frame_number INTEGER NOT NULL CHECK (frame_number >= 0),
    host_monotonic_ns INTEGER NOT NULL CHECK (host_monotonic_ns >= 0),
    observed_utc TEXT NOT NULL,
    execution_state TEXT,
    system_paused INTEGER CHECK (system_paused IN (0, 1)),
    debug_paused INTEGER CHECK (debug_paused IN (0, 1)),
    frame_hash TEXT,
    active_marker_id INTEGER,
    configuration_sha256 TEXT,
    queue_depth INTEGER CHECK (queue_depth >= 0),
    dropped_total INTEGER CHECK (dropped_total >= 0)
) STRICT;

CREATE TABLE watch_definition (
    watch_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    bridge_watch_id INTEGER,
    watch_kind TEXT NOT NULL CHECK (watch_kind IN ('exec', 'read', 'write', 'dma')),
    address_space TEXT NOT NULL CHECK (address_space IN (
        'z64-rom',
        'raw-v64',
        'nominal-vram',
        'physical-rdram',
        'live-kseg'
    )),
    address_start INTEGER NOT NULL CHECK (address_start >= 0),
    address_end_exclusive INTEGER NOT NULL CHECK (address_end_exclusive > address_start),
    label TEXT,
    reason TEXT NOT NULL,
    definition_source TEXT NOT NULL,
    installed_sequence INTEGER REFERENCES event_sequence(sequence_id),
    removed_sequence INTEGER REFERENCES event_sequence(sequence_id),
    expected_event_rate TEXT,
    interpreter_required INTEGER NOT NULL CHECK (interpreter_required IN (0, 1)),
    interpreter_verified INTEGER NOT NULL CHECK (interpreter_verified IN (0, 1)),
    ownership_scope TEXT NOT NULL CHECK (ownership_scope IN (
        'recorder-owned',
        'bridge-global',
        'external-observed'
    )),
    CHECK (removed_sequence IS NULL OR installed_sequence IS NULL OR removed_sequence >= installed_sequence)
) STRICT;

CREATE TABLE loader_event (
    loader_event_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    entry_sequence INTEGER NOT NULL REFERENCES event_sequence(sequence_id),
    completion_sequence INTEGER REFERENCES event_sequence(sequence_id),
    entry_frame INTEGER,
    completion_frame INTEGER,
    loader_live_pc INTEGER,
    resolved_loader_function TEXT,
    source_kind TEXT CHECK (source_kind IN ('z64-rom', 'resource', 'ram', 'unknown')),
    source_start INTEGER,
    source_end_exclusive INTEGER,
    source_resource_id TEXT,
    compressed_length INTEGER CHECK (compressed_length IS NULL OR compressed_length >= 0),
    decoded_length INTEGER CHECK (decoded_length IS NULL OR decoded_length >= 0),
    destination_physical_start INTEGER,
    destination_physical_end_exclusive INTEGER,
    destination_live_start INTEGER,
    destination_live_end_exclusive INTEGER,
    codec TEXT,
    register_snapshot_json TEXT,
    completion_method TEXT CHECK (completion_method IN (
        'loader-return',
        'dma-completion',
        'decompressor-return',
        'cache-ready',
        'destination-stability',
        'resource-chain',
        'unknown'
    )),
    evidence_grade TEXT NOT NULL CHECK (evidence_grade IN (
        'verified',
        'supported',
        'candidate',
        'unresolved'
    )),
    review_state TEXT NOT NULL CHECK (review_state IN (
        'live-unreviewed',
        'generated-unreviewed',
        'review-pending',
        'accepted-source',
        'historical',
        'rejected'
    )),
    unresolved_reason TEXT,
    CHECK (completion_sequence IS NULL OR completion_sequence >= entry_sequence),
    CHECK (
        destination_physical_start IS NULL OR
        destination_physical_end_exclusive > destination_physical_start
    )
) STRICT;

CREATE TABLE artifact (
    artifact_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    artifact_kind TEXT NOT NULL CHECK (artifact_kind IN (
        'region-bytes',
        'framebuffer',
        'rdram-dump',
        'event-mirror',
        'diagnostic',
        'other'
    )),
    relative_path TEXT NOT NULL,
    byte_size INTEGER NOT NULL CHECK (byte_size >= 0),
    sha256 TEXT NOT NULL,
    created_sequence INTEGER REFERENCES event_sequence(sequence_id)
) STRICT;

CREATE TABLE region_instance (
    region_instance_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    destination_physical_start INTEGER NOT NULL CHECK (
        destination_physical_start BETWEEN 0 AND 8388607
    ),
    destination_physical_end_exclusive INTEGER NOT NULL CHECK (
        destination_physical_end_exclusive BETWEEN 1 AND 8388608 AND
        destination_physical_end_exclusive > destination_physical_start
    ),
    destination_live_start INTEGER,
    destination_live_end_exclusive INTEGER,
    byte_size INTEGER NOT NULL CHECK (
        byte_size = destination_physical_end_exclusive - destination_physical_start
    ),
    content_sha256 TEXT NOT NULL,
    first_sequence INTEGER NOT NULL REFERENCES event_sequence(sequence_id),
    first_frame INTEGER,
    last_observed_sequence INTEGER REFERENCES event_sequence(sequence_id),
    last_observed_frame INTEGER,
    end_sequence_exclusive INTEGER REFERENCES event_sequence(sequence_id),
    closure_reason TEXT CHECK (closure_reason IN (
        'replaced',
        'partial-overlap-split',
        'explicit-unload',
        'session-end',
        'continuity-break',
        'unknown'
    )),
    source_loader_event_id TEXT REFERENCES loader_event(loader_event_id),
    source_kind TEXT CHECK (source_kind IN ('z64-rom', 'resource', 'ram', 'unknown')),
    source_start INTEGER,
    source_end_exclusive INTEGER,
    source_resource_id TEXT,
    region_class TEXT NOT NULL CHECK (region_class IN (
        'executable',
        'data',
        'mixed',
        'unknown'
    )),
    evidence_grade TEXT NOT NULL CHECK (evidence_grade IN (
        'verified',
        'supported',
        'candidate',
        'unresolved'
    )),
    exact_byte_match TEXT NOT NULL CHECK (exact_byte_match IN (
        'exact',
        'different',
        'not-compared',
        'unknown'
    )),
    artifact_id TEXT REFERENCES artifact(artifact_id),
    parent_region_instance_id TEXT REFERENCES region_instance(region_instance_id),
    CHECK (last_observed_sequence IS NULL OR last_observed_sequence >= first_sequence),
    CHECK (end_sequence_exclusive IS NULL OR end_sequence_exclusive >= first_sequence),
    CHECK (
        destination_live_start IS NULL OR
        destination_live_end_exclusive > destination_live_start
    )
) STRICT;

CREATE TABLE placement_observation (
    placement_observation_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    region_instance_id TEXT NOT NULL REFERENCES region_instance(region_instance_id),
    static_identity TEXT,
    z64_start INTEGER,
    z64_end_exclusive INTEGER,
    mapping_method TEXT NOT NULL CHECK (mapping_method IN (
        'direct-loader-provenance',
        'exact-byte-equality',
        'validated-slab-delta',
        'static-descriptor',
        'candidate-heuristic',
        'unresolved'
    )),
    evidence_grade TEXT NOT NULL CHECK (evidence_grade IN (
        'verified',
        'supported',
        'candidate',
        'unresolved'
    )),
    review_state TEXT NOT NULL CHECK (review_state IN (
        'live-unreviewed',
        'generated-unreviewed',
        'review-pending',
        'accepted-source',
        'historical',
        'rejected'
    )),
    disposition TEXT NOT NULL CHECK (disposition IN (
        'compatible',
        'conflicting',
        'unresolved',
        'unsupported'
    )),
    observed_sequence INTEGER NOT NULL REFERENCES event_sequence(sequence_id),
    caveat TEXT
) STRICT;

CREATE TABLE execution_observation (
    execution_observation_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    sequence_id INTEGER NOT NULL REFERENCES event_sequence(sequence_id),
    frame_number INTEGER,
    live_pc INTEGER NOT NULL,
    physical_pc INTEGER,
    region_instance_id TEXT REFERENCES region_instance(region_instance_id),
    z64_instruction INTEGER,
    static_function TEXT,
    observation_source TEXT NOT NULL CHECK (observation_source IN (
        'exec-watch',
        'loader-entry',
        'call-trace',
        'bounded-trace',
        'current-pc',
        'other'
    )),
    register_snapshot_json TEXT,
    evidence_grade TEXT NOT NULL CHECK (evidence_grade IN (
        'verified',
        'supported',
        'candidate',
        'unresolved'
    )),
    mapping_confidence TEXT NOT NULL CHECK (mapping_confidence IN (
        'exact',
        'supported',
        'ambiguous',
        'unresolved'
    )),
    review_state TEXT NOT NULL CHECK (review_state IN (
        'live-unreviewed',
        'generated-unreviewed',
        'review-pending',
        'accepted-source',
        'historical',
        'rejected'
    ))
) STRICT;

CREATE TABLE memory_access (
    memory_access_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    sequence_id INTEGER NOT NULL REFERENCES event_sequence(sequence_id),
    frame_number INTEGER,
    access_kind TEXT NOT NULL CHECK (access_kind IN ('read', 'write')),
    width_bits INTEGER NOT NULL CHECK (width_bits IN (8, 16, 32, 64, 128)),
    effective_address INTEGER NOT NULL,
    value_before TEXT,
    value_after TEXT,
    accessor_live_pc INTEGER,
    code_region_instance_id TEXT REFERENCES region_instance(region_instance_id),
    static_function TEXT,
    z64_instruction INTEGER,
    field_identity TEXT,
    resource_identity TEXT,
    review_state TEXT NOT NULL CHECK (review_state IN (
        'live-unreviewed',
        'generated-unreviewed',
        'review-pending',
        'accepted-source',
        'historical',
        'rejected'
    ))
) STRICT;

CREATE TABLE semantic_marker (
    marker_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    start_sequence INTEGER REFERENCES event_sequence(sequence_id),
    end_sequence INTEGER REFERENCES event_sequence(sequence_id),
    start_frame INTEGER,
    end_frame INTEGER,
    label TEXT NOT NULL,
    marker_type TEXT NOT NULL CHECK (marker_type IN (
        'stable-state',
        'transition-start',
        'transition-end',
        'note',
        'visible-action'
    )),
    marker_source TEXT NOT NULL CHECK (marker_source IN (
        'human',
        'inferred',
        'imported-candidate'
    )),
    confidence TEXT NOT NULL CHECK (confidence IN (
        'certain',
        'supported',
        'candidate',
        'unknown'
    )),
    supersedes_marker_id INTEGER REFERENCES semantic_marker(marker_id),
    note TEXT,
    created_utc TEXT NOT NULL,
    CHECK (end_sequence IS NULL OR start_sequence IS NULL OR end_sequence >= start_sequence)
) STRICT;

CREATE TABLE transition (
    transition_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    from_marker_id INTEGER REFERENCES semantic_marker(marker_id),
    to_marker_id INTEGER REFERENCES semantic_marker(marker_id),
    start_sequence INTEGER NOT NULL REFERENCES event_sequence(sequence_id),
    end_sequence INTEGER REFERENCES event_sequence(sequence_id),
    start_frame INTEGER,
    end_frame INTEGER,
    note TEXT,
    CHECK (end_sequence IS NULL OR end_sequence >= start_sequence)
) STRICT;

CREATE TABLE transition_loader_event (
    transition_id TEXT NOT NULL REFERENCES transition(transition_id),
    loader_event_id TEXT NOT NULL REFERENCES loader_event(loader_event_id),
    PRIMARY KEY (transition_id, loader_event_id)
) STRICT, WITHOUT ROWID;

CREATE TABLE transition_region_instance (
    transition_id TEXT NOT NULL REFERENCES transition(transition_id),
    region_instance_id TEXT NOT NULL REFERENCES region_instance(region_instance_id),
    lifecycle_role TEXT NOT NULL CHECK (lifecycle_role IN ('born', 'destroyed', 'resident')),
    PRIMARY KEY (transition_id, region_instance_id, lifecycle_role)
) STRICT, WITHOUT ROWID;

CREATE TABLE machine_configuration (
    configuration_sha256 TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    first_sequence INTEGER NOT NULL REFERENCES event_sequence(sequence_id),
    last_sequence INTEGER REFERENCES event_sequence(sequence_id),
    configuration_kind TEXT NOT NULL CHECK (configuration_kind IN (
        'code',
        'resource',
        'combined'
    )),
    canonical_json TEXT NOT NULL,
    CHECK (last_sequence IS NULL OR last_sequence >= first_sequence)
) STRICT;

CREATE TABLE configuration_region (
    configuration_sha256 TEXT NOT NULL REFERENCES machine_configuration(configuration_sha256),
    region_instance_id TEXT NOT NULL REFERENCES region_instance(region_instance_id),
    PRIMARY KEY (configuration_sha256, region_instance_id)
) STRICT, WITHOUT ROWID;

CREATE TABLE unresolved_observation (
    unresolved_observation_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    sequence_id INTEGER REFERENCES event_sequence(sequence_id),
    frame_number INTEGER,
    unresolved_kind TEXT NOT NULL CHECK (unresolved_kind IN (
        'unknown-executable-change',
        'loader-destination-unknown',
        'completion-not-captured',
        'reused-live-address',
        'event-context-missing',
        'source-resource-unknown',
        'execution-region-unknown',
        'event-loss',
        'continuity-break',
        'other'
    )),
    description TEXT NOT NULL,
    raw_reference TEXT,
    smallest_next_evidence TEXT NOT NULL,
    review_state TEXT NOT NULL CHECK (review_state IN (
        'live-unreviewed',
        'generated-unreviewed',
        'review-pending',
        'accepted-source',
        'historical',
        'rejected'
    )),
    disposition TEXT NOT NULL CHECK (disposition IN (
        'compatible',
        'conflicting',
        'unresolved',
        'unsupported'
    ))
) STRICT;

CREATE TABLE recorder_health (
    health_sample_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    observed_after_sequence INTEGER REFERENCES event_sequence(sequence_id),
    frame_number INTEGER,
    observed_utc TEXT NOT NULL,
    host_monotonic_ns INTEGER NOT NULL CHECK (host_monotonic_ns >= 0),
    queue_depth INTEGER NOT NULL CHECK (queue_depth >= 0),
    queue_high_water INTEGER NOT NULL CHECK (queue_high_water >= queue_depth),
    dropped_total INTEGER NOT NULL CHECK (dropped_total >= 0),
    drain_interval_ms REAL CHECK (drain_interval_ms IS NULL OR drain_interval_ms >= 0),
    longest_drain_stall_ms REAL NOT NULL CHECK (longest_drain_stall_ms >= 0),
    frame_poll_latency_ms REAL CHECK (frame_poll_latency_ms IS NULL OR frame_poll_latency_ms >= 0),
    cpu_core TEXT NOT NULL,
    bridge_reconnects INTEGER NOT NULL CHECK (bridge_reconnects >= 0),
    watch_failures INTEGER NOT NULL CHECK (watch_failures >= 0),
    recorder_exceptions INTEGER NOT NULL CHECK (recorder_exceptions >= 0),
    continuity_status TEXT NOT NULL CHECK (continuity_status IN (
        'continuous',
        'broken',
        'unknown'
    )),
    note TEXT
) STRICT;

CREATE TABLE recorder_control (
    singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
    requested_action TEXT NOT NULL CHECK (requested_action IN ('none', 'stop')),
    updated_utc TEXT NOT NULL
) STRICT;

CREATE INDEX event_sequence_frame_idx ON event_sequence(session_id, frame_number, sequence_id);
CREATE UNIQUE INDEX event_bridge_sequence_idx ON event_sequence(
    session_id,
    bridge_epoch,
    bridge_event_sequence
) WHERE bridge_event_sequence IS NOT NULL;
CREATE INDEX bridge_loss_sequence_idx ON bridge_loss_range(
    session_id, bridge_epoch, first_bridge_sequence, last_bridge_sequence
);
CREATE INDEX loader_event_sequence_idx ON loader_event(session_id, entry_sequence, completion_sequence);
CREATE INDEX region_instance_lifetime_idx ON region_instance(
    session_id,
    destination_physical_start,
    destination_physical_end_exclusive,
    first_sequence,
    end_sequence_exclusive
);
CREATE INDEX execution_sequence_idx ON execution_observation(session_id, sequence_id, live_pc);
CREATE INDEX memory_access_sequence_idx ON memory_access(session_id, sequence_id, effective_address);
CREATE INDEX marker_sequence_idx ON semantic_marker(session_id, start_sequence, marker_id);
CREATE INDEX unresolved_sequence_idx ON unresolved_observation(session_id, sequence_id);
