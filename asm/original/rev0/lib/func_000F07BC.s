/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000F07BC..0x000F07FC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Slice/chunk-start head: prologue addiu $sp,-0x18 @0xF07BC; jr $ra @0xF07F4 + delay addiu $sp,0x18 @0xF07F8. Complete small function. */
/* function boundary candidate: func_000F07BC, size=64, kind=prologue */
func_000F07BC:
/* 0x000F07BC 0x801603BC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000F07C0 0x801603C0 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x000F07C4 0x801603C4 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x000F07C8 0x801603C8 0x12000008 */ .word 0x12000008 # beq $s0, $zero, 0x801603EC
/* 0x000F07CC 0x801603CC 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x000F07D0 0x801603D0 0x8E040000 */ .word 0x8E040000 # lw $a0, 0x0($s0)
/* 0x000F07D4 0x801603D4 0x0C068E97 */ .word 0x0C068E97 # jal 0x801A3A5C
/* 0x000F07D8 0x801603D8 0x00000000 */ .word 0x00000000 # nop
/* 0x000F07DC 0x801603DC 0x0C068E97 */ .word 0x0C068E97 # jal 0x801A3A5C
/* 0x000F07E0 0x801603E0 0x8E040004 */ .word 0x8E040004 # lw $a0, 0x4($s0)
/* 0x000F07E4 0x801603E4 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x000F07E8 0x801603E8 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x000F07EC 0x801603EC 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x000F07F0 0x801603F0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x000F07F4 0x801603F4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000F07F8 0x801603F8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
