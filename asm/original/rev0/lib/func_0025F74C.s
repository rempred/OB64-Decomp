/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F74C..0x0025F770 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame -0x18, saves $ra. jal 0x801C8FE8 then jal 0x801C896C(move $a0,$v0). jr$ra at 0x0025F768 + delay addiu$sp. */
/* function boundary candidate: func_0025F74C, size=44, kind=prologue */
func_0025F74C:
/* 0x0025F74C 0x802CF34C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0025F750 0x802CF350 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0025F754 0x802CF354 0x0C0723FA */ .word 0x0C0723FA # jal 0x801C8FE8
/* 0x0025F758 0x802CF358 0x00000000 */ .word 0x00000000 # nop
/* 0x0025F75C 0x802CF35C 0x0C07225B */ .word 0x0C07225B # jal 0x801C896C
/* 0x0025F760 0x802CF360 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x0025F764 0x802CF364 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0025F768 0x802CF368 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F76C 0x802CF36C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
