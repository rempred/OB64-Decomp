/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00263050..0x00263074 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x18 @0x263050; multiple internal jr$ra leaves merged by parent are actually sub-paths of one record ending jr$ra@0x263184+delay@0x263188; trailing alignment nop@0x26318C attaches here. */
/* function boundary candidate: func_00263050, size=316, kind=prologue */
func_00263050:
/* 0x00263050 0x802D2C50 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00263054 0x802D2C54 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00263058 0x802D2C58 0x0C06D571 */ .word 0x0C06D571 # jal 0x801B55C4
/* 0x0026305C 0x802D2C5C 0x00000000 */ .word 0x00000000 # nop
/* 0x00263060 0x802D2C60 0x0C083889 */ .word 0x0C083889 # jal 0x8020E224
/* 0x00263064 0x802D2C64 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x00263068 0x802D2C68 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026306C 0x802D2C6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00263070 0x802D2C70 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
