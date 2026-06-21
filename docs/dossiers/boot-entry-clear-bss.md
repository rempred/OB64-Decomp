# Boot Entry Clear BSS

Status: static/offline supported, byte-exact original MIPS source.

## Identity

- Profile: US Rev 0 only.
- ROM range: `0x00001000..0x00001060`.
- Runtime range: `0x80070C00..0x80070C60`, using the early boot mapping
  `RAM = ROM + 0x8006FC00`.
- Source: `asm/original/rev0/boot/boot_entry_clear_bss.s`.
- Manifest part name: `boot_entry_clear_bss_and_jump`.
- Assembled slice SHA256:
  `519B6718076EE494179F69EF271ED61CAA1ECE63A7259FAE51C49B9B18FEE61D`.

## Static Read

The ROM header entry point is `0x80070C00`, so this range is the first executed
game code after the bootloader transfers control.

The stub initializes:

- `t0 = 0x800AEDB0`.
- `t1 = 0x0003AE70`.

It then loops from `0x80070C10`, writing two zero words per iteration:

- `sw zero, 0(t0)`.
- `sw zero, 4(t0)`.
- `t0 += 8`.
- `t1 -= 8`.

Static implication: it clears `0x3AE70` bytes from `0x800AEDB0` through
exclusive end `0x800E9C20`.

After the clear loop it initializes:

- jump target `t2 = 0x8007F880`.
- stack pointer `sp = 0x800C6D60` in the `jr t2` delay slot.

The range `0x0000103C..0x00001060` is zero padding before the next current
function-boundary candidate at `0x00001060`.

## Call Shape

- Caller: ROM header entry point / boot transfer only.
- Callees: none by `jal`; final transfer is `jr t2` to `0x8007F880`.
- Stack frame: none; this stub sets the initial stack pointer.
- Saved registers: none.

## Evidence Limits

This is a static dossier. The byte behavior is exact, and the entry-point
relationship is from the ROM header. The semantic label remains conservative:
`clear_bss` means "clears the observed boot RAM span", not a fully mapped linker
BSS section.

## Verification

Focused checks already pass:

```powershell
node tests\binutils_smoke.js
node tools\assemble_original_mips.js
```

The full loop gate is:

```powershell
node tools\verify_setup.js
```
