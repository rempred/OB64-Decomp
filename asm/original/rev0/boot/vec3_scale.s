/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010480..0x000104C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010480 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_scale:
/* function boundary candidate: func_00010480, size=52, kind=leaf */
func_00010480:
/* 0x00010480 0x80080080 0xC4A60000 */ .word 0xC4A60000 # lwc1 $f6, 0x0($a1)
/* 0x00010484 0x80080084 0x44862000 */ .word 0x44862000 # mtc1 $a2, $f4
/* 0x00010488 0x80080088 0x00000000 */ .word 0x00000000 # nop
/* 0x0001048C 0x8008008C 0x46043182 */ .word 0x46043182 # mul.s $f6, $f6, $f4
/* 0x00010490 0x80080090 0xC4A20004 */ .word 0xC4A20004 # lwc1 $f2, 0x4($a1)
/* 0x00010494 0x80080094 0x46041082 */ .word 0x46041082 # mul.s $f2, $f2, $f4
/* 0x00010498 0x80080098 0xC4A00008 */ .word 0xC4A00008 # lwc1 $f0, 0x8($a1)
/* 0x0001049C 0x8008009C 0x46040002 */ .word 0x46040002 # mul.s $f0, $f0, $f4
/* 0x000104A0 0x800800A0 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x000104A4 0x800800A4 0xE4460000 */ .word 0xE4460000 # swc1 $f6, 0x0($v0)
/* 0x000104A8 0x800800A8 0xE4420004 */ .word 0xE4420004 # swc1 $f2, 0x4($v0)
/* 0x000104AC 0x800800AC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000104B0 0x800800B0 0xE4400008 */ .word 0xE4400008 # swc1 $f0, 0x8($v0)
/* 0x000104B4 0x800800B4 0x00000000 */ .word 0x00000000 # nop
/* 0x000104B8 0x800800B8 0x00000000 */ .word 0x00000000 # nop
/* 0x000104BC 0x800800BC 0x00000000 */ .word 0x00000000 # nop
