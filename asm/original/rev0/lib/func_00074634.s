/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00074634..0x00074664 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf un-merged from parent file 10: lui $v1,0x8019 / lw / sll+addu table math, returns jr $ra at 0x7465C + delay 0x74660 (sltu). Ends at 0x74664 where next preamble begins. */
func_00074634:
/* 0x00074634 0x800E4234 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00074638 0x800E4238 0x8C63780C */ .word 0x8C63780C # lw $v1, 0x780C($v1)
/* 0x0007463C 0x800E423C 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00074640 0x800E4240 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00074644 0x800E4244 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00074648 0x800E4248 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0007464C 0x800E424C 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x00074650 0x800E4250 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00074654 0x800E4254 0x90620264 */ .word 0x90620264 # lbu $v0, 0x264($v1)
/* 0x00074658 0x800E4258 0x384200FF */ .word 0x384200FF # xori $v0, $v0, 0x00FF
/* 0x0007465C 0x800E425C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00074660 0x800E4260 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
