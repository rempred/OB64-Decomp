/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023F20C..0x0023F224 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf. Loads global at 0x801F-0x1B8, sets bit 0x10 in flag halfword 0x650. jr $ra at 0x0023F21C + delay (sh $v0,0x650) at 0x0023F220. */
/* 0x0023F20C 0x802AEE0C 0x3C03801F */ .word 0x3C03801F # lui $v1, 0x801F
/* 0x0023F210 0x802AEE10 0x8C63FE48 */ .word 0x8C63FE48 # lw $v1, -0x1B8($v1)
/* 0x0023F214 0x802AEE14 0x94620650 */ .word 0x94620650 # lhu $v0, 0x650($v1)
/* 0x0023F218 0x802AEE18 0x34420010 */ .word 0x34420010 # ori $v0, $v0, 0x0010
/* 0x0023F21C 0x802AEE1C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023F220 0x802AEE20 0xA4620650 */ .word 0xA4620650 # sh $v0, 0x650($v1)
