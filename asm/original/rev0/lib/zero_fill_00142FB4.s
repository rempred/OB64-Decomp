/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142FB4..0x00142FC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 3 pure-zero words (pad before pointer table). [name-token: zero_fill_3w_c]. */
/* 0x00142FB4 0x801B2BB4 0x00000000 */ .word 0x00000000 # nop
/* 0x00142FB8 0x801B2BB8 0x00000000 */ .word 0x00000000 # nop
/* 0x00142FBC 0x801B2BBC 0x00000000 */ .word 0x00000000 # nop
