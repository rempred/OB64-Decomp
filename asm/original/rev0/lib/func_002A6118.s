/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A6118..0x002A6150 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS leaf un-merged from plan idx48. No addiu $sp; lui $v0,0x8019 / lw 0x8019FDC0 list-walk (beq/bne loop, j 0x80236918 overlay tail). jr $ra @0x002A6148 + nop delay @0x002A614C (alignment nop attaches here). */
/* 0x002A6118 0x80315D18 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x002A611C 0x80315D1C 0x8C42FDC0 */ .word 0x8C42FDC0 # lw $v0, -0x240($v0)
/* 0x002A6120 0x80315D20 0x8C430004 */ .word 0x8C430004 # lw $v1, 0x4($v0)
/* 0x002A6124 0x80315D24 0x10600008 */ .word 0x10600008 # beq $v1, $zero, 0x80315D48
/* 0x002A6128 0x80315D28 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002A612C 0x80315D2C 0x14640003 */ .word 0x14640003 # bne $v1, $a0, 0x80315D3C
/* 0x002A6130 0x80315D30 0x00000000 */ .word 0x00000000 # nop
/* 0x002A6134 0x80315D34 0x0808DA46 */ .word 0x0808DA46 # j 0x80236918
/* 0x002A6138 0x80315D38 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x002A613C 0x80315D3C 0x8C630004 */ .word 0x8C630004 # lw $v1, 0x4($v1)
/* 0x002A6140 0x80315D40 0x1460FFFA */ .word 0x1460FFFA # bne $v1, $zero, 0x80315D2C
/* 0x002A6144 0x80315D44 0x00000000 */ .word 0x00000000 # nop
/* 0x002A6148 0x80315D48 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A614C 0x80315D4C 0x00000000 */ .word 0x00000000 # nop
