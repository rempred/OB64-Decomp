/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000C1000_000D1000.s
 * z64 range: 0x000C5518..0x000C5540 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* recovered frameless leaf; reads $a0, lhu 0xEA, srl $v1,$v0,15 flag; jr $ra@0xC5538 */
func_000c5518:
/* 0x000C5518 0x80135118 0x10800007 */ .word 0x10800007 # beq $a0, $zero, 0x80135138
/* 0x000C551C 0x8013511C 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x000C5520 0x80135120 0x948200EA */ .word 0x948200EA # lhu $v0, 0xEA($a0)
/* 0x000C5524 0x80135124 0x14400004 */ .word 0x14400004 # bne $v0, $zero, 0x80135138
/* 0x000C5528 0x80135128 0x00000000 */ .word 0x00000000 # nop
/* 0x000C552C 0x8013512C 0x3C02800F */ .word 0x3C02800F # lui $v0, 0x800F
/* 0x000C5530 0x80135130 0x94428100 */ .word 0x94428100 # lhu $v0, -0x7F00($v0)
/* 0x000C5534 0x80135134 0x00021BC2 */ .word 0x00021BC2 # srl $v1, $v0, 15
/* 0x000C5538 0x80135138 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000C553C 0x8013513C 0x00601021 */ .word 0x00601021 # move $v0, $v1
