# Actor placement and mission-briefing integration

## November 17, 2026

The sole production integrator on `main` reports to Director `01a1eb8b-d5e6-7083-bb49-8e6648ef3e0b` on host `local`. The [Director cursor](director.md) confirms native message and stop delivery. The Director owns the watcher and dispatch decisions.

Captured [version 1 selected inputs](../../../build/actor-briefing-inputs-20261117/manifest.json) from verified CURRENT `081B815B15E33390CB26067C16891AAA20C32FB00415F9D963841A5E37018A8C`. Input set `4515AA07FA92D129114967900673D85D47FE8E3829B29F2DBF10F54BDE8C1F51`, manifest SHA-256 `50DC92369FBE14EB7E9A3DFA69B6349065BBC50993FFF5C280755A6471D36EF4`. Version 1 binds the existing live tools. Use `OB64_WORK_ROOT=C:/Users/Joe/.codex/ob64-descriptor-20261026` and prepend `.toolchains/node-v24.13.1-win-x64` to process-local `PATH`. Invoke that directory’s `node.exe` (SHA-256 `E3BE0545990C90995D7BF3A7AF5D64AF1F2E0FC1BBD9B79C27F7ABC1E9676E50`).

| Wave | Complete members and ROM intervals (end exclusive) | Private root |
| --- | --- | --- |
| A01 | `func_002A9364` (`2A9364..2A985C`, row 5466) | `build/matching/actor-20261117-a01` |
| A02 | `func_002AB0F8` (`2AB0F8..2AB2A8`, row 5478), `func_002ACFD8` (`2ACFD8..2AD224`, row 5498), `func_002AD224` (`2AD224..2AD420`, row 5499) | `build/matching/actor-20261117-a02` |
| M01 | `func_002B88C8` (`2B88C8..2B89B8`, row 5619), `func_002B867C` (`2B867C..2B88C8`, row 5618) | `build/matching/actor-20261117-m01` |

At intake the authenticated baseline had no active C producer for any of the six targets. Original assembly confirms A02 calls A01 at `2AB278`, `2AD1DC`, and `2AD3A4`. Preserve the eight-byte entry preambles at `2ACFD8` and `2AD224`, following the accepted [B02 owner](body-equipment-integration.md). The old `size=520` annotation at `2AD22C` includes the following 20-byte accessor. The real owner restores and returns through the delay slot at `2AD41C`, and the dispatch at `285250` independently calls the accessor at `2AD420`. The M01 wrapper calls the constructor at `2B8970`, and its final return delay slot ends at the executable boundary `2B89B8`.

All six targets returned `prepared` in the guarded complete-wave reports. These are source-independent diagnostic results. [A01](../../../build/actor-20261117-a01-preflight.json) · [A02](../../../build/actor-20261117-a02-preflight.json) · [M01](../../../build/actor-20261117-m01-preflight.json)

## A01 integration and A03 preparation

The [A01 initializer](../../../src/lib/func_002A9364.c) preserves the handed-off source with LF checkout formatting. The three active C callers declare the slot return and first six parameters as `s32`, and both flag parameters as `u8`. All four linked exactly with matching relocation contracts. A01 has 38 relocations. The recursive `R_MIPS_26` at `0x4A0` carries a zero `.text` addend and resolves to `0x80239C04`. [Focused diff](../../../build/diff/func_002A9364.json) · [Object evidence](../../../build/integration/actor-briefing/a01-object-evidence.json) · [Validated v17 control](../../dossiers/func_002A9364-1af26ba700.md)

The guarded A03 report covers both complete owners using the same manifest. `func_0020D870` (row 3919, 340 bytes) and `func_0020C120` (row 3881, 68 bytes) are both `prepared` in `build/matching/actor-20261117-a03`. [A03 preflight](../../../build/actor-20261117-a03-preflight.json)

A01 passed one fresh complete-wave verification as `PURE_C`. `objects/c/func_002A9364.o` solely owns `.ob64.r5466`. The 1,272 linked bytes, all relocations and the full Rev 0 ROM pass. CURRENT `99CC16F00A2BB5B15C50E9648DE9E758C2C7E9D454D1F454EDD27C54850D075D`. All three callers retain exact bytes and relocations. The staged checkout reproduced every accepted source and header identity. [A01 acceptance evidence](../../../build/integration/actor-briefing/a01-acceptance-evidence.json)

A02 is next on verified A01. All three A05 continuation targets passed guarded preparation on the original selected manifest. [A05 preflight](../../../build/actor-20261117-a05-preflight.json)
