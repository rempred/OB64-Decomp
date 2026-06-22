/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00079090..0x000790CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 15-word RAM-pointer table, evenly spaced 0x801A2538,2540,2548,...,25A8 (stride 8). Pointers into relocated overlay data - parallel string-pointer array for the preceding name pool.. */
/* 0x00079090 0x800E8C90 0x801A2538 */ .word 0x801A2538 # lb $k0, 0x2538($zero)
/* 0x00079094 0x800E8C94 0x801A2540 */ .word 0x801A2540 # lb $k0, 0x2540($zero)
/* 0x00079098 0x800E8C98 0x801A2548 */ .word 0x801A2548 # lb $k0, 0x2548($zero)
/* 0x0007909C 0x800E8C9C 0x801A2550 */ .word 0x801A2550 # lb $k0, 0x2550($zero)
/* 0x000790A0 0x800E8CA0 0x801A2558 */ .word 0x801A2558 # lb $k0, 0x2558($zero)
/* 0x000790A4 0x800E8CA4 0x801A2560 */ .word 0x801A2560 # lb $k0, 0x2560($zero)
/* 0x000790A8 0x800E8CA8 0x801A2568 */ .word 0x801A2568 # lb $k0, 0x2568($zero)
/* 0x000790AC 0x800E8CAC 0x801A2570 */ .word 0x801A2570 # lb $k0, 0x2570($zero)
/* 0x000790B0 0x800E8CB0 0x801A2578 */ .word 0x801A2578 # lb $k0, 0x2578($zero)
/* 0x000790B4 0x800E8CB4 0x801A2580 */ .word 0x801A2580 # lb $k0, 0x2580($zero)
/* 0x000790B8 0x800E8CB8 0x801A2588 */ .word 0x801A2588 # lb $k0, 0x2588($zero)
/* 0x000790BC 0x800E8CBC 0x801A2590 */ .word 0x801A2590 # lb $k0, 0x2590($zero)
/* 0x000790C0 0x800E8CC0 0x801A2598 */ .word 0x801A2598 # lb $k0, 0x2598($zero)
/* 0x000790C4 0x800E8CC4 0x801A25A0 */ .word 0x801A25A0 # lb $k0, 0x25A0($zero)
/* 0x000790C8 0x800E8CC8 0x801A25A8 */ .word 0x801A25A8 # lb $k0, 0x25A8($zero)
