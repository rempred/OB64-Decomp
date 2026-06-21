/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x0001043C..0x00010480 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001043C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_sub:
/* function boundary candidate: func_0001043C, size=60, kind=leaf */
func_0001043C:
/* 0x0001043C 0x8008003C 0x00000000 */ .word 0x00000000 # nop
/* 0x00010440 0x80080040 0xC4A60000 */ .word 0xC4A60000 # lwc1 $f6, 0x0($a1)
/* 0x00010444 0x80080044 0xC4C00000 */ .word 0xC4C00000 # lwc1 $f0, 0x0($a2)
/* 0x00010448 0x80080048 0xC4A40004 */ .word 0xC4A40004 # lwc1 $f4, 0x4($a1)
/* 0x0001044C 0x8008004C 0x46003181 */ .word 0x46003181 # sub.s $f6, $f6, $f0
/* 0x00010450 0x80080050 0xC4C00004 */ .word 0xC4C00004 # lwc1 $f0, 0x4($a2)
/* 0x00010454 0x80080054 0xC4A20008 */ .word 0xC4A20008 # lwc1 $f2, 0x8($a1)
/* 0x00010458 0x80080058 0x46002101 */ .word 0x46002101 # sub.s $f4, $f4, $f0
/* 0x0001045C 0x8008005C 0xC4C00008 */ .word 0xC4C00008 # lwc1 $f0, 0x8($a2)
/* 0x00010460 0x80080060 0x46001081 */ .word 0x46001081 # sub.s $f2, $f2, $f0
/* 0x00010464 0x80080064 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x00010468 0x80080068 0xE4460000 */ .word 0xE4460000 # swc1 $f6, 0x0($v0)
/* 0x0001046C 0x8008006C 0xE4440004 */ .word 0xE4440004 # swc1 $f4, 0x4($v0)
/* 0x00010470 0x80080070 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00010474 0x80080074 0xE4420008 */ .word 0xE4420008 # swc1 $f2, 0x8($v0)
/* 0x00010478 0x80080078 0x00000000 */ .word 0x00000000 # nop
/* 0x0001047C 0x8008007C 0x00000000 */ .word 0x00000000 # nop
