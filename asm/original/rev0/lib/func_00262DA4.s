/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262DA4..0x00262DD4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward: 0x262DA4-0x262DA8 (lui $a0; lw $a0,0xDA8) loads $a0 consumed by jal 0x800712C4 in framed body at 0x262DAC (frees DA8 then DAC). jr$ra@0x262DCC + delay 0x262DD0. */
func_00262DA4:
/* 0x00262DA4 0x802D29A4 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00262DA8 0x802D29A8 0x8C840DA8 */ .word 0x8C840DA8 # lw $a0, 0xDA8($a0)

/* function boundary candidate: func_00262DAC, size=40, kind=prologue */
func_00262DAC:
/* 0x00262DAC 0x802D29AC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00262DB0 0x802D29B0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00262DB4 0x802D29B4 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00262DB8 0x802D29B8 0x00000000 */ .word 0x00000000 # nop
/* 0x00262DBC 0x802D29BC 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00262DC0 0x802D29C0 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00262DC4 0x802D29C4 0x8C840DAC */ .word 0x8C840DAC # lw $a0, 0xDAC($a0)
/* 0x00262DC8 0x802D29C8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00262DCC 0x802D29CC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262DD0 0x802D29D0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
