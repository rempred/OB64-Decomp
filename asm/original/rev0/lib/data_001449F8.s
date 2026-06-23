/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001449F8..0x00144A04 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 3 words of packed small bytes beginning 0x00010302 and ending 0x08000000 (small byte index/LUT; hypothesis). 1 trailing zero word. [name-token: data_packed_bytes]. */
/* 0x001449F8 0x801B45F8 0x00010302 */ .word 0x00010302 # srl $zero, $at, 12
/* 0x001449FC 0x801B45FC 0x04060507 */ .word 0x04060507 # regimm_0x06 $zero, 0x801B5A1C
/* 0x00144A00 0x801B4600 0x08000000 */ .word 0x08000000 # j 0x80000000
