/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B848C..0x000B84D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frame -0x18; jr $ra@0xB84CC+delay; parent idx36 valid */
/* function boundary candidate: func_000B848C, size=72, kind=prologue */
func_000B848C:
/* 0x000B848C 0x8012808C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000B8490 0x80128090 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000B8494 0x80128094 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x000B8498 0x80128098 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x000B849C 0x8012809C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000B84A0 0x801280A0 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x000B84A4 0x801280A4 0x3C058019 */ .word 0x3C058019 # lui $a1, 0x8019
/* 0x000B84A8 0x801280A8 0x8CA56AF8 */ .word 0x8CA56AF8 # lw $a1, 0x6AF8($a1)
/* 0x000B84AC 0x801280AC 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x000B84B0 0x801280B0 0x2442117C */ .word 0x2442117C # addiu $v0, $v0, 0x117C
/* 0x000B84B4 0x801280B4 0x24060036 */ .word 0x24060036 # addiu $a2, $zero, 0x36
/* 0x000B84B8 0x801280B8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000B84BC 0x801280BC 0x00A22021 */ .word 0x00A22021 # addu $a0, $a1, $v0
/* 0x000B84C0 0x801280C0 0x0C024C18 */ .word 0x0C024C18 # jal 0x80093060
/* 0x000B84C4 0x801280C4 0x24A51806 */ .word 0x24A51806 # addiu $a1, $a1, 0x1806
/* 0x000B84C8 0x801280C8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000B84CC 0x801280CC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B84D0 0x801280D0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
