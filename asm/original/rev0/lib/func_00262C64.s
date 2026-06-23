/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262C64..0x00262C80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless accessor (lw FE8; set +0x1A,+0x18, sh 0x1 at +0x8). jr$ra@0x262C78 + delay 0x262C7C. */
/* 0x00262C64 0x802D2864 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x00262C68 0x802D2868 0x8C420FE8 */ .word 0x8C420FE8 # lw $v0, 0xFE8($v0)
/* 0x00262C6C 0x802D286C 0x24030001 */ .word 0x24030001 # addiu $v1, $zero, 0x1
/* 0x00262C70 0x802D2870 0xA444001A */ .word 0xA444001A # sh $a0, 0x1A($v0)
/* 0x00262C74 0x802D2874 0xA4450018 */ .word 0xA4450018 # sh $a1, 0x18($v0)
/* 0x00262C78 0x802D2878 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262C7C 0x802D287C 0xA4430008 */ .word 0xA4430008 # sh $v1, 0x8($v0)
