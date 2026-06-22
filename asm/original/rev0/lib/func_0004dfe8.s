/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DFE8..0x0004E004 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x0004DFE8 (40B); real func ends jr $ra at 0x0004DFFC + delay 0x0004E000 */
/* function boundary candidate: func_0004DFE8, size=40, kind=prologue */
func_0004DFE8:
/* 0x0004DFE8 0x800BDBE8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DFEC 0x800BDBEC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DFF0 0x800BDBF0 0x0C06D6B3 */ .word 0x0C06D6B3 # jal 0x801B5ACC
/* 0x0004DFF4 0x800BDBF4 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DFF8 0x800BDBF8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DFFC 0x800BDBFC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E000 0x800BDC00 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
