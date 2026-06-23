/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x0013D900..0x0013D91C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Mixed markers: 0xFFFFFFFE, 0x00000000, 0x41F00000 (looks float-ish 30.0 but in a packed run), 0x4295828F, 0x0400FF5D, 0xFF5F7301, 0xFF1D0001. Treated as packed DATA, not code/float-array. [name-token: data_0013D900_markers]. */
/* 0x0013D900 0x801AD500 0xFFFFFFFE */ .word 0xFFFFFFFE # sd $ra, -0x2($ra)
/* 0x0013D904 0x801AD504 0x00000000 */ .word 0x00000000 # nop
/* 0x0013D908 0x801AD508 0x41F00000 */ .word 0x41F00000 # cop0_0x0F
/* 0x0013D90C 0x801AD50C 0x4295828F */ .word 0x4295828F # cop0_0x14
/* 0x0013D910 0x801AD510 0x0400FF5D */ .word 0x0400FF5D # bltz $zero, 0x801AD288
/* 0x0013D914 0x801AD514 0xFF5F7301 */ .word 0xFF5F7301 # sd $ra, 0x7301($k0)
/* 0x0013D918 0x801AD518 0xFF1D0001 */ .word 0xFF1D0001 # sd $sp, 0x1($t8)
