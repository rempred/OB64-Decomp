/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B47D8..0x000B47FC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless/leaf split at jr $ra boundary; overlay-relocated (linear RAM column is wrong map). */
func_000b47d8:
/* 0x000B47D8 0x801243D8 0x24020018 */ .word 0x24020018 # addiu $v0, $zero, 0x18
/* 0x000B47DC 0x801243DC 0xA4820000 */ .word 0xA4820000 # sh $v0, 0x0($a0)
/* 0x000B47E0 0x801243E0 0x24020014 */ .word 0x24020014 # addiu $v0, $zero, 0x14
/* 0x000B47E4 0x801243E4 0xA4A20000 */ .word 0xA4A20000 # sh $v0, 0x0($a1)
/* 0x000B47E8 0x801243E8 0x24020128 */ .word 0x24020128 # addiu $v0, $zero, 0x128
/* 0x000B47EC 0x801243EC 0xA4C20000 */ .word 0xA4C20000 # sh $v0, 0x0($a2)
/* 0x000B47F0 0x801243F0 0x2402009A */ .word 0x2402009A # addiu $v0, $zero, 0x9A
/* 0x000B47F4 0x801243F4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B47F8 0x801243F8 0xA4E20000 */ .word 0xA4E20000 # sh $v0, 0x0($a3)
