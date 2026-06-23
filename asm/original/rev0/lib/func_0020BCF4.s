/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BCF4..0x0020BD2C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Callback dispatcher (vtable slot 0x0), frame -0x18, jalr $v0. TRUE entry is the 2-word read-before-write preamble at 0x0020BCF4 (lui $v0,0x801D; lw $v0,0x810($v0)); prologue at 0x0020BCFC reads $v0 (lw $v0,0x0($v0) @0x0020BD04) before writing, folded forward. Ends jr $ra @0x0020BD24 + delay 0x0020BD28. */
func_0020BCF4:
/* 0x0020BCF4 0x8027B8F4 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x0020BCF8 0x8027B8F8 0x8C420810 */ .word 0x8C420810 # lw $v0, 0x810($v0)

/* function boundary candidate: func_0020BCFC, size=48, kind=prologue */
func_0020BCFC:
/* 0x0020BCFC 0x8027B8FC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0020BD00 0x8027B900 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0020BD04 0x8027B904 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
/* 0x0020BD08 0x8027B908 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8027B918
/* 0x0020BD0C 0x8027B90C 0x00000000 */ .word 0x00000000 # nop
/* 0x0020BD10 0x8027B910 0x08072224 */ .word 0x08072224 # j 0x801C8890
/* 0x0020BD14 0x8027B914 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0020BD18 0x8027B918 0x0040F809 */ .word 0x0040F809 # jalr $v0
/* 0x0020BD1C 0x8027B91C 0x00000000 */ .word 0x00000000 # nop
/* 0x0020BD20 0x8027B920 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0020BD24 0x8027B924 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BD28 0x8027B928 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
