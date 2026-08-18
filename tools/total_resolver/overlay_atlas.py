"""Deterministic Overlay Atlas 2.0 generation from whole-session products."""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
import sqlite3
from typing import Any, Iterable, Mapping, Sequence

from .capture_db import canonical_json
from .derive_session import SESSION_PRODUCT_SCHEMA
from .derive_transition import default_static_database, _write_json, _write_ndjson
from .inventory import repository_root, sha256_file
from .static_model import StaticModel


ATLAS_SCHEMA = "ob64-overlay-atlas-2.v1"
ATLAS_SCHEMA_VERSION = 1
LOGICAL_TABLES = (
    "source_session",
    "placement",
    "placement_witness",
    "slab_member",
    "function_placement",
    "function_placement_witness",
    "region_instance",
    "destination_reuse",
    "destination_reuse_member",
    "unresolved_observation",
    "static_function_coverage",
)


@dataclass(frozen=True)
class SessionProduct:
    root: Path
    summary: Mapping[str, Any]
    summary_sha256: str
    transactions: tuple[Mapping[str, Any], ...]
    regions: tuple[Mapping[str, Any], ...]
    slabs: tuple[Mapping[str, Any], ...]
    functions: tuple[Mapping[str, Any], ...]
    unresolved: tuple[Mapping[str, Any], ...]

    @property
    def session_id(self) -> str:
        return str(self.summary["sessionId"])


def atlas_products_root(explicit: Path | None = None) -> Path:
    return (
        explicit
        or repository_root() / "build" / "total-resolver" / "products" / "overlay-atlas-2"
    ).resolve()


def overlay_schema_path() -> Path:
    return Path(__file__).resolve().parent / "schemas" / "overlay_atlas.sql"


def _read_ndjson(path: Path) -> tuple[Mapping[str, Any], ...]:
    values: list[Mapping[str, Any]] = []
    with path.open("r", encoding="utf-8") as stream:
        for line_number, line in enumerate(stream, 1):
            if not line.strip():
                continue
            try:
                value = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"invalid NDJSON at {path}:{line_number}") from exc
            if not isinstance(value, dict):
                raise ValueError(f"NDJSON row is not an object at {path}:{line_number}")
            values.append(value)
    return tuple(values)


def load_session_product(path: Path) -> SessionProduct:
    root = path.resolve()
    summary_path = root / "summary.json"
    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    if not isinstance(summary, dict) or summary.get("schema") != SESSION_PRODUCT_SCHEMA:
        raise ValueError(f"not a whole-session Total Resolver product: {root}")
    files = summary.get("files")
    if not isinstance(files, Mapping):
        raise ValueError(f"session product omits its file map: {root}")

    def rows(name: str) -> tuple[Mapping[str, Any], ...]:
        relative = files.get(name)
        if not isinstance(relative, str):
            raise ValueError(f"session product omits {name}: {root}")
        return _read_ndjson(root / relative)

    return SessionProduct(
        root,
        summary,
        sha256_file(summary_path),
        rows("transactions"),
        rows("regions"),
        rows("codeSlabs"),
        rows("functionPlacements"),
        rows("unresolved"),
    )


def _stable_id(prefix: str, value: Mapping[str, Any]) -> str:
    digest = hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest().upper()
    return f"{prefix}:{digest}"


def _logical_hash(connection: sqlite3.Connection) -> str:
    digest = hashlib.sha256()
    for table in LOGICAL_TABLES:
        columns = [str(row[1]) for row in connection.execute(f"PRAGMA table_info({table})")]
        order = ", ".join(columns)
        rows = connection.execute(f"SELECT * FROM {table} ORDER BY {order}").fetchall()
        payload = canonical_json(
            {
                "table": table,
                "columns": columns,
                "rows": [list(row) for row in rows],
            }
        ).encode("utf-8")
        digest.update(len(payload).to_bytes(8, "big"))
        digest.update(payload)
    return digest.hexdigest().upper()


def _evidence_grade(transaction: Mapping[str, Any]) -> str:
    good = (
        transaction.get("pairingStatus") == "matched"
        and transaction.get("contentHashValid") is True
    )
    if good and transaction.get("romMatch") == "exact-span":
        return "verified"
    if good and transaction.get("romMatchedPrefixLength", 0) > 0:
        return "supported"
    return "unresolved"


def _placement_key_from_transaction(value: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "schema": "ob64-overlay-atlas-placement-key.v1",
        "kind": "rom-dma",
        "sourceZ64Start": int(value["sourceZ64Start"]),
        "sourceZ64EndExclusive": int(value["sourceZ64Start"])
        + int(value["capturedByteLength"]),
        "destinationPhysicalStart": int(value["destinationPhysicalStart"]),
        "destinationPhysicalEndExclusive": int(value["destinationTransferEndExclusive"]),
        "contentSha256": str(value["destinationContentSha256"]),
        "regionClass": str(value["staticRegionClass"]),
    }


def _placement_key_from_slab(value: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "schema": "ob64-overlay-atlas-placement-key.v1",
        "kind": "code-slab",
        "sourceZ64Start": int(value["sourceZ64Start"]),
        "sourceZ64EndExclusive": int(value["sourceZ64EndExclusive"]),
        "destinationPhysicalStart": int(value["destinationPhysicalStart"]),
        "destinationPhysicalEndExclusive": int(value["destinationPhysicalEndExclusive"]),
        "contentSha256": str(value["contentSha256"]),
        "regionClass": str(value["staticRegionClass"]),
    }


def _insert_all(
    connection: sqlite3.Connection,
    table: str,
    columns: Sequence[str],
    rows: Iterable[Sequence[Any]],
) -> None:
    placeholders = ",".join("?" for _ in columns)
    connection.executemany(
        f"INSERT INTO {table}({','.join(columns)}) VALUES({placeholders})",
        rows,
    )


def build_overlay_atlas(
    session_product_paths: Sequence[Path],
    *,
    output_directory: Path | None = None,
    static_database: Path | None = None,
) -> dict[str, Any]:
    if not session_product_paths:
        raise ValueError("at least one session product is required")
    products = sorted(
        (load_session_product(path) for path in session_product_paths),
        key=lambda item: item.session_id,
    )
    ids = [item.session_id for item in products]
    if len(ids) != len(set(ids)):
        raise ValueError("Overlay Atlas inputs contain duplicate session IDs")
    static = StaticModel(static_database or default_static_database())

    placements: dict[str, dict[str, Any]] = {}
    placement_witnesses: list[dict[str, Any]] = []
    witness_transience: dict[str, list[bool]] = defaultdict(list)
    transaction_placement: dict[tuple[str, str], str] = {}
    slab_placement: dict[tuple[str, str], str] = {}
    slab_members: set[tuple[str, str, int]] = set()
    function_placements: dict[str, dict[str, Any]] = {}
    function_witnesses: list[dict[str, Any]] = []
    region_rows: list[dict[str, Any]] = []
    unresolved_rows: list[dict[str, Any]] = []

    for product in products:
        transient_by_loader: dict[str, list[bool]] = defaultdict(list)
        for region in product.regions:
            loader = region.get("sourceLoaderEventId")
            if isinstance(loader, str):
                transient_by_loader[loader].append(
                    region.get("transientAtMostTwoFrames") is True
                )

        for transaction in product.transactions:
            key = _placement_key_from_transaction(transaction)
            placement_id = _stable_id("placement", key)
            local_id = str(transaction["transactionId"])
            transaction_placement[(product.session_id, local_id)] = placement_id
            transience = transient_by_loader.get(local_id, [])
            witness_transience[placement_id].append(bool(transience and all(transience)))
            placements.setdefault(
                placement_id,
                {
                    "placementId": placement_id,
                    "placementKind": "rom-dma",
                    "sourceZ64Start": key["sourceZ64Start"],
                    "sourceZ64EndExclusive": key["sourceZ64EndExclusive"],
                    "destinationPhysicalStart": key["destinationPhysicalStart"],
                    "destinationPhysicalEndExclusive": key[
                        "destinationPhysicalEndExclusive"
                    ],
                    "contentSha256": key["contentSha256"],
                    "byteSize": int(transaction["capturedByteLength"]),
                    "mappingDelta": key["destinationPhysicalStart"]
                    - key["sourceZ64Start"],
                    "regionClass": key["regionClass"],
                    "evidenceGrade": _evidence_grade(transaction),
                    "mappingMethod": "ordered-rom-dma-with-event-time-destination-bytes",
                },
            )
            placement_witnesses.append(
                {
                    "placementId": placement_id,
                    "sessionId": product.session_id,
                    "localWitnessId": local_id,
                    "firstSequence": int(transaction["entrySequence"]),
                    "lastSequence": int(transaction["completionSequence"]),
                    "firstFrame": transaction.get("frame"),
                    "lastFrame": transaction.get("frame"),
                }
            )

        for slab in product.slabs:
            key = _placement_key_from_slab(slab)
            placement_id = _stable_id("placement", key)
            local_id = str(slab["codeSlabId"])
            slab_placement[(product.session_id, local_id)] = placement_id
            witness_transience[placement_id].append(False)
            placements.setdefault(
                placement_id,
                {
                    "placementId": placement_id,
                    "placementKind": "code-slab",
                    "sourceZ64Start": key["sourceZ64Start"],
                    "sourceZ64EndExclusive": key["sourceZ64EndExclusive"],
                    "destinationPhysicalStart": key["destinationPhysicalStart"],
                    "destinationPhysicalEndExclusive": key[
                        "destinationPhysicalEndExclusive"
                    ],
                    "contentSha256": key["contentSha256"],
                    "byteSize": int(slab["byteSize"]),
                    "mappingDelta": int(slab["mappingDeltaPhysicalMinusZ64"]),
                    "regionClass": key["regionClass"],
                    "evidenceGrade": "verified",
                    "mappingMethod": str(slab["mappingMethod"]),
                },
            )
            placement_witnesses.append(
                {
                    "placementId": placement_id,
                    "sessionId": product.session_id,
                    "localWitnessId": local_id,
                    "firstSequence": int(slab["firstCompletionSequence"]),
                    "lastSequence": int(slab["lastCompletionSequence"]),
                    "firstFrame": slab.get("firstFrame"),
                    "lastFrame": slab.get("lastFrame"),
                }
            )
            transaction_ids = slab.get("transactionIds")
            if not isinstance(transaction_ids, list):
                transaction_ids = [
                    str(value["transactionId"])
                    for value in product.transactions
                    if int(slab["firstCompletionSequence"])
                    <= int(value["completionSequence"])
                    <= int(slab["lastCompletionSequence"])
                    and int(slab["sourceZ64Start"])
                    <= int(value["sourceZ64Start"])
                    < int(slab["sourceZ64EndExclusive"])
                ]
            for ordinal, transaction_id in enumerate(transaction_ids):
                member = transaction_placement.get(
                    (product.session_id, str(transaction_id))
                )
                if member is not None:
                    slab_members.add((placement_id, member, ordinal))

        for function in product.functions:
            local_slab = function.get("codeSlabId")
            stable_slab = slab_placement.get((product.session_id, str(local_slab)))
            if stable_slab is None:
                continue
            native = function["function"]
            key = {
                "schema": "ob64-overlay-atlas-function-placement-key.v1",
                "slabPlacementId": stable_slab,
                "functionId": int(native["functionId"]),
                "sourceZ64Start": int(native["z64Start"]),
                "sourceZ64EndExclusive": int(native["z64EndExclusive"]),
                "destinationPhysicalStart": int(function["destinationPhysicalStart"]),
                "destinationPhysicalEndExclusive": int(
                    function["destinationPhysicalEndExclusive"]
                ),
            }
            function_placement_id = _stable_id("function-placement", key)
            function_placements.setdefault(
                function_placement_id,
                {
                    "functionPlacementId": function_placement_id,
                    "slabPlacementId": stable_slab,
                    "functionId": key["functionId"],
                    "structuralName": str(native["structuralName"]),
                    "displayName": str(native["displayName"]),
                    "sourceZ64Start": key["sourceZ64Start"],
                    "sourceZ64EndExclusive": key["sourceZ64EndExclusive"],
                    "destinationPhysicalStart": key["destinationPhysicalStart"],
                    "destinationPhysicalEndExclusive": key[
                        "destinationPhysicalEndExclusive"
                    ],
                    "confidence": str(native["confidence"]),
                    "mappingMethod": str(function["mappingMethod"]),
                },
            )
            function_witnesses.append(
                {
                    "functionPlacementId": function_placement_id,
                    "sessionId": product.session_id,
                    "localPlacementId": str(function["placementId"]),
                    "firstSequence": int(function["firstCompletionSequence"]),
                    "lastSequence": int(function["lastCompletionSequence"]),
                    "firstFrame": function.get("firstFrame"),
                    "lastFrame": function.get("lastFrame"),
                }
            )

        transaction_by_local = {
            str(value["transactionId"]): value for value in product.transactions
        }
        for region in product.regions:
            local_loader = region.get("sourceLoaderEventId")
            placement_id = transaction_placement.get(
                (product.session_id, str(local_loader))
            )
            transaction = transaction_by_local.get(str(local_loader))
            if placement_id is not None and transaction is not None:
                exact_region = bool(
                    int(region["destinationPhysicalStart"])
                    == int(transaction["destinationPhysicalStart"])
                    and int(region["destinationPhysicalEndExclusive"])
                    == int(transaction["destinationTransferEndExclusive"])
                    and str(region["contentSha256"])
                    == str(transaction["destinationContentSha256"])
                )
                if not exact_region:
                    placement_id = None
            region_rows.append(
                {
                    "atlasRegionInstanceId": (
                        f"{product.session_id}:{region['regionInstanceId']}"
                    ),
                    "sessionId": product.session_id,
                    "localRegionInstanceId": str(region["regionInstanceId"]),
                    "placementId": placement_id,
                    **region,
                }
            )

        for ordinal, value in enumerate(product.unresolved, 1):
            local_id = str(value.get("unresolvedId") or f"unresolved:{ordinal:08d}")
            unresolved_rows.append(
                {
                    "atlasUnresolvedId": f"{product.session_id}:{local_id}",
                    "sessionId": product.session_id,
                    "localUnresolvedId": local_id,
                    "kind": str(value.get("kind") or "unknown"),
                    "sequence": value.get("sequence"),
                    "frame": value.get("frame"),
                    "payloadJson": canonical_json(value),
                }
            )

    placement_witness_count: dict[str, int] = defaultdict(int)
    for witness in placement_witnesses:
        placement_witness_count[witness["placementId"]] += 1
    function_witness_count: dict[str, int] = defaultdict(int)
    for witness in function_witnesses:
        function_witness_count[witness["functionPlacementId"]] += 1

    destination_groups: dict[tuple[int, int], list[str]] = defaultdict(list)
    for placement_id, value in placements.items():
        if value["placementKind"] == "rom-dma":
            destination_groups[
                (
                    value["destinationPhysicalStart"],
                    value["destinationPhysicalEndExclusive"],
                )
            ].append(placement_id)
    reuse_rows: list[dict[str, Any]] = []
    reuse_members: list[tuple[str, str]] = []
    for destination, members in sorted(destination_groups.items()):
        unique_members = sorted(set(members))
        if len(unique_members) <= 1:
            continue
        contents = {placements[item]["contentSha256"] for item in unique_members}
        key = {
            "schema": "ob64-overlay-atlas-destination-reuse-key.v1",
            "destinationPhysicalStart": destination[0],
            "destinationPhysicalEndExclusive": destination[1],
        }
        reuse_id = _stable_id("destination-reuse", key)
        reuse_rows.append(
            {
                "reuseId": reuse_id,
                "destinationPhysicalStart": destination[0],
                "destinationPhysicalEndExclusive": destination[1],
                "placementCount": len(unique_members),
                "distinctContentCount": len(contents),
                "ambiguityKind": (
                    "content-reuse" if len(contents) > 1 else "source-provenance-reuse"
                ),
            }
        )
        reuse_members.extend((reuse_id, member) for member in unique_members)

    function_placement_counts: dict[int, set[str]] = defaultdict(set)
    function_witness_counts: dict[int, int] = defaultdict(int)
    for placement_id, value in function_placements.items():
        function_id = int(value["functionId"])
        function_placement_counts[function_id].add(placement_id)
        function_witness_counts[function_id] += function_witness_count[placement_id]

    destination = atlas_products_root(output_directory)
    destination.mkdir(parents=True, exist_ok=True)
    database = destination / "overlay-atlas.sqlite"
    temporary = database.with_name(database.name + ".tmp")
    if temporary.exists():
        temporary.unlink()
    connection = sqlite3.connect(temporary)
    try:
        connection.executescript(overlay_schema_path().read_text(encoding="utf-8"))
        _insert_all(
            connection,
            "source_session",
            (
                "session_id",
                "raw_manifest_sha256",
                "session_product_summary_sha256",
                "bridge_version",
                "closure_status",
                "continuity_status",
                "working_evidence_quality",
            ),
            (
                (
                    item.session_id,
                    item.summary["rawSession"].get("manifestSha256"),
                    item.summary_sha256,
                    item.summary["rawSession"]["bridgeVersion"],
                    item.summary["rawSession"]["closureStatus"],
                    item.summary["rawSession"]["continuityStatus"],
                    item.summary["workingEvidenceQuality"],
                )
                for item in products
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
            (
                (
                    value["placementId"],
                    value["placementKind"],
                    value["sourceZ64Start"],
                    value["sourceZ64EndExclusive"],
                    value["destinationPhysicalStart"],
                    value["destinationPhysicalEndExclusive"],
                    value["contentSha256"],
                    value["byteSize"],
                    value["mappingDelta"],
                    value["regionClass"],
                    value["evidenceGrade"],
                    value["mappingMethod"],
                    int(bool(witness_transience[value["placementId"]]) and all(witness_transience[value["placementId"]])),
                    placement_witness_count[value["placementId"]],
                )
                for value in sorted(placements.values(), key=lambda item: item["placementId"])
            ),
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
            (
                (
                    item["placementId"],
                    item["sessionId"],
                    item["localWitnessId"],
                    item["firstSequence"],
                    item["lastSequence"],
                    item["firstFrame"],
                    item["lastFrame"],
                )
                for item in sorted(
                    placement_witnesses,
                    key=lambda value: (
                        value["placementId"], value["sessionId"], value["localWitnessId"]
                    ),
                )
            ),
        )
        _insert_all(
            connection,
            "slab_member",
            ("slab_placement_id", "member_placement_id", "ordinal"),
            sorted(slab_members),
        )
        _insert_all(
            connection,
            "function_placement",
            (
                "function_placement_id",
                "slab_placement_id",
                "function_id",
                "structural_name",
                "display_name",
                "source_z64_start",
                "source_z64_end_exclusive",
                "destination_physical_start",
                "destination_physical_end_exclusive",
                "confidence",
                "mapping_method",
                "witness_count",
            ),
            (
                (
                    value["functionPlacementId"],
                    value["slabPlacementId"],
                    value["functionId"],
                    value["structuralName"],
                    value["displayName"],
                    value["sourceZ64Start"],
                    value["sourceZ64EndExclusive"],
                    value["destinationPhysicalStart"],
                    value["destinationPhysicalEndExclusive"],
                    value["confidence"],
                    value["mappingMethod"],
                    function_witness_count[value["functionPlacementId"]],
                )
                for value in sorted(
                    function_placements.values(), key=lambda item: item["functionPlacementId"]
                )
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
            (
                (
                    item["functionPlacementId"],
                    item["sessionId"],
                    item["localPlacementId"],
                    item["firstSequence"],
                    item["lastSequence"],
                    item["firstFrame"],
                    item["lastFrame"],
                )
                for item in sorted(
                    function_witnesses,
                    key=lambda value: (
                        value["functionPlacementId"],
                        value["sessionId"],
                        value["localPlacementId"],
                    ),
                )
            ),
        )
        _insert_all(
            connection,
            "region_instance",
            (
                "atlas_region_instance_id",
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
            (
                (
                    item["atlasRegionInstanceId"],
                    item["sessionId"],
                    item["localRegionInstanceId"],
                    item["placementId"],
                    item["destinationPhysicalStart"],
                    item["destinationPhysicalEndExclusive"],
                    item["contentSha256"],
                    item["firstSequence"],
                    item["endSequenceExclusive"],
                    item["firstFrame"],
                    item["lastObservedFrame"],
                    item["closureReason"],
                    item["regionClass"],
                    item["evidenceGrade"],
                    item["sourceKind"],
                    item["sourceIdentity"],
                    int(item["transientAtMostTwoFrames"] is True),
                )
                for item in sorted(region_rows, key=lambda value: value["atlasRegionInstanceId"])
            ),
        )
        _insert_all(
            connection,
            "destination_reuse",
            (
                "reuse_id",
                "destination_physical_start",
                "destination_physical_end_exclusive",
                "placement_count",
                "distinct_content_count",
                "ambiguity_kind",
            ),
            (
                (
                    item["reuseId"],
                    item["destinationPhysicalStart"],
                    item["destinationPhysicalEndExclusive"],
                    item["placementCount"],
                    item["distinctContentCount"],
                    item["ambiguityKind"],
                )
                for item in reuse_rows
            ),
        )
        _insert_all(
            connection,
            "destination_reuse_member",
            ("reuse_id", "placement_id"),
            sorted(reuse_members),
        )
        _insert_all(
            connection,
            "unresolved_observation",
            (
                "atlas_unresolved_id",
                "session_id",
                "local_unresolved_id",
                "kind",
                "sequence",
                "frame",
                "payload_json",
            ),
            (
                (
                    item["atlasUnresolvedId"],
                    item["sessionId"],
                    item["localUnresolvedId"],
                    item["kind"],
                    item["sequence"],
                    item["frame"],
                    item["payloadJson"],
                )
                for item in sorted(
                    unresolved_rows, key=lambda value: value["atlasUnresolvedId"]
                )
            ),
        )
        _insert_all(
            connection,
            "static_function_coverage",
            (
                "function_id",
                "structural_name",
                "source_z64_start",
                "source_z64_end_exclusive",
                "placement_count",
                "witness_count",
                "observed",
            ),
            (
                (
                    function.function_id,
                    function.structural_name,
                    function.rom_start,
                    function.rom_end_exclusive,
                    len(function_placement_counts[function.function_id]),
                    function_witness_counts[function.function_id],
                    int(bool(function_placement_counts[function.function_id])),
                )
                for function in static.functions
            ),
        )
        logical_sha256 = _logical_hash(connection)
        connection.executemany(
            "INSERT INTO meta(key,value) VALUES(?,?)",
            (
                ("schema", ATLAS_SCHEMA),
                ("schemaVersion", str(ATLAS_SCHEMA_VERSION)),
                ("logicalSha256", logical_sha256),
            ),
        )
        connection.commit()
        connection.execute("VACUUM")
    finally:
        connection.close()
    temporary.replace(database)

    observed_functions = sum(bool(value) for value in function_placement_counts.values())
    summary = {
        "schema": ATLAS_SCHEMA,
        "schemaVersion": ATLAS_SCHEMA_VERSION,
        "logicalSha256": logical_sha256,
        "sourceSessions": [
            {
                "sessionId": item.session_id,
                "summarySha256": item.summary_sha256,
                "rawManifestSha256": item.summary["rawSession"].get("manifestSha256"),
            }
            for item in products
        ],
        "counts": {
            "sourceSessions": len(products),
            "placements": len(placements),
            "romDmaPlacements": sum(
                item["placementKind"] == "rom-dma" for item in placements.values()
            ),
            "codeSlabPlacements": sum(
                item["placementKind"] == "code-slab" for item in placements.values()
            ),
            "placementWitnesses": len(placement_witnesses),
            "functionPlacements": len(function_placements),
            "functionPlacementWitnesses": len(function_witnesses),
            "regionInstances": len(region_rows),
            "transientOnlyPlacements": sum(
                bool(witness_transience[item]) and all(witness_transience[item])
                for item in placements
            ),
            "destinationReuseRanges": len(reuse_rows),
            "unresolvedObservations": len(unresolved_rows),
            "staticFunctions": len(static.functions),
            "staticFunctionsObservedPlaced": observed_functions,
        },
        "files": {
            "database": "overlay-atlas.sqlite",
            "transientOnly": "transient-only.ndjson",
            "destinationReuse": "destination-reuse.ndjson",
            "coverage": "coverage.json",
        },
        "reviewState": "generated-unreviewed",
        "claimLimit": (
            "placements and lifetimes derive only from declared session products; residency is not execution"
        ),
    }
    transient_records = [
        {
            **value,
            "witnessCount": placement_witness_count[placement_id],
        }
        for placement_id, value in sorted(placements.items())
        if witness_transience[placement_id] and all(witness_transience[placement_id])
    ]
    coverage = {
        "schema": "ob64-overlay-atlas-2-coverage.v1",
        "staticFunctionCount": len(static.functions),
        "observedPlacedFunctionCount": observed_functions,
        "unobservedFunctionCount": len(static.functions) - observed_functions,
        "observedPercent": (
            0.0 if not static.functions else observed_functions * 100.0 / len(static.functions)
        ),
    }
    _write_ndjson(destination / "transient-only.ndjson", transient_records)
    _write_ndjson(destination / "destination-reuse.ndjson", reuse_rows)
    _write_json(destination / "coverage.json", coverage)
    _write_json(destination / "summary.json", summary)
    verification = verify_overlay_atlas(destination)
    return {
        "result": "PASS" if verification["result"] == "PASS" else "FAIL",
        "productDirectory": str(destination),
        "database": str(database),
        "logicalSha256": logical_sha256,
        "counts": summary["counts"],
        "verification": verification,
    }


def verify_overlay_atlas(path: Path) -> dict[str, Any]:
    root = path.resolve()
    database = root / "overlay-atlas.sqlite"
    connection = sqlite3.connect(f"file:{database.as_posix()}?mode=ro", uri=True)
    try:
        connection.execute("PRAGMA foreign_keys = ON")
        integrity = [row[0] for row in connection.execute("PRAGMA integrity_check")]
        foreign_keys = connection.execute("PRAGMA foreign_key_check").fetchall()
        meta = dict(connection.execute("SELECT key,value FROM meta"))
        logical = _logical_hash(connection)
        schema_version = int(connection.execute("PRAGMA user_version").fetchone()[0])
        counts = {
            table: int(connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0])
            for table in LOGICAL_TABLES
        }
    finally:
        connection.close()
    checks = {
        "integrity": integrity == ["ok"],
        "foreignKeys": not foreign_keys,
        "schema": meta.get("schema") == ATLAS_SCHEMA,
        "schemaVersion": schema_version == ATLAS_SCHEMA_VERSION,
        "logicalHash": meta.get("logicalSha256") == logical,
    }
    return {
        "result": "PASS" if all(checks.values()) else "FAIL",
        "checks": checks,
        "logicalSha256": logical,
        "counts": counts,
    }
