/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x002A0374..0x002A0390 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* leaf wrapper; prologue addiu$sp,-0x18; ends jr$ra@0x002A0388 + delay@0x002A038C. */
/* function boundary candidate: func_002A0374, size=28, kind=prologue */
func_002A0374:
/* 0x002A0374 0x8030FF74 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002A0378 0x8030FF78 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002A037C 0x8030FF7C 0x0C067CB0 */ .word 0x0C067CB0 # jal 0x8019F2C0
/* 0x002A0380 0x8030FF80 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x002A0384 0x8030FF84 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002A0388 0x8030FF88 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A038C 0x8030FF8C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
