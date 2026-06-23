/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142A30..0x00142A50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 6 RAM pointers in the 0x801BBCA4..0x801BCCE0 band (0x801BCCE0, 0x801BBCA4, 0x801BC374). Small word-stride pointer table; 2 trailing zero words. [name-token: table_ptr_801BCxxx]. */
/* 0x00142A30 0x801B2630 0x801BCCE0 */ .word 0x801BCCE0 # lb $k1, -0x3320($zero)
/* 0x00142A34 0x801B2634 0x801BBCA4 */ .word 0x801BBCA4 # lb $k1, -0x435C($zero)
/* 0x00142A38 0x801B2638 0x801BC374 */ .word 0x801BC374 # lb $k1, -0x3C8C($zero)
/* 0x00142A3C 0x801B263C 0x801BC374 */ .word 0x801BC374 # lb $k1, -0x3C8C($zero)
/* 0x00142A40 0x801B2640 0x801BCA78 */ .word 0x801BCA78 # lb $k1, -0x3588($zero)
/* 0x00142A44 0x801B2644 0x801BCC44 */ .word 0x801BCC44 # lb $k1, -0x33BC($zero)
/* 0x00142A48 0x801B2648 0x00000000 */ .word 0x00000000 # nop
/* 0x00142A4C 0x801B264C 0x00000000 */ .word 0x00000000 # nop
