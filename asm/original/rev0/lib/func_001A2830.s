/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A2830..0x001A286C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* addiu $sp,-0x18. Indexes 0x8022B448 table by ($a0&0xFF)<<2, jal 0x8017C384, clears the slot. Ends jr$ra@0x1A2864 + delay@0x1A2868 (addiu $sp,0x18). */
func_001A2830:
/* function boundary candidate: func_001A2830, size=60, kind=prologue */
func_001A2830:
/* 0x001A2830 0x80212430 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001A2834 0x80212434 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x001A2838 0x80212438 0x309000FF */ .word 0x309000FF # andi $s0, $a0, 0x00FF
/* 0x001A283C 0x8021243C 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x001A2840 0x80212440 0x2442B448 */ .word 0x2442B448 # addiu $v0, $v0, -0x4BB8
/* 0x001A2844 0x80212444 0x00108080 */ .word 0x00108080 # sll $s0, $s0, 2
/* 0x001A2848 0x80212448 0x02028021 */ .word 0x02028021 # addu $s0, $s0, $v0
/* 0x001A284C 0x8021244C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x001A2850 0x80212450 0x0C05F0E1 */ .word 0x0C05F0E1 # jal 0x8017C384
/* 0x001A2854 0x80212454 0x8E040000 */ .word 0x8E040000 # lw $a0, 0x0($s0)
/* 0x001A2858 0x80212458 0xAE000000 */ .word 0xAE000000 # sw $zero, 0x0($s0)
/* 0x001A285C 0x8021245C 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x001A2860 0x80212460 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x001A2864 0x80212464 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001A2868 0x80212468 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
