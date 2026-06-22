/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E1B8..0x0004E1C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, lui/jr $ra at 0x0004E1BC/addiu delay; un-merged from parent 0x0004E19C; ends at SLICE_END */
func_0004e1b8:
/* 0x0004E1B8 0x800BDDB8 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004E1BC 0x800BDDBC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E1C0 0x800BDDC0 0x2442FBE0 */ .word 0x2442FBE0 # addiu $v0, $v0, -0x420
