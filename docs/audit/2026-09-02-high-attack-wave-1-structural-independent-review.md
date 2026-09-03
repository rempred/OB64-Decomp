# High Attack Battle Stream Wave 1 Structural Independent Review

Verdict: **Revision required**

Material result: the four ROM-evidence conclusions are supported, and the frozen commit preserves the exact current baseline and unrelated fail-closed protections. One reachable Phase 8 producer path is nevertheless incomplete: `func_0021C8DC` resolves to its intended 140-byte executable slice, but that result cannot pass the downstream owner census or layout writer.

Consequence: do not integrate frozen commit `7c8ff722b290e4a754effb969d7931aaa0d2d3cb` or release the six blocked functions to ordinary Matching-C work yet.

Director action: route finding `HABSW1-SR-F01` to a correction worker, then proportionally re-review the corrected split-row Phase 8 activation path and its affected fail-closed checks.

## Frozen subject and protocol

- Worktree: `C:\Users\Joe\Projects\OgreBattlel64\high-attack-wave-1-structural-audit`
- Branch: `codex/high-attack-wave-1-structural-audit`
- Frozen subject: `7c8ff722b290e4a754effb969d7931aaa0d2d3cb`
- Comparison base: `f47f757ef6492753aa61d889a6c4d334d7b1af96`
- Review level: Critical
- Launch: `HABSW1-SR-20260902-01`
- Workspace claim: `docs/Plans/task-logs/ob64-high-attack-wave1-structural-review-20260902-r1-HABSW1-SR-20260902-01.claim.json`
- Claim SHA-256: `9BFE13F6570E051DB38E32353773525F62C4974FBBCD5B40B0CF755C9E20525E`

Before the first review write, I independently confirmed the branch and exact frozen commit, a clean tracked worktree, absence of the assigned claim, and no competing workspace claim. The assigned claim was then created atomically with create-new semantics. All later checks retained the same `HEAD`; only reviewer-owned artifacts were added. I did not modify the frozen implementation, parent research repository, assembly owners, source classifications, Matching-C candidates, or linkage contracts.

I read the assigned decomp and parent-research material in the required order, used the worker report only as an index into referenced parent evidence, and inspected the complete frozen diff.

## Review method

The independent checks combined:

- direct instruction and byte inspection from the canonical normalized Rev 0 ROM and accepted assembly;
- independent reconstruction of the accepted Phase 7 placement model;
- a complete continuity calculation over the referenced resource-loader capture events;
- same-placement direct-control-flow and ROM-wide aligned-pointer scans;
- direct exercise of the real active-target resolver and Phase 8 comparison/layout consumers;
- current exact-ROM verification and focused positive and negative test suites.

Reviewer-owned generated evidence is under `build/reviewer/HABSW1-SR-20260902-01/`; it is ignored and is not part of the frozen implementation.

## Assigned claim decisions

| Claim | Independent result | Decision |
| --- | --- | --- |
| One loader-managed slab at ROM `0x00213B10..0x0022A280`, RAM `0x801D0840..0x801E6FB0` | Direct loader constants, exact length/delta, adjacent-load boundary, and a gapless 180-event capture all agree | Supported |
| `func_0021C8DC` has 140 executable bytes followed by eight non-executable alignment bytes | Return/delay slot, zero padding, next aligned entry, and same-slab control/pointer scans agree | Supported as a structural boundary |
| `func_0021D374` and `func_0021D3BC` form one logical multi-entry owner | Internal transfers and register continuity require both rows; the two-row contract is exact and gapless | Supported |
| `table_00229df0` is the 65-entry `func_0021CBC4` table plus four padding bytes, with same-slab cross-chunk ownership | Dispatch bound, load sequence, entries, hashes, xref, placement, and auxiliary resolver agree | Supported |

### 1. Loader-managed slab

`asm/original/rev0/lib/func_0004e448.s` directly materializes DMA source `0x00213B10`, destination `0x801D0840`, source end `0x0022A280`, and the matching cache ranges. The next load begins at source `0x0022A280` and destination `0x801E6FB0`. Both ROM and RAM extents are `0x16770`, with a constant mapping delta of `0x7FFBCD30`.

The referenced parent event stream, independently hashed as `E427C805FD32231911F4A41011D67B29294A490797E7E6CBBE1EA8469F020991`, contains 180 unique resource-loader transfers from event 758 through 937. Sorted by source, they have no ROM or RAM gaps, sum to `0x16770`, and end exactly at ROM `0x0022A280` and RAM `0x801E6FB0`. Every Wave 1 point reviewed here maps through that same slab.

The accepted model represents the slab with 178 complete rows, 3988 through 4165, without consuming either neighboring row.

### 2. `func_0021C8DC` boundary and padding

The accepted assembly contains executable words through the `jr $ra` at ROM `0x0021C960` and its delay-slot `nop` at `0x0021C964`. ROM `0x0021C968` and `0x0021C96C` are zero, and the next function begins at the 16-byte-aligned ROM address `0x0021C970`. This yields the reviewed split:

- `.ob64.r4033.s0`: ROM `0x0021C8DC..0x0021C968`, RAM `0x801D960C..0x801D9698`, 140 bytes, executable;
- `.ob64.r4033.s1`: ROM `0x0021C968..0x0021C970`, RAM `0x801D9698..0x801D96A0`, eight bytes, non-executable alignment padding.

No direct control transfer from an executable slice in `resource-loader-00213b10` enters either padding word, and no aligned ROM word points at either padding address. A ROM-wide numerical scan finds one branch to `0x801D969C` from overlay descriptor 7; it is a different placement that reuses the numerical RAM range and is not evidence of entry into this loader slab.

The new Phase 7 ELF-section and `PT_LOAD` execution-flag mutations reject making the padding executable. This evidence supports the structural split; it does not claim an original translation-unit boundary.

### 3. Logical multi-entry owner

The first row directly jumps to runtime `0x801DA0EC` (`func_0021D3BC`) and twice to runtime `0x801DA108`, an internal continuation in the second row. The first row loads `$t0`; the second row consumes it without defining it. This is a concrete cross-row register dependency, not merely adjacency.

The contract owns rows 4047 and 4048, ROM `0x0021D374..0x0021D450`, RAM `0x801DA0A4..0x801DA180`, with owner sizes 72 and 148 bytes and combined SHA-256 `AB19D70C50EA5601C0E23D7BF1435F32F9622E323C0E8C70F381BC0A9B7673D8`. Independent control and pointer scans found the expected internal entry points and no contradictory external materialized entry. Partial activation through `func_0021D3BC` is rejected.

### 4. `func_0021CBC4` switch table and auxiliary ownership

At ROM `0x0021CDF0`, `sltiu v0,v1,0x41` establishes 65 valid indices. The sequence at ROM `0x0021CE00..0x0021CE0C` materializes runtime `0x801E6B20`, loads a word, and jumps through it. The owner at ROM `0x00229DF0..0x00229EF8` contains 65 pointer words followed by one zero word. Every entry is aligned and lies inside the accepted `func_0021CBC4` executable extent; the entry range is `0x801D9B44..0x801D9E84`.

The linked bytes hash to `D88942BC72126CDB2EAC36D63BCF8B262C671FFFA53ADD17DEBAC7BB6A02D112`, and the reconstructed compiler-object addends hash to `B8C244F0C4F26E1576796A6E5309C3E951E433CAFDDE9FA15AC524B480599536`. The relevant parent xref record has one reader and no writer. The dispatcher is in chunk 33, the auxiliary owner is row 4158 in chunk 34, and both resolve to the same `resource-loader-00213b10` slab.

The generic resolver continues to require an exact non-executable tracked-assembly owner, exact placement, hashes, relocations, and same fixed placement. Its same-slab relaxation does not relax unrelated fixed-overlay, owner, execution, or auxiliary-section requirements.

## Generic Phase 7/8 judgment

The frozen commit remains fail-closed for the current baseline and for the reviewed negative mutations. The full audit rebuilt the canonical ROM exactly with SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. Focused tests rejected malformed slab ranges, overlap and treatment errors, ELF section and program-header execution drift, placement drift, multi-owner partial activation and contract drift, auxiliary owner/hash/relocation drift, preserved-tail drift, and unrelated source-to-object provenance drift.

The two-row Phase 8 structural fixture also rebuilt an exact ROM, so the existing generic multi-owner implementation remains intact. The defect below is an over-rejection in the new mixed executable/non-executable split-row path, not a weakening of unrelated protections.

## Blocking finding

### HABSW1-SR-F01

**Finding ID:** `HABSW1-SR-F01`

**Finding:** The intended 140-byte `func_0021C8DC` executable-slice owner cannot traverse the actual Phase 8 comparison and layout pipeline.

**Failed assigned claim or gate:** The generic Phase 7/8 implementation must support the reviewed structural result while remaining fail-closed, so that the frozen structural commit can be integrated and the blocked functions can return to ordinary Matching-C work. The static boundary portion of assigned claim 2 is supported; its intended future Phase 8 producer path is not.

**Frozen subject:** `7c8ff722b290e4a754effb969d7931aaa0d2d3cb`, specifically `tools/lib/active_targets.js` and `tools/lib/phase8_matching_c.js` as changed or consumed by the frozen implementation.

**Direct observation:** `resolveAcceptedRows(model, 'func_0021C8DC', ...)` returns one 140-byte owner for `.ob64.r4033.s0`, but records `logicalOffset = 0` and `logicalEnd = 148`. The target builder correctly derives `target.bytes = 140`. Passing that resolved target to the real linked-byte comparison rejects it with `raw linked-target owner census drift: func_0021C8DC`. Independently, the real layout writer rejects row 4033 because it has two slices, with `Phase 7 target layout row drift: func_0021C8DC .ob64.r4033.s0`.

**Reachable producer path:** An ordinary future activation adds an exact C source and minimal active target for `func_0021C8DC`. `loadActiveTargetModel` calls `resolveAcceptedRows`, derives the 140-byte target from its returned owner, and Phase 8 then calls the same comparison and layout code exercised by the reviewer fixture. No malformed external state or unsupported mutation is required.

**Material consequence:** Even exact 140-byte C cannot produce the required linked-target proof or Phase 8 layout/provenance record. The frozen change therefore does not yet deliver its stated path for replacing only the executable slice while preserving the eight-byte assembly padding. Integrating it as complete would return at least this target to a workflow that deterministically rejects it before exact-ROM acceptance can be established.

**Supporting evidence:**

- `tools/lib/active_targets.js:590` sets the slice owner's `logicalEnd` to the whole row byte count.
- `tools/lib/active_targets.js:945` and `:988` derive the activated target byte count from owner bytes, yielding 140.
- `tools/lib/phase8_matching_c.js:238-254` requires the owner census to end at `target.bytes` and each logical extent to equal its owner bytes.
- `tools/lib/phase8_matching_c.js:1703-1710` rejects any target layout row whose slice count is not one.
- `tests/active_targets.js:83-94` verifies the 140-byte owner but does not assert its logical end or pass it to the downstream consumers.
- `build/reviewer/HABSW1-SR-20260902-01/independent-checks.json` records the actual resolved values and both downstream failures.

**Smallest correction boundary:** Correct the split-row active-owner logical extent and the Phase 8 row/slice ownership and layout/provenance handling needed to preserve `.ob64.r4033.s1` as assembly-owned non-executable padding while `.ob64.r4033.s0` is C-owned. Add a focused end-to-end activation regression that feeds the real split-row resolver result through compilation/linking, fallback pruning, comparison, layout, map/ELF ownership checks, and exact-ROM verification. Retain the existing negative execution, placement, source-policy, auxiliary, and unrelated-owner checks. No assembly rewrite, source-class change, semantic naming, or `func_0021CBC4` linkage activation belongs in this correction.

## Mutation admissibility record for HABSW1-SR-F01

1. **Claim or gate:** the reviewed split row must be consumable by ordinary Phase 8 Matching-C activation while all exactness and ownership gates remain enforced.
2. **Supported producer path:** the normal minimal-target activation path for an exact `func_0021C8DC` C candidate.
3. **Ordinary sequence:** active-target resolution, compile/object proof, fallback pruning, link, linked-byte comparison, layout/provenance generation, and full verifier.
4. **Material consequence:** the intended target is unconditionally rejected, so the structural work cannot yet serve its stated downstream dependency.
5. **Smallest falsifier:** use the frozen resolver's real owner record as the target consumed by the frozen comparison and layout functions.
6. **Threat-model fit:** this is a static owner/provenance and placement-contract check; it requires no out-of-scope runtime or semantic claim.
7. **Acceptance test:** an exact 140-byte C fixture must own only `.ob64.r4033.s0`; the original assembly must remain the sole owner of `.ob64.r4033.s1`; the linked ROM must be exact; and mutations of either slice's owner, execution flags, placement, bytes, or provenance must be rejected.

## Verification record

| Check | Result |
| --- | --- |
| `node tests/load_slab_00087200.js` | Pass; legacy slab protections unchanged |
| `node tests/active_targets.js` | Pass; current resolver and Wave 1 negative checks reject their covered mutations |
| `node tests/phase7_conventional_build.js --output <review baseline phase7>` | Pass; conventional build exact and structural/ELF mutations rejected |
| `node tests/phase8_matching_c.js --output <current phase8 build>` | Pass; current baseline and Phase 8 mutation suite remain fail-closed |
| `node tests/multi_owner_phase8.js` | Pass; two-row `HYBRID_C` structural fixture exact, canonical Matching-C status unaffected |
| `node tools/audit.js` | Pass; structural audit and current exact-ROM verification complete |
| Reviewer `independent_checks.js` | Reproduced all four claim calculations and both `func_0021C8DC` downstream failures |
| `git diff --check f47f757e..7c8ff722` | Pass |

The audit report completed at `2026-09-02T20:43:15.969Z` with 500 current proof targets, 439 `PURE_C`, 61 `HYBRID_C`, zero unknown source classifications, zero compiler-assembly rewrites, and three auxiliary sections.

## Evidence limits and disposition

- The loader result is directly derivable from the loader and independently corroborated by the referenced runtime capture; no Total Resolver evidence was imported.
- The `func_0021C8DC` boundary is a structural classification. It does not establish original source authorship or semantic intent.
- The multi-entry conclusion is limited to machine-code owner structure and does not strengthen function names.
- The table conclusion is limited to dispatch structure and exact auxiliary ownership; no behavioral name is assigned.
- No Matching-C candidate was activated or assessed for code quality or semantic correctness.

Preserve the supported ROM-evidence conclusions unless the correction changes their representation. Re-review `HABSW1-SR-F01` and all directly affected Phase 8 owner, placement, execution, and provenance negatives after correction; rerun the full exact audit before integration.
