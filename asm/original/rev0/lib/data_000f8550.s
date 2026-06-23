/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000F8550..0x000F8570 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Opening IEEE-754 float32 constant table: 47.0, 1.3333334, 1.0, 160.0, 2.0, 0.0, 3.0, 20.0. Same 5-word header (47.0/1.333/1.0/160.0/2.0) recurs at 0xF86C0; likely shared per-effect parameter block.. */
/* 0x000F8550 0x80168150 0x423C0000 */ .word 0x423C0000 # cop0_0x11
/* 0x000F8554 0x80168154 0x3FAAAAAB */ .word 0x3FAAAAAB # lui $t2, 0xAAAB
/* 0x000F8558 0x80168158 0x3F800000 */ .word 0x3F800000 # lui $zero, 0x0000
/* 0x000F855C 0x8016815C 0x43200000 */ .word 0x43200000 # cop0_0x19
/* 0x000F8560 0x80168160 0x40000000 */ .word 0x40000000 # mfc0 $zero, $0
/* 0x000F8564 0x80168164 0x00000000 */ .word 0x00000000 # nop
/* 0x000F8568 0x80168168 0x40400000 */ .word 0x40400000 # cop0_0x02
/* 0x000F856C 0x8016816C 0x41A00000 */ .word 0x41A00000 # cop0_0x0D
