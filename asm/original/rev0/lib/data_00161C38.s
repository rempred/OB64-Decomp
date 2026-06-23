/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00161C38..0x00161C68 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 0xDF000000 0x00000000 marker then an ascending byte-ramp block: 0x41CB6B5B,0x6C1B759B,0x86B7851B,0x8DDB965B,0x9DA39E9B,0xA535B66B,0xCEADDEF7,0xEE26FFFF. Monotone-rising high bytes ending in 0xFFFF — looks like a color/intensity ramp (HYPOTHESIS). No ascii/pointers. [name-token: data_00161C38_ramp_DF]. */
/* 0x00161C38 0x801D1838 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00161C3C 0x801D183C 0x00000000 */ .word 0x00000000 # nop
/* 0x00161C40 0x801D1840 0x41CB6B5B */ .word 0x41CB6B5B # cop0_0x0E
/* 0x00161C44 0x801D1844 0x6C1B759B */ .word 0x6C1B759B # ldr $k1, 0x759B($zero)
/* 0x00161C48 0x801D1848 0x86B7851B */ .word 0x86B7851B # lh $s7, -0x7AE5($s5)
/* 0x00161C4C 0x801D184C 0x8DDB965B */ .word 0x8DDB965B # lw $k1, -0x69A5($t6)
/* 0x00161C50 0x801D1850 0x9DA39E9B */ .word 0x9DA39E9B # lwu $v1, -0x6165($t5)
/* 0x00161C54 0x801D1854 0xA535B66B */ .word 0xA535B66B # sh $s5, -0x4995($t1)
/* 0x00161C58 0x801D1858 0xCEADDEF7 */ .word 0xCEADDEF7 # op_0x33
/* 0x00161C5C 0x801D185C 0xEE26FFFF */ .word 0xEE26FFFF # op_0x3B
/* 0x00161C60 0x801D1860 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00161C64 0x801D1864 0x00000000 */ .word 0x00000000 # nop
