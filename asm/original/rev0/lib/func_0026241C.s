/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026241C..0x00262434 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (store a1/a2 to +0x14/+0x18, set bit 0x200). jr$ra@0x26242C + delay 0x262430. */
/* 0x0026241C 0x802D201C 0x9482000A */ .word 0x9482000A # lhu $v0, 0xA($a0)
/* 0x00262420 0x802D2020 0xAC850014 */ .word 0xAC850014 # sw $a1, 0x14($a0)
/* 0x00262424 0x802D2024 0xAC860018 */ .word 0xAC860018 # sw $a2, 0x18($a0)
/* 0x00262428 0x802D2028 0x34420200 */ .word 0x34420200 # ori $v0, $v0, 0x0200
/* 0x0026242C 0x802D202C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262430 0x802D2030 0xA482000A */ .word 0xA482000A # sh $v0, 0xA($a0)
