/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x0019BAE4..0x0019BB34 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (no stack frame). Divide-by-100 via 0x66666667 magic multiply, writes two decimal digit bytes. jr $ra@0x19BB2C + delay sb $zero,0x1($a1)@0x19BB30. */
/* 0x0019BAE4 0x8020B6E4 0x3C026666 */ .word 0x3C026666 # lui $v0, 0x6666
/* 0x0019BAE8 0x8020B6E8 0x34426667 */ .word 0x34426667 # ori $v0, $v0, 0x6667
/* 0x0019BAEC 0x8020B6EC 0x00820018 */ .word 0x00820018 # mult $a0, $v0
/* 0x0019BAF0 0x8020B6F0 0x000417C3 */ .word 0x000417C3 # sra $v0, $a0, 31
/* 0x0019BAF4 0x8020B6F4 0x00003810 */ .word 0x00003810 # mfhi $a3
/* 0x0019BAF8 0x8020B6F8 0x00071883 */ .word 0x00071883 # sra $v1, $a3, 2
/* 0x0019BAFC 0x8020B6FC 0x00621823 */ .word 0x00621823 # subu $v1, $v1, $v0
/* 0x0019BB00 0x8020B700 0x00603021 */ .word 0x00603021 # move $a2, $v1
/* 0x0019BB04 0x8020B704 0x00061080 */ .word 0x00061080 # sll $v0, $a2, 2
/* 0x0019BB08 0x8020B708 0x00461021 */ .word 0x00461021 # addu $v0, $v0, $a2
/* 0x0019BB0C 0x8020B70C 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x0019BB10 0x8020B710 0x10C00004 */ .word 0x10C00004 # beq $a2, $zero, 0x8020B724
/* 0x0019BB14 0x8020B714 0x00821823 */ .word 0x00821823 # subu $v1, $a0, $v0
/* 0x0019BB18 0x8020B718 0x24C20030 */ .word 0x24C20030 # addiu $v0, $a2, 0x30
/* 0x0019BB1C 0x8020B71C 0xA0A20000 */ .word 0xA0A20000 # sb $v0, 0x0($a1)
/* 0x0019BB20 0x8020B720 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x0019BB24 0x8020B724 0x24620030 */ .word 0x24620030 # addiu $v0, $v1, 0x30
/* 0x0019BB28 0x8020B728 0xA0A20000 */ .word 0xA0A20000 # sb $v0, 0x0($a1)
/* 0x0019BB2C 0x8020B72C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0019BB30 0x8020B730 0xA0A00001 */ .word 0xA0A00001 # sb $zero, 0x1($a1)
