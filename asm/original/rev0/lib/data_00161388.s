/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00161388..0x001613B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Short transitional high-entropy block immediately after the packed-byte stream ends. Raw words 0x00110000,0x26163606,0x46263319,0x400C2613,0x39004C26,0x2329202C,0x23163609,0x49281434,0x08482916,0x36034324,0x18380444,0x00000000. Mixed byte values, no floats/pointers/ascii; ends just before a 0xDF000000 marker. HYPOTHESIS: a small packed parameter/header table preceding the first 0xDF-delimited asset block. [name-token: data_00161388_intro]. */
/* 0x00161388 0x801D0F88 0x00110000 */ .word 0x00110000 # sll $zero, $s1, 0
/* 0x0016138C 0x801D0F8C 0x26163606 */ .word 0x26163606 # addiu $s6, $s0, 0x3606
/* 0x00161390 0x801D0F90 0x46263319 */ .word 0x46263319 # cop1_0x19.d
/* 0x00161394 0x801D0F94 0x400C2613 */ .word 0x400C2613 # mfc0 $t4, $4
/* 0x00161398 0x801D0F98 0x39004C26 */ .word 0x39004C26 # xori $zero, $t0, 0x4C26
/* 0x0016139C 0x801D0F9C 0x2329202C */ .word 0x2329202C # addi $t1, $t9, 0x202C
/* 0x001613A0 0x801D0FA0 0x23163609 */ .word 0x23163609 # addi $s6, $t8, 0x3609
/* 0x001613A4 0x801D0FA4 0x49281434 */ .word 0x49281434 # op_0x12
/* 0x001613A8 0x801D0FA8 0x08482916 */ .word 0x08482916 # j 0x8120A458
/* 0x001613AC 0x801D0FAC 0x36034324 */ .word 0x36034324 # ori $v1, $s0, 0x4324
/* 0x001613B0 0x801D0FB0 0x18380444 */ .word 0x18380444 # blez $at, 0x801D20C4
/* 0x001613B4 0x801D0FB4 0x00000000 */ .word 0x00000000 # nop
