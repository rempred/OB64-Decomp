/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005AFF8..0x0005B000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless 2-word stub (jr $ra; nop) split from cluster. */
func_0005aff8:
/* 0x0005AFF8 0x800CABF8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005AFFC 0x800CABFC 0x00000000 */ .word 0x00000000 # nop
