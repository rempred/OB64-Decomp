"""Build and verify the compact, multi-lane Total Resolver R3 database."""

from __future__ import annotations

from collections import defaultdict
from contextlib import ExitStack
import json
from pathlib import Path
import sqlite3
from typing import Any, Iterable, Mapping, Sequence

from .capture_db import canonical_json
from .derive_transition import _write_json
from .inventory import repository_root
from .resolver_sources import (
    ResolverSourcePaths,
    SourceIdentity,
    default_source_paths,
    open_readonly,
    validate_resolver_sources,
)


RESOLVER_SCHEMA = "ob64-total-resolver-r3.v1"
RESOLVER_SCHEMA_VERSION = 1
LOGICAL_KEYS: dict[str, str] = {
    "source_registry": "source_id",
    "session": "session_id",
    "static_function": "function_id",
    "static_call": "call_id",
    "static_call_candidate": "candidate_id",
    "static_indirect_call": "indirect_call_id",
    "static_unresolved": "unresolved_id",
    "resource_family": "family_id",
    "resource": "resource_id",
    "resource_alias": "alias_id",
    "resource_loader": "loader_id",
    "resource_chain": "chain_id",
    "resource_stage": "stage_id",
    "resource_edge": "edge_id",
    "resource_range": "range_id",
    "resource_callsite": "callsite_id",
    "resource_unresolved": "unresolved_id",
    "resource_conflict": "conflict_id",
    "field_family": "family_id",
    "field_candidate": "field_id",
    "field_alias": "alias_id",
    "field_access": "access_id",
    "field_unresolved": "unresolved_id",
    "field_conflict": "conflict_id",
    "placement": "placement_id",
    "placement_witness": "placement_id,session_id,local_witness_id",
    "slab_member": "slab_placement_id,member_placement_id",
    "function_placement": "function_placement_id",
    "function_placement_witness": (
        "function_placement_id,session_id,local_placement_id"
    ),
    "region_instance": "region_instance_id",
    "placement_unresolved": "unresolved_id",
    "runtime_execution": "runtime_execution_id",
    "runtime_memory_access": "runtime_memory_access_id",
    "runtime_edge": "observed_edge_id",
    "runtime_unresolved": "unresolved_id",
    "runtime_conflict": "conflict_id",
    "function_coverage": "function_id",
}


def resolver_products_root(explicit: Path | None = None) -> Path:
    return (
        explicit
        or repository_root()
        / "build"
        / "total-resolver"
        / "products"
        / "resolver-r3"
    ).resolve()


def resolver_schema_path() -> Path:
    return Path(__file__).resolve().parent / "schemas" / "resolver.sql"


def _insert_all(
    connection: sqlite3.Connection,
    table: str,
    columns: Sequence[str],
    rows: Iterable[Sequence[Any]],
) -> None:
    connection.executemany(
        f"INSERT INTO {table}({','.join(columns)}) "
        f"VALUES({','.join('?' for _ in columns)})",
        rows,
    )


def _logical_hash(connection: sqlite3.Connection) -> str:
    """Hash normalized rows without depending on SQLite file layout."""

    import hashlib

    digest = hashlib.sha256()
    for table, order in LOGICAL_KEYS.items():
        columns = [str(row[1]) for row in connection.execute(f"PRAGMA table_info({table})")]
        header = canonical_json({"table": table, "columns": columns}).encode("utf-8")
        digest.update(len(header).to_bytes(8, "big"))
        digest.update(header)
        for row in connection.execute(f"SELECT * FROM {table} ORDER BY {order}"):
            payload = canonical_json(list(row)).encode("utf-8")
            digest.update(len(payload).to_bytes(8, "big"))
            digest.update(payload)
    return digest.hexdigest().upper()


def _row_payload(row: sqlite3.Row) -> str:
    return canonical_json({key: row[key] for key in row.keys()})


def _static_rows(connection: sqlite3.Connection, source: sqlite3.Connection) -> None:
    _insert_all(
        connection,
        "static_function",
        (
            "function_id",
            "structural_name",
            "display_name",
            "z64_start",
            "z64_end_exclusive",
            "nominal_live_start",
            "nominal_live_end_exclusive",
            "derivation_method",
            "confidence",
            "note",
        ),
        source.execute(
            "SELECT f.function_id,f.structural_name,f.display_name,f.rom_start,"
            "f.rom_end_exclusive,MIN(w.nominal_linear_vram),"
            "CASE WHEN MAX(w.nominal_linear_vram) IS NULL THEN NULL "
            "ELSE MAX(w.nominal_linear_vram)+4 END,f.derivation_method,f.confidence,f.note "
            "FROM logical_function f LEFT JOIN word w ON w.rom_address>=f.rom_start "
            "AND w.rom_address<f.rom_end_exclusive GROUP BY f.function_id "
            "ORDER BY f.function_id"
        ),
    )
    _insert_all(
        connection,
        "static_call",
        (
            "call_id",
            "instruction_z64",
            "caller_function_id",
            "encoded_low28",
            "nominal_live_kseg",
            "target_z64_boot_linear",
            "resolution_method",
            "confidence",
        ),
        source.execute(
            "SELECT call_id,instruction_rom,function_id,encoded_low28,"
            "nominal_live_kseg,target_rom_boot_linear,resolution_method,confidence "
            "FROM direct_call ORDER BY call_id"
        ),
    )
    _insert_all(
        connection,
        "static_call_candidate",
        (
            "candidate_id",
            "call_id",
            "callee_function_id",
            "candidate_z64",
            "method",
            "confidence",
            "note",
        ),
        source.execute(
            "SELECT c.candidate_id,d.call_id,c.candidate_function_id,c.candidate_rom,"
            "c.method,c.confidence,c.note FROM candidate_callee c "
            "JOIN direct_call d ON d.instruction_rom=c.instruction_rom "
            "ORDER BY c.candidate_id"
        ),
    )
    _insert_all(
        connection,
        "static_indirect_call",
        (
            "indirect_call_id",
            "instruction_z64",
            "caller_function_id",
            "target_register",
            "resolution_method",
            "confidence",
        ),
        source.execute(
            "SELECT indirect_call_id,instruction_rom,function_id,target_register,"
            "resolution_method,confidence FROM indirect_call ORDER BY indirect_call_id"
        ),
    )
    _insert_all(
        connection,
        "static_unresolved",
        (
            "unresolved_id",
            "instruction_z64",
            "function_id",
            "target_kind",
            "detail",
            "method",
            "confidence",
        ),
        source.execute(
            "SELECT unresolved_id,instruction_rom,function_id,target_kind,detail,"
            "method,confidence FROM unresolved_target ORDER BY unresolved_id"
        ),
    )


def _resource_range_rows(source: sqlite3.Connection) -> Iterable[tuple[Any, ...]]:
    for row in source.execute("SELECT * FROM container ORDER BY container_id"):
        yield (
            "container:" + str(row["container_id"]),
            row["resource_id"],
            "container",
            row["container_id"],
            row["range_kind"],
            row["z64_start"],
            row["z64_end_exclusive"],
            None,
            None,
            row["disposition"],
            row["evidence_grade"],
            _row_payload(row),
        )
    for row in source.execute("SELECT * FROM catalog_entry ORDER BY catalog_id"):
        yield (
            "catalog:" + str(row["catalog_id"]),
            None,
            "catalog-entry",
            row["catalog_id"],
            row["catalog_type"],
            row["z64_start"],
            row["z64_end_exclusive"],
            None,
            None,
            row["disposition"],
            row["evidence_grade"],
            _row_payload(row),
        )
    for row in source.execute("SELECT * FROM table_binding ORDER BY binding_id"):
        yield (
            "binding:" + str(row["binding_id"]),
            None,
            "table-binding",
            row["binding_id"],
            row["bind_kind"],
            row["z64_start"],
            row["z64_end_exclusive"],
            row["live_start"],
            row["live_end_exclusive"],
            row["disposition"],
            row["evidence_grade"],
            _row_payload(row),
        )
    for row in source.execute(
        "SELECT a.*,c.resource_id FROM allocation a "
        "JOIN chain c ON c.chain_id=a.chain_id ORDER BY a.allocation_id"
    ):
        yield (
            "allocation:" + str(row["allocation_id"]),
            row["resource_id"],
            "allocation",
            row["allocation_id"],
            row["allocation_kind"],
            row["z64_source_start"],
            row["z64_source_end_exclusive"],
            row["live_start"],
            row["live_end_exclusive"],
            row["disposition"],
            row["evidence_grade"],
            _row_payload(row),
        )


def _resource_rows(connection: sqlite3.Connection, source: sqlite3.Connection) -> None:
    _insert_all(
        connection,
        "resource_family",
        (
            "family_id",
            "name",
            "description",
            "scope",
            "disposition",
            "evidence_grade",
            "note",
        ),
        source.execute(
            "SELECT family_id,name,description,scope,disposition,evidence_grade,note "
            "FROM family ORDER BY family_id"
        ),
    )
    _insert_all(
        connection,
        "resource",
        (
            "resource_id",
            "family_id",
            "logical_key",
            "key_kind",
            "lookup_table",
            "table_index",
            "label",
            "disposition",
            "evidence_grade",
            "review_status",
            "scope",
            "note",
        ),
        source.execute("SELECT * FROM resource ORDER BY resource_id"),
    )
    _insert_all(
        connection,
        "resource_alias",
        ("alias_id", "resource_id", "alias_kind", "alias_value", "note"),
        source.execute(
            "SELECT alias_id,resource_id,alias_kind,alias_value,note "
            "FROM resource_alias ORDER BY alias_id"
        ),
    )
    _insert_all(
        connection,
        "resource_loader",
        (
            "loader_id",
            "z64_start",
            "z64_end_exclusive",
            "structural_name",
            "display_name",
            "role",
            "boundary_kind",
            "nominal_live_start",
            "nominal_live_end_exclusive",
            "disposition",
            "evidence_grade",
            "static_callsite_count",
            "indirect_call_count",
            "note",
        ),
        source.execute(
            "SELECT loader_id,rom_start,rom_end_exclusive,structural_name,display_name,"
            "role,boundary_kind,nominal_live_start,nominal_live_end_exclusive,"
            "disposition,evidence_grade,static_callsite_count,indirect_call_count,note "
            "FROM loader ORDER BY loader_id"
        ),
    )
    _insert_all(
        connection,
        "resource_chain",
        (
            "chain_id",
            "family_id",
            "resource_id",
            "container_id",
            "loader_id",
            "codec_id",
            "primary_consumer_id",
            "disposition",
            "evidence_grade",
            "review_status",
            "scope",
            "note",
        ),
        source.execute("SELECT * FROM chain ORDER BY chain_id"),
    )
    _insert_all(
        connection,
        "resource_stage",
        (
            "stage_id",
            "chain_id",
            "ordinal",
            "stage_kind",
            "entity_kind",
            "entity_id",
            "z64_start",
            "z64_end_exclusive",
            "live_start",
            "live_end_exclusive",
            "address_space",
            "descriptor",
            "disposition",
            "evidence_grade",
            "note",
        ),
        source.execute(
            "SELECT stage_id,chain_id,ordinal,stage_kind,entity_kind,entity_id,"
            "z64_start,z64_end_exclusive,live_start,live_end_exclusive,address_space,"
            "descriptor,disposition,evidence_grade,note FROM chain_stage ORDER BY stage_id"
        ),
    )
    _insert_all(
        connection,
        "resource_edge",
        (
            "edge_id",
            "chain_id",
            "from_stage_id",
            "to_stage_id",
            "edge_kind",
            "status",
            "evidence_grade",
            "scope",
            "note",
        ),
        source.execute(
            "SELECT edge_id,chain_id,from_stage_id,to_stage_id,edge_kind,status,"
            "evidence_grade,scope,note FROM edge ORDER BY edge_id"
        ),
    )
    _insert_all(
        connection,
        "resource_range",
        (
            "range_id",
            "resource_id",
            "entity_kind",
            "entity_id",
            "role",
            "z64_start",
            "z64_end_exclusive",
            "live_start",
            "live_end_exclusive",
            "disposition",
            "evidence_grade",
            "payload_json",
        ),
        _resource_range_rows(source),
    )
    _insert_all(
        connection,
        "resource_callsite",
        (
            "callsite_id",
            "loader_id",
            "static_call_id",
            "instruction_z64",
            "caller_z64",
            "caller_name",
            "target_z64",
            "resolution_method",
            "resolution_grade",
            "scope",
            "note",
        ),
        source.execute(
            "SELECT callsite_id,loader_id,call_id,callsite_rom,caller_rom,caller_name,"
            "target_rom,resolution_method,resolution_grade,scope,note "
            "FROM callsite ORDER BY callsite_id"
        ),
    )
    _insert_all(
        connection,
        "resource_unresolved",
        (
            "unresolved_id",
            "chain_id",
            "loader_id",
            "link_kind",
            "description",
            "smallest_next_evidence",
            "status",
            "note",
        ),
        source.execute(
            "SELECT unresolved_id,chain_id,loader_id,link_kind,description,"
            "smallest_next_evidence,status,note FROM unresolved ORDER BY unresolved_id"
        ),
    )
    _insert_all(
        connection,
        "resource_conflict",
        ("conflict_id", "topic", "values_json", "scope", "disposition", "note"),
        source.execute(
            "SELECT conflict_id,topic,values_json,scope,disposition,note "
            "FROM conflict ORDER BY conflict_id"
        ),
    )


def _field_rows(connection: sqlite3.Connection, source: sqlite3.Connection) -> None:
    _insert_all(
        connection,
        "field_family",
        (
            "family_id",
            "family_key",
            "label",
            "family_kind",
            "lineage_basis",
            "acceptance_basis",
            "evidence_grade",
            "review_status",
            "scope",
            "citation",
            "falsifier",
            "access_count",
            "field_count",
        ),
        source.execute("SELECT * FROM object_family ORDER BY family_id"),
    )
    _insert_all(
        connection,
        "field_candidate",
        (
            "field_id",
            "family_id",
            "displacement_signed",
            "field_key",
            "field_label",
            "semantic_label",
            "observed_shapes_json",
            "observed_signedness_json",
            "effect_role",
            "initialization_shape",
            "copy_relationship_count",
            "evidence_grade",
            "review_status",
            "grouping_rule",
            "falsifier",
            "accepted_citation",
        ),
        source.execute("SELECT * FROM field_candidate ORDER BY field_id"),
    )
    _insert_all(
        connection,
        "field_alias",
        ("alias_id", "field_id", "alias_label", "alias_scope", "basis", "citation"),
        source.execute("SELECT * FROM field_alias ORDER BY alias_id"),
    )
    _insert_all(
        connection,
        "field_access",
        (
            "access_id",
            "field_id",
            "family_id",
            "instruction_z64",
            "function_id",
            "structural_name",
            "mnemonic",
            "access_kind",
            "width_bytes",
            "data_shape",
            "signedness",
            "base_register_name",
            "displacement_signed",
            "assignment_kind",
            "grouping_reason",
            "falsifier",
        ),
        source.execute(
            "SELECT a.access_id,fa.field_id,fa.family_id,a.instruction_rom,a.function_id,"
            "a.structural_name,a.mnemonic,a.access_kind,a.width_bytes,a.data_shape,"
            "a.signedness,a.base_register_name,a.displacement_signed,fa.assignment_kind,"
            "fa.grouping_reason,fa.falsifier FROM access_site a "
            "JOIN field_access fa ON fa.access_id=a.access_id ORDER BY a.access_id"
        ),
    )
    _insert_all(
        connection,
        "field_unresolved",
        (
            "unresolved_id",
            "access_id",
            "function_id",
            "instruction_z64",
            "reason",
            "detail",
            "falsifier",
        ),
        source.execute(
            "SELECT unresolved_evidence_id,access_id,function_id,instruction_rom,reason,"
            "detail,falsifier FROM unresolved_evidence ORDER BY unresolved_evidence_id"
        ),
    )
    _insert_all(
        connection,
        "field_conflict",
        (
            "conflict_id",
            "conflict_kind",
            "severity",
            "displacement_signed",
            "field_a_id",
            "field_b_id",
            "message",
            "evidence_json",
            "resolution",
            "review_status",
        ),
        source.execute(
            "SELECT conflict_id,conflict_kind,severity,displacement_signed,field_a_id,"
            "field_b_id,message,evidence_json,resolution,review_status "
            "FROM conflict ORDER BY conflict_id"
        ),
    )


def _validate_static_crosswalk(
    connection: sqlite3.Connection,
    field: sqlite3.Connection,
    atlas: sqlite3.Connection,
    runtime: sqlite3.Connection,
) -> None:
    canonical = [
        tuple(row)
        for row in connection.execute(
            "SELECT function_id,structural_name,display_name,z64_start,z64_end_exclusive "
            "FROM static_function ORDER BY function_id"
        )
    ]
    field_rows = [
        tuple(row)
        for row in field.execute(
            "SELECT function_id,structural_name,display_name,rom_start,rom_end_exclusive "
            "FROM static_function ORDER BY function_id"
        )
    ]
    if field_rows != canonical:
        raise ValueError("field source static-function identity disagrees with static-db-r3")
    atlas_rows = [
        tuple(row)
        for row in atlas.execute(
            "SELECT function_id,structural_name,source_z64_start,source_z64_end_exclusive "
            "FROM static_function_coverage ORDER BY function_id"
        )
    ]
    canonical_atlas = [(row[0], row[1], row[3], row[4]) for row in canonical]
    if atlas_rows != canonical_atlas:
        raise ValueError("Overlay Atlas 2.0 static-function crosswalk is stale")
    runtime_rows = [
        tuple(row)
        for row in runtime.execute(
            "SELECT function_id,structural_name FROM static_function_runtime_coverage "
            "ORDER BY function_id"
        )
    ]
    canonical_runtime = [(row[0], row[1]) for row in canonical]
    if runtime_rows != canonical_runtime:
        raise ValueError("Runtime Provenance 2.0 static-function crosswalk is stale")


def _placement_rows(
    connection: sqlite3.Connection,
    atlas: sqlite3.Connection,
) -> None:
    _insert_all(
        connection,
        "session",
        (
            "session_id",
            "summary_sha256",
            "raw_manifest_sha256",
            "bridge_version",
            "closure_status",
            "continuity_status",
            "working_evidence_quality",
            "review_state",
        ),
        (
            (
                row["session_id"],
                row["session_product_summary_sha256"],
                row["raw_manifest_sha256"],
                row["bridge_version"],
                row["closure_status"],
                row["continuity_status"],
                row["working_evidence_quality"],
                "generated-unreviewed",
            )
            for row in atlas.execute("SELECT * FROM source_session ORDER BY session_id")
        ),
    )
    _insert_all(
        connection,
        "placement",
        (
            "placement_id",
            "placement_kind",
            "source_z64_start",
            "source_z64_end_exclusive",
            "destination_physical_start",
            "destination_physical_end_exclusive",
            "content_sha256",
            "byte_size",
            "mapping_delta",
            "region_class",
            "evidence_grade",
            "mapping_method",
            "transient_only",
            "witness_count",
        ),
        atlas.execute("SELECT * FROM placement ORDER BY placement_id"),
    )
    _insert_all(
        connection,
        "placement_witness",
        (
            "placement_id",
            "session_id",
            "local_witness_id",
            "first_sequence",
            "last_sequence",
            "first_frame",
            "last_frame",
        ),
        atlas.execute(
            "SELECT * FROM placement_witness "
            "ORDER BY placement_id,session_id,local_witness_id"
        ),
    )
    _insert_all(
        connection,
        "slab_member",
        ("slab_placement_id", "member_placement_id", "ordinal"),
        atlas.execute(
            "SELECT * FROM slab_member ORDER BY slab_placement_id,member_placement_id"
        ),
    )
    _insert_all(
        connection,
        "function_placement",
        (
            "function_placement_id",
            "slab_placement_id",
            "function_id",
            "source_z64_start",
            "source_z64_end_exclusive",
            "destination_physical_start",
            "destination_physical_end_exclusive",
            "confidence",
            "mapping_method",
            "witness_count",
        ),
        atlas.execute(
            "SELECT function_placement_id,slab_placement_id,function_id,"
            "source_z64_start,source_z64_end_exclusive,destination_physical_start,"
            "destination_physical_end_exclusive,confidence,mapping_method,witness_count "
            "FROM function_placement ORDER BY function_placement_id"
        ),
    )
    _insert_all(
        connection,
        "function_placement_witness",
        (
            "function_placement_id",
            "session_id",
            "local_placement_id",
            "first_sequence",
            "last_sequence",
            "first_frame",
            "last_frame",
        ),
        atlas.execute(
            "SELECT * FROM function_placement_witness "
            "ORDER BY function_placement_id,session_id,local_placement_id"
        ),
    )
    _insert_all(
        connection,
        "region_instance",
        (
            "region_instance_id",
            "session_id",
            "local_region_instance_id",
            "placement_id",
            "destination_physical_start",
            "destination_physical_end_exclusive",
            "content_sha256",
            "first_sequence",
            "end_sequence_exclusive",
            "first_frame",
            "last_observed_frame",
            "closure_reason",
            "region_class",
            "evidence_grade",
            "source_kind",
            "source_identity",
            "transient_at_most_two_frames",
        ),
        atlas.execute(
            "SELECT atlas_region_instance_id,session_id,local_region_instance_id,"
            "placement_id,destination_physical_start,destination_physical_end_exclusive,"
            "content_sha256,first_sequence,end_sequence_exclusive,first_frame,"
            "last_observed_frame,closure_reason,region_class,evidence_grade,source_kind,"
            "source_identity,transient_at_most_two_frames FROM region_instance "
            "ORDER BY atlas_region_instance_id"
        ),
    )
    _insert_all(
        connection,
        "placement_unresolved",
        ("unresolved_id", "session_id", "kind", "sequence", "frame", "payload_json"),
        atlas.execute(
            "SELECT atlas_unresolved_id,session_id,kind,sequence,frame,payload_json "
            "FROM unresolved_observation ORDER BY atlas_unresolved_id"
        ),
    )


def _runtime_rows(
    connection: sqlite3.Connection,
    runtime: sqlite3.Connection,
) -> None:
    _insert_all(
        connection,
        "runtime_execution",
        (
            "runtime_execution_id",
            "session_id",
            "sequence",
            "bridge_sequence",
            "frame",
            "live_pc",
            "physical_pc",
            "observation_kind",
            "execution_claim",
            "region_instance_id",
            "z64_offset",
            "function_id",
            "mapping_method",
            "mapping_status",
            "evidence_grade",
            "return_address",
            "review_state",
        ),
        runtime.execute(
            "SELECT runtime_execution_id,session_id,sequence,bridge_sequence,frame,"
            "live_pc,physical_pc,observation_kind,execution_claim,atlas_region_instance_id,"
            "z64_offset,function_id,mapping_method,mapping_status,evidence_grade,"
            "return_address,review_state FROM execution_observation "
            "ORDER BY runtime_execution_id"
        ),
    )
    _insert_all(
        connection,
        "runtime_memory_access",
        (
            "runtime_memory_access_id",
            "session_id",
            "sequence",
            "bridge_sequence",
            "frame",
            "access_kind",
            "width_bits",
            "effective_address",
            "value_text",
            "value_high_text",
            "accessor_live_pc",
            "accessor_physical_pc",
            "region_instance_id",
            "z64_instruction",
            "function_id",
            "mapping_method",
            "review_state",
        ),
        runtime.execute(
            "SELECT runtime_memory_access_id,session_id,sequence,bridge_sequence,frame,"
            "access_kind,width_bits,effective_address,value_text,value_high_text,"
            "accessor_live_pc,accessor_physical_pc,atlas_region_instance_id,"
            "z64_instruction,function_id,mapping_method,review_state "
            "FROM memory_access ORDER BY runtime_memory_access_id"
        ),
    )
    _insert_all(
        connection,
        "runtime_edge",
        (
            "observed_edge_id",
            "session_id",
            "execution_sequence",
            "caller_live_pc",
            "callee_live_pc",
            "caller_function_id",
            "callee_function_id",
            "edge_kind",
            "evidence_grade",
            "review_state",
        ),
        runtime.execute(
            "SELECT observed_edge_id,session_id,execution_sequence,caller_live_pc,"
            "callee_live_pc,caller_function_id,callee_function_id,edge_kind,"
            "evidence_grade,review_state FROM observed_edge ORDER BY observed_edge_id"
        ),
    )
    _insert_all(
        connection,
        "runtime_unresolved",
        ("unresolved_id", "session_id", "kind", "sequence", "frame", "payload_json"),
        runtime.execute(
            "SELECT runtime_unresolved_id,session_id,kind,sequence,frame,payload_json "
            "FROM runtime_unresolved ORDER BY runtime_unresolved_id"
        ),
    )
    _insert_all(
        connection,
        "runtime_conflict",
        ("conflict_id", "conflict_kind", "live_pc", "session_id", "detail_json"),
        runtime.execute(
            "SELECT conflict_id,conflict_kind,live_pc,session_id,detail_json "
            "FROM runtime_conflict ORDER BY conflict_id"
        ),
    )


def _coverage_rows(connection: sqlite3.Connection) -> None:
    placement_counts = {
        int(row[0]): (int(row[1]), int(row[2]))
        for row in connection.execute(
            "SELECT function_id,COUNT(*),SUM(witness_count) FROM function_placement "
            "GROUP BY function_id"
        )
    }
    exact_counts = {
        int(row[0]): int(row[1])
        for row in connection.execute(
            "SELECT function_id,COUNT(*) FROM runtime_execution "
            "WHERE function_id IS NOT NULL AND execution_claim='observed' "
            "AND evidence_grade IN ('verified','supported') GROUP BY function_id"
        )
    }
    sampled_counts = {
        int(row[0]): int(row[1])
        for row in connection.execute(
            "SELECT function_id,COUNT(*) FROM runtime_execution "
            "WHERE function_id IS NOT NULL AND execution_claim='sampled-only' "
            "GROUP BY function_id"
        )
    }
    memory_counts = {
        int(row[0]): int(row[1])
        for row in connection.execute(
            "SELECT function_id,COUNT(*) FROM runtime_memory_access "
            "WHERE function_id IS NOT NULL GROUP BY function_id"
        )
    }
    rows = []
    for row in connection.execute("SELECT function_id FROM static_function ORDER BY function_id"):
        function_id = int(row[0])
        placements, witnesses = placement_counts.get(function_id, (0, 0))
        exact = exact_counts.get(function_id, 0)
        sampled = sampled_counts.get(function_id, 0)
        memory = memory_counts.get(function_id, 0)
        classification = (
            "observed-executed"
            if exact
            else "observed-placed-not-executed"
            if placements
            else "sampled-context-only"
            if sampled
            else "never-observed"
        )
        rows.append(
            (
                function_id,
                placements,
                witnesses,
                exact,
                sampled,
                memory,
                classification,
            )
        )
    _insert_all(
        connection,
        "function_coverage",
        (
            "function_id",
            "placement_count",
            "placement_witness_count",
            "exact_execution_count",
            "sampled_pc_count",
            "memory_access_count",
            "classification",
        ),
        rows,
    )


def coverage_report(connection: sqlite3.Connection) -> dict[str, Any]:
    static_to_dynamic = {
        str(row[0]): int(row[1])
        for row in connection.execute(
            "SELECT classification,COUNT(*) FROM function_coverage "
            "GROUP BY classification ORDER BY classification"
        )
    }
    static_functions = int(
        connection.execute("SELECT COUNT(*) FROM static_function").fetchone()[0]
    )
    placed_functions = int(
        connection.execute(
            "SELECT COUNT(*) FROM function_coverage WHERE placement_count>0"
        ).fetchone()[0]
    )
    executed_functions = int(
        connection.execute(
            "SELECT COUNT(*) FROM function_coverage WHERE exact_execution_count>0"
        ).fetchone()[0]
    )
    dynamic = {
        "placements": int(connection.execute("SELECT COUNT(*) FROM placement").fetchone()[0]),
        "placementWitnesses": int(
            connection.execute("SELECT COUNT(*) FROM placement_witness").fetchone()[0]
        ),
        "regionInstances": int(
            connection.execute("SELECT COUNT(*) FROM region_instance").fetchone()[0]
        ),
        "regionsWithoutPlacement": int(
            connection.execute(
                "SELECT COUNT(*) FROM region_instance WHERE placement_id IS NULL"
            ).fetchone()[0]
        ),
        "exactExecutionObservations": int(
            connection.execute(
                "SELECT COUNT(*) FROM runtime_execution WHERE execution_claim='observed'"
            ).fetchone()[0]
        ),
        "sampledPcContexts": int(
            connection.execute(
                "SELECT COUNT(*) FROM runtime_execution "
                "WHERE execution_claim='sampled-only'"
            ).fetchone()[0]
        ),
        "unmappedExactExecutionObservations": int(
            connection.execute(
                "SELECT COUNT(*) FROM runtime_execution WHERE execution_claim='observed' "
                "AND (function_id IS NULL OR z64_offset IS NULL OR mapping_status='unresolved')"
            ).fetchone()[0]
        ),
        "memoryAccesses": int(
            connection.execute("SELECT COUNT(*) FROM runtime_memory_access").fetchone()[0]
        ),
    }
    unresolved = {
        "static": int(connection.execute("SELECT COUNT(*) FROM static_unresolved").fetchone()[0]),
        "resource": int(
            connection.execute("SELECT COUNT(*) FROM resource_unresolved").fetchone()[0]
        ),
        "field": int(connection.execute("SELECT COUNT(*) FROM field_unresolved").fetchone()[0]),
        "placement": int(
            connection.execute("SELECT COUNT(*) FROM placement_unresolved").fetchone()[0]
        ),
        "runtime": int(
            connection.execute("SELECT COUNT(*) FROM runtime_unresolved").fetchone()[0]
        ),
    }
    return {
        "schema": "ob64-total-resolver-r3-coverage.v1",
        "staticToDynamic": {
            "staticFunctions": static_functions,
            "placedFunctions": placed_functions,
            "exactlyExecutedFunctions": executed_functions,
            "classifications": static_to_dynamic,
            "placedPercent": (
                0.0 if not static_functions else placed_functions * 100.0 / static_functions
            ),
            "exactlyExecutedPercent": (
                0.0 if not static_functions else executed_functions * 100.0 / static_functions
            ),
        },
        "dynamicToStatic": dynamic,
        "loaderCoverage": {
            "romDmaPlacementWitnesses": int(
                connection.execute(
                    "SELECT COUNT(*) FROM placement_witness w "
                    "JOIN placement p ON p.placement_id=w.placement_id "
                    "WHERE p.placement_kind='rom-dma'"
                ).fetchone()[0]
            ),
            "knownStaticResourceLoaders": int(
                connection.execute("SELECT COUNT(*) FROM resource_loader").fetchone()[0]
            ),
            "note": (
                "ROM DMA witnesses are complete machine observations; linkage to a named "
                "resource loader remains separate unless a resource-chain row supports it."
            ),
        },
        "fieldLane": {
            "families": int(connection.execute("SELECT COUNT(*) FROM field_family").fetchone()[0]),
            "fields": int(connection.execute("SELECT COUNT(*) FROM field_candidate").fetchone()[0]),
            "staticAccesses": int(
                connection.execute("SELECT COUNT(*) FROM field_access").fetchone()[0]
            ),
            "runtimeFieldAssignments": 0,
            "note": "No effective address is assigned to a static field by offset alone.",
        },
        "resourceLane": {
            "resources": int(connection.execute("SELECT COUNT(*) FROM resource").fetchone()[0]),
            "chains": int(connection.execute("SELECT COUNT(*) FROM resource_chain").fetchone()[0]),
            "runtimeResourceAssignments": 0,
        },
        "unresolved": unresolved,
        "completenessBoundary": (
            "These counts describe the recorded sessions only. Falling discovery or broad "
            "coverage does not prove that unplayed or unreachable states do not exist."
        ),
    }


def _selected_counts(connection: sqlite3.Connection) -> dict[str, int]:
    names = (
        "source_registry",
        "session",
        "static_function",
        "static_call",
        "static_call_candidate",
        "resource",
        "resource_chain",
        "field_family",
        "field_candidate",
        "field_access",
        "placement",
        "function_placement",
        "region_instance",
        "runtime_execution",
        "runtime_memory_access",
        "runtime_edge",
        "function_coverage",
    )
    return {
        name: int(connection.execute(f"SELECT COUNT(*) FROM {name}").fetchone()[0])
        for name in names
    }


def build_total_resolver(
    *,
    source_paths: ResolverSourcePaths | None = None,
    output_directory: Path | None = None,
    expected_identities: Mapping[str, str] | None = None,
) -> dict[str, Any]:
    paths = source_paths or default_source_paths()
    identities = validate_resolver_sources(
        paths, expected_identities=expected_identities
    )
    destination = resolver_products_root(output_directory)
    destination.mkdir(parents=True, exist_ok=True)
    database = destination / "resolver-r3.sqlite"
    temporary = database.with_name(database.name + ".tmp")
    if temporary.exists():
        temporary.unlink()

    with ExitStack() as stack:
        static = open_readonly(paths.static_database)
        resource = open_readonly(paths.resource_database)
        field = open_readonly(paths.field_database)
        atlas = open_readonly(paths.overlay_atlas / "overlay-atlas.sqlite")
        runtime = open_readonly(paths.runtime_provenance / "runtime-provenance.sqlite")
        for source in (static, resource, field, atlas, runtime):
            stack.callback(source.close)

        connection = sqlite3.connect(temporary)
        stack.callback(connection.close)
        connection.execute("PRAGMA synchronous=OFF")
        connection.execute("PRAGMA temp_store=MEMORY")
        connection.executescript(resolver_schema_path().read_text(encoding="utf-8"))
        _insert_all(
            connection,
            "source_registry",
            (
                "source_id",
                "adapter_id",
                "adapter_version",
                "snapshot_id",
                "evidence_lanes_json",
                "identity_kind",
                "identity_sha256",
                "review_state",
                "evidence_boundary",
            ),
            (value.registry_row() for value in sorted(identities, key=lambda item: item.source_id)),
        )
        _static_rows(connection, static)
        _validate_static_crosswalk(connection, field, atlas, runtime)
        _resource_rows(connection, resource)
        _field_rows(connection, field)
        _placement_rows(connection, atlas)
        _runtime_rows(connection, runtime)
        _coverage_rows(connection)
        logical_sha256 = _logical_hash(connection)
        connection.executemany(
            "INSERT INTO meta(key,value) VALUES(?,?)",
            (
                ("schema", RESOLVER_SCHEMA),
                ("schemaVersion", str(RESOLVER_SCHEMA_VERSION)),
                ("logicalSha256", logical_sha256),
            ),
        )
        connection.commit()
        counts = _selected_counts(connection)
        coverage = coverage_report(connection)
        integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
        foreign_keys = connection.execute("PRAGMA foreign_key_check").fetchall()
        if integrity != "ok" or foreign_keys:
            raise ValueError("generated resolver failed SQLite integrity checks")

    temporary.replace(database)
    summary = {
        "schema": RESOLVER_SCHEMA,
        "schemaVersion": RESOLVER_SCHEMA_VERSION,
        "logicalSha256": logical_sha256,
        "reviewState": "generated-unreviewed",
        "sources": [value.to_dict() for value in identities],
        "counts": counts,
        "files": {
            "database": "resolver-r3.sqlite",
            "coverage": "coverage.json",
            "sourceRegistry": "source-registry.json",
        },
        "evidenceBoundary": (
            "Static, placement, runtime, field, and resource lanes remain distinct. "
            "Sampled PCs are context only; placement does not imply execution."
        ),
    }
    _write_json(destination / "coverage.json", coverage)
    _write_json(
        destination / "source-registry.json",
        {
            "schema": "ob64-total-resolver-r3-source-registry.v1",
            "sources": [value.to_dict() for value in identities],
        },
    )
    _write_json(destination / "summary.json", summary)
    verification = _verify_database(destination, identities=identities)
    return {
        "result": verification["result"],
        "productDirectory": str(destination),
        "database": str(database),
        "logicalSha256": logical_sha256,
        "counts": counts,
        "coverage": coverage["staticToDynamic"],
        "verification": verification,
    }


def _verify_database(
    root: Path,
    *,
    identities: Sequence[SourceIdentity] | None,
) -> dict[str, Any]:
    database = root.resolve() / "resolver-r3.sqlite"
    connection = open_readonly(database)
    try:
        connection.execute("PRAGMA foreign_keys=ON")
        integrity = [str(row[0]) for row in connection.execute("PRAGMA integrity_check")]
        foreign_keys = connection.execute("PRAGMA foreign_key_check").fetchall()
        meta = dict(connection.execute("SELECT key,value FROM meta"))
        logical = _logical_hash(connection)
        schema_version = int(connection.execute("PRAGMA user_version").fetchone()[0])
        registry = {
            str(row["source_id"]): str(row["identity_sha256"])
            for row in connection.execute("SELECT * FROM source_registry")
        }
        expected_registry = (
            {value.source_id: value.identity_sha256 for value in identities}
            if identities is not None
            else None
        )
        coverage_rows = int(
            connection.execute("SELECT COUNT(*) FROM function_coverage").fetchone()[0]
        )
        function_rows = int(
            connection.execute("SELECT COUNT(*) FROM static_function").fetchone()[0]
        )
        bad_lifetimes = int(
            connection.execute(
                "SELECT COUNT(*) FROM region_instance WHERE end_sequence_exclusive IS NOT NULL "
                "AND end_sequence_exclusive<=first_sequence"
            ).fetchone()[0]
        )
        bad_placement_arithmetic = int(
            connection.execute(
                "SELECT COUNT(*) FROM placement WHERE byte_size<=0 "
                "OR source_z64_end_exclusive<=source_z64_start "
                "OR destination_physical_end_exclusive<=destination_physical_start "
                "OR destination_physical_end_exclusive>8388608"
            ).fetchone()[0]
        )
        bad_execution_claims = int(
            connection.execute(
                "SELECT COUNT(*) FROM runtime_execution WHERE execution_claim='observed' "
                "AND evidence_grade IN ('verified','supported') "
                "AND (function_id IS NULL OR z64_offset IS NULL OR mapping_status='unresolved')"
            ).fetchone()[0]
        )
        counted_sampled_as_execution = int(
            connection.execute(
                "SELECT COUNT(*) FROM function_coverage c WHERE c.exact_execution_count != "
                "(SELECT COUNT(*) FROM runtime_execution e WHERE e.function_id=c.function_id "
                "AND e.execution_claim='observed' "
                "AND e.evidence_grade IN ('verified','supported'))"
            ).fetchone()[0]
        )
        dynamic_adapters = {
            str(row[0])
            for row in connection.execute(
                "SELECT adapter_id FROM source_registry "
                "WHERE evidence_lanes_json IN ('[\"placement\"]','[\"runtime\"]')"
            )
        }
        coverage = coverage_report(connection)
        counts = _selected_counts(connection)
    finally:
        connection.close()

    summary_path = root.resolve() / "summary.json"
    coverage_path = root.resolve() / "coverage.json"
    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    stored_coverage = json.loads(coverage_path.read_text(encoding="utf-8"))
    checks = {
        "integrity": integrity == ["ok"],
        "foreignKeys": not foreign_keys,
        "schema": meta.get("schema") == RESOLVER_SCHEMA,
        "schemaVersion": schema_version == RESOLVER_SCHEMA_VERSION,
        "logicalHash": meta.get("logicalSha256") == logical,
        "summaryIdentity": summary.get("logicalSha256") == logical,
        "sourceIdentities": expected_registry is not None and registry == expected_registry,
        "coverageConservation": coverage_rows == function_rows,
        "coverageArtifact": stored_coverage == coverage,
        "regionLifetimes": bad_lifetimes == 0,
        "placementArithmetic": bad_placement_arithmetic == 0,
        "executionContext": bad_execution_claims == 0,
        "sampledIsNotExecution": counted_sampled_as_execution == 0,
        "cleanDynamicSources": dynamic_adapters
        == {"overlay-atlas-2", "runtime-provenance-2"},
    }
    return {
        "result": "PASS" if all(checks.values()) else "FAIL",
        "checks": checks,
        "logicalSha256": logical,
        "counts": counts,
    }


def verify_total_resolver(
    path: Path,
    *,
    source_paths: ResolverSourcePaths | None = None,
    expected_identities: Mapping[str, str] | None = None,
) -> dict[str, Any]:
    try:
        identities = validate_resolver_sources(
            source_paths or default_source_paths(),
            expected_identities=expected_identities,
        )
    except (OSError, sqlite3.Error, ValueError, json.JSONDecodeError) as exc:
        return {
            "result": "FAIL",
            "checks": {"sourceIdentities": False},
            "error": str(exc),
        }
    try:
        return _verify_database(path, identities=identities)
    except (OSError, sqlite3.Error, ValueError, json.JSONDecodeError) as exc:
        return {"result": "FAIL", "checks": {"database": False}, "error": str(exc)}
