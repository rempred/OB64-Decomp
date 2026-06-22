/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x0007D960..0x0007D994 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf. andi a0; lbu 0x6A81 table, srav bit read. jr $ra at 0x0007D98C + delay slot 0x0007D990 (andi $v0,1). */
func_0007d960:
/* 0x0007D960 0x800ED560 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0007D964 0x800ED564 0x2483FFFF */ .word 0x2483FFFF # addiu $v1, $a0, -0x1
/* 0x0007D968 0x800ED568 0x04610002 */ .word 0x04610002 # bgez $v1, 0x800ED574
/* 0x0007D96C 0x800ED56C 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x0007D970 0x800ED570 0x24820006 */ .word 0x24820006 # addiu $v0, $a0, 0x6
/* 0x0007D974 0x800ED574 0x000210C3 */ .word 0x000210C3 # sra $v0, $v0, 3
/* 0x0007D978 0x800ED578 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0007D97C 0x800ED57C 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x0007D980 0x800ED580 0x90226A81 */ .word 0x90226A81 # lbu $v0, 0x6A81($at)
/* 0x0007D984 0x800ED584 0x30630007 */ .word 0x30630007 # andi $v1, $v1, 0x0007
/* 0x0007D988 0x800ED588 0x00621007 */ .word 0x00621007 # srav $v0, $v0, $v1
/* 0x0007D98C 0x800ED58C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0007D990 0x800ED590 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
