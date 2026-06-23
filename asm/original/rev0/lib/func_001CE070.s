/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001CE070..0x001CE0C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless helper after data island: starts 0x1CE070, uses branch/jump arithmetic cases, returns at 0x1CE0BC with delay @0x1CE0C0. */
func_001CE070:
/* 0x001CE070 0x8023DC70 0x24020003 */ .word 0x24020003 # addiu $v0, $zero, 0x3
/* 0x001CE074 0x8023DC74 0x54820005 */ .word 0x54820005 # bnel $a0, $v0, 0x8023DC8C
/* 0x001CE078 0x8023DC78 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x001CE07C 0x8023DC7C 0x24A20003 */ .word 0x24A20003 # addiu $v0, $a1, 0x3
/* 0x001CE080 0x8023DC80 0x00021082 */ .word 0x00021082 # srl $v0, $v0, 2
/* 0x001CE084 0x8023DC84 0x08065EEF */ .word 0x08065EEF # j 0x80197BBC
/* 0x001CE088 0x8023DC88 0x00021100 */ .word 0x00021100 # sll $v0, $v0, 4
/* 0x001CE08C 0x8023DC8C 0x54820004 */ .word 0x54820004 # bnel $a0, $v0, 0x8023DCA0
/* 0x001CE090 0x8023DC90 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x001CE094 0x8023DC94 0x24A20003 */ .word 0x24A20003 # addiu $v0, $a1, 0x3
/* 0x001CE098 0x8023DC98 0x08065EEE */ .word 0x08065EEE # j 0x80197BB8
/* 0x001CE09C 0x8023DC9C 0x00021082 */ .word 0x00021082 # srl $v0, $v0, 2
/* 0x001CE0A0 0x8023DCA0 0x10820003 */ .word 0x10820003 # beq $a0, $v0, 0x8023DCB0
/* 0x001CE0A4 0x8023DCA4 0x24A2000F */ .word 0x24A2000F # addiu $v0, $a1, 0xF
/* 0x001CE0A8 0x8023DCA8 0x08065EEE */ .word 0x08065EEE # j 0x80197BB8
/* 0x001CE0AC 0x8023DCAC 0x00021102 */ .word 0x00021102 # srl $v0, $v0, 4
/* 0x001CE0B0 0x8023DCB0 0x24A20007 */ .word 0x24A20007 # addiu $v0, $a1, 0x7
/* 0x001CE0B4 0x8023DCB4 0x000210C2 */ .word 0x000210C2 # srl $v0, $v0, 3
/* 0x001CE0B8 0x8023DCB8 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x001CE0BC 0x8023DCBC 0x03E00008 */ .word 0x03E00008 # jr $ra

/* function boundary candidate: func_001CE0C0, size=84, kind=leaf */
func_001CE0C0:
/* 0x001CE0C0 0x8023DCC0 0x00000000 */ .word 0x00000000 # nop
