/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142D78..0x00142D88 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string fragment 0x466F726D='Form' .. 0x2E0A0000='.',LF,NUL. 4 words, zero-padded. [name-token: rodata_str_Form]. */
/* 0x00142D78 0x801B2978 0x466F726D */ .word 0x466F726D # cop1_0x2D.fmt19
/* 0x00142D7C 0x801B297C 0x61742045 */ .word 0x61742045 # daddi $s4, $t3, 0x2045
/* 0x00142D80 0x801B2980 0x72726F72 */ .word 0x72726F72 # op_0x1C
/* 0x00142D84 0x801B2984 0x2E0A0000 */ .word 0x2E0A0000 # sltiu $t2, $s0, 0x0
