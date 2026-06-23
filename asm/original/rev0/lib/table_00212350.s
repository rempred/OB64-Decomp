/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00212350..0x002123A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Per-glyph width/flag byte table: small byte values (00,01,02,03,04 mixed with nul gaps), e.g. 0x212370=0x01030302, 0x21237C=0x04030302, 0x212380=0x03030303. Interleaved with short zero runs. 80 bytes (20 words).. */
/* 0x00212350 0x80281F50 0x00000101 */ .word 0x00000101 # special_0x01
/* 0x00212354 0x80281F54 0x00000100 */ .word 0x00000100 # sll $zero, $zero, 4
/* 0x00212358 0x80281F58 0x01010000 */ .word 0x01010000 # sll $zero, $at, 0
/* 0x0021235C 0x80281F5C 0x01010100 */ .word 0x01010100 # sll $zero, $at, 4
/* 0x00212360 0x80281F60 0x01010000 */ .word 0x01010000 # sll $zero, $at, 0
/* 0x00212364 0x80281F64 0x00000000 */ .word 0x00000000 # nop
/* 0x00212368 0x80281F68 0x00000000 */ .word 0x00000000 # nop
/* 0x0021236C 0x80281F6C 0x00000000 */ .word 0x00000000 # nop
/* 0x00212370 0x80281F70 0x01030302 */ .word 0x01030302 # srl $zero, $v1, 12
/* 0x00212374 0x80281F74 0x02020101 */ .word 0x02020101 # special_0x01
/* 0x00212378 0x80281F78 0x01010101 */ .word 0x01010101 # special_0x01
/* 0x0021237C 0x80281F7C 0x04030302 */ .word 0x04030302 # bgezl $zero, 0x80282B88
/* 0x00212380 0x80281F80 0x03030303 */ .word 0x03030303 # sra $zero, $v1, 12
/* 0x00212384 0x80281F84 0x03040000 */ .word 0x03040000 # sll $zero, $a0, 0
/* 0x00212388 0x80281F88 0x00000000 */ .word 0x00000000 # nop
/* 0x0021238C 0x80281F8C 0x00000000 */ .word 0x00000000 # nop
/* 0x00212390 0x80281F90 0x00000000 */ .word 0x00000000 # nop
/* 0x00212394 0x80281F94 0x00000000 */ .word 0x00000000 # nop
/* 0x00212398 0x80281F98 0x00000000 */ .word 0x00000000 # nop
/* 0x0021239C 0x80281F9C 0x00000000 */ .word 0x00000000 # nop
