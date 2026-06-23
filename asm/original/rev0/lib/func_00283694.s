/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00283694..0x002836A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless getter leaf: lw 0x8023A990; ends jr$ra@0x0028369C + addiu $v0,-1 delay. */
/* 0x00283694 0x802F3294 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x00283698 0x802F3298 0x8C42A990 */ .word 0x8C42A990 # lw $v0, -0x5670($v0)
/* 0x0028369C 0x802F329C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002836A0 0x802F32A0 0x2442FFFF */ .word 0x2442FFFF # addiu $v0, $v0, -0x1
