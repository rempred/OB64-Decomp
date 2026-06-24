/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B38A0..0x002B38D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf after prior delay slot. Internal j 0x8023EAC8 tail-jump in-function; jr$ra at 0x002B38C8 + delay nop 0x002B38CC. */
func_002B38A0:
/* 0x002B38A0 0x803234A0 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002B38A4 0x803234A4 0x8C42A970 */ .word 0x8C42A970 # lw $v0, -0x5690($v0)
/* 0x002B38A8 0x803234A8 0x8C42082C */ .word 0x8C42082C # lw $v0, 0x82C($v0)
/* 0x002B38AC 0x803234AC 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x803234BC
/* 0x002B38B0 0x803234B0 0x00021027 */ .word 0x00021027 # nor $v0, $zero, $v0
/* 0x002B38B4 0x803234B4 0x0808FAB2 */ .word 0x0808FAB2 # j 0x8023EAC8
/* 0x002B38B8 0x803234B8 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002B38BC 0x803234BC 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x002B38C0 0x803234C0 0x00021023 */ .word 0x00021023 # subu $v0, $zero, $v0
/* 0x002B38C4 0x803234C4 0x34420001 */ .word 0x34420001 # ori $v0, $v0, 0x0001
/* 0x002B38C8 0x803234C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B38CC 0x803234CC 0x00000000 */ .word 0x00000000 # nop
