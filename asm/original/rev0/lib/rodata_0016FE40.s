/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x0016FE40..0x0016FE84 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): NUL-terminated ASCII UI prompt strings. Decoded: "Is this acceptable?\0" (0x0016FE40), "The current action will be\0" (0x0016FE54), "canceled. Proceed?\0" (0x0016FE70). Raw words e.g. 0x49732074 0x68697320 0x61636365 0x70746162 0x6C653F00. [name-token: rodata_0016FE40_prompts]. */
/* 0x0016FE40 0x801DFA40 0x49732074 */ .word 0x49732074 # op_0x12
/* 0x0016FE44 0x801DFA44 0x68697320 */ .word 0x68697320 # ldl $t1, 0x7320($v1)
/* 0x0016FE48 0x801DFA48 0x61636365 */ .word 0x61636365 # daddi $v1, $t3, 0x6365
/* 0x0016FE4C 0x801DFA4C 0x70746162 */ .word 0x70746162 # op_0x1C
/* 0x0016FE50 0x801DFA50 0x6C653F00 */ .word 0x6C653F00 # ldr $a1, 0x3F00($v1)
/* 0x0016FE54 0x801DFA54 0x54686520 */ .word 0x54686520 # bnel $v1, $t0, 0x801F8ED8
/* 0x0016FE58 0x801DFA58 0x63757272 */ .word 0x63757272 # daddi $s5, $k1, 0x7272
/* 0x0016FE5C 0x801DFA5C 0x656E7420 */ .word 0x656E7420 # daddiu $t6, $t3, 0x7420
/* 0x0016FE60 0x801DFA60 0x61637469 */ .word 0x61637469 # daddi $v1, $t3, 0x7469
/* 0x0016FE64 0x801DFA64 0x6F6E2077 */ .word 0x6F6E2077 # ldr $t6, 0x2077($k1)
/* 0x0016FE68 0x801DFA68 0x696C6C20 */ .word 0x696C6C20 # ldl $t4, 0x6C20($t3)
/* 0x0016FE6C 0x801DFA6C 0x62650000 */ .word 0x62650000 # daddi $a1, $s3, 0x0
/* 0x0016FE70 0x801DFA70 0x63616E63 */ .word 0x63616E63 # daddi $at, $k1, 0x6E63
/* 0x0016FE74 0x801DFA74 0x656C6564 */ .word 0x656C6564 # daddiu $t4, $t3, 0x6564
/* 0x0016FE78 0x801DFA78 0x2E205072 */ .word 0x2E205072 # sltiu $zero, $s1, 0x5072
/* 0x0016FE7C 0x801DFA7C 0x6F636565 */ .word 0x6F636565 # ldr $v1, 0x6565($k1)
/* 0x0016FE80 0x801DFA80 0x643F0000 */ .word 0x643F0000 # daddiu $ra, $at, 0x0
