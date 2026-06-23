/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145DD0..0x00145DD8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 2-word frameless leaf: jr $ra at 0x00145DD0 + delay sw $a1,0x4($a0) at 0x00145DD4. Setter. */
/* 0x00145DD0 0x801B59D0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145DD4 0x801B59D4 0xAC850004 */ .word 0xAC850004 # sw $a1, 0x4($a0)
