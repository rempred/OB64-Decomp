/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001EAF0..0x0001EB10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001EAF0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001eaf0:
/* 0x0001EAF0 0x8008E6F0 0xAC800000 */ .word 0xAC800000 # sw $zero, 0x0($a0)
/* 0x0001EAF4 0x8008E6F4 0xAC850004 */ .word 0xAC850004 # sw $a1, 0x4($a0)
/* 0x0001EAF8 0x8008E6F8 0xAC860008 */ .word 0xAC860008 # sw $a2, 0x8($a0)
/* 0x0001EAFC 0x8008E6FC 0xA480000C */ .word 0xA480000C # sh $zero, 0xC($a0)
/* 0x0001EB00 0x8008E700 0xA480000E */ .word 0xA480000E # sh $zero, 0xE($a0)
/* 0x0001EB04 0x8008E704 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001EB08 0x8008E708 0xAC870010 */ .word 0xAC870010 # sw $a3, 0x10($a0)
/* 0x0001EB0C 0x8008E70C 0x00000000 */ .word 0x00000000 # nop
