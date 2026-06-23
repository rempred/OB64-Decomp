/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00147FA8..0x00147FB8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (no stack frame): addiu $v0,1 / lui $at / jr $ra 0x00147FB0 / delay sb $v0,-0x25D0($at). Split out of the over-merged parent part. */
/* 0x00147FA8 0x801B7BA8 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00147FAC 0x801B7BAC 0x3C018020 */ .word 0x3C018020 # lui $at, 0x8020
/* 0x00147FB0 0x801B7BB0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00147FB4 0x801B7BB4 0xA022DA30 */ .word 0xA022DA30 # sb $v0, -0x25D0($at)
