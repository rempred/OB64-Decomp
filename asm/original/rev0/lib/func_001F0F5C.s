/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0F5C..0x001F0F6C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless byte-compare leaf: lbu $v1,0($a0); lbu $v0,0($a1); jr$ra@1F0F64 + delay subu $v0,$v1,$v0 @1F0F68. */
func_001F0F5C:
/* 0x001F0F5C 0x80260B5C 0x90830000 */ .word 0x90830000 # lbu $v1, 0x0($a0)
/* 0x001F0F60 0x80260B60 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x001F0F64 0x80260B64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F0F68 0x80260B68 0x00621023 */ .word 0x00621023 # subu $v0, $v1, $v0
