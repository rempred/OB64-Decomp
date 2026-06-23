/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB11C..0x001BB130 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (non-prologue fall-through after func_001BAE48 jr-ra delay). lw 0x8(a0); addiu +4; sw back (advances a cursor field); jr ra at 0x001BB128 + delay (move v0,zero) at 0x001BB12C. Ends exactly at slice end 0x001BB130 (next prologue func_001BB130). */
func_001BB11C:
/* 0x001BB11C 0x8022AD1C 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BB120 0x8022AD20 0x24420004 */ .word 0x24420004 # addiu $v0, $v0, 0x4
/* 0x001BB124 0x8022AD24 0xAC820008 */ .word 0xAC820008 # sw $v0, 0x8($a0)
/* 0x001BB128 0x8022AD28 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB12C 0x8022AD2C 0x00001021 */ .word 0x00001021 # move $v0, $zero
