/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024BD8C..0x0024BDBC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent-missed frameless leaf: (idx-0x14)/3 then *3 remainder/modulo style. lui $v0,0x5555/ori 0x5556 magic; mult/mfhi; subu; sll<<1+add (x3); jr$ra@0x0024BDB4 + delay subu $v0,$a0,$v0@0x0024BDB8. */
/* 0x0024BD8C 0x802BB98C 0x3C025555 */ .word 0x3C025555 # lui $v0, 0x5555
/* 0x0024BD90 0x802BB990 0x34425556 */ .word 0x34425556 # ori $v0, $v0, 0x5556
/* 0x0024BD94 0x802BB994 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0024BD98 0x802BB998 0x2484FFEC */ .word 0x2484FFEC # addiu $a0, $a0, -0x14
/* 0x0024BD9C 0x802BB99C 0x00820018 */ .word 0x00820018 # mult $a0, $v0
/* 0x0024BDA0 0x802BB9A0 0x00041FC3 */ .word 0x00041FC3 # sra $v1, $a0, 31
/* 0x0024BDA4 0x802BB9A4 0x00002810 */ .word 0x00002810 # mfhi $a1
/* 0x0024BDA8 0x802BB9A8 0x00A31823 */ .word 0x00A31823 # subu $v1, $a1, $v1
/* 0x0024BDAC 0x802BB9AC 0x00031040 */ .word 0x00031040 # sll $v0, $v1, 1
/* 0x0024BDB0 0x802BB9B0 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0024BDB4 0x802BB9B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024BDB8 0x802BB9B8 0x00821023 */ .word 0x00821023 # subu $v0, $a0, $v0
