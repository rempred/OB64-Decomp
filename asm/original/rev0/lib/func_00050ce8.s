/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00050CE8..0x00050D20 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf un-merged from parent 0x50918; lui $v1 lookup entry; jr $ra at 0x50D18 + delay 0x50D1C */
func_00050ce8:
/* 0x00050CE8 0x800C08E8 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00050CEC 0x800C08EC 0x8C630F4C */ .word 0x8C630F4C # lw $v1, 0xF4C($v1)
/* 0x00050CF0 0x800C08F0 0x10600009 */ .word 0x10600009 # beq $v1, $zero, 0x800C0918
/* 0x00050CF4 0x800C08F4 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00050CF8 0x800C08F8 0x94620078 */ .word 0x94620078 # lhu $v0, 0x78($v1)
/* 0x00050CFC 0x800C08FC 0x14440003 */ .word 0x14440003 # bne $v0, $a0, 0x800C090C
/* 0x00050D00 0x800C0900 0x00000000 */ .word 0x00000000 # nop
/* 0x00050D04 0x800C0904 0x0805EB86 */ .word 0x0805EB86 # j 0x8017AE18
/* 0x00050D08 0x800C0908 0x9062007A */ .word 0x9062007A # lbu $v0, 0x7A($v1)
/* 0x00050D0C 0x800C090C 0x8C630000 */ .word 0x8C630000 # lw $v1, 0x0($v1)
/* 0x00050D10 0x800C0910 0x1460FFF9 */ .word 0x1460FFF9 # bne $v1, $zero, 0x800C08F8
/* 0x00050D14 0x800C0914 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00050D18 0x800C0918 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00050D1C 0x800C091C 0x00000000 */ .word 0x00000000 # nop
