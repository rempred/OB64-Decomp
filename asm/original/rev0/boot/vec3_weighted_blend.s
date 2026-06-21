/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010610..0x00010680 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010610 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_weighted_blend:
/* function boundary candidate: func_00010610, size=108, kind=leaf */
func_00010610:
/* 0x00010610 0x80080210 0xC7A40010 */ .word 0xC7A40010 # lwc1 $f4, 0x10($sp)
/* 0x00010614 0x80080214 0xC4A60000 */ .word 0xC4A60000 # lwc1 $f6, 0x0($a1)
/* 0x00010618 0x80080218 0x46062182 */ .word 0x46062182 # mul.s $f6, $f4, $f6
/* 0x0001061C 0x8008021C 0xC4C00000 */ .word 0xC4C00000 # lwc1 $f0, 0x0($a2)
/* 0x00010620 0x80080220 0x44874000 */ .word 0x44874000 # mtc1 $a3, $f8
/* 0x00010624 0x80080224 0x00000000 */ .word 0x00000000 # nop
/* 0x00010628 0x80080228 0x46004002 */ .word 0x46004002 # mul.s $f0, $f8, $f0
/* 0x0001062C 0x8008022C 0x46044280 */ .word 0x46044280 # add.s $f10, $f8, $f4
/* 0x00010630 0x80080230 0x46003180 */ .word 0x46003180 # add.s $f6, $f6, $f0
/* 0x00010634 0x80080234 0x460A3183 */ .word 0x460A3183 # div.s $f6, $f6, $f10
/* 0x00010638 0x80080238 0xC4A20004 */ .word 0xC4A20004 # lwc1 $f2, 0x4($a1)
/* 0x0001063C 0x8008023C 0x46022082 */ .word 0x46022082 # mul.s $f2, $f4, $f2
/* 0x00010640 0x80080240 0xC4C00004 */ .word 0xC4C00004 # lwc1 $f0, 0x4($a2)
/* 0x00010644 0x80080244 0x46004002 */ .word 0x46004002 # mul.s $f0, $f8, $f0
/* 0x00010648 0x80080248 0x46001080 */ .word 0x46001080 # add.s $f2, $f2, $f0
/* 0x0001064C 0x8008024C 0x460A1083 */ .word 0x460A1083 # div.s $f2, $f2, $f10
/* 0x00010650 0x80080250 0xC4A00008 */ .word 0xC4A00008 # lwc1 $f0, 0x8($a1)
/* 0x00010654 0x80080254 0x46002102 */ .word 0x46002102 # mul.s $f4, $f4, $f0
/* 0x00010658 0x80080258 0xC4C00008 */ .word 0xC4C00008 # lwc1 $f0, 0x8($a2)
/* 0x0001065C 0x8008025C 0x46004202 */ .word 0x46004202 # mul.s $f8, $f8, $f0
/* 0x00010660 0x80080260 0x46082100 */ .word 0x46082100 # add.s $f4, $f4, $f8
/* 0x00010664 0x80080264 0x460A2103 */ .word 0x460A2103 # div.s $f4, $f4, $f10
/* 0x00010668 0x80080268 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x0001066C 0x8008026C 0xE4460000 */ .word 0xE4460000 # swc1 $f6, 0x0($v0)
/* 0x00010670 0x80080270 0xE4420004 */ .word 0xE4420004 # swc1 $f2, 0x4($v0)
/* 0x00010674 0x80080274 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00010678 0x80080278 0xE4440008 */ .word 0xE4440008 # swc1 $f4, 0x8($v0)
/* 0x0001067C 0x8008027C 0x00000000 */ .word 0x00000000 # nop
