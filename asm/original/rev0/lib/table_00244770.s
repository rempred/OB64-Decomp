/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00244770..0x0024478C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 7 pointers 0x801EE2B8,0x801EE2EC,0x801EE30C,0x801EE354,0x801EE32C,0x801EE32C,0x801EE34C (0x801E overlay-RAM band; one duplicate). 28 bytes.. */
/* 0x00244770 0x802B4370 0x801EE2B8 */ .word 0x801EE2B8 # lb $s8, -0x1D48($zero)
/* 0x00244774 0x802B4374 0x801EE2EC */ .word 0x801EE2EC # lb $s8, -0x1D14($zero)
/* 0x00244778 0x802B4378 0x801EE30C */ .word 0x801EE30C # lb $s8, -0x1CF4($zero)
/* 0x0024477C 0x802B437C 0x801EE354 */ .word 0x801EE354 # lb $s8, -0x1CAC($zero)
/* 0x00244780 0x802B4380 0x801EE32C */ .word 0x801EE32C # lb $s8, -0x1CD4($zero)
/* 0x00244784 0x802B4384 0x801EE32C */ .word 0x801EE32C # lb $s8, -0x1CD4($zero)
/* 0x00244788 0x802B4388 0x801EE34C */ .word 0x801EE34C # lb $s8, -0x1CB4($zero)
