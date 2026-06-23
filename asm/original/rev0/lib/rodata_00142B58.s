/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142B58..0x00142B78 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string 'unitcommandnumber error!' + newline (0x756E6974='unit' .. 0x6F72210A='or!',LF). 2 trailing zero words. [name-token: rodata_str_unitcommand]. */
/* 0x00142B58 0x801B2758 0x756E6974 */ .word 0x756E6974 # op_0x1D
/* 0x00142B5C 0x801B275C 0x636F6D6D */ .word 0x636F6D6D # daddi $t7, $k1, 0x6D6D
/* 0x00142B60 0x801B2760 0x616E646E */ .word 0x616E646E # daddi $t6, $t3, 0x646E
/* 0x00142B64 0x801B2764 0x756D6265 */ .word 0x756D6265 # op_0x1D
/* 0x00142B68 0x801B2768 0x72657272 */ .word 0x72657272 # op_0x1C
/* 0x00142B6C 0x801B276C 0x6F72210A */ .word 0x6F72210A # ldr $s2, 0x210A($k1)
/* 0x00142B70 0x801B2770 0x00000000 */ .word 0x00000000 # nop
/* 0x00142B74 0x801B2774 0x00000000 */ .word 0x00000000 # nop
