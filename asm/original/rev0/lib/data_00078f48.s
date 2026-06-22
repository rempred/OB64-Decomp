/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00078F48..0x00078F68 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two small packed byte tables (32 bytes): 00010102 02030303 03030303 02020101 and 63040506 08080605 04030201 63000000. Symmetric ramp / index arrays bounded by 0x63 sentinels (likely per-page/per-month day or width counts). Not pointers, not ASCII.. */
/* 0x00078F48 0x800E8B48 0x00000101 */ .word 0x00000101 # special_0x01
/* 0x00078F4C 0x800E8B4C 0x02020303 */ .word 0x02020303 # sra $zero, $v0, 12
/* 0x00078F50 0x800E8B50 0x03030303 */ .word 0x03030303 # sra $zero, $v1, 12
/* 0x00078F54 0x800E8B54 0x02020101 */ .word 0x02020101 # special_0x01
/* 0x00078F58 0x800E8B58 0x63040506 */ .word 0x63040506 # daddi $a0, $t8, 0x506
/* 0x00078F5C 0x800E8B5C 0x08080605 */ .word 0x08080605 # j 0x80201814
/* 0x00078F60 0x800E8B60 0x04030201 */ .word 0x04030201 # bgezl $zero, 0x800E9368
/* 0x00078F64 0x800E8B64 0x63000000 */ .word 0x63000000 # daddi $zero, $t8, 0x0
