/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x00135670..0x001356A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (no $sp adjust; lui/addiu $v1,0x801F-0x2B5C read-before-write). Linear-scan table lookup loop. jr $ra@0x00135694, delay 0x00135698 (move $v0,$a1). Trailing alignment nop at 0x0013569C folded in to reach 8-aligned next entry. Recovered from over-merged seed idx 32. */
/* 0x00135670 0x801A5270 0x3C03801F */ .word 0x3C03801F # lui $v1, 0x801F
/* 0x00135674 0x801A5274 0x2463D4A4 */ .word 0x2463D4A4 # addiu $v1, $v1, -0x2B5C
/* 0x00135678 0x801A5278 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x0013567C 0x801A527C 0x10440005 */ .word 0x10440005 # beq $v0, $a0, 0x801A5294
/* 0x00135680 0x801A5280 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00135684 0x801A5284 0x2463000C */ .word 0x2463000C # addiu $v1, $v1, 0xC
/* 0x00135688 0x801A5288 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x0013568C 0x801A528C 0x1444FFFD */ .word 0x1444FFFD # bne $v0, $a0, 0x801A5284
/* 0x00135690 0x801A5290 0x24A50003 */ .word 0x24A50003 # addiu $a1, $a1, 0x3
/* 0x00135694 0x801A5294 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00135698 0x801A5298 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x0013569C 0x801A529C 0x00000000 */ .word 0x00000000 # nop
