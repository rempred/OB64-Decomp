/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00165060..0x001650A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): High-byte preamble/marker block preceding the ASCII string pool. Contains store-opcode-shaped sentinel words and a 0x80xxxxxx pointer-shaped value, not decodable as a fixed record. Raw words: 0xE7000000, 0xE3001001, 0x00008000, 0xE200001C, 0x0F0A7008, 0xFC119623, 0xFF2FFFFF, 0xFA000000, 0xFFFFFFFF, 0xD7000002, 0x80008000, 0xDF000000, then three 0x00000000. Hypothesis (marked as such): a small packed header/flag struct or compression sentinel preceding the message table.. */
/* 0x00165060 0x801D4C60 0xE7000000 */ .word 0xE7000000 # swc1 $f0, 0x0($t8)
/* 0x00165064 0x801D4C64 0x00000000 */ .word 0x00000000 # nop
/* 0x00165068 0x801D4C68 0xE3001001 */ .word 0xE3001001 # sc $zero, 0x1001($t8)
/* 0x0016506C 0x801D4C6C 0x00008000 */ .word 0x00008000 # sll $s0, $zero, 0
/* 0x00165070 0x801D4C70 0xE200001C */ .word 0xE200001C # sc $zero, 0x1C($s0)
/* 0x00165074 0x801D4C74 0x0F0A7008 */ .word 0x0F0A7008 # jal 0x8C29C020
/* 0x00165078 0x801D4C78 0xFC119623 */ .word 0xFC119623 # sd $s1, -0x69DD($zero)
/* 0x0016507C 0x801D4C7C 0xFF2FFFFF */ .word 0xFF2FFFFF # sd $t7, -0x1($t9)
/* 0x00165080 0x801D4C80 0xFA000000 */ .word 0xFA000000 # sdc2 $0, 0x0($s0)
/* 0x00165084 0x801D4C84 0xFFFFFFFF */ .word 0xFFFFFFFF # sd $ra, -0x1($ra)
/* 0x00165088 0x801D4C88 0xD7000002 */ .word 0xD7000002 # ldc1 $f0, 0x2($t8)
/* 0x0016508C 0x801D4C8C 0x80008000 */ .word 0x80008000 # lb $zero, -0x8000($zero)
/* 0x00165090 0x801D4C90 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00165094 0x801D4C94 0x00000000 */ .word 0x00000000 # nop
/* 0x00165098 0x801D4C98 0x00000000 */ .word 0x00000000 # nop
/* 0x0016509C 0x801D4C9C 0x00000000 */ .word 0x00000000 # nop
