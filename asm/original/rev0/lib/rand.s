/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002CBCC..0x0002CC00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002CBCC (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
rand:
/* function boundary candidate: func_0002CBCC, size=48, kind=leaf */
func_0002CBCC:
/* 0x0002CBCC 0x8009C7CC 0x3C03800C */ .word 0x3C03800C # lui $v1, 0x800C
/* 0x0002CBD0 0x8009C7D0 0x246347D0 */ .word 0x246347D0 # addiu $v1, $v1, 0x47D0
/* 0x0002CBD4 0x8009C7D4 0x8C6E0000 */ .word 0x8C6E0000 # lw $t6, 0x0($v1)
/* 0x0002CBD8 0x8009C7D8 0x24014E6D */ .word 0x24014E6D # addiu $at, $zero, 0x4E6D
/* 0x0002CBDC 0x8009C7DC 0x01C10019 */ .word 0x01C10019 # multu $t6, $at
/* 0x0002CBE0 0x8009C7E0 0x00007812 */ .word 0x00007812 # mflo $t7
/* 0x0002CBE4 0x8009C7E4 0x25F93039 */ .word 0x25F93039 # addiu $t9, $t7, 0x3039
/* 0x0002CBE8 0x8009C7E8 0xAC6F0000 */ .word 0xAC6F0000 # sw $t7, 0x0($v1)
/* 0x0002CBEC 0x8009C7EC 0x00191402 */ .word 0x00191402 # srl $v0, $t9, 16
/* 0x0002CBF0 0x8009C7F0 0xAC790000 */ .word 0xAC790000 # sw $t9, 0x0($v1)
/* 0x0002CBF4 0x8009C7F4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002CBF8 0x8009C7F8 0x30427FFF */ .word 0x30427FFF # andi $v0, $v0, 0x7FFF
/* 0x0002CBFC 0x8009C7FC 0x00000000 */ .word 0x00000000 # nop
