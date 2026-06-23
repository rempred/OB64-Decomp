/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x00239B74..0x00239B84 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless compare leaf recovered (plan/parent DB missed). lbu$v1,1($a0); lbu$v0,1($a1); jr$ra; subu$v0,$v1,$v0 (delay). Compares byte at offset 1. */
/* 0x00239B74 0x802A9774 0x90830001 */ .word 0x90830001 # lbu $v1, 0x1($a0)
/* 0x00239B78 0x802A9778 0x90A20001 */ .word 0x90A20001 # lbu $v0, 0x1($a1)
/* 0x00239B7C 0x802A977C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00239B80 0x802A9780 0x00621023 */ .word 0x00621023 # subu $v0, $v1, $v0
