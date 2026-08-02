# Independent derivation record

Status: blocked. The derivation independently identified `func_00002D7C`, but the maintainable-C probes did not emit exact owner bytes. No canonical owner was accepted.

## Direct source evidence

The candidate came from the canonical function inventory and the permanent boot assembly. The source is `asm/original/rev0/boot/boot_table_mask_reconcile.s`. The semantic dossier is `docs/dossiers/boot-table-mask-reconcile.md`.

The owner boundary is z64 ROM `0x00002D7C..0x0000347C`, exclusive at the end. The owner is 1,792 bytes. Its early-boot virtual address range is `0x8007297C..0x8007307C`. The function has a 0x58-byte stack frame, no indirect jumps, and one direct call to the table-mask helper at virtual address `0x8008A600`.

The assembly and dossier independently expose these implementation features:

- flag normalization and mirrored masks;
- signed-byte clamping;
- selector handling;
- six-slot table reads and writes;
- status and mode updates;
- indexed record updates; and
- a direct helper call before the slot loop.

The original owner bytes are stored externally at `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\func_00002D7C.original.bin`. They are 1,792 bytes with SHA-256 `5B8236796F82159F67928989BB7C9BF7637540BC85EE4B7578472D125EC2CA87`.

## C-controlled probe evidence

The temporary source used typed volatile memory views, C loops, C branches, and the direct helper declaration. It contained no full-owner assembly, `.word` owner data, or raw-byte owner data. Versions v6 and v7 used only a bounded empty compiler constraint and register bindings to test frame and register allocation. Those probes did not replace the implementation.

The accepted KMC compiler emitted these external probes:

| Probe | Linked size | Result |
|---|---:|---|
| v1 | initial short output | Semantic model was incomplete. |
| v2 | about 1,612 bytes | Longer model, still not exact. |
| v3 | about 1,676 bytes | Additional C behavior, still not exact. |
| v4 | about 1,704 bytes | Additional C behavior, still not exact. |
| v5 | 1,716 bytes | 76 bytes short of the owner. Standard 0x30-byte frame remained. |
| v6 | 1,712 bytes | 1,405 differing bytes and 412 differing compared words. Frame reached 0x58 bytes. |
| v7 | 1,708 bytes | 1,403 differing bytes and 412 differing compared words. First difference remained at offset `0xB`. |

The v5 linked image is `probe/table-v5/linked.bin` with SHA-256 `28BD0B989D6B475A870813DD5E69364AE1C1D03E781A75F8D2D90442789E5940`.

The v6 linked image is `probe/table-v6/linked.bin`. The v7 linked image is `probe/table-v7/linked.bin` with SHA-256 `D20AC18D9763F91FF1AB3C10286E1B48E8FCB4E93E3E725DF90B52649EA46D25`.

## Interpretation and limits

The C probes establish that the semantic model produces meaningful linked code. They do not establish exact matching. The frame constraint narrowed one layout difference, but the compiler still emitted a different prologue schedule and a shorter function.

The failed `func_000079EC` path reached the requested size band, but its large inline-assembly kernels replaced material C implementation. That path cannot satisfy the prompt. Further assembly expansion would violate the same boundary.

The remaining preferred boot candidates show direct evidence of indirect callbacks, unaligned copies, local secondary entries, read-before-write preambles, or many helper calls. This screen does not prove that every remaining candidate is impossible. It proves that no candidate tested in this mission satisfies the required gates.

Review status for every worker claim is `review: pending`. This record is not an acceptance verdict.
