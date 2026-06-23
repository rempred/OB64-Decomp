/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101C80..0x00101C94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Five RAM pointers in the 0x801B15xx band with a uniform +0x10 stride: 0x801B14F8, 0x801B1508, 0x801B1518, 0x801B1528, 0x801B1538. Fixed stride suggests a 16-byte-record pointer array (hypothesis); high word 0x801B -> RAM-pointer table. [name-token: table_ram_ptrs_801B15]. */
/* 0x00101C80 0x80171880 0x801B14F8 */ .word 0x801B14F8 # lb $k1, 0x14F8($zero)
/* 0x00101C84 0x80171884 0x801B1508 */ .word 0x801B1508 # lb $k1, 0x1508($zero)
/* 0x00101C88 0x80171888 0x801B1518 */ .word 0x801B1518 # lb $k1, 0x1518($zero)
/* 0x00101C8C 0x8017188C 0x801B1528 */ .word 0x801B1528 # lb $k1, 0x1528($zero)
/* 0x00101C90 0x80171890 0x801B1538 */ .word 0x801B1538 # lb $k1, 0x1538($zero)
