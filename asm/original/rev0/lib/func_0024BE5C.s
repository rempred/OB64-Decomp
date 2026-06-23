/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024BE5C..0x0024BEA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded FORWARD: preamble [0x0024BE5C,0x0024BE70) (lui $v0,0x5555/ori; andi $a0,0xFF; addiu -0x14; mult $v1,$v0) feeds the mfhi at prologue body 0x0024BE7C. True prologue addiu$sp,-0x18 at 0x0024BE70; div-by-3 *15<<1 then jal 0x801C8AA4; jr$ra@0x0024BE98 + delay addiu$sp,0x18@0x0024BE9C. NOTE this part STARTS at 0x0024BE5C; tiling start shown is the prologue word after un-merge — part begins at preamble 0x0024BE5C. */
func_0024BE5C:
/* 0x0024BE5C 0x802BBA5C 0x3C025555 */ .word 0x3C025555 # lui $v0, 0x5555
/* 0x0024BE60 0x802BBA60 0x34425556 */ .word 0x34425556 # ori $v0, $v0, 0x5556
/* 0x0024BE64 0x802BBA64 0x308300FF */ .word 0x308300FF # andi $v1, $a0, 0x00FF
/* 0x0024BE68 0x802BBA68 0x2463FFEC */ .word 0x2463FFEC # addiu $v1, $v1, -0x14
/* 0x0024BE6C 0x802BBA6C 0x00620018 */ .word 0x00620018 # mult $v1, $v0

/* function boundary candidate: func_0024BE70, size=148, kind=prologue */
func_0024BE70:
/* 0x0024BE70 0x802BBA70 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0024BE74 0x802BBA74 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0024BE78 0x802BBA78 0x000317C3 */ .word 0x000317C3 # sra $v0, $v1, 31
/* 0x0024BE7C 0x802BBA7C 0x00002810 */ .word 0x00002810 # mfhi $a1
/* 0x0024BE80 0x802BBA80 0x00A21023 */ .word 0x00A21023 # subu $v0, $a1, $v0
/* 0x0024BE84 0x802BBA84 0x00022040 */ .word 0x00022040 # sll $a0, $v0, 1
/* 0x0024BE88 0x802BBA88 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x0024BE8C 0x802BBA8C 0x0C0722A9 */ .word 0x0C0722A9 # jal 0x801C8AA4
/* 0x0024BE90 0x802BBA90 0x00642023 */ .word 0x00642023 # subu $a0, $v1, $a0
/* 0x0024BE94 0x802BBA94 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0024BE98 0x802BBA98 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024BE9C 0x802BBA9C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
