/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BFEBC..0x000BFEEC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf (parent merged into prior fn). No prologue; move $v1,$zero; lui/addiu builds 0x80196B00 ptr; scans 0x116 records counting nonzero lhu; jr $ra @0xBFEE4 with andi $v0,$v1,0xFFFF in delay slot. */
func_000bfebc:
/* 0x000BFEBC 0x8012FABC 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x000BFEC0 0x8012FAC0 0x3C048019 */ .word 0x3C048019 # lui $a0, 0x8019
/* 0x000BFEC4 0x8012FAC4 0x24846B00 */ .word 0x24846B00 # addiu $a0, $a0, 0x6B00
/* 0x000BFEC8 0x8012FAC8 0x94820000 */ .word 0x94820000 # lhu $v0, 0x0($a0)
/* 0x000BFECC 0x8012FACC 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x8012FAE4
/* 0x000BFED0 0x8012FAD0 0x00000000 */ .word 0x00000000 # nop
/* 0x000BFED4 0x8012FAD4 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x000BFED8 0x8012FAD8 0x28620116 */ .word 0x28620116 # slti $v0, $v1, 0x116
/* 0x000BFEDC 0x8012FADC 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x8012FAC8
/* 0x000BFEE0 0x8012FAE0 0x24840004 */ .word 0x24840004 # addiu $a0, $a0, 0x4
/* 0x000BFEE4 0x8012FAE4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BFEE8 0x8012FAE8 0x3062FFFF */ .word 0x3062FFFF # andi $v0, $v1, 0xFFFF
