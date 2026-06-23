/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145DC8..0x00145DD0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 2-word frameless leaf: jr $ra at 0x00145DC8 + delay sw $a1,0x0($a0) at 0x00145DCC. Setter. */
/* 0x00145DC8 0x801B59C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145DCC 0x801B59CC 0xAC850000 */ .word 0xAC850000 # sw $a1, 0x0($a0)
