/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x0007D994..0x0007D9CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf. andi a0; lbu 0x6A86 table, srav 2-bit field read. jr $ra at 0x0007D9C4 + delay slot 0x0007D9C8. Next word is fresh prologue addiu $sp,-0x30. */
func_0007d994:
/* 0x0007D994 0x800ED594 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0007D998 0x800ED598 0x2483FFFF */ .word 0x2483FFFF # addiu $v1, $a0, -0x1
/* 0x0007D99C 0x800ED59C 0x04610002 */ .word 0x04610002 # bgez $v1, 0x800ED5A8
/* 0x0007D9A0 0x800ED5A0 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x0007D9A4 0x800ED5A4 0x24820002 */ .word 0x24820002 # addiu $v0, $a0, 0x2
/* 0x0007D9A8 0x800ED5A8 0x00021083 */ .word 0x00021083 # sra $v0, $v0, 2
/* 0x0007D9AC 0x800ED5AC 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0007D9B0 0x800ED5B0 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x0007D9B4 0x800ED5B4 0x90226A86 */ .word 0x90226A86 # lbu $v0, 0x6A86($at)
/* 0x0007D9B8 0x800ED5B8 0x30630003 */ .word 0x30630003 # andi $v1, $v1, 0x0003
/* 0x0007D9BC 0x800ED5BC 0x00031840 */ .word 0x00031840 # sll $v1, $v1, 1
/* 0x0007D9C0 0x800ED5C0 0x00621007 */ .word 0x00621007 # srav $v0, $v0, $v1
/* 0x0007D9C4 0x800ED5C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0007D9C8 0x800ED5C8 0x30420003 */ .word 0x30420003 # andi $v0, $v0, 0x0003
