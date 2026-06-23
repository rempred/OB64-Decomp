/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001B9E40..0x001B9E80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE-754 float CONSTANT pool, 16 consecutive .word constants forming a monotonic ramp ~0.08..0.6 loaded by lwc1 (DATA, NOT FP code): 0x3DA3D70A(0.08) 0x3DF5C28F(0.12) 0x3E23D70A(0.16) 0x3E4CCCCD(0.20) 0x3E75C28F(0.24) 0x3E8F5C29 0x3EA3D70A 0x3EB851EC 0x3ECCCCCD 0x3EE147AE 0x3EF5C28F 0x3F051EB8 0x3F0F5C29 0x3F147AE1 0x3F170A3D 0x3F19999A(0.60). These are constant operands, not div.s/mul.s/etc., so this is an embedded float-constant table, not FP instructions. func_001B924C already returned at 0x1B9918, so this is a trailing rodata pool, not a mid-function island between two code halves.. */
/* 0x001B9E40 0x80229A40 0x3DA3D70A */ .word 0x3DA3D70A # lui $v1, 0xD70A
/* 0x001B9E44 0x80229A44 0x3DF5C28F */ .word 0x3DF5C28F # lui $s5, 0xC28F
/* 0x001B9E48 0x80229A48 0x3E23D70A */ .word 0x3E23D70A # lui $v1, 0xD70A
/* 0x001B9E4C 0x80229A4C 0x3E4CCCCD */ .word 0x3E4CCCCD # lui $t4, 0xCCCD
/* 0x001B9E50 0x80229A50 0x3E75C28F */ .word 0x3E75C28F # lui $s5, 0xC28F
/* 0x001B9E54 0x80229A54 0x3E8F5C29 */ .word 0x3E8F5C29 # lui $t7, 0x5C29
/* 0x001B9E58 0x80229A58 0x3EA3D70A */ .word 0x3EA3D70A # lui $v1, 0xD70A
/* 0x001B9E5C 0x80229A5C 0x3EB851EC */ .word 0x3EB851EC # lui $t8, 0x51EC
/* 0x001B9E60 0x80229A60 0x3ECCCCCD */ .word 0x3ECCCCCD # lui $t4, 0xCCCD
/* 0x001B9E64 0x80229A64 0x3EE147AE */ .word 0x3EE147AE # lui $at, 0x47AE
/* 0x001B9E68 0x80229A68 0x3EF5C28F */ .word 0x3EF5C28F # lui $s5, 0xC28F
/* 0x001B9E6C 0x80229A6C 0x3F051EB8 */ .word 0x3F051EB8 # lui $a1, 0x1EB8
/* 0x001B9E70 0x80229A70 0x3F0F5C29 */ .word 0x3F0F5C29 # lui $t7, 0x5C29
/* 0x001B9E74 0x80229A74 0x3F147AE1 */ .word 0x3F147AE1 # lui $s4, 0x7AE1
/* 0x001B9E78 0x80229A78 0x3F170A3D */ .word 0x3F170A3D # lui $s7, 0x0A3D
/* 0x001B9E7C 0x80229A7C 0x3F19999A */ .word 0x3F19999A # lui $t9, 0x999A
