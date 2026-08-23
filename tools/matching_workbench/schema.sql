PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS target_snapshot (
    target_id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL,
    symbol TEXT NOT NULL COLLATE NOCASE,
    metadata_json TEXT NOT NULL,
    expected_bytes BLOB NOT NULL,
    created_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    UNIQUE (model_id, symbol)
);

CREATE INDEX IF NOT EXISTS target_snapshot_model_rom
    ON target_snapshot(model_id, json_extract(metadata_json, '$.romStart'));

CREATE TABLE IF NOT EXISTS candidate (
    candidate_id TEXT PRIMARY KEY,
    target_id TEXT NOT NULL REFERENCES target_snapshot(target_id),
    source_sha256 TEXT NOT NULL,
    source_text TEXT NOT NULL,
    origin TEXT NOT NULL,
    variant TEXT,
    parent_candidate_id TEXT REFERENCES candidate(candidate_id),
    metadata_json TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS candidate_target_created
    ON candidate(target_id, created_at DESC);

CREATE TABLE IF NOT EXISTS candidate_observation (
    observation_id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL REFERENCES candidate(candidate_id),
    origin TEXT NOT NULL,
    variant TEXT,
    parent_candidate_id TEXT REFERENCES candidate(candidate_id),
    metadata_json TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS candidate_observation_candidate_created
    ON candidate_observation(candidate_id, created_at DESC);

CREATE TABLE IF NOT EXISTS compile_run (
    run_id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL REFERENCES candidate(candidate_id),
    cache_key TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL,
    source_class TEXT,
    object_text BLOB,
    relocations_json TEXT,
    artifact_dir TEXT NOT NULL,
    stdout TEXT NOT NULL,
    stderr TEXT NOT NULL,
    duration_ms INTEGER NOT NULL,
    tool_json TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS compile_run_candidate_created
    ON compile_run(candidate_id, created_at DESC);

CREATE TABLE IF NOT EXISTS comparison (
    comparison_id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL UNIQUE REFERENCES compile_run(run_id),
    primary_class TEXT NOT NULL,
    exact_bytes INTEGER NOT NULL,
    relocation_masked_exact INTEGER NOT NULL,
    score REAL NOT NULL,
    details_json TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS comparison_class_score
    ON comparison(primary_class, score DESC);

CREATE TABLE IF NOT EXISTS context_snapshot (
    context_id TEXT PRIMARY KEY,
    target_id TEXT NOT NULL REFERENCES target_snapshot(target_id),
    model_id TEXT NOT NULL,
    context_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(target_id, model_id)
);

CREATE TABLE IF NOT EXISTS family_group (
    group_id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL,
    tier TEXT NOT NULL,
    representation TEXT NOT NULL,
    member_count INTEGER NOT NULL,
    metadata_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS family_group_model_tier
    ON family_group(model_id, tier, member_count DESC);

CREATE TABLE IF NOT EXISTS family_member (
    group_id TEXT NOT NULL REFERENCES family_group(group_id) ON DELETE CASCADE,
    target_id TEXT NOT NULL REFERENCES target_snapshot(target_id),
    ordinal INTEGER NOT NULL,
    PRIMARY KEY(group_id, target_id)
);

CREATE INDEX IF NOT EXISTS family_member_target ON family_member(target_id);

CREATE TABLE IF NOT EXISTS sweep_run (
    sweep_id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL,
    selector_json TEXT NOT NULL,
    status TEXT NOT NULL,
    summary_json TEXT NOT NULL,
    started_at TEXT NOT NULL,
    finished_at TEXT
);

CREATE INDEX IF NOT EXISTS sweep_run_model_started
    ON sweep_run(model_id, started_at DESC);

CREATE TABLE IF NOT EXISTS experiment_note (
    note_id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_id TEXT NOT NULL REFERENCES target_snapshot(target_id),
    candidate_id TEXT REFERENCES candidate(candidate_id),
    kind TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL
);

INSERT OR IGNORE INTO metadata(key, value) VALUES ('schemaVersion', '1');

INSERT OR IGNORE INTO candidate_observation(
    observation_id,candidate_id,origin,variant,parent_candidate_id,metadata_json,created_at
)
SELECT 'legacy:' || candidate_id,candidate_id,origin,variant,parent_candidate_id,metadata_json,created_at
  FROM candidate
 WHERE (SELECT value FROM metadata WHERE key='schemaVersion')='1';

UPDATE metadata SET value='2' WHERE key='schemaVersion' AND value='1';
