/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00029BA0..0x00029BF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00029BA0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
osResetGlobalIntMask:
/* function boundary candidate: func_00029BA0, size=72, kind=prologue */
func_00029BA0:
/* 0x00029BA0 0x800997A0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00029BA4 0x800997A4 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00029BA8 0x800997A8 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00029BAC 0x800997AC 0x0C0265B4 */ .word 0x0C0265B4 # jal 0x800996D0
/* 0x00029BB0 0x800997B0 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x00029BB4 0x800997B4 0x3C03800B */ .word 0x3C03800B # lui $v1, 0x800B
/* 0x00029BB8 0x800997B8 0x8C63BAD0 */ .word 0x8C63BAD0 # lw $v1, -0x4530($v1)
/* 0x00029BBC 0x800997BC 0x00108027 */ .word 0x00108027 # nor $s0, $zero, $s0
/* 0x00029BC0 0x800997C0 0x36100401 */ .word 0x36100401 # ori $s0, $s0, 0x0401
/* 0x00029BC4 0x800997C4 0x00701824 */ .word 0x00701824 # and $v1, $v1, $s0
/* 0x00029BC8 0x800997C8 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00029BCC 0x800997CC 0xAC23BAD0 */ .word 0xAC23BAD0 # sw $v1, -0x4530($at)
/* 0x00029BD0 0x800997D0 0x0C0265D0 */ .word 0x0C0265D0 # jal 0x80099740
/* 0x00029BD4 0x800997D4 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x00029BD8 0x800997D8 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00029BDC 0x800997DC 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00029BE0 0x800997E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00029BE4 0x800997E4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x00029BE8 0x800997E8 0x00000000 */ .word 0x00000000 # nop
/* 0x00029BEC 0x800997EC 0x00000000 */ .word 0x00000000 # nop
