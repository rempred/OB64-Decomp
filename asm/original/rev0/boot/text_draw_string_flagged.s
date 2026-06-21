/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010B98..0x00010BDC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010B98 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
text_draw_string_flagged:
/* function boundary candidate: func_00010B98, size=332, kind=prologue */
func_00010B98:
/* 0x00010B98 0x80080798 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00010B9C 0x8008079C 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00010BA0 0x800807A0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00010BA4 0x800807A4 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00010BA8 0x800807A8 0xA42517B8 */ .word 0xA42517B8 # sh $a1, 0x17B8($at)
/* 0x00010BAC 0x800807AC 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00010BB0 0x800807B0 0xA42517BA */ .word 0xA42517BA # sh $a1, 0x17BA($at)
/* 0x00010BB4 0x800807B4 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00010BB8 0x800807B8 0xA42617BC */ .word 0xA42617BC # sh $a2, 0x17BC($at)
/* 0x00010BBC 0x800807BC 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00010BC0 0x800807C0 0x0C0200EE */ .word 0x0C0200EE # jal 0x800803B8
/* 0x00010BC4 0x800807C4 0xA02296C0 */ .word 0xA02296C0 # sb $v0, -0x6940($at)
/* 0x00010BC8 0x800807C8 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00010BCC 0x800807CC 0xA02096C0 */ .word 0xA02096C0 # sb $zero, -0x6940($at)
/* 0x00010BD0 0x800807D0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00010BD4 0x800807D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00010BD8 0x800807D8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
