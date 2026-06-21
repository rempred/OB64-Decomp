/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002AF00..0x0002AF50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002AF00 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0002af00:
/* 0x0002AF00 0x8009AB00 0x40085000 */ .word 0x40085000 # mfc0 $t0, $10
/* 0x0002AF04 0x8009AB04 0x2409001E */ .word 0x2409001E # addiu $t1, $zero, 0x1E
/* 0x0002AF08 0x8009AB08 0x3C0A8000 */ .word 0x3C0A8000 # lui $t2, 0x8000
/* 0x0002AF0C 0x8009AB0C 0x408A5000 */ .word 0x408A5000 # mtc0 $t2, $10
/* 0x0002AF10 0x8009AB10 0x40801000 */ .word 0x40801000 # mtc0 $zero, $2
/* 0x0002AF14 0x8009AB14 0x40801800 */ .word 0x40801800 # mtc0 $zero, $3
/* 0x0002AF18 0x8009AB18 0x40890000 */ .word 0x40890000 # mtc0 $t1, $0
/* 0x0002AF1C 0x8009AB1C 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AF20 0x8009AB20 0x42000002 */ .word 0x42000002 # cop0_0x10
/* 0x0002AF24 0x8009AB24 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AF28 0x8009AB28 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AF2C 0x8009AB2C 0x2129FFFF */ .word 0x2129FFFF # addi $t1, $t1, -0x1
/* 0x0002AF30 0x8009AB30 0x0521FFF9 */ .word 0x0521FFF9 # bgez $t1, 0x8009AB18
/* 0x0002AF34 0x8009AB34 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AF38 0x8009AB38 0x40885000 */ .word 0x40885000 # mtc0 $t0, $10
/* 0x0002AF3C 0x8009AB3C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002AF40 0x8009AB40 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AF44 0x8009AB44 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AF48 0x8009AB48 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AF4C 0x8009AB4C 0x00000000 */ .word 0x00000000 # nop
