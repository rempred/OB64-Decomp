/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00283654..0x00283664 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless setter leaf: addiu $v0,1; ends jr$ra@0x0028365C + sw $v0,-0x5670($at) delay. */
/* 0x00283654 0x802F3254 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00283658 0x802F3258 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x0028365C 0x802F325C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00283660 0x802F3260 0xAC22A990 */ .word 0xAC22A990 # sw $v0, -0x5670($at)
