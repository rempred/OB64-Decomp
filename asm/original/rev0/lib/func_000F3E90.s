/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000F3E90..0x000F3EB0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS-LEAF. Setter: cvt.s.w $f0 then sw $a0,0x801B_D580 / swc1 $f0,0x801B_D584. No stack frame. Ends jr $ra@0xF3EA8 + delay swc1@0xF3EAC. Entry fall-through only (not a branch target). */
/* 0x000F3E90 0x80163A90 0x44850000 */ .word 0x44850000 # mtc1 $a1, $f0
/* 0x000F3E94 0x80163A94 0x00000000 */ .word 0x00000000 # nop
/* 0x000F3E98 0x80163A98 0x46800020 */ .word 0x46800020 # cvt.s.w $f0, $f0
/* 0x000F3E9C 0x80163A9C 0x3C01801B */ .word 0x3C01801B # lui $at, 0x801B
/* 0x000F3EA0 0x80163AA0 0xAC24D580 */ .word 0xAC24D580 # sw $a0, -0x2A80($at)
/* 0x000F3EA4 0x80163AA4 0x3C01801B */ .word 0x3C01801B # lui $at, 0x801B
/* 0x000F3EA8 0x80163AA8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000F3EAC 0x80163AAC 0xE420D584 */ .word 0xE420D584 # swc1 $f0, -0x2A7C($at)
