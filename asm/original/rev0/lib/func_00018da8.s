/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00018DA8..0x00018DD4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00018DA8 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00018da8:
/* 0x00018DA8 0x800889A8 0x3C04800B */ .word 0x3C04800B # lui $a0, 0x800B
/* 0x00018DAC 0x800889AC 0x8C849E54 */ .word 0x8C849E54 # lw $a0, -0x61AC($a0)
/* 0x00018DB0 0x800889B0 0x8C82002C */ .word 0x8C82002C # lw $v0, 0x2C($a0)
/* 0x00018DB4 0x800889B4 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x800889CC
/* 0x00018DB8 0x800889B8 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00018DBC 0x800889BC 0x00401821 */ .word 0x00401821 # move $v1, $v0
/* 0x00018DC0 0x800889C0 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x00018DC4 0x800889C4 0xAC82002C */ .word 0xAC82002C # sw $v0, 0x2C($a0)
/* 0x00018DC8 0x800889C8 0xAC600000 */ .word 0xAC600000 # sw $zero, 0x0($v1)
/* 0x00018DCC 0x800889CC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00018DD0 0x800889D0 0x00601021 */ .word 0x00601021 # move $v0, $v1
