/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00061000_00071000.s
 * z64 range: 0x00066D4C..0x00066DA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Record/data block of 0x01DExxxx words (21 entries, e.g. 0x01DE0090,0x01DE267E,0x01DE5EDC,...,0x01DE67C2) sharing high halfword 0x01DE = base+offset or relative-pointer records (offsets into an 0x01DExxxx structure). Contains a 16-byte interior zero gap at 0x66D8C..0x66D9C kept inline. Type not fully resolved; mixed.. */
/* 0x00066D4C 0x800D694C 0x01DE0090 */ .word 0x01DE0090 # mfhi $zero
/* 0x00066D50 0x800D6950 0x01DE267E */ .word 0x01DE267E # dsrl32 $a0, $s8, 25
/* 0x00066D54 0x800D6954 0x01DE5EDC */ .word 0x01DE5EDC # dmult $t6, $s8
/* 0x00066D58 0x800D6958 0x01DE31CA */ .word 0x01DE31CA # special_0x0A
/* 0x00066D5C 0x800D695C 0x01DE39DA */ .word 0x01DE39DA # div $t6, $s8
/* 0x00066D60 0x800D6960 0x01DE45D4 */ .word 0x01DE45D4 # dsllv $t0, $s8, $t6
/* 0x00066D64 0x800D6964 0x01DE7414 */ .word 0x01DE7414 # dsllv $t6, $s8, $t6
/* 0x00066D68 0x800D6968 0x01DE80EC */ .word 0x01DE80EC # dadd $s0, $t6, $s8
/* 0x00066D6C 0x800D696C 0x01DE7EB0 */ .word 0x01DE7EB0 # tge $t6, $s8
/* 0x00066D70 0x800D6970 0x01DE8054 */ .word 0x01DE8054 # dsllv $s0, $s8, $t6
/* 0x00066D74 0x800D6974 0x01DE845A */ .word 0x01DE845A # div $t6, $s8
/* 0x00066D78 0x800D6978 0x01DE88CA */ .word 0x01DE88CA # special_0x0A
/* 0x00066D7C 0x800D697C 0x01DE91B2 */ .word 0x01DE91B2 # tlt $t6, $s8
/* 0x00066D80 0x800D6980 0x01DE93E6 */ .word 0x01DE93E6 # xor $s2, $t6, $s8
/* 0x00066D84 0x800D6984 0x01DE98AA */ .word 0x01DE98AA # slt $s3, $t6, $s8
/* 0x00066D88 0x800D6988 0x01DE67C2 */ .word 0x01DE67C2 # srl $t4, $s8, 31
/* 0x00066D8C 0x800D698C 0x00000000 */ .word 0x00000000 # nop
/* 0x00066D90 0x800D6990 0x00000000 */ .word 0x00000000 # nop
/* 0x00066D94 0x800D6994 0x00000000 */ .word 0x00000000 # nop
/* 0x00066D98 0x800D6998 0x00000000 */ .word 0x00000000 # nop
/* 0x00066D9C 0x800D699C 0x01DE97DC */ .word 0x01DE97DC # dmult $t6, $s8
