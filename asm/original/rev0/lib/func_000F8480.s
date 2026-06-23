/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000F8480..0x000F84AC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS-LEAF recovered [adversarial R1 fix]: big-endian 32-bit word loader (lbu $v0..$v1/$a1 at 0..3($a0), sll 24/16/8, or). No stack frame. Ends jr $ra @0xF84A4 + delay-slot or $v0,$v0,$v1 @0xF84A8. Entry 0xF8480 is a separate callable leaf — NOT fall-through-reachable from func_000F8310 (which returns at 0xF8478) and not an internal branch target. */
/* 0x000F8480 0x80168080 0x90820000 */ .word 0x90820000 # lbu $v0, 0x0($a0)
/* 0x000F8484 0x80168084 0x90830001 */ .word 0x90830001 # lbu $v1, 0x1($a0)
/* 0x000F8488 0x80168088 0x90850002 */ .word 0x90850002 # lbu $a1, 0x2($a0)
/* 0x000F848C 0x8016808C 0x00021600 */ .word 0x00021600 # sll $v0, $v0, 24
/* 0x000F8490 0x80168090 0x00031C00 */ .word 0x00031C00 # sll $v1, $v1, 16
/* 0x000F8494 0x80168094 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x000F8498 0x80168098 0x90830003 */ .word 0x90830003 # lbu $v1, 0x3($a0)
/* 0x000F849C 0x8016809C 0x00052A00 */ .word 0x00052A00 # sll $a1, $a1, 8
/* 0x000F84A0 0x801680A0 0x00451025 */ .word 0x00451025 # or $v0, $v0, $a1
/* 0x000F84A4 0x801680A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000F84A8 0x801680A8 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
