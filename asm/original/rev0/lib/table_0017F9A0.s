/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x0017F9A0..0x0017F9B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table: 6 contiguous 0x801xxxxx pointers (word stride 0x4): 0x80218A78, 0x80218B1C, 0x80218D0C, 0x80218D0C, 0x80218D60, 0x80218D60. All point into the 0x80218xxx RAM region (duplicate entries present). Honest table_ run; field names not asserted. (swarm-label: table_ram_ptr_801). */
/* 0x0017F9A0 0x801EF5A0 0x80218A78 */ .word 0x80218A78 # lb $at, -0x7588($at)
/* 0x0017F9A4 0x801EF5A4 0x80218B1C */ .word 0x80218B1C # lb $at, -0x74E4($at)
/* 0x0017F9A8 0x801EF5A8 0x80218D0C */ .word 0x80218D0C # lb $at, -0x72F4($at)
/* 0x0017F9AC 0x801EF5AC 0x80218D0C */ .word 0x80218D0C # lb $at, -0x72F4($at)
/* 0x0017F9B0 0x801EF5B0 0x80218D60 */ .word 0x80218D60 # lb $at, -0x72A0($at)
/* 0x0017F9B4 0x801EF5B4 0x80218D60 */ .word 0x80218D60 # lb $at, -0x72A0($at)
