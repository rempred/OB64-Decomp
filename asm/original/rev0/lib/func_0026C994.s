/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026C994..0x0026C9CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Wrapper: jal 0x801C8FE8 fetch then jal 0x80093060 copy 0x50 bytes; ends jr$ra@0026C9C4 + addiu$sp delay@0026C9C8. */
/* function boundary candidate: func_0026C994, size=56, kind=prologue */
func_0026C994:
/* 0x0026C994 0x802DC594 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026C998 0x802DC598 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x0026C99C 0x802DC59C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x0026C9A0 0x802DC5A0 0x0C0723FA */ .word 0x0C0723FA # jal 0x801C8FE8
/* 0x0026C9A4 0x802DC5A4 0x00A08021 */ .word 0x00A08021 # move $s0, $a1
/* 0x0026C9A8 0x802DC5A8 0x8C440000 */ .word 0x8C440000 # lw $a0, 0x0($v0)
/* 0x0026C9AC 0x802DC5AC 0x02002821 */ .word 0x02002821 # move $a1, $s0
/* 0x0026C9B0 0x802DC5B0 0x24060050 */ .word 0x24060050 # addiu $a2, $zero, 0x50
/* 0x0026C9B4 0x802DC5B4 0x0C024C18 */ .word 0x0C024C18 # jal 0x80093060
/* 0x0026C9B8 0x802DC5B8 0x24840044 */ .word 0x24840044 # addiu $a0, $a0, 0x44
/* 0x0026C9BC 0x802DC5BC 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0026C9C0 0x802DC5C0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x0026C9C4 0x802DC5C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026C9C8 0x802DC5C8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
