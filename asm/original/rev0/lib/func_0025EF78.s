/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025EF78..0x0025EFC8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x18; sw $ra. Computes vec3 magnitude: sum of squares -> sqrt.s, c.cond.s/bc1t guard with jal 0x800907E0 fallback. jr $ra at 0x0025EFC0 + delay addiu $sp,0x18 at 0x0025EFC4. */
/* function boundary candidate: func_0025EF78, size=80, kind=prologue */
func_0025EF78:
/* 0x0025EF78 0x802CEB78 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0025EF7C 0x802CEB7C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0025EF80 0x802CEB80 0xC4840000 */ .word 0xC4840000 # lwc1 $f4, 0x0($a0)
/* 0x0025EF84 0x802CEB84 0x46042102 */ .word 0x46042102 # mul.s $f4, $f4, $f4
/* 0x0025EF88 0x802CEB88 0xC4820004 */ .word 0xC4820004 # lwc1 $f2, 0x4($a0)
/* 0x0025EF8C 0x802CEB8C 0x46021082 */ .word 0x46021082 # mul.s $f2, $f2, $f2
/* 0x0025EF90 0x802CEB90 0xC4800008 */ .word 0xC4800008 # lwc1 $f0, 0x8($a0)
/* 0x0025EF94 0x802CEB94 0x46000002 */ .word 0x46000002 # mul.s $f0, $f0, $f0
/* 0x0025EF98 0x802CEB98 0x46022100 */ .word 0x46022100 # add.s $f4, $f4, $f2
/* 0x0025EF9C 0x802CEB9C 0x46002300 */ .word 0x46002300 # add.s $f12, $f4, $f0
/* 0x0025EFA0 0x802CEBA0 0x46006004 */ .word 0x46006004 # sqrt.s $f0, $f12
/* 0x0025EFA4 0x802CEBA4 0x46000032 */ .word 0x46000032 # c.0x2.s $f0, $f0
/* 0x0025EFA8 0x802CEBA8 0x00000000 */ .word 0x00000000 # nop
/* 0x0025EFAC 0x802CEBAC 0x45010003 */ .word 0x45010003 # bc1t 0x802CEBBC
/* 0x0025EFB0 0x802CEBB0 0x00000000 */ .word 0x00000000 # nop
/* 0x0025EFB4 0x802CEBB4 0x0C0241F8 */ .word 0x0C0241F8 # jal 0x800907E0
/* 0x0025EFB8 0x802CEBB8 0x00000000 */ .word 0x00000000 # nop
/* 0x0025EFBC 0x802CEBBC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0025EFC0 0x802CEBC0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025EFC4 0x802CEBC4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
