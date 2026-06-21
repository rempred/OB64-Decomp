/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x000104C0..0x00010500 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000104C0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_add:
/* function boundary candidate: func_000104C0, size=56, kind=leaf */
func_000104C0:
/* 0x000104C0 0x800800C0 0xC4A60000 */ .word 0xC4A60000 # lwc1 $f6, 0x0($a1)
/* 0x000104C4 0x800800C4 0xC4C00000 */ .word 0xC4C00000 # lwc1 $f0, 0x0($a2)
/* 0x000104C8 0x800800C8 0xC4A40004 */ .word 0xC4A40004 # lwc1 $f4, 0x4($a1)
/* 0x000104CC 0x800800CC 0x46003180 */ .word 0x46003180 # add.s $f6, $f6, $f0
/* 0x000104D0 0x800800D0 0xC4C00004 */ .word 0xC4C00004 # lwc1 $f0, 0x4($a2)
/* 0x000104D4 0x800800D4 0xC4A20008 */ .word 0xC4A20008 # lwc1 $f2, 0x8($a1)
/* 0x000104D8 0x800800D8 0x46002100 */ .word 0x46002100 # add.s $f4, $f4, $f0
/* 0x000104DC 0x800800DC 0xC4C00008 */ .word 0xC4C00008 # lwc1 $f0, 0x8($a2)
/* 0x000104E0 0x800800E0 0x46001080 */ .word 0x46001080 # add.s $f2, $f2, $f0
/* 0x000104E4 0x800800E4 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x000104E8 0x800800E8 0xE4460000 */ .word 0xE4460000 # swc1 $f6, 0x0($v0)
/* 0x000104EC 0x800800EC 0xE4440004 */ .word 0xE4440004 # swc1 $f4, 0x4($v0)
/* 0x000104F0 0x800800F0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000104F4 0x800800F4 0xE4420008 */ .word 0xE4420008 # swc1 $f2, 0x8($v0)
/* 0x000104F8 0x800800F8 0x00000000 */ .word 0x00000000 # nop
/* 0x000104FC 0x800800FC 0x00000000 */ .word 0x00000000 # nop
