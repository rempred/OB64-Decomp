/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x00129918..0x00129948 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf reached by fall-through: reads lbu 0x4($a0), indexes relocated 0x80197?F0 table, clears bit 0x4; ends jr $ra @0x00129940 + delay sb @0x00129944. No addiu $sp prologue. */
/* 0x00129918 0x80199518 0x90830004 */ .word 0x90830004 # lbu $v1, 0x4($a0)
/* 0x0012991C 0x8019951C 0x00031040 */ .word 0x00031040 # sll $v0, $v1, 1
/* 0x00129920 0x80199520 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00129924 0x80199524 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00129928 0x80199528 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0012992C 0x8019952C 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00129930 0x80199530 0x246371F0 */ .word 0x246371F0 # addiu $v1, $v1, 0x71F0
/* 0x00129934 0x80199534 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00129938 0x80199538 0x90430001 */ .word 0x90430001 # lbu $v1, 0x1($v0)
/* 0x0012993C 0x8019953C 0x306300FB */ .word 0x306300FB # andi $v1, $v1, 0x00FB
/* 0x00129940 0x80199540 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00129944 0x80199544 0xA0430001 */ .word 0xA0430001 # sb $v1, 0x1($v0)
