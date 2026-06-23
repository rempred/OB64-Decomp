/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x00229A00..0x00229A2C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 11 RAM pointers, 0x801D-band (0x801D6794,0x801D680C,0x801D6A64,0x801D6AC0,0x801D6C14 repeated,0x801D6B34).. */
/* 0x00229A00 0x80299600 0x801D6794 */ .word 0x801D6794 # lb $sp, 0x6794($zero)
/* 0x00229A04 0x80299604 0x801D680C */ .word 0x801D680C # lb $sp, 0x680C($zero)
/* 0x00229A08 0x80299608 0x801D6A64 */ .word 0x801D6A64 # lb $sp, 0x6A64($zero)
/* 0x00229A0C 0x8029960C 0x801D6AC0 */ .word 0x801D6AC0 # lb $sp, 0x6AC0($zero)
/* 0x00229A10 0x80299610 0x801D6C14 */ .word 0x801D6C14 # lb $sp, 0x6C14($zero)
/* 0x00229A14 0x80299614 0x801D6C14 */ .word 0x801D6C14 # lb $sp, 0x6C14($zero)
/* 0x00229A18 0x80299618 0x801D6C14 */ .word 0x801D6C14 # lb $sp, 0x6C14($zero)
/* 0x00229A1C 0x8029961C 0x801D6C14 */ .word 0x801D6C14 # lb $sp, 0x6C14($zero)
/* 0x00229A20 0x80299620 0x801D6C14 */ .word 0x801D6C14 # lb $sp, 0x6C14($zero)
/* 0x00229A24 0x80299624 0x801D6C14 */ .word 0x801D6C14 # lb $sp, 0x6C14($zero)
/* 0x00229A28 0x80299628 0x801D6B34 */ .word 0x801D6B34 # lb $sp, 0x6B34($zero)
