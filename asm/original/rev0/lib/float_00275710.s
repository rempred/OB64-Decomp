/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275710..0x00275750 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): float64 (double) constant pool: a pi-like constant 0x400921FB4D12D84A (high word matches pi; low word differs from standard pi 0x54442D18), 3.0 (0x4008000000000000, low word 0x27574C), and 180.0 (0x4066800000000000). Used for angle/scale math.. */
/* 0x00275710 0x802E5310 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00275714 0x802E5314 0x4D12D84A */ .word 0x4D12D84A # op_0x13
/* 0x00275718 0x802E5318 0x40668000 */ .word 0x40668000 # cop0_0x03
/* 0x0027571C 0x802E531C 0x00000000 */ .word 0x00000000 # nop
/* 0x00275720 0x802E5320 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00275724 0x802E5324 0x4D12D84A */ .word 0x4D12D84A # op_0x13
/* 0x00275728 0x802E5328 0x40668000 */ .word 0x40668000 # cop0_0x03
/* 0x0027572C 0x802E532C 0x00000000 */ .word 0x00000000 # nop
/* 0x00275730 0x802E5330 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00275734 0x802E5334 0x4D12D84A */ .word 0x4D12D84A # op_0x13
/* 0x00275738 0x802E5338 0x40668000 */ .word 0x40668000 # cop0_0x03
/* 0x0027573C 0x802E533C 0x00000000 */ .word 0x00000000 # nop
/* 0x00275740 0x802E5340 0x3FF00000 */ .word 0x3FF00000 # lui $s0, 0x0000
/* 0x00275744 0x802E5344 0x00000000 */ .word 0x00000000 # nop
/* 0x00275748 0x802E5348 0x40080000 */ .word 0x40080000 # mfc0 $t0, $0
/* 0x0027574C 0x802E534C 0x00000000 */ .word 0x00000000 # nop
