/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00283318..0x00283350 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward: read-before-write load (lui $a0,0x8023; lw $a0,-0x573C($a0)) @0x00283318 feeds body whose prologue addiu $sp,-0x18 @0x00283320 passes $a0 into jal 0x800712C4 before writing it. Ends jr $ra @0x00283348 + delay @0x0028334C. */
func_00283318:
/* 0x00283318 0x802F2F18 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x0028331C 0x802F2F1C 0x8C84A8C4 */ .word 0x8C84A8C4 # lw $a0, -0x573C($a0)

/* function boundary candidate: func_00283320, size=48, kind=prologue */
func_00283320:
/* 0x00283320 0x802F2F20 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00283324 0x802F2F24 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00283328 0x802F2F28 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0028332C 0x802F2F2C 0x00000000 */ .word 0x00000000 # nop
/* 0x00283330 0x802F2F30 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x00283334 0x802F2F34 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x00283338 0x802F2F38 0xAC20A8C4 */ .word 0xAC20A8C4 # sw $zero, -0x573C($at)
/* 0x0028333C 0x802F2F3C 0x0C020531 */ .word 0x0C020531 # jal 0x800814C4
/* 0x00283340 0x802F2F40 0x24057FFF */ .word 0x24057FFF # addiu $a1, $zero, 0x7FFF
/* 0x00283344 0x802F2F44 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00283348 0x802F2F48 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0028334C 0x802F2F4C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
