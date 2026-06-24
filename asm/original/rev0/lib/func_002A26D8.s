/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A26D8..0x002A2718 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* SEPARATE FRAMELESS LEAF: lui $v1 / lw $v1 + 0x002A26E0 addiu $a2,0x27 scan loop, no stack frame, own jr $ra at 0x002A2710 + nop delay 0x002A2714. j 0x80232EE0 internal. NOT a preamble for func_002A2718 (it self-returns). */
/* 0x002A26D8 0x803122D8 0x3C038024 */ .word 0x3C038024 # lui $v1, 0x8024
/* 0x002A26DC 0x803122DC 0x8C6395B0 */ .word 0x8C6395B0 # lw $v1, -0x6A50($v1)
/* 0x002A26E0 0x803122E0 0x24060027 */ .word 0x24060027 # addiu $a2, $zero, 0x27
/* 0x002A26E4 0x803122E4 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x002A26E8 0x803122E8 0x54440005 */ .word 0x54440005 # bnel $v0, $a0, 0x80312300
/* 0x002A26EC 0x803122EC 0x2463003C */ .word 0x2463003C # addiu $v1, $v1, 0x3C
/* 0x002A26F0 0x803122F0 0x8C620030 */ .word 0x8C620030 # lw $v0, 0x30($v1)
/* 0x002A26F4 0x803122F4 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x002A26F8 0x803122F8 0x0808CBB8 */ .word 0x0808CBB8 # j 0x80232EE0
/* 0x002A26FC 0x803122FC 0x90420000 */ .word 0x90420000 # lbu $v0, 0x0($v0)
/* 0x002A2700 0x80312300 0x00C01021 */ .word 0x00C01021 # move $v0, $a2
/* 0x002A2704 0x80312304 0x1440FFF7 */ .word 0x1440FFF7 # bne $v0, $zero, 0x803122E4
/* 0x002A2708 0x80312308 0x24C6FFFF */ .word 0x24C6FFFF # addiu $a2, $a2, -0x1
/* 0x002A270C 0x8031230C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002A2710 0x80312310 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A2714 0x80312314 0x00000000 */ .word 0x00000000 # nop
