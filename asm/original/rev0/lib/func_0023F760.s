/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023F760..0x0023F778 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf. Loads global at 0x801F-0x1B8, sets bit 0x4 in flag halfword 0x650. jr $ra at 0x0023F770 + delay (sh $v0,0x650) at 0x0023F774. Ends at 0x0023F778, the start of the next function's preamble. */
/* 0x0023F760 0x802AF360 0x3C03801F */ .word 0x3C03801F # lui $v1, 0x801F
/* 0x0023F764 0x802AF364 0x8C63FE48 */ .word 0x8C63FE48 # lw $v1, -0x1B8($v1)
/* 0x0023F768 0x802AF368 0x94620650 */ .word 0x94620650 # lhu $v0, 0x650($v1)
/* 0x0023F76C 0x802AF36C 0x34420004 */ .word 0x34420004 # ori $v0, $v0, 0x0004
/* 0x0023F770 0x802AF370 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023F774 0x802AF374 0xA4620650 */ .word 0xA4620650 # sh $v0, 0x650($v1)
