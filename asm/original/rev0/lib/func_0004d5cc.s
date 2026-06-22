/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004D5CC..0x0004D5F4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18; jr $ra at 0x4D5EC + delay 0x4D5F0. Un-merged from parent file 86 which over-ran into following frameless leaf. */
/* function boundary candidate: func_0004D5CC, size=52, kind=prologue */
func_0004D5CC:
/* 0x0004D5CC 0x800BD1CC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004D5D0 0x800BD1D0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004D5D4 0x800BD1D4 0x0C066020 */ .word 0x0C066020 # jal 0x80198080
/* 0x0004D5D8 0x800BD1D8 0x2404FFFF */ .word 0x2404FFFF # addiu $a0, $zero, -0x1
/* 0x0004D5DC 0x800BD1DC 0x3402800E */ .word 0x3402800E # ori $v0, $zero, 0x800E
/* 0x0004D5E0 0x800BD1E0 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0004D5E4 0x800BD1E4 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x0004D5E8 0x800BD1E8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004D5EC 0x800BD1EC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004D5F0 0x800BD1F0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
