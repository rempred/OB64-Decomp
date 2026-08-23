# KMC GCC 2.7.2 Matching Notes

Empirical compiler-behavior notes for ordinary matching-C work against the pinned
KMC GCC 2.7.2 / GNU Binutils 2.6 toolchain. They were derived during the
`func_000135a0` match (commit `1db925d`) and the verified `func_000490ec`
worktree match (commit `ba2b75e`, promoted in `e76be61`). Unless a note
explicitly says otherwise, it describes a result reproduced for one of those
functions or a small probe, not a general model of the compiler. The accepted
`func_000135a0` example and its conservative matching lesson are in
`docs/dossiers/func-000135a0.md`.

The nonmatching `func_0006d7d8` session also supplied useful scoped stack-layout,
control-flow, and negative experiments. Those observations are labeled below;
they do not make that function an accepted match. Its reviewed record is in
`docs/dossiers/func-0006d7d8.md`.

The `func_000490ec` session used the relocation workflow that existed in its
worktree. Its synthetic legacy Phase 8 record is obsolete; the current linkage
workflow described below supersedes that part of the branch commit.

Machine-local tool paths come from `config/local-tools.json` and the phase-6
reproduction manifest; this file intentionally records no absolute paths.

## Fast iteration harness

This optional ignored scratch loop turned focused experiments from minutes into
seconds when the canonical diff rejected a wrong-sized intermediate candidate.

1. Compile with the pinned `cc1.exe` using exactly the accepted compile flags
   (`config/phase8/matching-c.json` → `compiler.compileFlags`) writing assembly
   to a scratch directory.
2. Replace the lone `.text` directive with the accepted target-section directive:
   `.section .ob64.rNNNN,"ax",@progbits`.
3. Assemble with the pinned gas using the compiler assembler flags.
4. Extract the section bytes (`parseElfFile`/`elfSectionBytes` from
   `tools/lib/phase7_conventional.js`) and word-compare against the baserom
   slice at the accepted ROM range.

Notes:

- `tools/diff.js` rejected the initial wrong-sized candidate because the linked
  target section no longer had the accepted shape. Return to the canonical diff
  as soon as the scratch comparison is useful; the scratch loop is not proof.
- `j`/`jal` words may differ in raw-object comparison because their final
  addresses resolve at link time. Such differences mean the candidate is ready
  for the canonical linked diff, not that the function is done.
- In this experiment, output assembled into a section literally named `.text`
  contained 12 trailing zero bytes that disappeared when the real `.ob64.*`
  target section was used. Removing `-force-n64align` did not remove those
  bytes, so the exact cause was not established. Always reproduce the accepted
  section adjustment rather than attributing the padding to that flag.
- The `func_0006d7d8` scratch loop reproduced the same counting trap: its
  literal `.text` section reported 416 bytes, while the function disassembly
  ended at 404 bytes. Do not infer executable instruction count from a padded
  scratch section. This still does not prove that the canonical linked section
  has the right shape; return to `diff.js` for that proof.
- In `build/diff/<symbol>.json`, `comparison.rows` is the instruction-row
  count, not the detailed row array. The report's `output` value names the
  ignored run directory; detailed rows are in
  `asm-differ-proof/<symbol>.json` beneath it.
- The displayed asm-differ score can remain nonzero when every decoded row and
  every raw linked byte is exact; both exact sessions reported score `30` at
  completion. Use the command's `Decoded instruction rows`, `Raw linked bytes`,
  and final verifier result as the acceptance signals, not the score alone.

## Encoding facts

Only final encoded words matter. The printed mnemonics in `.compiler.s` do not
need to resemble decode comments in original assembly, because asm-differ
disassembles both sides through the same objdump.

- For the tested small immediates, `addu rd,rs,imm` assembled to the same word as
  `addiu`, and `sltu rd,rs,imm` assembled to the same word as `sltiu`. Do not
  generalize these pseudo-instruction spellings beyond immediates the assembler
  can encode that way.
- For the tested constant `1`, `li` expanded to `addiu` from zero. Larger
  constants can require a different expansion.
- `#nop` lines emit zero bytes; they are scheduling-hole annotations inside
  `.set reorder` regions.
- Delay-slot fillers: explicit instructions appear inside
  `.set noreorder/.set nomacro` blocks; outside them gas auto-fills branch/jump
  slots with nops under `.set reorder`.
- Inverting the two tested byte conditions changed the output to the retail
  branch-likely layout, including a store in the delay slot. Why the compiler
  chose that form is a useful working explanation, not a proven general rule.

## Register-allocation observations

The session generated several contradictory theories about the allocator's
global preference order. None was established. The reproducible observations
for `func_000135a0` were narrower:

- Reading the `+0x14` field before `+0xA2` and storing them in that order fixed
  the two registers at the loop head. Either ordering change alone was not the
  successful final shape.
- One cursor local reused across the parsing stages did not match. Giving the
  three successive reads separate cursor locals produced the retail register
  choices. This demonstrates a useful experiment, not a universal "split every
  local" rule or a complete explanation of the allocator.
- Keeping the countdown in a `u16` produced the observed `andi 0xffff`
  truncation before comparison in this expression shape. An `s32` version did
  not.
- Keeping the parsed value in a `u8` and comparing it as unsigned produced the
  observed `andi 0xff` and unsigned comparison. Widening it changed that shape.
- In `func_000490ec`, a descriptor pointer computed before an external call and
  used through the end of the function naturally occupied `s0`. Ordinary C
  lifetime produced the retail save/restore frame and call-spanning register;
  no register binding or assembly was needed.

Do not infer argument meaning merely from an entry `move`, and do not assume a
fixed register preference order. Change one C property at a time and use the
actual diff.

## Stack layout and aggregate locals

The nonmatching `func_0006d7d8` experiment had a directly observed `0x58`
frame, five byte loads at `sp+0x18..sp+0x1C`, and a pointer at `sp+0x24` whose
value was `sp+0x18`. Separate arrays, pointers, oversized arrays, and
`volatile` padding either produced the wrong frame or moved the pointer and
disturbed register allocation.

One ordinary local aggregate reproduced the frame and all three offsets at
once:

```c
typedef struct Func0006D7D8Scratch {
    u8 movement_bytes[5];
    u8 unknown_05[7];
    u8 *movement_start;
    u8 unknown_10[8];
} Func0006D7D8Scratch;
```

This does not prove that the original source used that struct or that the
unknown bytes had meaning. It demonstrates a focused matching technique: when
retail establishes several relative stack offsets, model them as fields of one
aggregate before fabricating independent padding locals.

In the same candidate, moving only `index = 0` above the early-return guard
changed the prologue from 42 raw object differences to 31 and reproduced the
retail save/zero interleave. Treat statement placement around a guard as a
localized prologue-scheduling experiment, not a general initialization rule.

## Conditionals and control-flow shape

- In this function, writing the two conditions as
  `(u32)x >= 0x80 { big arm } else { small arm }` produced the retail
  branch-likely, delay-slot store, and block order. The opposite comparison did
  not.
- The resulting small arm was split around the join point, with its first store
  in the likely delay slot. Treat this as the observed output of this source
  shape rather than a promise about every conditional.
- Commutative operand order follows expression structure. `byte + (high + 2)`
  was silently reassociated to the other grouping; forcing the intended order
  required an explicit sequenced statement:
  `high = high + 2; result = byte + high;`
- In `func_0006d7d8`, an apparent `j 0x8019BB54` became an ordinary internal
  forward jump after applying the accepted overlay placement. A `goto` to the
  shared slot-advance tail reproduced it. Tested end-of-function and
  `noreturn` call forms still emitted `jal`; they did not explain the retail
  word. Resolve placement and exact jump offset before testing unusual call
  declarations.
- Decode a loop branch's exact target before assigning statements to a loop.
  The `func_0006d7d8` inner back-edge returned to the per-slot load, not the
  two destination-header stores immediately above it. Correcting that target
  moved those stores to the outer loop and removed a large false mismatch.

## Loops, indexing, and store scheduling

The first plausible `func_000490ec` candidate matched 50 of 61 instruction
words. Its prologue, call, nested loops, 25-byte record indexing, empty loop, and
epilogue were already exact. Only the final store block differed. One focused
source-order change made the complete function exact on the second canonical
diff. This is a useful example of preserving an already-correct structure and
working only on the localized difference.

- Declaring the three counters as `u8` reproduced the repeated `andi 0xff`
  operations before indexing and bounds checks, followed by `sltiu`. This shows
  that the type is compatible with this exact pattern; it does not prove that
  every masked loop counter in the ROM began as a `u8`.
- KMC GCC retained an ordinary finite empty loop:

  ```c
  for (pad_index = 0; pad_index < 5; pad_index++) {
  }
  ```

  It emitted one initial increment, then a test whose backward branch targets
  the test and whose delay slot performs the next increment. The branch does
  **not** target the initial increment. Decode the exact branch target before
  concluding that a rotated loop increments twice per iteration.
- Indexing a 25-byte structure array produced the retail multiply-by-25 chain:
  multiply by three with shift/add, shift that value by three, then add the
  original index. A strange shift/add chain can therefore be a direct clue to
  an odd structure stride rather than hand-written arithmetic.
- In the nonmatching `func_0006d7d8` candidate, indexing a 56-byte table
  produced the retail multiply-by-56 chain: shift by three, subtract the
  original index to form seven times the index, then shift by three again.
- For the same target, this source produced the retail branchless zero-or-value
  mask for an unsigned byte threshold:

  ```c
  class_index = source_pair[0];
  class_index &= -(class_index < 100);
  ```

  The observed output was `sltiu`, subtraction from zero, and `and`. A later
  one-statement spelling canonicalized identically, so the instruction pattern
  supports the mask operation but not one unique source spelling.
- Directly indexing
  `g_func_001957D0_source_records[0].field_02[member_index]` produced the retail
  fixed-symbol-plus-two-plus-index load. The outer `unit_index` does not
  participate in that address. Do not insert a plausible-looking outer index
  merely because a semantic description says the code is searching records.
- The exact source formed `0x801969B8` as
  `(u8 *)g_func_001957D0_source_records - 0x838`. The compiler folded the
  constant into the low-address expression while preserving relocations against
  the existing source-record symbol. This is an available matching technique,
  not proof that the two addresses belong to one semantic C object. Prefer a
  separately evidenced canonical symbol when one exists.
- The first candidate wrote descriptor byte `0xA` before the byte loaded from
  `record->field_18`. Its generated scheduler grouped earlier independent stores
  differently and left 11 instruction words mismatched. Swapping only the last
  two C statements to this order made the whole tail exact:

  ```c
  descriptor[9] = record->field_18;
  descriptor[10] = 0xA;
  ```

  When a straight-line load/store tail is otherwise correct, try the source
  statement order before changing types, introducing volatile accesses, or
  disturbing already-matching control flow. A local order change can affect the
  scheduler beyond the two adjacent statements.

The exact source shapes that demonstrate the fixed-index scan, odd-sized record
indexing, retained empty loop, and final ordering are:

```c
descriptor = (u8 *)g_func_001957D0_source_records - 0x838;
func_00023780(descriptor, 11);
for (unit_index = 0; unit_index < 30; unit_index++) {
    for (member_index = 0; member_index < 5; member_index++) {
        if (g_func_001957D0_source_records[0].field_02[member_index] == 1) {
            break;
        }
    }
    if (member_index < 5) {
        break;
    }
}
record = &g_func_001957D0_source_records[unit_index];
for (pad_index = 0; pad_index < 5; pad_index++) {
}
/* Earlier descriptor stores omitted here. */
descriptor[9] = record->field_18;
descriptor[10] = 0xA;
```

This excerpt is a matching example, not a semantic claim about why the outer
loop repeats a fixed-address scan or why the empty loop exists.

## Address and evidence discipline

- Runtime addresses printed in original split comments are decode aids, not
  necessarily the accepted placement of load-slab or overlay code. For
  `func_000490ec`, the split comment shows `0x800B8CEC`, while the accepted
  `cold-boot-loader-00040e80` placement maps ROM `0x000490EC` to
  `0x801731EC`. `func_00046854` directly calls `0x801731EC` at ROM
  `0x00046E0C`. Searching only for a call to `0x800B8CEC` produced the false
  conclusion that no direct caller existed. Resolve the accepted placement
  before encoding or searching for callers.
- Caller and semantic leads in a task prompt are hypotheses to check, not facts
  to force into the C. In this session, the exact load address proved that the
  outer loop did not select the record being scanned, despite the initial
  "finds the unit" description. Preserve the machine behavior and keep neutral
  names when the meaning remains unclear.

## Local negative experiments

These controlled variants did not help `func_000135a0`; they are not general
prohibitions for other functions:

- One large plain `static` helper emitted a real call and stack frame instead of
  being integrated into the caller.
- The corresponding `static __inline__` helper integrated completely and did
  not leave the hoped-for argument moves.
- A guard comparing an extra parameter left additional branch instructions.
- A `volatile` local introduced memory traffic incompatible with this frameless
  target.
- In `func_0006d7d8`, unused ordinary locals were removed and did not reserve
  the hoped-for stack space. Unused `volatile` arrays did enlarge the frame in
  the tested forms, but they also moved the proven pointer spill and changed
  register allocation. Do not use dummy volatile storage as a substitute for
  an observed stack model.
- Broad declaration-order, setup-order, padding-size, and address-syntax sweeps
  did not establish a register-allocation rule for `func_0006d7d8`. Several
  forms canonicalized identically; others changed unrelated code. Once a diff
  stabilizes into a few local pockets, preserve the best candidate and seek a
  new structural hypothesis instead of treating more permutations as evidence.

## Pipeline & configuration mechanics

- New target ownership needs only `{symbol, source}` in
  `config/matching-c-targets.json` plus the source file; placement and byte facts
  derive from the accepted structural model. Relocation acceptance is separate
  and explicit as described below.
- **Jump-target configuration:** absence is not treated as an empty relocation
  contract. The diff can discover and display a new target's exact candidate;
  verification requires an explicit reviewed entry in
  `config/matching-c-linkage.json`. `func_000135a0` demonstrates two internal
  absolute jumps normalized to `R_MIPS_26` records against `.text`. This is a
  build-contract fact, not a KMC matching rule. New targets never need a
  fabricated legacy Phase 8 record.
- The `func_000490ec` session exposed the old workflow defect clearly. Its
  legitimate external call and three `HI16`/`LO16` data-reference pairs forced
  the agent to add a whole synthetic legacy target record before strict
  verification would run. Promotion retained the source and active-target
  entry, reviewed its seven candidate relocations into
  `config/matching-c-linkage.json`, and omitted the obsolete legacy
  `config/phase8/matching-c.json` record.
- A fresh Git worktree does not inherit ignored tool bundles. The
  `func_000490ec` worktree had its isolated local-tools configuration but was
  missing both the pinned GNU Binutils bundle and the source-policy
  preprocessor bundle. Provisioning byte-identical copies from the authenticated
  main checkout was valid only because the normal hash and version checks then
  passed. Treat a missing `as.exe` or `mips64-elf-cpp.exe` as environment setup,
  not as a C mismatch, and never weaken the pins to get past it.
- Status counts are generated (`tools/status.js`, source-policy report); never
  hand-maintain them in prose docs.
- Stage only your own files when committing. Concurrent sessions share the
  checkout; unrelated modified files may appear mid-run — leave them for their
  owner.
