/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BD8C..0x0020BDCC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Callback dispatcher (vtable slot 0xC), frame -0x18, jalr $v0; clears 801D.FC70 on null. 2-word read-before-write preamble at 0x0020BD8C folded forward into prologue at 0x0020BD94 (reads $v0 via lw $v0,0xC($v0)). Ends jr $ra @0x0020BDC4 + delay 0x0020BDC8. */
func_0020BD8C:
/* 0x0020BD8C 0x8027B98C 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x0020BD90 0x8027B990 0x8C420810 */ .word 0x8C420810 # lw $v0, 0x810($v0)

/* function boundary candidate: func_0020BD94, size=56, kind=prologue */
func_0020BD94:
/* 0x0020BD94 0x8027B994 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0020BD98 0x8027B998 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0020BD9C 0x8027B99C 0x8C42000C */ .word 0x8C42000C # lw $v0, 0xC($v0)
/* 0x0020BDA0 0x8027B9A0 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x8027B9B8
/* 0x0020BDA4 0x8027B9A4 0x00042400 */ .word 0x00042400 # sll $a0, $a0, 16
/* 0x0020BDA8 0x8027B9A8 0x0040F809 */ .word 0x0040F809 # jalr $v0
/* 0x0020BDAC 0x8027B9AC 0x00042403 */ .word 0x00042403 # sra $a0, $a0, 16
/* 0x0020BDB0 0x8027B9B0 0x0807224C */ .word 0x0807224C # j 0x801C8930
/* 0x0020BDB4 0x8027B9B4 0x00000000 */ .word 0x00000000 # nop
/* 0x0020BDB8 0x8027B9B8 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x0020BDBC 0x8027B9BC 0xA020FC70 */ .word 0xA020FC70 # sb $zero, -0x390($at)
/* 0x0020BDC0 0x8027B9C0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0020BDC4 0x8027B9C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BDC8 0x8027B9C8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
