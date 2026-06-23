/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x00128E78..0x00128E80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless stub leaf reached by fall-through after prior function's return: jr $ra @0x00128E78 + nop delay slot @0x00128E7C. No prologue. */
/* 0x00128E78 0x80198A78 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00128E7C 0x80198A7C 0x00000000 */ .word 0x00000000 # nop
