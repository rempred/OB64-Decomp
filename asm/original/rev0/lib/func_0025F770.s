/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F770..0x0025F778 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor: jr$ra; lw $v0,0x5C($a0) in delay slot. */
/* 0x0025F770 0x802CF370 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F774 0x802CF374 0x8C82005C */ .word 0x8C82005C # lw $v0, 0x5C($a0)
