/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x00129948..0x00129978 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf reached by fall-through: reads lbu 0x4($a0), indexes relocated 0x80197?F0 table, sets bit 0x4; ends jr $ra @0x00129970 + delay sb @0x00129974. No addiu $sp prologue. */
/* 0x00129948 0x80199548 0x90830004 */ .word 0x90830004 # lbu $v1, 0x4($a0)
/* 0x0012994C 0x8019954C 0x00031040 */ .word 0x00031040 # sll $v0, $v1, 1
/* 0x00129950 0x80199550 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00129954 0x80199554 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00129958 0x80199558 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0012995C 0x8019955C 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00129960 0x80199560 0x246371F0 */ .word 0x246371F0 # addiu $v1, $v1, 0x71F0
/* 0x00129964 0x80199564 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00129968 0x80199568 0x90430001 */ .word 0x90430001 # lbu $v1, 0x1($v0)
/* 0x0012996C 0x8019956C 0x34630004 */ .word 0x34630004 # ori $v1, $v1, 0x0004
/* 0x00129970 0x80199570 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00129974 0x80199574 0xA0430001 */ .word 0xA0430001 # sb $v1, 0x1($v0)
