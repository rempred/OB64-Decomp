/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x00100FD4..0x00101000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): OUTGOING DATA CONTINUATION into chunk 16. Fifth 0x50-byte float-record begins at 0x100FD4 (header 0x00000004,0x00000064,0x00000001,0,0x00000001,0x000200F0,0x00F00000,0x00A80000, then floats 0xC2040000=-33, 0xC2380000=-46, 0x00000000) but is TRUNCATED at the chunk-15 edge 0x101000 after only 11 of 20 words. The record continues into chunk 16: 0x101000 = 0x42340000 (float 45.0) is word[11] of THIS record. Tail will be data_<...>_chunk16tail starting at 0x101000. Ends exactly at 0x00101000.. */
/* 0x00100FD4 0x80170BD4 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x00100FD8 0x80170BD8 0x00000064 */ .word 0x00000064 # and $zero, $zero, $zero
/* 0x00100FDC 0x80170BDC 0x00000001 */ .word 0x00000001 # special_0x01
/* 0x00100FE0 0x80170BE0 0x00000000 */ .word 0x00000000 # nop
/* 0x00100FE4 0x80170BE4 0x00000001 */ .word 0x00000001 # special_0x01
/* 0x00100FE8 0x80170BE8 0x000200F0 */ .word 0x000200F0 # tge $zero, $v0
/* 0x00100FEC 0x80170BEC 0x00F00000 */ .word 0x00F00000 # sll $zero, $s0, 0
/* 0x00100FF0 0x80170BF0 0x00A80000 */ .word 0x00A80000 # sll $zero, $t0, 0
/* 0x00100FF4 0x80170BF4 0xC2040000 */ .word 0xC2040000 # ll $a0, 0x0($s0)
/* 0x00100FF8 0x80170BF8 0xC2380000 */ .word 0xC2380000 # ll $t8, 0x0($s1)
/* 0x00100FFC 0x80170BFC 0x00000000 */ .word 0x00000000 # nop
