/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B8DD8..0x000B8E18 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* gap3 leaf 1 (frameless). 2 leading nops lead the leaf; body move $a0,$zero/lui 0x8019/lw 0x6AF8. jr $ra @0xB8E10. */
func_000b8dd8:
/* 0x000B8DD8 0x801289D8 0x00000000 */ .word 0x00000000 # nop
/* 0x000B8DDC 0x801289DC 0x00000000 */ .word 0x00000000 # nop
/* 0x000B8DE0 0x801289E0 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x000B8DE4 0x801289E4 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x000B8DE8 0x801289E8 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000B8DEC 0x801289EC 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000B8DF0 0x801289F0 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x000B8DF4 0x801289F4 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000B8DF8 0x801289F8 0xA0400736 */ .word 0xA0400736 # sb $zero, 0x736($v0)
/* 0x000B8DFC 0x801289FC 0x2882000A */ .word 0x2882000A # slti $v0, $a0, 0xA
/* 0x000B8E00 0x80128A00 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x801289E8
/* 0x000B8E04 0x80128A04 0x24630108 */ .word 0x24630108 # addiu $v1, $v1, 0x108
/* 0x000B8E08 0x80128A08 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000B8E0C 0x80128A0C 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000B8E10 0x80128A10 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B8E14 0x80128A14 0xA44010A0 */ .word 0xA44010A0 # sh $zero, 0x10A0($v0)
