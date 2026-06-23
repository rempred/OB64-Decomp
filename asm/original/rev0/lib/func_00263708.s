/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00263708..0x0026372C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* PREAMBLE-ORPHAN: words @0x263708-0x26370C (lui $a0,0x8022; lw $a0,0xE14) load $a0 passed live to jal 0x800712C4 in the addiu$sp,-0x18 body @0x263710 (never rewritten before the call); fold forward, own name func_00263708. */
func_00263708:
/* 0x00263708 0x802D3308 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x0026370C 0x802D330C 0x8C840E14 */ .word 0x8C840E14 # lw $a0, 0xE14($a0)

/* function boundary candidate: func_00263710, size=28, kind=prologue */
func_00263710:
/* 0x00263710 0x802D3310 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00263714 0x802D3314 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00263718 0x802D3318 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0026371C 0x802D331C 0x00000000 */ .word 0x00000000 # nop
/* 0x00263720 0x802D3320 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00263724 0x802D3324 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00263728 0x802D3328 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
