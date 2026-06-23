/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029A080..0x0029A0A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): float32 pool: 0x41F00000 (=30.0f) x3 at +0x00/+0x08/+0x10, each followed by a 0x00000000 word; trailing two zero words @0x29A098-0x29A09C.. */
/* 0x0029A080 0x80309C80 0x41F00000 */ .word 0x41F00000 # cop0_0x0F
/* 0x0029A084 0x80309C84 0x00000000 */ .word 0x00000000 # nop
/* 0x0029A088 0x80309C88 0x41F00000 */ .word 0x41F00000 # cop0_0x0F
/* 0x0029A08C 0x80309C8C 0x00000000 */ .word 0x00000000 # nop
/* 0x0029A090 0x80309C90 0x41F00000 */ .word 0x41F00000 # cop0_0x0F
/* 0x0029A094 0x80309C94 0x00000000 */ .word 0x00000000 # nop
/* 0x0029A098 0x80309C98 0x00000000 */ .word 0x00000000 # nop
/* 0x0029A09C 0x80309C9C 0x00000000 */ .word 0x00000000 # nop
