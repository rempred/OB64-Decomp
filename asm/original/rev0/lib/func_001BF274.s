/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BF274..0x001BF2A8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: 'sltiu $v0,$a0,0x4' bounds-check then index into 0x8023A4E0 record array (stride 0x5C via sll/addu) returning pointer in $v0. Internal j 0x80226170. jr$ra at 0x1BF2A0 + delay 0x1BF2A4. */
func_001BF274:
/* 0x001BF274 0x8022EE74 0x2C820004 */ .word 0x2C820004 # sltiu $v0, $a0, 0x4
/* 0x001BF278 0x8022EE78 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8022EE88
/* 0x001BF27C 0x8022EE7C 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x001BF280 0x8022EE80 0x0808985C */ .word 0x0808985C # j 0x80226170
/* 0x001BF284 0x8022EE84 0x00000000 */ .word 0x00000000 # nop
/* 0x001BF288 0x8022EE88 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x001BF28C 0x8022EE8C 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x001BF290 0x8022EE90 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x001BF294 0x8022EE94 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x001BF298 0x8022EE98 0x3C038023 */ .word 0x3C038023 # lui $v1, 0x8023
/* 0x001BF29C 0x8022EE9C 0x2463A4E0 */ .word 0x2463A4E0 # addiu $v1, $v1, -0x5B20
/* 0x001BF2A0 0x8022EEA0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BF2A4 0x8022EEA4 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
