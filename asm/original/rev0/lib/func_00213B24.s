/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213B24..0x00213B50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf reading $a0: lw $v1,0x48($a0); compares 0x101; internal beq to 0x213B3C; j 0x801D0870 tail-jump (internal) with lbu delay slot; branch-target path lbu $v0,0x33($a0); jr $ra @0x213B40; nop delay slot; two trailing alignment nops attach to end. */
/* 0x00213B24 0x80283724 0x8C830048 */ .word 0x8C830048 # lw $v1, 0x48($a0)
/* 0x00213B28 0x80283728 0x24020101 */ .word 0x24020101 # addiu $v0, $zero, 0x101
/* 0x00213B2C 0x8028372C 0x10620003 */ .word 0x10620003 # beq $v1, $v0, 0x8028373C
/* 0x00213B30 0x80283730 0x00000000 */ .word 0x00000000 # nop
/* 0x00213B34 0x80283734 0x0807421C */ .word 0x0807421C # j 0x801D0870
/* 0x00213B38 0x80283738 0x908200A4 */ .word 0x908200A4 # lbu $v0, 0xA4($a0)
/* 0x00213B3C 0x8028373C 0x90820033 */ .word 0x90820033 # lbu $v0, 0x33($a0)
/* 0x00213B40 0x80283740 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00213B44 0x80283744 0x00000000 */ .word 0x00000000 # nop
/* 0x00213B48 0x80283748 0x00000000 */ .word 0x00000000 # nop
/* 0x00213B4C 0x8028374C 0x00000000 */ .word 0x00000000 # nop
