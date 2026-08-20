PRAGMA foreign_keys = ON;
PRAGMA user_version = 1;

CREATE TABLE meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
) STRICT;

CREATE TABLE source_registry (
    source_id TEXT PRIMARY KEY,
    adapter_id TEXT NOT NULL,
    adapter_version TEXT NOT NULL,
    snapshot_id TEXT NOT NULL,
    evidence_lanes_json TEXT NOT NULL,
    identity_kind TEXT NOT NULL,
    identity_sha256 TEXT NOT NULL,
    review_state TEXT NOT NULL,
    evidence_boundary TEXT NOT NULL
) STRICT;

CREATE TABLE session (
    session_id TEXT PRIMARY KEY,
    summary_sha256 TEXT NOT NULL,
    raw_manifest_sha256 TEXT,
    bridge_version TEXT NOT NULL,
    closure_status TEXT NOT NULL,
    continuity_status TEXT NOT NULL,
    working_evidence_quality TEXT NOT NULL,
    review_state TEXT NOT NULL
) STRICT;

CREATE TABLE static_function (
    function_id INTEGER PRIMARY KEY,
    structural_name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    z64_start INTEGER NOT NULL UNIQUE,
    z64_end_exclusive INTEGER NOT NULL,
    nominal_live_start INTEGER,
    nominal_live_end_exclusive INTEGER,
    derivation_method TEXT NOT NULL,
    confidence TEXT NOT NULL,
    note TEXT,
    CHECK (z64_start >= 0 AND z64_end_exclusive > z64_start),
    CHECK (nominal_live_start IS NULL OR nominal_live_end_exclusive > nominal_live_start)
) STRICT;

CREATE TABLE static_call (
    call_id INTEGER PRIMARY KEY,
    instruction_z64 INTEGER NOT NULL UNIQUE,
    caller_function_id INTEGER REFERENCES static_function(function_id),
    encoded_low28 INTEGER NOT NULL,
    nominal_live_kseg INTEGER NOT NULL,
    target_z64_boot_linear INTEGER,
    resolution_method TEXT NOT NULL,
    confidence TEXT NOT NULL
) STRICT;

CREATE TABLE static_call_candidate (
    candidate_id INTEGER PRIMARY KEY,
    call_id INTEGER NOT NULL REFERENCES static_call(call_id),
    callee_function_id INTEGER REFERENCES static_function(function_id),
    candidate_z64 INTEGER,
    method TEXT NOT NULL,
    confidence TEXT NOT NULL,
    note TEXT
) STRICT;

CREATE TABLE static_indirect_call (
    indirect_call_id INTEGER PRIMARY KEY,
    instruction_z64 INTEGER NOT NULL UNIQUE,
    caller_function_id INTEGER REFERENCES static_function(function_id),
    target_register INTEGER NOT NULL,
    resolution_method TEXT NOT NULL,
    confidence TEXT NOT NULL
) STRICT;

CREATE TABLE static_unresolved (
    unresolved_id INTEGER PRIMARY KEY,
    instruction_z64 INTEGER NOT NULL,
    function_id INTEGER REFERENCES static_function(function_id),
    target_kind TEXT NOT NULL,
    detail TEXT NOT NULL,
    method TEXT NOT NULL,
    confidence TEXT NOT NULL
) STRICT;

CREATE TABLE resource_family (
    family_id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    scope TEXT NOT NULL,
    disposition TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    note TEXT NOT NULL
) STRICT;

CREATE TABLE resource (
    resource_id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL REFERENCES resource_family(family_id),
    logical_key TEXT NOT NULL,
    key_kind TEXT NOT NULL,
    lookup_table TEXT,
    table_index INTEGER,
    label TEXT,
    disposition TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    review_status TEXT NOT NULL,
    scope TEXT NOT NULL,
    note TEXT NOT NULL
) STRICT;

CREATE TABLE resource_alias (
    alias_id TEXT PRIMARY KEY,
    resource_id TEXT NOT NULL REFERENCES resource(resource_id),
    alias_kind TEXT NOT NULL,
    alias_value TEXT NOT NULL,
    note TEXT NOT NULL
) STRICT;

CREATE TABLE resource_loader (
    loader_id TEXT PRIMARY KEY,
    z64_start INTEGER,
    z64_end_exclusive INTEGER,
    structural_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL,
    boundary_kind TEXT NOT NULL,
    nominal_live_start INTEGER,
    nominal_live_end_exclusive INTEGER,
    disposition TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    static_callsite_count INTEGER NOT NULL,
    indirect_call_count INTEGER NOT NULL,
    note TEXT NOT NULL,
    CHECK (z64_start IS NULL OR z64_end_exclusive > z64_start),
    CHECK (nominal_live_start IS NULL OR nominal_live_end_exclusive > nominal_live_start)
) STRICT;

CREATE TABLE resource_chain (
    chain_id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL REFERENCES resource_family(family_id),
    resource_id TEXT NOT NULL REFERENCES resource(resource_id),
    container_id TEXT,
    loader_id TEXT REFERENCES resource_loader(loader_id),
    codec_id TEXT,
    primary_consumer_id TEXT,
    disposition TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    review_status TEXT NOT NULL,
    scope TEXT NOT NULL,
    note TEXT NOT NULL
) STRICT;

CREATE TABLE resource_stage (
    stage_id TEXT PRIMARY KEY,
    chain_id TEXT NOT NULL REFERENCES resource_chain(chain_id),
    ordinal INTEGER NOT NULL,
    stage_kind TEXT NOT NULL,
    entity_kind TEXT NOT NULL,
    entity_id TEXT,
    z64_start INTEGER,
    z64_end_exclusive INTEGER,
    live_start INTEGER,
    live_end_exclusive INTEGER,
    address_space TEXT NOT NULL,
    descriptor TEXT NOT NULL,
    disposition TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    note TEXT NOT NULL,
    UNIQUE (chain_id, ordinal),
    CHECK (z64_start IS NULL OR z64_end_exclusive > z64_start),
    CHECK (live_start IS NULL OR live_end_exclusive > live_start)
) STRICT;

CREATE TABLE resource_edge (
    edge_id TEXT PRIMARY KEY,
    chain_id TEXT NOT NULL REFERENCES resource_chain(chain_id),
    from_stage_id TEXT NOT NULL REFERENCES resource_stage(stage_id),
    to_stage_id TEXT NOT NULL REFERENCES resource_stage(stage_id),
    edge_kind TEXT NOT NULL,
    status TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    scope TEXT NOT NULL,
    note TEXT NOT NULL
) STRICT;

CREATE TABLE resource_range (
    range_id TEXT PRIMARY KEY,
    resource_id TEXT REFERENCES resource(resource_id),
    entity_kind TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    role TEXT NOT NULL,
    z64_start INTEGER,
    z64_end_exclusive INTEGER,
    live_start INTEGER,
    live_end_exclusive INTEGER,
    disposition TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    CHECK (z64_start IS NULL OR z64_end_exclusive > z64_start),
    CHECK (live_start IS NULL OR live_end_exclusive > live_start)
) STRICT;

CREATE TABLE resource_callsite (
    callsite_id TEXT PRIMARY KEY,
    loader_id TEXT NOT NULL REFERENCES resource_loader(loader_id),
    static_call_id INTEGER,
    instruction_z64 INTEGER NOT NULL,
    caller_z64 INTEGER,
    caller_name TEXT,
    target_z64 INTEGER,
    resolution_method TEXT NOT NULL,
    resolution_grade TEXT NOT NULL,
    scope TEXT NOT NULL,
    note TEXT NOT NULL
) STRICT;

CREATE TABLE resource_unresolved (
    unresolved_id TEXT PRIMARY KEY,
    chain_id TEXT REFERENCES resource_chain(chain_id),
    loader_id TEXT REFERENCES resource_loader(loader_id),
    link_kind TEXT NOT NULL,
    description TEXT NOT NULL,
    smallest_next_evidence TEXT NOT NULL,
    status TEXT NOT NULL,
    note TEXT NOT NULL
) STRICT;

CREATE TABLE resource_conflict (
    conflict_id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    values_json TEXT NOT NULL,
    scope TEXT NOT NULL,
    disposition TEXT NOT NULL,
    note TEXT NOT NULL
) STRICT;

CREATE TABLE field_family (
    family_id INTEGER PRIMARY KEY,
    family_key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    family_kind TEXT NOT NULL,
    lineage_basis TEXT NOT NULL,
    acceptance_basis TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    review_status TEXT NOT NULL,
    scope TEXT NOT NULL,
    citation TEXT,
    falsifier TEXT NOT NULL,
    access_count INTEGER NOT NULL,
    field_count INTEGER NOT NULL
) STRICT;

CREATE TABLE field_candidate (
    field_id INTEGER PRIMARY KEY,
    family_id INTEGER NOT NULL REFERENCES field_family(family_id),
    displacement_signed INTEGER NOT NULL,
    field_key TEXT NOT NULL UNIQUE,
    field_label TEXT NOT NULL,
    semantic_label TEXT,
    observed_shapes_json TEXT NOT NULL,
    observed_signedness_json TEXT NOT NULL,
    effect_role TEXT NOT NULL,
    initialization_shape TEXT NOT NULL,
    copy_relationship_count INTEGER NOT NULL,
    evidence_grade TEXT NOT NULL,
    review_status TEXT NOT NULL,
    grouping_rule TEXT NOT NULL,
    falsifier TEXT NOT NULL,
    accepted_citation TEXT
) STRICT;

CREATE TABLE field_alias (
    alias_id INTEGER PRIMARY KEY,
    field_id INTEGER NOT NULL REFERENCES field_candidate(field_id),
    alias_label TEXT NOT NULL,
    alias_scope TEXT NOT NULL,
    basis TEXT NOT NULL,
    citation TEXT
) STRICT;

CREATE TABLE field_access (
    access_id INTEGER PRIMARY KEY,
    field_id INTEGER REFERENCES field_candidate(field_id),
    family_id INTEGER REFERENCES field_family(family_id),
    instruction_z64 INTEGER NOT NULL UNIQUE,
    function_id INTEGER NOT NULL REFERENCES static_function(function_id),
    structural_name TEXT NOT NULL,
    mnemonic TEXT NOT NULL,
    access_kind TEXT NOT NULL,
    width_bytes INTEGER,
    data_shape TEXT NOT NULL,
    signedness TEXT NOT NULL,
    base_register_name TEXT NOT NULL,
    displacement_signed INTEGER NOT NULL,
    assignment_kind TEXT NOT NULL,
    grouping_reason TEXT NOT NULL,
    falsifier TEXT NOT NULL
) STRICT;

CREATE TABLE field_unresolved (
    unresolved_id INTEGER PRIMARY KEY,
    access_id INTEGER REFERENCES field_access(access_id),
    function_id INTEGER REFERENCES static_function(function_id),
    instruction_z64 INTEGER,
    reason TEXT NOT NULL,
    detail TEXT NOT NULL,
    falsifier TEXT NOT NULL
) STRICT;

CREATE TABLE field_conflict (
    conflict_id INTEGER PRIMARY KEY,
    conflict_kind TEXT NOT NULL,
    severity TEXT NOT NULL,
    displacement_signed INTEGER,
    field_a_id INTEGER REFERENCES field_candidate(field_id),
    field_b_id INTEGER REFERENCES field_candidate(field_id),
    message TEXT NOT NULL,
    evidence_json TEXT NOT NULL,
    resolution TEXT NOT NULL,
    review_status TEXT NOT NULL
) STRICT;

CREATE TABLE placement (
    placement_id TEXT PRIMARY KEY,
    placement_kind TEXT NOT NULL,
    source_z64_start INTEGER NOT NULL,
    source_z64_end_exclusive INTEGER NOT NULL,
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    content_sha256 TEXT NOT NULL,
    byte_size INTEGER NOT NULL,
    mapping_delta INTEGER,
    region_class TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    mapping_method TEXT NOT NULL,
    transient_only INTEGER NOT NULL CHECK (transient_only IN (0, 1)),
    witness_count INTEGER NOT NULL,
    CHECK (source_z64_end_exclusive > source_z64_start),
    CHECK (destination_physical_start >= 0),
    CHECK (destination_physical_end_exclusive > destination_physical_start),
    CHECK (destination_physical_end_exclusive <= 4194304)
) STRICT;

CREATE TABLE placement_witness (
    placement_id TEXT NOT NULL REFERENCES placement(placement_id),
    session_id TEXT NOT NULL REFERENCES session(session_id),
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
    PRIMARY KEY (slab_placement_id, member_placement_id)
) STRICT;

CREATE TABLE function_placement (
    function_placement_id TEXT PRIMARY KEY,
    slab_placement_id TEXT NOT NULL REFERENCES placement(placement_id),
    function_id INTEGER NOT NULL REFERENCES static_function(function_id),
    source_z64_start INTEGER NOT NULL,
    source_z64_end_exclusive INTEGER NOT NULL,
    destination_physical_start INTEGER NOT NULL,
    destination_physical_end_exclusive INTEGER NOT NULL,
    confidence TEXT NOT NULL,
    mapping_method TEXT NOT NULL,
    witness_count INTEGER NOT NULL,
    CHECK (source_z64_end_exclusive > source_z64_start),
    CHECK (destination_physical_end_exclusive > destination_physical_start)
) STRICT;

CREATE TABLE function_placement_witness (
    function_placement_id TEXT NOT NULL REFERENCES function_placement(function_placement_id),
    session_id TEXT NOT NULL REFERENCES session(session_id),
    local_placement_id TEXT NOT NULL,
    first_sequence INTEGER NOT NULL,
    last_sequence INTEGER NOT NULL,
    first_frame INTEGER,
    last_frame INTEGER,
    PRIMARY KEY (function_placement_id, session_id, local_placement_id)
) STRICT;

CREATE TABLE region_instance (
    region_instance_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
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
    UNIQUE (session_id, local_region_instance_id),
    CHECK (destination_physical_end_exclusive > destination_physical_start),
    CHECK (end_sequence_exclusive IS NULL OR end_sequence_exclusive > first_sequence)
) STRICT;

CREATE TABLE placement_unresolved (
    unresolved_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    kind TEXT NOT NULL,
    sequence INTEGER,
    frame INTEGER,
    payload_json TEXT NOT NULL
) STRICT;

CREATE TABLE runtime_execution (
    runtime_execution_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    sequence INTEGER NOT NULL,
    bridge_sequence INTEGER,
    frame INTEGER,
    live_pc INTEGER NOT NULL,
    physical_pc INTEGER NOT NULL,
    observation_kind TEXT NOT NULL,
    execution_claim TEXT NOT NULL,
    region_instance_id TEXT REFERENCES region_instance(region_instance_id),
    z64_offset INTEGER,
    function_id INTEGER REFERENCES static_function(function_id),
    mapping_method TEXT,
    mapping_status TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    return_address INTEGER,
    review_state TEXT NOT NULL
) STRICT;

CREATE TABLE runtime_memory_access (
    runtime_memory_access_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    sequence INTEGER NOT NULL,
    bridge_sequence INTEGER NOT NULL,
    frame INTEGER,
    access_kind TEXT NOT NULL,
    width_bits INTEGER,
    effective_address INTEGER NOT NULL,
    value_text TEXT,
    value_high_text TEXT,
    accessor_live_pc INTEGER NOT NULL,
    accessor_physical_pc INTEGER NOT NULL,
    region_instance_id TEXT REFERENCES region_instance(region_instance_id),
    z64_instruction INTEGER,
    function_id INTEGER REFERENCES static_function(function_id),
    mapping_method TEXT,
    review_state TEXT NOT NULL
) STRICT;

CREATE TABLE runtime_edge (
    observed_edge_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    execution_sequence INTEGER NOT NULL,
    caller_live_pc INTEGER NOT NULL,
    callee_live_pc INTEGER NOT NULL,
    caller_function_id INTEGER REFERENCES static_function(function_id),
    callee_function_id INTEGER REFERENCES static_function(function_id),
    edge_kind TEXT NOT NULL,
    evidence_grade TEXT NOT NULL,
    review_state TEXT NOT NULL
) STRICT;

CREATE TABLE runtime_unresolved (
    unresolved_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES session(session_id),
    kind TEXT NOT NULL,
    sequence INTEGER,
    frame INTEGER,
    payload_json TEXT NOT NULL
) STRICT;

CREATE TABLE runtime_conflict (
    conflict_id TEXT PRIMARY KEY,
    conflict_kind TEXT NOT NULL,
    live_pc INTEGER,
    session_id TEXT REFERENCES session(session_id),
    detail_json TEXT NOT NULL
) STRICT;

CREATE TABLE function_coverage (
    function_id INTEGER PRIMARY KEY REFERENCES static_function(function_id),
    placement_count INTEGER NOT NULL,
    placement_witness_count INTEGER NOT NULL,
    exact_execution_count INTEGER NOT NULL,
    sampled_pc_count INTEGER NOT NULL,
    memory_access_count INTEGER NOT NULL,
    classification TEXT NOT NULL
) STRICT;

CREATE INDEX static_function_range_idx ON static_function(z64_start, z64_end_exclusive);
CREATE INDEX static_function_nominal_idx ON static_function(nominal_live_start, nominal_live_end_exclusive);
CREATE INDEX static_call_caller_idx ON static_call(caller_function_id, instruction_z64);
CREATE INDEX static_candidate_callee_idx ON static_call_candidate(callee_function_id, call_id);
CREATE INDEX resource_key_idx ON resource(logical_key, resource_id);
CREATE INDEX resource_range_z64_idx ON resource_range(z64_start, z64_end_exclusive);
CREATE INDEX resource_stage_z64_idx ON resource_stage(z64_start, z64_end_exclusive);
CREATE INDEX resource_callsite_caller_idx ON resource_callsite(caller_name, caller_z64);
CREATE INDEX field_offset_idx ON field_candidate(displacement_signed, family_id);
CREATE INDEX field_access_function_idx ON field_access(function_id, instruction_z64);
CREATE INDEX field_access_offset_idx ON field_access(displacement_signed, access_kind, width_bytes);
CREATE INDEX placement_source_idx ON placement(source_z64_start, source_z64_end_exclusive);
CREATE INDEX placement_destination_idx ON placement(destination_physical_start, destination_physical_end_exclusive);
CREATE INDEX function_placement_function_idx ON function_placement(function_id);
CREATE INDEX function_placement_destination_idx ON function_placement(destination_physical_start, destination_physical_end_exclusive);
CREATE INDEX region_context_idx ON region_instance(session_id, first_sequence, end_sequence_exclusive);
CREATE INDEX region_destination_idx ON region_instance(destination_physical_start, destination_physical_end_exclusive);
CREATE INDEX runtime_execution_function_idx ON runtime_execution(function_id, execution_claim);
CREATE INDEX runtime_memory_function_idx ON runtime_memory_access(function_id, access_kind);
