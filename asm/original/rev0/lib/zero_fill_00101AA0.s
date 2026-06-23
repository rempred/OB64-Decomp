/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101AA0..0x00101AA8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two zero words (0x00000000, 0x00000000) of padding between the embedded-data run and the next pointer block. [name-token: zero_fill_pad]. */
/* 0x00101AA0 0x801716A0 0x00000000 */ .word 0x00000000 # nop
/* 0x00101AA4 0x801716A4 0x00000000 */ .word 0x00000000 # nop
