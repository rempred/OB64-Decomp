/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020D490..0x0020D4C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (mult/mflo); jr ra @0x20D4C0 + delay nop @0x20D4C4. */
/* 0x0020D490 0x8027D090 0x3C025555 */ .word 0x3C025555 # lui $v0, 0x5555
/* 0x0020D494 0x8027D094 0x34425556 */ .word 0x34425556 # ori $v0, $v0, 0x5556
/* 0x0020D498 0x8027D098 0x00820018 */ .word 0x00820018 # mult $a0, $v0
/* 0x0020D49C 0x8027D09C 0x000417C3 */ .word 0x000417C3 # sra $v0, $a0, 31
/* 0x0020D4A0 0x8027D0A0 0x00003010 */ .word 0x00003010 # mfhi $a2
/* 0x0020D4A4 0x8027D0A4 0x00C21823 */ .word 0x00C21823 # subu $v1, $a2, $v0
/* 0x0020D4A8 0x8027D0A8 0x24020003 */ .word 0x24020003 # addiu $v0, $zero, 0x3
/* 0x0020D4AC 0x8027D0AC 0x10A20004 */ .word 0x10A20004 # beq $a1, $v0, 0x8027D0C0
/* 0x0020D4B0 0x8027D0B0 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x0020D4B4 0x8027D0B4 0x00000000 */ .word 0x00000000 # nop
/* 0x0020D4B8 0x8027D0B8 0x00650018 */ .word 0x00650018 # mult $v1, $a1
/* 0x0020D4BC 0x8027D0BC 0x00001012 */ .word 0x00001012 # mflo $v0
/* 0x0020D4C0 0x8027D0C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020D4C4 0x8027D0C4 0x00000000 */ .word 0x00000000 # nop
