/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001A734..0x0001A754 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001A734, size=32, kind=prologue */
func_0001A734:
/* 0x0001A734 0x8008A334 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001A738 0x8008A338 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001A73C 0x8008A33C 0x3C04800B */ .word 0x3C04800B # lui $a0, 0x800B
/* 0x0001A740 0x8008A340 0x0C022C74 */ .word 0x0C022C74 # jal 0x8008B1D0
/* 0x0001A744 0x8008A344 0x24849FF8 */ .word 0x24849FF8 # addiu $a0, $a0, -0x6008
/* 0x0001A748 0x8008A348 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001A74C 0x8008A34C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001A750 0x8008A350 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
