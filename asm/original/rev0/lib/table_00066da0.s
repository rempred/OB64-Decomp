/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00061000_00071000.s
 * z64 range: 0x00066DA0..0x00066DB8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small pointer table, 6 words: RAM pointers 0x8018427C,0x801843A0,0x801844C4,0x80184638,0x80184774,0x801848A8 (stride ~0x124-0x134). Index->record pointer table.. */
/* 0x00066DA0 0x800D69A0 0x8018427C */ .word 0x8018427C # lb $t8, 0x427C($zero)
/* 0x00066DA4 0x800D69A4 0x801843A0 */ .word 0x801843A0 # lb $t8, 0x43A0($zero)
/* 0x00066DA8 0x800D69A8 0x801844C4 */ .word 0x801844C4 # lb $t8, 0x44C4($zero)
/* 0x00066DAC 0x800D69AC 0x80184638 */ .word 0x80184638 # lb $t8, 0x4638($zero)
/* 0x00066DB0 0x800D69B0 0x80184774 */ .word 0x80184774 # lb $t8, 0x4774($zero)
/* 0x00066DB4 0x800D69B4 0x801848A8 */ .word 0x801848A8 # lb $t8, 0x48A8($zero)
