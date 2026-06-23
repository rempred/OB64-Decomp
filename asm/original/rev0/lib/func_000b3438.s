/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B3438..0x000B3448 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf stub: lui/lw + jr $ra; clears byte 0x98. */
func_000b3438:
/* 0x000B3438 0x80123038 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000B343C 0x8012303C 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000B3440 0x80123040 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B3444 0x80123044 0xA0400098 */ .word 0xA0400098 # sb $zero, 0x98($v0)
