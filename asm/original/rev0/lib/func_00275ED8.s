/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275ED8..0x00275EE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 2-word frameless leaf (empty stub): jr$ra@0x275ED8 + delay nop@0x275EDC. Separate function falling through after func_00275EB0's return. */
/* 0x00275ED8 0x802E5AD8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00275EDC 0x802E5ADC 0x00000000 */ .word 0x00000000 # nop
