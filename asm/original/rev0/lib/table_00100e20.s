/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x00100E20..0x00100E64 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 17-word RAM-pointer table. Words 0..15 are ascending 0x801B36B0..0x801B3D74 pointers (likely into a relocated copy of the string pool / per-line structs), word 16 is 0x800E91D0 (same pointer also appears at region head 0x1003D0 and at 0x100E60). Consecutive 0x80xxxxxx run, classic pointer table.. */
/* 0x00100E20 0x80170A20 0x801B36B0 */ .word 0x801B36B0 # lb $k1, 0x36B0($zero)
/* 0x00100E24 0x80170A24 0x801B36CC */ .word 0x801B36CC # lb $k1, 0x36CC($zero)
/* 0x00100E28 0x80170A28 0x801B3780 */ .word 0x801B3780 # lb $k1, 0x3780($zero)
/* 0x00100E2C 0x80170A2C 0x801B37B8 */ .word 0x801B37B8 # lb $k1, 0x37B8($zero)
/* 0x00100E30 0x80170A30 0x801B3834 */ .word 0x801B3834 # lb $k1, 0x3834($zero)
/* 0x00100E34 0x80170A34 0x801B389C */ .word 0x801B389C # lb $k1, 0x389C($zero)
/* 0x00100E38 0x80170A38 0x801B390C */ .word 0x801B390C # lb $k1, 0x390C($zero)
/* 0x00100E3C 0x80170A3C 0x801B3984 */ .word 0x801B3984 # lb $k1, 0x3984($zero)
/* 0x00100E40 0x80170A40 0x801B39C0 */ .word 0x801B39C0 # lb $k1, 0x39C0($zero)
/* 0x00100E44 0x80170A44 0x801B3A70 */ .word 0x801B3A70 # lb $k1, 0x3A70($zero)
/* 0x00100E48 0x80170A48 0x801B3AE8 */ .word 0x801B3AE8 # lb $k1, 0x3AE8($zero)
/* 0x00100E4C 0x80170A4C 0x801B3B60 */ .word 0x801B3B60 # lb $k1, 0x3B60($zero)
/* 0x00100E50 0x80170A50 0x801B3BE8 */ .word 0x801B3BE8 # lb $k1, 0x3BE8($zero)
/* 0x00100E54 0x80170A54 0x801B3C7C */ .word 0x801B3C7C # lb $k1, 0x3C7C($zero)
/* 0x00100E58 0x80170A58 0x801B3D10 */ .word 0x801B3D10 # lb $k1, 0x3D10($zero)
/* 0x00100E5C 0x80170A5C 0x801B3D74 */ .word 0x801B3D74 # lb $k1, 0x3D74($zero)
/* 0x00100E60 0x80170A60 0x800E91D0 */ .word 0x800E91D0 # lb $t6, -0x6E30($zero)
