/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010D70..0x00010D98 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010D70 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
memcpy_bytewise:
/* 0x00010D70 0x80080970 0x00A61821 */ .word 0x00A61821 # addu $v1, $a1, $a2
/* 0x00010D74 0x80080974 0x10A30006 */ .word 0x10A30006 # beq $a1, $v1, 0x80080990
/* 0x00010D78 0x80080978 0x00000000 */ .word 0x00000000 # nop
/* 0x00010D7C 0x8008097C 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00010D80 0x80080980 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x00010D84 0x80080984 0xA0820000 */ .word 0xA0820000 # sb $v0, 0x0($a0)
/* 0x00010D88 0x80080988 0x14A3FFFC */ .word 0x14A3FFFC # bne $a1, $v1, 0x8008097C
/* 0x00010D8C 0x8008098C 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x00010D90 0x80080990 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00010D94 0x80080994 0x00000000 */ .word 0x00000000 # nop
