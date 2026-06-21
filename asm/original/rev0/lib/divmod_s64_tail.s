/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002DDF0..0x0002DE10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002DDF0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
divmod_s64_tail:
/* 0x0002DDF0 0x8009D9F0 0x14C00003 */ .word 0x14C00003 # bne $a2, $zero, 0x8009DA00
/* 0x0002DDF4 0x8009D9F4 0x00000000 */ .word 0x00000000 # nop
/* 0x0002DDF8 0x8009D9F8 0x080275ED */ .word 0x080275ED # j 0x8009D7B4
/* 0x0002DDFC 0x8009D9FC 0x00000000 */ .word 0x00000000 # nop
/* 0x0002DE00 0x8009DA00 0x080275AE */ .word 0x080275AE # j 0x8009D6B8
/* 0x0002DE04 0x8009DA04 0x00000000 */ .word 0x00000000 # nop
/* 0x0002DE08 0x8009DA08 0x00000000 */ .word 0x00000000 # nop
/* 0x0002DE0C 0x8009DA0C 0x00000000 */ .word 0x00000000 # nop
