/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000EE058..0x000EE094 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame 0x18 leaf-ish. Preamble lui $v0,0x8019/lbu -0xB7F (0xEE050..0xEE054) from previous tail folded as entry approach; clean jr $ra at 0xEE08C. */
func_000ee058:
/* function boundary candidate: func_000EE058, size=60, kind=prologue */
func_000EE058:
/* 0x000EE058 0x8015DC58 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000EE05C 0x8015DC5C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000EE060 0x8015DC60 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000EE064 0x8015DC64 0xA020F55B */ .word 0xA020F55B # sb $zero, -0xAA5($at)
/* 0x000EE068 0x8015DC68 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000EE06C 0x8015DC6C 0xA420F55C */ .word 0xA420F55C # sh $zero, -0xAA4($at)
/* 0x000EE070 0x8015DC70 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000EE074 0x8015DC74 0xA420F55E */ .word 0xA420F55E # sh $zero, -0xAA2($at)
/* 0x000EE078 0x8015DC78 0x30420003 */ .word 0x30420003 # andi $v0, $v0, 0x0003
/* 0x000EE07C 0x8015DC7C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000EE080 0x8015DC80 0x0C069267 */ .word 0x0C069267 # jal 0x801A499C
/* 0x000EE084 0x8015DC84 0xA022F53F */ .word 0xA022F53F # sb $v0, -0xAC1($at)
/* 0x000EE088 0x8015DC88 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000EE08C 0x8015DC8C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000EE090 0x8015DC90 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
