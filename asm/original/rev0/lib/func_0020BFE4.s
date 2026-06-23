/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BFE4..0x0020BFF8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: lui$v0,0x800F/lbu/xori; jr$ra at BFF0/delay BFF4 sltiu. */
/* 0x0020BFE4 0x8027BBE4 0x3C02800F */ .word 0x3C02800F # lui $v0, 0x800F
/* 0x0020BFE8 0x8027BBE8 0x90429C12 */ .word 0x90429C12 # lbu $v0, -0x63EE($v0)
/* 0x0020BFEC 0x8027BBEC 0x38420001 */ .word 0x38420001 # xori $v0, $v0, 0x0001
/* 0x0020BFF0 0x8027BBF0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BFF4 0x8027BBF4 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
