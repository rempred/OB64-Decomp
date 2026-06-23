/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00211CE8..0x00211D14 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu$sp,-0x18 saving $ra only; small poll loop (jal 0x80089A10, jal 0x801CE38C, beq retry). Epilogue jr$ra@0x00211D0C, delay addiu$sp,0x18@0x00211D10, ending at exactly 0x00211D14 where DATA begins. */
/* function boundary candidate: func_00211CE8, size=44, kind=prologue */
func_00211CE8:
/* 0x00211CE8 0x802818E8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00211CEC 0x802818EC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00211CF0 0x802818F0 0x0C022684 */ .word 0x0C022684 # jal 0x80089A10
/* 0x00211CF4 0x802818F4 0x00000000 */ .word 0x00000000 # nop
/* 0x00211CF8 0x802818F8 0x0C0738E3 */ .word 0x0C0738E3 # jal 0x801CE38C
/* 0x00211CFC 0x802818FC 0x00000000 */ .word 0x00000000 # nop
/* 0x00211D00 0x80281900 0x1040FFFB */ .word 0x1040FFFB # beq $v0, $zero, 0x802818F0
/* 0x00211D04 0x80281904 0x00000000 */ .word 0x00000000 # nop
/* 0x00211D08 0x80281908 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00211D0C 0x8028190C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00211D10 0x80281910 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
