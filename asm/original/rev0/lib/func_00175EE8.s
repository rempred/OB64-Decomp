/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00175EE8..0x00175F28 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameset leaf (frame 0x18). Prologue addiu $sp,-0x18 + sw $ra at 0x175EE8-EEC; jal 0x8017F36C (delay addiu $a0,0x100); bne $v0,$zero skips the 0x801F365D/0x801F0DE0 read-modify-store body; lw $ra, jr $ra@0x175F20 with delay-slot epilogue addiu $sp,0x18@0x175F24 ending at 0x175F28. END of code region 1. */
/* function boundary candidate: func_00175EE8, size=64, kind=prologue */
func_00175EE8:
/* 0x00175EE8 0x801E5AE8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00175EEC 0x801E5AEC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00175EF0 0x801E5AF0 0x0C05FCDB */ .word 0x0C05FCDB # jal 0x8017F36C
/* 0x00175EF4 0x801E5AF4 0x24040100 */ .word 0x24040100 # addiu $a0, $zero, 0x100
/* 0x00175EF8 0x801E5AF8 0x14400008 */ .word 0x14400008 # bne $v0, $zero, 0x801E5B1C
/* 0x00175EFC 0x801E5AFC 0x00000000 */ .word 0x00000000 # nop
/* 0x00175F00 0x801E5B00 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x00175F04 0x801E5B04 0x9042365D */ .word 0x9042365D # lbu $v0, 0x365D($v0)
/* 0x00175F08 0x801E5B08 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00175F0C 0x801E5B0C 0xAC200DE0 */ .word 0xAC200DE0 # sw $zero, 0xDE0($at)
/* 0x00175F10 0x801E5B10 0x304200FE */ .word 0x304200FE # andi $v0, $v0, 0x00FE
/* 0x00175F14 0x801E5B14 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00175F18 0x801E5B18 0xA022365D */ .word 0xA022365D # sb $v0, 0x365D($at)
/* 0x00175F1C 0x801E5B1C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00175F20 0x801E5B20 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00175F24 0x801E5B24 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
