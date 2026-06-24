/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A21E0..0x002A2210 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu$sp,-0x18; allocates 0x960 buffer via 0x80070F30, stores to 0x802495B0, memset via 0x80093380. Returns jr$ra@0x002A2208 + delay addiu$sp,0x18@0x002A220C. */
func_002A21E0:
/* function boundary candidate: func_002A21E0, size=48, kind=prologue */
func_002A21E0:
/* 0x002A21E0 0x80311DE0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002A21E4 0x80311DE4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002A21E8 0x80311DE8 0x0C01C3CC */ .word 0x0C01C3CC # jal 0x80070F30
/* 0x002A21EC 0x80311DEC 0x24040960 */ .word 0x24040960 # addiu $a0, $zero, 0x960
/* 0x002A21F0 0x80311DF0 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x002A21F4 0x80311DF4 0x3C018024 */ .word 0x3C018024 # lui $at, 0x8024
/* 0x002A21F8 0x80311DF8 0xAC2295B0 */ .word 0xAC2295B0 # sw $v0, -0x6A50($at)
/* 0x002A21FC 0x80311DFC 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x002A2200 0x80311E00 0x24050960 */ .word 0x24050960 # addiu $a1, $zero, 0x960
/* 0x002A2204 0x80311E04 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002A2208 0x80311E08 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A220C 0x80311E0C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
