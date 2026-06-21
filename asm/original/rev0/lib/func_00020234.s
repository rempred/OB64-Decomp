/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00020234..0x00020274 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00020234, size=308, kind=prologue */
func_00020234:
/* 0x00020234 0x8008FE34 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x00020238 0x8008FE38 0xAFB10014 */ .word 0xAFB10014 # sw $s1, 0x14($sp)
/* 0x0002023C 0x8008FE3C 0x00808821 */ .word 0x00808821 # move $s1, $a0
/* 0x00020240 0x8008FE40 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00020244 0x8008FE44 0x00A08021 */ .word 0x00A08021 # move $s0, $a1
/* 0x00020248 0x8008FE48 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x0002024C 0x8008FE4C 0x0C023E07 */ .word 0x0C023E07 # jal 0x8008F81C
/* 0x00020250 0x8008FE50 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00020254 0x8008FE54 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00020258 0x8008FE58 0x0C023DFF */ .word 0x0C023DFF # jal 0x8008F7FC
/* 0x0002025C 0x8008FE5C 0x26250014 */ .word 0x26250014 # addiu $a1, $s1, 0x14
/* 0x00020260 0x8008FE60 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x00020264 0x8008FE64 0x8FB10014 */ .word 0x8FB10014 # lw $s1, 0x14($sp)
/* 0x00020268 0x8008FE68 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x0002026C 0x8008FE6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00020270 0x8008FE70 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
