/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x0008717C..0x000871A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Pointer table: 10 RAM pointers 0x801A81C4..0x801A81E8 increasing by 4. Value type: RAM pointers (0x80xxxxxx).. */
/* 0x0008717C 0x800F6D7C 0x801A81C4 */ .word 0x801A81C4 # lb $k0, -0x7E3C($zero)
/* 0x00087180 0x800F6D80 0x801A81C8 */ .word 0x801A81C8 # lb $k0, -0x7E38($zero)
/* 0x00087184 0x800F6D84 0x801A81CC */ .word 0x801A81CC # lb $k0, -0x7E34($zero)
/* 0x00087188 0x800F6D88 0x801A81D0 */ .word 0x801A81D0 # lb $k0, -0x7E30($zero)
/* 0x0008718C 0x800F6D8C 0x801A81D4 */ .word 0x801A81D4 # lb $k0, -0x7E2C($zero)
/* 0x00087190 0x800F6D90 0x801A81D8 */ .word 0x801A81D8 # lb $k0, -0x7E28($zero)
/* 0x00087194 0x800F6D94 0x801A81DC */ .word 0x801A81DC # lb $k0, -0x7E24($zero)
/* 0x00087198 0x800F6D98 0x801A81E0 */ .word 0x801A81E0 # lb $k0, -0x7E20($zero)
/* 0x0008719C 0x800F6D9C 0x801A81E4 */ .word 0x801A81E4 # lb $k0, -0x7E1C($zero)
/* 0x000871A0 0x800F6DA0 0x801A81E8 */ .word 0x801A81E8 # lb $k0, -0x7E18($zero)
