/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000A1000_000B1000.s
 * z64 range: 0x000AD6A0..0x000AD6E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Hidden FRAMELESS leaf split from func_000AD1F8 over-merge. Entry 0xAD6A0 (lui $v0,0x8019 / lw $v0,0x6AF8) after func_000AD1F8 return+delay. No $sp use; init loop over global 0x80196AF8 (bne @0xAD6D0); jr $ra @0xAD6D8 + nop @0xAD6DC. Ends at slice end 0xAD6E0. */
func_000ad6a0:
/* 0x000AD6A0 0x8011D2A0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000AD6A4 0x8011D2A4 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000AD6A8 0x8011D2A8 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x000AD6AC 0x8011D2AC 0x2405FFFF */ .word 0x2405FFFF # addiu $a1, $zero, -0x1
/* 0x000AD6B0 0x8011D2B0 0x00401821 */ .word 0x00401821 # move $v1, $v0
/* 0x000AD6B4 0x8011D2B4 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x000AD6B8 0x8011D2B8 0xA4601BCC */ .word 0xA4601BCC # sh $zero, 0x1BCC($v1)
/* 0x000AD6BC 0x8011D2BC 0xAC621BD0 */ .word 0xAC621BD0 # sw $v0, 0x1BD0($v1)
/* 0x000AD6C0 0x8011D2C0 0xAC651B08 */ .word 0xAC651B08 # sw $a1, 0x1B08($v1)
/* 0x000AD6C4 0x8011D2C4 0xAC601B0C */ .word 0xAC601B0C # sw $zero, 0x1B0C($v1)
/* 0x000AD6C8 0x8011D2C8 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x000AD6CC 0x8011D2CC 0x28820003 */ .word 0x28820003 # slti $v0, $a0, 0x3
/* 0x000AD6D0 0x8011D2D0 0x1440FFFB */ .word 0x1440FFFB # bne $v0, $zero, 0x8011D2C0
/* 0x000AD6D4 0x8011D2D4 0x2463005C */ .word 0x2463005C # addiu $v1, $v1, 0x5C
/* 0x000AD6D8 0x8011D2D8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000AD6DC 0x8011D2DC 0x00000000 */ .word 0x00000000 # nop
