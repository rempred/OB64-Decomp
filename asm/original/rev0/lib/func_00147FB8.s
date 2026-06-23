/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00147FB8..0x00147FF4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf reading $a1/$a0 args (sll $a1,2 / lw 0xCB0 table / OR 0x400 then OR 0x2 byte). Ends jr $ra 0x00147FEC + delay 0x00147FF0. Split out of the over-merged parent part. */
/* 0x00147FB8 0x801B7BB8 0x00052880 */ .word 0x00052880 # sll $a1, $a1, 2
/* 0x00147FBC 0x801B7BBC 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x00147FC0 0x801B7BC0 0x00852021 */ .word 0x00852021 # addu $a0, $a0, $a1
/* 0x00147FC4 0x801B7BC4 0x8C840CB0 */ .word 0x8C840CB0 # lw $a0, 0xCB0($a0)
/* 0x00147FC8 0x801B7BC8 0x3C068020 */ .word 0x3C068020 # lui $a2, 0x8020
/* 0x00147FCC 0x801B7BCC 0x8CC6DA3C */ .word 0x8CC6DA3C # lw $a2, -0x25C4($a2)
/* 0x00147FD0 0x801B7BD0 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x00147FD4 0x801B7BD4 0x3C030400 */ .word 0x3C030400 # lui $v1, 0x0400
/* 0x00147FD8 0x801B7BD8 0x00A62821 */ .word 0x00A62821 # addu $a1, $a1, $a2
/* 0x00147FDC 0x801B7BDC 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x00147FE0 0x801B7BE0 0xAC820000 */ .word 0xAC820000 # sw $v0, 0x0($a0)
/* 0x00147FE4 0x801B7BE4 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00147FE8 0x801B7BE8 0x34420002 */ .word 0x34420002 # ori $v0, $v0, 0x0002
/* 0x00147FEC 0x801B7BEC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00147FF0 0x801B7BF0 0xA0A20000 */ .word 0xA0A20000 # sb $v0, 0x0($a1)
