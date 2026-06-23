/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x0015FDF0..0x0015FDF8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Short transition tail of the high-entropy blob: 0xDF000000 (high-byte entropy word) followed by a single pure-zero word 0x00000000 at 0x0015FDF4 (not >=2, so not zero_fill). Acts as the gap before the packed-byte structure begins. [name-token: data_0015FDF0_entropytail]. */
/* 0x0015FDF0 0x801CF9F0 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x0015FDF4 0x801CF9F4 0x00000000 */ .word 0x00000000 # nop
