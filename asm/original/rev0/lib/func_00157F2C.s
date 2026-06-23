/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x00157F2C..0x00157F54 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (starts addiu $v0,4 / andi $a0). Writes struct via $a1; jr $ra 0x00157F4C + delay 0x00157F50. Body ends 0x00157F54; lui/lw at 0x00157F54 is next part's preamble. */
/* 0x00157F2C 0x801C7B2C 0x24020004 */ .word 0x24020004 # addiu $v0, $zero, 0x4
/* 0x00157F30 0x801C7B30 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00157F34 0x801C7B34 0x2484FFFF */ .word 0x2484FFFF # addiu $a0, $a0, -0x1
/* 0x00157F38 0x801C7B38 0xA4A20004 */ .word 0xA4A20004 # sh $v0, 0x4($a1)
/* 0x00157F3C 0x801C7B3C 0x240200FF */ .word 0x240200FF # addiu $v0, $zero, 0xFF
/* 0x00157F40 0x801C7B40 0xA4A00000 */ .word 0xA4A00000 # sh $zero, 0x0($a1)
/* 0x00157F44 0x801C7B44 0xA4A00002 */ .word 0xA4A00002 # sh $zero, 0x2($a1)
/* 0x00157F48 0x801C7B48 0xA4A40006 */ .word 0xA4A40006 # sh $a0, 0x6($a1)
/* 0x00157F4C 0x801C7B4C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00157F50 0x801C7B50 0xA4A20008 */ .word 0xA4A20008 # sh $v0, 0x8($a1)
