/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023F604..0x0023F638 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Read-before-write preamble folded FORWARD: 0x0023F604 lui $v0,0x801F / 0x0023F608 lw $v0,-0x1B8($v0) load $v0 read first by the framed body (addiu $sp,-0x18 at 0x0023F60C) at 0x0023F614 lhu $v0,0x650($v0). If flag 0x650 & 0x10 set, calls 0x801EADF8. jr $ra at 0x0023F630 + delay (addiu $sp,0x18) at 0x0023F634. */
func_0023F604:
/* 0x0023F604 0x802AF204 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x0023F608 0x802AF208 0x8C42FE48 */ .word 0x8C42FE48 # lw $v0, -0x1B8($v0)

/* function boundary candidate: func_0023F60C, size=44, kind=prologue */
func_0023F60C:
/* 0x0023F60C 0x802AF20C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0023F610 0x802AF210 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0023F614 0x802AF214 0x94420650 */ .word 0x94420650 # lhu $v0, 0x650($v0)
/* 0x0023F618 0x802AF218 0x30420010 */ .word 0x30420010 # andi $v0, $v0, 0x0010
/* 0x0023F61C 0x802AF21C 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x802AF22C
/* 0x0023F620 0x802AF220 0x00000000 */ .word 0x00000000 # nop
/* 0x0023F624 0x802AF224 0x0C07AB7E */ .word 0x0C07AB7E # jal 0x801EADF8
/* 0x0023F628 0x802AF228 0x00000000 */ .word 0x00000000 # nop
/* 0x0023F62C 0x802AF22C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0023F630 0x802AF230 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023F634 0x802AF234 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
