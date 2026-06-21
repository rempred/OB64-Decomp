/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002AB70..0x0002ABA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002AB70 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osSpSetPc:
/* function boundary candidate: func_0002AB70, size=48, kind=leaf */
func_0002AB70:
/* 0x0002AB70 0x8009A770 0x3C02A404 */ .word 0x3C02A404 # lui $v0, 0xA404
/* 0x0002AB74 0x8009A774 0x34420010 */ .word 0x34420010 # ori $v0, $v0, 0x0010
/* 0x0002AB78 0x8009A778 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
/* 0x0002AB7C 0x8009A77C 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0002AB80 0x8009A780 0x10400004 */ .word 0x10400004 # beq $v0, $zero, 0x8009A794
/* 0x0002AB84 0x8009A784 0x3C02A408 */ .word 0x3C02A408 # lui $v0, 0xA408
/* 0x0002AB88 0x8009A788 0xAC440000 */ .word 0xAC440000 # sw $a0, 0x0($v0)
/* 0x0002AB8C 0x8009A78C 0x080269E6 */ .word 0x080269E6 # j 0x8009A798
/* 0x0002AB90 0x8009A790 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0002AB94 0x8009A794 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x0002AB98 0x8009A798 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002AB9C 0x8009A79C 0x00000000 */ .word 0x00000000 # nop
