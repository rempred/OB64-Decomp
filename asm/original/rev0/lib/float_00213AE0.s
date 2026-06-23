/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213AE0..0x00213B10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE float64 constant pool tail. Big-endian doubles: 0x400921FB54442D18=pi, 0x4076800000000000=360.0, 0x3FF4CCCCCCCCCCCD=1.3, 0x4074000000000000=320.0, 0x4000000000000000=2.0, 0x3FF8000000000000=1.5.. */
/* 0x00213AE0 0x802836E0 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00213AE4 0x802836E4 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8028EB48
/* 0x00213AE8 0x802836E8 0x40768000 */ .word 0x40768000 # cop0_0x03
/* 0x00213AEC 0x802836EC 0x00000000 */ .word 0x00000000 # nop
/* 0x00213AF0 0x802836F0 0x3FF4CCCC */ .word 0x3FF4CCCC # lui $s4, 0xCCCC
/* 0x00213AF4 0x802836F4 0xCCCCCCCD */ .word 0xCCCCCCCD # op_0x33
/* 0x00213AF8 0x802836F8 0x40740000 */ .word 0x40740000 # cop0_0x03
/* 0x00213AFC 0x802836FC 0x00000000 */ .word 0x00000000 # nop
/* 0x00213B00 0x80283700 0x40000000 */ .word 0x40000000 # mfc0 $zero, $0
/* 0x00213B04 0x80283704 0x00000000 */ .word 0x00000000 # nop
/* 0x00213B08 0x80283708 0x3FF80000 */ .word 0x3FF80000 # lui $t8, 0x0000
/* 0x00213B0C 0x8028370C 0x00000000 */ .word 0x00000000 # nop
