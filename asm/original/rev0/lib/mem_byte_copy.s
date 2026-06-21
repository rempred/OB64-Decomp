/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001FCE0..0x0001FD20 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001FCE0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
mem_byte_copy:
/* function boundary candidate: func_0001FCE0, size=52, kind=prologue */
func_0001FCE0:
/* 0x0001FCE0 0x8008F8E0 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x0001FCE4 0x8008F8E4 0x18C00008 */ .word 0x18C00008 # blez $a2, 0x8008F908
/* 0x0001FCE8 0x8008F8E8 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0001FCEC 0x8008F8EC 0x90820000 */ .word 0x90820000 # lbu $v0, 0x0($a0)
/* 0x0001FCF0 0x8008F8F0 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x0001FCF4 0x8008F8F4 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0001FCF8 0x8008F8F8 0xA0A20000 */ .word 0xA0A20000 # sb $v0, 0x0($a1)
/* 0x0001FCFC 0x8008F8FC 0x0066102A */ .word 0x0066102A # slt $v0, $v1, $a2
/* 0x0001FD00 0x8008F900 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x8008F8EC
/* 0x0001FD04 0x8008F904 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x0001FD08 0x8008F908 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x0001FD0C 0x8008F90C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001FD10 0x8008F910 0x00000000 */ .word 0x00000000 # nop
/* 0x0001FD14 0x8008F914 0x00000000 */ .word 0x00000000 # nop
/* 0x0001FD18 0x8008F918 0x00000000 */ .word 0x00000000 # nop
/* 0x0001FD1C 0x8008F91C 0x00000000 */ .word 0x00000000 # nop
