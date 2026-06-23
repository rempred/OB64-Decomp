/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x00239BA4..0x00239BD4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 12 IEEE-754 float32 constants, monotone increasing ramp 0.6,0.8,1.0,1.3,1.6,2.0,2.3,2.6,3.0,3.4,3.7,4.0 (0x3F19999A,0x3F4CCCCD,0x3F800000,0x3FA66666,0x3FCCCCCD,0x40000000,0x40133333,0x40266666,0x40400000,0x4059999A,0x406CCCCD,0x40800000). No doubles/ints interleaved.. */
/* 0x00239BA4 0x802A97A4 0x3F19999A */ .word 0x3F19999A # lui $t9, 0x999A
/* 0x00239BA8 0x802A97A8 0x3F4CCCCD */ .word 0x3F4CCCCD # lui $t4, 0xCCCD
/* 0x00239BAC 0x802A97AC 0x3F800000 */ .word 0x3F800000 # lui $zero, 0x0000
/* 0x00239BB0 0x802A97B0 0x3FA66666 */ .word 0x3FA66666 # lui $a2, 0x6666
/* 0x00239BB4 0x802A97B4 0x3FCCCCCD */ .word 0x3FCCCCCD # lui $t4, 0xCCCD
/* 0x00239BB8 0x802A97B8 0x40000000 */ .word 0x40000000 # mfc0 $zero, $0
/* 0x00239BBC 0x802A97BC 0x40133333 */ .word 0x40133333 # mfc0 $s3, $6
/* 0x00239BC0 0x802A97C0 0x40266666 */ .word 0x40266666 # cop0_0x01
/* 0x00239BC4 0x802A97C4 0x40400000 */ .word 0x40400000 # cop0_0x02
/* 0x00239BC8 0x802A97C8 0x4059999A */ .word 0x4059999A # cop0_0x02
/* 0x00239BCC 0x802A97CC 0x406CCCCD */ .word 0x406CCCCD # cop0_0x03
/* 0x00239BD0 0x802A97D0 0x40800000 */ .word 0x40800000 # mtc0 $zero, $0
