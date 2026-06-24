/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A3EFC..0x002A3F20 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED unlisted frameless accessor leaf: lui$v0,0x8023; lw$v0,-0x568C; lw$v0,0x2B8($a0); jr$ra@0x002A3F10 + delay sltu$v0,$zero,$v0 @0x002A3F14 (returns nonzero-flag); two trailing alignment nops @0x002A3F18/0x002A3F1C attach here (NOT a preamble for the next func). */
/* 0x002A3EFC 0x80313AFC 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002A3F00 0x80313B00 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002A3F04 0x80313B04 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x002A3F08 0x80313B08 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x002A3F0C 0x80313B0C 0x8C8202B8 */ .word 0x8C8202B8 # lw $v0, 0x2B8($a0)
/* 0x002A3F10 0x80313B10 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A3F14 0x80313B14 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x002A3F18 0x80313B18 0x00000000 */ .word 0x00000000 # nop
/* 0x002A3F1C 0x80313B1C 0x00000000 */ .word 0x00000000 # nop
