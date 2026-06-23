/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B84D4..0x000B851C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frame -0x18; jr $ra@0xB8514+delay; parent idx37 valid */
/* function boundary candidate: func_000B84D4, size=72, kind=prologue */
func_000B84D4:
/* 0x000B84D4 0x801280D4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000B84D8 0x801280D8 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000B84DC 0x801280DC 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000B84E0 0x801280E0 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000B84E4 0x801280E4 0x000428C0 */ .word 0x000428C0 # sll $a1, $a0, 3
/* 0x000B84E8 0x801280E8 0x00A42823 */ .word 0x00A42823 # subu $a1, $a1, $a0
/* 0x000B84EC 0x801280EC 0x00052880 */ .word 0x00052880 # sll $a1, $a1, 2
/* 0x000B84F0 0x801280F0 0x00A42823 */ .word 0x00A42823 # subu $a1, $a1, $a0
/* 0x000B84F4 0x801280F4 0x00052840 */ .word 0x00052840 # sll $a1, $a1, 1
/* 0x000B84F8 0x801280F8 0x24A5117C */ .word 0x24A5117C # addiu $a1, $a1, 0x117C
/* 0x000B84FC 0x801280FC 0x24060036 */ .word 0x24060036 # addiu $a2, $zero, 0x36
/* 0x000B8500 0x80128100 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000B8504 0x80128104 0x24441806 */ .word 0x24441806 # addiu $a0, $v0, 0x1806
/* 0x000B8508 0x80128108 0x0C024C18 */ .word 0x0C024C18 # jal 0x80093060
/* 0x000B850C 0x8012810C 0x00452821 */ .word 0x00452821 # addu $a1, $v0, $a1
/* 0x000B8510 0x80128110 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000B8514 0x80128114 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B8518 0x80128118 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
