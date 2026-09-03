# Task Log and Final Report — High Attack Battle Stream Wave 1 Matching C

- Assignment: `ob64-high-attack-wave1-matching-20260903`
- Revision: 1
- Role: primary Matching-C worker
- Director task: `01a04998-5492-7e62-aba5-9901250a123e`
- Worktree: `C:\Users\Joe\Projects\OgreBattlel64\high-attack-wave-1`
- Branch: `codex/high-attack-wave-1`
- Original Wave 1 base: `2489dabf2e2e9677990c7b2ebb691c0c73559065`
- Required continuation HEAD: `2de3e527c279862aff72ef55a71a19acd529488b`
- Exact implementation HEAD before this report commit: `f3263747fed2ca13d69e3e82fe8f5ee93ac9b37d`

## Entry gate

The continuation began on the assigned path and branch at exactly
`2de3e527c279862aff72ef55a71a19acd529488b`. `git status --short --branch` was
clean and `node tools/match.js doctor` passed. No merge, rebase, branch change,
new worktree, or push was performed.

## Recovered family model

The action stream begins at context offset `0x10`. The shared context stores the
current stream cursor at `+0x810`, stream length at `+0x814`, and the current
record owner/actor byte at `+0x818`. Each ordinary record begins with type,
owner, and delay bytes at record offsets `+0`, `+1`, and `+2`. Ordinary record
widths come from the byte table at `0x801E5C70`; type `0x16` uses
`record[3] + 4`, and type `0x38` uses `record[3]`. The advance, previous-record,
time-to-offset, cursor-seek, insertion, arity-wrapper, and removal operations all
use that same layout.

Large insertion delays are serialized as three-byte type-`0x1E` records with a
`0xFF` delay before the requested record. Removal shifts all following bytes
left by the selected record width, reduces `+0x814`, and transfers the removed
record's adjustment byte to the new record at the same offset.

## Function results

Every assigned Wave 1 function is exact `PURE_C`. `func_0021D374` and
`func_0021D3BC` are the accepted two-row, one-translation-unit owner; the second
row is not an independent C ABI function.

| Function | Accepted executable bytes | Result | Linked target SHA-256 | Exact commit |
|---|---:|---|---|---|
| `func_0021C8DC` | 140 | `PURE_C` exact | `58A0D8F0D763A659AC0E489FC9F6F117B2C628496F07F7E42F37304B59EAB19C` | `83282ee24326852d75822fb06d53417d8eb20078` |
| `func_0021C970` | 168 | `PURE_C` exact | `C9029C7148EF80018DF307541334537C09E867803FE78B0E19F96561F409CF2F` | `1db94f1f7453d7147156d102e99b9cf1a8c8d900` |
| `func_0021CA18` | 112 | `PURE_C` exact | `EA1E86DB3F7F8997835C11A3EA3F6D8FFD3CB6543E16FAFCA019CE901B1CC73D` | `a034c47d111fb9d3518d68ff5f59a34ee5429acf` |
| `func_0021CA88` | 168 | `PURE_C` exact | `A0B177F501446386B44EA8112BA901392403ABBC1A381EDB76EF4D5A60BF05F4` | `e8f16c9a887cf9ad77cea21f26372c71c7307796` |
| `func_0021CB30` | 148 | `PURE_C` exact | `0D34174C8658884FD27EB6C1820AAD2B974ABB077FF3A8B4E43DC776C9C4AB65` | `07b50da5a44820c8a898cefd3d936d9d82d1d8a9` |
| `func_0021CBC4` | 1,544 | `PURE_C` exact | `C23EE76D6C89A2B8468FFDA0D01528FCA747E77DE7095D1DBC8406D7D40D20A5` | `f3263747fed2ca13d69e3e82fe8f5ee93ac9b37d` |
| `func_0021D1CC` | 52 | `PURE_C` exact | `3B2E72C370E430EF579E393EEE3CC225C3FC50AA673F680CA6067C12C8FFE8F8` | `d5ad11737af4228adb1bafb066386746d72a1830` |
| `func_0021D200` | 48 | `PURE_C` exact | `E87F2F10E270B1B7AE47883D331216A07F03FB8E1238E61586AC1701861B7547` | `f7998352c97ab3a1a8aa5dc6f4f707bcfb44c5d9` |
| `func_0021D230` | 44 | `PURE_C` exact | `FDF5F0898B98A4E7E4AC350E8582ECEBE8A74AA5747CC147887AE3F84DE2A8D7` | `7cc4ed9967d4a0ad93991873d21342429227b44a` |
| `func_0021D25C` | 48 | `PURE_C` exact | `EAF743D5B6FD38FC0355A2B48289BB02ADCA2AD94170DB0F32F9DE0FA360F048` | `3c0bc7deac662fda9225db02157fe289d1e02b46` |
| `func_0021D28C` | 52 | `PURE_C` exact | `92C270EE99C28D1421770931774591C8FC03F6A3815A5E8A5D0952AB1CBAC9E6` | `e4e149bb3c175cbce5f81722e1848b774b980d7a` |
| `func_0021D2C0` | 56 | `PURE_C` exact | `061A6316302D88644F7F3AB4BDDD701D1A7A15F3D072F9964BB9FD05AA3F4878` | `5aedb0655695e519061c899777d477fc64ca1b82` |
| `func_0021D2F8` | 60 | `PURE_C` exact | `40CDD07961A2027C166928E4AEDE17AC52D2D9146BBDC1F945679EB2ABCFD5CF` | `efa783540951fde80c85c7e25690d3262ece77a7` |
| `func_0021D334` | 64 | `PURE_C` exact | `654DBA71945CD24F49EC727DC14B73BF7351DC759115811F04BA27568C2252D1` | `33d17b8bf7d09421263f7d9ffc220f7964218ab8` |
| `func_0021D374` | 72 | `PURE_C` exact, shared owner row 1 | `91D690B7AA45051D852BCFCE84007F72979D01737FF1D66A2BBCE36EA09A0C7C` | `f4f14534bd2aa7500a9b4f2f6186a581b7632755` |
| `func_0021D3BC` | 148 | `PURE_C` exact, shared owner row 2 | `D54D426F51C0A293B6649817493F4ECB4542F4A63FED210F6A06EDBE1708FD11` | `f4f14534bd2aa7500a9b4f2f6186a581b7632755` |

The family therefore contributes 2,924 executable C bytes. The original 2,932
byte family accounting also includes the eight non-executable alignment bytes
after `func_0021C8DC`; those remain exactly owned by the retained assembly slice.

## Exact commits

The first ten independent results precede the structural-refresh merge and are
already ancestors of the continuation base:

1. `d5ad11737af4228adb1bafb066386746d72a1830` — `func_0021D1CC`
2. `f7998352c97ab3a1a8aa5dc6f4f707bcfb44c5d9` — `func_0021D200`
3. `7cc4ed9967d4a0ad93991873d21342429227b44a` — `func_0021D230`
4. `3c0bc7deac662fda9225db02157fe289d1e02b46` — `func_0021D25C`
5. `e4e149bb3c175cbce5f81722e1848b774b980d7a` — `func_0021D28C`
6. `5aedb0655695e519061c899777d477fc64ca1b82` — `func_0021D2C0`
7. `efa783540951fde80c85c7e25690d3262ece77a7` — `func_0021D2F8`
8. `33d17b8bf7d09421263f7d9ffc220f7964218ab8` — `func_0021D334`
9. `a034c47d111fb9d3518d68ff5f59a34ee5429acf` — `func_0021CA18`
10. `07b50da5a44820c8a898cefd3d936d9d82d1d8a9` — `func_0021CB30`

The corrected canonical path produced five additional independent target
commits after continuation base `2de3e527c279862aff72ef55a71a19acd529488b`:

1. `83282ee24326852d75822fb06d53417d8eb20078` — `func_0021C8DC`
2. `1db94f1f7453d7147156d102e99b9cf1a8c8d900` — `func_0021C970`
3. `e8f16c9a887cf9ad77cea21f26372c71c7307796` — `func_0021CA88`
4. `f4f14534bd2aa7500a9b4f2f6186a581b7632755` — shared `func_0021D374` / `func_0021D3BC` owner
5. `f3263747fed2ca13d69e3e82fe8f5ee93ac9b37d` — `func_0021CBC4`

## Focused and consolidated verification

- Canonical `node tools/diff.js <symbol>` reports exact decoded rows, exact raw
  linked bytes, zero differing bytes/instruction words, and matching relocation
  contracts for all active target symbols. `func_0021D3BC` is the exact second
  owner row in the `func_0021D374` report.
- `node tools/source_policy.js --target <symbol>` classified every active source
  as `PURE_C`; the consolidated source-policy gate also passed with zero
  `UNKNOWN` classifications.
- Per the Director's corrected cadence, no new per-function
  `tools/verify.js --target ...` run was used. One consolidated
  `node tools/verify.js` passed baserom identity, toolchain, source policy, C
  linker ownership, target placement, relocations, exact target bytes, and
  `Full ROM EXACT`.
- Consolidated verification report:
  `build/current/verification.json`, SHA-256
  `947B08649AEE57C05C11BC205AF1BAC4AF07903B5DC0FF317F03BB2A2AB78744`.
- Exact rebuilt ROM: 41,943,040 bytes, SHA-256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Final generated status: retail ROM exact; 454 `PURE_C` functions / 29,948
  bytes; 61 `HYBRID_C` functions / 32,928 bytes; zero `UNKNOWN`.
- `git diff --check` passed throughout and after the consolidated gate.

## Structural cases exercised

- `func_0021C8DC`: C solely owns executable `.ob64.r4033.s0`, ROM
  `0x0021C8DC..0x0021C968`; retained assembly solely owns the eight-byte,
  non-executable `.ob64.r4033.s1` alignment slice.
- `func_0021D374` / `func_0021D3BC`: one 220-byte `PURE_C` text object owns both
  accepted rows. The combined linked target SHA-256 is
  `AB19D70EA422D4FE47620330C5F4EDCA53EEB9863FCB104206582C4D2CB3A956`.
- `func_0021CBC4`: C solely owns the 1,544-byte text target and compiler-generated
  switch-table section `.ob64.r4158`. The read-only section is 264 bytes at ROM
  `0x00229DF0..0x00229EF8`, contains 65 relocated entries plus four padding
  bytes, and has linked SHA-256
  `D88942BC72126CDB2EAC36D63BCF8B262C671FFFA53ADD17DEBAC7BB6A02D112`.

## Hybrid fragments

None. Hybrid instruction count: 0. No inline assembly, register-asm binding,
raw assembler injection, or assembler escape hatch was introduced.

## Preserved research and remaining differences

The earlier tracked dossiers and archived candidates remain as historical
research. They are superseded by the exact active sources and have no remaining
canonical difference or reopen requirement:

| Function | Preserved candidate | Former recorded limitation | Current remaining difference |
|---|---|---|---|
| `func_0021C8DC` | `66C816775C0D60E0D79631C5758DF2A537B17D45CA8193A7A2C6224DDFF9B22B` | Exact 140-byte C body, then an eight-byte owner-length mismatch | 0 bytes; padding now remains in the accepted non-executable assembly slice |
| `func_0021C970` | `4BB48EB1CC8757B661BB392CD6E26A76852AF3ADDF45F465654EEDFB5FFDCA4E` | Three runtime-local `R_MIPS_26` operands | 0 bytes / 0 relocations |
| `func_0021CA88` | `D3577DE1EC13B1E3A8A3D7D89D7ED503D50D80751FE6CF25401A9BD0651654F1` | Three runtime-local `R_MIPS_26` operands | 0 bytes / 0 relocations |
| `func_0021CBC4` | `8A45C6B2294EE5E777288F7DDDFAFC055052B75C383E4172897C2144778A59DF` | Two text instructions, allocator/CFG differences, and inactive text/table placement | 0 bytes / 0 relocations; exact active workbench candidate was `F60D8675EB0A6545000B78A3B68982D8918921683D465A17925BE18DDD6B1574` |
| `func_0021D374` | `795AA5A84E7EF0AAF0B9D87B2F14B3960BE2925051F3959654609575C6D81700` | Standalone C could not encode the shared live-register continuation | 0 bytes in the accepted combined owner |
| `func_0021D3BC` | `0CB99F9ED2A7377571A1FC40E6931E46BB3C98BEE34E0EC929279661C26BF756` | Standalone entry had 33 differing instructions / 95 bytes and undefined live-in state | 0 bytes in the accepted combined owner |

There are no unresolved Wave 1 blockers. No function needs a reopen condition.
`func_0021D3BC` must continue to be verified through the combined owner; an
independent activation should be reconsidered only if new structural evidence
changes the accepted live-register/multi-entry contract.

## Supported aliases

These are `SUPPORTED_ALIAS` proposals only. No evidence reached `CANONICAL`, so
all build symbols remain `func_XXXXXXXX`.

| Function | Evidence class | Proposed alias | Supporting evidence |
|---|---|---|---|
| `func_0021C8DC` | `SUPPORTED_ALIAS` | `compare_battle_queue_entry_priority` | Comparator ABI; descending float at `+0x10`, signed tie-break at `+0x08`, then stable 0xC0-record pointer order |
| `func_0021C970` | `SUPPORTED_ALIAS` | `battle_action_stream_advance` | Confirmed runtime advance helper; returns the next offset using special widths and the ordinary width table |
| `func_0021CA18` | `SUPPORTED_ALIAS` | `battle_action_stream_previous_offset` | Repeatedly advances while retaining and returning the offset immediately before the requested target |
| `func_0021CA88` | `SUPPORTED_ALIAS` | `battle_action_stream_offset_for_time` | Subtracts per-record delay bytes and returns the record offset containing the requested remaining time |
| `func_0021CB30` | `SUPPORTED_ALIAS` | `battle_action_stream_seek_time` | Confirmed cursor-seek helper; writes the resulting cursor and time/progress fields at context `+0x810`, `+0x04`, and `+0x08` |
| `func_0021CBC4` | `SUPPORTED_ALIAS` | `battle_action_stream_insert_record` | Complete insertion dispatcher; shifts the tail, emits delay separators/header/payload, updates length, and owns the 65-case table |
| `func_0021D1CC` | `SUPPORTED_ALIAS` | `battle_action_stream_insert_record_2` | Two-argument wrapper that zero-fills the remaining seven builder arguments |
| `func_0021D200` | `SUPPORTED_ALIAS` | `battle_action_stream_insert_record_3` | Three-argument wrapper that zero-fills the remaining six builder arguments |
| `func_0021D230` | `SUPPORTED_ALIAS` | `battle_action_stream_insert_record_4` | Four-argument wrapper that zero-fills the remaining five builder arguments |
| `func_0021D25C` | `SUPPORTED_ALIAS` | `battle_action_stream_insert_record_5` | Five-argument wrapper that zero-fills the remaining four builder arguments |
| `func_0021D28C` | `SUPPORTED_ALIAS` | `battle_action_stream_insert_record_6` | Six-argument wrapper that zero-fills the remaining three builder arguments |
| `func_0021D2C0` | `SUPPORTED_ALIAS` | `battle_action_stream_insert_record_7` | Seven-argument wrapper that zero-fills the remaining two builder arguments |
| `func_0021D2F8` | `SUPPORTED_ALIAS` | `battle_action_stream_insert_record_8` | Eight-argument wrapper that zero-fills the final builder argument |
| `func_0021D334` | `SUPPORTED_ALIAS` | `battle_action_stream_insert_record_9` | Full nine-argument forwarding wrapper |
| `func_0021D374` | `SUPPORTED_ALIAS` | `battle_action_stream_remove_record` | Selects encoded width, shifts subsequent bytes left, decrements length, and transfers adjustment |
| `func_0021D3BC` | `SUPPORTED_ALIAS` | `battle_action_stream_remove_record_shift_tail` | Accepted internal continuation performs the shared byte-shift/decrement/adjustment tail and consumes the dispatcher's live state |

## Scope and repository hygiene

- No Wave 2 or unrelated family work was attempted.
- The parent research repository was accessed read-only. No file, index, branch,
  or commit there was changed by this assignment. Its observed HEAD was
  `c32b5d97e4fd65b319e2f117e002585ecfd1e5ab`; its unrelated pre-existing dirty
  inventory was left untouched.
- No Total Resolver database was initialized.
- No push was performed.
- The exact final branch HEAD and clean final `git status --short --branch`
  inventory are recorded in the terminal callback after this report commit.

## Recommended integration order

Preferred integration is a fast-forward or ordinary merge of the complete Wave
1 branch, preserving continuation base `2de3e527c279862aff72ef55a71a19acd529488b`
and the five exact implementation commits in their existing order:

1. `83282ee24326852d75822fb06d53417d8eb20078`
2. `1db94f1f7453d7147156d102e99b9cf1a8c8d900`
3. `e8f16c9a887cf9ad77cea21f26372c71c7307796`
4. `f4f14534bd2aa7500a9b4f2f6186a581b7632755`
5. `f3263747fed2ca13d69e3e82fe8f5ee93ac9b37d`

If cherry-picking, the destination must already contain the complete structural
correction represented by continuation base `2de3e527...`; do not cherry-pick
the split-row, shared-owner, or auxiliary-table targets onto the old structural
baseline. Integrate this report commit last.
