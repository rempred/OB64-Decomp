"""Deterministic temporal region tracking with explicit split/replace output."""

from __future__ import annotations

from bisect import bisect_left
from dataclasses import dataclass, replace
import hashlib
from typing import Iterable

from .addressing import RDRAM_SIZE
from .configuration import ConfigurationRegion
from .contracts import EvidenceGrade, RegionClass


@dataclass(frozen=True)
class TrackedRegion:
    region_instance_id: str
    physical_start: int
    data: bytes
    first_sequence: int
    first_frame: int | None
    region_class: RegionClass
    evidence_grade: EvidenceGrade
    source_kind: str
    source_identity: str | None
    loader_event_id: str | None
    parent_region_instance_id: str | None = None
    end_sequence_exclusive: int | None = None
    last_observed_sequence: int | None = None
    last_observed_frame: int | None = None
    closure_reason: str | None = None

    @property
    def physical_end_exclusive(self) -> int:
        return self.physical_start + len(self.data)

    @property
    def content_sha256(self) -> str:
        return hashlib.sha256(self.data).hexdigest().upper()

    @property
    def active(self) -> bool:
        return self.end_sequence_exclusive is None

    def configuration_region(self) -> ConfigurationRegion:
        return ConfigurationRegion(
            region_class=self.region_class,
            physical_start=self.physical_start,
            physical_end_exclusive=self.physical_end_exclusive,
            content_sha256=self.content_sha256,
            source_kind=self.source_kind,
            source_identity=self.source_identity,
            loader_identity=self.loader_event_id,
        )


@dataclass(frozen=True)
class RegionChange:
    created: tuple[TrackedRegion, ...]
    closed: tuple[TrackedRegion, ...]


class RegionTracker:
    def __init__(self, session_id: str) -> None:
        if not session_id:
            raise ValueError("session_id must not be empty")
        self.session_id = session_id
        self._counter = 0
        self._active: list[TrackedRegion] = []
        self._active_starts: list[int] = []
        self._history: list[TrackedRegion] = []
        self._last_sequence = 0
        self._last_frame: int | None = None

    @property
    def active_regions(self) -> tuple[TrackedRegion, ...]:
        return tuple(self._active)

    @property
    def history(self) -> tuple[TrackedRegion, ...]:
        return tuple(self._history)

    def _next_id(self) -> str:
        self._counter += 1
        return f"{self.session_id}:region:{self._counter:08d}"

    def _new_region(
        self,
        *,
        physical_start: int,
        data: bytes,
        sequence: int,
        frame: int | None,
        region_class: RegionClass,
        evidence_grade: EvidenceGrade,
        source_kind: str,
        source_identity: str | None,
        loader_event_id: str | None,
        parent_region_instance_id: str | None = None,
    ) -> TrackedRegion:
        return TrackedRegion(
            region_instance_id=self._next_id(),
            physical_start=physical_start,
            data=bytes(data),
            first_sequence=sequence,
            first_frame=frame,
            region_class=region_class,
            evidence_grade=evidence_grade,
            source_kind=source_kind,
            source_identity=source_identity,
            loader_event_id=loader_event_id,
            parent_region_instance_id=parent_region_instance_id,
        )

    def observe_load(
        self,
        *,
        physical_start: int,
        data: bytes,
        sequence: int,
        frame: int | None,
        region_class: RegionClass = RegionClass.UNKNOWN,
        evidence_grade: EvidenceGrade = EvidenceGrade.CANDIDATE,
        source_kind: str = "unknown",
        source_identity: str | None = None,
        loader_event_id: str | None = None,
    ) -> RegionChange:
        if sequence <= self._last_sequence:
            raise ValueError("region observations require strictly increasing sequence numbers")
        if not data:
            raise ValueError("region observation data must not be empty")
        physical_end = physical_start + len(data)
        if not 0 <= physical_start < physical_end <= RDRAM_SIZE:
            raise ValueError("region observation must fit in vanilla OB64's 4 MiB RDRAM")

        created: list[TrackedRegion] = []
        closed: list[TrackedRegion] = []
        previous_sequence = self._last_sequence or None
        previous_frame = self._last_frame

        overlap_start_index = bisect_left(self._active_starts, physical_start)
        if (
            overlap_start_index > 0
            and self._active[overlap_start_index - 1].physical_end_exclusive
            > physical_start
        ):
            overlap_start_index -= 1
        overlap_end_index = bisect_left(
            self._active_starts, physical_end, lo=overlap_start_index
        )
        overlapping = self._active[overlap_start_index:overlap_end_index]
        replacement_regions: list[TrackedRegion] = []

        for old in overlapping:
            overlap_start = max(old.physical_start, physical_start)
            overlap_end = min(old.physical_end_exclusive, physical_end)

            partial = overlap_start > old.physical_start or overlap_end < old.physical_end_exclusive
            old_closed = replace(
                old,
                end_sequence_exclusive=sequence,
                last_observed_sequence=previous_sequence,
                last_observed_frame=previous_frame,
                closure_reason="partial-overlap-split" if partial else "replaced",
            )
            closed.append(old_closed)
            self._history.append(old_closed)

            if old.physical_start < overlap_start:
                left_size = overlap_start - old.physical_start
                left = self._new_region(
                    physical_start=old.physical_start,
                    data=old.data[:left_size],
                    sequence=sequence,
                    frame=frame,
                    region_class=old.region_class,
                    evidence_grade=old.evidence_grade,
                    source_kind=old.source_kind,
                    source_identity=old.source_identity,
                    loader_event_id=old.loader_event_id,
                    parent_region_instance_id=old.region_instance_id,
                )
                replacement_regions.append(left)
                created.append(left)

            if overlap_end < old.physical_end_exclusive:
                right_offset = overlap_end - old.physical_start
                right = self._new_region(
                    physical_start=overlap_end,
                    data=old.data[right_offset:],
                    sequence=sequence,
                    frame=frame,
                    region_class=old.region_class,
                    evidence_grade=old.evidence_grade,
                    source_kind=old.source_kind,
                    source_identity=old.source_identity,
                    loader_event_id=old.loader_event_id,
                    parent_region_instance_id=old.region_instance_id,
                )
                replacement_regions.append(right)
                created.append(right)

        new_region = self._new_region(
            physical_start=physical_start,
            data=data,
            sequence=sequence,
            frame=frame,
            region_class=region_class,
            evidence_grade=evidence_grade,
            source_kind=source_kind,
            source_identity=source_identity,
            loader_event_id=loader_event_id,
        )
        replacement_regions.append(new_region)
        created.append(new_region)
        replacement_regions.sort(key=lambda region: region.physical_start)
        self._assert_nonoverlap(replacement_regions)
        if (
            overlap_start_index > 0
            and self._active[overlap_start_index - 1].physical_end_exclusive
            > replacement_regions[0].physical_start
        ):
            raise AssertionError("active region tracker state overlaps its left neighbor")
        if (
            overlap_end_index < len(self._active)
            and replacement_regions[-1].physical_end_exclusive
            > self._active[overlap_end_index].physical_start
        ):
            raise AssertionError("active region tracker state overlaps its right neighbor")
        self._active[overlap_start_index:overlap_end_index] = replacement_regions
        self._active_starts[overlap_start_index:overlap_end_index] = [
            region.physical_start for region in replacement_regions
        ]
        self._last_sequence = sequence
        self._last_frame = frame
        return RegionChange(tuple(created), tuple(closed))

    def close_all(
        self,
        *,
        sequence: int,
        frame: int | None,
        reason: str = "session-end",
    ) -> tuple[TrackedRegion, ...]:
        if sequence <= self._last_sequence:
            raise ValueError("region closure requires a later sequence")
        if reason not in {"session-end", "continuity-break", "explicit-unload", "unknown"}:
            raise ValueError(f"unsupported region closure reason: {reason}")
        closed = tuple(
            replace(
                region,
                end_sequence_exclusive=sequence,
                last_observed_sequence=self._last_sequence or None,
                last_observed_frame=self._last_frame,
                closure_reason=reason,
            )
            for region in self._active
        )
        self._history.extend(closed)
        self._active = []
        self._active_starts = []
        self._last_sequence = sequence
        self._last_frame = frame
        return closed

    def configuration_regions(self) -> tuple[ConfigurationRegion, ...]:
        return tuple(region.configuration_region() for region in self.active_regions)

    @staticmethod
    def _assert_nonoverlap(regions: Iterable[TrackedRegion]) -> None:
        previous_end = 0
        for region in regions:
            if region.physical_start < previous_end:
                raise AssertionError("active region tracker state overlaps")
            previous_end = region.physical_end_exclusive
