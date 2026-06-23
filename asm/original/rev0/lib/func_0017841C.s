/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x0017841C..0x00178444 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble lui $v0,0x8022 / lbu $v0,-0x726F($v0) @0x17841C-0x178420 (read-before-write) folded forward into addiu $sp,-0x18 prologue @0x178424; beq $v0,$zero @0x178428 reads $v0. jr $ra @0x17843C + delay @0x178440. */
func_0017841C:
/* 0x0017841C 0x801E801C 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x00178420 0x801E8020 0x90428D91 */ .word 0x90428D91 # lbu $v0, -0x726F($v0)

/* function boundary candidate: func_00178424, size=32, kind=prologue */
func_00178424:
/* 0x00178424 0x801E8024 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00178428 0x801E8028 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x801E8038
/* 0x0017842C 0x801E802C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00178430 0x801E8030 0x0C0856BD */ .word 0x0C0856BD # jal 0x80215AF4
/* 0x00178434 0x801E8034 0x00000000 */ .word 0x00000000 # nop
/* 0x00178438 0x801E8038 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0017843C 0x801E803C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00178440 0x801E8040 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
