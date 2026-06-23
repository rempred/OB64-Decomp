/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BA4B0..0x001BA4FC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf. nor a0; lw 0x8023:-0x6320 table; nested and-mask loop; jr ra at 0x001BA4F4 + delay (nop) at 0x001BA4F8. One of a family of near-identical mask-clear leaves. */
func_001BA4B0:
/* 0x001BA4B0 0x8022A0B0 0x00003821 */ .word 0x00003821 # move $a3, $zero
/* 0x001BA4B4 0x8022A0B4 0x00042027 */ .word 0x00042027 # nor $a0, $zero, $a0
/* 0x001BA4B8 0x8022A0B8 0x3C068023 */ .word 0x3C068023 # lui $a2, 0x8023
/* 0x001BA4BC 0x8022A0BC 0x24C69CE0 */ .word 0x24C69CE0 # addiu $a2, $a2, -0x6320
/* 0x001BA4C0 0x8022A0C0 0x8CC50000 */ .word 0x8CC50000 # lw $a1, 0x0($a2)
/* 0x001BA4C4 0x8022A0C4 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x001BA4C8 0x8022A0C8 0x94A20000 */ .word 0x94A20000 # lhu $v0, 0x0($a1)
/* 0x001BA4CC 0x8022A0CC 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x001BA4D0 0x8022A0D0 0x00441024 */ .word 0x00441024 # and $v0, $v0, $a0
/* 0x001BA4D4 0x8022A0D4 0xA4A20000 */ .word 0xA4A20000 # sh $v0, 0x0($a1)
/* 0x001BA4D8 0x8022A0D8 0x28620004 */ .word 0x28620004 # slti $v0, $v1, 0x4
/* 0x001BA4DC 0x8022A0DC 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x8022A0C8
/* 0x001BA4E0 0x8022A0E0 0x00000000 */ .word 0x00000000 # nop
/* 0x001BA4E4 0x8022A0E4 0x24E70001 */ .word 0x24E70001 # addiu $a3, $a3, 0x1
/* 0x001BA4E8 0x8022A0E8 0x28E20003 */ .word 0x28E20003 # slti $v0, $a3, 0x3
/* 0x001BA4EC 0x8022A0EC 0x1440FFF4 */ .word 0x1440FFF4 # bne $v0, $zero, 0x8022A0C0
/* 0x001BA4F0 0x8022A0F0 0x24C60004 */ .word 0x24C60004 # addiu $a2, $a2, 0x4
/* 0x001BA4F4 0x8022A0F4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BA4F8 0x8022A0F8 0x00000000 */ .word 0x00000000 # nop
