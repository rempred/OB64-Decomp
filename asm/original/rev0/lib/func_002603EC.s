/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x002603EC..0x00260420 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu$sp,-0x18; sh $a0->0xE60, jal 0x80093060 (memcpy of 10 bytes from $a1 to 0xE62). jr $ra at 0x00260414 + delay addiu$sp,0x18. Trailing nop at 0x0026041C is alignment, attached to this function's end. */
/* function boundary candidate: func_002603EC, size=48, kind=prologue */
func_002603EC:
/* 0x002603EC 0x802CFFEC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002603F0 0x802CFFF0 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x002603F4 0x802CFFF4 0x24420E60 */ .word 0x24420E60 # addiu $v0, $v0, 0xE60
/* 0x002603F8 0x802CFFF8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002603FC 0x802CFFFC 0xA4440000 */ .word 0xA4440000 # sh $a0, 0x0($v0)
/* 0x00260400 0x802D0000 0x00A02021 */ .word 0x00A02021 # move $a0, $a1
/* 0x00260404 0x802D0004 0x24450002 */ .word 0x24450002 # addiu $a1, $v0, 0x2
/* 0x00260408 0x802D0008 0x0C024C18 */ .word 0x0C024C18 # jal 0x80093060
/* 0x0026040C 0x802D000C 0x2406000A */ .word 0x2406000A # addiu $a2, $zero, 0xA
/* 0x00260410 0x802D0010 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00260414 0x802D0014 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00260418 0x802D0018 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0026041C 0x802D001C 0x00000000 */ .word 0x00000000 # nop
