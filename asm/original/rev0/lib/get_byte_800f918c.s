/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00019934..0x00019940 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00019934 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
get_byte_800f918c:
/* 0x00019934 0x80089534 0x3C02800F */ .word 0x3C02800F # lui $v0, 0x800F
/* 0x00019938 0x80089538 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001993C 0x8008953C 0x9042918C */ .word 0x9042918C # lbu $v0, -0x6E74($v0)
