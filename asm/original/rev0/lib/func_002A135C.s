/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A135C..0x002A1380 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: lui/lw/sll/addu/lw, bnel, sb, jr$ra@0x002A1378 + delay nop@0x002A137C. */
func_002A135C:
/* 0x002A135C 0x80310F5C 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002A1360 0x80310F60 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002A1364 0x80310F64 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x002A1368 0x80310F68 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x002A136C 0x80310F6C 0x8C8200F8 */ .word 0x8C8200F8 # lw $v0, 0xF8($a0)
/* 0x002A1370 0x80310F70 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x80310F78
/* 0x002A1374 0x80310F74 0xA045000E */ .word 0xA045000E # sb $a1, 0xE($v0)
/* 0x002A1378 0x80310F78 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A137C 0x80310F7C 0x00000000 */ .word 0x00000000 # nop
