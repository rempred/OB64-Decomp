/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F7C0..0x0025F7C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor: jr$ra; lw $v0,0x64($a0) in delay slot. */
/* 0x0025F7C0 0x802CF3C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F7C4 0x802CF3C4 0x8C820064 */ .word 0x8C820064 # lw $v0, 0x64($a0)
