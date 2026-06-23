/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101C94..0x00101C98 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Single 0x00000000 word aligning the start of the following 8-byte double const pool to an 8-byte boundary (0x101C98). Folded as zero padding. [name-token: zero_fill_pad2]. */
/* 0x00101C94 0x80171894 0x00000000 */ .word 0x00000000 # nop
