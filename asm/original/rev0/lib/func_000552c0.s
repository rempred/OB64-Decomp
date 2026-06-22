/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x000552C0..0x00055308 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (un-merged from parent idx27). Fresh entry: lui $v0,0x8019; lw -0x240($v0); branch then j 0x8017F400; list-walk; jr $ra at 0x00055300 + delay slot 0x00055304 (nop). */
func_000552c0:
/* 0x000552C0 0x800C4EC0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000552C4 0x800C4EC4 0x8C42FDC0 */ .word 0x8C42FDC0 # lw $v0, -0x240($v0)
/* 0x000552C8 0x800C4EC8 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x800C4ED8
/* 0x000552CC 0x800C4ECC 0x00000000 */ .word 0x00000000 # nop
/* 0x000552D0 0x800C4ED0 0x0805FD00 */ .word 0x0805FD00 # j 0x8017F400
/* 0x000552D4 0x800C4ED4 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x000552D8 0x800C4ED8 0x8C430004 */ .word 0x8C430004 # lw $v1, 0x4($v0)
/* 0x000552DC 0x800C4EDC 0x10600008 */ .word 0x10600008 # beq $v1, $zero, 0x800C4F00
/* 0x000552E0 0x800C4EE0 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x000552E4 0x800C4EE4 0x8C620004 */ .word 0x8C620004 # lw $v0, 0x4($v1)
/* 0x000552E8 0x800C4EE8 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x800C4F00
/* 0x000552EC 0x800C4EEC 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x000552F0 0x800C4EF0 0x8C630004 */ .word 0x8C630004 # lw $v1, 0x4($v1)
/* 0x000552F4 0x800C4EF4 0x8C620004 */ .word 0x8C620004 # lw $v0, 0x4($v1)
/* 0x000552F8 0x800C4EF8 0x1440FFFD */ .word 0x1440FFFD # bne $v0, $zero, 0x800C4EF0
/* 0x000552FC 0x800C4EFC 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x00055300 0x800C4F00 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00055304 0x800C4F04 0x00000000 */ .word 0x00000000 # nop
