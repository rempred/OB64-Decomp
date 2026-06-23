/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001EE574..0x001EE590 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 7 all-zero words (28 bytes) of leading padding before the graphics/display-list blob.. */
/* 0x001EE574 0x8025E174 0x00000000 */ .word 0x00000000 # nop
/* 0x001EE578 0x8025E178 0x00000000 */ .word 0x00000000 # nop
/* 0x001EE57C 0x8025E17C 0x00000000 */ .word 0x00000000 # nop
/* 0x001EE580 0x8025E180 0x00000000 */ .word 0x00000000 # nop
/* 0x001EE584 0x8025E184 0x00000000 */ .word 0x00000000 # nop
/* 0x001EE588 0x8025E188 0x00000000 */ .word 0x00000000 # nop
/* 0x001EE58C 0x8025E18C 0x00000000 */ .word 0x00000000 # nop
