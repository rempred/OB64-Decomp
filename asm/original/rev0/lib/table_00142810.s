/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142810..0x00142830 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 8 RAM pointers in the 0x801B3918..0x801B3A6C band (0x801B3918, 0x801B3970, ...). Small word-stride pointer table. [name-token: table_ptr_801B39xx]. */
/* 0x00142810 0x801B2410 0x801B3918 */ .word 0x801B3918 # lb $k1, 0x3918($zero)
/* 0x00142814 0x801B2414 0x801B3970 */ .word 0x801B3970 # lb $k1, 0x3970($zero)
/* 0x00142818 0x801B2418 0x801B3988 */ .word 0x801B3988 # lb $k1, 0x3988($zero)
/* 0x0014281C 0x801B241C 0x801B39E0 */ .word 0x801B39E0 # lb $k1, 0x39E0($zero)
/* 0x00142820 0x801B2420 0x801B39F8 */ .word 0x801B39F8 # lb $k1, 0x39F8($zero)
/* 0x00142824 0x801B2424 0x801B3A10 */ .word 0x801B3A10 # lb $k1, 0x3A10($zero)
/* 0x00142828 0x801B2428 0x801B3A54 */ .word 0x801B3A54 # lb $k1, 0x3A54($zero)
/* 0x0014282C 0x801B242C 0x801B3A6C */ .word 0x801B3A6C # lb $k1, 0x3A6C($zero)
