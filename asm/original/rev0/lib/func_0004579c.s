/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004579C..0x000457B4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x457AC */
func_0004579c:
/* 0x0004579C 0x800B539C 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000457A0 0x800B53A0 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000457A4 0x800B53A4 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000457A8 0x800B53A8 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000457AC 0x800B53AC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000457B0 0x800B53B0 0x8042C421 */ .word 0x8042C421 # lb $v0, -0x3BDF($v0)
