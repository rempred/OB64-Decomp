/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001B262C..0x001B2664 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Mixed island: '%s\x00\x00' format string (0x1B262C), then double constants 0x401921FB54442D18 = 6.283185307179586 (2*pi) and 0x4065E00000000000 = 175.0, one zero word, then an int16 delta/index pair table (0x1B2644-0x1B2664): [-19,6],[-38,12],[10,15],[-9,21],[-28,27],[20,30],[1,36],[-18,42].. */
/* 0x001B262C 0x8022222C 0x25730000 */ .word 0x25730000 # addiu $s3, $t3, 0x0
/* 0x001B2630 0x80222230 0x401921FB */ .word 0x401921FB # mfc0 $t9, $4
/* 0x001B2634 0x80222234 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8022D698
/* 0x001B2638 0x80222238 0x4065E000 */ .word 0x4065E000 # cop0_0x03
/* 0x001B263C 0x8022223C 0x00000000 */ .word 0x00000000 # nop
/* 0x001B2640 0x80222240 0x00000000 */ .word 0x00000000 # nop
/* 0x001B2644 0x80222244 0xFFED0006 */ .word 0xFFED0006 # sd $t5, 0x6($ra)
/* 0x001B2648 0x80222248 0xFFDA000C */ .word 0xFFDA000C # sd $k0, 0xC($s8)
/* 0x001B264C 0x8022224C 0x000A000F */ .word 0x000A000F # sync
/* 0x001B2650 0x80222250 0xFFF70015 */ .word 0xFFF70015 # sd $s7, 0x15($ra)
/* 0x001B2654 0x80222254 0xFFE4001B */ .word 0xFFE4001B # sd $a0, 0x1B($ra)
/* 0x001B2658 0x80222258 0x0014001E */ .word 0x0014001E # ddiv $zero, $s4
/* 0x001B265C 0x8022225C 0x00010024 */ .word 0x00010024 # and $zero, $zero, $at
/* 0x001B2660 0x80222260 0xFFEE002A */ .word 0xFFEE002A # sd $t6, 0x2A($ra)
