/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000205C0..0x000205F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000205C0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
os_writeback_dcache_all:
/* function boundary candidate: func_000205C0, size=40, kind=leaf */
func_000205C0:
/* 0x000205C0 0x800901C0 0x3C088000 */ .word 0x3C088000 # lui $t0, 0x8000
/* 0x000205C4 0x800901C4 0x240A2000 */ .word 0x240A2000 # addiu $t2, $zero, 0x2000
/* 0x000205C8 0x800901C8 0x010A4821 */ .word 0x010A4821 # addu $t1, $t0, $t2
/* 0x000205CC 0x800901CC 0x2529FFF0 */ .word 0x2529FFF0 # addiu $t1, $t1, -0x10
/* 0x000205D0 0x800901D0 0xBD010000 */ .word 0xBD010000 # cache 0x01, 0x0($t0)
/* 0x000205D4 0x800901D4 0x0109082B */ .word 0x0109082B # sltu $at, $t0, $t1
/* 0x000205D8 0x800901D8 0x1420FFFD */ .word 0x1420FFFD # bne $at, $zero, 0x800901D0
/* 0x000205DC 0x800901DC 0x25080010 */ .word 0x25080010 # addiu $t0, $t0, 0x10
/* 0x000205E0 0x800901E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000205E4 0x800901E4 0x00000000 */ .word 0x00000000 # nop
/* 0x000205E8 0x800901E8 0x00000000 */ .word 0x00000000 # nop
/* 0x000205EC 0x800901EC 0x00000000 */ .word 0x00000000 # nop
