/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010B68..0x00010B98 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010B68 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
text_draw_string_xy:
/* function boundary candidate: func_00010B68, size=48, kind=prologue */
func_00010B68:
/* 0x00010B68 0x80080768 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00010B6C 0x8008076C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00010B70 0x80080770 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00010B74 0x80080774 0xA42517B8 */ .word 0xA42517B8 # sh $a1, 0x17B8($at)
/* 0x00010B78 0x80080778 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00010B7C 0x8008077C 0xA42517BA */ .word 0xA42517BA # sh $a1, 0x17BA($at)
/* 0x00010B80 0x80080780 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00010B84 0x80080784 0x0C0200EE */ .word 0x0C0200EE # jal 0x800803B8
/* 0x00010B88 0x80080788 0xA42617BC */ .word 0xA42617BC # sh $a2, 0x17BC($at)
/* 0x00010B8C 0x8008078C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00010B90 0x80080790 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00010B94 0x80080794 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
