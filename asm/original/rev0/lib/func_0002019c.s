/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0002019C..0x000201C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002019C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0002019c:
/* 0x0002019C 0x8008FD9C 0x3C04800B */ .word 0x3C04800B # lui $a0, 0x800B
/* 0x000201A0 0x8008FDA0 0x8C84A710 */ .word 0x8C84A710 # lw $a0, -0x58F0($a0)
/* 0x000201A4 0x8008FDA4 0x8C82002C */ .word 0x8C82002C # lw $v0, 0x2C($a0)
/* 0x000201A8 0x8008FDA8 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x8008FDC0
/* 0x000201AC 0x8008FDAC 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x000201B0 0x8008FDB0 0x00401821 */ .word 0x00401821 # move $v1, $v0
/* 0x000201B4 0x8008FDB4 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x000201B8 0x8008FDB8 0xAC82002C */ .word 0xAC82002C # sw $v0, 0x2C($a0)
/* 0x000201BC 0x8008FDBC 0xAC600000 */ .word 0xAC600000 # sw $zero, 0x0($v1)
/* 0x000201C0 0x8008FDC0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000201C4 0x8008FDC4 0x00601021 */ .word 0x00601021 # move $v0, $v1
