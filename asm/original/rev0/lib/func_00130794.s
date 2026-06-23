/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x00130794..0x001307D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf via fall-through after func_001305B4's jr/delay slot. Starts at lui $v1,0x8019 then self-writes $v1 (lbu) - self-contained, not a preamble. Ends jr $ra@0x001307CC + delay 0x001307D0 (move $v0,$a0). */
/* 0x00130794 0x801A0394 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00130798 0x801A0398 0x9063F481 */ .word 0x9063F481 # lbu $v1, -0xB7F($v1)
/* 0x0013079C 0x801A039C 0x3864003F */ .word 0x3864003F # xori $a0, $v1, 0x003F
/* 0x001307A0 0x801A03A0 0x2C840001 */ .word 0x2C840001 # sltiu $a0, $a0, 0x1
/* 0x001307A4 0x801A03A4 0x38620041 */ .word 0x38620041 # xori $v0, $v1, 0x0041
/* 0x001307A8 0x801A03A8 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x001307AC 0x801A03AC 0x00822025 */ .word 0x00822025 # or $a0, $a0, $v0
/* 0x001307B0 0x801A03B0 0x38620040 */ .word 0x38620040 # xori $v0, $v1, 0x0040
/* 0x001307B4 0x801A03B4 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x001307B8 0x801A03B8 0x38630042 */ .word 0x38630042 # xori $v1, $v1, 0x0042
/* 0x001307BC 0x801A03BC 0x2C630001 */ .word 0x2C630001 # sltiu $v1, $v1, 0x1
/* 0x001307C0 0x801A03C0 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x001307C4 0x801A03C4 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x801A03CC
/* 0x001307C8 0x801A03C8 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x001307CC 0x801A03CC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001307D0 0x801A03D0 0x00801021 */ .word 0x00801021 # move $v0, $a0
