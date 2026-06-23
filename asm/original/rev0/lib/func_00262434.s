/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262434..0x00262450 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (clear bit 0x200 at +0xA). jr$ra@0x26243C + delay 0x262440; 3 alignment nops 0x262444/448/44C attach to end. */
/* 0x00262434 0x802D2034 0x9482000A */ .word 0x9482000A # lhu $v0, 0xA($a0)
/* 0x00262438 0x802D2038 0x3042FDFF */ .word 0x3042FDFF # andi $v0, $v0, 0xFDFF
/* 0x0026243C 0x802D203C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262440 0x802D2040 0xA482000A */ .word 0xA482000A # sh $v0, 0xA($a0)
/* 0x00262444 0x802D2044 0x00000000 */ .word 0x00000000 # nop
/* 0x00262448 0x802D2048 0x00000000 */ .word 0x00000000 # nop
/* 0x0026244C 0x802D204C 0x00000000 */ .word 0x00000000 # nop
