/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A8958..0x002A89B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Mixed small-int / packed data: zero words, 0x0000000C/0x0000000D, byte-pairs (0x000A00E6,0x00E600E6,0x00C80000), then a short ascending sequence 0x00000002,0x00000003,0x00000001,0x00000003..0x00000006 (index/count lists). Followed by float-pool start.. */
/* 0x002A8958 0x80318558 0x00000000 */ .word 0x00000000 # nop
/* 0x002A895C 0x8031855C 0x00000000 */ .word 0x00000000 # nop
/* 0x002A8960 0x80318560 0x0000000C */ .word 0x0000000C # syscall 0x00000
/* 0x002A8964 0x80318564 0x0000000D */ .word 0x0000000D # break 0x00000
/* 0x002A8968 0x80318568 0x00000000 */ .word 0x00000000 # nop
/* 0x002A896C 0x8031856C 0x00000000 */ .word 0x00000000 # nop
/* 0x002A8970 0x80318570 0x000A00E6 */ .word 0x000A00E6 # xor $zero, $zero, $t2
/* 0x002A8974 0x80318574 0x00E600E6 */ .word 0x00E600E6 # xor $zero, $a3, $a2
/* 0x002A8978 0x80318578 0x00C80000 */ .word 0x00C80000 # sll $zero, $t0, 0
/* 0x002A897C 0x8031857C 0x000A0000 */ .word 0x000A0000 # sll $zero, $t2, 0
/* 0x002A8980 0x80318580 0x00000000 */ .word 0x00000000 # nop
/* 0x002A8984 0x80318584 0x00000000 */ .word 0x00000000 # nop
/* 0x002A8988 0x80318588 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x002A898C 0x8031858C 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x002A8990 0x80318590 0x00000000 */ .word 0x00000000 # nop
/* 0x002A8994 0x80318594 0x00000001 */ .word 0x00000001 # special_0x01
/* 0x002A8998 0x80318598 0x00000000 */ .word 0x00000000 # nop
/* 0x002A899C 0x8031859C 0x00000000 */ .word 0x00000000 # nop
/* 0x002A89A0 0x803185A0 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x002A89A4 0x803185A4 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x002A89A8 0x803185A8 0x00000005 */ .word 0x00000005 # special_0x05
/* 0x002A89AC 0x803185AC 0x00000006 */ .word 0x00000006 # srlv $zero, $zero, $zero
