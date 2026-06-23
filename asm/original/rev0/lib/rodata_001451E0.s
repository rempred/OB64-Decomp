/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001451E0..0x00145204 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string beginning 0x536F6D65='Some' .. ending 0x2E630A20='.c',LF,space. 9 words, NUL/word-padded. [name-token: rodata_str_Some_tail]. */
/* 0x001451E0 0x801B4DE0 0x536F6D65 */ .word 0x536F6D65 # beql $k1, $t7, 0x801D0378
/* 0x001451E4 0x801B4DE4 0x7468696E */ .word 0x7468696E # op_0x1D
/* 0x001451E8 0x801B4DE8 0x67204572 */ .word 0x67204572 # daddiu $zero, $t9, 0x4572
/* 0x001451EC 0x801B4DEC 0x726F7220 */ .word 0x726F7220 # op_0x1C
/* 0x001451F0 0x801B4DF0 0x6F6E206D */ .word 0x6F6E206D # ldr $t6, 0x206D($k1)
/* 0x001451F4 0x801B4DF4 0x732F6D73 */ .word 0x732F6D73 # op_0x1C
/* 0x001451F8 0x801B4DF8 0x5F656E63 */ .word 0x5F656E63 # bgtzl $k1, 0x801D0788
/* 0x001451FC 0x801B4DFC 0x6F756E74 */ .word 0x6F756E74 # ldr $s5, 0x6E74($k1)
/* 0x00145200 0x801B4E00 0x2E630A20 */ .word 0x2E630A20 # sltiu $v1, $s3, 0xA20
