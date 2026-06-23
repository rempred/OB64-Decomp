/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00283664..0x00283694 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: load/clamp counter at 0x8023A990; ends jr$ra@0x0028368C + nop delay. */
/* 0x00283664 0x802F3264 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x00283668 0x802F3268 0x8C84A990 */ .word 0x8C84A990 # lw $a0, -0x5670($a0)
/* 0x0028366C 0x802F326C 0x3C020FFF */ .word 0x3C020FFF # lui $v0, 0x0FFF
/* 0x00283670 0x802F3270 0x3442FFFD */ .word 0x3442FFFD # ori $v0, $v0, 0xFFFD
/* 0x00283674 0x802F3274 0x2483FFFF */ .word 0x2483FFFF # addiu $v1, $a0, -0x1
/* 0x00283678 0x802F3278 0x0043102B */ .word 0x0043102B # sltu $v0, $v0, $v1
/* 0x0028367C 0x802F327C 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x802F328C
/* 0x00283680 0x802F3280 0x24820001 */ .word 0x24820001 # addiu $v0, $a0, 0x1
/* 0x00283684 0x802F3284 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x00283688 0x802F3288 0xAC22A990 */ .word 0xAC22A990 # sw $v0, -0x5670($at)
/* 0x0028368C 0x802F328C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00283690 0x802F3290 0x00000000 */ .word 0x00000000 # nop
