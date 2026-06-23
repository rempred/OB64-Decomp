/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB36C..0x001BB388 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf on $a0: lw 0x8($a0)/0x4($a0); jr $ra(0x1BB380)+delay move $v0,$zero(0x1BB384). */
func_001BB36C:
/* 0x001BB36C 0x8022AF6C 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BB370 0x8022AF70 0x8C830004 */ .word 0x8C830004 # lw $v1, 0x4($a0)
/* 0x001BB374 0x8022AF74 0x8C420004 */ .word 0x8C420004 # lw $v0, 0x4($v0)
/* 0x001BB378 0x8022AF78 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x001BB37C 0x8022AF7C 0xAC820008 */ .word 0xAC820008 # sw $v0, 0x8($a0)
/* 0x001BB380 0x8022AF80 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB384 0x8022AF84 0x00001021 */ .word 0x00001021 # move $v0, $zero
