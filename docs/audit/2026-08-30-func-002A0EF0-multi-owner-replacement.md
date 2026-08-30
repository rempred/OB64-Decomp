# `func_002A0EF0` Multi-Owner Replacement Audit

Date: 2026-08-30
Profile: US Rev 0
Work type: structural
Status: implementation candidate; exact inactive baseline and focused controls pass

## Scope

This audit addresses only the canonical representation of one logical C function whose accepted
text is owned by two preserved structural rows. It does not change the accepted function boundary,
the integrated manual-load slab, either row, either section, either program header, any ROM LMA,
any runtime VMA, the compiler identity, or the retail acceptance rule.

The accepted census is:

| Owner | Chunk | Section | ROM | Runtime | Bytes | Assembly fallback |
|---|---:|---|---|---|---:|---|
| p5366 | 41 | `.ob64.r5366` | `0x002A0EF0..0x002A1000` | `0x802316C0..0x802317D0` | 272 | `asm/original/rev0/lib/func_002A0EF0.s` |
| p5367 | 42 | `.ob64.r5367` | `0x002A1000..0x002A135C` | `0x802317D0..0x80231B2C` | 860 | `asm/original/rev0/lib/func_002A0EF0_chunk42tail.s` |

The logical extent is 1,132 bytes (283 instructions), with canonical SHA-256
`2204F4F99EB1C954D82732B70FDF9B25C86765080659261FA66E21BBDBF6BBE6`.

## Independent Boundary and Control-Flow Check

`tests/func_002A0EF0_structure.js` decodes the canonical ROM using the accepted slice VMAs; it
does not trust the archived candidate or the decode-address comments in the assembly files.

- The first instruction at ROM `0x002A0EF0` is `addiu sp,sp,-0x30` (`0x27BDFFD0`).
- Exactly one accepted executable direct reference enters the range from outside: the `jal` at
  ROM `0x002A0728`, runtime `0x80230EF8`, targets the first instruction at `0x802316C0`.
- No accepted executable direct reference from outside targets the interior or the preserved seam.
- Exactly one `jr` occurs in the range: `jr ra` at ROM `0x002A1354`, runtime `0x80231B24`.
  Its delay slot at ROM `0x002A1358` restores `sp` by `0x30` (`0x27BD0030`).
- Every non-call direct branch or jump remains inside the logical range. Seven `jal` instructions
  leave the range as ordinary returning calls.
- The next accepted instruction begins at ROM `0x002A135C`; it is not part of the epilogue.

Five direct control-flow edges cross the owner boundary:

| Source ROM | Source runtime | Target runtime | Direction |
|---|---|---|---|
| `0x002A0F30` | `0x80231700` | `0x80231960` | p5366 to p5367 |
| `0x002A0F40` | `0x80231710` | `0x80231820` | p5366 to p5367 |
| `0x002A0F54` | `0x80231724` | `0x80231820` | p5366 to p5367 |
| `0x002A0FEC` | `0x802317BC` | `0x802317D8` | p5366 to p5367 |
| `0x002A1198` | `0x80231968` | `0x802316E8` | p5367 to p5366 |

The seam itself divides a control instruction from its delay slot. The branch at ROM
`0x002A0FFC` (`0x1440FFD9`) targets `0x80231734`; its always-executed delay slot is the first word
of p5367 at ROM `0x002A1000`, runtime `0x802317D0` (`0x00061400`). No direct branch targets that
delay-slot address. This rules out treating p5367 as a separately callable function entry.

## GNU 2.6 Constraint

Putting compiler output into two assembler sections before assembly is not viable. A focused
GNU Binutils 2.6 control containing a branch to a label in the other section fails with:

```text
Error: Can not represent relocation in this object file format
```

The target has branches in both directions across the accepted boundary, and its boundary also
splits a branch from its delay slot. Therefore the compiler assembly must remain one logical text
section while GNU `as` resolves the internal control flow.

## Smallest Accepted Mechanism

`config/matching-c-multi-owner.json` records the reviewed logical symbol, exact ordered row census,
logical ROM/VMA extent, and canonical text hash. It remains active as a structural contract even
when no C target is active, so neither p5366 nor p5367 can later be selected as a partial target.

When the logical target is active:

1. KMC compiles one ordinary function and the accepted GNU 2.6 assembler assembles it into the
   first accepted section name.
2. `tools/lib/elf_text_split.js` splits only the relocatable ELF container at the reviewed byte
   offset. It copies instruction bytes unchanged, preserves the logical function symbol and size,
   partitions relocation records by relocation site, rebases continuation-site offsets, and moves
   section-relative symbols to the corresponding owner section.
3. A `R_MIPS_HI16`/`R_MIPS_LO16` pair may not cross an owner boundary. Such an object fails closed.
4. Both original assembly sections and both owner symbols are removed from their respective chunk
   objects. Each complete original chunk object is retained outside the link as fallback and
   comparison evidence.
5. The one C object is listed once and contributes `.ob64.r5366` and `.ob64.r5367` to the two
   unchanged linker output sections. The continuation owner label is preserved as a linker-defined
   symbol at `0x802317D0`; it does not create a second C or assembly owner.
6. Verification checks each output section and `PT_LOAD` independently, concatenates them only for
   the logical byte comparison, and requires the complete ROM to remain exact.

The splitter never edits compiler assembly instructions, injects machine code, changes a branch,
or merges the two accepted rows. The unsplit assembler object is retained, and the source-object
proof independently reproduces the split object byte-for-byte.

When the target is inactive, no chunk is pruned and both original assembly inputs remain linked
through the existing Phase 7 path.

## Fail-Closed Controls

The structural contract rejects:

- a missing, extra, duplicated, or reordered owner;
- a missing row or a row marked ambiguous;
- a ROM or VMA gap, overlap, or noncontiguous ordinal;
- a placement-kind, overlay, or manual-load-slab disagreement;
- a logical extent or canonical byte-hash disagreement;
- an original assembly identity disagreement;
- activation of either owner under the continuation symbol as a partial target; and
- text/auxiliary ownership collisions with any active target.

The ELF split rejects:

- malformed or non-MIPS relocatable input;
- malformed, duplicate, non-word-aligned, or incorrectly sized owner records;
- an existing continuation section;
- an owner boundary incompatible with source-section alignment;
- unordered or out-of-range relocation sites;
- a `R_MIPS_HI16`/`R_MIPS_LO16` pair crossing the boundary; and
- any serialized owner-byte census that does not reproduce the assembler text exactly.

The canonical build then rejects partial C/assembly ownership, a surviving original section or
symbol, duplicate inclusion of the C object, incorrect section or load-header placement, map
contributions from either assembly chunk, relocation drift, target-byte drift, or full-ROM drift.

## Focused Evidence

Run from the repository root:

```powershell
node tests/active_targets.js
node tests/multi_owner_text.js
node tests/func_002A0EF0_structure.js
node tools/verify.js
node tools/audit.js
```

The first three commands are focused structural controls. `tests/multi_owner_text.js` also proves
that the split and unsplit synthetic objects link to identical bytes while preserving a logical
function symbol larger than the first owner section. `tools/verify.js` and `tools/audit.js` remain
the canonical complete gates.

## Falsifiers

Reopen structural work if runtime evidence identifies an independent entry at the seam or anywhere
inside the range, if an accepted executable direct reference to the continuation appears, if the
manual-load slab mapping changes, if a required relocation cannot be represented without editing
instruction bytes, or if GNU 2.6/linker behavior contradicts the focused split/link control.
