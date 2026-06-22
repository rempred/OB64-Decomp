/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00048A10..0x00048A68 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, argument-first andi $a0,$a0,0xFF index math; jr $ra at 0x00048A60 + delay slot sb 0x00048A64. Un-merged from parent idx57. */
func_00048a10:
/* 0x00048A10 0x800B8610 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00048A14 0x800B8614 0x2486FFFF */ .word 0x2486FFFF # addiu $a2, $a0, -0x1
/* 0x00048A18 0x800B8618 0x04C10002 */ .word 0x04C10002 # bgez $a2, 0x800B8624
/* 0x00048A1C 0x800B861C 0x00C01021 */ .word 0x00C01021 # move $v0, $a2
/* 0x00048A20 0x800B8620 0x24820002 */ .word 0x24820002 # addiu $v0, $a0, 0x2
/* 0x00048A24 0x800B8624 0x00023883 */ .word 0x00023883 # sra $a3, $v0, 2
/* 0x00048A28 0x800B8628 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00048A2C 0x800B862C 0x00671821 */ .word 0x00671821 # addu $v1, $v1, $a3
/* 0x00048A30 0x800B8630 0x90636A86 */ .word 0x90636A86 # lbu $v1, 0x6A86($v1)
/* 0x00048A34 0x800B8634 0x30C20003 */ .word 0x30C20003 # andi $v0, $a2, 0x0003
/* 0x00048A38 0x800B8638 0x00022040 */ .word 0x00022040 # sll $a0, $v0, 1
/* 0x00048A3C 0x800B863C 0x24020003 */ .word 0x24020003 # addiu $v0, $zero, 0x3
/* 0x00048A40 0x800B8640 0x00821004 */ .word 0x00821004 # sllv $v0, $v0, $a0
/* 0x00048A44 0x800B8644 0x00021027 */ .word 0x00021027 # nor $v0, $zero, $v0
/* 0x00048A48 0x800B8648 0x00621824 */ .word 0x00621824 # and $v1, $v1, $v0
/* 0x00048A4C 0x800B864C 0x30A200FF */ .word 0x30A200FF # andi $v0, $a1, 0x00FF
/* 0x00048A50 0x800B8650 0x00821004 */ .word 0x00821004 # sllv $v0, $v0, $a0
/* 0x00048A54 0x800B8654 0x00621025 */ .word 0x00621025 # or $v0, $v1, $v0
/* 0x00048A58 0x800B8658 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00048A5C 0x800B865C 0x00270821 */ .word 0x00270821 # addu $at, $at, $a3
/* 0x00048A60 0x800B8660 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00048A64 0x800B8664 0xA0226A86 */ .word 0xA0226A86 # sb $v0, 0x6A86($at)
