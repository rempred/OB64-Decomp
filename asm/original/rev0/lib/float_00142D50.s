/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142D50..0x00142D78 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Five identical doubles 0x3F1A36E2 EB1C432D (~0.0001). 8-byte const, repeated 5x. [name-token: float_pool_double_repeat]. */
/* 0x00142D50 0x801B2950 0x3F1A36E2 */ .word 0x3F1A36E2 # lui $k0, 0x36E2
/* 0x00142D54 0x801B2954 0xEB1C432D */ .word 0xEB1C432D # swc2 $28, 0x432D($t8)
/* 0x00142D58 0x801B2958 0x3F1A36E2 */ .word 0x3F1A36E2 # lui $k0, 0x36E2
/* 0x00142D5C 0x801B295C 0xEB1C432D */ .word 0xEB1C432D # swc2 $28, 0x432D($t8)
/* 0x00142D60 0x801B2960 0x3F1A36E2 */ .word 0x3F1A36E2 # lui $k0, 0x36E2
/* 0x00142D64 0x801B2964 0xEB1C432D */ .word 0xEB1C432D # swc2 $28, 0x432D($t8)
/* 0x00142D68 0x801B2968 0x3F1A36E2 */ .word 0x3F1A36E2 # lui $k0, 0x36E2
/* 0x00142D6C 0x801B296C 0xEB1C432D */ .word 0xEB1C432D # swc2 $28, 0x432D($t8)
/* 0x00142D70 0x801B2970 0x3F1A36E2 */ .word 0x3F1A36E2 # lui $k0, 0x36E2
/* 0x00142D74 0x801B2974 0xEB1C432D */ .word 0xEB1C432D # swc2 $28, 0x432D($t8)
