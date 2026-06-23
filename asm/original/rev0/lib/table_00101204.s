/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101204..0x00101228 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table, 9 words of 0x801Axxxx/0x801Bxxxx KSEG0 pointers: 0x801B3258, 0x801B3288, 0x801B32B8, 0x801B32E8, 0x801AFB94, 0x801B333C, 0x801B3350, 0x801B3364, 0x801B3378. Mostly +0x30 stride between first four then irregular. Overlay caveat: RAM column is a wrong linear map but these are genuine 0x801xxxxx data pointers. [name-token: table_00101204_ramptrs]. */
/* 0x00101204 0x80170E04 0x801B3258 */ .word 0x801B3258 # lb $k1, 0x3258($zero)
/* 0x00101208 0x80170E08 0x801B3288 */ .word 0x801B3288 # lb $k1, 0x3288($zero)
/* 0x0010120C 0x80170E0C 0x801B32B8 */ .word 0x801B32B8 # lb $k1, 0x32B8($zero)
/* 0x00101210 0x80170E10 0x801B32E8 */ .word 0x801B32E8 # lb $k1, 0x32E8($zero)
/* 0x00101214 0x80170E14 0x801AFB94 */ .word 0x801AFB94 # lb $k0, -0x46C($zero)
/* 0x00101218 0x80170E18 0x801B333C */ .word 0x801B333C # lb $k1, 0x333C($zero)
/* 0x0010121C 0x80170E1C 0x801B3350 */ .word 0x801B3350 # lb $k1, 0x3350($zero)
/* 0x00101220 0x80170E20 0x801B3364 */ .word 0x801B3364 # lb $k1, 0x3364($zero)
/* 0x00101224 0x80170E24 0x801B3378 */ .word 0x801B3378 # lb $k1, 0x3378($zero)
