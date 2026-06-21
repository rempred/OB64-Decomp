/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00015EDC..0x00015F0C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00015EDC, size=84, kind=prologue */
func_00015EDC:
/* 0x00015EDC 0x80085ADC 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x00015EE0 0x80085AE0 0xAFA40010 */ .word 0xAFA40010 # sw $a0, 0x10($sp)
/* 0x00015EE4 0x80085AE4 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x00015EE8 0x80085AE8 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00015EEC 0x80085AEC 0x3C06800B */ .word 0x3C06800B # lui $a2, 0x800B
/* 0x00015EF0 0x80085AF0 0x24C61A70 */ .word 0x24C61A70 # addiu $a2, $a2, 0x1A70
/* 0x00015EF4 0x80085AF4 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x00015EF8 0x80085AF8 0x0C023E24 */ .word 0x0C023E24 # jal 0x8008F890
/* 0x00015EFC 0x80085AFC 0x24070001 */ .word 0x24070001 # addiu $a3, $zero, 0x1
/* 0x00015F00 0x80085B00 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x00015F04 0x80085B04 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00015F08 0x80085B08 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
