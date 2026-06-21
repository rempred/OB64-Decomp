/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014808..0x00014814 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014808 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014808:
/* 0x00014808 0x80084408 0xA08000D6 */ .word 0xA08000D6 # sb $zero, 0xD6($a0)
/* 0x0001480C 0x8008440C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014810 0x80084410 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
