/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000147A0..0x000147F8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000147A0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000147a0:
/* 0x000147A0 0x800843A0 0x90A30000 */ .word 0x90A30000 # lbu $v1, 0x0($a1)
/* 0x000147A4 0x800843A4 0x30620080 */ .word 0x30620080 # andi $v0, $v1, 0x0080
/* 0x000147A8 0x800843A8 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800843B8
/* 0x000147AC 0x800843AC 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x000147B0 0x800843B0 0x2402FF00 */ .word 0x2402FF00 # addiu $v0, $zero, -0x100
/* 0x000147B4 0x800843B4 0x00621825 */ .word 0x00621825 # or $v1, $v1, $v0
/* 0x000147B8 0x800843B8 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x000147BC 0x800843BC 0xD422E4D8 */ .word 0xD422E4D8 # ldc1 $f2, -0x1B28($at)
/* 0x000147C0 0x800843C0 0x44830000 */ .word 0x44830000 # mtc1 $v1, $f0
/* 0x000147C4 0x800843C4 0x00000000 */ .word 0x00000000 # nop
/* 0x000147C8 0x800843C8 0x46800020 */ .word 0x46800020 # cvt.s.w $f0, $f0
/* 0x000147CC 0x800843CC 0x46000021 */ .word 0x46000021 # cvt.d.s $f0, $f0
/* 0x000147D0 0x800843D0 0x46220003 */ .word 0x46220003 # div.d $f0, $f0, $f2
/* 0x000147D4 0x800843D4 0xC4840090 */ .word 0xC4840090 # lwc1 $f4, 0x90($a0)
/* 0x000147D8 0x800843D8 0xC4820030 */ .word 0xC4820030 # lwc1 $f2, 0x30($a0)
/* 0x000147DC 0x800843DC 0x46041081 */ .word 0x46041081 # sub.s $f2, $f2, $f4
/* 0x000147E0 0x800843E0 0x46200020 */ .word 0x46200020 # cvt.s.d $f0, $f0
/* 0x000147E4 0x800843E4 0x46001080 */ .word 0x46001080 # add.s $f2, $f2, $f0
/* 0x000147E8 0x800843E8 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x000147EC 0x800843EC 0xE4800090 */ .word 0xE4800090 # swc1 $f0, 0x90($a0)
/* 0x000147F0 0x800843F0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000147F4 0x800843F4 0xE4820030 */ .word 0xE4820030 # swc1 $f2, 0x30($a0)
