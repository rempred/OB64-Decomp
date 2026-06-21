/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00029B60..0x00029BA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00029B60 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
osSetGlobalIntMask:
/* function boundary candidate: func_00029B60, size=64, kind=prologue */
func_00029B60:
/* 0x00029B60 0x80099760 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00029B64 0x80099764 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00029B68 0x80099768 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00029B6C 0x8009976C 0x0C0265B4 */ .word 0x0C0265B4 # jal 0x800996D0
/* 0x00029B70 0x80099770 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x00029B74 0x80099774 0x3C03800B */ .word 0x3C03800B # lui $v1, 0x800B
/* 0x00029B78 0x80099778 0x8C63BAD0 */ .word 0x8C63BAD0 # lw $v1, -0x4530($v1)
/* 0x00029B7C 0x8009977C 0x00701825 */ .word 0x00701825 # or $v1, $v1, $s0
/* 0x00029B80 0x80099780 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00029B84 0x80099784 0xAC23BAD0 */ .word 0xAC23BAD0 # sw $v1, -0x4530($at)
/* 0x00029B88 0x80099788 0x0C0265D0 */ .word 0x0C0265D0 # jal 0x80099740
/* 0x00029B8C 0x8009978C 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x00029B90 0x80099790 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00029B94 0x80099794 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00029B98 0x80099798 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00029B9C 0x8009979C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
