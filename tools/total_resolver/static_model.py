"""Read-only crosswalks from accepted static products into live capture space."""

from __future__ import annotations

from bisect import bisect_left, bisect_right
from dataclasses import dataclass
from pathlib import Path
import sqlite3
from typing import Any


@dataclass(frozen=True)
class StaticFunction:
    function_id: int
    structural_name: str
    display_name: str
    rom_start: int
    rom_end_exclusive: int
    confidence: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "functionId": self.function_id,
            "structuralName": self.structural_name,
            "displayName": self.display_name,
            "z64Start": self.rom_start,
            "z64EndExclusive": self.rom_end_exclusive,
            "confidence": self.confidence,
        }


@dataclass(frozen=True)
class ClassifiedRange:
    start: int
    end_exclusive: int
    classification: str


@dataclass(frozen=True)
class ResourceRange:
    entity_kind: str
    entity_id: str
    start: int
    end_exclusive: int
    disposition: str
    evidence_grade: str
    label: str | None = None

    def overlap_dict(self, start: int, end_exclusive: int) -> dict[str, Any]:
        return {
            "entityKind": self.entity_kind,
            "entityId": self.entity_id,
            "label": self.label,
            "z64Start": self.start,
            "z64EndExclusive": self.end_exclusive,
            "overlapStart": max(start, self.start),
            "overlapEndExclusive": min(end_exclusive, self.end_exclusive),
            "disposition": self.disposition,
            "evidenceGrade": self.evidence_grade,
        }


class StaticModel:
    """Small in-memory range index over Static DB R3 and the resource atlas."""

    def __init__(
        self,
        static_database: Path,
        resource_database: Path | None = None,
    ) -> None:
        self.static_database = static_database.resolve()
        self.resource_database = resource_database.resolve() if resource_database else None
        if not self.static_database.is_file():
            raise FileNotFoundError(self.static_database)
        if self.resource_database is not None and not self.resource_database.is_file():
            raise FileNotFoundError(self.resource_database)
        self.functions = self._load_functions()
        self._function_starts = [item.rom_start for item in self.functions]
        self.classified_ranges = self._load_classified_ranges()
        self.resource_ranges = self._load_resource_ranges()
        self._resource_starts = [item.start for item in self.resource_ranges]
        self._pc_cache: dict[int, StaticFunction | None] = {}
        self._pc_rom_cache: dict[int, int | None] = {}
        self._nominal_pc_index_loaded = False

    @staticmethod
    def _connect(path: Path) -> sqlite3.Connection:
        connection = sqlite3.connect(f"file:{path.as_posix()}?mode=ro", uri=True)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA query_only = ON")
        return connection

    def _load_functions(self) -> tuple[StaticFunction, ...]:
        connection = self._connect(self.static_database)
        try:
            rows = connection.execute(
                """
                SELECT function_id, structural_name, display_name,
                       rom_start, rom_end_exclusive, confidence
                FROM logical_function
                ORDER BY rom_start, rom_end_exclusive, function_id
                """
            ).fetchall()
        finally:
            connection.close()
        return tuple(
            StaticFunction(
                int(row[0]), str(row[1]), str(row[2]), int(row[3]), int(row[4]), str(row[5])
            )
            for row in rows
        )

    def _load_classified_ranges(self) -> tuple[ClassifiedRange, ...]:
        connection = self._connect(self.static_database)
        try:
            rows = connection.execute(
                """
                SELECT p.rom_start, p.rom_end_exclusive, c.class
                FROM source_part p
                JOIN part_classification c ON c.part_id=p.part_id
                ORDER BY p.rom_start, p.rom_end_exclusive, p.part_id
                """
            ).fetchall()
        finally:
            connection.close()
        return tuple(ClassifiedRange(int(row[0]), int(row[1]), str(row[2])) for row in rows)

    def _load_resource_ranges(self) -> tuple[ResourceRange, ...]:
        if self.resource_database is None:
            return ()
        connection = self._connect(self.resource_database)
        try:
            rows: list[ResourceRange] = []
            queries = (
                (
                    "container",
                    """
                    SELECT container_id, COALESCE(payload_z64_start, z64_start),
                           COALESCE(payload_z64_end_exclusive, z64_end_exclusive),
                           disposition, evidence_grade, resource_id
                    FROM container
                    WHERE disposition <> 'rejected'
                      AND COALESCE(payload_z64_start, z64_start) IS NOT NULL
                      AND COALESCE(payload_z64_end_exclusive, z64_end_exclusive) IS NOT NULL
                    """,
                ),
                (
                    "catalog-entry",
                    """
                    SELECT catalog_id, z64_start, z64_end_exclusive,
                           disposition, evidence_grade, filename
                    FROM catalog_entry
                    WHERE disposition <> 'rejected'
                      AND z64_start IS NOT NULL AND z64_end_exclusive IS NOT NULL
                    """,
                ),
                (
                    "chain-stage",
                    """
                    SELECT stage_id, z64_start, z64_end_exclusive,
                           disposition, evidence_grade, descriptor
                    FROM chain_stage
                    WHERE disposition <> 'rejected'
                      AND z64_start IS NOT NULL AND z64_end_exclusive IS NOT NULL
                    """,
                ),
                (
                    "table-binding",
                    """
                    SELECT binding_id, z64_start, z64_end_exclusive,
                           disposition, evidence_grade, logical_key
                    FROM table_binding
                    WHERE disposition <> 'rejected'
                      AND z64_start IS NOT NULL AND z64_end_exclusive IS NOT NULL
                    """,
                ),
            )
            for kind, query in queries:
                for row in connection.execute(query):
                    rows.append(
                        ResourceRange(
                            kind,
                            str(row[0]),
                            int(row[1]),
                            int(row[2]),
                            str(row[3]),
                            str(row[4]),
                            None if row[5] is None else str(row[5]),
                        )
                    )
        finally:
            connection.close()
        return tuple(
            sorted(
                rows,
                key=lambda item: (
                    item.start,
                    item.end_exclusive,
                    item.entity_kind,
                    item.entity_id,
                ),
            )
        )

    def resolve_nominal_pc(self, live_pc: int) -> StaticFunction | None:
        cached = self._pc_cache.get(live_pc)
        if live_pc in self._pc_cache:
            return cached
        if self._nominal_pc_index_loaded:
            return None
        connection = self._connect(self.static_database)
        try:
            rows = connection.execute(
                """
                SELECT DISTINCT f.function_id, f.structural_name, f.display_name,
                                f.rom_start, f.rom_end_exclusive, f.confidence
                FROM word w
                JOIN instruction i ON i.rom_address=w.rom_address
                JOIN logical_function f ON f.function_id=i.function_id
                WHERE w.nominal_linear_vram=?
                """,
                (live_pc,),
            ).fetchall()
        finally:
            connection.close()
        if len(rows) != 1:
            result = None
        else:
            row = rows[0]
            result = StaticFunction(
                int(row[0]), str(row[1]), str(row[2]), int(row[3]), int(row[4]), str(row[5])
            )
        self._pc_cache[live_pc] = result
        return result

    def preload_nominal_pc_index(self) -> None:
        """Load the nominal-PC crosswalk once for bulk ordered derivation."""

        if self._nominal_pc_index_loaded:
            return
        functions_by_id = {item.function_id: item for item in self.functions}
        connection = self._connect(self.static_database)
        try:
            rows = connection.execute(
                """
                SELECT DISTINCT w.nominal_linear_vram, w.rom_address, i.function_id
                FROM word w
                JOIN instruction i ON i.rom_address=w.rom_address
                JOIN logical_function f ON f.function_id=i.function_id
                ORDER BY w.nominal_linear_vram, i.function_id
                """
            )
            for row in rows:
                live_pc = int(row[0])
                rom_offset = int(row[1])
                function = functions_by_id[int(row[2])]
                if live_pc not in self._pc_cache:
                    self._pc_cache[live_pc] = function
                elif self._pc_cache[live_pc] != function:
                    self._pc_cache[live_pc] = None
                if live_pc not in self._pc_rom_cache:
                    self._pc_rom_cache[live_pc] = rom_offset
                elif self._pc_rom_cache[live_pc] != rom_offset:
                    self._pc_rom_cache[live_pc] = None
        finally:
            connection.close()
        self._nominal_pc_index_loaded = True

    def resolve_nominal_rom_offset(self, live_pc: int) -> int | None:
        if live_pc in self._pc_rom_cache:
            return self._pc_rom_cache[live_pc]
        if self._nominal_pc_index_loaded:
            return None
        connection = self._connect(self.static_database)
        try:
            rows = connection.execute(
                "SELECT DISTINCT rom_address FROM word WHERE nominal_linear_vram=?",
                (live_pc,),
            ).fetchall()
        finally:
            connection.close()
        result = int(rows[0][0]) if len(rows) == 1 else None
        self._pc_rom_cache[live_pc] = result
        return result

    def functions_fully_within(self, start: int, end_exclusive: int) -> tuple[StaticFunction, ...]:
        index = bisect_left(self._function_starts, start)
        matches: list[StaticFunction] = []
        for function in self.functions[index:]:
            if function.rom_start >= end_exclusive:
                break
            if function.rom_end_exclusive <= end_exclusive:
                matches.append(function)
        return tuple(matches)

    def function_containing(self, rom_offset: int) -> StaticFunction | None:
        index = bisect_right(self._function_starts, rom_offset) - 1
        if index < 0:
            return None
        function = self.functions[index]
        return function if rom_offset < function.rom_end_exclusive else None

    def classify_range(self, start: int, end_exclusive: int) -> str:
        """Return executable/data/mixed/unknown only when static parts cover the range."""

        if end_exclusive <= start:
            return "unknown"
        clipped = [
            (max(start, item.start), min(end_exclusive, item.end_exclusive), item.classification)
            for item in self.classified_ranges
            if item.start < end_exclusive and item.end_exclusive > start
        ]
        if not clipped:
            return "unknown"
        cursor = start
        classes: set[str] = set()
        for left, right, classification in sorted(clipped):
            if left > cursor:
                return "unknown"
            cursor = max(cursor, right)
            classes.add(classification)
            if cursor >= end_exclusive:
                break
        if cursor < end_exclusive:
            return "unknown"
        if classes == {"code"}:
            return "executable"
        if classes == {"data"}:
            return "data"
        return "mixed"

    def resources_overlapping(
        self,
        start: int,
        end_exclusive: int,
        *,
        limit: int = 16,
    ) -> tuple[dict[str, Any], ...]:
        stop = bisect_left(self._resource_starts, end_exclusive)
        matches = [
            item
            for item in self.resource_ranges[:stop]
            if item.end_exclusive > start
        ]
        matches.sort(
            key=lambda item: (
                0 if item.disposition == "accepted" else 1,
                item.end_exclusive - item.start,
                item.entity_kind,
                item.entity_id,
            )
        )
        return tuple(item.overlap_dict(start, end_exclusive) for item in matches[:limit])
