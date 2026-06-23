/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x0016FE84..0x0016FEB0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small non-printable packed binary interspersed between ASCII blocks (high-bit-set bytes, not text, not aligned pointers). Raw: 0x82C882B5 0x00000000 0x90CF8BC9 0x8D558C82 0x00000000 0x8FC18BC9 0x8D558C82 0x00000000 0x834A8358 0x835E8380 0x00000000. Hypothesis: small per-stat/per-label binary records adjacent to the Dir./Hit. labels that follow; not verified. [name-token: data_0016FE84_packed]. */
/* 0x0016FE84 0x801DFA84 0x82C882B5 */ .word 0x82C882B5 # lb $t0, -0x7D4B($s6)
/* 0x0016FE88 0x801DFA88 0x00000000 */ .word 0x00000000 # nop
/* 0x0016FE8C 0x801DFA8C 0x90CF8BC9 */ .word 0x90CF8BC9 # lbu $t7, -0x7437($a2)
/* 0x0016FE90 0x801DFA90 0x8D558C82 */ .word 0x8D558C82 # lw $s5, -0x737E($t2)
/* 0x0016FE94 0x801DFA94 0x00000000 */ .word 0x00000000 # nop
/* 0x0016FE98 0x801DFA98 0x8FC18BC9 */ .word 0x8FC18BC9 # lw $at, -0x7437($s8)
/* 0x0016FE9C 0x801DFA9C 0x8D558C82 */ .word 0x8D558C82 # lw $s5, -0x737E($t2)
/* 0x0016FEA0 0x801DFAA0 0x00000000 */ .word 0x00000000 # nop
/* 0x0016FEA4 0x801DFAA4 0x834A8358 */ .word 0x834A8358 # lb $t2, -0x7CA8($k0)
/* 0x0016FEA8 0x801DFAA8 0x835E8380 */ .word 0x835E8380 # lb $s8, -0x7C80($k0)
/* 0x0016FEAC 0x801DFAAC 0x00000000 */ .word 0x00000000 # nop
