# Combat selector publication correction R2

Completed: one statically published table state resolves six conditional targets, and none is the selector entry. This corrects CSOR1-F01 without closing selector provenance. The Director must route proportional re-review before using the new interpretation as accepted research.

## Identity and scope

Task: combat-selector-offline-provenance revision 2. Launch: COMBAT-SELECTOR-OFFLINE-PROVENANCE-20260907-02. Worker: /root/compilation_groups_design, Astra Medium, local. Director: /root, native task 01a07262-aeca-7341-ad10-2dba705ff988.

The complete fresh claim was created atomically at 2026-09-07T02:21:54.4738330-04:00 and read back before other writes. Starting checkout HEAD was 975409bc0fc2638ad1afb1ce2df225d652ffc75d. Accepted input baseline remains d70fd853fdffacf71290b24763e010a549276a55. W7 candidate sources and build inputs were excluded.

The frozen R1 subject is 2c6cf22815c5e9baa013364119e8e1aaedfb8cf7. The controlling review is 05d141dc62bced513cb6d3470cb724a526f621d7, finding CSOR1-F01. Neither frozen report nor accepted configuration was changed.

R2 supersedes R1's blanket no-compatible-mapping and no-discriminating-offline-experiment rationale. It adds the omitted loader, table and conditional target evidence. R1's bounded no-positive-selector conclusion, thirteen immediate-origin observations and remaining observation gate remain unchanged.

## Claims and evidence

| Claim | Evidence | Grade and limit |
|---|---|---|
| The publisher belongs to an accepted loader slab | Baseline conventional-build configuration and original loader instructions | Verified static placement; no observed load |
| The entry publishes the six-slot table root | Original entry words, ROM equality and accepted address translation | Verified static instruction chain |
| Six wrappers resolve to the six listed owners under that state | Original root/slot loads, JALRs, table words and manifest owner starts | Supported conditional resolution; review pending |
| Those slots do not directly contain the selector entry | Six exact RAM values compared with accepted selector placement | Verified equality test; no downstream exclusion |
| No positive selector consumer follows from this correction | The conditional table result plus preserved bounded observations | Supported assessment; review pending |

The independent task-local checker reads original bytes and accepted configuration. It does not execute the R1 checker or the reviewer checker. It authenticates every R1 input by its frozen manifest hash. This preserves the original observations and discovery limits without repeating their reference scans.

For new evidence, it compares configuration and original owners with baseline blobs, allowing only CRLF/LF normalization. It validates original owner words against the normalized ROM. It decodes the loader constants, entry call, publication store, wrapper slots and table values directly. Historical split-assembly RAM comments do not establish placement.

## Static publication chain

The accepted resource-loader-00213b10 slab has equal ROM and RAM lengths of 92,016 bytes. Its RAM-minus-ROM delta is 0x7FFBCD30.

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| Loader slab | Loaded code/data block; broader meaning unchanged | 0x00213B10..0x0022A280 | z64 ROM, end exclusive | Accepted source interval |
| Loaded slab | Same code/data block | 0x801D0840..0x801E6FB0 | RAM virtual, end exclusive | Accepted destination interval |
| Loader argument sequence | Constructs source, destination and length | 0x0004E65C..0x0004E678 | z64 ROM instruction offsets | Producer path |
| Entry call | Calls loaded slab entry | 0x0004E70C | z64 ROM instruction offset | Transfers to RAM 0x801D0840 |
| Publisher entry | Publishes callback table root; no stronger behavior name | 0x00213B10 / 0x801D0840 | z64 ROM / RAM virtual | Same entry under accepted mapping |
| Root word | Shared callback table pointer | 0x801D0810 | RAM virtual | Store destination and wrapper source |
| Published table | Six initial callback pointers | 0x801E5AA0 / 0x00228D70 | RAM virtual / z64 ROM | Exact compatible table mapping |
| Selector entry | Byte accessor; argument meaning unresolved | 0x801BE2E8 / 0x00201778 | RAM virtual / z64 ROM | Comparison target |

The loader constructs source 0x00213B10, destination 0x801D0840 and source end 0x0022A280. The DMA call uses word 0x0C027694. Its delay slot subtracts source start from source end with word 0x00C43023. The later entry call word 0x0C074210 decodes to RAM 0x801D0840.

At that entry, words 0x3C02801E and 0x24425AA0 construct RAM pointer 0x801E5AA0. Word 0x3C01801D supplies the root's upper address. After jr ra, delay-slot word 0xAC220810 stores the pointer at RAM 0x801D0810. This establishes a static publication path when the loader and entry execute successfully.

Subtracting the accepted slab delta maps the table pointer to z64 ROM 0x00228D70. The table owner table_00228d6c includes one preceding zero word and two trailing zero words. The six slots occupy ROM 0x00228D70 through 0x00228D84 inclusive. The neighboring zeros are not additional callback slots in this bounded result.

## All six conditional targets

Each wrapper reads RAM root 0x801D0810, then its assigned slot, before a JALR through v0. Each table value is nonzero. The table below applies only when that root and those slot contents retain the published state.

| Slot offset | Wrapper | JALR, z64 ROM | Table value, RAM virtual | Mapped owner start, z64 ROM | Exact owner |
|---|---|---|---|---|---|
| +00 | func_0020BCF4 | 0x0020BD18 | 0x801D85C4 | 0x0021B894 | func_0021B894 |
| +04 | func_0020BD2C | 0x0020BD48 | 0x801D92E0 | 0x0021C5B0 | func_0021C5B0 |
| +08 | func_0020BD5C | 0x0020BD78 | 0x801D202C | 0x002152FC | func_002152FC |
| +0C | func_0020BD8C | 0x0020BDA8 | 0x801DF9D8 | 0x00222CA8 | func_00222CA8 |
| +10 | func_0020BDCC | 0x0020BDE8 | 0x801DF404 | 0x002226D4 | func_002226D4 |
| +14 | func_0020BDFC | 0x0020BE1C | 0x801D0854 | 0x00213B24 | func_00213B24 |

Each target maps to one exact manifest owner start inside the same accepted slab. All six owners' original words match canonical ROM bytes. None of the six values equals selector RAM entry 0x801BE2E8. Resolving these destinations does not prove invocation of a wrapper, direct invocation of the selector, or absence of downstream indirect reachability.

## What remains unchanged

The original thirteen immediate-origin observations remain preserved by the R1 report and evidence identities below. Two sites load an object word; six load successive root-table slots. One site follows entry+0xC0 then object+0. One uses incoming a3 saved at stack+0x14. Three use incoming a3 saved at stack+0x7C. R2 refines only the six table cases under one published state.

The comparison callbacks test signed v0. The selector's return delay slot loads an unsigned byte. This weakens that lead without proving impossibility or non-use. No selector argument domain, valid bounds, table semantics or behavioral name is strengthened.

The first publisher's corrected pointer is RAM 0x801CFC74, not 0x801DFC74. Accepted descriptor-10 placement maps it to ROM 0x00213104. This correction independently checked that its six initial words are zero. Runtime slot writes remain possible.

The third publisher is at ROM 0x0023B220, beyond the accepted resource-loader-0022a280 endpoint. Its pointer, RAM 0x801EFCB0, only numerically maps to ROM 0x00232F80 under that different slab. The six words there begin 0x24140001 and 0x0C07BA7C and represent executable instructions. This overlap supplies no compatible placement for the third publisher and no accepted six-pointer table.

Accepted discovery R2 remains unchanged at subject 1f68aa001c612e2a7ce160e0cdf1d83a0c8b2048. Its bounded direct-transfer, original-ASM, literal, short-construction and decoded-corpus scan limits remain intact. No unrelated scan was repeated. The thirteen JALRs, twenty-four non-return JRs and other unresolved provenance routes remain bounded research obligations. The 244 saved signature placements remain residence evidence. Empty capture queries remain bounded misses; no database was opened.

Other publications, mutable table state, object fields, caller-supplied arguments, external owners, synthesized targets, relocated code and interior entry remain possible. No ordering of these alternatives follows. Non-use is possible but unproved. All Combat, shared and later family obligations remain intact. No matching count, family disposition or source acceptance changes.

## Remaining gate and falsifier

A qualifying record must identify the exact selector entry/signature and actual caller or transfer origin. It must retain compatible loaded code identity, a0/a1, initialized root/resource identity, addressed byte and resulting value. An indirect transfer needs the target register/value and its last definition or load. Tail or interior entry needs exact entry and register state. A pre-jr snapshot alone cannot establish the return value because lbu executes in its delay slot.

An existing qualified record could satisfy that gate. New capture requires separate authority and its existing prerequisites. No capture, setup, queue, ingestion or runtime operation is authorized here. Inputs must not be filtered to a guessed 0..2 domain.

A compatible selector-valued publication, caller argument chain or qualified invocation would overturn the bounded no-positive assessment. For this table state, an intervening root/slot write would invalidate applying the six conditional targets to an actual transfer. Those are precise discriminators; the former blanket no-offline-experiment rationale is withdrawn.

## Evidence identities and verification

| Artifact | SHA-256 |
|---|---|
| Frozen R1 report | A34489B86F4E3C424725D4E7451188CAB0E4AE1E4C789934509C0E2943D7A950 |
| Frozen R1 input-evidence.json | E07A2E4F2C7B15847C23DDD3F966E6F4175AFA567E1A06F015FE4820A18FA546 |
| Controlling review report | 2259F81AD79A60544E4021E3D09C05827FB9C62C1AC4A38DD3F5DC4FC2420CD4 |
| config/phase7/conventional-build.json | 72EECEB8CBCF25E00D4BC90F03E908714FDFFA1F2AFD72AF9ABABB4B4D75D2E1 |
| asm/original/rev0/manifest.json | EE6A81334FDCFC2867BC7AF63AD56624E08C6B92D992915A45B610B44D3FCF44 |
| config/overlays/us_rev0.json | D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6 |
| Loader original func_0004e448.s | 55607F37B28E96AC314F1A8EDE0D8E5ABE422844C13801F0F25C8B8E39AF0093 |
| Table original table_00228d6c.s | D2F5C27CCF493A9989DD786613AECB9393759D9489A53588D6F8B162E619CD45 |
| New ignored evidence.json | 342170CD6B1345F0E265E01B40AEB4445A98A25223653DE6F9E1D8B1D6A3EDBA |

The evidence package is build/combat-selector-offline-provenance-r2/. Its evidence.json contains 41 input records, including repeated reads, exact target owners and configuration excerpts. All six target-owner hashes and baseline blob hashes are included. It preserves the accepted discovery report/review and selector evidence hashes through the authenticated R1 input list.

Command: node build/combat-selector-offline-provenance-r2/check.js. Result: PASS, 2,063 assertions. Assertions include per-word equality; the count is not a research-coverage measure. Raw v64 SHA-256 is 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12. Normalized z64 SHA-256 is 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. Normalization occurred only in memory.

Initial broad text reads were truncated and replaced with focused reads. Read-only Git status reported inaccessible user-ignore/cache paths; no Git mutation occurred. A task-local syntax typo was corrected before the checker ran. No failed game hypothesis or production-tool failure occurred.

Only the fresh claim, this report and ignored check.js/evidence.json were written. Existing W7 config/header/source edits and disjoint review outputs were preserved. No compiler, linked diff, build, verifier, source-policy generator, runtime, GUI, bridge or database operation occurred. No agents, branches, worktrees, staging, commits or push occurred. Proposed canonical-document changes: none before review. All assigned writes are released at terminal handoff.
