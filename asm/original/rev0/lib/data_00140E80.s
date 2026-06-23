/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x00140E80..0x00140EA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Short rising paired-byte mini-table 0x41D141D1,0x62D962D9,0x6B1D6B1D,0x74139D59,0x8413DEE6,0xB0C7B0C7,0xC1CFC1CF then a 0x00010001 separator @0x140E9C. Packed DATA header preceding the outgoing small-byte structure. [name-token: data_00140E80_rising_byte_minitable]. */
/* 0x00140E80 0x801B0A80 0x41D141D1 */ .word 0x41D141D1 # cop0_0x0E
/* 0x00140E84 0x801B0A84 0x62D962D9 */ .word 0x62D962D9 # daddi $t9, $s6, 0x62D9
/* 0x00140E88 0x801B0A88 0x6B1D6B1D */ .word 0x6B1D6B1D # ldl $sp, 0x6B1D($t8)
/* 0x00140E8C 0x801B0A8C 0x74139D59 */ .word 0x74139D59 # op_0x1D
/* 0x00140E90 0x801B0A90 0x8413DEE6 */ .word 0x8413DEE6 # lh $s3, -0x211A($zero)
/* 0x00140E94 0x801B0A94 0xB0C7B0C7 */ .word 0xB0C7B0C7 # sdl $a3, -0x4F39($a2)
/* 0x00140E98 0x801B0A98 0xC1CFC1CF */ .word 0xC1CFC1CF # ll $t7, -0x3E31($t6)
/* 0x00140E9C 0x801B0A9C 0x00010001 */ .word 0x00010001 # special_0x01
