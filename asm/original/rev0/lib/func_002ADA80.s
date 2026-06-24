/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002ADA80..0x002ADAB4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame -0x18; clean prologue; allocates struct, stores. Ends jr $ra 0x002ADAAC + delay. */
/* function boundary candidate: func_002ADA80, size=52, kind=prologue */
func_002ADA80:
/* 0x002ADA80 0x8031D680 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002ADA84 0x8031D684 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002ADA88 0x8031D688 0x0C01C3CC */ .word 0x0C01C3CC # jal 0x80070F30
/* 0x002ADA8C 0x8031D68C 0x24040004 */ .word 0x24040004 # addiu $a0, $zero, 0x4
/* 0x002ADA90 0x8031D690 0x3C038023 */ .word 0x3C038023 # lui $v1, 0x8023
/* 0x002ADA94 0x8031D694 0x8C63A974 */ .word 0x8C63A974 # lw $v1, -0x568C($v1)
/* 0x002ADA98 0x8031D698 0xAC621CAC */ .word 0xAC621CAC # sw $v0, 0x1CAC($v1)
/* 0x002ADA9C 0x8031D69C 0x2403003C */ .word 0x2403003C # addiu $v1, $zero, 0x3C
/* 0x002ADAA0 0x8031D6A0 0xA4430000 */ .word 0xA4430000 # sh $v1, 0x0($v0)
/* 0x002ADAA4 0x8031D6A4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002ADAA8 0x8031D6A8 0xA4400002 */ .word 0xA4400002 # sh $zero, 0x2($v0)
/* 0x002ADAAC 0x8031D6AC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002ADAB0 0x8031D6B0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
