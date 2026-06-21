/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001E7C8..0x0001E7EC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001E7C8 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
float_ldexp_d:
/* 0x0001E7C8 0x8008E3C8 0x10C00006 */ .word 0x10C00006 # beq $a2, $zero, 0x8008E3E4
/* 0x0001E7CC 0x8008E3CC 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0001E7D0 0x8008E3D0 0x00C21004 */ .word 0x00C21004 # sllv $v0, $v0, $a2
/* 0x0001E7D4 0x8008E3D4 0x44820000 */ .word 0x44820000 # mtc1 $v0, $f0
/* 0x0001E7D8 0x8008E3D8 0x00000000 */ .word 0x00000000 # nop
/* 0x0001E7DC 0x8008E3DC 0x46800021 */ .word 0x46800021 # cvt.d.w $f0, $f0
/* 0x0001E7E0 0x8008E3E0 0x46206302 */ .word 0x46206302 # mul.d $f12, $f12, $f0
/* 0x0001E7E4 0x8008E3E4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001E7E8 0x8008E3E8 0x46206006 */ .word 0x46206006 # mov.d $f0, $f12
