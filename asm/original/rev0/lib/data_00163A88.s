/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00163A88..0x00163AB0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 0xDF000000 0x00000000 marker then a short ascending high-byte record: 0x11BE0001,0xE11DF967,0xFAF1F9E7,0x650FFBBB,0xFB31FC3D,0xFDB9FF3F,0xFFFF2243,0xFDF5FFBF. Ends near 0xFFFF; no ascii. HYPOTHESIS: packed ramp/codebook row. [name-token: data_00163A88_block_DF]. */
/* 0x00163A88 0x801D3688 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00163A8C 0x801D368C 0x00000000 */ .word 0x00000000 # nop
/* 0x00163A90 0x801D3690 0x11BE0001 */ .word 0x11BE0001 # beq $t5, $s8, 0x801D3698
/* 0x00163A94 0x801D3694 0xE11DF967 */ .word 0xE11DF967 # sc $sp, -0x699($t0)
/* 0x00163A98 0x801D3698 0xFAF1F9E7 */ .word 0xFAF1F9E7 # sdc2 $17, -0x619($s7)
/* 0x00163A9C 0x801D369C 0x650FFBBB */ .word 0x650FFBBB # daddiu $t7, $t0, -0x445
/* 0x00163AA0 0x801D36A0 0xFB31FC3D */ .word 0xFB31FC3D # sdc2 $17, -0x3C3($t9)
/* 0x00163AA4 0x801D36A4 0xFDB9FF3F */ .word 0xFDB9FF3F # sd $t9, -0xC1($t5)
/* 0x00163AA8 0x801D36A8 0xFFFF2243 */ .word 0xFFFF2243 # sd $ra, 0x2243($ra)
/* 0x00163AAC 0x801D36AC 0xFDF5FFBF */ .word 0xFDF5FFBF # sd $s5, -0x41($t7)
