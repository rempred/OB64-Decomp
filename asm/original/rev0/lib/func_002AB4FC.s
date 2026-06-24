/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AB4FC..0x002AB508 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered tiny frameless setter (lui $at,0x8023; sb $a0,-0x5680($at)). Ends jr $ra 0x002AB500 + delay 0x002AB504. */
/* 0x002AB4FC 0x8031B0FC 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x002AB500 0x8031B100 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AB504 0x8031B104 0xA024A980 */ .word 0xA024A980 # sb $a0, -0x5680($at)
