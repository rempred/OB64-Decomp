/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101BC8..0x00101BD0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two non-pointer words interrupting the table: 0x7B433132 and 0x7D000000. High bytes 0x7B/0x7D are outside the 0x801A/0x801B pointer band; classified as embedded packed data (the 0x7D000000 looks like a trailing-byte marker), not pointers. [name-token: data_embedded_nonptr2]. */
/* 0x00101BC8 0x801717C8 0x7B433132 */ .word 0x7B433132 # op_0x1E
/* 0x00101BCC 0x801717CC 0x7D000000 */ .word 0x7D000000 # op_0x1F
