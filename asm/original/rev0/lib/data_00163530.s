/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00163530..0x00163558 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 0xDF000000 0x00000000 marker then 0xD8CE2907,0xF7E73B85,0xD6C1DEC3,0xF78DDF23 followed by four zero words (0x00000000 x4 at 0x163548-0x163554). Short header + zero pad. HYPOTHESIS: small packed record with trailing zero fill. [name-token: data_00163530_block_DF]. */
/* 0x00163530 0x801D3130 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00163534 0x801D3134 0x00000000 */ .word 0x00000000 # nop
/* 0x00163538 0x801D3138 0xD8CE2907 */ .word 0xD8CE2907 # ldc2 $14, 0x2907($a2)
/* 0x0016353C 0x801D313C 0xF7E73B85 */ .word 0xF7E73B85 # sdc1 $f7, 0x3B85($ra)
/* 0x00163540 0x801D3140 0xD6C1DEC3 */ .word 0xD6C1DEC3 # ldc1 $f1, -0x213D($s6)
/* 0x00163544 0x801D3144 0xF78DDF23 */ .word 0xF78DDF23 # sdc1 $f13, -0x20DD($gp)
/* 0x00163548 0x801D3148 0x00000000 */ .word 0x00000000 # nop
/* 0x0016354C 0x801D314C 0x00000000 */ .word 0x00000000 # nop
/* 0x00163550 0x801D3150 0x00000000 */ .word 0x00000000 # nop
/* 0x00163554 0x801D3154 0x00000000 */ .word 0x00000000 # nop
