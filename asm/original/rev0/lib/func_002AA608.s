/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AA608..0x002AA62C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf (no prologue; lw $v1,0xE8($a0) entry). Internal bne to 0x002AA624. Ends jr $ra 0x002AA624 + delay nop 0x002AA628. */
/* 0x002AA608 0x8031A208 0x8C8300E8 */ .word 0x8C8300E8 # lw $v1, 0xE8($a0)
/* 0x002AA60C 0x8031A20C 0x2462FFAF */ .word 0x2462FFAF # addiu $v0, $v1, -0x51
/* 0x002AA610 0x8031A210 0x2C420003 */ .word 0x2C420003 # sltiu $v0, $v0, 0x3
/* 0x002AA614 0x8031A214 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8031A224
/* 0x002AA618 0x8031A218 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x002AA61C 0x8031A21C 0x386200A3 */ .word 0x386200A3 # xori $v0, $v1, 0x00A3
/* 0x002AA620 0x8031A220 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x002AA624 0x8031A224 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AA628 0x8031A228 0x00000000 */ .word 0x00000000 # nop
