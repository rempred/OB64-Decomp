/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x0022986C..0x002298D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed/binary blob: words E7000000,E3000A01,D7000002,80008000,E3000C00,E3001201,00002000,E3001001,00008000,FC119623,FF2FFFFF,E200001C,00504240,DF000000 with interior zero gaps; same blob style as 0x002297E8 run, not typed.. */
/* 0x0022986C 0x8029946C 0x00000000 */ .word 0x00000000 # nop
/* 0x00229870 0x80299470 0xE7000000 */ .word 0xE7000000 # swc1 $f0, 0x0($t8)
/* 0x00229874 0x80299474 0x00000000 */ .word 0x00000000 # nop
/* 0x00229878 0x80299478 0xE7000000 */ .word 0xE7000000 # swc1 $f0, 0x0($t8)
/* 0x0022987C 0x8029947C 0x00000000 */ .word 0x00000000 # nop
/* 0x00229880 0x80299480 0xE3000A01 */ .word 0xE3000A01 # sc $zero, 0xA01($t8)
/* 0x00229884 0x80299484 0x00000000 */ .word 0x00000000 # nop
/* 0x00229888 0x80299488 0xE7000000 */ .word 0xE7000000 # swc1 $f0, 0x0($t8)
/* 0x0022988C 0x8029948C 0x00000000 */ .word 0x00000000 # nop
/* 0x00229890 0x80299490 0xD7000002 */ .word 0xD7000002 # ldc1 $f0, 0x2($t8)
/* 0x00229894 0x80299494 0x80008000 */ .word 0x80008000 # lb $zero, -0x8000($zero)
/* 0x00229898 0x80299498 0xE3000C00 */ .word 0xE3000C00 # sc $zero, 0xC00($t8)
/* 0x0022989C 0x8029949C 0x00000000 */ .word 0x00000000 # nop
/* 0x002298A0 0x802994A0 0xE3001201 */ .word 0xE3001201 # sc $zero, 0x1201($t8)
/* 0x002298A4 0x802994A4 0x00002000 */ .word 0x00002000 # sll $a0, $zero, 0
/* 0x002298A8 0x802994A8 0xE3001001 */ .word 0xE3001001 # sc $zero, 0x1001($t8)
/* 0x002298AC 0x802994AC 0x00008000 */ .word 0x00008000 # sll $s0, $zero, 0
/* 0x002298B0 0x802994B0 0xFC119623 */ .word 0xFC119623 # sd $s1, -0x69DD($zero)
/* 0x002298B4 0x802994B4 0xFF2FFFFF */ .word 0xFF2FFFFF # sd $t7, -0x1($t9)
/* 0x002298B8 0x802994B8 0xE200001C */ .word 0xE200001C # sc $zero, 0x1C($s0)
/* 0x002298BC 0x802994BC 0x00504240 */ .word 0x00504240 # sll $t0, $s0, 9
/* 0x002298C0 0x802994C0 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x002298C4 0x802994C4 0x00000000 */ .word 0x00000000 # nop
/* 0x002298C8 0x802994C8 0x00000000 */ .word 0x00000000 # nop
/* 0x002298CC 0x802994CC 0x00000000 */ .word 0x00000000 # nop
