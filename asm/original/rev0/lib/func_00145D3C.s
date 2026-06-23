/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145D3C..0x00145D9C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble lui $v0,0x8020 / lw $v0,-0x25E8($v0) at 0x00145D3C-0x00145D40 loads $v0 read by inner prologue (0x00145D44, addiu $s0,$v0,-1) before write. Iterates callback list with indirect call jalr $v0 at 0x00145D7C (internal). jr $ra at 0x00145D94 + delay 0x00145D98. */
func_00145D3C:
/* 0x00145D3C 0x801B593C 0x3C028020 */ .word 0x3C028020 # lui $v0, 0x8020

/* function boundary candidate: func_00145D40, size=92, kind=leaf */
func_00145D40:
/* 0x00145D40 0x801B5940 0x8C42DA18 */ .word 0x8C42DA18 # lw $v0, -0x25E8($v0)

/* function boundary candidate: func_00145D44, size=364, kind=prologue */
func_00145D44:
/* 0x00145D44 0x801B5944 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00145D48 0x801B5948 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00145D4C 0x801B594C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00145D50 0x801B5950 0x2450FFFF */ .word 0x2450FFFF # addiu $s0, $v0, -0x1
/* 0x00145D54 0x801B5954 0x0600000D */ .word 0x0600000D # bltz $s0, 0x801B598C
/* 0x00145D58 0x801B5958 0x00000000 */ .word 0x00000000 # nop
/* 0x00145D5C 0x801B595C 0x3C038020 */ .word 0x3C038020 # lui $v1, 0x8020
/* 0x00145D60 0x801B5960 0x8C63DA14 */ .word 0x8C63DA14 # lw $v1, -0x25EC($v1)
/* 0x00145D64 0x801B5964 0x00101080 */ .word 0x00101080 # sll $v0, $s0, 2
/* 0x00145D68 0x801B5968 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00145D6C 0x801B596C 0x8C440000 */ .word 0x8C440000 # lw $a0, 0x0($v0)
/* 0x00145D70 0x801B5970 0x10800004 */ .word 0x10800004 # beq $a0, $zero, 0x801B5984
/* 0x00145D74 0x801B5974 0x2610FFFF */ .word 0x2610FFFF # addiu $s0, $s0, -0x1
/* 0x00145D78 0x801B5978 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x00145D7C 0x801B597C 0x0040F809 */ .word 0x0040F809 # jalr $v0
/* 0x00145D80 0x801B5980 0x00000000 */ .word 0x00000000 # nop
/* 0x00145D84 0x801B5984 0x0601FFF5 */ .word 0x0601FFF5 # bgez $s0, 0x801B595C
/* 0x00145D88 0x801B5988 0x00000000 */ .word 0x00000000 # nop
/* 0x00145D8C 0x801B598C 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00145D90 0x801B5990 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00145D94 0x801B5994 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145D98 0x801B5998 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
