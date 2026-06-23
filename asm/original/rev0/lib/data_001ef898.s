/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001EF898..0x001EF8F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Trailing tail of the record table: mostly 0x00000000 (nop/padding) words interleaved with a few stray 0x801B-band RAM pointers (0x801B9C60,0x801B9C54,0x801B9C48) plus small flag/scalar words (0x01000000,0x03000000,0x04000000). Tapers to all-zero padding from ~0x001EF8E0 to the region end. Continuation/terminator of the preceding pointer table.. */
/* 0x001EF898 0x8025F498 0x00000011 */ .word 0x00000011 # mthi $zero
/* 0x001EF89C 0x8025F49C 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8A0 0x8025F4A0 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8A4 0x8025F4A4 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8A8 0x8025F4A8 0x801B9C60 */ .word 0x801B9C60 # lb $k1, -0x63A0($zero)
/* 0x001EF8AC 0x8025F4AC 0x01000000 */ .word 0x01000000 # sll $zero, $zero, 0
/* 0x001EF8B0 0x8025F4B0 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8B4 0x8025F4B4 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8B8 0x8025F4B8 0x03000000 */ .word 0x03000000 # sll $zero, $zero, 0
/* 0x001EF8BC 0x8025F4BC 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8C0 0x8025F4C0 0x801B9C54 */ .word 0x801B9C54 # lb $k1, -0x63AC($zero)
/* 0x001EF8C4 0x8025F4C4 0x01000000 */ .word 0x01000000 # sll $zero, $zero, 0
/* 0x001EF8C8 0x8025F4C8 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8CC 0x8025F4CC 0x801B9C48 */ .word 0x801B9C48 # lb $k1, -0x63B8($zero)
/* 0x001EF8D0 0x8025F4D0 0x01000000 */ .word 0x01000000 # sll $zero, $zero, 0
/* 0x001EF8D4 0x8025F4D4 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8D8 0x8025F4D8 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8DC 0x8025F4DC 0x04000000 */ .word 0x04000000 # bltz $zero, 0x8025F4E0
/* 0x001EF8E0 0x8025F4E0 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8E4 0x8025F4E4 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8E8 0x8025F4E8 0x00000000 */ .word 0x00000000 # nop
/* 0x001EF8EC 0x8025F4EC 0x00000000 */ .word 0x00000000 # nop
