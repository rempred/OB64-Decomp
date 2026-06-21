/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001223C..0x00012248 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001223C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001223c:
/* 0x0001223C 0x80081E3C 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00012240 0x80081E40 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00012244 0x80081E44 0x8C42182C */ .word 0x8C42182C # lw $v0, 0x182C($v0)
