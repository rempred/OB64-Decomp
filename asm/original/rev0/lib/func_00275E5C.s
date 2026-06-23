/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275E5C..0x00275E68 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 3-word frameless leaf getter: lhu 0x20($a0); jr$ra@0x275E60 + delay andi$v0,0x0001@0x275E64. */
/* 0x00275E5C 0x802E5A5C 0x94820020 */ .word 0x94820020 # lhu $v0, 0x20($a0)
/* 0x00275E60 0x802E5A60 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00275E64 0x802E5A64 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
