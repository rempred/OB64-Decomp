/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x0000FF10..0x0000FF60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0000FF10 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
fade_channel_step_clamp:
/* function boundary candidate: func_0000FF10, size=80, kind=leaf */
func_0000FF10:
/* 0x0000FF10 0x8007FB10 0xC4800000 */ .word 0xC4800000 # lwc1 $f0, 0x0($a0)
/* 0x0000FF14 0x8007FB14 0xC4820010 */ .word 0xC4820010 # lwc1 $f2, 0x10($a0)
/* 0x0000FF18 0x8007FB18 0x46020000 */ .word 0x46020000 # add.s $f0, $f0, $f2
/* 0x0000FF1C 0x8007FB1C 0x9082000C */ .word 0x9082000C # lbu $v0, 0xC($a0)
/* 0x0000FF20 0x8007FB20 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0000FF24 0x8007FB24 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x8007FB3C
/* 0x0000FF28 0x8007FB28 0xE4800000 */ .word 0xE4800000 # swc1 $f0, 0x0($a0)
/* 0x0000FF2C 0x8007FB2C 0xC4820008 */ .word 0xC4820008 # lwc1 $f2, 0x8($a0)
/* 0x0000FF30 0x8007FB30 0x4602003E */ .word 0x4602003E # c.0xE.s $f0, $f2
/* 0x0000FF34 0x8007FB34 0x0801FED2 */ .word 0x0801FED2 # j 0x8007FB48
/* 0x0000FF38 0x8007FB38 0x00000000 */ .word 0x00000000 # nop
/* 0x0000FF3C 0x8007FB3C 0xC4820008 */ .word 0xC4820008 # lwc1 $f2, 0x8($a0)
/* 0x0000FF40 0x8007FB40 0x4600103E */ .word 0x4600103E # c.0xE.s $f2, $f0
/* 0x0000FF44 0x8007FB44 0x00000000 */ .word 0x00000000 # nop
/* 0x0000FF48 0x8007FB48 0x45000003 */ .word 0x45000003 # bc1f 0x8007FB58
/* 0x0000FF4C 0x8007FB4C 0x00000000 */ .word 0x00000000 # nop
/* 0x0000FF50 0x8007FB50 0xE4820000 */ .word 0xE4820000 # swc1 $f2, 0x0($a0)
/* 0x0000FF54 0x8007FB54 0x240300FF */ .word 0x240300FF # addiu $v1, $zero, 0xFF
/* 0x0000FF58 0x8007FB58 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0000FF5C 0x8007FB5C 0x00601021 */ .word 0x00601021 # move $v0, $v1
