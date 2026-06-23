/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002879F8..0x00287A4C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* PREAMBLE-ORPHAN folded forward: true entry is the 2-word preamble at 0x002879F8 (lui $a0,0x8024; lw $a0,-0x1A80($a0)) which sets $a0 read by the body's first jal 0x800712C4 before any write; body is the former func_00287A00 (prologue addiu $sp,-0x18 at 0x00287A00). Ends jr $ra at 0x00287A44 + delay 0x00287A48. */
func_002879F8:
/* 0x002879F8 0x802F75F8 0x3C048024 */ .word 0x3C048024 # lui $a0, 0x8024
/* 0x002879FC 0x802F75FC 0x8C84E580 */ .word 0x8C84E580 # lw $a0, -0x1A80($a0)

/* function boundary candidate: func_00287A00, size=164, kind=prologue */
func_00287A00:
/* 0x00287A00 0x802F7600 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00287A04 0x802F7604 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00287A08 0x802F7608 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00287A0C 0x802F760C 0x00000000 */ .word 0x00000000 # nop
/* 0x00287A10 0x802F7610 0x3C048024 */ .word 0x3C048024 # lui $a0, 0x8024
/* 0x00287A14 0x802F7614 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00287A18 0x802F7618 0x8C84E588 */ .word 0x8C84E588 # lw $a0, -0x1A78($a0)
/* 0x00287A1C 0x802F761C 0x3C048024 */ .word 0x3C048024 # lui $a0, 0x8024
/* 0x00287A20 0x802F7620 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00287A24 0x802F7624 0x8C84E584 */ .word 0x8C84E584 # lw $a0, -0x1A7C($a0)
/* 0x00287A28 0x802F7628 0x3C018024 */ .word 0x3C018024 # lui $at, 0x8024
/* 0x00287A2C 0x802F762C 0xAC20E580 */ .word 0xAC20E580 # sw $zero, -0x1A80($at)
/* 0x00287A30 0x802F7630 0x3C018024 */ .word 0x3C018024 # lui $at, 0x8024
/* 0x00287A34 0x802F7634 0xAC20E588 */ .word 0xAC20E588 # sw $zero, -0x1A78($at)
/* 0x00287A38 0x802F7638 0x3C018024 */ .word 0x3C018024 # lui $at, 0x8024
/* 0x00287A3C 0x802F763C 0xAC20E584 */ .word 0xAC20E584 # sw $zero, -0x1A7C($at)
/* 0x00287A40 0x802F7640 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00287A44 0x802F7644 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00287A48 0x802F7648 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
