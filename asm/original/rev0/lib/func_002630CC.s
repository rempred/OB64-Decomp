/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x002630CC..0x00263120 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (un-merged from parent over-merge func_00263050; 0x8022.0DA0/0DA8 slot-table accessor family). */
/* 0x002630CC 0x802D2CCC 0x10800012 */ .word 0x10800012 # beq $a0, $zero, 0x802D2D18
/* 0x002630D0 0x802D2CD0 0x00000000 */ .word 0x00000000 # nop
/* 0x002630D4 0x802D2CD4 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x002630D8 0x802D2CD8 0x94420DA0 */ .word 0x94420DA0 # lhu $v0, 0xDA0($v0)
/* 0x002630DC 0x802D2CDC 0x3C038022 */ .word 0x3C038022 # lui $v1, 0x8022
/* 0x002630E0 0x802D2CE0 0x8C630DA8 */ .word 0x8C630DA8 # lw $v1, 0xDA8($v1)
/* 0x002630E4 0x802D2CE4 0xAC800004 */ .word 0xAC800004 # sw $zero, 0x4($a0)
/* 0x002630E8 0x802D2CE8 0x00831823 */ .word 0x00831823 # subu $v1, $a0, $v1
/* 0x002630EC 0x802D2CEC 0xA4820000 */ .word 0xA4820000 # sh $v0, 0x0($a0)
/* 0x002630F0 0x802D2CF0 0x00031100 */ .word 0x00031100 # sll $v0, $v1, 4
/* 0x002630F4 0x802D2CF4 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x002630F8 0x802D2CF8 0x00021A00 */ .word 0x00021A00 # sll $v1, $v0, 8
/* 0x002630FC 0x802D2CFC 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00263100 0x802D2D00 0x00021C00 */ .word 0x00021C00 # sll $v1, $v0, 16
/* 0x00263104 0x802D2D04 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00263108 0x802D2D08 0x00021023 */ .word 0x00021023 # subu $v0, $zero, $v0
/* 0x0026310C 0x802D2D0C 0x000210C3 */ .word 0x000210C3 # sra $v0, $v0, 3
/* 0x00263110 0x802D2D10 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00263114 0x802D2D14 0xA4220DA0 */ .word 0xA4220DA0 # sh $v0, 0xDA0($at)
/* 0x00263118 0x802D2D18 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026311C 0x802D2D1C 0x00000000 */ .word 0x00000000 # nop
