# After-action report: Wave 4 high-value matching C

Status: completed and review-pending. The worker converted `func_00269470` to
C and reproduced its exact linked bytes in two independent external roots. The
result matters because one 808-byte state-transition owner now builds through
the accepted compiler while all preserved ROM owners remain exact. No action is
required from Joe; the Director must intake this report and route Critical
independent review.

## Assignment and boundaries

The assignment selected exactly one original game function. The worker touched
only the canonical `OB64 Decomp` repository. The parent and integration
repositories remained read-only. No branch, commit, push, publication, or
acceptance verdict was made.

Starting identities were recorded in [evidence-index.md](../evidence-index.md).
The canonical repository started at `main` HEAD
`d398c23f4163e807039c45956a4ed25c4698b641`.

## Selection result

The selected owner is `func_00269470`. It spans z64 ROM range
`0x00269470..0x00269798`, end exclusive. The accepted owner is 808 bytes.
Its placement is `.ob64.r4801` at runtime range
`0x802148C0..0x80214BE8`. The owner belongs to overlay descriptor 12.

The function meets the assignment requirements. It has seven-way dispatch,
multiple non-leaf calls, two indirect callbacks, linked state fields, and a
bounded pointer-array loop. It propagates state across several outputs. Its
boundary ends at `jr $ra` with the stack-restore delay slot. `func_00269798`
follows the boundary.

Rejected candidates are recorded in [target-selection.md](../target-selection.md).
The selected owner was stronger than the rejected encounter, floating-point,
and secondary-entry-heavy candidates.

## C derivation

The source is `src/overlays/descriptor_12/func_00269470.c`. The source SHA-256
is `366C3F0D312711E71DB34900B7DBB2D75B59D4DCF36745EF2C80B397C60F40F2`.
The original assembly SHA-256 is
`8A11B4BE872A6ABABA1F9EE8FF5C3108CBD81B18C45A21653D3FBE49BAA2B7EB`.

The source derives selector masking, seven-entry bounds, dispatch-table
selection, field offsets, callback reasons, flag masks, loop bounds, and
helper-call argument order from the original assembly. The selector-2
prototype preserves the original halfword and pointer argument order.

Selector 0 copies global flags, callback, and values into the state fields. It
selects `func_00268890` when field flag `0x4` is set. Otherwise it calls
`func_00268678`. It updates the pointer array and invokes the reason-0 callback.

Selector 1 invokes callback reason `1` before `func_00268798`. Selector 2
chooses between two transition helpers. Selector 6 returns the first record
value. Selector 5 calls `func_00268358` and clears state flag `0x4`.

Selector 3 calls three propagation helpers. It calls `func_002677D0` when state
bit `0x1000` is set. Selector 4 checks flags `0x2` and `0x4`, then invokes
callback reason `2` with the state transition argument.

The pointer loop reads the record count at offset `0x4`. It walks entries using
the pointer field at offset `0x58`. It writes the derived halfword at entry
offset `0x18`. Flags `0x10` and `0x20` produce the original values.

## Compiler and build integration

The accepted compiler is KMC GCC 2.7.2. Its SHA-256 is
`F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.
The build uses:

```text
-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char
```

The compiled section is 808 bytes. Its raw C object text SHA-256 is
`481296CB178391FFE31D7270EA993FED1AC5B7BE17F43AAFF5B97830E68C9BDC`.
The linked section SHA-256 is
`C4F2DD8D5281054D1F0266ECDEDC6832CF669DA331AC4C4F0A92B6A7D134EF02`.

The source uses a compiler-local label for the selector-0 branch. It uses a
local assembler label for the skip jump after `func_00268678`. This preserves
the original branch and jump targets without changing section size.

The build tool received one causal repair. Its `.text` matcher now accepts
CRLF output from KMC. It still requires exactly one `.text` directive. The
repair is in `tools/lib/phase8_matching_c.js`.

## Verification

The required setup command passed all 21 checks:

```text
node tools/verify_setup.js --phase5a-root "C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731"
```

The setup report SHA-256 is
`B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`.

The Phase 8 build passed in both fresh roots:

- `C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a`
- `C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-b\phase8-final-b`

Both builds produced the canonical full ROM SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
Both explicit verifiers passed. The path-independent comparison passed.

The verification preserved 7,242 accepted rows, 7,251 accepted executable
slices, and 19 overlay descriptors. The four earlier accepted C owners remained
exact through asm-differ: `func_000E5938`, `func_0000B33C`, `func_00007688`,
and `func_0000BC8C`. No original assembly target remained a linked owner.

## Evidence-completion correction

The correction worker added the three required standalone records:
[independent-derivation.md](../independent-derivation.md),
[reproduction-procedure.md](../reproduction-procedure.md), and
[task-log.md](../task-log.md).

The technical candidate remains unchanged. Its source, configuration, tool,
object, linked-target, and full-ROM identities remain the recorded values.
The task log records the parent-HEAD deviation and the final evidence inventory.
The [evidence-completion correction AAR](20260802-ob64-matching-c-high-value-wave4-evidence-completion-aar.md)
records the correction worker's scoped result.

## Evidence and review state

The command ledger, hashes, relocations, target semantics, and
preservation results are in [evidence-index.md](../evidence-index.md).
The target selection and rejected candidates are in
[target-selection.md](../target-selection.md).

Evidence grade: supported before independent review. Review status: pending.
This worker does not accept its own result. A fresh Critical independent review
must evaluate the completed result.
