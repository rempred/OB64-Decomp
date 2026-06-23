/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B6B70..0x000B6BA8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent leaf, frame 0x18. jal 0x801CC7D4 x3 then sb $zero,0xA1($v0); jr $ra+delay(addiu sp,0x18) at 0xB6BA0/4. */
/* function boundary candidate: func_000B6B70, size=56, kind=prologue */
func_000B6B70:
/* 0x000B6B70 0x80126770 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000B6B74 0x80126774 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000B6B78 0x80126778 0x0C0731F5 */ .word 0x0C0731F5 # jal 0x801CC7D4
/* 0x000B6B7C 0x8012677C 0x24040400 */ .word 0x24040400 # addiu $a0, $zero, 0x400
/* 0x000B6B80 0x80126780 0x0C0731F5 */ .word 0x0C0731F5 # jal 0x801CC7D4
/* 0x000B6B84 0x80126784 0x24040003 */ .word 0x24040003 # addiu $a0, $zero, 0x3
/* 0x000B6B88 0x80126788 0x0C0731F5 */ .word 0x0C0731F5 # jal 0x801CC7D4
/* 0x000B6B8C 0x8012678C 0x24040005 */ .word 0x24040005 # addiu $a0, $zero, 0x5
/* 0x000B6B90 0x80126790 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000B6B94 0x80126794 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000B6B98 0x80126798 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000B6B9C 0x8012679C 0xA04000A1 */ .word 0xA04000A1 # sb $zero, 0xA1($v0)
/* 0x000B6BA0 0x801267A0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B6BA4 0x801267A4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
