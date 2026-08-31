# KMC GCC 2.7.2 Matching Notes

Empirical compiler-behavior notes for ordinary matching-C work against the pinned
KMC GCC 2.7.2 / GNU Binutils 2.6 toolchain. The first notes came from the
`func_000135a0` match (commit `1db925d`) and the verified `func_000490ec`
worktree match (commit `ba2b75e`, promoted in `e76be61`). Later exact matches
and the fixed matching-workbench corpora supplied the additional observations
below. This document records bounded experiments, not a general model of the
compiler. The accepted `func_000135a0` example and its conservative matching
lesson are in `docs/dossiers/func-000135a0.md`.

The nonmatching `func_0006d7d8` session also supplied useful scoped stack-layout,
control-flow, and negative experiments. Those observations are labeled below;
they do not make that function an accepted match. Its reviewed record is in
`docs/dossiers/func-0006d7d8.md`.

The `func_000490ec` session used the relocation workflow that existed in its
worktree. Its synthetic legacy Phase 8 record is obsolete; the current linkage
workflow described below supersedes that part of the branch commit.

Machine-local tool paths come from ignored `config/local-tools.json`. Compiler
identity and flags come from the tracked active-target/toolchain contracts and
their retained KMC provenance manifest; this file intentionally records no
absolute paths.

## Lesson evidence labels

These labels describe the strength of a matching lesson. They do not add source
classes or naming classes. `PURE_C`, `HYBRID_C`, `ASM`, `UNKNOWN`, and the
three symbol-naming classes remain unchanged.

- `REPRODUCED` — the technique produced canonically verified exact `PURE_C` in
  at least two functions, or a controlled corpus reproduced the result.
- `EXACT_SINGLE_FUNCTION` — one canonically verified exact `PURE_C` function
  and controlled variants support the observation. Treat its exact spelling as
  a case study, not a general rewrite rule.
- `NONMATCHING_EXPERIMENT` — the experiment changed output in the expected
  direction but did not produce an exact `PURE_C` function. It is a hypothesis
  for a future diff, not a proven technique.

Structural and tooling findings are identified separately. They are not C
source-shape techniques and do not receive one of these lesson labels.

## Technique index

| Evidence | Symptom | Tested technique | Exact `PURE_C` evidence and limit |
|---|---|---|---|
| `REPRODUCED` | A small leaf needs a first draft | Use structured m2c without passing inferred context | 142 of the fixed 200 smallest leaves became verified matches, and those 142 had zero relocations; do not generalize this yield to larger or relocation-bearing functions |
| `REPRODUCED` | An input is in `$a1`, `$a2`, or `$a3`, but generated C compresses the signature | Preserve unused earlier integer/pointer ABI slots | 12 exact functions across the calibration and second corpus; not established for floating-point, 64-bit, varargs, or ambiguous signatures |
| `REPRODUCED` | A cursor byte is loaded too late | Retain the load in a local before an independent store | `func_00014614`, `func_00014988` |
| `REPRODUCED` | A default-result temporary produces the wrong return CFG or extension | Use direct conditional returns and a correctly widened result | `func_0012E950`, `func_00201B18`, `func_0029C19C`; this ruleset regressed `func_00090e40`, which remained covered by another pass |
| `REPRODUCED` | Cursor increments occur at the wrong instructions | Keep one- or two-byte advances at the corresponding loads | `func_000143dc`, `func_00014628` |
| `EXACT_SINGLE_FUNCTION` | A mask and comparison fuse into the wrong expression tree | Materialize the masked value in a separate local | `func_00146094` |
| `EXACT_SINGLE_FUNCTION` | Widths, branch polarity, local lifetimes, or grouping differ | Change only the source fact shown by the instruction diff | `func_000135a0` |
| `EXACT_SINGLE_FUNCTION` | An otherwise exact straight-line tail has the wrong schedule | Reorder only the independent source stores | `func_000490ec` |
| `REPRODUCED` | Retail has bottom-tested nested loop backedges | Use nested `do`/`while` only when the exact branch targets prove that structure | `func_000ba8a8`, `func_000ba918`; compatible exact shapes do not prove unique original syntax |
| `EXACT_SINGLE_FUNCTION` | Parameter masks or switch lowering differ | Preserve narrow parameter widths when entry instructions support them | `func_000bb3d8` |
| `EXACT_SINGLE_FUNCTION` | Address arithmetic folds into the wrong load tree | Materialize the supported lookup base before indexed access | `func_000bd26c` |
| `EXACT_SINGLE_FUNCTION` | Only loop-body register fields differ | Express the proven nested scans as genuine loops | `func_002861C8`; ten loop variants matched, but this remains one owner |
| `EXACT_SINGLE_FUNCTION` | Signed division uses the wrong correction branch | Spell the nonnegative/negative correction explicitly | `func_00283E14` for round-toward-zero division by four |
| `EXACT_SINGLE_FUNCTION` | Only commutative pointer/integer operand order differs | Use an explicit 32-bit integer cast that preserves the expression tree | `func_002A05EC`; depends on the accepted 32-bit target model |
| `REPRODUCED` | A numeric pointer produces the wrong address materialization | Use an independently supported symbol and its relocation | `func_001FFA8C` and the symbol-relative expression in `func_000490ec`; never invent a symbol for code generation |
| `EXACT_SINGLE_FUNCTION` | A large function has the right behavior but wrong CFG/lifetime topology | Correct prototypes and joins, inspect pass dumps, then make a localized lifetime change | `func_00047a94`; its individual zero-cost source constructs are not automatic recipes |
| `NONMATCHING_EXPERIMENT` | Several required stack offsets move independently | Model the offsets as fields of one local aggregate | `func_0006d7d8`; the aggregate reproduced offsets but the function did not become exact |

## Fast iteration harness

Use the matching workbench instead of manually recreating the scratch pipeline:

```text
node tools/match.js prepare <symbol> --variant structured
node tools/match.js watch <symbol> --source <candidate.c>
node tools/match.js classify <candidate-id> --include-details
node tools/match.js compare <candidate-id> <candidate-id>
```

`watch` resolves the accepted target, authenticates and uses the production KMC
compiler and GNU assembler with the accepted flags, performs only the permitted
target-section adjustment, compares the scratch section with the baserom, and
stores the experiment under ignored `build/matching/`. Use `probe` only when a
specific compiler pass is the remaining question. These commands automate the
fast loop; they do not prove linked ownership, relocation resolution, or the
full ROM.

Do not pass an inferred prototype to m2c by default. Context can still be
generated for human inspection. Use `--with-context` only when callers,
callees, and accepted types independently support that prototype.

Evidence label: `REPRODUCED`. The fixed 200-smallest-leaf pilot used structured
m2c with no context and produced 142 exact scratch candidates. All 142 were
reviewed and later passed source policy, sole linked ownership, exact linked
bytes, and the complete-ROM verifier. Every target in that result had zero
relocations. In a separate ten-target A/B sample, generation without a passed
prototype produced 8 exact candidates; `--with-context` produced 5. This is a
strong first-draft result for small leaves, not a general 71-percent success
claim for the ROM. See
`docs/matching-c/matching-workbench-pilot-20260822.md`.

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

## Calibrated source-shape ensemble

The workbench retains several narrow transforms because each produced an exact
function that another pass missed. They form an ensemble. Do not select one
transform as the universal structured form.

Evidence label: `REPRODUCED` for ABI gaps, retained early loads, direct return
flow, and explicit cursor steps. Evidence label: `EXACT_SINGLE_FUNCTION` for the
masked-local transform.

- `structured-abi-gaps` preserved missing integer/pointer argument slots. Four
  first-corpus functions and eight second-corpus functions became exact.
- `structured-load-first` loaded a cursor byte before an independent zero
  store. `func_00014614` and `func_00014988` became exact.
- `structured-return-flow` widened an inferred narrow result and replaced a
  default/overwrite temporary with direct returns. `func_0012E950`,
  `func_00201B18`, and `func_0029C19C` became exact.
- `structured-cursor-steps` retained byte-cursor advances beside the loads.
  `func_000143dc` and `func_00014628` became exact.
- `structured-masked-local` retained a masked value as a separate temporary.
  `func_00146094` became exact.

The counterexamples define the limit. `structured-return-flow` lost the
baseline match for `func_00090e40`, while another pass retained that function.
The load-first pass had no unique win in the second corpus. Each transform
refuses unrelated source shapes, and every generated candidate still needs the
canonical linked and complete-ROM verifiers. See
`docs/matching-c/matching-workbench-calibration-20260823.md` and
`docs/matching-c/matching-workbench-ensemble-20260823.md`.

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

## Before register-allocation experiments

Do not start broad register experiments merely because asm-differ colors show
different registers. Confirm these prerequisites first:

1. The accepted owner, executable extent, and placement are correct.
2. Candidate and retail instruction extents agree.
3. Branch targets, joins, loop backedges, and return paths agree.
4. Opcode families, access widths, signedness, and immediate construction are
   already correct or confined to a known local mismatch.
5. The stack frame, saved registers, spills, and call sequence agree.
6. Callee prototypes and integer/pointer ABI argument slots are supported by
   caller and callee evidence.
7. Relocations, symbol-based address construction, switch-table ownership, and
   linked jump targets agree.

If one prerequisite fails, fix that evidence class before allocator tuning.
When the prerequisites pass, inspect KMC flow/global-allocation dumps when they
answer a specific question. Change one source property at a time. Preserve
already-matching regions instead of sweeping the whole function.

## Register-allocation observations

Evidence label: `EXACT_SINGLE_FUNCTION` for the observations from
`func_000135a0` and `func_000490ec` below. They do not establish a global KMC
register preference order.

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

Evidence label: `NONMATCHING_EXPERIMENT`. This section records a useful
stack-layout hypothesis from `func_0006d7d8`; it is not a verified exact-C
technique.

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
unknown bytes had meaning. It supports a focused experiment: when retail
establishes several relative stack offsets, test one aggregate before
fabricating independent padding locals. Keep the `NONMATCHING_EXPERIMENT` label
until an exact `PURE_C` function reproduces this result.

In the same candidate, moving only `index = 0` above the early-return guard
changed the prologue from 42 raw object differences to 31 and reproduced the
retail save/zero interleave. Treat statement placement around a guard as a
localized prologue-scheduling experiment, not a general initialization rule.

## Conditionals and control-flow shape

Evidence label: `EXACT_SINGLE_FUNCTION` for the `func_000135a0` branch and
expression observations. The explicitly identified `func_0006d7d8` bullets are
`NONMATCHING_EXPERIMENT` observations.

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

Evidence label: `EXACT_SINGLE_FUNCTION` for the `func_000490ec` observations.
The explicitly identified `func_0006d7d8` observations remain
`NONMATCHING_EXPERIMENT`.

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

## Additional scoped exact shapes

- Evidence label: `REPRODUCED`. `func_000ba8a8` and `func_000ba918` use nested
  bottom-tested `do`/`while` loops that agree with the retail backedges. Decode
  the branch targets first. Two compatible exact functions do not prove one
  unique original syntax or justify rewriting top-tested loops.
- Evidence label: `EXACT_SINGLE_FUNCTION`. `func_000bb3d8` retains byte-sized
  parameters. The narrow entry values are compatible with its observed masks
  and switch lowering. Do not narrow a parameter without caller and entry
  evidence.
- Evidence label: `EXACT_SINGLE_FUNCTION`. `func_000bd26c` materializes its
  supported lookup base before indexed access. This prevented KMC from folding
  the address into a different load expression. Test this only when the base,
  stride, and remaining CFG are already correct.

Commit `574512f` contains these accepted source examples.

## Genuine loop structure can change allocator weighting

Evidence label: `EXACT_SINGLE_FUNCTION`.

`func_002861C8` was exact in size, function partition, switch table,
relocations, control flow, and every opcode family, but six instruction words
used `$t2` and `$t3` in the opposite roles. Declaration order, qualifiers,
types, identity expressions, copy funnels, condition polarity, `volatile`, and
ordinary goto variants did not resolve the pair.

The exact `PURE_C` source expressed the proven outer scan and backward scan as
genuine nested loops. KMC then assigned the two long-lived constants to the
retail registers, and the register bindings could be removed. Ten loop
variants reproduced exact bytes during the focused task. Commit `2a5e316`
contains the accepted change.

This result supports one narrow diagnostic: when only loop-body register fields
differ and the pre-register checklist passes, reproduce the actual loop nesting
before trying artificial register pressure. It does not establish that loops
are preferable to gotos for all targets.

## Advanced exact case: `func_00047a94`

Evidence label: `EXACT_SINGLE_FUNCTION`.

The initial generated candidates for this 836-byte scheduler owner were
invalid or far from exact. The successful manual reconstruction first corrected
whole-function facts:

- the helper `func_00046738` has one argument, not two;
- the retail labels and joins include a physical deferred-return path;
- genuine shared globals need the observed volatile accesses;
- branch-local assignments preserve the observed `$v0` reuse; and
- allocator and conflict dumps identify which lifetimes remain different.

After those facts were correct, two narrowly placed, no-instruction source
forms changed KMC's allocation weight and lifetime split: one
`do { ... } while (0)` around a state store and one matched increment/decrement
pair. Commit `0aa696c` is exact `PURE_C`.

Do not copy those final spellings into another function. Broad `goto`,
declaration-order, and `volatile` experiments often made this candidate worse.
The durable method is to correct prototypes and physical CFG first, use pass
dumps for a specific residual mismatch, and change only the implicated
lifetime.

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

## Narrow expression and address cases

### Explicit signed quotient correction

Evidence label: `EXACT_SINGLE_FUNCTION`.

In `func_00283E14`, an ordinary compact division-by-four expression produced a
shorter branch-likely correction. Retail used an explicit `bgez` sequence before
the arithmetic shift. This source shape reproduced it:

```c
if (decoded_size >= 0) {
    adjusted_size = decoded_size;
} else {
    adjusted_size = decoded_size + 3;
}
tag = ((s32 *)decoded)[(adjusted_size >> 2) - 1];
```

Use this only when the instructions prove signed round-toward-zero division by
four or an equivalent power-of-two case. It is not a general replacement for
the division operator.

### Explicit pointer/integer grouping

Evidence label: `EXACT_SINGLE_FUNCTION`.

In `func_002A05EC`, all logic and opcodes were correct, but two commutative
`addu` operands had the wrong order. Casting the symbol-bearing pointer to the
accepted 32-bit integer type preserved KMC's expression tree:

```c
*(void **)(offset + (unsigned int)D_8022A974 + 0x18)
```

This observation depends on the accepted 32-bit target model. Use it only for
an operand-order mismatch after the address and relocation are independently
correct.

### Evidence-backed symbols instead of numeric pointers

Evidence label: `REPRODUCED`.

In `func_001FFA8C`, numeric pointer constants produced immediate-oriented
address construction. Independently accepted extern symbols produced the
retail relocation-bearing form. `func_000490ec` also matched through a real
symbol-plus-offset expression.

Do not fabricate a symbol merely to change compiler output. The symbol must
have separate structural or semantic evidence. Rewriting KSEG0 hexadecimal
literals as signed decimal values did not solve the workbench's remaining
address-materialization cases.

## Preserve argument slots named by the disassembly

Evidence label: `REPRODUCED`. The calibrated ABI-gap pass produced 12 exact
`PURE_C` functions across two fixed corpora.

If a generated draft calls its first declared value `arg1`, that name can carry
an ABI fact: the value arrived in the second argument register. Do not silently
compress it into the first C parameter. Keep an unused earlier parameter when
the instruction reads `$a1`; likewise, keep an unused middle parameter when a
value named `arg2` must remain in `$a2`.

`func_000149b0` is the smallest matching example:

```c
int func_000149b0(int unused, int value)
{
    return value + 2;
}
```

This rule is safe only for an established integer/pointer argument slot. Do not
guess the same layout for floating-point, 64-bit, varargs, or ambiguous
signatures.

## A retained early load can explain store order

Evidence label: `REPRODUCED`. This shape produced exact `PURE_C` for
`func_00014614` and `func_00014988`.

When retail loads a cursor byte before writing an independent field, express
that lifetime directly with a local. Writing the zero field first and spelling
the byte dereference inside the later assignment can make KMC schedule the load
after the first store.

`func_00014614` demonstrates the matching shape:

```c
unsigned char value = *cursor;
*(short *)((unsigned char *)state + 0xB2) = 0;
*(short *)((unsigned char *)state + 0xB4) = value;
return cursor + 1;
```

This is not permission to reorder arbitrary memory operations. The local says
which value must be read first and remains useful when the pointers might
alias.

## A value still in `$v0` may be the return value

Evidence label for a `PURE_C` matching technique: `NONMATCHING_EXPERIMENT`.
The return-value interpretation is correct, but the accepted exact function
remains `HYBRID_C` under the pinned compiler.

Do not infer `void` merely because the final instructions do not move a value
into `$v0`. In `__osPopThread`, the first load already places the removed queue
head in `$v0`; the function then stores the successor and returns the head.
That semantic correction makes KMC use `$v1` for the successor, while retail
uses `$t9`. Exactness therefore needs a register binding and remains
`HYBRID_C`. The return-value observation is durable; the `$t9` choice is not a
general KMC source rule.

## Negative experiments and limits

These results prevent successful cases from becoming cargo-cult rules. A
failed variant is not a general prohibition, but repeating it without a new
diff hypothesis is not evidence.

- In `func_000135a0`, one large plain `static` helper emitted a real call and
  stack frame instead of
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
- Passing inferred context to m2c reduced a fixed ten-target sample from 8
  exact candidates to 5. Context is type evidence to review, not a default
  prototype source.
- `structured-return-flow` added three exact functions but lost
  `func_00090e40`; another ensemble pass retained it. No transform replaces the
  ensemble.
- Signed-decimal spelling did not make numeric KSEG0 pointers produce the
  required relocation-bearing address form.
- A generic index local did not stop KMC from folding an addition into a final
  memory offset. Explicit base updates changed scheduling without reproducing
  the target order.
- Broad `goto`, declaration-order, and `volatile` changes did not solve
  `func_00047a94`. They often disturbed already-matching regions.

## Structural and tooling diagnostics

The following findings explain why correct C can still fail. They are not
ordinary source-shape techniques. Do not repair them by distorting C or by
weakening verification.

### Compiler-generated switch tables

`func_00283E14` had exact C text but initially failed canonical ownership
because KMC emitted its eight-entry table in `.rodata`. `func_002827EC` needed
the same audited mechanism for a nine-entry table and four compiler alignment
bytes. Target-specific auxiliary-section contracts fixed the exact table bytes,
relocations, alignment, ROM/VMA placement, and assembly-tail ownership while
leaving both ordinary C switches unchanged.

This is structural work. Follow `docs/AUDIT.md` and the current auxiliary
section rules in `docs/WORKFLOW.md`. A scratch workbench allowance is not a
canonical ownership contract.

### Placement before control-flow invention

A runtime address in a split comment is not necessarily the accepted load-slab
or overlay placement. An apparent external jump can become an ordinary local
jump after the accepted live placement is applied. Exact masked opcodes do not
prove a match when the final linked `j`, `jal`, or address materialization uses
the wrong VMA. Resolve placement before testing unusual C call or goto forms.

### Integrated verification remains mandatory

An isolated target can have exact bytes while a combined active build exposes
a symbol-registry, auxiliary-owner, or linkage collision. Only the current
integrated verifier proves sole ownership and the complete ROM across all
active targets. Do not treat scratch equality or an isolated object as an
integration result.

### Larger translation units did not improve tested code generation

The 2026-08-30 translation-unit research compared 26 per-function results under
separate and grouped compilation. After relocation normalization, grouping did
not improve registers, stack layout, scheduling, switch lowering, or difficult
parser/scanner code. The closest `func_002861C8` pure candidate retained the
same six `$t2`/`$t3` words. Its later solution was genuine loop structure, not
translation-unit grouping.

This is a bounded negative result, not proof that original translation units
never matter. Larger units can improve shared type, helper, and private-data
understanding. Activate grouped canonical ownership only after a separate
structural task proves a concrete layout or ownership benefit. See
`docs/audit/2026-08-30-decomp-methods-tu-director-report.md`.

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
- A reviewed compiler-generated switch table also belongs in the target's
  `config/matching-c-linkage.json` entry. It is an auxiliary ownership contract,
  not an instruction-generation workaround. Use
  `config/matching-c-multi-owner.json` only when one logical compiled function
  replaces two or more contiguous accepted executable owner rows.
- The `func_000490ec` session exposed the old workflow defect clearly. Its
  legitimate external call and three `HI16`/`LO16` data-reference pairs forced
  the agent to add a whole synthetic legacy target record before strict
  verification would run. Promotion retained the source and active-target
  entry, reviewed its seven candidate relocations into
  `config/matching-c-linkage.json`, and omitted the obsolete legacy
  `config/phase8/matching-c.json` record.
- When Joe has explicitly authorized a fresh Git worktree, remember that it
  does not inherit ignored tool bundles. The
  `func_000490ec` worktree had its isolated local-tools configuration but was
  missing both the pinned GNU Binutils bundle and the source-policy
  preprocessor bundle. Provisioning byte-identical copies from the authenticated
  main checkout was valid only because the normal hash and version checks then
  passed. Treat a missing `as.exe` or `mips64-elf-cpp.exe` as environment setup,
  not as a C mismatch, and never weaken the pins to get past it.
- Status counts are generated (`tools/status.js`, source-policy report); never
  hand-maintain them in prose docs.
- Target verification still checks the complete current ROM. Re-run the full
  verifier after integration because shared symbols and auxiliary owners can
  collide only in the combined active set.
- Stage only your own files when committing. Concurrent sessions share the
  checkout; unrelated modified files may appear mid-run — leave them for their
  owner.
