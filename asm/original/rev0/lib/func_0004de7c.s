/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DE7C..0x0004DEB4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue, jr $ra at 0x0004DEAC + delay 0x0004DEB0 */
/* function boundary candidate: func_0004DE7C, size=56, kind=prologue */
func_0004DE7C:
/* 0x0004DE7C 0x800BDA7C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DE80 0x800BDA80 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DE84 0x800BDA84 0x0C06B301 */ .word 0x0C06B301 # jal 0x801ACC04
/* 0x0004DE88 0x800BDA88 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DE8C 0x800BDA8C 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x0004DE90 0x800BDA90 0x00021403 */ .word 0x00021403 # sra $v0, $v0, 16
/* 0x0004DE94 0x800BDA94 0x2403FFFF */ .word 0x2403FFFF # addiu $v1, $zero, -0x1
/* 0x0004DE98 0x800BDA98 0x14430003 */ .word 0x14430003 # bne $v0, $v1, 0x800BDAA8
/* 0x0004DE9C 0x800BDA9C 0x3402FFFE */ .word 0x3402FFFE # ori $v0, $zero, 0xFFFE
/* 0x0004DEA0 0x800BDAA0 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0004DEA4 0x800BDAA4 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x0004DEA8 0x800BDAA8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DEAC 0x800BDAAC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DEB0 0x800BDAB0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
