/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00027540..0x00027574 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00027540, size=120, kind=prologue */
func_00027540:
/* 0x00027540 0x80097140 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00027544 0x80097144 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00027548 0x80097148 0x18A00007 */ .word 0x18A00007 # blez $a1, 0x80097168
/* 0x0002754C 0x8009714C 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x00027550 0x80097150 0x90820000 */ .word 0x90820000 # lbu $v0, 0x0($a0)
/* 0x00027554 0x80097154 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00027558 0x80097158 0x00C23021 */ .word 0x00C23021 # addu $a2, $a2, $v0
/* 0x0002755C 0x8009715C 0x0065102A */ .word 0x0065102A # slt $v0, $v1, $a1
/* 0x00027560 0x80097160 0x1440FFFB */ .word 0x1440FFFB # bne $v0, $zero, 0x80097150
/* 0x00027564 0x80097164 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x00027568 0x80097168 0x30C2FFFF */ .word 0x30C2FFFF # andi $v0, $a2, 0xFFFF
/* 0x0002756C 0x8009716C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00027570 0x80097170 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
