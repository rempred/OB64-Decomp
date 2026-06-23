/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x0010D450..0x0010D484 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf reached by fall-through after func_0010D2B0's jr $ra; no addiu $sp,-N prologue (starts lui $v1,0x801F). Reads 801F.0DE0 and 801F.0CA4, computes $v0, returns via jr $ra at 0x0010D47C + delay (nop) at 0x0010D480. */
/* 0x0010D450 0x8017D050 0x3C03801F */ .word 0x3C03801F # lui $v1, 0x801F
/* 0x0010D454 0x8017D054 0x8C630DE0 */ .word 0x8C630DE0 # lw $v1, 0xDE0($v1)
/* 0x0010D458 0x8017D058 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x0010D45C 0x8017D05C 0x14620007 */ .word 0x14620007 # bne $v1, $v0, 0x8017D07C
/* 0x0010D460 0x8017D060 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0010D464 0x8017D064 0x3C03801F */ .word 0x3C03801F # lui $v1, 0x801F
/* 0x0010D468 0x8017D068 0x8C630CA4 */ .word 0x8C630CA4 # lw $v1, 0xCA4($v1)
/* 0x0010D46C 0x8017D06C 0x2462FFE8 */ .word 0x2462FFE8 # addiu $v0, $v1, -0x18
/* 0x0010D470 0x8017D070 0x2C420002 */ .word 0x2C420002 # sltiu $v0, $v0, 0x2
/* 0x0010D474 0x8017D074 0x00021023 */ .word 0x00021023 # subu $v0, $zero, $v0
/* 0x0010D478 0x8017D078 0x00621024 */ .word 0x00621024 # and $v0, $v1, $v0
/* 0x0010D47C 0x8017D07C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0010D480 0x8017D080 0x00000000 */ .word 0x00000000 # nop
