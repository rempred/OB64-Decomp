/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145204..0x00145210 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 3 pure-zero words (pad before trailing code-like data blob). [name-token: zero_fill_3w_f]. */
/* 0x00145204 0x801B4E04 0x00000000 */ .word 0x00000000 # nop

/* function boundary candidate: func_00145208, size=120, kind=leaf */
func_00145208:
/* 0x00145208 0x801B4E08 0x00000000 */ .word 0x00000000 # nop
/* 0x0014520C 0x801B4E0C 0x00000000 */ .word 0x00000000 # nop
