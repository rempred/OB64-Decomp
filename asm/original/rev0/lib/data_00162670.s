/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00162670..0x00162698 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 0xDF000000 0x00000000 marker then an ascending high-byte ramp: 0x529563D7,0x84DF8397,0x95A1959D,0xA457AEE3,0xB7D7B59D,0xCD5FE5DB,0xEE26EFBB,0xF663FFFF. HYPOTHESIS: color/intensity ramp; no ascii/pointers. [name-token: data_00162670_ramp_DF]. */
/* 0x00162670 0x801D2270 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00162674 0x801D2274 0x00000000 */ .word 0x00000000 # nop
/* 0x00162678 0x801D2278 0x529563D7 */ .word 0x529563D7 # beql $s4, $s5, 0x801EB1D8
/* 0x0016267C 0x801D227C 0x84DF8397 */ .word 0x84DF8397 # lh $ra, -0x7C69($a2)
/* 0x00162680 0x801D2280 0x95A1959D */ .word 0x95A1959D # lhu $at, -0x6A63($t5)
/* 0x00162684 0x801D2284 0xA457AEE3 */ .word 0xA457AEE3 # sh $s7, -0x511D($v0)
/* 0x00162688 0x801D2288 0xB7D7B59D */ .word 0xB7D7B59D # sdr $s7, -0x4A63($s8)
/* 0x0016268C 0x801D228C 0xCD5FE5DB */ .word 0xCD5FE5DB # op_0x33
/* 0x00162690 0x801D2290 0xEE26EFBB */ .word 0xEE26EFBB # op_0x3B
/* 0x00162694 0x801D2294 0xF663FFFF */ .word 0xF663FFFF # sdc1 $f3, -0x1($s3)
