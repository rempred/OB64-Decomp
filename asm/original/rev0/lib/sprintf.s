/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x000238B0..0x00023908 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000238B0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
sprintf:
/* function boundary candidate: func_000238B0, size=88, kind=leaf */
func_000238B0:
/* 0x000238B0 0x800934B0 0xAFA50004 */ .word 0xAFA50004 # sw $a1, 0x4($sp)
/* 0x000238B4 0x800934B4 0xAFA60008 */ .word 0xAFA60008 # sw $a2, 0x8($sp)
/* 0x000238B8 0x800934B8 0xAFA7000C */ .word 0xAFA7000C # sw $a3, 0xC($sp)

/* function boundary candidate: func_000238BC, size=76, kind=prologue */
func_000238BC:
/* 0x000238BC 0x800934BC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000238C0 0x800934C0 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x000238C4 0x800934C4 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x000238C8 0x800934C8 0x00A03021 */ .word 0x00A03021 # move $a2, $a1
/* 0x000238CC 0x800934CC 0x3C048009 */ .word 0x3C048009 # lui $a0, 0x8009
/* 0x000238D0 0x800934D0 0x24843508 */ .word 0x24843508 # addiu $a0, $a0, 0x3508
/* 0x000238D4 0x800934D4 0x02002821 */ .word 0x02002821 # move $a1, $s0
/* 0x000238D8 0x800934D8 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x000238DC 0x800934DC 0x0C0266F8 */ .word 0x0C0266F8 # jal 0x80099BE0
/* 0x000238E0 0x800934E0 0x27A70020 */ .word 0x27A70020 # addiu $a3, $sp, 0x20
/* 0x000238E4 0x800934E4 0x00401821 */ .word 0x00401821 # move $v1, $v0
/* 0x000238E8 0x800934E8 0x04600002 */ .word 0x04600002 # bltz $v1, 0x800934F4
/* 0x000238EC 0x800934EC 0x02031021 */ .word 0x02031021 # addu $v0, $s0, $v1
/* 0x000238F0 0x800934F0 0xA0400000 */ .word 0xA0400000 # sb $zero, 0x0($v0)
/* 0x000238F4 0x800934F4 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x000238F8 0x800934F8 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x000238FC 0x800934FC 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00023900 0x80093500 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00023904 0x80093504 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
