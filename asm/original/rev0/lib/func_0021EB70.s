/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x0021EB70..0x0021EBBC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Final chunk-33 framed function (addiu $sp,-0x18; saves $s0/$ra). Index math (sll $a1,2; addu $a0), two jal (0x801ADB00, 0x801ADBC0), zeroes fields, then chunk-33 final jr $ra @0x0021EBB4 + delay addiu $sp,0x18 @0x0021EBB8. Ends exactly at 0x0021EBBC. */
/* function boundary candidate: func_0021EB70, size=76, kind=prologue */
func_0021EB70:
/* 0x0021EB70 0x8028E770 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0021EB74 0x8028E774 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x0021EB78 0x8028E778 0x00058080 */ .word 0x00058080 # sll $s0, $a1, 2
/* 0x0021EB7C 0x8028E77C 0x02048021 */ .word 0x02048021 # addu $s0, $s0, $a0
/* 0x0021EB80 0x8028E780 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x0021EB84 0x8028E784 0x0C06B6C0 */ .word 0x0C06B6C0 # jal 0x801ADB00
/* 0x0021EB88 0x8028E788 0x8E040000 */ .word 0x8E040000 # lw $a0, 0x0($s0)
/* 0x0021EB8C 0x8028E78C 0x0C06B6F0 */ .word 0x0C06B6F0 # jal 0x801ADBC0
/* 0x0021EB90 0x8028E790 0x8E04000C */ .word 0x8E04000C # lw $a0, 0xC($s0)
/* 0x0021EB94 0x8028E794 0x8E020000 */ .word 0x8E020000 # lw $v0, 0x0($s0)
/* 0x0021EB98 0x8028E798 0xAC400018 */ .word 0xAC400018 # sw $zero, 0x18($v0)
/* 0x0021EB9C 0x8028E79C 0x8E02000C */ .word 0x8E02000C # lw $v0, 0xC($s0)
/* 0x0021EBA0 0x8028E7A0 0xAC400018 */ .word 0xAC400018 # sw $zero, 0x18($v0)
/* 0x0021EBA4 0x8028E7A4 0xAE000000 */ .word 0xAE000000 # sw $zero, 0x0($s0)
/* 0x0021EBA8 0x8028E7A8 0xAE00000C */ .word 0xAE00000C # sw $zero, 0xC($s0)
/* 0x0021EBAC 0x8028E7AC 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0021EBB0 0x8028E7B0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x0021EBB4 0x8028E7B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021EBB8 0x8028E7B8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
