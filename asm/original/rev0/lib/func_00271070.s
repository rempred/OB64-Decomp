/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00271070..0x0027109C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu$sp,-0x18@0x271070; sw $a0,0xF68($at) then jal 0x8020DF00; returns jr$ra@0x271094 + delay addiu$sp,0x18@0x271098. Tiny leaf-ish wrapper. */
/* function boundary candidate: func_00271070, size=44, kind=prologue */
func_00271070:
/* 0x00271070 0x802E0C70 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00271074 0x802E0C74 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00271078 0x802E0C78 0xAC240F68 */ .word 0xAC240F68 # sw $a0, 0xF68($at)
/* 0x0027107C 0x802E0C7C 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00271080 0x802E0C80 0x2484D168 */ .word 0x2484D168 # addiu $a0, $a0, -0x2E98
/* 0x00271084 0x802E0C84 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00271088 0x802E0C88 0x0C0837C0 */ .word 0x0C0837C0 # jal 0x8020DF00
/* 0x0027108C 0x802E0C8C 0x00000000 */ .word 0x00000000 # nop
/* 0x00271090 0x802E0C90 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00271094 0x802E0C94 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00271098 0x802E0C98 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
