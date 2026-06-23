/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BDCC..0x0020BDFC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Callback dispatcher (vtable slot 0x10), frame -0x18, jalr $v0. 2-word read-before-write preamble at 0x0020BDCC folded forward into prologue at 0x0020BDD4 (reads $v0 via lw $v0,0x10($v0)). Ends jr $ra @0x0020BDF4 + delay 0x0020BDF8. */
func_0020BDCC:
/* 0x0020BDCC 0x8027B9CC 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x0020BDD0 0x8027B9D0 0x8C420810 */ .word 0x8C420810 # lw $v0, 0x810($v0)

/* function boundary candidate: func_0020BDD4, size=40, kind=prologue */
func_0020BDD4:
/* 0x0020BDD4 0x8027B9D4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0020BDD8 0x8027B9D8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0020BDDC 0x8027B9DC 0x8C420010 */ .word 0x8C420010 # lw $v0, 0x10($v0)
/* 0x0020BDE0 0x8027B9E0 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x8027B9F0
/* 0x0020BDE4 0x8027B9E4 0x00042400 */ .word 0x00042400 # sll $a0, $a0, 16
/* 0x0020BDE8 0x8027B9E8 0x0040F809 */ .word 0x0040F809 # jalr $v0
/* 0x0020BDEC 0x8027B9EC 0x00042403 */ .word 0x00042403 # sra $a0, $a0, 16
/* 0x0020BDF0 0x8027B9F0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0020BDF4 0x8027B9F4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BDF8 0x8027B9F8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
