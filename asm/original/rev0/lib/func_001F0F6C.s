/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0F6C..0x001F0F90 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless push helper: lui $v0,0x801D / lw -0x1744 / lw 0x56C0; appends to table at 0x52C0; jr$ra@1F0F88 + delay sw $a0,0x52C0($v1) @1F0F8C. */
func_001F0F6C:
/* 0x001F0F6C 0x80260B6C 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x001F0F70 0x80260B70 0x8C42E8BC */ .word 0x8C42E8BC # lw $v0, -0x1744($v0)
/* 0x001F0F74 0x80260B74 0x8C4356C0 */ .word 0x8C4356C0 # lw $v1, 0x56C0($v0)
/* 0x001F0F78 0x80260B78 0x24650001 */ .word 0x24650001 # addiu $a1, $v1, 0x1
/* 0x001F0F7C 0x80260B7C 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x001F0F80 0x80260B80 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x001F0F84 0x80260B84 0xAC4556C0 */ .word 0xAC4556C0 # sw $a1, 0x56C0($v0)
/* 0x001F0F88 0x80260B88 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F0F8C 0x80260B8C 0xAC6452C0 */ .word 0xAC6452C0 # sw $a0, 0x52C0($v1)
