/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00281820..0x00281830 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string pool: 0x59657300="Yes\0", 0x4E6F0000="No\0\0", followed by 8 bytes zero pad (0x281828-0x28182F).. */
/* 0x00281820 0x802F1420 0x59657300 */ .word 0x59657300 # blezl $t3, 0x8030E024
/* 0x00281824 0x802F1424 0x4E6F0000 */ .word 0x4E6F0000 # op_0x13
/* 0x00281828 0x802F1428 0x00000000 */ .word 0x00000000 # nop
/* 0x0028182C 0x802F142C 0x00000000 */ .word 0x00000000 # nop
