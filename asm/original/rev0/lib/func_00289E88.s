/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00289E88..0x00289ECC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf un-merged from parent func_00289D34. No prologue: loop scanning 0x50 half-word field across index 2..5. Ends jr $ra 0x00289EC4 + delay nop 0x00289EC8. */
/* 0x00289E88 0x802F9A88 0x24030002 */ .word 0x24030002 # addiu $v1, $zero, 0x2
/* 0x00289E8C 0x802F9A8C 0x3C048024 */ .word 0x3C048024 # lui $a0, 0x8024
/* 0x00289E90 0x802F9A90 0x8C84DE20 */ .word 0x8C84DE20 # lw $a0, -0x21E0($a0)
/* 0x00289E94 0x802F9A94 0x306200FF */ .word 0x306200FF # andi $v0, $v1, 0x00FF
/* 0x00289E98 0x802F9A98 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x00289E9C 0x802F9A9C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00289EA0 0x802F9AA0 0x94420050 */ .word 0x94420050 # lhu $v0, 0x50($v0)
/* 0x00289EA4 0x802F9AA4 0x14400007 */ .word 0x14400007 # bne $v0, $zero, 0x802F9AC4
/* 0x00289EA8 0x802F9AA8 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00289EAC 0x802F9AAC 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00289EB0 0x802F9AB0 0x306200FF */ .word 0x306200FF # andi $v0, $v1, 0x00FF
/* 0x00289EB4 0x802F9AB4 0x2C420005 */ .word 0x2C420005 # sltiu $v0, $v0, 0x5
/* 0x00289EB8 0x802F9AB8 0x1440FFF7 */ .word 0x1440FFF7 # bne $v0, $zero, 0x802F9A98
/* 0x00289EBC 0x802F9ABC 0x306200FF */ .word 0x306200FF # andi $v0, $v1, 0x00FF
/* 0x00289EC0 0x802F9AC0 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00289EC4 0x802F9AC4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00289EC8 0x802F9AC8 0x00000000 */ .word 0x00000000 # nop
