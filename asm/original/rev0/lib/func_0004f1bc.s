/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004F1BC..0x0004F1E8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* preamble-orphan folded: lui/lw global load at 0x0004F1BC before prologue at 0x0004F1C4; jr $ra at 0x0004F1E0 + delay 0x0004F1E4 */
func_0004f1bc:
/* 0x0004F1BC 0x800BEDBC 0x3C048019 */ .word 0x3C048019 # lui $a0, 0x8019
/* 0x0004F1C0 0x800BEDC0 0x8C84FC68 */ .word 0x8C84FC68 # lw $a0, -0x398($a0)

/* function boundary candidate: func_0004F1C4, size=36, kind=prologue */
func_0004F1C4:
/* 0x0004F1C4 0x800BEDC4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004F1C8 0x800BEDC8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004F1CC 0x800BEDCC 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0004F1D0 0x800BEDD0 0x00000000 */ .word 0x00000000 # nop
/* 0x0004F1D4 0x800BEDD4 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0004F1D8 0x800BEDD8 0xAC22FC68 */ .word 0xAC22FC68 # sw $v0, -0x398($at)
/* 0x0004F1DC 0x800BEDDC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004F1E0 0x800BEDE0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004F1E4 0x800BEDE4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
