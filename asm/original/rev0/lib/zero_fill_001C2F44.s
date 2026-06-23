/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C2F44..0x001C2F94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 80-byte zero-fill pad between pointer-table and mixed command records inside the first chunk-28 data island.. */
/* 0x001C2F44 0x80232B44 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F48 0x80232B48 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F4C 0x80232B4C 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F50 0x80232B50 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F54 0x80232B54 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F58 0x80232B58 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F5C 0x80232B5C 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F60 0x80232B60 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F64 0x80232B64 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F68 0x80232B68 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F6C 0x80232B6C 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F70 0x80232B70 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F74 0x80232B74 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F78 0x80232B78 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F7C 0x80232B7C 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F80 0x80232B80 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F84 0x80232B84 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F88 0x80232B88 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F8C 0x80232B8C 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2F90 0x80232B90 0x00000000 */ .word 0x00000000 # nop
