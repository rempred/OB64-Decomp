/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014628..0x0001464C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014628 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014628:
/* 0x00014628 0x80084228 0x90A30000 */ .word 0x90A30000 # lbu $v1, 0x0($a1)
/* 0x0001462C 0x8008422C 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x00014630 0x80084230 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00014634 0x80084234 0xA48000B4 */ .word 0xA48000B4 # sh $zero, 0xB4($a0)
/* 0x00014638 0x80084238 0x00031A00 */ .word 0x00031A00 # sll $v1, $v1, 8
/* 0x0001463C 0x8008423C 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x00014640 0x80084240 0xA48200B2 */ .word 0xA48200B2 # sh $v0, 0xB2($a0)
/* 0x00014644 0x80084244 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014648 0x80084248 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
