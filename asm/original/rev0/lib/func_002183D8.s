/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x002183D8..0x0021840C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf recovered from over-merge: sll $v0,$a0,16; sra; range checks (slti 5 / addiu -0x32 ; sltiu 5); jr $ra @218404, delay move $v0,$v1 @218408. Reads $a0 with no prologue. */
/* 0x002183D8 0x80287FD8 0x00041400 */ .word 0x00041400 # sll $v0, $a0, 16
/* 0x002183DC 0x80287FDC 0x00021403 */ .word 0x00021403 # sra $v0, $v0, 16
/* 0x002183E0 0x80287FE0 0x28420005 */ .word 0x28420005 # slti $v0, $v0, 0x5
/* 0x002183E4 0x80287FE4 0x14400006 */ .word 0x14400006 # bne $v0, $zero, 0x80288000
/* 0x002183E8 0x80287FE8 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x002183EC 0x80287FEC 0x2482FFCE */ .word 0x2482FFCE # addiu $v0, $a0, -0x32
/* 0x002183F0 0x80287FF0 0x3042FFFF */ .word 0x3042FFFF # andi $v0, $v0, 0xFFFF
/* 0x002183F4 0x80287FF4 0x2C420005 */ .word 0x2C420005 # sltiu $v0, $v0, 0x5
/* 0x002183F8 0x80287FF8 0x10400002 */ .word 0x10400002 # beq $v0, $zero, 0x80288004
/* 0x002183FC 0x80287FFC 0x00000000 */ .word 0x00000000 # nop
/* 0x00218400 0x80288000 0x24030001 */ .word 0x24030001 # addiu $v1, $zero, 0x1
/* 0x00218404 0x80288004 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00218408 0x80288008 0x00601021 */ .word 0x00601021 # move $v0, $v1
