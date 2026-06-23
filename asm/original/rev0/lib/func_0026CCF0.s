/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026CCF0..0x0026CD1C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Setup wrapper: stores $a0 to 0x8022F68, loads 0x80228AC0 ptr, jal 0x8020DF00; ends jr$ra@0026CD14 + addiu$sp delay@0026CD18 = slice end. */
/* function boundary candidate: func_0026CCF0, size=44, kind=prologue */
func_0026CCF0:
/* 0x0026CCF0 0x802DC8F0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026CCF4 0x802DC8F4 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026CCF8 0x802DC8F8 0xAC240F68 */ .word 0xAC240F68 # sw $a0, 0xF68($at)
/* 0x0026CCFC 0x802DC8FC 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x0026CD00 0x802DC900 0x24848AC0 */ .word 0x24848AC0 # addiu $a0, $a0, -0x7540
/* 0x0026CD04 0x802DC904 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026CD08 0x802DC908 0x0C0837C0 */ .word 0x0C0837C0 # jal 0x8020DF00
/* 0x0026CD0C 0x802DC90C 0x00000000 */ .word 0x00000000 # nop
/* 0x0026CD10 0x802DC910 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026CD14 0x802DC914 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026CD18 0x802DC918 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
