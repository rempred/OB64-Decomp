/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101390..0x001013AC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer sub-table, 7 words of 0x801Bxxxx KSEG0 pointers: 0x801B41E8, 0x801B4200, 0x801B4218, 0x801B4230, 0x801B4260, 0x801B42A8, 0x801B42F8. Roughly +0x18..+0x50 stride. Overlay caveat applies; genuine data pointers. [name-token: table_00101390_ramptrs]. */
/* 0x00101390 0x80170F90 0x801B41E8 */ .word 0x801B41E8 # lb $k1, 0x41E8($zero)
/* 0x00101394 0x80170F94 0x801B4200 */ .word 0x801B4200 # lb $k1, 0x4200($zero)
/* 0x00101398 0x80170F98 0x801B4218 */ .word 0x801B4218 # lb $k1, 0x4218($zero)
/* 0x0010139C 0x80170F9C 0x801B4230 */ .word 0x801B4230 # lb $k1, 0x4230($zero)
/* 0x001013A0 0x80170FA0 0x801B4260 */ .word 0x801B4260 # lb $k1, 0x4260($zero)
/* 0x001013A4 0x80170FA4 0x801B42A8 */ .word 0x801B42A8 # lb $k1, 0x42A8($zero)
/* 0x001013A8 0x80170FA8 0x801B42F8 */ .word 0x801B42F8 # lb $k1, 0x42F8($zero)
