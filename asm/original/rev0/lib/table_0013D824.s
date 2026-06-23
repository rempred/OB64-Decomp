/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x0013D824..0x0013D880 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Embedded RAM-pointer sub-table in the 0x801E90xx band (0x801E9014/9038/9028/9054/90B8/9068/90A4/90D0/9078/908C...), interleaved with 0x00000000 padding words (hypothesis: sparse index of struct pointers). [name-token: table_0013D824_801E90_band]. */
/* 0x0013D824 0x801AD424 0x00000000 */ .word 0x00000000 # nop
/* 0x0013D828 0x801AD428 0x801E9014 */ .word 0x801E9014 # lb $s8, -0x6FEC($zero)
/* 0x0013D82C 0x801AD42C 0x00000000 */ .word 0x00000000 # nop
/* 0x0013D830 0x801AD430 0x801E9038 */ .word 0x801E9038 # lb $s8, -0x6FC8($zero)
/* 0x0013D834 0x801AD434 0x801E9028 */ .word 0x801E9028 # lb $s8, -0x6FD8($zero)
/* 0x0013D838 0x801AD438 0x801E9054 */ .word 0x801E9054 # lb $s8, -0x6FAC($zero)
/* 0x0013D83C 0x801AD43C 0x00000000 */ .word 0x00000000 # nop
/* 0x0013D840 0x801AD440 0x00000000 */ .word 0x00000000 # nop
/* 0x0013D844 0x801AD444 0x801E90B8 */ .word 0x801E90B8 # lb $s8, -0x6F48($zero)
/* 0x0013D848 0x801AD448 0x801E9068 */ .word 0x801E9068 # lb $s8, -0x6F98($zero)
/* 0x0013D84C 0x801AD44C 0x801E9054 */ .word 0x801E9054 # lb $s8, -0x6FAC($zero)
/* 0x0013D850 0x801AD450 0x00000000 */ .word 0x00000000 # nop
/* 0x0013D854 0x801AD454 0x00000000 */ .word 0x00000000 # nop
/* 0x0013D858 0x801AD458 0x801E90B8 */ .word 0x801E90B8 # lb $s8, -0x6F48($zero)
/* 0x0013D85C 0x801AD45C 0x00000000 */ .word 0x00000000 # nop
/* 0x0013D860 0x801AD460 0x801E90A0 */ .word 0x801E90A0 # lb $s8, -0x6F60($zero)
/* 0x0013D864 0x801AD464 0x801E90D0 */ .word 0x801E90D0 # lb $s8, -0x6F30($zero)
/* 0x0013D868 0x801AD468 0x801E90D0 */ .word 0x801E90D0 # lb $s8, -0x6F30($zero)
/* 0x0013D86C 0x801AD46C 0x00000000 */ .word 0x00000000 # nop
/* 0x0013D870 0x801AD470 0x00000000 */ .word 0x00000000 # nop
/* 0x0013D874 0x801AD474 0x801E9078 */ .word 0x801E9078 # lb $s8, -0x6F88($zero)
/* 0x0013D878 0x801AD478 0x801E908C */ .word 0x801E908C # lb $s8, -0x6F74($zero)
/* 0x0013D87C 0x801AD47C 0x00000000 */ .word 0x00000000 # nop
