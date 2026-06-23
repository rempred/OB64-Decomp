/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00243F20..0x00243F40 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 6 pointers 0x801E6FC4,0x801E6FCC,0x801E6FD4,0x801E6FDC,0x801E7004,0x801E7164 (0x801E overlay-RAM band), followed by 2 zero-word terminator/pad. 32 bytes.. */
/* 0x00243F20 0x802B3B20 0x801E6FC4 */ .word 0x801E6FC4 # lb $s8, 0x6FC4($zero)
/* 0x00243F24 0x802B3B24 0x801E6FCC */ .word 0x801E6FCC # lb $s8, 0x6FCC($zero)
/* 0x00243F28 0x802B3B28 0x801E6FD4 */ .word 0x801E6FD4 # lb $s8, 0x6FD4($zero)
/* 0x00243F2C 0x802B3B2C 0x801E6FDC */ .word 0x801E6FDC # lb $s8, 0x6FDC($zero)
/* 0x00243F30 0x802B3B30 0x801E7004 */ .word 0x801E7004 # lb $s8, 0x7004($zero)
/* 0x00243F34 0x802B3B34 0x801E7164 */ .word 0x801E7164 # lb $s8, 0x7164($zero)
/* 0x00243F38 0x802B3B38 0x00000000 */ .word 0x00000000 # nop
/* 0x00243F3C 0x802B3B3C 0x00000000 */ .word 0x00000000 # nop
