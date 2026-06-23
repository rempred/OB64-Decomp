/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00271E30..0x00271E5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu$sp,-0x18@0x271E30; sw $a0,0xF68($at) then jal 0x8020DF00; returns jr$ra@0x271E54 + delay addiu$sp,0x18@0x271E58. Mirror of func_00271070. Last part: end == slice end 0x271E5C. */
/* function boundary candidate: func_00271E30, size=44, kind=prologue */
func_00271E30:
/* 0x00271E30 0x802E1A30 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00271E34 0x802E1A34 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00271E38 0x802E1A38 0xAC240F68 */ .word 0xAC240F68 # sw $a0, 0xF68($at)
/* 0x00271E3C 0x802E1A3C 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00271E40 0x802E1A40 0x2484DACC */ .word 0x2484DACC # addiu $a0, $a0, -0x2534
/* 0x00271E44 0x802E1A44 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00271E48 0x802E1A48 0x0C0837C0 */ .word 0x0C0837C0 # jal 0x8020DF00
/* 0x00271E4C 0x802E1A4C 0x00000000 */ .word 0x00000000 # nop
/* 0x00271E50 0x802E1A50 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00271E54 0x802E1A54 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00271E58 0x802E1A58 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
