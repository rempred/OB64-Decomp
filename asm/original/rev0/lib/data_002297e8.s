/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x002297E8..0x00229824 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed/binary blob, not RAM pointers: words E7000000,E3000C00,E3001201,00002000,E3001001,00008000,FC119623,FF2FFFFF,E200001C,00504240,DF000000 with small zero gaps; structure not fully typed (looks like a small record/param block).. */
/* 0x002297E8 0x802993E8 0xE7000000 */ .word 0xE7000000 # swc1 $f0, 0x0($t8)
/* 0x002297EC 0x802993EC 0x00000000 */ .word 0x00000000 # nop
/* 0x002297F0 0x802993F0 0xE3000C00 */ .word 0xE3000C00 # sc $zero, 0xC00($t8)
/* 0x002297F4 0x802993F4 0x00000000 */ .word 0x00000000 # nop
/* 0x002297F8 0x802993F8 0xE3001201 */ .word 0xE3001201 # sc $zero, 0x1201($t8)
/* 0x002297FC 0x802993FC 0x00002000 */ .word 0x00002000 # sll $a0, $zero, 0
/* 0x00229800 0x80299400 0xE3001001 */ .word 0xE3001001 # sc $zero, 0x1001($t8)
/* 0x00229804 0x80299404 0x00008000 */ .word 0x00008000 # sll $s0, $zero, 0
/* 0x00229808 0x80299408 0xFC119623 */ .word 0xFC119623 # sd $s1, -0x69DD($zero)
/* 0x0022980C 0x8029940C 0xFF2FFFFF */ .word 0xFF2FFFFF # sd $t7, -0x1($t9)
/* 0x00229810 0x80299410 0xE200001C */ .word 0xE200001C # sc $zero, 0x1C($s0)
/* 0x00229814 0x80299414 0x00504240 */ .word 0x00504240 # sll $t0, $s0, 9
/* 0x00229818 0x80299418 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x0022981C 0x8029941C 0x00000000 */ .word 0x00000000 # nop
/* 0x00229820 0x80299420 0x00000000 */ .word 0x00000000 # nop
