# Reproduction procedure

Status: blocked. The procedure reproduces the final v7 C-only probe and its byte comparison. Phase 8 builds, verifiers, and path-independent reports were not run because no candidate reached the owner and maintainable-C gates.

## Authenticated inputs

Use these accepted local tools and paths:

| Input | Path or identity |
|---|---|
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` |
| KMC SHA-256 | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| GNU MIPS tools | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\.toolchains\gcc-toolchain-mips64-win64\bin\` |
| Probe output root | `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\` |
| Original assembly | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\asm\original\rev0\boot\boot_table_mask_reconcile.s` |
| Original target bytes | `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\func_00002D7C.original.bin` |

The compiler flags were `-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char`. Assemble with `-EB -mips3 -32`.

## Compile and assemble v7

The temporary v7 source was removed from the canonical tree after the probe. Its compiler assembly remains at `probe/table-v7/func_00002D7C.compiler.s`.

```powershell
$probe = 'C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\probe\table-v7'
$cc1 = 'C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe'
$as = 'C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\.toolchains\gcc-toolchain-mips64-win64\bin\mips64-elf-as.exe'
$src = 'C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\src\boot\boot_table_mask_reconcile.c'
& $cc1 -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char -o (Join-Path $probe 'func_00002D7C.compiler.s') $src
& $as -EB -mips3 -32 -o (Join-Path $probe 'func_00002D7C.o') (Join-Path $probe 'func_00002D7C.compiler.s')
```

The source path in that historical command no longer exists because the temporary probe was removed. Reproduction requires restoring the recorded v7 source from the worker's uncommitted probe history, which is outside the canonical result. The existing compiler assembly, object, linked image, and task log are the authoritative direct evidence for this blocked result.

## Manual link used for the final comparison

The link used GNU `mips64-elf-ld.exe` with `-nostdlib -Ttext 0x8007297c`. It supplied these semantic addresses as absolute aliases:

```text
g_table_mask_seed=0x800F9C08
g_table_mask_call_table=0x800BEE78
g_table_mask_record_pointers=0x800C47F0
g_table_mask_count=0x800C6D60
g_table_mask_first_table=0x800BEE90
g_table_mask_status=0x800E79B0
g_table_mask_mirror=0x800E79BC
g_table_mask_copy=0x800F8100
g_table_mask_indexed=0x800C4BD0
g_table_mask_flags=0x800C49D2
g_table_mask_selector_a=0x800BEF90
g_table_mask_selector_b=0x800BEF94
g_table_mask_halfword_table=0x800C480A
g_table_mask_mode_table=0x800BEF10
g_table_mask_aux_a=0x800E797C
g_table_mask_aux_b=0x800E7A24
g_table_mask_output_a=0x800F9BE4
g_table_mask_output_b=0x800C4B28
g_table_mask_output_c=0x800C4BB0
g_table_mask_output_d=0x800F8700
g_table_mask_output_e=0x800F0000
g_table_mask_output_f=0x800F0004
func_0001AA00=0x8008A600
```

The linked image was extracted with `mips64-elf-objcopy -O binary -j .text`. The v7 output is 1,708 bytes. A direct comparison against the 1,792-byte original reports 1,403 differing bytes, 412 differing compared words, and first difference `0xB`.

## Required gates not run

The following commands were not run for this blocked result:

```text
node tools/build_phase8_matching_c.js ...
node tools/verify_phase8_matching_c.js ...
node tools/compare_phase8_reproducibility.js ...
```

Those gates require a valid selected owner and canonical configuration. No such owner or configuration was produced. Running them would not prove the required result and could create misleading generated artifacts.
