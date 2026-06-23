/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x0017F988..0x0017F9A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Short packed tail between the float pool and the pointer table: 0x7B43367D, 0x00000000, 0x7B433134, 0x7D000000, 0x7B43307D, 0x00000000. Repeating 0x7B43.. words; not clean floats or RAM pointers. Opaque packed data. (swarm-label: data_packed_tail_j). */
/* 0x0017F988 0x801EF588 0x7B43367D */ .word 0x7B43367D # op_0x1E
/* 0x0017F98C 0x801EF58C 0x00000000 */ .word 0x00000000 # nop
/* 0x0017F990 0x801EF590 0x7B433134 */ .word 0x7B433134 # op_0x1E
/* 0x0017F994 0x801EF594 0x7D000000 */ .word 0x7D000000 # op_0x1F
/* 0x0017F998 0x801EF598 0x7B43307D */ .word 0x7B43307D # op_0x1E
/* 0x0017F99C 0x801EF59C 0x00000000 */ .word 0x00000000 # nop
