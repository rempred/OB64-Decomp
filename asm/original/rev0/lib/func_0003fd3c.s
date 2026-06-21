/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00031000_00041000.s
 * z64 range: 0x0003FD3C..0x0003FD74 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0003FD3C, size=56, kind=prologue */
func_0003FD3C:
/* 0x0003FD3C 0x800AF93C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0003FD40 0x800AF940 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x0003FD44 0x800AF944 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0003FD48 0x800AF948 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x0003FD4C 0x800AF94C 0xAC20B21C */ .word 0xAC20B21C # sw $zero, -0x4DE4($at)
/* 0x0003FD50 0x800AF950 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x0003FD54 0x800AF954 0xAC20B26C */ .word 0xAC20B26C # sw $zero, -0x4D94($at)
/* 0x0003FD58 0x800AF958 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x0003FD5C 0x800AF95C 0xAC20B2BC */ .word 0xAC20B2BC # sw $zero, -0x4D44($at)
/* 0x0003FD60 0x800AF960 0x0C020642 */ .word 0x0C020642 # jal 0x80081908
/* 0x0003FD64 0x800AF964 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0003FD68 0x800AF968 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0003FD6C 0x800AF96C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0003FD70 0x800AF970 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
