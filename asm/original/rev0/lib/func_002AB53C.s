/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AB53C..0x002AB558 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed wrapper: jal 0x8023BDF8, jr $ra at 0x002AB550 + addiu $sp delay slot at 0x002AB554. */
/* function boundary candidate: func_002AB53C, size=56, kind=prologue */
func_002AB53C:
/* 0x002AB53C 0x8031B13C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002AB540 0x8031B140 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002AB544 0x8031B144 0x0C08EF7E */ .word 0x0C08EF7E # jal 0x8023BDF8
/* 0x002AB548 0x8031B148 0x00000000 */ .word 0x00000000 # nop
/* 0x002AB54C 0x8031B14C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002AB550 0x8031B150 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AB554 0x8031B154 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
