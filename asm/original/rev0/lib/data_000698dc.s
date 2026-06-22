/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00061000_00071000.s
 * z64 range: 0x000698DC..0x00069900 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): INLINE DATA: trailing filler after the pointer table (nops then FFFEFFFE FFFEFFFE then nops) up to the next function's preamble. Not code.. */
data_000698dc:
/* 0x000698DC 0x800D94DC 0x00000000 */ .word 0x00000000 # nop
/* 0x000698E0 0x800D94E0 0x00000000 */ .word 0x00000000 # nop
/* 0x000698E4 0x800D94E4 0x00000000 */ .word 0x00000000 # nop
/* 0x000698E8 0x800D94E8 0x00000000 */ .word 0x00000000 # nop
/* 0x000698EC 0x800D94EC 0xFFFEFFFE */ .word 0xFFFEFFFE # sd $s8, -0x2($ra)
/* 0x000698F0 0x800D94F0 0xFFFEFFFE */ .word 0xFFFEFFFE # sd $s8, -0x2($ra)
/* 0x000698F4 0x800D94F4 0x00000000 */ .word 0x00000000 # nop
/* 0x000698F8 0x800D94F8 0x00000000 */ .word 0x00000000 # nop
/* 0x000698FC 0x800D94FC 0x00000000 */ .word 0x00000000 # nop
