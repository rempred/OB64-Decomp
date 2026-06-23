/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023F224..0x0023F238 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf. Loads global at 0x801F-0x1B8, returns flag 0x650 & 0x20 in $v0. jr $ra at 0x0023F230 + delay (andi $v0,$v0,0x20) at 0x0023F234. Ends at 0x0023F238, the start of the next function's preamble. */
/* 0x0023F224 0x802AEE24 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x0023F228 0x802AEE28 0x8C42FE48 */ .word 0x8C42FE48 # lw $v0, -0x1B8($v0)
/* 0x0023F22C 0x802AEE2C 0x94420650 */ .word 0x94420650 # lhu $v0, 0x650($v0)
/* 0x0023F230 0x802AEE30 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023F234 0x802AEE34 0x30420020 */ .word 0x30420020 # andi $v0, $v0, 0x0020
