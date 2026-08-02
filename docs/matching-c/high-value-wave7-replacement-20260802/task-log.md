# Wave 7 replacement task log

Status: active worker investigation; no owner is accepted. Review remains pending.

This log contains reconstructed entries for work completed before the Director’s steering message.

## Reconstructed entries

### 2026-08-02 — assignment and baseline

The ready prompt selected one new matching-C owner for `ob64-decomp-matching-c-high-value-function-wave7-replacement-20260802`.

The prompt requires a new owner larger than 1,196 bytes and no larger than 1,800 bytes.

The prompt prohibits `func_00005FC0`, full-owner assembly, `.word` anchors, and raw-byte anchors.

The canonical decompilation repository started on `main` at `58072517041606a64c39028727b37034db1c9ff9`.

The accepted Phase7 code-region SHA-256 is `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

The accepted full-ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The seven accepted owners are `func_000E5938`, `func_0000B33C`, `func_00007688`, `func_0000BC8C`, `func_00269470`, `func_0026B360`, and `func_0026B820`.

The parent repository and integration repository were treated as read-only surfaces.

### 2026-08-02 — candidate screening

The eligible-owner screen selected `func_000079EC` from `asm/original/rev0/boot/boot_state_slot_queue_record_step.s`.

The candidate occupies z64 ROM range `0x000079EC..0x00007FF8`, exclusive.

The exact target length is 1,548 bytes, which satisfies the requested size range.

The target uses early-boot linear mapping and section `.ob64.r0069`.

The target dossier is `docs/dossiers/boot-state-slot-queue-record-step.md`.

The target has queue gating, indexed record access, flag gating, fixed-point division, clamps, packed output, and loop control.

The original target bytes are in `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\func_000079EC.original.bin`.

The Phase7 target-byte SHA-256 is `8FA7663B423238443F1B2DF63A32C9C8E147BE7DDED972B1479E4A15079746F2`.

### 2026-08-02 — reconstructed probe progression

Probe versions v17 through v24 progressively replaced compiler-generated arithmetic with bounded inline assembly.

Version v23 assembled after named labels replaced numeric labels in the second-axis block.

Version v24 corrected positive outer-branch labels and produced a 1,528-byte linked target.

Versions v25 through v28 tested fixed-register declarations and constant placement.

Version v28 preserved the axis-limit registers and produced a 1,528-byte linked target.

Versions v29 through v31 combined the first-axis kernels and corrected the first-axis branch layout.

Version v31 produced a 1,532-byte linked target.

Version v32 removed a duplicated negative-mode instruction and produced a 1,528-byte linked target.

Versions v33 and v34 corrected first-axis and second-axis field offsets.

Version v34 still produced a 1,528-byte linked target.

Versions v35 through v37 tested C register bindings and moved flag initialization into inline assembly.

Version v37’s assembly source and linked probe are under `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\`.

The probe outputs were not canonical build outputs and were not used as acceptance evidence.

### 2026-08-02 — material boundary failure

The current source contains a large inline-assembly implementation for the first-axis and second-axis kernels.

The source also retains a disabled duplicate implementation inside `if (0)` for prior probing.

The inline assembly now replaces material C implementation rather than merely bounding a small compiler-sensitive operation.

That structure fails the prompt’s maintainable-C boundary even though the probe target remains within the requested size range.

The current source therefore cannot be presented as a completed matching-C owner.

### 2026-08-02 — Director steering and next method

The Director instructed the worker to stop expanding inline assembly when it replaces material C implementation.

The next method is to screen another eligible owner for a maintainable-C implementation.

If no eligible owner can satisfy exact bytes with C-controlled behavior, the worker will report a precise blocker.

No acceptance verdict will be issued.

### 2026-08-02 — replacement screening after steering

The next screen excluded the rejected `func_00005FC0` owner and the failed `func_000079EC` candidate.

`func_00002D7C` is a 1,792-byte permanent boot table-mask routine with one direct call and multiple bounded loops.

Its dossier identifies flag normalization, mirrored masks, signed-byte clamps, selector handling, and six-slot table copying.

Those behaviors provide a maintainable-C test surface without using a full-owner assembly anchor.

The next method is a pure-C probe for `func_00002D7C` using typed volatile memory views and explicit loop state.

### 2026-08-02 - replacement pure-C probe progression

**[RECONSTRUCTED FROM DIRECT EVIDENCE]** Probe versions v1 through v5 compiled the replacement source without instruction-level inline assembly.

**[DIRECT EVIDENCE]** The probe outputs are under `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\table-v1` through `table-v5`.

**[DIRECT EVIDENCE]** Version v2 emitted approximately 1,612 bytes, v3 emitted approximately 1,676 bytes, v4 emitted approximately 1,704 bytes, and v5 emitted 1,716 bytes.

**[DIRECT EVIDENCE]** The `func_00002D7C` target is 1,792 bytes. The v5 linked probe is `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\table-v5\linked.bin`, with SHA-256 `28BD0B989D6B475A870813DD5E69364AE1C1D03E781A75F8D2D90442789E5940`.

**[DIRECT EVIDENCE]** The original target bytes are `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\func_00002D7C.original.bin`, with SHA-256 `5B8236796F82159F67928989BB7C9BF7637540BC85EE4B7578472D125EC2CA87`.

**[RECONSTRUCTED FROM DIRECT EVIDENCE]** The v5 compiler output uses a standard 0x30-byte stack frame, while the original owner uses a 0x58-byte frame and deferred callee-saved stores.

**[CURRENT INTERPRETATION]** The maintainable-C probe remains 76 bytes short and does not reproduce the target prologue. The accepted KMC backend may not emit this owner from semantic C without a prohibited owner-wide assembly implementation or a compiler/backend change.

**[NEXT METHOD]** Screen another eligible owner for a pure-C implementation. Do not add more kernel-sized inline assembly to either candidate.

### 2026-08-02 - replacement screen after pure-C v5

**[DIRECT EVIDENCE]** The eligible permanent-boot size band contains `func_000022B0` at 1,256 bytes, `func_00002D7C` at 1,792 bytes, `func_000069D8` at 1,296 bytes, `func_000079EC` at 1,556 parent bytes, `func_0000DCA8` at 1,352 bytes, and `func_0000ECF8` at 1,332 bytes.

**[DIRECT EVIDENCE]** `func_00005FC0` remains excluded because the prompt forbids selecting it and its prior correction failed the maintainable-C boundary.

**[RECONSTRUCTED FROM DIRECT EVIDENCE]** `func_000022B0` is an early resource-loader path with many direct calls, unaligned copy instructions, and terminal wait loops.

**[RECONSTRUCTED FROM DIRECT EVIDENCE]** `func_000069D8` is a six-slot callback dispatcher with direct calls, indirect callbacks, repeated record copies, and a deferred-save prologue.

**[RECONSTRUCTED FROM DIRECT EVIDENCE]** `func_0000DCA8` is a Huffman tree update with a local secondary entry. `func_0000ECF8` has a read-before-write preamble before its database boundary and many helper calls.

**[CURRENT INTERPRETATION]** The remaining preferred boot candidates have additional boundary, indirect-call, unaligned-copy, or compiler-scheduling risk. No candidate has yet produced an exact maintainable-C owner.

**[NEXT METHOD]** Preserve the direct probe evidence, remove unaccepted canonical probe sources, and prepare a precise blocked handoff if no candidate can meet the exact linked-byte and maintainable-C gates.

### 2026-08-02 - replacement pure-C frame-shape probes v6 and v7

**[DIRECT EVIDENCE]** The v6 probe added a bounded empty compiler constraint and C register bindings to reproduce the original 0x58-byte frame shape. It produced a 1,712-byte linked image.

**[DIRECT EVIDENCE]** The v6 linked image is `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\table-v6\linked.bin`. Compared with the 1,792-byte original, it differed in 1,405 bytes and 412 of 448 compared words. Its first byte difference was at offset `0xB`.

**[DIRECT EVIDENCE]** The v7 probe retained C-controlled loops and memory updates, kept only the bounded empty compiler constraint and register bindings, and changed the seed-load expression shape. It produced a 1,708-byte linked image.

**[DIRECT EVIDENCE]** The v7 linked image is `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\table-v7\linked.bin` with SHA-256 `D20AC18D9763F91FF1AB3C10286E1B48E8FCB4E93E3E725DF90B52649EA46D25`. Compared with the original, it differed in 1,403 bytes and 412 of 427 compared words. Its first byte difference was at offset `0xB`.

**[CURRENT INTERPRETATION]** The frame-shape adjustment narrowed one compiler-layout difference but did not approach exact matching. The accepted KMC backend therefore cannot be shown to emit `func_00002D7C` from maintainable C within this mission.

**[NEXT METHOD]** Stop C tuning for `func_00002D7C`, preserve the external probe evidence, remove unaccepted canonical probe sources, and report the replacement search blocked under the maintainable-C and exact-byte gates.

## Evidence pointers

The governing prompt is `docs/Plans/prompts/ob64-decomp-matching-c-high-value-function-wave7-replacement-20260802-r1-prompt.md`.

The candidate sources screened are `asm/original/rev0/boot/boot_state_slot_queue_record_step.s` and `asm/original/rev0/boot/boot_table_mask_reconcile.s`.

The temporary working C sources are `src/boot/boot_state_slot_queue_record_step.c` and `src/boot/boot_table_mask_reconcile.c`.

The original-byte probe is `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\func_000079EC.original.bin`.

The latest linked probes are `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\func_000079EC.v37.bin` and `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\table-v7\linked.bin`.
