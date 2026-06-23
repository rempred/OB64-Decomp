/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020D444..0x0020D490 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (signed div-by-3 magic mult/mfhi loop); jr ra @0x20D488 + delay move @0x20D48C. */
/* 0x0020D444 0x8027D044 0x3C025555 */ .word 0x3C025555 # lui $v0, 0x5555
/* 0x0020D448 0x8027D048 0x34425556 */ .word 0x34425556 # ori $v0, $v0, 0x5556
/* 0x0020D44C 0x8027D04C 0x00A20018 */ .word 0x00A20018 # mult $a1, $v0
/* 0x0020D450 0x8027D050 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0020D454 0x8027D054 0x00052FC3 */ .word 0x00052FC3 # sra $a1, $a1, 31
/* 0x0020D458 0x8027D058 0x00003010 */ .word 0x00003010 # mfhi $a2
/* 0x0020D45C 0x8027D05C 0x00000000 */ .word 0x00000000 # nop
/* 0x0020D460 0x8027D060 0x00000000 */ .word 0x00000000 # nop
/* 0x0020D464 0x8027D064 0x18800004 */ .word 0x18800004 # blez $a0, 0x8027D078
/* 0x0020D468 0x8027D068 0x00C51023 */ .word 0x00C51023 # subu $v0, $a2, $a1
/* 0x0020D46C 0x8027D06C 0x00822023 */ .word 0x00822023 # subu $a0, $a0, $v0
/* 0x0020D470 0x8027D070 0x1C80FFFE */ .word 0x1C80FFFE # bgtz $a0, 0x8027D06C
/* 0x0020D474 0x8027D074 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0020D478 0x8027D078 0x28620004 */ .word 0x28620004 # slti $v0, $v1, 0x4
/* 0x0020D47C 0x8027D07C 0x10400002 */ .word 0x10400002 # beq $v0, $zero, 0x8027D088
/* 0x0020D480 0x8027D080 0x24040003 */ .word 0x24040003 # addiu $a0, $zero, 0x3
/* 0x0020D484 0x8027D084 0x00602021 */ .word 0x00602021 # move $a0, $v1
/* 0x0020D488 0x8027D088 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020D48C 0x8027D08C 0x00801021 */ .word 0x00801021 # move $v0, $a0
