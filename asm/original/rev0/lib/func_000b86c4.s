/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B86C4..0x000B86F8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf; move $v1,zero / lui $a0,0xF84 entry; jr $ra@0xB86F0+delay; split from parent idx39 */
func_000b86c4:
/* 0x000B86C4 0x801282C4 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x000B86C8 0x801282C8 0x3C048019 */ .word 0x3C048019 # lui $a0, 0x8019
/* 0x000B86CC 0x801282CC 0x24840F84 */ .word 0x24840F84 # addiu $a0, $a0, 0xF84
/* 0x000B86D0 0x801282D0 0x94820000 */ .word 0x94820000 # lhu $v0, 0x0($a0)
/* 0x000B86D4 0x801282D4 0x10400006 */ .word 0x10400006 # beq $v0, $zero, 0x801282F0
/* 0x000B86D8 0x801282D8 0x24620064 */ .word 0x24620064 # addiu $v0, $v1, 0x64
/* 0x000B86DC 0x801282DC 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x000B86E0 0x801282E0 0x28620078 */ .word 0x28620078 # slti $v0, $v1, 0x78
/* 0x000B86E4 0x801282E4 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x801282D0
/* 0x000B86E8 0x801282E8 0x24840002 */ .word 0x24840002 # addiu $a0, $a0, 0x2
/* 0x000B86EC 0x801282EC 0x24620064 */ .word 0x24620064 # addiu $v0, $v1, 0x64
/* 0x000B86F0 0x801282F0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B86F4 0x801282F4 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
