/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DD74..0x0004DDA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn, jr $ra at 0x0004DD98 + delay 0x0004DD9C */
/* function boundary candidate: func_0004DD74, size=44, kind=prologue */
func_0004DD74:
/* 0x0004DD74 0x800BD974 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DD78 0x800BD978 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DD7C 0x800BD97C 0x0C068F20 */ .word 0x0C068F20 # jal 0x801A3C80
/* 0x0004DD80 0x800BD980 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DD84 0x800BD984 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800BD994
/* 0x0004DD88 0x800BD988 0x34028004 */ .word 0x34028004 # ori $v0, $zero, 0x8004
/* 0x0004DD8C 0x800BD98C 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0004DD90 0x800BD990 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x0004DD94 0x800BD994 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DD98 0x800BD998 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DD9C 0x800BD99C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
