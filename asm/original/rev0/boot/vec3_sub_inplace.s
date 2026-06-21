/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x0001054C..0x00010590 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001054C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_sub_inplace:
/* 0x0001054C 0x8008014C 0x00000000 */ .word 0x00000000 # nop
/* 0x00010550 0x80080150 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x00010554 0x80080154 0xC4460000 */ .word 0xC4460000 # lwc1 $f6, 0x0($v0)
/* 0x00010558 0x80080158 0xC4A00000 */ .word 0xC4A00000 # lwc1 $f0, 0x0($a1)
/* 0x0001055C 0x8008015C 0xC4440004 */ .word 0xC4440004 # lwc1 $f4, 0x4($v0)
/* 0x00010560 0x80080160 0x46003181 */ .word 0x46003181 # sub.s $f6, $f6, $f0
/* 0x00010564 0x80080164 0xC4A00004 */ .word 0xC4A00004 # lwc1 $f0, 0x4($a1)
/* 0x00010568 0x80080168 0xC4420008 */ .word 0xC4420008 # lwc1 $f2, 0x8($v0)
/* 0x0001056C 0x8008016C 0x46002101 */ .word 0x46002101 # sub.s $f4, $f4, $f0
/* 0x00010570 0x80080170 0xC4A00008 */ .word 0xC4A00008 # lwc1 $f0, 0x8($a1)
/* 0x00010574 0x80080174 0x46001081 */ .word 0x46001081 # sub.s $f2, $f2, $f0
/* 0x00010578 0x80080178 0xE4460000 */ .word 0xE4460000 # swc1 $f6, 0x0($v0)
/* 0x0001057C 0x8008017C 0xE4440004 */ .word 0xE4440004 # swc1 $f4, 0x4($v0)
/* 0x00010580 0x80080180 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00010584 0x80080184 0xE4420008 */ .word 0xE4420008 # swc1 $f2, 0x8($v0)
/* 0x00010588 0x80080188 0x00000000 */ .word 0x00000000 # nop
/* 0x0001058C 0x8008018C 0x00000000 */ .word 0x00000000 # nop
