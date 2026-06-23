/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213830..0x00213840 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Four int32 scalar constants: 0x000003E8=1000, 0x000003E8=1000, 0xFFFFFC18=-1000, 0xFFFFFC18=-1000.. */
/* 0x00213830 0x80283430 0x000003E8 */ .word 0x000003E8 # special_0x28
/* 0x00213834 0x80283434 0x000003E8 */ .word 0x000003E8 # special_0x28
/* 0x00213838 0x80283438 0xFFFFFC18 */ .word 0xFFFFFC18 # sd $ra, -0x3E8($ra)
/* 0x0021383C 0x8028343C 0xFFFFFC18 */ .word 0xFFFFFC18 # sd $ra, -0x3E8($ra)
