/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AD420..0x002AD434 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless tiny accessor (lui 0x8023 / lw / lw 0x1CA8 / jr $ra 0x002AD42C + sltu delay). Un-merged from over-merged idx32. */
/* 0x002AD420 0x8031D020 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002AD424 0x8031D024 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002AD428 0x8031D028 0x8C421CA8 */ .word 0x8C421CA8 # lw $v0, 0x1CA8($v0)
/* 0x002AD42C 0x8031D02C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AD430 0x8031D030 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
