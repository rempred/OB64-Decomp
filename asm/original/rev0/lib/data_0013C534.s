/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x0013C534..0x0013C550 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Short transition pad: 0x00000000, 0x0000000A, then 4 zero words (mostly zero but a stray 0x0A small-int -> not pure zero_fill). Precedes the large record/script table. [name-token: data_0013C534_pad]. */
/* 0x0013C534 0x801AC134 0x00000000 */ .word 0x00000000 # nop
/* 0x0013C538 0x801AC138 0x0000000A */ .word 0x0000000A # special_0x0A
/* 0x0013C53C 0x801AC13C 0x00000000 */ .word 0x00000000 # nop
/* 0x0013C540 0x801AC140 0x00000000 */ .word 0x00000000 # nop
/* 0x0013C544 0x801AC144 0x00000000 */ .word 0x00000000 # nop
/* 0x0013C548 0x801AC148 0x00000000 */ .word 0x00000000 # nop
/* 0x0013C54C 0x801AC14C 0x00000000 */ .word 0x00000000 # nop
