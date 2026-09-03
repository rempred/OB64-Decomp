# High Attack Battle Stream Wave 2 Matching-C Report

Status: **completed**

All three combat-owner lifecycle functions are exact `PURE_C`. They replace
1,160 bytes of accepted assembly while preserving the exact Rev 0 ROM. The
direct High Attack cleanup free guard is now inside source-owned C. The Director
must review and integrate the three exact commits and this report.

## Assignment

| Item | Value |
|---|---|
| Role | Matching-C worker |
| Worktree | `C:\Users\Joe\Projects\OgreBattlel64\high-attack-wave-2` |
| Branch | `codex/high-attack-wave-2` |
| Required starting HEAD | `2455946c46b11ef3e6e7616742edf4698a70af59` |
| Observed starting HEAD | `2455946c46b11ef3e6e7616742edf4698a70af59` |
| Starting status | clean |
| Structural scope | accepted Wave 2 boundaries and owners unchanged |

The initial branch, HEAD, and cleanliness gate passed before any edit. The
prepared worktree was the only writable repository surface.

## Family model

`func_001F309C` allocates the shared combat owner with size `0x6094`. It stores
the owner in `D_801CE8BC` and publishes `owner + 0x57E0` through
`D_801CE8C0`. It also initializes the action state and subsystem helpers.

When either battle-mode predicate is active, setup allocates a `0x298` snapshot.
It copies `0x16C` bytes from the character table. It then saves 100 halfword and
byte fields with a `0x38` source stride. The owner stores this snapshot at
offset `0x607C`.

`func_001F34B0` performs the shared partial cleanup. Its first loop releases 16
pointers with a `0x0C` owner stride. Its second loop releases 10 pointers from
the table at owner offset `0x180`. It then clears the first `0xC0` owner bytes.

`func_001F3540` first tests the owner pointer. Its optional path restores the
saved character fields, releases the snapshot, and clears owner offset
`0x607C`. It then runs the subsystem cleanup sequence and the same two release
loops as `func_001F34B0`.

Complete cleanup also releases non-null resources at owner offsets `0x5748`,
`0x574C`, and `0x57D4`. It runs the terminal cleanup callbacks, releases the
owner, and clears `D_801CE8BC`. The final owner release is the High Attack guard
site at z64 ROM offset `0x001F36F0`.

| Semantic item | Meaning | Address or offset | Address space | Evidence role |
|---|---|---:|---|---|
| Combat owner global | Owns the `0x6094` allocation | `0x801CE8BC` | RAM virtual address | allocation, cleanup, final clear |
| Action-context global | Points to `owner + 0x57E0` | `0x801CE8C0` | RAM virtual address | setup and state initialization |
| Snapshot pointer | Optional character-state copy | `0x607C` | owner-relative offset | setup, restore, release |
| Final owner release | High Attack cleanup guard site | `0x001F36F0` | z64 ROM offset | direct target behavior |

## Matching results

| Function | Role | Accepted range | Bytes | Relocations | Target SHA-256 | Result | Exact commit |
|---|---|---|---:|---:|---|---|---|
| `func_001F309C` | family setup | `0x001F309C..0x001F32C0` | 548 | 67 | `9A9900D31325D57CA59B0AF2488DC237F9478FFDD79FE981BEC3E309BBD7B507` | exact `PURE_C` | `3876268d647f90a467455550c8960005bff4bd55` |
| `func_001F34B0` | family partial cleanup | `0x001F34B0..0x001F3540` | 144 | 9 | `03465AF5B6C8D119B387C06F7AB4657EE4DB95BB70D2C966177198B59B340768` | exact `PURE_C` | `6136a233e4dfd56cc335573af9c233936fd23034` |
| `func_001F3540` | direct complete cleanup | `0x001F3540..0x001F3714` | 468 | 48 | `B6F322DC0EE7B5835B80E6DE7AE3BFA29C05B75587CCDCB6A04DC08E7FB1802F` | exact `PURE_C` | `fdb1045be7d54b622de61e4ce782fff59cb001b6` |

The linked owner proofs identify chunk 31 rows 3691, 3693, and 3694. Each C
object owns its complete accepted row at logical offset zero. Decoded
instructions and raw linked bytes match for every row.

The accepted `func_001F309C` entry remains at `0x001F309C`. Its two leading load
words remain before the `0x18`-byte prologue at `0x001F30A4`. No boundary or
placement change was made.

The accepted `func_001F3540` entry remains at `0x001F3540`. Its two-word owner
load remains before the `0x20`-byte prologue at `0x001F3548`. The outer C guard
produces that exact read-before-write preamble.

## Reconstruction evidence

The workbench generated static context and all eight configured variants for
each target. The variants were `structured`, `structured-abi-gaps`,
`structured-load-first`, `structured-return-flow`, `structured-cursor-steps`,
`structured-masked-local`, `gotos`, and `stack`.

Generated cleanup drafts needed pointer and prototype repairs. The setup draft
had the correct broad behavior but the wrong frame and instruction extent. The
manual reconstructions used the retail owners, bounded callers and callees,
accepted exact neighboring C, and compiler output.

The final scratch candidates matched every instruction after relocation masks.
Their candidate IDs were:

- `func_001F309C`: `86117438E55B246AEC6D066AD16A35B80FD35B4996D7FC86952DCCD7C1875EE2`
- `func_001F34B0`: `280CF0584D8BAD16BAE9019626FC5421C81B782CE3296596AB7B0B9CD3C1E86D`
- `func_001F3540`: `1476FE018979C305F12599139E9AE080C404BE669D674DC61F6CCF3A541F92DF`

An explicit 32-bit pointer expression in `func_001F3540` preserved the retail
operand order for the snapshot byte load. Genuine `do`/`while` loops preserved
the cleanup backedges and saved-register lifetimes. No assembler mechanism was
used.

## Symbol-name sidecar

The build symbols remain unchanged. Static bodies, callers, callees, tables,
and data accesses support these aliases:

| Function | Proposed evidence class | Proposed alias | Static basis |
|---|---|---|---|
| `func_001F309C` | `SUPPORTED_ALIAS` | `combat_owner_setup` | allocates, clears, publishes, and initializes the shared owner |
| `func_001F34B0` | `SUPPORTED_ALIAS` | `combat_owner_partial_cleanup` | releases both pointer tables and clears the owner prefix |
| `func_001F3540` | `SUPPORTED_ALIAS` | `combat_owner_complete_cleanup` | restores optional state, tears down resources, releases the owner, and clears the global |

These are not `CANONICAL` names. No rename is part of this Matching-C result.

## Verification

Focused development and acceptance commands passed:

```text
node tools/diff.js func_001F309C
node tools/diff.js func_001F34B0
node tools/diff.js func_001F3540
node tools/source_policy.js --target func_001F309C
node tools/source_policy.js --target func_001F34B0
node tools/source_policy.js --target func_001F3540
```

Each final diff reported exact decoded instructions, exact raw linked bytes,
and a matching relocation contract. Each focused source-policy result was
`PURE_C`.

The single wave-end complete verifier passed:

```text
node tools/verify.js

Baserom identity ........... PASS
Toolchain .................. PASS
Source policy .............. PASS
C linker ownership ......... PASS
Target placement ........... PASS
Relocations ................ PASS
Target bytes ............... EXACT
Full ROM ................... EXACT

PURE_C exact ............... 457 functions / 31108 bytes
HYBRID_C exact ............. 61 functions / 32928 bytes

RESULT: EXACT BASELINE
```

Final generated status after verification was:

```text
Retail ROM ................... EXACT
Exact PURE_C ................. 457 functions / 31108 bytes
Exact HYBRID_C ............... 61 functions / 32928 bytes
Assembly owners remaining .... 5666 / 6446548 bytes
Other/data owners ............ 1058 / 35432596 bytes
UNKNOWN classifications ...... 0
```

## Blockers and hybrid extent

There are no remaining Wave 2 blockers. No structural contradiction appeared.
Total Resolver was not needed.

Hybrid extent is zero instructions and zero bytes. All three active translation
units classify as `PURE_C`.

## Director handoff

The Director must review the three exact commits, this report, and the final
clean worktree inventory. The Director must then integrate the wave onto the
newest canonical branch and rerun the integrated verifier.
