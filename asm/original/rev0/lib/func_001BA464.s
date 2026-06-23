/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BA464..0x001BA4B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (non-prologue fall-through after func_001BA3EC jr-ra delay). move a3,zero; lhu/and/sh mask loop over 0x8023 state table; jr ra at 0x001BA4A8 + delay (nop) at 0x001BA4AC. */
func_001BA464:
/* 0x001BA464 0x8022A064 0x00003821 */ .word 0x00003821 # move $a3, $zero
/* 0x001BA468 0x8022A068 0x3C068023 */ .word 0x3C068023 # lui $a2, 0x8023
/* 0x001BA46C 0x8022A06C 0x24C6A218 */ .word 0x24C6A218 # addiu $a2, $a2, -0x5DE8
/* 0x001BA470 0x8022A070 0x3C058023 */ .word 0x3C058023 # lui $a1, 0x8023
/* 0x001BA474 0x8022A074 0x24A59CB0 */ .word 0x24A59CB0 # addiu $a1, $a1, -0x6350
/* 0x001BA478 0x8022A078 0x94C30000 */ .word 0x94C30000 # lhu $v1, 0x0($a2)
/* 0x001BA47C 0x8022A07C 0x24C60002 */ .word 0x24C60002 # addiu $a2, $a2, 0x2
/* 0x001BA480 0x8022A080 0x8CA40000 */ .word 0x8CA40000 # lw $a0, 0x0($a1)
/* 0x001BA484 0x8022A084 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x001BA488 0x8022A088 0x9442A822 */ .word 0x9442A822 # lhu $v0, -0x57DE($v0)
/* 0x001BA48C 0x8022A08C 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x001BA490 0x8022A090 0x24E70001 */ .word 0x24E70001 # addiu $a3, $a3, 0x1
/* 0x001BA494 0x8022A094 0x00021027 */ .word 0x00021027 # nor $v0, $zero, $v0
/* 0x001BA498 0x8022A098 0x00621824 */ .word 0x00621824 # and $v1, $v1, $v0
/* 0x001BA49C 0x8022A09C 0x2CE2000C */ .word 0x2CE2000C # sltiu $v0, $a3, 0xC
/* 0x001BA4A0 0x8022A0A0 0x1440FFF5 */ .word 0x1440FFF5 # bne $v0, $zero, 0x8022A078
/* 0x001BA4A4 0x8022A0A4 0xA4830000 */ .word 0xA4830000 # sh $v1, 0x0($a0)
/* 0x001BA4A8 0x8022A0A8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BA4AC 0x8022A0AC 0x00000000 */ .word 0x00000000 # nop
