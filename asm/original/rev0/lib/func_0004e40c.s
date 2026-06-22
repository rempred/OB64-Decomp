/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E40C..0x0004E434 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf split from parent 0x0004E3BC; jr $ra at 0x0004E42C + nop delay 0x0004E430 */
func_0004e40c:
/* 0x0004E40C 0x800BE00C 0x3C04800C */ .word 0x3C04800C # lui $a0, 0x800C
/* 0x0004E410 0x800BE010 0x8C844BBC */ .word 0x8C844BBC # lw $a0, 0x4BBC($a0)
/* 0x0004E414 0x800BE014 0x10800005 */ .word 0x10800005 # beq $a0, $zero, 0x800BE02C
/* 0x0004E418 0x800BE018 0x2402000D */ .word 0x2402000D # addiu $v0, $zero, 0xD
/* 0x0004E41C 0x800BE01C 0x94830004 */ .word 0x94830004 # lhu $v1, 0x4($a0)
/* 0x0004E420 0x800BE020 0x14620002 */ .word 0x14620002 # bne $v1, $v0, 0x800BE02C
/* 0x0004E424 0x800BE024 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x0004E428 0x800BE028 0xA4820004 */ .word 0xA4820004 # sh $v0, 0x4($a0)
/* 0x0004E42C 0x800BE02C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E430 0x800BE030 0x00000000 */ .word 0x00000000 # nop
