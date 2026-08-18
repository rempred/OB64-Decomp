"""Explicit OB64 address-space types and the only safe generic conversions."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


RDRAM_SIZE = 0x00800000
KSEG0_START = 0x80000000
KSEG1_START = 0xA0000000
KSEG_END = 0xC0000000
PHYSICAL_MASK = 0x1FFFFFFF


class AddressSpace(str, Enum):
    Z64_ROM = "z64-rom"
    RAW_V64 = "raw-v64"
    NOMINAL_VRAM = "nominal-vram"
    PHYSICAL_RDRAM = "physical-rdram"
    LIVE_KSEG = "live-kseg"


@dataclass(frozen=True, order=True)
class AddressRange:
    space: AddressSpace
    start: int
    end_exclusive: int
    context_id: str | None = None

    def __post_init__(self) -> None:
        if isinstance(self.start, bool) or isinstance(self.end_exclusive, bool):
            raise ValueError("addresses must be integers")
        if self.start < 0 or self.end_exclusive <= self.start:
            raise ValueError("address range must be nonempty and nonnegative")
        if self.end_exclusive > 0x100000000:
            raise ValueError("address range exceeds the 32-bit address space")
        if self.space is AddressSpace.PHYSICAL_RDRAM and self.end_exclusive > RDRAM_SIZE:
            raise ValueError("physical RDRAM range exceeds 8 MiB")
        if self.space is AddressSpace.LIVE_KSEG:
            physical_from_live(self.start)
            physical_from_live(self.end_exclusive - 1)

    @property
    def size(self) -> int:
        return self.end_exclusive - self.start

    def to_dict(self, *, role: str) -> dict[str, int | str | None]:
        if not role:
            raise ValueError("address role must not be empty")
        return {
            "space": self.space.value,
            "role": role,
            "start": self.start,
            "endExclusive": self.end_exclusive,
            "contextId": self.context_id,
        }


def physical_from_live(address: int) -> int:
    if isinstance(address, bool) or not isinstance(address, int):
        raise ValueError("live address must be an integer")
    if not KSEG0_START <= address < KSEG_END:
        raise ValueError(f"address 0x{address:X} is not KSEG0/KSEG1")
    physical = address & PHYSICAL_MASK
    if physical >= RDRAM_SIZE:
        raise ValueError(f"live address 0x{address:X} is outside 8 MiB RDRAM")
    return physical


def live_kseg0_from_physical(address: int) -> int:
    if isinstance(address, bool) or not isinstance(address, int) or not 0 <= address < RDRAM_SIZE:
        raise ValueError("physical address must be inside 8 MiB RDRAM")
    return KSEG0_START + address


def live_kseg1_from_physical(address: int) -> int:
    if isinstance(address, bool) or not isinstance(address, int) or not 0 <= address < RDRAM_SIZE:
        raise ValueError("physical address must be inside 8 MiB RDRAM")
    return KSEG1_START + address


def physical_range_from_live(value: AddressRange) -> AddressRange:
    if value.space is not AddressSpace.LIVE_KSEG:
        raise ValueError("only a live-kseg range can be converted to physical RDRAM")
    start = physical_from_live(value.start)
    end_last = physical_from_live(value.end_exclusive - 1)
    if end_last < start:
        raise ValueError("live range crosses a KSEG alias boundary")
    return AddressRange(AddressSpace.PHYSICAL_RDRAM, start, end_last + 1, value.context_id)


def live_kseg0_range_from_physical(value: AddressRange) -> AddressRange:
    if value.space is not AddressSpace.PHYSICAL_RDRAM:
        raise ValueError("only a physical-rdram range can be converted to live KSEG0")
    return AddressRange(
        AddressSpace.LIVE_KSEG,
        live_kseg0_from_physical(value.start),
        live_kseg0_from_physical(value.end_exclusive - 1) + 1,
        value.context_id,
    )
