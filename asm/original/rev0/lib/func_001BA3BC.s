/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BA3BC..0x001BA3E4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (non-prologue fall-through after func_001BA384 jr-ra delay). lui 0x8023 / lw -0x5DEC indexed dispatch; j 0x802212BC is an overlay tail-jump (INTERNAL). jr ra at 0x001BA3DC + delay (addu) at 0x001BA3E0. */
func_001BA3BC:
/* 0x001BA3BC 0x80229FBC 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x001BA3C0 0x80229FC0 0x8C42A214 */ .word 0x8C42A214 # lw $v0, -0x5DEC($v0)
/* 0x001BA3C4 0x80229FC4 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x80229FD4
/* 0x001BA3C8 0x80229FC8 0x00041880 */ .word 0x00041880 # sll $v1, $a0, 2
/* 0x001BA3CC 0x80229FCC 0x080884AF */ .word 0x080884AF # j 0x802212BC
/* 0x001BA3D0 0x80229FD0 0x00000000 */ .word 0x00000000 # nop
/* 0x001BA3D4 0x80229FD4 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x001BA3D8 0x80229FD8 0x8C630000 */ .word 0x8C630000 # lw $v1, 0x0($v1)
/* 0x001BA3DC 0x80229FDC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BA3E0 0x80229FE0 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
