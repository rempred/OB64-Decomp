/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00161EE8..0x00161F18 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 0xDF000000 0x00000000 marker then another ascending high-byte ramp: 0xDEF5EE26,0xCE6DDE19,0xBE1BA5DB,0x9DD985D9,0x9D216D37,0x845B5B75,0x6B9539F1,0x4A510883. HYPOTHESIS: color/intensity ramp or codebook row; no ascii/pointers. [name-token: data_00161EE8_ramp_DF]. */
/* 0x00161EE8 0x801D1AE8 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00161EEC 0x801D1AEC 0x00000000 */ .word 0x00000000 # nop
/* 0x00161EF0 0x801D1AF0 0xDEF5EE26 */ .word 0xDEF5EE26 # ld $s5, -0x11DA($s7)
/* 0x00161EF4 0x801D1AF4 0xCE6DDE19 */ .word 0xCE6DDE19 # op_0x33
/* 0x00161EF8 0x801D1AF8 0xBE1BA5DB */ .word 0xBE1BA5DB # cache 0x1B, -0x5A25($s0)
/* 0x00161EFC 0x801D1AFC 0x9DD985D9 */ .word 0x9DD985D9 # lwu $t9, -0x7A27($t6)
/* 0x00161F00 0x801D1B00 0x9D216D37 */ .word 0x9D216D37 # lwu $at, 0x6D37($t1)
/* 0x00161F04 0x801D1B04 0x845B5B75 */ .word 0x845B5B75 # lh $k1, 0x5B75($v0)
/* 0x00161F08 0x801D1B08 0x6B9539F1 */ .word 0x6B9539F1 # ldl $s5, 0x39F1($gp)
/* 0x00161F0C 0x801D1B0C 0x4A510883 */ .word 0x4A510883 # op_0x12
/* 0x00161F10 0x801D1B10 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00161F14 0x801D1B14 0x00000000 */ .word 0x00000000 # nop
