/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x00155D14..0x00155D58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (starts move $a3,$zero / move $a2,$zero, no addiu $sp). Linear scan over 0x24-stride records; jr $ra 0x00155D50 + delay 0x00155D54. Parent over-merged into prior entry. */
/* 0x00155D14 0x801C5914 0x00003821 */ .word 0x00003821 # move $a3, $zero
/* 0x00155D18 0x801C5918 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x00155D1C 0x801C591C 0x30A500FF */ .word 0x30A500FF # andi $a1, $a1, 0x00FF
/* 0x00155D20 0x801C5920 0x2408FFFF */ .word 0x2408FFFF # addiu $t0, $zero, -0x1
/* 0x00155D24 0x801C5924 0x30C200FF */ .word 0x30C200FF # andi $v0, $a2, 0x00FF
/* 0x00155D28 0x801C5928 0x000218C0 */ .word 0x000218C0 # sll $v1, $v0, 3
/* 0x00155D2C 0x801C592C 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00155D30 0x801C5930 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x00155D34 0x801C5934 0x00831821 */ .word 0x00831821 # addu $v1, $a0, $v1
/* 0x00155D38 0x801C5938 0x8C620008 */ .word 0x8C620008 # lw $v0, 0x8($v1)
/* 0x00155D3C 0x801C593C 0x50450001 */ .word 0x50450001 # beql $v0, $a1, 0x801C5944
/* 0x00155D40 0x801C5940 0x24E70001 */ .word 0x24E70001 # addiu $a3, $a3, 0x1
/* 0x00155D44 0x801C5944 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x00155D48 0x801C5948 0x1448FFF6 */ .word 0x1448FFF6 # bne $v0, $t0, 0x801C5924
/* 0x00155D4C 0x801C594C 0x24C60001 */ .word 0x24C60001 # addiu $a2, $a2, 0x1
/* 0x00155D50 0x801C5950 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00155D54 0x801C5954 0x30E200FF */ .word 0x30E200FF # andi $v0, $a3, 0x00FF
