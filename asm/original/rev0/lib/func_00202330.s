/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00202330..0x0020236C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small leaf, prologue addiu $sp,-8; alpha test, internal j 0x801BEED4. jr$ra @0x202364, delay (addiu $sp,8) @0x202368. */
/* function boundary candidate: func_00202330, size=116, kind=prologue */
func_00202330:
/* 0x00202330 0x80271F30 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00202334 0x80271F34 0xAFA40008 */ .word 0xAFA40008 # sw $a0, 0x8($sp)
/* 0x00202338 0x80271F38 0x8BA20008 */ .word 0x8BA20008 # lwl $v0, 0x8($sp)
/* 0x0020233C 0x80271F3C 0x9BA2000B */ .word 0x9BA2000B # lwr $v0, 0xB($sp)
/* 0x00202340 0x80271F40 0xABA20000 */ .word 0xABA20000 # swl $v0, 0x0($sp)
/* 0x00202344 0x80271F44 0xBBA20003 */ .word 0xBBA20003 # swr $v0, 0x3($sp)
/* 0x00202348 0x80271F48 0x93A20003 */ .word 0x93A20003 # lbu $v0, 0x3($sp)
/* 0x0020234C 0x80271F4C 0x2C420080 */ .word 0x2C420080 # sltiu $v0, $v0, 0x80
/* 0x00202350 0x80271F50 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x80271F60
/* 0x00202354 0x80271F54 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00202358 0x80271F58 0x0806FBB5 */ .word 0x0806FBB5 # j 0x801BEED4
/* 0x0020235C 0x80271F5C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00202360 0x80271F60 0x2C620001 */ .word 0x2C620001 # sltiu $v0, $v1, 0x1
/* 0x00202364 0x80271F64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00202368 0x80271F68 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
