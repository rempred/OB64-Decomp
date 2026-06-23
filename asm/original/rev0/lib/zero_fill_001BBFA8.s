/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BBFA8..0x001BBFB0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 8 bytes inter-function alignment padding: two 0x00000000 words (nop) at 0x1BBFA8/0x1BBFAC, unreachable between func_001BBF94's jr+delay and func_001BBFB0's prologue. The SPECIAL '8B gap'.. */
/* 0x001BBFA8 0x8022BBA8 0x00000000 */ .word 0x00000000 # nop
/* 0x001BBFAC 0x8022BBAC 0x00000000 */ .word 0x00000000 # nop
