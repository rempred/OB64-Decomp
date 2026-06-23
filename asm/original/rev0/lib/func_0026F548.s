/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026F548..0x0026F578 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 12-word leaf setter: stores $a0/$a1 to 0x80220F68/F6C, jal 0x8020DF00, ends jr$ra@0x0026F570 + delay@0x0026F574. */
func_0026F548:
/* function boundary candidate: func_0026F548, size=48, kind=prologue */
func_0026F548:
/* 0x0026F548 0x802DF148 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026F54C 0x802DF14C 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026F550 0x802DF150 0xAC240F68 */ .word 0xAC240F68 # sw $a0, 0xF68($at)
/* 0x0026F554 0x802DF154 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x0026F558 0x802DF158 0x2484A630 */ .word 0x2484A630 # addiu $a0, $a0, -0x59D0
/* 0x0026F55C 0x802DF15C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026F560 0x802DF160 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026F564 0x802DF164 0x0C0837C0 */ .word 0x0C0837C0 # jal 0x8020DF00
/* 0x0026F568 0x802DF168 0xAC250F6C */ .word 0xAC250F6C # sw $a1, 0xF6C($at)
/* 0x0026F56C 0x802DF16C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026F570 0x802DF170 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026F574 0x802DF174 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
