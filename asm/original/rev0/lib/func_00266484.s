/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00266484..0x002664B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny wrapper: jal 0x80211520 with addiu$a0,0x14; jr$ra@0x0026649C + delay@0x002664A0. Three trailing alignment nops@0x002664A4-0x002664AC attach here (start of 796B gap). */
/* function boundary candidate: func_00266484, size=32, kind=prologue */
func_00266484:
/* 0x00266484 0x802D6084 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00266488 0x802D6088 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026648C 0x802D608C 0x0C084548 */ .word 0x0C084548 # jal 0x80211520
/* 0x00266490 0x802D6090 0x24840014 */ .word 0x24840014 # addiu $a0, $a0, 0x14
/* 0x00266494 0x802D6094 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00266498 0x802D6098 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0026649C 0x802D609C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002664A0 0x802D60A0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x002664A4 0x802D60A4 0x00000000 */ .word 0x00000000 # nop
/* 0x002664A8 0x802D60A8 0x00000000 */ .word 0x00000000 # nop
/* 0x002664AC 0x802D60AC 0x00000000 */ .word 0x00000000 # nop
