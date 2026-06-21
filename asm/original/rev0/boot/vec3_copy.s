/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010250..0x00010270 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010250 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_copy:
/* function boundary candidate: func_00010250, size=32, kind=leaf */
func_00010250:
/* 0x00010250 0x8007FE50 0xC4A00000 */ .word 0xC4A00000 # lwc1 $f0, 0x0($a1)
/* 0x00010254 0x8007FE54 0xC4A20004 */ .word 0xC4A20004 # lwc1 $f2, 0x4($a1)
/* 0x00010258 0x8007FE58 0xC4A40008 */ .word 0xC4A40008 # lwc1 $f4, 0x8($a1)
/* 0x0001025C 0x8007FE5C 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x00010260 0x8007FE60 0xE4400000 */ .word 0xE4400000 # swc1 $f0, 0x0($v0)
/* 0x00010264 0x8007FE64 0xE4420004 */ .word 0xE4420004 # swc1 $f2, 0x4($v0)
/* 0x00010268 0x8007FE68 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001026C 0x8007FE6C 0xE4440008 */ .word 0xE4440008 # swc1 $f4, 0x8($v0)
