"""Closed Phase 2 enums and normalized-record validation."""

from __future__ import annotations

from enum import Enum
from typing import Any, Mapping

from .addressing import AddressRange, AddressSpace


NORMALIZED_SCHEMA = "ob64-total-resolver-normalized-record.v1"


class EvidenceLane(str, Enum):
    STATIC = "static"
    PLACEMENT = "placement"
    RUNTIME = "runtime"
    FIELD = "field"
    RESOURCE = "resource"
    ANNOTATION = "annotation"


class EvidenceGrade(str, Enum):
    VERIFIED = "verified"
    SUPPORTED = "supported"
    CANDIDATE = "candidate"
    UNRESOLVED = "unresolved"


class ReviewState(str, Enum):
    LIVE_UNREVIEWED = "live-unreviewed"
    GENERATED_UNREVIEWED = "generated-unreviewed"
    REVIEW_PENDING = "review-pending"
    ACCEPTED_SOURCE = "accepted-source"
    HISTORICAL = "historical"
    REJECTED = "rejected"


class Disposition(str, Enum):
    COMPATIBLE = "compatible"
    CONFLICTING = "conflicting"
    UNRESOLVED = "unresolved"
    UNSUPPORTED = "unsupported"


class RegionClass(str, Enum):
    EXECUTABLE = "executable"
    DATA = "data"
    MIXED = "mixed"
    UNKNOWN = "unknown"


class CaptureMode(str, Enum):
    MANUAL_PLAY = "manual-play"
    FOCUSED_RESEARCH = "focused-research"
    RETROSPECTIVE_AUDIT = "retrospective-audit"
    AUTOMATED_EXPLORATION = "automated-exploration"


class InterventionPolicy(str, Enum):
    OBSERVATION_ONLY = "observation-only"
    EXPLICIT_CONTROL = "explicit-control"


RECORD_TYPES = frozenset(
    (
        "region-instance",
        "placement-observation",
        "execution-observation",
        "memory-access",
        "loader-event",
        "configuration",
        "transition",
        "unresolved-observation",
        "semantic-marker",
        "witness",
    )
)
NORMALIZED_KEYS = frozenset(
    (
        "schema",
        "recordId",
        "recordType",
        "sourceId",
        "sessionId",
        "sequence",
        "frame",
        "evidenceLane",
        "evidenceGrade",
        "reviewState",
        "disposition",
        "addresses",
        "relationships",
        "nativePayload",
    )
)
NORMALIZED_REQUIRED = frozenset(
    (
        "schema",
        "recordId",
        "recordType",
        "sourceId",
        "evidenceLane",
        "evidenceGrade",
        "reviewState",
        "disposition",
        "addresses",
        "nativePayload",
    )
)


def _enum_value(enum_type: type[Enum], value: Any, field: str) -> None:
    try:
        enum_type(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"invalid {field}: {value!r}") from exc


def validate_normalized_record(record: Mapping[str, Any]) -> None:
    unknown = set(record) - NORMALIZED_KEYS
    missing = NORMALIZED_REQUIRED - set(record)
    if unknown:
        raise ValueError("unknown normalized fields: " + ", ".join(sorted(unknown)))
    if missing:
        raise ValueError("missing normalized fields: " + ", ".join(sorted(missing)))
    if record["schema"] != NORMALIZED_SCHEMA:
        raise ValueError(f"unsupported normalized schema: {record['schema']!r}")
    if record["recordType"] not in RECORD_TYPES:
        raise ValueError(f"invalid recordType: {record['recordType']!r}")
    for key in ("recordId", "sourceId"):
        if not isinstance(record[key], str) or not record[key]:
            raise ValueError(f"{key} must be a nonempty string")
    _enum_value(EvidenceLane, record["evidenceLane"], "evidenceLane")
    _enum_value(EvidenceGrade, record["evidenceGrade"], "evidenceGrade")
    _enum_value(ReviewState, record["reviewState"], "reviewState")
    _enum_value(Disposition, record["disposition"], "disposition")

    addresses = record["addresses"]
    if not isinstance(addresses, list):
        raise ValueError("addresses must be an array")
    address_keys = {"space", "role", "start", "endExclusive", "contextId"}
    for index, address in enumerate(addresses):
        if not isinstance(address, Mapping):
            raise ValueError(f"addresses[{index}] must be an object")
        unknown_address = set(address) - address_keys
        required_address = {"space", "role", "start", "endExclusive"} - set(address)
        if unknown_address or required_address:
            raise ValueError(f"addresses[{index}] has invalid fields")
        try:
            space = AddressSpace(address["space"])
        except (TypeError, ValueError) as exc:
            raise ValueError(f"addresses[{index}] has invalid space") from exc
        if not isinstance(address["role"], str) or not address["role"]:
            raise ValueError(f"addresses[{index}] role must be nonempty")
        AddressRange(
            space,
            address["start"],
            address["endExclusive"],
            address.get("contextId"),
        )

    relationships = record.get("relationships", [])
    if not isinstance(relationships, list):
        raise ValueError("relationships must be an array")
    for index, relationship in enumerate(relationships):
        if not isinstance(relationship, Mapping):
            raise ValueError(f"relationships[{index}] must be an object")
        if set(relationship) != {"type", "target", "disposition"}:
            raise ValueError(f"relationships[{index}] has invalid fields")
        if not all(isinstance(relationship[key], str) and relationship[key] for key in ("type", "target")):
            raise ValueError(f"relationships[{index}] has an empty type or target")
        _enum_value(Disposition, relationship["disposition"], "relationship disposition")

    if not isinstance(record["nativePayload"], Mapping):
        raise ValueError("nativePayload must be an object")
