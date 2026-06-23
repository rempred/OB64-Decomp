/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x00298914..0x00298948 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward: 0x298914 lui $v0,0x8023 / 0x298918 lw $v0,-0x568C($v0) write $v0 which body (addu $a0,$a0,$v0 at 0x298928) reads before writing. True entry 0x298914; framed body addiu$sp,-0x18 at 0x29891C; jr $ra 0x298940 + delay 0x298944. */
func_00298914:
/* 0x00298914 0x80308514 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x00298918 0x80308518 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)

/* function boundary candidate: func_0029891C, size=44, kind=prologue */
func_0029891C:
/* 0x0029891C 0x8030851C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00298920 0x80308520 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x00298924 0x80308524 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00298928 0x80308528 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x0029892C 0x8030852C 0x8C8219B8 */ .word 0x8C8219B8 # lw $v0, 0x19B8($a0)
/* 0x00298930 0x80308530 0x8C44000C */ .word 0x8C44000C # lw $a0, 0xC($v0)
/* 0x00298934 0x80308534 0x0C08EA05 */ .word 0x0C08EA05 # jal 0x8023A814
/* 0x00298938 0x80308538 0x24A5000D */ .word 0x24A5000D # addiu $a1, $a1, 0xD
/* 0x0029893C 0x8030853C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00298940 0x80308540 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00298944 0x80308544 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
