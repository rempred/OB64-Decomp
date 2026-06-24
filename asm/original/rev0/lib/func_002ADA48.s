/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002ADA48..0x002ADA80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-folded: lui $a0,0x8023 / lw $a0,-0x5688 at 0x002ADA48 feed jal arg before write (body jal 0x800712C4 at 0x002ADA58 consumes $a0). addiu$sp,-0x18 at 0x002ADA50. Trailing alignment nops 0x002ADA74-0x002ADA7C attached to end. */
func_002ADA48:
/* 0x002ADA48 0x8031D648 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x002ADA4C 0x8031D64C 0x8C84A978 */ .word 0x8C84A978 # lw $a0, -0x5688($a0)

/* function boundary candidate: func_002ADA50, size=36, kind=prologue */
func_002ADA50:
/* 0x002ADA50 0x8031D650 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002ADA54 0x8031D654 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002ADA58 0x8031D658 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x002ADA5C 0x8031D65C 0x00000000 */ .word 0x00000000 # nop
/* 0x002ADA60 0x8031D660 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x002ADA64 0x8031D664 0xAC20A978 */ .word 0xAC20A978 # sw $zero, -0x5688($at)
/* 0x002ADA68 0x8031D668 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002ADA6C 0x8031D66C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002ADA70 0x8031D670 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x002ADA74 0x8031D674 0x00000000 */ .word 0x00000000 # nop
/* 0x002ADA78 0x8031D678 0x00000000 */ .word 0x00000000 # nop
/* 0x002ADA7C 0x8031D67C 0x00000000 */ .word 0x00000000 # nop
