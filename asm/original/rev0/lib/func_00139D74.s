/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x00139D74..0x00139DC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (no addiu $sp) recovered from parent over-merge into func_00139C90. Computes slt $v0 across two struct lookups. Ends jr $ra 0x139DB4 + delay slt 0x139DB8; trailing nop pad 0x139DBC aligns to next prologue. */
/* 0x00139D74 0x801A9974 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00139D78 0x801A9978 0x94426A2C */ .word 0x94426A2C # lhu $v0, 0x6A2C($v0)
/* 0x00139D7C 0x801A997C 0x3C05801F */ .word 0x3C05801F # lui $a1, 0x801F
/* 0x00139D80 0x801A9980 0x90A50E0C */ .word 0x90A50E0C # lbu $a1, 0xE0C($a1)
/* 0x00139D84 0x801A9984 0x00021900 */ .word 0x00021900 # sll $v1, $v0, 4
/* 0x00139D88 0x801A9988 0x00621823 */ .word 0x00621823 # subu $v1, $v1, $v0
/* 0x00139D8C 0x801A998C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00139D90 0x801A9990 0x90426A2E */ .word 0x90426A2E # lbu $v0, 0x6A2E($v0)
/* 0x00139D94 0x801A9994 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x00139D98 0x801A9998 0x90840E0D */ .word 0x90840E0D # lbu $a0, 0xE0D($a0)
/* 0x00139D9C 0x801A999C 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x00139DA0 0x801A99A0 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00139DA4 0x801A99A4 0x00051100 */ .word 0x00051100 # sll $v0, $a1, 4
/* 0x00139DA8 0x801A99A8 0x00451023 */ .word 0x00451023 # subu $v0, $v0, $a1
/* 0x00139DAC 0x801A99AC 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00139DB0 0x801A99B0 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00139DB4 0x801A99B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00139DB8 0x801A99B8 0x0062102A */ .word 0x0062102A # slt $v0, $v1, $v0
/* 0x00139DBC 0x801A99BC 0x00000000 */ .word 0x00000000 # nop
