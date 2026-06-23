/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x002622B4..0x00262308 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (D64 setter with mult-by-magic divide). jr$ra@0x262300 + delay 0x262304. */
/* 0x002622B4 0x802D1EB4 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x002622B8 0x802D1EB8 0x94420D64 */ .word 0x94420D64 # lhu $v0, 0xD64($v0)
/* 0x002622BC 0x802D1EBC 0x3C038022 */ .word 0x3C038022 # lui $v1, 0x8022
/* 0x002622C0 0x802D1EC0 0x8C630D6C */ .word 0x8C630D6C # lw $v1, 0xD6C($v1)
/* 0x002622C4 0x802D1EC4 0xAC800004 */ .word 0xAC800004 # sw $zero, 0x4($a0)
/* 0x002622C8 0x802D1EC8 0xA4820000 */ .word 0xA4820000 # sh $v0, 0x0($a0)
/* 0x002622CC 0x802D1ECC 0x00832023 */ .word 0x00832023 # subu $a0, $a0, $v1
/* 0x002622D0 0x802D1ED0 0x00041980 */ .word 0x00041980 # sll $v1, $a0, 6
/* 0x002622D4 0x802D1ED4 0x00641823 */ .word 0x00641823 # subu $v1, $v1, $a0
/* 0x002622D8 0x802D1ED8 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x002622DC 0x802D1EDC 0x00641821 */ .word 0x00641821 # addu $v1, $v1, $a0
/* 0x002622E0 0x802D1EE0 0x000310C0 */ .word 0x000310C0 # sll $v0, $v1, 3
/* 0x002622E4 0x802D1EE4 0x00431023 */ .word 0x00431023 # subu $v0, $v0, $v1
/* 0x002622E8 0x802D1EE8 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x002622EC 0x802D1EEC 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x002622F0 0x802D1EF0 0x00021C80 */ .word 0x00021C80 # sll $v1, $v0, 18
/* 0x002622F4 0x802D1EF4 0x00431023 */ .word 0x00431023 # subu $v0, $v0, $v1
/* 0x002622F8 0x802D1EF8 0x00021083 */ .word 0x00021083 # sra $v0, $v0, 2
/* 0x002622FC 0x802D1EFC 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00262300 0x802D1F00 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262304 0x802D1F04 0xA4220D64 */ .word 0xA4220D64 # sh $v0, 0xD64($at)
