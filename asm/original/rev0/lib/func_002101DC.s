/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x002101DC..0x00210200 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small wrapper; jal 0x801CCA5C then jr$ra@0x002101F8 + delay addiu$sp,0x18. */
/* function boundary candidate: func_002101DC, size=36, kind=prologue */
func_002101DC:
/* 0x002101DC 0x8027FDDC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002101E0 0x8027FDE0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002101E4 0x8027FDE4 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x002101E8 0x8027FDE8 0x00C02821 */ .word 0x00C02821 # move $a1, $a2
/* 0x002101EC 0x8027FDEC 0x0C073297 */ .word 0x0C073297 # jal 0x801CCA5C
/* 0x002101F0 0x8027FDF0 0x00403021 */ .word 0x00403021 # move $a2, $v0
/* 0x002101F4 0x8027FDF4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002101F8 0x8027FDF8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002101FC 0x8027FDFC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
