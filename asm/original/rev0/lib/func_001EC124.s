/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001EC124..0x001EC184 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan: true entry is the 2-word read-before-write preamble at 0x001EC124 (lui $v1,0x801C ; lhu $v1,-0x5940($v1)) loading the 0x801CA6C0 flag word that the prologue body at 0x001EC130 (andi $v0,$v1,0x4) reads before writing. Folded forward from the raw prologue at 0x001EC12C (addiu $sp,-0x18). jr $ra at 0x001EC17C, delay slot 0x001EC180. */
func_001EC124:
/* 0x001EC124 0x8025BD24 0x3C03801C */ .word 0x3C03801C # lui $v1, 0x801C
/* 0x001EC128 0x8025BD28 0x9463A6C0 */ .word 0x9463A6C0 # lhu $v1, -0x5940($v1)

/* function boundary candidate: func_001EC12C, size=88, kind=prologue */
func_001EC12C:
/* 0x001EC12C 0x8025BD2C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001EC130 0x8025BD30 0x30620004 */ .word 0x30620004 # andi $v0, $v1, 0x0004
/* 0x001EC134 0x8025BD34 0x1040000A */ .word 0x1040000A # beq $v0, $zero, 0x8025BD60
/* 0x001EC138 0x8025BD38 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001EC13C 0x8025BD3C 0x3C02800E */ .word 0x3C02800E # lui $v0, 0x800E
/* 0x001EC140 0x8025BD40 0x944279B0 */ .word 0x944279B0 # lhu $v0, 0x79B0($v0)
/* 0x001EC144 0x8025BD44 0x30428000 */ .word 0x30428000 # andi $v0, $v0, 0x8000
/* 0x001EC148 0x8025BD48 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x8025BD60
/* 0x001EC14C 0x8025BD4C 0x00000000 */ .word 0x00000000 # nop
/* 0x001EC150 0x8025BD50 0x3062FFFB */ .word 0x3062FFFB # andi $v0, $v1, 0xFFFB
/* 0x001EC154 0x8025BD54 0x34420008 */ .word 0x34420008 # ori $v0, $v0, 0x0008
/* 0x001EC158 0x8025BD58 0x3C01801C */ .word 0x3C01801C # lui $at, 0x801C
/* 0x001EC15C 0x8025BD5C 0xA422A6C0 */ .word 0xA422A6C0 # sh $v0, -0x5940($at)
/* 0x001EC160 0x8025BD60 0x0C06D617 */ .word 0x0C06D617 # jal 0x801B585C
/* 0x001EC164 0x8025BD64 0x00000000 */ .word 0x00000000 # nop
/* 0x001EC168 0x8025BD68 0x0C06D442 */ .word 0x0C06D442 # jal 0x801B5108
/* 0x001EC16C 0x8025BD6C 0x00000000 */ .word 0x00000000 # nop
/* 0x001EC170 0x8025BD70 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x001EC174 0x8025BD74 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001EC178 0x8025BD78 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x001EC17C 0x8025BD7C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001EC180 0x8025BD80 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
