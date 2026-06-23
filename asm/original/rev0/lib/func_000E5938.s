/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000E5938..0x000E595C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sllv/srl/mult/mflo); jr $ra@0xE5954 + nop@0xE5958 */
/* 0x000E5938 0x80155538 0x94820004 */ .word 0x94820004 # lhu $v0, 0x4($a0)
/* 0x000E593C 0x8015553C 0x90830003 */ .word 0x90830003 # lbu $v1, 0x3($a0)
/* 0x000E5940 0x80155540 0x94840006 */ .word 0x94840006 # lhu $a0, 0x6($a0)
/* 0x000E5944 0x80155544 0x00621004 */ .word 0x00621004 # sllv $v0, $v0, $v1
/* 0x000E5948 0x80155548 0x00021042 */ .word 0x00021042 # srl $v0, $v0, 1
/* 0x000E594C 0x8015554C 0x00440018 */ .word 0x00440018 # mult $v0, $a0
/* 0x000E5950 0x80155550 0x00001012 */ .word 0x00001012 # mflo $v0
/* 0x000E5954 0x80155554 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000E5958 0x80155558 0x00000000 */ .word 0x00000000 # nop
