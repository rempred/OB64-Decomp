/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000F8570..0x000F85B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Mostly zero-word fill (15 words) with a lone 0x3F800000=1.0 at 0xF8580. >=3-word zero runs at 0xF8570 (4w) and 0xF8584 (11w).. */
/* 0x000F8570 0x80168170 0x00000000 */ .word 0x00000000 # nop
/* 0x000F8574 0x80168174 0x00000000 */ .word 0x00000000 # nop
/* 0x000F8578 0x80168178 0x00000000 */ .word 0x00000000 # nop
/* 0x000F857C 0x8016817C 0x00000000 */ .word 0x00000000 # nop
/* 0x000F8580 0x80168180 0x3F800000 */ .word 0x3F800000 # lui $zero, 0x0000
/* 0x000F8584 0x80168184 0x00000000 */ .word 0x00000000 # nop
/* 0x000F8588 0x80168188 0x00000000 */ .word 0x00000000 # nop
/* 0x000F858C 0x8016818C 0x00000000 */ .word 0x00000000 # nop
/* 0x000F8590 0x80168190 0x00000000 */ .word 0x00000000 # nop
/* 0x000F8594 0x80168194 0x00000000 */ .word 0x00000000 # nop
/* 0x000F8598 0x80168198 0x00000000 */ .word 0x00000000 # nop
/* 0x000F859C 0x8016819C 0x00000000 */ .word 0x00000000 # nop
/* 0x000F85A0 0x801681A0 0x00000000 */ .word 0x00000000 # nop
/* 0x000F85A4 0x801681A4 0x00000000 */ .word 0x00000000 # nop
/* 0x000F85A8 0x801681A8 0x00000000 */ .word 0x00000000 # nop
/* 0x000F85AC 0x801681AC 0x00000000 */ .word 0x00000000 # nop
