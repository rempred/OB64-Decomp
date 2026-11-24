/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C164..0x0020C180 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless range predicate (obj+0x4C in -0x47..); jr$ra at C178/delay C17C. */
/* 0x0020C164 0x8027BD64 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BD78
/* 0x0020C168 0x8027BD68 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C16C 0x8027BD6C 0x8C82004C */ .word 0x8C82004C # lw $v0, 0x4C($a0)
/* 0x0020C170 0x8027BD70 0x2442FFB9 */ .word 0x2442FFB9 # addiu $v0, $v0, -0x47
/* 0x0020C174 0x8027BD74 0x2C420002 */ .word 0x2C420002 # sltiu $v0, $v0, 0x2
/* 0x0020C178 0x8027BD78 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C17C 0x8027BD7C 0x00000000 */ .word 0x00000000 # nop
