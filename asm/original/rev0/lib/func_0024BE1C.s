/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024BE1C..0x0024BE5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded FORWARD: read-before-write preamble at 0x0024BE1C (lui $v0,0x5555/ori 0x5556; andi $a0,0xFF; addiu -0x14; mult $a0,$v0) sets HI consumed by the mfhi in the prologue body. True prologue addiu$sp,-0x18 at 0x0024BE30; jal 0x801C8AC0 then subu; jr$ra@0x0024BE54 + delay addiu$sp,0x18@0x0024BE58. Name==part start. */
func_0024BE1C:
/* 0x0024BE1C 0x802BBA1C 0x3C025555 */ .word 0x3C025555 # lui $v0, 0x5555
/* 0x0024BE20 0x802BBA20 0x34425556 */ .word 0x34425556 # ori $v0, $v0, 0x5556
/* 0x0024BE24 0x802BBA24 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0024BE28 0x802BBA28 0x2484FFEC */ .word 0x2484FFEC # addiu $a0, $a0, -0x14
/* 0x0024BE2C 0x802BBA2C 0x00820018 */ .word 0x00820018 # mult $a0, $v0

/* function boundary candidate: func_0024BE30, size=64, kind=prologue */
func_0024BE30:
/* 0x0024BE30 0x802BBA30 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0024BE34 0x802BBA34 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0024BE38 0x802BBA38 0x000427C3 */ .word 0x000427C3 # sra $a0, $a0, 31
/* 0x0024BE3C 0x802BBA3C 0x00001810 */ .word 0x00001810 # mfhi $v1
/* 0x0024BE40 0x802BBA40 0x00000000 */ .word 0x00000000 # nop
/* 0x0024BE44 0x802BBA44 0x00000000 */ .word 0x00000000 # nop
/* 0x0024BE48 0x802BBA48 0x0C0722B0 */ .word 0x0C0722B0 # jal 0x801C8AC0
/* 0x0024BE4C 0x802BBA4C 0x00642023 */ .word 0x00642023 # subu $a0, $v1, $a0
/* 0x0024BE50 0x802BBA50 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0024BE54 0x802BBA54 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024BE58 0x802BBA58 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
