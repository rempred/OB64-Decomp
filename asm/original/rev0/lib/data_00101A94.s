/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101A94..0x00101AA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Three non-pointer words interrupting the pointer table: 0x7B502530, 0x33642C25, 0x3033647D. High bytes 0x7B/0x33/0x30 are not the 0x801A/0x801B pointer band; classified as embedded packed data (hypothesis: small encoded record), not pointers. [name-token: data_embedded_nonptr]. */
/* 0x00101A94 0x80171694 0x7B502530 */ .word 0x7B502530 # op_0x1E
/* 0x00101A98 0x80171698 0x33642C25 */ .word 0x33642C25 # andi $a0, $k1, 0x2C25
/* 0x00101A9C 0x8017169C 0x3033647D */ .word 0x3033647D # andi $s3, $at, 0x647D
