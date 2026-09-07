Completed: the pinned compiler source explains the allocation-order reversal between the two frozen compositor variants. The decisive change crosses a logarithmic reference-count threshold. This gives the W7 writer a supported explanation without prescribing artificial references or a source spelling sweep. Director intake is next; the sole W7 writer retains ordinary matching work.

Assignment: `COMBAT-COMPOSITING-PRIORITY-RULE-20260907-01`, revision 1. Worker: `/root/compilation_groups_design`, Astra Medium. Director: `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, local. Starting HEAD: `9f43f7a466f4443322bac37233aacd956da4e03b`. The complete claim was created atomically before evidence writes.

## Evidence identity and association

The frozen predecessor remains unchanged at `ece78915170d1b512689c5bf0de2b2fa4bec9f7b`:

- `docs/Plans/task-logs/combat-compositing-global-allocation-r1.md`: SHA256 `491BCAFA349A92319AFBE1F8A45184CDDDFED9542434E3C9193F6303EA02D80D`.
- `build/combat-compositing-global-allocation-r1/evidence.json`: SHA256 `15F98ADC28AAF30015952096BE2560AA2B6C23C89C899766EAB20627A0EF5865`.

All 38 predecessor input identities were rechecked. This includes both immutable compiler packages, their authored snapshots, and the original owner. Authored C and preprocessed compiler input remain separate identities. The retained diagnostic commands identify the compiler path and successful `-da` invocation. They are not immutable preprocessing receipts. No current shared compiler output was read.

The actor preparation points to the accepted allocator scheduler study. Its harness and retained report identify this compiler source directory:

`C:/Users/Joe/.codex/ob64-phase6-kmc-20260801/clean-d/source/mips-gcc-2.7.2`

Read-only Git checks returned commit `43d1cdb67ed135879869b5266f01efaaada5e35a` and tree `bbed133c38a1feffafe941c36b20d3b38ba47a33`. The upstream project is the licensed `decompals/mips-gcc-2.7.2` compiler. No external game decompilation source was used. Twelve inspected source/license files match their commit blobs after CRLF normalization. Their actual file hashes and distinct Git-blob hashes are retained in the new evidence. No source content difference was ignored.

The actual `global.c` SHA256 is `95DEB3368789E442D7FF0B7ACE55B712ED47512B1EB53384F07F4F794B8D38E5`. The actual `local-alloc.c` SHA256 is `DCCD6C6DFE4857552457578EB96A1E507EFD4BAC22DE627C9502CEC8B4605CE2`. The actual `flow.c` SHA256 is `4EB4B4B2388FDFC557ED93681CBB48C3B4B44667F6DA863EEA8ECF7AB8637679`.

The accepted reproduction manifest records that commit/tree and compiler executable SHA256 `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`. Its own SHA256 is `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26`, pinned by `config/phase7/conventional-build.json`. The retained `clean-d/bootstrap-result.json` independently records the same source and executable association. Its SHA256 is `67F92A13C607836C90DF877E93A8D1096F44DC9D4193986C12783D7D3B57E904`.

Both the source-directory `cc1.exe` and deployed `clean-d/toolchain/kmc-gcc-2.7.2/cc1.exe` currently match that executable hash. The scheduler study's retained report also binds that production binary to the same source. Its SHA256 remains `61B528A347219ADFE776A7CAB1CEABE4B76A7643BADF84F8676CE751FE2551D0`. Its six-case trace/compiler parity concerns other inputs, not these compositor variants.

This is an authenticated recorded source-to-binary association, stronger than a matching version string. This assignment did not reproduce the compiler build or trace its internal comparator. The binutils commit in `config/toolchain.json` is unrelated to compiler-source identity. An initial Git ownership rejection was resolved with per-invocation `safe.directory`; no Git configuration changed.

## Rule and frozen observations

An allocation unit, called an `allocno` in the source, can represent one or several pseudos. `global.c:417` sums member reference counts and takes their maximum live length. The global comparator at `global.c:587` computes:

```text
priority = truncate_to_int(
    (double(floor_log2(reference_count) * reference_count) / live_length)
    * 10000 * allocation_size)
```

Larger priorities sort first. Equal priorities sort by ascending allocation-unit number. The executed expression multiplies by allocation size; an earlier explanatory comment says division. This report follows the expression. Calls crossed, pointer status, user-variable status, and death counts are not direct comparator inputs.

`global.c:1647` explains the retained `greg` header. Shared members print with `+member`; sizes other than one print in parentheses. Each relevant header entry is a plain pseudo number. Thus every row below is an unshared, size-one allocation unit. No hidden member aggregation is needed here.

| Frozen package | Role / pseudo | References | Live length | floor_log2 | Integer priority |
|---|---|---:|---:|---:|---:|
| A: both-expansions | input / 84 | 31 | 215 | 4 | 5767 |
| A: both-expansions | inner alpha / 459 | 27 | 144 | 4 | 7500 |
| A: both-expansions | inner destination / 461 | 27 | 142 | 4 | 7605 |
| B: row-guard | input / 84 | 33 | 216 | 5 | 7638 |
| B: row-guard | inner alpha / 460 | 27 | 144 | 4 | 7500 |
| B: row-guard | inner destination / 462 | 27 | 142 | 4 | 7605 |

The inputs come from each package's `candidate.c.lreg`. The global header confirms destination → alpha → input for A, and input → destination → alpha for B. These are relative orders among the three pseudos, not adjacent positions in the complete allocation list. The offline calculation reproduces both orders exactly.

The reference-count change from 31 to 33 crosses `floor_log2` from 4 to 5. This explains the reversal despite the input's slightly longer live length. The reference metric is compiler bookkeeping, not a count of source expressions or runtime accesses. `flow.c` adds loop-depth weights for references. Local copy optimization can transfer these weights between pseudos. Therefore the extra two references do not establish two additional memory reads.

Frozen assembly observations remain distinct: A uses destination register 17, alpha register 18, and input register 19. B uses input register 17, destination register 18, and alpha register 19. The original owner uses destination 17, input 18, and alpha 19. Original machine registers do not recover the retail compiler's priority values or allocation history.

## User-variable copies and death counts

`REG_USERVAR_P`, defined in `rtl.h:499`, marks a register corresponding to a declared variable. The internal field named `volatil` does not make ordinary C variables volatile. Declaration lowering sets this marker. It does not introduce a global priority bonus.

Local copy optimization at `local-alloc.c:1008` dispatches based on register-copy shape and source death notes. Its dispatch does not reject copies merely because a pseudo represents a user variable. The non-dying-source case can shorten overlapping lifetimes by forwarding uses. The dying-source case recognizes a bounded copy-out/copy-back sequence. Those transformations update reference counts, live lengths or call counts, and death notes as applicable. A source-level copy therefore has no guaranteed separate allocation or lifetime.

The marker does matter in other passes. For example, loop strength reduction adjusts benefits for certain nonreplaceable user-variable induction values (`loop.c:3799`, `5521`). Pointer inference also treats user variables differently because their declared types already supply pointer information (`regclass.c:1807`). These source facts do not prove which condition controlled any untraced compositor copy. SourceRow copy/coalescing experiments remain outside this assignment.

The actual array is `reg_n_deaths`. Flow increments it when creating `REG_DEAD` notes and certain `REG_UNUSED` notes (`flow.c:2533`, `2101`). It counts static death sites, not execution frequency. Local copy optimization can decrement it when deleting death notes (`local-alloc.c:926`).

Local allocation generally requires one basic block and exactly one death, with additional register-class conditions (`local-alloc.c:472`). All six relevant frozen records say `dies in 0 places`; they still appear in the global allocation list. Zero does not imply an unused value or prohibit global allocation. It is not the denominator in the global priority formula.

## Boundary and delivery

The authenticated source rule and frozen numeric evidence explain the relative global order. They do not independently establish every chosen hard register. Classes, hard-register conflicts, copy preferences, allocation attempts, and reload remain relevant. No compositor internal allocator trace was created or inferred from the separate scheduler trace.

The two packages still contain multiple source changes. These scores do not isolate a row-state edit as their sole cause. This assignment recommends no dummy references, score manipulation, or source spelling sweep. It adds no compiler defect claim or accepted reusable workflow. Broader research would require separate routing.

Offline validation: `node build/combat-compositing-priority-rule-r1/inspect.js` passed. It authenticated 38 frozen inputs, 12 compiler files, recorded provenance, singleton/size-one dump entries, and both relative orders. Evidence: `build/combat-compositing-priority-rule-r1/evidence.json`, SHA256 `DE969AC7372A75F15B51167DA694926EB27CD7A0346CE956054D907D4EEA6FCD`.

Only the assigned claim, this report, and ignored evidence root were written. No compiler, candidate, build, verifier, runtime, database, production configuration, or source mutation occurred. No agents or Git mutations were used. Prior terminal records remain frozen. All writes are released at handoff. W7 acceptance remains its complete seven-member canonical verifier; this assistance adds no independent matching gate.
