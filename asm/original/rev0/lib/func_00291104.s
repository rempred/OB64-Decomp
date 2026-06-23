/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x00291104..0x00291130 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward: lui$a0/lw$a0=*(0x8024DE38)@0x00291104-08 is read-before-write for the addiu$sp,-0x18 prologue@0x0029110C, whose jal 0x800712C4 consumes $a0. Clears *(0x8024DE38)=0. jr$ra@0x00291128 + delay@0x0029112C. */
/* 0x00291104 0x80300D04 0x3C048024 */ .word 0x3C048024 # lui $a0, 0x8024
/* 0x00291108 0x80300D08 0x8C84DE38 */ .word 0x8C84DE38 # lw $a0, -0x21C8($a0)

/* function boundary candidate: func_0029110C, size=36, kind=prologue */
func_0029110C:
/* 0x0029110C 0x80300D0C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00291110 0x80300D10 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00291114 0x80300D14 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00291118 0x80300D18 0x00000000 */ .word 0x00000000 # nop
/* 0x0029111C 0x80300D1C 0x3C018024 */ .word 0x3C018024 # lui $at, 0x8024
/* 0x00291120 0x80300D20 0xAC20DE38 */ .word 0xAC20DE38 # sw $zero, -0x21C8($at)
/* 0x00291124 0x80300D24 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00291128 0x80300D28 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0029112C 0x80300D2C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
