/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AB508..0x002AB53C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed (-0x18), final function in slice. j 0x8023BDD0 overlay tail-jump and jal internal. Ends jr $ra 0x002AB534 + delay 0x002AB538 = slice end. */
/* function boundary candidate: func_002AB508, size=52, kind=prologue */
func_002AB508:
/* 0x002AB508 0x8031B108 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002AB50C 0x8031B10C 0x14800005 */ .word 0x14800005 # bne $a0, $zero, 0x8031B124
/* 0x002AB510 0x8031B110 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002AB514 0x8031B114 0x240200D7 */ .word 0x240200D7 # addiu $v0, $zero, 0xD7
/* 0x002AB518 0x8031B118 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x002AB51C 0x8031B11C 0x0808EF74 */ .word 0x0808EF74 # j 0x8023BDD0
/* 0x002AB520 0x8031B120 0xA022A980 */ .word 0xA022A980 # sb $v0, -0x5680($at)
/* 0x002AB524 0x8031B124 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x002AB528 0x8031B128 0x0C089EE0 */ .word 0x0C089EE0 # jal 0x80227B80
/* 0x002AB52C 0x8031B12C 0xA020A980 */ .word 0xA020A980 # sb $zero, -0x5680($at)
/* 0x002AB530 0x8031B130 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002AB534 0x8031B134 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AB538 0x8031B138 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
