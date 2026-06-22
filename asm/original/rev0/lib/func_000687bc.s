/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00061000_00071000.s
 * z64 range: 0x000687BC..0x00068808 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* HIDDEN FRAMELESS LEAF un-merged from parent idx11. Fresh entry after prior jr+delay: starts lui $a1 + lw (global load), no stack frame. Ends at return jr@0x68800 + nop @0x68804. [fix: start moved +4, prev part absorbed its leaked delay slot] */
func_000687bc:
/* 0x000687BC 0x800D83BC 0x3C05801A */ .word 0x3C05801A # lui $a1, 0x801A
/* 0x000687C0 0x800D83C0 0x8CA5A660 */ .word 0x8CA5A660 # lw $a1, -0x59A0($a1)
/* 0x000687C4 0x800D83C4 0x90A4007E */ .word 0x90A4007E # lbu $a0, 0x7E($a1)
/* 0x000687C8 0x800D83C8 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x000687CC 0x800D83CC 0x308300FF */ .word 0x308300FF # andi $v1, $a0, 0x00FF
/* 0x000687D0 0x800D83D0 0x14620008 */ .word 0x14620008 # bne $v1, $v0, 0x800D83F4
/* 0x000687D4 0x800D83D4 0x24020004 */ .word 0x24020004 # addiu $v0, $zero, 0x4
/* 0x000687D8 0x800D83D8 0x24820001 */ .word 0x24820001 # addiu $v0, $a0, 0x1
/* 0x000687DC 0x800D83DC 0xA0A2007E */ .word 0xA0A2007E # sb $v0, 0x7E($a1)
/* 0x000687E0 0x800D83E0 0x3C05801A */ .word 0x3C05801A # lui $a1, 0x801A
/* 0x000687E4 0x800D83E4 0x8CA5A660 */ .word 0x8CA5A660 # lw $a1, -0x59A0($a1)
/* 0x000687E8 0x800D83E8 0x90A4007E */ .word 0x90A4007E # lbu $a0, 0x7E($a1)
/* 0x000687EC 0x800D83EC 0x24020004 */ .word 0x24020004 # addiu $v0, $zero, 0x4
/* 0x000687F0 0x800D83F0 0x308300FF */ .word 0x308300FF # andi $v1, $a0, 0x00FF
/* 0x000687F4 0x800D83F4 0x14620002 */ .word 0x14620002 # bne $v1, $v0, 0x800D8400
/* 0x000687F8 0x800D83F8 0x24820001 */ .word 0x24820001 # addiu $v0, $a0, 0x1
/* 0x000687FC 0x800D83FC 0xA0A2007E */ .word 0xA0A2007E # sb $v0, 0x7E($a1)
/* 0x00068800 0x800D8400 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00068804 0x800D8404 0x00000000 */ .word 0x00000000 # nop
