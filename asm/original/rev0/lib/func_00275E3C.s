/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275E3C..0x00275E4C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf flag-set accessor: lhu 0x20($a0); ori 1; jr$ra@0x275E44 + delay sh@0x275E48. */
/* 0x00275E3C 0x802E5A3C 0x94820020 */ .word 0x94820020 # lhu $v0, 0x20($a0)
/* 0x00275E40 0x802E5A40 0x34420001 */ .word 0x34420001 # ori $v0, $v0, 0x0001
/* 0x00275E44 0x802E5A44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00275E48 0x802E5A48 0xA4820020 */ .word 0xA4820020 # sh $v0, 0x20($a0)
