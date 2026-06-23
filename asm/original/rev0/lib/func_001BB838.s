/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB838..0x001BB86C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf on $a0: NOR/AND clear of 0x8023A256 global; jr $ra(0x1BB864)+delay move $v0,$zero(0x1BB868). */
func_001BB838:
/* 0x001BB838 0x8022B438 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BB83C 0x8022B43C 0x94450002 */ .word 0x94450002 # lhu $a1, 0x2($v0)
/* 0x001BB840 0x8022B440 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BB844 0x8022B444 0x3C038023 */ .word 0x3C038023 # lui $v1, 0x8023
/* 0x001BB848 0x8022B448 0x9463A256 */ .word 0x9463A256 # lhu $v1, -0x5DAA($v1)
/* 0x001BB84C 0x8022B44C 0x24420004 */ .word 0x24420004 # addiu $v0, $v0, 0x4
/* 0x001BB850 0x8022B450 0x00052827 */ .word 0x00052827 # nor $a1, $zero, $a1
/* 0x001BB854 0x8022B454 0x00651824 */ .word 0x00651824 # and $v1, $v1, $a1
/* 0x001BB858 0x8022B458 0xAC820008 */ .word 0xAC820008 # sw $v0, 0x8($a0)
/* 0x001BB85C 0x8022B45C 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x001BB860 0x8022B460 0xA423A256 */ .word 0xA423A256 # sh $v1, -0x5DAA($at)
/* 0x001BB864 0x8022B464 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB868 0x8022B468 0x00001021 */ .word 0x00001021 # move $v0, $zero
