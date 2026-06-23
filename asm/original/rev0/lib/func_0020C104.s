/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C104..0x0020C120 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless predicate (obj+0x4C==1); jr$ra at C118/delay C11C. */
/* 0x0020C104 0x8027BD04 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BD18
/* 0x0020C108 0x8027BD08 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C10C 0x8027BD0C 0x8C82004C */ .word 0x8C82004C # lw $v0, 0x4C($a0)
/* 0x0020C110 0x8027BD10 0x38420001 */ .word 0x38420001 # xori $v0, $v0, 0x0001
/* 0x0020C114 0x8027BD14 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x0020C118 0x8027BD18 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C11C 0x8027BD1C 0x00000000 */ .word 0x00000000 # nop
