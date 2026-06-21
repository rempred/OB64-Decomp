/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00011168..0x000111C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00011168 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00011168:
/* 0x00011168 0x80080D68 0x00000000 */ .word 0x00000000 # nop
/* 0x0001116C 0x80080D6C 0x00000000 */ .word 0x00000000 # nop

/* function boundary candidate: func_00011170, size=80, kind=prologue */
func_00011170:
/* 0x00011170 0x80080D70 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x00011174 0x80080D74 0xAFB00018 */ .word 0xAFB00018 # sw $s0, 0x18($sp)
/* 0x00011178 0x80080D78 0x4600600D */ .word 0x4600600D # trunc.w.s $f0, $f12
/* 0x0001117C 0x80080D7C 0x44100000 */ .word 0x44100000 # mfc1 $s0, $f0
/* 0x00011180 0x80080D80 0xAFBF001C */ .word 0xAFBF001C # sw $ra, 0x1C($sp)
/* 0x00011184 0x80080D84 0x0C0271D4 */ .word 0x0C0271D4 # jal 0x8009C750
/* 0x00011188 0x80080D88 0x27A50010 */ .word 0x27A50010 # addiu $a1, $sp, 0x10
/* 0x0001118C 0x80080D8C 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00011190 0x80080D90 0xD422E400 */ .word 0xD422E400 # ldc1 $f2, -0x1C00($at)
/* 0x00011194 0x80080D94 0x46000021 */ .word 0x46000021 # cvt.d.s $f0, $f0
/* 0x00011198 0x80080D98 0x4620103C */ .word 0x4620103C # c.0xC.d $f2, $f0
/* 0x0001119C 0x80080D9C 0x00000000 */ .word 0x00000000 # nop
/* 0x000111A0 0x80080DA0 0x00000000 */ .word 0x00000000 # nop
/* 0x000111A4 0x80080DA4 0x45030001 */ .word 0x45030001 # bc1tl 0x80080DAC
/* 0x000111A8 0x80080DA8 0x26100001 */ .word 0x26100001 # addiu $s0, $s0, 0x1
/* 0x000111AC 0x80080DAC 0x02001021 */ .word 0x02001021 # move $v0, $s0
/* 0x000111B0 0x80080DB0 0x8FBF001C */ .word 0x8FBF001C # lw $ra, 0x1C($sp)
/* 0x000111B4 0x80080DB4 0x8FB00018 */ .word 0x8FB00018 # lw $s0, 0x18($sp)
/* 0x000111B8 0x80080DB8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000111BC 0x80080DBC 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
