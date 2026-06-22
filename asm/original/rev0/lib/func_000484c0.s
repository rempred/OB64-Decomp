/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000484C0..0x00048510 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged frameless leaf classifier (arg-first: addiu $v1,$a0,-0x2D / andi); jr $ra at 0x48508 + delay 0x4850C move $v0,$a2. [adv-review fix: true entry 0x484C0; 0x484BC was the prev jr delay slot] */
func_000484c0:
/* 0x000484C0 0x800B80C0 0x2483FFD3 */ .word 0x2483FFD3 # addiu $v1, $a0, -0x2D
/* 0x000484C4 0x800B80C4 0x306300FF */ .word 0x306300FF # andi $v1, $v1, 0x00FF
/* 0x000484C8 0x800B80C8 0x2C630002 */ .word 0x2C630002 # sltiu $v1, $v1, 0x2
/* 0x000484CC 0x800B80CC 0x308500FF */ .word 0x308500FF # andi $a1, $a0, 0x00FF
/* 0x000484D0 0x800B80D0 0x38A2002F */ .word 0x38A2002F # xori $v0, $a1, 0x002F
/* 0x000484D4 0x800B80D4 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x000484D8 0x800B80D8 0x00621825 */ .word 0x00621825 # or $v1, $v1, $v0
/* 0x000484DC 0x800B80DC 0x14600009 */ .word 0x14600009 # bne $v1, $zero, 0x800B8104
/* 0x000484E0 0x800B80E0 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x000484E4 0x800B80E4 0x2482FFDC */ .word 0x2482FFDC # addiu $v0, $a0, -0x24
/* 0x000484E8 0x800B80E8 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
/* 0x000484EC 0x800B80EC 0x2C420002 */ .word 0x2C420002 # sltiu $v0, $v0, 0x2
/* 0x000484F0 0x800B80F0 0x38A30030 */ .word 0x38A30030 # xori $v1, $a1, 0x0030
/* 0x000484F4 0x800B80F4 0x2C630001 */ .word 0x2C630001 # sltiu $v1, $v1, 0x1
/* 0x000484F8 0x800B80F8 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x000484FC 0x800B80FC 0x10400002 */ .word 0x10400002 # beq $v0, $zero, 0x800B8108
/* 0x00048500 0x800B8100 0x00000000 */ .word 0x00000000 # nop
/* 0x00048504 0x800B8104 0x24060001 */ .word 0x24060001 # addiu $a2, $zero, 0x1
/* 0x00048508 0x800B8108 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004850C 0x800B810C 0x00C01021 */ .word 0x00C01021 # move $v0, $a2
