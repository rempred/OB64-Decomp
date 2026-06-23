/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x0022A0C8..0x0022A0E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 5 RAM pointers, 0x801D-band (0x801DD044,0x801DD054,0x801DD04C,0x801DD05C,0x801DD064); trailing nop @0x0022A0DC folded.. */
/* 0x0022A0C8 0x80299CC8 0x801DD044 */ .word 0x801DD044 # lb $sp, -0x2FBC($zero)
/* 0x0022A0CC 0x80299CCC 0x801DD054 */ .word 0x801DD054 # lb $sp, -0x2FAC($zero)
/* 0x0022A0D0 0x80299CD0 0x801DD04C */ .word 0x801DD04C # lb $sp, -0x2FB4($zero)
/* 0x0022A0D4 0x80299CD4 0x801DD05C */ .word 0x801DD05C # lb $sp, -0x2FA4($zero)
/* 0x0022A0D8 0x80299CD8 0x801DD064 */ .word 0x801DD064 # lb $sp, -0x2F9C($zero)
/* 0x0022A0DC 0x80299CDC 0x00000000 */ .word 0x00000000 # nop
