/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142900..0x00142950 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed records with high-bit bytes; two identical 0x24-byte (9-word) blocks beginning 0x91E596EC 82B382F1 81498343 .. 0x0A000000, the block repeated at 0x142924. High-bit byte pattern looks like Shift-JIS text or an index blob (hypothesis: paired-language label data). Not pointers/floats/7-bit-ascii. 2 trailing zero words at 0x142948. [name-token: data_packed_highbit_blob]. */
/* 0x00142900 0x801B2500 0x91E596EC */ .word 0x91E596EC # lbu $a1, -0x6914($t7)
/* 0x00142904 0x801B2504 0x82B382F1 */ .word 0x82B382F1 # lb $s3, -0x7D0F($s5)
/* 0x00142908 0x801B2508 0x81498343 */ .word 0x81498343 # lb $t1, -0x7CBD($t2)
/* 0x0014290C 0x801B250C 0x83788393 */ .word 0x83788393 # lb $t8, -0x7C6D($k1)
/* 0x00142910 0x801B2510 0x836782AA */ .word 0x836782AA # lb $a3, -0x7D56($k1)
/* 0x00142914 0x801B2514 0x82A082E8 */ .word 0x82A082E8 # lb $zero, -0x7D18($s5)
/* 0x00142918 0x801B2518 0x82DC82B9 */ .word 0x82DC82B9 # lb $gp, -0x7D47($s6)
/* 0x0014291C 0x801B251C 0x82F18149 */ .word 0x82F18149 # lb $s1, -0x7EB7($s7)
/* 0x00142920 0x801B2520 0x0A000000 */ .word 0x0A000000 # j 0x88000000
/* 0x00142924 0x801B2524 0x88C993A1 */ .word 0x88C993A1 # lwl $t1, -0x6C5F($a2)
/* 0x00142928 0x801B2528 0x82B382F1 */ .word 0x82B382F1 # lb $s3, -0x7D0F($s5)
/* 0x0014292C 0x801B252C 0x81498343 */ .word 0x81498343 # lb $t1, -0x7CBD($t2)
/* 0x00142930 0x801B2530 0x83788393 */ .word 0x83788393 # lb $t8, -0x7C6D($k1)
/* 0x00142934 0x801B2534 0x836782AA */ .word 0x836782AA # lb $a3, -0x7D56($k1)
/* 0x00142938 0x801B2538 0x82A082E8 */ .word 0x82A082E8 # lb $zero, -0x7D18($s5)
/* 0x0014293C 0x801B253C 0x82DC82B9 */ .word 0x82DC82B9 # lb $gp, -0x7D47($s6)
/* 0x00142940 0x801B2540 0x82F18149 */ .word 0x82F18149 # lb $s1, -0x7EB7($s7)
/* 0x00142944 0x801B2544 0x0A000000 */ .word 0x0A000000 # j 0x88000000
/* 0x00142948 0x801B2548 0x00000000 */ .word 0x00000000 # nop
/* 0x0014294C 0x801B254C 0x00000000 */ .word 0x00000000 # nop
