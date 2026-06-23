/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00281BAC..0x00281BD8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed; ends jr $ra 0x00281BD0 + delay 0x00281BD4. The 4 words at 0x00281BD8 start the next function's read-before-write preamble and are carved off. */
/* function boundary candidate: func_00281BAC, size=44, kind=prologue */
func_00281BAC:
/* 0x00281BAC 0x802F17AC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00281BB0 0x802F17B0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00281BB4 0x802F17B4 0x0C022684 */ .word 0x0C022684 # jal 0x80089A10
/* 0x00281BB8 0x802F17B8 0x00000000 */ .word 0x00000000 # nop
/* 0x00281BBC 0x802F17BC 0x0C08B885 */ .word 0x0C08B885 # jal 0x8022E214
/* 0x00281BC0 0x802F17C0 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x00281BC4 0x802F17C4 0x0C05E324 */ .word 0x0C05E324 # jal 0x80178C90
/* 0x00281BC8 0x802F17C8 0x00000000 */ .word 0x00000000 # nop
/* 0x00281BCC 0x802F17CC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00281BD0 0x802F17D0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00281BD4 0x802F17D4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
