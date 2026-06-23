/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x002299B0..0x002299C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 6 RAM pointers, 0x801D-band (0x801D61E4,0x801D6400 repeated,0x801D627C,0x801D632C).. */
/* 0x002299B0 0x802995B0 0x801D61E4 */ .word 0x801D61E4 # lb $sp, 0x61E4($zero)
/* 0x002299B4 0x802995B4 0x801D6400 */ .word 0x801D6400 # lb $sp, 0x6400($zero)
/* 0x002299B8 0x802995B8 0x801D627C */ .word 0x801D627C # lb $sp, 0x627C($zero)
/* 0x002299BC 0x802995BC 0x801D6400 */ .word 0x801D6400 # lb $sp, 0x6400($zero)
/* 0x002299C0 0x802995C0 0x801D632C */ .word 0x801D632C # lb $sp, 0x632C($zero)
/* 0x002299C4 0x802995C4 0x801D6400 */ .word 0x801D6400 # lb $sp, 0x6400($zero)
