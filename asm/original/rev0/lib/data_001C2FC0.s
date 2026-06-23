/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C2FC0..0x001C3010 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Sparse zero/pointer pad and control values between table_001C2F94 and packed command records; raw-but-classified data.. */
/* 0x001C2FC0 0x80232BC0 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FC4 0x80232BC4 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FC8 0x80232BC8 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FCC 0x80232BCC 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FD0 0x80232BD0 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FD4 0x80232BD4 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FD8 0x80232BD8 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FDC 0x80232BDC 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FE0 0x80232BE0 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FE4 0x80232BE4 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FE8 0x80232BE8 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FEC 0x80232BEC 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FF0 0x80232BF0 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FF4 0x80232BF4 0x802214D0 */ .word 0x802214D0 # lb $v0, 0x14D0($at)
/* 0x001C2FF8 0x80232BF8 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2FFC 0x80232BFC 0x00000000 */ .word 0x00000000 # nop
/* 0x001C3000 0x80232C00 0x00000000 */ .word 0x00000000 # nop
/* 0x001C3004 0x80232C04 0x00000000 */ .word 0x00000000 # nop
/* 0x001C3008 0x80232C08 0x00000000 */ .word 0x00000000 # nop
/* 0x001C300C 0x80232C0C 0x00000000 */ .word 0x00000000 # nop
