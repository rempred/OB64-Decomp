/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004EB64..0x0004EB90 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lui/lw/lhu global probe), jr $ra at 0x0004EB88 + delay nop 0x0004EB8C; split out of parent 0x0004EAF4 */
func_0004eb64:
/* 0x0004EB64 0x800BE764 0x3C02800C */ .word 0x3C02800C # lui $v0, 0x800C
/* 0x0004EB68 0x800BE768 0x8C424BBC */ .word 0x8C424BBC # lw $v0, 0x4BBC($v0)
/* 0x0004EB6C 0x800BE76C 0x94440004 */ .word 0x94440004 # lhu $a0, 0x4($v0)
/* 0x0004EB70 0x800BE770 0x24030002 */ .word 0x24030002 # addiu $v1, $zero, 0x2
/* 0x0004EB74 0x800BE774 0x14830004 */ .word 0x14830004 # bne $a0, $v1, 0x800BE788
/* 0x0004EB78 0x800BE778 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0004EB7C 0x800BE77C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004EB80 0x800BE780 0x9042FC19 */ .word 0x9042FC19 # lbu $v0, -0x3E7($v0)
/* 0x0004EB84 0x800BE784 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x0004EB88 0x800BE788 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004EB8C 0x800BE78C 0x00000000 */ .word 0x00000000 # nop
