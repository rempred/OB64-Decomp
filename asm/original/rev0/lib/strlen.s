/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00023860..0x00023884 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00023860 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
strlen:
/* 0x00023860 0x80093460 0x80820000 */ .word 0x80820000 # lb $v0, 0x0($a0)
/* 0x00023864 0x80093464 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x8009347C
/* 0x00023868 0x80093468 0x00801821 */ .word 0x00801821 # move $v1, $a0
/* 0x0002386C 0x8009346C 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00023870 0x80093470 0x80620000 */ .word 0x80620000 # lb $v0, 0x0($v1)
/* 0x00023874 0x80093474 0x5440FFFE */ .word 0x5440FFFE # bnel $v0, $zero, 0x80093470
/* 0x00023878 0x80093478 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0002387C 0x8009347C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00023880 0x80093480 0x00641023 */ .word 0x00641023 # subu $v0, $v1, $a0
