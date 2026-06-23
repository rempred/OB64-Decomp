/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000F3154..0x000F315C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS-LEAF (special C). Two-instruction stub: jr $ra@0xF3154 + delay move $v0,$zero@0xF3158 (return 0). Entry fall-through only. */
/* 0x000F3154 0x80162D54 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000F3158 0x80162D58 0x00001021 */ .word 0x00001021 # move $v0, $zero
