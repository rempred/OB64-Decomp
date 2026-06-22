/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x000783B0..0x000783F8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 18-word RAM-pointer table. All words are 0x801A1Axx/0x801A1Bxx (e.g. 801A1B5C,801A1B50...801A1AF0 repeated...801A1B94). RAM pointers (0x80xxxxxx) into the relocated overlay data segment; descending then ascending sub-list, likely a menu/string pointer array.. */
/* 0x000783B0 0x800E7FB0 0x801A1B5C */ .word 0x801A1B5C # lb $k0, 0x1B5C($zero)
/* 0x000783B4 0x800E7FB4 0x801A1B50 */ .word 0x801A1B50 # lb $k0, 0x1B50($zero)
/* 0x000783B8 0x800E7FB8 0x801A1B44 */ .word 0x801A1B44 # lb $k0, 0x1B44($zero)
/* 0x000783BC 0x800E7FBC 0x801A1B38 */ .word 0x801A1B38 # lb $k0, 0x1B38($zero)
/* 0x000783C0 0x800E7FC0 0x801A1B2C */ .word 0x801A1B2C # lb $k0, 0x1B2C($zero)
/* 0x000783C4 0x800E7FC4 0x801A1B20 */ .word 0x801A1B20 # lb $k0, 0x1B20($zero)
/* 0x000783C8 0x800E7FC8 0x801A1B14 */ .word 0x801A1B14 # lb $k0, 0x1B14($zero)
/* 0x000783CC 0x800E7FCC 0x801A1B08 */ .word 0x801A1B08 # lb $k0, 0x1B08($zero)
/* 0x000783D0 0x800E7FD0 0x801A1AFC */ .word 0x801A1AFC # lb $k0, 0x1AFC($zero)
/* 0x000783D4 0x800E7FD4 0x801A1AF0 */ .word 0x801A1AF0 # lb $k0, 0x1AF0($zero)
/* 0x000783D8 0x800E7FD8 0x801A1AF0 */ .word 0x801A1AF0 # lb $k0, 0x1AF0($zero)
/* 0x000783DC 0x800E7FDC 0x801A1AF0 */ .word 0x801A1AF0 # lb $k0, 0x1AF0($zero)
/* 0x000783E0 0x800E7FE0 0x801A1AF0 */ .word 0x801A1AF0 # lb $k0, 0x1AF0($zero)
/* 0x000783E4 0x800E7FE4 0x801A1B80 */ .word 0x801A1B80 # lb $k0, 0x1B80($zero)
/* 0x000783E8 0x800E7FE8 0x801A1B78 */ .word 0x801A1B78 # lb $k0, 0x1B78($zero)
/* 0x000783EC 0x800E7FEC 0x801A1B70 */ .word 0x801A1B70 # lb $k0, 0x1B70($zero)
/* 0x000783F0 0x800E7FF0 0x801A1B94 */ .word 0x801A1B94 # lb $k0, 0x1B94($zero)
/* 0x000783F4 0x800E7FF4 0x801A1B88 */ .word 0x801A1B88 # lb $k0, 0x1B88($zero)
