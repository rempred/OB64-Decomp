/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001CE114..0x001CE174 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless helper: starts 0x1CE114, includes mult/mflo tail, returns at 0x1CE16C with delay @0x1CE170. Parent 0x1CE168 tiny-utility label is internal. */
func_001CE114:
/* 0x001CE114 0x8023DD14 0x24020003 */ .word 0x24020003 # addiu $v0, $zero, 0x3
/* 0x001CE118 0x8023DD18 0x54820005 */ .word 0x54820005 # bnel $a0, $v0, 0x8023DD30
/* 0x001CE11C 0x8023DD1C 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x001CE120 0x8023DD20 0x24A20003 */ .word 0x24A20003 # addiu $v0, $a1, 0x3
/* 0x001CE124 0x8023DD24 0x00021082 */ .word 0x00021082 # srl $v0, $v0, 2
/* 0x001CE128 0x8023DD28 0x08065F18 */ .word 0x08065F18 # j 0x80197C60
/* 0x001CE12C 0x8023DD2C 0x00021100 */ .word 0x00021100 # sll $v0, $v0, 4
/* 0x001CE130 0x8023DD30 0x54820004 */ .word 0x54820004 # bnel $a0, $v0, 0x8023DD44
/* 0x001CE134 0x8023DD34 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x001CE138 0x8023DD38 0x24A20003 */ .word 0x24A20003 # addiu $v0, $a1, 0x3
/* 0x001CE13C 0x8023DD3C 0x08065F17 */ .word 0x08065F17 # j 0x80197C5C
/* 0x001CE140 0x8023DD40 0x00021082 */ .word 0x00021082 # srl $v0, $v0, 2
/* 0x001CE144 0x8023DD44 0x54820004 */ .word 0x54820004 # bnel $a0, $v0, 0x8023DD58
/* 0x001CE148 0x8023DD48 0x24A2000F */ .word 0x24A2000F # addiu $v0, $a1, 0xF
/* 0x001CE14C 0x8023DD4C 0x24A20007 */ .word 0x24A20007 # addiu $v0, $a1, 0x7
/* 0x001CE150 0x8023DD50 0x08065F17 */ .word 0x08065F17 # j 0x80197C5C
/* 0x001CE154 0x8023DD54 0x000210C2 */ .word 0x000210C2 # srl $v0, $v0, 3
/* 0x001CE158 0x8023DD58 0x00021102 */ .word 0x00021102 # srl $v0, $v0, 4
/* 0x001CE15C 0x8023DD5C 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x001CE160 0x8023DD60 0x00000000 */ .word 0x00000000 # nop
/* 0x001CE164 0x8023DD64 0x00460018 */ .word 0x00460018 # mult $v0, $a2

/* function boundary candidate: func_001CE168, size=12, kind=leaf */
func_001CE168:
/* 0x001CE168 0x8023DD68 0x00001012 */ .word 0x00001012 # mflo $v0
/* 0x001CE16C 0x8023DD6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001CE170 0x8023DD70 0x00000000 */ .word 0x00000000 # nop
