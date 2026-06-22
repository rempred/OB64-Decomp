/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00078FC8..0x00078FF8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 12-word RAM-pointer table, evenly spaced 0x801A2488,2490,2498,...,24E0 (stride 8). Pointers into relocated overlay data - parallel string-pointer array (likely indexing the month strings / fixed records at +8).. */
/* 0x00078FC8 0x800E8BC8 0x801A2488 */ .word 0x801A2488 # lb $k0, 0x2488($zero)
/* 0x00078FCC 0x800E8BCC 0x801A2490 */ .word 0x801A2490 # lb $k0, 0x2490($zero)
/* 0x00078FD0 0x800E8BD0 0x801A2498 */ .word 0x801A2498 # lb $k0, 0x2498($zero)
/* 0x00078FD4 0x800E8BD4 0x801A24A0 */ .word 0x801A24A0 # lb $k0, 0x24A0($zero)
/* 0x00078FD8 0x800E8BD8 0x801A24A8 */ .word 0x801A24A8 # lb $k0, 0x24A8($zero)
/* 0x00078FDC 0x800E8BDC 0x801A24B0 */ .word 0x801A24B0 # lb $k0, 0x24B0($zero)
/* 0x00078FE0 0x800E8BE0 0x801A24B8 */ .word 0x801A24B8 # lb $k0, 0x24B8($zero)
/* 0x00078FE4 0x800E8BE4 0x801A24C0 */ .word 0x801A24C0 # lb $k0, 0x24C0($zero)
/* 0x00078FE8 0x800E8BE8 0x801A24C8 */ .word 0x801A24C8 # lb $k0, 0x24C8($zero)
/* 0x00078FEC 0x800E8BEC 0x801A24D0 */ .word 0x801A24D0 # lb $k0, 0x24D0($zero)
/* 0x00078FF0 0x800E8BF0 0x801A24D8 */ .word 0x801A24D8 # lb $k0, 0x24D8($zero)
/* 0x00078FF4 0x800E8BF4 0x801A24E0 */ .word 0x801A24E0 # lb $k0, 0x24E0($zero)
