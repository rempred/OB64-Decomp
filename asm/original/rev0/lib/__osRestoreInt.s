/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00029B40..0x00029B60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00029B40 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osRestoreInt:
/* 0x00029B40 0x80099740 0x40086000 */ .word 0x40086000 # mfc0 $t0, $12
/* 0x00029B44 0x80099744 0x01044025 */ .word 0x01044025 # or $t0, $t0, $a0
/* 0x00029B48 0x80099748 0x40886000 */ .word 0x40886000 # mtc0 $t0, $12
/* 0x00029B4C 0x8009974C 0x00000000 */ .word 0x00000000 # nop
/* 0x00029B50 0x80099750 0x00000000 */ .word 0x00000000 # nop
/* 0x00029B54 0x80099754 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00029B58 0x80099758 0x00000000 */ .word 0x00000000 # nop
/* 0x00029B5C 0x8009975C 0x00000000 */ .word 0x00000000 # nop
