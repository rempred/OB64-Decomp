/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000A1000_000B1000.s
 * z64 range: 0x000ADA30..0x000ADA74 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* parent prologue addiu $sp,-0x18; jr $ra@0xADA6C+delay@0xADA70 */
/* function boundary candidate: func_000ADA30, size=68, kind=prologue */
func_000ADA30:
/* 0x000ADA30 0x8011D630 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000ADA34 0x8011D634 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000ADA38 0x8011D638 0x8C636AF8 */ .word 0x8C636AF8 # lw $v1, 0x6AF8($v1)
/* 0x000ADA3C 0x8011D63C 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x000ADA40 0x8011D640 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000ADA44 0x8011D644 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x000ADA48 0x8011D648 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x000ADA4C 0x8011D64C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000ADA50 0x8011D650 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000ADA54 0x8011D654 0x00621021 */ .word 0x00621021 # addu $v0, $v1, $v0
/* 0x000ADA58 0x8011D658 0x8C421B08 */ .word 0x8C421B08 # lw $v0, 0x1B08($v0)
/* 0x000ADA5C 0x8011D65C 0x24060001 */ .word 0x24060001 # addiu $a2, $zero, 0x1
/* 0x000ADA60 0x8011D660 0x0C070320 */ .word 0x0C070320 # jal 0x801C0C80
/* 0x000ADA64 0x8011D664 0xAC620078 */ .word 0xAC620078 # sw $v0, 0x78($v1)
/* 0x000ADA68 0x8011D668 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000ADA6C 0x8011D66C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000ADA70 0x8011D670 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
