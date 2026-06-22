/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x00090E40..0x00090E54 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Hidden frameless leaf split from parent idx 24. Reads arg regs (slt $v0,$a1,$a0; bnel; move $a0,$a1; jr $ra; move $v0,$a0) — max(a0,a1) idiom returning in $v0. Reaches slice end 0x90E54. */
func_00090e40:
/* 0x00090E40 0x80100A40 0x00A4102A */ .word 0x00A4102A # slt $v0, $a1, $a0
/* 0x00090E44 0x80100A44 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x80100A4C
/* 0x00090E48 0x80100A48 0x00A02021 */ .word 0x00A02021 # move $a0, $a1
/* 0x00090E4C 0x80100A4C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00090E50 0x80100A50 0x00801021 */ .word 0x00801021 # move $v0, $a0
