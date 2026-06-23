/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00270274..0x002702A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 11-word leaf: stores $a0 to 0x80220F68, jal 0x8020DF00, ends jr$ra@0x00270298 + delay@0x0027029C. */
func_00270274:
/* function boundary candidate: func_00270274, size=44, kind=prologue */
func_00270274:
/* 0x00270274 0x802DFE74 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00270278 0x802DFE78 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0027027C 0x802DFE7C 0xAC240F68 */ .word 0xAC240F68 # sw $a0, 0xF68($at)
/* 0x00270280 0x802DFE80 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00270284 0x802DFE84 0x2484B500 */ .word 0x2484B500 # addiu $a0, $a0, -0x4B00
/* 0x00270288 0x802DFE88 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0027028C 0x802DFE8C 0x0C0837C0 */ .word 0x0C0837C0 # jal 0x8020DF00
/* 0x00270290 0x802DFE90 0x00000000 */ .word 0x00000000 # nop
/* 0x00270294 0x802DFE94 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00270298 0x802DFE98 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0027029C 0x802DFE9C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
