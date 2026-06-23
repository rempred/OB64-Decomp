/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B650..0x0023B66C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf un-merged from the 0x0023B594 block: addiu$v0,-1; sh$v0,0xC($a0); addiu$v0,1; sh$a1,0xA($a0); sh$zero,8($a0); jr$ra@0x0023B664 + delay sh$v0,0xE($a0)@0x0023B668. Frameless struct-field setter. */
/* 0x0023B650 0x802AB250 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x0023B654 0x802AB254 0xA482000C */ .word 0xA482000C # sh $v0, 0xC($a0)
/* 0x0023B658 0x802AB258 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0023B65C 0x802AB25C 0xA485000A */ .word 0xA485000A # sh $a1, 0xA($a0)
/* 0x0023B660 0x802AB260 0xA4800008 */ .word 0xA4800008 # sh $zero, 0x8($a0)
/* 0x0023B664 0x802AB264 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B668 0x802AB268 0xA482000E */ .word 0xA482000E # sh $v0, 0xE($a0)
