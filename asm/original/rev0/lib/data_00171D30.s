/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00171D30..0x00171DA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed sub-table of 16-bit halfword pairs, small ascending magnitudes. Evidence: 0x00540078 0x005C0080 0x00540078 0x00EC0090, 0x00E40088 0x00EC0090, 0x00440022 0x004C002A, 0x0086006A 0x009C002C, 0x00A40034. High halves cluster 0x0044-0x00EC, low halves 0x0022-0x0090 -> coordinate/offset-pair or index data, not MIPS. Ends right before the 0x8021-band pointers at 0x171DA0. (swarm-label: data_00171D30_packed16). */
/* 0x00171D30 0x801E1930 0x00540078 */ .word 0x00540078 # dsll $zero, $s4, 1
/* 0x00171D34 0x801E1934 0x005C0080 */ .word 0x005C0080 # sll $zero, $gp, 2
/* 0x00171D38 0x801E1938 0x00540078 */ .word 0x00540078 # dsll $zero, $s4, 1
/* 0x00171D3C 0x801E193C 0x00EC0090 */ .word 0x00EC0090 # mfhi $zero
/* 0x00171D40 0x801E1940 0x00E40088 */ .word 0x00E40088 # jr $a3
/* 0x00171D44 0x801E1944 0x00EC0090 */ .word 0x00EC0090 # mfhi $zero
/* 0x00171D48 0x801E1948 0x00B20090 */ .word 0x00B20090 # mfhi $zero
/* 0x00171D4C 0x801E194C 0x00EC00B0 */ .word 0x00EC00B0 # tge $a3, $t4
/* 0x00171D50 0x801E1950 0x00440022 */ .word 0x00440022 # sub $zero, $v0, $a0
/* 0x00171D54 0x801E1954 0x004C002A */ .word 0x004C002A # slt $zero, $v0, $t4
/* 0x00171D58 0x801E1958 0x00440022 */ .word 0x00440022 # sub $zero, $v0, $a0
/* 0x00171D5C 0x801E195C 0x0086006A */ .word 0x0086006A # slt $zero, $a0, $a2
/* 0x00171D60 0x801E1960 0x009C002C */ .word 0x009C002C # dadd $zero, $a0, $gp
/* 0x00171D64 0x801E1964 0x00A40034 */ .word 0x00A40034 # teq $a1, $a0
/* 0x00171D68 0x801E1968 0x006E002C */ .word 0x006E002C # dadd $zero, $v1, $t6
/* 0x00171D6C 0x801E196C 0x00D20065 */ .word 0x00D20065 # or $zero, $a2, $s2
/* 0x00171D70 0x801E1970 0x00540076 */ .word 0x00540076 # tne $v0, $s4
/* 0x00171D74 0x801E1974 0x005C007E */ .word 0x005C007E # dsrl32 $zero, $gp, 1
/* 0x00171D78 0x801E1978 0x00540076 */ .word 0x00540076 # tne $v0, $s4
/* 0x00171D7C 0x801E197C 0x00EC008E */ .word 0x00EC008E # special_0x0E
/* 0x00171D80 0x801E1980 0x00E40086 */ .word 0x00E40086 # srlv $zero, $a0, $a3
/* 0x00171D84 0x801E1984 0x00EC008E */ .word 0x00EC008E # special_0x0E
/* 0x00171D88 0x801E1988 0x00B2008E */ .word 0x00B2008E # special_0x0E
/* 0x00171D8C 0x801E198C 0x00EC00AE */ .word 0x00EC00AE # dsub $zero, $a3, $t4
/* 0x00171D90 0x801E1990 0x009C004A */ .word 0x009C004A # special_0x0A
/* 0x00171D94 0x801E1994 0x00A40052 */ .word 0x00A40052 # mflo $zero
/* 0x00171D98 0x801E1998 0x006A004A */ .word 0x006A004A # special_0x0A
/* 0x00171D9C 0x801E199C 0x00D60065 */ .word 0x00D60065 # or $zero, $a2, $s6
