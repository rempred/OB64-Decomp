/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B8600..0x002B8610 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless one-instruction setter leaf: jr$ra@0x2B8600 + delay sw $a1,0x50($a0)@0x2B8604. Two alignment nops at 0x2B8608/0x2B860C attach to its end. Separate function un-merged from over-merged parent idx 59. */
func_002B8600:
/* 0x002B8600 0x80328200 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B8604 0x80328204 0xAC850050 */ .word 0xAC850050 # sw $a1, 0x50($a0)
/* 0x002B8608 0x80328208 0x00000000 */ .word 0x00000000 # nop
/* 0x002B860C 0x8032820C 0x00000000 */ .word 0x00000000 # nop
