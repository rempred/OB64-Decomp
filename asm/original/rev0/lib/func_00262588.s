/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262588..0x002625AC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward: 0x262588-0x26258C (lui $a0; lw $a0,0xEDC) loads $a0 consumed by jal 0x800712C4 in framed body at 0x262590. jr$ra@0x2625A4 + delay 0x2625A8. */
func_00262588:
/* 0x00262588 0x802D2188 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x0026258C 0x802D218C 0x8C840EDC */ .word 0x8C840EDC # lw $a0, 0xEDC($a0)

/* function boundary candidate: func_00262590, size=28, kind=prologue */
func_00262590:
/* 0x00262590 0x802D2190 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00262594 0x802D2194 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00262598 0x802D2198 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0026259C 0x802D219C 0x00000000 */ .word 0x00000000 # nop
/* 0x002625A0 0x802D21A0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002625A4 0x802D21A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002625A8 0x802D21A8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
