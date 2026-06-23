/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FB0D0..0x000FB104 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small prologue addiu sp,-0x18. jr ra @0xFB0FC. */
/* function boundary candidate: func_000FB0D0, size=52, kind=prologue */
func_000FB0D0:
/* 0x000FB0D0 0x8016ACD0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000FB0D4 0x8016ACD4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000FB0D8 0x8016ACD8 0x0C022684 */ .word 0x0C022684 # jal 0x80089A10
/* 0x000FB0DC 0x8016ACDC 0x00000000 */ .word 0x00000000 # nop
/* 0x000FB0E0 0x8016ACE0 0x3C04801B */ .word 0x3C04801B # lui $a0, 0x801B
/* 0x000FB0E4 0x8016ACE4 0x8C843390 */ .word 0x8C843390 # lw $a0, 0x3390($a0)
/* 0x000FB0E8 0x8016ACE8 0x3402FFFE */ .word 0x3402FFFE # ori $v0, $zero, 0xFFFE
/* 0x000FB0EC 0x8016ACEC 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x000FB0F0 0x8016ACF0 0x0C06BB7B */ .word 0x0C06BB7B # jal 0x801AEDEC
/* 0x000FB0F4 0x8016ACF4 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x000FB0F8 0x8016ACF8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000FB0FC 0x8016ACFC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FB100 0x8016AD00 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
