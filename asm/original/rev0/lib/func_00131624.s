/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x00131624..0x00131660 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Split from parent func_00131388 over-merge. Frameless leaf reading globals 0x801F0DE0/0x801F3610/0x801F365D; returns bitmask. jr $ra 0x131658 + delay 0x13165C. */
/* 0x00131624 0x801A1224 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x00131628 0x801A1228 0x8C420DE0 */ .word 0x8C420DE0 # lw $v0, 0xDE0($v0)
/* 0x0013162C 0x801A122C 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x00131630 0x801A1230 0x8C843610 */ .word 0x8C843610 # lw $a0, 0x3610($a0)
/* 0x00131634 0x801A1234 0x3C03801F */ .word 0x3C03801F # lui $v1, 0x801F
/* 0x00131638 0x801A1238 0x9063365D */ .word 0x9063365D # lbu $v1, 0x365D($v1)
/* 0x0013163C 0x801A123C 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x00131640 0x801A1240 0x2C840001 */ .word 0x2C840001 # sltiu $a0, $a0, 0x1
/* 0x00131644 0x801A1244 0x00042023 */ .word 0x00042023 # subu $a0, $zero, $a0
/* 0x00131648 0x801A1248 0x00441024 */ .word 0x00441024 # and $v0, $v0, $a0
/* 0x0013164C 0x801A124C 0x30630002 */ .word 0x30630002 # andi $v1, $v1, 0x0002
/* 0x00131650 0x801A1250 0x2C630001 */ .word 0x2C630001 # sltiu $v1, $v1, 0x1
/* 0x00131654 0x801A1254 0x00031823 */ .word 0x00031823 # subu $v1, $zero, $v1
/* 0x00131658 0x801A1258 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0013165C 0x801A125C 0x00431024 */ .word 0x00431024 # and $v0, $v0, $v1
