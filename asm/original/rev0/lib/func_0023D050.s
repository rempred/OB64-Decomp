/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023D050..0x0023D090 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small wrapper (addiu $sp,-0x18): stores $a0 to 0x801F0564/0568, jal 0x801E7318; jr $ra at 0x0023D080 + delay 0x0023D084. Trailing two align nops at 0x0023D088-0x0023D08C attach to the end of this function (next prologue is 4-aligned at 0x0023D090). */
/* function boundary candidate: func_0023D050, size=56, kind=prologue */
func_0023D050:
/* 0x0023D050 0x802ACC50 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0023D054 0x802ACC54 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x0023D058 0x802ACC58 0xAC240564 */ .word 0xAC240564 # sw $a0, 0x564($at)
/* 0x0023D05C 0x802ACC5C 0x248400F8 */ .word 0x248400F8 # addiu $a0, $a0, 0xF8
/* 0x0023D060 0x802ACC60 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x0023D064 0x802ACC64 0xAC240568 */ .word 0xAC240568 # sw $a0, 0x568($at)
/* 0x0023D068 0x802ACC68 0x3C04801E */ .word 0x3C04801E # lui $a0, 0x801E
/* 0x0023D06C 0x802ACC6C 0x24847EA4 */ .word 0x24847EA4 # addiu $a0, $a0, 0x7EA4
/* 0x0023D070 0x802ACC70 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0023D074 0x802ACC74 0x0C079CC6 */ .word 0x0C079CC6 # jal 0x801E7318
/* 0x0023D078 0x802ACC78 0x00000000 */ .word 0x00000000 # nop
/* 0x0023D07C 0x802ACC7C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0023D080 0x802ACC80 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023D084 0x802ACC84 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0023D088 0x802ACC88 0x00000000 */ .word 0x00000000 # nop
/* 0x0023D08C 0x802ACC8C 0x00000000 */ .word 0x00000000 # nop
