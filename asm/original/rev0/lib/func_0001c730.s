/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001C730..0x0001C760 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001C730, size=40, kind=prologue */
func_0001C730:
/* 0x0001C730 0x8008C330 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001C734 0x8008C334 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001C738 0x8008C338 0x3C04800C */ .word 0x3C04800C # lui $a0, 0x800C
/* 0x0001C73C 0x8008C33C 0x24844CC8 */ .word 0x24844CC8 # addiu $a0, $a0, 0x4CC8
/* 0x0001C740 0x8008C340 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0001C744 0x8008C344 0x0C024E04 */ .word 0x0C024E04 # jal 0x80093810
/* 0x0001C748 0x8008C348 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x0001C74C 0x8008C34C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001C750 0x8008C350 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001C754 0x8008C354 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0001C758 0x8008C358 0x00000000 */ .word 0x00000000 # nop
/* 0x0001C75C 0x8008C35C 0x00000000 */ .word 0x00000000 # nop
