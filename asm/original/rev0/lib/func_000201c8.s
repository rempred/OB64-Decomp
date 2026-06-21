/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000201C8..0x000201E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000201C8 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000201c8:
/* 0x000201C8 0x8008FDC8 0x3C03800B */ .word 0x3C03800B # lui $v1, 0x800B
/* 0x000201CC 0x8008FDCC 0x8C63A710 */ .word 0x8C63A710 # lw $v1, -0x58F0($v1)
/* 0x000201D0 0x8008FDD0 0x8C62002C */ .word 0x8C62002C # lw $v0, 0x2C($v1)
/* 0x000201D4 0x8008FDD4 0xAC820000 */ .word 0xAC820000 # sw $v0, 0x0($a0)
/* 0x000201D8 0x8008FDD8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000201DC 0x8008FDDC 0xAC64002C */ .word 0xAC64002C # sw $a0, 0x2C($v1)
