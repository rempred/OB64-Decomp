/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00163480..0x001634A8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 0xDF000000 0x00000000 marker then four 0x00010001 halfword-pair words (0x163488..0x163494) followed by 0x290794D3,0x418B6A53,0xEF71F780,0xF7B5FFFF. Short 0x0001-fill header then a high-byte ramp tail. HYPOTHESIS: packed index header + ramp; no ascii. [name-token: data_00163480_table_0001]. */
/* 0x00163480 0x801D3080 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00163484 0x801D3084 0x00000000 */ .word 0x00000000 # nop
/* 0x00163488 0x801D3088 0x00010001 */ .word 0x00010001 # special_0x01
/* 0x0016348C 0x801D308C 0x00010001 */ .word 0x00010001 # special_0x01
/* 0x00163490 0x801D3090 0x00010001 */ .word 0x00010001 # special_0x01
/* 0x00163494 0x801D3094 0x00010001 */ .word 0x00010001 # special_0x01
/* 0x00163498 0x801D3098 0x290794D3 */ .word 0x290794D3 # slti $a3, $t0, -0x6B2D
/* 0x0016349C 0x801D309C 0x418B6A53 */ .word 0x418B6A53 # cop0_0x0C
/* 0x001634A0 0x801D30A0 0xEF71F780 */ .word 0xEF71F780 # op_0x3B
/* 0x001634A4 0x801D30A4 0xF7B5FFFF */ .word 0xF7B5FFFF # sdc1 $f21, -0x1($sp)
