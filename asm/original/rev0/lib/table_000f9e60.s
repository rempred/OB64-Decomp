/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000F9E60..0x000F9E94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table: 0x800E91D0 then 3 zero words, then 9 pointers in 0x8019F9D8..0x8019FA38 band (0xF9E70..0xF9E94). Tight 0x8019Fxxx cluster (likely small DL/data targets).. */
/* 0x000F9E60 0x80169A60 0x800E91D0 */ .word 0x800E91D0 # lb $t6, -0x6E30($zero)
/* 0x000F9E64 0x80169A64 0x00000000 */ .word 0x00000000 # nop
/* 0x000F9E68 0x80169A68 0x00000000 */ .word 0x00000000 # nop
/* 0x000F9E6C 0x80169A6C 0x00000000 */ .word 0x00000000 # nop
/* 0x000F9E70 0x80169A70 0x8019FA18 */ .word 0x8019FA18 # lb $t9, -0x5E8($zero)
/* 0x000F9E74 0x80169A74 0x8019FA38 */ .word 0x8019FA38 # lb $t9, -0x5C8($zero)
/* 0x000F9E78 0x80169A78 0x8019F9D8 */ .word 0x8019F9D8 # lb $t9, -0x628($zero)
/* 0x000F9E7C 0x80169A7C 0x8019FA38 */ .word 0x8019FA38 # lb $t9, -0x5C8($zero)
/* 0x000F9E80 0x80169A80 0x8019F9F0 */ .word 0x8019F9F0 # lb $t9, -0x610($zero)
/* 0x000F9E84 0x80169A84 0x8019F9F8 */ .word 0x8019F9F8 # lb $t9, -0x608($zero)
/* 0x000F9E88 0x80169A88 0x8019FA00 */ .word 0x8019FA00 # lb $t9, -0x600($zero)
/* 0x000F9E8C 0x80169A8C 0x8019FA08 */ .word 0x8019FA08 # lb $t9, -0x5F8($zero)
/* 0x000F9E90 0x80169A90 0x8019FA10 */ .word 0x8019FA10 # lb $t9, -0x5F0($zero)
