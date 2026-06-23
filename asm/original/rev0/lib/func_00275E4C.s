/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275E4C..0x00275E5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf flag-clear accessor: lhu 0x20($a0); andi 0xFFFE; jr$ra@0x275E54 + delay sh@0x275E58. */
/* 0x00275E4C 0x802E5A4C 0x94820020 */ .word 0x94820020 # lhu $v0, 0x20($a0)
/* 0x00275E50 0x802E5A50 0x3042FFFE */ .word 0x3042FFFE # andi $v0, $v0, 0xFFFE
/* 0x00275E54 0x802E5A54 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00275E58 0x802E5A58 0xA4820020 */ .word 0xA4820020 # sh $v0, 0x20($a0)
