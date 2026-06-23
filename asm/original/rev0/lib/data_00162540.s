/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00162540..0x00162568 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 0xDF000000 0x00000000 marker then a small high-entropy record: 0x00015B3F,0x5B315C77,0x5DBFA6AF,0xBF7563D9,0x749795D7,0xD697F763,0xEE26F7BD,0x5295FFFF. Ends in 0xFFFF; no ascii. HYPOTHESIS: packed header/ramp row. [name-token: data_00162540_block_DF]. */
/* 0x00162540 0x801D2140 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00162544 0x801D2144 0x00000000 */ .word 0x00000000 # nop
/* 0x00162548 0x801D2148 0x00015B3F */ .word 0x00015B3F # dsra32 $t3, $at, 12
/* 0x0016254C 0x801D214C 0x5B315C77 */ .word 0x5B315C77 # blezl $t9, 0x801E932C
/* 0x00162550 0x801D2150 0x5DBFA6AF */ .word 0x5DBFA6AF # bgtzl $t5, 0x801BBC10
/* 0x00162554 0x801D2154 0xBF7563D9 */ .word 0xBF7563D9 # cache 0x15, 0x63D9($k1)
/* 0x00162558 0x801D2158 0x749795D7 */ .word 0x749795D7 # op_0x1D
/* 0x0016255C 0x801D215C 0xD697F763 */ .word 0xD697F763 # ldc1 $f23, -0x89D($s4)
/* 0x00162560 0x801D2160 0xEE26F7BD */ .word 0xEE26F7BD # op_0x3B
/* 0x00162564 0x801D2164 0x5295FFFF */ .word 0x5295FFFF # beql $s4, $s5, 0x801D2164
