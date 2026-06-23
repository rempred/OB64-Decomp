/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142EA0..0x00142EC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 8 RAM pointers, all 0x801D20D4 (uniform; default/jump slot table). Word-stride pointer table. [name-token: table_ptr_801D20D4]. */
/* 0x00142EA0 0x801B2AA0 0x801D20D4 */ .word 0x801D20D4 # lb $sp, 0x20D4($zero)
/* 0x00142EA4 0x801B2AA4 0x801D2200 */ .word 0x801D2200 # lb $sp, 0x2200($zero)
/* 0x00142EA8 0x801B2AA8 0x801D2344 */ .word 0x801D2344 # lb $sp, 0x2344($zero)
/* 0x00142EAC 0x801B2AAC 0x801D2488 */ .word 0x801D2488 # lb $sp, 0x2488($zero)
/* 0x00142EB0 0x801B2AB0 0x801D2584 */ .word 0x801D2584 # lb $sp, 0x2584($zero)
/* 0x00142EB4 0x801B2AB4 0x801D2584 */ .word 0x801D2584 # lb $sp, 0x2584($zero)
/* 0x00142EB8 0x801B2AB8 0x801D20D4 */ .word 0x801D20D4 # lb $sp, 0x20D4($zero)
/* 0x00142EBC 0x801B2ABC 0x801D20D4 */ .word 0x801D20D4 # lb $sp, 0x20D4($zero)
