/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F913C..0x001F9170 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small framed wrapper (addiu $sp,-0x28) calling 0x801B594C. Ends jr$ra@0x1F9168 + delay addiu@0x1F916C ending at slice end 0x1F9170. */
/* function boundary candidate: func_001F913C, size=52, kind=prologue */
func_001F913C:
/* 0x001F913C 0x80268D3C 0x27BDFFD8 */ .word 0x27BDFFD8 # addiu $sp, $sp, -0x28
/* 0x001F9140 0x80268D40 0xAFBF0020 */ .word 0xAFBF0020 # sw $ra, 0x20($sp)
/* 0x001F9144 0x80268D44 0x94870004 */ .word 0x94870004 # lhu $a3, 0x4($a0)
/* 0x001F9148 0x80268D48 0x94820006 */ .word 0x94820006 # lhu $v0, 0x6($a0)
/* 0x001F914C 0x80268D4C 0xAFA50014 */ .word 0xAFA50014 # sw $a1, 0x14($sp)
/* 0x001F9150 0x80268D50 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x001F9154 0x80268D54 0xAFA60018 */ .word 0xAFA60018 # sw $a2, 0x18($sp)
/* 0x001F9158 0x80268D58 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x001F915C 0x80268D5C 0x0C06D653 */ .word 0x0C06D653 # jal 0x801B594C
/* 0x001F9160 0x80268D60 0xAFA20010 */ .word 0xAFA20010 # sw $v0, 0x10($sp)
/* 0x001F9164 0x80268D64 0x8FBF0020 */ .word 0x8FBF0020 # lw $ra, 0x20($sp)
/* 0x001F9168 0x80268D68 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F916C 0x80268D6C 0x27BD0028 */ .word 0x27BD0028 # addiu $sp, $sp, 0x28
