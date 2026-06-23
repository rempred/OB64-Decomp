/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00165E00..0x00165E30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE-754 double-precision const pool: 64-bit constants stored as word pairs. 0x40202AAAAAAAAAAB ~= 8.08333, 0x401E555555555555 ~= 7.58333, 0x401BAAAAAAAAAAAB ~= 6.91667 (each repeated). Raw words: 0x40202AAA/0xAAAAAAAB, 0x401E5555/0x55555555 (x2), 0x401BAAAA/0xAAAAAAAB (x2), then 0x00000000.. */
/* 0x00165E00 0x801D5A00 0x40202AAA */ .word 0x40202AAA # cop0_0x01
/* 0x00165E04 0x801D5A04 0xAAAAAAAB */ .word 0xAAAAAAAB # swl $t2, -0x5555($s5)
/* 0x00165E08 0x801D5A08 0x401E5555 */ .word 0x401E5555 # mfc0 $s8, $10
/* 0x00165E0C 0x801D5A0C 0x55555555 */ .word 0x55555555 # bnel $t2, $s5, 0x801EAF64
/* 0x00165E10 0x801D5A10 0x40202AAA */ .word 0x40202AAA # cop0_0x01
/* 0x00165E14 0x801D5A14 0xAAAAAAAB */ .word 0xAAAAAAAB # swl $t2, -0x5555($s5)
/* 0x00165E18 0x801D5A18 0x401E5555 */ .word 0x401E5555 # mfc0 $s8, $10
/* 0x00165E1C 0x801D5A1C 0x55555555 */ .word 0x55555555 # bnel $t2, $s5, 0x801EAF74
/* 0x00165E20 0x801D5A20 0x401BAAAA */ .word 0x401BAAAA # mfc0 $k1, $21
/* 0x00165E24 0x801D5A24 0xAAAAAAAB */ .word 0xAAAAAAAB # swl $t2, -0x5555($s5)
/* 0x00165E28 0x801D5A28 0x401BAAAA */ .word 0x401BAAAA # mfc0 $k1, $21
/* 0x00165E2C 0x801D5A2C 0xAAAAAAAB */ .word 0xAAAAAAAB # swl $t2, -0x5555($s5)
