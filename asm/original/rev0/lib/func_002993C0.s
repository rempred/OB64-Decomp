/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x002993C0..0x002993EC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf recovered from over-merge: reads 0x800F8100 flags, sltu/subu; j 0x8023D470 internal; jr $ra 0x2993E4 + delay move 0x2993E8. */
func_002993C0:
/* 0x002993C0 0x80308FC0 0x3C02800F */ .word 0x3C02800F # lui $v0, 0x800F
/* 0x002993C4 0x80308FC4 0x94428100 */ .word 0x94428100 # lhu $v0, -0x7F00($v0)
/* 0x002993C8 0x80308FC8 0x3042C000 */ .word 0x3042C000 # andi $v0, $v0, 0xC000
/* 0x002993CC 0x80308FCC 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x80308FE4
/* 0x002993D0 0x80308FD0 0x2403FFFF */ .word 0x2403FFFF # addiu $v1, $zero, -0x1
/* 0x002993D4 0x80308FD4 0x84820018 */ .word 0x84820018 # lh $v0, 0x18($a0)
/* 0x002993D8 0x80308FD8 0x384200FF */ .word 0x384200FF # xori $v0, $v0, 0x00FF
/* 0x002993DC 0x80308FDC 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x002993E0 0x80308FE0 0x00021823 */ .word 0x00021823 # subu $v1, $zero, $v0
/* 0x002993E4 0x80308FE4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002993E8 0x80308FE8 0x00601021 */ .word 0x00601021 # move $v0, $v1
