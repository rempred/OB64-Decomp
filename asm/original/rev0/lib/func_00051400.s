/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x00051400..0x00051450 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (digit/atoi parse over a0: lw $a1,0($a0); lbu loop); jr $ra 0x51448. Un-merged from over-merged func_00050F98 [adv-review] */
func_00051400:
/* 0x00051400 0x800C1000 0x8C850000 */ .word 0x8C850000 # lw $a1, 0x0($a0)
/* 0x00051404 0x800C1004 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00051408 0x800C1008 0x1040000F */ .word 0x1040000F # beq $v0, $zero, 0x800C1048
/* 0x0005140C 0x800C100C 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x00051410 0x800C1010 0x24A70001 */ .word 0x24A70001 # addiu $a3, $a1, 0x1
/* 0x00051414 0x800C1014 0xAC870000 */ .word 0xAC870000 # sw $a3, 0x0($a0)
/* 0x00051418 0x800C1018 0x90A30001 */ .word 0x90A30001 # lbu $v1, 0x1($a1)
/* 0x0005141C 0x800C101C 0x2462FFD0 */ .word 0x2462FFD0 # addiu $v0, $v1, -0x30
/* 0x00051420 0x800C1020 0x2C42000A */ .word 0x2C42000A # sltiu $v0, $v0, 0xA
/* 0x00051424 0x800C1024 0x10400008 */ .word 0x10400008 # beq $v0, $zero, 0x800C1048
/* 0x00051428 0x800C1028 0x306300FF */ .word 0x306300FF # andi $v1, $v1, 0x00FF
/* 0x0005142C 0x800C102C 0x00061080 */ .word 0x00061080 # sll $v0, $a2, 2
/* 0x00051430 0x800C1030 0x00461021 */ .word 0x00461021 # addu $v0, $v0, $a2
/* 0x00051434 0x800C1034 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x00051438 0x800C1038 0x2442FFD0 */ .word 0x2442FFD0 # addiu $v0, $v0, -0x30
/* 0x0005143C 0x800C103C 0x00433021 */ .word 0x00433021 # addu $a2, $v0, $v1
/* 0x00051440 0x800C1040 0x1460FFF3 */ .word 0x1460FFF3 # bne $v1, $zero, 0x800C1010
/* 0x00051444 0x800C1044 0x00E02821 */ .word 0x00E02821 # move $a1, $a3
/* 0x00051448 0x800C1048 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005144C 0x800C104C 0x00C01021 */ .word 0x00C01021 # move $v0, $a2
