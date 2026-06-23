/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x002446E4..0x00244710 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): float32 constant pool: 0.5,1.0,45.0,15.0, then zero pad to 0x244710. IEEE single constants.. */
/* 0x002446E4 0x802B42E4 0x3F000000 */ .word 0x3F000000 # lui $zero, 0x0000
/* 0x002446E8 0x802B42E8 0x3F800000 */ .word 0x3F800000 # lui $zero, 0x0000
/* 0x002446EC 0x802B42EC 0x42340000 */ .word 0x42340000 # cop0_0x11
/* 0x002446F0 0x802B42F0 0x41700000 */ .word 0x41700000 # cop0_0x0B
/* 0x002446F4 0x802B42F4 0x00000000 */ .word 0x00000000 # nop
/* 0x002446F8 0x802B42F8 0x00000000 */ .word 0x00000000 # nop
/* 0x002446FC 0x802B42FC 0x00000000 */ .word 0x00000000 # nop
/* 0x00244700 0x802B4300 0x00000000 */ .word 0x00000000 # nop
/* 0x00244704 0x802B4304 0x00000000 */ .word 0x00000000 # nop
/* 0x00244708 0x802B4308 0x00000000 */ .word 0x00000000 # nop
/* 0x0024470C 0x802B430C 0x00000000 */ .word 0x00000000 # nop
