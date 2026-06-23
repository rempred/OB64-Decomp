/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001D1000_001E1000.s
 * z64 range: 0x001E0FC0..0x001E1000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler head: this function begins here and continues into the next 64 KiB chunk. Outgoing function straddler-head. Two-word boundary prefix at 0x1E0FC0..0x1E0FC8 precedes the parent prologue at 0x1E0FC8; no jr$ra before chunk end, so chunk 30 must continue this function first. */
/* 0x001E0FC0 0x80250BC0 0x3C02801C */ .word 0x3C02801C # lui $v0, 0x801C
/* 0x001E0FC4 0x80250BC4 0x8C4294B8 */ .word 0x8C4294B8 # lw $v0, -0x6B48($v0)

/* function boundary candidate: func_001E0FC8, size=580, kind=prologue */
func_001E0FC8:
/* 0x001E0FC8 0x80250BC8 0x27BDFFD0 */ .word 0x27BDFFD0 # addiu $sp, $sp, -0x30
/* 0x001E0FCC 0x80250BCC 0xAFB1001C */ .word 0xAFB1001C # sw $s1, 0x1C($sp)
/* 0x001E0FD0 0x80250BD0 0x00008821 */ .word 0x00008821 # move $s1, $zero
/* 0x001E0FD4 0x80250BD4 0xAFB20020 */ .word 0xAFB20020 # sw $s2, 0x20($sp)
/* 0x001E0FD8 0x80250BD8 0x3C12801C */ .word 0x3C12801C # lui $s2, 0x801C
/* 0x001E0FDC 0x80250BDC 0x2652A568 */ .word 0x2652A568 # addiu $s2, $s2, -0x5A98
/* 0x001E0FE0 0x80250BE0 0xAFB40028 */ .word 0xAFB40028 # sw $s4, 0x28($sp)
/* 0x001E0FE4 0x80250BE4 0x26540001 */ .word 0x26540001 # addiu $s4, $s2, 0x1
/* 0x001E0FE8 0x80250BE8 0xAFBF002C */ .word 0xAFBF002C # sw $ra, 0x2C($sp)
/* 0x001E0FEC 0x80250BEC 0xAFB30024 */ .word 0xAFB30024 # sw $s3, 0x24($sp)
/* 0x001E0FF0 0x80250BF0 0xAFB00018 */ .word 0xAFB00018 # sw $s0, 0x18($sp)
/* 0x001E0FF4 0x80250BF4 0xA7A00010 */ .word 0xA7A00010 # sh $zero, 0x10($sp)
/* 0x001E0FF8 0x80250BF8 0xA7A00012 */ .word 0xA7A00012 # sh $zero, 0x12($sp)
/* 0x001E0FFC 0x80250BFC 0x245300AC */ .word 0x245300AC # addiu $s3, $v0, 0xAC
