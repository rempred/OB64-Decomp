/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A13C4..0x002A13EC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor: lui/lw/sll/addu/lw/beql/lh, jr$ra@0x002A13E4 + delay nop@0x002A13E8. */
func_002A13C4:
/* 0x002A13C4 0x80310FC4 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002A13C8 0x80310FC8 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002A13CC 0x80310FCC 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x002A13D0 0x80310FD0 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x002A13D4 0x80310FD4 0x8C8200F8 */ .word 0x8C8200F8 # lw $v0, 0xF8($a0)
/* 0x002A13D8 0x80310FD8 0x50400002 */ .word 0x50400002 # beql $v0, $zero, 0x80310FE4
/* 0x002A13DC 0x80310FDC 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002A13E0 0x80310FE0 0x8442000C */ .word 0x8442000C # lh $v0, 0xC($v0)
/* 0x002A13E4 0x80310FE4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A13E8 0x80310FE8 0x00000000 */ .word 0x00000000 # nop
