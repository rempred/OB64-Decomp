/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00279A50..0x00279A58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor split out of parent func_002799B8 over-merge: jr$ra@0x00279A50 + delay lw $v0,0x58($a0)@0x00279A54. Returns word at +0x58 of $a0. */
/* 0x00279A50 0x802E9650 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00279A54 0x802E9654 0x8C820058 */ .word 0x8C820058 # lw $v0, 0x58($a0)
