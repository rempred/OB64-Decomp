/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002DA84..0x0002DAB8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002DA84 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
mul_u64:
/* 0x0002DA84 0x8009D684 0x00A60019 */ .word 0x00A60019 # multu $a1, $a2
/* 0x0002DA88 0x8009D688 0x00004012 */ .word 0x00004012 # mflo $t0
/* 0x0002DA8C 0x8009D68C 0x00000000 */ .word 0x00000000 # nop
/* 0x0002DA90 0x8009D690 0x00000000 */ .word 0x00000000 # nop
/* 0x0002DA94 0x8009D694 0x00870019 */ .word 0x00870019 # multu $a0, $a3
/* 0x0002DA98 0x8009D698 0x00001812 */ .word 0x00001812 # mflo $v1
/* 0x0002DA9C 0x8009D69C 0x01034021 */ .word 0x01034021 # addu $t0, $t0, $v1
/* 0x0002DAA0 0x8009D6A0 0x00000000 */ .word 0x00000000 # nop
/* 0x0002DAA4 0x8009D6A4 0x00860019 */ .word 0x00860019 # multu $a0, $a2
/* 0x0002DAA8 0x8009D6A8 0x00001812 */ .word 0x00001812 # mflo $v1
/* 0x0002DAAC 0x8009D6AC 0x00001010 */ .word 0x00001010 # mfhi $v0
/* 0x0002DAB0 0x8009D6B0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002DAB4 0x8009D6B4 0x00481021 */ .word 0x00481021 # addu $v0, $v0, $t0
