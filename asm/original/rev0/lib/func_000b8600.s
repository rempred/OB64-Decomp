/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B8600..0x000B8634 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf; move $v1,zero / lui $a0 entry; scan loop; jr $ra@0xB862C+delay; split from parent idx38 */
func_000b8600:
/* 0x000B8600 0x80128200 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x000B8604 0x80128204 0x240500FF */ .word 0x240500FF # addiu $a1, $zero, 0xFF
/* 0x000B8608 0x80128208 0x3C048019 */ .word 0x3C048019 # lui $a0, 0x8019
/* 0x000B860C 0x8012820C 0x8C846AF8 */ .word 0x8C846AF8 # lw $a0, 0x6AF8($a0)
/* 0x000B8610 0x80128210 0x9082117F */ .word 0x9082117F # lbu $v0, 0x117F($a0)
/* 0x000B8614 0x80128214 0x10450005 */ .word 0x10450005 # beq $v0, $a1, 0x8012822C
/* 0x000B8618 0x80128218 0x00000000 */ .word 0x00000000 # nop
/* 0x000B861C 0x8012821C 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x000B8620 0x80128220 0x2862001E */ .word 0x2862001E # slti $v0, $v1, 0x1E
/* 0x000B8624 0x80128224 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x80128210
/* 0x000B8628 0x80128228 0x24840036 */ .word 0x24840036 # addiu $a0, $a0, 0x36
/* 0x000B862C 0x8012822C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B8630 0x80128230 0x306200FF */ .word 0x306200FF # andi $v0, $v1, 0x00FF
