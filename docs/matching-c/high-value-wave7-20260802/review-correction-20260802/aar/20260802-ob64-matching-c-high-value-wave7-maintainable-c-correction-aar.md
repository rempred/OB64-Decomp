# After-action report: Wave 7 maintainable-C correction

Status: correction blocked. The accepted KMC compiler emitted the semantic C model without the full-owner anchor, but its 1,508-byte output differs from the target in 370 of 377 words. This matters because the accepted backend cannot presently satisfy the maintainable-C gate for `func_00005FC0` under the assigned constraints. The Director must route the resulting toolchain research question or retain the original assembly fallback; no action is required from Joe.

## Mission and authority

This correction addressed Critical finding `W7-MC-01`. The required result was an exact compiler-generated C owner for `func_00005FC0`. The source had to retain a maintainable semantic implementation without a full-owner inline `.word` anchor.

The authorized repository was `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`. The correction worker did not inspect external-derived implementations. The parent and integration repositories, independent-review records, ROM, editor, emulator, RAM, savestates, and controller input remained read-only.

The canonical decomp repository started on `main` at `07bd06e9add63bacd45136b67e1684f004567d0a`. The integration repository started on `main` at `b22815518f060425519c08df19b617af8b5099a7`. The parent research repository was read-only at `517d4027d44c4caead0067b355f3ecd5007b4571`, subject `director: launch matching-C wave 7 maintainability correction`.

No branch, commit, stage, push, publication, delegation, or acceptance verdict was made. The canonical source and configuration were not modified because the focused correction failed before a valid exact implementation existed.

## Correction method

The focused experiment removed the full-owner anchor from an in-memory copy of the worker source. It renamed the semantic model entry to `func_00005FC0` so KMC could emit it as the target symbol. It left the C model logic unchanged.

The transformation removed the source suffix beginning at `asm(".text\\n");`. It changed the model declaration and definition from `static inline` to an emitted `void func_00005FC0(void)` function. The transformed input contained zero `.word` directives and two `func_00005FC0` references.

The authenticated compiler was KMC GCC 2.7.2. Its SHA-256 is `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`. The flags were `-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char`.

The authenticated GNU assembler was `mips64-elf-as.exe`. Its SHA-256 is `D237475181458118BF964C369748ACF144394583C5DC24293F53F1C9119E8697`. The assembler flags were `-EB -mips3 -32`.

## Focused result

The compiler-only model produced a `.text` section of exactly 1,508 bytes. Its main symbol `func_00005FC0` measured 1,492 bytes. KMC emitted a separate 16-byte `boot_state_default_model` symbol after the main symbol.

The compiler-only bytes were not the target bytes. The target reference is the z64 ROM interval `0x00005FC0..0x000065A4` exclusive. The target text SHA-256 is `08B5A10F4A00B892D8CBE99A62BC7F823FBB7A6B4EB9FB488D1BC2EFC341B50B`.

| Semantic item | Address or interval | Address space | Evidence role |
|---|---:|---|---|
| Target owner | `0x00005FC0..0x000065A4` | z64 ROM interval | Exact 1,508-byte contract |
| Target first deferred-save instruction | `0x00005FC4` | z64 ROM offset | Target emits `0xAFB00010` (`sw $s0,16($sp)`) |
| Compiler first-save instruction | `0x00000004` | compiler object `.text` offset | Compiler emits `0xAFBF0024` (`sw $ra,36($sp)`) |

The target saves only `$s0` before callback-table initialization. The target then defers `$ra` and `$s1` through `$s4` saves until after those writes. The compiler emits all required callee-saved register saves at function entry. This scheduling difference begins at compiler object offset `0x00000004`.

The comparison measured 1,508 original bytes and 1,508 compiler bytes. The first differing byte was byte `5`, the first differing word offset was `0x0004`, and 370 of 377 words differed. Only seven words matched. The compiler-only text SHA-256 is `FE0D3D4865EFBF517833D3A2821C323B31089262A4FF31737876852EB4290DDD`.

Two independent focused roots produced identical compiler-only outputs. Root A is `C:\Users\Joe\.codex\ob64-matching-c-wave7-maintainable-c-correction-20260802\focused`. Root B is `C:\Users\Joe\.codex\ob64-matching-c-wave7-maintainable-c-correction-20260802\focused-b`.

| Artifact | Root A SHA-256 | Root B SHA-256 |
|---|---|---|
| Compiler assembly | `2F4CE57A3FD23FBCB08C5BC79684ABCC169440D99E8E3DCB101A10F9CF2450AA` | `2F4CE57A3FD23FBCB08C5BC79684ABCC169440D99E8E3DCB101A10F9CF2450AA` |
| Compiler object | `4AC40F68C34AB4865A5D77B4F7E75E39F4B61EF20B6D00A24BE81FBA77CE76B2` | `4AC40F68C34AB4865A5D77B4F7E75E39F4B61EF20B6D00A24BE81FBA77CE76B2` |
| Compiler text | `FE0D3D4865EFBF517833D3A2821C323B31089262A4FF31737876852EB4290DDD` | `FE0D3D4865EFBF517833D3A2821C323B31089262A4FF31737876852EB4290DDD` |

The two focused outputs compare byte-identically. This proves deterministic reproduction of the focused failure. It does not prove the required full Phase 8 correction.

## Blocker and research question

The accepted KMC backend does not reproduce the target's deferred callee-saved prologue from this semantic C model. Inline assembly could constrain the sequence, but it would not establish that the compiler generated the owner. A full-owner byte anchor would repeat the rejected implementation.

Changing compiler flags, changing the compiler backend, or adding a new compiler is outside this correction mission. The focused result therefore meets the assignment stop condition for an accepted backend limitation.

The resulting research question is whether an authorized compiler or backend change can emit the original deferred-save schedule from maintainable C. If not, the target must remain an assembly fallback or require a revised acceptance scope.

## Preservation and limits

The canonical source remained SHA-256 `BFEB371935DCA921472E44FA2AF6FF002459008DF47DA415B39CA2B1B785B999`. The matching-C configuration remained SHA-256 `855E14C889788DBB708F0D02CEAEF225E3EE7642A2A77FF3819C886588ADA444`.

The original assembly fallback remains the source of exact target bytes. The worker's semantic model and disclosed layout-anchor limitation remain unchanged. The seven earlier C owners and their accepted identities were not touched.

The full Phase 8 build, verifier, and reproducibility gates were not rerun against canonical files. Running them against the unchanged anchor would not test this correction. The focused compiler and assembler outputs are the authenticated failure evidence.

## Evidence grade and review state

Correction finding grade: `Verified` at the focused static scope. The direct compiler output, object symbol table, byte comparison, prologue comparison, and two identical focused roots support the blocker.

Review state: `pending`. A proportional Critical re-review remains required if a future toolchain correction changes the producer. This worker does not issue an acceptance verdict.

## Changed surfaces and canonical follow-up

The blocked correction created an attributable generated `-.s` file at `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\-.s` during its standard-input probe. The file was 691 bytes with SHA-256 `DE115996A5C8D4B54307FDF02E0225223872B8910F40232009CBF9E85DB79160`. The withdrawal correction removed that file after recording its provenance.

The blocked correction AAR remains retained under `docs/matching-c/high-value-wave7-20260802/review-correction-20260802/`. The blocked correction itself did not modify the source or matching-C configuration. The withdrawal correction removes the rejected source and configuration entry while preserving the original assembly fallback.

No canonical domain-document edit is proposed. The Director must preserve the failed focused approach, retain the assembly fallback, and route any compiler or backend investigation under new authority.

## Withdrawal status

The candidate `func_00005FC0` is now rejected and withdrawn from active matching C. The original assembly remains the exact fallback. The accepted-backend research question remains unresolved, and proportional Critical review remains pending for any future correction.

## Evidence index

| Claim | Supporting artifact | Method | Grade and review |
|---|---|---|---|
| The anchor-free semantic model emits no `.word` directives. | `C:\Users\Joe\.codex\ob64-matching-c-wave7-maintainable-c-correction-20260802\focused\model-only.s` | In-memory anchor removal, KMC compile, assembly inspection | Verified; pending |
| The compiler output is deterministic. | Focused roots A and B | SHA-256 comparison of assembly, object, and text outputs | Verified; pending |
| The compiler-only text is not exact. | `focused\model-only.text.bin`; original text binary | Byte and word comparison | Verified; pending |
| The target prologue uses deferred callee-saved saves. | Original text binary and compiler assembly | Word comparison at object-relative offsets | Verified; pending |
| Historical candidate identities were recorded before withdrawal. | Withdrawal AAR; task log; pre-withdrawal source and configuration identities | SHA-256 readback before source/configuration removal | Supported; historical; rejected; withdrawn |
