/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002992C..0x0002993C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002992C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osPopThread:
/* function boundary candidate: func_0002992C, size=16, kind=leaf */
func_0002992C:
/* 0x0002992C 0x8009952C 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x00029930 0x80099530 0x8C590000 */ .word 0x8C590000 # lw $t9, 0x0($v0)
/* 0x00029934 0x80099534 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00029938 0x80099538 0xAC990000 */ .word 0xAC990000 # sw $t9, 0x0($a0)
