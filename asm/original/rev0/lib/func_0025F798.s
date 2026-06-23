/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F798..0x0025F7A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor: jr$ra; lw $v0,0x60($a0) in delay slot. */
/* 0x0025F798 0x802CF398 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F79C 0x802CF39C 0x8C820060 */ .word 0x8C820060 # lw $v0, 0x60($a0)
